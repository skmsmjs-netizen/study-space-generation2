import type { AppState } from './model';
import { recallPath } from './topic-recall';
import { recallDay } from './recall-scheduler';
/** Only actual, active review histories; each cross-day outcome becomes a training item. */
export function recallTraining(data: AppState) {
  const allowed = new Set(data.nodes.filter(node => !node.deletedAt && node.role === 'topic' && recallPath(data.nodes, node.id).every(parent => !parent.deletedAt) && data.subjects.some(s => !s.deletedAt && s.id === node.subjectId)).map(node => node.id));
  const cards = (data.recallCards ?? []).filter(card => !card.deletedAt && allowed.has(card.topicId));
  const ratings: number[] = [], deltaTs: number[] = [], lengths: number[] = [];
  let reviews = 0;
  for (const card of cards) {
    const history: { rating: number; delta: number }[] = [];
    for (let i = 0; i < card.reviews.length; i++) {
      const row = card.reviews[i]; reviews++;
      const day = (at: string) => Date.parse(`${recallDay(at)}T00:00:00Z`);
      const delta = i ? Math.max(0, Math.round((day(row.at) - day(card.reviews[i - 1].at)) / 86400000)) : 0;
      history.push({ rating: row.rating, delta });
      if (delta > 0) { lengths.push(history.length); for (const h of history) { ratings.push(h.rating); deltaTs.push(h.delta); } }
    }
  }
  return { ratings, deltaTs, lengths, reviews, fingerprint: JSON.stringify(cards.map(card => [card.id, card.reviews.map(row => [row.id, row.at, row.rating])])) };
}
