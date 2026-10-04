# src/ui/observatory-atmosphere.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b27f01902709

**pixelDiscPath** · [src/ui/observatory-atmosphere.tsx:6](../../../src/ui/observatory-atmosphere.tsx#L6)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | Array.from({ length: Math.max(96, radius * 12) }, (_, index) => { const angle = (index * Math.PI * 2) / Math.max(96, radius * 12); return [Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius)]; })<br>call<br>전달 콜백: H-5cf06f760a63 |
| 7행 | 별도 조건식 없음 | Math.max(96, radius * 12)<br>call |
| 12행 | 별도 조건식 없음 | points.map(([x, y], index) => `${index ? 'H' : 'M'}${x}${index ? 'V' : ' '}${y}`).join('')<br>call |
| 12행 | 별도 조건식 없음 | points.map(([x, y], index) => `${index ? 'H' : 'M'}${x}${index ? 'V' : ' '}${y}`)<br>call<br>전달 콜백: H-fb713d5c73c1 |

반환/조기 중단: 11행 points.map(([x, y], index) => `${index ? 'H' : 'M'}${x}${index ? 'V' : ' '}${y}`).join('') + 'z' [별도 조건식 없음]

## H-5cf06f760a63

**@callback:Array.from** · [src/ui/observatory-atmosphere.tsx:7](../../../src/ui/observatory-atmosphere.tsx#L7)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | Math.max(96, radius * 12)<br>call |
| 9행 | 별도 조건식 없음 | Math.round(Math.cos(angle) * radius)<br>call |
| 9행 | 별도 조건식 없음 | Math.cos(angle)<br>call |
| 9행 | 별도 조건식 없음 | Math.round(Math.sin(angle) * radius)<br>call |
| 9행 | 별도 조건식 없음 | Math.sin(angle)<br>call |

반환/조기 중단: 9행 [Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius)] [별도 조건식 없음]

## H-fb713d5c73c1

**@callback:points.map** · [src/ui/observatory-atmosphere.tsx:12](../../../src/ui/observatory-atmosphere.tsx#L12)

분기 조건과 가능한 갈림길:

- B-d7facb990232 · ConditionalExpression · index → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).
- B-3ec470aa56f9 · ConditionalExpression · index → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).

## H-c8af157286e9

**ObservatoryClouds** · [src/ui/observatory-atmosphere.tsx:82](../../../src/ui/observatory-atmosphere.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | wisps.map((wisp, index) => ( <path key={wisp.key} d={wisp.path} className={index % 3 ? 'pixel-nebula-rose' : 'pixel-nebula-violet'} opacity={0.18 + (index % 3) * 0.12} /> ))<br>call<br>전달 콜백: H-d72e915ebea9 |
| 98행 | 별도 조건식 없음 | ribbons.map((path, index) => ( <path key={path} d={path} className={index === 1 ? 'pixel-rose' : 'pixel-mint'} /> ))<br>call<br>전달 콜백: H-b4e06f3fcc61 |

반환/조기 중단: 83행 <render> [별도 조건식 없음]

## H-d72e915ebea9

**@callback:wisps.map** · [src/ui/observatory-atmosphere.tsx:86](../../../src/ui/observatory-atmosphere.tsx#L86)

분기 조건과 가능한 갈림길:

- B-b4b86777ae21 · ConditionalExpression · index % 3 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (90행).

## H-b4e06f3fcc61

**@callback:ribbons.map** · [src/ui/observatory-atmosphere.tsx:98](../../../src/ui/observatory-atmosphere.tsx#L98)

분기 조건과 가능한 갈림길:

- B-f41853dbf674 · ConditionalExpression · index === 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (99행).

## H-ccbbc126c916

**ObservatoryGroundDetails** · [src/ui/observatory-atmosphere.tsx:107](../../../src/ui/observatory-atmosphere.tsx#L107)


반환/조기 중단: 108행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bcd45205a512

**ObservatoryDomeTiles** · [src/ui/observatory-atmosphere.tsx:110](../../../src/ui/observatory-atmosphere.tsx#L110)


반환/조기 중단: 111행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-35774fc77394

**ObservatoryShockwave** · [src/ui/observatory-atmosphere.tsx:114](../../../src/ui/observatory-atmosphere.tsx#L114)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 115행 | 별도 조건식 없음 | useId()<br>call |

반환/조기 중단: 116행 <render> [별도 조건식 없음]

