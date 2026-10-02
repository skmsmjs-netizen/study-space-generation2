import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { TraceState } from '../domain/model';
import { TRACE_ITEMS } from '../domain/trace';
import { defaultCriteriaItems } from '../domain/criteria';
import { readDraft, saveDraft, type FormDraft } from '../data/demo-repository';
import { TraceEditor } from './trace-editor';

function fixture(initial: TraceState = {}) {
  let latest = initial;
  const change = vi.fn();
  function Fixture() {
    const [trace, setTrace] = useState(initial);
    return <TraceEditor trace={trace} onChange={next => { latest = next; change(next); setTrace(next); }} />;
  }
  render(<Fixture />);
  fireEvent.click(screen.getByText('공부 방법과 체크 · 선택'));
  return { current: () => latest, change };
}
function activity(label: string = '이 주제의 질문 한 문장 적기') {
  const checkbox = screen.getByRole('checkbox', { name: label });
  const row = within(checkbox.closest('.trace-activity') as HTMLElement);
  fireEvent.click(row.getByText(/상태·메모·반복/));
  return { row, checkbox };
}

describe('TRACE optional activity detail', () => {
  it('keeps 15 default attempts optional and does not create records merely by opening', () => {
    const form = fixture();
    expect(screen.getAllByRole('checkbox')).toHaveLength(15);
    expect(form.change).not.toHaveBeenCalled();
    const { checkbox, row } = activity();
    fireEvent.click(checkbox);
    expect(form.current().Td1.status).toBe('checked');
    expect(form.current().Td1.note).toBeUndefined();
    expect(row.getByLabelText('활동 메모 · 선택')).not.toBeRequired();
    expect(form.current().Td1.repeats).toBeUndefined();
    fireEvent.click(checkbox); fireEvent.click(checkbox);
    expect(form.current().Td1.repeats).toBeUndefined();
  });

  it('preserves the original definition, whitespace, repetitions and unrelated legacy entries on a normal check', () => {
    const definition = { id: 'Td1', group: 'T', label: '  당시 직접 정한 질문\n둘째 줄  ', mode: 'optional' as const, version: 7 };
    const initial: TraceState = {
      Td1: { status: 'unchecked', definition, note: '  원래 글\n\n', repeats: [{ id: 'repeat-original', kind: 'minimum', count: 2, note: '  조금  ' }] },
      Clegacy: { status: 'deferred', note: '옛 입력' },
    };
    const form = fixture(initial);
    const checkbox = screen.getByRole('checkbox', { name: /당시 직접 정한 질문/ });
    fireEvent.click(checkbox);
    expect(form.current().Td1).toEqual({ ...initial.Td1, status: 'checked' });
    expect(form.current().Td1.definition).toBe(definition);
    expect(form.current().Clegacy).toBe(initial.Clegacy);
    expect(screen.queryByText(TRACE_ITEMS[0].question)).not.toBeInTheDocument();
  });

  it('keeps deferred and not-applicable distinct while note edits do not mark an attempt', async () => {
    const user = userEvent.setup(), form = fixture();
    const { row, checkbox } = activity();
    await user.selectOptions(row.getByLabelText('활동 상태'), 'na');
    expect(form.current().Td1.status).toBe('na');
    expect(checkbox).not.toBeChecked();
    fireEvent.change(row.getByLabelText('활동 메모 · 선택'), { target: { value: '  조건을 아직 모름\n\n이어 하기  ' } });
    expect(form.current().Td1.note).toBe('  조건을 아직 모름\n\n이어 하기  ');
    expect(form.current().Td1.status).toBe('na');
    await user.selectOptions(row.getByLabelText('활동 상태'), 'deferred');
    expect(form.current().Td1.status).toBe('deferred');
    expect(form.current().Td1.note).toBe('  조건을 아직 모름\n\n이어 하기  ');
  });

  it('edits exact, minimum and unknown repetitions in place without changing IDs, date evidence or activity state', async () => {
    const user = userEvent.setup();
    const repeat = { id: 'old-repeat-id', kind: 'exact' as const, count: 3, note: '  반복 원문\n', dateEvidence: { kind: 'range' as const, from: '2026-09-01', to: '2026-09-03' } };
    const form = fixture({ Td1: { status: 'deferred', repeats: [repeat] } });
    const { row } = activity();
    await user.selectOptions(row.getByLabelText('횟수의 기억 정도'), 'minimum');
    fireEvent.change(row.getByLabelText('반복 횟수'), { target: { value: '4' } });
    fireEvent.change(row.getByLabelText('반복 메모 · 선택'), { target: { value: '  바꾼 메모\n\n' } });
    expect(form.current().Td1.repeats?.[0]).toEqual({ ...repeat, kind: 'minimum', count: 4, note: '  바꾼 메모\n\n' });
    await user.selectOptions(row.getByLabelText('횟수의 기억 정도'), 'unknown');
    expect(form.current().Td1.repeats?.[0]).toEqual({ ...repeat, kind: 'unknown', count: null, note: '  바꾼 메모\n\n' });
    expect(row.queryByLabelText('반복 횟수')).not.toBeInTheDocument();
    expect(form.current().Td1.status).toBe('deferred');
    expect(form.current().Td1.repeats).toHaveLength(1);
  });

  it('preserves an unfinished repeat count in the existing draft and does not replace it with a guessed count', () => {
    const form = fixture(); const { row } = activity();
    fireEvent.click(row.getByRole('button', { name: '한 번 더 함' }));
    const originalId = form.current().Td1.repeats![0].id;
    expect(form.current().Td1.repeats![0].count).toBe(1);
    fireEvent.change(row.getByLabelText('반복 횟수'), { target: { value: '' } });
    expect(row.getByRole('alert')).toHaveTextContent('1 이상의 정수');
    const draft: FormDraft = { key: 'test-trace', sessionId: 'session', selectedIds: ['topic'], bodies: {}, done: {}, trace: { topic: form.current() }, dateEvidence: { kind: 'unknown' } };
    const memory = new Map<string, string>();
    const storage = { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => { memory.set(key, value); } };
    saveDraft(storage, draft);
    const restored = readDraft(storage, 'test-trace');
    expect(restored!.trace.topic.Td1.repeats![0]).toEqual({ id: originalId, kind: 'exact', count: null });
    expect(form.current().Td1.status).toBe('unchecked');
  });

  it('keeps legacy/custom definitions in their own collapsed section and preserves them while editing', () => {
    const custom = { id: 'Rx_personal', group: 'R', label: '내가 고른 기준', mode: 'excluded' as const, version: 3 };
    const form = fixture({ Rx_personal: { status: 'checked', definition: custom, note: '원문' }, C_old: { status: 'na', note: '정의가 없는 옛 기록' } });
    const summary = screen.getByText('이전·개인 기준의 기록 · 2개');
    expect(summary.parentElement).not.toHaveAttribute('open');
    expect(form.change).not.toHaveBeenCalled();
    fireEvent.click(summary);
    const { row } = activity(custom.label);
    fireEvent.change(row.getByLabelText('활동 메모 · 선택'), { target: { value: '  옛 기준 원문\n' } });
    expect(form.current().Rx_personal.definition).toBe(custom);
    expect(form.current().Rx_personal.status).toBe('checked');
    expect(form.current().C_old).toEqual({ status: 'na', note: '정의가 없는 옛 기록' });
    expect(screen.getByText('당시 기준: 제외한 기준')).toBeInTheDocument();
  });

  it('never edits or confirms C2 examReview through ordinary status, note or repeat controls', () => {
    const review = { answer: '  자기 문장\n원문  ', checked: true, updatedAt: '2026-09-29T10:00:00Z' };
    const form = fixture({ Cself1: { status: 'checked', examReview: review } });
    const { row, checkbox } = activity('내 말·그림으로 바꾸고 배운 내용 연결하기');
    expect(checkbox).toBeDisabled();
    expect(row.getByRole('option', { name: '해당 없음' })).toBeDisabled();
    fireEvent.change(row.getByLabelText('활동 메모 · 선택'), { target: { value: '별도 선택 메모' } });
    fireEvent.click(row.getByRole('button', { name: '한 번 더 함' }));
    expect(form.current().Cself1.examReview).toBe(review);
    expect(form.current().Cself1.status).toBe('checked');
    expect(form.current().Cself1.note).toBe('별도 선택 메모');
    expect(row.queryByRole('button', { name: /점검/ })).not.toBeInTheDocument();
  });

  it('restores a deleted repeat with its original ID and text without rewinding later edits', () => {
    const first = { id: 'original-first', kind: 'unknown' as const, count: null, note: '  잊지 않을 원문\n' };
    const second = { id: 'original-second', kind: 'minimum' as const, count: 2, note: '둘째 원문' };
    const form = fixture({ Td1: { status: 'checked', repeats: [first, second] } });
    const { row } = activity();
    fireEvent.click(row.getByRole('button', { name: '추가 반복 1 삭제' }));
    fireEvent.change(row.getByLabelText('반복 메모 · 선택'), { target: { value: '둘째 후속 수정\n' } });
    fireEvent.click(row.getByRole('button', { name: '반복 삭제 되돌리기' }));
    expect(form.current().Td1.repeats).toEqual([first, { ...second, note: '둘째 후속 수정\n' }]);
    expect(form.current().Td1.status).toBe('checked');
    expect(row.queryByRole('button', { name: '반복 삭제 되돌리기' })).not.toBeInTheDocument();
  });

  it('shows the current personal criteria without moving old checks or reviving excluded items', () => {
    const current = [{ ...defaultCriteriaItems()[0], id: 'Tx_new', label: '새로 조정한 활동' }, { ...defaultCriteriaItems()[1], id: 'Tx_excluded', mode: 'excluded' as const }];
    render(<TraceEditor trace={{ Td1: { status: 'checked', definition: defaultCriteriaItems()[0], note: '지난 기준 원문' } }} definitions={current} onChange={vi.fn()} />);
    fireEvent.click(screen.getByText('공부 방법과 체크 · 선택'));
    expect(within(screen.getByRole('group', { name: '흐름 살펴보기' })).getAllByRole('checkbox')).toHaveLength(1);
    expect(screen.getByText('이전·개인 기준의 기록 · 1개').parentElement).not.toHaveAttribute('open');
    expect(screen.getByRole('checkbox', { name: '새로 조정한 활동' })).not.toBeChecked();
    expect(screen.queryByRole('checkbox', { name: defaultCriteriaItems()[1].label })).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('이전·개인 기준의 기록 · 1개'));
    expect(screen.getByRole('checkbox', { name: defaultCriteriaItems()[0].label })).toBeChecked();
  });
});
