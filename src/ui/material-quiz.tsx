import { occurrenceRows } from './list-keys';
import { useState, type ReactNode } from 'react';
import type { MaterialQuizAttempt, MaterialQuizQuestion } from '../domain/material-learning';
import { Button, Radio, Select } from './index';
import { StudyResultText } from './study-result-text';
export function MaterialQuiz({
  resultId,
  questions,
  attempts,
  disabled,
  onChange,
  selectedId,
  onSelected,
  evidence,
}: {
  selectedId?: string;
  onSelected?: (id: string) => void;
  resultId: string;
  questions: MaterialQuizQuestion[];
  attempts: MaterialQuizAttempt[];
  disabled: boolean;
  onChange: (attempts: MaterialQuizAttempt[]) => void;
  evidence: (ids: string[]) => ReactNode;
}) {
  const previous = attempts.filter((a) => a.resultId === resultId);
  const [selected, setSelected] = useState(selectedId ?? previous.at(-1)?.id ?? '');
  function select(id: string) {
    setSelected(id);
    onSelected?.(id);
  }
  const attempt = previous.find((a) => a.id === selected) ?? previous.at(-1);
  const answered = attempt
    ? attempt.questions.filter((q) => attempt.answers[q.id] !== undefined)
    : [];
  const wrong = attempt ? answered.filter((q) => attempt.answers[q.id] !== q.correctIndex) : [];
  function start(rows = questions) {
    const open = previous.find((a) => !a.submittedAt);
    if (open) {
      select(open.id);
      return;
    }
    if (attempts.length >= 100 || !rows.length) return;
    const next: MaterialQuizAttempt = {
      id: crypto.randomUUID(),
      resultId,
      at: new Date().toISOString(),
      questions: structuredClone(rows),
      answers: {},
      submittedAt: null,
    };
    onChange([...attempts, next]);
    select(next.id);
  }
  function update(patch: Partial<MaterialQuizAttempt>) {
    if (attempt) onChange(attempts.map((a) => (a.id === attempt.id ? { ...a, ...patch } : a)));
  }
  return (
    <section className="material-quiz" aria-label="자료 퀴즈">
      <div className="material-actions">
        <Button
          disabled={disabled || attempts.length >= 100 || Boolean(attempt && !attempt.submittedAt)}
          onClick={() => start()}
        >
          새 퀴즈 시작
        </Button>
        {previous.length > 1 && (
          <Select
            label="퀴즈 시도"
            value={attempt?.id ?? ''}
            onChange={(e) => select(e.target.value)}
          >
            {previous.map((a, i) => (
              <option key={a.id} value={a.id}>
                {i + 1}번째 · {a.submittedAt ? '답 확인함' : '응답 중'}
              </option>
            ))}
          </Select>
        )}
      </div>
      {!attempt && <p>문제를 풀고 답 제출을 누르면 정답·해설·원문 근거를 확인할 수 있습니다.</p>}
      {attempt && (
        <>
          {attempt.questions.map((q, i) => (
            <article key={q.id} className="material-flashcard">
              <h3>
                {i + 1}. <StudyResultText text={q.question} as="span" />
              </h3>
              {attempt.helpedQuestionIds?.includes(q.id) && (
                <p>이 시도에서 자료·보조 결과를 열었습니다. 독립 수행과 구별하여 보관합니다.</p>
              )}
              <fieldset
                className="material-fields"
                aria-label={`${i + 1}번 보기`}
                disabled={disabled || Boolean(attempt.submittedAt)}
              >
                {occurrenceRows(q.options, value => value).map(({value: option, index: at, key}) => (
                  <Radio
                    key={key}
                    name={`${attempt.id}:${q.id}`}
                    label={<StudyResultText text={option} as="span" />}
                    checked={attempt.answers[q.id] === at}
                    onChange={() => update({ answers: { ...attempt.answers, [q.id]: at } })}
                  />
                ))}
              </fieldset>
              {attempt.submittedAt && (
                <div>
                  <p>
                    {attempt.answers[q.id] === undefined
                      ? '응답하지 않은 문항입니다.'
                      : attempt.answers[q.id] === q.correctIndex
                        ? '선택한 답이 기준 답과 같습니다.'
                        : '선택한 답이 기준 답과 다릅니다.'}
                  </p>
                  <p>
                    기준 답: <StudyResultText text={q.options[q.correctIndex]} as="span" />
                  </p>
                  <StudyResultText text={q.explanation} />
                  {evidence(q.sourceIds)}
                </div>
              )}
            </article>
          ))}
          {!attempt.submittedAt ? (
            <Button
              variant="primary"
              disabled={disabled}
              onClick={() => update({ submittedAt: new Date().toISOString() })}
            >
              답 제출 · 해설 확인
            </Button>
          ) : (
            <div>
              <p role="status">
                응답 {answered.length}개 중 기준 답과 같음 {answered.length - wrong.length}개 · 다름{' '}
                {wrong.length}개 · 미응답 {attempt.questions.length - answered.length}개
              </p>
              <Button
                disabled={
                  disabled ||
                  attempts.length >= 100 ||
                  !(wrong.length || answered.length < attempt.questions.length)
                }
                onClick={() => {
                  const retry = attempt.questions.filter(
                    (q) =>
                      attempt.answers[q.id] === undefined ||
                      attempt.answers[q.id] !== q.correctIndex,
                  );
                  start(retry);
                }}
              >
                다른 답·미응답 문항 다시 풀기
              </Button>
            </div>
          )}
        </>
      )}
      <p className="material-hint">
        AI가 제시한 기준 답과 비교합니다. 공식 점수나 숙달로 기록하지 않습니다. 응답은 자료 저장에
        함께 보관됩니다.
      </p>
      {attempts.length >= 100 && (
        <p role="status">
          퀴즈 시도 100개를 보관했습니다. 내보낸 뒤 새 자료에서 이어갈 수 있습니다.
        </p>
      )}
    </section>
  );
}
