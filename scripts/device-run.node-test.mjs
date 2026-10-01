import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createDeviceRun } from './device-run.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'study-device-run-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const source = path.join(root, 'dist');
  mkdirSync(path.join(source, 'assets'), { recursive: true });
  writeFileSync(
    path.join(source, 'index.html'),
    '<html><body>검사 원본<script src="/assets/app.js"></script></body></html>',
  );
  writeFileSync(path.join(source, 'assets/app.js'), 'console.log("고정 원본");');
  return { root, source, parent: path.join(root, 'runs') };
}

test('a running preview retains its exact entry and assets while the shared build is replaced', async (t) => {
  const { source, parent } = fixture(t);
  const run = createDeviceRun(source, parent);
  const { preview } = await import('vite');
  const server = await preview({
    configFile: false,
    root: run.build,
    build: { outDir: run.build },
    preview: { host: '127.0.0.1', port: 0 },
  });
  t.after(() => new Promise((resolve) => server.httpServer.close(resolve)));
  const base = `http://127.0.0.1:${server.httpServer.address().port}`;
  rmSync(source, { recursive: true });
  mkdirSync(source);
  writeFileSync(path.join(source, 'index.html'), '다른 빌드');
  assert.match(await (await fetch(base + '/')).text(), /검사 원본/);
  const asset = await fetch(base + '/assets/app.js');
  assert.equal(asset.status, 200);
  assert.equal(await asset.text(), 'console.log("고정 원본");');
});

test('simultaneous runs keep independent builds, fixture directories and reports', (t) => {
  const { source, parent } = fixture(t);
  const first = createDeviceRun(source, parent);
  writeFileSync(path.join(first.run, 'results.json'), '첫 실행 결과');
  writeFileSync(path.join(source, 'assets/app.js'), '두 번째 빌드');
  const second = createDeviceRun(source, parent);
  assert.notEqual(first.run, second.run);
  assert.equal(
    readFileSync(path.join(first.build, 'assets/app.js'), 'utf8'),
    'console.log("고정 원본");',
  );
  assert.equal(readFileSync(path.join(second.build, 'assets/app.js'), 'utf8'), '두 번째 빌드');
  assert.equal(readFileSync(path.join(first.run, 'results.json'), 'utf8'), '첫 실행 결과');
});

test('an unfinished build cannot be accepted as a valid snapshot', (t) => {
  const { source, parent } = fixture(t);
  rmSync(path.join(source, 'assets/app.js'));
  assert.throws(() => createDeviceRun(source, parent), /빌드 파일이 빠져/);
  rmSync(path.join(source, 'index.html'));
  assert.throws(() => createDeviceRun(source, parent), /완성된 앱 빌드가 없습니다/);
});
