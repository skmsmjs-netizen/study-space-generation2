import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from './demo-repository';
import { memoryQuestions } from '../domain/memory-test';
import {
  freshMemoryDraft,
  memoryDraftKey,
  readMemoryDraft,
  saveMemoryAttempt,
  saveMemoryEditor,
  writeMemoryDraft,
} from './memory-test';
import { clearRescuedDraft, readRescuedDraft } from './draft-safety';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('separates owner/tab drafts and rescues current input on quota or stale-write failure', () => {
  const repo = new DemoRepository(localStorage),
    key = memoryDraftKey(repo.getSnapshot());
  const draft = {
    ...freshMemoryDraft(),
    editor: {
      id: 'id',
      baseVersion: 0,
      topicId: 'demo-topic-function',
      question: '질문',
      answer: '  글\n',
      strokes: [],
    },
  };
  const raw = writeMemoryDraft(key, draft, null);
  expect(readMemoryDraft(key).draft).toEqual(draft);
  expect(memoryDraftKey({ namespace: 'personal', userId: 'user-one' })).not.toBe(
    memoryDraftKey({ namespace: 'personal', userId: 'user-two' }),
  );
  sessionStorage.removeItem('study-space:memory-test-tab:v1');
  expect(memoryDraftKey(repo.getSnapshot())).not.toBe(key);
  const setter = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('', 'QuotaExceededError');
  });
  const changed = { ...draft, count: 10 };
  expect(() => writeMemoryDraft(key, changed, raw)).toThrow();
  expect(readRescuedDraft(key)).toBe(JSON.stringify(changed));
  setter.mockRestore();
  clearRescuedDraft(key);
  localStorage.setItem(key, 'other');
  expect(() => writeMemoryDraft(key, changed, raw)).toThrow('두 원문');
  expect(localStorage.getItem(key)).toBe('other');
  expect(readRescuedDraft(key)).toBe(JSON.stringify(changed));
  clearRescuedDraft(key);
});
it('keeps damaged drafts byte-for-byte and saves a retry only once after cleanup failure', () => {
  const repo = new DemoRepository(localStorage),
    key = memoryDraftKey(repo.getSnapshot());
  localStorage.setItem(key, '{broken');
  expect(() => readMemoryDraft(key)).toThrow();
  expect(localStorage.getItem(key)).toBe('{broken');
  const editor = {
    id: 'card',
    baseVersion: 0,
    topicId: 'demo-topic-function',
    question: '질문',
    answer: '  원문\n',
    strokes: [],
  };
  saveMemoryEditor(repo, editor);
  saveMemoryEditor(repo, editor);
  expect(repo.getSnapshot().memoryCards).toHaveLength(1);
  const attempt = {
    id: 'test',
    startedAt: '2026-10-01T00:00:00Z',
    endedAt: '2026-10-01T00:01:00Z',
    questions: memoryQuestions(repo.getSnapshot(), repo.getSnapshot().memoryCards!, 1),
    index: 0,
  };
  saveMemoryAttempt(repo, attempt);
  saveMemoryAttempt(repo, attempt);
  expect(new DemoRepository(localStorage).getSnapshot().memoryTests).toHaveLength(1);
});
