import { defineConfig } from '@playwright/test';
import { deviceEnvironments } from './e2e/devices/environments';
const base = process.env.PAGES_BASE || '/';
const port = process.env.DEVICE_PORT || '5237';
export default defineConfig({
  testDir: './e2e/devices',
  testMatch: '**/*.pw.ts',
  timeout: 90000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'work/device-report', open: 'never' }],
    ['json', { outputFile: 'work/device-results.json' }],
  ],
  outputDir: 'work/device-traces',
  use: {
    baseURL: `http://127.0.0.1:${port}${base}`,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: deviceEnvironments,
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}${base}`,
    reuseExistingServer: false,
  },
});
