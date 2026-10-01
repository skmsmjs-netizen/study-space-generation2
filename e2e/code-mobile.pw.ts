import { expect, test, type Page } from '@playwright/test';
const cases = [
  {
    language: 'c',
    title: 'C · 두 수의 합',
    code: '#include <stdio.h>\n// 합성 시험용 주석\nint main(void){int a,b;scanf("%d%d",&a,&b);printf("합계: %d\\n",a+b);return 0;}',
    stdin: '3\n4',
    output: '합계: 7',
  },
  {
    language: 'cpp',
    title: 'C++ · 반복문',
    code: '#include <iostream>\n// 1부터 순서대로 출력\nint main(){int n;std::cin>>n;for(int i=1;i<=n;++i)std::cout<<i<<" ";}',
    stdin: '4',
    output: '1 2 3 4',
  },
  {
    language: 'csharp',
    title: 'C# · 한글 인사',
    code: 'using System;\n// 한글 이름을 보존합니다.\nclass Program{static void Main(){string name=Console.ReadLine();Console.WriteLine("안녕하세요, "+name);}}',
    stdin: '연습자',
    output: '안녕하세요, 연습자',
  },
];
async function editor(page: Page) {
  const node = page.locator('.code-touch-editor .cm-content');
  await expect(node).toBeVisible();
  return node;
}
async function checkOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
}
test('three C-family examples run, survive navigation/reload, and can be found by title or notes', async ({
  page,
}, info) => {
  await page.goto('/?space=demo#/code');
  const saved = [];
  for (const item of cases) {
    await page.getByRole('button', { name: '예제 추가', exact: true }).click();
    const title = `모바일 시험 · ${item.title}`;
    const notes = `  첫 공백 보존\n${item.title} 설명과 예외\n  끝 공백  `;
    await page.getByLabel('언어', { exact: true }).selectOption(item.language);
    await page.getByLabel('예제 제목', { exact: true }).fill(title);
    await (await editor(page)).fill(item.code);
    await page.getByLabel('실행 방식', { exact: true }).selectOption('batch');
    await page.getByLabel('실행에 사용할 입력값', { exact: true }).fill(item.stdin);
    await page.getByLabel('내용·설명', { exact: true }).fill(notes);
    await page.getByRole('button', { name: '실행', exact: true }).click();
    await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
      item.output,
    );
    await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '지금 저장', exact: true }).click();
    saved.push({ ...item, title, notes, url: page.url() });
    await page.getByRole('link', { name: '← 예제 목록', exact: true }).click();
  }
  for (const item of saved) {
    await page.getByLabel('예제 찾기', { exact: true }).fill(item.title);
    await page.getByRole('link', { name: item.title, exact: true }).click();
    await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue(item.title);
    expect(await (await editor(page)).innerText()).toBe(item.code);
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(item.notes);
    await expect(page.getByLabel('실행에 사용할 입력값', { exact: true })).toHaveValue(item.stdin);
    await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
      item.output,
    );
    await page.reload();
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(item.notes);
    expect(await (await editor(page)).innerText()).toBe(item.code);
    await checkOverflow(page);
    await page.getByRole('link', { name: '← 예제 목록', exact: true }).click();
  }
  await page.getByLabel('예제 찾기', { exact: true }).fill('설명과 예외');
  await expect(page.getByRole('link', { name: /모바일 시험 ·/ })).toHaveCount(3);
  await page.getByLabel('예제 언어', { exact: true }).selectOption('csharp');
  await expect(page.getByRole('link', { name: /모바일 시험 ·/ })).toHaveCount(1);
  await page.screenshot({
    path: info.outputPath('saved-examples.png'),
    fullPage: true,
  });
});
test('touch toolbar, braces, syntax checks and rotation preserve text and undo', async ({
  page,
}, info) => {
  await page.goto('/?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  let node = await editor(page);
  await node.pressSequentially('int main(void) {');
  await node.press('Enter');
  expect(await node.innerText()).toContain('int main(void) {\n    \n}');
  await page.getByRole('button', { name: '주석', exact: true }).click();
  expect(await node.innerText()).toContain('//');
  await page.getByRole('button', { name: '되돌리기', exact: true }).click();
  expect(await node.innerText()).not.toContain('//');
  const before = await node.innerText();
  await page.setViewportSize({ width: 1194, height: 834 });
  expect(await node.innerText()).toBe(before);
  await checkOverflow(page);
  await node.fill('int main(void){return 0}');
  await expect(page.getByRole('list', { name: '문법 오류 목록' })).toBeVisible();
  await node.fill('int main(void){return 0;}');
  await expect(page.getByText('문법 오류를 찾지 못했습니다.', { exact: true })).toBeVisible();
  await node.fill('');
  await page.getByRole('button', { name: 'main 함수', exact: true }).click();
  expect(await node.innerText()).toContain('int main(void)');
  await page.getByRole('checkbox', { name: 'Tab으로 편집기 나가기', exact: true }).check();
  await node.focus();
  await node.press('Tab');
  expect(await page.evaluate(() => !document.activeElement?.closest('.cm-editor'))).toBe(true);
  await page.screenshot({
    path: info.outputPath('touch-editor.png'),
    fullPage: true,
  });
});
test('native terminal input sends two values to a single running process', async ({
  page,
}, info) => {
  await page.goto('/?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await (
    await editor(page)
  ).fill(
    '#include <stdio.h>\nint main(void){int a,b;printf("첫 입력: ");scanf("%d",&a);printf("다음 입력: ");scanf("%d",&b);printf("합계: %d\\n",a+b);return 0;}',
  );
  await page.getByRole('button', { name: '실행', exact: true }).click();
  const input = page.getByLabel('터미널에 보낼 입력', { exact: true });
  await expect(input).toBeEnabled();
  await input.fill('3');
  await input.dispatchEvent('compositionstart');
  await input.press('Enter');
  // Synthetic composition Enter may insert a line break, but must not send input.
  expect(await input.inputValue()).toMatch(/^3\n?$/);
  await expect(page.getByRole('region', { name: '실행 터미널', exact: true })).not.toContainText(
    '다음 입력:',
  );
  await input.dispatchEvent('compositionend');
  await input.fill('3');
  await page.getByRole('button', { name: '입력 보내기', exact: true }).click();
  await expect(page.getByRole('region', { name: '실행 터미널', exact: true })).toContainText(
    '다음 입력:',
  );
  await input.fill('4');
  await input.press('Enter');
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
    '합계: 7',
  );
  await expect(input).toBeDisabled();
  await checkOverflow(page);
  await page.screenshot({
    path: info.outputPath('terminal-two-inputs.png'),
    fullPage: true,
  });
});

test('the execution shortcut runs code without inserting a blank line', async ({ page }) => {
  await page.goto('/?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  const node = await editor(page);
  const code = '#include <stdio.h>\nint main(void){puts("shortcut ok");return 0;}';
  await node.fill(code);
  await page.getByLabel('실행 방식', { exact: true }).selectOption('batch');
  await node.press('Meta+Enter');
  await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText(
    'shortcut ok',
  );
  expect(await node.innerText()).toBe(code);
});
