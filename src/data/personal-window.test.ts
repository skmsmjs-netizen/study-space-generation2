import { afterEach, expect, it } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { claimPersonalWindow, personalWindowCopies, type PersonalWindow } from './personal-window';
import { PersonalRepository, personalJournalKey, type OnlineTransport } from './personal-repository';
import { IndexedPersonalJournal, openPersonalRepository } from './indexed-personal-journal';
import { applyCommand } from '../domain/commands';
import { DomainError, emptyState, type Command } from '../domain/model';
import { decodeStoredText } from './storage-codec';

const userId = '70000000-0000-4000-8000-000000000009';
const leases: PersonalWindow[] = [];
function lockManager() {
  const held = new Set<string>();
  return { request: async (name: string, options: LockOptions, callback: (lock: Lock | null) => unknown) => {
    if (options.mode === 'shared') return callback({ name, mode: 'shared' } as Lock);
    if (held.has(name)) return callback(null);
    held.add(name);
    try { return await callback({ name, mode: 'exclusive' } as Lock); } finally { held.delete(name); }
  } } as LockManager;
}
const command = (id: string, body = '  원문\r\n이유와 예외  ', expectedVersion = 0): Command => ({
  type: 'saveMemo', id, body, ownerId: null, strokes: [], expectedVersion,
  opId: crypto.randomUUID(), at: '2026-10-01T01:00:00.000Z', userId, namespace: 'personal',
});
function fixture() {
  let server = { sequence: 0, data: emptyState(userId, 'personal') };
  const transport: OnlineTransport = { load: async () => server, execute: async (op, base) => {
    if (server.data.appliedOps[op.opId]) { applyCommand(server.data, op); return server; }
    if (base !== server.sequence) throw new DomainError('VERSION_CONFLICT', '기록이 갱신되었습니다.');
    server = { sequence: server.sequence + 1, data: applyCommand(server.data, op) }; return server;
  } };
  return { transport, get: () => server };
}
async function claim(session: Storage, locks: LockManager, factory?: IDBFactory) {
  const lease = await claimPersonalWindow(userId, localStorage, session, locks, factory);
  leases.push(lease); return lease;
}
afterEach(async () => { await Promise.all(leases.splice(0).map(lease => lease.release())); localStorage.clear(); sessionStorage.clear(); });

it('a cloned tab gets another outbox and neither localStorage nor IndexedDB loses either pending original', async () => {
  const f = fixture(), locks = lockManager(), factory = new IDBFactory();
  const first = await claim(sessionStorage, locks, factory);
  const a = await openPersonalRepository(localStorage, { ...f.transport, execute: async () => { throw Error('offline'); } }, f.get(), factory, false, first.key);
  a.execute(command('first')); await a.flush();
  const original = localStorage.getItem(first.key);
  const second = await claim(sessionStorage, locks, factory); // same copied session identifier
  expect(second.key).not.toBe(first.key);
  const b = await openPersonalRepository(localStorage, { ...f.transport, execute: async () => { throw Error('offline'); } }, second.cached!, factory, true, second.key);
  b.execute(command('second')); await b.flush();
  expect(localStorage.getItem(first.key)).toBe(original);
  expect(a.getSnapshot().memos![0].id).toBe('first'); expect(b.getSnapshot().memos![0].id).toBe('second');
  expect((await personalWindowCopies(userId, second.key, localStorage, factory)).map(copy => copy.raw)).toContain(original);
  await a.close(); await b.close();
});
it('reload resumes the same outbox and a lost server reply produces one operation', async () => {
  const f = fixture(), locks = lockManager(), factory = new IDBFactory();
  const first = await claim(sessionStorage, locks, factory);
  const a = await openPersonalRepository(localStorage, { ...f.transport, execute: async (op, base) => {
    await f.transport.execute(op, base); throw Error('response lost');
  } }, f.get(), factory, false, first.key);
  a.execute(command('first')); await a.flush(); await a.close(); await first.release();
  const resumed = await claim(sessionStorage, locks, factory); expect(resumed.key).toBe(first.key);
  const b = await openPersonalRepository(localStorage, f.transport, f.get(), factory, false, resumed.key);
  await b.flush(); expect(b.getStatus().phase).toBe('saved'); expect(f.get().sequence).toBe(1);
  expect(b.getSnapshot().memos![0].body).toBe('  원문\r\n이유와 예외  '); await b.close();
});
it('two windows editing different records rebase safely, while competing edits preserve both originals', async () => {
  const f = fixture(), root = personalJournalKey(f.get().data);
  const a = new PersonalRepository(localStorage, f.transport, f.get(), false, `${root}:window:a`);
  const b = new PersonalRepository(localStorage, f.transport, f.get(), false, `${root}:window:b`);
  a.execute(command('a')); await a.flush();
  b.execute(command('b')); await b.flush(); await b.flush();
  expect(b.getStatus().phase).toBe('saved'); expect(f.get().data.memos).toHaveLength(2);
  await a.refresh();
  a.execute(command('a', '창 A에서 수정한 글', 1)); await a.flush();
  b.execute(command('a', '창 B에서 수정한 글', 1)); await b.flush();
  expect(b.getStatus().phase).toBe('conflict');
  expect(b.getConflict()?.local.memos?.find(row => row.id === 'a')?.body).toBe('창 B에서 수정한 글');
  expect(b.getConflict()?.server.data.memos?.find(row => row.id === 'a')?.body).toBe('창 A에서 수정한 글');
  await a.close(); await b.close();
});
it('copies a legacy outbox without changing its key, text or operation IDs', async () => {
  const f = fixture();
  const old = new PersonalRepository(localStorage, { ...f.transport, execute: async () => { throw Error('offline'); } }, f.get());
  old.execute(command('legacy')); await old.flush();
  const original = localStorage.getItem(old.key);
  const lease = await claim(sessionStorage, lockManager());
  expect(localStorage.getItem(old.key)).toBe(original);
  expect(localStorage.getItem(lease.key)).toBe(original);
  expect(JSON.parse(decodeStoredText(original!)).pending).toHaveLength(1);
  localStorage.setItem('study-space:personal:other:online:v1', '다른 계정의 글');
  expect((await personalWindowCopies(userId, lease.key)).every(copy => !copy.key.includes(':other:'))).toBe(true);
});


it('exports DB-only windows and recovery originals with differing legacy and damaged raw while excluding other owners', async () => {
  const factory = new IDBFactory(), root = personalJournalKey({ namespace: 'personal', userId });
  const key = `${root}:window:closed`, current = `${root}:window:current`, foreign = 'study-space:personal:other:online:v1:window:closed';
  const journal = await IndexedPersonalJournal.open(localStorage, key, factory);
  journal.setItem(key, '  이전 DB 원문\r\n이유와 예외  '); await journal.flush(); journal.close();
  localStorage.setItem(key, '새 legacy 원문');
  const next = await IndexedPersonalJournal.open(localStorage, key, factory);
  next.setItem(key, '새 legacy 원문'); await next.flush(); next.close();
  localStorage.setItem(key, '{손상된 legacy 원문');
  const only = await IndexedPersonalJournal.open(localStorage, current, factory);
  only.setItem(current, '현재 창 DB에만 남은 원문'); await only.flush(); only.close(); localStorage.removeItem(current);
  const other = await IndexedPersonalJournal.open(localStorage, foreign, factory);
  other.setItem(foreign, '다른 계정 비공개 원문'); await other.flush(); other.close(); localStorage.removeItem(foreign);
  const before = localStorage.getItem(key);
  const copies = await personalWindowCopies(userId, current, localStorage, factory);
  expect(copies.filter(row => row.key === key).map(row => row.raw)).toEqual(expect.arrayContaining([
    '  이전 DB 원문\r\n이유와 예외  ', '새 legacy 원문', '{손상된 legacy 원문',
  ]));
  expect(copies).toContainEqual(expect.objectContaining({ key: current, raw: '현재 창 DB에만 남은 원문' }));
  expect(copies.some(row => row.key === foreign || row.raw.includes('비공개'))).toBe(false);
  expect(localStorage.getItem(key)).toBe(before); expect(localStorage.getItem(current)).toBeNull();
});
