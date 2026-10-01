import { defineConfig } from 'vitest/config';
import { localCodeRunnerPlugin } from './scripts/code-runner.mjs';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react(), localCodeRunnerPlugin()], base: process.env.PAGES_BASE || '/', test: { environment: 'jsdom', setupFiles: ['./src/test-setup.ts'], css: true } });
