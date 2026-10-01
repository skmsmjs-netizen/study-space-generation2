import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import type { ReactNode, ComponentType } from 'react';
import { Workspace } from './App';
import { PersonalRepository } from './data/personal-repository';
import { storagePrefix } from './data/repository';
import { applyCommand } from './domain/commands';
import { emptyState } from './domain/model';

// The flow renderer is mocked; save acknowledgement and the actual editors are real.
vi.mock('./ui/flow-experience', () => ({
  FlowExperience: () => null,
  flowAriaLabels: {},
  flowSnapGrid: [24, 24],
  flowEdgeType: (style: string) => style,
}));

vi.mock('@xyflow/react', async () => {
  const { createElement } = await import('react');
  return {
    ReactFlow: ({
      nodes,
      nodeTypes,
      children,
    }: {
      nodes: {
        id: string;
        type: string;
        data: unknown;
        selected: boolean;
        position: { x: number; y: number };
      }[];
      nodeTypes: Record<string, ComponentType<Record<string, unknown>>>;
      children: ReactNode;
    }) => (
      <div>
        {nodes.map((node) => (
          <div
            key={node.id}
            data-testid={node.id}
            style={{ transform: `translate(${node.position.x}px, ${node.position.y}px)` }}
          >
            {createElement(nodeTypes[node.type], { data: node.data, selected: node.selected })}
          </div>
        ))}
        {children}
      </div>
    ),
    useViewport: () => ({ x: 0, y: 0, zoom: 1 }),
    Background: () => null,
    Controls: () => null,
    Handle: () => null,
    NodeToolbar: () => null,
    NodeResizeControl: () => null,
    SelectionMode: { Partial: 'partial' },
    Position: { Left: 'left', Right: 'right' },
    MarkerType: { ArrowClosed: 'arrowclosed' },
    applyNodeChanges: (_changes: unknown, nodes: unknown) => nodes,
  };
});

function fixture(savedPositions?: Record<string, { x: number; y: number }>) {
  const base = {
    userId: '70000000-0000-4000-8000-000000000001',
    namespace: 'test' as const,
    at: '2026-10-01T05:00:00Z',
  };
  let data = emptyState(base.userId, base.namespace);
  data = applyCommand(data, {
    ...base,
    opId: 'subject',
    type: 'addSubject',
    id: 'course',
    name: '합성 과목',
    scope: { kind: 'independent' },
  });
  data = applyCommand(data, {
    ...base,
    opId: 'topic',
    type: 'addNode',
    id: 'topic',
    subjectId: 'course',
    parentId: null,
    role: 'topic',
    name: '합성 주제',
  });
  data = applyCommand(data, {
    ...base,
    opId: 'other-topic',
    type: 'addNode',
    id: 'other-topic',
    subjectId: 'course',
    parentId: null,
    role: 'topic',
    name: '다른 합성 주제',
  });
  if (savedPositions)
    data = applyCommand(data, {
      ...base,
      opId: 'layout',
      type: 'saveCanvasLayout',
      id: 'canvas:main',
      expectedVersion: 0,
      positions: savedPositions,
      links: [
        {
          id: 'existing-link',
          source: 'node:topic',
          target: 'node:other-topic',
          label: '원래 관계 설명',
        },
      ],
    });
  let server = { sequence: savedPositions ? 4 : 3, data };
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let failed = false;
  const execute = vi.fn(async (command, sequence) => {
    await gate;
    if (failed) throw new Error('서버 연결 실패');
    if (sequence !== server.sequence) throw new Error('stale');
    server = { sequence: server.sequence + 1, data: applyCommand(server.data, command) };
    return server;
  });
  const repository = new PersonalRepository(
    localStorage,
    { load: async () => server, execute },
    server,
  );
  return {
    repository,
    execute,
    release,
    server: () => server,
    fail: () => {
      failed = true;
    },
    recover: () => {
      failed = false;
    },
  };
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  history.replaceState(null, '', '/?space=personal#/canvas');
});
async function edit(f: ReturnType<typeof fixture>) {
  const user = userEvent.setup();
  render(<Workspace repository={f.repository} />);
  const card = await screen.findByRole(
    'article',
    { name: '주제 카드 합성 주제' },
    { timeout: 10000 },
  );
  await user.click(within(card).getByRole('button', { name: '메모 쓰기' }));
  fireEvent.change(within(card).getByRole('textbox', { name: '새 메모' }), {
    target: { value: '  합성 설명\n원문 그대로  ' },
  });
  return { user, card };
}

it('waits for acknowledgement, then collapses the card, restores focus and reopens exact text', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  const otherPosition = screen.getByTestId('node:other-topic').style.transform;
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  expect(card).toHaveClass('is-editing');
  expect(within(card).getByRole('button', { name: '저장 중…' })).toBeDisabled();
  expect(within(card).getByText('서버에 저장 중입니다…')).toBeInTheDocument();
  expect(f.server().data.narratives).toHaveLength(0);
  await act(async () => {
    f.release();
    await f.repository.flush();
  });
  await waitFor(() => expect(card).not.toHaveClass('is-editing'));
  expect(within(card).getByText('서버에 저장했습니다.')).toBeInTheDocument();
  await waitFor(() =>
    expect(within(card).getByRole('button', { name: '메모 쓰기' })).toHaveFocus(),
  );
  expect(f.server().data.narratives[0].body).toBe('  합성 설명\n원문 그대로  ');
  expect(f.server().data.records).toHaveLength(0);
  expect(screen.getByTestId('node:other-topic').style.transform).toBe(otherPosition);
  await user.click(within(card).getByRole('button', { name: '메모 쓰기' }));
  expect(within(card).getByRole('textbox', { name: '새 메모' })).toHaveValue(
    '  합성 설명\n원문 그대로  ',
  );
});

it('keeps the editor and draft after server failure and retries the same queued operation', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  f.fail();
  f.release();
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  await within(card).findByRole('button', { name: '저장 다시 시도' });
  expect(card).toHaveClass('is-editing');
  expect(within(card).getByRole('textbox', { name: '새 메모' })).toHaveValue(
    '  합성 설명\n원문 그대로  ',
  );
  const key = `${storagePrefix(f.repository.getSnapshot())}:narrative:topic-note:topic`;
  expect(localStorage.getItem(key)).toContain('합성 설명');
  expect(f.server().data.narratives).toHaveLength(0);
  f.recover();
  await user.click(within(card).getByRole('button', { name: '저장 다시 시도' }));
  await waitFor(() => expect(card).not.toHaveClass('is-editing'));
  expect(f.execute).toHaveBeenCalledTimes(2);
  expect(f.execute.mock.calls[0][0].opId).toBe(f.execute.mock.calls[1][0].opId);
  expect(f.server().data.narratives).toHaveLength(1);
  expect(f.server().data.narratives[0].version).toBe(1);
});

it('does not collapse when local persistence fails', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  vi.spyOn(f.repository, 'execute').mockImplementationOnce(() => {
    throw new Error('저장 공간 부족');
  });
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  expect(card).toHaveClass('is-editing');
  expect(within(card).getByRole('textbox', { name: '새 메모' })).toHaveValue(
    '  합성 설명\n원문 그대로  ',
  );
  expect(within(card).getByRole('button', { name: '저장 다시 시도' })).toBeEnabled();
  expect(f.execute).not.toHaveBeenCalled();
});

it('allows editing after a failed transmission and preserves both revisions on retry', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  f.fail();
  f.release();
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  await within(card).findByRole('button', { name: '저장 다시 시도' });
  fireEvent.change(within(card).getByRole('textbox', { name: '새 메모' }), {
    target: { value: '실패 뒤 이어 고친 설명' },
  });
  f.recover();
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  await waitFor(() => expect(card).not.toHaveClass('is-editing'));
  expect(f.server().data.narratives).toHaveLength(1);
  expect(f.server().data.narratives[0].body).toBe('실패 뒤 이어 고친 설명');
  expect(f.server().data.narratives[0].version).toBe(2);
});

it('keeps draft cleanup errors visible after the server has saved', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  const remove = Storage.prototype.removeItem,
    set = Storage.prototype.setItem;
  const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (
    this: Storage,
    key,
  ) {
    if (key.endsWith(':narrative:topic-note:topic')) throw new Error('cleanup blocked');
    return remove.call(this, key);
  });
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
    this: Storage,
    key,
    value,
  ) {
    if (key.endsWith(':narrative:topic-note:topic')) throw new Error('cleanup blocked');
    return set.call(this, key, value);
  });
  try {
    await user.click(within(card).getByRole('button', { name: '내용 저장' }));
    await act(async () => {
      f.release();
      await f.repository.flush();
    });
    expect(
      await within(card).findByRole('button', { name: '저장한 초안 정리 다시 시도' }),
    ).toBeInTheDocument();
    expect(card).toHaveClass('is-editing');
    expect(f.server().data.narratives).toHaveLength(1);
  } finally {
    spy.mockRestore();
    write.mockRestore();
  }
});

it('does not close a different card when an earlier save finishes', async () => {
  const f = fixture(),
    { user, card } = await edit(f);
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  await user.click(within(card).getByRole('button', { name: '편집 접기' }));
  const other = screen.getByRole('article', { name: '과목 카드 합성 과목' });
  await user.click(within(other).getByRole('button', { name: '메모 쓰기' }));
  fireEvent.change(within(other).getByRole('textbox', { name: '새 메모' }), {
    target: { value: '다른 카드의 새 초안' },
  });
  await act(async () => {
    f.release();
    await f.repository.flush();
  });
  expect(other).toHaveClass('is-editing');
  expect(within(other).getByRole('textbox', { name: '새 메모' })).toHaveValue(
    '다른 카드의 새 초안',
  );
});

it('preserves saved positions and connections while collapsing a successfully saved memo', async () => {
  const f = fixture({
    'node:topic': { x: 1200, y: -360 },
    'node:other-topic': { x: -400, y: 800 },
  });
  const layout = structuredClone(f.server().data.canvasLayouts);
  const { user, card } = await edit(f);
  expect(screen.getByTestId('node:topic').style.transform).toBe('translate(1200px, -360px)');
  await user.click(within(card).getByRole('button', { name: '내용 저장' }));
  await act(async () => {
    f.release();
    await f.repository.flush();
  });
  await waitFor(() => expect(card).not.toHaveClass('is-editing'));
  expect(screen.getByTestId('node:topic').style.transform).toBe('translate(1200px, -360px)');
  expect(f.server().data.canvasLayouts).toEqual(layout);
});
