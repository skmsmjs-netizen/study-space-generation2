import { build } from 'esbuild';
import { preview } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const root = process.cwd();
const output = process.env.DEVICE_RUN_DIR ? path.join(process.env.DEVICE_RUN_DIR, 'fixture') : path.join(root, 'work/device-ai-fixture');
const fixtureRequire = createRequire(path.join(root, 'package.json'));
await mkdir(output, { recursive: true });
await build({
  entryPoints: { app: path.join(root, 'e2e/fixtures/study-ai.tsx'), 'api-budget': path.join(root, 'e2e/fixtures/api-budget.tsx'), 'input-ai': path.join(root, 'e2e/fixtures/input-ai.tsx') },
  outdir: output,
  bundle: true,
  format: 'esm',
  splitting: true,
  jsx: 'automatic',
  target: 'es2022',
  nodePaths: [path.join(root, 'node_modules')],
  loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file', '.wasm': 'file', '.bin': 'file' },
  define: { 'import.meta.env.DEV': 'true', 'import.meta.env.PROD': 'false' },
  plugins: [
    {
      name: 'isolated-gpt-client',
      setup(api) {
        // The fixture uses esbuild directly, so preserve Vite's explicit URL imports.
        api.onResolve({ filter: /\?url$/ }, (args) => {
          const source = args.path.slice(0, -4);
          return {
            path: source.startsWith('.')
              ? path.resolve(args.resolveDir, source)
              : fixtureRequire.resolve(source),
            namespace: 'fixture-url-asset',
          };
        });
        api.onLoad({ filter: /.*/, namespace: 'fixture-url-asset' }, async (args) => ({
          contents: await readFile(args.path),
          loader: 'file',
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
await writeFile(path.join(output, 'input-ai.html'), '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>입력 GPT 도움 · 합성 확인</title><link rel="stylesheet" href="input-ai.css"><div id="root"></div><script type="module" src="input-ai.js"></script></html>');
await preview({
  configFile: false,
  build: { outDir: output },
  preview: {
    host: '127.0.0.1',
    port: Number(process.env.DEVICE_FIXTURE_PORT || '5238'),
    strictPort: true,
  },
});
