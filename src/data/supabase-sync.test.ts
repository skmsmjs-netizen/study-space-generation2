// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { onlineTransport } from './supabase-client';
import { emptyState } from '../domain/model';
import { clearRequestPerformance, readRequestPerformance } from './request-performance';
const user = '10000000-0000-4000-8000-000000000001';
const known = () => ({ sequence: 4, data: emptyState(user, 'personal') });
function fixture(result: unknown) {
  const invoke = vi.fn(async () => ({ data: result, error: null }));
  const client = {
    auth: { getSession: async () => ({ data: { session: { user: { id: user } } }, error: null }) },
    functions: { invoke },
  } as unknown as SupabaseClient;
  return { transport: onlineTransport(client), invoke };
}
beforeEach(clearRequestPerformance);
it('reuses only the authenticated owner base for a matching conditional response', async () => {
  const cached = known(),
    f = fixture({
      unchanged: true,
      sequence: 4,
      userId: user,
      namespace: 'personal',
      supportedCommands: ['saveMemo'],
      syncCapabilities: { batchCommands: true },
    });
  const result = await f.transport.load(cached);
  expect(result.data).toBe(cached.data);
  expect(result.supportedCommands).toEqual(['saveMemo']);
  expect(f.invoke.mock.calls[0]).toEqual([
    'study-command',
    expect.objectContaining({ body: { action: 'load', namespace: 'personal', knownSequence: 4 } }),
  ]);
  expect(readRequestPerformance()).toEqual([
    expect.objectContaining({ phase: 'sync-load', success: true }),
  ]);
});
it('remains compatible with an old server returning the full snapshot', async () => {
  const full = known(),
    f = fixture(full);
  expect(await f.transport.load(known())).toBe(full);
  await f.transport.load();
  expect(f.invoke.mock.calls[1]).toEqual([
    'study-command',
    expect.objectContaining({ body: { action: 'load', namespace: 'personal' } }),
  ]);
});
it.each([
  { sequence: 3, userId: user, namespace: 'personal' },
  { sequence: 4, userId: 'other', namespace: 'personal' },
  { sequence: 4, userId: user, namespace: 'test' },
])('refuses a mismatched unchanged receipt: %j', async (patch) => {
  const f = fixture({ unchanged: true, supportedCommands: [], ...patch });
  await expect(f.transport.load(known())).rejects.toThrow();
  expect(readRequestPerformance()[0].success).toBe(false);
});
it('refuses a foreign cache before transmitting and refuses unchanged without a cache', async () => {
  const f = fixture({
    unchanged: true,
    sequence: 4,
    userId: user,
    namespace: 'personal',
    supportedCommands: [],
  });
  await expect(
    f.transport.load({ ...known(), data: emptyState('other', 'personal') }),
  ).rejects.toThrow();
  expect(f.invoke).not.toHaveBeenCalled();
  await expect(f.transport.load()).rejects.toThrow();
});
