import { DomainError, type AppState, type OutlineTableInput, type Scope } from './model';

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

export function outlineTableToken(state: AppState): string {
  return JSON.stringify([state.userId, state.namespace,
    state.semesters.map(row => [row.id, row.version, row.deletedAt]),
    state.subjects.map(row => [row.id, row.name, row.scope, row.order, row.version, row.deletedAt]),
    state.nodes.map(row => [row.id, row.subjectId, row.parentId, row.role, row.name, row.order, row.version, row.deletedAt])]);
}
export const sameOutlineScope = (left: Scope, right: Scope) => left.kind === right.kind && (left.kind !== 'semester' || right.kind === 'semester' && left.semesterId === right.semesterId);
export interface OutlineTablePreviewEntry {
  key: string; parentKey: string | null; subjectKey: string; name: string; path: string[];
  kind: 'subject' | 'unit' | 'topic'; status: 'new' | 'reuse' | 'choose' | 'blocked';
  id: string | null; candidates: { id: string; name: string }[];
}
/** Recompute from exact individual cells; no flattening of existing deeper outlines. */
export function previewOutlineTable(state: AppState, input: OutlineTableInput) {
  const fail = (message: string): never => { throw new DomainError('INVALID_OUTLINE_TABLE', message); };
  if (!input || !input.scope || !['semester', 'independent', 'unassigned'].includes(input.scope.kind)) fail('등록할 학기를 확인해 주세요.');
  if (input.scope.kind === 'semester' && !state.semesters.some(row => row.id === (input.scope as { semesterId: string }).semesterId && !row.deletedAt)) fail('등록할 학기를 찾을 수 없습니다.');
  if (!Array.isArray(input.courses) || input.courses.length > MAX_OUTLINE_ROWS || !input.choices || typeof input.choices !== 'object' || Array.isArray(input.choices)) fail('입력 표의 형식을 확인해 주세요.');
  const keys = new Set<string>(), entries: OutlineTablePreviewEntry[] = [], paths = new Map<string, OutlineTablePreviewEntry>();
  let rows = 0;
  const cell = (value: { key: string; name: string }) => {
    if (!value || typeof value.key !== 'string' || !value.key || keys.has(value.key) || typeof value.name !== 'string') fail('입력칸의 식별자와 원문을 확인해 주세요.');
    keys.add(value.key);
    const name = value.name.trim();
    if (name.length > MAX_OUTLINE_NAME || /[\r\n\t]/.test(value.name)) fail('이름은 줄바꿈 없이 180자 이내로 개별 칸에 적어 주세요.');
    return name;
  };
  const append = (path: string[], kind: OutlineTablePreviewEntry['kind']) => {
    const key = JSON.stringify(path);
    if (paths.has(key)) return;
    const parentKey = path.length > 1 ? JSON.stringify(path.slice(0, -1)) : null;
    const parent = parentKey ? paths.get(parentKey)! : null;
    const subjectKey = JSON.stringify(path.slice(0, 1)), subject = paths.get(subjectKey);
    const candidates = (kind === 'subject'
      ? state.subjects.filter(row => !row.deletedAt && row.name === path[0] && sameOutlineScope(row.scope, input.scope))
      : parent?.status === 'reuse'
        ? state.nodes.filter(row => !row.deletedAt && row.subjectId === (kind === 'unit' ? parent.id : subject?.id) && row.parentId === (kind === 'unit' ? null : parent.id) && row.role === kind && row.name === path.at(-1))
        : []).sort((a, b) => a.order - b.order);
    const choice = Object.hasOwn(input.choices, key) ? input.choices[key] : undefined;
    let status: OutlineTablePreviewEntry['status'] = 'new', id: string | null = null;
    if (parent && ['choose', 'blocked'].includes(parent.status)) status = 'blocked';
    else if (candidates.length) {
      if (choice === 'new') status = 'new';
      else if (candidates.some(row => row.id === choice)) { status = 'reuse'; id = choice!; }
      else status = 'choose';
    } else if (choice && choice !== 'new') fail('연결하려던 기존 항목이 바뀌었습니다. 같은 이름의 항목을 다시 확인해 주세요.');
    const entry: OutlineTablePreviewEntry = { key, parentKey, subjectKey, name: path.at(-1)!, path, kind, status, id, candidates: candidates.map(row => ({ id: row.id, name: row.name })) };
    paths.set(key, entry); entries.push(entry);
  };
  for (const course of input.courses) {
    const courseName = cell(course);
    if (!Array.isArray(course.units)) fail('단원 입력칸을 확인해 주세요.');
    if (courseName) append([courseName], 'subject');
    for (const unit of course.units) {
      if (++rows > MAX_OUTLINE_ROWS) fail('단원과 주제 입력은 합계 500행까지 사용할 수 있습니다.');
      const unitName = cell(unit);
      if (!Array.isArray(unit.topics)) fail('주제 입력칸을 확인해 주세요.');
      if (unitName && !courseName) fail('단원을 담을 과목명을 적어 주세요.');
      if (unitName) append([courseName, unitName], 'unit');
      for (const topic of unit.topics) {
        if (++rows > MAX_OUTLINE_ROWS) fail('단원과 주제 입력은 합계 500행까지 사용할 수 있습니다.');
        const topicName = cell(topic);
        if (topicName && (!courseName || !unitName)) fail('주제를 담을 과목명과 단원명을 적어 주세요.');
        if (topicName) append([courseName, unitName, topicName], 'topic');
      }
    }
  }
  return { entries, ready: entries.length > 0 && entries.every(row => ['new', 'reuse'].includes(row.status)), newCount: entries.filter(row => row.status === 'new').length, reuseCount: entries.filter(row => row.status === 'reuse').length, expectedToken: outlineTableToken(state) };
}
