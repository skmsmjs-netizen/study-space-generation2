import { occurrenceRows } from './list-keys';
import { useEffect, useRef, useState } from 'react';
import { canUseOwnerAI } from '../domain/ai-access';
import type { AppState, Command } from '../domain/model';
import {
  MAX_PHOTOS,
  MAX_PHOTO_ROWS,
  photoMaterial,
  previewPhotoOutline,
  validatePhotoResult,
  validatePhotoRows,
  type PhotoReference,
  type PhotoOutlineResult,
  type PhotoOutlineRow,
  type PhotoOutlineCommand,
} from '../domain/photo-outline';
import type { StudyRepository } from '../data/repository';
import { storagePrefix } from '../data/repository';
import { keepDocumentFile, readDocumentFile } from '../data/material-files';
import { generatePhotoOutline, preparePhoto } from '../data/photo-outline';
import { readRescuedDraft, storeDraftSafely } from '../data/draft-safety';
import { Button, Checkbox, ErrorState, Input, Modal, Select, Textarea } from './index';
import './photo-outline-import.css';
interface Draft {
  version: 1;
  photos: PhotoReference[];
  subjectId: string;
  parentId: string | null;
  title: string;
  original: PhotoOutlineResult | null;
  rows: PhotoOutlineRow[];
  excluded: string[];
  choices: Record<string, string>;
  pending?: PhotoOutlineCommand;
  requestStarted?: boolean;
  registered?: {
    materialId: string;
    revisionId: string;
    expectedVersion: number;
    undo?: Extract<Command, { type: 'undoRevision' }>;
    undone?: boolean;
  };
}
export const photoDraftKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `${storagePrefix(data)}:photo-outline-draft:v1`;
function readDraft(data: AppState): Draft | null {
  const raw = readRescuedDraft(photoDraftKey(data)) ?? localStorage.getItem(photoDraftKey(data));
  if (!raw) return null;
  const d = JSON.parse(raw) as Draft;
  if (
    !d ||
    d.version !== 1 ||
    !Array.isArray(d.photos) ||
    d.photos.length > MAX_PHOTOS ||
    !Array.isArray(d.rows) ||
    !Array.isArray(d.excluded) ||
    !d.choices ||
    typeof d.choices !== 'object' ||
    typeof d.subjectId !== 'string' ||
    typeof d.title !== 'string' ||
    d.title.length > 300 ||
    (d.parentId !== null && typeof d.parentId !== 'string') ||
    d.photos.some((p) => !p?.id || !p.file?.key || !/^[a-f0-9]{64}$/.test(p.file.sha256)) ||
    new Set(d.photos.map((p) => p.id)).size !== d.photos.length
  )
    throw Error('사진 초안의 형식을 확인하지 못했습니다. 기존 내용을 덮어쓰지 않았습니다.');
  if (d.original) validatePhotoResult(d.original);
  // An unfinished name or temporarily deep hierarchy remains editable after reopening.
  validatePhotoRows(
    d.rows.map((r) => ({
      ...r,
      name: typeof r.name === 'string' && !r.name.trim() ? '새 항목' : r.name,
      parentId: null,
    })),
    d.photos.map((p) => p.id),
  );
  const byId = new Map(d.rows.map((r) => [r.id, r]));
  for (const row of d.rows) {
    const seen = new Set([row.id]);
    let parent = row.parentId;
    while (parent !== null) {
      if (typeof parent !== 'string' || seen.has(parent) || !byId.has(parent))
        throw Error('사진 초안의 상위 항목을 확인하지 못했습니다. 기존 초안은 보관했습니다.');
      seen.add(parent);
      parent = byId.get(parent)!.parentId;
    }
  }

  if (
    d.pending &&
    (d.pending.type !== 'importPhotoOutline' ||
      d.pending.userId !== data.userId ||
      d.pending.namespace !== data.namespace)
  )
    throw Error('다른 공간의 사진 등록 요청을 적용하지 않았습니다.');
  if (
    d.registered?.undo &&
    (d.registered.undo.type !== 'undoRevision' ||
      d.registered.undo.userId !== data.userId ||
      d.registered.undo.namespace !== data.namespace)
  )
    throw Error('다른 공간의 되돌리기 요청을 적용하지 않았습니다.');
  return d;
}
export function PhotoOutlineImport({
  data,
  repository,
  onSaved,
  initialSubjectId,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  initialSubjectId?: string;
}) {
  const [boot] = useState(() => {
    try {
      return { draft: readDraft(data), error: '' };
    } catch (e) {
      return {
        draft: null,
        error: e instanceof Error ? e.message : '사진 초안을 읽지 못했습니다.',
      };
    }
  });
  const [draft, setDraft] = useState<Draft>(
    boot.draft ?? {
      version: 1,
      photos: [],
      subjectId: initialSubjectId ?? data.subjects.find((s) => !s.deletedAt)?.id ?? '',
      parentId: null,
      title: '사진에서 가져온 목차·내용',
      original: null,
      rows: [],
      excluded: [],
      choices: {},
    },
  );
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(boot.error),
    [message, setMessage] = useState(''),
    [urls, setURLs] = useState<Record<string, string>>({}),
    [ready, setReady] = useState(!boot.error);
  const current = useRef(draft);
  current.current = draft;
  const flight = useRef(false),
    cancel = useRef<AbortController | null>(null),
    alive = useRef(true),
    gallery = useRef<HTMLInputElement>(null),
    camera = useRef<HTMLInputElement>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      cancel.current?.abort();
    };
  }, []);
  useEffect(() => {
    let stopped = false;
    const allocated: string[] = [];
    if (open)
      void Promise.all(
        draft.photos.map(async (p) => {
          try {
            const b = await readDocumentFile(
              { userId: data.userId, namespace: data.namespace },
              p.file,
            );
            if (!b || stopped) return;
            const url = URL.createObjectURL(b);
            allocated.push(url);
            if (!stopped) setURLs((old) => ({ ...old, [p.id]: url }));
          } catch {
            /* Missing original is shown when generation is requested. */
          }
        }),
      );
    return () => {
      stopped = true;
      allocated.forEach(URL.revokeObjectURL);
      setURLs({});
    };
  }, [open, draft.photos, data.userId, data.namespace]);
  const persist = (next: Draft) => {
    current.current = next;
    setDraft(next);
    try {
      storeDraftSafely(photoDraftKey(data), JSON.stringify(next));
      setReady(true);
      return true;
    } catch {
      setReady(false);
      setError(
        '사진 초안을 이 기기에 저장하지 못했습니다. 입력은 이 창에 남아 있습니다. 초안 저장을 다시 시도해 주세요.',
      );
      return false;
    }
  };
  const edit = (action: (d: Draft) => void) => {
    if (flight.current || draft.pending || draft.registered || boot.error) return;
    const next = structuredClone(current.current);
    action(next);
    next.choices = {};
    setError('');
    setMessage('');
    persist(next);
  };
  async function bring(files: File[]) {
    if (flight.current || draft.pending || draft.registered || boot.error) return;
    flight.current = true;
    setBusy(true);
    setError('');
    try {
      for (const file of files) {
        if (!/\.(png|jpe?g|webp|heic|heif)$/i.test(file.name) && !file.type.startsWith('image/'))
          throw Error('사진 파일을 선택해 주세요.');
        const ref = await keepDocumentFile(data, file);
        if (!alive.current) return;
        const next = structuredClone(current.current);
        if (next.photos.some((p) => p.file.sha256 === ref.sha256)) {
          setMessage('같은 사진이 이미 있습니다. 기존 초안을 유지했습니다.');
          continue;
        }
        if (next.photos.length >= MAX_PHOTOS)
          throw Error(
            '사진은 한 번에4장까지 보관합니다. 현재 사진을 등록한 뒤 다음 묶음을 이어 넣어 주세요.',
          );
        if (next.original)
          throw Error('현재 초안의 사진은 보존했습니다. 새 사진은 새 사진 묶음으로 시작해 주세요.');
        next.photos.push({ id: crypto.randomUUID(), file: ref });
        if (!persist(next)) break;
      }
    } catch (e) {
      if (alive.current) setError(e instanceof Error ? e.message : '사진을 가져오지 못했습니다.');
    } finally {
      flight.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function generate() {
    if (
      flight.current ||
      !ready ||
      boot.error ||
      draft.pending ||
      draft.registered ||
      !draft.photos.length
    )
      return;
    if (draft.original) {
      setMessage('보관한 결과를 사용합니다. 수정과 등록은 GPT를 다시 호출하지 않습니다.');
      return;
    }
    flight.current = true;
    setBusy(true);
    setError('');
    setMessage('사진을 준비하고 있습니다.');
    const controller = new AbortController();
    cancel.current = controller;
    try {
      const photos = [];
      for (const p of current.current.photos)
        photos.push(await preparePhoto(data, p, controller.signal));
      if (!persist({ ...current.current, requestStarted: true })) return;
      setMessage('선택한 사진을 GPT에 보내 목차와 내용을 읽고 있습니다.');
      const result = await generatePhotoOutline(
        data,
        photos,
        AbortSignal.any([controller.signal, AbortSignal.timeout(180_000)]),
      );
      if (!alive.current) return;
      persist({
        ...current.current,
        original: result,
        rows: structuredClone(result.rows),
        title: result.title,
        requestStarted: false,
        excluded: [],
        choices: {},
      });
      setMessage(
        result.rows.length
          ? '목차 초안을 만들었습니다. 이름·위계·내용을 확인한 뒤 등록해 주세요.'
          : '사진에서 항목을 읽지 못했습니다. 안내를 확인한 뒤 새 사진 묶음으로 시작해 주세요.',
      );
    } catch (e) {
      if (alive.current) {
        setError(
          controller.signal.aborted
            ? '분석을 중단했습니다. 이미 보낸 요청은 비용이 들 수 있습니다. 원본과 기존 초안은 보관했습니다.'
            : e instanceof Error && /[가-힣]/.test(e.message)
              ? e.message
              : '사진 분석 응답을 받지 못했습니다. 원본은 보관했습니다. 다시 생성은 직접 선택해 주세요.',
        );
        setMessage('');
      }
    } finally {
      flight.current = false;
      cancel.current = null;
      if (alive.current) setBusy(false);
    }
  }
  const included = draft.rows.filter((r) => !draft.excluded.includes(r.id));
  let plan: ReturnType<typeof previewPhotoOutline> | null = null,
    planError = '';
  if (included.length && draft.subjectId)
    try {
      plan = previewPhotoOutline(data, draft.subjectId, draft.parentId, included, draft.choices);
    } catch (e) {
      planError = e instanceof Error ? e.message : '목차 위계를 확인해 주세요.';
    }
  const descendants = (id: string) => {
    const found = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const r of draft.rows)
        if (r.parentId && found.has(r.parentId) && !found.has(r.id)) {
          found.add(r.id);
          changed = true;
        }
    }
    return found;
  };
  const selected = (id: string) => !draft.excluded.includes(id);
  async function register() {
    if (
      flight.current ||
      !ready ||
      boot.error ||
      draft.registered ||
      !draft.original ||
      (!draft.pending && !plan?.ready)
    )
      return;
    const command = draft.pending ?? {
      type: 'importPhotoOutline' as const,
      userId: data.userId,
      namespace: data.namespace,
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
      subjectId: draft.subjectId,
      parentId: draft.parentId,
      rows: structuredClone(included),
      choices: structuredClone(draft.choices),
      ids: Object.fromEntries(
        plan!.entries.filter((p) => p.status === 'new').map((p) => [p.row.id, crypto.randomUUID()]),
      ),
      memoIds: Object.fromEntries(
        included.filter((r) => r.content.trim()).map((r) => [r.id, crypto.randomUUID()]),
      ),
      expectedToken: plan!.expectedToken,
      materialId: crypto.randomUUID(),
      content: photoMaterial(draft.subjectId, draft.title, draft.photos, draft.original, included),
    };
    if (!persist({ ...current.current, pending: command })) return;
    flight.current = true;
    setBusy(true);
    setError('');
    setMessage('목차와 내용을 서버에 저장하고 있습니다.');
    try {
      const next = repository.execute(command);
      onSaved(next);
      await repository.flush?.();
      const status = repository.getStatus?.();
      if (status && status.phase !== 'saved')
        throw Error(status.message || '서버 저장을 확인하지 못했습니다. 등록 요청은 보관했습니다.');
      if (!alive.current) return;
      const saved = repository.getSnapshot();
      onSaved(saved);
      const revision = saved.revisions.find((r) => r.operationId === command.opId);
      persist({
        ...current.current,
        pending: undefined,
        registered: {
          materialId: command.materialId,
          revisionId: revision!.id,
          expectedVersion: revision!.after.version,
        },
      });
      setMessage(
        '목차와 하위 내용, 원본 사진 자료를 저장했습니다. 같은 묶음은 다시 등록하지 않습니다.',
      );
    } catch (e) {
      if (alive.current)
        setError(
          e instanceof Error
            ? e.message
            : '등록을 확인하지 못했습니다. 사진과 등록 요청은 보관했습니다. GPT 호출 없이 등록을 다시 시도해 주세요.',
        );
    } finally {
      flight.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function undo() {
    const registered = current.current.registered;
    if (flight.current || !registered || registered.undone) return;
    const command = registered.undo ?? {
      type: 'undoRevision' as const,
      userId: data.userId,
      namespace: data.namespace,
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
      revisionId: registered.revisionId,
      expectedVersion: registered.expectedVersion,
    };
    if (!persist({ ...current.current, registered: { ...registered, undo: command } })) return;
    flight.current = true;
    setBusy(true);
    setError('');
    try {
      onSaved(repository.execute(command));
      await repository.flush?.();
      const status = repository.getStatus?.();
      if (status && status.phase !== 'saved')
        throw Error(
          status.message ||
            '되돌리기의 서버 저장을 확인하지 못했습니다. 요청과 원본은 보관했습니다.',
        );
      if (!alive.current) return;
      onSaved(repository.getSnapshot());
      persist({ ...current.current, registered: { ...registered, undo: command, undone: true } });
      setMessage('등록한 목차와 내용을 되돌렸습니다. 사진 자료와 원문은 이력에 보존합니다.');
    } catch (e) {
      if (alive.current)
        setError(e instanceof Error ? e.message : '뒤에 수정한 내용이 있어 되돌리지 못했습니다.');
    } finally {
      flight.current = false;
      if (alive.current) setBusy(false);
    }
  }
  if (!canUseOwnerAI(data)) return null;
  const locked = busy || !!draft.pending || !!draft.registered || !!boot.error;
  return (
    <>
      <Button disabled={busy} onClick={() => setOpen(true)}>
        사진으로 목차·내용 가져오기{draft.photos.length ? ' · 이어가기' : ''}
      </Button>
      {open && (
        <Modal
          open={open}
          title="사진으로 목차·내용 가져오기"
          onClose={() => {
            cancel.current?.abort();
            setOpen(false);
          }}
        >
          <div className="photo-outline-import" aria-busy={busy}>
            <p>
              사진을 GPT에 직접 보내 목차 위계와 하위 내용을 읽습니다. 사진에 없는 설명은 추가하지
              않습니다. 확인한 항목만 과목에 등록합니다.
            </p>
            {error && <ErrorState message={error} />} {message && <p role="status">{message}</p>}
            <div className="actions">
              <Button disabled={locked || !!draft.original} onClick={() => camera.current?.click()}>
                사진 찍기
              </Button>
              <Button
                disabled={locked || !!draft.original}
                onClick={() => gallery.current?.click()}
              >
                사진 선택
              </Button>
              {busy && cancel.current && (
                <Button onClick={() => cancel.current?.abort()}>분석 중단</Button>
              )}
              {!ready && <Button
                disabled={busy || !!boot.error}
                onClick={() => {
                  setError('');
                  persist(current.current);
                }}
              >
                초안 저장 다시 시도
              </Button>}
            </div>
            <input
              className="material-file-input"
              ref={camera}
              aria-label="목차 촬영 사진"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = '';
                void bring(files);
              }}
            />
            <input
              className="material-file-input"
              ref={gallery}
              aria-label="목차 사진 파일"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = '';
                void bring(files);
              }}
            />
            <div className="photo-outline-photos">
              {draft.photos.map((p, i) => (
                <figure key={p.id}>
                  {urls[p.id] && <img src={urls[p.id]} alt={`${i + 1}번째 원본 사진`} />}
                  <figcaption>
                    {i + 1}. {p.file.name}
                  </figcaption>
                  <div className="actions">
                    <Button
                      disabled={locked || !!draft.original || i === 0}
                      onClick={() =>
                        edit((d) => {
                          [d.photos[i - 1], d.photos[i]] = [d.photos[i], d.photos[i - 1]];
                        })
                      }
                    >
                      사진 앞으로
                    </Button>
                    <Button
                      disabled={locked || !!draft.original || i === draft.photos.length - 1}
                      onClick={() =>
                        edit((d) => {
                          [d.photos[i], d.photos[i + 1]] = [d.photos[i + 1], d.photos[i]];
                        })
                      }
                    >
                      사진 뒤로
                    </Button>
                    <Button
                      disabled={locked || !!draft.original}
                      onClick={() =>
                        edit((d) => {
                          d.photos = d.photos.filter((r) => r.id !== p.id);
                        })
                      }
                    >
                      사진 제외
                    </Button>
                  </div>
                </figure>
              ))}
            </div>
            <div className="photo-outline-target">
              <Select
                label="등록할 과목"
                value={draft.subjectId}
                disabled={locked}
                onChange={(e) =>
                  edit((d) => {
                    d.subjectId = e.target.value;
                    d.parentId = null;
                  })
                }
              >
                <option value="">과목 선택</option>
                {data.subjects
                  .filter((s) => !s.deletedAt)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </Select>
              <Select
                label="등록할 위치"
                value={draft.parentId ?? ''}
                disabled={locked}
                onChange={(e) =>
                  edit((d) => {
                    d.parentId = e.target.value || null;
                  })
                }
              >
                <option value="">과목의 최상위</option>
                {data.nodes
                  .filter((n) => n.subjectId === draft.subjectId && !n.deletedAt)
                  .map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name}
                    </option>
                  ))}
              </Select>
            </div>
            {!draft.original && (
              <>
                <p className="muted">
                  한 번에4장까지 보냅니다. 원본은 기기에 보관합니다. 분석만 API 비용이 들며
                  수정·등록·다시 열기는 재호출하지 않습니다.
                </p>
                {draft.requestStarted && !busy && (
                  <p>
                    이전 요청의 응답을 확인하지 못했습니다. 사용량을 확인한 뒤 다시 분석할지 선택해
                    주세요.
                  </p>
                )}
                <Button
                  variant="primary"
                  disabled={locked || !ready || !draft.photos.length}
                  onClick={() => void generate()}
                >
                  {draft.requestStarted ? '사진 분석 다시 요청' : 'GPT로 사진 목차·내용 만들기'}
                </Button>
              </>
            )}
            {draft.original && (
              <>
                {draft.original.warnings.length > 0 && (
                  <ul>
                    {occurrenceRows(draft.original.warnings, (value) => value).map(
                      ({ value: w, key }) => (
                        <li key={key}>{w}</li>
                      ),
                    )}
                  </ul>
                )}
                <Input
                  label="사진 자료 제목"
                  value={draft.title}
                  maxLength={300}
                  disabled={locked}
                  onChange={(e) =>
                    edit((d) => {
                      d.title = e.target.value;
                    })
                  }
                />

                {!data.subjects.some((s) => !s.deletedAt) && (
                  <p>
                    과목 목록에서 과목을 만든 뒤 이 초안을 다시 열어 등록해 주세요. 사진과 결과는
                    보관합니다.
                  </p>
                )}
                {plan && (
                  <section aria-label="목차 위계 미리보기">
                    <strong>목차 위계</strong>
                    <PhotoHierarchy rows={included} />
                  </section>
                )}
                <p>
                  {draft.rows.length}개 항목 중 {included.length}개 등록 · 상위 항목을 제외하면 하위
                  항목도 함께 제외합니다.
                </p>
                <div className="actions">
                  <Button
                    disabled={locked || draft.rows.length >= MAX_PHOTO_ROWS}
                    onClick={() =>
                      edit((d) => {
                        d.rows.push({
                          id: crypto.randomUUID(),
                          parentId: null,
                          name: '새 항목',
                          content: '',
                          page: '',
                          photoIds: d.photos.map((p) => p.id),
                          uncertain: true,
                        });
                      })
                    }
                  >
                    항목 추가
                  </Button>
                  <Button
                    disabled={
                      locked ||
                      draft.rows.length >= MAX_PHOTO_ROWS ||
                      !draft.title.trim() ||
                      draft.rows.some((r) => r.name === draft.title.trim())
                    }
                    onClick={() =>
                      edit((d) => {
                        const id = crypto.randomUUID();
                        for (const r of d.rows) if (r.parentId === null) r.parentId = id;
                        d.rows.unshift({
                          id,
                          parentId: null,
                          name: d.title.trim().slice(0, 180),
                          content: '',
                          page: '',
                          photoIds: d.photos.map((p) => p.id),
                          uncertain: true,
                        });
                      })
                    }
                  >
                    자료 제목을 상위 목차로 추가
                  </Button>
                </div>
                {draft.rows.map((r, i) => {
                  const p = plan?.entries.find((p) => p.row.id === r.id);
                  return (
                    <details key={r.id} className="photo-outline-row" open={i === 0}>
                      <summary>
                        {i + 1}. {r.name}
                        {r.uncertain ? ' · 확인 필요' : ''}
                        {!selected(r.id) ? ' · 제외' : ''}
                      </summary>
                      <Checkbox
                        label={`${i + 1}번 항목 등록`}
                        checked={selected(r.id)}
                        disabled={locked}
                        onChange={(e) =>
                          edit((d) => {
                            const ids = descendants(r.id);
                            if (!e.target.checked)
                              d.excluded = [...new Set([...d.excluded, ...ids])];
                            else {
                              const ancestors = new Set([r.id]);
                              let parent = r.parentId;
                              while (parent) {
                                ancestors.add(parent);
                                parent = d.rows.find((n) => n.id === parent)?.parentId ?? null;
                              }
                              d.excluded = d.excluded.filter((id) => !ancestors.has(id));
                            }
                          })
                        }
                      />
                      <Input
                        label={`${i + 1}번 항목 이름`}
                        value={r.name}
                        maxLength={180}
                        disabled={locked}
                        onChange={(e) =>
                          edit((d) => {
                            d.rows[i].name = e.target.value;
                          })
                        }
                      />
                      <Select
                        label={`${i + 1}번 상위 항목`}
                        value={r.parentId ?? ''}
                        disabled={locked}
                        onChange={(e) =>
                          edit((d) => {
                            d.rows[i].parentId = e.target.value || null;
                          })
                        }
                      >
                        <option value="">등록 위치 바로 아래</option>
                        {draft.rows
                          .filter((n) => !descendants(r.id).has(n.id))
                          .map((n) => (
                            <option key={n.id} value={n.id}>
                              {n.name}
                            </option>
                          ))}
                      </Select>
                      <Textarea
                        label={`${i + 1}번 하위 내용`}
                        value={r.content}
                        maxLength={12000}
                        disabled={locked}
                        onChange={(e) =>
                          edit((d) => {
                            d.rows[i].content = e.target.value;
                          })
                        }
                      />
                      <p className="muted">
                        근거 사진{' '}
                        {r.photoIds
                          .map((id) => draft.photos.findIndex((p) => p.id === id) + 1)
                          .join(', ')}
                        {r.page ? ` · ${r.page}` : ''}
                      </p>
                      <div className="actions">
                        <Button
                          disabled={locked || i === 0}
                          onClick={() =>
                            edit((d) => {
                              [d.rows[i - 1], d.rows[i]] = [d.rows[i], d.rows[i - 1]];
                            })
                          }
                        >
                          항목 앞으로
                        </Button>
                        <Button
                          disabled={locked || i === draft.rows.length - 1}
                          onClick={() =>
                            edit((d) => {
                              [d.rows[i], d.rows[i + 1]] = [d.rows[i + 1], d.rows[i]];
                            })
                          }
                        >
                          항목 뒤로
                        </Button>
                      </div>
                      {!draft.registered && p?.candidates.length ? (
                        <Select
                          label={`${i + 1}번 같은 이름 처리`}
                          disabled={locked}
                          value={draft.choices[r.id] ?? ''}
                          onChange={(e) => {
                            const next = structuredClone(current.current);
                            const related = descendants(r.id);
                            for (const id of related) delete next.choices[id];
                            next.choices[r.id] = e.target.value;
                            persist(next);
                          }}
                        >
                          <option value="">기존 항목 연결 또는 새로 추가 선택</option>
                          <option value="new">새 항목으로 추가</option>
                          {p.candidates.map((c) => (
                            <option key={c.id} value={c.id}>
                              기존 {c.name}에 연결
                            </option>
                          ))}
                        </Select>
                      ) : null}
                    </details>
                  );
                })}
                <details>
                  <summary>GPT가 처음 만든 초안 보기</summary>
                  <pre className="photo-outline-original">
                    {JSON.stringify(draft.original, null, 2)}
                  </pre>
                </details>
                {planError && <ErrorState message={planError} />}
                {!draft.registered && (
                  <Button
                    variant="primary"
                    disabled={
                      busy ||
                      !ready ||
                      !!boot.error ||
                      !draft.title.trim() ||
                      (!draft.pending && !plan?.ready)
                    }
                    onClick={() => void register()}
                  >
                    {draft.pending ? '등록 저장 다시 시도' : '확인한 목차·내용 등록'}
                  </Button>
                )}
                {draft.pending && !data.appliedOps[draft.pending.opId] && (
                  <Button
                    disabled={busy}
                    onClick={() => {
                      persist({ ...current.current, pending: undefined });
                      setMessage('등록 요청을 해제했습니다. 현재 목차와 다시 대조해 주세요.');
                    }}
                  >
                    등록 요청 해제·다시 확인
                  </Button>
                )}
                {draft.registered && (
                  <>
                    <a
                      href={
                        draft.registered.undone
                          ? '#/materials/trash'
                          : `#/materials/${draft.registered.materialId}`
                      }
                    >
                      {draft.registered.undone ? '보관한 사진 자료 열기' : '저장한 사진 자료 열기'}
                    </a>
                    <Button
                      disabled={busy || !!draft.registered.undone}
                      onClick={() => void undo()}
                    >
                      {draft.registered.undone
                        ? '이번 등록을 되돌렸습니다'
                        : draft.registered.undo
                          ? '되돌리기 저장 다시 시도'
                          : '이번 등록 되돌리기'}
                    </Button>
                  </>
                )}
                <Button
                  disabled={
                    busy ||
                    !!draft.pending ||
                    (!!draft.registered?.undo && !draft.registered.undone) ||
                    !ready
                  }
                  onClick={() => {
                    try {
                      storeDraftSafely(
                        `${photoDraftKey(data)}:history:${draft.original!.id}`,
                        JSON.stringify(draft),
                      );
                      persist({
                        version: 1,
                        photos: [],
                        subjectId: draft.subjectId,
                        parentId: null,
                        title: '사진에서 가져온 목차·내용',
                        original: null,
                        rows: [],
                        excluded: [],
                        choices: {},
                      });
                      setMessage('기존 사진 묶음을 보관했습니다. 새 사진을 선택해 주세요.');
                    } catch {
                      setError('이전 초안을 보관하지 못해 새 묶음을 시작하지 않았습니다.');
                    }
                  }}
                >
                  새 사진 묶음
                </Button>
              </>
            )}
            {draft.rows.length >= MAX_PHOTO_ROWS && (
              <p>
                100개 항목을 확인했습니다. 사진에 더 많은 항목이 있으면 다음 묶음으로 이어 넣어
                주세요.
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

function PhotoHierarchy({
  rows,
  parentId = null,
}: {
  rows: PhotoOutlineRow[];
  parentId?: string | null;
}) {
  const children = rows.filter((r) => r.parentId === parentId);
  return children.length ? (
    <ul className="photo-outline-hierarchy">
      {children.map((r) => (
        <li key={r.id}>
          {r.name}
          {r.uncertain ? ' · 확인 필요' : ''}
          <PhotoHierarchy rows={rows} parentId={r.id} />
        </li>
      ))}
    </ul>
  ) : null;
}
