import { ConceptFigureView } from './concept-figure';
import { KnowledgeStructure } from './knowledge-structure';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MathFormula } from './math-formula';
import { ConceptText } from './concept-text';
import conceptTemplates from '../../docs/concept-interaction-templates.json' with { type: 'json' };
import {
  conceptReadingKey,
  conceptSceneKey,
  readConceptPosition,
  saveConceptPosition,
} from '../data/concept-reading-context';
import type { AppState } from '../domain/model';
import {
  CONCEPT_TYPES,
  EMPTY_CONCEPT_CHECKS,
  conceptContent,
  conceptEditionId,
  conceptProposal,
  emptyConceptEdition,
  parseConceptSource,
  type ConceptCatalog,
  type ConceptChecks,
  type ConceptEditionContent,
  type ConceptOriginal,
  type ConceptScreen,
  validateConceptEdition,
} from '../domain/concept-production';
import {
  conceptJobFile,
  downloadConceptFile,
  importConceptCatalog,
  importConceptResults,
  importConceptWorkFiles,
  openConceptBatch,
  saveConceptEdition,
  readConceptDraft,
} from '../data/concept-production';
import { storagePrefix, type StudyRepository } from '../data/repository';
import { BUNDLED_CONCEPT_CATALOG, loadConceptReadingPack, type ConceptReadingPack } from '../data/concept-reading-pack';
import { projectPublishedConceptSource } from '../domain/concept-publication';
import { conceptHash } from '../data/concept-production';
import { storeDraftSafely, clearStoredDraft } from '../data/draft-safety';
import { useViewContext, isViewText, isViewPage } from './use-view-context';
import { Button, Checkbox, Input, Textarea, Select } from './index';
import './concept-library.css';
import { ChemistryLauncher } from './chemistry-launcher';
const errorText = (e: unknown) =>
  e instanceof Error ? e.message : '처리하지 못했습니다. 기존 자료와 입력은 유지했습니다.';
const SCENE_KEYS = Array.from({ length: 12 }, (_, index) => `scene-${index}`);
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
type ConceptListPosition = { sourceId: string; x: number; y: number; offset: number };
const isConceptListPosition = (value: unknown): value is ConceptListPosition | null => {
  if (value === null) return true;
  if (!value || typeof value !== 'object') return false;
  const position = value as ConceptListPosition;
  return (
    typeof position.sourceId === 'string' &&
    Number.isFinite(position.x) &&
    position.x >= 0 &&
    Number.isFinite(position.y) &&
    position.y >= 0 &&
    Number.isFinite(position.offset)
  );
};
const labels: Record<keyof ConceptChecks, string> = {
  classification: '유형과 조작이 내용에 맞음',
  meaning: '정의와 핵심 의미 확인',
  conditions: '성립 조건·예외 확인',
  example: '예시와 오해 가능성 확인',
  wording: '문장·줄바꿈 확인',
  screen: '모든 화면·선택·좁은 폭 확인',
};
export function ConceptLibrary({
  data,
  repository,
  onSaved,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
}) {
  const [book, setBook] = useState<ConceptReadingPack | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState('');
  const [bookAttempt, setBookAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setBookLoading(true);
    setBookError('');
    void loadConceptReadingPack().then((pack) => {
      if (active) setBook(pack);
    }).catch(() => {
      if (active) setBookError('개념 전집을 열지 못했습니다. 다시 열어 주세요. 저장된 설명은 그대로입니다.');
    }).finally(() => { if (active) setBookLoading(false); });
    return () => { active = false; };
  }, [bookAttempt]);
  const [catalogId, setCatalogId] = useViewContext(data, 'concept-catalog', '', isViewText);
  const [query, setQuery] = useViewContext(data, 'concept-query', '', isViewText);
  const [page, setPage] = useViewContext(data, 'concept-page', 0, isViewPage);
  const [selected, setSelected] = useViewContext(data, 'concept-selected', '', isViewText);
  const [editing, setEditing] = useViewContext(
    data,
    'concept-editing',
    false,
    (v): v is boolean => typeof v === 'boolean',
  );
  const [filter, setFilter] = useViewContext(data, 'concept-filter', '', isViewText);
  const [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  const personalCatalog = data.conceptCatalogs?.find((c) => c.id === catalogId)
    ?? data.conceptCatalogs?.at(-1);
  const useBook = Boolean(book && (catalogId === BUNDLED_CONCEPT_CATALOG
    || (!editing && (!catalogId || !personalCatalog))));
  // This is a read-only view, never an account migration or repository write.
  const bookCatalog = useMemo<ConceptCatalog | undefined>(() => book ? {
    ...book.catalog, userId: data.userId, namespace: data.namespace,
    version: 0, createdAt: '', updatedAt: '', deletedAt: null,
  } : undefined, [book, data.userId, data.namespace]);
  const catalog = useBook ? bookCatalog : personalCatalog;
  const originalBookCatalogId = useMemo(() => {
    if (!book?.originalSourceSha256) return undefined;
    const found = data.conceptCatalogs?.find(c => c.sha256 === book.originalSourceSha256
      && c.id === `concept-catalog:${book.originalSourceSha256}`);
    if (!found) return undefined;
    try { return projectPublishedConceptSource(found.raw) === book.catalog.raw ? found.id : undefined; }
    catch { return undefined; }
  }, [book, data.conceptCatalogs]);
  const originals = useMemo(
    () => (catalog ? parseConceptSource(catalog.raw).items : []),
    [catalog],
  );
  const editions = useMemo(
    () =>
      new Map<string, ConceptEditionContent>([
        ...(useBook ? (book?.editions ?? []).map((e) => [e.sourceId, e] as const) : []),
        ...(data.conceptEditions ?? [])
          .filter((e) => (e.catalogId === catalog?.id || (useBook && originalBookCatalogId
            && e.catalogId === originalBookCatalogId))
            && (!useBook || e.status === 'published'))
          .map((e) => [e.sourceId, e] as const),
      ]),
    [data.conceptEditions, catalog, useBook, book, originalBookCatalogId],
  );
  const original = originals.find((i) => i.id === selected);
  const library = useRef<HTMLElement>(null);
  const viewCatalogKey = useBook ? BUNDLED_CONCEPT_CATALOG : catalog?.id ?? '';
  const viewScope = `${storagePrefix(data)}:${viewCatalogKey}:${editing ? 'editing' : 'reading'}`;
  const [listPosition, setListPosition] = useViewContext<ConceptListPosition | null>(
    data,
    `concept-list-position:${viewCatalogKey}:${editing ? 'editing' : 'reading'}`,
    null,
    isConceptListPosition,
  );
  const pendingFocus = useRef<{ scope: string; target: 'reader' | 'list' } | null>(null);
  useLayoutEffect(() => {
    const request = pendingFocus.current;
    if (!request) return;
    pendingFocus.current = null;
    if (request.scope !== viewScope || !library.current) return;
    if (request.target === 'reader' && original) {
      const heading = library.current.querySelector<HTMLElement>(
        '.concept-reader h2, .concept-editor h2',
      );
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    } else if (request.target === 'list' && !original) {
      const card =
        listPosition &&
        Array.from(library.current.querySelectorAll<HTMLElement>('[data-concept-source]')).find(
          (element) => element.dataset.conceptSource === listPosition.sourceId,
        );
      const target =
        card || library.current.querySelector<HTMLElement>('[data-concept-library-heading]');
      target?.focus({ preventScroll: true });
      if (card && listPosition) {
        window.scrollTo({
          left: listPosition.x,
          top: Math.max(0, window.scrollY + card.getBoundingClientRect().top - listPosition.offset),
          behavior: 'instant',
        });
      } else target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }, [original, listPosition, viewScope]);
  const writable =
    data.namespace !== 'personal' ||
    repository.getCapabilities?.().includes('saveConceptEdition') === true;
  const run = async (action: () => AppState | Promise<AppState>, message: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const next = await action();
      onSaved(next);
      await repository.flush?.();
      const status = repository.getStatus?.();
      setNotice(data.namespace === 'personal' && status &&
        (status.phase !== 'saved' || status.pending > 0)
        ? '내용은 이 기기에 반영했습니다. 서버 저장은 아직 확인되지 않았습니다.'
        : message);
    } catch (e) {
      onSaved(repository.getSnapshot());
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  const copyForEditing = async () => {
    if (!book || !original || !writable) return;
    const findCatalog = (state: AppState) =>
      state.conceptCatalogs?.find(c => c.sha256 === book.originalSourceSha256)
      ?? state.conceptCatalogs?.find(c => c.sha256 === book.sourceSha256);
    if (data.namespace === 'personal' &&
      !findCatalog(data) &&
      !repository.getCapabilities?.().includes('importConceptCatalog')) {
      setError('현재 저장 연결에서는 개념 원문을 보관할 수 없습니다. 설명은 계속 읽을 수 있습니다.');
      return;
    }
    await run(async () => {
      const snapshot = repository.getSnapshot();
      const next = findCatalog(snapshot)
        ? snapshot : await importConceptCatalog(repository, book.catalog.raw, book.catalog.filename);
      const target = findCatalog(next);
      if (!target) throw Error('개념 원문을 보관하지 못했습니다. 기존 설명은 그대로입니다.');
      if (await conceptHash(target.raw) !== target.sha256 || (target.sha256 === book.sourceSha256
        && target.raw !== book.catalog.raw)) throw Error('보관된 원문이 전집과 다릅니다. 기존 원문과 설명은 그대로입니다.');
      if (target.sha256 === book.originalSourceSha256
        && projectPublishedConceptSource(target.raw) !== book.catalog.raw)
        throw Error('보관된 원문과 배포 전집의 개념이 다릅니다. 기존 원문과 설명은 그대로입니다.');
      const existing = next.conceptEditions?.find(e => e.catalogId === target.id && e.sourceId === original.id);
      const reference = book.editions.find(e => e.sourceId === original.id);
      let result = next;
      if (!existing && reference) result = saveConceptEdition(repository, {
        ...conceptContent(reference), catalogId: target.id,
        screen: reference.screen ? { ...reference.screen, design: reference.screen.design
          ? { ...reference.screen.design, sourceSha256: target.sha256 } : undefined } : null,
        checks: { ...EMPTY_CONCEPT_CHECKS }, status: 'draft', jobId: null,
      }, 0);
      setCatalogId(target.id);
      setEditing(true);
      return result;
    }, '내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  };
  const importFile = async (selected: File | FileList | undefined | null, result: boolean) => {
    if (!selected) return;
    const files = selected instanceof File ? [selected] : Array.from(selected);
    if (!files.length) return;
    await run(
      async () => {
        if (files.length > 32 || files.some((file) => file.size > 12_000_000))
          throw Error('제작 파일의 개수와 크기를 확인해 주세요. 기존 자료는 유지했습니다.');
        const raws = await Promise.all(files.map((file) => file.text()));
        if (raws.every((raw) => JSON.parse(raw).format === 'concept-work-v1'))
          return importConceptWorkFiles(repository, raws);
        if (files.length !== 1)
          throw Error('같은 제작 묶음의 파일을 모두 선택해 주세요. 원문 파일은 하나씩 가져옵니다.');
        const raw = raws[0],
          file = files[0];
        return result
          ? importConceptResults(repository, raw).data
          : importConceptCatalog(repository, raw, file.name);
      },
      result
        ? '설명 결과를 가져왔습니다. 내용과 화면을 검토해 주세요.'
        : '원문을 보관했습니다. 제작할 개념을 고를 수 있습니다.',
    );
  };
  const visible = originals.filter((i) => {
    const edition = editions.get(i.id),
      type = edition?.displayType ?? conceptProposal(i).displayType;
    return (
      (editing || edition?.status === 'published') &&
      (!filter ||
        (filter === '미분류'
          ? !type
          : filter === '보류'
            ? edition?.status === 'blocked'
            : type === filter)) &&
      `${i.name} ${i.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
  });
  const maxPage = Math.max(0, Math.ceil(visible.length / 30) - 1),
    currentPage = Math.min(page, maxPage);
  return (
    <section ref={library} className="concept-library" aria-label="개념 전집">
      <header className="concept-library-cover">
        <p data-concept-library-heading tabIndex={-1}>
          자료 책장 · 개념 전집
        </p>
        <p>궁금한 개념을 골라, 설명과 사례를 차근차근 살펴보세요.</p>
      </header>
      <ChemistryLauncher data={data} repository={repository} onSaved={onSaved} />
      <div className="concept-toolbar">
        <Button variant={!editing ? 'primary' : 'quiet'} onClick={() => {
          if (book && (personalCatalog?.sha256 === book.sourceSha256
            || personalCatalog?.id === originalBookCatalogId)) setCatalogId(BUNDLED_CONCEPT_CATALOG);
          if (filter === '보류' || filter === '미분류') setFilter('');
          setEditing(false);
        }}>
          읽기
        </Button>
        <Button variant={editing ? 'primary' : 'quiet'} onClick={() => {
          if (useBook) setCatalogId(BUNDLED_CONCEPT_CATALOG);
          setEditing(true);
        }}>
          설명 만들기
        </Button>
        {useBook && editing && <Button variant="quiet" onClick={() => {
          setCatalogId(''); setSelected(''); setPage(0);
        }}>다른 원문 가져오기</Button>}
        {useBook && <Button variant="quiet" onClick={() => {
          if (book) downloadConceptFile(book.catalog.raw, book.catalog.filename);
        }}>원문 내보내기</Button>}
      </div>
      {error && (
        <div role="alert" className="concept-error">
          {error}
          <Button
            variant="quiet"
            onClick={() =>
              run(async () => {
                await repository.flush?.();
                return repository.getSnapshot();
              }, '저장 상태를 다시 확인했습니다.')
            }
          >
            저장 다시 확인
          </Button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {bookError && <div role="alert">{bookError}<Button variant="quiet" onClick={() => setBookAttempt(n => n + 1)}>전집 다시 열기</Button></div>}
      {useBook && editing && <p>설명을 고르세요. 선택한 개념만 내 초안으로 가져와 수정할 수 있습니다.</p>}
      {editing && !useBook && (
        <div className="concept-production-tools">
          <p>
            원문은 보관하고, 읽기 쉬운 설명을 따로 만듭니다. 유형 제안은 검토 결과와 구별합니다.
          </p>
          {!writable && (
            <p role="status">
              이 공간의 개념 저장 연결을 확인해야 합니다. 저장된 설명을 읽거나 파일을 내보낼 수
              있습니다.
            </p>
          )}
          <label>
            개념 원문 가져오기
            <input
              aria-label="개념 원문 가져오기"
              type="file"
              accept=".json,application/json"
              multiple
              disabled={busy || !writable}
              onChange={(e) => {
                void importFile(e.target.files, false);
                e.target.value = '';
              }}
            />
          </label>
          <label>
            설명 결과 가져오기
            <input
              aria-label="설명 결과 가져오기"
              type="file"
              accept=".json,application/json"
              disabled={busy || !writable}
              onChange={(e) => {
                void importFile(e.target.files?.[0], true);
                e.target.value = '';
              }}
            />
          </label>
          {catalog && (
            <>
              <p>
                전체 {originals.length.toLocaleString()}개 · 설명{' '}
                {Array.from(editions.values()).filter((e) => e.screen).length}개 · 읽기용{' '}
                {Array.from(editions.values()).filter((e) => e.status === 'published').length}개 ·
                보류 {Array.from(editions.values()).filter((e) => e.status === 'blocked').length}개
              </p>
              <div className="concept-toolbar">
                <Button
                  disabled={busy || !writable}
                  onClick={() =>
                    run(() => {
                      const result = openConceptBatch(repository, catalog);
                      downloadConceptFile(
                        conceptJobFile(result.data, result.batch),
                        `${result.batch.id}.json`,
                      );
                      return result.data;
                    }, '다음 30개까지 작업 묶음으로 내보냈습니다.')
                  }
                >
                  다음 작업 묶음
                </Button>
                <Button
                  variant="quiet"
                  onClick={() =>
                    downloadConceptFile(
                      catalog.raw,
                      catalog.filename.split('/').at(-1) ?? '개념 원문.json',
                    )
                  }
                >
                  원문 내보내기
                </Button>
              </div>
              <details>
                <summary>열린 작업 묶음 · 중단한 작업 이어가기</summary>
                {(data.conceptBatches ?? [])
                  .filter((b) => b.catalogId === catalog.id && b.status !== 'closed')
                  .map((b) => (
                    <div className="concept-batch" key={b.id}>
                      <span>
                        {b.sourceIds.length}개 · {b.status === 'paused' ? '중단' : '작성'} ·{' '}
                        {b.sourceIds[0]}
                      </span>
                      <Button
                        onClick={() => downloadConceptFile(conceptJobFile(data, b), `${b.id}.json`)}
                      >
                        묶음 내보내기
                      </Button>
                      <Button
                        disabled={busy || !writable}
                        variant="quiet"
                        onClick={() =>
                          run(
                            () =>
                              repository.execute({
                                type: 'saveConceptBatch',
                                userId: data.userId,
                                namespace: data.namespace,
                                at: new Date().toISOString(),
                                opId: crypto.randomUUID(),
                                id: b.id,
                                expectedVersion: b.version,
                                content: {
                                  catalogId: b.catalogId,
                                  sourceIds: b.sourceIds,
                                  baseVersions: b.baseVersions,
                                  status: b.status === 'paused' ? 'open' : 'paused',
                                },
                              }),
                            '작업 상태를 저장했습니다.',
                          )
                        }
                      >
                        {b.status === 'paused' ? '이어서 작성' : '잠시 중단'}
                      </Button>
                      <Button
                        disabled={busy || !writable}
                        variant="quiet"
                        onClick={() =>
                          run(
                            () =>
                              repository.execute({
                                type: 'saveConceptBatch',
                                userId: data.userId,
                                namespace: data.namespace,
                                at: new Date().toISOString(),
                                opId: crypto.randomUUID(),
                                id: b.id,
                                expectedVersion: b.version,
                                content: {
                                  catalogId: b.catalogId,
                                  sourceIds: b.sourceIds,
                                  baseVersions: b.baseVersions,
                                  status: 'closed',
                                },
                              }),
                            '작업 묶음을 닫았습니다. 기존 결과와 이력은 유지했습니다.',
                          )
                        }
                      >
                        묶음 닫기
                      </Button>
                    </div>
                  ))}
              </details>
            </>
          )}
        </div>
      )}
      {((data.conceptCatalogs?.length ?? 0) + (book ? 1 : 0)) > 1 && (
        <Select
          label="전집 선택"
          value={useBook ? BUNDLED_CONCEPT_CATALOG : catalog?.id ?? ''}
          onChange={(e) => {
            setCatalogId(e.target.value);
            setSelected('');
            setPage(0);
          }}
        >
          {book && <option value={BUNDLED_CONCEPT_CATALOG}>개념 전집 · {book.editions.length.toLocaleString()}개</option>}
          {(data.conceptCatalogs ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.filename}
            </option>
          ))}
        </Select>
      )}
      {!catalog ? (
        <p role={bookLoading ? 'status' : undefined}>{bookLoading ? '개념 전집을 펼치고 있습니다.' : '설명 만들기에서 개념 원문을 가져와 주세요.'}</p>
      ) : original ? (
        <>
          <Button
            variant="quiet"
            onClick={() => {
              pendingFocus.current = { scope: viewScope, target: 'list' };
              setSelected('');
            }}
          >
            목록으로 돌아가기
          </Button>
          {editing && useBook ? (
            <>
              <Button disabled={busy || !writable} onClick={() => void copyForEditing()}>내 설명으로 가져와 수정</Button>
              {!writable && <p role="status">이 공간의 개념 저장 연결을 확인해야 합니다. 설명은 계속 읽을 수 있습니다.</p>}
              {editions.get(original.id)?.screen && <ConceptReader screen={editions.get(original.id)!.screen!} name={original.name} sourceKey={`${useBook && book?.originalSourceSha256 ? `concept-catalog:${book.originalSourceSha256}` : catalog.id}:${original.id}`} data={data} />}
            </>
          ) : editing ? (
            <ConceptEditor
              key={`${catalog.id}:${original.id}`}
              data={data}
              catalog={catalog}
              original={original}
              repository={repository}
              onSaved={onSaved}
              writable={writable}
            />
          ) : editions.get(original.id)?.status === 'published' &&
            editions.get(original.id)?.screen ? (
            <ConceptReader
              screen={editions.get(original.id)!.screen!}
              name={original.name}
              sourceKey={`${useBook && book?.originalSourceSha256 ? `concept-catalog:${book.originalSourceSha256}` : catalog.id}:${original.id}`}
              data={data}
            />
          ) : (
            <p>내용 검토를 마치면 읽기 화면에서 볼 수 있습니다.</p>
          )}
        </>
      ) : (
        <>
          <div className="concept-filters">
            <Input
              label="개념 찾기"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
            <Select
              label="화면 유형"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">모든 유형</option>
              {CONCEPT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
              {editing && (
                <>
                  <option>미분류</option>
                  <option>보류</option>
                </>
              )}
            </Select>
          </div>
          <p>
            {visible.length.toLocaleString()}개{!editing && ' · 검토를 마친 설명'}
          </p>
          {!visible.length && (
            <p>
              {editing
                ? '검색어 또는 유형을 바꾸어 주세요.'
                : '읽기용 설명을 등록하면 이곳에 모입니다.'}
            </p>
          )}
          <div className="concept-list">
            {visible.slice(currentPage * 30, currentPage * 30 + 30).map((i) => {
              const e = editions.get(i.id),
                proposal = conceptProposal(i);
              return (
                <Button
                  variant="quiet"
                  key={i.id}
                  data-concept-source={i.id}
                  data-navigation-focus={`concept:${catalog.id}:${i.id}:open`}
                  onClick={(event) => {
                    if (!useBook && !catalogId) setCatalogId(catalog.id);
                    setListPosition({
                      sourceId: i.id,
                      x: Math.max(0, window.scrollX),
                      y: Math.max(0, window.scrollY),
                      offset: event.currentTarget.getBoundingClientRect().top,
                    });
                    pendingFocus.current = { scope: viewScope, target: 'reader' };
                    setSelected(i.id);
                  }}
                >
                  <span>{i.name}</span>
                  {editing && (
                    <small>
                      {e?.displayType ?? proposal.displayType ?? '미분류'} ·{' '}
                      {e?.status === 'published'
                        ? '읽기용'
                        : e?.status === 'blocked'
                          ? '보류'
                          : e?.screen
                            ? '내용 검토'
                            : '작성 전'}
                    </small>
                  )}
                </Button>
              );
            })}
          </div>
          {maxPage > 0 && (
            <div className="concept-toolbar">
              <Button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>
                이전 목록
              </Button>
              <span>
                {currentPage + 1} / {maxPage + 1}
              </span>
              <Button disabled={currentPage >= maxPage} onClick={() => setPage(currentPage + 1)}>
                다음 목록
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
function ConceptEditor({
  data,
  catalog,
  original,
  repository,
  onSaved,
  writable,
}: {
  data: AppState;
  catalog: ConceptCatalog;
  original: ConceptOriginal;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  writable: boolean;
}) {
  const saved = data.conceptEditions?.find(
    (e) => e.id === conceptEditionId(catalog.id, original.id),
  );
  const [boot] = useState(() => {
    const key = `${storagePrefix(data)}:concept-editor:${encodeURIComponent(catalog.id)}:${original.id}:v1`;
    const fallback = saved ? conceptContent(saved) : emptyConceptEdition(catalog.id, original);
    try {
      const raw = readConceptDraft(key);
      const draft = raw ? JSON.parse(raw) : null;
      return {
        key,
        version: draft?.version ?? saved?.version ?? 0,
        restored: Boolean(draft),
        checks: Object.fromEntries(
          Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, draft?.checks?.[k] === true]),
        ) as unknown as ConceptChecks,
        text: draft?.text ?? JSON.stringify(fallback, null, 2),
        error: '',
      };
    } catch {
      return {
        key,
        version: saved?.version ?? 0,
        restored: false,
        checks: { ...EMPTY_CONCEPT_CHECKS },
        text: JSON.stringify(fallback, null, 2),
        error: '이전 초안을 읽지 못했습니다. 원문은 보관했습니다. 초안 보관본을 확인해 주세요.',
      };
    }
  });
  const [text, setText] = useState(boot.text),
    [version, setVersion] = useState(boot.version),
    [error, setError] = useState(boot.error),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState<ConceptChecks>(
    boot.restored ? boot.checks : (saved?.checks ?? { ...EMPTY_CONCEPT_CHECKS }),
  );
  let content: ConceptEditionContent | null = null;
  try {
    const parsed = JSON.parse(text);
    validateConceptEdition(
      {
        ...parsed,
        checks: { ...EMPTY_CONCEPT_CHECKS },
        status: parsed.status === 'blocked' ? 'blocked' : 'draft',
      },
      true,
    );
    content = parsed;
  } catch {
    /* Exact input remains recoverable while incomplete. */
  }
  let preview: ConceptScreen | null = null;
  try {
    if (content) {
      validateConceptEdition({
        ...content,
        checks: { ...EMPTY_CONCEPT_CHECKS },
        status: content.status === 'blocked' ? 'blocked' : 'draft',
      });
      preview = content.screen;
    }
  } catch {
    /* Incomplete editing is retained without mounting an invalid screen. */
  }
  const change = (value: string) => {
    setText(value);
    setChecks({ ...EMPTY_CONCEPT_CHECKS });
    setNotice('');
    try {
      storeDraftSafely(boot.key, JSON.stringify({ version, text: value }));
      setError('');
    } catch (e) {
      setError(errorText(e));
    }
  };
  const save = async (publish: boolean) => {
    setBusy(true);
    setError('');
    try {
      if (!content || content.catalogId !== catalog.id || content.sourceId !== original.id)
        throw Error('대상 원문과 설명 형식을 확인해 주세요.');
      const nextContent = {
        ...content,
        checks,
        status: publish
          ? ('published' as const)
          : content.status === 'blocked'
            ? ('blocked' as const)
            : ('draft' as const),
      };
      const next = saveConceptEdition(repository, nextContent, version);
      onSaved(next);
      const nextVersion = next.conceptEditions!.find(
        (e) => e.id === conceptEditionId(catalog.id, original.id),
      )!.version;
      setVersion(nextVersion);
      setText(JSON.stringify(nextContent, null, 2));
      storeDraftSafely(
        boot.key,
        JSON.stringify({ version: nextVersion, text: JSON.stringify(nextContent, null, 2) }),
      );
      await repository.flush?.();
      const storage = repository.getStatus?.();
      const pending = data.namespace === 'personal' && storage &&
        (storage.phase !== 'saved' || storage.pending > 0);
      if (!pending) clearStoredDraft(boot.key);
      setNotice(
        pending ? '설명은 이 기기에 보관했습니다. 서버 저장은 아직 확인되지 않았습니다. 복구용 초안도 유지합니다.'
          : publish ? '읽기용으로 등록했습니다.' : '설명을 저장했습니다. 내용과 화면을 확인해 주세요.',
      );
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="concept-editor">
      <h2>{original.name}</h2>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {saved && (
        <Button
          variant="quiet"
          disabled={busy || !writable}
          onClick={async () => {
            const revision = [...repository.getSnapshot().revisions]
              .reverse()
              .find((r) => r.entityId === saved.id);
            if (!revision?.before) {
              setError('처음 작성한 설명은 이력에서 확인할 수 있습니다.');
              return;
            }
            setBusy(true);
            try {
              const next = repository.execute({
                type: 'undoRevision',
                userId: data.userId,
                namespace: data.namespace,
                opId: crypto.randomUUID(),
                at: new Date().toISOString(),
                revisionId: revision.id,
                expectedVersion: saved.version,
              });
              onSaved(next);
              const restored = next.conceptEditions!.find((e) => e.id === saved.id)!;
              setVersion(restored.version);
              setText(JSON.stringify(conceptContent(restored), null, 2));
              setChecks(restored.checks);
              storeDraftSafely(
                boot.key,
                JSON.stringify({
                  version: restored.version,
                  text: JSON.stringify(conceptContent(restored), null, 2),
                }),
              );
              await repository.flush?.();
              const storage = repository.getStatus?.();
              const pending = data.namespace === 'personal' && storage &&
                (storage.phase !== 'saved' || storage.pending > 0);
              if (!pending) clearStoredDraft(boot.key);
              setNotice(pending
                ? '이 기기에서 직전 수정으로 되돌렸습니다. 서버 저장은 아직 확인되지 않았습니다. 복구용 초안도 유지합니다.'
                : '직전 수정으로 되돌렸습니다. 이후의 이력도 보관했습니다.');
            } catch (e) {
              setError(errorText(e));
            } finally {
              setBusy(false);
            }
          }}
        >
          직전 수정 되돌리기
        </Button>
      )}
      <details>
        <summary>원문·분류 근거·수정 이력</summary>
        <p>{original.def}</p>
        <p>{original.ex}</p>
        <p>{original.insight}</p>
        <p>
          원문 분류: {original.type} · {original.id}
        </p>
        <p>{content?.reason}</p>
        {content?.evidence?.map((e) => (
          <p key={e.url}>
            <a href={e.url} target="_blank" rel="noreferrer">
              {e.title}
            </a>{' '}
            · {e.supports} · {e.checked ? '확인함' : '미확인'}
          </p>
        ))}
        <ol>
          {data.revisions
            .filter((r) => r.entityId === saved?.id)
            .map((r) => (
              <li key={r.id}>
                {r.createdAt} · {r.after.version}번째 수정
              </li>
            ))}
        </ol>
      </details>
      <p>
        작업 결과를 편집하고, 저장 후 내용과 화면을 확인합니다. 본문을 바꾸면 검토 항목이
        해제됩니다.
      </p>
      {content && (
        <>
          <Select
            label="화면 유형"
            value={content.displayType ?? ''}
            onChange={(e) => {
              if (content) {
                const displayType = (e.target.value || null) as typeof content.displayType;
                change(
                  JSON.stringify(
                    {
                      ...content,
                      displayType,
                      screen:
                        content.screen && displayType
                          ? {
                              ...content.screen,
                              type: displayType,
                              ...(content.screen.design
                                ? {
                                    design: {
                                      ...content.screen.design,
                                      templateId: conceptTemplates.templates.find(
                                        (t) => t.type === displayType,
                                      )!.id,
                                      roles: conceptTemplates.templates
                                        .find((t) => t.type === displayType)!
                                        .requiredSlots.map((key) => ({
                                          key,
                                          sceneIds:
                                            content.screen!.design!.roles.find(
                                              (role) => role.key === key,
                                            )?.sceneIds ?? [],
                                        })),
                                    },
                                  }
                                : {}),
                            }
                          : content.screen,
                    },
                    null,
                    2,
                  ),
                );
              }
            }}
          >
            <option value="" disabled={Boolean(content.screen)}>
              아직 정하지 않음
            </option>
            {CONCEPT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Textarea
            label="이 유형을 고른 이유"
            value={content.reason}
            onChange={(e) =>
              content && change(JSON.stringify({ ...content, reason: e.target.value }, null, 2))
            }
          />
          {!content.screen && content.displayType && (
            <Button
              disabled={!writable}
              onClick={() =>
                content &&
                change(
                  JSON.stringify(
                    {
                      ...content,
                      screen: {
                        type: content.displayType,
                        mode: 'plain',
                        navigation: 'static',
                        title: original.name,
                        intro: '',
                        scenes: [
                          {
                            action: '핵심 보기',
                            title: '어떤 뜻인가요?',
                            body: original.def,
                            caption: '',
                            takeaway: original.insight,
                          },
                        ],
                      },
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              설명 작성 시작
            </Button>
          )}
          {content.screen && (
            <>
              <Input
                label="설명 제목"
                value={content.screen.title}
                onChange={(e) =>
                  content?.screen &&
                  change(
                    JSON.stringify(
                      { ...content, screen: { ...content.screen, title: e.target.value } },
                      null,
                      2,
                    ),
                  )
                }
              />
              <Textarea
                label="설명을 시작하는 문장"
                value={content.screen.intro}
                onChange={(e) =>
                  content?.screen &&
                  change(
                    JSON.stringify(
                      { ...content, screen: { ...content.screen, intro: e.target.value } },
                      null,
                      2,
                    ),
                  )
                }
              />
              {content.screen.design && (
                <details>
                  <summary>유형에 필요한 내용 연결</summary>
                  <p>
                    각 역할을 설명하는 장면을 연결합니다. 유형을 바꾼 뒤 비어 있는 역할은 내용을
                    확인하고 연결해 주세요.
                  </p>
                  {content.screen.design.roles.map((role) => (
                    <fieldset className="concept-content-role" key={role.key}>
                      <legend>
                        {(
                          {
                            meaning: '뜻',
                            example: '사례',
                            boundary: '성립 범위와 경계',
                            sharedCase: '같은 사례',
                            comparisonAxes: '비교 기준',
                            difference: '차이',
                            counterCase: '혼동하지 말아야 할 사례',
                            whole: '전체',
                            parts: '부분',
                            relations: '관계',
                            scope: '적용 범위',
                            initialState: '시작 상태',
                            transitions: '변화',
                            mechanism: '변화가 일어나는 이유',
                            result: '결과',
                            conditions: '성립 조건',
                            relationship: '핵심 관계',
                            reason: '관계가 성립하는 이유',
                            consequence: '따라오는 결과',
                            goal: '목표',
                            inputs: '입력',
                            decisions: '판단 갈림길',
                            actions: '실행',
                            verification: '결과 확인',
                            sharedSituation: '같은 상황',
                            criteria: '판단 기준',
                            premises: '전제',
                            judgments: '각 관점의 판단',
                            limits: '판단의 한계',
                          } as Record<string, string>
                        )[role.key] ?? role.key}
                      </legend>
                      {content.screen!.scenes.map((scene) => (
                        <Checkbox
                          key={scene.id}
                          label={scene.action}
                          checked={role.sceneIds.includes(scene.id!)}
                          onChange={(event) => {
                            const nextIds = event.target.checked
                              ? [...role.sceneIds, scene.id!]
                              : role.sceneIds.filter((id) => id !== scene.id);
                            change(
                              JSON.stringify(
                                {
                                  ...content,
                                  screen: {
                                    ...content.screen,
                                    design: {
                                      ...content.screen!.design,
                                      roles: content.screen!.design!.roles.map((current) =>
                                        current.key === role.key
                                          ? { ...current, sceneIds: nextIds }
                                          : current,
                                      ),
                                    },
                                  },
                                },
                                null,
                                2,
                              ),
                            );
                          }}
                        />
                      ))}
                    </fieldset>
                  ))}
                </details>
              )}
              {content.screen.scenes.map((scene, index) => (
                <details key={SCENE_KEYS[index]}>
                  <summary>
                    {index + 1}. {scene.action}
                  </summary>
                  {(['action', 'title', 'body', 'caption', 'takeaway'] as const).map(
                    (field, fieldIndex) => (
                      <Textarea
                        key={field}
                        label={
                          ['선택·단계 이름', '핵심 문장', '설명 본문', '그림 설명', '기억할 판단'][
                            fieldIndex
                          ]
                        }
                        value={scene[field]}
                        onChange={(e) =>
                          content?.screen &&
                          change(
                            JSON.stringify(
                              {
                                ...content,
                                screen: {
                                  ...content.screen,
                                  scenes: content.screen.scenes.map((s, i) =>
                                    i === index ? { ...s, [field]: e.target.value } : s,
                                  ),
                                },
                              },
                              null,
                              2,
                            ),
                          )
                        }
                      />
                    ),
                  )}
                </details>
              ))}
            </>
          )}
          <Textarea
            label="보류 이유"
            value={content.issue}
            onChange={(e) =>
              content &&
              change(
                JSON.stringify(
                  {
                    ...content,
                    issue: e.target.value,
                    status: e.target.value ? 'blocked' : 'draft',
                  },
                  null,
                  2,
                ),
              )
            }
          />
        </>
      )}
      <details open={!content}>
        <summary>제작 데이터 직접 편집</summary>
        <Textarea
          label="설명 제작 데이터"
          value={text}
          rows={18}
          onChange={(e) => change(e.target.value)}
        />
      </details>
      <div className="concept-toolbar">
        <Button disabled={!writable || busy || Boolean(boot.error)} onClick={() => save(false)}>
          설명 저장
        </Button>
        <Button
          variant="quiet"
          onClick={() => downloadConceptFile(text, `${original.id}-draft.json`)}
        >
          현재 입력을 파일로 보관
        </Button>
      </div>
      {preview && (
        <ConceptReader
          screen={preview}
          name={original.name}
          sourceKey={`${catalog.id}:${original.id}`}
          data={data}
        />
      )}
      <fieldset>
        <legend>내용과 화면 검토</legend>
        {Object.entries(labels).map(([key, label]) => (
          <Checkbox
            key={key}
            label={label}
            checked={checks[key as keyof ConceptChecks]}
            onChange={(e) => {
              const next = { ...checks, [key]: e.target.checked };
              setChecks(next);
              try {
                storeDraftSafely(boot.key, JSON.stringify({ version, text, checks: next }));
                setError('');
              } catch (error) {
                setError(errorText(error));
              }
            }}
          />
        ))}
      </fieldset>
      <Button
        variant="quiet"
        disabled={!writable || busy || Boolean(boot.error) || version === 0}
        onClick={() => save(false)}
      >
        검토 내용 저장
      </Button>
      <Button
        disabled={!writable || busy || !Object.values(checks).every(Boolean) || version === 0}
        onClick={() => save(true)}
      >
        읽기용으로 등록
      </Button>
    </section>
  );
}
export function ConceptReader({
  screen,
  name,
  sourceKey,
  data,
}: {
  screen: ConceptScreen;
  name: string;
  sourceKey: string;
  data: Pick<AppState, 'namespace' | 'userId'>;
}) {
  const readingKey = conceptReadingKey(data, sourceKey);
  const currentHeading = useRef<HTMLHeadingElement>(null);
  const observationControls = useRef<HTMLDivElement>(null);
  const [positionError, setPositionError] = useState('');
  const [selection, setSelection] = useViewContext(
    data,
    `concept-scene:${sourceKey}:${screen.scenes.map((s, i) => conceptSceneKey(screen, i)).join('|')}`,
    readConceptPosition(readingKey, screen),
    isViewPage,
  );
  const index = Math.min(selection, screen.scenes.length - 1);
  const question = screen.design?.question.trim() ?? '';
  const questionMatchesName = question === name.trim();
  const questionMatchesTitle = question === screen.title.trim();
  const hasNavigation = screen.navigation !== 'static' && screen.scenes.length > 1;
  const select = (next: number) => {
    setSelection(next);
    try {
      saveConceptPosition(readingKey, screen, next);
      setPositionError('');
    } catch {
      setPositionError('읽던 위치를 이 기기에 저장하지 못했습니다. 현재 화면은 유지했습니다.');
    }
  };
  const returnToObservation = () => {
    currentHeading.current?.focus({ preventScroll: true });
    (observationControls.current ?? currentHeading.current)?.scrollIntoView({ block: 'start' });
  };
  if (!Array.isArray(screen.scenes) || !screen.scenes.length)
    return <p>화면의 설명을 확인해 주세요.</p>;
  return (
    <article
      className="concept-reader"
      data-reading-type={screen.type}
      data-interaction={screen.navigation}
    >
      <header className="concept-reader-header">
        <h2
          ref={
            screen.scenes[index]?.title.trim() === screen.title.trim() ? currentHeading : undefined
          }
          tabIndex={-1}
          data-observation-region={question && questionMatchesName ? 'question' : undefined}
        >
          <ConceptText text={name} />
        </h2>
        <p
          className="concept-lead"
          data-observation-region={
            question && !questionMatchesName && questionMatchesTitle ? 'question' : undefined
          }
        >
          <ConceptText text={screen.title} />
        </p>
        {question && !questionMatchesName && !questionMatchesTitle && (
          <p className="concept-question" data-observation-region="question">
            <ConceptText text={question} />
          </p>
        )}
        {screen.intro.trim() !== question && screen.intro.trim() !== screen.title.trim() && (
          <p className="concept-intro">
            <ConceptText text={screen.intro} />
          </p>
        )}
      </header>
      {hasNavigation && (
        <div
          className="concept-observation-controls"
          ref={observationControls}
          data-observation-region="controls"
        >
          {screen.navigation === 'choose' ? (
            <fieldset className="concept-options" aria-label="사례 선택">
              {screen.scenes.map((s, i) => (
                <Button
                  key={SCENE_KEYS[i]}
                  variant="quiet"
                  aria-pressed={i === index}
                  onClick={() => select(i)}
                >
                  <ConceptText text={s.action} />
                </Button>
              ))}
            </fieldset>
          ) : (
            <nav className="concept-toolbar concept-reader-navigation" aria-label="설명 순서">
              <Button variant="quiet" disabled={index === 0} onClick={() => select(index - 1)}>
                이전
              </Button>
              <span data-observation-region="readout" aria-live="polite">
                {index + 1} / {screen.scenes.length}
              </span>
              <Button
                variant="quiet"
                disabled={index === screen.scenes.length - 1}
                onClick={() => select(index + 1)}
              >
                다음
              </Button>
            </nav>
          )}
        </div>
      )}
      <div className="concept-stages">
        {screen.scenes.map((s, i) => {
          const visual = s.visual ? (
            <KnowledgeStructure
              visual={s.visual}
              data={data}
              viewKey={`${sourceKey}:${conceptSceneKey(screen, i)}`}
            />
          ) : s.figure ? null : (
            renderConceptDiagram(screen, i)
          );
          return (
            <section
              key={SCENE_KEYS[i]}
              className={`concept-stage ${i === index ? 'is-current' : ''}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              {s.title.trim() !== screen.title.trim() && (
                <h3 ref={i === index ? currentHeading : undefined} tabIndex={-1}>
                  <ConceptText text={s.title} />
                </h3>
              )}
              {(s.figure || visual) && (
                <div className="concept-observation-visual" data-observation-region="visual">
                  {s.figure && (
                    <ConceptFigureView
                      figure={s.figure}
                      data={data}
                      viewKey={`${sourceKey}:${conceptSceneKey(screen, i)}`}
                    />
                  )}
                  {visual}
                </div>
              )}
              {(s.formula || s.math) && (
                <div className="concept-observation-readout" data-observation-region="readout">
                  {s.formula ? (
                    <MathFormula tex={s.formula.tex} label={s.formula.spoken} />
                  ) : (
                    <p className="concept-math" data-concept-text={s.math}>
                      <ConceptText text={s.math ?? ''} />
                    </p>
                  )}
                </div>
              )}
              <div className="concept-observation-reasoning" data-observation-region="reasoning">
                <div className="concept-body" data-concept-text={s.body}>
                  {s.body
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        <ConceptText text={paragraph} />
                      </p>
                    ))}
                </div>
                {s.caption &&
                  s.caption.trim() !== (s.figure?.caption ?? s.figure?.description)?.trim() && (
                    <p className="concept-caption" data-concept-text={s.caption}>
                      <ConceptText text={s.caption} />
                    </p>
                  )}
                {s.takeaway && (
                  <p className="concept-takeaway" data-concept-text={s.takeaway}>
                    <ConceptText text={s.takeaway} />
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
      {hasNavigation && (
        <div className="concept-reader-footer">
          <Button variant="quiet" onClick={returnToObservation}>
            현재 관찰로 이동
          </Button>
          <Button variant="quiet" onClick={() => select(0)}>
            처음부터 보기
          </Button>
        </div>
      )}
      {positionError && <p role="status">{positionError}</p>}
    </article>
  );
}

function renderConceptDiagram(screen: ConceptScreen, index: number) {
  if (screen.mode === 'structure')
    return (
      <figure className="concept-diagram">
        <svg
          className="concept-svg"
          viewBox="0 0 480 160"
          role="img"
          aria-label="세 방어층의 약점이 서로 다른 위치에 있는 단순화한 모형"
        >
          {['설계', '점검', '조작'].map((label, i) => (
            <g key={label} opacity={i === index ? 1 : 0.45}>
              <rect
                x={30 + i * 155}
                y={30}
                width={100}
                height={90}
                rx={4}
                fill="none"
                stroke="currentColor"
                strokeWidth={i === index ? 2 : 1}
              />
              <circle
                cx={55 + i * 155}
                cy={i === 1 ? 55 : 75}
                r={10}
                fill="none"
                stroke="currentColor"
              />
              <circle
                cx={100 + i * 155}
                cy={i === 1 ? 95 : 65}
                r={12}
                fill="none"
                stroke="currentColor"
              />
              <text x={80 + i * 155} y={145} textAnchor="middle" fill="currentColor">
                {label}
              </text>
            </g>
          ))}
        </svg>
        <figcaption>방어층과 약점의 관계를 보여 주는 단순화한 그림입니다.</figcaption>
      </figure>
    );
  if (screen.mode === 'comparison')
    return (
      <figure className="concept-diagram">
        <svg
          className="concept-svg"
          viewBox="0 0 480 155"
          role="img"
          aria-label={
            index === 1
              ? '더운 날씨가 판매와 사고에 각각 영향을 준다는 가설'
              : '함께 변한다는 관찰과 원인이라는 판단의 구별'
          }
        >
          <defs>
            <marker
              id="concept-arrow"
              viewBox="0 0 10 10"
              refX={8}
              refY={5}
              markerWidth={6}
              markerHeight={6}
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {index === 1 ? (
            <>
              <text x={240} y={25} textAnchor="middle">
                더운 날씨
              </text>
              <path
                d="M 230 35 L 110 85 M 250 35 L 370 85"
                stroke="currentColor"
                fill="none"
                markerEnd="url(#concept-arrow)"
              />
            </>
          ) : (
            <>
              <path
                d="M 170 85 L 310 85"
                stroke="currentColor"
                fill="none"
                markerStart="url(#concept-arrow)"
                markerEnd="url(#concept-arrow)"
              />
              <text x={240} y={60} textAnchor="middle">
                {index === 0 ? '함께 변함' : '원인 판단에는 추가 확인'}
              </text>
            </>
          )}
          <text x={110} y={115} textAnchor="middle">
            아이스크림 판매
          </text>
          <text x={370} y={115} textAnchor="middle">
            물놀이 사고
          </text>
        </svg>
        <figcaption>
          {index === 1
            ? '화살표는 확인할 가설입니다.'
            : '함께 증가했다는 관찰만으로 원인을 결정할 수 없습니다.'}
        </figcaption>
      </figure>
    );
  if (screen.mode === 'pigeon') {
    const count = [12, 13, 25][index] ?? 13;
    return (
      <figure className="concept-diagram">
        <figcaption>{count}명을 12개월로 나누면</figcaption>
        <div className="concept-months">
          {MONTHS.map((month) => (
            <span key={month}>
              {month}월<strong>{Math.floor(count / 12) + (month <= count % 12 ? 1 : 0)}명</strong>
            </span>
          ))}
        </div>
        <small>가능한 배치의 한 예입니다.</small>
      </figure>
    );
  }
  const nodes =
    screen.mode === 'opportunity'
      ? ['공부', '산책', '영상']
      : screen.mode === 'feedback'
        ? ['마이크', '앰프', '스피커', '마이크로 돌아옴']
        : screen.mode === 'proof'
          ? ['목표', '반대 가정', '모순', '결론']
          : screen.mode === 'structure'
            ? ['설계', '점검', '조작']
            : screen.mode === 'comparison'
              ? index === 1
                ? ['더운 날씨', '아이스크림 판매 증가', '물놀이 사고 증가']
                : ['함께 변함', '추가 확인', '원인 판단']
              : screen.mode === 'perspective'
                ? ['안 A · 전체 이익과 소수의 손실', '안 B · 더 작은 이익과 접근 유지']
                : [];
  return nodes.length ? (
    <figure className="concept-diagram concept-nodes" aria-label="관계 살펴보기">
      {nodes.map((n, i) => (
        <div key={n} className={i === index ? 'concept-node is-selected' : 'concept-node'}>
          {n}
          {screen.mode === 'opportunity' && (
            <small>
              {i === index
                ? '선택'
                : i === (index === 0 ? 1 : 0)
                  ? '포기한 가장 가치 있는 대안'
                  : '다른 대안'}
            </small>
          )}
          {screen.mode === 'feedback' && i < 3 && <span aria-hidden="true"> →</span>}
        </div>
      ))}
    </figure>
  ) : null;
}
