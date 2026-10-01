import { useEffect, useRef, useState } from 'react';
import { canUseOwnerAI } from '../domain/ai-access';
import type { AppState } from '../domain/model';
import type { MaterialContent } from '../domain/study-material';
import type { TranscriptionCheckpoint } from '../domain/browser-transcription';
import { transcribeInBrowser } from '../data/browser-transcription';
import { readTranscriptionCheckpoint, writeTranscriptionCheckpoint } from '../data/material-files';
import { Button, Checkbox, ErrorState, Textarea } from './index';

export function MaterialTranscription({
  owner,
  audio,
  disabled,
  existingText,
  onAppend,
  onBusy,
}: {
  owner: Pick<AppState, 'userId' | 'namespace'>;
  audio: NonNullable<MaterialContent['audio']>;
  disabled: boolean;
  existingText: string;
  onAppend: (text: string, removeAudio: boolean) => Promise<void>;
  onBusy: (busy: boolean) => void;
}) {
  const [checkpoint, setCheckpoint] = useState<TranscriptionCheckpoint | null>(null);
  const [text, setText] = useState(''),
    [status, setStatus] = useState(''),
    [error, setError] = useState('');
  const [busy, setBusy] = useState(false),
    [appending, setAppending] = useState(false),
    [loaded, setLoaded] = useState(false);
  const controller = useRef<AbortController | null>(null),
    flight = useRef<Promise<unknown>>(Promise.resolve());
  const alive = useRef(false);
  const appendFlight = useRef(false);
  const allowed = canUseOwnerAI(owner);
  const supported = typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined' && typeof OfflineAudioContext !== 'undefined';
  useEffect(() => {
    alive.current = true;
    setLoaded(false);
    setCheckpoint(null);
    setText('');
    setError('');
    setStatus('');
    if (allowed)
      void readTranscriptionCheckpoint(owner, audio.sha256)
        .then((row) => {
          if (!alive.current) return;
          setCheckpoint(row);
          setText(row?.editedText ?? row?.segments.map((segment) => segment.text).join('\n') ?? '');
          setLoaded(true);
          if (row)
            setStatus(
              row.complete
                ? '이 기기에 보관한 받아쓴 내용을 불러왔습니다.'
                : '중단 전에 보관한 구간에서 이어 처리할 수 있습니다.',
            );
        })
        .catch((error) => {
          if (alive.current)
            setError(error instanceof Error ? error.message : '진행 내용을 읽지 못했습니다.');
        });
    return () => {
      alive.current = false;
      controller.current?.abort();
    };
  }, [owner, audio.sha256, allowed]);
  if (!allowed) return null;
  async function run() {
    if (controller.current || !loaded || !supported) return;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    onBusy(true);
    setError('');
    try {
      await flight.current;
      const row = await transcribeInBrowser(owner, audio, abort.signal, (next, message) => {
        if (!alive.current) return;
        if (next) {
          setCheckpoint(next);
          setText(next.editedText ?? next.segments.map((segment) => segment.text).join('\n'));
        }
        setStatus(message);
      });
      if (alive.current) {
        setCheckpoint(row);
        setText(row.editedText ?? row.segments.map((segment) => segment.text).join('\n'));
        setStatus('받아쓰기를 마쳤습니다. 틀린 말과 빠진 내용을 확인한 뒤 필기에 추가해 주세요.');
      }
    } catch (error) {
      if (alive.current) {
        if (abort.signal.aborted) {
          setStatus('받아쓰기를 중단했습니다. 원본 음성은 보관했습니다.');
          const saved = await readTranscriptionCheckpoint(owner, audio.sha256).catch(() => null);
          if (alive.current && saved?.nextWindow)
            setStatus('받아쓰기를 중단했습니다. 저장된 구간에서 이어 처리할 수 있습니다.');
        } else setError(error instanceof Error ? error.message : '받아쓰기를 마치지 못했습니다.');
      }
    } finally {
      controller.current = null;
      if (alive.current) {
        setBusy(false);
        onBusy(false);
      }
    }
  }
  return (
    <section aria-label="기기에서 음성 받아쓰기" aria-busy={busy || appending}>
      <h3>음성 받아쓰기</h3>
      <p>
        음성은 이 기기에서 처리합니다. 처음에는 약 250MB의 받아쓰기 모델을 내려받습니다. 처리 중에는
        화면을 열어 두세요. 녹음 파일은 50MB·20분 이하를 처리합니다. 확인한 전사문을 자료로 저장하면 녹음 파일을 정리합니다.
      </p>
      {!supported && <p>이 브라우저에서는 음성을 받아쓸 수 없습니다. 원본 음성은 보관하며, 직접 필기를 입력하거나 지원되는 브라우저에서 같은 파일을 가져와 주세요.</p>}
      {error && <ErrorState message={error} />}
      {status && <p role="status">{status}</p>}
      <div className="material-actions">
        <Button
          disabled={disabled || busy || appending || !loaded || checkpoint?.complete || !supported}
          onClick={() => void run()}
        >
          {checkpoint?.nextWindow ? '받아쓰기 이어 처리' : '이 기기에서 받아쓰기'}
        </Button>
        {busy && <Button onClick={() => controller.current?.abort()}>받아쓰기 중단</Button>}
      </div>
      {(text || checkpoint?.nextWindow) && (
        <>
          <Checkbox
            label="전사문 저장 후에도 녹음 파일 보관"
            checked={checkpoint?.retainAudio ?? false}
            disabled={busy || appending || disabled || !checkpoint?.complete}
            onChange={(event) => {
              if (!checkpoint) return;
              const next = { ...checkpoint, retainAudio: event.target.checked };
              setCheckpoint(next);
              flight.current = flight.current.catch(() => undefined).then(() => writeTranscriptionCheckpoint(owner, next));
              void flight.current.catch(() => {
                if (alive.current) setError('녹음 보관 선택을 저장하지 못했습니다. 다시 선택해 주세요.');
              });
            }}
          />
          <Textarea
            label="받아쓴 내용 · 확인·수정"
            value={text}
            disabled={busy || appending || disabled || !checkpoint?.complete}
            maxLength={150_000}
            rows={6}
            onChange={(event) => {
              const value = event.target.value;
              setText(value);
              if (!checkpoint) return;
              const next = { ...checkpoint, editedText: value };
              setCheckpoint(next);
              flight.current = flight.current
                .catch(() => undefined)
                .then(() => writeTranscriptionCheckpoint(owner, next));
              void flight.current.catch(() => {
                if (alive.current)
                  setError(
                    '수정한 내용을 기기에 보관하지 못했습니다. 아래 필기에 추가해 보관하거나 내용을 따로 복사해 주세요.',
                  );
              });
            }}
          />
          <Button
            disabled={
              busy ||
              appending ||
              disabled ||
              !checkpoint?.complete ||
              !text.trim() ||
              existingText.includes(text)
            }
            onClick={async () => {
              if (appendFlight.current) return;
              appendFlight.current = true;
              setAppending(true);
              onBusy(true);
              try {
                await flight.current;
                await onAppend(text, !checkpoint?.retainAudio);
                setStatus(
                  checkpoint?.retainAudio
                    ? '전사문을 필기 뒤에 추가했습니다. 자료 저장을 눌러 주세요. 녹음은 보관합니다.'
                    : '전사문을 필기 뒤에 추가했습니다. 자료 저장이 성공하면 녹음 파일을 정리합니다.',
                );
              } catch (error) {
                setError(
                  error instanceof Error
                    ? error.message
                    : '필기에 추가하지 못했습니다. 받아쓴 내용은 유지했습니다.',
                );
              } finally {
                appendFlight.current = false;
                if (alive.current) {
                  setAppending(false);
                  onBusy(false);
                }
              }
            }}
          >
            확인한 내용을 필기에 추가
          </Button>
        </>
      )}
    </section>
  );
}
