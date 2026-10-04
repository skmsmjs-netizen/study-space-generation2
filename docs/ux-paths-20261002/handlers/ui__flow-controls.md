# src/ui/flow-controls.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-21f83fe70d86

**FlowControls** · [src/ui/flow-controls.tsx:8](../../../src/ui/flow-controls.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | useRef(null)<br>call |
| 10행 | 별도 조건식 없음 | useLayoutEffect(() => { host.current?.querySelector('.react-flow__controls')?.setAttribute('role', 'group'); }, [])<br>call<br>전달 콜백: H-db9ed3061829 |

반환/조기 중단: 13행 <render> [별도 조건식 없음]

## H-db9ed3061829

**@callback:useLayoutEffect** · [src/ui/flow-controls.tsx:10](../../../src/ui/flow-controls.tsx#L10)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

