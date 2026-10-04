import { encodeStoredText, decodeStoredText } from './data/storage-codec';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { createDemoState } from './domain/fixtures';
import { DEMO_KEY, readDraft } from './data/demo-repository';

const first = 'demo-topic-function', second = 'demo-topic-graph';
const nativeLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); history.replaceState(null, '', '/?space=demo#/record');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: {
    request: vi.fn(async (_name: string, _options: LockOptions, callback: (lock: Lock) => unknown) =>
      callback({ name: 'study-space:demo:writer', mode: 'exclusive' } as Lock)),
  } });
});
afterEach(async () => {
  cleanup(); await Promise.resolve(); vi.restoreAllMocks();
  if (nativeLocks) Object.defineProperty(navigator, 'locks', nativeLocks);
  else Reflect.deleteProperty(navigator, 'locks');
});
async function open(path = '/record') {
  history.replaceState(null, '', `/?space=demo#${path}`);
  const view = render(<App />); await screen.findByRole('searchbox', { name: '주제 찾기' }); return view;
}
async function navigate(path: string) {
  await act(async () => { history.replaceState(null, '', `/?space=demo#${path}`); window.dispatchEvent(new HashChangeEvent('hashchange')); });
}

describe('record topic filter context', () => {
  it('switches directly past a long first course and saves writing from both courses after reload', async () => {
    const data = createDemoState();
    const topic = data.nodes.find(node => node.id === first)!;
    for (let index = 0; index < 90; index++) data.nodes.push({ ...topic, id: `long-topic-${index}`, name: `긴 첫 과목 주제 ${index}`, order: index + 2 });
    localStorage.setItem(DEMO_KEY, encodeStoredText(JSON.stringify({ sequence: 0, data })));
    const user = userEvent.setup(), view = await open();
    expect(screen.getByRole('option', { name: '수학의 기초 · 92개 주제' })).toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  첫 과목 원문\n' } });
    await user.selectOptions(screen.getByRole('combobox', { name: '기록할 과목' }), 'demo-subject-science');
    expect(screen.queryByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeNull();
    await user.click(screen.getByRole('checkbox', { name: '힘과 움직임' }));
    fireEvent.change(screen.getAllByRole('textbox', { name: '메모' })[1], { target: { value: '두 번째 과목 원문' } });
    const draft = readDraft(localStorage, 'multiple');
    view.unmount(); await Promise.resolve(); await open();
    expect(screen.getByRole('combobox', { name: '기록할 과목' })).toHaveValue('demo-subject-science');
    expect(screen.getByRole('checkbox', { name: '힘과 움직임' })).toBeChecked();
    expect(readDraft(localStorage, 'multiple')).toEqual(draft);
    expect(screen.getAllByRole('textbox', { name: '메모' })[0]).toHaveValue('  첫 과목 원문\n');
    await user.click(screen.getByRole('button', { name: '2개 주제 기록 저장' }));
    const saved = JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data;
    expect(saved.records).toHaveLength(2);
    expect(saved.records.map((record: { subjectId: string }) => record.subjectId)).toEqual(['demo-subject-math', 'demo-subject-science']);
    expect(saved.records.map((record: { sessionId: string }) => record.sessionId)).toEqual([draft!.sessionId, draft!.sessionId]);
  });

  it('lists empty courses with zero topics and a route to add topics rather than hiding them', async () => {
    await open();
    expect(screen.getByRole('option', { name: '스스로 고른 공부 · 0개 주제' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('combobox', { name: '기록할 과목' }), { target: { value: 'demo-subject-independent' } });
    expect(screen.getByRole('link', { name: '과목에서 주제 추가' })).toHaveAttribute('href', '#/subject/demo-subject-independent');
    expect(screen.queryByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeNull();
  });

  it('searches by course name and falls back to all visible courses when the study scope excludes the chosen course', async () => {
    const user = userEvent.setup(); await open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '과학 탐구' } });
    expect(screen.getByRole('checkbox', { name: '힘과 움직임' })).toBeVisible();
    expect(screen.queryByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeNull();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    await user.selectOptions(screen.getByRole('combobox', { name: '기록할 과목' }), 'demo-subject-science');
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'independent');
    expect(screen.getByRole('combobox', { name: '기록할 과목' })).toHaveValue('all');
    expect(screen.getByRole('option', { name: '스스로 고른 공부 · 0개 주제' })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'all');
    expect(screen.getByRole('combobox', { name: '기록할 과목' })).toHaveValue('demo-subject-science');
  });

  it('explains quota failure and retries the same study without losing or duplicating the original', async () => {
    const user = userEvent.setup(); await open();
    await user.click(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  공간 부족에도 보존할 원문\n' } });
    const original = readDraft(localStorage, 'multiple');
    const nativeSet = Storage.prototype.setItem;
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === localStorage && key === DEMO_KEY) throw new DOMException('Quota exceeded', 'QuotaExceededError');
      nativeSet.call(this, key, value);
    });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    expect(screen.getByRole('alert')).toHaveTextContent('저장 공간이 부족');
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue(original!.bodies[first]);
    expect(readDraft(localStorage, 'multiple')).toEqual(original);
    expect(JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data.records).toHaveLength(0);
    write.mockRestore();
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    const saved = JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data.records;
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({ sessionId: original!.sessionId, body: original!.bodies[first] });
  });

  it('limits the picker to the chosen study scope without discarding selected writing', async () => {
    const user = userEvent.setup(); await open();
    await user.click(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  범위를 바꿔도 남을 원문\n' } });
    const draft = readDraft(localStorage, 'multiple');
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'independent');
    expect(screen.queryByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeNull();
    expect(screen.queryByRole('checkbox', { name: '힘과 움직임' })).toBeNull();
    expect(screen.getByText('이 공부 범위에는 기록할 주제가 없습니다')).toBeVisible();
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue(draft!.bodies[first]);
    expect(readDraft(localStorage, 'multiple')).toEqual(draft);
    await user.selectOptions(screen.getByRole('combobox', { name: '공부 범위' }), 'all');
    expect(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    const data = JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data;
    expect(data.records).toHaveLength(1);
    expect(data.records[0]).toMatchObject({ targetId: first, sessionId: draft!.sessionId, body: draft!.bodies[first] });
  });

  it('explains an empty search while keeping the selected draft available to save', async () => {
    const user = userEvent.setup(); await open();
    await user.click(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '검색 중에도 보존할 글' } });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '없는 주제' } });
    expect(screen.getByText('검색어에 맞는 주제가 없습니다')).toBeVisible();
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue('검색 중에도 보존할 글');
    expect(screen.getByRole('button', { name: '1개 주제 기록 저장' })).toBeEnabled();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(screen.queryByText('검색어에 맞는 주제가 없습니다')).toBeNull();
    expect(screen.getByRole('checkbox', { name: '함수는 어떤 관계일까?' })).toBeChecked();
  });

  it('restores the filter on return and remount while preserving the same selected draft and session', async () => {
    const user = userEvent.setup(), view = await open();
    const persisted = localStorage.getItem(DEMO_KEY), input = screen.getByRole('searchbox', { name: '주제 찾기' });
    fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: '함수' } });
    expect(screen.getByRole('checkbox', { name: /그래프에서 변화 읽기/ })).toBeInTheDocument();
    fireEvent.compositionEnd(input, { data: '함수' });
    expect(screen.queryByRole('checkbox', { name: /그래프에서 변화 읽기/ })).toBeNull();
    await user.click(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '  일부만 본 뒤\n이어서 기록할 원문\n' } });
    const draft = readDraft(localStorage, 'multiple');
    await navigate('/'); await navigate('/record');
    expect(screen.getByRole('searchbox', { name: '주제 찾기' })).toHaveValue('함수');
    expect(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ })).toBeChecked();
    expect(screen.getByRole('textbox', { name: '메모' })).toHaveValue(draft!.bodies[first]);
    view.unmount(); await Promise.resolve(); await open();
    expect(screen.getByRole('searchbox', { name: '주제 찾기' })).toHaveValue('함수');
    expect(readDraft(localStorage, 'multiple')).toEqual(draft);
    expect(localStorage.getItem(DEMO_KEY)).toBe(persisted);
  });

  it('keeps filters separate for multiple and explicit targets and preserves deliberate clearing', async () => {
    await open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '움직임' } });
    await navigate(`/record/${first}`);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '함수' } });
    await navigate(`/record/${second}`);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '그래프' } });
    await navigate(`/record/${first}`); expect(screen.getByRole('searchbox')).toHaveValue('함수');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    await navigate('/record'); expect(screen.getByRole('searchbox')).toHaveValue('움직임');
    await navigate(`/record/${second}`); expect(screen.getByRole('searchbox')).toHaveValue('그래프');
    await navigate(`/record/${first}`); expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('keeps selection, text and saving usable when filter hint reads and writes fail', async () => {
    const read = Storage.prototype.getItem, write = Storage.prototype.setItem;
    const prefix = 'study-space:demo:context:record-filter:';
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      if (this === sessionStorage && key.startsWith(prefix)) throw new DOMException('denied', 'SecurityError');
      return read.call(this, key);
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
      if (this === sessionStorage && key.startsWith(prefix)) throw new DOMException('denied', 'SecurityError');
      write.call(this, key, value);
    });
    const user = userEvent.setup(); await open();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '함수' } });
    await user.click(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까/ }));
    fireEvent.change(screen.getByRole('textbox', { name: '메모' }), { target: { value: '검색 힌트 실패에도 남길 원문' } });
    await user.click(screen.getByRole('button', { name: '1개 주제 기록 저장' }));
    const data = JSON.parse(decodeStoredText(localStorage.getItem(DEMO_KEY)!)).data;
    expect(data.records).toHaveLength(1);
    expect(data.records[0]).toMatchObject({ targetId: first, body: '검색 힌트 실패에도 남길 원문' });
  });
});
