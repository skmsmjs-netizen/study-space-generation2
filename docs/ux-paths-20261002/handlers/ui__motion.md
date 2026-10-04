# src/ui/motion.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-4d25d4476977

**readMotion** · [src/ui/motion.tsx:9](../../../src/ui/motion.tsx#L9)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-95bcf2c73ca7

**subscribeMotion** · [src/ui/motion.tsx:13](../../../src/ui/motion.tsx#L13)

분기 조건과 가능한 갈림길:

- B-9c27950e42fb · IfStatement · !stopListening → truthy / falsy; 바깥 조건: 별도 조건식 없음 (15행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | subscribers.add(update)<br>call |
| 19행 | truthy: !stopListening | document.addEventListener('visibilitychange', publish)<br>call<br>전달 콜백: H-1d32215910df |
| 21행 | truthy: !stopListening | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })<br>call |

반환/조기 중단: 24행 () => { subscribers.delete(update); if (!subscribers.size) { stopListening?.(); stopListening = undefined; } } [별도 조건식 없음]

## H-1d32215910df

**publish** · [src/ui/motion.tsx:16](../../../src/ui/motion.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | truthy: !stopListening | listener()<br>call |

## H-f857690626c5

**useMotionEnabled** · [src/ui/motion.tsx:29](../../../src/ui/motion.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | useSyncExternalStore(subscribeMotion, readMotion, () => false)<br>call<br>전달 콜백: H-95bcf2c73ca7, H-4d25d4476977, H-2d0ee6d7d7bd |

반환/조기 중단: 29행 useSyncExternalStore(subscribeMotion, readMotion, () => false) [별도 조건식 없음]

## H-2d0ee6d7d7bd

**@callback:useSyncExternalStore** · [src/ui/motion.tsx:29](../../../src/ui/motion.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7fb5a6caa8f5

**usePlayerMotion** · [src/ui/motion.tsx:32](../../../src/ui/motion.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 33행 | 별도 조건식 없음 | useRef(null)<br>call |
| 34행 | 별도 조건식 없음 | useState(false)<br>call |
| 34행 | 별도 조건식 없음 | useState(false)<br>call |
| 35행 | 별도 조건식 없음 | useEffect(() => { if (!ref.current) return; if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; } const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { threshold: .05 }); observer.observe(ref.current); return () => observer.disconnect(); }, [])<br>call<br>전달 콜백: H-0bdb0be35ac5 |

반환/조기 중단: 42행 { ref, enabled, playing: enabled && visible && !paused, paused, setPaused } [별도 조건식 없음]

## H-0bdb0be35ac5

**@callback:useEffect** · [src/ui/motion.tsx:35](../../../src/ui/motion.tsx#L35)

분기 조건과 가능한 갈림길:

- B-13d99b379be6 · IfStatement · !ref.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-0936d76e6da9 · IfStatement · typeof IntersectionObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | truthy: typeof IntersectionObserver === 'undefined' | setVisible(true)<br>state-update |
| 39행 | 별도 조건식 없음 | observer.observe(ref.current)<br>call |

반환/조기 중단: 36행 <render> [truthy: !ref.current]; 37행 <render> [truthy: typeof IntersectionObserver === 'undefined']; 40행 () => observer.disconnect() [별도 조건식 없음]

## H-119516496ad9

**BusyDots** · [src/ui/motion.tsx:46](../../../src/ui/motion.tsx#L46)

분기 조건과 가능한 갈림길:

- B-7e99a278f8f6 · ConditionalExpression · !ready → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-b578cfbafe44 · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: falsy: !ready (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 47행 | 별도 조건식 없음 | useState(false)<br>call |
| 48행 | 별도 조건식 없음 | useEffect(() => { const timer = window.setTimeout(() => setReady(true), 120); return () => window.clearTimeout(timer); }, [])<br>call<br>전달 콜백: H-6fadb7b6f59f |

반환/조기 중단: 49행 <render> [별도 조건식 없음]

## H-6fadb7b6f59f

**@callback:useEffect** · [src/ui/motion.tsx:48](../../../src/ui/motion.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | window.setTimeout(() => setReady(true), 120)<br>call<br>전달 콜백: H-1fe69db399e1 |

반환/조기 중단: 48행 () => window.clearTimeout(timer) [별도 조건식 없음]

## H-1fe69db399e1

**@callback:window.setTimeout** · [src/ui/motion.tsx:48](../../../src/ui/motion.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | setReady(true)<br>state-update |

## H-e98cf229828a

**SavedMark** · [src/ui/motion.tsx:55](../../../src/ui/motion.tsx#L55)

분기 조건과 가능한 갈림길:

- B-72f3eb0f59ec · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).
- B-53afed06e98b · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |

반환/조기 중단: 57행 <render> [별도 조건식 없음]

## H-814a440bc21b

**useSelectionMotionId** · [src/ui/motion.tsx:64](../../../src/ui/motion.tsx#L64)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | 별도 조건식 없음 | useId()<br>call |

반환/조기 중단: 64행 useId() [별도 조건식 없음]

## H-8d7119b67555

**SelectionBackground** · [src/ui/motion.tsx:65](../../../src/ui/motion.tsx#L65)

분기 조건과 가능한 갈림길:

- B-23955ecd8681 · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).
- B-160ff7f3b11c · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |

반환/조기 중단: 67행 <render> [별도 조건식 없음]

## H-5748c6d19eff

**NoticeEntrance** · [src/ui/motion.tsx:71](../../../src/ui/motion.tsx#L71)

분기 조건과 가능한 갈림길:

- B-86bdb6ad2cd9 · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).
- B-f76921d607df · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 72행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |

반환/조기 중단: 73행 <render> [별도 조건식 없음]

## H-36cfb9c29e7d

**FadeContent** · [src/ui/motion.tsx:77](../../../src/ui/motion.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | 별도 조건식 없음 | useRef(null)<br>call |
| 78행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 79행 | 별도 조건식 없음 | useEffect(() => { if (!enabled \|\| !ref.current) return; const context = gsap.context(() => { gsap.fromTo(ref.current, { opacity: .9 }, { opacity: 1, duration: .18, ease: 'power2.out', clearProps: 'opacity' }); }); return () => context.revert(); }, [enabled])<br>call<br>전달 콜백: H-f4fb701e8d0a |

반환/조기 중단: 84행 <render> [별도 조건식 없음]

## H-f4fb701e8d0a

**@callback:useEffect** · [src/ui/motion.tsx:79](../../../src/ui/motion.tsx#L79)

분기 조건과 가능한 갈림길:

- B-75b1bd8d0bec · IfStatement · !enabled || !ref.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (80행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | 별도 조건식 없음 | gsap.context(() => { gsap.fromTo(ref.current, { opacity: .9 }, { opacity: 1, duration: .18, ease: 'power2.out', clearProps: 'opacity' }); })<br>call<br>전달 콜백: H-52dca82c6c6b |

반환/조기 중단: 80행 <render> [truthy: !enabled || !ref.current]; 82행 () => context.revert() [별도 조건식 없음]

## H-52dca82c6c6b

**@callback:gsap.context** · [src/ui/motion.tsx:81](../../../src/ui/motion.tsx#L81)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | 별도 조건식 없음 | gsap.fromTo(ref.current, { opacity: .9 }, { opacity: 1, duration: .18, ease: 'power2.out', clearProps: 'opacity' })<br>call |

