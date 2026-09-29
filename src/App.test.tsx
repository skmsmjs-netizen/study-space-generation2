import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_KEY, DemoRepository, readDraft } from './data/demo-repository';
import type { AppState } from './domain/model';

/** Synthetic DOM integration, not physical IME/device/network evidence. */
const firstTopic = 'demo-topic-function';
const secondTopic = 'demo-topic-graph';
const firstName = '함수는 어떤 관계일까?';
const secondName = '그래프에서 변화 읽기';
const state = (): AppState => JSON.parse(localStorage.getItem(DEMO_KEY)!).data;
const currentRecords = () => state().records.filter(record => !record.deletedAt);
let locked = false;
let lockRequest: ReturnType<typeof vi.fn>;
const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); locked = false;
  history.replaceState(null, '', '/#/');
  lockRequest = vi.fn(async (_name: string, _options: LockOptions, callback: (lock: Lock | null) => unknown) => {
    if (locked) return await callback(null);
    locked = true;
    try { return await callback({ name: 'study-space:demo:writer', mode: 'exclusive' } as Lock); }
    finally { locked = false; }
  });
  Object.defineProperty(navigator, 'locks', { configurable: true, value: { request: lockRequest } });
});
afterEach(async () => {
  cleanup(); await Promise.resolve(); vi.restoreAllMocks();
  if (nativeLocks) Object.defineProperty(navigator, 'locks', nativeLocks);
  else Reflect.deleteProperty(navigator, 'locks');
});

async function open(path = '/') {
  history.replaceState(null, '', `/#${path}`);
  const view = render(<App />);
  await screen.findByText('가짜 자료로 살펴보는 시연 공간 · 이 기기에만 저장됩니다');
  return view;
}
async function navigate(path: string) {
  await act(async () => { history.replaceState(null, '', `/#${path}`); window.dispatchEvent(new HashChangeEvent('hashchange')); });
}
function recordArea(title: string) {
  const heading = screen.getByRole('heading', { name: title, level: 2 });
  return within(heading.closest('.record-entry') as HTMLElement);
}

describe('prototype write ownership', () => {
  it('rejects a second writer without initializing or changing storage', async () => {
    const repo = new DemoRepository(localStorage), before = localStorage.getItem(DEMO_KEY);
    expect(repo.getSnapshot().namespace).toBe('demo'); locked = true;
    render(<App />);
    expect(await screen.findByRole('heading', { name: '시연 자료를 열지 못했습니다' })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('다른 창');
    expect(localStorage.getItem(DEMO_KEY)).toBe(before);
    expect(lockRequest).toHaveBeenCalledWith('study-space:demo:writer', { ifAvailable: true }, expect.any(Function));
    expect(screen.queryByRole('button', { name: '공부 기록하기' })).not.toBeInTheDocument();
  });

  it('releases the single writer on unmount so a later mount can continue', async () => {
    const first = await open(); expect(locked).toBe(true);
    first.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open(); expect(locked).toBe(true);
    expect(lockRequest).toHaveBeenCalledTimes(2);
  });
});

describe('study flows preserve meaning and input', () => {
  it('records one bodyless study despite repeated clicks and undoes without losing revision history', async () => {
    const user = userEvent.setup(); await open();
    const quick = screen.getAllByRole('button', { name: '공부함' })[0];
    await user.dblClick(quick); fireEvent.click(quick);
    expect(currentRecords()).toHaveLength(1);
    expect(currentRecords()[0]).toMatchObject({ targetId: firstTopic, done: true, body: '' });
    expect(quick).toHaveTextContent('새 기록');
    const revisions = state().revisions.length;
    await user.click(screen.getByRole('button', { name: '되돌리기' }));
    expect(currentRecords()).toHaveLength(0);
    expect(state().revisions.length).toBeGreaterThan(revisions);
    await navigate('/');
    expect(screen.getAllByRole('button', { name: '공부함' })[0]).toBeEnabled();
  });

  it('keeps individual notes through bulk study marking and selection changes', async () => {
    const user = userEvent.setup(); await open('/record');
    await user.click(screen.getByRole('checkbox', { name: `${firstName}수학의 기초` }));
    await user.click(screen.getByRole('checkbox', { name: `${secondName}수학의 기초` }));
    fireEvent.change(recordArea(firstName).getByRole('textbox', { name: '남길 생각 · 선택' }), { target: { value: '  첫 주제의 생각\n두 번째 줄' } });
    fireEvent.change(recordArea(secondName).getByRole('textbox', { name: '남길 생각 · 선택' }), { target: { value: '다른 주제의 생각' } });
    await user.click(recordArea(firstName).getByRole('checkbox', { name: '공부함' }));
    await user.click(screen.getByRole('button', { name: '선택한 주제 모두 공부함' }));
    await user.click(screen.getByRole('checkbox', { name: `${secondName}수학의 기초` }));
    await user.click(screen.getByRole('checkbox', { name: `${secondName}수학의 기초` }));
    expect(recordArea(secondName).getByRole('textbox', { name: '남길 생각 · 선택' })).toHaveValue('다른 주제의 생각');
    await user.click(screen.getByRole('button', { name: '2개 주제 기록 저장' }));
    await waitFor(() => expect(currentRecords()).toHaveLength(2));
    expect(currentRecords().find(record => record.targetId === firstTopic)?.body).toBe('  첫 주제의 생각\n두 번째 줄');
    expect(currentRecords().find(record => record.targetId === secondTopic)?.body).toBe('다른 주제의 생각');
    expect(new Set(currentRecords().map(record => record.sessionId)).size).toBe(1);
    expect(currentRecords().every(record => record.done)).toBe(true);
  });

  it('restores the same unfinished study draft after unmount without creating a study event', async () => {
    const user = userEvent.setup(), first = await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '남길 생각 · 선택' }), { target: { value: '아직 마치지 않은 메모\n원문' } });
    await user.click(screen.getByRole('checkbox', { name: '공부함' }));
    const originalDraft = readDraft(localStorage, firstTopic)!;
    expect(currentRecords()).toHaveLength(0);
    first.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open(`/record/${firstTopic}`);
    expect(screen.getByRole('textbox', { name: '남길 생각 · 선택' })).toHaveValue('아직 마치지 않은 메모\n원문');
    expect(screen.getByRole('checkbox', { name: '공부함' })).not.toBeChecked();
    expect(readDraft(localStorage, firstTopic)?.sessionId).toBe(originalDraft.sessionId);
    expect(currentRecords()).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    await waitFor(() => expect(currentRecords()).toHaveLength(1));
    expect(currentRecords()[0]).toMatchObject({ sessionId: originalDraft.sessionId, body: '아직 마치지 않은 메모\n원문', done: false });
    expect(readDraft(localStorage, firstTopic)).toBeNull();
  });

  it('keeps edits separate from saved record, restores them, and creates a new revision on save', async () => {
    const repo = new DemoRepository(localStorage);
    repo.execute({ type: 'saveRecords', sessionId: 'existing-session', entries: [{ targetId: firstTopic, done: true, body: '기존 원문' }], dateEvidence: { kind: 'unknown' }, opId: 'seed-record', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    const original = currentRecords()[0], user = userEvent.setup(), first = await open(`/node/${firstTopic}`);
    await user.click(screen.getByRole('button', { name: '기록 수정' }));
    fireEvent.change(screen.getByRole('textbox', { name: '기록 수정' }), { target: { value: '기존 원문\n이어 쓴 설명' } });
    await user.click(screen.getByRole('button', { name: '초안 두고 닫기' }));
    expect(currentRecords()[0].body).toBe('기존 원문');
    first.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open(`/node/${firstTopic}`);
    expect(screen.getByRole('textbox', { name: '기록 수정' })).toHaveValue('기존 원문\n이어 쓴 설명');
    await user.click(screen.getByRole('button', { name: '수정 저장' }));
    expect(currentRecords()[0]).toMatchObject({ id: original.id, body: '기존 원문\n이어 쓴 설명', version: original.version + 1 });
    expect(state().revisions.some(revision => revision.entityId === original.id && revision.before && 'body' in revision.before && revision.before.body === '기존 원문')).toBe(true);
    expect(localStorage.getItem(`study-space:demo:record:${original.id}`)).toBeNull();
  });

  it('keeps a free narrative draft across navigation without adding a study record', async () => {
    const user = userEvent.setup(); await open('/free');
    fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '  생각만 남깁니다.\n\n' } });
    await navigate('/'); await navigate('/free');
    expect(screen.getByRole('textbox', { name: '자유 기록' })).toHaveValue('  생각만 남깁니다.\n\n');
    await user.click(screen.getByRole('button', { name: '내용 저장' }));
    expect(state().narratives.find(narrative => narrative.kind === 'free-note')?.body).toBe('  생각만 남깁니다.\n\n');
    expect(currentRecords()).toHaveLength(0);
  });

  it('reports stale persistence without clearing or committing the study draft', async () => {
    const user = userEvent.setup(); await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '남길 생각 · 선택' }), { target: { value: '실패해도 남아야 하는 글' } });
    const external = new DemoRepository(localStorage);
    external.execute({ type: 'addSemester', id: 'outside', name: '외부 시연 변경', opId: 'outside-op', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(screen.getByRole('alert')).toHaveTextContent('다른 창');
    expect(screen.getByRole('textbox', { name: '남길 생각 · 선택' })).toHaveValue('실패해도 남아야 하는 글');
    expect(readDraft(localStorage, firstTopic)?.bodies[firstTopic]).toBe('실패해도 남아야 하는 글');
    expect(currentRecords()).toHaveLength(0);
  });

  it('does not replace an unreadable draft or enable its save action', async () => {
    const key = `study-space:demo:draft:${firstTopic}`;
    localStorage.setItem(key, '{partial-json');
    await open(`/record/${firstTopic}`);
    expect(screen.getByRole('alert')).toHaveTextContent('초안을 읽지 못했습니다');
    expect(screen.getByRole('button', { name: '1개 주제 기록 저장' })).toBeDisabled();
    expect(localStorage.getItem(key)).toBe('{partial-json');
    expect(currentRecords()).toHaveLength(0);
  });

  it('contains a structurally incomplete JSON draft without discarding it', async () => {
    const key = `study-space:demo:draft:${firstTopic}`;
    const broken = JSON.stringify({ key: firstTopic, sessionId: 'orphaned-draft', selectedIds: [firstTopic] });
    localStorage.setItem(key, broken);
    await open(`/record/${firstTopic}`);
    expect(screen.getByRole('alert')).toHaveTextContent('초안');
    expect(screen.getByRole('button', { name: '1개 주제 기록 저장' })).toBeDisabled();
    expect(localStorage.getItem(key)).toBe(broken);
    expect(currentRecords()).toHaveLength(0);
  });

  it('keeps the committed result visible when clearing its draft fails', async () => {
    const user = userEvent.setup(); await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '남길 생각 · 선택' }), { target: { value: '저장할 본문' } });
    const originalRemove = Storage.prototype.removeItem;
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
      if (key === `study-space:demo:draft:${firstTopic}`) throw new Error('초안 정리 실패');
      return originalRemove.call(this, key);
    });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(currentRecords()).toHaveLength(1);
    expect(currentRecords()[0].body).toBe('저장할 본문');
    expect(readDraft(localStorage, firstTopic)?.bodies[firstTopic]).toBe('저장할 본문');
    expect(await screen.findByText(/초안.*정리/)).toBeInTheDocument();
  });

  it('allows written-review unchecking without deleting the answer and reopens the check after editing', async () => {
    const repo = new DemoRepository(localStorage);
    repo.execute({ type: 'saveRecords', sessionId: 'review-session', entries: [{ targetId: firstTopic, done: true }], dateEvidence: { kind: 'unknown' }, opId: 'review-seed', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    const user = userEvent.setup(); await open(`/node/${firstTopic}`);
    await user.click(screen.getByText('남긴 체크와 시험 전 서술 점검'));
    const checked = screen.getByRole('checkbox', { name: '서술을 남기고 점검함' });
    expect(checked).toBeDisabled();
    const answer = screen.getByRole('textbox', { name: '시험 전, 자신의 문장으로 설명하기' });
    fireEvent.change(answer, { target: { value: '정의의 조건을 내 말로 설명합니다.' } });
    await user.click(screen.getByRole('button', { name: '서술 저장' }));
    expect(checked).toBeEnabled(); await user.click(checked); expect(checked).toBeChecked();
    await user.click(checked); expect(checked).not.toBeChecked();
    expect(answer).toHaveValue('정의의 조건을 내 말로 설명합니다.');
    expect(currentRecords()[0].trace.Cself1.examReview?.answer).toBe('정의의 조건을 내 말로 설명합니다.');
    await user.click(checked); expect(checked).toBeChecked();
    fireEvent.change(answer, { target: { value: '조건을 고쳐 쓴 설명입니다.' } });
    expect(checked).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '서술 저장' }));
    expect(checked).not.toBeChecked(); expect(checked).toBeEnabled();
    expect(currentRecords()[0].trace.Cself1.examReview?.answer).toBe('조건을 고쳐 쓴 설명입니다.');
  });
});
