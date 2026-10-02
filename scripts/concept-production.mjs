import { build } from 'esbuild';
import { openSync, writeFileSync, fsyncSync, closeSync, renameSync } from 'node:fs';
import { readFile, writeFile, rename, mkdir, open, unlink } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
const args = process.argv.slice(2),
  action = args.shift();
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i < 0 ? undefined : args[i + 1];
};
const workspace = option('workspace');
if (!workspace || !['init', 'plan', 'import', 'status', 'backup', 'batch'].includes(action)) {
  console.error(
    '사용법: node scripts/concept-production.mjs init|plan|import|status|backup|batch --workspace 폴더 [--source 원문.json] [--file 결과.json] [--batch 작업ID --status open|paused|closed]',
  );
  process.exit(1);
}
const root = resolve(workspace);
await mkdir(root, { recursive: true });
const lockPath = join(root, '.production.lock');
let lock;
try {
  lock = await open(lockPath, 'wx');
  await lock.writeFile(JSON.stringify({ pid: process.pid, at: new Date().toISOString() }));
} catch {
  throw Error(
    '다른 제작 작업이 열려 있습니다. .production.lock의 프로세스가 종료됐는지 확인한 뒤 잠금 파일을 제거해 주세요. 저장 자료는 변경하지 않았습니다.',
  );
}
try {
  const built = option('runtime')
    ? null
    : await build({
        stdin: {
          contents: `export { emptyState } from './src/domain/model'; export { applyCommand } from './src/domain/commands'; export * from './src/domain/concept-production'; export * from './src/data/concept-production';`,
          resolveDir: process.cwd(),
          loader: 'ts',
        },
        bundle: true,
        platform: 'node',
        format: 'esm',
        write: false,
      });
  const runtime = option('runtime')
    ? resolve(option('runtime'))
    : join(root, '.production-runtime.mjs');
  if (built) await writeFile(runtime, built.outputFiles[0].text);
  const api = await import(pathToFileURL(runtime).href);
  const statePath = join(root, 'workspace.json');
  let state;
  try {
    state = JSON.parse(await readFile(statePath, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    state = api.emptyState('concept-production-local', 'personal');
  }
  const persist = async () => {
    const temporary = `${statePath}.pending`;
    const fd = await open(temporary, 'w');
    try {
      await fd.writeFile(JSON.stringify(state));
      await fd.sync();
    } finally {
      await fd.close();
    }
    await rename(temporary, statePath);
  };
  const ctx = () => ({
    userId: state.userId,
    namespace: state.namespace,
    opId: randomUUID(),
    at: new Date().toISOString(),
  });
  const repository = {
    getSnapshot: () => state,
    execute: (command) => {
      const next = api.applyCommand(state, command);
      const fd = openSync(`${statePath}.pending`, 'w');
      try {
        writeFileSync(fd, JSON.stringify(next));
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      renameSync(`${statePath}.pending`, statePath);
      state = next;
      return next;
    },
  };
  if (action === 'init') {
    if (!option('source')) throw Error('--source 원문.json이 필요합니다.');
    const raw = await readFile(resolve(option('source')), 'utf8');
    await api.importConceptCatalog(repository, raw, resolve(option('source')));
    await persist();
    // Original bytes stay separate and immutable, including annotations, relations and unknown fields.
    const catalog = state.conceptCatalogs.at(-1);
    const originalPath = join(root, `original-${catalog.sha256}.json`);
    try {
      await writeFile(originalPath, raw, { flag: 'wx' });
    } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      if ((await readFile(originalPath, 'utf8')) !== raw)
        throw Error('보관 원문이 다릅니다. 덮어쓰지 않았습니다.');
    }
  }
  const catalog = state.conceptCatalogs?.at(-1);
  if (!catalog) throw Error('먼저 init으로 원문을 등록해 주세요.');
  if (action === 'batch') {
    const batch = state.conceptBatches?.find((b) => b.id === option('batch'));
    const status = option('status');
    if (!batch || !['open', 'paused', 'closed'].includes(status))
      throw Error('--batch 작업ID와 --status open|paused|closed를 확인해 주세요.');
    repository.execute({
      ...ctx(),
      type: 'saveConceptBatch',
      id: batch.id,
      expectedVersion: batch.version,
      content: {
        catalogId: batch.catalogId,
        sourceIds: batch.sourceIds,
        baseVersions: batch.baseVersions,
        status,
      },
    });
  }
  if (action === 'plan') {
    await mkdir(join(root, 'jobs'), { recursive: true });
    while (true) {
      const reserved = new Set(
        (state.conceptBatches ?? [])
          .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')
          .flatMap((b) => b.sourceIds),
      );
      const ids = api
        .parseConceptSource(catalog.raw)
        .items.filter(
          (i) =>
            !reserved.has(i.id) &&
            !state.conceptEditions?.some(
              (e) => e.sourceId === i.id && e.catalogId === catalog.id && e.screen,
            ),
        )
        .map((i) => i.id)
        .slice(0, api.CONCEPT_BATCH_SIZE);
      if (!ids.length) break;
      const { batch } = api.openConceptBatch(repository, catalog, ids);
      await persist();
      await writeFile(
        join(root, 'jobs', `${batch.id.replace(':', '-')}.json`),
        JSON.stringify(api.conceptJobFile(state, batch), null, 2),
      );
    }
    // Recreate missing exports after an interruption, using the same saved batch IDs and starting versions.
    for (const batch of state.conceptBatches ?? [])
      await writeFile(
        join(root, 'jobs', `${batch.id.replace(':', '-')}.json`),
        JSON.stringify(api.conceptJobFile(state, batch), null, 2),
      );
  }
  if (action === 'import') {
    if (!option('file')) throw Error('--file 결과.json이 필요합니다.');
    const raw = await readFile(resolve(option('file')), 'utf8');
    try {
      const result = api.importConceptResults(repository, raw);
      await persist();
      console.log(JSON.stringify({ saved: result.saved, repeated: result.repeated }));
    } catch (e) {
      await persist();
      throw e;
    } // Persist a successful prefix; retry skips it without overwriting later editing.
  }
  if (action === 'backup') {
    if (!option('file')) throw Error('--file 백업.json이 필요합니다.');
    await writeFile(resolve(option('file')), JSON.stringify(state), { flag: 'wx' });
  }
  const editions = (state.conceptEditions ?? []).filter((e) => e.catalogId === catalog.id);
  const originals = api.parseConceptSource(catalog.raw).items;
  const report = {
    total: originals.length,
    sourceSha256: catalog.sha256,
    batches: state.conceptBatches?.length ?? 0,
    typeProposals: originals.filter((i) => api.conceptProposal(i).displayType).length,
    unresolved: originals.filter((i) => !api.conceptProposal(i).displayType).length,
    explanations: editions.filter((e) => e.screen).length,
    reviewed: editions.filter((e) => Object.values(e.checks).every(Boolean)).length,
    published: editions.filter((e) => e.status === 'published').length,
    blocked: editions.filter((e) => e.status === 'blocked').length,
  };
  await writeFile(join(root, 'status.json'), JSON.stringify(report, null, 2));
  await writeFile(
    join(root, 'classification-proposals.json'),
    JSON.stringify(
      originals.map((i) => ({
        id: i.id,
        name: i.name,
        originalType: i.type,
        ...api.conceptProposal(i),
        reviewed: false,
      })),
      null,
      2,
    ),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await lock?.close();
  await unlink(lockPath);
}
