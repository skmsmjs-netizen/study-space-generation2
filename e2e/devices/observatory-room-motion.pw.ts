import { expect, test, type Locator, type Page } from '@playwright/test';

const indoorPlaces = [
  { id: 'left', name: '왼쪽 자료 책장' },
  { id: 'right', name: '오른쪽 탐구 작업대' },
  { id: 'back', name: '뒤쪽 기록·계획 벽' },
  { id: 'ceiling', name: '위쪽 천장 조명' },
] as const;

async function enterPlace(page: Page, place: (typeof indoorPlaces)[number]) {
  await page
    .getByRole('navigation', { name: '천문대 자리', exact: true })
    .getByRole('link', { name: place.name, exact: true })
    .click();
  const scene = page.locator('.observatory-place-scene');
  await expect(scene).toHaveAttribute('data-place-scene', place.id);
  return scene;
}

async function expectFullCover(page: Page) {
  const cover = page.locator('.app-shell > .observatory-cover');
  await expect(cover).toBeVisible();
  const geometry = await cover.evaluate((element) => {
    const shell = element.parentElement;
    if (!shell) throw Error('The room cover has no application shell.');
    const view = element.getBoundingClientRect();
    const outer = shell.getBoundingClientRect();
    return {
      first: shell.firstElementChild === element,
      left: view.left - outer.left,
      width: view.width - outer.width,
    };
  });
  expect(geometry.first).toBe(true);
  expect(Math.abs(geometry.left)).toBeLessThanOrEqual(2);
  expect(Math.abs(geometry.width)).toBeLessThanOrEqual(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
}

async function expectWholeArt(scene: Locator) {
  const art = scene.locator('svg.observatory-place-art');
  await expect(art).toBeVisible();
  await expect(art).toHaveAttribute('viewBox', '0 0 960 260');
  await expect(art).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
  await expect(art).toHaveAttribute('aria-hidden', 'true');
  const frame = await art.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return { ratio: rect.width / rect.height, transform: style.transform };
  });
  expect(frame.ratio).toBeCloseTo(960 / 260, 1);
  // Camera transforms belong to the inner layers, never the original SVG viewport.
  expect(frame.transform).toBe('none');
}

function zoom(scene: Locator) {
  return scene.evaluate((node) =>
    Number((node as HTMLElement).style.getPropertyValue('--pixel-sky-zoom') || '1'),
  );
}

async function clickSceneControl(scene: Locator, name: string) {
  const button = scene.getByRole('button', { name, exact: true });
  // Route content may restore its scroll position after the cover mounts. A user
  // brings the control into view before using it; this also resumes the IO budget.
  // Playwright's click checks enabled before auto-scrolling an offscreen button.
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeEnabled();
  await button.click();
}

async function expectStopped(scene: Locator) {
  await expect
    .poll(() =>
      scene
        .locator('canvas')
        .evaluateAll((canvases) =>
          canvases.every((canvas) => canvas.getAttribute('data-room-raf') === 'stopped'),
        ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      scene.evaluate(
        (node) =>
          node
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length,
      ),
    )
    .toBe(0);
}

test('all room directions keep the full cover, support explicit inspection, and retain the pause choice', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('?space=demo#/subjects');
  await expect(page.locator('.observatory-place-scene')).toHaveAttribute(
    'data-place-scene',
    'left',
  );
  for (const place of indoorPlaces) {
    const scene = await enterPlace(page, place);
    await expectFullCover(page);
    await expectWholeArt(scene);
    await expect(scene).toHaveAttribute(
      'data-time-phase',
      /^(morning|day|sunset|night|late-night|dawn)$/,
    );
    for (const attribute of ['data-room-activity', 'data-room-density', 'data-room-glimmer']) {
      const value = Number(await scene.getAttribute(attribute));
      expect(await scene.getAttribute(attribute)).not.toBeNull();
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
    await expect.poll(() => zoom(scene), { timeout: 15000 }).toBe(1);
    await clickSceneControl(scene, '가까이 보기');
    await expect.poll(() => zoom(scene)).toBeGreaterThan(1.05);
    if (place.id === 'right') {
      // The lazy graph must finish loading without taking focus or scrolling
      // away from the room inspection already started by the user.
      const graphHost = page.locator('.math-geogebra-host');
      await expect(graphHost).toBeAttached();
      await expect(page.locator('.math-geogebra [data-ui-loading]')).toHaveCount(0);
      await expect(graphHost).toHaveJSProperty('inert', false);
      expect(await graphHost.evaluate((node) => node.contains(document.activeElement))).toBe(false);
      await expect(scene).toHaveAttribute('data-motion', 'running');
      await expect.poll(() => zoom(scene)).toBeGreaterThan(1.05);
    }
    await expectWholeArt(scene);
    await clickSceneControl(scene, '전체 보기');
    await expect.poll(() => zoom(scene), { timeout: 15000 }).toBe(1);
    const canvas = scene.locator('canvas');
    await expect(canvas).toHaveAttribute('data-room-renderer', /^(webgl2|fallback)$/);
  }
  const scene = page.locator('.observatory-place-scene');
  await clickSceneControl(scene, '풍경 멈춤');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expectStopped(scene);
  await page.reload();
  await expect(scene).toHaveAttribute('data-place-scene', 'ceiling');
  await expect(scene).toHaveAttribute('data-motion', 'paused');
  await expect(scene.getByRole('button', { name: '풍경 재생', exact: true })).toBeVisible();
  await expectStopped(scene);
  await clickSceneControl(scene, '풍경 재생');
  await expect(scene).toHaveAttribute('data-motion', 'running');
  await page
    .getByRole('navigation', { name: '천문대 자리', exact: true })
    .getByRole('link', { name: '정면 공부 책상', exact: true })
    .click();
  await expect(page.locator('.observatory-place-scene')).toHaveCount(0);
  const windowScene = page.getByRole('region', { name: '공부 사이의 풍경', exact: true });
  await expect(windowScene).toBeVisible();
  await expect(windowScene.locator('svg.pixel-landscape')).toHaveAttribute(
    'viewBox',
    '0 -100 960 400',
  );
  await expect(windowScene.locator('svg.pixel-landscape')).toHaveAttribute(
    'preserveAspectRatio',
    'xMidYMid meet',
  );
  await expectFullCover(page);
});

test('reduced motion and unavailable GPU preserve each room, stop hidden work, and never change the ledger', async ({
  page,
}, info) => {
  // Isolated browser fixture: prove native art and navigation survive an unavailable GPU.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value(this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
        if (kind === 'webgl2') return null;
        return Reflect.apply(original, this, [kind, ...args]);
      },
    });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('?space=demo#/subjects');
  await expect(page.locator('.observatory-place-scene')).toHaveAttribute(
    'data-place-scene',
    'left',
  );
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  expect(original).not.toBeNull();
  for (const place of indoorPlaces) {
    const scene = await enterPlace(page, place);
    await expect(scene).toHaveAttribute('data-motion', 'paused');
    await expectWholeArt(scene);
    await expectFullCover(page);
    await expectStopped(scene);
    await expect(scene.locator('canvas')).toHaveAttribute('data-room-renderer', 'fallback');
    await scene.getByRole('button', { name: '풍경 접기', exact: true }).click();
    await expect(scene.locator('svg.observatory-place-art')).toBeHidden();
    await expectStopped(scene);
    await scene.getByRole('button', { name: '풍경 펼치기', exact: true }).click();
    await expectWholeArt(scene);
    await expectStopped(scene);
    expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
  }
  const scene = page.locator('.observatory-place-scene');
  await scene.getByRole('button', { name: '풍경 접기', exact: true }).click();
  await page.reload();
  await expect(scene.getByRole('button', { name: '풍경 펼치기', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(scene.locator('svg.observatory-place-art')).toBeHidden();
  await expectStopped(scene);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
  await expectFullCover(page);
  await page.screenshot({ path: info.outputPath('observatory-room-motion-reduced.png') });
});
