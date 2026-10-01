import dagre from '@dagrejs/dagre';
import type { CanvasPosition, CanvasLink } from './model';

export interface FlowBox {
  id: string;
  position: CanvasPosition;
  width?: number;
  height?: number;
}
/** Layout is explicit: callers decide when to replace personal coordinates. */
export function layoutFlowBoxes(
  boxes: readonly FlowBox[],
  links: readonly Pick<CanvasLink, 'source' | 'target'>[],
  direction: 'LR' | 'TB' = 'LR',
  spacing = 1,
) {
  const graph = new dagre.graphlib.Graph({ multigraph: true });
  const gap = Number.isFinite(spacing) ? Math.max(0.5, Math.min(2, spacing)) : 1;
  graph.setGraph({
    rankdir: direction,
    nodesep: 64 * gap,
    ranksep: 100 * gap,
    marginx: 32,
    marginy: 32,
  });
  graph.setDefaultEdgeLabel(() => ({}));
  const ids = new Set(boxes.map((box) => box.id));
  for (const box of boxes)
    graph.setNode(box.id, {
      width: Math.max(44, box.width ?? 300),
      height: Math.max(44, box.height ?? 180),
    });
  links.forEach((link, index) => {
    if (ids.has(link.source) && ids.has(link.target) && link.source !== link.target)
      graph.setEdge(link.source, link.target, {}, String(index));
  });
  dagre.layout(graph);
  return Object.fromEntries(
    boxes.map((box) => {
      const node = graph.node(box.id);
      return [box.id, { x: node.x - node.width / 2, y: node.y - node.height / 2 }];
    }),
  );
}
export function alignFlowBoxes(boxes: readonly FlowBox[], axis: 'x' | 'y') {
  if (!boxes.length) return {};
  const value = Math.min(...boxes.map((box) => box.position[axis]));
  return Object.fromEntries(boxes.map((box) => [box.id, { ...box.position, [axis]: value }]));
}
export function validFlowConnection(
  source: string | null,
  target: string | null,
  ids: ReadonlySet<string>,
  links: readonly Pick<CanvasLink, 'id' | 'source' | 'target'>[],
  replacing?: string,
) {
  return Boolean(
    source &&
    target &&
    source !== target &&
    ids.has(source) &&
    ids.has(target) &&
    !links.some(
      (link) => link.id !== replacing && link.source === source && link.target === target,
    ),
  );
}
