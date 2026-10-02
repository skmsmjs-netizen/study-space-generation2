import { expect, test, type Page } from '@playwright/test';
import { createDemoState } from '../../src/domain/fixtures';
import { decodeStoredText, encodeStoredText } from '../../src/data/storage-codec';

async function openWorkspaceControl(page: Page, name: string) {
  const button = page.getByRole('button', { name, exact: true });
  if (!(await button.isVisible())) {
    const details =
      name === '반응 속도 확인'
        ? page.locator('.sidebar-bottom:visible, .compact-menu:visible').first()
        : page
            .locator('details')
            .filter({ has: page.locator('summary', { hasText: /^작업 도구$/ }) })
            .first();
    if (!(await details.evaluate((node) => (node as HTMLDetailsElement).open)))
      await details.locator('summary').first().click();
  }
  await button.click();
}

const original = '  원문찾기 조건과 예외\n<img src=x onerror=alert(1)>를 글자로 남긴다.\n끝 공백  ';
function fixture() {
  const data = createDemoState(),
    at = '2026-10-02T00:00:00.000Z';
  const entity = (id: string) => ({
    id,
    namespace: data.namespace,
    userId: data.userId,
    createdAt: at,
    updatedAt: at,
    version: 1,
    deletedAt: null,
  });
  data.studyMaterials = [
    {
      ...entity('search-source'),
      title: '보존할 검색 자료',
      subjectId: 'demo-subject-math',
      topicId: 'demo-topic-function',
      sourceText: original,
      audio: null,
      results: [],
    },
  ];
  data.narratives.push({
    ...entity('search-note'),
    kind: 'topic-note',
    ownerId: 'demo-topic-function',
    body: '원문찾기와 연결된 주제 메모',
  });
  for (let i = 0; i < 85; i++) {
    data.sessions.push({ ...entity(`history-session-${i}`), dateEvidence: { kind: 'unknown' } });
    data.records.push({
      ...entity(`history-record-${i}`),
      sessionId: `history-session-${i}`,
      subjectId: 'demo-subject-math',
      targetId: 'demo-topic-function',
      body: `  이력원문 ${i}\n예외 보존  `,
      done: false,
      dateEvidence: { kind: 'unknown' },
      trace: {},
    });
  }
  return data;
}
async function seed(page: Page) {
  const data = fixture(),
    value = encodeStoredText(JSON.stringify({ sequence: 0, data }));
  await page.addInitScript((stored) => {
    if (!localStorage.getItem('study-space:demo:v1'))
      localStorage.setItem('study-space:demo:v1', stored);
  }, value);
  return data;
}
async function saved(page: Page) {
  const raw = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  if (!raw) throw new Error('Expected the isolated fixture to remain stored');
  return JSON.parse(decodeStoredText(raw)).data;
}

test('command search, original excerpts, filters, return and local performance controls remain usable', async ({
  page,
}, info) => {
  const source = await seed(page);
  const workers: string[] = [];
  page.on('worker', (worker) => workers.push(worker.url()));
  await page.goto('?space=demo#/subjects');
  await openWorkspaceControl(page, '빠른 명령');
  const commands = page.getByRole('dialog', { name: '지금 할 일 찾기', exact: true });
  await commands.getByRole('textbox', { name: '명령 찾기', exact: true }).fill('찾기 열기');
  await commands.getByRole('button', { name: '찾기 열기', exact: true }).click();
  await expect(page).toHaveURL(/#\/search$/);
  const search = page.getByRole('region', { name: '공부 자료 찾기', exact: true });
  await search.getByRole('searchbox').fill('원문찾기');
  await expect(search.getByRole('link', { name: '보존할 검색 자료', exact: true })).toBeVisible();
  await expect(
    search.getByRole('link', { name: '함수는 어떤 관계일까?', exact: true }),
  ).toBeVisible();
  await expect(search.locator('mark').first()).toHaveText('원문찾기');
  await search.getByLabel('검색 자료 종류', { exact: true }).selectOption('강의 자료');
  await expect(search.getByRole('status')).toHaveText('찾은 항목 1개');
  await expect(search.getByRole('link')).toHaveCount(1);
  await expect(search.getByText(/<img src=x onerror=alert\(1\)>를 글자로 남긴다\./)).toBeVisible();
  expect(await search.locator('img').count()).toBe(0);
  await search.getByRole('link', { name: '보존할 검색 자료', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.goBack();
  await expect(search.getByRole('searchbox')).toHaveValue('원문찾기');
  await expect(search.getByLabel('검색 자료 종류', { exact: true })).toHaveValue('강의 자료');
  await search.getByLabel('검색 순서', { exact: true }).selectOption('source');
  await expect(search.getByRole('status')).toHaveText('찾은 항목 1개');
  await openWorkspaceControl(page, '반응 속도 확인');
  const timing = page.getByRole('dialog', { name: '반응 속도 확인', exact: true });
  await expect(timing.getByText('검색 → 결과 표시', { exact: true }).locator('..')).toContainText(
    /[1-9]\d*회/,
  );
  await timing.getByRole('button', { name: '측정값 비우기', exact: true }).click();
  await expect(timing.getByRole('status')).toHaveText(
    '측정값만 비웠습니다. 공부 기록은 유지됩니다.',
  );
  await timing.getByRole('button', { name: '반응 속도 확인 닫기', exact: true }).click();
  await page.reload();
  await expect(search.getByRole('searchbox')).toHaveValue('원문찾기');
  await expect(search.getByLabel('검색 순서', { exact: true })).toHaveValue('source');
  await expect(search.getByRole('status')).toHaveText('찾은 항목 1개');
  expect(workers.some((url) => url.includes('workspace-search'))).toBe(true);
  expect(await saved(page)).toEqual(source);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('search-original-filter.png'), fullPage: false });
});

test('accumulated record history expands by forty and restores its open range without altering records', async ({
  page,
}, info) => {
  const source = await seed(page);
  await page.goto('?space=demo#/node/demo-topic-function');
  const history = page.getByRole('region', { name: '공부 기록 목록', exact: true });
  await expect(history.locator('.record-card')).toHaveCount(40);
  await expect(history).toContainText('85개 중 40개 표시');
  await history.getByRole('button', { name: '공부 기록 더 보기', exact: true }).click();
  await expect(history.locator('.record-card')).toHaveCount(80);
  await page.getByRole('link', { name: '찾기', exact: true }).first().click();
  await page.goBack();
  await expect(history.locator('.record-card')).toHaveCount(80);
  await page.reload();
  await expect(history.locator('.record-card')).toHaveCount(80);
  await history.getByRole('button', { name: '공부 기록 모두 펼치기', exact: true }).click();
  await expect(history.locator('.record-card')).toHaveCount(85);
  await expect(history).toContainText('이력원문 0');
  expect(await saved(page)).toEqual(source);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('history-expanded.png'), fullPage: false });
});
