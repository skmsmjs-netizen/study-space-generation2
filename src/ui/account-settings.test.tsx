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

it('waits for all download stores, prevents repeated actions, and reports asynchronous failure without withdrawal',async()=>{
  let reject!: (error: Error) => void;
  const onDownload=vi.fn(()=>new Promise<void>((_, fail)=>{reject=fail;})),withdraw=vi.fn();
  render(<AccountSettings api={{read:vi.fn(),list:vi.fn(),set:vi.fn(),withdraw}} access={{status:'approved',administrator:false,displayName:'시험 사람'}} onSaved={vi.fn()} onWithdrawn={vi.fn()} onDownload={onDownload}/>);
  fireEvent.click(screen.getByRole('button',{name:'내 계정'}));fireEvent.click(screen.getByRole('button',{name:'탈퇴 전 기록 내려받기'}));
  expect(screen.getByRole('button',{name:'탈퇴 전 기록 내려받기'})).toBeDisabled();expect(screen.getByRole('button',{name:'회원 탈퇴'})).toBeDisabled();
  reject(Error('IndexedDB inaccessible'));
  await screen.findByText('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.');
  expect(screen.getByRole('button',{name:'탈퇴 전 기록 내려받기'})).toBeEnabled();expect(withdraw).not.toHaveBeenCalled();
});
