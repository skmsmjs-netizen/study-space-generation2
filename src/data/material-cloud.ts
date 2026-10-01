import type { AppState } from '../domain/model';
import type { MaterialFile } from '../domain/material-source';
import { createStudyClient, readServerConfig } from './supabase-client';
export const MATERIAL_BUCKET = 'study-material-originals';
type Owner = Pick<AppState, 'userId' | 'namespace'>;
export function materialCloudPath(owner: Owner, kind: 'audio' | 'document', sha256: string) {
  if (!/^[a-f0-9]{64}$/.test(sha256)) throw Error('원본 파일의 해시를 확인해 주세요.');
  return `${owner.userId}/${owner.namespace}/${kind}/${sha256}`;
}
export async function verifyMaterialBlob(blob: Blob, reference: Pick<MaterialFile, 'size' | 'sha256'>) {
  if (blob.size !== reference.size) throw Error('원본 파일의 크기가 다릅니다. 기존 원본을 유지했습니다.');
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer()))].map(n => n.toString(16).padStart(2, '0')).join('');
  if (hash !== reference.sha256) throw Error('원본 파일의 내용을 확인하지 못했습니다. 기존 원본을 유지했습니다.');
}
async function authorizedClient(owner: Owner) {
  if (!['personal', 'test'].includes(owner.namespace)) throw Error('개인 공간에서 원본 파일을 서버에 보관할 수 있습니다.');
  const config = readServerConfig(); if (!config) throw Error('개인 공간의 서버 연결을 확인해 주세요.');
  const client = createStudyClient(config);
  const { data, error } = await client.auth.getSession();
  if (error || data.session?.user.id !== owner.userId) { client.auth.stopAutoRefresh(); throw Error('개인 공간에 다시 로그인해 주세요. 원본은 이 기기에 남아 있습니다.'); }
  return client;
}
export async function uploadMaterialFile(owner: Owner, kind: 'audio' | 'document', file: MaterialFile, blob: Blob): Promise<MaterialFile> {
  const path = materialCloudPath(owner, kind, file.sha256);
  await verifyMaterialBlob(blob, file);
  const client = await authorizedClient(owner);
  try {
    if (file.cloudPath !== undefined && file.cloudPath !== path) throw Error('원본 파일의 서버 위치를 확인하지 못했습니다.');
    const { error } = await client.storage.from(MATERIAL_BUCKET).upload(path, blob, { upsert: false, contentType: file.type || 'application/octet-stream', cacheControl: '0' });
    if (error && !['409', 'Duplicate'].includes(String(error.statusCode))) throw Error('원본 파일을 서버에 보관하지 못했습니다. 연결·보관 한도를 확인하고 다시 저장해 주세요. 원본과 초안은 이 기기에 남아 있습니다.');
    // Read-back also resolves an acknowledgement lost after a successful upload.
    const saved = await client.storage.from(MATERIAL_BUCKET).download(path);
    if (saved.error || !saved.data) throw Error('서버에 보관한 원본을 확인하지 못했습니다. 다시 저장하면 같은 파일의 보관 상태를 확인합니다.');
    await verifyMaterialBlob(saved.data, file);
    return { ...file, cloudPath: path };
  } finally { client.auth.stopAutoRefresh(); }
}
export async function downloadMaterialFile(owner: Owner, kind: 'audio' | 'document', file: MaterialFile): Promise<Blob> {
  if (file.cloudPath !== materialCloudPath(owner, kind, file.sha256)) throw Error('다른 공간의 원본 파일을 열 수 없습니다.');
  const client = await authorizedClient(owner);
  try { const { data, error } = await client.storage.from(MATERIAL_BUCKET).download(file.cloudPath); if (error || !data) throw Error('서버의 원본 파일을 가져오지 못했습니다. 연결 후 다시 열어 주세요.'); await verifyMaterialBlob(data, file); return data; }
  finally { client.auth.stopAutoRefresh(); }
}
export async function removeMaterialAudio(owner: Owner, file: MaterialFile): Promise<void> {
  if (!file.cloudPath) return;
  if (file.cloudPath !== materialCloudPath(owner, 'audio', file.sha256))
    throw Error('다른 공간의 녹음 파일은 정리할 수 없습니다.');
  const client = await authorizedClient(owner);
  try {
    const { error } = await client.storage.from(MATERIAL_BUCKET).remove([file.cloudPath]);
    if (error) throw Error('전사문은 저장했지만 서버의 녹음 정리를 마치지 못했습니다. 다시 자료 저장을 눌러 주세요.');
  } finally { client.auth.stopAutoRefresh(); }
}
