// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { encodeStoredText, decodeStoredText } from './storage-codec';
import { DemoRepository, DEMO_KEY } from './demo-repository';
import { applyCommand } from '../domain/commands';
import { createDemoState } from '../domain/fixtures';
import type { MemoStroke } from '../domain/model';
import LZString from 'lz-string';
import { gzipSync } from 'fflate';

describe('lossless storage quota repair', () => {
  it('produces the same durable representation after reopening on another day', () => {
    vi.useFakeTimers();
    try {
      const raw = '그대로 보존할 원문\ud800 '.repeat(4000);
      vi.setSystemTime(new Date('2026-10-01T00:00:00Z')); const first = encodeStoredText(raw);
      vi.setSystemTime(new Date('2026-10-02T00:00:00Z')); expect(encodeStoredText(raw)).toBe(first);
      expect(encodeStoredText(decodeStoredText(first))).toBe(first);
    } finally { vi.useRealTimers(); }
  });
  it('reads the previous compressed format and rejects damaged new content without replacing it', () => {
    const raw = '  예전 원문\ud800\u0000\r\n끝 공백  '.repeat(3000);
    expect(decodeStoredText('study-space:lz16:v1:' + LZString.compressToUTF16(raw))).toBe(raw);
    const bytes = new Uint8Array(raw.length * 2);
    for (let i = 0; i < raw.length; i++) { bytes[i * 2] = raw.charCodeAt(i) & 255; bytes[i * 2 + 1] = raw.charCodeAt(i) >>> 8; }
    const legacy = gzipSync(bytes, { level: 1, mtime: 0 });
    expect(decodeStoredText('study-space:gzip16:v1:' + btoa(String.fromCharCode(...legacy)))).toBe(raw);
    const next = encodeStoredText(raw); expect(next).toMatch(/^study-space:gzip15:v1:/);
    expect(decodeStoredText(next)).toBe(raw);
    expect(() => decodeStoredText('study-space:gzip15:v1:broken')).toThrow('변경하지 않았습니다');
    expect(() => decodeStoredText(next.replace(/gzip15:v1:[0-9]+:/, 'gzip15:v1:536870913:'))).toThrow('변경하지 않았습니다');
    const index = next.length - 4;
    const damaged = next.slice(0, index) + String.fromCharCode(32 + ((next.charCodeAt(index) - 32) ^ 1)) + next.slice(index + 1);
    expect(() => decodeStoredText(damaged)).toThrow('변경하지 않았습니다');
  });
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
    const storage = {getItem:()=>value,setItem:(_key:string,next:string)=>{if(next.length>raw.length/4) throw new DOMException('quota','QuotaExceededError');value=next;}};
    const repo = new DemoRepository(storage);
    expect(decodeStoredText(value)).toBe(raw);
    expect(value.length).toBeLessThan(raw.length/4);
    const next = repo.execute({type:'saveMemo',id:'quota-memo',ownerId:null,body:' 原文\r\n次 ',strokes,expectedVersion:14,opId:'next',at:'2026-09-30T12:01:00.000Z',userId:data.userId,namespace:data.namespace});
    expect(next.revisions.length).toBe(data.revisions.length+1);
    expect(next.appliedOps).toMatchObject(data.appliedOps);
    // Compare the complete durable ledger without expanding millions of matcher nodes.
    expect(JSON.stringify(new DemoRepository(storage).getSnapshot())).toBe(JSON.stringify(next));
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

it('preserves packed gzip across varying byte boundaries and raw UTF-16 units', () => {
  let seed = 20261001;
  for (let length = 1; length <= 35; length++) {
    let pattern = '\ud800\udfff\u0000\r\n';
    for (let i = 0; i < length * 3; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; pattern += String.fromCharCode(seed & 65535); }
    const raw = pattern.repeat(80), stored = encodeStoredText(raw, 0);
    expect(stored.startsWith('study-space:gzip15:v1:')).toBe(true);
    expect(decodeStoredText(stored)).toBe(raw);
  }
});
