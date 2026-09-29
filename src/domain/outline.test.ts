import { describe, expect, it } from 'vitest';
import { applyCommand } from './commands';
import { createDemoState } from './fixtures';
import { DomainError, type AppState, type Command } from './model';
import { outlineRevisionToken, previewOutlineEntries } from './outline';

const subjectId = 'demo-subject-math', parentId = 'demo-outline-functions';
const ctx = (opId: string) => ({ opId, userId: 'demo-learner', namespace: 'demo' as const, at: '2026-09-30T01:00:00.000Z' });
const siblings = (state: AppState) => state.nodes.filter(row => row.subjectId === subjectId && row.parentId === parentId && !row.deletedAt).sort((a, b) => a.order - b.order);
const batch = (state: AppState, entries = [{ id: 'new-a', name: '새 항목 A' }, { id: 'new-b', name: '새 항목 B' }]): Command => ({ ...ctx('batch'), type: 'addNodes', subjectId, parentId, role: 'topic', entries, expectedToken: outlineRevisionToken(state, subjectId, parentId) });
const reorder = (state: AppState, ids = siblings(state).map(row => row.id).reverse()): Command => ({ ...ctx('reorder'), type: 'reorderNodes', subjectId, parentId, ids, expectedToken: outlineRevisionToken(state, subjectId, parentId) });
const code = (work: () => unknown) => { try { work(); return null; } catch (error) { return error instanceof DomainError ? error.code : String(error); } };
const undo = (state: AppState, operationId: string) => {
  const revision = state.revisions.find(row => row.operationId === operationId)!;
  return applyCommand(state, { ...ctx(`undo:${operationId}`), type: 'undoRevision', revisionId: revision.id, expectedVersion: state.nodes.find(row => row.id === revision.entityId)!.version });
};

describe('outline row preview', () => {
  it('skips blank cells and repeated new paths without altering input drafts', () => {
    const names = ['  첫 이름  ', '', '첫 이름', '둘째 이름'];
    expect(previewOutlineEntries(names)).toEqual({ entries: [{ line: 1, name: '첫 이름' }, { line: 4, name: '둘째 이름' }], issues: [] });
    expect(names[0]).toBe('  첫 이름  ');
  });
  it('does not silently parse pasted tables or multiline text and enforces source limits', () => {
    expect(previewOutlineEntries(['가\n나', '가\t나', '가'.repeat(181)]).issues).toHaveLength(3);
    expect(previewOutlineEntries(Array(501).fill('가')).issues).toHaveLength(1);
    expect(previewOutlineEntries(['가'.repeat(180)]).issues).toEqual([]);
  });
});

describe('atomic outline management', () => {
  it('changes sibling order only, preserving child identities and historical record links', () => {
    let state = createDemoState();
    state = applyCommand(state, { ...ctx('child'), type: 'addNode', id: 'child', subjectId, parentId: 'demo-topic-function', role: 'topic', name: '하위 자료' });
    state = applyCommand(state, { ...ctx('record'), type: 'saveRecords', sessionId: 'session', entries: [{ targetId: 'demo-topic-function', done: false, body: '  원문\n보존  ' }], dateEvidence: { kind: 'unknown' } });
    const before = structuredClone(state), expected = siblings(state).map(row => row.id).reverse();
    const next = applyCommand(state, reorder(state));
    expect(siblings(next).map(row => row.id)).toEqual(expected);
    expect(next.records).toEqual(before.records); expect(next.sessions).toEqual(before.sessions);
    for (const row of next.nodes) {
      const original = before.nodes.find(n => n.id === row.id)!;
      expect({ id: row.id, parentId: row.parentId, subjectId: row.subjectId, name: row.name, role: row.role }).toEqual({ id: original.id, parentId: original.parentId, subjectId: original.subjectId, name: original.name, role: original.role });
    }
    expect(next.nodes.find(row => row.id === 'child')).toEqual(before.nodes.find(row => row.id === 'child'));
    expect(state).toEqual(before);
    expect(siblings(undo(next, 'reorder')).map(row => row.id)).toEqual(siblings(before).map(row => row.id));
  });
  it('rejects missing, duplicate, unknown, cross-subject and non-sibling IDs atomically', () => {
    const state = createDemoState(), before = structuredClone(state), ids = siblings(state).map(row => row.id);
    for (const invalid of [ids.slice(1), ids.map(() => ids[0]), ['missing', ...ids.slice(1)], ['demo-unit-force', ...ids.slice(1)], [parentId, ...ids.slice(1)]]) {
      expect(code(() => applyCommand(state, reorder(state, invalid)))).toBe('INVALID_ORDER');
      expect(state).toEqual(before);
    }
  });
  it('requires a fresh preview after a sibling rename, creation, movement or trash', () => {
    const state = createDemoState(), command = reorder(state);
    const changes: Command[] = [
      { ...ctx('rename'), type: 'renameNode', id: 'demo-topic-function', name: '바뀐 이름', expectedVersion: 1 },
      { ...ctx('add'), type: 'addNode', id: 'later', subjectId, parentId, role: 'topic', name: '나중 항목' },
      { ...ctx('move'), type: 'moveNode', id: 'demo-topic-function', parentId: null, expectedVersion: 1 },
      { ...ctx('trash'), type: 'trashNode', id: 'demo-topic-function', expectedVersion: 1 },
    ];
    for (const change of changes) expect(code(() => applyCommand(applyCommand(state, change), command))).toBe('OUTLINE_STALE');
  });
  it('creates the whole batch with one operation and safely retries the same IDs', () => {
    const state = createDemoState(), command = batch(state), next = applyCommand(state, command);
    expect(next.nodes.slice(-2).map(row => row.id)).toEqual(['new-a', 'new-b']);
    expect(next.revisions.filter(row => row.operationId === 'batch')).toHaveLength(2);
    expect(next.sessions).toEqual(state.sessions); expect(next.records).toEqual(state.records);
    expect(applyCommand(next, command)).toBe(next);
    const restored = undo(next, 'batch');
    expect(restored.nodes.filter(row => row.id.startsWith('new-')).every(row => row.deletedAt !== null)).toBe(true);
    expect(restored.nodes.filter(row => !row.id.startsWith('new-'))).toEqual(state.nodes);
  });
  it('rejects a bad later row without saving the earlier row', () => {
    const state = createDemoState(), before = structuredClone(state);
    for (const invalid of [
      [{ id: 'new-a', name: '가' }, { id: 'new-a', name: '나' }],
      [{ id: 'new-a', name: '가' }, { id: 'demo-topic-function', name: '나' }],
      [{ id: 'new-a', name: '가' }, { id: 'new-b', name: ' ' }],
      [{ id: 'new-a', name: '가' }, { id: 'new-b', name: '가' }],
      [{ id: 'new-a', name: '가' }, { id: 'new-b', name: '나'.repeat(181) }],
    ]) {
      expect(code(() => applyCommand(state, batch(state, invalid)))).not.toBeNull(); expect(state).toEqual(before);
    }
  });
  it('requires an explicit choice before creating a name already present', () => {
    const state = createDemoState(), command = batch(state, [{ id: 'new-a', name: siblings(state)[0].name }]);
    expect(code(() => applyCommand(state, command))).toBe('DUPLICATE_NAME_CHOICE');
    expect(applyCommand(state, { ...command, type: 'addNodes', duplicateNames: 'create' } as Command).nodes.at(-1)?.id).toBe('new-a');
  });
  it('refuses an invalid parent, cross-subject parent or deleted ancestor', () => {
    const state = createDemoState();
    expect(code(() => applyCommand(state, { ...batch(state), parentId: 'missing' } as Command))).toBe('NOT_FOUND');
    expect(code(() => applyCommand(state, { ...batch(state), parentId: 'demo-unit-force' } as Command))).toBe('SUBJECT_MISMATCH');
    const trashed = applyCommand(state, { ...ctx('trash-parent'), type: 'trashNode', id: parentId, expectedVersion: 1 });
    expect(code(() => applyCommand(trashed, batch(trashed)))).toBe('NOT_FOUND');
  });
  it('preserves subsequent independent edits when undoing order', () => {
    let state = applyCommand(createDemoState(), reorder(createDemoState()));
    state = applyCommand(state, { ...ctx('unrelated'), type: 'renameNode', id: 'demo-unit-force', name: '다른 과목 나중 글', expectedVersion: 1 });
    expect(undo(state, 'reorder').nodes.find(row => row.id === 'demo-unit-force')?.name).toBe('다른 과목 나중 글');
  });
  it('refuses the whole undo after any reordered sibling is edited', () => {
    let state = applyCommand(createDemoState(), reorder(createDemoState()));
    const last = state.revisions.filter(row => row.operationId === 'reorder').at(-1)!;
    state = applyCommand(state, { ...ctx('later'), type: 'renameNode', id: last.entityId, name: '후속 수정', expectedVersion: last.after.version });
    const before = structuredClone(state);
    expect(code(() => undo(state, 'reorder'))).toBe('UNDO_CONFLICT'); expect(state).toEqual(before);
  });
  it('refuses creation undo after a new row gains a study record or child', () => {
    const initial = createDemoState(), created = applyCommand(initial, batch(initial));
    const record = applyCommand(created, { ...ctx('record'), type: 'saveRecords', sessionId: 'session', entries: [{ targetId: 'new-a', done: true }], dateEvidence: { kind: 'unknown' } });
    const child = applyCommand(created, { ...ctx('child'), type: 'addNode', id: 'child', subjectId, parentId: 'new-b', role: 'topic', name: '새 자식' });
    expect(code(() => undo(record, 'batch'))).toBe('UNDO_DEPENDENCY'); expect(code(() => undo(child, 'batch'))).toBe('UNDO_DEPENDENCY');
  });
  it('appends after existing sparse orders, including preserved deleted siblings', () => {
    const state = createDemoState(); siblings(state).forEach((row, index) => { row.order = 20 + index * 10; });
    const max = Math.max(...siblings(state).map(row => row.order));
    const next = applyCommand(state, batch(state));
    expect(next.nodes.slice(-2).map(row => row.order)).toEqual([max + 1, max + 2]);
    const single = applyCommand(state, { ...ctx('single'), type: 'addNode', id: 'single', subjectId, parentId, role: 'topic', name: '마지막' });
    expect(single.nodes.at(-1)?.order).toBe(max + 1);
  });
  it('creates and undoes 500 distinct rows atomically; row 501 is rejected', () => {
    const state = createDemoState(), entries = Array.from({ length: 500 }, (_, index) => ({ id: `bulk-${index}`, name: `항목 ${index}` }));
    const next = applyCommand(state, batch(state, entries));
    expect(next.nodes.length - state.nodes.length).toBe(500);
    expect(next.revisions.filter(row => row.operationId === 'batch')).toHaveLength(500);
    expect(undo(next, 'batch').nodes.filter(row => row.id.startsWith('bulk-') && !row.deletedAt)).toHaveLength(0);
    expect(code(() => applyCommand(state, batch(state, [...entries, { id: 'overflow', name: '초과' }])))).toBe('INVALID_OUTLINE_ROWS');
  });
});
