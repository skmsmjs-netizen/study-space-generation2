import { parseConceptSource, validateConceptEdition, type ConceptCatalog, type ConceptEditionContent } from '../domain/concept-production';
import { conceptHash } from './concept-production';

export const BUNDLED_CONCEPT_CATALOG = 'built-in:concept-reading-pack';
export interface ConceptReadingPack {
  format: 'concept-reading-pack';
  version: 1;
  sourceSha256: string;
  canonicalSha256: string;
  payloadSha256: string;
  catalog: Pick<ConceptCatalog, 'id' | 'raw' | 'sha256' | 'filename'>;
  editions: (ConceptEditionContent & { id: string; version: number })[];
}
export async function loadConceptReadingPack(): Promise<ConceptReadingPack | null> {
  const module = await import('virtual:concept-reading-pack');
  const pack = module.default as ConceptReadingPack | null;
  if (!pack) return null;
  if (pack.format !== 'concept-reading-pack' || pack.version !== 1 || !Array.isArray(pack.editions)
    || pack.catalog.sha256 !== pack.sourceSha256
    || await conceptHash(pack.catalog.raw) !== pack.sourceSha256
    || await conceptHash(JSON.stringify({ catalog: pack.catalog, editions: pack.editions })) !== pack.payloadSha256)
    throw Error('개념 전집의 원문과 읽기 묶음이 일치하지 않습니다.');
  const ids = new Set(parseConceptSource(pack.catalog.raw).items.map(item => item.id));
  if (pack.editions.length !== ids.size) throw Error('개념 전집에 누락된 설명이 있습니다.');
  for (const edition of pack.editions) {
    if (!ids.delete(edition.sourceId) || edition.catalogId !== pack.catalog.id || edition.status !== 'published' || !edition.screen)
      throw Error('개념 전집의 식별자 또는 읽기 판본이 일치하지 않습니다.');
    validateConceptEdition(edition);
  }
  return pack;
}
