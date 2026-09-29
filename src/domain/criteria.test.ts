import { describe, expect, it } from 'vitest';
import { applyCommand, validateState } from './commands';
import { criteriaRevisionToken, defaultCriteriaItems, prepareCriteriaItems, resolveCriteria } from './criteria';
import { createDemoState } from './fixtures';
import { DomainError, type AppState, type Command, type CriteriaChange, type TraceDefinition } from './model';

const topic = 'demo-topic-function';
const ctx = (opId: string) => ({ opId, at: '2026-09-30T01:00:00.000Z', userId: 'demo-learner', namespace: 'demo' as const });
const code = (fn: () => unknown) => { try { fn(); return null; } catch (error) { return error instanceof DomainError ? error.code : String(error); } };
function adjust(state: AppState, id: string, scope: CriteriaChange['scope'] = 'topic', targetId = topic, items = defaultCriteriaItems()) {
  return applyCommand(state, { ...ctx(id), type: 'adjustCriteria', id, scope, targetId, items, expectedToken: criteriaRevisionToken(state) });
}
function save(state: AppState, id: string, definition: TraceDefinition) {
  return applyCommand(state, { ...ctx(id), type: 'saveRecords', sessionId: id, dateEvidence: { kind: 'unknown' }, entries: [{ targetId: topic, done: true, trace: { [definition.id]: { status: 'checked', definition, note: '  수행 당시 원문\n\n' } } }] });
}

describe('personal criteria preserve original meanings', () => {
  it('reads an old schema-1 snapshot as default without adding or rewriting collections', () => {
    const state = createDemoState(), original = JSON.stringify(state);
    validateState(state);
    expect(resolveCriteria(state, topic).items).toEqual(defaultCriteriaItems());
    expect(state.criteria).toBeUndefined(); expect(state.criteriaAssignments).toBeUndefined();
    expect(JSON.stringify(state)).toBe(original);
  });

  it('retains an unchanged identity and assigns new IDs for label, group and applicability changes', () => {
    const prior = defaultCriteriaItems(); let sequence = 0;
    const rows = prior.slice(0, 4).map(item => ({ ...item }));
    rows[1].label = '  바꾼 의미  '; rows[2].group = 'E'; rows[3].mode = 'optional';
    const result = prepareCriteriaItems(prior, rows, () => `new-${++sequence}`);
    expect(result[0]).toEqual(prior[0]);
    expect(result.slice(1).map(item => item.id)).toEqual(['Tx_new-1', 'Ex_new-2', 'Rx_new-3']);
    expect(result[1].label).toBe('바꾼 의미');
    expect(prior[1].label).not.toBe('바꾼 의미');
  });

  it('applies a topic adjustment only to that item and never creates study evidence', () => {
    const state = createDemoState();
    const next = adjust(state, 'topic-criteria');
    expect(resolveCriteria(next, topic).id).toBe('topic-criteria');
    expect(resolveCriteria(next, 'demo-topic-graph').id).toBe('trace-v4-default');
    expect(next.records).toEqual(state.records); expect(next.sessions).toEqual(state.sessions);
    expect(next.criteriaAssignments).toHaveLength(1);
  });

  it('applies a subject criterion to existing items and future children without touching another subject', () => {
    let state = adjust(createDemoState(), 'subject-criteria', 'subject');
    state = applyCommand(state, { ...ctx('new-topic'), type: 'addNode', id: 'future-topic', subjectId: 'demo-subject-math', parentId: null, name: '새 주제', role: 'topic' });
    expect(resolveCriteria(state, 'future-topic').id).toBe('subject-criteria');
    expect(resolveCriteria(state, 'demo-topic-graph').id).toBe('subject-criteria');
    expect(resolveCriteria(state, 'demo-topic-force').id).toBe('trace-v4-default');
  });

  it('matches the original broad apply semantics: global replaces existing overrides and becomes the default for new subjects', () => {
    let state = adjust(createDemoState(), 'specific', 'topic');
    state = adjust(state, 'all-criteria', 'all');
    expect(resolveCriteria(state, topic).id).toBe('all-criteria');
    expect(resolveCriteria(state, 'demo-topic-force').id).toBe('all-criteria');
    state = applyCommand(state, { ...ctx('future-subject'), type: 'addSubject', id: 'future-subject', name: '새 과목', scope: { kind: 'unassigned' } });
    state = applyCommand(state, { ...ctx('future-child'), type: 'addNode', id: 'future-child', subjectId: 'future-subject', parentId: null, name: '새 항목', role: 'topic' });
    expect(resolveCriteria(state, 'future-child').id).toBe('all-criteria');
    expect(state.criteria?.find(row => row.id === 'specific')?.items).toEqual(defaultCriteriaItems());
  });

  it('never translates old checks into new identities or rewrites definitions in past records', () => {
    const original = defaultCriteriaItems()[0];
    let state = save(createDemoState(), 'old-study', original);
    const oldRecord = structuredClone(state.records[0]);
    const changed = prepareCriteriaItems(defaultCriteriaItems(), [{ ...original, label: '새 질문을 생각해보았다.' }], () => 'changed');
    state = adjust(state, 'new-definition', 'topic', topic, changed);
    expect(state.records[0]).toEqual(oldRecord);
    state = save(state, 'new-study', resolveCriteria(state, topic).items[0]);
    expect(Object.keys(state.records[1].trace)).toEqual(['Tx_changed']);
    expect(state.records[1].trace.Td1).toBeUndefined();
    expect(state.records[0]).toEqual(oldRecord);
  });

  it('preserves a resumed draft snapshot instead of replacing it with the default label on first save', () => {
    const original = { ...defaultCriteriaItems()[0], label: '  이 사건 당시 정의\n원문  ', version: 7 };
    const state = save(createDemoState(), 'draft-event', original);
    expect(state.records[0].trace.Td1.definition).toEqual(original);
    const row = state.records[0];
    const next = applyCommand(state, { ...ctx('normal-edit'), type: 'updateRecord', id: row.id, expectedVersion: row.version, patch: { trace: { Td1: { status: 'deferred', definition: defaultCriteriaItems()[0] } } } });
    expect(next.records[0].trace.Td1.definition).toEqual(original);
    expect(next.records[0].trace.Td1.note).toBe('  수행 당시 원문\n\n');
  });

  it('validates snapshot shape before preserving it and rejects identity reuse with changed meaning', () => {
    const state = createDemoState();
    expect(code(() => save(state, 'mismatched-definition', { ...defaultCriteriaItems()[0], version: 0 }))).toBe('INVALID_TRACE_DEFINITION');
    expect(code(() => adjust(state, 'forged-definition', 'topic', topic, [{ ...defaultCriteriaItems()[0], label: '다른 뜻' }]))).toBe('CRITERIA_ID_REUSED');
    expect(state.criteria).toBeUndefined();
  });

  it('rejects stale previews and duplicate items without publishing any part of the operation', () => {
    const initial = createDemoState(), token = criteriaRevisionToken(initial);
    const next = adjust(initial, 'other-adjustment');
    const stale: Command = { ...ctx('stale'), type: 'adjustCriteria', id: 'stale', targetId: topic, scope: 'all', expectedToken: token, items: defaultCriteriaItems() };
    expect(code(() => applyCommand(next, stale))).toBe('CRITERIA_STALE');
    expect(code(() => adjust(next, 'duplicate', 'all', topic, [defaultCriteriaItems()[0], defaultCriteriaItems()[0]]))).toBe('INVALID_CRITERIA');
    expect(next.criteria).toHaveLength(1);
  });

  it('undoes all criteria bindings atomically while preserving later study records and historical definitions', () => {
    const initial = adjust(createDemoState(), 'prior-specific');
    let next = adjust(initial, 'global-adjustment', 'all');
    const revision = next.revisions.find(row => row.operationId === 'global-adjustment' && row.collection === 'criteria')!;
    next = save(next, 'later-study', defaultCriteriaItems()[0]);
    const record = structuredClone(next.records[0]);
    next = applyCommand(next, { ...ctx('undo-all'), type: 'undoRevision', revisionId: revision.id, expectedVersion: 1 });
    expect(resolveCriteria(next, topic).id).toBe('prior-specific');
    expect(resolveCriteria(next, 'demo-topic-force').id).toBe('trace-v4-default');
    expect(next.records[0]).toEqual(record);
    expect(next.criteria?.find(row => row.id === 'global-adjustment')?.items).toEqual(defaultCriteriaItems());
  });

  it('refuses an old Undo after a later criteria adjustment and keeps the newest bindings', () => {
    let state = adjust(createDemoState(), 'first-all', 'all');
    const revision = state.revisions.find(row => row.operationId === 'first-all' && row.collection === 'criteria')!;
    state = adjust(state, 'later-specific');
    expect(code(() => applyCommand(state, { ...ctx('stale-undo'), type: 'undoRevision', revisionId: revision.id, expectedVersion: 1 }))).toBe('UNDO_CONFLICT');
    expect(resolveCriteria(state, topic).id).toBe('later-specific');
  });

  it('reuses a tombstoned assignment after Undo and does not duplicate the same owner binding', () => {
    let state = adjust(createDemoState(), 'first');
    const firstAssignment = state.criteriaAssignments![0].id;
    const revision = state.revisions.find(row => row.operationId === 'first' && row.collection === 'criteria')!;
    state = applyCommand(state, { ...ctx('undo'), type: 'undoRevision', revisionId: revision.id, expectedVersion: 1 });
    state = adjust(state, 'second');
    expect(state.criteriaAssignments).toHaveLength(1);
    expect(state.criteriaAssignments![0].id).toBe(firstAssignment);
    expect(state.criteriaAssignments![0].deletedAt).toBeNull();
    expect(resolveCriteria(state, topic).id).toBe('second');
  });
});
