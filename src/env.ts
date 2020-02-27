import {Env} from './types';

export const env: Env = {
  iterations: 1,
  influxDB: {
    host: 'fosemberg.dev.test-ru.dom',
    port: 8086,
    database: 'lighthouse',
  },
  chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-software-rasterizer', '--disable-dev-shm-usage'],
  lighthouseFlags: {
    onlyCategories: ["performance"],
  },
  environments: [
    {
      name: "trunk",
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
    {
      name: "rc",
      sites: [
        {
          name: "some-site",
          url: "http://test.fosemberg.dev.test-ru.dom/rc/some-site"
        },
        {
          name: "lk",
          url: "http://test.fosemberg.dev.test-ru.dom/rc/lk"
        }
      ]
    }
  ],
  sites: [
    {
      name: "some-site",
      pages: [
        {
          name: "main",
          url: "/index.html"
        },
        {
          name: "pamm",
          url: "/pamm.html"
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
