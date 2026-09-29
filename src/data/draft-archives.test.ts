import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { archiveDamagedDraft } from './draft-safety';
import { draftArchiveMetadataKey, listDraftArchives, readDraftArchive, serializeDraftArchive } from './draft-archives';

const source = 'study-space:demo:draft:topic-one';
const archiveKey = `${source}:recovery:legacy-id`;
const raw = ' \r\n{broken:\t"한국어 👩‍💻"\u0000\ud800 end \udfff\n  ';
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

it('reads legacy copies without inventing a date/reason, interpreting JSON, or writing any storage', () => {
  localStorage.setItem(archiveKey, raw);
  localStorage.setItem(source, 'new draft');
  localStorage.setItem('another-app:recovery:one', 'private');
  const set = vi.spyOn(Storage.prototype, 'setItem');
  const remove = vi.spyOn(Storage.prototype, 'removeItem');
  const result = listDraftArchives();
  expect(result.complete).toBe(true);
  expect(result.archives).toEqual([{ archiveKey, sourceKey: source, raw, metadata: null, currentDraft: 'different', issues: [] }]);
  expect(set).not.toHaveBeenCalled();
  expect(remove).not.toHaveBeenCalled();
});

it('exports the exact UTF-16 string through UTF-8 JSON encoding including lone surrogates and CRLF', () => {
  localStorage.setItem(archiveKey, raw);
  const serialized = serializeDraftArchive(readDraftArchive(archiveKey));
  const fileText = new TextDecoder().decode(new TextEncoder().encode(serialized));
  expect(JSON.parse(fileText).raw).toBe(raw);
  expect(JSON.parse(fileText).sourceKey).toBe(source);
  expect(JSON.parse(fileText).metadata).toBeNull();
});

it('treats malicious-looking payloads as opaque strings and keeps them exact in export', () => {
  const malicious = '{"__proto__":{"polluted":true},"html":"<script>alert(1)</script>"}';
  localStorage.setItem(archiveKey, malicious);
  expect(JSON.parse(serializeDraftArchive(readDraftArchive(archiveKey))).raw).toBe(malicious);
  expect(Object.prototype).not.toHaveProperty('polluted');
  expect(localStorage.getItem(source)).toBeNull();
});

it('distinguishes current absence, exact match, difference, and unreadability without validity inference', () => {
  localStorage.setItem(archiveKey, raw);
  expect(readDraftArchive(archiveKey).currentDraft).toBe('absent');
  localStorage.setItem(source, raw);
  expect(readDraftArchive(archiveKey).currentDraft).toBe('same');
  localStorage.setItem(source, raw.trim());
  expect(readDraftArchive(archiveKey).currentDraft).toBe('different');
  const get = Storage.prototype.getItem;
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
    if (key === source) throw new Error('denied');
    return get.call(this, key);
  });
  const unreadable = readDraftArchive(archiveKey);
  expect(unreadable.currentDraft).toBe('unreadable');
  expect(unreadable.issues.map(issue => issue.stage)).toEqual(['current-read']);
  expect(JSON.parse(serializeDraftArchive(unreadable)).raw).toBe(raw);
});

it('treats an empty-string archive as an available exact raw value', () => {
  localStorage.setItem(archiveKey, '');
  localStorage.setItem(source, '');
  const archive = readDraftArchive(archiveKey);
  expect(archive.currentDraft).toBe('same');
  expect(JSON.parse(serializeDraftArchive(archive)).raw).toBe('');
});

it('records new metadata separately without changing the raw archive or original', () => {
  localStorage.setItem(source, raw);
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-30T09:00:00.000Z'));
  try {
    const key = archiveDamagedDraft(source, '시험: 형식 확인 실패')!;
    const archive = readDraftArchive(key);
    expect(archive.raw).toBe(raw);
    expect(archive.metadata).toEqual({ version: 1, sourceKey: source, archiveKey: key, reason: '시험: 형식 확인 실패', archivedAt: '2026-09-30T09:00:00.000Z' });
    expect(archive.currentDraft).toBe('same');
    expect(listDraftArchives().archives).toHaveLength(1);
    expect(localStorage.getItem(source)).toBe(raw);
  } finally { vi.useRealTimers(); }
});

it('keeps both copies and signals missing metadata when metadata writing fails, then permits retry', () => {
  localStorage.setItem(source, raw);
  const set = Storage.prototype.setItem;
  const failing = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
    if (key.startsWith('study-space:draft-archive-metadata:')) throw new Error('quota');
    set.call(this, key, value);
  });
  expect(() => archiveDamagedDraft(source)).toThrow('초안 원문 사본은 보관했지만');
  expect(localStorage.getItem(source)).toBe(raw);
  expect(listDraftArchives().archives[0].raw).toBe(raw);
  expect(listDraftArchives().archives[0].metadata).toBeNull();
  failing.mockRestore();
  archiveDamagedDraft(source);
  expect(listDraftArchives().archives).toHaveLength(2);
  expect(listDraftArchives().archives.every(archive => archive.raw === raw)).toBe(true);
});

it('rejects a mismatched metadata association without changing it or the raw payload', () => {
  localStorage.setItem(archiveKey, raw);
  const metadata = JSON.stringify({ version: 1, archiveKey, sourceKey: 'other', archivedAt: '2026-09-30', reason: 'wrong' });
  localStorage.setItem(draftArchiveMetadataKey(archiveKey), metadata);
  const archive = readDraftArchive(archiveKey);
  expect(archive.metadata).toBeNull();
  expect(archive.issues.map(issue => issue.stage)).toEqual(['metadata-invalid']);
  expect(localStorage.getItem(draftArchiveMetadataKey(archiveKey))).toBe(metadata);
  expect(JSON.parse(serializeDraftArchive(archive)).raw).toBe(raw);
});

it.each(['{broken', 'null', '{"version":1,"archivedAt":"not-a-date"}'])('preserves invalid metadata and permits raw export: %s', metadata => {
  localStorage.setItem(archiveKey, raw);
  localStorage.setItem(draftArchiveMetadataKey(archiveKey), metadata);
  const archive = readDraftArchive(archiveKey);
  expect(archive.metadata).toBeNull();
  expect(archive.issues[0].stage).toBe('metadata-invalid');
  expect(JSON.parse(serializeDraftArchive(archive)).raw).toBe(raw);
  expect(localStorage.getItem(draftArchiveMetadataKey(archiveKey))).toBe(metadata);
});

it('distinguishes metadata read failure from raw read failure', () => {
  localStorage.setItem(archiveKey, raw);
  const get = Storage.prototype.getItem;
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
    if (key === draftArchiveMetadataKey(archiveKey)) throw new Error('denied');
    return get.call(this, key);
  });
  const result = listDraftArchives();
  expect(result.complete).toBe(false);
  expect(result.issues.map(issue => issue.stage)).toEqual(['metadata-read']);
  expect(JSON.parse(serializeDraftArchive(result.archives[0])).raw).toBe(raw);
});

it('retains readable archives and reports an individual unreadable entry', () => {
  const otherKey = `${source}:recovery:other`;
  localStorage.setItem(archiveKey, raw);
  localStorage.setItem(otherKey, 'other raw');
  const get = Storage.prototype.getItem;
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
    if (key === archiveKey) throw new Error('denied');
    return get.call(this, key);
  });
  const result = listDraftArchives();
  expect(result.complete).toBe(false);
  expect(result.archives).toHaveLength(2);
  expect(result.archives.find(archive => archive.archiveKey === otherKey)?.raw).toBe('other raw');
  const broken = result.archives.find(archive => archive.archiveKey === archiveKey)!;
  expect(broken.raw).toBeNull();
  expect(() => serializeDraftArchive(broken)).toThrow('원문을 읽지 못해');
});

it('does not export a vanished archive as an empty file', () => {
  const result = readDraftArchive(archiveKey);
  expect(result.raw).toBeNull();
  expect(result.issues[0].stage).toBe('archive-read');
  expect(() => serializeDraftArchive(result)).toThrow('원문을 읽지 못해');
});

it('reports unavailable enumeration instead of an authoritative empty list', () => {
  const result = listDraftArchives({ get length(): number { throw new Error('denied'); }, key: () => null, getItem: () => null });
  expect(result).toMatchObject({ archives: [], complete: false });
  expect(result.issues[0].stage).toBe('enumeration');
});

it('continues enumerating after an index failure and reports the partial result', () => {
  const result = listDraftArchives({ length: 2, key: index => { if (index === 0) throw new Error('denied'); return archiveKey; }, getItem: key => key === archiveKey ? raw : null });
  expect(result.complete).toBe(false);
  expect(result.issues[0].stage).toBe('enumeration');
  expect(result.archives[0].raw).toBe(raw);
});

it('reports a changing storage enumeration instead of treating it as complete', () => {
  const result = listDraftArchives({ length: 2, key: index => index === 0 ? archiveKey : null, getItem: key => key === archiveKey ? raw : null });
  expect(result.complete).toBe(false);
  expect(result.archives[0].raw).toBe(raw);
});

it('keeps an already read snapshot exportable after storage access fails', () => {
  localStorage.setItem(archiveKey, raw);
  const snapshot = readDraftArchive(archiveKey);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
  expect(JSON.parse(serializeDraftArchive(snapshot)).raw).toBe(raw);
});
