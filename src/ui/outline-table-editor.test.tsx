import { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { applyCommand } from '../domain/commands';
import { createDemoState } from '../domain/fixtures';
import type { AppState, Command } from '../domain/model';
import { clearRescuedDraft } from '../data/draft-safety';
import { OutlineTableEditor, outlineTableDraftKey } from './outline-table-editor';
import { modalEditingContextKey } from './modal-context';

const initialScope = { kind: 'semester' as const, semesterId: 'demo-semester-current' };
const key = outlineTableDraftKey(createDemoState());
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { vi.restoreAllMocks(); clearRescuedDraft(key); });
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const start = async () => userEvent.click(screen.getByRole('button', { name: /^표로 한 번에 만들기/ }));
const fill = () => { change('1번째 과목명', '  새 과목  '); change('1번째 과목 1번째 단원', '첫 단원'); change('1번째 과목 1번째 단원 1번째 주제', '주제 하나'); };
function fixture(mode: 'normal' | 'fail' | 'lost-response' = 'normal') {
  let current = createDemoState(), external: (state: AppState) => void = () => {};
  const requests: Command[] = [];
  function Fixture() {
    const [data, setData] = useState(current); external = value => { current = value; setData(value); };
    return <OutlineTableEditor data={data} initialScope={initialScope} onApply={request => {
      requests.push(request);
      if (mode === 'fail') return null;
      current = applyCommand(current, request); setData(current); return mode === 'lost-response' ? null : current;
    }} onUndo={(revisionId, expectedVersion) => {
      current = applyCommand(current, { type: 'undoRevision', revisionId, expectedVersion, opId: 'table-undo', at: new Date().toISOString(), userId: current.userId, namespace: current.namespace }); setData(current); return current;
    }} />;
  }
  const view = render(<Fixture />);
  return { view, requests, state: () => current, update: (value: AppState) => act(() => external(value)) };
}

describe('full subject/unit/topic table editor', () => {
  it('restores the last cell, selection direction, inner input scroll and modal scroll after close and reload', async () => {
    const form = fixture(); await start(); fill();
    const field = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제') as HTMLInputElement;
    await userEvent.click(field);
    field.setSelectionRange(1, 4, 'backward'); field.scrollLeft = 18;
    const dialog = screen.getByRole('dialog');
    // Browsers report no scroll offset for detached elements; jsdom otherwise
    // keeps the assigned number and concealed the close/unmount regression.
    let connectedTop = 520, connectedLeft = 12;
    Object.defineProperties(dialog, {
      scrollTop: { configurable: true, get: () => dialog.isConnected ? connectedTop : 0, set: value => { connectedTop = value; } },
      scrollLeft: { configurable: true, get: () => dialog.isConnected ? connectedLeft : 0, set: value => { connectedLeft = value; } },
    });
    fireEvent.select(field); fireEvent.scroll(dialog);
    await userEvent.keyboard('{Escape}'); await start();
    const restored = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제') as HTMLInputElement;
    await waitFor(() => expect(restored).toHaveFocus());
    expect([restored.selectionStart, restored.selectionEnd, restored.selectionDirection, restored.scrollLeft]).toEqual([1, 4, 'backward', 18]);
    expect(screen.getByRole('dialog').scrollTop).toBe(520);
    expect(screen.getByRole('dialog').scrollLeft).toBe(12);
    // pagehide and remount model the event/persistence boundary; no OS crash claim.
    fireEvent(window, new Event('pagehide')); form.view.unmount(); fixture(); await start();
    const afterReload = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제') as HTMLInputElement;
    await waitFor(() => expect(afterReload).toHaveFocus());
    expect([afterReload.selectionStart, afterReload.selectionEnd, afterReload.selectionDirection]).toEqual([1, 4, 'backward']);
    expect(screen.getByRole('dialog').scrollTop).toBe(520);
    const hint = sessionStorage.getItem(modalEditingContextKey(key))!;
    expect(hint).not.toContain('주제 하나'); expect(hint).not.toContain('새 과목');
  });
  it('ignores a removed cell and never applies its position to the next row', async () => {
    fixture(); await start(); fill(); await userEvent.click(screen.getByRole('button', { name: '주제 추가' }));
    const second = screen.getByLabelText('1번째 과목 1번째 단원 2번째 주제');
    await userEvent.click(second); screen.getByRole('dialog').scrollTop = 600; fireEvent.scroll(screen.getByRole('dialog'));
    await userEvent.click(screen.getByRole('button', { name: '1번째 과목 1번째 단원 2번째 주제 삭제' }));
    await userEvent.keyboard('{Escape}'); await start();
    await waitFor(() => expect(sessionStorage.getItem(modalEditingContextKey(key))).toBeNull());
    expect(screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제')).not.toHaveFocus();
    expect(screen.getByRole('dialog').scrollTop).toBe(0);
  });
  it('does not carry a finished table position into newly generated row IDs', async () => {
    fixture(); await start(); fill();
    const previous = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제');
    await userEvent.click(previous); screen.getByRole('dialog').scrollTop = 600; fireEvent.scroll(screen.getByRole('dialog'));
    await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    await start();
    const fresh = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제');
    expect(fresh.getAttribute('data-table-cell')).not.toBe(previous.getAttribute('data-table-cell'));
    await waitFor(() => expect(sessionStorage.getItem(modalEditingContextKey(key))).toBeNull());
    expect(fresh).not.toHaveFocus(); expect(fresh).toHaveValue(''); expect(screen.getByRole('dialog').scrollTop).toBe(0);
  });
  it('keeps input saving and in-editor position recovery working when optional session storage fails', async () => {
    const form = fixture(); await start(); fill();
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name, value) {
      if (this === sessionStorage) throw new Error('quota'); original.call(this, name, value);
    });
    const field = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제') as HTMLInputElement;
    await userEvent.click(field); field.setSelectionRange(1, 3, 'forward'); screen.getByRole('dialog').scrollTop = 400; fireEvent.select(field);
    change('1번째 과목 1번째 단원 1번째 주제', '보존할 입력'); field.setSelectionRange(1, 3, 'forward'); fireEvent.select(field);
    await userEvent.keyboard('{Escape}'); await start();
    const restored = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제');
    await waitFor(() => expect(restored).toHaveFocus());
    expect(restored).toHaveValue('보존할 입력'); expect(screen.getByRole('dialog').scrollTop).toBe(400);
    expect(localStorage.getItem(key)).toContain('보존할 입력'); expect(form.requests).toHaveLength(0);
  });
  it('ignores malformed or unavailable optional position storage while restoring the raw draft', async () => {
    const form = fixture(); await start(); fill(); await userEvent.keyboard('{Escape}'); form.view.unmount();
    sessionStorage.setItem(modalEditingContextKey(key), '{broken');
    const get = Storage.prototype.getItem;
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, name) { if (this === sessionStorage) throw new Error('denied'); return get.call(this, name); });
    fixture(); await start(); expect(screen.getByLabelText('1번째 과목명')).toHaveValue('  새 과목  ');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('creates multiple courses from individual cells after preview and supports whole-operation undo', async () => {
    const form = fixture(); await start(); fill();
    expect(screen.getByLabelText('학기')).toHaveValue('demo-semester-current');
    await userEvent.click(screen.getByRole('button', { name: '과목 추가' }));
    change('2번째 과목명', '둘째 과목'); change('2번째 과목 1번째 단원', '둘째 단원'); change('2번째 과목 1번째 단원 1번째 주제', '둘째 주제');
    expect(screen.getByRole('button', { name: '한 번에 생성' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' }));
    await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(form.requests).toHaveLength(1);
    expect(form.state().subjects.slice(-2).map(row => row.name)).toEqual(['새 과목', '둘째 과목']); expect(form.state().records).toHaveLength(0);
    expect(localStorage.getItem(key)).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: '표 생성 되돌리기' }));
    expect(form.state().subjects.filter(row => !row.deletedAt)).toHaveLength(4);
  });
  it('retains raw cells and delete undo across close and remount, without rewinding another edited cell', async () => {
    const form = fixture(); await start(); fill();
    await userEvent.click(screen.getByRole('button', { name: '주제 추가' }));
    change('1번째 과목 1번째 단원 2번째 주제', '삭제할 원문');
    await userEvent.click(screen.getByRole('button', { name: '1번째 과목 1번째 단원 2번째 주제 삭제' }));
    change('1번째 과목 1번째 단원 1번째 주제', '삭제 뒤 수정한 글');
    await userEvent.click(screen.getByRole('button', { name: '닫고 표 초안 보관' })); form.view.unmount();
    const next = fixture(); await start();
    expect(screen.getByLabelText('1번째 과목명')).toHaveValue('  새 과목  ');
    await userEvent.click(screen.getByRole('button', { name: '삭제 되돌리기' }));
    expect(screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제')).toHaveValue('삭제 뒤 수정한 글');
    expect(screen.getByLabelText('1번째 과목 1번째 단원 2번째 주제')).toHaveValue('삭제할 원문');
    expect(next.requests).toHaveLength(0);
  });
  it('restores deleted parent blocks with children and keeps only the latest twenty deletions', async () => {
    fixture(); await start(); fill();
    await userEvent.click(screen.getByRole('button', { name: '1번째 과목 1번째 단원 삭제' }));
    expect(screen.queryByLabelText('1번째 과목 1번째 단원')).not.toBeInTheDocument();
    change('1번째 과목명', '나중 과목명');
    await userEvent.click(screen.getByRole('button', { name: '삭제 되돌리기' }));
    expect(screen.getByLabelText('1번째 과목명')).toHaveValue('나중 과목명');
    expect(screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제')).toHaveValue('주제 하나');
    await userEvent.click(screen.getByRole('button', { name: '1번째 과목 삭제' }));
    await userEvent.click(screen.getByRole('button', { name: '삭제 되돌리기' }));
    expect(screen.getByLabelText('1번째 과목 1번째 단원')).toHaveValue('첫 단원');
    for (let index = 0; index < 22; index++) {
      await userEvent.click(screen.getByRole('button', { name: '주제 추가' }));
      await userEvent.click(screen.getByRole('button', { name: '1번째 과목 1번째 단원 2번째 주제 삭제' }));
    }
    expect(JSON.parse(localStorage.getItem(key)!).undo).toHaveLength(20);
  });
  it('moves Enter to the next cell and adds at the last topic, excluding composition Enter', async () => {
    fixture(); await start();
    const subject = screen.getByLabelText('1번째 과목명'), unit = screen.getByLabelText('1번째 과목 1번째 단원'), first = screen.getByLabelText('1번째 과목 1번째 단원 1번째 주제');
    subject.focus(); fireEvent.keyDown(subject, { key: 'Enter' }); expect(unit).toHaveFocus();
    fireEvent.keyDown(unit, { key: 'Enter' }); expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'Enter', isComposing: true });
    expect(screen.queryByLabelText('1번째 과목 1번째 단원 2번째 주제')).not.toBeInTheDocument();
    fireEvent.keyDown(first, { key: 'Enter', keyCode: 229 });
    expect(screen.queryByLabelText('1번째 과목 1번째 단원 2번째 주제')).not.toBeInTheDocument();
    fireEvent.keyDown(first, { key: 'Enter' }); expect(screen.getByLabelText('1번째 과목 1번째 단원 2번째 주제')).toHaveFocus();
  });
  it('offers explicit existing-subject reuse and creates new children without altering original nodes', async () => {
    const form = fixture(), before = structuredClone(form.state()); await start(); fill(); change('1번째 과목명', '수학의 기초');
    expect(screen.getByRole('button', { name: '한 번에 생성' })).toBeDisabled();
    await userEvent.selectOptions(screen.getByLabelText('수학의 기초 처리'), 'demo-subject-math');
    await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    expect(form.state().subjects).toEqual(before.subjects); expect(form.state().nodes.slice(0, before.nodes.length)).toEqual(before.nodes);
    expect(form.state().nodes.at(-1)?.subjectId).toBe('demo-subject-math');
  });
  it('disables an outdated preview until the current structure is reconfirmed', async () => {
    const form = fixture(); await start(); fill(); await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' }));
    form.update(applyCommand(form.state(), { type: 'renameNode', id: 'demo-topic-function', name: '현재 목차 변경', expectedVersion: 1, opId: 'later', at: new Date().toISOString(), userId: form.state().userId }));
    expect(screen.getByRole('button', { name: '한 번에 생성' })).toBeDisabled(); expect(screen.getByRole('alert')).toHaveTextContent('미리보기 이후');
    await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); expect(screen.getByRole('button', { name: '한 번에 생성' })).toBeEnabled();
  });
  it('preserves exact request identities across failed save, close, remount and retry', async () => {
    const form = fixture('fail'); await start(); fill(); await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    const request = form.requests[0]; expect(request).toBeDefined();
    await userEvent.click(screen.getByRole('button', { name: '닫고 표 초안 보관' })); form.view.unmount();
    const next = fixture(); await start(); await userEvent.click(screen.getByRole('button', { name: '표 생성 저장 다시 시도' }));
    expect(next.requests[0]).toEqual(request); expect(next.state().subjects.filter(row => row.name === '새 과목')).toHaveLength(1);
  });
  it('does not duplicate committed subjects after a lost success response or restart', async () => {
    const form = fixture('lost-response'); await start(); fill(); await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    const current = form.state(); form.view.unmount(); const apply = vi.fn();
    render(<OutlineTableEditor data={current} initialScope={initialScope} onApply={apply} />); await start();
    await userEvent.click(screen.getByRole('button', { name: '완료한 표 초안 정리' }));
    expect(apply).not.toHaveBeenCalled(); expect(localStorage.getItem(key)).toBeNull(); expect(current.subjects.filter(row => row.name === '새 과목')).toHaveLength(1);
  });
  it('blocks damaged drafts and archives their exact bytes before starting a new table', async () => {
    localStorage.setItem(key, '{원문 손상'); fixture(); await start();
    expect(screen.queryByLabelText('1번째 과목명')).not.toBeInTheDocument(); expect(localStorage.getItem(key)).toBe('{원문 손상');
    await userEvent.click(screen.getByRole('button', { name: '원문 보관 후 새 표 시작' }));
    expect(screen.getByLabelText('1번째 과목명')).toHaveValue('');
    const archive = Object.keys(localStorage).find(name => name.startsWith(`${key}:recovery:`)); expect(archive).toBeDefined(); expect(localStorage.getItem(archive!)).toBe('{원문 손상');
  });
  it('retains unsaved raw inputs in RAM and avoids creating until the exact pending request can be stored', async () => {
    const form = fixture(); await start(); fill();
    const original = Storage.prototype.setItem; let failing = true;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name, value) { if (name === key && failing) throw Error('quota'); original.call(this, name, value); });
    change('1번째 과목명', '저장 실패 원문');
    await userEvent.click(screen.getByRole('button', { name: '생성할 구조 확인' })); await userEvent.click(screen.getByRole('button', { name: '한 번에 생성' }));
    expect(form.requests).toHaveLength(0); expect(screen.getByRole('alert')).toHaveTextContent('이 창에 남아');
    failing = false; await userEvent.click(screen.getByRole('button', { name: '표 생성 저장 다시 시도' })); expect(form.requests).toHaveLength(1);
    expect(form.state().subjects.at(-1)?.name).toBe('저장 실패 원문');
  });
});
