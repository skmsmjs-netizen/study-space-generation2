import { build } from 'esbuild';
import { preview } from 'vite';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const root = process.cwd();
const output = process.env.DEVICE_RUN_DIR ? path.join(process.env.DEVICE_RUN_DIR, 'fixture') : path.join(root, 'work/device-ai-fixture');
const fixtureRequire = createRequire(path.join(root, 'package.json'));
await mkdir(output, { recursive: true });
await build({
  entryPoints: { app: path.join(root, 'e2e/fixtures/study-ai.tsx'), 'api-budget': path.join(root, 'e2e/fixtures/api-budget.tsx') },
  outdir: output,
  bundle: true,
  format: 'esm',
  splitting: true,
  jsx: 'automatic',
  target: 'es2022',
  nodePaths: [path.join(root, 'node_modules')],
  loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.wasm': 'file', '.bin': 'file' },
  define: { 'import.meta.env.DEV': 'true', 'import.meta.env.PROD': 'false', 'import.meta.env.BASE_URL': JSON.stringify('/') },
  plugins: [
    {
      name: 'isolated-gpt-client',
      setup(api) {
        api.onResolve({ filter: /\.mjs\?url$/ }, args => ({
          path: fixtureRequire.resolve(args.path.slice(0, -4)), namespace: 'fixture-url-asset',
        }));
        api.onLoad({ filter: /.*/, namespace: 'fixture-url-asset' }, async args => ({
          contents: await readFile(args.path), loader: 'file',
        }));
        api.onResolve({ filter: /data\/photo-outline(?:\.ts)?$/ }, () => ({ path: path.join(root, 'e2e/fixtures/photo-outline-client.ts') }));
        api.onResolve({ filter: /data\/study-ai(?:\.ts)?$/ }, () => ({
          path: path.join(root, 'e2e/fixtures/study-ai-client.ts'),
        }));
        api.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, (args) => ({
          path: fixtureRequire.resolve(args.path),
        }));
      },
    },
  ],
});
await writeFile(
  path.join(output, 'index.html'),
  '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>합성 기기 검증</title><link rel="stylesheet" href="app.css"><style>main{max-width:1000px;margin:24px auto;padding:24px}</style><div id="root"></div><script type="module" src="app.js"></script></html>',
);
await writeFile(
  path.join(output, 'api-budget.html'),
  '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>API 예산 표시 확인</title><link rel="stylesheet" href="api-budget.css"><style>main{max-width:720px;margin:24px auto;padding:16px}</style><div id="root"></div><script type="module" src="api-budget.js"></script></html>',
);
await preview({
  configFile: false,
  build: { outDir: output },
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.DEVICE_FIXTURE_PORT || '5238'),
    strictPort: true,
  },
});
