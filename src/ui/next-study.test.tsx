import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { emptyRecommendations, recommendationKey, readRecommendations, saveRecommendations } from '../data/recommendations';
import { NextStudy } from './next-study';
const data = createDemoState(), subjects = ['demo-subject-math', 'demo-subject-science'];
const show = () => render(<NextStudy data={data} subjectIds={subjects} semesterId="demo-semester-current" />);
const newGoal = () => {
  fireEvent.click(screen.getByRole('button', { name: '확인할 내용 추가' }));
  fireEvent.change(screen.getByRole('combobox', { name: '확인할 주제' }), { target: { value: 'demo-topic-function' } });
  fireEvent.change(screen.getByRole('textbox', { name: '자료 없이 확인할 내용' }), { target: { value: '  조건을 설명하기\n예외도 남기기  ' } });
  fireEvent.click(screen.getByRole('button', { name: '확인할 내용 저장' }));
};
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
describe('next study UI persistence and meaning', () => {
  it('opens and focuses schedule controls without changing saved evidence', () => {
    const workspace = emptyRecommendations(data);
    workspace.schedules = [{ id: 'ux-schedule', subjectId: subjects[0], name: 'UX 확인용 과제', kind: 'assignment', goalIds: [], targetIds: [], dueDate: '2026-10-08', opensDate: '', weight: null, status: 'active', states: {}, dueMeaning: 'submission', note: '  이유와 예외\n원문 보존  ' }];
    const saved = saveRecommendations(data, workspace, null);
    const scroll = vi.fn(), originalScroll = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scroll;
    try {
      const view = show();
      const panel = view.container.querySelector<HTMLDetailsElement>('#learning-schedules')!;
      const summary = panel.querySelector('summary')!;
      const jump = screen.getAllByRole('link', { name: '일정에서 확인하기' })[0];
      expect(panel.open).toBe(false);
      fireEvent.click(jump);
      expect(panel.open).toBe(true);
      expect(summary).toHaveFocus();
      expect(scroll).toHaveBeenCalledWith({ block: 'start' });
      panel.open = false;
      fireEvent.click(jump);
      expect(panel.open).toBe(true);
      expect(summary).toHaveFocus();
      expect(localStorage.getItem(recommendationKey(data))).toBe(saved);
      view.unmount();
      const reopened = show();
      expect(reopened.container.querySelector<HTMLDetailsElement>('#learning-schedules')?.open).toBe(false);
      expect(readRecommendations(data).workspace.schedules).toEqual(workspace.schedules);
    } finally { HTMLElement.prototype.scrollIntoView = originalScroll; }
  });
  it('connects failure to correction and independent recheck without creating a study record', () => {
    const original = JSON.stringify(data); show(); newGoal();
    fireEvent.click(screen.getByRole('button', { name: '확인한 결과 남기기' }));
    expect(screen.getByRole('combobox', { name: '확인 결과' })).toHaveValue('unknown');
    expect(screen.getByRole('combobox', { name: '도움 사용' })).toHaveValue('unknown');
    fireEvent.change(screen.getByRole('combobox', { name: '확인 결과' }), { target: { value: 'fail' } });
    fireEvent.change(screen.getByRole('combobox', { name: '도움 사용' }), { target: { value: 'none' } });
    fireEvent.change(screen.getByRole('combobox', { name: '실제로 확인한 문항' }), { target: { value: 'same' } });
    fireEvent.click(screen.getByRole('button', { name: '수행 결과 저장' }));
    fireEvent.click(screen.getByRole('button', { name: '다시 정리했어요' }));
    expect(screen.getAllByText(/다시 정리한 기록이 있습니다/)).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: '확인한 결과 남기기' }));
    fireEvent.change(screen.getByRole('combobox', { name: '확인 결과' }), { target: { value: 'pass' } });
    fireEvent.change(screen.getByRole('combobox', { name: '도움 사용' }), { target: { value: 'none' } });
    fireEvent.change(screen.getByRole('combobox', { name: '실제로 확인한 문항' }), { target: { value: 'same' } });
    fireEvent.click(screen.getByRole('button', { name: '수행 결과 저장' }));
    expect(screen.queryByRole('button', { name: '확인한 결과 남기기' })).toBeNull();
    expect(readRecommendations(data).workspace.events).toHaveLength(3); expect(JSON.stringify(data)).toBe(original);
  });
  it('restores the exact optional draft after unmount and remount', () => {
    const view = show(); fireEvent.click(screen.getByRole('button', { name: '확인할 내용 추가' }));
    fireEvent.change(screen.getByRole('textbox', { name: '자료 없이 확인할 내용' }), { target: { value: '  작성 중\n이유와 예외  ' } });
    view.unmount(); show(); fireEvent.click(screen.getByRole('button', { name: '확인할 내용 추가' }));
    expect(screen.getByRole('textbox', { name: '자료 없이 확인할 내용' })).toHaveValue('  작성 중\n이유와 예외  ');
  });
  it('keeps a failed write in the input and retries it without pretending the goal was saved', () => {
    show(); fireEvent.click(screen.getByRole('button', { name: '확인할 내용 추가' }));
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    fireEvent.change(screen.getByRole('textbox', { name: '자료 없이 확인할 내용' }), { target: { value: '저장 실패에도 남길 원문' } });
    expect(screen.getByRole('textbox', { name: '자료 없이 확인할 내용' })).toHaveValue('저장 실패에도 남길 원문');
    expect(localStorage.getItem(recommendationKey(data))).toBeNull();
    set.mockRestore(); fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(readRecommendations(data).workspace.draft.label).toBe('저장 실패에도 남길 원문');
  });
  it('keeps corrupt recommendation source readable in storage and does not block ordinary navigation', () => {
    localStorage.setItem(recommendationKey(data), '{원문 손상'); show();
    expect(screen.getByRole('button', { name: '확인할 내용 추가' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '다른 주제 직접 고르기' })).toBeEnabled();
    expect(localStorage.getItem(recommendationKey(data))).toBe('{원문 손상');
  });
  it('saves an explicit semester period and preserves all other records', () => {
    show(); fireEvent.click(screen.getByRole('button', { name: '학기 기간 설정' }));
    fireEvent.change(screen.getByRole('combobox', { name: '기간을 남길 학기' }), { target: { value: 'demo-semester-current' } });
    fireEvent.change(screen.getByLabelText('학기 시작일 · 선택'), { target: { value: '2026-09-01' } });
    fireEvent.change(screen.getByLabelText('학기 종료일 · 선택'), { target: { value: '2026-12-21' } });
    fireEvent.click(screen.getByRole('button', { name: '학기 기간 저장' }));
    expect(readRecommendations(data).workspace.terms?.['demo-semester-current']).toEqual({ start: '2026-09-01', end: '2026-12-21' });
    expect(data.records).toHaveLength(0);
  });
});
