import { expect, it } from 'vitest';
import { activeStudyAIRequest, validateStudyAIRequest } from './study-ai-request';
it('validates saved generation counts and keeps this preference out of model data', () => {
  for (const requestedCardCount of [5, 10, 20, 30]) {
    const draft = { task: 'summary' as const, requestedCardCount };
    expect(() => validateStudyAIRequest(draft, false)).not.toThrow();
    expect(activeStudyAIRequest(draft as never)).toEqual({ task: 'summary' });
    expect(draft.requestedCardCount).toBe(requestedCardCount);
  }
  for (const requestedCardCount of [0, 1, 31, '5', null])
    expect(() => validateStudyAIRequest({ task: 'summary', requestedCardCount }, false)).toThrow(/개수/);
});
it('keeps incomplete drafts but requires the real problem, attempt and criteria before generation', () => {
  expect(() =>
    validateStudyAIRequest({ task: 'feedback', attempt: '부분 풀이' }, false),
  ).not.toThrow();
  for (const row of [
    { task: 'hint', problem: '조건' },
    { task: 'feedback', problem: '조건', attempt: '풀이' },
    { task: 'practice', problem: '문제' },
  ])
    expect(() => validateStudyAIRequest(row)).toThrow();
  expect(() =>
    validateStudyAIRequest({
      task: 'feedback',
      problem: '조건',
      attempt: '풀이',
      reference: '기준',
    }),
  ).not.toThrow();
});
it('only sends fields shown by the active task, preserving the draft fields without sending them', () => {
  const draft = {
    task: 'formula' as const,
    focus: '수식으로 옮기기',
    problem: '이전 문제',
    attempt: '이전 답안',
    reference: '이전 해설',
  };
  expect(activeStudyAIRequest(draft)).toEqual({ task: 'formula', focus: '수식으로 옮기기' });
  expect(draft.attempt).toBe('이전 답안');
  expect(() => activeStudyAIRequest({ task: 'unknown' } as never)).toThrow();
});
it('requires the actual question for source-grounded answers, while preserving incomplete drafts', () => {
  expect(() => validateStudyAIRequest({ task: 'tutor' }, false)).not.toThrow();
  expect(() => validateStudyAIRequest({ task: 'tutor', focus: '   ' })).toThrow(/질문/);
  expect(
    activeStudyAIRequest({
      task: 'tutor',
      focus: '자료에 조건이 있나요?',
      attempt: '이전 답안',
    }),
  ).toEqual({ task: 'tutor', focus: '자료에 조건이 있나요?' });
});
