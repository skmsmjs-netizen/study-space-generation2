import { describe, expect, it } from 'vitest';
import { applyCommand, validateState } from './commands';
import { createDemoState } from './fixtures';
import { DemoRepository, DEMO_KEY } from '../data/demo-repository';
import type { Command, MemoStroke } from './model';

const stroke: MemoStroke = { id: 'original-line', ink: 'blue', width: 3.5, points: [{ x: 12.25, y: 27.5, pressure: .4 }, { x: 899.5, y: 600, pressure: .8 }] };
const save = (opId: string, body: string, expectedVersion = 0): Command => ({ type: 'saveMemo', id: 'memo-original-id', ownerId: 'demo-topic-function', body, strokes: [stroke], expectedVersion,
  opId, at: '2026-09-30T10:00:00Z', userId: 'demo-learner', namespace: 'demo' });
describe('quick memo preservation', () => {
  it('reads old snapshots without adding fields, saves exact text/points without study events', () => {
    const before = createDemoState(), original = structuredClone(before);
    validateState(before); expect(before).toEqual(original); expect(before.memos).toBeUndefined();
    const next = applyCommand(before, save('save', '  결론\n\t의문  '));
    expect(next.memos![0]).toMatchObject({ id: 'memo-original-id', body: '  결론\n\t의문  ', strokes: [stroke], version: 1 });
    for (const key of ['nodes','subjects','records','sessions','narratives'] as const) expect(next[key]).toEqual(before[key]);
    expect(before).toEqual(original);
  });
  it('retains revisions, avoids duplicate operations, rejects stale overwrites with both contents', () => {
    const first = applyCommand(createDemoState(), save('save', '원문'));
    expect(applyCommand(first, save('save', '원문'))).toBe(first);
    const next = applyCommand(first, save('edit', '수정', 1));
    expect(next.revisions.at(-1)?.before).toMatchObject({ body: '원문', strokes: [stroke] });
    expect(() => applyCommand(next, save('stale', '다른 초안', 1))).toThrow('두 내용을');
    expect(next.memos![0].body).toBe('수정');
  });
  it('rejects malformed strokes and alien owners before publishing', () => {
    const before = createDemoState();
    expect(() => applyCommand(before, { ...save('bad', '원문'), strokes: [{ ...stroke, points: [{ x: Infinity, y: 0, pressure: .5 }] }] } as Command)).toThrow();
    expect(() => applyCommand(before, { ...save('alien', ''), ownerId: 'other-owner' } as Command)).toThrow();
    expect(before.memos).toBeUndefined();
  });
  it('moves to trash/restores same ID, keeps lines/history when the linked node is trashed', () => {
    let state = applyCommand(createDemoState(), save('save', '남길 내용'));
    const ctx = { userId: state.userId, namespace: state.namespace, at: '2026-09-30T10:00:00Z' };
    state = applyCommand(state, { ...ctx, opId: 'trash', type: 'trashMemo', id: state.memos![0].id, expectedVersion: 1 });
    state = applyCommand(state, { ...ctx, opId: 'restore', type: 'restoreMemo', id: state.memos![0].id, expectedVersion: 2 });
    expect(state.memos![0]).toMatchObject({ id: 'memo-original-id', body: '남길 내용', deletedAt: null, strokes: [stroke], version: 3 });
    state = applyCommand(state, { ...ctx, opId: 'trash-node', type: 'trashNode', id: 'demo-topic-function', expectedVersion: 1 });
    expect(state.memos![0].strokes).toEqual([stroke]); validateState(state);
  });
  it('keeps the repository snapshot untouched on quota failure and can retry exact input', () => {
    const values = new Map<string,string>(); let fail = false;
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { if (fail) throw Error('quota'); values.set(key, value); } };
    const repo = new DemoRepository(storage), before = repo.getSnapshot(), raw = values.get(DEMO_KEY);
    fail = true; expect(() => repo.execute(save('save', '原文\n  '))).toThrow('quota');
    expect(repo.getSnapshot()).toBe(before); expect(values.get(DEMO_KEY)).toBe(raw);
    fail = false; repo.execute(save('save', '原文\n  '));
    expect(new DemoRepository(storage).getSnapshot().memos![0]).toMatchObject({ body: '原文\n  ', strokes: [stroke] });
  });
  it('undo preserves a newer memo edit and blocks removal of a subsequently referenced node', () => {
    const original = createDemoState();
    const ctx = { userId: original.userId, namespace: original.namespace, at: '2026-09-30T10:00:00Z' };
    let state = applyCommand(original, { ...ctx, opId: 'add-node', type:'addNode', id:'new-node', subjectId:original.subjects[0].id, parentId:null, role:'topic', name:'새 주제' });
    const nodeRevision = state.revisions.at(-1)!;
    state = applyCommand(state, { ...save('memo', '원문'), ownerId:'new-node' } as Command);
    expect(() => applyCommand(state, { ...ctx, opId:'undo-node', type:'undoRevision', revisionId:nodeRevision.id, expectedVersion:1 })).toThrow('연결된 내용');
    const revision = state.revisions.at(-1)!;
    state = applyCommand(state, save('edit','새 원문',1));
    expect(() => applyCommand(state, { ...ctx, opId:'old-undo', type:'undoRevision', revisionId:revision.id, expectedVersion:2 })).toThrow('그 뒤');
  });
});
