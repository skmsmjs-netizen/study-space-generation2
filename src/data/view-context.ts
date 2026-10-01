import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';

/** Tab-local view hints; never a record, draft, server save or cross-device setting. */
export function viewContextKey(data: Pick<AppState, 'namespace' | 'userId'>, name: string) {
  return `${storagePrefix(data)}:view-context:${name}:v1`;
}
export function readViewContext<T>(
  key: string,
  fallback: T,
  valid: (value: unknown) => value is T,
): T {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    return valid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
export function writeViewContext<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Optional view hints must not block editing or mutate saved records. */
  }
}
