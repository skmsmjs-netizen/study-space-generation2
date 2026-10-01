import { render,screen,fireEvent,cleanup,waitFor } from '@testing-library/react';
import { afterEach,expect,it,vi } from 'vitest';
import { AccountSettings } from './account-settings';
afterEach(cleanup);
it('saves a valid name and preserves the editor after server failure',async()=>{
  const saveName=vi.fn().mockRejectedValueOnce(Error('연결 실패')).mockResolvedValue({status:'pending',administrator:false,displayName:'시험 사람'}),onSaved=vi.fn();
  render(<AccountSettings api={{read:vi.fn(),list:vi.fn(),set:vi.fn(),saveName}} access={{status:'pending',administrator:false,displayName:null}} onSaved={onSaved} onWithdrawn={vi.fn()}/>);
  fireEvent.change(screen.getByLabelText('이름'),{target:{value:'  시험 사람  '}});fireEvent.click(screen.getByRole('button',{name:'이름 저장'}));
  await screen.findByText('연결 실패');expect(screen.getByLabelText('이름')).toHaveValue('  시험 사람  ');expect(onSaved).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'이름 저장'}));await screen.findByText('이름을 저장했습니다.');expect(saveName).toHaveBeenLastCalledWith('시험 사람');expect(onSaved).toHaveBeenCalledOnce();
});
it('requires deliberate confirmation and leaves records untouched on cancel or failed withdrawal',async()=>{
  const withdraw=vi.fn().mockRejectedValueOnce(Error('탈퇴 연결 실패')).mockResolvedValue(undefined),onWithdrawn=vi.fn().mockResolvedValue(undefined);
  render(<AccountSettings api={{read:vi.fn(),list:vi.fn(),set:vi.fn(),withdraw}} access={{status:'suspended',administrator:false,displayName:'시험 사람'}} onSaved={vi.fn()} onWithdrawn={onWithdrawn}/>);
  fireEvent.click(screen.getByRole('button',{name:'내 계정'}));fireEvent.click(screen.getByRole('button',{name:'회원 탈퇴'}));expect(screen.getByRole('button',{name:'계정과 기록 삭제'})).toBeDisabled();
  fireEvent.change(screen.getByLabelText('확인을 위해 ‘탈퇴’를 입력해 주세요'),{target:{value:'탈퇴'}});fireEvent.click(screen.getByRole('button',{name:'취소'}));expect(withdraw).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'회원 탈퇴'}));fireEvent.change(screen.getByLabelText('확인을 위해 ‘탈퇴’를 입력해 주세요'),{target:{value:'탈퇴'}});fireEvent.click(screen.getByRole('button',{name:'계정과 기록 삭제'}));
  await screen.findByText('탈퇴 연결 실패');expect(onWithdrawn).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'계정과 기록 삭제'}));await waitFor(()=>expect(onWithdrawn).toHaveBeenCalledOnce());
});
