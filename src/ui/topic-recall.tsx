import { useEffect, useRef, useState } from 'react';
import type { AppState, MemoStroke } from '../domain/model';
import { freshRecall, nextRecall, recallPath, recallTopics, type RecallSession } from '../domain/topic-recall';
import { readRecall, saveRecallMemo, writeRecall, type RecallRepository } from '../data/topic-recall';
import { Button, Card, EmptyState, ErrorState, Select, Textarea } from './index';
import { MemoInkPad } from './memo-ink-pad';
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
  const topics = recallTopics(data, subjectIds, session);
  const topic = topics.find(row => row.id === session.currentId);
  const subjects = data.subjects.filter(row => !row.deletedAt && subjectIds.includes(row.id));
  const units = data.nodes.filter(row => !row.deletedAt && row.role === 'unit' && subjects.some(subject => subject.id === row.subjectId)
    && (session.subjectId === 'all' || row.subjectId === session.subjectId));
  const draft = topic ? session.drafts[topic.id] : undefined;
  const persist = (next: RecallSession) => {
    try { writeRecall(data, next); setSession(next); setError(''); return true; }
    catch (error) { setError(`${message(error)} 전환을 멈췄습니다. 입력한 글은 이 화면에 남아 있습니다.`); return false; }
  };
  const hasAnswer = Boolean(draft?.body.trim() || draft?.strokes?.length);
  const changeInk = (strokes: MemoStroke[]) => {
    if (!topic) return;
    const next = { ...session, drafts: { ...session.drafts, [topic.id]: { ...draft, memoId: draft?.memoId ?? crypto.randomUUID(), body: draft?.body ?? '', strokes } } };
    setSession(next); persist(next); setNotice('');
  };
  const candidatesKey = topics.map(row => row.id).join('|');
  useEffect(() => {
    if (loaded.error || topic || !topics.length) return;
    persist(nextRecall({ ...session, currentId: null }, topics));
  }, [candidatesKey, session.currentId, loaded.error]); // Normalize only missing/removed cards, never typing.
  const changeRange = (subjectId: string, unitId: string) => {
    if (composition.current || drawing) return;
    const next = { ...session, subjectId, unitId, currentId: null, seen: [], round: 1 };
    if (persist(nextRecall(next, recallTopics(data, subjectIds, next)))) setNotice('선택한 범위의 주제로 바꿨습니다.');
  };
  const advance = (save: boolean, separate = false) => {
    if (!topic || composition.current || drawing) return;
    try {
      let next = session;
      if (save && draft) {
        const savedDraft = separate ? { ...draft, memoId: crypto.randomUUID() } : draft;
        if (separate) { next = { ...session, drafts: { ...session.drafts, [topic.id]: savedDraft } }; if (!persist(next)) return; }
        const saved = saveRecallMemo(repository, topic.id, savedDraft); onSaved(saved);
        const drafts = { ...next.drafts }; delete drafts[topic.id]; next = { ...next, drafts };
      }
      if (persist(nextRecall(next, topics))) {
        setNotice(save ? '메모를 저장했습니다.' : hasAnswer ? '작성한 메모는 초안에 남아 있습니다.' : '다음 주제로 넘어갔습니다.');
        bodyRef.current?.focus();
      }
    } catch (error) { setError(message(error)); }
  };
  if (loaded.error) return <ErrorState title="주제 카드 초안을 열지 못했습니다" message={loaded.error} onRetry={() => {
    try { const recovered = readRecall(data); setSession(recovered); setLoaded({ session: recovered, error: '' }); }
    catch (error) { setLoaded(value => ({ ...value, error: message(error) })); }
  }} />;
  const prior = topic ? (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === topic.id && memo.id !== draft?.memoId)
    .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];
  return <section className="topic-recall" aria-label="주제 카드로 설명하기">

    <div className="recall-filters">
      <Select label="과목" value={session.subjectId} disabled={composing || drawing} onChange={event => changeRange(event.target.value, 'all')}>
        <option value="all">모든 과목</option>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
        {!subjects.some(row => row.id === session.subjectId) && session.subjectId !== 'all' && <option value={session.subjectId}>범위 밖 과목 · 다른 과목을 골라 주세요</option>}
      </Select>
      <Select label="단원" value={session.unitId} disabled={composing || drawing} onChange={event => changeRange(session.subjectId, event.target.value)}>
        <option value="all">모든 단원</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)}
        {!units.some(row => row.id === session.unitId) && session.unitId !== 'all' && <option value={session.unitId}>범위 밖 단원 · 다른 단원을 골라 주세요</option>}
      </Select>
    </div>
    {topic ? <>
      <Card className="recall-topic" aria-label="현재 주제 카드">
        <p className="muted recall-path">{[subjects.find(row => row.id === topic.subjectId)?.name, ...recallPath(data.nodes, topic.id).slice(0, -1).map(row => row.name)].filter(Boolean).join(' / ')}</p>
        <div className="recall-topic-heading">
          <h2>{topic.name}</h2>
          <span className="recall-progress" aria-label={`전체 ${topics.length}개 중 ${session.seen.filter(id => topics.some(row => row.id === id)).length + 1}번째 주제`}>{session.seen.filter(id => topics.some(row => row.id === id)).length + 1} / {topics.length}</span>
        </div>
      </Card>
      <div className="recall-editor">
        <MemoInkPad key={topic.id} strokes={draft?.strokes ?? []} onChange={changeInk} onDrawing={setDrawing} />
        <details className="recall-text-toggle" key={topic.id}>
          <summary>글로 쓰기{draft?.body && <span className="recall-draft-indicator">작성한 글 있음</span>}</summary>
        <Textarea ref={bodyRef} label="글" rows={3} value={draft?.body ?? ''} placeholder="기억나는 내용을 적어 보세요."
          onCompositionStart={() => { composition.current = true; setComposing(true); }} onCompositionEnd={() => { composition.current = false; setComposing(false); }}
          onChange={event => {
            const next = { ...session, drafts: { ...session.drafts, [topic.id]: { ...draft, memoId: draft?.memoId ?? crypto.randomUUID(), body: event.target.value } } };
            setSession(next); persist(next); setNotice('');
          }} />
        </details>
        <div className="actions recall-actions">
          <Button variant="primary" disabled={composing || drawing || !hasAnswer} onClick={() => advance(true)}>저장하고 다음</Button>
          <Button disabled={composing || drawing} onClick={() => advance(false)}>건너뛰기</Button>
        </div>
      </div>
      {prior.length > 0 && <details className="recall-history" key={topic.id}>
        <summary>이전 메모 {prior.length}개</summary>
        {prior.map(memo => <article key={memo.id}><a href={`#/memos/${memo.id}`}>메모 열기 · {new Date(memo.createdAt).toLocaleString('ko-KR')}</a><p>{memo.body || '그림 메모'}</p></article>)}
      </details>}
    </> : <EmptyState title="이 범위에 등록된 주제가 없습니다" message="다른 과목·단원을 고르거나 과목에서 공부 주제를 추가해 주세요."><a href="#/subjects">과목 보기</a></EmptyState>}
    {error && <div role="alert"><p>{error}</p><div className="actions"><Button onClick={() => persist(session)}>초안 저장 다시 시도</Button>{topic && hasAnswer && <Button onClick={() => advance(true, true)}>별도 메모로 저장 후 다음</Button>}</div></div>}
    {notice && <p role="status">{notice}</p>}
    <details className="recall-note"><summary>사용 안내</summary><p className="muted">{session.round}회차 · 주제는 한 번씩 무작위로 나옵니다. 글과 그림은 이 기기의 초안에 남고, 저장하면 현재 주제의 메모가 됩니다. 저장하거나 건너뛰어도 공부 완료·정답으로 집계하지 않습니다.</p></details>
  </section>;
}
