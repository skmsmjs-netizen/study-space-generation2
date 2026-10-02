import { cleanup, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import { ObservatoryEvents } from './observatory-events';
import {
  OBSERVATORY_EVENTS,
  OBSERVATORY_SITUATIONS,
  observatoryEventParameters,
} from '../domain/observatory-events';
import { buildStudyLandscape } from '../domain/study-landscape';
import { createDemoState } from '../domain/fixtures';
import { observatorySkyAt, observatoryPreviewTime } from '../domain/observatory-time';
afterEach(cleanup);

it('gives all252 situations real, distinct geometry and keeps each active composition bounded', () => {
  const world = buildStudyLandscape(createDemoState(), undefined, 20727);
  const fingerprints = new Set<string>();
  for (const spec of OBSERVATORY_SITUATIONS) {
    const sky = observatorySkyAt(observatoryPreviewTime(spec.phase));
    const event = { spec, opacity: 1, ...observatoryEventParameters(world, spec) };
    const markup = renderToStaticMarkup(
      <svg aria-hidden="true">
        <ObservatoryEvents events={[event]} sky={sky} ground={spec.ground} />
      </svg>,
    );
    // Compare drawn path/transform data, deliberately ignoring IDs, names, color
    // and diagnostic attributes so renamed/color-only copies cannot pass.
    const drawing = [...markup.matchAll(/ (?:d|transform)="([^"]+)"/g)]
      .map((match) => match[1])
      .join('|');
    expect(drawing.length, spec.id).toBeGreaterThan(40);
    expect(fingerprints.has(drawing), spec.id).toBe(false);
    fingerprints.add(drawing);
    expect((markup.match(/data-event-instance=/g) ?? []).length, spec.id).toBe(spec.capacity);
    expect((markup.match(/<(?:g|path|use|defs)\b/g) ?? []).length, spec.id).toBeLessThanOrEqual(
      spec.variant ? 16 + spec.capacity * 3 : 2 + spec.capacity * 6,
    );
    expect(markup).toContain(`data-event-base="${spec.baseId}"`);
    expect(markup).toContain(`data-event-variant="${spec.variant}"`);
    if (spec.variant) {
      expect(markup).toContain('evt-variation-contour');
      expect(markup).toContain('evt-variation-detail');
    }
  }
  expect(fingerprints.size).toBe(252);
});

it.each(['valley-cloud', 'lunar-corona', 'aurora-fold', 'dew-web', 'meteor-fan', 'firefly-garden'])(
  'keeps the six %s variants visibly responsive to fractional engine output',
  (baseId) => {
    const base = buildStudyLandscape(createDemoState(), undefined, 20727);
    const world = {
      ...base,
      evolution: { ...base.evolution, position: 4.123, stage: 4 },
      dynamics: {
        recent: [0.35, 0.35, 0.35] as [number, number, number],
        background: [0.2, 0.2, 0.2] as [number, number, number],
        change: [0.15, 0.15, 0.15] as [number, number, number],
      },
    };
    const specs = OBSERVATORY_SITUATIONS.filter((spec) => spec.baseId === baseId && spec.variant);
    const sky = observatorySkyAt(observatoryPreviewTime(specs[0].phase));
    const eventsFor = (model: typeof world) =>
      specs.map((spec) => ({
        spec,
        opacity: 1,
        ...observatoryEventParameters(model, spec),
      }));
    const view = render(
      <svg aria-hidden="true">
        <ObservatoryEvents events={eventsFor(world)} sky={sky} ground={specs[0].ground} />
      </svg>,
    );
    const groups = Array.from(view.container.querySelectorAll('[data-observatory-event]'));
    expect(groups).toHaveLength(6);
    const before = groups.map((group) => ({
      style: group.getAttribute('style'),
      detail: group.querySelector('.evt-variation')?.getAttribute('style'),
      index: Math.floor(Number(group.getAttribute('data-event-population'))),
      opacity: Number(
        group
          .querySelector(
            `[data-event-instance="${Math.floor(Number(group.getAttribute('data-event-population')))}"]`,
          )
          ?.getAttribute('opacity'),
      ),
    }));
    const changed = {
      ...world,
      dynamics: {
        ...world.dynamics,
        recent: [0.350001, 0.350001, 0.350001] as [number, number, number],
      },
    };
    view.rerender(
      <svg aria-hidden="true">
        <ObservatoryEvents events={eventsFor(changed)} sky={sky} ground={specs[0].ground} />
      </svg>,
    );
    groups.forEach((group, index) => {
      expect(group.getAttribute('style')).not.toBe(before[index].style);
      expect(group.querySelector('.evt-variation')?.getAttribute('style')).not.toBe(
        before[index].detail,
      );
      expect(
        Number(
          group
            .querySelector(`[data-event-instance="${before[index].index}"]`)
            ?.getAttribute('opacity'),
        ),
      ).toBeGreaterThan(before[index].opacity);
    });
  },
);

it('renders all36 distinct motifs and binds a microscopic engine change to actual SVG populations and motion', () => {
  const base = buildStudyLandscape(createDemoState(), undefined, 20727);
  const world = {
    ...base,
    evolution: { ...base.evolution, position: 4.123, stage: 4 },
    dynamics: {
      recent: [0.35, 0.35, 0.35] as [number, number, number],
      background: [0.2, 0.2, 0.2] as [number, number, number],
      change: [0.15, 0.15, 0.15] as [number, number, number],
    },
  };
  const sky = observatorySkyAt(observatoryPreviewTime('night'));
  const events = OBSERVATORY_EVENTS.map((spec) => ({
    spec,
    opacity: 1,
    ...observatoryEventParameters(world, spec),
  }));
  const view = render(
    <svg aria-hidden="true">
      <ObservatoryEvents events={events} sky={sky} />
      <ObservatoryEvents events={events} sky={sky} ground />
    </svg>,
  );
  const groups = Array.from(view.container.querySelectorAll('[data-observatory-event]'));
  expect(groups).toHaveLength(36);
  const before = groups.map((node) => ({
    id: node.getAttribute('data-observatory-event'),
    population: node.getAttribute('data-event-population'),
    style: node.getAttribute('style'),
    next: Math.floor(Number(node.getAttribute('data-event-population'))),
    partial: Number(
      node
        .querySelector(
          `[data-event-instance="${Math.floor(Number(node.getAttribute('data-event-population')))}"]`,
        )
        ?.getAttribute('opacity'),
    ),
  }));
  for (const group of groups) expect(group.querySelector('path')).not.toBeNull();
  const changed = {
    ...world,
    dynamics: {
      ...world.dynamics,
      recent: [0.350001, 0.350001, 0.350001] as [number, number, number],
    },
  };
  const after = OBSERVATORY_EVENTS.map((spec) => ({
    spec,
    opacity: 1,
    ...observatoryEventParameters(changed, spec),
  }));
  view.rerender(
    <svg aria-hidden="true">
      <ObservatoryEvents events={after} sky={sky} />
      <ObservatoryEvents events={after} sky={sky} ground />
    </svg>,
  );
  groups.forEach((node, i) => {
    expect(node.getAttribute('data-observatory-event')).toBe(before[i].id);
    expect(node.getAttribute('data-event-population')).not.toBe(before[i].population);
    expect(node.getAttribute('style')).not.toBe(before[i].style);
    expect(
      Number(
        node.querySelector(`[data-event-instance="${before[i].next}"]`)?.getAttribute('opacity'),
      ),
    ).toBeGreaterThan(before[i].partial);
  });
});
