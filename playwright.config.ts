import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const ciEnv = process.env.CI === 'true' ? true : false;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!ciEnv,
  /* Retry on CI only */
  retries: ciEnv ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: ciEnv ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: ciEnv ? 'http://localhost:3000/' : 'https://dev.crowd.bible',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      timeout: 500 * 1000,
    },

    /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
 */
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: ciEnv ? 'npm run start' : '',
    url: ciEnv ? 'http://localhost:3000/' : 'https://dev.crowd.bible',
    reuseExistingServer: !ciEnv,
    timeout: 300 * 1000,
    env: {
      REACT_APP_CPG_SERVER_URL: 'http://localhost:8201',
      REACT_APP_KEYCLOAK_URL: 'http://localhost:8080',
      REACT_APP_KEYCLOAK_REALM: 'showcase',
      REACT_APP_KEYCLOAK_CLIENT_ID: 'showcase-auth',
      REACT_APP_KEYCLOAK_CLIENT_SECRET: 'eXqrcJ2mHLwLaZCXoUlBFcUiYFdY6cCu',
    },
  },
});
