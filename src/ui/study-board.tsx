import { useEffect, useRef, useState, type DragEvent } from 'react';
import type { AppState, Command } from '../domain/model';
import {
  BOARD_ID,
  freshBoard,
  boardContent,
  moveBoardCard,
  type BoardCard,
  type BoardContent,
} from '../domain/study-board';
import type { StudyRepository } from '../data/repository';
import {
  readBoardDraft,
  writeBoardDraft,
  clearBoardDraft,
  boardDraftKey,
} from '../data/study-board-draft';
import { archiveDamagedDraft } from '../data/draft-safety';
import { Button, Input, Textarea, Select, Modal } from './index';
import './study-board.css';
const errorText = (e: unknown) =>
  e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.';
export function StudyBoard({
  data,
  repository,
  onSaved,
  subjectIds,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (next: AppState) => void;
  subjectIds: string[];
}) {
  const saved = data.studyBoards?.find((b) => b.id === BOARD_ID && !b.deletedAt);
  const [boot] = useState(() => {
    const fallback = saved ? boardContent(saved) : freshBoard();
    try {
      const draft = readBoardDraft(data),
        same = draft && JSON.stringify(draft.content) === JSON.stringify(fallback);
      const conflict = draft && draft.baseVersion !== (saved?.version ?? 0) && !same;
      return {
        content: conflict ? fallback : (draft?.content ?? fallback),
        editor: conflict ? null : (draft?.editor ?? null),
        version: same ? (saved?.version ?? 0) : (draft?.baseVersion ?? saved?.version ?? 0),
        operation: same ? undefined : draft?.operation,
        blocked: Boolean(conflict),
        error: conflict
          ? '저장된 보드와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안을 사본으로 보관한 뒤 다시 열어 주세요.'
          : '',
      };
    } catch (e) {
      return {
        content: fallback,
        editor: null,
        version: saved?.version ?? 0,
        blocked: true,
        error: errorText(e),
        operation: undefined,
      };
    }
  });
  const [content, setContent] = useState(boot.content),
    [editor, setEditor] = useState<BoardCard | null>(boot.editor),
    [error, setError] = useState(boot.error),
    [blocked, setBlocked] = useState(boot.blocked);
  const version = useRef(boot.version),
    operation = useRef<Command | undefined>(boot.operation),
    current = useRef(content),
    editorRef = useRef(editor);
  current.current = content;
  editorRef.current = editor;
  const [pending, setPending] = useState(Boolean(boot.operation)),
    [composing, setComposing] = useState(false),
    [archived, setArchived] = useState(false),
    [query, setQuery] = useState('');
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [saveStatus, setSaveStatus] = useState(repository.getStatus?.());
  useEffect(() => repository.subscribe?.(() => setSaveStatus(repository.getStatus?.())), [repository]);
  const [columnEdit, setColumnEdit] = useState<{ id: string; title: string } | null>(null);
  const columnElements = useRef(new Map<string, HTMLElement>());
  const dragId = useRef<string | null>(null),
    [dropColumn, setDropColumn] = useState<string | null>(null);
  const ready =
    data.namespace !== 'personal' ||
    repository.getCapabilities?.().includes('saveStudyBoard') === true;
  const disabled = blocked || pending || !ready;
  const topics = data.nodes.filter(
    (n) => !n.deletedAt && n.role === 'topic' && subjectIds.includes(n.subjectId),
  );
  const draft = (next = current.current, nextEditor = editorRef.current) =>
    writeBoardDraft(data, {
      baseVersion: version.current,
      content: next,
      editor: nextEditor,
      ...(operation.current ? { operation: operation.current } : {}),
    });
  const changeEditor = (next: BoardCard | null) => {
    setEditor(next);
    editorRef.current = next;
    try {
      if (next || pending) draft(current.current, next);
      else clearBoardDraft(data);
      setError('');
    } catch (e) {
      setError(errorText(e));
    }
  };
  const save = (next: BoardContent) => {
    if (blocked || !ready) return false;
    setContent(next);
    current.current = next;
    operation.current ??= {
      type: 'saveStudyBoard',
      id: BOARD_ID,
      expectedVersion: version.current,
      content: next,
      userId: data.userId,
      namespace: data.namespace,
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
    };
    setPending(true);
    try {
      draft(next);
      const result = repository.execute(operation.current);
      const stored = result.studyBoards?.find((b) => b.id === BOARD_ID);
      if (!stored) throw Error('저장된 보드를 확인하지 못했습니다. 초안은 유지했습니다.');
      version.current = stored.version;
      operation.current = undefined;
      setPending(false);
      onSaved(result);
      setError('');
      try {
        if (editorRef.current) draft(next);
        else clearBoardDraft(data);
      } catch (e) {
        setError(`보드는 이 기기에 저장했습니다. 초안 정리를 다시 시도해 주세요. ${errorText(e)}`);
      }
      return true;
    } catch (e) {
      setError(`${errorText(e)} 카드와 글을 유지했습니다. 저장 다시 시도를 눌러 주세요.`);
      return false;
    }
  };
  useEffect(() => {
    if (saved && saved.version !== version.current && !pending && !editorRef.current) {
      version.current = saved.version;
      setContent(boardContent(saved));
      current.current = boardContent(saved);
    }
  }, [saved, pending]);
  const move = (cardId: string, colId: string, beforeId?: string) => {
    if (!disabled) save(moveBoardCard(current.current, cardId, colId, beforeId));
  };
  const drop = (e: DragEvent, columnId: string, beforeId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    const id = dragId.current;
    if (id && content.cards.some((c) => c.id === id)) move(id, columnId, beforeId);
    dragId.current = null;
    setDropColumn(null);
  };
  const revision = [...data.revisions]
    .reverse()
    .find(
      (r) =>
        r.collection === 'studyBoards' &&
        r.entityId === BOARD_ID &&
        r.after.version === version.current &&
        r.before,
    );
  const undo = () => {
    if (!revision || disabled) return;
    try {
      const result = repository.execute({
        type: 'undoRevision',
        revisionId: revision.id,
        expectedVersion: version.current,
        userId: data.userId,
        namespace: data.namespace,
        opId: crypto.randomUUID(),
        at: new Date().toISOString(),
      });
      const row = result.studyBoards?.find((b) => b.id === BOARD_ID);
      if (!row) throw Error('되돌린 보드를 확인하지 못했습니다.');
      version.current = row.version;
      setContent(boardContent(row));
      current.current = boardContent(row);
      onSaved(result);
      setError('');
    } catch (e) {
      setError(errorText(e));
    }
  };
  const cards = content.cards.filter(
    (c) =>
      c.archived === archived &&
      `${c.title} ${c.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const completeEditor = () => {
    if (!editor || composing || disabled) return;
    if (!editor.title.trim()) {
      setError('카드에 할 일을 적어 주세요.');
      return;
    }
    const next = {
      ...content,
      cards: content.cards.some((c) => c.id === editor.id)
        ? content.cards.map((c) => (c.id === editor.id ? editor : c))
        : [...content.cards, editor],
    };
    // Keep the editor until the exact operation succeeds; retry cannot create a second card.
    if (save(next)) changeEditor(null);
  };
  return (
    <section className="study-board" aria-label="칸반보드">
      <div className="board-toolbar">
        <h2>{content.title}</h2>
        <Input
          label="카드 찾기"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisibleCounts({}); }}
        />
        <Button
          disabled={disabled || Boolean(editor)}
          onClick={() => setColumnEdit({ id: crypto.randomUUID(), title: '' })}
        >
          열 추가
        </Button>
        <Button disabled={disabled || !revision || Boolean(editor)} onClick={undo}>
          되돌리기
        </Button>
        <Button aria-pressed={archived} onClick={() => { setArchived(!archived); setVisibleCounts({}); }}>
          {archived
            ? '보드로 돌아가기'
            : `보관한 카드 ${content.cards.filter((c) => c.archived).length}개`}
        </Button>
        <Select label="열로 이동" value="" onChange={(e) => columnElements.current.get(e.target.value)?.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'smooth' })}>
          <option value="">열 선택</option>
          {content.columns.map((col) => <option key={col.id} value={col.id}>{col.title}</option>)}
        </Select>
        <a href="#/graph">관계 살펴보기 ↗</a>
      </div>
      {saveStatus && <div className="board-save-state" role="status">
        {saveStatus.message}
        {saveStatus.phase === 'error' && <Button onClick={() => { void repository.flush?.(); }}>서버 저장 다시 시도</Button>}
      </div>}
      {error && (
        <div role="alert" className="board-error">
          <p>{error}</p>
          {pending && (
            <Button
              onClick={() => {
                if (
                  save(current.current) &&
                  editorRef.current &&
                  current.current.cards.some(
                    (c) => JSON.stringify(c) === JSON.stringify(editorRef.current),
                  )
                )
                  changeEditor(null);
              }}
            >
              저장 다시 시도
            </Button>
          )}
          {blocked && (
            <Button
              onClick={() => {
                try {
                  archiveDamagedDraft(boardDraftKey(data), '칸반보드 초안의 원문과 수정 충돌 보관');
                  clearBoardDraft(data);
                  setBlocked(false);
                  setError('');
                } catch (e) {
                  setError(errorText(e));
                }
              }}
            >
              초안 사본 보관 후 보드 열기
            </Button>
          )}
        </div>
      )}
      {!ready && (
        <p role="status">
          보드 저장 연결을 확인하지 못했습니다. 작성한 내용은 이 기기의 초안에 남아 있습니다.
        </p>
      )}
      <section className="board-columns" aria-label={archived ? '보관한 카드 목록' : '공부 보드'}>
        {content.columns.map((col) => {
          const list = cards.filter((c) => c.columnId === col.id);
          return (
            <section
              key={col.id}
              ref={(element) => { if (element) columnElements.current.set(col.id, element); else columnElements.current.delete(col.id); }}
              className={`board-column${dropColumn === col.id ? ' is-drop-target' : ''}`}
              aria-label={`${col.title} 열`}
              onDragOver={(e) => {
                if (dragId.current && !disabled) {
                  e.preventDefault();
                  setDropColumn(col.id);
                }
              }}
              onDrop={(e) => drop(e, col.id)}
            >
              <header>
                <h3 title={col.title}>
                  {col.title} <span>{list.length}</span>
                </h3>
                <Button
                  variant="quiet"
                  aria-label={`${col.title} 열 이름 바꾸기`}
                  disabled={disabled || Boolean(editor)}
                  onClick={() => setColumnEdit(col)}
                >
                  ···
                </Button>
              </header>
              {/* biome-ignore lint/a11y/noNoninteractiveTabindex: The named scroll region needs keyboard scrolling. */}
              <section className="board-card-list" tabIndex={0} aria-label={`${col.title} 카드 목록`}>
                {list.slice(0, visibleCounts[col.id] ?? 40).map((card, index) => {
                  const topic = data.nodes.find((n) => n.id === card.topicId),
                    topicActive =
                      topic &&
                      !topic.deletedAt &&
                      !data.subjects.find((s) => s.id === topic.subjectId)?.deletedAt;
                  return (
                    <article
                      key={card.id}
                      className="board-card"
                      aria-label={`카드 ${card.title}`}
                      onDragOver={(e) => {
                        if (dragId.current && !disabled) e.preventDefault();
                      }}
                      onDrop={(e) => drop(e, col.id, card.id)}
                    >
                      <div className="board-card-heading">
                        <button
                          type="button"
                          className="board-drag"
                          aria-label={`${card.title} 끌어 옮기기`}
                          draggable={!disabled && !archived}
                          disabled={disabled || archived}
                          onDragStart={(e) => {
                            dragId.current = card.id;
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', card.id);
                          }}
                          onDragEnd={() => {
                            dragId.current = null;
                            setDropColumn(null);
                          }}
                        >
                          ⠿
                        </button>
                        <Button
                          variant="quiet"
                          disabled={disabled}
                          onClick={() => changeEditor(card)}
                        >
                          <span className="board-card-title" title={card.title}>{card.title}</span>
                        </Button>
                      </div>
                      {card.body && <p className="board-card-preview">{card.body}</p>}
                      {card.body && <Button variant="quiet" disabled={disabled} onClick={() => changeEditor(card)}>글 전체 보기</Button>}
                      {topic &&
                        (topicActive ? (
                          <a href={`#/node/${encodeURIComponent(topic.id)}`}>{topic.name} ↗</a>
                        ) : (
                          <span className="board-topic">{topic.name} · 휴지통</span>
                        ))}
                      <details className="board-card-menu">
                        <summary>카드 이동·보관</summary>
                        <Select
                          label={`${card.title} 옮길 열`}
                          value={card.columnId}
                          disabled={disabled}
                          onChange={(e) => move(card.id, e.target.value)}
                        >
                          {content.columns.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </Select>
                        <div className="board-card-actions">
                          <Button
                            aria-label={`${card.title} 위로`}
                            disabled={disabled || index === 0 || Boolean(query)}
                            onClick={() => move(card.id, col.id, list[index - 1]?.id)}
                          >
                            위로
                          </Button>
                          <Button
                            aria-label={`${card.title} 아래로`}
                            disabled={disabled || index === list.length - 1 || Boolean(query)}
                            onClick={() => {
                              const all = content.cards.filter(
                                (c) => c.columnId === col.id && c.archived === archived,
                              );
                              const following = all[all.findIndex((c) => c.id === card.id) + 2];
                              move(card.id, col.id, following?.id);
                            }}
                          >
                            아래로
                          </Button>
                          <Button
                            disabled={disabled}
                            onClick={() =>
                              save({
                                ...content,
                                cards: content.cards.map((c) =>
                                  c.id === card.id ? { ...c, archived: !c.archived } : c,
                                ),
                              })
                            }
                          >
                            {archived ? '보드로 복원' : '카드 보관'}
                          </Button>
                        </div>
                      </details>
                    </article>
                  );
                })}
                {list.length > (visibleCounts[col.id] ?? 40) && <Button onClick={() => setVisibleCounts((old) => ({ ...old, [col.id]: (old[col.id] ?? 40) + 40 }))}>
                  다음 카드 보기 · {list.length - (visibleCounts[col.id] ?? 40)}개 남음
                </Button>}
                {!list.length && (
                  <p className="board-empty">
                    {query
                      ? '찾는 카드가 없습니다.'
                      : archived
                        ? '보관한 카드가 없습니다.'
                        : '할 일을 하나씩 놓아 보세요.'}
                  </p>
                )}
              </section>
              {!archived && (
                <Button
                  variant="quiet"
                  disabled={disabled}
                  onClick={() =>
                    changeEditor({
                      id: crypto.randomUUID(),
                      columnId: col.id,
                      title: '',
                      body: '',
                      topicId: null,
                      archived: false,
                    })
                  }
                >
                  + {col.title}에 카드 추가
                </Button>
              )}
            </section>
          );
        })}
      </section>
      <p className="board-help">
        끌어 옮기거나 ‘카드 이동·보관’에서 순서를 바꿀 수 있습니다. 보드의 상태는 공부 기록과 별도로
        남습니다.
      </p>
      <Modal
        open={Boolean(editor)}
        title={editor && content.cards.some((c) => c.id === editor.id) ? '카드 편집' : '카드 추가'}
        onClose={() => {
          if (!composing && !pending) changeEditor(null);
        }}
      >
        {editor && (
          <div
            className="board-editor"
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
          >
            <Input
              label="할 일"
              disabled={pending}
              autoFocus
              value={editor.title}
              maxLength={1000}
              data-editing-context={`board:${editor.id}:title`}
              onChange={(e) => changeEditor({ ...editor, title: e.target.value })}
            />
            <Textarea
              disabled={pending}
              label="메모 (선택)"
              rows={6}
              value={editor.body}
              maxLength={200000}
              data-editing-context={`board:${editor.id}:body`}
              onChange={(e) => changeEditor({ ...editor, body: e.target.value })}
            />
            <Select
              disabled={pending}
              label="연결할 주제 (선택)"
              value={editor.topicId ?? ''}
              onChange={(e) => changeEditor({ ...editor, topicId: e.target.value || null })}
            >
              <option value="">자유 카드</option>
              {editor.topicId && !topics.some((n) => n.id === editor.topicId) && (
                <option value={editor.topicId}>
                  {data.nodes.find((n) => n.id === editor.topicId)?.name ?? '원래 연결한 주제'}{' '}
                  (현재 범위 밖)
                </option>
              )}
              {topics.map((n) => (
                <option value={n.id} key={n.id}>
                  {data.subjects.find((s) => s.id === n.subjectId)?.name} / {n.name}
                </option>
              ))}
            </Select>
            <Select
              disabled={pending}
              label="놓을 열"
              value={editor.columnId}
              onChange={(e) => changeEditor({ ...editor, columnId: e.target.value })}
            >
              {content.columns.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
            <div className="board-card-actions">
              <Button
                variant="primary"
                disabled={disabled || composing || !editor.title.trim()}
                onClick={completeEditor}
              >
                카드 저장
              </Button>
              <Button disabled={pending || composing} onClick={() => changeEditor(null)}>
                취소
              </Button>
            </div>
            {error && <p role="alert">{error}</p>}
            {pending && (
              <Button
                onClick={() => {
                  if (save(current.current)) changeEditor(null);
                }}
              >
                카드 저장 다시 시도
              </Button>
            )}
          </div>
        )}
      </Modal>
      <Modal
        open={Boolean(columnEdit)}
        title="보드 열"
        onClose={() => {
          if (!composing) setColumnEdit(null);
        }}
      >
        {columnEdit && (
          <div
            className="board-editor"
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
          >
            <Input
              label="열 이름"
              disabled={pending}
              value={columnEdit.title}
              maxLength={1000}
              onChange={(e) => setColumnEdit({ ...columnEdit, title: e.target.value })}
            />
            <Button
              variant="primary"
              disabled={disabled || composing || !columnEdit.title.trim()}
              onClick={() => {
                const next = {
                  ...content,
                  columns: content.columns.some((c) => c.id === columnEdit.id)
                    ? content.columns.map((c) => (c.id === columnEdit.id ? columnEdit : c))
                    : [...content.columns, columnEdit],
                };
                if (save(next)) setColumnEdit(null);
              }}
            >
              열 저장
            </Button>
            {content.columns.some((c) => c.id === columnEdit.id) && (
              <Button
                disabled={
                  disabled ||
                  composing ||
                  content.columns.length <= 1 ||
                  content.cards.some((c) => c.columnId === columnEdit.id)
                }
                onClick={() => {
                  if (
                    save({
                      ...content,
                      columns: content.columns.filter((c) => c.id !== columnEdit.id),
                    })
                  )
                    setColumnEdit(null);
                }}
              >
                빈 열 지우기
              </Button>
            )}
            <p>카드가 있는 열은 이름을 바꾸거나 카드를 옮겨 정리할 수 있습니다.</p>
          </div>
        )}
      </Modal>
    </section>
  );
}
