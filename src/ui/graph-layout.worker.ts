import {
  layoutStudyGraph,
  type LayoutCard,
  type LayoutLink,
  type GraphLayoutOptions,
} from '../domain/graph-layout';
self.onmessage = (
  event: MessageEvent<{ cards: LayoutCard[]; links: LayoutLink[]; options: GraphLayoutOptions }>,
) => {
  try {
    self.postMessage({
      result: layoutStudyGraph(event.data.cards, event.data.links, event.data.options),
    });
  } catch {
    self.postMessage({ error: '관계 배치를 계산하지 못했습니다. 다시 맞추기를 눌러 주세요.' });
  }
};
