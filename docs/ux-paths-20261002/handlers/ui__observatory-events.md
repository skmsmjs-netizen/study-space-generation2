# src/ui/observatory-events.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-52a07e0da389

**motif** · [src/ui/observatory-events.tsx:18](../../../src/ui/observatory-events.tsx#L18)

분기 조건과 가능한 갈림길:

- B-390574ae90d2 · SwitchCase · 'valley-cloud' → case; 바깥 조건: 별도 조건식 없음 (20행).
- B-5b156a416d16 · SwitchCase · 'sundog-pair' → case; 바깥 조건: 별도 조건식 없음 (27행).
- B-093babeddd65 · SwitchCase · 'dew-web' → case; 바깥 조건: 별도 조건식 없음 (35행).
- B-2647b2644697 · SwitchCase · 'warm-updraft' → case; 바깥 조건: 별도 조건식 없음 (45행).
- B-1cd4efd93dbc · SwitchCase · 'mist-bow' → case; 바깥 조건: 별도 조건식 없음 (52행).
- B-95df40632275 · SwitchCase · 'bird-thermal' → case; 바깥 조건: 별도 조건식 없음 (60행).
- B-0c8fcd78cca7 · SwitchCase · 'cumulus-fleet' → case; 바깥 조건: 별도 조건식 없음 (66행).
- B-71c77d3d4198 · SwitchCase · 'ice-prism' → case; 바깥 조건: 별도 조건식 없음 (77행).
- B-73c7252cfd72 · SwitchCase · 'solar-glitter' → case; 바깥 조건: 별도 조건식 없음 (85행).
- B-59ce2fd21ecc · SwitchCase · 'wind-ripple' → case; 바깥 조건: 별도 조건식 없음 (92행).
- B-2d025f5cb30d · SwitchCase · 'virga-curtain' → case; 바깥 조건: 별도 조건식 없음 (99행).
- B-0d8e57dc2a71 · SwitchCase · 'cloud-shadow' → case; 바깥 조건: 별도 조건식 없음 (111행).
- B-1a8edd1cf775 · SwitchCase · 'amber-anvil' → case; 바깥 조건: 별도 조건식 없음 (118행).
- B-c9bb2561e38b · SwitchCase · 'alpenglow' → case; 바깥 조건: 별도 조건식 없음 (129행).
- B-6acfdae080d8 · SwitchCase · 'sunset-fan' → case; 바깥 조건: 별도 조건식 없음 (137행).
- B-465898aff00a · SwitchCase · 'iridescent-cloud' → case; 바깥 조건: 별도 조건식 없음 (144행).
- B-190bf12f73ea · SwitchCase · 'ember-drift' → case; 바깥 조건: 별도 조건식 없음 (156행).
- B-f7caaa6bbe82 · SwitchCase · 'horizon-mirage' → case; 바깥 조건: 별도 조건식 없음 (163행).
- B-a5163718afdd · SwitchCase · 'lunar-corona' → case; 바깥 조건: 별도 조건식 없음 (173행).
- B-2472e957bba9 · SwitchCase · 'firefly-garden' → case; 바깥 조건: 별도 조건식 없음 (181행).
- B-f1aa6289f812 · SwitchCase · 'star-sailing' → case; 바깥 조건: 별도 조건식 없음 (189행).
- B-cac94dad6218 · SwitchCase · 'moonlit-cloud' → case; 바깥 조건: 별도 조건식 없음 (197행).
- B-d0a944090d72 · SwitchCase · 'satellite-crossing' → case; 바깥 조건: 별도 조건식 없음 (204행).
- B-4964d2bf7cea · SwitchCase · 'silver-fog' → case; 바깥 조건: 별도 조건식 없음 (212행).
- B-9678fd6a7399 · SwitchCase · 'aurora-fold' → case; 바깥 조건: 별도 조건식 없음 (219행).
- B-58f1f194f23d · SwitchCase · 'meteor-fan' → case; 바깥 조건: 별도 조건식 없음 (230행).
- B-7a4cc982f04e · SwitchCase · 'airglow-tide' → case; 바깥 조건: 별도 조건식 없음 (238행).
- B-3a4190edb7cc · SwitchCase · 'cosmic-lens' → case; 바깥 조건: 별도 조건식 없음 (250행).
- B-82e79be90e1e · SwitchCase · 'comet-fragments' → case; 바깥 조건: 별도 조건식 없음 (258행).
- B-9d6c64bef8c1 · SwitchCase · 'quiet-snow' → case; 바깥 조건: 별도 조건식 없음 (265행).
- B-5eafdd371ec2 · SwitchCase · 'silver-mesh' → case; 바깥 조건: 별도 조건식 없음 (272행).
- B-3ed92970fda7 · SwitchCase · 'zodiacal-pyramid' → case; 바깥 조건: 별도 조건식 없음 (282행).
- B-74525f8cbd82 · SwitchCase · 'venus-belt' → case; 바깥 조건: 별도 조건식 없음 (290행).
- B-9127e51ec7d4 · SwitchCase · 'frost-grass' → case; 바깥 조건: 별도 조건식 없음 (302행).
- B-f2a79100a24b · SwitchCase · 'fog-lift' → case; 바깥 조건: 별도 조건식 없음 (309행).
- B-3bc53073cabd · SwitchCase · 'last-star' → case; 바깥 조건: 별도 조건식 없음 (321행).
- B-9d15e8fc10ed · SwitchCase · 구조 분기 → case; 바깥 조건: 별도 조건식 없음 (329행).

반환/조기 중단: 21행 <render> [truthy: id === 'valley-cloud']; 28행 <render> [truthy: id === 'sundog-pair']; 36행 <render> [truthy: id === 'dew-web']; 46행 <render> [truthy: id === 'warm-updraft']; 53행 <render> [truthy: id === 'mist-bow']; 61행 <render> [truthy: id === 'bird-thermal']; 67행 <render> [truthy: id === 'cumulus-fleet']; 78행 <render> [truthy: id === 'ice-prism']; 86행 <render> [truthy: id === 'solar-glitter']; 93행 <render> [truthy: id === 'wind-ripple']; 100행 <render> [truthy: id === 'virga-curtain']; 112행 <render> [truthy: id === 'cloud-shadow']; 119행 <render> [truthy: id === 'amber-anvil']; 130행 <render> [truthy: id === 'alpenglow']; 138행 <render> [truthy: id === 'sunset-fan']; 145행 <render> [truthy: id === 'iridescent-cloud']; 157행 <render> [truthy: id === 'ember-drift']; 164행 <render> [truthy: id === 'horizon-mirage']; 174행 <render> [truthy: id === 'lunar-corona']; 182행 <render> [truthy: id === 'firefly-garden']; 190행 <render> [truthy: id === 'star-sailing']; 198행 <render> [truthy: id === 'moonlit-cloud']; 205행 <render> [truthy: id === 'satellite-crossing']; 213행 <render> [truthy: id === 'silver-fog']; 220행 <render> [truthy: id === 'aurora-fold']; 231행 <render> [truthy: id === 'meteor-fan']; 239행 <render> [truthy: id === 'airglow-tide']; 251행 <render> [truthy: id === 'cosmic-lens']; 259행 <render> [truthy: id === 'comet-fragments']; 266행 <render> [truthy: id === 'quiet-snow']; 273행 <render> [truthy: id === 'silver-mesh']; 283행 <render> [truthy: id === 'zodiacal-pyramid']; 291행 <render> [truthy: id === 'venus-belt']; 303행 <render> [truthy: id === 'frost-grass']; 310행 <render> [truthy: id === 'fog-lift']; 322행 <render> [truthy: id === 'last-star']; 330행 null [별도 조건식 없음]

## H-8623a151264c

**placement** · [src/ui/observatory-events.tsx:333](../../../src/ui/observatory-events.tsx#L333)

분기 조건과 가능한 갈림길:

- B-52417962f6a2 · IfStatement · event.spec.ground → truthy / falsy; 바깥 조건: 별도 조건식 없음 (338행).
- B-558665122fbb · IfStatement · ['valley-cloud', 'silver-fog', 'fog-lift'].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (339행).
- B-0965ee5debc2 · IfStatement · id === 'sundog-pair' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (343행).
- B-b20cd8f1a235 · ConditionalExpression · i % 2 → truthy / falsy; 바깥 조건: truthy: id === 'sundog-pair' (344행).
- B-e1957a5a6ff8 · IfStatement · id === 'mist-bow' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (347행).
- B-c7764f285cf2 · IfStatement · id === 'lunar-corona' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (351행).
- B-8eba91ef06ef · IfStatement · id === 'sunset-fan' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (355행).
- B-e9c22eca207a · IfStatement · id === 'horizon-mirage' || id === 'venus-belt' || id === 'airglow-tide' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (359행).
- B-7271fa5490d6 · ConditionalExpression · id === 'airglow-tide' → truthy / falsy; 바깥 조건: truthy: id === 'horizon-mirage' || id === 'venus-belt' || id === 'airglow-tide' (361행).
- B-8b14bc47c5bc · IfStatement · id === 'alpenglow' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (363행).
- B-77f5dc1673c1 · IfStatement · id === 'zodiacal-pyramid' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (367행).
- B-a457675608c6 · IfStatement · id === 'cosmic-lens' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (371행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 335행 | 별도 조건식 없음 | landscapeSeed(`${id}:${i}`)<br>call |
| 339행 | 별도 조건식 없음 | ['valley-cloud', 'silver-fog', 'fog-lift'].includes(id)<br>call |
| 344행 | truthy: id === 'sundog-pair' | Math.floor(i / 2)<br>call |

반환/조기 중단: 375행 { x, y } [별도 조건식 없음]

## H-f2e08a33bcb1

**movement** · [src/ui/observatory-events.tsx:377](../../../src/ui/observatory-events.tsx#L377)

분기 조건과 가능한 갈림길:

- B-eebb3f8f6344 · IfStatement · [ 'bird-thermal', 'satellite-crossing', 'star-sailing', 'comet-fragments', 'meteor-fan', ].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (378행).
- B-9c405aa5e47f · IfStatement · ['warm-updraft', 'ember-drift', 'fog-lift'].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (388행).
- B-47efe496fdc0 · IfStatement · ['quiet-snow', 'virga-curtain'].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (389행).
- B-ae7a624dd83d · IfStatement · [ 'dew-web', 'sundog-pair', 'solar-glitter', 'ice-prism', 'last-star', 'lunar-corona', 'frost-grass', ].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (390행).
- B-2629b30f9530 · IfStatement · ['aurora-fold', 'wind-ripple', 'iridescent-cloud', 'silver-mesh'].includes(id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (402행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 379행 | 별도 조건식 없음 | [<br>      'bird-thermal',<br>      'satellite-crossing',<br>      'star-sailing',<br>      'comet-fragments',<br>      'meteor-fan',<br>    ].includes(id)<br>call |
| 388행 | 별도 조건식 없음 | ['warm-updraft', 'ember-drift', 'fog-lift'].includes(id)<br>preservation-boundary |
| 389행 | 별도 조건식 없음 | ['quiet-snow', 'virga-curtain'].includes(id)<br>call |
| 391행 | 별도 조건식 없음 | [<br>      'dew-web',<br>      'sundog-pair',<br>      'solar-glitter',<br>      'ice-prism',<br>      'last-star',<br>      'lunar-corona',<br>      'frost-grass',<br>    ].includes(id)<br>call |
| 402행 | 별도 조건식 없음 | ['aurora-fold', 'wind-ripple', 'iridescent-cloud', 'silver-mesh'].includes(id)<br>call |

반환/조기 중단: 387행 'evt-travel' [truthy: [
      'bird-thermal',
      'satellite-crossing',
      'star-sailing',
      'comet-fragments',
      'meteor-fan',
    ].includes(id)]; 388행 'evt-rise' [truthy: ['warm-updraft', 'ember-drift', 'fog-lift'].includes(id)]; 389행 'evt-fall' [truthy: ['quiet-snow', 'virga-curtain'].includes(id)]; 401행 'evt-breathe' [truthy: [
      'dew-web',
      'sundog-pair',
      'solar-glitter',
      'ice-prism',
      'last-star',
      'lunar-corona',
      'frost-grass',
    ].includes(id)]; 403행 'evt-fold' [truthy: ['aurora-fold', 'wind-ripple', 'iridescent-cloud', 'silver-mesh'].includes(id)]; 404행 'evt-drift' [별도 조건식 없음]

## H-deed8f95c5d4

**ObservatoryEvents** · [src/ui/observatory-events.tsx:406](../../../src/ui/observatory-events.tsx#L406)

분기 조건과 가능한 갈림길:

- B-13a417c99861 · ConditionalExpression · ground → truthy / falsy; 바깥 조건: 별도 조건식 없음 (418행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 415행 | 별도 조건식 없음 | useId()<br>call |
| 421행 | 별도 조건식 없음 | events<br>        .filter((event) => Boolean(event.spec.ground) === ground)<br>        .map((event) => ( <g key={event.spec.id} data-observatory-event={event.spec.id} data-event-base={event.spec.baseId} data-event-variant={event.spec.variant} data-event-phase={event.spec.phase} data-event-population={event.population} opacity={event.opacity} style={ { '--obs-event-duration': `${event.duration}s`, '--obs-event-amplitude': event.amplitude, '--obs-variation-detail': 0.22 + event.chroma * 0.42, '--obs-event-color': `color-mix(in ${event.spec.variant ? 'oklch' : 'srgb'}, var(--obs-coral) ${event.chroma * 100}%, var(--obs-time-light))`, } as CSSProperties } > {event.spec.variant > 0 && ( <defs> <g id={`${sceneId}-${event.spec.id}`}> <ObservatoryEventVariationSymbol event={event}> {motif( … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c9742fa43a65 |
| 421행 | 별도 조건식 없음 | events<br>        .filter((event) => Boolean(event.spec.ground) === ground)<br>call<br>전달 콜백: H-c2fa9b9ae5c0 |

반환/조기 중단: 416행 <render> [별도 조건식 없음]

## H-c2fa9b9ae5c0

**@callback:events
        .filter** · [src/ui/observatory-events.tsx:422](../../../src/ui/observatory-events.tsx#L422)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 422행 | 별도 조건식 없음 | Boolean(event.spec.ground)<br>call |

## H-c9742fa43a65

**@callback:events
        .filter((event) => Boolean(event.spec.ground) === ground)
        .map** · [src/ui/observatory-events.tsx:423](../../../src/ui/observatory-events.tsx#L423)

분기 조건과 가능한 갈림길:

- B-7e3525436634 · ConditionalExpression · event.spec.variant → truthy / falsy; 바깥 조건: 별도 조건식 없음 (437행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 445행 | truthy: event.spec.variant > 0 | motif(event.spec.baseId, 0)<br>call → [H-52a07e0da389](ui__observatory-events.md#h-52a07e0da389) |
| 450행 | 별도 조건식 없음 | Array.from({ length: event.spec.capacity }, (_, slotId) => slotId).map((i) => { const point = observatoryVariationPlacement(event, i, placement(event, i, sky)); return ( <g key={i} data-event-instance={i} transform={`translate(${point.x} ${point.y})`} opacity={observatoryParticleOpacity(event.population, i) * event.brightness} > {event.spec.variant ? ( <ObservatoryEventVariation event={event} index={i} symbolId={`${sceneId}-${event.spec.id}`} /> ) : ( <g className={movement(event.spec.baseId)} style={{ animationDelay: `${-i * 2.731}s` }} > {motif(event.spec.baseId, i)} </g> )} </g> ); })<br>call<br>전달 콜백: H-f137a9f2e8a6 |
| 450행 | 별도 조건식 없음 | Array.from({ length: event.spec.capacity }, (_, slotId) => slotId)<br>call<br>전달 콜백: H-05c91ee24e52 |

## H-05c91ee24e52

**@callback:Array.from** · [src/ui/observatory-events.tsx:450](../../../src/ui/observatory-events.tsx#L450)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f137a9f2e8a6

**@callback:Array.from({ length: event.spec.capacity }, (_, slotId) => slotId).map** · [src/ui/observatory-events.tsx:450](../../../src/ui/observatory-events.tsx#L450)

분기 조건과 가능한 갈림길:

- B-dd8398ea4c30 · ConditionalExpression · event.spec.variant → truthy / falsy; 바깥 조건: 별도 조건식 없음 (459행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 451행 | 별도 조건식 없음 | observatoryVariationPlacement(event, i, placement(event, i, sky))<br>call → [H-f93a1bdee03d](ui__observatory-event-variations.md#h-f93a1bdee03d) |
| 451행 | 별도 조건식 없음 | placement(event, i, sky)<br>call → [H-8623a151264c](ui__observatory-events.md#h-8623a151264c) |
| 457행 | 별도 조건식 없음 | observatoryParticleOpacity(event.population, i)<br>call |
| 467행 | falsy: event.spec.variant | movement(event.spec.baseId)<br>call → [H-f2e08a33bcb1](ui__observatory-events.md#h-f2e08a33bcb1) |
| 470행 | falsy: event.spec.variant | motif(event.spec.baseId, i)<br>call → [H-52a07e0da389](ui__observatory-events.md#h-52a07e0da389) |

반환/조기 중단: 452행 <render> [별도 조건식 없음]

