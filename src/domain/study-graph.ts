import { projectCanvas, canvasKey, type CanvasCard } from './canvas';
import { CANVAS_ID } from './canvas';
import type { AppState, CanvasLink } from './model';
export interface GraphFilter {
  query: string;
  connections: 'all' | 'personal';
  notes: boolean;
  centerId: string | null;
  depth: number;
}
export function projectStudyGraph(
  data: AppState,
  subjectIds: readonly string[],
  filter: GraphFilter,
) {
  const projection = projectCanvas(data, subjectIds);
  const projectedIds = new Set(projection.cards.map((c) => c.id));
  for (const memo of data.memos ?? []) {
    const id = canvasKey('memo', memo.id);
    if (!memo.deletedAt && memo.ownerId === null && !projectedIds.has(id))
      projection.cards.push({
        id,
        entityId: memo.id,
        kind: 'memo',
        name: '자유 메모',
        ownerId: null,
        position: { x: 0, y: 0 },
      });
  }
  for (const note of data.narratives) {
    if (!note.deletedAt && note.ownerId === null && note.body.trim())
      projection.cards.push({
        id: canvasKey('narrative', note.id),
        entityId: note.id,
        kind: 'narrative',
        name: '자유 기록',
        ownerId: null,
        position: { x: 0, y: 0 },
      });
  }
  // Use existing explicit relation IDs, including endpoints not mounted by Canvas.
  const personal =
    data.canvasLayouts?.find((row) => row.id === CANVAS_ID && !row.deletedAt)?.links ?? [];
  projection.links = [...projection.links.filter((e) => e.id.startsWith('auto:')), ...personal];
  let cards = projection.cards.filter(
    (c) => filter.notes || !['memo', 'narrative'].includes(c.kind),
  );
  const query = filter.query.trim().toLocaleLowerCase();
  if (query)
    cards = cards.filter((c) =>
      `${c.name} ${graphBody(data, c)}`.toLocaleLowerCase().includes(query),
    );
  const ids = new Set(cards.map((c) => c.id));
  let links = projection.links.filter(
    (e) =>
      ids.has(e.source) &&
      ids.has(e.target) &&
      (filter.connections === 'all' || !e.id.startsWith('auto:')),
  );
  if (filter.centerId) {
    const visible = new Set(ids.has(filter.centerId) ? [filter.centerId] : []);
    for (let i = 0; i < filter.depth; i++) {
      const frontier = new Set(visible);
      for (const e of links) {
        if (frontier.has(e.source)) visible.add(e.target);
        if (frontier.has(e.target)) visible.add(e.source);
      }
    }
    cards = cards.filter((c) => visible.has(c.id));
    links = links.filter((e) => visible.has(e.source) && visible.has(e.target));
  }
  return { cards, links };
}
export function graphBody(data: AppState, card: CanvasCard) {
  return card.kind === 'memo' || card.kind === 'concept'
    ? (data.memos?.find((m) => m.id === card.entityId)?.body ?? '')
    : card.kind === 'narrative'
      ? (data.narratives.find((n) => n.id === card.entityId)?.body ?? '')
      : '';
}
export function graphHref(card: CanvasCard) {
  return card.kind === 'subject'
    ? `#/subject/${encodeURIComponent(card.entityId)}`
    : ['memo', 'concept'].includes(card.kind)
      ? `#/memos/${encodeURIComponent(card.entityId)}`
      : card.kind === 'narrative'
        ? card.ownerId === null
          ? `#/free/${encodeURIComponent(card.entityId)}`
          : '#/canvas'
        : `#/node/${encodeURIComponent(card.entityId)}`;
}
export { graphLayoutParameters, graphVisibleLabels, layoutStudyGraph } from './graph-layout';
import { layoutStudyGraph } from './graph-layout';
export function graphPositions(
  cards: readonly CanvasCard[],
  links: readonly CanvasLink[],
  distance?: number,
) {
  return layoutStudyGraph(cards, links, {
    spacing:
      distance !== undefined && distance < 150
        ? 'compact'
        : distance !== undefined && distance > 150
          ? 'wide'
          : 'auto',
  }).positions;
}
