import type { StudyRepository } from './repository';
import type { InkWorkspaceContent } from '../domain/ink-workspace';
import { validateInkWorkspace } from '../domain/ink-workspace';
import { archiveDamagedDraft,storeDraftSafely } from './draft-safety';
import { decodeStoredText } from './storage-codec';
/** Uses the same owner checks, durable journal, operation receipts and conflicts as study records. */
export function inkSync(repository: StudyRepository, notify?: () => void) {
  const versions = new Map<string, number>();
  const enabled = () => !repository.getCapabilities || repository.getCapabilities().includes('saveInkWorkspace');
  return {
    read(key: string | undefined): InkWorkspaceContent | null {
      if (!key || !enabled()) return null;
      const row = repository.getSnapshot().inkWorkspaces?.find(row => row.key === key && !row.deletedAt);
      versions.set(key, row?.version ?? 0);
      if (!row) return null;
      validateInkWorkspace(row.content);
      // An uncommitted local edit stays authoritative until the user explicitly retries.
      const pending = localStorage.getItem(`${key}:ink-sync-pending`);
      if (pending) { versions.set(key,Number(pending)); return null; }
      const raw = localStorage.getItem(key);
      if (raw && JSON.stringify(JSON.parse(decodeStoredText(raw))) !== JSON.stringify(row.content.value))
        archiveDamagedDraft(key, '다른 기기 필기 설정 수신 전 원문 보관');
      return structuredClone(row.content);
    },
    keepCurrentAfterReview(key: string | undefined) {
      if (!key) return;
      const row=repository.getSnapshot().inkWorkspaces?.find(r=>r.key===key && !r.deletedAt);
      if (row) storeDraftSafely(`${key}:ink-remote-history:${row.version}`,JSON.stringify(row));
      versions.set(key,row?.version ?? 0);
    },
    save(key: string | undefined, content: InkWorkspaceContent) {
      if (!key) return;
      validateInkWorkspace(content);
      const signature = JSON.stringify(content);
      const data = repository.getSnapshot();
      const row = data.inkWorkspaces?.find(row => row.key === key && !row.deletedAt);
      if (row && JSON.stringify(row.content) === signature) { versions.set(key,row.version); localStorage.removeItem(`${key}:ink-sync-pending`); return; }
      if (!enabled()) throw Error('이 기기에 보관했습니다. 서버 연결을 새로 고친 뒤 필기 설정 저장을 다시 시도해 주세요.');
      // Mark before execute; failure never discards the local value.
      localStorage.setItem(`${key}:ink-sync-pending`, String(versions.get(key) ?? 0));
      const next = repository.execute({type:'saveInkWorkspace', id:row?.id ?? crypto.randomUUID(), key, content,
        expectedVersion:versions.get(key) ?? 0, userId:data.userId, namespace:data.namespace,
        opId:crypto.randomUUID(), at:new Date().toISOString()});
      versions.set(key,next.inkWorkspaces!.find(r=>r.key===key)!.version);
      localStorage.removeItem(`${key}:ink-sync-pending`);
      notify?.();
    }
  };
}
