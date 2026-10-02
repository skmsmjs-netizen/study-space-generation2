import { parseConceptSource } from './concept-production';

/** Distribution contains the seven source fields used by the reading/editor contract. */
export function projectPublishedConceptSource(raw: string): string {
  return JSON.stringify({ items: parseConceptSource(raw).items.map(item => ({
    id: item.id, name: item.name, def: item.def, ex: item.ex,
    insight: item.insight, type: item.type, cat: item.cat,
  })) });
}
