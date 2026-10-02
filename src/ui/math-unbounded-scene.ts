import Plotly, {
  type Data,
  type Layout,
  type PlotlyHTMLElement,
  type Annotations,
} from 'plotly.js-dist-min';
import { cross, norm, scale, type Vec3 } from '../domain/math-explorer';
import {
  continuationRange,
  sampleCurveWindow,
  type CurveSampler,
} from '../domain/math-curve-sampling';
import { cameraOffset, cameraScale, type MathCamera } from './math-plot-camera';
import { fadeNumbers } from './math-plot-presentation';

type Metric = { center: Vec3; unit: number };
type Colors = { grid: string; axis: string; background: string };
export type CurveViewCache = { key?: string; result?: ReturnType<typeof sampleCurveWindow> };
type Curve = {
  sample: CurveSampler;
  range: [number, number];
  index: number;
  signature: string;
  cache: CurveViewCache;
};
export function sceneMetric(bounds: number[][]): Metric {
  const pad = Math.max(...bounds.map(([a, b]) => b - a), 1) * 0.12;
  return {
    center: bounds.map(([a, b]) => (a + b) / 2) as Vec3,
    unit: Math.cbrt(bounds.reduce((p, [a, b]) => p * (b - a + 2 * pad), 1)),
  };
}
function sceneScaffold(
  metric: Metric,
  camera: MathCamera,
  width: number,
  height: number,
  colors: Colors,
) {
  const offset = cameraOffset(camera),
    distance = Math.max(0.08, norm(offset));
  const zoom = cameraScale(camera);
  const centerExtent = Math.max(...Object.values(camera.center ?? {}).map((v) => Math.abs(v ?? 0)), 0) / zoom;
  const radius =
    metric.unit *
      (4 * distance +
        centerExtent +
        2) +
    Math.max(...metric.center.map(Math.abs));
  const ranges = metric.center.map((c) => [c - radius, c + radius] as [number, number]);
  // Plotly's orthographic frustum has fixed height 2: camera distance alone
  // does not magnify geometry. Apply the same scale to its model and labels.
  const density = Math.max(1, height) * zoom / (2 * metric.unit);
  // Keep the clipping cube generous, but refine only the camera's visible
  // neighbourhood. This rotation-independent envelope covers every direction.
  const detailRadius =
    metric.unit *
    (distance * 0.75 * Math.max(1, width / Math.max(1, height)) +
      centerExtent +
      0.5);
  const sampleRanges = metric.center.map(
    (c) => [c - detailRadius, c + detailRadius] as [number, number],
  );
  const unit = scale(offset, 1 / distance);
  let right = cross([camera.up?.x ?? 0, camera.up?.y ?? 0, camera.up?.z ?? 1], unit);
  if (norm(right) < 1e-8) right = cross([0, 1, 0], unit);
  right = scale(right, 1 / Math.max(norm(right), 1e-12));
  const vertical = cross(unit, right);
  const step = Math.max(1, Math.ceil(12 / Math.max(density, 1e-9)), Math.ceil((2 * radius) / 220));
  const makeLine = (segments: Vec3[][], name: string, color: string, lineWidth: number): Data => ({
    type: 'scatter3d',
    mode: 'lines',
    name,
    showlegend: false,
    hoverinfo: 'skip',
    connectgaps: false,
    x: segments.flatMap((s) => [...s.map((p) => p[0]), null]),
    y: segments.flatMap((s) => [...s.map((p) => p[1]), null]),
    z: segments.flatMap((s) => [...s.map((p) => p[2]), null]),
    line: { color, width: lineWidth },
  });
  const grid: Vec3[][] = [];
  for (let x = Math.ceil(ranges[0][0] / step) * step; x <= ranges[0][1]; x += step)
    if (x !== 0)
      grid.push([
        [x, ranges[1][0], 0],
        [x, ranges[1][1], 0],
      ]);
  for (let y = Math.ceil(ranges[1][0] / step) * step; y <= ranges[1][1]; y += step)
    if (y !== 0)
      grid.push([
        [ranges[0][0], y, 0],
        [ranges[0][1], y, 0],
      ]);
  const axes: Vec3[][] = [],
    ticks: Vec3[][] = [];
  const names: Array<Partial<Annotations> & { z: number }> = [];
  const densities: number[] = [];
  const texts: Data[] = [];
  for (let i = 0; i < 3; i++) {
    const a: Vec3 = [0, 0, 0],
      b: Vec3 = [0, 0, 0];
    a[i] = ranges[i][0];
    b[i] = ranges[i][1];
    axes.push([a, b]);
    const projected = Math.hypot(right[i], vertical[i]);
    densities[i] = projected * density;
    // Tick labels stay at integer coordinates; they fade rather than switching to fractions.
    const tickStep = Math.max(1, Math.ceil((2 * radius) / 240));
    const positions: Vec3[] = [],
      labels: string[] = [];
    let perpendicular: Vec3 = [
      right[0] * -vertical[i] + vertical[0] * right[i],
      right[1] * -vertical[i] + vertical[1] * right[i],
      right[2] * -vertical[i] + vertical[2] * right[i],
    ];
    perpendicular = scale(perpendicular, 1 / Math.max(norm(perpendicular), 1e-12));
    for (
      let value = Math.ceil(ranges[i][0] / tickStep) * tickStep;
      value <= ranges[i][1];
      value += tickStep
    ) {
      if (value === 0) continue;
      const at: Vec3 = [0, 0, 0];
      at[i] = value;
      const delta = scale(perpendicular, 2 / Math.max(density, 0.001));
      ticks.push([at.map((v, j) => v - delta[j]) as Vec3, at.map((v, j) => v + delta[j]) as Vec3]);
      positions.push(
        at.map((v, j) => v + (perpendicular[j] * 10) / Math.max(density, 0.001)) as Vec3,
      );
      labels.push(String(value));
    }
    texts.push({
      type: 'scatter3d',
      mode: 'text',
      name: `${['x', 'y', 'z'][i]}축 눈금값`,
      showlegend: false,
      hoverinfo: 'skip',
      x: positions.map((p) => p[0]),
      y: positions.map((p) => p[1]),
      z: positions.map((p) => p[2]),
      text: labels,
      textfont: { color: colors.axis, size: 11, family: 'Arial, sans-serif' },
      opacity: 0,
    });
    const at: Vec3 = [0, 0, 0];
    at[i] = Math.min(
      radius * 0.8,
      (Math.min(width, height) * 0.32) / Math.max(densities[i], 0.001),
    );
    names.push({
      x: at[0],
      y: at[1],
      z: at[2],
      text: ['x', 'y', 'z'][i],
      showarrow: false,
      xshift: 16,
      yshift: 16,
      font: { color: colors.axis, size: 13 },
      bgcolor: colors.background,
    });
  }
  const axisLayout = Object.fromEntries(
    ['xaxis', 'yaxis', 'zaxis'].map((name, i) => [
      name,
      {
        range: ranges[i],
        autorange: false,
        title: { text: '' },
        // Coordinates are drawn by the scaffold. Hide the native axes entirely,
        // including their hover/spike state, rather than just their visible parts.
        visible: false,
        showgrid: false,
        showbackground: false,
        showline: false,
        zeroline: false,
        ticks: '',
        showticklabels: false,
        showspikes: false,
      },
    ]),
  );
  return {
    ranges,
    sampleRanges,
    density,
    densities,
    step,
    traces: [
      makeLine(grid, '좌표 바탕 모눈', colors.grid, 1),
      makeLine(axes, '양방향 좌표축', colors.axis, 1.3),
      makeLine(ticks, '정수 눈금', colors.axis, 1),
      ...texts,
    ],
    annotations: names,
    layout: {
      ...axisLayout,
      aspectmode: 'manual',
      aspectratio: {
        x: (2 * radius * zoom) / metric.unit,
        y: (2 * radius * zoom) / metric.unit,
        z: (2 * radius * zoom) / metric.unit,
      },
    } as Partial<Layout['scene']>,
  };
}
export function prepareUnboundedScene(
  scene: Partial<Layout['scene']>,
  bounds: number[][],
  width: number,
  height: number,
  colors: Colors,
  viewCamera?: MathCamera,
) {
  const metric = sceneMetric(bounds),
    scaffold = sceneScaffold(metric, viewCamera ?? scene.camera ?? {}, width, height, colors);
  Object.assign(scene, scaffold.layout);
  return { metric, scaffold, colors };
}

/** Fixed world units: enlarging the clipping cube must never refit the camera. */
export function followUnboundedScene(
  node: HTMLElement,
  start: ReturnType<typeof prepareUnboundedScene>,
  firstIndex: number,
  curve?: Curve,
  readCamera?: () => MathCamera,
) {
  const plot = node as PlotlyHTMLElement;
  let active = true,
    frame = 0,
    busy = false,
    pending = false,
    key = '',
    curveKey = '';
  let pendingOpacity: number[] | undefined;
  const isCurrent = () => active && node.isConnected;
  const fade = fadeNumbers(node, (values) => {
    if (!isCurrent()) return;
    // Fade frames and geometry share the same queue. Plotly's WebGL state must
    // not receive a second restyle while a relayout/restyle is still resolving.
    pendingOpacity = values;
    if (node.dataset.mathDragging !== 'true') update();
  });
  const update = () => {
    if (!isCurrent() || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      void refresh();
    });
  };
  const refresh = async () => {
    if (!isCurrent()) return;
    if (busy) {
      pending = true;
      return;
    }
    const camera = readCamera?.() ?? plot.layout.scene?.camera ?? {};
    const next = sceneScaffold(
      start.metric,
      camera,
      node.clientWidth,
      node.clientHeight,
      start.colors,
    );
    const nextKey = JSON.stringify([
      next.ranges,
      next.step,
      camera.eye,
      camera.up,
      node.clientWidth,
      node.clientHeight,
    ]);
    const geometryChanged = nextKey !== key;
    if (!geometryChanged && !pendingOpacity) return;
    busy = true;
    try {
      if (geometryChanged) {
        fade.update(next.densities);
        const layout: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(next.layout)) layout[`scene.${k}`] = v;
        // Keep TNB annotations owned by the curve renderer. Generic plots use these true-axis titles.
        if (!curve) layout['scene.annotations'] = next.annotations;
        await Plotly.relayout(plot, layout);
        if (!isCurrent()) return;
        for (let i = 0; i < next.traces.length; i++) {
          const trace = next.traces[i] as { x: unknown; y: unknown; z: unknown; text?: unknown };
          await Plotly.restyle(
            plot,
            {
              x: [trace.x],
              y: [trace.y],
              z: [trace.z],
              ...(trace.text ? { text: [trace.text] } : {}),
            } as unknown as Partial<Data>,
            [firstIndex + i],
          );
          if (!isCurrent()) return;
        }
        const nextCurveKey = JSON.stringify([
          next.ranges,
          next.sampleRanges,
          Math.round(next.density * 100),
        ]);
        if (curve && nextCurveKey !== curveKey) {
          const cacheKey = JSON.stringify([
            curve.signature,
            curve.range,
            next.ranges,
            next.sampleRanges,
            next.density,
          ]);
          const result =
            curve.cache.key === cacheKey && curve.cache.result
              ? curve.cache.result
              : sampleCurveWindow(
                  curve.sample,
                  continuationRange(curve.sample, curve.range, {
                    ranges: next.ranges,
                    pixelsPerUnit: next.density,
                  }),
                  { ranges: next.sampleRanges, pixelsPerUnit: next.density },
                );
          curve.cache.key = cacheKey;
          curve.cache.result = result;
          const range = result.range;
          await Plotly.restyle(
            plot,
            {
              x: [result.points.map((p) => p?.[0] ?? null)],
              y: [result.points.map((p) => p?.[1] ?? null)],
              z: [result.points.map((p) => p?.[2] ?? null)],
            },
            [curve.index],
          );
          if (!isCurrent()) return;
          curveKey = nextCurveKey;
          node.dataset.curveWindow = JSON.stringify(range);
          node.dataset.curveSampleLimited = String(result.limited);
        }
        key = nextKey;
        node.dataset.worldGrid = 'unbounded';
        node.dataset.worldGridStep = String(next.step);
      }
      if (pendingOpacity && node.dataset.mathDragging !== 'true') {
        const values = pendingOpacity;
        pendingOpacity = undefined;
        await Plotly.restyle(plot, { opacity: values } as unknown as Partial<Data>, [
          firstIndex + 3,
          firstIndex + 4,
          firstIndex + 5,
        ]);
      }
    } catch (error) {
      // A disposed controller can finish after its WebGL scene is purged.
      // Failures of the current visible graph must remain observable.
      if (isCurrent()) throw error;
    } finally {
      busy = false;
      if (isCurrent() && (pending || (pendingOpacity && node.dataset.mathDragging !== 'true'))) {
        pending = false;
        update();
      }
    }
  };
  const changed = (event: unknown) => {
    if (
      Object.keys(event as Record<string, unknown>).some(
        (k) => k.startsWith('scene.camera') || k === 'width' || k === 'height',
      )
    )
      update();
  };
  plot.on('plotly_relayout', changed);
  node.addEventListener('mathplotgestureend', update);
  const resize = new ResizeObserver(update);
  resize.observe(node);
  update();
  return {
    update,
    dispose() {
      active = false;
      pending = false;
      pendingOpacity = undefined;
      resize.disconnect();
      fade.dispose();
      cancelAnimationFrame(frame);
      (
        plot as PlotlyHTMLElement & {
          removeListener?: (name: string, listener: (event: unknown) => void) => void;
        }
      ).removeListener?.('plotly_relayout', changed);
      node.removeEventListener('mathplotgestureend', update);
    },
  };
}

export function unboundedAxisAnnotations(
  metric: Metric,
  camera: MathCamera,
  width: number,
  height: number,
  colors: Colors,
) {
  return sceneScaffold(metric, camera, width, height, colors).annotations;
}

export function followUnboundedFunction(
  node: HTMLElement,
  sample: CurveSampler,
  signature: string,
  cache: CurveViewCache,
) {
  const plot = node as PlotlyHTMLElement;
  let active = true,
    frame = 0,
    busy = false,
    pending = false,
    key = '';
  const refresh = async () => {
    if (!active) return;
    if (busy) {
      pending = true;
      return;
    }
    const x = plot.layout.xaxis?.range,
      y = plot.layout.yaxis?.range;
    if (!x || !y) return;
    const nextKey = JSON.stringify([x, y, node.clientWidth, node.clientHeight]);
    if (key === nextKey) return;
    key = nextKey;
    busy = true;
    const pad = (x[1] - x[0]) * 0.1,
      range: [number, number] = [x[0] - pad, x[1] + pad];
    const cacheKey = JSON.stringify([signature, nextKey]);
    const result =
      cache.key === cacheKey && cache.result
        ? cache.result
        : sampleCurveWindow(sample, range, {
            ranges: [range, y as [number, number]],
            pixelsPerUnit: Math.max(
              node.clientWidth / (x[1] - x[0]),
              node.clientHeight / (y[1] - y[0]),
            ),
          });
    cache.key = cacheKey;
    cache.result = result;
    try {
      await Plotly.restyle(
        plot,
        {
          x: [result.points.map((p) => p?.[0] ?? null)],
          y: [result.points.map((p) => p?.[1] ?? null)],
        },
        [0],
      );
      node.dataset.curveWindow = JSON.stringify(range);
      node.dataset.curveSampleLimited = String(result.limited);
    } catch {
      /* A hidden or replaced graph can finish an older update. */
    } finally {
      busy = false;
      if (pending && active) {
        pending = false;
        update();
      }
    }
  };
  const update = () => {
    if (active && !frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        void refresh();
      });
  };
  const changed = (event: unknown) => {
    if (
      Object.keys(event as Record<string, unknown>).some(
        (k) =>
          k.startsWith('xaxis.range') ||
          k.startsWith('yaxis.range') ||
          k === 'width' ||
          k === 'height',
      )
    )
      update();
  };
  plot.on('plotly_relayout', changed);
  const resize = new ResizeObserver(update);
  resize.observe(node);
  update();
  return {
    update,
    dispose() {
      active = false;
      resize.disconnect();
      cancelAnimationFrame(frame);
      (
        plot as PlotlyHTMLElement & {
          removeListener?: (name: string, listener: (event: unknown) => void) => void;
        }
      ).removeListener?.('plotly_relayout', changed);
    },
  };
}
