import { expect, test } from '@playwright/test';
import { AUTH_KEY } from '../../src/data/auth-session';
import { PUBLIC_SERVER_URL } from '../../src/data/public-server-config';
import { emptyState } from '../../src/domain/model';
import { emptyExperience } from '../../src/domain/brand';

test('shared settings survive another personal window and reload without overwriting existing originals', async ({
  context,
  page,
}, info) => {
  const userId = '70000000-0000-4000-8000-000000000019';
  const key = `study-space:personal:${userId}:experience:v1`;
  const original = '  다음에 펼칠 원문\n이유와 예외도 유지  ';
  const state = {
    ...emptyExperience(),
    readingWidth: 'wide',
    next: { location: { route: '/math', label: '수식 탐색' }, body: original },
  };
  const raw = JSON.stringify(state);
  let writes = 0;
  await context.route(`${PUBLIC_SERVER_URL}/**`, async (route) => {
    if (!route.request().url().includes('/functions/v1/study-command')) {
      await route.fulfill({ json: { id: userId, email: 'settings-fixture@example.invalid' } });
      return;
    }
    const body = route.request().postDataJSON();
    if (body.action === 'access') {
      await route.fulfill({
        json: {
          status: 'approved',
          administrator: false,
          displayName: '설정 복귀 확인',
          version: 1,
        },
      });
      return;
    }
    if (body.action === 'load') {
      await route.fulfill({ json: { sequence: 0, data: emptyState(userId, 'personal') } });
      return;
    }
    writes++;
    await route.fulfill({
      status: 503,
      json: { code: 'SERVER_ERROR', message: '격리 검사에서 공부 쓰기를 허용하지 않습니다.' },
    });
  });
  const token = `${Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')}.${Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })).toString('base64url')}.synthetic`;
  await context.addInitScript(
    ({ authKey, token, userId, key, raw }) => {
      localStorage.setItem(
        authKey,
        JSON.stringify({
          access_token: token,
          refresh_token: 'synthetic-refresh',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: userId,
            email: 'settings-fixture@example.invalid',
            aud: 'authenticated',
            role: 'authenticated',
          },
        }),
      );
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, raw);
        localStorage.setItem(`${key}:window-author`, 'an-earlier-window');
        localStorage.setItem(`${key}:recovery:window-an-earlier-window`, raw);
      }
    },
    { authKey: AUTH_KEY, token, userId, key, raw },
  );
  const tools = (p: typeof page) =>
    p.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  await page.goto('?space=personal#/record');
  await tools(page).locator('summary').click();
  await expect(
    tools(page).getByRole('combobox', { name: '본문 읽기 폭', exact: true }),
  ).toHaveValue('wide');
  await expect(page.getByText('Unexpected end of JSON input', { exact: true })).toHaveCount(0);
  const second = await context.newPage();
  await second.goto('?space=personal#/record');
  await tools(second).locator('summary').click();
  await expect(
    tools(second).getByRole('combobox', { name: '본문 읽기 폭', exact: true }),
  ).toHaveValue('wide');
  await tools(second)
    .getByRole('combobox', { name: '본문 읽기 폭', exact: true })
    .selectOption('normal');
  await expect(
    tools(page).getByRole('combobox', { name: '본문 읽기 폭', exact: true }),
  ).toHaveValue('normal');
  await page.reload();
  await tools(page).locator('summary').click();
  await expect(
    tools(page).getByRole('combobox', { name: '본문 읽기 폭', exact: true }),
  ).toHaveValue('normal');
  const retained = await page.evaluate(
    (key) => ({
      value: JSON.parse(localStorage.getItem(key)!),
      oldCopy: localStorage.getItem(`${key}:recovery:window-an-earlier-window`),
    }),
    key,
  );
  expect(retained.value.next).toBeNull();
  expect(JSON.parse(retained.oldCopy!).next.body).toBe(original);
  expect(retained.oldCopy).toBe(raw);
  expect(writes).toBe(0);
  await page.screenshot({ path: info.outputPath('settings-after-reopen.png'), fullPage: true });
});
