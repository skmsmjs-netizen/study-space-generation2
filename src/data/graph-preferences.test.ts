import { beforeEach, expect, it, vi } from 'vitest';
import { graphPreferencesKey, readGraphPreferences, writeGraphPreferences, defaultGraphPreferences } from './graph-preferences';
const owner = { userId: 'graph-owner', namespace: 'personal' as const };
beforeEach(() => localStorage.clear());
it('reopens display choices per account without changing stored learning data', () => {
  localStorage.setItem('study-space:demo:v1', 'original records');
  const preferences = { ...defaultGraphPreferences, spacing: 'wide' as const, query: '내 메모', notes: false };
  writeGraphPreferences(owner, preferences);
  expect(readGraphPreferences(owner)).toEqual(preferences);
  expect(readGraphPreferences({ ...owner, userId: 'another' })).toEqual(defaultGraphPreferences);
  expect(readGraphPreferences({ ...owner, namespace: 'test' })).toEqual(defaultGraphPreferences);
  expect(localStorage.getItem('study-space:demo:v1')).toBe('original records');
});
it('preserves malformed preference bytes instead of silently replacing them', () => {
  const key = graphPreferencesKey(owner);
  localStorage.setItem(key, 'broken 原文');
  expect(() => readGraphPreferences(owner)).toThrow('원래 설정은 보존');
  expect(localStorage.getItem(key)).toBe('broken 原文');
});
it('retains a failed settings write for route reopening and allows an exact retry', () => {
  const user = { ...owner, userId: 'graph-write-failure' };
  const value = { ...defaultGraphPreferences, spacing: 'compact' as const };
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('quota'); });
  expect(() => writeGraphPreferences(user, value)).toThrow('quota');
  expect(readGraphPreferences(user)).toEqual(value);
  write.mockRestore();
  writeGraphPreferences(user, value);
  expect(JSON.parse(localStorage.getItem(graphPreferencesKey(user))!)).toEqual(value);
});
