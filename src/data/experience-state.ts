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
  archiveDamagedDraft,
} from './draft-safety';
import { listDraftArchives, readDraftArchive, type DraftArchive } from './draft-archives';
import { personalDraftWindow } from './personal-draft-window';

export const EXPERIENCE_CHANGED = 'study-space:experience-changed';
export const experienceKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:experience:v1`;
export function readExperience(data: Pick<AppState, 'namespace' | 'userId'>): ExperienceState {
  const raw = readRescuedDraft(experienceKey(data), { scope: 'device' }) ?? localStorage.getItem(experienceKey(data));
  if (raw === null) return emptyExperience();
  try {
    const value: unknown = JSON.parse(raw);
    validateExperience(value);
    return value;
  } catch {
    throw Error('이어가기 설정을 읽지 못했습니다. 원문은 유지했습니다. 다시 읽거나 설정 원문·보관본을 확인해 주세요.');
  }
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
    storeDraftSafely(key, raw, { scope: 'device' });
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
type ExperienceOwner = Pick<AppState, 'namespace' | 'userId'>;
export interface ExperienceRecovery {
  key: string;
  savedRaw: string | null;
  rescuedRaw: string | null;
  archives: Array<DraftArchive & { usable: boolean }>;
  issues: string[];
}
const validExperienceRaw = (raw: string | null) => {
  if (raw === null) return false;
  try { validateExperience(JSON.parse(raw)); return true; } catch { return false; }
};
/** Read only this owner's exact setting strings; no repair or write on inspection. */
export function inspectExperienceRecovery(data: ExperienceOwner): ExperienceRecovery {
  const key = experienceKey(data);
  let savedRaw: string | null, rescuedRaw: string | null;
  try {
    savedRaw = localStorage.getItem(key);
    rescuedRaw = readRescuedDraft(key, { scope: 'device' });
  } catch {
    throw Error('이 기기의 설정 원문에 접근하지 못했습니다. 저장된 내용을 변경하지 않았습니다. 연결과 브라우저의 저장 허용을 확인한 뒤 다시 읽어 주세요.');
  }
  const list = listDraftArchives(undefined, key);
  const archives = list.archives.filter(archive => archive.sourceKey === key)
    .map(archive => ({ ...archive, usable: validExperienceRaw(archive.raw) }))
    .sort((a, b) => (b.metadata?.archivedAt ?? '').localeCompare(a.metadata?.archivedAt ?? '') || a.archiveKey.localeCompare(b.archiveKey));
  return { key, savedRaw, rescuedRaw, archives,
    issues: [...new Set(list.issues.map(issue => issue.message))] };
}
export function serializeExperienceRecovery(snapshot: ExperienceRecovery): string {
  return JSON.stringify({ format: 'manseeksong-experience-recovery', version: 1, ...snapshot }, null, 2);
}
/** Archive the exact previous strings before an explicit restore/restart. */
export function restoreExperience(
  data: ExperienceOwner,
  expected: ExperienceRecovery,
  choice: { kind: 'archive'; archiveKey: string; raw: string } | { kind: 'restart' },
): ExperienceState {
  const key = experienceKey(data);
  const unchanged = () => {
    if (expected.key !== key || localStorage.getItem(key) !== expected.savedRaw ||
      readRescuedDraft(key, { scope: 'device' }) !== expected.rescuedRaw)
      throw Error('다른 창에서 설정이 바뀌었습니다. 현재 설정과 보관본을 유지했습니다. 목록을 다시 읽고 복구할 내용을 확인해 주세요.');
  };
  unchanged();
  let raw: string;
  if (choice.kind === 'archive') {
    const archive = readDraftArchive(choice.archiveKey, undefined, key);
    if (archive.sourceKey !== key || archive.raw !== choice.raw || !validExperienceRaw(archive.raw))
      throw Error('복구할 보관본을 확인하지 못했습니다. 원문을 바꾸지 않았습니다. 목록을 다시 읽어 주세요.');
    const recovered: unknown = JSON.parse(choice.raw);
    validateExperience(recovered);
    // A historical copy is not renewed consent to observation. Keep its original in the archive.
    raw = recovered.measurement.enabled
      ? JSON.stringify({ ...recovered, measurement: { ...recovered.measurement, enabled: false } })
      : choice.raw;
  } else raw = JSON.stringify(emptyExperience());
  if (expected.savedRaw !== null) archiveDamagedDraft(key, '이어가기 설정 복구 전 원문');
  if (expected.rescuedRaw !== null && expected.rescuedRaw !== expected.savedRaw)
    archiveDamagedDraft(key, '저장하지 못한 이어가기 설정 원문', expected.rescuedRaw);
  const windowId = personalDraftWindow(key);
  const windowRaw = windowId ? localStorage.getItem(`${key}:recovery:window-${windowId}`) : null;
  if (windowRaw !== null && windowRaw !== raw && windowRaw !== expected.savedRaw && windowRaw !== expected.rescuedRaw)
    archiveDamagedDraft(key, '이 창의 이어가기 설정 복구 전 사본', windowRaw);
  unchanged();
  try {
    storeDraftSafely(key, raw, { scope: 'device' });
    if (localStorage.getItem(key) !== raw) throw Error('복구한 설정의 저장을 확인하지 못했습니다. 원문 사본은 유지했습니다. 다시 시도해 주세요.');
  } catch (error) {
    rescueWithoutOverwrite(key, raw);
    throw error;
  } finally {
    window.dispatchEvent(new CustomEvent(EXPERIENCE_CHANGED, { detail: key }));
  }
  return readExperience(data);
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
