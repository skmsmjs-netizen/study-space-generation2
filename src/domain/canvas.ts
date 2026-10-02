import { DomainError, type AppState, type CanvasLayout, type CanvasLink, type CanvasPosition } from './model';
import { conceptText, isConceptMemo } from './canvas-concept';

export const CANVAS_ID = 'canvas:main';
export type CanvasContent = Pick<CanvasLayout, 'positions' | 'links' | 'viewport'>;
export const canvasKey = (kind: 'subject' | 'node' | 'memo' | 'narrative', id: string) => `${kind}:${id}`;
export interface CanvasCard { id: string; entityId: string; kind: 'subject' | 'unit' | 'outline' | 'topic' | 'memo' | 'narrative' | 'concept'; name: string; ownerId: string | null; position: CanvasPosition }

export function validateCanvasLayout(value: CanvasContent) {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control bytes in persisted IDs before layout validation.
  const validKey = (id: unknown): id is string => typeof id === 'string' && /^(subject|node|memo|narrative):.+/.test(id) && id.length <= 300 && !/[\u0000-\u001f]/.test(id);
  const position = (p: CanvasPosition) => p && Number.isFinite(p.x) && Number.isFinite(p.y) && Math.abs(p.x) <= 1e7 && Math.abs(p.y) <= 1e7;
  if (!value.positions || typeof value.positions !== 'object' || Array.isArray(value.positions) || !Object.entries(value.positions).every(([id, p]) => validKey(id) && position(p)) || !Array.isArray(value.links)) throw new DomainError('INVALID_CANVAS', 'Canvas 배치와 연결을 확인해 주세요. 원문은 유지했습니다.');
  const ids = new Set<string>();
  for (const link of value.links) {
    if (!link || typeof link.id !== 'string' || !link.id.trim() || link.id.length > 256 || ids.has(link.id) || link.id.startsWith('auto:') || !validKey(link.source) || !validKey(link.target) || typeof link.label !== 'string' || link.label.length > 300) throw new DomainError('INVALID_CANVAS', 'Canvas 연결의 식별자와 원문을 확인해 주세요.');
    ids.add(link.id);
  }
  if (value.viewport && (!position(value.viewport) || !Number.isFinite(value.viewport.zoom) || value.viewport.zoom < .1 || value.viewport.zoom > 2)) throw new DomainError('INVALID_CANVAS', 'Canvas 확대 위치를 확인해 주세요.');
}

/** Read projection, never a second copy of study text. Hidden cards keep their saved geometry. */
export function projectCanvas(state: AppState, subjectIds?: readonly string[], layout: CanvasContent | undefined = state.canvasLayouts?.find(row => row.id === CANVAS_ID && !row.deletedAt), includeUnscopedConcepts = true): { cards: CanvasCard[]; links: CanvasLink[] } {
  const cards: CanvasCard[] = [], links: CanvasLink[] = [];
  const positions = layout?.positions ?? {};
  const occupied = Object.values(positions).map(p => ({ ...p }));
  let row = 0;
  const autoLink = (source: string, target: string, label: string) => links.push({ id: `auto:${target}`, source, target, label });
  const add = (card: Omit<CanvasCard, 'position'>, depth: number) => {
    let position = positions[card.id];
    if (!position) {
      position = { x: depth * 370, y: row * 350 };
      while (occupied.some(p => Math.abs(p.x - position.x) < 340 && Math.abs(p.y - position.y) < 320)) position = { ...position, y: position.y + 350 };
      occupied.push(position);
    }
    cards.push({ ...card, position });
  };
  const notes = (ownerId: string, parent: string, depth: number) => {
    for (const memo of (state.memos ?? []).filter(m => !m.deletedAt && m.ownerId === ownerId && !isConceptMemo(m))) {
      const id = canvasKey('memo', memo.id);
      add({ id, entityId: memo.id, kind: 'memo', name: '내 설명', ownerId }, depth);
      autoLink(parent, id, '내 설명');
      row++;
    }
    for (const note of state.narratives.filter(n => !n.deletedAt && n.ownerId === ownerId && n.body.trim())) {
      const id = canvasKey('narrative', note.id);
      add({ id, entityId: note.id, kind: 'narrative', name: note.kind === 'subject-overview' ? '과목 개요' : note.kind === 'unit-introduction' ? '단원 서문' : '내 메모', ownerId }, depth);
      autoLink(parent, id, note.kind === 'subject-overview' ? '개요' : note.kind === 'unit-introduction' ? '서문' : '내 메모');
      row++;
    }
  };
  const visit = (subjectId: string, parentId: string | null, parentKey: string, depth: number) => {
    for (const node of state.nodes.filter(n => !n.deletedAt && n.subjectId === subjectId && n.parentId === parentId).sort((a, b) => a.order - b.order)) {
      const id = canvasKey('node', node.id);
      add({ id, entityId: node.id, kind: node.role, name: node.name, ownerId: subjectId }, depth);
      autoLink(parentKey, id, '목차');
      notes(node.id, id, depth + 1);
      visit(subjectId, node.id, id, depth + 1);
      if (!state.nodes.some(child => !child.deletedAt && child.parentId === node.id)) row++;
    }
  };
  for (const subject of state.subjects.filter(s => !s.deletedAt && (!subjectIds || subjectIds.includes(s.id))).sort((a, b) => a.order - b.order)) {
    const id = canvasKey('subject', subject.id);
    add({ id, entityId: subject.id, kind: 'subject', name: subject.name, ownerId: null }, 0);
    notes(subject.id, id, 1); visit(subject.id, null, id, 1);
    row++;
  }
  const visible = new Set(cards.map(card => card.id));
  for (const memo of (state.memos ?? []).filter(m => !m.deletedAt && isConceptMemo(m) && (m.ownerId === null ? includeUnscopedConcepts : visible.has(canvasKey('subject', m.ownerId)) || visible.has(canvasKey('node', m.ownerId))))) {
    const id = canvasKey('memo', memo.id);
    add({ id, entityId: memo.id, kind: 'concept', name: conceptText(memo.body).name || '개념', ownerId: memo.ownerId }, 0);
    visible.add(id); row++;
  }
  return { cards, links: [...links, ...(layout?.links ?? []).filter(link => visible.has(link.source) && visible.has(link.target))] };
}
