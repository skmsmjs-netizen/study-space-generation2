export const BRAND = {
  name: 'manseeksong',
  productName: 'manseeksong os',
  promise: '공부가 이어지는 자리.',
  headline: '다시 펴면, 하던 생각부터.',
  description: '자료를 모으고, 생각을 남기고, 다음 공부로 이어가세요.',
  monthly: '한 달의 기록, 다음 공부의 단서.',
  company: '생각이 실제로 이어지는 도구를 만듭니다.',
  departure: '공부하고 오세요. 돌아오면 해본 만큼만 남겨 주세요.',
} as const;

/** An observation of an interface action, never a study event or mastery score. */
export type ExperienceAction = 'resume' | 'reuse' | 'share-download' | 'next-step';
export interface ExperienceEvent { id: string; action: ExperienceAction; at: string }
export interface WorkLocation { route: string; label: string }
export interface SupportDraft { id: string; body: string; updatedAt: string }
export interface ExperienceState {
  version: 1;
  last: WorkLocation | null;
  next: { location: WorkLocation; body: string } | null;
  readingWidth: 'normal' | 'wide';
  measurement: { enabled: boolean; startedAt: string | null; events: ExperienceEvent[] };
  support: SupportDraft[];
}
export function emptyExperience(): ExperienceState {
  return { version: 1, last: null, next: null, readingWidth: 'normal', measurement: { enabled: false, startedAt: null, events: [] }, support: [] };
}
const validLocation = (v: unknown): v is WorkLocation => {
  if (!v || typeof v !== 'object') return false;
  const p = v as WorkLocation;
  return typeof p.route === 'string' && p.route.startsWith('/') && !p.route.startsWith('//') && !Array.from(p.route).some(c => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127) && p.route.length < 4096 && typeof p.label === 'string';
};
export function validateExperience(value: unknown): asserts value is ExperienceState {
  const fail = () => { throw Error('이어가기 정보를 읽지 못했습니다. 보관된 내용은 덮어쓰지 않았습니다.'); };
  if (!value || typeof value !== 'object') return fail();
  const v = value as ExperienceState;
  if (v.version !== 1 || v.last !== null && !validLocation(v.last) || v.next !== null &&
    (!v.next || !validLocation(v.next.location) || typeof v.next.body !== 'string') ||
    !['normal', 'wide'].includes(v.readingWidth) || !v.measurement || typeof v.measurement.enabled !== 'boolean' ||
    v.measurement.startedAt !== null && (typeof v.measurement.startedAt !== 'string' || !Number.isFinite(Date.parse(v.measurement.startedAt))) ||
    !Array.isArray(v.measurement.events) || !Array.isArray(v.support)) return fail();
  if (v.measurement.events.some(e => !e || typeof e.id !== 'string' || !['resume', 'reuse', 'share-download', 'next-step'].includes(e.action) || !Number.isFinite(Date.parse(e.at)))) return fail();
  if (v.support.some(s => !s || typeof s.id !== 'string' || typeof s.body !== 'string' || !Number.isFinite(Date.parse(s.updatedAt)))) return fail();
}
