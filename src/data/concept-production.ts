import type { AppState } from '../domain/model';
import type { StudyRepository } from './repository';
import { CONCEPT_BATCH_SIZE, CONCEPT_EDITOR_INSTRUCTIONS, CONCEPT_PROMPT_VERSION, conceptEditionId,
  emptyConceptEdition, parseConceptSource, validateConceptEdition, type ConceptBatch, type ConceptCatalog, type ConceptEditionContent } from '../domain/concept-production';

const context = (data: AppState) => ({ userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString() });
export async function conceptHash(raw: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return [...new Uint8Array(bytes)].map(n => n.toString(16).padStart(2, '0')).join('');
}
export async function importConceptCatalog(repository: StudyRepository, raw: string, filename: string) {
  parseConceptSource(raw);
  const sha256 = await conceptHash(raw);
  return repository.execute({ ...context(repository.getSnapshot()), type: 'importConceptCatalog', id: `concept-catalog:${sha256}`, raw, sha256, filename });
}
export interface ConceptJobFile {
  format: 'concept-job-v1'; jobId: string; catalogId: string; sourceSha256: string;
  promptVersion: string; instructions: string;
  items: { original: ReturnType<typeof parseConceptSource>['items'][number]; proposal: ConceptEditionContent; expectedVersion: number }[];
}
export function conceptJobFile(data: AppState, batch: ConceptBatch): ConceptJobFile {
  const catalog = data.conceptCatalogs?.find(c => c.id === batch.catalogId);
  if (!catalog) throw Error('작업 묶음의 원문을 찾을 수 없습니다.');
  const originals = new Map(parseConceptSource(catalog.raw).items.map(i => [i.id, i]));
  return { format: 'concept-job-v1', jobId: batch.id, catalogId: catalog.id, sourceSha256: catalog.sha256,
    promptVersion: CONCEPT_PROMPT_VERSION, instructions: CONCEPT_EDITOR_INSTRUCTIONS,
    items: batch.sourceIds.map(id => ({ original: originals.get(id)!,
      proposal: data.conceptEditions?.find(e => e.catalogId === catalog.id && e.sourceId === id) ?? emptyConceptEdition(catalog.id, originals.get(id)!),
      expectedVersion: batch.baseVersions[id] })) };
}
export function openConceptBatch(repository: StudyRepository, catalog: ConceptCatalog, sourceIds?: string[]) {
  const data = repository.getSnapshot();
  const editions = new Map((data.conceptEditions ?? []).filter(e => e.catalogId === catalog.id).map(e => [e.sourceId, e]));
  const reserved = new Set((data.conceptBatches ?? []).filter(b => b.catalogId === catalog.id && b.status !== 'closed').flatMap(b => b.sourceIds));
  const ids = sourceIds ?? parseConceptSource(catalog.raw).items.filter(i => !editions.get(i.id)?.screen && !reserved.has(i.id)).map(i => i.id).slice(0, CONCEPT_BATCH_SIZE);
  if (!ids.length) throw Error('열린 작업 묶음을 이어가거나 보류한 개념을 선택해 주세요.');
  if (sourceIds?.some(id => reserved.has(id))) throw Error('이 개념은 열린 작업 묶음에 있습니다. 해당 묶음을 이어가 주세요.');
  const id = `concept-batch:${crypto.randomUUID()}`;
  const next = repository.execute({ ...context(data), type: 'saveConceptBatch', id, expectedVersion: 0,
    content: { catalogId: catalog.id, sourceIds: ids, baseVersions: Object.fromEntries(ids.map(i => [i, editions.get(i)?.version ?? 0])), status: 'open' } });
  return { data: next, batch: next.conceptBatches!.find(b => b.id === id)! };
}
export function saveConceptEdition(repository: StudyRepository, content: ConceptEditionContent, expectedVersion: number) {
  validateConceptEdition(content);
  return repository.execute({ ...context(repository.getSnapshot()), type: 'saveConceptEdition', id: conceptEditionId(content.catalogId, content.sourceId), expectedVersion, content });
}
export interface ConceptResultFile { format: 'concept-results-v1'; jobId: string; sourceSha256: string; items: { sourceId: string; expectedVersion: number; content: ConceptEditionContent }[] }
export function importConceptResults(repository: StudyRepository, raw: string) {
  if (raw.length > 2_000_000) throw Error('결과 파일을 작업 묶음별로 나누어 주세요. 원본은 유지했습니다.');
  const result = JSON.parse(raw) as ConceptResultFile;
  const data = repository.getSnapshot(), batch = data.conceptBatches?.find(b => b.id === result.jobId);
  const catalog = data.conceptCatalogs?.find(c => c.id === batch?.catalogId);
  if (result.format !== 'concept-results-v1' || !batch || !catalog || result.sourceSha256 !== catalog.sha256 || !Array.isArray(result.items) || !result.items.length || result.items.length > CONCEPT_BATCH_SIZE || new Set(result.items.map(i => i.sourceId)).size !== result.items.length)
    throw Error('결과 파일의 원문 버전·작업 묶음·중복을 확인해 주세요. 원문과 기존 결과는 유지했습니다.');
  for (const item of result.items) {
    if (!batch.sourceIds.includes(item.sourceId) || item.content.catalogId !== batch.catalogId || item.content.sourceId !== item.sourceId || item.expectedVersion !== batch.baseVersions[item.sourceId] || item.content.jobId !== batch.id || item.content.status === 'published' || Object.values(item.content.checks).some(Boolean))
      throw Error('검토 전 결과의 대상·시작 버전·체크를 확인해 주세요. 기존 설명은 덮어쓰지 않았습니다.');
    validateConceptEdition(item.content);
  }
  let saved = 0, repeated = 0;
  for (const item of result.items) {
    const old = repository.getSnapshot().conceptEditions?.find(e => e.catalogId === batch.catalogId && e.sourceId === item.sourceId);
    const core = (v: ConceptEditionContent) => JSON.stringify([v.displayType, v.secondaryTypes, v.reason, v.screen, v.evidence, v.promptVersion, v.jobId, v.issue]);
    if (old && core(old) === core(item.content)) { repeated++; continue; }
    // A partially imported prefix stays durable. Reimport skips it and never replaces later edits.
    saveConceptEdition(repository, item.content, item.expectedVersion); saved++;
  }
  return { data: repository.getSnapshot(), saved, repeated };
}
export function downloadConceptFile(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([typeof value === 'string' ? value : JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
