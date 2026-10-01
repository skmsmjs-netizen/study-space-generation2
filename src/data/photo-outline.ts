import { requireOwnerAI } from '../domain/ai-access';
import type { AppState } from '../domain/model';
import {
  validatePhotoInput,
  validatePhotoResult,
  type PhotoInput,
  type PhotoOutlineResult,
} from '../domain/photo-outline';
import { localAIStatus, studyAIRequestTarget } from './study-ai';
export { preparePhoto } from './photo-images';
export async function generatePhotoOutline(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  photos: PhotoInput[],
  signal: AbortSignal,
): Promise<PhotoOutlineResult> {
  requireOwnerAI(owner);
  validatePhotoInput(photos);
  signal.throwIfAborted();
  const connection = await localAIStatus(owner, signal);
  if (!connection.configured)
    throw Error(
      connection.connectionError || 'GPT 연결에서 API 사용을 확인해 주세요. 사진은 보관했습니다.',
    );
  const target = await studyAIRequestTarget(owner, connection, '/photo-outline');
  const response = await fetch(target.url, {
    method: 'POST',
    headers: { ...target.headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: owner.userId, namespace: owner.namespace, photos }),
    signal,
  });
  const body = await response.json().catch(() => null);
  if (!response.ok)
    throw Error(
      typeof body?.message === 'string'
        ? body.message
        : '사진 분석을 마치지 못했습니다. 자동으로 다시 호출하지 않았습니다.',
    );
  validatePhotoResult(body?.result);
  if (
    body.result.sources.length !== photos.length ||
    body.result.sources.some(
      (s: { id: string; sha256: string }, i: number) =>
        s.id !== photos[i].id || s.sha256 !== photos[i].sha256,
    )
  )
    throw Error('요청한 사진과 결과가 달라 초안에 적용하지 않았습니다.');
  return body.result;
}
