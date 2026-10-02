import { expect, it } from 'vitest';
import {
  observatoryCurl,
  observatoryLinearColor,
  observatoryLOD,
  observatoryWave,
} from './observatory-flow';

it('reveals nested detail continuously, including at the first growth stage', () => {
  expect(observatoryLOD(1)).toEqual([1, 0, 0]);
  expect(observatoryLOD(2.5)).toEqual([1, 1, 1]);
  for (const z of [1.12, 1.4, 1.65, 2, 2.3]) {
    const before = observatoryLOD(z),
      after = observatoryLOD(z + 0.00001);
    after.forEach((n, i) => {
      expect(n).toBeGreaterThanOrEqual(before[i]);
      expect(n - before[i]).toBeLessThan(0.0001);
    });
  }
});
it('the analytic curl field has negligible divergence and reacts to small activity changes', () => {
  const h = 0.001;
  for (const [x, y] of [
    [40, 90],
    [230, 150],
    [750, 250],
  ]) {
    const divergence =
      (observatoryCurl(x + h, y, 3, 0.4).x - observatoryCurl(x - h, y, 3, 0.4).x) / (2 * h) +
      (observatoryCurl(x, y + h, 3, 0.4).y - observatoryCurl(x, y - h, 3, 0.4).y) / (2 * h);
    expect(Math.abs(divergence)).toBeLessThan(0.000001);
    expect(observatoryCurl(x, y, 3, 0.40001)).not.toEqual(observatoryCurl(x, y, 3, 0.4));
  }
});
it('wave repeats at 28 seconds, empty strength is calm, and colors stay in gamut', () => {
  expect(observatoryWave(2, 1)).toEqual(observatoryWave(30, 1));
  expect(observatoryWave(2, 0).energy).toBe(0);
  expect(observatoryWave(10, 1).energy).toBe(0);
  observatoryLinearColor(0.78, 0.14, 38).forEach((c) => {
    expect(c).toBeGreaterThanOrEqual(0);
    expect(c).toBeLessThanOrEqual(1);
  });
  observatoryLinearColor(1, 0, 0).forEach((c) => expect(c).toBeCloseTo(1, 6));
});
