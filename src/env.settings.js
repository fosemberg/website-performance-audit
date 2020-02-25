module.exports = {
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
  chromeFlags: [
    '--headless', '--disable-gpu', '--no-sandbox', '--disable-software-rasterizer', '--disable-dev-shm-usage'
  ],
  lighthouseConfig: {
    extends: "lighthouse:default",
    settings: {
      onlyCategories: ["performance"],
    }
  },
  tags: [
    {
      name: "device",
      values: [
        {
          name: "mobile",
          lighthouseConfigSettings: {
            emulatedFormFactor: "mobile"
          },
        },
        {
          name: "desktop",
          lighthouseConfigSettings: {
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
          lighthouseConfigSettings: {},
        },
        {
          name: "mobile3G",
          lighthouseConfigSettings: {
            throttling: {
              downloadThroughputKbps: 1000
            }
          },
        }
      ]
    }
  ]
}

// const pages = {
//   "some-site": {
//     "main": "/index.html",
//     "some": "/some.html"
//   },
//   "lk": {
//     "main": "/index.html"
//   }
// }
//
// module.exports = {
//   environment: 'trunk',
//   urls: [
//     {name: 'dev', url: 'http://test.fosemberg.dev.test-ru.dom/index.html'},
//     {name: 'local', url: 'http://localhost:82/index.html'}
//   ]
// };
