# src/ui/account-settings.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-6cf193070b98

**AccountSettings** · [src/ui/account-settings.tsx:5](../../../src/ui/account-settings.tsx#L5)

분기 조건과 가능한 갈림길:

- B-271c5886d908 · ConditionalExpression · !deleting → truthy / falsy; 바깥 조건: truthy: open (31행).
- B-7d59ac43992d · ConditionalExpression · busy → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: !deleting (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 6행 | 별도 조건식 없음 | useState(access.displayName===null)<br>call |
| 6행 | 별도 조건식 없음 | useState(access.displayName??'')<br>call |
| 7행 | 별도 조건식 없음 | useState(false)<br>call |
| 7행 | 별도 조건식 없음 | useState('')<br>call |
| 7행 | 별도 조건식 없음 | useState(false)<br>call |
| 7행 | 별도 조건식 없음 | useState('')<br>call |
| 7행 | 별도 조건식 없음 | useState('')<br>call |

반환/조기 중단: 22행 <render> [별도 조건식 없음]

## H-ecc22e06213b

**saveName** · [src/ui/account-settings.tsx:8](../../../src/ui/account-settings.tsx#L8) · async

분기 조건과 가능한 갈림길:

- B-b3a3fa4302b1 · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (9행).
- B-9f528640adcd · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (10행).
- B-2221b6031e6a · IfStatement · !api.saveName → truthy / falsy; 바깥 조건: 별도 조건식 없음 (10행).
- B-d1dcf93ee31b · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (11행).
- B-9e395acf7016 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 9행 | 별도 조건식 없음 | setError('')<br>state-update |
| 9행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 10행 | 별도 조건식 없음 | validateAccountName(name)<br>call |
| 10행 | truthy: !api.saveName | Error('계정 연결을 확인해 주세요.')<br>call |
| 10행 | 별도 조건식 없음 | api.saveName(valid)<br>mutation-request |
| 10행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 10행 | 별도 조건식 없음 | setName(saved.displayName??valid)<br>state-update |
| 10행 | 별도 조건식 없음 | setNotice('이름을 저장했습니다.')<br>state-update |
| 11행 | exception: error | setError(error instanceof Error?error.message:'이름을 저장하지 못했습니다.')<br>state-update |
| 11행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 9행 <render> [truthy: busy]

throw: 10행 Error('계정 연결을 확인해 주세요.')

## H-d474141ed619

**withdraw** · [src/ui/account-settings.tsx:13](../../../src/ui/account-settings.tsx#L13) · async

분기 조건과 가능한 갈림길:

- B-6fa9a89fcb7e · IfStatement · busy||confirmation!=='탈퇴' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-4cc0a3930b1f · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (15행).
- B-72ceea16cd4f · IfStatement · !api.withdraw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (15행).
- B-2d1e808c7507 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (16행).
- B-0ed87702fae1 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 14행 | 별도 조건식 없음 | setError('')<br>state-update |
| 15행 | truthy: !api.withdraw | Error('탈퇴 연결을 확인해 주세요.')<br>call |
| 15행 | 별도 조건식 없음 | api.withdraw()<br>mutation-request |
| 15행 | 별도 조건식 없음 | onWithdrawn()<br>call |
| 16행 | exception: error | setError(error instanceof Error?error.message:'탈퇴 결과를 확인하지 못했습니다. 다시 로그인하여 계정 상태를 확인해 주세요.')<br>state-update |
| 16행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 14행 <render> [truthy: busy||confirmation!=='탈퇴']

throw: 15행 Error('탈퇴 연결을 확인해 주세요.')

## H-06f9b3dfd913

**download** · [src/ui/account-settings.tsx:18](../../../src/ui/account-settings.tsx#L18) · async

분기 조건과 가능한 갈림길:

- B-31a7a5f75d29 · IfStatement · busy||!onDownload → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-cb161b5ee8a0 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (20행).
- B-92fcee58fde5 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 19행 | 별도 조건식 없음 | setError('')<br>state-update |
| 20행 | 별도 조건식 없음 | onDownload()<br>call |
| 20행 | exception: exception | setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.')<br>state-update |
| 20행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 19행 <render> [truthy: busy||!onDownload]

## H-2e6f3545af9e

**@onClick** · [src/ui/account-settings.tsx:22](../../../src/ui/account-settings.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | setOpen(true)<br>state-update |
| 22행 | 별도 조건식 없음 | setError('')<br>state-update |
| 22행 | 별도 조건식 없음 | setNotice('')<br>state-update |

## H-7ac38736a6cb

**@onClose** · [src/ui/account-settings.tsx:23](../../../src/ui/account-settings.tsx#L23)

분기 조건과 가능한 갈림길:

- B-3720d55cd548 · IfStatement · !busy → truthy / falsy; 바깥 조건: truthy: open (23행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | truthy: open ∧ truthy: !busy | setOpen(false)<br>state-update |
| 23행 | truthy: open ∧ truthy: !busy | setDeleting(false)<br>state-update |
| 23행 | truthy: open ∧ truthy: !busy | setConfirmation('')<br>state-update |

## H-93f6d6c90533

**@onSubmit** · [src/ui/account-settings.tsx:25](../../../src/ui/account-settings.tsx#L25)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | truthy: open | event.preventDefault()<br>input-control |
| 25행 | truthy: open | saveName()<br>call → [H-ecc22e06213b](ui__account-settings.md#h-ecc22e06213b) |

## H-c049490111c5

**@onChange** · [src/ui/account-settings.tsx:25](../../../src/ui/account-settings.tsx#L25)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | truthy: open | setName(event.target.value)<br>state-update |

## H-ee288e4058c0

**@onClick** · [src/ui/account-settings.tsx:29](../../../src/ui/account-settings.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | truthy: open ∧ truthy: onDownload | download()<br>call → [H-06f9b3dfd913](ui__account-settings.md#h-06f9b3dfd913) |

## H-449b3dbb0c96

**@onClick** · [src/ui/account-settings.tsx:31](../../../src/ui/account-settings.tsx#L31)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | truthy: open ∧ truthy: !deleting | setDeleting(true)<br>state-update |
| 31행 | truthy: open ∧ truthy: !deleting | setConfirmation('')<br>state-update |
| 31행 | truthy: open ∧ truthy: !deleting | setError('')<br>state-update |

## H-7885696059ca

**@onChange** · [src/ui/account-settings.tsx:32](../../../src/ui/account-settings.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | truthy: open ∧ falsy: !deleting | setConfirmation(event.target.value)<br>state-update |

## H-6255993ed8c8

**@onClick** · [src/ui/account-settings.tsx:33](../../../src/ui/account-settings.tsx#L33)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | truthy: open ∧ falsy: !deleting | withdraw()<br>call → [H-d474141ed619](ui__account-settings.md#h-d474141ed619) |

## H-bd7ff41bb3ef

**@onClick** · [src/ui/account-settings.tsx:33](../../../src/ui/account-settings.tsx#L33)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | truthy: open ∧ falsy: !deleting | setDeleting(false)<br>state-update |
| 33행 | truthy: open ∧ falsy: !deleting | setConfirmation('')<br>state-update |

