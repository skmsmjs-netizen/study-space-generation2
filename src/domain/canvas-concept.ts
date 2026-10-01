import type { QuickMemo } from './model';

// Concepts remain ordinary versioned memos: title on the first line, original explanation after it.
export const CONCEPT_MEMO_PREFIX = 'canvas-concept:';
export function isConceptMemo(memo: Pick<QuickMemo, 'id'>) {
  return memo.id.startsWith(CONCEPT_MEMO_PREFIX);
}
export function conceptText(body: string) {
  const end = body.indexOf('\n');
  return end < 0
    ? { name: body, description: '' }
    : { name: body.slice(0, end), description: body.slice(end + 1) };
}
