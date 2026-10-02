import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { webcrypto } from 'node:crypto';
import { ConceptLibrary } from './concept-library';
import { DemoRepository } from '../data/demo-repository';
import { conceptHash, importConceptCatalog, saveConceptEdition } from '../data/concept-production';
import { emptyConceptEdition, EMPTY_CONCEPT_CHECKS, conceptEditionId } from '../domain/concept-production';
import { loadConceptReadingPack, type ConceptReadingPack } from '../data/concept-reading-pack';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { storagePrefix, type SaveStatus, type StudyRepository } from '../data/repository';
import { projectPublishedConceptSource } from '../domain/concept-publication';
vi.mock('../data/concept-reading-pack', () => ({ BUNDLED_CONCEPT_CATALOG: 'built-in:concept-reading-pack', loadConceptReadingPack: vi.fn() }));
let pack: ConceptReadingPack;
beforeEach(async () => {
  localStorage.clear(); sessionStorage.clear();
  vi.stubGlobal('crypto', webcrypto);
  vi.stubGlobal('matchMedia', vi.fn(() => ({matches:false, addEventListener:vi.fn(), removeEventListener:vi.fn()})));
  Element.prototype.scrollIntoView = vi.fn();
  const items = [1,2].map(i => ({id:`fixture-${i}`,name:`개념 ${i}`,def:'원문',ex:'예시',insight:'조건',type:'일반',cat:1}));
  const raw = JSON.stringify({items});
  const hash = Buffer.from(await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))).toString('hex');
  const id = `concept-catalog:${hash}`;
  pack = {format:'concept-reading-pack',version:1,sourceSha256:hash,canonicalSha256:'canonical',payloadSha256:'payload',catalog:{id,raw,sha256:hash,filename:'개념 전집.json'},editions:items.map(item=>({
    ...emptyConceptEdition(id,item), id:conceptEditionId(id,item.id),version:2,status:'published',displayType:'정의형',
    checks:{classification:true,meaning:true,conditions:true,example:true,wording:true,screen:true},
    screen:{type:'정의형',title:'핵심 설명',intro:'',mode:'generic',navigation:'static',scenes:[{id:'first',action:'읽기',title:'핵심 설명',body:`기본 설명 ${item.id}`,caption:'',takeaway:''}]},
  }))};
  vi.mocked(loadConceptReadingPack).mockResolvedValue(pack);
});
function mount(repo: StudyRepository) {
  function Harness() {const [data,setData]=useState(repo.getSnapshot());return <ConceptLibrary data={data} repository={repo} onSaved={setData}/>;}
  return render(<Harness/>);
}
const findParagraph = (text: string) => screen.findByText(
  (_, element) => element?.tagName === 'P' && element.textContent === text,
);

// Real local domain commands with a controlled transport result. This fixture
// exercises the personal UI boundary; it does not simulate a server acknowledgement.
async function personalFixture(withCatalog = false, capabilities = ['saveConceptEdition', 'importConceptCatalog']) {
  let data = emptyState('concept-catalog-personal-fixture', 'personal');
  let status: SaveStatus = { phase: 'saved', pending: 0, message: 'fixture' };
  let flushResult: SaveStatus = status;
  const execute = vi.fn((command: Command) => {
    data = applyCommand(data, command);
    return data;
  });
  const flush = vi.fn(async () => { status = flushResult; });
  const repository: StudyRepository = {
    getSnapshot: () => data,
    execute,
    flush,
    getStatus: () => status,
    getCapabilities: () => capabilities,
  };
  if (withCatalog) await importConceptCatalog(repository, pack.catalog.raw, pack.catalog.filename);
  execute.mockClear();
  return { repository, execute, flush, nextFlush(result: SaveStatus) { flushResult = result; } };
}

async function publishedBookFixture() {
  const local = structuredClone(pack);
  const raw = JSON.stringify({
    source: 'synthetic private fixture',
    editorMetadata: { cursor: 3 },
    items: JSON.parse(local.catalog.raw).items.map((item: Record<string, unknown>) => ({
      ...item,
      notePath: `private-fixture/${item.id}.md`,
      annotations: [{ text: '배포에 넣지 않는 합성 주석' }],
    })),
  });
  const privateHash = await conceptHash(raw);
  const privateId = `concept-catalog:${privateHash}`;
  const privateCatalog = { ...local.catalog, raw, sha256: privateHash, id: privateId };
  const privateEditions: ConceptReadingPack['editions'] = local.editions.map(edition => ({
    ...edition,
    catalogId: privateId,
    id: conceptEditionId(privateId, edition.sourceId),
    screen: { ...edition.screen!,
      scenes: edition.screen!.scenes.map(scene => ({ ...scene, purpose: '뜻과 예시, 적용 범위를 함께 읽습니다.' })),
      design: {
      templateVersion: '20261001-v1', templateId: 'definition',
      sourceId: edition.sourceId, sourceSha256: privateHash, interaction: 'static',
      question: '어떤 뜻을 설명하나요?', selectionReason: '뜻과 예시, 적용 범위를 함께 보여 줍니다.',
      roles: ['meaning', 'example', 'boundary'].map(key => ({ key, sceneIds: ['first'] })),
    } },
  }));
  const publicRaw = projectPublishedConceptSource(raw);
  const publicHash = await conceptHash(publicRaw);
  const publicId = `concept-catalog:${publicHash}`;
  pack = {
    ...local, distribution: 'published', originalSourceSha256: privateHash,
    sourceSha256: publicHash,
    catalog: { ...local.catalog, id: publicId, raw: publicRaw, sha256: publicHash },
    editions: privateEditions.map(edition => ({
      ...edition, catalogId: publicId, id: conceptEditionId(publicId, edition.sourceId),
      screen: { ...edition.screen!, design: { ...edition.screen!.design!, sourceSha256: publicHash } },
      jobId: null, promptVersion: 'concept-reading-published-v1',
    })),
  };
  pack.payloadSha256 = await conceptHash(JSON.stringify({ catalog: pack.catalog, editions: pack.editions }));
  vi.mocked(loadConceptReadingPack).mockResolvedValue(pack);
  return { privateCatalog, privateEditions };
}
it('opens the book without writing an account ledger and retains search after remount',async()=>{
  const repo=new DemoRepository(localStorage), before=JSON.stringify(repo.getSnapshot());
  const view=mount(repo);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.change(screen.getByLabelText('개념 찾기'),{target:{value:'개념 2'}});
  fireEvent.click(screen.getByRole('button',{name:'개념 2'}));
  expect(await findParagraph('기본 설명 fixture-2')).toBeVisible();
  expect(JSON.stringify(repo.getSnapshot())).toBe(before);
  view.unmount();mount(repo);
  expect(await findParagraph('기본 설명 fixture-2')).toBeVisible();
  fireEvent.click(screen.getByRole('button',{name:'목록으로 돌아가기'}));
  expect(screen.getByLabelText('개념 찾기')).toHaveValue('개념 2');
});
it('copies just one concept to an unchecked draft and reopens a later personal edit without overwriting it',async()=>{
  const repo=new DemoRepository(localStorage);
  const view=mount(repo);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button',{name:'개념 1'}));
  fireEvent.click(screen.getByRole('button',{name:'설명 만들기'}));
  fireEvent.click(await screen.findByRole('button',{name:'내 설명으로 가져와 수정'}));
  await waitFor(()=>expect(repo.getSnapshot().conceptEditions).toHaveLength(1));
  const e=repo.getSnapshot().conceptEditions![0];
  expect(e.sourceId).toBe('fixture-1');expect(e.status).toBe('draft');expect(Object.values(e.checks).every(v=>!v)).toBe(true);
  view.unmount();
  const edited={...e, screen:{...e.screen!,scenes:[{...e.screen!.scenes[0],body:'내가 직접 고친 설명'}]}};
  saveConceptEdition(repo,edited,e.version);
  const before=JSON.stringify(repo.getSnapshot());
  sessionStorage.clear();
  mount(repo);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button',{name:'개념 1'}));
  fireEvent.click(screen.getByRole('button',{name:'설명 만들기'}));
  fireEvent.click(await screen.findByRole('button',{name:'내 설명으로 가져와 수정'}));
  await screen.findByText('내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  expect(JSON.stringify(repo.getSnapshot())).toBe(before);
});
it('uses a personal published version before the book and leaves unpublished changes intact',async()=>{
  const repo=new DemoRepository(localStorage);
  await importConceptCatalog(repo,pack.catalog.raw,pack.catalog.filename);
  const content={...pack.editions[0],status:'draft' as const,checks:{...EMPTY_CONCEPT_CHECKS},screen:{...pack.editions[0].screen!,scenes:[{...pack.editions[0].screen!.scenes[0],body:'내가 확인한 설명'}]}};
  saveConceptEdition(repo,content,0);
  const draft=repo.getSnapshot().conceptEditions![0];
  saveConceptEdition(repo,{...draft,status:'published',checks:pack.editions[0].checks},draft.version);
  const before=JSON.stringify(repo.getSnapshot());
  mount(repo);await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button',{name:'개념 1'}));
  expect(await findParagraph('내가 확인한 설명')).toBeVisible();
  expect(JSON.stringify(repo.getSnapshot())).toBe(before);
});
it('keeps file import reachable and permits retrying a failed book load',async()=>{
  vi.mocked(loadConceptReadingPack).mockRejectedValueOnce(Error('offline'));
  const repo=new DemoRepository(localStorage);mount(repo);
  const retry=await screen.findByRole('button',{name:'전집 다시 열기'});fireEvent.click(retry);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button',{name:'설명 만들기'}));
  fireEvent.click(screen.getByRole('button',{name:'다른 원문 가져오기'}));
  expect(screen.getByLabelText('개념 원문 가져오기',{exact:true})).toBeEnabled();
});

it('returns from a copied draft to the book and clears only editing-only filters', async () => {
  const repository = new DemoRepository(localStorage);
  mount(repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  await screen.findByLabelText('설명을 시작하는 문장');
  const copiedState = JSON.stringify(repository.getSnapshot());
  fireEvent.change(screen.getByLabelText('설명을 시작하는 문장'), { target: { value: '계속 작성할 내 초안' } });
  fireEvent.click(screen.getByRole('button', { name: '읽기' }));
  expect(await findParagraph('기본 설명 fixture-1')).toBeVisible();
  expect(screen.queryByLabelText('설명을 시작하는 문장')).not.toBeInTheDocument();
  expect(JSON.stringify(repository.getSnapshot())).toBe(copiedState);
  fireEvent.click(screen.getByRole('button', { name: '목록으로 돌아가기' }));
  expect(await screen.findByText('2개 · 검토를 마친 설명')).toBeVisible();
  for (const filter of ['보류', '미분류']) {
    fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
    fireEvent.change(screen.getByLabelText('화면 유형'), { target: { value: filter } });
    fireEvent.click(screen.getByRole('button', { name: '읽기' }));
    expect(screen.getByLabelText('화면 유형')).toHaveValue('');
    expect(screen.getByRole('button', { name: '개념 2' })).toBeVisible();
  }
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.change(screen.getByLabelText('화면 유형'), { target: { value: '정의형' } });
  fireEvent.change(screen.getByLabelText('개념 찾기'), { target: { value: '개념 2' } });
  fireEvent.click(screen.getByRole('button', { name: '읽기' }));
  expect(screen.getByLabelText('화면 유형')).toHaveValue('정의형');
  expect(screen.getByLabelText('개념 찾기')).toHaveValue('개념 2');
  expect(screen.getByRole('button', { name: '개념 2' })).toBeVisible();
});

it('retains recoverable editor text when save and undo flush resolve without server confirmation', async () => {
  const fixture = await personalFixture();
  mount(fixture.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  await screen.findByText('내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  const draftKey = `${storagePrefix(fixture.repository.getSnapshot())}:concept-editor:${encodeURIComponent(pack.catalog.id)}:fixture-1:v1`;
  fixture.nextFlush({ phase: 'error', pending: 1, message: 'offline fixture' });
  fireEvent.change(screen.getByLabelText('설명을 시작하는 문장'), { target: { value: '서버 확인을 기다리는 내 설명' } });
  fireEvent.click(screen.getByRole('button', { name: '설명 저장' }));
  expect(await screen.findByText('설명은 이 기기에 보관했습니다. 서버 저장은 아직 확인되지 않았습니다. 복구용 초안도 유지합니다.')).toBeVisible();
  expect(fixture.repository.getStatus!()).toMatchObject({ phase: 'error', pending: 1 });
  expect(JSON.parse(JSON.parse(localStorage.getItem(draftKey)!).text).screen.intro).toBe('서버 확인을 기다리는 내 설명');
  expect(fixture.repository.getSnapshot().conceptEditions![0].screen!.intro).toBe('서버 확인을 기다리는 내 설명');
  expect(screen.queryByText('설명을 저장했습니다. 내용과 화면을 확인해 주세요.')).not.toBeInTheDocument();

  fixture.nextFlush({ phase: 'conflict', pending: 1, message: 'conflict fixture' });
  fireEvent.click(screen.getByRole('button', { name: '직전 수정 되돌리기' }));
  expect(await screen.findByText('이 기기에서 직전 수정으로 되돌렸습니다. 서버 저장은 아직 확인되지 않았습니다. 복구용 초안도 유지합니다.')).toBeVisible();
  expect(fixture.repository.getStatus!()).toMatchObject({ phase: 'conflict', pending: 1 });
  const restoredDraft = JSON.parse(localStorage.getItem(draftKey)!);
  expect(JSON.parse(restoredDraft.text).screen.intro).toBe('');
  expect(restoredDraft.version).toBe(fixture.repository.getSnapshot().conceptEditions![0].version);
  expect(screen.queryByText('직전 수정으로 되돌렸습니다. 이후의 이력도 보관했습니다.')).not.toBeInTheDocument();
  expect(fixture.flush).toHaveBeenCalledTimes(3);
});

it('blocks a missing import capability before writes and reuses an existing source with only one save command', async () => {
  const absent = await personalFixture(false, ['saveConceptEdition']);
  const before = JSON.stringify(absent.repository.getSnapshot());
  const view = mount(absent.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  expect(await screen.findByText('현재 저장 연결에서는 개념 원문을 보관할 수 없습니다. 설명은 계속 읽을 수 있습니다.')).toBeVisible();
  expect(absent.execute).not.toHaveBeenCalled();
  expect(absent.flush).not.toHaveBeenCalled();
  expect(JSON.stringify(absent.repository.getSnapshot())).toBe(before);
  view.unmount();
  sessionStorage.clear();

  const present = await personalFixture(true, ['saveConceptEdition']);
  const originalCatalog = JSON.stringify(present.repository.getSnapshot().conceptCatalogs);
  mount(present.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 2' }));
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  await screen.findByText('내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  expect(present.execute.mock.calls.map(([command]) => command.type)).toEqual(['saveConceptEdition']);
  expect(JSON.stringify(present.repository.getSnapshot().conceptCatalogs)).toBe(originalCatalog);
  const editions = present.repository.getSnapshot().conceptEditions!;
  expect(editions).toHaveLength(1);
  expect(editions[0]).toMatchObject({ sourceId: 'fixture-2', status: 'draft', userId: 'concept-catalog-personal-fixture', namespace: 'personal' });
  expect(Object.values(editions[0].checks).every(checked => !checked)).toBe(true);
});

it('uses an existing private published explanation through a public-source alias without changing its ledger', async () => {
  const book = await publishedBookFixture();
  const fixture = await personalFixture();
  await importConceptCatalog(fixture.repository, book.privateCatalog.raw, book.privateCatalog.filename);
  const source = book.privateEditions[0];
  saveConceptEdition(fixture.repository, {
    ...source, status: 'draft', checks: { ...EMPTY_CONCEPT_CHECKS },
    screen: { ...source.screen!, scenes: [{ ...source.screen!.scenes[0], body: '공개 설명보다 먼저 읽을 내 검토 설명' }] },
  }, 0);
  const draft = fixture.repository.getSnapshot().conceptEditions![0];
  saveConceptEdition(fixture.repository, { ...draft, status: 'published', checks: source.checks }, draft.version);
  const before = JSON.stringify(fixture.repository.getSnapshot());
  fixture.execute.mockClear();
  mount(fixture.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
  expect(await findParagraph('공개 설명보다 먼저 읽을 내 검토 설명')).toBeVisible();
  expect(fixture.execute).not.toHaveBeenCalled();
  expect(JSON.stringify(fixture.repository.getSnapshot())).toBe(before);
  expect(pack.catalog.id).not.toBe(book.privateCatalog.id);
});

it('reopens the exact existing private draft through a published alias and returns to the public book', async () => {
  const book = await publishedBookFixture();
  const fixture = await personalFixture(false, ['saveConceptEdition']);
  await importConceptCatalog(fixture.repository, book.privateCatalog.raw, book.privateCatalog.filename);
  const source = book.privateEditions[0];
  saveConceptEdition(fixture.repository, {
    ...source, status: 'draft', checks: { ...EMPTY_CONCEPT_CHECKS },
    screen: { ...source.screen!, intro: '아직 검토하지 않은 내 문장\n조건은 유지합니다.' },
  }, 0);
  const before = JSON.stringify(fixture.repository.getSnapshot());
  fixture.execute.mockClear();
  mount(fixture.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
  expect(await findParagraph('기본 설명 fixture-1')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  await screen.findByText('내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  expect(screen.getByLabelText('설명을 시작하는 문장')).toHaveValue('아직 검토하지 않은 내 문장\n조건은 유지합니다.');
  expect(fixture.execute).not.toHaveBeenCalled();
  expect(JSON.stringify(fixture.repository.getSnapshot())).toBe(before);
  fireEvent.click(screen.getByRole('button', { name: '읽기' }));
  expect(await findParagraph('기본 설명 fixture-1')).toBeVisible();
  expect(screen.queryByLabelText('설명을 시작하는 문장')).not.toBeInTheDocument();
  expect(JSON.stringify(fixture.repository.getSnapshot())).toBe(before);
});

it('copies one public explanation to an existing private source without import permission and binds its design to that source', async () => {
  const book = await publishedBookFixture();
  const fixture = await personalFixture(false, ['saveConceptEdition']);
  await importConceptCatalog(fixture.repository, book.privateCatalog.raw, book.privateCatalog.filename);
  const originalCatalog = JSON.stringify(fixture.repository.getSnapshot().conceptCatalogs);
  const revisionsBefore = fixture.repository.getSnapshot().revisions.length;
  fixture.execute.mockClear();
  mount(fixture.repository);
  await screen.findByText('2개 · 검토를 마친 설명');
  fireEvent.click(screen.getByRole('button', { name: '개념 2' }));
  fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
  fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
  await screen.findByText('내 설명을 열었습니다. 기존 수정본이 있으면 그대로 이어갑니다.');
  expect(fixture.execute.mock.calls.map(([command]) => command.type)).toEqual(['saveConceptEdition']);
  const after = fixture.repository.getSnapshot();
  expect(after.conceptEditions).toHaveLength(1);
  const copied = after.conceptEditions![0];
  expect(copied).toMatchObject({
    id: conceptEditionId(book.privateCatalog.id, 'fixture-2'),
    catalogId: book.privateCatalog.id, sourceId: 'fixture-2', status: 'draft', jobId: null,
    checks: EMPTY_CONCEPT_CHECKS,
  });
  expect(copied.screen!.design!.sourceSha256).toBe(book.privateCatalog.sha256);
  expect(copied.screen!.design!.sourceSha256).not.toBe(pack.sourceSha256);
  expect(copied.screen!.scenes).toEqual(pack.editions[1].screen!.scenes);
  expect(copied.evidence).toEqual(pack.editions[1].evidence);
  expect(JSON.stringify(after.conceptCatalogs)).toBe(originalCatalog);
  expect(after.revisions).toHaveLength(revisionsBefore + 1);
});

it.each(['raw-hash-mismatch', 'projected-source-mismatch'] as const)(
  'rejects a changed private alias before copying (%s)',
  async mismatch => {
    const book = await publishedBookFixture();
    const fixture = await personalFixture(false, ['saveConceptEdition']);
    const changed = JSON.parse(book.privateCatalog.raw);
    changed.items[0].def = '공개 원문과 다른 합성 정의';
    const changedRaw = JSON.stringify(changed);
    const raw = mismatch === 'raw-hash-mismatch' ? book.privateCatalog.raw : changedRaw;
    await importConceptCatalog(fixture.repository, raw, book.privateCatalog.filename);
    const target = fixture.repository.getSnapshot().conceptCatalogs![0];
    if (mismatch === 'projected-source-mismatch') pack.originalSourceSha256 = target.sha256;
    const source = book.privateEditions[0];
    saveConceptEdition(fixture.repository, {
      ...source, catalogId: target.id, status: 'draft', checks: { ...EMPTY_CONCEPT_CHECKS },
      screen: { ...source.screen!,
        design: { ...source.screen!.design!, sourceSha256: target.sha256 },
        scenes: [{ ...source.screen!.scenes[0], body: '잘못 연결되면 보이는 별도 원문의 설명' }],
      },
    }, 0);
    const draft = fixture.repository.getSnapshot().conceptEditions![0];
    saveConceptEdition(fixture.repository, { ...draft, status: 'published', checks: source.checks }, draft.version);
    // Simulate damaged stored bytes only in this synthetic fixture. Its advertised
    // SHA remains unchanged so the write boundary must reject it, not repair it.
    if (mismatch === 'raw-hash-mismatch') target.raw = changedRaw;
    const before = JSON.stringify(fixture.repository.getSnapshot());
    fixture.execute.mockClear();
    mount(fixture.repository);
    await screen.findByText('2개 · 검토를 마친 설명');
    fireEvent.click(screen.getByRole('button', { name: '개념 1' }));
    expect(await findParagraph('기본 설명 fixture-1')).toBeVisible();
    expect(screen.queryByText('잘못 연결되면 보이는 별도 원문의 설명')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '설명 만들기' }));
    fireEvent.click(await screen.findByRole('button', { name: '내 설명으로 가져와 수정' }));
    const message = mismatch === 'raw-hash-mismatch'
      ? '보관된 원문이 전집과 다릅니다. 기존 원문과 설명은 그대로입니다.'
      : '보관된 원문과 배포 전집의 개념이 다릅니다. 기존 원문과 설명은 그대로입니다.';
    expect(await screen.findByText(message)).toBeVisible();
    expect(fixture.execute).not.toHaveBeenCalled();
    expect(fixture.flush).not.toHaveBeenCalled();
    expect(JSON.stringify(fixture.repository.getSnapshot())).toBe(before);
  },
);
