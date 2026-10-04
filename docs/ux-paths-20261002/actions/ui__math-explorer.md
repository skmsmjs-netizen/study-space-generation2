# src/ui/math-explorer.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c5d07bd51aff

**`${symbol} 값`** · Input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:98](../../../src/ui/math-explorer.tsx#L98)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 저장·변경 요청 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-bae71eea8302](../handlers/ui__math-explorer.md#h-bae71eea8302)

```tsx
(event) => {
            setText(event.target.value);
            setDirty(true);
            setError('');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onBlur** → [commit · H-89bde559856a](../handlers/ui__math-explorer.md#h-89bde559856a) → [format · H-0d4a9f7dfbb4](../handlers/ui__math-explorer.md#h-0d4a9f7dfbb4)

```tsx
commit
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-511d329a9fa0, B-54e33132f49d, B-1f44e683abc0, B-8f6e80bf0f3c, B-26e1365c1176

**onKeyDown** → [@onKeyDown · H-a23b918213b1](../handlers/ui__math-explorer.md#h-a23b918213b1) → [format · H-0d4a9f7dfbb4](../handlers/ui__math-explorer.md#h-0d4a9f7dfbb4) → [commit · H-89bde559856a](../handlers/ui__math-explorer.md#h-89bde559856a)

```tsx
(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
            if (event.key === 'Escape') {
              setText(format(value));
              setDirty(false);
              setError('');
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f73c0af60e28, B-0a55b5c95133, B-26e1365c1176, B-511d329a9fa0, B-54e33132f49d, B-1f44e683abc0, B-8f6e80bf0f3c

## X-fb617582450c

**label** · input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:122](../../../src/ui/math-explorer.tsx#L122)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4e70003f9871](../handlers/ui__math-explorer.md#h-4e70003f9871) → [format · H-0d4a9f7dfbb4](../handlers/ui__math-explorer.md#h-0d4a9f7dfbb4)

```tsx
(event) => {
          setDirty(false);
          setError('');
          setText(format(Number(event.target.value)));
          onChange(Number(event.target.value));
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-26e1365c1176

## X-a862bcef0068

**탐색할 내용** · Select · user-control

- 실제 소스: [src/ui/math-explorer.tsx:415](../../../src/ui/math-explorer.tsx#L415)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f5371fc95dae](../handlers/ui__math-explorer.md#h-f5371fc95dae) → [rememberReading · H-8620997d4121](../handlers/ui__math-explorer.md#h-8620997d4121) → [captureScene · H-e8d371a62b35](../handlers/ui__math-explorer.md#h-e8d371a62b35) → [rememberView · H-a1148d0d38ef](../handlers/ui__math-explorer.md#h-a1148d0d38ef)

```tsx
(event) => {
          const active = event.target.value as ReasoningView['active'];
          if (active !== 'graph' && graphVisited) captureScene();
          if (active === 'graph') setGraphVisited(true);
          rememberReading({ ...currentReading.current, active });
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8d9e8ed7539a, B-ac6341c30af2, B-a3a3b5db5eea, B-b11c06a9ad1b, B-9e762494f4fe, B-a79bef5857b4, B-5b7bef714466, B-1a9a3cb825ef, B-f990b86fde05

## X-29288d9f9575

**읽던 위치 다시 불러오기 읽던 위치 다시 보관** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:433](../../../src/ui/math-explorer.tsx#L433)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: readingError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-165a27613cef](../handlers/ui__math-explorer.md#h-165a27613cef) → [rememberReading · H-8620997d4121](../handlers/ui__math-explorer.md#h-8620997d4121)

```tsx
() => {
              if (!readingBlocked.current) return rememberReading(currentReading.current);
              try {
                const restored = readReasoningView(readingKey);
                readingBlocked.current = false;
                setReadingView(restored);
                setReadingError('');
                if (restored.active === 'graph') setGraphVisited(true);
              } catch {
                setReadingError(
                  '읽던 위치를 아직 불러올 수 없습니다. 기존 저장값은 유지했습니다. 현재 흐름을 파일로 보관해 주세요.',
                );
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fb86a061e41f, B-16b842c5d336, B-027e6f52814a, B-a03a3efc3870, B-a3a3b5db5eea, B-b11c06a9ad1b, B-9e762494f4fe

## X-730bdc754a71

**현재 흐름 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:451](../../../src/ui/math-explorer.tsx#L451)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: readingError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2bccae4c3d9e](../handlers/ui__math-explorer.md#h-2bccae4c3d9e) → [@callback:setTimeout · H-ce7f134e4574](../handlers/ui__math-explorer.md#h-ce7f134e4574)

```tsx
() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(currentReading.current, null, 2)], {
                  type: 'application/json',
                }),
              );
              const link = document.createElement('a');
              link.href = url;
              link.download = '급수의 수렴 판단 · 읽던 위치.json';
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d5646723d21d

**IntegralReasoning · 조작/부품 영역** · IntegralReasoning · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:471](../../../src/ui/math-explorer.tsx#L471)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: readingView.active === 'series'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [rememberReading · H-8620997d4121](../handlers/ui__math-explorer.md#h-8620997d4121)

```tsx
rememberReading
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a3a3b5db5eea, B-b11c06a9ad1b, B-9e762494f4fe

## X-1cd0c1fe6ab3

**MathTemplates · 조작/부품 영역** · MathTemplates · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:476](../../../src/ui/math-explorer.tsx#L476)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: readingView.active === 'templates'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eaeb79a2aa79

**그래프 도구** · Select · user-control

- 실제 소스: [src/ui/math-explorer.tsx:493](../../../src/ui/math-explorer.tsx#L493)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c2ea34056005](../handlers/ui__math-explorer.md#h-c2ea34056005) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1) → [captureScene · H-e8d371a62b35](../handlers/ui__math-explorer.md#h-e8d371a62b35) → [rememberView · H-a1148d0d38ef](../handlers/ui__math-explorer.md#h-a1148d0d38ef)

```tsx
(event) => {
              const latest = captureScene();
              change({ ...latest, renderer: event.target.value as MathScene['renderer'] });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc, B-a79bef5857b4, B-5b7bef714466, B-1a9a3cb825ef, B-f990b86fde05

## X-8fcc4f6b4413

**Plot · 조작/부품 영역** · Plot · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:512](../../../src/ui/math-explorer.tsx#L512)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ visible-mode-required: active ? 'visible' : 'hidden' ∧ truthy: scene.renderer === 'plotly'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onZoomReady** → 네이티브/호출자 동작

```tsx
setZoomReady
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onView** → [rememberPlotView · H-5428259bba56](../handlers/ui__math-explorer.md#h-5428259bba56)

```tsx
rememberPlotView
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cd08d737e8d9, B-2cab93798c4f, B-33f8502e7113, B-90860e1354bc, B-04d5eb463687

## X-6d2671cab86e

**GeoGebra · 조작/부품 영역** · GeoGebra · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:523](../../../src/ui/math-explorer.tsx#L523)
- 연결 표면: [R09](../paths/R09.md), [U31](../paths/U31.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ visible-mode-required: active ? 'visible' : 'hidden' ∧ falsy: scene.renderer === 'plotly'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onZoomReady** → 네이티브/호출자 동작

```tsx
setZoomReady
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSnapshot** → [rememberView · H-a1148d0d38ef](../handlers/ui__math-explorer.md#h-a1148d0d38ef)

```tsx
rememberView
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5b7bef714466, B-1a9a3cb825ef, B-f990b86fde05

**onFallback** → [@onFallback · H-ef34bc1fcc10](../handlers/ui__math-explorer.md#h-ef34bc1fcc10) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
() => change({ ...currentScene.current, renderer: 'plotly' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-f8f6eda88959

**＋ 확대** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:560](../../../src/ui/math-explorer.tsx#L560)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: !zoomReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-903d9878f807](../handlers/ui__math-explorer.md#h-903d9878f807)

```tsx
() =>
                        zoomRef.current?.(scene.renderer === 'plotly' ? mathPlotZoomStep : 1.2)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-06f90608abcc

## X-c39da3df5421

**− 축소** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:569](../../../src/ui/math-explorer.tsx#L569)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: !zoomReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3c06358c6f8c](../handlers/ui__math-explorer.md#h-3c06358c6f8c)

```tsx
() =>
                        zoomRef.current?.(
                          1 / (scene.renderer === 'plotly' ? mathPlotZoomStep : 1.2),
                        )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-38e6e5aa0cf6

## X-ec26f36b6251

**보기 초기화** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:580](../../../src/ui/math-explorer.tsx#L580)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4e8dc50790d1](../handlers/ui__math-explorer.md#h-4e8dc50790d1) → [@callback:setViewRevision · H-325f725a1a03](../handlers/ui__math-explorer.md#h-325f725a1a03)

```tsx
() => setViewRevision((v) => v + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-68fab34fc52e

**scene.mode === 'curve' ? '곡선 위 위치 t' : '그래프 위 위치 x'** · MathSlider · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:593](../../../src/ui/math-explorer.tsx#L593)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-810c6cab3282](../handlers/ui__math-explorer.md#h-810c6cab3282) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(value) =>
                      change({
                        ...scene,
                        position: Math.max(
                          0,
                          Math.min(1, (value - result.min) / (result.max - result.min)),
                        ),
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-b95acf677573

**구간 시작으로** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:610](../../../src/ui/math-explorer.tsx#L610)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8f979a3aff3c](../handlers/ui__math-explorer.md#h-8f979a3aff3c) → [@callback:setControlRevision · H-3ac3e284a474](../handlers/ui__math-explorer.md#h-3ac3e284a474) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
() => {
                      change({ ...scene, position: 0 });
                      setControlRevision((v) => v + 1);
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-ce1bb70b6592

**`변수 ${name}`** · MathSlider · component-callback-contract

- 실제 소스: [src/ui/math-explorer.tsx:620](../../../src/ui/math-explorer.tsx#L620)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-40aedf2d141f](../handlers/ui__math-explorer.md#h-40aedf2d141f) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(value) => change({ ...scene, [name]: value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

반복: map(['a', 'b'] as const) · 619행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fb6aed03094e

**T·N·B 벡터 보기** · Checkbox · user-control

- 실제 소스: [src/ui/math-explorer.tsx:632](../../../src/ui/math-explorer.tsx#L632)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: scene.mode === 'curve'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d963da7bddd0](../handlers/ui__math-explorer.md#h-d963da7bddd0) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => change({ ...scene, vectors: event.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-a5a82177980e

**벡터 성분** · summary · user-control

- 실제 소스: [src/ui/math-explorer.tsx:658](../../../src/ui/math-explorer.tsx#L658)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: result.vectors
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7e0411498b87

**수식·슬라이더 범위 편집** · summary · user-control

- 실제 소스: [src/ui/math-explorer.tsx:680](../../../src/ui/math-explorer.tsx#L680)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7660f50cd00a

**그래프 종류** · Select · user-control

- 실제 소스: [src/ui/math-explorer.tsx:682](../../../src/ui/math-explorer.tsx#L682)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d6046e855173](../handlers/ui__math-explorer.md#h-d6046e855173) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) =>
                  change({ ...scene, mode: event.target.value as MathScene['mode'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-135dd619ae85

**수식 예시** · Select · user-control

- 실제 소스: [src/ui/math-explorer.tsx:692](../../../src/ui/math-explorer.tsx#L692)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-af25fb08e545](../handlers/ui__math-explorer.md#h-af25fb08e545)

```tsx
(event) => setPreset(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2454d324b9c4

**예시 적용** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:702](../../../src/ui/math-explorer.tsx#L702)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-67a2ab088e53](../handlers/ui__math-explorer.md#h-67a2ab088e53) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
() =>
                  change({
                    ...structuredClone(presets[preset]),
                    title: scene.title,
                    notes: scene.notes,
                    renderer: scene.renderer,
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-8d700f14d17a

**scene.mode === 'function' ? 'y(x)' : `${['x', 'y', 'z'][index]}(t)`** · Input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:717](../../../src/ui/math-explorer.tsx#L717)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4a3aafcf93bd](../handlers/ui__math-explorer.md#h-4a3aafcf93bd) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => {
                    const expressions = [...scene.expressions] as MathScene['expressions'];
                    expressions[index] = event.target.value;
                    change({ ...scene, expressions });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

반복: map(scene.mode === 'function' ? [0] : [0, 1, 2]) · 716행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3f9e36161706

**슬라이더 시작** · Input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:735](../../../src/ui/math-explorer.tsx#L735)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-113961687162](../handlers/ui__math-explorer.md#h-113961687162) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => change({ ...scene, min: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-fa90cda71511

**슬라이더 끝** · Input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:740](../../../src/ui/math-explorer.tsx#L740)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d0d1e455bc1f](../handlers/ui__math-explorer.md#h-d0d1e455bc1f) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => change({ ...scene, max: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-43f4343b6d13

**T·N·B는 어떻게 계산하나요?** · summary · user-control

- 실제 소스: [src/ui/math-explorer.tsx:748](../../../src/ui/math-explorer.tsx#L748)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-12f20140df34

**제목 (선택)** · Input · user-control

- 실제 소스: [src/ui/math-explorer.tsx:759](../../../src/ui/math-explorer.tsx#L759)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-183ae106c9dd](../handlers/ui__math-explorer.md#h-183ae106c9dd) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => change({ ...scene, title: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-d0351665636f

**관찰·메모 (선택)** · Textarea · user-control

- 실제 소스: [src/ui/math-explorer.tsx:764](../../../src/ui/math-explorer.tsx#L764)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-acb5381c9759](../handlers/ui__math-explorer.md#h-acb5381c9759) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
(event) => change({ ...scene, notes: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

## X-92cb0a345d3e

**수식과 메모 저장** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:771](../../../src/ui/math-explorer.tsx#L771)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2f23cb091ea1](../handlers/ui__math-explorer.md#h-2f23cb091ea1) → [save · H-65a104f8bc03](../handlers/ui__math-explorer.md#h-65a104f8bc03) → [captureScene · H-e8d371a62b35](../handlers/ui__math-explorer.md#h-e8d371a62b35) → [rememberView · H-a1148d0d38ef](../handlers/ui__math-explorer.md#h-a1148d0d38ef)

```tsx
() => void save()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bb3232ec9f78, B-6048b8394086, B-137a7adacb54, B-da4bd6659bae, B-f2cf0bb4de3e, B-acfeb59bff11, B-9fc47225a74f, B-c1ed67e489f2, B-a79bef5857b4, B-5b7bef714466, B-1a9a3cb825ef, B-f990b86fde05

## X-1d4e27c34e61

**파일로 보관** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:774](../../../src/ui/math-explorer.tsx#L774)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [download · H-81bd91bc7229](../handlers/ui__math-explorer.md#h-81bd91bc7229) → [@callback:setTimeout · H-9a30d9418d70](../handlers/ui__math-explorer.md#h-9a30d9418d70) → [captureScene · H-e8d371a62b35](../handlers/ui__math-explorer.md#h-e8d371a62b35) → [rememberView · H-a1148d0d38ef](../handlers/ui__math-explorer.md#h-a1148d0d38ef)

```tsx
download
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a79bef5857b4, B-5b7bef714466, B-1a9a3cb825ef, B-f990b86fde05

## X-7db711a57f35

**{memo.body.split('\n')[0] || '수식 탐색'}** · Button · user-control

- 실제 소스: [src/ui/math-explorer.tsx:784](../../../src/ui/math-explorer.tsx#L784)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-69ce83cd72ff](../handlers/ui__math-explorer.md#h-69ce83cd72ff) → [@callback:setControlRevision · H-797ebf99b54c](../handlers/ui__math-explorer.md#h-797ebf99b54c) → [@callback:setRestoreRevision · H-68c5e0d79e71](../handlers/ui__math-explorer.md#h-68c5e0d79e71) → [change · H-d332899c55c1](../handlers/ui__math-explorer.md#h-d332899c55c1)

```tsx
() => {
                        const entry = readScene(memo.body);
                        if (entry) {
                          change(entry);
                          setRestoreRevision((value) => value + 1);
                          setControlRevision((value) => value + 1);
                        } else
                          setError(
                            '저장된 수식 형식을 읽지 못했습니다. 메모에서 원문을 확인해 주세요.',
                          );
                      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c93b4c3a135, B-8b4544497e7b, B-4204578e5e02, B-a2f57cd0bacc

반복: map(saved) · 782행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1d871c001d71

**메모 원문** · a · user-control

- 실제 소스: [src/ui/math-explorer.tsx:800](../../../src/ui/math-explorer.tsx#L800)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${encodeURIComponent(memo.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(saved) · 782행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

