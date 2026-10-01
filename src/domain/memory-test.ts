import { DomainError, type AppState, type Entity, type MemoStroke } from './model';
import { validateMemoContent } from './memo';
import { recallPath } from './topic-recall';
import { validateTopicGenerationSource, type TopicGenerationSource } from './topic-memory';

export interface MemoryCardContent {
  topicGeneration?: TopicGenerationSource;
  materialSource?: import('./learning-evidence').MaterialCardSource;
  topicId: string;
  question: string;
  answer: string;
  strokes: MemoStroke[];
}
export interface MemoryCard extends Entity, MemoryCardContent {}
export type MemoryVerdict = 'correct' | 'partial' | 'wrong' | 'uncertain' | null;
export interface MemoryQuestion extends MemoryCardContent {
  cardId: string;
  cardVersion: number;
  topicName: string;
  response: string;
  responseStrokes: MemoStroke[];
  verdict: MemoryVerdict;
}
export interface MemoryTestContent {
  startedAt: string;
  endedAt: string;
  questions: MemoryQuestion[];
}
export interface MemoryTest extends Entity, MemoryTestContent {}
function bad(message: string): never {
  throw new DomainError('INVALID_MEMORY_TEST', message);
}
export function validateMemoryCard(
  value: unknown,
  complete = true,
): asserts value is MemoryCardContent {
  const c = value as MemoryCardContent | null;
  if (
    !c ||
    typeof c.topicId !== 'string' ||
    !c.topicId.trim() ||
    typeof c.question !== 'string' ||
    typeof c.answer !== 'string'
  )
    bad('암기 항목의 질문과 답안을 확인해 주세요.');
  validateMemoContent({ ownerId: c.topicId, body: c.answer, strokes: c.strokes });
  if (c.topicGeneration !== undefined) {
    validateTopicGenerationSource(c.topicGeneration);
    if (c.materialSource || !c.topicGeneration.input.topics.some(t => t.id === c.topicId))
      bad('주제 기반 생성과 원자료 기반 출처를 구별해 주세요.');
  }
  if (complete && (!c.question.trim() || (!c.answer.trim() && !c.strokes.length)))
    bad('질문과 기준 답안을 넣어 주세요. 답안은 그림만 있어도 됩니다.');
}
export function validateMemoryQuestions(value: unknown): asserts value is MemoryQuestion[] {
  if (!Array.isArray(value) || !value.length || value.length > 50)
    bad('시험에 넣을 항목은 1개부터 50개까지 선택해 주세요.');
  const ids = new Set<string>();
  for (const q of value as MemoryQuestion[]) {
    validateMemoryCard(q);
    if (
      typeof q.cardId !== 'string' ||
      !q.cardId.trim() ||
      ids.has(q.cardId) ||
      !Number.isSafeInteger(q.cardVersion) ||
      q.cardVersion < 1 ||
      typeof q.topicName !== 'string' ||
      ![null, 'correct', 'partial', 'wrong', 'uncertain'].includes(q.verdict)
    )
      bad('문항의 원래 항목과 비교 결과를 확인해 주세요.');
    ids.add(q.cardId);
    validateMemoContent({ ownerId: q.topicId, body: q.response, strokes: q.responseStrokes });
    if (
      !q.response.trim() &&
      !q.responseStrokes.length &&
      ['correct', 'partial', 'wrong'].includes(q.verdict ?? '')
    )
      bad('답하지 않은 문항은 미판정으로 남겨 주세요.');
  }
}
export function validateMemoryTest(value: unknown): asserts value is MemoryTestContent {
  const t = value as MemoryTestContent;
  if (
    !t ||
    ![t.startedAt, t.endedAt].every(
      (x) => typeof x === 'string' && Number.isFinite(Date.parse(x)),
    ) ||
    Date.parse(t.startedAt) > Date.parse(t.endedAt)
  )
    bad('시험의 시작과 종료 시각을 확인해 주세요.');
  validateMemoryQuestions(t.questions);
}
export function memoryCardsInScope(
  data: AppState,
  subjectIds: string[],
  subjectId = '',
  topicId = '',
) {
  return (data.memoryCards ?? []).filter(
    (card) =>
      !card.deletedAt &&
      (!topicId || card.topicId === topicId) &&
      data.nodes.some(
        (node) =>
          node.id === card.topicId &&
          node.role === 'topic' &&
          subjectIds.includes(node.subjectId) &&
          (!subjectId || node.subjectId === subjectId) &&
          data.subjects.some((s) => s.id === node.subjectId && !s.deletedAt) &&
          recallPath(data.nodes, node.id).every((n) => !n.deletedAt),
      ),
  );
}
/** Frozen source text and original ink stay independent of later card edits or trash. */
export function memoryQuestions(
  data: AppState,
  cards: MemoryCard[],
  count: number,
  random = Math.random,
): MemoryQuestion[] {
  if (!Number.isSafeInteger(count) || count < 1 || count > 50 || !cards.length)
    bad('시험에 넣을 항목 수를 확인해 주세요.');
  const pool = [...cards];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return structuredClone(
    pool
      .slice(0, count)
      .map((c) => ({
        topicId: c.topicId,
        question: c.question,
        answer: c.answer,
        strokes: c.strokes,
        ...(c.topicGeneration ? { topicGeneration: structuredClone(c.topicGeneration) } : {}),
        cardId: c.id,
        cardVersion: c.version,
        topicName: data.nodes.find((n) => n.id === c.topicId)?.name ?? '',
        response: '',
        responseStrokes: [],
        verdict: null,
      })),
  );
}
export function memorySummary(questions: MemoryQuestion[]) {
  return {
    correct: questions.filter((q) => q.verdict === 'correct').length,
    partial: questions.filter((q) => q.verdict === 'partial').length,
    wrong: questions.filter((q) => q.verdict === 'wrong').length,
    uncertain: questions.filter((q) => q.verdict === 'uncertain').length,
    unassessed: questions.filter((q) => q.verdict === null).length,
  };
}
