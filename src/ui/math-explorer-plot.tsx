import { useEffect, useRef, useState } from 'react';
import Plotly, {
  type Data,
  type Layout,
  type Annotations,
  type Camera,
  type PlotlyHTMLElement,
} from 'plotly.js-dist-min';
import { add, scale, type MathScene, type buildScene } from '../domain/math-explorer';
import type { MathZoomRef } from './math-view-controls';

export function MathExplorerPlot({
  scene,
  result,
  viewRevision,
  zoomRef,
  onZoomReady,
}: {
  scene: MathScene;
  result: ReturnType<typeof buildScene>;
  viewRevision: number;
  zoomRef: MathZoomRef;
  onZoomReady: (ready: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(0);
  const camera = useRef<Partial<Camera>>({ eye: { x: 1.05, y: 1.05, z: 0.75 } });
  const ranges = useRef<[number[], number[]]>([
    [-1, 1],
    [-1, 1],
  ]);
  const viewKey = useRef('');
  const listening = useRef(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const pointers = new Map<number, PointerEvent>();
    let target: EventTarget | null = null;
    let dragging = false;
    let distance = 0;
    const mouse = (type: string, event: PointerEvent) =>
      target?.dispatchEvent(
        new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: event.clientX,
          clientY: event.clientY,
          button: 0,
          buttons: type === 'mouseup' ? 0 : 1,
        }),
      );
    const separation = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    // Reuse Plotly's mouse rotation/pan and the existing relayout zoom adapter.
    // Capture only touch pointers so native mouse/keyboard behavior remains.
    const handle = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !zoomRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.type === 'pointerdown') {
        pointers.set(event.pointerId, event);
        try {
          element.setPointerCapture(event.pointerId);
        } catch {
          // Synthetic test events have no active browser pointer to capture.
        }
        if (pointers.size === 1) {
          target = event.target;
          dragging = true;
          mouse('mousedown', event);
        } else {
          if (dragging) mouse('mouseup', event);
          dragging = false;
          distance = separation();
        }
      } else if (event.type === 'pointermove' && pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, event);
        if (pointers.size === 1 && dragging) mouse('mousemove', event);
        else if (pointers.size === 2) {
          const next = separation();
          if (distance > 0 && next > 0) zoomRef.current(next / distance);
          distance = next;
        }
      } else if (event.type === 'pointerup' || event.type === 'pointercancel') {
        if (dragging) mouse('mouseup', event);
        pointers.delete(event.pointerId);
        dragging = false;
        distance = 0;
        if (event.type === 'pointercancel') pointers.clear();
        // Start from the remaining finger's position after a pinch, with no jump.
        if (pointers.size === 1) {
          dragging = true;
          mouse('mousedown', [...pointers.values()][0]);
        }
      }
    };
    const cancel = () => {
      const event = [...pointers.values()][0];
      if (event && dragging) mouse('mouseup', event);
      pointers.clear();
      dragging = false;
      distance = 0;
    };
    const blockNativeTouch = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const;
    const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const;
    for (const name of events) element.addEventListener(name, handle, true);
    for (const name of touchEvents)
      element.addEventListener(name, blockNativeTouch, { capture: true, passive: false });
    window.addEventListener('blur', cancel);
    return () => {
      cancel();
      for (const name of events) element.removeEventListener(name, handle, true);
      for (const name of touchEvents) element.removeEventListener(name, blockNativeTouch, true);
      window.removeEventListener('blur', cancel);
    };
  }, [zoomRef]);
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
    const styles = getComputedStyle(document.documentElement);
    const color = (name: string) => styles.getPropertyValue(name).trim();
    const ink = color('--color-text'),
      blue = color('--color-hierarchy-outline'),
      green = color('--color-memo-green');
    const type = scene.mode === 'curve' ? 'scatter3d' : 'scatter';
    const annotations: Array<Partial<Annotations> & { z: number }> = [];
    const finite = result.points.filter((point) => point !== null);
    const bounds = [0, 1, 2].map((i) =>
      finite.length
        ? [Math.min(...finite.map((v) => v[i])), Math.max(...finite.map((v) => v[i]))]
        : [-1, 1],
    );
    const extent = Math.max(...bounds.map(([min, max]) => max - min));
    const length = Math.max(extent * 0.18, 0.5);
    const key = `${scene.mode}:${viewRevision}`;
    if (viewKey.current !== key) {
      camera.current = { eye: { x: 1.05, y: 1.05, z: 0.75 } };
      ranges.current = [
        [bounds[0][0] - length, bounds[0][1] + length],
        [bounds[1][0] - length, bounds[1][1] + length],
      ];
      viewKey.current = key;
    }
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
        line: { color: ink, width: 2 },
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
      const f = result.vectors;
      for (const [name, v, c] of [
        ['T', f?.T, blue],
        ['N', f?.N, green],
        ['B', f?.B, ink],
      ] as const) {
        if (!v) continue;
        const end = add(p, scale(v, length));
        traces.push({
          type: 'scatter3d',
          mode: 'lines',
          name,
          x: [p[0], end[0]],
          y: [p[1], end[1]],
          z: [p[2], end[2]],
          line: { color: c, width: 3 },
          hoverinfo: 'skip',
        });
        annotations.push({
          x: end[0],
          y: end[1],
          z: end[2],
          text: name,
          showarrow: false,
          xshift: name === 'N' ? -12 : 8,
          yshift: name === 'B' ? -12 : 10,
          font: { color: c, size: 12 },
          bgcolor: color('--color-surface'),
          opacity: 0.95,
        });
        // Plotly's published Data union currently omits cone fields supported at runtime.
        traces.push({
          type: 'cone',
          x: [end[0]],
          y: [end[1]],
          z: [end[2]],
          u: [v[0]],
          v: [v[1]],
          w: [v[2]],
          anchor: 'tip',
          sizemode: 'absolute',
          sizeref: length * 0.22,
          showscale: false,
          showlegend: false,
          colorscale: [
            [0, c],
            [1, c],
          ],
          hoverinfo: 'skip',
        } as unknown as Data);
      }
    }
    const axis = {
      color: ink,
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
      font: { color: ink, size: 12 },
      margin: {
        l: scene.mode === 'curve' ? 0 : 45,
        r: 12,
        t: 0,
        b: scene.mode === 'curve' ? 0 : 40,
      },
      showlegend: false,
      dragmode: 'pan',
      uirevision: `${scene.mode}:${viewRevision}`,
      xaxis: { ...axis, title: { text: 'x' }, range: ranges.current[0], automargin: true },
      yaxis: { ...axis, title: { text: 'y' }, range: ranges.current[1], automargin: true },
      scene: {
        dragmode: 'orbit',
        aspectmode: 'data',
        bgcolor: 'transparent',
        xaxis: {
          ...axis,
          title: { text: 'x' },
          range: [bounds[0][0] - length, bounds[0][1] + length],
        },
        yaxis: {
          ...axis,
          title: { text: 'y' },
          range: [bounds[1][0] - length, bounds[1][1] + length],
        },
        zaxis: {
          ...axis,
          title: { text: 'z' },
          range: [bounds[2][0] - length, bounds[2][1] + length],
        },
        camera: camera.current,
        annotations,
      },
    };
    Plotly.react(element, traces, layout, {
      responsive: true,
      displaylogo: false,
      scrollZoom: true,
      displayModeBar: false,
    })
      .then(() => {
        if (!active) return;
        setError('');
        if (!listening.current) {
          (element as HTMLDivElement & PlotlyHTMLElement).on('plotly_relayout', (update) => {
            // Published event typing covers 2D only; the documented 3D event includes scene.camera.
            const event = update as unknown as Record<string, unknown>;
            if (event['scene.camera']) camera.current = event['scene.camera'] as Partial<Camera>;
            for (const [index, axisName] of ['xaxis', 'yaxis'].entries()) {
              const range = event[`${axisName}.range`] as number[] | undefined;
              if (range) ranges.current[index] = range;
              for (const edge of [0, 1]) {
                const value = event[`${axisName}.range[${edge}]`];
                if (typeof value === 'number') ranges.current[index][edge] = value;
              }
            }
          });
          listening.current = true;
        }
        zoomRef.current = (factor) => {
          let update: Record<string, unknown>;
          if (scene.mode === 'curve') {
            const eye = camera.current.eye ?? { x: 1.05, y: 1.05, z: 0.75 };
            camera.current = {
              ...camera.current,
              eye: {
                x: (eye.x ?? 1.05) / factor,
                y: (eye.y ?? 1.05) / factor,
                z: (eye.z ?? 0.75) / factor,
              },
            };
            update = { 'scene.camera': camera.current };
          } else {
            ranges.current = ranges.current.map(([low, high]) => {
              const center = (low + high) / 2,
                half = (high - low) / (2 * factor);
              return [center - half, center + half];
            }) as [number[], number[]];
            update = { 'xaxis.range': ranges.current[0], 'yaxis.range': ranges.current[1] };
          }
          void Plotly.relayout(element, update).catch(() => {
            setError('확대·축소하지 못했습니다. 화면을 다시 열어 주세요.');
            onZoomReady(false);
          });
        };
        onZoomReady(true);
      })
      .catch(() => {
        if (active) {
          onZoomReady(false);
          setError('그래프를 표시하지 못했습니다. 브라우저의 그래픽 지원을 확인해 주세요.');
        }
      });
    return () => {
      active = false;
    };
  }, [scene, result, theme, viewRevision, zoomRef, onZoomReady]);
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
      Plotly.purge(element);
      listening.current = false;
      zoomRef.current = null;
      onZoomReady(false);
    };
  }, [zoomRef, onZoomReady]);
  return (
    <>
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
