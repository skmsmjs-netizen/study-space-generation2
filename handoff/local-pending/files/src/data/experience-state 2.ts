import type { AppState } from '../domain/model';
import {
  emptyExperience,
  validateExperience,
  type ExperienceState,
  type ExperienceAction,
  type WorkLocation,
} from '../domain/brand';
import {
  readRescuedDraft,
  storeDraftSafely,
  draftHasUnstoredText,
  rescueWithoutOverwrite,
} from './draft-safety';

export const EXPERIENCE_CHANGED = 'study-space:experience-changed';
export const experienceKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:experience:v1`;
export function readExperience(data: Pick<AppState, 'namespace' | 'userId'>): ExperienceState {
  const raw = readRescuedDraft(experienceKey(data)) ?? localStorage.getItem(experienceKey(data));
  if (raw === null) return emptyExperience();
  const value: unknown = JSON.parse(raw);
  validateExperience(value);
  return value;
}
/** Keep failed writes in the shared draft rescue; do not replace unreadable prior data. */
export function updateExperience(
  data: Pick<AppState, 'namespace' | 'userId'>,
  change: (current: ExperienceState) => ExperienceState,
): ExperienceState {
  const next = change(readExperience(data));
  validateExperience(next);
  const key = experienceKey(data),
    raw = JSON.stringify(next);
  try {
    storeDraftSafely(key, raw);
    if (localStorage.getItem(key) !== raw)
      throw Error('이어가기 정보의 저장을 확인하지 못했습니다.');
  } catch (error) {
    rescueWithoutOverwrite(key, raw);
    throw error;
  } finally {
    window.dispatchEvent(new CustomEvent(EXPERIENCE_CHANGED, { detail: experienceKey(data) }));
  }
  return next;
}
export function experienceUnstored(data: Pick<AppState, 'namespace' | 'userId'>) {
  return draftHasUnstoredText(experienceKey(data));
}
export function trackExperience(
  data: Pick<AppState, 'namespace' | 'userId'>,
  action: ExperienceAction,
) {
  const current = readExperience(data);
  if (!current.measurement.enabled) return;
  updateExperience(data, (state) => ({
    ...state,
    measurement: {
      ...state.measurement,
      events: [
        ...state.measurement.events,
        { id: crypto.randomUUID(), action, at: new Date().toISOString() },
      ].slice(-500),
    },
  }));
}
/** Resolve against current owned rows. Deleted/foreign targets are never followed. */
export function resolveWorkLocation(data: AppState, route: string): WorkLocation | null {
  const own = (v: { namespace: string; userId: string; deletedAt: string | null }) =>
    v.namespace === data.namespace && v.userId === data.userId && !v.deletedAt;
  const [kind, ...parts] = route.slice(1).split('/');
  const id = parts.join('/');
  if (kind === 'node' || (kind === 'record' && id)) {
    const node = data.nodes.find((v) => v.id === id && own(v));
    const subject = node && data.subjects.find((v) => v.id === node.subjectId && own(v));
    return node && subject ? { route, label: `${subject.name} · ${node.name}` } : null;
  }
  if (kind === 'subject') {
    const row = data.subjects.find((v) => v.id === id && own(v));
    return row ? { route, label: row.name } : null;
  }
  if (kind === 'memos' && id) {
    const row = data.memos?.find((v) => v.id === id && own(v));
    return row ? { route, label: '적던 메모' } : null;
  }
  if (kind === 'materials' && id) {
    const row = data.studyMaterials?.find((v) => v.id === id && own(v));
    return row ? { route, label: '보던 강의 자료' } : null;
  }
  if (kind === 'free' && id) {
    const row = data.narratives.find((v) => v.id === id && own(v));
    return row ? { route, label: '적던 자유 글' } : null;
  }
  const labels: Record<string, string> = {
    '/record': '공부 기록',
    '/free': '자유롭게 남기기',
    '/memos': '작은 메모',
    '/materials': '강의 자료',
    '/code': '코딩 연습',
    '/math': '수식 탐색',
    '/practice': '시험 연습',
    '/memory-test': '암기시험',
    '/recall': '주제 카드',
    '/recall/scheduled': '주제 카드 복습',
    '/canvas': 'Canvas',
    '/board': '칸반보드',
    '/graph': '그래프뷰',
    '/material-cards': '자료 카드',
  };
  return labels[route] ? { route, label: labels[route] } : null;
}
export function downloadText(name: string, body: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
