import { describe, expect, it } from 'vitest';
import {
  OBSERVATORY_EVENTS,
  OBSERVATORY_SITUATIONS,
  buildObservatoryEvents,
  observatoryEventParameters,
  observatoryParticleOpacity,
} from './observatory-events';
import { OBSERVATORY_TIMES, observatoryPreviewTime } from './observatory-time';
import { buildStudyLandscape } from './study-landscape';
import { createDemoState } from './fixtures';
const world = buildStudyLandscape(createDemoState(), undefined, 20727);
describe('252 additive situations and continuous engine correspondence', () => {
  it('preserves the 36 originals and adds six uniquely named children to every family', () => {
    expect(OBSERVATORY_EVENTS).toHaveLength(36);
    expect(new Set(OBSERVATORY_EVENTS.map((event) => event.id)).size).toBe(36);
    expect(OBSERVATORY_SITUATIONS).toHaveLength(252);
    expect(new Set(OBSERVATORY_SITUATIONS.map((event) => event.id)).size).toBe(252);
    for (const base of OBSERVATORY_EVENTS) {
      const family = OBSERVATORY_SITUATIONS.filter((event) => event.baseId === base.id);
      expect(family).toHaveLength(7);
      expect(family[0]).toBe(base);
      expect(family.map((event) => event.variant)).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(new Set(family.map((event) => event.name)).size).toBe(7);
      expect(base.id).toBe(base.baseId);
      expect(family.slice(1).map((event) => event.id)).toEqual(
        [1, 2, 3, 4, 5, 6].map((variant) => `${base.id}--${variant}`),
      );
      expect(
        family.every((event) => event.channel === base.channel && event.phase === base.phase),
      ).toBe(true);
    }
    for (const time of OBSERVATORY_TIMES) {
      expect(OBSERVATORY_EVENTS.filter((event) => event.phase === time.id)).toHaveLength(6);
      expect(OBSERVATORY_SITUATIONS.filter((event) => event.phase === time.id)).toHaveLength(42);
    }
  });
  it('reproduces each explicit comparison without adding or changing study evidence', () => {
    const before = structuredClone(world);
    for (const time of OBSERVATORY_TIMES)
      for (let variant = 0; variant < 6; variant++) {
        const events = buildObservatoryEvents(
          world,
          observatoryPreviewTime(time.id),
          'owner',
          variant,
        );
        expect(events).toHaveLength(1);
        expect(events[0].spec.id).toBe(
          OBSERVATORY_EVENTS.filter((event) => event.phase === time.id)[variant].id,
        );
      }
    expect(world).toEqual(before);
  });
  it('previews every original and child exactly while leaving the input world untouched', () => {
    const before = structuredClone(world);
    for (const time of OBSERVATORY_TIMES) {
      const originals = OBSERVATORY_EVENTS.filter((event) => event.phase === time.id);
      for (let base = 0; base < 6; base++)
        for (let variant = 0; variant <= 6; variant++) {
          const events = buildObservatoryEvents(
            world,
            observatoryPreviewTime(time.id),
            'owner',
            base,
            variant,
          );
          expect(events).toHaveLength(1);
          expect(events[0].spec.id).toBe(
            variant === 0 ? originals[base].id : `${originals[base].id}--${variant}`,
          );
          expect(events[0].spec.variant).toBe(variant);
        }
    }
    expect(world).toEqual(before);
  });
  it('uses a repeatable shuffled bag with no omission or immediate repetition in its first six slots', () => {
    for (const time of OBSERVATORY_TIMES) {
      const start = Date.UTC(2026, 9, 1, -9) + time.start * 60000 + 21 * 60000;
      const ids = Array.from(
        { length: 6 },
        (_, slot) =>
          buildObservatoryEvents(world, start + slot * 30 * 60000, 'one').find(
            (event) => event.spec.phase === time.id,
          )?.spec.baseId,
      );
      expect(ids).not.toContain(undefined);
      expect(new Set(ids).size).toBe(6);
      expect(buildObservatoryEvents(world, start, 'one')).toEqual(
        buildObservatoryEvents(world, start, 'one'),
      );
      expect(buildObservatoryEvents(world, start, 'one').map((e) => e.spec.id)).toEqual(
        buildObservatoryEvents(world, start + 1000, 'one').map((e) => e.spec.id),
      );
    }
  });
  it('reaches all 252 scenes in a seven-day bag including every original', () => {
    const observed = new Set<string>();
    const startingDay = Math.floor(20727 / 7) * 7;
    for (let day = startingDay; day < startingDay + 7; day++)
      for (const time of OBSERVATORY_TIMES)
        for (let slot = 0; slot < 6; slot++) {
          const instant = day * 86400000 - 9 * 3600000 + (time.start + 21 + slot * 30) * 60000;
          const event = buildObservatoryEvents(world, instant, 'one').find(
            (item) => item.spec.phase === time.id,
          );
          if (!event) throw new Error(`Missing ${time.id} situation in slot ${slot} on day ${day}`);
          observed.add(event.spec.id);
        }
    expect(observed.size).toBe(252);
    expect([...observed].sort()).toEqual(OBSERVATORY_SITUATIONS.map((event) => event.id).sort());
  });
  it('keeps the incoming child identity when both ordinary slots and six-slot bags finish fading', () => {
    const start = Date.parse('2026-10-01T01:00:00Z'); // KST daytime starts at 10:00.
    for (let slot = 0; slot < 12; slot++) {
      const fading = buildObservatoryEvents(world, start + (slot * 30 + 29) * 60000, 'one');
      const arrived = buildObservatoryEvents(world, start + (slot * 30 + 30) * 60000, 'one');
      expect(fading).toHaveLength(2);
      expect(arrived).toHaveLength(1);
      expect(fading[1].spec.id).toBe(arrived[0].spec.id);
      expect(fading[0].spec.baseId).not.toBe(fading[1].spec.baseId);
      expect(fading[0].opacity).toBeCloseTo(0.5);
      expect(fading[1].opacity).toBeCloseTo(0.5);
    }
  });
  it('does not reshuffle the late-night occurrence at midnight, reload or record edits', () => {
    const a = Date.parse('2026-10-01T14:59:00Z'),
      b = a + 60000;
    const atA = buildObservatoryEvents(world, a, 'one'),
      atB = buildObservatoryEvents(world, b, 'one');
    expect(atB[0].spec.id).toBe(atA.at(-1)?.spec.id);
    const changed = { ...world, evolution: { ...world.evolution, position: 0.01 } };
    expect(buildObservatoryEvents(changed, b, 'one').map((e) => e.spec.id)).toEqual(
      atB.map((e) => e.spec.id),
    );
  });
  it('all252 parameter sets respond to a tiny engine delta without a stage change or integer rounding', () => {
    for (const spec of OBSERVATORY_SITUATIONS) {
      const baseline = {
        ...world,
        evolution: { ...world.evolution, position: 4.123, stage: 4 },
        dynamics: {
          recent: [0.35, 0.35, 0.35] as [number, number, number],
          background: [0.2, 0.2, 0.2] as [number, number, number],
          change: [0.15, 0.15, 0.15] as [number, number, number],
        },
      };
      const perturbed = {
        ...baseline,
        dynamics: {
          ...baseline.dynamics,
          recent: [0.350001, 0.350001, 0.350001] as [number, number, number],
        },
      };
      const before = observatoryEventParameters(baseline, spec),
        after = observatoryEventParameters(perturbed, spec);
      for (const field of ['population', 'brightness', 'amplitude', 'duration', 'chroma'] as const)
        expect(after[field]).not.toBe(before[field]);
      const index = Math.floor(before.population);
      expect(observatoryParticleOpacity(after.population, index)).toBeGreaterThan(
        observatoryParticleOpacity(before.population, index),
      );
      expect(Math.abs(after.population - before.population)).toBeLessThan(0.00002);
      const moreGrowth = observatoryEventParameters(
        { ...baseline, evolution: { ...baseline.evolution, position: 4.123001 } },
        spec,
      );
      expect(moreGrowth.population).toBeGreaterThan(before.population);
    }
  });
  it('retains bounded finite outputs and at most three blended events around every minute boundary', () => {
    for (let minute = 0; minute < 1440; minute++) {
      const events = buildObservatoryEvents(world, Date.UTC(2026, 9, 1, -9, minute), 'one');
      expect(events.length).toBeLessThanOrEqual(3);
      expect(events.reduce((sum, event) => sum + event.opacity, 0)).toBeCloseTo(1, 12);
      for (const event of events) {
        expect(event.population).toBeGreaterThanOrEqual(2);
        expect(event.population).toBeLessThanOrEqual(event.spec.capacity);
        expect(event.duration).toBeGreaterThan(10);
      }
    }
  });
  it('ignores invalid preview indexes and safely handles non-finite cosmetic clock inputs', () => {
    const instant = observatoryPreviewTime('night');
    const automatic = buildObservatoryEvents(world, instant, 'owner');
    for (const invalid of [-1, 7, 0.5, NaN, Infinity]) {
      expect(buildObservatoryEvents(world, instant, 'owner', invalid, invalid)).toEqual(automatic);
      expect(buildObservatoryEvents(world, instant, 'owner', 2, invalid)[0].spec.variant).toBe(0);
    }
    for (const invalid of [NaN, Infinity, -Infinity])
      expect(buildObservatoryEvents(world, invalid, 'owner')).toEqual(
        buildObservatoryEvents(world, 0, 'owner'),
      );
  });
});
