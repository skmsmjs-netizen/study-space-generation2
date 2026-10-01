import { personalJournalKey, readCachedPersonalSnapshot, type JournalRecovery } from './personal-repository';
import { decodeStoredText } from './storage-codec';
import type { ServerSnapshot } from '../server/command-handler';
import { IndexedPersonalJournal } from './indexed-personal-journal';
import { registerPersonalDraftWindow } from './personal-draft-window';

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
  const candidates: string[] = [];
  if (previous?.startsWith(prefix)) candidates.push(previous);
  // A new visit can resume an abandoned outbox, but never writes into a live one.
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(prefix) || candidates.includes(key)) continue;
    try {
      const raw = storage.getItem(key);
      if (raw) {
        readCachedPersonalSnapshot(storage, userId, key);
        if (JSON.parse(decodeStoredText(raw)).pending?.length) candidates.splice(previous ? 1 : 0, 0, key);
        else candidates.push(key);
      }
    } catch { /* Preserve damaged originals; they remain in the recovery export. */ }
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
      // Copy legacy input once without changing the legacy key or the old tab.
      // Its operation IDs still deduplicate a lost acknowledgement on the server.
      if (storage.getItem(key) === null) {
        let legacy = storage.getItem(root);
        if (factory) {
          // A tab reload must also recover its IndexedDB-only copy. Read the
          // old journal without publishing or rewriting either original.
          const oldKey = key === previous ? key : root;
          const oldJournal = await IndexedPersonalJournal.open(storage, oldKey, factory);
          try { legacy = oldJournal.getItem(oldKey) ?? legacy; } finally { oldJournal.close(); }
        }
        if (legacy !== null) {
          readCachedPersonalSnapshot({ getItem: () => legacy }, userId, root);
          storage.setItem(key, legacy);
        }
      }
      let cached = readCachedPersonalSnapshot(storage, userId, key);
      // For a new/clean window, use the highest acknowledged server sequence on
      // this device. Foreign unacknowledged text stays in its original journal.
      for (let index = 0; index < storage.length; index++) {
        const other = storage.key(index);
        if (!other?.startsWith(prefix) || other === key) continue;
        try {
          const snapshot = readCachedPersonalSnapshot(storage, userId, other);
          if (snapshot && (!cached || snapshot.sequence > cached.sequence)) cached = snapshot;
        } catch { /* Do not erase or automatically apply another window's invalid copy. */ }
      }
      try { session.setItem(sessionKey, key); } catch { /* Journal is durable independently. */ }
      const unregisterDrafts = registerPersonalDraftWindow(userId, key.slice(prefix.length));
      return { key, cached, release: async () => { unregisterDrafts(); finish(); await task; } };
    } catch (error) { finish(); await task; throw error; }
  }
  throw Error('이 창의 기록 저장소를 열지 못했습니다. 보관된 글은 그대로 남아 있습니다. 다시 시도해 주세요.');
}

/** Export only the authenticated owner's other journals, including damaged text. */
export function personalWindowCopies(userId: string, currentKey: string, storage: Storage = localStorage): JournalRecovery[] {
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
  return copies;
}
