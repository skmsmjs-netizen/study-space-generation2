import { defineConfig } from '@playwright/test';
import { deviceEnvironments } from './e2e/devices/environments';
export default defineConfig({ testDir: './tools/code-terminal-ui', testMatch: '*.pw.ts', workers: 1, timeout: 60000, retries: 0,
  reporter: [['list'], ['json', { outputFile: 'work/code-terminal-mobile-results.json' }]], outputDir: 'work/code-terminal-mobile-traces',
  projects: deviceEnvironments, use: { baseURL: 'http://127.0.0.1:5238', locale: 'ko-KR', trace: 'retain-on-failure' },
  webServer: { command: 'npx vite preview --config tools/code-terminal-ui/vite.config.ts --port 5238 --strictPort', url: 'http://127.0.0.1:5238', reuseExistingServer: false },
});
