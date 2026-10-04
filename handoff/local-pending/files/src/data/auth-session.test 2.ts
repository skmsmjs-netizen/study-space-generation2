import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AUTH_KEY, loginStorageOptions, readLoginPersistence } from './auth-session';
import { createStudyClient, signInStudyClient } from './supabase-client';

const config = { url: 'https://synthetic.supabase.co', publishableKey: 'sb_publishable_synthetic' };
const credentials = { email: 'synthetic@example.invalid', password: 'synthetic-password' };
const clients: ReturnType<typeof createStudyClient>[] = [];
const makeClient = () => { const client = createStudyClient(config); clients.push(client); return client; };
const session = () => ({ access_token: 'synthetic-access', refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_in: 3600, user: { id: 'synthetic-user', aud: 'authenticated', email: credentials.email } });
let request: ReturnType<typeof vi.fn>;
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  request = vi.fn(async () => new Response(JSON.stringify(session()), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  vi.stubGlobal('fetch', request);
});
afterEach(() => { clients.splice(0).forEach(client => client.auth.dispose()); vi.unstubAllGlobals(); });

it('restores remembered login after tab storage is lost while preserving original records', async () => {
  localStorage.setItem('study-space:personal:synthetic-user:draft', '  원문\n예외');
  const signedIn = await signInStudyClient(makeClient(), credentials, true); clients.push(signedIn);
  expect(localStorage.getItem(AUTH_KEY)).toContain('synthetic-refresh');
  signedIn.auth.dispose(); sessionStorage.clear();
  expect((await makeClient().auth.getSession()).data.session?.user.id).toBe('synthetic-user');
  expect(localStorage.getItem('study-space:personal:synthetic-user:draft')).toBe('  원문\n예외');
});

it('restores temporary login on reload but requires login in a fresh tab and never stores its token persistently', async () => {
  const signedIn = await signInStudyClient(makeClient(), credentials, false); clients.push(signedIn);
  expect(localStorage.getItem(AUTH_KEY)).toBeNull(); expect(readLoginPersistence()).toBe(false);
  const key = loginStorageOptions(false).storageKey;
  expect(sessionStorage.getItem(key)).toContain('synthetic-refresh');
  signedIn.auth.dispose();
  expect((await makeClient().auth.getSession()).data.session?.user.id).toBe('synthetic-user');
  sessionStorage.clear();
  expect((await makeClient().auth.getSession()).data.session).toBeNull();
});

it('keeps automatic token refresh inside the temporary tab', async () => {
  const signedIn = await signInStudyClient(makeClient(), credentials, false); clients.push(signedIn);
  request.mockImplementationOnce(async () => new Response(JSON.stringify({ ...session(), refresh_token: 'synthetic-refreshed' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  expect((await signedIn.auth.refreshSession()).error).toBeNull();
  expect(sessionStorage.getItem(loginStorageOptions(false).storageKey)).toContain('synthetic-refreshed');
  expect(localStorage.getItem(AUTH_KEY)).toBeNull();
});

it('removes temporary credentials on logout and retains study writing', async () => {
  localStorage.setItem('synthetic-draft', 'keep');
  const signedIn = await signInStudyClient(makeClient(), credentials, false); clients.push(signedIn);
  request.mockImplementationOnce(async () => new Response(null, { status: 204 }));
  expect((await signedIn.auth.signOut({ scope: 'local' })).error).toBeNull();
  expect(sessionStorage.getItem(loginStorageOptions(false).storageKey)).toBeNull();
  expect(localStorage.getItem('synthetic-draft')).toBe('keep');
});

it('leaves the old persistence choice and records intact when login fails', async () => {
  const original = makeClient(); await original.auth.getSession();
  request.mockImplementationOnce(async () => new Response(JSON.stringify({ code: 'invalid_credentials', message: 'Invalid login credentials' }), { status: 400, headers: { 'Content-Type': 'application/json' } }));
  await expect(signInStudyClient(original, credentials, false)).rejects.toThrow();
  expect(readLoginPersistence()).toBe(true); expect(localStorage.getItem(AUTH_KEY)).toBeNull();
  expect((await original.auth.getSession()).data.session).toBeNull();
});

it('uses separate broadcast channels per temporary tab and retains the legacy persistent key', () => {
  const otherTab = new Map<string, string>();
  const storage: Storage = { getItem: key => otherTab.get(key) ?? null, setItem: (key, value) => { otherTab.set(key, value); }, removeItem: key => { otherTab.delete(key); }, clear: () => otherTab.clear(), key: index => [...otherTab.keys()][index] ?? null, get length() { return otherTab.size; } };
  expect(loginStorageOptions(false).storageKey).not.toBe(loginStorageOptions(false, storage).storageKey);
  expect(loginStorageOptions(true).storageKey).toBe(AUTH_KEY);
});
it('does not send credentials or fall back to persistent storage when temporary storage is blocked', async () => {
  const client = makeClient(); await client.auth.getSession();
  const original = Storage.prototype.setItem;
  const blocked = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
    if (this === sessionStorage) throw new Error('storage disabled');
    original.call(this, key, value);
  });
  try {
    await expect(signInStudyClient(client, credentials, false)).rejects.toMatchObject({code:'AUTH_STORAGE'});
    expect(request).not.toHaveBeenCalled(); expect(localStorage.getItem(AUTH_KEY)).toBeNull();
  } finally { blocked.mockRestore(); }
});
