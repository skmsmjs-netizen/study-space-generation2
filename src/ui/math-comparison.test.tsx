import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { buildScene, DEFAULT_SCENE, type MathScene } from '../domain/math-explorer';
import { MathComparison } from './math-comparison';
import {
  comparisonBounds,
  comparisonCoordinates,
  comparisonPath,
  comparisonSnapshot,
} from './math-comparison-model';
import { mathComparisonKey } from '../data/math-comparison';
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});
const original: MathScene = {
  ...DEFAULT_SCENE,
  mode: 'function',
  expressions: ['a*x', '', ''],
  a: 2,
  min: '-2',
  max: '2',
  position: 0.75,
  notes: '  원문\n조건·예외',
  title: '보존할 장면',
};
const props = (scene = original) => ({ ownerKey: 'owner-a', scene, result: buildScene(scene) });
it('pins A, updates only B, uses one shared geometry scale and restores A in its owner tab state', () => {
  const before = structuredClone(original),
    a = buildScene(original);
  const view = render(<MathComparison {...props()} />);
  fireEvent.click(screen.getByRole('button', { name: '현재 조건을 A로 고정' }));
  const b = { ...original, a: 4 };
  view.rerender(<MathComparison {...props(b)} />);
  const row = screen.getByRole('row', { name: '매개값 a 2 4' });
  expect(within(row).getByText('2')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /조건 A 점선과 B 실선/ })).toBeInTheDocument();
  expect(original).toEqual(before);
  const fitted = comparisonBounds([a.points, buildScene(b).points], 'xy');
  const o = comparisonCoordinates([0, 0, 0], 'xy', fitted),
    x = comparisonCoordinates([1, 0, 0], 'xy', fitted),
    y = comparisonCoordinates([0, 1, 0], 'xy', fitted);
  expect(x[0] - o[0]).toBeCloseTo(o[1] - y[1]);
  fireEvent.click(screen.getByRole('button', { name: '비교 그래프 확대' }));
  expect(screen.getByText(/축 범위를 고정했습니다/)).toBeInTheDocument();
  view.unmount();
  const reopened = render(<MathComparison {...props(b)} />);
  expect(screen.getByRole('row', { name: '매개값 a 2 4' })).toBeInTheDocument();
  reopened.unmount();
  render(<MathComparison {...props(b)} ownerKey="owner-b" />);
  expect(screen.queryByRole('table')).toBeNull();
  expect(comparisonSnapshot(original)).toMatchObject({ title: '', notes: '' });
});
it('preserves A through invalid B and incompatible modes, and clears only the separate comparison', () => {
  const view = render(<MathComparison {...props()} />);
  fireEvent.click(screen.getByRole('button', { name: '현재 조건을 A로 고정' }));
  view.rerender(<MathComparison {...props()} result={null} />);
  expect(screen.getByText('현재 수식을 고치면 비교를 이어갑니다.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '현재 조건으로 A 다시 고정' })).toBeDisabled();
  view.rerender(<MathComparison {...props(DEFAULT_SCENE)} />);
  expect(screen.getByText(/축의 뜻이 달라 겹치지 않습니다/)).toBeInTheDocument();
  expect(screen.queryByRole('img')).toBeNull();
  sessionStorage.setItem('original-draft', '원문');
  fireEvent.click(screen.getByRole('button', { name: '비교 종료' }));
  expect(sessionStorage.getItem(mathComparisonKey('owner-a'))).toBeNull();
  expect(sessionStorage.getItem('original-draft')).toBe('원문');
});
it('keeps broken stored comparison bytes until explicit reset and keeps A on remove failure', () => {
  const key = mathComparisonKey('owner-a');
  sessionStorage.setItem(key, '{original broken');
  render(<MathComparison {...props()} />);
  expect(screen.getByRole('button', { name: '현재 조건을 A로 고정' })).toBeDisabled();
  expect(sessionStorage.getItem(key)).toBe('{original broken');
  fireEvent.click(screen.getByRole('button', { name: '비교 초기화' }));
  fireEvent.click(screen.getByRole('button', { name: '현재 조건을 A로 고정' }));
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
    throw Error('blocked');
  });
  fireEvent.click(screen.getByRole('button', { name: '비교 종료' }));
  expect(screen.getByRole('alert')).toHaveTextContent('현재 A와 저장된 내용을 유지');
  expect(screen.getByRole('table')).toBeInTheDocument();
});
it('does not bridge undefined samples or discontinuity breaks in the comparison curve', () => {
  const path = comparisonPath(
    [[0, 0, 0], [1, 1, 0], null, [3, 3, 0], [4, 4, 0]],
    [false, false, false, false, true],
    'xy',
    { x: 2, y: 2, span: 5 },
  );
  expect(path.match(/M/g)).toHaveLength(3);
  expect(path.match(/L/g)).toHaveLength(1);
  const pole = buildScene({ ...original, expressions: ['1/x', '', ''], min: '-1', max: '1' });
  expect(
    comparisonPath(
      pole.points,
      pole.breakBefore,
      'xy',
      comparisonBounds([pole.points], 'xy'),
    ).match(/M/g)!.length,
  ).toBeGreaterThanOrEqual(2);
});
it('keeps the current A usable and reports tab persistence failure without claiming it was stored', () => {
  render(<MathComparison {...props()} />);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  fireEvent.click(screen.getByRole('button', { name: '현재 조건을 A로 고정' }));
  expect(screen.getByRole('table')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('탭 보관에 실패');
  expect(sessionStorage.getItem(mathComparisonKey('owner-a'))).toBeNull();
});
