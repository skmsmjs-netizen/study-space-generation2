import type { AppState } from '../domain/model';
import { koreanDay, remainingTime, scheduleDigest } from '../domain/schedule-management';

export interface PushRecord { endpoint:string; keys:{p256dh:string;auth:string}; expirationTime?:number|null }
export interface NotificationJob { id:string;userId:string;subscription:PushRecord;day:string;claim:string }
export interface NotificationBackend {
 authenticate(token:string):Promise<string>;
 approved(userId:string):Promise<boolean>;
 save(userId:string,subscription:PushRecord):Promise<void>;
 remove(userId:string,endpoint:string):Promise<void>;
 status(userId:string,endpoint:string):Promise<boolean>;
 claim(at:string):Promise<NotificationJob[]>;
 read(userId:string):Promise<AppState|null>;
 finish(job:NotificationJob,outcome:'sent'|'empty'|'expired'|'retry'):Promise<void>;
 send(subscription:PushRecord,payload:{title:string;body:string}):Promise<void>;
}
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
export function allowedPushEndpoint(endpoint:unknown):endpoint is string {
 if(typeof endpoint!=='string'||endpoint.length>4096)return false;
 try{const url=new URL(endpoint);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&!url.hash&&(url.hostname==='fcm.googleapis.com'||url.hostname==='updates.push.services.mozilla.com'||url.hostname.endsWith('.push.services.mozilla.com')||url.hostname==='web.push.apple.com'||url.hostname.endsWith('.push.apple.com'));}catch{return false;}
}
export function validatePushSubscription(value:unknown):PushRecord {
 const s=value as PushRecord;const key=(value:unknown,size:number)=>{if(typeof value!=='string'||! /^[A-Za-z0-9_-]+={0,2}$/.test(value))return false;try{return atob(value.replace(/-/g,'+').replace(/_/g,'/')).length===size;}catch{return false;}};
 if(!s||!allowedPushEndpoint(s.endpoint)||!s.keys||!key(s.keys.auth,16)||!key(s.keys.p256dh,65)||s.expirationTime!==undefined&&s.expirationTime!==null&&(!Number.isFinite(s.expirationTime)||s.expirationTime<0))throw Error('알림 구독 형식을 확인해 주세요.');
 return {endpoint:s.endpoint,keys:{auth:s.keys.auth,p256dh:s.keys.p256dh},expirationTime:s.expirationTime??null};
}
/** Only a scheduled secret can dispatch; all other actions derive the owner from Auth. */
export async function handleScheduleNotifications(request:Request,backend:NotificationBackend,config:{publicKey:string;cronSecret:string;now?:()=>string}) {
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(request.method!=='POST')return json({message:'지원하지 않는 요청입니다.'},405);
 try {
   const text=await request.text();if(text.length>12000)return json({message:'알림 요청이 너무 큽니다.'},413);
   let body:Record<string,unknown>;try{body=JSON.parse(text);}catch{return json({message:'알림 요청을 읽지 못했습니다.'},400);}
   if(!body||typeof body!=='object'||Array.isArray(body))return json({message:'알림 요청을 확인해 주세요.'},400);
   if(body.action==='dispatch') {
     if(config.cronSecret.length<32||request.headers.get('authorization')!==`Bearer ${config.cronSecret}`)return json({message:'알림 발송 권한이 없습니다.'},403);
     const at=config.now?.()??new Date().toISOString(),hour=new Date(Date.parse(at)+9*3600000).getUTCHours();
     if(hour!==9)return json({sent:0,outsideWindow:true});
     let sent=0,failed=0;
     // Claims are capped in SQL; successive cron runs drain remaining devices.
     for(const job of await backend.claim(at)) {
       try{
         if(job.day!==koreanDay(at)||!allowedPushEndpoint(job.subscription.endpoint)||!await backend.approved(job.userId)){await backend.finish(job,'empty');continue;}
         const data=await backend.read(job.userId);
         if(!data||data.userId!==job.userId||data.namespace!=='personal'){await backend.finish(job,'empty');continue;}
         const schedules=data.learningPlans?.find(row=>!row.deletedAt)?.workspace.schedules??[],subjectIds=new Set(data.subjects.filter(s=>!s.deletedAt&&s.userId===job.userId&&s.namespace==='personal').map(s=>s.id));
         const digest=scheduleDigest(schedules.filter(s=>subjectIds.has(s.subjectId)),at);
         if(!digest.count){await backend.finish(job,'empty');continue;}
         const names=[...digest.due.map(s=>`${s.name} · ${remainingTime(s,at)}`),...digest.unknown.map(s=>`${s.name} · 공지에서 기한 확인`)];
         let message='';for(const name of names){if(new TextEncoder().encode(message+name).length>2400){message+='\n전체 일정은 공부 공간에서 확인해 주세요.';break;}message+=(message?'\n':'')+name;}
         await backend.send(job.subscription,{title:`일주일 안의 공부 일정 ${digest.count}개`,body:message});
         await backend.finish(job,'sent');sent++;
       }catch(error){const expired=[404,410].includes((error as {statusCode?:number})?.statusCode??0);await backend.finish(job,expired?'expired':'retry');failed++;}
     }
     return json({sent,failed});
   }
   const authorization=request.headers.get('authorization');if(!authorization?.startsWith('Bearer '))return json({message:'내 공부 공간에 다시 로그인해 주세요.'},401);
   let owner:string;try{owner=await backend.authenticate(authorization.slice(7));}catch{return json({message:'내 공부 공간에 다시 로그인해 주세요.'},401);}
   if(!owner||!await backend.approved(owner))return json({message:'승인된 내 공부 공간에서 알림을 사용할 수 있습니다.'},403);
   if(body.action==='config'){if(!config.publicKey)return json({message:'알림 서버 연결을 확인하지 못했습니다. 캘린더 파일로 일정을 가져갈 수 있습니다.'},503);return json({publicKey:config.publicKey});}
   if(body.action==='subscribe'){let subscription:PushRecord;try{subscription=validatePushSubscription(body.subscription);}catch{return json({message:'알림 구독 형식을 확인해 주세요.'},400);}await backend.save(owner,subscription);return json({enabled:true});}
   if(!allowedPushEndpoint(body.endpoint))return json({message:'알림 구독 주소를 확인해 주세요.'},400);
   if(body.action==='unsubscribe'){await backend.remove(owner,body.endpoint);return json({enabled:false});}
   if(body.action==='status')return json({enabled:await backend.status(owner,body.endpoint)});
   return json({message:'지원하지 않는 알림 요청입니다.'},400);
 }catch{return json({message:'알림 연결을 처리하지 못했습니다. 일정 원문은 유지했습니다. 다시 시도해 주세요.'},503);}
}
