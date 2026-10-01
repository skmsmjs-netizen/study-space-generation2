// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { createFullBackup, checkFullBackup, restoreFullBackup } from './full-backup';
import { PersonalRepository } from './personal-repository';
import { registerPersonalDraftWindow } from './personal-draft-window';
import { readRescuedDraft } from './draft-safety';
import { emptyState } from '../domain/model';
import { emptyExperience } from '../domain/brand';

class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() { return this.values.size; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
afterEach(() => vi.unstubAllGlobals());
it('backs up exact saved settings and every window copy rather than the foreign-window empty marker or a display copy', async () => {
  const first = { local: new MemoryStorage(), session: new MemoryStorage(), factory: new IDBFactory() };
  const owner = emptyState('backup-settings-owner', 'personal');
  new PersonalRepository(first.local, { load: async () => ({ sequence: 0, data: owner }), execute: async () => { throw Error('no study writes'); } }, { sequence: 0, data: owner });
  vi.stubGlobal('localStorage', first.local);
  const key = `study-space:personal:${owner.userId}:experience:v1`;
  const primary = JSON.stringify({ ...emptyExperience(), readingWidth: 'wide' });
  first.local.setItem(key, primary);
  first.local.setItem(`${key}:window-author`, 'first');
  first.local.setItem(`${key}:recovery:window-first`, primary);
  const release = registerPersonalDraftWindow(owner.userId, 'second');
  try {
    expect(readRescuedDraft(key)).toBe('');
    const markerBackup = await checkFullBackup(await createFullBackup(owner, first), owner);
    expect(markerBackup.rows.find(row => row.key === key)?.value).toBe(primary);
    const ownCopy = JSON.stringify({ ...emptyExperience(), support: [{ id: 'own', body: '  내 창 원문\n\ud800  ', at: '2026-10-01T00:00:00Z' }] });
    first.local.setItem(`${key}:recovery:window-second`, ownCopy);
    expect(readRescuedDraft(key)).toBe(ownCopy);
    const checked = await checkFullBackup(await createFullBackup(owner, first), owner);
    const target = { local: new MemoryStorage(), session: new MemoryStorage(), factory: new IDBFactory() };
    await restoreFullBackup(checked, owner, target);
    for (const [savedKey, raw] of first.local.values) {
      if (savedKey.includes(':experience:')) expect(target.local.getItem(savedKey)).toBe(raw);
    }
  } finally { release(); }
});
