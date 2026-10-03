import { useEffect, useRef, useState } from 'react';
import { Button, ErrorState, Modal, Select, Textarea } from './index';
import { canUseOwnerAI } from '../domain/ai-access';
import type { AppState, Command } from '../domain/model';
import { inputAIFollowup, inputAIMaterial, type InputAISnapshot } from '../domain/input-ai';
import {
  STUDY_AI_TASKS,
  activeStudyAIRequest,
  validateStudyAIRequest,
  type StudyAITask,
} from '../domain/study-ai-request';
import {
  validateMaterialContent,
  materialContent,
  type MaterialContent,
} from '../domain/study-material';
import { readMaterialDraft, writeMaterialDraft, type MaterialDraft } from '../data/material-files';
import { generateStudyMaterial } from '../data/study-ai';
import { StudyAIContextPicker } from './study-ai-context-picker';
import { StudyResultText } from './study-result-text';

type SaveCommand = Extract<Command, { type: 'saveStudyMaterial' }>;
type Props = {
  triggerLabel?: string;
  data: AppState;
  input: InputAISnapshot;
  defaultTask?: StudyAITask;
  save: (command: SaveCommand) => number | undefined | Promise<number | undefined>;
};
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : '입력과 결과를 유지했습니다. 다시 시도해 주세요.';
const choices: StudyAITask[] = [
  'reasoning',
  'organize',
  'reflect',
  'next-study',
  'code',
  'formula',
  'explain',
  'compare',
  'conditions',
  'questions',
  'hint',
  'feedback',
  'practice',
];

/** In-place help: all inference is an explicit action; its draft and source are independent. */
export function InputAIHelp({
  data,
  input,
  save,
  defaultTask = 'reasoning',
  triggerLabel = '입력으로 GPT 도움',
}: Props) {
  const [open, setOpen] = useState(false),
    [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<MaterialDraft | null>(null);
  const [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const current = useRef(draft);
  current.current = draft;
  const controller = useRef<AbortController | null>(null),
    flight = useRef(false);
  const writeFlight = useRef<Promise<unknown>>(Promise.resolve());
  const revision = useRef(0);
  const draftKey = `input-ai:${input.key}`;
  useEffect(() => () => controller.current?.abort(), []);
  if (!canUseOwnerAI(data)) return null;
  async function retain(next: MaterialDraft) {
    const at = ++revision.current;
    current.current = next;
    setDraft(next);
    writeFlight.current = writeFlight.current
      .catch(() => undefined)
      .then(() => (at === revision.current ? writeMaterialDraft(data, draftKey, next) : undefined));
    await writeFlight.current;
  }
  function envelope(content: MaterialContent, previous = current.current): MaterialDraft {
    return {
      content,
      materialId: previous?.materialId ?? crypto.randomUUID(),
      baseVersion: previous?.baseVersion ?? 0,
      updatedAt: new Date().toISOString(),
    };
  }
  async function start() {
    setOpen(true);
    setLoading(true);
    setError('');
    setNotice('');
    try {
      if (current.current) {
        setNotice('이 창의 도움 입력·결과를 이어 열었습니다.');
        return;
      }
      const previous = await readMaterialDraft(data, draftKey);
      if (previous) {
        validateMaterialContent({
          ...previous.content,
          subjectId: previous.content.subjectId || 'unassigned',
        });
        if (!previous.materialId || !Number.isSafeInteger(previous.baseVersion))
          throw Error('GPT 도움 초안을 읽지 못했습니다. 기존 사본을 덮어쓰지 않았습니다.');
        current.current = previous;
        setDraft(previous);
        setNotice('보관한 입력·결과를 이어 열었습니다. 현재 작성 내용은 별도로 유지됩니다.');
      } else await retain(envelope(inputAIMaterial(data, input, defaultTask), null));
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoading(false);
    }
  }
  function edit(patch: Partial<MaterialContent>) {
    if (!current.current) return;
    void retain(envelope({ ...current.current.content, ...patch })).catch((e) =>
      setError(errorText(e)),
    );
  }
  function request(patch: Partial<NonNullable<MaterialContent['aiRequest']>>) {
    if (current.current)
      edit({ aiRequest: { task: 'reasoning', ...current.current.content.aiRequest, ...patch } });
  }
  async function generate() {
    if (flight.current || !current.current) return;
    flight.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    const abort = new AbortController();
    controller.current = abort;
    try {
      const previous = current.current;
      const content = previous.content;
      if (!content.subjectId) throw Error('결과를 모아 둘 과목을 골라 주세요.');
      if (content.results.length >= 30)
        throw Error('생성 결과 30개를 보관했습니다. 자료로 저장한 뒤 새 자료에서 이어가 주세요.');
      validateStudyAIRequest(activeStudyAIRequest(content.aiRequest));
      await retain(previous); // Refuse inference until its exact original is durable.
      const result = await generateStudyMaterial(
        data,
        content,
        content.aiRequest?.requestedCardCount ?? 5,
        abort.signal,
      );
      abort.signal.throwIfAborted();
      const next = envelope({ ...content, results: [...content.results, result] }, previous);
      await retain(next);
      setResultIndex(null);
      setNotice(
        result.status && result.status !== 'complete'
          ? '확인이 필요한 부분을 결과에 남겼습니다. 원문과 결과는 기기에 보관했습니다.'
          : '결과를 기기에 보관했습니다. 내용을 확인한 뒤 자료에 저장할 수 있습니다.',
      );
    } catch (e) {
      setError(
        controller.current?.signal.aborted
          ? '생성을 중단했습니다. 입력과 기존 결과는 유지했습니다. 자동으로 다시 호출하지 않습니다.'
          : errorText(e),
      );
    } finally {
      flight.current = false;
      controller.current = null;
      setBusy(false);
    }
  }
  async function store() {
    if (!current.current || flight.current) return;
    flight.current = true;
    setBusy(true);
    setError('');
    try {
      const previous = current.current;
      validateMaterialContent({
        ...previous.content,
        subjectId: previous.content.subjectId || 'unassigned',
      });
      await retain(previous);
      const version = await save({
        type: 'saveStudyMaterial',
        id: previous.materialId!,
        expectedVersion: previous.baseVersion,
        content: previous.content,
        userId: data.userId,
        namespace: data.namespace,
        opId: crypto.randomUUID(),
        at: new Date().toISOString(),
      });
      if (version === undefined)
        throw Error(
          '자료에 저장하지 못했습니다. 도움 초안과 결과는 유지했습니다. 저장을 다시 선택해 주세요.',
        );
      await retain({ ...previous, baseVersion: version, updatedAt: new Date().toISOString() });
      setNotice(
        '자료에 보관했습니다. 서버 전송 상태는 원래 화면의 저장 상태에서 확인할 수 있습니다.',
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      flight.current = false;
      setBusy(false);
    }
  }
  const content = draft?.content,
    task = content?.aiRequest?.task ?? defaultTask;
  const result = content?.results[resultIndex ?? content.results.length - 1];
  return (
    <>
      <Button
        variant="quiet"
        disabled={!input.text.trim()}
        onClick={(event) => {
          event.currentTarget.focus({ preventScroll: true });
          void start();
        }}
      >
        {triggerLabel}
      </Button>
      <Modal
        open={open}
        title="입력으로 GPT 도움"
        onClose={() => {
          controller.current?.abort();
          setOpen(false);
        }}
      >
        <p>
          현재 입력의 사본으로 검토합니다. 원래 글·코드·기록은 유지하며, 생성은 아래 실행 버튼을
          누를 때만 요청합니다.
        </p>
        {loading && <p role="status">보관한 도움 초안을 확인하고 있습니다.</p>}
        {error && <ErrorState message={error} />}
        {content && !loading && (
          <Button
            onClick={() => {
              const blob = new Blob([JSON.stringify(current.current, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `GPT 도움 ${draft?.materialId ?? '초안'}.json`;
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            입력·결과 파일로 보관
          </Button>
        )}
        {content && !loading && (
          <div className="field-stack">
            <Select
              label="GPT 도움 작업"
              value={task}
              disabled={busy}
              onChange={(e) => request({ task: e.target.value as StudyAITask })}
            >
              {choices.map((choice) => (
                <option key={choice} value={choice}>
                  {STUDY_AI_TASKS[choice].label}
                </option>
              ))}
            </Select>
            <Select
              label="결과를 모아 둘 과목"
              value={content.subjectId}
              disabled={busy}
              onChange={(e) => edit({ subjectId: e.target.value, topicId: null })}
            >
              <option value="">과목 선택</option>
              {data.subjects
                .filter(
                  (s) => !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace,
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </Select>
            <details>
              <summary>이번 요청에 사용할 입력 확인·수정</summary>
              <Textarea
                label="GPT 도움 입력 사본"
                rows={6}
                value={content.sourceText}
                disabled={busy}
                onChange={(e) => edit({ sourceText: e.target.value })}
              />
              <Button
                disabled={busy}
                onClick={() => {
                  try {
                    const fresh = inputAIMaterial(data, input, task);
                    edit({ sourceText: fresh.sourceText });
                  } catch (e) {
                    setError(errorText(e));
                  }
                }}
              >
                지금 작성한 입력으로 갱신
              </Button>
            </details>
            <StudyAIContextPicker
              data={data}
              subjectId={content.subjectId}
              text={content.sourceText}
              disabled={busy}
              onApply={async (text) => {
                await retain(envelope({ ...current.current!.content, sourceText: text }));
              }}
            />
            <Textarea
              label="확인할 질문·초점 · 선택"
              rows={2}
              value={content.aiRequest?.focus ?? ''}
              disabled={busy}
              onChange={(e) => request({ focus: e.target.value })}
            />
            {['hint', 'feedback', 'practice'].includes(task) && (
              <>
                <Textarea
                  label="실제 문제와 조건"
                  value={content.aiRequest?.problem ?? ''}
                  disabled={busy}
                  onChange={(e) => request({ problem: e.target.value })}
                />
                <Textarea
                  label="현재 풀이·막힌 단계"
                  value={content.aiRequest?.attempt ?? ''}
                  disabled={busy}
                  onChange={(e) => request({ attempt: e.target.value })}
                />
                <Button disabled={busy} onClick={() => request({ attempt: input.text })}>
                  현재 입력을 풀이로 가져오기
                </Button>
                <Textarea
                  label="확인할 해설·판단 기준"
                  value={content.aiRequest?.reference ?? ''}
                  disabled={busy}
                  onChange={(e) => request({ reference: e.target.value })}
                />
              </>
            )}
            <Select
              label="인출 질문 개수"
              value={content.aiRequest?.requestedCardCount ?? 5}
              disabled={busy}
              onChange={(e) =>
                request({ requestedCardCount: Number(e.target.value) as 5 | 10 | 20 | 30 })
              }
            >
              {[5, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}개
                </option>
              ))}
            </Select>
            <div className="actions">
              <Button busy={busy} disabled={busy} onClick={() => void generate()}>
                선택한 GPT 도움 실행
              </Button>
              {busy && <Button onClick={() => controller.current?.abort()}>생성 중단</Button>}
              <Button disabled={busy} onClick={() => void store()}>
                입력·결과를 자료에 저장
              </Button>
              <Button
                disabled={busy}
                onClick={() =>
                  void retain(current.current!)
                    .then(() => setNotice('도움 초안을 다시 보관했습니다.'))
                    .catch((e) => setError(errorText(e)))
                }
              >
                도움 초안 다시 보관
              </Button>
            </div>
            {notice && <p role="status">{notice}</p>}
            {draft && draft.baseVersion > 0 && (
              <a
                href={`#/materials/${encodeURIComponent(draft.materialId!)}`}
                onClick={() => setOpen(false)}
              >
                자료에서 모든 결과 편집
              </a>
            )}
            {draft && draft.baseVersion > 0 && (
              <Button
                disabled={busy}
                onClick={async () => {
                  try {
                    const stored = data.studyMaterials?.find((m) => m.id === draft.materialId);
                    if (!stored) throw Error('저장한 자료를 먼저 확인해 주세요.');
                    if (JSON.stringify(materialContent(stored)) !== JSON.stringify(content))
                      throw Error(
                        '새 도움을 시작하기 전에 현재 입력과 결과를 자료에 저장해 주세요.',
                      );
                    await retain(envelope(inputAIMaterial(data, input, defaultTask), null));
                    setResultIndex(null);
                    setNotice('저장한 이전 결과는 자료에 유지하고 새 도움 초안을 열었습니다.');
                  } catch (e) {
                    setError(errorText(e));
                  }
                }}
              >
                저장한 결과를 두고 새 도움 시작
              </Button>
            )}
            {result && (
              <section aria-label="GPT 도움 결과">
                <Select
                  label="보관한 도움 결과"
                  value={resultIndex ?? content.results.length - 1}
                  disabled={busy}
                  onChange={(e) => setResultIndex(Number(e.target.value))}
                >
                  {content.results.map((r, i) => (
                    <option key={r.id} value={i}>
                      {i + 1}번째 · {STUDY_AI_TASKS[r.request?.task ?? 'reasoning'].label}
                    </option>
                  ))}
                </Select>
                <p>{STUDY_AI_TASKS[result.request?.task ?? 'reasoning'].label}</p>
                <p>생성 당시 입력을 기준으로 한 결과입니다. 공부 완료·숙달 판정과 구별합니다.</p>
                {result.diagnostics?.map((d, i) => (
                  <p key={i}>{d.message}</p>
                ))}
                {result.summary.map((s, i) => (
                  <StudyResultText key={i} text={s.text} />
                ))}
                {result.cards.map((c) => (
                  <article key={c.id}>
                    <StudyResultText text={c.question} />
                    <details>
                      <summary>답·해설 확인</summary>
                      <StudyResultText text={c.answer} />
                    </details>
                  </article>
                ))}
                <details>
                  <summary>생성 당시 입력·근거</summary>
                  {result.segments.map((s) => (
                    <article key={s.id}>
                      <p>{s.label ?? s.id}</p>
                      <StudyResultText text={s.text} />
                    </article>
                  ))}
                </details>
                {['hint', 'feedback', 'practice'].includes(result.request?.task ?? '') && (
                  <div className="actions">
                    <Button
                      disabled={busy}
                      onClick={() =>
                        (() => {
                          try {
                            edit(inputAIFollowup(content, result, 'feedback'));
                          } catch (e) {
                            setError(errorText(e));
                          }
                        })()
                      }
                    >
                      이 답안 검토 준비
                    </Button>
                    <Button
                      disabled={busy}
                      onClick={() =>
                        (() => {
                          try {
                            edit(inputAIFollowup(content, result, 'practice'));
                          } catch (e) {
                            setError(errorText(e));
                          }
                        })()
                      }
                    >
                      다른 맥락의 재연습 준비
                    </Button>
                  </div>
                )}
                <p>
                  후속 작업은 원래 문제·풀이·판단 기준을 이어 쓰며, GPT 검토를 정답 기준으로 자동
                  채택하지 않습니다.
                </p>
              </section>
            )}
          </div>
        )}
        <Button
          onClick={() => {
            controller.current?.abort();
            setOpen(false);
          }}
        >
          작성하던 자리로 돌아가기
        </Button>
      </Modal>
    </>
  );
}
