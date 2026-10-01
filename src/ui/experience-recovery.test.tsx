import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { archiveDamagedDraft, clearRescuedDraft } from '../data/draft-safety';
import { experienceKey, inspectExperienceRecovery, readExperience, updateExperience } from '../data/experience-state';
import { ExperienceSettings } from './brand-experience';

const data = createDemoState(), key = experienceKey(data);
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); clearRescuedDraft(key); });
function seed() {
  updateExperience(data, state => ({ ...state, readingWidth: 'wide',
    next: { location: { route: '/math', label: '수식 탐색' }, body: '  확인한 조건부터\n' },
  }));
  const copy = archiveDamagedDraft(key, '확인용 보관본')!;
  localStorage.setItem(key, '  {incomplete original\n');
  return copy;
}

it('offers exact archive preview, restores reading width and next action, and retains both after remount', async () => {
  const copy = seed(), damaged = localStorage.getItem(key), user = userEvent.setup();
  const originalRecords = structuredClone(data.records);
  let view = render(<ExperienceSettings data={data} />);
  expect(screen.getByLabelText('본문 읽기 폭')).toBeDisabled();
  expect(screen.getByLabelText('본문 읽기 폭')).toHaveValue('unreadable');
  expect(screen.queryByText(/Unexpected end/)).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '설정 원문·보관본 확인' }));
  await user.selectOptions(screen.getByLabelText('복구할 설정 보관본'), copy);
  expect(screen.getByLabelText('보관본 원문')).toHaveValue(localStorage.getItem(copy));
  await user.click(screen.getByRole('button', { name: '이 보관본으로 설정 복구' }));
  expect(screen.getByLabelText('본문 읽기 폭')).toHaveValue('wide');
  expect(screen.getByLabelText('본문 읽기 폭')).toBeEnabled();
  expect(readExperience(data).next?.body).toBe('  확인한 조건부터\n');
  expect(inspectExperienceRecovery(data).archives.some(archive => archive.raw === damaged)).toBe(true);
  view.unmount(); view = render(<ExperienceSettings data={data} />);
  expect(screen.getByLabelText('본문 읽기 폭')).toHaveValue('wide');
  expect(data.records).toEqual(originalRecords);
});

it('keeps the recovery dialog and original when saving fails without announcing a completed restore', async () => {
  const copy = seed(), damaged = localStorage.getItem(key), user = userEvent.setup();
  render(<ExperienceSettings data={data} />);
  await user.click(screen.getByRole('button', { name: '설정 원문·보관본 확인' }));
  await user.selectOptions(screen.getByLabelText('복구할 설정 보관본'), copy);
  const write = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, name, value) {
    if (name === key) throw new DOMException('quota', 'QuotaExceededError');
    return write.call(this, name, value);
  });
  await user.click(screen.getByRole('button', { name: '이 보관본으로 설정 복구' }));
  expect(screen.getByRole('dialog', { name: '이어가기 설정 복구' })).toBeInTheDocument();
  expect(localStorage.getItem(key)).toBe(damaged);
  expect(screen.queryByText('확인한 보관본으로 설정을 복구했습니다. 이전 원문 사본도 유지했습니다.')).not.toBeInTheDocument();
  expect(screen.getByLabelText('보관본 원문')).toHaveValue(localStorage.getItem(copy));
});
