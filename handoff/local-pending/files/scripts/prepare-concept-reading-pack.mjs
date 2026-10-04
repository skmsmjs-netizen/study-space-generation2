/**
 * Reproducible, local-only reading asset from the reviewed canonical ledger.
 * Reuses domain validation; never imports the ledger into a user account.
 * Run: node scripts/prepare-concept-reading-pack.mjs [--check]
 * A later approved edition must explicitly supply --expected-canonical-sha256.
 */
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, mkdir, open, rename, unlink } from 'node:fs/promises';
import { basename, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspace = resolve(project, '..');
const sourcePath = resolve(workspace, 'outputs/20261001-concept-all/workspace.json');
const assetPath = resolve(project, 'src/data/concept-reading-pack.json');
const reportPath = resolve(project, 'work/concept-live-20261003/pack-verification.json');
const approvedCanonicalSha = 'cfacabdcaae36c7104ce1d9521850274a0da2c4f4e2f3f751d658f2e8f2ecc5f';
const approvedSourceSha = '211d3efdd5eda68fded2bba309d209c3d1821baf385f1b8354b2c4a0195b12f0';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const encode = value => JSON.stringify(value);
const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const shaIndex = args.indexOf('--expected-canonical-sha256');
const expectedCanonicalSha = shaIndex < 0 ? approvedCanonicalSha : args[shaIndex + 1];
assert.match(expectedCanonicalSha ?? '', /^[a-f0-9]{64}$/, '정본의 예상 SHA256을 확인해 주세요.');
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--check') continue;
  if (args[i] === '--expected-canonical-sha256') { i++; continue; }
  throw Error(`알 수 없는 옵션: ${args[i]}`);
}

// Like scripts/concept-production.mjs, load the existing TypeScript domain with
// esbuild. Keep the executable bundle in memory rather than creating a new engine.
const bundle = await build({
  absWorkingDir: project,
  stdin: {
    contents: "export { parseConceptSource, validateConceptCatalog, validateConceptEdition, conceptEditionId, conceptContent } from './src/domain/concept-production';",
    resolveDir: project,
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  metafile: true,
});
const api = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const validatorFiles = await Promise.all(
  Object.keys(bundle.metafile.inputs).filter(path => path !== '<stdin>').sort().map(async path => ({
    path, sha256: sha256(await readFile(resolve(project, path))),
  })),
);

function extract(state, canonicalSha256) {
  assert.equal(state.conceptCatalogs?.length, 1, '원문 카탈로그가 정확히 하나여야 합니다.');
  const originalCatalog = state.conceptCatalogs[0];
  assert.equal(originalCatalog.deletedAt, null, '삭제된 원문은 묶음으로 만들 수 없습니다.');
  assert.equal(originalCatalog.userId, state.userId, '다른 소유자의 원문 카탈로그입니다.');
  assert.equal(originalCatalog.namespace, state.namespace, '다른 공간의 원문 카탈로그입니다.');
  api.validateConceptCatalog(originalCatalog);
  assert.equal(sha256(originalCatalog.raw), originalCatalog.sha256, '보관 원문 SHA256 불일치');
  assert.equal(originalCatalog.sha256, approvedSourceSha, '승인된 개념 원문과 다릅니다.');
  assert.equal(originalCatalog.id, `concept-catalog:${originalCatalog.sha256}`, '카탈로그 ID 불일치');
  const originals = api.parseConceptSource(originalCatalog.raw).items;
  assert.equal(originals.length, 1168, '개념 원문이 일부만 있습니다.');
  assert.equal(state.conceptEditions?.length, 1168, '최신 판본이 일부만 있습니다.');
  const latest = new Map(state.conceptEditions.map(edition => [edition.sourceId, edition]));
  assert.equal(latest.size, 1168, '최신 판본의 원문 ID가 중복됩니다.');
  const catalog = Object.fromEntries(['id', 'raw', 'sha256', 'filename'].map(key => [key, originalCatalog[key]]));
  // The source contents and IDs stay exact; a local filesystem directory is not
  // part of the reading material and must not appear in the app's bundle.
  catalog.filename = basename(catalog.filename.replaceAll('\\', '/'));
  const editions = originals.map(original => {
    const edition = latest.get(original.id);
    assert(edition, `최신 판본 누락: ${original.id}`);
    assert.equal(edition.catalogId, catalog.id, `다른 원문 카탈로그: ${original.id}`);
    assert.equal(edition.id, api.conceptEditionId(catalog.id, original.id), `판본 ID 불일치: ${original.id}`);
    assert.equal(edition.deletedAt, null, `삭제된 판본: ${original.id}`);
    assert.equal(edition.status, 'published', `읽기용 등록이 끝나지 않은 판본: ${original.id}`);
    assert(Number.isSafeInteger(edition.version) && edition.version > 0, `판본 번호 오류: ${original.id}`);
    assert.equal(edition.userId, state.userId, `다른 소유자의 판본: ${original.id}`);
    assert.equal(edition.namespace, state.namespace, `다른 공간의 판본: ${original.id}`);
    api.validateConceptEdition(edition);
    assert.equal(edition.screen?.design?.sourceSha256, catalog.sha256, `화면 원문 SHA256 불일치: ${original.id}`);
    // Allow-list the complete edition content and stable publication metadata.
    // Account identity, operations, revision snapshots and study collections never
    // enter the asset. The catalog retains only the source filename, not its path.
    return {
      ...api.conceptContent(edition),
      id: edition.id,
      version: edition.version,
      createdAt: edition.createdAt,
      updatedAt: edition.updatedAt,
      deletedAt: edition.deletedAt,
    };
  });
  assert.equal(editions.reduce((count, edition) => count + edition.screen.scenes.length, 0), 1851, '장면 수 불일치');
  const payload = { catalog, editions };
  return {
    format: 'concept-reading-pack',
    version: 1,
    sourceSha256: catalog.sha256,
    canonicalSha256,
    payloadSha256: sha256(encode(payload)),
    ...payload,
  };
}

function verify(pack, state, canonicalSha256) {
  assert.deepEqual(Object.keys(pack).sort(), ['format', 'version', 'sourceSha256', 'canonicalSha256', 'payloadSha256', 'catalog', 'editions'].sort());
  assert.equal(pack.format, 'concept-reading-pack');
  assert.equal(pack.version, 1);
  assert.equal(pack.canonicalSha256, canonicalSha256);
  assert.equal(pack.sourceSha256, sha256(pack.catalog.raw));
  assert.equal(pack.payloadSha256, sha256(encode({ catalog: pack.catalog, editions: pack.editions })));
  api.validateConceptCatalog(pack.catalog);
  assert.deepEqual(pack, extract(state, canonicalSha256), '정본 추출 결과와 저장 묶음이 다릅니다.');
  const latest = new Map(state.conceptEditions.map(edition => [edition.sourceId, edition]));
  const originals = api.parseConceptSource(pack.catalog.raw).items;
  assert.deepEqual(pack.editions.map(edition => edition.sourceId), originals.map(original => original.id));
  return pack.editions.map((edition, index) => {
    api.validateConceptEdition(edition);
    assert.equal('userId' in edition, false);
    assert.equal('namespace' in edition, false);
    assert.equal(encode(api.conceptContent(edition)), encode(api.conceptContent(latest.get(edition.sourceId))), `판본 본문 변경: ${edition.sourceId}`);
    return {
      sourceId: edition.sourceId,
      editionId: edition.id,
      editionVersion: edition.version,
      originalSha256: sha256(encode(originals[index])),
      contentSha256: sha256(encode(api.conceptContent(edition))),
      screenSha256: sha256(encode(edition.screen)),
      scenes: edition.screen.scenes.length,
      validated: true,
    };
  });
}

async function atomicWrite(path, bytes) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.pending`;
  try {
    const handle = await open(temporary, 'wx');
    try {
      await handle.writeFile(bytes);
      await handle.sync();
    } finally { await handle.close(); }
    await rename(temporary, path);
    const directory = await open(dirname(path), 'r');
    try { await directory.sync(); } finally { await directory.close(); }
  } finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
}

const sourceBytes = await readFile(sourcePath);
const canonicalSha256 = sha256(sourceBytes);
assert.equal(canonicalSha256, expectedCanonicalSha, '정본이 변경됐습니다. 검토된 SHA256을 명시하기 전에는 기존 묶음을 바꾸지 않습니다.');
const state = JSON.parse(sourceBytes);
const pack = extract(state, canonicalSha256);
const bytes = `${encode(pack)}\n`;
const bindings = verify(JSON.parse(bytes), state, canonicalSha256);
assert.equal(bytes, `${encode(extract(state, canonicalSha256))}\n`, '반복 생성 결과 불일치');

// Reject the failure modes relevant to a complete published reading collection.
const rejectionChecks = {};
function rejects(name, mutate, expectedError) {
  const candidate = { ...state, conceptCatalogs: state.conceptCatalogs.map(row => ({ ...row })), conceptEditions: state.conceptEditions.map(row => ({ ...row })) };
  mutate(candidate);
  assert.throws(() => extract(candidate, canonicalSha256), expectedError, name);
  rejectionChecks[name] = true;
}
rejects('changedOriginalHash', value => { value.conceptCatalogs[0].raw += ' '; }, /보관 원문 SHA256 불일치/);
rejects('missingEdition', value => { value.conceptEditions.pop(); }, /최신 판본이 일부/);
rejects('duplicateSourceId', value => { value.conceptEditions[1].sourceId = value.conceptEditions[0].sourceId; }, /원문 ID가 중복/);
rejects('unpublishedEdition', value => { value.conceptEditions[0].status = 'draft'; }, /등록이 끝나지 않은/);
rejects('uncheckedPublishedEdition', value => { value.conceptEditions[0].checks = { ...value.conceptEditions[0].checks, meaning: false }; }, /여섯 검토/);
rejects('wrongCatalogLink', value => { value.conceptEditions[0].catalogId = 'other'; }, /다른 원문 카탈로그/);

// Detect concurrent source/validator changes before replacing the derived asset.
assert.equal(sha256(await readFile(sourcePath)), canonicalSha256, '추출 중 정본이 변경됐습니다.');
for (const input of validatorFiles) assert.equal(sha256(await readFile(resolve(project, input.path))), input.sha256, `검사 코드 변경: ${input.path}`);
let existing;
try { existing = await readFile(assetPath, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (checkOnly) assert.equal(existing, bytes, '현재 앱 묶음과 정본이 다릅니다.');
else if (existing !== bytes) await atomicWrite(assetPath, bytes);
const written = await readFile(assetPath);
assert.equal(written.toString('utf8'), bytes, '저장 후 바이트 확인 실패');
verify(JSON.parse(written), state, canonicalSha256);
assert.equal(sha256(await readFile(sourcePath)), canonicalSha256, '검사 중 정본이 변경됐습니다.');

const report = {
  checkedAt: new Date().toISOString(),
  action: checkOnly ? 'check' : 'prepare',
  source: relative(workspace, sourcePath),
  asset: relative(project, assetPath),
  canonicalSha256,
  sourceSha256: pack.sourceSha256,
  payloadSha256: pack.payloadSha256,
  assetSha256: sha256(written),
  assetBytes: written.length,
  catalogs: 1,
  concepts: bindings.length,
  scenes: bindings.reduce((count, binding) => count + binding.scenes, 0),
  validatorFiles,
  generatorSha256: sha256(await readFile(fileURLToPath(import.meta.url))),
  hashContract: 'SHA256 over UTF-8 JSON.stringify in stored insertion order; payload={catalog,editions}; asset includes final LF.',
  checks: {
    allLatestPublishedEditionsValidated: true,
    sourceIdsAndOrderExact: true,
    catalogRawShaAndIdExact: true,
    catalogFilenameOnlyBasename: true,
    allEditionContentAndScreensExact: true,
    sixChecksRemainTrue: true,
    accountAndStudyCollectionsExcludedByAllowList: true,
    canonicalUnchanged: true,
    deterministicRepeat: true,
    savedBytesReread: true,
  },
  rejectionChecks,
  excluded: ['userId', 'namespace', 'revisions', 'appliedOps', 'conceptBatches', 'other study collections'],
  limitations: ['Local asset and domain validation only; app loading, personal override behavior, server and publication are separate checks.'],
  bindings,
  passed: true,
};
await atomicWrite(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ passed: true, action: report.action, concepts: report.concepts, scenes: report.scenes, assetBytes: report.assetBytes, assetSha256: report.assetSha256, payloadSha256: report.payloadSha256, unchangedAsset: existing === bytes, report: relative(project, reportPath) }));
