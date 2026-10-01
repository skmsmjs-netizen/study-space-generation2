import { expect, test } from '@playwright/test';
test('JavaScript batch input and Python example preserve source, notes and list reopening', async ({
  page,
}) => {
  await page.goto('./?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await page.getByLabel('언어', { exact: true }).selectOption('javascript');
  await page.getByLabel('실행 방식', { exact: true }).selectOption('batch');
  const code =
    '// 원문 주석\nconst a = Number(prompt("첫째: "));\nconst b = Number(readline());\nconsole.log("합계=" + (a+b));';
  const notes = '  원문과 예외\n설명 끝의 공백도 보존합니다.  ';
  const title = 'JavaScript 입력과 저장';
  const editor = page.locator('.cm-content[aria-label="소스 코드"]');
  await editor.waitFor();
  await editor.fill(code);
  await expect.poll(() => editor.locator('.cm-line').allTextContents()).toEqual(code.split('\n'));
  await page.getByLabel('예제 제목', { exact: true }).fill(title);
  await page.getByLabel('내용·설명', { exact: true }).fill(notes);
  await page.getByLabel('실행에 사용할 입력값', { exact: true }).fill('3\n4');
  await page.getByRole('button', { name: '실행', exact: true }).click();
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
    '합계=7',
  );
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  await page.getByRole('link', { name: /예제 목록/ }).click();
  await page.getByRole('link', { name: title, exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('실행 방식', { exact: true })).toHaveValue('batch');
  await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
  await expect.poll(() => editor.locator('.cm-line').allTextContents()).toEqual(code.split('\n'));
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
    '합계=7',
  );
  // Python persistence shares the same contract; execution is covered separately on the Mac.
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await page.getByLabel('언어', { exact: true }).selectOption('python');
  const python = '# 입력을 기다리는 예제\nname = input("이름: ")\nprint("안녕하세요, " + name)';
  await page.getByLabel('예제 제목', { exact: true }).fill('Python 원문 보관');
  await editor.fill(python);
  await expect.poll(() => editor.locator('.cm-line').allTextContents()).toEqual(python.split('\n'));
  await page.getByLabel('내용·설명', { exact: true }).fill(notes);
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  await page.getByRole('link', { name: /예제 목록/ }).click();
  await page.getByRole('link', { name: 'Python 원문 보관', exact: true }).click();
  await page.reload();
  await expect(page.getByLabel('언어', { exact: true })).toHaveValue('python');
  await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
  await expect.poll(() => editor.locator('.cm-line').allTextContents()).toEqual(python.split('\n'));
});
