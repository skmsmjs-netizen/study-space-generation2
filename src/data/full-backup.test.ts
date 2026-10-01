// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { checkFullBackup, createFullBackup, restoreFullBackup, stageFullBackup, recoverInterruptedBackup, priorRestoreBackups, clearBackupCopiesForOwner, type BackupEnvironment } from './full-backup';
import { DemoRepository, DEMO_KEY } from './demo-repository';
import { PersonalRepository } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { emptyState } from '../domain/model';
import { keepAudio, keepRecordingChunk, writeMaterialDraft, readMaterialDraft, readAudio, recoverRecording, clearMaterialFilesForOwner } from './material-files';
import { decodeStoredText } from './storage-codec';

class MemoryStorage implements Storage {
  values = new Map<string, string>(); failOnce = '';
  get length() { return this.values.size; }
  key(i: number) { return [...this.values.keys()][i] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { if (key === this.failOnce) { this.failOnce = ''; throw new DOMException('full', 'QuotaExceededError'); } this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
function env(): BackupEnvironment { return { local: new MemoryStorage(), session: new MemoryStorage(), factory: new IDBFactory() }; }
function source(e: BackupEnvironment) {
  const repo = new DemoRepository(e.local), owner = repo.getSnapshot();
  repo.execute({ type: 'saveRecords', sessionId: 'backup-session', dateEvidence: { kind: 'unknown' }, entries: [{ targetId: 'demo-topic-function', done: false, body: '  한글 원문\n조건·예외\ud800  ' }], opId: 'backup-op', at: '2026-10-01T04:00:00Z', userId: owner.userId });
  e.local.setItem('study-space:demo:draft:form', '  미완 초안\n\udfff ');
  e.session.setItem('study-space:demo:context:theme', 'dark');
  e.local.setItem('study-space:auth:v1', 'PRIVATE LOGIN');
  e.local.setItem('study-space:personal:other:online:v1', 'OTHER ACCOUNT');
  return owner;
}
afterEach(() => vi.unstubAllGlobals());
it('round trips exact records, raw UTF16 drafts, settings, original bytes and unfinished recording to clean storage without credentials or another owner', async () => {
  const first = env(), owner = source(first); vi.stubGlobal('indexedDB', first.factory); vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  const audio = await keepAudio(owner, new File(['원본 음성'], '원본.wav', { type: 'audio/wav' }));
  const draft = { content: { title: '미완 강의', subjectId: 'demo-subject-math', topicId: null, sourceText: '  필기 원문\n', audio, results: [] }, baseVersion: 0, updatedAt: '2026-10-01T04:00:00Z' };
  await writeMaterialDraft(owner, 'draft', draft); await keepRecordingChunk(owner, 'unfinished', 0, new Blob(['첫 조각'], { type: 'audio/webm' }));
  const checked = await checkFullBackup(await createFullBackup(owner, first), owner), second = env();
  await restoreFullBackup(checked, owner, second); vi.stubGlobal('indexedDB', second.factory);
  expect(second.local.getItem(DEMO_KEY)).toBe(first.local.getItem(DEMO_KEY));
  expect(second.local.getItem('study-space:demo:draft:form')).toBe('  미완 초안\n\udfff ');
  expect(second.session.getItem('study-space:demo:context:theme')).toBe('dark');
  expect(second.local.getItem('study-space:auth:v1')).toBeNull(); expect(second.local.getItem('study-space:personal:other:online:v1')).toBeNull();
  expect(await readMaterialDraft(owner, 'draft')).toEqual(draft); expect(await (await readAudio(owner, audio))!.text()).toBe('원본 음성'); expect(await (await recoverRecording(owner, 'unfinished'))!.text()).toBe('첫 조각');
  expect(new DemoRepository(second.local).getSnapshot().records[0].done).toBe(false);
});
it('rejects corrupted bytes and foreign ownership before any restoration', async () => {
  const first = env(), owner = source(first), bytes = await createFullBackup(owner, first);
  await expect(checkFullBackup(bytes, { ...owner, userId: 'other' })).rejects.toThrow('계정');
  const files = unzipSync(bytes), manifest = JSON.parse(strFromU8(files['manifest.json'])); files[manifest.entries[0].path] = strToU8('changed original');
  await expect(checkFullBackup(zipSync(files), owner)).rejects.toThrow('지문');
  expect(first.local.getItem('study-space:demo:draft:form')).toBe('  미완 초안\n\udfff ');
});
it('retains existing extras, avoids duplicate records on a retry and offers the pre-restore originals as a portable backup', async () => {
  const first = env(), owner = source(first), checked = await checkFullBackup(await createFullBackup(owner, first), owner), second = env();
  new DemoRepository(second.local); second.local.setItem('study-space:demo:draft:form', '현재 글'); second.local.setItem('study-space:demo:extra', '다른 기존 내용');
  await restoreFullBackup(checked, owner, second); await restoreFullBackup(checked, owner, second);
  expect(new DemoRepository(second.local).getSnapshot().records).toHaveLength(1); expect(second.local.getItem('study-space:demo:extra')).toBe('다른 기존 내용');
  const prior = await priorRestoreBackups(owner, second); expect(prior).toHaveLength(2);
  const old = await Promise.all(prior.map(row => row.file.arrayBuffer().then(bytes => checkFullBackup(new Uint8Array(bytes), owner))));
  expect(old.some(backup => backup.rows.some(row => row.key === 'study-space:demo:draft:form' && row.value === '현재 글'))).toBe(true);
});
it('rolls back file/draft and local changes after quota failure, keeping a pre-restore copy', async () => {
  const first = env(), owner = source(first), checked = await checkFullBackup(await createFullBackup(owner, first), owner), second = env();
  new DemoRepository(second.local); second.local.setItem('study-space:demo:draft:form', '복원 전 초안');
  const original = [...(second.local as MemoryStorage).values]; (second.local as MemoryStorage).failOnce = 'study-space:demo:draft:form';
  await expect(restoreFullBackup(checked, owner, second)).rejects.toThrow('되돌렸습니다');
  expect([...(second.local as MemoryStorage).values]).toEqual(original); expect(await recoverInterruptedBackup(second)).toBe(false); expect(await priorRestoreBackups(owner, second)).toHaveLength(1);
});
it('recovers a restore interrupted between IndexedDB and localStorage before opening the app', async () => {
  const first = env(), owner = source(first), checked = await checkFullBackup(await createFullBackup(owner, first), owner), second = env();
  new DemoRepository(second.local); second.local.setItem('study-space:demo:draft:form', '중단 전 원문'); const original = second.local.getItem(DEMO_KEY);
  const id = await restoreFullBackup(checked, owner, second);
  const db = await new Promise<IDBDatabase>(resolve => { const request = second.factory.open('study-space-backups', 1); request.onsuccess = () => resolve(request.result); });
  await new Promise<void>(resolve => { const tx = db.transaction(['restores', 'pending'], 'readwrite'), get = tx.objectStore('restores').get(id); get.onsuccess = () => tx.objectStore('pending').put(get.result, 'active'); tx.oncomplete = () => resolve(); }); db.close();
  expect(await recoverInterruptedBackup(second)).toBe(true); expect(second.local.getItem(DEMO_KEY)).toBe(original); expect(second.local.getItem('study-space:demo:draft:form')).toBe('중단 전 원문'); expect(await recoverInterruptedBackup(second)).toBe(false);
});
it('does not claim a complete backup when original bytes referenced by a draft are missing', async () => {
  const first = env(), owner = source(first); vi.stubGlobal('indexedDB', first.factory);
  const audio = await keepAudio(owner, new File(['file'], '필요.wav', { type: 'audio/wav' }));
  await clearMaterialFilesForOwner(owner, first.factory);
  await writeMaterialDraft(owner, 'draft', { content: { title: '', subjectId: 'demo-subject-math', topicId: null, sourceText: '', audio, results: [] }, baseVersion: 0, updatedAt: '2026-10-01T04:00:00Z' });
  await expect(createFullBackup(owner, first)).rejects.toThrow('원본');
});
it('stages an explicit restore without changing records, refuses a live writer, and applies it on a clean reopen', async () => {
  const first = env(), owner = source(first), checked = await checkFullBackup(await createFullBackup(owner, first), owner), second = env();
  new DemoRepository(second.local); const original = second.local.getItem(DEMO_KEY);
  await stageFullBackup(checked, owner, second); expect(second.local.getItem(DEMO_KEY)).toBe(original);
  vi.stubGlobal('navigator', { locks: { request: async (_name: string, _options: unknown, callback: (lock: null) => unknown) => callback(null) } });
  await expect(recoverInterruptedBackup(second)).rejects.toThrow('다른 공부 창'); expect(second.local.getItem(DEMO_KEY)).toBe(original);
  vi.unstubAllGlobals(); expect(await recoverInterruptedBackup(second)).toBe(true); expect(second.local.getItem(DEMO_KEY)).toBe(first.local.getItem(DEMO_KEY)); expect(await recoverInterruptedBackup(second)).toBe(false);
});
it('preserves a personal backup differing from the server as a conflict and never sends it automatically', async () => {
  const e = env(), data = emptyState('owner', 'personal'), firstServer = { sequence: 0, data }, send = vi.fn();
  const repository = new PersonalRepository(e.local, { load: async () => firstServer, execute: send }, firstServer);
  const checked = await checkFullBackup(await createFullBackup(data, e), data), target = env(); await restoreFullBackup(checked, data, target);
  const different = { sequence: 1, data: applyCommand(data, { type: 'addSubject', id: 'server-subject', name: '서버 과목', scope: { kind: 'independent' }, opId: 'server-op', at: '2026-10-01T04:00:00Z', userId: data.userId, namespace: 'personal' }) };
  const opened = new PersonalRepository(target.local, { load: async () => different, execute: send }, different);
  expect(opened.getStatus().phase).toBe('conflict'); expect(opened.getSnapshot()).toEqual(repository.getSnapshot()); await opened.flush(); expect(send).not.toHaveBeenCalled();
  expect(JSON.parse(decodeStoredText(target.local.getItem('study-space:personal:owner:online:v1')!)).restoredBackup).toBe(true);
  await clearBackupCopiesForOwner('another', target.factory); expect(await priorRestoreBackups(data, target)).toHaveLength(1);
  await clearBackupCopiesForOwner('owner', target.factory); expect(await priorRestoreBackups(data, target)).toHaveLength(0);
});
