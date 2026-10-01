import type { MaterialResult, MaterialContent } from '../domain/study-material';
import { CANVAS_ID, canvasKey } from '../domain/canvas';
import { CONCEPT_MEMO_PREFIX } from '../domain/canvas-concept';
import type { StudyRepository } from './repository';
/** Explicit copy into existing concepts, stable identifiers and no overwrite on retry. */
export async function addMaterialMapToCanvas(repository: StudyRepository, material: MaterialContent, result: MaterialResult) {
  if (!result.map) throw Error('추가할 개념도가 없습니다.');
  let state = repository.getSnapshot();
  if (state.namespace === 'personal' && (!repository.getCapabilities?.().includes('saveMemo') || !repository.getCapabilities?.().includes('saveCanvasLayout'))) throw Error('Canvas에 저장할 연결을 확인해 주세요. 자료의 개념도는 유지했습니다.');
  const ctx = () => ({ userId: state.userId, namespace: state.namespace, at: new Date().toISOString(), opId: crypto.randomUUID() });
  const memoId = (id: string) => `${CONCEPT_MEMO_PREFIX}material:${result.id}:${id}`;
  for (const node of result.map.nodes) {
    if (state.memos?.some(m => m.id === memoId(node.id))) continue;
    const sources = node.sourceIds.map(id => result.segments.find(s => s.id === id)).filter(s => s !== undefined).map(s => `${s.label ?? s.id}\n${s.text}`).join('\n\n');
    state = repository.execute({ ...ctx(), type: 'saveMemo', id: memoId(node.id), ownerId: material.topicId ?? material.subjectId, body: `${node.label.replace(/[\r\n]/g, ' ')}\n자료: ${material.title}\n생성 결과: ${result.id}\n\n원문 근거\n${sources}`, strokes: [], expectedVersion: 0 });
  }
  const layout = state.canvasLayouts?.find(l => l.id === CANVAS_ID && !l.deletedAt);
  const positions = { ...layout?.positions }, links = [...layout?.links ?? []];
  const right = Object.values(positions).reduce((x, p) => Math.max(x, p.x), 0) + 400;
  result.map.nodes.forEach((node, index) => { const key = canvasKey('memo', memoId(node.id)); if (!positions[key]) positions[key] = { x: right + (result.map!.positions?.[node.id]?.x ?? index % 4 * 370), y: result.map!.positions?.[node.id]?.y ?? Math.floor(index / 4) * 350 }; });
  for (const edge of result.map.edges) {
    const id = `material:${result.id}:${edge.id}`;
    if (!links.some(l => l.id === id)) links.push({ id, source: canvasKey('memo', memoId(edge.from)), target: canvasKey('memo', memoId(edge.to)), label: edge.label });
  }
  state = repository.execute({ ...ctx(), type: 'saveCanvasLayout', id: CANVAS_ID, positions, links, ...(layout?.viewport ? { viewport: layout.viewport } : {}), expectedVersion: layout?.version ?? 0 });
  await repository.flush?.();
  if (state.namespace === 'personal' && repository.getStatus?.().phase !== 'saved') throw Error('Canvas 내용을 이 기기에 보관했습니다. 서버 연결 후 다시 추가하면 중복 없이 저장을 재시도합니다.');
  return repository.getSnapshot();
}
