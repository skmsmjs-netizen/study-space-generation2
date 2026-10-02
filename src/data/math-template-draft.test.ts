import { beforeEach, expect, it, vi } from 'vitest';
import {
  freshTemplateWorkspace,
  readTemplateWorkspace,
  templateDraftKey,
  writeTemplateWorkspace,
} from './math-template-draft';
class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  get length() {
    return this.values.size;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
}
beforeEach(() => vi.stubGlobal('localStorage', new MemoryStorage()));
it('isolates owners and preserves inactive entries, raw invalid formulas and saved view', () => {
  const mine = templateDraftKey({ userId: 'mine', namespace: 'personal' }),
    theirs = templateDraftKey({ userId: 'other', namespace: 'personal' }),
    workspace = freshTemplateWorkspace();
  workspace.entries.find((e) => e.kind === 'function')!.expressions = ['a=not-allowed'];
  workspace.entries[1].notes = '  원문\n예외';
  workspace.entries[2].view = { camera: { eye: { x: 2, y: 1, z: 0.5 } } };
  expect(mine).not.toBe(theirs);
  writeTemplateWorkspace(mine, workspace);
  expect(readTemplateWorkspace(mine)).toEqual(workspace);
  expect(readTemplateWorkspace(theirs)).toEqual(freshTemplateWorkspace());
});
it('damaged drafts fail without overwriting their raw source', () => {
  const key = templateDraftKey({ userId: 'damaged', namespace: 'personal' });
  localStorage.setItem(key, '{broken');
  expect(() => readTemplateWorkspace(key)).toThrow();
  expect(localStorage.getItem(key)).toBe('{broken');
});
it('writing failure leaves the previous durable draft and a recoverable latest draft', () => {
  const key = templateDraftKey({ userId: 'blocked', namespace: 'personal' }),
    workspace = freshTemplateWorkspace();
  writeTemplateWorkspace(key, workspace);
  const original = localStorage.getItem(key);
  workspace.entries[0].notes = '최신 입력';
  vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
    throw Error('quota');
  });
  expect(() => writeTemplateWorkspace(key, workspace)).toThrow();
  expect(localStorage.getItem(key)).toBe(original);
  expect(readTemplateWorkspace(key).entries[0].notes).toBe('최신 입력');
});
