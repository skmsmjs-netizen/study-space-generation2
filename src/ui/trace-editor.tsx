import { useState } from 'react';
import type { ActivityStatus, TraceItem, TraceState } from '../domain/model';
import { TRACE_GROUP_LABELS, TRACE_ITEMS } from '../domain/trace';
import { defaultCriteriaItems } from '../domain/criteria';
import { Button, Checkbox, Input, Select, Textarea } from './index';

const statuses: Record<ActivityStatus, string> = {
  unchecked: '미체크', checked: '체크함', na: '해당 없음', deferred: '보류',
};
const modes = { required: '기본 기준', optional: '선택 기준', excluded: '제외한 기준' };
type Definition = NonNullable<TraceItem['definition']>;
type Repeat = NonNullable<TraceItem['repeats']>[number];

/** Activity edits preserve the definition used at the time and every unrelated field. */
export function TraceEditor({ trace, onChange, definitions = defaultCriteriaItems() }: {
  trace: TraceState;
  onChange: (state: TraceState) => void;
  definitions?: readonly Definition[];
}) {
  const available = definitions.filter(item => item.mode !== 'excluded');
  const currentIds = new Set<string>(available.map(item => item.id));
  const historical = Object.entries(trace).filter(([id]) => !currentIds.has(id));
  const editor = (id: string, definition?: Definition, question?: string) => {
    const item = trace[id] ?? { status: 'unchecked' as const };
    const stored = item.definition ?? definition;
    return (
      <ActivityEditor key={id} id={id} item={item} definition={stored}
        question={item.definition && (item.definition.label !== definition?.label || item.definition.group !== definition?.group) ? undefined : question}
        onChange={patch => onChange({
          ...trace,
          [id]: { ...item, ...patch, ...(stored ? { definition: stored } : {}) },
        })} />
    );
  };
  return (
    <details className="trace-editor">
      <summary>공부 방법과 체크 · 선택</summary>
      <p className="muted">순서 없이 필요한 것을 골라 해 보세요. 체크는 일부 시도와 막힘도 포함합니다. 메모와 추가 반복은 필요할 때만 남기세요.</p>
      {Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => (
        <fieldset key={group}>
          <legend>{label}</legend>
          {available.filter(item => item.group === group).map(item => editor(item.id, item,
            TRACE_ITEMS.find(original => original.id === item.id)?.question))}
        </fieldset>
      ))}
      {historical.length > 0 && (
        <details>
          <summary>이전·개인 기준의 기록 · {historical.length}개</summary>
          <p className="muted">당시 항목의 상태·메모·반복입니다. 현재 항목의 체크로 바꾸지 않습니다.</p>
          {historical.map(([id, item]) => editor(id, item.definition))}
        </details>
      )}
      <details>
        <summary>TRACE 공부 방법 안내</summary>
        <p>흐름 조망(T), 실효 정립(R), 해결 연습(A), 수행 검증(C), 본질 해석(E)은 왕복할 수 있는 활동입니다. 자기화 재구성은 C2에 속하고, 의인화 문답은 여러 활동에 활용하는 선택 기법입니다.</p>
        <p>기본 기준은 매번 모두 해야 한다는 뜻이 아닙니다. 체크·메모·반복은 이해도나 목표 달성의 판정과 구별합니다.</p>
        <p>현재 기준의 항목을 표시하며, 제외하거나 이전 기준으로 남은 기록은 따로 펼쳐 볼 수 있습니다. 주제 화면의 공부 기준 조정에서 항목의 뜻이나 적용 기준을 바꾸면 새 항목으로 구별하고 이전 기록은 보존합니다.</p>
      </details>
    </details>
  );
}

function ActivityEditor({ id, item, definition, question, onChange }: {
  id: string;
  item: TraceItem;
  definition?: Definition;
  question?: string;
  onChange: (patch: Partial<TraceItem>) => void;
}) {
  const label = definition?.label ?? `이전 항목 (${id})`;
  const confirmed = Boolean(item.examReview?.checked);
  const [removed, setRemoved] = useState<{ repeat: Repeat; index: number; nextId?: string }[]>([]);
  const changeRepeat = (id: string, patch: Partial<Repeat>) => onChange({
    repeats: (item.repeats ?? []).map(repeat => repeat.id === id ? { ...repeat, ...patch } : repeat),
  });
  return (
    <div className="trace-activity">
      <Checkbox label={label} checked={item.status === 'checked'} disabled={confirmed}
        onChange={event => onChange({ status: event.target.checked ? 'checked' : 'unchecked' })} />
      {question && <p className="trace-hint">{question}</p>}
      {(item.status === 'na' || item.status === 'deferred') && <p className="trace-hint">{statuses[item.status]}</p>}
      {confirmed && <p className="trace-hint">시험 전 점검을 확인한 기록입니다. 상태를 바꾸려면 원기록에서 점검을 먼저 해제해 주세요. 서술은 그대로 남습니다.</p>}
      <details>
        <summary>{`상태·메모·반복${item.note || item.repeats?.length ? ' · 입력 있음' : ' · 선택'}`}</summary>
        <div className="field-stack">
          <Select label="활동 상태" value={item.status}
            onChange={event => onChange({ status: event.target.value as ActivityStatus })}>
            {Object.entries(statuses).map(([value, text]) => <option key={value} value={value} disabled={confirmed && value !== 'checked'}>{text}</option>)}
          </Select>
          <Textarea label="활동 메모 · 선택" value={item.note ?? ''} rows={3}
            placeholder="막힌 부분이나 이어서 할 일을 필요한 만큼 남기세요."
            onChange={event => onChange({ note: event.target.value })} />
          {definition && <p className="muted">당시 기준: {modes[definition.mode]}</p>}
          {(item.repeats ?? []).map((repeat, index) => {
            const invalid = repeat.kind !== 'unknown' && (!Number.isSafeInteger(repeat.count) || Number(repeat.count) < 1);
            return (
              <fieldset key={repeat.id}>
                <legend>추가 반복 {index + 1}</legend>
                <div className="field-stack">
                  <Select label="횟수의 기억 정도" value={repeat.kind} onChange={event => {
                    const kind = event.target.value as Repeat['kind'];
                    changeRepeat(repeat.id, { kind, count: kind === 'unknown' ? null : repeat.count });
                  }}>
                    <option value="exact">정확한 횟수</option>
                    <option value="minimum">최소 이만큼</option>
                    <option value="unknown">횟수 모름</option>
                  </Select>
                  {repeat.kind !== 'unknown' && <Input label="반복 횟수" type="number" inputMode="numeric" min={1} step={1}
                    value={repeat.count ?? ''} error={invalid ? '기억나는 횟수를 1 이상의 정수로 입력하거나 횟수 모름을 선택해 주세요.' : undefined}
                    onChange={event => changeRepeat(repeat.id, { count: event.target.value === '' ? null : Number(event.target.value) })} />}
                  <Textarea label="반복 메모 · 선택" value={repeat.note ?? ''} rows={2}
                    onChange={event => changeRepeat(repeat.id, { note: event.target.value })} />
                  <Button variant="quiet" onClick={() => {
                    setRemoved(previous => [...previous, { repeat, index, nextId: item.repeats?.[index + 1]?.id }]);
                    onChange({ repeats: (item.repeats ?? []).filter(row => row.id !== repeat.id) });
                  }}>추가 반복 {index + 1} 삭제</Button>
                </div>
              </fieldset>
            );
          })}
          <Button onClick={() => onChange({ repeats: [
            ...(item.repeats ?? []), { id: crypto.randomUUID(), kind: 'exact', count: 1 },
          ] })}>한 번 더 함</Button>
          {removed.length > 0 && <div className="actions">
            <span role="status">반복 입력을 삭제했습니다. 이 편집 화면을 닫기 전에는 되돌릴 수 있습니다.</span>
            <Button disabled={(item.repeats ?? []).some(repeat => repeat.id === removed.at(-1)!.repeat.id)} onClick={() => {
              const last = removed.at(-1)!;
              const repeats = [...(item.repeats ?? [])];
              const nextIndex = repeats.findIndex(repeat => repeat.id === last.nextId);
              repeats.splice(nextIndex < 0 ? Math.min(last.index, repeats.length) : nextIndex, 0, last.repeat);
              onChange({ repeats });
              setRemoved(previous => previous.slice(0, -1));
            }}>반복 삭제 되돌리기</Button>
          </div>}
          <p className="muted">추가로 해 본 활동만 남기세요. 여러 번 했다면 횟수를 바꾸고, 정확히 기억나지 않으면 최소 횟수나 횟수 모름을 선택할 수 있습니다. 체크를 껐다 켜도 반복은 늘어나지 않습니다.</p>
        </div>
      </details>
    </div>
  );
}
