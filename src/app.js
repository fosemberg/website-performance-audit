const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const Influx = require('influx');

const env = require('./env.settings');

const {chromeFlags, lighthouseFlags, influxDB: influxDBConfig} = env;

const promiseSerial = (funcs, data, cb) =>
  funcs.reduce((promise, func, i, arr) =>
    promise.then(results => func(results[i - 1], data).then(result => {
      cb && cb((i + 1) / arr.length);
      return results.concat(result);
    })), Promise.resolve([]));

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

const tags = [
  'environment',
  'site',
  'page',
  'url',
  'tag',
  'device',
  'throttling',
  'iteration',
];

const schema = schemaItems.map(schemaItem => {
  return {
    measurement: schemaItem.measurement,
    fields: {
      score: schemaItem.score,
      value: Influx.FieldType.FLOAT
    },
    tags,
  };
});

schema.push({
  measurement: 'score',
  fields: {
    score: Influx.FieldType.INTEGER,
    value: Influx.FieldType.FLOAT
  },
  tags,
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

const iterations = 2;

function createTestPage(page, measurements, iterations) {
  return (result, data) => {
    return new Promise((resolve, reject) => {
      (async () => {
        let lastITestIteration;
        for (let i = 1; i <= iterations; i++) {
          console.log(i);
          lastITestIteration = await createTestIteration(page, measurements, i);
        }
        console.log(lastITestIteration)
        resolve();
      })();
    })
  }
}

function createTestIteration(page, measurements, iteration) {
  return new Promise((resolve, reject) => {
    console.log(`Starting test: ${page.name}, iterations: ${iteration}`);

    launchChromeAndRunLighthouse(page.url, chromeFlags, lighthouseFlags)
      .then(results => {
        for (let audit of audits) {
          const score = results.audits[audit].score;
          const value = results.audits[audit].rawValue;
          console.log('audit: ' + audit + ' value: ' + value);

          const measurement = {
            measurement: audit,
            tags: {
              environment: env.environment,
              site: 'some-site',
              page: page.name,
              url: page.url,
              tag: '1.32',
              device: 'desktop',
              throttling: 'off',
              iteration,
            },
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


function doTests() {
  const measurements = [];
  const tests = env.urls.map(url => {
      return createTestPage(url, measurements, iterations)
    }
  );

  promiseSerial(tests, {}, progressCallback)
    .then((results) => {
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
    });
}

doTests();
