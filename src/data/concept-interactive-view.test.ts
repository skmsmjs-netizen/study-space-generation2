import { beforeEach, expect, it, vi } from 'vitest';
import {
  conceptInteractiveViewKey,
  readConceptInteractiveView,
  writeConceptInteractiveView,
} from './concept-interactive-view';
import { freshState } from '../interactive/math-physics/model.mjs';
import { clearRescuedDraft } from './draft-safety';
import { registerPersonalDraftWindow } from './personal-draft-window';
const owner = { namespace: 'personal' as const, userId: 'concept-reader' };
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
  clearRescuedDraft(conceptInteractiveViewKey(owner));
});
it('separates owners/spaces and preserves all other records, drafts and standalone views', () => {
  const key = conceptInteractiveViewKey(owner),
    raw = JSON.stringify(freshState());
  for (const sibling of ['study-space:demo:v1', 'manseeksong:math-template-kit:v1', `${key}:other`])
    localStorage.setItem(sibling, '  original\n');
  writeConceptInteractiveView(key, raw);
  expect(readConceptInteractiveView(key)).toBe(raw);
  expect(
    readConceptInteractiveView(conceptInteractiveViewKey({ ...owner, userId: 'another' })),
  ).toBeNull();
  expect(
    readConceptInteractiveView(conceptInteractiveViewKey({ ...owner, namespace: 'demo' })),
  ).toBeNull();
  for (const sibling of ['study-space:demo:v1', 'manseeksong:math-template-kit:v1', `${key}:other`])
    expect(localStorage.getItem(sibling)).toBe('  original\n');
});
it('retains corrupt raw data and rejects replacement until the original can be read', () => {
  const key = conceptInteractiveViewKey(owner);
  localStorage.setItem(key, '{broken raw');
  expect(() => readConceptInteractiveView(key)).toThrow();
  expect(() => writeConceptInteractiveView(key, JSON.stringify(freshState()))).toThrow();
  expect(localStorage.getItem(key)).toBe('{broken raw');
});
it('keeps pending views through a failed write and a route unmount, then retries', () => {
  const key = conceptInteractiveViewKey(owner),
    raw = JSON.stringify(freshState());
  const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  expect(() => writeConceptInteractiveView(key, raw)).toThrow('quota');
  expect(readConceptInteractiveView(key)).toBe(raw);
  set.mockRestore();
  writeConceptInteractiveView(key, raw);
  expect(localStorage.getItem(key)).toBe(raw);
});

it("resumes the owner's device view in a new window without replacing window-specific writing", () => {
  const key = conceptInteractiveViewKey(owner),
    raw = JSON.stringify(freshState());
  const releaseFirst = registerPersonalDraftWindow(owner.userId, 'first-window');
  writeConceptInteractiveView(key, raw);
  releaseFirst();
  const releaseSecond = registerPersonalDraftWindow(owner.userId, 'second-window');
  try {
    expect(readConceptInteractiveView(key)).toBe(raw);
    expect(localStorage.getItem(`${key}:recovery:window-first-window`)).toBe(raw);
  } finally {
    releaseSecond();
  }
});

it('does not let a pending rescue hide a damaged persisted original during retry', () => {
  const key = conceptInteractiveViewKey(owner),
    raw = JSON.stringify(freshState());
  const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  expect(() => writeConceptInteractiveView(key, raw)).toThrow('quota');
  set.mockRestore();
  localStorage.setItem(key, '{damaged behind rescue');
  expect(readConceptInteractiveView(key)).toBe(raw);
  expect(() => writeConceptInteractiveView(key, raw)).toThrow();
  expect(localStorage.getItem(key)).toBe('{damaged behind rescue');
});
