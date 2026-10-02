import { afterEach, expect, it, vi } from 'vitest';
import { connectRoomGPU, type RoomGPUValues } from './observatory-room-gpu';

const initial: RoomGPUValues = {
  place: 'left',
  activity: 0.4,
  density: 0.3,
  glimmer: 0.5,
  growth: 0.2,
  light: 0.6,
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.replaceChildren();
});

function runtime() {
  let now = 0,
    id = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.spyOn(performance, 'now').mockImplementation(() => now);
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
    frames.delete(handle);
  });
  const disconnectObserver = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      disconnect = disconnectObserver;
    },
  );
  const canvas = document.createElement('canvas');
  let width = 960;
  Object.defineProperty(canvas, 'clientWidth', { get: () => width });
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ width: 9000 } as DOMRect);
  document.body.append(canvas);
  return {
    canvas,
    frames,
    disconnectObserver,
    resize(next: number) {
      width = next;
      window.dispatchEvent(new Event('resize'));
    },
    advance(count: number, milliseconds = 1000 / 60) {
      for (let i = 0; i < count; i++) {
        now += milliseconds;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => {
          callback(now);
        });
      }
    },
  };
}
function context(canvas: HTMLCanvasElement) {
  const loseContext = vi.fn();
  const gl = {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    ARRAY_BUFFER: 5,
    STATIC_DRAW: 6,
    BLEND: 7,
    SRC_ALPHA: 8,
    ONE_MINUS_SRC_ALPHA: 9,
    COLOR_BUFFER_BIT: 10,
    FLOAT: 11,
    TRIANGLE_STRIP: 12,
    POINTS: 13,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    deleteProgram: vi.fn(),
    getUniformLocation: vi.fn((_program: unknown, name: string) => ({ name })),
    getAttribLocation: vi.fn(() => 0),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteBuffer: vi.fn(),
    enable: vi.fn(),
    blendFunc: vi.fn(),
    viewport: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    useProgram: vi.fn(),
    uniform1f: vi.fn(),
    uniform3f: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    drawArrays: vi.fn(),
    disableVertexAttribArray: vi.fn(),
    getExtension: vi.fn(() => ({ loseContext })),
  };
  vi.spyOn(canvas, 'getContext').mockReturnValue(gl as unknown as WebGL2RenderingContext);
  return { gl, loseContext };
}

it('bounds actual draw work and updates engine uniforms without reallocating the context', () => {
  const r = runtime(),
    { gl } = context(r.canvas);
  const renderer = connectRoomGPU(r.canvas, initial);
  expect(r.canvas.dataset.roomRenderer).toBe('webgl2');
  expect(r.canvas.dataset.roomRaf).toBe('running');
  expect(r.frames.size).toBe(1);
  expect(gl.createProgram).toHaveBeenCalledTimes(2);
  expect(gl.createShader).toHaveBeenCalledTimes(4);
  expect(gl.createBuffer).toHaveBeenCalledTimes(2);
  r.advance(60);
  expect(Number(r.canvas.dataset.roomFrames)).toBeLessThanOrEqual(31);
  expect(Number(r.canvas.dataset.roomFrames)).toBeGreaterThanOrEqual(29);
  expect(gl.drawArrays.mock.calls.length).toBe(Number(r.canvas.dataset.roomFrames) * 2);
  renderer.update({
    ...initial,
    place: 'right',
    activity: 0.400001,
    density: 1,
    growth: 1,
    glimmer: 1,
  });
  r.advance(3);
  expect(r.canvas.dataset.roomPlace).toBe('right');
  expect(r.canvas.dataset.roomParticles).toBe('192.000');
  expect(
    gl.uniform1f.mock.calls.some(
      ([location, value]) => location.name === 'activity' && value === 0.400001,
    ),
  ).toBe(true);
  expect(gl.createProgram).toHaveBeenCalledTimes(2);
  expect(gl.bufferData).toHaveBeenCalledTimes(2);
  renderer();
  expect(r.frames.size).toBe(0);
});

it('pauses all RAF work, draws a changed still frame once and resumes without time catching up', () => {
  const r = runtime();
  context(r.canvas);
  const renderer = connectRoomGPU(r.canvas, initial);
  r.advance(40);
  renderer.setPlaying(false);
  const before = Number(r.canvas.dataset.roomFrames),
    time = r.canvas.dataset.roomFlowTime;
  expect(r.frames.size).toBe(0);
  expect(r.canvas.dataset.roomRaf).toBe('stopped');
  r.advance(600);
  expect(Number(r.canvas.dataset.roomFrames)).toBe(before);
  renderer.update({ ...initial, light: 0.7 });
  expect(Number(r.canvas.dataset.roomFrames)).toBe(before + 1);
  expect(r.canvas.dataset.roomFlowTime).toBe(time);
  expect(r.frames.size).toBe(0);
  renderer.setPlaying(true);
  r.advance(4);
  expect(Number(r.canvas.dataset.roomFlowTime) - Number(time)).toBeLessThan(0.1);
  renderer();
});

it('keeps the SVG fallback idle on unavailable or failed contexts and cleans partial allocations', () => {
  const first = runtime();
  vi.spyOn(first.canvas, 'getContext').mockReturnValue(null);
  const unsupported = connectRoomGPU(first.canvas, initial);
  expect(first.canvas.dataset.roomRenderer).toBe('fallback');
  expect(first.frames.size).toBe(0);
  unsupported.update({ ...initial, activity: 1 });
  unsupported.setPlaying(false);
  unsupported.setPlaying(true);
  expect(first.frames.size).toBe(0);
  unsupported();

  const second = runtime(),
    { gl } = context(second.canvas);
  gl.getShaderParameter.mockReturnValue(false);
  const failed = connectRoomGPU(second.canvas, initial);
  expect(second.canvas.dataset.roomRenderer).toBe('fallback');
  expect(second.frames.size).toBe(0);
  expect(gl.deleteProgram).toHaveBeenCalledTimes(1);
  expect(gl.deleteShader).toHaveBeenCalledTimes(1);
  failed();
});

it('releases lost resources and automatically restores the paused state without a new scene clock', () => {
  const r = runtime(),
    { gl, loseContext } = context(r.canvas);
  const renderer = connectRoomGPU(r.canvas, initial);
  r.advance(20);
  renderer.setPlaying(false);
  const time = r.canvas.dataset.roomFlowTime;
  const lost = new Event('webglcontextlost', { cancelable: true });
  r.canvas.dispatchEvent(lost);
  expect(lost.defaultPrevented).toBe(true);
  expect(r.canvas.dataset.roomRenderer).toBe('fallback');
  expect(r.frames.size).toBe(0);
  expect(gl.deleteProgram).toHaveBeenCalledTimes(2);
  expect(gl.deleteBuffer).toHaveBeenCalledTimes(2);
  expect(gl.deleteShader).toHaveBeenCalledTimes(4);
  r.canvas.dispatchEvent(new Event('webglcontextrestored'));
  expect(r.canvas.dataset.roomRenderer).toBe('webgl2');
  expect(r.canvas.dataset.roomFlowTime).toBe(time);
  expect(r.frames.size).toBe(0);
  expect(gl.createProgram).toHaveBeenCalledTimes(4);
  r.canvas.remove();
  renderer();
  renderer();
  expect(gl.deleteProgram).toHaveBeenCalledTimes(4);
  expect(gl.deleteShader).toHaveBeenCalledTimes(8);
  expect(gl.deleteBuffer).toHaveBeenCalledTimes(4);
  expect(loseContext).toHaveBeenCalledTimes(1);
  expect(r.disconnectObserver).toHaveBeenCalledTimes(1);
  r.canvas.dispatchEvent(new Event('webglcontextrestored'));
  window.dispatchEvent(new Event('resize'));
  expect(gl.createProgram).toHaveBeenCalledTimes(4);
  expect(r.frames.size).toBe(0);
});

it('uses untransformed layout width and lowers raster cost under sustained delivered-frame pressure', () => {
  const r = runtime();
  context(r.canvas);
  const renderer = connectRoomGPU(r.canvas, initial);
  expect(r.canvas.width).toBeLessThanOrEqual(960);
  expect(r.canvas.height).toBeLessThanOrEqual(260);
  r.resize(480);
  expect(r.canvas.width).toBe(480);
  expect(r.canvas.getBoundingClientRect).not.toHaveBeenCalled();
  r.resize(960);
  r.advance(80, 50);
  expect(r.canvas.width).toBeLessThanOrEqual(400);
  r.advance(330);
  expect(r.canvas.width).toBe(960);
  renderer();
});
