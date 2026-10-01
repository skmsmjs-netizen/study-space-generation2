import { requireOwnerAI } from '../domain/ai-access';
import type { AppState } from '../domain/model';
import type { MaterialContent } from '../domain/study-material';
import {
  AUDIO_RATE,
  AUDIO_WINDOW_SECONDS,
  MAX_BROWSER_AUDIO_SECONDS,
  TRANSCRIPTION_VERSION,
  type TranscriptionCheckpoint,
} from '../domain/browser-transcription';
import {
  readAudio,
  readTranscriptionCheckpoint,
  writeTranscriptionCheckpoint,
} from './material-files';

async function durationOf(blob: Blob, signal: AbortSignal) {
  const audio = document.createElement('audio'),
    url = URL.createObjectURL(blob);
  try {
    return await new Promise<number>((resolve, reject) => {
      const timeout = setTimeout(
        () =>
          finish(Error('음성 길이를 확인하지 못했습니다. M4A·MP3·WAV 파일로 다시 가져와 주세요.')),
        15_000,
      );
      const abort = () => finish(signal.reason ?? new DOMException('중단했습니다.', 'AbortError'));
      const finish = (error?: unknown) => {
        clearTimeout(timeout);
        signal.removeEventListener('abort', abort);
        if (error) reject(error);
        else resolve(audio.duration);
      };
      audio.onloadedmetadata = () => finish();
      audio.onerror = () =>
        finish(Error('이 브라우저에서 음성을 읽지 못했습니다. 원본은 보관했습니다.'));
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) {
        abort();
        return;
      }
      audio.preload = 'metadata';
      audio.src = url;
    });
  } finally {
    audio.removeAttribute('src');
    audio.load();
    URL.revokeObjectURL(url);
  }
}
export async function transcribeInBrowser(
  owner: Pick<AppState, 'userId' | 'namespace'>,
  audio: NonNullable<MaterialContent['audio']>,
  signal: AbortSignal,
  progress: (checkpoint: TranscriptionCheckpoint | null, message: string) => void,
) {
  requireOwnerAI(owner);
  signal.throwIfAborted();
  let checkpoint = await readTranscriptionCheckpoint(owner, audio.sha256);
  if (checkpoint?.complete) return checkpoint;
  const blob = await readAudio(owner, audio);
  if (!blob) throw Error('이 기기에 원본 음성이 없습니다. 같은 파일을 가져와 주세요.');
  progress(checkpoint, '음성 길이를 확인하고 있습니다.');
  const duration = await durationOf(blob, signal);
  if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_BROWSER_AUDIO_SECONDS)
    throw Error(
      '기기 메모리를 보호하기 위해 받아쓰기는 20분 이하 파일로 처리합니다. 긴 원본은 그대로 보관하며, 나눈 파일을 가져와 주세요.',
    );
  signal.throwIfAborted();
  const decoder = new OfflineAudioContext(1, 1, AUDIO_RATE);
  const decoded = await decoder.decodeAudioData(await blob.arrayBuffer());
  signal.throwIfAborted();
  if (
    decoded.duration > MAX_BROWSER_AUDIO_SECONDS ||
    decoded.length > AUDIO_RATE * MAX_BROWSER_AUDIO_SECONDS
  )
    throw Error('이 음성을 한 번에 처리할 수 없습니다. 원본은 유지했습니다. 파일을 나누어 주세요.');
  const exactDuration = decoded.length / AUDIO_RATE;
  if (checkpoint && Math.abs(checkpoint.duration - exactDuration) > 0.0001)
    throw Error(
      '보관한 진행 내용과 음성 길이가 달라 이어 처리하지 않았습니다. 원본과 기존 사본은 유지했습니다.',
    );
  checkpoint ??= {
    version: TRANSCRIPTION_VERSION,
    audioHash: audio.sha256,
    duration: exactDuration,
    nextWindow: 0,
    segments: [],
    complete: false,
  };
  const worker = new Worker(new URL('./browser-transcription.worker.ts', import.meta.url), {
    type: 'module',
  });
  let leftScreen = false;
  const pause = () => {
    if (document.hidden) {
      leftScreen = true;
      worker.terminate();
    }
  };
  // iOS may suspend workers when backgrounded. Do not promise background continuation.
  document.addEventListener('visibilitychange', pause);
  try {
    for (
      let index = checkpoint.nextWindow;
      index < Math.ceil(exactDuration / AUDIO_WINDOW_SECONDS);
      index++
    ) {
      signal.throwIfAborted();
      if (leftScreen || document.hidden)
        throw Error(
          '화면을 떠나 받아쓰기를 멈췄습니다. 다시 열고 이어 처리해 주세요. 보관한 구간은 유지했습니다.',
        );
      const start = index * AUDIO_WINDOW_SECONDS,
        end = Math.min(start + AUDIO_WINDOW_SECONDS, exactDuration);
      const samples = new Float32Array(Math.ceil((end - start) * AUDIO_RATE));
      for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
        const source = decoded.getChannelData(channel);
        for (let at = 0; at < samples.length; at++)
          samples[at] +=
            (source[index * AUDIO_WINDOW_SECONDS * AUDIO_RATE + at] ?? 0) /
            decoded.numberOfChannels;
      }
      const text = await new Promise<string>((resolve, reject) => {
        const finish = (error: unknown, text = '') => {
          clearTimeout(timeout);
          signal.removeEventListener('abort', abort);
          document.removeEventListener('visibilitychange', hidden);
          worker.onmessage = null;
          worker.onerror = null;
          if (error) reject(error);
          else resolve(text);
        };
        const abort = () =>
          finish(signal.reason ?? new DOMException('중단했습니다.', 'AbortError'));
        const hidden = () => {
          if (document.hidden)
            finish(
              Error('화면을 떠나 받아쓰기를 멈췄습니다. 보관한 구간에서 이어 처리할 수 있습니다.'),
            );
        };
        const timeout = setTimeout(
          () =>
            finish(
              Error(
                '이 구간의 처리 시간이 길어 중단했습니다. 보관한 구간에서 다시 이어 처리해 주세요.',
              ),
            ),
          5 * 60_000,
        );
        signal.addEventListener('abort', abort, { once: true });
        document.addEventListener('visibilitychange', hidden);
        worker.onerror = (event) => {
          if (import.meta.env.DEV)
            console.error('transcription_worker_load_failure', event.message);
          finish(Error('받아쓰기 도구를 실행하지 못했습니다. 원본과 이전 구간은 보관했습니다.'));
        };
        worker.onmessage = (event: MessageEvent) => {
          if (event.data.type === 'loading')
            progress(
              checkpoint,
              '받아쓰기 도구를 내려받고 있습니다. 음성은 외부로 보내지 않습니다.',
            );
          if (event.data.type === 'error') finish(Error(event.data.message));
          if (event.data.type === 'result') {
            if (typeof event.data.text !== 'string')
              finish(Error('받아쓴 내용의 형식을 확인하지 못했습니다.'));
            else finish(null, event.data.text);
          }
        };
        worker.postMessage({ samples }, [samples.buffer]);
      });
      signal.throwIfAborted();
      const next: TranscriptionCheckpoint = {
        ...checkpoint,
        nextWindow: index + 1,
        segments: [...checkpoint.segments, { start, end, text }],
        complete: index + 1 === Math.ceil(exactDuration / AUDIO_WINDOW_SECONDS),
      };
      // A segment is considered retained only after the IDB transaction commits.
      await writeTranscriptionCheckpoint(owner, next);
      checkpoint = next;
      progress(
        checkpoint,
        `${Math.round(end)}초 / ${Math.round(exactDuration)}초를 받아써 이 기기에 보관했습니다.`,
      );
    }
    return checkpoint;
  } finally {
    document.removeEventListener('visibilitychange', pause);
    worker.terminate();
  }
}
