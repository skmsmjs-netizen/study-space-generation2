import { useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import type { RecommendationWorkspace } from '../domain/recommendation-workspace';
import { validateRecommendations } from '../domain/recommendation-workspace';
import { readLearningPlan, saveLearningPlan } from '../data/learning-plan';
import { readWeeksDraft, writeWeeksDraft, type WeeksDraft } from '../data/semester-weeks-draft';
import { createSemesterWeeks, reverseWeekBatch, semesterWeekRows, weekDuplicate, weekSeries } from '../domain/study-calendar';
import { Button, Checkbox, Input, Modal, Select, Textarea } from './index';

export function SubjectWeeks({ data, repository, subjectId, onSaved }: { data: AppState; repository: StudyRepository; subjectId: string; onSaved: (d: AppState) => void }) {
  try {
    const { workspace, raw } = readLearningPlan(data);
    return <SemesterWeeksEditor key={subjectId} data={data} workspace={workspace} subjectIds={[subjectId]} fixedSubjectId={subjectId}
      disabled={data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveLearningPlan')}
      onChange={next => { validateRecommendations(next, data); onSaved(saveLearningPlan(repository, { ...next, revision: next.revision + 1 }, raw)); return true; }} />;
  } catch { return <p role="alert">주차 일정을 읽지 못했습니다. 저장된 내용은 유지했습니다.</p>; }
}

export function SemesterWeeksEditor({ data, workspace, subjectIds, fixedSubjectId, onChange, disabled = false }: {
  data: AppState; workspace: RecommendationWorkspace; subjectIds: string[]; fixedSubjectId?: string;
  onChange: (w: RecommendationWorkspace) => boolean; disabled?: boolean;
}) {
  const subjects = data.subjects.filter(s => !s.deletedAt && s.userId === data.userId && s.namespace === data.namespace && subjectIds.includes(s.id));
  const scope = fixedSubjectId ?? 'schedules';
  const initial = (): WeeksDraft => {
    const subject = subjects.find(s => s.id === fixedSubjectId) ?? subjects[0];
    const term = subject?.scope.kind === 'semester' ? workspace.terms?.[subject.scope.semesterId] : undefined;
    return { subjectId: subject?.id ?? '', start: '', end: term?.end ?? '', firstWeek: 1, name: subject?.name ?? '', rows: [], generatedStart: '', batch: null };
  };
  const [boot] = useState(() => { try { return { ...readWeeksDraft(data, scope), error: '' }; } catch (e) { return { raw: null, draft: null, error: (e as Error).message }; } });
  const [draft, setDraft] = useState<WeeksDraft>(boot.draft ?? initial), current = useRef(draft), raw = useRef(boot.raw);
  const [open, setOpen] = useState(false), [error, setError] = useState(boot.error), [blocked, setBlocked] = useState(Boolean(boot.error)), [notice, setNotice] = useState('');
  const patch = (p: Partial<WeeksDraft>) => {
    const next = { ...current.current, ...p }; current.current = next; setDraft(next);
    try { raw.current = writeWeeksDraft(data, scope, next, raw.current); setError(''); }
    catch (e) { setError(`${(e as Error).message} 화면의 입력은 유지했습니다.`); }
  };
  const generate = () => {
    try {
      if (draft.rows.length) { setError('기존 미리보기의 이름·날짜·메모를 유지했습니다. 새 기간으로 만들려면 미리보기 초기화를 눌러 주세요.'); return; }
      patch({ rows: semesterWeekRows(draft.start, draft.end, draft.firstWeek, draft.name), generatedStart: draft.start }); setNotice('실제 공지에 맞춰 날짜·기한·이름을 수정하고 휴강 주차는 제외해 주세요.');
    } catch (e) { setError((e as Error).message); }
  };
  const existing = workspace.schedules ?? [], series = weekSeries(draft.subjectId, draft.generatedStart);
  const count = draft.rows.filter(r => !r.excluded && !weekDuplicate(existing, draft.subjectId, series, r)).length;
  const save = () => {
    try {
      if (!subjects.some(s => s.id === draft.subjectId) || fixedSubjectId && fixedSubjectId !== draft.subjectId) throw Error('현재 범위의 과목을 선택해 주세요.');
      const added = createSemesterWeeks(draft.rows, existing, draft.subjectId, draft.generatedStart, () => crypto.randomUUID());
      if (!added.length) { setNotice('새로 등록할 주차가 없습니다. 기존 일정과 휴지통의 주차는 중복 등록하지 않았습니다.'); return; }
      if (onChange({ ...workspace, schedules: [...existing, ...added] })) {
        patch({ batch: { originals: added, reversed: false } });
        setNotice(`${added.length}개 주차를 등록했습니다. 출석·학습 상태는 각각 직접 남겨 주세요.`);
      } else setError('주차를 저장하지 못했습니다. 초안은 유지했습니다. 연결 상태를 확인한 뒤 다시 등록해 주세요.');
    } catch (e) { setError((e as Error).message); }
  };
  const reverse = () => {
    if (!draft.batch) return;
    try {
      const result = reverseWeekBatch(existing, draft.batch.originals, new Date().toISOString(), draft.batch.reversed);
      if (!result.changed) { setNotice('등록 뒤 변경된 주차는 유지했습니다. 개별 일정에서 이력을 확인해 주세요.'); return; }
      if (onChange({ ...workspace, schedules: result.schedules })) {
        patch({ batch: { originals: result.originals, reversed: !draft.batch.reversed } });
        setNotice(`${result.changed}개 주차를 ${draft.batch.reversed ? '복원' : '휴지통으로 이동'}했습니다.${result.preserved ? ` 이후 변경된 ${result.preserved}개는 유지했습니다.` : ''}`);
      } else setError('주차 변경을 저장하지 못했습니다. 기존 일정과 초안은 유지했습니다. 다시 시도해 주세요.');
    } catch (e) { setError((e as Error).message); }
  };
  return <>
    <Button disabled={disabled || !subjects.length} onClick={() => setOpen(true)}>주차 한 번에 만들기</Button>
    <Modal open={open} title="강의 주차 만들기" onClose={() => setOpen(false)}>
      <div className="learning-schedule-form">
        <p>첫 강의 날짜부터 마지막 주차 기준일까지 7일 간격으로 만듭니다. 기한과 출석 상태는 자동으로 채우지 않습니다.</p>
        {blocked ? <><p role="alert">{error}</p><Button onClick={() => { try { const saved = readWeeksDraft(data, scope); raw.current = saved.raw; current.current = saved.draft ?? initial(); setDraft(current.current); setBlocked(false); setError(''); } catch (e) { setError((e as Error).message); } }}>초안 다시 읽기</Button></> : <>
          {!fixedSubjectId && <Select label="주차를 만들 과목" value={draft.subjectId} disabled={Boolean(draft.rows.length)} onChange={e => patch({ subjectId: e.target.value, name: subjects.find(s => s.id === e.target.value)?.name ?? '', batch: null })}>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select>}
          <div className="learning-schedule-columns">
            <Input label="첫 강의 날짜" type="date" value={draft.start} disabled={Boolean(draft.rows.length)} onChange={e => patch({ start: e.target.value })} />
            <Input label="마지막 주차 기준일" type="date" value={draft.end} disabled={Boolean(draft.rows.length)} onChange={e => patch({ end: e.target.value })} />
            <Input label="시작 주차" type="number" min="1" value={draft.firstWeek} disabled={Boolean(draft.rows.length)} onChange={e => patch({ firstWeek: Number(e.target.value) })} />
          </div>
          <Input label="주차 이름의 앞부분" value={draft.name} disabled={Boolean(draft.rows.length)} onChange={e => patch({ name: e.target.value })} />
          <div className="actions"><Button disabled={Boolean(draft.rows.length)} onClick={generate}>주차 미리보기</Button>{Boolean(draft.rows.length) && <Button onClick={() => { patch({ rows: [], generatedStart: '' }); setNotice('미리보기만 비웠습니다. 저장된 주차와 되돌리기 정보는 유지했습니다.'); }}>미리보기 초기화</Button>}</div>
          {/* biome-ignore lint/a11y/useSemanticElements: This names a non-form control/content group; fieldset would imply a form group. */}
<div className="learning-schedule-form" role="group" aria-label="주차 미리보기">{draft.rows.map((row, index) => {
            const duplicate = weekDuplicate(existing, draft.subjectId, series, row);
            const edit = (p: Partial<typeof row>) => patch({ rows: current.current.rows.map((r, i) => i === index ? { ...r, ...p } : r) });
            return <details key={row.week}><summary>{row.week}주차 · {row.opensDate}{row.excluded ? ' · 제외' : duplicate ? ` · ${duplicate.deletedAt ? '휴지통에 보관됨' : '이미 등록됨'}` : ''}</summary>
              <Checkbox label={`${row.week}주차 휴강·제외`} checked={row.excluded} onChange={e => edit({ excluded: e.target.checked })} />
              <Input label={`${row.week}주차 이름`} value={row.name} onChange={e => edit({ name: e.target.value })} />
              <Input label={`${row.week}주차 강의 날짜`} type="date" value={row.opensDate} onChange={e => edit({ opensDate: e.target.value })} />
              <Input label={`${row.week}주차 출석 기한 · 선택`} type="date" value={row.dueDate} onChange={e => edit({ dueDate: e.target.value })} />
              <Textarea label={`${row.week}주차 메모 · 선택`} value={row.note} onChange={e => edit({ note: e.target.value })} />
              {duplicate && <p className="muted">이 주차는 새로 등록하지 않습니다. 저장된 일정의 수정·복원은 일정 화면에서 할 수 있습니다.</p>}
            </details>;
          })}</div>
          {Boolean(draft.rows.length) && <Button variant="primary" disabled={disabled || !count} onClick={save}>{count}개 주차 등록</Button>}
          {draft.batch && <Button disabled={disabled} onClick={reverse}>{draft.batch.reversed ? '되돌린 주차 복원' : '이번 주차 생성 되돌리기'}</Button>}
          {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
        </>}
        <Button onClick={() => setOpen(false)}>닫고 초안 보관</Button>
      </div>
    </Modal>
  </>;
}
