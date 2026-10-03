import { expect, test } from '@playwright/test';
const bar = (page: import('@playwright/test').Page) => page.locator('.navigation-history-bar');
const control = (page: import('@playwright/test').Page, name: string) => bar(page).getByRole('button', { name, exact: true });

test('back and forward follow native history, reload and branching while keeping a long draft', async ({ page }, info) => {
  await page.goto('?space=demo#/subjects');
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(control(page, '뒤로가기')).toBeDisabled();
  await expect(control(page, '앞으로가기')).toBeDisabled();
  await page.locator('main a[href^="#/subject/"]').first().click();
  await expect(page).toHaveURL(/#\/subject\//);
  await control(page, '뒤로가기').click();
  await expect(page).toHaveURL(/#\/subjects$/);
  await expect(control(page, '앞으로가기')).toBeEnabled();
  await page.reload();
  await expect(control(page, '앞으로가기')).toBeEnabled();
  await control(page, '앞으로가기').click();
  await expect(page).toHaveURL(/#\/subject\//);
  await expect(control(page, '앞으로가기')).toBeDisabled();
  await page.evaluate(() => { location.hash = '#/record'; });
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true }).first();
  const text = `  이동 전에 쓴 원문\n${'조건과 예외를 보존한다. '.repeat(50)}  `;
  await memo.fill(text);
  await page.evaluate(() => { location.hash = '#/memos'; });
  await expect(page.locator('main h1').first()).toContainText('메모');
  await control(page, '뒤로가기').click();
  await expect(memo).toHaveValue(text);
  await page.goBack();
  await expect(page).toHaveURL(/#\/subject\//);
  await expect(control(page, '앞으로가기')).toBeEnabled();
  await control(page, '앞으로가기').click();
  await expect(memo).toHaveValue(text);
  await page.evaluate(() => { location.hash = '#/help'; });
  await expect(page.locator('main h1').first()).toContainText('도움말');
  await expect(control(page, '앞으로가기')).toBeDisabled();
  await page.reload();
  await expect(control(page, '뒤로가기')).toBeEnabled();
  await control(page, '뒤로가기').click();
  await expect(memo).toHaveValue(text);
  // A toolbar stays reachable after scrolling; each target fits even a narrow window.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const box = await control(page, '뒤로가기').boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0); expect(box!.y + box!.height).toBeLessThanOrEqual(info.project.use.viewport!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath('history-toolbar.png') });
});

test('dialog has its own reachable history icons and preserves its draft when navigating', async ({ page }) => {
  await page.goto('?space=demo#/subjects');
  await page.locator('main a[href^="#/subject/"]').first().click();
  const tools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  await tools.locator('summary').click();
  await tools.getByRole('button', { name: '학기 추가', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '학기 추가', exact: true });
  await dialog.getByRole('textbox', { name: '이름', exact: true }).fill('  이동 뒤에도 남는 학기 초안  ');
  await expect(dialog.getByRole('button', { name: '앞으로가기', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '뒤로가기', exact: true }).click();
  await expect(page).toHaveURL(/#\/subjects$/);
  await expect(dialog).toHaveCount(0);
  const returnedTools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  if (!await returnedTools.locator('summary').evaluate(el => (el.parentElement as HTMLDetailsElement).open)) await returnedTools.locator('summary').click();
  await returnedTools.getByRole('button', { name: '학기 추가', exact: true }).click();
  await expect(dialog.getByRole('textbox', { name: '이름', exact: true })).toHaveValue('  이동 뒤에도 남는 학기 초안  ');
});

test('login entry and unavailable routes keep both icons visible without horizontal overflow', async ({ page }, info) => {
  await page.goto('#/');
  await expect(control(page, '뒤로가기')).toBeVisible();
  await expect(control(page, '앞으로가기')).toBeVisible();
  await page.goto('?space=demo#/missing-screen');
  await expect(page.locator('main')).toContainText('항목');
  await expect(control(page, '뒤로가기')).toBeVisible();
  await expect(control(page, '앞으로가기')).toBeVisible();
  if (info.project.name === 'iPhone-17-Pro-portrait') await page.setViewportSize({ width: 320, height: 568 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
