import {Env} from './types';

export const env: Env = {
  iterations: 1,
  influxDB: {
    host: 'fosemberg.dev.test-ru.dom',
    port: 8086,
    database: 'lighthouse',
  },
  chromeFlags: [
    '--ignore-certificate-errors',
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-software-rasterizer',
    '--disable-dev-shm-usage'
  ],
  lighthouseFlags: {
    onlyCategories: ["performance"],
  },
  environments: [
    {
      name: "trunk",
      sites: [
        {
          name: "some-site",
          url: "https://www.trunk.test-ru.dom"
        }
      ]
    },
    {
      name: "rc",
      sites: [
        {
          name: "some-site",
          url: "https://www.rc.test-ru.dom"
        },
      ]
    },
    {
      name: "test",
      sites: [
        {
          name: "some-site",
          url: "http://test.fosemberg.dev.test-ru.dom/trunk/some-site"
        },
        {
          name: "lk",
          url: "http://test.fosemberg.dev.test-ru.dom/trunk/lk"
        }
      ]
    },
  ],
  sites: [
    {
      name: "some-site",
      pages: [
        {
          name: "main",
          url: "/ru/"
        },
        {
          name: "some",
          url: "/ru/path/some/"
        }
      ]
    },
  ],
  tags: [
    {
      name: "device",
      values: [
        {
          name: "mobile",
          lighthouseFlags: {
            emulatedFormFactor: "mobile",
          },
        },
        {
          name: "desktop",
          lighthouseFlags: {
            emulatedFormFactor: "desktop"
          },
        }
      ]
    },
    {
      name: "throttling",
      values: [
        {
          name: "Off",
          lighthouseFlags: {},
        },
        {
          name: "mobile3G",
          lighthouseFlags: {
            throttling: {
              downloadThroughputKbps: 1000
            },
          },
        }
      ]
    }
  ]
};
