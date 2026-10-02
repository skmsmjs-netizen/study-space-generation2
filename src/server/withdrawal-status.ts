import { validWithdrawalId } from './account-withdrawal';

const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
/** A random receipt reveals only completion, never the identity or stored data. */
export async function handleWithdrawalStatus(request: Request, status: (requestId: string) => Promise<{ withdrawn: boolean }>): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return new Response('{}', { status: 405, headers });
  try {
    // Bound unauthenticated input while reading, including chunked requests.
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    if (reader) try {
      while (true) { const part = await reader.read(); if (part.done) break; size += part.value.byteLength; if (size > 512) { await reader.cancel(); throw Error('request'); } chunks.push(part.value); }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!validWithdrawalId(body?.requestId)) return new Response('{}', { status: 400, headers });
    const result = await status(body.requestId);
    return new Response(JSON.stringify({ withdrawn: result.withdrawn === true }), { headers });
  } catch { return new Response('{}', { status: 503, headers }); }
}
