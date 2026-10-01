import { test, expect } from '@playwright/test';
import { emptyState, type Command } from '../../src/domain/model';
import { applyCommand } from '../../src/domain/commands';
import { decodeStoredText } from '../../src/data/storage-codec';

test('personal entry, pending text, authentication recovery and reload survive a full legacy journal slot', async ({
  page,
}, info) => {
  const owner = '70000000-0000-4000-8000-000000000077';
  const original =
    '  보존할 원문\r\n조건과 예외 · 原文\n' +
    '긴 한국어와 원래 조건을 보존합니다. '.repeat(160) +
    '끝 공백  ';
  const command: Command = {
    type: 'saveMemo',
    id: 'preserved',
    body: original,
    ownerId: null,
    strokes: [],
    expectedVersion: 0,
    opId: 'pending-original',
    at: '2026-10-01T00:00:00.000Z',
    userId: owner,
    namespace: 'personal',
  };
  let server = { sequence: 0, data: emptyState(owner, 'personal') };
  const raw = JSON.stringify({
    format: 1,
    base: server,
    local: applyCommand(server.data, command),
    pending: [command],
    archives: [],
  });
  const sent = new Set<string>();
  let refreshCount = 0;
  let rejectedOp: string | undefined;
  await page.route('https://*.supabase.co/**', async (route) => {
    if (route.request().url().includes('/auth/v1/token')) {
      refreshCount++;
      const expires = Math.floor(Date.now() / 1000) + 7200;
      const token = [
        Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
        Buffer.from(JSON.stringify({ sub: owner, exp: expires, aud: 'authenticated' })).toString('base64url'),
        'isolated-refreshed',
      ].join('.');
      return route.fulfill({ json: {
        access_token: token,
        refresh_token: 'isolated-next-refresh',
        token_type: 'bearer',
        expires_in: 7200,
        expires_at: expires,
        user: { id: owner, aud: 'authenticated', role: 'authenticated', email: 'isolated@example.invalid' },
      } });
    }
    const body = route.request().postDataJSON();
    if (body?.action === 'access')
      return route.fulfill({
        json: { status: 'approved', administrator: false, displayName: '격리 확인' },
      });
    if (body?.action === 'load') return route.fulfill({ json: server });
    if (body?.action === 'execute' || body?.action === 'execute-batch') {
      const firstOp = (body.commands ?? [body.command])[0] as Command;
      if (!rejectedOp) {
        rejectedOp = firstOp.opId;
        return route.fulfill({ status: 401, json: { code: 'AUTH_REQUIRED', message: 'Isolated expired access token' } });
      }
      expect(route.request().headers().authorization).toContain('isolated-refreshed');
      if (sent.size === 0) expect(firstOp.opId).toBe(rejectedOp);
      for (const op of (body.commands ?? [body.command]) as Command[]) {
        const journals = await page.evaluate(async () => {
          const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const r = indexedDB.open('study-space-personal-journals', 1);
            r.onsuccess = () => resolve(r.result);
            r.onerror = () => reject(r.error);
          });
          try {
            return await new Promise<string[]>((resolve, reject) => {
              const tx = db.transaction('journals', 'readonly');
              const r = tx.objectStore('journals').getAll();
              tx.oncomplete = () => resolve(r.result);
              tx.onabort = () => reject(tx.error);
            });
          } finally {
            db.close();
          }
        });
        expect(
          journals
            .map((raw) => JSON.parse(decodeStoredText(raw)))
            .some(
              (row) =>
                row.local.userId === owner &&
                row.pending.some((pending: Command) => pending.opId === op.opId),
            ),
        ).toBe(true);
        expect(sent.has(op.opId)).toBe(false);
        sent.add(op.opId);
        server = { sequence: server.sequence + 1, data: applyCommand(server.data, op) };
      }
      return route.fulfill({ json: server });
    }
    if (route.request().url().includes('/auth/v1/user'))
      return route.fulfill({
        json: { id: owner, aud: 'authenticated', email: 'isolated@example.invalid' },
      });
    return route.fulfill({
      status: 400,
      json: { message: 'Isolated fixture rejects all other server requests' },
    });
  });
  await page.addInitScript(
    ({ owner, raw }) => {
      if (!sessionStorage.getItem('quota-fixture-installed')) {
        const expires = Math.floor(Date.now() / 1000) + 7200;
        const token = [
          btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
          btoa(JSON.stringify({ sub: owner, exp: expires, aud: 'authenticated' })),
          'isolated',
        ].join('.');
        localStorage.setItem(
          'study-space:auth:v1',
          JSON.stringify({
            access_token: token,
            refresh_token: 'isolated-refresh',
            token_type: 'bearer',
            expires_in: 7200,
            expires_at: expires,
            user: {
              id: owner,
              aud: 'authenticated',
              role: 'authenticated',
              email: 'isolated@example.invalid',
            },
          }),
        );
        localStorage.setItem(`study-space:personal:${owner}:online:v1`, raw);
        sessionStorage.setItem('quota-fixture-installed', 'yes');
      }
      const write = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (
          this === localStorage &&
          key.startsWith(`study-space:personal:${owner}:online:v1:window:`)
        )
          throw new DOMException('Isolated full journal slot', 'QuotaExceededError');
        write.call(this, key, value);
      };
    },
    { owner, raw },
  );
  await page.goto('?space=personal#/memos');
  await expect(page.getByRole('button', { name: '메모 추가', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '내 공부 공간을 열지 못했습니다' })).toHaveCount(
    0,
  );
  await expect.poll(() => server.data.memos?.[0]?.body).toBe(original);
  expect(refreshCount).toBe(1);
  expect(rejectedOp).toBe(command.opId);
  await page.getByRole('button', { name: /메모 1 열기/ }).click();
  const next = '  이어 적은 글\n예외는 그대로  ';
  await page.getByRole('textbox', { name: '짧은 글', exact: true }).fill(next);
  await expect.poll(() => server.data.memos?.[0]?.body).toBe(next);
  expect(server.data.revisions.some((row) => JSON.stringify(row).includes('보존할 원문'))).toBe(
    true,
  );
  await page.reload();
  await expect(page.getByRole('button', { name: '메모 추가', exact: true })).toBeVisible();
  await page.getByRole('button', { name: /메모 1 열기/ }).click();
  await expect(page.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(next);
  expect(
    await page.evaluate(
      (owner) => localStorage.getItem(`study-space:personal:${owner}:online:v1`),
      owner,
    ),
  ).toBe(raw);
  const journals = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('study-space-personal-journals', 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    try {
      return await new Promise<string[]>((resolve, reject) => {
        const tx = db.transaction('journals', 'readonly'),
          r = tx.objectStore('journals').getAll();
        tx.oncomplete = () => resolve(r.result);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  });
  expect(
    journals
      .map((raw) => JSON.parse(decodeStoredText(raw)))
      .some((row) => row.local.memos?.[0]?.body === next),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath('personal-quota-recovered.png'), fullPage: true });
});
