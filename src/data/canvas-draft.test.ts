import { beforeEach, expect, it } from 'vitest';
import { emptyState } from '../domain/model';
import { canvasDraftKey, clearCanvasDraft, preserveCanvasDraft, readCanvasDraft, writeCanvasDraft, readConnectionDraft, writeConnectionDraft } from './canvas-draft';
import { listDraftArchives } from './draft-archives';
const data = emptyState('test-user', 'test');
beforeEach(() => { localStorage.clear(); clearCanvasDraft(data); });
it('recovers exact pending layout without touching original study data or another namespace', () => {
  const draft = { baseVersion: 7, content: { positions: { 'node:original-id': { x: -17.5, y: 333 } }, links: [{ id: 'link-original', source: 'node:original-id', target: 'memo:original-memo', label: ' 原文\r\n ' }] } };
  writeCanvasDraft(data, draft); expect(readCanvasDraft(data)).toEqual(draft);
  expect(readCanvasDraft(emptyState('other-user', 'test'))).toBeNull();
  expect(data.records).toEqual([]); clearCanvasDraft(data); expect(readCanvasDraft(data)).toBeNull();
});
it('leaves malformed source untouched and exposes an exact archive for recovery', () => {
  const raw = '{ broken original '; localStorage.setItem(canvasDraftKey(data), raw);
  expect(() => readCanvasDraft(data)).toThrow(); expect(localStorage.getItem(canvasDraftKey(data))).toBe(raw);
  const archive = preserveCanvasDraft(data); expect(localStorage.getItem(archive!)).toBe(raw);
  expect(listDraftArchives(localStorage, 'study-space:test:test-user:').archives[0].sourceKey).toBe(canvasDraftKey(data));
  expect(localStorage.getItem(canvasDraftKey(data))).toBe(raw);
});
it('keeps an unfinished connection explanation exact across reloads without applying another tab or user draft', () => {
  const draft = { source: 'node:original-id', target: 'node:other-id', label: '  조건일 때\r\n성립한다  ' };
  writeConnectionDraft(data, draft);
  expect(readConnectionDraft(data)).toEqual(draft);
  expect(readConnectionDraft(emptyState('another-user', 'test')).label).toBe('');
  sessionStorage.clear();
  expect(readConnectionDraft(data)).toEqual({ source: '', target: '', label: '' });
  expect(Array.from({ length: localStorage.length }, (_, i) => localStorage.getItem(localStorage.key(i)!))).toContain(JSON.stringify(draft));
});
