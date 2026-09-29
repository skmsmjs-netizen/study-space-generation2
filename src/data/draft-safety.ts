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
