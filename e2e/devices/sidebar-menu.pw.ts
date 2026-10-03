import { expect, test, type Page } from '@playwright/test';

async function openMenu(page: Page) {
  if ((page.viewportSize()?.width ?? 0) <= 640) {
    const disclosure = page.locator('.mobile-sidebar-menu');
    if (!(await disclosure.evaluate(node => (node as HTMLDetailsElement).open)))
      await disclosure.locator('summary').click();
    return page.getByRole('navigation', { name: '전체 메뉴', exact: true });
  }
  return page.getByRole('navigation', { name: '주 메뉴', exact: true });
}

async function goFromMenu(page: Page, name: string, route: string) {
  const nav = await openMenu(page);
  await nav.getByRole('link', { name, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`#${route}$`));
  if ((page.viewportSize()?.width ?? 0) <= 640)
    await expect(page.locator('.mobile-sidebar-menu')).not.toHaveAttribute('open');
}

test('grouped sidebar preserves routes, disclosure preferences, current location and original data', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('?space=demo#/subjects');
  await expect(page.locator('main h1').first()).toBeVisible();
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  let nav = await openMenu(page);
  await expect(nav.locator('.ui-navigation-group-label')).toHaveText(['공부−', '자료−', '탐구−', '기록·계획−', '공통 도구−']);
  await expect(nav.getByRole('link')).toHaveCount(24);
  await expect(nav.getByRole('link', { name: '과목', exact: true })).toHaveAttribute('aria-current', 'page');
  const study = nav.getByRole('button', { name: '공부', exact: true });
  await study.focus();
  await study.press('Enter');
  await expect(study).toHaveAttribute('aria-expanded', 'false');
  await expect(nav.getByRole('link', { name: '오늘', exact: true })).toHaveCount(0);
  await page.reload();
  nav = await openMenu(page);
  await expect(nav.getByRole('button', { name: '공부', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await nav.getByRole('button', { name: '공부', exact: true }).click();
  const scroller = (page.viewportSize()?.width ?? 0) <= 640
    ? page.locator('.mobile-sidebar-menu-content') : page.locator('.sidebar');
  await scroller.evaluate(node => { node.scrollTop = 160; });
  await expect.poll(() => scroller.evaluate(node => node.scrollTop)).toBe(160);
  const menuScrollKey = (page.viewportSize()?.width ?? 0) <= 640 ? 'study-space:demo:mobile-sidebar-scroll:v1' : 'study-space:demo:sidebar-scroll:v1';
  await expect.poll(() => page.evaluate(key => sessionStorage.getItem(key), menuScrollKey)).toBe('160');
  await page.reload();
  nav = await openMenu(page);
  await expect.poll(() => scroller.evaluate(node => node.scrollTop)).toBe(160);
  await goFromMenu(page, '강의 자료', '/materials');
  nav = await openMenu(page);
  await expect(nav.getByRole('link', { name: '강의 자료', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.screenshot({ path: info.outputPath('sidebar-grouped.png') });
  await goFromMenu(page, '수식 탐색', '/math');
  await expect(page.locator('main h1').first()).toContainText('수식');
  await goFromMenu(page, '찾기', '/search');
  await page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true }).fill('함수');
  await goFromMenu(page, '과목', '/subjects');
  await goFromMenu(page, '찾기', '/search');
  await expect(page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true })).toHaveValue('함수');
  await page.reload();
  await expect(page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true })).toHaveValue('함수');
  nav = await openMenu(page);
  await expect(nav.locator('[aria-current="page"]')).toHaveText('찾기');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const links = await nav.getByRole('link').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
  expect(Math.min(...links)).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
});

test('menu remains usable when preference storage fails and closes by Escape without losing draft input', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const draft = page.getByRole('textbox', { name: '메모', exact: true });
  await draft.fill('  사이드바 이동 중 보존할 입력\n조건과 예외  ');
  let nav = await openMenu(page);
  if ((page.viewportSize()?.width ?? 0) <= 640) {
    await nav.getByRole('button', { name: '탐구', exact: true }).focus();
    await page.keyboard.press('Escape');
    await expect(page.locator('.mobile-sidebar-menu')).not.toHaveAttribute('open');
    await expect(page.locator('.mobile-sidebar-menu > summary')).toBeFocused();
    await expect(draft).toHaveValue('  사이드바 이동 중 보존할 입력\n조건과 예외  ');
  }
  await goFromMenu(page, '과목', '/subjects');
  await goFromMenu(page, '기록', '/record');
  await expect(draft).toHaveValue('  사이드바 이동 중 보존할 입력\n조건과 예외  ');
  await page.reload();
  await expect(draft).toHaveValue('  사이드바 이동 중 보존할 입력\n조건과 예외  ');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException('synthetic unavailable storage', 'QuotaExceededError'); };
  });
  nav = await openMenu(page);
  await nav.getByRole('button', { name: '탐구', exact: true }).click();
  await expect(nav.getByRole('button', { name: '탐구', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await nav.getByRole('button', { name: '탐구', exact: true }).click();
  await expect(nav.getByRole('link', { name: '수식 탐색', exact: true })).toBeVisible();
  await goFromMenu(page, '수식 탐색', '/math');
  await expect(page.locator('main h1').first()).toContainText('수식');
});
