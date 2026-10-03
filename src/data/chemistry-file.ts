import type {AppState} from '../domain/model';
import {CHEMISTRY} from '../domain/chemistry/catalog';
import {storagePrefix} from './repository';
import {access} from './material-file-db';
import {verifyMaterialBlob} from './material-cloud';

type Owner=Pick<AppState,'namespace'|'userId'>;
/** Same files store and document hash key; exact book exception does not raise general upload limits. */
export const chemistryFileReference=(owner:Owner)=>({key:`${storagePrefix(owner)}:material:${encodeURIComponent('document:'+CHEMISTRY.source.source_sha256)}`,sha256:CHEMISTRY.source.source_sha256,size:67578324});
export async function readChemistryFile(owner:Owner):Promise<Blob|null> {
 const reference=chemistryFileReference(owner);
 const saved=await access<Blob|{bytes:ArrayBuffer;type:string}|undefined>('files','readonly',s=>s.get(reference.key));
 const blob=saved instanceof Blob?saved:saved?new Blob([saved.bytes],{type:saved.type}):null;
 if(blob)await verifyMaterialBlob(blob,reference);
 return blob;
}
export async function keepChemistryFile(owner:Owner,blob:Blob):Promise<void> {
 const reference=chemistryFileReference(owner);
 await verifyMaterialBlob(blob,reference);
 // Reject a corrupt existing record, preserving it for recovery rather than overwriting it.
 if(await readChemistryFile(owner))return;
 const bytes=await blob.arrayBuffer();
 await access('files','readwrite',s=>s.put({bytes,type:'application/pdf'},reference.key));
 const reread=await readChemistryFile(owner);
 if(!reread)throw Error('원문 보관 후 다시 읽기를 확인하지 못했다. 현재 열린 원문은 유지한다.');
}
