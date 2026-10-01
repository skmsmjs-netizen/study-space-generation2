import { expect, it } from 'vitest';
import { documentSegments } from './material-source';
import { applyCommand } from './commands';
import { createDemoState } from './fixtures';
import {
  photoMaterial,
  previewPhotoOutline,
  validatePhotoRows,
  type PhotoOutlineRow,
  type PhotoOutlineResult,
  type PhotoOutlineCommand,
} from './photo-outline';
const rows: PhotoOutlineRow[] = [
  {
    id: 'root',
    parentId: null,
    name: '직류 회로',
    content: '',
    page: '12',
    photoIds: ['p1'],
    uncertain: false,
  },
  {
    id: 'child',
    parentId: 'root',
    name: '옴의 법칙',
    content: 'V=IR. 저항이 일정할 때만 비례한다.',
    page: '13',
    photoIds: ['p1'],
    uncertain: false,
  },
];
const result: PhotoOutlineResult = {
  id: 'r',
  at: '2026-10-01T00:00:00Z',
  model: 'synthetic',
  promptVersion: 'photo-outline-20261001-v1',
  title: '회로 목차',
  rows,
  warnings: [],
  sources: [{ id: 'p1', sha256: 'a'.repeat(64) }],
};
const refs = [
  {
    id: 'p1',
    file: {
      key: 'local-photo',
      name: 'photo.png',
      type: 'image/png',
      size: 100,
      sha256: 'a'.repeat(64),
    },
  },
];
const command = (
  state = createDemoState(),
  choice: Record<string, string> = {},
): PhotoOutlineCommand => ({
  type: 'importPhotoOutline',
  userId: state.userId,
  namespace: state.namespace,
  opId: 'photo-batch',
  at: result.at,
  subjectId: state.subjects[0].id,
  parentId: null,
  rows,
  choices: choice,
  ids: { root: 'photo-root', child: 'photo-child' },
  memoIds: { child: 'photo-note' },
  expectedToken: previewPhotoOutline(state, state.subjects[0].id, null, rows, choice).expectedToken,
  materialId: 'photo-material',
  content: photoMaterial(state.subjects[0].id, result.title, refs, result, rows),
});
it('registers hierarchy, linked content and original photos together; repeat and undo preserve all prior records', () => {
  const before = createDemoState(),
    c = command(before),
    next = applyCommand(before, c);
  expect(next.nodes.slice(-2).map((n) => [n.name, n.parentId, n.role])).toEqual([
    ['직류 회로', null, 'unit'],
    ['옴의 법칙', 'photo-root', 'topic'],
  ]);
  expect(next.memos?.at(-1)).toMatchObject({
    ownerId: 'photo-child',
    body: expect.stringContaining('저항이 일정할 때'),
  });
  expect(next.studyMaterials?.at(-1)?.documents?.[0].blocks[0].originalText).toBe(
    JSON.stringify(result),
  );
  expect(documentSegments(c.content.documents)).toHaveLength(0);
  expect(c.content.sourceText).toContain('저항이 일정할 때');
  expect(next.records).toEqual(before.records);
  expect(next.nodes.slice(0, before.nodes.length)).toEqual(before.nodes);
  expect(applyCommand(next, c)).toBe(next);
  const revision = next.revisions.find((r) => r.operationId === c.opId)!;
  const undone = applyCommand(next, {
    type: 'undoRevision',
    userId: next.userId,
    namespace: next.namespace,
    opId: 'undo-photo',
    at: result.at,
    revisionId: revision.id,
    expectedVersion: revision.after.version,
  });
  expect(undone.nodes.slice(-2).every((n) => n.deletedAt)).toBe(true);
  expect(undone.memos?.at(-1)?.deletedAt).toBeTruthy();
  expect(undone.studyMaterials?.at(-1)?.deletedAt).toBeTruthy();
});
it('rejects malformed parents/cycles, stale outlines and colliding IDs atomically', () => {
  const state = createDemoState(),
    before = structuredClone(state),
    c = command(state);
  expect(() => validatePhotoRows([{ ...rows[0], parentId: 'child' }, rows[1]])).toThrow();
  expect(() => applyCommand(state, { ...c, expectedToken: 'stale' })).toThrow('목차가');
  expect(() => applyCommand(state, { ...c, memoIds: { child: 'photo-root' } })).toThrow('식별자');
  expect(() =>
    applyCommand(state, { ...c, content: { ...c.content, subjectId: 'wrong' } }),
  ).toThrow();
  expect(state).toEqual(before);
});
it('requires a duplicate choice, then reuses nodes without replacing their existing notes', () => {
  const created = applyCommand(createDemoState(), command());
  const p = previewPhotoOutline(created, created.subjects[0].id, null, rows, {});
  expect(p.ready).toBe(false);
  expect(p.entries[0].status).toBe('choose');
  const choices = { root: 'photo-root', child: 'photo-child' },
    c = {
      ...command(created, choices),
      opId: 'second',
      materialId: 'second-material',
      memoIds: { child: 'second-note' },
    };
  const next = applyCommand(created, c);
  expect(next.nodes).toEqual(created.nodes);
  expect(next.memos?.[0]).toEqual(created.memos?.[0]);
  expect(next.memos?.at(-1)?.id).toBe('second-note');
});
