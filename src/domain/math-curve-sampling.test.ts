import { expect, it } from 'vitest';
import { buildScene, DEFAULT_SCENE } from './math-explorer';
import { continuationRange, sampleCurveWindow } from './math-curve-sampling';
it('extends both helix ends without changing the selected point or slider interval', () => {
  const result = buildScene(DEFAULT_SCENE),
    before = result.point?.slice();
  const view = {
    ranges: [
      [-40, 40],
      [-40, 40],
      [-40, 40],
    ] as Array<[number, number]>,
    pixelsPerUnit: 25,
  };
  const range = continuationRange(result.sample, [result.min, result.max], view);
  expect(range[0]).toBeLessThan(0);
  expect(range[1]).toBeGreaterThan(8 * Math.PI);
  const sampled = sampleCurveWindow(result.sample, range, view);
  expect(sampled.limited).toBe(false);
  expect(sampled.evaluations).toBeLessThanOrEqual(24000);
  const points = sampled.points.filter((p) => p !== null);
  expect(Math.min(...points.map((p) => p[2]))).toBeLessThan(-10);
  expect(Math.max(...points.map((p) => p[2]))).toBeGreaterThan(8 * Math.PI * 0.5);
  expect(result.point).toEqual(before);
  expect(result.min).toBe(0);
  expect(result.max).toBe(8 * Math.PI);
});
it('samples a moved function window and leaves its pole disconnected', () => {
  const result = buildScene({
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['1/(x-0.13)', '0', '0'],
  });
  const sampled = sampleCurveWindow(result.sample, [-20, 20], {
    ranges: [
      [-20, 20],
      [-10, 10],
    ],
    pixelsPerUnit: 40,
  });
  expect(sampled.limited).toBe(false);
  for (let i = 1; i < sampled.points.length; i++) {
    const a = sampled.points[i - 1],
      b = sampled.points[i];
    if (a && b) expect(a[0] < 0.13 && b[0] > 0.13).toBe(false);
  }
  const moved = sampleCurveWindow(result.sample, [30, 50], {
    ranges: [
      [30, 50],
      [-1, 1],
    ],
    pixelsPerUnit: 30,
  });
  expect(moved.points[0]?.[0]).toBe(30);
  expect(moved.points.at(-1)?.[0]).toBe(50);
});
it('does not fabricate values beyond sqrt domain and catches midpoint-aliased oscillation', () => {
  const sqrt = buildScene({
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['sqrt(x)', '0', '0'],
  });
  const sampled = sampleCurveWindow(sqrt.sample, [-8, 8], {
    ranges: [
      [-8, 8],
      [-8, 8],
    ],
    pixelsPerUnit: 20,
  });
  expect(sampled.points).toContain(null);
  expect(sampled.points.filter((p) => p !== null).every((p) => p[0] >= 0)).toBe(true);
  const wave = buildScene({
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['sin(128*x)', '0', '0'],
  });
  const high = sampleCurveWindow(wave.sample, [0, 2 * Math.PI], {
    ranges: [
      [0, 2 * Math.PI],
      [-2, 2],
    ],
    pixelsPerUnit: 10,
  });
  expect(
    Math.max(...high.points.filter((p) => p !== null).map((p) => Math.abs(p[1]))),
  ).toBeGreaterThan(0.8);
  expect(high.evaluations).toBeLessThanOrEqual(24001);
});

it('extends a far zoom and a tiny slider span, while avoiding redundant periodic laps', () => {
  const helix = buildScene(DEFAULT_SCENE);
  const far = {
    ranges: [
      [-20000, 20000],
      [-20000, 20000],
      [-20000, 20000],
    ] as Array<[number, number]>,
    pixelsPerUnit: 0.02,
  };
  const extended = continuationRange(helix.sample, [0, 0.01], far);
  expect(helix.sample(extended[0])![2]).toBeLessThan(-20000);
  expect(helix.sample(extended[1])![2]).toBeGreaterThan(20000);
  const circle = buildScene({ ...DEFAULT_SCENE, b: 0 });
  const periodic = continuationRange(circle.sample, [0, 8 * Math.PI], far);
  expect(periodic[1] - periodic[0]).toBeLessThanOrEqual(24 * Math.PI);
  const display = sampleCurveWindow(circle.sample, periodic, { ...far, pixelsPerUnit: 80 });
  expect(display.limited).toBe(false);
  expect(Math.max(...display.points.filter((p) => p !== null).map((p) => p[1]))).toBeGreaterThan(
    1.9,
  );
});
