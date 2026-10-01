import type { StudyRepository } from './repository';
import { topicGeneratedContent, type MemoryGenerationDraft } from '../domain/topic-memory';

/** Stable registration IDs make storage retries independent of GPT and preserve subsequent edits. */
export function registerTopicMemory(
  repository: StudyRepository,
  draft: MemoryGenerationDraft,
  cardId: string,
) {
  const data = repository.getSnapshot(),
    content = topicGeneratedContent(draft, cardId);
  const id = `topic-gpt:${encodeURIComponent(content.topicGeneration.resultId)}:${encodeURIComponent(cardId)}`;
  const existing = data.memoryCards?.find(
    (c) =>
      c.id === id ||
      (c.topicId === content.topicId &&
        c.question.trim() === content.question.trim() &&
        c.answer.trim() === content.answer.trim() &&
        !c.strokes.length),
  );
  if (existing) return { data, id, existing: true, deleted: !!existing.deletedAt };
  return {
    id,
    existing: false,
    deleted: false,
    data: repository.execute({
      type: 'saveMemoryCard',
      id,
      expectedVersion: 0,
      content,
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
      userId: data.userId,
      namespace: data.namespace,
    }),
  };
}
