import { occurrenceRows } from './list-keys';
import { useEffect, useRef, useState } from 'react';
import type { AppState, Command, OutlineNode, RecallImportItem } from '../domain/model';
import type { RecallSession } from '../domain/topic-recall';
import { recallDecks, recallOptions } from '../domain/recall-scheduler';
import type { RecallRepository } from '../data/topic-recall';
import type { AnkiPreview } from '../data/anki-package';
import { Button, Checkbox, Input, Select } from './index';
const FILE_LIMIT = 128 * 1024 * 1024;
export function RecallImport({ data, topics, repository, session, persist, onSaved, disabled }: { data: AppState; topics: OutlineNode[]; repository: RecallRepository; session: RecallSession; persist: (next: RecallSession) => boolean; onSaved: (next: AppState) => void; disabled: boolean }) {
  const [preview, setPreview] = useState<AnkiPreview | null>(null), [name, setName] = useState(''), [busy, setBusy] = useState(false), [reading, setReading] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [acknowledged, setAcknowledged] = useState(false);
  const worker = useRef<Worker | null>(null), stopped = useRef(false), latest = useRef(session);
  latest.current = session;
  useEffect(() => () => { worker.current?.terminate(); stopped.current = true; }, []);
  const target = session.importTarget ?? { topicId: topics[0]?.id ?? '', deckId: 'default', keepDecks: true, updateUnedited: false };
  const change = (patch: Partial<typeof target>) => persist({ ...session, importTarget: { ...target, ...patch } });
  const read = async (file: File | undefined) => {
    if (!file || disabled || busy) return;
    worker.current?.terminate(); setError(''); setNotice(''); setPreview(null); setAcknowledged(false); setName(file.name);
    if (!/\.apkg$/i.test(file.name) || file.size > FILE_LIMIT) { setError('128MB 이하의 .apkg 파일을 선택해 주세요. 큰 덱은 Anki에서 나누거나 미디어 없이 내보낼 수 있습니다.'); return; }
    setReading(true); const job = new Worker(new URL('../data/anki-package.worker.ts', import.meta.url), { type: 'module' }); worker.current = job;
    job.onmessage = ({ data: message }) => {
      if (worker.current !== job) return;
      job.terminate(); worker.current = null; setReading(false);
      if (message.type === 'result') setPreview(message.result); else setError(String(message.error));
    };
    job.onerror = () => { if (worker.current === job) { job.terminate(); worker.current = null; setReading(false); setError('파일 해석을 시작하지 못했습니다. 원본 파일은 그대로이며 다시 선택할 수 있습니다.'); } };
    try { const bytes = await file.arrayBuffer(); if (worker.current === job) job.postMessage(bytes, [bytes]); }
    catch { job.terminate(); worker.current = null; setReading(false); setError('파일을 읽지 못했습니다. 원본 파일은 그대로입니다.'); }
  };
  const execute = async (command: Extract<Command, { type: 'importRecallCards' }>) => {
    if (!persist({ ...latest.current, pendingImport: command })) throw Error('가져오기 요청을 보존하지 못했습니다. 공간을 확보한 뒤 다시 시도해 주세요.');
    latest.current = { ...latest.current, pendingImport: command };
    const saved = repository.execute(command); onSaved(saved);
    await repository.flush?.();
    const status = repository.getStatus?.();
    if (status && status.phase !== 'saved') throw Error(status.message || '서버에 아직 저장하지 못했습니다. 요청과 원문은 보존했습니다.');
    if (!persist({ ...latest.current, pendingImport: undefined })) throw Error('카드는 저장했으나 확인 초안을 정리하지 못했습니다. 다시 시도해도 중복 생성하지 않습니다.');
    latest.current = { ...latest.current, pendingImport: undefined };
    // Yield between batches so input, status updates and cancellation remain responsive.
    await new Promise(resolve => setTimeout(resolve, 0));
  };
  const start = async () => {
    if (disabled || busy || !preview?.items.length || !target.topicId) return;
    setBusy(true); stopped.current = false; setError(''); setNotice('가져올 카드를 저장하고 있습니다.');
    try {
      const context = () => { const snapshot = repository.getSnapshot(); return { userId: snapshot.userId, namespace: snapshot.namespace, opId: crypto.randomUUID(), at: new Date().toISOString() }; };
      const deckNames = [...new Set(preview.items.map(item => item.source.deck))], deckIds = new Map<string, string>();
      if (target.keepDecks) for (const deckName of deckNames) {
        const snapshot = repository.getSnapshot(), existing = recallDecks(snapshot).find(deck => deck.deckName === deckName);
        if (existing) deckIds.set(deckName, existing.id);
        else { const id = crypto.randomUUID(); const saved = repository.execute({ ...context(), type: 'saveRecallPreferences', id, expectedVersion: 0, deckName, options: recallOptions(snapshot) }); onSaved(saved); deckIds.set(deckName, id); }
      }
      let batch: RecallImportItem[] = [], size = 0, handled = 0;
      const commit = async () => { if (!batch.length || stopped.current) return; await execute({ ...context(), type: 'importRecallCards', updateUnedited: target.updateUnedited, items: batch }); handled += batch.length; batch = []; size = 0; setNotice(`카드 ${handled} / ${preview.items.length}개를 처리했습니다. 기존 답변과 복습 이력은 유지합니다.`); };
      for (const source of preview.items) {
        if (stopped.current) break;
        const item = { ...source, id: crypto.randomUUID(), topicId: target.topicId, deckId: target.keepDecks ? deckIds.get(source.source.deck) : target.deckId === 'default' ? undefined : target.deckId };
        const length = JSON.stringify(item).length;
        if (batch.length && (batch.length >= 100 || size + length > 500000)) await commit();
        if (stopped.current) break;
        batch.push(item); size += length;
      }
      await commit();
      setNotice(stopped.current ? `가져오기를 중단했습니다. 처리한 ${handled}개는 남아 있습니다. 같은 파일을 다시 선택하면 이어서 가져올 수 있습니다.` : `카드 ${handled}개를 처리했습니다. 새 카드를 추가하고 이미 가져온 카드는 선택한 기준대로 유지했습니다. ${preview.skipped.length}개는 지원 범위 밖이어서 가져오지 않았습니다.`);
    } catch (e) { setError(e instanceof Error ? e.message : '카드를 저장하지 못했습니다. 같은 파일을 다시 선택해 이어갈 수 있습니다.'); }
    finally { setBusy(false); }
  };
  const sourceKeys = new Set((data.recallCards ?? []).filter(card => card.importSource).map(card => card.importSource!.key));
  const existing = preview?.items.filter(item => sourceKeys.has(item.source.key)).length ?? 0;
  return <details className="recall-card-settings"><summary>Anki 파일 가져오기</summary>
    <p className="muted">.apkg의 질문·답변과 빈칸 카드를 가져옵니다. Anki에서 호환 형식으로 내보낸 파일과 현재 형식을 읽습니다. 그림·음성·이미지 가리기·플러그인 전용 서식은 그대로 재현하지 못합니다. 원본 파일은 변경하지 않습니다.</p>
    <Input label="Anki 파일 선택" type="file" accept=".apkg" disabled={disabled || busy || !!session.pendingImport} onChange={e => { void read(e.target.files?.[0]); e.target.value = ''; }} />
    {reading && <div className="actions"><p role="status">{name}의 카드를 읽고 있습니다.</p><Button onClick={() => { worker.current?.terminate(); worker.current = null; setReading(false); setNotice('파일 읽기를 취소했습니다.'); }}>파일 읽기 취소</Button></div>}
    <Select label="가져올 카드의 공부 주제" disabled={disabled || busy} value={target.topicId} onChange={e => change({ topicId: e.target.value })}>{!topics.length && <option value="">먼저 공부 주제를 등록해 주세요</option>}{topics.map(topic => <option key={topic.id} value={topic.id}>{data.subjects.find(subject => subject.id === topic.subjectId)?.name} / {topic.name}</option>)}</Select>
    <Checkbox label="Anki의 덱 이름별로 나누어 가져오기" checked={target.keepDecks} disabled={disabled || busy} onChange={e => change({ keepDecks: e.target.checked })} />
    {!target.keepDecks && <Select label="가져올 덱" value={target.deckId} disabled={disabled || busy} onChange={e => change({ deckId: e.target.value })}><option value="default">기본 덱</option>{recallDecks(data).map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)}</Select>}
    <Checkbox label="이전에 가져온 뒤 직접 수정하지 않은 카드만 새 원문으로 갱신" checked={target.updateUnedited} disabled={disabled || busy} onChange={e => change({ updateUnedited: e.target.checked })} />
    <p className="muted">기본값은 기존 카드를 유지합니다. 갱신해도 현재 덱·답변·복습 날짜·이력은 유지하며, 직접 고친 질문과 답변은 덮어쓰지 않습니다. 파일 속 타인의 공부 이력은 가져오지 않고 새 카드로 시작합니다.</p>
    {preview && <><p role="status">{name} · 전체 {preview.total}개 · 읽을 수 있는 카드 {preview.items.length}개 · 이미 가져온 카드 {existing}개 · 지원하지 않는 카드 {preview.skipped.length}개</p>
      <details><summary>가져오기 전 카드 확인</summary>{preview.items.slice(0, 10).map(item => <article key={item.source.key}><p>{item.source.deck} · {item.front}</p><details><summary>답변 확인</summary><p>{item.reference}</p></details></article>)}{preview.items.length > 10 && <p className="muted">처음 10개를 표시했습니다. 나머지 카드도 같은 저장 기준으로 처리합니다.</p>}</details>
      {!!preview.skipped.length && <details><summary>가져올 수 없는 카드 확인</summary>{occurrenceRows(preview.skipped.slice(0, 50), item => JSON.stringify(item)).map(({value: item, key}) => <p key={key}>{item.key} · {item.reason}</p>)}{preview.skipped.length > 50 && <p>처음 50개를 표시했습니다. 원본 파일에 모든 카드가 남아 있습니다.</p>}</details>}
      {preview.warnings.map(warning => <p key={warning} role="status">{warning}</p>)}
      {(!!preview.skipped.length || !!preview.warnings.length) && <Checkbox label="표시된 제한을 확인했습니다. 읽을 수 있는 텍스트 카드만 가져옵니다" checked={acknowledged} disabled={busy} onChange={e => setAcknowledged(e.target.checked)} />}
      <div className="actions"><Button disabled={disabled || busy || !!session.pendingImport || !preview.items.length || !target.topicId || (!!preview.skipped.length || !!preview.warnings.length) && !acknowledged} onClick={() => { void start(); }}>확인한 카드 가져오기</Button>{busy && <Button onClick={() => { stopped.current = true; }}>가져오기 중단</Button>}</div></>}
    {session.pendingImport && <div className="actions"><p role="status">중단 전에 보존한 가져오기 요청이 있습니다. 같은 요청을 다시 저장해도 중복 카드가 생기지 않습니다.</p><Button disabled={disabled || busy} onClick={async () => { setBusy(true); try { await execute(session.pendingImport!); setError(''); setNotice('보존한 요청을 처리했습니다. 같은 파일을 다시 선택해 나머지를 이어갈 수 있습니다.'); } catch (e) { setError(e instanceof Error ? e.message : '요청을 저장하지 못했습니다.'); } finally { setBusy(false); } }}>보존한 가져오기 다시 시도</Button></div>}
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </details>;
}
