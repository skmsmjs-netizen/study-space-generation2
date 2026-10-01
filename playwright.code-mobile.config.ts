import { defineConfig } from '@playwright/test';
import { deviceEnvironments } from './e2e/devices/environments';
export default defineConfig({
  testDir: './e2e',
  testMatch: 'code-mobile.pw.ts',
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  outputDir: process.env.CODE_MOBILE_OUTPUT ?? 'work/code-mobile-results',
  use: {
    baseURL: process.env.CODE_MOBILE_BASE_URL ?? 'http://127.0.0.1:5191',
    trace: 'retain-on-failure',
  },
  projects: deviceEnvironments.map((environment) => ({
    ...environment,
    use: { ...environment.use, browserName: 'webkit' as const },
  })),
});
