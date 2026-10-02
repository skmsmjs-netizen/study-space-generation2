import { occurrenceRows } from './list-keys';
import { StudyResultText } from './study-result-text';
import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { recallPath } from '../domain/topic-recall';
import { topicMemoryInput, type MemoryGenerationDraft } from '../domain/topic-memory';
import { generateTopicMemory } from '../data/study-ai';
import { registerTopicMemory } from '../data/topic-memory';
import type { StudyRepository } from '../data/repository';
import { Button, Checkbox, Select, Textarea } from './index';

export function TopicMemoryGenerator({
  data,
  repository,
  draft,
  disabled,
  composing,
  onChange,
  onSaved,
  onBusy,
  onArchive,
  onConnection,
}: {
  data: AppState;
  repository: StudyRepository;
  draft: MemoryGenerationDraft;
  disabled: boolean;
  composing: boolean;
  onChange: (draft: MemoryGenerationDraft) => boolean;
  onSaved: (data: AppState) => void;
  onBusy: (value: boolean) => void;
  onArchive: () => boolean;
  onConnection: () => void;
}) {
  const [pending, setPending] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState('');
  const flight = useRef(false),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const input = draft.input,
    result = draft.result;
  const topics = data.nodes.filter(
    (n) =>
      n.role === 'topic' &&
      n.subjectId === input.subject.id &&
      !n.deletedAt &&
      recallPath(data.nodes, n.id).every((p) => !p.deletedAt),
  );
  const updateScope = (ids: string[], count = input.count, guidance = input.guidance) => {
    try {
      onChange({ input: topicMemoryInput(data, ids, count, guidance), result: null, items: [] });
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '출제 범위를 확인해 주세요.');
    }
  };
  const generate = async () => {
    if (disabled || composing || flight.current || draft.result) return;
    try {
      // Refresh only when explicitly generating. Scope edits elsewhere never silently change a saved result.
      const fresh = {
        input: topicMemoryInput(
          data,
          input.topics.map((t) => t.id),
          input.count,
          input.guidance,
        ),
        result: null,
        items: [],
      };
      if (!onChange(fresh)) return;
      flight.current = true;
      setPending(true);
      onBusy(true);
      setError('');
      setNotice('');
      const result = await generateTopicMemory(data, fresh.input);
      const stored = onChange({
        input: result.input,
        result,
        items: result.cards.map((c) => ({
          id: c.id,
          question: c.question,
          answer: c.answer,
          included: true,
          reviewed: false,
        })),
      });
      if (mounted.current && stored)
        setNotice(
          result.cards.length
            ? '질문과 기준 답안을 만들었습니다. 확인한 항목을 등록해 주세요.'
            : '등록할 문항을 만들지 않았습니다. 아래 안내를 확인해 주세요.',
        );
    } catch (e) {
      if (mounted.current)
        setError(
          e instanceof Error ? e.message : '생성을 마치지 못했습니다. 기존 초안은 유지했습니다.',
        );
    } finally {
      flight.current = false;
      if (mounted.current) {
        setPending(false);
        onBusy(false);
      }
    }
  };
  const patchItem = (id: string, patch: Partial<MemoryGenerationDraft['items'][number]>) => {
    onChange({ ...draft, items: draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
    setNotice('');
  };
  const selected = draft.items.filter((i) => i.included);
  const register = () => {
    if (disabled || composing || pending) return;
    let registered = 0;
    try {
      for (const item of selected) {
        const next = registerTopicMemory(repository, draft, item.id);
        onSaved(next.data);
        if (!next.deleted) registered++;
      }
      setNotice(
        `${registered}개 항목이 암기시험에 등록되어 있습니다. 이미 등록한 항목은 수정하거나 중복 추가하지 않았습니다.`,
      );
      setError('');
    } catch (e) {
      setError(
        `${e instanceof Error ? e.message : '등록하지 못했습니다.'} 생성 결과는 유지했습니다. 저장만 다시 시도할 수 있습니다.`,
      );
    }
  };
  return (
    <section
      className="memory-editor memory-generator"
      aria-label="GPT 암기항목 생성"
      aria-busy={pending}
    >
      <h2>목차·주제로 암기항목 만들기</h2>
      <p className="muted">
        {input.subject.name}의 목차와 주제로 질문과 기준 답안을 만듭니다. 필기나 교재 본문 없이도
        만들 수 있습니다.
      </p>
      {!result && (
        <p className="muted">
          기본 3개씩 짧게 만듭니다. 10초 안에 끝나지 않으면 기다림을 끝내고 입력을 유지합니다.
        </p>
      )}
      {!draft.result && (
        <>
          <Select
            label="GPT 출제 주제"
            value={input.topics.length === 1 ? input.topics[0].id : ''}
            disabled={disabled || pending}
            onChange={(e) => {
              if (e.target.value) updateScope([e.target.value]);
            }}
          >
            {input.topics.length > 1 && (
              <option value="">선택한 {input.topics.length}개 주제</option>
            )}
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {recallPath(data.nodes, t.id)
                  .map((n) => n.name)
                  .join(' › ')}
              </option>
            ))}
          </Select>
          <details>
            <summary>여러 주제를 함께 출제</summary>
            <p className="muted">같은 과목에서 최대 20개 주제를 함께 선택할 수 있습니다.</p>
            <div className="memory-topic-options">
              {topics.map((t) => {
                const checked = input.topics.some((n) => n.id === t.id);
                return (
                  <Checkbox
                    key={t.id}
                    label={recallPath(data.nodes, t.id)
                      .map((n) => n.name)
                      .join(' › ')}
                    checked={checked}
                    disabled={
                      disabled ||
                      pending ||
                      (checked && input.topics.length === 1) ||
                      (!checked && input.topics.length >= 20)
                    }
                    onChange={(e) =>
                      updateScope(
                        e.target.checked
                          ? [...input.topics.map((n) => n.id), t.id]
                          : input.topics.filter((n) => n.id !== t.id).map((n) => n.id),
                      )
                    }
                  />
                );
              })}
            </div>
          </details>
          <Select
            label="만들 암기항목 수"
            value={input.count}
            disabled={disabled || pending}
            onChange={(e) =>
              updateScope(
                input.topics.map((t) => t.id),
                Number(e.target.value),
              )
            }
          >
            {[1, 3, 5, 10, 20, 30].map((n) => (
              <option key={n} value={n}>
                {n}개
              </option>
            ))}
          </Select>
          <Textarea
            label="출제 초점·난도 (선택)"
            hint="예: 대학 기초 수준, 공식의 적용 조건과 헷갈리는 개념 위주"
            value={input.guidance}
            maxLength={2000}
            rows={2}
            disabled={disabled || pending}
            onChange={(e) =>
              updateScope(
                input.topics.map((t) => t.id),
                input.count,
                e.target.value,
              )
            }
          />
          <div className="actions">
            <Button
              variant="primary"
              disabled={disabled || composing || pending}
              onClick={() => void generate()}
            >
              {pending ? '암기항목 만드는 중…' : '이 목차로 생성'}
            </Button>
            <Button variant="quiet" disabled={pending} onClick={onConnection}>
              GPT 연결 확인
            </Button>
          </div>
        </>
      )}
      {result && (
        <>
          <p className="muted">
            주제 기반 생성 · {result.cards.length}개 · {input.subject.name} /{' '}
            {input.topics.map((t) => t.path.map((n) => n.name).join(' › ')).join(', ')}
          </p>
          {result.cards.length > 0 && (
            <p className="muted">
              일반 지식으로 만든 답안입니다. 수업의 표기와 조건에 맞는지 확인하거나 고쳐 주세요.
            </p>
          )}
          {result.diagnostics && occurrenceRows(result.diagnostics, diagnostic => JSON.stringify(diagnostic)).map(({value: d, key}) => (
            <article key={key}>
              <p role="status">{d.message}</p>
              {d.questions?.map((q) => (
                <p key={q}>{q}</p>
              ))}
            </article>
          ))}
          {draft.items.map((i, index) => {
            const original = result.cards.find((c) => c.id === i.id);
            if (!original)
              return (
                <p role="alert" key={i.id}>
                  처음 생성한 항목을 찾지 못했습니다. 초안은 유지했습니다.
                </p>
              );
            const id = `topic-gpt:${encodeURIComponent(result.id)}:${encodeURIComponent(i.id)}`;
            const saved = data.memoryCards?.find(
              (c) =>
                c.id === id ||
                (c.topicId === original.topicId &&
                  c.question.trim() === i.question.trim() &&
                  c.answer.trim() === i.answer.trim() &&
                  !c.strokes.length),
            );
            return (
              <article key={i.id} className="memory-review">
                <h3>
                  {index + 1}번 ·{' '}
                  {input.topics.find((t) => t.id === original.topicId)?.path.at(-1)?.name}
                </h3>
                <Checkbox
                  label={`${index + 1}번 항목 등록에 포함`}
                  checked={i.included}
                  disabled={disabled || !!saved}
                  onChange={(e) => patchItem(i.id, { included: e.target.checked })}
                />
                <Textarea
                  label={`${index + 1}번 질문`}
                  rows={2}
                  maxLength={4000}
                  value={i.question}
                  disabled={disabled || !!saved}
                  onChange={(e) => patchItem(i.id, { question: e.target.value, reviewed: false })}
                />
                <Textarea
                  label={`${index + 1}번 기준 답안`}
                  rows={3}
                  maxLength={10_000}
                  value={i.answer}
                  disabled={disabled || !!saved}
                  onChange={(e) => patchItem(i.id, { answer: e.target.value, reviewed: false })}
                />
                <section
                  className="memory-generated-preview"
                  aria-label={`${index + 1}번 조판 미리보기`}
                >
                  <p className="muted">조판 미리보기</p>
                  <strong>
                    <StudyResultText text={i.question} as="span" />
                  </strong>
                  <StudyResultText text={i.answer} />
                </section>
                <Checkbox
                  label={`${index + 1}번 질문과 답안을 확인했어요`}
                  checked={i.reviewed}
                  disabled={disabled || !!saved}
                  onChange={(e) => patchItem(i.id, { reviewed: e.target.checked })}
                />
                {saved && (
                  <p className="muted">
                    {saved.deletedAt
                      ? '보관한 항목입니다. 암기시험의 보관한 항목에서 복원할 수 있습니다.'
                      : '등록했습니다. 항목 편집에서 계속 수정할 수 있습니다.'}
                  </p>
                )}
                <details>
                  <summary>처음 생성한 질문·답안</summary>
                  <StudyResultText text={original.question} />
                  <StudyResultText text={original.answer} />
                </details>
              </article>
            );
          })}
          <div className="actions">
            <Button
              variant="primary"
              disabled={
                disabled ||
                composing ||
                !selected.length ||
                selected.some((i) => !i.reviewed || !i.question.trim() || !i.answer.trim())
              }
              onClick={register}
            >
              확인한 항목 등록
            </Button>
            <Button
              disabled={disabled || composing}
              onClick={() => {
                if (onArchive()) onChange({ input, result: null, items: [] });
              }}
            >
              이 결과 보관하고 새로 만들기
            </Button>
          </div>
        </>
      )}
      {notice && <p role="status">{notice}</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <Button variant="quiet" onClick={onConnection}>
            연결 설정 열기
          </Button>
        </div>
      )}
    </section>
  );
}
