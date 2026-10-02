import { memo, useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { motion as roomMotion } from '../../docs/observatory-experience-baseline.json';
import {
  OBSERVATORY_MENU,
  OBSERVATORY_PLACES,
  type ObservatoryPlace,
} from '../domain/observatory-place';
import type { StudyLandscape } from '../domain/study-landscape';
import type { ObservatorySky } from '../domain/observatory-time';
import { ObservatoryPlaceArt } from './observatory-place-art';
import { connectObservatoryPointer } from './observatory-pointer';
import { connectRoomGPU, type RoomGPUConnection } from './observatory-room-gpu';
import { observatoryLOD } from './observatory-flow';
import { useMotionEnabled } from './motion';
import './observatory-place-scene.css';

function readPreference(key: string, value: string) {
  try {
    return localStorage.getItem(key) === value;
  } catch {
    return false;
  }
}

/** Same filtered study engine as the window. No records are created by scenery or interaction. */
export const ObservatoryPlaceScene = memo(function ObservatoryPlaceScene({
  place,
  route,
  storageKey,
  world,
  sky,
}: {
  place: Exclude<ObservatoryPlace, 'front'> | 'ceiling';
  route: string;
  storageKey: string;
  world: StudyLandscape;
  sky: ObservatorySky;
}) {
  const id = useId();
  const [open, setOpen] = useState(() => !readPreference(storageKey, 'closed'));
  const [paused, setPaused] = useState(() => readPreference(`${storageKey}:paused`, 'true'));
  const [preferenceError, setPreferenceError] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const gpu = useRef<RoomGPUConnection | null>(null);
  const pointer = useRef<ReturnType<typeof connectObservatoryPointer> | null>(null);
  const previous = useRef(place);
  const enabled = useMotionEnabled();
  const playing = enabled && open && onScreen && !paused;
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const turn = enabled && previous.current !== place;
  const values = useMemo(
    () => ({
      place,
      activity: world.response.activity,
      density: world.response.density,
      glimmer: world.response.earlyGlimmer,
      growth: Math.max(0, Math.min(1, world.evolution.position / 11)),
      light: sky.nightLight,
    }),
    [place, world.response, world.evolution.position, sky.nightLight],
  );
  const latest = useRef(values);
  latest.current = values;
  useEffect(() => {
    previous.current = place;
  }, [place]);
  useEffect(() => {
    if (!root.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.01 },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;
      if (event.key === storageKey || event.key === null)
        setOpen(!readPreference(storageKey, 'closed'));
      if (event.key === `${storageKey}:paused` || event.key === null)
        setPaused(readPreference(`${storageKey}:paused`, 'true'));
    };
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [storageKey]);
  useEffect(() => {
    if (!open || !canvas.current) return;
    const connection = connectRoomGPU(canvas.current, { ...latest.current, place });
    gpu.current = connection;
    connection.setPlaying(playingRef.current);
    return () => {
      connection();
      gpu.current = null;
    };
  }, [open, place]);
  useEffect(() => {
    gpu.current?.update(values);
  }, [values]);
  useEffect(() => {
    gpu.current?.setPlaying(playing);
  }, [playing]);
  useEffect(() => {
    if (!open || !playing || !root.current || root.current.dataset.placeScene !== place) return;
    const element = root.current;
    const cameraChanged = () => {
      const number = (name: string, fallback = 0) => {
        const parsed = Number.parseFloat(element.style.getPropertyValue(name));
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      const x = number('--pixel-pan-x'),
        y = number('--pixel-pan-y');
      const zoom = number('--pixel-sky-zoom', 1);
      element.style.setProperty('--room-pan-x', String(x));
      element.style.setProperty('--room-pan-y', String(y));
      element.style.setProperty('--room-pan-pct-x', `${(x / 960) * 100}%`);
      element.style.setProperty('--room-pan-pct-y', `${(y / 260) * 100}%`);
      element.style.setProperty(
        '--room-origin-x',
        `${(number('--pixel-origin-x', 480) / 960) * 100}%`,
      );
      element.style.setProperty(
        '--room-origin-y',
        `${(number('--pixel-origin-y', 130) / 260) * 100}%`,
      );
      element.style.setProperty('--room-detail', String(observatoryLOD(zoom)[2]));
    };
    element.addEventListener('observatory-camera', cameraChanged);
    const connection = connectObservatoryPointer(element, latest.current.activity, {
      svgSelector: 'svg.observatory-place-art',
      cameraYOffset: 0,
    });
    pointer.current = connection;
    return () => {
      connection();
      cameraChanged();
      element.removeEventListener('observatory-camera', cameraChanged);
      pointer.current = null;
    };
  }, [open, playing, place]);
  useEffect(() => {
    pointer.current?.updateResponse(values.activity);
  }, [values.activity]);
  const save = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      setPreferenceError(false);
    } catch {
      setPreferenceError(true);
    }
  };
  const label =
    place === 'ceiling'
      ? '천장 조명'
      : (OBSERVATORY_PLACES.find((item) => item.id === place)?.label ?? '천문대');
  const links =
    place === 'ceiling'
      ? [
          { href: '/search', text: '찾기' },
          { href: '/help', text: '도움말' },
          { href: '/backup', text: '백업·복원' },
        ]
      : OBSERVATORY_MENU.filter((item) => item.place === place);
  const style = {
    '--room-activity': values.activity,
    '--room-density': values.density,
    '--room-glimmer': values.glimmer,
    '--room-growth': values.growth,
    '--room-light': values.light,
    '--room-light-depth': place === 'back' ? 0.44 : 0.8,
  } as CSSProperties;
  return (
    <section
      ref={root}
      className="observatory-place-scene"
      data-place-scene={place}
      data-motion={playing ? 'running' : 'paused'}
      data-time-phase={sky.phase}
      data-room-activity={values.activity}
      data-room-density={values.density}
      data-room-glimmer={values.glimmer}
      style={style}
      aria-label={`${label} 풍경`}
    >
      <div id={id} hidden={!open}>
        {open && (
          <motion.div
            key={place}
            className="observatory-scene-viewport"
            initial={
              turn ? { opacity: 0.65, x: place === 'left' ? -8 : place === 'right' ? 8 : 0 } : false
            }
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: enabled ? roomMotion.transitionMs / 1000 : 0, ease: 'easeOut' }}
          >
            <ObservatoryPlaceArt place={place} />
            <canvas
              ref={canvas}
              className="observatory-room-gpu"
              aria-hidden="true"
              tabIndex={-1}
            />
          </motion.div>
        )}
        <nav className="observatory-scene-tools" aria-label={`${label}에서 바로 열기`}>
          {links.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              aria-current={route === item.href ? 'page' : undefined}
              data-navigation-focus={`observatory-scene:${item.href}`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
      <div className="observatory-scene-toolbar">
        <span>{label}</span>
        <div className="observatory-scene-controls">
          {open && (
            <>
              <button type="button" disabled={!playing} onClick={() => pointer.current?.inspect()}>
                가까이 보기
              </button>
              <button type="button" disabled={!playing} onClick={() => pointer.current?.reset()}>
                전체 보기
              </button>
              <button
                type="button"
                aria-pressed={paused}
                onClick={() => {
                  setPaused(!paused);
                  save(`${storageKey}:paused`, String(!paused));
                }}
              >
                {paused ? '풍경 재생' : '풍경 멈춤'}
              </button>
            </>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={() => {
              setOpen(!open);
              save(storageKey, open ? 'closed' : 'open');
            }}
          >
            {open ? '풍경 접기' : '풍경 펼치기'}
          </button>
        </div>
      </div>
      {preferenceError && (
        <p role="status" className="observatory-scene-preference-error">
          풍경 설정을 이 기기에 저장하지 못했어요. 현재 화면에는 적용했어요.
        </p>
      )}
    </section>
  );
});
