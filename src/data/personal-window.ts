import { personalJournalKey, readCachedPersonalSnapshot, type JournalRecovery } from './personal-repository';
import { decodeStoredText } from './storage-codec';
import type { ServerSnapshot } from '../server/command-handler';
import { IndexedPersonalJournal, indexedPersonalKeys } from './indexed-personal-journal';
import { registerPersonalDraftWindow } from './personal-draft-window';
import { readPersonalJournalRows } from './full-backup';

export interface PersonalWindow {
  key: string;
  cached: ServerSnapshot | null;
  release(): Promise<void>;
}

/** A lease protects only one window's outbox. Another window always gets its own
 * outbox, including when a browser duplicates sessionStorage along with a tab. */
export async function claimPersonalWindow(userId: string, storage: Storage = localStorage,
  session: Pick<Storage, 'getItem' | 'setItem'> = sessionStorage,
  locks: LockManager | undefined = navigator.locks,
  factory: IDBFactory | undefined = globalThis.indexedDB): Promise<PersonalWindow> {
  const root = personalJournalKey({ userId, namespace: 'personal' });
  const prefix = `${root}:window:`;
  const sessionKey = `${root}:current-window`;
  let previous: string | null = null;
  try { previous = session.getItem(sessionKey); } catch { /* A fresh isolated window still works. */ }
  const storedKeys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
  const keys = [...new Set([...storedKeys, ...(factory ? await indexedPersonalKeys(prefix, factory) : [])])].filter((key): key is string => !!key && key.startsWith(prefix));
  const readJournal = async (key: string) => {
    if (!factory) return { raw: storage.getItem(key), cached: readCachedPersonalSnapshot(storage, userId, key) };
    const journal = await IndexedPersonalJournal.open(storage, key, factory);
    try { return { raw: journal.getItem(key), cached: readCachedPersonalSnapshot(journal, userId, key) }; }
    finally { journal.close(); }
  };
  const candidates: string[] = [];
  if (previous?.startsWith(prefix)) candidates.push(previous);
  // A new visit can resume an abandoned outbox, but never writes into a live one.
  for (const key of keys) {
    if (candidates.includes(key)) continue;
    try {
      const { raw } = await readJournal(key);
      if (raw) {
        if (JSON.parse(decodeStoredText(raw)).pending?.length) candidates.splice(previous ? 1 : 0, 0, key);
        else candidates.push(key);
      }
    } catch { /* Damaged originals remain in the recovery export. */ }
  }
  if (!locks) candidates.length = 0; // Without a lease, never reuse another writer's key.
  candidates.push(`${prefix}${crypto.randomUUID()}`);
  for (const key of candidates) {
    let finish: () => void = () => {};
    const closed = new Promise<void>(resolve => { finish = resolve; });
    let granted: (value: boolean) => void = () => {};
    const ready = new Promise<boolean>(resolve => { granted = resolve; });
    const task = locks
      ? locks.request(`study-space:personal:${userId}:sessions`, { mode: 'shared' }, async () => {
        await locks.request(`study-space:journal:${key}`, { ifAvailable: true }, async lock => {
          granted(Boolean(lock));
          if (lock) await closed;
        });
      })
      : Promise.resolve();
    if (!locks) granted(true);
    void task.catch(() => granted(false));
    if (!await ready) { await task; continue; }
    try {
      // Reuse DB-only window copies after a quota relocation; never overwrite
      // them with an older root or recreate the large localStorage mirror.
      let saved = await readJournal(key);
      if (saved.raw === null) {
        const legacy = await readJournal(root);
        if (legacy.raw !== null) {
          if (factory) {
            const journal = await IndexedPersonalJournal.open(storage, key, factory);
            try { journal.setItem(key, legacy.raw); await journal.flush(); } finally { journal.close(); }
          } else storage.setItem(key, legacy.raw);
          saved = await readJournal(key);
        }
      }
      let cached = saved.cached;
      // Unacknowledged text stays in its own outbox. Only a validated base
      // snapshot can improve a new window's initial server sequence.
      for (const other of keys) {
        if (other === key) continue;
        try {
          const { cached: snapshot } = await readJournal(other);
          if (snapshot && (!cached || snapshot.sequence > cached.sequence)) cached = snapshot;
        } catch { /* Keep every invalid/unknown original. */ }
      }
      try { session.setItem(sessionKey, key); } catch { /* Journal is durable independently. */ }
      const unregisterDrafts = registerPersonalDraftWindow(userId, key.slice(prefix.length));
      return { key, cached, release: async () => { unregisterDrafts(); finish(); await task; } };
    } catch (error) { finish(); await task; throw error; }
  }
  throw Error('이 창의 기록 저장소를 열지 못했습니다. 보관된 글은 그대로 남아 있습니다. 다시 시도해 주세요.');
}

/** Export only the authenticated owner's other journals, including damaged text. */
export async function personalWindowCopies(userId: string, currentKey: string, storage: Storage = localStorage,
  factory: IDBFactory | undefined = globalThis.indexedDB): Promise<JournalRecovery[]> {
  const root = personalJournalKey({ userId, namespace: 'personal' });
  const owner = encodeURIComponent(userId);
  const copies: JournalRecovery[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    const windowDraft = key?.includes(':recovery:window-') &&
      (key.startsWith(`study-space:personal:${owner}:`) || key.startsWith(`study-space:personal:draft:quick-memo:${owner}:`) || key.startsWith(`study-space:personal:draft:topic-recall:${owner}:`));
    if (!key || key === currentKey || (!windowDraft && key !== root && !key.startsWith(`${root}:window:`))) continue;
    const raw = storage.getItem(key);
    if (raw !== null) copies.push({ key, raw, savedAt: new Date().toISOString() });
  }
  if (factory) {
    // Read the DB directly; opening a journal adapter could prefer a newer
    // legacy value and hide a differing durable original or recovery copy.
    const rows = await readPersonalJournalRows(userId, factory);
    for (const row of rows) {
      if (row.store === 'journals') copies.push({ key: row.key,
        raw: typeof row.value === 'string' ? row.value : JSON.stringify(row.value), savedAt: new Date().toISOString() });
      else {
        const recovery = row.value as Partial<JournalRecovery>;
        copies.push({ key: recovery.key!, raw: typeof recovery.raw === 'string' ? recovery.raw : JSON.stringify(row.value),
          savedAt: typeof recovery.savedAt === 'string' ? recovery.savedAt : new Date().toISOString() });
      }
    }
  }
  return copies;
}
