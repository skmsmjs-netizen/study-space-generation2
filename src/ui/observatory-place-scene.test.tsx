import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { applyCommand } from '../domain/commands';
import { studyInputDay } from '../domain/daily-study-dynamics';
import { createDemoState } from '../domain/fixtures';
import type { AppState } from '../domain/model';
import { observatoryPreviewTime, observatorySkyAt } from '../domain/observatory-time';
import { buildStudyLandscape } from '../domain/study-landscape';
import { ObservatoryPlaceScene } from './observatory-place-scene';

const mocks = vi.hoisted(() => ({ gpu: vi.fn(), pointer: vi.fn(), enabled: vi.fn(() => true) }));
vi.mock('./observatory-room-gpu', () => ({ connectRoomGPU: mocks.gpu }));
vi.mock('./observatory-pointer', () => ({ connectObservatoryPointer: mocks.pointer }));
vi.mock('./motion', () => ({ useMotionEnabled: mocks.enabled }));

type GPU = ReturnType<typeof vi.fn> & {
  update: ReturnType<typeof vi.fn>;
  setPlaying: ReturnType<typeof vi.fn>;
};
type Pointer = ReturnType<typeof vi.fn> & {
  updateResponse: ReturnType<typeof vi.fn>;
  inspect: ReturnType<typeof vi.fn>;
  reset: ReturnType<typeof vi.fn>;
};
const gpuAt = (index: number) => mocks.gpu.mock.results[index].value as GPU;
const pointerAt = (index: number) => mocks.pointer.mock.results[index].value as Pointer;
const stamp = '2026-10-02T03:00:00Z';
const day = studyInputDay(stamp) ?? 0;
const sky = observatorySkyAt(observatoryPreviewTime('morning'));
const storageKey = 'study-space:demo:view:observatory-room:demo-learner:v1';
const record = (data: AppState, id: string) =>
  applyCommand(data, {
    type: 'saveRecords',
    sessionId: id,
    dateEvidence: { kind: 'unknown' },
    entries: [{ targetId: 'demo-topic-function', done: true, body: `  ${id} 원문\n조건 유지  ` }],
    userId: data.userId,
    namespace: data.namespace,
    at: stamp,
    opId: id,
  });
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('IntersectionObserver', undefined);
  mocks.enabled.mockReset().mockReturnValue(true);
  mocks.gpu
    .mockReset()
    .mockImplementation(() => Object.assign(vi.fn(), { update: vi.fn(), setPlaying: vi.fn() }));
  mocks.pointer
    .mockReset()
    .mockImplementation(() =>
      Object.assign(vi.fn(), { updateResponse: vi.fn(), inspect: vi.fn(), reset: vi.fn() }),
    );
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it('forwards canonical zero, one and two input responses to the existing GPU and room styles without touching records', () => {
  const empty = createDemoState(),
    first = record(empty, 'first'),
    second = record(first, 'second');
  const data = [empty, first, second];
  const originals = structuredClone(data);
  const worlds = data.map((state) => buildStudyLandscape(state, undefined, day));
  const props = { place: 'left' as const, route: '/subjects', storageKey, sky };
  const view = render(<ObservatoryPlaceScene {...props} world={worlds[0]} />);
  const region = screen.getByRole('region', { name: '자료 책장 풍경' });
  const gpu = gpuAt(0);
  const read = () => ({
    activity: Number(region.getAttribute('data-room-activity')),
    density: Number(region.getAttribute('data-room-density')),
    glimmer: Number(region.getAttribute('data-room-glimmer')),
  });
  let previous = read();
  expect(previous).toEqual({ activity: 0, density: 0, glimmer: 0 });
  for (let index = 1; index <= 2; index++) {
    view.rerender(<ObservatoryPlaceScene {...props} world={worlds[index]} />);
    const next = read();
    for (const key of ['activity', 'density', 'glimmer'] as const) {
      expect(next[key]).toBeGreaterThan(previous[key]);
      expect(Number(region.style.getPropertyValue(`--room-${key}`))).toBe(next[key]);
    }
    expect(gpu.update).toHaveBeenLastCalledWith(expect.objectContaining(next));
    expect(mocks.gpu).toHaveBeenCalledTimes(1);
    expect(gpu).not.toHaveBeenCalled();
    previous = next;
  }
  expect(pointerAt(0).updateResponse).toHaveBeenLastCalledWith(worlds[2].response.activity);
  expect(data).toEqual(originals);
  view.unmount();
  expect(gpu).toHaveBeenCalledTimes(1);
});

it('keeps pause and collapsed choices across direction changes and remounts and cleans each active connection', () => {
  const world = buildStudyLandscape(record(createDemoState(), 'one'), undefined, day);
  const props = { route: '/subjects', storageKey, sky, world };
  let view = render(<ObservatoryPlaceScene {...props} place="left" />);
  const firstGPU = gpuAt(0),
    firstPointer = pointerAt(0);
  expect(firstGPU.setPlaying).toHaveBeenLastCalledWith(true);
  fireEvent.click(screen.getByRole('button', { name: '풍경 멈춤' }));
  expect(firstGPU.setPlaying).toHaveBeenLastCalledWith(false);
  expect(firstPointer).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(`${storageKey}:paused`)).toBe('true');
  expect(mocks.gpu).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: '풍경 접기' }));
  expect(firstGPU).toHaveBeenCalledTimes(1);
  expect(view.container.querySelector('canvas')).toBeNull();
  expect(localStorage.getItem(storageKey)).toBe('closed');
  view.rerender(<ObservatoryPlaceScene {...props} place="back" />);
  expect(mocks.gpu).toHaveBeenCalledTimes(1);
  view.unmount();

  view = render(<ObservatoryPlaceScene {...props} place="back" />);
  expect(screen.getByRole('button', { name: '풍경 펼치기' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expect(mocks.gpu).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: '풍경 펼치기' }));
  const secondGPU = gpuAt(1);
  expect(secondGPU.setPlaying).toHaveBeenLastCalledWith(false);
  expect(screen.getByRole('button', { name: '풍경 재생' })).toHaveAttribute('aria-pressed', 'true');
  expect(mocks.pointer).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: '풍경 재생' }));
  expect(secondGPU.setPlaying).toHaveBeenLastCalledWith(true);
  expect(localStorage.getItem(`${storageKey}:paused`)).toBe('false');
  const secondPointer = pointerAt(1);
  view.rerender(<ObservatoryPlaceScene {...props} place="ceiling" />);
  expect(secondGPU).toHaveBeenCalledTimes(1);
  expect(secondPointer).toHaveBeenCalledTimes(1);
  expect(mocks.gpu).toHaveBeenCalledTimes(3);
  expect(mocks.gpu).toHaveBeenLastCalledWith(
    expect.any(HTMLCanvasElement),
    expect.objectContaining({ place: 'ceiling' }),
  );
  const thirdGPU = gpuAt(2),
    thirdPointer = pointerAt(2);
  expect(thirdGPU.setPlaying).toHaveBeenLastCalledWith(true);
  mocks.enabled.mockReturnValue(false);
  view.rerender(<ObservatoryPlaceScene {...props} place="ceiling" route="/help" />);
  expect(thirdGPU.setPlaying).toHaveBeenLastCalledWith(false);
  expect(thirdPointer).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: '가까이 보기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '풍경 접기' }));
  expect(thirdGPU).toHaveBeenCalledTimes(1);
  view.unmount();
  view = render(<ObservatoryPlaceScene {...props} place="right" />);
  expect(view.container.querySelector('canvas')).toBeNull();
  expect(mocks.gpu).toHaveBeenCalledTimes(3);
  expect(mocks.pointer).toHaveBeenCalledTimes(3);
  view.unmount();
});
