import { expect, it } from 'vitest';
import {
  buildTemplate,
  defaultTemplate,
  importTemplates,
  isMathTemplate,
  isTemplateView,
  readTemplate,
  templateBody,
  TEMPLATE_KINDS,
  surfaceMesh,
} from './math-templates';

it('every declared type has a valid executable adapter or a deliberate reading/data frame', () => {
  expect(TEMPLATE_KINDS).toHaveLength(14);
  for (const kind of TEMPLATE_KINDS) {
    const item = defaultTemplate(kind);
    expect(isMathTemplate(item)).toBe(true);
    expect(() => buildTemplate(item)).not.toThrow();
    expect(readTemplate(templateBody(item))).toEqual(item);
  }
});
it('point focus preserves the previous camera through content save and restore', () => {
  const item = defaultTemplate('curve');
  item.notes = '현재 관찰 메모\n원문 유지';
  item.view = {
    camera: {
      eye: { x: 0.3, y: -0.2, z: 0.4 },
      center: { x: 0.1, y: 0.2, z: 0.3 },
      up: { x: 0, y: 0, z: 1 },
    },
    pointFocus: {
      returnCamera: {
        eye: { x: 1.4, y: -1.5, z: 1.2 },
        center: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 0, z: 1 },
      },
    },
  };
  expect(isTemplateView(item.view)).toBe(true);
  expect(readTemplate(templateBody(item))).toEqual(item);
  expect(importTemplates(JSON.stringify(item))[0]).toEqual(item);

  // Existing views without a focus mode, including partial Plotly cameras, stay valid.
  item.view = { camera: { eye: { x: 1, y: -1, z: 1 } }, alternate: false };
  expect(readTemplate(templateBody(item))).toEqual(item);
  expect(isTemplateView({ camera: {} })).toBe(true);
});
it('rejects malformed point focus and uses the same finite camera bounds for both cameras', () => {
  const item = defaultTemplate('curve');
  for (const pointFocus of [null, [], true, 1, 'focus', {}, { returnCamera: undefined }]) {
    expect(isTemplateView({ pointFocus })).toBe(false);
    expect(isMathTemplate({ ...item, view: { pointFocus } })).toBe(false);
  }
  for (const camera of [
    null,
    [],
    true,
    1,
    'camera',
    { eye: null },
    { eye: [] },
    { center: { x: 0, y: 0 } },
    { up: { x: 0, y: '0', z: 1 } },
    { eye: { x: Number.NaN, y: 0, z: 1 } },
    { eye: { x: Number.POSITIVE_INFINITY, y: 0, z: 1 } },
    { center: { x: 1e6, y: 0, z: 0 } },
  ]) {
    expect(isTemplateView({ camera })).toBe(false);
    expect(isTemplateView({ pointFocus: { returnCamera: camera } })).toBe(false);
    expect(() =>
      importTemplates(JSON.stringify({ ...item, view: { pointFocus: { returnCamera: camera } } })),
    ).toThrow();
  }
  expect(isTemplateView([])).toBe(false);
});
it('surface grids follow both coordinate families and preserve undefined holes', () => {
  const item = defaultTemplate('surface');
  const mesh = surfaceMesh(buildTemplate(item).surface!);
  expect(mesh).toHaveLength(42);
  for (const line of mesh) {
    expect(line.points).toHaveLength(81);
    for (const p of line.points) if (p) expect(p[2]).toBeCloseTo(p[0] ** 2 - p[1] ** 2, 12);
  }
  item.expressions = ['sqrt(x)'];
  const holes = surfaceMesh(buildTemplate(item).surface!);
  expect(holes.some((line) => line.points.includes(null))).toBe(true);
  expect(
    holes
      .flatMap((line) => line.points)
      .filter((p) => p)
      .every((p) => p![0] >= 0),
  ).toBe(true);
  const torus = surfaceMesh(buildTemplate(defaultTemplate('parametric-surface')).surface!);
  for (const line of torus)
    for (const p of line.points)
      if (p) expect((Math.hypot(p[0], p[1]) - 1) ** 2 + p[2] ** 2).toBeCloseTo(0.25, 12);
});
it('surface and implicit adapters keep coordinates, values and equation residuals distinct', () => {
  const surface = defaultTemplate('surface');
  surface.cursor = { x: 2, y: 1 };
  expect(buildTemplate(surface).point).toEqual([2, 1, 3]);
  const implicit = defaultTemplate('implicit');
  implicit.cursor = { x: 2, y: 0 };
  const out = buildTemplate(implicit);
  expect(out.contour?.zero).toBe(true);
  expect(out.readouts.find((v) => v.label.includes('잔차'))?.value).toBe('0.00');
  implicit.cursor = { x: 0, y: 0 };
  expect(buildTemplate(implicit).readouts.find((v) => v.label.includes('잔차'))?.value).toBe(
    '-4.00',
  );
  const sphere = defaultTemplate('implicit3d');
  sphere.cursor = { x: 0, y: 0, z: 2 };
  expect(buildTemplate(sphere).volume?.x).toHaveLength(25 ** 3);
  const parametric = defaultTemplate('parametric-surface');
  parametric.cursor = { u: 0, v: 0 };
  expect(buildTemplate(parametric).point).toEqual([1.5, 0, 0]);
  const missing = defaultTemplate('surface');
  missing.expressions = ['sqrt(x)'];
  expect(buildTemplate(missing).surface?.z.some((row) => row.includes(null))).toBe(true);
});
it('field magnitudes and matrix transformations match independent analytic values', () => {
  const field = defaultTemplate('field');
  field.cursor = { x: 2, y: 3 };
  const vector = buildTemplate(field);
  vector.arrows
    ?.find((v) => v.at.every((n) => n === 0))
    ?.vector.forEach((v) => {
      expect(v).toBeCloseTo(0);
    });
  expect(vector.readouts.find((v) => v.label === '실제 크기')?.value).toBe(
    Math.sqrt(13).toFixed(2),
  );
  const matrix = defaultTemplate('matrix');
  matrix.parameters[0].value = 2;
  matrix.parameters[1].value = 0;
  matrix.cursor = { x: 1, y: 2 };
  expect(buildTemplate(matrix).point).toEqual([2, 4, 0]);
  expect(buildTemplate(matrix).readouts.find((v) => v.label.includes('det'))?.value).toBe('4.00');
});
it('RK4 matches analytic exponential and harmonic oscillator initial-value solutions', () => {
  const scalar = defaultTemplate('ode');
  scalar.expressions = ['y'];
  scalar.ranges = { t: [0, 1] };
  scalar.cursor = { t: 1 };
  scalar.initial = [1];
  expect(buildTemplate(scalar).point?.[1]).toBeCloseTo(Math.E, 10);
  const system = defaultTemplate('ode-system');
  system.expressions = ['y', '-x'];
  system.ranges = { t: [0, Math.PI / 2] };
  system.cursor = { t: Math.PI / 2 };
  const point = buildTemplate(system).point!;
  expect(point[0]).toBeCloseTo(0, 10);
  expect(point[1]).toBeCloseTo(-1, 10);
});
it('undefined ODE steps stop and undefined sequence terms never become invented sums', () => {
  const ode = defaultTemplate('ode');
  ode.expressions = ['sqrt(y)'];
  ode.initial = [-1];
  expect(buildTemplate(ode).lines[0].points).toHaveLength(1);
  expect(buildTemplate(ode).notices.join(' ')).toContain('멈췄');
  const series = defaultTemplate('sequence');
  series.ranges = { n: [1, 3] };
  series.cursor = { n: 3 };
  expect(buildTemplate(series).lines[1].points[2]?.[1]).toBeCloseTo(11 / 6);
  series.expressions = ['1/(n-2)'];
  expect(buildTemplate(series).lines[1].points).toEqual([[1, -1, 0], null, null]);
  series.ranges = { n: [1, 1001] };
  expect(() => buildTemplate(series)).toThrow('1000항');
});
it('custom parameters reuse curves without modifying the stored expression source', () => {
  const item = defaultTemplate('curve');
  item.expressions = ['c*cos(t)', 'c*sin(t)', 'b*t'];
  item.parameters.push({ symbol: 'c', label: '반지름', min: 0.1, max: 10, value: 3 });
  item.cursor = { t: 0 };
  expect(buildTemplate(item).point).toEqual([3, 0, 0]);
  expect(item.expressions[0]).toBe('c*cos(t)');
});
it('unsupported kinds, namespace tricks and executable expression trees are rejected atomically', () => {
  const item = defaultTemplate('surface');
  for (const kind of ['toString', 'constructor', 'unknown'])
    expect(isMathTemplate({ ...item, kind })).toBe(false);
  for (const source of ['a=1', 'import("x")', 'x.constructor', '[1,2]', 'evaluate("x")', 't+x']) {
    const altered = { ...item, expressions: [source] };
    expect(() => buildTemplate(altered)).toThrow();
    expect(() => importTemplates(JSON.stringify([item, altered]))).toThrow();
  }
  expect(
    isMathTemplate({
      ...item,
      parameters: [{ symbol: 'constructor', label: 'x', min: 0, max: 10, value: 2 }],
    }),
  ).toBe(false);
});
it('content preserves conditions, units, prose, LaTeX, original IDs and provided data only', () => {
  const item = {
    ...defaultTemplate('formula'),
    subject: '전자기학',
    notes: '  원문\n수정 이유 ',
    conditions: ['정상 상태', '진공'],
    quantities: [{ symbol: 'E', name: '전기장', unit: 'V/m' }],
    sections: [
      {
        id: 'gauss',
        title: '가우스 법칙',
        body: '원문\n예외',
        tex: '\\nabla\\cdot\\mathbf E=\\rho/\\varepsilon_0',
      },
    ],
  };
  expect(importTemplates(JSON.stringify(item))[0]).toEqual(item);
  const data = defaultTemplate('data');
  expect(buildTemplate(data).lines[0].points).toEqual([]);
  data.dataset!.points = [
    [2, 5],
    [1, 9],
  ];
  data.datasetInput = '2, 5\n1, 9\n잘못 입력한 값';
  expect(readTemplate(templateBody(data))?.datasetInput).toBe(data.datasetInput);
  expect(buildTemplate(data).lines[0].points).toEqual([
    [2, 5, 0],
    [1, 9, 0],
  ]);
});
