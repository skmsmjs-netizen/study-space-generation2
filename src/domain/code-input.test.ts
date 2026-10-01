import { expect, it } from 'vitest';
import { requestsCodeInput } from './code-input';
it('recognizes real console input calls for five languages', () => {
  expect(requestsCodeInput('scanf("%d", &x);', 'c')).toBe(true);
  expect(requestsCodeInput('std::cin >> x;', 'cpp')).toBe(true);
  expect(requestsCodeInput('Console.ReadLine();', 'csharp')).toBe(true);
  expect(requestsCodeInput('x = input("값")', 'python')).toBe(true);
  expect(requestsCodeInput('const x = readline();', 'javascript')).toBe(true);
});
it('does not demand input for calls appearing only in comments or literal strings', () => {
  expect(requestsCodeInput('// scanf("%d", &x);\n/* getchar(); */\nprintf("scanf(%d) cin >> x");', 'c')).toBe(false);
  expect(requestsCodeInput('# input()\nprint("input()")', 'python')).toBe(false);
});
