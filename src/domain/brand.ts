export const BRAND = {
  name: 'manseeksong',
  productName: 'ManSeekSong OS',
  promise: '생각을 펼치는 나의 천문대',
  headline: '읽고, 쓰고, 연결하며 생각을 펼쳐요.',
  description: '읽던 자료와 적던 생각을 펼쳐 두고, 새로운 연결을 찾아보세요.',
  monthly: '한 달의 기록, 다음 탐구의 단서.',
  company: '생각을 펼치고 이어가는 도구를 만듭니다.',
  departure: '다녀오세요. 돌아오면 해본 만큼만 남겨 주세요.',
} as const;

/** An observation of an interface action, never a study event or mastery score. */
export type ExperienceAction = 'resume' | 'reuse' | 'share-download' | 'next-step';
export interface ExperienceEvent {
  id: string;
  action: ExperienceAction;
  at: string;
}
export interface WorkLocation {
  route: string;
  label: string;
}
export interface SupportDraft {
  id: string;
  body: string;
  updatedAt: string;
  history?: Array<{ id?: string; body: string; updatedAt: string }>;
}
export interface ExperienceState {
  version: 1;
  last: WorkLocation | null;
  next: { location: WorkLocation; body: string } | null;
  nextHistory?: Array<{ id: string; location: WorkLocation; body: string; archivedAt: string }>;
  readingWidth: 'normal' | 'wide';
  measurement: { enabled: boolean; startedAt: string | null; events: ExperienceEvent[] };
  support: SupportDraft[];
}
export function emptyExperience(): ExperienceState {
  return {
    version: 1,
    last: null,
    next: null,
    readingWidth: 'normal',
    measurement: { enabled: false, startedAt: null, events: [] },
    support: [],
  };
}
/** Replacing a hint does not discard the user's earlier wording. */
export function retainNextAction(
  state: ExperienceState,
  next: ExperienceState['next'],
): ExperienceState {
  if (state.next?.body === next?.body && state.next?.location.route === next?.location.route)
    return state;
  return {
    ...state,
    next,
    nextHistory: state.next
      ? [
          ...(state.nextHistory ?? []),
          { ...state.next, id: crypto.randomUUID(), archivedAt: new Date().toISOString() },
        ]
      : (state.nextHistory ?? []),
  };
}
const validLocation = (v: unknown): v is WorkLocation => {
  if (!v || typeof v !== 'object') return false;
  const p = v as WorkLocation;
  return (
    typeof p.route === 'string' &&
    p.route.startsWith('/') &&
    !p.route.startsWith('//') &&
    !Array.from(p.route).some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127) &&
    p.route.length < 4096 &&
    typeof p.label === 'string'
  );
};
export function validateExperience(value: unknown): asserts value is ExperienceState {
  const fail = () => {
    throw Error('이어가기 정보를 읽지 못했습니다. 보관된 내용은 덮어쓰지 않았습니다.');
  };
  if (!value || typeof value !== 'object') return fail();
  const v = value as ExperienceState;
  if (
    v.nextHistory !== undefined &&
    (!Array.isArray(v.nextHistory) ||
      v.nextHistory.some(
        (h) =>
          !h ||
          typeof h.id !== 'string' ||
          !validLocation(h.location) ||
          typeof h.body !== 'string' ||
          !Number.isFinite(Date.parse(h.archivedAt)),
      ))
  )
    return fail();
  if (
    v.version !== 1 ||
    (v.last !== null && !validLocation(v.last)) ||
    (v.next !== null &&
      (!v.next || !validLocation(v.next.location) || typeof v.next.body !== 'string')) ||
    !['normal', 'wide'].includes(v.readingWidth) ||
    !v.measurement ||
    typeof v.measurement.enabled !== 'boolean' ||
    (v.measurement.startedAt !== null &&
      (typeof v.measurement.startedAt !== 'string' ||
        !Number.isFinite(Date.parse(v.measurement.startedAt)))) ||
    !Array.isArray(v.measurement.events) ||
    !Array.isArray(v.support)
  )
    return fail();
  if (
    v.measurement.events.some(
      (e) =>
        !e ||
        typeof e.id !== 'string' ||
        !['resume', 'reuse', 'share-download', 'next-step'].includes(e.action) ||
        !Number.isFinite(Date.parse(e.at)),
    )
  )
    return fail();
  if (
    v.support.some(
      (s) =>
        !s ||
        typeof s.id !== 'string' ||
        typeof s.body !== 'string' ||
        !Number.isFinite(Date.parse(s.updatedAt)),
    )
  )
    return fail();
  if (
    v.support.some(
      (s) =>
        s.history !== undefined &&
        (!Array.isArray(s.history) ||
          s.history.some(
            (h) => !h || typeof h.body !== 'string' || !Number.isFinite(Date.parse(h.updatedAt)),
          )),
    )
  )
    return fail();
}
