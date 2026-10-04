# src/ui/observatory-event-variations.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-f93a1bdee03d

**observatoryVariationPlacement** · [src/ui/observatory-event-variations.tsx:301](../../../src/ui/observatory-event-variations.tsx#L301)

분기 조건과 가능한 갈림길:

- B-301ca1d7ee8a · IfStatement · !event.spec.variant → truthy / falsy; 바깥 조건: 별도 조건식 없음 (306행).
- B-541df9d6589b · IfStatement · family === 'halo' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (309행).
- B-d04baba49e69 · ConditionalExpression · event.spec.ground → truthy / falsy; 바깥 조건: 별도 조건식 없음 (311행).
- B-8f8d83df1604 · ConditionalExpression · event.spec.ground → truthy / falsy; 바깥 조건: 별도 조건식 없음 (315행).
- B-fee94c0d13a6 · ConditionalExpression · event.spec.ground → truthy / falsy; 바깥 조건: 별도 조건식 없음 (316행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 313행 | 별도 조건식 없음 | Math.max(24, Math.min(936, point.x + Math.sin(index * 1.71 + v) * reach))<br>call |
| 313행 | 별도 조건식 없음 | Math.min(936, point.x + Math.sin(index * 1.71 + v) * reach)<br>call |
| 313행 | 별도 조건식 없음 | Math.sin(index * 1.71 + v)<br>call |
| 314행 | 별도 조건식 없음 | Math.max(event.spec.ground ? 196 : -80, Math.min(event.spec.ground ? 287 : 184, point.y + Math.cos(index * 1.23 + v) * reach * 0.5))<br>call |
| 316행 | 별도 조건식 없음 | Math.min(event.spec.ground ? 287 : 184, point.y + Math.cos(index * 1.23 + v) * reach * 0.5)<br>call |
| 316행 | 별도 조건식 없음 | Math.cos(index * 1.23 + v)<br>call |

반환/조기 중단: 306행 point [truthy: !event.spec.variant]; 309행 point [truthy: family === 'halo']; 312행 { x: Math.max(24, Math.min(936, point.x + Math.sin(index * 1.71 + v) * reach)), y: Math.max( event.spec.ground ? 196 : -80, Math.min(event.spec.ground ? 287 : 184, point.y + Math.cos(index * 1.23 + v) * reach * 0.5), ), } [별도 조건식 없음]

## H-4da9db911081

**ObservatoryEventVariationSymbol** · [src/ui/observatory-event-variations.tsx:322](../../../src/ui/observatory-event-variations.tsx#L322)

분기 조건과 가능한 갈림길:

- B-02c881ddf3e2 · IfStatement · !event.spec.variant → truthy / falsy; 바깥 조건: 별도 조건식 없음 (329행).

반환/조기 중단: 329행 children [truthy: !event.spec.variant]; 331행 <render> [별도 조건식 없음]

## H-befc805f91be

**ObservatoryEventVariation** · [src/ui/observatory-event-variations.tsx:345](../../../src/ui/observatory-event-variations.tsx#L345)

분기 조건과 가능한 갈림길:

- B-f937d94e620a · IfStatement · !variant → truthy / falsy; 바깥 조건: 별도 조건식 없음 (355행).

반환/조기 중단: 355행 null [truthy: !variant]; 358행 <render> [별도 조건식 없음]

