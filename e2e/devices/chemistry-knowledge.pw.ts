import { test, expect } from '@playwright/test';

test('chemistry maps keep one module per concept, actual edges, prose and a retained reading camera', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/concepts');
  const launch = page.getByRole('button', { name: '일반화학 · 교재와 관찰 열기', exact: true });
  await launch.click();
  const modal = page.getByRole('dialog', { name: '일반화학 · 교재와 관찰', exact: true });
  const whole = modal.locator('.knowledge-structure');
  await expect(whole.locator('.react-flow__node')).toHaveCount(9);
  await whole.getByRole('button', { name: '문장으로 읽기', exact: true }).click();
  await expect(whole.locator('.knowledge-prose-relation')).toHaveCount(13);
  await expect(whole.locator('.knowledge-arrow')).toHaveCount(0);
  await expect(whole.locator('.knowledge-endpoint')).toHaveCount(0);
  await expect(whole.locator('.knowledge-prose-relation').first()).toContainText(
    '방향의 연결 설명은',
  );
  await page.getByLabel('일반화학 개념 찾기').fill('질량 보존');
  await page.locator('.chem-list').getByRole('button', { name: '질량 보존', exact: true }).click();
  const detail = modal.locator('.knowledge-structure');
  const ids = await detail
    .locator('.react-flow__node')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-id')));
  expect(new Set(ids).size).toBe(ids.length);
  await expect(detail.locator('.knowledge-module')).not.toContainText([
    '선행 개념',
    '다시 쓰이는 연결',
  ]);
  await page.getByRole('button', { name: '원래 목록과 위치로', exact: true }).click();
  await page.getByLabel('일반화학 개념 찾기').fill('실험과 설명');
  await page
    .locator('.chem-list')
    .getByRole('button', { name: '실험과 설명', exact: true })
    .click();
  await page.getByRole('button', { name: '이 질문의 작은 관찰', exact: true }).click();
  const observation = modal.locator('[data-relationship-section="1.2"]');
  await expect(observation.locator('.react-flow__node')).toHaveCount(2);
  await expect(observation.locator('.knowledge-diagram-label')).toHaveCount(1);
  await observation.getByRole('button', { name: '읽기 배율로', exact: true }).click();
  const viewport = observation.locator('.knowledge-diagram-viewport');
  await viewport.scrollIntoViewIfNeeded();
  const camera = observation.locator('.react-flow__viewport');
  await expect(camera).toHaveAttribute('style', /scale\(1\)/);
  const bounds = await viewport.evaluate((e) => {
    const container = e.getBoundingClientRect();
    return [...e.querySelectorAll<HTMLElement>('.knowledge-module')].map((n) => {
      const r = n.getBoundingClientRect();
      return {
        left: r.left - container.left,
        right: container.right - r.right,
        overflow: n.scrollWidth - n.clientWidth,
      };
    });
  });
  expect(bounds.every((b) => b.left >= -1 && b.right >= -1 && b.overflow <= 1)).toBe(true);
  await viewport.focus();
  await page.keyboard.press('ArrowDown');
  const moved = await camera.getAttribute('style');
  await observation.getByRole('button', { name: '문장으로 읽기', exact: true }).click();
  await observation.getByRole('button', { name: '구조로 보기', exact: true }).click();
  await expect(camera).toHaveAttribute('style', moved!);
  await modal.getByRole('button', { name: /닫기$/ }).click();
  await expect(launch).toBeFocused();
  await launch.click();
  await page.getByRole('button', { name: '이 질문의 작은 관찰', exact: true }).click();
  await expect(camera).toHaveAttribute('style', moved!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('all eight chemistry maps preserve each concept and labelled edge without overlapping readable text', async ({
  page,
}) => {
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '일반화학 · 교재와 관찰 열기', exact: true }).click();
  const select = page.getByLabel('개념 지도 선택', { exact: true });
  await expect(select).toBeVisible();
  await expect(select.locator('option')).toHaveCount(8);
  const values = await select
    .locator('option')
    .evaluateAll((options) => options.map((n) => (n as HTMLOptionElement).value));
  expect(values).toHaveLength(8);
  for (const value of values) {
    await select.selectOption(value);
    const figure = page.locator('.chemistry-observatory .knowledge-structure');
    await figure.getByRole('button', { name: '전체 보기', exact: true }).click();
    await expect(figure.locator('.react-flow__node').first()).toBeVisible();
    await expect
      .poll(async () =>
        figure
          .locator('.react-flow__node')
          .evaluateAll((nodes) => nodes.every((n) => getComputedStyle(n).visibility !== 'hidden')),
      )
      .toBe(true);
    const collisions = () =>
      figure.evaluate((e) => {
        const boxes = [
          ...e.querySelectorAll<HTMLElement>('.knowledge-module, .knowledge-diagram-label'),
        ].map((n) => ({
          text: n.innerText,
          label: n.classList.contains('knowledge-diagram-label'),
          rect: n.getBoundingClientRect(),
        }));
        const overlaps: string[] = [];
        for (let i = 0; i < boxes.length; i++)
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i],
              b = boxes[j];
            if (
              (a.label || b.label) &&
              Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left) > 1 &&
              Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top) > 1
            )
              overlaps.push(`${a.text} / ${b.text}`);
          }
        return overlaps;
      });
    await expect.poll(collisions, { message: value }).toEqual([]);
  }
});
