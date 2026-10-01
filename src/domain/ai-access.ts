import { DomainError } from './model.ts';

// Existing confirmed app identity for 민석. Email/name/administrator are not grants.
// This ID is public configuration; only server-verified identity may authorize calls.
export const AI_OWNER_USER_ID = 'd33cf234-2998-43bd-b420-3ac056db4bea';
export function canUseOwnerAI(identity: { userId: string; namespace?: string }): boolean {
  return identity.userId === AI_OWNER_USER_ID && identity.namespace === 'personal';
}
export function requireOwnerAI(identity: { userId: string; namespace?: string }): void {
  if (!canUseOwnerAI(identity)) throw new DomainError('AI_OWNER_REQUIRED', 'AI 연결과 생성은 소유자 계정에서만 사용할 수 있습니다.');
}
