// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { encodeBinary, decodeBinary } from './binary-storage';
import { keepAudio, readAudio, keepRecordingChunk, recoverRecording } from './material-files';
import { access } from './material-file-db';
afterEach(() => vi.unstubAllGlobals());
it('roundtrips exact nested binary bytes and MIME while preserving old Blob rows and original text', async () => {
  const blob = new Blob([new Uint8Array([0, 255, 13, 10, 128])], { type: 'audio/wav' });
  const original = { body: '  원문\ud800\u0000  ', nested: [blob], missing: undefined };
  const stored = await encodeBinary(original);
  expect((stored as typeof original).nested[0]).not.toBeInstanceOf(Blob);
  const restored = decodeBinary<typeof original>(structuredClone(stored));
  expect(restored.body).toBe(original.body); expect(restored.missing).toBeUndefined();
  expect(restored.nested[0].type).toBe(blob.type); expect(await restored.nested[0].arrayBuffer()).toEqual(await blob.arrayBuffer());
  expect(decodeBinary(blob)).toBe(blob);
  expect(await decodeBinary<Blob>({ bytes: await blob.arrayBuffer(), type: blob.type }).arrayBuffer()).toEqual(await blob.arrayBuffer());
});
it('retains audio identity and ordered interrupted recordings across both storage representations', async () => {
  vi.stubGlobal('indexedDB', new IDBFactory()); vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  const owner = { userId: 'demo-learner', namespace: 'demo' as const }, file = new File(['原본\n  '], '원본.wav', { type: 'audio/wav' });
  const ref = await keepAudio(owner, file);
  expect(await (await readAudio(owner, ref))!.text()).toBe(await file.text());
  // A previously installed version wrote Blob directly. No migration or deletion is required.
  await access('files', 'readwrite', store => store.put(new Blob([awaitText], { type: 'audio/wav' }), ref.key));
  expect(await (await readAudio(owner, ref))!.text()).toBe(awaitText);
  await keepRecordingChunk(owner, 'unfinished', 1, new Blob(['후반  '], { type: 'audio/webm' }));
  await keepRecordingChunk(owner, 'unfinished', 0, new Blob(['전반\n'], { type: 'audio/webm' }));
  const recording = await recoverRecording(owner, 'unfinished');
  expect(recording!.type).toBe('audio/webm'); expect(await recording!.text()).toBe('전반\n후반  ');
});
const awaitText = '原본\n  ';
