import { useEffect, useMemo, useState, useRef } from 'react';
import dagre from '@dagrejs/dagre';
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
  BaseEdge,
  EdgeLabelRenderer,
  useNodesInitialized,
  useReactFlow,
  getViewportForBounds,
  type NodeProps,
  type EdgeProps,
  type Node,
  type Edge,
  type Viewport,
} from '@xyflow/react';
import type { ConceptVisual } from '../domain/concept-production';
import type { AppState } from '../domain/model';
import { ConceptText } from './concept-text';
import { Button } from './index';
import { FlowControls } from './flow-controls';
import { flowAriaLabels } from './flow-experience';
import { useViewContext } from './use-view-context';
import '@xyflow/react/dist/style.css';

type ModuleData = { label: string; detail: string; emphasized: boolean };
type ModuleNode = Node<ModuleData, 'knowledge'>;
type RelationData = {
  points: { x: number; y: number }[];
  x: number;
  y: number;
  label: string;
  width: number;
};
type RelationEdge = Edge<RelationData, 'knowledge'>;
const NODE_WIDTH = 280;
const LABEL_WIDTH = 240;
const validViewport = (value: unknown): value is Viewport | null =>
  value === null ||
  (typeof value === 'object' &&
    value !== null &&
    ['x', 'y', 'zoom'].every(
      (key) =>
        typeof (value as Record<string, unknown>)[key] === 'number' &&
        Number.isFinite((value as Record<string, number>)[key]),
    ) &&
    (value as Viewport).zoom >= 0.05 &&
    (value as Viewport).zoom <= 2);

function Module({ data }: NodeProps<ModuleNode>) {
  return (
    <div className={`knowledge-module${data.emphasized ? ' is-emphasized' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <dl>
        <dt>
          <ConceptText text={data.label} />
        </dt>
        <dd>
          <ConceptText text={data.detail} />
        </dd>
      </dl>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
function Relation({ data, markerEnd }: EdgeProps<RelationEdge>) {
  if (!data) return null;
  // Keep graph coordinates and exact authored direction; orthogonal segments are the reference-map default.
  const path = data.points
    .map((p, i) =>
      i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${data.points[i - 1].y} L ${p.x},${p.y}`,
    )
    .join(' ');
  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          className="knowledge-diagram-label nodrag nopan"
          style={{
            width: data.width,
            transform: `translate(-50%, -50%) translate(${data.x}px, ${data.y}px)`,
          }}
        >
          <ConceptText text={data.label} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
const nodeTypes = { knowledge: Module };
const edgeTypes = { knowledge: Relation };

/** Reuse the existing Dagre/React Flow tools, with measured modules and space reserved for authored labels. */
function diagramLayout(
  visual: ConceptVisual,
  sizes: Map<string, number>,
  width: number,
  labelSizes: number[],
) {
  const graph = new dagre.graphlib.Graph({ multigraph: true });
  graph.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 48, marginx: 24, marginy: 24 });
  graph.setDefaultEdgeLabel(() => ({}));
  const modules = new Map(visual.nodes.map((node) => [node.id, node]));
  for (const relation of visual.relations)
    for (const id of [relation.from, relation.to]) {
      if (!modules.has(id))
        modules.set(id, {
          id,
          label: `연결 대상 확인 필요 (${id})`,
          detail: '원문 연결을 확인해야 한다.',
        });
    }
  for (const node of modules.values())
    graph.setNode(node.id, {
      width,
      height: sizes.get(node.id) ?? 160,
    });
  visual.relations.forEach((relation, index) =>
    graph.setEdge(
      relation.from,
      relation.to,
      {
        width: Math.min(LABEL_WIDTH, width),
        height: Math.max(64, labelSizes[index] ?? 96),
        labelpos: 'c',
      },
      String(index),
    ),
  );
  dagre.layout(graph);
  const nodes: ModuleNode[] = [...modules.values()].map((node) => {
    const box = graph.node(node.id);
    return {
      id: node.id,
      type: 'knowledge',
      position: { x: box.x - box.width / 2, y: box.y - box.height / 2 },
      style: { width },
      data: {
        label: node.label,
        detail: node.detail,
        emphasized: visual.highlighted.includes(node.id),
      },
    };
  });
  const occupied = [...modules.values()].map((node) => {
    const box = graph.node(node.id);
    return {
      left: box.x - box.width / 2,
      right: box.x + box.width / 2,
      top: box.y - box.height / 2,
      bottom: box.y + box.height / 2,
    };
  });
  const edges: RelationEdge[] = visual.relations.map((relation, index) => {
    const edge = graph.edge({ v: relation.from, w: relation.to, name: String(index) });
    const labelWidth = Math.min(LABEL_WIDTH, width);
    const labelHeight = Math.max(48, (labelSizes[index] ?? 96) - 16);
    const rectangle = (x: number, y: number) => ({
      left: x - labelWidth / 2 - 8,
      right: x + labelWidth / 2 + 8,
      top: y - labelHeight / 2 - 8,
      bottom: y + labelHeight / 2 + 8,
    });
    const free = (x: number, y: number) => {
      const box = rectangle(x, y);
      return occupied.every(
        (other) =>
          box.right <= other.left ||
          box.left >= other.right ||
          box.bottom <= other.top ||
          box.top >= other.bottom,
      );
    };
    const candidates: { x: number; y: number }[] = [{ x: edge.x, y: edge.y }];
    const orthogonal = edge.points.flatMap((p: { x: number; y: number }, i: number) =>
      i === 0 ? [p] : [{ x: p.x, y: edge.points[i - 1].y }, p],
    );
    for (let i = 1; i < orthogonal.length; i++) {
      const a = orthogonal[i - 1],
        b = orthogonal[i];
      for (const fraction of [0.5, 0.25, 0.75])
        candidates.push({ x: a.x + (b.x - a.x) * fraction, y: a.y + (b.y - a.y) * fraction });
    }
    candidates.sort(
      (a, b) => Math.hypot(a.x - edge.x, a.y - edge.y) - Math.hypot(b.x - edge.x, b.y - edge.y),
    );
    let label = candidates.find((p) => free(p.x, p.y));
    let points = edge.points;
    if (!label) {
      // A long cross-connection may lack an open label span. Give it an outer lane, rather than covering a concept.
      const right = Math.max(...occupied.map((box) => box.right));
      const first = points[0],
        last = points[points.length - 1];
      label = { x: right + labelWidth / 2 + 48, y: (first.y + last.y) / 2 };
      points = [
        first,
        { x: first.x, y: first.y + 24 },
        { x: label.x, y: first.y + 24 },
        label,
        { x: label.x, y: last.y - 24 },
        { x: last.x, y: last.y - 24 },
        last,
      ];
    }
    occupied.push(rectangle(label.x, label.y));
    return {
      id: `authored-${index}`,
      source: relation.from,
      target: relation.to,
      type: 'knowledge',
      markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--color-text)' },
      data: {
        points,
        x: label.x,
        y: label.y,
        width: Math.min(LABEL_WIDTH, width),
        label: relation.label.trim() || '관계 설명이 비어 있습니다',
      },
    };
  });
  const left = Math.min(...occupied.map((box) => box.left)),
    top = Math.min(...occupied.map((box) => box.top));
  return {
    nodes,
    edges,
    bounds: {
      x: left,
      y: top,
      width: Math.max(...occupied.map((box) => box.right)) - left,
      height: Math.max(...occupied.map((box) => box.bottom)) - top,
    },
  };
}

function Diagram({
  visual,
  data,
  viewKey,
}: {
  visual: ConceptVisual;
  data: Pick<AppState, 'namespace' | 'userId'>;
  viewKey: string;
}) {
  const flow = useReactFlow<ModuleNode, RelationEdge>();
  const initialized = useNodesInitialized();
  const [sizes, setSizes] = useState(new Map<string, number>());
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(NODE_WIDTH);
  const [labelSizes, setLabelSizes] = useState<number[]>([]);
  const [viewport, setViewport] = useViewContext<Viewport | null>(
    data,
    `knowledge-diagram:${viewKey}`,
    null,
    validViewport,
  );
  const layout = useMemo(
    () => diagramLayout(visual, sizes, width, labelSizes),
    [visual, sizes, width, labelSizes],
  );
  useEffect(() => {
    if (!host.current) return;
    const measure = () => {
      const available = host.current!.clientWidth;
      if (available) setWidth(Math.min(NODE_WIDTH, Math.max(180, available - 32)));
      const modules = [...host.current!.querySelectorAll<HTMLElement>('.react-flow__node')];
      const heights = new Map(
        modules
          .filter((node) => node.offsetHeight > 0)
          .map((node) => [node.dataset.id!, node.offsetHeight]),
      );
      if (heights.size)
        setSizes((old) =>
          old.size === heights.size && [...heights].every(([id, height]) => old.get(id) === height)
            ? old
            : heights,
        );
      const labels = [
        ...host.current!.querySelectorAll<HTMLElement>('.knowledge-diagram-label'),
      ].map((n) => n.offsetHeight + 32);
      if (labels.length)
        setLabelSizes((old) =>
          old.length === labels.length && labels.every((height, i) => old[i] === height)
            ? old
            : labels,
        );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host.current);
    host.current.querySelectorAll('.knowledge-diagram-label').forEach((n) => observer.observe(n));
    host.current.querySelectorAll('.react-flow__node').forEach((n) => observer.observe(n));
    measure();
    return () => observer.disconnect();
  }, [initialized, visual]);
  const first =
    layout.nodes.find((node) => visual.highlighted.includes(node.id)) ?? layout.nodes[0];
  const readingViewport = {
    x: 16 - (first?.position.x ?? 0),
    y: 16 - (first?.position.y ?? 0),
    zoom: 1,
  };
  useEffect(() => {
    if (viewport === null) void flow.setViewport(readingViewport);
  }, [first?.position.x, first?.position.y, viewport, flow]);
  const read = () =>
    void flow.setViewport(readingViewport).then(() => setViewport(readingViewport));
  const overview = () => {
    if (!host.current) return;
    const next = getViewportForBounds(
      layout.bounds,
      host.current.clientWidth,
      host.current.clientHeight,
      0.05,
      1,
      0.12,
    );
    void flow.setViewport(next).then(() => setViewport(next));
  };
  return (
    <>
      <div className="knowledge-view-controls" role="group" aria-label="개념 지도 보기 조절">
        <Button variant="quiet" onClick={overview}>
          전체 보기
        </Button>
        <Button variant="quiet" onClick={read}>
          읽기 배율로
        </Button>
      </div>
      <p className="knowledge-sequence-note">
        전체 보기는 연결의 배치를, 읽기 배율은 글을 확인하는 보기이다. 지도 안을 끌어 이동하거나
        확대할 수 있다.
      </p>
      <div
        ref={host}
        className="knowledge-diagram-viewport"
        tabIndex={0}
        role="region"
        aria-label={`${visual.label} · 연결 지도`}
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
          )
            return;
          event.preventDefault();
          const old = flow.getViewport();
          const next = {
            ...old,
            x: old.x + (event.key === 'ArrowLeft' ? 80 : event.key === 'ArrowRight' ? -80 : 0),
            y: old.y + (event.key === 'ArrowUp' ? 80 : event.key === 'ArrowDown' ? -80 : 0),
          };
          void flow.setViewport(next).then(() => setViewport(next));
        }}
      >
        <ReactFlow<ModuleNode, RelationEdge>
          nodes={layout.nodes}
          edges={layout.edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultViewport={viewport ?? readingViewport}
          onInit={(instance) => void instance.setViewport(viewport ?? readingViewport)}
          onMoveEnd={(event, next) => {
            if (event) setViewport(next);
          }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          edgesFocusable={false}
          nodesFocusable={false}
          minZoom={0.05}
          maxZoom={2}
          zoomOnScroll={false}
          preventScrolling={false}
          zoomOnDoubleClick={false}
          ariaLabelConfig={flowAriaLabels}
          proOptions={{ hideAttribution: true }}
        >
          <FlowControls
            showFitView={false}
            showInteractive={false}
            aria-label="지도의 확대와 이동"
            onZoomIn={() => setViewport(flow.getViewport())}
            onZoomOut={() => setViewport(flow.getViewport())}
          />
        </ReactFlow>
      </div>
    </>
  );
}
export function KnowledgeDiagram(props: Parameters<typeof Diagram>[0]) {
  return (
    <ReactFlowProvider key={`${props.data.namespace}:${props.data.userId}:${props.viewKey}`}>
      <Diagram {...props} />
    </ReactFlowProvider>
  );
}
