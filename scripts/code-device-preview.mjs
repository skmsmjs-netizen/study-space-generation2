import { preview } from 'vite';
// Mac-only terminal checks use the real adapter and an immutable test build.
await preview({
  build: { outDir: process.env.DEVICE_BUILD_DIR || 'dist' },
  preview: { host: '127.0.0.1', port: Number(process.env.DEVICE_PORT || '5237'), strictPort: true },
});
