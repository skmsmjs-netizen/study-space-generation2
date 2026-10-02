import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { buildStudyLandscape } from '../domain/study-landscape';
import { observatoryEvolution } from '../domain/observatory-evolution';
import {
  ObservatoryRadiance,
  ObservatoryRadianceGround,
  observatoryRadiance,
} from './observatory-radiance';

afterEach(cleanup);
const base = buildStudyLandscape(createDemoState(), undefined, 20727);
it('every one of twelve stages renders an upgraded star, with growing rays, halos and path lights', () => {
  const before = structuredClone(base);
  const signatures = new Set<string>();
  const view = render(<svg />);
  let previous = 0;
  for (let stage = 0; stage < 12; stage++) {
    const world = { ...base, evolution: observatoryEvolution(2 ** stage - 1) };
    view.rerender(
      <svg aria-hidden="true">
        <ObservatoryRadiance world={world} />
        <ObservatoryRadianceGround world={world} />
      </svg>,
    );
    const main = view.container.querySelector('[data-radiance-stage]')!;
    expect(main.getAttribute('data-radiance-stage')).toBe(String(stage));
    expect(main.querySelectorAll('[data-radiance-layer]')).toHaveLength(6);
    expect(main.querySelectorAll('[data-radiance-ray]')).toHaveLength(48);
    const lit = Array.from(main.querySelectorAll('[data-radiance-ray]')).filter(
      (el) => Number(el.getAttribute('opacity')) > 0,
    ).length;
    expect(lit).toBeGreaterThan(previous);
    previous = lit;
    signatures.add(
      `${main.getAttribute('style')}:${main.querySelector('[data-radiance-rays]')?.getAttribute('data-radiance-rays')}`,
    );
    expect(view.container.querySelector('[data-radiance-ground]')).not.toBeNull();
    const halo = Number(
      main.querySelector('[data-radiance-layer="halos"]')?.getAttribute('opacity'),
    );
    if (stage === 0) expect(halo).toBe(0);
    else expect(halo).toBeGreaterThan(0);
  }
  expect(signatures.size).toBe(12);
  expect(base).toEqual(before);
});

it('tiny changes within the same stage reach actual fractional ray opacity and motion/color variables', () => {
  const world = {
    ...base,
    evolution: { ...base.evolution, stage: 5, position: 5.125 },
    dynamics: {
      recent: [0.25, 0.25, 0.25] as [number, number, number],
      background: [0.2, 0.2, 0.2] as [number, number, number],
      change: [0.05, 0.05, 0.05] as [number, number, number],
    },
  };
  const after = {
    ...world,
    dynamics: {
      ...world.dynamics,
      recent: [0.250001, 0.250001, 0.250001] as [number, number, number],
    },
  };
  const p = observatoryRadiance(world),
    q = observatoryRadiance(after);
  for (const key of [
    'rays',
    'beacons',
    'spread',
    'brightness',
    'breath',
    'revolution',
    'warmth',
  ] as const)
    expect(q[key]).not.toBe(p[key]);
  const view = render(
    <svg aria-hidden="true">
      <ObservatoryRadiance world={world} />
    </svg>,
  );
  const next = Math.floor(p.rays);
  const ray = view.container.querySelector(`[data-radiance-ray="${next}"]`)!;
  const opacity = Number(ray.getAttribute('opacity'));
  const style = view.container.querySelector('[data-radiance-stage]')?.getAttribute('style');
  view.rerender(
    <svg aria-hidden="true">
      <ObservatoryRadiance world={after} />
    </svg>,
  );
  expect(Number(ray.getAttribute('opacity'))).toBeGreaterThan(opacity);
  expect(view.container.querySelector('[data-radiance-stage]')?.getAttribute('style')).not.toBe(
    style,
  );
});

it('empty, active and maximum-growth states remain bounded without loading timers or random progress', () => {
  for (const position of [0, 0.5, 5.25, 11])
    for (const value of [0, 0.5, 1]) {
      const world = {
        ...base,
        evolution: { ...base.evolution, position },
        dynamics: {
          recent: [value, value, value] as [number, number, number],
          background: [value, value, value] as [number, number, number],
          change: [0, 0, 0] as [number, number, number],
        },
      };
      const p = observatoryRadiance(world);
      expect(p.rays).toBeGreaterThanOrEqual(6);
      expect(p.rays).toBeLessThanOrEqual(48);
      expect(p.beacons).toBeGreaterThanOrEqual(2);
      expect(p.beacons).toBeLessThanOrEqual(12);
      expect(p.breath).toBeGreaterThanOrEqual(7);
      expect(p.revolution).toBeGreaterThanOrEqual(64);
      for (const value of Object.values(p)) expect(Number.isFinite(value)).toBe(true);
    }
});
