/** Location is a navigation hint, never a study event or a copy of a document. */
export type ObservatoryPlace = 'front' | 'left' | 'right' | 'back';
export const OBSERVATORY_PLACES = [
  { id: 'front', label: '공부 책상', direction: '정면', angle: 0, href: '/' },
  { id: 'left', label: '자료 책장', direction: '왼쪽', angle: 270, href: '/subjects' },
  { id: 'right', label: '탐구 작업대', direction: '오른쪽', angle: 90, href: '/math' },
  { id: 'back', label: '기록·계획 벽', direction: '뒤쪽', angle: 180, href: '/statistics' },
] as const;

export const OBSERVATORY_MENU = [
  { href: '/', text: '오늘', place: 'front' },
  { href: '/record', text: '기록', place: 'front' },
  { href: '/memos', text: '메모', place: 'front' },
  { href: '/practice', text: '시험 연습', place: 'front' },
  { href: '/memory-test', text: '암기시험', place: 'front' },
  { href: '/recall', text: '주제 카드', place: 'front' },
  { href: '/subjects', text: '과목', place: 'left' },
  { href: '/materials', text: '강의 자료', place: 'left' },
  { href: '/material-cards', text: '자료 카드', place: 'left' },
  { href: '/concepts', text: '개념 전집', place: 'left' },
  { href: '/code', text: '코딩 연습', place: 'right' },
  { href: '/math', text: '수식 탐색', place: 'right' },
  { href: '/statistics', text: '통계', place: 'back' },
  { href: '/schedules', text: '일정·과제', place: 'back' },
  { href: '/canvas', text: 'Canvas', place: 'back' },
  { href: '/graph', text: '그래프뷰', place: 'back' },
  { href: '/board', text: '칸반보드', place: 'back' },
  { href: '/search', text: '찾기', place: 'global' },
] as const;

export function routePlace(route: string, nodeRole?: string): ObservatoryPlace | 'global' {
  if (route.startsWith('/node/')) return nodeRole === 'topic' ? 'front' : 'left';
  if (route.startsWith('/subject/')) return 'left';
  if (route === '/materials/trash') return 'global';
  if (route === '/materials/vector-calculus') return 'left';
  if (route.startsWith('/materials/') && route !== '/materials/new') return 'front';
  if (route === '/free' || route.startsWith('/free/')) return 'front';
  if (route === '/my-progress') return 'back';
  return (
    OBSERVATORY_MENU.find(
      (item) => route === item.href || (item.href !== '/' && route.startsWith(`${item.href}/`)),
    )?.place ?? 'global'
  );
}

export type PlaceVisit = { route: string; place: ObservatoryPlace };
export type ObservatoryJourney = { version: 1; current: PlaceVisit; trail: PlaceVisit[] };
export function isObservatoryPlace(value: unknown): value is ObservatoryPlace {
  return OBSERVATORY_PLACES.some((place) => place.id === value);
}
function isVisit(value: unknown): value is PlaceVisit {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<PlaceVisit>;
  try {
    if (typeof entry.route === 'string') encodeURI(entry.route);
  } catch {
    return false;
  }
  return (
    typeof entry.route === 'string' &&
    entry.route.length <= 4096 &&
    /^\/(?!\/)/.test(entry.route) &&
    ![...entry.route].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) &&
    isObservatoryPlace(entry.place)
  );
}
export function startJourney(
  route: string,
  place: ObservatoryPlace | 'global',
): ObservatoryJourney {
  return { version: 1, current: { route, place: place === 'global' ? 'front' : place }, trail: [] };
}
/** Only the same currently restored route may reuse its tab-local caller trail. */
export function restoreJourney(
  value: unknown,
  route: string,
  place: ObservatoryPlace | 'global',
): ObservatoryJourney {
  const fallback = startJourney(route, place);
  if (!value || typeof value !== 'object') return fallback;
  const raw = value as Partial<ObservatoryJourney>;
  if (
    raw.version !== 1 ||
    !isVisit(raw.current) ||
    raw.current.route !== route ||
    !Array.isArray(raw.trail) ||
    raw.trail.length > 32 ||
    !raw.trail.every(isVisit)
  )
    return fallback;
  return {
    version: 1,
    current: { route, place: place === 'global' ? raw.current.place : place },
    trail: raw.trail.filter((visit) => visit.route !== route),
  };
}
/** Walking back to an actual caller truncates the trail instead of making a loop. */
export function visitPlace(
  journey: ObservatoryJourney,
  route: string,
  place: ObservatoryPlace | 'global',
): ObservatoryJourney {
  if (journey.current.route === route) return journey;
  const returnIndex = journey.trail.map((visit) => visit.route).lastIndexOf(route);
  const effectivePlace =
    place === 'global'
      ? returnIndex >= 0
        ? journey.trail[returnIndex].place
        : journey.current.place
      : place;
  return {
    version: 1,
    current: { route, place: effectivePlace },
    trail:
      returnIndex >= 0
        ? journey.trail.slice(0, returnIndex)
        : [...journey.trail, journey.current].slice(-32),
  };
}
