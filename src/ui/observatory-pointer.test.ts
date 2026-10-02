import { expect, it, vi } from 'vitest';
import { connectObservatoryPointer } from './observatory-pointer';

it('slow movement postpones the initial dwell but exploration preserves the engaged lens and cleanup cancels work', () => {
  vi.useFakeTimers();
  const root = document.createElement('section');
  root.innerHTML = '<svg class="pixel-landscape" viewBox="0 -100 960 400"></svg>';
  const svg = root.querySelector('svg')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 960,
    bottom: 400,
    width: 960,
    height: 400,
    toJSON: () => ({}),
  });
  let now = 0,
    sequence = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    callbacks.set(++sequence, fn);
    return sequence;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  const cleanup = connectObservatoryPointer(root, 0.5);
  const camera = vi.fn();
  root.addEventListener('observatory-camera', camera);
  const move = (x: number) =>
    svg.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: 150 }));
  const tick = (time: number) => {
    const delta = time - now;
    now = time;
    vi.advanceTimersByTime(delta);
    const pending = [...callbacks.values()];
    callbacks.clear();
    for (const fn of pending) fn(time);
  };
  try {
    move(100);
    tick(0);
    expect((camera.mock.lastCall?.[0] as CustomEvent | undefined)?.detail).toMatchObject({
      x: 100,
      y: 150,
    });
    for (let i = 1; i <= 8; i++) {
      tick(i * 150);
      move(100 + i * 0.5);
      tick(now);
    }
    expect(root.dataset.inspect).toBe('waiting');
    for (let t = 1250; t <= 8500; t += 50) tick(t);
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBeGreaterThan(2);
    const inspected = Number(root.style.getPropertyValue('--pixel-sky-zoom'));
    const origin = root.style.getPropertyValue('--pixel-origin-x');
    move(160);
    expect(callbacks.size).toBeGreaterThan(0);
    tick(8520);
    expect(root.dataset.inspect).toBe('exploring');
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBeGreaterThanOrEqual(
      inspected - 0.001,
    );
    expect(root.style.getPropertyValue('--pixel-origin-x')).toBe(origin);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBe(1);
    expect(callbacks.size).toBe(0);
    cleanup();
    expect(callbacks.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  } finally {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});

it('supports an interior viewport and explicit inspection without a hover dwell, then returns smoothly', () => {
  vi.useFakeTimers();
  const root = document.createElement('section');
  root.innerHTML =
    '<svg class="pixel-landscape"></svg><svg class="observatory-place-art" viewBox="0 0 960 260"></svg>';
  const svg = root.querySelector<SVGSVGElement>('svg.observatory-place-art');
  const otherSvg = root.querySelector('svg.pixel-landscape');
  if (!svg || !otherSvg) throw Error('Missing test viewport');
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 20,
    y: 40,
    left: 20,
    top: 40,
    right: 500,
    bottom: 170,
    width: 480,
    height: 130,
    toJSON: () => ({}),
  });
  let now = 0,
    sequence = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    callbacks.set(++sequence, fn);
    return sequence;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  const camera = vi.fn();
  root.addEventListener('observatory-camera', camera);
  const cleanup = connectObservatoryPointer(root, 0.5, {
    svgSelector: 'svg.observatory-place-art',
    cameraYOffset: 0,
  });
  const tick = (time: number) => {
    vi.advanceTimersByTime(time - now);
    now = time;
    const pending = [...callbacks.values()];
    callbacks.clear();
    for (const fn of pending) fn(time);
  };
  const down = (element: Element) => {
    const event = new MouseEvent('pointerdown', { bubbles: true, clientX: 260, clientY: 105 });
    Object.defineProperty(event, 'pointerId', { value: 1 });
    element.dispatchEvent(event);
  };
  try {
    // Other SVGs and frame decoration cannot start a drag for this controller.
    down(otherSvg);
    expect(root.dataset.inspect).toBe('idle');
    down(svg);
    tick(16);
    expect(root.dataset.inspect).toBe('dragging');
    expect((camera.mock.lastCall?.[0] as CustomEvent | undefined)?.detail).toMatchObject({
      x: 480,
      y: 130,
    });
    window.dispatchEvent(new MouseEvent('pointerup'));
    cleanup.reset();
    for (let t = 32; t <= 2048; t += 16) tick(t);
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBe(1);

    cleanup.inspect();
    expect(root.style.getPropertyValue('--pixel-origin-x')).toBe('480.0000px');
    expect(root.style.getPropertyValue('--pixel-origin-y')).toBe('130.0000px');
    expect(vi.getTimerCount()).toBe(0);
    for (let t = 2064; t <= 2352; t += 16) tick(t);
    expect(root.dataset.inspect).toBe('approaching');
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBeGreaterThan(1);
    for (let t = 2368; t <= 7040; t += 16) tick(t);
    const zoom = Number(root.style.getPropertyValue('--pixel-sky-zoom'));
    expect(zoom).toBeGreaterThan(2);
    cleanup.updateResponse(1);
    cleanup.inspect();
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBe(zoom);
    // At a retained zoom, only the damped pan keeps changing after pointer input.
    // Event-driven SVG/GPU adapters must receive those settling frames too.
    svg.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: 310, clientY: 140 }));
    tick(7056);
    const panEventCount = camera.mock.calls.length;
    const panBefore = root.style.getPropertyValue('--pixel-pan-x');
    tick(7072);
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBe(zoom);
    expect(root.style.getPropertyValue('--pixel-pan-x')).not.toBe(panBefore);
    expect(camera.mock.calls.length).toBeGreaterThan(panEventCount);
    const pan = (camera.mock.lastCall?.[0] as CustomEvent | undefined)?.detail;
    expect(pan?.panX).toBeCloseTo(parseFloat(root.style.getPropertyValue('--pixel-pan-x')), 4);
    expect(pan?.panY).toBeCloseTo(parseFloat(root.style.getPropertyValue('--pixel-pan-y')), 4);
    cleanup.reset();
    tick(7088);
    expect(root.dataset.inspect).toBe('returning');
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBeGreaterThan(1);
    for (let t = 7104; t <= 12000; t += 16) tick(t);
    expect(root.dataset.inspect).toBe('idle');
    expect(Number(root.style.getPropertyValue('--pixel-sky-zoom'))).toBe(1);
    expect(callbacks.size).toBe(0);
  } finally {
    cleanup();
    expect(callbacks.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});

it('uses the complete original viewBox at all four edges and ignores outside frame space', () => {
  vi.useFakeTimers();
  let nextFrame = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
    callbacks.set(++nextFrame, fn);
    return nextFrame;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  const root = document.createElement('section');
  root.innerHTML =
    '<span data-observatory-room><span class="observatory-room-frame"><svg class="pixel-landscape" viewBox="0 -100 960 400"></svg></span></span>';
  const svg = root.querySelector('svg')!;
  const geometry = vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
    x: 10,
    y: 20,
    left: 10,
    top: 20,
    right: 490,
    bottom: 220,
    width: 480,
    height: 200,
    toJSON: () => ({}),
  });
  const cleanup = connectObservatoryPointer(root, 0.5);
  const move = (x: number, y: number) => {
    svg.dispatchEvent(new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y }));
    const pending = [...callbacks.values()];
    callbacks.clear();
    for (const fn of pending) fn(performance.now());
  };
  try {
    for (const [x, y, logicalX, logicalY] of [
      [10.5, 20.5, 1, -99],
      [489.5, 20.5, 959, -99],
      [10.5, 219.5, 1, 299],
      [489.5, 219.5, 959, 299],
    ]) {
      move(x, y);
      expect(root.dataset.pointer).toBe('near');
      expect(parseFloat(root.style.getPropertyValue('--pixel-cursor-x'))).toBe(logicalX);
      expect(parseFloat(root.style.getPropertyValue('--pixel-cursor-y'))).toBe(logicalY);
    }
    expect(geometry).toHaveBeenCalledTimes(1);
    move(9, 100);
    expect(root.dataset.pointer).toBe('away');
    move(100, 221);
    expect(root.dataset.pointer).toBe('away');
    // Container changes invalidate geometry without replacing the camera controller.
    geometry.mockReturnValue({
      x: 10,
      y: 20,
      left: 10,
      top: 20,
      right: 250,
      bottom: 120,
      width: 240,
      height: 100,
      toJSON: () => ({}),
    });
    window.dispatchEvent(new Event('resize'));
    move(130, 70);
    expect(root.dataset.pointer).toBe('near');
    expect(parseFloat(root.style.getPropertyValue('--pixel-cursor-x'))).toBe(480);
    expect(parseFloat(root.style.getPropertyValue('--pixel-cursor-y'))).toBe(100);
  } finally {
    cleanup();
    expect(callbacks.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});
