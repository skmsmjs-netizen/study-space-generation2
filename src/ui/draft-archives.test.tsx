import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { DraftArchives, archiveTarget } from './draft-archives';

const key = 'study-space:demo:draft:demo-topic-function';
const archiveKey = `${key}:recovery:qa-archive`;
const raw = '  {broken\r\n한글\t"<img src=x onerror=alert(1)>"\u0000\ud800  ';
beforeEach(() => { localStorage.clear(); localStorage.setItem(archiveKey, raw); localStorage.setItem(key, 'new draft'); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('shows the exact retained content as text, the full target path and unknown historical metadata without writes', () => {
  const before = { ...localStorage };
  render(<DraftArchives data={createDemoState()} />);
  expect(screen.getByRole('heading', { name: /수학의 기초.*변화와 관계.*함수의 표현.*함수는 어떤 관계일까/ })).toBeInTheDocument();
  expect(screen.getByText(/확인된 시각 정보가 없습니다/)).toBeInTheDocument();
  expect(screen.getByText(/현재 저장된 초안과 원문이 다릅니다/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('원문과 식별 정보 확인'));
  expect(screen.getByLabelText('보관본 1 원문')).toHaveAttribute('readonly');
  expect(screen.queryByRole('img')).toBeNull();
  expect({ ...localStorage }).toEqual(before);
});

it('keeps the open snapshot exportable when later storage access fails, and reports download failure with retry', () => {
  const before = { ...localStorage };
  const blobs: Blob[] = [];
  vi.stubGlobal('URL', { createObjectURL: vi.fn((blob: Blob) => { blobs.push(blob); return 'blob:qa'; }), revokeObjectURL: vi.fn() });
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  render(<DraftArchives data={createDemoState()} />);
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
  fireEvent.click(screen.getByRole('button', { name: '원문 내보내기' }));
  expect(blobs).toHaveLength(1); expect(click).toHaveBeenCalledOnce();
  expect(screen.getByRole('status')).toHaveTextContent('다운로드를 요청');
  click.mockImplementation(() => { throw new Error('download blocked'); });
  fireEvent.click(screen.getByRole('button', { name: '원문 내보내기' }));
  expect(screen.getByRole('alert')).toHaveTextContent('보관본과 현재 초안은 변경하지 않았습니다');
  expect(screen.queryByRole('status')).toBeNull();
  read.mockRestore(); expect({ ...localStorage }).toEqual(before);
});

it('reports partial read failures and lets the user read again without treating them as an empty archive', () => {
  const native = Storage.prototype.getItem;
  const read = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function(this: Storage, name) {
    if (name === archiveKey) throw new Error('denied'); return native.call(this, name);
  });
  render(<DraftArchives />);
  expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
  expect(screen.queryByText('현재 확인된 초안 보관본이 없습니다')).toBeNull();
  expect(screen.getByRole('button', { name: '원문 내보내기' })).toBeDisabled();
  read.mockRestore(); fireEvent.click(screen.getByRole('button', { name: '보관본 다시 읽기' }));
  expect(screen.getByRole('button', { name: '원문 내보내기' })).toBeEnabled();
  expect(localStorage.getItem(archiveKey)).toBe(raw);
});

it('does not link a trashed target or infer saved free-record identity from damaged content', () => {
  const data = createDemoState();
  data.nodes.find(node => node.id === 'demo-topic-function')!.deletedAt = '2026-09-30';
  expect(archiveTarget(key, data).href).toBeUndefined();
  expect(archiveTarget(key, data).relation).toContain('휴지통');
  expect(archiveTarget('study-space:demo:narrative:free-note:new', data).href).toBeUndefined();
});

it('copies a lossless export and reports a clipboard rejection without changing the archive', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<DraftArchives />);
  fireEvent.click(screen.getByRole('button', { name: '내보내기 내용 복사' }));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('복사했습니다'));
  expect(JSON.parse(writeText.mock.calls[0][0]).raw).toBe(raw);
  writeText.mockRejectedValue(new Error('denied'));
  fireEvent.click(screen.getByRole('button', { name: '내보내기 내용 복사' }));
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('복사하지 못했습니다'));
  expect(localStorage.getItem(archiveKey)).toBe(raw);
});
