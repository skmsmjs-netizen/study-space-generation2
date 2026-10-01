import { validateMaterialCardSource } from './learning-evidence';
import { boardContent, validateBoard, verifyBoardTopics } from './study-board';
import { DomainError, type AppState, type Command, type CriteriaAssignment, type DateEvidence, type DomainEntity, type EntityCollection, type Narrative, type OutlineNode, type Revision, type Scope, type StudyRecord, type TraceDefinition, type TraceState } from './model';
import { TRACE_ITEMS, WRITTEN_REVIEW_ITEM_ID } from './trace';
import { criteriaRevisionToken, criteriaScopeTargets, defaultCriteriaItems, validateTraceDefinition } from './criteria';
import { MAX_OUTLINE_ROWS, outlineRevisionToken, outlineTableToken, previewOutlineEntries, previewOutlineTable } from './outline';
import { validateMemoryCard, validateMemoryTest } from './memory-test';
import { validateMemoContent } from './memo';
import { validateRecommendations } from './recommendation-workspace';
function verifyLearningPlan(workspace: unknown, state: AppState) { try { validateRecommendations(workspace,state); } catch(error) { throw new DomainError('INVALID_LEARNING_PLAN',error instanceof Error ? error.message : '학습 일정의 내용을 확인해 주세요.'); } }
import { validateCanvasLayout } from './canvas';
import { materialContent, validateMaterialContent } from './study-material';
import { codeContent, validateCodeContent } from './code-example';
import { newRecallMemory, recallOptions, recallPreview, serializeMemory, validateRecallCard, validateRecallOptions } from './recall-scheduler';

const collections: EntityCollection[] = ['studyBoards', 'semesters', 'subjects', 'nodes', 'sessions', 'records', 'narratives', 'criteria', 'criteriaAssignments', 'memos', 'learningPlans', 'canvasLayouts', 'codeExamples', 'recallCards', 'recallPreferences', 'studyMaterials', 'memoryCards', 'memoryTests'];
const clone = <T>(value: T): T => structuredClone(value);
function fail(code: string, message: string, details?: unknown): never { throw new DomainError(code, message, details); }
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}';
  return JSON.stringify(value);
}
function identity(id: string): void { if (typeof id !== 'string' || !id.trim() || id.length > 256) fail('INVALID_ID', '항목의 식별자를 확인해 주세요.'); }
function title(name: string): string { if (typeof name !== 'string' || !name.trim()) fail('EMPTY_NAME', '이름을 입력해 주세요.'); return name.trim(); }
function validDay(day: string): boolean { return typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day; }
export function validateDateEvidence(value: DateEvidence): void {
  if (!value || !['exact', 'range', 'unknown'].includes(value.kind)) fail('INVALID_DATE', '공부한 날짜의 기억 정도를 확인해 주세요.');
  if (value.kind === 'exact' && !validDay(value.date)) fail('INVALID_DATE', '실제 공부한 날짜를 확인해 주세요.');
  if (value.kind === 'range' && (!validDay(value.from) || !validDay(value.to) || value.from > value.to)) fail('INVALID_DATE', '기억나는 날짜 범위를 확인해 주세요.');
}
function verifyScope(state: AppState, scope: Scope): void {
  if (!scope || !['semester', 'independent', 'unassigned'].includes(scope.kind)) fail('INVALID_SCOPE', '과목의 소속을 확인해 주세요.');
  if (scope.kind === 'semester' && !state.semesters.some(s => s.id === scope.semesterId && !s.deletedAt)) fail('INVALID_SCOPE', '연결할 학기를 찾을 수 없습니다.');
}
function find<T extends DomainEntity>(values: T[], id: string, active = true): T {
  const row = values.find(v => v.id === id);
  if (!row || active && row.deletedAt) return fail('NOT_FOUND', '대상을 찾을 수 없습니다. 휴지통을 확인해 주세요.', { id });
  return row;
}
function expected(row: DomainEntity, version: number, attempted: unknown): void {
  if (row.version !== version) fail('VERSION_CONFLICT', '다른 곳에서 변경된 내용이 있습니다. 두 내용을 확인해 주세요.', { baseVersion: version, current: clone(row), attempted: clone(attempted) });
}
function targetSubject(state: AppState, targetId: string, active = true): string {
  const direct = state.subjects.find(s => s.id === targetId);
  if (direct) { find(state.subjects, direct.id, active); return direct.id; }
  const node = find(state.nodes, targetId, active); find(state.subjects, node.subjectId, active);
  if (active) {
    let parentId = node.parentId;
    while (parentId) { const parent = find(state.nodes, parentId); parentId = parent.parentId; }
  }
  return node.subjectId;
}
function verifyTrace(trace: TraceState): void {
  if (!trace || typeof trace !== 'object' || Array.isArray(trace)) fail('INVALID_TRACE', '활동 입력을 확인해 주세요.');
  for (const [id, item] of Object.entries(trace)) {
    identity(id);
    if (!/^[TRACE][A-Za-z0-9_-]*$/.test(id)) fail('INVALID_TRACE_ID', '활동의 원래 식별자를 확인해 주세요.');
    if (!item || !['checked', 'unchecked', 'na', 'deferred'].includes(item.status) || item.note !== undefined && typeof item.note !== 'string') fail('INVALID_TRACE', '활동 상태와 메모를 확인해 주세요.');
    if (item.definition !== undefined) validateTraceDefinition(item.definition, id);
    if (item.examReview && (typeof item.examReview.answer !== 'string' || typeof item.examReview.checked !== 'boolean' || item.examReview.checked && (!item.examReview.answer.trim() || item.status !== 'checked'))) fail('INVALID_WRITTEN_REVIEW', '점검하려면 자기 문장으로 서술을 남겨 주세요.');
    if (item.repeats) {
      const ids = new Set<string>();
      for (const repeat of item.repeats) {
        identity(repeat.id); if (ids.has(repeat.id)) fail('DUPLICATE_REPEAT', '같은 반복 기록이 중복되어 있습니다.'); ids.add(repeat.id);
        if (!['exact', 'minimum', 'unknown'].includes(repeat.kind) || (repeat.kind === 'unknown' ? repeat.count !== null : !Number.isSafeInteger(repeat.count) || Number(repeat.count) < 1)) fail('INVALID_REPEAT', '반복 횟수의 기억 정도를 확인해 주세요.');
        if (repeat.dateEvidence) validateDateEvidence(repeat.dateEvidence);
      }
    }
  }
}
function mergeTrace(previous: TraceState, patch: TraceState): TraceState {
  verifyTrace(patch);
  const next = clone(previous);
  for (const [id, item] of Object.entries(patch)) {
    // A normal activity update cannot silently replace or confirm a written review.
    if (item.examReview && canonical(item.examReview) !== canonical(previous[id]?.examReview ?? null)) fail('REVIEW_COMMAND_REQUIRED', '서술 수정과 점검 확인은 해당 조작을 사용해 주세요.');
    const definition = previous[id]?.definition ?? item.definition ?? (() => { const original = TRACE_ITEMS.find(t => t.id === id); return original ? { id, group: original.group, label: original.label, mode: original.mode, version: 1 } : undefined; })();
    next[id] = { ...previous[id], ...clone(item), ...(definition ? { definition } : {}) };
    if (next[id].status !== 'checked' && next[id].examReview) next[id].examReview = { ...next[id].examReview!, checked: false };
  }
  verifyTrace(next); return next;
}

/** Validate ownership and structural relations without rewriting historical data. */
export function assertState(state: AppState): void {
  if (state.schemaVersion !== 1 || !['demo', 'personal', 'test'].includes(state.namespace)) fail('INVALID_STATE', '자료 형식을 확인해 주세요.');
  identity(state.userId);
  const globallyUnique = new Set<string>();
  for (const name of collections) {
    if (state[name] !== undefined && !Array.isArray(state[name])) fail('INVALID_STATE', '자료 목록의 형식을 확인해 주세요.');
    for (const row of state[name] ?? []) {
    identity(row.id);
    if (globallyUnique.has(row.id)) fail('DUPLICATE_ID', '같은 식별자가 중복되어 있습니다.', { id: row.id }); globallyUnique.add(row.id);
    if (row.userId !== state.userId || row.namespace !== state.namespace) fail('OWNERSHIP', '다른 사용자나 시험 공간의 자료를 함께 처리할 수 없습니다.');
    if (!Number.isInteger(row.version) || row.version < 1) fail('INVALID_VERSION', '수정 순서를 확인해 주세요.');
    }
  }
  // Validate large snapshots through indexes; repeated array scans made record checks quadratic.
  const index = new Map(collections.flatMap(name => (state[name] ?? []).map(row => [row.id, row] as const)));
  const subjectIds = new Set(state.subjects.map(row => row.id));
  const sessionIds = new Set(state.sessions.map(row => row.id));
  const semesterIds = new Set(state.semesters.map(row => row.id));
  const nodeIndex = new Map(state.nodes.map(row => [row.id, row]));
  for (const subject of state.subjects) {
    // Archived semesters remain valid parents of preserved records.
    if (subject.scope.kind === 'semester') { if (!semesterIds.has(subject.scope.semesterId)) fail('NOT_FOUND', '과목이 연결된 학기를 찾을 수 없습니다.'); }
    else if (!['independent', 'unassigned'].includes(subject.scope.kind)) fail('INVALID_SCOPE', '과목 소속을 확인해 주세요.');
  }
  for (const node of state.nodes) {
    if (!subjectIds.has(node.subjectId)) fail('NOT_FOUND', '목차의 과목을 찾을 수 없습니다.');
    const seen = new Set([node.id]); let parentId = node.parentId;
    while (parentId !== null) {
      if (seen.has(parentId)) fail('CYCLE', '하위 항목 안으로 이동할 수 없습니다.'); seen.add(parentId);
      const parent = nodeIndex.get(parentId);
      if (!parent) fail('NOT_FOUND', '부모 목차를 찾을 수 없습니다.');
      if (parent.subjectId !== node.subjectId) fail('SUBJECT_MISMATCH', '다른 과목의 항목 아래로 이동할 수 없습니다.');
      parentId = parent.parentId;
    }
  }
  const pairs = new Set<string>();
  for (const row of state.records) {
    if (!sessionIds.has(row.sessionId)) fail('NOT_FOUND', '원래 공부 세션을 찾을 수 없습니다.');
    const subjectId = subjectIds.has(row.targetId) ? row.targetId : nodeIndex.get(row.targetId)?.subjectId;
    if (subjectId !== row.subjectId) fail('SUBJECT_MISMATCH', '기록과 주제의 과목이 다릅니다.');
    const key = canonical([row.sessionId, row.targetId]); if (pairs.has(key)) fail('DUPLICATE_RECORD', '한 공부의 같은 대상 기록이 중복되어 있습니다.'); pairs.add(key);
    validateDateEvidence(row.dateEvidence); verifyTrace(row.trace);
    if (typeof row.body !== 'string' || typeof row.done !== 'boolean') fail('INVALID_RECORD', '공부 기록의 입력을 확인해 주세요.');
  }
  for (const row of state.sessions) validateDateEvidence(row.dateEvidence);
  if ((state.learningPlans ?? []).filter(row => !row.deletedAt).length > 1) fail('DUPLICATE_PLAN', '학습 일정의 원래 연결을 확인해 주세요.');
  for (const row of state.learningPlans ?? []) verifyLearningPlan(row.workspace, state);
  for (const row of state.studyBoards ?? []) { validateBoard(row); verifyBoardTopics(row, state); }
  for (const row of state.canvasLayouts ?? []) validateCanvasLayout(row);
  for (const row of state.codeExamples ?? []) validateCodeContent(row);
  for (const row of state.studyMaterials ?? []) {
    validateMaterialContent(row);
    if (!subjectIds.has(row.subjectId) || row.topicId !== null && nodeIndex.get(row.topicId)?.subjectId !== row.subjectId) fail('SUBJECT_MISMATCH', '자료의 과목과 주제를 확인해 주세요.');
  }
  for (const card of state.memoryCards ?? []) {
    validateMemoryCard(card);
    validateMaterialCardSource(card, state);
    if (nodeIndex.get(card.topicId)?.role !== 'topic') fail('INVALID_MEMORY_TEST', '암기 항목의 원래 주제를 찾을 수 없습니다.');
  }
  for (const test of state.memoryTests ?? []) {
    validateMemoryTest(test);
    for (const q of test.questions) if (!(state.memoryCards ?? []).some(c => c.id === q.cardId && c.topicId === q.topicId)) fail('INVALID_MEMORY_TEST', '시험 문항의 원래 항목을 찾을 수 없습니다.');
  }
  const recallTopics = new Set<string>();
  for (const row of state.recallCards ?? []) {
    validateRecallCard(row, state);
    if (!row.deletedAt && row.front === undefined) { if (recallTopics.has(row.topicId)) fail('DUPLICATE_RECALL', '주제의 복습 카드가 중복되어 있습니다.'); recallTopics.add(row.topicId); }
  }
  if ((state.recallPreferences ?? []).filter(row => !row.deletedAt).length > 1) fail('DUPLICATE_RECALL', '복습 설정이 중복되어 있습니다.');
  for (const row of state.recallPreferences ?? []) validateRecallOptions(row.options);
  for (const row of state.memos ?? []) {
    validateMemoContent(row);
    if (row.recallCardId !== undefined && !(state.recallCards ?? []).some(card => card.id === row.recallCardId && card.topicId === row.ownerId)) fail('INVALID_MEMO', '답변 메모의 원래 카드 연결을 확인해 주세요.');
    if (row.ownerId !== null && !subjectIds.has(row.ownerId) && !nodeIndex.has(row.ownerId)) fail('NOT_FOUND', '메모의 원래 연결 대상을 찾을 수 없습니다.');
  }
  for (const row of state.narratives) {
    if (row.ownerId !== null && !index.has(row.ownerId)) fail('NOT_FOUND', '본문의 원래 대상을 찾을 수 없습니다.');
    verifyNarrative(state, row);
  }
  const definitions = new Map<string, TraceDefinition>(defaultCriteriaItems().map(item => [item.id, item]));
  for (const criteria of state.criteria ?? []) {
    if (!Array.isArray(criteria.items) || criteria.items.length > 100 || new Set(criteria.items.map(item => item.id)).size !== criteria.items.length) fail('INVALID_CRITERIA', '기준의 항목과 중복 여부를 확인해 주세요.');
    for (const item of criteria.items) {
      validateTraceDefinition(item);
      const prior = definitions.get(item.id);
      if (prior && (prior.label !== item.label || prior.group !== item.group || prior.mode !== item.mode || prior.version !== item.version)) fail('CRITERIA_ID_REUSED', '뜻이나 적용 기준이 바뀐 활동은 새 항목으로 구별해 주세요.');
      definitions.set(item.id, item);
    }
  }
  const assignments = new Set<string>();
  for (const assignment of state.criteriaAssignments ?? []) {
    if (!['topic', 'subject', 'global'].includes(assignment.scope)
      || assignment.scope === 'global' && assignment.ownerId !== null
      || assignment.scope === 'subject' && !subjectIds.has(assignment.ownerId ?? '')
      || assignment.scope === 'topic' && !nodeIndex.has(assignment.ownerId ?? '')) fail('CRITERIA_OWNER', '기준을 적용할 소속을 확인해 주세요.');
    const key = JSON.stringify([assignment.scope, assignment.ownerId]);
    if (assignments.has(key)) fail('DUPLICATE_CRITERIA_ASSIGNMENT', '같은 항목에 기준 연결이 중복되어 있습니다.');
    assignments.add(key);
    const target = state.criteria?.find(criteria => criteria.id === assignment.criteriaId);
    if (!target || !assignment.deletedAt && target.deletedAt) fail('CRITERIA_REFERENCE', '기준의 원문 연결을 확인해 주세요.');
  }
  for (const row of state.revisions) if (row.userId !== state.userId || row.namespace !== state.namespace) fail('OWNERSHIP', '수정 이력의 소유자가 다릅니다.');
}
function verifyNarrative(state: AppState, row: Pick<Narrative, 'ownerId' | 'kind' | 'body'>): void {
  if (typeof row.body !== 'string') fail('INVALID_BODY', '본문은 글로 남겨 주세요.');
  if (row.kind === 'free-note') { if (row.ownerId !== null) targetSubject(state, row.ownerId, false); return; }
  if (row.ownerId === null) fail('OWNER_REQUIRED', '본문을 연결할 대상을 확인해 주세요.');
  if (row.kind === 'subject-overview') find(state.subjects, row.ownerId, false);
  else if (row.kind === 'unit-introduction') { if (find(state.nodes, row.ownerId, false).role !== 'unit') fail('INVALID_OWNER', '단원 서문은 단원에 연결해 주세요.'); }
  else if (row.kind === 'topic-note') find(state.nodes, row.ownerId, false);
  else fail('INVALID_NARRATIVE', '본문의 종류를 확인해 주세요.');
}

/** Pure transactional reducer: failure leaves the caller's state unchanged. */
export function applyCommand(state: AppState, command: Command): AppState {
  assertState(state);
  if (command.userId !== state.userId || command.namespace !== undefined && command.namespace !== state.namespace) fail('OWNERSHIP', '다른 사용자나 시험 공간의 자료를 변경할 수 없습니다.');
  identity(command.opId);
  if (typeof command.at !== 'string' || !Number.isFinite(Date.parse(command.at))) fail('INVALID_TIME', '저장 시각을 확인해 주세요.');
  const payload = canonical(command);
  if (Object.hasOwn(state.appliedOps, command.opId)) {
    if (state.appliedOps[command.opId] !== payload) fail('OPERATION_REUSED', '같은 요청 식별자에 다른 내용이 들어 있습니다.');
    return state;
  }
  const next = clone(state);
  const common = (id: string) => ({ id, userId: state.userId, namespace: state.namespace, createdAt: command.at, updatedAt: command.at, version: 1, deletedAt: null });
  const fresh = (id: string) => { identity(id); if (collections.some(k => (next[k] ?? []).some(v => v.id === id))) fail('DUPLICATE_ID', '이미 있는 식별자입니다.', { id }); };
  function write(collection: EntityCollection, entity: DomainEntity, reversesRevisionId?: string): void {
    if (collection === 'criteria') next.criteria ??= [];
    if (collection === 'criteriaAssignments') next.criteriaAssignments ??= [];
    if (collection === 'memos') next.memos ??= [];
    if (collection === 'memoryCards') next.memoryCards ??= [];
    if (collection === 'memoryTests') next.memoryTests ??= [];
    if (collection === 'learningPlans') next.learningPlans ??= [];
    if (collection === 'studyBoards') next.studyBoards ??= [];
    if (collection === 'canvasLayouts') next.canvasLayouts ??= [];
    if (collection === 'studyMaterials') next.studyMaterials ??= [];
    if (collection === 'codeExamples') next.codeExamples ??= [];
    if (collection === 'recallCards') next.recallCards ??= [];
    if (collection === 'recallPreferences') next.recallPreferences ??= [];
    const list = next[collection] as DomainEntity[];
    const index = list.findIndex(v => v.id === entity.id), before = index < 0 ? null : clone(list[index]);
    if (before && canonical(before) === canonical(entity)) return;
    const after = { ...clone(entity), updatedAt: command.at, version: before ? before.version + 1 : 1 };
    if (index < 0) list.push(after); else list[index] = after;
    const parent = [...next.revisions].reverse().find(r => r.collection === collection && r.entityId === entity.id);
    const revision: Revision = { ...common(`revision:${encodeURIComponent(command.opId)}:${next.revisions.length}`), collection, entityId: entity.id, operationId: command.opId, parentRevisionId: parent?.id ?? null, before, after: clone(after), ...(reversesRevisionId ? { reversesRevisionId } : {}) };
    next.revisions.push(revision);
  }
  const node = (id: string, version: number, active = true) => { const found = find(next.nodes, id, active); expected(found, version, command); return found; };
  switch (command.type) {
    case 'saveMemoryCard': {
      validateMemoryCard(command.content);
      const topic = find(next.nodes, command.content.topicId);
      if (topic.role !== 'topic') fail('INVALID_MEMORY_TEST', '암기 항목을 연결할 주제를 선택해 주세요.');
      targetSubject(next, topic.id);
      const old = next.memoryCards?.find(c => c.id === command.id);
      validateMaterialCardSource(command.content, next, !old);
      if (old) { find(next.memoryCards!, old.id); expected(old, command.expectedVersion, command); if (old.topicId !== command.content.topicId) fail('INVALID_MEMORY_TEST', '기존 항목의 주제는 유지해 주세요. 다른 주제에는 새 항목으로 등록할 수 있습니다.'); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '항목의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('memoryCards', { ...(old ?? common(command.id)), ...clone(command.content) }); break;
    }
    case 'trashMemoryCard': case 'restoreMemoryCard': {
      const card = find(next.memoryCards ?? [], command.id, command.type === 'trashMemoryCard'); expected(card, command.expectedVersion, command);
      write('memoryCards', { ...card, deletedAt: command.type === 'trashMemoryCard' ? command.at : null }); break;
    }
    case 'saveMemoryTest': {
      validateMemoryTest(command.content); fresh(command.id);
      for (const q of command.content.questions) {
        const card = find(next.memoryCards ?? [], q.cardId, false);
        const source = card.version === q.cardVersion ? card : next.revisions.find(r => r.collection === 'memoryCards' && r.entityId === card.id && r.after.version === q.cardVersion)?.after as import('./memory-test').MemoryCard | undefined;
        if (!source || source.topicId !== q.topicId || source.question !== q.question || source.answer !== q.answer || canonical(source.strokes) !== canonical(q.strokes)) fail('INVALID_MEMORY_TEST', '출제 당시의 질문과 기준 답안을 확인해 주세요.');
      }
      write('memoryTests', { ...common(command.id), ...clone(command.content) }); break;
    }
    case 'saveStudyMaterial': {
      validateMaterialContent(command.content);
      find(next.subjects, command.content.subjectId);
      if (command.content.topicId !== null && targetSubject(next, command.content.topicId) !== command.content.subjectId) fail('SUBJECT_MISMATCH', '선택한 주제가 이 과목에 속하지 않습니다.');
      const old = next.studyMaterials?.find(row => row.id === command.id);
      if (old) { find(next.studyMaterials!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '자료의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('studyMaterials', { ...(old ?? common(command.id)), ...materialContent(command.content) }); break;
    }
    case 'trashStudyMaterial': case 'restoreStudyMaterial': {
      const row = find(next.studyMaterials ?? [], command.id, command.type === 'trashStudyMaterial'); expected(row, command.expectedVersion, command);
      write('studyMaterials', { ...row, deletedAt: command.type === 'trashStudyMaterial' ? command.at : null }); break;
    }
    case 'saveRecallPreferences': {
      validateRecallOptions(command.options);
      const old = next.recallPreferences?.find(row => row.id === command.id);
      if (old) { find(next.recallPreferences!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '복습 설정의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('recallPreferences', { ...(old ?? common(command.id)), options: clone(command.options) }); break;
    }
    case 'undoRecallReview': {
      const card = find(next.recallCards ?? [], command.id); expected(card, command.expectedVersion, command);
      const review = card.reviews.at(-1);
      const revision = [...next.revisions].reverse().find(row => row.collection === 'recallCards' && row.entityId === card.id);
      if (!review || review.id !== command.reviewId || revision?.operationId !== command.reviewId || revision.reversesRevisionId)
        fail('UNDO_CONFLICT', '평가 후 다른 변경이 있습니다. 현재 내용과 이력을 확인해 주세요.');
      // Retain the original memo and evaluation in the revision log; restore only this card.
      const restored = revision.before as import('./model').RecallCard | null;
      write('recallCards', restored ?? { ...card, memory: clone(review.before), reviews: card.reviews.slice(0, -1) }, revision.id);
      break;
    }
    case 'saveRecallCard': case 'saveRecallReference': case 'setRecallDue': case 'reviewRecallCard': {
      const topic = find(next.nodes, command.topicId); targetSubject(next, topic.id);
      if (topic.role !== 'topic') fail('INVALID_RECALL', '복습 카드는 공부 주제에 연결해 주세요.');
      const old = next.recallCards?.find(row => row.id === command.id);
      if (old) { find(next.recallCards!, old.id); expected(old, command.expectedVersion, command); if (old.topicId !== topic.id) fail('INVALID_RECALL', '복습 카드의 원래 주제를 보존해 주세요.'); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '복습 카드의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      const card = old ?? { ...common(command.id), topicId: topic.id, reference: '', memory: newRecallMemory(command.at), reviews: [] };
      if (command.type === 'saveRecallCard') write('recallCards', { ...card, front: command.front, reference: command.reference });
      else if (command.type === 'saveRecallReference') write('recallCards', { ...card, reference: command.reference });
      else if (command.type === 'setRecallDue') {
        if (typeof command.due !== 'string' || !Number.isFinite(Date.parse(command.due))) fail('INVALID_RECALL', '다음 복습 날짜를 확인해 주세요.');
        write('recallCards', { ...card, manualDue: command.due });
      } else {
        if (![1, 2, 3, 4].includes(command.rating)) fail('INVALID_RECALL', '자기 평가를 선택해 주세요.');
        if (card.memory.last_review && Date.parse(command.at) < Date.parse(card.memory.last_review)) fail('INVALID_TIME', '지난 복습 이후의 시각으로 기록해 주세요.');
        let memoId: string | null = null;
        if (command.memo) {
          validateMemoContent({ ...command.memo, ownerId: topic.id });
          if (!command.memo.body.trim() && !command.memo.strokes.length) fail('INVALID_RECALL', '빈 메모 대신 자기 평가만 저장해 주세요.');
          memoId = command.memo.id;
          const saved = next.memos?.find(row => row.id === memoId);
          if (saved) { if (saved.deletedAt || saved.ownerId !== topic.id || saved.recallCardId !== undefined && saved.recallCardId !== card.id || saved.body !== command.memo.body || canonical(saved.strokes) !== canonical(command.memo.strokes)) fail('VERSION_CONFLICT', '답변 메모가 바뀌었습니다. 초안을 보존했습니다.'); }
          else { fresh(memoId); write('memos', { ...common(memoId), ownerId: topic.id, recallCardId: card.id, body: command.memo.body, strokes: clone(command.memo.strokes) }); }
        }
        const options = recallOptions(next), memory = serializeMemory(recallPreview(card.memory, command.at, options, card.reviews)[command.rating].card);
        const { manualDue: _manualDue, ...base } = card;
        write('recallCards', { ...base, memory, reviews: [...card.reviews, { id: command.opId, at: command.at, rating: command.rating, memoId, before: clone(card.memory), after: clone(memory), options: clone(options) }] });
      }
      break;
    }
    case 'saveCodeExample': {
      validateCodeContent(command.content);
      const old = next.codeExamples?.find(row => row.id === command.id);
      if (old) { find(next.codeExamples!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '코드 예제의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('codeExamples', { ...(old ?? common(command.id)), ...clone(codeContent(command.content)) });
      break;
    }
    case 'trashCodeExample': case 'restoreCodeExample': {
      const row = find(next.codeExamples ?? [], command.id, command.type === 'trashCodeExample'); expected(row, command.expectedVersion, command);
      write('codeExamples', { ...row, deletedAt: command.type === 'trashCodeExample' ? command.at : null });
      break;
    }
    case 'saveStudyBoard': {
      validateBoard(command.content); verifyBoardTopics(command.content, next);
      const old = next.studyBoards?.find(row => row.id === command.id);
      if (old) { find(next.studyBoards!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '보드의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('studyBoards', { ...(old ?? common(command.id)), ...clone(boardContent(command.content)) });
      break;
    }
    case 'saveCanvasLayout': {
      validateCanvasLayout(command);
      const old = next.canvasLayouts?.find(row => row.id === command.id);
      if (old) { find(next.canvasLayouts!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', 'Canvas 배치의 수정 순서를 확인해 주세요.'); fresh(command.id); }
      write('canvasLayouts', { ...(old ?? common(command.id)), positions: clone(command.positions), links: clone(command.links), ...(command.viewport ? { viewport: clone(command.viewport) } : {}) });
      break;
    }
    case 'saveLearningPlan': {
      verifyLearningPlan(command.workspace, next);
      const row = next.learningPlans?.find(item => item.id === command.id);
      if (row) expected(row, command.expectedVersion, command);
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '학습 일정이 바뀌었습니다. 작성 내용을 유지했습니다.'); fresh(command.id); }
      write('learningPlans', { ...(row ?? common(command.id)), workspace: clone(command.workspace) });
      break;
    }
    case 'addSemester': fresh(command.id); write('semesters', { ...common(command.id), name: title(command.name), order: next.semesters.length }); break;
    case 'addSubject': fresh(command.id); verifyScope(next, command.scope); write('subjects', { ...common(command.id), name: title(command.name), scope: clone(command.scope), order: next.subjects.length }); break;
    case 'createOutlineTable': {
      if (command.expectedToken !== outlineTableToken(next)) fail('OUTLINE_STALE', '목차가 변경되었습니다. 입력은 유지하고 생성할 구조를 다시 확인해 주세요.');
      const preview = previewOutlineTable(next, command);
      if (!preview.ready) fail('OUTLINE_CHOICE_REQUIRED', '같은 이름의 항목을 어떻게 사용할지 먼저 골라 주세요.');
      if (!preview.newCount) fail('EMPTY_OUTLINE_TABLE', '새로 만들 항목이 없습니다. 기존 항목 연결을 확인해 주세요.');
      if (!command.ids || typeof command.ids !== 'object' || Array.isArray(command.ids)) fail('INVALID_ID', '새 항목의 식별자를 확인해 주세요.');
      const used = new Set<string>(), resolved = new Map<string, string>();
      for (const entry of preview.entries) if (entry.status === 'new') {
        if (!Object.hasOwn(command.ids, entry.key)) fail('INVALID_ID', '새 항목의 식별자를 확인해 주세요.');
        const id = command.ids[entry.key]; fresh(id);
        if (used.has(id)) fail('DUPLICATE_ID', '추가할 항목의 식별자가 겹쳤습니다.'); used.add(id);
      }
      for (const entry of preview.entries) {
        if (entry.status === 'reuse') { resolved.set(entry.key, entry.id!); continue; }
        const id = command.ids[entry.key];
        if (entry.kind === 'subject') write('subjects', { ...common(id), name: entry.name, scope: clone(command.scope), order: Math.max(-1, ...next.subjects.map(row => row.order)) + 1 });
        else {
          const subjectId = resolved.get(entry.subjectKey)!, parentId = entry.kind === 'unit' ? null : resolved.get(entry.parentKey!)!;
          const order = Math.max(-1, ...next.nodes.filter(row => row.subjectId === subjectId && row.parentId === parentId).map(row => row.order)) + 1;
          write('nodes', { ...common(id), name: entry.name, subjectId, parentId, role: entry.kind, order });
        }
        resolved.set(entry.key, id);
      }
      break;
    }
    case 'addNode': {
      fresh(command.id); find(next.subjects, command.subjectId);
      if (!['unit', 'outline', 'topic'].includes(command.role)) fail('INVALID_ROLE', '목차 항목의 역할을 확인해 주세요.');
      if (command.parentId !== null && targetSubject(next, command.parentId) !== command.subjectId) fail('SUBJECT_MISMATCH', '부모 항목의 과목이 다릅니다.');
      if (command.parentId !== null) find(next.nodes, command.parentId);
      const order = Math.max(-1, ...next.nodes.filter(n => n.subjectId === command.subjectId && n.parentId === command.parentId).map(n => n.order)) + 1;
      write('nodes', { ...common(command.id), subjectId: command.subjectId, parentId: command.parentId, role: command.role, name: title(command.name), order }); break;
    }
    case 'addNodes': case 'reorderNodes': {
      find(next.subjects, command.subjectId);
      if (command.parentId !== null) {
        const parent = find(next.nodes, command.parentId);
        if (targetSubject(next, parent.id) !== command.subjectId) fail('SUBJECT_MISMATCH', '부모 항목의 과목이 다릅니다.');
      }
      if (command.expectedToken !== outlineRevisionToken(next, command.subjectId, command.parentId)) fail('OUTLINE_STALE', '목차가 변경되었습니다. 입력은 유지하고 현재 구조를 다시 확인해 주세요.');
      const siblings = next.nodes.filter(row => row.subjectId === command.subjectId && row.parentId === command.parentId && !row.deletedAt);
      if (command.type === 'reorderNodes') {
        if (!Array.isArray(command.ids) || command.ids.length !== siblings.length || new Set(command.ids).size !== command.ids.length) fail('INVALID_ORDER', '같은 위치의 항목 전체를 한 번씩 정렬해 주세요.');
        const byId = new Map(siblings.map(row => [row.id, row]));
        for (const id of command.ids) { identity(id); if (!byId.has(id)) fail('INVALID_ORDER', '같은 과목과 부모 아래의 항목만 정렬할 수 있습니다.'); }
        command.ids.forEach((id, order) => write('nodes', { ...byId.get(id)!, order }));
      } else {
        if (!['unit', 'outline', 'topic'].includes(command.role)) fail('INVALID_ROLE', '목차 항목의 역할을 확인해 주세요.');
        if (!Array.isArray(command.entries) || !command.entries.length || command.entries.length > MAX_OUTLINE_ROWS || command.entries.some(entry => !entry || typeof entry !== 'object')) fail('INVALID_OUTLINE_ROWS', `추가할 항목을 1개부터 ${MAX_OUTLINE_ROWS}개까지 확인해 주세요.`);
        const preview = previewOutlineEntries(command.entries.map(entry => entry.name));
        if (preview.issues.length || preview.entries.length !== command.entries.length) fail('INVALID_OUTLINE_ROWS', '빈 이름·반복된 이름·길이를 미리보기에서 확인해 주세요.', preview.issues);
        if (command.duplicateNames !== 'create' && preview.entries.some(entry => siblings.some(row => row.name === entry.name))) fail('DUPLICATE_NAME_CHOICE', '같은 이름의 항목이 있습니다. 기존 항목을 사용할지 새로 만들지 골라 주세요.');
        const ids = new Set<string>();
        for (const entry of command.entries) { fresh(entry.id); if (ids.has(entry.id)) fail('DUPLICATE_ID', '추가할 항목의 식별자가 겹쳤습니다.'); ids.add(entry.id); }
        let order = Math.max(-1, ...next.nodes.filter(row => row.subjectId === command.subjectId && row.parentId === command.parentId).map(row => row.order)) + 1;
        command.entries.forEach((entry, index) => write('nodes', { ...common(entry.id), subjectId: command.subjectId, parentId: command.parentId, role: command.role, name: preview.entries[index].name, order: order++ }));
      }
      break;
    }
    case 'renameNode': { const row = node(command.id, command.expectedVersion); write('nodes', { ...row, name: title(command.name) }); break; }
    case 'moveNode': {
      const row = node(command.id, command.expectedVersion);
      if (command.parentId !== null) { const parent = find(next.nodes, command.parentId); if (targetSubject(next, parent.id) !== row.subjectId) fail('SUBJECT_MISMATCH', '과목 간 이동은 별도 복사 절차가 필요합니다.'); }
      const order = command.order ?? next.nodes.filter(n => n.subjectId === row.subjectId && n.parentId === command.parentId).length;
      if (!Number.isSafeInteger(order) || order < 0) fail('INVALID_ORDER', '정렬 순서를 확인해 주세요.');
      write('nodes', { ...row, parentId: command.parentId, order }); break;
    }
    case 'trashNode': {
      const root = node(command.id, command.expectedVersion), ids = new Set([root.id]);
      let changed = true; while (changed) { changed = false; for (const row of next.nodes) if (row.parentId && ids.has(row.parentId) && !ids.has(row.id)) { ids.add(row.id); changed = true; } }
      for (const row of [...next.nodes]) if (ids.has(row.id) && !row.deletedAt) write('nodes', { ...row, deletedAt: command.at, deletionBatchId: command.opId });
      break;
    }
    case 'restoreNode': {
      const root = node(command.id, command.expectedVersion, false);
      if (!root.deletedAt) break;
      if (root.parentId && find(next.nodes, root.parentId, false).deletedAt) fail('PARENT_DELETED', '상위 항목을 먼저 복원해 주세요.');
      const batch = root.deletionBatchId;
      for (const row of [...next.nodes]) if (row.id === root.id || batch && row.deletionBatchId === batch) { const copy = { ...row, deletedAt: null }; delete copy.deletionBatchId; write('nodes', copy); }
      break;
    }
    case 'saveRecords': {
      validateDateEvidence(command.dateEvidence); identity(command.sessionId);
      if (!command.entries.length) fail('EMPTY_RECORD', '공부한 대상을 하나 이상 골라 주세요.');
      if (new Set(command.entries.map(e => e.targetId)).size !== command.entries.length) fail('DUPLICATE_TARGET', '같은 대상을 두 번 기록할 수 없습니다.');
      const session = next.sessions.find(s => s.id === command.sessionId);
      if (session?.deletedAt) fail('DELETED_SESSION', '휴지통의 공부 기록은 먼저 복원해 주세요.');
      if (!session) { fresh(command.sessionId); write('sessions', { ...common(command.sessionId), dateEvidence: clone(command.dateEvidence) }); }
      for (const entry of command.entries) {
        const subjectId = targetSubject(next, entry.targetId);
        if (entry.subjectId !== undefined && entry.subjectId !== subjectId) fail('SUBJECT_MISMATCH', '기록의 과목과 대상이 다릅니다.');
        const old = next.records.find(r => r.sessionId === command.sessionId && r.targetId === entry.targetId);
        if (old) expected(old, entry.expectedVersion ?? -1, command);
        const id = old?.id ?? `record:${encodeURIComponent(command.sessionId)}:${encodeURIComponent(entry.targetId)}`;
        if (!old) fresh(id);
        const trace = entry.trace ? mergeTrace(old?.trace ?? {}, entry.trace) : old?.trace ?? {};
        write('records', { ...(old ?? common(id)), sessionId: command.sessionId, subjectId, targetId: entry.targetId, done: entry.done, body: entry.body ?? old?.body ?? '', dateEvidence: clone(command.dateEvidence), trace });
      }
      break;
    }
    case 'updateRecord': {
      const row = find(next.records, command.id); expected(row, command.expectedVersion, command.patch);
      if (Object.keys(command.patch).some(k => !['body', 'done', 'dateEvidence', 'trace'].includes(k))) fail('INVALID_PATCH', '기록의 소속은 일반 수정으로 바꿀 수 없습니다.');
      write('records', { ...row, ...clone(command.patch), trace: command.patch.trace ? mergeTrace(row.trace, command.patch.trace) : row.trace }); break;
    }
    case 'updateNarrative': {
      const old = next.narratives.find(n => n.id === command.id);
      if (old) { expected(old, command.expectedVersion, command.body); if (old.kind !== command.kind || old.ownerId !== command.ownerId) fail('OWNER_CHANGED', '본문의 연결 대상은 일반 수정으로 바꿀 수 없습니다.'); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '본문의 저장 상태를 확인해 주세요.'); fresh(command.id); }
      const value = { ...(old ?? common(command.id)), kind: command.kind, ownerId: command.ownerId, body: command.body };
      verifyNarrative(next, value); write('narratives', value); break;
    }
    case 'saveMemo': {
      const old = next.memos?.find(row => row.id === command.id);
      if (old) { find(next.memos!, old.id); expected(old, command.expectedVersion, command); }
      else { if (command.expectedVersion !== 0) fail('VERSION_CONFLICT', '메모의 저장 상태를 확인해 주세요.'); fresh(command.id); }
      validateMemoContent(command);
      if (command.ownerId !== null) targetSubject(next, command.ownerId, old?.ownerId !== command.ownerId);
      if (command.recallCardId !== undefined && !(next.recallCards ?? []).some(card => !card.deletedAt && card.id === command.recallCardId && card.topicId === command.ownerId)) fail('INVALID_MEMO', '답변 메모의 카드 연결을 확인해 주세요.');
      write('memos', { ...(old ?? common(command.id)), ...(command.recallCardId ? { recallCardId: command.recallCardId } : {}), ownerId: command.ownerId, body: command.body, strokes: clone(command.strokes) });
      break;
    }
    case 'trashMemo': case 'restoreMemo': {
      const row = find(next.memos ?? [], command.id, command.type === 'trashMemo'); expected(row, command.expectedVersion, command);
      write('memos', { ...row, deletedAt: command.type === 'trashMemo' ? command.at : null });
      break;
    }
    case 'adjustCriteria': {
      find(next.nodes, command.targetId); targetSubject(next, command.targetId);
      if (command.expectedToken !== criteriaRevisionToken(next)) fail('CRITERIA_STALE', '기준이나 목차가 변경되었습니다. 입력은 유지하고 현재 범위를 다시 확인해 주세요.');
      fresh(command.id);
      if (!Array.isArray(command.items) || command.items.length > 100 || new Set(command.items.map(item => item.id)).size !== command.items.length) fail('INVALID_CRITERIA', '기준은 서로 다른 항목 100개까지 조정할 수 있습니다.');
      const known = new Map<string, TraceDefinition>(defaultCriteriaItems().map(item => [item.id, item]));
      for (const criteria of next.criteria ?? []) for (const item of criteria.items) known.set(item.id, item);
      for (const item of command.items) {
        validateTraceDefinition(item);
        if (item.label.length > 180) fail('INVALID_CRITERIA', '항목 문구는 180자 이내로 입력해 주세요.');
        const old = known.get(item.id);
        if (old && canonical(old) !== canonical(item)) fail('CRITERIA_ID_REUSED', '뜻이나 적용 기준이 바뀐 활동은 새 항목으로 구별해 주세요.');
      }
      const targets = criteriaScopeTargets(next, command.targetId, command.scope);
      write('criteria', { ...common(command.id), items: clone(command.items) });
      for (const target of targets) {
        const old = next.criteriaAssignments?.find(row => row.scope === target.scope && row.ownerId === target.ownerId);
        let suffix = next.revisions.length;
        while (!old && collections.some(collection => (next[collection] ?? []).some(row => row.id === `criteria-assignment:${suffix}`))) suffix++;
        const id = old?.id ?? `criteria-assignment:${suffix}`;
        if (!old) fresh(id);
        const assignment: CriteriaAssignment = { ...(old ?? common(id)), ...target, criteriaId: command.id, deletedAt: null };
        delete assignment.deletionBatchId;
        write('criteriaAssignments', assignment);
      }
      break;
    }
    case 'editWrittenReview': case 'confirmWrittenReview': case 'unconfirmWrittenReview': {
      const row = find(next.records, command.recordId); expected(row, command.expectedVersion, command);
      const trace = clone(row.trace), item = trace[WRITTEN_REVIEW_ITEM_ID] ?? { status: 'unchecked' as const };
      if (command.type === 'editWrittenReview') {
        if (typeof command.answer !== 'string') fail('INVALID_BODY', '서술을 글로 입력해 주세요.');
        item.examReview = { answer: command.answer, checked: false, updatedAt: command.at };
      } else if (command.type === 'unconfirmWrittenReview') {
        if (item.examReview) item.examReview = { ...item.examReview, checked: false, updatedAt: command.at };
      } else {
        if (!item.examReview?.answer.trim()) fail('EMPTY_WRITTEN_REVIEW', '점검하려면 먼저 자기 문장으로 서술해 주세요.');
        item.status = 'checked'; item.examReview = { ...item.examReview, checked: true, updatedAt: command.at };
      }
      trace[WRITTEN_REVIEW_ITEM_ID] = item; write('records', { ...row, trace }); break;
    }
    case 'undoRevision': {
      const revision = next.revisions.find(r => r.id === command.revisionId);
      if (!revision) fail('NOT_FOUND', '되돌릴 수정 이력을 찾을 수 없습니다.');
      const row = find((next[revision.collection] ?? []) as DomainEntity[], revision.entityId, false);
      expected(row, command.expectedVersion, command);
      const latest = [...next.revisions].reverse().find(r => r.collection === revision.collection && r.entityId === revision.entityId);
      if (latest?.id !== revision.id) fail('UNDO_CONFLICT', '그 뒤의 변경이 있습니다. 현재 원문과 이력을 비교해 주세요.');
      // Undo the entire operation atomically; never partly revert a bulk edit.
      const group = next.revisions.filter(r => r.operationId === revision.operationId);
      const affectedInGroup = new Set(group.map(r => r.entityId));
      for (const item of group) {
        if (item.before === null) {
          const external = (row: DomainEntity) => !row.deletedAt && !affectedInGroup.has(row.id);
          const referenced = next.subjects.some(s => external(s) && s.scope.kind === 'semester' && s.scope.semesterId === item.entityId)
            || next.nodes.some(n => external(n) && (n.subjectId === item.entityId || n.parentId === item.entityId))
            || next.records.some(r => external(r) && (r.sessionId === item.entityId || r.targetId === item.entityId))
            || next.narratives.some(n => external(n) && n.ownerId === item.entityId)
            || (next.memos ?? []).some(memo => external(memo) && memo.ownerId === item.entityId)
            || (next.recallCards ?? []).some(card => external(card) && (card.topicId === item.entityId || card.reviews.some(review => review.memoId === item.entityId)))
            || (next.criteriaAssignments ?? []).some(assignment => external(assignment) && (assignment.criteriaId === item.entityId || assignment.ownerId === item.entityId));
          if (referenced) fail('UNDO_DEPENDENCY', '그 뒤 연결된 내용이 있습니다. 항목을 지우지 않고 현재 자료를 보존했습니다.');
        }
        const current = find((next[item.collection] ?? []) as DomainEntity[], item.entityId, false);
        if (current.version !== item.after.version || [...next.revisions].reverse().find(r => r.collection === item.collection && r.entityId === item.entityId)?.id !== item.id) fail('UNDO_CONFLICT', '함께 변경한 항목이 다시 수정되어 자동으로 되돌릴 수 없습니다.');
      }
      for (const item of group) {
        const current = find((next[item.collection] ?? []) as DomainEntity[], item.entityId, false);
        const restored = item.before ? { ...clone(item.before), version: current.version } : { ...current, deletedAt: command.at, deletionBatchId: command.opId };
        write(item.collection, restored, item.id);
      }
      break;
    }
    default: fail('UNKNOWN_COMMAND', '지원하지 않는 조작입니다.');
  }
  Object.defineProperty(next.appliedOps, command.opId, { value: payload, enumerable: true, configurable: true, writable: true });
  assertState(next); return next;
}

/** Repository boundary alias. Never repair/reset malformed input implicitly. */
export const validateState = assertState;
