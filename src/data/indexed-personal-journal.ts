import { isStorageQuotaError } from './storage-errors';
import { DomainError } from '../domain/model';
import { PersonalRepository, personalJournalKey, type OnlineTransport, type PersonalJournal, type JournalRecovery } from './personal-repository';
import type { ServerSnapshot } from '../server/command-handler';

const DATABASE = 'study-space-personal-journals';
const STORE = 'journals';
const RECOVERY = 'recovery';

/** Keep the existing synchronous journal; commit its exact envelope to IndexedDB
 * before transmitting. State and pending operations occupy the same DB record. */
export class IndexedPersonalJournal implements PersonalJournal {
  private desired: string | null = null;
  private flight: Promise<void> | null = null;
  private fallback: string | null;
  private preservePrevious: boolean;
  private indexedOnly = false;
  private legacyAtFallback: string | null = null;
  private constructor(private db: IDBDatabase, private storage: Pick<Storage, 'getItem' | 'setItem'>,
    private key: string, private committed: string | null, private recoveries: JournalRecovery[]) {
    const legacy = storage.getItem(key);
    this.fallback = legacy === null ? committed : null;
    this.indexedOnly = legacy === null && committed !== null;
    this.legacyAtFallback = legacy;
    this.preservePrevious = legacy !== null && committed !== null && legacy !== committed;
  }
  static async open(storage: Pick<Storage, 'getItem' | 'setItem'>, key: string, factory: IDBFactory = indexedDB) {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      let blocked = false;
      const request = factory.open(DATABASE, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE);
        request.result.createObjectStore(RECOVERY);
      };
      request.onsuccess = () => { if (blocked) request.result.close(); else resolve(request.result); };
      request.onerror = () => reject(request.error);
      request.onblocked = () => { blocked = true; reject(new Error('다른 창에서 기기 저장소를 사용 중입니다. 그 창을 마친 뒤 다시 열어 주세요.')); };
    });
    db.onversionchange = () => db.close();
    try {
      const [committed, recoveries] = await new Promise<[string | null, JournalRecovery[]]>((resolve, reject) => {
        const transaction = db.transaction([STORE, RECOVERY], 'readonly');
        const request = transaction.objectStore(STORE).get(key);
        const recoveryRequest = transaction.objectStore(RECOVERY).getAll();
        transaction.oncomplete = () => {
          if (request.result !== undefined && typeof request.result !== 'string') reject(new Error('이 기기의 보관 자료를 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.'));
          else resolve([request.result ?? null, recoveryRequest.result.filter((row: JournalRecovery) => row.key === key)]);
        };
        transaction.onabort = () => reject(transaction.error);
        transaction.onerror = () => { /* onabort reports the transaction failure. */ };
      });
      return new IndexedPersonalJournal(db, storage, key, committed, recoveries);
    } catch (error) { db.close(); throw error; }
  }
  getItem(key: string) {
    if (key !== this.key) throw new DomainError('OWNERSHIP', '이 공간의 저장 키가 아닙니다.');
    const legacy = this.storage.getItem(key);
    if (this.indexedOnly && legacy === this.legacyAtFallback) return this.fallback;
    return legacy ?? this.fallback;
  }
  setItem(key: string, value: string) {
    if (key !== this.key) throw new DomainError('OWNERSHIP', '이 공간의 저장 키가 아닙니다.');
    if (!this.indexedOnly) {
      try { this.storage.setItem(key, value); this.fallback = null; }
      catch (error) {
        if (!isStorageQuotaError(error)) throw error;
        this.legacyAtFallback = this.storage.getItem(key);
        this.indexedOnly = true;
      }
    }
    if (this.indexedOnly) this.fallback = value;
    this.desired = value;
    void this.flush().catch(() => { /* Repository reports errors and retries. */ });
  }
  flush(): Promise<void> {
    if (this.flight) return this.flight;
    this.flight = this.drain().finally(() => { this.flight = null; });
    return this.flight;
  }
  isDurable = () => this.desired === null || this.desired === this.committed;
  /** Only release a legacy slot after the complete original/outbox is committed. */
  async relocateLegacy() {
    const raw = this.storage.getItem(this.key);
    if (raw === null) return;
    this.indexedOnly = true; this.legacyAtFallback = raw;
    this.fallback = raw; this.desired = raw;
    await this.flush();
    this.releaseLegacySlot();
  }
  private releaseLegacySlot() {
    const storage = this.storage as Pick<Storage, 'getItem' | 'setItem'> & Partial<Pick<Storage, 'removeItem'>>;
    if (this.indexedOnly && this.legacyAtFallback !== null && storage.getItem(this.key) === this.legacyAtFallback) {
      // No awaits between comparison and removal; newer originals are never removed.
      storage.removeItem?.(this.key);
      this.legacyAtFallback = storage.getItem(this.key);
    }
  }
  getRecoveryCopies() { return this.recoveries.slice(); }
  private async drain() {
    while (this.desired !== null && this.desired !== this.committed) {
      const raw = this.desired;
      const recovery: JournalRecovery | null = this.preservePrevious && this.committed !== null
        ? { key: this.key, raw: this.committed, savedAt: new Date().toISOString() } : null;
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db.transaction([STORE, RECOVERY], 'readwrite');
        const store = transaction.objectStore(STORE);
        let failure: Error | null = null;
        const request = store.get(this.key);
        request.onsuccess = () => {
          if ((request.result ?? null) !== this.committed) {
            failure = new DomainError('STALE_PERSONAL', '다른 창에서 이 기기의 보관 자료가 바뀌었습니다. 원문은 두고 다시 열어 주세요.');
            transaction.abort(); return;
          }
          if (recovery) transaction.objectStore(RECOVERY).put(recovery, crypto.randomUUID());
          store.put(raw, this.key);
        };
        transaction.oncomplete = () => resolve();
        transaction.onabort = () => reject(failure ?? transaction.error ?? new Error('기기 보관을 마치지 못했습니다. 기존 저장 자료는 남아 있습니다.'));
        transaction.onerror = () => { /* Only completion acknowledges durability. */ };
      });
      this.committed = raw;
      if (recovery) this.recoveries.push(recovery);
      this.preservePrevious = false;
      this.releaseLegacySlot();
    }
  }
  close() { void this.flush().finally(() => this.db.close()).catch(() => {}); }
}

/** Discover this owner's DB-only outboxes as well as legacy localStorage keys. */
export async function indexedPersonalKeys(prefix: string, factory: IDBFactory | undefined = globalThis.indexedDB): Promise<string[]> {
  if (!factory) return [];
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open(DATABASE, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE); request.result.createObjectStore(RECOVERY); };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
  try { return await new Promise<string[]>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readonly'), request = transaction.objectStore(STORE).getAllKeys();
    transaction.oncomplete = () => resolve(request.result.filter((key): key is string => typeof key === 'string' && key.startsWith(prefix)));
    transaction.onabort = () => reject(transaction.error);
  }); } finally { db.close(); }
}

export async function openPersonalRepository(storage: Pick<Storage, 'getItem' | 'setItem'>, transport: OnlineTransport,
  server: ServerSnapshot, factory: IDBFactory | undefined = globalThis.indexedDB, cached = false, journalKey = personalJournalKey(server.data)) {
  if (!factory) return new PersonalRepository(storage, transport, server, cached, journalKey);
  const journal = await IndexedPersonalJournal.open(storage, journalKey, factory);
  try {
    const repository = new PersonalRepository(journal, transport, server, cached, journalKey);
    await journal.flush();
    return repository;
  } catch (error) { journal.close(); throw error; }
}
