import {CHEMISTRY,type ChemistrySection} from './catalog';
import type {ConceptVisual} from '../concept-production';

/** Real concept identities and authored one-hop edges; UI roles are not chemistry concepts. */
export function sectionKnowledgeVisual(section:ChemistrySection):ConceptVisual {
 const diagram=CHEMISTRY.diagrams.find(d=>d.id===section.map_id);
 const edges=relationshipsForSection(section);
 const ids=new Set([...section.concept_candidates,...edges.flatMap(e=>[e.from,e.to])]);
 const nodes=diagram?Object.values(diagram.nodes).filter(n=>ids.has(n.id)).map(n=>({id:n.id,label:n.name,detail:n.role})):[];
 return {kind:'relation',label:section.name,nodes:nodes.length?nodes:[{id:section.id,label:section.name,detail:section.new_content}],
  relations:edges.map(e=>({from:e.from,to:e.to,label:e.label})),highlighted:section.concept_candidates};
}

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
