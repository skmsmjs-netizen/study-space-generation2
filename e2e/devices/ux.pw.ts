import { expect, test } from '@playwright/test';

test('modal touch dismissal, cancelled drag and long draft reopening preserve context', async ({
  page,
}, info) => {
  await page.goto('?space=demo');
  const trigger = page.getByRole('button', { name: '학기 추가', exact: true });
  const spaceSettings = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  if (!(await spaceSettings.evaluate((node) => (node as HTMLDetailsElement).open)))
    await spaceSettings.locator('summary').first().click();
  await trigger.tap();
  const dialog = page.getByRole('dialog', { name: '학기 추가', exact: true });
  const original = `  조건과 예외 · ${'긴 한국어 초안 '.repeat(80)}  `;
  await dialog.getByRole('textbox', { name: '이름', exact: true }).fill(original);
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  const y = Math.min(box!.y + 24, info.project.use.viewport!.height - 25);
  await page.mouse.move(3, y);
  await page.mouse.down();
  await expect(dialog).toBeVisible();
  await page.mouse.move(3, y + 18, { steps: 3 });
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: '이름', exact: true })).toHaveValue(original);
  await page.screenshot({ path: info.outputPath('modal-long-draft.png') });
  await page.touchscreen.tap(3, y);
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await expect(dialog.getByRole('textbox', { name: '이름', exact: true })).toHaveValue(original);
  await dialog.getByRole('button', { name: '학기 추가 닫기', exact: true }).tap();
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    info.project.use.viewport!.width + 1,
  );
});

test('failed lazy screen retains navigation and reload retry recovers without clearing drafts', async ({
  page,
}, info) => {
  await page.route('**/study-graph-*.js', (route) =>
    route.fulfill({
      status: 503,
      headers: { 'cache-control': 'no-store' },
      body: 'isolated device regression failure',
    }),
  );
  await page.goto('?space=demo');
  const graph = page.locator('nav a[href="#/graph"]').filter({ visible: true }).first();
  await graph.tap();
  await expect(
    page.getByRole('heading', { name: '이 화면을 열지 못했습니다', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '다시 시도', exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('screen-failure.png') });
  await page.locator('nav a[href="#/subjects"]').filter({ visible: true }).first().tap();
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await page.unroute('**/study-graph-*.js');
  await graph.tap();
  await expect(page.getByRole('button', { name: '다시 시도', exact: true })).toBeVisible();
  await Promise.all([
    page.waitForEvent('load'),
    page.getByRole('button', { name: '다시 시도', exact: true }).tap(),
  ]);
  await expect(page.locator('main [data-ui-loading]')).toHaveCount(0);
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page).toHaveURL(/#\/graph$/);
});
