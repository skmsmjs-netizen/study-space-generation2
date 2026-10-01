import { requireOwnerAI } from '../domain/ai-access';
import type { AppState } from '../domain/model';
import { MAX_PHOTO_BYTES, type PhotoInput, type PhotoReference } from '../domain/photo-outline';
import { readDocumentFile } from './material-files';
/** Decode/resize only. No OCR or recognition model executes on this device. */
export async function preparePhoto(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  photo: PhotoReference,
  signal: AbortSignal,
): Promise<PhotoInput> {
  requireOwnerAI(owner);
  signal.throwIfAborted();
  const blob = await readDocumentFile(owner, photo.file);
  if (!blob) throw Error('이 기기에 원본 사진이 없습니다. 같은 사진을 다시 가져와 주세요.');
  const url = URL.createObjectURL(blob),
    image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      const abort = () => reject(Error('사진 준비를 중단했습니다. 원본은 보관했습니다.'));
      signal.addEventListener('abort', abort, { once: true });
      image.onload = () => {
        signal.removeEventListener('abort', abort);
        resolve();
      };
      image.onerror = () => {
        signal.removeEventListener('abort', abort);
        reject(Error('사진을 열지 못했습니다. JPEG·PNG·WebP 사진으로 다시 가져와 주세요.'));
      };
      image.src = url;
    });
    signal.throwIfAborted();
    if (!image.naturalWidth || !image.naturalHeight)
      throw Error('사진 크기를 확인하지 못했습니다.');
    const scale = Math.min(1, 2048 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw Error('사진을 준비하지 못했습니다.');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const normalized = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(Error('사진을 준비하지 못했습니다.'))),
          'image/jpeg',
          0.9,
        ),
      );
      if (normalized.size > MAX_PHOTO_BYTES)
        throw Error(
          '전송할 사진이 큽니다. 필요한 영역만 찍거나 사진 크기를 줄여 다시 가져와 주세요. 원본은 보관했습니다.',
        );
      const bytes = await normalized.arrayBuffer(),
        sha256 = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('');
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(Error('사진을 전송할 준비를 마치지 못했습니다.'));
        reader.readAsDataURL(normalized);
      });
      signal.throwIfAborted();
      return { id: photo.id, sha256, dataUrl };
    } finally {
      canvas.width = canvas.height = 0;
    }
  } finally {
    image.src = '';
    URL.revokeObjectURL(url);
  }
}
