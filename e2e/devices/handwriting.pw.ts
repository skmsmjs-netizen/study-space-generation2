import { test, expect, type Page } from '@playwright/test';

async function line(page: Page) {
  const paper = page.getByRole('img', { name: '메모 스케치 영역', exact: true });
  await paper.scrollIntoViewIfNeeded();
  const box = (await paper.boundingBox())!;
  // Real browser mouse events, with coordinates chosen from the current rendered paper.
  const x = box.x + box.width * 0.2,
    y = box.y + box.height * 0.15;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * 0.25, y + 8, { steps: 8 });
  await page.mouse.up();
  return { x: x + box.width * 0.125, y: y + 4 };
}

test('ink pages, partial erasing, settings and undo survive saving and reopening', async ({
  page,
}) => {
  await page.goto('?space=demo#/memos');
  await page.getByRole('button', { name: '메모 추가', exact: true }).tap();
  const paths = page.locator('.ink-pad-paper path[d]:not([d=""])');
  const center = await line(page);
  await expect(paths).toHaveCount(1);
  const first = await paths.first().getAttribute('d');
  await page.getByRole('button', { name: '지우개', exact: true }).tap();
  const paper = page.getByRole('img', { name: '메모 스케치 영역', exact: true });
  await paper.scrollIntoViewIfNeeded();
  const box = (await paper.boundingBox())!;
  // The toolbar can reflow when the eraser selector appears.
  await page.mouse.click(box.x + box.width * 0.325, box.y + box.height * 0.15 + 4);
  await expect(paths).toHaveCount(2);
  await page.getByRole('button', { name: '그림 되돌리기', exact: true }).tap();
  await expect(paths).toHaveCount(1);
  await expect(paths.first()).toHaveAttribute('d', first!);
  await page.getByRole('button', { name: '펜', exact: true }).tap();
  await page.getByLabel('펜 색', { exact: true }).selectOption('green');
  await page.getByRole('button', { name: '쪽 추가', exact: true }).tap();
  await line(page);
  const second = await paths.first().getAttribute('d');
  await page.getByRole('button', { name: '닫기', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: /메모 1 열기/ }).tap();
  await expect(page.getByLabel('필기 쪽', { exact: true })).toHaveValue('1');
  await expect(page.getByLabel('펜 색', { exact: true })).toHaveValue('green');
  await expect(paths.first()).toHaveAttribute('d', second!);
  await page.getByRole('button', { name: '그림 되돌리기', exact: true }).tap();
  await expect(paths).toHaveCount(0);
  await page.getByRole('button', { name: '다시 그리기', exact: true }).tap();
  await expect(paths.first()).toHaveAttribute('d', second!);
  await page.getByRole('button', { name: '이전 필기 쪽', exact: true }).tap();
  await expect(paths.first()).toHaveAttribute('d', first!);
  await page.getByRole('button', { name: '종이 확대', exact: true }).tap();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByRole('button', { name: '닫기', exact: true }).tap();
  // A DOM coordinate result is evidence of rendering, not physical Pencil behavior.
  expect(center.x).toBeGreaterThan(0);
});
