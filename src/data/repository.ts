import type { AppState, Command } from '../domain/model';
import type { ScheduleNotificationPort } from './schedule-notifications';
import type { CodeRemoteRunner } from './code-runner';
import type { CodeTerminalRunner } from './code-terminal';
/** execute commits locally; flush resolves only after the server acknowledges. */
export interface StudyRepository {
  getSnapshot(): AppState;
  execute(command: Command): AppState;
  flush?(): Promise<void>;
  subscribe?(listener: () => void): () => void;
  getStatus?(): SaveStatus;
  getCapabilities?(): string[];
  getScheduleNotifications?(): ScheduleNotificationPort | undefined;
  getCodeRunner?(): CodeRemoteRunner | undefined;
  getCodeTerminal?(): CodeTerminalRunner | undefined;
  /** Freeze new edits/transfers and await durable in-flight work for explicit restoration. */
  pauseForRestore?(): Promise<() => void>;
  getBackupKey?(): string;
}
export interface SaveStatus { phase: 'checking' | 'saved' | 'pending' | 'saving' | 'error' | 'conflict'; pending: number; message: string }
export function storagePrefix(data: Pick<AppState, 'namespace' | 'userId'>) {
  return data.namespace === 'demo' ? 'study-space:demo' : `study-space:${data.namespace}:${encodeURIComponent(data.userId)}`;
}
