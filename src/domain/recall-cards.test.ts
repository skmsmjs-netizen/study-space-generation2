import { describe, it, expect } from 'vitest';
import { applyCommand } from './commands';
import { emptyState, type Command } from './model';
import { DEFAULT_RECALL_OPTIONS, recallPrompts, recallQueue, recallPreview } from './recall-scheduler';
import { recallTraining } from './recall-training';
function setup() {
  const at = '2026-10-01T03:00:00Z';
  const cmd = (patch: object) => ({ at, userId: 'owner', namespace: 'test', opId: crypto.randomUUID(), ...patch }) as Command;
  let data = applyCommand(emptyState('owner', 'test'), cmd({ type: 'addSubject', id: 'subject', name: '과목', scope: { kind: 'independent' } }));
  data = applyCommand(data, cmd({ type: 'addNode', id: 'topic', name: '주제', subjectId: 'subject', parentId: null, role: 'topic' }));
  return { data, cmd, at };
}
describe('independent question cards and parameter history', () => {
  it('keeps a legacy card and two questions independently through grading, editing and undo', () => {
    let { data, cmd, at } = setup();
    data = applyCommand(data, cmd({ type: 'saveRecallReference', id: 'legacy', topicId: 'topic', reference: '주제 설명', expectedVersion: 0 }));
    for (const id of ['a', 'b']) data = applyCommand(data, cmd({ type: 'saveRecallCard', id, topicId: 'topic', front: `  질문 ${id}\r\n `, reference: '\u0000\ud800 원문 ', expectedVersion: 0 }));
    expect(recallPrompts(data, data.nodes).map(row => row.id)).toEqual(['topic', 'a', 'b']);
    const review = cmd({ type: 'reviewRecallCard', id: 'a', topicId: 'topic', expectedVersion: 1, rating: 4, memo: { id: 'memo', body: '첫 질문 응답', strokes: [] } });
    data = applyCommand(data, review);
    expect(recallQueue(data, recallPrompts(data, data.nodes), at).fresh.map(row => row.id)).toEqual(['topic', 'b']);
    expect(data.recallCards!.find(row => row.id === 'b')!.reviews).toEqual([]);
    data = applyCommand(data, cmd({ type: 'undoRecallReview', id: 'a', expectedVersion: 2, reviewId: review.opId }));
    expect(data.recallCards!.find(row => row.id === 'a')!).toMatchObject({ front: '  질문 a\r\n ', reviews: [] });
    expect(data.memos![0].body).toBe('첫 질문 응답');
    data = applyCommand(data, cmd({ type: 'saveRecallCard', id: 'a', topicId: 'topic', front: '수정 질문', reference: '수정 설명', expectedVersion: 3 }));
    expect(data.recallCards).toHaveLength(3); expect(data.recallCards![0].reference).toBe('주제 설명');
    expect(() => applyCommand(data, cmd({ type: 'saveRecallCard', id: 'a', topicId: 'topic', front: '충돌', reference: '', expectedVersion: 3 }))).toThrow();
    expect(() => applyCommand(data, cmd({ type: 'saveRecallCard', id: 'blank', topicId: 'topic', front: '   ', reference: '', expectedVersion: 0 }))).toThrow();
  });
  it('trains from each real cross-day outcome, preserves same-day context, and excludes an undone outcome', () => {
    let { data, cmd } = setup();
    data = applyCommand(data, cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 0, rating: 1, at: '2026-09-28T03:00:00Z' }));
    data = applyCommand(data, cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 1, rating: 3, at: '2026-09-28T03:10:00Z' }));
    data = applyCommand(data, cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 2, rating: 4, at: '2026-09-30T03:00:00Z' }));
    const review = cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 3, rating: 1 }); data = applyCommand(data, review);
    expect(recallTraining(data)).toMatchObject({ reviews: 4, lengths: [3, 4], ratings: [1, 3, 4, 1, 3, 4, 1], deltaTs: [0, 0, 2, 0, 0, 2, 1] });
    data = applyCommand(data, cmd({ type: 'undoRecallReview', id: 'card', reviewId: review.opId, expectedVersion: 4 }));
    expect(recallTraining(data)).toMatchObject({ reviews: 3, lengths: [3] });
  });
  it('persists valid personalized FSRS weights and changes future scheduling without changing current dates', () => {
    let { data, cmd, at } = setup();
    data = applyCommand(data, cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 0, rating: 4 }));
    const memory = data.recallCards![0].memory;
    const parameters = [.1, 1, 8, 60, 6, .5, 3, .05, 1.5, .1, .5, 1.9, .1, .3, 2, .2, 2.8, .5, .6, .07, .15];
    data = applyCommand(data, cmd({ type: 'saveRecallPreferences', id: 'preferences', expectedVersion: 0, options: { ...DEFAULT_RECALL_OPTIONS, parameters, optimizedAt: at, optimizedReviews: 10 } }));
    expect(data.recallCards![0].memory).toEqual(memory);
    expect(recallPreview(undefined, at, data.recallPreferences![0].options)[4].card.due).not.toEqual(recallPreview(undefined, at, DEFAULT_RECALL_OPTIONS)[4].card.due);
    expect(() => applyCommand(data, cmd({ type: 'saveRecallPreferences', id: 'preferences', expectedVersion: 1, options: { ...DEFAULT_RECALL_OPTIONS, parameters: [NaN] } }))).toThrow();
  });
});
