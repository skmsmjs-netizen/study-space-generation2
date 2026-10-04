#!/usr/bin/env node
/* Figma display projection only. Full UX expressions remain in the captured JSON/Markdown. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const POLICY = 'summary-reference-v1';
const one = value => String(value ?? '').replace(/\s+/g, ' ').trim();
const excerpt = (value, limit = 180) => {
  const text = one(value);
  return text.length <= limit ? text : text.slice(0, limit - 1) + '…';
};
const bodyText = item => Array.isArray(item.body) ? item.body.join('\n\n') : String(item.body || '');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const stem = file => file.replace(/^src\//, '').replace(/\//g, '__').replace(/\.[^.]+$/, '');
const unique = values => [...new Set(values)];

function createContext(source, manifest) {
  const owners = new Map();
  for (const surface of [...manifest.paths, ...manifest.extensionPaths]) {
    for (const binding of surface.actionBindings) {
      if (!owners.has(binding.actionId)) owners.set(binding.actionId, []);
      owners.get(binding.actionId).push(surface.id);
    }
  }
  return {
    source, manifest, owners,
    actions: new Map(source.actions.map((item, index) => [item.id, { item, index }])),
    surfaces: new Map([...manifest.paths, ...manifest.extensionPaths].map(item => [item.id, item])),
    handlers: new Map(source.handlers.map(item => [item.id, item])),
  };
}

/* Also accepts earlier, already compact cards; the display policy is independent of the publisher. */
function compactItem(item, context) {
  const original = bodyText(item);
  let body;
  let references = { ...(item.references || {}) };
  const actionRecord = context?.actions.get(item.id);
  const surface = context?.surfaces.get(item.id);
  if (actionRecord) {
    const { item: action, index } = actionRecord;
    const handlers = action.handlerTrace.map(id => context.handlers.get(id)).filter(Boolean);
    const handlerFiles = unique(handlers.map(handler => 'handlers/' + stem(handler.path) + '.md'));
    const branchIds = unique(action.transitions.flatMap(transition => transition.branchIds));
    const conditions = action.guards.map(guard => `${guard.truth}: ${guard.expression}`).join(' ∧ ') || '별도 조건식 없음';
    const events = action.events.map(event => event.name + ' → ' + excerpt(event.expression, 100)).join(' / ') || action.transitions[0]?.event || '네이티브/호출자';
    const actionDocument = `actions/${stem(action.path)}.md#${action.id.toLowerCase()}`;
    references = {
      ...references, document: actionDocument,
      snapshot: `source-actions.json#/actions/${index}`,
      surfaceIds: context.owners.get(action.id) || [],
      handlerIds: [...action.handlerTrace], branchIds,
      handlerDocuments: handlerFiles,
    };
    body = [
      `표면: ${references.surfaceIds.join(', ') || '미분류'} · ${action.facets.join(' / ') || action.kind}`,
      `표시: ${excerpt(conditions, 220)}`,
      `차단: ${excerpt(action.props.disabled?.source || '명시 없음', 140)}; 읽기만: ${excerpt(action.props.readOnly?.source || '명시 없음', 100)}`,
      `이벤트: ${excerpt(events, 260)}`,
      `결과 경계: 핸들러 ${handlers.length}개 · 분기 ${branchIds.length}개 · 반복 ${action.repetition.length}개. 정상/중단/예외/finally는 원문을 따른다.`,
      `전체 조건·결과: ${actionDocument}`,
      `핸들러 원문: ${handlerFiles.join(' / ') || '네이티브·외부 전달 경계'}; source-actions.json`,
    ];
  } else if (surface) {
    const actionIds = unique(surface.actionBindings.map(binding => binding.actionId));
    references = {
      ...references, document: `paths/${surface.id}.md`, actionIds,
      stateContractIds: [...surface.commonContractIds],
      effectIds: [...surface.lifecycleEffects],
    };
    body = [
      `진입: ${excerpt([surface.path, ...surface.parents].filter(Boolean).join(' / ') || '실제 소스 호출자', 220)}`,
      `복귀: ${excerpt(surface.originalReturn || '원래 호출자/소스 지정 경로', 220)}`,
      ...(surface.cases?.length ? [`구체적 경우 ${surface.cases.length}개: ${excerpt(surface.cases.join(' / '), 200)}`] : []),
      `공통 상태: ${surface.commonContractIds.join(', ') || '개별 소스 조건'}; 빈 값/오류/로딩 ${surface.stateViews.length}개; effect ${surface.lifecycleEffects.length}개.`,
      `연결 조작 ${actionIds.length}개. 전체 ID·표시/차단·정상/예외 결과: paths/${surface.id}.md`,
      '조작 정의는 동일 X-ID 카드와 actions/*.md에서 한 번 관리한다. 복잡한 실제 UI는 앱 코드에서 구현한다.',
    ];
  } else if (item.displayMode === POLICY) {
    return item;
  } else if (item.id.startsWith('X-')) {
    // Compatibility for old publishers without the source context. Never repeat shared handler traces.
    const lines = Array.isArray(item.body) ? item.body : original.split(/\n\n/);
    const base = lines.filter(line => /^(표면:|표시:|차단:|이벤트:|링크:|결과 핸들러:|반복:|전체 결과)/.test(line));
    body = base.map(line => excerpt(line, 260));
    if (!base.length) body = [excerpt(original, 1100), '전체 조건·결과는 source-actions.json과 연결한 조작 문서에서 확인한다.'];
    references.document ||= base.find(line => line.startsWith('전체 결과'))?.match(/actions\/\S+\.md#[\w-]+/)?.[0] || 'source-actions.json';
  } else {
    body = original.length > 1500 ? [excerpt(original, 1200), '전체 원문: 전체경로.md와 해당 paths/ 문서'] : item.body;
  }
  return {
    ...item, body, displayMode: POLICY, references,
    projection: {
      policy: POLICY,
      originalBodyUtf16Length: item.projection?.originalBodyUtf16Length ?? original.length,
      originalBodySha256: item.projection?.originalBodySha256 ?? sha(original),
      fullSourcePreservedAt: 'docs/ux-paths-20261002/source-actions.json',
      runtimeVerified: false,
    },
  };
}

function projectInputs(inputDirectory, outputDirectory) {
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const sourceDirectory = path.dirname(inputDirectory);
  const source = read(path.join(sourceDirectory, 'source-actions.json'));
  const manifest = read(path.join(sourceDirectory, 'manifest.json'));
  const index = read(path.join(inputDirectory, 'index.json'));
  const context = createContext(source, manifest);
  const cards = [];
  const inputHashes = [];
  for (const [group, names] of Object.entries(index.groups)) {
    for (const name of names) {
      const file = path.join(inputDirectory, name);
      const input = read(file);
      inputHashes.push({ name, sha256: sha(fs.readFileSync(file)) });
      for (const item of input.items) cards.push({ group, ...compactItem(item, context) });
    }
  }
  const actions = cards.filter(card => card.id.startsWith('X-'));
  const surfaces = cards.filter(card => /^[ROUA]\d\d$/.test(card.id));
  if (new Set(cards.map(card => card.id)).size !== cards.length || actions.length !== source.actions.length || surfaces.length !== manifest.paths.length + manifest.extensionPaths.length) {
    throw Error('Compact projection must preserve every unique source card ID');
  }
  const bodyChars = cards.reduce((total, card) => total + bodyText(card).length, 0);
  const originalBodyChars = cards.reduce((total, card) => total + card.projection.originalBodyUtf16Length, 0);
  const summary = {
    schemaVersion: 1, policy: POLICY, preparedAt: new Date().toISOString(),
    sourceCapturedAt: manifest.capturedAt, sourceChecksum: manifest.checksums.sourceFiles,
    counts: { cards: cards.length, actions: actions.length, surfaces: surfaces.length },
    originalBodyChars, compactBodyChars: bodyChars,
    bodyReductionPercent: Math.round((1 - bodyChars / originalBodyChars) * 10000) / 100,
    maxCompactBodyChars: Math.max(...cards.map(card => bodyText(card).length)),
    references: {
      surfaceActionBindings: surfaces.reduce((total, card) => total + card.references.actionIds.length, 0),
      actionHandlerBindings: actions.reduce((total, card) => total + card.references.handlerIds.length, 0),
    },
    preservation: {
      sourceActionsSha256: sha(fs.readFileSync(path.join(sourceDirectory, 'source-actions.json'))),
      manifestSha256: sha(fs.readFileSync(path.join(sourceDirectory, 'manifest.json'))),
      fullPathDocumentSha256: sha(fs.readFileSync(path.join(sourceDirectory, '전체경로.md'))),
      inputHashes,
    },
    remoteExecuted: false, runtimeVerified: false,
  };
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'compact-ux-cards.json'), JSON.stringify({ schemaVersion: 1, policy: POLICY, sourceChecksum: summary.sourceChecksum, cards }, null, 2));
  fs.writeFileSync(path.join(outputDirectory, 'compact-ux-summary.json'), JSON.stringify(summary, null, 2));
  return summary;
}

module.exports = { POLICY, bodyText, createContext, compactItem, projectInputs };
if (require.main === module) {
  const input = path.resolve(process.argv[2] || path.join(__dirname, '../ux-paths-20261002/figma-inputs'));
  const output = path.resolve(process.argv[3] || __dirname);
  process.stdout.write(JSON.stringify(projectInputs(input, output), null, 2) + '\n');
}
