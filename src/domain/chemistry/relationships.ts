import {CHEMISTRY,type ChemistrySection} from './catalog';

/** Editorial map relations are references, not inferred causal or equivalent laws. */
export function relationshipsForSection(section:ChemistrySection) {
 const diagram=CHEMISTRY.diagrams.find(d=>d.id===section.map_id);
 if(!diagram)return [];
 return diagram.edges.filter(edge=>section.concept_candidates.includes(edge.from)||section.concept_candidates.includes(edge.to)).map(edge=>({
  ...edge,
  fromConcept:Object.values(diagram.nodes).find(n=>n.id===edge.from)!,
  toConcept:Object.values(diagram.nodes).find(n=>n.id===edge.to)!,
  relatedSections:CHEMISTRY.sections.filter(s=>s.id!==section.id&&(s.concept_candidates.includes(edge.from)||s.concept_candidates.includes(edge.to))),
 })).filter(edge=>edge.fromConcept&&edge.toConcept);
}
