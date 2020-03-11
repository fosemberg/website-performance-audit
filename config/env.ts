import {Env} from './types';

export const env: Env = {
  port: 3000,
  origin: 'http://example.localhost',
  influxDB: {
    host: 'example.localhost',
    port: 8086,
    database: 'lighthouse',
    password    :    'some-pass'
  },
  iterations: 1,
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
          url: "http://example.localhost"
        },
      ]
    },
    {
      name: "test",
      sites: [
        {
          name: "some-site",
          url: "http://example.localhost"
        },
        {
          name: "lk",
          url: "http://example.localhost"
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
          url: "/ru/some/"
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
