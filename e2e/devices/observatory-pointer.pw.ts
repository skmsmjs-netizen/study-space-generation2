import { test, expect } from '@playwright/test';

test('pointer dwell retains moving detail during exploration; drag exits gently, pause and touch remain calm', async ({
  page,
}) => {
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const svg = cover.locator('svg.pixel-landscape');
  await svg.scrollIntoViewIfNeeded();
  const canvas = cover.locator('canvas.obs-gpu-canvas');
  await expect(canvas).toHaveAttribute('data-renderer', /webgl2|svg/);
  const flowTime = () => canvas.getAttribute('data-flow-time');
  const initialFlow = await flowTime();
  await expect.poll(flowTime).not.toBe(initialFlow);
  const box = await svg.boundingBox();
  if (!box) throw Error('Observatory absent');
  const roomFrame = cover.locator('.observatory-room-frame');
  const frameGeometry = () =>
    roomFrame.evaluate((element) => {
      const bounds = element.getBoundingClientRect(),
        style = getComputedStyle(element);
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        transform: style.transform,
        translate: style.translate,
        scale: style.scale,
        rotate: style.rotate,
      };
    });
  const initialFrame = await frameGeometry();
  expect(initialFrame.transform).toBe('none');
  expect(initialFrame.x).toBeLessThan(box.x);
  expect(initialFrame.y).toBeLessThan(box.y);
  expect(initialFrame.width).toBeGreaterThan(box.width);
  expect(initialFrame.height).toBeGreaterThan(box.height);
  const x = box.x + box.width * 0.42,
    y = box.y + box.height * 0.46;
  const values = () =>
    cover.evaluate((el) => ({
      zoom: Number((el as HTMLElement).style.getPropertyValue('--pixel-sky-zoom')),
      depth: Number((el as HTMLElement).style.getPropertyValue('--pixel-inspection')),
      pan: parseFloat((el as HTMLElement).style.getPropertyValue('--pixel-pan-x')),
    }));
  await page.mouse.move(x, y);
  await expect(cover).toHaveAttribute('data-inspect', 'waiting');
  await expect.poll(async () => (await values()).zoom).toBeGreaterThan(1.4);
  await expect.poll(async () => (await values()).depth).toBeGreaterThan(0.5);
  await expect(canvas).toHaveAttribute('data-lod', /1|2/);
  await expect(cover.locator('[data-lod-layer]')).toHaveCount(2);
  await expect(cover.locator('[data-inspection-detail]')).toHaveCount(1);
  // The scene moves behind a fixed foreground; the window and desk never join the sky camera.
  expect(await frameGeometry()).toEqual(initialFrame);
  const cloud = cover.locator('.pixel-inspection-cloud');
  const before = await cloud.evaluate((el) => getComputedStyle(el).translate);
  await expect.poll(() => cloud.evaluate((el) => getComputedStyle(el).translate)).not.toBe(before);
  const focused = await values();
  const origin = await cover.evaluate((el) =>
    (el as HTMLElement).style.getPropertyValue('--pixel-origin-x'),
  );
  await page.mouse.move(x + 30, y + 10, { steps: 6 });
  await expect(cover).toHaveAttribute('data-inspect', 'exploring');
  await page.waitForTimeout(220);
  expect((await values()).zoom).toBeGreaterThanOrEqual(focused.zoom - 0.01);
  expect(
    await cover.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--pixel-origin-x')),
  ).toBe(origin);
  await page.mouse.down();
  await page.mouse.move(x + 110, y - 45, { steps: 8 });
  await expect(cover).toHaveAttribute('data-focus', 'sky-drag');
  await expect(cover).toHaveAttribute('data-inspect', 'dragging');
  await expect.poll(async () => Math.abs((await values()).pan)).toBeGreaterThan(15);
  expect(await frameGeometry()).toEqual(initialFrame);
  await page.mouse.move(box.x - 20, y, { steps: 8 });
  await expect(cover).toHaveAttribute('data-inspect', 'dragging');
  await page.mouse.up();
  await expect(cover).toHaveAttribute('data-pointer', 'away');
  await expect.poll(async () => (await values()).zoom).toBe(1);
  await expect.poll(async () => (await values()).depth).toBe(0);
  // The full original sky is interactive; only the separate exterior desk is inert.
  const desk = cover.locator('.observatory-room-desk');
  // The fixed mobile menu can cover an element that is geometrically in the viewport.
  // Center the real desk and prove that our pointer will hit the scene, not navigation.
  await desk.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const deskBox = await desk.boundingBox();
  if (!deskBox) throw Error('Exterior desk missing');
  const deskPoint = { x: deskBox.x + deskBox.width * 0.42, y: deskBox.y + deskBox.height * 0.5 };
  expect(
    await cover.evaluate(
      (element, point) => element.contains(document.elementFromPoint(point.x, point.y)),
      deskPoint,
    ),
  ).toBe(true);
  await page.mouse.move(deskPoint.x, deskPoint.y);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(1200);
  expect((await values()).zoom).toBe(1);
  await expect(cover).toHaveAttribute('data-pointer', 'away');
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await page.mouse.move(x, y);
  await page.waitForTimeout(1300);
  expect((await values()).zoom).toBe(1);
  const frozenFlow = await flowTime();
  await page.waitForTimeout(160);
  expect(await flowTime()).toBe(frozenFlow);
  await cover.getByRole('button', { name: '풍경 움직이기', exact: true }).click();
  await svg.dispatchEvent('pointermove', { pointerType: 'touch', clientX: x, clientY: y });
  await expect(cover).toHaveAttribute('data-pointer', 'away');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(x + 5, y + 5);
  await page.waitForTimeout(1300);
  expect((await values()).zoom).toBe(1);
  await expect(cloud).toHaveCSS('animation-name', 'none');
  const reducedFlow = await flowTime();
  await page.waitForTimeout(160);
  expect(await flowTime()).toBe(reducedFlow);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  // Isolated demo only: verify actual WebGL context loss and restoration when available.
  if ((await canvas.getAttribute('data-renderer')) === 'webgl2') {
    const supported = await canvas.evaluate((node) => {
      const gl = (node as HTMLCanvasElement).getContext('webgl2');
      const extension = gl?.getExtension('WEBGL_lose_context');
      if (extension)
        node.addEventListener(
          'webglcontextlost',
          () => setTimeout(() => extension.restoreContext(), 1800),
          { once: true },
        );
      extension?.loseContext();
      return Boolean(extension);
    });
    if (supported) {
      await expect(canvas).toHaveAttribute('data-renderer', 'svg');
      const fallbackTime = await flowTime();
      await expect.poll(flowTime).not.toBe(fallbackTime);
      await expect(canvas).toHaveAttribute('data-renderer', 'webgl2');
    }
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});
