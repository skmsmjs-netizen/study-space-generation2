import type { buildScene } from '../domain/math-explorer';
import { continuationRange, sampleCurveWindow } from '../domain/math-curve-sampling';
import { fadeNumbers, readPlotColor, hexColor, vectorDisplayLimit, integerAxisTicks } from './math-plot-presentation';
import {
  svgMathLabel,
  setLabelBox,
  placeMathLabel,
  type LabelBox,
  type LabelLine,
} from './math-plot-labels';

type Native = {
  exists(name: string): boolean;
  evalCommand(command: string): boolean;
  getXcoord(name: string): number;
  getYcoord(name: string): number;
  getZcoord(name: string): number;
  getVisible(name: string): boolean;
  setVisible(name: string, visible: boolean): void;
};
type Point = [number, number];
const ns = 'http://www.w3.org/2000/svg';

// Use the renderer's public camera basis, scales and bounds. Only presentation
// is flat SVG; curve evaluation and all world coordinates remain native.
export function geoOverlay(
  native: Native,
  host: HTMLElement,
  result: () => ReturnType<typeof buildScene>,
) {
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('math-flat-scaffold');
  svg.setAttribute('aria-hidden', 'true');
  host.appendChild(svg);
  const element = (tag: string, attrs: Record<string, string>, parent: SVGElement = svg) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    parent.appendChild(node);
    return node;
  };
  const grid = element('path', { fill: 'none', 'stroke-width': '0.6', 'data-world-grid': 'xy' });
  const axes = ['x', 'y', 'z'].map((axis) => ({
    line: element('line', { 'data-axis': axis, 'stroke-width': '1' }),
    title: svgMathLabel(svg, axis),
    ticks: element('g', { 'data-axis-labels': axis }),
  }));
  axes.forEach((axis, i) => {
    axis.title.setAttribute('data-axis-title', ['x', 'y', 'z'][i]);
  });
  const guide = element('path', { fill: 'none', 'stroke-width': '1', 'stroke-dasharray': '4 5' });
  const curve = element('path', {
    fill: 'none',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'data-curve': 'continuous',
  });
  const point = element('circle', { r: '4', 'data-current-point': 'true' });
  const feet = ['x', 'y', 'z'].map((name) => ({
    name,
    marker: element('circle', {
      r: '2.5',
      fill: 'none',
      'stroke-width': '1',
      'data-axis-foot': name,
    }),
    labels: element('g', { 'data-foot-label': name }),
  }));
  const vectors = ['T', 'N', 'B'].map((name) => ({
    name,
    path: element('path', {
      'data-vector': name,
      fill: 'none',
      'stroke-width': '1.5',
      'stroke-linejoin': 'round',
    }),
    text: svgMathLabel(svg, `\\mathbf{${name}}`),
  }));
  const coord = (name: string) => [
    native.getXcoord(name),
    native.getYcoord(name),
    native.getZcoord(name),
  ];
  const dot = (a: number[], b: number[]) => a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normalized = (v: number[]) => {
    const norm = Math.hypot(...v);
    return v.map((n) => n / norm);
  };
  for (const [name, index] of [
    ['Low', 1],
    ['High', 7],
    ['Size', 9],
    ['Direction', 11],
    ['Right', 12],
    ['Scale', 13],
  ] as const) {
    const label = `StudyView${name}`;
    if (!native.exists(label)) native.evalCommand(`${label}=Corner(-1,${index})`);
    native.setVisible(label, false);
  }
  let densities = [0, 0, 0];
  let curveKey='', curveResult: ReturnType<typeof sampleCurveWindow> | undefined;
  const fade = fadeNumbers(host, (opacity) =>
    axes.forEach((axis, i) => {
      axis.ticks.setAttribute('opacity', String(opacity[i]));
    }),
  );
  const refresh = () => {
    const [width, height] = coord('StudyViewSize');
    if (!(width > 0 && height > 0)) return;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const right = normalized(coord('StudyViewRight')),
      direction = normalized(coord('StudyViewDirection'));
    let up = normalized([
      direction[1] * right[2] - direction[2] * right[1],
      direction[2] * right[0] - direction[0] * right[2],
      direction[0] * right[1] - direction[1] * right[0],
    ]);
    // Classic's upright view has no camera roll; +z points towards screen top.
    if (up[2] < 0) up = up.map((v) => -v);
    const low = coord('StudyViewLow'),
      high = coord('StudyViewHigh'),
      scales = coord('StudyViewScale');
    const center = low.map((v, i) => (v + high[i]) / 2);
    const project = (point: number[]): Point => {
      const q = point.map((v, i) => (v - center[i]) * scales[i]);
      return [width / 2 + dot(q, right), height / 2 - dot(q, up)];
    };
    const current = result();
    const radius = (Math.max(width, height) / Math.max(Math.min(...scales.map(Math.abs)), 1e-6)) * 4;
    const view = {ranges:center.map(c=>[c-radius,c+radius] as [number,number]),pixelsPerUnit:Math.max(...scales.map(Math.abs))};
    const nextCurveKey=JSON.stringify([current.sampleKey,current.min,current.max,center,radius,view.pixelsPerUnit]);
    if(nextCurveKey!==curveKey || !curveResult) {
      curveKey=nextCurveKey;
      curveResult=sampleCurveWindow(current.sample,continuationRange(current.sample,[current.min,current.max],view),{...view,ranges:center.map(c=>[c-radius/4,c+radius/4] as [number,number])});
    }
    host.dataset.curveWindow=JSON.stringify(curveResult.range);
    let pen = false;
    const path: string[] = [];
    for (const value of curveResult.points) {
      if (!value) {
        pen = false;
        continue;
      }
      const p = project(value);
      path.push(`${pen ? 'L' : 'M'}${p}`);
      pen = true;
    }
    curve.setAttribute('d', path.join(' '));
    curve.setAttribute('stroke', hexColor(readPlotColor(host, '--color-math-curve')));
    const selected = current.point;
    point.setAttribute('visibility', selected ? 'visible' : 'hidden');
    point.setAttribute('fill', hexColor(readPlotColor(host, '--color-math-point')));
    guide.setAttribute('stroke', hexColor(readPlotColor(host, '--color-muted')));
    if (selected) {
      const p = project(selected);
      point.setAttribute('cx', String(p[0]));
      point.setAttribute('cy', String(p[1]));
      const foot = [selected[0], selected[1], 0];
      const segments = [
        [selected, foot],
        [foot, [selected[0], 0, 0]],
        [foot, [0, selected[1], 0]],
        [selected, [0, 0, selected[2]]],
      ];
      guide.setAttribute('d', segments.map(([a, b]) => `M${project(a)} L${project(b)}`).join(' '));
    } else guide.setAttribute('d', '');
    const step = Math.max(1, Math.ceil(radius / 24));
    const floor: string[] = [];
    for (let i = 0; i <= 48; i++) {
      const x = Math.floor((center[0] - radius) / step) * step + i * step;
      const y = Math.floor((center[1] - radius) / step) * step + i * step;
      if (x !== 0)
        floor.push(
          `M${project([x, center[1] - radius, 0])} L${project([x, center[1] + radius, 0])}`,
        );
      if (y !== 0)
        floor.push(
          `M${project([center[0] - radius, y, 0])} L${project([center[0] + radius, y, 0])}`,
        );
    }
    grid.setAttribute('d', floor.join(' '));
    grid.setAttribute('stroke', hexColor(readPlotColor(host, '--color-border')));
    const origin = project([0, 0, 0]);
    const ink = hexColor(readPlotColor(host, '--color-muted'));
    const occupied: LabelBox[] = [],
      lines: LabelLine[] = [];
    const titles: Array<{
      node: SVGForeignObjectElement;
      anchor: number[];
      direction: number[];
      color: string;
      width?: number;
      fixedTick?: boolean;
    }> = [];
    if (selected) {
      const p = project(selected);
      occupied.push({ x: p[0] - 7, y: p[1] - 7, width: 14, height: 14 });
    }
    const projectionLabels: typeof titles = [];
    const tickLabels: typeof titles = [];
    feet.forEach((foot, i) => {
      const at = selected ? project(selected.map((v, d) => (d === i ? v : 0))) : [NaN, NaN];
      const show =
        selected && at[0] >= 6 && at[0] <= width - 6 && at[1] >= 6 && at[1] <= height - 6;
      foot.marker.setAttribute('visibility', show ? 'visible' : 'hidden');
      foot.labels.replaceChildren();
      if (!show || !selected) return;
      const color = hexColor(readPlotColor(host, '--color-math-point'));
      foot.marker.setAttribute('cx', String(at[0]));
      foot.marker.setAttribute('cy', String(at[1]));
      foot.marker.setAttribute('stroke', color);
      occupied.push({ x: at[0] - 4, y: at[1] - 4, width: 8, height: 8 });
      if (Math.hypot(scales[i] * right[i], scales[i] * up[i]) <= 38) return;
      const tex = `${foot.name}=${selected[i].toFixed(2).replace('-0.00', '0.00')}`;
      const label = svgMathLabel(foot.labels, tex, 11);
      projectionLabels.push({
        node: label,
        anchor: at,
        direction: [scales[i] * right[i], -scales[i] * up[i]],
        color,
        width: Math.max(54, tex.length * 7),
      });
    });
    densities = axes.map((axis, i) => {
      const delta: Point = [scales[i] * right[i], -scales[i] * up[i]];
      const density = Math.hypot(...delta);
      let start = -Infinity,
        end = Infinity;
      for (let d = 0; d < 2; d++) {
        const limit = d === 0 ? width : height;
        if (Math.abs(delta[d]) < 1e-7) {
          if (origin[d] < 0 || origin[d] > limit) {
            start = 1;
            end = 0;
          }
        } else {
          const a = -origin[d] / delta[d],
            b = (limit - origin[d]) / delta[d];
          start = Math.max(start, Math.min(a, b));
          end = Math.min(end, Math.max(a, b));
        }
      }
      const visible = start <= end && Number.isFinite(start) && Number.isFinite(end);
      axis.line.setAttribute('visibility', visible ? 'visible' : 'hidden');
      axis.title.setAttribute('visibility', visible ? 'visible' : 'hidden');
      axis.line.setAttribute('stroke', ink);
      if (visible) {
        const a = origin.map((v, d) => v + start * delta[d]),
          b = origin.map((v, d) => v + end * delta[d]);
        for (const [key, value] of Object.entries({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }))
          axis.line.setAttribute(key, String(value));
        lines.push({ start: a, end: b });
        titles.push({
          node: axis.title,
          anchor: b.map((v, d) => v - (delta[d] / density) * 28),
          direction: delta,
          color: ink,
        });
      }
      // Recompute the entire visible axis after resize, rotation, pan or zoom.
      axis.ticks.setAttribute('visibility', visible ? 'visible' : 'hidden');
      if (visible && density > 0) {
        axis.ticks.replaceChildren();
        const perpendicular = [-delta[1] / density, delta[0] / density];
        const ticks = integerAxisTicks(start, end, density);
        axis.ticks.setAttribute('data-tick-step', String(ticks.step));
        for (const value of ticks.values) {
          if (!value) continue;
          const p = origin.map((v, d) => v + value * delta[d]);
          if (p[0] < 0 || p[0] > width || p[1] < 0 || p[1] > height) continue;
          element(
            'line',
            {
              x1: String(p[0] - perpendicular[0] * 3),
              y1: String(p[1] - perpendicular[1] * 3),
              x2: String(p[0] + perpendicular[0] * 3),
              y2: String(p[1] + perpendicular[1] * 3),
              stroke: ink,
              'stroke-width': '1',
            },
            axis.ticks,
          );
          const label = svgMathLabel(axis.ticks, String(value), 11);
          tickLabels.push({
            node: label,
            anchor: p,
            direction: delta,
            color: ink,
            width: Math.max(24, String(value).length * 7 + 4),
            fixedTick: true,
          });
        }
      }
      return visible ? integerAxisTicks(start, end, density).spacing : 0;
    });
    const anchor = project(coord('StudyPoint'));
    const tips = vectors.map((vector) => project(coord(`StudyTip${vector.name}`)));
    const longest = Math.max(
      1,
      ...tips.map((tip, i) =>
        host.dataset[`vector${vectors[i].name}`] === 'true'
          ? Math.hypot(tip[0] - anchor[0], tip[1] - anchor[1])
          : 0,
      ),
    );
    // One common display factor preserves direction and foreshortening across
    // T/N/B. It changes no unit-vector components or stored world coordinates.
    const vectorFactor = Math.min(1, vectorDisplayLimit(width, height) / Math.max(longest, 1));
    for (const [i, vector] of vectors.entries()) {
      const name = `study${vector.name}`;
      const visible = native.exists(name) && host.dataset[`vector${vector.name}`] === 'true';
      vector.path.setAttribute('visibility', visible ? 'visible' : 'hidden');
      vector.text.setAttribute('visibility', visible ? 'visible' : 'hidden');
      if (!visible) continue;
      const p = anchor,
        end = tips[i].map((value, d) => p[d] + (value - p[d]) * vectorFactor);
      const dx = end[0] - p[0],
        dy = end[1] - p[1],
        size = Math.hypot(dx, dy);
      if (size < 1) {
        vector.path.setAttribute('visibility', 'hidden');
        vector.text.setAttribute('visibility', 'hidden');
        continue;
      }
      const ux = dx / size,
        uy = dy / size,
        head = Math.min(7, size / 3);
      vector.path.setAttribute(
        'd',
        `M${p} L${end} M${end[0] - ux * head - (uy * head) / 2},${end[1] - uy * head + (ux * head) / 2} L${end} L${end[0] - ux * head + (uy * head) / 2},${end[1] - uy * head - (ux * head) / 2}`,
      );
      const color = hexColor(
        readPlotColor(
          host,
          ['--color-math-tangent', '--color-math-normal', '--color-math-binormal'][i],
        ),
      );
      vector.path.setAttribute('stroke', color);
      lines.push({ start: p, end });
      titles.push({ node: vector.text, anchor: end, direction: [dx, dy], color });
    }
    for (const title of [...tickLabels, ...titles, ...projectionLabels]) {
      const box = placeMathLabel(
        title.anchor,
        title.direction,
        width,
        height,
        occupied,
        lines,
        title.width,
        24,
        title.fixedTick ? [0] : undefined,
      );
      if (title.fixedTick) {
        const d = title.direction,
          size = Math.hypot(...d) || 1;
        const along =
          ((box.x + box.width / 2 - title.anchor[0]) * d[0] +
            (box.y + box.height / 2 - title.anchor[1]) * d[1]) /
          size;
        // Clamping must never attach a number to a neighbouring tick.
        if (Math.abs(along) > 1) {
          title.node.setAttribute('visibility', 'hidden');
          occupied.pop();
          continue;
        }
      }
      setLabelBox(title.node, box, title.color);
    }
  };
  return {
    refresh,
    update() {
      refresh();
      fade.update(densities);
    },
    dispose() {
      fade.dispose();
      svg.remove();
    },
  };
}
