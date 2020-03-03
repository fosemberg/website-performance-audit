import lighthouse from 'lighthouse/lighthouse-core';
import * as chromeLauncher from 'chrome-launcher';
import * as Influx from "influx";
import {env} from "./env"

interface SchemaItem {
  measurement: string,
  score: Influx.FieldType,
}

const url = "https://www.trunk.test-ru.dom/ru/path/some/";

const chromeFlags = [
  // '--headless',
  // '--allow-insecure-localhost',
  // '--ignore-certificate-errors',
  // '--ignore-certificate-errors-spki-list',

  // '--no-sandbox',
  // '--allow-running-insecure-content',
  // '--ignore-urlfetcher-cert-requests',
  // '--disable-gpu',
  // '--disable-software-rasterizer',
  // '--disable-dev-shm-usage',

  '--ignore-certificate-errors',
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-software-rasterizer',
  '--disable-dev-shm-usage',
];
//
// const chromeFlags = env.chromeFlags;
//
const lighthouseFlags = {
  onlyCategories: ["performance"],
  // throttling: {
  //   downloadThroughputKbps: 1000
  // },
  emulatedFormFactor: "desktop",
}
//
// const lighthouseFlags = env.lighthouseFlags;

const schemaItems: Array<SchemaItem> = [
  {measurement: 'first-contentful-paint', score: Influx.FieldType.INTEGER},
  {measurement: 'speed-index', score: Influx.FieldType.INTEGER},
  {measurement: 'interactive', score: Influx.FieldType.INTEGER},
  {measurement: 'first-meaningful-paint', score: Influx.FieldType.INTEGER},
  {measurement: 'first-cpu-idle', score: Influx.FieldType.INTEGER},
];

const audits = schemaItems.map(schemaItem => schemaItem.measurement);

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

(async () => {
  const results = await launchChromeAndRunLighthouse(url, chromeFlags, lighthouseFlags);
  // console.log(results);
  for (let audit of audits) {
    const value = results.audits[audit].rawValue;
    console.log(`${audit}`);
    console.log(`${(value / 1000).toFixed(2)} s`);
  }
})();
