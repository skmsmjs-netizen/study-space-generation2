import type { PhotoInput } from '../../src/domain/photo-outline';
export { preparePhoto } from '../../src/data/photo-images';
export async function generatePhotoOutline(_owner: unknown, photos: PhotoInput[]) {
  localStorage.setItem(
    'synthetic-photo-calls',
    String(Number(localStorage.getItem('synthetic-photo-calls') ?? 0) + 1),
  );
  const rows = [
    {
      id: 'unit',
      parentId: null,
      name: '직류 회로',
      content: '',
      page: '12',
      photoIds: [photos[0].id],
      uncertain: false,
    },
    {
      id: 'topic',
      parentId: 'unit',
      name: '옴의 법칙',
      content: 'V=IR. 저항이 일정할 때만 비례한다. 온도 변화는 따로 확인한다.',
      page: '13',
      photoIds: [photos[0].id],
      uncertain: true,
    },
  ];
  return {
    id: 'synthetic-photo-result',
    at: '2026-10-01T00:00:00Z',
    model: 'synthetic',
    promptVersion: 'photo-outline-20261001-v1',
    title: '사진 회로 목차',
    rows,
    warnings: ['합성 결과: 원본의 조건과 예외를 확인합니다.'],
    sources: photos.map((p) => ({ id: p.id, sha256: p.sha256 })),
  };
}
