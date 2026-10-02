import type { AppState, Command } from '../domain/model';
import { applyCommand } from '../domain/commands';
import type { StudyRepository } from './repository';
import { readRescuedDraft } from './draft-safety';

export function readConceptDraft(key: string): string | null {
  return readRescuedDraft(key) ?? localStorage.getItem(key);
}
import {
  CONCEPT_BATCH_SIZE,
  CONCEPT_EDITOR_INSTRUCTIONS,
  CONCEPT_PROMPT_VERSION,
  conceptEditionId,
  conceptContent,
  emptyConceptEdition,
  parseConceptSource,
  validateConceptEdition,
  type ConceptBatch,
  type ConceptCatalog,
  type ConceptEditionContent,
} from '../domain/concept-production';

const context = (data: AppState) => ({
  userId: data.userId,
  namespace: data.namespace,
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
});
export async function conceptHash(raw: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return [...new Uint8Array(bytes)].map((n) => n.toString(16).padStart(2, '0')).join('');
}
export async function importConceptCatalog(
  repository: StudyRepository,
  raw: string,
  filename: string,
) {
  parseConceptSource(raw);
  const sha256 = await conceptHash(raw);
  return repository.execute({
    ...context(repository.getSnapshot()),
    type: 'importConceptCatalog',
    id: `concept-catalog:${sha256}`,
    raw,
    sha256,
    filename,
  });
}
export interface ConceptJobFile {
  format: 'concept-job-v1';
  jobId: string;
  catalogId: string;
  sourceSha256: string;
  promptVersion: string;
  instructions: string;
  items: {
    original: ReturnType<typeof parseConceptSource>['items'][number];
    proposal: ConceptEditionContent;
    expectedVersion: number;
  }[];
}
export function conceptJobFile(data: AppState, batch: ConceptBatch): ConceptJobFile {
  const catalog = data.conceptCatalogs?.find((c) => c.id === batch.catalogId);
  if (!catalog) throw Error('작업 묶음의 원문을 찾을 수 없습니다.');
  const originals = new Map(parseConceptSource(catalog.raw).items.map((i) => [i.id, i]));
  return {
    format: 'concept-job-v1',
    jobId: batch.id,
    catalogId: catalog.id,
    sourceSha256: catalog.sha256,
    promptVersion: CONCEPT_PROMPT_VERSION,
    instructions: CONCEPT_EDITOR_INSTRUCTIONS,
    items: batch.sourceIds.map((id) => ({
      original: originals.get(id)!,
      proposal: conceptContent(
        data.conceptEditions?.find((e) => e.catalogId === catalog.id && e.sourceId === id) ??
          emptyConceptEdition(catalog.id, originals.get(id)!),
      ),
      expectedVersion: batch.baseVersions[id],
    })),
  };
}
export function openConceptBatch(
  repository: StudyRepository,
  catalog: ConceptCatalog,
  sourceIds?: string[],
) {
  const data = repository.getSnapshot();
  const editions = new Map(
    (data.conceptEditions ?? [])
      .filter((e) => e.catalogId === catalog.id)
      .map((e) => [e.sourceId, e]),
  );
  const reserved = new Set(
    (data.conceptBatches ?? [])
      .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')
      .flatMap((b) => b.sourceIds),
  );
  const ids =
    sourceIds ??
    parseConceptSource(catalog.raw)
      .items.filter((i) => !editions.get(i.id)?.screen && !reserved.has(i.id))
      .map((i) => i.id)
      .slice(0, CONCEPT_BATCH_SIZE);
  if (!ids.length) throw Error('열린 작업 묶음을 이어가거나 보류한 개념을 선택해 주세요.');
  if (sourceIds?.some((id) => reserved.has(id)))
    throw Error('이 개념은 열린 작업 묶음에 있습니다. 해당 묶음을 이어가 주세요.');
  const id = `concept-batch:${crypto.randomUUID()}`;
  const next = repository.execute({
    ...context(data),
    type: 'saveConceptBatch',
    id,
    expectedVersion: 0,
    content: {
      catalogId: catalog.id,
      sourceIds: ids,
      baseVersions: Object.fromEntries(ids.map((i) => [i, editions.get(i)?.version ?? 0])),
      status: 'open',
    },
  });
  return { data: next, batch: next.conceptBatches!.find((b) => b.id === id)! };
}
export function saveConceptEdition(
  repository: StudyRepository,
  content: ConceptEditionContent,
  expectedVersion: number,
) {
  validateConceptEdition(content);
  return repository.execute({
    ...context(repository.getSnapshot()),
    type: 'saveConceptEdition',
    id: conceptEditionId(content.catalogId, content.sourceId),
    expectedVersion,
    content,
  });
}
export interface ConceptResultFile {
  format: 'concept-results-v1';
  jobId: string;
  sourceSha256: string;
  items: { sourceId: string; expectedVersion: number; content: ConceptEditionContent }[];
}
function parseConceptResults(data: AppState, raw: string) {
  if (raw.length > 2_000_000)
    throw Error('결과 파일을 작업 묶음별로 나누어 주세요. 원본은 유지했습니다.');
  const result = JSON.parse(raw) as ConceptResultFile;
  const batch = data.conceptBatches?.find((b) => b.id === result.jobId);
  const catalog = data.conceptCatalogs?.find((c) => c.id === batch?.catalogId);
  if (
    result.format !== 'concept-results-v1' ||
    !batch ||
    !catalog ||
    result.sourceSha256 !== catalog.sha256 ||
    !Array.isArray(result.items) ||
    !result.items.length ||
    result.items.length > CONCEPT_BATCH_SIZE ||
    new Set(result.items.map((i) => i.sourceId)).size !== result.items.length
  )
    throw Error(
      '결과 파일의 원문 버전·작업 묶음·중복을 확인해 주세요. 원문과 기존 결과는 유지했습니다.',
    );
  for (const item of result.items) {
    if (
      !batch.sourceIds.includes(item.sourceId) ||
      item.content.catalogId !== batch.catalogId ||
      item.content.sourceId !== item.sourceId ||
      item.expectedVersion !== batch.baseVersions[item.sourceId] ||
      item.content.jobId !== batch.id ||
      item.content.status === 'published' ||
      Object.values(item.content.checks).some(Boolean)
    )
      throw Error(
        '검토 전 결과의 대상·시작 버전·체크를 확인해 주세요. 기존 설명은 덮어쓰지 않았습니다.',
      );
    validateConceptEdition(item.content);
  }
  return { result, batch };
}
const editionCore = (v: ConceptEditionContent) =>
  JSON.stringify([
    v.displayType,
    v.secondaryTypes,
    v.reason,
    v.screen,
    v.evidence,
    v.promptVersion,
    v.jobId,
    v.issue,
  ]);
export function importConceptResults(repository: StudyRepository, raw: string) {
  const { result, batch } = parseConceptResults(repository.getSnapshot(), raw);
  let saved = 0,
    repeated = 0;
  for (const item of result.items) {
    const old = repository
      .getSnapshot()
      .conceptEditions?.find(
        (e) => e.catalogId === batch.catalogId && e.sourceId === item.sourceId,
      );
    if (old && editionCore(old) === editionCore(item.content)) {
      repeated++;
      continue;
    }
    // A partially imported prefix stays durable. Reimport skips it and never replaces later edits.
    saveConceptEdition(repository, item.content, item.expectedVersion);
    saved++;
  }
  return { data: repository.getSnapshot(), saved, repeated };
}
export function downloadConceptFile(value: unknown, name: string) {
  const url = URL.createObjectURL(
    new Blob([typeof value === 'string' ? value : JSON.stringify(value, null, 2)], {
      type: 'application/json',
    }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
/** Portable production work contains originals and unreviewed results, never account credentials or approval checks. */
export interface ConceptWorkFile {
  format: 'concept-work-v1';
  part?: { packageSha256: string; index: number; count: number };
  original: { raw: string; filename: string; sha256: string };
  batches: {
    id: string;
    content: Pick<ConceptBatch, 'catalogId' | 'sourceIds' | 'baseVersions' | 'status'>;
  }[];
  results: ConceptResultFile[];
}
export const CONCEPT_WORK_FILE_LIMIT = 4_000_000;

/** Keep each file bounded while retaining every historical result in its original order. */
export async function splitConceptWork(file: ConceptWorkFile, limit = CONCEPT_WORK_FILE_LIMIT) {
  const full = { format: file.format, original: file.original, batches: file.batches, results: file.results };
  if (JSON.stringify(full).length <= limit) return [JSON.stringify(full)];
  const packageSha256 = await conceptHash(JSON.stringify(full));
  const shell = (results: ConceptWorkFile['results']) => ({
    ...full, results, part: { packageSha256, index: 999999, count: 999999 },
  });
  const groups: ConceptWorkFile['results'][] = [];
  let current: ConceptWorkFile['results'] = [];
  for (const result of file.results) {
    const next = [...current, result];
    if (JSON.stringify(shell(next)).length <= limit) { current = next; continue; }
    if (current.length) groups.push(current);
    current = [result];
    if (JSON.stringify(shell(current)).length > limit)
      throw Error('한 작업 묶음이 파일 크기를 넘었습니다. 원문과 이력은 변경하지 않았습니다.');
  }
  if (current.length) groups.push(current);
  if (!groups.length || groups.length > 32)
    throw Error('제작 파일의 작업 묶음 크기를 확인해 주세요.');
  return groups.map((results, index) => JSON.stringify({
    ...full, results, part: { packageSha256, index: index + 1, count: groups.length },
  }));
}

/** One file or a complete multipart package; missing/corrupt parts commit nothing. */
export async function importConceptWorkFiles(repository: StudyRepository, raws: string[]) {
  if (!raws.length || raws.length > 32) throw Error('가져올 제작 파일을 확인해 주세요.');
  for (const raw of raws) if (raw.length > CONCEPT_WORK_FILE_LIMIT)
    throw Error('제작 파일을 원문과 작업 묶음별로 나누어 주세요.');
  const files = raws.map((raw) => JSON.parse(raw) as ConceptWorkFile);
  if (files.length === 1 && !files[0].part) return importConceptWork(repository, raws[0]);
  const first = files[0], count = first.part?.count, packageSha256 = first.part?.packageSha256;
  if (!Number.isInteger(count) || count !== files.length || !packageSha256 ||
      !/^[a-f0-9]{64}$/.test(packageSha256))
    throw Error('나뉜 제작 파일을 모두 함께 선택해 주세요. 기존 자료는 유지했습니다.');
  files.sort((a, b) => (a.part?.index ?? 0) - (b.part?.index ?? 0));
  const original = JSON.stringify(first.original), batches = JSON.stringify(first.batches);
  if (files.some((file, index) => file.format !== 'concept-work-v1' ||
      file.part?.index !== index + 1 || file.part.count !== count ||
      file.part.packageSha256 !== packageSha256 || !Array.isArray(file.results) ||
      JSON.stringify(file.original) !== original || JSON.stringify(file.batches) !== batches))
    throw Error('나뉜 제작 파일의 순서·원문·묶음이 맞지 않습니다. 기존 자료는 유지했습니다.');
  const combined: ConceptWorkFile = {
    format: 'concept-work-v1', original: first.original, batches: first.batches,
    results: files.flatMap((file) => file.results),
  };
  if (await conceptHash(JSON.stringify(combined)) !== packageSha256)
    throw Error('나뉜 제작 파일의 내용이 다릅니다. 기존 자료는 유지했습니다.');
  if (!repository.executeMany)
    throw Error('여러 파일을 함께 저장할 연결을 확인해 주세요. 기존 자료는 유지했습니다.');
  return importConceptWorkValue(repository, combined);
}

export async function importConceptWork(repository: StudyRepository, raw: string) {
  if (raw.length > CONCEPT_WORK_FILE_LIMIT)
    throw Error('제작 파일을 원문과 작업 묶음별로 나누어 주세요.');
  return importConceptWorkValue(repository, JSON.parse(raw) as ConceptWorkFile);
}
async function importConceptWorkValue(repository: StudyRepository, file: ConceptWorkFile): Promise<AppState> {
  if (repository.executeMany) {
    let staged = repository.getSnapshot();
    const commands: Command[] = [];
    const staging: StudyRepository = {
      getSnapshot: () => staged,
      execute: (command) => {
        staged = applyCommand(staged, command);
        commands.push(command);
        return staged;
      },
    };
    await importConceptWorkValue(staging, file);
    return repository.executeMany(commands);
  }
  if (
    file.format !== 'concept-work-v1' ||
    !file.original ||
    !Array.isArray(file.batches) ||
    !Array.isArray(file.results)
  )
    throw Error('제작 파일의 형식을 확인해 주세요.');
  if ((await conceptHash(file.original.raw)) !== file.original.sha256)
    throw Error('보관 원문과 해시가 다릅니다. 가져오지 않았습니다.');
  parseConceptSource(file.original.raw);
  const storedCatalog = repository
    .getSnapshot()
    .conceptCatalogs?.find((c) => c.sha256 === file.original.sha256);
  if (storedCatalog && storedCatalog.raw !== file.original.raw)
    throw Error('같은 해시의 보관 원문이 다릅니다. 기존 자료는 유지했습니다.');
  if (!storedCatalog)
    await importConceptCatalog(repository, file.original.raw, file.original.filename);
  for (const batch of file.batches) {
    if (batch.content.catalogId !== `concept-catalog:${file.original.sha256}`)
      throw Error('작업 묶음의 원문이 다릅니다. 기존 자료는 유지했습니다.');
    const existing = repository.getSnapshot().conceptBatches?.find((b) => b.id === batch.id);
    if (existing) {
      if (
        existing.catalogId !== batch.content.catalogId ||
        JSON.stringify(existing.sourceIds) !== JSON.stringify(batch.content.sourceIds) ||
        JSON.stringify(existing.baseVersions) !== JSON.stringify(batch.content.baseVersions)
      )
        throw Error('같은 작업 묶음의 대상이 다릅니다. 덮어쓰지 않았습니다.');
      continue;
    }
    repository.execute({
      ...context(repository.getSnapshot()),
      type: 'saveConceptBatch',
      id: batch.id,
      expectedVersion: 0,
      content: batch.content,
    });
  }
  // Validate every historical result before deciding what is already present.
  for (const result of file.results)
    parseConceptResults(repository.getSnapshot(), JSON.stringify(result));
  const latest = new Map(
    file.results.flatMap((result) =>
      result.items.map((item) => [item.sourceId, item.content] as const),
    ),
  );
  const complete = new Set<string>();
  const resumeVersion = new Map<string, number>();
  for (const [sourceId, content] of latest) {
    const existing = repository
      .getSnapshot()
      .conceptEditions?.find((e) => e.catalogId === content.catalogId && e.sourceId === sourceId);
    if (existing && editionCore(existing) === editionCore(content)) complete.add(sourceId);
    else if (
      existing &&
      file.results.some((result) =>
        result.items.some(
          (item) =>
            item.sourceId === sourceId &&
            item.expectedVersion + 1 === existing.version &&
            editionCore(item.content) === editionCore(existing),
        ),
      )
    )
      resumeVersion.set(sourceId, existing.version);
  }
  for (const result of file.results) {
    const pending = result.items.filter(
      (item) =>
        !complete.has(item.sourceId) &&
        item.expectedVersion >= (resumeVersion.get(item.sourceId) ?? 0),
    );
    if (pending.length)
      importConceptResults(repository, JSON.stringify({ ...result, items: pending }));
  }
  return repository.getSnapshot();
}
