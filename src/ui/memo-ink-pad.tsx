import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { MemoPoint, MemoStroke } from '../domain/model';
import { MEMO_HEIGHT, MEMO_WIDTH, memoPath } from '../domain/memo';
import { IconButton, Checkbox } from './index';
import './memo-ink-pad.css';

/** Same vector format as memo cards; original coordinates and pressure stay editable. */
export function MemoInkPad({ strokes, onChange, onDrawing }: {
  strokes: MemoStroke[]; onChange: (strokes: MemoStroke[]) => void; onDrawing: (drawing: boolean) => void;
}) {
  const svg = useRef<SVGSVGElement>(null), live = useRef<SVGPathElement>(null);
  const active = useRef<{ pointerId: number; stroke: MemoStroke } | null>(null);
  const current = useRef({ strokes, onChange, onDrawing }); current.current = { strokes, onChange, onDrawing };
  const [finger, setFinger] = useState(false), [drawing, setDrawing] = useState(false);
  const [past, setPast] = useState<MemoStroke[][]>([]), [future, setFuture] = useState<MemoStroke[][]>([]);
  const change = (next: MemoStroke[]) => {
    setPast(history => [...history, current.current.strokes]); setFuture([]);
    current.current.onChange(next);
  };
  const point = (event: Pick<PointerEvent, 'clientX' | 'clientY' | 'pressure'>): MemoPoint => {
    const bounds = svg.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(MEMO_WIDTH, (event.clientX - bounds.left) / bounds.width * MEMO_WIDTH)),
      y: Math.max(0, Math.min(MEMO_HEIGHT, (event.clientY - bounds.top) / bounds.height * MEMO_HEIGHT)),
      pressure: Math.max(0, Math.min(1, Number.isFinite(event.pressure) ? event.pressure : .5)),
    };
  };
  const finish = () => {
    const pending = active.current; if (!pending) return;
    active.current = null;
    change([...current.current.strokes, pending.stroke]);
    live.current?.setAttribute('d', ''); setDrawing(false); current.current.onDrawing(false);
  };
  const operations = useRef({ finish }); operations.current = { finish };
  useEffect(() => {
    const flush = () => operations.current.finish();
    const hidden = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush); document.addEventListener('visibilitychange', hidden);
    return () => { window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', hidden); flush(); };
  }, []);
  const begin = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || active.current || event.pointerType === 'touch' && !finger) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    active.current = { pointerId: event.pointerId, stroke: { id: crypto.randomUUID(), ink: 'ink', width: 3, points: [point(event.nativeEvent)] } };
    live.current?.setAttribute('d', memoPath(active.current.stroke.points));
    setDrawing(true); onDrawing(true);
  };
  return <section className="memo-ink-pad" aria-label="펜으로 설명하기">
    <div className="ink-pad-toolbar">
      <span>메모</span>
      <div className="actions">
        <IconButton label="되돌리기" disabled={drawing || !past.length} onClick={() => {
          const previous = past.at(-1)!; setPast(past.slice(0, -1)); setFuture([...future, strokes]); onChange(previous);
        }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5 4 10l5 5M4 10h10a6 6 0 0 1 0 12" /></svg></IconButton>
        <IconButton label="다시 적용" disabled={drawing || !future.length} onClick={() => {
          const next = future.at(-1)!; setFuture(future.slice(0, -1)); setPast([...past, strokes]); onChange(next);
        }}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 5 5 5-5 5M20 10H10a6 6 0 0 0 0 12" /></svg></IconButton>
      </div>
    </div>
    <svg ref={svg} viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} aria-label="설명 필기 영역" role="img" data-finger={finger}
      onPointerDown={begin} onPointerMove={event => {
        if (active.current?.pointerId !== event.pointerId) return;
        event.preventDefault(); const samples = event.nativeEvent.getCoalescedEvents?.() ?? [];
        active.current.stroke.points.push(...(samples.length ? samples : [event.nativeEvent]).map(point));
        live.current?.setAttribute('d', memoPath(active.current.stroke.points));
      }} onPointerUp={event => { if (active.current?.pointerId === event.pointerId) finish(); }}
      onPointerCancel={event => { if (active.current?.pointerId === event.pointerId) finish(); }}
      onLostPointerCapture={event => { if (active.current?.pointerId === event.pointerId) finish(); }}>
      {strokes.map(stroke => <path key={stroke.id} d={memoPath(stroke.points)} stroke={{ ink: 'var(--color-text)', blue: 'var(--color-hierarchy-outline)', green: 'var(--color-primary)' }[stroke.ink]} strokeWidth={stroke.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      <path ref={live} stroke="var(--color-text)" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Checkbox label="손가락으로도 그리기" checked={finger} disabled={drawing} onChange={event => setFinger(event.target.checked)} />
  </section>;
}
