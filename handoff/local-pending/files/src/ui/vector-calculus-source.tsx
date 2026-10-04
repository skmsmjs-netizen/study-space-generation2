import { useEffect, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import catalog from '../domain/vector-calculus-source.json';
import type { AppState } from '../domain/model';
import type { MaterialFile } from '../domain/material-source';
import { keepDocumentFile, readDocumentFile } from '../data/document-files';
import { storagePrefix } from '../data/repository';
import {
  clearVectorRecovery,
  readVectorReadingRecovery,
  retainVectorReadingRecovery,
} from '../data/vector-calculus-recovery';
import { storeDraftSafely } from '../data/draft-safety';
import { Button, ErrorState, Input } from './index';
GlobalWorkerOptions.workerSrc = worker;
type Reading = {
  printed: number;
  zoom: number;
  scroll: number;
  item: string;
  front?: number | null;
};
const valid = (v: Reading) =>
  !!v &&
  Number.isInteger(v.printed) &&
  v.printed >= 1 &&
  v.printed <= 213 &&
  Number.isFinite(v.zoom) &&
  v.zoom >= 0.5 &&
  v.zoom <= 3 &&
  Number.isFinite(v.scroll) &&
  v.scroll >= 0 &&
  typeof v.item === 'string' &&
  (v.front == null || (Number.isInteger(v.front) && v.front >= 0 && v.front < 8));
export function VectorCalculusSource({
  data,
  moduleId,
  onObservation,
}: {
  data: Pick<AppState, 'namespace' | 'userId'>;
  moduleId: string;
  onObservation: (id: string) => void;
}) {
  const key = `${storagePrefix(data)}:vector-calculus:source:${moduleId}:v1`;
  const first = catalog.sections.find((h) => h.module === moduleId)?.printed ?? 1;
  const [initial] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null)
        return {
          value: { printed: first, zoom: 1, scroll: 0, item: '' },
          baseRaw: raw,
          blocked: false,
          error: '',
        };
      const v = JSON.parse(raw) as Reading;
      if (!valid(v)) throw Error('원문 위치를 읽지 못했다. 기존 저장 원문을 유지했다.');
      return { value: v, baseRaw: raw, blocked: false, error: '' };
    } catch (e) {
      return {
        value: { printed: first, zoom: 1, scroll: 0, item: '' },
        baseRaw: null,
        blocked: true,
        error: String(e),
      };
    }
  });
  const [reading, setReading] = useState<Reading>(initial.value),
    [pdf, setPDF] = useState<PDFDocumentProxy | null>(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState(initial.error),
    [query, setQuery] = useState(''),
    [fileError, setFileError] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null),
    pane = useRef<HTMLDivElement>(null),
    epoch = useRef(0),
    opened = useRef<PDFDocumentProxy | null>(null),
    current = useRef(reading),
    ready = useRef(false),
    sequence = useRef(0),
    revision = useRef(0),
    alive = useRef(true),
    protectedRecovery = useRef(''),
    recoveryReady = useRef(false),
    recoveryFlight = useRef<Promise<void>>(Promise.resolve()),
    positionBlocked = useRef(initial.blocked),
    lastRaw = useRef<string | null>(initial.baseRaw);
  current.current = reading;
  const retain = (value: Reading) => {
    const rev = ++revision.current;
    setReading(value);
    current.current = value;
    if (positionBlocked.current) {
      setError('원문 위치 저장 원문을 보호한다. 현재 위치는 이 창에 유지했다.');
      return;
    }
    try {
      if (localStorage.getItem(key) !== lastRaw.current) {
        positionBlocked.current = true;
        setError(
          '원문 위치 저장값이 다른 변경으로 바뀌었다. 자동 보관을 멈추고 현재 위치와 저장 원문을 보존했다.',
        );
        return;
      }
      storeDraftSafely(key, JSON.stringify(value));
      lastRaw.current = localStorage.getItem(key);
      setError(protectedRecovery.current);
      if (recoveryReady.current && !protectedRecovery.current)
        void clearVectorRecovery(key).catch(() => {
          if (alive.current && rev === revision.current)
            setError('원문 위치는 보관했지만 이전 복구 사본 정리를 확인하지 못했다.');
        });
    } catch {
      setError('원문 위치 저장에 실패했다. 현재 위치를 유지했다.');
      if (protectedRecovery.current) {
        setError(
          protectedRecovery.current +
            ' 현재 위치는 이 창에 유지하고 보호 중인 사본을 덮어쓰지 않는다.',
        );
        return;
      }
      let baseRaw: string | null;
      try {
        baseRaw = localStorage.getItem(key);
      } catch {
        return;
      }
      void recoveryFlight.current
        .then(() => {
          if (protectedRecovery.current) throw Error(protectedRecovery.current);
          return retainVectorReadingRecovery(key, baseRaw, value);
        })
        .then(() => {
          if (alive.current && rev === revision.current)
            setError(
              '원래 위치 저장에 실패했지만 기기 복구 사본을 보관했다. 재접속 때 복구하며 다시 시도할 수 있다.',
            );
        })
        .catch(() => {
          if (alive.current && rev === revision.current)
            setError(
              protectedRecovery.current ||
                '원문 위치와 복구 사본 보관을 모두 마치지 못했다. 현재 창의 위치를 유지했다.',
            );
        });
    }
  };
  useEffect(() => {
    alive.current = true;
    const rev = revision.current;
    recoveryFlight.current = readVectorReadingRecovery<Reading>(key, valid)
      .then((v) => {
        recoveryReady.current = true;
        if (v && alive.current && revision.current !== rev) {
          protectedRecovery.current =
            '원문 복구 사본을 읽는 동안 위치를 바꾸었다. 현재 위치와 사본을 보존한다.';
          setError(protectedRecovery.current);
          return;
        }
        if (!v || !alive.current || positionBlocked.current || revision.current !== rev) return;
        setReading(v);
        current.current = v;
        setError('기기 복구 사본에서 원문 읽기 위치를 복원했다. 원래 저장을 다시 시도할 수 있다.');
      })
      .catch((e) => {
        recoveryReady.current = true;
        if (alive.current) {
          protectedRecovery.current = String(e);
          setError(String(e));
        }
      });
    return () => {
      alive.current = false;
    };
  }, [key]);
  const reference: MaterialFile = {
    key: `${storagePrefix(data)}:material:${encodeURIComponent('document:' + catalog.source.sha256)}`,
    sha256: catalog.source.sha256,
    name: catalog.source.file,
    type: 'application/pdf',
    size: catalog.source.size,
  };
  const open = async (blob: Blob) => {
    const token = ++epoch.current;
    setBusy(true);
    try {
      const bytes = await blob.arrayBuffer(),
        hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('');
      if (hash !== catalog.source.sha256)
        throw Error('확인한 원본과 SHA-256이 다르다. 다른 판본으로 교체하지 않았다.');
      const doc = await getDocument({ data: new Uint8Array(bytes) }).promise;
      if (token !== epoch.current) {
        await doc.loadingTask.destroy();
        return;
      }
      if (doc.numPages !== 8) {
        await doc.loadingTask.destroy();
        throw Error('원본 물리 페이지 수가 다르다.');
      }
      const previous = opened.current;
      opened.current = doc;
      setPDF(doc);
      void previous?.loadingTask.destroy();
      setFileError('');
    } catch (e) {
      if (token === epoch.current) setFileError(String(e));
    } finally {
      if (token === epoch.current) setBusy(false);
    }
  };
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    void (async () => {
      try {
        let blob = await readDocumentFile(data, reference);
        if (!blob && ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
          const response = await fetch(`${import.meta.env.BASE_URL}__vector/source.pdf`, {
            signal: controller.signal,
          });
          if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf'))
            throw Error(
              '이 실행 환경의 원본 경로를 열지 못했다. 같은 원본 PDF를 기기에 연결할 수 있다.',
            );
          blob = await response.blob();
        }
        if (blob && alive) await open(blob);
        else if (alive) setBusy(false);
      } catch (e) {
        if (alive) {
          setFileError(String(e));
          setBusy(false);
        }
      }
    })();
    return () => {
      alive = false;
      controller.abort();
      epoch.current++;
      void opened.current?.loadingTask.destroy();
    };
  }, [key]);
  useEffect(() => {
    if (!pdf || !canvas.current) return;
    let active = true;
    const tasks: Array<{ cancel: () => void }> = [];
    const token = ++sequence.current;
    ready.current = false;
    setBusy(true);
    void (async () => {
      const source =
        reading.front != null
          ? catalog.frontPages[reading.front]
          : catalog.printedPages.find((p) => p.printed === reading.printed);
      if (!source) throw Error('원문 쪽 연결을 확인할 수 없다.');
      const target = canvas.current!,
        scale = reading.zoom * 2;
      target.width = Math.ceil(source.width * scale);
      target.height = Math.ceil(source.height * scale);
      target.style.width = `${source.width * reading.zoom}px`;
      target.style.height = `${source.height * reading.zoom}px`;
      const ctx = target.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, target.width, target.height);
      let remaining = source.height,
        pageNo = source.pdf,
        offset = source.offset,
        drawn = 0;
      while (remaining > 0.05 && pageNo <= pdf.numPages) {
        const page = await pdf.getPage(pageNo);
        if (!active || token !== sequence.current) return;
        const viewport = page.getViewport({ scale }),
          available = Math.min(remaining, page.view[3] - offset);
        if (available <= 0) {
          pageNo++;
          offset = 0;
          continue;
        }
        const part = document.createElement('canvas');
        part.width = target.width;
        part.height = Math.ceil(available * scale);
        const task = page.render({
          canvas: part,
          viewport,
          transform: [1, 0, 0, 1, 0, -offset * scale],
        });
        tasks.push(task);
        await task.promise;
        if (!active || token !== sequence.current) return;
        ctx.drawImage(part, 0, drawn * scale);
        drawn += available;
        remaining -= available;
        pageNo++;
        offset = 0;
      }
      if (active && token === sequence.current) {
        if (pane.current) pane.current.scrollTop = current.current.scroll;
        ready.current = true;
      }
    })()
      .catch((e) => {
        if (active && token === sequence.current) setFileError(String(e));
      })
      .finally(() => {
        if (active && token === sequence.current) setBusy(false);
      });
    return () => {
      active = false;
      tasks.forEach((t) => t.cancel());
    };
  }, [pdf, reading.printed, reading.zoom, reading.front]);
  const item =
      catalog.objects.find((h) => h.id === reading.item) ??
      catalog.headings.find((h) => h.id === reading.item) ??
      catalog.exerciseGroups.flatMap((g) => g.problems).find((h) => h.id === reading.item),
    position = catalog.printedPages.find((p) => p.printed === reading.printed);
  const move = (printed: number, item = '') =>
    retain({ ...current.current, printed, item, front: null, scroll: 0 });
  const matches = catalog.headings.filter(
    (h) =>
      h.module === moduleId && `${h.id} ${h.title}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="vector-paper" aria-label="벡터 미적분 원문 읽기">
      <p>
        같은 원본의 수식·그림·논증을 조판 그대로 읽는다. 판본 1.02 · 2022-05-11. 아래 텍스트
        추출본은 원래 수식 배열과 도형의 대조를 대신하지 않는다.
      </p>
      <Input
        label="원본 PDF 연결 · 이 기기에 보관"
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const token = ++epoch.current;
          setBusy(true);
          void (async () => {
            try {
              const bytes = await file.arrayBuffer(),
                hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))]
                  .map((x) => x.toString(16).padStart(2, '0'))
                  .join('');
              if (hash !== catalog.source.sha256)
                throw Error('현재 확인한 원본과 다른 파일이다. 원문을 교체하지 않았다.');
              await keepDocumentFile(data, file);
              if (token === epoch.current) await open(file);
            } catch (e) {
              if (token === epoch.current) {
                setFileError(String(e));
                setBusy(false);
              }
            }
          })();
        }}
      />
      <p>원본은 기존 기기 자료 보관 경로를 사용한다. 새 서버나 외부 서비스로 전송하지 않는다.</p>
      {fileError && <ErrorState message={fileError} />}
      {error && (
        <>
          <ErrorState message={error} />
          <Button onClick={() => retain(current.current)}>원문 위치 보관 다시 시도</Button>
          <Button
            onClick={() => {
              try {
                const raw = localStorage.getItem(key),
                  v =
                    raw === null
                      ? { printed: first, zoom: 1, scroll: 0, item: '' }
                      : (JSON.parse(raw) as Reading);
                if (!valid(v))
                  throw Error(
                    '저장 원문 형식을 확인하지 못했다. 현재 위치와 저장 원문을 유지했다.',
                  );
                lastRaw.current = raw;
                positionBlocked.current = false;
                current.current = v;
                setReading(v);
                setError(protectedRecovery.current);
              } catch (e) {
                setError(String(e));
              }
            }}
          >
            원문 위치 저장값 다시 읽기
          </Button>
        </>
      )}
      <div className="vector-actions">
        <Button disabled={reading.printed <= 1} onClick={() => move(reading.printed - 1)}>
          이전 책 쪽
        </Button>
        <Button disabled={reading.printed >= 213} onClick={() => move(reading.printed + 1)}>
          다음 책 쪽
        </Button>
        <Button
          onClick={() => retain({ ...current.current, zoom: Math.min(3, reading.zoom * 1.25) })}
        >
          원문 확대
        </Button>
        <Button
          onClick={() => retain({ ...current.current, zoom: Math.max(0.5, reading.zoom / 1.25) })}
        >
          원문 축소
        </Button>
        <Button onClick={() => move(first)}>현재 개념의 시작 쪽</Button>
      </div>
      <Input
        label="읽을 책 인쇄 쪽"
        type="number"
        min={1}
        max={213}
        value={reading.printed}
        onChange={(e) => {
          const p = Number(e.target.value);
          if (Number.isInteger(p) && p >= 1 && p <= 213) move(p);
        }}
      />
      <p>
        {reading.front != null
          ? `표지·서문·목차의 앞부분 조판 ${reading.front + 1}`
          : `책에 인쇄된 쪽 ${reading.printed}`}{' '}
        · 원본 PDF 물리 페이지 {position?.pdf}. 긴 물리 페이지를 책 한 쪽 높이로 잘라 읽고 경계에
        걸친 쪽은 이어 붙인다.
      </p>
      {busy && <p role="status">원문을 읽는 중이다.</p>}
      <div
        className="vector-source-scroll"
        ref={pane}
        role="region"
        tabIndex={0}
        aria-label="원문 조판 · 가로 세로 이동"
        onScroll={(e) => {
          if (ready.current) retain({ ...current.current, scroll: e.currentTarget.scrollTop });
        }}
      >
        <canvas
          ref={canvas}
          aria-label={
            reading.front != null
              ? `원본 앞부분 조판 ${reading.front + 1}`
              : `원본 책 쪽 ${reading.printed}`
          }
        />
      </div>
      {!pdf && !busy && (
        <p>
          같은 원본을 직접 연결하면 이 기기에서 다시 접속해 읽을 수 있다. 텍스트 추출본과 원식은
          아래에서 확인할 수 있다.
        </p>
      )}
      <details>
        <summary>현재 개념의 절 본문 전체 읽기</summary>
        <ul>
          {catalog.sections
            .filter((h) => h.module === moduleId)
            .map((h) => (
              <li key={h.id}>
                <Button onClick={() => move(h.printed, h.id)}>
                  {h.title} · 책 {h.printed}
                </Button>
              </li>
            ))}
        </ul>
      </details>
      <Input
        label="현재 개념의 원문 항목 찾기"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <details>
        <summary>원문 정의·정리·예제 {matches.length}개</summary>
        <ul>
          {matches.map((h) => (
            <li key={h.id}>
              <Button onClick={() => move(h.printed ?? first, h.id)}>
                {h.id.replace(':', ' ')} · 책 {h.printed}
              </Button>
            </li>
          ))}
        </ul>
      </details>
      {item && (
        <section id={`source-${item.id}`}>
          <h3>{item.id.replace(':', ' ')}</h3>
          <p>{item.reason}</p>
          {'text' in item && <pre className="vector-source-text">{item.text}</pre>}
          <Button onClick={() => onObservation(item.module ?? moduleId)}>
            이 항목의 개념 관찰로 돌아가기
          </Button>
        </section>
      )}
      <details>
        <summary>현재 개념의 번호 있는 식·그림 원문</summary>
        <ul>
          {catalog.objects
            .filter((h) => h.module === moduleId)
            .map((h) => (
              <li key={h.id}>
                <Button onClick={() => move(h.printed, h.id)}>
                  {h.kind === 'Equation' ? '식' : '그림'} {h.id.split(':')[1]} · 책 {h.printed}
                </Button>
              </li>
            ))}
        </ul>
      </details>
      <details>
        <summary>현재 개념의 연습문제 원문 · 새 풀이 없이 읽기</summary>
        {catalog.exerciseGroups
          .filter((h) => h.module === moduleId)
          .map((h) => (
            <section key={h.id}>
              <Button onClick={() => move(h.printed, h.id)}>
                절 {h.section} · 책 {h.printed}
              </Button>
              <details>
                <summary>문제별 원문 {h.problems.length}개</summary>
                <ul>
                  {h.problems.map((p) => (
                    <li key={p.id}>
                      <Button onClick={() => move(p.printed, p.id)}>
                        절 {p.section} · 문제 {p.number} · 책 {p.printed}
                      </Button>
                    </li>
                  ))}
                </ul>
              </details>
              <pre className="vector-source-text">{h.text}</pre>
            </section>
          ))}
      </details>
      <details>
        <summary>표지·서문·목차 원문</summary>
        <div className="vector-actions">
          {catalog.frontPages.map((p, i) => (
            <Button
              key={i}
              onClick={() => retain({ ...current.current, front: i, item: '', scroll: 0 })}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <pre className="vector-source-text">{catalog.frontText}</pre>
      </details>
      <details>
        <summary>원문 부록·참고·권리·개정 이력·색인</summary>
        <div className="vector-actions">
          {[
            [187, '참고문헌'],
            [189, '교재가 수록한 답·힌트'],
            [192, '오른손 법칙 증명'],
            [196, 'Gnuplot 설명'],
            [201, 'GFDL 권리'],
            [209, '개정 이력'],
            [210, '색인'],
          ].map(([page, title]) => (
            <Button key={page} onClick={() => move(Number(page))}>
              {title} · 책 {page}
            </Button>
          ))}
        </div>
      </details>
    </section>
  );
}
