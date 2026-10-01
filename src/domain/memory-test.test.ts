import { describe, expect, it } from 'vitest';
import { applyCommand } from './commands';
import { createDemoState } from './fixtures';
import type { Command } from './model';
import { memoryCardsInScope, memoryQuestions, memorySummary } from './memory-test';
const context = { userId: 'demo-user', namespace: 'demo' as const, at: '2026-10-01T04:00:00.000Z' };
const ink = [
  { id: 'ink', ink: 'blue' as const, width: 3, points: [{ x: 10, y: 20, pressure: 0.4 }] },
];
function setup() {
  const initial = createDemoState();
  const command: Command = {
    ...context,
    userId: initial.userId,
    opId: 'card-create',
    type: 'saveMemoryCard',
    id: 'card',
    expectedVersion: 0,
    content: {
      topicId: 'demo-topic-function',
      question: '  식을 쓰시오\n',
      answer: '  답\r\n\u0000\ud800 ',
      strokes: ink,
    },
  };
  return { initial, command, data: applyCommand(initial, command) };
}
describe('memory cards and tests preserve source, ownership and actual response meaning', () => {
  it('freezes original text and ink; later editing/trash preserves old tests and records', () => {
    const { initial, data, command } = setup();
    const questions = memoryQuestions(data, data.memoryCards!, 5);
    const edited = applyCommand(data, {
      ...command,
      opId: 'edit',
      expectedVersion: 1,
      content: { ...command.content, answer: '새 답안' },
    });
    questions[0].response = '  내 답\n';
    questions[0].responseStrokes = ink;
    questions[0].verdict = 'partial';
    const content = { startedAt: context.at, endedAt: context.at, questions };
    const saved = applyCommand(edited, {
      ...context,
      userId: data.userId,
      opId: 'test',
      type: 'saveMemoryTest',
      id: 'test',
      content,
    });
    const trashed = applyCommand(saved, {
      ...context,
      userId: data.userId,
      opId: 'trash',
      type: 'trashMemoryCard',
      id: 'card',
      expectedVersion: 2,
    });
    expect(trashed.memoryTests![0].questions[0].answer).toBe(command.content.answer);
    expect(trashed.memoryTests![0].questions[0].strokes).toEqual(ink);
    expect(trashed.records).toEqual(initial.records);
    expect(trashed.sessions).toEqual(initial.sessions);
    expect(
      memoryCardsInScope(
        trashed,
        data.subjects.map((s) => s.id),
      ),
    ).toHaveLength(0);
    const restored = applyCommand(trashed, {
      ...context,
      userId: data.userId,
      opId: 'restore',
      type: 'restoreMemoryCard',
      id: 'card',
      expectedVersion: 3,
    });
    expect(restored.memoryCards![0].id).toBe('card');
    expect(restored.memoryCards![0].answer).toBe('새 답안');
  });
  it('does not count blanks, uncertain or unassessed answers as incorrect', () => {
    const { data } = setup(),
      questions = memoryQuestions(data, data.memoryCards!, 1);
    expect(memorySummary(questions)).toEqual({
      correct: 0,
      partial: 0,
      wrong: 0,
      uncertain: 0,
      unassessed: 1,
    });
    expect(() =>
      applyCommand(data, {
        ...context,
        userId: data.userId,
        opId: 'test',
        type: 'saveMemoryTest',
        id: 'test',
        content: {
          startedAt: context.at,
          endedAt: context.at,
          questions: [{ ...questions[0], verdict: 'wrong' }],
        },
      }),
    ).toThrow('미판정');
  });
  it('rejects source forgery, stale edits, wrong owners and duplicate changed operations atomically', () => {
    const { initial, data, command } = setup(),
      before = structuredClone(data);
    expect(applyCommand(data, command)).toBe(data);
    expect(() => applyCommand(data, { ...command, userId: 'other' })).toThrow('다른 사용자');
    expect(() => applyCommand(data, { ...command, opId: 'stale', expectedVersion: 0 })).toThrow(
      '변경',
    );
    expect(() =>
      applyCommand(data, { ...command, content: { ...command.content, answer: '위조' } }),
    ).toThrow('같은 요청');
    const questions = memoryQuestions(data, data.memoryCards!, 1);
    questions[0].answer = '없는 답';
    expect(() =>
      applyCommand(data, {
        ...context,
        userId: data.userId,
        opId: 'test',
        type: 'saveMemoryTest',
        id: 'test',
        content: { startedAt: context.at, endedAt: context.at, questions },
      }),
    ).toThrow('출제 당시');
    expect(data).toEqual(before);
    expect(initial.memoryCards).toBeUndefined();
  });
});
