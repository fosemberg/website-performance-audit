import {Env} from './types';

export const env: Env = {
  port: 3001,
  origin: 'http://fosemberg.dev.test-ru.dom',
  backUrl: 'https://fosemberg.dev.test-ru.dom/website-performance-audit-back',
  frontUrl: 'https://fosemberg.dev.test-ru.dom/website-performance-audit-front',
  isServeFrontStatic: true,
  fetchOnFinish: {
    url: 'http://fosemberg.dev.test-ru.dom:3002',
    isFetch: true,
    isAddParams: true,
    description: 'run load test',
  },
  influxDB: {
    host: 'fosemberg.dev.test-ru.dom',
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
          name: "test-site",
          url: "https://www.trunk.test-ru.dom"
        }
      ]
    },
    {
      name: "rc",
      sites: [
        {
          name: "test-site",
          url: "https://www.rc.test-ru.dom"
        },
      ]
    },
  ],
  sites: [
    {
      name: "test-site",
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
            emulatedUserAgent: "mobile",
          },
        },
        {
          name: "desktop",
          lighthouseFlags: {
            emulatedUserAgent: "desktop"
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
