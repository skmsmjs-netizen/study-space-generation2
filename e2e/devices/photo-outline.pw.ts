import { test, expect } from '@playwright/test';
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDZkAAAAASUVORK5CYII=',
  'base64',
);
test('사진 원본과 GPT 목차 초안을 수정·재접속·한 번 등록하고 되돌린다', async ({ page }) => {
  const calls: string[] = [];
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && !r.url().startsWith(process.env.STUDY_AI_FIXTURE_URL!))
      calls.push(r.url());
  });
  await page.goto(process.env.STUDY_AI_FIXTURE_URL! + '#/materials/new');
  await page.getByRole('button', { name: '사진으로 목차·내용 가져오기', exact: true }).tap();
  await page
    .getByLabel('목차 사진 파일', { exact: true })
    .setInputFiles({ name: '합성-사진.png', mimeType: 'image/png', buffer: png });
  await expect(page.getByRole('img', { name: '1번째 원본 사진', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'GPT로 사진 목차·내용 만들기', exact: true }).tap();
  await expect(page.getByRole('textbox', { name: '1번 항목 이름', exact: true })).toHaveValue(
    '직류 회로',
  );
  await page.getByRole('textbox', { name: '1번 항목 이름', exact: true }).fill('');
  await page.reload();
  await page
    .getByRole('button', { name: '사진으로 목차·내용 가져오기 · 이어가기', exact: true })
    .tap();
  await expect(page.getByRole('textbox', { name: '1번 항목 이름', exact: true })).toHaveValue('');
  await page
    .getByRole('textbox', { name: '1번 항목 이름', exact: true })
    .fill('직류 회로 · 조건 확인');
  await page.getByText('2. 옴의 법칙 · 확인 필요', { exact: true }).tap();
  await page
    .getByRole('textbox', { name: '2번 하위 내용', exact: true })
    .fill('V=IR. 저항이 일정할 때만 비례한다. 온도 변화는 예외로 보존한다.');
  await page.reload();
  await page
    .getByRole('button', { name: '사진으로 목차·내용 가져오기 · 이어가기', exact: true })
    .tap();
  await expect(page.getByRole('textbox', { name: '1번 항목 이름', exact: true })).toHaveValue(
    '직류 회로 · 조건 확인',
  );
  await page.getByText('2. 옴의 법칙 · 확인 필요', { exact: true }).tap();
  await expect(page.getByRole('textbox', { name: '2번 하위 내용', exact: true })).toHaveValue(
    'V=IR. 저항이 일정할 때만 비례한다. 온도 변화는 예외로 보존한다.',
  );
  await expect(page.getByRole('img', { name: '1번째 원본 사진', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '확인한 목차·내용 등록', exact: true }).tap();
  await expect(
    page.getByRole('link', { name: '저장한 사진 자료 열기', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '확인한 목차·내용 등록', exact: true }),
  ).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('synthetic-photo-calls'))).toBe('1');
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('synthetic-gpt-completion')!),
  );
  expect(saved.nodes.map((n: { name: string }) => n.name)).toEqual([
    '직류 회로 · 조건 확인',
    '옴의 법칙',
  ]);
  expect(saved.memos.at(-1).body).toContain('예외로 보존');
  expect(saved.records).toHaveLength(0);
  expect(saved.studyMaterials[0].documents[0].blocks[0].originalText).toContain(
    '온도 변화는 따로 확인',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.getByRole('button', { name: '이번 등록 되돌리기', exact: true }).tap();
  const undone = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('synthetic-gpt-completion')!),
  );
  expect(undone.nodes.every((n: { deletedAt: string }) => n.deletedAt)).toBe(true);
  expect(undone.studyMaterials[0].deletedAt).toBeTruthy();
  await expect(
    page.getByRole('button', { name: '이번 등록을 되돌렸습니다', exact: true }),
  ).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('synthetic-photo-calls'))).toBe('1');
  expect(calls).toEqual([]);
});
