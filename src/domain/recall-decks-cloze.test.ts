import { it, expect } from 'vitest';
import { applyCommand } from './commands';
import { emptyState, type Command } from './model';
import { clozeNumbers, renderCloze } from './recall-cloze';
import { DEFAULT_RECALL_OPTIONS, recallOptions, recallPreview, recallPrompts, recallQueue } from './recall-scheduler';
function fixture() {
  const at = '2026-10-01T03:00:00Z';
  const command = (patch: object) => ({ opId: crypto.randomUUID(), userId: 'owner', namespace: 'test', at, ...patch }) as Command;
  let data = applyCommand(emptyState('owner', 'test'), command({ type: 'addSubject', id: 's', name: '과목', scope: { kind: 'independent' } }));
  data = applyCommand(data, command({ type: 'addNode', id: 'topic', subjectId: 's', parentId: null, role: 'topic', name: '공부 주제' }));
  return { data, command, at };
}
it('renders shared numbers, hints and nested clozes while revealing no selected answer', () => {
  const source = '{{c1::지구::행성}}는 {{c2::{{c3::태양}} 주위}}를 돈다. {{c1,2::공전}}';
  expect(clozeNumbers(source)).toEqual([1, 2, 3]);
  expect(renderCloze(source, 1)).toBe('[행성]는 태양 주위를 돈다. […]');
  expect(renderCloze(source, 2)).toBe('지구는 […]를 돈다. […]');
  expect(renderCloze(source, 3)).toBe('지구는 […] 주위를 돈다. 공전');
  expect(renderCloze(source, 1, true)).toBe('지구는 태양 주위를 돈다. 공전');
  expect(() => clozeNumbers('{{c1::미완성')).toThrow();
});
it('keeps each ordinal identity, memo and due date through removal, restoration and concurrent edits', () => {
  let { data, command } = fixture();
  const save = (source: string, cards: object[]) => command({ type: 'saveRecallCloze', noteId: 'note', topicId: 'topic', source, reference: ' 추가 설명\n ', cards });
  data = applyCommand(data, save('{{c1::지구}}는 {{c2::태양}} 주위를 돈다.', [{ id: 'c1', number: 1, expectedVersion: 0 }, { id: 'c2', number: 2, expectedVersion: 0 }]));
  data = applyCommand(data, command({ type: 'reviewRecallCard', id: 'c2', topicId: 'topic', expectedVersion: 1, rating: 4, memo: { id: 'answer', body: ' 원래 응답\n ', strokes: [] } }));
  const memory = data.recallCards![1].memory, history = data.recallCards![1].reviews;
  data = applyCommand(data, save('{{c1::지구}}는 태양 주위를 돈다.', [{ id: 'c1', number: 1, expectedVersion: 1 }, { id: 'c2', number: 2, expectedVersion: 2 }]));
  expect(recallPrompts(data, data.nodes).map(p => p.id)).toEqual(['topic', 'c1']);
  expect(data.recallCards![1]).toMatchObject({ suspended: true, memory, reviews: history });
  data = applyCommand(data, save('{{c1::지구}}는 {{c2::태양::별}} 주위를 돈다.', [{ id: 'c1', number: 1, expectedVersion: 2 }, { id: 'c2', number: 2, expectedVersion: 3 }]));
  expect(data.recallCards).toHaveLength(2); expect(data.recallCards![1]).toMatchObject({ id: 'c2', suspended: false, memory, reviews: history });
  expect(data.memos![0].body).toBe(' 원래 응답\n ');
  const original = JSON.stringify(data);
  expect(() => applyCommand(data, save('{{c1::수정}}', [{ id: 'c1', number: 1, expectedVersion: 3 }, { id: 'c2', number: 2, expectedVersion: 2 }]))).toThrow();
  expect(JSON.stringify(data)).toBe(original);
});
it('uses independent deck quotas and parameters in both displayed intervals and committed reviews', () => {
  let { data, command, at } = fixture();
  for (const [id, retention, quota] of [['one', .8, 1], ['two', .97, 2]] as const) data = applyCommand(data, command({ type: 'saveRecallPreferences', id, deckName: id, options: { ...DEFAULT_RECALL_OPTIONS, retention, newPerDay: quota }, expectedVersion: 0 }));
  for (const id of ['a', 'b', 'c', 'd', 'e']) data = applyCommand(data, command({ type: 'saveRecallCard', id, topicId: 'topic', front: id, reference: '', deckId: id <= 'b' ? 'one' : 'two', expectedVersion: 0 }));
  expect(recallQueue(data, recallPrompts(data, data.nodes), at).fresh.map(row => row.id)).toEqual(['topic', 'a', 'c', 'd']);
  expect(recallQueue(data, recallPrompts(data, data.nodes, 'one'), at).fresh.map(row => row.id)).toEqual(['a']);
  const predicted = recallPreview(data.recallCards![0].memory, at, recallOptions(data, 'one'))[4].card.due.toISOString();
  data = applyCommand(data, command({ type: 'reviewRecallCard', id: 'a', topicId: 'topic', expectedVersion: 1, rating: 4 }));
  expect(data.recallCards![0].memory.due).toBe(predicted);
  expect(data.recallCards![0].reviews[0].options.retention).toBe(.8);
  expect(recallQueue(data, recallPrompts(data, data.nodes, 'one'), at).fresh).toHaveLength(0);
  expect(recallQueue(data, recallPrompts(data, data.nodes, 'two'), at).fresh).toHaveLength(2);
  expect(() => applyCommand(data, command({ type: 'saveRecallCard', id: 'alien', topicId: 'topic', front: 'bad', reference: '', deckId: 'other-user-deck', expectedVersion: 0 }))).toThrow();
});
it('buries new sibling cards for today, respects the opt-out and restores the queue after undo', () => {
  let { data, command, at } = fixture();
  data = applyCommand(data, command({ type: 'saveRecallCloze', noteId: 'note', topicId: 'topic', source: '{{c1::지구}}는 {{c2::태양}} 주위를 돈다.', reference: '', cards: [{ id: 'c1', number: 1, expectedVersion: 0 }, { id: 'c2', number: 2, expectedVersion: 0 }] }));
  const review = command({ type: 'reviewRecallCard', id: 'c1', topicId: 'topic', expectedVersion: 1, rating: 4 }); data = applyCommand(data, review);
  expect(recallQueue(data, recallPrompts(data, data.nodes), at).fresh.some(row => row.id === 'c2')).toBe(false);
  data = applyCommand(data, command({ type: 'saveRecallPreferences', id: 'prefs', expectedVersion: 0, options: { ...DEFAULT_RECALL_OPTIONS, burySiblings: false } }));
  expect(recallQueue(data, recallPrompts(data, data.nodes), at).fresh.some(row => row.id === 'c2')).toBe(true);
  data = applyCommand(data, command({ type: 'undoRecallReview', id: 'c1', expectedVersion: 2, reviewId: review.opId }));
  expect(data.recallCards![0].reviews).toHaveLength(0);
});
