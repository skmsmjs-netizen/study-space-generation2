# src/ui/observatory-reactivity.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-cdbb8d22127d

**ObservatoryStudySky** · [src/ui/observatory-reactivity.tsx:18](../../../src/ui/observatory-reactivity.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | useId()<br>call |
| 21행 | 별도 조건식 없음 | Math.min(8, 2 * Math.log2(1 + inputCount))<br>call |
| 21행 | 별도 조건식 없음 | Math.log2(1 + inputCount)<br>call |
| 37행 | 별도 조건식 없음 | glimmers.map(([x, y], index) => ( <g key={x} transform={`translate(${x} ${y})`} data-study-star={index} opacity={observatoryParticleOpacity(population, index)} > <path d="M-.5 -2h1v1.5H2v1H.5V2h-1V.5H-2v-1h1.5z" className="obs-study-glimmer" style={{ animationDelay: `${-index * 1.7}s` }} /> <path d="M-3 -.5h6v1h-6M-.5 -3h1v6h-1" className="obs-study-star-halo" opacity={0.08 + 0.2 * density} /> </g> ))<br>call<br>전달 콜백: H-3e37c9478565 |

반환/조기 중단: 22행 <render> [별도 조건식 없음]

## H-3e37c9478565

**@callback:glimmers.map** · [src/ui/observatory-reactivity.tsx:37](../../../src/ui/observatory-reactivity.tsx#L37)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | observatoryParticleOpacity(population, index)<br>call |

## H-7c0e9a1cb6ab

**ObservatoryStudyStation** · [src/ui/observatory-reactivity.tsx:61](../../../src/ui/observatory-reactivity.tsx#L61)


반환/조기 중단: 63행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

