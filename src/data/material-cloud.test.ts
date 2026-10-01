// @vitest-environment node
import {beforeEach,expect,it,vi} from 'vitest';
const mock=vi.hoisted(()=>({user:'owner',upload:vi.fn(),download:vi.fn(),stop:vi.fn()}));
vi.mock('./supabase-client',()=>({readServerConfig:()=>({url:'http://synthetic.invalid',publishableKey:'synthetic'}),createStudyClient:()=>({auth:{getSession:async()=>({data:{session:{user:{id:mock.user}}},error:null}),stopAutoRefresh:mock.stop},storage:{from:()=>({upload:mock.upload,download:mock.download})}})}));
import {uploadMaterialFile,downloadMaterialFile} from './material-cloud';
import type {MaterialFile} from '../domain/material-source';
const owner={userId:'owner',namespace:'personal' as const};
async function file(){const blob=new Blob(['  원문\r\n예외와 조건\u0000  ']);const sha256=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(n=>n.toString(16).padStart(2,'0')).join('');return {blob,reference:{key:'owner/personal/original',name:'원문.txt',type:'text/plain',size:blob.size,sha256} satisfies MaterialFile};}
beforeEach(()=>{mock.user='owner';mock.upload.mockReset().mockResolvedValue({error:null});mock.download.mockReset();mock.stop.mockReset();});
it('verifies exact bytes after immutable upload and after another-device download, including duplicate acknowledgement recovery',async()=>{
 const {blob,reference}=await file();mock.download.mockResolvedValue({data:blob,error:null});
 const cloud=await uploadMaterialFile(owner,'document',reference,blob);expect(cloud.cloudPath).toBe(`owner/personal/document/${reference.sha256}`);expect(mock.upload.mock.calls[0][2].upsert).toBe(false);
 expect(await(await downloadMaterialFile(owner,'document',cloud)).text()).toBe(await blob.text());
 mock.upload.mockResolvedValue({error:{statusCode:'409'}});expect(await uploadMaterialFile(owner,'document',reference,blob)).toEqual(cloud);expect(mock.stop).toHaveBeenCalledTimes(3);
});
it('never acknowledges corrupt bytes, foreign owners/paths, upload failure or incomplete read-back',async()=>{
 const {blob,reference}=await file();mock.download.mockResolvedValue({data:new Blob(['different']),error:null});await expect(uploadMaterialFile(owner,'document',reference,blob)).rejects.toThrow('크기');
 mock.user='other';await expect(uploadMaterialFile(owner,'document',reference,blob)).rejects.toThrow('로그인');
 mock.user='owner';await expect(downloadMaterialFile(owner,'document',{...reference,cloudPath:`other/personal/document/${reference.sha256}`})).rejects.toThrow('다른 공간');
 mock.upload.mockResolvedValue({error:{statusCode:'503'}});await expect(uploadMaterialFile(owner,'document',reference,blob)).rejects.toThrow('보관하지 못');
 mock.upload.mockResolvedValue({error:null});mock.download.mockResolvedValue({data:null,error:{}});await expect(uploadMaterialFile(owner,'document',reference,blob)).rejects.toThrow('확인하지 못');
});
