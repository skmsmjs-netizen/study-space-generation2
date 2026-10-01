import type { AppState } from '../domain/model';
import { validateMemoContent } from '../domain/memo';
import {
  validateMemoryQuestions,
  validateMemoryTest,
  type MemoryCardContent,
  type MemoryQuestion,
  type MemoryTestContent,
} from '../domain/memory-test';
import { storagePrefix, type StudyRepository } from './repository';
import {
  archiveDamagedDraft,
  readRescuedDraft,
  rescueWithoutOverwrite,
  storeDraftSafely,
} from './draft-safety';

export interface MemoryEditor extends MemoryCardContent {
  id: string;
  baseVersion: number;
}
export interface MemoryAttempt {
  id: string;
  startedAt: string;
  endedAt: string | null;
  questions: MemoryQuestion[];
  index: number;
}
export interface MemoryDraft {
  version: 1;
  phase: 'library' | 'testing' | 'review' | 'saved';
  subjectId: string;
  topicId: string;
  count: number;
  editor: MemoryEditor | null;
  attempt: MemoryAttempt | null;
}
export const freshMemoryDraft = (topicId = ''): MemoryDraft => ({
  version: 1,
  phase: 'library',
  subjectId: '',
  topicId,
  count: 5,
  editor: null,
  attempt: null,
});
export function memoryDraftKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  const key = 'study-space:memory-test-tab:v1';
  let tab = sessionStorage.getItem(key);
  if (!tab) {
    tab = crypto.randomUUID();
    sessionStorage.setItem(key, tab);
  }
  return `${storagePrefix(data)}:draft:memory-test:${tab}:v1`;
}
export function validateMemoryDraft(value: unknown): asserts value is MemoryDraft {
  const d = value as MemoryDraft;
  if (
    d?.version !== 1 ||
    !['library', 'testing', 'review', 'saved'].includes(d.phase) ||
    typeof d.subjectId !== 'string' ||
    typeof d.topicId !== 'string' ||
    !Number.isSafeInteger(d.count) ||
    d.count < 1 ||
    d.count > 50 ||
    (d.phase !== 'library' && !d.attempt) ||
    (d.editor && d.phase !== 'library')
  )
    throw Error('암기시험 초안을 읽지 못했습니다. 원문을 보존했습니다.');
  if (d.editor) {
    const e = d.editor;
    if (
      typeof e.id !== 'string' ||
      !e.id.trim() ||
      !Number.isSafeInteger(e.baseVersion) ||
      e.baseVersion < 0 ||
      typeof e.question !== 'string' ||
      typeof e.topicId !== 'string'
    )
      throw Error('암기 항목 초안을 읽지 못했습니다.');
    validateMemoContent({ ownerId: e.topicId || null, body: e.answer, strokes: e.strokes });
  }
  if (d.attempt) {
    const t = d.attempt;
    if (
      typeof t.id !== 'string' ||
      !t.id.trim() ||
      typeof t.startedAt !== 'string' ||
      !Number.isFinite(Date.parse(t.startedAt)) ||
      !Number.isSafeInteger(t.index) ||
      t.index < 0 ||
      !Array.isArray(t.questions) ||
      t.index >= t.questions.length ||
      (t.endedAt !== null &&
        (typeof t.endedAt !== 'string' || !Number.isFinite(Date.parse(t.endedAt))))
    )
      throw Error('응시 중인 암기시험을 읽지 못했습니다.');
    validateMemoryQuestions(t.questions);
    if (
      (d.phase === 'testing' && t.endedAt !== null) ||
      (['review', 'saved'].includes(d.phase) && t.endedAt === null)
    )
      throw Error('시험의 종료 상태를 확인해 주세요.');
    if (t.endedAt) validateMemoryTest({ ...t, endedAt: t.endedAt });
  }
}
export function readMemoryDraft(key: string) {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return { raw: null, draft: null };
  const draft: unknown = JSON.parse(raw);
  validateMemoryDraft(draft);
  return { raw, draft };
}
export function writeMemoryDraft(key: string, draft: MemoryDraft, previous: string | null) {
  validateMemoryDraft(draft);
  const raw = JSON.stringify(draft);
  let saved: string | null;
  try {
    saved = readRescuedDraft(key) ?? localStorage.getItem(key);
  } catch (e) {
    rescueWithoutOverwrite(key, raw);
    throw e;
  }
  if (saved !== previous) {
    // Archive the durable competing source before a rescued draft can later replace it.
    try {
      archiveDamagedDraft(key, '암기시험 초안 동시 변경 원문');
    } catch {
      rescueWithoutOverwrite(key, raw);
      throw Error(
        '다른 창의 원문 사본을 보관하지 못했습니다. 새로고침 전 현재 초안을 파일로 보관해 주세요.',
      );
    }
    rescueWithoutOverwrite(key, raw);
    throw Error('다른 창에서 초안이 바뀌었습니다. 두 원문을 보존했습니다.');
  }
  storeDraftSafely(key, raw);
  return raw;
}
function context(repository: StudyRepository) {
  const data = repository.getSnapshot();
  return {
    userId: data.userId,
    namespace: data.namespace,
    opId: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
}
export function saveMemoryEditor(repository: StudyRepository, editor: MemoryEditor) {
  const existing = repository.getSnapshot().memoryCards?.find((c) => c.id === editor.id);
  if (
    existing &&
    !existing.deletedAt &&
    existing.topicId === editor.topicId &&
    existing.question === editor.question &&
    existing.answer === editor.answer &&
    JSON.stringify(existing.strokes) === JSON.stringify(editor.strokes)
  )
    return repository.getSnapshot();
  return repository.execute({
    ...context(repository),
    type: 'saveMemoryCard',
    id: editor.id,
    expectedVersion: editor.baseVersion,
    content: {
      topicId: editor.topicId,
      question: editor.question,
      answer: editor.answer,
      strokes: editor.strokes,
    },
  });
}
export function saveMemoryAttempt(repository: StudyRepository, attempt: MemoryAttempt) {
  if (!attempt.endedAt) throw Error('시험을 마친 뒤 결과를 남겨 주세요.');
  const content: MemoryTestContent = {
    startedAt: attempt.startedAt,
    endedAt: attempt.endedAt,
    questions: attempt.questions,
  };
  validateMemoryTest(content);
  const existing = repository.getSnapshot().memoryTests?.find((t) => t.id === attempt.id);
  if (existing) {
    if (
      existing.startedAt === content.startedAt &&
      existing.endedAt === content.endedAt &&
      JSON.stringify(existing.questions) === JSON.stringify(content.questions)
    )
      return repository.getSnapshot();
    throw Error('이 시험 결과가 이미 저장되어 있습니다. 현재 답안도 초안에 유지했습니다.');
  }
  return repository.execute({
    ...context(repository),
    type: 'saveMemoryTest',
    id: attempt.id,
    content,
  });
}
