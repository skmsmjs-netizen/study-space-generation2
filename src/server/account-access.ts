import { DomainError } from '../domain/model';

export type AccessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export interface AccountAccess { status: AccessStatus; administrator: boolean; displayName?: string | null; withdrawalPending?: boolean }
export interface ManagedAccount extends AccountAccess {
  userId: string; email: string; createdAt: string; emailConfirmed: boolean; version: number;
}
export interface AccountPage { accounts: ManagedAccount[]; nextCursor: string | null; totalCount?: number }
export const accessStatuses: AccessStatus[] = ['pending', 'approved', 'rejected', 'suspended'];
export const accessMessages: Record<AccessStatus, string> = {
  pending: '관리자가 가입을 승인하면 내 공부 공간을 사용할 수 있습니다.',
  approved: '이용이 승인되었습니다.',
  rejected: '가입 요청이 승인되지 않았습니다. 이용이 필요하면 관리자에게 문의해 주세요.',
  suspended: '현재 이용이 중지되어 있습니다. 기존 기록은 삭제하지 않았습니다. 관리자에게 문의해 주세요.',
};
export function requireApproved(access: AccountAccess) {
  if (access.status !== 'approved') throw new DomainError('ACCESS_DENIED', accessMessages[access.status] ?? accessMessages.pending);
}
export function requireAdministrator(access: AccountAccess) {
  requireApproved(access);
  if (!access.administrator) throw new DomainError('ADMIN_REQUIRED', '관리자만 가입 계정을 관리할 수 있습니다.');
}

export function validateAccountName(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || [...value.trim()].length > 80 || /[\u0000-\u001f\u007f-\u009f]/.test(value)) throw new DomainError("NAME_REQUIRED", "이름을 1~80자로 입력해 주세요.");
  return value.trim();
}
