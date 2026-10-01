import { beforeEach, expect, it } from 'vitest';
import { emptyState } from '../domain/model';
import { readCodeDraft, writeCodeDraft, codeDraftKey } from './code-example-draft';
const data = emptyState('synthetic-user', 'test');
const draft = {
  id: 'example',
  baseVersion: 3,
  content: {
    title: '예제',
    language: 'cpp' as const,
    code: '\t// 주석\r\n',
    stdin: '',
    notes: '  내 설명  ',
  },
};
beforeEach(() => localStorage.clear());
it('separates owner/namespace/entity and restores incomplete source verbatim', () => {
  const key = codeDraftKey(data, 'example');
  writeCodeDraft(key, draft);
  expect(readCodeDraft(key, 'example')).toEqual(draft);
  expect(codeDraftKey({ ...data, userId: 'other' }, 'example')).not.toBe(key);
  expect(codeDraftKey({ ...data, namespace: 'personal' }, 'example')).not.toBe(key);
  expect(() => readCodeDraft(key, 'other')).toThrow('원문을 보존');
});
it('does not repair or overwrite damaged draft data on read', () => {
  const key = codeDraftKey(data, 'example'),
    raw = '{broken';
  localStorage.setItem(key, raw);
  expect(() => readCodeDraft(key, 'example')).toThrow();
  expect(localStorage.getItem(key)).toBe(raw);
});
