import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { decodeStoredText, encodeStoredText } from '../../src/data/storage-codec';

test('subject comparison keeps long names, separated labels and original data after resize and reload', async ({
  page,
}, info) => {
  const fixture = JSON.parse(
    readFileSync(new URL('./fixtures/statistics-charts.json', import.meta.url), 'utf8'),
  );
  const state = JSON.parse(decodeStoredText(fixture.raw));
  const names = [
    '대학수학및연습1',
    'C프로그래밍응용',
    '대학수학및연습2',
    '벡터해석학및연습',
    '암기 생성 확인용',
    '대학물리및실험1',
    'AI리터러시',
    '자료가 누적되어도 전체 이름과 조건을 유지하는 아주 긴 한국어 과목명',
  ];
  state.data.subjects.forEach(
    (subject: { name: string }, index: number) => (subject.name = names[index % names.length]),
  );
  for (let index = state.data.subjects.length; index < names.length; index++) {
    state.data.subjects.push({
      ...state.data.subjects[0],
      id: `spacing-subject-${index}`,
      name: names[index],
      order: index,
    });
  }
  const raw = encodeStoredText(JSON.stringify(state));
  await page.addInitScript((value) => {
    if (!localStorage.getItem('study-space:demo:v1'))
      localStorage.setItem('study-space:demo:v1', value);
  }, raw);
  await page.goto('?space=demo#/statistics');
  const card = page.getByRole('region', { name: '어느 과목을 기록했나요?', exact: true });
  const plot = card.locator('[data-chart-kind="horizontal"]');
  await card.scrollIntoViewIfNeeded();
  await plot.locator('.statistics-plot').scrollIntoViewIfNeeded();
  await expect(plot.locator('[data-plot-ready="true"]')).toHaveCount(1, { timeout: 30000 });
  // Repository startup can add defaults and encode an older fixture. Preserve
  // original entities, then require byte-identical storage during viewing.
  const baseline = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  expect(JSON.parse(decodeStoredText(baseline!)).data).toMatchObject(state.data);
  const verify = async () => {
    await expect(plot.locator('.ytick')).toHaveCount(names.length);
    const result = await plot.evaluate((el) => {
      const host = el.getBoundingClientRect();
      return [...el.querySelectorAll('.ytick text')].map((text) => {
        const box = text.getBoundingClientRect();
        return {
          text: text.textContent,
          top: box.top,
          bottom: box.bottom,
          left: box.left,
          right: box.right,
          hostLeft: host.left,
          hostRight: host.right,
          size: parseFloat(getComputedStyle(text).fontSize),
        };
      });
    });
    expect(result.map((row) => row.text).sort()).toEqual([...names].sort());
    for (const [index, row] of result.entries()) {
      expect(row.left).toBeGreaterThanOrEqual(row.hostLeft - 1);
      expect(row.right).toBeLessThanOrEqual(row.hostRight);
      expect(row.size).toBeGreaterThanOrEqual(14);
      if (index) expect(row.top - result[index - 1].bottom).toBeGreaterThanOrEqual(12);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(baseline);
  };
  await verify();
  await card.screenshot({ path: info.outputPath('subject-comparison.png') });
  const viewport = page.viewportSize()!;
  await page.setViewportSize({
    width: Math.max(320, viewport.width - 60),
    height: viewport.height,
  });
  await expect
    .poll(async () =>
      plot.evaluate(
        (el) =>
          el.querySelector('svg.main-svg')?.getBoundingClientRect().width ===
          el.getBoundingClientRect().width,
      ),
    )
    .toBe(true);
  await verify();
  await page.reload();
  await card.scrollIntoViewIfNeeded();
  await plot.locator('.statistics-plot').scrollIntoViewIfNeeded();
  await expect(plot.locator('[data-plot-ready="true"]')).toHaveCount(1, { timeout: 30000 });
  await verify();
});
