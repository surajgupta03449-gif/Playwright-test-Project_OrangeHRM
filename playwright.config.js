// const { defineConfig, devices } = require('@playwright/test');

// module.exports = defineConfig({
//   testDir: './tests',
//   timeout: 60000,
//   expect: { timeout: 10_000 },
//   globalTimeout: 60 * 60 * 1000,
//   fullyParallel: false,
//   workers: process.env.CI ? 1 : 1,
//   retries: process.env.CI ? 1 : 0,
//   forbidOnly: !!process.env.CI,
//   reporter: process.env.CI
//     ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['junit', { outputFile: 'test-results/results.xml' }]]
//     : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
//   globalSetup: require.resolve('./global-setup.js'),
//   use: {
//     baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
//     headless: process.env.HEADED !== 'true',
//     viewport: { width: 1440, height: 900 },
//     actionTimeout: 15_000,
//     navigationTimeout: 30_000,
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     trace: 'on-first-retry'
//   },
//   projects: [
//     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
//     { name: 'Microsoft Edge', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }
//   ]
// });

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  timeout: 60000,

  expect: {
    timeout: 15000,
  },

  fullyParallel: false,

  workers: 1,

  retries: 1,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "https://opensource-demo.orangehrmlive.com",

    navigationTimeout: 60000,

    actionTimeout: 30000,

    trace: "on",

    screenshot: "on",

    video: "on",

    headless: !process.env.CI,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
