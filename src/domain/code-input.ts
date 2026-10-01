import type { CodeLanguage } from './model';

/** This is an input hint, not a claim that a branch will read input. EOF remains selectable. */
export function requestsCodeInput(code: string, language: CodeLanguage) {
  const source = code.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, ' ');
  switch (language) {
    case 'c': return /\b(?:scanf|getchar|fgets|gets)\s*\(/.test(source);
    case 'cpp': return /\b(?:scanf|getchar|fgets|getline)\s*\(|\bcin\s*>>/.test(source);
    case 'csharp': return /\bConsole\s*\.\s*Read(?:Line|Key)?\s*\(/.test(source);
    case 'python': return /\binput\s*\(/.test(source.replace(/#[^\n]*/g, ' '));
    case 'javascript': return /\b(?:readline|prompt)\s*\(/.test(source);
  }
}
