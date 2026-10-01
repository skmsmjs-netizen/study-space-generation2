import { draftArchiveMetadataKey, type DraftArchiveMetadata } from './draft-archives';
import { personalDraftWindow } from './personal-draft-window';

/** Demo-only volatile rescue. It is not durable storage or an offline queue. */
const pending = new Map<string, string>();
const retainedReadErrors = new Map<string, string>();
const lastWritten = new Map<string, string>();
const windowCopyKey = (key: string, id: string) => `${key}:recovery:window-${id}`;
/** Include unsaved rescue text in an explicit portable backup. */
export function rescuedDraftEntries(): Array<[string, string]> { return [...pending.entries()]; }
if (typeof window !== 'undefined') window.addEventListener('beforeunload', event => {
  if (!pending.size) return;
  event.preventDefault();
  event.returnValue = '';
});
type DraftOptions = { scope?: 'window' | 'device' };
export function readRescuedDraft(key: string, options: DraftOptions = {}): string | null {
  if (!pending.has(key)) retainedReadErrors.delete(key);
  // A device setting is shared by this owner's windows. The empty editor
  // marker and a stale window copy are not the shared setting's contents.
  if (options.scope === 'device') return pending.get(key) ?? null;
  const id = personalDraftWindow(key);
  if (!pending.has(key) && id) {
    const own = localStorage.getItem(windowCopyKey(key, id));
    if (own !== null) return own;
    const author = localStorage.getItem(`${key}:window-author`);
    if (author && author !== id) return ''; // Another live window's draft is a preserved copy, not this editor's input.
  }
  return pending.get(key) ?? null;
}
export function draftHasUnstoredText(key: string): boolean { return pending.has(key); }
export function storeDraftSafely(key: string, value: string): void {
  // Keep the exact value before a potentially throwing write. Route unmount cannot discard it.
  pending.set(key, value);
  const id = personalDraftWindow(key);
  if (id) {
    const archiveKey = windowCopyKey(key, id);
    localStorage.setItem(archiveKey, value);
    if (localStorage.getItem(archiveKey) !== value) throw Error('이 창의 초안 보관을 확인하지 못했습니다. 입력은 현재 창에 남아 있습니다.');
    const metadata: DraftArchiveMetadata = { version: 1, archiveKey, sourceKey: key, archivedAt: new Date().toISOString(), reason: '창별 작성 초안' };
    localStorage.setItem(draftArchiveMetadataKey(archiveKey), JSON.stringify(metadata));
  }
  localStorage.setItem(key, value);
  if (id) localStorage.setItem(`${key}:window-author`, id);
  lastWritten.set(key, value);
  pending.delete(key);
}
export function clearRescuedDraft(key: string): void { pending.delete(key); retainedReadErrors.delete(key); lastWritten.delete(key); }
export function rememberDraftReadError(key: string, error: string): void { retainedReadErrors.set(key, error); }
export function draftReadError(key: string): string { return pending.has(key) ? retainedReadErrors.get(key) ?? '' : ''; }
export function rescueWithoutOverwrite(key: string, value: string): void { pending.set(key, value); }

export class DraftArchiveError extends Error {
  constructor(readonly stage: 'source-read' | 'archive-write' | 'archive-verify' | 'metadata-write', message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'DraftArchiveError';
  }
}

/** Copy the exact storage string before allowing a replacement. Never delete the archive. */
export function archiveDamagedDraft(key: string, reason = '읽을 수 없는 초안 원문 보관', retainedRaw?: string): string | null {
  let raw: string | null;
  try { raw = retainedRaw === undefined ? localStorage.getItem(key) : retainedRaw; }
  catch (cause) { throw new DraftArchiveError('source-read', '원래 초안을 읽지 못해 사본을 만들지 못했습니다. 저장된 내용을 변경하지 않았습니다. 다시 시도해 주세요.', cause); }
  if (raw === null) return null;
  const archiveKey = `${key}:recovery:${crypto.randomUUID()}`;
  try { localStorage.setItem(archiveKey, raw); }
  catch (cause) { throw new DraftArchiveError('archive-write', '초안 원문 사본을 보관하지 못했습니다. 원래 초안과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요.', cause); }
  try {
    if (localStorage.getItem(archiveKey) !== raw) throw new Error('archive verification failed');
  } catch (cause) { throw new DraftArchiveError('archive-verify', '원본 초안 사본을 확인하지 못했습니다. 원래 초안과 현재 창의 입력은 유지했습니다. 다시 읽거나 보관을 다시 시도해 주세요.', cause); }
  const metadata: DraftArchiveMetadata = { version: 1, archiveKey, sourceKey: key, archivedAt: new Date().toISOString(), reason };
  const metadataRaw = JSON.stringify(metadata);
  try {
    localStorage.setItem(draftArchiveMetadataKey(archiveKey), metadataRaw);
    if (localStorage.getItem(draftArchiveMetadataKey(archiveKey)) !== metadataRaw) throw new Error('metadata verification failed');
  } catch (cause) {
    throw new DraftArchiveError('metadata-write', '초안 원문 사본은 보관했지만 시각과 이유를 저장·확인하지 못했습니다. 원래 초안도 유지했습니다. 다시 시도하거나 초안 보관본에서 원문을 내보내 주세요.', cause);
  }
  retainedReadErrors.delete(key);
  return archiveKey;
}

/** Write an empty marker first so a failed removal cannot resurrect a committed draft. */
export function clearStoredDraft(key: string): void {
  const id = personalDraftWindow(key);
  if (id) {
    const author = localStorage.getItem(`${key}:window-author`);
    const current = localStorage.getItem(key);
    const own = localStorage.getItem(windowCopyKey(key, id));
    localStorage.setItem(windowCopyKey(key, id), '');
    try {
      localStorage.removeItem(windowCopyKey(key, id));
      localStorage.removeItem(draftArchiveMetadataKey(windowCopyKey(key, id)));
    } catch { /* The empty marker prevents resurrecting a committed draft. */ }
    // Saving our record never clears a different window's more recent draft.
    if ((author && author !== id) || (author === id && current !== (lastWritten.get(key) ?? own))) {
      clearRescuedDraft(key); return;
    }
  }
  let marked = false;
  try { localStorage.setItem(key, ''); marked = true; } catch { /* Removal can still succeed. */ }
  try { localStorage.removeItem(key); clearRescuedDraft(key); }
  catch (error) {
    clearRescuedDraft(key);
    if (!marked) { pending.set(key, ''); throw error; }
  }
}
