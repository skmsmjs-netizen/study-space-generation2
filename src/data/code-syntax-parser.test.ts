// @vitest-environment node
import { beforeAll, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { createSyntaxChecker } from './code-syntax-parser';
import type { CodeLanguage } from '../domain/model';
let check: Awaited<ReturnType<typeof createSyntaxChecker>>;
beforeAll(async () => {
  const grammar = (name: string) => fileURLToPath(new URL(`../../node_modules/@repomix/tree-sitter-wasms/out/tree-sitter-${name}.wasm`, import.meta.url));
  check = await createSyntaxChecker(fileURLToPath(new URL('../../node_modules/web-tree-sitter/web-tree-sitter.wasm', import.meta.url)), {
    c: grammar('c'), cpp: grammar('cpp'), csharp: grammar('c_sharp'), python: grammar('python'), javascript: grammar('javascript'),
  });
});
it.each<[CodeLanguage, string, string]>([
  ['c', '#include <stdio.h>\nint main(){int x; scanf("%d", &x); return 0;}', 'int main(){int x return 0;}'],
  ['cpp', '#include <iostream>\nint main(){int x;std::cin>>x;std::cout<<x;}', 'int main(){int x std::cin>>x;}'],
  ['csharp', 'using System;class Program{static void Main(){int x=1;Console.WriteLine(x);}}', 'class Program{static void Main(){int x=1 Console.WriteLine(x);}}'],
  ['python', 'x = input()\nprint(x)', 'if True\n    print(1)'],
  ['javascript', 'const x=1; console.log(x);', 'const x = ;'],
])('parses actual %s grammar and distinguishes valid and invalid code', async (language, valid, invalid) => {
  expect(await check(valid, language)).toEqual([]);
  const errors = await check(invalid, language);
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0].startLineNumber).toBeGreaterThan(0);
});
it('uses UTF16 columns for Korean/emoji text and does not diagnose braces inside strings', async () => {
  const code = 'int main(){/*한글 😀*/ int x return 0;}';
  const issues = await check(code, 'c');
  expect(issues.length).toBeGreaterThan(0);
  expect(issues[0].startColumn).toBeGreaterThan(code.indexOf('*/'));
  expect(await check('int main(){char *x="한글 { } ; 😀"; return 0;}', 'c')).toEqual([]);
});
it('keeps syntax checking distinct from compiler type/name validation', async () => {
  expect(await check('int main(){unknown_variable = 3;}', 'c')).toEqual([]);
});
