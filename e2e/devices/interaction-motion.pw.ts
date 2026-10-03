import { expect, test } from '@playwright/test';

test('functional window motion preserves a long draft, immediate close ownership and reduced motion', async ({ page }, info) => {
  await page.addInitScript(() => {
    (window as unknown as { closingStates: unknown[] }).closingStates = [];
    new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('.ui-overlay[data-motion-state="closing"]').forEach(node => {
        (window as unknown as { closingStates: unknown[] }).closingStates.push({ inert: node.inert, hidden: node.getAttribute('aria-hidden') });
      });
    }).observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-motion-state'] });
  });
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true }).first();
  const text = `  전환 중 원문\n${'조건과 예외를 보존한다. '.repeat(60)}  `;
  await memo.fill(text);
  const tools = page.locator('.sidebar-bottom:visible, .compact-menu:visible').first();
  await tools.locator('summary').click();
  const trigger = tools.getByRole('button', { name: '학기 추가', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: '학기 추가', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCSS('animation-name', 'ui-window-enter');
  await dialog.getByRole('textbox', { name: '이름', exact: true }).fill('  전환 중 작성한 긴 이름 · 조건과 예외  ');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.getElementById('root')?.hasAttribute('inert'))).toBe(false);
  expect(await page.evaluate(() => (window as unknown as { closingStates: { inert: boolean; hidden: string }[] }).closingStates)).toContainEqual({ inert: true, hidden: 'true' });
  await trigger.click();
  await expect(dialog.getByRole('textbox', { name: '이름', exact: true })).toHaveValue('  전환 중 작성한 긴 이름 · 조건과 예외  ');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(dialog).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(page.locator('.ui-overlay')).toHaveCount(0);
  await expect(memo).toHaveValue(text);
  await page.reload();
  await expect(memo).toHaveValue(text);
  await memo.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('motion-draft-preserved.png') });
});

test('detail and back show the real relationship while rapid destinations keep draft and history', async ({ page }) => {
  await page.goto('?space=demo#/subjects');
  const first = page.locator('main a[href^="#/subject/"]').first();
  await first.click();
  await expect(page.locator('main')).toHaveAttribute('data-route-motion', 'forward');
  await page.goBack();
  await expect(page.locator('main')).toHaveAttribute('data-route-motion', 'back');
  await page.locator('.ui-navigation-bar:visible a[href="#/record"]').first().click();
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const memo = page.getByRole('textbox', { name: '메모', exact: true }).first();
  await memo.fill('  빠른 이동\n초안과 예외  ');
  await page.evaluate(() => {
    location.hash = '#/statistics';
    setTimeout(() => { location.hash = '#/subjects'; }, 16);
    setTimeout(() => { location.hash = '#/record'; }, 32);
  });
  await expect(memo).toHaveValue('  빠른 이동\n초안과 예외  ');
  await expect(page.locator('main')).toHaveAttribute('data-route-motion', 'fade');
  await page.reload();
  await expect(memo).toHaveValue('  빠른 이동\n초안과 예외  ');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('context menu entrance, close and pointer cancellation retain keyboard access', async ({ page }) => {
  await page.goto('?space=demo#/subjects');
  await page.locator('main a[href^="#/subject/"]').first().click();
  await page.locator('main a[href^="#/node/"]').first().click();
  const trigger = page.getByRole('button', { name: /목차 관리/ }).first();
  await trigger.scrollIntoViewIfNeeded();
  const bounds = await trigger.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await expect.poll(() => trigger.evaluate(node => Number.parseFloat(getComputedStyle(node).transform.replace('matrix(', '')))).toBeLessThan(.995);
  await page.mouse.up();
  const menu = page.getByRole('menu').last();
  await expect(menu).toBeVisible();
  await expect(menu).toHaveCSS('animation-name', 'ui-menu-enter');
  await page.keyboard.press('ArrowDown');
  expect(await menu.locator(':focus').count()).toBe(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trigger.click();
  await expect(menu).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(page.locator('.ui-context-menu')).toHaveCount(0);
});
