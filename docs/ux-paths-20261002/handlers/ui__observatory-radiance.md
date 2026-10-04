# src/ui/observatory-radiance.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-460e76bb1331

**clamp** · [src/ui/observatory-radiance.tsx:6](../../../src/ui/observatory-radiance.tsx#L6)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 6행 | 별도 조건식 없음 | Math.max(0, Math.min(1, value))<br>call |
| 6행 | 별도 조건식 없음 | Math.min(1, value)<br>call |

## H-40c036cd682f

**ease** · [src/ui/observatory-radiance.tsx:7](../../../src/ui/observatory-radiance.tsx#L7)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | clamp(value)<br>call → [H-460e76bb1331](ui__observatory-radiance.md#h-460e76bb1331) |

반환/조기 중단: 9행 x * x * (3 - 2 * x) [별도 조건식 없음]

## H-ea08f2da9f4d

**observatoryRadiance** · [src/ui/observatory-radiance.tsx:12](../../../src/ui/observatory-radiance.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | Math.abs(world.dynamics.change[0])<br>call |
| 25행 | 별도 조건식 없음 | ease((q - 0.5) / 3)<br>call → [H-40c036cd682f](ui__observatory-radiance.md#h-40c036cd682f) |
| 26행 | 별도 조건식 없음 | ease((q - 2) / 3)<br>call → [H-40c036cd682f](ui__observatory-radiance.md#h-40c036cd682f) |
| 27행 | 별도 조건식 없음 | ease((q - 4) / 4)<br>call → [H-40c036cd682f](ui__observatory-radiance.md#h-40c036cd682f) |
| 28행 | 별도 조건식 없음 | ease((q - 7) / 4)<br>call → [H-40c036cd682f](ui__observatory-radiance.md#h-40c036cd682f) |

반환/조기 중단: 17행 { rays: 6 + 36 * growth + 6 * activity, beacons: 2 + 8 * growth + 2 * returns, spread: 0.44 + 0.9 * growth + 0.1 * diversity, brightness: 0.3 + 0.42 * growth + 0.2 * activity, breath: 15 - 5 * activity - 3 * growth, revolution: 142 - 54 * growth - 24 * activity, pulse: 1.025 + 0.065 * growth + 0.04 * change, halo: ease((q - 0.5) / 3), counter: ease((q - 2) / 3), filaments: ease((q - 4) / 4), echo: ease((q - 7) / 4), warmth: 22 + 50 * growth + 18 * activity, } [별도 조건식 없음]

## H-16548e0b7402

**radianceStyle** · [src/ui/observatory-radiance.tsx:33](../../../src/ui/observatory-radiance.tsx#L33)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-735edb32d154

**ObservatoryRadiance** · [src/ui/observatory-radiance.tsx:84](../../../src/ui/observatory-radiance.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | 별도 조건식 없음 | observatoryRadiance(world)<br>call → [H-ea08f2da9f4d](ui__observatory-radiance.md#h-ea08f2da9f4d) |
| 86행 | 별도 조건식 없음 | useId()<br>call |
| 91행 | 별도 조건식 없음 | radianceStyle(p)<br>call → [H-16548e0b7402](ui__observatory-radiance.md#h-16548e0b7402) |
| 111행 | 별도 조건식 없음 | circles.map((d, i) => ( <g key={d} className="obs-rad-halo" style={{ animationDelay: `${(-i * p.breath) / 4}s` }} > <path d={d} className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'} opacity={1 - i * 0.18} /> </g> ))<br>call<br>전달 콜백: H-bda773000d09 |
| 130행 | 별도 조건식 없음 | filaments.map((line, i) => ( <path key={line.id} d={line.d} className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'} /> ))<br>call<br>전달 콜백: H-d018c74ebd62 |
| 139행 | 별도 조건식 없음 | rays.map((ray, i) => ( <path key={ray.id} d={ray.d} opacity={observatoryParticleOpacity(p.rays, i) * (i % 3 === 0 ? 0.88 : 0.55)} className={i % 4 === 0 ? 'obs-rad-white' : 'obs-rad-warm'} data-radiance-ray={i} /> ))<br>call<br>전달 콜백: H-e940693dfb6b |
| 151행 | 별도 조건식 없음 | counterRays.map((ray, i) => ( <path key={ray.id} d={ray.d} className={i % 3 ? 'obs-rad-warm' : 'obs-rad-cool'} /> ))<br>call<br>전달 콜백: H-f312c4dc86f4 |
| 157행 | 별도 조건식 없음 | [0, 1, 2].map((i) => ( <g key={i} className="obs-rad-echo" style={{ animationDelay: `${(-i * p.breath) / 3}s` }} > <path d={circles[3]} className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'} /> </g> ))<br>call<br>전달 콜백: H-c5b376bde036 |

반환/조기 중단: 87행 <render> [별도 조건식 없음]

## H-bda773000d09

**@callback:circles.map** · [src/ui/observatory-radiance.tsx:111](../../../src/ui/observatory-radiance.tsx#L111)

분기 조건과 가능한 갈림길:

- B-e152fba2493c · ConditionalExpression · i % 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (119행).

## H-d018c74ebd62

**@callback:filaments.map** · [src/ui/observatory-radiance.tsx:130](../../../src/ui/observatory-radiance.tsx#L130)

분기 조건과 가능한 갈림길:

- B-d781dffa5e16 · ConditionalExpression · i % 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).

## H-e940693dfb6b

**@callback:rays.map** · [src/ui/observatory-radiance.tsx:139](../../../src/ui/observatory-radiance.tsx#L139)

분기 조건과 가능한 갈림길:

- B-e3eeeff95bd2 · ConditionalExpression · i % 3 === 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (143행).
- B-b01341590788 · ConditionalExpression · i % 4 === 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (144행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | 별도 조건식 없음 | observatoryParticleOpacity(p.rays, i)<br>call |

## H-f312c4dc86f4

**@callback:counterRays.map** · [src/ui/observatory-radiance.tsx:151](../../../src/ui/observatory-radiance.tsx#L151)

분기 조건과 가능한 갈림길:

- B-083c89bacdde · ConditionalExpression · i % 3 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (152행).

## H-c5b376bde036

**@callback:[0, 1, 2].map** · [src/ui/observatory-radiance.tsx:157](../../../src/ui/observatory-radiance.tsx#L157)

분기 조건과 가능한 갈림길:

- B-c22eb32acc32 · ConditionalExpression · i % 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (163행).

## H-32e685f2e819

**ObservatoryRadianceGround** · [src/ui/observatory-radiance.tsx:183](../../../src/ui/observatory-radiance.tsx#L183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 184행 | 별도 조건식 없음 | observatoryRadiance(world)<br>call → [H-ea08f2da9f4d](ui__observatory-radiance.md#h-ea08f2da9f4d) |
| 186행 | 별도 조건식 없음 | radianceStyle(p)<br>call → [H-16548e0b7402](ui__observatory-radiance.md#h-16548e0b7402) |
| 187행 | 별도 조건식 없음 | beaconStones.map((stone, i) => ( <g key={stone.id} transform={`translate(${stone.x} ${stone.y})`} opacity={observatoryParticleOpacity(p.beacons, i)} > <path d="M-5 1h10v2H-5M-3 3h7v1h-7" className="obs-rad-stone" /> <g className="obs-rad-beacon" style={{ animationDelay: `${(-i * p.breath) / 12}s` }}> <path d="M-5 -1h10v1H-5M-3 -2h6v1h-6" className="obs-rad-warm" opacity=".24" /> <path d="M-1 -2h2v2h-2" className="obs-rad-white" /> <path d="M-2 5h5v1h-5" className="obs-rad-warm" opacity=".18" /> </g> </g> ))<br>call<br>전달 콜백: H-f7139cdf3e4e |

반환/조기 중단: 185행 <render> [별도 조건식 없음]

## H-f7139cdf3e4e

**@callback:beaconStones.map** · [src/ui/observatory-radiance.tsx:187](../../../src/ui/observatory-radiance.tsx#L187)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 191행 | 별도 조건식 없음 | observatoryParticleOpacity(p.beacons, i)<br>call |

