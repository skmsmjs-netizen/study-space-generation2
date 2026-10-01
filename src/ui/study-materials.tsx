import { canonicalStudyTask, planMaterialRanges, SOURCE_ROLE_LABELS, sourceRole, type MaterialView } from '../domain/study-gpt-contract';
import { UseMaterialCard } from './learning-links';
import {
  STUDY_AI_TASKS,
  type StudyAIRequest,
  type StudyAITask,
  validateStudyAIRequest,
  activeStudyAIRequest,
} from '../domain/study-ai-request';
import { StudyResultText } from './study-result-text';
import { canUseOwnerAI } from '../domain/ai-access';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Checkbox, EmptyState, ErrorState, Input, Select, Textarea } from './index';
import type { AppState } from '../domain/model';
import {
  materialContent,
  MAX_SOURCE_TEXT,
  type MaterialContent,
  type StudyMaterial,
} from '../domain/study-material';
import type { StudyRepository } from '../data/repository';
import { generateStudyMaterial } from '../data/study-ai';
import { GPTConnectionPanel } from './gpt-connection-panel';
import { MaterialSources } from './material-sources';
import { MaterialQuiz } from './material-quiz';
import { MaterialTutor } from './material-tutor';
import { addMaterialMapToCanvas } from '../data/material-map-canvas';
import { documentSegments, materialSourceIdentity } from '../domain/material-source';
import { uploadMaterialFile } from '../data/material-cloud';
import { StudyAIContextPicker } from './study-ai-context-picker';
import {
  clearMaterialDraft,
  type MaterialDraft,
  readAudio,
  readDocumentFile,
  readMaterialDraft,
  recoverRecording,
  writeMaterialDraft,
} from '../data/material-files';
import { navigate } from './navigation-context';
import { isViewPage, isViewText, useViewContext } from './use-view-context';
import './study-materials.css';
const MaterialMap = lazy(() => import('./material-map').then(module => ({ default: module.MaterialMap })));

type Props = {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  materialId?: string;
  initialSubjectId?: string;
  trash?: boolean;
  subjectIds?: string[];
};
const message = (error: unknown) =>
  error instanceof Error ? error.message : '내용은 유지했습니다. 다시 시도해 주세요.';
const context = (data: AppState) => ({
  userId: data.userId,
  namespace: data.namespace,
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
});
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function StudyMaterials(props: Props) {
  const { data, repository, onSaved, materialId, initialSubjectId, trash = false } = props;
  const aiAllowed = canUseOwnerAI(data);
  const [error, setError] = useState('');
  const [query, setQuery] = useViewContext(data, `materials:${trash ? 'trash' : 'active'}:query`, '', isViewText);
  const [limit, setLimit] = useViewContext(data, `materials:${trash ? 'trash' : 'active'}:limit`, 40, isViewPage);
  const items = (data.studyMaterials ?? [])
    .filter((row) => Boolean(row.deletedAt) === trash)
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const selected = items.find((row) => row.id === materialId);
  const scoped = items.filter(row => props.subjectIds === undefined || props.subjectIds.includes(row.subjectId));
  const visible = scoped.filter(row => `${row.title}\n${row.sourceText}\n${data.subjects.find(subject => subject.id === row.subjectId)?.name ?? ''}`.normalize('NFC').toLocaleLowerCase('ko-KR').includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')));
  function restore(row: StudyMaterial) {
    try {
      const next = repository.execute({
        type: 'restoreStudyMaterial',
        id: row.id,
        expectedVersion: row.version,
        ...context(data),
      });
      onSaved(next);
    } catch (error) {
      setError(message(error));
    }
  }
  if (!trash && (materialId === 'new' || selected))
    return (
      <MaterialEditor
        key={`${data.namespace}:${data.userId}:${materialId}`}
        {...props}
        selected={selected}
        initialSubjectId={initialSubjectId}
      />
    );
  return (
    <section className="study-materials">
      {error && <ErrorState message={error} />}
      <div className="material-toolbar">
        <p>
          {aiAllowed
            ? '문서·사진·자막·전사문에서 원문을 모으고, 요약·카드·퀴즈로 공부하세요.'
            : '강의 자료의 원문과 파일을 과목별로 보관하세요.'}
        </p>
        {!trash && (
          <Button variant="primary" onClick={() => navigate('/materials/new')}>
            자료 추가
          </Button>
        )}
      </div>
      {!trash && materialId && materialId !== 'new' && !selected && <EmptyState title="이 강의 자료를 찾을 수 없습니다" message="휴지통에 있는지 확인하거나 자료 목록에서 다시 골라 주세요."><a href="#/materials">자료 목록으로</a><a href="#/materials/trash">강의 자료 휴지통</a></EmptyState>}
      <Input label="강의 자료 찾기" value={query} placeholder="제목·강의 원문·과목 이름" onChange={event => {setQuery(event.target.value);setLimit(40);}} />
      {scoped.length > 0 && !visible.length && <EmptyState title="찾는 강의 자료가 없습니다" message="검색어를 줄이거나 지워 보세요."><Button onClick={() => {setQuery('');setLimit(40);}}>강의 자료 검색어 지우기</Button></EmptyState>}
      {!scoped.length && (
        <EmptyState
          title={items.length ? '이 공부 범위에는 강의 자료가 없습니다' : trash ? '보관된 강의 자료가 없습니다' : '강의 자료를 모아 두세요'}
          message={
            items.length ? '공부 범위를 바꾸면 다른 과목에 저장한 자료를 확인할 수 있습니다.' : trash
              ? '원본은 직접 삭제하기 전까지 보존됩니다.'
              : aiAllowed
                ? '문서·사진·자막·전사문 파일을 가져오거나 강의 내용을 붙여 넣어 시작할 수 있습니다.'
                : '전사문이나 강의 필기를 과목과 함께 저장할 수 있습니다.'
          }
        />
      )}
      <div className="material-list">
        {visible.slice(0, Math.max(40,limit)).map((row) => (
          <article key={row.id}>
            <h2>
              {trash ? (
                row.title
              ) : (
                <a href={`#/materials/${encodeURIComponent(row.id)}`}>{row.title}</a>
              )}
            </h2>
            <p>
              {data.subjects.find((subject) => subject.id === row.subjectId)?.name} ·{' '}
              {row.audio ? row.audio.name : row.documents?.[0]?.name ?? '강의 필기'} ·{' '}
              {row.results.at(-1)?.cards.filter((card) => !card.excluded).length ?? 0}개 카드
            </p>
            {trash && <Button onClick={() => restore(row)}>복원</Button>}
          </article>
        ))}
      </div>
      {visible.length > Math.max(40,limit) && <Button onClick={() => setLimit(value => Math.max(40,value)+40)}>강의 자료 더 보기</Button>}
      {!trash && <a href="#/materials/trash">강의 자료 휴지통</a>}
    </section>
  );
}

function MaterialEditor({
  data,
  repository,
  onSaved,
  selected,
  initialSubjectId,
}: Props & { selected?: StudyMaterial }) {
  const aiAllowed = canUseOwnerAI(data);
  const owner = useMemo(
    () => ({ userId: data.userId, namespace: data.namespace }),
    [data.userId, data.namespace],
  );
  const initialVersion = useRef(selected?.version ?? 0);
  const draftId = selected?.id ?? 'new';
  const [content, setContent] = useState<MaterialContent>(() =>
    selected
      ? materialContent(selected)
      : {
          title: '',
          subjectId: initialSubjectId ?? data.subjects.find((row) => !row.deletedAt)?.id ?? '',
          topicId: null,
          sourceText: '',
          audio: null,
          results: [],
          aiRequest: { task: 'study-pack' },
        },
  );
  const current = useRef(content),
    baseVersion = useRef(selected?.version ?? 0),
    mounted = useRef(true),
    loaded = useRef(false),
    recordingId = useRef<string | undefined>(undefined);
  const draftFlight = useRef<Promise<unknown>>(Promise.resolve());
  const audioCleanup = useRef<MaterialDraft['audioCleanup']>(undefined);
  const audioRecordingId = useRef<string | undefined>(undefined);
  const generationController = useRef<AbortController | null>(null);
  const [ready, setReady] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [importing, setImporting] = useState(false);
  const count = content.aiRequest?.requestedCardCount ?? 5;
  const [audioURL, setAudioURL] = useState(''),
    [missingAudio, setMissingAudio] = useState(false),
    audioElement = useRef<HTMLAudioElement>(null);
  const [captionURL, setCaptionURL] = useState('');
  const [tab, setTab] = useState<'summary' | 'transcript' | 'cards' | 'quiz' | 'map'>(content.learningView?.tab ?? 'summary'),
    [resultIndex, setResultIndex] = useState(() => { const index = content.results.findIndex(r => r.id === content.learningView?.resultId); return index >= 0 ? index : Math.max(0, content.results.length - 1); }),
    [cardIndex, setCardIndex] = useState(() => Math.max(0, content.results.find(r => r.id === content.learningView?.resultId)?.cards.filter(c => !c.excluded).findIndex(c => c.id === content.learningView?.cardId) ?? 0)),
    [answer, setAnswer] = useState(content.learningView?.activeDisclosure === 'revealed' ? `${content.learningView.resultId}:${content.learningView.cardId}` : ''),
    [editingCard, setEditingCard] = useState('');
  const [editingResult, setEditingResult] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const generationFlight = useRef(false);
  const savingFlight = useRef(false);
  const stableMaterialId = useRef(selected?.id ?? crypto.randomUUID());
  const [saving, setSaving] = useState(false);
  const task = canonicalStudyTask(content.aiRequest?.task ?? 'summary');
  function requestPatch(patch: Partial<StudyAIRequest>) {
    retain({ ...current.current, aiRequest: { task, ...current.current.aiRequest, ...patch } });
  }
  const [keyPanel, setKeyPanel] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const result = content.results[resultIndex],
    cards = result?.cards.filter((card) => !card.excluded) ?? [],
    card = cards[cardIndex];
  const cardKey = result && card ? `${result.id}:${card.id}` : '';
  const viewState = useRef<MaterialView>(content.learningView ?? { tab: 'summary', revealed: [], helped: [] });
  const draftRevision = useRef(0);
  const [draftState, setDraftState] = useState<'saved' | 'pending' | 'failed'>('saved');
  const ranges = useMemo(() => { try { return planMaterialRanges({ ...content, audio: null }, activeStudyAIRequest(content.aiRequest)); } catch { return null; } }, [content.sourceText, content.documents, content.aiRequest, content.audio, content.results]);
  const rangeIndex = ranges && content.generationProgress?.sourceIdentity === ranges.sourceIdentity ? content.generationProgress.index : 0;
  function revealCard() {
    if (!cardKey) return;
    setAnswer(cardKey);
    viewState.current = { ...viewState.current, revealed: [...new Set([...viewState.current.revealed, cardKey])], activeDisclosure: 'revealed' };
    retain(current.current);
  }
  function recordHelp() {
    if (!result) return;
    viewState.current = { ...viewState.current, helped: [...new Set([...viewState.current.helped, result.id])] };
    const attempts = current.current.quizAttempts;
    retain({ ...current.current, ...(attempts ? { quizAttempts: attempts.map(a => a.resultId === result.id && !a.submittedAt ? { ...a, helpedQuestionIds: a.questions.map(q => q.id) } : a) } : {}) });
  }
  function chooseTab(next: typeof tab) {
    if (next !== 'quiz') recordHelp();
    setTab(next);
  }
  useEffect(() => {
    if (!ready) return;
    if ((tab === 'quiz' && !result?.quiz) || (tab === 'map' && !result?.map)) {
      setTab('summary');
      return;
    }
    setEditingCard('');
    setSourceOpen(false);
    viewState.current = { ...viewState.current, resultId: result?.id, cardId: card?.id, tab, activeDisclosure: answer === cardKey && cardKey ? 'revealed' : 'hidden' };
    retain(current.current);
  }, [ready, result?.id, card?.id, tab]);
  const capable =
    data.namespace === 'demo' || repository.getCapabilities?.().includes('saveStudyMaterial');
  function retain(next: MaterialContent) {
    next = { ...next, learningView: structuredClone(viewState.current) };
    current.current = next;
    setContent(next);
    if (!loaded.current) return;
    const envelope = {
      materialId: stableMaterialId.current,
      content: next,
      view: structuredClone(viewState.current),
      baseVersion: baseVersion.current,
      recordingId: recordingId.current,
      audioRecordingId: audioRecordingId.current,
      audioCleanup: audioCleanup.current,
      updatedAt: new Date().toISOString(),
    };
    const revision = ++draftRevision.current;
    setDraftState('pending');
    draftFlight.current = draftFlight.current
      .catch(() => undefined)
      .then(() => writeMaterialDraft(data, draftId, envelope))
      .then(() => { if (mounted.current && revision === draftRevision.current) setDraftState('saved'); });
    void draftFlight.current.catch((error) => {
      if (mounted.current && revision === draftRevision.current) { setDraftState('failed'); setError(message(error)); }
    });
  }
  useEffect(() => {
    mounted.current = true;
    void readMaterialDraft(owner, draftId)
      .then((draft) => {
        if (!mounted.current) return;
        if (draft) {
          if (
            !draft.content ||
            !Array.isArray(draft.content.results) ||
            !Number.isSafeInteger(draft.baseVersion)
          )
            throw Error('보관된 자료 초안을 읽지 못했습니다. 원본은 덮어쓰지 않았습니다.');
          baseVersion.current = draft.baseVersion;
          if (!selected && typeof draft.materialId === 'string' && draft.materialId)
            stableMaterialId.current = draft.materialId;
          recordingId.current = draft.recordingId ?? draft.audioCleanup?.recordingId;
          audioRecordingId.current = draft.audioRecordingId;
          audioCleanup.current = draft.audioCleanup;
          // Old cleanup drafts may hold the only reference to an existing recording.
          // Transcript entry keeps that original; it does not repeat or delete prior work.
          const restoredContent = draft.audioCleanup && !draft.content.audio
            ? { ...draft.content, audio: draft.audioCleanup.audio }
            : draft.content;
          current.current = restoredContent;
          setContent(restoredContent);
          const savedView = draft.view ?? draft.content.learningView;
          const at = savedView?.resultId ? draft.content.results.findIndex(r => r.id === savedView.resultId) : -1;
          const selectedResult = draft.content.results[at >= 0 ? at : draft.content.results.length - 1];
          const selectedCards = selectedResult?.cards.filter(c => !c.excluded) ?? [];
          const cardAt = selectedCards.findIndex(c => c.id === savedView?.cardId);
          setResultIndex(at >= 0 ? at : Math.max(0, draft.content.results.length - 1));
          setCardIndex(Math.max(0, cardAt));
          if (savedView && Array.isArray(savedView.revealed) && Array.isArray(savedView.helped)) {
            viewState.current = savedView;
            if (['summary','transcript','cards','quiz','map'].includes(savedView.tab)) setTab(savedView.tab);
            if (at >= 0 && cardAt >= 0 && savedView.activeDisclosure === 'revealed') setAnswer(`${selectedResult.id}:${selectedCards[cardAt].id}`);
          }
          const savedDraftVersion = selected
            ? initialVersion.current
            : (repository
                .getSnapshot()
                .studyMaterials?.find((row) => row.id === stableMaterialId.current)?.version ?? 0);
          if (draft.baseVersion !== savedDraftVersion)
            setError(
              '다른 곳에서 저장한 자료와 이 초안을 모두 보존했습니다. 초안을 내보낸 뒤 최신 자료를 다시 열어 주세요.',
            );
          else setNotice('이 기기에 남겨 둔 초안을 불러왔습니다.');
          setRecovery(Boolean(draft.recordingId));
        }
        loaded.current = true;
        setReady(true);
      })
      .catch((error) => {
        if (mounted.current) setError(message(error));
      });
    return () => {
      mounted.current = false;
      generationController.current?.abort();
    };
  }, [owner, draftId, aiAllowed]);
  const audioFile = content.audio;
  useEffect(() => {
    let disposed = false,
      url = '';
    setAudioURL('');
    setMissingAudio(false);
    if (audioFile)
      void readAudio(owner, audioFile)
        .then((blob) => {
          if (disposed) return;
          if (!blob) {
            setMissingAudio(true);
            return;
          }
          url = URL.createObjectURL(blob);
          setAudioURL(url);
        })
        .catch((error) => {
          if (!disposed) setError(message(error));
        });
    return () => {
      disposed = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioFile, owner]);
  useEffect(() => {
    const timed =
      result?.segments.filter((segment) => segment.start !== null && segment.end !== null) ?? [];
    if (!timed.length || (result?.source && result.source.audio?.sha256 !== audioFile?.sha256)) {
      setCaptionURL('');
      return;
    }
    const timestamp = (seconds: number) => new Date(seconds * 1000).toISOString().slice(11, 23);
    const vtt = `WEBVTT\n\n${timed.map((segment) => `${timestamp(segment.start ?? 0)} --> ${timestamp(segment.end ?? 0)}\n${segment.text}`).join('\n\n')}\n`;
    const url = URL.createObjectURL(new Blob([vtt], { type: 'text/vtt' }));
    setCaptionURL(url);
    return () => URL.revokeObjectURL(url);
  }, [result, audioFile?.sha256]);
  useEffect(() => {
    const before = (event: BeforeUnloadEvent) => {
      if (busy || importing || draftState !== 'saved') {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    const leave = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      const href = link?.getAttribute('href');
      if (!href?.startsWith('#/') || draftState === 'saved') return;
      if (draftState === 'failed') {
        if (!window.confirm('이 기기에 저장되지 않은 변경이 있습니다. 내보내기나 초안 저장 재시도 후 나갈 수 있습니다. 지금 나가시겠습니까?')) { event.preventDefault(); event.stopPropagation(); }
      } else {
        event.preventDefault(); event.stopPropagation();
        void draftFlight.current.then(() => { location.hash = href; }).catch(() => undefined);
      }
    };
    window.addEventListener('click', leave, true);
    window.addEventListener('beforeunload', before);
    return () => { window.removeEventListener('click', leave, true); window.removeEventListener('beforeunload', before); };
  }, [busy, importing, draftState]);
  async function analyze(source = current.current) {
    if (!aiAllowed || generationFlight.current || busy || importing) return;
    if (source.results.length >= 30) {
      setError(
        '이 자료의 생성 결과 30개를 모두 보관했습니다. 내보내거나 새 자료에 필요한 원문을 넣어 이어가 주세요.',
      );
      return;
    }
    generationFlight.current = true;
    const controller = new AbortController();
    generationController.current = controller;
    setBusy(true);
    setError('');
    setNotice('원본을 보관하고 요청한 결과를 만들고 있습니다.');
    try {
      if (!source.subjectId) throw Error('자료를 모아 둘 과목을 먼저 골라 주세요.');
      if (source.aiRequest) validateStudyAIRequest(activeStudyAIRequest(source.aiRequest));
      await draftFlight.current;
      controller.signal.throwIfAborted();
      const generated = await generateStudyMaterial(data, source, count, controller.signal);
      controller.signal.throwIfAborted();
      if (!mounted.current) {
        const latest = await readMaterialDraft(data, draftId);
        await writeMaterialDraft(data, draftId, {
          materialId: stableMaterialId.current,
          content: {
            ...(latest?.content ?? source),
            results: [...(latest?.content.results ?? source.results), generated],
          },
          baseVersion: latest?.baseVersion ?? baseVersion.current,
          updatedAt: new Date().toISOString(),
        });
        return;
      }
      // Source editing is disabled during generation. Existing results remain in order.
      if (result?.quiz && current.current.quizAttempts?.some(a => a.resultId === result.id && !a.submittedAt)) recordHelp();
      const next = { ...current.current, results: [...current.current.results, generated],
        ...(generated.range ? { generationProgress: { sourceIdentity: generated.range.sourceIdentity, index: generated.range.index, completed: [...(current.current.generationProgress?.sourceIdentity === generated.range.sourceIdentity ? current.current.generationProgress.completed : []), ...(!generated.diagnostics?.length ? [{ index: generated.range.index, resultId: generated.id }] : [])] } } : {}) };
      setEditingCard('');
      retain(next);
      setResultIndex(next.results.length - 1);
      setCardIndex(0);
      setAnswer('');
      setEditingResult(false);
      setTab(generated.request?.task === 'study-pack' ? 'summary' : generated.quiz ? 'quiz' : generated.map ? 'map' : 'summary');
      await draftFlight.current;
      setNotice('결과를 만들었습니다. 근거를 확인하고 자료 저장을 눌러 주세요.');
    } catch (error) {
      if (mounted.current) {
        if (controller.signal.aborted) {
          setError('');
          setNotice(
            '정리를 중단했습니다. 원본과 기존 결과는 보관했습니다. 이미 처리된 사용량은 반환되지 않을 수 있습니다.',
          );
        } else {
          setError(message(error));
          setNotice('');
        }
      }
    } finally {
      generationFlight.current = false;
      if (generationController.current === controller) generationController.current = null;
      if (mounted.current) setBusy(false);
    }
  }
  async function recover() {
    try {
      if (!recordingId.current) return;
      const blob = await recoverRecording(data, recordingId.current);
      if (!blob) throw Error('이 기기에 이전 녹음 구간이 없습니다. 원본을 보관한 기기에서 확인해 주세요.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `이전 녹음.${blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm'}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (cause) { setError(message(cause)); }
  }
  async function save() {
    if (savingFlight.current) return false;
    savingFlight.current = true;
    setSaving(true);
    try {
      setError('');
      if (!capable)
        throw Error(
          '자료를 서버에 저장할 연결이 아직 없습니다. 초안과 원본은 이 기기에 보관했습니다.',
        );
      await draftFlight.current;
      if (data.namespace === 'personal' && current.current.originalStorage === 'private-server') {
        for (const doc of current.current.documents ?? []) {
          if (!doc.file || doc.file.cloudPath) continue;
          setNotice(`${doc.name} 원본을 비공개로 서버에 보관하고 있습니다.`);
          const blob = await readDocumentFile(owner, doc.file);
          if (!blob) throw Error(`${doc.name} 원본이 이 기기에 없습니다. 같은 파일을 다시 가져와 주세요.`);
          const file = await uploadMaterialFile(owner, 'document', doc.file, blob);
          retain({ ...current.current, documents: current.current.documents?.map(row => row.id === doc.id ? { ...row, file } : row) }); await draftFlight.current;
        }
      }
      const id = stableMaterialId.current;
      const previous = repository.getSnapshot();
      const existing = previous.studyMaterials?.find((row) => row.id === id);
      const saveContent = current.current;
      const unchanged =
        existing?.version === baseVersion.current &&
        JSON.stringify(materialContent(existing)) === JSON.stringify(saveContent);
      const next = unchanged
        ? previous
        : repository.execute({
            type: 'saveStudyMaterial',
            id,
            expectedVersion: baseVersion.current,
            content: saveContent,
            ...context(data),
          });
      const saved = next.studyMaterials?.find((row) => row.id === id);
      if (!saved) throw Error('저장한 자료를 확인하지 못했습니다. 초안은 유지했습니다.');
      onSaved(next);
      baseVersion.current = saved.version;
      retain(current.current);
      await draftFlight.current;
      // Keep the exact draft until server acknowledgement; retry saving never generates again.
      await repository.flush?.();
      const status = repository.getStatus?.();
      if (data.namespace !== 'demo' && status && (status.phase !== 'saved' || status.pending))
        throw Error(status.message || '서버 저장을 확인하지 못했습니다. 초안은 유지했습니다.');
      // Preserve the only reference to old interrupted recording chunks for download recovery.
      if (recordingId.current) {
        const legacyDraft = await readMaterialDraft(owner, draftId);
        if (legacyDraft) await writeMaterialDraft(owner, id, legacyDraft);
        if (draftId !== id) await clearMaterialDraft(data, draftId);
      } else await clearMaterialDraft(data, draftId);
      setNotice(
        data.namespace === 'demo'
          ? '자료를 이 기기에 저장했습니다.'
          : status
            ? '자료를 서버에 저장했습니다.'
            : '자료를 기기에 저장했습니다. 서버 저장은 별도로 확인해 주세요.',
      );
      if (!selected) navigate(`/materials/${id}`);
      return true;
    } catch (error) {
      setError(message(error));
      return false;
    } finally {
      savingFlight.current = false;
      if (mounted.current) setSaving(false);
    }
  }
  function evidence(ids: string[]) {
    return (
      <div className="material-evidence">
        {ids.map((id) => {
          const segment = result?.segments.find((row) => row.id === id);
          return (
            <Button
              key={id}
              variant="quiet"
              onClick={() => {
                chooseTab('transcript');
                if (
                  segment?.start !== null &&
                  segment?.start !== undefined &&
                  !segment.label &&
                  (!result?.source || result.source.audio?.sha256 === content.audio?.sha256) &&
                  audioElement.current
                ) {
                  audioElement.current.currentTime = segment.start;
                  void audioElement.current.play().catch(() => undefined);
                }
                setTimeout(
                  () =>
                    document
                      .getElementById(`material-segment-${id}`)
                      ?.scrollIntoView({ block: 'nearest' }),
                  0,
                );
              }}
            >
              {sourceRole(segment ?? { id, text: '', start: null, end: null }) !== 'material' ? SOURCE_ROLE_LABELS[sourceRole(segment!)] : segment?.label ? `${segment.label} 원문` : segment?.start != null ? `${clock(segment.start)} 원문` : `${id} 원문`}
            </Button>
          );
        })}
      </div>
    );
  }
  function updateCard(patch: Partial<typeof card>) {
    if (!result || !card) return;
    retain({
      ...content,
      results: content.results.map((row) =>
        row.id === result.id
          ? {
              ...row,
              cards: row.cards.map((item) =>
                item.id === card.id
                  ? {
                      ...item,
                      ...patch,
                      originalQuestion: item.originalQuestion ?? item.question,
                      originalAnswer: item.originalAnswer ?? item.answer,
                    }
                  : item,
              ),
            }
          : row,
      ),
    });
  }
  function exportDraft() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `${content.title || '강의 자료'}-원문과카드.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className="study-materials material-editor" aria-busy={busy}>
      <div className="material-toolbar">
        <a href="#/materials">← 강의 자료</a>
        <div>
          <Button variant="quiet" onClick={exportDraft}>
            내보내기
          </Button>
          {aiAllowed && (
            <Button variant="quiet" onClick={() => setKeyPanel(!keyPanel)}>
              GPT 연결
            </Button>
          )}
        </div>
      </div>
      {aiAllowed && keyPanel && (
        <GPTConnectionPanel
          userId={owner.userId}
          namespace={owner.namespace}
          busy={busy}
        />
      )}
      {error && <ErrorState message={error} />}
      {draftState !== 'saved' && <p role="status">{draftState === 'pending' ? '이 기기에 초안을 보관하고 있습니다.' : '현재 화면의 변경이 기기에 저장되지 않았습니다. 초안 저장을 재시도하거나 내보내기로 보관해 주세요.'}</p>}
      {draftState === 'failed' && <Button onClick={() => { setError(''); retain(current.current); }}>초안 저장 재시도</Button>}
      {busy && <Button onClick={() => generationController.current?.abort()}>정리 중단</Button>}
      {notice && (
        <p role="status" className="material-status">
          {notice}
        </p>
      )}
      {!ready && !error && <p>보관한 자료를 불러오고 있습니다.</p>}
      <details className="material-source-region" open={tab !== 'quiz' || !result?.quiz || sourceOpen} onToggle={event => { if (tab === 'quiz' && result?.quiz) { const opened = event.currentTarget.open; setSourceOpen(opened); if (opened) recordHelp(); } }}>
      <summary>{tab === 'quiz' && result?.quiz ? '원문·자료 열기 · 퀴즈 도움으로 보관' : '자료와 원문'}</summary>
      <fieldset
        disabled={!ready || busy || saving || importing}
        className="material-fields"
      >
        <Input
          label="자료 제목"
          value={content.title}
          onChange={(event) => retain({ ...content, title: event.target.value })}
          maxLength={300}
          placeholder="예: 회로이론 3주차 강의"
        />
        <div className="material-target">
          <Select
            label="과목"
            value={content.subjectId}
            onChange={(event) =>
              retain({ ...content, subjectId: event.target.value, topicId: null })
            }
          >
            <option value="">과목 선택</option>
            {data.subjects
              .filter((row) => !row.deletedAt)
              .map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
          </Select>
          <Select
            label="연결할 주제 · 선택"
            value={content.topicId ?? ''}
            onChange={(event) => retain({ ...content, topicId: event.target.value || null })}
          >
            <option value="">과목에 보관</option>
            {data.nodes
              .filter((row) => row.subjectId === content.subjectId && !row.deletedAt)
              .map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
          </Select>
        </div>
        <p className="material-hint"><a href="https://clovanote.naver.com/" target="_blank" rel="noreferrer">클로바노트 열기</a>에서 녹음·전사한 뒤, 음성 기록을 복사하거나 내려받은 전사문 파일을 아래에서 가져와 주세요.</p>
        <Textarea
          label="강의 내용·필기"
          hint="클로바노트 전사문을 붙여 넣고 필요한 필기를 덧붙여 주세요. 화자·시간·조건·예외를 포함한 원문을 보관합니다. 붙여넣기는 15만 자까지이며, 더 긴 전사문은 파일로 가져와 주세요."
          value={content.sourceText}
          maxLength={MAX_SOURCE_TEXT}
          rows={5}
          onChange={(event) => retain({ ...content, sourceText: event.target.value })}
        />
        {aiAllowed && (
          <StudyAIContextPicker
            data={data}
            subjectId={content.subjectId}
            text={content.sourceText}
            disabled={!ready || busy || saving || importing}
            onApply={async (sourceText) => {
              retain({ ...current.current, sourceText });
              await draftFlight.current;
            }}
          />
        )}
      </fieldset>
      <MaterialSources owner={owner} documents={content.documents ?? []} disabled={!ready || busy || saving}
        onBusy={setImporting} onChange={async documents => {
          retain({ ...current.current, documents, title: current.current.title || documents[0]?.name.replace(/\.[^.]+$/, '') || '' });
          await draftFlight.current;
        }}/>
      {data.namespace === 'personal' && <Checkbox label="자료 저장할 때 원본 파일도 비공개 서버에 보관" checked={content.originalStorage === 'private-server'} disabled={!ready || busy || saving || importing} onChange={e => retain({ ...current.current, originalStorage: e.target.checked ? 'private-server' : 'device' })}/>}
      {content.originalStorage === 'private-server' && <p className="material-hint">원본은 본인 계정으로만 열 수 있습니다. 다른 기기에서 자료를 열면 원본 파일을 가져옵니다. 기존 자료는 이 선택을 켜고 저장할 때 보관하며, 선택을 꺼도 이미 보관한 파일은 삭제하지 않습니다.</p>}
      {recovery && <Button onClick={() => void recover()}>이전에 중단한 녹음 내려받기</Button>}
      {content.audio && (
        <div className="material-audio">
          <span>
            {content.audio.name} · {(content.audio.size / 1024 / 1024).toFixed(1)}MB · 원본은 이
            {content.audio.cloudPath ? '기기와 비공개 서버에 보관' : '기기에 보관'}
          </span>
          {audioURL && (
            <>
              <audio ref={audioElement} src={audioURL} controls aria-label="강의 원본 음성">
                <track
                  kind="captions"
                  src={captionURL || undefined}
                  srcLang="ko"
                  label="받아쓴 내용"
                />
              </audio>
              <a href={audioURL} download={content.audio.name}>
                원본 음성 내려받기
              </a>
            </>
          )}
          {missingAudio && (
            <p role="alert">
              이 기기에 이전 원본 음성이 없습니다. 원본을 보관한 기기에서 내려받아 주세요.
            </p>
          )}
        </div>
      )}
      </details>
      <div className="material-actions">
        {aiAllowed && (
          <>
            <Select
              label="GPT 작업"
              value={task}
              disabled={!ready || busy || saving || importing}
              onChange={(event) => requestPatch({ task: event.target.value as StudyAITask })}
            >
              {Object.entries(STUDY_AI_TASKS).map(([value, option]) => (
                <option key={value} value={value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label={task === 'study-pack' ? '카드·퀴즈 개수' : '카드 개수'}
              value={count}
              disabled={busy || saving || importing}
              onChange={(event) => requestPatch({ requestedCardCount: Number(event.target.value) as StudyAIRequest['requestedCardCount'] })}
            >
              {[5, 10, 20, 30].map((value) => (
                <option key={value} value={value}>
                  {value}개 이내
                </option>
              ))}
            </Select>
            <Button
              variant="primary"
              disabled={
                !ready ||
                busy ||
                saving ||
                importing ||
                !content.subjectId ||
                (!content.sourceText.trim() && !content.documents?.some(doc => doc.blocks.some(b => b.included && b.text.trim())))
              }
              onClick={() => void analyze()}
            >
              {busy
                ? '정리하고 있습니다…'
                : result
                  ? '새 결과 만들기'
                  : task === 'summary'
                    ? '요약과 카드 만들기'
                    : task === 'study-pack' ? '복습 자료 한 번에 만들기' : `${STUDY_AI_TASKS[task].label} 만들기`}
            </Button>
          </>
        )}
        <Button
          disabled={!ready || busy || saving || importing}
          onClick={() => void save()}
        >
          {saving ? '저장 중…' : '자료 저장'}
        </Button>
      </div>
      {aiAllowed && task === 'study-pack' && <p className="material-hint">한 번의 요청으로 핵심 요약·암기 카드·객관식 퀴즈·개념도를 함께 만듭니다. 필요한 기능만 만들려면 GPT 작업을 바꿔 주세요.</p>}
      {aiAllowed && ranges && ranges.batches.length > 1 && <div className="material-fields"><p>선택 원문이 한 번의 처리 범위를 넘습니다. 전체 {ranges.batches.length}개 범위 중 하나씩 생성합니다. 원문과 먼저 만든 결과는 유지됩니다.</p><Select label="처리할 원문 범위" value={Math.min(rangeIndex, ranges.batches.length - 1)} disabled={busy || saving} onChange={event => retain({ ...current.current, generationProgress: { sourceIdentity: ranges.sourceIdentity, index: Number(event.target.value), completed: current.current.generationProgress?.sourceIdentity === ranges.sourceIdentity ? current.current.generationProgress.completed : [] } })}>{ranges.batches.map((batch, index) => <option key={index} value={index}>{index + 1} / {ranges.batches.length} · {batch[0]?.label ?? batch[0]?.id}–{batch.at(-1)?.label ?? batch.at(-1)?.id} · {batch.reduce((n, s) => n + s.text.length, 0).toLocaleString('ko-KR')}자{content.generationProgress?.sourceIdentity === ranges.sourceIdentity && content.generationProgress.completed.some(c => c.index === index) ? ' · 결과 보관됨' : ''}</option>)}</Select></div>}
      {aiAllowed && task !== 'summary' && (
        <fieldset
          disabled={!ready || busy || saving || importing}
          className="material-fields"
        >
<Select label="설명 도움 수준" value={content.aiRequest?.support ?? 'full'} onChange={event => requestPatch({ support: event.target.value as StudyAIRequest['support'] })}><option value="full">판단과 이유 충분히</option><option value="key">핵심 갈림길 중심</option><option value="check">결과와 점검 중심</option></Select>
          <Select label="사고 보조 장치" value={content.aiRequest?.externalization ?? 'auto'} onChange={event => requestPatch({ externalization: event.target.value as StudyAIRequest['externalization'] })}><option value="auto">복잡도와 막힘에 맞춰</option><option value="full">묻는 것부터 점검까지 모두</option><option value="off">장치 형식 없이 설명</option></Select>
          <Textarea
            label={task === 'tutor' ? '내 자료에서 확인할 질문' : '보조할 내용·범위 · 선택'}
            hint={
              task === 'formula'
                ? '예: 위 필기의 식을 LaTeX로 옮기고 기호와 성립 조건을 설명해 주세요.'
                : '현재 필기에서 살펴볼 부분이나 원하는 설명 방식을 적을 수 있습니다.'
            }
            value={content.aiRequest?.focus ?? ''}
            maxLength={30_000}
            onChange={(event) => requestPatch({ focus: event.target.value })}
          />
          {['hint', 'feedback', 'practice'].includes(task) && (
            <>
              <Textarea
                label="실제 문제와 조건"
                value={content.aiRequest?.problem ?? ''}
                maxLength={30_000}
                onChange={(event) => requestPatch({ problem: event.target.value })}
              />
              <Textarea
                label={task === 'practice' ? '현재 풀이 · 선택' : '현재 풀이·막힌 단계'}
                value={content.aiRequest?.attempt ?? ''}
                maxLength={30_000}
                onChange={(event) => requestPatch({ attempt: event.target.value })}
              />
              <Textarea
                label={task === 'hint' ? '참고 해설·판단 기준 · 선택' : '참고 해설·판단 기준'}
                value={content.aiRequest?.reference ?? ''}
                maxLength={30_000}
                onChange={(event) => requestPatch({ reference: event.target.value })}
              />
            </>
          )}
          <p className="material-hint">
            선택한 필기와 이 작업의 추가 내용만 GPT에 보냅니다. 결과는 원문과 별도로 보관합니다.
          </p>
        </fieldset>
      )}
      {aiAllowed && (
        <p className="material-hint">
          선택한 전사문·원문 구간과 필기만 GPT에 보냅니다. 별도 API 요금이 발생하며
          이 앱의 월 상한을 넘는 요청은 보내지 않습니다.
        </p>
      )}
      {result && (
        <fieldset
          disabled={saving}
          className="material-results"
          style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
        >
          <p>
            {STUDY_AI_TASKS[canonicalStudyTask(result.request?.task ?? 'summary')].label} · {result.model}
          </p>
          {result.range && <p role="status">전체 {result.range.count}개 중 {result.range.index + 1}번째 범위의 결과입니다. 앞뒤 원문 구간을 함께 제공했으므로 인접 결과와 겹치는 내용이 있을 수 있습니다.</p>}
          {result.diagnostics?.map((d, index) => <article key={`diagnostic:${index}`}><p>{d.message}</p>{d.questions?.map(q => <p key={q}>{q}</p>)}{d.sourceIds?.length ? evidence(d.sourceIds) : null}</article>)}
          {((result.source &&
            materialSourceIdentity(result.source) !== materialSourceIdentity(content)) ||
            (result.request?.task !== 'tutor' && JSON.stringify(activeStudyAIRequest(result.request)) !==
              JSON.stringify(activeStudyAIRequest(content.aiRequest))) ||
            result.segments.some(
              (segment) =>
                segment.originalText !== undefined && segment.originalText !== segment.text,
            )) && (
            <p role="status" className="material-hint">
              현재 자료나 보조 요청이 생성 당시와 달라졌습니다. 이 결과는 이전 입력을 기준으로
              만들어졌습니다. 새 결과를 만들면 현재 자료로 정리할 수 있습니다.
            </p>
          )}
          {content.results.length > 1 && (
            <Select
              label="생성 결과"
              value={resultIndex}
              onChange={(event) => {
                if (tab === 'quiz') recordHelp();
                setResultIndex(Number(event.target.value));
                setCardIndex(0);
                setAnswer('');
                setEditingResult(false);
                setEditingCard('');
              }}
            >
              {content.results.map((row, index) => (
                <option key={row.id} value={index}>
                  {index + 1}번째 결과 · {new Date(row.at).toLocaleString('ko-KR')}
                </option>
              ))}
            </Select>
          )}
          <fieldset aria-label="자료 보기" className="material-tabs">
            {(['summary', 'transcript', 'cards', ...(result.quiz ? ['quiz' as const] : []), ...(result.map ? ['map' as const] : [])] as const).map((value) => (
              <Button
                key={value}
                variant="quiet"
                aria-pressed={tab === value}
                onClick={() => chooseTab(value)}
              >
                {
                  {
                    summary:
                      result.request && !['summary','study-pack'].includes(result.request.task) ? '보조 결과' : '요약',
                    transcript: '받아쓴 원문',
                    cards: `플래시카드 ${cards.length}`,
                    quiz: `퀴즈 ${result.quiz?.length ?? 0}`,
                    map: '개념도',
                  }[value]
                }
              </Button>
            ))}
          </fieldset>
          {tab === 'quiz' && result.quiz && <MaterialQuiz key={result.id} resultId={result.id} questions={result.quiz} attempts={content.quizAttempts ?? []} disabled={busy || saving || importing}
            selectedId={viewState.current.quizAttemptId} onSelected={quizAttemptId => { viewState.current = { ...viewState.current, quizAttemptId }; retain(current.current); }} evidence={evidence} onChange={quizAttempts => retain({ ...current.current, quizAttempts })}/>}
          {tab === 'map' && result.map && <Suspense fallback={<p>개념도를 불러오고 있습니다.</p>}><MaterialMap key={result.id} map={result.map} originalMap={result.originalMap} disabled={busy || saving || importing} evidence={evidence}
            onChange={map => retain({ ...current.current, results: current.current.results.map(row => row.id === result.id ? { ...row, originalMap: row.originalMap ?? structuredClone(row.map), map } : row) })}
            onCanvas={async () => { try { if (!await save()) return; const next = await addMaterialMapToCanvas(repository, current.current, result); onSaved(next); setNotice('개념도를 Canvas에 추가했습니다. 기존 카드와 배치는 유지했습니다.'); } catch (error) { setError(message(error)); } }}/></Suspense>}
          {tab === 'summary' && (
            <div className="material-summary">
              <Button variant="quiet" onClick={() => setEditingResult(!editingResult)}>
                {editingResult ? '결과 편집 마치기' : '결과 수정'}
              </Button>
              {result.summary.map((row, index) => (
                <article key={`${result.id}:${index}`}>
                  {row.evidenceType === 'general-supplement' && <p>보충 설명 · 자료에서 직접 확인한 사실과 구별합니다.</p>}
                  {editingResult ? (
                    <Textarea
                      label={`${index + 1}번째 보조 결과`}
                      value={row.text}
                      maxLength={10_000}
                      onChange={(event) =>
                        retain({
                          ...current.current,
                          results: current.current.results.map((item) =>
                            item.id === result.id
                              ? {
                                  ...item,
                                  summary: item.summary.map((line, at) =>
                                    at === index
                                      ? {
                                          ...line,
                                          originalText: line.originalText ?? line.text,
                                          text: event.target.value,
                                        }
                                      : line,
                                  ),
                                }
                              : item,
                          ),
                        })
                      }
                    />
                  ) : (
                    <StudyResultText text={row.text} />
                  )}
                  {row.originalText !== undefined && (
                    <details>
                      <summary>생성 당시 결과</summary>
                      <p>{row.originalText}</p>
                      <Button
                        variant="quiet"
                        onClick={() =>
                          retain({
                            ...current.current,
                            results: current.current.results.map((item) =>
                              item.id === result.id
                                ? {
                                    ...item,
                                    summary: item.summary.map((line, at) =>
                                      at === index
                                        ? { ...line, text: line.originalText ?? line.text }
                                        : line,
                                    ),
                                  }
                                : item,
                            ),
                          })
                        }
                      >
                        생성 결과로 되돌리기
                      </Button>
                    </details>
                  )}
                  {evidence(row.sourceIds)}
                </article>
              ))}
            </div>
          )}
          {tab === 'transcript' && (
            <div className="material-transcript">
              <p className="material-hint">
                {result.source?.audio || (!result.source && content.audio)
                  ? '시간과 받아쓰기는 AI가 생성한 값입니다. 원본 음성과 대조해 수정할 수 있습니다.'
                  : '입력한 원문을 그대로 보관한 내용입니다. 수정 전 문장도 함께 남깁니다.'}
              </p>
              {result.segments.map((segment) => (
                <article key={segment.id} id={`material-segment-${segment.id}`}>
                  <span>{segment.label ?? (segment.start != null ? clock(segment.start) : segment.id)}</span>
                  <Textarea
                    label={`${segment.id} 원문`}
                    rows={3}
                    value={segment.text}
                    onChange={(event) =>
                      retain({
                        ...content,
                        results: content.results.map((row) =>
                          row.id === result.id
                            ? {
                                ...row,
                                segments: row.segments.map((item) =>
                                  item.id === segment.id
                                    ? {
                                        ...item,
                                        originalText: item.originalText ?? item.text,
                                        text: event.target.value,
                                      }
                                    : item,
                                ),
                              }
                            : row,
                        ),
                      })
                    }
                  />
                  {segment.originalText !== undefined && (
                    <details>
                      <summary>수정 전 원문</summary>
                      <p>{segment.originalText}</p>
                    </details>
                  )}
                </article>
              ))}
            </div>
          )}
          {tab === 'cards' &&
            (card ? (
              <div className="material-card-area">
                <p>
                  {cardIndex + 1} / {cards.length}
                </p>
                <article className="material-flashcard">
                  {editingCard === cardKey && cardKey ? (
                    <>
                      <Textarea
                        label="카드 질문"
                        value={card.question}
                        onChange={(event) => updateCard({ question: event.target.value })}
                      />
                      <Textarea
                        label="카드 답"
                        value={card.answer}
                        onChange={(event) => updateCard({ answer: event.target.value })}
                        rows={5}
                      />
                      <Button onClick={() => setEditingCard('')}>편집 마치기</Button>
                    </>
                  ) : (
                    <>
                      <h2><StudyResultText text={card.question} as="span" /></h2>
                      {answer === cardKey && cardKey ? (
                        <StudyResultText text={card.answer} className="material-answer" />
                      ) : (
                        <Button variant="primary" onClick={() => revealCard()}>
                          답 보기
                        </Button>
                      )}
                    </>
                  )}
                  {evidence(card.sourceIds)}
                </article>
                <UseMaterialCard
                  key={`${result.id}:${card.id}:${selected?.version}`}
                  data={data}
                  repository={repository}
                  onSaved={onSaved}
                  material={selected}
                  resultId={result.id}
                  cardId={card.id}
                  unsaved={
                    !selected ||
                    JSON.stringify({ ...materialContent(selected), learningView: undefined }) !== JSON.stringify({ ...content, learningView: undefined })
                  }
                />
                <div className="material-actions">
                  <Button
                    disabled={cardIndex === 0}
                    onClick={() => {
                      setCardIndex(cardIndex - 1);
                      setAnswer('');
                      setEditingCard('');
                    }}
                  >
                    이전 카드
                  </Button>
                  <Button
                    disabled={cardIndex >= cards.length - 1}
                    onClick={() => {
                      setCardIndex(cardIndex + 1);
                      setAnswer('');
                      setEditingCard('');
                    }}
                  >
                    다음 카드
                  </Button>
                  <Button variant="quiet" onClick={() => { setEditingCard(cardKey); revealCard(); }}>
                    카드 수정
                  </Button>
                  <Button
                    variant="quiet"
                    onClick={() => {
                      setEditingCard('');
                      updateCard({ excluded: true });
                      setCardIndex(Math.max(0, Math.min(cardIndex, cards.length - 2)));
                      setAnswer('');
                    }}
                  >
                    이 카드 제외
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                title="복습할 카드가 없습니다"
                message="다른 생성 결과를 선택하거나 제외한 카드를 복원할 수 있습니다."
              />
            ))}
          {result.cards.some((card) => card.excluded) && (
            <details>
              <summary>제외한 카드</summary>
              {result.cards
                .filter((card) => card.excluded)
                .map((card) => (
                  <div key={card.id}>
                    {card.question}
                    <Button
                      variant="quiet"
                      onClick={() =>
                        retain({
                          ...content,
                          results: content.results.map((row) =>
                            row.id === result.id
                              ? {
                                  ...row,
                                  cards: row.cards.map((item) =>
                                    item.id === card.id ? { ...item, excluded: false } : item,
                                  ),
                                }
                              : row,
                          ),
                        })
                      }
                    >
                      복원
                    </Button>
                  </div>
                ))}
            </details>
          )}
        </fieldset>
      )}
      {aiAllowed && <MaterialTutor key={`${result?.id}:${tab === 'quiz' ? 'quiz' : 'read'}`} onHelp={recordHelp} turns={content.results.filter(row => row.request?.task === 'tutor' || row.request?.task === 'source-qa')} currentSource={content} question={content.tutorDraft ?? ''} disabled={!ready || busy || saving || importing}
        onChange={tutorDraft => retain({ ...current.current, tutorDraft })}
        onAsk={async () => {
          const source = current.current;
          const sameSources = (row: typeof source.results[number]) => row.source !== undefined && materialSourceIdentity(row.source) === materialSourceIdentity({ ...source, audio: null });
          const history = source.results.filter(row => (row.request?.task === 'tutor' || row.request?.task === 'source-qa') && sameSources(row)).slice(-6).map(row => ({ question: row.request?.focus ?? '', answer: row.summary.map(line => line.text).join('\n\n') }));
          while (history.length && (JSON.stringify(history).length > 40000 || history.some(t => t.answer.length > 20000))) history.shift();
          await analyze({ ...source, aiRequest: { task: 'tutor', focus: source.tutorDraft ?? '', history } });
        }}
        onEvidence={(resultId, id) => { const index = current.current.results.findIndex(r => r.id === resultId); if (index >= 0) { recordHelp(); setResultIndex(index); setAnswer(''); setEditingCard(''); setTab('transcript'); setTimeout(() => document.getElementById(`material-segment-${id}`)?.scrollIntoView({ block: 'nearest' }), 0); } }}/ >}
      {selected && (
        <details className="material-history">
          <summary>저장 이력과 보관</summary>
          <p>
            이 자료의 수정 이력{' '}
            {
              data.revisions.filter(
                (row) => row.collection === 'studyMaterials' && row.entityId === selected.id,
              ).length
            }
            개
          </p>
          <Button
            variant="quiet"
            disabled={busy || saving}
            onClick={() => {
              try {
                const next = repository.execute({
                  type: 'trashStudyMaterial',
                  id: selected.id,
                  expectedVersion: selected.version,
                  ...context(data),
                });
                onSaved(next);
                navigate('/materials');
              } catch (error) {
                setError(message(error));
              }
            }}
          >
            자료를 휴지통으로
          </Button>
        </details>
      )}
    </section>
  );
}
