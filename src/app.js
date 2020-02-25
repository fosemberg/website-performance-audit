const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const Influx = require('influx');

const env = require('./env.settings');

const {chromeFlags, lighthouseFlags, influxDB: influxDBConfig, iterations, tags} = env;
const {input: {environment, siteName, siteTag}} = env;

const schemaItems = [
  {measurement: 'first-contentful-paint', score: Influx.FieldType.INTEGER},
  {measurement: 'first-cpu-idle', score: Influx.FieldType.INTEGER},
  {measurement: 'first-meaningful-paint', score: Influx.FieldType.INTEGER},
  {measurement: 'speed-index', score: Influx.FieldType.INTEGER},
  {measurement: 'estimated-input-latency', score: Influx.FieldType.INTEGER},
  {measurement: 'time-to-first-byte', score: Influx.FieldType.INTEGER},
  {measurement: 'interactive', score: Influx.FieldType.INTEGER},
  {measurement: 'mainthread-work-breakdown', score: Influx.FieldType.INTEGER},
  {measurement: 'bootup-time', score: Influx.FieldType.INTEGER},
  {measurement: 'total-byte-weight', score: Influx.FieldType.INTEGER},
  {measurement: 'uses-responsive-images', score: Influx.FieldType.INTEGER},
  {measurement: 'dom-size', score: Influx.FieldType.INTEGER},
  {measurement: 'render-blocking-resources', score: Influx.FieldType.INTEGER}
];

const schemaItemTags = [
  'environment',
  'site',
  'page',
  'url',
  'tag',
  'iteration',
  'device',
  'throttling',
  ...tags.map(tag => tag.name)
];

const schema = schemaItems.map(schemaItem => {
  return {
    measurement: schemaItem.measurement,
    fields: {
      score: schemaItem.score,
      value: Influx.FieldType.FLOAT
    },
    schemaItemTags,
  };
});

schema.push({
  measurement: 'score',
  fields: {
    score: Influx.FieldType.INTEGER,
    value: Influx.FieldType.FLOAT
  },
  schemaItemTags,
});

const influx = new Influx.InfluxDB({
  ...influxDBConfig,
  schema,
});

function launchChromeAndRunLighthouse(url, chromeFlags = {}, lighthouseFlags = {}, lighthouseConfig = null) {
  return chromeLauncher.launch({chromeFlags})
    .then(chrome => {
      const {port} = chrome;
      const _lighthouseFlags = {
        ...lighthouseFlags,
        port,
      }
      return lighthouse(url, _lighthouseFlags, lighthouseConfig)
        .then(results =>
          chrome.kill()
            .then(() => results.lhr));
    });
}

const audits = schemaItems.map(schemaItem => schemaItem.measurement);

async function createTestSite(page, iterations) {
  const measurements = [];

  modTagNames = tags.map(tag => tag.name);

  for (const tag of tags) {
    for (let i = 1; i <= iterations; i++) {
      console.log(i);
      const iterationMeasurements = await createTestIteration(
        {
          environment,
          site: siteName,
          tag: siteTag,
          page: page.name,
          url: page.url,
          device: 'desktop',
          throttling: 'off',
          iteration: i,
        },
        chromeFlags,
        lighthouseFlags
      );
      measurements.push(...iterationMeasurements);
    }
  }

  return measurements;
}

// tags
// environment: env.environment,
// site: 'some-site',
// page: page.name,
// url: page.url,
// tag: '1.32',
// device: 'desktop',
// throttling: 'off',
// iteration,

function createTestIteration(tags, chromeFlags, lighthouseFlags) {
  return new Promise((resolve, reject) => {
    console.log(`Starting test: ${tags.url}, iterations: ${tags.iteration}`);

    launchChromeAndRunLighthouse(tags.url, chromeFlags, lighthouseFlags)
      .then(results => {
        const measurements = [];
        for (let audit of audits) {
          const score = results.audits[audit].score;
          const value = results.audits[audit].rawValue;
          console.log('audit: ' + audit + ' value: ' + value);

          const measurement = {
            measurement: audit,
            tags,
            fields: {
              score: score,
              value: value
            }
          }
          measurements.push(measurement);
        }
        resolve(measurements);
      });
  });
}

function progressCallback(progress) {
  console.log(`Total progress: ${progress * 100}%`);
}


async function doTests() {
  const measurements = [];

  for (const url of env.urls) {
    const measurementPack = await createTestSite(url, iterations);
    measurements.push(...measurementPack);
  }

  console.log('doTest() measurements = ', JSON.stringify(measurements));

  console.log('Writing results');

  influx.getDatabaseNames()
    .then(names => {
      if (!names.includes('lighthouse')) {
        influx.createDatabase('lighthouse');
        return influx.createRetentionPolicy('lighthouse', {
          duration: '30d',
          database: 'lighthouse',
          replication: 1,
          isDefault: true
        })

      }
    })
    .then(() => {
      influx.writePoints(measurements)
        .then(() => {
          console.log('Tests are done');
        });
    });
}

doTests();
