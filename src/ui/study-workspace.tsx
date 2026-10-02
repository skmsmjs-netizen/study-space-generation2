import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { AppState } from '../domain/model';
import {
  DEFAULT_DESK,
  readWorkState,
  writeWorkState,
  workStateKey,
  type DeskLayout,
  type WorkState,
  type WorkspaceTool,
} from '../data/study-workspace';
import { Button, EmptyState, ErrorState, Input, Modal, Select } from './index';
import { navigate } from './navigation-context';
import { observatoryRouteTitle, routeAvailable } from './observatory-navigation';
import './study-workspace.css';

export function useStudyWorkspace(data: AppState, route: string) {
  const key = workStateKey(data);
  const [boot, setBoot] = useState(() => ({ key, ...readWorkState(key) }));
  const [error, setError] = useState('');
  const current = boot.key === key ? boot : { key, ...readWorkState(key) };
  const state = current.value;
  const storedRaw = useRef(new Map<string, string | null>());
  if (!storedRaw.current.has(key)) storedRaw.current.set(key, current.raw);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
  const generation = useRef(0);
  const activeKey = useRef(key); activeKey.current = key;
  useEffect(() => {
    setBoot({ key, ...readWorkState(key) });
    setError('');
  }, [key]);
  const reload = () => {
    generation.current++;
    const restored = readWorkState(key);
    storedRaw.current.set(key, restored.raw);
    setBoot({ key, ...restored });
    setError('');
  };
  function change(next: WorkState): Promise<boolean> {
    if (current.error) { setError(current.error); return Promise.resolve(false); }
    const operation = ++generation.current;
    setBoot({ key, value: next, error: '', raw: current.raw });
    const writing = writeQueue.current.then(async () => {
      if (operation !== generation.current || activeKey.current !== key) return false;
      try {
        const raw = await writeWorkState(key, next, storedRaw.current.get(key) ?? null);
        storedRaw.current.set(key, raw);
        if (activeKey.current === key && operation === generation.current) {
          setBoot({ key, value: next, error: '', raw }); setError('');
        }
        return true;
      } catch (failure) {
        if (activeKey.current === key && operation === generation.current) {
          setError(failure instanceof Error && failure.message === 'WORKSPACE_CHANGED'
            ? '다른 창에서 작업 구성을 바꿨습니다. 지금 구성을 덮어쓰지 않았습니다. 다시 읽기를 누르면 저장된 구성을 불러옵니다.'
            : failure instanceof Error && failure.message === 'WORKSPACE_LOCK_UNAVAILABLE'
              ? '이 브라우저에서 작업 구성을 안전하게 보관할 수 없습니다. 현재 구성은 이 창에 유지됩니다. 다른 브라우저에서 보관해 주세요.'
              : '작업 구성이 이 브라우저에 저장되지 않았습니다. 현재 화면은 유지했습니다. 저장 다시 시도를 눌러 주세요.');
        }
        return false;
      }
    });
    writeQueue.current = writing;
    return writing;
  }
  const layout = state.layouts[route] ?? DEFAULT_DESK;
  const setLayout = (next: DeskLayout) =>
    change({ ...state, layouts: { ...state.layouts, [route]: next } });
  const openTool = (tool: WorkspaceTool) =>
    setLayout({ ...layout, open: true, tool, pane: 'tool', focus: 'both' });
  return {
    state,
    layout,
    setLayout,
    openTool,
    change,
    error: current.error || error,
    reload,
    retry: () => change(state),
    key,
  };
}
export type StudyWorkspaceController = ReturnType<typeof useStudyWorkspace>;
export const TOOL_NAMES: Record<WorkspaceTool, string> = {
  memo: '메모',
  math: '수식 탐색',
  code: '코딩 연습',
  record: '공부 기록',
};

/** Both panes keep their existing editor instance while their visibility or width changes. */
export function StudyWorkspace({
  controller,
  source,
  renderTool,
  sourceTitle,
}: {
  controller: StudyWorkspaceController;
  source: ReactNode;
  renderTool: (tool: WorkspaceTool, active: boolean) => ReactNode;
  sourceTitle: string;
}) {
  const { layout, setLayout } = controller;
  const [visited, setVisited] = useState<WorkspaceTool[]>(() => (layout.open ? [layout.tool] : []));
  const shown = layout.open && !visited.includes(layout.tool) ? [...visited, layout.tool] : visited;
  useEffect(() => {
    if (layout.open)
      setVisited((previous) =>
        previous.includes(layout.tool) ? previous : [...previous, layout.tool],
      );
  }, [layout.open, layout.tool]);
  const container = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const element = container.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const update = () => setNarrow(element.clientWidth <= 760);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="study-workspace"
      aria-label="자료와 도구 작업면"
      data-open={layout.open}
      data-pane={layout.pane}
      data-focus={layout.focus ?? 'both'}
      style={{ '--desk-source-width': `${layout.width}%` } as CSSProperties}
    >
      <div className="study-workspace-toolbar">
        <Button
          aria-expanded={layout.open}
          onClick={() => setLayout({ ...layout, open: !layout.open })}
        >
          {layout.open ? '곁 도구 접기' : '곁 도구 펼치기'}
        </Button>
        {layout.open && (
          <>
            <Select
              label="곁에 놓을 도구"
              value={layout.tool}
              onChange={(event) =>
                setLayout({
                  ...layout,
                  tool: event.target.value as WorkspaceTool,
                  pane: 'tool',
                  focus: 'both',
                })
              }
            >
              {Object.entries(TOOL_NAMES).map(([value, name]) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </Select>
            <label className="study-workspace-width">
              자료 폭 {layout.width}%
              <input
                aria-label="자료 폭 조절"
                type="range"
                min="30"
                max="70"
                value={layout.width}
                onChange={(event) => setLayout({ ...layout, width: Number(event.target.value) })}
              />
            </label>
            <Select
              label="작업면 표시"
              value={layout.focus ?? 'both'}
              onChange={(event) =>
                setLayout({ ...layout, focus: event.target.value as 'both' | 'source' | 'tool' })
              }
            >
              <option value="both">두 면 함께</option>
              <option value="source">자료만 크게</option>
              <option value="tool">도구만 크게</option>
            </Select>
            <Button
              onClick={() => setLayout({ ...layout, width: DEFAULT_DESK.width, focus: 'both' })}
            >
              기본 폭
            </Button>
            <div className="study-workspace-pane-switch" role="group" aria-label="좁은 화면 작업면">
              <Button
                aria-pressed={layout.pane === 'source'}
                onClick={() => setLayout({ ...layout, pane: 'source', focus: 'both' })}
              >
                자료 보기
              </Button>
              <Button
                aria-pressed={layout.pane === 'tool'}
                onClick={() => setLayout({ ...layout, pane: 'tool', focus: 'both' })}
              >
                도구 보기
              </Button>
            </div>
          </>
        )}
      </div>
      <div className="study-workspace-panes" ref={container}>
        <div className="study-workspace-source" role="region" aria-label={sourceTitle}>
          {source}
        </div>
        <div className="study-workspace-tools" hidden={!layout.open}>
          {shown.map((tool) => (
            <section
              key={tool}
              hidden={tool !== layout.tool}
              aria-label={`곁 도구: ${TOOL_NAMES[tool]}`}
            >
              <h2>{TOOL_NAMES[tool]}</h2>
              {renderTool(tool, layout.open && tool === layout.tool && layout.focus !== 'source' && (layout.focus === 'tool' || !narrow || layout.pane === 'tool'))}

            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SavedWorkspaces({
  controller,
  data,
  route,
}: {
  controller: StudyWorkspaceController;
  data: AppState;
  route: string;
}) {
  const [open, setOpen] = useState(false),
    [name, setName] = useState(''),
    [status, setStatus] = useState('');
  const [deleted, setDeleted] = useState<WorkState['saved'][number] | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null),
    [newName, setNewName] = useState('');
  const { state, layout, change } = controller;
  return (
    <>
      <Button
        onClick={() => {
          setName(observatoryRouteTitle(data, route));
          setStatus('');
          setOpen(true);
        }}
      >
        작업 구성
      </Button>
      <Modal open={open} title="작업 구성 보관함" onClose={() => setOpen(false)}>
        <WorkspaceStorageNotice controller={controller} />
        <p>
          지금 화면과 곁 도구·폭을 보관합니다. 원문과 공부 기록은 각 화면의 저장 방식을 따릅니다. 이
          브라우저의 현재 계정에서 다시 열 수 있습니다.
        </p>
        <Input
          label="작업 이름"
          maxLength={120}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button
          disabled={!name.trim()}
          onClick={async () => {
            const saved = {
              id: crypto.randomUUID(),
              name: name.trim(),
              route,
              layout: { ...layout },
              savedAt: new Date().toISOString(),
            };
            const ok = await change({ ...state, saved: [...state.saved, saved] });
            setStatus(
              ok
                ? '작업 구성을 보관했습니다.'
                : '작업 구성을 저장하지 못했습니다. 안내에 따라 다시 시도해 주세요.',
            );
          }}
        >
          현재 작업 보관
        </Button>
        {status && <p role="status">{status}</p>}
        {deleted && (
          <Button
            onClick={() => {
              change({ ...state, saved: [...state.saved, deleted] });
              setDeleted(null);
              setStatus('작업 구성을 되돌렸습니다.');
            }}
          >
            구성 삭제 되돌리기
          </Button>
        )}
        {!state.saved.length && (
          <EmptyState
            title="보관한 작업이 없습니다"
            message="자료와 도구를 열어 둔 상태를 이름 붙여 보관하세요."
          />
        )}
        <ul className="saved-workspaces-list">
          {state.saved.map((item) => (
            <li key={item.id}>
              {renaming === item.id ? (
                <>
                  <Input
                    label="새 작업 이름"
                    maxLength={120}
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                  />
                  <Button
                    disabled={!newName.trim()}
                    onClick={() => {
                      change({
                        ...state,
                        saved: state.saved.map((s) =>
                          s.id === item.id ? { ...s, name: newName.trim() } : s,
                        ),
                      });
                      setRenaming(null);
                    }}
                  >
                    이름 저장
                  </Button>
                  <Button onClick={() => setRenaming(null)}>취소</Button>
                </>
              ) : (
                <strong>{item.name}</strong>
              )}
              <span>
                {observatoryRouteTitle(data, item.route)} · {TOOL_NAMES[item.layout.tool]}
              </span>
              {routeAvailable(data, item.route) ? (
                <Button
                  onClick={() => {
                    change({
                      ...state,
                      layouts: { ...state.layouts, [item.route]: { ...item.layout } },
                    });
                    setOpen(false);
                    navigate(item.route);
                  }}
                >
                  이 작업 열기
                </Button>
              ) : (
                <p>
                  대상 자료를 찾을 수 없습니다. 휴지통에서 복원한 뒤 다시 열 수 있습니다.{' '}
                  <a href="#/trash" onClick={() => setOpen(false)}>
                    휴지통
                  </a>
                </p>
              )}
              <Button
                onClick={() => {
                  setRenaming(item.id);
                  setNewName(item.name);
                }}
              >
                이름 바꾸기
              </Button>
              <Button
                onClick={() => {
                  setDeleted(item);
                  change({ ...state, saved: state.saved.filter((s) => s.id !== item.id) });
                  setStatus(
                    `“${item.name}” 작업 구성만 삭제했습니다. 원문과 공부 기록은 유지됩니다.`,
                  );
                }}
              >
                구성 삭제
              </Button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
export function WorkspaceStorageNotice({ controller }: { controller: StudyWorkspaceController }) {
  return controller.error ? (
    <div>
      <ErrorState message={controller.error} />
      <Button onClick={controller.retry}>저장 다시 시도</Button>
      <Button onClick={controller.reload}>다시 읽기</Button>
    </div>
  ) : null;
}
