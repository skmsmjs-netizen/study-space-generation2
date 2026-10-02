import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ConceptVisual } from '../domain/concept-production';
import { KnowledgeStructure, KNOWLEDGE_CANVAS_DEFAULTS } from './knowledge-structure';
import {
  defaultFlowPreferences,
  flowPreferencesKey,
  readFlowPreferences,
} from '../data/flow-preferences';

const data = { namespace: 'personal' as const, userId: 'knowledge-owner' };
const visual: ConceptVisual = {
  kind: 'compare',
  label: '비교할 구조',
  nodes: [
    { id: 'source', label: '원문 $x$', detail: '조건과 예외\n내 설명 < & >' },
    { id: 'target', label: '대응 표현', detail: '같은 조건일 때만 비교합니다.' },
  ],
  relations: [{ from: 'source', to: 'target', label: '같은 조건의 표현으로 대응한다' }],
  highlighted: ['source'],
};
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

it('preserves authored modules, mathematical notation and explicit relationship meaning without imposing a sequence', () => {
  const { container } = render(
    <KnowledgeStructure visual={visual} data={data} viewKey="compare" />,
  );
  expect(container.querySelector('dd')?.textContent).toBe(visual.nodes[0].detail);
  expect(document.querySelector('.concept-representations math')).not.toBeNull();
  const relations = screen.getByRole('list', { name: '작성된 관계' });
  expect(within(relations).getAllByRole('listitem')).toHaveLength(1);
  expect(relations).toHaveTextContent('같은 조건의 표현으로 대응한다');
  expect(document.querySelector('ol')).toBeNull();
});

it('exposes the authored sequence as an ordered list and does not invent missing connections', () => {
  const { container } = render(
    <KnowledgeStructure
      visual={{ ...visual, kind: 'sequence', relations: [] }}
      data={data}
      viewKey="sequence"
    />,
  );
  const ordered = container.querySelector('ol')!;
  expect(within(ordered).getAllByRole('listitem')).toHaveLength(2);
  expect(ordered.children[0]).toHaveTextContent('조건과 예외');
  expect(screen.queryByRole('list', { name: '작성된 관계' })).toBeNull();
  expect(screen.getByText(/이해도나 완료를 뜻하지 않습니다/)).toBeVisible();
});

it('retains the view through remount while separating owners and individual source scenes', () => {
  const { unmount } = render(<KnowledgeStructure visual={visual} data={data} viewKey="first" />);
  fireEvent.click(screen.getByRole('button', { name: '문장으로 읽기' }));
  unmount();
  const next = render(<KnowledgeStructure visual={visual} data={data} viewKey="first" />);
  expect(screen.getByRole('button', { name: '문장으로 읽기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  next.rerender(
    <KnowledgeStructure visual={visual} data={{ ...data, userId: 'other' }} viewKey="first" />,
  );
  expect(screen.getByRole('button', { name: '구조로 보기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  next.rerender(<KnowledgeStructure visual={visual} data={data} viewKey="second" />);
  expect(screen.getByRole('button', { name: '구조로 보기' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

it('continues reading when optional view hint storage fails and preserves raw content', () => {
  const { container } = render(
    <KnowledgeStructure visual={visual} data={data} viewKey="blocked" />,
  );
  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  try {
    fireEvent.click(screen.getByRole('button', { name: '문장으로 읽기' }));
    expect(screen.getByRole('button', { name: '문장으로 읽기' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(container.querySelector('dd')?.textContent).toBe(visual.nodes[0].detail);
  } finally {
    write.mockRestore();
  }
});

it('keeps broken and repeated relation entries visible instead of silently inventing or removing their meaning', () => {
  const missing = { from: 'source', to: 'unknown', label: '' };
  render(
    <KnowledgeStructure
      visual={{ ...visual, relations: [missing, missing] }}
      data={data}
      viewKey="missing"
    />,
  );
  const relations = screen.getByRole('list', { name: '작성된 관계' });
  expect(within(relations).getAllByRole('listitem')).toHaveLength(2);
  expect(
    Array.from(relations.querySelectorAll('.knowledge-endpoint')).filter(
      (node) => node.textContent === '연결 대상 확인 필요 (unknown)',
    ),
  ).toHaveLength(2);
  expect(within(relations).getAllByText('관계 설명이 비어 있습니다')).toHaveLength(2);
});

it('uses the new Canvas line default only for unconfigured workspaces and preserves saved choices and widths', () => {
  const key = flowPreferencesKey(data, 'canvas');
  expect(readFlowPreferences(key, KNOWLEDGE_CANVAS_DEFAULTS).edgeStyle).toBe('step');
  const existing = {
    ...defaultFlowPreferences,
    edgeStyle: 'bezier',
    nodeWidths: { original: 420 },
  };
  localStorage.setItem(key, JSON.stringify(existing));
  expect(readFlowPreferences(key, KNOWLEDGE_CANVAS_DEFAULTS)).toEqual(existing);
});
