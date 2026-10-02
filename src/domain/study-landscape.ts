import type { AppState, Entity, StudyRecord } from './model';
import { buildObservatoryEvolution, type ObservatoryEvolution } from './observatory-evolution';
import { buildObservatoryResponse, type ObservatoryResponse } from './observatory-response';
import {
  buildDailyStudyDynamics,
  studyInputDay,
  type DailyStudyDynamics,
} from './daily-study-dynamics';

/** Rendering facts, not a lifestyle score, ability estimate, or study obligation. */
export interface StudyLandscape {
  plants: { key: string; seed: number }[];
  days: { key: string; seed: number; spacing: number }[];
  returns: { key: string; seed: number }[];
  undated: boolean;
  dynamics: DailyStudyDynamics;
  evolution: ObservatoryEvolution;
  response: ObservatoryResponse;
}

export function landscapeSeed(value: string): number {
  let hash = 2166136261;
  for (const char of value) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function latestOwned<T extends Entity>(
  rows: T[],
  data: Pick<AppState, 'userId' | 'namespace'>,
): T[] {
  const byId = new Map<string, T>();
  for (const row of rows) {
    if (row.userId !== data.userId || row.namespace !== data.namespace) continue;
    const before = byId.get(row.id);
    if (
      !before ||
      row.version > before.version ||
      (row.version === before.version && row.updatedAt > before.updatedAt)
    )
      byId.set(row.id, row);
  }
  // Deduplicate before dropping tombstones: a deleted latest version hides its predecessors.
  return [...byId.values()].filter((row) => !row.deletedAt);
}

function exactDay(date: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const day = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(day) && new Date(day).toISOString().slice(0, 10) === date
    ? day / 86400000
    : null;
}

function hasActivity(row: StudyRecord): boolean {
  return (
    row.done ||
    !!row.body.trim() ||
    Object.values(row.trace).some((item) => item.status === 'checked' || !!item.note?.trim())
  );
}

/** Bounded drawing from current records; no wall clock, text-length weights, or random resets. */
export function buildStudyLandscape(
  data: Pick<AppState, 'userId' | 'namespace' | 'subjects' | 'sessions' | 'records'>,
  subjectIds?: readonly string[],
  referenceDay = studyInputDay(Date.now()) ?? 0,
): StudyLandscape {
  const scope = subjectIds ? new Set(subjectIds) : null;
  const subjects = new Set(
    latestOwned(data.subjects, data)
      .filter((subject) => !scope || scope.has(subject.id))
      .map((subject) => subject.id),
  );
  const sessions = new Set(latestOwned(data.sessions, data).map((session) => session.id));
  const records = latestOwned(data.records, data).filter(
    (row) => subjects.has(row.subjectId) && sessions.has(row.sessionId) && hasActivity(row),
  );
  const topics = new Map<string, Set<string>>();
  const dated = new Map<string, number>();
  let undated = false;
  for (const row of records) {
    const key = `${row.subjectId}:${row.targetId}`;
    const visits = topics.get(key) ?? new Set<string>();
    visits.add(row.sessionId);
    topics.set(key, visits);
    const day = row.dateEvidence.kind === 'exact' ? exactDay(row.dateEvidence.date) : null;
    if (day === null) undated = true;
    else if (row.dateEvidence.kind === 'exact') dated.set(row.dateEvidence.date, day);
  }
  // Bounded reservoir ordered by stable hashes: order of transport and historical replays cannot reshuffle it.
  const sample = (keys: string[], max: number) =>
    keys
      .map((key) => ({ key, seed: landscapeSeed(key) }))
      .sort((a, b) => a.seed - b.seed || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0))
      .slice(0, max);
  const days = [...dated]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .reverse();
  return {
    plants: sample([...topics.keys()], 12),
    returns: sample(
      [...topics].filter(([, visits]) => visits.size > 1).map(([key]) => key),
      8,
    ),
    days: days.map(([key, day], index) => ({
      key,
      seed: landscapeSeed(key),
      spacing: index ? Math.min(4, Math.max(1, day - days[index - 1][1])) : 1,
    })),
    undated,
    dynamics: buildDailyStudyDynamics(records, referenceDay),
    evolution: buildObservatoryEvolution(records, referenceDay),
    response: buildObservatoryResponse(records, referenceDay),
  };
}
