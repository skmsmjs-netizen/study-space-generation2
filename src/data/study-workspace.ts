import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';

export const WORKSPACE_TOOLS = ['memo', 'math', 'code', 'record'] as const;
export type WorkspaceTool = (typeof WORKSPACE_TOOLS)[number];
export type DeskLayout = {
  open: boolean;
  tool: WorkspaceTool;
  width: number;
  pane: 'source' | 'tool';
  focus?: 'both' | 'source' | 'tool';
  codeExampleId?: string;
};
export type SavedWork = {
  id: string;
  name: string;
  route: string;
  layout: DeskLayout;
  savedAt: string;
};
export type WorkState = { version: 1; layouts: Record<string, DeskLayout>; saved: SavedWork[] };
export const DEFAULT_DESK: DeskLayout = { open: false, tool: 'memo', width: 52, pane: 'source' };
export const workStateKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `${storagePrefix(data)}:study-workspace:v1`;
export function isDeskLayout(value: unknown): value is DeskLayout {
  const v = value as DeskLayout | null;
  return (
    !!v &&
    typeof v.open === 'boolean' &&
    WORKSPACE_TOOLS.includes(v.tool) &&
    Number.isFinite(v.width) &&
    v.width >= 30 &&
    v.width <= 70 &&
    ['source', 'tool'].includes(v.pane) && (v.codeExampleId === undefined || typeof v.codeExampleId === 'string') &&
    (v.focus === undefined || ['both', 'source', 'tool'].includes(v.focus))
  );
}
export function isWorkState(value: unknown): value is WorkState {
  const v = value as WorkState | null;
  return (
    !!v &&
    v.version === 1 &&
    !!v.layouts &&
    typeof v.layouts === 'object' &&
    !Array.isArray(v.layouts) &&
    Object.entries(v.layouts).every(
      ([key, layout]) => key.startsWith('/') && isDeskLayout(layout),
    ) &&
    Array.isArray(v.saved) &&
    v.saved.every(
      (s) =>
        s &&
        typeof s.id === 'string' &&
        typeof s.name === 'string' &&
        typeof s.route === 'string' &&
        s.route.startsWith('/') &&
        typeof s.savedAt === 'string' &&
        isDeskLayout(s.layout),
    )
  );
}
export function readWorkState(key: string): { value: WorkState; error: string; raw: string | null } {
  const empty: WorkState = { version: 1, layouts: {}, saved: [] };
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
    if (raw === null) return { value: empty, error: '', raw };
    const parsed: unknown = JSON.parse(raw);
    if (!isWorkState(parsed)) throw new Error('invalid');
    return { value: parsed, error: '', raw };
  } catch {
    return {
      value: empty,
      raw,
      error: '작업 구성을 읽지 못했습니다. 기존 보관값은 유지했습니다. 다시 읽기를 눌러 주세요.',
    };
  }
}
/** The same-origin lock makes compare + replace atomic among cooperating app tabs. */
export async function writeWorkState(key: string, value: WorkState, expectedRaw: string | null) {
  if (!navigator.locks?.request) throw new Error('WORKSPACE_LOCK_UNAVAILABLE');
  return navigator.locks.request(key, () => {
    if (localStorage.getItem(key) !== expectedRaw) throw new Error('WORKSPACE_CHANGED');
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
    return raw;
  });
}
