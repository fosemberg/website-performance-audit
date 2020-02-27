import lighthouse from 'lighthouse/lighthouse-core';
import * as chromeLauncher from 'chrome-launcher';
import * as Influx from 'influx';
import {IPoint, ISchemaOptions} from 'influx';
import {env} from './env';
import {Site} from "./types";
import {getAllVariantsOfPoses} from "./getAllVariantsOfPoses";
import {getMixedTags} from "./getMixedTags";

const {chromeFlags, lighthouseFlags, influxDB: influxDBConfig, iterations, tags} = env;
const {input: {environment, siteName, siteTag}} = env;

interface SchemaItem {
  measurement: string,
  score: Influx.FieldType,
}

const schemaItems: Array<SchemaItem> = [
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

const schemaItemTags: Array<string> = [
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

const schema: ISchemaOptions[] = schemaItems.map(schemaItem => {
  return {
    measurement: schemaItem.measurement,
    fields: {
      score: schemaItem.score,
      value: Influx.FieldType.FLOAT
    },
    tags: schemaItemTags,
  };
});

schema.push({
  measurement: 'score',
  fields: {
    score: Influx.FieldType.INTEGER,
    value: Influx.FieldType.FLOAT
  },
  tags: schemaItemTags,
});

const influx = new Influx.InfluxDB({
  ...influxDBConfig,
  schema,
});

function launchChromeAndRunLighthouse(url, chromeFlags = [], lighthouseFlags = {}, lighthouseConfig = null) {
  return chromeLauncher.launch({chromeFlags})
    .then(chrome => {
      const {port} = chrome;
      const _lighthouseFlags = {
        ...lighthouseFlags,
        port,
      };
      return lighthouse(url, _lighthouseFlags, lighthouseConfig)
        .then(results =>
          chrome.kill()
            .then(() => results.lhr));
    });
}

const audits = schemaItems.map(schemaItem => schemaItem.measurement);

async function createTestSite(environment: string, siteName: string, siteTag: string): Promise<Array<IPoint>> {

  let siteUrl: string = '';
  for (const environmentObj of env.environments) {
    if (environmentObj.name === environment) {
      for (const environmentSite of environmentObj.sites) {
        if (environmentSite.name === siteName) {
          siteUrl = environmentSite.url;
          break;
        }
      }
    }
  }

  let pages: Array<Site> = [];
  for (const siteWithPages of env.sites) {
    if (siteWithPages.name === siteName) {
      pages = siteWithPages.pages;
      break;
    }
  }

  const mixedTags = getMixedTags(tags);
  console.log(mixedTags);

  const points: Array<IPoint> = [];
  const modTagNames = tags.map(tag => tag.name);

  for (const page of pages) {
    for (const mixedTag of mixedTags) {
      for (let iteration = 1; iteration <= iterations; iteration++) {
        const pageUrl = `${siteUrl}${page.url}`;
        const pageName = page.name;
        console.log('');
        console.log('iteration', iteration);
        console.log('environment:', environment);
        console.log('siteName:', siteName);
        console.log('siteUrl:', siteUrl);
        console.log('siteTag:', siteTag);
        console.log('pageName:', pageName);
        console.log('pageUrl:', pageUrl);
        console.log('tags:', mixedTag.tags);
        console.log('lighthouseFlags:', mixedTag.lighthouseFlags);


        // const iterationMeasurements = await createTestIteration(
        //   {
        //     environment,
        //     site: siteName,
        //     tag: siteTag,
        //     page: url.name,
        //     url: url.url,
        //     device: 'desktop',
        //     throttling: 'off',
        //     iteration: i,
        //   },
        //   chromeFlags,
        //   lighthouseFlags
        // );
        // points.push(...iterationMeasurements);
      }
    }
  }
  console.log('');

  return points;
}

function createTestIteration(tags, chromeFlags, lighthouseFlags): Promise<Array<IPoint>> {
  return new Promise((resolve, reject) => {
    console.log(`Starting test: ${tags.url}, iterations: ${tags.iteration}`);

    launchChromeAndRunLighthouse(tags.url, chromeFlags, lighthouseFlags)
      .then(results => {
        const measurements: Array<IPoint> = [];
        for (let audit of audits) {
          const score = results.audits[audit].score;
          const value = results.audits[audit].rawValue;
          console.log('audit: ' + audit + ' value: ' + value);

          const measurement: IPoint = {
            measurement: audit,
            tags,
            fields: {
              score: score,
              value: value
            }
          };
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
  const points: Array<IPoint> = await createTestSite(environment, siteName, siteTag);

  console.log('doTest() measurements = ', JSON.stringify(points));

  console.log('Writing results');

  // influx.getDatabaseNames()
  //   .then(names => {
  //     if (!names.includes('lighthouse')) {
  //       influx.createDatabase('lighthouse');
  //       return influx.createRetentionPolicy('lighthouse', {
  //         duration: '30d',
  //         database: 'lighthouse',
  //         replication: 1,
  //         isDefault: true
  //       })
  //
  //     }
  //   })
  //   .then(() => {
  //     influx.writePoints(points)
  //       .then(() => {
  //         console.log('Tests are done');
  //       });
  //   });
}

doTests();
