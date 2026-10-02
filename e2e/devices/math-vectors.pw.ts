import { test, expect, type Page } from '@playwright/test';
async function view(page: Page) {
  return page.locator('.math-flat-scaffold').evaluate((svg) => {
    const box = (svg.getAttribute('viewBox') ?? '').split(/\s+/).map(Number);
    const p = svg.querySelector('[data-current-point]');
    if (!p) throw Error('Current point is missing');
    return {
      box,
      point: [Number(p.getAttribute('cx')), Number(p.getAttribute('cy'))],
      vectors: Array.from(svg.querySelectorAll('[data-vector]'), (e) => {
        const commands = (e.getAttribute('d') ?? '').split(/\s+/);
        const start = commands[0]?.slice(1).split(',').map(Number) ?? [];
        const end = commands[1]?.slice(1).split(',').map(Number) ?? [];
        return {
          name: e.getAttribute('data-vector'),
          visible: e.getAttribute('visibility'),
          start,
          end,
          length: Math.hypot(end[0] - start[0], end[1] - start[1]),
        };
      }),
    };
  });
}
async function world(page: Page) {
  return page.evaluate(() => {
    type NativeApi = {
      exists(name: string): boolean;
      getXcoord(name: string): number;
      getYcoord(name: string): number;
      getZcoord(name: string): number;
    };
    const a = Object.entries(window).find(
      ([key, value]) =>
        key.startsWith('studyggb') &&
        (value as unknown as NativeApi | undefined)?.exists?.('StudyPoint'),
    )?.[1] as NativeApi | undefined;
    if (!a) throw Error('native view missing');
    const coords = (name: string) => [a.getXcoord(name), a.getYcoord(name), a.getZcoord(name)];
    const p = coords('StudyPoint');
    return {
      p,
      vectors: ['T', 'N', 'B'].map((name) => coords(`StudyTip${name}`).map((v, i) => v - p[i])),
    };
  });
}
test('math vector display is bounded through zoom and shared by other curves', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/math');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  const original = await world(page);
  for (let i = 0; i < 15; i++) await zoom.tap();
  await expect
    .poll(async () => {
      const v = await view(page);
      return Math.max(...v.vectors.filter((x) => x.visible === 'visible').map((x) => x.length));
    })
    .toBeLessThanOrEqual(80.001);
  const close = await view(page);
  for (const v of close.vectors.filter((x) => x.visible === 'visible')) {
    expect(v.start[0]).toBeCloseTo(close.point[0], 6);
    expect(v.start[1]).toBeCloseTo(close.point[1], 6);
    expect(v.length).toBeLessThanOrEqual(
      Math.min(80, Math.max(48, Math.min(close.box[2], close.box[3]) * 0.2)) + 0.001,
    );
  }
  const after = await world(page);
  after.vectors.flat().forEach((value, i) => {
    expect(value).toBeCloseTo(original.vectors.flat()[i], 10);
  });
  await page.screenshot({ path: info.outputPath('bounded-native-zoom.png') });
  await page.reload();
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  expect(
    Math.max(
      ...(await view(page)).vectors.filter((x) => x.visible === 'visible').map((x) => x.length),
    ),
  ).toBeLessThanOrEqual(80.001);
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByText('수식·구간 편집', { exact: true }).tap();
  const set = async (formulas: string[], at: string) => {
    for (const [i, name] of ['x(t)', 'y(t)', 'z(t)'].entries())
      await page.getByLabel(name, { exact: true }).fill(formulas[i]);
    await page.getByRole('textbox', { name: 't 값', exact: true }).fill(at);
    await page.getByRole('textbox', { name: 't 값', exact: true }).press('Enter');
    await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  };
  await set(['t', 't^2', 't^3/3'], '1');
  const cubic = await world(page);
  expect(cubic.p).toEqual([1, 1, 1 / 3]);
  for (let i = 0; i < 12; i++) await zoom.tap();
  expect(
    Math.max(
      ...(await view(page)).vectors.filter((x) => x.visible === 'visible').map((x) => x.length),
    ),
  ).toBeLessThanOrEqual(80.001);
  await set(['t', '2*t', '0'], '1');
  await expect(page.locator('.math-flat-scaffold [data-vector="N"]')).toHaveAttribute(
    'visibility',
    'hidden',
  );
  await expect(page.locator('.math-flat-scaffold [data-vector="B"]')).toHaveAttribute(
    'visibility',
    'hidden',
  );
  const tangent = (await world(page)).vectors[0].map((x) => x / 1.3);
  [1 / Math.sqrt(5), 2 / Math.sqrt(5), 0].forEach((value, i) => {
    expect(tangent[i]).toBeCloseTo(value, 10);
  });
  await set(['t^2', 't^3', '0'], '0');
  for (const name of ['T', 'N', 'B'])
    await expect(page.locator(`.math-flat-scaffold [data-vector="${name}"]`)).toHaveAttribute(
      'visibility',
      'hidden',
    );
  await set(['0.1*cos(t)', '0.1*sin(t)', 't/2'], '2*pi');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  for (let i = 0; i < 15; i++) await zoom.tap();
  const readAnnotations = () =>
    page.locator('.js-plotly-plot').evaluate((el) => {
      type Annotation = {
        text: string;
        ax: number;
        ay: number;
        visible: boolean;
        x: number;
        y: number;
        z: number;
        arrowside: string;
      };
      const plot = el as HTMLElement & { layout: { scene: { annotations: Annotation[] } } };
      return plot.layout.scene.annotations
        .filter((a) => /^[TNB]$/.test(a.text))
        .map((a) => ({
          name: a.text,
          length: Math.hypot(a.ax, a.ay),
          visible: a.visible,
          point: [a.x, a.y, a.z],
          start: a.arrowside,
        }));
    });
  await expect
    .poll(async () => Math.max(...(await readAnnotations()).map((a) => a.length)))
    .toBeLessThanOrEqual(80.001);
  const annotations = await readAnnotations();
  expect(annotations).toHaveLength(3);
  for (const a of annotations) {
    expect(a.start).toBe('start');
    expect(a.point[0]).toBeCloseTo(0.1, 10);
    expect(a.point[1]).toBeCloseTo(0, 10);
    expect(a.point[2]).toBeCloseTo(Math.PI, 10);
  }
  await page.screenshot({ path: info.outputPath('bounded-plotly-zoom.png') });
});
