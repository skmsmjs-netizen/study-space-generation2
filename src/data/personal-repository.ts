import { storageErrorText } from './storage-errors';
import { applyCommand, validateState } from '../domain/commands';
import { DomainError, type AppState, type Command } from '../domain/model';
import type { SaveStatus, StudyRepository } from './repository';
import type { ServerSnapshot } from '../server/command-handler';
import { encodeStoredText, decodeStoredText } from './storage-codec';
import type { ScheduleNotificationPort } from './schedule-notifications';
import type { CodeRemoteRunner } from './code-runner';
import { MAX_SYNC_BATCH, MAX_SYNC_BATCH_CHARS } from '../domain/sync-protocol';
import { recordRequestPerformance } from './request-performance';
export interface OnlineTransport { load(known?: ServerSnapshot): Promise<ServerSnapshot>; execute(command: Command, baseSequence: number): Promise<ServerSnapshot>; executeBatch?(commands: Command[], baseSequence: number): Promise<ServerSnapshot>; runCode?: CodeRemoteRunner; scheduleNotifications?:ScheduleNotificationPort }
export interface JournalRecovery { key: string; raw: string; savedAt: string }
export interface PersonalJournal extends Pick<Storage, 'getItem' | 'setItem'> { flush?(): Promise<void>; close?(): void; getRecoveryCopies?(): JournalRecovery[]; isDurable?(): boolean }
export const personalJournalKey = (data: Pick<AppState, 'namespace' | 'userId'>) => `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:online:v1`;
export interface PreservedConflict { base: ServerSnapshot; local: AppState; pending: Command[]; server: ServerSnapshot; savedAt: string }
interface LocalEnvelope { format: 1; base: ServerSnapshot; local: AppState; pending: Command[]; conflict?: ServerSnapshot; archives: PreservedConflict[]; restoredBackup?: boolean }
/** Read only this authenticated owner's cache; never treat it as a server acknowledgement. */
export function readCachedPersonalSnapshot(storage: Pick<Storage, 'getItem'>, userId: string, key = `study-space:personal:${encodeURIComponent(userId)}:online:v1`): ServerSnapshot | null {
  const raw = storage.getItem(key);
  if (raw === null) return null;
  try {
    const saved: LocalEnvelope = JSON.parse(decodeStoredText(raw));
    if (saved.format !== 1 || !Array.isArray(saved.pending) || !Array.isArray(saved.archives)) throw Error();
    validateState(saved.base.data);
    if (saved.base.data.userId !== userId || saved.base.data.namespace !== 'personal' || !Number.isSafeInteger(saved.base.sequence) || saved.base.sequence < 0) throw Error();
    return saved.base;
  } catch { throw new DomainError('CORRUPT_PERSONAL', '이 기기의 개인 자료를 읽지 못했습니다. 저장된 원문을 덮어쓰지 않았습니다.'); }
}
export class PersonalRepository implements StudyRepository {
  private envelope: LocalEnvelope;
  private raw: string | null;
  private listeners = new Set<() => void>();
  private flight: Promise<void> | null = null;
  private archiveFlight: Promise<void> | null = null;
  private status: SaveStatus;
  private needsRefresh = false;
  private restoring = false;
  async pauseForRestore() {
    this.restoring = true;
    try { await this.archiveFlight; await this.flight; await this.storage.flush?.(); }
    catch (error) { this.restoring = false; throw error; }
    return () => { this.restoring = false; };
  }
  readonly key: string;
  getBackupKey = () => this.key;
  private notificationPort?: ScheduleNotificationPort;
  getScheduleNotifications = () => {
    const port=this.transport.scheduleNotifications;
    if(!port)return undefined;
    this.notificationPort ??= {...port,subscribe:async subscription=>{
      await this.flush();
      if(this.status.phase!=='saved')throw Error('일정을 서버에 저장하지 못했습니다. 이 기기의 기록을 보존했습니다. 저장 상태를 확인한 뒤 알림을 켜 주세요.');
      await port.subscribe(subscription);
    }};
    return this.notificationPort;
  };
  getCodeRunner = () => this.transport.runCode;
  constructor(private storage: PersonalJournal, private transport: OnlineTransport, server: ServerSnapshot, cached = false, journalKey = personalJournalKey(server.data)) {
    this.needsRefresh = cached;
    validateState(server.data);
    if (!['personal', 'test'].includes(server.data.namespace)) throw new DomainError('WRONG_NAMESPACE', '개인 자료와 시연 자료를 구별해 주세요.');
    const ownerKey = personalJournalKey(server.data);
    if (journalKey !== ownerKey && !journalKey.startsWith(`${ownerKey}:window:`)) throw new DomainError('OWNERSHIP', '이 공간의 저장 키가 아닙니다.');
    this.key = journalKey;
    this.raw = storage.getItem(this.key);
    this.envelope = { format: 1, base: server, local: server.data, pending: [], archives: [] };
    if (this.raw !== null) {
      try {
        const saved: LocalEnvelope = JSON.parse(decodeStoredText(this.raw));
        if (saved.format !== 1 || !Array.isArray(saved.pending) || !Array.isArray(saved.archives)) throw Error();
        this.verify(saved.base); this.verify({ sequence: saved.base.sequence, data: saved.local });
        if (saved.conflict) this.verify(saved.conflict);
        const replay = saved.pending.reduce((state, command) => applyCommand(state, command), saved.base.data);
        if (JSON.stringify(replay) !== JSON.stringify(saved.local)) throw Error();
        if (saved.restoredBackup && cached) {
          this.envelope = { ...saved, conflict: undefined };
        } else if (saved.restoredBackup && JSON.stringify(saved.local) !== JSON.stringify(server.data)) {
          // Explicit local backup restoration must not disappear on the first online load,
          // or upload old data automatically. Keep both versions for the normal conflict UI.
          this.envelope = { ...saved, conflict: server };
        } else if (saved.pending.length && server.sequence !== saved.base.sequence) {
          // Recover acknowledged operations after closing during a lost response.
          this.envelope = this.recoverAcknowledged(saved, server) ?? this.rebaseWindow(saved, server) ?? { ...saved, conflict: server };
        } else this.envelope = saved.pending.length ? saved : { ...saved, base: server, local: server.data, conflict: undefined };
        if (!cached && this.envelope.restoredBackup && !this.envelope.conflict && JSON.stringify(this.envelope.local) === JSON.stringify(server.data)) this.envelope = { ...this.envelope, restoredBackup: undefined };
      } catch { throw new DomainError('CORRUPT_PERSONAL', '이 기기의 개인 자료를 읽지 못했습니다. 저장된 원문을 덮어쓰지 않았습니다.'); }
    }
    this.status = this.envelope.conflict ? { phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' } : this.envelope.pending.length ? { phase: 'pending', pending: this.envelope.pending.length, message: '이 기기에 저장됨 · 서버 전송 대기' } : { phase: 'saved', pending: 0, message: '서버에서 불러옴' };
    if (cached && !this.envelope.conflict) this.status = { phase: 'checking', pending: this.envelope.pending.length, message: '이 기기의 기록을 표시하고 있습니다 · 서버 확인 중' };
    this.persist(this.envelope);
  }
  private verify(value: ServerSnapshot) {
    // A conditional response reuses the already validated base by identity.
    // New server data still receives the complete integrity check.
    if (value.data !== this.envelope.base.data) validateState(value.data);
    const owner = this.envelope.base.data;
    if (!Number.isSafeInteger(value.sequence) || value.sequence < 0 || value.data.userId !== owner.userId || value.data.namespace !== owner.namespace) throw new DomainError('OWNERSHIP', '이 공간의 자료가 아닙니다.');
  }
  private recoverAcknowledged(saved: LocalEnvelope, server: ServerSnapshot): LocalEnvelope | null {
    let count = 0;
    for (const command of saved.pending) {
      if (server.data.appliedOps[command.opId] !== saved.local.appliedOps[command.opId]) break;
      applyCommand(server.data, command); // Check the receipt payload, not just its ID.
      count++;
    }
    if (!count || (count < saved.pending.length && server.sequence !== saved.base.sequence + count)) return null;
    const pending = saved.pending.slice(count);
    // A matching sequence and contiguous receipts establish that only our prefix
    // was committed. Any unrelated device change still requires conflict handling.
    const local = pending.reduce((state, command) => applyCommand(state, command), server.data);
    return { ...saved, base: server, local, pending, conflict: undefined };
  }
  /** Window outboxes may replay only commands whose affected originals are
   * unchanged. Same-entity edits always retain both copies for explicit review. */
  private rebaseWindow(saved: LocalEnvelope, server: ServerSnapshot): LocalEnvelope | null {
    if (!this.key.includes(':online:v1:window:')) return null;
    let before = saved.base.data, local = server.data;
    const pending: Command[] = [];
    try {
      for (const command of saved.pending) {
        const after = applyCommand(before, command);
        if (server.data.appliedOps[command.opId]) {
          applyCommand(server.data, command); // Validate the complete receipt payload.
          before = after; continue;
        }
        const originals = before as unknown as Record<string, unknown>;
        const changes = after as unknown as Record<string, unknown>;
        const current = local as unknown as Record<string, unknown>;
        for (const field of Object.keys(changes)) {
          if (field === 'appliedOps' || field === 'revisions') continue;
          const a = originals[field], b = changes[field], c = current[field];
          if (JSON.stringify(a) === JSON.stringify(b)) continue;
          if (Array.isArray(b)) {
            const rows = (a ?? []) as { id: string }[];
            const nextRows = b as { id: string }[];
            const currentRows = (c ?? []) as { id: string }[];
            const originalsById = new Map(rows.map(row => [row.id, row]));
            const nextById = new Map(nextRows.map(row => [row.id, row]));
            const currentById = new Map(currentRows.map(row => [row.id, row]));
            const ids = new Set([...rows, ...nextRows].map(row => row.id));
            for (const id of ids) {
              const original = originalsById.get(id);
              if (JSON.stringify(original) !== JSON.stringify(nextById.get(id)) &&
                JSON.stringify(original) !== JSON.stringify(currentById.get(id))) return null;
            }
          } else if (JSON.stringify(a) !== JSON.stringify(c)) return null;
        }
        local = applyCommand(local, command);
        pending.push(command); before = after;
      }
      return { ...saved, base: server, local, pending, conflict: undefined };
    } catch { return null; }
  }
  private persist(next: LocalEnvelope) {
    const started = performance.now();
    let success = false;
    try {
      if (this.storage.getItem(this.key) !== this.raw) throw new DomainError('STALE_PERSONAL', '다른 창에서 이 기기의 자료가 바뀌었습니다. 작성 내용은 두고 다시 열어 주세요.');
      const raw = encodeStoredText(JSON.stringify(next));
      if (raw !== this.raw) this.storage.setItem(this.key, raw);
      this.raw = raw; this.envelope = next;
      success = true;
    } finally { recordRequestPerformance('local-journal', started, success); }
  }
  getSnapshot() { return this.envelope.local; }
  hasIndexedJournal = () => Boolean(this.storage.flush);
  async close() {
    try { await this.archiveFlight; await this.flight; await this.storage.flush?.(); }
    finally { this.storage.close?.(); }
  }
  getCapabilities = () => this.envelope.base.supportedCommands ?? [];
  getStatus = () => this.status;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private update(status: SaveStatus, changed = false) { if (!changed && JSON.stringify(this.status) === JSON.stringify(status)) return; this.status = status; this.listeners.forEach(listener => { listener(); }); }
  execute(command: Command): AppState { return this.executeMany([command]); }
  executeMany(commands: Command[]): AppState {
    if (this.archiveFlight) throw Error('이 기기의 글을 보관하고 있습니다. 보관을 마친 뒤 작성해 주세요.');
    if (this.restoring) throw Error('백업을 복원하고 있습니다. 복원한 공간을 다시 연 뒤 작성해 주세요.');
    if (this.envelope.restoredBackup && !this.envelope.conflict) throw Error('복원한 백업과 서버 자료를 확인하고 있습니다. 저장 상태를 확인한 뒤 작성해 주세요.');
    const started = performance.now();
    let success = false;
    try {
      if (this.envelope.conflict) throw new DomainError('VERSION_CONFLICT', '두 자료를 보존했습니다. 저장 상태에서 충돌 내용을 먼저 확인해 주세요.');
      let local = this.envelope.local;
      const added: Command[] = [];
      for (const command of commands) {
        const next = applyCommand(local, command);
        if (next !== local) added.push(command);
        local = next;
      }
      if (local === this.envelope.local) { success = true; return local; }
      this.persist({ ...this.envelope, local, pending: [...this.envelope.pending, ...added] });
      this.update({ phase: 'pending', pending: this.envelope.pending.length, message: this.storage.isDurable?.() === false ? '기기에 보관 중 · 서버 전송 대기' : '이 기기에 저장됨 · 서버 전송 대기' });
      // IndexedDB completion is awaited before transport; pending in-memory work is not reported as durable.
      void this.flush();
      success = true;
      return local;
    } finally { recordRequestPerformance('local-command', started, success); }
  }
  flush(): Promise<void> {
    if (this.archiveFlight) return this.archiveFlight;
    if (this.restoring) return Promise.resolve();
    if (this.flight) return this.flight;
    this.flight = this.drain().finally(() => { this.flight = null; if (this.envelope.pending.length && this.status.phase === 'pending') void this.flush(); });
    return this.flight;
  }
  /** Refresh and writes share one flight. A response can never replace edits made while it was in transit. */
  private acceptServer(server: ServerSnapshot) {
    this.verify(server);
    if (this.envelope.restoredBackup && JSON.stringify(this.envelope.local) !== JSON.stringify(server.data)) {
      this.persist({ ...this.envelope, conflict: server });
      this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '복원한 백업과 서버 자료를 모두 보존했습니다. 저장 상태에서 확인해 주세요.' }, true);
      return;
    }
    if (this.envelope.restoredBackup) this.envelope = { ...this.envelope, restoredBackup: undefined };
    if (server.sequence < this.envelope.base.sequence) throw new DomainError('STALE_SERVER', '서버의 최신 기록을 확인하지 못했습니다. 이 기기의 글은 남아 있습니다.');
    if (this.envelope.pending.length) {
      if (server.sequence === this.envelope.base.sequence) return;
      const recovered = this.recoverAcknowledged(this.envelope, server) ?? this.rebaseWindow(this.envelope, server);
      if (!recovered) {
        this.persist({ ...this.envelope, conflict: server });
        this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' });
        return;
      }
      this.persist(recovered);
      this.update(recovered.pending.length
        ? { phase: 'pending', pending: recovered.pending.length, message: '이 기기에 저장됨 · 서버 전송 대기' }
        : { phase: 'saved', pending: 0, message: '서버에서 불러옴' }, true);
      return;
    } else if (server.sequence === this.envelope.base.sequence && JSON.stringify(server.supportedCommands) === JSON.stringify(this.envelope.base.supportedCommands) && JSON.stringify(server.syncCapabilities) === JSON.stringify(this.envelope.base.syncCapabilities)) return;
    this.persist({ ...this.envelope, base: server, local: server.data, pending: [], conflict: undefined });
    this.update({ phase: 'saved', pending: 0, message: '서버에서 불러옴' }, true);
  }
  private async drain() {
    try {
      await this.storage.flush?.();
      if (this.envelope.conflict) return;
      if (this.needsRefresh) {
        const server = await this.transport.load(this.envelope.base);
        this.acceptServer(server);
        this.needsRefresh = false;
        await this.storage.flush?.();
        if (this.envelope.conflict) return;
      }
      while (true) {
        await this.storage.flush?.();
        if (!this.envelope.pending.length) break;
        this.update({ phase: 'saving', pending: this.envelope.pending.length, message: '이 기기에 저장됨 · 서버에 저장 중' });
        let commands = this.envelope.pending.slice(0, 1);
        const executeBatch = this.transport.executeBatch;
        if (this.envelope.base.syncCapabilities?.batchCommands && executeBatch) {
          // Bound payload/count without serializing the entire ledger. Never discard
          // an intermediate edit or wait for more input before sending a ready batch.
          const batch: Command[] = [];
          let chars = 256;
          for (const command of this.envelope.pending.slice(0, MAX_SYNC_BATCH)) {
            chars += JSON.stringify(command).length + 1;
            if (chars > MAX_SYNC_BATCH_CHARS) break;
            batch.push(command);
          }
          if (batch.length > 1) commands = batch;
        }
        const server = commands.length > 1 && executeBatch
          ? await executeBatch.call(this.transport, commands, this.envelope.base.sequence)
          : await this.transport.execute(commands[0], this.envelope.base.sequence);
        this.verify(server);
        if (commands.some(command => server.data.appliedOps[command.opId] !== this.envelope.local.appliedOps[command.opId])) throw new DomainError('INVALID_ACK', '서버 저장 확인을 받지 못했습니다. 원문을 보존했습니다.');
        const pending = this.envelope.pending.slice(commands.length);
        let local: AppState;
        try { local = pending.reduce((state, item) => applyCommand(state, item), server.data); }
        catch { this.persist({ ...this.envelope, conflict: server }); this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' }); return; }
        this.persist({ ...this.envelope, base: server, local, pending });
      }
      if (this.status.phase !== 'saved') this.update({ phase: 'saved', pending: 0, message: '서버에 저장됨' });
    } catch (error) {
      if (error instanceof DomainError && /CONFLICT/.test(error.code)) {
        try {
          const server = await this.transport.load(); this.verify(server);
          const rebased = this.recoverAcknowledged(this.envelope, server) ?? this.rebaseWindow(this.envelope, server);
          if (rebased && server.sequence > this.envelope.base.sequence) {
            this.persist(rebased); await this.storage.flush?.();
            this.update(rebased.pending.length
              ? { phase: 'pending', pending: rebased.pending.length, message: '이 기기에 저장됨 · 서버 전송 대기' }
              : { phase: 'saved', pending: 0, message: '서버에 저장됨' }, true);
            return;
          }
          this.persist({ ...this.envelope, conflict: server }); await this.storage.flush?.();
        }
        catch { this.update({ phase: 'error', pending: this.envelope.pending.length, message: '충돌 자료를 불러오지 못했습니다. 이 기기의 원문은 남아 있습니다.' }); return; }
        this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' });
      } else {
        // A transport failure may follow a committed prefix or a lost final
        // acknowledgement. Reconcile receipts before the next write, including
        // retries in this same session. Keep every draft while offline.
        this.needsRefresh = true;
        this.update({ phase: 'error', pending: this.envelope.pending.length, message: storageErrorText(error, '서버에 저장하지 못했습니다. 이 기기의 원문은 남아 있습니다.') });
      }
    }
  }
  refresh(): Promise<void> {
    if (this.archiveFlight) return this.archiveFlight;
    if (this.restoring) return Promise.resolve();
    // Coalesce manual refresh, focus, reconnect and polling with any ongoing write/read.
    if (this.flight) return this.flight;
    if (this.envelope.conflict) return Promise.resolve();
    this.needsRefresh = true;
    return this.flush();
  }
  getConflict() { return this.envelope.conflict ? { base: this.envelope.base, local: this.envelope.local, pending: this.envelope.pending, server: this.envelope.conflict } : null; }
  exportPreserved() {
    const deviceRecovery = this.storage.getRecoveryCopies?.() ?? [];
    return JSON.stringify(deviceRecovery.length ? { ...this.envelope, deviceRecovery } : this.envelope, null, 2);
  }
  /** Explicit choice: archive all local originals before opening the server state. */
  openServerWithArchive(): Promise<void> {
    if (this.archiveFlight) return this.archiveFlight;
    if (this.restoring) return Promise.reject(Error('백업을 복원하고 있습니다. 복원한 공간을 다시 연 뒤 확인해 주세요.'));
    const previousFlight = this.flight;
    const task = Promise.resolve().then(async () => {
      await previousFlight;
      const previous = this.envelope, server = previous.conflict;
      if (!server) return;
      const archive: PreservedConflict = { base: previous.base, local: previous.local, pending: previous.pending, server, savedAt: new Date().toISOString() };
      const next: LocalEnvelope = { format: 1, base: server, local: server.data, pending: [], archives: [...previous.archives, archive] };
      this.update({ phase: 'conflict', pending: previous.pending.length, message: '이 기기의 글과 서버 자료를 함께 보관하고 있습니다…' });
      try {
        this.persist(next);
        // Keep the current conflict visible until the exact archive commits.
        // A quota fallback may exist only in memory until this await completes.
        this.envelope = previous;
        await this.storage.flush?.();
        this.envelope = next;
        this.needsRefresh = false;
        this.update({ phase: 'saved', pending: 0, message: '이 기기의 이전 글은 보관본에 남겼습니다. 서버 자료를 열었습니다.' }, true);
      } catch (error) {
        // Cancel a failed staged resolution so close/retry cannot later commit it
        // without the user's successful archive action. Every original remains
        // in both the conflict envelope and any previously persisted archive.
        this.envelope = previous;
        try { this.persist(previous); await this.storage.flush?.(); } catch { /* Original conflict remains in memory and the prior durable journal. */ }
        this.envelope = previous;
        this.update({ phase: 'error', pending: previous.pending.length, message: '보관을 마치지 못해 서버 자료로 전환하지 않았습니다. 이 기기의 글과 서버 자료를 유지했습니다. 다시 시도하거나 보관본을 내려받아 주세요.' }, true);
        throw error;
      }
    });
    this.archiveFlight = task.finally(() => { this.archiveFlight = null; });
    return this.archiveFlight;
  }
}
