const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

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

function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
  return chromeLauncher.launch({
    chromeFlags: [],
  })
    .then(chrome => {
      flags.port = chrome.port;
      return lighthouse(url, flags, {
        extends: "lighthouse:default",
        settings: {
          onlyCategories: ["performance"],
          output: "html",
          throttling: {
            downloadThroughputKbps: 1000
          },
          emulatedFormFactor: "desktop"
        }
      })
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
