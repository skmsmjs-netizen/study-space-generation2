import { useEffect, useRef, useState } from 'react';
import { Button, LoadingState } from './index';
import { add, scale, type buildScene, type MathScene, type Vec3 } from '../domain/math-explorer';
import { geoExpression, geoSourceKey, geoNumber } from '../domain/math-geogebra';
import type { MathZoomRef } from './math-view-controls';

type Snapshot = NonNullable<MathScene['geogebra']>;
type Api = {
  evalCommand: (command: string) => boolean;
  setValue: (name: string, value: number) => void;
  setCoords: (name: string, ...coords: number[]) => void;
  setVisible: (name: string, value: boolean) => void;
  setLabelVisible: (name: string, value: boolean) => void;
  setColor: (name: string, r: number, g: number, b: number) => void;
  setPointSize: (name: string, size: number) => void;
  setLineThickness: (name: string, size: number) => void;
  setLineStyle: (name: string, style: number) => void;
  setAxisSteps: (view: number, x: number, y: number, z: number) => void;
  setGraphicsOptions: (view: number, options: Record<string, unknown>) => void;
  setCaption: (name: string, caption: string) => void;
  setLabelStyle: (name: string, style: number) => void;
  setFixed: (name: string, fixed: boolean, selection?: boolean) => void;
  setRepaintingActive: (active: boolean) => void;
  setSize: (width: number, height: number) => void;
  setPerspective: (layout: string) => void;
  setMode: (mode: number) => void;
  setRounding: (rounding: string) => void;
  exists: (name: string) => boolean;
  setCoordSystem: (...bounds: (number | boolean)[]) => void;
  getXML: () => string;
  setXML: (xml: string) => void;
  registerClientListener: (callback: (event: { type: string } | unknown[]) => void) => void;
  remove: () => void;
};
type Applet = {
  setHTML5Codebase: (url: string, offline: boolean) => void;
  inject: (host: HTMLElement) => void;
};
declare global {
  interface Window {
    GGBApplet?: new (parameters: Record<string, unknown>, preferHtml5: boolean) => Applet;
  }
}
let loader: Promise<void> | undefined;
function tokenColor(host: HTMLElement, token: string): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  probe.style.display = 'none';
  host.appendChild(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  probe.remove();
  return rgb?.length === 3 ? (rgb as [number, number, number]) : [80, 80, 80];
}
function loadGeoGebra() {
  if (window.GGBApplet) return Promise.resolve();
  if (!loader) {
    loader = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${import.meta.env.BASE_URL}vendor/GeoGebra/deployggb.js`;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        loader = undefined;
        reject(Error('그래프 파일을 불러오지 못했습니다.'));
      };
      document.head.appendChild(script);
    });
  }
  return loader;
}

export function MathGeoGebra({
  scene,
  result,
  viewRevision,
  restoreRevision,
  captureRef,
  zoomRef,
  onZoomReady,
  onSnapshot,
  onFallback,
}: {
  scene: MathScene;
  result: ReturnType<typeof buildScene>;
  viewRevision: number;
  restoreRevision: number;
  captureRef: { current: (() => Snapshot | undefined) | null };
  zoomRef: MathZoomRef;
  onZoomReady: (ready: boolean) => void;
  onSnapshot: (snapshot: Snapshot) => void;
  onFallback: () => void;
}) {
  const host = useRef<HTMLElement>(null);
  const api = useRef<Api | null>(null);
  const latest = useRef({ scene, result, onSnapshot, restoreRevision });
  latest.current = { scene, result, onSnapshot, restoreRevision };
  const source = useRef('');
  const revision = useRef(-1);
  const syncing = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const mode = scene.mode;
  // biome-ignore lint/correctness/useExhaustiveDependencies: retry deliberately recreates the failed native applet.
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let resize: ResizeObserver | undefined;
    let resizeFrame = 0;
    let lastSize = '';
    source.current = '';
    revision.current = -1;
    setReady(false);
    setError('');
    const capture = () =>
      api.current && source.current
        ? { sourceKey: source.current, xml: api.current.getXML() }
        : undefined;
    captureRef.current = capture;
    const persist = () => {
      if (
        latest.current.restoreRevision !== restoreRevision ||
        geoSourceKey(latest.current.scene) !== source.current
      )
        return;
      const snapshot = capture();
      if (snapshot) latest.current.onSnapshot(snapshot);
    };
    const timeout = setTimeout(() => {
      if (!api.current && !disposed)
        setError(
          '그래프를 여는 데 시간이 걸리고 있습니다. 다시 열거나 다른 그래프로 볼 수 있습니다.',
        );
    }, 45000);
    void loadGeoGebra()
      .then(() => {
        if (disposed || !window.GGBApplet) return;
        const id = `studyggb${crypto.randomUUID().replaceAll('-', '')}`;
        const applet = new window.GGBApplet(
          {
            id,
            appName: 'classic',
            perspective: mode === 'curve' ? 'T' : 'G',
            width: Math.max(240, element.clientWidth),
            height: element.clientHeight,
            // ResizeObserver owns dimensions; the injector must not also scale
            // the already resized canvas when switching to a narrow viewport.
            disableAutoScale: true,
            language: 'ko',
            fontSize: 14,
            rounding: '2',
            showToolBar: false,
            customToolBar: mode === 'curve' ? '540' : '40',
            showAlgebraInput: false,
            showMenuBar: false,
            showZoomButtons: true,
            showResetIcon: false,
            enableFileFeatures: false,
            enableShiftDragZoom: true,
            useBrowserForJS: true,
            disableJavaScript: true,
            preventFocus: true,
            showStartTooltip: false,
            errorDialogsActive: false,
            appletOnLoad: (native: Api) => {
              if (disposed) {
                native.remove();
                return;
              }
              clearTimeout(timeout);
              api.current = native;
              const stored = latest.current.scene.geogebra;
              if (stored && stored.sourceKey === geoSourceKey(latest.current.scene)) {
                try {
                  const xml = new DOMParser().parseFromString(stored.xml, 'application/xml');
                  xml.querySelector('gui > font')?.setAttribute('size', '14');
                  native.setXML(new XMLSerializer().serializeToString(xml));
                  source.current = stored.sourceKey;
                } catch {
                  setError('저장한 보기 설정을 불러오지 못했습니다. 수식과 메모는 유지했습니다.');
                }
              }
              // Remove the opaque floor: it hides axis feet and the grid below
              // the curve. Apply to old saved views as well as new constructions.
              if (mode === 'curve') {
                const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
                xml.querySelector('euclidianView3D > plate')?.setAttribute('show', 'false');
                xml.querySelector('euclidianView3D > clipping')?.setAttribute('use', 'false');
                native.setXML(new XMLSerializer().serializeToString(xml));
              }
              native.setPerspective(mode === 'curve' ? 'T' : 'G');
              native.setRounding('2');
              // Official Rotate View (540) / Move Graphics View (40) tools:
              // gestures change the view, never the point or construction.
              native.setMode(mode === 'curve' ? 540 : 40);
              native.registerClientListener((event) => {
                // Classic bundles can use the legacy [type, target, ...] event.
                const eventType = Array.isArray(event) ? event[0] : event.type;
                if (
                  syncing.current ||
                  disposed ||
                  !['viewChanged3D', 'viewChanged2D'].includes(String(eventType))
                )
                  return;
                clearTimeout(timer);
                timer = setTimeout(persist, 300);
              });
              resize = new ResizeObserver(() => {
                cancelAnimationFrame(resizeFrame);
                resizeFrame = requestAnimationFrame(() => {
                  const width = element.clientWidth,
                    height = element.clientHeight;
                  const size = `${width}:${height}`;
                  if (disposed || width <= 0 || height <= 0 || size === lastSize) return;
                  lastSize = size;
                  native.setSize(width, height);
                });
              });
              resize.observe(element);
              setReady(true);
            },
          },
          true,
        );
        applet.setHTML5Codebase(
          new URL(`${import.meta.env.BASE_URL}vendor/GeoGebra/HTML5/5.0/web3d/`, location.href)
            .href,
          true,
        );
        applet.inject(element);
      })
      .catch((e: unknown) => {
        if (!disposed) setError(e instanceof Error ? e.message : '그래프를 열지 못했습니다.');
      });
    const flush = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    document.addEventListener('visibilitychange', flush);
    return () => {
      persist();
      disposed = true;
      clearTimeout(timer);
      clearTimeout(timeout);
      resize?.disconnect();
      cancelAnimationFrame(resizeFrame);
      document.removeEventListener('visibilitychange', flush);
      captureRef.current = null;
      api.current?.remove();
      api.current = null;
    };
  }, [mode, retry, captureRef, restoreRevision]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: view snapshot and notes do not change curve geometry.
  useEffect(() => {
    const native = api.current;
    const element = host.current;
    if (!native || !ready || !element) return;
    syncing.current = true;
    native.setRepaintingActive(false);
    try {
      const key = geoSourceKey(scene);
      const rebuild = source.current !== key;
      if (rebuild) {
        for (const name of ['a', 'b', 'studyCurve', 'StudyPoint'])
          if (native.exists(name)) native.setFixed(name, false, false);
        const variable = scene.mode === 'curve' ? 't' : 'x';
        const terms =
          scene.mode === 'curve'
            ? scene.expressions.map((formula) => geoExpression(formula, variable))
            : ['u', geoExpression(scene.expressions[0], variable)];
        const commands = [
          `a=${geoNumber(scene.a)}`,
          `b=${geoNumber(scene.b)}`,
          `studyCurve=Curve(${terms.join(',')},u,${geoNumber(result.min)},${geoNumber(result.max)})`,
          // Numeric API coordinates keep the point free even for tiny values.
          // A literal such as 1e-16 expressed as arithmetic creates a dependent
          // point in GeoGebra, which setCoords cannot move.
          scene.mode === 'curve' ? 'StudyPoint=(0,0,0)' : 'StudyPoint=(0,0)',
        ];
        if (scene.mode === 'curve')
          for (const name of ['T', 'N', 'B'])
            commands.push(
              `StudyTip${name}=(0,0,0)`,
              `study${name}=Vector(StudyPoint,StudyTip${name})`,
            );
        if (
          !commands.every((command) => {
            const applied = native.evalCommand(command);
            if (!applied) console.warn('GeoGebra construction command failed', command);
            return applied;
          })
        )
          throw Error(
            'GeoGebra에서 이 수식을 그리지 못했습니다. 수식을 확인하거나 다른 그래프로 볼 수 있습니다.',
          );
        native.setColor('studyCurve', ...tokenColor(element, '--color-muted'));
        native.setColor('StudyPoint', ...tokenColor(element, '--color-hierarchy-outline'));
        for (const name of ['a', 'b', 'studyCurve', 'StudyPoint']) {
          native.setLabelVisible(name, false);
          native.setFixed(name, true, false);
        }
        native.setVisible('a', false);
        native.setVisible('b', false);
        source.current = key;
      }
      const view = scene.mode === 'curve' ? 3 : 1;
      native.setAxisSteps(view, 1, 1, 1);
      const gridColor = tokenColor(element, '--color-border');
      native.setGraphicsOptions(view, {
        grid: true,
        gridIsBold: false,
        gridType: 0,
        gridDistance: { x: 1, y: 1 },
        gridColor: `#${gridColor.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`,
      });
      // A rectangular coordinate scaffold: P -> xy plane -> x/y axes,
      // plus the horizontal projection to z. It follows the exact free point.
      const axes = scene.mode === 'curve' ? ['X', 'Y', 'Z', 'XY'] : ['X', 'Y'];
      const feet: Record<string, string> = {
        X: scene.mode === 'curve' ? '(x(StudyPoint),0,0)' : '(x(StudyPoint),0)',
        Y: scene.mode === 'curve' ? '(0,y(StudyPoint),0)' : '(0,y(StudyPoint))',
        Z: '(0,0,z(StudyPoint))',
        XY: '(x(StudyPoint),y(StudyPoint),0)',
      };
      for (const axis of axes) {
        const name = `StudyFoot${axis}`;
        if (!native.exists(name) && !native.evalCommand(`${name}=${feet[axis]}`))
          throw Error('좌표 보조선을 표시하지 못했습니다.');
        native.setVisible(name, false);
        native.setLabelVisible(name, false);
      }
      const guides =
        scene.mode === 'curve'
          ? [
              ['XY', 'StudyPoint', 'StudyFootXY'],
              ['X', 'StudyFootXY', 'StudyFootX'],
              ['Y', 'StudyFootXY', 'StudyFootY'],
              ['Z', 'StudyPoint', 'StudyFootZ'],
            ]
          : [
              ['X', 'StudyPoint', 'StudyFootX'],
              ['Y', 'StudyPoint', 'StudyFootY'],
            ];
      for (const [axis, start, end] of guides) {
        const name = `studyGuide${axis}`;
        if (!native.exists(name) && !native.evalCommand(`${name}=Segment(${start},${end})`))
          throw Error('좌표 보조선을 표시하지 못했습니다.');
        native.setColor(name, ...tokenColor(element, '--color-muted'));
        native.setLineThickness(name, 1);
        native.setLineStyle(name, 2);
        native.setLabelVisible(name, false);
        native.setVisible(name, result.point !== null);
        native.setFixed(name, true, false);
      }
      // Apply presentation to restored constructions too, without rounding coordinates.
      native.setLineThickness('studyCurve', 2);
      native.setPointSize('StudyPoint', 4);
      for (const name of ['a', 'b'] as const) {
        native.setFixed(name, false, false);
        native.setValue(name, scene[name]);
        native.setFixed(name, true, false);
      }
      native.setVisible('StudyPoint', result.point !== null);
      if (result.point) {
        native.setFixed('StudyPoint', false, false);
        native.setCoords('StudyPoint', ...result.point.slice(0, scene.mode === 'curve' ? 3 : 2));
        native.setFixed('StudyPoint', true, false);
      }
      if (scene.mode === 'curve') {
        const colors = {
          T: tokenColor(element, '--color-hierarchy-outline'),
          N: tokenColor(element, '--color-memo-green'),
          B: tokenColor(element, '--color-text'),
        };
        for (const name of ['T', 'N', 'B'] as const) {
          const direction = result.vectors?.[name];
          const visible = Boolean(scene.vectors && direction && result.point);
          if (!native.exists(`study${name}`))
            throw Error(
              `${name} 벡터를 표시하지 못했습니다. 다른 그래프로 보거나 그래프를 다시 열어 주세요.`,
            );
          native.setVisible(`study${name}`, visible);
          native.setVisible(`StudyTip${name}`, false);
          if (visible && result.point && direction)
            native.setCoords(`StudyTip${name}`, ...add(result.point, scale(direction, 1.3)));
          native.setColor(`study${name}`, ...(colors[name] as [number, number, number]));
          native.setLineThickness(`study${name}`, 3);
          native.setCaption(`study${name}`, name);
          native.setLabelStyle(`study${name}`, 3);
          native.setLabelVisible(`study${name}`, visible);
          native.setFixed(`study${name}`, true, false);
        }
      }
      if (rebuild || (revision.current >= 0 && revision.current !== viewRevision)) {
        const points = result.points.filter((p): p is Vec3 => p !== null);
        const bounds = [0, 1, 2].flatMap((i) => {
          const values = points.map((p) => p[i]);
          const low = Math.min(0, ...values),
            high = Math.max(0, ...values);
          const padding = Math.max(1, (high - low) * 0.2);
          return [low - padding, high + padding];
        });
        if (scene.mode === 'curve') {
          native.setCoordSystem(...bounds, false);
          if (!rebuild) native.evalCommand('SetViewDirection()');
        } else native.setCoordSystem(...bounds.slice(0, 4));
      }
      revision.current = viewRevision;
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '그래프를 갱신하지 못했습니다.');
    } finally {
      native.setRepaintingActive(true);
      syncing.current = false;
    }
  }, [
    scene.mode,
    scene.expressions,
    scene.min,
    scene.max,
    scene.a,
    scene.b,
    scene.vectors,
    result,
    viewRevision,
    ready,
  ]);
  useEffect(() => {
    const native = api.current;
    if (!ready || error || !native) {
      onZoomReady(false);
      return;
    }
    zoomRef.current = (factor) => {
      try {
        // This applet rejects scripting zoom commands and evalXML ignores view
        // settings. Reload the complete native snapshot with only its camera
        // changed; preserve all construction objects, coordinates and rotation.
        const xml = new DOMParser().parseFromString(native.getXML(), 'application/xml');
        const viewName = mode === 'curve' ? 'euclidianView3D' : 'euclidianView';
        const coords = xml.querySelector(`${viewName} > coordSystem`);
        if (!coords) throw Error('view');
        for (const name of ['scale', 'yscale', 'zscale']) {
          const value = coords.getAttribute(name);
          if (value !== null) {
            const next = Number(value) * factor;
            if (!Number.isFinite(next) || next <= 0) throw Error('scale');
            coords.setAttribute(name, String(next));
          }
        }
        const point = latest.current.result.point;
        if (mode === 'curve' && point) {
          // 3D origins are world coordinates. Zoom around the current point
          // instead of the empty centre of a helix, retaining its screen position.
          ['xZero', 'yZero', 'zZero'].forEach((name, index) => {
            const origin = Number(coords.getAttribute(name));
            coords.setAttribute(name, String((origin + point[index]) / factor - point[index]));
          });
        }
        if (mode === 'function') {
          const element = host.current;
          if (!element) return;
          for (const [name, center] of [
            [
              'xZero',
              point
                ? Number(coords.getAttribute('xZero')) +
                  (point[0] * Number(coords.getAttribute('scale'))) / factor
                : element.clientWidth / 2,
            ],
            [
              'yZero',
              point
                ? Number(coords.getAttribute('yZero')) -
                  (point[1] *
                    Number(coords.getAttribute('yscale') ?? coords.getAttribute('scale'))) /
                    factor
                : element.clientHeight / 2,
            ],
          ] as const) {
            const value = Number(coords.getAttribute(name));
            coords.setAttribute(name, String(center + (value - center) * factor));
          }
        }
        syncing.current = true;
        native.setXML(new XMLSerializer().serializeToString(xml));
        native.setMode(mode === 'curve' ? 540 : 40);
      } catch {
        setError('확대·축소하지 못했습니다. 그래프를 다시 열어 주세요.');
        return;
      } finally {
        syncing.current = false;
      }
      const snapshot = captureRef.current?.();
      if (snapshot) latest.current.onSnapshot(snapshot);
    };
    onZoomReady(true);
    return () => {
      zoomRef.current = null;
      onZoomReady(false);
    };
  }, [ready, error, mode, zoomRef, captureRef, onZoomReady]);
  return (
    <div className="math-geogebra">
      {!ready && !error && <LoadingState message="그래프를 여는 중입니다." />}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <div className="actions">
            <Button onClick={() => setRetry((value) => value + 1)}>그래프 다시 열기</Button>
            <Button onClick={onFallback}>다른 그래프로 보기</Button>
          </div>
        </div>
      )}
      <section ref={host} className="math-plot math-geogebra-host" aria-label="GeoGebra 그래프"
        onFocusCapture={event => {
          const control = event.target;
          if (!(control instanceof HTMLInputElement) || !control.matches('.slider.accessibilityControl')) return;
          const label = control.max === '360' ? '시점 회전' : control.min === '-90' ? '시점 기울기' : null;
          if (label) { control.setAttribute('aria-label', label); control.title = label; }
        }}
      />
      <a
        className="muted math-help"
        href="https://www.geogebra.org/license"
        target="_blank"
        rel="noreferrer"
      >
        Made with GeoGebra®
      </a>
    </div>
  );
}
