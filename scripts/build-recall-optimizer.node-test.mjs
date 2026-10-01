import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { prepareRecallOptimizer } from './build-recall-optimizer.mjs';

const run = promisify(execFile);
test('concurrent preparation preserves vendor files and releases a failed preparation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'study-optimizer-'));
  const source = pathToFileURL(join(root, 'source') + '/');
  const target = pathToFileURL(join(root, 'target') + '/');
  const worker = 'snippets/fixture/src/workerHelpers.js';
  const wasm = Buffer.alloc(2 * 1024 * 1024, 71);
  try {
    await mkdir(new URL('snippets/fixture/src/', source), { recursive: true });
    await writeFile(new URL('fsrs_browser.js', source), 'export const fixture = true;');
    await writeFile(new URL('fsrs_browser_bg.wasm', source), wasm);
    await writeFile(new URL(worker, source), "export const worker = () => import('../../..');");
    const code = `import { prepareRecallOptimizer } from ${JSON.stringify(new URL('./build-recall-optimizer.mjs', import.meta.url).href)}; await prepareRecallOptimizer(new URL(process.argv[1]), new URL(process.argv[2]));`;
    const preparations = await Promise.allSettled(Array.from({ length: 3 }, () => run(process.execPath, ['--input-type=module', '-e', code, source.href, target.href])));
    for (const preparation of preparations) assert.equal(preparation.status, 'fulfilled', preparation.reason?.message);
    assert.deepEqual(await readFile(new URL('fsrs_browser_bg.wasm', target)), wasm);
    assert.equal(await readFile(new URL('fsrs_browser.js', target), 'utf8'), 'export const fixture = true;');
    assert.match(await readFile(new URL(worker, target), 'utf8'), /import\('\.\.\/\.\.\/\.\.\/fsrs_browser\.js'\)/);
    assert.match(await readFile(new URL(worker, source), 'utf8'), /import\('\.\.\/\.\.\/\.\.'\)/);
    await assert.rejects(access(join(root, 'target.lock')), { code: 'ENOENT' });
    await assert.rejects(prepareRecallOptimizer(pathToFileURL(join(root, 'missing') + '/'), target), { code: 'ENOENT' });
    await assert.rejects(access(join(root, 'target.lock')), { code: 'ENOENT' });
    await prepareRecallOptimizer(source, target);
    assert.deepEqual(await readFile(new URL('fsrs_browser_bg.wasm', target)), wasm);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
