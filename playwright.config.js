// @ts-check
const { defineConfig, devices } = require('@playwright/test');

// Load variables from the ".env" file (if it exists) into process.env.
// WHY: keeps URLs and secrets out of the code.
require('dotenv').config({ quiet: true });

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // saucedemo can be slow under load, so give tests and assertions a little extra time.
  timeout: 90 * 1000,
  expect: { timeout: 10 * 1000 },

  // On CI: fail the build if someone left test.only in the code, and retry flaky tests twice.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Few workers locally: Firefox stalls when too many browsers compete for CPU and network.
  workers: process.env.CI ? 1 : 2,

  // "html" makes a clickable report (never auto-opens); "list" prints progress in the terminal.
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Saucedemo marks elements with data-test="...", so getByTestId() should read that attribute.
    testIdAttribute: 'data-test',

    // Debug evidence is only kept when it is useful (saves disk space and time).
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
