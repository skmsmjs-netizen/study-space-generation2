import { surfaceProjection } from './math-surface-projection';
import { useEffect, useRef, useState } from 'react';
import Plotly, { type Data, type Layout, type PlotlyHTMLElement } from 'plotly.js-dist-min';
import {
  isTemplateView,
  surfaceMesh,
  type MathTemplate,
  type TemplateResult,
  type TemplateLine,
  type TemplateView,
} from '../domain/math-templates';
import { Button, ErrorState } from './index';
import { plotlyMathLabels } from './math-plot-labels';
import {
  MathCameraControls,
  defaultMathCamera,
  zoomCamera,
  renderMathCamera,
  recoverMathCamera,
  type MathCamera,
} from './math-plot-camera';
import { prepareUnboundedScene, followUnboundedScene } from './math-unbounded-scene';
import {
  mathPlotConfig,
  mathPlotZoomStep,
  mathPlotPan,
  type MathPan,
  useMathPlotTouch,
} from './math-plot-touch';

export function MathTemplatePlot({
  item,
  result,
  alternate = false,
  initialView,
  onView,
  ordinaryWheelScroll = false,
  labelledVectors = false,
  compactCamera = false,
  surfaceProjectionLabel,
}: {
  item: MathTemplate;
  result: TemplateResult;
  alternate?: boolean;
  initialView?: TemplateView;
  onView?: (view: TemplateView) => void;
  ordinaryWheelScroll?: boolean;
  labelledVectors?: boolean;
  compactCamera?: boolean;
  surfaceProjectionLabel?: string;
}) {
  const viewCallback = useRef(onView);
  viewCallback.current = onView;
  const savedView = useRef(initialView),
    viewKey = useRef('');
  const camera = useRef<MathCamera>({
    ...defaultMathCamera(),
    ...initialView?.camera,
    projection: { type: 'orthographic' },
  });
  const host = useRef<HTMLDivElement>(null),
    zoom = useRef<((factor: number) => void) | null>(null);
  const [error, setError] = useState(''),
    [ready, setReady] = useState(false),
    [revision, setRevision] = useState(0),
    [theme, setTheme] = useState(0);
  const pan = useRef<MathPan | null>(null);
  useMathPlotTouch(host, zoom, pan, ordinaryWheelScroll);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    const media = matchMedia('(prefers-color-scheme: dark)'),
      changed = () => setTheme((v) => v + 1);
    media.addEventListener('change', changed);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', changed);
    };
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: CSS token reads are invalidated by theme and reset revision.
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let infinite: { update: () => void; dispose: () => void } | undefined;
    let world: ReturnType<typeof prepareUnboundedScene> | undefined;
    let scaffoldIndex = 0;
    let active = true,
      frame = 0;
    const css = getComputedStyle(node),
      color = (name: string) => css.getPropertyValue(name).trim();
    const curve = color('--color-math-curve'),
      secondary = color('--color-math-tangent'),
      gray = color('--color-muted'),
      grid = color('--color-border'),
      surfaceLow = color('--primitive-common-info-500'),
      surfaceHigh = color('--primitive-common-info-100'),
      background = color('--color-surface'),
      ink = color('--color-text');
    const key = `${item.id}:${alternate}:${revision}`;
    if (viewKey.current && viewKey.current !== key) {
      savedView.current = undefined;
      camera.current = defaultMathCamera();
    }
    viewKey.current = key;
    const traces: Data[] = [];
    const is3d = result.is3d && !alternate && !surfaceProjectionLabel;
    const lineTrace = (line: TemplateLine): Data =>
      ({
        type: line.style === 'bar' ? 'bar' : is3d ? 'scatter3d' : 'scatter',
        mode: line.style === 'scatter' ? 'markers' : line.markers ? 'lines+markers' : 'lines',
        name: line.name,
        x: line.points.map((p) => p?.[0] ?? null),
        y: line.points.map((p) => p?.[1] ?? null),
        ...(is3d ? { z: line.points.map((p) => p?.[2] ?? null) } : {}),
        line: {
          color: line.role === 'grid' ? grid : line.role === 'secondary' ? secondary : curve,
          width: line.role === 'grid' ? 1 : 2,
        },
        marker: { color: curve, size: 4 },
        connectgaps: false,
        showlegend: item.kind === 'sequence',
        hovertemplate:
          'x=%{x:.2f}<br>y=%{y:.2f}' + (is3d ? '<br>z=%{z:.2f}' : '') + '<extra></extra>',
      }) as Data;
    for (const line of result.lines) traces.push(lineTrace(line));
    if (labelledVectors && is3d) {
      const named = result.lines.filter(
        (l) =>
          l.name &&
          l.points.length === 2 &&
          result.arrows?.some(
            (a) =>
              l.points[0]?.every((v, i) => v === a.at[i]) &&
              l.points[1]?.every((v, i) => v === a.at[i] + a.vector[i]),
          ),
      );
      traces.push({
        type: 'scatter3d',
        mode: 'text',
        x: named.map((l) => l.points.at(-1)![0]),
        y: named.map((l) => l.points.at(-1)![1]),
        z: named.map((l) => l.points.at(-1)![2]),
        text: named.map((l) => l.name),
        textposition: 'top center',
        textfont: { size: 14, color: ink },
        showlegend: false,
        hoverinfo: 'skip',
      } as Data);
    }
    const colorscale: Array<[number, string]> = [
      [0, background],
      [0.5, secondary],
      [1, curve],
    ];
    if (result.surface && !alternate) {
      if (surfaceProjectionLabel) {
        traces.push({
          type: 'heatmap',
          ...surfaceProjection(result.surface),
          colorscale: [
            [0, surfaceLow],
            [1, surfaceHigh],
          ],
          showscale: true,
          colorbar: { title: { text: surfaceProjectionLabel }, thickness: 12, len: 0.55 },
          connectgaps: false,
          hovertemplate:
            'x=%{x:.2f}<br>y=%{y:.2f}<br>' + surfaceProjectionLabel + '=%{z:.4f}<extra></extra>',
        } as Data);
      } else {
        traces.push({
          type: 'surface',
          ...result.surface,
          colorscale: [
            [0, surfaceLow],
            [1, surfaceHigh],
          ],
          showscale: true,
          colorbar: {
            title: { text: 'z' },
            thickness: 12,
            len: 0.55,
            tickformat: '.2~f',
            tickfont: { size: 11, color: gray },
            outlinewidth: 0,
          },
          connectgaps: false,
          opacity: 1,
          lighting: { ambient: 0.85, diffuse: 0.35, specular: 0, roughness: 1, fresnel: 0 },
          hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}<br>z=%{z:.2f}<extra></extra>',
        } as Data);
      }
      // Curves on the surface, rather than projections on the coordinate planes.
      for (const line of surfaceProjectionLabel ? [] : surfaceMesh(result.surface))
        traces.push({
          ...lineTrace(line),
          line: { color: gray, width: 1 },
          hoverinfo: 'skip',
          hovertemplate: undefined,
          showlegend: false,
        } as Data);
    }
    if (result.contour && (!result.surface || alternate)) {
      const { zero, ...coordinates } = result.contour;
      traces.push({
        type: 'contour',
        ...coordinates,
        colorscale,
        showscale: false,
        connectgaps: false,
        contours: zero ? { start: 0, end: 0, size: 1, coloring: 'lines' } : { coloring: 'lines' },
        line: { color: curve, width: 2 },
        hovertemplate: 'x=%{x:.2f}<br>y=%{y:.2f}<br>F=%{z:.2f}<extra></extra>',
      } as Data);
    }
    if (result.volume)
      traces.push({
        type: 'isosurface',
        ...result.volume,
        isomin: 0,
        isomax: 0,
        surface: { count: 1 },
        caps: { x: { show: false }, y: { show: false }, z: { show: false } },
        colorscale: [
          [0, curve],
          [1, curve],
        ],
        showscale: false,
        opacity: 0.75,
      } as unknown as Data);
    const annotations: Partial<Plotly.Annotations>[] = [];
    if (result.arrows) {
      const step =
        Math.min(...Object.values(item.ranges).map(([a, b]) => (b - a) / (is3d ? 5 : 11))) * 0.55;
      if (is3d) {
        const arrows = result.arrows
          .map((a) => ({ ...a, length: Math.hypot(...a.vector) }))
          .filter((a) => a.length > 0);
        traces.push({
          type: 'cone',
          x: arrows.map((a) => a.at[0] + (labelledVectors ? a.vector[0] : 0)),
          y: arrows.map((a) => a.at[1] + (labelledVectors ? a.vector[1] : 0)),
          z: arrows.map((a) => a.at[2] + (labelledVectors ? a.vector[2] : 0)),
          u: arrows.map((a) => a.vector[0] / a.length),
          v: arrows.map((a) => a.vector[1] / a.length),
          w: arrows.map((a) => a.vector[2] / a.length),
          sizemode: 'absolute',
          sizeref: labelledVectors ? Math.min(0.12, step) : step,
          anchor: labelledVectors ? 'tip' : 'tail',
          colorscale: [
            [0, secondary],
            [1, secondary],
          ],
          showscale: false,
          hoverinfo: 'skip',
        } as Data);
      } else
        for (const arrow of result.arrows) {
          const length = Math.hypot(...arrow.vector);
          if (!length) continue;
          annotations.push({
            x: arrow.at[0] + (step * arrow.vector[0]) / length,
            y: arrow.at[1] + (step * arrow.vector[1]) / length,
            ax: arrow.at[0],
            ay: arrow.at[1],
            xref: 'x',
            yref: 'y',
            axref: 'x',
            ayref: 'y',
            text: '',
            showarrow: true,
            arrowhead: 3,
            arrowsize: 0.7,
            arrowwidth: 1,
            arrowcolor: secondary,
          });
        }
    }
    if (result.point)
      traces.push({
        type: is3d ? 'scatter3d' : 'scatter',
        mode: 'markers',
        name: '현재 점',
        x: [result.point[0]],
        y: [result.point[1]],
        ...(is3d ? { z: [result.point[2]] } : {}),
        marker: { color: curve, size: is3d ? 4 : 7 },
        showlegend: false,
        hovertemplate:
          'x=%{x:.2f}<br>y=%{y:.2f}' + (is3d ? '<br>z=%{z:.2f}' : '') + '<extra>현재 점</extra>',
      } as Data);
    const axis = (name: string) => ({
      title: { text: name },
      gridcolor: grid,
      zerolinecolor: gray,
      linecolor: gray,
      showline: true,
      ticks: 'outside' as const,
      ticklen: 4,
      tickwidth: 1,
      tickcolor: gray,
      tickformat: '.2~f',
      automargin: true,
    });
    const layout: Partial<Layout> = {
      autosize: true,
      margin: { l: 42, r: 20, t: 20, b: 40 },
      paper_bgcolor: background,
      plot_bgcolor: background,
      font: { color: ink, family: 'Arial, Helvetica, sans-serif', size: 12 },
      showlegend: item.kind === 'sequence',
      uirevision: `${item.id}:${alternate}:${revision}`,
      xaxis: {
        ...axis(
          item.dataset?.xLabel ??
            (item.kind === 'sequence' ? 'n' : item.kind === 'ode' ? 't' : 'x'),
        ),
        ...(savedView.current?.ranges
          ? { range: savedView.current.ranges.x }
          : surfaceProjectionLabel
            ? { range: item.ranges.x ?? [0, 1] }
            : {}),
      },
      yaxis: {
        ...axis(item.dataset?.yLabel ?? 'y'),
        ...(savedView.current?.ranges
          ? { range: savedView.current.ranges.y }
          : surfaceProjectionLabel
            ? { range: item.ranges.y ?? [0, 1] }
            : {}),
        ...(!surfaceProjectionLabel && !['implicit', 'field', 'matrix'].includes(item.kind)
          ? {}
          : { scaleanchor: 'x', scaleratio: 1 }),
      },
      annotations,
      scene: {
        xaxis: axis('x'),
        yaxis: axis('y'),
        zaxis: axis('z'),
        aspectmode: 'data',
        dragmode: 'orbit',
        camera: renderMathCamera(camera.current),
      } as unknown as Layout['scene'],
      dragmode: is3d ? 'orbit' : 'pan',
    };
    if (is3d) {
      const pts = [
        ...result.lines.flatMap((l) =>
          l.points.filter((p): p is [number, number, number] => p !== null),
        ),
        ...(result.arrows ?? []).map((a) => a.at),
      ];
      if (result.surface) {
        const surface = result.surface;
        const xs = surface.x.flat().filter(Number.isFinite),
          ys = surface.y.flat().filter(Number.isFinite),
          zs = surface.z.flat().filter((v): v is number => v !== null);
        if (xs.length && ys.length && zs.length)
          pts.push(
            [Math.min(...xs), Math.min(...ys), Math.min(...zs)],
            [Math.max(...xs), Math.max(...ys), Math.max(...zs)],
          );
      }
      if (result.volume && result.volume.x.length)
        pts.push(
          [
            Math.min(...result.volume.x),
            Math.min(...result.volume.y),
            Math.min(...result.volume.z),
          ],
          [
            Math.max(...result.volume.x),
            Math.max(...result.volume.y),
            Math.max(...result.volume.z),
          ],
        );
      const bounds = [0, 1, 2].map((i) =>
        pts.length
          ? [Math.min(...pts.map((p) => p[i])), Math.max(...pts.map((p) => p[i]))]
          : [-3, 3],
      );
      const scene = layout.scene!;
      scene.hovermode = false;
      for (const name of ['xaxis', 'yaxis', 'zaxis'] as const)
        scene[name] = { ...scene[name], title: { text: '' } };
      scaffoldIndex = traces.length;
      world = prepareUnboundedScene(
        scene,
        bounds,
        node.clientWidth,
        node.clientHeight,
        { grid, axis: gray, background },
        camera.current,
      );
      scene.annotations = world.scaffold.annotations as Layout['scene']['annotations'];
      traces.push(...world.scaffold.traces);
      // The coordinates are already available beside the plot. Keep every 3D
      // trace out of hover selection, consistent with the scene hover policy.
      for (const trace of traces) {
        const hover = trace as Data & { hoverinfo?: string; hovertemplate?: string };
        hover.hoverinfo = 'skip';
        hover.hovertemplate = undefined;
      }
    }
    setReady(false);
    const dispose = plotlyMathLabels(node);
    void Plotly.react(node, traces, layout, mathPlotConfig)
      .then(() => {
        if (!active) return;
        setError('');
        if (world)
          infinite = followUnboundedScene(
            node,
            world,
            scaffoldIndex,
            undefined,
            () => camera.current,
          );
        setReady(true);
        pan.current = is3d
          ? null
          : mathPlotPan(
              node,
              () => {
                const current = (node as unknown as PlotlyHTMLElement).layout;
                return [current.xaxis?.range ?? [-1, 1], current.yaxis?.range ?? [-1, 1]];
              },
              (next) => {
                void Plotly.relayout(node, {
                  'xaxis.range': next[0],
                  'yaxis.range': next[1],
                } as Partial<Layout> & Record<string, unknown>).catch(() =>
                  setError('그래프를 이동하지 못했습니다. 다시 열어 주세요.'),
                );
              },
            );
        (node as unknown as PlotlyHTMLElement).on('plotly_relayout', (event) => {
          if (
            !active ||
            !Object.keys(event).some((k) => k.startsWith('scene.camera') || k.includes('.range'))
          )
            return;
          const layout = (node as unknown as PlotlyHTMLElement).layout;
          if (
            is3d &&
            layout.scene?.camera &&
            Object.keys(event).some((key) => key.startsWith('scene.camera'))
          )
            camera.current = recoverMathCamera(layout.scene.camera, camera.current);
          const view: TemplateView = {
            ...(is3d
              ? { camera: camera.current as TemplateView['camera'] }
              : {
                  ranges: {
                    x: layout.xaxis!.range as [number, number],
                    y: layout.yaxis!.range as [number, number],
                  },
                }),
          };
          if (isTemplateView(view)) {
            savedView.current = view;
            viewCallback.current?.(view);
          }
        });
        zoom.current = (factor) => {
          if (!Number.isFinite(factor) || factor <= 0) return;
          if (is3d) {
            camera.current = zoomCamera(camera.current, factor);
            void Plotly.relayout(node, {
              'scene.camera': renderMathCamera(camera.current),
            } as Partial<Layout> & Record<string, unknown>)
              .then(() => infinite?.update())
              .catch(() => setError('확대·축소하지 못했습니다. 다시 열어 주세요.'));
          } else {
            const current = (node as unknown as PlotlyHTMLElement).layout;
            const update: Record<string, unknown> = {};
            for (const name of ['xaxis', 'yaxis'] as const) {
              const range = current[name]?.range;
              if (!range) continue;
              const middle = (Number(range[0]) + Number(range[1])) / 2,
                half = (Number(range[1]) - Number(range[0])) / (2 * factor);
              if (half > 1e-8 && half < 1e9)
                update[`${name}.range`] = [middle - half, middle + half];
            }
            void Plotly.relayout(node, update);
          }
        };
      })
      .catch(() => {
        if (active) {
          setError('그래프를 그리지 못했습니다. 입력은 유지했습니다. 다시 그려 주세요.');
          setReady(false);
        }
      });
    const resize = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (
          active &&
          node.isConnected &&
          node.clientWidth &&
          node.clientHeight &&
          getComputedStyle(node).display !== 'none'
        ) {
          try {
            // The plot may become hidden/unmounted before this asynchronous resize finishes.
            void Promise.resolve(Plotly.Plots.resize(node)).catch(() => {});
          } catch {
            /* The plot can be unmounting. */
          }
        }
      });
    });
    resize.observe(node);
    return () => {
      active = false;
      infinite?.dispose();
      pan.current = null;
      zoom.current = null;
      resize.disconnect();
      cancelAnimationFrame(frame);
      dispose();
      (node as unknown as PlotlyHTMLElement).removeAllListeners?.('plotly_relayout');
    };
  }, [item, result, alternate, revision, theme, labelledVectors, surfaceProjectionLabel]);
  useEffect(() => {
    const node = host.current;
    return () => {
      if (node) Plotly.purge(node);
    };
  }, []);
  const cameraControls = (
    <MathCameraControls
      disabled={!ready}
      readCamera={() => camera.current}
      applyCamera={(next) => {
        if (!host.current) return;
        camera.current = next;
        void Plotly.relayout(host.current, {
          'scene.camera': renderMathCamera(camera.current),
        } as Partial<Layout> & Record<string, unknown>).catch(() =>
          setError('시점을 바꾸지 못했습니다. 다시 열어 주세요.'),
        );
      }}
    />
  );
  return (
    <div>
      {error && <ErrorState message={error} />}
      <div className="actions">
        <Button disabled={!ready} onClick={() => zoom.current?.(mathPlotZoomStep)}>
          ＋ 확대
        </Button>
        <Button disabled={!ready} onClick={() => zoom.current?.(1 / mathPlotZoomStep)}>
          − 축소
        </Button>
        <Button
          title="확대·이동·회전한 시야만 처음으로 돌아갑니다. 수식·조절값·메모는 유지합니다."
          onClick={() => setRevision((v) => v + 1)}
        >
          보기 초기화
        </Button>
        {error && <Button onClick={() => setRevision((v) => v + 1)}>다시 그리기</Button>}
      </div>
      {result.is3d &&
        !alternate &&
        !surfaceProjectionLabel &&
        (compactCamera ? (
          <details>
            <summary>공간 시점의 정확한 조절</summary>
            {cameraControls}
          </details>
        ) : (
          cameraControls
        ))}
      <div
        className="math-plot"
        role="img"
        aria-label={`${item.title} 그래프 · 아래 좌표와 수식으로도 확인할 수 있습니다.`}
        ref={host}
      />
    </div>
  );
}
