import type { AppState } from '../domain/model';
import type { GraphSpacing } from '../domain/graph-layout';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';

export interface GraphPreferences {
  version: 1; query: string; subject: string; notes: boolean;
  connections: 'all' | 'personal'; depth: number; spacing: GraphSpacing;
}
export const defaultGraphPreferences: GraphPreferences = {
  version: 1, query: '', subject: '', notes: true, connections: 'all', depth: 1, spacing: 'auto',
};
export const graphPreferencesKey = (data: Pick<AppState, 'userId' | 'namespace'>) =>
  `${storagePrefix(data)}:graph-view:v1`;
export function readGraphPreferences(data: Pick<AppState, 'userId' | 'namespace'>): GraphPreferences {
  const key = graphPreferencesKey(data);
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return { ...defaultGraphPreferences };
  try {
    const p = JSON.parse(raw) as GraphPreferences;
    if (p?.version !== 1 || typeof p.query !== 'string' || typeof p.subject !== 'string' ||
      typeof p.notes !== 'boolean' || !['all', 'personal'].includes(p.connections) ||
      ![1, 2, 3].includes(p.depth) || !['auto', 'compact', 'wide'].includes(p.spacing)) throw Error();
    return p;
  } catch { throw Error('그래프 보기 설정을 읽지 못했습니다. 원래 설정은 보존했습니다. 보기 설정 초기화로 사본을 보관하고 다시 시작할 수 있습니다.'); }
}
export function writeGraphPreferences(data: Pick<AppState, 'userId' | 'namespace'>, preferences: GraphPreferences) {
  storeDraftSafely(graphPreferencesKey(data), JSON.stringify(preferences));
}
