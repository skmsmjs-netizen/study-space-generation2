import { useMemo, useState } from 'react';
import type { AppState } from '../domain/model';
import { buildWorkspaceSearch, searchWorkspace } from '../domain/workspace-search';
import { readLearningPlan } from '../data/learning-plan';
import { Button, Card, EmptyState, ErrorState, Search } from './index';
import { isViewPage, useViewContext } from './use-view-context';

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
  const [attempt, setAttempt] = useState(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Explicit retry rereads retained storage even when the AppState reference is unchanged.
  const projection = useMemo(() => {
    try {
      return { entries: buildWorkspaceSearch(data, readLearningPlan(data).workspace), error: '' };
    } catch (error) {
      return {
        entries: buildWorkspaceSearch(data),
        error:
          error instanceof Error
            ? error.message
            : '일정의 검색 정보를 읽지 못했습니다. 원본은 유지했습니다.',
      };
    }
  }, [data, attempt]);
  const [input, setInput] = useState(query);
  const matches = searchWorkspace(projection.entries, query, subjectIds, allScopes);
  const [limit, setLimit] = useViewContext(data, 'search:limit', 40, isViewPage);
  const change = (value: string) => {
    setInput(value);
    onQueryChange(value);
    setLimit(40);
  };
  return (
    <section aria-label="공부 자료 찾기">
      <Search
        label="과목·목차·기록 검색"
        placeholder="제목·원문·질문·코드에서 찾기"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onQueryChange={change}
      />
      <p className="muted">
        저장된 과목·기록·메모·강의 자료·코드·암기 항목·복습 카드·시험 응답·보드·일정을 찾습니다.
        초안과 휴지통은 각 보관함에서 확인할 수 있습니다.
      </p>
      {projection.error && (
        <ErrorState
          title="일정·코드 연결의 검색 정보를 읽지 못했습니다"
          message={projection.error}
          onRetry={() => setAttempt((value) => value + 1)}
        />
      )}
      {query && (
        <Button variant="quiet" onClick={() => change('')}>
          검색어 지우기
        </Button>
      )}
      {query.trim() ? (
        <div className="card-stack section-space">
          <p role="status">찾은 항목 {matches.length}개</p>
          {matches.slice(0, Math.max(40, limit)).map((entry) => (
            <Card key={entry.id}>
              <a href={entry.href}>{entry.title}</a>
              <p className="muted">
                {entry.kind}
                {entry.subjectId
                  ? ` · ${data.subjects.find((subject) => subject.id === entry.subjectId)?.name ?? ''}`
                  : ' · 학기 소속 없음'}
              </p>
            </Card>
          ))}
          {!matches.length && (
            <EmptyState
              title="일치하는 내용을 찾지 못했습니다"
              message="검색어를 줄이거나 공부 범위를 넓혀 보세요."
            >
              {!allScopes && <Button onClick={onAllScopes}>모든 공부에서 찾기</Button>}
            </EmptyState>
          )}
          {matches.length > Math.max(40, limit) && (
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
