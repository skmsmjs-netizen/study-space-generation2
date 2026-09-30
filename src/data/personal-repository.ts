import { applyCommand, validateState } from '../domain/commands';
import { DomainError, type AppState, type Command } from '../domain/model';
import type { SaveStatus, StudyRepository } from './repository';
import type { ServerSnapshot } from '../server/command-handler';
import { encodeStoredText, decodeStoredText } from './storage-codec';
export interface OnlineTransport { load(): Promise<ServerSnapshot>; execute(command: Command, baseSequence: number): Promise<ServerSnapshot> }
export interface PreservedConflict { base: ServerSnapshot; local: AppState; pending: Command[]; server: ServerSnapshot; savedAt: string }
interface LocalEnvelope { format: 1; base: ServerSnapshot; local: AppState; pending: Command[]; conflict?: ServerSnapshot; archives: PreservedConflict[] }
export class PersonalRepository implements StudyRepository {
  private envelope: LocalEnvelope;
  private raw: string | null;
  private listeners = new Set<() => void>();
  private flight: Promise<void> | null = null;
  private status: SaveStatus;
  readonly key: string;
  constructor(private storage: Pick<Storage, 'getItem' | 'setItem'>, private transport: OnlineTransport, server: ServerSnapshot) {
    validateState(server.data);
    if (!['personal', 'test'].includes(server.data.namespace)) throw new DomainError('WRONG_NAMESPACE', '개인 자료와 시연 자료를 구별해 주세요.');
    this.key = `study-space:${server.data.namespace}:${encodeURIComponent(server.data.userId)}:online:v1`;
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
        if (saved.pending.length && server.sequence !== saved.base.sequence) {
          // Recover acknowledged operations after closing during a lost response.
          const acknowledged = saved.pending.filter(command => server.data.appliedOps[command.opId] === saved.local.appliedOps[command.opId]);
          acknowledged.forEach(command => applyCommand(server.data, command));
          if (acknowledged.length === saved.pending.length) this.envelope = { ...saved, base: server, local: server.data, pending: [], conflict: undefined };
          else this.envelope = { ...saved, conflict: server };
        } else this.envelope = saved.pending.length ? saved : { ...saved, base: server, local: server.data, conflict: undefined };
      } catch { throw new DomainError('CORRUPT_PERSONAL', '이 기기의 개인 자료를 읽지 못했습니다. 저장된 원문을 덮어쓰지 않았습니다.'); }
    }
    this.status = this.envelope.conflict ? { phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' } : this.envelope.pending.length ? { phase: 'pending', pending: this.envelope.pending.length, message: '이 기기에 저장됨 · 서버 전송 대기' } : { phase: 'saved', pending: 0, message: '서버에서 불러옴' };
    this.persist(this.envelope);
  }
  private verify(value: ServerSnapshot) {
    validateState(value.data);
    const owner = this.envelope.base.data;
    if (!Number.isSafeInteger(value.sequence) || value.sequence < 0 || value.data.userId !== owner.userId || value.data.namespace !== owner.namespace) throw new DomainError('OWNERSHIP', '이 공간의 자료가 아닙니다.');
  }
  private persist(next: LocalEnvelope) {
    if (this.storage.getItem(this.key) !== this.raw) throw new DomainError('STALE_PERSONAL', '다른 창에서 이 기기의 자료가 바뀌었습니다. 작성 내용은 두고 다시 열어 주세요.');
    const raw = encodeStoredText(JSON.stringify(next));
    this.storage.setItem(this.key, raw);
    this.raw = raw; this.envelope = next;
  }
  getSnapshot() { return this.envelope.local; }
  getStatus = () => this.status;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private update(status: SaveStatus) { this.status = status; this.listeners.forEach(listener => listener()); }
  execute(command: Command): AppState {
    if (this.envelope.conflict) throw new DomainError('VERSION_CONFLICT', '두 자료를 보존했습니다. 저장 상태에서 충돌 내용을 먼저 확인해 주세요.');
    const local = applyCommand(this.envelope.local, command);
    if (local === this.envelope.local) return local;
    this.persist({ ...this.envelope, local, pending: [...this.envelope.pending, command] });
    this.update({ phase: 'pending', pending: this.envelope.pending.length, message: '이 기기에 저장됨 · 서버 전송 대기' });
    // Local durability is synchronous; server acknowledgement is separately observable.
    void this.flush();
    return local;
  }
  flush(): Promise<void> {
    if (this.flight) return this.flight;
    this.flight = this.drain().finally(() => { this.flight = null; });
    return this.flight;
  }
  private async drain() {
    if (this.envelope.conflict) return;
    try {
      while (this.envelope.pending.length) {
        this.update({ phase: 'saving', pending: this.envelope.pending.length, message: '이 기기에 저장됨 · 서버에 저장 중' });
        const command = this.envelope.pending[0];
        const server = await this.transport.execute(command, this.envelope.base.sequence);
        this.verify(server);
        // A transport must acknowledge this exact operation, not merely return HTTP 200.
        if (server.data.appliedOps[command.opId] !== this.envelope.local.appliedOps[command.opId]) throw new DomainError('INVALID_ACK', '서버 저장 확인을 받지 못했습니다. 원문을 보존했습니다.');
        const pending = this.envelope.pending.slice(1);
        let local: AppState;
        try { local = pending.reduce((state, item) => applyCommand(state, item), server.data); }
        catch { this.persist({ ...this.envelope, conflict: server }); this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' }); return; }
        this.persist({ ...this.envelope, base: server, local, pending });
      }
      this.update({ phase: 'saved', pending: 0, message: '서버에 저장됨' });
    } catch (error) {
      if (error instanceof DomainError && /CONFLICT/.test(error.code)) {
        try { const server = await this.transport.load(); this.verify(server); this.persist({ ...this.envelope, conflict: server }); }
        catch { this.update({ phase: 'error', pending: this.envelope.pending.length, message: '충돌 자료를 불러오지 못했습니다. 이 기기의 원문은 남아 있습니다.' }); return; }
        this.update({ phase: 'conflict', pending: this.envelope.pending.length, message: '다른 기기의 변경과 이 기기의 글을 모두 보존했습니다.' });
      } else this.update({ phase: 'error', pending: this.envelope.pending.length, message: error instanceof Error ? error.message : '서버에 저장하지 못했습니다. 이 기기의 원문은 남아 있습니다.' });
    }
  }
  async refresh() {
    await this.flush();
    if (this.envelope.pending.length) throw new DomainError('PENDING', '이 기기의 미전송 글을 보존하고 있습니다. 먼저 저장 상태를 확인해 주세요.');
    const server = await this.transport.load(); this.verify(server);
    this.persist({ ...this.envelope, base: server, local: server.data });
    this.update({ phase: 'saved', pending: 0, message: '서버에서 불러옴' });
  }
  getConflict() { return this.envelope.conflict ? { base: this.envelope.base, local: this.envelope.local, pending: this.envelope.pending, server: this.envelope.conflict } : null; }
  exportPreserved() { return JSON.stringify(this.envelope, null, 2); }
  /** Explicit choice: archive all local originals before opening the server state. */
  openServerWithArchive() {
    const server = this.envelope.conflict;
    if (!server) return;
    const archive: PreservedConflict = { base: this.envelope.base, local: this.envelope.local, pending: this.envelope.pending, server, savedAt: new Date().toISOString() };
    this.persist({ format: 1, base: server, local: server.data, pending: [], archives: [...this.envelope.archives, archive] });
    this.update({ phase: 'saved', pending: 0, message: '이 기기의 이전 글은 보관본에 남겼습니다. 서버 자료를 열었습니다.' });
  }
}
