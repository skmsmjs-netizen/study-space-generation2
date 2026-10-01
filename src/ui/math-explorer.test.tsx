import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { MathExplorer } from './math-explorer';
import { readScene } from '../domain/math-explorer';
import type { StudyRepository } from '../data/repository';
vi.mock('./math-explorer-plot', () => ({ MathExplorerPlot: () => <div>격리된 그래프</div> }));
vi.mock('./math-geogebra', () => ({ MathGeoGebra: () => <div>격리된 GeoGebra 그래프</div> }));
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
function open(repo: StudyRepository) {
  return render(<MathExplorer data={repo.getSnapshot()} repository={repo} onSaved={() => {}} />);
}
it('restores exact formula and notes after reopening; saves a new memo without changing study records', async () => {
  const repo = new DemoRepository(localStorage),
    before = structuredClone(repo.getSnapshot().records);
  const view = open(repo);
  fireEvent.change(screen.getByLabelText('x(t)'), { target: { value: 'a*cos(2*t)' } });
  fireEvent.change(screen.getByLabelText('관찰·메모 (선택)'), {
    target: { value: '  내 글\n조건·예외  ' },
  });
  fireEvent.change(screen.getByRole('slider', { name: '변수 a' }), { target: { value: '3' } });
  view.unmount();
  open(repo);
  expect(screen.getByLabelText('x(t)')).toHaveValue('a*cos(2*t)');
  expect(screen.getByLabelText('관찰·메모 (선택)')).toHaveValue('  내 글\n조건·예외  ');
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await waitFor(() => expect(screen.getByText('이 기기에 저장했습니다.')).toBeInTheDocument());
  const saved = new DemoRepository(localStorage).getSnapshot();
  const scene = readScene(saved.memos!.find((memo) => memo.id.startsWith('math-explorer:'))!.body)!;
  expect(scene.notes).toBe('  내 글\n조건·예외  ');
  expect(scene.a).toBe(3);
  expect(saved.records).toEqual(before);
});
it('keeps invalid formula input and displays the error', () => {
  open(new DemoRepository(localStorage));
  fireEvent.change(screen.getByLabelText('x(t)'), { target: { value: 'bad(t)' } });
  expect(screen.getByRole('alert')).toHaveTextContent('사칙연산');
  expect(screen.getByLabelText('x(t)')).toHaveValue('bad(t)');
});
it('uses actual t values and exact input, preserves the position on reopen, and rejects out-of-range values', () => {
  const repo = new DemoRepository(localStorage);
  const view = open(repo);
  const slider = screen.getByRole('slider', { name: '곡선 위 위치 t' });
  expect(Number(slider.getAttribute('max'))).toBeCloseTo(4 * Math.PI);
  fireEvent.change(slider, { target: { value: '3' } });
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(3);
  expect(screen.getByLabelText('t 값')).toHaveValue('3.00');
  const input = screen.getByLabelText('t 값');
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'pi' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(Math.PI);
  expect(input).toHaveValue('3.14');
  // Merely focusing/leaving a rounded readout must not replace the exact pi value.
  fireEvent.focus(input);
  fireEvent.blur(input);
  expect(Number((slider as HTMLInputElement).value)).toBe(Math.PI);
  fireEvent.change(input, { target: { value: '-1' } });
  fireEvent.blur(input);
  expect(input).toHaveValue('-1');
  expect(screen.getByRole('alert')).toHaveTextContent('사이의 값');
  expect(Number((slider as HTMLInputElement).value)).toBeCloseTo(Math.PI);
  view.unmount();
  open(repo);
  expect(
    Number((screen.getByRole('slider', { name: '곡선 위 위치 t' }) as HTMLInputElement).value),
  ).toBeCloseTo(Math.PI);
  fireEvent.click(screen.getByRole('button', { name: '구간 시작으로' }));
  expect(screen.getByLabelText('t 값')).toHaveValue('0.00');
});
it('retries an unacknowledged save with the same memo and operation', async () => {
  const repo = new DemoRepository(localStorage);
  let failed = true;
  const online: StudyRepository = {
    getSnapshot: () => repo.getSnapshot(),
    execute: (command) => repo.execute(command),
    flush: async () => {
      if (failed) throw Error('서버 연결 실패');
    },
  };
  open(online);
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await screen.findByText('서버 연결 실패');
  failed = false;
  fireEvent.click(screen.getByRole('button', { name: '수식과 메모 저장' }));
  await screen.findByText('서버에 저장했습니다.');
  expect(
    repo.getSnapshot().memos?.filter((memo) => memo.id.startsWith('math-explorer:')),
  ).toHaveLength(1);
});
