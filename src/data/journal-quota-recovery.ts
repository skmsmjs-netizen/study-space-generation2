import { isStorageQuotaError } from './storage-errors';
import { IndexedPersonalJournal } from './indexed-personal-journal';
import { personalJournalKey } from './personal-repository';
import { decodeStoredText } from './storage-codec';
import { validateState, applyCommand } from '../domain/commands';
import type { AppState, Command } from '../domain/model';

/** Relocate only validated app journals, never credentials, drafts, or other sites' data. */
export async function recoverPersonalJournalQuota(storage: Storage = localStorage,
  factory: IDBFactory | undefined = globalThis.indexedDB,
  locks: LockManager | undefined = globalThis.navigator?.locks): Promise<number> {
  if (!factory) return 0;
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => !!key && /^study-space:(personal|test):[^:]+:online:v1(?::window:[^:]+)?$/.test(key));
  let moved = 0;
  for (const key of keys) {
    const move = async () => {
      const raw = storage.getItem(key);
      if (raw === null) return;
      try {
        const saved = JSON.parse(decodeStoredText(raw));
        if (saved.format !== 1 || !Array.isArray(saved.pending) || !Array.isArray(saved.archives)) return;
        validateState(saved.base.data); validateState(saved.local);
        const data = saved.local as AppState, root = personalJournalKey(data);
        if (!['personal', 'test'].includes(data.namespace) || (key !== root && !key.startsWith(`${root}:window:`))) return;
        if (saved.base.data.userId !== data.userId || saved.base.data.namespace !== data.namespace) return;
        if (JSON.stringify(saved.pending.reduce((state: AppState, command: Command) => applyCommand(state, command), saved.base.data)) !== JSON.stringify(data)) return;
      } catch { return; } // Damaged/unknown originals remain untouched.
      const journal = await IndexedPersonalJournal.open(storage, key, factory);
      try { await journal.relocateLegacy(); if (storage.getItem(key) === null) moved++; }
      finally { journal.close(); }
    };
    if (locks) await locks.request(`study-space:journal:${key}`, { ifAvailable: true }, async lock => {
      if (!lock) return;
      if (key.includes(':window:')) await move();
      else await locks.request(`study-space:personal:${decodeURIComponent(key.split(':')[2])}:writer`, { ifAvailable: true }, async legacyLock => { if (legacyLock) await move(); });
    });
    else await move();
  }
  return moved;
}

export async function writeLoginStorage(storage: Storage, key: string, value: string) {
  try { storage.setItem(key, value); }
  catch (error) {
    if (!isStorageQuotaError(error)) throw error;
    await recoverPersonalJournalQuota(storage);
    storage.setItem(key, value);
  }
}
