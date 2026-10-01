import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import {
  EXAM_MEMO_PREFIX,
  freshExamPractice,
  practiceDraftKey,
  practiceElapsed,
  readPracticeDraft,
  writePracticeDraft,
  clearPracticeDraft,
  preservePracticeDraft,
  savePracticeMemo,
  repeatExamPractice,
  type ExamPracticeDraft,
} from '../data/exam-practice';
import { Button, EmptyState, Select, Textarea } from './index';
import './exam-practice.css';

const message = (e: unknown) =>
  e instanceof Error ? e.message : '저장하지 못했습니다. 입력한 내용은 유지했습니다.';
const clock = (ms: number) =>
  `${Math.floor(ms / 60000)
    .toString()
    .padStart(2, '0')}:${(Math.floor(ms / 1000) % 60).toString().padStart(2, '0')}`;
export function ExamPractice({
  data,
  repository,
  onSaved,
  subjectIds,
  initialTopicId,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (next: AppState) => void;
  subjectIds: string[];
  initialTopicId?: string;
}) {
  const [boot] = useState(() => {
    let key = '';
    try {
      key = practiceDraftKey(data);
      const stored = readPracticeDraft(key);
      return { key, ...stored, error: '' };
    } catch (e) {
      return { key, raw: null, draft: null, error: message(e) };
    }
  });
  const [draft, setDraft] = useState<ExamPracticeDraft>(
    () => boot.draft ?? freshExamPractice(initialTopicId),
  );
  const raw = useRef(boot.raw),
    [error, setError] = useState(boot.error),
    [blocked, setBlocked] = useState(Boolean(boot.error));
  const [now, setNow] = useState(Date.now()),
    [notice, setNotice] = useState(''),
    [composing, setComposing] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const subjects = data.subjects.filter((row) => !row.deletedAt && subjectIds.includes(row.id));
  const topics = data.nodes.filter(
    (row) =>
      !row.deletedAt &&
      row.role === 'topic' &&
      subjects.some((subject) => subject.id === row.subjectId),
  );
  const topic = data.nodes.find((row) => row.id === draft.topicId && !row.deletedAt);
  const ready =
    data.namespace === 'demo' ||
    !repository.getCapabilities ||
    repository.getCapabilities().includes('saveMemo');
  const elapsed = practiceElapsed(draft, now),
    expired = draft.minutes > 0 && elapsed >= draft.minutes * 60000;
  useEffect(() => {
    if (draft.phase !== 'running') return;
    const tick = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(tick);
  }, [draft.phase]);
  useEffect(() => {
    if (draft.phase !== 'setup') heading.current?.focus({ preventScroll: true });
  }, [draft.phase]);
  const persist = (next: ExamPracticeDraft) => {
    if (blocked) return false;
    setDraft(next);
    setNow(Date.now());
    setNotice('');
    try {
      raw.current = writePracticeDraft(boot.key, next, raw.current);
      setError('');
      return true;
    } catch (e) {
      if (message(e).includes('다른 창')) setBlocked(true);
      else raw.current = JSON.stringify(next);
      setError(message(e));
      return false;
    }
  };
  const start = () => {
    if (!topic || composing) return;
    const at = Date.now();
    persist({
      ...draft,
      topicName: topic.name,
      phase: 'running',
      startedAt: new Date(at).toISOString(),
      runningSince: at,
    });
  };
  const pause = () =>
    persist({ ...draft, phase: 'paused', elapsedMs: practiceElapsed(draft), runningSince: null });
  const finish = () =>
    persist({
      ...draft,
      phase: 'review',
      elapsedMs: practiceElapsed(draft),
      runningSince: null,
      endedAt: new Date().toISOString(),
    });
  const save = (separate = false) => {
    if (composing || blocked) return;
    const next = separate ? { ...draft, id: EXAM_MEMO_PREFIX + crypto.randomUUID() } : draft;
    if (!persist(next)) return;
    try {
      const snapshot = savePracticeMemo(repository, next, !topic);
      onSaved(snapshot);
      // Mark the durable identity so a failed cleanup/reload cannot create another memo.
      persist({ ...next, phase: 'saved' });
      setNotice('연습 기록을 메모에 남겼습니다.');
    } catch (e) {
      setError(message(e));
    }
  };
  const restart = () => {
    try {
      clearPracticeDraft(boot.key, raw.current);
      raw.current = null;
      setDraft(freshExamPractice(topic?.id));
      setNotice('');
      setError('');
    } catch (e) {
      setError(message(e));
    }
  };
  const history = (data.memos ?? [])
    .filter(
      (memo) =>
        !memo.deletedAt &&
        memo.id.startsWith(EXAM_MEMO_PREFIX) &&
        (memo.ownerId === null || topics.some((row) => row.id === memo.ownerId)),
    )
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const repeat = (memo: (typeof history)[number]) => {
    if (blocked || composing || !['setup', 'saved'].includes(draft.phase)) return;
    if (draft.phase === 'setup' && draft.answer) {
      setError('작성 중인 연습을 먼저 마쳐 주세요. 현재 내용은 유지했습니다.');
      return;
    }
    try {
      persist(repeatExamPractice(memo));
    } catch (e) {
      setError(message(e));
    }
  };
  return (
    <section
      className="exam-practice"
      aria-label="시험 연습"
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
    >
      {error && (
        <div role="alert">
          <p>{error}</p>
          {!blocked && <Button onClick={() => persist(draft)}>저장 다시 시도</Button>}
          {blocked && boot.key && (
            <Button
              onClick={() => {
                try {
                  preservePracticeDraft(boot.key, Boolean(boot.error));
                  if (boot.error) {
                    raw.current = null;
                    setBlocked(false);
                    setError('');
                  } else
                    setError(
                      '원문 사본을 보관했습니다. 현재 입력도 유지했습니다. 초안 보관본에서 확인해 주세요.',
                    );
                } catch (e) {
                  setError(message(e));
                }
              }}
            >
              {boot.error ? '사본 보관 후 새 연습' : '원문 사본 보관'}
            </Button>
          )}
          <a href="#/draft-archives">초안 보관본</a>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {draft.previous && draft.phase !== 'saved' && (
        <aside className="practice-previous" aria-label="지난 연습에서 남긴 것">
          <p>지난 연습에서 남긴 것</p>
          {draft.previous.reflection && (
            <>
              <strong>막힌 곳</strong>
              <p>{draft.previous.reflection}</p>
            </>
          )}
          {draft.previous.nextStep && (
            <>
              <strong>다음에 해 볼 것</strong>
              <p>{draft.previous.nextStep}</p>
            </>
          )}
          {!draft.previous.reflection && !draft.previous.nextStep && (
            <p>복기는 이전 메모에서 확인할 수 있습니다.</p>
          )}
          {!draft.previous.timeKnown && (
            <p>이전 시간을 확인할 수 없어 25분으로 준비했습니다. 바꿔도 됩니다.</p>
          )}
          <a href={`#/memos/${encodeURIComponent(draft.previous.memoId)}`}>이전 메모 열기</a>
        </aside>
      )}
      {draft.phase === 'setup' ? (
        <>
          <p className="practice-intro">책이나 다른 앱의 문제를 보며 풀어 보세요.</p>
          {!topics.length ? (
            <EmptyState title="연습할 주제를 먼저 넣어 주세요">
              <a href="#/subjects">과목과 목차 입력</a>
            </EmptyState>
          ) : (
            <form
              className="practice-setup"
              onSubmit={(e) => {
                e.preventDefault();
                if (!blocked) start();
              }}
            >
              <Select
                label="연습할 주제"
                value={draft.topicId}
                disabled={blocked}
                onChange={(e) =>
                  persist({
                    ...draft,
                    topicId: e.target.value,
                    previous: e.target.value === draft.topicId ? draft.previous : undefined,
                  })
                }
              >
                <option value="">주제 선택</option>
                {subjects.map((subject) => (
                  <optgroup label={subject.name} key={subject.id}>
                    {topics
                      .filter((row) => row.subjectId === subject.id)
                      .map((row) => (
                        <option value={row.id} key={row.id}>
                          {row.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </Select>
              <Select
                label="연습 시간"
                value={draft.minutes}
                disabled={blocked}
                onChange={(e) => persist({ ...draft, minutes: Number(e.target.value) })}
              >
                <option value={10}>10분</option>
                <option value={25}>25분</option>
                <option value={50}>50분</option>
                <option value={0}>시간 제한 없이</option>
              </Select>
              <Button type="submit" variant="primary" disabled={!topic || blocked || composing}>
                연습 시작
              </Button>
            </form>
          )}
        </>
      ) : (
        <>
          <h2 ref={heading} tabIndex={-1}>
            {draft.topicName}
          </h2>
          {draft.phase === 'running' || draft.phase === 'paused' ? (
            <>
              <p className="practice-timer-label">
                {draft.phase === 'paused'
                  ? '잠시 멈춤'
                  : draft.minutes
                    ? expired
                      ? '정한 시간보다 더 푼 시간'
                      : '남은 시간'
                    : '연습한 시간'}
              </p>
              <p
                className="practice-timer"
                role="timer"
                aria-label={draft.minutes ? (expired ? '초과한 시간' : '남은 시간') : '연습한 시간'}
              >
                {clock(draft.minutes ? Math.abs(draft.minutes * 60000 - elapsed) : elapsed)}
              </p>
              {expired && <p role="status">마무리할 때 ‘연습 마치기’를 눌러 주세요.</p>}
              <div className="actions">
                <Button
                  disabled={blocked}
                  onClick={
                    draft.phase === 'running'
                      ? pause
                      : () => persist({ ...draft, phase: 'running', runningSince: Date.now() })
                  }
                >
                  {draft.phase === 'running' ? '잠시 멈추기' : '이어서 풀기'}
                </Button>
                <Button variant="primary" disabled={blocked || composing} onClick={finish}>
                  연습 마치기
                </Button>
              </div>
              <details className="practice-writing">
                <summary>앱에 풀이 쓰기 · 선택</summary>
                <Textarea
                  label="풀이·답안"
                  rows={8}
                  value={draft.answer}
                  disabled={blocked}
                  placeholder="필요할 때 여기에 적으세요."
                  onChange={(e) => persist({ ...draft, answer: e.target.value })}
                />
              </details>
            </>
          ) : draft.phase === 'review' ? (
            <>
              <p>연습한 시간 {clock(draft.elapsedMs)} · 기억할 것만 남겨 주세요.</p>
              {draft.answer && (
                <details className="practice-writing">
                  <summary>내 풀이 보기·고치기</summary>
                  <Textarea
                    label="풀이·답안"
                    value={draft.answer}
                    rows={6}
                    disabled={blocked}
                    onChange={(e) => persist({ ...draft, answer: e.target.value })}
                  />
                </details>
              )}
              <Textarea
                label="막힌 곳"
                hint="선택 입력"
                rows={3}
                value={draft.reflection}
                disabled={blocked}
                placeholder="예: 어느 공식을 써야 할지 오래 고민했어요."
                onChange={(e) => persist({ ...draft, reflection: e.target.value })}
              />
              <Textarea
                label="다음에 해 볼 것"
                hint="선택 입력"
                rows={3}
                value={draft.nextStep}
                disabled={blocked}
                placeholder="예: 공식의 적용 조건을 다시 설명해 보기"
                onChange={(e) => persist({ ...draft, nextStep: e.target.value })}
              />
              {!topic && <p>주제가 휴지통에 있어 자유 메모로 남깁니다.</p>}
              {!ready && (
                <p role="alert">
                  지금은 메모를 저장할 수 없습니다. 작성 내용은 이 기기에 남아 있습니다.
                </p>
              )}
              <div className="actions">
                <Button
                  variant="primary"
                  disabled={!ready || blocked || composing}
                  onClick={() => save()}
                >
                  연습 기록 남기기
                </Button>
                <Button
                  disabled={blocked}
                  onClick={() => persist({ ...draft, phase: 'paused', endedAt: null })}
                >
                  돌아가서 더 풀기
                </Button>
                {repository.getSnapshot().memos?.some((m) => m.id === draft.id) && (
                  <Button disabled={!ready || blocked || composing} onClick={() => save(true)}>
                    별도 메모로 남기기
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <p>연습한 시간 {clock(draft.elapsedMs)}</p>
              <div className="actions">
                <a href={`#/memos/${encodeURIComponent(draft.id)}`}>남긴 메모 보기</a>
                <Button variant="primary" onClick={restart} disabled={blocked}>
                  새 연습
                </Button>
              </div>
            </>
          )}
        </>
      )}
      {history.length > 0 && (
        <details className="practice-history">
          <summary>지난 연습 {history.length}개</summary>
          <ul>
            {history.map((memo) => (
              <li key={memo.id}>
                <a href={`#/memos/${encodeURIComponent(memo.id)}`}>
                  {memo.body.split('\n')[0] || '연습 메모'}
                </a>
                <span>{new Date(memo.createdAt).toLocaleDateString('ko-KR')}</span>
                <Button
                  variant="quiet"
                  disabled={
                    blocked ||
                    composing ||
                    !['setup', 'saved'].includes(draft.phase) ||
                    !topics.some((row) => row.id === memo.ownerId)
                  }
                  onClick={() => repeat(memo)}
                >
                  같은 주제로 다시 연습
                </Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
