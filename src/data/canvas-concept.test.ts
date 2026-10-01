import { beforeEach, expect, it, vi } from 'vitest';
import { DemoRepository } from './demo-repository';
import { CANVAS_ID, projectCanvas } from '../domain/canvas';
import {
  newConceptDraft,
  editConceptDraft,
  saveConceptMemo,
  conceptDraftKey,
  readConceptDraft,
  writeConceptDraft,
} from './canvas-concept';
import { readRescuedDraft } from './draft-safety';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
const ctx = (repo: DemoRepository) => ({
  opId: crypto.randomUUID(),
  at: new Date().toISOString(),
  userId: repo.getSnapshot().userId,
  namespace: repo.getSnapshot().namespace,
});
it('creates an independent concept once, projects its title and exact explanation, and keeps study data and geometry', () => {
  const repo = new DemoRepository(localStorage),
    before = repo.getSnapshot(),
    cards = projectCanvas(before).cards;
  const positions = Object.fromEntries(cards.map((c) => [c.id, c.position]));
  repo.execute({
    ...ctx(repo),
    type: 'saveCanvasLayout',
    id: CANVAS_ID,
    expectedVersion: 0,
    positions,
    links: [],
  });
  const draft = {
    ...newConceptDraft(),
    name: '  에너지 보존  ',
    description: '  조건 원문\r\n예외  ',
  };
  const result = saveConceptMemo(repo, draft),
    concept = result.memos!.find((m) => m.id === draft.id)!;
  expect(saveConceptMemo(repo, draft)).toBe(result);
  expect(editConceptDraft(concept)).toMatchObject({
    name: draft.name,
    description: draft.description,
  });
  expect(projectCanvas(result).cards.find((c) => c.entityId === draft.id)).toMatchObject({
    kind: 'concept',
    name: draft.name,
    ownerId: null,
  });
  expect(projectCanvas(result).cards.filter((c) => c.kind !== 'concept')).toEqual(cards);
  expect(result.records).toEqual(before.records);
  expect(result.nodes).toEqual(before.nodes);
  expect(projectCanvas(result).links.some((l) => l.target === `memo:${draft.id}`)).toBe(false);
  expect(new DemoRepository(localStorage).getSnapshot().memos).toEqual(result.memos);
});
it('keeps course ownership and links across edit, trash, restore and conflict', () => {
  const repo = new DemoRepository(localStorage),
    draft = { ...newConceptDraft('demo-subject-math'), name: '에너지 보존' };
  saveConceptMemo(repo, draft);
  const memo = repo.getSnapshot().memos!.find((m) => m.id === draft.id)!;
  const link = {
    id: 'relationship',
    source: `memo:${draft.id}`,
    target: 'node:demo-topic-function',
    label: '적용 조건',
  };
  repo.execute({
    ...ctx(repo),
    type: 'saveCanvasLayout',
    id: CANVAS_ID,
    expectedVersion: 0,
    positions: { [`memo:${draft.id}`]: { x: -50, y: 70 } },
    links: [link],
  });
  expect(
    projectCanvas(repo.getSnapshot(), ['demo-subject-science'], undefined, false).cards.some(
      (c) => c.entityId === draft.id,
    ),
  ).toBe(false);
  saveConceptMemo(repo, { ...editConceptDraft(memo), name: '보존 법칙', description: '새 조건' });
  expect(() =>
    saveConceptMemo(repo, { ...editConceptDraft(memo), description: '낡은 편집' }),
  ).toThrow('다른 곳');
  repo.execute({ ...ctx(repo), type: 'trashMemo', id: memo.id, expectedVersion: 2 });
  expect(projectCanvas(repo.getSnapshot()).cards.some((c) => c.entityId === memo.id)).toBe(false);
  repo.execute({ ...ctx(repo), type: 'restoreMemo', id: memo.id, expectedVersion: 3 });
  expect(projectCanvas(repo.getSnapshot()).cards.find((c) => c.entityId === memo.id)).toMatchObject(
    { name: '보존 법칙', position: { x: -50, y: 70 } },
  );
  expect(projectCanvas(repo.getSnapshot()).links).toContainEqual(link);
});
it('preserves draft input on quota failure, separates accounts and refuses damaged content', () => {
  const repo = new DemoRepository(localStorage),
    key = conceptDraftKey(repo.getSnapshot()),
    draft = { ...newConceptDraft(), name: '원문', description: '  설명  ' };
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  expect(() => writeConceptDraft(key, draft, null)).toThrow();
  expect(readRescuedDraft(key)).toBe(JSON.stringify(draft));
  spy.mockRestore();
  const raw = writeConceptDraft(key, draft, JSON.stringify(draft));
  expect(readConceptDraft(key)).toEqual({ raw, draft });
  expect(
    conceptDraftKey({ ...repo.getSnapshot(), namespace: 'personal', userId: 'other' }),
  ).not.toBe(key);
  localStorage.setItem('damaged', '{원문');
  expect(() => readConceptDraft('damaged')).toThrow();
  expect(localStorage.getItem('damaged')).toBe('{원문');
});
