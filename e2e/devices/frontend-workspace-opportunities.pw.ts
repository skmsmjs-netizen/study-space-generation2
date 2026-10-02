import { expect, test, type Page } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

async function openWorkspaceControl(page: Page, name: string) {
  const button = page.getByRole('button', { name, exact: true });
  if (!(await button.isVisible())) {
    const details = page
      .locator('details')
      .filter({ has: page.locator('summary', { hasText: /^작업 도구$/ }) })
      .first();
    if (!(await details.evaluate((node) => (node as HTMLDetailsElement).open)))
      await details.locator('summary').first().click();
  }
  await button.click();
}

test('source, side note, named workspace and command keep original text across return and reopen', async ({
  page,
}, info) => {
  const original = '  입력 원문과 조건\n공부함은 숙달 판정이 아니다.\n끝 공백  ';
  const memo = '  비교할 예외를 남긴다.  ';
  await page.goto('?space=demo#/materials');
  await page.getByRole('button', { name: '자료 추가', exact: true }).click();
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('분할 작업면 합성 자료');
  await page.getByRole('textbox', { name: '강의 내용·필기', exact: true }).fill(original);
  await page.getByRole('button', { name: '자료 저장', exact: true }).click();
  await expect(page).toHaveURL(/#\/materials\/(?!new)[^/]+$/);
  const sourceURL = page.url();
  await openWorkspaceControl(page, '빠른 명령');
  const command = page.getByRole('dialog', { name: '지금 할 일 찾기' });
  await command.getByRole('textbox', { name: '명령 찾기' }).fill('메모 곁');
  await command.getByRole('button', { name: '메모 곁에 열기', exact: true }).click();
  const side = page.getByRole('region', { name: '곁 도구: 메모', exact: true });
  await side.getByRole('button', { name: '메모 추가', exact: true }).click();
  const editor = page.getByRole('dialog');
  await editor.getByText('글·연결·입력 설정', { exact: true }).click();
  await editor.getByRole('textbox', { name: '짧은 글', exact: true }).fill(memo);
  await editor.getByRole('button', { name: '닫기', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('source');
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('tool');
  await expect(side.getByRole('button', { name: /메모 1 열기/ })).toBeVisible();
  await openWorkspaceControl(page, '작업 구성');
  const shelf = page.getByRole('dialog', { name: '작업 구성 보관함' });
  await shelf.getByRole('textbox', { name: '작업 이름', exact: true }).fill('이어서 비교할 자료');
  await shelf.getByRole('button', { name: '현재 작업 보관', exact: true }).click();
  await expect(shelf.getByText('작업 구성을 보관했습니다.', { exact: true })).toBeVisible();
  await shelf.getByRole('button', { name: '작업 구성 보관함 닫기', exact: true }).click();
  await openWorkspaceControl(page, '빠른 명령');
  await command.getByRole('textbox', { name: '명령 찾기' }).fill('통계 열기');
  await command.getByRole('button', { name: '통계 열기', exact: true }).click();
  await expect(page).toHaveURL(/#\/statistics$/);
  await openWorkspaceControl(page, '작업 구성');
  await shelf.getByRole('button', { name: '이 작업 열기', exact: true }).click();
  await expect(page).toHaveURL(sourceURL);
  await expect(page.getByLabel('작업면 표시', { exact: true })).toHaveValue('tool');
  await page.reload();
  await expect(page.getByLabel('작업면 표시', { exact: true })).toHaveValue('tool');
  await expect(side.getByRole('button', { name: /메모 1 열기/ })).toBeVisible();
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('source');
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  const saved = JSON.parse(
    decodeStoredText((await page.evaluate(() => localStorage.getItem('study-space:demo:v1')))!)!,
  ).data;
  expect(saved.studyMaterials).toHaveLength(1);
  expect(saved.studyMaterials[0].sourceText).toBe(original);
  expect(saved.memos.some((row: { body: string }) => row.body === memo)).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('both');
  await page.locator('.study-workspace-toolbar').scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('workspace-source.png'), fullPage: false });
});

test('workspace storage failure is visible inside its modal and can be retried without losing configuration', async ({
  page,
}) => {
  await page.goto('?space=demo#/subjects');
  await openWorkspaceControl(page, '작업 구성');
  const modal = page.getByRole('dialog', { name: '작업 구성 보관함' });
  await modal.getByRole('textbox', { name: '작업 이름', exact: true }).fill('실패 후 보관');
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    Object.assign(window, {
      restoreWorkspaceStorage: () => {
        Storage.prototype.setItem = set;
      },
    });
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith(':study-workspace:v1')) throw new DOMException('full', 'QuotaExceededError');
      return set.call(this, key, value);
    };
  });
  await modal.getByRole('button', { name: '현재 작업 보관', exact: true }).click();
  await expect(modal.getByRole('alert')).toContainText('저장되지 않았습니다');
  await expect(modal.getByText('실패 후 보관', { exact: true })).toBeVisible();
  await page.evaluate(() =>
    (window as unknown as { restoreWorkspaceStorage: () => void }).restoreWorkspaceStorage(),
  );
  await modal.getByRole('button', { name: '저장 다시 시도', exact: true }).click();
  await expect(modal.getByRole('alert')).toHaveCount(0);
  await page.reload();
  await openWorkspaceControl(page, '작업 구성');
  await expect(modal.getByText('실패 후 보관', { exact: true })).toBeVisible();
  await modal.getByRole('button', { name: '구성 삭제', exact: true }).click();
  await modal.getByRole('button', { name: '구성 삭제 되돌리기', exact: true }).click();
  await expect(modal.getByText('실패 후 보관', { exact: true })).toBeVisible();
});

test('side code opens in the same material and preserves notes through hiding and reopen', async ({
  page,
}) => {
  await page.goto('?space=demo#/materials');
  await page.getByRole('button', { name: '곁 도구 펼치기', exact: true }).click();
  await page.getByLabel('곁에 놓을 도구', { exact: true }).selectOption('code');
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('tool');
  const side = page.getByRole('region', { name: '곁 도구: 코딩 연습', exact: true });
  await side.getByRole('button', { name: '예제 추가', exact: true }).click();
  await expect(page).toHaveURL(/#\/materials$/);
  await side
    .getByRole('textbox', { name: '내용·설명', exact: true })
    .fill('  곁에 남긴 코드 조건  ');
  await page.getByRole('button', { name: '곁 도구 접기', exact: true }).click();
  await page.getByRole('button', { name: '곁 도구 펼치기', exact: true }).click();
  await expect(side.getByRole('textbox', { name: '내용·설명', exact: true })).toHaveValue(
    '  곁에 남긴 코드 조건  ',
  );
  await page.reload();
  await expect(side.getByRole('textbox', { name: '내용·설명', exact: true })).toHaveValue(
    '  곁에 남긴 코드 조건  ',
  );
  await expect(page).toHaveURL(/#\/materials$/);
});

test('a stale tab preserves its working configuration when another tab saves a newer one', async ({
  page,
  context,
}) => {
  await page.goto('?space=demo#/subjects');
  await openWorkspaceControl(page, '작업 구성');
  const modal = page.getByRole('dialog', { name: '작업 구성 보관함' });
  await modal.getByRole('textbox', { name: '작업 이름', exact: true }).fill('첫 창의 작업');
  const other = await context.newPage();
  await other.goto(page.url());
  // A controlled second-tab fixture changes the same settings key after the first tab read it.
  await other.evaluate(() =>
    localStorage.setItem(
      'study-space:demo:study-workspace:v1',
      JSON.stringify({
        version: 1,
        layouts: {},
        saved: [
          {
            id: 'other-tab',
            name: '둘째 창의 작업',
            route: '/subjects',
            layout: { open: false, tool: 'memo', width: 52, pane: 'source' },
            savedAt: '2026-10-02T00:00:00Z',
          },
        ],
      }),
    ),
  );
  await other.close();
  await page.bringToFront();
  await modal.getByRole('button', { name: '현재 작업 보관', exact: true }).click();
  await expect(modal.getByRole('alert')).toContainText('다른 창에서');
  await expect(modal.getByText('첫 창의 작업', { exact: true })).toBeVisible();
  const saved = await page.evaluate(
    () => JSON.parse(localStorage.getItem('study-space:demo:study-workspace:v1')!).saved,
  );
  expect(saved).toHaveLength(1);
  expect(saved[0].name).toBe('둘째 창의 작업');
});
