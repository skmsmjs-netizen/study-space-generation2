// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { applyCommand, validateState } from './commands';
import { emptyState, type AppState, type Command } from './model';
import {
  conceptEditionId,
  emptyConceptEdition,
  EMPTY_CONCEPT_CHECKS,
  parseConceptSource,
  validateConceptEdition,
} from './concept-production';
import {
  importConceptCatalog,
  openConceptBatch,
  importConceptResults,
  saveConceptEdition,
  conceptJobFile,
  importConceptWork,
} from '../data/concept-production';
import { packServerState, unpackServerState } from '../server/state-codec';
import { handleCommand, type CommandBackend } from '../server/command-handler';
const original = {
  id: 'a-1',
  name: '예시',
  def: '원문\r\n  조건',
  ex: '예시',
  insight: '예외',
  type: '기타',
  cat: 1,
  annotations: ['메모'],
  relations: [{ id: 'b' }],
  extra: { keep: true },
};
const raw = JSON.stringify({ items: [original], unknown: '보존' }, null, 2);
function repo() {
  let state = emptyState('owner', 'test');
  return {
    getSnapshot: () => state,
    execute: (command: Command) => (state = applyCommand(state, command)),
  };
}
async function setup() {
  const r = repo();
  await importConceptCatalog(r, raw, '원문.json');
  const catalog = r.getSnapshot().conceptCatalogs![0];
  const { batch } = openConceptBatch(r, catalog);
  const content = {
    ...emptyConceptEdition(catalog.id, original),
    displayType: '정의형' as const,
    jobId: batch.id,
    reason: '정의와 예시를 읽습니다.',
    screen: {
      type: '정의형' as const,
      title: '핵심',
      intro: '문장',
      navigation: 'choose' as const,
      mode: 'plain',
      scenes: [
        { action: '예시', title: '판단', body: '설명\n조건', caption: '', takeaway: '기억' },
      ],
    },
  };
  const result = {
    format: 'concept-results-v1',
    jobId: batch.id,
    sourceSha256: catalog.sha256,
    items: [{ sourceId: original.id, expectedVersion: 0, content }],
  };
  return { r, catalog, batch, content, result };
}
describe('concept production preserves source and separate editorial review', () => {
  it('continues writing after classification in a new batch based on the saved version', async () => {
    const { r, catalog, batch, result, content } = await setup();
    importConceptResults(r, JSON.stringify(result));
    r.execute({
      type: 'saveConceptBatch',
      userId: 'owner',
      namespace: 'test',
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
      id: batch.id,
      expectedVersion: batch.version,
      content: {
        catalogId: catalog.id,
        sourceIds: batch.sourceIds,
        baseVersions: batch.baseVersions,
        status: 'closed',
      },
    });
    const nextBatch = openConceptBatch(r, catalog, batch.sourceIds).batch;
    expect(nextBatch.baseVersions[original.id]).toBe(1);
    const nextContent = {
      ...content,
      jobId: nextBatch.id,
      screen: { ...content.screen, title: '다음 작성' },
    };
    const nextResult = {
      ...result,
      jobId: nextBatch.id,
      items: [{ sourceId: original.id, expectedVersion: 1, content: nextContent }],
    };
    importConceptResults(r, JSON.stringify(nextResult));
    expect(r.getSnapshot().conceptEditions![0].version).toBe(2);
    expect(r.getSnapshot().conceptCatalogs![0].raw).toBe(raw);
    expect(r.getSnapshot().conceptBatches).toHaveLength(2);
  });
  it('allows temporary empty editing fields but rejects saving them', async () => {
    const { r, content } = await setup();
    const editing = { ...content, screen: { ...content.screen, title: '' } };
    expect(() => validateConceptEdition(editing, true)).not.toThrow();
    expect(() => saveConceptEdition(r, editing, 0)).toThrow();
    expect(r.getSnapshot().conceptEditions ?? []).toHaveLength(0);
    const unsafe = {
      ...content,
      screen: {
        ...content.screen,
        scenes: [{ ...content.screen.scenes[0], math: { invalid: true } }],
      },
    };
    expect(() => validateConceptEdition(unsafe as unknown as typeof content, true)).toThrow();
  });
  it('keeps all exact source fields and roundtrips packed owner metadata', async () => {
    const { r, catalog, result } = await setup();
    importConceptResults(r, JSON.stringify(result));
    const state = r.getSnapshot();
    const stored = packServerState(state, Object.keys(state.appliedOps).at(-1)!);
    expect(stored.userId).toBe('owner');
    expect(unpackServerState(stored).conceptCatalogs![0].userId).toBe('owner');
    expect(unpackServerState(stored)).toEqual(state);
    expect(state.conceptCatalogs![0].raw).toBe(raw);
    expect(parseConceptSource(catalog.raw).items[0]).toEqual(original);
    expect(state.records).toHaveLength(0);
    expect(state.sessions).toHaveLength(0);
  });
  it('rejects duplicate original IDs without a partial import', async () => {
    const r = repo();
    await expect(
      importConceptCatalog(r, JSON.stringify({ items: [original, original] }), 'bad.json'),
    ).rejects.toThrow();
    expect(r.getSnapshot().conceptCatalogs).toBeUndefined();
  });
  it('separates draft save from review and invalidates a changed published body', async () => {
    const { r, content } = await setup();
    const checked = Object.fromEntries(
      Object.keys(EMPTY_CONCEPT_CHECKS).map((k) => [k, true]),
    ) as unknown as typeof EMPTY_CONCEPT_CHECKS;
    expect(() =>
      saveConceptEdition(r, { ...content, checks: checked, status: 'published' }, 0),
    ).toThrow();
    saveConceptEdition(r, content, 0);
    saveConceptEdition(r, { ...content, checks: checked, status: 'published' }, 1);
    expect(() =>
      saveConceptEdition(
        r,
        { ...content, reason: '바뀜', checks: checked, status: 'published' },
        2,
      ),
    ).toThrow();
    saveConceptEdition(r, { ...content, reason: '바뀜' }, 2);
    expect(r.getSnapshot().conceptEditions![0].checks).toEqual(EMPTY_CONCEPT_CHECKS);
  });
  it('reimports once and protects subsequent edits from stale results', async () => {
    const { r, result, content } = await setup();
    expect(importConceptResults(r, JSON.stringify(result)).saved).toBe(1);
    expect(importConceptResults(r, JSON.stringify(result)).repeated).toBe(1);
    saveConceptEdition(r, { ...content, reason: '내가 고친 근거' }, 1);
    expect(() => importConceptResults(r, JSON.stringify(result))).toThrow();
    expect(r.getSnapshot().conceptEditions![0].reason).toBe('내가 고친 근거');
  });
  it('resumes the original batch and does not reserve the same target twice', async () => {
    const { r, catalog, batch } = await setup();
    expect(conceptJobFile(r.getSnapshot(), batch).items[0].expectedVersion).toBe(0);
    expect(() => openConceptBatch(r, catalog)).toThrow();
    validateState(JSON.parse(JSON.stringify(r.getSnapshot())));
  });
  it('imports portable work into the current owner with checks false and reimport no duplication', async () => {
    const { catalog, batch, result } = await setup();
    const r = repo();
    const file = JSON.stringify({
      format: 'concept-work-v1',
      original: catalog,
      batches: [{ id: batch.id, content: batch }],
      results: [result],
    });
    await importConceptWork(r, file);
    await importConceptWork(r, file);
    expect(r.getSnapshot().conceptCatalogs).toHaveLength(1);
    expect(r.getSnapshot().conceptEditions).toHaveLength(1);
    expect(r.getSnapshot().conceptEditions![0].status).toBe('draft');
  });
  it('rejects forged source hashes and cross-account commands before commit', async () => {
    let commits = 0;
    const backend: CommandBackend = {
      authenticate: async () => 'owner',
      access: async () => ({ status: 'approved', administrator: false }),
      read: async () => null,
      commit: async (_u, _n, _b, _c, data) => {
        commits++;
        return { sequence: 1, data };
      },
    };
    const send = (userId: string) =>
      handleCommand(
        new Request('http://test', {
          method: 'POST',
          headers: { Authorization: 'Bearer own' },
          body: JSON.stringify({
            action: 'execute',
            namespace: 'test',
            baseSequence: 0,
            command: {
              type: 'importConceptCatalog',
              userId,
              namespace: 'test',
              at: new Date().toISOString(),
              opId: crypto.randomUUID(),
              id: 'bad',
              raw,
              filename: 'bad.json',
              sha256: '0'.repeat(64),
            },
          }),
        }),
        backend,
      );
    expect((await send('owner')).status).not.toBe(200);
    expect((await send('foreign')).status).not.toBe(200);
    expect(commits).toBe(0);
  });
});

describe('concept template application', () => {
  it('accepts a single static screen and rejects missing role or diagram correspondences', async () => {
    const { r, catalog, content } = await setup();
    const designed = {
      ...content,
      screen: {
        ...content.screen,
        navigation: 'static' as const,
        scenes: [
          { ...content.screen.scenes[0], id: 'meaning', purpose: '뜻·예시·경계를 함께 읽는다.' },
        ],
        design: {
          templateVersion: '20261001-v1',
          templateId: 'definition',
          sourceId: original.id,
          sourceSha256: catalog.sha256,
          interaction: 'static' as const,
          question: '어떤 뜻인가요?',
          selectionReason: '단순 정의를 한 사례와 함께 읽는다.',
          roles: ['meaning', 'example', 'boundary'].map((key) => ({ key, sceneIds: ['meaning'] })),
        },
      },
    };
    saveConceptEdition(r, designed, 0);
    expect(r.getSnapshot().conceptEditions![0].screen?.navigation).toBe('static');
    expect(() =>
      validateConceptEdition({
        ...designed,
        screen: { ...designed.screen, design: { ...designed.screen.design, roles: [] } },
      }),
    ).toThrow();
    const bad = {
      ...designed,
      screen: {
        ...designed.screen,
        scenes: [
          {
            ...designed.screen.scenes[0],
            visual: {
              kind: 'relation' as const,
              label: '관계',
              nodes: [{ id: 'a', label: '대상', detail: '설명' }],
              relations: [{ from: 'a', to: 'missing', label: '연결' }],
              highlighted: [],
            },
          },
        ],
      },
    };
    expect(() => validateConceptEdition(bad)).toThrow();
    expect(() =>
      saveConceptEdition(
        r,
        {
          ...designed,
          screen: {
            ...designed.screen,
            design: { ...designed.screen.design, sourceSha256: 'f'.repeat(64) },
          },
        },
        1,
      ),
    ).toThrow();
    expect(r.getSnapshot().records).toHaveLength(0);
    expect(r.getSnapshot().conceptCatalogs![0].raw).toBe(raw);
  });
  it('reimports a multi-version work file without replaying old bodies over current editing', async () => {
    const { r, catalog, batch, result, content } = await setup();
    importConceptResults(r, JSON.stringify(result));
    r.execute({
      type: 'saveConceptBatch',
      userId: 'owner',
      namespace: 'test',
      opId: crypto.randomUUID(),
      at: new Date().toISOString(),
      id: batch.id,
      expectedVersion: 1,
      content: {
        catalogId: catalog.id,
        sourceIds: batch.sourceIds,
        baseVersions: batch.baseVersions,
        status: 'closed',
      },
    });
    const nextBatch = openConceptBatch(r, catalog, batch.sourceIds).batch;
    const nextResult = {
      ...result,
      jobId: nextBatch.id,
      items: [
        {
          sourceId: original.id,
          expectedVersion: 1,
          content: {
            ...content,
            jobId: nextBatch.id,
            screen: { ...content.screen, title: '두 번째 설명' },
          },
        },
      ],
    };
    const file = JSON.stringify({
      format: 'concept-work-v1',
      original: { raw, sha256: catalog.sha256, filename: 'source.json' },
      batches: [batch, nextBatch].map((b) => ({
        id: b.id,
        content: {
          catalogId: b.catalogId,
          sourceIds: b.sourceIds,
          baseVersions: b.baseVersions,
          status: b.id === batch.id ? 'closed' : 'open',
        },
      })),
      results: [result, nextResult],
    });
    const prefix = repo();
    await importConceptWork(prefix, JSON.stringify({ ...JSON.parse(file), results: [result] }));
    const prefixRevisions = prefix.getSnapshot().revisions.length;
    await importConceptWork(prefix, file);
    expect(prefix.getSnapshot().conceptEditions![0].screen?.title).toBe('두 번째 설명');
    expect(prefix.getSnapshot().revisions.length).toBe(prefixRevisions + 1);
    const target = repo();
    await importConceptWork(target, file);
    const revisions = target.getSnapshot().revisions.length;
    await importConceptWork(target, file);
    expect(target.getSnapshot().revisions).toHaveLength(revisions);
    expect(target.getSnapshot().conceptEditions![0].screen?.title).toBe('두 번째 설명');
    saveConceptEdition(
      target,
      { ...target.getSnapshot().conceptEditions![0], reason: '가져온 뒤 직접 수정' },
      2,
    );
    await expect(importConceptWork(target, file)).rejects.toThrow();
    expect(target.getSnapshot().conceptEditions![0].reason).toBe('가져온 뒤 직접 수정');
  });
});
