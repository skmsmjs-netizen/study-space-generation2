// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { readCommandRequestText } from './request-body';

const encoder = new TextEncoder();
function streamed(chunks: Uint8Array[], headers: HeadersInit = {}, signal?: AbortSignal) {
  let index = 0;
  const cancel = vi.fn();
  const pull = vi.fn((controller: ReadableStreamDefaultController<Uint8Array>) => {
    if (index < chunks.length) controller.enqueue(chunks[index++]);
    else controller.close();
  });
  const body = new ReadableStream<Uint8Array>({ pull, cancel }, { highWaterMark: 0 });
  const request = new Request('https://test.invalid', { method: 'POST', body, headers, signal, duplex: 'half' } as RequestInit);
  return { request, cancel, pull };
}

describe('bounded command request body', () => {
  it('keeps Korean, emoji and a split BOM identical to Request.text()', async () => {
    const bytes = encoder.encode('\uFEFF{"memo":"한글 😀\n원문"}');
    const chunks = [...bytes].map(byte => Uint8Array.of(byte));
    const { request } = streamed(chunks);
    expect(await readCommandRequestText(request)).toBe(await new Request('https://test.invalid', { method: 'POST', body: bytes }).text());
  });

  it('matches Request.text replacement decoding across invalid and trailing UTF-8', async () => {
    const bytes = Uint8Array.of(0x41, 0xf0, 0x9f, 0x42, 0xe3, 0x81);
    const { request } = streamed([...bytes].map(byte => Uint8Array.of(byte)));
    expect(await readCommandRequestText(request)).toBe(await new Response(bytes).text());
  });

  it.each([undefined, '1', 'invalid', '-1'])('measures streamed bytes despite content-length %s and cancels before reading the rest', async length => {
    const { request, cancel, pull } = streamed([encoder.encode('한'), encoder.encode('글'), encoder.encode('남은 원문')], length === undefined ? {} : { 'content-length': length });
    await expect(readCommandRequestText(request, { maxBytes: 5, maxCodeUnits: 20 })).rejects.toMatchObject({ code: 'TOO_LARGE' });
    expect(cancel).toHaveBeenCalledOnce();
    expect(pull).toHaveBeenCalledTimes(2);
  });

  it('rejects a declared oversized body without reading its first chunk', async () => {
    const { request, cancel, pull } = streamed([encoder.encode('{}')], { 'content-length': '6' });
    await expect(readCommandRequestText(request, { maxBytes: 5 })).rejects.toMatchObject({ code: 'TOO_LARGE' });
    expect(cancel).toHaveBeenCalledOnce();
    expect(pull).not.toHaveBeenCalled();
  });

  it('accepts exactly both limits and measures UTF-16 units rather than code points', async () => {
    const { request } = streamed([encoder.encode('한'), encoder.encode('😀')], { 'content-length': '7' });
    expect(await readCommandRequestText(request, { maxBytes: 7, maxCodeUnits: 3 })).toBe('한😀');
    const tooLong = streamed([encoder.encode('한'), encoder.encode('😀'), encoder.encode('남은 원문')]);
    await expect(readCommandRequestText(tooLong.request, { maxBytes: 20, maxCodeUnits: 2 })).rejects.toMatchObject({ code: 'TOO_LARGE' });
    expect(tooLong.cancel).toHaveBeenCalledOnce();
    expect(tooLong.pull).toHaveBeenCalledTimes(2);
  });

  it('preserves the existing production limit for four million Korean code units', async () => {
    const text = '한'.repeat(4_000_000);
    expect(await readCommandRequestText(new Request('https://test.invalid', { method: 'POST', body: text }))).toBe(text);
    await expect(readCommandRequestText(new Request('https://test.invalid', { method: 'POST', body: `${text}a` }))).rejects.toMatchObject({ code: 'TOO_LARGE' });
  });

  it('preserves text across fixed blocks with more than seventy thousand one-byte chunks', async () => {
    const text = `{"memo":"${'a'.repeat(32_767)}😀${'b'.repeat(40_000)}한글"}`;
    const chunks = [...encoder.encode(text)].map(byte => Uint8Array.of(byte));
    expect(await readCommandRequestText(streamed(chunks).request)).toBe(text);
    const limited = streamed(chunks);
    await expect(readCommandRequestText(limited.request, { maxCodeUnits: 40_000 })).rejects.toMatchObject({ code: 'TOO_LARGE' });
    expect(limited.cancel).toHaveBeenCalledOnce();
    expect(limited.pull.mock.calls.length).toBeLessThan(chunks.length);
  });

  it('still aborts after tens of thousands of one-byte chunks', async () => {
    const abort = new AbortController();
    let chunksRead = 0;
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(Uint8Array.of(0x61));
        if (++chunksRead === 40_000) abort.abort();
      },
      cancel,
    }, { highWaterMark: 0 });
    const request = new Request('https://test.invalid', { method: 'POST', body, signal: abort.signal, duplex: 'half' } as RequestInit);
    await expect(readCommandRequestText(request)).rejects.toMatchObject({ code: 'SERVER_ERROR' });
    expect(chunksRead).toBe(40_000);
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('returns an empty string for an absent body', async () => {
    expect(await readCommandRequestText(new Request('https://test.invalid', { method: 'POST' }))).toBe('');
  });

  it('reports an underlying stream read failure without exposing its content', async () => {
    const body = new ReadableStream<Uint8Array>({ pull(controller) { controller.error(Error('private body must not escape')); } }, { highWaterMark: 0 });
    const request = new Request('https://test.invalid', { method: 'POST', body, duplex: 'half' } as RequestInit);
    await expect(readCommandRequestText(request)).rejects.toMatchObject({ code: 'SERVER_ERROR', message: '서버에 저장하지 못했습니다. 작성 내용은 이 기기에 남아 있습니다.' });
  });

  it('cancels and rejects when already aborted without pulling body data', async () => {
    const abort = new AbortController();
    abort.abort();
    const { request, cancel, pull } = streamed([encoder.encode('원문')], {}, abort.signal);
    await expect(readCommandRequestText(request)).rejects.toMatchObject({ code: 'SERVER_ERROR' });
    expect(cancel).toHaveBeenCalledOnce();
    expect(pull).not.toHaveBeenCalled();
  });

  it('interrupts a stalled read and does not wait for a stalled producer cancellation', async () => {
    const abort = new AbortController();
    let started!: () => void;
    const pulling = new Promise<void>(resolve => { started = resolve; });
    const cancel = vi.fn(() => new Promise<void>(() => undefined));
    const body = new ReadableStream<Uint8Array>({ pull() { started(); }, cancel }, { highWaterMark: 0 });
    const request = new Request('https://test.invalid', { method: 'POST', body, signal: abort.signal, duplex: 'half' } as RequestInit);
    const result = readCommandRequestText(request);
    const assertion = expect(result).rejects.toMatchObject({ code: 'SERVER_ERROR' });
    await pulling;
    abort.abort(Error('private abort reason'));
    await assertion;
    expect(cancel).toHaveBeenCalledOnce();
  });
});
