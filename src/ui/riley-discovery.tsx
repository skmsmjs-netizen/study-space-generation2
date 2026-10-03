import { lazy, Suspense, useState } from 'react';
import discovery from '../content/riley/discovery.json' with { type: 'json' };
import { Button, Input, Select, Modal } from './index';

import type { AppState } from '../domain/model';
const VerifiedSource = lazy(() =>
  import('./verified-source-reader').then((m) => ({ default: m.VerifiedSourceReader })),
);
const rileySource = {
  id: 'riley-3e',
  title: '수학교재',
  sha256: '6ea57e9b0829a6de8b0b93db66cb582cbdda8fc343c9f1d017326769b9e66897',
  pages: 1363,
  offset: 30,
  localUrl: '/__riley_source/document.pdf',
};
type DiscoveryState = { query: string; kind: 'subsections' | 'equationMentions'; page: number };
export function RileyDiscovery({
  state,
  data,
  onChange,
}: {
  state: DiscoveryState;
  data: Pick<AppState, 'namespace' | 'userId'>;
  onChange: (next: DiscoveryState) => void;
}) {
  const [verified, setVerified] = useState(false);
  const [source, setSource] = useState<{ page: number; id: string } | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const entries = discovery[state.kind].filter((e) =>
    `${e.number} ${'title' in e ? e.title : ''}`.toLowerCase().includes(state.query.toLowerCase()),
  );
  const page = Math.min(state.page, Math.max(0, Math.ceil(entries.length / 25) - 1));
  return (
    <section aria-label="확인 대기 항목 목록">
      <p className="prose">
        세부 제목 351개와 식 번호 출현 1,982개를 발견했습니다. 아래 쪽수는 처음 발견한 위치이며,
        식의 정의 위치나 관찰 적합성 확인을 뜻하지 않습니다. 모든 항목은 판단 보류 상태입니다.
      </p>
      <div className="riley-filters">
        <Input
          label="확인 대기 목록에서 찾기"
          value={state.query}
          onChange={(e) => onChange({ ...state, query: e.target.value, page: 0 })}
        />
        <Select
          label="확인 대기 항목 유형"
          value={state.kind}
          onChange={(e) =>
            onChange({ ...state, kind: e.target.value as DiscoveryState['kind'], page: 0 })
          }
        >
          <option value="subsections">세부 제목 발견</option>
          <option value="equationMentions">식 번호 출현</option>
        </Select>
      </div>
      <p>
        {entries.length}개 항목 · {page + 1}번째 목록
      </p>
      {entries.length === 0 ? (
        <>
          <p>찾기 조건에 맞는 후보가 없습니다.</p>
          <Button onClick={() => onChange({ ...state, query: '', page: 0 })}>
            대기 목록 찾기 해제
          </Button>
        </>
      ) : (
        <ol className="riley-list" start={page * 25 + 1}>
          {entries.slice(page * 25, page * 25 + 25).map((e) => (
            <li key={e.id}>
              <Button
                onClick={() => {
                  setError(false);
                  setLoading(true);
                  setSource({ page: e.detectedPdf, id: e.id });
                  if (!['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
                    setLoading(false);
                    setVerified(true);
                  }
                }}
              >
                {'title' in e ? `${e.number} · ${e.title}` : `식 번호 (${e.number})의 출현`}
              </Button>
              {'definitionCandidates' in e && e.definitionCandidates.length > 0 && (
                <span>
                  {' '}
                  식 끝에 번호가 배치된 후보:{' '}
                  {e.definitionCandidates.map((v) => (
                    <Button
                      key={v.pdf}
                      onClick={() => {
                        setSource({ page: v.pdf, id: e.id });
                        setVerified(true);
                      }}
                    >
                      책 {v.printed}쪽 / PDF {v.pdf}페이지 읽기
                    </Button>
                  ))}
                </span>
              )}
              <span>
                책 인쇄 {e.detectedPrinted}쪽 / PDF {e.detectedPdf}페이지 · 판단 보류
              </span>
            </li>
          ))}
        </ol>
      )}
      <div className="riley-actions">
        <Button disabled={page === 0} onClick={() => onChange({ ...state, page: page - 1 })}>
          앞 목록
        </Button>
        <Button
          disabled={(page + 1) * 25 >= entries.length}
          onClick={() => onChange({ ...state, page: page + 1 })}
        >
          다음 목록
        </Button>
      </div>
      {verified && source && (
        <Suspense fallback={<p>원문 도구를 여는 중이다.</p>}>
          <VerifiedSource
            data={data}
            source={rileySource}
            page={source.page}
            contextId={source.id}
            onClose={() => {
              setVerified(false);
              setSource(null);
            }}
          />
        </Suspense>
      )}
      <Modal
        open={source !== null && !verified}
        title="확인 대기 항목의 발견 위치"
        onClose={() => setSource(null)}
      >
        {source && (
          <>
            <p>안정 ID: {source.id}</p>
            <Button onClick={() => setVerified(true)}>원본 PDF 연결해 읽기 · 기기 보관</Button>
            <p>
              처음 발견한 위치 · 책 인쇄 {source.page - 30}쪽 / PDF {source.page}페이지
            </p>
            <p className="prose">
              참조·머리말·정의 본문을 시각 대조하기 전의 후보입니다. 개별 관찰의 원식과 조건은 아직
              확정하지 않았습니다.
            </p>
            {error ? (
              <>
                <p role="alert">
                  이 실행 환경에서 원본 페이지를 불러오지 못했습니다. 후보 ID와 위치는 유지했습니다.
                </p>
                <Button
                  onClick={() => {
                    setError(false);
                    setLoading(true);
                  }}
                >
                  원문 다시 읽기
                </Button>
              </>
            ) : (
              <>
                {loading && <p role="status">발견 위치의 원문을 불러오는 중입니다.</p>}
                <div className="riley-source-scroll" tabIndex={0}>
                  <img
                    className="riley-source-image"
                    style={{ width: '100%' }}
                    src={`/__riley_source/page/${source.page}`}
                    alt={`후보 발견 위치 · PDF ${source.page}페이지`}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false);
                      setError(true);
                    }}
                  />
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </section>
  );
}
