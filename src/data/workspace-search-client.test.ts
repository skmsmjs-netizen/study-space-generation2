import { afterEach, expect, it, vi } from 'vitest';
import type { WorkspaceSearchEntry } from '../domain/workspace-search';
import { WorkspaceSearchClient } from './workspace-search-client';
import {
  WorkspaceSearchIndex,
  type SearchIndexPatch,
  type SearchQueryMessage,
  type SearchWorkerResponse,
} from './workspace-search-engine';

const row = (
  id: string,
  rawText = '  원문 함수  ',
  subjectId: string | null = 's',
): WorkspaceSearchEntry => ({
  id,
  title: `자료 ${id}`,
  kind: '기록',
  text: rawText,
  rawText,
  href: `#/node/${id}`,
  subjectId,
});
function required<T>(value: T | null | undefined): T {
  if (value == null) throw new Error('Expected a synthetic worker message');
  return value;
}
const options = { query: '함수', subjectIds: ['s'], includeUnassigned: false };
function fakeWorker() {
  const port = {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: null as Worker['onmessage'],
    onerror: null as Worker['onerror'],
    onmessageerror: null as Worker['onmessageerror'],
  };
  return {
    port,
    send: (value: SearchWorkerResponse) =>
      port.onmessage?.call(port as unknown as Worker, new MessageEvent('message', { data: value })),
    fail: () => port.onerror?.call(port as unknown as Worker, new ErrorEvent('error')),
  };
}
afterEach(() => vi.useRealTimers());
it('sends only changed entries while retaining order and resets the index on owner change', () => {
  const worker = fakeWorker(),
    client = new WorkspaceSearchClient(() => worker.port);
  client.update('a', [row('one'), row('two')]);
  client.update('a', [row('one'), row('two')]);
  expect(worker.port.postMessage).toHaveBeenCalledTimes(1);
  client.update('a', [row('two', '수정 함수'), row('three')]);
  const patch = worker.port.postMessage.mock.calls[1][0] as SearchIndexPatch;
  expect(patch.reset).toBe(false);
  expect(patch.upserts.map((value) => value.entry.id)).toEqual(['two', 'three']);
  expect(patch.removed).toHaveLength(1);
  client.update('a', [row('three'), row('two', '수정 함수')]);
  expect(worker.port.postMessage.mock.calls[2][0].upserts).toEqual([]);
  client.update('b', [row('different')]);
  expect(worker.port.postMessage.mock.calls[3][0]).toMatchObject({ owner: 'b', reset: true });
  client.dispose();
  expect(worker.port.terminate).toHaveBeenCalledOnce();
});
it('ignores late request/version/account responses and never releases a disposed result', async () => {
  const worker = fakeWorker(),
    client = new WorkspaceSearchClient(() => worker.port),
    index = new WorkspaceSearchIndex();
  client.update('a', [row('one')]);
  index.apply(required(worker.port.postMessage.mock.calls.at(-1))[0]);
  const first = client.query(options),
    old = required(worker.port.postMessage.mock.calls.at(-1))[0] as SearchQueryMessage;
  const second = client.query({ ...options, query: '원문' }),
    current = required(worker.port.postMessage.mock.calls.at(-1))[0] as SearchQueryMessage;
  expect(await first).toBeNull();
  worker.send(required(index.query(old)));
  const fulfilled = vi.fn();
  second.then(fulfilled);
  await Promise.resolve();
  expect(fulfilled).not.toHaveBeenCalled();
  worker.send(required(index.query(current)));
  expect((await second)?.result.hits[0].id).toBe('one');
  const abandoned = client.query(options);
  client.update('b', [row('other')]);
  expect(await abandoned).toBeNull();
  const newer = client.query(options);
  worker.send(required(index.query(current)));
  client.dispose();
  expect(await newer).toBeNull();
  expect(await client.query(options)).toBeNull();
});
it('falls back after worker failure or timeout and applies later changes and owner isolation', async () => {
  vi.useFakeTimers();
  const worker = fakeWorker(),
    client = new WorkspaceSearchClient(() => worker.port);
  client.update('a', [row('old')]);
  const delayed = client.query(options);
  await vi.advanceTimersByTimeAsync(10000);
  expect((await delayed)?.mode).toBe('local');
  expect(worker.port.terminate).toHaveBeenCalledOnce();
  client.update('a', [row('updated', '함수 수정'), row('foreign', '함수', 'other')]);
  expect((await client.query(options))?.result.hits.map((value) => value.id)).toEqual(['updated']);
  client.update('b', [row('newowner')]);
  expect((await client.query(options))?.result.hits.map((value) => value.id)).toEqual(['newowner']);
  client.dispose();
  const failed = fakeWorker(),
    next = new WorkspaceSearchClient(() => failed.port);
  next.update('a', [row('one')]);
  const pending = next.query(options);
  failed.fail();
  expect((await pending)?.mode).toBe('local');
  next.dispose();
});
it('preserves repeated historical IDs until matching within their actual scope', async () => {
  const client = new WorkspaceSearchClient(() => null);
  client.update('a', [
    row('test', '같은시험 첫 응답'),
    row('test', '같은시험 함수 응답'),
    row('foreign', '함수', 'other'),
  ]);
  const result = await client.query(options);
  expect(result?.result.total).toBe(1);
  expect(result?.result.hits[0].excerpt.text).toBe('같은시험 함수 응답');
  client.dispose();
});
it('drops an older local fallback query before its queued result is consumed', async () => {
  const client = new WorkspaceSearchClient(() => null);
  client.update('a', [row('one')]);
  const superseded = client.query(options),
    latest = client.query({ ...options, query: '원문' });
  expect(await superseded).toBeNull();
  expect((await latest)?.result.total).toBe(1);
  client.dispose();
});
it('rejects stale index deltas and query revisions', () => {
  const index = new WorkspaceSearchIndex();
  expect(
    index.apply({
      type: 'index',
      owner: 'a',
      revision: 2,
      reset: true,
      upserts: [{ key: 'a', entry: row('one') }],
      removed: [],
      order: ['a'],
    }),
  ).toBe(true);
  expect(
    index.apply({
      type: 'index',
      owner: 'a',
      revision: 1,
      reset: false,
      upserts: [],
      removed: ['a'],
      order: [],
    }),
  ).toBe(false);
  expect(index.query({ type: 'query', owner: 'a', revision: 1, request: 1, options })).toBeNull();
  expect(index.query({ type: 'query', owner: 'b', revision: 2, request: 1, options })).toBeNull();
  expect(
    index.query({ type: 'query', owner: 'a', revision: 2, request: 1, options })?.result?.total,
  ).toBe(1);
});
