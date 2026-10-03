import {relationshipsForSection} from '../domain/chemistry/relationships';
import type {ChemistrySection} from '../domain/chemistry/catalog';
import type {ChemistryView} from '../data/chemistry-observation';
import type {AppState} from '../domain/model';
import {Button,Select} from './index';
import {KnowledgeStructure} from './knowledge-structure';

export function ChemistryRelationships({section,data,value,update,onSource}:{section:ChemistrySection;data:AppState;value:ChemistryView['views'][string];update:(v:Partial<ChemistryView['views'][string]>)=>void;onSource:()=>void}) {
 const relations=relationshipsForSection(section);
 if(!relations.length)return <section data-observation-region="reasoning"><h4>정의와 적용 범위 읽기</h4><p className="prose">{section.new_content}</p><p className="prose">{section.conditions}</p><p className="prose">이 항목에는 현재 확인된 지도 관계가 없다. 관계를 추정해서 연결하지 않는다.</p></section>;
 const index=Math.min(value.step,relations.length-1),edge=relations[index];
 return <article className="chem-calculation" data-relationship-section={section.section}>
  <header><h4>관계 탐색 · {section.name}</h4><p className="prose">{section.question}</p></header>
  <div className="chem-observation-grid"><section data-observation-region="visual"><KnowledgeStructure data={data} viewKey={`${section.id}:relation:${edge.id}`} visual={{kind:'relation',label:'같은 관계를 구조와 문장으로 읽기',nodes:[edge.fromConcept,edge.toConcept].map(n=>({id:n.id,label:n.name,detail:n.role})),relations:[{from:edge.from,to:edge.to,label:edge.label}],highlighted:section.concept_candidates}}/></section>
  <section data-observation-region="controls"><Select label="살펴볼 개념 관계" value={String(index)} onChange={e=>update({step:Number(e.target.value)})}>{relations.map((r,i)=><option key={r.id} value={String(i)}>{r.fromConcept.name} → {r.toConcept.name}</option>)}</Select><div data-observation-region="readout"><p className="prose">관계의 뜻: {edge.label}</p><p>관계 유형: {edge.type}</p><p className="prose">{edge.provenance_kind}. 역방향 복원이 자동으로 성립한다고 주장하지 않는다.</p></div><Button onClick={()=>update({step:0})}>관계 선택만 초기화</Button><Button onClick={onSource}>이 질문의 원문 위치</Button></section></div>
  <section data-observation-region="reasoning"><h5>현재 항목의 조건과 차이</h5><p className="prose">{section.conditions}</p><p className="prose">선행: {section.prerequisites}. 다시 사용: {section.connections}.</p><p className="prose">관계 선택은 볼 대상을 바꾼다. 교재의 조건·개념·개인 좌표를 바꾸거나 새로운 계산·증명을 수행하지 않는다.</p></section>
  <details data-observation-region="reference"><summary>이 관계를 사용하는 다른 항목</summary>{edge.relatedSections.length?edge.relatedSections.map(s=><section key={s.id}><h5>{s.name}</h5><p className="prose">{s.new_content}</p><p className="prose">조건·예외: {s.conditions}</p></section>):<p>현재 목록에서 같은 관계에 대응한 다른 항목은 없다.</p>}<p>원자료 항목 ID: {section.id}. 관계 ID: {edge.id}. 관측 유형과 배치는 설계 제안이다.</p></details>
 </article>;
}
