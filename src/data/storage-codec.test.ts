// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { encodeStoredText, decodeStoredText } from './storage-codec';
import { DemoRepository, DEMO_KEY } from './demo-repository';
import { applyCommand } from '../domain/commands';
import { createDemoState } from '../domain/fixtures';
import type { MemoStroke } from '../domain/model';

describe('lossless storage quota repair', () => {
  it('retains exact whitespace, Unicode, raw surrogates and decimal coordinates', () => {
    const raw = ('  한글\r\n\t\0😀\ud800\udfff ' + JSON.stringify({x: 1.23456789012345, pressure: 0.3333333333333})).repeat(1500);
    const stored = encodeStoredText(raw);
    expect(stored.length).toBeLessThan(raw.length / 4);
    expect(decodeStoredText(stored)).toBe(raw);
    expect(decodeStoredText('{broken legacy')).toBe('{broken legacy');
  });
  it('migrates a full legacy envelope atomically without deleting revisions or operations, then saves under the same quota', () => {
    let data = createDemoState();
    const strokes: MemoStroke[] = [];
    for (let i = 0; i < 14; i++) {
      strokes.push({id:`stroke-${i}`,ink:'ink',width:3.5,points:Array.from({length:400},(_,j)=>({x:(j * 1.1734567)%900,y:(j * 2.9876543)%600,pressure:0.456789123}))});
      data = applyCommand(data,{type:'saveMemo',id:'quota-memo',ownerId:null,body:' 원문\r\n ',strokes:structuredClone(strokes),expectedVersion:i,opId:`op-${i}`,at:`2026-09-30T12:00:${String(i).padStart(2,'0')}.000Z`,userId:data.userId,namespace:data.namespace});
    }
    const raw = JSON.stringify({sequence:14,data});
    let value = raw;
    const storage = {getItem:()=>value,setItem:(_key:string,next:string)=>{if(next.length>raw.length) throw new DOMException('quota','QuotaExceededError');value=next;}};
    const repo = new DemoRepository(storage);
    expect(decodeStoredText(value)).toBe(raw);
    expect(value.length).toBeLessThan(raw.length/4);
    const next = repo.execute({type:'saveMemo',id:'quota-memo',ownerId:null,body:' 原文\r\n次 ',strokes,expectedVersion:14,opId:'next',at:'2026-09-30T12:01:00.000Z',userId:data.userId,namespace:data.namespace});
    expect(next.revisions.length).toBe(data.revisions.length+1);
    expect(next.appliedOps).toMatchObject(data.appliedOps);
    expect(new DemoRepository(storage).getSnapshot()).toEqual(next);
    expect(DEMO_KEY).toBe('study-space:demo:v1');
  }, 60_000); // Preservation check for a large ledger, not a latency budget.
  it('does not erase readable legacy data when compaction fails', () => {
    const data = createDemoState(); data.narratives.push({id:'large',userId:data.userId,namespace:data.namespace,kind:'free-note',ownerId:null,body:'원문'.repeat(30000),version:1,createdAt:'2026-09-30',updatedAt:'2026-09-30',deletedAt:null});
    const raw = JSON.stringify({sequence:0,data});
    const storage = {getItem:()=>raw,setItem:()=>{throw Error('quota');}};
    expect(new DemoRepository(storage).getSnapshot()).toEqual(data);
    expect(storage.getItem()).toBe(raw);
  });
});
