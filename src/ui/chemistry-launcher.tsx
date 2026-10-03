import {lazy, Suspense, useState, useEffect} from 'react';
import {navigate} from './navigation-context';
import {chemistryViewKey} from '../data/chemistry-observation';
import type {AppState} from '../domain/model';
import type {StudyRepository} from '../data/repository';
import {Button, Modal, LoadingState} from './index';
const ChemistryObservatory=lazy(()=>import('./chemistry-observatory').then(m=>({default:m.ChemistryObservatory})));
export function ChemistryLauncher({data,repository,onSaved,place='west',onOpenChange}:{data:AppState;repository:StudyRepository;onSaved:(next:AppState)=>void;place?:'west'|'east';onOpenChange?:(open:boolean)=>void}) {
 const resumeKey=chemistryViewKey(data)+':entry';
 const [open,setOpen]=useState(()=>{try{const entry=sessionStorage.getItem(resumeKey);if(entry===place){return true;}}catch{/* Direct entry remains available if navigation hints cannot be retained. */}return false;});
 useEffect(()=>{onOpenChange?.(open);},[open,onOpenChange]);
 useEffect(()=>{if(open){try{if(sessionStorage.getItem(resumeKey)===place)sessionStorage.removeItem(resumeKey);}catch{/* The visible route remains usable without a navigation hint. */}}},[open,place,resumeKey]);
 function move(target:'west'|'east'){try{sessionStorage.setItem(resumeKey,target);}catch{/* No scientific or user text is stored in this view hint. */}setOpen(false);navigate(target==='east'?'/math':'/concepts');}
 return <><Button onClick={()=>setOpen(true)}>{place==='west'?'일반화학 · 교재와 관찰 열기':'일반화학 · 관찰 도구 열기'}</Button><Modal open={open} title="일반화학 · 교재와 관찰" onClose={()=>setOpen(false)} className="chemistry-dialog"><Suspense fallback={<LoadingState message="일반화학 자료를 여는 중입니다."/>}><ChemistryObservatory data={data} repository={repository} onSaved={onSaved} place={place} onMove={move}/></Suspense></Modal></>;
}
