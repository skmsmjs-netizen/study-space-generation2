import { test, expect } from '@playwright/test';

test('brand continuity, exact next action, support draft and opt-in survive reentry', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('?space=demo#/node/demo-topic-function');
  await expect(page.locator('main h1')).toHaveText('함수는 어떤 관계일까?');
  await page.getByRole('button', { name: '다음에 펼칠 곳 남기기', exact: true }).click();
  const next =
    '  다음에는 사용 조건부터 설명하기\n일부만 해도 기록 남기기\n' + '긴 한국어 원문 '.repeat(50);
  await page.getByLabel('다음에 할 일', { exact: true }).fill(next);
  await page.getByRole('button', { name: '건너뛰기', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: '다음에 펼칠 곳 남기기', exact: true }).click();
  await expect(page.getByLabel('다음에 할 일', { exact: true })).toHaveValue(next);
  await page.getByRole('button', { name: '다음 행동 남기기', exact: true }).click();
  await page.goto('?space=demo#/');
  await expect(page.locator('.brand-next')).toHaveText(next, { useInnerText: false });
  await page.reload();
  expect(await page.locator('.brand-next').textContent()).toBe(next);
  await page.getByRole('button', { name: '다음 행동 표시 해제', exact: true }).click();
  await page.getByText('이전에 남긴 다음 행동', { exact: true }).click();
  expect(await page.locator('.brand-next').textContent()).toBe(next);
  await page.getByRole('button', { name: '이 다음 행동 다시 표시', exact: true }).click();
  expect(await page.locator('.brand-next').first().textContent()).toBe(next);
  await page.getByRole('button', { name: '이어가기', exact: true }).click();
  await expect(page.locator('main h1')).toHaveText('함수는 어떤 관계일까?');

  await page.goto('?space=demo#/subscription');
  await expect(
    page.getByRole('heading', { name: '저장한 곳을 먼저 확인하세요', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: '이용 정보', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '현재 이용 정보', exact: true })).toHaveCount(0);
  await page.goto('?space=demo#/help');
  const inquiry = '  확인용 문의\n원문·개인 정보 자동 첨부 없음\n';
  await page.getByLabel('문제 메모', { exact: true }).fill(inquiry);
  await page.getByRole('button', { name: '문제 메모 보관', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('외부 접수나 전송은 하지 않았습니다');
  await page.reload();
  await expect(page.getByLabel('문제 메모', { exact: true })).toHaveValue(inquiry);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '메모 파일 내려받기', exact: true }).click();
  expect((await download).suggestedFilename()).toMatch(/^manseeksong-inquiry/);

  await page.goto('?space=demo#/my-progress');
  const consent = page.getByLabel('이 기기에서 사용 흐름 관찰', { exact: true });
  await expect(consent).not.toBeChecked();
  await consent.check();
  await page.reload();
  await expect(consent).toBeChecked();
  await page.goto('?space=demo#/');
  await page.getByRole('button', { name: '이어가기', exact: true }).press('Enter');
  await expect(page.locator('main h1')).toHaveText('함수는 어떤 관계일까?');
  await page.goto('?space=demo#/my-progress');
  await expect(page.getByText('이어가기: 1회', { exact: true })).toBeVisible();
  const body = await page.locator('body').textContent();
  expect(body).not.toContain('연속 접속');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    (page.viewportSize()?.width ?? 0) + 1,
  );
  expect(errors).toEqual([]);
});

test('next action storage failure retains exact input and supports verified retry', async ({
  page,
}) => {
  await page.goto('?space=demo#/node/demo-topic-function');
  await page.getByRole('button', { name: '다음에 펼칠 곳 남기기', exact: true }).click();
  const original = '  실패해도 남아야 할 글\n';
  await page.getByLabel('다음에 할 일').fill(original);
  await page.evaluate(() => {
    const old = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith(':experience:v1')) throw new DOMException('quota', 'QuotaExceededError');
      return old.call(this, key, value);
    };
  });
  await page.getByRole('button', { name: '다음 행동 남기기', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('다음에 할 일')).toHaveValue(original);
  await expect(page.getByRole('dialog')).not.toContainText('다음에 할 일로 남겨두었습니다');
  // Reload restores the exact independently saved editor draft and real storage API.
  await page.reload();
  await page.getByRole('button', { name: '다음에 펼칠 곳 남기기', exact: true }).click();
  await expect(page.getByLabel('다음에 할 일')).toHaveValue(original);
  await page.getByRole('button', { name: '다음 행동 남기기', exact: true }).click();
  await page.goto('?space=demo#/');
  expect(await page.locator('.brand-next').textContent()).toBe(original);
});
