# src/ui/ui-performance-access.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-65da525f4c86

**UiPerformanceAccess** · [src/ui/ui-performance-access.tsx:4](../../../src/ui/ui-performance-access.tsx#L4)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 5행 | 별도 조건식 없음 | useState(false)<br>call |

반환/조기 중단: 6행 <render> [별도 조건식 없음]

## H-09108154b280

**@onClick** · [src/ui/ui-performance-access.tsx:8](../../../src/ui/ui-performance-access.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-fee75cb6e988

**@onClose** · [src/ui/ui-performance-access.tsx:11](../../../src/ui/ui-performance-access.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | truthy: open | setOpen(false)<br>state-update |

