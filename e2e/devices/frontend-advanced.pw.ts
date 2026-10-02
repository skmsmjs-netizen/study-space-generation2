import { expect, test } from '@playwright/test';

test('rapid editing retains the final selection, original draft and route across immediate reload', async ({
  page,
}) => {
  // Isolated synthetic app context. Count only view-hint writes, never journal writes.
  await page.addInitScript(() => {
    const nativeSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === 'study-space:demo:editing-context:v1') {
        document.documentElement.dataset.hintWrites = String(
          Number(document.documentElement.dataset.hintWrites || 0) + 1,
        );
      }
      nativeSet.call(this, key, value);
    };
  });
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  const field = page.getByRole('textbox', { name: '메모', exact: true });
  const original = `  조건과 예외를 그대로 남기는 원문\n${'긴 한국어 기록과 다시 읽을 문장. '.repeat(40)}\n마지막 공백  `;
  await field.fill(original);
  await field.press('End');
  // A same-turn burst isolates batching; real input and reload are checked on both sides.
  const burst = await field.evaluate((element) => {
    const input = element as HTMLTextAreaElement;
    const before = Number(document.documentElement.dataset.hintWrites || 0);
    for (let position = 1; position <= 32; position++) {
      input.setSelectionRange(position, position + 4, 'forward');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('select', { bubbles: true }));
    }
    return { before, after: Number(document.documentElement.dataset.hintWrites || 0) };
  });
  expect(burst.after - burst.before).toBe(0);
  // Verify actual reload restoration; fixed-frame unit tests isolate pagehide before rAF.
  await page.reload();
  await expect(field).toHaveValue(original);
  await expect
    .poll(() =>
      field.evaluate((element) => {
        const input = element as HTMLTextAreaElement;
        return [input.selectionStart, input.selectionEnd, input.selectionDirection];
      }),
    )
    .toEqual([32, 36, 'forward']);
  await page.getByRole('link', { name: '오늘', exact: true }).first().click();
  await page.getByRole('link', { name: '기록', exact: true }).first().click();
  await expect(field).toHaveValue(original);
  await expect
    .poll(() =>
      field.evaluate((element) => {
        const input = element as HTMLTextAreaElement;
        return [input.selectionStart, input.selectionEnd];
      }),
    )
    .toEqual([32, 36]);
});

test('observatory raster adapts to its real viewport and resumes its scene after leaving view', async ({
  page,
}) => {
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const svg = cover.locator('svg.pixel-landscape');
  await svg.scrollIntoViewIfNeeded();
  const canvas = cover.locator('canvas.obs-gpu-canvas');
  await expect(canvas).toHaveAttribute('data-resolution', /\d+/);
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  const originalSize = page.viewportSize()!;
  const originalTime = Number(await canvas.getAttribute('data-flow-time'));
  const readWidth = () => canvas.evaluate((node) => (node as HTMLCanvasElement).width);
  const initialWidth = await readWidth();
  // The same device's split/expanded viewport is a layout change, not a new saved setting.
  await page.setViewportSize({ width: 320, height: originalSize.height });
  // Reflow can move the scene below a short viewport; offscreen GPU release is expected.
  // Measure adaptation only after bringing the actual scene back into the viewport.
  await svg.scrollIntoViewIfNeeded();
  await expect(svg).toBeInViewport();
  await expect(canvas).toHaveAttribute('data-resolution', /\d+/);
  await expect.poll(readWidth).toBeLessThan(initialWidth);
  expect(await readWidth()).toBeGreaterThanOrEqual(240);
  expect(await readWidth()).toBeLessThanOrEqual(1280);
  await page.setViewportSize(originalSize);
  await svg.scrollIntoViewIfNeeded();
  await expect(svg).toBeInViewport();
  await expect(canvas).toHaveAttribute('data-resolution', /\d+/);
  await expect.poll(readWidth).toBe(initialWidth);
  expect(Number(await canvas.getAttribute('data-flow-time'))).toBe(originalTime);
  await page.getByRole('heading', { name: '쌓인 기록', exact: true }).scrollIntoViewIfNeeded();
  await expect(canvas).toHaveCount(0);
  await svg.scrollIntoViewIfNeeded();
  await expect(canvas).toHaveCount(1);
  expect(Number(await canvas.getAttribute('data-flow-time'))).toBe(originalTime);
  await cover.getByRole('button', { name: '풍경 움직이기', exact: true }).click();
  await expect
    .poll(async () => Number(await canvas.getAttribute('data-flow-time')))
    .toBeGreaterThan(originalTime);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});
