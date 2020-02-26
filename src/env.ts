import {Env} from './types';

export const env: Env = {
  // DELETE LEGACY {
  environment: 'trunk',
  urls: [
    {name: 'dev', url: 'http://test.fosemberg.dev.test-ru.dom/index.html'},
    // {name: 'local', url: 'http://localhost:82/index.html'}
  ],
  // DELETE LEGACY }


  // WILL COME FROM API {
  input: {
    environment: "trunk",
    siteName: "some-site",
    siteTag: "1.32",
  },
  // WILL COME FROM API }

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
          url: "http://localhost:82/trunk/some-site"
        },
        {
          name: "lk",
          url: "http://localhost:82/trunk/lk"
        }
      ]
    },
    {
      name: "rc",
      sites: [
        {
          name: "some-site",
          url: "http://localhost:82/rc/some-site"
        },
        {
          name: "lk",
          url: "http://localhost:82/rc/lk"
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
        },
        {
          name: "mobile4G",
          lighthouseFlags: {
            throttling: {
              downloadThroughputKbps: 9000
            },
          },
        }
      ]
    }
  ]
};
