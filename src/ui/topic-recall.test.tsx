import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TopicRecall } from './topic-recall';
import { DemoRepository, DEMO_KEY } from '../data/demo-repository';
import { recallKey, readRecall, writeRecall } from '../data/topic-recall';
import { clearRescuedDraft } from '../data/draft-safety';
import type { AppState } from '../domain/model';
import { freshRecall } from '../domain/topic-recall';
import { DEFAULT_RECALL_OPTIONS, recallDay, recallQueue } from '../domain/recall-scheduler';
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
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); clearRescuedDraft(recallKey(repo.getSnapshot())); writeRecall(repo.getSnapshot(), { ...readRecall(repo.getSnapshot()), mode: 'random' }); vi.spyOn(Math, 'random').mockReturnValue(0); });
afterEach(() => vi.restoreAllMocks());
describe('topic explanation cards', () => {
  it('releases overdue skipped cards while the screen stays open across a day boundary', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-10-01T12:00:00'));
    try {
      const data = repo.getSnapshot(), topics = data.nodes.filter(n => n.role === 'topic');
      for (const topic of topics) repo.execute({ type: 'reviewRecallCard', id: crypto.randomUUID(), topicId: topic.id, expectedVersion: 0, rating: 4, at: '2026-09-01T03:00:00.000Z', opId: crypto.randomUUID(), userId: data.userId, namespace: data.namespace });
      writeRecall(repo.getSnapshot(), freshRecall()); const view = render(<Harness />);
      for (const _topic of topics) fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));
      expect(screen.getByText('지금 복습할 주제가 없습니다')).toBeInTheDocument();
      act(() => { vi.setSystemTime(new Date('2026-10-02T12:00:00')); vi.advanceTimersByTime(15000); });
      expect(readRecall(data).currentId).not.toBeNull(); expect(readRecall(data).skipped).toEqual([]);
      expect(screen.getByRole('button', { name: '설명 확인하고 평가' })).toBeInTheDocument(); view.unmount();
    } finally { vi.useRealTimers(); }
  });
  it('keeps an original saved answer when the restored answer is edited and evaluated again', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); render(<Harness />);
    fireEvent.change(editor(), { target: { value: '처음 답변' } });
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' })); fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
    fireEvent.click(screen.getByRole('button', { name: '마지막 평가 되돌리기' }));
    fireEvent.change(editor(), { target: { value: '수정한 새 답변' } });
    fireEvent.click(screen.getByRole('button', { name: /^다시\s*1분$/ }));
    expect(repo.getSnapshot().memos?.map(row => row.body)).toEqual(['처음 답변', '수정한 새 답변']);
    expect(repo.getSnapshot().recallCards![0].reviews).toMatchObject([{ rating: 1 }]);
  });
  it('continues to the next fresh topic after skipping with new/day=1', () => {
    const data = repo.getSnapshot();
    repo.execute({ type: 'saveRecallPreferences', id: 'prefs', expectedVersion: 0, options: { ...DEFAULT_RECALL_OPTIONS, newPerDay: 1 }, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString() });
    writeRecall(repo.getSnapshot(), freshRecall()); render(<Harness />);
    const first = readRecall(data).currentId;
    fireEvent.click(screen.getByRole('button', { name: '건너뛰기' }));
    expect(readRecall(data).currentId).not.toBeNull(); expect(readRecall(data).currentId).not.toBe(first);
    expect(repo.getSnapshot().recallCards ?? []).toHaveLength(0);
  });
  it('releases yesterday\'s hidden cards on reload while retaining raw text and ink drafts', () => {
    const data = repo.getSnapshot(), topic = data.nodes.find(row => row.role === 'topic')!;
    const strokes = [{ id: 'ink-day', ink: 'blue' as const, width: 3, points: [{ x: 3, y: 4, pressure: .5 }] }];
    writeRecall(data, { ...freshRecall(), studyDay: '2000-01-01', skipped: data.nodes.filter(n => n.role === 'topic').map(n => n.id), seen: [topic.id], drafts: { [topic.id]: { memoId: 'day-draft', body: '  다음 날도 보존\r\n ', strokes } } });
    render(<Harness />);
    expect(readRecall(data).currentId).not.toBeNull();
    expect(readRecall(data)).toMatchObject({ studyDay: recallDay(new Date().toISOString()), skipped: [], drafts: { [topic.id]: { body: '  다음 날도 보존\r\n ', strokes } } });
  });
  it('restores the rated topic and exact answer after reload, keeps the next topic draft and corrects without duplicate memos', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); const view = render(<Harness />);
    const first = readRecall(repo.getSnapshot()).currentId!;
    fireEvent.change(editor(), { target: { value: '  원래 설명\n ' } });
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
    const next = readRecall(repo.getSnapshot()).currentId!;
    fireEvent.change(editor(), { target: { value: '다음 카드 초안' } });
    view.unmount(); const second = render(<Harness />);
    fireEvent.change(screen.getByRole('combobox', { name: '과목' }), { target: { value: 'demo-subject-science' } });
    fireEvent.click(screen.getByRole('button', { name: '마지막 평가 되돌리기' }));
    expect(screen.getByRole('combobox', { name: '과목' })).toHaveValue('all');
    expect(readRecall(repo.getSnapshot()).currentId).toBe(first);
    expect(editor()).toHaveValue('  원래 설명\n ');
    expect(readRecall(repo.getSnapshot()).drafts[next].body).toBe('다음 카드 초안');
    expect(repo.getSnapshot().memos).toHaveLength(1);
    expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(0);
    second.unmount(); render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    fireEvent.click(screen.getByRole('button', { name: /^다시\s*1분$/ }));
    expect(repo.getSnapshot().memos).toHaveLength(1);
    expect(repo.getSnapshot().recallCards![0].reviews).toMatchObject([{ rating: 1 }]);
  });
  it('retries a committed undo after draft cleanup failure without a second rollback or lost answer', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); const view = render(<Harness />);
    const first = readRecall(repo.getSnapshot()).currentId;
    fireEvent.change(editor(), { target: { value: '되돌리기 원문' } });
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
    const key = recallKey(repo.getSnapshot()), original = Storage.prototype.setItem; let writes = 0;
    const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, candidate, value) {
      if (candidate === key && ++writes > 1) throw Error('되돌리기 초안정리 실패'); original.call(this, candidate, value);
    });
    fireEvent.click(screen.getByRole('button', { name: '마지막 평가 되돌리기' }));
    expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(0); const version = repo.getSnapshot().recallCards![0].version;
    failed.mockRestore(); clearRescuedDraft(key); view.unmount(); render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '평가 되돌리기 다시 시도' }));
    expect(repo.getSnapshot().recallCards![0].version).toBe(version);
    expect(readRecall(repo.getSnapshot()).currentId).toBe(first); expect(editor()).toHaveValue('되돌리기 원문');
  });
  it('reveals reference before four ratings and stores one exact memo with a future schedule', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); render(<Harness />);
    const topic = readRecall(repo.getSnapshot()).currentId;
    expect(screen.queryByRole('button', { name: /^쉬움/ })).not.toBeInTheDocument();
    fireEvent.change(editor(), { target: { value: '  한글 설명\n 1 2 3 4 ' } });
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    expect(screen.getByRole('button', { name: /^다시\s*1분$/ })).toHaveTextContent('1분');
    fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
    expect(repo.getSnapshot().memos![0].body).toBe('  한글 설명\n 1 2 3 4 ');
    expect(repo.getSnapshot().recallCards![0]).toMatchObject({ topicId: topic, reviews: [{ rating: 4 }] });
    expect(readRecall(repo.getSnapshot()).currentId).not.toBe(topic);
    expect(screen.queryByRole('button', { name: /^쉬움/ })).not.toBeInTheDocument();
  });
  it('keeps reference edits as drafts, preserves composition and does not expose the saved reference before reveal', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); const view = render(<Harness />);
    fireEvent.click(screen.getByText('카드 내용·날짜'));
    const input = screen.getByRole('textbox', { name: '참고 설명 입력' });
    fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: '  참고 설명\n ' } });
    expect(input).not.toBeDisabled(); expect(screen.getByRole('button', { name: '참고 설명 저장' })).toBeDisabled();
    fireEvent.compositionEnd(input); view.unmount(); render(<Harness />);
    fireEvent.click(screen.getByText('카드 내용·날짜'));
    expect(screen.getByRole('textbox', { name: '참고 설명 입력' })).toHaveValue('  참고 설명\n ');
    fireEvent.click(screen.getByRole('button', { name: '참고 설명 저장' }));
    expect(repo.getSnapshot().recallCards![0].reference).toBe('  참고 설명\n ');
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    expect(screen.getByText('참고 설명', { selector: 'h3' })).toBeInTheDocument();
    expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(0);
  });
  it('retries a committed rating after draft cleanup failure and reload without doubling the interval or answer', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); const view = render(<Harness />);
    fireEvent.change(editor(), { target: { value: '평가 재시도 원문' } });
    fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' }));
    const key = recallKey(repo.getSnapshot()), original = Storage.prototype.setItem;
    let writes = 0;
    const failed = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, candidate, value) {
      if (candidate === key && ++writes > 1) throw Error('초안정리 실패'); original.call(this, candidate, value);
    });
    fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
    expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(1); const due = repo.getSnapshot().recallCards![0].memory.due;
    failed.mockRestore(); clearRescuedDraft(key); view.unmount(); render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '자기 평가 저장 다시 시도' }));
    expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(1);
    expect(repo.getSnapshot().recallCards![0].memory.due).toBe(due); expect(repo.getSnapshot().memos).toHaveLength(1);
  });
  it('waits when all cards are in the future and allows ungraded random practice', () => {
    writeRecall(repo.getSnapshot(), freshRecall()); render(<Harness />);
    const count = repo.getSnapshot().nodes.filter(row => row.role === 'topic').length;
    for (let i = 0; i < count; i++) { fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' })); fireEvent.click(screen.getByRole('button', { name: /^쉬움/ })); }
    expect(screen.getByText('지금 복습할 주제가 없습니다')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '설명 확인하고 평가' })).not.toBeInTheDocument();
    expect(repo.getSnapshot().memos ?? []).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: '무작위 연습' }));
    expect(screen.getByRole('button', { name: '건너뛰기' })).toBeInTheDocument();
    expect(repo.getSnapshot().recallCards).toHaveLength(count);
  });
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
