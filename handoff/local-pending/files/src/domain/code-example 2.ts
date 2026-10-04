import { DomainError, type CodeExampleContent, type CodeLanguage } from './model';

export const CODE_LANGUAGES: Record<CodeLanguage, string> = {
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  python: 'Python',
  javascript: 'JavaScript',
};
export const CODE_STARTERS: Record<CodeLanguage, string> = {
  c: '#include <stdio.h>\n\nint main(void)\n{\n    // 여기에 코드를 입력하세요.\n    printf("Hello, world!\\n");\n    return 0;\n}\n',
  cpp: '#include <iostream>\n\nint main()\n{\n    // 여기에 코드를 입력하세요.\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}\n',
  csharp:
    'using System;\n\nclass Program\n{\n    static void Main()\n    {\n        // 여기에 코드를 입력하세요.\n        Console.WriteLine("Hello, world!");\n    }\n}\n',
  python: '# 여기에 코드를 입력하세요.\nprint("Hello, world!")\n',
  javascript: '// 여기에 코드를 입력하세요.\nconsole.log("Hello, world!");\n',
};
export const MAX_CODE_TEXT = 200_000;
export const MAX_CODE_OUTPUT = 100_000;
export function validateCodeContent(value: unknown): asserts value is CodeExampleContent {
  const fail = () => {
    throw new DomainError(
      'INVALID_CODE_EXAMPLE',
      '코드 예제의 제목·코드·설명·실행 결과를 확인해 주세요.',
    );
  };
  if (!value || typeof value !== 'object' || Array.isArray(value)) return fail();
  const content = value as CodeExampleContent;
  if (!Object.hasOwn(CODE_LANGUAGES, content.language)) return fail();
  for (const name of ['title', 'code', 'stdin', 'notes'] as const) {
    if (typeof content[name] !== 'string' || content[name].length > MAX_CODE_TEXT) return fail();
  }
  if (content.lastRun !== undefined) {
    const run = content.lastRun;
    if (
      !run ||
      !Object.hasOwn(CODE_LANGUAGES, run.language) ||
      !['success', 'error', 'stopped'].includes(run.outcome) ||
      typeof run.at !== 'string' ||
      !Number.isFinite(Date.parse(run.at))
    )
      return fail();
    for (const name of ['code', 'stdin', 'output', 'error'] as const) {
      if (
        typeof run[name] !== 'string' ||
        run[name].length > (name === 'output' || name === 'error' ? MAX_CODE_OUTPUT : MAX_CODE_TEXT)
      )
        return fail();
    }
  }
}
export function codeContent(row: CodeExampleContent): CodeExampleContent {
  return {
    title: row.title,
    language: row.language,
    code: row.code,
    stdin: row.stdin,
    notes: row.notes,
    ...(row.lastRun ? { lastRun: row.lastRun } : {}),
  };
}
export function sameCodeContent(a: CodeExampleContent, b: CodeExampleContent) {
  return JSON.stringify(codeContent(a)) === JSON.stringify(codeContent(b));
}
export function currentCodeRun(content: CodeExampleContent) {
  return Boolean(
    content.lastRun &&
    content.lastRun.code === content.code &&
    content.lastRun.language === content.language &&
    content.lastRun.stdin === content.stdin,
  );
}
