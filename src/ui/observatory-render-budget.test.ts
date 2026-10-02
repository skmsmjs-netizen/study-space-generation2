import { expect, it } from 'vitest';
import { observatoryRenderWidth, type ObservatoryRenderBudget } from './observatory-render-budget';

const width = (overrides: Partial<ObservatoryRenderBudget> = {}) =>
  observatoryRenderWidth({
    displayWidth: 640,
    pixelRatio: 1,
    zoom: 1,
    constrained: false,
    interacting: false,
    ...overrides,
  });

it('uses display density and size instead of imposing one resolution on every viewport', () => {
  expect(width({ displayWidth: 320 })).toBe(320);
  expect(width({ displayWidth: 320, pixelRatio: 2 })).toBe(640);
  expect(width({ displayWidth: 960, pixelRatio: 2 })).toBe(1280);
  expect(width({ displayWidth: 1 })).toBe(240);
  expect(width({ displayWidth: 100000, pixelRatio: 100 })).toBe(1280);
});

it('increases detail only after a lens settles and honors sustained frame pressure', () => {
  expect(width({ zoom: 2.45 })).toBe(960);
  expect(width({ zoom: 2.45, interacting: true })).toBe(400);
  expect(width({ zoom: 2.45, constrained: true })).toBe(400);
  expect(width({ displayWidth: 960, pixelRatio: 2, constrained: true })).toBe(400);
  expect(width({ displayWidth: 650 })).toBe(width({ displayWidth: 655 }));
});

it('keeps invalid measurements bounded and uses the existing fallback until layout is available', () => {
  expect(width({ displayWidth: 0, pixelRatio: 0, zoom: 0 })).toBe(640);
  expect(width({ displayWidth: NaN, pixelRatio: Infinity, zoom: -1 })).toBe(640);
  expect(width({ constrained: true })).toBe(400);
});
