import evidence from './physics-section-evidence.json';
import concepts from './physics-concept-observations.json';
export const physicsSectionEvidence=evidence;
export const physicsConceptReadings=concepts;
export const physicsSectionRange=(id:string)=>evidence.find(s=>s.id===id);
export const physicsConceptReading=(id:string)=>concepts.find(s=>s.id===id);

import items from './physics-source-items.json';
export const physicsSourceItems=items;
export const physicsSectionItems=(id:string)=>items.filter(item=>item.sections.includes(id));
import pages from './physics-page-evidence.json';
import links from './physics-source-links.json';
export const physicsPageEvidence=pages;
export const physicsSourceLinks=links;
export const physicsSectionSourceLinks=(id:string)=>links.filter(item=>item.section===id);
export function physicsPageLabel(pdf:number){
 const page=pages[pdf-1];
 return `${page?.printed!==null&&page?.printed!==undefined?`책 ${page.printed}쪽`:page?.printedRoman?`책 ${page.printedRoman}쪽`:'책 쪽번호 미확인'} · PDF ${pdf}쪽`;
}
