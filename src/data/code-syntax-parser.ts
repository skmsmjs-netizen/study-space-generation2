import { Language, Parser, type Node as SyntaxNode } from 'web-tree-sitter';
import type { CodeLanguage } from '../domain/model';

export interface SyntaxDiagnostic {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
}
export function collectSyntaxDiagnostics(root: SyntaxNode): SyntaxDiagnostic[] {
  const diagnostics: SyntaxDiagnostic[] = [];
  const visit = (node: SyntaxNode) => {
    if (diagnostics.length >= 30) return;
    if (node.isMissing || node.type === 'ERROR') {
      const start = node.startPosition, end = node.endPosition;
      diagnostics.push({
        startLineNumber: start.row + 1,
        startColumn: start.column + 1,
        endLineNumber: end.row + 1,
        endColumn: end.column + 1 + (node.startIndex === node.endIndex ? 1 : 0),
        message: node.isMissing
          ? `${node.type} 기호 또는 구문이 필요합니다.`
          : '이 부분의 문법을 확인해 주세요. 괄호·기호·문장의 순서를 살펴보세요.',
      });
      // A parent ERROR already marks this range. Avoid duplicate nested messages.
      return;
    }
    if (node.hasError) for (const child of node.children) visit(child);
  };
  visit(root);
  return diagnostics;
}

export async function createSyntaxChecker(
  runtimeUrl: string,
  grammarUrls: Record<CodeLanguage, string>,
) {
  await Parser.init({ locateFile: () => runtimeUrl });
  const languages = new Map<CodeLanguage, Promise<Language>>();
  return async (code: string, language: CodeLanguage): Promise<SyntaxDiagnostic[]> => {
    let loaded = languages.get(language);
    if (!loaded) {
      loaded = Language.load(grammarUrls[language]);
      languages.set(language, loaded);
    }
    const parser = new Parser();
    try {
      parser.setLanguage(await loaded);
      const started = Date.now();
      const tree = parser.parse(code, null, {
        progressCallback: () => Date.now() - started > 500,
      });
      if (!tree) throw Error('Syntax check took too long');
      try { return collectSyntaxDiagnostics(tree.rootNode); }
      finally { tree.delete(); }
    } finally { parser.delete(); }
  };
}
