import { FlowControls } from './flow-controls';
import {
  memo,
  useCallback,
  useEffectEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  ReactFlow,
  useViewport,
  NodeToolbar,
  NodeResizeControl,
  SelectionMode,
  Handle,
  Position,
  MarkerType,
  applyNodeChanges,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, EmptyState, Select, Input } from './index';
import { MemoEditor } from './quick-memos';
import { CanvasConceptEditor } from './canvas-concept-editor';
import { conceptText } from '../domain/canvas-concept';
import { InkPreview } from './ink-drawing';
import type { AppState, Narrative, QuickMemo, CanvasPosition } from '../domain/model';
import { CANVAS_ID, projectCanvas, type CanvasCard, type CanvasContent } from '../domain/canvas';
import {
  readCanvasDraft,
  writeCanvasDraft,
  clearCanvasDraft,
  preserveCanvasDraft,
  readConnectionDraft,
  writeConnectionDraft,
  clearConnectionDraft,
  type ConnectionDraft,
} from '../data/canvas-draft';
import type { StudyRepository } from '../data/repository';
import './study-canvas.css';
import { flowPreferencesKey, useFlowPreferences } from '../data/flow-preferences';
import { FlowExperience, flowAriaLabels, flowSnapGrid, flowEdgeType } from './flow-experience';
import { layoutFlowBoxes, alignFlowBoxes, validFlowConnection } from '../domain/flow-layout';
import { FlowHistory } from '../domain/flow-history';
import { CanvasTransfer } from './canvas-transfer';

type CardData = {
  card: CanvasCard;
  body?: string;
  memo?: QuickMemo;
  editor?: ReactNode;
  saveMessage?: string;
  open: () => void;
  close: () => void;
  resize?: (width: number) => void;
  toolbarVisible?: boolean;
};
type CardNode = Node<CardData, 'study'>;
const kinds = {
  subject: '과목',
  unit: '단원',
  outline: '목차',
  topic: '주제',
  memo: '내 설명',
  narrative: '내 메모',
  concept: '개념',
};
const StudyCard = memo(function StudyCard({ data, selected }: NodeProps<CardNode>) {
  const { card } = data;
  const { zoom } = useViewport();
  const editButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!data.saveMessage || data.editor) return;
    // Let React Flow measure the smaller card before returning keyboard focus.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => editButton.current?.focus({ preventScroll: true }));
    });
    return () => cancelAnimationFrame(frame);
  }, [data.saveMessage, data.editor]);
  return (
    <article
      className={`canvas-card canvas-kind-${card.kind}${selected ? ' is-selected' : ''}${data.editor ? ' is-editing' : ''}`}
      aria-label={`${kinds[card.kind]} 카드 ${card.name}`}
      style={{ width: '100%' }}
    >
      <NodeToolbar isVisible={Boolean(data.toolbarVisible) && !data.editor} position={Position.Top}>
        <div className="flow-node-tools">
          <Button onClick={data.open}>선택한 카드 편집</Button>
        </div>
      </NodeToolbar>
      {selected && data.resize && !data.editor && (
        <NodeResizeControl
          minWidth={240}
          maxWidth={1000}
          resizeDirection="horizontal"
          position="bottom-right"
          onResizeEnd={(_, params) => data.resize?.(params.width)}
        >
          <span title="카드 너비 조절">↔</span>
        </NodeResizeControl>
      )}
      <Handle type="target" position={Position.Left} />
      <header className="canvas-drag-handle">
        {card.kind !== 'memo' && card.kind !== 'narrative' && (
          <span className="canvas-role">{kinds[card.kind]}</span>
        )}
        <h2>{card.name}</h2>
      </header>
      <section
        className="canvas-card-body nodrag nopan nowheel"
        aria-label={`${card.name} 내용`}
        onKeyDown={(event) => {
          // WebKit does not reliably scroll focused regions inside transformed graph nodes.
          // Keep editor and selection shortcuts local; move only this region with plain keys.
          if (
            event.target !== event.currentTarget ||
            event.nativeEvent.isComposing ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
          )
            return;
          if (
            ![
              'ArrowDown',
              'ArrowUp',
              'ArrowLeft',
              'ArrowRight',
              'PageDown',
              'PageUp',
              'Home',
              'End',
              ' ',
            ].includes(event.key)
          )
            return;
          event.stopPropagation();
          if (event.shiftKey && event.key !== ' ') return;
          event.preventDefault();
          const element = event.currentTarget;
          const line = parseFloat(getComputedStyle(element).lineHeight) || 24;
          const page = Math.max(line, element.clientHeight - line);
          if (event.key === 'ArrowDown') element.scrollTop += line;
          else if (event.key === 'ArrowUp') element.scrollTop -= line;
          else if (event.key === 'ArrowLeft') element.scrollLeft -= line;
          else if (event.key === 'ArrowRight') element.scrollLeft += line;
          else if (event.key === 'Home') element.scrollTop = 0;
          else if (event.key === 'End') element.scrollTop = element.scrollHeight;
          else element.scrollTop += event.key === 'PageUp' || event.shiftKey ? -page : page;
        }}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Named independent scroll region remains keyboard reachable when zoom hides card actions.
        tabIndex={0}
      >
        {data.editor ?? (
          <>
            {data.memo?.strokes.length ? (
              <InkPreview
                strokes={data.memo.strokes}
                className="canvas-sketch"
                label="저장한 설명 그림"
              />
            ) : null}
            {data.body && <p className="canvas-original">{data.body}</p>}
            {data.saveMessage && (
              <p className="canvas-save-status" role="status">
                {data.saveMessage}
              </p>
            )}
            <div className="canvas-zoom-actions">
              <div
                className="canvas-card-actions"
                style={{ visibility: zoom >= 0.55 ? 'visible' : 'hidden' }}
                aria-hidden={zoom < 0.55}
                inert={zoom < 0.55}
              >
                <Button ref={editButton} variant="quiet" onClick={data.open}>
                  {card.kind === 'memo' || card.kind === 'narrative' || card.kind === 'concept'
                    ? '카드 안에서 편집'
                    : '메모 쓰기'}
                </Button>
                {card.kind !== 'memo' && card.kind !== 'narrative' && card.kind !== 'concept' && (
                  <a
                    href={`#/${card.kind === 'subject' ? 'subject' : 'node'}/${encodeURIComponent(card.entityId)}`}
                  >
                    열기 ↗
                  </a>
                )}
              </div>
              <p
                className="canvas-action-hint"
                style={{ visibility: zoom < 0.55 ? 'visible' : 'hidden' }}
                aria-hidden={zoom >= 0.55}
              >
                카드를 선택한 뒤 아래에서 열거나 편집하세요.
              </p>
            </div>
          </>
        )}
      </section>
      <Handle type="source" position={Position.Right} />
    </article>
  );
});
const nodeTypes = { study: StudyCard };
export function StudyCanvas({
  data,
  repository,
  onSaved,
  subjectIds,
  renderNarrative,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (next: AppState) => void;
  subjectIds: string[];
  renderNarrative: (
    ownerId: string,
    narrative: Narrative | undefined,
    onSaved: () => void,
  ) => ReactNode;
}) {
  const tools = useFlowPreferences(flowPreferencesKey(data, 'canvas'));
  const history = useRef(new FlowHistory());
  const [, refreshHistory] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [transferOpen, setTransferOpen] = useState(false);
  const serverReady =
    data.namespace === 'demo' ||
    repository.getCapabilities?.().includes('saveCanvasLayout') === true;
  const saved = data.canvasLayouts?.find((row) => row.id === CANVAS_ID && !row.deletedAt);
  const [boot] = useState(() => {
    const fallback: CanvasContent = {
      positions: saved?.positions ?? {},
      links: saved?.links ?? [],
      viewport: saved?.viewport,
    };
    try {
      const draft = readCanvasDraft(data);
      if (draft && draft.baseVersion !== (saved?.version ?? 0)) {
        if (JSON.stringify(draft.content) === JSON.stringify(fallback)) {
          clearCanvasDraft(data);
          return { content: fallback, error: '', blocked: false };
        }
        return {
          content: fallback,
          error:
            '배치 초안과 저장된 배치의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안 보관본에서 확인해 주세요.',
          blocked: true,
        };
      }
      return {
        content: draft?.content ?? fallback,
        error: draft
          ? '이 기기의 배치 초안을 불러왔습니다. 저장 다시 시도를 눌러 기록에 반영해 주세요.'
          : '',
        blocked: false,
      };
    } catch (e) {
      return {
        content: fallback,
        error: e instanceof Error ? e.message : 'Canvas 배치 초안을 읽지 못했습니다.',
        blocked: true,
      };
    }
  });
  const [content, setContent] = useState(boot.content),
    [error, setError] = useState(boot.error);
  const labelBefore = useRef<CanvasContent | null>(null);
  const current = useRef(content);
  current.current = content;
  const version = useRef(saved?.version ?? 0);
  const [editorId, setEditorId] = useState<string | null>(null),
    [selectedId, setSelectedId] = useState<string | null>(null),
    [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [savedCard, setSavedCard] = useState<{ id: string; message: string } | null>(null);
  const [course, setCourse] = useState('all');
  const [conceptOpen, setConceptOpen] = useState(false);
  const [focusConcept, setFocusConcept] = useState<string | null>(null);
  const [connectionBoot] = useState(() => {
    try {
      return { draft: readConnectionDraft(data), error: '' };
    } catch (e) {
      return {
        draft: { source: '', target: '', label: '' },
        error: e instanceof Error ? e.message : '연결 초안을 읽지 못했습니다.',
      };
    }
  });
  const [connection, setConnection] = useState<ConnectionDraft>(connectionBoot.draft);
  const [connectionOpen, setConnectionOpen] = useState(
    Boolean(connectionBoot.draft.label || connectionBoot.error),
  );
  const [connectionError, setConnectionError] = useState(connectionBoot.error);
  const [composing, setComposing] = useState(false);
  const subjects = data.subjects.filter((s) => !s.deletedAt && subjectIds.includes(s.id));
  // Keep displayed default positions stable when a note adds a new card. Saved
  // and explicitly changed geometry always takes precedence over this view cache.
  const displayedPositions = useRef<Record<string, CanvasPosition>>({});
  const subjectIdsKey = JSON.stringify(subjectIds);
  const scopeIds = useMemo(() => JSON.parse(subjectIdsKey) as string[], [subjectIdsKey]);
  const projection = useMemo(() => {
    const next = projectCanvas(
      data,
      course === 'all' ? scopeIds : scopeIds.filter((id) => id === course),
      { ...content, positions: { ...displayedPositions.current, ...content.positions } },
      course === 'all',
    );
    for (const card of next.cards) displayedPositions.current[card.id] = card.position;
    return next;
  }, [data, course, scopeIds, content]);
  const [nodes, setNodes] = useState<CardNode[]>([]);
  const flow = useRef<ReactFlowInstance<CardNode, Edge> | null>(null);
  const save = (nextContent: CanvasContent, remember = true) => {
    if (boot.blocked || !serverReady) return false;
    const next = {
      ...nextContent,
      positions: {
        ...Object.fromEntries(projection.cards.map((card) => [card.id, card.position])),
        ...nextContent.positions,
      },
    };
    if (remember)
      history.current.record(
        {
          ...(labelBefore.current ?? current.current),
          positions: {
            ...Object.fromEntries(projection.cards.map((card) => [card.id, card.position])),
            ...current.current.positions,
          },
        },
        next,
      );
    labelBefore.current = null;
    refreshHistory((value) => value + 1);
    setContent(next);
    current.current = next;
    try {
      writeCanvasDraft(data, { baseVersion: version.current, content: next });
      const result = repository.execute({
        type: 'saveCanvasLayout',
        id: CANVAS_ID,
        expectedVersion: version.current,
        ...next,
        opId: crypto.randomUUID(),
        at: new Date().toISOString(),
        userId: data.userId,
        namespace: data.namespace,
      });
      const committedLayout = result.canvasLayouts?.find((row) => row.id === CANVAS_ID);
      if (!committedLayout) throw Error('저장한 배치를 확인하지 못했습니다.');
      version.current = committedLayout.version;
      onSaved(result);
      setError('');
      try {
        clearCanvasDraft(data);
      } catch {
        setError(
          '배치는 이 기기에 저장했습니다. 초안 정리가 남았습니다. 저장 다시 시도를 눌러 주세요.',
        );
      }
      return true;
    } catch (e) {
      setError(
        `${e instanceof Error ? e.message : '저장하지 못했습니다.'} 화면의 배치는 유지했습니다. 저장 다시 시도로 재시도할 수 있습니다.`,
      );
      return false;
    }
  };
  const saveViewport = () => {
    const viewport = flow.current?.getViewport();
    if (viewport && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport))
      save({ ...current.current, viewport }, false);
  };
  const saveControlViewport = () => requestAnimationFrame(saveViewport);
  const synchronizeCards = useEffectEvent(() => {
    setNodes((previous) =>
      projection.cards.map((card) => {
        const previousNode = previous.find((row) => row.id === card.id);
        const memo =
          card.kind === 'memo' || card.kind === 'concept'
            ? data.memos?.find((row) => row.id === card.entityId)
            : undefined;
        const narrative =
          card.kind === 'narrative'
            ? data.narratives.find((row) => row.id === card.entityId)
            : undefined;
        let editor: ReactNode;
        if (editorId === card.id)
          editor =
            card.kind === 'concept' && memo ? (
              <CanvasConceptEditor
                key={memo.id}
                data={data}
                repository={repository}
                memo={memo}
                onSaved={(next) => {
                  onSaved(next);
                  setEditorId(null);
                }}
                onClose={() => setEditorId(null)}
              />
            ) : memo ? (
              <MemoEditor
                embedded
                key={memo.id}
                memo={memo}
                data={data}
                repository={repository}
                onSaved={onSaved}
                onClose={() => setEditorId(null)}
                onCopy={(id) => setEditorId(`memo:${id}`)}
              />
            ) : (
              <div className="canvas-narrative-editor">
                {renderNarrative(narrative?.ownerId ?? card.entityId, narrative, () => {
                  setEditorId((current) => (current === card.id ? null : current));
                  setSavedCard({
                    id: card.id,
                    message:
                      data.namespace === 'demo'
                        ? '이 기기에 저장했습니다.'
                        : '서버에 저장했습니다.',
                  });
                })}
                <Button variant="quiet" onClick={() => setEditorId(null)}>
                  편집 접기
                </Button>
              </div>
            );
        return {
          id: card.id,
          type: 'study',
          measured: previousNode?.measured,
          position: previousNode?.dragging ? previousNode.position : card.position,
          style: { width: editor ? 520 : (tools.value.nodeWidths[card.id] ?? 300) },
          dragHandle: '.canvas-drag-handle',
          selected: previousNode?.selected ?? card.id === selectedId,
          data: {
            card,
            toolbarVisible: selectedId === card.id,
            body:
              card.kind === 'concept' && memo
                ? conceptText(memo.body).description
                : (memo?.body ?? narrative?.body),
            memo,
            editor,
            saveMessage: savedCard?.id === card.id ? savedCard.message : undefined,
            open: () => {
              setSavedCard(null);
              setSelectedId(card.id);
              setEditorId(card.id);
            },
            close: () => setEditorId(null),
            resize:
              serverReady && !boot.blocked
                ? (width) =>
                    tools.store({
                      ...tools.value,
                      nodeWidths: {
                        ...tools.value.nodeWidths,
                        [card.id]: Math.max(240, Math.min(1000, width)),
                      },
                    })
                : undefined,
          },
        };
      }),
    );
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: Refresh card content for these projection and editing changes; callbacks read the latest props through an Effect Event.
  useEffect(() => {
    synchronizeCards();
  }, [projection, editorId, selectedId, savedCard, tools.value.nodeWidths]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (flow.current && course !== 'all')
        void flow.current.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 });
    });
    return () => cancelAnimationFrame(frame);
  }, [course]);
  useEffect(() => {
    if (!focusConcept || !nodes.some((node) => node.id === focusConcept)) return;
    const frame = requestAnimationFrame(() => {
      void flow.current?.fitView({
        nodes: [{ id: focusConcept }],
        padding: 0.3,
        minZoom: 0.25,
        maxZoom: 1,
      });
      setFocusConcept(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [nodes, focusConcept]);
  const selectCards = (ids: string[]) => {
    setSelectedIds(ids);
    setSelectedId(ids.length === 1 ? ids[0] : null);
    setNodes((previous) => previous.map((node) => ({ ...node, selected: ids.includes(node.id) })));
  };
  const handleSelection = useCallback(({ nodes: selection }: { nodes: CardNode[] }) => {
    const ids = selection.map((node) => node.id);
    setSelectedIds((previous) =>
      JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids,
    );
    setSelectedId((previous) =>
      previous && ids.includes(previous) ? previous : ids.length === 1 ? ids[0] : null,
    );
  }, []);
  const edges: Edge[] = projection.links.map((link) => ({
    ...link,
    type: flowEdgeType(tools.value.edgeStyle),
    reconnectable: !link.id.startsWith('auto:') && serverReady && !boot.blocked,
    deletable: false,
    label: link.label,
    selected: link.id === selectedEdge,
    markerEnd: link.id.startsWith('auto:') ? undefined : { type: MarkerType.ArrowClosed },
    className: link.id.startsWith('auto:') ? 'canvas-auto-edge' : 'canvas-user-edge',
  }));
  const move = (x: number, y: number) => {
    const card = projection.cards.find((row) => row.id === selectedId);
    if (!card) return;
    save({
      ...current.current,
      positions: {
        ...current.current.positions,
        [card.id]: { x: card.position.x + x, y: card.position.y + y },
      },
    });
  };
  const cardIds = new Set(projection.cards.map((card) => card.id));
  const validConnection = (source: string | null, target: string | null, replacing?: string) =>
    validFlowConnection(source, target, cardIds, current.current.links, replacing);
  const arrange = (axis?: 'x' | 'y') => {
    const boxes = nodes
      .filter((node) => !axis || selectedIds.includes(node.id))
      .map((node) => ({
        id: node.id,
        position: node.position,
        width: node.measured?.width,
        height: node.measured?.height,
      }));
    const positions = axis ? alignFlowBoxes(boxes, axis) : layoutFlowBoxes(boxes, projection.links);
    save({ ...current.current, positions: { ...current.current.positions, ...positions } });
  };
  const travel = (direction: 'undo' | 'redo') => {
    const next = history.current[direction](current.current);
    if (next) save(next, false);
  };
  const custom = content.links.find((link) => link.id === selectedEdge);
  const cardName = (id: string) =>
    projection.cards.find((card) => card.id === id)?.name ?? '화면 밖의 카드';
  const changeConnection = (next: ConnectionDraft) => {
    setConnection(next);
    if (connectionBoot.error) return;
    try {
      writeConnectionDraft(data, next);
      setConnectionError('');
    } catch (e) {
      setConnectionError(e instanceof Error ? e.message : '연결 설명을 보관하지 못했습니다.');
    }
  };
  const addConnection = () => {
    if (composing || connectionBoot.error || !connection.label.trim()) return;
    if (!validConnection(connection.source, connection.target)) {
      setConnectionError(
        '서로 다른 두 카드를 선택해 주세요. 같은 방향의 연결은 기존 관계에서 수정할 수 있습니다.',
      );
      return;
    }
    const previous = current.current.links.find(
      (link) =>
        link.source === connection.source &&
        link.target === connection.target &&
        link.label === connection.label,
    );
    const link = previous ?? { id: crypto.randomUUID(), ...connection };
    if (
      save({
        ...current.current,
        links: previous ? current.current.links : [...current.current.links, link],
      })
    ) {
      setSelectedEdge(link.id);
      setSelectedId(null);
      setConnectionOpen(false);
      try {
        clearConnectionDraft(data);
        setConnection({ source: '', target: '', label: '' });
      } catch {
        setConnectionError('연결은 저장했습니다. 작성 중이던 연결 설명도 남아 있습니다.');
      }
    }
  };
  const changeLabel = (label: string) => {
    if (!custom || boot.blocked || !serverReady) return;
    labelBefore.current ??= structuredClone(current.current);
    const next = {
      ...current.current,
      links: current.current.links.map((link) =>
        link.id === custom.id ? { ...link, label } : link,
      ),
    };
    setContent(next);
    current.current = next;
    try {
      writeCanvasDraft(data, { baseVersion: version.current, content: next });
    } catch (e) {
      setError(e instanceof Error ? e.message : '연결 설명 초안을 보관하지 못했습니다.');
    }
  };
  const keyboardHistory = (event: React.KeyboardEvent<HTMLElement>) => {
    if (
      !(event.ctrlKey || event.metaKey) ||
      composing ||
      editorId ||
      boot.blocked ||
      !serverReady ||
      (event.target instanceof HTMLElement &&
        event.target.closest('input,textarea,select,[contenteditable=true]'))
    )
      return;
    const redo =
      event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey);
    const undo = event.key.toLowerCase() === 'z' && !event.shiftKey;
    if ((redo && history.current.canRedo) || (undo && history.current.canUndo)) {
      event.preventDefault();
      travel(redo ? 'redo' : 'undo');
    }
  };
  const selectedCard = projection.cards.find((card) => card.id === selectedId);
  return (
    <section className="study-canvas" aria-label="목차와 설명 Canvas" onKeyDown={keyboardHistory}>
      <div className="canvas-toolbar">
        <Select
          label="Canvas 과목"
          value={course}
          onChange={(event) => {
            setCourse(event.target.value);
            setEditorId(null);
            setSelectedId(null);
            setSelectedIds([]);
          }}
        >
          <option value="all">현재 범위의 모든 과목</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </Select>
        <Button
          onClick={() =>
            flow.current?.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 }).then(saveViewport)
          }
        >
          전체 보기
        </Button>
        <Button
          aria-expanded={conceptOpen}
          disabled={
            boot.blocked ||
            (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo'))
          }
          onClick={() => setConceptOpen(!conceptOpen)}
        >
          개념 카드 추가
        </Button>
        <Button
          disabled={!serverReady || boot.blocked || projection.cards.length < 2}
          aria-expanded={connectionOpen}
          onClick={() => {
            setConnectionOpen(!connectionOpen);
            if (!connection.source && selectedId)
              changeConnection({ ...connection, source: selectedId });
          }}
        >
          개념 연결
        </Button>
        <Button
          disabled={!serverReady || boot.blocked || Boolean(editorId)}
          onClick={() => arrange()}
        >
          목차 배치
        </Button>
        <Button
          disabled={!serverReady || boot.blocked || !history.current.canUndo}
          onClick={() => travel('undo')}
        >
          배치 되돌리기
        </Button>
        <Button
          disabled={!serverReady || boot.blocked || !history.current.canRedo}
          onClick={() => travel('redo')}
        >
          배치 다시 실행
        </Button>
        <Button aria-expanded={transferOpen} onClick={() => setTransferOpen(!transferOpen)}>
          배치 내보내기·가져오기
        </Button>
        <a href="#/recall">주제 카드로 설명하기 ↗</a>
      </div>
      {tools.error && (
        <div role="alert">
          <p>{tools.error}</p>
          <Button onClick={() => tools.store(tools.value)}>보기 도구 저장 다시 시도</Button>
          <Button onClick={tools.reset}>보기 도구 초기화</Button>
        </div>
      )}
      {transferOpen && (
        <CanvasTransfer
          data={data}
          content={{
            ...current.current,
            viewport: flow.current?.getViewport() ?? current.current.viewport,
            positions: { ...displayedPositions.current, ...current.current.positions },
          }}
          cards={projectCanvas(data).cards}
          disabled={!serverReady || boot.blocked}
          onImport={(next) => {
            if (!save(next)) return false;
            if (next.viewport) void flow.current?.setViewport(next.viewport);
            return true;
          }}
        />
      )}
      {!serverReady && (
        <p role="alert">
          카드 배치와 연결을 저장할 수 없습니다. 다시 접속해 주세요. 저장된 목차와 설명은 계속
          확인하고, 설명은 카드 안에서 편집할 수 있습니다.
        </p>
      )}
      {error && (
        <div role="alert">
          <p>{error}</p>
          {!boot.blocked ? (
            <Button disabled={!serverReady} onClick={() => save(current.current)}>
              저장 다시 시도
            </Button>
          ) : (
            <Button
              onClick={() => {
                try {
                  preserveCanvasDraft(data);
                  setError(
                    '초안 원문 사본을 보관했습니다. 초안 보관본에서 확인할 수 있습니다. 저장된 배치는 유지했습니다.',
                  );
                } catch (e) {
                  setError(e instanceof Error ? e.message : '초안 사본을 보관하지 못했습니다.');
                }
              }}
            >
              초안 사본 보관
            </Button>
          )}
          <a href="#/draft-archives">초안 보관본</a>
        </div>
      )}
      {conceptOpen && (
        <CanvasConceptEditor
          data={data}
          repository={repository}
          ownerId={course === 'all' ? null : course}
          onSaved={(next, memoId) => {
            onSaved(next);
            setConceptOpen(false);
            setSelectedId(`memo:${memoId}`);
            setFocusConcept(`memo:${memoId}`);
            const owner = next.memos?.find((memo) => memo.id === memoId)?.ownerId;
            if (course !== 'all' && owner !== course) setCourse('all');
          }}
          onClose={() => setConceptOpen(false)}
        />
      )}
      {connectionOpen && (
        <form
          className="canvas-concept-form"
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onSubmit={(event) => {
            event.preventDefault();
            addConnection();
          }}
        >
          <h2>두 개념이 어떻게 이어지나요?</h2>
          <div className="canvas-concept-fields">
            <Select
              label="시작 개념"
              value={connection.source}
              disabled={Boolean(connectionBoot.error)}
              onChange={(event) => changeConnection({ ...connection, source: event.target.value })}
            >
              <option value="">카드 선택</option>
              {projection.cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {kinds[card.kind]} · {card.name}
                </option>
              ))}
            </Select>
            <Select
              label="이어지는 개념"
              value={connection.target}
              disabled={Boolean(connectionBoot.error)}
              onChange={(event) => changeConnection({ ...connection, target: event.target.value })}
            >
              <option value="">카드 선택</option>
              {projection.cards
                .filter((card) => card.id !== connection.source)
                .map((card) => (
                  <option key={card.id} value={card.id}>
                    {kinds[card.kind]} · {card.name}
                  </option>
                ))}
            </Select>
            <Input
              label="관계 설명"
              value={connection.label}
              maxLength={300}
              disabled={Boolean(connectionBoot.error)}
              placeholder="예: 이 조건에서 적용된다"
              onChange={(event) => changeConnection({ ...connection, label: event.target.value })}
            />
          </div>
          {connection.source &&
            connection.target &&
            !validConnection(connection.source, connection.target) && (
              <p role="alert">
                같은 방향의 연결이 이미 있습니다. 아래의 ‘내가 연결한 개념’에서 수정할 수 있습니다.
              </p>
            )}
          {connection.source && connection.target && (
            <p className="canvas-proposition">
              {cardName(connection.source)} → {connection.label || '관계 설명'} →{' '}
              {cardName(connection.target)}
            </p>
          )}
          {connectionError && <p role="alert">{connectionError}</p>}
          <div className="actions">
            <Button
              variant="primary"
              type="submit"
              disabled={
                !serverReady ||
                boot.blocked ||
                Boolean(connectionBoot.error) ||
                composing ||
                !connection.label.trim() ||
                !connection.source ||
                !connection.target ||
                !validConnection(connection.source, connection.target)
              }
            >
              연결하기
            </Button>
            <Button onClick={() => setConnectionOpen(false)}>접기</Button>
          </div>
        </form>
      )}
      {custom && (
        <form
          className="canvas-link-editor"
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onSubmit={(event) => {
            event.preventDefault();
            if (!composing) save(current.current);
          }}
        >
          <span>
            {cardName(custom.source)} → {cardName(custom.target)}
          </span>
          {(['source', 'target'] as const).map((end) => (
            <Select
              key={end}
              label={end === 'source' ? '연결 시작 카드 변경' : '연결 도착 카드 변경'}
              value={custom[end]}
              disabled={!serverReady || boot.blocked}
              onChange={(event) => {
                const next = { ...custom, [end]: event.target.value };
                if (validConnection(next.source, next.target, custom.id))
                  save({
                    ...current.current,
                    links: current.current.links.map((link) =>
                      link.id === custom.id ? next : link,
                    ),
                  });
                else
                  setError(
                    '같은 카드 또는 이미 연결한 방향으로 바꿀 수 없습니다. 기존 연결은 유지했습니다.',
                  );
              }}
            >
              {projection.cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </Select>
          ))}
          <Input
            label="연결선의 관계 설명"
            value={custom.label}
            maxLength={300}
            disabled={!serverReady || boot.blocked}
            onChange={(event) => changeLabel(event.target.value)}
          />
          <Button disabled={!serverReady || boot.blocked || composing} type="submit">
            관계 설명 저장
          </Button>
          <Button
            disabled={!serverReady || boot.blocked}
            type="button"
            onClick={() => {
              if (
                save({
                  ...current.current,
                  links: current.current.links.filter((link) => link.id !== custom.id),
                })
              )
                setSelectedEdge(null);
            }}
          >
            이 연결 지우기
          </Button>
          <Button type="button" onClick={() => setSelectedEdge(null)}>
            접기
          </Button>
        </form>
      )}
      {!projection.cards.length ? (
        <EmptyState
          title="목차를 넣으면 Canvas에 나타납니다"
          message="등록한 과목·단원·주제와 저장한 설명을 같은 ID로 연결합니다."
        >
          <a href="#/subjects">과목과 목차 입력</a>
        </EmptyState>
      ) : (
        <div className="canvas-stage">
          <ReactFlow<CardNode, Edge>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onInit={(instance) => {
              flow.current = instance;
            }}
            onNodesChange={(changes) => {
              setNodes((previous) => applyNodeChanges(changes, previous));
              const moved = changes.filter(
                (change) => change.type === 'position' && change.position && !change.dragging,
              );
              if (moved.length) {
                const positions = { ...current.current.positions };
                let changed = false;
                for (const change of moved)
                  if (
                    change.type === 'position' &&
                    change.position &&
                    JSON.stringify(positions[change.id]) !== JSON.stringify(change.position)
                  ) {
                    positions[change.id] = change.position;
                    changed = true;
                  }
                if (changed) save({ ...current.current, positions });
              }
            }}
            onNodeClick={(_, card) => {
              setSelectedId(card.id);
              setSelectedEdge(null);
            }}
            onNodeContextMenu={(event, card) => {
              event.preventDefault();
              setSelectedId(card.id);
              setSelectedIds([card.id]);
              setSelectedEdge(null);
            }}
            onSelectionChange={handleSelection}
            onEdgeClick={(_, edge) => {
              setSelectedEdge(edge.id);
              setSelectedId(null);
            }}
            onMoveEnd={(event, viewport) => {
              if (event && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport))
                save({ ...current.current, viewport });
            }}
            isValidConnection={(connection) =>
              validConnection(
                connection.source,
                connection.target,
                'id' in connection ? connection.id : undefined,
              )
            }
            onConnect={(next) => {
              if (validConnection(next.source, next.target)) {
                changeConnection({ ...connection, source: next.source, target: next.target });
                setConnectionOpen(true);
              }
            }}
            onReconnect={(edge, next) => {
              if (
                !edge.id.startsWith('auto:') &&
                validConnection(next.source, next.target, edge.id)
              )
                save({
                  ...current.current,
                  links: current.current.links.map((link) =>
                    link.id === edge.id
                      ? { ...link, source: next.source, target: next.target }
                      : link,
                  ),
                });
            }}
            selectionOnDrag={tools.value.mode === 'select'}
            selectionMode={SelectionMode.Partial}
            panOnDrag={tools.value.mode === 'move' ? true : [1, 2]}
            snapToGrid={tools.value.snap}
            snapGrid={flowSnapGrid}
            deleteKeyCode={null}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={content.viewport}
            fitView={!content.viewport}
            fitViewOptions={{ maxZoom: 0.8, minZoom: 0.25 }}
            nodesDraggable={serverReady && !boot.blocked}
            nodesConnectable={serverReady && !boot.blocked}
            panOnScroll
            zoomOnDoubleClick={false}
            ariaLabelConfig={flowAriaLabels}
          >
            <FlowExperience
              tools={tools}
              count={nodes.length}
              selectedIds={selectedIds}
              name="Canvas"
              onViewportCommit={saveViewport}
            />
            <FlowControls
              aria-label="Canvas 보기 조절"
              showInteractive={serverReady && !boot.blocked}
              onZoomIn={saveControlViewport}
              onZoomOut={saveControlViewport}
              onFitView={saveControlViewport}
            />
          </ReactFlow>
        </div>
      )}
      {/* biome-ignore lint/a11y/useSemanticElements: This names a non-form control/content group; fieldset would imply a form group. */}
      <div className="canvas-position-tools" role="group" aria-label="카드 선택과 조작">
        <Select
          label="조작할 카드"
          value={selectedId ?? ''}
          onChange={(event) => {
            selectCards(event.target.value ? [event.target.value] : []);
            setSelectedEdge(null);
          }}
        >
          <option value="">카드 선택</option>
          {projection.cards.map((card) => (
            <option key={card.id} value={card.id}>
              {kinds[card.kind]} · {card.name}
            </option>
          ))}
        </Select>
        <Button
          onClick={() => {
            selectCards(projection.cards.map((card) => card.id));
          }}
        >
          모든 카드 선택
        </Button>
        <Button
          disabled={!selectedIds.length && !selectedId}
          onClick={() => {
            selectCards([]);
            setSelectedEdge(null);
          }}
        >
          선택 해제
        </Button>
        {selectedIds.length > 1 && (
          <div className="flow-selection-actions">
            <span>{selectedIds.length}개 카드 선택</span>
            <Button
              disabled={!serverReady || boot.blocked || Boolean(editorId)}
              onClick={() => arrange('x')}
            >
              왼쪽 맞춤
            </Button>
            <Button
              disabled={!serverReady || boot.blocked || Boolean(editorId)}
              onClick={() => arrange('y')}
            >
              위쪽 맞춤
            </Button>
          </div>
        )}
        {selectedCard && (
          <>
            <Input
              label="선택한 카드 너비"
              type="number"
              min={240}
              max={1000}
              value={tools.value.nodeWidths[selectedCard.id] ?? 300}
              onChange={(event) => {
                const width = Number(event.target.value);
                if (Number.isFinite(width) && width >= 240 && width <= 1000)
                  tools.store({
                    ...tools.value,
                    nodeWidths: { ...tools.value.nodeWidths, [selectedCard.id]: width },
                  });
              }}
            />
            <Button
              onClick={() => {
                setEditorId(selectedCard.id);
                setFocusConcept(selectedCard.id);
              }}
            >
              선택한 카드 편집
            </Button>
            {!['memo', 'narrative', 'concept'].includes(selectedCard.kind) && (
              <a
                href={`#/${selectedCard.kind === 'subject' ? 'subject' : 'node'}/${encodeURIComponent(selectedCard.entityId)}`}
              >
                선택한 카드 열기 ↗
              </a>
            )}
            {[
              ['←', -40, 0, '왼쪽으로'],
              ['↑', 0, -40, '위로'],
              ['↓', 0, 40, '아래로'],
              ['→', 40, 0, '오른쪽으로'],
            ].map(([symbol, x, y, name]) => (
              <Button
                key={symbol}
                aria-label={`카드 ${name} 이동`}
                disabled={!serverReady || boot.blocked}
                onClick={() => move(Number(x), Number(y))}
              >
                {symbol}
              </Button>
            ))}
          </>
        )}
      </div>
      {projection.cards.some((card) => card.kind === 'concept') && (
        <details className="canvas-concept-list">
          <summary>
            내 개념 카드 {projection.cards.filter((card) => card.kind === 'concept').length}개
          </summary>
          {projection.cards
            .filter((card) => card.kind === 'concept')
            .map((card) => (
              <Button
                variant="quiet"
                key={card.id}
                onClick={() => {
                  setSelectedId(card.id);
                  setEditorId(card.id);
                  setSelectedEdge(null);
                  setFocusConcept(card.id);
                }}
                aria-label={`개념 카드 편집: ${card.name}`}
              >
                {card.name}
              </Button>
            ))}
        </details>
      )}
      {projection.links.some((link) => !link.id.startsWith('auto:')) && (
        <details className="canvas-concept-list">
          <summary>내가 연결한 개념</summary>
          {projection.links
            .filter((link) => !link.id.startsWith('auto:'))
            .map((link) => (
              <Button
                variant="quiet"
                key={link.id}
                onClick={() => {
                  setSelectedEdge(link.id);
                  setSelectedId(null);
                }}
                aria-label={`관계 수정: ${cardName(link.source)} → ${link.label} → ${cardName(link.target)}`}
              >
                {cardName(link.source)} → {link.label} → {cardName(link.target)}
              </Button>
            ))}
        </details>
      )}
      <details className="canvas-help">
        <summary>Canvas 사용 안내</summary>
        <p>
          카드 제목을 잡아 옮기고 빈 공간을 밀어 이동하세요. 카드 안에서 글과 그림을 편집할 수
          있습니다. ‘목차’는 소속, ‘내 설명’은 저장한 메모의 연결입니다. 카드 양옆 점을 이어 만든
          연결은 이름을 붙일 수 있습니다. 설명 저장은 공부함·완료·정답으로 집계하지 않습니다.
        </p>
      </details>
    </section>
  );
}
