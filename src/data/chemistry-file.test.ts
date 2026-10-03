import {describe,it,expect} from 'vitest';
import {indexedDB} from 'fake-indexeddb';
import {chemistryFileReference,keepChemistryFile,readChemistryFile} from './chemistry-file';
describe('same-book device storage ownership and rejection',()=>{
 it('uses the shared document hash key while isolating owners and spaces',()=>{
  const a=chemistryFileReference({namespace:'personal',userId:'a'});
  expect(a.key).toContain(':material:document%3A');
  expect(a.key).not.toBe(chemistryFileReference({namespace:'personal',userId:'b'}).key);
  expect(a.key).not.toBe(chemistryFileReference({namespace:'test',userId:'a'}).key);
 });
 it('rejects a different file and does not create a successful saved record',async()=>{
  Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:indexedDB});
  const owner={namespace:'demo' as const,userId:'chem-file-rejection'};
  await expect(keepChemistryFile(owner,new Blob(['different book']))).rejects.toThrow('크기');
  expect(await readChemistryFile(owner)).toBeNull();
 });
});
