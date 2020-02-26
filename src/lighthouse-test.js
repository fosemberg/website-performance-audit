"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lighthouse_core_1 = require("lighthouse/lighthouse-core");
const chromeLauncher = require("chrome-launcher");
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
};
function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
    return chromeLauncher.launch({
        chromeFlags: [],
    })
        .then(chrome => {
        flags.port = chrome.port;
        return lighthouse_core_1.default(url, {
            port: chrome.port,
            onlyCategories: ["performance"],
            output: "html",
            throttling: {
                downloadThroughputKbps: 1000
            },
            emulatedFormFactor: "desktop"
        }, config)
            .then(results => chrome.kill()
            .then(() => results.report));
    });
}
// @ts-ignore
launchChromeAndRunLighthouse(url, flags, config)
    .then(results => {
    console.log(results);
});
