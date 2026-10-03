import { useCallback, useEffect, useState } from 'react';
import { ExperienceRecoveryControl } from './experience-recovery';
import type { AppState, StudyRecord } from '../domain/model';
import { BRAND, emptyExperience, retainNextAction, type ExperienceState } from '../domain/brand';
import { BrandWordmark } from './brand-wordmark';
import {
  EXPERIENCE_CHANGED,
  experienceKey,
  experienceReadingWidthKey,
  experienceUnstored,
  readExperience,
  updateExperience,
  resolveWorkLocation,
  trackExperience,
  downloadText,
} from '../data/experience-state';
import type { StudyRepository } from '../data/repository';
import {
  clearStoredDraft,
  readRescuedDraft,
  storeDraftSafely,
  draftHasUnstoredText,
} from '../data/draft-safety';
import { Button, Card, Checkbox, ErrorState, Modal, Select, Textarea } from './index';
import { navigate } from './navigation-context';
import { useViewContext, isViewText } from './use-view-context';
import './brand-experience.css';

const errorText = (e: unknown) =>
  e instanceof DOMException && e.name === 'QuotaExceededError'
    ? '이 기기의 저장 공간이 부족합니다. 입력한 글은 유지했습니다. 공간을 확보한 뒤 다시 저장해 주세요.'
    : e instanceof Error
      ? e.message
      : '보관한 내용과 저장 결과를 확인하지 못했습니다.';
export function BrandIdentity({ compact = false }: { compact?: boolean }) {
  return (
    <a className={compact ? 'small-brand brand-wordmark' : 'brand brand-wordmark'} href="#/">
      <BrandWordmark />
      {!compact && <span className="brand-promise">{BRAND.promise}</span>}
    </a>
  );
}
export function useExperience(data: AppState) {
  const key = experienceKey(data);
  const widthKey = experienceReadingWidthKey(data);
  const [state, setState] = useState<ExperienceState>(emptyExperience);
  const [error, setError] = useState('');
  const [readBlocked, setReadBlocked] = useState(false);
  const refresh = useCallback(() => {
    try {
      setState(readExperience(data));
      setReadBlocked(false);
      setError(
        experienceUnstored(data)
          ? '이 기기에 저장하지 못한 내용이 있습니다. 화면의 입력은 유지했습니다. 저장을 다시 시도해 주세요.'
          : '',
      );
    } catch (e) {
      setReadBlocked(true);
      setError(errorText(e));
    }
  }, [data]);
  useEffect(() => {
    refresh();
    const changed = (e: Event) => {
      if (!(e instanceof CustomEvent) || e.detail === key) refresh();
    };
    const storage = (e: StorageEvent) => {
      if (e.key === key || e.key === widthKey) refresh();
    };
    window.addEventListener(EXPERIENCE_CHANGED, changed);
    window.addEventListener('storage', storage);
    return () => {
      window.removeEventListener(EXPERIENCE_CHANGED, changed);
      window.removeEventListener('storage', storage);
    };
  }, [key, widthKey, refresh]);
  const change = (fn: (current: ExperienceState) => ExperienceState) => {
    try {
      const next = updateExperience(data, fn);
      setState(next);
      setError('');
      return true;
    } catch (e) {
      setError(errorText(e));
      return false;
    }
  };
  return { state, error, readBlocked, change, refresh };
}

/** User text uses the established exact draft rescue, including failed writes. */
function useLocalText(key: string) {
  const read = () => {
    try {
      return {
        text: readRescuedDraft(key) ?? localStorage.getItem(key) ?? '',
        error: draftHasUnstoredText(key)
          ? '이 기기에 저장하지 못한 글입니다. 현재 창의 입력은 유지했습니다. 다시 저장해 주세요.'
          : '',
        blocked: false,
      };
    } catch {
      return {
        text: '',
        error: '보관한 글을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 다시 읽어 주세요.',
        blocked: true,
      };
    }
  };
  const [initial] = useState(read),
    [text, setText] = useState(initial.text),
    [error, setError] = useState(initial.error),
    [blocked, setBlocked] = useState(initial.blocked);
  const retry = () => {
    if (blocked) {
      const next = read();
      setText(next.text);
      setBlocked(next.blocked);
      setError(next.error);
    } else input(text);
  };
  const input = (value: string) => {
    setText(value);
    if (blocked) return;
    try {
      storeDraftSafely(key, value);
      setError('');
    } catch {
      setError(
        '이 기기에 글을 저장하지 못했습니다. 현재 입력은 유지했습니다. 공간을 확인한 뒤 다시 저장해 주세요.',
      );
    }
  };
  const clear = () => {
    clearStoredDraft(key);
    setText('');
    setError('');
  };
  return { text, input, error, blocked, retry, clear };
}

export function BrandContinuity({ data, route }: { data: AppState; route: string }) {
  const experience = useExperience(data);
  useEffect(() => {
    const location = resolveWorkLocation(data, route);
    if (!location) return;
    try {
      updateExperience(data, (state) =>
        state.last?.route === location.route && state.last.label === location.label
          ? state
          : { ...state, last: location },
      );
    } catch {
      /* The home/recovery surface shows the retained error; navigation remains usable. */
    }
  }, [route, data]);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [open, setOpen] = useState(false),
    [notice, setNotice] = useState('');
  const draft = useLocalText(`${experienceKey(data)}:next-draft`);
  const nextLocation =
    experience.state.next && resolveWorkLocation(data, experience.state.next.location.route);
  const last = experience.state.last && resolveWorkLocation(data, experience.state.last.route);
  const resume = (path: string) => {
    try {
      trackExperience(data, 'resume');
    } catch {
      /* Measurements never block study. */
    }
    navigate(path);
  };
  const saveNext = () => {
    const location = resolveWorkLocation(data, route) ??
      last ?? { route: '/subjects', label: '공부할 범위' };
    if (draft.blocked || !draft.text.trim()) return;
    if (!experience.change((state) => retainNextAction(state, { location, body: draft.text })))
      return;
    setNotice('다음에 할 일로 남겨두었습니다. 이 기기에 보관합니다.');
    try {
      draft.clear();
    } catch {
      setNotice('다음에 할 일은 보관했습니다. 입력 초안 정리는 다시 시도해 주세요.');
    }
    try {
      trackExperience(data, 'next-step');
    } catch {
      /* No success claim about measurement. */
    }
    setOpen(false);
  };
  return (
    <>
      {route === '/' ? (
        <Card className="brand-resume" aria-label="하던 공부 이어가기">
          <div className="brand-home-identity">
            <BrandIdentity />
          </div>
          <div>
            <h2>{last ? '하던 생각부터 이어가세요.' : BRAND.headline}</h2>
            <p>{last ? last.label : BRAND.description}</p>
          </div>
          {experience.state.next && (
            <div>
              <p className="muted">직접 남긴 다음 행동 · 이 기기에 보관</p>
              <p className="brand-next">{experience.state.next.body}</p>
              {!nextLocation && experience.state.next.location.route !== '/subjects' && (
                <p>이전 대상은 현재 자료에서 찾지 못했습니다. 남긴 글은 유지했습니다.</p>
              )}
              <div className="actions">
                <Button onClick={() => resume(nextLocation?.route ?? '/subjects')}>
                  다음 행동 열기
                </Button>
                <Button
                  variant="quiet"
                  onClick={() => {
                    if (experience.change((s) => retainNextAction(s, null)))
                      setNotice('다음 행동 표시를 해제했습니다. 이전 글은 아래에 보관했습니다.');
                  }}
                >
                  다음 행동 표시 해제
                </Button>
              </div>
            </div>
          )}
          {Boolean(experience.state.nextHistory?.length) && (
            <details>
              <summary>이전에 남긴 다음 행동</summary>
              {experience.state.nextHistory
                ?.slice()
                .reverse()
                .slice(0, historyLimit)
                .map((previous) => (
                  <article key={previous.id}>
                    <p className="muted">
                      {previous.location.label} ·{' '}
                      {new Date(previous.archivedAt).toLocaleString('ko-KR')}
                    </p>
                    <p className="brand-next">{previous.body}</p>
                    <Button
                      onClick={() => {
                        if (
                          experience.change((state) =>
                            retainNextAction(state, {
                              location: previous.location,
                              body: previous.body,
                            }),
                          )
                        )
                          setNotice('이전 다음 행동을 다시 표시했습니다. 다른 원문도 보관합니다.');
                      }}
                    >
                      이 다음 행동 다시 표시
                    </Button>
                  </article>
                ))}
              {(experience.state.nextHistory?.length ?? 0) > historyLimit && (
                <Button onClick={() => setHistoryLimit((n) => n + 20)}>
                  이전 다음 행동 더 보기
                </Button>
              )}
            </details>
          )}
          <div className="actions">
            {last && (
              <Button variant="primary" onClick={() => resume(last.route)}>
                이어가기
              </Button>
            )}
            {!last && (
              <Button variant="primary" onClick={() => navigate('/materials')}>
                자료 가져오기
              </Button>
            )}
            <Button
              onClick={() => {
                setNotice('');
                setOpen(true);
              }}
            >
              다음에 펼칠 곳 남기기
            </Button>
          </div>
          {experience.error && (
            <>
              <ErrorState message={experience.error} onRetry={() => experience.change((s) => s)} />
              <ExperienceRecoveryControl data={data} onRecovered={experience.refresh} />
            </>
          )}
          {notice && <p role="status">{notice}</p>}
        </Card>
      ) : (
        resolveWorkLocation(data, route) && (
          <div className="actions">
            <Button
              variant="quiet"
              onClick={() => {
                setNotice('');
                setOpen(true);
              }}
            >
              다음에 펼칠 곳 남기기
            </Button>
            {notice && <span role="status">{notice}</span>}
          </div>
        )
      )}
      <Modal open={open} title="다음에 펼칠 곳을 남겨둘까요?" onClose={() => setOpen(false)}>
        <p>
          선택 사항입니다. 직접 적은 행동을 이 기기에 보관하며 공부 완료나 정답으로 처리하지
          않습니다.
        </p>
        {experience.state.next && (
          <p>남기면 다음 행동 표시를 바꿉니다. 이전 글은 홈에서 다시 표시할 수 있습니다.</p>
        )}
        <Textarea
          label="다음에 할 일"
          value={draft.text}
          disabled={draft.blocked}
          data-editing-context="brand-next-action"
          onChange={(e) => draft.input(e.target.value)}
        />
        {draft.error && <ErrorState message={draft.error} onRetry={draft.retry} />}
        {experience.error && <>
          <ErrorState message={experience.error} onRetry={experience.refresh} />
          <p>입력한 글은 유지했습니다. 건너뛰기로 닫은 뒤 설정 원문·보관본 확인에서 복구해 주세요.</p>
        </>}
        <div className="actions">
          <Button
            variant="primary"
            disabled={draft.blocked || !draft.text.trim()}
            onClick={saveNext}
          >
            다음 행동 남기기
          </Button>
          <Button onClick={() => setOpen(false)}>건너뛰기</Button>
        </div>
      </Modal>
    </>
  );
}

export function ExperienceSettings({ data }: { data: AppState }) {
  const { state, change, error, readBlocked, refresh } = useExperience(data);
  return (
    <>
      <Select
        label="본문 읽기 폭"
        disabled={readBlocked}
        value={readBlocked ? 'unreadable' : state.readingWidth}
        onChange={(e) =>
          change((s) => ({ ...s, readingWidth: e.target.value === 'wide' ? 'wide' : 'normal' }))
        }
      >
        {readBlocked && <option value="unreadable">저장한 읽기 폭 확인 필요</option>}
        <option value="normal">읽기 편한 폭</option>
        <option value="wide">가용 화면 전체</option>
      </Select>
      {error && <ErrorState message={error} onRetry={refresh} />}
      <ExperienceRecoveryControl data={data} onRecovered={refresh} />
    </>
  );
}

export function RelatedThinking({ data, nodeId }: { data: AppState; nodeId: string }) {
  const rows = data.records
    .filter(
      (r) =>
        !r.deletedAt &&
        r.userId === data.userId &&
        r.namespace === data.namespace &&
        r.targetId === nodeId &&
        r.body.trim(),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const notes = (data.memos ?? []).filter(
    (m) =>
      !m.deletedAt &&
      m.userId === data.userId &&
      m.namespace === data.namespace &&
      m.ownerId === nodeId,
  );
  const [limit, setLimit] = useState(5);
  if (!rows.length && !notes.length) return null;
  const track = () => {
    try {
      trackExperience(data, 'reuse');
    } catch {
      /* Optional count only. */
    }
  };
  return (
    <details className="brand-related">
      <summary>이 주제에 남긴 생각 다시 보기</summary>
      <p>같은 주제에 직접 연결된 기록입니다. 이전 설명을 현재의 정답으로 판단하지 않습니다.</p>
      {rows.slice(0, limit).map((row) => (
        <article key={row.id}>
          <p className="prose">{row.body}</p>
          <a
            href={`#/node/${encodeURIComponent(nodeId)}`}
            onClick={(event) => {
              const anchor = Array.from(
                document.querySelectorAll<HTMLElement>('[data-reading-anchor]'),
              ).find((el) => el.dataset.readingAnchor === `record:${row.id}`);
              if (anchor) {
                event.preventDefault();
                anchor.scrollIntoView({ block: 'start', behavior: 'auto' });
              }
              track();
            }}
          >
            이 주제의 원문·기록 열기
          </a>
        </article>
      ))}
      {notes.slice(0, limit).map((row) => (
        <article key={row.id}>
          <p className="prose">{row.body}</p>
          <a href={`#/memos/${encodeURIComponent(row.id)}`} onClick={track}>
            메모 열기
          </a>
        </article>
      ))}
      {(rows.length > limit || notes.length > limit) && (
        <Button onClick={() => setLimit((n) => n + 10)}>이전 생각 더 보기</Button>
      )}
    </details>
  );
}

const ownRecord = (data: AppState, r: StudyRecord) =>
  !r.deletedAt && r.userId === data.userId && r.namespace === data.namespace;
export function BrandService({
  data,
  repository,
  page,
}: {
  data: AppState;
  repository: StudyRepository;
  page: string;
}) {
  const experience = useExperience(data);
  const [notice, setNotice] = useState(''),
    [limit, setLimit] = useState(40);
  const [query, setQuery] = useViewContext(data, `brand-query:${page}`, '', isViewText);
  const [chosen, setChosen] = useViewContext<string[]>(
    data,
    'brand-share-selection',
    [],
    (value): value is string[] =>
      Array.isArray(value) && value.every((id) => typeof id === 'string'),
  );
  const [includeHistory, setIncludeHistory] = useViewContext(
    data,
    'brand-share-history',
    false,
    (value): value is boolean => typeof value === 'boolean',
  );
  const supportDraft = useLocalText(`${experienceKey(data)}:support-draft`);
  const [supportId, setSupportId] = useState(() => {
    try {
      return (
        readExperience(data)
          .support.slice()
          .reverse()
          .find((r) => r.body === supportDraft.text)?.id ?? crypto.randomUUID()
      );
    } catch {
      return crypto.randomUUID();
    }
  });
  const records = data.records
    .filter((r) => ownRecord(data, r) && r.body.trim())
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const selectable = records.filter(
    (r) =>
      !query ||
      `${r.body} ${data.nodes.find((n) => n.id === r.targetId)?.name ?? ''}`.includes(query),
  );
  const selected = records.filter((r) => chosen.includes(r.id));
  const selectedIds = new Set(selected.map((r) => r.id));
  const versions = includeHistory
    ? [
        ...selected,
        ...data.revisions
          .filter(
            (v) =>
              v.collection === 'records' &&
              selectedIds.has(v.entityId) &&
              v.userId === data.userId &&
              v.namespace === data.namespace,
          )
          .flatMap((v) => [v.before, v.after])
          .filter((v): v is StudyRecord =>
            Boolean(
              v &&
              'sessionId' in v &&
              selectedIds.has(v.id) &&
              v.userId === data.userId &&
              v.namespace === data.namespace,
            ),
          ),
      ]
    : selected;
  const uniqueVersions = [
    ...new Map(versions.map((r) => [`${r.id}:${r.version}`, r])).values(),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.version - b.version);
  const share = uniqueVersions
    .map((r) => {
      const title =
        data.nodes.find((n) => n.id === r.targetId && !n.deletedAt)?.name ?? '공부 기록';
      const date =
        r.dateEvidence.kind === 'exact'
          ? r.dateEvidence.date
          : r.dateEvidence.kind === 'range'
            ? `${r.dateEvidence.from} ~ ${r.dateEvidence.to}`
            : '미확인';
      return `${title}\n공부한 날짜: ${date}\n기록 ID: ${r.id} · 버전 ${r.version}\n\n${r.body}`;
    })
    .join('\n\n────────\n\n');
  const exportText = share
    ? `${share}\n\n${BRAND.name} · ${BRAND.promise}\n선택한 원문을 내보낸 파일입니다. 독립 수행·정확성·숙달을 뜻하지 않습니다.\n`
    : '';
  const preserve = () =>
    downloadText(
      'manseeksong-preserved-records.json',
      JSON.stringify({ data: repository.getSnapshot(), experience: experience.state }, null, 2),
      'application/json',
    );
  const saveRequest = () => {
    if (supportDraft.blocked || !supportDraft.text.trim()) return;
    if (
      experience.change((s) => {
        const prior = s.support.find((r) => r.id === supportId);
        const history =
          prior && prior.body !== supportDraft.text
            ? [
                ...(prior.history ?? []),
                { id: crypto.randomUUID(), body: prior.body, updatedAt: prior.updatedAt },
              ]
            : (prior?.history ?? []);
        return {
          ...s,
          support: [
            ...s.support.filter((r) => r.id !== supportId),
            {
              id: supportId,
              body: supportDraft.text,
              updatedAt: new Date().toISOString(),
              history,
            },
          ],
        };
      })
    )
      setNotice('문제 메모를 이 기기에 보관했습니다. 외부 접수나 전송은 하지 않았습니다.');
  };
  return (
    <div className="brand-service">
      {page === '/about' && (
        <>
          <Card>
            <p className="brand-wordmark">{BRAND.name}</p>
            <h2>{BRAND.promise}</h2>
            <p>{BRAND.company}</p>
            <p>
              직접 남긴 생각을 다시 찾아 쓰고, 하던 공부로 돌아오는 공간입니다. 글과 수정 기록, 부분
              수행과 아직 모르는 부분을 구별해 남깁니다.
            </p>
            <a href="#/">오늘 공부로 돌아가기</a>
          </Card>
          <Card>
            <h2>내 글과 내 선택</h2>
            <p>
              공부함 체크는 시도한 활동입니다. 이해·정확성·독립 수행을 자동 판단하지 않습니다. 다음
              행동은 직접 바꿀 수 있고, 기록과 이력은 원래 의미로 확인할 수 있습니다.
            </p>
            <a href="#/help">저장·복구 도움말</a>
          </Card>
          <Card>
            <h2>이번에 달라진 사용 경험</h2>
            <p>
              홈에서 하던 공부로 돌아가고, 다음에 할 일을 직접 남길 수 있습니다. 같은 주제의 이전
              생각을 다시 열고, 선택한 글을 미리 본 뒤 파일로 내보낼 수 있습니다.
            </p>
            <p>
              다음 행동·읽기 폭·이용 관찰·문제 메모는 현재 기기에 보관합니다. 공부 기록의 서버 저장
              상태와는 구별합니다.
            </p>
          </Card>
        </>
      )}
      {page === '/help' && (
        <>
          <Card>
            <h2>저장한 곳을 먼저 확인하세요</h2>
            <p>
              작성 중인 초안과 보기 설정은 현재 기기에 보관합니다. 개인 공간의 서버 반영은 상단 저장
              상태에서 확인하세요. 전송 대기·오류·충돌은 서버 저장 완료와 다릅니다.
            </p>
            <p>
              두 편집본이 충돌하면 원문을 확인한 뒤 선택하세요. 접속 문제를 해결하려고 브라우저
              자료를 지우기 전에 보존 파일을 내려받아 주세요.
            </p>
            <div className="actions">
              <Button onClick={preserve}>현재 기록과 이력 내려받기</Button>
              <a href="#/backup">초안·첨부를 포함한 백업</a>
              <a href="#/draft-archives">초안 보관본 열기</a>
            </div>
          </Card>
          <Card>
            <h2>문제가 생긴 상황 남기기</h2>
            <p>
              어떤 화면에서 무엇을 하다 문제가 생겼는지 적어 주세요. 글·비밀번호·계정 키는 자동
              첨부하지 않습니다. 상황과 시도한 해결 방법을 이 기기에 남겨 두고, 다시 확인하거나 파일로
              내려받을 수 있습니다.
            </p>
            <Textarea
              label="문제 메모"
              value={supportDraft.text}
              disabled={supportDraft.blocked}
              data-editing-context="brand-support"
              onChange={(e) => supportDraft.input(e.target.value)}
            />
            {supportDraft.error && (
              <ErrorState message={supportDraft.error} onRetry={supportDraft.retry} />
            )}
            <div className="actions">
              <Button
                disabled={supportDraft.blocked || !supportDraft.text.trim()}
                onClick={saveRequest}
              >
                문제 메모 보관
              </Button>
              <Button
                disabled={!supportDraft.text.trim()}
                onClick={() =>
                  downloadText(
                    `manseeksong-inquiry-${supportId}.txt`,
                    `메모 식별 번호: ${supportId}\n상태: 이 기기에 작성 · 외부 전송 없음\n\n${supportDraft.text}`,
                  )
                }
              >
                메모 파일 내려받기
              </Button>
              <Button
                variant="quiet"
                disabled={
                  supportDraft.blocked ||
                  Boolean(supportDraft.error) ||
                  !experience.state.support.some(
                    (r) => r.id === supportId && r.body === supportDraft.text,
                  )
                }
                onClick={() => {
                  setSupportId(crypto.randomUUID());
                  supportDraft.input('');
                  setNotice('이전 메모는 보관하고 새 메모를 엽니다.');
                }}
              >
                새 메모 작성
              </Button>
            </div>
            {notice && <p role="status">{notice}</p>}
          </Card>
          {experience.state.support.length > 0 && (
            <>
              <Textarea
                textRole="interface" label="보관한 메모 찾기"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setLimit(40);
                }}
              />
              {experience.state.support
                .filter((r) => !query || `${r.id} ${r.body}`.includes(query))
                .slice()
                .reverse()
                .slice(0, limit)
                .map((r) => (
                  <Card key={r.id}>
                    <h3>이 기기에 보관한 메모</h3>
                    <p className="muted">
                      식별 번호 {r.id} · {new Date(r.updatedAt).toLocaleString('ko-KR')}
                    </p>
                    <pre>{r.body}</pre>
                    {Boolean(r.history?.length) && (
                      <details>
                        <summary>이 메모의 이전 글 {r.history?.length}개</summary>
                        {r.history?.map((version) => (
                          <div key={version.id ?? `${version.updatedAt}:${version.body}`}>
                            <p className="muted">
                              {new Date(version.updatedAt).toLocaleString('ko-KR')}
                            </p>
                            <pre>{version.body}</pre>
                          </div>
                        ))}
                      </details>
                    )}
                    <Button
                      onClick={() =>
                        downloadText(
                          `manseeksong-inquiry-${r.id}.txt`,
                          `메모 식별 번호: ${r.id}\n상태: 이 기기에 보관 · 외부 전송 없음\n\n${r.body}`,
                        )
                      }
                    >
                      이 메모 내려받기
                    </Button>
                  </Card>
                ))}
              {!experience.state.support.some(
                (r) => !query || `${r.id} ${r.body}`.includes(query),
              ) && <p>조건에 맞는 메모가 없습니다. 검색어를 바꿔 주세요.</p>}
              {experience.state.support.filter((r) => !query || `${r.id} ${r.body}`.includes(query))
                .length > limit && (
                <Button onClick={() => setLimit((n) => n + 40)}>보관한 메모 더 보기</Button>
              )}
            </>
          )}
        </>
      )}
      {page === '/my-progress' && (
        <>
          <Card>
            <h2>남긴 생각에서 달라진 설명까지</h2>
            <p>
              기록 {records.length}개를 다시 읽을 수 있습니다. 기록 수는 활동의 흔적이며 실력이나
              성적을 뜻하지 않습니다.
            </p>
            <p>
              내보낼 글만 직접 선택하세요. 아래 미리보기에 있는 내용만 파일에 포함됩니다. 다른
              글·이름·개인 설정·문제 메모는 첨부하지 않습니다.
            </p>
            <Textarea
              textRole="interface" label="공유할 기록 찾기"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setLimit(40);
              }}
            />
            {!selectable.length && (
              <p>조건에 맞는 글이 없습니다. 글이 있는 공부 기록을 남기거나 검색어를 바꿔 주세요.</p>
            )}
            {selectable.slice(0, limit).map((r) => (
              <Checkbox
                key={r.id}
                label={`${data.nodes.find((n) => n.id === r.targetId)?.name ?? '공부 기록'} · ${r.body.slice(0, 70)}`}
                checked={chosen.includes(r.id)}
                onChange={(e) =>
                  setChosen((s) =>
                    e.target.checked ? [...s, r.id] : s.filter((id) => id !== r.id),
                  )
                }
              />
            ))}
            {selectable.length > limit && (
              <Button onClick={() => setLimit((n) => n + 40)}>기록 더 보기</Button>
            )}
            <Checkbox
              label="선택한 기록의 이전 수정본도 포함"
              checked={includeHistory}
              disabled={!selected.length}
              onChange={(e) => setIncludeHistory(e.target.checked)}
            />
            {exportText && (
              <section aria-label="공유 파일 미리보기">
                <pre className="brand-sharing-preview">{exportText}</pre>
              </section>
            )}
            <Button
              disabled={!selected.length}
              onClick={() => {
                downloadText('manseeksong-selected-thinking.txt', exportText);
                try {
                  trackExperience(data, 'share-download');
                } catch {
                  /* Optional count. */
                }
                setNotice(
                  '선택한 글의 파일 다운로드를 요청했습니다. 외부 공개나 게시를 하지 않았습니다.',
                );
              }}
            >
              선택한 글만 내려받기
            </Button>
            {notice && <p role="status">{notice}</p>}
          </Card>
          <Card>
            <h2>이어가기 사용을 직접 살펴보기</h2>
            <p>
              선택하면 이어가기·이전 생각 열기·다음 행동 남기기·선택한 글 내보내기의 시각과 횟수를
              이 기기에만 보관합니다. 글 내용과 대상 ID는 수집하지 않으며 외부 전송하지 않습니다.
              최근 500건을 유지합니다.
            </p>
            <Checkbox
              label="이 기기에서 사용 흐름 관찰"
              checked={experience.state.measurement.enabled}
              onChange={(e) =>
                experience.change((s) => ({
                  ...s,
                  measurement: {
                    ...s.measurement,
                    enabled: e.target.checked,
                    startedAt: e.target.checked
                      ? (s.measurement.startedAt ?? new Date().toISOString())
                      : s.measurement.startedAt,
                  },
                }))
              }
            />
            <p>
              관찰 시작:{' '}
              {experience.state.measurement.startedAt
                ? new Date(experience.state.measurement.startedAt).toLocaleDateString('ko-KR')
                : '아직 시작하지 않았습니다'}
            </p>
            {(['resume', 'reuse', 'next-step', 'share-download'] as const).map((action, i) => (
              <p key={action}>
                {['이어가기', '이전 생각 열기', '다음 행동 남기기', '선택한 글 내보내기'][i]}:{' '}
                {experience.state.measurement.events.filter((e) => e.action === action).length}회
              </p>
            ))}
            <p>
              이 수치는 공부 성공·이해·숙달·장기 충성도를 확인한 결과가 아닙니다. 2~4주 뒤 실제
              공부에 도움이 됐는지 기록과 함께 돌아보세요.
            </p>
            <div className="actions">
              <Button
                onClick={() =>
                  downloadText(
                    'manseeksong-use-observations.json',
                    JSON.stringify(experience.state.measurement, null, 2),
                    'application/json',
                  )
                }
              >
                관찰 기록 내려받기
              </Button>
              <Button
                onClick={() =>
                  experience.change((s) => ({
                    ...s,
                    measurement: { enabled: false, startedAt: null, events: [] },
                  }))
                }
              >
                관찰 중단하고 기록 지우기
              </Button>
            </div>
          </Card>
        </>
      )}
      {experience.error && <>
        <ErrorState message={experience.error} onRetry={experience.refresh} />
        <ExperienceRecoveryControl data={data} onRecovered={experience.refresh} />
      </>}
    </div>
  );
}
