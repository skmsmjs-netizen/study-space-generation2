import { beforeEach, describe, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { applyCommand, validateState } from './commands';
import { codeContent, currentCodeRun, CODE_STARTERS } from './code-example';
import type { Command, CodeExampleContent } from './model';
import { packServerState, unpackServerState } from '../server/state-codec';

let repo: DemoRepository;
beforeEach(() => {
  localStorage.clear();
  repo = new DemoRepository(localStorage);
});
const context = () => ({
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
  userId: repo.getSnapshot().userId,
  namespace: repo.getSnapshot().namespace,
});
const source: CodeExampleContent = {
  title: '  두 수의 합  ',
  language: 'c',
  code: '// 원문\r\n\tint a = 3;\u0000\ud800',
  stdin: ' 3\r\n4\n',
  notes: '  설명과 예외\r\n',
};
const write = (
  content = source,
  expectedVersion = 0,
): Extract<Command, { type: 'saveCodeExample' }> => ({
  ...context(),
  type: 'saveCodeExample',
  id: 'example-one',
  content,
  expectedVersion,
});
describe('code examples retain source and independent execution observations', () => {
  it('reopens exact text/IDs/history without changing records, older schema-1 states remain readable', () => {
    const before = repo.getSnapshot();
    validateState(before);
    expect(before.codeExamples).toBeUndefined();
    const first = repo.execute(write());
    const after = new DemoRepository(localStorage).getSnapshot();
    expect(codeContent(after.codeExamples![0])).toEqual(source);
    expect(after.codeExamples![0].id).toBe('example-one');
    expect(after.records).toEqual(before.records);
    expect(after.sessions).toEqual(before.sessions);
    expect(unpackServerState(packServerState(first, first.revisions.at(-1)!.operationId))).toEqual(
      first,
    );
  });
  it('preserves the code used for each execution and marks prior output stale after editing', () => {
    const content = {
      ...source,
      lastRun: {
        language: source.language,
        code: source.code,
        stdin: source.stdin,
        at: new Date().toISOString(),
        outcome: 'success' as const,
        output: '7\n',
        error: '',
      },
    };
    repo.execute(write(content));
    expect(currentCodeRun(content)).toBe(true);
    const next = repo.execute(write({ ...content, code: CODE_STARTERS.c }, 1));
    expect(currentCodeRun(next.codeExamples![0])).toBe(false);
    expect(next.codeExamples![0].lastRun).toEqual(content.lastRun);
    expect(next.revisions.at(-1)!.before).toMatchObject(content);
  });
  it('rejects stale versions, reused operations and forged owners atomically', () => {
    const command = write();
    const first = repo.execute(command);
    expect(repo.execute(command)).toBe(first);
    expect(() => repo.execute({ ...command, content: { ...source, notes: '다른 본문' } })).toThrow(
      '같은 요청',
    );
    expect(() => repo.execute(write({ ...source, notes: '충돌' }, 0))).toThrow('다른 곳에서 변경');
    expect(() => applyCommand(first, { ...write(source, 1), userId: 'other' })).toThrow(
      '다른 사용자',
    );
    expect(() =>
      applyCommand(first, write({ ...source, language: 'unsupported' as never }, 1)),
    ).toThrow('코드 예제');
    expect(repo.getSnapshot()).toBe(first);
  });
  it('retains source and execution in trash, restores the same ID, undo adds history', () => {
    repo.execute(write());
    const trashed = repo.execute({
      ...context(),
      type: 'trashCodeExample',
      id: 'example-one',
      expectedVersion: 1,
    });
    expect(codeContent(trashed.codeExamples![0])).toEqual(source);
    expect(trashed.codeExamples![0].deletedAt).not.toBeNull();
    const restored = repo.execute({
      ...context(),
      type: 'restoreCodeExample',
      id: 'example-one',
      expectedVersion: 2,
    });
    expect(restored.codeExamples![0]).toMatchObject({
      ...source,
      id: 'example-one',
      version: 3,
      deletedAt: null,
    });
    const revised = repo.execute(write({ ...source, notes: '수정한 설명' }, 3));
    const revision = revised.revisions.at(-1)!;
    const undone = repo.execute({
      ...context(),
      type: 'undoRevision',
      revisionId: revision.id,
      expectedVersion: 4,
    });
    expect(codeContent(undone.codeExamples![0])).toEqual(source);
    expect(undone.revisions.at(-1)!.reversesRevisionId).toBe(revision.id);
  });
  it('does not publish a changed snapshot when durable storage rejects the write', () => {
    repo.execute(write());
    const failing = new DemoRepository({
      getItem: (key) => localStorage.getItem(key),
      setItem: () => {
        throw Error('quota');
      },
    });
    const before = failing.getSnapshot();
    expect(() => failing.execute(write({ ...source, notes: '남겨야 하는 입력' }, 1))).toThrow(
      'quota',
    );
    expect(failing.getSnapshot()).toBe(before);
  });
});
