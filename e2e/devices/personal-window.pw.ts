import { expect, test } from '@playwright/test';
import { AUTH_KEY } from '../../src/data/auth-session';
import { emptyState, type Command } from '../../src/domain/model';
import { applyCommand } from '../../src/domain/commands';
import { PUBLIC_SERVER_URL } from '../../src/data/public-server-config';

const userId = '70000000-0000-4000-8000-000000000009';
const op = (id: string, body: string): Command => ({ type: 'saveMemo', id, body, ownerId: null, strokes: [],
  expectedVersion: 0, userId, namespace: 'personal', opId: `seed-${id}`, at: '2026-10-01T01:00:00.000Z' });

test('two personal windows open, resume the input location and retain independent writes and failed-save recovery', async ({ context, page }, info) => {
  let server = { sequence: 2, data: applyCommand(applyCommand(emptyState(userId, 'personal'), op('one', '첫 번째 입력 자리')), op('two', '두 번째 입력 자리')) };
  let failWrites = false, failedWrites = 0;
  // This account and all server responses are isolated fixtures. No operating
  // Supabase request or real user session is used by this test.
  const token = `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })).toString('base64url')}.synthetic`;
  await context.route(`${PUBLIC_SERVER_URL}/**`, async route => {
    const request = route.request();
    if (!request.url().includes('/functions/v1/study-command')) {
      await route.fulfill({ status: 200, json: { id: userId, email: 'fixture@example.invalid' } }); return;
    }
    const body = request.postDataJSON();
    if (body.action === 'access') { await route.fulfill({ json: { status: 'approved', administrator: false, displayName: '창 복원 확인', version: 1 } }); return; }
    if (body.action === 'load') { await route.fulfill({ json: server }); return; }
    if (failWrites) { failedWrites++; await route.fulfill({ status: 503, json: { code: 'SERVER_ERROR', message: '저장 연결 확인 중' } }); return; }
    const commands: Command[] = body.commands ?? [body.command];
    if (body.baseSequence !== server.sequence && !server.data.appliedOps[commands[0].opId]) {
      await route.fulfill({ status: 409, json: { code: 'VERSION_CONFLICT', message: '다른 창의 기록이 갱신되었습니다.' } }); return;
    }
    for (const command of commands) {
      const exists = Boolean(server.data.appliedOps[command.opId]);
      server = { sequence: server.sequence + (exists ? 0 : 1), data: applyCommand(server.data, command) };
    }
    await route.fulfill({ json: server });
  });
  await context.addInitScript(({ key, token, userId }) => {
    localStorage.setItem(key, JSON.stringify({ access_token: token, refresh_token: 'synthetic-refresh', token_type: 'bearer',
      expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: userId, email: 'fixture@example.invalid', aud: 'authenticated', role: 'authenticated' } }));
  }, { key: AUTH_KEY, token, userId });
  await page.goto('?space=personal#/memos/one');
  const first = '  첫 창에서 이어 쓰는 글\n조건과 예외도 보존  ';
  await page.getByRole('textbox', { name: '짧은 글', exact: true }).fill(first);
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  await expect.poll(() => server.data.memos?.find(row => row.id === 'one')?.body).toBe(first);

  const second = await context.newPage();
  await second.goto('?space=personal');
  await expect(second.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(first);
  await expect(second).toHaveURL(/#\/memos\/one$/);
  await expect(page.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(first);
  await second.getByRole('button', { name: '닫기', exact: true }).click();
  await second.goto('?space=personal#/');
  await expect(second.getByRole('heading', { name: '오늘', exact: true })).toBeVisible();
  await expect(second.getByLabel('하던 공부 이어가기').getByRole('alert')).toHaveCount(0);
  await second.goto('?space=personal#/memos/two');
  const other = '  두 번째 창의 독립된 글\n한글과 끝 공백  ';
  await second.getByRole('textbox', { name: '짧은 글', exact: true }).fill(other);
  await second.getByRole('button', { name: '지금 저장', exact: true }).click();
  await expect.poll(() => server.data.memos?.find(row => row.id === 'two')?.body).toBe(other);
  await page.reload();
  await expect(page.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(first);

  failWrites = true;
  const pending = `${other}\n연결이 끊겨도 남아야 하는 글`;
  await second.getByRole('textbox', { name: '짧은 글', exact: true }).fill(pending);
  await second.getByRole('button', { name: '지금 저장', exact: true }).click();
  await expect.poll(() => failedWrites).toBeGreaterThan(0);
  await second.reload();
  await expect(second.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(pending);
  // The status is accessible after closing the memo dialog; the outbox retains
  // the text throughout the refresh/retry instead of blocking the entire space.
  await second.getByRole('button', { name: '닫기', exact: true }).click();
  await expect(second.getByRole('dialog', { name: '작은 메모', exact: true })).toBeHidden();
  await second.getByRole('button', { name: /저장 연결 확인 중/ }).click();
  failWrites = false;
  await second.getByRole('button', { name: '서버 저장 다시 시도', exact: true }).click();
  await expect.poll(() => server.data.memos?.find(row => row.id === 'two')?.body).toBe(pending);
  await second.getByRole('button', { name: '내 기록의 저장 상태 닫기', exact: true }).click();
  await second.reload();
  await second.goto('?space=personal#/memos/two');
  await expect(second.getByRole('textbox', { name: '짧은 글', exact: true })).toHaveValue(pending);
  expect(server.data.memos).toHaveLength(2);
  expect(await second.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await second.screenshot({ path: info.outputPath('two-window-resume.png'), fullPage: true });
});
