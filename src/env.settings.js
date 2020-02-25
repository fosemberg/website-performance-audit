module.exports = {
  // DELETE LEGACY {
  environment: 'trunk',
  urls: [
    {name: 'dev', url: 'http://test.fosemberg.dev.test-ru.dom/index.html'},
    // {name: 'local', url: 'http://localhost:82/index.html'}
  ],
  // DELETE LEGACY }


  influxDB: {
    host: 'fosemberg.dev.test-ru.dom',
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
          name: "some",
          url: "/some.html"
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
            emulatedFormFactor: "mobile"
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
            }
          },
        }
      ]
    }
  ]
};
