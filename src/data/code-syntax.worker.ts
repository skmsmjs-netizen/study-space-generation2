import { createSyntaxChecker } from './code-syntax-parser';
import runtimeUrl from 'web-tree-sitter/web-tree-sitter.wasm?url';
import c from '@repomix/tree-sitter-wasms/out/tree-sitter-c.wasm?url';
import cpp from '@repomix/tree-sitter-wasms/out/tree-sitter-cpp.wasm?url';
import csharp from '@repomix/tree-sitter-wasms/out/tree-sitter-c_sharp.wasm?url';
import python from '@repomix/tree-sitter-wasms/out/tree-sitter-python.wasm?url';
import javascript from '@repomix/tree-sitter-wasms/out/tree-sitter-javascript.wasm?url';
import type { CodeLanguage } from '../domain/model';

const checker = createSyntaxChecker(runtimeUrl, { c, cpp, csharp, python, javascript });
self.onmessage = async (event: MessageEvent<{ id: number; code: string; language: CodeLanguage }>) => {
  const { id, code, language } = event.data;
  try {
    const diagnostics = await (await checker)(code, language);
    self.postMessage({ id, diagnostics });
  } catch {
    self.postMessage({ id, unavailable: true });
  }
};
