import type { AppState } from '../domain/model';
import {
  defaultTemplate,
  isMathTemplate,
  TEMPLATE_KINDS,
  type MathTemplate,
} from '../domain/math-templates';
import { storagePrefix } from './repository';
import { readRescuedDraft, storeDraftSafely } from './draft-safety';
import { decodeStoredText, encodeStoredText } from './storage-codec';

export interface TemplateWorkspace {
  version: 1;
  active: string;
  entries: MathTemplate[];
}
export const freshTemplateWorkspace = (): TemplateWorkspace => ({
  version: 1,
  active: 'builtin-surface',
  entries: TEMPLATE_KINDS.map(defaultTemplate),
});
export function templateDraftKey(data: Pick<AppState, 'namespace' | 'userId'>) {
  return `${storagePrefix(data)}:math-templates:draft:v1`;
}
export function isTemplateWorkspace(value: unknown): value is TemplateWorkspace {
  if (!value || typeof value !== 'object') return false;
  const v = value as TemplateWorkspace;
  return (
    v.version === 1 &&
    Array.isArray(v.entries) &&
    v.entries.length > 0 &&
    v.entries.length <= 500 &&
    v.entries.every(isMathTemplate) &&
    new Set(v.entries.map((e) => e.id)).size === v.entries.length &&
    v.entries.some((e) => e.id === v.active)
  );
}
export function readTemplateWorkspace(key: string): TemplateWorkspace {
  const raw = readRescuedDraft(key) ?? localStorage.getItem(key);
  if (raw === null) return freshTemplateWorkspace();
  const value: unknown = JSON.parse(decodeStoredText(raw));
  if (!isTemplateWorkspace(value))
    throw Error('내용 초안을 읽지 못했습니다. 저장된 원문을 유지했습니다.');
  return value;
}
export function writeTemplateWorkspace(key: string, value: TemplateWorkspace) {
  if (!isTemplateWorkspace(value)) throw Error('내용 초안의 형식을 확인해 주세요.');
  storeDraftSafely(key, encodeStoredText(JSON.stringify(value)));
}
