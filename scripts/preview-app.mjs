import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { createDeviceRun } from './device-run.mjs';

const args = process.argv.slice(2);
let source = 'dist';
const forwarded = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--outDir') source = args[++i];
  else if (args[i].startsWith('--outDir=')) source = args[i].slice('--outDir='.length);
  else forwarded.push(args[i]);
}
if (!source) throw Error('--outDir에 완성된 빌드 경로를 지정해 주세요.');
const { run, build } = createDeviceRun(path.resolve(source), path.resolve('work/preview-runs'));
const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve('vite/package.json')), 'bin/vite.js');
console.log(`이 화면은 실행 시점의 빌드를 유지합니다: ${run}`);
const child = spawn(
  process.execPath,
  [cli, 'preview', '--host', '127.0.0.1', ...forwarded, '--outDir', build],
  { stdio: 'inherit' },
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code, signal) => {
  rmSync(build, { recursive: true, force: true });
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
});
