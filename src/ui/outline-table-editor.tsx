import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { AppState, Command, OutlineTableCourse, OutlineTableInput, OutlineTableTopic, OutlineTableUnit, Scope } from '../domain/model';
import { outlineTableToken, previewOutlineTable } from '../domain/outline';
import { DraftArchiveError, archiveDamagedDraft, clearStoredDraft, draftHasUnstoredText, readRescuedDraft, storeDraftSafely } from '../data/draft-safety';
import { Button, ErrorState, Input, Modal, Select } from './index';
import { useModalEditingContext } from './modal-context';
import './outline-table-editor.css';

type CreateCommand = Extract<Command, { type: 'createOutlineTable' }>;
type Removal = { kind: 'course'; index: number; value: OutlineTableCourse }
  | { kind: 'unit'; parentKey: string; index: number; value: OutlineTableUnit }
  | { kind: 'topic'; parentKey: string; index: number; value: OutlineTableTopic };
interface TableDraft extends OutlineTableInput {
  version: 1; undo: Removal[]; previewToken?: string; pending?: CreateCommand;
}
const topic = (): OutlineTableTopic => ({ key: crypto.randomUUID(), name: '' });
const unit = (): OutlineTableUnit => ({ key: crypto.randomUUID(), name: '', topics: [topic()] });
const course = (): OutlineTableCourse => ({ key: crypto.randomUUID(), name: '', units: [unit()] });
const blank = (scope: Scope): TableDraft => ({ version: 1, scope, courses: [course()], choices: {}, undo: [] });
const rowCount = (draft: TableDraft) => draft.courses.reduce((count, row) => count + row.units.reduce((total, item) => total + 1 + item.topics.length, 0), 0);
export const outlineTableDraftKey = (data: AppState) => `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:outline-table-draft:v1`;

function readDraft(key: string, data: AppState): TableDraft | null {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (!raw) return null;
  const value = JSON.parse(raw) as TableDraft;
  const bad = () => { throw Error('표 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.'); };
  const cell = (row: OutlineTableTopic) => { if (!row || typeof row.key !== 'string' || !row.key || typeof row.name !== 'string') bad(); };
  const checkUnit = (row: OutlineTableUnit) => { cell(row); if (!Array.isArray(row.topics) || row.topics.length > 500) bad(); row.topics.forEach(cell); };
  const checkCourse = (row: OutlineTableCourse) => { cell(row); if (!Array.isArray(row.units) || row.units.length > 500) bad(); row.units.forEach(checkUnit); };
  if (!value || value.version !== 1 || !Array.isArray(value.courses) || value.courses.length > 500 || !Array.isArray(value.undo) || value.undo.length > 20
    || !value.scope || !['semester', 'independent', 'unassigned'].includes(value.scope.kind) || value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string'
    || !value.choices || typeof value.choices !== 'object' || Array.isArray(value.choices) || Object.values(value.choices).some(choice => typeof choice !== 'string')
    || value.previewToken !== undefined && typeof value.previewToken !== 'string') bad();
  value.courses.forEach(checkCourse);
  for (const pathKey of Object.keys(value.choices)) {
    const path: unknown = JSON.parse(pathKey);
    if (!Array.isArray(path) || path.length < 1 || path.length > 3 || path.some(name => typeof name !== 'string')) bad();
  }
  if (rowCount(value) > 500) bad();
  const keys = value.courses.flatMap(c => [c.key, ...c.units.flatMap(u => [u.key, ...u.topics.map(t => t.key)])]);
  if (new Set(keys).size !== keys.length) bad();
  for (const removal of value.undo) {
    if (!removal || !['course', 'unit', 'topic'].includes(removal.kind) || !Number.isInteger(removal.index) || removal.index < 0) bad();
    if (removal.kind !== 'course' && typeof removal.parentKey !== 'string') bad();
    if (removal.kind === 'course') checkCourse(removal.value); else if (removal.kind === 'unit') checkUnit(removal.value); else cell(removal.value);
  }
  if (value.pending && (value.pending.type !== 'createOutlineTable' || value.pending.userId !== data.userId || value.pending.namespace !== data.namespace
    || typeof value.pending.opId !== 'string' || typeof value.pending.at !== 'string' || typeof value.pending.expectedToken !== 'string'
    || JSON.stringify([value.pending.scope, value.pending.courses, value.pending.choices]) !== JSON.stringify([value.scope, value.courses, value.choices]))) bad();
  return value;
}

interface Props {
  data: AppState; initialScope: Scope;
  onApply: (command: CreateCommand) => AppState | null;
  onUndo?: (revisionId: string, expectedVersion: number) => AppState | null;
}
export function OutlineTableEditor(props: Props) {
  return <TableEditor key={`${props.data.namespace}:${props.data.userId}`} {...props} />;
}
function TableEditor({ data, initialScope, onApply, onUndo }: Props) {
  const key = outlineTableDraftKey(data);
  const [boot] = useState(() => { try { return { draft: readDraft(key, data), error: '' }; } catch { return { draft: null, error: '표 초안을 읽지 못했습니다.' }; } });
  const [draft, setDraft] = useState<TableDraft | null>(boot.draft), [open, setOpen] = useState(false), [blocked, setBlocked] = useState(Boolean(boot.error));
  const [error, setError] = useState(boot.error ? '표 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.' : draftHasUnstoredText(key) ? '초안 저장에 실패한 입력을 이 창에서 유지합니다. 창을 닫기 전에 저장을 다시 시도해 주세요.' : '');
  const [message, setMessage] = useState(''), [undo, setUndo] = useState<{ revisionId: string; expectedVersion: number } | null>(null);
  const fields = useRef(new Map<string, HTMLInputElement>()), focusNext = useRef<string | null>(null), creating = useRef(false);
  const modalAnchor = useRef<HTMLParagraphElement>(null);
  useModalEditingContext(open, key, modalAnchor, fields);
  useLayoutEffect(() => { if (focusNext.current) { fields.current.get(focusNext.current)?.focus(); focusNext.current = null; } }, [draft]);
  const persist = (next: TableDraft): boolean => {
    setDraft(next);
    try { storeDraftSafely(key, JSON.stringify(next)); setError(''); return true; }
    catch { setError('초안을 이 기기에 저장하지 못했습니다. 입력은 이 창에 남아 있습니다. 창을 닫기 전에 초안 저장을 다시 시도해 주세요.'); return false; }
  };
  const edit = (action: (next: TableDraft) => void) => {
    if (!draft || draft.pending || blocked) return;
    const next = structuredClone(draft); action(next); next.choices = {}; delete next.previewToken; setMessage(''); persist(next);
  };
  const launch = () => { if (!draft && !blocked) persist(blank(initialScope)); setOpen(true); };
  let plan: ReturnType<typeof previewOutlineTable> | null = null, planError = '';
  if (draft) try { plan = previewOutlineTable(data, draft); } catch (reason) { planError = reason instanceof Error ? reason.message : '입력 표를 확인해 주세요.'; }
  const canonical = (value: unknown): string => {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([name, entry]) => JSON.stringify(name) + ':' + canonical(entry)).join(',') + '}';
    return JSON.stringify(value);
  };
  const alreadyApplied = Boolean(draft?.pending && data.appliedOps[draft.pending.opId] === canonical(draft.pending));
  const stale = Boolean(draft?.previewToken && draft.previewToken !== outlineTableToken(data));
  const locked = Boolean(draft?.pending) || blocked;
  const captureUndo = (result: AppState, opId: string) => {
    const revision = result.revisions.find(row => row.operationId === opId);
    if (revision) setUndo({ revisionId: revision.id, expectedVersion: revision.after.version });
  };
  const finish = (result: AppState, opId: string) => {
    captureUndo(result, opId); setMessage('표의 항목을 생성했습니다. 과목 목록에서 확인할 수 있습니다.');
    try { clearStoredDraft(key); setDraft(null); setError(''); setOpen(false); }
    catch { setError('항목은 생성했습니다. 이전 초안을 정리하지 못해 중복 생성을 막고 있습니다. 초안 정리를 다시 시도해 주세요.'); }
  };
  const apply = () => {
    if (!draft || blocked || creating.current) return;
    if (alreadyApplied) { finish(data, draft.pending!.opId); return; }
    if (!draft.pending && (!plan?.ready || !plan.newCount || stale || !draft.previewToken)) return;
    const command: CreateCommand = draft.pending ?? { type: 'createOutlineTable', userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), scope: draft.scope, courses: draft.courses, choices: draft.choices, expectedToken: draft.previewToken!, ids: Object.fromEntries(plan!.entries.filter(row => row.status === 'new').map(row => [row.key, crypto.randomUUID()])) };
    // Persist the exact request before applying, so reload/retry cannot mint another batch.
    if (!persist({ ...draft, pending: command })) return;
    creating.current = true;
    try {
      const result = onApply(command);
      if (result) finish(result, command.opId); else setError('생성을 확인하지 못했습니다. 입력과 생성 요청을 보관했습니다. 저장을 다시 시도해 주세요.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : '생성을 확인하지 못했습니다. 입력과 생성 요청을 보관했습니다.'); }
    finally { creating.current = false; }
  };
  const remove = (removal: Removal, action: (next: TableDraft) => void) => edit(next => { action(next); next.undo = [...next.undo, removal].slice(-20); });
  const restore = () => {
    if (!draft || locked || !draft.undo.length) return;
    const next = structuredClone(draft), item = next.undo.at(-1)!;
    let list: (OutlineTableCourse | OutlineTableUnit | OutlineTableTopic)[] | undefined;
    if (item.kind === 'course') list = next.courses;
    else if (item.kind === 'unit') list = next.courses.find(c => c.key === item.parentKey)?.units;
    else list = next.courses.flatMap(c => c.units).find(u => u.key === item.parentKey)?.topics;
    if (!list || list.some(row => row.key === item.value.key)) { setError('삭제한 입력의 상위 항목을 먼저 복원해 주세요. 다른 입력은 유지했습니다.'); return; }
    list.splice(Math.min(item.index, list.length), 0, item.value);
    if (rowCount(next) > 500 || next.courses.length > 500) { setError('복원하면 입력 한도를 넘습니다. 현재 입력을 보존했습니다.'); return; }
    next.undo.pop(); next.choices = {}; delete next.previewToken; focusNext.current = item.value.key; persist(next);
  };
  const addTopic = (courseKey: string, unitKey: string) => {
    if (!draft || rowCount(draft) >= 500) return;
    const value = topic(); focusNext.current = value.key;
    edit(next => next.courses.find(c => c.key === courseKey)!.units.find(u => u.key === unitKey)!.topics.push(value));
  };
  const enter = (event: KeyboardEvent<HTMLInputElement>, rowKey: string, lastTopic?: { courseKey: string; unitKey: string }) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    if (lastTopic) { addTopic(lastTopic.courseKey, lastTopic.unitKey); return; }
    const all = draft?.courses.flatMap(c => [c.key, ...c.units.flatMap(u => [u.key, ...u.topics.map(t => t.key)])]) ?? [];
    fields.current.get(all[all.indexOf(rowKey) + 1])?.focus();
  };
  const field = (row: OutlineTableTopic, label: string, onChange: (value: string) => void, lastTopic?: { courseKey: string; unitKey: string }) => <Input label={label} value={row.name} maxLength={180} disabled={locked} data-table-cell={row.key} data-editing-context={`outline-table:${row.key}`} ref={element => { if (element) fields.current.set(row.key, element); else fields.current.delete(row.key); }} onChange={event => onChange(event.target.value)} onKeyDown={event => enter(event, row.key, lastTopic)} />;
  return <>
    <Button onClick={launch}>표로 한 번에 만들기{draft ? ' · 작성 이어가기' : ''}</Button>
    {undo && onUndo && <Button onClick={() => { try { const result = onUndo(undo.revisionId, undo.expectedVersion); if (result) { setUndo(null); setMessage('표에서 생성한 항목을 되돌렸습니다.'); } else setError('그 뒤 연결되거나 수정한 내용이 있어 되돌리지 못했습니다. 현재 자료를 유지했습니다.'); } catch (reason) { setError(reason instanceof Error ? reason.message : '되돌리지 못했습니다. 현재 자료를 유지했습니다.'); } }}>표 생성 되돌리기</Button>}
    {message && <p role="status">{message}</p>}{!open && error && <ErrorState message={error} />}
    <Modal open={open} title="과목·단원·주제 한 번에 만들기" onClose={() => setOpen(false)} className="outline-table-modal">
      <p ref={modalAnchor}>과목명을 적고, 표에서 단원과 주제를 채우세요. 입력은 이 기기의 초안으로 보관합니다.</p>
      {error && <ErrorState message={error} />}
      {blocked && <div className="field-stack"><Button onClick={() => { try { const restored = readDraft(key, data); setBlocked(false); setError(''); setDraft(restored); if (!restored) persist(blank(initialScope)); } catch { setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.'); } }}>표 초안 다시 읽기</Button><Button onClick={() => { try { archiveDamagedDraft(key); setBlocked(false); persist(blank(initialScope)); } catch (reason) { setError(reason instanceof DraftArchiveError ? reason.message : '원본 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다.'); } }}>원문 보관 후 새 표 시작</Button></div>}
      {draft && !blocked && <div className="field-stack">
        <Select label="표의 과목을 등록할 학기" disabled={locked} value={draft.scope.kind === 'semester' ? draft.scope.semesterId : draft.scope.kind} onChange={event => edit(next => { next.scope = ['independent', 'unassigned'].includes(event.target.value) ? { kind: event.target.value as 'independent' | 'unassigned' } : { kind: 'semester', semesterId: event.target.value }; })}>
          <option value="unassigned">학기 미지정</option><option value="independent">독립 공부</option>{data.semesters.filter(row => !row.deletedAt).map(row => <option key={row.id} value={row.id}>{row.name}</option>)}
        </Select>
        {draft.courses.map((c, ci) => <section className="ui-card field-stack" key={c.key}>
          {field(c, `${ci + 1}번째 과목명`, value => edit(next => { next.courses[ci].name = value; }))}
          <Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 삭제`} onClick={() => remove({ kind: 'course', index: ci, value: c }, next => { next.courses.splice(ci, 1); })}>과목 삭제</Button>
          <table className="outline-input-table"><thead><tr><th scope="col">단원</th><th scope="col">주제</th></tr></thead>
            {c.units.map((u, ui) => <tbody key={u.key}>{[...u.topics, null].map((t, ti) => <tr key={t?.key ?? 'add'}>
              {ti === 0 && <td rowSpan={u.topics.length + 1}>{field(u, `${ci + 1}번째 과목 ${ui + 1}번째 단원`, value => edit(next => { next.courses[ci].units[ui].name = value; }))}<Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 삭제`} onClick={() => remove({ kind: 'unit', parentKey: c.key, index: ui, value: u }, next => { next.courses[ci].units.splice(ui, 1); })}>단원 삭제</Button></td>}
              <td>{t ? <>{field(t, `${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제`, value => edit(next => { next.courses[ci].units[ui].topics[ti].name = value; }), ti === u.topics.length - 1 ? { courseKey: c.key, unitKey: u.key } : undefined)}<Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제 삭제`} onClick={() => remove({ kind: 'topic', parentKey: u.key, index: ti, value: t }, next => { next.courses[ci].units[ui].topics.splice(ti, 1); })}>주제 삭제</Button></> : <Button disabled={locked || rowCount(draft) >= 500} onClick={() => addTopic(c.key, u.key)}>주제 추가</Button>}</td>
            </tr>)}</tbody>)}
          </table>
          <Button disabled={locked || rowCount(draft) > 498} onClick={() => { const value = unit(); focusNext.current = value.key; edit(next => next.courses[ci].units.push(value)); }}>단원 추가</Button>
        </section>)}
        <div className="actions"><Button disabled={locked || draft.courses.length >= 500 || rowCount(draft) > 498} onClick={() => { const value = course(); focusNext.current = value.key; edit(next => next.courses.push(value)); }}>과목 추가</Button><Button disabled={locked || !draft.undo.length} onClick={restore}>삭제 되돌리기</Button></div>
        <p className="muted">단원과 주제 입력 {rowCount(draft)} / 500행 · 같은 경로를 반복 입력하면 한 번만 만듭니다. 빈칸은 건너뜁니다.</p>
        {planError && <p role="status">{planError}</p>}
        {plan && plan.entries.length > 0 && <section className="field-stack" aria-label="표 생성 미리보기"><p role="status">새 과목 {plan.entries.filter(row => row.kind === 'subject' && row.status === 'new').length}개 · 새 단원·주제 {plan.entries.filter(row => row.kind !== 'subject' && row.status === 'new').length}개 · 기존 연결 {plan.reuseCount}개</p>
          {plan.entries.filter(row => row.candidates.length > 0).map(row => <Select key={row.key} label={`${row.path.join(' → ')} 처리`} disabled={locked} value={draft.choices[row.key] ?? ''} onChange={event => {
            const choices = { ...draft.choices, [row.key]: event.target.value };
            for (const choiceKey of Object.keys(choices)) { const path = JSON.parse(choiceKey) as string[]; if (path.length > row.path.length && row.path.every((name, index) => path[index] === name)) delete choices[choiceKey]; }
            persist({ ...draft, choices, previewToken: undefined });
          }}><option value="">기존 항목을 사용할지 고르세요</option><option value="new">같은 이름으로 새로 만들기</option>{row.candidates.map((candidate, index) => <option key={candidate.id} value={candidate.id}>기존 항목 사용 · {candidate.name}{row.candidates.length > 1 ? ` · ${index + 1}번째(현재 목록 순서)` : ''}</option>)}</Select>)}
          <details><summary>생성할 구조 보기</summary><ul>{plan.entries.map(row => <li key={row.key}>{row.path.join(' → ')} · {row.status === 'new' ? '새로 생성' : row.status === 'reuse' ? '기존 항목 연결' : '선택 필요'}</li>)}</ul></details>
          {stale && !alreadyApplied && <p role="alert">미리보기 이후 목차가 바뀌었습니다. 입력을 유지했습니다. 현재 구조를 다시 확인해 주세요.</p>}
          {!draft.pending && <Button disabled={!plan.ready} onClick={() => persist({ ...draft, previewToken: outlineTableToken(data) })}>생성할 구조 확인</Button>}
          {!draft.pending && <Button variant="primary" disabled={!plan.ready || !plan.newCount || !draft.previewToken || stale} onClick={apply}>한 번에 생성</Button>}
        </section>}
        {draft.pending && <Button variant="primary" onClick={apply}>{alreadyApplied ? '완료한 표 초안 정리' : '표 생성 저장 다시 시도'}</Button>}
        {draft.pending && !alreadyApplied && stale && <Button onClick={() => { const next = { ...draft }; delete next.pending; delete next.previewToken; persist(next); }}>현재 구조 다시 확인</Button>}
        {error && <Button onClick={() => persist(draft)}>표 초안 저장 다시 시도</Button>}
      </div>}
      <Button onClick={() => setOpen(false)}>닫고 표 초안 보관</Button>
    </Modal>
  </>;
}
