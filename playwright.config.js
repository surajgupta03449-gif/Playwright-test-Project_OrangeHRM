const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",

  globalSetup: require.resolve("./global-setup.js"),

  // Test execution
  timeout: 60000,
  globalTimeout: 60 * 60 * 1000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,

  // Assertions
  expect: {
    timeout: 15000,
  },

  // HTML report and JUnit XML
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],

  // Browser and test evidence
  use: {
    baseURL: process.env.BASE_URL || "https://opensource-demo.orangehrmlive.com",

    ...devices["Desktop Chrome"],

    headless: !!process.env.CI,

    actionTimeout: 15000,
    navigationTimeout: 30000,

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  // Run only Chromium
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
