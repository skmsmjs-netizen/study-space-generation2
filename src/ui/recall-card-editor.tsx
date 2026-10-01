import { useRef, useState } from 'react';
import type { AppState, OutlineNode, Command } from '../domain/model';
import type { RecallSession } from '../domain/topic-recall';
import { clozeNumbers, renderCloze } from '../domain/recall-cloze';
import { recallDecks } from '../domain/recall-scheduler';
import type { RecallRepository } from '../data/topic-recall';
import { Button, Input, Select, Textarea } from './index';

type Props = { data: AppState; topics: OutlineNode[]; repository: RecallRepository; session: RecallSession;
  persist: (session: RecallSession) => boolean; onSaved: (data: AppState) => void; disabled: boolean };
export function RecallCardEditor({ data, topics, repository, session, persist, onSaved, disabled }: Props) {
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [search, setSearch] = useState(''), [limit, setLimit] = useState(20);
  const text = useRef<HTMLTextAreaElement>(null), composing = useRef(false), [composition, setComposition] = useState(false);
  const draft = session.registration, decks = recallDecks(data);
  const change = (values: Partial<NonNullable<RecallSession['registration']>>) => {
    persist({ ...session, registration: { id: crypto.randomUUID(), topicId: topics[0]?.id ?? '', front: '', reference: '', deckId: session.deckId !== 'all' && session.deckId !== 'default' ? session.deckId : undefined, ...draft, ...values } });
  };
  let numbers: number[] = [], parseError = '';
  if (draft?.kind === 'cloze') try { numbers = clozeNumbers(draft.front); } catch (e) { parseError = e instanceof Error ? e.message : '빈칸 문장을 확인해 주세요.'; }
  const save = () => {
    if (!draft || disabled || composing.current) return;
    try {
      const snapshot = repository.getSnapshot(), context = { opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace };
      let saved = snapshot;
      if (draft.kind === 'cloze') {
        const ordinals = clozeNumbers(draft.front);
        if (!ordinals.length) throw Error('빈칸을 {{c1::정답}}처럼 표시하거나 문장을 선택해 빈칸으로 만들어 주세요.');
        const cards = [...(draft.clozeCards ?? [])];
        for (const number of ordinals) if (!cards.some(card => card.number === number)) cards.push({ id: crypto.randomUUID(), number, expectedVersion: 0 });
        if (!persist({ ...session, registration: { ...draft, clozeCards: cards } })) return;
        const already = cards.every(item => { const old = snapshot.recallCards?.find(c => c.id === item.id); return old && old.cloze?.noteId === draft.id && (ordinals.includes(item.number) ? !old.suspended && old.cloze.source === draft.front && old.reference === draft.reference && old.deckId === draft.deckId : old.suspended); });
        if (!already) saved = repository.execute({ ...context, type: 'saveRecallCloze', noteId: draft.id, topicId: draft.topicId, source: draft.front, reference: draft.reference, deckId: draft.deckId, cards });
      } else {
        const old = snapshot.recallCards?.find(card => card.id === draft.id);
        const already = old && !old.deletedAt && old.front === draft.front && old.reference === draft.reference && old.topicId === draft.topicId && old.deckId === draft.deckId;
        if (!already) saved = repository.execute({ ...context, type: 'saveRecallCard', id: draft.id, topicId: draft.topicId, front: draft.front, reference: draft.reference, deckId: draft.deckId, expectedVersion: draft.expectedVersion ?? 0 });
      }
      onSaved(saved);
      if (persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '', kind: draft.kind, deckId: draft.deckId } })) { setError(''); setNotice('질문 카드를 저장했습니다. 카드마다 복습 날짜와 답변을 따로 기록합니다.'); }
    } catch (e) { setError(e instanceof Error ? e.message : '카드를 저장하지 못했습니다. 초안은 남아 있습니다.'); }
  };
  const topicIds = new Set(topics.map(topic => topic.id));
  const availableCards = (data.recallCards ?? []).filter(card => !card.deletedAt && card.front !== undefined && topicIds.has(card.topicId) && (session.deckId === undefined || session.deckId === 'all' || (card.deckId ?? 'default') === session.deckId) );
  const cards = availableCards.filter(card => !search.trim() || `${card.front}\n${card.reference}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const setStatus = (id: string, suspended: boolean) => {
    try { const snapshot = repository.getSnapshot(), card = snapshot.recallCards!.find(c => c.id === id)!;
      onSaved(repository.execute({ type: 'setRecallCardStatus', id, expectedVersion: card.version, suspended, deckId: card.deckId, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })); setError('');
    } catch (e) { setError(e instanceof Error ? e.message : '카드 상태를 저장하지 못했습니다.'); }
  };
  const inputProps = { disabled, onCompositionStart: () => { composing.current = true; setComposition(true); }, onCompositionEnd: () => { composing.current = false; setComposition(false); } };
  return <details className="recall-card-settings"><summary>질문 카드 만들기·수정</summary>
    <p className="muted">공부 주제를 고르고 질문과 참고 답변을 입력합니다. 한 주제에 여러 질문을 만들 수 있습니다.</p>
    <Select label="카드 종류" disabled={disabled || composition || !!draft?.expectedVersion || !!draft?.clozeCards?.some(c => c.expectedVersion > 0)} value={draft?.kind ?? 'basic'} onChange={e => change({ kind: e.target.value as 'basic' | 'cloze' })}>
      <option value="basic">질문·답변</option><option value="cloze">빈칸</option>
    </Select>
    <Select label="카드의 공부 주제" disabled={disabled || composition || !!draft?.expectedVersion || !!draft?.clozeCards?.some(c => c.expectedVersion > 0)} value={draft?.topicId ?? topics[0]?.id ?? ''} onChange={e => change({ topicId: e.target.value })}>
      {!topics.length && <option value="">먼저 공부 주제를 등록해 주세요</option>}
      {topics.map(topic => <option key={topic.id} value={topic.id}>{data.subjects.find(s => s.id === topic.subjectId)?.name} / {topic.name}</option>)}
      {draft?.topicId && !topics.some(topic => topic.id === draft.topicId) && <option value={draft.topicId}>현재 범위 밖 주제</option>}
    </Select>
    <Select label="카드의 덱" disabled={disabled || composition} value={draft ? draft.deckId ?? 'default' : session.deckId !== 'all' ? session.deckId ?? 'default' : 'default'} onChange={e => change({ deckId: e.target.value === 'default' ? undefined : e.target.value })}>
      <option value="default">기본 덱</option>{decks.map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)}
    </Select>
    <Textarea ref={text} label={draft?.kind === 'cloze' ? '빈칸 문장' : '질문 (앞면)'} rows={3} value={draft?.front ?? ''} onChange={e => change({ front: e.target.value })} {...inputProps} />
    {draft?.kind === 'cloze' && <><Button disabled={disabled || composition} onClick={() => {
      const start = text.current?.selectionStart ?? 0, end = text.current?.selectionEnd ?? 0;
      if (start === end) { setError('문장에서 가릴 부분을 먼저 선택해 주세요.'); return; }
      const number = Math.max(0, ...numbers) + 1;
      change({ front: `${draft.front.slice(0, start)}{{c${number}::${draft.front.slice(start, end)}}}${draft.front.slice(end)}` }); text.current?.focus(); setError('');
    }}>선택한 부분 빈칸으로</Button><p className="muted">예: 지구는 {'{{c1::태양::별}}'} 주위를 돕니다. 같은 번호는 함께 가리고, 다른 번호는 카드로 나눕니다. 번호를 없애면 해당 카드는 이력과 함께 보관됩니다.</p>
      {parseError && <p role="alert">{parseError}</p>}{numbers.length > 0 && <details><summary>빈칸 카드 {numbers.length}개 미리보기</summary>{numbers.slice(0, 20).map(number => <p key={number}>c{number} · {renderCloze(draft.front, number)}</p>)}</details>}
    </>}
    <Textarea label="참고 답변 (뒷면)" rows={4} value={draft?.reference ?? ''} onChange={e => change({ reference: e.target.value })} {...inputProps} />
    <div className="actions"><Button disabled={disabled || composition || !draft?.front.trim() || !draft.topicId || !!parseError} onClick={save}>{draft?.expectedVersion || draft?.clozeCards?.some(c => c.expectedVersion > 0) ? '질문 수정 저장' : '질문 카드 등록'}</Button>
      {draft && <Button disabled={disabled || composition} onClick={() => change({ id: crypto.randomUUID(), front: '', reference: '', expectedVersion: undefined, clozeCards: undefined })}>새 질문 작성</Button>}</div>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    {!!availableCards.length && <details><summary>등록한 질문 {availableCards.length}개</summary><Input label="등록한 질문 찾기" value={search} onChange={e => { setSearch(e.target.value); setLimit(20); }} />
      {!cards.length && <p className="muted">일치하는 질문이 없습니다. 검색어를 바꾸거나 지워 주세요.</p>}
      {cards.slice(0, limit).map(card => <article key={card.id}><p>{card.suspended ? '보관 · ' : ''}{card.front}</p><div className="actions"><Button disabled={disabled || composition} onClick={() => {
        persist({ ...session, registration: { id: card.cloze?.noteId ?? card.id, topicId: card.topicId, front: card.cloze?.source ?? card.front!, reference: card.reference, deckId: card.deckId, ...(card.cloze ? { kind: 'cloze', clozeCards: (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map(c => ({ id: c.id, number: c.cloze!.number, expectedVersion: c.version })) } : { kind: 'basic', expectedVersion: card.version }) } }); setError(''); setNotice('원문을 편집란에 열었습니다. 저장 전까지 기존 카드와 이력은 유지됩니다.'); text.current?.focus();
      }}>질문 수정</Button><Button disabled={disabled || composition} onClick={() => setStatus(card.id, !card.suspended)}>{card.suspended ? '카드 복원' : '카드 보관'}</Button></div></article>)}
      {cards.length > limit && <Button onClick={() => setLimit(limit + 20)}>질문 더 보기</Button>}
    </details>}
  </details>;
}
