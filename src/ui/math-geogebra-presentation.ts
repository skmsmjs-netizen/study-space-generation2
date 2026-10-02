import type { buildScene } from '../domain/math-explorer';
import { geoOverlay } from './math-geogebra-overlay';
import { fadeNumbers, hexColor, readPlotColor } from './math-plot-presentation';

type Native = {
  getXML(): string;
  getXcoord(name: string): number;
  getYcoord(name: string): number;
  getZcoord(name: string): number;
  getVisible(name: string): boolean;
  setAxesVisible(view: number, x: boolean, y: boolean, z: boolean): void;
  exists(name: string): boolean;
  evalCommand(command: string): boolean;
  setCoords(name: string, ...coords: number[]): void;
  setTextValue(name: string, text: string): void;
  setFixed(name: string, fixed: boolean, selection?: boolean): void;
  setVisible(name: string, visible: boolean): void;
  setLabelVisible(name: string, visible: boolean): void;
  setColor(name: string, r: number, g: number, b: number): void;
  setLineThickness(name: string, value: number): void;
  setLineStyle(name: string, value: number): void;
  setGraphicsOptions(view: number, options: Record<string, unknown>): void;
};

// Classic exposes no opacity for native axis numbers. In 2D, keep native
// axes/ticks and use Text at exact integer positions for the short fade.
// In 3D, the SVG adapter supplies the flat axes, grid and full visible curve.
export function geoPresentation(
  native: Native,
  host: HTMLElement,
  curve: boolean,
  result: () => ReturnType<typeof buildScene>,
) {
  const overlay = curve ? geoOverlay(native, host, result) : undefined;
  if (curve)
    for (const axis of ['X', 'Y', 'Z'])
      for (let slot = 0; slot < 26; slot++)
        for (const prefix of ['studyNumber', 'studyTick']) {
          const name = `${prefix}${axis}${slot}`;
          if (native.exists(name)) native.setVisible(name, false);
        }
  if (curve) {
    for (const axis of ['X', 'Y'])
      for (let i = 0; i < 34; i++) {
        const name = `studyGrid${axis}${i}`;
        if (native.exists(name)) native.setVisible(name, false);
      }
    for (let i = 0; i < 401 && native.exists(`studyVisibleCurve${i}`); i++)
      native.setVisible(`studyVisibleCurve${i}`, false);
  }
  const axes = curve ? ['X', 'Y', 'Z'] : ['X', 'Y'];
  const labels: string[][] = axes.map(() => []);
  let background = readPlotColor(host, '--color-surface');
  let text = readPlotColor(host, '--color-muted');
  let labelKey = '';
  const fade = fadeNumbers(host, (opacity) => {
    labels.forEach((names, axis) => {
      const alpha = opacity[axis];
      const color = background.map((v, i) => Math.round(v + (text[i] - v) * alpha)) as [
        number,
        number,
        number,
      ];
      for (const name of names) {
        native.setVisible(name, alpha > 0.02);
        native.setColor(name, ...color);
        const tick = name.replace('studyNumber', 'studyTick');
        if (native.exists(tick)) {
          native.setVisible(tick, alpha > 0.02);
          native.setColor(tick, ...color);
        }
      }
    });
  });
  const update = () => {
    const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
    const view = xml.querySelector(curve ? 'euclidianView3D' : 'euclidianView');
    const coords = view?.querySelector('coordSystem');
    if (!coords) return;
    const scale = Number(coords.getAttribute('scale'));
    if (!(scale > 0)) return;
    const ys = Number(coords.getAttribute('yscale') ?? scale);
    const zs = Number(coords.getAttribute('zscale') ?? scale);
    const origin = ['xZero', 'yZero', 'zZero'].map((n) => Number(coords.getAttribute(n)));
    const angle = (Number(coords.getAttribute('xAngle')) * Math.PI) / 180;
    const rotation = (Number(coords.getAttribute('zAngle')) * Math.PI) / 180;
    const density = curve
      ? [
          scale * Math.hypot(Math.cos(rotation), Math.sin(rotation) * Math.sin(angle)),
          ys * Math.hypot(Math.sin(rotation), Math.cos(rotation) * Math.sin(angle)),
          zs * Math.abs(Math.cos(angle)),
        ]
      : [scale, ys];
    const center = curve
      ? origin.map((v) => -v)
      : [(host.clientWidth / 2 - origin[0]) / scale, (origin[1] - host.clientHeight / 2) / ys, 0];
    background = readPlotColor(host, '--color-surface');
    text = readPlotColor(host, '--color-muted');
    const axisColor = readPlotColor(host, '--color-muted');
    const gridColor = readPlotColor(host, '--color-border');
    native.setGraphicsOptions(curve ? 3 : 1, {
      grid: !curve,
      gridColor: hexColor(gridColor),
      axesColor: hexColor(axisColor),
      bgColor: hexColor(background),
      axes: {
        x: { showNumbers: false, tickStyle: 1 },
        y: { showNumbers: false, tickStyle: 1 },
        z: { showNumbers: false, tickStyle: 2 },
      },
    });
    for (const name of ['xAxis', 'yAxis', ...(curve ? ['zAxis'] : [])]) {
      native.setColor(name, ...axisColor);
      native.setLineThickness(name, 1);
      native.setLineStyle(name, 0);
    }
    if (curve) native.setAxesVisible(3, false, false, false);
    if (overlay) {
      overlay.update();
      return;
    }
    const ticks = axes.map((_, i) => {
      if (density[i] <= 38) return null;
      const half = Math.min(
        13,
        Math.ceil(Math.max(host.clientWidth, host.clientHeight) / (2 * Math.max(density[i], 1))),
      );
      const midpoint = Math.round(center[i]);
      return Array.from({ length: half * 2 + 1 }, (_, j) => midpoint - half + j).filter(
        (v) => v !== 0,
      );
    });
    const key = JSON.stringify([ticks, Math.round(scale), Math.round(ys)]);
    if (key !== labelKey || (ticks[0]?.length && !native.exists('studyNumberX0'))) {
      axes.forEach((axis, i) => {
        if (!ticks[i]) {
          if (!labels[i].length)
            for (let slot = 0; slot < 26; slot++) {
              const name = `studyNumber${axis}${slot}`;
              if (native.exists(name)) native.setVisible(name, false);
              const tick = name.replace('studyNumber', 'studyTick');
              if (native.exists(tick)) native.setVisible(tick, false);
            }
          return;
        }
        for (let slot = 0; slot < 26; slot++) {
          const name = `studyNumber${axis}${slot}`,
            anchor = `StudyNumberAnchor${axis}${slot}`;
          const value = ticks[i]?.[slot];
          if (value === undefined) {
            if (native.exists(name)) native.setVisible(name, false);
            const tick = name.replace('studyNumber', 'studyTick');
            if (native.exists(tick)) native.setVisible(tick, false);
            continue;
          }
          if (!native.exists(anchor))
            native.evalCommand(`${anchor}=${curve ? '(0,0,0)' : '(0,0)'}`);
          const point = [0, 0, 0];
          point[i] = value;
          // A small screen-size offset, while the renderer owns projection.
          if (i === 0) point[1] = -12 / ys;
          else point[0] = -12 / scale;
          native.setCoords(anchor, ...point.slice(0, curve ? 3 : 2));
          native.setVisible(anchor, false);
          native.setLabelVisible(anchor, false);
          if (
            !native.exists(name) &&
            !native.evalCommand(`${name}=Text("${value}",${anchor},true,false,0,-1)`)
          )
            continue;
          if (curve) {
            const tick = `studyTick${axis}${slot}`,
              j = i === 2 ? 0 : 2;
            const a = [0, 0, 0],
              b = [0, 0, 0];
            a[i] = value;
            b[i] = value;
            a[j] -= 3 / Math.max(density[j], 20);
            b[j] += 3 / Math.max(density[j], 20);
            if (native.exists(tick)) native.setFixed(tick, false, false);
            native.evalCommand(`${tick}=Segment((${a.join(',')}),(${b.join(',')}))`);
            native.setLineThickness(tick, 1);
            native.setLineStyle(tick, 0);
            native.setLabelVisible(tick, false);
            native.setFixed(tick, true, false);
          }
          native.setTextValue(name, String(value));
          native.setLabelVisible(name, false);
          native.setFixed(name, true, false);
          if (!labels[i].includes(name)) labels[i].push(name);
        }
      });
      labelKey = key;
    }
    // Removed slots must stay hidden during a fade, including after a far zoom.
    labels.forEach((names, i) => {
      labels[i] = names.filter((name) => {
        const slot = Number(name.slice(`studyNumber${axes[i]}`.length));
        if (!ticks[i] || slot < ticks[i].length) return true;
        native.setVisible(name, false);
        const tick = name.replace('studyNumber', 'studyTick');
        if (native.exists(tick)) native.setVisible(tick, false);
        return false;
      });
    });
    fade.update(density);
  };
  return {
    update,
    refresh: () => overlay?.refresh(),
    dispose: () => {
      fade.dispose();
      overlay?.dispose();
    },
  };
}
