import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import catalog from '../../src/content/riley/catalog.json' with { type: 'json' };

async function book(page: Page) {
  await page.goto('/?space=demo&math=riley#/math');
  await expect(page.getByRole('heading', { name: '수학교재 관찰', exact: true })).toBeVisible();
}
async function select(page: Page, label: string) {
  const back = page.getByRole('button', { name: '교재 목록으로', exact: true });
  if (await back.isVisible()) await back.click();
  await page.getByLabel('교재에서 찾기', { exact: true }).fill(label.split(' · ')[0]);
  await page.getByRole('button', { name: label, exact: true }).click();
}
test('source-backed values, pending input and return survive reload', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await book(page);
  await select(page, '4.2 · Summation of series');
  const ratio = page.getByLabel('공비 r', { exact: true });
  await ratio.fill('1');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(page.getByLabel('무한합 조건 |r|<1 위반 · 유한 부분합은 계산 가능')).toBeVisible();
  await page
    .getByLabel('이 관찰의 탐색 메모 · 기기 보관')
    .fill('검증용 메모: 유한합과 무한합 구별');
  await page.getByRole('button', { name: '다음 단계', exact: true }).click();
  await page.getByRole('button', { name: '＋ 확대', exact: true }).click();
  await ratio.fill('0.55-');
  await page.reload();
  await expect(page.getByLabel('공비 r', { exact: true })).toHaveValue('0.55-');
  await expect(page.getByText('현재 적용값: 1 · 입력은 확인 전')).toBeVisible();
  await expect(page.getByLabel('이 관찰의 탐색 메모 · 기기 보관')).toHaveValue(
    '검증용 메모: 유한합과 무한합 구별',
  );
  await expect(page.getByRole('heading', { name: '현재 관계 읽기 · 2/3' })).toBeVisible();
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(page.getByLabel('공비 r', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('S_N = 12', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '보기 맞춤', exact: true }).click();
  await expect(page.getByLabel('공비 r', { exact: true })).toHaveValue('0.55-');
  await page.getByRole('button', { name: '현재 조건·단계 초기화', exact: true }).click();
  await expect(page.getByLabel('공비 r', { exact: true })).toHaveValue('0.55');
  await expect(page.getByLabel('이 관찰의 탐색 메모 · 기기 보관')).toHaveValue(
    '검증용 메모: 유한합과 무한합 구별',
  );
  await page.locator('.riley-observatory').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: path.join(
      process.env.DEVICE_RUN_DIR ?? 'work/riley-completion-20261003',
      'screens',
      info.project.name + '-series.png',
    ),
    fullPage: false,
  });
  const typography = await page
    .locator('[data-observation-region="question"] p.prose')
    .first()
    .evaluate((el) => {
      const s = getComputedStyle(el);
      return { family: s.fontFamily, weight: s.fontWeight, size: s.fontSize, align: s.textAlign };
    });
  expect(typography.family).toContain('ManSeekSong Paper');
  expect(typography.weight).toBe('700');
  expect(typography.align).toBe('justify');
  await page.getByRole('button', { name: '교재 목록으로', exact: true }).click();
  await expect(
    page.getByRole('button', { name: '4.2 · Summation of series', exact: true }),
  ).toBeFocused();
  await page.getByLabel('교재에서 찾기', { exact: true }).fill('찾을 수 없는 제목 검증용');
  await expect(
    page.getByText('조건에 맞는 절이 없습니다. 원문 목록은 유지했습니다.'),
  ).toBeVisible();
  await page.getByRole('button', { name: '찾기 조건 해제', exact: true }).click();
  await expect(page.getByText('248개 절', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('structural observation, source page and full-view return work', async ({ page }, info) => {
  await book(page);
  await select(page, '26.8 · The tensors δij and ϵijk');
  await expect(page.getByLabel('ϵijk = 1', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '＋ 확대', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '크게 보기', exact: true }).click();
  const large = page.getByRole('dialog', { name: 'δ와 ϵ의 성분' });
  await expect(large).toBeVisible();
  await large.getByLabel('첨자 i', { exact: true }).fill('2');
  await large.getByRole('button', { name: '값 적용', exact: true }).nth(0).click();
  await large.getByLabel('첨자 j', { exact: true }).fill('1');
  await large.getByRole('button', { name: '값 적용', exact: true }).nth(1).click();
  await expect(large.getByLabel('ϵijk = -1', { exact: true })).toBeVisible();
  await large.getByRole('button', { name: '원문 위치·발췌 읽기', exact: true }).click();
  const source = page.getByRole('dialog', { name: '원문 · §26.8' });
  await expect(source).toBeVisible();
  const image = source.getByRole('img', { name: '원본 교재 PDF 971페이지' });
  await expect
    .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth), { timeout: 45000 })
    .toBeGreaterThan(0);
  await expect(image).toBeVisible();
  await source.getByRole('button', { name: '원문 확대', exact: true }).click();
  await source.getByRole('button', { name: '다음 쪽', exact: true }).click();
  await expect(source.getByText('현재 원문 · PDF 972페이지 / 책 인쇄 942쪽')).toBeVisible();
  await source.getByRole('button', { name: /닫기$/ }).click();
  await expect(
    large.getByRole('button', { name: '원문 위치·발췌 읽기', exact: true }),
  ).toBeFocused();
  await large.getByRole('button', { name: /닫기$/ }).click();
  await expect(large).not.toBeVisible();
  await expect(
    page.locator('.riley-observatory').getByLabel('ϵijk = -1', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: '원문 위치·발췌 읽기', exact: true }).click();
  await expect(source.getByText('현재 원문 · PDF 972페이지 / 책 인쇄 942쪽')).toBeVisible();
  await source.getByRole('button', { name: /닫기$/ }).click();
  await page.screenshot({
    path: path.join(
      process.env.DEVICE_RUN_DIR ?? 'work/riley-completion-20261003',
      'screens',
      info.project.name + '-tensor.png',
    ),
    fullPage: false,
  });
  const overflow = await page
    .locator('.riley-observatory')
    .evaluate((el) => el.scrollWidth > el.clientWidth + 2);
  expect(overflow).toBe(false);
});
test('rendered formula gallery and non-destructive storage failure', async ({ page }) => {
  await book(page);
  for (const label of [
    '3.3 · Polar representation of complex numbers',
    '7.6 · Multiplication of vectors',
    '8.4 · Basic matrix algebra',
    '8.13 · Eigenvectors and eigenvalues',
    '12.4 · Discontinuous functions',
    '15.1 · Linear equations with constant coefficients',
    '20.4 · The wave equation',
    '20.5 · The diffusion equation',
    '22.1 · The Euler–Lagrange equation',
    '27.1 · Algebraic and transcendental equations',
    '28.2 · Finite groups',
    '30.2 · Probability',
    '30.8 · Important discrete distributions',
    '31.2 · Sample statistics',
    '31.6 · The method of least squares',
  ]) {
    await select(page, label);
    await expect(page.locator('.riley-observatory .katex')).not.toHaveCount(0);
    await expect(page.locator('.riley-observatory .math-render-error')).toHaveCount(0);
  }
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Object.assign(window, { __rileySetItem: original });
    Storage.prototype.setItem = function (k, v) {
      if (k.includes(':riley-observations:view:')) throw Error('보관 실패 검증');
      original.call(this, k, v);
    };
  });
  await page.getByLabel('이 관찰의 탐색 메모 · 기기 보관').fill('실패 중에도 남길 메모');
  await expect(page.getByRole('button', { name: '다시 보관', exact: true })).toBeVisible();
  await expect(page.getByLabel('이 관찰의 탐색 메모 · 기기 보관')).toHaveValue(
    '실패 중에도 남길 메모',
  );
  await page.evaluate(() => {
    Storage.prototype.setItem = (
      window as unknown as { __rileySetItem: typeof Storage.prototype.setItem }
    ).__rileySetItem;
  });
  await page.getByRole('button', { name: '다시 보관', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('이 관찰의 탐색 메모 · 기기 보관')).toHaveValue(
    '실패 중에도 남길 메모',
  );
});

test('manual viewport, probability boundary and complete pending index', async ({ page }) => {
  await book(page);
  await select(page, '4.2 · Summation of series');
  const plot = page.locator('.riley-plot svg');
  const originalRange = await page.locator('.riley-plot figcaption p.muted').textContent();
  await plot.focus();
  await plot.press('ArrowRight');
  await expect(page.locator('.riley-plot figcaption p.muted')).not.toHaveText(originalRange!);
  const before = await page.locator('.riley-plot figcaption p.muted').textContent();
  const ratio = page.getByLabel('공비 r', { exact: true });
  await ratio.fill('0.75');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(page.locator('.riley-plot figcaption p.muted')).toHaveText(before!);
  await page.reload();
  await expect(page.locator('.riley-plot figcaption p.muted')).toHaveText(before!);
  await select(page, '30.2 · Probability');
  await page.getByLabel('Pr(A)', { exact: true }).fill('0');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(page.getByLabel('Pr(B|A)', { exact: true })).toBeDisabled();
  await expect(page.getByLabel('Pr(A|B) = 0', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '교재 목록으로', exact: true }).click();
  await page.getByText('세부 제목·식 번호의 확인 대기 목록', { exact: true }).click();
  const pending = page.getByRole('region', { name: '확인 대기 항목 목록' });
  await expect(pending.getByText('351개 항목 · 1번째 목록')).toBeVisible();
  await pending.getByLabel('확인 대기 항목 유형').selectOption('equationMentions');
  await expect(pending.getByText('1982개 항목 · 1번째 목록')).toBeVisible();
  await pending.getByRole('button', { name: '다음 목록', exact: true }).click();
  await page.reload();
  await page.getByText('세부 제목·식 번호의 확인 대기 목록', { exact: true }).click();
  await expect(page.getByText('1982개 항목 · 2번째 목록')).toBeVisible();
});

test('unreadable stored original stays protected in the actual screen', async ({ page }) => {
  await book(page);
  await select(page, '4.2 · Summation of series');
  const key = await page.evaluate(() =>
    Object.keys(localStorage).find((k) => k.endsWith(':riley-observations:view:v1'))!,
  );
  await page.evaluate((k) => localStorage.setItem(k, 'broken original exact text'), key);
  await page.reload();
  await expect(
    page.getByRole('button', { name: '보관된 보기 다시 읽기', exact: true }),
  ).toBeVisible();
  await page.getByLabel('교재에서 찾기', { exact: true }).fill('4.2');
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    'broken original exact text',
  );
  await page.getByRole('button', { name: '보관된 보기 다시 읽기', exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(
    'broken original exact text',
  );
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '현재 보기 파일로 보관', exact: true }).click();
  expect((await download).suggestedFilename().normalize('NFC')).toBe('수학교재-관찰-기기보기.json');
});

test('subject caller and dragged graph return to their actual context', async ({ page }) => {
  await page.goto('/?space=demo#/subjects');
  const entry = page.getByRole('link', {
    name: '수학교재 관찰 · Mathematical Methods for Physics and Engineering',
    exact: true,
  });
  await entry.click();
  await expect(page.getByRole('heading', { name: '수학교재 관찰', exact: true })).toBeVisible();
  await select(page, '4.2 · Summation of series');
  const plot = page.locator('.riley-plot svg');
  await plot.scrollIntoViewIfNeeded();
  const before = await page.locator('.riley-plot figcaption p.muted').textContent();
  const bounds = await plot.boundingBox();
  await page.mouse.move(bounds!.x + bounds!.width * 0.5, bounds!.y + bounds!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width * 0.65, bounds!.y + bounds!.height * 0.5, {
    steps: 5,
  });
  await page.mouse.up();
  await expect(page.locator('.riley-plot figcaption p.muted')).not.toHaveText(before!);
  await page.getByRole('link', { name: '들어온 과목 목록으로', exact: true }).click();
  await expect(entry).toBeFocused();
});

test('every main section opens with its own ID and source location', async ({ page }, info) => {
  test.skip(
    info.project.name !== 'iPad-Pro-13-landscape',
    'Whole content listing is independent of screen geometry; representative behavior is tested in all five.',
  );
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await book(page);
  await expect(page.locator('.riley-list >li')).toHaveCount(248);
  for (const s of catalog.sections) {
    await select(page, `${s.number} · ${s.title}`);
    await expect(
      page.getByText(`책 인쇄 ${s.printed}쪽 · PDF ${s.pdf}페이지부터 · §${s.number}`, {
        exact: true,
      }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('numeric extremes and browser gestures retain valid ranges', async ({ page }) => {
  await book(page);
  await select(page, '4.2 · Summation of series');
  await page.getByLabel('공비 r', { exact: true }).fill('1.5');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await page.getByLabel('항 수 N', { exact: true }).fill('100');
  await page.getByRole('button', { name: '값 적용', exact: true }).nth(1).click();
  await page.getByRole('button', { name: '＋ 확대', exact: true }).click();
  await expect(page.getByRole('button', { name: '다시 보관', exact: true })).toHaveCount(0);
  const overflow = await page
    .locator('.riley-observatory')
    .evaluate((el) => el.scrollWidth > el.clientWidth + 2);
  expect(overflow).toBe(false);
  await select(page, '27.1 · Algebraic and transcendental equations');
  const initial = page.getByLabel('시작점 x₀', { exact: true });
  await initial.fill('1e-400');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(initial).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('현재 x = 1.41', { exact: true })).toBeVisible();
  await initial.fill('1e-323');
  await page.getByRole('button', { name: '값 적용', exact: true }).first().click();
  await expect(page.getByText('이 사례의 조건: 확인 전', { exact: true })).toBeVisible();
  await select(page, '4.2 · Summation of series');
  const range = page.locator('.riley-plot figcaption p.muted');
  const before = await range.textContent();
  await page.locator('.riley-plot svg').evaluate((el) => {
    const b = el.getBoundingClientRect();
    for (const [type, scale] of [
      ['gesturestart', 1],
      ['gesturechange', 1.2],
      ['gestureend', 1.2],
    ] as const) {
      const event = new Event(type, { cancelable: true });
      Object.assign(event, { clientX: b.x + b.width * 0.5, clientY: b.y + b.height * 0.5, scale });
      el.dispatchEvent(event);
    }
  });
  await expect(range).not.toHaveText(before!);
});
