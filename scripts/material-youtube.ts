import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { canonicalYouTubeURL } from '../src/domain/material-source.ts';
export async function youtubeSubtitles(raw: string, signal: AbortSignal): Promise<{ title: string; text: string }> {
  const url = canonicalYouTubeURL(raw), id = new URL(url).searchParams.get('v')!;
  return new Promise((resolve, reject) => {
    const process = spawn(fileURLToPath(new URL('../.local/study-transcription/bin/python', import.meta.url)), [fileURLToPath(new URL('./youtube-subtitles.py', import.meta.url)), id], { stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; const timeout = setTimeout(() => process.kill('SIGKILL'), 45000);
    const abort = () => process.kill('SIGKILL'); signal.addEventListener('abort', abort, { once: true });
    process.stdout.on('data', bytes => { output += bytes.toString(); if (output.length > 6_000_000) process.kill('SIGKILL'); });
    // Never expose third-party responses or private request details in the UI/log.
    process.stderr.resume();
    process.on('error', () => reject(Error('자막 도구를 실행하지 못했습니다. 자막 파일이나 내용을 가져와 주세요.')));
    process.on('close', code => {
      clearTimeout(timeout); signal.removeEventListener('abort', abort);
      if (signal.aborted) { reject(signal.reason); return; }
      if (code !== 0) { reject(Error('이 영상의 자막을 가져오지 못했습니다. 자막이 없거나 영상 서비스가 접근을 막았을 수 있습니다. SRT·VTT 파일이나 자막 내용을 가져와 주세요.')); return; }
      try { const result = JSON.parse(output); if (typeof result.title !== 'string' || typeof result.text !== 'string' || result.text.length > 1_000_000) throw Error(); resolve(result); }
      catch { reject(Error('영상 자막의 형식을 읽지 못했습니다.')); }
    });
    if (signal.aborted) abort();
  });
}
