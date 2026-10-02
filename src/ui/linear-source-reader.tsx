import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { AppState } from '../domain/model';
import type { MaterialFile } from '../domain/material-source';
import { keepDocumentFile, readDocumentFile } from '../data/document-files';
import { storagePrefix } from '../data/repository';
import { readRescuedDraft, storeDraftSafely } from '../data/draft-safety';
import { Button, ErrorState, Input, LoadingState, Modal } from './index';
import catalog from '../domain/linear-algebra-catalog.json';
GlobalWorkerOptions.workerSrc = worker;
type Reading = {
  page: number;
  zoom: number;
  file?: MaterialFile;
  scroll?: { x: number; y: number };
};
export function LinearSourceReader({
  data,
  page,
  contextId,
  onClose,
}: {
  data: AppState;
  page: number;
  contextId: string;
  onClose: () => void;
}) {
  const key = `${storagePrefix(data)}:linear-source:${contextId}:v1`;
  const [initial] = useState(() => {
    try {
      const raw = readRescuedDraft(key) ?? localStorage.getItem(key),
        v: unknown = raw ? JSON.parse(raw) : null;
      if (
        v !== null &&
        (!v ||
          typeof v !== 'object' ||
          !Number.isInteger((v as Reading).page) ||
          (v as Reading).page < 1 ||
          (v as Reading).page > 611 ||
          !Number.isFinite((v as Reading).zoom) ||
          (v as Reading).zoom < 0.5 ||
          (v as Reading).zoom > 3 ||
          ((v as Reading).scroll !== undefined &&
            (!(v as Reading).scroll ||
              !Number.isFinite((v as Reading).scroll!.x) ||
              !Number.isFinite((v as Reading).scroll!.y) ||
              (v as Reading).scroll!.x < 0 ||
              (v as Reading).scroll!.y < 0)))
      )
        throw Error('원문 읽기 위치가 손상되어 덮어쓰지 않았다.');
      return { value: (v as Reading | null) ?? { page, zoom: 1 }, error: '', blocked: false };
    } catch (e) {
      return { value: { page, zoom: 1 } as Reading, error: String(e), blocked: true };
    }
  });
  const [reading, setReading] = useState(initial.value),
    [pdf, setPdf] = useState<PDFDocumentProxy | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [fileError, setFileError] = useState(''),
    [storageError, setStorageError] = useState(initial.error),
    [text, setText] = useState(''),
    [pageInput, setPageInput] = useState(String(initial.value.page));
  const canvas = useRef<HTMLCanvasElement>(null),
    epoch = useRef(0),
    mounted = useRef(true),
    readingRef = useRef(reading),
    scrollPane = useRef<HTMLDivElement>(null),
    renderReady = useRef(false),
    scrollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  readingRef.current = reading;
  const persist = (v: Reading) => {
    if (initial.blocked) {
      setStorageError('기존 원문 위치가 손상되어 덮어쓰지 않았다. 현재 위치는 이 창에 유지된다.');
      return;
    }
    try {
      const raw = JSON.stringify(v);
      storeDraftSafely(key, raw);
      if (localStorage.getItem(key) !== raw)
        throw Error('원문 위치의 기기 보관을 확인하지 못했다.');
      setStorageError('');
    } catch (e) {
      setStorageError(String(e));
    }
  };
  const retain = (v: Reading) => {
    readingRef.current = v;
    setReading(v);
    persist(v);
  };
  const open = async (blob: Blob) => {
    const id = ++epoch.current;
    setBusy(true);
    try {
      const bytes = await blob.arrayBuffer(),
        sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('');
      if (sha !== catalog.source.sha256)
        throw Error('확인한 교재와 다른 파일이다. 기존 원문 연결과 위치를 유지했다.');
      const loaded = await getDocument({ data: new Uint8Array(bytes) }).promise;
      if (!mounted.current || id !== epoch.current) {
        await loaded.loadingTask.destroy();
        return;
      }
      setPdf(loaded);
      setFileError('');
    } catch (e) {
      if (mounted.current && id === epoch.current) setFileError(String(e));
    } finally {
      if (mounted.current && id === epoch.current) setBusy(false);
    }
  };
  useEffect(() => {
    mounted.current = true;
    let alive = true;
    const request = ++epoch.current;
    void (async () => {
      try {
        if (initial.value.file) {
          const blob = await readDocumentFile(data, initial.value.file);
          if (!blob) throw Error('이 기기에 연결한 원본이 없다. 같은 PDF를 다시 연결할 수 있다.');
          if (alive && request === epoch.current) await open(blob);
        } else if (['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
          setBusy(true);
          const response = await fetch(`${import.meta.env.BASE_URL}__linear/source.pdf`);
          if (!response.ok)
            throw Error(
              '이 실행 환경에서 원본 PDF를 찾지 못했다. 같은 PDF를 이 기기에 연결할 수 있다.',
            );
          const blob = await response.blob();
          if (alive && request === epoch.current) await open(blob);
        }
      } catch (e) {
        if (alive && request === epoch.current) {
          setFileError(String(e));
          setBusy(false);
        }
      }
    })();
    return () => {
      alive = false;
      mounted.current = false;
      epoch.current++;
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      if (!initial.blocked) {
        try {
          storeDraftSafely(key, JSON.stringify(readingRef.current));
        } catch {
          /* existing rescue keeps the current draft */
        }
      }
    };
  }, [key]);
  useEffect(
    () => () => {
      void pdf?.loadingTask.destroy();
    },
    [pdf],
  );
  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let alive = true;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined;
    renderReady.current = false;
    setBusy(true);
    setText('');
    void pdf
      .getPage(reading.page)
      .then(async (p) => {
        if (!alive) return;
        const viewport = p.getViewport({ scale: reading.zoom * 1.5 }),
          target = canvas.current!;
        target.width = Math.ceil(viewport.width);
        target.height = Math.ceil(viewport.height);
        target.style.width = `${viewport.width / 1.5}px`;
        target.style.height = `${viewport.height / 1.5}px`;
        task = p.render({ canvas: target, viewport });
        await task.promise;
        if (alive && scrollPane.current) {
          scrollPane.current.scrollLeft = readingRef.current.scroll?.x ?? 0;
          scrollPane.current.scrollTop = readingRef.current.scroll?.y ?? 0;
          renderReady.current = true;
        }
        const content = await p.getTextContent();
        if (alive) {
          setText(content.items.map((x) => ('str' in x ? x.str : '')).join(' '));
          setError('');
        }
      })
      .catch((e) => {
        if (alive) {
          setError(String(e));
          setBusy(false);
        }
      })
      .finally(() => {
        if (alive) setBusy(false);
      });
    return () => {
      alive = false;
      task?.cancel();
    };
  }, [pdf, reading.page, reading.zoom]);
  const move = (p: number) => {
    retain({ ...readingRef.current, page: p, scroll: { x: 0, y: 0 } });
    setPageInput(String(p));
  };
  return (
    <Modal open title="선형대수 원문 읽기" onClose={onClose} className="linear-modal">
      <p>
        교재의 원래 도형·수식·조판을 읽는다. 인쇄 쪽과 PDF 페이지를 구별하며, 아래 텍스트 추출본은
        수식·그림의 정확한 대조를 대신하지 않는다.
      </p>
      <Input
        label="원본 PDF 연결 · 이 기기에 보관"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const request = ++epoch.current;
          setBusy(true);
          void (async () => {
            try {
              const bytes = await file.arrayBuffer(),
                sha = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
                  .map((x) => x.toString(16).padStart(2, '0'))
                  .join('');
              if (sha !== catalog.source.sha256)
                throw Error('확인한 교재와 다른 파일이다. 원문을 교체하지 않았다.');
              if (!mounted.current || request !== epoch.current) return;
              const reference = await keepDocumentFile(data, file);
              if (!mounted.current || request !== epoch.current) return;
              retain({ ...readingRef.current, file: reference });
              await open(file);
            } catch (e) {
              if (mounted.current && request === epoch.current) {
                setFileError(String(e));
                setBusy(false);
              }
            }
          })();
        }}
      />
      <p>
        원본을 새 서버나 외부 서비스로 보내지 않는다. 직접 연결한 파일은 기존 기기 자료 보관 경로를
        사용한다.
      </p>
      {error && <ErrorState message={error} />}
      {fileError && <ErrorState message={fileError} />}
      {storageError && <ErrorState message={storageError} />}
      {storageError && !initial.blocked && (
        <Button onClick={() => persist(readingRef.current)}>원문 위치 보관 다시 시도</Button>
      )}
      <Input
        label="PDF 페이지"
        inputMode="numeric"
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
      />
      <Button
        onClick={() => {
          const p = Number(pageInput);
          if (!Number.isInteger(p) || p < 1 || p > 611) {
            setError('PDF 페이지는 1부터 611까지의 정수이다. 마지막 읽기 위치와 입력을 유지했다.');
            return;
          }
          move(p);
        }}
      >
        이 페이지 열기
      </Button>
      <p>
        PDF {reading.page} ·{' '}
        {reading.page >= 16 && reading.page <= 558
          ? `인쇄 쪽 ${reading.page - 14}`
          : reading.page >= 559 && reading.page <= 570
            ? `부록 인쇄 쪽 A${reading.page - 558}`
            : '앞뒤 부속 자료 · 인쇄 표기는 원본에서 확인'}
      </p>
      <div className="actions">
        <Button disabled={reading.page <= 1} onClick={() => move(reading.page - 1)}>
          이전 쪽
        </Button>
        <Button disabled={reading.page >= 611} onClick={() => move(reading.page + 1)}>
          다음 쪽
        </Button>
        <Button
          onClick={() => retain({ ...readingRef.current, zoom: Math.min(3, reading.zoom * 1.25) })}
        >
          원문 확대
        </Button>
        <Button
          onClick={() =>
            retain({ ...readingRef.current, zoom: Math.max(0.5, reading.zoom / 1.25) })
          }
        >
          원문 축소
        </Button>
        <Button onClick={() => move(page)}>연결된 절 시작으로</Button>
        <Button
          onClick={() => {
            if (scrollTimer.current) clearTimeout(scrollTimer.current);
            persist(readingRef.current);
            onClose();
          }}
        >
          읽던 질문으로 돌아가기
        </Button>
      </div>
      {busy && <LoadingState message="원문을 읽는 중이다." />}
      <div
        className="linear-pdf-scroll"
        ref={scrollPane}
        onScroll={(e) => {
          if (!renderReady.current) return;
          const v = {
            ...readingRef.current,
            scroll: { x: e.currentTarget.scrollLeft, y: e.currentTarget.scrollTop },
          };
          readingRef.current = v;
          if (scrollTimer.current) clearTimeout(scrollTimer.current);
          scrollTimer.current = setTimeout(() => retain(readingRef.current), 200);
        }}
        tabIndex={0}
        role="region"
        aria-label="원문 PDF · 가로 세로로 이동"
      >
        <canvas ref={canvas} aria-label={`PDF ${reading.page} 원래 조판`} />
      </div>
      {text && (
        <details>
          <summary>현재 페이지 텍스트 추출본</summary>
          <p className="prose">{text}</p>
        </details>
      )}
      {!pdf && !busy && (
        <p>
          원본 PDF를 연결하면 이 화면에서 읽을 수 있다. 연결한 기기와 계정의 보관 범위를 따르며
          다기기 동기화를 보장하지 않는다.
        </p>
      )}
    </Modal>
  );
}
