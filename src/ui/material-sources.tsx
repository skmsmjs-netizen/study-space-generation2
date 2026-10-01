import { useEffect, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import { canonicalYouTubeURL, documentSegments, type MaterialDocument } from '../domain/material-source';
import { keepDocumentFile, readDocumentFile } from '../data/material-files';
import { importMaterialFile, parseSubtitles } from '../data/material-import';
import { fetchYouTubeSubtitles } from '../data/study-ai';
import { Button, Checkbox, ErrorState, Input, Textarea } from './index';

export function MaterialSources({ owner, documents, disabled, onChange, onBusy }: {
  owner: Pick<AppState, 'userId' | 'namespace'>; documents: MaterialDocument[]; disabled: boolean;
  onChange: (documents: MaterialDocument[]) => Promise<void>; onBusy: (busy: boolean) => void;
}) {
  const [error, setError] = useState(''), [progress, setProgress] = useState(''), [busy, setBusy] = useState(false);
  const [url, setURL] = useState(''), [first, setFirst] = useState(''), [last, setLast] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [previews, setPreviews] = useState<Record<string,string>>({});
  const previewURLs = useRef<string[]>([]);
  useEffect(() => () => { previewURLs.current.forEach(URL.revokeObjectURL); previewURLs.current = []; }, []);
  const input = useRef<HTMLInputElement>(null), controller = useRef<AbortController | null>(null), alive = useRef(true);
  const current = useRef(documents); current.current = documents;
  useEffect(() => { alive.current = true; return () => { alive.current = false; controller.current?.abort(); }; }, []);
  async function update(doc: MaterialDocument) { try { const next = current.current.map(row => row.id === doc.id ? doc : row); await onChange(next); current.current = next; } catch (cause) { setError(cause instanceof Error ? cause.message : '수정을 보관하지 못했습니다. 원문을 확인해 주세요.'); } }
  async function bring(files: File[], replace?: string) {
    if (busy) return;
    setBusy(true); onBusy(true); setError('');
    const cancel = new AbortController(); controller.current = cancel;
    try {
      for (const file of files) {
        cancel.signal.throwIfAborted();
        if (!replace && current.current.length >= 20) throw Error('한 자료에 파일 20개까지 보관할 수 있습니다. 새 자료에 이어 넣어 주세요.');
        let imported: MaterialDocument;
        try {
          const range = (value: string) => { if (!value) return undefined; const n = Number(value); if (!Number.isInteger(n) || n < 1) throw Error('PDF 쪽 범위에 1 이상의 정수를 넣어 주세요.'); return n; };
          imported = await importMaterialFile(owner, file, { signal: cancel.signal, progress: message => { if (alive.current) setProgress(message); }, firstPage: range(first), lastPage: range(last) });
        } catch (cause) {
          // Keep a visible reference even when extraction or cancellation fails.
          const reference = await keepDocumentFile(owner, file);
          const message = cause instanceof Error ? cause.message : '';
          const failure = /[가-힣]/.test(message) ? message : '파일의 내용을 읽지 못했습니다. 원본은 보관했습니다. 파일이 열리는지 확인하거나 다른 형식으로 저장해 가져와 주세요.';
          imported = { id: replace ?? crypto.randomUUID(), name: file.name, kind: 'text', file: reference, blocks: [], warnings: [cancel.signal.aborted ? '읽기를 중단했습니다. 원본 파일은 보관했습니다.' : failure] };
        }
        if (replace) imported.id = replace;
        const duplicate = !replace && current.current.find(doc => doc.file?.sha256 === imported.file?.sha256);
        if (duplicate) { setProgress('같은 원본 파일이 이미 있습니다. 기존 원문과 수정을 유지했습니다.'); continue; }
        // Large documents remain complete. Select an initial bounded range rather than truncate.
        let remaining = 120_000 - documentSegments(current.current.filter(d => d.id !== replace)).reduce((n, b) => n + b.text.length, 0);
        imported.blocks = imported.blocks.map(b => { const included = b.text.length <= remaining; if (included) remaining -= b.text.length; return { ...b, included }; });
        if (imported.blocks.some(b => !b.included)) imported.warnings.push('전체 원문을 보관했습니다. 긴 자료는 일부 구간부터 GPT에 보냅니다. 아래에서 사용할 범위를 바꿀 수 있습니다.');
        const next = replace ? current.current.map(d => d.id === replace ? imported : d) : [...current.current, imported];
        current.current = next; await onChange(next);
        if (cancel.signal.aborted) break;
      }
      if (alive.current) setProgress(cancel.signal.aborted ? '중단했습니다. 가져온 원문과 원본 파일은 보관했습니다.' : '원문을 가져왔습니다. 사용할 구간을 확인해 주세요.');
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : '파일을 가져오지 못했습니다.'); }
    finally { if (alive.current) { setBusy(false); onBusy(false); } controller.current = null; }
  }
  async function youtube(manual: boolean) {
    if (busy) return;
    setBusy(true); onBusy(true); setError(''); const cancel = new AbortController(); controller.current = cancel;
    try {
      if (current.current.length >= 20) throw Error('새 자료에 자막을 이어 넣어 주세요.');
      const sourceURL = canonicalYouTubeURL(url);
      const source = manual ? { title: 'YouTube 자막', text: subtitle } : await fetchYouTubeSubtitles(owner, sourceURL, cancel.signal);
      let blocks;
      try { blocks = parseSubtitles(source.text); } catch { if (!source.text.trim()) throw Error('자막 내용이 없습니다.'); blocks = (source.text.match(/[\s\S]{1,8000}/g) ?? []).map((text, i) => ({ id: `text-${i + 1}`, label: `${i + 1}번째 자막 구간`, text, start: null, end: null, included: true })); }
      if (current.current.some(d => d.url === sourceURL)) throw Error('이 영상의 자막을 이미 보관했습니다. 기존 자료에서 내용을 확인해 주세요.');
      const doc: MaterialDocument = { id: crypto.randomUUID(), name: source.title.slice(0, 512), kind: 'youtube', url: sourceURL, file: null, blocks, warnings: [manual ? '입력한 자막을 보관했습니다. 영상 원문과 대조해 주세요.' : '자동 자막은 오인식할 수 있습니다. 영상 원문과 대조해 주세요.'] };
      let remaining = 120_000 - documentSegments(current.current).reduce((n, b) => n + b.text.length, 0);
      doc.blocks = doc.blocks.map(b => { const included = b.text.length <= remaining; if (included) remaining -= b.text.length; return { ...b, included }; });
      await onChange([...current.current, doc]); setProgress('영상 주소와 자막을 보관했습니다.'); setSubtitle('');
    } catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : '자막을 가져오지 못했습니다.'); }
    finally { if (alive.current) { setBusy(false); onBusy(false); } controller.current = null; }
  }
  return <section className="material-sources" aria-label="문서·사진·자막 가져오기" aria-busy={busy}>
    <div className="material-actions"><Button disabled={disabled || busy} onClick={() => input.current?.click()}>문서·사진·자막 가져오기</Button>{busy && <Button onClick={() => controller.current?.abort()}>가져오기 중단</Button>}</div>
    <input ref={input} type="file" multiple className="material-file-input" aria-label="학습 자료 파일" accept=".pdf,.docx,.pptx,.txt,.md,.csv,.srt,.vtt,.png,.jpg,.jpeg,.webp,.bmp" onChange={e => { const files = Array.from(e.target.files ?? []); e.target.value = ''; void bring(files); }} />
    <p className="material-hint">PDF·DOCX·PPTX·사진·텍스트·자막을 읽습니다. 원본 파일은 기기에 보관하고, 선택한 원문만 GPT에 보냅니다.</p>
    <details><summary>PDF 쪽 범위 · 선택</summary><div className="material-target"><Input label="PDF 시작 쪽" type="number" min={1} value={first} disabled={disabled || busy} onChange={e => setFirst(e.target.value)} placeholder="1"/><Input label="PDF 마지막 쪽" type="number" min={1} value={last} disabled={disabled || busy} onChange={e => setLast(e.target.value)} placeholder="마지막 쪽"/></div></details>
    <details><summary>YouTube 자막 가져오기</summary>
      <Input label="YouTube 영상 주소" value={url} disabled={disabled || busy} onChange={e => setURL(e.target.value)} placeholder="https://www.youtube.com/watch?v=…"/>
      <Button disabled={disabled || busy || !url.trim()} onClick={() => void youtube(false)}>영상 자막 가져오기</Button>
      <p className="material-hint">접근 가능한 한국어·영어 자막을 가져옵니다. 영상에 자막이 없거나 접근이 거부되면 자막 파일 또는 아래 내용을 사용할 수 있습니다.</p>
      <Textarea label="영상 자막 붙여 넣기" value={subtitle} disabled={disabled || busy} maxLength={1_000_000} rows={3} onChange={e => setSubtitle(e.target.value)}/>
      <Button disabled={disabled || busy || !url.trim() || !subtitle.trim()} onClick={() => void youtube(true)}>붙여 넣은 자막 보관</Button>
    </details>
    {error && <ErrorState message={error}/>} {progress && <p role="status">{progress}</p>}
    {documents.map(doc => <details key={doc.id} className="material-source-document"><summary>{doc.name} · {doc.blocks.length}개 구간</summary>
      {doc.url && <a href={doc.url} target="_blank" rel="noreferrer">원본 영상 열기</a>}
      {doc.file && <div className="material-actions"><Button disabled={busy} onClick={async () => { try { const blob = await readDocumentFile(owner, doc.file!); if (!blob) throw Error('이 기기에 원본 파일이 없습니다. 같은 파일을 다시 가져와 주세요.'); const href = URL.createObjectURL(blob), link = document.createElement('a'); link.href = href; link.download = doc.file!.name; link.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); } catch (cause) { setError(cause instanceof Error ? cause.message : '파일을 열지 못했습니다.'); } }}>원본 내려받기</Button>
        {!doc.blocks.length && <Button disabled={disabled || busy} onClick={async () => { const blob = await readDocumentFile(owner, doc.file!); if (blob) await bring([new File([blob], doc.file!.name, { type: doc.file!.type })], doc.id); else setError('같은 원본 파일을 다시 가져와 주세요.'); }}>파일 다시 읽기</Button>}</div>}
      {doc.kind === 'image' && doc.file && <div><Button disabled={busy} onClick={async () => { try { if (previews[doc.id]) return; const blob = await readDocumentFile(owner, doc.file!); if (!blob) throw Error('원본 사진을 다시 가져와 주세요.'); const url = URL.createObjectURL(blob); previewURLs.current.push(url); setPreviews(p => ({...p,[doc.id]:url})); } catch (cause) { setError(cause instanceof Error ? cause.message : '사진을 열지 못했습니다.'); } }}>원본 사진 보기</Button>{previews[doc.id] && <img className="material-source-image" src={previews[doc.id]} alt={`${doc.name} 원본 사진`}/>}</div>}
      {doc.warnings.map((w, i) => <p className="material-hint" key={i}>{w}</p>)}
      <div className="material-actions"><Button disabled={disabled || busy} onClick={() => void update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: true })) })}>전체 구간 선택</Button><Button disabled={disabled || busy} onClick={() => void update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: false })) })}>선택 해제</Button></div>
      <div className="material-source-blocks">{doc.blocks.map(b => <details key={b.id}><summary>{b.label} · {b.included ? 'GPT에 포함' : '보관만'}</summary>
        <Checkbox label={`${b.label} GPT에 포함`} checked={b.included} disabled={disabled || busy} onChange={e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, included: e.target.checked } : row) })}/>
        <Textarea label={`${doc.name} ${b.label} 원문`} value={b.text} disabled={disabled || busy} rows={4} maxLength={100000} onChange={e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, originalText: row.originalText ?? row.text, text: e.target.value } : row) })}/>
        {b.originalText !== undefined && <details><summary>처음 읽은 원문</summary><p className="material-answer">{b.originalText}</p><Button disabled={disabled || busy} onClick={() => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, text: row.originalText ?? row.text } : row) })}>처음 원문으로 되돌리기</Button></details>}
      </details>)}</div>
    </details>)}
  </section>;
}
