import { afterEach, expect, it, vi } from 'vitest';
import { buildStudyLandscape } from '../domain/study-landscape';
import { createDemoState } from '../domain/fixtures';
import { connectObservatoryGPU, type ObservatoryRenderState } from './observatory-gpu';

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function scene(
  options: {
    width?: number;
    height?: number;
    pixelRatio?: number;
    webgl?: boolean;
    fit?: 'meet' | 'slice';
  } = {},
) {
  let now = 1000,
    identifier = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callbacks.set(++identifier, callback);
    return identifier;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => callbacks.delete(id));
  vi.stubGlobal('devicePixelRatio', options.pixelRatio ?? 1);
  let measureCallback: ResizeObserverCallback | undefined;
  const disconnectObserver = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        measureCallback = callback;
      }
      observe() {}
      disconnect = disconnectObserver;
    },
  );
  const upload = vi.fn();
  const fakeGPU = new Proxy(
    {},
    {
      get: (_, key) => {
        if (key === 'bufferSubData') return upload;
        if (key === 'getShaderParameter' || key === 'getProgramParameter') return () => true;
        if (key === 'getExtension') return () => null;
        if (String(key).startsWith('create')) return () => ({});
        if (key === 'getAttribLocation') return () => 0;
        if (String(key).toUpperCase() === key) return 0;
        return () => {};
      },
    },
  ) as WebGL2RenderingContext;
  const context = vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockReturnValue(options.webgl ? fakeGPU : null);
  const root = document.createElement('section');
  root.dataset.motion = 'running';
  root.innerHTML =
    '<canvas></canvas><svg class="pixel-landscape" viewBox="0 -100 960 400"><g class="pixel-supernova"><path /></g></svg>';
  document.body.append(root);
  const canvas = root.querySelector('canvas');
  if (!canvas) throw Error('Canvas fixture absent');
  let width = options.width ?? 0,
    height = options.height ?? 0;
  const viewport = root.querySelector('svg');
  if (!viewport) throw Error('SVG fixture absent');
  viewport.setAttribute('preserveAspectRatio', `xMidYMid ${options.fit ?? 'meet'}`);
  const geometry = vi
    .spyOn(viewport, 'getBoundingClientRect')
    .mockImplementation(() => ({ width, height }) as DOMRect);
  const resize = (nextWidth: number, nextHeight: number) => {
    width = nextWidth;
    height = nextHeight;
    measureCallback?.([], {} as ResizeObserver);
  };
  const setTime = vi.fn();
  const animation = {
    effect: { target: root.querySelector('path'), getTiming: () => ({ duration: 28000 }) },
    play: vi.fn(),
    pause: vi.fn(),
    set currentTime(value: number) {
      setTime(value);
    },
  };
  Object.defineProperty(root, 'getAnimations', { value: () => [animation] });
  const clock = { time: 0 },
    world = buildStudyLandscape(createDemoState(), undefined, 20728);
  const renderState: ObservatoryRenderState = {};
  const connection = connectObservatoryGPU(canvas, root, world, 1, clock, renderState);
  const step = (milliseconds: number, count = 1) => {
    for (let i = 0; i < count; i++) {
      now += milliseconds;
      const pending = [...callbacks.values()];
      callbacks.clear();
      for (const callback of pending) callback(now);
    }
  };
  return {
    root,
    canvas,
    clock,
    world,
    connection,
    step,
    context,
    animation,
    setTime,
    callbacks,
    resize,
    geometry,
    renderState,
    upload,
    disconnectObserver,
  };
}

it('updates study/light values without restarting the context, zoom, scene clock or native wave playback', async () => {
  const s = scene();
  s.root.dispatchEvent(
    new CustomEvent('observatory-camera', {
      detail: { x: 410, y: 130, zoom: 2.45, energy: 0, near: true },
    }),
  );
  s.step(16, 8);
  expect(s.canvas.dataset.lod).toBe('2');
  expect(s.context).toHaveBeenCalledTimes(1);
  expect(s.setTime).toHaveBeenCalledTimes(1);
  const elapsed = s.clock.time;
  s.connection.update?.({ ...s.world, evolution: { ...s.world.evolution, position: 7 } }, 0.55);
  expect(s.clock.time).toBe(elapsed);
  s.step(16, 8);
  expect(s.clock.time).toBeGreaterThan(elapsed);
  expect(s.canvas.dataset.lod).toBe('2');
  expect(s.context).toHaveBeenCalledTimes(1);
  // Native CSS playback runs between lifecycle updates, with no frame-by-frame time assignment.
  expect(s.setTime).toHaveBeenCalledTimes(2);
  s.root.dataset.motion = 'paused';
  await Promise.resolve();
  const frozen = s.clock.time;
  s.step(1000, 3);
  expect(s.clock.time).toBe(frozen);
  expect(s.animation.pause).toHaveBeenCalled();
  const playCount = s.animation.play.mock.calls.length;
  s.connection();
  expect(s.animation.play).toHaveBeenCalledTimes(playCount);
  expect(s.callbacks.size).toBe(0);
});

it('uses observed frame delays to downshift, recovers with hysteresis and preserves state on context restoration', () => {
  const s = scene();
  expect(s.canvas.width).toBe(640);
  s.step(34, 65);
  expect(s.canvas.width).toBe(400);
  s.step(16, 320);
  expect(s.canvas.width).toBe(640);
  s.root.dispatchEvent(
    new CustomEvent('observatory-camera', {
      detail: { x: 410, y: 130, zoom: 2.45, energy: 0, near: true },
    }),
  );
  s.step(16, 4);
  expect(s.canvas.width).toBe(400);
  const elapsed = s.clock.time;
  s.canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  s.canvas.dispatchEvent(new Event('webglcontextrestored'));
  expect(s.context).toHaveBeenCalledTimes(2);
  expect(s.clock.time).toBe(elapsed);
  expect(s.canvas.dataset.lod).toBe('2');
  s.step(16, 80);
  expect(s.canvas.width).toBe(960);
  s.connection();
});

it('resizes for its viewport and density without layout reads per frame, including when paused', async () => {
  const s = scene({ width: 320, height: 320, pixelRatio: 2 });
  expect(s.canvas.width).toBe(640);
  s.step(16, 20);
  expect(s.geometry).toHaveBeenCalledTimes(1);
  s.root.dataset.motion = 'paused';
  await Promise.resolve();
  const frozen = s.clock.time;
  s.resize(960, 400);
  expect(s.canvas.width).toBe(1280);
  expect(s.clock.time).toBe(frozen);
  expect(s.callbacks.size).toBe(0);
  s.resize(240, 100);
  expect(s.canvas.width).toBe(480);
  s.connection();
  expect(s.disconnectObserver).toHaveBeenCalledTimes(1);
  const reads = s.geometry.mock.calls.length;
  window.dispatchEvent(new Event('resize'));
  s.resize(960, 400);
  expect(s.geometry).toHaveBeenCalledTimes(reads);
  expect(s.callbacks.size).toBe(0);
});

it('respects a slice viewport without confusing its cropped width with the raster footprint', () => {
  const s = scene({ width: 320, height: 320, pixelRatio: 2, fit: 'slice' });
  expect(s.canvas.width).toBe(1280);
  s.connection();
});

it('keeps evolved particles and pressure through an offscreen GPU release and reconnect', () => {
  const s = scene({ webgl: true });
  expect(s.canvas.dataset.renderer).toBe('webgl2');
  const particles = s.renderState.particles;
  if (!particles) throw Error('Particle state absent');
  const original = particles.slice();
  s.step(34, 65);
  expect(particles).not.toEqual(original);
  expect(s.renderState.constrained).toBe(true);
  const suspended = particles.slice(),
    clock = s.clock.time;
  s.connection();
  expect(s.callbacks.size).toBe(0);
  s.step(60000);
  const canvas = document.createElement('canvas');
  s.canvas.replaceWith(canvas);
  const reconnect = connectObservatoryGPU(canvas, s.root, s.world, 1, s.clock, s.renderState);
  expect(s.renderState.particles).toBe(particles);
  expect(particles).toEqual(suspended);
  expect(s.clock.time).toBe(clock);
  expect(canvas.width).toBe(400);
  expect(s.upload.mock.calls.at(-1)?.[2]).toEqual(
    particles.subarray(0, s.upload.mock.calls.at(-1)?.[2].length),
  );
  s.step(16, 8);
  expect(particles).not.toEqual(suspended);
  expect(s.clock.time).toBeGreaterThan(clock);
  reconnect();
  expect(s.callbacks.size).toBe(0);
});
