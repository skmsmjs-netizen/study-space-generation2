import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { AppState } from '../domain/model';
import { buildStudyLandscape, type StudyLandscape } from '../domain/study-landscape';
import { storagePrefix } from '../data/repository';
import { Button, Checkbox } from './index';
import { useMotionEnabled } from './motion';
import { studyInputDay } from '../domain/daily-study-dynamics';
import './study-landscapes.css';

const scenes = [
  { id: 'garden', name: '작은 뜰' },
  { id: 'river', name: '물가' },
  { id: 'walk', name: '산책길' },
] as const;
type Scene = (typeof scenes)[number]['id'];
type Preferences = { version: 1; paused: boolean; visible: Scene[] };
const defaults = (): Preferences => ({
  version: 1,
  paused: false,
  visible: scenes.map((scene) => scene.id),
});
function readPreferences(key: string): Preferences {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults();
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return defaults();
    const value = saved as Partial<Preferences>;
    if (value.version !== 1 || typeof value.paused !== 'boolean' || !Array.isArray(value.visible))
      return defaults();
    const visible = value.visible;
    return {
      version: 1,
      paused: value.paused,
      visible: scenes.map((scene) => scene.id).filter((id) => visible.includes(id)),
    };
  } catch {
    return defaults();
  }
}

export function StudyLandscapes({
  data,
  subjectIds,
  referenceDay,
}: {
  data: AppState;
  subjectIds?: readonly string[];
  referenceDay?: number;
}) {
  const key = `${storagePrefix(data)}:view:pixel-landscapes:${encodeURIComponent(data.userId)}:v1`;
  // Account changes remount the view; scope changes keep the user's display choices.
  return (
    <Landscapes
      key={key}
      data={data}
      subjectIds={subjectIds}
      referenceDay={referenceDay}
      preferenceKey={key}
    />
  );
}
function Landscapes({
  data,
  subjectIds,
  preferenceKey,
  referenceDay,
}: {
  data: AppState;
  subjectIds?: readonly string[];
  preferenceKey: string;
  referenceDay?: number;
}) {
  const [preferences, setPreferences] = useState(() => readPreferences(preferenceKey));
  const [storageError, setStorageError] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const motionEnabled = useMotionEnabled();
  const [today, setToday] = useState(() => studyInputDay(Date.now()) ?? 0);
  const day = referenceDay ?? today;
  const heading = useId();
  const scope = subjectIds?.slice().sort().join('\u0000');
  const landscape = useMemo(
    () =>
      buildStudyLandscape(
        {
          records: data.records,
          subjects: data.subjects,
          sessions: data.sessions,
          userId: data.userId,
          namespace: data.namespace,
        },
        scope === undefined ? undefined : scope.split('\u0000').filter(Boolean),
        day,
      ),
    [data.records, data.subjects, data.sessions, data.userId, data.namespace, scope, day],
  );
  useEffect(() => {
    if (referenceDay !== undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const now = Date.now(),
        next = studyInputDay(now) ?? 0;
      setToday(next);
      clearTimeout(timer);
      timer = setTimeout(update, Math.max(1000, (next + 1) * 86400000 - 9 * 3600000 - now));
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, [referenceDay]);
  useEffect(() => {
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver((entries) => setOnScreen(entries[0]?.isIntersecting ?? false));
    if (root.current) observer?.observe(root.current);
    return () => observer?.disconnect();
  }, []);
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === preferenceKey)
        setPreferences(readPreferences(preferenceKey));
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [preferenceKey]);
  function change(next: Preferences) {
    setPreferences(next);
    try {
      localStorage.setItem(preferenceKey, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }
  const motion = !preferences.paused && motionEnabled && onScreen;
  return (
    <section
      ref={root}
      className="study-landscapes section-space"
      aria-labelledby={heading}
      data-motion={motion ? 'running' : 'paused'}
      style={
        {
          '--pixel-wind-period': `${20 - 12 * landscape.dynamics.recent[1]}s`,
          '--pixel-wave-period': `${7 - 4 * landscape.dynamics.recent[0]}s`,
          '--pixel-wave-travel': `${4 + Math.round(12 * Math.abs(landscape.dynamics.change[0]))}px`,
          '--pixel-boat-bob': `${1 + Math.round(5 * Math.abs(landscape.dynamics.change[0]))}px`,
          '--pixel-walk-period': `${32 - 16 * landscape.dynamics.recent[2]}s`,
          '--pixel-step-period': `${0.9 - 0.4 * landscape.dynamics.recent[2]}s`,
          '--pixel-sway-period': `${5 - 2 * landscape.dynamics.recent[1]}s`,
        } as CSSProperties
      }
    >
      <div className="landscape-heading">
        <h2 id={heading}>공부 사이의 풍경</h2>
        <div className="landscape-controls">
          <Button
            variant="quiet"
            className="landscape-icon-button"
            disabled={!motionEnabled}
            aria-label={
              !motionEnabled ? '정지된 풍경' : preferences.paused ? '풍경 움직이기' : '풍경 멈추기'
            }
            aria-pressed={preferences.paused || !motionEnabled}
            onClick={() => change({ ...preferences, paused: !preferences.paused })}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" width="20" height="20">
              {preferences.paused ? (
                <path d="M7 4l9 6-9 6z" fill="currentColor" />
              ) : (
                <path d="M7 5v10M13 5v10" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </Button>
          <details className="landscape-options">
            <summary aria-label="풍경 고르기">
              <svg viewBox="0 0 20 20" aria-hidden="true" width="20" height="20">
                <path
                  d="M4 6h12M4 14h12M8 3v6M12 11v6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </summary>
            <div>
              {scenes.map((scene) => (
                <Checkbox
                  key={scene.id}
                  label={scene.name}
                  checked={preferences.visible.includes(scene.id)}
                  onChange={(event) =>
                    change({
                      ...preferences,
                      visible: event.target.checked
                        ? [...preferences.visible, scene.id]
                        : preferences.visible.filter((id) => id !== scene.id),
                    })
                  }
                />
              ))}
              <Button variant="quiet" onClick={() => change(defaults())}>
                기본 풍경으로
              </Button>
            </div>
          </details>
        </div>
      </div>
      {storageError && (
        <p role="status" className="muted">
          이 브라우저에서 풍경 설정을 저장하지 못했습니다. 지금 선택은 유지됩니다.{' '}
          <Button variant="quiet" onClick={() => change(preferences)}>
            설정 저장 다시 시도
          </Button>
        </p>
      )}
      {preferences.visible.length > 0 && (
        <svg
          className="pixel-landscape"
          viewBox="0 0 320 240"
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          <Island />
          {preferences.visible.includes('river') && (
            <g className="pixel-layer pixel-landscape--river">
              <River world={landscape} />
            </g>
          )}
          <Cabin />
          {preferences.visible.includes('garden') && (
            <g className="pixel-layer pixel-landscape--garden">
              <Garden world={landscape} />
            </g>
          )}
          <Bridge />
          {preferences.visible.includes('walk') && (
            <g className="pixel-layer pixel-landscape--walk">
              <Walk world={landscape} />
            </g>
          )}
          <Tree x={260} y={88} />
          <path
            d="M271 174h3v-8h2v8h3v2h-8zM29 172h2v-5h2v5h3v2h-7zM113 208h8v2h-8M135 215h4v2h-4M246 197h8v2h-8"
            className="pixel-muted"
          />
        </svg>
      )}
    </section>
  );
}

// Artwork uses a shared integer pixel grid. The three data layers remain independently selectable.
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="pixel-cloud">
        <path d="M0 8h6V4h6V0h14v4h8v4h6v6H0z" className="pixel-soft" />
        <path d="M4 12h30v2H4z" className="pixel-muted" opacity=".2" />
      </g>
    </g>
  );
}
function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-18 56h36v4h-36z" className="pixel-shadow" />
      <path d="M-3 22h6v36h-6zM-6 56h12v2H-6z" className="pixel-muted" />
      <g className="pixel-tree-sway">
        <path
          d="M-4 -4h8v6h6v6h6v8h6v12h-4v12h-8v4h-20v-4h-8V28h-4V16h6V8h6V2h6z"
          className="pixel-ink"
        />
        <path
          d="M-4 0h8v6h6v6h6v8h4v8h-4v8h-6v4h-20v-4h-6v-8h-4v-8h4v-8h6V6h6z"
          className="pixel-muted"
        />
        <path
          d="M-4 2h8v6h-8M-10 12h8v4h-8M-16 22h8v4h-8M-8 30h6v4h-6M4 16h6v4H4"
          className="pixel-soft"
        />
        <path d="M12 26h4v8h-6v4H0v-4h8z" className="pixel-ink" opacity=".3" />
      </g>
    </g>
  );
}
function Island() {
  return (
    <>
      <Cloud x={49} y={35} />
      <Cloud x={199} y={19} />
      <path d="M263 46h10v4h4v10h-4v4h-10v-4h-4V50h4z" className="pixel-soft" />
      <path d="M44 226h232v2H44M62 230h196v2H62" className="pixel-shadow" />
      <path
        d="M38 148h14v-12h30v-10h160v10h30v12h14v18h12v32h-12v12h-28v8h-52v6h-94v-6H66v-8H40v-12H26v-32h12z"
        className="pixel-muted"
      />
      <path
        d="M38 140h14v-12h30v-8h160v8h30v12h14v16h12v26h-12v12h-28v8h-52v6h-94v-6H66v-8H40v-12H26v-26h12z"
        className="pixel-soft"
      />
      <path
        d="M42 140h14v-10h28v-8h156v8h28v12h14v16h12v20h-12v12h-28v8h-50v6h-92v-6H70v-8H44v-12H30v-20h12z"
        className="pixel-ground"
      />
      <path
        d="M44 197h14v8H44M71 207h10v8H71M93 212h10v8H93M248 207h10v8h-10M270 195h10v8h-10"
        className="pixel-ink"
        opacity=".25"
      />
      <path
        d="M59 141h6v2h-6M151 131h7v2h-7M274 158h6v2h-6M53 183h8v2h-8M88 194h4v2h-4M234 177h8v2h-8M242 185h3v2h-3M102 207h5v2h-5"
        className="pixel-muted"
        opacity=".5"
      />
      <Tree x={45} y={94} scale={0.7} />
      <Tree x={234} y={92} scale={0.75} />
      <path
        d="M98 138h36v4h-12v8h-8v8h-12v6h118v8H97v-8H87v-10h10v-10h1z"
        className="pixel-paper"
      />
    </>
  );
}
function Cabin() {
  return (
    <g>
      <path d="M68 144h92v6H68z" className="pixel-shadow" />
      <path d="M117 67h8v-18h-8z" className="pixel-muted" />
      <path d="M115 47h12v4h-12z" className="pixel-ink" />
      <g className="pixel-smoke">
        <path d="M120 38h5v5h-5M124 26h7v6h-7M118 17h5v4h-5" className="pixel-soft" />
      </g>
      <path d="M72 91h74v50H72z" className="pixel-ink" />
      <path d="M75 94h68v45H75z" className="pixel-paper" />
      <path d="M129 94h14v45h-14z" className="pixel-soft" />
      <path
        d="M62 88h6v-6h6v-6h6v-6h6v-6h6v-6h34v6h6v6h6v6h6v6h6v6h6v8H62z"
        className="pixel-ink"
      />
      <path d="M70 88h6v-6h6v-6h6v-6h6v-6h30v6h6v6h6v6h6v6h6v4H70z" className="pixel-muted" />
      <path d="M94 66h28v2H94M88 74h38v2H88M81 82h49v2H81M75 89h62v2H75" className="pixel-soft" />
      <path d="M96 80h10v-6h10v6h10v14H96z" className="pixel-ink" />
      <path d="M99 83h8v-6h6v6h10v11H99z" className="pixel-paper" />
      <path d="M107 84h8v8h-8zM111 84v8M107 88h8" className="pixel-muted" />
      <path d="M84 103h20v21H84zM113 111h14v28h-14z" className="pixel-ink" />
      <path d="M87 106h14v14H87zM116 114h8v25h-8z" className="pixel-soft" />
      <path d="M92 106h2v14h-2M87 112h14v2H87M121 125h2v2h-2" className="pixel-ink" />
      <path d="M82 122h24v3H82M82 128h24v3H82M84 131h20v5H84" className="pixel-muted" />
      <path d="M88 130h3v-4h-3M98 130h3v-4h-3" className="pixel-ink" />
      <path d="M111 139h20v3h-20M108 143h26v3h-26" className="pixel-muted" />
      <path d="M151 130h29v4h-29M154 134h2v10h-2M174 134h2v10h-2" className="pixel-ink" />
      <path d="M157 126h7v-3h2v3h7v5h-7v-2h-2v2h-7z" className="pixel-paper" />
      <path d="M180 125h4v-8h6v8h4v3h-14zM181 129h12v3h-12" className="pixel-muted" />
    </g>
  );
}
function Garden({ world }: { world: StudyLandscape }) {
  return (
    <>
      <path d="M44 151h52v2H44M44 164h52v2H44M44 177h52v2H44" className="pixel-soft" />
      {world.plants.map((plant, index) => {
        const x = 48 + (index % 4) * 13,
          y = 159 + Math.floor(index / 4) * 12,
          h = 6 + (plant.seed % 4);
        return (
          <g key={plant.key} transform={`translate(${x} ${y})`}>
            <path d="M-3 0h8v3h-8M-2 3h6v3h-6" className="pixel-muted" />
            <path d={`M0 0h2v-${h}H0M-3 -4h3v2h-3M2 -6h3v2H2`} className="pixel-ink" />
            <g className="pixel-sway">
              <path d={`M-2 -${h + 3}h6v4h-6M0 -${h + 5}h2v8H0`} className="pixel-muted" />
              <rect x={0} y={-h - 2} width="2" height="2" className="pixel-paper" />
            </g>
          </g>
        );
      })}
      {['near', 'middle', 'far', 'upper', 'lower']
        .slice(0, 1 + Math.floor(4 * world.dynamics.recent[1]))
        .map((key, index) => (
          <g key={key} transform={`translate(${82 + index * 20} ${106 - (index % 2) * 13})`}>
            <g className="pixel-butterfly" style={{ animationDelay: `${-index * 2}s` }}>
              <path d="M-4 -2h3v3h-3M1 -4h3v3H1M-1 0h2v3h-2" className="pixel-muted" />
            </g>
          </g>
        ))}
      <g transform="translate(279 138)">
        <g className="pixel-sway">
          <path d="M0 0h2v13H0M-4 2h4v4h-4M2 7h4v3H2" className="pixel-muted" />
        </g>
      </g>
    </>
  );
}
function River({ world }: { world: StudyLandscape }) {
  return (
    <>
      <path
        d="M207 120h19v10h-8v12h-9v10h-9v14h9v13h-10v13h10v14h-10v14h-20v-14h10v-12h-10v-14h9v-13h-9v-14h10v-14h10v-12h8z"
        className="pixel-water"
      />
      {['head', 'bend', 'pool', 'tail', 'near', 'far', 'edge', 'middle']
        .slice(0, 3 + Math.floor(5 * world.dynamics.recent[0]))
        .map((key, index) => (
          <g key={key} transform={`translate(${193 + (index % 2) * 8} ${130 + index * 10})`}>
            <g className="pixel-ripple" style={{ animationDelay: `${-index}s` }}>
              <path d="M0 0h8v1H0M-3 3h5v1h-5" className="pixel-paper" />
            </g>
          </g>
        ))}
      {world.days.map((day, index) => (
        <g key={day.key} transform={`translate(${181 + (index % 2) * 23} ${137 + index * 6})`}>
          <path d="M0 1h4v1h2v3H-2V2h2z" className="pixel-muted" />
          <path d="M0 2h3v1H0" className="pixel-paper" />
        </g>
      ))}
      <g transform="translate(192 183)">
        <g className="pixel-boat">
          <path d="M-8 0H8L4 5H-4zM0 -11h1V0H0M1 -10h5v7H1" className="pixel-ink" />
          <path d="M-5 1H5v1H-5" className="pixel-paper" />
        </g>
      </g>
      {world.undated && <path d="M230 148h4v1h-4M237 151h3v1h-3" className="pixel-muted" />}
    </>
  );
}
function Bridge() {
  return (
    <>
      <path d="M174 155h47v5h-47M178 160h4v12h-4M212 160h4v12h-4" className="pixel-muted" />
      <path d="M174 152h47v5h-47z" className="pixel-paper" />
      <path d="M180 152v5M188 152v5M196 152v5M204 152v5M212 152v5" className="pixel-outline" />
      <path
        d="M174 145h47v2h-47M174 145h2v9h-2M188 145h2v9h-2M204 145h2v9h-2M219 145h2v9h-2"
        className="pixel-muted"
      />
    </>
  );
}
function Walk({ world }: { world: StudyLandscape }) {
  return (
    <>
      {world.returns.map((visit, index) => (
        <g key={visit.key} transform={`translate(${113 + index * 15} 176)`}>
          <path d="M0 0h3v1H0M5 3h3v1H5" className="pixel-muted" opacity=".5" />
        </g>
      ))}
      <g className="pixel-walker">
        <path d="M-4 -17h8v2h2v7H-5v-7h1z" className="pixel-ink" />
        <path d="M-3 -12h6v4h-6z" className="pixel-paper" />
        <path d="M2 -12h1v1H2M-3 -8h6v9h-6zM-5 -6h2v5h-2M3 -6h2v5H3" className="pixel-ink" />
        <path d="M-4 -7h2v7h-2z" className="pixel-muted" />
        <g className="pixel-feet">
          <path d="M-3 0h2v4h-4V2h2M1 0h2v2h2v2H1" className="pixel-ink" />
        </g>
      </g>
      <g transform="translate(246 151)">
        <path d="M-8 8H8v2H-8" className="pixel-shadow" />
        <g className="pixel-cat">
          <path d="M-5 -2h3v-4h2v2h3v-2h2v8H3v5h-9V1h-3v-5h2v4h2z" className="pixel-muted" />
          <path d="M-1 -1h1v1h-1M3 -1h1v1H3" className="pixel-paper" />
        </g>
      </g>
    </>
  );
}
