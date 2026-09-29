import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { OutlineNode, StudyRecord } from '../domain/model';
import { outlineRows } from '../domain/navigation';
import { OutlineTree } from './outline-tree';

const node = (id: string, parentId: string | null, name = id, order = 0): OutlineNode => ({
  id, parentId, name, order, subjectId: 'subject', role: 'topic',
  userId: 'test', namespace: 'test', version: 1, deletedAt: null,
  createdAt: '2026-09-30', updatedAt: '2026-09-30',
});
const renderTree = (nodes: OutlineNode[], records: StudyRecord[] = []) =>
  render(<OutlineTree nodes={nodes} records={records} subjectId="subject" subjectName="수학" />);

describe('outline navigation', () => {
  it('keeps every deep descendant reachable with bounded visual indentation', () => {
    const nodes = Array.from({ length: 128 }, (_, index) => node(`n${index}`, index ? `n${index - 1}` : null));
    renderTree(nodes);
    expect(screen.getAllByRole('link')).toHaveLength(128);
    const deepest = screen.getAllByRole('link').at(-1)!;
    expect(deepest).toHaveAttribute('href', '#/node/n127');
    expect(deepest.parentElement).toHaveStyle('--outline-indent: 3');
    expect(deepest).toHaveTextContent('수학 / n0 / n1');
    expect(outlineRows(nodes, 'subject', 'n120').map(row => row.node.id))
      .toEqual(['n121', 'n122', 'n123', 'n124', 'n125', 'n126', 'n127']);
  });

  it('distinguishes identical names by full path and identical paths by stable ID', () => {
    renderTree([
      node('unit-a', null, '첫 단원'), node('unit-b', null, '둘째 단원'),
      node('topic-a', 'unit-a', '복습'), node('topic-b', 'unit-b', '복습'),
      node('topic-c', 'unit-b', '복습'),
    ]);
    expect(screen.getByRole('link', { name: '주제 수학 / 첫 단원 / 복습 · 공부함 기록 0회' })).toHaveAttribute('href', '#/node/topic-a');
    const second = screen.getByRole('link', { name: '주제 수학 / 둘째 단원 / 복습 · 구분 ID: topic-b · 공부함 기록 0회' });
    expect(second).toHaveTextContent('구분 ID: topic-b');
    expect(screen.getByRole('link', { name: /구분 ID: topic-c/ })).toHaveAttribute('href', '#/node/topic-c');
  });

  it('supports keyboard traversal without intercepting browser modified arrows or IME', async () => {
    const user = userEvent.setup();
    renderTree([node('root', null), node('child', 'root'), node('sibling', null, 'sibling', 1)]);
    const [root, child, sibling] = screen.getAllByRole('link');
    root.focus();
    await user.keyboard('{ArrowRight}'); expect(child).toHaveFocus();
    await user.keyboard('{ArrowLeft}'); expect(root).toHaveFocus();
    await user.keyboard('{End}'); expect(sibling).toHaveFocus();
    await user.keyboard('{ArrowUp}'); expect(child).toHaveFocus();
    await user.keyboard('{Home}'); expect(root).toHaveFocus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}'); expect(root).toHaveFocus();
    fireEvent.keyDown(root, { key: 'End', isComposing: true }); expect(root).toHaveFocus();
    await user.tab(); expect(child).toHaveFocus();
  });

  it('uses subject, active state and ordering without changing the source tree', () => {
    const nodes = [node('last', null, 'last', 2), node('first', null),
      { ...node('other', null), subjectId: 'other-subject' },
      { ...node('deleted', null), deletedAt: '2026-09-30' }];
    const before = structuredClone(nodes);
    renderTree(nodes);
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href')))
      .toEqual(['#/node/first', '#/node/last']);
    expect(nodes).toEqual(before);
  });

  it('reports study records separately from body-only and deleted records', () => {
    const makeRecord = (id: string, done: boolean): StudyRecord => ({
      ...node(id, null), targetId: 'topic', body: '원문', sessionId: id,
      done, dateEvidence: { kind: 'unknown' }, trace: {},
    });
    renderTree([node('topic', null)], [makeRecord('done', true), makeRecord('note', false),
      { ...makeRecord('deleted', true), deletedAt: '2026-09-30' }]);
    expect(screen.getByRole('link')).toHaveAccessibleName('주제 수학 / topic · 공부함 기록 1회');
  });

  it('preserves empty-state rendering and URL-encodes original stable IDs', () => {
    const view = render(<OutlineTree nodes={[]} records={[]} subjectId="subject" subjectName="수학" empty={<p>목차가 아직 없습니다</p>} />);
    expect(screen.getByText('목차가 아직 없습니다')).toBeInTheDocument();
    view.rerender(<OutlineTree nodes={[node('원래 ID #1', null)]} records={[]} subjectId="subject" subjectName="수학" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', `#/node/${encodeURIComponent('원래 ID #1')}`);
  });
});
