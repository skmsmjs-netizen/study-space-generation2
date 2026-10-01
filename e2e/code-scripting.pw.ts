import { expect, test } from '@playwright/test';
test.skip(process.platform !== 'darwin', 'Interactive execution is scoped to the local Mac.');
for (const language of ['python', 'javascript']) {
  test(`${language}: live Korean input, two inputs, syntax recovery and saved example reopening`, async ({
    page,
  }, testInfo) => {
    // Each browser context has an isolated synthetic ledger; personal records are untouched.
    await page.goto('/?space=demo#/code');
    await page.getByRole('button', { name: '예제 추가', exact: true }).click();
    await page.getByLabel('언어', { exact: true }).selectOption(language);
    const title = `${language} 연속 입력 보존`;
    const notes = '  한글과 줄바꿈을 보존합니다.\n조건·예외도 남깁니다.  ';
    const code =
      language === 'python'
        ? '# 한글 입력 예제\nname = input("NAME: ")\na = int(input("FIRST: "))\nb = int(input("SECOND: "))\nprint("안녕하세요, " + name)\nprint("SUM=" + str(a + b))'
        : '// 한글 입력 예제\nconst name = prompt("NAME: ");\nconst a = Number(prompt("FIRST: "));\nconst b = Number(prompt("SECOND: "));\nconsole.log("안녕하세요, " + name);\nconsole.log("SUM=" + (a + b));';
    const editor = page.getByLabel('소스 코드', { exact: true });
    const result = page.getByRole('region', { name: '실행 결과', exact: true });
    const terminal = page.getByRole('region', { name: '실행 터미널', exact: true });
    await page.getByLabel('예제 제목', { exact: true }).fill(title);
    await page.getByLabel('내용·설명', { exact: true }).fill(notes);
    await expect(page.getByLabel('실행 방식', { exact: true })).toHaveValue('terminal');
    await editor.fill(language === 'python' ? 'if True\n print(1)' : 'const value = ;');
    await page.getByRole('button', { name: '실행', exact: true }).click();
    await expect(result).toContainText('SyntaxError');
    await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled();
    // Monaco's accessibility textarea is an editing buffer: explicitly replace the
    // model through the real Select All/Delete keys before inserting fresh source.
    if ((await editor.getAttribute('contenteditable')) !== 'true') {
      await editor.press('Meta+A');
      await editor.press('Backspace');
    }
    await editor.fill(code);
    if ((await editor.getAttribute('contenteditable')) === 'true')
      await expect
        .poll(() => editor.locator('.cm-line').allTextContents())
        .toEqual(code.split('\n'));
    else await expect(editor).toHaveValue(code);
    await page.getByRole('button', { name: '실행', exact: true }).click();
    for (const [prompt, input] of [
      ['NAME:', '연습자'],
      ['FIRST:', '3'],
      ['SECOND:', '4'],
    ]) {
      await expect(terminal).toContainText(prompt);
      const inputField = page.getByLabel('터미널에 보낼 입력', { exact: true });
      await inputField.fill(input);
      await expect(inputField).toHaveValue(input);
      await page.getByRole('button', { name: '입력 보내기', exact: true }).click();
      await expect(inputField).toHaveValue('');
    }
    await expect(result).toContainText('안녕하세요, 연습자');
    await expect(result).toContainText('SUM=7');
    await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled();
    const url = page.url();
    await page.getByRole('button', { name: '지금 저장', exact: true }).click();
    await page.getByRole('link', { name: /예제 목록/ }).click();
    await page.getByRole('link', { name: title, exact: true }).click();
    await expect(page).toHaveURL(url);
    await page.reload();
    await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue(title);
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(notes);
    await expect(page.getByLabel('실행 방식', { exact: true })).toHaveValue('terminal');
    if ((await editor.getAttribute('contenteditable')) === 'true')
      await expect.poll(() => editor.innerText()).toBe(code);
    else await expect(editor).toHaveValue(code);
    await expect(result).toContainText('SUM=7');
    await result.getByText('보낸 입력', { exact: true }).click();
    await expect(result).toContainText('연습자\n3\n4');
    await page.screenshot({ path: testInfo.outputPath(`${language}-saved.png`), fullPage: true });
  });
}
