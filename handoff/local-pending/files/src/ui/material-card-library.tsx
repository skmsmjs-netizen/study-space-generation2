import { useMemo } from 'react';
import { StudyResultText } from './study-result-text';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import { UseMaterialCard } from './learning-links';
import { Button, Input, EmptyState } from './index';
import { sourceRevision } from '../domain/learning-evidence';
import type { MemoryCard } from '../domain/memory-test';
import type { StudyMaterial } from '../domain/study-material';
import { isViewPage, isViewText, useViewContext } from './use-view-context';

export function MaterialCardLibrary({
  data,
  repository,
  onSaved,
  subjectIds,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  subjectIds?: string[];
}) {
  const [query, setQuery] = useViewContext(data, 'material-cards:query', '', isViewText);
  const [page, setPage] = useViewContext(data, 'material-cards:page', 0, isViewPage);
  const [opened, setOpened] = useViewContext<string | null>(
    data,
    'material-cards:opened',
    null,
    (value): value is string | null => value === null || typeof value === 'string',
  );
  const entries = useMemo(
    () =>
      (data.studyMaterials ?? [])
        .filter(
          (m) =>
            !m.deletedAt &&
            m.userId === data.userId &&
            m.namespace === data.namespace &&
            data.subjects.some(
              (s) =>
                s.id === m.subjectId &&
                !s.deletedAt &&
                (subjectIds === undefined || subjectIds.includes(s.id)),
            ),
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id))
        .flatMap((material) =>
          material.results.flatMap((result) =>
            result.cards
              .filter((c) => !c.excluded)
              .map((card) => ({
                material,
                result,
                card,
                id: [material.id, result.id, card.id].join(':'),
              })),
          ),
        ),
    [data, subjectIds],
  );
  const filtered = entries.filter(({ material, card }) =>
      `${material.title} ${card.question} ${card.answer}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
    ),
    pages = Math.max(1, Math.ceil(filtered.length / 20)),
    current = Math.min(page, pages - 1);
  return (
    <section aria-label="자료에서 암기 항목 가져오기">
      <h2>자료에서 만든 카드를 다시 사용해 보세요</h2>
      <p>
        질문과 답을 원자료와 대조한 뒤 공부 주제에 등록합니다. 등록만으로 공부나 수행 결과를
        남기지는 않습니다.
      </p>
      <Input
        label="자료 카드 찾기"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
      />
      {!filtered.length && (
        <EmptyState
          title={entries.length ? '찾는 카드가 없습니다' : '보관한 자료 카드가 없습니다'}
          message={
            entries.length
              ? '자료 제목이나 질문의 다른 말로 찾아보세요.'
              : '강의 자료에서 카드가 만들어지면 원문을 확인하고 암기시험에 사용할 수 있습니다.'
          }
        >
          {query && (
            <Button
              onClick={() => {
                setQuery('');
                setPage(0);
              }}
            >
              자료 카드 검색어 지우기
            </Button>
          )}
          {!entries.length && <a href="#/materials">강의 자료 열기</a>}
        </EmptyState>
      )}
      {filtered.slice(current * 20, current * 20 + 20).map(({ material, result, card, id }) => (
        <article key={`${id}:${material.version}`}>
          <p className="muted">
            {material.title || '제목 없는 자료'} · {new Date(result.at).toLocaleString('ko-KR')}
          </p>
          <Button
            variant="quiet"
            aria-expanded={opened === id}
            onClick={() => setOpened(opened === id ? null : id)}
          >
            <StudyResultText text={card.question} as="span" />
          </Button>
          {opened === id && (
            <>
              <StudyResultText text={card.answer} />
              <details>
                <summary>원문 확인</summary>
                {result.segments
                  .filter((s) => card.sourceIds.includes(s.id))
                  .map((s) => (
                    <p className="prose" key={s.id}>
                      {s.text}
                      {s.originalText !== undefined && (
                        <>
                          <br />
                          수정 전 원문 · {s.originalText}
                        </>
                      )}
                    </p>
                  ))}
              </details>
              <UseMaterialCard
                data={data}
                repository={repository}
                onSaved={onSaved}
                material={material}
                resultId={result.id}
                cardId={card.id}
                unsaved={false}
              />
            </>
          )}
        </article>
      ))}
      {pages > 1 && (
        <div className="actions">
          <Button disabled={current === 0} onClick={() => setPage(current - 1)}>
            이전 자료 카드
          </Button>
          <span>
            {current + 1} / {pages} · {filtered.length}개
          </span>
          <Button disabled={current === pages - 1} onClick={() => setPage(current + 1)}>
            다음 자료 카드
          </Button>
        </div>
      )}
    </section>
  );
}
export function MemoryCardOrigin({ data, card }: { data: AppState; card: MemoryCard }) {
  const source = card.materialSource;
  if (!source) return null;
  const material = sourceRevision(
    data,
    'studyMaterials',
    source.materialId,
    source.materialVersion,
  ) as StudyMaterial | undefined;
  const result = material?.results.find((r) => r.id === source.resultId),
    original = result?.cards.find((c) => c.id === source.cardId);
  return (
    <details>
      <summary>등록할 때 확인한 원자료</summary>
      <p>
        {material?.title || '원자료'} · 버전 {source.materialVersion}
      </p>
      <StudyResultText text={original?.question ?? ''} />
      <StudyResultText text={original?.answer ?? ''} />
      {result?.segments
        .filter((s) => original?.sourceIds.includes(s.id))
        .map((s) => (
          <p key={s.id} className="prose">
            {s.text}
          </p>
        ))}
    </details>
  );
}
