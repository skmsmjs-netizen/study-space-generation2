import { expect, test } from '@playwright/test';
import type { AppState } from '../../src/domain/model';
import { decodeStoredText, encodeStoredText } from '../../src/data/storage-codec';

test('home landscape keeps pause, layer choice and study records through reload', async ({
  page,
}) => {
  await page.goto('?space=demo#/');
  const landscape = page.getByRole('region', { name: '공부 사이의 풍경' });
  await expect(landscape.locator('svg.pixel-landscape')).toBeVisible();
  await expect(landscape.locator('[data-observatory-room]')).toHaveCount(1);
  const roomFrame = landscape.locator('.observatory-room-frame');
  await expect(roomFrame).toHaveCount(1);
  await expect(landscape.locator('.observatory-room-desk')).toHaveCSS('pointer-events', 'none');
  const coverGeometry = await landscape.evaluate((element) => {
    const main = document.querySelector('main.main-content');
    const svg = element.querySelector('svg.pixel-landscape');
    const room = element.querySelector('.observatory-room-frame');
    if (!main || !svg || !room) throw Error('Observatory layout is missing');
    const skyBox = svg.getBoundingClientRect(),
      roomBox = room.getBoundingClientRect();
    return {
      beforeMain: Boolean(element.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING),
      width: element.getBoundingClientRect().width,
      svgWidth: svg.getBoundingClientRect().width,
      height: svg.getBoundingClientRect().height,
      frameWidth: parseFloat(getComputedStyle(room).borderLeftWidth),
      outsideLeft: skyBox.left - roomBox.left,
      outsideTop: skyBox.top - roomBox.top,
      outsideRight: roomBox.right - skyBox.right,
      outsideBottom: roomBox.bottom - skyBox.bottom,
    };
  });
  expect(coverGeometry.beforeMain).toBe(true);
  expect(
    Math.abs(coverGeometry.svgWidth + 2 * coverGeometry.frameWidth - coverGeometry.width),
  ).toBeLessThan(1);
  expect(coverGeometry.svgWidth / coverGeometry.height).toBeCloseTo(960 / 400, 2);
  for (const edge of ['outsideLeft', 'outsideTop', 'outsideRight', 'outsideBottom'] as const)
    expect(coverGeometry[edge]).toBeCloseTo(coverGeometry.frameWidth, 1);
  await expect(landscape.locator('.pixel-layer')).toHaveCount(3);
  // The telescope can fall below the viewport in the short landscape profile.
  await landscape.locator('[data-telescope]').scrollIntoViewIfNeeded();
  const box = await landscape.locator('svg.pixel-landscape').boundingBox();
  if (!box) throw Error('Cover missing');
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.35);
  await expect(landscape).toHaveAttribute('data-pointer', 'near');
  const view = await landscape.locator('svg.pixel-landscape').evaluate((el) => {
    const v = (el as SVGSVGElement).viewBox.baseVal;
    return { x: v.x, y: v.y, width: v.width, height: v.height };
  });
  const scale = Math.min(box.width / view.width, box.height / view.height);
  const sx = box.x + (box.width - view.width * scale) / 2 - view.x * scale;
  const sy = box.y + (box.height - view.height * scale) / 2 - view.y * scale;
  await page.mouse.move(sx + 552 * scale, sy + 178 * scale);
  await page.mouse.down();
  await expect(landscape).toHaveAttribute('data-focus', 'telescope');
  await page.mouse.move(sx + 580 * scale, sy + 70 * scale);
  await expect
    .poll(() =>
      landscape.evaluate((el) =>
        Number((el as HTMLElement).style.getPropertyValue('--pixel-sky-zoom')),
      ),
    )
    .toBeGreaterThan(1.1);
  await page.mouse.up();
  await expect(landscape).toHaveAttribute('data-pointer', 'near');
  expect(
    await landscape.evaluate((el) =>
      Number((el as HTMLElement).style.getPropertyValue('--pixel-sky-zoom')),
    ),
  ).toBeGreaterThan(1.1);
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.35);
  const first = await landscape.evaluate((el) =>
    (el as HTMLElement).style.getPropertyValue('--pixel-cursor-x'),
  );
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.4);
  await expect
    .poll(() =>
      landscape.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--pixel-cursor-x')),
    )
    .not.toBe(first);
  await page.mouse.move(box.x + box.width * 0.6, box.y + box.height + 5);
  await expect(landscape).toHaveAttribute('data-pointer', 'away');
  await expect
    .poll(() =>
      landscape.evaluate((el) =>
        Number((el as HTMLElement).style.getPropertyValue('--pixel-sky-zoom')),
      ),
    )
    .toBe(1);
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await landscape.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await landscape.getByLabel('풍경 고르기', { exact: true }).click();
  await expect(landscape.locator('.landscape-options > div')).toBeVisible();
  expect(
    await landscape.evaluate((element) => {
      const heading = element.querySelector('.landscape-heading');
      const frame = element.querySelector('.observatory-room-frame');
      if (!heading || !frame) throw Error('Observatory menu or frame is missing');
      return Number(getComputedStyle(heading).zIndex) > Number(getComputedStyle(frame).zIndex);
    }),
  ).toBe(true);
  await landscape.getByRole('checkbox', { name: '혜성', exact: true }).uncheck();
  await page.reload();
  await expect(landscape.getByRole('button', { name: '풍경 움직이기', exact: true })).toBeVisible();
  await expect(landscape.locator('.pixel-layer')).toHaveCount(2);
  await landscape.getByLabel('풍경 고르기', { exact: true }).click();
  await expect(landscape.getByRole('checkbox', { name: '혜성', exact: true })).not.toBeChecked();
  for (const name of ['별빛', '궤도'])
    await landscape.getByRole('checkbox', { name, exact: true }).uncheck();
  await expect(landscape.locator('svg.pixel-landscape')).toHaveCount(0);
  await expect(landscape.locator('[data-observatory-room]')).toHaveCount(0);
  await expect(roomFrame).toHaveCount(0);
  await landscape.getByRole('button', { name: '기본 풍경으로', exact: true }).click();
  await expect(landscape.locator('.pixel-layer')).toHaveCount(3);
  await expect(landscape.locator('[data-observatory-room]')).toHaveCount(1);
  await expect(roomFrame).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(landscape.getByRole('button', { name: '정지된 풍경', exact: true })).toBeDisabled();
});

test('a saved study input drives the observatory stage and retains it after reload', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  await page.goto('?space=demo#/');
  const landscape = page.getByRole('region', { name: '공부 사이의 풍경' });
  await expect(landscape).toHaveAttribute('data-world', 'observatory');
  await expect(landscape).toHaveAttribute('data-evolution-stage', '1');
  await expect(landscape.locator('[data-radiance-stage]')).toHaveAttribute(
    'data-radiance-stage',
    '1',
  );
  await expect(landscape.locator('[data-radiance-ground]')).toHaveCount(1);
  await expect(page.getByRole('button', { name: '종이 기계', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '섬', exact: true })).toHaveCount(0);
  const before = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await landscape.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await page.reload();
  await expect(landscape).toHaveAttribute('data-evolution-stage', '1');
  await expect(landscape.getByRole('button', { name: '풍경 움직이기', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(before);
  await page.screenshot({ path: info.outputPath('input-driven-stage.png') });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test('accumulated observatory details stay bounded and honor pause and reduced motion', async ({
  page,
}, info) => {
  // Isolated browser context: derive the load fixture from an actual UI-saved synthetic record.
  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  const key = 'study-space:demo:v1';
  const stored = await page.evaluate((key) => localStorage.getItem(key), key);
  if (!stored) throw Error('Synthetic saved study record missing');
  const envelope = JSON.parse(decodeStoredText(stored)) as { sequence: number; data: AppState };
  const data = envelope.data;
  const record = data.records[0];
  const session = data.sessions[0];
  data.sessions = Array.from({ length: 2047 }, (_, index) => ({
    ...session,
    id: `observatory-load-${index}`,
  }));
  data.records = data.sessions.map((row, index) => ({
    ...record,
    id: `observatory-record-${index}`,
    sessionId: row.id,
  }));
  const payload = encodeStoredText(JSON.stringify({ ...envelope, data }));
  await page.evaluate(({ key, payload }) => localStorage.setItem(key, payload), { key, payload });
  await page.goto('?space=demo#/');
  const landscape = page.getByRole('region', { name: '공부 사이의 풍경' });
  await expect(landscape).toHaveAttribute('data-evolution-stage', '11');
  for (const detail of ['satellite', 'planet', 'eclipse', 'crown'])
    await expect(landscape.locator(`[data-celestial-detail="${detail}"]`)).toHaveCount(1);
  // Taller upper sky plus at most three bounded, blended event motifs.
  expect(await landscape.locator('svg.pixel-landscape *').count()).toBeLessThan(2200);
  const beacon = landscape.locator('.pixel-detail-beacon');
  const radiance = landscape.locator('.obs-rad-turn');
  const pathLight = landscape.locator('.obs-rad-beacon').first();
  await expect(radiance).toHaveCSS('animation-name', 'obs-rad-turn');
  await expect(pathLight).toHaveCSS('animation-name', 'obs-rad-beacon');
  await expect(beacon).toHaveCSS('animation-name', 'pixel-starlight');
  const waves = landscape.locator('.pixel-shockwave-front');
  await expect(waves).toHaveCount(3);
  const cover = await landscape.locator('svg.pixel-landscape').boundingBox();
  if (!cover) throw Error('Accumulated cover missing');
  // Sample real CSS keyframes in this isolated fixture. An 8s wall-clock poll can
  // miss the short visible window of a 28s wave under concurrent browser load.
  const fronts = await waves.first().evaluate((element) => {
    const animation = element.getAnimations()[0];
    if (!animation) throw Error('Shockwave CSS animation missing');
    animation.currentTime = 500;
    const near = element.getBoundingClientRect().width;
    animation.currentTime = 4000;
    const style = getComputedStyle(element);
    return { near, far: element.getBoundingClientRect().width, opacity: Number(style.opacity) };
  });
  expect(fronts.far).toBeGreaterThan(fronts.near);
  expect(fronts.far).toBeGreaterThan(cover.width);
  expect(fronts.opacity).toBeGreaterThan(0);
  await landscape.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await expect(beacon).toHaveCSS('animation-play-state', 'paused');
  await expect(radiance).toHaveCSS('animation-play-state', 'paused');
  await expect(pathLight).toHaveCSS('animation-play-state', 'paused');
  await expect(waves.first()).toHaveCSS('animation-play-state', 'paused');
  await page.reload();
  await expect(landscape).toHaveAttribute('data-evolution-stage', '11');
  await expect(beacon).toHaveCSS('animation-play-state', 'paused');
  await expect(radiance).toHaveCSS('animation-play-state', 'paused');
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(payload);
  await landscape.getByRole('button', { name: '풍경 움직이기', exact: true }).click();
  await expect(beacon).toHaveCSS('animation-play-state', 'running');
  await expect(radiance).toHaveCSS('animation-play-state', 'running');
  await page.screenshot({ path: info.outputPath('accumulated-observatory.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(beacon).toHaveCSS('animation-name', 'none');
  await expect(waves.first()).toHaveCSS('animation-name', 'none');
  expect(
    await landscape.evaluate(
      (element) =>
        [...element.querySelectorAll('svg.pixel-landscape *')].filter(
          (node) => getComputedStyle(node).animationName !== 'none',
        ).length,
    ),
  ).toBe(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});
