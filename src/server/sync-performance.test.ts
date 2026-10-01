// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import { handleCommand, type CommandBackend, type ServerSnapshot } from './command-handler';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
const user = '10000000-0000-4000-8000-000000000001';
const op = (id: string) =>
  ({
    type: 'addSubject',
    id,
    name: ` 原文\r\n${id}\u0000\ud800`,
    scope: { kind: 'independent' },
    userId: user,
    namespace: 'test',
    at: '2026-10-01T01:00:00Z',
    opId: id,
  }) as Command;
let current: ServerSnapshot,
  approved = true;
const backend: CommandBackend = {
  authenticate: vi.fn(async (token) => (token === 'valid' ? user : '')),
  access: vi.fn(async () => ({
    status: approved ? ('approved' as const) : ('suspended' as const),
    administrator: false,
  })),
  read: vi.fn(async () => current),
  commit: vi.fn(async (_user, _namespace, base, _command, next) => {
    expect(base).toBe(current.sequence);
    current = { sequence: base + 1, data: next };
    return current;
  }),
};
const request = (body: unknown, token = 'valid') =>
  handleCommand(
    new Request('http://test/study-command', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
    backend,
  );
beforeEach(() => {
  current = { sequence: 0, data: emptyState(user, 'test') };
  approved = true;
  vi.clearAllMocks();
});
it('returns only version/capabilities for an unchanged authorized workspace', async () => {
  const response = await request({ action: 'load', namespace: 'test', knownSequence: 0 });
  expect(await response.json()).toMatchObject({
    unchanged: true,
    sequence: 0,
    userId: user,
    syncCapabilities: { batchCommands: true, conditionalLoad: true },
  });
  expect(response.headers.get('Server-Timing')).toMatch(
    /auth;dur=.*access;dur=.*read;dur=.*total;dur=/,
  );
  const full = await (await request({ action: 'load', namespace: 'test' })).json();
  expect(full.data).toEqual(current.data);
});
it('returns a full snapshot when changed and rejects invalid known versions', async () => {
  current = { sequence: 1, data: applyCommand(current.data, op('remote')) };
  expect(
    await (await request({ action: 'load', namespace: 'test', knownSequence: 0 })).json(),
  ).toHaveProperty('data.subjects.0.id', 'remote');
  expect((await request({ action: 'load', namespace: 'test', knownSequence: -1 })).status).toBe(
    400,
  );
});
it('authenticates and reads once for ordered batch writes and keeps each original revision', async () => {
  const commands = [op('one'), op('two'), op('three')];
  const response = await request({
    action: 'execute-batch',
    namespace: 'test',
    baseSequence: 0,
    commands,
  });
  expect(response.status).toBe(200);
  expect((await response.json()).sequence).toBe(3);
  expect(backend.authenticate).toHaveBeenCalledTimes(1);
  expect(backend.access).toHaveBeenCalledTimes(1);
  expect(backend.read).toHaveBeenCalledTimes(1);
  expect(backend.commit).toHaveBeenCalledTimes(3);
  expect(current.data.revisions).toHaveLength(3);
  expect(current.data.subjects.map((row) => row.name)).toEqual(
    commands.map((command) => (command.type === 'addSubject' ? command.name.trim() : '')),
  );
  await request({ action: 'execute-batch', namespace: 'test', baseSequence: 0, commands });
  expect(current.sequence).toBe(3);
  expect(backend.commit).toHaveBeenCalledTimes(3);
});
it('resumes a committed prefix after an interrupted batch without duplicating history', async () => {
  const first = op('one'),
    second = op('two');
  current = { sequence: 1, data: applyCommand(current.data, first) };
  expect(
    (
      await request({
        action: 'execute-batch',
        namespace: 'test',
        baseSequence: 0,
        commands: [first, second],
      })
    ).status,
  ).toBe(200);
  expect(current.sequence).toBe(2);
  expect(current.data.revisions).toHaveLength(2);
  expect(backend.commit).toHaveBeenCalledTimes(1);
  expect(
    (
      await request({
        action: 'execute-batch',
        namespace: 'test',
        baseSequence: 0,
        commands: [{ ...first, name: 'changed' }, second],
      })
    ).status,
  ).toBe(400);
});
it('rejects stale writes, oversized batches and every foreign command before any commit', async () => {
  for (const commands of [
    [op('one'), { ...op('two'), userId: 'other' }],
    [op('same'), op('same')],
    Array.from({ length: 17 }, (_, i) => op(`s${i}`)),
  ]) {
    expect(
      (await request({ action: 'execute-batch', namespace: 'test', baseSequence: 0, commands }))
        .status,
    ).not.toBe(200);
  }
  expect(
    (
      await request({
        action: 'execute-batch',
        namespace: 'test',
        baseSequence: 4,
        commands: [op('one')],
      })
    ).status,
  ).toBe(409);
  expect(backend.commit).not.toHaveBeenCalled();
});
it('does not leak an unchanged receipt or commit a batch after access is revoked', async () => {
  approved = false;
  expect((await request({ action: 'load', namespace: 'test', knownSequence: 0 })).status).toBe(403);
  expect(
    (
      await request({
        action: 'execute-batch',
        namespace: 'test',
        baseSequence: 0,
        commands: [op('one')],
      })
    ).status,
  ).toBe(403);
  expect(
    (await request({ action: 'load', namespace: 'test', knownSequence: 0 }, 'expired')).status,
  ).toBe(401);
  expect(backend.read).not.toHaveBeenCalled();
  expect(backend.commit).not.toHaveBeenCalled();
});
