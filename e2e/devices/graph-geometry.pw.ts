import { test, expect } from '@playwright/test';

test('graph lines touch the visible circles and names stay close through zoom and reopening', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/graph');
  const stage = page.locator('.graph-stage');
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await stage.scrollIntoViewIfNeeded();
  const paths = page.locator('.graph-stage path[data-graph-source]');
  await expect(paths.first()).toBeVisible();
  const geometry = () =>
    stage.evaluate((element) => {
      const dots = new Map(
        [...element.querySelectorAll<HTMLElement>('.react-flow__node')].map((node) => {
          const point = node.querySelector('.graph-point')!.getBoundingClientRect();
          return [
            node.dataset.id!,
            {
              x: point.x + point.width / 2,
              y: point.y + point.height / 2,
              radius: point.width / 2,
            },
          ];
        }),
      );
      const gaps = [...element.querySelectorAll<SVGPathElement>('path[data-graph-source]')].flatMap(
        (path) => {
          const matrix = path.getScreenCTM()!;
          return [
            [path.dataset.graphSource!, path.getPointAtLength(0)],
            [path.dataset.graphTarget!, path.getPointAtLength(path.getTotalLength())],
          ].map(([id, point]) => {
            const dot = dots.get(id as string)!;
            const endpoint = new DOMPoint(
              (point as DOMPoint).x,
              (point as DOMPoint).y,
            ).matrixTransform(matrix);
            return Math.abs(Math.hypot(endpoint.x - dot.x, endpoint.y - dot.y) - dot.radius);
          });
        },
      );
      const labels = [...element.querySelectorAll<HTMLElement>('.graph-dot.has-label')].map(
        (node) => {
          const point = node.querySelector('.graph-point')!.getBoundingClientRect();
          const label = node.querySelector('.graph-label')!.getBoundingClientRect();
          return label.top - point.bottom;
        },
      );
      return { gaps, labels };
    });
  const check = async () => {
    await expect.poll(async () => Math.max(...(await geometry()).gaps)).toBeLessThan(1);
    const result = await geometry();
    expect(result.labels.length).toBeGreaterThan(0);
    for (const gap of result.labels) expect(Math.abs(gap - 8)).toBeLessThan(1);
  };
  await check();
  for (let i = 0; i < 3; i++)
    await stage.getByRole('button', { name: /^(zoom in|확대)$/i }).click();
  await check();
  for (let i = 0; i < 6; i++)
    await stage.getByRole('button', { name: /^(zoom out|축소)$/i }).click();
  await check();
  await stage.getByRole('button', { name: /^(fit view|전체 보기)$/i }).click();
  await check();
  await page.getByText('항목 목록에서 선택하기', { exact: true }).click();
  const first = page.locator('.graph-list button').first();
  await first.click();
  await expect(page.locator('.graph-detail h2')).toBeVisible();
  await expect(
    page.locator('.graph-detail').getByRole('link', { name: '원문 열기 ↗' }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('graph-repaired.png'), fullPage: true });
  await page.reload();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage).toHaveAttribute('aria-busy', 'false');
  await expect(paths.first()).toBeVisible();
  await check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});
