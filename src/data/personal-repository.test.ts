// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { PersonalRepository, type OnlineTransport } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { DomainError, emptyState, type Command } from '../domain/model';
const user = '10000000-0000-4000-8000-000000000001';
function storage() { const map = new Map<string,string>(); return { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string,value: string) => { map.set(key,value); } }; }
const op = (id = 'one') => ({ type: 'addSubject', id, name: id, scope: { kind: 'independent' }, opId: `op-${id}`, at: '2026-09-30T01:00:00.000Z', userId: user, namespace: 'personal' } as Command);
function fixture() { let server = { sequence: 0, data: emptyState(user,'personal') }; const transport: OnlineTransport = { load: async () => server, execute: async (command,base) => { if (server.data.appliedOps[command.opId]) { applyCommand(server.data,command); return server; } if (base !== server.sequence) throw new DomainError('VERSION_CONFLICT','다른 기기 변경'); server = { sequence: server.sequence + 1, data: applyCommand(server.data,command) }; return server; } }; return { transport, get: () => server }; }
describe('durable personal writes and asynchronous acknowledgement', () => {
  it('preserves demo data and publishes server success only after acknowledgement', async () => {
    const store = storage(), f = fixture(); store.setItem('study-space:demo:v1','original demo');
    const repo = new PersonalRepository(store,f.transport,f.get()); repo.execute(op());
    expect(repo.getStatus().phase).not.toBe('saved'); await repo.flush();
    expect(repo.getStatus().phase).toBe('saved'); expect(f.get().data.subjects[0].id).toBe('one'); expect(store.getItem('study-space:demo:v1')).toBe('original demo');
    expect(new PersonalRepository(store,f.transport,f.get()).getSnapshot().subjects[0].id).toBe('one');
  });
  it('retains pending original across network failure and reopening', async () => {
    const store = storage(), f = fixture(); const bad = { ...f.transport, execute: async () => { throw Error('network'); } };
    const first = new PersonalRepository(store,bad,f.get()); first.execute(op()); await first.flush();
    expect(first.getStatus().phase).toBe('error'); const reopened = new PersonalRepository(store,f.transport,f.get());
    expect(reopened.getSnapshot().subjects).toHaveLength(1); await reopened.flush(); expect(f.get().sequence).toBe(1);
  });
  it('retries after a lost acknowledgement without duplicating a study event or revision', async () => {
    const f = fixture(), transport: OnlineTransport = { ...f.transport, execute: async (command: Command, base: number) => { await f.transport.execute(command,base); throw Error('response lost'); } };
    const repo = new PersonalRepository(storage(),transport,f.get()); repo.execute(op()); await repo.flush();
    transport.execute = f.transport.execute; await repo.flush();
    expect(f.get().sequence).toBe(1); expect(repo.getSnapshot().revisions).toHaveLength(1); expect(repo.getStatus().pending).toBe(0);
  });
  it('preserves local/server/base conflict, archives local commands before opening server', async () => {
    const f = fixture(), repo = new PersonalRepository(storage(),f.transport,f.get());
    await f.transport.execute(op('other-device'),0); repo.execute(op('local')); await repo.flush();
    expect(repo.getStatus().phase).toBe('conflict'); expect(repo.getSnapshot().subjects[0].id).toBe('local'); expect(repo.getConflict()?.server.data.subjects[0].id).toBe('other-device');
    await repo.openServerWithArchive(); expect(repo.getSnapshot().subjects[0].id).toBe('other-device'); expect(repo.exportPreserved()).toContain('op-local');
  });
  it('rejects owner mixing and failed local writes before publishing a saved state', () => {
    const f = fixture(), store = storage(), repo = new PersonalRepository(store,f.transport,f.get());
    expect(() => repo.execute({ ...op(), userId: 'other' })).toThrow();
    store.setItem = () => { throw Error('quota'); }; expect(() => repo.execute(op())).toThrow('quota'); expect(repo.getSnapshot().subjects).toHaveLength(0);
  });
  it('serializes rapidly queued commands and rejects fake successful responses', async () => {
    const f = fixture(), repo = new PersonalRepository(storage(),f.transport,f.get()); repo.execute(op('a')); repo.execute(op('b')); await repo.flush(); expect(f.get().sequence).toBe(2);
    const fake = new PersonalRepository(storage(),{ ...f.transport, execute: async () => f.get() },f.get()); fake.execute(op('c')); await fake.flush(); expect(fake.getStatus().phase).toBe('error'); expect(fake.getStatus().pending).toBe(1);
  });
});

it('persists all bulk commands once, retains the offline outbox, and rejects a later owner atomically', async () => {
  const store = storage(), f = fixture();
  const offline = {...f.transport,execute:async () => {throw Error('offline');}};
  const repo = new PersonalRepository(store,offline,f.get());
  const set = store.setItem; let writes = 0;
  store.setItem = (key,value) => {writes++;set(key,value);};
  repo.executeMany([op('bulk-a'),op('bulk-b')]);
  expect(writes).toBe(1); expect(repo.getSnapshot().revisions).toHaveLength(2);
  await repo.flush();
  const reopened = new PersonalRepository(store,offline,f.get());
  expect(reopened.getSnapshot().subjects.map(s=>s.id)).toEqual(['bulk-a','bulk-b']);
  expect(reopened.getStatus().pending).toBe(2);
  const before = repo.getSnapshot();
  expect(()=>repo.executeMany([op('bulk-c'),{...op('bulk-d'),userId:'other'}])).toThrow();
  expect(repo.getSnapshot()).toBe(before);
  store.setItem = () => {throw Error('quota');};
  expect(()=>repo.executeMany([op('bulk-c')])).toThrow('quota');
  expect(repo.getSnapshot()).toBe(before);
});


it('keeps the conflict visible and serializes archive clicks until durable completion', async () => {
  const f = fixture(), store = storage();
  let release!: () => void, hold = false;
  const completion = new Promise<void>(resolve => { release = resolve; });
  const journal = { ...store, flush: () => hold ? completion : Promise.resolve() };
  const repo = new PersonalRepository(journal, f.transport, f.get());
  await f.transport.execute(op('remote'), 0); repo.execute(op('draft')); await repo.flush();
  const before = repo.getConflict(); hold = true;
  const saving = repo.openServerWithArchive();
  expect(repo.openServerWithArchive()).toBe(saving);
  await Promise.resolve(); await Promise.resolve();
  expect(repo.getConflict()).toEqual(before); expect(repo.getStatus().phase).not.toBe('saved');
  expect(repo.getSnapshot().subjects[0].id).toBe('draft');
  expect(() => repo.execute(op('during-archive'))).toThrow('보관');
  release(); await saving;
  expect(repo.getStatus().phase).toBe('saved'); expect(repo.getSnapshot().subjects[0].id).toBe('remote');
  expect(JSON.parse(repo.exportPreserved()).archives).toHaveLength(1);
});
