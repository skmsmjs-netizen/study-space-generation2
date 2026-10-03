import {describe,it,expect} from 'vitest';
import {CHEMISTRY,byNumber,mapping} from './catalog';
import {relationshipsForSection} from './relationships';
describe('source-grounded chemistry relations',()=>{
 it('retains the difference between catalysis and equilibrium composition',()=>{
  const edges=relationshipsForSection(byNumber('14.9')!);
  expect(edges.some(e=>e.label==='평형 도달을 빠르게 함')).toBe(true);
  expect(edges.every(e=>!e.bidirectional_claim)).toBe(true);
 });
 it('binds every reference section to existing relation and source IDs without fabricating edges',()=>{
  const refs=CHEMISTRY.sections.filter(s=>mapping(s).kind==='reference');
  expect(refs).toHaveLength(132);
  const ids=new Set(CHEMISTRY.diagrams.flatMap(d=>d.edges.map(e=>e.id)));
  for(const s of refs){const edges=relationshipsForSection(s);expect(edges.length,s.section).toBeGreaterThan(0);for(const e of edges){expect(ids.has(e.id)).toBe(true);expect(e.relatedSections.every(r=>r.id!==s.id)).toBe(true);}}
 });
});
