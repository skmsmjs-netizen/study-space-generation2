import { DomainError, type AppState, type Command, type DateEvidence, type DomainEntity, type EntityCollection, type Narrative, type OutlineNode, type Revision, type Scope, type StudyRecord, type TraceState } from './model';
import { TRACE_ITEMS, WRITTEN_REVIEW_ITEM_ID } from './trace';

const collections: EntityCollection[] = ['semesters', 'subjects', 'nodes', 'sessions', 'records', 'narratives'];
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
    const definition = previous[id]?.definition || (() => { const original = TRACE_ITEMS.find(t => t.id === id); return original ? { id, group: original.group, label: original.label, mode: original.mode, version: 1 } : undefined; })();
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
  for (const name of collections) for (const row of state[name]) {
    identity(row.id);
    if (globallyUnique.has(row.id)) fail('DUPLICATE_ID', '같은 식별자가 중복되어 있습니다.', { id: row.id }); globallyUnique.add(row.id);
    if (row.userId !== state.userId || row.namespace !== state.namespace) fail('OWNERSHIP', '다른 사용자나 시험 공간의 자료를 함께 처리할 수 없습니다.');
    if (!Number.isInteger(row.version) || row.version < 1) fail('INVALID_VERSION', '수정 순서를 확인해 주세요.');
  }
  // Validate large snapshots through indexes; repeated array scans made record checks quadratic.
  const index = new Map(collections.flatMap(name => state[name].map(row => [row.id, row] as const)));
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
  for (const row of state.narratives) {
    if (row.ownerId !== null && !index.has(row.ownerId)) fail('NOT_FOUND', '본문의 원래 대상을 찾을 수 없습니다.');
    verifyNarrative(state, row);
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
  const fresh = (id: string) => { identity(id); if (collections.some(k => next[k].some(v => v.id === id))) fail('DUPLICATE_ID', '이미 있는 식별자입니다.', { id }); };
  function write(collection: EntityCollection, entity: DomainEntity, reversesRevisionId?: string): void {
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
    case 'addSemester': fresh(command.id); write('semesters', { ...common(command.id), name: title(command.name), order: next.semesters.length }); break;
    case 'addSubject': fresh(command.id); verifyScope(next, command.scope); write('subjects', { ...common(command.id), name: title(command.name), scope: clone(command.scope), order: next.subjects.length }); break;
    case 'addNode': {
      fresh(command.id); find(next.subjects, command.subjectId);
      if (!['unit', 'outline', 'topic'].includes(command.role)) fail('INVALID_ROLE', '목차 항목의 역할을 확인해 주세요.');
      if (command.parentId !== null && targetSubject(next, command.parentId) !== command.subjectId) fail('SUBJECT_MISMATCH', '부모 항목의 과목이 다릅니다.');
      if (command.parentId !== null) find(next.nodes, command.parentId);
      write('nodes', { ...common(command.id), subjectId: command.subjectId, parentId: command.parentId, role: command.role, name: title(command.name), order: next.nodes.filter(n => n.subjectId === command.subjectId && n.parentId === command.parentId).length }); break;
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
      const row = find(next[revision.collection] as DomainEntity[], revision.entityId, false);
      expected(row, command.expectedVersion, command);
      const latest = [...next.revisions].reverse().find(r => r.collection === revision.collection && r.entityId === revision.entityId);
      if (latest?.id !== revision.id) fail('UNDO_CONFLICT', '그 뒤의 변경이 있습니다. 현재 원문과 이력을 비교해 주세요.');
      // Undo the entire operation atomically; never partly revert a bulk edit.
      const group = next.revisions.filter(r => r.operationId === revision.operationId);
      const createdInGroup = new Set(group.filter(r => r.before === null).map(r => r.entityId));
      for (const item of group) {
        if (item.before === null) {
          const external = (row: DomainEntity) => !row.deletedAt && !createdInGroup.has(row.id);
          const referenced = next.subjects.some(s => external(s) && s.scope.kind === 'semester' && s.scope.semesterId === item.entityId)
            || next.nodes.some(n => external(n) && (n.subjectId === item.entityId || n.parentId === item.entityId))
            || next.records.some(r => external(r) && (r.sessionId === item.entityId || r.targetId === item.entityId))
            || next.narratives.some(n => external(n) && n.ownerId === item.entityId);
          if (referenced) fail('UNDO_DEPENDENCY', '그 뒤 연결된 내용이 있습니다. 항목을 지우지 않고 현재 자료를 보존했습니다.');
        }
        const current = find(next[item.collection] as DomainEntity[], item.entityId, false);
        if (current.version !== item.after.version || [...next.revisions].reverse().find(r => r.collection === item.collection && r.entityId === item.entityId)?.id !== item.id) fail('UNDO_CONFLICT', '함께 변경한 항목이 다시 수정되어 자동으로 되돌릴 수 없습니다.');
      }
      for (const item of group) {
        const current = find(next[item.collection] as DomainEntity[], item.entityId, false);
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
