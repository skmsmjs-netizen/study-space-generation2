import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { AccountAdministration } from './account-administration';
import type { AccountAccessClient } from '../data/account-access';
import type { ManagedAccount } from '../server/account-access';
afterEach(cleanup);
const account:ManagedAccount={userId:'80000000-0000-4000-8000-000000000002',displayName:'시험 가입자',email:'member@example.invalid',createdAt:'2026-10-01',emailConfirmed:true,status:'pending',administrator:false,version:3};
it('shows explicit confirmation, sends the selected account and version, and reloads only after success',async()=>{
  const api:AccountAccessClient={read:vi.fn(),list:vi.fn().mockResolvedValueOnce({accounts:[account],nextCursor:null}).mockResolvedValue({accounts:[{...account,status:'approved',version:4}],nextCursor:null}),set:vi.fn().mockResolvedValue(undefined)};
  render(<AccountAdministration api={api}/>);fireEvent.click(screen.getByRole('button',{name:'가입 계정 관리'}));
  await screen.findByText(account.email);fireEvent.click(screen.getByRole('button',{name:'승인'}));
  expect(api.set).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'취소'}));expect(api.set).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button',{name:'승인'}));fireEvent.click(screen.getByRole('button',{name:'변경 확인'}));
  await screen.findByRole('button',{name:'이용 중지'});
  expect(api.set).toHaveBeenCalledExactlyOnceWith(account.userId,'approved',3);
  expect(api.list).toHaveBeenCalledTimes(2);
});
it('protects administrators and prevents approval of an unconfirmed email',async()=>{
  const api:AccountAccessClient={read:vi.fn(),list:vi.fn().mockResolvedValue({accounts:[{...account,administrator:true,email:'owner@example.invalid'},{...account,emailConfirmed:false}],nextCursor:null}),set:vi.fn()};
  render(<AccountAdministration api={api}/>);fireEvent.click(screen.getByRole('button',{name:'가입 계정 관리'}));
  const owner=await screen.findByText('owner@example.invalid');expect(within(owner.closest('li')!).queryByRole('button')).toBeNull();
  expect(screen.getByRole('button',{name:'승인'})).toBeDisabled();
});
it('keeps stale or failed decisions visible and never displays a successful approval',async()=>{
  const api:AccountAccessClient={read:vi.fn(),list:vi.fn().mockResolvedValue({accounts:[account],nextCursor:null}),set:vi.fn().mockRejectedValue(Error('계정 상태가 변경되었습니다. 목록을 다시 불러와 주세요.'))};
  render(<AccountAdministration api={api}/>);fireEvent.click(screen.getByRole('button',{name:'가입 계정 관리'}));await screen.findByText(account.email);
  fireEvent.click(screen.getByRole('button',{name:'승인'}));fireEvent.click(screen.getByRole('button',{name:'변경 확인'}));
  await screen.findByRole('alert');expect(screen.queryByRole('status')).toBeNull();expect(screen.getByRole('button',{name:'변경 확인'})).toBeEnabled();
});
