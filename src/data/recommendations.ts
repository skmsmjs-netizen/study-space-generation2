import type { AppState } from '../domain/model';
import { emptyRecommendations, recommendationKey, validateRecommendations, type RecommendationWorkspace } from '../domain/recommendation-workspace';
export * from '../domain/recommendation-workspace';

export function readRecommendations(data: AppState, storage: Pick<Storage, 'getItem'> = localStorage) {
  const raw = storage.getItem(recommendationKey(data));
  if (raw === null) return { raw, workspace: emptyRecommendations(data) };
  const workspace: unknown = JSON.parse(raw); validateRecommendations(workspace, data);
  return { raw, workspace };
}
export function saveRecommendations(data: AppState, workspace: RecommendationWorkspace, previousRaw: string | null, storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage) {
  validateRecommendations(workspace, data);
  const key = recommendationKey(data);
  if (storage.getItem(key) !== previousRaw) throw Error('추천 내용이 다른 곳에서 바뀌었습니다. 작성 내용은 두고 다시 읽어 주세요.');
  const raw = JSON.stringify(workspace); storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw Error('추천 내용의 저장을 확인하지 못했습니다. 작성 내용을 유지합니다.');
  return raw;
}

