import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createDemoState } from '../domain/fixtures';
import { StudyLandscapes } from './study-landscapes';
import { applyCommand } from '../domain/commands';
import { studyInputDay } from '../domain/daily-study-dynamics';
import * as observatoryGPU from './observatory-gpu';
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  delete document.documentElement.dataset.motion;
});
it('preserves pause and selected scenes after remount without changing study data', () => {
  const data = createDemoState(),
    original = structuredClone(data);
  const first = render(<StudyLandscapes data={data} />);
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  fireEvent.click(screen.getByRole('checkbox', { name: '혜성' }));
  first.unmount();
  render(<StudyLandscapes data={data} />);
  expect(screen.getByRole('button', { name: '풍경 움직이기' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: '혜성' })).not.toBeChecked();
  expect(document.querySelectorAll('.pixel-layer')).toHaveLength(2);
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
  fireEvent.click(screen.getByRole('checkbox', { name: '별빛' }));
  expect(screen.getByRole('status')).toHaveTextContent('설정을 저장하지 못했습니다');
  expect(screen.getByRole('checkbox', { name: '별빛' })).not.toBeChecked();
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
  for (const name of ['별빛', '혜성', '궤도'])
    fireEvent.click(screen.getByRole('checkbox', { name }));
  expect(document.querySelectorAll('.pixel-layer')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: '기본 풍경으로' }));
  expect(document.querySelectorAll('.pixel-layer')).toHaveLength(3);
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

it('keeps legacy choices while switching the product to the observatory only', () => {
  const data = createDemoState(),
    original = structuredClone(data);
  const key = `study-space:${data.namespace}:view:pixel-landscapes:${encodeURIComponent(data.userId)}:v1`;
  localStorage.setItem(
    key,
    JSON.stringify({ version: 1, paused: true, visible: ['garden'], world: 'paper' }),
  );
  const first = render(<StudyLandscapes data={data} />);
  expect(screen.getByRole('region', { name: '공부 사이의 풍경' })).toHaveAttribute(
    'data-world',
    'observatory',
  );
  expect(screen.queryByRole('button', { name: '섬' })).toBeNull();
  expect(screen.queryByRole('button', { name: '종이 기계' })).toBeNull();
  expect(document.querySelectorAll('.pixel-layer')).toHaveLength(1);
  first.unmount();
  render(<StudyLandscapes data={data} />);
  expect(screen.getByRole('button', { name: '풍경 움직이기' })).toBeInTheDocument();
  expect(screen.getByRole('checkbox', { name: '별빛' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: '혜성' })).not.toBeChecked();
  expect(data).toEqual(original);
});

it('renders the stage selected by the canonical engine and retains it during quiet days', () => {
  const base = createDemoState();
  const data = applyCommand(base, {
    type: 'saveRecords',
    sessionId: 'stage',
    dateEvidence: { kind: 'unknown' },
    entries: [{ targetId: 'demo-topic-function', done: true }],
    userId: base.userId,
    namespace: base.namespace,
    at: '2026-10-01T03:00:00Z',
    opId: 'stage',
  });
  const day = studyInputDay('2026-10-01T03:00:00Z') ?? 0;
  const view = render(<StudyLandscapes data={data} referenceDay={day} />);
  const root = screen.getByRole('region', { name: '공부 사이의 풍경' });
  expect(root).toHaveAttribute('data-evolution-stage', '1');
  view.rerender(<StudyLandscapes data={data} referenceDay={day + 90} />);
  expect(root).toHaveAttribute('data-evolution-stage', '1');
  const original = structuredClone(data);
  fireEvent.click(screen.getByRole('checkbox', { name: '혜성' }));
  expect(root).toHaveAttribute('data-evolution-stage', '1');
  expect(data).toEqual(original);
});

it('retains zoom while exploring, caches pointer geometry, returns gently and stops settled camera work', () => {
  vi.spyOn(observatoryGPU, 'connectObservatoryGPU').mockReturnValue(() => {});
  vi.useFakeTimers();
  let now = 0;
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callbacks.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  const advance = (duration: number) => {
    act(() => {
      for (let elapsed = 0; elapsed < duration; elapsed += 16) {
        now += 16;
        vi.advanceTimersByTime(16);
        const current = [...callbacks.entries()];
        callbacks.clear();
        current.forEach(([, callback]) => {
          callback(now);
        });
      }
    });
  };
  const data = createDemoState(),
    original = structuredClone(data);
  const day = studyInputDay('2026-10-01T03:00:00Z') ?? 0;
  const view = render(<StudyLandscapes data={data} referenceDay={day} />);
  const region = screen.getByRole('region', { name: '공부 사이의 풍경' });
  const svg = region.querySelector('svg.pixel-landscape');
  if (!svg) throw new Error('Observatory missing');
  const geometry = vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 20,
    width: 480,
    height: 200,
    right: 580,
    bottom: 220,
    x: 100,
    y: 20,
    toJSON: () => ({}),
  });
  const send = (target: Element | Window, type: string, x = 340, y = 85, pointerType = 'mouse') => {
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      pointerType: { value: pointerType },
    });
    fireEvent(target, event);
  };
  const zoom = () => Number(region.style.getPropertyValue('--pixel-sky-zoom'));
  send(svg, 'pointermove', 240);
  send(svg, 'pointermove', 340);
  expect(callbacks.size).toBe(1);
  advance(16);
  expect(region).toHaveAttribute('data-pointer', 'near');
  expect(parseFloat(region.style.getPropertyValue('--pixel-cursor-x'))).toBe(480);
  expect(parseFloat(region.style.getPropertyValue('--pixel-cursor-y'))).toBe(30);
  advance(6500);
  expect(zoom()).toBeGreaterThan(1.8);
  expect(callbacks.size).toBe(0);
  const origin = region.style.getPropertyValue('--pixel-origin-x');
  const heldZoom = zoom();
  const oldResponse = region.style.getPropertyValue('--pixel-response');
  const recorded = applyCommand(data, {
    type: 'saveRecords',
    sessionId: 'camera-live-record',
    dateEvidence: { kind: 'exact', date: '2026-10-01' },
    entries: [{ targetId: 'demo-topic-function', done: true }],
    userId: data.userId,
    namespace: data.namespace,
    at: '2026-10-01T03:00:00Z',
    opId: 'camera-live-record',
  });
  view.rerender(<StudyLandscapes data={recorded} referenceDay={day} />);
  expect(region.style.getPropertyValue('--pixel-response')).not.toBe(oldResponse);
  expect(zoom()).toBe(heldZoom);
  const recordResponse = region.style.getPropertyValue('--pixel-response');
  view.rerender(<StudyLandscapes data={recorded} referenceDay={day + 1} />);
  expect(region.style.getPropertyValue('--pixel-response')).not.toBe(recordResponse);
  expect(region.style.getPropertyValue('--pixel-origin-x')).toBe(origin);
  expect(zoom()).toBe(heldZoom);
  expect(region).toHaveAttribute('data-pointer', 'near');
  advance(1000);
  expect(zoom()).toBe(heldZoom);
  expect(callbacks.size).toBe(0);
  send(svg, 'pointermove', 400, 65);
  expect(zoom()).toBe(heldZoom);
  advance(320);
  expect(zoom()).toBeGreaterThanOrEqual(heldZoom - 0.001);
  expect(region).toHaveAttribute('data-inspect', 'exploring');
  expect(region.style.getPropertyValue('--pixel-origin-x')).toBe(origin);
  expect(geometry).toHaveBeenCalledTimes(1);
  const telescope = region.querySelector('[data-telescope]');
  if (!telescope) throw new Error('Telescope missing');
  send(telescope, 'pointerdown', 376, 159);
  send(svg, 'pointermove', 400, 40);
  advance(320);
  expect(region).toHaveAttribute('data-focus', 'telescope');
  expect(zoom()).toBeGreaterThanOrEqual(heldZoom - 0.001);
  send(window, 'pointerup', 400, 40);
  expect(region).toHaveAttribute('data-pointer', 'near');
  advance(3000);
  expect(zoom()).toBeGreaterThanOrEqual(heldZoom - 0.001);
  expect(callbacks.size).toBe(0);
  const beforeLeave = zoom();
  fireEvent.pointerLeave(region);
  expect(region).toHaveAttribute('data-pointer', 'away');
  expect(zoom()).toBe(beforeLeave);
  advance(32);
  expect(zoom()).toBeGreaterThan(1);
  expect(zoom()).toBeLessThan(beforeLeave);
  const returningZoom = zoom();
  send(svg, 'pointermove', 350, 80);
  advance(320);
  expect(zoom()).toBeGreaterThanOrEqual(returningZoom - 0.001);
  expect(region.style.getPropertyValue('--pixel-origin-x')).toBe(origin);
  fireEvent.pointerLeave(region);
  advance(4000);
  expect(zoom()).toBe(1);
  expect(callbacks.size).toBe(0);
  fireEvent(window, new Event('resize'));
  send(svg, 'pointermove', 370);
  advance(16);
  expect(geometry).toHaveBeenCalledTimes(2);
  send(svg, 'pointermove', 400, 85, 'touch');
  expect(region).toHaveAttribute('data-pointer', 'away');
  expect(zoom()).toBe(1);
  expect(callbacks.size).toBe(0);
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  send(svg, 'pointermove', 370);
  expect(region).toHaveAttribute('data-pointer', 'away');
  expect(data).toEqual(original);
});

it('updates the live minute and midnight while preserving the study stage and display choices', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T10:59:59Z'));
  const base = createDemoState();
  const data = applyCommand(base, {
    type: 'saveRecords',
    sessionId: 'clock',
    dateEvidence: { kind: 'unknown' },
    entries: [{ targetId: 'demo-topic-function', done: true }],
    userId: base.userId,
    namespace: base.namespace,
    at: '2026-10-01T03:00:00Z',
    opId: 'clock',
  });
  const original = structuredClone(data);
  const view = render(<StudyLandscapes data={data} />);
  const root = screen.getByRole('region', { name: '공부 사이의 풍경' });
  expect(root).toHaveAttribute('data-time-phase', 'sunset');
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈추기' }));
  fireEvent.click(screen.getByRole('checkbox', { name: '혜성' }));
  const stored = { ...localStorage };
  act(() => vi.advanceTimersByTime(1000));
  expect(root).toHaveAttribute('data-time-phase', 'night');
  expect(root).toHaveAttribute('data-evolution-stage', '1');
  expect(root).toHaveAttribute('data-motion', 'paused');
  vi.setSystemTime(new Date('2026-10-01T14:59:59Z'));
  act(() => window.dispatchEvent(new Event('pageshow')));
  expect(root).toHaveAttribute('data-time-phase', 'late-night');
  act(() => vi.advanceTimersByTime(1000));
  expect(root).toHaveAttribute('data-evolution-stage', '1');
  expect(screen.getByRole('checkbox', { name: '혜성' })).not.toBeChecked();
  expect({ ...localStorage }).toEqual(stored);
  expect(data).toEqual(original);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
it('stops background clock work and catches up immediately when the tab returns', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T00:00:00Z'));
  let hidden = false;
  vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() =>
    hidden ? 'hidden' : 'visible',
  );
  const view = render(<StudyLandscapes data={createDemoState()} />);
  const root = screen.getByRole('region', { name: '공부 사이의 풍경' });
  expect(root).toHaveAttribute('data-time-phase', 'morning');
  hidden = true;
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(vi.getTimerCount()).toBe(0);
  vi.setSystemTime(new Date('2026-10-01T09:00:00Z'));
  hidden = false;
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(root).toHaveAttribute('data-time-phase', 'sunset');
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
