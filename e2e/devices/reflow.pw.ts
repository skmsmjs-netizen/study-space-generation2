import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/record', '/record/demo-topic-function', '/math', '/memory-test', '/canvas', '/graph']) {
  test(`large text keeps ${route} inside the viewport`, async ({ page }) => {
    await page.goto(`?space=demo#${route}`);
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('main h1').first()).toHaveText(route.startsWith('/record') ? '공부 기록' : route === '/math' ? '수식 탐색' : route === '/memory-test' ? '암기시험' : route === '/canvas' ? 'Canvas' : '그래프뷰');
    await expect(page.locator('main [data-ui-loading]')).toHaveCount(0, { timeout: 30000 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    await expect.poll(async () => page.evaluate(() => {
      const width = document.documentElement.scrollWidth;
      if (width <= innerWidth + 1) return '';
      return JSON.stringify({ width, viewport: innerWidth, scroll: scrollX, heading: document.querySelector('main h1')?.textContent, url: location.href, overflow: [...document.querySelectorAll('body *')].filter(el => el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0).slice(0, 30).map(el => ({ tag: el.tagName, class: el.className, scroll: el.scrollWidth, client: el.clientWidth, overflow: getComputedStyle(el).overflowX, right: el.getBoundingClientRect().right })), elements: [...document.querySelectorAll('body *')]
        .filter(element => { let parent = element.parentElement; while (parent) { const overflow = getComputedStyle(parent).overflowX; if (['auto', 'scroll', 'hidden', 'clip'].includes(overflow) && parent.getBoundingClientRect().right + scrollX <= innerWidth + 1) return false; parent = parent.parentElement; } return true; })
        .map(element => { const box = element.getBoundingClientRect(); return { tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 60), left: box.left + scrollX, right: box.right + scrollX, width: box.width }; })
        .filter(box => box.right > innerWidth + 1 && box.width > 0).slice(0, 15) });
    }), { timeout: 5000 }).toBe('');
  });
}

test('enlarged handwriting remains reachable and scrollable with the keyboard', async ({ page }) => {
  await page.goto('?space=demo#/recall');
  const paper = page.getByRole('region', { name: '설명 필기 영역 스크롤' });
  await expect(paper).toBeVisible();
  await page.getByRole('button', { name: '종이 확대', exact: true }).click();
  await page.getByRole('button', { name: '종이 확대', exact: true }).click();
  await expect(page.getByRole('button', { name: '종이 확대', exact: true })).toHaveText('200%');
  await expect.poll(() => paper.evaluate(el => el.scrollWidth - el.clientWidth)).toBeGreaterThan(0);
  await paper.focus();
  await expect(paper).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => paper.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  await page.keyboard.press('ArrowLeft');
  await expect.poll(() => paper.evaluate(el => el.scrollLeft)).toBe(0);
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => paper.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press('ArrowUp');
  await expect.poll(() => paper.evaluate(el => el.scrollTop)).toBe(0);
  const accessibility = await new AxeBuilder({ page }).include('.memo-ink-pad').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(accessibility.violations).toEqual([]);
});
