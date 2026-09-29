import { describe, expect, it } from 'vitest';
import { applyCommand } from './commands';
import { createDemoState } from './fixtures';
import { DomainError, type AppState, type Command, type OutlineTableInput } from './model';
import { outlineTableToken, previewOutlineTable } from './outline';

const ctx = (opId: string) => ({ opId, userId: 'demo-learner', namespace: 'demo' as const, at: '2026-09-30T12:00:00.000Z' });
const input = (): OutlineTableInput => ({ scope: { kind: 'semester', semesterId: 'demo-semester-current' }, choices: {}, courses: [
  { key: 'c1', name: '새 과목', units: [{ key: 'u1', name: '새 단원', topics: [{ key: 't1', name: '주제 하나' }, { key: 't2', name: '주제 둘' }] }] },
  { key: 'c2', name: '둘째 과목', units: [{ key: 'u2', name: '둘째 단원', topics: [{ key: 't3', name: '동명' }] }] },
] });
const command = (state: AppState, value = input()): Extract<Command, { type: 'createOutlineTable' }> => ({ ...ctx('table'), type: 'createOutlineTable', ...value, expectedToken: outlineTableToken(state), ids: Object.fromEntries(previewOutlineTable(state, value).entries.filter(row => row.status === 'new').map((row, index) => [row.key, `new-${index}`])) });
const code = (work: () => unknown) => { try { work(); return null; } catch (error) { return error instanceof DomainError ? error.code : String(error); } };

describe('three-level outline table commands', () => {
  it('creates multiple subjects, units and topics as one revision group and undoes only that group', () => {
    const before = createDemoState(), request = command(before), next = applyCommand(before, request);
    expect(next.subjects.slice(-2).map(row => row.name)).toEqual(['새 과목', '둘째 과목']);
    expect(next.nodes.slice(-5).map(row => row.role)).toEqual(['unit', 'topic', 'topic', 'unit', 'topic']);
    expect(next.nodes.slice(-5).map(row => row.parentId)).toEqual([null, 'new-1', 'new-1', null, 'new-5']);
    expect(next.revisions.filter(row => row.operationId === 'table')).toHaveLength(7);
    expect(next.records).toEqual(before.records); expect(next.sessions).toEqual(before.sessions);
    expect(next.subjects.slice(0, before.subjects.length)).toEqual(before.subjects); expect(next.nodes.slice(0, before.nodes.length)).toEqual(before.nodes);
    expect(applyCommand(next, request)).toBe(next);
    const revision = next.revisions.find(row => row.operationId === 'table')!;
    const later = applyCommand(next, { ...ctx('later'), type: 'renameNode', id: 'demo-topic-function', name: '다른 항목의 나중 수정', expectedVersion: 1 });
    const undone = applyCommand(later, { ...ctx('undo'), type: 'undoRevision', revisionId: revision.id, expectedVersion: 1 });
    expect([...undone.subjects, ...undone.nodes].filter(row => row.id.startsWith('new-')).every(row => row.deletedAt)).toBe(true);
    expect(undone.nodes.find(row => row.id === 'demo-topic-function')?.name).toBe('다른 항목의 나중 수정');
  });
  it('requires parent names but permits a subject alone or unit without topics', () => {
    const state = createDemoState(), value = input();
    value.courses[0].name = '';
    expect(code(() => previewOutlineTable(state, value))).toBe('INVALID_OUTLINE_TABLE');
    const unitless = input(); unitless.courses[0].units[0].name = '';
    expect(code(() => previewOutlineTable(state, unitless))).toBe('INVALID_OUTLINE_TABLE');
    const partial = input(); partial.courses[0].units = []; partial.courses[1].units[0].topics = [];
    expect(previewOutlineTable(state, partial).entries.map(row => row.kind)).toEqual(['subject', 'subject', 'unit']);
  });
  it('deduplicates repeated paths while retaining all raw input cells in the command', () => {
    const state = createDemoState(), value = input();
    value.courses[0].units[0].topics.push({ key: 'duplicate', name: '  주제 하나  ' }, { key: 'blank', name: '  ' });
    const plan = previewOutlineTable(state, value);
    expect(plan.newCount).toBe(7); expect(value.courses[0].units[0].topics.at(-2)?.name).toBe('  주제 하나  ');
    expect(applyCommand(state, command(state, value)).nodes.filter(row => row.name === '주제 하나')).toHaveLength(1);
  });
  it('requires explicit reuse/new choices at each matching level and never rewrites reused entities', () => {
    const first = createDemoState(), created = applyCommand(first, command(first)), value = input();
    const p1 = previewOutlineTable(created, value);
    expect(p1.entries[0].status).toBe('choose'); expect(p1.entries[1].status).toBe('blocked');
    value.choices[JSON.stringify(['새 과목'])] = 'new-0';
    value.choices[JSON.stringify(['새 과목', '새 단원'])] = 'new-1';
    value.choices[JSON.stringify(['새 과목', '새 단원', '주제 하나'])] = 'new-2';
    value.choices[JSON.stringify(['새 과목', '새 단원', '주제 둘'])] = 'new';
    value.courses = [value.courses[0]];
    const plan = previewOutlineTable(created, value); expect(plan.ready).toBe(true); expect(plan.newCount).toBe(1); expect(plan.reuseCount).toBe(3);
    const request = { ...command(created, value), ...ctx('second'), ids: { [JSON.stringify(['새 과목', '새 단원', '주제 둘'])]: 'second-topic' } };
    const next = applyCommand(created, request);
    expect(next.subjects).toEqual(created.subjects); expect(next.nodes.slice(0, created.nodes.length)).toEqual(created.nodes);
    expect(next.nodes.at(-1)).toMatchObject({ id: 'second-topic', parentId: 'new-1', subjectId: 'new-0', role: 'topic' });
  });
  it('does not reuse same-name subjects in another semester or flatten deeper legacy nodes', () => {
    const state = createDemoState(), value = input();
    value.courses = [{ key: 'c', name: '수학의 기초', units: [{ key: 'u', name: '변화와 관계', topics: [{ key: 't', name: '함수는 어떤 관계일까?' }] }] }];
    value.scope = { kind: 'independent' };
    expect(previewOutlineTable(state, value).entries.every(row => row.status === 'new')).toBe(true);
    value.scope = { kind: 'semester', semesterId: 'demo-semester-current' }; value.choices = { '["수학의 기초"]': 'demo-subject-math', '["수학의 기초","변화와 관계"]': 'demo-unit-functions' };
    expect(previewOutlineTable(state, value).entries.at(-1)?.status).toBe('new');
    const next = applyCommand(state, command(state, value));
    expect(next.nodes.find(row => row.id === 'demo-topic-function')?.parentId).toBe('demo-outline-functions');
  });
  it('atomically rejects duplicate/generated existing IDs, missing IDs, stale previews and invalid scopes', () => {
    const state = createDemoState(), before = structuredClone(state), valid = command(state);
    const ids = Object.keys(valid.ids);
    for (const bad of [{ ...valid, ids: {} }, { ...valid, ids: { ...valid.ids, [ids[6]]: valid.ids[ids[0]] } }, { ...valid, ids: { ...valid.ids, [ids[6]]: 'demo-topic-function' } }]) {
      expect(code(() => applyCommand(state, bad))).not.toBeNull(); expect(state).toEqual(before);
    }
    const renamed = applyCommand(state, { ...ctx('rename'), type: 'renameNode', id: 'demo-topic-function', name: '바뀜', expectedVersion: 1 });
    expect(code(() => applyCommand(renamed, valid))).toBe('OUTLINE_STALE');
    expect(code(() => applyCommand(state, { ...valid, scope: { kind: 'semester', semesterId: 'missing' } }))).toBe('INVALID_OUTLINE_TABLE');
  });
  it('refuses whole-table undo after a new topic gains a record', () => {
    const state = createDemoState(), created = applyCommand(state, command(state));
    const recorded = applyCommand(created, { ...ctx('record'), type: 'saveRecords', sessionId: 'session', entries: [{ targetId: 'new-2', done: true }], dateEvidence: { kind: 'unknown' } });
    const revision = recorded.revisions.find(row => row.operationId === 'table')!;
    expect(code(() => applyCommand(recorded, { ...ctx('undo'), type: 'undoRevision', revisionId: revision.id, expectedVersion: 1 }))).toBe('UNDO_DEPENDENCY');
  });
  it('validates 180 characters and 500 total unit/topic rows', () => {
    const state = createDemoState(), value = input(); value.courses = [{ key: 'c', name: '가'.repeat(180), units: [{ key: 'u', name: '단원', topics: Array.from({ length: 499 }, (_, i) => ({ key: `t-${i}`, name: `주제 ${i}` })) }] }];
    expect(previewOutlineTable(state, value).newCount).toBe(501);
    const next = applyCommand(state, command(state, value)); expect(next.nodes.length - state.nodes.length).toBe(500);
    value.courses[0].units[0].topics.push({ key: 'overflow', name: '초과' });
    expect(code(() => previewOutlineTable(state, value))).toBe('INVALID_OUTLINE_TABLE');
    value.courses[0].units[0].topics.pop(); value.courses[0].name += '가';
    expect(code(() => previewOutlineTable(state, value))).toBe('INVALID_OUTLINE_TABLE');
  });
});
