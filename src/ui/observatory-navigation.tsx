import { motion } from 'motion/react';
import { useMotionEnabled } from './motion';
import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  OBSERVATORY_MENU,
  OBSERVATORY_PLACES,
  restoreJourney,
  routePlace,
  visitPlace,
  type ObservatoryJourney,
} from '../domain/observatory-place';
import { storagePrefix } from '../data/repository';
import { navigate } from './navigation-context';
import './observatory-navigation.css';

function readJourney(key: string, route: string, place: ReturnType<typeof routePlace>) {
  try {
    return restoreJourney(JSON.parse(sessionStorage.getItem(key) || 'null'), route, place);
  } catch {
    return restoreJourney(null, route, place);
  }
}

/** Tab-local routes only. The existing context owners restore text, focus and viewport. */
export function useObservatoryJourney(data: AppState, route: string) {
  const key = `${storagePrefix(data)}:observatory-journey:v1`;
  const place = routePlace(route, data.nodes.find((node) => route === `/node/${node.id}`)?.role);
  const [stored, setStored] = useState(() => ({ key, journey: readJourney(key, route, place) }));
  let journey = stored.journey;
  if (stored.key !== key) journey = readJourney(key, route, place);
  else if (journey.current.route !== route) journey = visitPlace(journey, route, place);
  if (stored.key !== key || journey !== stored.journey) setStored({ key, journey });
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(journey));
    } catch {
      /* Navigation stays usable; no original text is stored here. */
    }
  }, [key, journey]);
  const caller = [...journey.trail]
    .reverse()
    .find(
      (entry) =>
        !['/materials/new', '/free/new'].includes(entry.route) && routeAvailable(data, entry.route),
    );
  return {
    journey,
    caller,
    studySource: studySourceVisit(data, journey),
    global: place === 'global',
  };
}

/** A completed record returns only within its current source/tool task, not to an old visit. */
export function studySourceVisit(data: AppState, journey: ObservatoryJourney) {
  for (const visit of [...journey.trail].reverse()) {
    if (
      data.studyMaterials?.some(
        (item) => !item.deletedAt && visit.route === `/materials/${item.id}`,
      ) ||
      data.nodes.some(
        (item) => !item.deletedAt && item.role === 'topic' && visit.route === `/node/${item.id}`,
      )
    )
      return visit;
    if (!/^\/(math|code|record)(\/|$)/.test(visit.route)) return undefined;
  }
  return undefined;
}

export function routeAvailable(data: AppState, route: string) {
  const activeId = (items: { id: string; deletedAt?: string | null }[], prefix: string) =>
    items.some((item) => !item.deletedAt && route === `${prefix}/${item.id}`);
  if (route.startsWith('/subject/')) return activeId(data.subjects, '/subject');
  if (route.startsWith('/node/')) return activeId(data.nodes, '/node');
  if (route.startsWith('/materials/') && !['/materials/new', '/materials/trash'].includes(route))
    return activeId(data.studyMaterials ?? [], '/materials');
  if (route.startsWith('/memos/')) return activeId(data.memos ?? [], '/memos');
  if (route.startsWith('/code/')) return activeId(data.codeExamples ?? [], '/code');
  if (route.startsWith('/free/') && route !== '/free/new')
    return activeId(data.narratives, '/free');
  if (route.startsWith('/record/')) return activeId([...data.subjects, ...data.nodes], '/record');
  return (
    OBSERVATORY_MENU.some((item) => route === item.href) ||
    [
      '/free',
      '/free/new',
      '/materials/new',
      '/materials/trash',
      '/recall/scheduled',
      '/my-progress',
      '/backup',
      '/trash',
      '/draft-archives',
      '/about',
      '/help',
      '/subscription',
      '/account',
    ].includes(route) ||
    route.startsWith('/practice/') ||
    route.startsWith('/memory-test/')
  );
}

export function observatoryRouteTitle(data: AppState, route: string) {
  const named = route.startsWith('/subject/')
    ? data.subjects.find((item) => route === `/subject/${item.id}`)?.name
    : route.startsWith('/node/')
      ? data.nodes.find((item) => route === `/node/${item.id}`)?.name
      : route.startsWith('/materials/')
        ? data.studyMaterials?.find((item) => route === `/materials/${item.id}`)?.title
        : undefined;
  if (named) return named;
  if (route.startsWith('/free')) return '자유 기록';
  if (route === '/my-progress') return '내 생각 다시 보기';
  const utilities: Record<string, string> = {
    '/help': '도움말',
    '/subscription': '도움말',
    '/about': '소개',
    '/backup': '백업·복원',
    '/trash': '휴지통',
    '/draft-archives': '초안 보관본',
    '/materials/trash': '자료 휴지통',
  };
  return (
    utilities[route] ??
    OBSERVATORY_MENU.find(
      (item) => route === item.href || (item.href !== '/' && route.startsWith(`${item.href}/`)),
    )?.text ??
    '찾을 수 없는 항목'
  );
}

/** Reveal the destination within the horizontal strip without moving the page
 * or replacing the user's saved reading position. */
function revealPlaceLink(list: HTMLElement, link: HTMLElement) {
  const bounds = list.getBoundingClientRect();
  const target = link.getBoundingClientRect();
  const inset = Number.parseFloat(getComputedStyle(list).scrollPaddingInlineStart) || 0;
  const before = target.left - bounds.left - inset;
  const after = target.right - bounds.right + inset;
  list.scrollLeft += before < 0 ? before : after > 0 ? after : 0;
}

export function ObservatoryNavigation({
  data,
  route,
  journey,
  global,
}: {
  data: AppState;
  route: string;
  journey: ObservatoryJourney;
  global: boolean;
}) {
  const place =
    OBSERVATORY_PLACES.find((item) => item.id === journey.current.place) ?? OBSERVATORY_PLACES[0];
  const motionEnabled = useMotionEnabled();
  const placeLinks = useRef<HTMLElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Place changes update aria-current in the committed DOM; reveal only that destination, preserving manual strip scroll on unrelated renders.
  useEffect(() => {
    const list = placeLinks.current;
    if (!list) return;
    const revealCurrent = () => {
      const current = list.querySelector<HTMLElement>('[aria-current="location"]');
      if (current) revealPlaceLink(list, current);
    };
    revealCurrent();
    if (typeof ResizeObserver === 'undefined') return;
    let width = list.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const nextWidth = list.getBoundingClientRect().width;
      if (nextWidth === width) return;
      width = nextWidth;
      revealCurrent();
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, [place.id, global]);
  const previousPlace = journey.trail.at(-1)?.place;
  const moved = previousPlace && previousPlace !== place.id;
  const direction = place.id === 'left' ? -1 : place.id === 'right' ? 1 : 0;
  const returnPlace = [...journey.trail]
    .reverse()
    .find(
      (entry) =>
        routeAvailable(data, entry.route) &&
        routePlace(
          entry.route,
          data.nodes.find((node) => entry.route === `/node/${node.id}`)?.role,
        ) !== 'global',
    );
  return (
    <section className="observatory-navigation" aria-label="천문대의 현재 자리">
      <nav ref={placeLinks} className="observatory-place-links" aria-label="천문대 자리" onFocus={event => {
        const link = event.target.closest('a');
        if (link) revealPlaceLink(event.currentTarget, link);
      }}>
        {OBSERVATORY_PLACES.map((item) => (
          <a
            key={item.id}
            href={`#${item.href}`}
            aria-current={!global && place.id === item.id ? 'location' : undefined}
            data-navigation-focus={`observatory-place:${item.id}`}
          >
            <span className="observatory-place-direction">{item.direction}</span>{' '}
            <span>{item.label}</span>
          </a>
        ))}
        <a
          href="#/search"
          aria-current={global ? 'location' : undefined}
          data-navigation-focus="observatory-place:ceiling"
        >
          <span className="observatory-place-direction">위쪽</span> <span>천장 조명</span>
        </a>
      </nav>
      <div className="observatory-location-line">
        <p>
          <motion.span
            key={place.id}
            className="observatory-location-label"
            initial={
              motionEnabled && moved ? { x: direction * 8, y: place.id === 'back' ? 4 : 0 } : false
            }
            animate={{ x: 0, y: 0 }}
            transition={{ duration: motionEnabled ? 0.18 : 0 }}
          >
            {global ? '천장 조명' : place.label}
          </motion.span>

        </p>
        {!global && (
          <details className="observatory-place-shortcuts">
            <summary>이 자리의 기능</summary>
            <nav aria-label={`${place.label}의 기능`}>
              {OBSERVATORY_MENU.filter((item) => item.place === place.id).map((item) => (
                <a
                  href={`#${item.href}`}
                  key={item.href}
                  aria-current={item.href === route ? 'page' : undefined}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </details>
        )}
        <a href="#/search" className="observatory-find" aria-label="어디서나 찾기">
          찾기
        </a>
        {global && (
          <a
            className="observatory-find"
            href={`#${encodeURI(returnPlace?.route ?? place.href)}`}
            data-navigation-focus="observatory:lower-view"
          >
            원래 자리로
          </a>
        )}
      </div>
    </section>
  );
}

export function ObservatoryTaskReturn({
  data,
  route,
  caller,
  studySource,
}: {
  data: AppState;
  route: string;
  caller?: { route: string };
  studySource?: { route: string };
}) {
  const sourceRoute =
    studySource && /^\/(math|code|record)(\/|$)/.test(route) ? studySource.route : route;
  const material = data.studyMaterials?.find(
    (item) => !item.deletedAt && sourceRoute === `/materials/${item.id}`,
  );
  const topic = data.nodes.find(
    (item) => !item.deletedAt && item.role === 'topic' && sourceRoute === `/node/${item.id}`,
  );
  const targetId = topic?.id ?? material?.topicId;
  const source = Boolean(material || topic);
  if (!caller && !source) return null;
  return (
    <nav className="observatory-task-return" aria-label="하던 과업과 이어가기">
      {caller && (
        <a href={`#${encodeURI(caller.route)}`} data-navigation-focus="observatory:return">
          돌아가기 · {observatoryRouteTitle(data, caller.route)}
        </a>
      )}
      {source && (
        <div className="observatory-task-actions">
          {route !== '/math' && <a href="#/math">수식 도구 펼치기</a>}
          {!route.startsWith('/code') && <a href="#/code">코드 도구 펼치기</a>}
          {!route.startsWith('/record') && (
            <a href={targetId ? `#/record/${encodeURIComponent(targetId)}` : '#/record'}>
              이어서 기록하기
            </a>
          )}
          {material && <a href="#/materials">자료 목록</a>}
        </div>
      )}
    </nav>
  );
}

export function returnFromObservatory(caller: { route: string } | undefined, fallback: string) {
  navigate(caller?.route ?? fallback);
}
