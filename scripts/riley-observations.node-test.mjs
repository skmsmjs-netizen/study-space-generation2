import test from 'node:test';
import assert from 'node:assert/strict';
import { RILEY_SCENES, observeRiley } from '../src/domain/riley-observations.ts';

const values = (kind, patch = {}) => ({
  ...Object.fromEntries(RILEY_SCENES[kind].fields.map((f) => [f.key, f.value])),
  ...patch,
});
const run = (kind, patch) => observeRiley(kind, values(kind, patch));
const near = (a, b, tol = 1e-10) => assert.ok(Math.abs(a - b) <= tol, `${a} differs from ${b}`);

test('all declared examples have finite results; malformed input is rejected', () => {
  for (const kind of Object.keys(RILEY_SCENES)) {
    const r = run(kind);
    assert.ok(r.values.length > 0, kind);
    for (const t of r.traces) for (const p of t.points) assert.ok(p.every(Number.isFinite), kind);
    const first = RILEY_SCENES[kind].fields[0];
    assert.equal(run(kind, { [first.key]: NaN }).condition, '위반');
    assert.equal(run(kind, { [first.key]: first.max + 1 }).condition, '위반');
  }
});
test('finite geometric sums survive infinite-series condition violation', () => {
  const r = run('geometric', { r: 1, n: 12 });
  assert.equal(r.condition, '위반');
  near(r.traces[0].points.at(-1)[1], 12);
  near(run('geometric', { r: -1, n: 12 }).traces[0].points.at(-1)[1], 0);
  near(run('geometric', { r: 0, n: 12 }).traces[0].points.at(-1)[1], 1);
  near(run('geometric', { r: 0.5, n: 12 }).traces[0].points.at(-1)[1], 2 * (1 - 2 ** -12));
});
test('Cartesian coordinates preserve complex modulus including the origin', () => {
  for (const theta of [-5, 0, Math.PI / 4, Math.PI]) {
    const [, [x, y]] = run('complex', { r: 2, theta }).traces[0].points;
    near(x * x + y * y, 4);
  }
  assert.match(run('complex', { r: 0 }).values[1], /편각 정의 불가/);
});
test('vector cross product orientation and matrix composition order', () => {
  assert.match(run('vectors', { a: 2, b: 3 }).values[1], /= 5$/);
  const r = run('matrix', { a: 2, b: 3 });
  // Input (1,0): B then A gives (3,3), A then B gives (2,2).
  assert.deepEqual(r.traces[1].points[0], [3, 3]);
  assert.deepEqual(r.traces[2].points[0], [2, 2]);
  assert.match(run('matrix', { a: 0 }).values[1], /특이/);
});
test('degenerate real symmetric example retains all eigen-directions', () => {
  assert.match(run('eigen', { b: 0 }).values[1], /모든 방향/);
  const r = run('eigen', { a: 2, b: 1 });
  assert.deepEqual(r.traces[0].points[1], [3, 3]);
  assert.deepEqual(r.traces[1].points[1], [1, -1]);
});
test('Fourier example is odd and has midpoint value at its jump', () => {
  const p = run('fourier', { n: 10 }).traces[1].points;
  near(p[320][1], 0, 1e-12);
  for (let i = 0; i < p.length; i++) near(p[i][1], -p[p.length - 1 - i][1], 1e-12);
});
test('three damping regimes satisfy initial value and differential equation to sampling accuracy', () => {
  for (const g of [0, 0.3, 1, 1.5]) {
    const p = run('ode', { g, w: 1 }).traces[0].points;
    near(p[0][1], 1);
    const h = p[1][0] - p[0][0];
    const i = 20;
    const dy = (p[i + 1][1] - p[i - 1][1]) / (2 * h),
      ddy = (p[i + 1][1] - 2 * p[i][1] + p[i - 1][1]) / (h * h);
    near(ddy + 2 * g * dy + p[i][1], 0, 0.008);
  }
  assert.match(run('ode', { g: 1, w: 1 }).values[1], /임계/);
  assert.equal(run('ode', { g: 1 + 1e-14, w: 1 }).values[1], '과도 감쇠');
  assert.equal(run('ode', { g: 1 - 1e-14, w: 1 }).values[1], '부족 감쇠');
});
test('wave and diffusion boundary values and different time behaviors', () => {
  const wave = run('wave', { t: 1, c: 1 }).traces[1].points;
  near(wave[80][1], -1);
  near(wave[0][1], 0);
  near(wave.at(-1)[1], 0);
  const diffusion = run('diffusion', { t: 1, d: 0.1 }).traces[1].points;
  near(diffusion[80][1], Math.exp(-(Math.PI ** 2) / 10));
  near(diffusion[0][1], 0);
  near(diffusion.at(-1)[1], 0);
});
test('variational family keeps endpoints; independently integrates the squared derivative', () => {
  const a = 0.4,
    p = run('variation', { a }).traces[1].points;
  near(p[0][1], 0);
  near(p.at(-1)[1], 1);
  // Midpoint integration of the analytic derivative is independent of the displayed closed form.
  let sum = 0;
  for (let i = 0; i < 2000; i++)
    sum += (1 + a * Math.PI * Math.cos((Math.PI * (i + 0.5)) / 2000)) ** 2 / 2000;
  near(sum, 1 + (a * a * Math.PI ** 2) / 2, 1e-12);
});
test('all 27 Levi-Civita components match the explicit permutation definition', () => {
  const positive = new Set(['123', '231', '312']),
    negative = new Set(['132', '321', '213']);
  for (let i = 1; i <= 3; i++)
    for (let j = 1; j <= 3; j++)
      for (let k = 1; k <= 3; k++) {
        const key = `${i}${j}${k}`,
          expected = positive.has(key) ? 1 : negative.has(key) ? -1 : 0;
        assert.equal(run('epsilon', { i, j, k }).values[1], `ϵijk = ${expected}`);
      }
});
test('Newton zero derivative is distinguished from existence of roots', () => {
  assert.equal(run('newton', { x: 0, n: 0 }).condition, '위반');
  assert.equal(run('newton', { x: 0, n: 5 }).traces[0].points.length, 1);
  near(run('newton', { x: 1, n: 2 }).traces[0].points.at(-1)[1], 17 / 12);
  near(run('newton', { x: -1, n: 8 }).traces[0].points.at(-1)[1], -Math.sqrt(2));
  const tiny = run('newton', { x: 1e-323, n: 5 });
  assert.equal(tiny.condition, '확인 전');
  assert.ok(tiny.traces[0].points.every((p) => p.every(Number.isFinite)));
  assert.equal(run('newton', { x: 1e-200, n: 1 }).condition, '확인 전');
});
test('cyclic group composition and inverse hold across all allowed orders', () => {
  for (let m = 2; m <= 8; m++)
    for (let k = 0; k < m; k++) {
      const r = run('cyclic', { m, k, l: (m - k) % m });
      assert.equal(r.values[1], '합성 = 0');
    }
});
test('Bayes zero denominator and posterior reference case', () => {
  assert.equal(run('bayes', { a: 0, b: 0 }).condition, '위반');
  assert.match(run('bayes').values[1], /0\.67/);
  assert.match(run('bayes', { p: 1, a: 0.5, b: 0.5 }).values[1], /= 1$/);
  assert.match(run('bayes', { p: 0, a: NaN, b: 0.5 }).values[1], /= 0$/);
  assert.match(run('bayes', { p: 1, a: 0.5, b: NaN }).values[1], /= 1$/);
  assert.equal(run('bayes', { p: 0, a: NaN, b: 0 }).condition, '위반');
});
test('binomial probability mass, moment and endpoint laws', () => {
  for (const n of [1, 10, 40])
    for (const p of [0, 0.001, 0.2, 0.5, 0.999, 1]) {
      const xs = run('binomial', { n, p }).traces[0].points;
      near(
        xs.reduce((s, [, v]) => s + v, 0),
        1,
        1e-12,
      );
      near(
        xs.reduce((s, [k, v]) => s + k * v, 0),
        n * p,
        1e-10,
      );
      near(
        xs.reduce((s, [k, v]) => s + (k - n * p) ** 2 * v, 0),
        n * p * (1 - p),
        1e-10,
      );
    }
});
test('sample variance normalization and least-squares independent normal-equation solution', () => {
  assert.equal(run('statistics').values[1], '기술 분산 N 분모 = 2');
  assert.equal(run('statistics').values[2], 'N−1 분모 = 2.5');
  assert.equal(run('statistics').condition, '확인 전');
  const r = run('least-squares', { a: 4 });
  assert.equal(r.values[0], '절편 α = 0.9, 기울기 β = 0.9');
  const ys = [1, 2, 2, 4],
    res = ys.map((y, x) => y - (0.9 + 0.9 * x));
  near(
    res.reduce((a, b) => a + b, 0),
    0,
  );
  near(
    res.reduce((s, v, x) => s + x * v, 0),
    0,
  );
});
