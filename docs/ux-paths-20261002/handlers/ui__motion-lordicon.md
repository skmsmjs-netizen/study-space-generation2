# src/ui/motion-lordicon.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-506c12fa516f

**AnimatedPrivacyIcon** · [src/ui/motion-lordicon.tsx:7](../../../src/ui/motion-lordicon.tsx#L7)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | useRef(null)<br>call |
| 8행 | 별도 조건식 없음 | usePlayerMotion()<br>call → [H-7fb5a6caa8f5](ui__motion.md#h-7fb5a6caa8f5) |
| 8행 | 별도 조건식 없음 | useState(false)<br>call |
| 9행 | 별도 조건식 없음 | useEffect(() => { if (!playing) player.current?.pause(); else if (ready) player.current?.play(); }, [playing, ready])<br>call<br>전달 콜백: H-fc567e1592ff |

반환/조기 중단: 10행 <render> [별도 조건식 없음]

## H-fc567e1592ff

**@callback:useEffect** · [src/ui/motion-lordicon.tsx:9](../../../src/ui/motion-lordicon.tsx#L9)

분기 조건과 가능한 갈림길:

- B-778d71732d4c · IfStatement · !playing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (9행).
- B-8ba89e682752 · IfStatement · ready → truthy / falsy; 바깥 조건: falsy: !playing (9행).

## H-fc872b8d80db

**@onReady** · [src/ui/motion-lordicon.tsx:11](../../../src/ui/motion-lordicon.tsx#L11)

분기 조건과 가능한 갈림길:

- B-71252778d452 · IfStatement · playing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | setReady(true)<br>state-update |

## H-c53d9d7eeb79

**@onClick** · [src/ui/motion-lordicon.tsx:12](../../../src/ui/motion-lordicon.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

