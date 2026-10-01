import { describe, expect, it } from 'vitest';
import { applyCommand } from './commands';
import { emptyState, type AppState, type Command } from './model';
import { DEFAULT_RECALL_OPTIONS, recallPreview, recallQueue, serializeMemory } from './recall-scheduler';
const at = '2026-10-01T03:00:00.000Z';
function fixture() {
  let data = emptyState('user', 'test');
  const command = (patch: object): Command => ({ userId: 'user', namespace: 'test', at, opId: crypto.randomUUID(), ...patch } as Command);
  data = applyCommand(data, command({ type: 'addSubject', id: 'subject', name: '과목', scope: { kind: 'independent' } }));
  for (const id of ['one', 'two']) data = applyCommand(data, command({ type: 'addNode', id, name: id, subjectId: 'subject', parentId: null, role: 'topic' }));
  return { data, command };
}
describe('FSRS topic recall schedules', () => {
  it('calculates genuine four-grade FSRS intervals and stores memo, history and schedule atomically', () => {
    const { data, command } = fixture();
    const preview = recallPreview(undefined, at, DEFAULT_RECALL_OPTIONS);
    expect(preview[1].card.due.getTime() - Date.parse(at)).toBe(60000);
    expect(preview[3].card.due.getTime() - Date.parse(at)).toBe(600000);
    expect(preview[4].card.due.getTime() - Date.parse(at)).toBeGreaterThan(86400000);
    const op = command({ type: 'reviewRecallCard', id: 'card', topicId: 'one', expectedVersion: 0, rating: 4,
      memo: { id: 'answer', body: '  내 원문\r\n\u0000\ud800 ', strokes: [{ id: 'ink', ink: 'blue', width: 3, points: [{ x: 10, y: 20, pressure: .5 }] }] } });
    const saved = applyCommand(data, op);
    expect(saved.recallCards![0].memory).toEqual(serializeMemory(preview[4].card));
    expect(saved.recallCards![0].reviews[0]).toMatchObject({ id: op.opId, rating: 4, memoId: 'answer' });
    expect(saved.memos![0].body).toBe(op.type === 'reviewRecallCard' ? op.memo!.body : '');
    expect(applyCommand(saved, op)).toBe(saved);
    expect(saved.records).toEqual(data.records); expect(saved.sessions).toEqual(data.sessions);
    expect(data.recallCards).toBeUndefined(); expect(data.memos).toBeUndefined();
    expect(() => applyCommand(saved, command({ ...op, opId: 'stale', memo: { id: 'unsaved', body: '충돌', strokes: [] } }))).toThrow();
    expect(saved.memos).toHaveLength(1);
  });
  it('returns minute-based learning only at its due time; future cards are not immediately repeated', () => {
    const { data, command } = fixture();
    const saved = applyCommand(data, command({ type: 'reviewRecallCard', id: 'card', topicId: 'one', expectedVersion: 0, rating: 1 }));
    expect(recallQueue(saved, saved.nodes, at).due).toEqual([]);
    expect(recallQueue(saved, saved.nodes, '2026-10-01T03:01:00.000Z').due.map(t => t.id)).toEqual(['one']);
    expect(saved.memos).toBeUndefined();
  });
  it('counts new introductions globally, preserves existing due dates when settings change and permits manual scheduling', () => {
    const { data, command } = fixture();
    let saved = applyCommand(data, command({ type: 'saveRecallPreferences', id: 'settings', expectedVersion: 0, options: { ...DEFAULT_RECALL_OPTIONS, newPerDay: 1 } }));
    saved = applyCommand(saved, command({ type: 'reviewRecallCard', id: 'card', topicId: 'one', expectedVersion: 0, rating: 4 }));
    const due = saved.recallCards![0].memory.due;
    expect(recallQueue(saved, saved.nodes.filter(t => t.id === 'two'), at).fresh).toEqual([]);
    saved = applyCommand(saved, command({ type: 'saveRecallPreferences', id: 'settings', expectedVersion: 1, options: { ...DEFAULT_RECALL_OPTIONS, retention: .95 } }));
    expect(saved.recallCards![0].memory.due).toBe(due);
    const reviews = saved.recallCards![0].reviews;
    saved = applyCommand(saved, command({ type: 'setRecallDue', id: 'card', topicId: 'one', expectedVersion: 1, due: at }));
    expect(recallQueue(saved, saved.nodes, at).due.map(t => t.id)).toEqual(['one']);
    expect(saved.recallCards![0].reviews).toEqual(reviews);
  });
  it('rejects cross-topic duplicate cards, malformed settings, foreign ownership and invalid ratings without partial writes', () => {
    const { data, command } = fixture();
    const op = { type: 'reviewRecallCard', id: 'card', topicId: 'one', expectedVersion: 0, rating: 3, memo: { id: 'answer', body: '답', strokes: [] } };
    expect(() => applyCommand(data, command({ ...op, userId: 'other' }))).toThrow();
    expect(() => applyCommand(data, command({ ...op, rating: 0 }))).toThrow();
    expect(() => applyCommand(data, command({ type: 'saveRecallPreferences', id: 'p', expectedVersion: 0, options: { ...DEFAULT_RECALL_OPTIONS, learningMinutes: [10, 1] } }))).toThrow();
    const saved: AppState = applyCommand(data, command(op));
    expect(() => applyCommand(saved, command({ ...op, id: 'duplicate', memo: undefined }))).toThrow();
    expect(saved.recallCards).toHaveLength(1);
  });
});
