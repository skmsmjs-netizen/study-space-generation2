import { studyAIContextSources } from './study-ai-context';
import { DomainError, type AppState } from './model';
import { type MaterialContent, type MaterialResult, MAX_SOURCE_TEXT } from './study-material';
import { type StudyAITask } from './study-ai-request';

export interface InputAISnapshot {
  key: string;
  title: string;
  text: string;
  subjectId?: string;
  topicId?: string | null;
}
/** Snapshot current writing only when the user opens help; never replace its source. */
export function inputAIMaterial(
  data: AppState,
  input: InputAISnapshot,
  task: StudyAITask,
): MaterialContent {
  if (!input.text.trim())
    throw new DomainError('AI_INPUT_EMPTY', '먼저 검토할 글이나 코드를 입력해 주세요.');
  const sourceText = `입력 위치: ${input.title}\n입력 식별자: ${input.key}\n가져온 시각: ${new Date().toISOString()}\n\n${input.text}`;
  if (sourceText.length > MAX_SOURCE_TEXT)
    throw new DomainError(
      'AI_INPUT_SIZE',
      '입력이 15만 자를 넘습니다. 필요한 범위를 나누어 주세요. 원문은 유지했습니다.',
    );
  const subject = data.subjects.find(
    (row) =>
      row.id === input.subjectId &&
      !row.deletedAt &&
      row.userId === data.userId &&
      row.namespace === data.namespace,
  );
  const topic = data.nodes.find(
    (row) => row.id === input.topicId && row.subjectId === subject?.id && !row.deletedAt,
  );
  return {
    title: `${input.title.slice(0, 285)} · GPT 도움`,
    subjectId: subject?.id ?? '',
    topicId: topic?.id ?? null,
    sourceText,
    audio: null,
    results: [],
    aiRequest: { task, requestedCardCount: 5 },
  };
}
/** Reuse the real problem/attempt/reference; generated feedback is never a new answer key. */
export function inputAIFollowup(
  content: MaterialContent,
  result: MaterialResult,
  task: 'hint' | 'feedback' | 'practice',
): MaterialContent {
  if (result.source && result.source.text !== content.sourceText)
    throw new DomainError(
      'AI_FOLLOWUP_SOURCE',
      '현재 원문이 생성 당시와 다릅니다. 두 내용을 유지했습니다. 원문을 확인하고 사용할 문제·풀이·기준을 직접 골라 주세요.',
    );
  const request = result.request ?? content.aiRequest;
  return {
    ...content,
    aiRequest: {
      ...request,
      task,
      requestedCardCount: content.aiRequest?.requestedCardCount ?? 5,
      focus:
        task === 'practice'
          ? '제공한 실제 문제·풀이·판단 기준 안에서 같은 원리를 다른 맥락으로 연습한다. 문제와 해설을 분리한다.'
          : '',
    },
  };
}

/** A disclosed recent window; global notes and unrelated code are not silently included. */
export function subjectAIInput(data: AppState, subjectId: string): InputAISnapshot {
  const inSubject = (ownerId: string | null) =>
    ownerId === subjectId ||
    data.nodes.some((n) => n.id === ownerId && n.subjectId === subjectId && !n.deletedAt);
  const sources = studyAIContextSources(data, subjectId)
    .filter((s) => {
      const kind = s.key.split(':')[0],
        id = s.key.slice(kind.length + 1);
      return (
        kind === 'record' ||
        (kind === 'memo' && data.memos?.some((m) => m.id === id && inSubject(m.ownerId))) ||
        (kind === 'narrative' && data.narratives.some((n) => n.id === id && inSubject(n.ownerId)))
      );
    })
    .slice(0, 20);
  return {
    key: `subject:${subjectId}`,
    title: `${data.subjects.find((s) => s.id === subjectId)?.name ?? '과목'} · 최근 기록·글·메모 ${sources.length}개`,
    subjectId,
    text: sources.map((s) => s.text).join('\n\n'),
  };
}
