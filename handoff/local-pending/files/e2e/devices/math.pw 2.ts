import { test, expect, type Page } from '@playwright/test';
import type { MathScene } from '../../src/domain/math-explorer';

async function snapshot(page: Page): Promise<MathScene> {
  const waiting = page.waitForEvent('download');
  await page.getByRole('button', { name: '파일로 보관', exact: true }).tap();
  const download = await waiting;
  const stream = await download.createReadStream();
  if (!stream) throw Error('수식 파일을 읽지 못했습니다.');
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  const match = /\n```study-math-v1\n([^\n]*)\n```$/.exec(body);
  if (!match) throw Error('수식 원문이 없습니다.');
  return JSON.parse(match[1]) as MathScene;
}
function scale(scene: MathScene) {
  const xml = scene.geogebra?.xml ?? '';
  const view = (
    scene.mode === 'curve'
      ? /<euclidianView3D>[\s\S]*?<coordSystem\s+([^>]+)>/
      : /<euclidianView>[\s\S]*?<coordSystem\s+([^>]+)>/
  ).exec(xml);
  const value = /\bscale="([^"]+)"/.exec(view?.[1] ?? '');
  if (!value) throw Error('3D 보기 배율이 없습니다.');
  return Number(value[1]);
}

test('math zoom preserves exact t, formulas, notes and restored view', async ({ page }, info) => {
  await page.goto('?space=demo#/math');
  const zoomIn = page.getByRole('button', { name: '＋ 확대', exact: true });
  const zoomOut = page.getByRole('button', { name: '− 축소', exact: true });
  await expect(zoomIn).toBeEnabled({ timeout: 45000 });
  const input = page.getByRole('textbox', { name: 't 값', exact: true });
  const slider = page.getByRole('slider', { name: '곡선 위 위치 t', exact: true });
  await input.fill('pi');
  await input.press('Enter');
  await expect(input).toHaveValue('3.14');
  await input.tap();
  await input.press('Tab');
  expect(Number(await slider.inputValue())).toBeCloseTo(Math.PI, 13);
  await page
    .getByLabel('관찰·메모 (선택)', { exact: true })
    .fill('  원문·조건\n변수와 보기 보존  ');
  const before = await snapshot(page);
  const originalScale = scale(before);
  await zoomIn.tap();
  await expect(page.locator('.math-geogebra [role="alert"]')).toHaveCount(0);
  await expect.poll(async () => scale(await snapshot(page))).toBeGreaterThan(originalScale);
  const enlargedScale = scale(await snapshot(page));
  await input.fill('2*pi');
  await input.press('Enter');
  await expect(input).toHaveValue('6.28');
  expect(scale(await snapshot(page))).toBeCloseTo(enlargedScale, 8);
  await zoomOut.tap();
  await expect.poll(async () => scale(await snapshot(page))).toBeCloseTo(originalScale, 5);
  const after = await snapshot(page);
  expect(after.expressions).toEqual(before.expressions);
  expect(after.notes).toEqual(before.notes);
  expect(after.a).toBe(before.a);
  expect(after.position).toBeCloseTo(0.25, 13);
  await zoomIn.tap();
  await expect.poll(async () => scale(await snapshot(page))).toBeGreaterThan(originalScale);
  const storedScale = scale(await snapshot(page));
  await page.reload();
  await expect(zoomIn).toBeEnabled({ timeout: 45000 });
  await expect(input).toHaveValue('6.28');
  expect(Number(await slider.inputValue())).toBeCloseTo(2 * Math.PI, 13);
  expect(scale(await snapshot(page))).toBeCloseTo(storedScale, 5);
  await expect(page.getByLabel('관찰·메모 (선택)', { exact: true })).toHaveValue(after.notes);
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  await expect(zoomIn).toBeEnabled({ timeout: 45000 });
  await zoomIn.tap();
  await zoomOut.tap();
  await expect(page.locator('.math-visual [role="alert"]')).toHaveCount(0);
  await page.getByText('수식·구간 편집', { exact: true }).tap();
  await page.getByLabel('수식 예시', { exact: true }).selectOption({ label: '사인파' });
  await page.getByRole('button', { name: '예시 적용', exact: true }).tap();
  await expect(page.getByRole('img', { name: '함수 그래프와 현재 점', exact: true })).toBeVisible();
  await expect(zoomIn).toBeEnabled();
  await zoomIn.tap();
  await zoomOut.tap();
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
  await expect(zoomIn).toBeEnabled({ timeout: 45000 });
  const functionScale = scale(await snapshot(page));
  await zoomIn.tap();
  await expect.poll(async () => scale(await snapshot(page))).toBeGreaterThan(functionScale);
  await zoomOut.tap();
  await expect.poll(async () => scale(await snapshot(page))).toBeCloseTo(functionScale, 5);
  await expect(page.locator('.math-visual [role="alert"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('math-zoom.png') });
});

// Feed Pointer Events into the renderer, without calling its camera/zoom API.
// These are synthetic touch inputs in WebKit, not physical-device evidence.
async function touchView(
  page: Page,
  gesture: 'rotate' | 'pan' | 'out' | 'in',
  selector = '.math-geogebra canvas:visible',
) {
  const canvas = page.locator(selector).first();
  await canvas.scrollIntoViewIfNeeded();
  await canvas.evaluate(async (element, kind) => {
    // dispatch on the actual canvas; native events bubble to its view panel.
    const box = element.getBoundingClientRect();
    const x = box.left + box.width / 2,
      y = box.top + box.height / 2;
    const moving = kind === 'rotate' || kind === 'pan';
    const nativeRotate = kind === 'rotate' && element.closest('.math-geogebra') !== null;
    const send = (type: string, id: number, dx: number, dy: number) => {
      const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerType: 'touch',
        pointerId: id,
        isPrimary: id === 11,
        buttons: type === 'pointerup' ? 0 : 1,
        button: type === 'pointermove' ? -1 : 0,
        clientX: x + dx,
        clientY: y + dy,
      });
      Object.defineProperties(event, {
        offsetX: { value: box.width / 2 + dx },
        offsetY: { value: box.height / 2 + dy },
      });
      element.dispatchEvent(event);
    };
    send('pointerdown', 11, -40, 0);
    if (!moving || nativeRotate) send('pointerdown', 12, 40, 0);
    for (let i = 1; i <= 8; i++) {
      const distance = kind === 'out' ? 40 + i * 5 : 40 - i * 2;
      send('pointermove', 11, moving ? -40 + i * 8 : -distance, moving ? i * 3 : 0);
      if (nativeRotate) send('pointermove', 12, 40 + i * 8, i * 3);
      else if (!moving) send('pointermove', 12, distance, 0);
      await new Promise((resolve) => setTimeout(resolve, 40));
    }
    send('pointerup', 11, 24, 24);
    if (!moving || nativeRotate)
      send('pointerup', 12, nativeRotate ? 104 : 56, nativeRotate ? 24 : 0);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }, gesture);
  if (selector.startsWith('.math-geogebra')) {
    // Native pinch easing can continue after pointerup. Wait for its public
    // camera coordinates to settle before capturing the expected saved view.
    await page.evaluate(async () => {
      const applet = Object.values(window).find(
        (value) =>
          value &&
          typeof value === 'object' &&
          typeof (value as { exists?: unknown }).exists === 'function' &&
          (value as unknown as { exists: (name: string) => boolean }).exists('StudyPoint'),
      ) as { getXML: () => string } | undefined;
      if (!applet) return;
      let previous = '',
        stable = 0;
      for (let attempt = 0; attempt < 40 && stable < 4; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        const current = (applet.getXML().match(/<coordSystem\s+[^>]+>/g) ?? []).join(';');
        stable = current === previous ? stable + 1 : 0;
        previous = current;
      }
      if (stable < 4) throw Error('Native camera did not settle after touch');
    });
  }
}
function angles(scene: MathScene) {
  const coords =
    /<euclidianView3D>[\s\S]*?<coordSystem\s+([^>]+)>/.exec(scene.geogebra?.xml ?? '')?.[1] ?? '';
  return ['xAngle', 'zAngle'].map((name) =>
    Number(new RegExp(`${name}="([^"]+)"`).exec(coords)?.[1]),
  );
}

test('math native touch rotates and pinches while retaining formulas and t', async ({ page }) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
  await expect(page.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  const before = await snapshot(page);
  await touchView(page, 'rotate');
  const rotated = await snapshot(page);
  expect(angles(rotated)).not.toEqual(angles(before));
  await touchView(page, 'out');
  const enlarged = await snapshot(page);
  expect(scale(enlarged)).toBeGreaterThan(scale(rotated));
  await touchView(page, 'in');
  const reduced = await snapshot(page);
  expect(scale(reduced)).toBeLessThan(scale(enlarged));
  expect(reduced.expressions).toEqual(before.expressions);
  expect(reduced.position).toBe(before.position);
  expect(reduced.a).toBe(before.a);
  expect(reduced.b).toBe(before.b);
  await page.reload();
  await expect(page.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  const restored = await snapshot(page);
  expect(scale(restored)).toBeCloseTo(scale(reduced), 5);
  expect(angles(restored)).toEqual(angles(reduced));
  expect(await page.locator('.math-plot').evaluate((e) => getComputedStyle(e).touchAction)).toBe(
    'none',
  );
  expect(await page.locator('main').evaluate((e) => getComputedStyle(e).touchAction)).toBe('auto');
  await page.getByText('수식·구간 편집', { exact: true }).tap();
  await page.getByLabel('수식 예시', { exact: true }).selectOption({ label: '사인파' });
  await page.getByRole('button', { name: '예시 적용', exact: true }).tap();
  await expect(page.getByLabel('그래프 종류', { exact: true })).toHaveValue('function');
  await expect(page.getByRole('button', { name: '＋ 확대', exact: true })).toBeEnabled({
    timeout: 45000,
  });
  const flat = await snapshot(page);
  await touchView(page, 'pan');
  const moved = await snapshot(page);
  expect(moved.geogebra?.xml).not.toBe(flat.geogebra?.xml);
  await touchView(page, 'out');
  const enlargedFlat = await snapshot(page);
  expect(scale(enlargedFlat)).toBeGreaterThan(scale(moved));
  await touchView(page, 'in');
  expect(scale(await snapshot(page))).toBeLessThan(scale(enlargedFlat));
});

async function plotlyView(page: Page): Promise<Record<string, unknown>> {
  return JSON.parse((await page.locator('.js-plotly-plot').getAttribute('data-test-view')) ?? '{}');
}
function eyeLength(view: Record<string, unknown>) {
  const camera = view['scene.camera'] as { eye: { x: number; y: number; z: number } };
  return Math.hypot(camera.eye.x, camera.eye.y, camera.eye.z);
}
test('math Plotly touch rotates and pinches with native camera events', async ({ page }) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  await page.locator('.js-plotly-plot').evaluate((element) => {
    (
      element as HTMLElement & {
        on: (name: string, callback: (update: Record<string, unknown>) => void) => void;
      }
    ).on('plotly_relayout', (update) => {
      element.setAttribute(
        'data-test-view',
        JSON.stringify({
          ...JSON.parse(element.getAttribute('data-test-view') ?? '{}'),
          ...update,
        }),
      );
    });
  });
  await zoom.tap();
  const before = await plotlyView(page);
  await touchView(page, 'rotate', '.math-plot canvas');
  const rotated = await plotlyView(page);
  expect(rotated['scene.camera']).not.toEqual(before['scene.camera']);
  await touchView(page, 'out', '.math-plot canvas');
  const enlarged = await plotlyView(page);
  expect(eyeLength(enlarged)).toBeLessThan(eyeLength(rotated));
  await touchView(page, 'in', '.math-plot canvas');
  const reduced = await plotlyView(page);
  expect(eyeLength(reduced)).toBeGreaterThan(eyeLength(enlarged));
  const input = page.getByRole('textbox', { name: 't 값', exact: true });
  await input.fill('pi');
  await input.press('Enter');
  await zoom.tap();
  const moved = await plotlyView(page);
  expect(eyeLength(moved)).toBeCloseTo(eyeLength(reduced) / 1.2, 5);
  await expect(page.locator('.math-visual [role="alert"]')).toHaveCount(0);
  await page.getByText('수식·구간 편집', { exact: true }).tap();
  await page.getByLabel('수식 예시', { exact: true }).selectOption({ label: '사인파' });
  await page.getByRole('button', { name: '예시 적용', exact: true }).tap();
  await expect(page.getByRole('img', { name: '함수 그래프와 현재 점', exact: true })).toBeVisible();
  await expect(zoom).toBeEnabled();
  await zoom.tap();
  const flat = await plotlyView(page);
  await touchView(page, 'rotate', '.math-plot .nsewdrag');
  const panned = await plotlyView(page);
  expect(panned['xaxis.range[0]']).not.toBe(flat['xaxis.range[0]']);
  await touchView(page, 'out', '.math-plot .nsewdrag');
  const magnified = await plotlyView(page);
  const span = (view: Record<string, unknown>) => {
    const range = view['xaxis.range'] as number[];
    return range[1] - range[0];
  };
  expect(span(magnified)).toBeLessThan(span(flat));
  await touchView(page, 'in', '.math-plot .nsewdrag');
  expect(span(await plotlyView(page))).toBeGreaterThan(span(magnified));
});

// Read pixels from the rendered canvas screenshot, rather than asserting only
// that a construction object still exists outside the visible camera.
async function coloredPixels(page: Page) {
  const png = await page.locator('.math-geogebra-host').screenshot();
  return page.evaluate(async (base64) => {
    const image = new Image();
    image.src = `data:image/png;base64,${base64}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw Error('화면을 읽지 못했습니다.');
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const probe = document.createElement('span');
    probe.style.color = 'var(--color-math-point)';
    document.querySelector('.math-explorer')!.appendChild(probe);
    const primary = getComputedStyle(probe)
      .color.match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number) ?? [79, 70, 230];
    probe.remove();
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (Math.hypot(r - primary[0], g - primary[1], b - primary[2]) < 60) count++;
    }
    return count;
  }, png.toString('base64'));
}

test('math integer grid and coordinate guides retain the point through repeated zoom', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  const t = page.getByRole('textbox', { name: 't 값', exact: true });
  await t.fill('pi/3');
  await t.press('Enter');
  const before = await snapshot(page);
  const view =
    /<euclidianView3D>[\s\S]*?<\/euclidianView3D>/.exec(before.geogebra?.xml ?? '')?.[0] ?? '';
  await expect(page.locator('.math-flat-scaffold [data-world-grid]')).toHaveAttribute('d', /M/);
  expect(view.match(/tickDistance="1"/g)).toHaveLength(3);
  expect(view).toContain('<plate show="false"');
  for (const name of ['studyGuideX', 'studyGuideY', 'studyGuideZ', 'studyGuideXY'])
    expect(before.geogebra?.xml).toContain(`label="${name}"`);
  const initialPixels = await coloredPixels(page);
  expect(initialPixels).toBeGreaterThan(8);
  for (let i = 0; i < 7; i++) await zoom.tap();
  const enlarged = await snapshot(page);
  expect(scale(enlarged)).toBeGreaterThan(scale(before) * 3);
  expect(await coloredPixels(page)).toBeGreaterThan(8);
  expect(enlarged.expressions).toEqual(before.expressions);
  expect(enlarged.position).toBe(before.position);
  await page.screenshot({ path: info.outputPath('integer-grid-zoom.png') });
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await t.fill('pi/2');
  await t.press('Enter');
  const moved = await snapshot(page);
  expect(moved.geogebra?.xml).not.toBe(enlarged.geogebra?.xml);
  await page.getByText('수식·구간 편집', { exact: true }).tap();
  await page.getByLabel('수식 예시', { exact: true }).selectOption({ label: '사인파' });
  await page.getByRole('button', { name: '예시 적용', exact: true }).tap();
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  const fn = await snapshot(page);
  const view2 = /<euclidianView>[\s\S]*?<\/euclidianView>/.exec(fn.geogebra?.xml ?? '')?.[0] ?? '';
  expect(view2).toContain('grid="true"');
  expect(view2.match(/tickDistance="1"/g)).toHaveLength(2);
  expect(fn.geogebra?.xml).toContain('label="studyGuideX"');
  expect(fn.geogebra?.xml).toContain('label="studyGuideY"');
  for (let i = 0; i < 5; i++) await zoom.tap();
  expect(await coloredPixels(page)).toBeGreaterThan(8);
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  await expect(page.getByRole('img', { name: '함수 그래프와 현재 점', exact: true })).toBeVisible();
  // Curve, coordinate guides, axis coordinate markers and the current point.
  await expect(page.locator('.math-plot .scatterlayer .trace')).toHaveCount(4);
  // The density rule may hide tick labels in narrow views. Verify the
  // painted grid, and integer formatting for every label that is displayed.
  const initialLabels = await page.locator('.math-plot .xtick text').allTextContents();
  expect(initialLabels.every((value) => !value.includes('.'))).toBe(true);
  // A vertical SVG path has zero bounding-box width, even when its stroke is
  // painted. Verify the drawing and its style rather than rectangle visibility.
  const grid = page.locator('.math-plot .gridlayer .xgrid').first();
  await expect
    .poll(() =>
      grid.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          element instanceof SVGPathElement &&
          element.getTotalLength() > 0 &&
          style.stroke !== 'none' &&
          style.display !== 'none' &&
          style.visibility === 'visible' &&
          Number(style.opacity) > 0 &&
          Number(style.strokeOpacity) > 0
        );
      }),
    )
    .toBe(true);
  for (let i = 0; i < 6; i++) await zoom.tap();
  const labels = await page.locator('.math-plot .xtick text').allTextContents();
  expect(labels.every((value) => !value.includes('.'))).toBe(true);
});

test('math neutral solid grid and density driven number fade', async ({ page }, info) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
  const host = page.locator('.math-geogebra-host');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  for (let i = 0; i < 4; i++) await page.getByRole('button', { name: '− 축소', exact: true }).tap();
  await expect(host).toHaveAttribute('data-axis-numbers', 'hidden');
  const far = await snapshot(page);
  const xml = far.geogebra?.xml ?? '';
  expect(xml).toContain('<axesColored val="false"');
  await expect(page.locator('.math-flat-scaffold [data-world-grid]')).toHaveAttribute('d', /M/);
  await page.screenshot({ path: info.outputPath('neutral-far.png') });
  await host.evaluate((el) => {
    const observer = new MutationObserver(() => {
      el.dataset.testFade = [
        ...(el.dataset.testFade?.split(';') ?? []),
        el.getAttribute('data-axis-number-opacity') ?? '',
      ]
        .slice(-120)
        .join(';');
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-axis-number-opacity'] });
  });
  for (let i = 0; i < 12; i++) await zoom.tap();
  await expect(host).toHaveAttribute('data-axis-numbers', 'visible');
  const samples = ((await host.getAttribute('data-test-fade')) ?? '').split(/[;,]/).map(Number);
  expect(samples.some((v) => v > 0.02 && v < 0.98)).toBe(true);
  const close = await snapshot(page);
  expect(close.expressions).toEqual(far.expressions);
  expect(close.position).toBe(far.position);
  // At high zoom the origin and some whole axes can leave the viewport.
  // Their labels must follow the axis visibility rather than float in view.
  const labels = await page
    .locator('.math-flat-scaffold [data-axis-labels]')
    .evaluateAll((groups) =>
      groups.map((group) => ({
        axis: group.getAttribute('data-axis-labels'),
        visibility: group.getAttribute('visibility'),
        values: Array.from(group.querySelectorAll('text'), (text) => text.textContent),
      })),
    );
  for (const label of labels) {
    await expect(page.locator(`.math-flat-scaffold [data-axis="${label.axis}"]`)).toHaveAttribute(
      'visibility',
      label.visibility ?? 'hidden',
    );
    expect(label.values.every((value) => /^-?\d+$/.test(value ?? ''))).toBe(true);
  }
  expect(await page.locator('.math-flat-scaffold [data-axis]').count()).toBe(3);
  expect(await page.locator('.math-flat-scaffold [data-vector]').count()).toBe(3);
  const flatAxes = await page.locator('.math-flat-scaffold [data-axis]').evaluateAll((lines) =>
    lines.map((line) => ({
      color: line.getAttribute('stroke'),
      width: Number(line.getAttribute('stroke-width')),
      coordinates: ['x1', 'y1', 'x2', 'y2'].map((key) => Number(line.getAttribute(key))),
    })),
  );
  for (const axis of flatAxes) {
    expect(axis.color).toBe('#525252');
    expect(axis.width).toBe(1);
  }
  expect(close.geogebra?.xml).not.toContain('type="cone"');
  await page.screenshot({ path: info.outputPath('neutral-close.png') });
  for (let i = 0; i < 12; i++)
    await page.getByRole('button', { name: '− 축소', exact: true }).tap();
  await expect(host).toHaveAttribute('data-axis-numbers', 'hidden');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (let i = 0; i < 12; i++) await zoom.tap();
  await expect(host).toHaveAttribute('data-axis-numbers', 'visible');
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  const plot = page.locator('.math-plot[role="img"]');
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: '− 축소', exact: true }).tap();
  await expect(plot).toHaveAttribute('data-axis-numbers', 'hidden');
  for (let i = 0; i < 10; i++) await zoom.tap();
  await expect(plot).toHaveAttribute('data-axis-numbers', 'visible');
  await page.screenshot({ path: info.outputPath('plotly-near.png') });
});

// Reproduce the almost edge-on camera in the reported screenshot in an isolated
// context. Check painted curve pixels at analytically known positions outside
// Classic's world box, rather than only the existence of a curve object.
test('math rotated zoom paints continuous curve outside native world bounds', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('geogebra');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  await page.getByRole('textbox', { name: 'a 값', exact: true }).fill('3');
  await page.getByRole('textbox', { name: 'a 값', exact: true }).press('Enter');
  await page.getByRole('textbox', { name: 't 값', exact: true }).fill('2*pi');
  await page.getByRole('textbox', { name: 't 값', exact: true }).press('Enter');
  for (let i = 0; i < 7; i++) await zoom.tap();
  const samples = await page.evaluate(async () => {
    const win = window as unknown as Record<
      string,
      {
        exists(name: string): boolean;
        getXML(): string;
        setXML(xml: string): void;
        getXcoord(name: string): number;
        getYcoord(name: string): number;
        getZcoord(name: string): number;
      }
    >;
    const native = Object.entries(win).find(
      ([name, value]) => name.startsWith('studyggb') && value?.exists?.('StudyViewRight'),
    )?.[1];
    if (!native) throw Error('Native view missing');
    await new Promise((resolve) => setTimeout(resolve, 500));
    const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
    const coords = xml.querySelector('euclidianView3D > coordSystem');
    coords?.setAttribute('xAngle', '7');
    coords?.setAttribute('zAngle', '0');
    native.setXML(new XMLSerializer().serializeToString(xml));
    await new Promise((resolve) => setTimeout(resolve, 200));
    const get = (name: string) => [
      native.getXcoord(name),
      native.getYcoord(name),
      native.getZcoord(name),
    ];
    const low = get('StudyViewLow'),
      high = get('StudyViewHigh'),
      center = low.map((v, i) => (v + high[i]) / 2),
      scales = get('StudyViewScale');
    const unit = (v: number[]) => {
      const n = Math.hypot(...v);
      return v.map((x) => x / n);
    };
    const right = unit(get('StudyViewRight')),
      direction = unit(get('StudyViewDirection'));
    let up = unit([
      direction[1] * right[2] - direction[2] * right[1],
      direction[2] * right[0] - direction[0] * right[2],
      direction[0] * right[1] - direction[1] * right[0],
    ]);
    if (up[2] < 0) up = up.map((v) => -v);
    const [width, height] = get('StudyViewSize');
    const dot = (a: number[], b: number[]) => a.reduce((sum, v, i) => sum + v * b[i], 0);
    const points: number[][] = [];
    for (let j = 0; j <= 400; j += 4) {
      const t = (8 * Math.PI * j) / 400,
        point = [3 * Math.cos(t), 3 * Math.sin(t), 0.5 * t];
      const q = point.map((v, i) => (v - center[i]) * scales[i]);
      const x = width / 2 + dot(q, right),
        y = height / 2 - dot(q, up);
      if (
        x > 8 &&
        x < width - 8 &&
        y > 8 &&
        y < height - 8 &&
        point.some((v, i) => v < low[i] || v > high[i])
      )
        points.push([x, y]);
    }
    return {
      width,
      height,
      points,
      color: document.querySelector('.math-flat-scaffold [data-curve]')?.getAttribute('stroke'),
      visible: document
        .querySelector('.math-flat-scaffold [data-curve]')
        ?.getAttribute('d')
        ?.includes('L'),
    };
  });
  expect(samples.visible).toBe(true);
  expect(samples.points.length).toBeGreaterThan(4);
  const png = await page.locator('.math-geogebra-host').screenshot();
  const painted = await page.evaluate(
    async ({ base64, samples }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${base64}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      if (!context) throw Error('Canvas missing');
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const rgb = [1, 3, 5].map((offset) =>
        Number.parseInt((samples.color ?? '#6366f1').slice(offset, offset + 2), 16),
      );
      return samples.points.filter(([x, y]) => {
        const px = Math.round((x * canvas.width) / samples.width),
          py = Math.round((y * canvas.height) / samples.height);
        for (let dy = -3; dy <= 3; dy++)
          for (let dx = -3; dx <= 3; dx++) {
            const p = ((py + dy) * canvas.width + px + dx) * 4;
            if (rgb.every((value, index) => Math.abs(data[p + index] - value) < 55)) return true;
          }
        return false;
      }).length;
    },
    { base64: png.toString('base64'), samples },
  );
  expect(painted / samples.points.length).toBeGreaterThan(0.9);
  await page.screenshot({ path: info.outputPath('continuous-rotated-curve.png') });
});
