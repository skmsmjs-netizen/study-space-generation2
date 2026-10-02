import { describe, expect, it } from 'vitest';
import { OBSERVATORY_TIMES, observatoryPreviewTime, observatorySkyAt } from './observatory-time';
const at = (hour: number, minute = 0) => Date.UTC(2026, 9, 1, hour - 9, minute);
describe('decorative Korea clock', () => {
  it.each([
    [2, 59, 'late-night'],
    [3, 0, 'dawn'],
    [5, 59, 'dawn'],
    [6, 0, 'morning'],
    [9, 59, 'morning'],
    [10, 0, 'day'],
    [16, 59, 'day'],
    [17, 0, 'sunset'],
    [19, 59, 'sunset'],
    [20, 0, 'night'],
    [22, 59, 'night'],
    [23, 0, 'late-night'],
    [0, 0, 'late-night'],
  ])('selects %s:%s KST independently of the host timezone', (hour, minute, phase) => {
    expect(observatorySkyAt(at(Number(hour), Number(minute))).phase).toBe(phase);
  });
  it('keeps the same phase on consecutive dates and resolves each comparison instant', () => {
    for (const item of OBSERVATORY_TIMES) {
      const instant = observatoryPreviewTime(item.id);
      expect(observatorySkyAt(instant).phase).toBe(item.id);
      expect(observatorySkyAt(instant + 86400000)).toEqual(observatorySkyAt(instant));
    }
  });
  it('crossfades cyclically without jumps, unbounded light or more than two active scenes', () => {
    for (let minute = 0; minute < 1440; minute++) {
      const current = observatorySkyAt(at(0, minute));
      const next = observatorySkyAt(at(0, minute + 1));
      expect(current.weights.reduce((sum, weight) => sum + weight, 0)).toBeCloseTo(1, 12);
      expect(current.weights.filter((weight) => weight > 0).length).toBeLessThanOrEqual(2);
      expect(current.weights.every((weight) => weight >= 0 && weight <= 1)).toBe(true);
      expect(Math.abs(current.nightLight - next.nightLight)).toBeLessThan(0.021);
      expect(
        Math.max(...current.weights.map((weight, i) => Math.abs(weight - next.weights[i]))),
      ).toBeLessThan(0.038);
      expect(current.sun.x).toBeGreaterThanOrEqual(318);
      expect(current.sun.x).toBeLessThanOrEqual(676);
    }
  });
  it('handles negative timestamps and invalid reference input without NaN output', () => {
    for (const instant of [-1, -86400000, NaN, Infinity]) {
      const sky = observatorySkyAt(instant);
      expect(sky.minute).toBeGreaterThanOrEqual(0);
      expect(sky.minute).toBeLessThan(1440);
      expect(Number.isFinite(sky.nightLight)).toBe(true);
    }
  });
});
