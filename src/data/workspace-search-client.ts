import type {
  WorkspaceSearchEntry,
  WorkspaceSearchOptions,
  WorkspaceSearchResult,
} from '../domain/workspace-search';
import {
  sameSearchEntry,
  searchEntryMap,
  WorkspaceSearchIndex,
  type SearchIndexPatch,
  type SearchQueryMessage,
  type SearchWorkerResponse,
} from './workspace-search-engine';

export interface SearchClientResult {
  result: WorkspaceSearchResult;
  mode: 'worker' | 'local';
}
type WorkerPort = Pick<
  Worker,
  'postMessage' | 'terminate' | 'onmessage' | 'onerror' | 'onmessageerror'
>;
const defaultFactory = () =>
  typeof Worker === 'undefined'
    ? null
    : new Worker(new URL('./workspace-search.worker.ts', import.meta.url), { type: 'module' });

export class WorkspaceSearchClient {
  private worker: WorkerPort | null;
  private owner = '';
  private revision = 0;
  private request = 0;
  private entries = new Map<string, WorkspaceSearchEntry>();
  private fallback: WorkspaceSearchIndex | null = null;
  private disposed = false;
  private pending: {
    message: SearchQueryMessage;
    resolve: (value: SearchClientResult | null) => void;
    reject: (reason: unknown) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null = null;
  constructor(factory: () => WorkerPort | null = defaultFactory) {
    try {
      this.worker = factory();
    } catch {
      this.worker = null;
    }
    if (this.worker) {
      this.worker.onmessage = (event) => this.receive(event.data as SearchWorkerResponse);
      this.worker.onerror = () => this.failWorker();
      this.worker.onmessageerror = () => this.failWorker();
    }
  }
  private cancel() {
    if (!this.pending) return;
    clearTimeout(this.pending.timer);
    this.pending.resolve(null);
    this.pending = null;
  }
  update(owner: string, values: WorkspaceSearchEntry[]) {
    if (this.disposed) return;
    const entries = searchEntryMap(values),
      reset = owner !== this.owner || this.revision === 0;
    const upserts = [...entries]
      .filter(([key, entry]) => {
        const previous = this.entries.get(key);
        return reset || !previous || !sameSearchEntry(previous, entry);
      })
      .map(([key, entry]) => ({ key, entry }));
    const removed = reset ? [] : [...this.entries.keys()].filter((key) => !entries.has(key));
    const order = [...entries.keys()];
    const oldOrder = [...this.entries.keys()];
    if (
      !reset &&
      !upserts.length &&
      !removed.length &&
      order.every((key, i) => key === oldOrder[i])
    )
      return;
    this.cancel();
    this.owner = owner;
    this.entries = entries;
    const patch: SearchIndexPatch = {
      type: 'index',
      owner,
      revision: ++this.revision,
      reset,
      upserts,
      removed,
      order,
    };
    if (this.fallback) this.fallback.apply(patch);
    if (this.worker) {
      try {
        this.worker.postMessage(patch);
      } catch {
        this.failWorker();
      }
    }
  }
  private local(message: SearchQueryMessage): SearchClientResult | null {
    if (
      this.disposed ||
      message.owner !== this.owner ||
      message.revision !== this.revision ||
      message.request !== this.request
    )
      return null;
    if (!this.fallback) {
      this.fallback = new WorkspaceSearchIndex();
      this.fallback.apply({
        type: 'index',
        owner: this.owner,
        revision: this.revision,
        reset: true,
        upserts: [...this.entries].map(([key, entry]) => ({ key, entry })),
        removed: [],
        order: [...this.entries.keys()],
      });
    }
    const response = this.fallback.query(message);
    return response?.result ? { result: response.result, mode: 'local' } : null;
  }
  query(options: WorkspaceSearchOptions): Promise<SearchClientResult | null> {
    this.cancel();
    if (this.disposed) return Promise.resolve(null);
    const message: SearchQueryMessage = {
      type: 'query',
      owner: this.owner,
      revision: this.revision,
      request: ++this.request,
      options,
    };
    const worker = this.worker;
    if (!worker) return Promise.resolve().then(() => this.local(message));
    return new Promise((resolve, reject) => {
      this.pending = {
        message,
        resolve,
        reject,
        timer: setTimeout(() => this.failWorker(), 10000),
      };
      try {
        worker.postMessage(message);
      } catch {
        this.failWorker();
      }
    });
  }
  private receive(response: SearchWorkerResponse) {
    const pending = this.pending;
    if (
      !pending ||
      response.owner !== this.owner ||
      response.revision !== this.revision ||
      response.request !== pending.message.request
    )
      return;
    if (response.error || !response.result) {
      this.failWorker();
      return;
    }
    clearTimeout(pending.timer);
    this.pending = null;
    pending.resolve({ result: response.result, mode: 'worker' });
  }
  private failWorker() {
    this.worker?.terminate();
    this.worker = null;
    const pending = this.pending;
    if (pending) {
      clearTimeout(pending.timer);
      this.pending = null;
      try {
        pending.resolve(this.local(pending.message));
      } catch (error) {
        pending.reject(error);
      }
    }
  }
  dispose() {
    this.cancel();
    this.worker?.terminate();
    this.worker = null;
    this.entries.clear();
    this.fallback = null;
    this.disposed = true;
  }
}
