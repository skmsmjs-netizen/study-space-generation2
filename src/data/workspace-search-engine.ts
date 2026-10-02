import {
  normalizeSearchText,
  queryWorkspaceSearch,
  type WorkspaceSearchEntry,
  type WorkspaceSearchOptions,
  type WorkspaceSearchResult,
} from '../domain/workspace-search';

export interface SearchIndexPatch {
  type: 'index';
  owner: string;
  revision: number;
  reset: boolean;
  upserts: Array<{ key: string; entry: WorkspaceSearchEntry }>;
  removed: string[];
  order: string[];
}
export interface SearchQueryMessage {
  type: 'query';
  owner: string;
  revision: number;
  request: number;
  options: WorkspaceSearchOptions;
}
export type SearchWorkerMessage = SearchIndexPatch | SearchQueryMessage;
export interface SearchWorkerResponse {
  owner: string;
  revision: number;
  request: number;
  result?: WorkspaceSearchResult;
  error?: true;
}

/** Disposable local index, never an authority for storage or account permissions. */
export class WorkspaceSearchIndex {
  private owner = '';
  private revision = 0;
  private entries = new Map<string, WorkspaceSearchEntry>();
  private order: string[] = [];
  apply(patch: SearchIndexPatch) {
    if (!patch.reset && (patch.owner !== this.owner || patch.revision <= this.revision))
      return false;
    if (patch.reset) this.entries.clear();
    this.owner = patch.owner;
    this.revision = patch.revision;
    for (const key of patch.removed) this.entries.delete(key);
    for (const { key, entry } of patch.upserts)
      this.entries.set(key, {
        ...entry,
        text: normalizeSearchText(`${entry.title}\n${entry.rawText ?? entry.text}`),
      });
    this.order = patch.order;
    return true;
  }
  query(message: SearchQueryMessage): SearchWorkerResponse | null {
    if (message.owner !== this.owner || message.revision !== this.revision) return null;
    const entries = this.order
      .map((key) => this.entries.get(key))
      .filter((entry): entry is WorkspaceSearchEntry => !!entry);
    return {
      owner: this.owner,
      revision: this.revision,
      request: message.request,
      result: queryWorkspaceSearch(entries, message.options),
    };
  }
}

/** Stable occurrence keys preserve multiple historical questions with the same item ID. */
export function searchEntryMap(entries: WorkspaceSearchEntry[]): Map<string, WorkspaceSearchEntry> {
  const occurrences = new Map<string, number>();
  return new Map(
    entries.map((entry) => {
      const base = JSON.stringify([entry.id, entry.subjectId]);
      const occurrence = occurrences.get(base) ?? 0;
      occurrences.set(base, occurrence + 1);
      return [`${base}:${occurrence}`, entry] as const;
    }),
  );
}
export function sameSearchEntry(a: WorkspaceSearchEntry, b: WorkspaceSearchEntry) {
  return (
    a.id === b.id &&
    a.title === b.title &&
    a.kind === b.kind &&
    a.href === b.href &&
    a.subjectId === b.subjectId &&
    a.rawText === b.rawText &&
    a.text === b.text
  );
}
