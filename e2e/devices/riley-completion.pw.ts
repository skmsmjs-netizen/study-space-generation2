import { test, expect } from '@playwright/test';
import catalog from '../../src/content/riley/catalog.json' with { type: 'json' };
import plans from '../../src/content/riley/section-plans.json' with { type: 'json' };
import { existsSync } from 'node:fs';
const root = (process.env.PAGES_BASE || '/') + '?space=demo&math=riley#/math';
async function pick(page: any, n: string) {
  const back = page.getByRole('button', { name: '교재 목록으로', exact: true });
  if (await back.isVisible()) {
    await back.click();
    await expect(back).toHaveCount(0);
  }
  const search = page.getByLabel('교재에서 찾기', { exact: true });
  await expect(search).toBeVisible();
  // Let the existing return-focus frame complete before typing into the next list.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await search.fill(n);
  await expect(search).toHaveValue(n);
  const s = catalog.sections.find((x) => x.number === n)!;
  await page.getByRole('button', { name: `${n} · ${s.title}`, exact: true }).click();
}
test('all35 scenes render across profiles with actual notation and controls', async ({
  page,
}, info) => {
  test.setTimeout(180000);
  await page.goto(root);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const seen = new Set();
  for (const s of catalog.sections) {
    if (!s.scene || seen.has(s.scene)) continue;
    seen.add(s.scene);
    await pick(page, s.number);
    await expect(page.locator(`[data-section-plan="${s.id}"]`)).toBeVisible();
    await expect(page.locator('.riley-observatory .katex-error')).toHaveCount(0);
    await expect(page.locator('[data-observation-region="readout"]')).toBeVisible();
    expect(
      await page
        .locator('.riley-observatory')
        .evaluate((el) => el.scrollWidth > el.clientWidth + 2),
    ).toBe(false);
  }
  expect(seen.size).toBe(35);
  expect(errors).toEqual([]);
  await page.screenshot({ path: `work/riley-completion-20261003/${info.project.name}.png` });
});
test('section-specific relation condition step and notebook snapshot restore after reload', async ({
  page,
}) => {
  await page.goto(root);
  await pick(page, '26.19');
  await page.getByLabel('이 절의 적용 조건 확인 · 사용자가 남기는 상태').selectOption('위반');
  await page.getByRole('button', { name: '관계 다음 단계', exact: true }).click();
  await page
    .getByLabel('이 관찰의 탐색 메모 · 기기 보관')
    .fill('실제 공변 미분 조건·메모 보존 시험');
  await page.getByRole('button', { name: '현재 관찰을 새 보관본으로 남기기', exact: true }).click();
  await expect(
    page.getByText('현재 시연 공간의 메모에 보관했다. 서버 동기화와 구별한다.', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('이 절의 적용 조건 확인 · 사용자가 남기는 상태')).toHaveValue(
    '위반',
  );
  await expect(page.getByRole('heading', { name: '관계 읽기 · 2/3', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '관계·조건 확인 초기화' }).click();
  const select = page.getByLabel('복원할 관찰 보관본');
  const v = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(v!);
  await page.getByRole('button', { name: '선택한 관찰 상태 복원' }).click();
  await expect(page.getByLabel('이 절의 적용 조건 확인 · 사용자가 남기는 상태')).toHaveValue(
    '위반',
  );
  await expect(page.getByLabel('이 관찰의 탐색 메모 · 기기 보관')).toHaveValue(
    '실제 공변 미분 조건·메모 보존 시험',
  );
});
test('verified source original and scroll restoration reject a different pdf', async ({ page }) => {
  const original = process.env.RILEY_ORIGINAL_PDF;
  test.skip(
    !original || !existsSync(original),
    '원본 PDF를 공개 CI에 보내지 않는다. 기기 원문 검사는 로컬 증거와 구별한다.',
  );
  test.setTimeout(120000);
  await page.goto(root);
  await pick(page, '26.8');
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '수학교재 원문 읽기', exact: true });
  await dialog
    .getByLabel('원본 PDF 연결 · 이 기기에 보관', { exact: true })
    .setInputFiles(original!);
  await expect
    .poll(() => dialog.locator('canvas').evaluate((el: any) => el.height), { timeout: 60000 })
    .toBeGreaterThan(600);
  await expect(dialog.getByText('원문을 읽는 중이다.', { exact: true })).not.toBeVisible({
    timeout: 60000,
  });
  await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', '971', {
    timeout: 60000,
  });
  const scroll = dialog.getByLabel('원문 PDF · 가로 세로로 이동', { exact: true });
  for (
    let i = 0;
    i < 5 && (i === 0 || (await scroll.evaluate((el) => el.scrollHeight - el.clientHeight)) < 125);
    i++
  ) {
    const previous = await dialog.locator('canvas').getAttribute('data-rendered-zoom');
    await dialog.getByRole('button', { name: '원문 확대', exact: true }).click();
    await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', '971', {
      timeout: 60000,
    });
    await expect(dialog.locator('canvas')).not.toHaveAttribute('data-rendered-zoom', previous!);
  }
  await scroll.scrollIntoViewIfNeeded();
  await scroll.evaluate((el) => {
    el.scrollTop = 120;
    el.dispatchEvent(new Event('scroll'));
  });
  await expect.poll(() => scroll.evaluate((el) => el.scrollTop)).toBeGreaterThan(100);
  await page.waitForTimeout(250);
  await dialog.getByRole('button', { name: '읽던 질문으로 돌아가기' }).click();
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  await expect
    .poll(() => scroll.evaluate((el) => el.scrollTop), { timeout: 60000 })
    .toBeGreaterThan(100);
  // Same owner/book/version reuses the verified bytes in another section.
  await dialog.getByRole('button', { name: '읽던 질문으로 돌아가기' }).click();
  await pick(page, '23.2');
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  const other = catalog.sections.find((section) => section.number === '23.2')!;
  await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', String(other.pdf), {
    timeout: 60000,
  });
  await dialog.getByRole('button', { name: '읽던 질문으로 돌아가기' }).click();
  await pick(page, '26.8');
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', '971', {
    timeout: 60000,
  });
  await expect
    .poll(() => scroll.evaluate((el) => el.scrollTop), { timeout: 60000 })
    .toBeGreaterThan(100);
  await dialog.getByLabel('원본 PDF 연결 · 이 기기에 보관', { exact: true }).setInputFiles({
    name: 'wrong.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.7 wrong'),
  });
  await expect(
    dialog.getByText('확인한 교재와 다른 파일이다. 원문을 교체하지 않았다.'),
  ).toBeVisible();
  await expect
    .poll(() => dialog.locator('canvas').evaluate((el: any) => el.height))
    .toBeGreaterThan(600);
});
test('248 section plans all have distinct questions and correct actual source ids', async ({
  page,
}, info) => {
  test.skip(
    !info.project.name.includes('landscape') || !info.project.name.toLowerCase().includes('ipad'),
  );
  test.setTimeout(300000);
  expect(plans.length).toBe(248);
  await page.goto(root);
  for (const p of plans) {
    await pick(page, p.number);
    await expect(page.locator(`[data-section-plan="${p.id}"]`)).toContainText(p.question);
    await expect(
      page.getByText(
        `책 인쇄 ${p.source.printed}쪽 · PDF ${p.source.pdf}페이지부터 · §${p.number}`,
        { exact: true },
      ),
    ).toBeVisible();
  }
});

test('a queued list return preserves a newer search focus and typed query', async ({ page }) => {
  await page.goto(root);
  const [first, next] = catalog.sections.filter((section) => section.scene);
  await pick(page, first.number);
  await page.evaluate(() => {
    const original = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    const frames = new Map<number, FrameRequestCallback>();
    let id = 100000000;
    const state = window as unknown as { releaseRileyReturn: () => void };
    window.requestAnimationFrame = (callback) => {
      frames.set(++id, callback);
      return id;
    };
    window.cancelAnimationFrame = (frame) => {
      if (!frames.delete(frame)) cancel(frame);
    };
    state.releaseRileyReturn = () => {
      window.requestAnimationFrame = original;
      window.cancelAnimationFrame = cancel;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(performance.now()));
    };
  });
  await page.getByRole('button', { name: '교재 목록으로', exact: true }).click();
  const search = page.getByLabel('교재에서 찾기', { exact: true });
  await search.focus();
  await page.evaluate(() =>
    (window as unknown as { releaseRileyReturn: () => void }).releaseRileyReturn(),
  );
  await expect(search).toBeFocused();
  await search.fill(next.number);
  await expect(search).toHaveValue(next.number);
  await page.getByRole('button', { name: `${next.number} · ${next.title}`, exact: true }).click();
  await expect(page.locator(`[data-section-plan="${next.id}"]`)).toBeVisible();
});

test('a failed device file connection retries the captured file without selecting again', async ({
  page,
}) => {
  const original = process.env.RILEY_ORIGINAL_PDF;
  test.skip(
    !original || !existsSync(original),
    'Private original is checked locally, never sent to CI.',
  );
  test.setTimeout(120000);
  await page.goto(root);
  await pick(page, '26.8');
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '수학교재 원문 읽기', exact: true });
  await page.evaluate(() => {
    const saved = indexedDB.open.bind(indexedDB);
    (window as unknown as { restoreRileyFileStore: () => void }).restoreRileyFileStore = () => {
      indexedDB.open = saved;
    };
    indexedDB.open = () => {
      throw new DOMException('격리된 기기 보관 실패', 'QuotaExceededError');
    };
  });
  await dialog
    .getByLabel('원본 PDF 연결 · 이 기기에 보관', { exact: true })
    .setInputFiles(original!);
  const retry = dialog.getByRole('button', { name: '선택한 파일 연결 다시 시도', exact: true });
  await expect(retry).toBeEnabled({ timeout: 60000 });
  await expect(dialog.locator('canvas')).not.toHaveAttribute('data-rendered-page', '971');
  await page.evaluate(() =>
    (window as unknown as { restoreRileyFileStore: () => void }).restoreRileyFileStore(),
  );
  await retry.click();
  await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', '971', {
    timeout: 60000,
  });
  await expect(retry).toHaveCount(0);
  await dialog.getByRole('button', { name: '읽던 질문으로 돌아가기' }).click();
  await page.reload();
  await page.getByRole('button', { name: '원본 PDF 연결해 읽기 · 기기 보관', exact: true }).click();
  await expect(dialog.locator('canvas')).toHaveAttribute('data-rendered-page', '971', {
    timeout: 60000,
  });
});
