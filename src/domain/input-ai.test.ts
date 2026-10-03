import { expect, it } from 'vitest';
import { emptyState } from './model';
import { applyCommand } from './commands';
import { inputAIFollowup, inputAIMaterial, subjectAIInput } from './input-ai';
import { AI_OWNER_USER_ID } from './ai-access';
import type { MaterialResult } from './study-material';

const owner = {
  userId: AI_OWNER_USER_ID,
  namespace: 'personal' as const,
  opId: 's',
  at: '2026-10-03T00:00:00Z',
};
const seed = () =>
  applyCommand(emptyState(owner.userId, owner.namespace), {
    ...owner,
    type: 'addSubject',
    id: 's',
    name: '합성 과목',
    scope: { kind: 'independent' },
  });
it('takes exact unsaved UTF16 input without choosing an unrelated subject or modifying the source', () => {
  const data = seed(),
    raw = '  가설 \r\n조건·예외 😀 e\u0301\n';
  const before = JSON.stringify(data);
  const content = inputAIMaterial(data, { key: 'code:c', title: '코드', text: raw }, 'code');
  expect(content.sourceText.endsWith(raw)).toBe(true);
  expect(content.subjectId).toBe('');
  expect(content.results).toEqual([]);
  expect(JSON.stringify(data)).toBe(before);
  expect(() => inputAIMaterial(data, { key: 'x', title: 'x', text: '' }, 'code')).toThrow();
  expect(() =>
    inputAIMaterial(data, { key: 'x', title: 'x', text: 'x'.repeat(150000) }, 'code'),
  ).toThrow();
});
it('continues the actual problem, attempt and reference without turning generated feedback into evidence', () => {
  const content = inputAIMaterial(
    seed(),
    { key: 'record:r', title: '답안', text: 'I=VR', subjectId: 's' },
    'feedback',
  );
  content.aiRequest = {
    task: 'feedback',
    problem: 'V=10, R=5',
    attempt: 'I=VR',
    reference: 'I=V/R',
    requestedCardCount: 20,
  };
  const result = {
    id: 'g',
    at: owner.at,
    model: 'synthetic',
    segments: [],
    cards: [],
    request: structuredClone(content.aiRequest),
    summary: [{ text: 'GPT 자체 검토', sourceIds: [] }],
  } as MaterialResult;
  const next = inputAIFollowup(content, result, 'practice');
  expect(next.aiRequest).toMatchObject({
    task: 'practice',
    problem: 'V=10, R=5',
    attempt: 'I=VR',
    reference: 'I=V/R',
    requestedCardCount: 20,
  });
  expect(JSON.stringify(next)).not.toContain('GPT 자체 검토');
  expect(content.aiRequest.task).toBe('feedback');
  expect(next.sourceText).toBe(content.sourceText);
});
it('discloses a recent 20-input window and excludes unrelated, deleted, global and foreign notes', () => {
  const data = seed(),
    base = {
      userId: owner.userId,
      namespace: owner.namespace,
      version: 1,
      createdAt: owner.at,
      updatedAt: owner.at,
      deletedAt: null,
    };
  data.memos = Array.from({ length: 22 }, (_, i) => ({
    ...base,
    id: `m${i}`,
    ownerId: 's',
    body: `의문 ${i}`,
    strokes: [],
    updatedAt: new Date(Date.parse(owner.at) + i * 1000).toISOString(),
  }));
  data.memos.push(
    { ...base, id: 'global', ownerId: null, body: '전역 개인 글', strokes: [] },
    { ...base, id: 'foreign', userId: 'other', ownerId: 's', body: '타인 기록', strokes: [] },
    { ...base, id: 'trash', ownerId: 's', body: '휴지통', strokes: [], deletedAt: owner.at },
  );
  const input = subjectAIInput(data, 's');
  expect(input.title).toContain('20개');
  expect(input.text).toContain('의문 21');
  expect(input.text).not.toContain('의문 0');
  expect(input.text).not.toMatch(/전역 개인 글|타인 기록|휴지통/);
});
