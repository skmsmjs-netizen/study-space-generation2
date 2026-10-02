import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { StatisticsPlot } from './statistics-plot';
import type { ChartFigure } from '../domain/statistics-charts';
const plot = vi.hoisted(() => ({
  react: vi.fn(async () => ({ on: vi.fn(), removeAllListeners: vi.fn() })),
  purge: vi.fn(),
  Plots: { resize: vi.fn() },
}));
vi.mock('plotly.js-dist-min', () => ({ default: plot }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it('redraws only selection styling without purging zoom, altering trace numbers or mutating the source model', async () => {
  const figure: ChartFigure = {
    kind: 'horizontal',
    title: '과목 비교',
    description: '원기록',
    columns: ['과목', '횟수'],
    layout: {},
    rows: [
      { label: '과목 A', values: [2], items: [] },
      { label: '과목 B', values: [4], items: [] },
    ],
    traces: [{ type: 'bar', orientation: 'h', x: [2, 4], y: ['과목 A', '과목 B'] }],
  };
  const before = structuredClone(figure);
  const view = render(<StatisticsPlot figure={figure} />);
  await waitFor(() => expect(plot.react).toHaveBeenCalledTimes(1));
  view.rerender(<StatisticsPlot figure={figure} selectedRows={[true, false]} />);
  await waitFor(() => expect(plot.react).toHaveBeenCalledTimes(2));
  const calls = plot.react.mock.calls as unknown as [
    unknown,
    Record<string, unknown>[],
    Record<string, unknown>,
  ][];
  expect(calls[1][1][0]).toMatchObject({
    x: [2, 4],
    y: ['과목 A', '과목 B'],
    marker: { opacity: [1, 0.25] },
  });
  expect(calls[1][2].uirevision).toBe(calls[0][2].uirevision);
  expect(plot.purge).not.toHaveBeenCalled();
  expect(figure).toEqual(before);
  view.rerender(<StatisticsPlot figure={figure} selectedRows={null} />);
  await waitFor(() => expect(plot.react).toHaveBeenCalledTimes(3));
  expect(calls[2][1][0].marker).toBeUndefined();
  expect(plot.purge).not.toHaveBeenCalled();
});
