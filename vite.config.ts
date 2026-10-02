import { configDefaults, defineConfig } from 'vitest/config';
import { realpathSync } from 'node:fs';
import { localStudyAIPlugin } from './scripts/study-ai-dev.ts';
import react from '@vitejs/plugin-react';
import { localCodeRunnerPlugin } from './scripts/code-runner.mjs';
import { publicAssetsPlugin } from './scripts/public-assets.ts';
import { conceptReadingPackPlugin } from './scripts/concept-reading-pack-plugin.ts';
import { linearSourcePlugin } from './scripts/linear-source-plugin.ts';
export default defineConfig({
  // WebKit #270357 can retain failed modulepreload requests across reloads.
  // Native dynamic imports retain route splitting and permit a fresh retry.
  build: { modulePreload: false, copyPublicDir: false },
  plugins: [react(), localCodeRunnerPlugin(), localStudyAIPlugin(), publicAssetsPlugin(), conceptReadingPackPlugin(), linearSourcePlugin()],
  base: process.env.PAGES_BASE || '/',
  optimizeDeps: { entries: ['index.html'] },
  // Verification copies and generated reports must not reload a live input form.
  server: {
    // The installed runtime can be linked outside this checkout. Permit only
    // that dependency directory alongside the workspace, including worker URLs.
    fs: { allow: ['.', realpathSync(new URL('./node_modules', import.meta.url))] },
    watch: { ignored: ['**/work/**', '**/outputs/**', 'scripts/concept-design.test.mjs'] },
  },
  test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'], css: true,
    exclude: [...configDefaults.exclude, '**/work/**', '**/outputs/**', 'scripts/concept-design.test.mjs'] },
});
