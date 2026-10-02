import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { applyCommand } from '../domain/commands';
import { studyInputDay } from '../domain/daily-study-dynamics';
import { createDemoState } from '../domain/fixtures';
import { buildStudyLandscape, type StudyLandscape } from '../domain/study-landscape';
import { ObservatoryStudySky, ObservatoryStudyStation } from './observatory-reactivity';

afterEach(cleanup);
const referenceDay = studyInputDay('2026-10-02T03:00:00Z') ?? 0;

function recordedWorld(days: readonly number[]) {
  let data = createDemoState();
  for (const [index, daysAgo] of days.entries()) {
    data = applyCommand(data, {
      type: 'saveRecords',
      sessionId: `reactivity-${index}`,
      dateEvidence: { kind: 'unknown' },
      entries: [{ targetId: 'demo-topic-function', done: true }],
      userId: data.userId,
      namespace: data.namespace,
      at: new Date(Date.parse('2026-10-02T03:00:00Z') - daysAgo * 86400000).toISOString(),
      opId: `reactivity-${index}`,
    });
  }
  return { data, world: buildStudyLandscape(data, undefined, referenceDay) };
}
const scene = (world: StudyLandscape) => (
  <svg aria-hidden="true">
    <ObservatoryStudySky world={world} />
    <ObservatoryStudyStation world={world} />
  </svg>
);
function visibleResponse(container: HTMLElement) {
  const sky = container.querySelector('[data-study-sky]');
  const station = container.querySelector('[data-study-station]');
  const stars = Array.from(container.querySelectorAll('[data-study-star]')).map((star) =>
    Number(star.getAttribute('opacity')),
  );
  return {
    inputCount: Number(sky?.getAttribute('data-input-count')),
    glimmer: Number(sky?.getAttribute('data-early-glimmer')),
    density: Number(station?.getAttribute('data-density')),
    activity: Number(station?.getAttribute('data-activity')),
    wash: Number(container.querySelector('[data-study-wash]')?.getAttribute('opacity')),
    lamps: Number(container.querySelector('[data-study-lamps]')?.getAttribute('opacity')),
    period: parseFloat(
      (station as SVGElement | null)?.style.getPropertyValue('--obs-study-period') ?? '',
    ),
    stars,
    starLight: stars.reduce((sum, opacity) => sum + opacity, 0),
  };
}

it('adds actual sky details and station light on the first and second real canonical inputs', () => {
  const states = [recordedWorld([]), recordedWorld([0]), recordedWorld([0, 0])];
  const originals = structuredClone(states);
  const view = render(scene(states[0].world));
  const empty = visibleResponse(view.container);
  expect(empty.inputCount).toBe(0);
  expect(empty.starLight).toBe(0);
  expect(empty.wash).toBe(0);
  expect(empty.lamps).toBe(0);
  view.rerender(scene(states[1].world));
  const first = visibleResponse(view.container);
  view.rerender(scene(states[2].world));
  const second = visibleResponse(view.container);
  expect(first.inputCount).toBe(1);
  expect(second.inputCount).toBe(2);
  for (const key of ['starLight', 'wash', 'lamps', 'glimmer', 'density', 'activity'] as const) {
    expect(first[key]).toBeGreaterThan(empty[key]);
    expect(second[key]).toBeGreaterThan(first[key]);
  }
  expect(second.stars.some((opacity) => opacity > 0 && opacity < 1)).toBe(true);
  expect(second.wash).toBeLessThan(0.05);
  expect(second.lamps).toBeLessThan(0.5);
  expect(second.period).toBeLessThan(first.period);
  expect(view.container.querySelectorAll('[data-study-star] path')).toHaveLength(16);
  expect(view.container.querySelectorAll('[data-study-lamps] path').length).toBeGreaterThan(0);
  expect(states).toEqual(originals);
});

it('makes the station more active for equal totals concentrated in recent input days', () => {
  const spread = recordedWorld([10, 8, 6, 4, 2, 0]);
  const concentrated = recordedWorld([0, 0, 0, 0, 0, 0]);
  const view = render(scene(spread.world));
  const quiet = visibleResponse(view.container);
  view.rerender(scene(concentrated.world));
  const lively = visibleResponse(view.container);
  expect(lively.inputCount).toBe(quiet.inputCount);
  expect(lively.starLight).toBe(quiet.starLight);
  expect(lively.wash).toBe(quiet.wash);
  expect(lively.density).toBeGreaterThan(quiet.density);
  expect(lively.lamps).toBeGreaterThan(quiet.lamps);
  expect(lively.period).toBeLessThan(quiet.period);
});

it('retains the early sky details during quiet calendar gaps and bounds high-density drawing', () => {
  const initial = recordedWorld([0, 0]);
  const view = render(scene(initial.world));
  const fresh = visibleResponse(view.container);
  view.rerender(scene(buildStudyLandscape(initial.data, undefined, referenceDay + 90)));
  const later = visibleResponse(view.container);
  expect(later.starLight).toBe(fresh.starLight);
  expect(later.wash).toBe(fresh.wash);
  expect(later.lamps).toBeGreaterThan(0);
  expect(later.lamps).toBeLessThan(fresh.lamps);
  view.rerender(scene(recordedWorld(Array.from({ length: 48 }, () => 0)).world));
  const dense = visibleResponse(view.container);
  expect(dense.inputCount).toBe(48);
  expect(dense.stars).toHaveLength(8);
  expect(dense.stars.every((opacity) => opacity >= 0 && opacity <= 1)).toBe(true);
  expect(dense.lamps).toBeLessThanOrEqual(1);
  expect(dense.period).toBeGreaterThanOrEqual(9);
  expect(view.container.querySelectorAll('*').length).toBeLessThan(60);
  expect(view.container.innerHTML).not.toContain('NaN');
});
