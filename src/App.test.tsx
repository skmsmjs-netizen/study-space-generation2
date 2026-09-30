import { decodeStoredText } from './data/storage-codec';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_KEY, DemoRepository, readDraft } from './data/demo-repository';
import { TRACE_ITEMS } from './domain/trace';
import { clearRescuedDraft } from './data/draft-safety';
import type { AppState } from './domain/model';

/** Synthetic DOM integration, not physical IME/device/network evidence. */
const firstTopic = 'demo-topic-function';
const secondTopic = 'demo-topic-graph';
const firstName = '함수는 어떤 관계일까?';
const secondName = '그래프에서 변화 읽기';
const state = (): AppState => JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data;
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
  await screen.findByText('시연 자료 · 이 기기에 저장');
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
  it('keeps archive reading available when the main demo cannot be opened', async () => {
    localStorage.setItem(DEMO_KEY, '{broken workspace');
    localStorage.setItem('study-space:demo:draft:multiple:recovery:qa-boot', '  damaged source\r\n');
    render(<App />);
    await screen.findByRole('heading', { name: '시연 자료를 열지 못했습니다' });
    await userEvent.click(screen.getByRole('button', { name: '초안 보관본 확인' }));
    expect(screen.getByRole('heading', { name: '1. 여러 주제 공부 기록' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '원문 내보내기' })).toBeEnabled();
    expect(localStorage.getItem(DEMO_KEY)).toBe('{broken workspace');
  });

  it('opens archive direct routes without a missing-item message and retains both drafts', async () => {
    const key = 'study-space:demo:draft:multiple';
    localStorage.setItem(`${key}:recovery:qa-route`, '{broken original'); localStorage.setItem(key, 'current draft');
    await open('/draft-archives');
    expect(screen.getByRole('heading', { name: '초안 보관본', level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '이 항목을 찾을 수 없습니다' })).toBeNull();
    expect(localStorage.getItem(`${key}:recovery:qa-route`)).toBe('{broken original');
    expect(localStorage.getItem(key)).toBe('current draft');
  });

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
    expect(screen.getByRole('heading', { name: '변화와 관계 / 함수의 표현' })).toBeVisible();
    await user.click(screen.getByRole('checkbox', { name: firstName }));
    await user.click(screen.getByRole('checkbox', { name: secondName }));
    fireEvent.change(recordArea(firstName).getByRole('textbox', { name: '메모' }), { target: { value: '  첫 주제의 생각\n두 번째 줄' } });
    fireEvent.change(recordArea(secondName).getByRole('textbox', { name: '메모' }), { target: { value: '다른 주제의 생각' } });
    await user.click(recordArea(firstName).getByRole('checkbox', { name: '공부함' }));
    await user.click(screen.getByRole('button', { name: '선택한 주제 모두 공부함' }));
    await user.click(screen.getByRole('checkbox', { name: secondName }));
    await user.click(screen.getByRole('checkbox', { name: secondName }));
    expect(recordArea(secondName).getByRole('textbox', { name: '메모' })).toHaveValue('다른 주제의 생각');
    await user.click(screen.getByRole('button', { name: '2개 주제 기록 저장' }));
    await waitFor(() => expect(currentRecords()).toHaveLength(2));
    expect(currentRecords().find(record => record.targetId === firstTopic)?.body).toBe('  첫 주제의 생각\n두 번째 줄');
    expect(currentRecords().find(record => record.targetId === secondTopic)?.body).toBe('다른 주제의 생각');
    expect(new Set(currentRecords().map(record => record.sessionId)).size).toBe(1);
    expect(currentRecords().every(record => record.done)).toBe(true);
  });

  it('restores the same unfinished study draft after unmount without creating a study event', async () => {
    const user = userEvent.setup(), first = await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '아직 마치지 않은 메모\n원문' } });
    await user.click(screen.getByRole('checkbox', { name: '공부함' }));
    const originalDraft = readDraft(localStorage, firstTopic)!;
    expect(currentRecords()).toHaveLength(0);
    first.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open(`/record/${firstTopic}`);
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('아직 마치지 않은 메모\n원문');
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

  it('returns to the expanded subject narrative with its draft, selection and separate subject state', async () => {
    const user = userEvent.setup(); await open('/subject/demo-subject-math');
    const before = state();
    const summary = screen.getByText('과목 개요 · 작성한 내용 있음');
    await user.click(summary);
    const editor = screen.getByRole('textbox', { name: '과목 개요' }) as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: '  돌아와서 이어 쓸 생각\n두 번째 줄\n' } });
    editor.focus(); editor.setSelectionRange(3, 11, 'backward'); fireEvent.select(editor);
    await navigate('/subject/demo-subject-science');
    expect(screen.getByText('과목 개요 · 선택').closest('details')).not.toHaveAttribute('open');
    await navigate('/subject/demo-subject-math');
    const returned = screen.getByRole('textbox', { name: '과목 개요' }) as HTMLTextAreaElement;
    expect(returned).toBeVisible(); expect(returned).toHaveFocus();
    expect(returned).toHaveValue('  돌아와서 이어 쓸 생각\n두 번째 줄\n');
    expect([returned.selectionStart, returned.selectionEnd, returned.selectionDirection]).toEqual([3, 11, 'backward']);
    expect(state()).toEqual(before);
  });

  it('keeps an explicitly collapsed unit narrative collapsed after navigation and remount', async () => {
    const user = userEvent.setup(), view = await open('/node/demo-unit-functions');
    await user.click(screen.getByText('단원 서문 · 선택'));
    fireEvent.change(screen.getByRole('textbox', { name: '단원 서문' }), { target: { value: '닫아 두어도 남을 초안' } });
    await navigate('/'); await navigate('/node/demo-unit-functions');
    expect(screen.getByRole('textbox', { name: '단원 서문' })).toBeVisible();
    await user.click(screen.getByText('단원 서문 · 선택'));
    await navigate('/'); await navigate('/node/demo-unit-functions');
    expect(screen.getByText('단원 서문 · 선택').closest('details')).not.toHaveAttribute('open');
    view.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open('/node/demo-unit-functions');
    expect(screen.getByText('단원 서문 · 선택').closest('details')).not.toHaveAttribute('open');
    await user.click(screen.getByText('단원 서문 · 선택'));
    expect(screen.getByRole('textbox', { name: '단원 서문' })).toHaveValue('닫아 두어도 남을 초안');
    expect(currentRecords()).toHaveLength(0);
  });

  it('keeps narrative editing and saving usable when disclosure hints are corrupt or storage is denied', async () => {
    const hintKey = 'study-space:demo:narrative-disclosure:study-space:demo:narrative:subject-overview:demo-subject-math';
    sessionStorage.setItem(hintKey, '{invalid');
    const user = userEvent.setup(); await open('/subject/demo-subject-math');
    expect(screen.getByText('과목 개요 · 작성한 내용 있음').closest('details')).not.toHaveAttribute('open');
    const nativeSet = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === sessionStorage && key.startsWith('study-space:demo:narrative-disclosure:')) throw new DOMException('denied', 'SecurityError');
      nativeSet.call(this, key, value);
    });
    await user.click(screen.getByText('과목 개요 · 작성한 내용 있음'));
    const editor = screen.getByRole('textbox', { name: '과목 개요' });
    fireEvent.change(editor, { target: { value: '보기 힌트 실패에도 저장할 원문\n' } });
    await user.click(screen.getByRole('button', { name: '내용 저장' }));
    expect(editor).toBeVisible(); expect(editor).toHaveValue('보기 힌트 실패에도 저장할 원문\n');
    expect(state().narratives.find(n => n.id === 'demo-overview-math')?.body).toBe('보기 힌트 실패에도 저장할 원문\n');
    expect(sessionStorage.getItem(hintKey)).toBe('{invalid');
    expect(currentRecords()).toHaveLength(0);
  });

  it.each([
    { route: '/subject/demo-subject-science', kind: 'subject-overview', owner: 'demo-subject-science', label: '과목 개요' },
    { route: '/node/demo-unit-functions', kind: 'unit-introduction', owner: 'demo-unit-functions', label: '단원 서문' },
    { route: `/node/${firstTopic}`, kind: 'topic-note', owner: firstTopic, label: '주제 메모' },
  ])('keeps the first unsaved $kind identity through return and remount before saving once', async ({ route, kind, owner, label }) => {
    const key = `study-space:demo:narrative:${kind}:${owner}`, user = userEvent.setup(), view = await open(route);
    await user.click(screen.getByText(`${label} · 선택`));
    fireEvent.change(screen.getByRole('textbox', { name: label }), { target: { value: '  처음 쓴 원문\n아직 저장 전\n' } });
    const draft = JSON.parse(localStorage.getItem(key)!);
    await navigate('/'); await navigate(route);
    expect(screen.getByRole('textbox', { name: label })).toHaveValue(draft.body);
    expect(screen.getByRole('button', { name: '내용 저장' })).toBeEnabled();
    view.unmount(); await waitFor(() => expect(locked).toBe(false));
    await open(route);
    expect(screen.getByRole('textbox', { name: label })).toHaveValue(draft.body);
    await user.click(screen.getByRole('button', { name: '내용 저장' }));
    expect(state().narratives.filter(n => n.kind === kind && n.ownerId === owner)).toEqual([
      expect.objectContaining({ id: draft.entityId, kind, ownerId: owner, body: draft.body, version: 1 }),
    ]);
    expect(localStorage.getItem(key)).toBeNull();
    expect(currentRecords()).toHaveLength(0);
  });

  it('does not attach a mismatched draft identity to an existing narrative or another owner', async () => {
    const repo = new DemoRepository(localStorage), before = repo.getSnapshot();
    const key = 'study-space:demo:narrative:subject-overview:demo-subject-math';
    const raw = JSON.stringify({ body: '다른 대상의 초안', version: 0, entityId: 'other-narrative' });
    localStorage.setItem(key, raw);
    const user = userEvent.setup(); await open('/subject/demo-subject-math');
    await user.click(screen.getByText('과목 개요 · 작성한 내용 있음'));
    expect(screen.getByRole('button', { name: '내용 저장' })).toBeDisabled();
    expect(localStorage.getItem(key)).toBe(raw); expect(state()).toEqual(before);
    await navigate('/subject/demo-subject-science');
    const otherKey = 'study-space:demo:narrative:subject-overview:demo-subject-science';
    localStorage.setItem(otherKey, JSON.stringify({ body: '소속이 다른 글', version: 1, entityId: 'demo-overview-math' }));
    await navigate('/'); await navigate('/subject/demo-subject-science');
    await user.click(screen.getByText('과목 개요 · 선택'));
    await user.click(screen.getByRole('button', { name: '내용 저장' }));
    expect(state()).toEqual(before);
    expect(localStorage.getItem(otherKey)).toContain('소속이 다른 글');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('reports stale persistence without clearing or committing the study draft', async () => {
    const user = userEvent.setup(); await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '실패해도 남아야 하는 글' } });
    const external = new DemoRepository(localStorage);
    external.execute({ type: 'addSemester', id: 'outside', name: '외부 시연 변경', opId: 'outside-op', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(screen.getByRole('alert')).toHaveTextContent('다른 창');
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('실패해도 남아야 하는 글');
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

  it('uses an empty marker when draft removal fails so a committed result never returns as input', async () => {
    const user = userEvent.setup(); await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '저장할 본문' } });
    const originalRemove = Storage.prototype.removeItem;
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
      if (key === `study-space:demo:draft:${firstTopic}`) throw new Error('초안 정리 실패');
      return originalRemove.call(this, key);
    });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(currentRecords()).toHaveLength(1);
    expect(currentRecords()[0].body).toBe('저장할 본문');
    expect(readDraft(localStorage, firstTopic)).toBeNull();
    await navigate(`/record/${firstTopic}`);
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('');
    expect(currentRecords()).toHaveLength(1);
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


describe('multiple free notes and search', () => {
  it('keeps legacy unsaved text apart from a new note, with stable IDs on return', async () => {
    localStorage.setItem('study-space:demo:narrative:free-note:null', JSON.stringify({body:'  이전 초안\n원문',version:0}));
    const user = userEvent.setup(); await open('/free');
    expect(screen.getByRole('textbox',{name:'자유 기록'})).toHaveValue('  이전 초안\n원문');
    await user.click(screen.getByRole('button',{name:'새 자유 기록'}));
    await waitFor(()=>expect(screen.getByRole('textbox',{name:'자유 기록'})).toHaveValue(''));
    fireEvent.change(screen.getByRole('textbox',{name:'자유 기록'}),{target:{value:'별도 새 기록'}});
    await user.click(screen.getByRole('button',{name:'내용 저장'}));
    await waitFor(()=>expect(state().narratives.filter(n=>n.kind==='free-note')).toHaveLength(1));
    const newId=state().narratives.find(n=>n.kind==='free-note')!.id;
    await navigate('/free');
    expect(screen.getByRole('textbox',{name:'자유 기록'})).toHaveValue('  이전 초안\n원문');
    await user.click(screen.getByRole('button',{name:'내용 저장'}));
    expect(state().narratives.filter(n=>n.kind==='free-note')).toHaveLength(2);
    expect(state().narratives.find(n=>n.id===newId)?.body).toBe('별도 새 기록');
    await navigate(`/free/${newId}`);
    fireEvent.change(screen.getByRole('textbox',{name:'자유 기록'}),{target:{value:'별도 새 기록 수정 초안'}});
    await navigate('/'); await navigate(`/free/${newId}`);
    expect(screen.getByRole('textbox',{name:'자유 기록'})).toHaveValue('별도 새 기록 수정 초안');
    await user.click(screen.getByRole('button',{name:'내용 저장'}));
    expect(state().narratives.filter(n=>n.kind==='free-note')).toHaveLength(2);
    expect(state().narratives.find(n=>n.id===newId)?.body).toBe('별도 새 기록 수정 초안');
    expect(currentRecords()).toHaveLength(0);
  });
  it('finds free notes and restores search on return without publishing composition', async () => {
    const repo=new DemoRepository(localStorage);
    repo.execute({type:'updateNarrative',id:'note-search',kind:'free-note',ownerId:null,body:'검색 전용 자유 메모',expectedVersion:0,userId:'demo-learner',namespace:'demo',opId:'note-search-op',at:'2026-09-30T00:00:00Z'});
    await open('/search');
    const search=screen.getByRole('searchbox',{name:'과목·목차·기록 검색'});
    fireEvent.compositionStart(search); fireEvent.change(search,{target:{value:'검색'}});
    expect(screen.queryByRole('link',{name:'검색 전용 자유 메모'})).not.toBeInTheDocument();
    fireEvent.compositionEnd(search,{data:'검색'});
    expect(screen.getByRole('link',{name:'검색 전용 자유 메모'})).toHaveAttribute('href','#/free/note-search');
    await navigate('/free/note-search'); await navigate('/search');
    expect(screen.getByRole('searchbox')).toHaveValue('검색');
    expect(screen.getByRole('link',{name:'검색 전용 자유 메모'})).toBeInTheDocument();
  });
});


it('saves optional deferred activity notes and unknown repetitions without normalizing their text', async () => {
  const user=userEvent.setup(); await open(`/record/${firstTopic}`);
  await user.click(screen.getByText('공부 방법과 체크 · 선택',{exact:true}));
  const group=within(screen.getByRole('checkbox',{name:'이 주제의 질문 한 문장 적기'}).closest('.trace-activity') as HTMLElement);
  await user.click(group.getAllByText('상태·메모·반복 · 선택',{exact:true})[0]);
  await user.selectOptions(group.getByRole('combobox',{name:'활동 상태'}),'deferred');
  fireEvent.change(group.getByRole('textbox',{name:'활동 메모 · 선택'}),{target:{value:'  막힌 조건\n'}});
  await user.click(group.getByRole('button',{name:'한 번 더 함'}));
  await user.selectOptions(group.getByRole('combobox',{name:'횟수의 기억 정도'}),'unknown');
  fireEvent.change(group.getByRole('textbox',{name:'반복 메모 · 선택'}),{target:{value:'  횟수 미정\n'}});
  await user.click(screen.getByRole('button',{name:'1개 주제 기록 저장'}));
  await waitFor(()=>expect(currentRecords()).toHaveLength(1));
  expect(currentRecords()[0].trace.Td1).toMatchObject({status:'deferred',note:'  막힌 조건\n',repeats:[{kind:'unknown',count:null,note:'  횟수 미정\n'}]});
  await navigate(`/node/${firstTopic}`);
  await user.click(screen.getByText('남긴 체크와 시험 전 서술 점검',{exact:true}));
  await user.click(screen.getByText('이 주제에서 답하려는 질문을 한 문장으로 적어보았다. · 보류',{exact:true}));
  expect(screen.getByText('반복 횟수 모름')).toBeInTheDocument();
});


describe('failed draft storage retains text within the current tab', () => {
  it('rescues quota-failed study text through route changes and clears unload protection after save', async () => {
    const user = userEvent.setup(), key = `study-space:demo:draft:${firstTopic}`;
    await open(`/record/${firstTopic}`);
    const originalSet = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name: string, value: string) {
      if (name === key) throw new DOMException('Quota exceeded', 'QuotaExceededError');
      originalSet.call(this, name, value);
    });
    try {
      fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  저장 오류 뒤에도\n입력을 보존' } });
      expect(screen.getByRole('alert')).toHaveTextContent('초안을 보관하지 못했습니다');
      const unload = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(unload);
      expect(unload.defaultPrevented).toBe(true);
      await navigate('/'); await navigate(`/record/${firstTopic}`);
      expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('  저장 오류 뒤에도\n입력을 보존');
      expect(currentRecords()).toHaveLength(0); expect(localStorage.getItem(key)).toBeNull();
      spy.mockRestore();
      await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
      expect(currentRecords()[0].body).toBe('  저장 오류 뒤에도\n입력을 보존');
      const afterSave = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(afterSave);
      expect(afterSave.defaultPrevented).toBe(false);
    } finally { clearRescuedDraft(key); }
  });

  it('keeps new text and corrupt original draft separate after navigation', async () => {
    const key = 'study-space:demo:narrative:free-note:null'; localStorage.setItem(key, '{broken');
    await open('/free');
    try {
      fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '복사할 새 생각' } });
      await navigate('/'); await navigate('/free');
      expect(screen.getByRole('textbox', { name: '자유 기록' })).toHaveValue('복사할 새 생각');
      expect(screen.getByRole('button', { name: '내용 저장' })).toBeDisabled();
      expect(localStorage.getItem(key)).toBe('{broken');
      expect(currentRecords()).toHaveLength(0);
    } finally { clearRescuedDraft(key); }
  });
});


describe('outline changes keep the original study identity', () => {
  it('moves a topic with its record and undo restores the same identity and old parent', async () => {
    const user = userEvent.setup(), repo = new DemoRepository(localStorage);
    repo.execute({ type: 'saveRecords', sessionId: 'move-session', entries: [{ targetId: firstTopic, done: true, body: '옮겨도 남는 원문' }], dateEvidence: { kind: 'unknown' }, opId: 'move-seed', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    const before = state(), parentId = before.nodes.find(node => node.id === firstTopic)!.parentId;
    await open(`/node/${firstTopic}`);
    await user.click(screen.getByText('목차 관리', { exact: true }));
    await user.click(screen.getByText('위치 옮기기', { exact: true }));
    const destination = screen.getByRole('combobox', { name: '옮길 상위 항목' });
    expect(within(destination).queryByRole('option', { name: firstName })).not.toBeInTheDocument();
    await user.selectOptions(destination, '');
    await user.click(screen.getByRole('button', { name: '이 위치로 옮기기' }));
    expect(state().nodes.find(node => node.id === firstTopic)?.parentId).toBeNull();
    expect(currentRecords()).toEqual(before.records);
    expect(screen.getByText('옮겨도 남는 원문')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '되돌리기' }));
    expect(state().nodes.find(node => node.id === firstTopic)?.parentId).toBe(parentId);
    expect(currentRecords()).toEqual(before.records);
  });

  it('applies a personal criterion only to new activity input without changing an old record', async () => {
    const user = userEvent.setup(), repo = new DemoRepository(localStorage);
    repo.execute({ type: 'saveRecords', sessionId: 'criteria-old', entries: [{ targetId: firstTopic, done: true, trace: { T1: { status: 'checked', note: '이전 정의로 시도' }, Cself1: { status: 'unchecked', note: '지난 자기화 기록' } } }], dateEvidence: { kind: 'unknown' }, opId: 'criteria-old', userId: 'demo-learner', namespace: 'demo', at: '2026-09-29T03:00:00.000Z' });
    const before = currentRecords(); await open(`/node/${firstTopic}`);
    await user.click(screen.getByRole('button', { name: '공부 기준 조정' }));
    fireEvent.change(screen.getAllByRole('textbox', { name: '항목 문구' })[0], { target: { value: '질문을 그림으로 나타내 보았다.' } });
    await user.selectOptions(screen.getAllByRole('combobox', {name:'적용 여부'})[TRACE_ITEMS.findIndex(item => item.id === 'Cself1')], 'excluded');
    await user.click(screen.getByRole('button', { name: '기준 적용' }));
    expect(currentRecords()).toEqual(before);
    await user.click(screen.getByRole('button', { name: '공부 기록하기' }));
    await waitFor(() => expect(screen.getByRole('checkbox', { name: '질문을 그림으로 나타내 보았다.' })).toBeInTheDocument());
    expect(screen.getByRole('checkbox', { name: '질문을 그림으로 나타내 보았다.' })).not.toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: '질문을 그림으로 나타내 보았다.' }));
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(currentRecords()).toHaveLength(2);
    const newRecord = currentRecords().find(record => record.id !== before[0].id)!;
    expect(newRecord.trace.T1).toBeUndefined();
    expect(Object.values(newRecord.trace)[0].definition?.label).toBe('질문을 그림으로 나타내 보았다.');
    expect(currentRecords().find(record => record.id === before[0].id)).toEqual(before[0]);
    await navigate(`/node/${firstTopic}`);
    for (const summary of screen.getAllByText('남긴 체크와 시험 전 서술 점검')) await user.click(summary);
    expect(screen.getAllByRole('textbox', {name:'시험 전, 자신의 문장으로 설명하기'})).toHaveLength(1);
  });
});


describe('input modals keep separate drafts through close and restart', () => {
  it('keeps semester and subject text separate and clears only the successfully created modal draft', async () => {
    const user = userEvent.setup(); let view = await open('/subjects');
    await user.click(screen.getByRole('button', { name: '학기 추가' }));
    fireEvent.change(screen.getByRole('textbox', { name: '이름' }), { target: { value: '  다음 학기 초안' } });
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: '과목 추가' }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('');
    fireEvent.change(screen.getByRole('textbox', { name: '이름' }), { target: { value: '새 과목 입력' } });
    await navigate('/');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    view.unmount(); await waitFor(() => expect(locked).toBe(false));
    view = await open('/subjects');
    await user.click(screen.getByRole('button', { name: '학기 추가' }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('  다음 학기 초안');
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: '과목 추가' }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('새 과목 입력');
    await user.click(screen.getByRole('button', { name: '추가하기' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await navigate('/subjects'); await user.click(screen.getByRole('button', { name: '과목 추가' }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('');
    expect(state().subjects.filter(subject => subject.name === '새 과목 입력')).toHaveLength(1);
  });

  it('keeps rename drafts scoped to their node and preserves a failed modal write in RAM until retry', async () => {
    const user = userEvent.setup(); await open(`/node/${firstTopic}`);
    await user.click(screen.getByText('목차 관리', { exact: true })); await user.click(screen.getByText('이름 수정', { exact: true }));
    const key = `study-space:demo:modal:rename:${firstTopic}`, original = Storage.prototype.setItem;
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, name, value) { if (name === key) throw Error('quota'); original.call(this, name, value); });
    fireEvent.change(screen.getByRole('textbox', { name: '이름' }), { target: { value: '실패 뒤 남길 이름' } });
    await user.keyboard('{Escape}'); await navigate(`/node/${secondTopic}`);
    await user.click(screen.getByText('목차 관리', { exact: true })); await user.click(screen.getByText('이름 수정', { exact: true }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue(secondName);
    await user.keyboard('{Escape}'); await navigate(`/node/${firstTopic}`);
    await user.click(screen.getByText('목차 관리', { exact: true })); await user.click(screen.getByText('이름 수정', { exact: true }));
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('실패 뒤 남길 이름');
    spy.mockRestore(); await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '다시 시도' }));
    expect(localStorage.getItem(key)).toContain('실패 뒤 남길 이름');
    await user.click(screen.getByRole('button', { name: '이름 저장' }));
    expect(state().nodes.find(node => node.id === firstTopic)?.name).toBe('실패 뒤 남길 이름');
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('archives damaged study bytes before enabling current input, then survives restart and saves once', async () => {
    const user = userEvent.setup(), key = `study-space:demo:draft:${firstTopic}`, broken = '{unfinished original';
    localStorage.setItem(key, broken); const view = await open(`/record/${firstTopic}`);
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '복구한 현재 글\n원문' } });
    await user.click(screen.getByRole('button', { name: '원본 사본 보관 후 입력 이어가기' }));
    const archive = Object.keys(localStorage).find(name => name.startsWith(`${key}:recovery:`));
    expect(archive).toBeTruthy(); expect(localStorage.getItem(archive!)).toBe(broken);
    view.unmount(); await waitFor(() => expect(locked).toBe(false)); await open(`/record/${firstTopic}`);
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('복구한 현재 글\n원문');
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(currentRecords()).toHaveLength(1); expect(currentRecords()[0].body).toBe('복구한 현재 글\n원문');
    expect(localStorage.getItem(archive!)).toBe(broken);
  });

  it('previews individual bulk cells, deduplicates repeated new names and atomically undoes the addition', async () => {
    const user = userEvent.setup(); await open('/subject/demo-subject-math');
    await user.click(screen.getByRole('button', { name: '여러 항목 추가' }));
    fireEvent.change(screen.getByRole('textbox', { name: '항목 1 이름' }), { target: { value: '첫 항목' } });
    fireEvent.change(screen.getByRole('textbox', { name: '항목 2 이름' }), { target: { value: '다음 항목' } });
    fireEvent.change(screen.getByRole('textbox', { name: '항목 3 이름' }), { target: { value: '첫 항목' } });
    expect(screen.getByRole('button', { name: '추가하기' })).toBeDisabled();
    await user.keyboard('{Escape}'); await user.click(screen.getByRole('button', { name: '여러 항목 추가' }));
    expect(screen.getByRole('textbox', { name: '항목 2 이름' })).toHaveValue('다음 항목');
    await user.click(screen.getByRole('button', { name: '추가할 항목 미리보기' }));
    expect(screen.getByRole('region', { name: '추가할 목차 미리보기' })).toHaveTextContent('2개 주제');
    await user.click(screen.getByRole('button', { name: '추가하기' }));
    expect(state().nodes.filter(node => !node.deletedAt && ['첫 항목', '다음 항목'].includes(node.name))).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: '되돌리기' }));
    expect(state().nodes.filter(node => !node.deletedAt && ['첫 항목', '다음 항목'].includes(node.name))).toHaveLength(0);
    expect(currentRecords()).toHaveLength(0);
  });
});

it('keeps a move destination after close and remount, then clears it after a successful move', async () => {
  const user = userEvent.setup(), view = await open(`/node/${firstTopic}`);
  await user.click(screen.getByText('목차 관리', { exact: true })); await user.click(screen.getByText('위치 옮기기', { exact: true }));
  await user.selectOptions(screen.getByRole('combobox', { name: '옮길 상위 항목' }), '');
  await user.keyboard('{Escape}'); view.unmount(); await waitFor(() => expect(locked).toBe(false)); await open(`/node/${firstTopic}`);
  await user.click(screen.getByText('목차 관리', { exact: true })); await user.click(screen.getByText('위치 옮기기', { exact: true }));
  expect(screen.getByRole('combobox', { name: '옮길 상위 항목' })).toHaveValue('');
  await user.click(screen.getByRole('button', { name: '이 위치로 옮기기' }));
  expect(state().nodes.find(node => node.id === firstTopic)?.parentId).toBeNull();
  expect(localStorage.getItem(`study-space:demo:modal:move:${firstTopic}`)).toBeNull();
});

it('never silently replaces a corrupt modal draft across close, and enables recovery only after archiving it', async () => {
  const user = userEvent.setup(), key = 'study-space:demo:modal:semester:global';
  localStorage.setItem(key, '{ damaged original'); await open();
  await user.click(screen.getByRole('button', { name: '학기 추가' }));
  fireEvent.change(screen.getByRole('textbox', { name: '이름' }), { target: { value: '복구할 학기 이름' } });
  await user.keyboard('{Escape}'); await user.click(screen.getByRole('button', { name: '학기 추가' }));
  expect(screen.getByRole('textbox', { name: '이름' })).toHaveValue('복구할 학기 이름');
  expect(screen.getByRole('button', { name: '추가하기' })).toBeDisabled();
  expect(localStorage.getItem(key)).toBe('{ damaged original');
  await user.click(screen.getByRole('button', { name: '원본 사본 보관 후 입력 이어가기' }));
  const archived = Object.keys(localStorage).find(name => name.startsWith(`${key}:recovery:`));
  expect(localStorage.getItem(archived!)).toBe('{ damaged original');
  await user.click(screen.getByRole('button', { name: '추가하기' }));
  expect(state().semesters.filter(semester => semester.name === '복구할 학기 이름')).toHaveLength(1);
});

it('preserves same-parent order across UI reorder and undo without changing records or descendants', async () => {
  const user = userEvent.setup(); await open(`/node/${firstTopic}`);
  const before = state(), original = before.nodes.find(node => node.id === firstTopic)!;
  const sibling = before.nodes.find(node => node.id === secondTopic)!;
  await user.click(screen.getByRole('button', { name: '순서 아래로' }));
  expect(state().nodes.find(node => node.id === firstTopic)!.order).toBeGreaterThan(state().nodes.find(node => node.id === secondTopic)!.order);
  expect(state().nodes.find(node => node.id === firstTopic)!.parentId).toBe(original.parentId);
  expect(currentRecords()).toEqual(before.records);
  await user.click(screen.getByRole('button', { name: '되돌리기' }));
  expect(state().nodes.find(node => node.id === firstTopic)!.order).toBe(original.order);
  expect(state().nodes.find(node => node.id === secondTopic)!.order).toBe(sibling.order);
});

it('retries failed committed-draft cleanup without erasing a later new draft', async () => {
  const user = userEvent.setup(), key = `study-space:demo:draft:${firstTopic}`;
  await open(`/record/${firstTopic}`);
  fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '처음 저장할 글' } });
  const originalSet = Storage.prototype.setItem, originalRemove = Storage.prototype.removeItem;
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, name, value) { if (name === key) throw Error('full'); originalSet.call(this, name, value); });
  const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function(this: Storage, name) { if (name === key) throw Error('denied'); originalRemove.call(this, name); });
  await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
  expect(currentRecords()).toHaveLength(1);
  await waitFor(() => expect(screen.getByRole('button', { name: '저장한 초안 정리 다시 시도' })).toBeInTheDocument());
  write.mockRestore(); remove.mockRestore();
  await navigate(`/record/${firstTopic}`);
  expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('');
  fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '다음 공부의 새 글' } });
  await user.click(screen.getByRole('button', { name: '저장한 초안 정리 다시 시도' }));
  expect(readDraft(localStorage, firstTopic)?.bodies[firstTopic]).toBe('다음 공부의 새 글');
  expect(currentRecords()).toHaveLength(1);
});

it('connects the full course table to the active scope and keeps batch undo available after route changes', async () => {
  const user = userEvent.setup(); await open('/subjects');
  await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'independent');
  await user.click(screen.getByRole('button', { name: '표로 한 번에 만들기' }));
  fireEvent.change(screen.getByRole('textbox', { name: '1번째 과목명' }), { target: { value: '표의 독립 과목' } });
  fireEvent.change(screen.getByRole('textbox', { name: '1번째 과목 1번째 단원' }), { target: { value: '첫 단원' } });
  fireEvent.change(screen.getByRole('textbox', { name: '1번째 과목 1번째 단원 1번째 주제' }), { target: { value: '한 주제' } });
  await user.click(screen.getByRole('button', { name: '생성할 구조 확인' }));
  await user.click(screen.getByRole('button', { name: '한 번에 생성' }));
  const subject = state().subjects.find(row => row.name === '표의 독립 과목')!;
  expect(subject.scope).toEqual({ kind: 'independent' });
  expect(state().nodes.filter(node => node.subjectId === subject.id && !node.deletedAt)).toHaveLength(2);
  await navigate('/');
  await user.click(screen.getByRole('button', { name: '되돌리기' }));
  expect(state().subjects.find(row => row.id === subject.id)?.deletedAt).toBeTruthy();
  expect(state().nodes.filter(node => node.subjectId === subject.id && !node.deletedAt)).toHaveLength(0);
  expect(currentRecords()).toHaveLength(0);
});

it('routes a committed new free note to its saved identity even when both cleanup paths fail, preserving later edits', async () => {
  const user = userEvent.setup(), key = 'study-space:demo:narrative:free-note:new';
  await open('/free/new');
  fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '최초 자유 글' } });
  const draftId = JSON.parse(localStorage.getItem(key)!).entityId;
  const originalSet = Storage.prototype.setItem, originalRemove = Storage.prototype.removeItem;
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, name, value) { if (name === key) throw Error('full'); originalSet.call(this, name, value); });
  const remove = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function(this: Storage, name) { if (name === key) throw Error('denied'); originalRemove.call(this, name); });
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  await waitFor(() => expect(location.hash).toBe(`#/free/${draftId}`));
  expect(screen.getByRole('button', { name: '저장한 초안 정리 다시 시도' })).toBeInTheDocument();
  expect(state().narratives.filter(row => row.kind === 'free-note')).toHaveLength(1);
  write.mockRestore(); remove.mockRestore();
  fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '최초 글을 이어 수정' } });
  await navigate('/'); await navigate(`/free/${draftId}`);
  expect(screen.getByRole('textbox', { name: '자유 기록' })).toHaveValue('최초 글을 이어 수정');
  await user.click(screen.getByRole('button', { name: '저장한 초안 정리 다시 시도' }));
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  expect(state().narratives.filter(row => row.kind === 'free-note')).toHaveLength(1);
  expect(state().narratives.find(row => row.id === draftId)?.body).toBe('최초 글을 이어 수정');
});

it('does not duplicate an already committed new free note after its old disk draft reappears on restart', async () => {
  const user = userEvent.setup(), key = 'study-space:demo:narrative:free-note:new';
  const view = await open('/free/new');
  fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '재실행 후에도 같은 기록' } });
  const oldDraft = localStorage.getItem(key)!, id = JSON.parse(oldDraft).entityId;
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  await waitFor(() => expect(location.hash).toBe(`#/free/${id}`));
  view.unmount(); await waitFor(() => expect(locked).toBe(false));
  localStorage.setItem(key, oldDraft); clearRescuedDraft(key);
  await open('/free/new'); await user.click(screen.getByRole('button', { name: '내용 저장' }));
  await waitFor(() => expect(location.hash).toBe(`#/free/${id}`));
  expect(state().narratives.filter(row => row.kind === 'free-note')).toHaveLength(1);
  expect(localStorage.getItem(key)).toBeNull();
});

it('keeps a differing resurrected free draft apart from the saved record instead of duplicating or overwriting it', async () => {
  const user = userEvent.setup(), key = 'study-space:demo:narrative:free-note:new';
  const view = await open('/free/new');
  fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '초기의 초안' } });
  const oldDraft = localStorage.getItem(key)!, id = JSON.parse(oldDraft).entityId;
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  await waitFor(() => expect(location.hash).toBe(`#/free/${id}`));
  fireEvent.change(screen.getByRole('textbox', { name: '자유 기록' }), { target: { value: '나중에 저장한 글' } });
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  view.unmount(); await waitFor(() => expect(locked).toBe(false));
  localStorage.setItem(key, oldDraft); clearRescuedDraft(key); await open('/free/new');
  expect(screen.getByRole('textbox', { name: '자유 기록' })).toHaveValue('초기의 초안');
  expect(screen.getByRole('link', { name: '저장된 자유 기록 열기' })).toHaveAttribute('href', `#/free/${id}`);
  await user.click(screen.getByRole('button', { name: '내용 저장' }));
  expect(state().narratives.filter(row => row.kind === 'free-note')).toHaveLength(1);
  expect(state().narratives.find(row => row.id === id)?.body).toBe('나중에 저장한 글');
  expect(localStorage.getItem(key)).toBe(oldDraft);
});
