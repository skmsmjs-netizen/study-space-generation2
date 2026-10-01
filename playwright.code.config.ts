import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { deviceEnvironments } from './e2e/devices/environments';
const port = process.env.DEVICE_PORT || '5237';
const run = process.env.DEVICE_RUN_DIR || 'work/code-python-js-20261001/browser';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'code-scripting.pw.ts',
  timeout: 60000,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: path.join(run, 'results.json') }]],
  outputDir: path.join(run, 'traces'),
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    locale: 'ko-KR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'Mac-Chromium', use: { ...devices['Desktop Chrome'] } },
    ...deviceEnvironments,
  ],
  webServer: {
    command: 'node scripts/code-device-preview.mjs',
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
