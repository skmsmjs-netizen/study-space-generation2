import { expect, test } from '@playwright/test';

for (const renderer of ['geogebra', 'plotly']) {
  test(`math ${renderer} fullscreen keeps graph, draft, controls and return`, async ({ page }, info) => {
    await page.goto('?space=demo#/math');
    await page.getByLabel('그래프 도구', { exact: true }).selectOption(renderer);
    const graph = page.locator(renderer === 'geogebra' ? '.math-geogebra-host' : '.math-visual > .math-plot');
    const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
    await expect(zoom).toBeEnabled({ timeout: 45000 });
    const originalGraph = await graph.elementHandle();
    const a = page.getByRole('textbox', { name: 'a 값', exact: true });
    await a.fill('1+');
    await a.press('Tab');
    const trigger = page.getByRole('button', { name: '그래프 전체화면', exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const originalScroll = await page.evaluate(() => scrollY);
    await trigger.tap();
    const dialog = page.getByRole('dialog', { name: '그래프 전체화면', exact: true });
    await expect(dialog).toBeVisible();
    await expect(a).toHaveValue('1+');
    expect(await graph.evaluate((node, original) => node === original, originalGraph)).toBe(true);
    const viewport = page.viewportSize()!;
    const bounds = await dialog.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(viewport.width - 2);
    expect(bounds!.height).toBeGreaterThanOrEqual(viewport.height - 2);
    const plotBounds = await graph.boundingBox();
    expect(plotBounds!.width).toBeGreaterThan(140);
    expect(plotBounds!.height).toBeGreaterThan(80);
    expect(plotBounds!.y + plotBounds!.height).toBeLessThanOrEqual(viewport.height);
    await zoom.tap();
    await a.fill('3');
    await a.press('Enter');
    await expect(a).toHaveValue('3.00');
    await expect(dialog.getByLabel('T·N·B 벡터 보기')).toBeChecked();
    // A scrollable control pane must not move the always available close button.
    await dialog.locator('.math-controls').evaluate(node => { node.scrollTop = node.scrollHeight; });
    const close = dialog.getByRole('button', { name: '전체화면 닫기', exact: true });
    const closeBounds = await close.boundingBox();
    expect(closeBounds!.y).toBeGreaterThanOrEqual(0);
    expect(closeBounds!.y + closeBounds!.height).toBeLessThan(viewport.height);
    if (info.project.name === 'iPad-Pro-13-landscape') {
      await page.screenshot({ path: `work/math-fullscreen-20261003/${renderer}-fullscreen.png` });
    }
    await close.tap();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('button', { name: '그래프 전체화면', exact: true })).toBeFocused();
    await expect(a).toHaveValue('3.00');
    // Correcting an invalid value can shorten the underlying page. The browser
    // clamps a former bottom position to the new bottom rather than adding space.
    const returnLimit = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(Math.min(originalScroll, returnLimit), 0);
    expect(await graph.evaluate((node, original) => node === original, originalGraph)).toBe(true);
    await page.getByRole('button', { name: '그래프 전체화면', exact: true }).tap();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await page.reload();
    await expect(page.getByLabel('그래프 도구', { exact: true })).toHaveValue(renderer);
    await expect(a).toHaveValue('3.00');
    await expect(zoom).toBeEnabled({ timeout: 45000 });
    await expect(page.getByRole('dialog', { name: '그래프 전체화면' })).toHaveCount(0);
  });
}
