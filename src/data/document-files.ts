import type {AppState} from '../domain/model';
import {MAX_DOCUMENT_BYTES,type MaterialFile} from '../domain/material-source';
import {storagePrefix} from './repository';
import {verifyMaterialBlob} from './material-cloud';
import {access} from './material-file-db';
type Owner=Pick<AppState,'namespace'|'userId'>;
const materialKey=(owner:Owner,id:string)=>`${storagePrefix(owner)}:material:${encodeURIComponent(id)}`;
export async function keepDocumentFile(owner: Owner, file: File): Promise<MaterialFile> {
  if (!file.size || file.size > MAX_DOCUMENT_BYTES) throw Error('자료 파일은 50MB 이하로 넣어 주세요.');
  const bytes = await file.arrayBuffer();
  const sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x => x.toString(16).padStart(2, '0')).join('');
  const key = materialKey(owner, `document:${sha256}`);
  await access('files', 'readwrite', store => store.put({bytes,type:file.type || 'application/octet-stream'}, key));
  return { key, sha256, name: file.name, type: file.type || 'application/octet-stream', size: file.size };
}
export async function readDocumentFile(owner: Owner, file: MaterialFile): Promise<Blob | null> {
  if (file.key !== materialKey(owner, `document:${file.sha256}`)) throw Error('다른 공간의 자료 파일을 열 수 없습니다.');
  const saved = await access<Blob | {bytes:ArrayBuffer;type:string} | undefined>('files', 'readonly', store => store.get(file.key));
  const local = saved instanceof Blob ? saved : saved ? new Blob([saved.bytes],{type:saved.type}) : null;
  if (local) { await verifyMaterialBlob(local,file); return local; }
  if (!file.cloudPath) return null;
  const { downloadMaterialFile } = await import('./material-cloud');
  const downloaded = await downloadMaterialFile(owner, 'document', file);
  const downloadedBytes=await downloaded.arrayBuffer();
  await access('files', 'readwrite', store => store.put({bytes:downloadedBytes,type:downloaded.type}, file.key));
  return downloaded;
}
