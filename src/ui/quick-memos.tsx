import { InputAIHelp } from './input-ai-help';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Button, EmptyState, ErrorState, Modal, Select, Textarea } from './index';
import { isViewPage, isViewText, useViewContext } from './use-view-context';
import type { AppState, Command, MemoStroke, QuickMemo } from '../domain/model';
import { MEMO_WIDTH, MEMO_HEIGHT } from '../domain/memo';
import { storagePrefix, type StudyRepository } from '../data/repository';
import { MemoInkPad, type InkPadHandle } from './memo-ink-pad';
import { InkDrawing, InkPreview } from './ink-drawing';
import { inkPageCount } from '../domain/ink-editing';
import { memoDraftKey, readMemoDraft, sameMemo, writeMemoDraft, type MemoDraft } from '../data/memo-draft';
import { archiveDamagedDraft, clearStoredDraft, draftHasUnstoredText, rescueWithoutOverwrite } from '../data/draft-safety';
import { attachInkPDF, syncInkPDF, exportInkPDF, downloadInkFile } from '../data/ink-documents';
import { readDocumentFile } from '../data/document-files';
import { InkPDFBackground } from './ink-pdf-background';
import { navigate } from './navigation-context';
import './quick-memos.css';

type Content = Pick<QuickMemo, 'body' | 'ownerId' | 'strokes' | 'document'>;
type Props = { data: AppState; repository: StudyRepository; onSaved: (next: AppState) => void; ownerId?: string; memoId?: string; compact?: boolean; trash?: boolean; onCloseDetail?: () => void };
const errorMessage = (error: unknown) => error instanceof Error && (error.name === 'QuotaExceededError' || /quota/i.test(error.message)) ? '이 기기의 저장 공간이 부족합니다.' : error instanceof Error ? error.message : '저장하지 못했습니다.';
function ownerName(data: AppState, ownerId: string | null) {
  return data.nodes.find(row => row.id === ownerId)?.name ?? data.subjects.find(row => row.id === ownerId)?.name ?? '자유 메모';
}
export function QuickMemos({ data, repository, onSaved, ownerId, memoId, compact = false, trash = false, onCloseDetail }: Props) {
  const [editing, setEditing] = useState<string | null>(memoId ?? null);
  const [error, setError] = useState('');
  const view = `memos:${trash ? 'trash' : 'active'}:${ownerId ?? 'all'}`;
  const [query, setQuery] = useViewContext(data, `${view}:query`, '', isViewText);
  const [limit, setLimit] = useViewContext(data, `${view}:limit`, 40, isViewPage);
  const [trashId, setTrashId] = useState<string | null>(null);
  const [restored, setRestored] = useState<string | null>(null);
  const all = (data.memos ?? []).filter(memo => Boolean(memo.deletedAt) === trash && (ownerId === undefined || memo.ownerId === ownerId))
    .slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
  const filtered = compact ? all : all.filter(memo => !query.trim() || `${memo.body} ${ownerName(data, memo.ownerId)}`.normalize('NFC').toLocaleLowerCase('ko-KR').includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')));
  const selected = (data.memos ?? []).find(memo => memo.id === editing && !memo.deletedAt);
  useEffect(() => { setEditing(memoId ?? null); }, [memoId]);
  const execute = (action: Omit<Extract<Command, { type: 'saveMemo' }>, 'opId' | 'at' | 'userId' | 'namespace'> | { type: 'trashMemo' | 'restoreMemo'; id: string; expectedVersion: number }) => {
    try {
      const next = repository.execute({ ...action, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
      onSaved(next); setError(''); return next;
    } catch (e) { setError(errorMessage(e)); return null; }
  };
  const add = (event: MouseEvent<HTMLButtonElement>) => {
    // Safari touch activation does not focus buttons. The conditionally mounted
    // editor must receive its actual invoker before Modal captures activeElement.
    event.currentTarget.focus({ preventScroll: true });
    const id = crypto.randomUUID();
    if (execute({ type: 'saveMemo', id, ownerId: ownerId ?? null, body: '', strokes: [], expectedVersion: 0 })) setEditing(id);
  };
  const close = () => { setEditing(null); if (memoId) { if (onCloseDetail) onCloseDetail(); else navigate('/memos'); } };
  const moveToTrash = (memo: QuickMemo) => {
    if (execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version })) { setTrashId(null); setRestored(memo.id); }
  };
  const restore = (memo: QuickMemo) => {
    if (execute({ type: 'restoreMemo', id: memo.id, expectedVersion: memo.version })) setRestored(null);
  };
  const undoTrash = (data.memos ?? []).find(row => row.id === restored && row.deletedAt);
  return <section className="quick-memos section-space" aria-label={trash ? '휴지통의 메모' : '메모 카드'}>
    <div className="section-heading"><div><h2>{trash ? '메모' : '작은 메모'}</h2>{compact && <p className="muted">떠오른 생각을 글이나 그림으로 남겨 두세요.</p>}</div>
      {!trash && <div className="actions">{compact && <a href="#/memos">메모 모두 보기</a>}<Button onClick={add}>메모 추가</Button></div>}
    </div>
    {error && <ErrorState message={error} />}
    {undoTrash && <div className="feedback-banner"><span role="status">메모를 휴지통으로 옮겼습니다.</span><Button onClick={() => restore(undoTrash)}>메모 복원</Button></div>}
    {!compact && <Textarea textRole="interface" label="메모 찾기" rows={1} value={query} placeholder="입력한 글이나 과목·주제 이름" onChange={event => { setQuery(event.target.value); setLimit(40); }} />}
    <div className="memo-grid">{(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))).map((memo, index) => <article className="memo-card" key={memo.id}>
      <button type="button" className="memo-paper-preview" aria-label={`메모 ${index + 1} 열기${memo.body ? `: ${memo.body.slice(0, 35)}` : memo.strokes.length ? ': 스케치' : ': 빈 메모'}`} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setEditing(memo.id); }} disabled={trash}>
        <svg viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} aria-hidden="true"><InkDrawing strokes={memo.strokes} /></svg>
        {memo.body && <span className="memo-preview-text">{memo.body}</span>}
        {!memo.body && !memo.strokes.length && !memo.document && <span className="memo-placeholder">여기에 생각을 남겨 보세요.</span>}
      </button>
      <div className="memo-card-footer"><span>{memo.document ? memo.document.file.name + ' · ' : ''}{ownerName(data, memo.ownerId)}{inkPageCount(memo.strokes) > 1 ? ` · ${inkPageCount(memo.strokes)}쪽` : ''}</span>{trash ? <Button variant="quiet" onClick={() => restore(memo)}>복원</Button> : <details className="memo-card-menu"><summary aria-label={`메모 ${index + 1} 메뉴`}>···</summary><Button variant="quiet" aria-label={`메모 ${index + 1} 휴지통으로 이동`} onClick={() => setTrashId(memo.id)}>휴지통</Button></details>}</div>
    </article>)}</div>
    {!compact && filtered.length > Math.max(40, limit) && <Button onClick={() => setLimit(value => Math.max(40, value) + 40)}>메모 더 보기</Button>}
    {!compact && all.length > 0 && !filtered.length && <EmptyState title="찾은 메모가 없습니다" message="입력한 글이나 과목·주제 이름으로 다시 찾아보세요."><Button onClick={() => {setQuery('');setLimit(40);}}>메모 검색어 지우기</Button></EmptyState>}
    {!all.length && !compact && !memoId && <EmptyState title={trash ? '휴지통에 메모가 없습니다' : '첫 메모를 남겨 보세요'} message={trash ? undefined : '제목 없이 짧은 글이나 그림부터 시작할 수 있습니다.'} />}
    {selected && <MemoEditor key={selected.id} memo={selected} data={data} repository={repository} onSaved={onSaved} onClose={close} onCopy={id => setEditing(id)} />}
    {memoId && !selected && <EmptyState title="이 메모를 찾을 수 없습니다" message="휴지통에 있는지 확인하거나 다른 메모를 골라 주세요."><a href="#/memos">메모 목록으로</a><a href="#/trash">휴지통 확인</a></EmptyState>}
    <Modal open={Boolean(trashId)} title="메모를 휴지통으로 옮길까요?" onClose={() => setTrashId(null)}><p>글과 그림, 수정 이력은 남아 있습니다. 휴지통에서 복원할 수 있습니다.</p><Button variant="danger" onClick={() => { const memo = all.find(row => row.id === trashId); if (memo) moveToTrash(memo); }}>휴지통으로 이동</Button></Modal>
  </section>;
}

export function MemoEditor({ memo, data, repository, onSaved, onClose, onCopy, embedded = false }: { memo: QuickMemo; data: AppState; repository: StudyRepository; onSaved: Props['onSaved']; onClose: () => void; onCopy: (id: string) => void; embedded?: boolean }) {
  const key = memoDraftKey(data, memo.id);
  const [initial] = useState(() => {
    try {
      const draft = readMemoDraft(key, memo.id);
      if (draft && !sameMemo(draft, memo) && draft.baseVersion !== memo.version) return { content: memo as Content, conflict: draft, blocked: true, error: '저장된 메모와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다.' };
      return { content: (draft ?? memo) as Content, conflict: null, blocked: false, error: '' };
    } catch { return { content: memo as Content, conflict: null, blocked: true, error: '초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 초안 보관본에서 확인할 수 있습니다.' }; }
  });
  const [content, setContent] = useState<Content>(initial.content);
  const [isBlocked, setBlocked] = useState(initial.blocked);
  const contentRef = useRef(content), savedRef = useRef<Content>(memo), version = useRef(memo.version);
  const callback = useRef(onSaved); callback.current = onSaved;
  const [error, setError] = useState(initial.error), [status, setStatus] = useState(sameMemo(initial.content, memo) ? '이 기기에 저장됨' : '저장 중…');
  const [pdfBusy,setPDFBusy] = useState(false), [pdfPage,setPDFPage] = useState(0);
  const documentInput=useRef<HTMLInputElement>(null);
  const mounted=useRef(true); useEffect(()=>()=>{mounted.current=false;},[]);
  const pad = useRef<InkPadHandle | null>(null), drawing = useRef(false);
  const finish = () => pad.current?.finish();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blocked = useRef(initial.blocked);
  const copyOperation = useRef<{ id: string; opId: string; at: string } | null>(null);
  const persistDraft = () => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = null;
    try { writeMemoDraft(key, { id: memo.id, baseVersion: version.current, ...contentRef.current }); }
    catch { /* Exact rescue remains in memory. The footer reports this honestly. */ }
  };
  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (blocked.current || drawing.current) return false;
    const current = contentRef.current;
    if (sameMemo(current, savedRef.current)) {
      if (draftTimer.current) clearTimeout(draftTimer.current); draftTimer.current = null;
      try { clearStoredDraft(key); } catch { /* Saved content is already durable. */ }
      setStatus('이 기기에 저장됨'); setError('');
      return true;
    }
    persistDraft();
    try {
      const next = repository.execute({ type: 'saveMemo', id: memo.id, ...current, expectedVersion: version.current,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace });
      const stored = next.memos!.find(row => row.id === memo.id)!;
      version.current = stored.version; savedRef.current = current; callback.current(next);
      setStatus('이 기기에 저장됨'); setError('');
      try { clearStoredDraft(key); } catch { setError('메모는 저장했습니다. 초안 정리가 남아 있습니다.'); }
      return true;
    } catch (e) { setError(`${errorMessage(e)} ${draftHasUnstoredText(key) ? '최신 입력은 현재 창에만 남아 있습니다. 메모 파일로 보관해 주세요.' : '글과 그림은 이 기기의 초안에 보관했습니다. 저장을 다시 시도해 주세요.'}`); setStatus('저장 다시 필요'); return false; }
  };
  const update = (next: Content) => {
    contentRef.current = next; setContent(next); setStatus('저장 중…');
    // Publish drawing first; defer storage until after the browser can paint it.
    rescueWithoutOverwrite(key, JSON.stringify({ id: memo.id, baseVersion: version.current, ...next }));
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(persistDraft, 80);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 1200);
  };
  const operations = useRef({ flush, finish }); operations.current = { flush, finish };
  useEffect(() => {
    const save = () => { operations.current.finish(); return operations.current.flush(); };
    const unload = (event: BeforeUnloadEvent) => { if (!save() && !sameMemo(contentRef.current, savedRef.current)) { event.preventDefault(); event.returnValue = ''; } };
    const hidden = () => { if (document.visibilityState === 'hidden') save(); };
    window.addEventListener('beforeunload', unload); window.addEventListener('pagehide', save); document.addEventListener('visibilitychange', hidden);
    if (!sameMemo(contentRef.current, savedRef.current) && !blocked.current) timer.current = setTimeout(() => operations.current.flush(), 600);
    return () => { window.removeEventListener('beforeunload', unload); window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', hidden); save(); };
  }, []);
  const close = () => { finish(); if (blocked.current || flush()) onClose(); };
  const copyConflict = () => {
    if (!initial.conflict) return;
    try {
      copyOperation.current ??= { id: crypto.randomUUID(), opId: crypto.randomUUID(), at: new Date().toISOString() };
      const operation = copyOperation.current;
      const next = repository.execute({ type: 'saveMemo', ...operation, ownerId: initial.conflict.ownerId, body: initial.conflict.body, strokes: initial.conflict.strokes, ...(initial.conflict.document ? {document:initial.conflict.document}:{}),
        expectedVersion: 0, userId: data.userId, namespace: data.namespace });
      callback.current(next);
      // Keep the old draft until the new card is safely saved and verified by the repository.
      clearStoredDraft(key); onCopy(operation.id);
    } catch (e) { setError(errorMessage(e)); }
  };
  const exportMemo = () => {
    finish();
    try {
      const raw = JSON.stringify({ format: 'study-space-quick-memo', version: 1, exportedAt: new Date().toISOString(),
        namespace: data.namespace, userId: data.userId, savedMemo: repository.getSnapshot().memos?.find(row => row.id === memo.id),
        draft: { id: memo.id, baseVersion: version.current, ...contentRef.current }, conflict: initial.conflict,
        revisions: repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id),
        appliedOps: Object.fromEntries(repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map(row => [row.operationId, repository.getSnapshot().appliedOps[row.operationId]])),
      }, null, 2);
      const url = URL.createObjectURL(new Blob([raw], { type: 'application/json;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = `memo-${memo.id}.json`;
      document.body.append(link); try { link.click(); } finally { link.remove(); }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setStatus('파일 저장 위치를 확인해 주세요');
    } catch { setError('파일을 만들지 못했습니다. 입력은 현재 창에 유지했습니다.'); }
  };
  const finishPDFUpload = (synced:NonNullable<Content['document']>) => {
    if(mounted.current) {update({...contentRef.current,document:synced});flush();return;}
    const row=repository.getSnapshot().memos?.find(row=>row.id===memo.id);
    if(!row || row.deletedAt || row.document?.file.sha256!==synced.file.sha256)return;
    const next=repository.execute({type:'saveMemo',id:row.id,ownerId:row.ownerId,body:row.body,strokes:row.strokes,document:synced,expectedVersion:row.version,opId:crypto.randomUUID(),at:new Date().toISOString(),userId:data.userId,namespace:data.namespace});
    callback.current(next);
  };
  const attachPDF = async (file:File) => {
    finish();setPDFBusy(true);setError('');
    try {const existing=contentRef.current.document;
      const source=await attachInkPDF(data,file,existing?.startPage ?? (contentRef.current.strokes.length ? inkPageCount(contentRef.current.strokes) : 0));
      if(existing && existing.file.sha256!==source.file.sha256)throw Error('기존 PDF와 다른 파일입니다. 원본 PDF를 선택하거나 새 메모에 연결해 주세요. 기존 필기는 유지했습니다.');
      if(!mounted.current)return;
      update({...contentRef.current,document:source});pad.current?.goTo?.(source.startPage);
      if(data.namespace==='personal') {const synced=await syncInkPDF(data,source);finishPDFUpload(synced);}
    }catch(e){if(mounted.current)setError(errorMessage(e)+' 원본과 필기는 이 기기에 보관했습니다.');}
    finally{if(mounted.current)setPDFBusy(false);}
  };
  const retryPDF=async()=>{const source=contentRef.current.document;if(!source)return;setPDFBusy(true);try{const synced=await syncInkPDF(data,source);finishPDFUpload(synced);if(mounted.current)setError('');}catch(e){if(mounted.current)setError(errorMessage(e));}finally{if(mounted.current)setPDFBusy(false);}};
  const downloadPDF=async(original=false)=>{finish();setPDFBusy(true);try{
    if(original&&contentRef.current.document){const blob=await readDocumentFile(data,contentRef.current.document.file);if(!blob)throw Error('PDF 원본을 찾지 못했습니다.');downloadInkFile(blob,contentRef.current.document.file.name);}
    else {const bytes=await exportInkPDF(data,contentRef.current.strokes,contentRef.current.document);downloadInkFile(new Blob([bytes as BlobPart],{type:'application/pdf'}),`memo-${memo.id}-annotations.pdf`);}
  }catch(e){setError(errorMessage(e));}finally{if(mounted.current)setPDFBusy(false);}};
  const editor = <>
    <div className="actions">
      <input ref={documentInput} type="file" accept="application/pdf,.pdf" hidden aria-label="필기할 PDF 파일" onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void attachPDF(file);}}/>
      {!content.document && <Button disabled={isBlocked||pdfBusy} onClick={()=>documentInput.current?.click()}>PDF 위에 필기</Button>}
      <Button disabled={isBlocked||pdfBusy} onClick={()=>void downloadPDF()}>주석 PDF로 보관</Button>
      {content.document && <><Button disabled={pdfBusy||isBlocked} onClick={()=>documentInput.current?.click()}>PDF 원본 다시 연결</Button><span>{content.document.file.name} · {content.document.pages}쪽</span><Button disabled={pdfBusy} onClick={()=>void downloadPDF(true)}>원본 PDF 보관</Button>
        {data.namespace==='personal'&&!content.document.file.cloudPath&&<Button disabled={pdfBusy} onClick={()=>void retryPDF()}>PDF 서버 보관 다시 시도</Button>}</>}
      {pdfBusy&&<span role="status">PDF를 처리하고 있습니다…</span>}
    </div>
    <MemoInkPad minimumPages={content.document ? content.document.startPage + content.document.pages : 1} onPageChange={setPDFPage}
      background={content.document ? <InkPDFBackground owner={data} document={content.document} page={pdfPage} onError={setError}/> : undefined}
      onRecognizedText={text=>update({...contentRef.current,body:contentRef.current.body+(contentRef.current.body ? '\n' : '')+text})} repository={repository} onWorkspaceSaved={() => onSaved(repository.getSnapshot())} controller={pad} documentKey={key} preferencesKey={`${storagePrefix(data)}:ink-preferences:v1`} title="메모" label="메모 필기" drawingLabel="메모 스케치 영역" strokes={content.strokes} disabled={isBlocked}
      onDrawing={value => { drawing.current = value; }} onChange={strokes => update({ ...contentRef.current, strokes })} />
    <details className="memo-details" open={Boolean(initial.content.body) || undefined}><summary>글·연결·입력 설정</summary><div className="memo-input"><Textarea label="짧은 글" data-editing-context={`memo:${memo.id}:body`} placeholder="결론 한 줄, 남은 의문…" value={content.body} rows={3} disabled={isBlocked} onChange={event => update({ ...contentRef.current, body: event.target.value })} /></div>
    <div className="memo-options">
      <Select label="연결할 곳" value={content.ownerId ?? ''} disabled={isBlocked} onChange={event => update({ ...contentRef.current, ownerId: event.target.value || null })}>
        <option value="">자유 메모</option>
        {data.subjects.filter(row => !row.deletedAt).map(subject => <optgroup key={subject.id} label={subject.name}><option value={subject.id}>{subject.name} 전체</option>{data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id).map(node => <option key={node.id} value={node.id}>{node.name}</option>)}</optgroup>)}
        {content.ownerId && ![...data.subjects, ...data.nodes].some(row => row.id === content.ownerId && !row.deletedAt) && <option value={content.ownerId}>{ownerName(data, content.ownerId)} · 휴지통</option>}
      </Select>
    </div>
    </details>
    <div className="memo-notice">{error && <p role="alert">{error}</p>}</div>
    {initial.conflict && <div className="memo-conflict"><p>저장된 메모는 위에 그대로 있습니다. 별도로 남아 있는 초안:</p><p className="prose">{initial.conflict.body || '(글 없음)'}</p><InkPreview strokes={initial.conflict.strokes} label="별도로 남아 있는 초안 그림" /><Button onClick={copyConflict}>초안을 별도 메모로 보관</Button></div>}
    {isBlocked && !initial.conflict && <Button onClick={() => {
      try { archiveDamagedDraft(key, '작은 메모 초안 읽기 실패'); clearStoredDraft(key); blocked.current = false; setBlocked(false); setError('읽을 수 없던 초안 원문을 보관했습니다. 저장된 메모를 이어 편집할 수 있습니다.'); }
      catch (e) { setError(errorMessage(e)); }
    }}>초안 원문 보관 후 편집</Button>}
    {/* biome-ignore lint/a11y/useValidAnchor: The real archives route link closes the draft dialog before normal navigation without changing its preserved original. */}
    {isBlocked && <a href="#/draft-archives" onClick={onClose}>초안 보관본 확인</a>}
    <InputAIHelp triggerLabel="이 메모로 GPT 도움" data={data} input={{key:`memo:${memo.id}`,title:'메모',text:content.body,subjectId:data.subjects.find(s=>s.id===content.ownerId)?.id ?? data.nodes.find(n=>n.id===content.ownerId)?.subjectId,topicId:data.nodes.find(n=>n.id===content.ownerId)?.id}} defaultTask="organize" save={command=>{const next=repository.execute(command);onSaved(next);return next.studyMaterials?.find(m=>m.id===command.id)?.version;}} />
    <footer className="memo-save-bar"><span role="status">{isBlocked ? '초안 확인 필요' : status}</span><div className="actions"><Button variant="quiet" onClick={exportMemo}>메모 파일로 보관</Button>{!isBlocked && <Button onClick={flush}>지금 저장</Button>}<Button variant="primary" onClick={close}>닫기</Button></div></footer>
  </>;
  return embedded ? <div className="memo-editor canvas-memo-editor nodrag nopan nowheel">{editor}</div> : <Modal open title="작은 메모" onClose={close} className="memo-editor">{editor}</Modal>;
}
