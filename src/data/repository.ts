import type { AppState, Command } from '../domain/model';
/** execute commits locally; flush resolves only after the server acknowledges. */
export interface StudyRepository {
  getSnapshot(): AppState;
  execute(command: Command): AppState;
  flush?(): Promise<void>;
  subscribe?(listener: () => void): () => void;
  getStatus?(): SaveStatus;
  getCapabilities?(): string[];
}
export interface SaveStatus { phase: 'checking' | 'saved' | 'pending' | 'saving' | 'error' | 'conflict'; pending: number; message: string }
export function storagePrefix(data: Pick<AppState, 'namespace' | 'userId'>) {
  return data.namespace === 'demo' ? 'study-space:demo' : `study-space:${data.namespace}:${encodeURIComponent(data.userId)}`;
}
