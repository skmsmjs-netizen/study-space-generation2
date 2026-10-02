import { expect, test } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

test('one and two memo cards allow pointer trash, undo and reload without losing original text', async ({
  page,
}) => {
  await page.goto('?space=demo#/memos');
  for (const body of ['  첫 메모 원문\n끝 공백  ', '  다른 메모의 조건·예외  ']) {
    await page.getByRole('button', { name: '메모 추가', exact: true }).click();
    await page.getByText('글·연결·입력 설정', { exact: true }).click();
    await page.getByRole('textbox', { name: '짧은 글', exact: true }).fill(body);
    await page.getByRole('button', { name: '닫기', exact: true }).click();
    await page.getByLabel('메모 1 메뉴', { exact: true }).click();
    const action = page.getByRole('button', { name: '메모 1 휴지통으로 이동', exact: true });
    await expect(action).toBeVisible();
    // A normal click must pass browser hit testing; forcing it would mask this defect.
    await action.click();
    const dialog = page.getByRole('dialog', { name: '메모를 휴지통으로 옮길까요?' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: '휴지통으로 이동', exact: true }).click();
    await page.getByRole('button', { name: '메모 복원', exact: true }).click();
    await page.reload();
    const stored = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
    if (stored === null) throw Error('Expected the saved memo workspace');
    const data = JSON.parse(decodeStoredText(stored)).data;
    expect(
      data.memos.some(
        (memo: { body: string; deletedAt: string | null }) => memo.body === body && !memo.deletedAt,
      ),
    ).toBe(true);
    expect(data.records).toEqual([]);
  }
});
