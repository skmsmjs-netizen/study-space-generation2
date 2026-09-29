import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { archiveDamagedDraft, clearRescuedDraft, clearStoredDraft, DraftArchiveError, readRescuedDraft, storeDraftSafely } from './draft-safety';
import { draftArchiveMetadataKey } from './draft-archives';
const key = 'test:draft-safety';
beforeEach(() => { localStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { vi.restoreAllMocks(); clearRescuedDraft(key); });
it('never replaces unreadable original bytes when creating their archive fails', () => {
  localStorage.setItem(key, '{broken\n  exact');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full'); });
  expect(() => archiveDamagedDraft(key)).toThrow('초안 원문 사본을 보관하지 못했습니다');
  expect(localStorage.getItem(key)).toBe('{broken\n  exact');
});
it('reports an unreadable source without claiming a copy exists or changing it', () => {
  const failure = new Error('denied');
  localStorage.setItem(key, 'original');
  const write = vi.spyOn(Storage.prototype, 'setItem');
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw failure; });
  try { archiveDamagedDraft(key); throw new Error('expected failure'); }
  catch (error) {
    expect(error).toBeInstanceOf(DraftArchiveError);
    expect(error).toMatchObject({ stage: 'source-read', cause: failure });
  }
  expect(write).not.toHaveBeenCalled();
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
it('does not confirm an archive when its write silently fails verification', () => {
  localStorage.setItem(key, 'original');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);
  expect(() => archiveDamagedDraft(key)).toThrow('원본 초안 사본을 확인하지 못했습니다');
  expect(localStorage.getItem(key)).toBe('original');
});
it('keeps the source and archive if metadata verification fails after its write', () => {
  localStorage.setItem(key, 'original');
  const get = Storage.prototype.getItem;
  let archiveKey = '';
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, candidate) {
    if (candidate.startsWith('study-space:draft-archive-metadata:')) return null;
    if (candidate.startsWith(`${key}:recovery:`)) archiveKey = candidate;
    return get.call(this, candidate);
  });
  expect(() => archiveDamagedDraft(key)).toThrow('시각과 이유를 저장·확인하지 못했습니다');
  expect(localStorage.getItem(key)).toBe('original');
  expect(get.call(localStorage, archiveKey)).toBe('original');
  expect(get.call(localStorage, draftArchiveMetadataKey(archiveKey))).not.toBeNull();
});
