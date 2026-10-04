#!/usr/bin/env node
/* Verifies a display projection against frozen UX inputs. Does not write or recapture source. */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { POLICY, bodyText, createContext, compactItem } = require('./compact-ux.cjs');
const SOURCE = path.resolve(__dirname, '../ux-paths-20261002');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const source = read(path.join(SOURCE, 'source-actions.json'));
const manifest = read(path.join(SOURCE, 'manifest.json'));
const projected = read(path.join(__dirname, 'compact-ux-cards.json'));
const summary = read(path.join(__dirname, 'compact-ux-summary.json'));
const index = read(path.join(SOURCE, 'figma-inputs/index.json'));
const original = new Map();
for (const [group, names] of Object.entries(index.groups)) {
  for (const name of names) {
    const input = read(path.join(SOURCE, 'figma-inputs', name));
    for (const item of input.items) original.set(item.id, { group, ...item });
  }
}
const context = createContext(source, manifest);
const cards = new Map(projected.cards.map(card => [card.id, card]));
assert.equal(cards.size, projected.cards.length, 'Unique projected card IDs');
assert.deepEqual([...cards.keys()].sort(), [...original.keys()].sort(), 'Every legacy card ID retained');
assert.equal(projected.policy, POLICY);
let actionCount = 0;
let surfaceCount = 0;
let actionBindings = 0;
let handlerBindings = 0;
for (const [id, card] of cards) {
  const previous = original.get(id);
  for (const property of ['group', 'id', 'title', 'kind', 'source', 'url']) {
    assert.equal(card[property], previous[property], `${id}: ${property} retained`);
  }
  assert.equal(card.projection.originalBodySha256, sha(bodyText(previous)), `${id}: complete original-body digest retained`);
  assert.equal(card.projection.originalBodyUtf16Length, bodyText(previous).length, `${id}: complete original-body length retained`);
  assert.equal(card.displayMode, POLICY);
  assert.ok(bodyText(card).length <= 1600, `${id}: bounded display text`);
  assert.ok(!bodyText(card).includes('핸들러의 조건별 갈림길'), `${id}: shared full trace not copied`);
  assert.deepEqual(compactItem(card, context), card, `${id}: repeat projection preserves content and references`);
  const action = context.actions.get(id)?.item;
  const surface = context.surfaces.get(id);
  if (action) {
    actionCount++;
    assert.deepEqual(card.references.handlerIds, action.handlerTrace, `${id}: all handler IDs retained`);
    assert.deepEqual(card.references.branchIds, [...new Set(action.transitions.flatMap(transition => transition.branchIds))], `${id}: all branch IDs retained`);
    assert.deepEqual(card.references.surfaceIds, context.owners.get(id) || [], `${id}: all owner surfaces retained`);
    assert.ok(fs.existsSync(path.join(SOURCE, card.references.document.split('#')[0])), `${id}: full action document exists`);
    for (const document of card.references.handlerDocuments) assert.ok(fs.existsSync(path.join(SOURCE, document)), `${id}: full handler document exists`);
    handlerBindings += card.references.handlerIds.length;
  } else if (surface) {
    surfaceCount++;
    assert.deepEqual(card.references.actionIds, [...new Set(surface.actionBindings.map(binding => binding.actionId))], `${id}: all action references retained`);
    assert.deepEqual(card.references.stateContractIds, surface.commonContractIds, `${id}: state-contract references retained`);
    assert.deepEqual(card.references.effectIds, surface.lifecycleEffects, `${id}: lifecycle references retained`);
    assert.ok(fs.existsSync(path.join(SOURCE, card.references.document)), `${id}: full surface document exists`);
    actionBindings += card.references.actionIds.length;
  }
}
assert.equal(actionCount, source.actions.length);
assert.equal(surfaceCount, manifest.paths.length + manifest.extensionPaths.length);
for (const [file, digest] of [['source-actions.json', summary.preservation.sourceActionsSha256], ['manifest.json', summary.preservation.manifestSha256], ['전체경로.md', summary.preservation.fullPathDocumentSha256]]) {
  assert.equal(sha(fs.readFileSync(path.join(SOURCE, file))), digest, `${file}: complete local original unchanged`);
}
for (const file of summary.preservation.inputHashes) assert.equal(sha(fs.readFileSync(path.join(SOURCE, 'figma-inputs', file.name))), file.sha256, `${file.name}: historical full inputs unchanged`);
const builder = fs.readFileSync(path.join(SOURCE, 'build-figma-paths.js'), 'utf8');
new (Object.getPrototypeOf(async function () {}).constructor)('INPUT', 'figma', builder);
// Exercise only the builder's preparation phase; it must finish before any Figma write/API call.
const prepare = new Function('INPUT', builder.slice(0, builder.indexOf('const beforePageIds=')) + '\nreturn preparedItems;');
const legacyPrepared = prepare({ pageName: '20 전체 UX 경우·경로', items: [...original.values()] });
assert.equal(legacyPrepared.length, original.size, 'Legacy full/compact inputs keep every card');
for (const { item, body } of legacyPrepared) {
  assert.ok(body.length <= 1600, `${item.id}: legacy input is reduced before native rendering`);
  assert.ok(!body.includes('핸들러의 조건별 갈림길'), `${item.id}: legacy full handler repetition removed`);
}
const earlierCompact = { id: 'X-existing-compact', title: '기존 짧은 카드', body: ['표시: 별도 조건식 없음', '이벤트: onClick'] };
assert.equal(prepare({ items: [earlierCompact] })[0].body, bodyText(earlierCompact), 'Earlier compact body remains compatible');
assert.throws(() => prepare({ displayMode: 'full', items: [] }), /summary\/reference mode/, 'Explicit full-body publishing is rejected before writes');
assert.throws(() => prepare({ items: [{ id: 'bad', displayMode: POLICY, body: 'x'.repeat(1601) }] }), /display budget/, 'Oversized new projection is rejected before writes');
let fullDocumentsCompared = 0;
if (process.argv[2]) {
  const isolated = path.resolve(process.argv[2]);
  for (const directory of ['paths', 'actions', 'handlers']) {
    const names = fs.readdirSync(path.join(SOURCE, directory)).filter(name => name.endsWith('.md')).sort();
    assert.deepEqual(fs.readdirSync(path.join(isolated, directory)).filter(name => name.endsWith('.md')).sort(), names, `${directory}: every full document generated`);
    for (const name of names) {
      assert.equal(sha(fs.readFileSync(path.join(isolated, directory, name))), sha(fs.readFileSync(path.join(SOURCE, directory, name))), `${directory}/${name}: unchanged full Markdown`);
      fullDocumentsCompared++;
    }
  }
  for (const file of ['전체경로.md', '공통상태.md', 'action-ownership.json']) {
    assert.equal(sha(fs.readFileSync(path.join(isolated, file))), sha(fs.readFileSync(path.join(SOURCE, file))), `${file}: unchanged complete local artifact`);
    fullDocumentsCompared++;
  }
  const compactIndex = read(path.join(isolated, 'figma-inputs/index.json'));
  assert.equal(compactIndex.displayMode, POLICY, 'Generator defaults to summary/reference');
  const regenerated = new Map();
  for (const names of Object.values(compactIndex.groups)) {
    for (const name of names) {
      const input = read(path.join(isolated, 'figma-inputs', name));
      assert.equal(input.displayMode, POLICY);
      assert.ok(JSON.stringify(input).length + builder.length + 64 <= 50000, 'Direct Figma code remains bounded');
      for (const item of input.items) regenerated.set(item.id, item);
    }
  }
  assert.deepEqual([...regenerated.keys()].sort(), [...cards.keys()].sort(), 'Default regeneration preserves every projected ID');
  for (const [id, card] of cards) {
    assert.equal(bodyText(regenerated.get(id)), bodyText(card), `${id}: generation uses the same independent summary`);
    assert.deepEqual(regenerated.get(id).references, card.references, `${id}: generator preserves every reference`);
  }
}
process.stdout.write(JSON.stringify({
  kind: 'local-ux-projection-integrity-not-runtime', status: 'passed', checkedAt: new Date().toISOString(),
  policy: POLICY, sourceChecksum: manifest.checksums.sourceFiles,
  cards: cards.size, actions: actionCount, surfaces: surfaceCount,
  actionBindings, handlerBindings, fullDocumentsCompared,
  compactBodyChars: summary.compactBodyChars, maxCompactBodyChars: summary.maxCompactBodyChars,
  legacyInputBodiesValidated: legacyPrepared.length, maxLegacyDisplayBodyChars: Math.max(...legacyPrepared.map(card => card.body.length)),
  localOriginalsUnchanged: true, historicalFigmaInputsUnchanged: true,
  remoteExecuted: false, runtimeVerified: false,
}, null, 2) + '\n');
