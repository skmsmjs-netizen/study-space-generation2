import { DomainError } from '../domain/model';

export interface CommandBodyLimits {
  maxBytes?: number;
  maxCodeUnits?: number;
}

const MAX_COMMAND_CODE_UNITS = 4_000_000;
// One UTF-16 code unit needs at most three UTF-8 bytes. Retain the existing
// character limit for Korean, emoji and older clients while bounding the wire.
const MAX_COMMAND_BYTES = MAX_COMMAND_CODE_UNITS * 3;
const tooLarge = () => new DomainError('TOO_LARGE', '한 번에 저장할 내용이 너무 큽니다. 원문은 이 기기에 남아 있습니다.');
const readFailure = () => new DomainError('SERVER_ERROR', '서버에 저장하지 못했습니다. 작성 내용은 이 기기에 남아 있습니다.');

/** Read without buffering an unbounded request before checking its size.
 * Limits may be narrowed by another caller (and bounded-stream regression tests).
 * Content-Length is only an early rejection hint; actual bytes are always counted.
 */
export async function readCommandRequestText(request: Request, limits: CommandBodyLimits = {}): Promise<string> {
  const maxBytes = limits.maxBytes ?? MAX_COMMAND_BYTES;
  const maxCodeUnits = limits.maxCodeUnits ?? MAX_COMMAND_CODE_UNITS;
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0 || !Number.isSafeInteger(maxCodeUnits) || maxCodeUnits < 0) throw readFailure();

  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  let cancelled = false;
  const cancel = () => {
    if (reader && !cancelled) {
      cancelled = true;
      // A stalled producer must not keep an oversized/aborted request alive.
      void reader.cancel().catch(() => undefined);
    }
  };
  let onAbort: (() => void) | undefined;
  try {
    reader = request.body?.getReader();
    if (request.signal.aborted) throw readFailure();
    const length = request.headers.get('content-length')?.trim();
    if (length && /^\d+$/.test(length) && Number(length) > maxBytes) throw tooLarge();
    if (!reader) return '';

    // Cancel closes the reader and resolves any pending read before the producer's
    // cancellation finishes. One listener suffices; no per-chunk abort reactions.
    onAbort = cancel;
    request.signal.addEventListener('abort', onAbort, { once: true });
    // Close the interval between the initial signal check and listener registration.
    if (request.signal.aborted) onAbort!();
    const decoder = new TextDecoder();
    const parts: string[] = [];
    // A tiny network chunk must not become a retained string/rope node. Copy
    // decoded units into fixed blocks and materialize one string per block.
    const block = new Uint16Array(32_768);
    let blockLength = 0;
    let byteLength = 0;
    let codeUnits = 0;
    const append = (text: string) => {
      codeUnits += text.length;
      if (codeUnits > maxCodeUnits) throw tooLarge();
      for (let index = 0; index < text.length; index++) {
        block[blockLength++] = text.charCodeAt(index);
        if (blockLength === block.length) {
          parts.push(String.fromCharCode(...block));
          blockLength = 0;
        }
      }
    };
    while (true) {
      const { value, done } = await reader.read();
      if (request.signal.aborted) throw readFailure();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > maxBytes) throw tooLarge();
      append(decoder.decode(value, { stream: true }));
    }
    append(decoder.decode());
    if (blockLength) parts.push(String.fromCharCode(...block.subarray(0, blockLength)));
    return parts.join('');
  } catch (error) {
    cancel();
    if (error instanceof DomainError) throw error;
    throw readFailure();
  } finally {
    if (onAbort) request.signal.removeEventListener('abort', onAbort);
    reader?.releaseLock();
  }
}
