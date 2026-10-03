import { useEffect, useRef, useState } from 'react';
import type { Data, Layout, LayoutAxis, PlotlyHTMLElement } from 'plotly.js';
import type { ChartFigure, ChartRow } from '../domain/statistics-charts';
import { Button } from './index';

export function StatisticsPlot({
  figure,
  small = false,
  cursor = null,
  onOpen,
  selectedRows = null,
}: {
  figure: ChartFigure;
  small?: boolean;
  cursor?: number | null;
  onOpen?: (row: ChartRow) => void;
  selectedRows?: boolean[] | null;
}) {
  const queue = useRef<Promise<void>>(Promise.resolve());
  const selection = useRef(selectedRows);
  selection.current = selectedRows;
  const redrawSelection = useRef<(() => void) | null>(null);
  const selectionKey = selectedRows === null ? 'none' : selectedRows.map(Number).join('');
  const previousSelectionKey = useRef(selectionKey);
  const host = useRef<HTMLDivElement>(null),
    callback = useRef(onOpen),
    model = useRef(figure);
  callback.current = onOpen;
  model.current = figure;
  const [importFailure, setImportFailure] = useState(false);
  const [error, setError] = useState(''),
    [retry, setRetry] = useState(0),
    [ready, setReady] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: retry explicitly reruns a failed drawing with the same data.
  useEffect(() => {
    const element = host.current;
    if (!element || figure.reason) return;
    let active = true,
      plot: typeof import('plotly.js-dist-min') | undefined,
      observed = false;
    let cleanupTheme: (() => void) | undefined;
    let renderedWidth = 0;
    const render = async () => {
      try {
        const imported = await import('plotly.js-dist-min');
        plot = imported.default;
        if (!active) return;
        const style = getComputedStyle(element),
          color = (name: string) => style.getPropertyValue(name).trim();
        renderedWidth = element.clientWidth;
        const colors = [
          color('--color-primary'),
          color('--color-border-strong'),
          color('--color-muted'),
          color('--color-text'),
        ];
        const traces = structuredClone(figure.traces) as Data[];
        for (const trace of traces) {
          const t = trace as unknown as Record<string, unknown>;
          if (t.type === 'heatmap')
            Object.assign(t, {
              colorscale: [
                [0, color('--color-surface')],
                [1, color('--color-primary')],
              ],
              showscale: !small,
            });
          if (t.type === 'sankey') {
            const node = t.node as Record<string, unknown>;
            node.color = (node.label as string[]).map((_, i) => colors[i % colors.length]);
          }
          if (t.type === 'waterfall')
            Object.assign(t, {
              increasing: { marker: { color: colors[0] } },
              decreasing: { marker: { color: colors[2] } },
              totals: { marker: { color: colors[3] } },
            });
        }
        const selectedRows = selection.current;
        if (selectedRows) {
          for (const [index, trace] of traces.entries()) {
            const t = trace as unknown as Record<string, unknown>;
            if (t.type === 'scatter' || t.type === 'bar') {
              if (figure.kind === 'stacked-bar') t.opacity = selectedRows[index] ? 1 : 0.25;
              else
                t.marker = {
                  ...((t.marker as object) || {}),
                  opacity: selectedRows.map((selected) => (selected ? 1 : 0.25)),
                };
            } else if (t.type === 'pie')
              t.pull = selectedRows.map((selected) => (selected ? 0.06 : 0));
          }
          if (figure.kind === 'heatmap') {
            const source = figure.traces[0],
              xs = source.x as string[],
              ys = source.y as string[];
            const selected = selectedRows.flatMap((on, index) =>
              on ? [{ x: xs[index % xs.length], y: ys[Math.floor(index / xs.length)] }] : [],
            );
            traces.push({
              type: 'scatter',
              mode: 'markers',
              name: '함께 선택된 근거',
              x: selected.map((p) => p.x),
              y: selected.map((p) => p.y),
              hoverinfo: 'skip',
              marker: {
                symbol: 'square-open',
                size: 18,
                color: color('--color-text'),
                line: { width: 2 },
              },
            });
          }
        }
        const layout: Partial<Layout> = {
          autosize: true,
          height: small ? 220 : 320,
          margin: { t: 12, r: small ? 12 : 28, b: small ? 40 : 68, l: small ? 48 : 68 },
          paper_bgcolor: color('--color-surface'),
          plot_bgcolor: color('--color-surface'),
          font: { family: style.fontFamily, size: 12, color: color('--color-text') },
          colorway: colors,
          showlegend: !small,
          legend: { orientation: 'h', y: -0.3 },
          barmode: 'group',
          xaxis: {
            gridcolor: color('--color-border'),
            zerolinecolor: color('--color-border'),
            automargin: true,
          },
          yaxis: {
            gridcolor: color('--color-border'),
            zerolinecolor: color('--color-border'),
            automargin: true,
          },
          // Keep chart zoom/legend state on data refresh; a new kind or scope resets the view.
          uirevision: figure.kind + figure.columns.join('|'),
          ...figure.layout,
        };
        if (
          cursor !== null &&
          ['line', 'area', 'mixed', 'stacked-area'].includes(figure.kind) &&
          cursor >= 0
        ) {
          const date = (figure.traces[0]?.x as string[])?.[cursor];
          if (date)
            layout.shapes = [
              {
                type: 'line',
                xref: 'x',
                yref: 'paper',
                x0: date,
                x1: date,
                y0: 0,
                y1: 1,
                line: { color: colors[0], width: 2, dash: 'dot' },
              },
            ];
        }
        for (const axis of ['xaxis', 'yaxis'] as const)
          layout[axis] = {
            gridcolor: color('--color-border'),
            zerolinecolor: color('--color-border'),
            automargin: true,
            ...layout[axis],
          };
        if (figure.kind === 'horizontal' || figure.kind === 'paired') {
          const fontSize =
            parseFloat(color('--type-caption-size')) *
              (color('--type-caption-size').endsWith('rem')
                ? parseFloat(getComputedStyle(document.documentElement).fontSize)
                : 1) || 14;
          const labelWidth = Math.max(72, Math.min(200, (renderedWidth || 480) * 0.4));
          const canvas = renderedWidth ? document.createElement('canvas').getContext('2d') : null;
          if (canvas) canvas.font = `${fontSize}px ${style.fontFamily}`;
          const escape = (text: string) =>
            text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const labels = figure.rows.map((row) => {
            const lines: string[] = [];
            let line = '';
            for (const { segment } of new Intl.Segmenter('ko', { granularity: 'grapheme' }).segment(
              row.label,
            )) {
              const candidate = line + segment;
              const width =
                canvas?.measureText(candidate).width ?? Array.from(candidate).length * fontSize;
              if (line && (segment === '\n' || width > labelWidth)) {
                lines.push(line);
                line = segment === '\n' ? '' : segment;
              } else line = candidate;
            }
            lines.push(line);
            return lines;
          });
          const top = 24,
            bottom = small ? 48 : 72;
          // Each category has an equal band, sized for the longest wrapped name.
          const rowHeight = Math.max(
            figure.kind === 'paired' ? 56 : 44,
            ...labels.map((lines) => lines.length * fontSize * 1.3 + 20),
          );
          layout.height = Math.max(small ? 220 : 320, rowHeight * labels.length + top + bottom);
          layout.margin = { ...layout.margin, t: top, b: bottom };
          layout.font = { ...layout.font, size: fontSize };
          layout.bargap = 0.45;
          // Plotly 4 supports standoff; the installed 3.x declarations omit it.
          const categoryAxis: Partial<LayoutAxis> & { ticklabelstandoff: number } = {
            ...layout.yaxis,
            type: 'category',
            tickmode: 'array',
            tickvals: figure.rows.map((row) => row.label),
            ticktext: labels.map((lines) => lines.map(escape).join('<br>')),
            ticklabelstandoff: 12,
            tickfont: { size: fontSize },
            automargin: true,
          };
          const valueAxis: Partial<LayoutAxis> & { ticklabelstandoff: number } = {
            ...layout.xaxis,
            ticklabelstandoff: 8,
          };
          layout.yaxis = categoryAxis;
          layout.xaxis = valueAxis;
        }
        if (['line', 'area', 'mixed', 'stacked-area', 'heatmap'].includes(figure.kind))
          layout.xaxis = { ...layout.xaxis, tickformat: '%m/%d', hoverformat: '%Y-%m-%d' };
        for (const axis of ['xaxis', 'yaxis'] as const) {
          const key = axis === 'xaxis' ? 'x' : 'y';
          const samples = traces
            .flatMap((t) => ((t as unknown as Record<string, unknown>)[key] as unknown[]) ?? [])
            .filter((v) => typeof v === 'number') as number[];
          if (
            samples.length &&
            samples.every((v) => Number.isInteger(v)) &&
            Math.max(...samples) <= 5 &&
            Math.min(...samples) >= 0
          )
            layout[axis] = { ...layout[axis], dtick: 1 };
        }
        const engine = plot;
        queue.current = queue.current
          .catch(() => {})
          .then(async () => {
            if (!active) return;
            await engine.react(element, traces, layout, {
              responsive: true,
              displaylogo: false,
              displayModeBar: false,
              scrollZoom: false,
            });
            if (!active) return;
            const plotted = element as HTMLDivElement & PlotlyHTMLElement;
            plotted.removeAllListeners?.('plotly_click');
            plotted.on('plotly_click', (event) => {
              const point = event.points[0];
              if (!point) return;
              if (
                ['sankey', 'treemap', 'radar', 'histogram', 'heatmap', 'box'].includes(
                  model.current.kind,
                )
              )
                return;
              const index =
                model.current.kind === 'stacked-bar' ? point.curveNumber : point.pointNumber;
              if (typeof index === 'number' && model.current.rows[index])
                callback.current?.(model.current.rows[index]);
            });
            setError('');
            setImportFailure(false);
            setReady(true);
          });
        await queue.current;
      } catch {
        if (active) {
          setImportFailure(!plot);
          setError(
            '그래프를 그리지 못했습니다. 목록에서 같은 값과 원기록을 확인하거나 다시 시도해 주세요.',
          );
          setReady(false);
        }
      }
    };
    redrawSelection.current = () => {
      if (observed) void render();
    };
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting) && !observed) {
                observed = true;
                void render();
              }
            },
            { rootMargin: '160px' },
          );
    if (observer) observer.observe(element);
    else {
      observed = true;
      void render();
    }
    const resize =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(() => {
            if (plot && observed && active) {
              if (
                (figure.kind === 'horizontal' || figure.kind === 'paired') &&
                Math.abs(element.clientWidth - renderedWidth) > 1
              ) {
                void render();
                return;
              }
              try {
                plot.Plots.resize(element);
              } catch {
                /* A resize can race with unmount. */
              }
            }
          });
    resize?.observe(element);
    const theme = new MutationObserver(() => {
      if (observed) void render();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const update = () => {
      if (observed) void render();
    };
    media?.addEventListener?.('change', update);
    cleanupTheme = () => media?.removeEventListener?.('change', update);
    setReady(false);
    return () => {
      active = false;
      redrawSelection.current = null;
      observer?.disconnect();
      resize?.disconnect();
      theme.disconnect();
      cleanupTheme?.();
      if (plot) plot.purge(element);
    };
  }, [figure, small, retry, cursor]);
  useEffect(() => {
    if (previousSelectionKey.current === selectionKey) return;
    previousSelectionKey.current = selectionKey;
    // React against the existing Plotly scene so selection does not purge the user's zoom.
    redrawSelection.current?.();
  }, [selectionKey]);
  if (figure.reason) return <p className="muted statistics-chart-reason">{figure.reason}</p>;
  return (
    <div
      className="statistics-plot-wrap"
      data-chart-kind={figure.kind}
      data-shared-selection={selectedRows ? 'active' : undefined}
    >
      {selectedRows && (
        <p className="statistics-selection-count">
          함께 선택된 값 행 {selectedRows.filter(Boolean).length}개 / 전체 {selectedRows.length}개 ·
          값 목록의 ‘함께 선택됨’으로도 확인할 수 있습니다.
        </p>
      )}
      <div
        ref={host}
        className="statistics-plot"
        role="img"
        aria-label={`${figure.title} · ${figure.description}`}
        data-plot-ready={ready}
      />
      {error && (
        <p role="alert">
          {error}{' '}
          <Button
            variant="quiet"
            onClick={() => (importFailure ? window.location.reload() : setRetry((i) => i + 1))}
          >
            {importFailure ? '통계 다시 열기' : '그래프 다시 그리기'}
          </Button>
        </p>
      )}
    </div>
  );
}
