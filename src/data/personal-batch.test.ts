// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { PersonalRepository, type OnlineTransport } from './personal-repository';
import { handleCommand, type CommandBackend, type ServerSnapshot } from '../server/command-handler';
import { applyCommand } from '../domain/commands';
import { DomainError, emptyState, type Command } from '../domain/model';
const user = '10000000-0000-4000-8000-000000000001';
const op = (id: string) =>
  ({
    type: 'addSubject',
    id,
    name: `원문\r\n${id}`,
    scope: { kind: 'independent' },
    userId: user,
    namespace: 'test',
    at: '2026-10-01T01:00:00Z',
    opId: id,
  }) as Command;
function fixture(batch = true) {
  let server: ServerSnapshot = {
    sequence: 0,
    data: emptyState(user, 'test'),
    ...(batch
      ? { syncCapabilities: { batchCommands: true as const, conditionalLoad: true as const } }
      : {}),
  };
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const backend: CommandBackend = {
    authenticate: async () => user,
    access: async () => ({ status: 'approved', administrator: false }),
    read: async () => server,
    commit: async (_user, _namespace, base, _command, next) => {
      if (base !== server.sequence) throw new DomainError('VERSION_CONFLICT', '충돌');
      server = { ...server, sequence: base + 1, data: next };
      return server;
    },
  };
  const executeBatch = vi.fn(async (commands: Command[], sequence: number) => {
    const response = await handleCommand(
      new Request('http://test/command', {
        method: 'POST',
        headers: { authorization: 'Bearer synthetic' },
        body: JSON.stringify({
          action: 'execute-batch',
          namespace: 'test',
          baseSequence: sequence,
          commands,
        }),
      }),
      backend,
    );
    const body = await response.json();
    if (!response.ok) throw new DomainError(body.code, body.message);
    return body as ServerSnapshot;
  });
  const transport: OnlineTransport = {
    load: vi.fn(async () => server),
    executeBatch,
    execute: vi.fn(async (command, sequence) => {
      if (server.data.appliedOps[command.opId]) {
        applyCommand(server.data, command);
        return server;
      }
      if (sequence !== server.sequence) throw new DomainError('VERSION_CONFLICT', '충돌');
      return backend.commit(user, 'test', sequence, command, applyCommand(server.data, command));
    }),
  };
  return {
    storage,
    transport,
    executeBatch,
    get: () => server,
    repo: () => new PersonalRepository(storage, transport, server),
  };
}
it('sends twenty queued changes in two bounded requests while retaining twenty histories', async () => {
  const f = fixture(),
    repo = f.repo();
  for (let i = 0; i < 20; i++) repo.execute(op(`s${i}`));
  await repo.flush();
  expect(f.executeBatch.mock.calls.map(([commands]) => commands.length)).toEqual([16, 4]);
  expect(f.transport.execute).not.toHaveBeenCalled();
  expect(repo.getStatus()).toMatchObject({ phase: 'saved', pending: 0 });
  expect(f.get().data.revisions).toHaveLength(20);
  expect(
    new PersonalRepository(f.storage, f.transport, f.get()).getSnapshot().subjects,
  ).toHaveLength(20);
});
it('uses the existing single-operation path until the server explicitly advertises batches', async () => {
  const f = fixture(false),
    repo = f.repo();
  repo.execute(op('one'));
  repo.execute(op('two'));
  await repo.flush();
  expect(f.executeBatch).not.toHaveBeenCalled();
  expect(f.transport.execute).toHaveBeenCalledTimes(2);
});
it('preserves the transport receiver when calling an optional batch method', async () => {
  const f = fixture(), execute = f.executeBatch;
  f.transport.executeBatch = async function(commands, sequence) {
    expect(this).toBe(f.transport);
    return execute(commands, sequence);
  };
  const repo = f.repo(); repo.execute(op('one')); repo.execute(op('two')); await repo.flush();
  expect(repo.getStatus()).toMatchObject({ phase: 'saved', pending: 0 });
});
it('retains all pending operations after a lost batch response and retries their original IDs once', async () => {
  const f = fixture(),
    execute = f.executeBatch;
  f.transport.executeBatch = async (commands, sequence) => {
    await execute(commands, sequence);
    throw Error('lost acknowledgement');
  };
  const repo = f.repo();
  repo.execute(op('one'));
  repo.execute(op('two'));
  await repo.flush();
  expect(repo.getStatus()).toMatchObject({ phase: 'error', pending: 2 });
  expect(f.get().sequence).toBe(2);
  f.transport.executeBatch = execute;
  await repo.flush();
  expect(repo.getStatus()).toMatchObject({ phase: 'saved', pending: 0 });
  expect(f.get().sequence).toBe(2);
  expect(f.get().data.revisions).toHaveLength(2);
});
it('rejects incomplete batch acknowledgements without removing any local originals', async () => {
  const f = fixture();
  f.transport.executeBatch = async () => ({
    ...f.get(),
    sequence: 1,
    data: applyCommand(f.get().data, op('one')),
  });
  const repo = f.repo();
  repo.execute(op('one'));
  repo.execute(op('two'));
  await repo.flush();
  expect(repo.getStatus()).toMatchObject({ phase: 'error', pending: 2 });
  expect(repo.getSnapshot().subjects).toHaveLength(2);
});
it('replays edits queued during a delayed batch response and sends them afterwards', async () => {
  const f = fixture(),
    execute = f.executeBatch;
  let resolve!: () => void, started!: () => void;
  const response = new Promise<void>((done) => {
    resolve = done;
  });
  const ready = new Promise<void>((done) => {
    started = done;
  });
  f.transport.executeBatch = async (commands, sequence) => {
    const saved = await execute(commands, sequence);
    started();
    await response;
    return saved;
  };
  const repo = f.repo();
  repo.execute(op('one'));
  repo.execute(op('two'));
  await ready;
  repo.execute(op('during-response'));
  resolve();
  await repo.flush();
  expect(repo.getSnapshot().subjects).toHaveLength(3);
  expect(f.get().sequence).toBe(3);
  expect(repo.getStatus().pending).toBe(0);
});
it('passes the confirmed base to refresh, preserving edits made while it is in transit', async () => {
  const f = fixture(),
    repo = f.repo();
  await repo.refresh();
  expect(f.transport.load).toHaveBeenCalledWith(f.get());
});

it('reopens and resumes only our committed prefix after a partial batch failure', async () => {
  const f = fixture(), original = f.transport.execute;
  f.transport.executeBatch = async commands => { await original(commands[0], 0); throw Error('connection interrupted after first commit'); };
  const repo = f.repo(); repo.execute(op('one')); repo.execute(op('two')); await repo.flush();
  expect(repo.getStatus().pending).toBe(2);
  const reopened = f.repo();
  expect(reopened.getStatus()).toMatchObject({ phase: 'pending', pending: 1 });
  expect(reopened.getSnapshot().subjects).toHaveLength(2);
  await reopened.flush();
  expect(f.get().sequence).toBe(2); expect(f.get().data.revisions).toHaveLength(2); expect(reopened.getStatus().phase).toBe('saved');
});

it('preserves a conflict when a remote change follows our partially committed prefix', async () => {
  const f = fixture(), original = f.transport.execute;
  f.transport.executeBatch = async commands => { await original(commands[0], 0); await original(op('other-device'), 1); throw Error('interrupted'); };
  const repo = f.repo(); repo.execute(op('one')); repo.execute(op('two')); await repo.flush();
  const reopened = f.repo();
  expect(reopened.getStatus().phase).toBe('conflict');
  expect(reopened.getSnapshot().subjects.map(row => row.id)).toEqual(['one', 'two']);
  expect(reopened.getConflict()?.server.data.subjects.map(row => row.id)).toEqual(['one', 'other-device']);
});
