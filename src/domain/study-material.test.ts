import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { applyCommand } from './commands';
import { type Command } from './model';
import { type MaterialContent } from './study-material';
import { packServerState, unpackServerState } from '../server/state-codec';

let repo: DemoRepository;
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); });
const source = (): MaterialContent => ({ title: ' 원문과 조건 ', subjectId: 'demo-subject-math', topicId: 'nonexistent-topic', sourceText: '  한글\r\n조건\u0000\ud800 ', audio: null, results: [] });
const command = (content = source(), expectedVersion = 0): Command => ({ type: 'saveStudyMaterial', id: 'lecture-1', expectedVersion, content, userId: repo.getSnapshot().userId, namespace: 'demo', opId: crypto.randomUUID(), at: new Date().toISOString() });

it('preserves exact source, identity and revisions across reopen and server encoding without creating study events', () => {
  const before = repo.getSnapshot();
  const next = repo.execute(command({ ...source(), topicId: null }));
  const reopened = new DemoRepository(localStorage).getSnapshot();
  expect(reopened.studyMaterials![0]).toMatchObject({ ...source(), topicId: null });
  expect(reopened.records).toEqual(before.records); expect(reopened.sessions).toEqual(before.sessions);
  expect(unpackServerState(packServerState(next, next.revisions.at(-1)!.operationId))).toEqual(next);
});
it('rejects another subject, forged ownership and stale writes atomically', () => {
  const before = repo.getSnapshot();
  expect(() => applyCommand(before, command())).toThrow(); // nonexistent topic
  expect(() => applyCommand(before, { ...command({ ...source(), topicId: 'demo-topic-graph', subjectId: 'demo-subject-science' }) })).toThrow();
  expect(() => applyCommand(before, { ...command(), userId: 'someone-else' })).toThrow();
  repo.execute(command({ ...source(), topicId: null }));
  const saved = repo.getSnapshot();
  expect(() => repo.execute(command({ ...source(), topicId: null, sourceText: '다른 원문' }, 0))).toThrow();
  expect(repo.getSnapshot()).toEqual(saved);
});
it('retries the same operation once and preserves source through trash and restore', () => {
  const op = command({ ...source(), topicId: null });
  const saved = repo.execute(op); expect(repo.execute(op)).toEqual(saved);
  const ctx = { userId: saved.userId, namespace: saved.namespace, at: new Date().toISOString() };
  repo.execute({ ...ctx, opId: 'trash', type: 'trashStudyMaterial', id: 'lecture-1', expectedVersion: 1 });
  const restored = repo.execute({ ...ctx, opId: 'restore', type: 'restoreStudyMaterial', id: 'lecture-1', expectedVersion: 2 });
  expect(restored.studyMaterials![0].sourceText).toBe(source().sourceText);
  expect(restored.studyMaterials![0].deletedAt).toBeNull();
  expect(restored.revisions.filter(row => row.collection === 'studyMaterials')).toHaveLength(3);
});
