import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { projectStudyGraph, graphPositions, graphHref } from './study-graph';
import { projectCanvas } from './canvas';
const state = createDemoState(),
  ids = state.subjects.map((s) => s.id);
const filter = { query: '', connections: 'all' as const, notes: true, centerId: null, depth: 1 };
it('projects the existing relation IDs, excludes out-of-scope/deleted content and never writes geometry', () => {
  const before = structuredClone(state),
    graph = projectStudyGraph(state, ids, filter),
    canvas = projectCanvas(state, ids);
  expect(graph.cards.map((c) => c.id)).toEqual(
    expect.arrayContaining(canvas.cards.map((c) => c.id)),
  );
  expect(graph.links).toEqual(canvas.links);
  const positions = graphPositions(graph.cards, graph.links);
  expect(Object.values(positions).every((p) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(
    true,
  );
  expect(state).toEqual(before);
  expect(
    projectStudyGraph(state, [], filter).cards.filter(
      (c) => c.kind !== 'concept' && c.ownerId !== null,
    ),
  ).toHaveLength(0);
});
it('uses breadth-first depth and the same original routes', () => {
  const all = projectStudyGraph(state, ids, filter),
    center = all.cards.find((c) => c.kind === 'subject')!;
  const local = projectStudyGraph(state, ids, { ...filter, centerId: center.id });
  const expected = new Set([
    center.id,
    ...all.links
      .filter((e) => e.source === center.id || e.target === center.id)
      .flatMap((e) => [e.source, e.target]),
  ]);
  expect(new Set(local.cards.map((c) => c.id))).toEqual(expected);
  expect(graphHref(center)).toBe(`#/subject/${center.entityId}`);
  expect(graphHref(all.cards.find((c) => c.kind === 'topic')!)).toContain('#/node/');
});
it('filters explicit relations without inventing connections', () => {
  expect(projectStudyGraph(state, ids, { ...filter, connections: 'personal' }).links).toEqual([]);
  expect(projectStudyGraph(state, ids, { ...filter, query: '存在しない' }).cards).toEqual([]);
});

it('keeps unlinked free writing visible and searchable without inventing links', () => {
  const free = {
    id: 'free-graph-note',
    userId: state.userId,
    namespace: state.namespace,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
    version: 1,
    deletedAt: null,
    kind: 'free-note' as const,
    ownerId: null,
    body: '  自由 기록 원문  ',
  };
  const graph = projectStudyGraph({ ...state, narratives: [...state.narratives, free] }, ids, {
    ...filter,
    query: '自由',
  });
  expect(graph.cards.map((c) => c.entityId)).toEqual([free.id]);
  expect(graph.links).toEqual([]);
  expect(graphHref(graph.cards[0])).toBe('#/free/free-graph-note');
});
