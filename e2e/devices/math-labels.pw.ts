import { test, expect, type Page } from '@playwright/test';

async function letters(page: Page) {
  return page.locator('.math-flat-scaffold').evaluate((svg) => {
    const symbols = Array.from(
      svg.querySelectorAll<SVGForeignObjectElement>(
        '[data-axis-title], [data-axis-labels] .math-graph-symbol',
      ),
    ).filter(
      (node) =>
        node.getAttribute('visibility') !== 'hidden' &&
        (node.getAttribute('visibility') === 'visible' ||
          (node.closest('[data-axis-labels]')?.getAttribute('visibility') === 'visible' &&
            Number(node.closest('[data-axis-labels]')?.getAttribute('opacity')) > 0.98)),
    );
    return symbols.map((node) => {
      const glyph = node.querySelector('.katex-html .mord')?.getBoundingClientRect();
      const name =
        node.dataset.axisTitle ??
        node.closest('[data-axis-labels]')?.getAttribute('data-axis-labels');
      const axis = svg.querySelector(`[data-axis="${name}"]`);
      if (!axis) throw Error('Axis is missing');
      const bounds = svg.getBoundingClientRect(),
        box = (svg.getAttribute('viewBox') ?? '').split(/\s+/).map(Number);
      const a = [Number(axis.getAttribute('x1')), Number(axis.getAttribute('y1'))];
      const b = [Number(axis.getAttribute('x2')), Number(axis.getAttribute('y2'))];
      if (!glyph) throw Error('TeX glyph is missing');
      const corners = [
        [glyph.left, glyph.top],
        [glyph.right, glyph.top],
        [glyph.left, glyph.bottom],
        [glyph.right, glyph.bottom],
      ];
      const distance = corners.map(([x, y]) => {
        const p = [
          ((x - bounds.left) * box[2]) / bounds.width,
          ((y - bounds.top) * box[3]) / bounds.height,
        ];
        return (
          ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) /
          Math.hypot(b[0] - a[0], b[1] - a[1])
        );
      });
      return {
        name: node.dataset.axisTitle ?? node.dataset.tex,
        tex: node.dataset.tex,
        distance,
        inside:
          glyph.left >= bounds.left &&
          glyph.right <= bounds.right &&
          glyph.top >= bounds.top &&
          glyph.bottom <= bounds.bottom,
      };
    });
  });
}

test('math TeX symbols stay beside axes, colors separate and doubled ranges persist', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/math');
  const zoom = page.getByRole('button', { name: '＋ 확대', exact: true });
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  const slider = page.getByRole('slider', { name: '곡선 위 위치 t', exact: true });
  expect(Number(await slider.getAttribute('max'))).toBeCloseTo(8 * Math.PI, 12);
  for (const name of ['a', 'b']) {
    const variable = page.getByRole('slider', { name: `변수 ${name}`, exact: true });
    await expect(variable).toHaveAttribute('min', '-10');
    await expect(variable).toHaveAttribute('max', '10');
  }
  const input = page.getByRole('textbox', { name: 't 값', exact: true });
  await input.fill('2');
  await input.press('Enter');
  await page.getByRole('textbox', { name: 'a 값', exact: true }).fill('4');
  await page.getByRole('textbox', { name: 'a 값', exact: true }).press('Enter');
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  for (const name of ['T', 'N', 'B'])
    await expect(
      page.locator(`.math-flat-scaffold [data-tex="\\\\mathbf{${name}}"] .katex`),
    ).toHaveCount(1);
  const check = async () => {
    const values = await letters(page);
    expect(values.length).toBeGreaterThan(0);
    for (const value of values) {
      expect(value.tex).toBe(value.name);
      expect(value.inside).toBe(true);
      expect(Math.min(...value.distance.map(Math.abs))).toBeGreaterThan(3);
      expect(value.distance.every((v) => v > 0) || value.distance.every((v) => v < 0)).toBe(true);
    }
  };
  await check();
  const colors = await page.locator('.math-flat-scaffold').evaluate((svg) => ({
    curve: svg.querySelector('[data-curve]')?.getAttribute('stroke'),
    point: svg.querySelector('[data-current-point]')?.getAttribute('fill'),
    vectors: Array.from(svg.querySelectorAll('[data-vector]'), (n) => n.getAttribute('stroke')),
  }));
  expect(colors.point).toBe(colors.curve);
  expect(colors.vectors).toEqual(['#1d4ed8', '#15803d', '#b91c1c']);
  for (const axis of ['x', 'y', 'z'])
    await expect(page.locator(`[data-axis-foot="${axis}"]`)).toHaveAttribute(
      'stroke',
      colors.point ?? '',
    );
  await page.screenshot({ path: info.outputPath('latex-position.png') });
  for (let i = 0; i < 7; i++) await zoom.tap();
  await check();
  await page.screenshot({ path: info.outputPath('latex-close.png') });
  await page.reload();
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  await expect(input).toHaveValue('2.00');
  expect(Number(await slider.getAttribute('max'))).toBeCloseTo(8 * Math.PI, 12);
  await page.getByRole('button', { name: '보기 초기화', exact: true }).tap();
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  await expect(zoom).toBeEnabled({ timeout: 45000 });
  for (const name of ['x', 'y', 'z'])
    await expect(page.locator(`.math-plot [data-tex="${name}"] .katex`)).toHaveCount(1);
  for (const name of ['T', 'N', 'B'])
    await expect(page.locator(`.math-plot [data-tex="\\\\mathbf{${name}}"] .katex`)).toHaveCount(1);
  const checkPlotlyLabels = async () => {
    await expect
      .poll(async () => {
        const offsets = await page.locator('.math-plot').evaluate((host) =>
          Array.from(host.querySelectorAll<SVGTextElement>('text.annotation-text'), (text) => {
            const raw = text.textContent?.trim();
            const tex = /^[TNB]$/.test(raw ?? '') ? `\\mathbf{${raw}}` : raw;
            const label = Array.from(
              host.querySelectorAll<HTMLElement>('.math-plot-symbols [data-tex]'),
            ).find((node) => node.dataset.tex === tex);
            const a = text.getBoundingClientRect(),
              b = label?.getBoundingClientRect();
            return b
              ? Math.hypot(
                  a.left + a.width / 2 - b.left - b.width / 2,
                  a.top + a.height / 2 - b.top - b.height / 2,
                )
              : Infinity;
          }),
        );
        return offsets.length === 6 && Math.max(...offsets) < 2;
      })
      .toBe(true);
  };
  await checkPlotlyLabels();
  await page.screenshot({ path: info.outputPath('latex-plotly.png') });
  const tools = (await page.locator('.topbar details > summary').isVisible())
    ? page.locator('.topbar details')
    : page.locator('.sidebar .workspace-tools');
  await tools.locator('summary').click();
  await tools.getByLabel('화면 밝기', { exact: true }).selectOption('dark');
  await tools.locator('summary').click();
  const vectorColor = await page.locator('.math-legend .math-vector-B').evaluate(el => getComputedStyle(el).color);
  expect(vectorColor).not.toBe('rgba(0, 0, 0, 0)');
  await expect(
    page.locator('.math-plot [data-tex="\\\\mathbf{B}"] .math-graph-symbol-content'),
  ).toHaveCSS('color', 'rgb(254, 226, 226)');
  await checkPlotlyLabels();
  await page.locator('.math-plot').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('latex-dark.png') });
});
