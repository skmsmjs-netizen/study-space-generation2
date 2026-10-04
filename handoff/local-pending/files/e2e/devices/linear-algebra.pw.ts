import { test, expect } from '@playwright/test';
import path from 'node:path';
const out = 'work/linear-algebra-observations-20261003';
test('선형대수 · 읽기·경계·오입력·시야·저장·재접속·소거·정사영·원문·복귀', async ({
  page,
}, info) => {
  await page.goto('/?space=demo#/math');
  await page.getByRole('combobox', { name: '탐색할 내용', exact: true }).selectOption('linear');
  const concept = page.getByRole('combobox', { name: '살펴볼 개념', exact: true });
  await expect(concept).toBeVisible();
  await concept.selectOption('0:D');
  const t = page.getByRole('textbox', { name: '배율 t · 정확한 값', exact: true });
  await t.fill('0');
  await t.press('Enter');
  await expect(page.getByText('특이 · 이 예제의 rank=1', { exact: true })).toBeVisible();
  await t.fill('1/');
  await t.press('Enter');
  await expect(page.getByRole('alert').filter({ hasText: '입력을 유지' })).toBeVisible();
  await expect(t).toHaveValue('1/');
  await expect(page.getByText('특이 · 이 예제의 rank=1', { exact: true })).toBeVisible();
  await page
    .getByRole('textbox', { name: '관찰 메모', exact: true })
    .fill('조건 t=0과 미확정 입력을 구별한다.\n긴 한글 · α β γ · 원문 복귀 확인.');
  await page.getByRole('button', { name: '보기 초기화', exact: true }).click();
  await expect(t).toHaveValue('1/');
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === 'study-space:demo:v1')
        throw new DOMException('사본 저장 실패 모사', 'QuotaExceededError');
      return original.call(this, k, v);
    };
    (window as unknown as { restoreLinearSave: () => void }).restoreLinearSave = () => {
      Storage.prototype.setItem = original;
    };
  });
  await page.getByRole('button', { name: '관찰 사본과 메모 저장', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: '사본 저장 실패 모사' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: '관찰 메모', exact: true })).toHaveValue(
    /긴 한글/,
  );
  await page.evaluate(() =>
    (window as unknown as { restoreLinearSave: () => void }).restoreLinearSave(),
  );
  await page.getByRole('button', { name: '관찰 사본 저장 다시 시도', exact: true }).click();
  await expect(
    page.getByRole('alert').filter({ hasText: '사본 저장 실패 모사' }),
  ).not.toBeVisible();
  await expect(
    page.getByText('이 기기에 관찰 사본과 메모를 저장했다.', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('combobox', { name: '탐색할 내용', exact: true })).toHaveValue(
    'linear',
  );
  await expect(t).toHaveValue('1/');
  await expect(page.getByRole('textbox', { name: '관찰 메모', exact: true })).toHaveValue(
    /긴 한글/,
  );
  await expect(page.getByText('특이 · 이 예제의 rank=1', { exact: true })).toBeVisible();
  await t.fill('2');
  await t.press('Enter');
  await page.getByRole('button', { name: '크게 보기', exact: true }).click();
  const full = page.getByRole('dialog', { name: '선형대수 · 전체 관찰', exact: true });
  await expect(full).toBeVisible();
  await expect(full.getByRole('textbox', { name: '배율 t · 정확한 값', exact: true })).toHaveValue(
    '2',
  );
  await page.screenshot({ path: path.resolve(out, `${info.project.name}-determinant.png`) });
  await full.getByRole('button', { name: '선형대수 · 전체 관찰 닫기', exact: true }).click();
  await concept.selectOption('0:E');
  const matrix = page.getByRole('textbox', {
    name: '확대행렬 [A | b] · 마지막 열이 b',
    exact: true,
  });
  await matrix.fill('0 2 4\n1 3 7');
  await page.getByRole('button', { name: '행렬 적용', exact: true }).click();
  await page.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect(page.getByRole('heading', { name: /↔/ })).toBeVisible();
  await matrix.fill('1,,2');
  await page.getByRole('button', { name: '행렬 적용', exact: true }).click();
  await expect(matrix).toHaveValue('1,,2');
  await page.screenshot({ path: path.resolve(out, `${info.project.name}-elimination.png`) });
  await concept.selectOption('1:O');
  await expect(
    page.getByRole('heading', {
      name: '수직 조건과 정사영은 어떤 잔차를 만드는가?',
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({ path: path.resolve(out, `${info.project.name}-projection.png`) });
  await page.getByText('원자료와 적용 범위', { exact: true }).click();
  await page.getByRole('button', { name: '원문 펼치기', exact: true }).first().click();
  const source = page.getByRole('dialog', { name: '선형대수 원문 읽기', exact: true });
  await expect(
    source.getByRole('region', { name: '원문 PDF · 가로 세로로 이동', exact: true }),
  ).toBeVisible();
  await expect(source.locator('canvas')).toHaveAttribute('width', /\d+/);
  const originalWidth = Number(await source.locator('canvas').getAttribute('width'));
  await source.getByRole('button', { name: '원문 확대', exact: true }).click();
  await source.getByRole('button', { name: '원문 확대', exact: true }).click();
  await expect
    .poll(async () => Number(await source.locator('canvas').getAttribute('width')))
    .toBeGreaterThan(originalWidth * 1.5);
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).not.toBeVisible();
  const paper = source.getByRole('region', { name: '원문 PDF · 가로 세로로 이동', exact: true });
  await paper.evaluate((el) => {
    el.scrollTop = 180;
  });
  await expect.poll(() => paper.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  const scroll = await paper.evaluate((el) => el.scrollTop);
  await source.getByRole('button', { name: '읽던 질문으로 돌아가기', exact: true }).click();
  await page.getByRole('button', { name: '원문 펼치기', exact: true }).first().click();
  await expect.poll(() => paper.evaluate((el) => el.scrollTop)).toBeGreaterThan(scroll - 2);
  await page.keyboard.press('Escape');
  await expect(source).not.toBeVisible();
  await expect(concept).toHaveValue('1:O');
  await page.getByText('개념 연결도 펼치기', { exact: true }).click();
  await expect(
    page.getByRole('region', { name: '개념 연결도 · 방향키로 이동', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.react-flow__edge')).toHaveCount(18);
  await page.getByRole('button', { name: '기본 글자 크기로 보기', exact: true }).click();
  const layout = await page.locator('.linear-workbench').evaluate((el) => {
    const a = el.children[0].getBoundingClientRect(),
      b = el.children[1].getBoundingClientRect();
    return {
      left: a.left,
      top: a.top,
      right: b.left,
      btop: b.top,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  expect(layout.overflow).toBe(false);
  if (info.project.name.includes('landscape') && info.project.name.includes('iPad'))
    expect(layout.right).toBeGreaterThan(layout.left);
  else expect(layout.btop).toBeGreaterThan(layout.top);
  await page.getByRole('button', { name: '교재 목록 열기', exact: true }).click();
  await page.getByRole('button', { name: '선형대수 교재 · 개념과 관찰', exact: true }).click();
  const reader = page.getByRole('dialog', { name: '선형대수 교재', exact: true });
  await reader.getByRole('button', { name: '이 개념 관찰을 곁에 열기', exact: true }).click();
  const small = page.getByRole('dialog', { name: '선형대수 · 작은 관찰', exact: true });
  await expect(small.getByRole('textbox', { name: '관찰 메모', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(small).not.toBeVisible();
  await expect(
    reader.getByRole('button', { name: '이 개념 관찰을 곁에 열기', exact: true }),
  ).toBeFocused();
  await reader.getByRole('button', { name: '전체 관찰 도구로 이동', exact: true }).click();
  await page.getByRole('button', { name: '원자료 읽기로 돌아가기', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '선형대수 교재', exact: true })).toBeVisible();
});

test('선형대수 · 19개 관찰틀·정적 읽기·수식 실제 렌더·곡면·연결도 기본 가독성', async ({
  page,
}, info) => {
  // Preserve all 19 visits under the slower Linux tablet renderer.
  test.setTimeout(180000);
  await page.goto('/?space=demo#/math');
  await page.getByRole('combobox', { name: '탐색할 내용', exact: true }).selectOption('linear');
  const concept = page.getByRole('combobox', { name: '살펴볼 개념', exact: true });
  const scope = page.getByRole('region', { name: '선형대수 교재와 관찰', exact: true });
  const ids = [
    '0:D',
    '0:T',
    '0:E',
    '1:R',
    '1:O',
    '3:QR',
    '3:LS',
    '0:M',
    '2:EV',
    '4:QUAD',
    '1:X',
    '6:LU',
    '6:POW',
    '6:SVD',
    '2:DS',
    '2:MK',
    '0:L',
    '3:FOUR',
    '2:C',
  ];
  for (const id of ids) {
    await concept.selectOption(id);
    await expect(scope.locator('[data-observation-region="question"] h2')).toHaveText(/\?/);
    await expect(scope.locator('[data-observation-region="visual"] .katex').first()).toBeVisible();
    await expect(scope.locator('.katex-error')).toHaveCount(0);
    if (
      [
        '0:D',
        '0:T',
        '1:O',
        '2:EV',
        '4:QUAD',
        '1:X',
        '6:POW',
        '2:DS',
        '2:MK',
        '3:FOUR',
        '2:C',
      ].includes(id)
    )
      await expect(
        scope.getByRole('button', { name: '＋ 확대', exact: true }).first(),
      ).toBeEnabled();
    await expect(scope.getByRole('alert')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    if (id === '4:QUAD') {
      await expect(scope.locator('.math-plot')).toHaveCount(1);
      await expect(
        scope.getByRole('button', { name: '＋ 확대', exact: true }).first(),
      ).toBeEnabled();
      await page.screenshot({ path: path.resolve(out, `${info.project.name}-quadratic.png`) });
    }
  }
  await concept.selectOption('0:P');
  await expect(scope.locator('.linear-static-reading')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '값과 조건 조절', exact: true }),
  ).not.toBeVisible();
  await expect(scope.locator('[data-observation-region="visual"] .katex')).toHaveCount(1);
  await page.getByText('개념 연결도 펼치기', { exact: true }).click();
  await expect
    .poll(() => scope.locator('.linear-map-viewport .react-flow__viewport').evaluate((el) => el.getAttribute('style')))
    .toContain('scale(1)');
  await page.getByRole('button', { name: '현재 개념으로 이동', exact: true }).click();
  await expect(scope.locator('.linear-map-module[data-selected="true"]')).toBeVisible();
  await page.screenshot({ path: path.resolve(out, `${info.project.name}-concept-map.png`) });
});

test('선형대수 · 잘못된 PDF 연결에서 원문·쪽·수식 유지', async ({ page }) => {
  await page.goto('/?space=demo#/math');
  await page.getByRole('combobox', { name: '탐색할 내용', exact: true }).selectOption('linear');
  await page.getByText('원자료와 적용 범위', { exact: true }).click();
  await page.getByRole('button', { name: '원문 펼치기', exact: true }).first().click();
  const source = page.getByRole('dialog', { name: '선형대수 원문 읽기', exact: true });
  await expect(source.locator('canvas')).toHaveAttribute('width', /\d+/);
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).not.toBeVisible();
  const originalPage = await source
    .getByRole('textbox', { name: 'PDF 페이지', exact: true })
    .inputValue();
  await source
    .getByLabel('원본 PDF 연결 · 이 기기에 보관', { exact: true })
    .setInputFiles({
      name: 'wrong.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.0\nwrong source'),
    });
  await expect(
    source.getByRole('alert').filter({ hasText: '확인한 교재와 다른 파일' }),
  ).toBeVisible();
  await expect(source.getByRole('textbox', { name: 'PDF 페이지', exact: true })).toHaveValue(
    originalPage,
  );
  await source.getByRole('button', { name: '원문 확대', exact: true }).click();
  await expect(source.getByText('원문을 읽는 중이다.', { exact: true })).not.toBeVisible();
  await expect(
    source.getByRole('alert').filter({ hasText: '확인한 교재와 다른 파일' }),
  ).toBeVisible();
  await expect(source.locator('canvas')).toHaveAttribute('width', /\d+/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('region', { name: '관찰식과 현재 조건', exact: true })).toBeVisible();
});
