# src/ui/observatory-details.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-d4e8510f8fd2

**ObservatorySkyDetails** · [src/ui/observatory-details.tsx:15](../../../src/ui/observatory-details.tsx#L15)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | useId()<br>call |
| 51행 | truthy: e.planet > 0 | dither.map((p) => ( <rect key={p.key} x={p.x} y={p.y} width="2" height="1" className="pixel-gold" opacity=".3" /> ))<br>call<br>전달 콜백: H-53c91bbf91e4 |
| 80행 | truthy: e.eclipse > 0 | rays.map((r) => ( <g key={r.key} transform={`rotate(${r.angle})`}> <path d="M-1 -34h2v8h-2" className="pixel-gold" opacity=".5" /> </g> ))<br>call<br>전달 콜백: H-f127f6f2765d |
| 87행 | truthy: e.eclipse > 0 | pixelDiscPath(17)<br>call → [H-b27f01902709](ui__observatory-atmosphere.md#h-b27f01902709) |
| 95행 | truthy: e.crown > 0 | rays.map((r) => ( <g key={r.key} transform={`rotate(${r.angle})`}> <path d="M-1 -48h2v11h-2M-2 -67h4v3h-4" className={r.angle % 60 ? 'pixel-gold' : 'pixel-rose'} /> </g> ))<br>call<br>전달 콜백: H-766b03f84de4 |

반환/조기 중단: 17행 <render> [별도 조건식 없음]

## H-53c91bbf91e4

**@callback:dither.map** · [src/ui/observatory-details.tsx:51](../../../src/ui/observatory-details.tsx#L51)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f127f6f2765d

**@callback:rays.map** · [src/ui/observatory-details.tsx:80](../../../src/ui/observatory-details.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-766b03f84de4

**@callback:rays.map** · [src/ui/observatory-details.tsx:95](../../../src/ui/observatory-details.tsx#L95)

분기 조건과 가능한 갈림길:

- B-12de8a2cded8 · ConditionalExpression · r.angle % 60 → truthy / falsy; 바깥 조건: truthy: e.crown > 0 (99행).

## H-a2ae411ce1f1

**ObservatoryStationDetails** · [src/ui/observatory-details.tsx:111](../../../src/ui/observatory-details.tsx#L111)


반환/조기 중단: 112행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

