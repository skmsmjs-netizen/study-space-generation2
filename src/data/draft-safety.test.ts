import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { archiveDamagedDraft, clearRescuedDraft, clearStoredDraft, readRescuedDraft, storeDraftSafely } from './draft-safety';
const key = 'test:draft-safety';
beforeEach(() => { localStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { vi.restoreAllMocks(); clearRescuedDraft(key); });
it('never replaces unreadable original bytes when creating their archive fails', () => {
  localStorage.setItem(key, '{broken\n  exact');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  expect(() => archiveDamagedDraft(key)).toThrow('full');
  expect(localStorage.getItem(key)).toBe('{broken\n  exact');
});
it('preserves exact damaged bytes and keeps the archive after a replacement draft is committed', () => {
  localStorage.setItem(key, '{broken\n  exact');
  const archive = archiveDamagedDraft(key)!;
  storeDraftSafely(key, 'replacement'); clearStoredDraft(key);
  expect(localStorage.getItem(key)).toBeNull();
  expect(localStorage.getItem(archive)).toBe('{broken\n  exact');
});
it('suppresses a committed draft in the current tab even when both disk cleanup paths fail', () => {
  localStorage.setItem(key, 'old');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('denied'); });
  expect(() => clearStoredDraft(key)).toThrow();
  expect(readRescuedDraft(key)).toBe('');
  expect(localStorage.getItem(key)).toBe('old');
});
