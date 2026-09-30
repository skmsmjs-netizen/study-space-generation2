/** Read-only access to prototype draft rescue copies, not a backup/restore system. */
export interface DraftArchiveMetadata {
  version: 1;
  archiveKey: string;
  sourceKey: string;
  archivedAt: string;
  reason: string;
}
export interface ArchiveIssue {
  stage: 'enumeration' | 'archive-read' | 'metadata-read' | 'metadata-invalid' | 'current-read';
  archiveKey?: string;
  message: string;
}
export interface DraftArchive {
  archiveKey: string;
  sourceKey: string;
  raw: string | null;
  metadata: DraftArchiveMetadata | null;
  /** Exact storage-string comparison only; it does not imply valid or saved study data. */
  currentDraft: 'same' | 'different' | 'absent' | 'unreadable';
  issues: ArchiveIssue[];
}
type ArchiveStorage = Pick<Storage, 'length' | 'key' | 'getItem'>;
const marker = ':recovery:';
export const draftArchiveMetadataKey = (archiveKey: string): string => `study-space:draft-archive-metadata:v1:${archiveKey}`;

function sourceKeyFor(archiveKey: string, prefix = 'study-space:demo:'): string {
  const split = archiveKey.lastIndexOf(marker);
  if (!archiveKey.startsWith(prefix) || split < prefix.length || !archiveKey.slice(split + marker.length) || archiveKey.slice(split + marker.length).includes(':')) {
    throw new Error('초안 보관본의 위치가 아닙니다. 현재 기록과 초안은 변경하지 않았습니다.');
  }
  return archiveKey.slice(0, split);
}

function validMetadata(value: unknown, archiveKey: string, sourceKey: string): value is DraftArchiveMetadata {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Partial<DraftArchiveMetadata>;
  return data.version === 1 && data.archiveKey === archiveKey && data.sourceKey === sourceKey &&
    typeof data.archivedAt === 'string' && Number.isFinite(Date.parse(data.archivedAt)) &&
    typeof data.reason === 'string' && data.reason.trim().length > 0;
}

export function readDraftArchive(archiveKey: string, providedStorage?: ArchiveStorage, prefix = 'study-space:demo:'): DraftArchive {
  const sourceKey = sourceKeyFor(archiveKey, prefix);
  const result: DraftArchive = { archiveKey, sourceKey, raw: null, metadata: null, currentDraft: 'unreadable', issues: [] };
  let storage: ArchiveStorage;
  try { storage = providedStorage ?? localStorage; }
  catch {
    result.issues.push({ stage: 'archive-read', archiveKey, message: '이 브라우저의 저장소에 접근하지 못했습니다. 보관본·기록·초안을 변경하지 않았습니다. 다시 읽어 주세요.' });
    return result;
  }
  try {
    result.raw = storage.getItem(archiveKey);
    if (result.raw === null) result.issues.push({ stage: 'archive-read', archiveKey, message: '선택한 보관본을 찾지 못했습니다. 목록을 다시 읽어 주세요. 현재 기록과 초안은 변경하지 않았습니다.' });
  } catch {
    result.issues.push({ stage: 'archive-read', archiveKey, message: '이 보관본의 원문을 읽지 못했습니다. 저장된 내용을 변경하지 않았습니다. 다시 읽어 주세요.' });
  }
  let metadataRaw: string | null = null;
  try { metadataRaw = storage.getItem(draftArchiveMetadataKey(archiveKey)); }
  catch { result.issues.push({ stage: 'metadata-read', archiveKey, message: '보관 시각과 이유를 읽지 못했습니다. 읽힌 원문은 확인·내보내기할 수 있습니다. 정보 읽기를 다시 시도해 주세요.' }); }
  if (metadataRaw !== null) {
    try {
      const parsed: unknown = JSON.parse(metadataRaw);
      if (!validMetadata(parsed, archiveKey, sourceKey)) throw new Error('invalid metadata');
      result.metadata = parsed;
    } catch {
      result.issues.push({ stage: 'metadata-invalid', archiveKey, message: '보관 정보 형식을 확인하지 못해 시각과 이유를 확정하지 않았습니다. 원문과 보관 정보는 그대로 유지했습니다.' });
    }
  }
  try {
    const current = storage.getItem(sourceKey);
    result.currentDraft = current === null ? 'absent' : result.raw === null ? 'unreadable' : current === result.raw ? 'same' : 'different';
  } catch { result.issues.push({ stage: 'current-read', archiveKey, message: '현재 초안을 읽지 못해 보관본과 비교하지 못했습니다. 읽힌 보관본은 확인·내보내기할 수 있습니다. 다시 읽어 주세요.' }); }
  return result;
}

export function listDraftArchives(providedStorage?: ArchiveStorage, prefix = 'study-space:demo:'): { archives: DraftArchive[]; issues: ArchiveIssue[]; complete: boolean } {
  const archives: DraftArchive[] = [], issues: ArchiveIssue[] = [];
  let storage: ArchiveStorage, length: number;
  try { storage = providedStorage ?? localStorage; length = storage.length; }
  catch {
    issues.push({ stage: 'enumeration', message: '보관본 목록을 읽지 못했습니다. 보관본이 없다는 뜻은 아닙니다. 저장된 내용을 변경하지 않았습니다. 다시 읽어 주세요.' });
    return { archives, issues, complete: false };
  }
  const seen = new Set<string>();
  for (let index = 0; index < length; index++) {
    let key: string | null;
    try { key = storage.key(index); }
    catch { issues.push({ stage: 'enumeration', message: '목록 일부를 읽지 못했습니다. 읽힌 보관본부터 확인할 수 있습니다. 전체 목록을 다시 읽어 주세요.' }); continue; }
    if (key === null) {
      issues.push({ stage: 'enumeration', message: '목록을 읽는 중 저장소 항목이 바뀌었습니다. 전체 목록을 다시 읽어 주세요.' });
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    try { sourceKeyFor(key, prefix); } catch { continue; }
    const archive = readDraftArchive(key, storage, prefix);
    archives.push(archive);
    issues.push(...archive.issues);
  }
  // Stable by storage identity; old archives have no trustworthy creation time.
  archives.sort((a, b) => a.archiveKey.localeCompare(b.archiveKey));
  return { archives, issues, complete: issues.length === 0 };
}

/** JSON escapes lone UTF-16 surrogates; text/plain Blob conversion would replace them. */
export function serializeDraftArchive(archive: DraftArchive): string {
  if (archive.raw === null) throw new Error('원문을 읽지 못해 내보내지 않았습니다. 보관본을 다시 읽어 주세요.');
  return JSON.stringify({
    format: 'study-space-draft-archive', version: 1,
    archiveKey: archive.archiveKey, sourceKey: archive.sourceKey,
    metadata: archive.metadata, raw: archive.raw,
  }, null, 2);
}
