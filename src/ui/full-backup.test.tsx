import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { createFullBackup, priorRestoreBackups } from '../data/full-backup';
import { FullBackup } from './full-backup';

vi.mock('../data/full-backup', () => ({
  createFullBackup: vi.fn(), priorRestoreBackups: vi.fn(),
  checkFullBackup: vi.fn(), recoverInterruptedBackup: vi.fn(),
  stageFullBackup: vi.fn(), cancelPlannedBackup: vi.fn(),
}));
let nextUrl = 0;
const revoke = vi.fn();
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); nextUrl = 0; revoke.mockClear();
  vi.mocked(createFullBackup).mockReset().mockResolvedValue(new Uint8Array([80, 75, 3, 4]));
  vi.mocked(priorRestoreBackups).mockResolvedValue([]);
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => `blob:backup-${++nextUrl}`), revokeObjectURL: revoke,
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { throw Error('download blocked'); });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('retains a prepared archive when the automatic download is blocked, with a real retry link and truthful status', async () => {
  const repository = new DemoRepository(localStorage);
  const before = JSON.stringify(repository.getSnapshot());
  const view = render(<FullBackup repository={repository} />);
  fireEvent.click(screen.getByRole('button', { name: '전체 백업 내려받기' }));
  const retry = await screen.findByRole('link', { name: '백업 파일 다시 저장' });
  expect(retry).toHaveAttribute('href', 'blob:backup-1');
  expect(retry.getAttribute('download')).toMatch(/^study-backup-.*\.zip$/);
  expect(screen.getByRole('status')).toHaveTextContent('준비했습니다');
  expect(screen.getByRole('status')).not.toHaveTextContent('내려받았습니다');
  expect(revoke).not.toHaveBeenCalled();
  expect(JSON.stringify(repository.getSnapshot())).toBe(before);

  // A rebuild failure must not discard the last downloadable file.
  vi.mocked(createFullBackup).mockRejectedValueOnce(Error('storage read failed'));
  fireEvent.click(screen.getByRole('button', { name: '전체 백업 내려받기' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('link', { name: '백업 파일 다시 저장' })).toHaveAttribute('href', 'blob:backup-1');
  expect(revoke).not.toHaveBeenCalled();
  view.unmount();
  expect(revoke).toHaveBeenCalledWith('blob:backup-1');
});

it('replaces and releases old URLs and clears the prepared file when the owner changes', async () => {
  const repository = new DemoRepository(localStorage);
  const view = render(<FullBackup repository={repository} />);
  fireEvent.click(screen.getByRole('button', { name: '전체 백업 내려받기' }));
  await screen.findByRole('link', { name: '백업 파일 다시 저장' });
  fireEvent.click(screen.getByRole('button', { name: '전체 백업 내려받기' }));
  await waitFor(() => expect(screen.getByRole('link', { name: '백업 파일 다시 저장' })).toHaveAttribute('href', 'blob:backup-2'));
  expect(revoke).toHaveBeenCalledWith('blob:backup-1');
  expect(revoke).not.toHaveBeenCalledWith('blob:backup-2');
  const otherOwner = { ...repository, getSnapshot: () => ({ ...repository.getSnapshot(), userId: 'other-owner' }) } as unknown as DemoRepository;
  view.rerender(<FullBackup repository={otherOwner} />);
  expect(screen.queryByRole('link', { name: '백업 파일 다시 저장' })).toBeNull();
  await waitFor(() => expect(revoke).toHaveBeenCalledWith('blob:backup-2'));
});
