import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TopicRecall } from './topic-recall';
import { DemoRepository, DEMO_KEY } from '../data/demo-repository';
import { recallKey, readRecall } from '../data/topic-recall';
import { clearRescuedDraft } from '../data/draft-safety';
import type { AppState } from '../domain/model';
let repo: DemoRepository;
function Harness() {
  const [data, setData] = useState<AppState>(repo.getSnapshot());
  return <TopicRecall data={data} repository={repo} onSaved={setData} subjectIds={data.subjects.filter(row => !row.deletedAt).map(row => row.id)} />;
}
const editor = () => {
  const toggle = screen.getByText(/글로 쓰기/);
  if (!toggle.parentElement!.hasAttribute('open')) fireEvent.click(toggle);
  return screen.getByRole('textbox', { name: '글' });
};
const save = () => fireEvent.click(screen.getByRole('button', { name: '저장하고 다음' }));
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); clearRescuedDraft(recallKey(repo.getSnapshot())); vi.spyOn(Math, 'random').mockReturnValue(0); });
afterEach(() => vi.restoreAllMocks());
describe('topic explanation cards', () => {
  it('starts with memo paper above a collapsed text option and preserves text through toggling', () => {
    render(<Harness />);
    const toggle = screen.getByText(/글로 쓰기/);
    expect(toggle.parentElement).not.toHaveAttribute('open');
    expect(screen.getByRole('textbox', { name: '글' })).not.toBeVisible();
    const pad = screen.getByRole('region', { name: '펜으로 설명하기' });
    expect(pad.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.change(editor(), { target: { value: '  접어도 보존\n ' } });
    fireEvent.click(screen.getByText(/글로 쓰기/));
    expect(screen.getByRole('textbox', { name: '글' })).not.toBeVisible();
    expect(editor()).toHaveValue('  접어도 보존\n ');
  });
  it('saves exact explanation as a linked new memo and advances without study records', () => {
    render(<Harness />);
    const topic = readRecall(repo.getSnapshot()).currentId, original = repo.getSnapshot();
    const body = '  내 설명\n성립 조건과 아직 모르는 점  ';
    fireEvent.change(editor(), { target: { value: body } });
    expect(readRecall(repo.getSnapshot()).currentId).toBe(topic);
    save();
    expect(repo.getSnapshot().memos).toHaveLength(1);
    expect(repo.getSnapshot().memos![0]).toMatchObject({ ownerId: topic, body, strokes: [] });
    expect(readRecall(repo.getSnapshot()).currentId).not.toBe(topic);
    expect(repo.getSnapshot().records).toEqual(original.records);
    expect(repo.getSnapshot().sessions).toEqual(original.sessions);
    expect(repo.getSnapshot().nodes).toEqual(original.nodes);
  });
  it('restores current card/text on remount and recovers a skipped draft on the next round', () => {
    const view = render(<Harness />), topic = readRecall(repo.getSnapshot()).currentId;
    fireEvent.change(editor(), { target: { value: '跳过也保留\n한국어 초안' } });
    view.unmount(); render(<Harness />);
    expect(readRecall(repo.getSnapshot()).currentId).toBe(topic);
    expect(editor()).toHaveValue('跳过也保留\n한국어 초안');
    const count = repo.getSnapshot().nodes.filter(row => row.role === 'topic').length;
    for (let i = 0; i < count * 2; i++) {
      fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));
      if (readRecall(repo.getSnapshot()).currentId === topic) break;
    }
    expect(readRecall(repo.getSnapshot()).currentId).toBe(topic);
    expect(editor()).toHaveValue('跳过也保留\n한국어 초안');
    expect(repo.getSnapshot().memos ?? []).toHaveLength(0);
  });
  it('retains text/current card on memo write failure and retries once', () => {
    render(<Harness />); const topic = readRecall(repo.getSnapshot()).currentId;
    fireEvent.change(editor(), { target: { value: '저장 실패에도 유지\n ' } });
    const original = Storage.prototype.setItem;
    const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, key, value) {
      if (key === DEMO_KEY) throw Error('시험 저장 실패'); original.call(this, key, value);
    });
    save();
    expect(editor()).toHaveValue('저장 실패에도 유지\n ');
    expect(readRecall(repo.getSnapshot()).currentId).toBe(topic);
    expect(screen.getByRole('alert')).toHaveTextContent('시험 저장 실패');
    failed.mockRestore(); save(); expect(repo.getSnapshot().memos).toHaveLength(1);
  });
  it('does not duplicate a saved memo when advancing draft storage fails then retry succeeds', () => {
    render(<Harness />); fireEvent.change(editor(), { target: { value: '저장 후 초안정리 실패' } });
    const key = recallKey(repo.getSnapshot()), original = Storage.prototype.setItem;
    const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, candidate, value) {
      if (candidate === key) throw Error('초안정리 실패'); original.call(this, candidate, value);
    });
    save(); expect(repo.getSnapshot().memos).toHaveLength(1); expect(editor()).toHaveValue('저장 후 초안정리 실패');
    failed.mockRestore(); save(); expect(repo.getSnapshot().memos).toHaveLength(1); expect(editor()).toHaveValue('');
  });
  it('preserves previous answers as distinct memos on repeated explanation', () => {
    render(<Harness />);
    fireEvent.change(screen.getByRole('combobox', { name: '과목' }), { target: { value: 'demo-subject-math' } });
    const topic = readRecall(repo.getSnapshot()).currentId;
    fireEvent.change(editor(), { target: { value: '첫 설명' } }); save();
    while (readRecall(repo.getSnapshot()).currentId !== topic) fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));
    expect(screen.getByText('이전 메모 1개')).toBeInTheDocument();
    fireEvent.change(editor(), { target: { value: '새 설명' } }); save();
    expect(repo.getSnapshot().memos?.filter(row => row.ownerId === topic).map(row => row.body)).toEqual(['첫 설명', '새 설명']);
  });
  it('blocks transitions during composition and refuses to overwrite malformed sessions', () => {
    const view = render(<Harness />), topic = readRecall(repo.getSnapshot()).currentId;
    fireEvent.compositionStart(editor()); fireEvent.change(editor(), { target: { value: '한글 조합' } });
    expect(screen.getByRole('button', { name: '건너뛰기' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '저장하고 다음' })).toBeDisabled();
    expect(readRecall(repo.getSnapshot()).currentId).toBe(topic);
    fireEvent.compositionEnd(editor()); view.unmount();
    const key = recallKey(repo.getSnapshot()); localStorage.setItem(key, '{원래 손상 원문');
    render(<Harness />); expect(screen.getByRole('alert')).toHaveTextContent('주제 카드 초안을 열지 못했습니다');
    expect(localStorage.getItem(key)).toBe('{원래 손상 원문'); expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
