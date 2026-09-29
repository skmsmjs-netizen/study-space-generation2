/** Demo-only volatile rescue. It is not durable storage or an offline queue. */
const pending = new Map<string, string>();
const retainedReadErrors = new Map<string, string>();
if (typeof window !== 'undefined') window.addEventListener('beforeunload', event => {
  if (!pending.size) return;
  event.preventDefault();
  event.returnValue = '';
});
export function readRescuedDraft(key: string): string | null {
  if (!pending.has(key)) retainedReadErrors.delete(key);
  return pending.get(key) ?? null;
}
export function draftHasUnstoredText(key: string): boolean { return pending.has(key); }
export function storeDraftSafely(key: string, value: string): void {
  // Keep the exact value before a potentially throwing write. Route unmount cannot discard it.
  pending.set(key, value);
  localStorage.setItem(key, value);
  pending.delete(key);
}
export function clearRescuedDraft(key: string): void { pending.delete(key); retainedReadErrors.delete(key); }
export function rememberDraftReadError(key: string, error: string): void { retainedReadErrors.set(key, error); }
export function draftReadError(key: string): string { return pending.has(key) ? retainedReadErrors.get(key) ?? '' : ''; }
export function rescueWithoutOverwrite(key: string, value: string): void { pending.set(key, value); }

/** Copy the exact unreadable bytes before allowing a replacement. Never delete the archive. */
export function archiveDamagedDraft(key: string): string | null {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  const archiveKey = `${key}:recovery:${crypto.randomUUID()}`;
  localStorage.setItem(archiveKey, raw);
  if (localStorage.getItem(archiveKey) !== raw) throw new Error('원본 초안 사본을 확인하지 못했습니다. 원본을 유지했습니다.');
  retainedReadErrors.delete(key);
  return archiveKey;
}

/** Write an empty marker first so a failed removal cannot resurrect a committed draft. */
export function clearStoredDraft(key: string): void {
  let marked = false;
  try { localStorage.setItem(key, ''); marked = true; } catch { /* Removal can still succeed. */ }
  try { localStorage.removeItem(key); clearRescuedDraft(key); }
  catch (error) {
    clearRescuedDraft(key);
    if (!marked) { pending.set(key, ''); throw error; }
  }
}
