import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ReactFlow, Background, Controls, Handle, Position, MarkerType, applyNodeChanges, type Node, type NodeProps, type ReactFlowInstance, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, EmptyState, Select, Input } from './index';
import { MemoEditor } from './quick-memos';
import { MEMO_WIDTH, MEMO_HEIGHT, memoPath } from '../domain/memo';
import type { AppState, Narrative, QuickMemo } from '../domain/model';
import { CANVAS_ID, projectCanvas, type CanvasCard, type CanvasContent } from '../domain/canvas';
import { readCanvasDraft, writeCanvasDraft, clearCanvasDraft, preserveCanvasDraft, readConnectionDraft, writeConnectionDraft, clearConnectionDraft, type ConnectionDraft } from '../data/canvas-draft';
import type { StudyRepository } from '../data/repository';
import './study-canvas.css';

type CardData = { card: CanvasCard; body?: string; memo?: QuickMemo; editor?: ReactNode; open: () => void; close: () => void };
type CardNode = Node<CardData, 'study'>;
const kinds = { subject: '과목', unit: '단원', outline: '목차', topic: '주제', memo: '내 설명', narrative: '내 메모' };
function StudyCard({ data, selected }: NodeProps<CardNode>) {
  const { card } = data;
  return <article className={`canvas-card canvas-kind-${card.kind}${selected ? ' is-selected' : ''}${data.editor ? ' is-editing' : ''}`} aria-label={`${kinds[card.kind]} 카드 ${card.name}`}>
    <Handle type="target" position={Position.Left} />
    <header className="canvas-drag-handle">{card.kind !== 'memo' && card.kind !== 'narrative' && <span className="canvas-role">{kinds[card.kind]}</span>}<h2>{card.name}</h2></header>
    <div className="canvas-card-body nodrag nopan nowheel">
      {data.editor ?? <>
        {data.memo?.strokes.length ? <svg className="canvas-sketch" viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} role="img" aria-label="저장한 설명 그림">{data.memo.strokes.map(stroke => <path key={stroke.id} d={memoPath(stroke.points)} strokeWidth={stroke.width} fill="none" stroke={{ ink: 'var(--color-text)', blue: 'var(--color-hierarchy-outline)', green: 'var(--color-memo-green)' }[stroke.ink]} strokeLinecap="round" strokeLinejoin="round" />)}</svg> : null}
        {data.body && <p className="canvas-original">{data.body}</p>}
        <div className="canvas-card-actions"><Button variant="quiet" onClick={data.open}>{card.kind === 'memo' || card.kind === 'narrative' ? '카드 안에서 편집' : '메모 쓰기'}</Button>
        {card.kind !== 'memo' && card.kind !== 'narrative' && <a href={`#/${card.kind === 'subject' ? 'subject' : 'node'}/${encodeURIComponent(card.entityId)}`}>열기 ↗</a>}</div>
      </>}
    </div>
    <Handle type="source" position={Position.Right} />
  </article>;
}
const nodeTypes = { study: StudyCard };
export function StudyCanvas({ data, repository, onSaved, subjectIds, renderNarrative }: {
  data: AppState; repository: StudyRepository; onSaved: (next: AppState) => void; subjectIds: string[];
  renderNarrative: (ownerId: string, narrative?: Narrative) => ReactNode;
}) {
  const serverReady = data.namespace === 'demo' || repository.getCapabilities?.().includes('saveCanvasLayout') === true;
  const saved = data.canvasLayouts?.find(row => row.id === CANVAS_ID && !row.deletedAt);
  const [boot] = useState(() => {
    const fallback: CanvasContent = { positions: saved?.positions ?? {}, links: saved?.links ?? [], viewport: saved?.viewport };
    try {
      const draft = readCanvasDraft(data);
      if (draft && draft.baseVersion !== (saved?.version ?? 0)) {
        if (JSON.stringify(draft.content) === JSON.stringify(fallback)) { clearCanvasDraft(data); return { content: fallback, error: '', blocked: false }; }
        return { content: fallback, error: '배치 초안과 저장된 배치의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안 보관본에서 확인해 주세요.', blocked: true };
      }
      return { content: draft?.content ?? fallback, error: draft ? '이 기기의 배치 초안을 불러왔습니다. 저장 다시 시도를 눌러 기록에 반영해 주세요.' : '', blocked: false };
    } catch (e) { return { content: fallback, error: e instanceof Error ? e.message : 'Canvas 배치 초안을 읽지 못했습니다.', blocked: true }; }
  });
  const [content, setContent] = useState(boot.content), [error, setError] = useState(boot.error);
  const current = useRef(content); current.current = content;
  const version = useRef(saved?.version ?? 0);
  const [editorId, setEditorId] = useState<string | null>(null), [selectedId, setSelectedId] = useState<string | null>(null), [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [course, setCourse] = useState('all');
  const [connectionBoot] = useState(() => { try { return { draft: readConnectionDraft(data), error: '' }; } catch (e) { return { draft: { source: '', target: '', label: '' }, error: e instanceof Error ? e.message : '연결 초안을 읽지 못했습니다.' }; } });
  const [connection, setConnection] = useState<ConnectionDraft>(connectionBoot.draft);
  const [connectionOpen, setConnectionOpen] = useState(Boolean(connectionBoot.draft.label || connectionBoot.error));
  const [connectionError, setConnectionError] = useState(connectionBoot.error);
  const [composing, setComposing] = useState(false);
  const subjects = data.subjects.filter(s => !s.deletedAt && subjectIds.includes(s.id));
  const projection = useMemo(() => projectCanvas(data, course === 'all' ? subjectIds : subjectIds.filter(id => id === course), content), [data, course, subjectIds.join('|'), content]);
  const [nodes, setNodes] = useState<CardNode[]>([]);
  const flow = useRef<ReactFlowInstance<CardNode, Edge> | null>(null);
  const save = (nextContent: CanvasContent) => {
    if (boot.blocked || !serverReady) return false;
    const next = { ...nextContent, positions: { ...Object.fromEntries(projection.cards.map(card => [card.id, card.position])), ...nextContent.positions } };
    setContent(next); current.current = next;
    try {
      writeCanvasDraft(data, { baseVersion: version.current, content: next });
      const result = repository.execute({ type: 'saveCanvasLayout', id: CANVAS_ID, expectedVersion: version.current, ...next,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
      version.current = result.canvasLayouts!.find(row => row.id === CANVAS_ID)!.version;
      onSaved(result); setError('');
      try { clearCanvasDraft(data); } catch { setError('배치는 이 기기에 저장했습니다. 초안 정리가 남았습니다. 저장 다시 시도를 눌러 주세요.'); }
      return true;
    } catch (e) { setError(`${e instanceof Error ? e.message : '저장하지 못했습니다.'} 화면의 배치는 유지했습니다. 저장 다시 시도로 재시도할 수 있습니다.`); return false; }
  };
  useEffect(() => {
    setNodes(previous => projection.cards.map(card => {
      const memo = card.kind === 'memo' ? data.memos?.find(row => row.id === card.entityId) : undefined;
      const narrative = card.kind === 'narrative' ? data.narratives.find(row => row.id === card.entityId) : undefined;
      let editor: ReactNode;
      if (editorId === card.id) editor = memo ? <MemoEditor embedded key={memo.id} memo={memo} data={data} repository={repository} onSaved={onSaved} onClose={() => setEditorId(null)} onCopy={id => setEditorId(`memo:${id}`)} />
        : <div className="canvas-narrative-editor">{renderNarrative(narrative?.ownerId ?? card.entityId, narrative)}<Button variant="quiet" onClick={() => setEditorId(null)}>편집 접기</Button></div>;
      return { id: card.id, type: 'study', position: previous.find(row => row.id === card.id)?.dragging ? previous.find(row => row.id === card.id)!.position : card.position,
        dragHandle: '.canvas-drag-handle', selected: card.id === selectedId,
        data: { card, body: memo?.body ?? narrative?.body, memo, editor, open: () => { setSelectedId(card.id); setEditorId(card.id); }, close: () => setEditorId(null) } };
    }));
  }, [projection, editorId, selectedId]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => { if (flow.current && course !== 'all') void flow.current.fitView({ padding: .16, minZoom: .25, maxZoom: 1 }); });
    return () => cancelAnimationFrame(frame);
  }, [course]);
  const edges: Edge[] = projection.links.map(link => ({ ...link, type: 'smoothstep', deletable: false, label: link.label, selected: link.id === selectedEdge, markerEnd: link.id.startsWith('auto:') ? undefined : { type: MarkerType.ArrowClosed }, className: link.id.startsWith('auto:') ? 'canvas-auto-edge' : 'canvas-user-edge' }));
  const move = (x: number, y: number) => {
    const card = projection.cards.find(row => row.id === selectedId); if (!card) return;
    save({ ...current.current, positions: { ...current.current.positions, [card.id]: { x: card.position.x + x, y: card.position.y + y } } });
  };
  const undo = [...data.revisions].reverse().find(row => row.collection === 'canvasLayouts' && row.entityId === CANVAS_ID);
  const custom = content.links.find(link => link.id === selectedEdge);
  const cardName = (id: string) => projection.cards.find(card => card.id === id)?.name ?? '화면 밖의 카드';
  const changeConnection = (next: ConnectionDraft) => {
    setConnection(next);
    if (connectionBoot.error) return;
    try { writeConnectionDraft(data, next); setConnectionError(''); }
    catch (e) { setConnectionError(e instanceof Error ? e.message : '연결 설명을 보관하지 못했습니다.'); }
  };
  const addConnection = () => {
    if (composing || connectionBoot.error || !connection.label.trim() || connection.source === connection.target || !projection.cards.some(card => card.id === connection.source) || !projection.cards.some(card => card.id === connection.target)) return;
    const previous = current.current.links.find(link => link.source === connection.source && link.target === connection.target && link.label === connection.label);
    const link = previous ?? { id: crypto.randomUUID(), ...connection };
    if (save({ ...current.current, links: previous ? current.current.links : [...current.current.links, link] })) {
      setSelectedEdge(link.id); setSelectedId(null); setConnectionOpen(false);
      try { clearConnectionDraft(data); setConnection({ source: '', target: '', label: '' }); }
      catch { setConnectionError('연결은 저장했습니다. 작성 중이던 연결 설명도 남아 있습니다.'); }
    }
  };
  const changeLabel = (label: string) => {
    if (!custom || boot.blocked || !serverReady) return;
    const next = { ...current.current, links: current.current.links.map(link => link.id === custom.id ? { ...link, label } : link) };
    setContent(next); current.current = next;
    try { writeCanvasDraft(data, { baseVersion: version.current, content: next }); }
    catch (e) { setError(e instanceof Error ? e.message : '연결 설명 초안을 보관하지 못했습니다.'); }
  };
  return <section className="study-canvas" aria-label="목차와 설명 Canvas">
    <div className="canvas-toolbar"><Select label="Canvas 과목" value={course} onChange={event => { setCourse(event.target.value); setEditorId(null); setSelectedId(null); }}><option value="all">현재 범위의 모든 과목</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</Select>
      <Button onClick={() => flow.current?.fitView({ padding: .16, minZoom: .25, maxZoom: 1 })}>전체 보기</Button>
      <Button disabled={!serverReady || boot.blocked || projection.cards.length < 2} aria-expanded={connectionOpen} onClick={() => { setConnectionOpen(!connectionOpen); if (!connection.source && selectedId) changeConnection({ ...connection, source: selectedId }); }}>개념 연결</Button>
      <Button disabled={!serverReady || boot.blocked} onClick={() => { const arranged = projectCanvas(data, course === 'all' ? subjectIds : subjectIds.filter(id => id === course), { positions: {}, links: content.links }); save({ ...current.current, positions: { ...current.current.positions, ...Object.fromEntries(arranged.cards.map(card => [card.id, card.position])) } }); }}>목차 배치</Button>
      <Button disabled={!serverReady || boot.blocked || !undo} onClick={() => { if (undo?.before && 'positions' in undo.before) save({ positions: undo.before.positions, links: undo.before.links, viewport: undo.before.viewport }); else if (undo) { const original = projectCanvas(data, subjectIds, { positions: {}, links: [] }); save({ positions: Object.fromEntries(original.cards.map(card => [card.id, card.position])), links: [] }); } }}>배치 되돌리기</Button>
      <a href="#/recall">주제 카드로 설명하기 ↗</a></div>
    {!serverReady && <p role="alert">카드 배치와 연결을 저장할 수 없습니다. 다시 접속해 주세요. 저장된 목차와 설명은 계속 확인하고, 설명은 카드 안에서 편집할 수 있습니다.</p>}
    {error && <div role="alert"><p>{error}</p>{!boot.blocked ? <Button disabled={!serverReady} onClick={() => save(current.current)}>저장 다시 시도</Button> : <Button onClick={() => { try { preserveCanvasDraft(data); setError('초안 원문 사본을 보관했습니다. 초안 보관본에서 확인할 수 있습니다. 저장된 배치는 유지했습니다.'); } catch (e) { setError(e instanceof Error ? e.message : '초안 사본을 보관하지 못했습니다.'); } }}>초안 사본 보관</Button>}<a href="#/draft-archives">초안 보관본</a></div>}
    {connectionOpen && <form className="canvas-concept-form" onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onSubmit={event => { event.preventDefault(); addConnection(); }}>
      <h2>두 개념이 어떻게 이어지나요?</h2>
      <div className="canvas-concept-fields"><Select label="시작 개념" value={connection.source} disabled={Boolean(connectionBoot.error)} onChange={event => changeConnection({ ...connection, source: event.target.value })}><option value="">카드 선택</option>{projection.cards.map(card => <option key={card.id} value={card.id}>{kinds[card.kind]} · {card.name}</option>)}</Select>
        <Select label="이어지는 개념" value={connection.target} disabled={Boolean(connectionBoot.error)} onChange={event => changeConnection({ ...connection, target: event.target.value })}><option value="">카드 선택</option>{projection.cards.filter(card => card.id !== connection.source).map(card => <option key={card.id} value={card.id}>{kinds[card.kind]} · {card.name}</option>)}</Select>
        <Input label="관계 설명" value={connection.label} maxLength={300} disabled={Boolean(connectionBoot.error)} placeholder="예: 이 조건에서 적용된다" onChange={event => changeConnection({ ...connection, label: event.target.value })} />
      </div>
      {connection.source && connection.target && <p className="canvas-proposition">{cardName(connection.source)} → {connection.label || '관계 설명'} → {cardName(connection.target)}</p>}
      {connectionError && <p role="alert">{connectionError}</p>}
      <div className="actions"><Button variant="primary" type="submit" disabled={!serverReady || boot.blocked || Boolean(connectionBoot.error) || composing || !connection.label.trim() || !connection.source || !connection.target || connection.source === connection.target}>연결하기</Button><Button onClick={() => setConnectionOpen(false)}>접기</Button></div>
    </form>}
    {custom && <form className="canvas-link-editor" onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)} onSubmit={event => { event.preventDefault(); if (!composing) save(current.current); }}><span>{cardName(custom.source)} → {cardName(custom.target)}</span><Input label="연결선의 관계 설명" value={custom.label} maxLength={300} disabled={!serverReady || boot.blocked} onChange={event => changeLabel(event.target.value)} /><Button disabled={!serverReady || boot.blocked || composing} type="submit">관계 설명 저장</Button><Button disabled={!serverReady || boot.blocked} type="button" onClick={() => { if (save({ ...current.current, links: current.current.links.filter(link => link.id !== custom.id) })) setSelectedEdge(null); }}>이 연결 지우기</Button><Button type="button" onClick={() => setSelectedEdge(null)}>접기</Button></form>}
    {!projection.cards.length ? <EmptyState title="목차를 넣으면 Canvas에 나타납니다" message="등록한 과목·단원·주제와 저장한 설명을 같은 ID로 연결합니다."><a href="#/subjects">과목과 목차 입력</a></EmptyState> : <div className="canvas-stage">
      <ReactFlow<CardNode, Edge> nodes={nodes} edges={edges} nodeTypes={nodeTypes} onInit={instance => { flow.current = instance; }}
        onNodesChange={changes => { setNodes(previous => applyNodeChanges(changes, previous)); const moved = changes.filter(change => change.type === 'position' && change.position && !change.dragging); if (moved.length) { const positions = { ...current.current.positions }; let changed = false; for (const change of moved) if (change.type === 'position' && change.position && JSON.stringify(positions[change.id]) !== JSON.stringify(change.position)) { positions[change.id] = change.position; changed = true; } if (changed) save({ ...current.current, positions }); } }}
        onNodeClick={(_, card) => { setSelectedId(card.id); setSelectedEdge(null); }} onEdgeClick={(_, edge) => { setSelectedEdge(edge.id); setSelectedId(null); }}
        onMoveEnd={(event, viewport) => { if (event && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport)) save({ ...current.current, viewport }); }}
        onConnect={connection => { if (connection.source && connection.target) { const link = { id: crypto.randomUUID(), source: connection.source, target: connection.target, label: '관계 쓰기' }; if (save({ ...current.current, links: [...current.current.links, link] })) { setSelectedEdge(link.id); setSelectedId(null); } } }}
        deleteKeyCode={null} minZoom={.1} maxZoom={2} defaultViewport={content.viewport} fitView={!content.viewport} fitViewOptions={{ maxZoom: .8, minZoom: .25 }}
        nodesDraggable={serverReady && !boot.blocked} nodesConnectable={serverReady && !boot.blocked} panOnScroll zoomOnDoubleClick={false} ariaLabelConfig={{ 'controls.ariaLabel': 'Canvas 보기 조절', 'controls.zoomIn.ariaLabel': '확대', 'controls.zoomOut.ariaLabel': '축소', 'controls.fitView.ariaLabel': '전체 보기', 'controls.interactive.ariaLabel': '카드 이동 잠금' }}>
        <Background gap={24} color="var(--color-border)" /><Controls showInteractive={serverReady && !boot.blocked} />
      </ReactFlow>
    </div>}
    {selectedId && <div className="canvas-position-tools" aria-label="선택 카드 위치"><span>{projection.cards.find(card => card.id === selectedId)?.name}</span>{[['←', -40, 0, '왼쪽으로'], ['↑', 0, -40, '위로'], ['↓', 0, 40, '아래로'], ['→', 40, 0, '오른쪽으로']].map(([symbol, x, y, name]) => <Button key={symbol} aria-label={`카드 ${name} 이동`} disabled={!serverReady || boot.blocked} onClick={() => move(Number(x), Number(y))}>{symbol}</Button>)}</div>}
    {projection.links.some(link => !link.id.startsWith('auto:')) && <details className="canvas-concept-list"><summary>내가 연결한 개념</summary>{projection.links.filter(link => !link.id.startsWith('auto:')).map(link => <Button variant="quiet" key={link.id} onClick={() => { setSelectedEdge(link.id); setSelectedId(null); }} aria-label={`관계 수정: ${cardName(link.source)} → ${link.label} → ${cardName(link.target)}`}>{cardName(link.source)} → {link.label} → {cardName(link.target)}</Button>)}</details>}
    <details className="canvas-help"><summary>Canvas 사용 안내</summary><p>카드 제목을 잡아 옮기고 빈 공간을 밀어 이동하세요. 카드 안에서 글과 그림을 편집할 수 있습니다. ‘목차’는 소속, ‘내 설명’은 저장한 메모의 연결입니다. 카드 양옆 점을 이어 만든 연결은 이름을 붙일 수 있습니다. 설명 저장은 공부함·완료·정답으로 집계하지 않습니다.</p></details>
  </section>;
}
