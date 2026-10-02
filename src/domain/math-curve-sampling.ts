import type { Vec3 } from './math-explorer';

export type CurveSampler = (value: number) => Vec3 | null;
export type CurveWindow = { ranges: Array<[number, number]>; pixelsPerUnit: number };

/** Continue a formula, rather than changing the stored slider interval. */
export function continuationRange(
  sample: CurveSampler,
  range: [number, number],
  view: CurveWindow,
) {
  const inside = (p: Vec3 | null) =>
    p && p.every((v, i) => !view.ranges[i] || (v >= view.ranges[i][0] && v <= view.ranges[i][1]));
  const ends = range.slice() as [number, number];
  for (const direction of [-1, 1]) {
    const edge = direction < 0 ? 0 : 1;
    let at = range[edge],
      span = range[1] - range[0];
    // Bounded/periodic curves may never leave the viewing cube. Bound work,
    // not the mathematical domain; the window is reconsidered on view changes.
    for (let turn = 0; turn < 24; turn++) {
      const next = at + direction * span;
      ends[edge] = next;
      const visible = Array.from({ length: 17 }, (_, i) =>
        inside(sample(at + ((next - at) * i) / 16)),
      ).some(Boolean);
      if (!visible) break;
      // Stop redundant repeated laps. The non-dyadic probes avoid relying
      // only on endpoints/midpoints; this is a numerical heuristic, not proof.
      const repeated = [0.137, 0.373, 0.611, 0.877].every((fraction) => {
        const a = sample(at + direction * span * fraction);
        const b = sample(at + direction * span * (1 + fraction));
        return (
          a &&
          b &&
          a.every((v, i) => Math.abs(v - b[i]) <= 1e-9 * Math.max(1, Math.abs(v), Math.abs(b[i])))
        );
      });
      if (repeated) break;
      at = next;
      span *= 2;
    }
  }
  return ends;
}

/** Midpoint refinement with a strict evaluation budget and broken pole segments. */
export function sampleCurveWindow(
  sample: CurveSampler,
  range: [number, number],
  view: CurveWindow,
) {
  const points: Array<Vec3 | null> = [];
  let evaluations = 0,
    limited = false;
  const evaluate = (at: number) => {
    if (++evaluations > 24000) {
      limited = true;
      return null;
    }
    return sample(at);
  };
  const outside = (a: Vec3, b: Vec3, m: Vec3, q: Vec3) =>
    view.ranges.some(
      ([low, high], i) =>
        [a, b, m, q].every((p) => p[i] < low) || [a, b, m, q].every((p) => p[i] > high),
    );
  const append = (p: Vec3 | null) => {
    if (points.length < 12000) points.push(p);
    else limited = true;
  };
  const visit = (low: number, high: number, a: Vec3 | null, b: Vec3 | null, depth: number) => {
    if (limited) return;
    const mid = (low + high) / 2,
      m = evaluate(mid);
    // A second, non-dyadic probe catches periodic curves whose endpoints and
    // midpoint coincide. Finite samples still cannot prove all oscillations.
    const fraction = 0.38196601125,
      q = evaluate(low + (high - low) * fraction);
    const jump = a && b ? Math.hypot(...a.map((v, i) => v - b[i])) * view.pixelsPerUnit : Infinity;
    const error =
      a && b && m && q
        ? Math.max(
            Math.hypot(...m.map((v, i) => v - (a[i] + b[i]) / 2)),
            Math.hypot(...q.map((v, i) => v - a[i] * (1 - fraction) - b[i] * fraction)),
          ) * view.pixelsPerUnit
        : Infinity;
    if (a && b && m && q && outside(a, b, m, q)) {
      append(b);
      return;
    }
    if (!a && !b && !m && !q) {
      append(null);
      return;
    }
    if (depth < 12 && (error > 0.25 || jump > 8 || !a || !b || !m || !q)) {
      visit(low, mid, a, m, depth + 1);
      visit(mid, high, m, b, depth + 1);
      return;
    }
    // Never bridge an unresolved singularity with a fabricated line.
    if (!a || !b || !m || !q || (error > 8 && jump > 100)) append(null);
    append(b);
  };
  let at = range[0],
    a = evaluate(at);
  append(a);
  for (let i = 1; i <= 128 && !limited; i++) {
    const next = range[0] + ((range[1] - range[0]) * i) / 128,
      b = evaluate(next);
    visit(at, next, a, b, 0);
    at = next;
    a = b;
  }
  return { points, limited, evaluations, range };
}
