import { useEffect, useMemo, useState, useRef, type CSSProperties } from 'react';
import {
  ReactFlow,
  Controls,
  Handle,
  Position,
  MarkerType,
  applyNodeChanges,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { AppState, CanvasPosition } from '../domain/model';
import type { CanvasCard } from '../domain/canvas';
import { projectStudyGraph, graphBody, graphHref } from '../domain/study-graph';
import {
  graphLayoutParameters,
  graphVisibleLabels,
  layoutStudyGraph,
  type GraphFrame,
  type GraphSpacing,
  type LayoutCard,
  type LayoutLink,
} from '../domain/graph-layout';
import { Button, Checkbox, EmptyState, Input, Select } from './index';
import './study-graph.css';
import { defaultGraphPreferences, graphPreferencesKey, readGraphPreferences, writeGraphPreferences } from '../data/graph-preferences';
import { archiveDamagedDraft } from '../data/draft-safety';
type GraphNode = Node<
  {
    card: CanvasCard;
    selected: boolean;
    pinned: boolean;
    size: number;
    labelVisible: boolean;
    zoom: number;
  },
  'dot'
>;
const names = {
  subject: '과목',
  unit: '단원',
  outline: '목차',
  topic: '주제',
  memo: '설명',
  narrative: '메모',
  concept: '개념',
};
function Dot({ data }: NodeProps<GraphNode>) {
  return (
    <div
      className={`graph-dot graph-kind-${data.card.kind}${data.selected ? ' is-selected' : ''}${data.labelVisible ? ' has-label' : ''}`}
      title={`${data.card.name}${data.pinned ? ' · 직접 옮긴 점' : ''}`}
      data-positioned={data.pinned || undefined}
      style={
        {
          '--graph-node-size': `${Math.max(data.size, 4 / data.zoom)}px`,
          '--graph-label-scale': 1 / data.zoom,
        } as CSSProperties
      }
    >
      <Handle type="target" position={Position.Left} />
      <span className="graph-point" />
      <Handle type="source" position={Position.Right} />
      <span className="graph-label">{data.card.name}</span>
    </div>
  );
}
const nodeTypes = { dot: Dot };
export function StudyGraph({ data, subjectIds }: { data: AppState; subjectIds: string[] }) {
  const [boot] = useState(() => {
    try { return { preferences: readGraphPreferences(data), error: '', blocked: false }; }
    catch (e) { return { preferences: { ...defaultGraphPreferences }, error: String(e instanceof Error ? e.message : e), blocked: true }; }
  });
  const [query, setQuery] = useState(boot.preferences.query),
    [subject, setSubject] = useState(boot.preferences.subject),
    [notes, setNotes] = useState(boot.preferences.notes);
  const [connections, setConnections] = useState<'all' | 'personal'>(boot.preferences.connections),
    [centerId, setCenterId] = useState<string | null>(null),
    [depth, setDepth] = useState(boot.preferences.depth);
  const [selected, setSelected] = useState<string | null>(null),
    [spacing, setSpacing] = useState<GraphSpacing>(boot.preferences.spacing),
    [flow, setFlow] = useState<ReactFlowInstance<GraphNode> | null>(null);
  const [preferenceError, setPreferenceError] = useState(boot.error),
    [preferencesBlocked, setPreferencesBlocked] = useState(boot.blocked);
  const lastPreferences = useRef(JSON.stringify(boot.preferences));
  const preferenceKey = graphPreferencesKey(data);
  const preferences = useMemo(() => ({ version: 1 as const, query, subject, notes, connections, depth, spacing }), [query, subject, notes, connections, depth, spacing]);
  const storePreferences = () => {
    if (preferencesBlocked) return;
    try { writeGraphPreferences(data, preferences); lastPreferences.current = JSON.stringify(preferences); setPreferenceError(''); }
    catch { setPreferenceError('보기 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장 공간을 확인한 뒤 설정 저장을 다시 시도해 주세요.'); }
  };
  useEffect(() => {
    if (preferencesBlocked || JSON.stringify(preferences) === lastPreferences.current) return;
    try { writeGraphPreferences(data, preferences); lastPreferences.current = JSON.stringify(preferences); setPreferenceError(''); }
    catch { setPreferenceError('보기 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장 공간을 확인한 뒤 설정 저장을 다시 시도해 주세요.'); }
  }, [data, preferences, preferencesBlocked]);
  const subjects = data.subjects.filter((s) => !s.deletedAt && subjectIds.includes(s.id));
  const scopeKey = JSON.stringify(subjectIds);
  const scoped = useMemo(() => {
    const ids = JSON.parse(scopeKey) as string[];
    return subject && ids.includes(subject) ? [subject] : ids;
  }, [scopeKey, subject]);
  const graph = useMemo(
    () => projectStudyGraph(data, scoped, { query, connections, notes, centerId, depth }),
    [data, scoped, query, connections, notes, centerId, depth],
  );
  // Recalculate geometry only when graph structure, names, spacing or frame changes.
  const signature = JSON.stringify({
    cards: graph.cards.map(({ id, name }) => ({ id, name })),
    links: graph.links.map(({ source, target }) => ({ source, target })),
  });
  const input = useMemo(
    () => JSON.parse(signature) as { cards: LayoutCard[]; links: LayoutLink[] },
    [signature],
  );
  const stage = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<GraphFrame>({ width: 900, height: 550 });
  const [positions, setPositions] = useState<Record<string, CanvasPosition>>({});
  const previous = useRef<Record<string, CanvasPosition>>({});
  const [pinned, setPinned] = useState<Record<string, CanvasPosition>>({});
  const fitSignature = useRef('');
  const [fitRevision, setFitRevision] = useState(0);
  const [fitting, setFitting] = useState(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const parameters = useMemo(
    () => graphLayoutParameters(input.cards, input.links, { frame, spacing }),
    [input, frame, spacing],
  );
  useEffect(() => {
    if (!stage.current) return;
    let pendingFrame = 0;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = Math.round(entry.contentRect.width),
        height = Math.round(entry.contentRect.height);
      if (width <= 0 || height <= 0) return;
      // Layout updates run after ResizeObserver delivery to avoid a resize loop.
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(() => {
        setFrame((old) => (old.width === width && old.height === height ? old : { width, height }));
      });
    });
    observer.observe(stage.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(pendingFrame);
    };
  }, []);
  useEffect(() => {
    const options = { frame, spacing, previous: previous.current, pinned };
    const nextFitSignature = JSON.stringify({ input, frame, spacing });
    const needsFit = fitSignature.current !== nextFitSignature;
    setBusy(true);
    setError('');
    const apply = (next: Record<string, CanvasPosition>) => {
      previous.current = next;
      setPositions(next);
      if (needsFit) {
        fitSignature.current = nextFitSignature;
        setFitting(true);
        setFitRevision((n) => n + 1);
      }
      setBusy(false);
    };
    if (typeof Worker === 'undefined') {
      apply(layoutStudyGraph(input.cards, input.links, options).positions);
      return;
    }
    const worker = new Worker(new URL('./graph-layout.worker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (
      event: MessageEvent<{ result?: ReturnType<typeof layoutStudyGraph>; error?: string }>,
    ) => {
      if (event.data.result) apply(event.data.result.positions);
      else {
        setError(event.data.error || '배치를 다시 맞춰 주세요.');
        setBusy(false);
        setFitting(false);
      }
      worker.terminate();
    };
    worker.onerror = () => {
      setError('배치를 계산하지 못했습니다. 다시 맞추기를 눌러 주세요.');
      setBusy(false);
      setFitting(false);
      worker.terminate();
    };
    worker.postMessage({ ...input, options });
    return () => worker.terminate();
  }, [input, frame, spacing, pinned]);
  const initial = useMemo<GraphNode[]>(
    () =>
      graph.cards.map((card, index) => ({
        id: card.id,
        type: 'dot',
        ariaLabel: card.name,
        position: positions[card.id] ?? { x: Math.cos(index) * 100, y: Math.sin(index) * 100 },
        data: {
          card,
          selected: false,
          pinned: false,
          size: parameters.sizes[card.id],
          labelVisible: true,
          zoom: 1,
        },
      })),
    [graph, positions, parameters],
  );
  const [nodes, setNodes] = useState(initial);
  useEffect(() => {
    setNodes(initial);
  }, [initial]);
  useEffect(() => {
    if (flow && fitRevision > 0) {
      let active = true;
      const id = requestAnimationFrame(() => {
        void flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }).then(() => {
          if (active) setFitting(false);
        });
      });
      return () => {
        active = false;
        cancelAnimationFrame(id);
      };
    }
  }, [flow, fitRevision]);
  const neighbourIds = new Set(
    graph.links
      .filter((e) => e.source === selected || e.target === selected)
      .map((e) => (e.source === selected ? e.target : e.source)),
  );
  const visibleLabels = graphVisibleLabels(
    input.cards,
    Object.fromEntries(nodes.map((n) => [n.id, n.position])),
    parameters.degree,
    zoom,
    selected,
    neighbourIds,
  );
  const card = graph.cards.find((c) => c.id === selected),
    related = card ? graph.links.filter((e) => e.source === card.id || e.target === card.id) : [];
  const edges = graph.links.map((e) => ({
    ...e,
    type: 'straight',
    label: e.id.startsWith('auto:') ? undefined : e.label,
    markerEnd: e.id.startsWith('auto:') ? undefined : { type: MarkerType.ArrowClosed },
    className: e.id.startsWith('auto:') ? 'graph-outline-edge' : 'graph-personal-edge',
    style: { stroke: 'var(--color-border-strong)' },
  }));
  return (
    <section className="study-graph" aria-label="그래프뷰">
      <div className="graph-toolbar">
        <Input
          label="관계에서 찾기"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="주제나 메모의 글"
        />
        <Select label="그래프 과목" value={subjects.some((s) => s.id === subject) ? subject : ''} onChange={(e) => setSubject(e.target.value)}>
          <option value="">현재 범위 전체</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
        <Select
          label="표시할 연결"
          value={connections}
          onChange={(e) => setConnections(e.target.value as 'all' | 'personal')}
        >
          <option value="all">목차와 내가 이은 관계</option>
          <option value="personal">내가 이은 관계만</option>
        </Select>
        <Checkbox
          label="설명·메모 함께 보기"
          checked={notes}
          onChange={(e) => setNotes(e.target.checked)}
        />
      </div>
      <div className="graph-actions">
        <span>
          {graph.cards.length}개 항목 · {graph.links.length}개 연결
        </span>
        {centerId && (
          <>
            <Select
              label="주변 연결 범위"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            >
              {[1, 2, 3].map((n) => (
                <option value={n} key={n}>
                  {n}단계
                </option>
              ))}
            </Select>
            <Button onClick={() => setCenterId(null)}>전체 관계 보기</Button>
          </>
        )}
        <Select
          label="배치 간격"
          value={spacing}
          onChange={(e) => setSpacing(e.target.value as GraphSpacing)}
        >
          <option value="auto">자동으로 맞추기</option>
          <option value="compact">조금 가깝게</option>
          <option value="wide">조금 넓게</option>
        </Select>
        <Button
          onClick={() => {
            previous.current = {};
            setPinned({});
            fitSignature.current = '';
          }}
        >
          배치 다시 맞추기
        </Button>
        <a href="#/canvas">Canvas에서 관계 잇기 ↗</a>
      </div>
      {preferenceError && <div role="alert"><p>{preferenceError}</p>{!preferencesBlocked && <Button onClick={storePreferences}>설정 저장 다시 시도</Button>}</div>}
      <div className="graph-actions"><Button variant="quiet" onClick={() => {
        try {
          if (preferencesBlocked) archiveDamagedDraft(preferenceKey, '그래프 보기 설정 원문 보관');
          writeGraphPreferences(data, { ...defaultGraphPreferences });
          lastPreferences.current = JSON.stringify(defaultGraphPreferences);
          setQuery(''); setSubject(''); setNotes(true); setConnections('all'); setDepth(1); setSpacing('auto'); setCenterId(null);
          setPreferencesBlocked(false); setPreferenceError('');
        } catch (e) { setPreferenceError(e instanceof Error ? e.message : '설정 초기화를 완료하지 못했습니다. 현재 설정은 유지했습니다.'); }
      }}>보기 설정 초기화</Button></div>
      {(busy || (fitting && nodes.length > 0)) && <span role="status">관계 배치를 맞추고 있습니다.</span>}
      {error && <p role="alert">{error}</p>}
      <div className="graph-layout">
        <div className="graph-stage" ref={stage} aria-busy={busy || (fitting && nodes.length > 0)}>
          {nodes.length ? (
            <ReactFlow<GraphNode>
              nodes={nodes.map((n) => ({
                ...n,
                data: {
                  ...n.data,
                  selected: n.id === selected,
                  pinned: Boolean(pinned[n.id]),
                  zoom,
                  labelVisible: visibleLabels.has(n.id),
                },
              }))}
              edges={edges}
              nodeTypes={nodeTypes}
              onInit={setFlow}
              onNodesChange={(changes) => setNodes((prev) => applyNodeChanges(changes, prev))}
              onNodeClick={(_, n) => setSelected(n.id)}
              onMove={(_, viewport) => setZoom(viewport.zoom)}
              onNodeDragStop={(_, n) => {
                previous.current = { ...previous.current, [n.id]: n.position };
                setPinned((old) => ({ ...old, [n.id]: n.position }));
              }}
              nodesConnectable={false}
              minZoom={0.02}
              maxZoom={3}
              fitView
              fitViewOptions={{ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }}
              aria-label="주제와 개념의 연결 그래프"
            >
              <Controls showInteractive={false} />
            </ReactFlow>
          ) : (
            <EmptyState
              title="표시할 관계가 없습니다."
              message="검색어나 과목 범위를 바꾸거나 Canvas에서 항목을 연결해 주세요."
            />
          )}
        </div>
        <aside className="graph-detail" aria-label="선택한 항목">
          {card ? (
            <>
              <span>{names[card.kind]}</span>
              <h2>{card.name}</h2>
              {graphBody(data, card) && <p className="graph-body">{graphBody(data, card)}</p>}
              <div className="graph-actions">
                <a href={graphHref(card)}>원문 열기 ↗</a>
                <Button onClick={() => setCenterId(card.id)}>이 항목 주변 보기</Button>
              </div>
              <h3>연결된 항목 {related.length}개</h3>
              {related.map((e) => {
                const other = graph.cards.find(
                  (c) => c.id === (e.source === card.id ? e.target : e.source),
                );
                return (
                  other && (
                    <Button variant="quiet" key={e.id} onClick={() => setSelected(other.id)}>
                      {other.name}
                      <small>
                        {e.id.startsWith('auto:')
                          ? e.label
                          : `${e.source === card.id ? '→' : '←'} ${e.label || '내가 이은 관계'}`}
                      </small>
                    </Button>
                  )
                );
              })}
            </>
          ) : (
            <p>점을 선택하면 원문과 연결을 볼 수 있습니다.</p>
          )}
        </aside>
      </div>
      <details className="graph-list">
        <summary>항목 목록에서 선택하기</summary>
        <div>
          {graph.cards.map((c) => (
            <Button
              key={c.id}
              variant="quiet"
              aria-pressed={c.id === selected}
              onClick={() => setSelected(c.id)}
            >
              {names[c.kind]} · {c.name}
            </Button>
          ))}
        </div>
      </details>
      <p className="graph-legend">
        실선은 목차 관계, 화살표는 직접 이은 관계입니다. 연결이 많은 점은 조금 크게 표시합니다.
        이름이 겹치면 일부를 접어 표시하며, 확대하거나 점을 선택하면 확인할 수 있습니다. 끌어 옮긴
        점은 이 화면에서 유지되며, 다시 맞추기를 누르면 자동 배치로 돌아갑니다.
      </p>
    </section>
  );
}
