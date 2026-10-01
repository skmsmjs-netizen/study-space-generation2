import { validateCanvasLayout, type CanvasCard, type CanvasContent } from './canvas';
import type { AppState } from './model';

export function canvasLayoutFile(
  owner: Pick<AppState, 'namespace' | 'userId'>,
  content: CanvasContent,
) {
  return JSON.stringify(
    {
      kind: 'manseeksong-canvas-layout',
      version: 1,
      namespace: owner.namespace,
      userId: owner.userId,
      content,
    },
    null,
    2,
  );
}
export function parseCanvasLayoutFile(text: string, data: AppState): CanvasContent {
  if (text.length > 2_000_000)
    throw Error('배치 파일이 너무 큽니다. 2MB 이내의 배치 JSON을 선택해 주세요.');
  const file = JSON.parse(text);
  if (
    file?.kind !== 'manseeksong-canvas-layout' ||
    file.version !== 1 ||
    file.namespace !== data.namespace ||
    file.userId !== data.userId
  )
    throw Error(
      '이 공부 공간에서 내보낸 배치 파일을 선택해 주세요. 다른 공간의 원문은 배치 파일로 가져오지 않습니다.',
    );
  if (!file.content || typeof file.content !== 'object')
    throw Error('배치와 연결 내용이 없는 파일입니다. 내보낸 배치 JSON을 선택해 주세요.');
  validateCanvasLayout(file.content);
  const ids = new Set([
    ...data.subjects.map((row) => `subject:${row.id}`),
    ...data.nodes.map((row) => `node:${row.id}`),
    ...(data.memos ?? []).map((row) => `memo:${row.id}`),
    ...data.narratives.map((row) => `narrative:${row.id}`),
  ]);
  if (
    Object.keys(file.content.positions).some((id) => !ids.has(id)) ||
    file.content.links.some(
      (link: { source: string; target: string }) => !ids.has(link.source) || !ids.has(link.target),
    )
  )
    throw Error(
      '현재 기록에 없는 카드 ID가 있습니다. 원문 기록을 먼저 복원한 뒤 배치를 가져와 주세요.',
    );
  return structuredClone(file.content);
}
const xml = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char] ?? char,
  );
/** Portable vector diagram. Text is escaped, complete, and never interpreted as HTML. */
export function canvasDiagramSvg(cards: readonly CanvasCard[], content: CanvasContent) {
  const rows = cards.map((card) => ({
    ...card,
    position: content.positions[card.id] ?? card.position,
    lines: Array.from(card.name).reduce<string[]>((lines, char, index) => {
      const row = Math.floor(index / 18);
      lines[row] = (lines[row] ?? '') + char;
      return lines;
    }, []),
  }));
  const boxes = new Map(
    rows.map((row) => [
      row.id,
      { ...row.position, height: Math.max(76, row.lines.length * 24 + 40) },
    ]),
  );
  const minX = Math.min(0, ...rows.map((row) => row.position.x)) - 64,
    minY = Math.min(0, ...rows.map((row) => row.position.y)) - 64;
  const maxX = Math.max(300, ...rows.map((row) => row.position.x + 300)) + 64,
    maxY =
      Math.max(180, ...rows.map((row) => row.position.y + (boxes.get(row.id)?.height ?? 76))) + 64;
  const edges = content.links
    .flatMap((link) => {
      const from = boxes.get(link.source),
        to = boxes.get(link.target);
      if (!from || !to) return [];
      const x1 = from.x + 300,
        y1 = from.y + from.height / 2,
        x2 = to.x,
        y2 = to.y + to.height / 2;
      return [
        `<g><path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#777"${link.id.startsWith('auto:') ? ' stroke-dasharray="5 4"' : ' marker-end="url(#arrow)"'}/><text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}" font-size="14" paint-order="stroke" stroke="white" stroke-width="4" stroke-linejoin="round">${xml(link.label)}</text></g>`,
      ];
    })
    .join('');
  const nodes = rows
    .map(
      (row) =>
        `<g><rect x="${row.position.x}" y="${row.position.y}" width="300" height="${boxes.get(row.id)?.height ?? 76}" rx="6" fill="white" stroke="#aaa"/><text x="${row.position.x + 16}" y="${row.position.y + 30}" font-size="18">${row.lines.map((line, index) => `<tspan x="${row.position.x + 16}" dy="${index ? 24 : 0}">${xml(line)}</tspan>`).join('')}</text></g>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" role="img" aria-label="ManSeekSong OS 카드 관계도"><title>카드 이름과 목차·직접 저장한 관계</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#777"/></marker></defs><g font-family="sans-serif" fill="#222">${edges}${nodes}</g></svg>`;
}
