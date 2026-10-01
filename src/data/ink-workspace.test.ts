import { beforeEach, expect, it } from 'vitest';
import { inkChange, inkFingerprint } from '../domain/ink-editing';
import type { MemoStroke } from '../domain/model';
import {
  defaultInkWorkspace,
  readInkPreferences,
  readInkWorkspace,
  writeInkPreferences,
  writeInkWorkspace,
} from './ink-workspace';
beforeEach(() => localStorage.clear());
const stroke: MemoStroke = {
  id: 'line',
  ink: 'ink',
  width: 3,
  points: [{ x: 5, y: 10, pressure: 0.5 }],
};
it('restores user-scoped settings and undo only for matching content, preserving a stale history on disk', () => {
  writeInkPreferences('user-a:prefs', { ink: 'green', width: 5, pressure: true, finger: false });
  expect(readInkPreferences('user-a:prefs').ink).toBe('green');
  expect(readInkPreferences('user-b:prefs').ink).toBe('ink');
  const view = {
    ...defaultInkWorkspace([stroke]),
    pages: 3,
    page: 2,
    zoom: 2,
    undo: [inkChange([], [stroke])!],
    fingerprint: inkFingerprint([stroke]),
  };
  writeInkWorkspace('a:history', view);
  expect(readInkWorkspace('a:history', [stroke])).toEqual(view);
  const raw = localStorage.getItem('a:history');
  expect(
    readInkWorkspace('a:history', [{ ...stroke, points: [{ x: 9, y: 10, pressure: 0.5 }] }]).undo,
  ).toHaveLength(0);
  expect(localStorage.getItem('a:history')).toBe(raw);
});
it('retains corrupt preferences/history rather than silently replacing them', () => {
  localStorage.setItem('broken', '{original');
  expect(() => readInkPreferences('broken')).toThrow();
  expect(() => readInkWorkspace('broken', [])).toThrow();
  expect(localStorage.getItem('broken')).toBe('{original');
});
