import { useMemo, useState } from 'react';
import index from '../domain/linear-algebra-source-index.json';
import catalog from '../domain/linear-algebra-catalog.json';
import { Button, Input, Select } from './index';

export function LinearSourceIndex({selected,onSelect,onSource}:{selected:string;onSelect:(id:string)=>void;onSource:(pdf:number,id:string)=>void}) {
  const [query,setQuery]=useState(''),[section,setSection]=useState(''),[limit,setLimit]=useState(30);
  const matches=useMemo(()=>index.items.filter(i=>(!section||i.section===section)&&[i.title,i.section,i.id,...i.conceptIds.map(id=>catalog.concepts.find(c=>c.id===id)?.name??'')].join(' ').toLowerCase().includes(query.toLowerCase())),[query,section]);
  const currentErrata=index.errata.filter(e=>e.conceptId===selected);
  return <div className="linear-source-index">
    {currentErrata.length>0&&<details><summary>이 개념의 원문 표기 주의 {currentErrata.length}개</summary>{currentErrata.map(e=><div key={e.id} className="linear-source-item"><strong>{e.title}</strong><p className="prose">{e.note}</p><Button onClick={()=>onSource(e.pdf,e.id)}>해당 원문 펼치기</Button>{e.external&&<p className="prose">{e.external.role}: <a href={e.external.url} target="_blank" rel="noreferrer">{e.external.title}</a></p>}</div>)}</details>}
    <details>
      <summary>원문 항목별 연결 펼치기</summary>
      <p className="prose">{index.scopeNotice}</p>
      <Input label="원문 항목 찾기" value={query} onChange={e=>{setQuery(e.target.value);setLimit(30);}} />
      <Select label="원문 범위 선택" value={section} onChange={e=>{setSection(e.target.value);setLimit(30);}}><option value="">전체 범위</option>{catalog.sections.map(s=><option key={s.source_section} value={s.source_section}>{s.source_title}</option>)}</Select>
      <p role="status">연결 기록 {matches.length}개 · 제목 조각도 원래 ID로 보존한다.</p>
      <ul className="linear-source-items">{matches.slice(0,limit).map(i=><li key={i.id} className="linear-source-item"><strong>{i.title}</strong><p className="prose">{i.classification} · {i.reason}</p>{'conditions' in i&&<p className="prose">{i.conditions}</p>}<div className="actions">{i.conceptIds.map(id=><Button key={id} onClick={()=>onSelect(id)}>{catalog.concepts.find(c=>c.id===id)?.name??id} 관찰로</Button>)}<Button onClick={()=>onSource(i.pdf,i.id)}>해당 원문 펼치기</Button></div><details><summary>출처와 안정 ID</summary><p>{i.section} · 인쇄 {i.printed} · PDF {i.pdf}</p><p className="prose">{i.id}</p></details></li>)}</ul>
      {matches.length>limit&&<Button onClick={()=>setLimit(limit+30)}>다음 항목 펼치기</Button>}
      <details><summary>원문 표기 주의 전체 {index.errata.length}개</summary>{index.errata.map(e=><div className="linear-source-item" key={e.id}><strong>{e.title}</strong><p className="prose">{e.note}</p><div className="actions"><Button onClick={()=>onSelect(e.conceptId)}>관련 개념으로</Button><Button onClick={()=>onSource(e.pdf,e.id)}>해당 원문 펼치기</Button></div>{e.external&&<p className="prose">{e.external.role}: <a href={e.external.url} target="_blank" rel="noreferrer">{e.external.title}</a></p>}</div>)}</details>
    </details>
  </div>;
}
