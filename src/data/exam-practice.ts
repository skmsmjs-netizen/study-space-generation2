import type { AppState, QuickMemo } from '../domain/model';
import type { StudyRepository } from './repository';
import { storagePrefix } from './repository';
import {
  archiveDamagedDraft,
  clearStoredDraft,
  readRescuedDraft,
  rescueWithoutOverwrite,
  storeDraftSafely,
} from './draft-safety';

export interface ExamPracticeDraft {
  version: 1;
  id: string;
  phase: 'setup' | 'running' | 'paused' | 'review' | 'saved';
  topicId: string;
  topicName: string;
  minutes: number;
  startedAt: string | null;
  endedAt: string | null;
  runningSince: number | null;
  elapsedMs: number;
  answer: string;
  reflection: string;
  nextStep: string;
  previous?: { memoId: string; reflection: string; nextStep: string; timeKnown: boolean };
}
export const EXAM_MEMO_PREFIX = 'exam-practice:';
export function freshExamPractice(topicId = ''): ExamPracticeDraft {
  return {
    version: 1,
    id: EXAM_MEMO_PREFIX + crypto.randomUUID(),
    phase: 'setup',
    topicId,
    topicName: '',
    minutes: 25,
    startedAt: null,
    endedAt: null,
    runningSince: null,
    elapsedMs: 0,
    answer: '',
    reflection: '',
    nextStep: '',
  };
}
export function practiceDraftKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  // A new tab never silently adopts another tab's active attempt. Reload keeps this tab's draft.
  const sessionKey = 'study-space:exam-practice-tab:v1';
  let tabId = sessionStorage.getItem(sessionKey);
  if (!tabId) {
    tabId = crypto.randomUUID();
    sessionStorage.setItem(sessionKey, tabId);
  }
  return `${storagePrefix(data)}:exam-practice-draft:${tabId}:v1`;
}
function validate(value: unknown): asserts value is ExamPracticeDraft {
  const d = value as ExamPracticeDraft | null;
  if (
    !d ||
    d.version !== 1 ||
    typeof d.id !== 'string' ||
    !d.id.startsWith(EXAM_MEMO_PREFIX) ||
    !['setup', 'running', 'paused', 'review', 'saved'].includes(d.phase) ||
    !['topicId', 'topicName', 'answer', 'reflection', 'nextStep'].every(
      (key) => typeof d[key as keyof ExamPracticeDraft] === 'string',
    ) ||
    ![0, 10, 25, 50].includes(d.minutes) ||
    !Number.isFinite(d.elapsedMs) ||
    d.elapsedMs < 0 ||
    ![d.startedAt, d.endedAt].every(
      (at) => at === null || (typeof at === 'string' && Number.isFinite(Date.parse(at))),
    ) ||
    !(d.runningSince === null || (Number.isFinite(d.runningSince) && d.runningSince >= 0)) ||
    (d.phase === 'running') !== (d.runningSince !== null) ||
    (d.phase !== 'setup' && (!d.startedAt || !d.topicId)) ||
    (d.previous !== undefined &&
      (!d.previous ||
        typeof d.previous.memoId !== 'string' ||
        typeof d.previous.reflection !== 'string' ||
        typeof d.previous.nextStep !== 'string' ||
        typeof d.previous.timeKnown !== 'boolean'))
  ) {
    throw Error('연습 내용을 읽지 못했습니다. 원문은 보존했습니다.');
  }
}
/** Only read the recognizable memo template. Ambiguous/edited sections stay in the original memo. */
export function repeatExamPractice(memo: QuickMemo): ExamPracticeDraft {
  if (!memo.id.startsWith(EXAM_MEMO_PREFIX) || memo.deletedAt || !memo.ownerId)
    throw Error('연습할 주제를 다시 선택해 주세요. 이전 메모는 그대로 남아 있습니다.');
  const lines = memo.body.split('\n');
  const header =
    /^시험 연습 · /.test(lines[0] ?? '') &&
    /^시작: /.test(lines[1] ?? '') &&
    /^종료: /.test(lines[2] ?? '');
  const time = header
    ? /^연습 시간: \d+분 \d+초 · (정한 시간 (10|25|50)분|시간 제한 없음)$/.exec(lines[3] ?? '')
    : null;
  const sections = [...memo.body.matchAll(/\n\n(풀이·답안|막힌 곳|다음에 해 볼 것)\n/g)];
  const order = ['풀이·답안', '막힌 곳', '다음에 해 볼 것'];
  const safe =
    header &&
    sections.every(
      (section, i) => i === 0 || order.indexOf(section[1]) > order.indexOf(sections[i - 1][1]),
    );
  const read = (name: string) => {
    if (!safe) return '';
    const i = sections.findIndex((section) => section[1] === name);
    if (i < 0) return '';
    return memo.body.slice(
      sections[i].index! + sections[i][0].length,
      sections[i + 1]?.index ?? memo.body.length,
    );
  };
  return {
    ...freshExamPractice(memo.ownerId),
    minutes: time ? Number(time[2] ?? 0) : 25,
    previous: {
      memoId: memo.id,
      reflection: read('막힌 곳'),
      nextStep: read('다음에 해 볼 것'),
      timeKnown: Boolean(time),
    },
  };
}
export function readPracticeDraft(key: string) {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return { raw, draft: null };
  const draft: unknown = JSON.parse(raw);
  validate(draft);
  return { raw, draft };
}
export function writePracticeDraft(key: string, draft: ExamPracticeDraft, previous: string | null) {
  validate(draft);
  const raw = JSON.stringify(draft);
  // Keep current text even when storage is full or another writer changed this key.
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) !== previous) {
    rescueWithoutOverwrite(key, raw);
    throw Error('다른 창에서 연습 내용이 바뀌었습니다. 현재 입력도 보존했습니다.');
  }
  storeDraftSafely(key, raw);
  return raw;
}
export function clearPracticeDraft(key: string, previous: string | null) {
  if ((readRescuedDraft(key) ?? localStorage.getItem(key)) !== previous)
    throw Error('연습 내용이 바뀌어 초안을 그대로 남겼습니다.');
  clearStoredDraft(key);
}
export function preservePracticeDraft(key: string, reset = false) {
  archiveDamagedDraft(key, '시험 연습 원문 보관');
  if (reset) clearStoredDraft(key);
}
export function practiceElapsed(draft: ExamPracticeDraft, now = Date.now()) {
  return (
    draft.elapsedMs + (draft.runningSince === null ? 0 : Math.max(0, now - draft.runningSince))
  );
}
export function practiceMemoBody(d: ExamPracticeDraft) {
  const minutes = Math.floor(d.elapsedMs / 60000),
    seconds = Math.floor(d.elapsedMs / 1000) % 60;
  const date = (at: string | null) =>
    at ? new Date(at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) : '';
  return [
    `시험 연습 · ${d.topicName}`,
    `시작: ${date(d.startedAt)}`,
    `종료: ${date(d.endedAt)}`,
    `연습 시간: ${minutes}분 ${seconds}초${d.minutes ? ` · 정한 시간 ${d.minutes}분` : ' · 시간 제한 없음'}`,
    ...(d.answer ? ['\n풀이·답안', d.answer] : []),
    ...(d.reflection ? ['\n막힌 곳', d.reflection] : []),
    ...(d.nextStep ? ['\n다음에 해 볼 것', d.nextStep] : []),
  ].join('\n');
}
export function savePracticeMemo(
  repository: StudyRepository,
  draft: ExamPracticeDraft,
  unlinked = false,
) {
  validate(draft);
  if (!draft.endedAt || !['review', 'saved'].includes(draft.phase))
    throw Error('연습을 마친 뒤 기록을 남겨 주세요.');
  const data = repository.getSnapshot(),
    body = practiceMemoBody(draft),
    ownerId = unlinked ? null : draft.topicId;
  const existing = data.memos?.find((memo) => memo.id === draft.id);
  if (existing) {
    if (
      !existing.deletedAt &&
      existing.ownerId === ownerId &&
      existing.body === body &&
      !existing.strokes.length
    )
      return data;
    throw Error(
      '이 연습 메모가 다른 곳에서 바뀌었습니다. 현재 내용은 별도 메모로 남길 수 있습니다.',
    );
  }
  return repository.execute({
    type: 'saveMemo',
    id: draft.id,
    ownerId,
    body,
    strokes: [],
    expectedVersion: 0,
    opId: crypto.randomUUID(),
    at: new Date().toISOString(),
    userId: data.userId,
    namespace: data.namespace,
  });
}
