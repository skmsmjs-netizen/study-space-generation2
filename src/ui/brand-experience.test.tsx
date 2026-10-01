import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { applyCommand } from '../domain/commands';
import { experienceKey, readExperience } from '../data/experience-state';
import { clearRescuedDraft } from '../data/draft-safety';
import { BrandContinuity, BrandService } from './brand-experience';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  const key = experienceKey(createDemoState());
  [key, `${key}:next-draft`, `${key}:support-draft`].forEach(clearRescuedDraft);
});
afterEach(() => vi.restoreAllMocks());
it('keeps the next-action draft on skip and write failure, then verifies the exact retry', async () => {
  const data = createDemoState(),
    user = userEvent.setup(),
    body = '  먼저 조건을 생각하기\n';
  const view = render(<BrandContinuity data={data} route="/node/demo-topic-function" />);
  await user.click(screen.getByRole('button', { name: '다음에 펼칠 곳 남기기' }));
  await user.type(screen.getByLabelText('다음에 할 일'), body);
  await user.click(screen.getByRole('button', { name: '건너뛰기' }));
  view.unmount();
  render(<BrandContinuity data={data} route="/node/demo-topic-function" />);
  await user.click(screen.getByRole('button', { name: '다음에 펼칠 곳 남기기' }));
  expect(screen.getByLabelText('다음에 할 일')).toHaveValue(body);
  const original = Storage.prototype.setItem;
  const failing = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key === experienceKey(data)) throw Error('쓰기 실패');
    return original.call(this, key, value);
  });
  await user.click(screen.getByRole('button', { name: '다음 행동 남기기' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.queryByText(/다음에 할 일로 남겨두었습니다/)).not.toBeInTheDocument();
  expect(screen.getByLabelText('다음에 할 일')).toHaveValue(body);
  failing.mockRestore();
  await user.click(screen.getByRole('button', { name: '다음 행동 남기기' }));
  expect(readExperience(data).next?.body).toBe(body);
  expect(data.records).toHaveLength(0);
});
it('previews only chosen originals and explicitly selected history without adding other private text', async () => {
  const user = userEvent.setup(),
    context = { at: '2026-10-01T00:00:00Z', userId: 'demo-learner', namespace: 'demo' as const };
  let data = applyCommand(createDemoState(), {
    ...context,
    opId: 'brand-records',
    type: 'saveRecords',
    sessionId: 'brand-session',
    dateEvidence: { kind: 'unknown' },
    entries: [
      { targetId: 'demo-topic-function', body: '  처음 남긴 설명\n', done: false },
      { targetId: 'demo-topic-graph', body: '공유하지 않을 사적인 글', done: false },
    ],
  });
  const first = data.records.find((r) => r.targetId === 'demo-topic-function')!;
  data = applyCommand(data, {
    ...context,
    opId: 'brand-edit',
    type: 'updateRecord',
    id: first.id,
    expectedVersion: first.version,
    patch: { body: '  고친 설명\n' },
  });
  const original = structuredClone(data);
  const repository = { getSnapshot: () => data, execute: vi.fn(() => data) };
  const view = render(<BrandService data={data} repository={repository} page="/my-progress" />);
  await user.click(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까.*고친 설명/ }));
  const preview = screen.getByRole('region', { name: '공유 파일 미리보기' });
  expect(preview).toHaveTextContent('고친 설명');
  expect(preview).not.toHaveTextContent('공유하지 않을');
  expect(preview).not.toHaveTextContent('처음 남긴');
  await user.click(screen.getByRole('checkbox', { name: '선택한 기록의 이전 수정본도 포함' }));
  expect(preview).toHaveTextContent('처음 남긴 설명');
  expect(preview).toHaveTextContent('공부한 날짜: 미확인');
  expect(data).toEqual(original);
  expect(repository.execute).not.toHaveBeenCalled();
  view.unmount();
  render(<BrandService data={data} repository={repository} page="/my-progress" />);
  expect(screen.getByRole('checkbox', { name: /함수는 어떤 관계일까.*고친 설명/ })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: '선택한 기록의 이전 수정본도 포함' })).toBeChecked();
  expect(screen.getByRole('region', { name: '공유 파일 미리보기' })).toHaveTextContent(
    '처음 남긴 설명',
  );
});
it('preserves a support draft across reentry and distinguishes local preservation from external receipt', async () => {
  const user = userEvent.setup(),
    data = createDemoState(),
    repository = { getSnapshot: () => data, execute: vi.fn(() => data) };
  const view = render(<BrandService data={data} repository={repository} page="/help" />);
  await user.type(screen.getByLabelText('문제 메모'), '  문의를 남기기\n');
  await user.click(screen.getByRole('button', { name: '문제 메모 보관' }));
  expect(screen.getByRole('status')).toHaveTextContent('외부 접수나 전송은 하지 않았습니다');
  view.unmount();
  render(<BrandService data={data} repository={repository} page="/help" />);
  expect(screen.getByLabelText('문제 메모')).toHaveValue('  문의를 남기기\n');
  const preservedId = readExperience(data).support[0].id;
  await user.clear(screen.getByLabelText('문제 메모'));
  await user.click(screen.getByLabelText('문제 메모'));
  await user.paste('  고친 문의\n');
  await user.click(screen.getByRole('button', { name: '문제 메모 보관' }));
  expect(readExperience(data).support[0].id).toBe(preservedId);
  expect(readExperience(data).support[0].history?.[0].body).toBe('  문의를 남기기\n');
  await user.click(screen.getByRole('button', { name: '새 메모 작성' }));
  await user.click(screen.getByLabelText('문제 메모'));
  await user.paste('별도의 문의');
  await user.click(screen.getByRole('button', { name: '문제 메모 보관' }));
  expect(readExperience(data).support).toHaveLength(2);
  expect(readExperience(data).support[1].id).not.toBe(preservedId);
  expect(repository.execute).not.toHaveBeenCalled();
  expect(screen.queryByText('접수 완료')).not.toBeInTheDocument();
});
