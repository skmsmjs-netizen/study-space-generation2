import { MemoryCardOrigin } from './material-card-library';
import { PerformanceFromSource } from './performance-from-source';
import { useEffect, useRef, useState } from 'react';
import type { AppState, MemoStroke } from '../domain/model';
import { MEMO_HEIGHT, MEMO_WIDTH, memoPath } from '../domain/memo';
import {
  memoryCardsInScope,
  memoryQuestions,
  memorySummary,
  type MemoryQuestion,
  type MemoryTest,
  type MemoryVerdict,
} from '../domain/memory-test';
import {
  freshMemoryDraft,
  memoryDraftKey,
  readMemoryDraft,
  saveMemoryAttempt,
  saveMemoryEditor,
  writeMemoryDraft,
  type MemoryDraft,
} from '../data/memory-test';
import { archiveDamagedDraft, clearStoredDraft, draftHasUnstoredText } from '../data/draft-safety';
import type { StudyRepository } from '../data/repository';
import { Button, EmptyState, Select, Textarea } from './index';
import { MemoInkPad } from './memo-ink-pad';
import './memory-test.css';

const message = (e: unknown) =>
  e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.';
const verdicts: { value: MemoryVerdict; label: string }[] = [
  { value: 'correct', label: '맞음' },
  { value: 'partial', label: '부분적으로 맞음' },
  { value: 'wrong', label: '틀림' },
  { value: 'uncertain', label: '판단 보류' },
  { value: null, label: '미판정' },
];
function Ink({ strokes, label }: { strokes: MemoStroke[]; label: string }) {
  return strokes.length ? (
    <svg
      className="memory-ink"
      viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`}
      role="img"
      aria-label={label}
    >
      {strokes.map((s) => (
        <path
          key={s.id}
          d={memoPath(s.points)}
          stroke={
            {
              ink: 'var(--color-text)',
              blue: 'var(--color-hierarchy-outline)',
              green: 'var(--color-memo-green)',
            }[s.ink]
          }
          strokeWidth={s.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  ) : null;
}
function Summary({ questions }: { questions: MemoryQuestion[] }) {
  const s = memorySummary(questions);
  return (
    <p className="memory-summary">
      직접 비교한 결과 · 맞음 {s.correct} · 부분적으로 맞음 {s.partial} · 틀림 {s.wrong} · 판단 보류{' '}
      {s.uncertain} · 미판정 {s.unassessed}
    </p>
  );
}
export function MemoryTests({
  data,
  repository,
  subjectIds,
  onSaved,
  initialTopicId,
  resultId,
}: {
  data: AppState;
  repository: StudyRepository;
  subjectIds: string[];
  onSaved: (data: AppState) => void;
  initialTopicId?: string;
  resultId?: string;
}) {
  const [boot] = useState(() => {
    let key = '';
    try {
      key = memoryDraftKey(data);
      return { key, ...readMemoryDraft(key), error: '' };
    } catch (e) {
      return { key, raw: null, draft: null, error: message(e) };
    }
  });
  const [draft, setDraft] = useState<MemoryDraft>(boot.draft ?? freshMemoryDraft(initialTopicId));
  const current = useRef(draft),
    raw = useRef(boot.raw),
    blockedRef = useRef(Boolean(boot.error));
  const [blocked, setBlocked] = useState(Boolean(boot.error)),
    [error, setError] = useState(boot.error),
    [notice, setNotice] = useState('');
  const [composing, setComposing] = useState(false),
    [drawing, setDrawing] = useState(false),
    [history, setHistory] = useState<MemoryTest | null>(() => data.memoryTests?.find(t => t.id === resultId && !t.deletedAt) ?? null);
  const heading = useRef<HTMLHeadingElement>(null);
  const subjects = data.subjects.filter((s) => subjectIds.includes(s.id) && !s.deletedAt);
  const topics = data.nodes.filter(
    (n) =>
      n.role === 'topic' &&
      !n.deletedAt &&
      subjects.some((s) => s.id === n.subjectId) &&
      (!draft.subjectId || draft.subjectId === n.subjectId),
  );
  const cards = memoryCardsInScope(data, subjectIds, draft.subjectId, draft.topicId);
  const capability =
    !repository.getCapabilities ||
    ['saveMemoryCard', 'saveMemoryTest'].every((type) =>
      repository.getCapabilities?.().includes(type),
    );
  const busy = composing || drawing || blocked;
  const persist = (next: MemoryDraft) => {
    if (blockedRef.current) return false;
    current.current = next;
    setDraft(next);
    setNotice('');
    try {
      raw.current = writeMemoryDraft(boot.key, next, raw.current);
      setError('');
      return true;
    } catch (e) {
      if (message(e).includes('다른 창')) {
        blockedRef.current = true;
        setBlocked(true);
      } else raw.current = JSON.stringify(next);
      setError(
        `${message(e)}${draftHasUnstoredText(boot.key) ? ' 최신 입력은 현재 창에 유지했습니다. 저장을 다시 시도하거나 파일로 보관해 주세요.' : ''}`,
      );
      return false;
    }
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: Move focus on phase or question changes, never while typing an answer.
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [draft.phase, draft.attempt?.index]);
  const saveEditor = () => {
    if (busy || !current.current.editor) return;
    if (!persist(current.current)) return;
    try {
      const next = saveMemoryEditor(repository, current.current.editor);
      onSaved(next);
      if (persist({ ...current.current, editor: null }))
        setNotice('암기 항목을 이 기기에 저장했습니다.');
    } catch (e) {
      setError(message(e));
    }
  };
  const patchEditor = (patch: Partial<NonNullable<MemoryDraft['editor']>>) => {
    const now = current.current;
    if (now.editor) persist({ ...now, editor: { ...now.editor, ...patch } });
  };
  const patchQuestion = (index: number, patch: Partial<MemoryQuestion>) => {
    const now = current.current;
    if (!now.attempt) return;
    persist({
      ...now,
      attempt: {
        ...now.attempt,
        questions: now.attempt.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
      },
    });
  };
  const start = (questions?: MemoryQuestion[]) => {
    if (busy || draft.editor) return;
    try {
      const selected = questions ?? memoryQuestions(data, cards, draft.count);
      if (!selected.length) return;
      setHistory(null);
      persist({
        ...current.current,
        phase: 'testing',
        attempt: {
          id: crypto.randomUUID(),
          startedAt: new Date().toISOString(),
          endedAt: null,
          questions: structuredClone(
            selected.map((q) => ({ ...q, response: '', responseStrokes: [], verdict: null })),
          ),
          index: 0,
        },
      });
    } catch (e) {
      setError(message(e));
    }
  };
  const saveTest = () => {
    if (busy || !current.current.attempt || !persist(current.current)) return;
    try {
      onSaved(saveMemoryAttempt(repository, current.current.attempt));
      if (persist({ ...current.current, phase: 'saved' }))
        setNotice('시험 결과를 이 기기에 저장했습니다.');
    } catch (e) {
      setError(message(e));
    }
  };
  const exportDraft = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = '암기시험-초안.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const savedTests = (data.memoryTests ?? [])
    .filter(
      (t) =>
        !t.deletedAt &&
        t.questions.some((q) =>
          data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId)),
        ),
    )
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const attempt = draft.attempt,
    question = attempt?.questions[attempt.index];
  const library = () => {
    if (!busy) {
      setHistory(null);
      persist({ ...current.current, phase: 'library', attempt: null });
    }
  };
  const review =
    history?.questions ??
    (draft.phase === 'review' || draft.phase === 'saved' ? attempt?.questions : undefined);
  return (
    <section
      className="memory-tests"
      aria-label="암기시험"
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
    >
      {error && (
        <div role="alert">
          <p>{error}</p>
          <div className="actions">
            {!blocked && (
              <Button onClick={() => persist(current.current)}>초안 저장 다시 시도</Button>
            )}
            <Button disabled={drawing || composing} onClick={exportDraft}>
              현재 초안 파일로 보관
            </Button>
            {blocked && boot.error && boot.key && (
              <Button
                onClick={() => {
                  try {
                    archiveDamagedDraft(boot.key, '암기시험 초안 원문 보관');
                    clearStoredDraft(boot.key);
                    raw.current = null;
                    blockedRef.current = false;
                    setBlocked(false);
                    persist(freshMemoryDraft(initialTopicId));
                  } catch (e) {
                    setError(message(e));
                  }
                }}
              >
                원문 보관 후 새로 시작
              </Button>
            )}
            <a href="#/draft-archives">초안 보관본</a>
          </div>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {!capability && (
        <p role="status">
          현재 연결에서는 암기 항목과 시험 결과를 서버에 전송할 수 없습니다. 작성한 초안은 이 기기에
          보관됩니다.
        </p>
      )}
      {draft.phase === 'library' && !history && (
        <>
          <p className="muted">
            외워서 꺼내 보고 싶은 것만 등록해 두세요. 답안은 글이나 펜으로 남길 수 있습니다.
          </p>
          <div className="memory-filters">
            <Select
              label="시험 과목"
              value={draft.subjectId}
              disabled={busy || Boolean(draft.editor)}
              onChange={(e) => persist({ ...draft, subjectId: e.target.value, topicId: '' })}
            >
              <option value="">현재 범위 전체</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select
              label="시험 주제"
              value={draft.topicId}
              disabled={busy || Boolean(draft.editor)}
              onChange={(e) => persist({ ...draft, topicId: e.target.value })}
            >
              <option value="">선택한 과목의 모든 주제</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Select
              label="문항 수"
              value={draft.count}
              disabled={busy}
              onChange={(e) => persist({ ...draft, count: Number(e.target.value) })}
            >
              {[1, 3, 5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}개
                </option>
              ))}
            </Select>
          </div>
          <div className="actions">
            <Button
              variant="primary"
              disabled={busy || !cards.length || Boolean(draft.editor)}
              onClick={() => start()}
            >
              쪽지시험 시작
            </Button>
            <Button
              disabled={busy || !topics.length || Boolean(draft.editor)}
              onClick={() =>
                persist({
                  ...draft,
                  editor: {
                    id: crypto.randomUUID(),
                    baseVersion: 0,
                    topicId: draft.topicId || topics[0]?.id || '',
                    question: '',
                    answer: '',
                    strokes: [],
                  },
                })
              }
            >
              암기 항목 등록
            </Button>
            <a href="#/material-cards">자료에서 카드 가져오기</a>
            <span className="muted">
              등록 {cards.length}개 · 이번 시험 {Math.min(cards.length, draft.count)}문항
            </span>

          </div>

          {draft.editor && (
            <div className="memory-editor">
              <h2>암기 항목</h2>
              <Select
                label="항목을 연결할 주제"
                value={draft.editor.topicId}
                disabled={busy || draft.editor.baseVersion > 0}
                onChange={(e) => patchEditor({ topicId: e.target.value })}
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
                {!topics.some((t) => t.id === draft.editor?.topicId) && draft.editor.topicId && (
                  <option value={draft.editor.topicId}>현재 범위 밖의 주제</option>
                )}
              </Select>
              <Textarea
                label="질문·개념"
                hint="예: 커패시터에 저장되는 에너지의 식을 쓰시오."
                value={draft.editor.question}
                disabled={blocked}
                onChange={(e) => patchEditor({ question: e.target.value })}
                rows={2}
              />
              <Textarea
                label="기준 답안·조건"
                hint="수식은 아래에 펜으로 써도 됩니다."
                value={draft.editor.answer}
                disabled={blocked}
                onChange={(e) => patchEditor({ answer: e.target.value })}
                rows={3}
              />
              <MemoInkPad
                key={draft.editor.id}
                label="기준 답안 스케치"
                drawingLabel="기준 답안 필기 영역"
                title="기준 답안"
                strokes={draft.editor.strokes}
                onChange={(strokes) => patchEditor({ strokes })}
                onDrawing={setDrawing}
                disabled={blocked}
              />
              <div className="actions">
                <Button variant="primary" disabled={busy || !capability} onClick={saveEditor}>
                  항목 저장
                </Button>
                <Button
                  disabled={busy}
                  onClick={() => {
                    try {
                      archiveDamagedDraft(boot.key, '암기 항목 편집 취소 전 원문');
                      persist({ ...draft, editor: null });
                    } catch (e) {
                      setError(message(e));
                    }
                  }}
                >
                  편집 취소
                </Button>
              </div>
            </div>
          )}
          {!topics.length && (
            <EmptyState title="암기 항목을 연결할 주제를 넣어 주세요">
              <a href="#/subjects">과목과 목차 입력</a>
            </EmptyState>
          )}
          {!!topics.length && !cards.length && !draft.editor && (
            <EmptyState
              title="첫 암기 항목을 등록해 보세요"
              message="질문 하나와 글·그림 답안부터 시작할 수 있습니다."
            />
          )}
          <div className="memory-card-list">
            {cards.map((c) => (
              <article key={c.id}>
                <div>
                  <strong className="prose">{c.question}</strong>
                  <MemoryCardOrigin data={data} card={c} />
                  <p className="muted">{data.nodes.find((n) => n.id === c.topicId)?.name}</p>
                </div>
                <Button
                  disabled={busy || Boolean(draft.editor)}
                  onClick={() =>
                    persist({
                      ...draft,
                      editor: {
                        id: c.id,
                        baseVersion: c.version,
                        topicId: c.topicId,
                        question: c.question,
                        answer: c.answer,
                        strokes: structuredClone(c.strokes),
                        ...(c.materialSource ? { materialSource: structuredClone(c.materialSource) } : {}),
                      },
                    })
                  }
                >
                  항목 편집
                </Button>
              </article>
            ))}
          </div>
          {(data.memoryCards ?? []).some((c) => c.deletedAt) && (
            <details>
              <summary>보관한 암기 항목</summary>
              {(data.memoryCards ?? [])
                .filter(
                  (c) =>
                    c.deletedAt &&
                    data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId)),
                )
                .map((c) => (
                  <article key={c.id}>
                    <p>{c.question}</p>
                    <Button
                      disabled={busy || !capability}
                      onClick={() => {
                        try {
                          onSaved(
                            repository.execute({
                              type: 'restoreMemoryCard',
                              id: c.id,
                              expectedVersion: c.version,
                              userId: data.userId,
                              namespace: data.namespace,
                              opId: crypto.randomUUID(),
                              at: new Date().toISOString(),
                            }),
                          );
                        } catch (e) {
                          setError(message(e));
                        }
                      }}
                    >
                      복원
                    </Button>
                  </article>
                ))}
            </details>
          )}
          {draft.editor && draft.editor.baseVersion > 0 && (
            <details>
              <summary>항목 보관</summary>
              <p>질문·답안·수정 이력과 지난 시험은 남아 있습니다. 복원할 수 있습니다.</p>
              <Button
                disabled={busy || !capability}
                onClick={() => {
                  try {
                    const editor = current.current.editor;
                    if (!editor || !persist(current.current)) return;
                    archiveDamagedDraft(boot.key, '암기 항목 보관 전 편집 초안');
                    onSaved(
                      repository.execute({
                        type: 'trashMemoryCard',
                        id: editor.id,
                        expectedVersion: editor.baseVersion,
                        userId: data.userId,
                        namespace: data.namespace,
                        opId: crypto.randomUUID(),
                        at: new Date().toISOString(),
                      }),
                    );
                    persist({ ...draft, editor: null });
                  } catch (e) {
                    setError(message(e));
                  }
                }}
              >
                항목 보관
              </Button>
            </details>
          )}
          {!!savedTests.length && (
            <details className="memory-history">
              <summary>지난 시험 {savedTests.length}회</summary>
              {savedTests.map((t) => (
                <article key={t.id}>
                  <p>
                    {new Date(t.startedAt).toLocaleString('ko-KR')} · {t.questions.length}문항
                  </p>
                  <Summary questions={t.questions} />
                  <Button disabled={busy || Boolean(draft.editor)} onClick={() => setHistory(t)}>
                    답안과 결과 보기
                  </Button>
                </article>
              ))}
            </details>
          )}
        </>
      )}
      {draft.phase === 'testing' && question && attempt && (
        <>
          <h2 ref={heading} tabIndex={-1}>
            {attempt.index + 1} / {attempt.questions.length} 문항
          </h2>
          <p className="muted">{question.topicName}</p>
          <p className="memory-question">{question.question}</p>
          <Textarea
            label="내 답안"
            value={question.response}
            disabled={blocked}
            onChange={(e) => patchQuestion(attempt.index, { response: e.target.value })}
            rows={4}
          />
          <MemoInkPad
            key={`${attempt.id}:${attempt.index}`}
            label="내 답안 스케치"
            drawingLabel="내 답안 필기 영역"
            title="내 답안"
            strokes={question.responseStrokes}
            onChange={(responseStrokes) => {
              const active = current.current.attempt;
              if (active) patchQuestion(active.index, { responseStrokes });
            }}
            onDrawing={setDrawing}
            disabled={blocked}
          />
          <div className="actions">
            <Button
              disabled={busy || attempt.index === 0}
              onClick={() =>
                persist({ ...draft, attempt: { ...attempt, index: attempt.index - 1 } })
              }
            >
              이전 문항
            </Button>
            {attempt.index < attempt.questions.length - 1 ? (
              <Button
                variant="primary"
                disabled={busy}
                onClick={() =>
                  persist({ ...draft, attempt: { ...attempt, index: attempt.index + 1 } })
                }
              >
                다음 문항
              </Button>
            ) : (
              <Button
                variant="primary"
                disabled={busy}
                onClick={() =>
                  persist({
                    ...draft,
                    phase: 'review',
                    attempt: { ...attempt, endedAt: new Date().toISOString() },
                  })
                }
              >
                시험 마치고 답안 비교
              </Button>
            )}
            <Button
              variant="quiet"
              disabled={busy}
              onClick={() => {
                try {
                  if (!persist(current.current)) return;
                  archiveDamagedDraft(boot.key, '암기시험 중단 전 답안 원문');
                  library();
                } catch (e) {
                  setError(message(e));
                }
              }}
            >
              답안 보관하고 그만두기
            </Button>
          </div>
          <p className="muted">
            다른 화면으로 이동해도 답안은 초안에 남습니다. 답하지 않은 문항은 미판정으로 유지됩니다.
          </p>
        </>
      )}
      {review && (
        <>
          <h2 ref={heading} tabIndex={-1}>
            답안 비교
          </h2>
          <Summary questions={review} />
          {review.map((q, index) => (
            <article className="memory-review" key={q.cardId}>
              <h3>
                {index + 1}. {q.question}
              </h3>
              <p className="muted">{q.topicName} · 출제 당시의 기준 답안</p>
              <div className="memory-comparison">
                <section aria-label={`${index + 1}번 내 답안`}>
                  <strong>내 답안</strong>
                  <p className="prose">
                    {q.response || (!q.responseStrokes.length ? '답하지 않음' : '')}
                  </p>
                  <Ink strokes={q.responseStrokes} label="내 답안 그림" />
                </section>
                <section aria-label={`${index + 1}번 기준 답안`}>
                  <strong>기준 답안</strong>
                  <p className="prose">{q.answer}</p>
                  <Ink strokes={q.strokes} label="기준 답안 그림" />
                </section>
              </div>
              {draft.phase === 'review' && !history ? (
                <Select
                  label={`${index + 1}번 비교 결과`}
                  value={q.verdict ?? ''}
                  disabled={busy}
                  onChange={(e) =>
                    patchQuestion(index, { verdict: (e.target.value || null) as MemoryVerdict })
                  }
                >
                  {verdicts.map((v) => (
                    <option
                      key={v.label}
                      value={v.value ?? ''}
                      disabled={
                        ['correct', 'partial', 'wrong'].includes(v.value ?? '') &&
                        !q.response.trim() &&
                        !q.responseStrokes.length
                      }
                    >
                      {v.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <p>비교 결과 · {verdicts.find((v) => v.value === q.verdict)?.label}</p>
              )}
              {(history || draft.phase === "saved") && <PerformanceFromSource data={data} repository={repository} onSaved={onSaved} kind="memory-question" id={history?.id ?? attempt!.id} itemId={q.cardId} />}
            </article>
          ))}
          <div className="actions">
            {draft.phase === 'review' && !history && (
              <Button variant="primary" disabled={busy || !capability} onClick={saveTest}>
                시험 결과 저장
              </Button>
            )}
            {(draft.phase === 'saved' || history) && (
              <>
                <Button disabled={busy} onClick={library}>
                  암기 항목으로 돌아가기
                </Button>
                <Button
                  disabled={
                    busy || !review.some((q) => q.verdict === 'wrong' || q.verdict === 'partial')
                  }
                  onClick={() =>
                    start(review.filter((q) => q.verdict === 'wrong' || q.verdict === 'partial'))
                  }
                >
                  틀리거나 부분적으로 맞은 문항 다시 시험
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}
