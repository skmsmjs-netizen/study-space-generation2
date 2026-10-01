import { useState } from 'react';
import type { AppState } from '../domain/model';
import type { RecallSession } from '../domain/topic-recall';
import type { RecallRepository } from '../data/topic-recall';
import { recallDecks, recallOptions } from '../domain/recall-scheduler';
import { Button, Input, Select } from './index';
export function RecallDecks({ data, repository, session, persist, onSaved, disabled, onChange }: { data: AppState; repository: RecallRepository; session: RecallSession; persist: (next: RecallSession) => boolean; onSaved: (data: AppState) => void; disabled: boolean; onChange: (id: string) => void }) {
  const [error, setError] = useState('');
  return <><Select label="복습할 덱" value={session.deckId ?? 'all'} disabled={disabled} onChange={e => onChange(e.target.value)}><option value="all">모든 덱</option><option value="default">기본 덱</option>{recallDecks(data).map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)}</Select>
    <details className="recall-card-settings"><summary>덱 만들기</summary><p className="muted">덱마다 하루 새 카드 수와 복습 간격을 따로 정할 수 있습니다. 기존 카드는 기본 덱에 남습니다.</p>
      <Input label="새 덱 이름" value={session.deckCreation?.name ?? ''} maxLength={200} disabled={disabled} onChange={e => persist({ ...session, deckCreation: { id: session.deckCreation?.id ?? crypto.randomUUID(), name: e.target.value } })} />
      <Button disabled={disabled || !session.deckCreation?.name.trim()} onClick={() => { try {
        const draft = session.deckCreation!, snapshot = repository.getSnapshot(), old = snapshot.recallPreferences?.find(row => row.id === draft.id);
        const saved = old?.deckName === draft.name ? snapshot : repository.execute({ type: 'saveRecallPreferences', id: draft.id, deckName: draft.name, options: recallOptions(snapshot), expectedVersion: old?.version ?? 0, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
        onSaved(saved); persist({ ...session, deckCreation: undefined, deckId: draft.id, currentId: null, seen: [] }); setError('');
      } catch (e) { setError(e instanceof Error ? e.message : '덱을 저장하지 못했습니다. 이름은 초안에 남아 있습니다.'); } }}>덱 만들기</Button>
      {error && <p role="alert">{error}</p>}</details></>;
}
