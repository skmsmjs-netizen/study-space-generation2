import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { MemoPoint, MemoStroke, MemoInk } from '../domain/model';
import { MEMO_HEIGHT, MEMO_WIDTH } from '../domain/memo';
import {
  applyInkChange,
  eraseInk,
  inkBounds,
  inkChange,
  inkFingerprint,
  inkPageCount,
  selectInk,
  selectInkLasso,
  strokePage,
  transformInk,
  type InkRect,
} from '../domain/ink-editing';
import {
  defaultInkPreferences,
  defaultInkWorkspace,
  readInkPreferences,
  readInkWorkspace,
  resetInkStorage,
  writeInkPreferences,
  writeInkWorkspace,
  type InkPreferences,
  type InkWorkspace,
} from '../data/ink-workspace';
import { inkSync } from '../data/ink-sync';
import type { StudyRepository } from '../data/repository';
import type { ReactNode } from 'react';
import { Button, Checkbox, Select } from './index';
import { InkOCR } from './ink-ocr';
import { InkDrawing, inkColors, inkShape } from './ink-drawing';
import './memo-ink-pad.css';

type Tool = 'pen' | 'eraser' | 'select';
type Gesture = {
  pointerId: number;
  before: MemoStroke[];
  bounds: DOMRect;
  page: number;
  tool: Tool;
  start: MemoPoint;
  stroke?: MemoStroke;
  moving?: boolean;
  ids: string[];
  lasso?: MemoPoint[];
};
export interface InkPadHandle {
  finish: () => void; goTo?: (page:number) => void;
}
/** One editor for memo, recall and test answers. Page metadata never rescales existing points. */
export function MemoInkPad({
  strokes,
  onChange,
  onDrawing,
  label = '펜으로 설명하기',
  drawingLabel = '설명 필기 영역',
  title = '메모',
  disabled = false,
  documentKey,
  preferencesKey,
  controller, repository, onWorkspaceSaved, background, minimumPages = 1, onPageChange, onRecognizedText,
}: {
  repository?: StudyRepository;
  onWorkspaceSaved?: () => void;
  background?: ReactNode;
  minimumPages?: number;
  onPageChange?: (page: number) => void;
  onRecognizedText?: (text:string) => void;
  strokes: MemoStroke[];
  onChange: (strokes: MemoStroke[]) => void;
  onDrawing: (drawing: boolean) => void;
  label?: string;
  drawingLabel?: string;
  title?: string;
  disabled?: boolean;
  documentKey?: string;
  preferencesKey?: string;
  controller?: { current: InkPadHandle | null };
}) {
  const historyKey = documentKey ? `${documentKey}:ink-workspace:v1` : undefined;
  const [sync] = useState(() => repository ? inkSync(repository, onWorkspaceSaved) : null);
  const [initial] = useState(() => {
    const errors: string[] = [];
    let prefs = { ...defaultInkPreferences },
      view = defaultInkWorkspace(strokes);
    try {
      const remote = sync?.read(preferencesKey);
      if (remote?.kind === 'preferences') { prefs = remote.value; writeInkPreferences(preferencesKey,prefs); }
      else prefs = readInkPreferences(preferencesKey);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : '필기 설정을 읽지 못했습니다.');
    }
    try {
      const remote = sync?.read(historyKey);
      if (remote?.kind === 'document') writeInkWorkspace(historyKey,remote.value);
      view = readInkWorkspace(historyKey, strokes);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : '필기 이력을 읽지 못했습니다.');
    }
    view.pages = Math.max(view.pages, inkPageCount(strokes), minimumPages);
    return { prefs, view, error: errors.join(' ') };
  });
  const [prefs, setPrefs] = useState(initial.prefs),
    [view, setView] = useState(initial.view);
  const [tool, setTool] = useState<Tool>('pen'),
    [whole, setWhole] = useState(false),
    [drawing, setDrawing] = useState(false);
  const [selection, setSelection] = useState<string[]>([]),
    [box, setBox] = useState<InkRect | null>(null),
    [expanded, setExpanded] = useState(false);
  const [selectionShape, setSelectionShape] = useState<'box' | 'lasso'>('box');
  const lassoPath = useRef<SVGPathElement>(null);
  const [error, setError] = useState(initial.error);
  const [syncConflict,setSyncConflict] = useState(false);
  const damaged = useRef(Boolean(initial.error));
  const preferencesChanged = useRef(false);
  const svg = useRef<SVGSVGElement>(null),
    live = useRef<SVGPathElement>(null),
    viewport = useRef<HTMLDivElement>(null);
  const active = useRef<Gesture | null>(null),
    raf = useRef<number | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touch = useRef(new Map<number, { x: number; y: number }>()),
    pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const current = useRef({
    strokes,
    onChange,
    onDrawing,
    prefs,
    view,
    tool,
    whole,
    selection,
    disabled,
  });
  current.current = {
    ...current.current,
    strokes,
    onChange,
    onDrawing,
    prefs,
    view,
    tool,
    whole,
    selection,
    disabled,
  };
  const persist = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (damaged.current) return;
    try {
      // Saving a document view must not replace settings changed in another open pad.
      if (preferencesChanged.current) {
        writeInkPreferences(preferencesKey, current.current.prefs);
        sync?.save(preferencesKey, {kind: 'preferences', value:current.current.prefs});
        preferencesChanged.current = false;
      }
      writeInkWorkspace(historyKey, {
        ...current.current.view,
        fingerprint: inkFingerprint(current.current.strokes),
      });
      sync?.save(historyKey, {kind:'document', value:{...current.current.view, fingerprint:inkFingerprint(current.current.strokes)}});
      setError('');setSyncConflict(false);
    } catch (e) {
      if (e && typeof e==='object' && 'code' in e && e.code==='VERSION_CONFLICT') setSyncConflict(true);
      setError(
        e instanceof Error ? '필기 설정과 되돌리기 이력: ' + e.message + ' 작성 내용과 이력은 이 기기에 유지했습니다. 저장을 다시 시도해 주세요.' : '필기 설정과 되돌리기 이력을 저장하지 못했습니다. 작성 내용은 유지했습니다.',
      );
    }
  };
  const schedule = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(persist, 180);
  };
  useEffect(() => { onPageChange?.(view.page); }, [view.page, onPageChange]);
  const changeView = (patch: Partial<InkWorkspace>) => {
    const next = { ...current.current.view, ...patch };
    next.pages = Math.max(next.pages, minimumPages, inkPageCount(current.current.strokes), next.page + 1);
    current.current.view = next;
    setView(next);
    schedule();
  };
  const preference = (patch: Partial<InkPreferences>) => {
    const next = { ...current.current.prefs, ...patch };
    preferencesChanged.current = true;
    current.current.prefs = next;
    setPrefs(next);
    schedule();
  };
  const emit = (next: MemoStroke[]) => {
    current.current.strokes = next;
    current.current.onChange(next);
  };
  const commit = (before: MemoStroke[], after: MemoStroke[]) => {
    const change = inkChange(before, after);
    if (!change) return;
    // Keep the latest 50 gestures in device history; saved content/revisions are never trimmed.
    changeView({ undo: [...current.current.view.undo, change].slice(-50), redo: [] });
  };
  const paint = () => {
    if (raf.current !== null) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const stroke = active.current?.stroke;
      if (stroke) live.current?.setAttribute('d', inkShape(stroke));
      const points = active.current?.lasso;
      if (points) lassoPath.current?.setAttribute('d', points.map((p,i)=>`${i ? 'L' : 'M'}${p.x},${p.y}`).join('') + 'Z');
    });
  };
  const markDrawing = (value: boolean) => {
    setDrawing(value);
    current.current.onDrawing(value);
  };
  const finish = () => {
    const gesture = active.current;
    if (!gesture) return;
    active.current = null;
    if (gesture.lasso && gesture.lasso.length >= 3) setSelection(selectInkLasso(current.current.strokes, gesture.lasso, gesture.page));
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    if (gesture.stroke) emit([...current.current.strokes, gesture.stroke]);
    commit(gesture.before, current.current.strokes);
    live.current?.setAttribute('d', '');
    lassoPath.current?.setAttribute('d', '');
    setBox(null);
    markDrawing(false);
    schedule();
  };
  const operations = useRef({ finish, persist });
  operations.current = { finish, persist };
  if (controller) controller.current = { finish, goTo: page => navigatePage(page) };
  useEffect(() => {
    const flush = () => {
      operations.current.finish();
      operations.current.persist();
    };
    const hidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('beforeunload', flush);
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', hidden);
      flush();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);
  const point = (
    event: Pick<PointerEvent, 'clientX' | 'clientY' | 'pressure'>,
    bounds: DOMRect,
  ): MemoPoint => ({
    x: Math.max(
      0,
      Math.min(MEMO_WIDTH, ((event.clientX - bounds.left) / bounds.width) * MEMO_WIDTH),
    ),
    y: Math.max(
      0,
      Math.min(MEMO_HEIGHT, ((event.clientY - bounds.top) / bounds.height) * MEMO_HEIGHT),
    ),
    pressure: Math.max(0, Math.min(1, Number.isFinite(event.pressure) ? event.pressure : 0.5)),
  });
  const erase = (p: MemoPoint, bounds: DOMRect, page: number) => {
    const next = eraseInk(
      current.current.strokes,
      p,
      (14 * MEMO_WIDTH) / bounds.width,
      page,
      current.current.whole,
    );
    if (next !== current.current.strokes) emit(next);
  };
  const begin = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (disabled || event.button !== 0) return;
    if (event.pointerType === 'touch' && !prefs.finger) {
      if (active.current) return; // Resting a hand must not move the page during a pen gesture.
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      touch.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touch.current.size === 2) {
        const [a, b] = [...touch.current.values()];
        pinch.current = {
          distance: Math.hypot(a.x - b.x, a.y - b.y),
          zoom: current.current.view.zoom,
        };
      }
      return;
    }
    if (active.current || touch.current.size) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.getBoundingClientRect(),
      p = point(event.nativeEvent, bounds),
      page = current.current.view.page;
    const boundsSelection = inkBounds(strokes.filter((s) => selection.includes(s.id)));
    active.current = {
      pointerId: event.pointerId,
      before: strokes,
      bounds,
      page,
      tool,
      start: p,
      ids: selection,
      moving:
        !!boundsSelection &&
        p.x >= boundsSelection.x - 8 &&
        p.x <= boundsSelection.x + boundsSelection.width + 8 &&
        p.y >= boundsSelection.y - 8 &&
        p.y <= boundsSelection.y + boundsSelection.height + 8,
    };
    markDrawing(true);
    if (tool === 'pen') {
      active.current.stroke = {
        id: crypto.randomUUID(),
        ink: prefs.ink,
        width: prefs.width,
        points: [p],
        ...(page ? { page } : {}),
        ...(prefs.pressure ? { pressureSensitive: true } : {}),
      };
      setSelection([]);
      paint();
    } else if (tool === 'eraser') {
      setSelection([]);
      erase(p, bounds, page);
    } else if (!active.current.moving) {
      if (selectionShape === 'lasso') active.current.lasso = [p];
      // A tap selects the topmost intersecting stroke without requiring a drag.
      const remaining = new Set(
        eraseInk(strokes, p, (8 * MEMO_WIDTH) / bounds.width, page, true).map((s) => s.id),
      );
      const hit = strokes.filter((s) => strokePage(s) === page && !remaining.has(s.id)).at(-1);
      setSelection(hit ? [hit.id] : []);
      if (selectionShape === 'box') setBox({ x: p.x, y: p.y, width: 0, height: 0 });
    }
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    const old = touch.current.get(event.pointerId);
    if (old) {
      event.preventDefault();
      touch.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (touch.current.size === 2 && pinch.current) {
        const [a, b] = [...touch.current.values()];
        const ratio = Math.hypot(a.x - b.x, a.y - b.y) / (pinch.current.distance || 1);
        const target = Math.max(1, Math.min(2, pinch.current.zoom * ratio));
        const zoom = target < 1.25 ? 1 : target < 1.75 ? 1.5 : 2;
        if (zoom !== current.current.view.zoom) changeView({ zoom });
      } else if (viewport.current) {
        viewport.current.scrollLeft += old.x - event.clientX;
        viewport.current.scrollTop += old.y - event.clientY;
      }
      return;
    }
    const gesture = active.current;
    if (gesture?.pointerId !== event.pointerId) return;
    event.preventDefault();
    const samples = event.nativeEvent.getCoalescedEvents?.() ?? [],
      events = samples.length ? samples : [event.nativeEvent];
    if (gesture.stroke) {
      gesture.stroke.points.push(...events.map((e) => point(e, gesture.bounds)));
      paint();
    } else if (gesture.tool === 'eraser')
      for (const sample of events)
        erase(point(sample, gesture.bounds), gesture.bounds, gesture.page);
    else {
      const p = point(event.nativeEvent, gesture.bounds);
      if (gesture.moving)
        emit(
          transformInk(gesture.before, gesture.ids, p.x - gesture.start.x, p.y - gesture.start.y),
        );
      else if (gesture.lasso) {
        gesture.lasso.push(...events.map(e=>point(e,gesture.bounds)));
        paint();
      } else {
        const rect = {
          x: Math.min(p.x, gesture.start.x),
          y: Math.min(p.y, gesture.start.y),
          width: Math.abs(p.x - gesture.start.x),
          height: Math.abs(p.y - gesture.start.y),
        };
        setBox(rect);
        setSelection(selectInk(current.current.strokes, rect, gesture.page));
      }
    }
  };
  const end = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (active.current?.pointerId === event.pointerId) finish();
    touch.current.delete(event.pointerId);
    if (touch.current.size < 2) pinch.current = null;
  };
  const undo = (reverse: boolean) => {
    const stack = reverse ? current.current.view.undo : current.current.view.redo,
      change = stack.at(-1);
    if (!change) return;
    emit(applyInkChange(current.current.strokes, change, reverse));
    setSelection([]);
    changeView(
      reverse
        ? { undo: stack.slice(0, -1), redo: [...current.current.view.redo, change] }
        : { redo: stack.slice(0, -1), undo: [...current.current.view.undo, change] },
    );
  };
  const editSelection = (action: 'delete' | 'copy' | 'transform', dx = 0, dy = 0, scale = 1) => {
    const before = current.current.strokes,
      ids = current.current.selection;
    let after = before;
    if (action === 'delete') {
      after = before.filter((s) => !ids.includes(s.id));
      setSelection([]);
    } else if (action === 'copy') {
      const copies = before
        .filter((s) => ids.includes(s.id))
        .map((s) => ({ ...s, id: crypto.randomUUID(), points: s.points.map((p) => ({ ...p })) }));
      after = [...before, ...copies];
      after = transformInk(
        after,
        copies.map((s) => s.id),
        12,
        12,
      );
      setSelection(copies.map((s) => s.id));
    } else after = transformInk(before, ids, dx, dy, scale);
    emit(after);
    commit(before, after);
  };
  const pages = Math.max(view.pages, inkPageCount(strokes), minimumPages),
    bounds = inkBounds(
      strokes.filter((s) => selection.includes(s.id) && strokePage(s) === view.page),
    );
  const navigatePage = (page: number) => {
    finish();
    setSelection([]);
    changeView({ page });
    if (viewport.current) {
      viewport.current.scrollTop = 0;
      viewport.current.scrollLeft = 0;
    }
  };
  useEffect(() => { if (minimumPages > current.current.view.pages) changeView({pages:minimumPages}); }, [minimumPages]);
  const rectangle = box ?? bounds;
  const locked = disabled || drawing;
  return (
    <section className={`memo-ink-pad${expanded ? ' is-expanded' : ''}`} aria-label={label}>
      <div className="ink-pad-toolbar">
        <span>{title}</span>
        <div className="actions">
          <Button aria-pressed={tool === 'pen'} disabled={locked} onClick={() => setTool('pen')}>
            펜
          </Button>
          <Button
            aria-pressed={tool === 'eraser'}
            disabled={locked}
            onClick={() => setTool('eraser')}
          >
            지우개
          </Button>
          <Button
            aria-pressed={tool === 'select'}
            disabled={locked}
            onClick={() => setTool('select')}
          >
            선택
          </Button>
          <Button
            aria-label="그림 되돌리기"
            disabled={locked || !view.undo.length}
            onClick={() => undo(true)}
          >
            되돌리기
          </Button>
          <Button
            aria-label="다시 그리기"
            disabled={locked || !view.redo.length}
            onClick={() => undo(false)}
          >
            다시 적용
          </Button>
        </div>
      </div>
      <div className="ink-pad-options">
        {tool === 'select' && <Select label="선택 모양" value={selectionShape} disabled={locked} onChange={e=>setSelectionShape(e.target.value as 'box'|'lasso')}><option value="box">사각형</option><option value="lasso">자유 모양 올가미</option></Select>}
        <Select
          label="펜 색"
          value={prefs.ink}
          disabled={locked}
          onChange={(e) => preference({ ink: e.target.value as MemoInk })}
        >
          <option value="ink">기본색</option>
          <option value="blue">파랑</option>
          <option value="green">초록</option>
        </Select>
        <Select
          label="펜 굵기"
          value={prefs.width}
          disabled={locked}
          onChange={(e) => preference({ width: Number(e.target.value) })}
        >
          {[2, 3, 5, 8].map((width, i) => (
            <option key={width} value={width}>
              {['가는 선', '보통', '굵은 선', '아주 굵은 선'][i]}
            </option>
          ))}
        </Select>
        {tool === 'eraser' && (
          <Select
            label="지우는 방식"
            value={whole ? 'whole' : 'part'}
            disabled={locked}
            onChange={(e) => setWhole(e.target.value === 'whole')}
          >
            <option value="part">닿은 부분</option>
            <option value="whole">선 전체</option>
          </Select>
        )}
      </div>
      <div className="ink-pad-navigation">
        <Button
          aria-label="이전 필기 쪽"
          disabled={locked || !view.page}
          onClick={() => navigatePage(view.page - 1)}
        >
          이전
        </Button>
        <Select
          label="필기 쪽"
          value={view.page}
          disabled={locked}
          onChange={(e) => navigatePage(Number(e.target.value))}
        >
          {[
            ...new Set([
              0,
              view.page,
              Math.max(0, view.page - 1),
              Math.min(pages - 1, view.page + 1),
              pages - 1,
              ...strokes.map(strokePage),
            ]),
          ]
            .sort((a, b) => a - b)
            .map((page) => (
              <option key={`page-${page}`} value={page}>
                {page + 1} / {pages}쪽
              </option>
            ))}
        </Select>
        <Button
          aria-label="다음 필기 쪽"
          disabled={locked || view.page + 1 >= pages}
          onClick={() => navigatePage(view.page + 1)}
        >
          다음
        </Button>
        <Button
          disabled={locked}
          onClick={() => {
            changeView({ pages: pages + 1 });
            navigatePage(pages);
          }}
        >
          쪽 추가
        </Button>
        <Button
          aria-label="종이 확대"
          disabled={locked}
          onClick={() => changeView({ zoom: view.zoom === 1 ? 1.5 : view.zoom === 1.5 ? 2 : 1 })}
        >
          {Math.round(view.zoom * 100)}%
        </Button>
        <Button
          disabled={locked}
          onClick={() => {
            changeView({ zoom: 1 });
            if (viewport.current) {
              viewport.current.scrollLeft = 0;
              viewport.current.scrollTop = 0;
            }
          }}
        >
          보기 초기화
        </Button>
        <Button aria-pressed={expanded} disabled={locked} onClick={() => setExpanded(!expanded)}>
          {expanded ? '작게 보기' : '넓게 쓰기'}
        </Button>
      </div>
      <div ref={viewport} className="ink-pad-paper">
        <svg
          ref={svg}
          viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`}
          style={{ width: `${view.zoom * 100}%` }}
          aria-label={drawingLabel}
          role="img"
          onPointerDown={begin}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onLostPointerCapture={end}
        >
          {background}
          <InkDrawing strokes={strokes} page={view.page} />
          {tool === 'select' && selectionShape === 'lasso' && <path ref={lassoPath} className="ink-selection" />}
          <path
            ref={live}
            stroke={prefs.pressure ? 'none' : inkColors[prefs.ink]}
            fill={prefs.pressure ? inkColors[prefs.ink] : 'none'}
            strokeWidth={prefs.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {rectangle && (
            <rect
              className="ink-selection"
              x={rectangle.x}
              y={rectangle.y}
              width={Math.max(1, rectangle.width)}
              height={Math.max(1, rectangle.height)}
            />
          )}
        </svg>
      </div>
      {tool === 'select' && (
        <div className="ink-selection-actions">
          <p className="muted">
            선을 누르거나 선택한 모양으로 필기를 둘러싸세요. 선택한 필기는 끌거나 아래 버튼으로 옮길 수
            있습니다.
          </p>
          <div className="actions">
            <Button
              disabled={locked}
              onClick={() =>
                setSelection(strokes.filter((s) => strokePage(s) === view.page).map((s) => s.id))
              }
            >
              이 쪽 모두 선택
            </Button>
            <Button disabled={locked || !selection.length} onClick={() => setSelection([])}>
              선택 풀기
            </Button>
            {[
              [-10, 0, '왼쪽'],
              [10, 0, '오른쪽'],
              [0, -10, '위로'],
              [0, 10, '아래로'],
            ].map(([dx, dy, name]) => (
              <Button
                key={String(name)}
                disabled={locked || !selection.length}
                onClick={() => editSelection('transform', Number(dx), Number(dy))}
              >
                {name}
              </Button>
            ))}
            <Button
              disabled={locked || !selection.length}
              onClick={() => editSelection('transform', 0, 0, 0.9)}
            >
              선택 줄이기
            </Button>
            <Button
              disabled={locked || !selection.length}
              onClick={() => editSelection('transform', 0, 0, 1.1)}
            >
              선택 늘리기
            </Button>
            <Button disabled={locked || !selection.length} onClick={() => editSelection('copy')}>
              선택 복사
            </Button>
            <Button disabled={locked || !selection.length} onClick={() => editSelection('delete')}>
              선택 지우기
            </Button>
          </div>
        </div>
      )}
      {onRecognizedText && <InkOCR documentKey={documentKey} strokes={strokes} page={view.page} disabled={locked} onApply={onRecognizedText}/> }
      <details className="ink-pad-settings">
        <summary>필기 설정</summary>
        <Checkbox
          label="손가락으로도 그리기"
          checked={prefs.finger}
          disabled={locked}
          onChange={(e) => preference({ finger: e.target.checked })}
        />
        <Checkbox
          label="필압에 따라 굵기 바꾸기"
          checked={prefs.pressure}
          disabled={locked}
          onChange={(e) => preference({ pressure: e.target.checked })}
        />
        <p className="muted">
          손가락 그리기를 끄면 손가락으로 종이를 이동하고 두 손가락으로 확대할 수 있습니다.
        </p>
      </details>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <Button
            onClick={() => {
              try {
                if (damaged.current) {
                  resetInkStorage(preferencesKey);
                  resetInkStorage(historyKey);
                  damaged.current = false;
                }
                persist();
              } catch {
                setError(
                  '필기 설정 사본을 보관하지 못했습니다. 원문은 유지했습니다. 다시 시도해 주세요.',
                );
              }
            }}
          >
            설정·이력 저장 다시 시도
          </Button>
          {syncConflict && <><p>다른 기기의 설정·이력이 변경되었습니다. 현재 값으로 저장하면 다른 기기의 값도 보관본과 수정 이력에 남깁니다.</p><Button onClick={()=>{try{sync?.keepCurrentAfterReview(preferencesKey);sync?.keepCurrentAfterReview(historyKey);preferencesChanged.current=true;persist();}catch(e){setError(e instanceof Error?e.message:'다른 기기의 설정을 보관하지 못했습니다.');}}}>현재 설정·이력으로 다시 저장</Button></>}
        </div>
      )}
    </section>
  );
}
