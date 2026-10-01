// ArrayBuffer uses IndexedDB structured clone without file-backed Blob preparation.
// The public readers still return Blob, including rows from earlier versions.
type Binary = { format: 'study-space-binary-v1'; type: string; bytes: ArrayBuffer };
const byteLength = Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength')!.get!;
function isBuffer(value: unknown): value is ArrayBuffer {
  // IndexedDB / another window can return a buffer with a different prototype.
  // The native getter checks its internal buffer slot without relying on instanceof.
  try { byteLength.call(value); return true; } catch { return false; }
}
export async function encodeBinary(value: unknown): Promise<unknown> {
  if (value instanceof Blob) return { format: 'study-space-binary-v1', type: value.type, bytes: await value.arrayBuffer() } satisfies Binary;
  if (Array.isArray(value)) return Promise.all(value.map(encodeBinary));
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const entries = await Promise.all(Object.entries(value).map(async ([key, nested]) => [key, await encodeBinary(nested)] as const));
    return Object.fromEntries(entries);
  }
  return value;
}
export function decodeBinary<T = unknown>(value: unknown): T {
  if (value && typeof value === 'object' && 'type' in value && typeof value.type === 'string' && 'bytes' in value && isBuffer(value.bytes) && (('format' in value && value.format === 'study-space-binary-v1') || Object.keys(value).length === 2)) return new Blob([value.bytes], { type: value.type }) as T;
  if (Array.isArray(value)) return value.map(item => decodeBinary(item)) as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, decodeBinary(nested)])) as T;
  return value as T;
}
