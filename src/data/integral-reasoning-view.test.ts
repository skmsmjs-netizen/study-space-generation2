import { beforeEach, expect, it } from 'vitest';
import { DEFAULT_READING } from '../domain/integral-reasoning';
import {
  defaultReasoningView,
  isReasoningView,
  readReasoningView,
  reasoningViewKey,
  writeReasoningView,
} from './integral-reasoning-view';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('preserves separate reading locations and explicit branches across reopening', () => {
  const key = reasoningViewKey({ namespace: 'personal', userId: 'reader-a' });
  const view = {
    ...defaultReasoningView(),
    active: 'series' as const,
    example: 'alternating' as const,
    readings: {
      'log-square': { ...DEFAULT_READING, step: 'integral' as const },
      alternating: { ...DEFAULT_READING, absolute: true, step: 'conclusion' as const },
    },
  };
  writeReasoningView(key, view);
  expect(readReasoningView(key)).toEqual(view);
  expect(
    readReasoningView(reasoningViewKey({ namespace: 'personal', userId: 'reader-b' })),
  ).toEqual(defaultReasoningView());
});
it('rejects damaged values without overwriting their original text', () => {
  const key = reasoningViewKey({ namespace: 'demo', userId: 'reader' });
  const original = '{"version":77,"readings":"원문"}';
  localStorage.setItem(key, original);
  expect(() => readReasoningView(key)).toThrow();
  expect(localStorage.getItem(key)).toBe(original);
  expect(isReasoningView({ ...defaultReasoningView(), readings: { log: null } })).toBe(false);
  expect(
    isReasoningView({
      ...defaultReasoningView(),
      readings: { log: { ...DEFAULT_READING, pending: 'typo' } },
    }),
  ).toBe(false);
});
