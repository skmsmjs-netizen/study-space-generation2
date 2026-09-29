import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { clearStudyLaunch, readStudyLaunch, resolveStudyLaunchTarget, saveStudyLaunch, studyLaunchKey } from './study-launch';

beforeEach(() => { localStorage.clear(); });
describe('study return location', () => {
  it('stores only owned location identifiers without changing study state or other drafts', () => {
    const data = createDemoState(), before = structuredClone(data);
    localStorage.setItem('unrelated-draft', '  original\n');
    const hint = saveStudyLaunch(data, 'demo-topic-function');
    expect(Object.keys(hint).sort()).toEqual(['namespace', 'nodeId', 'scope', 'subjectId', 'userId', 'version']);
    expect(readStudyLaunch(data)).toEqual(hint);
    expect(data).toEqual(before);
    clearStudyLaunch(data);
    expect(readStudyLaunch(data)).toBeNull();
    expect(localStorage.getItem('unrelated-draft')).toBe('  original\n');
    expect(data).toEqual(before);
  });
  it('uses the current full path after renaming while rejecting changed ownership, scope, deletion and broken ancestry', () => {
    const data = createDemoState(), hint = saveStudyLaunch(data, 'demo-topic-function');
    const node = data.nodes.find(n => n.id === hint.nodeId)!;
    node.name = '새 이름';
    expect(resolveStudyLaunchTarget(data, hint.nodeId, hint)?.path.at(-1)).toBe('새 이름');
    const changed = structuredClone(data);
    changed.subjects.find(s => s.id === hint.subjectId)!.scope = { kind: 'independent' };
    expect(resolveStudyLaunchTarget(changed, hint.nodeId, hint)).toBeNull();
    node.deletedAt = '2026-09-30T00:00:00Z';
    expect(resolveStudyLaunchTarget(data, hint.nodeId, hint)).toBeNull();
    node.deletedAt = null; node.parentId = node.id;
    expect(resolveStudyLaunchTarget(data, hint.nodeId, hint)).toBeNull();
    expect(resolveStudyLaunchTarget({ ...data, userId: 'different-user' }, hint.nodeId, hint)).toBeNull();
    expect(readStudyLaunch({ ...data, userId: 'different-user' })).toBeNull();
  });
  it('preserves malformed or foreign hints instead of silently overwriting or clearing them', () => {
    const data = createDemoState(), key = studyLaunchKey(data);
    for (const raw of ['  {broken\n', JSON.stringify({ version: 1, userId: 'other', namespace: data.namespace, nodeId: 'demo-topic-function', subjectId: 'x', scope: { kind: 'unassigned' } })]) {
      localStorage.setItem(key, raw);
      expect(() => saveStudyLaunch(data, 'demo-topic-function')).toThrow();
      expect(() => clearStudyLaunch(data)).toThrow();
      expect(localStorage.getItem(key)).toBe(raw);
    }
  });
  it('requires a verified write and removal rather than trusting a storage call', () => {
    const data = createDemoState();
    const discardedWrite = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() };
    expect(() => saveStudyLaunch(data, 'demo-topic-function', discardedWrite)).toThrow('not confirmed');
    const hint = saveStudyLaunch(data, 'demo-topic-function');
    const discardedRemoval = { getItem: vi.fn(() => JSON.stringify(hint)), setItem: vi.fn(), removeItem: vi.fn() };
    expect(() => clearStudyLaunch(data, discardedRemoval)).toThrow('not confirmed');
  });
});
