import {describe,it,expect} from 'vitest';
import katex from 'katex';
import {MODELS,defaults,calculate,modelById} from './model';
import {CHEMISTRY,mapping,MOLECULES} from './catalog';
const result=(id:string,v:Record<string,number>)=>{const m=modelById(id)!;return calculate(m,{...defaults(m),...v},'fulfilled');};
const root=Math.sqrt;
describe('textbook-scoped chemistry observations',()=>{
 it('covers each original section once, with stable IDs and a reason',()=>{expect(CHEMISTRY.sections).toHaveLength(197);expect(new Set(CHEMISTRY.sections.map(s=>s.id)).size).toBe(197);for(const s of CHEMISTRY.sections){expect(mapping(s).reason.length).toBeGreaterThan(20);expect(s.printed_start).toBeGreaterThan(0);expect(s.pdf_pages_with_heading.length).toBeGreaterThan(0);}});
 it('renders every supported source equation and finite initial state',()=>{for(const m of MODELS){expect(()=>katex.renderToString(m.tex,{throwOnError:true})).not.toThrow();expect(calculate(m,defaults(m),'fulfilled').value).not.toBeNull();}});
 it('keeps unknown and violated conditions separate from false conclusions',()=>{for(const m of MODELS){expect(calculate(m,defaults(m),'unknown').state).toBe('unknown');expect(calculate(m,defaults(m),'violated').value).toBeNull();}});
 it('independently checks ratios and dimensions',()=>{expect(result('gas',{P:2}).value).toBeCloseTo(12.30855,6);expect(result('mole',{m:18,M:18}).value).toBe(1);expect(result('dilution',{c1:1,v1:100,v2:200}).value).toBe(0.5);expect(result('graham',{a:4,b:16}).value).toBe(2);expect(result('heat',{m:100,c:4.184,dt:10}).value).toBe(4184);expect(result('first-order',{k:0.01,t:Math.log(2)/0.01}).value).toBeCloseTo(0.5,12);expect(result('second-order',{k:0.1,a:0.5}).value).toBe(20);});
 it('keeps standard and actual free energy separate and checks electrochemical signs',()=>{expect(result('gibbs',{h:40,s:150,T:300}).value).toBe(-5);expect(result('gibbs-k',{g:0}).value).toBeCloseTo(0);expect(result('nernst',{q:1,e:1.1}).value).toBe(1.1);expect(result('nernst',{q:10,e:1.1}).value).toBeLessThan(1.1);expect(result('equilibrium',{q:1,k:1}).detail).toContain('평형');});
 it('checks weak-acid charge model and common-ion mass balance residuals',()=>{const x=result('weak-acid',{ka:0.000018,c:0.1}).value!;expect(x*x/(0.1-x)).toBeCloseTo(0.000018,12);const s=result('solubility',{ksp:1e-8,c:0.001}).value!;expect(s*(s+0.001)).toBeCloseTo(1e-8,14);});
 it('checks buffer stoichiometry before equilibrium, preserves exception',()=>{expect(result('buffer',{ha:20,a:20,acid:0,pka:4.74}).value).toBe(4.74);expect(result('buffer',{ha:20,a:20,acid:5,pka:4.74}).value).toBeCloseTo(4.74+Math.log10(0.6),12);expect(result('buffer',{acid:20}).value).toBeNull();expect(result('buffer',{acid:-20}).value).toBeNull();});
 it('rejects undefined and fractional electron-count input',()=>{expect(result('gas',{P:0}).value).toBeNull();expect(result('nernst',{n:1.5}).value).toBeNull();expect(result('ph',{h:0}).value).toBeNull();expect(result('weak-acid',{ka:1e-10,c:1e-6}).state).toBe('unknown');});
 it('keeps molecular geometry and electron domains distinct',()=>{expect(MOLECULES[0].domains).toBe(4);expect(MOLECULES[0].shape).toBe('굽은 모양');expect(MOLECULES[1].dipole).toContain('상쇄');});
});
