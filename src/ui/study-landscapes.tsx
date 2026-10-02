import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { buildStudyLandscape } from '../domain/study-landscape';
import { storagePrefix } from '../data/repository';
import { Button, Checkbox } from './index';
import { useMotionEnabled } from './motion';
import { buildObservatoryEvents } from '../domain/observatory-events';
import { OBSERVATORY_VIEWBOX } from './observatory-geometry';
import { observatorySkyAt } from '../domain/observatory-time';
import { studyInputDay } from '../domain/daily-study-dynamics';
import { ObservatoryWorld } from './pixel-worlds';
import { ObservatoryRoom } from './observatory-room';
import { observatoryPresentation } from './observatory-presentation';
import './study-landscapes.css';
import { connectObservatoryPointer } from './observatory-pointer';

const scenes = [
  { id: 'garden', name: '작은 뜰' },
  { id: 'river', name: '물가' },
  { id: 'walk', name: '산책길' },
] as const;
type Scene = (typeof scenes)[number]['id'];
type Preferences = { version: 1; paused: boolean; visible: Scene[]; world: 'observatory' };
const defaults = (): Preferences => ({
  version: 1,
  paused: false,
  world: 'observatory',
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
      world: 'observatory',
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
  referenceTime,
  referenceEvent,
  referenceVariant,
}: {
  data: AppState;
  subjectIds?: readonly string[];
  referenceDay?: number;
  referenceTime?: number;
  referenceEvent?: number;
  referenceVariant?: number;
}) {
  const key = `${storagePrefix(data)}:view:pixel-landscapes:${encodeURIComponent(data.userId)}:v1`;
  // Account changes remount the view; scope changes keep the user's display choices.
  return (
    <Landscapes
      key={key}
      data={data}
      subjectIds={subjectIds}
      referenceDay={referenceDay}
      referenceTime={referenceTime}
      referenceEvent={referenceEvent}
      referenceVariant={referenceVariant}
      preferenceKey={key}
    />
  );
}
function Landscapes({
  data,
  subjectIds,
  preferenceKey,
  referenceDay,
  referenceTime,
  referenceEvent,
  referenceVariant,
}: {
  data: AppState;
  subjectIds?: readonly string[];
  preferenceKey: string;
  referenceDay?: number;
  referenceTime?: number;
  referenceEvent?: number;
  referenceVariant?: number;
}) {
  const [preferences, setPreferences] = useState(() => readPreferences(preferenceKey));
  const [storageError, setStorageError] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const motionEnabled = useMotionEnabled();
  const [clock, setClock] = useState(() => Date.now());
  const instant = referenceTime ?? clock;
  const sky = useMemo(() => observatorySkyAt(instant), [instant]);
  const day = referenceDay ?? studyInputDay(instant) ?? 0;
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
  const events = useMemo(
    () =>
      buildObservatoryEvents(
        landscape,
        instant,
        `${data.namespace}:${data.userId}`,
        referenceEvent,
        referenceVariant,
      ),
    [landscape, instant, data.namespace, data.userId, referenceEvent, referenceVariant],
  );
  useEffect(() => {
    if (referenceTime !== undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      setClock(now);
      timer = setTimeout(update, 60000 - (now % 60000));
    };
    update();
    document.addEventListener('visibilitychange', update);
    window.addEventListener('pageshow', update);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('pageshow', update);
    };
  }, [referenceTime]);
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
  const response =
    0.25 + 0.5 * landscape.dynamics.recent[0] + 0.25 * landscape.evolution.colorBloom;
  const pointer = useRef<ReturnType<typeof connectObservatoryPointer> | null>(null);
  const latestResponse = useRef(response);
  const visibleScenes = preferences.visible.join(',');
  useEffect(() => {
    latestResponse.current = response;
    pointer.current?.updateResponse(response);
  }, [response]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    if (!motion || !visibleScenes) return;
    const controller = connectObservatoryPointer(element, latestResponse.current);
    pointer.current = controller;
    return () => {
      controller();
      pointer.current = null;
    };
  }, [motion, visibleScenes]);

  return (
    <section
      ref={root}
      className="study-landscapes section-space"
      aria-labelledby={heading}
      data-motion={motion ? 'running' : 'paused'}
      data-world={preferences.world}
      data-evolution-stage={landscape.evolution.stage}
      data-evolution-position={landscape.evolution.position}
      data-time-phase={sky.phase}
      data-event-selection={events.map((event) => event.spec.id).join(',')}
      style={observatoryPresentation(landscape, response, sky)}
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
              {scenes.map((scene, index) => (
                <Checkbox
                  key={scene.id}
                  label={['별빛', '혜성', '궤도'][index]}
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
        <ObservatoryRoom activity={landscape.response.activity}>
          <svg
            className={`pixel-landscape pixel-world--${preferences.world}`}
            viewBox={OBSERVATORY_VIEWBOX}
            width="960"
            height="400"
            preserveAspectRatio="xMidYMid meet"
            shapeRendering="crispEdges"
            aria-hidden="true"
            focusable="false"
          >
            <ObservatoryWorld
              world={landscape}
              visible={preferences.visible}
              sky={sky}
              events={events}
            />
          </svg>
        </ObservatoryRoom>
      )}
    </section>
  );
}
