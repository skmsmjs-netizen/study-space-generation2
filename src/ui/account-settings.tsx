import { useState } from 'react';
import { Button, Input, Modal } from './index';
import type { AccountAccessClient } from '../data/account-access';
import { validateAccountName, type AccountAccess } from '../server/account-access';
export function AccountSettings({api,access,onSaved,onWithdrawn,onDownload}:{api:AccountAccessClient;access:AccountAccess;onSaved:(access:AccountAccess)=>void;onWithdrawn:()=>Promise<void>;onDownload?:()=>void|Promise<void>}) {
  const [open,setOpen]=useState(access.displayName===null||access.withdrawalPending===true),[name,setName]=useState(access.displayName??'');
  const [deleting,setDeleting]=useState(access.withdrawalPending===true),[confirmation,setConfirmation]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  async function saveName(){
    if(busy)return;setBusy(true);setError('');setNotice('');
    try{const valid=validateAccountName(name);if(!api.saveName)throw Error('계정 연결을 확인해 주세요.');const saved=await api.saveName(valid);onSaved(saved);setName(saved.displayName??valid);setNotice('이름을 저장했습니다.');}
    catch(error){setError(error instanceof Error?error.message:'이름을 저장하지 못했습니다.');}finally{setBusy(false);}
  }
  async function withdraw(){
    if(busy||confirmation!=='탈퇴')return;setBusy(true);setError('');
    try{if(!api.withdraw)throw Error('탈퇴 연결을 확인해 주세요.');await api.withdraw();await onWithdrawn();}
    catch(error){setError(error instanceof Error?error.message:'탈퇴 결과를 확인하지 못했습니다. 다시 로그인하여 계정 상태를 확인해 주세요.');}finally{setBusy(false);}
  }
  async function download(){
    if(busy||!onDownload)return;setBusy(true);setError('');
    try{await onDownload();}catch{setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.');}finally{setBusy(false);}
  }
  return <><Button variant="quiet" onClick={()=>{setOpen(true);setError('');setNotice('');}}>내 계정</Button>
    <Modal open={open} title="내 계정" onClose={()=>{if(!busy){setOpen(false);setDeleting(false);setConfirmation('');}}}>
      <p>이름은 관리자가 가입한 사람을 확인할 때 함께 표시됩니다.</p>
      <form onSubmit={event=>{event.preventDefault();void saveName();}}><Input label="이름" autoComplete="name" required maxLength={80} value={name} onChange={event=>setName(event.target.value)}/><Button type="submit" disabled={busy}>이름 저장</Button></form>
      {notice&&<p role="status">{notice}</p>}{error&&<p role="alert">{error}</p>}
      <section className="section-space"><h2>회원 탈퇴</h2><p>탈퇴하면 계정과 서버의 공부 기록·글·메모·첨부 파일, 이 브라우저의 개인 기록·초안·보관본을 삭제합니다. 삭제한 내용은 되돌릴 수 없습니다.</p>
        <p>첨부 파일을 먼저 정리합니다. 처리가 시작되면 새 저장과 업로드를 중지하며, 연결이 끊기면 다시 로그인해 남은 정리를 이어갈 수 있습니다.</p>
        {access.withdrawalPending&&<p role="status">탈퇴 정리가 시작되었습니다. 확인 후 남은 처리를 이어가 주세요.</p>}
        <p>다른 기기의 초안·보관본과 이미 내려받은 파일은 해당 기기에서 직접 정리해 주세요.</p>
        {onDownload&&<Button disabled={busy} onClick={()=>{void download();}}>탈퇴 전 기록 내려받기</Button>}
        {access.administrator&&<p>현재 유일한 관리자는 다른 관리자에게 권한을 넘긴 뒤 탈퇴할 수 있습니다.</p>}
        {!deleting?<Button disabled={busy} onClick={()=>{setDeleting(true);setConfirmation('');setError('');}}>회원 탈퇴</Button>:<div>
          <Input label="확인을 위해 ‘탈퇴’를 입력해 주세요" value={confirmation} autoComplete="off" onChange={event=>setConfirmation(event.target.value)}/>
          <div className="actions"><Button disabled={busy||confirmation!=='탈퇴'} onClick={()=>{void withdraw();}}>{busy?'탈퇴 처리 중…':'계정과 기록 삭제'}</Button><Button disabled={busy} onClick={()=>{setDeleting(false);setConfirmation('');}}>취소</Button></div>
        </div>}
      </section>
    </Modal></>;
}
