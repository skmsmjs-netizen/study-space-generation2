import { landscapeSeed, type StudyLandscape } from '../domain/study-landscape';
import {
  flowClamp,
  observatoryCurl,
  observatoryLinearColor,
  observatoryLOD,
  observatoryWave,
} from './observatory-flow';
import { skyVertex, skyFragment, particleVertex, particleFragment } from './observatory-shaders';
import { observatoryRenderWidth } from './observatory-render-budget';

export type ObservatoryCamera = {
  x: number;
  y: number;
  zoom: number;
  energy: number;
  near: boolean;
};
export type ObservatoryClock = { time: number };
/** Small CPU state survives offscreen GPU disposal, but belongs only to this mounted scene. */
export type ObservatoryRenderState = {
  particles?: Float32Array;
  constrained?: boolean;
};
export type ObservatoryGPUConnection = (() => void) & {
  update?: (world: StudyLandscape, night: number) => void;
};
const CAPACITY = 384;

/** One bounded context, two batched draws. Native SVG remains the fallback. */
function createGPU(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const programs: WebGLProgram[] = [],
    shaders: WebGLShader[] = [],
    buffers: WebGLBuffer[] = [];
  const dispose = () => {
    buffers.forEach((b) => {
      gl.deleteBuffer(b);
    });
    programs.forEach((p) => {
      gl.deleteProgram(p);
    });
    shaders.forEach((s) => {
      gl.deleteShader(s);
    });
    if (!canvas.isConnected) gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  try {
    const shader = (kind: number, source: string) => {
      const s = gl.createShader(kind);
      if (!s) throw Error('shader allocation');
      shaders.push(s);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw Error(gl.getShaderInfoLog(s) || 'shader compile');
      return s;
    };
    const program = (vertex: string, fragment: string) => {
      const p = gl.createProgram();
      if (!p) throw Error('program allocation');
      programs.push(p);
      gl.attachShader(p, shader(gl.VERTEX_SHADER, vertex));
      gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(p) || 'shader link');
      const locations = new Map<string, WebGLUniformLocation | null>();
      const location = (name: string) => {
        if (!locations.has(name)) locations.set(name, gl.getUniformLocation(p, name));
        return locations.get(name) ?? null;
      };
      return {
        p,
        scalar: (name: string, n: number) => gl.uniform1f(location(name), n),
        pair: (name: string, x: number, y: number) => gl.uniform2f(location(name), x, y),
        color: (name: string, rgb: readonly number[]) =>
          gl.uniform3f(location(name), rgb[0], rgb[1], rgb[2]),
      };
    };
    const sky = program(skyVertex, skyFragment),
      dust = program(particleVertex, particleFragment);
    const buffer = () => {
      const b = gl.createBuffer();
      if (!b) throw Error('buffer allocation');
      buffers.push(b);
      return b;
    };
    const quad = buffer(),
      points = buffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, points);
    gl.bufferData(gl.ARRAY_BUFFER, CAPACITY * 4 * Float32Array.BYTES_PER_ELEMENT, gl.DYNAMIC_DRAW);
    const skyAttribute = gl.getAttribLocation(sky.p, 'position'),
      dustAttribute = gl.getAttribLocation(dust.p, 'particle');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    return {
      dispose,
      draw(
        data: Float32Array,
        values: {
          time: number;
          growth: number;
          activity: number;
          night: number;
          lod: number;
          waveRadius: number;
          waveEnergy: number;
          count: number;
          impulse: number;
          pointer: { x: number; y: number };
          warm: readonly number[];
          cool: readonly number[];
        },
      ) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const uniforms = (p: typeof sky) => {
          gl.useProgram(p.p);
          for (const name of [
            'time',
            'growth',
            'activity',
            'night',
            'lod',
            'waveRadius',
            'waveEnergy',
            'count',
            'impulse',
          ] as const)
            p.scalar(name, values[name]);
          p.pair('pointer', values.pointer.x, values.pointer.y);
          p.color('warm', values.warm);
          p.color('cool', values.cool);
          p.scalar('pixelScale', canvas.width / 640);
        };
        uniforms(sky);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(skyAttribute);
        gl.vertexAttribPointer(skyAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(skyAttribute);
        uniforms(dust);
        gl.bindBuffer(gl.ARRAY_BUFFER, points);
        const visibleCount = Math.min(CAPACITY, Math.ceil(values.count));
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, visibleCount * 4));
        gl.enableVertexAttribArray(dustAttribute);
        gl.vertexAttribPointer(dustAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, visibleCount);
        gl.disableVertexAttribArray(dustAttribute);
      },
    };
  } catch {
    dispose();
    return null;
  }
}

export function connectObservatoryGPU(
  canvas: HTMLCanvasElement,
  root: HTMLElement,
  world: StudyLandscape,
  initialNight: number,
  clock: ObservatoryClock,
  renderState: ObservatoryRenderState = {},
): ObservatoryGPUConnection {
  let gpu: ReturnType<typeof createGPU> = null;
  try {
    gpu = createGPU(canvas);
  } catch {
    /* Native SVG fallback, including blocked contexts. */
  }
  canvas.dataset.renderer = gpu ? 'webgl2' : 'svg';
  const retainedParticles = renderState.particles;
  const data = retainedParticles ?? new Float32Array(CAPACITY * 4);
  renderState.particles = data;
  if (!retainedParticles) {
    for (let i = 0; i < CAPACITY; i++) {
      const seed = landscapeSeed(`curl-dust-${i}`);
      data.set([seed % 960, (seed >>> 10) % 320, (seed % 997) / 997, (seed % 628) / 100], i * 4);
    }
  }
  let growth = 0,
    activity = 0,
    supernova = 0,
    night = initialNight;
  let warm: readonly number[] = [0, 0, 0],
    cool: readonly number[] = [0, 0, 0];
  const updateModel = (nextWorld: StudyLandscape, nextNight: number) => {
    growth = nextWorld.evolution.position / 11;
    activity = nextWorld.dynamics.recent[0];
    supernova = nextWorld.evolution.supernova;
    night = nextNight;
    warm = observatoryLinearColor(
      0.75 + 0.08 * growth,
      0.12 + 0.045 * growth,
      28 + 22 * (1 - night) + 9 * activity,
    );
    cool = observatoryLinearColor(0.7, 0.065, 235 + 40 * growth);
  };
  updateModel(world, initialNight);
  const filters = [
    ...root.querySelectorAll<SVGFEDisplacementMapElement>('[data-flow-displacement]'),
  ];
  const fallback = [...root.querySelectorAll<SVGGElement>('[data-curl-fallback]')];
  let novaAnimations: Animation[] = [];
  let frame: number | null = null,
    previous = 0,
    delivered = 0,
    stopped = false;
  let camera: ObservatoryCamera = { x: 488, y: 200, zoom: 1, energy: 0, near: false };
  let impulse = 0;
  let resolution = 640,
    constrained = renderState.constrained ?? false,
    displayWidth = 640,
    pixelRatio = window.devicePixelRatio || 1,
    lastRaf = 0,
    frameInterval = 16.7;
  let slowFrames = 0,
    healthyFrames = 0,
    changingUntil = 0,
    resizedAt = 0;
  const resize = (value: number, timestamp: number) => {
    if (resolution === value && canvas.width === value) return;
    resolution = value;
    canvas.width = value;
    canvas.height = Math.round(value / 3);
    canvas.dataset.resolution = String(value);
    resizedAt = timestamp;
  };
  const renderWidth = (timestamp: number) =>
    observatoryRenderWidth({
      displayWidth,
      pixelRatio,
      zoom: camera.zoom,
      constrained,
      interacting: camera.zoom > 1.05 && timestamp < changingUntil,
    });
  // Measure the untransformed SVG viewport, not the camera-scaled canvas, to avoid feedback.
  // Respect the viewport's fit mode; camera zoom is budgeted separately from this layout scale.
  const viewport = root.querySelector<SVGSVGElement>('svg.pixel-landscape');
  const measure = () => {
    const bounds = viewport?.getBoundingClientRect();
    const view = viewport?.viewBox?.baseVal;
    if (bounds?.width && bounds.height) {
      const width = view?.width || 960,
        height = view?.height || 400;
      const scales = [bounds.width / width, bounds.height / height];
      const slice = viewport?.getAttribute('preserveAspectRatio')?.includes('slice');
      displayWidth = 960 * (slice ? Math.max(...scales) : Math.min(...scales));
    }
    pixelRatio = window.devicePixelRatio || 1;
  };
  measure();
  resize(renderWidth(0), 0);
  const active = () =>
    !stopped && root.dataset.motion === 'running' && document.visibilityState !== 'hidden';
  const synchronizeAnimations = () => {
    novaAnimations =
      root.getAnimations?.({ subtree: true }).filter((animation) => {
        const effect = animation.effect as KeyframeEffect | null;
        return (
          effect?.target instanceof Element &&
          effect.target.matches('.pixel-supernova *, .pixel-nova-landlight') &&
          Number(effect.getTiming().duration) === 28000
        );
      }) ?? [];
    // Native playback advances between these infrequent lifecycle synchronization points.
    for (const animation of novaAnimations) {
      animation.currentTime = clock.time * 1000;
      if (active()) animation.play();
      else animation.pause();
    }
  };
  const written = new Map<string, string>();
  const write = (name: string, value: string) => {
    if (written.get(name) === value) return;
    written.set(name, value);
    root.style.setProperty(name, value);
  };
  let lastScale = '';
  const draw = (timestamp: number) => {
    frame = null;
    const running = active();
    if (running && lastRaf) {
      const interval = timestamp - lastRaf;
      // Delivered frames alone include our 30 Hz cap. Observe every native rAF callback instead.
      if (interval > 0 && interval < 250) {
        frameInterval += (interval - frameInterval) * 0.08;
        slowFrames = frameInterval > 27 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
        healthyFrames = frameInterval < 21 ? healthyFrames + 1 : 0;
        if (slowFrames >= 40 && !constrained) {
          renderState.constrained = constrained = true;
          slowFrames = 0;
          healthyFrames = 0;
        } else if (healthyFrames >= 240 && constrained && timestamp > changingUntil) {
          renderState.constrained = constrained = false;
          healthyFrames = 0;
        }
      }
    }
    lastRaf = running ? timestamp : 0;
    if (running && delivered && timestamp - delivered < 32) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const elapsed = running && previous ? Math.max(0, (timestamp - previous) / 1000) : 0;
    const dt = Math.min(0.05, elapsed);
    previous = running ? timestamp : 0;
    delivered = timestamp;
    // Wall time keeps the shader wave aligned with native CSS animation; only integration is capped.
    clock.time += elapsed;
    const desiredResolution = renderWidth(timestamp);
    if (desiredResolution < resolution || timestamp - resizedAt > 1000)
      resize(desiredResolution, timestamp);
    impulse = Math.max(camera.energy * 0.7, impulse * Math.exp(-dt * 1.1));
    const lod = observatoryLOD(camera.zoom),
      wave = observatoryWave(clock.time, supernova);
    write('--pixel-lod-middle', lod[1].toFixed(4));
    write('--pixel-lod-close', lod[2].toFixed(4));
    write('--obs-wave-light', `${(wave.energy * 36).toFixed(3)}%`);
    const level = lod[2] > 0.5 ? '2' : lod[1] > 0.25 ? '1' : '0';
    if (canvas.dataset.lod !== level) canvas.dataset.lod = level;
    canvas.dataset.flowTime = clock.time.toFixed(3);
    const scale = ((wave.energy * 3 + impulse * 0.9) * (running ? 1 : 0)).toFixed(3);
    if (scale !== lastScale) {
      lastScale = scale;
      for (const filter of filters) filter.setAttribute('scale', scale);
    }
    const field = (x: number, y: number) => {
      const v = observatoryCurl(x, y, clock.time, activity);
      const dx = x - camera.x,
        dy = y - camera.y;
      const swirl = Math.exp(-(dx * dx + dy * dy) / 18000) * impulse * 0.6;
      return { x: v.x - dy * swirl, y: v.y + dx * swirl };
    };
    const count = 34 + 270 * growth + 40 * activity + 40 * lod[2];
    if (gpu) {
      for (let i = 0; i < Math.min(CAPACITY, Math.ceil(count)); i++) {
        const o = i * 4,
          v = field(data[o], data[o + 1]);
        const midpoint = field(data[o] + v.x * dt * 0.5, data[o + 1] + v.y * dt * 0.5);
        data[o] = (data[o] + midpoint.x * dt + 960) % 960;
        data[o + 1] = (data[o + 1] + midpoint.y * dt + 320) % 320;
      }
      gpu.draw(data, {
        time: clock.time,
        growth,
        activity,
        night,
        lod: lod[1] + lod[2],
        waveRadius: wave.radius,
        waveEnergy: wave.energy,
        count,
        impulse,
        pointer: camera,
        warm,
        cool,
      });
    } else {
      fallback.forEach((node, i) => {
        const v = field(160 + i * 137, 100 + i * 15);
        node.setAttribute(
          'transform',
          `translate(${Math.sin(clock.time * 0.12 + i) * v.x * 0.25} ${Math.cos(clock.time * 0.1 + i) * v.y * 0.18})`,
        );
      });
    }
    if (running) frame = requestAnimationFrame(draw);
  };
  const wake = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previous = 0;
    delivered = 0;
    lastRaf = 0;
    synchronizeAnimations();
    draw(performance.now());
  };
  const interaction = (event: Event) => {
    const next = (event as CustomEvent<ObservatoryCamera>).detail;
    if (next.near)
      impulse = flowClamp(impulse + Math.hypot(next.x - camera.x, next.y - camera.y) / 160, 0, 1);
    if (Math.abs(next.zoom - camera.zoom) > 0.0008 || next.energy > 0.05)
      changingUntil = performance.now() + 700;
    camera = next;
  };
  const lost = (event: Event) => {
    event.preventDefault();
    gpu?.dispose();
    gpu = null;
    canvas.dataset.renderer = 'svg';
    wake();
  };
  const restored = () => {
    try {
      gpu = createGPU(canvas);
    } catch {
      gpu = null;
    }
    canvas.dataset.renderer = gpu ? 'webgl2' : 'svg';
    wake();
  };
  const resizeViewport = () => {
    if (stopped) return;
    measure();
    // A paused scene still needs a correctly sized single frame; it cannot wait for a future rAF.
    resize(renderWidth(performance.now()), performance.now());
    wake();
  };
  const sizeObserver =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resizeViewport);
  if (viewport) sizeObserver?.observe(viewport);
  const observer = new MutationObserver(wake);
  observer.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
  root.addEventListener('observatory-camera', interaction);
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('resize', resizeViewport);
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', restored);
  wake();
  const disconnect: ObservatoryGPUConnection = () => {
    stopped = true;
    if (frame !== null) cancelAnimationFrame(frame);
    observer.disconnect();
    sizeObserver?.disconnect();
    gpu?.dispose();
    root.removeEventListener('observatory-camera', interaction);
    document.removeEventListener('visibilitychange', wake);
    window.removeEventListener('resize', resizeViewport);
    canvas.removeEventListener('webglcontextlost', lost);
    canvas.removeEventListener('webglcontextrestored', restored);
    for (const animation of novaAnimations) animation.pause();
  };
  disconnect.update = (nextWorld, nextNight) => {
    if (stopped) return;
    updateModel(nextWorld, nextNight);
    synchronizeAnimations();
    // A paused cover also receives fresh study/light values, without restarting its scene clock.
    if (frame === null) draw(performance.now());
  };
  return disconnect;
}
