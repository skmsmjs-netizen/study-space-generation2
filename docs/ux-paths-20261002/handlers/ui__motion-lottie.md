# src/ui/motion-lottie.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-c0488ac14420

**BreathingAnimation** · [src/ui/motion-lottie.tsx:10](../../../src/ui/motion-lottie.tsx#L10)

분기 조건과 가능한 갈림길:

- B-d1b5cc3af2bd · ConditionalExpression · failed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-fde547477594 · ConditionalExpression · paused → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | usePlayerMotion()<br>call → [H-7fb5a6caa8f5](ui__motion.md#h-7fb5a6caa8f5) |
| 11행 | 별도 조건식 없음 | useState(null)<br>call |
| 11행 | 별도 조건식 없음 | useState(false)<br>call |
| 12행 | 별도 조건식 없음 | useEffect(() => { if (!player) return; const fail = () => setFailed(true); player.addEventListener('loadError', fail); return () => player.removeEventListener('loadError', fail); }, [player])<br>call<br>전달 콜백: H-e3c6b119ad88 |
| 18행 | 별도 조건식 없음 | useEffect(() => { if (playing) player?.play(); else player?.pause(); }, [playing, player])<br>call<br>전달 콜백: H-6152a9eb8b73 |

반환/조기 중단: 19행 <render> [별도 조건식 없음]

## H-e3c6b119ad88

**@callback:useEffect** · [src/ui/motion-lottie.tsx:12](../../../src/ui/motion-lottie.tsx#L12)

분기 조건과 가능한 갈림길:

- B-1babde86b048 · IfStatement · !player → truthy / falsy; 바깥 조건: 별도 조건식 없음 (13행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | player.addEventListener('loadError', fail)<br>call<br>전달 콜백: H-051c48b8e371 |

반환/조기 중단: 13행 <render> [truthy: !player]; 16행 () => player.removeEventListener('loadError', fail) [별도 조건식 없음]

## H-051c48b8e371

**fail** · [src/ui/motion-lottie.tsx:14](../../../src/ui/motion-lottie.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | setFailed(true)<br>state-update |

## H-6152a9eb8b73

**@callback:useEffect** · [src/ui/motion-lottie.tsx:18](../../../src/ui/motion-lottie.tsx#L18)

분기 조건과 가능한 갈림길:

- B-2d77842400f6 · IfStatement · playing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (18행).

## H-992225c00fe8

**@onClick** · [src/ui/motion-lottie.tsx:21](../../../src/ui/motion-lottie.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | setPaused(value => !value)<br>state-update<br>전달 콜백: H-e59d6a0aebd4 |

## H-e59d6a0aebd4

**@callback:setPaused** · [src/ui/motion-lottie.tsx:21](../../../src/ui/motion-lottie.tsx#L21)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

