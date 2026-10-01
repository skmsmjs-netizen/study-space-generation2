import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { applyCommand } from './commands';
import { memoryQuestions } from './memory-test';
import {
  topicMemoryInput,
  topicGeneratedContent,
  validateMemoryGenerationDraft,
  type MemoryGenerationDraft,
} from './topic-memory';
import { registerTopicMemory } from '../data/topic-memory';
import type { Command } from './model';
const topic = 'demo-topic-function';
function setup() {
  let data = createDemoState();
  const repository = {
    getSnapshot: () => data,
    execute: (c: Command) => (data = applyCommand(data, c)),
  };
  const input = topicMemoryInput(data, [topic], 5);
  const draft: MemoryGenerationDraft = {
    input,
    result: {
      id: 'r',
      at: '2026-10-01T00:00:00Z',
      model: 'test',
      input,
      cards: [{ id: 'c', topicId: topic, question: '함수란?', answer: '원래 생성 답안' }],
    },
    items: [
      {
        id: 'c',
        question: '함수란?',
        answer: '확인하고 고친 답안',
        reviewed: true,
        included: true,
      },
    ],
  };
  return { repository, draft };
}
it('builds subject and exact hierarchy context without requiring notes or guessing performance', () => {
  const { repository, draft } = setup();
  expect(draft.input.subject.name).toBe('수학의 기초');
  expect(draft.input.topics[0].path.map((n) => n.id)).toEqual([
    'demo-unit-functions',
    'demo-outline-functions',
    topic,
  ]);
  expect(() => topicMemoryInput(repository.getSnapshot(), [topic, 'demo-topic-force'])).toThrow();
  expect(() => topicMemoryInput(repository.getSnapshot(), [topic], 31)).toThrow();
  const bad = structuredClone(draft);
  bad.items[0].id = 'not-generated';
  expect(() => validateMemoryGenerationDraft(bad)).toThrow();
});
it('bounds accumulated topic scopes without silently truncating the selected subjects', () => {
  const { repository } = setup();
  const data = structuredClone(repository.getSnapshot());
  const original = data.nodes.find((n) => n.id === topic)!;
  for (let i = 0; i < 25; i++)
    data.nodes.push({
      ...original,
      id: `accumulated-${i}`,
      name: `긴 이름을 가진 같은 목차의 추가 주제 ${i}`,
    });
  const ids = Array.from({ length: 20 }, (_, i) => `accumulated-${i}`);
  expect(topicMemoryInput(data, ids).topics).toHaveLength(20);
  expect(() => topicMemoryInput(data, [...ids, 'accumulated-20'])).toThrow();
  expect(data.nodes).toHaveLength(repository.getSnapshot().nodes.length + 25);
});
it('requires review, preserves original versus edited answer and keeps registration idempotent', () => {
  const { repository, draft } = setup();
  draft.result!.promptVersion = 'study-gpt-2026-10-01-v2';
  const original = structuredClone(repository.getSnapshot());
  draft.items[0].reviewed = false;
  expect(() => topicGeneratedContent(draft, 'c')).toThrow('확인');
  draft.items[0].reviewed = true;
  registerTopicMemory(repository, draft, 'c');
  const saved = repository.getSnapshot().memoryCards![0];
  expect(saved.answer).toBe('확인하고 고친 답안');
  expect(saved.topicGeneration?.originalAnswer).toBe('원래 생성 답안');
  expect(saved.topicGeneration?.promptVersion).toBe(draft.result!.promptVersion);
  expect(registerTopicMemory(repository, draft, 'c').existing).toBe(true);
  const second = structuredClone(draft);
  second.result!.id = 'another-generation';
  expect(registerTopicMemory(repository, second, 'c').existing).toBe(true);
  expect(repository.getSnapshot().memoryCards).toHaveLength(1);
  expect(repository.getSnapshot().records).toEqual(original.records);
  expect(repository.getSnapshot().sessions).toEqual(original.sessions);
});
it('keeps original context after topic renames, freezes test source and refuses fabricated provenance', () => {
  const { repository, draft } = setup();
  const before = repository.getSnapshot();
  repository.execute({
    type: 'renameNode',
    id: topic,
    name: '새 이름',
    expectedVersion: 1,
    opId: 'rename',
    at: '2026-10-01T01:00:00Z',
    userId: before.userId,
    namespace: before.namespace,
  });
  registerTopicMemory(repository, draft, 'c');
  const data = repository.getSnapshot(),
    card = data.memoryCards![0],
    frozen = memoryQuestions(data, [card], 1)[0];
  expect(card.topicGeneration!.input.topics[0].path.at(-1)!.name).toBe('함수는 어떤 관계일까?');
  expect(frozen.topicGeneration).toEqual(card.topicGeneration);
  const source = structuredClone(card.topicGeneration!);
  source.originalAnswer = '바꾼 원본';
  expect(() =>
    repository.execute({
      type: 'saveMemoryCard',
      id: card.id,
      expectedVersion: card.version,
      content: { ...card, topicGeneration: source },
      opId: 'rewrite-source',
      at: '2026-10-01T02:00:00Z',
      userId: data.userId,
      namespace: data.namespace,
    }),
  ).toThrow('출처');
  const forged = structuredClone(draft);
  forged.input.subject.name = '존재하지 않는 과목';
  forged.result!.id = 'forged-result';
  forged.items[0].question = '다른 질문';
  expect(() => registerTopicMemory(repository, forged, 'c')).toThrow();
});
