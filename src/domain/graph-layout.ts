import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import type { CanvasPosition } from './model';
export interface LayoutCard {
  id: string;
  name: string;
}
export interface LayoutLink {
  source: string;
  target: string;
}
export interface GraphFrame {
  width: number;
  height: number;
}
export type GraphSpacing = 'auto' | 'compact' | 'wide';
export interface GraphLayoutOptions {
  frame?: GraphFrame;
  spacing?: GraphSpacing;
  previous?: Record<string, CanvasPosition>;
  pinned?: Record<string, CanvasPosition>;
}
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
/** Estimate only the overview label, never truncate stored names or original text. */
export function graphLabelWidth(name: string) {
  let width = 0;
  for (const char of name) width += (char.codePointAt(0) ?? 0) < 256 ? 7.5 : 14;
  return clamp(width + 12, 48, 192);
}
export function graphLayoutParameters(
  cards: readonly LayoutCard[],
  links: readonly LayoutLink[],
  options: GraphLayoutOptions = {},
) {
  const ids = new Set(cards.map((c) => c.id)),
    neighbours = new Map(cards.map((c) => [c.id, new Set<string>()]));
  const pairs = new Set<string>();
  const edges = links.filter((link) => {
    if (link.source === link.target || !ids.has(link.source) || !ids.has(link.target)) return false;
    const key = JSON.stringify([link.source, link.target].sort());
    if (pairs.has(key)) return false;
    pairs.add(key);
    neighbours.get(link.source)?.add(link.target);
    neighbours.get(link.target)?.add(link.source);
    return true;
  });
  const degree = Object.fromEntries([...neighbours].map(([id, set]) => [id, set.size]));
  const n = cards.length,
    averageDegree = n ? (edges.length * 2) / n : 0;
  const averageLabelWidth = n
    ? cards.reduce((sum, card) => sum + graphLabelWidth(card.name), 0) / n
    : 48;
  const frame = {
    width: Number.isFinite(options.frame?.width)
      ? clamp(options.frame?.width ?? 900, 240, 4000)
      : 900,
    height: Number.isFinite(options.frame?.height)
      ? clamp(options.frame?.height ?? 550, 240, 2000)
      : 550,
  };
  const multiplier = options.spacing === 'compact' ? 0.8 : options.spacing === 'wide' ? 1.3 : 1;
  const crowding = clamp(Math.sqrt((n * 70000) / (frame.width * frame.height)), 1, 4);
  const density = Math.log2(1 + averageDegree),
    aspect = clamp(frame.width / frame.height, 0.65, 2.4);
  const repulsion =
    -(180 + averageLabelWidth * 2.2 + density * 80 + Math.log2(1 + n) * 24) * multiplier ** 2;
  const linkDistance = clamp(
    (90 + averageLabelWidth * 0.45 + density * 18 + crowding * 10) * multiplier,
    100,
    360,
  );
  const gravity = clamp(0.065 / (1 + density * crowding * 0.35), 0.008, 0.055);
  const tension = clamp(0.6 / Math.sqrt(1 + averageDegree), 0.06, 0.45);
  const iterations = Math.round(clamp(160 + Math.log2(1 + n) * 12, 180, 280));
  const sizes = Object.fromEntries(
    cards.map((c) => [c.id, clamp(14 + Math.log2(1 + degree[c.id]) * 3, 14, 28)]),
  );
  const collision = Object.fromEntries(
    cards.map((c) => [
      c.id,
      Math.max(32, graphLabelWidth(c.name) / 2 + 12 + Math.log2(1 + degree[c.id]) * 3) * multiplier,
    ]),
  );
  return {
    degree,
    edges,
    frame,
    multiplier,
    repulsion,
    linkDistance,
    gravity,
    tension,
    iterations,
    aspect,
    sizes,
    collision,
  };
}
/** A deterministic view calculation. Pins apply only to this graph, never to Canvas storage. */
export function layoutStudyGraph(
  cards: readonly LayoutCard[],
  links: readonly LayoutLink[],
  options: GraphLayoutOptions = {},
) {
  const parameters = graphLayoutParameters(cards, links, options);
  const nodes: (SimulationNodeDatum & { id: string })[] = cards.map((card) => {
    const previous = options.previous?.[card.id],
      pinned = options.pinned?.[card.id];
    return {
      id: card.id,
      ...(previous && Number.isFinite(previous.x) && Number.isFinite(previous.y)
        ? { x: previous.x, y: previous.y }
        : {}),
      ...(pinned && Number.isFinite(pinned.x) && Number.isFinite(pinned.y)
        ? { fx: pinned.x, fy: pinned.y }
        : {}),
    };
  });
  if (!nodes.length) return { positions: {}, parameters };
  const simulation = forceSimulation(nodes)
    .stop()
    .force(
      'link',
      forceLink<
        SimulationNodeDatum & { id: string },
        SimulationLinkDatum<SimulationNodeDatum & { id: string }>
      >(parameters.edges.map((e) => ({ ...e })))
        .id((n) => (n as { id: string }).id)
        .distance(
          (e) =>
            parameters.linkDistance +
            Math.log2(
              1 +
                Math.max(
                  parameters.degree[(e.source as { id: string }).id],
                  parameters.degree[(e.target as { id: string }).id],
                ),
            ) *
              14,
        )
        .strength(parameters.tension),
    )
    .force(
      'charge',
      forceManyBody().strength(
        (n) =>
          parameters.repulsion *
          (1 + Math.log2(1 + parameters.degree[(n as { id: string }).id]) * 0.15),
      ),
    )
    .force('x', forceX(0).strength(parameters.gravity / parameters.aspect))
    .force('y', forceY(0).strength(parameters.gravity * parameters.aspect))
    .force(
      'collide',
      forceCollide<SimulationNodeDatum & { id: string }>((n) => parameters.collision[n.id])
        .strength(1)
        .iterations(3),
    );
  simulation.tick(parameters.iterations);
  simulation.stop();
  return {
    positions: Object.fromEntries(nodes.map((n) => [n.id, { x: n.x ?? 0, y: n.y ?? 0 }])),
    parameters,
  };
}
/** Greedy screen-space label placement keeps the selected name first and hides only previews. */
export function graphVisibleLabels(
  cards: readonly LayoutCard[],
  positions: Record<string, CanvasPosition>,
  degree: Record<string, number>,
  zoom: number,
  selected: string | null,
  neighbours: ReadonlySet<string> = new Set(),
) {
  const occupied: { x: number; y: number; w: number; h: number }[] = [],
    visible = new Set<string>();
  const priority = (id: string) =>
    id === selected ? 1e9 : neighbours.has(id) ? 1e8 : (degree[id] ?? 0);
  const sorted = cards
    .map((card, order) => ({ card, order }))
    .sort((a, b) => priority(b.card.id) - priority(a.card.id) || a.order - b.order);
  for (const { card } of sorted) {
    const p = positions[card.id];
    if (!p) continue;
    const r = {
      x: (p.x + 22) * zoom - graphLabelWidth(card.name) / 2,
      y:
        (p.y + 22) * zoom +
        (Math.max(clamp(14 + Math.log2(1 + (degree[card.id] ?? 0)) * 3, 14, 28), 4 / zoom) * zoom) /
          2 +
        8,
      w: graphLabelWidth(card.name),
      h: 24,
    };
    if (
      card.id !== selected &&
      occupied.some(
        (o) =>
          r.x < o.x + o.w + 8 && r.x + r.w + 8 > o.x && r.y < o.y + o.h + 6 && r.y + r.h + 6 > o.y,
      )
    )
      continue;
    occupied.push(r);
    visible.add(card.id);
  }
  return visible;
}
