import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';
import { deviceEnvironments } from './e2e/devices/environments';
const base = process.env.PAGES_BASE || '/';
const reportRoot = process.env.DEVICE_REPORT_ROOT || 'work';
const port = process.env.DEVICE_PORT || '5237';
const fixturePort = Number(process.env.DEVICE_FIXTURE_PORT || String(Number(port) + 1));
const startFixture = existsSync('src/ui/study-materials.tsx') && !process.env.STUDY_AI_FIXTURE_URL;
if (startFixture) {
  process.env.DEVICE_FIXTURE_PORT = String(fixturePort);
  process.env.STUDY_AI_FIXTURE_URL = `http://127.0.0.1:${fixturePort}/`;
}
export default defineConfig({
  testDir: './e2e/devices',
  testMatch: '**/*.pw.ts',
  timeout: 90000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: `${reportRoot}/device-report`, open: 'never' }],
    ['json', { outputFile: `${reportRoot}/device-results.json` }],
  ],
  outputDir: `${reportRoot}/device-traces`,
  use: {
    baseURL: `http://127.0.0.1:${port}${base}`,
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: deviceEnvironments,
  webServer: [
    {
      command: `npm run preview -- --port ${port} --strictPort`,
      url: `http://127.0.0.1:${port}${base}`,
      reuseExistingServer: false,
    },
    ...(startFixture
      ? [
          {
            command: 'node scripts/device-ai-fixture.mjs',
            url: `http://127.0.0.1:${fixturePort}/`,
            reuseExistingServer: false,
            timeout: 60000,
          },
        ]
      : []),
  ],
});
