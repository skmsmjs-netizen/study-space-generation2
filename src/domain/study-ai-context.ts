import { DomainError, type AppState, type Entity } from './model';
import { MAX_SOURCE_TEXT } from './study-material';
import { documentSegments } from './material-source';

export interface StudyAIContextSource {
  key: string;
  label: string;
  text: string;
  href: string;
  updatedAt: string;
}

/** Explicit, local selection only. No generated results, private keys or hidden accounts. */
export function studyAIContextSources(data: AppState, subjectId: string): StudyAIContextSource[] {
  const own = (row: Entity) =>
    !row.deletedAt && row.userId === data.userId && row.namespace === data.namespace;
  const subject = data.subjects.find((row) => row.id === subjectId && own(row));
  if (!subject) return [];
  const nodes = new Map(data.nodes.filter(own).map((row) => [row.id, row]));
  const inScope = (id: string | null) =>
    id === null || id === subjectId || nodes.get(id)?.subjectId === subjectId;
  const result: StudyAIContextSource[] = [];
  function add(
    kind: string,
    row: Entity,
    title: string,
    body: string,
    href: string,
    facts?: unknown,
  ) {
    if (!own(row) || !body.trim()) return;
    const metadata = JSON.stringify({
      kind,
      id: row.id,
      version: row.version,
      selectedSubject: subject!.name,
      updatedAt: row.updatedAt,
      ...(facts === undefined ? {} : { facts }),
    });
    const firstLine = body.match(/\S[^\r\n]*/)?.[0] ?? '';
    const preview = ['memo', 'narrative', 'record'].includes(kind)
      ? ` · ${firstLine.slice(0, 70)}${firstLine.length > 70 ? '…' : ''}`
      : '';
    result.push({
      key: `${kind}:${row.id}`,
      label: `${title}${preview} · 수정 ${row.updatedAt.slice(0, 10)}`,
      text: `입력 출처: ${metadata}\n${body}`,
      href,
      updatedAt: row.updatedAt,
    });
  }
  for (const row of data.records)
    if (row.subjectId === subjectId)
      add(
        'record',
        row,
        `공부 기록 · ${nodes.get(row.targetId)?.name ?? '주제'}`,
        `${row.body}\n기록의 행동별 입력:\n${JSON.stringify(row.trace)}`,
        '#/record',
        {
          dateEvidence: row.dateEvidence,
          attempted: row.done,
          note: '체크는 시도이며 독립 해결·숙달 판정이 아닙니다.',
        },
      );
  for (const row of data.narratives)
    if (inScope(row.ownerId)) add('narrative', row, '주제 설명·자유 글', row.body, '#/subjects');
  for (const row of data.memos ?? [])
    if (inScope(row.ownerId)) add('memo', row, '메모', row.body, '#/memos');
  for (const row of data.studyMaterials ?? [])
    if (row.subjectId === subjectId && own(row))
      add(
        'material',
        row,
        `자료 · ${row.title}`,
        row.sourceText +
          (row.documents?.length
            ? '\n가져온 문서의 선택한 구간:\n' +
              documentSegments(row.documents)
                .map((segment) => `${segment.label}\n${segment.text}`)
                .join('\n\n')
            : ''),
        `#/materials/${encodeURIComponent(row.id)}`,
        row.documents?.length
          ? {
              documentWarnings: row.documents.map((document) => ({
                name: document.name,
                kind: document.kind,
                warnings: document.warnings,
              })),
            }
          : undefined,
      );
  // Code examples have no subject relation; show them for explicit manual selection only.
  for (const row of data.codeExamples ?? []) {
    const body =
      `현재 코드 (${row.language}):\n${row.code}\n현재 입력:\n${row.stdin}\n메모:\n${row.notes}` +
      (row.lastRun
        ? `\n이전 실제 실행 당시 기록:\n${JSON.stringify(row.lastRun)}`
        : '\n실제 실행 기록 없음');
    if (row.code.trim() || row.notes.trim())
      add('code', row, `코드 · ${row.title}`, body, `#/code/${encodeURIComponent(row.id)}`, {
        subjectRelation: '미지정; 이번 요청에서 사용자가 선택한 코드입니다.',
      });
  }
  return result.sort(
    (a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.key.localeCompare(b.key),
  );
}

/** Append exactly the selected snapshots; never trim, truncate or edit originals. */
export function appendStudyAIContext(
  original: string,
  sources: StudyAIContextSource[],
  keys: string[],
): string {
  const unique = [...new Set(keys)];
  if (!unique.length || unique.length > 20)
    throw new DomainError('AI_CONTEXT_SELECTION', '가져올 기록을 1~20개 선택해 주세요.');
  const selected = unique.map((key) => {
    const row = sources.find((source) => source.key === key);
    if (!row)
      throw new DomainError(
        'AI_CONTEXT_STALE',
        '선택한 기록이 바뀌었습니다. 목록에서 다시 확인해 주세요.',
      );
    return row.text;
  });
  const next = original + (original ? '\n\n' : '') + selected.join('\n\n');
  if (next.length > MAX_SOURCE_TEXT)
    throw new DomainError(
      'AI_CONTEXT_SIZE',
      '기존 필기와 선택한 기록이 15만 자를 넘습니다. 범위를 나누어 가져와 주세요.',
    );
  return next;
}
