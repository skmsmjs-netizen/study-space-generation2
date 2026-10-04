# src/ui/motion-rive.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-65ebb22d39be

**InteractiveMotionCard** · [src/ui/motion-rive.tsx:10](../../../src/ui/motion-rive.tsx#L10)

분기 조건과 가능한 갈림길:

- B-9f2599be2a59 · ConditionalExpression · failed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (17행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | usePlayerMotion()<br>call → [H-7fb5a6caa8f5](ui__motion.md#h-7fb5a6caa8f5) |
| 11행 | 별도 조건식 없음 | useState(false)<br>call |
| 11행 | 별도 조건식 없음 | useState('3')<br>call |
| 12행 | 별도 조건식 없음 | useRive({ src: assetUrl, stateMachines: 'State Machine 1', autoplay: playing, onLoadError: () => setFailed(true) })<br>call |
| 13행 | 별도 조건식 없음 | useStateMachineInput(rive, 'State Machine 1', 'rating')<br>call |
| 14행 | 별도 조건식 없음 | useEffect(() => { if (rating) rating.value = Number(stars); }, [rating, stars])<br>call<br>전달 콜백: H-ca26f9cec312 |
| 15행 | 별도 조건식 없음 | useEffect(() => { if (playing) rive?.play(); else rive?.pause(); }, [playing, rive])<br>call<br>전달 콜백: H-89194fdf62c0 |
| 17행 | falsy: failed ∧ visible-when-falsy: enabled | '★'.repeat(Number(stars))<br>call |
| 17행 | falsy: failed ∧ visible-when-falsy: enabled | Number(stars)<br>call |
| 17행 | falsy: failed ∧ visible-when-falsy: enabled | '☆'.repeat(5 - Number(stars))<br>call |
| 17행 | falsy: failed ∧ visible-when-falsy: enabled | Number(stars)<br>call |
| 18행 | 별도 조건식 없음 | [1, 2, 3, 4, 5].map(value => ({ id: String(value), label: `${value}개` }))<br>call<br>전달 콜백: H-455d23820b18 |

반환/조기 중단: 16행 <render> [별도 조건식 없음]

## H-ca26f9cec312

**@callback:useEffect** · [src/ui/motion-rive.tsx:14](../../../src/ui/motion-rive.tsx#L14)

분기 조건과 가능한 갈림길:

- B-eb9ae77f8972 · IfStatement · rating → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | truthy: rating | Number(stars)<br>call |

## H-89194fdf62c0

**@callback:useEffect** · [src/ui/motion-rive.tsx:15](../../../src/ui/motion-rive.tsx#L15)

분기 조건과 가능한 갈림길:

- B-15334873b70a · IfStatement · playing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (15행).

## H-455d23820b18

**@callback:[1, 2, 3, 4, 5].map** · [src/ui/motion-rive.tsx:18](../../../src/ui/motion-rive.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | String(value)<br>call |

