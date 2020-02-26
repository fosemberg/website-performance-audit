import lighthouse from 'lighthouse/lighthouse-core';
import * as chromeLauncher from 'chrome-launcher';

const url = "http://localhost:82";

const flags = {
  chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-software-rasterizer', '--disable-dev-shm-usage'],
  onlyCategories: ['performance'],
};

const config = {

  extends: 'lighthouse:default',
  settings: {
    output: "csv",
    throttling: {
      // dow
    }
  }
}

interface Interface extends LH.Environment {
  soem: string
}

export interface LHFlags extends LH.Flags {
  chromePath: string;
}

function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
  return chromeLauncher.launch({
    chromeFlags: [],
  })
    .then(chrome => {
      flags.port = chrome.port;
      return lighthouse(url,
        {

          port: chrome.port,
          onlyCategories: ["performance"],
          output: "html",
          throttling: {
            downloadThroughputKbps: 1000
          },
          emulatedFormFactor: "desktop"
        }
        , config)
        .then(results =>
          chrome.kill()
            .then(() => results.report)
        );
    });
}

launchChromeAndRunLighthouse(url, flags, config)
  .then(results => {
    console.log(results);
  })
