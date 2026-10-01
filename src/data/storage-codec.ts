import LZString from 'lz-string';
import { gzipSync, gunzipSync } from 'fflate';

const PREFIX = 'study-space:lz16:v1:';
const FAST_PREFIX = 'study-space:gzip15:v1:';
const BASE64_PREFIX = 'study-space:gzip16:v1:';
// localStorage stores UTF-16. Pack 15 bits into a safe code unit instead of
// paying two bytes for each six-bit Base64 character; avoid surrogate ranges.
function packBytes(bytes: Uint8Array): string {
  const units = new Uint16Array(Math.ceil(bytes.length * 8 / 15));
  let pending = 0, bits = 0, index = 0;
  for (const byte of bytes) {
    pending = (pending << 8) | byte; bits += 8;
    if (bits >= 15) { bits -= 15; units[index++] = 32 + ((pending >>> bits) & 32767); pending &= (1 << bits) - 1; }
  }
  if (bits) units[index] = 32 + (pending << (15 - bits));
  let packed = '';
  for (let i = 0; i < units.length; i += 8192) packed += String.fromCharCode(...units.subarray(i, i + 8192));
  return `${bytes.length}:${packed}`;
}
function unpackBytes(value: string): Uint8Array {
  const separator = value.indexOf(':'), header = value.slice(0, separator);
  if (!/^[1-9][0-9]*$/.test(header)) throw Error('Invalid storage size');
  const length = Number(header), packed = value.slice(separator + 1);
  if (!Number.isSafeInteger(length) || length > 512 * 1024 * 1024 || packed.length !== Math.ceil(length * 8 / 15)) throw Error('Invalid storage size');
  const bytes = new Uint8Array(length);
  let pending = 0, bits = 0, index = 0;
  for (let i = 0; i < packed.length; i++) {
    const unit = packed.charCodeAt(i) - 32;
    if (unit < 0 || unit > 32767) throw Error('Invalid storage unit');
    pending = (pending << 15) | unit; bits += 15;
    while (bits >= 8 && index < length) { bits -= 8; bytes[index++] = (pending >>> bits) & 255; pending &= (1 << bits) - 1; }
  }
  if (index !== length || pending !== 0) throw Error('Invalid storage padding');
  return bytes;
}
// RFC 1952 trailer: CRC-32 followed by the uncompressed byte length.
const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ value >>> 1 : value >>> 1;
  return value >>> 0;
});
function crc32(bytes: Uint8Array): number {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ value >>> 8;
  return (value ^ 0xffffffff) >>> 0;
}
/** Lossless UTF-16 encoding: raw input, revisions, IDs and coordinates remain exact. */
export function encodeStoredText(raw: string, threshold = 32_768): string {
  if (raw.length < threshold) return raw;
  // Preserve UTF-16 code units, including lone surrogates; TextEncoder would replace them.
  const bytes = new Uint8Array(raw.length * 2);
  for (let i = 0; i < raw.length; i++) { const unit = raw.charCodeAt(i); bytes[i * 2] = unit & 255; bytes[i * 2 + 1] = unit >>> 8; }
  const compressed = gzipSync(bytes, { level: 1, mtime: 0 });
  const encoded = FAST_PREFIX + packBytes(compressed);
  if (decodeStoredText(encoded) !== raw) throw new Error('저장할 원문을 확인하지 못했습니다. 기존 자료는 변경하지 않았습니다.');
  return encoded.length < raw.length ? encoded : raw;
}
export function decodeStoredText(stored: string): string {
  if (stored.startsWith(FAST_PREFIX) || stored.startsWith(BASE64_PREFIX)) {
    try {
      let compressed: Uint8Array;
      if (stored.startsWith(FAST_PREFIX)) compressed = unpackBytes(stored.slice(FAST_PREFIX.length));
      else {
        const binary = atob(stored.slice(BASE64_PREFIX.length)); compressed = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) compressed[i] = binary.charCodeAt(i);
      }
      if (compressed.length < 18) throw Error('Invalid gzip');
      const trailer = new DataView(compressed.buffer, compressed.length - 8, 8);
      const declaredSize = trailer.getUint32(4, true);
      if (declaredSize > 512 * 1024 * 1024 || declaredSize % 2) throw Error('Invalid storage size');
      const bytes = gunzipSync(compressed);
      if (bytes.length !== declaredSize || crc32(bytes) !== trailer.getUint32(0, true)) throw Error('Damaged gzip');
      const units = new Uint16Array(bytes.length / 2);
      for (let i = 0; i < units.length; i++) units[i] = bytes[i * 2] | bytes[i * 2 + 1] << 8;
      let raw = '';
      for (let i = 0; i < units.length; i += 8192) raw += String.fromCharCode(...units.subarray(i, i + 8192));
      return raw;
    } catch { throw new Error('압축된 자료를 읽지 못했습니다. 저장된 원문은 변경하지 않았습니다.'); }
  }
  if (!stored.startsWith(PREFIX)) return stored;
  const raw = LZString.decompressFromUTF16(stored.slice(PREFIX.length));
  if (raw === null || raw === '') throw new Error('압축된 자료를 읽지 못했습니다. 저장된 원문은 변경하지 않았습니다.');
  return raw;
}
