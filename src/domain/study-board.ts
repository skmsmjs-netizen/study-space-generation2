import { DomainError, type Entity, type AppState } from './model';
export interface BoardColumn {
  id: string;
  title: string;
}
export interface BoardCard {
  id: string;
  columnId: string;
  title: string;
  body: string;
  topicId: string | null;
  archived: boolean;
}
export interface BoardContent {
  title: string;
  columns: BoardColumn[];
  cards: BoardCard[];
}
export interface StudyBoard extends Entity, BoardContent {}
export const BOARD_ID = 'board:main';
export function freshBoard(): BoardContent {
  return {
    title: '내 공부 보드',
    columns: [
      { id: 'to-do', title: '할 일' },
      { id: 'in-progress', title: '하고 있음' },
      { id: 'finished', title: '마침' },
    ],
    cards: [],
  };
}
export function boardContent(row: BoardContent): BoardContent {
  return { title: row.title, columns: row.columns, cards: row.cards };
}
export function validateBoard(value: unknown): asserts value is BoardContent {
  const row = value as BoardContent | null;
  const fail = (): never => {
    throw new DomainError(
      'INVALID_BOARD',
      '보드의 열과 카드를 확인해 주세요. 작성한 글은 유지했습니다.',
    );
  };
  const id = (v: unknown): v is string =>
    typeof v === 'string' && Boolean(v.trim()) && v.length <= 256;
  const title = (v: unknown): v is string =>
    typeof v === 'string' && Boolean(v.trim()) && v.length <= 1000;
  if (
    !row ||
    !title(row.title) ||
    !Array.isArray(row.columns) ||
    row.columns.length < 1 ||
    row.columns.length > 100 ||
    !Array.isArray(row.cards) ||
    row.cards.length > 10000
  )
    return fail();
  const columns = new Set<string>(),
    cards = new Set<string>();
  for (const col of row.columns) {
    if (!col || !id(col.id) || columns.has(col.id) || !title(col.title)) return fail();
    columns.add(col.id);
  }
  for (const card of row.cards) {
    if (
      !card ||
      !id(card.id) ||
      cards.has(card.id) ||
      !columns.has(card.columnId) ||
      !title(card.title) ||
      typeof card.body !== 'string' ||
      card.body.length > 200000 ||
      (card.topicId !== null && !id(card.topicId)) ||
      typeof card.archived !== 'boolean'
    )
      return fail();
    cards.add(card.id);
  }
}
/** Array order is the user's order; filtering never renumbers or removes hidden cards. */
export function moveBoardCard(
  content: BoardContent,
  cardId: string,
  columnId: string,
  beforeId?: string,
): BoardContent {
  if (!content.columns.some((c) => c.id === columnId))
    throw new DomainError('INVALID_BOARD', '옮길 열을 확인해 주세요.');
  const card = content.cards.find((c) => c.id === cardId);
  if (!card || beforeId === cardId) return content;
  const cards = content.cards.filter((c) => c.id !== cardId);
  const before = beforeId
    ? cards.findIndex(
        (c) => c.id === beforeId && c.columnId === columnId && c.archived === card.archived,
      )
    : -1;
  cards.splice(before < 0 ? cards.length : before, 0, { ...card, columnId });
  return { ...content, cards };
}
export function verifyBoardTopics(content: BoardContent, state: AppState) {
  for (const card of content.cards)
    if (
      card.topicId !== null &&
      !state.nodes.some((n) => n.id === card.topicId && n.role === 'topic')
    )
      throw new DomainError(
        'INVALID_BOARD_TOPIC',
        '카드에 연결한 원래 주제를 찾을 수 없습니다. 글은 유지했습니다.',
      );
}
