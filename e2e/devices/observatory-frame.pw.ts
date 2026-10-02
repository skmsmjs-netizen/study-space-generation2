import { expect, test } from '@playwright/test';

test('the full sky and its four edges fit inside an external responsive frame with usable controls', async ({
  page,
}) => {
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const sky = cover.locator('svg.pixel-landscape');
  await expect(sky).toBeVisible();
  await expect(sky).toHaveAttribute('viewBox', '0 -100 960 400');
  await expect(sky).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
  const measure = () =>
    cover.evaluate((node) => {
      const svg = node.querySelector<SVGSVGElement>('svg.pixel-landscape')!;
      const frame = node.querySelector<HTMLElement>('.observatory-room-frame')!;
      const box = svg.getBoundingClientRect();
      const outer = frame.getBoundingClientRect();
      const heading = node.querySelector('.landscape-heading')!.getBoundingClientRect();
      const matrix = svg.getScreenCTM()!;
      const view = svg.viewBox.baseVal;
      const corners = [
        [view.x, view.y],
        [view.x + view.width, view.y],
        [view.x, view.y + view.height],
        [view.x + view.width, view.y + view.height],
      ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      const border = parseFloat(getComputedStyle(frame).borderLeftWidth);
      return {
        ratio: box.width / box.height,
        coverWidth: node.getBoundingClientRect().width,
        compactThreshold: parseFloat(getComputedStyle(document.documentElement).fontSize) * 40,
        border,
        frameInsets: [
          box.left - outer.left,
          box.top - outer.top,
          outer.right - box.right,
          outer.bottom - box.bottom,
        ],
        cornerError: Math.max(
          ...corners.map((point, index) =>
            Math.max(
              Math.abs(point.x - (index % 2 ? box.right : box.left)),
              Math.abs(point.y - (index > 1 ? box.bottom : box.top)),
            ),
          ),
        ),
        decorationAboveSkyEnd: [...node.querySelectorAll('[data-room-decoration]')].some(
          (element) => element.getBoundingClientRect().top < box.bottom,
        ),
        controlsOverlapSky: heading.bottom > box.top,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
  for (const compact of [false, true]) {
    if (compact)
      await cover.evaluate((node) => {
        (node as HTMLElement).style.width = 'min(100%, 320px)';
      });
    const size = await measure();
    await expect
      .poll(async () => (await measure()).border)
      .toBe(size.coverWidth < size.compactThreshold ? 4 : 8);
    const measured = await measure();
    expect(measured.ratio).toBeCloseTo(960 / 400, 2);
    expect(measured.cornerError).toBeLessThan(0.1);
    for (const inset of measured.frameInsets) expect(inset).toBeCloseTo(measured.border, 1);
    expect(measured.decorationAboveSkyEnd).toBe(false);
    expect(measured.controlsOverlapSky).toBe(false);
    expect(measured.overflow).toBeLessThanOrEqual(1);
  }
  await cover.evaluate((node) => {
    (node as HTMLElement).style.removeProperty('width');
  });
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await cover.getByLabel('풍경 고르기', { exact: true }).click();
  const menu = cover.locator('.landscape-options > div');
  await expect(menu).toBeVisible();
  await cover.getByRole('checkbox', { name: '혜성', exact: true }).uncheck();
  await page.reload();
  await expect(cover.getByRole('button', { name: '풍경 움직이기', exact: true })).toBeVisible();
  await expect(sky).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
  await cover.getByLabel('풍경 고르기', { exact: true }).click();
  await expect(cover.getByRole('checkbox', { name: '혜성', exact: true })).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
});
