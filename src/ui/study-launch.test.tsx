import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { readStudyLaunch, saveStudyLaunch, studyLaunchKey } from '../data/study-launch';
import { StudyLaunch } from './study-launch';

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());
const nodeId = 'demo-topic-function';
describe('study start and return', () => {
  it('opens optional guidance without saving, starts without creating a study event, and returns after remount', async () => {
    const user = userEvent.setup(), data = createDemoState(), before = structuredClone(data), record = vi.fn();
    const view = render(<StudyLaunch data={data} nodeId={nodeId} onRecord={record} />);
    await user.click(screen.getByRole('button', { name: '공부 시작 안내' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('핵심과 사용 조건');
    expect(localStorage.getItem(studyLaunchKey(data))).toBeNull();
    await user.click(screen.getByRole('button', { name: '공부 시작' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(data).toEqual(before); expect(record).not.toHaveBeenCalled();
    view.unmount();
    render(<StudyLaunch data={data} onRecord={record} />);
    await user.click(screen.getByRole('button', { name: '다 하셨으면 기록하세요' }));
    expect(record).toHaveBeenCalledExactlyOnceWith(nodeId);
    expect(data).toEqual(before);
  });
  it('lets an already studied user enter recording without writing a start hint', async () => {
    const user = userEvent.setup(), data = createDemoState(), record = vi.fn();
    render(<StudyLaunch data={data} nodeId={nodeId} onRecord={record} />);
    await user.click(screen.getByRole('button', { name: '공부 시작 안내' }));
    await user.click(screen.getByRole('button', { name: '이미 공부했어요 · 기록하기' }));
    expect(record).toHaveBeenCalledExactlyOnceWith(nodeId);
    expect(localStorage.getItem(studyLaunchKey(data))).toBeNull();
  });
  it('preserves existing location and drafts on failed start and allows a verified retry', async () => {
    const user = userEvent.setup(), data = createDemoState(), record = vi.fn();
    const old = saveStudyLaunch(data, 'demo-topic-graph');
    localStorage.setItem('record-draft', '이전 본문\n');
    const original = Storage.prototype.setItem;
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      if (key === studyLaunchKey(data)) throw Error('quota');
      original.call(this, key, value);
    });
    render(<StudyLaunch data={data} nodeId={nodeId} onRecord={record} />);
    await user.click(screen.getByRole('button', { name: '공부 시작 안내' }));
    await user.click(screen.getByRole('button', { name: '공부 시작' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('저장을 확인하지 못했습니다');
    expect(readStudyLaunch(data)).toEqual(old);
    write.mockRestore();
    await user.click(screen.getByRole('button', { name: '공부 시작' }));
    expect(readStudyLaunch(data)?.nodeId).toBe(nodeId);
    expect(localStorage.getItem('record-draft')).toBe('이전 본문\n');
    expect(record).not.toHaveBeenCalled();
  });
  it('blocks a stale return and stale open guidance after a subject changes semester', async () => {
    const user = userEvent.setup(), data = createDemoState(), record = vi.fn();
    saveStudyLaunch(data, nodeId);
    const view = render(<StudyLaunch data={data} nodeId={nodeId} onRecord={record} />);
    await user.click(screen.getByRole('button', { name: '공부 시작 안내' }));
    const next = structuredClone(data);
    next.subjects.find(s => s.id === next.nodes.find(n => n.id === nodeId)!.subjectId)!.scope = { kind: 'independent' };
    view.rerender(<StudyLaunch data={next} nodeId={nodeId} onRecord={record} />);
    expect(within(screen.getByRole('dialog')).getByRole('alert')).toHaveTextContent('소속이 달라졌습니다');
    expect(screen.queryByRole('button', { name: '공부 시작' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '다 하셨으면 기록하세요' })).not.toBeInTheDocument();
    expect(record).not.toHaveBeenCalled();
  });
  it('clears only the return hint on another choice and keeps it on removal failure', async () => {
    const user = userEvent.setup(), data = createDemoState(), before = structuredClone(data), choose = vi.fn();
    saveStudyLaunch(data, nodeId); localStorage.setItem('draft', '원문');
    render(<StudyLaunch data={data} onChoose={choose} />);
    const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw Error('unavailable'); });
    await user.click(screen.getByRole('button', { name: '다른 내용 고르기' }));
    expect(choose).not.toHaveBeenCalled(); expect(screen.getByRole('alert')).toHaveTextContent('해제를 확인하지 못했습니다');
    expect(readStudyLaunch(data)?.nodeId).toBe(nodeId);
    remove.mockRestore();
    await user.click(screen.getByRole('button', { name: '다른 내용 고르기' }));
    expect(choose).toHaveBeenCalledOnce(); expect(readStudyLaunch(data)).toBeNull();
    expect(localStorage.getItem('draft')).toBe('원문'); expect(data).toEqual(before);
  });
  it('preserves unreadable content and recovers through a read retry without trapping direct recording', async () => {
    const data = createDemoState(), raw = '  {broken\n', record = vi.fn();
    localStorage.setItem(studyLaunchKey(data), raw);
    render(<StudyLaunch data={data} nodeId={nodeId} onRecord={record} />);
    fireEvent.click(screen.getByRole('button', { name: '공부 시작 안내' }));
    expect(screen.getByRole('button', { name: '공부 시작' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(localStorage.getItem(studyLaunchKey(data))).toBe(raw);
    fireEvent.click(screen.getByRole('button', { name: '이미 공부했어요 · 기록하기' }));
    expect(record).toHaveBeenCalledExactlyOnceWith(nodeId);
    expect(localStorage.getItem(studyLaunchKey(data))).toBe(raw);
  });
});
