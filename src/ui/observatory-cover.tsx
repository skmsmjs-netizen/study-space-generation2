import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { AppState } from '../domain/model';
import type { ObservatoryPlace } from '../domain/observatory-place';
import { buildStudyLandscape } from '../domain/study-landscape';
import { studyInputDay } from '../domain/daily-study-dynamics';
import { observatorySkyAt } from '../domain/observatory-time';
import { storagePrefix } from '../data/repository';
import { ObservatoryPlaceScene } from './observatory-place-scene';
import './observatory-cover.css';

const StudyLandscapes = lazy(() =>
  import('./study-landscapes').then((module) => ({ default: module.StudyLandscapes })),
);
type CoverProps = {
  data: AppState;
  subjectIds: readonly string[];
  place: ObservatoryPlace | 'ceiling';
  route: string;
};

/** A single, full-width room view sits before both navigation columns. */
export function ObservatoryCover(props: CoverProps) {
  return (
    <div className="observatory-cover" data-cover-place={props.place}>
      {props.place === 'front' ? (
        <Suspense fallback={<div className="observatory-cover-loading" aria-hidden="true" />}>
          <StudyLandscapes data={props.data} subjectIds={props.subjectIds} />
        </Suspense>
      ) : (
        <RoomCover
          key={`${storagePrefix(props.data)}:${props.data.userId}`}
          {...props}
          place={props.place}
        />
      )}
    </div>
  );
}

function RoomCover({
  data,
  subjectIds,
  place,
  route,
}: CoverProps & { place: Exclude<ObservatoryPlace, 'front'> | 'ceiling' }) {
  const [clock, setClock] = useState(() => Date.now());
  const day = studyInputDay(clock) ?? 0;
  const scope = subjectIds.slice().sort().join('\u0000');
  const world = useMemo(
    () =>
      buildStudyLandscape(
        {
          records: data.records,
          subjects: data.subjects,
          sessions: data.sessions,
          userId: data.userId,
          namespace: data.namespace,
        },
        scope.split('\u0000').filter(Boolean),
        day,
      ),
    [data.records, data.subjects, data.sessions, data.userId, data.namespace, scope, day],
  );
  const sky = useMemo(() => observatorySkyAt(clock), [clock]);
  useEffect(() => {
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
  }, []);
  return (
    <ObservatoryPlaceScene
      place={place}
      route={route}
      world={world}
      sky={sky}
      storageKey={`${storagePrefix(data)}:view:observatory-room:${encodeURIComponent(data.userId)}:v1`}
    />
  );
}
