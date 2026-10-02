import { useMemo, useRef } from 'react';
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  type Viewport,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import maps from '../domain/linear-algebra-maps.json';
import catalog from '../domain/linear-algebra-catalog.json';
import type { AppState } from '../domain/model';
import { useViewContext } from './use-view-context';
import { KnowledgeStructure } from './knowledge-structure';
import { FlowControls } from './flow-controls';
import { flowAriaLabels } from './flow-experience';
import { Button } from './index';
import '@xyflow/react/dist/style.css';
type ConceptNode = Node<
  { name: string; role: string; selected: boolean; choose: () => void },
  'concept'
>;
function ConceptModule({ data }: NodeProps<ConceptNode>) {
  return (
    <div className="linear-map-module" data-selected={data.selected}>
      <Handle type="target" position={Position.Top} />
      <Button aria-pressed={data.selected} onClick={data.choose}>
        {data.name}
      </Button>
      <p className="prose">{data.role}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
const nodeTypes = { concept: ConceptModule };
const validView = (v: unknown): v is Viewport | null =>
  v === null ||
  (!!v &&
    typeof v === 'object' &&
    [...Object.values(v)].length === 3 &&
    [...Object.values(v)].every(Number.isFinite) &&
    (v as Viewport).zoom >= 0.1 &&
    (v as Viewport).zoom <= 3);
export function LinearConceptMap({
  data,
  selected,
  onSelect,
}: {
  data: AppState;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const index = catalog.concepts.find((c) => c.id === selected)?.map ?? 0,
    map = maps[index],
    flow = useRef<ReactFlowInstance<ConceptNode> | null>(null);
  const [view, setView] = useViewContext<Viewport | null>(
    data,
    `linear-map:${index}`,
    null,
    validView,
  );
  const visual = useMemo(
    () => ({
      kind: 'relation' as const,
      label: map.title,
      highlighted: [selected],
      nodes: map.nodeData.map((n) => {
        const c = catalog.concepts.find((x) => x.id === `${index}:${n.key}`)!;
        return { id: c.id, label: c.name, detail: c.role };
      }),
      relations: map.pathData.map((p, i) => {
        const [, from, to] = p.id.split('-');
        return {
          from: `${index}:${from}`,
          to: `${index}:${to}`,
          label: map.labelData[i].label.replaceAll('\\n', ' '),
        };
      }),
    }),
    [index, map, selected],
  );
  const graph = useMemo(() => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 65, ranksep: 155 });
    g.setDefaultEdgeLabel(() => ({}));
    visual.nodes.forEach((n) => g.setNode(n.id, { width: 300, height: 150 }));
    visual.relations.forEach((e) => g.setEdge(e.from, e.to));
    dagre.layout(g);
    return {
      nodes: visual.nodes.map((n) => ({
        id: n.id,
        type: 'concept' as const,
        position: { x: g.node(n.id).x - 150, y: g.node(n.id).y - 75 },
        data: {
          name: n.label,
          role: n.detail,
          selected: n.id === selected,
          choose: () => onSelect(n.id),
        },
        draggable: false,
      })),
      edges: visual.relations.map((e, i) => ({
        id: map.pathData[i].id,
        source: e.from,
        target: e.to,
        label: e.label,
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: {
          stroke: 'var(--color-text)',
          strokeDasharray: map.pathData[i].dashed ? '6 4' : undefined,
        },
        labelStyle: { fill: 'var(--color-text)', fontSize: 14 },
        labelBgStyle: { fill: 'var(--color-surface)' },
        labelBgPadding: [8, 5] as [number, number],
      })),
    };
  }, [visual, map, selected, onSelect]);
  return (
    <section aria-label="선형대수 개념 연결도">
      <h3>{map.title}</h3>
      <p className="prose">
        상자에는 개념과 역할, 화살표에는 뒤에서 필요한 이유가 있다. 상자를 선택하면 그 개념으로
        이동한다. 전체 맞춤에서 글씨가 작으면 기본 글자 크기로 펼쳐 읽는다.
      </p>
      <div className="actions">
        <Button
          onClick={() => {
            const current = graph.nodes.find((node) => node.id === selected);
            if (current)
              void flow.current?.setCenter(current.position.x + 150, current.position.y + 75, {
                zoom: 1,
              });
          }}
        >
          현재 개념으로 이동
        </Button>
        <Button onClick={() => void flow.current?.zoomTo(1)}>기본 글자 크기로 보기</Button>
        <Button onClick={() => void flow.current?.fitView({ padding: 0.1 })}>
          연결도 전체 보기
        </Button>
      </div>
      <div
        className="linear-map-viewport"
        role="region"
        aria-label="개념 연결도 · 방향키로 이동"
        tabIndex={0}
        onKeyDown={(e) => {
          const v = flow.current?.getViewport(),
            offset: Record<string, [number, number]> = {
              ArrowLeft: [40, 0],
              ArrowRight: [-40, 0],
              ArrowUp: [0, 40],
              ArrowDown: [0, -40],
            };
          if (e.target !== e.currentTarget || !v || !offset[e.key]) return;
          e.preventDefault();
          void flow.current?.setViewport({
            ...v,
            x: v.x + offset[e.key][0],
            y: v.y + offset[e.key][1],
          });
        }}
      >
        <ReactFlow<ConceptNode>
          key={index}
          nodes={graph.nodes}
          edges={graph.edges}
          nodeTypes={nodeTypes}
          onInit={(f) => {
            flow.current = f;
            if (!view) {
              const current = graph.nodes.find((node) => node.id === selected);
              if (current)
                void f.setCenter(current.position.x + 150, current.position.y + 75, { zoom: 1 });
            }
          }}
          defaultViewport={view ?? undefined}
          minZoom={0.1}
          maxZoom={3}
          nodesDraggable={false}
          nodesConnectable={false}
          deleteKeyCode={null}
          onMoveEnd={(_, v) => setView(v)}
          zoomOnScroll={false}
          preventScrolling={false}
          ariaLabelConfig={flowAriaLabels}
        >
          <FlowControls showInteractive={false} />
        </ReactFlow>
      </div>
      <details>
        <summary>현재 개념의 연결을 문장으로 읽기</summary>
        <KnowledgeStructure
          visual={{
            ...visual,
            nodes: visual.nodes.filter(
              (n) =>
                n.id === selected ||
                visual.relations.some(
                  (r) =>
                    (r.from === selected && r.to === n.id) ||
                    (r.to === selected && r.from === n.id),
                ),
            ),
            relations: visual.relations.filter((r) => r.from === selected || r.to === selected),
          }}
          data={data}
          viewKey={`linear:${selected}`}
        />
      </details>
    </section>
  );
}
