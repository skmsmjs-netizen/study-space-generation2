import { MAX_AUDIO_BYTES, type MaterialContent } from '../domain/study-material';
import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { MAX_DOCUMENT_BYTES, type MaterialFile } from '../domain/material-source';
import { TRANSCRIPTION_VERSION, validateTranscriptionCheckpoint, type TranscriptionCheckpoint } from '../domain/browser-transcription';

export const MATERIAL_DB = 'study-space-material-files';
type Owner = Pick<AppState, 'namespace' | 'userId'>;
export const materialKey = (owner: Owner, id: string) =>
  `${storagePrefix(owner)}:material:${encodeURIComponent(id)}`;
import {access,database} from './material-file-db';
export function audioMime(file: Pick<File, 'name' | 'type'>): string {
  const known: Record<string, string> = {
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    mp4: 'audio/mp4',
    wav: 'audio/wav',
    webm: 'audio/webm',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    flac: 'audio/flac',
  };
  const ext = file.name.toLowerCase().split('.').pop() ?? '';
  const mime = file.type.split(';')[0];
  if (Object.values(known).includes(mime)) return mime;
  if (known[ext]) return known[ext];
  throw Error('MP3·M4A·WAV·WebM·OGG·AAC·FLAC 음성 파일을 골라 주세요.');
}
export async function keepAudio(
  owner: Owner,
  file: File,
): Promise<NonNullable<MaterialContent['audio']>> {
  if (!file.size || file.size > MAX_AUDIO_BYTES)
    throw Error('음성은 50MB 이하의 파일로 넣어 주세요.');
  const type = audioMime(file),
    bytes = await file.arrayBuffer();
  const sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
  const key = materialKey(owner, `audio:${sha256}`);
  await access('files', 'readwrite', (store) => store.put(new Blob([bytes], { type }), key));
  return { key, name: file.name, type, size: file.size, sha256 };
}
export async function readAudio(
  owner: Owner,
  audio: NonNullable<MaterialContent['audio']>,
): Promise<Blob | null> {
  if (audio.key !== materialKey(owner, `audio:${audio.sha256}`))
    throw Error('다른 공간의 음성 파일을 열 수 없습니다.');
  const blob = await access<Blob | undefined>('files', 'readonly', (store) => store.get(audio.key));
  if (blob) return blob;
  if (!audio.cloudPath) return null;
  const { downloadMaterialFile } = await import('./material-cloud');
  const downloaded = await downloadMaterialFile(owner, 'audio', audio);
  await access('files', 'readwrite', store => store.put(downloaded, audio.key));
  return downloaded;
}
export {keepDocumentFile,readDocumentFile} from './document-files';
export interface MaterialDraft {
  view?: import('../domain/study-gpt-contract').MaterialView;
  materialId?: string;
  content: MaterialContent;
  baseVersion: number;
  recordingId?: string;
  audioRecordingId?: string;
  audioCleanup?: { audio: NonNullable<MaterialContent['audio']>; text: string; recordingId?: string };
  updatedAt: string;
}
export function readMaterialDraft(owner: Owner, id: string) {
  return access<MaterialDraft | undefined>('drafts', 'readonly', (store) =>
    store.get(materialKey(owner, id)),
  );
}
export function writeMaterialDraft(owner: Owner, id: string, content: MaterialDraft) {
  return access('drafts', 'readwrite', (store) => store.put(content, materialKey(owner, id)));
}
export function clearMaterialDraft(owner: Owner, id: string) {
  return access('drafts', 'readwrite', (store) => store.delete(materialKey(owner, id)));
}
const transcriptionKey = (owner: Owner, hash: string) => materialKey(owner, `transcription:${hash}:${TRANSCRIPTION_VERSION}`);
export async function readTranscriptionCheckpoint(owner: Owner, hash: string) {
  const value = await access<unknown>('drafts', 'readonly', (store) => store.get(transcriptionKey(owner, hash)));
  if (value === undefined) return null;
  validateTranscriptionCheckpoint(value, hash);
  return value;
}
export async function writeTranscriptionCheckpoint(owner: Owner, value: TranscriptionCheckpoint) {
  validateTranscriptionCheckpoint(value, value.audioHash);
  await access('drafts', 'readwrite', (store) => store.put(value, transcriptionKey(owner, value.audioHash)));
}
/** Caller must first acknowledge the confirmed transcript's durable material save. */
export async function removeTranscribedAudio(
  owner: Owner,
  audio: NonNullable<MaterialContent['audio']>,
  text: string,
  draftId: string,
  otherMaterialUsesAudio: boolean,
  recordingId?: string,
): Promise<boolean> {
  if (audio.key !== materialKey(owner, `audio:${audio.sha256}`))
    throw Error('다른 공간의 녹음 파일은 정리할 수 없습니다.');
  const checkpoint = await readTranscriptionCheckpoint(owner, audio.sha256);
  if (!checkpoint?.complete || checkpoint.retainAudio || !text.trim() ||
      (checkpoint.editedText ?? checkpoint.segments.map(row => row.text).join('\n')) !== text)
    throw Error('확인한 전사문을 읽지 못해 녹음을 지우지 않았습니다.');
  const db = await database();
  try {
    return await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(['files', 'drafts', 'recordings'], 'readwrite');
      let shared = otherMaterialUsesAudio;
      const prefix = `${storagePrefix(owner)}:material:`;
      const cursorRequest = tx.objectStore('drafts').openCursor();
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (cursor) {
          if (typeof cursor.key === 'string' && cursor.key.startsWith(prefix) &&
              cursor.key !== materialKey(owner, draftId) &&
              (cursor.value as MaterialDraft)?.content?.audio?.key === audio.key) shared = true;
          cursor.continue();
          return;
        }
        if (!shared) tx.objectStore('files').delete(audio.key);
        if (recordingId) {
          const chunkPrefix = `${materialKey(owner, recordingId)}:`;
          tx.objectStore('recordings').delete(IDBKeyRange.bound(chunkPrefix, `${chunkPrefix}\uffff`));
        }
      };
      tx.oncomplete = () => resolve(!shared);
      tx.onabort = () => reject(Error('전사문은 저장했지만 녹음 파일 정리를 마치지 못했습니다. 다시 자료 저장을 눌러 주세요.'));
      tx.onerror = () => reject(Error('녹음 파일 정리를 마치지 못했습니다. 전사문은 유지했습니다.'));
    });
  } finally { db.close(); }
}
export function keepRecordingChunk(owner: Owner, id: string, index: number, blob: Blob) {
  return access('recordings', 'readwrite', (store) =>
    store.put(blob, `${materialKey(owner, id)}:${String(index).padStart(8, '0')}`),
  );
}
export async function recoverRecording(owner: Owner, id: string): Promise<Blob | null> {
  const prefix = `${materialKey(owner, id)}:`;
  const chunks = await access<Blob[]>('recordings', 'readonly', (store) =>
    store.getAll(IDBKeyRange.bound(prefix, `${prefix}\uffff`)),
  );
  return chunks.length ? new Blob(chunks, { type: chunks[0].type }) : null;
}
export async function clearMaterialFilesForOwner(owner: Owner, factory?: IDBFactory) {
  const prefix = `${storagePrefix(owner)}:material:`,
    db = await database(factory);
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['files', 'drafts', 'recordings'], 'readwrite');
      for (const name of ['files', 'drafts', 'recordings']) {
        const request = tx.objectStore(name).openCursor();
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            if (typeof cursor.key === 'string' && cursor.key.startsWith(prefix)) cursor.delete();
            cursor.continue();
          }
        };
      }
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(Error('이 계정의 음성 보관 자료를 정리하지 못했습니다.'));
    });
  } finally {
    db.close();
  }
}
