import { DomainError } from './model';
export interface MaterialQuizQuestion { id: string; question: string; options: string[]; correctIndex: number; explanation: string; sourceIds: string[]; }
export interface MaterialQuizAttempt {
  id: string; resultId: string; at: string; submittedAt: string | null;
  helpedQuestionIds?: string[];
  questions: MaterialQuizQuestion[]; answers: Record<string, number>;
}
export interface MaterialMap {
  nodes: { id: string; label: string; sourceIds: string[] }[];
  edges: { id: string; from: string; to: string; label: string; sourceIds: string[] }[];
  positions?: Record<string, { x: number; y: number }>;
}
const fail = () => { throw new DomainError('INVALID_MATERIAL', '퀴즈·개념도의 형식과 원문 근거를 확인해 주세요.'); };
export function validateQuiz(value: unknown, sourceIds?: Set<string>): asserts value is MaterialQuizQuestion[] {
  if (!Array.isArray(value) || value.length > 30) fail();
  const seen = new Set<string>();
  for (const q of value as MaterialQuizQuestion[]) {
    if (!q || typeof q.id !== 'string' || !q.id || q.id.length > 256 || seen.has(q.id) ||
      typeof q.question !== 'string' || !q.question.trim() || q.question.length > 4000 ||
      !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6 ||
      q.options.some(a => typeof a !== 'string' || !a.trim() || a.length > 4000) || new Set(q.options).size !== q.options.length ||
      !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length ||
      typeof q.explanation !== 'string' || !q.explanation.trim() || q.explanation.length > 10000 ||
      !Array.isArray(q.sourceIds) || !q.sourceIds.length || q.sourceIds.length > 50 || q.sourceIds.some(id => typeof id !== 'string' || sourceIds && !sourceIds.has(id))) fail();
    seen.add(q.id);
  }
}
export function validateMap(value: unknown, sourceIds: Set<string>): asserts value is MaterialMap {
  const map = value as MaterialMap;
  if (!map || !Array.isArray(map.nodes) || !map.nodes.length || map.nodes.length > 40 || !Array.isArray(map.edges) || map.edges.length > 80) fail();
  const ids = new Set<string>(), edges = new Set<string>();
  const refs = (v: unknown) => Array.isArray(v) && v.length > 0 && v.length <= 50 && v.every(id => sourceIds.has(id));
  for (const n of map.nodes) {
    if (typeof n.id !== 'string' || !n.id || n.id.length > 100 || ids.has(n.id) || typeof n.label !== 'string' || !n.label.trim() || n.label.length > 1000 || !refs(n.sourceIds)) fail();
    ids.add(n.id);
  }
  for (const e of map.edges) {
    if (typeof e.id !== 'string' || !e.id || e.id.length > 100 || ids.has(e.id) || edges.has(e.id) || !ids.has(e.from) || !ids.has(e.to) || e.from === e.to || typeof e.label !== 'string' || !e.label.trim() || e.label.length > 300 || !refs(e.sourceIds)) fail();
    edges.add(e.id);
  }
  for (const [id, p] of Object.entries(map.positions ?? {})) if (!ids.has(id) || !p || !Number.isFinite(p.x) || !Number.isFinite(p.y) || Math.abs(p.x) > 1e6 || Math.abs(p.y) > 1e6) fail();
}
export function validateQuizAttempts(attempts: MaterialQuizAttempt[]) {
  if (!Array.isArray(attempts) || attempts.length > 100) fail();
  const ids = new Set<string>();
  for (const a of attempts) {
    if (!a || typeof a.id !== 'string' || !a.id || ids.has(a.id) || a.id.length > 256 || typeof a.resultId !== 'string' || !a.answers || typeof a.answers !== 'object' || Array.isArray(a.answers) || !Number.isFinite(Date.parse(a.at)) || !(a.submittedAt === null || Number.isFinite(Date.parse(a.submittedAt)))) fail();
    ids.add(a.id); validateQuiz(a.questions);
    if (a.helpedQuestionIds !== undefined && (!Array.isArray(a.helpedQuestionIds) || a.helpedQuestionIds.some(id => !a.questions.some(q => q.id === id)))) fail();
    for (const [id, answer] of Object.entries(a.answers)) {
      const q = a.questions.find(q => q.id === id);
      if (!q || !Number.isInteger(answer) || answer < 0 || answer >= q.options.length) fail();
    }
  }
}
