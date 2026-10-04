# src/ui/source-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-e9b6027fc27b

**prefersTouchCodeEditor** · [src/ui/source-editor.tsx:21](../../../src/ui/source-editor.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | /iPad\|iPhone\|iPod\|Android/i.test(navigator.userAgent)<br>call |
| 25행 | falsy: /iPad\|iPhone\|iPod\|Android/i.test(navigator.userAgent) \|\|<br>    (navigator.maxTouchPoints > 1 && navigator.platform === 'MacIntel') ∧ truthy: typeof matchMedia === 'function' | matchMedia('(pointer: coarse)')<br>call |

반환/조기 중단: 22행 /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && navigator.platform === 'MacIntel') || (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) [별도 조건식 없음]

## H-6a4f980c0cd3

**SourceEditor** · [src/ui/source-editor.tsx:28](../../../src/ui/source-editor.tsx#L28)

분기 조건과 가능한 갈림길:

- B-91c1320ec1a5 · ConditionalExpression · touch → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | 별도 조건식 없음 | useState(prefersTouchCodeEditor)<br>call<br>전달 콜백: H-e9b6027fc27b |

반환/조기 중단: 31행 <render> [별도 조건식 없음]

## H-2c70314450be

**@onChange** · [src/ui/source-editor.tsx:41](../../../src/ui/source-editor.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | slot-active: fallback | props.onChange(event.target.value)<br>call |

