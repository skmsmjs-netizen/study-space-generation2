import { test, expect } from '@playwright/test';
import { createDemoState } from '../../src/domain/fixtures';
import { encodeStoredText } from '../../src/data/storage-codec';

for (const count of [0, 300])
  test(`circular graph with ${count + 11} items preserves source and overview after reopening`, async ({
    page,
  }, info) => {
    const data = createDemoState();
    const example = data.nodes.find((node) => node.id === 'demo-topic-function');
    if (!example) throw new Error('원형 그래프 합성 자료의 기준 주제가 없습니다.');
    for (let i = 0; i < count; i++)
      data.nodes.push({
        ...example,
        id: `circular-${i}`,
        order: i + 10,
        name: `${i}. 조건·예외와 원문을 보존하는 긴 한글 주제 이름`,
      });
    const stored = encodeStoredText(JSON.stringify({ sequence: 0, data }));
    await page.addInitScript((value) => {
      if (!localStorage.getItem('study-space:demo:v1'))
        localStorage.setItem('study-space:demo:v1', value);
    }, stored);
    await page.goto('?space=demo#/graph');
    const stage = page.locator('.graph-stage');
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect(stage.locator('.graph-point')).toHaveCount(count + 11);
    const overview = page
      .locator('.study-graph > .graph-actions')
      .getByRole('button', { name: '전체 보기', exact: true });
    const measure = () =>
      stage.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const points = [...element.querySelectorAll('.graph-point')].map((point) =>
          point.getBoundingClientRect(),
        );
        const width = Math.max(...points.map((p) => p.x)) - Math.min(...points.map((p) => p.x));
        const height = Math.max(...points.map((p) => p.y)) - Math.min(...points.map((p) => p.y));
        return {
          ratio: width / height,
          inside: points.every(
            (p) =>
              p.left >= bounds.left - 1 &&
              p.right <= bounds.right + 1 &&
              p.top >= bounds.top - 1 &&
              p.bottom <= bounds.bottom + 1,
          ),
          roundPoints: points.every((p) => Math.abs(p.width - p.height) < 1),
        };
      });
    await overview.click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await stage.scrollIntoViewIfNeeded();
    const shape = await measure();
    expect(shape.ratio).toBeGreaterThan(0.65);
    expect(shape.ratio).toBeLessThan(1.5);
    expect(shape.inside).toBe(true);
    expect(shape.roundPoints).toBe(true);
    await page.screenshot({ path: info.outputPath('circular-overview.png'), fullPage: true });
    await page.getByText('항목 목록에서 선택하기', { exact: true }).click();
    const name = count
      ? '299. 조건·예외와 원문을 보존하는 긴 한글 주제 이름'
      : '함수는 어떤 관계일까?';
    await page
      .locator('.graph-list')
      .getByRole('button', { name: `주제 · ${name}`, exact: true })
      .click();
    await expect(page.locator('.graph-detail h2')).toHaveText(name);
    await expect(
      page.locator('.graph-detail').getByRole('link', { name: '원문 열기 ↗' }),
    ).toBeVisible();
    await page.getByRole('button', { name: '배치 다시 맞추기', exact: true }).click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await expect.poll(async () => (await measure()).inside).toBe(true);
    await page.reload();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    await overview.click();
    await expect(stage).toHaveAttribute('aria-busy', 'false');
    expect((await measure()).inside).toBe(true);
    expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(stored);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  });
