import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'code-mobile-online.pw.ts',
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  expect: { timeout: 15_000 },
  outputDir: process.env.CODE_MOBILE_OUTPUT ?? 'work/code-online-results',
  use: {
    baseURL: process.env.CODE_MOBILE_BASE_URL ?? 'http://127.0.0.1:5191',
    browserName: 'webkit',
    actionTimeout: 15_000,
  },
});
