import { DomainError } from './model';

export const TRANSCRIPTION_MODEL = 'Xenova/whisper-small';
export const TRANSCRIPTION_REVISION = '2d67713f236afa48a18992566e7647f6ca848e13';
export const TRANSCRIPTION_VERSION = `whisper-small:${TRANSCRIPTION_REVISION}:ko:q8:30s:v1`;
export const AUDIO_RATE = 16_000;
export const AUDIO_WINDOW_SECONDS = 30;
// Bound decoded PCM memory before attempting mobile decoding. Original files remain untouched.
export const MAX_BROWSER_AUDIO_SECONDS = 20 * 60;
export interface TranscriptionCheckpoint {
  version: string;
  audioHash: string;
  duration: number;
  nextWindow: number;
  segments: { start: number; end: number; text: string }[];
  complete: boolean;
  editedText?: string;
  retainAudio?: boolean;
}
export function validateTranscriptionCheckpoint(
  value: unknown,
  hash: string,
): asserts value is TranscriptionCheckpoint {
  const row = value as TranscriptionCheckpoint;
  const fail = () => {
    throw new DomainError(
      'TRANSCRIPTION_STORAGE',
      '보관한 받아쓰기 진행 내용을 확인하지 못했습니다. 기존 사본을 덮어쓰지 않았습니다.',
    );
  };
  if (
    !row ||
    row.version !== TRANSCRIPTION_VERSION ||
    row.audioHash !== hash ||
    !Number.isFinite(row.duration) ||
    row.duration <= 0 ||
    row.duration > MAX_BROWSER_AUDIO_SECONDS ||
    !Number.isInteger(row.nextWindow) ||
    row.nextWindow < 0 ||
    row.nextWindow > Math.ceil(row.duration / AUDIO_WINDOW_SECONDS) ||
    !Array.isArray(row.segments) ||
    row.segments.length !== row.nextWindow ||
    typeof row.complete !== 'boolean' ||
    row.complete !== (row.nextWindow === Math.ceil(row.duration / AUDIO_WINDOW_SECONDS)) ||
    (row.retainAudio !== undefined && typeof row.retainAudio !== 'boolean') ||
    (row.editedText !== undefined &&
      (typeof row.editedText !== 'string' || row.editedText.length > 150_000))
  )
    fail();
  let length = 0;
  for (const [index, segment] of row.segments.entries()) {
    if (
      !segment ||
      segment.start !== index * AUDIO_WINDOW_SECONDS ||
      segment.end !== Math.min((index + 1) * AUDIO_WINDOW_SECONDS, row.duration) ||
      typeof segment.text !== 'string' ||
      segment.text.length > 15_000
    )
      fail();
    length += segment.text.length;
  }
  if (length > 150_000) fail();
}
