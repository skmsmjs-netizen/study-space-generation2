import { expect, it, vi } from 'vitest';
import { handleTerminalAccess } from './code-terminal-access';
import { DomainError } from '../domain/model';
const request = (body: object, token = 'valid') => new Request('https://project.supabase.co/terminal', { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
function backend() { return { authenticate: vi.fn(async (token: string) => token === 'valid' ? 'authenticated-owner' : ''), access: vi.fn(async () => ({ status: 'approved' as const, administrator: false })), reserve: vi.fn(async () => {}), release: vi.fn(async () => {}) }; }
it('derives owner from authentication, generates a fresh lease, ignores a forged user id', async () => {
  const b = backend();
  const response = await handleTerminalAccess(request({ action: 'reserve', userId: 'another-user', job: 'forged' }), b);
  expect(response.status).toBe(200);
  const { job } = await response.json();
  expect(job).toMatch(/^[a-f0-9-]{36}$/);
  expect(b.reserve).toHaveBeenCalledWith('authenticated-owner', job);
});
it('rejects absent, expired and unapproved users before reserving capacity', async () => {
  const b = backend();
  expect((await handleTerminalAccess(request({ action: 'reserve' }, 'expired'), b)).status).toBe(401);
  b.access.mockRejectedValue(new DomainError('ACCESS_DENIED', '이용이 중지되어 있습니다.'));
  expect((await handleTerminalAccess(request({ action: 'reserve' }), b)).status).toBe(403);
  expect(b.reserve).not.toHaveBeenCalled();
});
it('preserves rate limits, allows only the authenticated owner to release even after admission changes', async () => {
  const b = backend();
  b.reserve.mockRejectedValueOnce(new DomainError('CODE_BUSY', '실행 중입니다.'));
  expect((await handleTerminalAccess(request({ action: 'reserve' }), b)).status).toBe(429);
  b.access.mockRejectedValue(new DomainError('ACCESS_DENIED', '이용 중지'));
  const job = '00000000-0000-4000-8000-000000000000';
  expect((await handleTerminalAccess(request({ action: 'release', job, userId: 'another' }), b)).status).toBe(200);
  expect(b.release).toHaveBeenCalledWith('authenticated-owner', job);
});
it('rejects unknown operations, oversized bodies and malformed JSON without changing quota', async () => {
  const b = backend();
  for (const body of [{ action: 'execute' }, { action: 'reserve', extra: 'x'.repeat(3000) }]) expect((await handleTerminalAccess(request(body), b)).status).toBe(400);
  expect(b.reserve).not.toHaveBeenCalled();
});
