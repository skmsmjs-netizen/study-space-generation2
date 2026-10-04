# src/ui/ink-ocr.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-617757c460c4

**InkOCR** · [src/ui/ink-ocr.tsx:8](../../../src/ui/ink-ocr.tsx#L8)

분기 조건과 가능한 갈림길:

- B-f4bd6f29290d · ConditionalExpression · documentKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (9행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | 별도 조건식 없음 | useState(()=>{try {return key ? readRescuedDraft(key) ?? localStorage.getItem(key) : null;}catch{return null;}})<br>call<br>전달 콜백: H-e5d49af0b342 |
| 10행 | 별도 조건식 없음 | useState('')<br>call |
| 10행 | 별도 조건식 없음 | useState(false)<br>call |
| 11행 | 별도 조건식 없음 | useRef(null)<br>call |
| 12행 | 별도 조건식 없음 | useEffect(()=>()=>operation.current?.abort(), [])<br>call<br>전달 콜백: H-6d0629b6508b |
| 13행 | 별도 조건식 없음 | useEffect(()=>{if(key && candidate!==null)try{storeDraftSafely(key,candidate);}catch{setStatus('인식 결과를 이 기기에 저장하지 못했습니다. 현재 창에서 복사해 주세요.');}}, [candidate,key])<br>call<br>전달 콜백: H-95fdab0a1754 |
| 21행 | falsy: disabled\|\|busy | strokes.some(s=>strokePage(s)===page)<br>call<br>전달 콜백: H-2c22459676c6 |
| 24행 | truthy: candidate!==null ∧ falsy: disabled\|\|busy | candidate.trim()<br>call |

반환/조기 중단: 20행 <render> [별도 조건식 없음]

## H-e5d49af0b342

**@callback:useState** · [src/ui/ink-ocr.tsx:10](../../../src/ui/ink-ocr.tsx#L10)

분기 조건과 가능한 갈림길:

- B-891dad09d659 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (10행).
- B-a2f6a875ce0b · ConditionalExpression · key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (10행).
- B-b88de538f3e6 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (10행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | truthy: key | readRescuedDraft(key)<br>preservation-boundary |
| 10행 | truthy: key ∧ nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |

반환/조기 중단: 10행 key ? readRescuedDraft(key) ?? localStorage.getItem(key) : null [별도 조건식 없음]; 10행 null [exception: exception]

## H-6d0629b6508b

**@callback:useEffect** · [src/ui/ink-ocr.tsx:12](../../../src/ui/ink-ocr.tsx#L12)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-95fdab0a1754

**@callback:useEffect** · [src/ui/ink-ocr.tsx:13](../../../src/ui/ink-ocr.tsx#L13)

분기 조건과 가능한 갈림길:

- B-8d91e28751da · IfStatement · key && candidate!==null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (13행).
- B-7f8cff4aaf1b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: key && candidate!==null (13행).
- B-6c1c544a2ad6 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: key && candidate!==null (13행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | truthy: key && candidate!==null | storeDraftSafely(key, candidate)<br>preservation-boundary |
| 13행 | truthy: key && candidate!==null ∧ exception: exception | setStatus('인식 결과를 이 기기에 저장하지 못했습니다. 현재 창에서 복사해 주세요.')<br>state-update |

## H-e8683280e674

**dismiss** · [src/ui/ink-ocr.tsx:14](../../../src/ui/ink-ocr.tsx#L14)

분기 조건과 가능한 갈림길:

- B-cda1f9881e8f · IfStatement · key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-56cf484a30de · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: key (14행).
- B-85073fa43f9d · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: key (14행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | truthy: key | clearStoredDraft(key)<br>preservation-boundary |
| 14행 | truthy: key ∧ exception: exception | setStatus('인식 결과의 초안을 정리하지 못했습니다.')<br>state-update |
| 14행 | 별도 조건식 없음 | setCandidate(null)<br>state-update |

반환/조기 중단: 14행 <render> [truthy: key ∧ exception: exception]

## H-ef0b89fbf5d0

**recognize** · [src/ui/ink-ocr.tsx:15](../../../src/ui/ink-ocr.tsx#L15) · async

분기 조건과 가능한 갈림길:

- B-4d52de6c6c74 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (16행).
- B-0eff84181c51 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).
- B-144e55a6888d · ConditionalExpression · text.trim() → truthy / falsy; 바깥 조건: truthy: !controller.signal.aborted (16행).
- B-6930277ece49 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (17행).
- B-dbb73d20dae0 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: exception: e (17행).
- B-0f18a26b8714 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e ∧ truthy: !controller.signal.aborted (17행).
- B-60eb7edd8dc9 · IfStatement · canvas → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (18행).
- B-aeaa17591134 · IfStatement · operation.current===controller → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (18행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 15행 | 별도 조건식 없음 | setStatus('이 쪽의 필기에서 글자를 읽고 있습니다.')<br>state-update |
| 16행 | 별도 조건식 없음 | inkRaster(strokes, page)<br>call |
| 16행 | 별도 조건식 없음 | controller.signal.throwIfAborted()<br>call |
| 16행 | 별도 조건식 없음 | recognizeInkImage(canvas, controller.signal, setStatus)<br>call |
| 16행 | truthy: !controller.signal.aborted | setCandidate(text)<br>state-update |
| 16행 | truthy: !controller.signal.aborted | setStatus(text.trim()?'인식한 글을 확인·수정한 뒤 넣어 주세요.':'읽은 글자가 없습니다. 원본 필기는 그대로 있습니다.')<br>state-update |
| 16행 | truthy: !controller.signal.aborted | text.trim()<br>call |
| 17행 | exception: e ∧ truthy: !controller.signal.aborted | setStatus(e instanceof Error?e.message:'글자를 읽지 못했습니다. 원본 필기는 그대로 있습니다.')<br>state-update |
| 18행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: operation.current===controller | setBusy(false)<br>state-update |

## H-2c22459676c6

**@callback:strokes.some** · [src/ui/ink-ocr.tsx:21](../../../src/ui/ink-ocr.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | falsy: disabled\|\|busy | strokePage(s)<br>call |

## H-5e164242e37f

**@onClick** · [src/ui/ink-ocr.tsx:21](../../../src/ui/ink-ocr.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | recognize()<br>call → [H-ef0b89fbf5d0](ui__ink-ocr.md#h-ef0b89fbf5d0) |

## H-54e0915083fc

**@onClick** · [src/ui/ink-ocr.tsx:22](../../../src/ui/ink-ocr.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | truthy: busy | setBusy(false)<br>state-update |
| 22행 | truthy: busy | setStatus('글자 읽기를 중단했습니다. 원본 필기는 그대로 있습니다.')<br>state-update |

## H-0e154ed47ae2

**@onChange** · [src/ui/ink-ocr.tsx:24](../../../src/ui/ink-ocr.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | truthy: candidate!==null | setCandidate(e.target.value)<br>state-update |

## H-d94179562eef

**@onClick** · [src/ui/ink-ocr.tsx:24](../../../src/ui/ink-ocr.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | truthy: candidate!==null | onApply(candidate)<br>call |
| 24행 | truthy: candidate!==null | dismiss()<br>call → [H-e8683280e674](ui__ink-ocr.md#h-e8683280e674) |
| 24행 | truthy: candidate!==null | setStatus('확인한 글을 넣었습니다. 원본 필기는 유지했습니다.')<br>state-update |

