import type { AppState } from './model';

export const MAX_OUTLINE_ROWS = 500;
export const MAX_OUTLINE_NAME = 180;

/** Detect a changed preview, including renamed/moved ancestors and restored rows. */
export function outlineRevisionToken(state: AppState, subjectId: string, parentId: string | null): string {
  const subject = state.subjects.find(row => row.id === subjectId);
  return JSON.stringify([state.userId, state.namespace, subjectId, parentId,
    subject ? [subject.version, subject.deletedAt, subject.scope] : null,
    state.nodes.filter(row => row.subjectId === subjectId)
      .map(row => [row.id, row.parentId, row.order, row.name, row.version, row.deletedAt])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0])))]);
}

/** One input per row. Raw cells remain in the caller's draft; no text/TSV parsing. */
export function previewOutlineEntries(names: string[]): {
  entries: { line: number; name: string }[];
  issues: { line: number; message: string }[];
} {
  const entries: { line: number; name: string }[] = [], issues: { line: number; message: string }[] = [];
  if (!Array.isArray(names) || names.length > MAX_OUTLINE_ROWS) {
    return { entries, issues: [{ line: 0, message: `한 번에 ${MAX_OUTLINE_ROWS}행까지 추가할 수 있습니다.` }] };
  }
  const seen = new Set<string>();
  names.forEach((raw, index) => {
    const line = index + 1;
    if (typeof raw !== 'string') { issues.push({ line, message: '이름을 글로 입력해 주세요.' }); return; }
    const name = raw.trim();
    if (!name) return;
    if (/[\r\n\t]/.test(raw)) { issues.push({ line, message: '항목마다 별도 입력칸을 사용해 주세요.' }); return; }
    if (name.length > MAX_OUTLINE_NAME) { issues.push({ line, message: `이름은 ${MAX_OUTLINE_NAME}자 이내로 입력해 주세요.` }); return; }
    if (!seen.has(name)) { seen.add(name); entries.push({ line, name }); }
  });
  return { entries, issues };
}
