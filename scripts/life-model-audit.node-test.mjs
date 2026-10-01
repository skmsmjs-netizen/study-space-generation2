// Isolated reference calculations for the review. Never imported by the application.
import { test } from 'node:test';
import assert from 'node:assert/strict';
const near = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
const advance = (x, minutes, tau, loading) =>
  loading ? 1 - (1 - x) * Math.exp(-minutes / tau) : x * Math.exp(-minutes / tau);
function score({
  sleep = null,
  wake = null,
  meal = null,
  care = null,
  study = null,
  rest = false,
  confirmed = true,
  goal = 120,
  target = 480,
}) {
  assert.ok(target > 0 && (rest || goal > 0));
  const qS = sleep === null ? null : Math.min(1, sleep / target);
  const qW = wake === null ? null : Math.max(0, 1 - Math.max(0, Math.abs(wake - 420) - 30) / 60);
  const kW = qS === null ? null : qS < 1 ? 0 : qW;
  const qL = rest || study === null ? null : Math.min(1, study / goal);
  const earned =
    20 * (qS ?? 0) + 5 * (kW ?? 0) + 25 * (meal ?? 0) + 25 * (care ?? 0) + 25 * (qL ?? 0);
  // Unknown stays unknown even where a gate makes its earned contribution zero.
  const complete =
    sleep !== null &&
    wake !== null &&
    meal !== null &&
    care !== null &&
    (rest || (study !== null && confirmed));
  const possible = rest ? 75 : 100;
  return { earned, possible, daily: complete ? (100 * earned) / possible : null };
}
function unionMinutes(intervals) {
  const sorted = intervals.map((pair) => pair.slice()).sort((a, b) => a[0] - b[0]);
  let total = 0,
    end = -Infinity;
  for (const [from, to] of sorted) {
    assert.ok(to >= from);
    total += Math.max(0, to - Math.max(from, end));
    end = Math.max(end, to);
  }
  return total;
}
test('specified partial-day example is 58.75; confirmation adds only the changed cell', () => {
  const input = { sleep: 360, wake: 480, meal: 0.5, care: 1, study: 30 };
  near(score(input).daily, 58.75);
  near(score({ ...input, study: 40 }).daily, 60.83333333333333);
  near(score({ ...input, study: 40 }).earned - score(input).earned, (25 * 10) / 120);
});
test('missing and unresolved information never becomes a daily zero or shrinks the denominator', () => {
  assert.equal(score({}).daily, null);
  const incomplete = score({ sleep: 480, meal: 1, care: 1, study: 120 });
  assert.equal(incomplete.daily, null);
  assert.equal(incomplete.earned, 95);
  assert.equal(incomplete.possible, 100);
  const open = score({ sleep: 360, wake: 480, meal: 0.5, care: 1, study: 30, confirmed: false });
  assert.equal(open.daily, null);
  near(open.earned, 58.75);
});
test('the sleep target gate has a five-point discontinuity', () => {
  const justBelow = score({ sleep: 479.999, wake: 420 }).earned;
  const atTarget = score({ sleep: 480, wake: 420 }).earned;
  near(atTarget - justBelow, 5 + (20 * 0.001) / 480);
});
test('equal-weight addition cannot encode non-compensable sleep protection', () => {
  const shortSleep = score({ sleep: 360, wake: 420, meal: 1, care: 1, study: 120 });
  const fullSleep = score({ sleep: 480, wake: 420, meal: 1, care: 0, study: 0 });
  near(shortSleep.daily, 90);
  near(fullSleep.daily, 50);
});
test('rest and study days can both be 100, with different earned amounts', () => {
  const common = { sleep: 480, wake: 420, meal: 1, care: 1 };
  assert.deepEqual(score({ ...common, rest: true }), { earned: 75, possible: 75, daily: 100 });
  assert.deepEqual(score({ ...common, study: 120 }), { earned: 100, possible: 100, daily: 100 });
});
test('over-target study does not earn more; adopted goals remain an explicit dependence', () => {
  const input = { sleep: 480, wake: 420, meal: 1, care: 1, study: 120 };
  assert.equal(score({ ...input, study: 1200 }).earned, score(input).earned);
  assert.ok(
    score({ ...input, study: 30, goal: 30 }).earned >
      score({ ...input, study: 30, goal: 120 }).earned,
  );
  assert.throws(() => score({ goal: 0 }));
});
test('interval unions preserve overlap after correction and ignore fragmentation', () => {
  assert.equal(
    unionMinutes([
      [0, 20],
      [10, 30],
    ]),
    30,
  );
  assert.equal(unionMinutes([[10, 30]]), 20);
  assert.equal(
    unionMinutes([
      [0, 10],
      [10, 20],
      [20, 30],
    ]),
    30,
  );
});
test('exponential propagation is invariant to splitting for constant input', () => {
  for (const loading of [true, false])
    for (const x of [0, 0.3, 1])
      for (const tau of [20, 90, 252, 1092]) {
        const whole = advance(x, 127, tau, loading);
        near(advance(advance(x, 30, tau, loading), 97, tau, loading), whole);
        assert.ok(whole >= 0 && whole <= 1);
      }
});
test('specified sleep cycle and readiness example reproduce numerically', () => {
  const a = Math.exp(-960 / 1092),
    b = Math.exp(-480 / 252);
  const wake = (b * (1 - a)) / (1 - a * b),
    bed = 1 - (1 - wake) * a;
  near(wake, 0.0927945123, 1e-10);
  near(bed, 0.6233757136, 1e-10);
  const sleep = advance(bed, 360, 252, false),
    current = advance(sleep, 120, 1092, true);
  near(100 * (1 - current) * 0.65 * 0.9, 44.58208094, 1e-7);
});
test('workload alternatives change the proposed block by more than ten minutes', () => {
  const block = (tau) => Math.min(25, tau * Math.log(0.65 / 0.5));
  near(block(90), 23.6127838, 1e-7);
  assert.ok(block(180) - block(45) > 10);
  near(20 * Math.log(0.5 / 0.25), 13.862943611198906);
});
test('unknown intervals widen a scenario rather than silently recovering it', () => {
  const low = advance(0.3, 60, 20, false),
    high = advance(0.3, 60, 90, true);
  assert.ok(low < 0.3 && high > 0.3);
  assert.ok(advance(0, 60, 20, false) === 0 && advance(1, 60, 90, true) === 1);
});
test('hazard example is highly dependent on its unvalidated base-rate assumption', () => {
  const probability = (factor) =>
    -Math.expm1(-25 * 0.002 * factor * Math.exp(0.4 + 2 * 0.3 + 0.5 * 0.25));
  near(probability(1), 0.142737, 1e-6);
  near(probability(0.25), 0.037771, 1e-6);
  near(probability(4), 0.459923, 1e-6);
});
