import type { AppState, Entity } from './model';
import type { RecommendationWorkspace } from './recommendation-workspace';

export interface WorkspaceSearchEntry {
  id: string;
  title: string;
  kind: string;
  href: string;
  subjectId: string | null;
  text: string;
  /** Exact display text; normalization is only used for matching. */
  rawText?: string;
}
export const normalizeSearchText = (text: string) =>
  text.normalize('NFC').toLocaleLowerCase('ko-KR');
const normalize = normalizeSearchText;

/** Read-only projection of registered content. No archive/draft reads or inferred study results. */
export function buildWorkspaceSearch(
  data: AppState,
  legacyWorkspace?: RecommendationWorkspace,
  normalizeIndex = true,
): WorkspaceSearchEntry[] {
  const alive = (row: Entity) =>
    !row.deletedAt && row.userId === data.userId && row.namespace === data.namespace;
  const subjects = new Map(data.subjects.filter(alive).map((row) => [row.id, row]));
  const nodes = new Map(
    data.nodes
      .filter((row) => alive(row) && subjects.has(row.subjectId))
      .map((row) => [row.id, row]),
  );
  const ownerSubject = (owner: string | null) =>
    owner === null ? null : subjects.has(owner) ? owner : nodes.get(owner)?.subjectId;
  const entries: WorkspaceSearchEntry[] = [];
  const add = (
    id: string,
    title: string,
    kind: string,
    href: string,
    subjectId: string | null | undefined,
    text: string,
  ) => {
    if (subjectId === undefined) return;
    entries.push({
      id,
      title,
      kind,
      href,
      subjectId,
      rawText: text,
      text: normalizeIndex ? normalize(`${title}\n${text}`) : `${title}\n${text}`,
    });
  };
  const nodeText = new Map<string, string[]>();
  const append = (id: string, text: string) => {
    const values = nodeText.get(id) ?? [];
    values.push(text);
    nodeText.set(id, values);
  };
  for (const row of data.narratives.filter(alive)) {
    if (row.ownerId) append(row.ownerId, row.body);
    else
      add(
        `free:${row.id}`,
        row.body.trim().split('\n')[0].slice(0, 80) || '자유 기록',
        '자유 기록',
        `#/free/${encodeURIComponent(row.id)}`,
        null,
        row.body,
      );
  }
  for (const row of data.records.filter(alive))
    append(
      row.targetId,
      [
        row.body,
        ...Object.values(row.trace).flatMap((item) => [
          item.note ?? '',
          item.examReview?.answer ?? '',
          ...(item.repeats ?? []).map((repeat) => repeat.note ?? ''),
        ]),
      ].join('\n'),
    );
  for (const row of subjects.values())
    add(
      `subject:${row.id}`,
      row.name,
      '과목',
      `#/subject/${encodeURIComponent(row.id)}`,
      row.id,
      (nodeText.get(row.id) ?? []).join('\n'),
    );
  for (const row of nodes.values())
    add(
      `node:${row.id}`,
      row.name,
      '목차·공부 기록',
      `#/node/${encodeURIComponent(row.id)}`,
      row.subjectId,
      (nodeText.get(row.id) ?? []).join('\n'),
    );
  for (const row of (data.memos ?? []).filter(alive))
    add(
      `memo:${row.id}`,
      row.body.trim().split('\n')[0].slice(0, 80) || '메모 스케치',
      '메모',
      `#/memos/${encodeURIComponent(row.id)}`,
      ownerSubject(row.ownerId),
      row.body,
    );
  for (const row of (data.studyMaterials ?? []).filter(alive))
    add(
      `material:${row.id}`,
      row.title || '제목 없는 자료',
      '강의 자료',
      `#/materials/${encodeURIComponent(row.id)}`,
      subjects.has(row.subjectId) ? row.subjectId : undefined,
      [
        row.sourceText,
        row.audio?.name ?? '',
        ...(row.documents ?? []).map((doc) => doc.name),
        ...row.results.flatMap((result) => [
          ...result.segments.map((segment) => `${segment.text}\n${segment.originalText ?? ''}`),
          ...result.summary.map((summary) => `${summary.text}\n${summary.originalText ?? ''}`),
          ...result.cards
            .filter((card) => !card.excluded)
            .map((card) => `${card.question}\n${card.answer}`),
        ]),
      ].join('\n'),
    );
  const plans = (data.learningPlans ?? []).filter(alive);
  const workspaces = plans.length
    ? plans.map((plan) => plan.workspace)
    : legacyWorkspace?.userId === data.userId && legacyWorkspace.namespace === data.namespace
      ? [legacyWorkspace]
      : [];
  const codeOwners = new Map<string, string[]>();
  for (const workspace of workspaces)
    for (const link of workspace.codeLinks ?? []) {
      const subject = nodes.get(link.topicId)?.subjectId;
      if (subject)
        codeOwners.set(link.exampleId, [...(codeOwners.get(link.exampleId) ?? []), subject]);
    }
  for (const row of (data.codeExamples ?? []).filter(alive)) {
    const owners = codeOwners.get(row.id) ?? [null];
    for (const owner of new Set(owners))
      add(
        `code:${row.id}`,
        row.title || '제목 없는 예제',
        '코드 예제',
        `#/code/${encodeURIComponent(row.id)}`,
        owner,
        `${row.notes}\n${row.code}\n${row.stdin}`,
      );
  }
  for (const row of (data.memoryCards ?? []).filter(alive))
    add(
      `memory:${row.id}`,
      row.question,
      '암기 항목',
      `#/memory-test/${encodeURIComponent(row.topicId)}`,
      nodes.get(row.topicId)?.subjectId,
      row.answer,
    );
  for (const row of (data.recallCards ?? []).filter(alive))
    add(
      `recall:${row.id}`,
      row.front || nodes.get(row.topicId)?.name || '복습 카드',
      '복습 카드 · 원래 주제',
      `#/node/${encodeURIComponent(row.topicId)}`,
      nodes.get(row.topicId)?.subjectId,
      row.reference,
    );
  for (const row of (data.memoryTests ?? []).filter(alive)) {
    for (const question of row.questions)
      add(
        `test:${row.id}`,
        `${row.startedAt.slice(0, 10)} 암기시험`,
        '시험 당시 문항·응답',
        `#/memory-test/result/${encodeURIComponent(row.id)}`,
        nodes.get(question.topicId)?.subjectId ?? null,
        `${question.topicName}\n${question.question}\n${question.answer}\n${question.response}`,
      );
  }
  for (const row of (data.studyBoards ?? []).filter(alive))
    for (const card of row.cards.filter((card) => !card.archived))
      add(
        `board:${row.id}:${card.id}`,
        card.title,
        '보드 카드',
        '#/board',
        ownerSubject(card.topicId),
        card.body,
      );
  for (const workspace of workspaces)
    for (const schedule of workspace.schedules ?? []) {
      if (!schedule.deletedAt && schedule.status === 'active')
        add(
          `schedule:${schedule.id}`,
          schedule.name,
          '일정·과제·온라인 강의',
          '#/schedules',
          subjects.has(schedule.subjectId) ? schedule.subjectId : undefined,
          `${schedule.note}\n${schedule.taskText ?? ''}`,
        );
    }
  return entries;
}

export type SearchOrder = 'relevance' | 'source';
export interface WorkspaceSearchOptions {
  query: string;
  subjectIds: string[];
  includeUnassigned: boolean;
  kind?: string;
  order?: SearchOrder;
  limit?: number;
}
export interface SearchExcerpt {
  text: string;
  start: number;
  end: number;
  leading: boolean;
  trailing: boolean;
}
export interface WorkspaceSearchHit {
  id: string;
  title: string;
  kind: string;
  href: string;
  subjectId: string | null;
  reason: '제목 전체 일치' | '제목에 일치' | '본문에 일치';
  excerpt: SearchExcerpt;
  sourcePosition: number;
}
export interface WorkspaceSearchResult {
  hits: WorkspaceSearchHit[];
  total: number;
  kinds: Array<{ kind: string; count: number }>;
}

/** Grapheme boundaries retain decomposed Korean and UTF-16 offsets in the original. */
function originalSegments(text: string): Array<{ segment: string; index: number }> {
  const Segmenter = (
    Intl as typeof Intl & {
      Segmenter?: new (
        locale: string,
        options: { granularity: string },
      ) => { segment: (value: string) => Iterable<{ segment: string; index: number }> };
    }
  ).Segmenter;
  if (Segmenter) return Array.from(new Segmenter('ko', { granularity: 'grapheme' }).segment(text));
  // The fallback groups combining marks and Hangul Jamo; it does not rewrite stored text.
  const result: Array<{ segment: string; index: number }> = [];
  let index = 0;
  for (const value of text) {
    const previous = result.at(-1);
    if (previous && (/^\p{Mark}$/u.test(value) || /^[\u1160-\u11ff\ud7b0-\ud7ff]$/u.test(value)))
      previous.segment += value;
    else result.push({ segment: value, index });
    index += value.length;
  }
  return result;
}
export function searchExcerpt(raw: string, query: string, context = 64): SearchExcerpt {
  const needle = normalize(query.trim()),
    normalized = normalize(raw),
    at = normalized.indexOf(needle);
  if (!needle || at < 0)
    return {
      text: raw.slice(0, context * 2),
      start: 0,
      end: 0,
      leading: false,
      trailing: raw.length > context * 2,
    };
  const segments = originalSegments(raw);
  let offset = 0,
    first = 0,
    last = segments.length - 1;
  for (let i = 0; i < segments.length; i++) {
    const next = offset + normalize(segments[i].segment).length;
    if (offset <= at && at < next) first = i;
    if (offset < at + needle.length && at + needle.length <= next) {
      last = i;
      break;
    }
    offset = next;
  }
  const start = segments[first]?.index ?? 0;
  const end = (segments[last]?.index ?? start) + (segments[last]?.segment.length ?? 0);
  const left =
    segments.find((segment) => segment.index >= Math.max(0, start - context))?.index ?? 0;
  const right = segments.find((segment) => segment.index >= end + context)?.index ?? raw.length;
  return {
    text: raw.slice(left, right),
    start: start - left,
    end: end - left,
    leading: left > 0,
    trailing: right < raw.length,
  };
}

/** Rank is explicit and stable: exact title, title substring, body; ties retain source order. */
export function queryWorkspaceSearch(
  entries: WorkspaceSearchEntry[],
  options: WorkspaceSearchOptions,
): WorkspaceSearchResult {
  const needle = normalize(options.query.trim());
  if (!needle) return { hits: [], total: 0, kinds: [] };
  const scoped = searchWorkspace(
    entries,
    options.query,
    options.subjectIds,
    options.includeUnassigned,
  );
  const counts = new Map<string, number>();
  for (const entry of scoped) counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);
  const ranked = scoped
    .map((entry, sourcePosition) => {
      const title = normalize(entry.title);
      return { entry, sourcePosition, rank: title === needle ? 0 : title.includes(needle) ? 1 : 2 };
    })
    .filter(({ entry }) => !options.kind || options.kind === 'all' || entry.kind === options.kind);
  if (options.order !== 'source')
    ranked.sort((a, b) => a.rank - b.rank || a.sourcePosition - b.sourcePosition);
  const limit =
    options.limit !== undefined && Number.isSafeInteger(options.limit)
      ? Math.max(1, options.limit)
      : 40;
  return {
    total: ranked.length,
    kinds: [...counts].map(([kind, count]) => ({ kind, count })),
    hits: ranked.slice(0, limit).map(({ entry, sourcePosition, rank }) => ({
      id: entry.id,
      title: entry.title,
      kind: entry.kind,
      href: entry.href,
      subjectId: entry.subjectId,
      reason: rank === 0 ? '제목 전체 일치' : rank === 1 ? '제목에 일치' : '본문에 일치',
      excerpt: searchExcerpt(rank < 2 ? entry.title : (entry.rawText ?? entry.text), options.query),
      sourcePosition: sourcePosition + 1,
    })),
  };
}
export function searchWorkspace(
  entries: WorkspaceSearchEntry[],
  query: string,
  subjectIds: string[],
  includeUnassigned: boolean,
) {
  const needle = normalize(query.trim());
  if (!needle) return [];
  const allowed = new Set(subjectIds),
    seen = new Set<string>();
  return entries.filter((entry) => {
    if (
      seen.has(entry.id) ||
      !(entry.subjectId === null ? includeUnassigned : allowed.has(entry.subjectId)) ||
      !entry.text.includes(needle)
    )
      return false;
    seen.add(entry.id);
    return true;
  });
}
