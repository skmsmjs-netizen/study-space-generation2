// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { IndexedPersonalJournal, openPersonalRepository } from './indexed-personal-journal';
import { personalJournalKey, type OnlineTransport } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { decodeStoredText } from './storage-codec';

const owner = '80000000-0000-4000-8000-000000000001';
const originalBody = '  原文\r\n한글\u0000\ud800  ';
function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, raw: string) => { values.set(key, raw); }, values };
}
const command = (id: string, body = originalBody) => ({ type: 'saveMemo', id, body, ownerId: null, strokes: [], expectedVersion: 0,
  opId: `op-${id}`, at: '2026-10-01T01:00:00.000Z', userId: owner, namespace: 'test' } as Command);
function serverFixture() {
  let server = { sequence: 0, data: emptyState(owner, 'test') };
  const transport: OnlineTransport = { load: async () => server, execute: async (op, sequence) => {
    if (server.data.appliedOps[op.opId]) { applyCommand(server.data, op); return server; }
    expect(sequence).toBe(server.sequence);
    server = { sequence: sequence + 1, data: applyCommand(server.data, op) }; return server;
  } };
  return { get: () => server, transport };
}
async function rows(factory: IDBFactory, store = 'journals'): Promise<unknown[]> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open('study-space-personal-journals', 1);
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try { return await new Promise((resolve, reject) => {
    const transaction = db.transaction(store, 'readonly'), request = transaction.objectStore(store).getAll();
    transaction.oncomplete = () => resolve(request.result); transaction.onabort = () => reject(transaction.error);
  }); } finally { db.close(); }
}
describe('IndexedDB personal journal connected before server acknowledgement', () => {
  it('commits exact originals and outbox together before transport, then acknowledges and reopens', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    legacy.setItem('study-space:demo:v1', 'untouched');
    const transport = { ...f.transport, execute: async (op: Command, sequence: number) => {
      const saved = JSON.parse(decodeStoredText((await rows(factory))[0] as string));
      expect(saved.pending.map((item: Command) => item.opId)).toContain(op.opId);
      expect(saved.local.memos[0].body).toBe(originalBody);
      return f.transport.execute(op, sequence);
    } };
    const repo = await openPersonalRepository(legacy, transport, f.get(), factory);
    repo.execute(command('m')); expect(repo.getStatus().phase).not.toBe('saved'); await repo.flush();
    expect(repo.getStatus().phase).toBe('saved'); expect(legacy.getItem('study-space:demo:v1')).toBe('untouched');
    await repo.close();
    const reopened = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    expect(reopened.getSnapshot()).toEqual(repo.getSnapshot()); expect(reopened.getSnapshot().revisions).toHaveLength(1);
    expect(JSON.parse(decodeStoredText((await rows(factory))[0] as string)).pending).toHaveLength(0);
    await reopened.close();
  });
  it('recovers pending operations from IndexedDB if the legacy key is absent and retries exactly once', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, { ...f.transport, execute: async () => { throw Error('network'); } }, f.get(), factory);
    repo.execute(command('offline')); await repo.flush(); await repo.close();
    const original = repo.getSnapshot(); legacy.values.delete(repo.key);
    const reopened = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    expect(reopened.getSnapshot()).toEqual(original); expect(reopened.getStatus().pending).toBe(1);
    await reopened.flush(); expect(f.get().sequence).toBe(1); expect(reopened.getSnapshot().revisions).toHaveLength(1);
    await reopened.close();
  });
  it('keeps failed DB writes out of the server and retries the retained journal', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    const before = await rows(factory), originalPut = IDBObjectStore.prototype.put;
    const spy = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (this: IDBObjectStore, ...args) {
      const result = originalPut.apply(this, args); this.transaction.abort(); return result;
    });
    try {
      repo.execute(command('aborted')); await repo.flush();
      expect(repo.getStatus().phase).toBe('error'); expect(f.get().sequence).toBe(0);
      expect(await rows(factory)).toEqual(before); expect(repo.getSnapshot().memos).toHaveLength(1);
    } finally { spy.mockRestore(); }
    await repo.flush(); expect(repo.getStatus().phase).toBe('saved'); expect(f.get().sequence).toBe(1); await repo.close();
  });
  it('preserves a differing DB original before recovering a newer legacy journal', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture(), key = personalJournalKey(f.get().data);
    const first = await IndexedPersonalJournal.open(legacy, key, factory);
    first.setItem(key, 'older exact raw'); await first.flush(); first.close();
    legacy.setItem(key, 'newer exact raw');
    const next = await IndexedPersonalJournal.open(legacy, key, factory);
    next.setItem(key, 'newer exact raw'); await next.flush();
    expect(await rows(factory)).toEqual(['newer exact raw']);
    expect(await rows(factory, 'recovery')).toEqual([expect.objectContaining({ key, raw: 'older exact raw' })]); next.close();
  });
  it('refuses to overwrite damaged legacy contents or cross-owner keys', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, f.transport, f.get(), factory); await repo.close();
    const before = await rows(factory); legacy.setItem(repo.key, 'damaged original');
    await expect(openPersonalRepository(legacy, f.transport, f.get(), factory)).rejects.toThrow('원문');
    expect(legacy.getItem(repo.key)).toBe('damaged original'); expect(await rows(factory)).toEqual(before);
    const journal = await IndexedPersonalJournal.open(legacy, repo.key, factory);
    expect(() => journal.getItem(personalJournalKey({ userId: 'other', namespace: 'test' }))).toThrow('저장 키'); journal.close();
  });
  it('rejects a competing DB writer and isolates different owners', async () => {
    const factory = new IDBFactory(), f = serverFixture(), key = personalJournalKey(f.get().data);
    const one = await IndexedPersonalJournal.open(storage(), key, factory), two = await IndexedPersonalJournal.open(storage(), key, factory);
    one.setItem(key, 'first'); await one.flush(); two.setItem(key, 'competing');
    await expect(two.flush()).rejects.toThrow('다른 창'); expect(await rows(factory)).toEqual(['first']);
    const otherKey = personalJournalKey({ userId: 'other', namespace: 'test' }), other = await IndexedPersonalJournal.open(storage(), otherKey, factory);
    other.setItem(otherKey, 'other owner'); await other.flush(); expect(await rows(factory)).toHaveLength(2);
    one.close(); two.close(); other.close();
  });
  it('recovers a lost server response without duplicating revisions, including rapidly queued writes', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const transport: OnlineTransport = { ...f.transport, execute: async (op, sequence) => { await f.transport.execute(op, sequence); throw Error('lost acknowledgement'); } };
    const repo = await openPersonalRepository(legacy, transport, f.get(), factory);
    repo.execute(command('a')); repo.execute(command('b')); await repo.flush();
    expect(repo.getStatus().pending).toBe(2); expect(f.get().sequence).toBe(1);
    transport.execute = f.transport.execute; await repo.flush(); await repo.close();
    expect(f.get().sequence).toBe(2); expect(repo.getSnapshot().revisions).toHaveLength(2);
    const reopened = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    expect(reopened.getStatus().pending).toBe(0); expect(reopened.getSnapshot().memos).toHaveLength(2); await reopened.close();
  });
  it('does not enqueue a failed legacy write', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, f.transport, f.get(), factory), before = await rows(factory);
    const setItem = vi.spyOn(legacy, 'setItem').mockImplementation(() => { throw Error('quota'); });
    try { expect(() => repo.execute(command('fail'))).toThrow('quota'); expect(repo.getSnapshot().memos ?? []).toHaveLength(0); }
    finally { setItem.mockRestore(); }
    await repo.flush(); expect(await rows(factory)).toEqual(before); expect(f.get().sequence).toBe(0); await repo.close();
  });
  it('uses the DB when localStorage is full, keeps outbox durable before transport, and resumes without its legacy mirror', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    const write = vi.spyOn(legacy, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    repo.execute(command('overflow')); expect(repo.getStatus().message).toContain('보관 중');
    await repo.flush(); expect(f.get().sequence).toBe(1); expect(repo.getStatus().phase).toBe('saved');
    expect(JSON.parse(decodeStoredText((await rows(factory))[0] as string)).local.memos[0].body).toBe(originalBody);
    await repo.close();
    const reopened = await openPersonalRepository(legacy, f.transport, f.get(), factory);
    expect(reopened.getSnapshot().memos?.[0].body).toBe(originalBody);
    reopened.execute(command('overflow-next')); await reopened.flush();
    expect(reopened.getStatus().phase).toBe('saved'); expect(f.get().sequence).toBe(2);
    write.mockRestore(); await reopened.close();
  });
  it('never sends an overflowing edit when the DB commit also aborts', async () => {
    const factory = new IDBFactory(), legacy = storage(), f = serverFixture();
    const repo = await openPersonalRepository(legacy, f.transport, f.get(), factory), before = await rows(factory);
    const write = vi.spyOn(legacy, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    const put = vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function(this: IDBObjectStore) { this.transaction.abort(); return {} as IDBRequest; });
    repo.execute(command('both-full')); await repo.flush();
    expect(repo.getStatus().phase).toBe('error'); expect(f.get().sequence).toBe(0); expect(await rows(factory)).toEqual(before);
    expect(repo.getSnapshot().memos?.[0].body).toBe(originalBody);
    put.mockRestore(); await repo.flush(); expect(repo.getStatus().phase).toBe('saved'); expect(f.get().sequence).toBe(1);
    write.mockRestore(); await repo.close();
  });

});
