import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DemoRepository } from './demo-repository';
import { recallKey, readRecall, saveRecallMemo, writeRecall } from './topic-recall';
import { freshRecall, type RecallDraft } from '../domain/topic-recall';
import { clearRescuedDraft } from './draft-safety';

const topicId = 'demo-topic-function';
const strokes = [{ id: 'original-stroke', ink: 'blue' as const, width: 3, points: [{ x: 21, y: 33, pressure: .23 }, { x: 45, y: 72, pressure: .89 }] }];
let repo: DemoRepository;
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); clearRescuedDraft(recallKey(repo.getSnapshot())); });
describe('recall drawing storage', () => {
  it('reads old text-only drafts and preserves text, coordinates, pressure and IDs in new drafts', () => {
    const data = repo.getSnapshot(), old = { ...freshRecall(), drafts: { [topicId]: { memoId: 'old-text', body: '  원문\r\n ' } } };
    writeRecall(data, old); expect(readRecall(data)).toEqual(old);
    const next = { ...old, drafts: { [topicId]: { ...old.drafts[topicId], strokes } } };
    writeRecall(data, next); expect(readRecall(data)).toEqual(next);
  });
  it('saves drawings without text as linked memos and never creates study attempts', () => {
    const before = repo.getSnapshot(), draft: RecallDraft = { memoId: 'ink-only', body: '', strokes };
    const saved = saveRecallMemo(repo, topicId, draft);
    expect(saved.memos?.[0]).toMatchObject({ id: draft.memoId, ownerId: topicId, body: '', strokes });
    expect(saved.records).toEqual(before.records); expect(saved.sessions).toEqual(before.sessions);
    expect(saveRecallMemo(repo, topicId, draft)).toBe(saved);
    expect(repo.getSnapshot().memos).toHaveLength(1);
  });
  it('rejects a changed drawing with the same saved identity without overwriting the memo', () => {
    const draft = { memoId: 'same-id', body: '  글도 보존  ', strokes };
    saveRecallMemo(repo, topicId, draft); const before = repo.getSnapshot();
    expect(() => saveRecallMemo(repo, topicId, { ...draft, strokes: [] })).toThrow('다른 곳에서 바뀌었습니다');
    expect(repo.getSnapshot()).toBe(before);
  });
  it('preserves damaged stroke source and refuses malformed writes', () => {
    const data = repo.getSnapshot(), key = recallKey(data);
    const damaged = { ...freshRecall(), drafts: { [topicId]: { memoId: 'bad', body: '원래 글', strokes: [{ ...strokes[0], points: [{ x: -1, y: 4, pressure: .5 }] }] } } };
    const raw = JSON.stringify(damaged); localStorage.setItem(key, raw);
    expect(() => readRecall(data)).toThrow(); expect(localStorage.getItem(key)).toBe(raw);
    expect(() => writeRecall(data, damaged)).toThrow(); expect(localStorage.getItem(key)).toBe(raw);
  });
  it('keeps a drawing draft when memo storage fails and retries once', () => {
    const data = repo.getSnapshot(), draft = { memoId: 'retry-ink', body: '', strokes };
    writeRecall(data, { ...freshRecall(), currentId: topicId, drafts: { [topicId]: draft } });
    const original = repo.execute.bind(repo), fail = vi.spyOn(repo, 'execute').mockImplementation(() => { throw Error('write failed'); });
    expect(() => saveRecallMemo(repo, topicId, draft)).toThrow('write failed');
    expect(readRecall(data).drafts[topicId]).toEqual(draft);
    fail.mockImplementation(original); saveRecallMemo(repo, topicId, draft); fail.mockRestore();
    expect(repo.getSnapshot().memos).toHaveLength(1);
  });
});
