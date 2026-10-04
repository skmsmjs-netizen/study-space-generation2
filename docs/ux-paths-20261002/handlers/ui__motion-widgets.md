# src/ui/motion-widgets.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-945c88eae132

**PlayerBoundary.render** · [src/ui/motion-widgets.tsx:10](../../../src/ui/motion-widgets.tsx#L10)

분기 조건과 가능한 갈림길:

- B-a56e6aaf0991 · ConditionalExpression · this.state.failed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (10행).

반환/조기 중단: 10행 this.state.failed ? <><p role="status">움직임을 열지 못했습니다. 연결을 확인한 뒤 화면을 다시 열어 주세요. 저장된 공부 기록과 초안은 지우지 않습니다.</p><Button onClick={() => window.location.reload()}>화면 다시 열기</Button></> : this.props.children [별도 조건식 없음]

## H-5f2876ee680b

**@onClick** · [src/ui/motion-widgets.tsx:10](../../../src/ui/motion-widgets.tsx#L10)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | truthy: this.state.failed | window.location.reload()<br>call |

## H-9222842cb89a

**MotionWidgets** · [src/ui/motion-widgets.tsx:12](../../../src/ui/motion-widgets.tsx#L12)

분기 조건과 가능한 갈림길:

- B-04a716f88e7d · ConditionalExpression · view === 'breathing' → truthy / falsy; 바깥 조건: truthy: open (23행).
- B-15e498f40525 · ConditionalExpression · view === 'icon' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: view === 'breathing' (23행).
- B-20cac29f5caa · ConditionalExpression · view === 'interactive' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: view === 'breathing' ∧ falsy: view === 'icon' (23행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | useState(false)<br>call |
| 13행 | 별도 조건식 없음 | useState('breathing')<br>call |
| 13행 | 별도 조건식 없음 | useState('record')<br>call |
| 14행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 15행 | 별도 조건식 없음 | useId()<br>call |

반환/조기 중단: 16행 <render> [별도 조건식 없음]

## H-fa4ded8faa7a

**@onClick** · [src/ui/motion-widgets.tsx:16](../../../src/ui/motion-widgets.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | event.currentTarget.focus({ preventScroll: true })<br>input-control |
| 16행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-82ecd8aff776

**@onClose** · [src/ui/motion-widgets.tsx:17](../../../src/ui/motion-widgets.tsx#L17)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | truthy: open | setOpen(false)<br>state-update |

## H-4433fca6f400

**@onChange** · [src/ui/motion-widgets.tsx:18](../../../src/ui/motion-widgets.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | truthy: open | onReducedChange(event.target.checked)<br>call |

## H-cfe9fb5c8e4f

**@onUndo** · [src/ui/motion-widgets.tsx:26](../../../src/ui/motion-widgets.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | truthy: open ∧ falsy: view === 'breathing' ∧ falsy: view === 'icon' ∧ falsy: view === 'interactive' | setSample('record')<br>state-update |

