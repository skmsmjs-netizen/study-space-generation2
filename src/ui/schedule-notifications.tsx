import { useEffect, useState } from 'react';
import type { AppState } from '../domain/model';
import type { LearningSchedule } from '../domain/learning-schedule';
import { scheduleDigest, remainingTime } from '../domain/schedule-management';
import { disableSchedulePush, enableSchedulePush, localPushSubscription, type ScheduleNotificationPort } from '../data/schedule-notifications';
import { Button } from './index';
export function ScheduleNotifications({data,schedules,port,disabled=false}: {data:AppState;schedules:LearningSchedule[];port?:ScheduleNotificationPort;disabled?:boolean}) {
 const [enabled,setEnabled]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[now,setNow]=useState(()=>new Date().toISOString());
 useEffect(()=>{const tick=()=>setNow(new Date().toISOString()),timer=window.setInterval(tick,60000);window.addEventListener('focus',tick);return()=>{clearInterval(timer);window.removeEventListener('focus',tick);};},[]);
 useEffect(()=>{let alive=true;if(port)void localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}).catch(()=>{if(alive)setMessage('기기의 알림 연결을 확인하지 못했습니다. 알림 켜기로 다시 확인해 주세요.');});return()=>{alive=false;};},[port,data.userId]);
 const toggle=async()=>{if(!port){setMessage('내 공부 공간에 로그인한 뒤 알림을 켜 주세요.');return;}setBusy(true);try{if(enabled){const result=await disableSchedulePush(port);setEnabled(false);setMessage(result.serverCleanupFailed?'이 기기의 알림은 껐습니다. 서버 구독 정리는 연결 후 다시 확인해 주세요.':'이 기기의 일정 알림을 껐습니다.');}else{await enableSchedulePush(port);setEnabled(true);setMessage('이 기기에 매일 오전 9시, 일주일 안에 기한이 오는 일정을 한 알림으로 보냅니다.');}}catch(error){setMessage(error instanceof Error?error.message:'알림 연결을 확인하지 못했습니다. 다시 시도해 주세요.');}finally{setBusy(false);}};
 const supported = typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
 const blocked = supported && Notification.permission === 'denied';
 const digest=scheduleDigest(schedules,now);
 return <details><summary>오늘 확인할 일정 · 알림 {enabled?'켜짐':'설정'}</summary><p>서버에 저장한 일정으로 매일 오전 9시 알림을 보냅니다. 한국 시간을 기준으로 합니다. 과제 제출·출석 확인이 끝난 기한은 제외합니다. 일정 이름이 기기의 알림에 표시됩니다.</p><ul>{digest.due.map(s=><li key={s.id}>{s.name} · {remainingTime(s,now)}</li>)}{digest.unknown.map(s=><li key={s.id}>{s.name} · 공지에서 기한 확인</li>)}</ul>{!digest.count&&<p>일주일 안에 확인할 기한이 없습니다.</p>}{!supported&&<p>이 브라우저에서는 기기 알림을 켤 수 없습니다. iPhone·iPad에서는 Safari의 공유 메뉴에서 홈 화면에 추가한 뒤 그 아이콘으로 열어 주세요. 아래 일정은 여기서 계속 확인하거나 캘린더 파일로 가져갈 수 있습니다.</p>}{blocked&&<p>기기에서 알림을 차단했습니다. 브라우저의 알림 설정에서 허용하거나 일정 목록·캘린더 파일을 이용해 주세요.</p>}<Button busy={busy} disabled={disabled||busy||(!enabled&&(!supported||blocked))} onClick={()=>void toggle()}>{enabled?'이 기기 알림 끄기':'일정 알림 켜기'}</Button>{message&&<p role="status">{message}</p>}</details>;
}
