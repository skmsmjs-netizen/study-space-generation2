export interface ScheduleNotificationPort {
 config():Promise<{publicKey:string}>;
 subscribe(subscription:PushSubscriptionJSON):Promise<void>;
 unsubscribe(endpoint:string):Promise<void>;
 status(endpoint:string):Promise<{enabled:boolean}>;
}
function applicationKey(key:string):Uint8Array<ArrayBuffer> {
 const bytes=atob(key.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(bytes,c=>c.charCodeAt(0));
}
export async function localPushSubscription(){
 if(!('serviceWorker' in navigator))return null;
 const base=new URL(import.meta.env.BASE_URL,location.href);
 const registration=await navigator.serviceWorker.getRegistration(base.href);return registration?await registration.pushManager.getSubscription():null;
}
export async function enableSchedulePush(port:ScheduleNotificationPort){
 if(!('Notification' in window)||!('serviceWorker' in navigator)||!('PushManager' in window))throw Error('이 브라우저에서는 알림을 켤 수 없습니다. iPhone·iPad에서는 홈 화면에 추가한 공부 공간에서 알림을 켜 주세요. 캘린더 파일로도 일정을 가져갈 수 있습니다.');
 // Permission is requested by the direct button gesture, before unrelated network awaits.
 const permission=await Notification.requestPermission();if(permission!=='granted')throw Error('알림이 허용되지 않았습니다. 기기의 브라우저 알림 설정을 확인해 주세요.');
 const config=await port.config();
 const base=import.meta.env.BASE_URL,registration=await navigator.serviceWorker.register(`${base}schedule-notifications-sw.js`,{scope:base});
 if(!registration.active)await new Promise<void>((resolve,reject)=>{const worker=registration.installing??registration.waiting;if(!worker){reject(Error('알림 연결을 시작하지 못했습니다.'));return;}const timeout=window.setTimeout(()=>reject(Error('알림 연결 시간이 지났습니다. 다시 켜 주세요.')),15000);const check=()=>{if(worker.state==='activated'){clearTimeout(timeout);resolve();}else if(worker.state==='redundant'){clearTimeout(timeout);reject(Error('알림 연결을 시작하지 못했습니다.'));}};worker.addEventListener('statechange',check);check();});
 const previous=await registration.pushManager.getSubscription();
 const subscription=previous??await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:applicationKey(config.publicKey)});
 try{await port.subscribe(subscription.toJSON());}catch(error){if(!previous)await subscription.unsubscribe();throw error;}
 return subscription;
}
export async function disableSchedulePush(port:ScheduleNotificationPort){
 const subscription=await localPushSubscription();if(!subscription)return {serverCleanupFailed:false};
 // Unsubscribe the device even if a network failure prevents server cleanup.
 let failure:unknown;try{await port.unsubscribe(subscription.endpoint);}catch(error){failure=error;}
 if(!await subscription.unsubscribe())throw Error('기기의 알림 구독을 끄지 못했습니다. 다시 시도해 주세요.');
 return {serverCleanupFailed:!!failure};
}
/** Logging out must stop notifications for the previous account on a shared device. */
export async function stopLocalSchedulePush(){const subscription=await localPushSubscription();if(subscription&&!await subscription.unsubscribe())throw Error('기기의 알림을 끄지 못했습니다. 브라우저 알림 설정을 확인해 주세요.');}
