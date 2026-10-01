import { expect, test } from '@playwright/test';
async function example(page: import('@playwright/test').Page, language: string) {
  await page.goto('/?space=demo#/code');
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await page.getByLabel('언어', { exact: true }).selectOption(language);
}
for (const language of ['c', 'cpp', 'csharp'])
  test(`${language} runs input and preserves code, title, notes and output after reload`, async ({
    page,
  }) => {
    await example(page, language);
    await page.getByLabel('예제 제목', { exact: true }).fill(`${language} 입력 시험`);
    const code =
      language === 'c'
        ? '#include <stdio.h>\nint main(void){int a,b;scanf("%d %d",&a,&b);printf("%d\\n",a+b);return 0;}'
        : language === 'cpp'
          ? '#include <iostream>\nint main(){int a,b;std::cin>>a>>b;std::cout<<a+b<<std::endl;}'
          : 'using System;class Program{static void Main(){int a=int.Parse(Console.ReadLine());int b=int.Parse(Console.ReadLine());Console.WriteLine(a+b);}}';
    await page.getByLabel('소스 코드', { exact: true }).fill(code);
    await page.getByText('실행에 사용할 입력값', { exact: true }).click();
    await page.getByLabel('실행에 사용할 입력값', { exact: true }).fill('3\n4');
    await page.getByLabel('내용·설명', { exact: true }).fill('  조건과 예외를 남긴 설명  ');
    await page.getByRole('button', { name: '실행', exact: true }).click();
    await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('7');
    await expect(page.getByRole('button', { name: '실행', exact: true })).toBeEnabled();
    await page.reload();
    await expect(page.getByLabel('예제 제목', { exact: true })).toHaveValue(
      `${language} 입력 시험`,
    );
    await expect(page.getByLabel('내용·설명', { exact: true })).toHaveValue(
      '  조건과 예외를 남긴 설명  ',
    );
    await expect(page.getByRole('region', { name: '실행 결과', exact: true })).toContainText('7');
  });
test('main snippet, braces, indent, undo, and narrow keyboard exit work in the actual Monaco editor', async ({
  page,
}) => {
  await example(page, 'c');
  const editor = page.getByLabel('소스 코드', { exact: true });
  await editor.pressSequentially('main');
  await expect(
    page.getByRole('listbox', { name: 'Suggest' }).getByText('main', { exact: true }),
  ).toBeVisible();
  await editor.press('Tab');
  await expect(editor).toHaveValue(/int main\(void\)/);
  await page.getByRole('button', { name: '예제 추가', exact: true }).click();
  await expect(editor).toHaveValue('');
  await editor.pressSequentially('int main(void) {');
  await editor.press('Enter');
  await expect(editor).toHaveValue('int main(void) {\n    \n}');
  // Monaco follows the emulated user agent; Playwright ControlOrMeta follows the host.
  const modifier = await page.evaluate(() =>
    navigator.userAgent.includes('Macintosh') ? 'Meta' : 'Control',
  );
  await editor.press(`${modifier}+Z`);
  await expect(editor).toHaveValue('int main(void) {}');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByLabel('Tab으로 편집기 나가기', { exact: true }).check();
  await editor.focus();
  await editor.press('Tab');
  expect(await page.evaluate(() => !document.activeElement?.closest('.monaco-editor'))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
