/** Local editorial plans. No provider client, credentials, upload or source mutation. */
import { createHash } from 'node:crypto';
import { readFile, open, rename, unlink } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const fail = (message) => { throw new Error(message); };
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
export function validateRegistry(registry) {
  if (registry?.format !== 'concept-template-registry-v1' || !nonempty(registry.version))
    fail('틀의 형식과 버전을 확인해 주세요.');
  const types = ['정의형','구별형','구조형','과정형','원리형','절차형','관점형'];
  if (registry.templates?.length !== 7 || !isDeepStrictEqual(registry.semanticAxis, types))
    fail('일곱 유형의 틀을 모두 확인해 주세요.');
  const ids = new Set();
  for (const [i, t] of registry.templates.entries()) {
    if (t.type !== types[i] || !nonempty(t.id) || ids.has(t.id)) fail('유형 또는 틀 식별자가 중복되거나 다릅니다.');
    ids.add(t.id);
    for (const key of ['question','selectWhen','excludeWhen']) if (!nonempty(t[key])) fail(`틀의 ${key}이 없습니다.`);
    for (const key of ['requiredSlots','layout','allowedInteractions','forbidden','reviewQuestions']) {
      if (!Array.isArray(t[key]) || !t[key].length || t[key].some(v => !nonempty(v))) fail(`틀의 ${key}을 확인해 주세요.`);
    }
    if (new Set(t.requiredSlots).size !== t.requiredSlots.length) fail('내용 역할이 중복됩니다.');
    if (t.allowedInteractions.some(v => !Object.hasOwn(registry.interactionAxis, v))) fail('허용하지 않은 조작입니다.');
  }
  return registry;
}
export function validatePlan(plan, registry, item, sourceHash) {
  if (plan.sourceId !== item.id || plan.itemSha256 !== sha256(JSON.stringify(item)) || plan.sourceSha256 !== sourceHash)
    fail('설계의 원문 연결이 다릅니다. 기존 설계를 덮어쓰지 않았습니다.');
  if (plan.templateVersion !== registry.version) fail('틀 버전이 다릅니다. 별도 대조가 필요합니다.');
  if (!Array.isArray(plan.secondaryTypes) || new Set(plan.secondaryTypes).size !== plan.secondaryTypes.length ||
      plan.secondaryTypes.some(t => !registry.semanticAxis.includes(t) || t === plan.primaryType)) fail('보조 유형을 확인해 주세요.');
  if (!['unclassified','needs-design','design-draft'].includes(plan.stage)) fail('설계 상태를 확인해 주세요.');
  if (plan.review?.meaning !== false || plan.review?.rendered !== false || plan.review?.published !== false)
    fail('설계 기록으로 의미 검토·화면 확인·등록을 완료할 수 없습니다.');
  if (![null,...registry.semanticAxis].includes(plan.primaryType)) fail('주 유형이 허용 목록에 없습니다.');
  if (plan.stage === 'unclassified' && plan.primaryType !== null) fail('미분류 상태와 주 유형이 맞지 않습니다.');
  if (plan.stage === 'needs-design' && plan.primaryType === null) fail('주 유형 없이 유형별 설계를 시작할 수 없습니다.');
  if (plan.stage !== 'design-draft') return;
  const t = registry.templates.find(t => t.type === plan.primaryType);
  if (!t || !t.allowedInteractions.includes(plan.interaction?.kind)) fail('유형과 조작의 적용 조건을 확인해 주세요.');
  if (!nonempty(plan.question) || !nonempty(plan.selectionReason) || !nonempty(plan.interaction.effect)) fail('핵심 질문과 틀을 고른 이유·조작의 의미가 필요합니다.');
  if (!plan.slots || t.requiredSlots.some(k => !nonempty(plan.slots[k]))) fail('유형에 필요한 내용이 빠져 있습니다.');
  if (!Array.isArray(plan.representations) || !plan.representations.length) fail('필요한 표현을 확인해 주세요.');
  const repr = new Map();
  for (const r of plan.representations) {
    if (!nonempty(r.id) || repr.has(r.id) || !nonempty(r.kind) || !nonempty(r.purpose) ||
        !['single','complement','constrain','construct'].includes(r.role) ||
        !Array.isArray(r.referents) || !r.referents.length || r.referents.some(v => !nonempty(v))) fail('표현의 역할·대상·식별자를 확인해 주세요.');
    repr.set(r.id, r);
  }
  if (!Array.isArray(plan.mappings)) fail('표현 대응 목록이 필요합니다.');
  for (const m of plan.mappings) {
    if (m.from === m.to || !repr.has(m.from) || !repr.has(m.to) || !nonempty(m.meaning) || !nonempty(m.referent) ||
        !repr.get(m.from).referents.includes(m.referent) || !repr.get(m.to).referents.includes(m.referent)) fail('표현 사이의 대응 대상이 없습니다.');
  }
  if (repr.size > 1) {
    const linked = new Set(plan.mappings.flatMap(m => [m.from,m.to]));
    if ([...repr.keys()].some(k => !linked.has(k))) fail('서로 연결되지 않은 표현이 있습니다.');
  }
  if (!Array.isArray(plan.ruleApplications) || plan.ruleApplications.length !== 12 ||
      registry.common.requiredRules.some(id => !plan.ruleApplications.some(r => r.id === id &&
        ['planned','not-applicable'].includes(r.status) && nonempty(r.reason)))) fail('MI01–MI12 적용 계획 또는 제외 이유가 필요합니다.');
  if (!nonempty(plan.interaction.restore) || !nonempty(plan.interaction.resetScope)) fail('복귀와 초기화 범위를 정해 주세요.');
  if (['select','step'].includes(plan.interaction.kind)) {
    const options = plan.interaction.kind === 'select' ? plan.interaction.choices : plan.interaction.steps;
    if (!Array.isArray(options) || options.length < 2 || new Set(options.map(o => o.id)).size !== options.length ||
        options.some(o => !nonempty(o.id) || !nonempty(o.label) || !nonempty(o.purpose)) ||
        !options.some(o => o.id === plan.interaction.initialId) || !nonempty(plan.interaction.keyboardAlternative))
      fail('선택·단계의 내용과 목적·초기 상태·키보드 조작을 정해 주세요.');
  }
  if (plan.interaction.kind === 'parameter') {
    const model = plan.interaction.model;
    if (!model || !nonempty(model.formula) || !nonempty(model.assumptions) || !nonempty(model.boundaryBehavior) ||
        !Array.isArray(model.evidence) || !model.evidence.length || model.evidence.some(v => !nonempty(v)) ||
        !Array.isArray(model.checks) || !model.checks.length || model.checks.some(c => !nonempty(c.input) || !nonempty(c.expected)))
      fail('값 조절에는 모형·조건·경계·근거·독립 확인 사례가 필요합니다.');
    if (!Array.isArray(plan.interaction.controls) || !plan.interaction.controls.length) fail('조절부가 없습니다.');
    for (const c of plan.interaction.controls) {
      if (!nonempty(c.label) || !nonempty(c.unit) || !nonempty(c.alternative) ||
          ![c.min,c.max,c.step,c.initial].every(Number.isFinite) || c.min >= c.max || c.step <= 0 ||
          c.initial < c.min || c.initial > c.max || c.step > c.max - c.min) fail('조절값의 단위·범위·초기값·대체 조작을 확인해 주세요.');
    }
  }
  if (plan.review?.meaning !== false || plan.review?.rendered !== false || plan.review?.published !== false)
    fail('설계 틀의 형식 확인으로 의미 검토·실제 화면 확인·등록을 완료할 수 없습니다.');
}
export function buildPlans(state, registry, registryHash, previous = null) {
  validateRegistry(registry);
  const catalog = state.conceptCatalogs?.filter(c => !c.deletedAt).at(-1);
  if (!catalog || sha256(catalog.raw) !== catalog.sha256) fail('보관 원문의 해시가 다릅니다.');
  const source = JSON.parse(catalog.raw);
  const ids = new Set(source.items?.map(i => i.id));
  if (!source.items?.length || ids.size !== source.items.length || source.items.some(i => !nonempty(i.id))) fail('원문 ID 누락·중복을 확인해 주세요.');
  if (previous && (previous.format !== 'concept-design-queue-v1' || previous.sourceSha256 !== catalog.sha256 || previous.registrySha256 !== registryHash))
    fail('원문 또는 틀이 변경되었습니다. 이전 설계를 보존하고 별도 대조해 주세요.');
  const old = new Map((previous?.items ?? []).map(p => [p.sourceId,p]));
  if (old.size !== (previous?.items.length ?? 0) || [...old.keys()].some(id => !ids.has(id))) fail('기존 설계 ID를 확인해 주세요.');
  const editions = new Map((state.conceptEditions ?? []).filter(e => !e.deletedAt && e.catalogId === catalog.id).map(e => [e.sourceId,e]));
  const jobs = (state.conceptBatches ?? []).filter(b => !b.deletedAt && b.catalogId === catalog.id && b.status !== 'closed');
  const items = source.items.map(item => {
    const edition = editions.get(item.id);
    const prior = old.get(item.id);
    const plan = prior ?? {
      sourceId: item.id, name: item.name, sourceSha256: catalog.sha256, itemSha256: sha256(JSON.stringify(item)),
      templateVersion: registry.version, primaryType: edition?.displayType ?? null,
      secondaryTypes: edition?.secondaryTypes ?? [], classificationBasis: edition ? 'existing-editorial-draft' : 'not-yet-read-for-classification',
      selectionReason: edition?.reason ?? '', question: '', slots: {}, representations: [], mappings: [], interaction: null,
      ruleApplications: [], stage: edition?.displayType ? 'needs-design' : 'unclassified',
      review: { meaning: false, rendered: false, published: false },
    };
    validatePlan(plan, registry, item, catalog.sha256);
    return { ...plan, currentEditionVersion: edition?.version ?? 0,
      designBasedOnEditionVersion: prior?.designBasedOnEditionVersion ?? edition?.version ?? 0,
      needsReconcile: !!prior && (prior.designBasedOnEditionVersion ?? 0) !== (edition?.version ?? 0),
      currentBatchIds: jobs.filter(b => b.sourceIds.includes(item.id)).map(b => b.id) };
  });
  return { format:'concept-design-queue-v1', sourceSha256:catalog.sha256, registrySha256:registryHash,
    templateVersion:registry.version, items,
    summary:{ total:items.length, unclassified:items.filter(i=>i.stage==='unclassified').length,
      needsDesign:items.filter(i=>i.stage==='needs-design').length, designDrafts:items.filter(i=>i.stage==='design-draft').length,
      needsReconcile:items.filter(i=>i.needsReconcile).length,
      meaningReviewed:0, renderedReviewed:0, published:0 } };
}
async function main() {
  const args = process.argv.slice(2);
  const opt = name => args[args.indexOf(`--${name}`)+1];
  if (!args.includes('--workspace') || !args.includes('--out')) fail('--workspace 제작 폴더와 --out 설계 파일이 필요합니다.');
  const registryPath = join(dirname(fileURLToPath(import.meta.url)), '../docs/concept-interaction-templates.json');
  const rawRegistry = await readFile(registryPath,'utf8');
  const registry = JSON.parse(rawRegistry);
  const state = JSON.parse(await readFile(join(resolve(opt('workspace')),'workspace.json'),'utf8'));
  const out = resolve(opt('out'));
  let previous = null;
  try { previous = JSON.parse(await readFile(out,'utf8')); } catch(e) { if(e.code!=='ENOENT') throw e; }
  const result = buildPlans(state, registry, sha256(rawRegistry), previous);
  if (args.includes('--check')) { console.log(JSON.stringify(result.summary)); return; }
  const lockPath = `${out}.lock`;
  let lock;
  try { lock = await open(lockPath,'wx'); } catch(e) { if(e.code==='EEXIST') fail('다른 설계 저장 작업의 잠금이 있습니다. 덮어쓰지 않았습니다.'); throw e; }
  try {
    // Refuse an intervening write after loading; preserve manual edits on retry.
    let current = null;
    try { current = JSON.parse(await readFile(out,'utf8')); } catch(e) { if(e.code!=='ENOENT') throw e; }
    if (!isDeepStrictEqual(current, previous)) fail('읽은 뒤 설계가 수정되었습니다. 최신 파일에서 다시 실행해 주세요.');
    const pending = await open(`${out}.pending`,'w');
    try { await pending.writeFile(JSON.stringify(result,null,2)+'\n'); await pending.sync(); } finally { await pending.close(); }
    await rename(`${out}.pending`,out);
    console.log(JSON.stringify(result.summary));
  } finally { await lock.close(); await unlink(lockPath); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error(e.message); process.exitCode=1; });
}
