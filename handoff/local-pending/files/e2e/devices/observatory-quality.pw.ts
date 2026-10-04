import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function selectTheme(page: Page, theme: 'light' | 'dark') {
  const desktop = page.locator('.sidebar-bottom');
  const settings = await desktop.isVisible() ? desktop : page.locator('.compact-menu');
  await settings.locator('summary').click();
  await settings.getByRole('combobox', { name: '화면 밝기', exact: true }).selectOption(theme);
  await settings.locator('summary').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

test('paper and interior stay readable across the four real places and preserved reading preferences', async ({ page }, info) => {
  await page.goto('?space=demo#/record');
  await expect(page.getByRole('heading', { name: '공부 기록', exact: true })).toBeVisible();
  await selectTheme(page, 'light');
  const findings: unknown[] = [];
  // Real routes from each place exercise inherited surfaces, inputs, tabs and long results.
  for (const [route, place] of [['/record', 'front'], ['/subjects', 'left'], ['/code', 'right'], ['/statistics', 'back']]) {
    await page.goto(`?space=demo#${route}`);
    await expect(page.locator('.app-shell')).toHaveAttribute('data-observatory-place', place);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('main [data-ui-loading]')).toHaveCount(0);
    await expect(page.locator('main')).toHaveCSS('background-color', 'rgb(228, 220, 205)');
    expect(['24px', '28px']).toContain(await page.locator('main h1').first().evaluate(el => getComputedStyle(el).fontSize));
    await expect(page.locator('.observatory-place-links [aria-current="location"]')).toHaveCount(1);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    findings.push({ route, violations: result.violations, incomplete: result.incomplete.map(item => item.id) });
    expect.soft(result.violations, route).toEqual([]);
    expect.soft(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route).toBeLessThanOrEqual(1);
  }
  await selectTheme(page, 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('main')).toHaveCSS('background-color', 'rgb(40, 39, 34)');
  const dark = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  findings.push({ route: '/statistics', theme: 'dark', violations: dark.violations });
  expect(dark.violations).toEqual([]);
  await info.attach('observatory-material-accessibility', { body: JSON.stringify(findings, null, 2), contentType: 'application/json' });
  await page.screenshot({ path: info.outputPath('preserved-dark-reading.png') });
});

test('paper dialog keeps focus, validation and the unfinished original when dismissed', async ({ page }, info) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true });
  const original = `  ${'반복해서 읽을 조건과 예외. '.repeat(80)}\n끝 공백  `;
  await memo.fill(original);
  await selectTheme(page, 'light');
  const spaceSettings = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  if (!(await spaceSettings.evaluate((node) => (node as HTMLDetailsElement).open)))
    await spaceSettings.locator('summary').first().click();
  await page.getByRole('button', { name: '학기 추가', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('background-color', 'rgb(228, 220, 205)');
  await expect.poll(() => page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))).toBe(true);
  const result = await new AxeBuilder({ page }).include('[role="dialog"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: '학기 추가', exact: true })).toBeFocused();
  await page.reload();
  await expect(memo).toHaveValue(original);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await info.attach('long-original-preserved', { body: JSON.stringify({ characters: original.length, reloaded: true, dialogDismissed: true }), contentType: 'application/json' });
});
