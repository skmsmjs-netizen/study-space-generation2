import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { archiveDamagedDraft, clearRescuedDraft } from './draft-safety';
import { registerPersonalDraftWindow } from './personal-draft-window';
import { experienceKey, experienceReadingWidthKey, experienceUnstored, inspectExperienceRecovery, readExperience, restoreExperience, serializeExperienceRecovery, updateExperience } from './experience-state';

const data = { namespace: 'personal' as const, userId: 'experience-repair-fixture' };
const key = experienceKey(data);
const releases: Array<() => void> = [];
const windowFor = (id: string) => releases.push(registerPersonalDraftWindow(data.userId, id));
beforeEach(() => { localStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { vi.restoreAllMocks(); releases.splice(0).reverse().forEach(release => release()); clearRescuedDraft(key); });

it('shares reading width while preserving independent next-action and memo originals in prior window copies', () => {
  windowFor('first');
  updateExperience(data, state => ({ ...state, readingWidth: 'wide',
    next: { location: { route: '/math', label: '수식 탐색' }, body: '  먼저 적용 조건\n' },
    support: [{ id: 'preserved-problem', body: '  원문과 예외\n', updatedAt: '2026-10-01T01:00:00Z' }],
  }));
  const before = localStorage.getItem(key);
  windowFor('second');
  expect(readExperience(data).readingWidth).toBe('wide');
  expect(readExperience(data).next).toBeNull();
  updateExperience(data, state => ({ ...state, last: { route: '/materials', label: '강의 자료' } }));
  expect(readExperience(data).next).toBeNull();
  expect(localStorage.getItem(`${key}:recovery:window-first`)).toBe(before);
  windowFor('first');
  expect(readExperience(data).next?.body).toBe('  먼저 적용 조건\n');
  expect(readExperience(data).support[0]).toMatchObject({ id: 'preserved-problem', body: '  원문과 예외\n' });
});

const savedSetting = () => {
  windowFor('saved-window');
  updateExperience(data, state => ({ ...state, readingWidth: 'wide',
    next: { location: { route: '/math', label: '수식 탐색' }, body: '  복구할 다음 행동\n' },
    support: [{ id: 'original-id', body: '  문제 메모 원문\n', updatedAt: '2026-10-01T01:00:00Z', history: [{ id: 'earlier-id', body: '이전 글', updatedAt: '2026-10-01T00:00:00Z' }] }],
  }));
  const raw = localStorage.getItem(key)!;
  localStorage.setItem(key, '  {incomplete original\n\ud800');
  return raw;
};

it('exports exact damaged strings and explicitly restores a valid copy without changing other keys or losing history', () => {
  const validRaw = savedSetting(), damaged = localStorage.getItem(key);
  localStorage.setItem(`${key}:next-draft`, '  아직 적는 글\n');
  const before = { ...localStorage };
  const snapshot = inspectExperienceRecovery(data);
  expect({ ...localStorage }).toEqual(before);
  expect(JSON.parse(serializeExperienceRecovery(snapshot)).savedRaw).toBe(damaged);
  const copy = snapshot.archives.find(archive => archive.usable)!;
  expect(copy.raw).toBe(validRaw);
  restoreExperience(data, snapshot, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! });
  expect(readExperience(data).support[0]).toMatchObject({ id: 'original-id', body: '  문제 메모 원문\n', history: [{ id: 'earlier-id', body: '이전 글' }] });
  expect(readExperience(data).next?.body).toBe('  복구할 다음 행동\n');
  expect(localStorage.getItem(`${key}:next-draft`)).toBe('  아직 적는 글\n');
  expect(inspectExperienceRecovery(data).archives.some(archive => archive.raw === damaged)).toBe(true);
});

it('never replaces damaged settings when making the original archive fails', () => {
  savedSetting(); const snapshot = inspectExperienceRecovery(data);
  const copy = snapshot.archives.find(archive => archive.usable)!;
  const write = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name, value) {
    if (name.startsWith(`${key}:recovery:`) && name !== copy.archiveKey) throw new DOMException('quota', 'QuotaExceededError');
    return write.call(this, name, value);
  });
  expect(() => restoreExperience(data, snapshot, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! })).toThrow('원문 사본을 보관하지 못했습니다');
  expect(localStorage.getItem(key)).toBe(snapshot.savedRaw);
  expect(experienceUnstored(data)).toBe(false);
});

it('retains the original and unconfirmed restore on a write failure, then verifies an explicit retry', () => {
  savedSetting(); const snapshot = inspectExperienceRecovery(data);
  const copy = snapshot.archives.find(archive => archive.usable)!;
  const write = Storage.prototype.setItem;
  const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name, value) {
    if (name === key) throw new DOMException('quota', 'QuotaExceededError');
    return write.call(this, name, value);
  });
  expect(() => restoreExperience(data, snapshot, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! })).toThrow();
  expect(localStorage.getItem(key)).toBe(snapshot.savedRaw);
  expect(experienceUnstored(data)).toBe(true);
  failed.mockRestore();
  restoreExperience(data, inspectExperienceRecovery(data), { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! });
  expect(localStorage.getItem(key)).toBe(copy.raw);
  expect(experienceUnstored(data)).toBe(false);
});

it('refuses a changed shared value and foreign or changed archives before writing', () => {
  savedSetting(); const snapshot = inspectExperienceRecovery(data);
  const copy = snapshot.archives.find(archive => archive.usable)!;
  localStorage.setItem(key, copy.raw!);
  expect(() => restoreExperience(data, snapshot, { kind: 'restart' })).toThrow('다른 창에서 설정이 바뀌었습니다');
  expect(localStorage.getItem(key)).toBe(copy.raw);
  const now = inspectExperienceRecovery(data);
  expect(() => restoreExperience(data, now, { kind: 'archive', archiveKey: 'study-space:personal:foreign:experience:v1:recovery:abc', raw: copy.raw! })).toThrow();
  localStorage.setItem(copy.archiveKey, 'different original');
  expect(() => restoreExperience(data, now, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! })).toThrow('복구할 보관본을 확인하지 못했습니다');
  expect(localStorage.getItem(key)).toBe(copy.raw);
});

it('an explicit restart archives both damaged metadata and the window copy and preserves editable drafts', () => {
  const validRaw = savedSetting(); const damaged = localStorage.getItem(key);
  localStorage.setItem(`${key}:next-draft`, '  입력 중\n');
  localStorage.setItem(`${key}:support-draft`, '  작성 중인 메모\n');
  restoreExperience(data, inspectExperienceRecovery(data), { kind: 'restart' });
  expect(readExperience(data).next).toBeNull();
  const archives = inspectExperienceRecovery(data).archives;
  expect(archives.some(archive => archive.raw === validRaw)).toBe(true);
  expect(archives.some(archive => archive.raw === damaged)).toBe(true);
  expect(localStorage.getItem(`${key}:next-draft`)).toBe('  입력 중\n');
  expect(localStorage.getItem(`${key}:support-draft`)).toBe('  작성 중인 메모\n');
});

it('a damaged archive cannot be applied as settings even when the raw string matches', () => {
  savedSetting(); const bad = archiveDamagedDraft(key)!;
  const snapshot = inspectExperienceRecovery(data);
  const candidate = snapshot.archives.find(archive => archive.archiveKey === bad)!;
  expect(candidate.usable).toBe(false);
  expect(() => restoreExperience(data, snapshot, { kind: 'archive', archiveKey: bad, raw: candidate.raw! })).toThrow();
  expect(localStorage.getItem(key)).toBe(snapshot.savedRaw);
});

it('an empty or damaged shared value is never replaced by defaults because another window authored it', () => {
  windowFor('new-window');
  for (const raw of ['', '  {broken original\n']) {
    localStorage.setItem(key, raw);
    localStorage.setItem(`${key}:window-author`, 'other-window');
    expect(() => readExperience(data)).toThrow();
    expect(() => updateExperience(data, state => ({ ...state, readingWidth: 'wide' }))).toThrow();
    expect(localStorage.getItem(key)).toBe(raw);
  }
});


it('restoring an old observation-enabled copy retains its events and raw archive without renewing consent', () => {
  savedSetting();
  const snapshot = inspectExperienceRecovery(data);
  const original = snapshot.archives.find(archive => archive.usable)!;
  const parsed = JSON.parse(original.raw!);
  parsed.measurement = { enabled: true, startedAt: '2026-09-30T01:00:00Z', events: [{ id: 'prior-event', action: 'resume', at: '2026-09-30T01:00:00Z' }] };
  const raw = JSON.stringify(parsed);
  localStorage.setItem(original.archiveKey, raw);
  restoreExperience(data, inspectExperienceRecovery(data), { kind: 'archive', archiveKey: original.archiveKey, raw });
  expect(readExperience(data).measurement).toEqual({ ...parsed.measurement, enabled: false });
  expect(inspectExperienceRecovery(data).archives.some(archive => archive.raw === raw)).toBe(true);
});


it('preserves damaged reading-width strings and rejects a width changed after inspection', () => {
  savedSetting(); const widthKey = experienceReadingWidthKey(data);
  localStorage.setItem(widthKey, '  damaged-width-original\n');
  let snapshot = inspectExperienceRecovery(data);
  const copy = snapshot.archives.find(archive => archive.usable)!;
  localStorage.setItem(widthKey, 'normal');
  expect(() => restoreExperience(data, snapshot, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! })).toThrow('다른 창에서 설정이 바뀌었습니다');
  localStorage.setItem(widthKey, '  damaged-width-original\n');
  snapshot = inspectExperienceRecovery(data);
  expect(JSON.parse(serializeExperienceRecovery(snapshot)).widthSavedRaw).toBe('  damaged-width-original\n');
  restoreExperience(data, snapshot, { kind: 'archive', archiveKey: copy.archiveKey, raw: copy.raw! });
  expect(readExperience(data).readingWidth).toBe('wide');
  expect(inspectExperienceRecovery(data).widthArchives.some(archive => archive.raw === '  damaged-width-original\n')).toBe(true);
});


it('does not treat an empty current-window copy or a failed empty write as a foreign-window marker', () => {
  savedSetting(); const validRaw = localStorage.getItem(`${key}:recovery:window-saved-window`)!;
  localStorage.setItem(key, validRaw);
  localStorage.setItem(`${key}:recovery:window-saved-window`, '');
  expect(() => updateExperience(data, state => state)).toThrow('저장된 원문은 그대로 보존했습니다');
  expect(localStorage.getItem(`${key}:recovery:window-saved-window`)).toBe('');
  expect(localStorage.getItem(key)).toBe(validRaw);
});
