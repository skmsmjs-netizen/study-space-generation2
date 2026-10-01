import { expect, it } from 'vitest';
import { emptyState, type Command } from './model';
import { applyCommand } from './commands';
import { freshBoard, moveBoardCard, BOARD_ID } from './study-board';
import { createDemoState } from './fixtures';
import { packServerState, unpackServerState } from '../server/state-codec';
const content = {
  ...freshBoard(),
  cards: [
    {
      id: 'card-a',
      columnId: 'to-do',
      title: '할 일',
      body: '  내 글\u0000\ud800\n  ',
      topicId: null,
      archived: false,
    },
    { id: 'card-b', columnId: 'to-do', title: '둘째', body: '', topicId: null, archived: false },
  ],
};
const command = (
  changes: Partial<Extract<Command, { type: 'saveStudyBoard' }>> = {},
): Extract<Command, { type: 'saveStudyBoard' }> =>
  ({
    type: 'saveStudyBoard',
    id: BOARD_ID,
    expectedVersion: 0,
    content,
    opId: 'board-create',
    userId: 'board-user',
    namespace: 'test',
    at: '2026-10-01T04:00:00Z',
    ...changes,
  }) as Extract<Command, { type: 'saveStudyBoard' }>;
it('preserves exact card text, order and history without creating study evidence', () => {
  const start = emptyState('board-user', 'test'),
    op = command(),
    first = applyCommand(start, op);
  expect(first.studyBoards?.[0].cards).toEqual(content.cards);
  expect(first.records).toEqual(start.records);
  expect(first.sessions).toEqual(start.sessions);
  expect(first.nodes).toEqual(start.nodes);
  expect(applyCommand(first, op)).toBe(first);
  const moved = moveBoardCard(content, 'card-a', 'finished');
  const second = applyCommand(first, command({ content: moved, expectedVersion: 1, opId: 'move' }));
  expect(second.studyBoards?.[0].cards.find((c) => c.id === 'card-a')?.columnId).toBe('finished');
  expect(second.records).toEqual([]);
  const undone = applyCommand(second, {
    type: 'undoRevision',
    revisionId: second.revisions.at(-1)!.id,
    expectedVersion: 2,
    userId: 'board-user',
    namespace: 'test',
    opId: 'undo',
    at: '2026-10-01T04:00:01Z',
  });
  expect(undone.studyBoards?.[0].cards).toEqual(content.cards);
  expect(unpackServerState(packServerState(undone, 'undo')).studyBoards).toEqual(
    undone.studyBoards,
  );
});
it('rejects stale versions, foreign owners, dangling columns and duplicate cards atomically', () => {
  const state = applyCommand(emptyState('board-user', 'test'), command());
  expect(() => applyCommand(state, command({ opId: 'stale' }))).toThrow('다른 곳에서 변경');
  expect(() => applyCommand(state, command({ opId: 'foreign', userId: 'other' }))).toThrow(
    '다른 사용자',
  );
  for (const cards of [
    [...content.cards, content.cards[0]],
    [{ ...content.cards[0], columnId: 'missing' }],
  ]) {
    expect(() =>
      applyCommand(
        state,
        command({ opId: 'broken', expectedVersion: 1, content: { ...content, cards } }),
      ),
    ).toThrow('열과 카드');
  }
  expect(state.studyBoards?.[0].version).toBe(1);
});
it('keeps topic links and card text when the source topic is trashed', () => {
  const start = createDemoState(),
    topic = start.nodes.find((n) => n.role === 'topic')!;
  const saved = applyCommand(start, {
    ...command(),
    userId: start.userId,
    namespace: start.namespace,
    content: { ...freshBoard(), cards: [{ ...content.cards[0], topicId: topic.id }] },
  });
  const trashed = applyCommand(saved, {
    type: 'trashNode',
    id: topic.id,
    expectedVersion: topic.version,
    userId: start.userId,
    namespace: start.namespace,
    opId: 'trash-topic',
    at: '2026-10-01T04:00:00Z',
  });
  expect(trashed.studyBoards?.[0].cards[0]).toEqual(saved.studyBoards?.[0].cards[0]);
});
it('reorders within a column without changing hidden cards or original input', () => {
  const moved = moveBoardCard(content, 'card-b', 'to-do', 'card-a');
  expect(moved.cards.map((c) => c.id)).toEqual(['card-b', 'card-a']);
  expect(content.cards.map((c) => c.id)).toEqual(['card-a', 'card-b']);
});
