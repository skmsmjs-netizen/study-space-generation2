import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { retainNextAction } from '../domain/brand';
import { clearRescuedDraft } from './draft-safety';
import { registerPersonalDraftWindow } from './personal-draft-window';
import {
  experienceKey,
  readExperience,
  resolveWorkLocation,
  trackExperience,
  updateExperience,
} from './experience-state';

beforeEach(() => {
  localStorage.clear();
  clearRescuedDraft(experienceKey(createDemoState()));
});
afterEach(() => vi.restoreAllMocks());
describe('brand continuity preservation and observations', () => {
  it('opens a new personal window with the shared next action while preserving window-specific copies', () => {
    const data = { ...createDemoState(), namespace: 'personal' as const };
    const key = experienceKey(data);
    const leaveFirst = registerPersonalDraftWindow(data.userId, 'first-window');
    const body = '  첫 창에서 남긴 다음 행동\n';
    updateExperience(data, (s) => ({
      ...s, next: { location: { route: '/math', label: '수식 탐색' }, body },
    }));
    const original = localStorage.getItem(key);
    leaveFirst();
    const leaveSecond = registerPersonalDraftWindow(data.userId, 'second-window');
    try {
      expect(readExperience(data).next?.body).toBe(body);
      expect(localStorage.getItem(key)).toBe(original);
      updateExperience(data, (s) => ({ ...s, last: { route: '/materials', label: '강의 자료' } }));
      expect(localStorage.getItem(`${key}:recovery:window-first-window`)).toBe(original);
      expect(readExperience(data).last?.route).toBe('/materials');
      expect(readExperience(data).next?.body).toBe(body);
    } finally { leaveSecond(); }
    const reopenFirst = registerPersonalDraftWindow(data.userId, 'first-window');
    try { expect(readExperience(data).next?.body).toBe(body); }
    finally { reopenFirst(); }
  });
  it('blocks replacement of empty or damaged shared metadata and keeps the exact original', () => {
    const data = createDemoState(), key = experienceKey(data);
    localStorage.setItem(key, '');
    expect(() => readExperience(data)).toThrow('이어가기 설정을 읽지 못했습니다');
    expect(localStorage.getItem(key)).toBe('');
    const damaged = '  {unfinished original\n';
    localStorage.setItem(key, damaged);
    expect(() => readExperience(data)).toThrow('원문은 유지했습니다');
    expect(() => updateExperience(data, (s) => s)).toThrow('이어가기 설정을 읽지 못했습니다');
    expect(localStorage.getItem(key)).toBe(damaged);
  });
  it('retains earlier next-action originals when replacing, hiding and restoring their display', () => {
    const data = createDemoState(),
      location = { route: '/math', label: '수식 탐색' };
    const first = '  첫 다음 행동\n',
      second = '  고친 다음 행동\n';
    updateExperience(data, (state) => retainNextAction(state, { location, body: first }));
    updateExperience(data, (state) => retainNextAction(state, { location, body: second }));
    updateExperience(data, (state) => retainNextAction(state, null));
    const saved = readExperience(data);
    expect(saved.next).toBeNull();
    expect(saved.nextHistory?.map((item) => item.body)).toEqual([first, second]);
    updateExperience(data, (state) =>
      retainNextAction(state, { location, body: state.nextHistory![0].body }),
    );
    expect(readExperience(data).next?.body).toBe(first);
    expect(readExperience(data).nextHistory?.map((item) => item.body)).toEqual([first, second]);
    expect(data.records).toHaveLength(0);
  });
  it('keeps exact next text separately from study state, and isolates account and namespace', () => {
    const data = createDemoState(),
      before = structuredClone(data),
      body = '  다음에는 식의 조건부터\n부분만 해도 남기기\n';
    updateExperience(data, (s) => ({
      ...s,
      next: { location: { route: '/node/demo-topic-function', label: '함수' }, body },
    }));
    expect(readExperience(data).next?.body).toBe(body);
    expect(readExperience({ ...data, userId: 'someone-else' }).next).toBeNull();
    expect(readExperience({ ...data, namespace: 'personal' }).next).toBeNull();
    expect(data).toEqual(before);
  });
  it('preserves malformed metadata instead of clearing or replacing it', () => {
    const data = createDemoState(),
      key = experienceKey(data),
      raw = '  {bad original\n';
    localStorage.setItem(key, raw);
    expect(() => updateExperience(data, (s) => s)).toThrow();
    expect(localStorage.getItem(key)).toBe(raw);
  });
  it('rescues text on failed writes and verifies a later retry without losing the original', () => {
    const data = createDemoState(),
      key = experienceKey(data);
    updateExperience(data, (s) => ({ ...s, last: { route: '/math', label: '수식 탐색' } }));
    const before = localStorage.getItem(key),
      write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('quota', 'QuotaExceededError');
      });
    expect(() =>
      updateExperience(data, (s) => ({
        ...s,
        next: { location: s.last!, body: '  남겨야 할 원문\n' },
      })),
    ).toThrow();
    expect(localStorage.getItem(key)).toBe(before);
    expect(readExperience(data).next?.body).toBe('  남겨야 할 원문\n');
    write.mockRestore();
    updateExperience(data, (s) => s);
    expect(JSON.parse(localStorage.getItem(key)!).next.body).toBe('  남겨야 할 원문\n');
  });
  it('does not follow removed or foreign entities and resolves current names', () => {
    const data = createDemoState(),
      route = '/node/demo-topic-function',
      node = data.nodes.find((n) => n.id === 'demo-topic-function')!;
    node.name = '현재 이름';
    expect(resolveWorkLocation(data, route)?.label).toContain('현재 이름');
    node.deletedAt = '2026-10-01T00:00:00Z';
    expect(resolveWorkLocation(data, route)).toBeNull();
    node.deletedAt = null;
    node.userId = 'different-user';
    expect(resolveWorkLocation(data, route)).toBeNull();
    expect(resolveWorkLocation(data, 'https://external.invalid/')).toBeNull();
  });
  it('retains the intended write when read-back verification throws and retries it exactly', () => {
    const data = createDemoState(),
      key = experienceKey(data);
    const realRead = Storage.prototype.getItem;
    let reads = 0;
    const failed = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (
      this: Storage,
      name,
    ) {
      if (name === key && ++reads === 2) throw Error('read-back unavailable');
      return realRead.call(this, name);
    });
    expect(() =>
      updateExperience(data, (s) => ({
        ...s,
        next: { location: { route: '/math', label: '수식 탐색' }, body: '  확인 실패에도 원문\n' },
      })),
    ).toThrow('read-back unavailable');
    failed.mockRestore();
    expect(readExperience(data).next?.body).toBe('  확인 실패에도 원문\n');
    updateExperience(data, (s) => s);
    expect(JSON.parse(localStorage.getItem(key)!).next.body).toBe('  확인 실패에도 원문\n');
  });
  it('collects nothing before consent and stops after disabling without collecting text or targets', () => {
    const data = createDemoState();
    trackExperience(data, 'resume');
    expect(localStorage.getItem(experienceKey(data))).toBeNull();
    updateExperience(data, (s) => ({
      ...s,
      measurement: { ...s.measurement, enabled: true, startedAt: new Date().toISOString() },
    }));
    trackExperience(data, 'resume');
    expect(Object.keys(readExperience(data).measurement.events[0]).sort()).toEqual([
      'action',
      'at',
      'id',
    ]);
    updateExperience(data, (s) => ({ ...s, measurement: { ...s.measurement, enabled: false } }));
    trackExperience(data, 'reuse');
    expect(readExperience(data).measurement.events).toHaveLength(1);
    expect(data.records).toEqual(createDemoState().records);
  });
});
