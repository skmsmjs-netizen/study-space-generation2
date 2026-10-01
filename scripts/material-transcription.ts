import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DomainError } from '../src/domain/model.ts';
import type { SourceSegment } from '../src/domain/study-material.ts';
const run = promisify(execFile);
const python = fileURLToPath(new URL('../.local/study-transcription/bin/python', import.meta.url));
const model = fileURLToPath(
  new URL('../.local/study-transcription-model/model.bin', import.meta.url),
);
export async function transcriptionAvailable() {
  try {
    await Promise.all([access(python), access(model)]);
    return true;
  } catch {
    return false;
  }
}
export async function transcribeMaterial(
  audio: Blob,
  signal?: AbortSignal,
): Promise<SourceSegment[]> {
  if (!(await transcriptionAvailable()))
    throw new DomainError(
      'TRANSCRIPTION_REQUIRED',
      '이 Mac의 받아쓰기 도구를 연결해 주세요. 원본 음성은 보관되어 있습니다.',
    );
  const directory = await mkdtemp(join(tmpdir(), 'study-lecture-'));
  try {
    const path = join(directory, 'audio');
    await writeFile(path, new Uint8Array(await audio.arrayBuffer()), { mode: 0o600 });
    const { stdout } = await run(
      python,
      [fileURLToPath(new URL('./transcribe-material.py', import.meta.url)), path],
      { signal, timeout: 30 * 60_000, maxBuffer: 4 * 1024 * 1024 },
    );
    const segments: SourceSegment[] = JSON.parse(stdout);
    if (!segments.length)
      throw new DomainError(
        'TRANSCRIPTION_EMPTY',
        '음성에서 발화를 확인하지 못했습니다. 원본을 재생해 확인해 주세요.',
      );
    return segments;
  } catch (error) {
    signal?.throwIfAborted();
    if (error instanceof DomainError) throw error;
    throw new DomainError(
      'TRANSCRIPTION_FAILED',
      '이 Mac에서 받아쓰기를 마치지 못했습니다. 원본은 보관되어 있습니다.',
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
