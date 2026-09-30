import LZString from 'lz-string';

const PREFIX = 'study-space:lz16:v1:';
/** Lossless UTF-16 encoding: raw input, revisions, IDs and coordinates remain exact. */
export function encodeStoredText(raw: string, threshold = 32_768): string {
  if (raw.length < threshold) return raw;
  const encoded = PREFIX + LZString.compressToUTF16(raw);
  if (decodeStoredText(encoded) !== raw) throw new Error('저장할 원문을 확인하지 못했습니다. 기존 자료는 변경하지 않았습니다.');
  return encoded.length < raw.length ? encoded : raw;
}
export function decodeStoredText(stored: string): string {
  if (!stored.startsWith(PREFIX)) return stored;
  const raw = LZString.decompressFromUTF16(stored.slice(PREFIX.length));
  if (raw === null || raw === '') throw new Error('압축된 자료를 읽지 못했습니다. 저장된 원문은 변경하지 않았습니다.');
  return raw;
}
