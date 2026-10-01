import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const { raw, chartFamilies } = JSON.parse(
  readFileSync(new URL('./fixtures/statistics-charts.json', import.meta.url), 'utf8'),
) as { raw: string; chartFamilies: { id: string; kinds: string[] }[] };
async function seed(page: import('@playwright/test').Page) {
  await page.clock.install({ time: new Date('2026-10-01T01:00:00Z') });

  await page.addInitScript((value) => {
    if (!localStorage.getItem('study-space:demo:v1'))
      localStorage.setItem('study-space:demo:v1', value);
  }, raw);
  await page.goto('?space=demo#/statistics');
  await page.getByLabel('통계 시작일', { exact: true }).fill('2026-09-01');
  await page.getByLabel('통계 종료일', { exact: true }).fill('2026-09-30');
  return raw;
}
test('six real chart shapes, all 19 choices, selection persistence and exact original preservation', async ({
  page,
}, info) => {
  test.setTimeout(180000);
  const raw = await seed(page);
  const gallery = page.getByRole('region', { name: '통계 그래프 한눈에 보기' });
  for (const card of await gallery.locator('.statistics-gallery-card').all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('[data-plot-ready="true"]')).toHaveCount(1);
    await expect(card.locator('svg.main-svg').first()).toBeVisible();
  }
  await gallery.screenshot({ path: info.outputPath('six-chart-gallery.png') });
  await page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' }).uncheck();
  const graph = page.getByRole('region', { name: '기간별 통계 그래프' });
  await graph.getByLabel('그래프로 볼 통계', { exact: true }).selectOption('writing');
  await graph.scrollIntoViewIfNeeded();
  for (const family of chartFamilies) {
    await graph.getByLabel('보고 싶은 것', { exact: true }).selectOption(family.id);
    for (const kind of family.kinds) {
      await graph.getByLabel('그래프 종류', { exact: true }).selectOption(kind);
      if (kind === 'column') await expect(graph.locator('.current-bar')).toHaveCount(10);
      else {
        const plot = graph.locator(`[data-chart-kind="${kind}"]`);
        await expect(plot.locator('[data-plot-ready="true"]')).toHaveCount(1);
        await expect(plot.locator('svg.main-svg').first()).toBeVisible();
        await expect(graph.getByRole('alert')).toHaveCount(0);
      }
    }
  }
  await graph.getByLabel('보고 싶은 것', { exact: true }).selectOption('trend');
  await graph.getByLabel('그래프 종류', { exact: true }).selectOption('line');
  await graph.getByRole('button', { name: '다음 구간', exact: true }).click();
  await expect(graph.locator('.shapelayer path')).toHaveCount(1);
  await graph.getByRole('button', { name: '전체 구간', exact: true }).click();
  await graph.getByRole('button', { name: '그래프 확대', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await graph.getByRole('button', { name: '원래 크기', exact: true }).click();
  await graph.getByLabel('보고 싶은 것', { exact: true }).selectOption('composition');
  await graph.getByLabel('그래프 종류', { exact: true }).selectOption('treemap');
  await graph.getByRole('button', { name: '목록', exact: true }).click();
  await expect(graph.getByRole('table')).toBeVisible();
  await graph.getByRole('button', { name: '기록 보기', exact: true }).first().click();
  const dialog = page.getByRole('dialog', { name: '통계의 원기록' });
  await expect(
    dialog.getByText('  합성 그래프 확인 12\n조건·예외와 원문  ', { exact: true }),
  ).toBeVisible();
  await dialog.getByRole('button', { name: '통계의 원기록 닫기' }).click();
  await page.reload();
  await expect(graph.getByLabel('보고 싶은 것', { exact: true })).toHaveValue('composition');
  await expect(graph.getByLabel('그래프 종류', { exact: true })).toHaveValue('treemap');
  await expect(page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' })).not.toBeChecked();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(raw);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('renderer load failure keeps the values and original records usable and supports reopening', async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.route('**/assets/plotly.min-*.js', (route) => route.abort());
  const raw = await seed(page);
  await page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' }).uncheck();
  const graph = page.getByRole('region', { name: '기간별 통계 그래프' });
  await graph.scrollIntoViewIfNeeded();
  await expect(graph.getByRole('alert')).toContainText('그래프를 그리지 못했습니다');
  await graph.getByRole('button', { name: '목록', exact: true }).click();
  await expect(graph.getByRole('table')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(raw);
  await graph.getByRole('button', { name: '그래프', exact: true }).click();
  await expect(graph.getByRole('button', { name: '통계 다시 열기', exact: true })).toBeVisible();
  await page.unroute('**/assets/plotly.min-*.js');
  await graph.getByRole('button', { name: '통계 다시 열기', exact: true }).click();
  await graph.scrollIntoViewIfNeeded();
  await expect(graph.locator('[data-plot-ready="true"]')).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(raw);
});
