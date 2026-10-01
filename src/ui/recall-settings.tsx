import { useState } from 'react';
import type { AppState, RecallOptions } from '../domain/model';
import { recallOptions, recallPreference, validateRecallOptions } from '../domain/recall-scheduler';
import type { RecallRepository } from '../data/topic-recall';
import type { RecallSession } from '../domain/topic-recall';
import { RecallOptimization } from './recall-optimization';
import { Button, Checkbox, Input } from './index';

export function RecallSettings({ data, repository, onSaved, disabled, deckId, session, persist }: { data: AppState; repository: RecallRepository; onSaved: (data: AppState) => void; disabled: boolean; deckId?: string; session?: RecallSession; persist?: (next: RecallSession) => boolean }) {
  const restored = session?.settingsDrafts?.[deckId ?? 'default'];
  const [options, setOptions] = useState<RecallOptions>(() => restored?.options ?? recallOptions(data, deckId));
  const [learning, setLearning] = useState(() => restored?.learning ?? options.learningMinutes.join(', '));
  const [relearning, setRelearning] = useState(() => restored?.relearning ?? options.relearningMinutes.join(', '));
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [base] = useState(() => recallPreference(data, deckId));
  const [id] = useState(() => restored?.id ?? base?.id ?? deckId ?? crypto.randomUUID());
  const [version, setVersion] = useState(restored?.version ?? base?.version ?? 0);
  const [name, setName] = useState(restored?.name ?? base?.deckName);
  const remember = (patch: Partial<NonNullable<RecallSession['settingsDrafts']>[string]>) => {
    if (session && persist) persist({ ...session, settingsDrafts: { ...session.settingsDrafts, [deckId ?? 'default']: { id, version, options, learning, relearning, name, ...patch } } });
  };
  const save = () => {
    try {
      const parse = (text: string) => !text.trim() ? [] : text.split(',').map(v => v.trim() === '' ? NaN : Number(v.trim()));
      const next = { ...options, learningMinutes: parse(learning), relearningMinutes: parse(relearning) }; validateRecallOptions(next);
      const snapshot = repository.getSnapshot();
      const saved = repository.execute({ type: 'saveRecallPreferences', id, expectedVersion: version, options: next, ...(deckId ? { deckName: name } : {}),
        opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace });
      const nextVersion = saved.recallPreferences!.find(row => row.id === id)!.version; setVersion(nextVersion); setOptions(next); const normalizedLearning = next.learningMinutes.join(', '), normalizedRelearning = next.relearningMinutes.join(', '); setLearning(normalizedLearning); setRelearning(normalizedRelearning); remember({ version: nextVersion, options: next, learning: normalizedLearning, relearning: normalizedRelearning }); onSaved(saved); setError(''); setNotice('설정을 저장했습니다. 다음 자기 평가부터 적용됩니다.');
    } catch (e) { setError(e instanceof Error ? e.message : '설정을 저장하지 못했습니다.'); }
  };
  const dirty = name !== recallPreference(data, deckId)?.deckName || JSON.stringify(options) !== JSON.stringify(recallOptions(data, deckId)) || learning !== options.learningMinutes.join(', ') || relearning !== options.relearningMinutes.join(', ');
  return <details className="recall-settings"><summary>{deckId ? `${recallPreference(data, deckId)?.deckName ?? '덱'} 복습 설정` : '복습 설정'}</summary>
    {deckId && <Input label="덱 이름" value={name ?? ''} maxLength={200} onChange={e => { setName(e.target.value); remember({ name: e.target.value }); }} />}
    <div className="recall-settings-fields">
      <Input label="하루 새 카드 수" type="number" min={0} max={9999} value={options.newPerDay} onChange={e => { const next = { ...options, newPerDay: Number(e.target.value) }; setOptions(next); remember({ options: next }); }} />
      <Input label="목표 기억률 (%)" type="number" min={70} max={97} value={Math.round(options.retention * 100)} onChange={e => { const next = { ...options, retention: Number(e.target.value) / 100 }; setOptions(next); remember({ options: next }); }} />
      <Input label="학습 단계 (분)" value={learning} placeholder="1, 10" onChange={e => { setLearning(e.target.value); remember({ learning: e.target.value }); }} />
      <Input label="재학습 단계 (분)" value={relearning} placeholder="10" onChange={e => { setRelearning(e.target.value); remember({ relearning: e.target.value }); }} />
      <Input label="최대 복습 간격 (일)" type="number" min={1} max={36500} value={options.maximumDays} onChange={e => { const next = { ...options, maximumDays: Number(e.target.value) }; setOptions(next); remember({ options: next }); }} />
    </div>
    <Checkbox label="같은 문장의 다른 빈칸 카드는 다음 날에 보기" checked={options.burySiblings !== false} disabled={disabled} onChange={e => { const next = { ...options, burySiblings: e.target.checked }; setOptions(next); remember({ options: next }); }} />
    <p className="muted">분 단위 단계는 작은 값부터 쉼표로 구분합니다. 빈칸이면 FSRS가 간격을 정합니다. 목표 기억률을 높이면 더 자주 복습하게 됩니다. 이미 정해진 날짜는 설정 저장만으로 바뀌지 않습니다.</p>
    <Button disabled={disabled} onClick={save}>복습 설정 저장</Button>
    {dirty && <p className="muted">최적화 전에 수정한 복습 설정을 먼저 저장해 주세요.</p>}
    <RecallOptimization data={data} repository={repository} preferenceId={id} deckId={deckId} disabled={disabled || dirty} onApplied={saved => {
      const options = recallOptions(saved, deckId), version = recallPreference(saved, deckId)!.version; setOptions(options); setVersion(version); remember({ options, version }); onSaved(saved);
    }} />
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </details>;
}
