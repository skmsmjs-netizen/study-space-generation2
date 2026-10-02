import { DomainError, type AppState } from './model';
import { recallPath } from './topic-recall';

export const TOPIC_MEMORY_DEFAULT_COUNT = 3;
export const TOPIC_MEMORY_WAIT_MS = 10_000;
export const TOPIC_MEMORY_TIMEOUT_MESSAGE = '10초 안에 생성을 마치지 못해 기다림을 끝냈습니다. 선택한 목차와 입력은 유지했습니다. 항목 수를 줄이거나 직접 다시 요청해 주세요.';

export interface TopicMemoryInput {
  subject: { id: string; name: string; version: number };
  topics: { id: string; path: { id: string; name: string; version: number }[] }[];
  count: number;
  guidance: string;
}
export interface TopicMemoryResult {
  evidenceType?: 'topic-general';
  diagnostics?: { kind: 'needs-input' | 'insufficient-evidence'; message: string; questions?: string[] }[];
  id: string;
  at: string;
  model: string;
  promptVersion?: string;
  input: TopicMemoryInput;
  cards: { id: string; topicId: string; question: string; answer: string }[];
}
export interface TopicGenerationSource {
  evidenceType?: 'topic-general';
  kind: 'topic';
  resultId: string;
  cardId: string;
  at: string;
  model: string;
  promptVersion?: string;
  input: TopicMemoryInput;
  originalQuestion: string;
  originalAnswer: string;
  reviewed: true;
}
export interface MemoryGenerationDraft {
  input: TopicMemoryInput;
  result: TopicMemoryResult | null;
  items: { id: string; question: string; answer: string; included: boolean; reviewed: boolean }[];
}
const text = (v: unknown, max: number, required = true) =>
  typeof v === 'string' && v.length <= max && (!required || !!v.trim());
function invalid(): never {
  throw new DomainError(
    'INVALID_TOPIC_GENERATION',
    '주제 기반 생성의 범위와 질문·답안을 확인해 주세요.',
  );
}
export function validateTopicMemoryInput(value: unknown): asserts value is TopicMemoryInput {
  const v = value as TopicMemoryInput;
  if (
    !v ||
    !text(v.subject?.id, 256) ||
    !text(v.subject.name, 500) ||
    !Number.isSafeInteger(v.subject.version) ||
    v.subject.version < 1 ||
    !Number.isSafeInteger(v.count) ||
    v.count < 1 ||
    v.count > 30 ||
    !text(v.guidance, 2000, false) ||
    !Array.isArray(v.topics) ||
    !v.topics.length ||
    v.topics.length > 20
  )
    invalid();
  const ids = new Set<string>();
  for (const t of v.topics) {
    if (
      !text(t?.id, 256) ||
      ids.has(t.id) ||
      !Array.isArray(t.path) ||
      !t.path.length ||
      t.path.length > 20 ||
      t.path.at(-1)?.id !== t.id
    )
      invalid();
    ids.add(t.id);
    const pathIds = new Set<string>();
    for (const n of t.path) {
      if (
        !text(n?.id, 256) ||
        !text(n.name, 500) ||
        !Number.isSafeInteger(n.version) ||
        n.version < 1 ||
        pathIds.has(n.id)
      )
        invalid();
      pathIds.add(n.id);
    }
  }
  if (JSON.stringify(v).length > 32_000) invalid();
}
export function topicMemoryInput(
  data: AppState,
  topicIds: string[],
  count = TOPIC_MEMORY_DEFAULT_COUNT,
  guidance = '',
): TopicMemoryInput {
  const topics = [...new Set(topicIds)].map((id) => {
    const topic = data.nodes.find((n) => n.id === id && n.role === 'topic' && !n.deletedAt);
    if (!topic) invalid();
    const path = recallPath(data.nodes, id);
    if (path.some((n) => n.deletedAt || n.subjectId !== topic.subjectId)) invalid();
    return { topic, path: path.map(({ id, name, version }) => ({ id, name, version })) };
  });
  const subject = data.subjects.find((s) => s.id === topics[0]?.topic.subjectId && !s.deletedAt);
  if (!subject || topics.some((t) => t.topic.subjectId !== subject.id)) invalid();
  const input = {
    subject: { id: subject.id, name: subject.name, version: subject.version },
    topics: topics.map((t) => ({ id: t.topic.id, path: t.path })),
    count,
    guidance,
  };
  validateTopicMemoryInput(input);
  return input;
}
export function validateTopicMemoryResult(value: unknown): asserts value is TopicMemoryResult {
  const r = value as TopicMemoryResult;
  if (r?.evidenceType !== undefined && r.evidenceType !== 'topic-general') invalid();
  if (r?.diagnostics !== undefined && (!Array.isArray(r.diagnostics) || r.diagnostics.length > 10 || r.diagnostics.some(d => !d || !['needs-input','insufficient-evidence'].includes(d.kind) || !text(d.message, 4000) || d.questions !== undefined && (!Array.isArray(d.questions) || d.questions.length > 2 || d.questions.some(q => !text(q, 1000)))))) invalid();
  if (r?.promptVersion !== undefined && !text(r.promptVersion, 160)) invalid();
  if (
    !r ||
    !text(r.id, 256) ||
    !text(r.model, 160) ||
    !text(r.at, 40) ||
    !Number.isFinite(Date.parse(r.at))
  )
    invalid();
  validateTopicMemoryInput(r.input);
  if (!Array.isArray(r.cards) || (!r.cards.length && !r.diagnostics?.length) || r.cards.length > r.input.count) invalid();
  const ids = new Set<string>();
  for (const c of r.cards) {
    if (
      !text(c?.id, 256) ||
      ids.has(c.id) ||
      !r.input.topics.some((t) => t.id === c.topicId) ||
      !text(c.question, 4000) ||
      !text(c.answer, 10_000)
    )
      invalid();
    ids.add(c.id);
  }
}
export function validateTopicGenerationSource(
  value: unknown,
): asserts value is TopicGenerationSource {
  const s = value as TopicGenerationSource;
  if (s?.evidenceType !== undefined && s.evidenceType !== 'topic-general') invalid();
  if (s?.promptVersion !== undefined && !text(s.promptVersion, 160)) invalid();
  if (
    s?.kind !== 'topic' ||
    s.reviewed !== true ||
    !text(s.resultId, 256) ||
    !text(s.cardId, 256) ||
    !text(s.model, 160) ||
    !text(s.at, 40) ||
    !Number.isFinite(Date.parse(s.at)) ||
    !text(s.originalQuestion, 4000) ||
    !text(s.originalAnswer, 10_000)
  )
    invalid();
  validateTopicMemoryInput(s.input);
}
export function validateMemoryGenerationDraft(
  value: unknown,
): asserts value is MemoryGenerationDraft {
  const d = value as MemoryGenerationDraft;
  if (!d) invalid();
  validateTopicMemoryInput(d.input);
  if (d.result === null) {
    if (!Array.isArray(d.items) || d.items.length) invalid();
    return;
  }
  validateTopicMemoryResult(d.result);
  if (
    JSON.stringify(d.input) !== JSON.stringify(d.result.input) ||
    !Array.isArray(d.items) ||
    d.items.length !== d.result.cards.length
  )
    invalid();
  const ids = new Set<string>();
  for (const i of d.items) {
    if (
      !i ||
      ids.has(i.id) ||
      !d.result.cards.some((c) => c.id === i.id) ||
      !text(i.question, 4000, false) ||
      !text(i.answer, 10_000, false) ||
      typeof i.included !== 'boolean' ||
      typeof i.reviewed !== 'boolean'
    )
      invalid();
    ids.add(i.id);
  }
}
/** This describes generated background knowledge; it never claims a lecture source or mastery. */
export function topicGeneratedContent(
  draft: MemoryGenerationDraft,
  cardId: string,
): import('./memory-test').MemoryCardContent & { topicGeneration: TopicGenerationSource } {
  validateMemoryGenerationDraft(draft);
  const r = draft.result,
    i = draft.items.find((c) => c.id === cardId),
    c = r?.cards.find((c) => c.id === cardId);
  if (!r || !i || !c || !i.included || !i.reviewed || !i.question.trim() || !i.answer.trim())
    throw new DomainError('REVIEW_REQUIRED', '등록할 질문과 기준 답안을 확인해 주세요.');
  return {
    topicId: c.topicId,
    question: i.question,
    answer: i.answer,
    strokes: [],
    topicGeneration: {
      kind: 'topic',
      ...(r.evidenceType ? { evidenceType: r.evidenceType } : {}),
      resultId: r.id,
      cardId: c.id,
      at: r.at,
      model: r.model,
      ...(r.promptVersion ? { promptVersion: r.promptVersion } : {}),
      input: structuredClone(r.input),
      originalQuestion: c.question,
      originalAnswer: c.answer,
      reviewed: true,
    },
  };
}
