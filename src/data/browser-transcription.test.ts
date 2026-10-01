// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import {
  TRANSCRIPTION_VERSION,
  type TranscriptionCheckpoint,
} from '../domain/browser-transcription';
import { transcribeInBrowser } from './browser-transcription';
import {
  clearMaterialFilesForOwner,
  readTranscriptionCheckpoint,
  writeTranscriptionCheckpoint,
} from './material-files';

const owner = { userId: AI_OWNER_USER_ID, namespace: 'personal' as const };
const hash = 'a'.repeat(64);
const row: TranscriptionCheckpoint = {
  version: TRANSCRIPTION_VERSION,
  audioHash: hash,
  duration: 45,
  nextWindow: 1,
  segments: [{ start: 0, end: 30, text: '조건과 예외\n원문 유지' }],
  complete: false,
};
beforeEach(() => {
  vi.stubGlobal('indexedDB', new IDBFactory());
});
it('retains an exact committed window after interruption, edits after completion, and separates withdrawal owners', async () => {
  await writeTranscriptionCheckpoint(owner, row);
  expect(await readTranscriptionCheckpoint(owner, hash)).toEqual(row);
  expect(await readTranscriptionCheckpoint({ ...owner, userId: 'other' }, hash)).toBeNull();
  const complete = {
    ...row,
    nextWindow: 2,
    complete: true,
    segments: [...row.segments, { start: 30, end: 45, text: '' }],
    editedText: '사용자 수정\n예외 보존',
  };
  await writeTranscriptionCheckpoint(owner, complete);
  await writeTranscriptionCheckpoint({ ...owner, userId: 'other' }, complete);
  await clearMaterialFilesForOwner(owner);
  expect(await readTranscriptionCheckpoint(owner, hash)).toBeNull();
  expect((await readTranscriptionCheckpoint({ ...owner, userId: 'other' }, hash))?.editedText).toBe(
    complete.editedText,
  );
});
it('rejects a skipped or forged checkpoint without overwriting the committed source', async () => {
  await writeTranscriptionCheckpoint(owner, row);
  await expect(writeTranscriptionCheckpoint(owner, { ...row, complete: true })).rejects.toThrow();
  await expect(writeTranscriptionCheckpoint(owner, { ...row, nextWindow: 2 })).rejects.toThrow();
  expect(await readTranscriptionCheckpoint(owner, hash)).toEqual(row);
});
it('rejects nonowners before reading source audio, starting a worker or downloading a model', async () => {
  await expect(
    transcribeInBrowser(
      { ...owner, userId: 'other-admin' },
      { key: 'private', name: '음성.wav', type: 'audio/wav', size: 10, sha256: hash },
      new AbortController().signal,
      vi.fn(),
    ),
  ).rejects.toMatchObject({ code: 'AI_OWNER_REQUIRED' });
});
it('reuses complete retained transcription without decoding audio or invoking the worker again', async () => {
  const complete = { ...row, duration: 30, complete: true };
  await writeTranscriptionCheckpoint(owner, complete);
  expect(
    await transcribeInBrowser(
      owner,
      { key: 'unneeded', name: '음성.wav', type: 'audio/wav', size: 10, sha256: hash },
      new AbortController().signal,
      vi.fn(),
    ),
  ).toEqual(complete);
});
