import { beforeEach, describe, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { saveRecallMemo } from '../data/topic-recall';
import { applyCommand } from './commands';
import { CANVAS_ID, canvasKey, projectCanvas } from './canvas';
import type { Command } from './model';

let repository: DemoRepository;
beforeEach(() => { localStorage.clear(); repository = new DemoRepository(localStorage); });
const context = () => ({ opId: crypto.randomUUID(), at: new Date().toISOString(), userId: repository.getSnapshot().userId, namespace: repository.getSnapshot().namespace });
describe('Canvas references and durable layout', () => {
  it('projects every current subject/outline and one tail per saved explanation, never a study event', () => {
    const before = repository.getSnapshot();
    saveRecallMemo(repository, 'demo-topic-function', { memoId: 'explanation-one', body: ' 原文\r\n  条件 ', strokes: [{ id: 'stroke-origin', ink: 'blue', width: 2, points: [{ x: 10.5, y: 18.2, pressure: .21 }] }] });
    saveRecallMemo(repository, 'demo-topic-function', { memoId: 'explanation-two', body: '두 번째 설명' });
    const data = repository.getSnapshot(), projected = projectCanvas(data);
    expect(projected.cards.filter(card => ['subject', 'unit', 'outline', 'topic'].includes(card.kind))).toHaveLength(before.subjects.length + before.nodes.length);
    expect(projected.links.filter(link => link.source === 'node:demo-topic-function' && link.label === '내 설명').map(link => link.target)).toEqual(['memo:explanation-one', 'memo:explanation-two']);
    expect(data.records).toEqual(before.records); expect(data.sessions).toEqual(before.sessions);
    expect(data.memos![0].body).toBe(' 原文\r\n  条件 ');
  });
  it('preserves original IDs, text, strokes, custom connections and positions across rename/add/delete/restore/reopen', () => {
    saveRecallMemo(repository, 'demo-topic-function', { memoId: 'explanation-one', body: '  원문\r\n ', strokes: [{ id: 'stroke-origin', ink: 'green', width: 3, points: [{ x: 12, y: 34, pressure: .8 }] }] });
    const data = repository.getSnapshot(), positions = Object.fromEntries(projectCanvas(data).cards.map(card => [card.id, card.position]));
    positions['node:demo-topic-function'] = { x: -120, y: 42 };
    const links = [{ id: 'my-connection', source: 'node:demo-topic-function', target: 'node:demo-topic-graph', label: '  내 의문  ' }];
    repository.execute({ ...context(), type: 'saveCanvasLayout', id: CANVAS_ID, expectedVersion: 0, positions, links, viewport: { x: 7, y: 8, zoom: .8 } });
    repository.execute({ ...context(), type: 'renameNode', id: 'demo-topic-function', name: '함수 · 새 이름', expectedVersion: 1 });
    repository.execute({ ...context(), type: 'addNode', id: 'new-topic', name: '추가 주제', subjectId: 'demo-subject-math', parentId: 'demo-outline-functions', role: 'topic' });
    const reopened = new DemoRepository(localStorage).getSnapshot(), projected = projectCanvas(reopened);
    expect(projected.cards.find(card => card.id === 'node:demo-topic-function')).toMatchObject({ entityId: 'demo-topic-function', name: '함수 · 새 이름', position: { x: -120, y: 42 } });
    expect(projected.cards.some(card => card.entityId === 'new-topic')).toBe(true);
    expect(projected.links).toContainEqual(links[0]); expect(reopened.memos).toEqual(data.memos);
    const layout = reopened.canvasLayouts![0];
    expect(layout.viewport).toEqual({ x: 7, y: 8, zoom: .8 });
    const trashed = repository.execute({ ...context(), type: 'trashNode', id: 'demo-topic-function', expectedVersion: 2 });
    expect(projectCanvas(trashed).cards.some(card => card.id === 'memo:explanation-one')).toBe(false);
    expect(trashed.canvasLayouts![0]).toEqual(layout);
    const restored = repository.execute({ ...context(), type: 'restoreNode', id: 'demo-topic-function', expectedVersion: 3 });
    expect(projectCanvas(restored).cards.find(card => card.id === 'node:demo-topic-function')!.position).toEqual({ x: -120, y: 42 });
    expect(restored.memos).toEqual(data.memos);
  });
  it('refuses stale/invalid layout writes, preserves snapshots on storage failure, and records undo as a revision', () => {
    const first: Command = { ...context(), type: 'saveCanvasLayout', id: CANVAS_ID, expectedVersion: 0, positions: { [canvasKey('node', 'demo-topic-function')]: { x: 30, y: 60 } }, links: [] };
    repository.execute(first); const data = repository.getSnapshot();
    expect(() => repository.execute({ ...first, ...context(), positions: {} })).toThrow('다른 곳에서 변경');
    expect(() => applyCommand(data, { ...first, ...context(), expectedVersion: 1, positions: { 'node:bad': { x: Infinity, y: 0 } } })).toThrow('Canvas');
    const moved = repository.execute({ ...first, ...context(), expectedVersion: 1, positions: { 'node:demo-topic-function': { x: 300, y: 600 } } });
    const revision = moved.revisions.at(-1)!;
    const restored = repository.execute({ ...context(), type: 'undoRevision', revisionId: revision.id, expectedVersion: 2 });
    expect(restored.canvasLayouts![0].positions).toEqual(data.canvasLayouts![0].positions);
    expect(restored.revisions.at(-1)!.reversesRevisionId).toBe(revision.id);
    const storage = { getItem: (key: string) => localStorage.getItem(key), setItem: (_key: string, _value: string) => { throw Error('quota'); } };
    const failing = new DemoRepository(storage), before = failing.getSnapshot();
    expect(() => failing.execute({ ...first, ...context(), expectedVersion: 3, positions: {} })).toThrow('quota');
    expect(failing.getSnapshot()).toBe(before);
  });
});
