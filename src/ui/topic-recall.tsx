import { useEffect, useRef, useState } from 'react';
import type { AppState, MemoStroke } from '../domain/model';
import { freshRecall, nextRecall, recallPath, recallTopics, type RecallSession } from '../domain/topic-recall';
import { readRecall, saveRecallMemo, writeRecall, type RecallRepository } from '../data/topic-recall';
import { Button, Card, EmptyState, ErrorState, Select, Textarea } from './index';
import { MemoInkPad } from './memo-ink-pad';
import { intervalLabel, recallCard, recallOptions, recallPreview, recallQueue, RECALL_GRADES, RECALL_LABELS } from '../domain/recall-scheduler';
import { RecallSettings } from './recall-settings';
import { Input } from './index';
import './topic-recall.css';

type Props = { data: AppState; repository: RecallRepository; onSaved: (data: AppState) => void; subjectIds: string[] };
const message = (error: unknown) => error instanceof Error ? error.message : '저장하지 못했습니다. 입력한 글은 이 화면에 남아 있습니다.';
export function TopicRecall({ data, repository, onSaved, subjectIds }: Props) {
  const [loaded, setLoaded] = useState(() => {
    try { return { session: readRecall(data), error: '' }; }
    catch (error) { return { session: freshRecall(), error: message(error) }; }
  });
  const [session, setSession] = useState<RecallSession>(loaded.session);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [composing, setComposing] = useState(false), [drawing, setDrawing] = useState(false);
  const composition = useRef(false), bodyRef = useRef<HTMLTextAreaElement>(null);
  const [now, setNow] = useState(() => new Date().toISOString());
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const scheduled = session.mode === 'scheduled';
  const schedulingReady = !repository.getCapabilities || repository.getCapabilities().includes('reviewRecallCard');
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date().toISOString()), 15000); return () => window.clearInterval(timer); }, []);
  const topics = recallTopics(data, subjectIds, session);
  const queue = recallQueue(data, topics, now);
  const available = [...queue.due, ...queue.fresh];
  const topic = topics.find(row => row.id === session.currentId);
  const subjects = data.subjects.filter(row => !row.deletedAt && subjectIds.includes(row.id));
  const units = data.nodes.filter(row => !row.deletedAt && row.role === 'unit' && subjects.some(subject => subject.id === row.subjectId)
    && (session.subjectId === 'all' || row.subjectId === session.subjectId));
  const draft = topic ? session.drafts[topic.id] : undefined;
  const persist = (next: RecallSession) => {
    try { writeRecall(data, next); setSession(next); setError(''); return true; }
    catch (error) { setError(`${message(error)} 전환을 멈췄습니다. 입력한 글은 이 화면에 남아 있습니다.`); return false; }
  };
  const card = topic ? recallCard(data, topic.id) : undefined;
  const nextSession = (current: RecallSession, snapshot = data): RecallSession => {
    if (current.mode !== 'scheduled') return nextRecall(current, recallTopics(snapshot, subjectIds, current));
    const pool = recallTopics(snapshot, subjectIds, current), q = recallQueue(snapshot, pool, new Date().toISOString());
    const seen = [...new Set([...current.seen, ...(current.currentId ? [current.currentId] : [])])];
    // Due learning cards may return when their minute-based step expires. Skipped cards wait for restart.
    const ready = [...q.due, ...q.fresh].filter(row => !(current.skipped ?? []).includes(row.id) && (!seen.includes(row.id) || q.due.includes(row)));
    return { ...current, currentId: ready[0]?.id ?? null, seen, pendingReview: undefined };
  };
  const blocked = composing || drawing || !!session.pendingReview;
  const hasAnswer = Boolean(draft?.body.trim() || draft?.strokes?.length);
  const changeInk = (strokes: MemoStroke[]) => {
    if (!topic) return;
    const next = { ...session, drafts: { ...session.drafts, [topic.id]: { ...draft, memoId: draft?.memoId ?? crypto.randomUUID(), body: draft?.body ?? '', strokes } } };
    setSession(next); persist(next); setNotice('');
  };
  const candidatesKey = topics.map(row => row.id).join('|');
  useEffect(() => {
    if (loaded.error || topic || !topics.length) return;
    const eligible = scheduled ? available.filter(row => !(session.skipped ?? []).includes(row.id) && (!session.seen.includes(row.id) || queue.due.includes(row))) : topics;
    if (!eligible.length) return;
    persist(scheduled ? { ...session, currentId: eligible[0].id } : nextRecall({ ...session, currentId: null }, topics));
  }, [candidatesKey, session.currentId, loaded.error, scheduled, now, data.recallCards, data.recallPreferences]); // Normalize only missing/removed cards, never typing.
  const changeRange = (subjectId: string, unitId: string) => {
    if (composition.current || drawing || session.pendingReview) return;
    const next = { ...session, subjectId, unitId, currentId: null, seen: [], skipped: [], round: 1 };
    if (persist(nextSession(next))) setNotice('선택한 범위의 주제로 바꿨습니다.');
  };
  const advance = (save: boolean, separate = false) => {
    if (!topic || composition.current || drawing || session.pendingReview) return;
    try {
      let next = session, snapshot = data;
      if (save && draft) {
        const savedDraft = separate ? { ...draft, memoId: crypto.randomUUID() } : draft;
        if (separate) { next = { ...session, drafts: { ...session.drafts, [topic.id]: savedDraft } }; if (!persist(next)) return; }
        const saved = saveRecallMemo(repository, topic.id, savedDraft); onSaved(saved); snapshot = saved;
        const drafts = { ...next.drafts }; delete drafts[topic.id]; next = { ...next, drafts };
      }
      if (scheduled) next = { ...next, skipped: [...new Set([...(next.skipped ?? []), topic.id])] };
      if (persist(nextSession(next, snapshot))) {
        setNotice(save ? scheduled ? '메모를 저장했습니다. 복습 날짜는 바꾸지 않았습니다.' : '메모를 저장했습니다.' : hasAnswer ? '작성한 메모는 초안에 남아 있습니다.' : '다음 주제로 넘어갔습니다.');
        bodyRef.current?.focus();
      }
    } catch (error) { setError(message(error)); }
  };
  const review = (rating: 1 | 2 | 3 | 4) => {
    if (!topic || composition.current || drawing || !schedulingReady) return;
    try {
      const snapshot = repository.getSnapshot();
      const command = session.pendingReview ?? { type: 'reviewRecallCard' as const, id: card?.id ?? crypto.randomUUID(), topicId: topic.id,
        expectedVersion: card?.version ?? 0, rating, ...(hasAnswer && draft ? { memo: { id: draft.memoId, body: draft.body, strokes: draft.strokes ?? [] } } : {}),
        opId: crypto.randomUUID(), at: now, userId: snapshot.userId, namespace: snapshot.namespace };
      const pending = { ...session, pendingReview: command }; if (!persist(pending)) return;
      const saved = repository.execute(command); onSaved(saved);
      const drafts = { ...session.drafts }; delete drafts[topic.id];
      if (persist(nextSession({ ...pending, drafts }, saved))) { setRevealedId(null); setNow(new Date().toISOString()); setNotice('설명과 자기 평가를 저장하고 다음 복습을 예약했습니다.'); }
    } catch (e) { setError(message(e)); }
  };
  const saveReference = () => {
    if (!topic || blocked || !schedulingReady) return;
    try {
      const reference = session.references?.[topic.id]; if (!reference) return;
      const snapshot = repository.getSnapshot();
      const existing = recallCard(snapshot, topic.id);
      const saved = existing?.id === reference.cardId && existing.reference === reference.body ? snapshot : repository.execute({ type: 'saveRecallReference', id: reference.cardId, topicId: topic.id, reference: reference.body, expectedVersion: reference.expectedVersion,
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
      onSaved(saved); const references = { ...session.references }; delete references[topic.id]; persist({ ...session, references }); setNotice('참고 설명을 저장했습니다.');
    } catch (e) { setError(message(e)); }
  };
  const setDue = () => {
    if (!topic || blocked || !schedulingReady || !dueDate) return;
    try {
      const due = new Date(`${dueDate}T00:00:00`); if (!Number.isFinite(due.getTime())) throw new Error('복습 날짜를 확인해 주세요.');
      const snapshot = repository.getSnapshot(), existing = recallCard(snapshot, topic.id);
      const saved = repository.execute({ type: 'setRecallDue', id: existing?.id ?? crypto.randomUUID(), topicId: topic.id, expectedVersion: existing?.version ?? 0, due: due.toISOString(),
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
      onSaved(saved); persist(nextSession(session, saved)); setNotice('선택한 날짜로 복습을 예약했습니다. 자기 평가 기록은 추가하지 않았습니다.'); setDueDate('');
    } catch (e) { setError(message(e)); }
  };
  const preview = topic ? recallPreview(card?.memory, now, recallOptions(data)) : null;
  if (loaded.error) return <ErrorState title="주제 카드 초안을 열지 못했습니다" message={loaded.error} onRetry={() => {
    try { const recovered = readRecall(data); setSession(recovered); setLoaded({ session: recovered, error: '' }); }
    catch (error) { setLoaded(value => ({ ...value, error: message(error) })); }
  }} />;
  const prior = topic ? (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === topic.id && memo.id !== draft?.memoId)
    .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
  return <section className="topic-recall" aria-label="주제 카드로 설명하기">

    <div className="recall-mode actions">
      <Button disabled={blocked} aria-pressed={scheduled} onClick={() => { persist(nextSession({ ...session, mode: 'scheduled', currentId: null, seen: [], skipped: [] })); setRevealedId(null); }}>예약 복습</Button>
      <Button disabled={blocked} aria-pressed={!scheduled} onClick={() => { persist(nextSession({ ...session, mode: 'random', currentId: null, seen: [], skipped: [] })); setRevealedId(null); }}>무작위 연습</Button>
      {scheduled && <span className="muted">복습 {queue.due.length} · 새 주제 {queue.fresh.length}</span>}
    </div>
    {!schedulingReady && <p role="status">서버의 복습 기능을 연결하는 중입니다. 메모 작성과 무작위 연습을 사용할 수 있습니다.</p>}
    <div className="recall-filters">
      <Select label="과목" value={session.subjectId} disabled={blocked} onChange={event => changeRange(event.target.value, 'all')}>
        <option value="all">모든 과목</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
        {!subjects.some(row => row.id === session.subjectId) && session.subjectId !== 'all' && <option value={session.subjectId}>범위 밖 과목 · 다른 과목을 골라 주세요</option>}
      </Select>
      <Select label="단원" value={session.unitId} disabled={blocked} onChange={event => changeRange(session.subjectId, event.target.value)}>
        <option value="all">모든 단원</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
        {!units.some(row => row.id === session.unitId) && session.unitId !== 'all' && <option value={session.unitId}>범위 밖 단원 · 다른 단원을 골라 주세요</option>}
      </Select>
    </div>
    {topic ? <>
      <Card className="recall-topic" aria-label="현재 주제 카드">
        <p className="muted recall-path">{[subjects.find(row => row.id === topic.subjectId)?.name, ...recallPath(data.nodes, topic.id).slice(0, -1).map(row => row.name)].filter(Boolean).join(' / ')}</p>
        <div className="recall-topic-heading">
          <h2>{topic.name}</h2>
          <span className="recall-progress" aria-label={`전체 ${topics.length}개 중 ${Math.min(topics.length, session.seen.filter(id => topics.some(row => row.id === id)).length + 1)}번째 주제`}>{Math.min(topics.length, session.seen.filter(id => topics.some(row => row.id === id)).length + 1)} / {topics.length}</span>
        </div>
      </Card>
      <div className="recall-editor">
        <MemoInkPad key={`ink:${topic.id}`} strokes={draft?.strokes ?? []} onChange={changeInk} onDrawing={setDrawing} />
        <details className="recall-text-toggle" key={`text:${topic.id}`}>
          <summary>글로 쓰기{draft?.body && <span className="recall-draft-indicator">작성한 글 있음</span>}</summary>
        <Textarea ref={bodyRef} label="글" rows={3} value={draft?.body ?? ''} placeholder="기억나는 내용을 적어 보세요."
          onCompositionStart={() => { composition.current = true; setComposing(true); }} onCompositionEnd={() => { composition.current = false; setComposing(false); }}
          onChange={event => {
            const next = { ...session, drafts: { ...session.drafts, [topic.id]: { ...draft, memoId: draft?.memoId ?? crypto.randomUUID(), body: event.target.value } } };
            setSession(next); persist(next); setNotice('');
          }} />
        </details>
        <div className="actions recall-actions">
          <Button variant={scheduled ? "secondary" : "primary"} disabled={blocked || !hasAnswer} onClick={() => advance(true)}>{scheduled ? "메모만 저장하고 다음" : "저장하고 다음"}</Button>
          <Button disabled={blocked} onClick={() => advance(false)}>건너뛰기</Button>
        </div>
      </div>
      {scheduled && <div className="recall-rating">
        {revealedId !== topic.id ? <Button variant="primary" disabled={blocked || !schedulingReady} onClick={() => setRevealedId(topic.id)}>설명 확인하고 평가</Button> : <>
          <div className="recall-reference"><h3>참고 설명</h3><p>{card?.reference || '저장된 참고 설명이 없습니다. 자료와 비교한 뒤 기억해 낸 정도를 직접 골라 주세요.'}</p></div>
          <div className="recall-grade-buttons">{RECALL_GRADES.map(rating => <Button key={rating} disabled={blocked || !schedulingReady} onClick={() => review(rating)}>
            {RECALL_LABELS[rating - 1]}<span>{preview && intervalLabel(preview[rating].card.due, now)}</span>
          </Button>)}</div>
          <p className="muted">다시: 떠올리지 못함 · 어려움: 떠올렸지만 힘들었음 · 알맞음: 떠올림 · 쉬움: 바로 떠올림. 메모 없이도 자기 평가를 남길 수 있습니다.</p>
        </>}
        {session.pendingReview && <div className="actions"><Button onClick={() => review(session.pendingReview!.rating)}>자기 평가 저장 다시 시도</Button>
          {!data.appliedOps[session.pendingReview.opId] && <Button onClick={() => { if (!repository.getSnapshot().appliedOps[session.pendingReview!.opId] && persist({ ...session, pendingReview: undefined })) { setRevealedId(null); setNotice('저장되지 않은 평가를 취소했습니다. 설명 초안은 남아 있습니다.'); } }}>평가 취소하고 초안 유지</Button>}
        </div>}
      </div>}
      <details className="recall-card-settings" key={`reference:${topic.id}`}><summary>카드 내용·날짜</summary>
        <Textarea label="참고 설명 입력" value={session.references?.[topic.id]?.body ?? card?.reference ?? ''} rows={4}
          disabled={drawing || !!session.pendingReview || !schedulingReady} onCompositionStart={() => { composition.current = true; setComposing(true); }} onCompositionEnd={() => { composition.current = false; setComposing(false); }}
          onChange={e => { const old = session.references?.[topic.id]; const next = { ...session, references: { ...session.references, [topic.id]: { body: e.target.value, cardId: old?.cardId ?? card?.id ?? crypto.randomUUID(), expectedVersion: old?.expectedVersion ?? card?.version ?? 0 } } }; setSession(next); persist(next); }} />
        <Button disabled={blocked || !schedulingReady || !session.references?.[topic.id]} onClick={saveReference}>참고 설명 저장</Button>
        <p className="muted">주제 이름이 카드 앞면이고, 입력한 참고 설명은 확인할 때 보입니다. 이전 답변 메모는 그대로 남습니다.</p>
        <div className="recall-due-field"><Input label="다음 복습 날짜" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /><Button disabled={blocked || !schedulingReady || !dueDate} onClick={setDue}>날짜 지정</Button></div>
        {card && (card.memory.state === 0 && !card.manualDue ? <p className="muted">새 주제 · 아직 자기 평가를 남기지 않았습니다.</p> : <p className="muted">다음 복습: {new Date(card.manualDue ?? card.memory.due).toLocaleString('ko-KR')} · 자기 평가 {card.reviews.length}회</p>)}
        {!!card?.reviews.length && <details><summary>자기 평가 기록</summary>{[...card.reviews].reverse().map(row => <p key={row.id}>{new Date(row.at).toLocaleString('ko-KR')} · {RECALL_LABELS[row.rating - 1]} · 다음 {new Date(row.after.due).toLocaleString('ko-KR')}{row.memoId && <> · <a href={`#/memos/${row.memoId}`}>답변 메모</a></>}</p>)}</details>}
      </details>
      {prior.length > 0 && <details className="recall-history" key={topic.id}>
        <summary>이전 메모 {prior.length}개</summary>
        {prior.map(memo => <article key={memo.id}><a href={`#/memos/${memo.id}`}>메모 열기 · {new Date(memo.createdAt).toLocaleString('ko-KR')}</a><p>{memo.body || '그림 메모'}</p></article>)}
      </details>}
    </> : <EmptyState title={topics.length && scheduled ? "지금 복습할 주제가 없습니다" : "이 범위에 등록된 주제가 없습니다"} message={topics.length && scheduled ? `${queue.nextDue ? `다음 복습은 ${new Date(queue.nextDue).toLocaleString('ko-KR')}입니다. ` : ''}새 주제는 하루 설정 수만큼 나옵니다. 건너뛴 주제를 다시 열거나 무작위 연습을 선택할 수 있습니다.` : "다른 과목·단원을 고르거나 과목에서 공부 주제를 추가해 주세요."}><a href="#/subjects">과목 보기</a>{topics.length > 0 && scheduled && <Button disabled={blocked} onClick={() => persist(nextSession({ ...session, currentId: null, seen: [], skipped: [] }))}>건너뛴 주제 다시 보기</Button>}</EmptyState>}
    {error && <div role="alert"><p>{error}</p><div className="actions"><Button onClick={() => persist(session)}>초안 저장 다시 시도</Button>{topic && hasAnswer && <Button onClick={() => advance(true, true)}>별도 메모로 저장 후 다음</Button>}</div></div>}
    {notice && <p role="status">{notice}</p>}
    <RecallSettings data={data} repository={repository} onSaved={onSaved} disabled={blocked || !schedulingReady} />
    <details className="recall-note"><summary>사용 안내</summary><p className="muted">{session.round}회차 · 예약 복습은 예정된 주제와 하루 새 주제를 보여 주고, 무작위 연습은 주제를 한 번씩 섞어 보여 줍니다. 자기 평가는 복습 간격만 정합니다. 글과 그림은 이 기기의 초안에 남고, 저장하면 현재 주제의 메모가 됩니다. 저장하거나 건너뛰어도 공부 완료·정답으로 집계하지 않습니다.</p></details>
  </section>;
}
