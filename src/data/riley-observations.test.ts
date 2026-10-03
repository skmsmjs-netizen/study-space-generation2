import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearRescuedDraft } from './draft-safety';
import {
  emptyRileyView,
  readRileyView,
  rileyViewKey,
  saveRileyView,
  validateRileyView,
} from './riley-observations';

const owner = { namespace: 'personal' as const, userId: 'riley-owner-test' };
const key = rileyViewKey(owner);
beforeEach(() => {
  localStorage.clear();
  clearRescuedDraft(key);
});
afterEach(() => {
  vi.restoreAllMocks();
  clearRescuedDraft(key);
  localStorage.clear();
});
describe('Riley observation view preservation', () => {
  it('separates demo, personal owners and encoded IDs', () => {
    expect(key).not.toBe(rileyViewKey({ namespace: 'demo', userId: owner.userId }));
    expect(key).not.toBe(rileyViewKey({ ...owner, userId: 'another-owner' }));
    expect(rileyViewKey({ ...owner, userId: 'a:b' })).toContain('a%3Ab');
  });
  it('restores committed values, unfinished input, position and authored note independently', () => {
    const v = emptyRileyView();
    v.selected = 'riley-3e-section-4.2';
    v.listReturn = { id: v.selected, y: 812 };
    v.atlas = 2;
    v.positions[v.selected] = {
      values: { r: 0.55, n: 12 },
      inputs: { r: '0.55-' },
      step: 2,
      zoom: 2,
      note: '조건과 예외\n원문은 그대로',
      noteHistory: [{ text: '앞선 메모', at: '2026-10-03T00:00:00Z' }],
    };
    saveRileyView(key, v);
    expect(readRileyView(key)).toEqual(v);
  });
  it('does not overwrite an unreadable persistent original', () => {
    localStorage.setItem(key, '{"version":1,broken');
    expect(() => readRileyView(key)).toThrow();
    expect(() => saveRileyView(key, emptyRileyView())).toThrow();
    expect(localStorage.getItem(key)).toBe('{"version":1,broken');
  });
  it('keeps a failed write in session rescue, then saves after retry', () => {
    const original = emptyRileyView();
    saveRileyView(key, original);
    const next = { ...original, query: '보관되지 않은 입력' };
    const real = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      k,
      v,
    ) {
      if (k === key) throw new DOMException('quota', 'QuotaExceededError');
      real.call(this, k, v);
    });
    expect(() => saveRileyView(key, next)).toThrow();
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(original);
    expect(readRileyView(key)).toEqual(next);
    spy.mockRestore();
    saveRileyView(key, next);
    expect(readRileyView(key)).toEqual(next);
  });
  it('rejects malformed history, nonfinite actual values and array-shaped input maps', () => {
    const v = emptyRileyView();
    v.positions['riley-3e-section-4.2'] = {
      values: { r: Infinity },
      inputs: {},
      step: 0,
      zoom: 1,
      note: '',
      noteHistory: [],
    };
    expect(() => validateRileyView(v)).toThrow();
    v.positions['riley-3e-section-4.2'].values = { r: 0.5 };
    v.positions['riley-3e-section-4.2'].inputs = [] as unknown as Record<string, string>;
    expect(() => validateRileyView(v)).toThrow();
  });
});
