import { test, expect } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

test('statistics opens graph first and keeps graph, monthly trends and original records usable', async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date('2026-10-01T01:00:00Z') });
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const original = '  통계 그래프의 원문\n조건과 예외를 유지합니다.  ';
  await page.getByRole('textbox', { name: '메모', exact: true }).first().fill(original);
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await page.goto('?space=demo#/statistics');
  await page.getByRole('checkbox', { name: '여러 그래프 한눈에 보기' }).uncheck();
  const graph = page.getByRole('region', { name: '기간별 통계 그래프' });
  const month = page.getByRole('region', { name: '월간 기록 요약' });
  await expect(graph.getByRole('group', { name: /정확한 날짜가 있는 기록/ })).toBeVisible();
  expect(
    await graph.evaluate((el) =>
      Boolean(
        el.compareDocumentPosition(document.querySelector('[aria-label="월간 기록 요약"]')!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ),
  ).toBe(true);
  expect(
    await graph.evaluate((el) =>
      Boolean(
        el.compareDocumentPosition([...document.querySelectorAll('.statistics-filters')].at(-1)!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ),
  ).toBe(true);
  await expect(month.locator('.statistics-trend')).toHaveCount(8);
  const picker = graph.getByLabel('그래프로 볼 통계');
  await picker.selectOption('writing');
  await graph.getByLabel('그래프 종류', { exact: true }).selectOption('column');
  await expect(graph.getByRole('group', { name: /글을 남긴 기록/ })).toBeVisible();
  const heights = await graph
    .locator('.current-bar')
    .evaluateAll((bars) => bars.map((bar) => Number(bar.getAttribute('height'))));
  expect(heights.filter((height) => height > 0)).toHaveLength(1);
  await graph.getByRole('button', { name: '전체 근거 보기', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '통계의 원기록' });
  await expect(dialog.getByText(original, { exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: '통계의 원기록 닫기' }).click();
  await page.getByRole('checkbox', { name: '같은 길이의 이전 기간과 비교' }).check();
  await expect(graph.locator('.previous-bar')).toHaveCount(11);
  await graph.getByRole('button', { name: '목록', exact: true }).click();
  await expect(graph.getByRole('table')).toBeVisible();
  await graph.getByRole('button', { name: '그래프', exact: true }).click();
  await graph.getByRole('button', { name: '입체', exact: true }).click();
  await expect(graph.locator('polygon').first()).toBeVisible();
  await graph.getByRole('button', { name: '그래프', exact: true }).click();
  await page.getByLabel('통계 시작일', { exact: true }).fill('2020-01-01');
  await page.getByLabel('통계 종료일', { exact: true }).fill('2026-10-01');
  expect(await graph.locator('.current-bar').count()).toBeLessThanOrEqual(14);
  await month.getByLabel('요약할 월').fill('2026-09');
  expect(
    await month
      .locator('.statistics-trend rect')
      .evaluateAll((bars) => bars.every((bar) => Number(bar.getAttribute('height')) === 0)),
  ).toBe(true);
  await page.reload();
  await expect(month.getByLabel('요약할 월')).toHaveValue('2026-09');
  const saved = JSON.parse(
    decodeStoredText((await page.evaluate(() => localStorage.getItem('study-space:demo:v1')))!),
  ).data;
  expect(saved.records[0].body).toBe(original);
  expect(saved.records).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole('button', { name: '최근 30일', exact: true }).click();
  await graph.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('statistics-graph.png') });
});
