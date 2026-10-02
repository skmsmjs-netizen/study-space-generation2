/** Transient camera only: no React frame state, saved study values or display preferences. */
export function connectObservatoryPointer(
  element: HTMLElement,
  response: number,
  options: { svgSelector?: string; cameraYOffset?: number } = {},
) {
  let liveResponse = response;
  let focusResponse = response;
  const svgSelector = options.svgSelector ?? 'svg.pixel-landscape';
  const cameraYOffset = options.cameraYOffset ?? 100;
  const svg = element.querySelector<SVGSVGElement>(svgSelector);
  const trailNodes = Array.from(element.querySelectorAll('[data-cursor-trail]'));
  type Point = { x: number; y: number };
  type Camera = Point & { zoom: number; depth: number; energy: number; tilt: number };
  const neutral = (): Camera => ({ x: 0, y: 0, zoom: 1, depth: 0, energy: 0, tilt: 0 });
  const clamp = (value: number, lower: number, upper: number) =>
    Math.max(lower, Math.min(upper, value));
  let frame: number | null = null;
  let dwellTimer: ReturnType<typeof setTimeout> | null = null;
  let held: number | null = null;
  let telescope = false;
  let near = false;
  let inside = false;
  let engaged = false;
  let explored = false;
  let returning = false;
  let movedAt = 0;
  let approachStarted: number | null = null;
  let previous: number | null = null;
  let point: Point = { x: 488, y: 100 };
  let stillPoint = point;
  let focus = point;
  let anchor = point;
  let panAnchor: Point = { x: 0, y: 0 };
  let start = point;
  let camera = neutral();
  let dragStart = neutral();
  let retainedZoom = 1;
  let retainedDepth = 0;
  let pointerDirty = false;
  let bounds: DOMRect | null = null;
  let lastPublished = '';
  const trail: Point[] = [];
  const written = new Map<string, string>();
  const write = (name: string, value: number, unit = '') => {
    const text = value.toFixed(4) + unit;
    if (written.get(name) === text) return;
    written.set(name, text);
    element.style.setProperty(name, text);
  };
  const state = (key: string, value: string) => {
    if (element.dataset[key] !== value) element.dataset[key] = value;
  };
  const clearDwell = () => {
    if (dwellTimer !== null) clearTimeout(dwellTimer);
    dwellTimer = null;
  };
  const releaseCapture = () => {
    const id = held;
    held = null;
    if (id !== null && element.hasPointerCapture?.(id)) element.releasePointerCapture(id);
    telescope = false;
  };
  const writeOrigin = () => {
    write('--pixel-origin-x', focus.x, 'px');
    write('--pixel-origin-y', focus.y, 'px');
    write('--pixel-depth-origin-x', focus.x - 320, 'px');
    write('--pixel-depth-origin-y', focus.y - 12, 'px');
  };
  const publish = () => {
    write('--pixel-pan-x', camera.x, 'px');
    write('--pixel-pan-y', camera.y, 'px');
    write('--pixel-sky-zoom', camera.zoom);
    write('--pixel-inspection', camera.depth);
    write('--pixel-drag-energy', camera.energy);
    write('--pixel-drag-tilt', camera.tilt, 'deg');
    const signature = [point.x, point.y, camera.x, camera.y, camera.zoom, camera.energy, near]
      .map((value) => (typeof value === 'number' ? value.toFixed(4) : value))
      .join(':');
    if (signature === lastPublished) return;
    lastPublished = signature;
    element.dispatchEvent(
      new CustomEvent('observatory-camera', {
        detail: {
          x: point.x,
          y: point.y + cameraYOffset,
          panX: camera.x,
          panY: camera.y,
          zoom: camera.zoom,
          energy: camera.energy,
          near,
        },
      }),
    );
  };
  const writePointer = () => {
    if (!pointerDirty) return;
    pointerDirty = false;
    write('--pixel-cursor-x', point.x, 'px');
    write('--pixel-cursor-y', point.y, 'px');
    write(
      '--pixel-pointer-angle',
      (Math.atan2(point.y - 195, point.x - 552) * 180) / Math.PI + 90,
      'deg',
    );
    write(
      '--pixel-telescope-angle',
      (Math.atan2(point.y - 180, point.x - 552) * 180) / Math.PI + 180,
      'deg',
    );
    trailNodes.forEach((node, index) => {
      const past = trail[Math.min(index + 1, trail.length - 1)];
      if (past)
        node.setAttribute('transform', `translate(${Math.round(past.x)} ${Math.round(past.y)})`);
    });
  };
  const hardReset = () => {
    clearDwell();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    releaseCapture();
    near = inside = engaged = explored = returning = false;
    approachStarted = null;
    retainedZoom = 1;
    retainedDepth = 0;
    previous = null;
    point = focus = anchor = { x: 488, y: 100 };
    panAnchor = { x: 0, y: 0 };
    trail.length = 0;
    pointerDirty = false;
    camera = neutral();
    state('pointer', 'away');
    state('focus', 'sky');
    state('inspect', 'idle');
    write('--pixel-telescope-angle', 0, 'deg');
    writeOrigin();
    publish();
  };
  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(draw);
  };
  const armDwell = () => {
    clearDwell();
    if (engaged || held !== null || !near) return;
    dwellTimer = setTimeout(
      () => {
        dwellTimer = null;
        schedule();
      },
      Math.max(0, movedAt + 900 - performance.now()),
    );
  };
  const engage = (time: number, approach: boolean) => {
    engaged = true;
    // A new record or date updates the next inspection, not the lens currently
    // being explored. Retain its target as well as its camera state.
    focusResponse = liveResponse;
    focus = anchor = { ...point };
    panAnchor = { x: camera.x, y: camera.y };
    if (approach) approachStarted = time;
    writeOrigin();
    clearDwell();
  };
  const targetFor = (time: number): Camera => {
    if (returning || !near) return neutral();
    const drag = held !== null;
    if (!engaged && !drag && time - movedAt >= 900) engage(movedAt + 900, true);
    const dwell = approachStarted === null ? 0 : clamp((time - approachStarted) / 3500, 0, 1);
    const eased = dwell * dwell * (3 - 2 * dwell);
    const dx = point.x - start.x,
      dy = point.y - start.y;
    if (drag)
      return {
        x: clamp(dragStart.x - dx * 0.55, -145, 145),
        y: clamp(dragStart.y - dy * 0.4, -85, 85),
        zoom: Math.max(
          dragStart.zoom,
          1.18 + Math.min(1, Math.hypot(dx, dy) / 190) * (0.65 + focusResponse * 0.35),
        ),
        depth: Math.max(dragStart.depth, Math.min(0.8, Math.hypot(dx, dy) / 180)),
        energy: Math.min(1, Math.hypot(dx, dy) / 120),
        tilt: clamp(dx / 55, -3, 3),
      };
    return {
      x: engaged
        ? clamp(panAnchor.x + (anchor.x - point.x) * 0.45, -145, 145)
        : (point.x / 960 - 0.5) * 24 * liveResponse,
      y: engaged
        ? clamp(panAnchor.y + (anchor.y - point.y) * 0.3, -85, 85)
        : ((point.y + 100) / 400 - 0.5) * 14 * liveResponse,
      zoom: Math.max(retainedZoom, 1 + eased * (1 + focusResponse * 0.5)),
      depth: Math.max(retainedDepth, eased),
      energy: 0,
      tilt: 0,
    };
  };
  function draw(time: number) {
    frame = null;
    if (!near && !returning) return;
    const dt = previous === null ? 16 : clamp(time - previous, 0, 40);
    previous = time;
    const target = targetFor(time);
    const ease = 1 - Math.exp(-dt / (returning ? 260 : held !== null ? 80 : 170));
    const speeds: Camera = { x: 650, y: 420, zoom: 1.4, depth: 1.4, energy: 4, tilt: 18 };
    for (const key of ['x', 'y', 'zoom', 'depth', 'energy', 'tilt'] as const) {
      const delta = (target[key] - camera[key]) * ease;
      camera[key] += clamp(delta, (-speeds[key] * dt) / 1000, (speeds[key] * dt) / 1000);
      if (Math.abs(target[key] - camera[key]) < 0.0005) camera[key] = target[key];
    }
    writePointer();
    publish();
    state(
      'inspect',
      returning
        ? 'returning'
        : held !== null
          ? 'dragging'
          : engaged
            ? explored
              ? 'exploring'
              : 'approaching'
            : 'waiting',
    );
    const unsettled = (Object.keys(target) as (keyof Camera)[]).some(
      (key) => camera[key] !== target[key],
    );
    const approaching = approachStarted !== null && time < approachStarted + 3500;
    if (unsettled || approaching) schedule();
    else {
      previous = null;
      if (returning) {
        returning = false;
        state('inspect', 'idle');
      }
    }
  }
  const locate = (event: PointerEvent) => {
    if (!svg) return null;
    bounds ??= svg.getBoundingClientRect();
    const box = bounds,
      view = svg.viewBox?.baseVal ?? { x: 0, y: -100, width: 960, height: 400 };
    if (!box.width || !box.height) return null;
    // Match the renderer's xMidYMid meet transformation. The complete original
    // viewBox remains interactive; frame/sill bounds are outside this SVG.
    const scale = Math.min(box.width / view.width, box.height / view.height);
    const left = box.left + (box.width - view.width * scale) / 2;
    const top = box.top + (box.height - view.height * scale) / 2;
    inside =
      event.clientX >= left &&
      event.clientX <= left + view.width * scale &&
      event.clientY >= top &&
      event.clientY <= top + view.height * scale;
    return {
      x: (event.clientX - left) / scale + view.x,
      y: (event.clientY - top) / scale + view.y,
    };
  };
  const beginReturn = () => {
    clearDwell();
    releaseCapture();
    near = inside = engaged = explored = false;
    approachStarted = null;
    retainedZoom = 1;
    retainedDepth = 0;
    returning = true;
    state('pointer', 'away');
    state('focus', 'sky');
    state('inspect', 'returning');
    trail.length = 0;
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      hardReset();
      return;
    }
    if (event.target instanceof Element && event.target.closest('.landscape-controls')) {
      if (near) beginReturn();
      return;
    }
    const next = locate(event);
    if (!next) return;
    if (!inside && held === null) {
      if (near) beginReturn();
      return;
    }
    if (returning && camera.zoom > 1.03) {
      // Re-entering during the return keeps its current lens, avoiding an
      // origin change while the scene is still enlarged.
      engaged = explored = true;
      retainedZoom = camera.zoom;
      retainedDepth = camera.depth;
      anchor = { ...next };
      panAnchor = { x: camera.x, y: camera.y };
    }
    // Once inspection starts, pointer movement explores the retained view. It
    // never changes the zoom origin or restarts the dwell countdown.
    if (!engaged && (!near || Math.hypot(next.x - stillPoint.x, next.y - stillPoint.y) > 2)) {
      movedAt = performance.now();
      stillPoint = next;
    } else if (engaged && held === null && Math.hypot(next.x - point.x, next.y - point.y) > 0.2)
      explored = true;
    point = next;
    near = true;
    returning = false;
    state('pointer', 'near');
    state('focus', held !== null ? (telescope ? 'telescope' : 'sky-drag') : 'sky');
    trail.unshift(point);
    trail.length = Math.min(8, trail.length);
    pointerDirty = true;
    if (!engaged) armDwell();
    schedule();
  };
  const down = (event: PointerEvent) => {
    if (
      event.pointerType === 'touch' ||
      event.button !== 0 ||
      !(event.target instanceof Element) ||
      !event.target.closest(svgSelector)
    )
      return;
    move(event);
    if (!inside) return;
    if (!engaged) engage(performance.now(), false);
    held = event.pointerId;
    telescope = Boolean(event.target.closest('[data-telescope]'));
    start = { ...point };
    dragStart = { ...camera };
    element.setPointerCapture?.(held);
    state('focus', telescope ? 'telescope' : 'sky-drag');
    clearDwell();
    schedule();
  };
  const release = () => {
    if (held === null) return;
    const target = targetFor(performance.now());
    releaseCapture();
    if (!inside) {
      beginReturn();
      return;
    }
    // Preserve the completed drag's zoom and position, then allow gentle hover
    // exploration from the release point instead of jumping to the wide view.
    retainedZoom = Math.max(camera.zoom, target.zoom);
    retainedDepth = Math.max(camera.depth, target.depth);
    panAnchor = { x: target.x, y: target.y };
    anchor = { ...point };
    explored = true;
    state('focus', 'sky');
    schedule();
  };
  const leave = () => {
    inside = false;
    if (held === null) beginReturn();
  };
  const invalidate = () => {
    bounds = null;
    if (near) beginReturn();
  };
  const visibility = () => {
    if (document.visibilityState === 'hidden') hardReset();
  };
  const resizeObserver =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          bounds = null;
        });
  if (svg) resizeObserver?.observe(svg);
  hardReset();
  element.addEventListener('pointerenter', move);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointerleave', leave);
  element.addEventListener('pointercancel', beginReturn);
  element.addEventListener('lostpointercapture', release);
  window.addEventListener('pointerup', release);
  window.addEventListener('blur', beginReturn);
  window.addEventListener('resize', invalidate);
  window.addEventListener('scroll', invalidate, true);
  document.addEventListener('visibilitychange', visibility);
  const cleanup = () => {
    hardReset();
    resizeObserver?.disconnect();
    element.removeEventListener('pointerenter', move);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointerleave', leave);
    element.removeEventListener('pointercancel', beginReturn);
    element.removeEventListener('lostpointercapture', release);
    window.removeEventListener('pointerup', release);
    window.removeEventListener('blur', beginReturn);
    window.removeEventListener('resize', invalidate);
    window.removeEventListener('scroll', invalidate, true);
    document.removeEventListener('visibilitychange', visibility);
  };
  cleanup.updateResponse = (next: number) => {
    if (!Number.isFinite(next)) return;
    liveResponse = clamp(next, 0, 1);
    if (near && !engaged) schedule();
  };
  cleanup.inspect = () => {
    if (!svg || (engaged && !returning)) return;
    const view = svg.viewBox?.baseVal ?? { x: 0, y: -100, width: 960, height: 400 };
    point = stillPoint = { x: view.x + view.width / 2, y: view.y + view.height / 2 };
    near = inside = true;
    explored = returning = false;
    pointerDirty = true;
    state('pointer', 'near');
    state('focus', 'sky');
    engage(performance.now(), true);
    schedule();
  };
  cleanup.reset = beginReturn;
  return cleanup;
}
