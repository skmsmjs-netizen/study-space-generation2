import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from './demo-repository';
import {
  freshExamPractice,
  practiceDraftKey,
  practiceElapsed,
  readPracticeDraft,
  writePracticeDraft,
  savePracticeMemo,
  preservePracticeDraft,
} from './exam-practice';
import { readRescuedDraft } from './draft-safety';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
const finished = () => ({
  ...freshExamPractice('demo-topic-function'),
  topicName: '함수는 어떤 관계일까?',
  phase: 'review' as const,
  startedAt: '2026-10-01T04:00:00.000Z',
  endedAt: '2026-10-01T04:25:00.000Z',
  elapsedMs: 90000,
  answer: '  내 풀이\r\n조건이 있을 때  ',
  reflection: '  해설을 보고 풀었다  ',
  nextStep: '정의를 설명해 보기',
});
it('restores active text and timing in the same tab while keeping accounts and new tabs separate', () => {
  const data = new DemoRepository(localStorage).getSnapshot(),
    key = practiceDraftKey(data);
  const draft = { ...finished(), phase: 'running' as const, endedAt: null, runningSince: 1000 };
  const raw = writePracticeDraft(key, draft, null);
  expect(readPracticeDraft(practiceDraftKey(data))).toEqual({ raw, draft });
  expect(practiceDraftKey({ ...data, namespace: 'personal', userId: 'another-user' })).not.toBe(
    key,
  );
  sessionStorage.clear();
  expect(readPracticeDraft(practiceDraftKey(data)).draft).toBeNull();
  expect(localStorage.getItem(key)).toBe(raw);
});
it('excludes pauses and counts elapsed wall time after a reload without losing overtime', () => {
  const draft = { ...finished(), phase: 'running' as const, runningSince: 1000 };
  expect(practiceElapsed(draft, 11000)).toBe(100000);
  expect(practiceElapsed({ ...draft, phase: 'paused', runningSince: null }, 11000)).toBe(90000);
  expect(practiceElapsed(draft, 0)).toBe(90000);
});
it('stores one exact memo through the repository without creating study checks, sessions or scores', () => {
  const repo = new DemoRepository(localStorage),
    before = repo.getSnapshot(),
    draft = finished();
  const saved = savePracticeMemo(repo, draft);
  expect(saved.memos?.find((m) => m.id === draft.id)).toMatchObject({ ownerId: draft.topicId });
  expect(saved.memos?.find((m) => m.id === draft.id)?.body).toContain(draft.answer);
  expect(saved.memos?.find((m) => m.id === draft.id)?.body).toContain(draft.reflection);
  expect(saved.records).toEqual(before.records);
  expect(saved.sessions).toEqual(before.sessions);
  expect(savePracticeMemo(repo, draft)).toBe(saved);
  expect(new DemoRepository(localStorage).getSnapshot().memos).toEqual(saved.memos);
  repo.execute({
    type: 'saveMemo',
    id: draft.id,
    expectedVersion: 1,
    body: '새로 고친 원문',
    ownerId: draft.topicId,
    strokes: [],
    opId: crypto.randomUUID(),
    at: new Date().toISOString(),
    userId: saved.userId,
    namespace: saved.namespace,
  });
  expect(() => savePracticeMemo(repo, draft)).toThrow('다른 곳');
  expect(repo.getSnapshot().memos?.find((m) => m.id === draft.id)?.body).toBe('새로 고친 원문');
});
it('preserves damaged draft bytes before an explicit new attempt', () => {
  const key = 'test-exam-damaged',
    original = '{이전 초안 원문';
  localStorage.setItem(key, original);
  expect(() => readPracticeDraft(key)).toThrow();
  preservePracticeDraft(key, true);
  expect(localStorage.getItem(key)).toBeNull();
  const archive = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)!).find(
    (k) => k.startsWith(key + ':recovery:') && !k.endsWith(':metadata'),
  )!;
  expect(localStorage.getItem(archive)).toBe(original);
});
it('retains the latest input when local storage fails and can retry without another memo', () => {
  const key = 'test-exam-quota',
    draft = finished();
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('저장 공간 부족');
  });
  expect(() => writePracticeDraft(key, draft, null)).toThrow();
  expect(readRescuedDraft(key)).toBe(JSON.stringify(draft));
  spy.mockRestore();
  const raw = writePracticeDraft(key, draft, JSON.stringify(draft));
  expect(readPracticeDraft(key).raw).toBe(raw);
});
