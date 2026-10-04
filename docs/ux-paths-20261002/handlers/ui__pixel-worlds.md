# src/ui/pixel-worlds.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-ea59cce01b84

**ObservatoryWorld** · [src/ui/pixel-worlds.tsx:95](../../../src/ui/pixel-worlds.tsx#L95)

분기 조건과 가능한 갈림길:

- B-e6cfdfebd077 · ConditionalExpression · e.stage < 2 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (455행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | 별도 조건식 없음 | useId()<br>call |
| 124행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 130행 | truthy: visible.includes('garden') | coverStars.slice(0, 60).map((point, index) => ( <rect key={`upper-${point.key}`} x={point.x} y={-96 + (point.y % 89)} width="1" height="1" className="pixel-star" opacity={Math.max(0, Math.min(1, 10 + 4 * e.position - index)) * 0.4} /> ))<br>call<br>전달 콜백: H-2fce84ef1bc9 |
| 130행 | truthy: visible.includes('garden') | coverStars.slice(0, 60)<br>call |
| 141행 | truthy: visible.includes('garden') | coverStars.slice(0, 24 + Math.round(e.position * 14)).map((point, index) => ( <g key={point.key} className={index % 7 === 0 ? 'pixel-twinkle' : ''} style={{ animationDelay: -index * 0.7 + 's' }} > <rect x={point.x} y={point.y} width={point.size} height={point.size} className={['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]} opacity={0.25 + (index % 5) * 0.13} /> </g> ))<br>call<br>전달 콜백: H-a1468c2ad029 |
| 141행 | truthy: visible.includes('garden') | coverStars.slice(0, 24 + Math.round(e.position * 14))<br>call |
| 141행 | truthy: visible.includes('garden') | Math.round(e.position * 14)<br>call |
| 161행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 164행 | truthy: visible.includes('garden') && e.stage > 0 | burstParticles.slice(0, 16).map((point, index) => ( <path key={point.key} d={star} transform={`translate(${point.x * 2} ${point.y})`} className={['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]} /> ))<br>call<br>전달 콜백: H-4546fd515441 |
| 164행 | truthy: visible.includes('garden') && e.stage > 0 | burstParticles.slice(0, 16)<br>call |
| 177행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 180행 | truthy: visible.includes('garden') | galaxy.slice(0, 100).map((point) => ( <rect key={point.key} x={point.x} y={point.y} width="1" height="1" opacity={point.opacity} className="pixel-nebula-violet" /> ))<br>call<br>전달 콜백: H-b6579cca58e8 |
| 180행 | truthy: visible.includes('garden') | galaxy.slice(0, 100)<br>call |
| 193행 | truthy: visible.includes('garden') | galaxy.map((point) => ( <rect key={point.key} x={point.x} y={point.y} width={point.size} height={point.size} opacity={point.opacity} className={ ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][ point.key.length % 4 ] } /> ))<br>call<br>전달 콜백: H-98eb3c30212d |
| 222행 | truthy: visible.includes('garden') | stars.slice(0, e.stars).map((point) => ( <rect key={point.key} x={point.x} y={point.y} width={point.size} height={point.size} opacity={point.opacity} className={ ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][point.size % 4] } /> ))<br>call<br>전달 콜백: H-951d2003da3d |
| 222행 | truthy: visible.includes('garden') | stars.slice(0, e.stars)<br>call |
| 241행 | truthy: visible.includes('garden') | world.plants.map((plant, index) => ( <g key={plant.key} transform={`translate(${62 + (plant.seed % 187)} ${49 + (plant.seed % 71)})`} > <g className="pixel-starlight" style={{ animationDelay: `${-index * 1.3}s` }}> <path d={star} className="pixel-star" /> <path d="M-7 0h2v1h-2M5 0h2v1H5M0 -7h1v2H0M0 5h1v2H0" className="pixel-star" opacity=".3" /> </g> </g> ))<br>call<br>전달 콜백: H-920ee7863f17 |
| 264행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 277행 | truthy: visible.includes('garden') && e.supernova > 0 | burstParticles.map((point, index) => ( <g key={point.key} className="pixel-nova-particle" style={ { '--nova-x': point.x + 'px', '--nova-y': point.y + 'px', animationDelay: '.' + (index % 4) + 's', } as CSSProperties } > <path d={star} className={ ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4] } /> </g> ))<br>call<br>전달 콜백: H-6a07a6b01b7f |
| 306행 | 별도 조건식 없음 | visible.includes('river')<br>call |
| 319행 | truthy: visible.includes('river') | ['west', 'middle', 'east'].map((key, index) => ( <g key={key} transform={`translate(${72 + index * 73} ${41 + index * 17})`}> <g className="pixel-meteor" style={{ animationDelay: `${-index * 2.3}s` }}> <path d="M-12 -12h2v2h2v2h2v2h2v2h2v2h2v2h2v2H0V0h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2z" className="pixel-star" /> </g> </g> ))<br>call<br>전달 콜백: H-6602281bcd97 |
| 330행 | truthy: visible.includes('river') | world.days.map((day, index) => ( <rect key={day.key} x={46 + index * 18} y={199 - (day.seed % 3)} width="3" height="1" className="pixel-star" opacity=".55" /> ))<br>call<br>전달 콜백: H-bb2fb9d5a7b8 |
| 343행 | 별도 조건식 없음 | visible.includes('walk')<br>call |
| 348행 | truthy: visible.includes('walk') | rings.slice(0, e.orbits).map((path, index) => ( <g key={path}> <path d={path} className="pixel-orbit-line pixel-spectral-orbit" strokeOpacity={0.6 - index * 0.06} /> <g className={`pixel-orbit${index % 2 ? ' pixel-orbit--inner' : ''}`} style={{ animationDelay: `${-index * 4}s` }} > <g transform={`translate(${23 + index * 14} 0)`}> <path d="M-2 -4h4v2h2v4H2v2h-4V2h-2v-4h2z" className={ ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][ index % 4 ] } /> <path d="M-1 -2h1v2h-1" className="pixel-night" /> </g> </g> </g> ))<br>call<br>전달 콜백: H-81d6b2ee5d0d |
| 348행 | truthy: visible.includes('walk') | rings.slice(0, e.orbits)<br>call |
| 376행 | truthy: visible.includes('walk') | world.returns.map((visit, index) => ( <g key={visit.key} transform={`translate(${249 + (index % 3) * 10} ${175 + Math.floor(index / 3) * 6})`} > <path d="M0 0h1v1H0M3 2h1v1H3" className="pixel-star" opacity=".65" /> </g> ))<br>call<br>전달 콜백: H-8c8365f42175 |
| 386행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 388행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 408행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 410행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 439행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 452행 | 별도 조건식 없음 | visible.includes('garden')<br>call |
| 454행 | truthy: visible.includes('garden') | burstParticles<br>              .slice(0, e.stage < 2 ? 0 : Math.min(8, e.stage - 1))<br>              .map((point, index) => ( <g key={point.key} data-cursor-trail="true" opacity={(1 - index / 9) * 0.45}> <path d={index % 3 === 0 ? star : 'M-1 -1h2v2h-2z'} transform={`scale(${0.25 + e.colorBloom * 0.2})`} className={index % 2 ? 'pixel-gold' : 'pixel-rose'} /> </g> ))<br>call<br>전달 콜백: H-498b1eba585f |
| 454행 | truthy: visible.includes('garden') | burstParticles<br>              .slice(0, e.stage < 2 ? 0 : Math.min(8, e.stage - 1))<br>call |
| 455행 | truthy: visible.includes('garden') ∧ falsy: e.stage < 2 | Math.min(8, e.stage - 1)<br>call |
| 481행 | truthy: visible.includes('garden') | inspectionDust.map((dust, index) => ( <g key={dust.key} transform={`translate(${dust.x} ${dust.y})`} opacity={observatoryParticleOpacity( 6 + (36 * e.position) / 11 + 6 * world.dynamics.recent[0], index, )} > <g className="pixel-inspection-grain" style={{ animationDelay: `${dust.delay}s` }} > <path d={index % 7 === 0 ? 'M0 -2h1v2h2v1H1v2H0V1h-2V0h2z' : 'M0 0h1v1H0z'} className={index % 3 ? 'pixel-gold' : 'pixel-mint'} /> </g> </g> ))<br>call<br>전달 콜백: H-3d3238a69f8d |
| 524행 | truthy: visible.includes('garden') | burstParticles<br>                .slice(0, 4 + Math.round(8 * e.colorBloom + 8 * world.dynamics.recent[0]))<br>                .map((point, index) => ( <g key={point.key} transform={`translate(${Math.round(point.x * 0.4)} ${Math.round(point.y * 0.4)})`} > <g className="pixel-pointer-spark" style={{ animationDelay: -index * 0.3 + 's' }} > <path d={star} transform="scale(.4)" className={ ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4] } /> </g> </g> ))<br>call<br>전달 콜백: H-5656a7e04c9a |
| 524행 | truthy: visible.includes('garden') | burstParticles<br>                .slice(0, 4 + Math.round(8 * e.colorBloom + 8 * world.dynamics.recent[0]))<br>call |
| 525행 | truthy: visible.includes('garden') | Math.round(8 * e.colorBloom + 8 * world.dynamics.recent[0])<br>call |

반환/조기 중단: 104행 <render> [별도 조건식 없음]

## H-2fce84ef1bc9

**@callback:coverStars.slice(0, 60).map** · [src/ui/pixel-worlds.tsx:130](../../../src/ui/pixel-worlds.tsx#L130)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | truthy: visible.includes('garden') | Math.max(0, Math.min(1, 10 + 4 * e.position - index))<br>call |
| 138행 | truthy: visible.includes('garden') | Math.min(1, 10 + 4 * e.position - index)<br>call |

## H-a1468c2ad029

**@callback:coverStars.slice(0, 24 + Math.round(e.position * 14)).map** · [src/ui/pixel-worlds.tsx:141](../../../src/ui/pixel-worlds.tsx#L141)

분기 조건과 가능한 갈림길:

- B-d16dd2641fe4 · ConditionalExpression · index % 7 === 0 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (144행).

## H-4546fd515441

**@callback:burstParticles.slice(0, 16).map** · [src/ui/pixel-worlds.tsx:164](../../../src/ui/pixel-worlds.tsx#L164)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b6579cca58e8

**@callback:galaxy.slice(0, 100).map** · [src/ui/pixel-worlds.tsx:180](../../../src/ui/pixel-worlds.tsx#L180)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-98eb3c30212d

**@callback:galaxy.map** · [src/ui/pixel-worlds.tsx:193](../../../src/ui/pixel-worlds.tsx#L193)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-951d2003da3d

**@callback:stars.slice(0, e.stars).map** · [src/ui/pixel-worlds.tsx:222](../../../src/ui/pixel-worlds.tsx#L222)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-920ee7863f17

**@callback:world.plants.map** · [src/ui/pixel-worlds.tsx:241](../../../src/ui/pixel-worlds.tsx#L241)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6a07a6b01b7f

**@callback:burstParticles.map** · [src/ui/pixel-worlds.tsx:277](../../../src/ui/pixel-worlds.tsx#L277)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6602281bcd97

**@callback:['west', 'middle', 'east'].map** · [src/ui/pixel-worlds.tsx:319](../../../src/ui/pixel-worlds.tsx#L319)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bb2fb9d5a7b8

**@callback:world.days.map** · [src/ui/pixel-worlds.tsx:330](../../../src/ui/pixel-worlds.tsx#L330)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-81d6b2ee5d0d

**@callback:rings.slice(0, e.orbits).map** · [src/ui/pixel-worlds.tsx:348](../../../src/ui/pixel-worlds.tsx#L348)

분기 조건과 가능한 갈림길:

- B-f53454d6c229 · ConditionalExpression · index % 2 → truthy / falsy; 바깥 조건: truthy: visible.includes('walk') (356행).

## H-8c8365f42175

**@callback:world.returns.map** · [src/ui/pixel-worlds.tsx:376](../../../src/ui/pixel-worlds.tsx#L376)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 379행 | truthy: visible.includes('walk') | Math.floor(index / 3)<br>call |

## H-498b1eba585f

**@callback:burstParticles
              .slice(0, e.stage < 2 ? 0 : Math.min(8, e.stage - 1))
              .map** · [src/ui/pixel-worlds.tsx:456](../../../src/ui/pixel-worlds.tsx#L456)

분기 조건과 가능한 갈림길:

- B-b10e6b35bbb7 · ConditionalExpression · index % 3 === 0 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (459행).
- B-dedcd9fb3c23 · ConditionalExpression · index % 2 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (461행).

## H-3d3238a69f8d

**@callback:inspectionDust.map** · [src/ui/pixel-worlds.tsx:481](../../../src/ui/pixel-worlds.tsx#L481)

분기 조건과 가능한 갈림길:

- B-9f97a8759558 · ConditionalExpression · index % 7 === 0 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (495행).
- B-554432da79bc · ConditionalExpression · index % 3 → truthy / falsy; 바깥 조건: truthy: visible.includes('garden') (496행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 485행 | truthy: visible.includes('garden') | observatoryParticleOpacity(6 + (36 * e.position) / 11 + 6 * world.dynamics.recent[0], index)<br>call |

## H-5656a7e04c9a

**@callback:burstParticles
                .slice(0, 4 + Math.round(8 * e.colorBloom + 8 * world.dynamics.recent[0]))
                .map** · [src/ui/pixel-worlds.tsx:526](../../../src/ui/pixel-worlds.tsx#L526)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 529행 | truthy: visible.includes('garden') | Math.round(point.x * 0.4)<br>call |
| 529행 | truthy: visible.includes('garden') | Math.round(point.y * 0.4)<br>call |

