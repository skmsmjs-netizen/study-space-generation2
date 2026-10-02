// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { emptyConceptEdition } from '../domain/concept-production';
import { conceptHash, importConceptWorkFiles, splitConceptWork, type ConceptWorkFile } from './concept-production';

async function work(): Promise<ConceptWorkFile> {
  const original = { id: 'a-1', name: '예시', def: '보존할 원문', ex: '조건', insight: '예외', type: '기타', cat: 1 };
  const raw = JSON.stringify({ items: [original], annotations: ['사용자 메모'] }, null, 2);
  const sha256 = await conceptHash(raw), catalogId = `concept-catalog:${sha256}`;
  const jobs = ['concept-batch:first', 'concept-batch:second'];
  return {
    format: 'concept-work-v1', original: { raw, sha256, filename: '원문.json' },
    batches: jobs.map((id, index) => ({ id, content: { catalogId, sourceIds: [original.id], baseVersions: { [original.id]: index }, status: 'closed' } })),
    results: jobs.map((jobId, index) => ({
      format: 'concept-results-v1', jobId, sourceSha256: sha256,
      items: [{ sourceId: original.id, expectedVersion: index, content: {
        ...emptyConceptEdition(catalogId, original), jobId, displayType: '정의형', reason: '원문과 예시를 구별합니다.',
        screen: { type: '정의형', title: `${index + 1}번째 판본`, intro: '같은 개념의 수정 이력입니다.', mode: 'plain', navigation: 'static',
          scenes: [{ id: 'scene-1', action: '읽기', title: '조건을 확인해요.', body: '첫 문장의 조건을 보존해요. '.repeat(100), takeaway: '원문과 판본은 구별합니다.', caption: '' }] },
      } }],
    })),
  };
}
function repository() {
  let state = emptyState('current-owner', 'test'), commits = 0;
  return {
    getSnapshot: () => state, get commits() { return commits; },
    execute: (command: Command) => (state = applyCommand(state, command)),
    executeMany: (commands: Command[]) => {
      const next = commands.reduce(applyCommand, state);
      if (commands.length) commits++;
      return state = next;
    },
  };
}
describe('bounded multipart concept work', () => {
  it('restores ordered history from reversed file selection once and repeats without duplication', async () => {
    const file = await work(), limit = JSON.stringify({ ...file, results: [file.results[0]] }).length + 200;
    const parts = await splitConceptWork(file, limit);
    expect(parts).toHaveLength(2); expect(parts.every(raw => raw.length <= limit)).toBe(true);
    const target = repository(); await importConceptWorkFiles(target, [...parts].reverse());
    const state = structuredClone(target.getSnapshot());
    expect(state.conceptCatalogs![0].raw).toBe(file.original.raw);
    expect(state.conceptEditions![0].screen?.title).toBe('2번째 판본');
    expect(state.conceptEditions![0].checks).toEqual({ classification: false, meaning: false, conditions: false, example: false, wording: false, screen: false });
    expect(target.commits).toBe(1);
    await importConceptWorkFiles(target, parts);
    expect(target.getSnapshot()).toEqual(state); expect(target.commits).toBe(1);
  });
  it('rejects missing, duplicated, damaged and semantically invalid final parts without partial writes', async () => {
    const file = await work(), limit = JSON.stringify({ ...file, results: [file.results[0]] }).length + 200;
    const parts = await splitConceptWork(file, limit), target = repository(), before = target.getSnapshot();
    await expect(importConceptWorkFiles(target, parts.slice(0, 1))).rejects.toThrow('모두');
    await expect(importConceptWorkFiles(target, [parts[0], parts[0]])).rejects.toThrow();
    const damaged = JSON.parse(parts[1]); damaged.results[0].items[0].content.screen.title = '손상된 제목';
    await expect(importConceptWorkFiles(target, [parts[0], JSON.stringify(damaged)])).rejects.toThrow('내용');
    const invalid = structuredClone(file); invalid.results[1].items[0].content.screen!.title = '';
    const invalidParts = await splitConceptWork(invalid, limit);
    await expect(importConceptWorkFiles(target, invalidParts)).rejects.toThrow();
    expect(target.getSnapshot()).toBe(before); expect(target.commits).toBe(0);
  });
});
