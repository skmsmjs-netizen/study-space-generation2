// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import { handleCommand, type CommandBackend, type ServerSnapshot, type ServerUnchangedSnapshot } from './command-handler';
import { emptyState, type Namespace } from '../domain/model';

const userId = '10000000-0000-4000-8000-000000000001';
const namespace: Namespace = 'test';
const unchanged = (sequence = 7): ServerUnchangedSnapshot => ({ unchanged: true, sequence, userId, namespace });
let backend: CommandBackend;
beforeEach(() => {
  backend = {
    authenticate: vi.fn(async () => userId),
    access: vi.fn(async () => ({ status: 'approved' as const, administrator: false })),
    read: vi.fn(async () => ({ sequence: 7, data: emptyState(userId, namespace) })),
    readConditional: vi.fn(async () => unchanged()),
    commit: vi.fn(),
  };
});
const request = (body: unknown, token = 'fixture') => handleCommand(new Request('https://test.invalid/study-command', {
  method: 'POST', headers: token ? { authorization: `Bearer ${token}` } : {}, body: JSON.stringify(body),
}), backend);
const load = (knownSequence: unknown = 7) => request({ action: 'load', namespace, knownSequence });

it('returns an authenticated unchanged marker without reading or validating the ledger', async () => {
  const response = await load();
  expect(response.status).toBe(200);
  const result = await response.json();
  expect(result).toMatchObject(unchanged());
  expect(result).not.toHaveProperty('data');
  expect(backend.readConditional).toHaveBeenCalledExactlyOnceWith(userId, namespace, 7);
  expect(backend.read).not.toHaveBeenCalled();
  expect(response.headers.get('Server-Timing')).not.toMatch(/(?:^|,\s*)validate;/);
  expect(vi.mocked(backend.access).mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(backend.readConditional!).mock.invocationCallOrder[0]);
});

it('fully validates changed snapshots before returning their original content', async () => {
  const data = emptyState(userId, namespace);
  vi.mocked(backend.readConditional!).mockResolvedValue({ sequence: 8, data });
  const response = await load();
  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ sequence: 8, data });
  expect(response.headers.get('Server-Timing')).toMatch(/validate;dur=/);
  vi.mocked(backend.readConditional!).mockResolvedValue({ sequence: 8, data: { ...data, userId: 'other' } });
  expect((await load()).status).toBe(403);
  vi.mocked(backend.readConditional!).mockResolvedValue({ sequence: 8, data: { ...data, subjects: 'invalid' } } as unknown as ServerSnapshot);
  expect((await load()).status).not.toBe(200);
});

it('returns the empty workspace after deletion and an unchanged marker for known empty workspaces', async () => {
  vi.mocked(backend.readConditional!).mockResolvedValue(null);
  expect(await (await load()).json()).toMatchObject({ sequence: 0, data: emptyState(userId, namespace) });
  expect(await (await load(0)).json()).toMatchObject(unchanged(0));
  vi.mocked(backend.readConditional!).mockResolvedValue(unchanged(0));
  expect((await load(0)).status).toBe(200);
});

it.each([-1, 1.5, '7', null, Number.MAX_SAFE_INTEGER + 1])('rejects invalid known sequence %s before database work', async known => {
  const response = await load(known);
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ code: 'INVALID_VERSION' });
  expect(backend.access).not.toHaveBeenCalled();
  expect(backend.readConditional).not.toHaveBeenCalled();
  expect(backend.read).not.toHaveBeenCalled();
});

it.each([
  { ...unchanged(), sequence: 8 },
  { ...unchanged(), sequence: '7' },
  { ...unchanged(), sequence: -1 },
  { ...unchanged(), unchanged: false },
])('does not accept a malformed unchanged version receipt: %j', async marker => {
  vi.mocked(backend.readConditional!).mockResolvedValue(marker as ServerUnchangedSnapshot);
  const response = await load();
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ code: 'INVALID_VERSION' });
});

it.each([{ ...unchanged(), userId: 'other' }, { ...unchanged(), namespace: 'personal' }, { unchanged: true, sequence: 7 }])('rejects incorrect or missing ownership metadata: %j', async marker => {
  vi.mocked(backend.readConditional!).mockResolvedValue(marker as ServerUnchangedSnapshot);
  const response = await load();
  expect(response.status).toBe(403);
  expect(await response.json()).toMatchObject({ code: 'OWNERSHIP' });
});

it.each(['pending', 'suspended', 'rejected'] as const)('does not read any workspace for a %s account', async status => {
  vi.mocked(backend.access).mockResolvedValue({ status, administrator: false });
  expect((await load()).status).toBe(403);
  expect(backend.readConditional).not.toHaveBeenCalled();
  expect(backend.read).not.toHaveBeenCalled();
});

it('rejects missing or expired authentication before accessing a workspace', async () => {
  expect((await request({ action: 'load', namespace, knownSequence: 7 }, '')).status).toBe(401);
  vi.mocked(backend.authenticate).mockResolvedValue('');
  expect((await load()).status).toBe(401);
  expect(backend.access).not.toHaveBeenCalled();
  expect(backend.readConditional).not.toHaveBeenCalled();
});

it('retains full reads for old clients and for backends without conditional support', async () => {
  const full = await request({ action: 'load', namespace });
  expect(await full.json()).toHaveProperty('data');
  expect(backend.readConditional).not.toHaveBeenCalled();
  delete backend.readConditional;
  expect(await (await load()).json()).toMatchObject(unchanged());
  expect(backend.read).toHaveBeenCalledTimes(2);
});

it.each([null, [], 'load', 7, true, {}])('rejects non-object or missing-action bodies as INVALID_REQUEST: %j', async body => {
  const response = await request(body);
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ code: 'INVALID_REQUEST' });
  expect(backend.access).not.toHaveBeenCalled();
  expect(backend.read).not.toHaveBeenCalled();
  expect(backend.readConditional).not.toHaveBeenCalled();
});

it('identifies malformed JSON as a bad request', async () => {
  const response = await handleCommand(new Request('https://test.invalid/study-command', { method: 'POST', headers: { authorization: 'Bearer fixture' }, body: '{' }), backend);
  expect(response.status).toBe(400);
  expect(await response.json()).toMatchObject({ code: 'INVALID_REQUEST' });
});
