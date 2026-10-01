import { defineConfig } from 'vitest/config';
import { localCodeRunnerPlugin } from './scripts/code-runner.mjs';
import react from '@vitejs/plugin-react';
export default defineConfig({
  // WebKit #270357 can retain failed modulepreload requests across reloads.
  // Native dynamic imports retain route splitting and permit a fresh retry.
  build: { modulePreload: false }, plugins: [react(), localCodeRunnerPlugin()], base: process.env.PAGES_BASE || '/', test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'], css: true } });
