# src/ui/observatory-time-sky.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-1f2b435dbfcc

**ObservatoryTimeSky** · [src/ui/observatory-time-sky.tsx:26](../../../src/ui/observatory-time-sky.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | 별도 조건식 없음 | useId()<br>call |
| 75행 | 별도 조건식 없음 | cirrus.map((path, index) => ( <path key={path} d={path} className="pixel-time-cloud" strokeWidth={index % 2 ? '1' : '2'} /> ))<br>call<br>전달 콜백: H-58001f6c3014 |

반환/조기 중단: 29행 <render> [별도 조건식 없음]

## H-58001f6c3014

**@callback:cirrus.map** · [src/ui/observatory-time-sky.tsx:75](../../../src/ui/observatory-time-sky.tsx#L75)

분기 조건과 가능한 갈림길:

- B-6ebf8f55279d · ConditionalExpression · index % 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (80행).

## H-b160975a116f

**ObservatoryTimeGround** · [src/ui/observatory-time-sky.tsx:106](../../../src/ui/observatory-time-sky.tsx#L106)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | 별도 조건식 없음 | Math.sign(480 - sky.sun.x)<br>call |
| 113행 | 별도 조건식 없음 | Math.round(Math.min(165, Math.max(12, (64 * Math.abs(480 - sky.sun.x)) / Math.max(20, 213 - sky.sun.y))))<br>call |
| 114행 | 별도 조건식 없음 | Math.min(165, Math.max(12, (64 * Math.abs(480 - sky.sun.x)) / Math.max(20, 213 - sky.sun.y)))<br>call |
| 114행 | 별도 조건식 없음 | Math.max(12, (64 * Math.abs(480 - sky.sun.x)) / Math.max(20, 213 - sky.sun.y))<br>call |
| 114행 | 별도 조건식 없음 | Math.abs(480 - sky.sun.x)<br>call |
| 114행 | 별도 조건식 없음 | Math.max(20, 213 - sky.sun.y)<br>call |
| 116행 | 별도 조건식 없음 | Math.round(shadow * 0.58)<br>call |
| 127행 | 별도 조건식 없음 | fog.map((path) => ( <path key={path} d={path} className="pixel-time-cloud" strokeWidth="3" /> ))<br>call<br>전달 콜백: H-bcc068cb8c33 |
| 133행 | 별도 조건식 없음 | dew.map((point, index) => ( <g key={point.x} style={{ animationDelay: `${-index * 1.7}s` }} className="pixel-time-dew" > <path d={`M${point.x} ${point.y}h1v1h-1`} className="pixel-time-sun" /> </g> ))<br>call<br>전달 콜백: H-982b19ddba47 |

반환/조기 중단: 117행 <render> [별도 조건식 없음]

## H-bcc068cb8c33

**@callback:fog.map** · [src/ui/observatory-time-sky.tsx:127](../../../src/ui/observatory-time-sky.tsx#L127)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-982b19ddba47

**@callback:dew.map** · [src/ui/observatory-time-sky.tsx:133](../../../src/ui/observatory-time-sky.tsx#L133)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

