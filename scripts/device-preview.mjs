import { preview } from 'vite';
await preview({
  configFile: false,
  base: process.env.PAGES_BASE || '/',
  build: { outDir: process.env.DEVICE_BUILD_DIR || 'dist' },
  preview: { host: '127.0.0.1', port: Number(process.env.DEVICE_PORT || '5237'), strictPort: true },
});
