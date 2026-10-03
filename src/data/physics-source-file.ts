import type { AppState } from '../domain/model';
import { storagePrefix } from './repository';
import { access } from './material-file-db';
export type PhysicsSourceOwner=Pick<AppState,'namespace'|'userId'>;
export const PHYSICS_SOURCE_SHA='67f606ca1ec0bc93c593d2f90df2b0fc4a9e1159add89de6df0a11b12bc913b1';
export const PHYSICS_SOURCE_BYTES=63824473;
const key=(owner:PhysicsSourceOwner)=>`${storagePrefix(owner)}:physics-source:${PHYSICS_SOURCE_SHA}`;
export async function checkPhysicsSource(bytes:ArrayBuffer){
 if(bytes.byteLength!==PHYSICS_SOURCE_BYTES)throw Error('같은 판본의 교재 원본 PDF를 연결해 주세요. 기존 원문과 관찰값은 유지했다.');
 const sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
 if(sha!==PHYSICS_SOURCE_SHA)throw Error('연결한 PDF가 이 교재의 원본과 다르다. 기존 원문과 관찰값은 유지했다.');
}
// This exact textbook exceeds the common 50 MB attachment limit. Store only this
// SHA-verified 63,824,473-byte file through the existing owner-scoped local DB.
// No cloud reference is created and no upload/API is called.
export async function keepPhysicsSource(owner:PhysicsSourceOwner,file:File){
 if(file.size!==PHYSICS_SOURCE_BYTES)throw Error('같은 판본의 교재 원본 PDF를 연결해 주세요. 기존 원문과 관찰값은 유지했다.');
 const bytes=await file.arrayBuffer();await checkPhysicsSource(bytes);
 await access('files','readwrite',store=>store.put({bytes,type:'application/pdf'},key(owner)));
 return new Blob([bytes],{type:'application/pdf'});
}
export async function readPhysicsSource(owner:PhysicsSourceOwner){
 const row=await access<{bytes:ArrayBuffer}|undefined>('files','readonly',store=>store.get(key(owner)));
 if(!row)return null;await checkPhysicsSource(row.bytes);return new Blob([row.bytes],{type:'application/pdf'});
}
