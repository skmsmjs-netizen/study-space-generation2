import { zip, unzip, strToU8, strFromU8 } from 'fflate';
import type { AppState } from '../domain/model';
import { applyCommand, validateState } from '../domain/commands';
import { storagePrefix } from './repository';
import { decodeStoredText, encodeStoredText } from './storage-codec';
import { readRescuedDraft, rescuedDraftEntries, clearRescuedDraft } from './draft-safety';
import { encodeBinary, decodeBinary } from './binary-storage';

export type BackupOwner = Pick<AppState, 'namespace' | 'userId'>;
type Area = 'local' | 'session' | 'materials' | 'journals';
export interface BackupRow { area: Area; store: string; key: string; value: unknown }
interface Entry { area: Area; store: string; key: string; path: string; kind: 'text' | 'json' | 'blob'; mime: string; size: number; sha256: string }
interface Manifest { format: 'study-space-full-backup'; version: 1; owner: BackupOwner; ledgerKey: string; createdAt: string; entries: Entry[] }
export interface CheckedBackup { manifest: Manifest; rows: BackupRow[]; bytes: Uint8Array; data: AppState }
interface RestoreJournal { id: string; owner: BackupOwner; before: BackupRow[]; after: BackupRow[]; previousBackup: Blob; createdAt: string }
interface RestorePlan { owner: BackupOwner; bytes: Uint8Array }
export interface BackupEnvironment { local: Storage; session: Storage; factory: IDBFactory }
const MAX_TOTAL = 512 * 1024 * 1024, MAX_ENTRIES = 20_000;
const DATABASES = { materials: ['study-space-material-files', ['files', 'drafts', 'recordings']], journals: ['study-space-personal-journals', ['journals', 'recovery']] } as const;
const BACKUP_DB = 'study-space-backups';
function fail(message: string): never { throw Error(message); }
const environment = (): BackupEnvironment => ({ local: localStorage, session: sessionStorage, factory: indexedDB });
export function ownsBackupKey(owner: BackupOwner, key: string): boolean {
  const encoded = encodeURIComponent(owner.userId), prefix = `${storagePrefix(owner)}:`;
  if (key.startsWith('study-space:draft-archive-metadata:v1:')) return ownsBackupKey(owner, key.slice('study-space:draft-archive-metadata:v1:'.length));
  return key.startsWith(prefix) || key.startsWith(`study-space:${owner.namespace}:${encoded}:`) ||
    key.startsWith(`study-space:${owner.namespace}:draft:quick-memo:${encoded}:`) ||
    key === `study-space:${owner.namespace}:draft:topic-recall:${encoded}` ||
    key === `study-space:${owner.namespace}:recommendations:${owner.userId}:v1`;
}
function ownsRow(owner: BackupOwner, row: Pick<BackupRow, 'area' | 'store' | 'key'>, value?: unknown) {
  if (!['local', 'session', 'materials', 'journals'].includes(row.area) || typeof row.key !== 'string') return false;
  if (row.area === 'local' || row.area === 'session') return row.store === '' && ownsBackupKey(owner, row.key) && !row.key.endsWith(':writer');
  if (!DATABASES[row.area][1].some(name => name === row.store)) return false;
  if (row.area === 'materials') return row.key.startsWith(`${storagePrefix(owner)}:material:`);
  const root = `${storagePrefix(owner)}:online:v1`;
  const journalKey = (key: unknown) => typeof key === 'string' && (key === root || key.startsWith(`${root}:window:`));
  if (row.store === 'journals') return journalKey(row.key);
  return Boolean(value && typeof value === 'object' && 'key' in value && journalKey((value as { key: unknown }).key));
}
function openDB(factory: IDBFactory, name: string, stores: readonly string[]): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = factory.open(name, 1);
    let blocked = false;
    request.onupgradeneeded = () => { for (const store of stores) if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store); };
    request.onsuccess = () => { if (blocked) request.result.close(); else { request.result.onversionchange = () => request.result.close(); resolve(request.result); } };
    request.onerror = () => reject(request.error);
    request.onblocked = () => { blocked = true; reject(Error('다른 공부 창을 마친 뒤 다시 시도해 주세요. 기존 자료는 유지했습니다.')); };
  });
}
async function rowsInDB(env: BackupEnvironment, area: 'materials' | 'journals', owner: BackupOwner): Promise<BackupRow[]> {
  const [name, stores] = DATABASES[area], db = await openDB(env.factory, name, stores);
  try { return await new Promise((resolve, reject) => {
    const rows: BackupRow[] = [], tx = db.transaction([...stores], 'readonly');
    for (const store of stores) {
      const request = tx.objectStore(store).openCursor();
      request.onsuccess = () => { const cursor = request.result; if (!cursor) return; const row = { area, store, key: String(cursor.key), value: decodeBinary(cursor.value) };
        if (ownsRow(owner, row, row.value)) rows.push(row); cursor.continue(); };
    }
    tx.oncomplete = () => resolve(rows); tx.onabort = () => reject(tx.error); tx.onerror = () => {};
  }); } finally { db.close(); }
}
function storageRows(storage: Storage, owner: BackupOwner, area: 'local' | 'session'): BackupRow[] {
  const rows: BackupRow[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i); if (key === null) fail('보관 자료 목록이 바뀌었습니다. 다시 백업해 주세요.');
    if (!ownsRow(owner, { area, store: '', key })) continue;
    // Backups preserve device originals and each explicit window-copy key.
    // A view's empty foreign-window marker is never a saved original.
    const value = area === 'local' ? readRescuedDraft(key, { scope: 'device' }) ?? storage.getItem(key) : storage.getItem(key);
    if (value === null) fail('보관 자료가 바뀌었습니다. 다시 백업해 주세요.'); rows.push({ area, store: '', key, value });
  }
  if (area === 'local') for (const [key, value] of rescuedDraftEntries()) if (ownsBackupKey(owner, key) && !rows.some(row => row.key === key)) rows.push({ area, store: '', key, value });
  return rows;
}
async function collect(owner: BackupOwner, env: BackupEnvironment) {
  return [...storageRows(env.local, owner, 'local'), ...storageRows(env.session, owner, 'session'), ...await rowsInDB(env, 'materials', owner), ...await rowsInDB(env, 'journals', owner)];
}
const identity = (row: Pick<BackupRow, 'area' | 'store' | 'key'>) => JSON.stringify([row.area, row.store, row.key]);
async function hash(bytes: Uint8Array) { return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes.slice().buffer))].map(x => x.toString(16).padStart(2, '0')).join(''); }
async function rowBytes(row: BackupRow): Promise<Uint8Array> { return row.value instanceof Blob ? new Uint8Array(await row.value.arrayBuffer()) : strToU8(JSON.stringify(row.value)); }
function defaultLedgerKey(owner: BackupOwner) { return owner.namespace === 'demo' ? 'study-space:demo:v1' : `${storagePrefix(owner)}:online:v1`; }
function ledger(rows: BackupRow[], owner: BackupOwner, key = defaultLedgerKey(owner)): AppState {
  if (key !== defaultLedgerKey(owner) && (owner.namespace === 'demo' || !key.startsWith(`${defaultLedgerKey(owner)}:window:`))) fail('이 공간의 공부 원장 키가 아닙니다.');
  const value = rows.find(row => row.area === 'local' && row.key === key)?.value;
  if (typeof value !== 'string') fail('공부 원장이 없는 파일입니다. 전체 백업 파일을 골라 주세요.');
  const envelope = JSON.parse(decodeStoredText(value)), data = owner.namespace === 'demo' ? envelope.data : envelope.local;
  validateState(data);
  if (data.userId !== owner.userId || data.namespace !== owner.namespace) fail('이 계정·공간의 백업이 아닙니다. 원래 계정에서 열어 주세요.');
  if (owner.namespace === 'demo') { if (!Number.isSafeInteger(envelope.sequence) || envelope.sequence < 0) fail('공부 원장의 순서를 확인하지 못했습니다.'); }
  else {
    if (envelope.format !== 1 || !Array.isArray(envelope.pending) || !Array.isArray(envelope.archives)) fail('공부 보관본 형식을 확인하지 못했습니다.');
    validateState(envelope.base?.data);
    if (envelope.base.data.userId !== owner.userId || envelope.base.data.namespace !== owner.namespace || !Number.isSafeInteger(envelope.base.sequence) || envelope.base.sequence < 0) fail('공부 보관본의 소유자를 확인하지 못했습니다.');
    const replay = envelope.pending.reduce((state: AppState, command: Parameters<typeof applyCommand>[1]) => applyCommand(state, command), envelope.base.data);
    if (JSON.stringify(replay) !== JSON.stringify(data)) fail('미전송 기록과 원장의 내용이 일치하지 않습니다. 원본을 유지했습니다.');
  }
  return data;
}
function sourceReferences(rows: BackupRow[], data: AppState) {
  const refs = new Map<string, { key: string; name: string; size: number; sha256: string }>();
  function visit(value: unknown, depth = 0) {
    if (depth > 100) fail('자료 참조가 너무 깊어 전체 백업을 확인하지 못했습니다.');
    if (!value || typeof value !== 'object' || value instanceof Blob) return;
    if ('key' in value && 'sha256' in value && 'size' in value) {
      const ref = value as { key: string; name: string; size: number; sha256: string };
      if (typeof ref.key === 'string' && ref.key.includes(':material:')) refs.set(ref.key, ref);
    }
    for (const nested of Object.values(value)) visit(nested, depth + 1);
  }
  visit(data);
  for (const row of rows) {
    if (row.area === 'materials' && row.store === 'drafts') visit(row.value);
    if ((row.area === 'local' || row.area === 'journals') && typeof row.value === 'string') {
      let parsed: unknown; try { parsed = JSON.parse(decodeStoredText(row.value)); } catch { continue; }
      visit(parsed);
    }
  }
  return [...refs.values()];
}
async function verifySources(rows: BackupRow[], data: AppState, owner: BackupOwner) {
  for (const ref of sourceReferences(rows, data)) {
    if (!ref.key.startsWith(`${storagePrefix(owner)}:material:`)) fail('다른 계정·공간의 첨부를 참조하고 있습니다.');
    const blob = rows.find(row => row.area === 'materials' && row.store === 'files' && row.key === ref.key)?.value;
    if (!(blob instanceof Blob)) fail(`‘${ref.name}’ 원본이 이 기기에 없습니다. 강의 자료에서 원본을 연 뒤 다시 백업해 주세요.`);
    if (blob.size !== ref.size || await hash(new Uint8Array(await blob.arrayBuffer())) !== ref.sha256) fail('첨부 원본과 자료 참조의 크기·지문이 일치하지 않습니다.');
  }
}
async function pack(owner: BackupOwner, rows: BackupRow[], ledgerKey = defaultLedgerKey(owner)): Promise<Uint8Array> {
  if (rows.length > MAX_ENTRIES) fail('보관 항목이 한 파일의 한도를 넘었습니다. 원본은 유지했습니다.');
  const files: Record<string, Uint8Array> = {}, entries: Entry[] = []; let total = 0;
  for (const [i, row] of rows.entries()) {
    const bytes = await rowBytes(row); total += bytes.length;
    if (total > MAX_TOTAL) fail('백업 내용이 512MB를 넘습니다. 기존 자료는 유지했습니다.');
    const path = `data/${i}`, kind = row.value instanceof Blob ? 'blob' : typeof row.value === 'string' ? 'text' : 'json';
    entries.push({ area: row.area, store: row.store, key: row.key, path, kind, mime: row.value instanceof Blob ? row.value.type : '', size: bytes.length, sha256: await hash(bytes) }); files[path] = bytes;
  }
  const manifest: Manifest = { format: 'study-space-full-backup', version: 1, owner, ledgerKey, createdAt: new Date().toISOString(), entries };
  files['manifest.json'] = strToU8(JSON.stringify(manifest));
  return new Promise((resolve, reject) => zip(files, { level: 1 }, (error, bytes) => error ? reject(error) : resolve(bytes)));
}
export async function createFullBackup(owner: BackupOwner, env = environment(), ledgerKey = defaultLedgerKey(owner)): Promise<Uint8Array> {
  const rows = await collect(owner, env), data = ledger(rows, owner, ledgerKey);
  // Never label an archive complete when a referenced source exists only remotely.
  await verifySources(rows, data, owner);
  const bytes = await pack(owner, rows, ledgerKey);
  // Check durable inputs again after hashing/compression; a sync cannot silently mix two versions.
  // Capture session view preferences without treating scroll/focus changes as edits.
  const latest = (await collect(owner, env)).filter(row => row.area !== 'session');
  const durable = rows.filter(row => row.area !== 'session');
  if (latest.length !== durable.length) fail('백업 중 자료 목록이 바뀌었습니다. 다시 백업해 주세요.');
  const current = new Map(latest.map(row => [identity(row), row]));
  for (const row of durable) {
    const next = current.get(identity(row));
    if (!next || await hash(await rowBytes(next)) !== await hash(await rowBytes(row))) fail('백업 중 공부 자료가 바뀌었습니다. 다시 백업해 주세요.');
  }
  return bytes;
}
export async function checkFullBackup(bytes: Uint8Array, owner: BackupOwner): Promise<CheckedBackup> {
  if (bytes.byteLength > MAX_TOTAL) fail('백업 파일이 512MB를 넘습니다.');
  let declared = 0, count = 0, excessive = false; const zipNames = new Set<string>();
  const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => unzip(bytes, { filter: entry => {
    declared += entry.originalSize; count++;
    if (zipNames.has(entry.name) || !/^(manifest\.json|data\/\d+)$/.test(entry.name) || declared > MAX_TOTAL || count > MAX_ENTRIES + 1 || entry.originalSize > MAX_TOTAL) { excessive = true; return false; }
    zipNames.add(entry.name); return true;
  } }, (error, result) => error ? reject(Error('백업 압축 파일을 읽지 못했습니다. 원본은 변경하지 않았습니다.')) : resolve(result)));
  if (excessive || !files['manifest.json']) fail('백업 크기·구성을 확인하지 못했습니다.');
  const manifest: Manifest = JSON.parse(strFromU8(files['manifest.json']));
  if (manifest.format !== 'study-space-full-backup' || manifest.version !== 1 || typeof manifest.ledgerKey !== 'string' || !Array.isArray(manifest.entries) || manifest.entries.length > MAX_ENTRIES || !Number.isFinite(Date.parse(manifest.createdAt))) fail('지원하는 전체 백업 형식이 아닙니다.');
  if (manifest.owner?.userId !== owner.userId || manifest.owner?.namespace !== owner.namespace) fail('이 계정·공간의 백업이 아닙니다. 원래 계정에서 열어 주세요.');
  const rows: BackupRow[] = [], identities = new Set<string>(), paths = new Set<string>();
  for (const entry of manifest.entries) {
    if (typeof entry.path !== 'string' || !/^data\/\d+$/.test(entry.path) || paths.has(entry.path) || identities.has(identity(entry)) || !['text', 'json', 'blob'].includes(entry.kind)) fail('중복되거나 알 수 없는 백업 항목입니다.');
    const payload = files[entry.path];
    if (!payload || payload.length !== entry.size || await hash(payload) !== entry.sha256) fail('백업 내용의 크기·지문이 일치하지 않습니다. 자료는 변경하지 않았습니다.');
    const value: unknown = entry.kind === 'blob' ? new Blob([payload.slice().buffer], { type: entry.mime }) : JSON.parse(strFromU8(payload));
    if (!ownsRow(owner, entry, value) || (entry.area === 'local' || entry.area === 'session') && typeof value !== 'string') fail('다른 공간 또는 허용하지 않은 저장 항목입니다.');
    if (entry.area === 'materials' && entry.store !== 'files' && entry.store !== 'recordings' && entry.kind !== 'json') fail('자료 초안 형식을 확인하지 못했습니다.');
    rows.push({ area: entry.area, store: entry.store, key: entry.key, value }); paths.add(entry.path); identities.add(identity(entry));
  }
  if (Object.keys(files).length !== paths.size + 1) fail('목록에 없는 백업 내용이 있습니다.');
  const data = ledger(rows, owner, manifest.ledgerKey);
  await verifySources(rows, data, owner);
  // File identity must be checked independently of the ZIP manifest.
  for (const row of rows) if (row.area === 'materials' && row.store === 'files') {
    if (!(row.value instanceof Blob)) fail('첨부 원본을 읽지 못했습니다.');
    const contentHash = await hash(await rowBytes(row));
    if (![`${storagePrefix(owner)}:material:audio%3A${contentHash}`, `${storagePrefix(owner)}:material:document%3A${contentHash}`].includes(row.key)) fail('첨부 원본의 지문과 참조가 일치하지 않습니다.');
  }
  return { manifest, rows, bytes: bytes.slice(), data };
}
async function writeRows(rows: BackupRow[], env: BackupEnvironment) {
  for (const area of ['materials', 'journals'] as const) {
    const selected = rows.filter(row => row.area === area); if (!selected.length) continue;
    const durable = await Promise.all(selected.map(async row => ({ ...row, value: await encodeBinary(row.value) })));
    const [name, stores] = DATABASES[area], db = await openDB(env.factory, name, stores);
    try { await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([...stores], 'readwrite');
      for (const row of durable) { const store = tx.objectStore(row.store); if (row.value === undefined) store.delete(row.key); else store.put(row.value, row.key); }
      tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); tx.onerror = () => {};
    }); } finally { db.close(); }
  }
  for (const row of rows.filter(row => row.area === 'local' || row.area === 'session')) {
    const store = row.area === 'local' ? env.local : env.session;
    if (row.value === undefined) store.removeItem(row.key); else store.setItem(row.key, row.value as string);
  }
}
async function backupStore<T>(env: BackupEnvironment, store: 'pending' | 'restores', mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDB(env.factory, BACKUP_DB, ['pending', 'restores']);
  try { return await new Promise((resolve, reject) => {
    const tx = db.transaction(store, mode), request = fn(tx.objectStore(store)); let result: T;
    request.onsuccess = () => { result = decodeBinary<T>(request.result); }; tx.oncomplete = () => resolve(result); tx.onabort = () => reject(tx.error); tx.onerror = () => {};
  }); } finally { db.close(); }
}
export async function restoreFullBackup(checked: CheckedBackup, owner: BackupOwner, env = environment()) {
  if (await backupStore(env, 'pending', 'readonly', store => store.get('active'))) fail('앞선 복원의 복구가 남아 있습니다. 다시 열어 기존 자료 복구를 먼저 마쳐 주세요.');
  // Revalidate even when called outside the review screen; files and owner cannot be swapped.
  const fresh = await checkFullBackup(checked.bytes, owner), previousRows = await collect(owner, env);
  const after = fresh.rows.map(row => {
    if (owner.namespace !== 'demo' && (row.area === 'local' || row.area === 'journals') && (row.key === `${storagePrefix(owner)}:online:v1` || row.key.startsWith(`${storagePrefix(owner)}:online:v1:window:`)) && typeof row.value === 'string') {
      try {
        const envelope = JSON.parse(decodeStoredText(row.value));
        if (envelope.format !== 1 || !envelope.local) return row; // Keep damaged foreign-window originals verbatim.
        envelope.restoredBackup = true; return { ...row, value: encodeStoredText(JSON.stringify(envelope)) };
      } catch { return row; }
    }
    return row;
  });
  const before = after.map(row => {
    if (row.area === 'local' || row.area === 'session') return { ...row, value: (row.area === 'local' ? env.local : env.session).getItem(row.key) ?? undefined };
    return previousRows.find(previous => identity(previous) === identity(row)) ?? { ...row, value: undefined };
  });
  const previousKey = previousRows.find(row => row.area === 'session' && row.key === `${storagePrefix(owner)}:online:v1:current-window`)?.value;
  const id = crypto.randomUUID(), journal: RestoreJournal = { id, owner, before, after, previousBackup: new Blob([(await pack(owner, previousRows, typeof previousKey === 'string' ? previousKey : defaultLedgerKey(owner))).slice().buffer], { type: 'application/zip' }), createdAt: new Date().toISOString() };
  const durableJournal = await encodeBinary(journal);
  await backupStore(env, 'restores', 'readwrite', store => store.put(durableJournal, id));
  await backupStore(env, 'pending', 'readwrite', store => store.put(durableJournal, 'active'));
  try { await writeRows(after, env); await backupStore(env, 'pending', 'readwrite', store => store.delete('active')); for (const row of after) if (row.area === 'local') clearRescuedDraft(row.key); }
  catch { try { await writeRows(before, env); await backupStore(env, 'pending', 'readwrite', store => store.delete('active')); } catch { fail('복원을 마치지 못했습니다. 복원 전 사본을 보관했습니다. 다른 창을 닫고 다시 열면 기존 자료 복구를 이어갑니다.'); }
    fail('복원에 실패해 기존 자료로 되돌렸습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요.'); }
  return id;
}
/** Run before any repository starts: interrupted cross-store restores roll back. */
export async function stageFullBackup(checked: CheckedBackup, owner: BackupOwner, env = environment()) {
  const fresh = await checkFullBackup(checked.bytes, owner);
  if (await backupStore(env, 'pending', 'readonly', store => store.get('active')) || await backupStore(env, 'pending', 'readonly', store => store.get('planned'))) fail('앞선 복원이 남아 있습니다. 다시 열어 복구를 마쳐 주세요.');
  await backupStore(env, 'pending', 'readwrite', store => store.put({ owner, bytes: fresh.bytes }, 'planned'));
}
export async function cancelPlannedBackup(env = environment()) { await backupStore(env, 'pending', 'readwrite', store => store.delete('planned')); }
export async function recoverInterruptedBackup(env = environment()) {
  const journal = await backupStore<RestoreJournal | undefined>(env, 'pending', 'readonly', store => store.get('active'));
  const plan = await backupStore<RestorePlan | undefined>(env, 'pending', 'readonly', store => store.get('planned'));
  if (!journal && !plan) return false;
  const active = journal ?? plan; if (!active) return false;
  const owner = active.owner;
  const recover = async () => {
    if (journal) {
      await writeRows(journal.before, env); await backupStore(env, 'pending', 'readwrite', store => store.delete('active'));
      // An interrupted apply always restores originals first. A retry is a new explicit choice.
      if (plan) await cancelPlannedBackup(env);
    } else if (plan) {
      const checked = await checkFullBackup(plan.bytes, plan.owner);
      await restoreFullBackup(checked, plan.owner, env);
      await cancelPlannedBackup(env);
    }
  };
  if (typeof navigator !== 'undefined' && navigator.locks) {
    const lockName = owner.namespace === 'demo' ? 'study-space:demo:writer' : `study-space:personal:${owner.userId}:sessions`;
    await navigator.locks.request(lockName, { ifAvailable: true }, async lock => {
      if (!lock) fail('다른 공부 창을 마친 뒤 다시 열어 복원 전 자료를 복구해 주세요.');
      if (owner.namespace !== 'demo') await navigator.locks.request(`study-space:personal:${owner.userId}:writer`, { ifAvailable: true }, async legacyLock => {
        if (!legacyLock) fail('다른 공부 창을 마친 뒤 다시 열어 복원해 주세요.');
        await recover();
      });
      else await recover();
    });
  } else await recover();
  return true;
}
export async function priorRestoreBackups(owner: BackupOwner, env = environment()): Promise<Array<{ id: string; createdAt: string; file: Blob }>> {
  const rows = await backupStore<RestoreJournal[]>(env, 'restores', 'readonly', store => store.getAll());
  return rows.filter(row => row.owner.userId === owner.userId && row.owner.namespace === owner.namespace).map(row => ({ id: row.id, createdAt: row.createdAt, file: row.previousBackup })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function clearBackupCopiesForOwner(userId: string, factory: IDBFactory) {
  const db = await openDB(factory, BACKUP_DB, ['pending', 'restores']);
  try { await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(['pending', 'restores'], 'readwrite');
    for (const name of ['pending', 'restores']) {
      const request = tx.objectStore(name).openCursor();
      request.onsuccess = () => { const cursor = request.result; if (!cursor) return; if (cursor.value.owner?.userId === userId && ['personal', 'test'].includes(cursor.value.owner?.namespace)) cursor.delete(); cursor.continue(); };
    }
    tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); tx.onerror = () => {};
  }); } finally { db.close(); }
}
