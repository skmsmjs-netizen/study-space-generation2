import type { AppState } from '../domain/model';
import { emptyRecommendations, type RecommendationWorkspace } from '../domain/recommendation-workspace';
import { readRecommendations } from './recommendations';
import type { StudyRepository } from './repository';
export function readLearningPlan(data: AppState) {
  const row = data.learningPlans?.find(p => !p.deletedAt);
  if (row) return { workspace: row.workspace, raw: JSON.stringify(row.workspace), version: row.version, id: row.id };
  // Legacy demo originals remain at their original key. Personal data is never auto-uploaded.
  const legacy = data.namespace === 'demo' ? readRecommendations(data) : { workspace: emptyRecommendations(data), raw: null };
  return { ...legacy, version: 0, id: 'learning-plan:main' };
}
export function saveLearningPlan(repository: StudyRepository, workspace: RecommendationWorkspace, previousRaw: string | null) {
  const data = repository.getSnapshot(), current = readLearningPlan(data);
  if (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveLearningPlan')) throw Error('학습 일정을 저장할 수 없습니다. 작성 내용은 이 기기에 유지합니다. 다시 접속한 뒤 저장해 주세요.');
  if (current.raw !== previousRaw) throw Error('다른 곳에서 학습 일정이 바뀌었습니다. 작성 중인 내용은 유지했습니다.');
  return repository.execute({ type: 'saveLearningPlan', id: current.id, expectedVersion: current.version, workspace, userId: data.userId, namespace: data.namespace, at: new Date().toISOString(), opId: crypto.randomUUID() });
}

export function readLegacyPersonalPlan(data:AppState) { return data.namespace === 'demo' || data.learningPlans?.some(p=>!p.deletedAt) ? null : readRecommendations(data); }
