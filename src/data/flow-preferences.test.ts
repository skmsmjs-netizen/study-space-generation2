import { beforeEach, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  defaultFlowPreferences,
  flowPreferencesKey,
  readFlowPreferences,
  useFlowPreferences,
} from './flow-preferences';
import { registerPersonalDraftWindow } from './personal-draft-window';
const owner = { namespace: 'personal' as const, userId: 'flow-owner' };
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('shares device settings between windows, keeps owners and surfaces isolated and migrates optional fields', () => {
  const key = flowPreferencesKey(owner, 'canvas');
  const unregister = registerPersonalDraftWindow(owner.userId, 'window-a');
  const hook = renderHook(() => useFlowPreferences(key));
  act(() =>
    hook.result.current.store({
      ...hook.result.current.value,
      minimap: 'show',
      nodeWidths: { 'node:a': 420 },
    }),
  );
  unregister();
  const unregisterB = registerPersonalDraftWindow(owner.userId, 'window-b');
  expect(readFlowPreferences(key).nodeWidths['node:a']).toBe(420);
  expect(readFlowPreferences(flowPreferencesKey(owner, 'graph'))).toEqual(defaultFlowPreferences);
  expect(
    readFlowPreferences(flowPreferencesKey({ ...owner, userId: 'another' }, 'canvas')),
  ).toEqual(defaultFlowPreferences);
  const old = { ...defaultFlowPreferences };
  delete (old as Partial<typeof old>).nodeWidths;
  localStorage.setItem(key, JSON.stringify(old));
  expect(readFlowPreferences(key).nodeWidths).toEqual({});
  unregisterB();
});
it('archives malformed bytes before resetting and never overwrites them through normal controls', () => {
  const key = flowPreferencesKey(owner, 'bad'),
    bytes = 'broken 原文\r\n  ';
  localStorage.setItem(key, bytes);
  const hook = renderHook(() => useFlowPreferences(key));
  expect(hook.result.current.blocked).toBe(true);
  act(() => hook.result.current.store({ ...defaultFlowPreferences, snap: true }));
  expect(localStorage.getItem(key)).toBe(bytes);
  act(() => hook.result.current.reset());
  expect(hook.result.current.blocked).toBe(false);
  expect(
    Object.keys(localStorage).some(
      (k) => k.startsWith(`${key}:recovery:`) && localStorage.getItem(k) === bytes,
    ),
  ).toBe(true);
});
it('retains failed writes for reopening, retries exact values and switches owner without copying choices', () => {
  const key = flowPreferencesKey(owner, 'quota');
  const hook = renderHook(({ currentKey }) => useFlowPreferences(currentKey), {
    initialProps: { currentKey: key },
  });
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  act(() =>
    hook.result.current.store({ ...defaultFlowPreferences, background: 'cross', snap: true }),
  );
  expect(hook.result.current.error).toContain('저장하지 못했습니다');
  expect(readFlowPreferences(key).snap).toBe(true);
  write.mockRestore();
  act(() => hook.result.current.store(hook.result.current.value));
  expect(JSON.parse(localStorage.getItem(key)!).background).toBe('cross');
  const second = flowPreferencesKey({ ...owner, userId: 'second' }, 'quota');
  hook.rerender({ currentKey: second });
  expect(hook.result.current.value.snap).toBe(false);
  act(() => hook.result.current.store({ ...defaultFlowPreferences, minimap: 'hide' }));
  expect(readFlowPreferences(key).minimap).toBe('auto');
  expect(readFlowPreferences(second).minimap).toBe('hide');
});
