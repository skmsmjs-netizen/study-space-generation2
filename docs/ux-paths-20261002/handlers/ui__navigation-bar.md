# src/ui/navigation-bar.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-2aa9fef227fd

**NavigationBar** · [src/ui/navigation-bar.tsx:12](../../../src/ui/navigation-bar.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | items.map(item => <a key={item.href} href={item.href} data-navigation-focus={`navigation-item:${JSON.stringify([item.href, item.label])}`} aria-current={item.active ? 'page' : undefined}>{item.label}</a>)<br>call<br>전달 콜백: H-78b68a549f38 |

반환/조기 중단: 13행 <render> [별도 조건식 없음]

## H-78b68a549f38

**@callback:items.map** · [src/ui/navigation-bar.tsx:14](../../../src/ui/navigation-bar.tsx#L14)

분기 조건과 가능한 갈림길:

- B-cdfed2a4c990 · ConditionalExpression · item.active → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | JSON.stringify([item.href, item.label])<br>call |

