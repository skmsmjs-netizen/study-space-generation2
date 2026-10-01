import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDemoState } from '../domain/fixtures';
import { StudyLandscapes } from './study-landscapes';
import { applyCommand } from '../domain/commands';
import { studyInputDay } from '../domain/daily-study-dynamics';
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete document.documentElement.dataset.motion;
});
it('preserves pause and selected scenes after remount without changing study data', () => {
  const data = createDemoState(),
    original = structuredClone(data);
  const first = render(<StudyLandscapes data={data} />);
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  fireEvent.click(screen.getByRole('checkbox', { name: '물가' }));
  first.unmount();
  render(<StudyLandscapes data={data} />);
  expect(screen.getByRole('button', { name: '풍경 움직이기' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: '물가' })).not.toBeChecked();
  expect(document.querySelectorAll('.landscape-card')).toHaveLength(2);
  expect(data).toEqual(original);
});
it('separates owners and offers recovery when display preference storage fails', () => {
  const data = createDemoState();
  const view = render(<StudyLandscapes data={data} />);
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  view.rerender(<StudyLandscapes data={{ ...data, userId: 'other-owner' }} />);
  expect(screen.getByRole('button', { name: '풍경 멈추기' })).toBeInTheDocument();
  const fail = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota');
  });
  fireEvent.click(screen.getByRole('checkbox', { name: '작은 뜰' }));
  expect(screen.getByRole('status')).toHaveTextContent('설정을 저장하지 못했습니다');
  expect(screen.getByRole('checkbox', { name: '작은 뜰' })).not.toBeChecked();
  fail.mockRestore();
  fireEvent.click(screen.getByRole('button', { name: '설정 저장 다시 시도' }));
  expect(screen.queryByRole('status')).toBeNull();
});
it('respects reduced motion and allows hiding every scene and restoring them', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  render(<StudyLandscapes data={createDemoState()} />);
  expect(screen.getByRole('button', { name: '정지된 풍경' })).toBeDisabled();
  for (const name of ['작은 뜰', '물가', '산책길'])
    fireEvent.click(screen.getByRole('checkbox', { name }));
  expect(document.querySelectorAll('.landscape-card')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: '기본 풍경으로' }));
  expect(document.querySelectorAll('.landscape-card')).toHaveLength(3);
});

it('also preserves the existing app motion preference', () => {
  document.documentElement.dataset.motion = 'reduce';
  render(<StudyLandscapes data={createDemoState()} />);
  expect(screen.getByRole('button', { name: '정지된 풍경' })).toBeDisabled();
  expect(screen.getByRole('region', { name: '공부 사이의 풍경' })).toHaveAttribute(
    'data-motion',
    'paused',
  );
});

it('recalculates daily motion when the calendar changes while keeping pause and existing plants', () => {
  const base = createDemoState();
  const data = applyCommand(base, {
    type: 'saveRecords',
    sessionId: 'daily',
    dateEvidence: { kind: 'unknown' },
    entries: [{ targetId: 'demo-topic-function', done: true }],
    userId: base.userId,
    namespace: base.namespace,
    at: '2026-10-01T03:00:00Z',
    opId: 'daily',
  });
  const day = studyInputDay('2026-10-01T03:00:00Z') ?? 0;
  const view = render(<StudyLandscapes data={data} referenceDay={day} />);
  const before = screen
    .getByRole('region', { name: '공부 사이의 풍경' })
    .style.getPropertyValue('--pixel-wave-period');
  const plants = document.querySelector('.pixel-landscape--garden')?.innerHTML;
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  view.rerender(<StudyLandscapes data={data} referenceDay={day + 30} />);
  const root = screen.getByRole('region', { name: '공부 사이의 풍경' });
  expect(root.style.getPropertyValue('--pixel-wave-period')).not.toEqual(before);
  expect(root).toHaveAttribute('data-motion', 'paused');
  expect(document.querySelector('.pixel-landscape--garden')?.innerHTML).toEqual(plants);
});
