import type { StudyRepository } from './repository';
import { readLearningPlan, saveLearningPlan } from './learning-plan';
import { activeTopic, linkPerformance, validateMaterialCardSource, type PerformanceSource, type MaterialCardSource } from '../domain/learning-evidence';
import type { ResponseDraft } from '../domain/recommendation-workspace';
import type { StudyMaterial } from '../domain/study-material';

export function saveSourcePerformance(repository: StudyRepository, source: PerformanceSource, goalId: string, response: ResponseDraft, previousRaw: string | null) {
  const data = repository.getSnapshot(), plan = readLearningPlan(data);
  if (plan.raw !== previousRaw) throw Error('다른 곳에서 수행 결과가 바뀌었습니다. 현재 선택은 유지했습니다. 다시 열어 확인해 주세요.');
  const goal = plan.workspace.goals.find(g => g.id === goalId);
  if (!goal) throw Error('확인할 내용을 다시 선택해 주세요.');
  return saveLearningPlan(repository, linkPerformance(data, plan.workspace, source, goal, response, new Date().toISOString()), previousRaw);
}
export function registerMaterialCard(repository: StudyRepository, material: StudyMaterial, resultId: string, cardId: string, topicId: string, reviewed: boolean) {
  const data = repository.getSnapshot();
  if (!reviewed) throw Error('질문과 답을 원자료와 대조한 뒤 등록해 주세요.');
  if (!activeTopic(data, topicId)) throw Error('암기 항목을 연결할 주제를 선택해 주세요.');
  if (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemoryCard')) throw Error('암기 항목을 저장할 수 없습니다. 다시 접속해 주세요.');
  const card = material.results.find(r => r.id === resultId)?.cards.find(c => c.id === cardId);
  if (!card) throw Error('저장된 자료 카드를 다시 확인해 주세요.');
  const source: MaterialCardSource = { materialId: material.id, materialVersion: material.version, resultId, cardId, reviewed: true };
  const content = { topicId, question: card.question, answer: card.answer, strokes: [], materialSource: source };
  validateMaterialCardSource(content, data, true);
  const id = 'material-card:' + [material.id, resultId, cardId, topicId].map(encodeURIComponent).join(':');
  const existing = data.memoryCards?.find(c => c.id === id);
  // A repeated action never overwrites edits to a previously registered card or restores trash.
  if (existing) return { data, id, existing: true, deleted: !!existing.deletedAt };
  const next = repository.execute({ type: 'saveMemoryCard', id, expectedVersion: 0, content, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
  return { data: next, id, existing: false, deleted: false };
}
export function saveCodeTopic(repository: StudyRepository, exampleId: string, topicId: string, previousRaw: string | null) {
  const data = repository.getSnapshot(), plan = readLearningPlan(data);
  if (!data.codeExamples?.some(e => e.id === exampleId && !e.deletedAt) || topicId && !activeTopic(data, topicId)) throw Error('코드 예제와 주제를 다시 확인해 주세요.');
  const links = (plan.workspace.codeLinks ?? []).filter(l => l.exampleId !== exampleId);
  if (topicId) links.push({ exampleId, topicId });
  return saveLearningPlan(repository, { ...plan.workspace, revision: plan.workspace.revision+1, codeLinks: links }, previousRaw);
}
