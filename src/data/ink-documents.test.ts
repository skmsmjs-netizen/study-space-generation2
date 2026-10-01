import {expect,it} from 'vitest';
import {PDFDocument} from 'pdf-lib';
import {exportInkPDF,paperFit} from './ink-documents';
import {validateMemoContent} from '../domain/memo';
it('fits portrait and landscape PDF pages without stretching',()=>{
 expect(paperFit(600,900)).toEqual({scale:2/3,x:250,y:0,width:400,height:600});
 expect(paperFit(1200,600)).toEqual({scale:.75,x:0,y:75,width:900,height:450});
});
it('exports vector pressure and page-separated notes without changing original strokes',async()=>{
 const strokes=[{id:'a',ink:'ink' as const,width:3,page:0,points:[{x:1,y:2,pressure:.5},{x:30,y:40,pressure:.8}]},{id:'b',ink:'blue' as const,width:3,page:2,pressureSensitive:true,points:[{x:50,y:60,pressure:.7},{x:70,y:80,pressure:.8}]}];
 const before=structuredClone(strokes);const bytes=await exportInkPDF({userId:'test',namespace:'test'},strokes);const pdf=await PDFDocument.load(bytes);
 expect(pdf.getPageCount()).toBe(3);expect(pdf.getPage(0).getSize()).toEqual({width:900,height:600});expect(strokes).toEqual(before);
});
it('rejects invalid PDF metadata and keeps legacy memos valid',()=>{
 validateMemoContent({body:'원문',ownerId:null,strokes:[]});
 expect(()=>validateMemoContent({body:'원문',ownerId:null,strokes:[],document:{pages:0,startPage:0,file:{}}})).toThrow();
});
