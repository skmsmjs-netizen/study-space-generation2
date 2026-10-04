// Local mock Plugin API verification; never connects to Figma or modifies webapp/source contracts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const base = path.resolve(__dirname, '../..');
const generatorFile = path.join(base, 'docs/figma-observatory-20261002/scripts/build-world-asset.js');
const generatorCode = fs.readFileSync(generatorFile, 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const generate = new AsyncFunction('figma', 'INPUT', generatorCode);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const cases = [];
const input = { assetId: '10:68', part: 3, mockup: { imageHash: 'world-image', width: 960, height: 400, scope: 'whole-scene', fileKey: 'fixture-file' } };
function fixture(representation) {
  const page = { id: '7:70', type: 'PAGE', children: [] };
  const asset = { id: '10:68', type: 'COMPONENT', name: 'Observatory/v2/__Asset/OriginalObservatory', width: 960, height: 400, x: 5000, y: 100, description: 'Original source/source SHA and instance identity retained.', fills: [], children: [], parent: page };
  const imagePaint = { type: 'IMAGE', scaleMode: 'FILL', imageHash: 'world-image' };
  if (representation === 'direct-image-fill') asset.fills = [imagePaint];
  else if (representation === 'one-image-rectangle') asset.children = [{ id: '90:10', type: 'RECTANGLE', width: 960, height: 400, x: 0, y: 0, name: 'Image mockup', fills: [{ ...imagePaint, scaleMode: 'FIT' }] }];
  else if (representation === 'native-vector') asset.children = [{ id: '90:11', type: 'VECTOR', width: 960, height: 400, x: 0, y: 0, fills: [] }];
  else if (representation === 'contract-only-component') asset.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  page.children = [asset];
  let writes = 0;
  const mutate = () => { writes++; throw new Error('Unexpected Figma node mutation in retry verification'); };
  const figma = { fileKey: 'fixture-file', getNodeByIdAsync: async id => id === page.id ? page : id === asset.id ? asset : null, setCurrentPageAsync: async () => {}, getImageByHash: hash => ['world-image', 'other-image'].includes(hash) ? { getSizeAsync: async () => ({ width: 1920, height: 800 }) } : null, createComponent: mutate, createRectangle: mutate };
  const snapshot = () => JSON.stringify({ id: asset.id, type: asset.type, name: asset.name, width: asset.width, height: asset.height, x: asset.x, y: asset.y, description: asset.description, fills: asset.fills, children: asset.children });
  return { figma, asset, snapshot, writes: () => writes };
}
async function reuseTwice(representation) {
  const f = fixture(representation), before = f.snapshot(), expectedPartId = representation === 'direct-image-fill' ? '10:68' : '90:10';
  const outputs = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await generate(f.figma, input);
    assert.equal(result.assetId, '10:68');
    assert.equal(result.partId, expectedPartId);
    assert.equal(result.reused, true);
    assert.equal(result.webAppChanged, false);
    assert.deepEqual(result.createdNodeIds, []);
    assert.deepEqual(result.mutatedNodeIds, []);
    assert.deepEqual(result.bounds, { width: 960, height: 400 });
    outputs.push({ assetId: result.assetId, partId: result.partId, created: result.createdNodeIds.length, mutated: result.mutatedNodeIds.length, reused: result.reused });
  }
  assert.equal(f.writes(), 0);
  assert.equal(f.snapshot(), before);
  cases.push({ case: representation + ' two retries', passed: true, ownerSnapshotPreserved: true, writes: 0, outputs });
}
async function rejectCase(label, representation, configure, expected) {
  const f = fixture(representation);
  if (configure) configure(f);
  const before = f.snapshot();
  await assert.rejects(generate(f.figma, input), expected);
  assert.equal(f.writes(), 0);
  assert.equal(f.snapshot(), before);
  cases.push({ case: label, passed: true, expectedError: expected.source, ownerSnapshotPreserved: true, writes: 0 });
}
(async () => {
  await reuseTwice('direct-image-fill');
  await reuseTwice('one-image-rectangle');
  await rejectCase('native vector is not imported or overlaid', 'native-vector', null, /RASTER_MIGRATION_REQUIRED/);
  await rejectCase('component type alone is not image evidence', 'contract-only-component', null, /RASTER_MIGRATION_REQUIRED/);
  await rejectCase('different direct image hash is preserved and rejected', 'direct-image-fill', f => { f.asset.fills[0].imageHash = 'other-image'; }, /RASTER_MIGRATION_REQUIRED/);
  await rejectCase('different rectangle image hash is preserved and rejected', 'one-image-rectangle', f => { f.asset.children[0].fills[0].imageHash = 'other-image'; }, /RASTER_MIGRATION_REQUIRED/);
  await rejectCase('wrong direct master bounds rejected', 'direct-image-fill', f => { f.asset.height = 300; }, /EXISTING_BOUNDS_MISMATCH/);
  await rejectCase('offset image rectangle rejected', 'one-image-rectangle', f => { f.asset.children[0].x = 2; }, /EXISTING_BOUNDS_MISMATCH/);
  await rejectCase('extra native child rejected', 'one-image-rectangle', f => { f.asset.children.push({ id: '90:12', type: 'VECTOR' }); }, /RASTER_MIGRATION_REQUIRED/);
  await rejectCase('CROP paint cannot silently change full bounds', 'direct-image-fill', f => { f.asset.fills[0].scaleMode = 'CROP'; }, /RASTER_MIGRATION_REQUIRED/);
  const contractFile = path.join(__dirname, 'mockup-contracts.json');
  const contractBefore = fs.readFileSync(contractFile);
  const contracts = JSON.parse(contractBefore);
  const drift = contracts.contracts.flatMap(row => {
    const file = path.join(base, row.source.file), currentSha256 = sha256(fs.readFileSync(file));
    return currentSha256 === row.source.sha256 ? [] : [{ id: row.id, name: row.name, file: row.source.file, snapshotSha256: row.source.sha256, currentSha256 }];
  });
  assert.equal(sha256(fs.readFileSync(contractFile)), sha256(contractBefore));
  const report = { checkedAtUtc: new Date().toISOString(), generator: path.relative(base, generatorFile), generatorSha256: sha256(generatorCode), verificationScriptSha256: sha256(fs.readFileSync(__filename)), syntax: 'pass', verificationType: 'local mocked Figma Plugin API; actual generator body executed', cases, sourceContractSnapshot: { file: 'docs/figma-memory-20261002/mockup-contracts.json', sha256: sha256(contractBefore), contractCount: contracts.contracts.length, snapshotsEdited: false, drift, note: 'Contract SHA values remain preserved snapshots. Drift describes concurrent current source changes; this result does not claim that all 29 source files still match.' }, totalNodeWrites: 0, remoteFigmaCalls: 0, webAppSourceEdits: 0, limitation: 'No remote retry, rendering or webapp flow was executed; remote master identity/representation is supplied by parent evidence.' };
  fs.writeFileSync(path.join(__dirname, 'world-mockup-reuse-verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ syntax: report.syntax, casesPassed: cases.length, nodeWrites: 0, sourceContracts: contracts.contracts.length, concurrentSourceDrift: drift.map(row => row.name), snapshotsEdited: false, evidence: 'docs/figma-memory-20261002/world-mockup-reuse-verification.json', remoteFigmaCalls: 0, webAppSourceEdits: 0 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
