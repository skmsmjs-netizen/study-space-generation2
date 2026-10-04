import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
const appSource = readFileSync('src/App.tsx', 'utf8');
const available = (route: string) => new RegExp(`href: \\s*["']${route}["']`).test(appSource);
const original = '  조건·예외를 남기는 한국어 원문\n둘째 줄도 그대로 보관  ';
test('material manual input survives reload without granting AI to a general account', async ({
  page,
}) => {
  test.skip(!available('/materials'), '이 배포 버전에는 /materials 화면이 없습니다.');
  await page.goto('?space=demo#/materials/new');
  await page
    .getByLabel('자료 제목', { exact: true })
    .fill('긴 한국어 자료 이름 · 기기의 화면 크기와 무관하게 보존');
  await page.getByLabel('과목', { exact: true }).selectOption('demo-subject-math');
  await page.getByLabel('강의 내용·필기', { exact: true }).fill(original);
  await page.reload();
  await expect(page.getByLabel('강의 내용·필기', { exact: true })).toHaveValue(original);
  await expect(page.getByRole('button', { name: 'GPT 연결', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '자료 저장', exact: true }).tap();
  await expect(page).toHaveURL(/#\/materials\/(?!new)[^/]+$/);
  await page.reload();
  await expect(page.getByLabel('강의 내용·필기', { exact: true })).toHaveValue(original);
});

test('math inputs, graph and saved observations work after resizing and reopening', async ({
  page,
}, info) => {
  test.skip(!available('/math'), '이 배포 버전에는 /math 화면이 없습니다.');
  await page.goto('?space=demo#/math');
  await page.getByLabel('그래프 도구', { exact: true }).selectOption('plotly');
  await expect(page.locator('.js-plotly-plot')).toBeVisible({ timeout: 20000 });
  await page.getByLabel('관찰·메모 (선택)', { exact: true }).fill(original);
  await page.getByRole('button', { name: '수식과 메모 저장', exact: true }).tap();
  await page.reload();
  await expect(page.getByLabel('관찰·메모 (선택)', { exact: true })).toHaveValue(original);
  const initial = info.project.use.viewport!;
  await page.setViewportSize({ width: initial.height, height: initial.width });
  await expect(page.locator('.js-plotly-plot')).toBeVisible({ timeout: 20000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await expect(page.getByLabel('관찰·메모 (선택)', { exact: true })).toHaveValue(original);
});

test('memory questions, responses and criteria stay distinct across reload and save', async ({
  page,
}) => {
  await page.goto('?space=demo#/memory-test');
  await page.getByRole('button', { name: '암기 항목 등록', exact: true }).tap();
  await page.getByLabel('항목을 연결할 주제', { exact: true }).selectOption('demo-topic-function');
  await page.getByLabel('질문·개념', { exact: true }).fill('함수의 성립 조건을 적으세요.');
  await page.getByLabel('기준 답안·조건', { exact: true }).fill(original);
  await page.reload();
  await expect(page.getByLabel('기준 답안·조건', { exact: true })).toHaveValue(original);
  await page.getByRole('button', { name: '항목 저장', exact: true }).tap();
  await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).tap();
  await expect(page.getByRole('region', { name: '1번 기준 답안', exact: true })).toHaveCount(0);
  await page.getByLabel('내 답안', { exact: true }).fill('  내 응답 · 아직 모르는 조건은 미확인\n');
  await page.reload();
  await expect(page.getByLabel('내 답안', { exact: true })).toHaveValue(
    '  내 응답 · 아직 모르는 조건은 미확인\n',
  );
  await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).tap();
  await page.getByLabel('1번 비교 결과', { exact: true }).selectOption('partial');
  await page.getByRole('button', { name: '시험 결과 저장', exact: true }).tap();
  await page.reload();
  await expect(page.getByRole('region', { name: '1번 기준 답안', exact: true })).toContainText(
    original.trim(),
  );
});

test('board touch alternatives keep a long card and its note through reopening', async ({
  page,
}) => {
  await page.goto('?space=demo#/board');
  await page
    .getByRole('button', { name: /에 카드 추가$/ })
    .first()
    .tap();
  await page.getByLabel('할 일', { exact: true }).fill('오래 보관할 한국어 카드와 조건');
  await page.getByLabel('메모 (선택)', { exact: true }).fill(original);
  await page.reload();
  await expect(page.getByLabel('메모 (선택)', { exact: true })).toHaveValue(original);
  await page.getByRole('button', { name: '카드 저장', exact: true }).tap();
  await page.reload();
  const card = page.getByRole('article', {
    name: '카드 오래 보관할 한국어 카드와 조건',
    exact: true,
  });
  await expect(card).toBeVisible();
  await card.getByText('카드 이동·보관', { exact: true }).tap();
  await expect(
    page.getByLabel('오래 보관할 한국어 카드와 조건 옮길 열', { exact: true }),
  ).toBeEnabled();
  await card.getByRole('button', { name: '글 전체 보기', exact: true }).tap();
  await expect(page.getByLabel('메모 (선택)', { exact: true })).toHaveValue(original);
});

test('Canvas concept creation and graph list allow editing without dragging', async ({ page }) => {
  await page.goto('?space=demo#/canvas');
  await page.getByRole('button', { name: '개념 카드 추가', exact: true }).tap();
  await page.getByLabel('개념 이름', { exact: true }).fill('관계를 보존하는 모바일 개념');
  await page.getByText('설명 덧붙이기 · 선택', { exact: true }).tap();
  await page.getByLabel('개념 설명', { exact: true }).fill(original);
  await page.getByRole('button', { name: '카드 추가', exact: true }).tap();
  await page.goto('?space=demo#/graph');
  await page.getByLabel('관계에서 찾기', { exact: true }).fill('관계를 보존하는 모바일 개념');
  await page.getByText('항목 목록에서 선택하기', { exact: true }).tap();
  await page
    .getByRole('button', { name: '관계를 보존하는 모바일 개념', exact: false })
    .last()
    .tap();
  await expect(page.getByRole('complementary', { name: '선택한 항목', exact: true })).toContainText(
    '관계를 보존하는 모바일 개념',
  );
  await page.reload();
  await expect(page.getByLabel('관계에서 찾기', { exact: true })).toHaveValue(
    '관계를 보존하는 모바일 개념',
  );
});

test('practice pause, response draft and result survive touch use and reopening', async ({
  page,
}) => {
  await page.goto('?space=demo#/practice');
  await page.getByLabel('연습할 주제', { exact: true }).selectOption('demo-topic-function');
  await page.getByLabel('연습 시간', { exact: true }).selectOption('0');
  await page.getByRole('button', { name: '연습 시작', exact: true }).tap();
  await page.getByText('앱에 풀이 쓰기 · 선택', { exact: true }).tap();
  await page.getByLabel('풀이·답안', { exact: true }).fill(original);
  await page.getByRole('button', { name: '잠시 멈추기', exact: true }).tap();
  await page.reload();
  await page.getByText('앱에 풀이 쓰기 · 선택', { exact: true }).tap();
  await expect(page.getByLabel('풀이·답안', { exact: true })).toHaveValue(original);
  await page.getByRole('button', { name: '이어서 풀기', exact: true }).tap();
  await page.getByRole('button', { name: '연습 마치기', exact: true }).tap();
  await page.getByLabel('막힌 곳', { exact: true }).fill('어떤 조건인지 아직 확인하지 못함');
  await page.getByRole('button', { name: '연습 기록 남기기', exact: true }).tap();
  await page.reload();
  await expect(page.getByText('지난 연습 1개', { exact: true })).toBeVisible();
});

test('subjects, search and record navigation keep a new name and context on a narrow screen', async ({
  page,
}) => {
  await page.goto('?space=demo#/subjects');
  await page.getByRole('button', { name: '과목 추가', exact: true }).tap();
  const dialog = page.getByRole('dialog', { name: '과목 추가', exact: true });
  await dialog.getByLabel('이름', { exact: true }).fill('조건과 예외를 보관하는 새 과목');
  await page.reload();
  await page.getByRole('button', { name: '과목 추가', exact: true }).tap();
  await expect(dialog.getByLabel('이름', { exact: true })).toHaveValue(
    '조건과 예외를 보관하는 새 과목',
  );
  await dialog.getByRole('button', { name: '추가하기', exact: true }).tap();
  await page.goto('?space=demo#/search');
  await page
    .getByLabel('과목·목차·기록 검색', { exact: true })
    .fill('조건과 예외를 보관하는 새 과목');
  await expect(
    page.getByRole('link', {
      name: '조건과 예외를 보관하는 새 과목',
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole('link', { name: '조건과 예외를 보관하는 새 과목', exact: false }).tap();
  await expect(page.locator('main h1')).toContainText('조건과 예외를 보관하는 새 과목');
});

test('memo text, finger option and export remain reachable after reload', async ({ page }) => {
  await page.goto('?space=demo#/memos');
  await page.getByRole('button', { name: '메모 추가', exact: true }).tap();
  await page.getByText('글·연결·입력 설정', { exact: true }).tap();
  await page.getByLabel('짧은 글', { exact: true }).fill(original);
  await page.getByText('필기 설정', { exact: true }).tap();
  await page.getByLabel('손가락으로도 그리기', { exact: true }).check();
  await page.getByRole('img', { name: '메모 스케치 영역', exact: true }).tap();
  await expect(
    page.getByRole('img', { name: '메모 스케치 영역', exact: true }).locator('path'),
  ).toHaveCount(2);
  await page.getByRole('button', { name: '지금 저장', exact: true }).tap();
  await page.getByRole('button', { name: '닫기', exact: true }).tap();
  await page.reload();
  await page.getByRole('button', { name: /메모 1 열기/ }).tap();
  await expect(page.getByLabel('짧은 글', { exact: true })).toHaveValue(original);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '메모 파일로 보관', exact: true }).tap();
  expect((await download).suggestedFilename()).toMatch(/\.json$/);
});

test('recall question registration, answer display and undo are touch accessible', async ({
  page,
}) => {
  await page.goto('?space=demo#/recall');
  await page.getByText('질문 카드 만들기·수정', { exact: true }).tap();
  await page.getByLabel('카드의 공부 주제', { exact: true }).selectOption('demo-topic-function');
  await page.getByLabel('질문 (앞면)', { exact: true }).fill('모바일에서 남긴 첫 질문');
  await page.getByLabel('참고 답변 (뒷면)', { exact: true }).fill(original);
  await page.getByRole('button', { name: '질문 카드 등록', exact: true }).tap();
  await page.reload();
  await page.getByText('질문 카드 만들기·수정', { exact: true }).tap();
  await page.getByText(/등록한 질문 \d+개/, { exact: true }).tap();
  await page.getByLabel('등록한 질문 찾기', { exact: true }).fill('모바일에서 남긴 첫 질문');
  const registered = page
    .locator('.recall-card-settings article')
    .filter({ hasText: '모바일에서 남긴 첫 질문' });
  await registered.getByRole('button', { name: '질문 수정', exact: true }).tap();
  await expect(page.getByLabel('참고 답변 (뒷면)', { exact: true })).toHaveValue(original);
  // The new card does not replace the learner's selected topic or their queue.
  await page.getByRole('button', { name: '설명 확인하고 평가', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '참고 설명', exact: true })).toBeVisible();
  const currentTopic = await page.locator('.recall-topic-heading h2').textContent();
  await page.getByRole('button', { name: /^쉬움/ }).tap();
  await page.getByRole('button', { name: '마지막 평가 되돌리기', exact: true }).tap();
  await expect(page.locator('.recall-topic-heading h2')).toHaveText(currentTopic!);
  await expect(page.getByLabel('참고 답변 (뒷면)', { exact: true })).toHaveValue(original);
});
