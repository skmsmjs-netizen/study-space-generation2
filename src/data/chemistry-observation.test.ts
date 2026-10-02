import {beforeEach,describe,it,expect} from 'vitest';
import {emptyChemistryView,readChemistryView,writeChemistryView,chemistryViewKey} from './chemistry-observation';
import {encodeStoredText} from './storage-codec';
beforeEach(()=>{localStorage.clear();sessionStorage.clear();});
describe('chemistry device view uses existing ownership and safety path',()=>{
 it('isolates user and namespace keys',()=>{expect(chemistryViewKey({userId:'a',namespace:'personal'})).not.toBe(chemistryViewKey({userId:'b',namespace:'personal'}));});
 it('restores exact values, unfinished input, condition and zoom independently',()=>{const key='chem:test:valid';const v=emptyChemistryView();v.views.buffer={values:{ha:20.000000019},drafts:{acid:'1e-'},condition:'unknown',step:2,molecule:'water',zoom:2};writeChemistryView(key,v,null);expect(readChemistryView(key)).toEqual(v);});
 it('does not overwrite a damaged original or foreign update',()=>{const key='chem:test:damage';localStorage.setItem(key,'BROKEN');expect(()=>readChemistryView(key)).toThrow();expect(()=>writeChemistryView(key,emptyChemistryView(),'BROKEN')).toThrow();expect(localStorage.getItem(key)).toBe('BROKEN');const foreign=encodeStoredText(JSON.stringify(emptyChemistryView()));localStorage.setItem(key,foreign);expect(()=>writeChemistryView(key,emptyChemistryView(),null)).toThrow();expect(localStorage.getItem(key)).toBe(foreign);});
});
it('retains optional existing memo references and the caller list position without altering old records',()=>{const key='chem:test:links';const v=emptyChemistryView();v.memoLinks={'source-id':['existing-memo-id']};v.listTop=731;writeChemistryView(key,v,null);expect(readChemistryView(key).memoLinks).toEqual(v.memoLinks);expect(readChemistryView(key).listTop).toBe(731);expect(()=>writeChemistryView(key,{...v,listTop:-1},localStorage.getItem(key))).toThrow();expect(readChemistryView(key).memoLinks).toEqual(v.memoLinks);});
