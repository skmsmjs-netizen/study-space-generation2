import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { retainNextAction } from '../domain/brand';
import { registerPersonalDraftWindow } from './personal-draft-window';
import {
  experienceKey,
  experienceReadingWidthKey,
  readExperience,
  updateExperience,
} from './experience-state';
import {
  defaultGraphPreferences,
  graphPreferencesKey,
  readGraphPreferences,
  writeGraphPreferences,
} from './graph-preferences';
import { clearRescuedDraft, readRescuedDraft, storeDraftSafely } from './draft-safety';

const data = { ...createDemoState(), namespace: 'personal' as const, userId: 'settings-owner' };
const releases: Array<() => void> = [];
const switchWindow = (id: string) => releases.push(registerPersonalDraftWindow(data.userId, id));
const keys = [experienceKey(data), graphPreferencesKey(data), experienceReadingWidthKey(data)];
beforeEach(() => {
  localStorage.clear();
  keys.forEach(clearRescuedDraft);
});
afterEach(() => {
  vi.restoreAllMocks();
  releases.splice(0).forEach((fn) => { fn(); });
  keys.forEach(clearRescuedDraft);
});

it('reads saved settings in another window and preserves obsolete per-window copies verbatim', () => {
  switchWindow('first');
  updateExperience(data, (state) =>
    retainNextAction(
      { ...state, readingWidth: 'wide' },
      { location: { route: '/math', label: '수식 탐색' }, body: '  이어 쓸 원문\n조건과 예외  ' },
    ),
  );
  writeGraphPreferences(data, {
    ...defaultGraphPreferences,
    query: '  그래프 검색  ',
    spacing: 'wide',
  });
  const oldCopies = keys.map((key) => {
    const raw = localStorage.getItem(key)!;
    localStorage.setItem(`${key}:recovery:window-first`, raw);
    localStorage.setItem(`${key}:window-author`, 'first');
    if (key === graphPreferencesKey(data))
      localStorage.setItem(`${key}:recovery:window-second`, '{}');
    return raw;
  });
  switchWindow('second');
  expect(readExperience(data).readingWidth).toBe('wide');
  expect(readExperience(data).next).toBeNull();
  expect(readGraphPreferences(data).query).toBe('  그래프 검색  ');
  updateExperience(data, (state) => ({ ...state, readingWidth: 'normal' }));
  switchWindow('first');
  expect(readExperience(data).readingWidth).toBe('normal');
  expect(readExperience(data).next?.body).toBe('  이어 쓸 원문\n조건과 예외  ');
  keys.forEach((key, index) =>
    { expect(localStorage.getItem(`${key}:recovery:window-first`)).toBe(oldCopies[index]); },
  );
  expect(readExperience({ ...data, userId: 'other' }).next).toBeNull();
});

it('keeps independent next-action originals while windows change the shared reading width', () => {
  switchWindow('first');
  const first = '  첫 원문\n',
    second = '  다음 원문\n';
  updateExperience(data, (state) =>
    retainNextAction(state, { location: { route: '/math', label: '수식' }, body: first }),
  );
  switchWindow('second');
  updateExperience(data, (state) =>
    retainNextAction(
      { ...state, readingWidth: 'wide' },
      { location: { route: '/code', label: '코딩' }, body: second },
    ),
  );
  switchWindow('first');
  updateExperience(data, (state) => ({ ...state, readingWidth: 'normal' }));
  expect(readExperience(data).next?.body).toBe(first);
  switchWindow('second');
  expect(readExperience(data).next?.body).toBe(second);
  expect(readExperience(data).readingWidth).toBe('normal');
});

it('inherits only the reading width from pre-fix storage without rewriting its original', () => {
  const key = experienceKey(data);
  const original = JSON.stringify({
    version: 1,
    last: null,
    next: { location: { route: '/math', label: '수식' }, body: '  예전 창의 원문\n' },
    readingWidth: 'wide',
    measurement: { enabled: false, startedAt: null, events: [] },
    support: [],
  });
  localStorage.setItem(key, original);
  localStorage.setItem(`${key}:window-author`, 'earlier');
  localStorage.setItem(`${key}:recovery:window-earlier`, original);
  switchWindow('new');
  expect(readExperience(data).readingWidth).toBe('wide');
  expect(readExperience(data).next).toBeNull();
  expect(localStorage.getItem(key)).toBe(original);
  expect(localStorage.getItem(experienceReadingWidthKey(data))).toBeNull();
  updateExperience(data, (state) => ({ ...state, readingWidth: 'normal' }));
  switchWindow('earlier');
  expect(readExperience(data).readingWidth).toBe('normal');
  expect(readExperience(data).next?.body).toBe('  예전 창의 원문\n');
  expect(localStorage.getItem(`${key}:recovery:window-earlier`)).toBe(original);
});

it('retains the prior settings and a failed write for exact retry', () => {
  switchWindow('first');
  updateExperience(data, (state) => ({ ...state, readingWidth: 'wide' }));
  const raw = localStorage.getItem(keys[0]);
  switchWindow('second');
  const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('full', 'QuotaExceededError');
  });
  expect(() =>
    updateExperience(data, (state) =>
      retainNextAction(state, {
        location: { route: '/math', label: '수식' },
        body: '  실패해도 보존\n',
      }),
    ),
  ).toThrow();
  expect(localStorage.getItem(keys[0])).toBe(raw);
  expect(readExperience(data).next?.body).toBe('  실패해도 보존\n');
  failed.mockRestore();
  updateExperience(data, (state) => state);
  expect(JSON.parse(localStorage.getItem(keys[0])!).next.body).toBe('  실패해도 보존\n');
});

it('still isolates the next-action text draft and never replaces genuinely damaged settings', () => {
  const draft = `${keys[0]}:next-draft`;
  switchWindow('first');
  storeDraftSafely(draft, '  첫 창의 적던 글\n');
  switchWindow('second');
  expect(readRescuedDraft(draft)).toBe('');
  storeDraftSafely(draft, '  둘째 창의 적던 글\n');
  switchWindow('first');
  expect(readRescuedDraft(draft)).toBe('  첫 창의 적던 글\n');
  const broken = { ...data, namespace: 'demo' as const };
  localStorage.setItem(experienceKey(broken), '  {잘못된 원문\n');
  expect(() => updateExperience(broken, (state) => state)).toThrow('저장된 원문은 그대로 보존');
  expect(localStorage.getItem(experienceKey(broken))).toBe('  {잘못된 원문\n');
  clearRescuedDraft(draft);
});

it('does not claim a reading preference was saved when its separate write fails', () => {
  switchWindow('first');
  updateExperience(data, (state) => ({ ...state, readingWidth: 'normal' }));
  const originalWrite = Storage.prototype.setItem;
  const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === experienceReadingWidthKey(data))
      throw new DOMException('full', 'QuotaExceededError');
    return originalWrite.call(this, key, value);
  });
  expect(() => updateExperience(data, (state) => ({ ...state, readingWidth: 'wide' }))).toThrow();
  expect(localStorage.getItem(experienceReadingWidthKey(data))).toBe('normal');
  expect(readExperience(data).readingWidth).toBe('wide');
  failed.mockRestore();
  updateExperience(data, (state) => state);
  expect(localStorage.getItem(experienceReadingWidthKey(data))).toBe('wide');
});
