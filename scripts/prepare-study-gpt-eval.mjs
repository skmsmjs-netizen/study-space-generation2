import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

// Reuse the project's bundler so domain imports work without a second TS runtime.
const result = await build({
  entryPoints: [fileURLToPath(new URL('./prepare-study-gpt-eval.ts', import.meta.url))],
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  target: 'es2022',
});
await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].contents).toString('base64')}`
);
