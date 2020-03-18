import lighthouse from 'lighthouse/lighthouse-core';
import * as chromeLauncher from 'chrome-launcher';
import * as Influx from 'influx';
import {IPoint, ISchemaOptions} from 'influx';
import {env} from '../../config/env';
import {Input, ExternalInput, Site} from "../../config/types";
import {getMixedTags} from "./getMixedTags";
import {sendProgress} from "./sendProgress";
import {createInfluxDatabaseIfNotExist} from "./createInfluxDatabaseIfNotExist";
import {checkValidExternalInput} from "../utils/envParser";

const {chromeFlags, influxDB: influxDBConfig} = env;
const {database: databaseName} = influxDBConfig;

interface SchemaItem {
  measurement: string,
  score: Influx.FieldType,
}

const calcMean = (numbers) => numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
const day = 1000 * 60 * 60 * 24;

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
  ...env.tags.map(tag => tag.name)
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

async function launchChromeAndRunLighthouse(url, chromeFlags: Array<string> = [], lighthouseFlags = {}, lighthouseConfig: any = null) {
  const chrome = await chromeLauncher.launch({chromeFlags});
  const {port} = chrome;
  const _lighthouseFlags = {
    ...lighthouseFlags,
    port,
  };
  const results = await lighthouse(
    url,
    _lighthouseFlags,
    lighthouseConfig
  );
  await chrome.kill();
  return results.lhr;
}

const audits = schemaItems.map(schemaItem => schemaItem.measurement);

async function createTestSite(input: Input): Promise<Array<IPoint>> {
  const {environment, siteName, siteTag, iterations} = input;

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

  const mixedTags = getMixedTags(env.tags);
  console.log(mixedTags);

  const points: Array<IPoint> = [];

  const testCount = pages.length * mixedTags.length * iterations;
  let progressCount = 0;
  let progressMilliseconds = day;
  const spendTimes: Array<number> = [];
  sendProgress({...input, progressPercent: progressCount, progressMilliseconds}).then();

  for (const page of pages) {
    for (const mixedTag of mixedTags) {
      for (let iteration = 1; iteration <= iterations; iteration++) {
        const pageUrl = `${siteUrl}${page.url}`;
        const pageName = page.name;
        const lighthouseFlags = {
          ...env.lighthouseFlags,
          ...mixedTag.lighthouseFlags
        };
        console.log('');
        console.log('iteration', iteration);
        console.log('environment:', environment);
        console.log('siteName:', siteName);
        console.log('siteUrl:', siteUrl);
        console.log('siteTag:', siteTag);
        console.log('pageName:', pageName);
        console.log('pageUrl:', pageUrl);
        console.log('tags:', mixedTag.tags);
        console.log('chromeFlags:', chromeFlags);
        console.log('lighthouseFlags:', lighthouseFlags);

        const startTime = new Date().getTime();
        const iterationMeasurements = await createTestIteration(
          {
            environment,
            site: siteName,
            tag: siteTag,
            page: pageName,
            url: pageUrl,
            ...mixedTag.tags,
            iteration,
          },
          chromeFlags,
          lighthouseFlags
        );
        const endTime = new Date().getTime();
        points.push(...iterationMeasurements);
        spendTimes.push(endTime - startTime);
        const meanSpendTime = Math.round(calcMean(spendTimes));
        progressCount++;

        console.log('spendTimes', spendTimes);
        console.log('meanSpendTime', meanSpendTime);
        console.log('testCount', testCount);
        console.log('progressCount', progressCount);
        console.log('meanSpendTime * (testCount - progressCount)', meanSpendTime * (testCount - progressCount));

        sendProgress({
          ...input,
          progressPercent: progressCount / testCount * 100,
          progressMilliseconds: meanSpendTime * (testCount - progressCount),
        }).then();
      }
    }
  }
  console.log('');

  return points;
}

async function createTestIteration(tags, chromeFlags, lighthouseFlags): Promise<Array<IPoint>> {
  console.log(`Starting test: ${tags.url}, iteration: ${tags.iteration}`);

  const results = await launchChromeAndRunLighthouse(tags.url, chromeFlags, lighthouseFlags);
  const measurements: Array<IPoint> = [];
  for (let audit of audits) {
    const score = results.audits[audit].score;
    let value = results.audits[audit].rawValue;
    // по хорошему null быть не должно
    if (value === null) {
      value = -1;
    }
    console.log('audit: ' + audit + ' value: ' + value);

    const measurement: IPoint = {
      measurement: audit,
      tags,
      fields: {
        score,
        value,
      }
    };
    measurements.push(measurement);
  }
  return measurements;
}

function progressCallback(progress) {
  console.log(`Total progress: ${progress * 100}%`);
}

export async function measureSiteSpeed(
  {
    env: environment,
    site: siteName,
    tag: siteTag,
    iterations = env.iterations
  }: ExternalInput
): Promise<Array<IPoint>> {
  checkValidExternalInput({
    env: environment,
    site: siteName,
    tag: siteTag,
    iterations
  })

  const points: Array<IPoint> = await createTestSite({environment, siteName, siteTag, iterations});

  console.log('Metrics for sending to influxdb:');
  console.log(JSON.stringify(points));
  console.log('Writing results...');

  await createInfluxDatabaseIfNotExist(influx, databaseName);
  await influx.writePoints(points);
  console.info('Tests are done');
  return points;
}
