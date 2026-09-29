import { useState } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyCommand } from '../domain/commands';
import { criteriaRevisionToken, defaultCriteriaItems, resolveCriteria } from '../domain/criteria';
import { createDemoState } from '../domain/fixtures';
import type { AppState, CriteriaChange } from '../domain/model';
import { CriteriaEditor } from './criteria-editor';
import { clearRescuedDraft, draftHasUnstoredText } from '../data/draft-safety';

const targetId = 'demo-topic-function';
const ctx = (opId: string) => ({ opId, at: '2026-09-30T02:00:00.000Z', userId: 'demo-learner', namespace: 'demo' as const });
const draftKey = `study-space:demo:demo-learner:criteria-draft:${targetId}`;
beforeEach(() => { localStorage.clear(); clearRescuedDraft(draftKey); });
afterEach(() => { vi.restoreAllMocks(); clearRescuedDraft(draftKey); });

function fixture() {
  let current = createDemoState();
  let external: (state: AppState) => void = () => {};
  function Fixture() {
    const [data, setData] = useState(current);
    external = next => { current = next; setData(next); };
    return <CriteriaEditor data={data} targetId={targetId}
      onApply={change => {
        current = applyCommand(current, { ...ctx(change.id), type: 'adjustCriteria', ...change });
        setData(current); return current;
      }}
      onUndo={(revisionId, expectedVersion) => {
        current = applyCommand(current, { ...ctx(`undo-${revisionId}`), type: 'undoRevision', revisionId, expectedVersion });
        setData(current); return current;
      }} />;
  }
  const view = render(<Fixture />);
  return { view, state: () => current, update: (next: AppState) => act(() => external(next)) };
}

describe('criteria adjustment controls', () => {
  it('applies changed definitions with new IDs to the selected scope and provides atomic Undo', async () => {
    const user = userEvent.setup(), form = fixture();
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    const modal = within(screen.getByRole('dialog', { name: '공부 기준 조정' }));
    expect(modal.getAllByLabelText('항목 문구')).toHaveLength(15);
    fireEvent.change(modal.getAllByLabelText('항목 문구')[0], { target: { value: '나의 새로운 질문' } });
    await user.selectOptions(modal.getByLabelText('적용 범위'), 'subject');
    await user.click(modal.getByRole('button', { name: '기준 적용' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const result = resolveCriteria(form.state(), targetId);
    expect(result.items[0].label).toBe('나의 새로운 질문');
    expect(result.items[0].id).not.toBe('Td1');
    expect(resolveCriteria(form.state(), 'demo-topic-graph').id).toBe(result.id);
    expect(form.state().records).toHaveLength(0);
    expect(localStorage.getItem(draftKey)).toBeNull();
    await user.click(screen.getByRole('button', { name: '기준 변경 되돌리기' }));
    expect(resolveCriteria(form.state(), targetId).items).toEqual(defaultCriteriaItems());
  });

  it('preserves adjustment input whitespace through close and remount after failed application', async () => {
    const user = userEvent.setup(), apply = vi.fn((_change: CriteriaChange) => null), data = createDemoState();
    const view = render(<CriteriaEditor data={data} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    fireEvent.change(screen.getAllByLabelText('항목 문구')[0], { target: { value: '  내가 정한 기준  ' } });
    await user.click(screen.getByRole('button', { name: '기준 적용' }));
    expect(screen.getByRole('alert')).toHaveTextContent('입력은 초안에 남아');
    await user.click(screen.getByRole('button', { name: '닫고 초안 보관' }));
    view.unmount();
    render(<CriteriaEditor data={data} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정 · 작성 이어가기' }));
    expect(screen.getAllByLabelText('항목 문구')[0]).toHaveValue('  내가 정한 기준  ');
    expect(apply).toHaveBeenCalledOnce();
  });

  it('requires review of changed criteria and scope while preserving unfinished edits', async () => {
    const user = userEvent.setup(), form = fixture();
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    fireEvent.change(screen.getAllByLabelText('항목 문구')[0], { target: { value: '아직 작성하는 문구' } });
    const external = applyCommand(form.state(), { ...ctx('external-criteria'), type: 'adjustCriteria', id: 'external-criteria', targetId, scope: 'topic', items: defaultCriteriaItems(), expectedToken: criteriaRevisionToken(form.state()) });
    form.update(external);
    expect(screen.getByRole('button', { name: '기준 적용' })).toBeDisabled();
    expect(screen.getAllByLabelText('항목 문구')[0]).toHaveValue('아직 작성하는 문구');
    await user.click(screen.getByRole('button', { name: '현재 기준과 범위를 확인했습니다' }));
    expect(screen.getByRole('button', { name: '기준 적용' })).not.toBeDisabled();
    expect(screen.getAllByLabelText('항목 문구')[0]).toHaveValue('아직 작성하는 문구');
  });

  it('does not overwrite or silently replace an unreadable criteria draft', async () => {
    localStorage.setItem(draftKey, '{broken-original');
    const user = userEvent.setup(), apply = vi.fn(() => null);
    render(<CriteriaEditor data={createDemoState()} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    expect(screen.queryByRole('button', { name: '기준 적용' })).not.toBeInTheDocument();
    expect(screen.queryAllByLabelText('항목 문구')).toHaveLength(0);
    expect(localStorage.getItem(draftKey)).toBe('{broken-original');
    expect(apply).not.toHaveBeenCalled();
  });

  it('keeps adjustment drafts separate when switching subjects without remounting the caller', async () => {
    const data = createDemoState(), apply = vi.fn(() => null), user = userEvent.setup();
    const view = render(<CriteriaEditor data={data} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    fireEvent.change(screen.getAllByLabelText('항목 문구')[0], { target: { value: '첫 주제의 초안' } });
    view.rerender(<CriteriaEditor data={data} targetId="demo-topic-force" onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    expect(screen.getAllByLabelText('항목 문구')[0]).toHaveValue(defaultCriteriaItems()[0].label);
    expect(JSON.parse(localStorage.getItem(draftKey)!).rows[0].label).toBe('첫 주제의 초안');
  });

  it('rescues quota-failed input across route unmount without presenting it as durable storage', async () => {
    const data = createDemoState(), apply = vi.fn(() => null), user = userEvent.setup();
    const view = render(<CriteriaEditor data={data} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    const failWrite = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('quota', 'QuotaExceededError'); });
    fireEvent.change(screen.getAllByLabelText('항목 문구')[0], { target: { value: '  저장에 실패해도 남을 입력  ' } });
    expect(draftHasUnstoredText(draftKey)).toBe(true);
    expect(screen.getByRole('alert')).toHaveTextContent('초안을 보관하지 못했습니다');
    view.unmount();
    render(<CriteriaEditor data={data} targetId={targetId} onApply={apply} />);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정 · 작성 이어가기' }));
    expect(screen.getAllByLabelText('항목 문구')[0]).toHaveValue('  저장에 실패해도 남을 입력  ');
    expect(screen.getByRole('alert')).toHaveTextContent('저장에 실패한 기준 입력');
    failWrite.mockRestore();
    fireEvent.change(screen.getAllByLabelText('항목 문구')[0], { target: { value: '  다시 저장한 입력  ' } });
    expect(draftHasUnstoredText(draftKey)).toBe(false);
    expect(JSON.parse(localStorage.getItem(draftKey)!).rows[0].label).toBe('  다시 저장한 입력  ');
  });
});
