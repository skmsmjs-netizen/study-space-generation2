import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button, Checkbox, EmptyState, ErrorState, Modal, Select, Textarea } from './index';
import type { AppState, Command, MemoInk, MemoPoint, MemoStroke, QuickMemo } from '../domain/model';
import { MEMO_WIDTH, MEMO_HEIGHT, memoPath } from '../domain/memo';
import { DemoRepository } from '../data/demo-repository';
import { memoDraftKey, readMemoDraft, sameMemo, writeMemoDraft, type MemoDraft } from '../data/memo-draft';
import { archiveDamagedDraft, clearStoredDraft } from '../data/draft-safety';
import { navigate } from './navigation-context';
import './quick-memos.css';

type Content = Pick<QuickMemo, 'body' | 'ownerId' | 'strokes'>;
type Props = { data: AppState; repository: DemoRepository; onSaved: (next: AppState) => void; ownerId?: string; memoId?: string; compact?: boolean; trash?: boolean };
const inks: Record<MemoInk, { label: string; color: string }> = {
  ink: { label: '기본색', color: 'var(--color-text)' },
  blue: { label: '파랑', color: 'var(--color-hierarchy-outline)' },
  green: { label: '초록', color: 'var(--color-primary)' },
};
const errorMessage = (error: unknown) => error instanceof Error ? error.message : '저장하지 못했습니다. 입력은 이 창에 남아 있습니다.';
function ownerName(data: AppState, ownerId: string | null) {
  return data.nodes.find(row => row.id === ownerId)?.name ?? data.subjects.find(row => row.id === ownerId)?.name ?? '자유 메모';
}
function Drawing({ strokes }: { strokes: MemoStroke[] }) {
  return <>{strokes.map(stroke => <path key={stroke.id} d={memoPath(stroke.points)} stroke={inks[stroke.ink].color} strokeWidth={stroke.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}</>;
}

export function QuickMemos({ data, repository, onSaved, ownerId, memoId, compact = false, trash = false }: Props) {
  const [editing, setEditing] = useState<string | null>(memoId ?? null);
  const [error, setError] = useState('');
  const [trashId, setTrashId] = useState<string | null>(null);
  const [restored, setRestored] = useState<string | null>(null);
  const all = (data.memos ?? []).filter(memo => Boolean(memo.deletedAt) === trash && (ownerId === undefined || memo.ownerId === ownerId))
    .slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
  const selected = (data.memos ?? []).find(memo => memo.id === editing && !memo.deletedAt);
  useEffect(() => { setEditing(memoId ?? null); }, [memoId]);
  const execute = (action: Omit<Extract<Command, { type: 'saveMemo' }>, 'opId' | 'at' | 'userId' | 'namespace'> | { type: 'trashMemo' | 'restoreMemo'; id: string; expectedVersion: number }) => {
    try {
      const next = repository.execute({ ...action, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
      onSaved(next); setError(''); return next;
    } catch (e) { setError(errorMessage(e)); return null; }
  };
  const add = () => {
    const id = crypto.randomUUID();
    if (execute({ type: 'saveMemo', id, ownerId: ownerId ?? null, body: '', strokes: [], expectedVersion: 0 })) setEditing(id);
  };
  const close = () => { setEditing(null); if (memoId) navigate('/memos'); };
  const moveToTrash = (memo: QuickMemo) => {
    if (execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version })) { setTrashId(null); setRestored(memo.id); }
  };
  const restore = (memo: QuickMemo) => {
    if (execute({ type: 'restoreMemo', id: memo.id, expectedVersion: memo.version })) setRestored(null);
  };
  const undoTrash = (data.memos ?? []).find(row => row.id === restored && row.deletedAt);
  return <section className="quick-memos section-space" aria-label={trash ? '휴지통의 메모' : '메모 카드'}>
    <div className="section-heading"><div><h2>{trash ? '메모' : '작은 메모'}</h2>{!trash && <p className="muted">결론 한 줄이나 떠오른 그림을 남겨 보세요.</p>}</div>
      {!trash && <div className="actions">{compact && <a href="#/memos">모두 보기</a>}<Button onClick={add}>메모 추가</Button></div>}
    </div>
    {error && <ErrorState message={error} />}
    {undoTrash && <div className="feedback-banner"><span role="status">메모를 휴지통으로 옮겼습니다.</span><Button onClick={() => restore(undoTrash)}>메모 복원</Button></div>}
    <div className="memo-grid">{(compact ? all.slice(0, 3) : all).map((memo, index) => <article className="memo-card" key={memo.id}>
      <button className="memo-paper-preview" aria-label={`메모 ${index + 1} 열기${memo.body ? `: ${memo.body.slice(0, 35)}` : memo.strokes.length ? ': 스케치' : ': 빈 메모'}`} onClick={() => setEditing(memo.id)} disabled={trash}>
        <svg viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} aria-hidden="true"><Drawing strokes={memo.strokes} /></svg>
        {memo.body && <span className="memo-preview-text">{memo.body}</span>}
        {!memo.body && !memo.strokes.length && <span className="memo-placeholder">여기에 생각을 남겨 보세요.</span>}
      </button>
      <div className="memo-card-footer"><span>{ownerName(data, memo.ownerId)}</span>{trash ? <Button variant="quiet" onClick={() => restore(memo)}>복원</Button> : <Button variant="quiet" aria-label={`메모 ${index + 1} 휴지통으로 이동`} onClick={() => setTrashId(memo.id)}>휴지통</Button>}</div>
    </article>)}</div>
    {!all.length && !compact && <EmptyState title={trash ? '휴지통에 메모가 없습니다' : '첫 메모를 남겨 보세요'} message={trash ? undefined : '제목 없이 짧은 글이나 그림부터 시작할 수 있습니다.'} />}
    {selected && <MemoEditor key={selected.id} memo={selected} data={data} repository={repository} onSaved={onSaved} onClose={close} onCopy={id => setEditing(id)} />}
    {memoId && !selected && <EmptyState title="이 메모를 찾을 수 없습니다" message="휴지통에 있는지 확인해 주세요."><a href="#/memos">메모 목록으로</a></EmptyState>}
    <Modal open={Boolean(trashId)} title="메모를 휴지통으로 옮길까요?" onClose={() => setTrashId(null)}><p>글과 그림, 수정 이력은 남아 있습니다. 휴지통에서 복원할 수 있습니다.</p><Button variant="danger" onClick={() => { const memo = all.find(row => row.id === trashId); if (memo) moveToTrash(memo); }}>휴지통으로 이동</Button></Modal>
  </section>;
}

function MemoEditor({ memo, data, repository, onSaved, onClose, onCopy }: { memo: QuickMemo; data: AppState; repository: DemoRepository; onSaved: Props['onSaved']; onClose: () => void; onCopy: (id: string) => void }) {
  const key = memoDraftKey(data, memo.id);
  const [initial] = useState(() => {
    try {
      const draft = readMemoDraft(key, memo.id);
      if (draft && !sameMemo(draft, memo) && draft.baseVersion !== memo.version) return { content: memo as Content, conflict: draft, blocked: true, error: '저장된 메모와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다.' };
      return { content: (draft ?? memo) as Content, conflict: null, blocked: false, error: '' };
    } catch { return { content: memo as Content, conflict: null, blocked: true, error: '초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 초안 보관본에서 확인할 수 있습니다.' }; }
  });
  const [content, setContent] = useState<Content>(initial.content);
  const [isBlocked, setBlocked] = useState(initial.blocked);
  const contentRef = useRef(content), savedRef = useRef<Content>(memo), version = useRef(memo.version);
  const callback = useRef(onSaved); callback.current = onSaved;
  const [error, setError] = useState(initial.error), [status, setStatus] = useState(sameMemo(initial.content, memo) ? '이 기기에 저장됨' : '저장 중…');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [ink, setInk] = useState<MemoInk>('ink'), [finger, setFinger] = useState(false);
  const [past, setPast] = useState<MemoStroke[][]>([]), [future, setFuture] = useState<MemoStroke[][]>([]);
  const svg = useRef<SVGSVGElement>(null), livePath = useRef<SVGPathElement>(null);
  const active = useRef<{ pointerId: number; stroke: MemoStroke } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocked = useRef(initial.blocked);
  const copyOperation = useRef<{ id: string; opId: string; at: string } | null>(null);
  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (blocked.current) return false;
    const current = contentRef.current;
    if (sameMemo(current, savedRef.current)) return true;
    try {
      const next = repository.execute({ type: 'saveMemo', id: memo.id, ...current, expectedVersion: version.current,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
      const stored = next.memos!.find(row => row.id === memo.id)!;
      version.current = stored.version; savedRef.current = current; callback.current(next);
      setStatus('이 기기에 저장됨'); setError('');
      try { clearStoredDraft(key); } catch { setError('메모는 저장했습니다. 초안 정리가 남아 있습니다.'); }
      return true;
    } catch (e) { setError(`${errorMessage(e)} 글과 그림은 초안에 남겨 두었습니다.`); setStatus('저장 다시 필요'); return false; }
  };
  const update = (next: Content) => {
    contentRef.current = next; setContent(next); setStatus('저장 중…');
    try { writeMemoDraft(key, { id: memo.id, baseVersion: version.current, ...next }); setError(''); }
    catch { setError('초안을 이 기기에 저장하지 못했습니다. 현재 창의 입력은 유지했습니다. 창을 닫기 전에 저장을 다시 시도해 주세요.'); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 600);
  };
  const changeStrokes = (strokes: MemoStroke[]) => {
    setPast(history => [...history, contentRef.current.strokes]); setFuture([]);
    update({ ...contentRef.current, strokes });
  };
  const finish = () => {
    const drawing = active.current;
    if (!drawing) return;
    active.current = null;
    // Commit even a cancelled/partly drawn stroke; input cancellation must not discard it.
    changeStrokes([...contentRef.current.strokes, drawing.stroke]);
    livePath.current?.setAttribute('d', '');
  };
  const point = (event: Pick<PointerEvent, 'clientX' | 'clientY' | 'pressure'>): MemoPoint => {
    const bounds = svg.current!.getBoundingClientRect();
    return { x: Math.max(0, Math.min(MEMO_WIDTH, (event.clientX - bounds.left) / bounds.width * MEMO_WIDTH)),
      y: Math.max(0, Math.min(MEMO_HEIGHT, (event.clientY - bounds.top) / bounds.height * MEMO_HEIGHT)), pressure: Math.max(0, Math.min(1, Number.isFinite(event.pressure) ? event.pressure : 0.5)) };
  };
  const begin = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (blocked.current || event.pointerType === 'touch' && !finger || event.button !== 0 || active.current) return;
    event.preventDefault();
    if (tool === 'eraser') {
      const id = event.target instanceof Element ? event.target.getAttribute('data-stroke-id') : null;
      if (id) changeStrokes(contentRef.current.strokes.filter(stroke => stroke.id !== id));
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    const stroke: MemoStroke = { id: crypto.randomUUID(), ink, width: 3.5, points: [point(event.nativeEvent)] };
    active.current = { pointerId: event.pointerId, stroke };
    livePath.current?.setAttribute('d', memoPath(stroke.points));
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (active.current?.pointerId !== event.pointerId) return;
    event.preventDefault();
    const native = event.nativeEvent;
    const samples = native.getCoalescedEvents?.() ?? [];
    active.current.stroke.points.push(...(samples.length ? samples : [native]).map(point));
    livePath.current?.setAttribute('d', memoPath(active.current.stroke.points));
  };
  const operations = useRef({ flush, finish }); operations.current = { flush, finish };
  useEffect(() => {
    const save = () => { operations.current.finish(); return operations.current.flush(); };
    const unload = (event: BeforeUnloadEvent) => { if (!save() && !sameMemo(contentRef.current, savedRef.current)) { event.preventDefault(); event.returnValue = ''; } };
    const hidden = () => { if (document.visibilityState === 'hidden') save(); };
    window.addEventListener('beforeunload', unload); window.addEventListener('pagehide', save); document.addEventListener('visibilitychange', hidden);
    if (!sameMemo(contentRef.current, savedRef.current) && !blocked.current) timer.current = setTimeout(() => operations.current.flush(), 600);
    return () => { window.removeEventListener('beforeunload', unload); window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', hidden); save(); };
  }, []);
  const close = () => { finish(); if (blocked.current || flush()) onClose(); };
  const copyConflict = () => {
    if (!initial.conflict) return;
    try {
      const operation = copyOperation.current ??= { id: crypto.randomUUID(), opId: crypto.randomUUID(), at: new Date().toISOString() };
      const next = repository.execute({ type: 'saveMemo', ...operation, ownerId: initial.conflict.ownerId, body: initial.conflict.body, strokes: initial.conflict.strokes,
        expectedVersion: 0, userId: data.userId, namespace: data.namespace });
      callback.current(next);
      // Keep the old draft until the new card is safely saved and verified by the repository.
      clearStoredDraft(key); onCopy(operation.id);
    } catch (e) { setError(errorMessage(e)); }
  };
  return <Modal open title="작은 메모" onClose={close} className="memo-editor">
    <div className="memo-toolbar" role="group" aria-label="그림 도구">
      <Button aria-pressed={tool === 'pen'} onClick={() => setTool('pen')} disabled={isBlocked}>펜</Button>
      <Button aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')} disabled={isBlocked}>지우개</Button>
      <Button disabled={!past.length || isBlocked} onClick={() => { const previous = past.at(-1)!; setPast(past.slice(0, -1)); setFuture([...future, contentRef.current.strokes]); update({ ...contentRef.current, strokes: previous }); }}>그림 되돌리기</Button>
      <Button disabled={!future.length || isBlocked} onClick={() => { const next = future.at(-1)!; setFuture(future.slice(0, -1)); setPast([...past, contentRef.current.strokes]); update({ ...contentRef.current, strokes: next }); }}>다시 그리기</Button>
      <div className="memo-inks" role="group" aria-label="펜 색">{(Object.keys(inks) as MemoInk[]).map(value => <Button key={value} aria-label={`${inks[value].label} 펜`} aria-pressed={ink === value} className="memo-ink" onClick={() => { setInk(value); setTool('pen'); }} disabled={isBlocked}><span style={{ background: inks[value].color }} /></Button>)}</div>
    </div>
    <div className="memo-paper">
      <svg ref={svg} className={`memo-drawing${tool === 'eraser' ? ' is-erasing' : ''}`} viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} role="img" aria-label="메모 스케치 영역"
        onPointerDown={begin} onPointerMove={move} onPointerUp={event => { if (active.current?.pointerId === event.pointerId) finish(); }} onPointerCancel={event => { if (active.current?.pointerId === event.pointerId) finish(); }} onLostPointerCapture={event => { if (active.current?.pointerId === event.pointerId) finish(); }}>
        <Drawing strokes={content.strokes} />
        {tool === 'eraser' && content.strokes.map(stroke => <path key={stroke.id} data-stroke-id={stroke.id} className="memo-erase-target" d={memoPath(stroke.points)} strokeWidth={Math.max(24, stroke.width)} fill="none" stroke="transparent" strokeLinecap="round" />)}
        <path ref={livePath} stroke={inks[ink].color} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!content.strokes.length && <span className="memo-drawing-hint">펜으로 결론이나 그림을 남겨 보세요.</span>}
    </div>
    <div className="memo-input"><Textarea label="짧은 글" placeholder="결론 한 줄, 남은 의문…" value={content.body} rows={3} disabled={isBlocked} onChange={event => update({ ...contentRef.current, body: event.target.value })} /></div>
    <div className="memo-options"><Checkbox label="손가락으로도 그리기" checked={finger} onChange={event => setFinger(event.target.checked)} disabled={isBlocked} />
      <span className="muted">지우개는 선을 눌러 지웁니다.</span>
      <Select label="연결할 곳" value={content.ownerId ?? ''} disabled={isBlocked} onChange={event => update({ ...contentRef.current, ownerId: event.target.value || null })}>
        <option value="">자유 메모</option>
        {data.subjects.filter(row => !row.deletedAt).map(subject => <optgroup key={subject.id} label={subject.name}><option value={subject.id}>{subject.name} 전체</option>{data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id).map(node => <option key={node.id} value={node.id}>{node.name}</option>)}</optgroup>)}
        {content.ownerId && ![...data.subjects, ...data.nodes].some(row => row.id === content.ownerId && !row.deletedAt) && <option value={content.ownerId}>{ownerName(data, content.ownerId)} · 휴지통</option>}
      </Select>
    </div>
    {error && <ErrorState message={error} />}
    {initial.conflict && <div className="memo-conflict"><p>저장된 메모는 위에 그대로 있습니다. 별도로 남아 있는 초안:</p><p className="prose">{initial.conflict.body || '(글 없음)'}</p><svg viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} role="img" aria-label="별도로 남아 있는 초안 그림"><Drawing strokes={initial.conflict.strokes} /></svg><Button onClick={copyConflict}>초안을 별도 메모로 보관</Button></div>}
    {isBlocked && !initial.conflict && <Button onClick={() => {
      try { archiveDamagedDraft(key, '작은 메모 초안 읽기 실패'); clearStoredDraft(key); blocked.current = false; setBlocked(false); setError('읽을 수 없던 초안 원문을 보관했습니다. 저장된 메모를 이어 편집할 수 있습니다.'); }
      catch (e) { setError(errorMessage(e)); }
    }}>초안 원문 보관 후 편집</Button>}
    {isBlocked && <a href="#/draft-archives" onClick={onClose}>초안 보관본 확인</a>}
    <footer className="memo-save-bar"><span role="status">{isBlocked ? '초안 확인 필요' : status}</span><div className="actions">{!isBlocked && <Button onClick={flush}>지금 저장</Button>}<Button variant="primary" onClick={close}>닫기</Button></div></footer>
  </Modal>;
}
