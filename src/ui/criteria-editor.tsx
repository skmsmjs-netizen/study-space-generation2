import { useState } from 'react';
import type { AppState, CriteriaChange, TraceDefinition } from '../domain/model';
import { criteriaRevisionToken, criteriaScopeTargets, prepareCriteriaItems, resolveCriteria, validateTraceDefinition, type CriteriaEditRow } from '../domain/criteria';
import { TRACE_GROUP_LABELS } from '../domain/trace';
import { DraftArchiveError, archiveDamagedDraft, clearStoredDraft, draftHasUnstoredText, readRescuedDraft, storeDraftSafely } from '../data/draft-safety';
import { Button, ErrorState, Input, Modal, Select } from './index';

interface Draft {
  targetId: string;
  base: TraceDefinition[];
  rows: (CriteriaEditRow & { key: string })[];
  expectedToken: string;
  scope: CriteriaChange['scope'];
}
function readDraft(key: string, targetId: string): Draft | null {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const value = JSON.parse(raw) as Draft;
  if (!value || value.targetId !== targetId || !Array.isArray(value.base) || !Array.isArray(value.rows)
    || typeof value.expectedToken !== 'string' || !['topic', 'subject', 'all'].includes(value.scope)
    || value.rows.length > 100 || new Set(value.rows.map(row => row.key)).size !== value.rows.length) throw Error('기준 조정 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.');
  value.base.forEach(item => validateTraceDefinition(item));
  for (const row of value.rows) {
    if (!row || typeof row.key !== 'string' || !row.key || (row.id !== null && typeof row.id !== 'string')
      || !['T', 'R', 'A', 'C', 'E'].includes(row.group) || typeof row.label !== 'string'
      || !['required', 'optional', 'excluded'].includes(row.mode)) throw Error('기준 조정 초안의 입력을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.');
  }
  return value;
}

/** Prototype-only local drafts. Online criteria, cross-device conflicts and sync remain separate gates. */
interface CriteriaEditorProps {
  data: AppState;
  targetId: string;
  onApply: (change: CriteriaChange) => AppState | null;
  onUndo?: (revisionId: string, expectedVersion: number) => AppState | null;
}
export function CriteriaEditor(props: CriteriaEditorProps) {
  return <CriteriaEditorForTarget key={`${props.data.namespace}:${props.data.userId}:${props.targetId}`} {...props} />;
}
function CriteriaEditorForTarget({ data, targetId, onApply, onUndo }: CriteriaEditorProps) {
  const key = `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:criteria-draft:${encodeURIComponent(targetId)}`;
  const [boot] = useState(() => {
    try { return { draft: readDraft(key, targetId), error: '' }; }
    catch { return { draft: null, error: '기준 조정 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.' }; }
  });
  const [blocked, setBlocked] = useState(Boolean(boot.error));
  const [cleanupPending, setCleanupPending] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(boot.draft);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(boot.error || (draftHasUnstoredText(key) ? '저장에 실패한 기준 입력을 이 창에서 유지합니다. 다시 저장하거나 복사해 주세요.' : ''));
  const [undo, setUndo] = useState<{ revisionId: string; expectedVersion: number } | null>(null);
  const target = data.nodes.find(node => node.id === targetId);
  if (!target) return null;
  const update = (next: Draft) => {
    setDraft(next);
    try { storeDraftSafely(key, JSON.stringify(next)); setError(''); }
    catch { setError('기준 조정 초안을 보관하지 못했습니다. 입력은 화면에 남아 있습니다. 창을 닫기 전에 내용을 복사해 주세요.'); }
  };
  const freshDraft = (): Draft => {
    const current = resolveCriteria(data, targetId);
    return { targetId, base: current.items, rows: current.items.map(item => ({ ...item, key: item.id })), expectedToken: criteriaRevisionToken(data), scope: 'topic' };
  };
  const launch = () => {
    if (!draft && !blocked && !cleanupPending) update(freshDraft());
    setOpen(true);
  };
  const stale = Boolean(draft && draft.expectedToken !== criteriaRevisionToken(data));
  const changeRow = (index: number, patch: Partial<CriteriaEditRow>) => {
    if (draft) update({ ...draft, rows: draft.rows.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row) });
  };
  const apply = () => {
    if (!draft || stale || blocked || cleanupPending) return;
    try {
      const items = prepareCriteriaItems(draft.base, draft.rows, () => crypto.randomUUID());
      const id = crypto.randomUUID();
      const result = onApply({ id, targetId, scope: draft.scope, expectedToken: draft.expectedToken, items });
      if (!result) { setError('기준을 적용하지 못했습니다. 작성한 입력은 초안에 남아 있습니다.'); return; }
      const revision = result.revisions.find(row => row.collection === 'criteria' && row.entityId === id);
      if (revision && onUndo) setUndo({ revisionId: revision.id, expectedVersion: revision.after.version });
      setDraft(null); setOpen(false); setError('');
      try { clearStoredDraft(key); }
      catch { setCleanupPending(true); setError('기준은 적용했습니다. 이전 초안 정리를 못해 이 창에서 재적용을 막고 있습니다. 창을 닫기 전에 초안 정리를 다시 시도해 주세요.'); }
    } catch (reason) { setError(reason instanceof Error ? reason.message : '기준을 적용하지 못했습니다. 입력을 보존했습니다.'); }
  };
  const targets = draft ? criteriaScopeTargets(data, targetId, draft.scope) : [];
  return (
    <>
      <Button onClick={launch}>공부 기준 조정{draft ? ' · 작성 이어가기' : ''}</Button>
      {undo && onUndo && <Button onClick={() => {
        const result = onUndo(undo.revisionId, undo.expectedVersion);
        if (result) { setUndo(null); setError(''); }
        else setError('그 뒤의 변경이 있어 기준을 되돌리지 못했습니다. 현재 기준과 기록은 보존했습니다.');
      }}>기준 변경 되돌리기</Button>}
      {!open && error && <ErrorState message={error} />}
      <Modal open={open} title="공부 기준 조정" onClose={() => setOpen(false)}>
        <p>{target.name}에서 쓸 활동을 조정해 보세요. 기준은 매번 모두 해야 할 의무가 아니며, 체크는 일부 시도도 포함합니다.</p>
        {error && <ErrorState message={error} />}
        {cleanupPending && <Button onClick={() => {
          try { clearStoredDraft(key); setCleanupPending(false); setError(''); }
          catch { setError('초안 정리를 완료하지 못했습니다. 적용한 기준은 유지하며 다시 적용하지 않습니다.'); }
        }}>초안 정리 다시 시도</Button>}
        {blocked && <div className="field-stack">
          <Button onClick={() => {
            try { const restored = readDraft(key, targetId); setBlocked(false); setDraft(restored); setError(''); if (!restored) update(freshDraft()); }
            catch { setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.'); }
          }}>초안 다시 읽기</Button>
          <p className="muted">읽지 못한 원문을 이 기기에 별도 보관한 뒤, 현재 기준으로 새 초안을 시작할 수 있습니다. 원문 사본 저장에 실패하면 새로 시작하지 않습니다.</p>
          <Button onClick={() => {
            try { archiveDamagedDraft(key); setBlocked(false); update(freshDraft()); }
            catch (reason) { setError(reason instanceof DraftArchiveError ? reason.message : '원본 초안 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다. 저장 공간을 확보한 뒤 다시 시도해 주세요.'); }
          }}>원문 보관 후 새 초안 시작</Button>
        </div>}
        {!blocked && draft && error && !cleanupPending && <Button onClick={() => update(draft)}>초안 저장 다시 시도</Button>}
        {draft && <div className="field-stack">
          <Select label="적용 범위" value={draft.scope} onChange={event => update({ ...draft, scope: event.target.value as CriteriaChange['scope'] })}>
            <option value="topic">이 항목만</option>
            <option value="subject">이 과목의 기존 항목과 새 항목</option>
            <option value="all">모든 과목의 기존 항목과 새 항목</option>
          </Select>
          <p className="muted">현재 {targets.filter(row => row.scope === 'topic').length}개 항목에 적용합니다. {draft.scope !== 'topic' && '개별 조정한 기준도 이 기준으로 바뀌며, 휴지통의 항목에도 복원 후 적용됩니다. '}지난 공부의 체크·메모·반복·서술과 당시 정의는 바꾸지 않습니다.</p>
          <p className="muted">문구·활동·적용 여부를 바꾸면 새 항목으로 구별합니다. 기존 체크를 새 항목의 수행으로 옮기지 않습니다. 입력은 이 기기의 초안으로 보관합니다.</p>
          {draft.rows.map((row, index) => <fieldset key={row.key}>
            <legend>항목 {index + 1}</legend>
            <div className="field-stack">
              <Input label="항목 문구" data-editing-context={`criteria:${targetId}:${row.key}`} value={row.label} maxLength={180} onChange={event => changeRow(index, { label: event.target.value })} />
              <Select label="활동" value={row.group} onChange={event => changeRow(index, { group: event.target.value })}>
                {Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => <option key={group} value={group}>{label}</option>)}
              </Select>
              <Select label="적용 여부" value={row.mode} onChange={event => changeRow(index, { mode: event.target.value as CriteriaEditRow['mode'] })}>
                <option value="required">기본 기준</option><option value="optional">선택 기준</option><option value="excluded">기준에서 제외</option>
              </Select>
            </div>
          </fieldset>)}
          <Button disabled={draft.rows.length >= 100} onClick={() => update({ ...draft, rows: [...draft.rows, { id: null, key: crypto.randomUUID(), group: 'T', label: '', mode: 'optional' }] })}>항목 추가</Button>
          {stale && <section>
            <p role="alert">작성 중 기준이나 목차가 바뀌었습니다. 아래 현재 기준과 작성한 입력을 비교한 뒤 적용 범위를 다시 확인해 주세요. 입력은 유지했습니다.</p>
            <details open><summary>현재 적용된 기준</summary><ul>{resolveCriteria(data, targetId).items.map(item => <li key={item.id}>{item.label} · {item.mode === 'excluded' ? '제외' : item.mode === 'optional' ? '선택' : '기본'}</li>)}</ul></details>
            <Button onClick={() => update({ ...draft, expectedToken: criteriaRevisionToken(data) })}>현재 기준과 범위를 확인했습니다</Button>
          </section>}
          <div className="actions"><Button variant="primary" disabled={stale || blocked || cleanupPending} onClick={apply}>기준 적용</Button><Button onClick={() => setOpen(false)}>닫고 초안 보관</Button></div>
        </div>}
      </Modal>
    </>
  );
}
