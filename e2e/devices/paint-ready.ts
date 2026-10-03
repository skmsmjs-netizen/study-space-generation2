import { expect, type Page } from '@playwright/test';

/** Measure the final reading surface, after the app's finite route entrance. */
export async function waitForReadingPaint(page: Page, selector = 'main') {
  const main = page.locator(selector);
  await expect(main.locator('[data-ui-loading]')).toHaveCount(0, { timeout: 30000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await expect.poll(() => main.evaluate((el) => [...el.getAnimations({ subtree: true }), ...Array.from(function* () {
      for (let parent = el.parentElement; parent; parent = parent.parentElement) yield parent;
    }()).flatMap((parent) => parent.getAnimations())]
    .filter((animation) => animation.playState === 'running' &&
      Number.isFinite(animation.effect?.getComputedTiming().iterations)).length),
    { timeout: 10000, message: '읽기 화면의 유한 전환이 끝나야 색을 검사한다.' }).toBe(0);
  await expect(main).toHaveCSS('opacity', '1');
}
