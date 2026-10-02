import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  buildWorkspaceSearch,
  type SearchExcerpt,
  type SearchOrder,
  type WorkspaceSearchResult,
} from '../domain/workspace-search';
import { readLearningPlan } from '../data/learning-plan';
import { WorkspaceSearchClient } from '../data/workspace-search-client';
import { beginUiMeasure, finishUiMeasureAfterPaint } from '../data/ui-performance';
import { Button, Card, EmptyState, ErrorState, Search, Select } from './index';
import { isViewPage, isViewText, useViewContext } from './use-view-context';
import './workspace-search.css';

const empty: WorkspaceSearchResult = { hits: [], total: 0, kinds: [] };
const isOrder = (value: unknown): value is SearchOrder =>
  value === 'relevance' || value === 'source';
function Excerpt({ value }: { value: SearchExcerpt }) {
  return (
    <>
      {value.leading && '…'}
      {value.text.slice(0, value.start)}
      {value.end > value.start && <mark>{value.text.slice(value.start, value.end)}</mark>}
      {value.text.slice(value.end)}
      {value.trailing && '…'}
    </>
  );
}
export function WorkspaceSearch({
  data,
  query,
  onQueryChange,
  subjectIds,
  allScopes,
  onAllScopes,
}: {
  data: AppState;
  query: string;
  onQueryChange: (query: string) => void;
  subjectIds: string[];
  allScopes: boolean;
  onAllScopes: () => void;
}) {
  const owner = JSON.stringify([data.namespace, data.userId]);
  const [attempt, setAttempt] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Explicit retry rereads the retained plan without changing AppState.
  const projection = useMemo(() => {
    try {
      return {
        entries: buildWorkspaceSearch(data, readLearningPlan(data).workspace, false),
        error: '',
      };
    } catch (error) {
      return {
        entries: buildWorkspaceSearch(data, undefined, false),
        error:
          error instanceof Error
            ? error.message
            : '일정의 검색 정보를 읽지 못했습니다. 원본은 유지했습니다.',
      };
    }
  }, [data, attempt]);
  const [input, setInput] = useState(query);
  const [limit, setLimit] = useViewContext(data, 'search:limit', 40, isViewPage);
  const [kind, setKind] = useViewContext(data, 'search:kind', 'all', isViewText);
  const [order, setOrder] = useViewContext(
    data,
    'search:order',
    'relevance' as SearchOrder,
    isOrder,
  );
  const [client, setClient] = useState<WorkspaceSearchClient | null>(null);
  const [resolved, setResolved] = useState<{
    owner: string;
    entries: typeof projection.entries;
    signature: string;
    result: WorkspaceSearchResult;
    finish: ReturnType<typeof beginUiMeasure>;
  } | null>(null);
  const [searchError, setSearchError] = useState('');
  const searchMeasure = useRef<ReturnType<typeof beginUiMeasure> | null>(null);
  const inputMeasure = useRef<ReturnType<typeof beginUiMeasure> | null>(null);
  const signature = JSON.stringify([query, subjectIds, allScopes, kind, order, limit]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Each owner gets a fresh disposable Worker and private index.
  useEffect(() => {
    const next = new WorkspaceSearchClient();
    setClient(next);
    return () => next.dispose();
  }, [owner]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Owner changes discard any unfinished IME text from the previous view.
  useEffect(() => {
    setInput(query);
  }, [query, owner]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Measure only after the changed input has committed, canceling superseded paints.
  useEffect(() => {
    if (!inputMeasure.current) return;
    const finish = inputMeasure.current;
    inputMeasure.current = null;
    return finishUiMeasureAfterPaint(finish);
  }, [input]);
  useEffect(() => {
    if (!client) return;
    let active = true;
    const [term, scope, unassigned, selectedKind, selectedOrder, page] = JSON.parse(signature) as [
      string,
      string[],
      boolean,
      string,
      SearchOrder,
      number,
    ];
    const finish = searchMeasure.current ?? beginUiMeasure('search-results');
    searchMeasure.current = null;
    setSearchError('');
    client.update(owner, projection.entries);
    if (!term.trim()) return;
    client
      .query({
        query: term,
        subjectIds: scope,
        includeUnassigned: unassigned,
        kind: selectedKind,
        order: selectedOrder,
        limit: Math.max(40, page),
      })
      .then((value) => {
        if (!active || !value) return;
        setResolved({
          owner,
          entries: projection.entries,
          signature,
          result: value.result,
          finish,
        });
      })
      .catch(() => {
        if (active) {
          setSearchError('검색 결과를 표시하지 못했습니다. 원문은 유지됩니다. 다시 시도해 주세요.');
          finish(false);
        }
      });
    return () => {
      active = false;
    };
  }, [client, owner, projection.entries, signature]);
  const current =
    resolved?.owner === owner &&
    resolved.entries === projection.entries &&
    resolved.signature === signature;
  useEffect(() => {
    if (!current || !resolved) return;
    return finishUiMeasureAfterPaint(resolved.finish);
  }, [current, resolved]);
  const result = current ? resolved.result : empty;
  const waiting = !!query.trim() && !current && !searchError;
  const change = (value: string) => {
    searchMeasure.current = beginUiMeasure('search-results');
    setInput(value);
    onQueryChange(value);
    setLimit(40);
  };
  const kinds = result.kinds;
  return (
    <section className="workspace-search" aria-label="공부 자료 찾기">
      <Search
        label="과목·목차·기록 검색"
        placeholder="제목·원문·질문·코드에서 찾기"
        value={input}
        onChange={(event) => {
          inputMeasure.current = beginUiMeasure('input-paint');
          setInput(event.target.value);
        }}
        onQueryChange={change}
      />
      <p className="muted">
        저장된 과목·기록·메모·강의 자료·코드·암기 항목·복습 카드·시험 응답·보드·일정을 찾습니다.
        초안과 휴지통은 각 보관함에서 확인할 수 있습니다.
      </p>
      <div className="actions">
        <Select
          label="검색 자료 종류"
          value={kind}
          onChange={(event) => {
            setKind(event.target.value);
            setLimit(40);
          }}
        >
          <option value="all">모든 종류</option>
          {kind !== 'all' && !kinds.some((row) => row.kind === kind) && (
            <option value={kind}>{kind}</option>
          )}
          {kinds.map((row) => (
            <option key={row.kind} value={row.kind}>
              {row.kind} · {row.count}개
            </option>
          ))}
        </Select>
        <Select
          label="검색 순서"
          value={order}
          onChange={(event) => setOrder(event.target.value as SearchOrder)}
        >
          <option value="relevance">일치 이유 순</option>
          <option value="source">원래 목록 순</option>
        </Select>
      </div>
      <p className="muted">
        {order === 'relevance'
          ? '제목 전체 일치 → 제목에 일치 → 본문에 일치 순입니다. 같은 조건은 원래 목록 순서를 유지합니다.'
          : '현재 저장 자료의 목록 순서입니다. 최근 수정일이나 학습 중요도 순서가 아닙니다.'}{' '}
        발췌는 실제 원문이며 링크는 해당 항목을 엽니다.
      </p>
      {projection.error && (
        <ErrorState
          title="일정·코드 연결의 검색 정보를 읽지 못했습니다"
          message={projection.error}
          onRetry={() => setAttempt((value) => value + 1)}
        />
      )}
      {searchError && (
        <ErrorState
          title="검색 결과를 표시하지 못했습니다"
          message={searchError}
          onRetry={() => setAttempt((value) => value + 1)}
        />
      )}
      {query && (
        <Button variant="quiet" onClick={() => change('')}>
          검색어 지우기
        </Button>
      )}
      {query.trim() ? (
        <div className="card-stack section-space" aria-busy={waiting}>
          <p role="status">
            {waiting ? '검색 결과를 찾고 있습니다.' : `찾은 항목 ${result.total}개`}
          </p>
          {result.hits.map((entry) => (
            <Card key={entry.id} className="workspace-search-result">
              <a href={entry.href}>{entry.title}</a>
              <p className="muted">
                {entry.kind}
                {entry.subjectId
                  ? ` · ${data.subjects.find((subject) => subject.id === entry.subjectId)?.name ?? ''}`
                  : ' · 학기 소속 없음'}{' '}
                · {entry.reason}
              </p>
              <p className="workspace-search-excerpt">
                <Excerpt value={entry.excerpt} />
              </p>
            </Card>
          ))}
          {!waiting && !searchError && !result.total && (
            <EmptyState
              title="일치하는 내용을 찾지 못했습니다"
              message="검색어나 자료 종류를 바꾸거나 공부 범위를 넓혀 보세요."
            >
              {kind !== 'all' && <Button onClick={() => setKind('all')}>모든 종류에서 찾기</Button>}
              {!allScopes && <Button onClick={onAllScopes}>모든 공부에서 찾기</Button>}
            </EmptyState>
          )}
          {result.total > Math.max(40, limit) && (
            <Button onClick={() => setLimit((value) => Math.max(40, value) + 40)}>
              검색 결과 더 보기
            </Button>
          )}
        </div>
      ) : (
        <EmptyState
          title="어떤 내용을 찾으시나요?"
          message="제목이나 기록에 남긴 말로 찾아보세요."
        />
      )}
    </section>
  );
}
