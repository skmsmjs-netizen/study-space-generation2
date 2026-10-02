import { useEffect, useRef, useState } from 'react';
import Plotly, {
  type Data,
  type Layout,
  type Annotations,
  type Camera,
  type PlotlyHTMLElement,
} from 'plotly.js-dist-min';
import {
  cross,
  norm,
  scale,
  type Vec3,
  type MathScene,
  type buildScene,
} from '../domain/math-explorer';
import type { MathZoomRef } from './math-view-controls';
import { fadeNumbers, readPlotColor, vectorDisplayLimit } from './math-plot-presentation';
import { plotlyMathLabels } from './math-plot-labels';
import { mathPlotConfig, mathPlotPan, type MathPan, useMathPlotTouch } from './math-plot-touch';
import type { TemplateView } from '../domain/math-templates';
import { MathCameraControls, cameraOffset, cameraFacing, defaultMathCamera, focusPointCamera, renderMathCamera, recoverMathCamera, zoomCamera } from './math-plot-camera';
import { sceneMetric, prepareUnboundedScene, followUnboundedScene, followUnboundedFunction, unboundedAxisAnnotations, type CurveViewCache } from './math-unbounded-scene';

// The package's Camera type predates the documented projection setting.
type PlotCamera = Partial<Camera> & { projection?: { type: 'orthographic' | 'perspective' } };

export function MathExplorerPlot({
  scene,
  result,
  viewRevision,
  zoomRef,
  onZoomReady,
  initialView,
  onView,
}: {
  scene: MathScene;
  result: ReturnType<typeof buildScene>;
  viewRevision: number;
  zoomRef: MathZoomRef;
  onZoomReady: (ready: boolean) => void;
  initialView?: TemplateView;
  onView?: (view: TemplateView) => void;
}) {
  const viewCallback = useRef(onView);
  viewCallback.current = onView;
  const startingView = useRef(initialView);
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(0);
  const [ready, setReady] = useState(false);
  const camera = useRef<PlotCamera>(defaultMathCamera());
  const pointFocus = useRef<TemplateView['pointFocus']>(initialView?.pointFocus);
  const [pointFocused, setPointFocused] = useState(Boolean(initialView?.pointFocus));
  const metricRef = useRef<ReturnType<typeof sceneMetric> | undefined>(undefined);
  const ranges = useRef<[number[], number[]]>([
    [-1, 1],
    [-1, 1],
  ]);
  const viewKey = useRef('');
  const listening = useRef(false);
  const numberValues = useRef([0, 0, 0]);
  const numbers = useRef<{ update: () => void; dispose: () => void } | null>(null);
  const pan = useRef<MathPan | null>(null);
  const curveCache = useRef<CurveViewCache>({});
  useMathPlotTouch(host, zoomRef, pan);
  useEffect(() => {
    const element = host.current;
    const update = () => numbers.current?.update();
    element?.addEventListener('mathplotgestureend', update);
    return () => element?.removeEventListener('mathplotgestureend', update);
  }, []);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style', 'class'],
    });
    const media = matchMedia('(prefers-color-scheme: dark)');
    const changed = () => setTheme((v) => v + 1);
    media.addEventListener('change', changed);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', changed);
    };
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: theme changes invalidate CSS token reads inside this effect.
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let active = true;
    let infinite: {update:()=>void;dispose:()=>void} | undefined;
    const disposeLabels = plotlyMathLabels(element);
    const styles = getComputedStyle(element);
    const color = (name: string) => styles.getPropertyValue(name).trim();
    const ink = color('--color-text'),
      curveColor = color('--color-math-curve'),
      blue = color('--color-math-point'),
      tangent = color('--color-math-tangent'),
      green = color('--color-math-normal'),
      binormal = color('--color-math-binormal');
    const type = scene.mode === 'curve' ? 'scatter3d' : 'scatter';
    const finite = result.points.filter((point) => point !== null);
    const bounds = [0, 1, 2].map((i) =>
      finite.length
        ? [Math.min(...finite.map((v) => v[i])), Math.max(...finite.map((v) => v[i]))]
        : [-1, 1],
    );
    const metric = sceneMetric(bounds);
    metricRef.current = metric;
    const extent = Math.max(...bounds.map(([min, max]) => max - min));
    const length = Math.max(extent * 0.18, 0.5);
    const key = `${scene.mode}:${viewRevision}`;
    if (viewKey.current !== key) {
      if (viewKey.current) {
        pointFocus.current = undefined;
        setPointFocused(false);
      }
      camera.current = defaultMathCamera();
      ranges.current = [
        [bounds[0][0] - length, bounds[0][1] + length],
        [bounds[1][0] - length, bounds[1][1] + length],
      ];
      if (!viewKey.current && startingView.current) {
        if (startingView.current.camera)
          camera.current = { ...startingView.current.camera, projection: { type: 'orthographic' } };
        if (startingView.current.ranges)
          ranges.current = [startingView.current.ranges.x, startingView.current.ranges.y];
      }
      viewKey.current = key;
    }
    // Follow only after the user asks to inspect the point. Keep their rotation
    // and zoom while t, formula parameters, or the viewport change.
    if (scene.mode === 'curve' && pointFocus.current && result.point)
      camera.current = focusPointCamera(camera.current, result.point, metric);
    const rememberView = () => viewCallback.current?.({
      camera: camera.current as TemplateView['camera'],
      pointFocus: pointFocus.current,
      ranges: {
        x: ranges.current[0] as [number, number],
        y: ranges.current[1] as [number, number],
      },
    });
    const coordinates = (index: number) =>
      result.points.flatMap((point, i) =>
        result.breakBefore[i] ? [null, point?.[index] ?? null] : [point?.[index] ?? null],
      );
    const traces: Data[] = [
      {
        type,
        mode: 'lines',
        name: '곡선',
        x: coordinates(0),
        y: coordinates(1),
        ...(scene.mode === 'curve' ? { z: coordinates(2) } : {}),
        connectgaps: false,
        line: { color: curveColor, width: 2 },
        hovertemplate:
          'x=%{x:.2f}<br>y=%{y:.2f}' +
          (scene.mode === 'curve' ? '<br>z=%{z:.2f}' : '') +
          '<extra></extra>',
      },
    ];
    if (result.point) {
      const p = result.point;
      const foot = [p[0], p[1], 0];
      const segments =
        scene.mode === 'curve'
          ? [
              [p, foot],
              [foot, [p[0], 0, 0]],
              [foot, [0, p[1], 0]],
              [p, [0, 0, p[2]]],
            ]
          : [
              [p, [p[0], 0, 0]],
              [p, [0, p[1], 0]],
            ];
      const guideCoordinates = (index: number) =>
        segments.flatMap(([start, end]) => [start[index], end[index], null]);
      traces.push({
        type,
        mode: 'lines',
        name: '좌표 보조선',
        x: guideCoordinates(0),
        y: guideCoordinates(1),
        ...(scene.mode === 'curve' ? { z: guideCoordinates(2) } : {}),
        line: { color: color('--color-muted'), width: 1, dash: 'dash' },
        hoverinfo: 'skip',
        showlegend: false,
      });
      traces.push({
        type,
        mode: 'markers',
        name: '축 위 좌표',
        x: [p[0], 0, ...(scene.mode === 'curve' ? [0] : [])],
        y: [0, p[1], ...(scene.mode === 'curve' ? [0] : [])],
        ...(scene.mode === 'curve' ? { z: [0, 0, p[2]] } : {}),
        marker: { color: blue, size: 3, symbol: 'circle-open', line: { color: blue, width: 1 } },
        hoverinfo: 'skip',
        showlegend: false,
      });
      traces.push({
        type,
        mode: 'markers',
        name: '현재 점',
        x: [p[0]],
        y: [p[1]],
        ...(scene.mode === 'curve' ? { z: [p[2]] } : {}),
        marker: { color: blue, size: scene.mode === 'curve' ? 4 : 7 },
        hovertemplate:
          'x=%{x:.2f}<br>y=%{y:.2f}' +
          (scene.mode === 'curve' ? '<br>z=%{z:.2f}' : '') +
          '<extra>현재 점</extra>',
      });
    }
    // Pixel offsets are supported by scene annotations. Keep T/N/B as direction
    // glyphs anchored to the exact point instead of world-length line traces.
    // Parallel projection uses the same camera-plane direction as the default
    // native renderer, without perspective changing the meaning of unit lengths.
    const vectorAnnotations = (): Array<Partial<Annotations> & { z: number }> => {
      const p = result.point;
      if (scene.mode !== 'curve') return [];
      const offset = cameraOffset(camera.current);
      const up = camera.current.up ?? { x: 0, y: 0, z: 1 };
      const unit = (v: Vec3): Vec3 => scale(v, 1 / Math.max(norm(v), 1e-12));
      const direction = unit(offset);
      let right = cross([up.x ?? 0, up.y ?? 0, up.z ?? 1], direction);
      if (norm(right) < 1e-8) right = cross([0, 1, 0], direction);
      right = unit(right);
      const vertical = unit(cross(direction, right));
      const dot = (a: Vec3, b: Vec3) => a.reduce((sum, value, i) => sum + value * b[i], 0);
      const axes = unboundedAxisAnnotations(metric, camera.current, element.clientWidth, element.clientHeight, {grid:color('--color-border'),axis:color('--color-muted'),background:color('--color-surface')});
      if (!p || !scene.vectors) return axes;
      const distance = Math.hypot(...offset);
      const total = Math.max(...bounds.map(([a, b]) => b - a + 2 * length), 1);
      const density =
        (Math.min(element.clientWidth, element.clientHeight) * 2) /
        (Math.max(distance, 0.1) * total);
      // These are direction glyphs, not world-length vectors. Keep them legible
      // while the whole curve is fitted, and bounded when the user zooms in.
      const pixels = Math.max(32, Math.min(
        vectorDisplayLimit(element.clientWidth, element.clientHeight),
        1.3 * density,
      ));
      const annotations = (
        [
          ['T', result.vectors?.T, tangent],
          ['N', result.vectors?.N, green],
          ['B', result.vectors?.B, binormal],
        ] as const
      ).flatMap(([name, v, c]) => {
        if (!v) return [];
        const ax = dot(v, right) * pixels,
          ay = -dot(v, vertical) * pixels;
        return [
          {
            x: p[0],
            y: p[1],
            z: p[2],
            text: name,
            ax,
            ay,
            showarrow: true,
            arrowside: 'start' as const,
            arrowhead: 0,
            startarrowhead: 3,
            startarrowsize: 1.2,
            arrowwidth: 1.5,
            arrowcolor: c,
            font: { color: c, size: 12 },
            bgcolor: color('--color-surface'),
            visible: Math.hypot(ax, ay) >= 1,
          },
        ];
      });
      return [...axes, ...annotations];
    };
    let vectorFrame = 0;
    const updateVectors = () => {
      if (scene.mode !== 'curve' || vectorFrame || !active) return;
      vectorFrame = requestAnimationFrame(() => {
        vectorFrame = 0;
        if (active) {
          const update: Partial<Layout> & Record<string, unknown> = {
            'scene.annotations': vectorAnnotations(),
          };
          void Plotly.relayout(element, update).catch(() => {});
        }
      });
    };
    const numberStyle = (index: number) => ({
      tickfont: {
        color: `rgba(${readPlotColor(element, '--color-muted').join(',')},${numberValues.current[index]})`,
      },
      showticklabels: numberValues.current[index] > 0.02,
    });
    const axis = {
      color: color('--color-muted'),
      ...numberStyle(0),
      gridcolor: color('--color-border'),
      zerolinecolor: color('--color-muted'),
      showspikes: false,
      tickformat: 'd',
      tickmode: 'linear' as const,
      tick0: 0,
      dtick: 1,
      showgrid: true,
    };
    const layout: Partial<Layout> = {
      autosize: true,
      height: element.clientHeight || 460,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: ink, size: 12, family: 'KaTeX_Main, serif' },
      margin: {
        l: scene.mode === 'curve' ? 0 : 45,
        r: 12,
        t: 0,
        b: scene.mode === 'curve' ? 0 : 40,
      },
      showlegend: false,
      dragmode: 'pan',
      uirevision: `${scene.mode}:${viewRevision}`,
      xaxis: {
        ...axis,
        showticklabels: true,
        title: { text: 'x' },
        range: ranges.current[0],
        automargin: true,
      },
      yaxis: {
        ...axis,
        ...numberStyle(1),
        showticklabels: true,
        title: { text: 'y' },
        range: ranges.current[1],
        automargin: true,
      },
      scene: {
        hovermode: false,
        dragmode: 'orbit',
        aspectmode: 'data',
        bgcolor: 'transparent',
        xaxis: {
          ...axis,
          title: { text: '' },
          range: [bounds[0][0] - length, bounds[0][1] + length],
        },
        yaxis: {
          ...axis,
          ...numberStyle(1),
          title: { text: '' },
          range: [bounds[1][0] - length, bounds[1][1] + length],
        },
        zaxis: {
          ...axis,
          ...numberStyle(2),
          title: { text: '' },
          range: [bounds[2][0] - length, bounds[2][1] + length],
        },
        camera: renderMathCamera(camera.current),
        annotations: vectorAnnotations(),
      },
    };
    const scaffoldIndex = traces.length;
    const world = scene.mode === 'curve' && layout.scene ? prepareUnboundedScene(layout.scene,bounds,element.clientWidth,element.clientHeight,{grid:color('--color-border'),axis:color('--color-muted'),background:color('--color-surface')},camera.current) : undefined;
    if(world) {
      traces.push(...world.scaffold.traces);
      // The scene has no floating coordinate popup; exclude all 3D traces
      // from hover selection as well as hiding the native scene hover layer.
      for (const trace of traces) {
        const hover = trace as Data & { hoverinfo?: string; hovertemplate?: string };
        hover.hoverinfo = 'skip';
        hover.hovertemplate = undefined;
      }
    }
    Plotly.react(element, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        infinite = world ? followUnboundedScene(element,world,scaffoldIndex,{sample:result.sample,range:[result.min,result.max],index:0,signature:result.sampleKey,cache:curveCache.current},()=>camera.current) : followUnboundedFunction(element,result.sample,result.sampleKey,curveCache.current);
        if (!listening.current) {
          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {
            // Published event typing covers 2D only; the documented 3D event includes scene.camera.
            const event = update as unknown as Record<string, unknown>;
            if (event['scene.camera']) camera.current = recoverMathCamera(event['scene.camera'] as Partial<Camera>, camera.current);
            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {
              const range = event[`${axisName}.range`] as number[] | undefined;
              if (range) ranges.current[index] = range;
              for (const edge of [0, 1]) {
                const value = event[`${axisName}.range[${edge}]`];
                if (typeof value === 'number') ranges.current[index][edge] = value;
              }
            }
            if (Object.keys(event).some((key) => key === 'scene.camera' || key.includes('.range')))
              rememberView();
            if (
              Object.keys(event).some(
                (key) =>
                  key === 'scene.camera' ||
                  key.includes('.range') ||
                  key === 'width' ||
                  key === 'height',
              )
            )
              numbers.current?.update();
          });
          listening.current = true;
        }
        numbers.current?.dispose();
        const gray = readPlotColor(element, '--color-muted');
        const fade = scene.mode === 'function' ? fadeNumbers(element, (opacity) => {
          numberValues.current = opacity;
          // SVG opacity preserves the temporary ranges of an active 2D pan.
          ['.xtick text', '.ytick text'].forEach((selector, i) => {
            for (const text of element.querySelectorAll<SVGTextElement>(selector)) {
              text.style.fill = `rgb(${gray.join(',')})`;
              text.style.opacity = String(opacity[i]);
            }
          });
        }, numberValues.current) : undefined;
        numbers.current = {
          update() {
            updateVectors();
            infinite?.update();
            fade?.update([
              element.clientWidth / Math.max(ranges.current[0][1] - ranges.current[0][0], Number.EPSILON),
              element.clientHeight / Math.max(ranges.current[1][1] - ranges.current[1][0], Number.EPSILON),
            ]);
          },
          dispose: () => fade?.dispose(),
        };
        numbers.current.update();
        zoomRef.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          let update: Record<string, unknown>;
          if (scene.mode === 'curve') {
            camera.current = zoomCamera(camera.current, factor);
            update = { 'scene.camera': renderMathCamera(camera.current) };
          } else {
            ranges.current = ranges.current.map(([low, high]) => {
              const center = (low + high) / 2,
                half = (high - low) / (2 * factor);
              return half > 1e-8 && half < 1e9 ? [center - half, center + half] : [low, high];
            }) as [number[], number[]];
            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };
          }
          void Plotly.relayout(element, update).then(() => numbers.current?.update()).catch(() => {
            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');
            onZoomReady(false);
          });
        };
        pan.current =
          scene.mode === 'function'
            ? mathPlotPan(
                element,
                () => ranges.current,
                (next) => {
                  ranges.current = next as [number[], number[]];
                  void Plotly.relayout(element, {
                    'xaxis.range': next[0],
                    'yaxis.range': next[1],
                  } as Partial<Layout> & Record<string, unknown>).catch(() =>
                    setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                  );
                },
              )
            : null;
        setReady(true);
        onZoomReady(true);
        rememberView();
      })
      .catch(() => {
        if (active) {
          setReady(false);
          onZoomReady(false);
          setError('그래프를 표시하지 못했습니다. 브라우저의 그래픽 지원을 확인해 주세요.');
        }
      });
    return () => {
      active = false;
      infinite?.dispose();
      pan.current = null;
      disposeLabels();
      cancelAnimationFrame(vectorFrame);
      numbers.current?.dispose();
    };
  }, [scene, result, theme, viewRevision, zoomRef, onZoomReady, pointFocused]);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (
          !element.classList.contains('js-plotly-plot') ||
          !element.clientWidth ||
          !element.clientHeight
        )
          return;
        // Setting height first can leave Plotly's cached width unchanged across
        // a breakpoint. Resize both dimensions without resetting the camera.
        void Plotly.relayout(element, {
          width: element.clientWidth,
          height: element.clientHeight,
        }).catch(() => setError('그래프 크기를 맞추지 못했습니다. 화면을 다시 열어 주세요.'));
      });
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      numbers.current?.dispose();
      numbers.current = null;
      Plotly.purge(element);
      listening.current = false;
      zoomRef.current = null;
      onZoomReady(false);
    };
  }, [zoomRef, onZoomReady]);
  return (
    <>
      {scene.mode === 'curve' && <MathCameraControls
        disabled={!ready}
        vectors={scene.vectors ? result.vectors ?? undefined : undefined}
        readCamera={() => camera.current}
        pointFocus={{
          active: pointFocused,
          available: Boolean(result.point),
          toggle: () => {
            if (pointFocus.current) {
              camera.current = { ...pointFocus.current.returnCamera, projection: { type: 'orthographic' } };
              pointFocus.current = undefined;
              setPointFocused(false);
            } else if (result.point && metricRef.current) {
              pointFocus.current = { returnCamera: structuredClone(camera.current) as NonNullable<TemplateView['camera']> };
              const distance = Math.min(Math.hypot(...cameraOffset(camera.current)), 0.5);
              let next = focusPointCamera(camera.current, result.point, metricRef.current, distance);
              const { T, N, B } = scene.vectors ? result.vectors ?? {} : {};
              if (T && N && B) {
                const direction = T.map((v, i) => v + N[i] + B[i]) as Vec3;
                next = cameraFacing(next, direction[2] < 0 ? scale(direction, -1) : direction);
              }
              camera.current = next;
              setPointFocused(true);
            }
          },
        }}
        applyCamera={(next) => {
          if (!host.current) return;
          camera.current = next;
          void Plotly.relayout(host.current, { 'scene.camera': renderMathCamera(next) } as Partial<Layout> & Record<string, unknown>)
            .catch(() => setError('시점을 바꾸지 못했습니다. 다시 열어 주세요.'));
        }}
      />}
      {scene.mode === 'curve' && pointFocused && <p className="math-point-focus-note">
        {result.point ? '현재 점을 따라보고 있습니다. 회전하거나 더 확대해 살펴보세요.' : '이 위치에는 점이 정의되지 않습니다. t를 옮기면 다시 따라갑니다.'}
      </p>}
      <div
        ref={host}
        className="math-plot"
        aria-label={
          scene.mode === 'curve' ? '회전 가능한 공간 곡선과 T·N·B 벡터' : '함수 그래프와 현재 점'
        }
        role="img"
      />
      {error && <p role="alert">{error} 아래 좌표와 수식은 계속 확인할 수 있습니다.</p>}
    </>
  );
}
