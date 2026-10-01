import { configDefaults, defineConfig } from 'vitest/config';
import { localStudyAIPlugin } from './scripts/study-ai-dev.ts';
import react from '@vitejs/plugin-react';
import { localCodeRunnerPlugin } from './scripts/code-runner.mjs';
export default defineConfig({
  // WebKit #270357 can retain failed modulepreload requests across reloads.
  // Native dynamic imports retain route splitting and permit a fresh retry.
  build: { modulePreload: false },
  plugins: [react(), localCodeRunnerPlugin(), localStudyAIPlugin()],
  base: process.env.PAGES_BASE || '/',
  // Verification copies and generated reports must not reload a live input form.
  server: { watch: { ignored: ['**/work/**', '**/outputs/**'] } },
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'], css: true, hookTimeout: 60000,
    exclude: [...configDefaults.exclude, '**/work/**', '**/outputs/**'] },
});
