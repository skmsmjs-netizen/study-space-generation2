# src/App.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-d0766b91b8fb

**uid** · [src/App.tsx:90](../../../src/App.tsx#L90)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-96c4a47c6bd4

**active** · [src/App.tsx:91](../../../src/App.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 92행 | 별도 조건식 없음 | items.filter((item) => !item.deletedAt)<br>call<br>전달 콜백: H-8e7a12252c67 |

## H-8e7a12252c67

**@callback:items.filter** · [src/App.tsx:92](../../../src/App.tsx#L92)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-511c1a5c281e

**message** · [src/App.tsx:94](../../../src/App.tsx#L94)

분기 조건과 가능한 갈림길:

- B-c66d1d869492 · IfStatement · error instanceof DOMException && error.name === "QuotaExceededError" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (95행).
- B-14d40aaaf457 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).

반환/조기 중단: 96행 "이 기기의 저장 공간이 부족해 저장하지 못했습니다. 작성 중인 내용은 유지했습니다. 공간을 확보한 뒤 다시 저장해 주세요." [truthy: error instanceof DOMException && error.name === "QuotaExceededError"]; 97행 error instanceof Error ? error.message : "내용을 보존했습니다. 다시 시도해 주세요." [별도 조건식 없음]

## H-32d9e181cddf

**readPreference** · [src/App.tsx:102](../../../src/App.tsx#L102)

분기 조건과 가능한 갈림길:

- B-aece17ecbcc5 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (103행).
- B-d4a029d896ee · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (104행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 103행 | 별도 조건식 없음 | sessionStorage.getItem(`${prefix}:context:${name}`)<br>preservation-boundary |
| 103행 | nullish: sessionStorage.getItem(`${prefix}:context:${name}`) | localStorage.getItem(`${prefix}:context:${name}:device`)<br>preservation-boundary |

반환/조기 중단: 103행 sessionStorage.getItem(`${prefix}:context:${name}`) ?? localStorage.getItem(`${prefix}:context:${name}:device`) ?? fallback [별도 조건식 없음]; 104행 fallback [exception: exception]

## H-06d98b350952

**writePreference** · [src/App.tsx:106](../../../src/App.tsx#L106)

분기 조건과 가능한 갈림길:

- B-fe0d22cf58a7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (107행).
- B-25eb0bbcf4e0 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (107행).
- B-d58129e9ac87 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (108행).
- B-d792af370442 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (108행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 107행 | 별도 조건식 없음 | sessionStorage.setItem(`${prefix}:context:${name}`, value)<br>preservation-boundary |
| 108행 | 별도 조건식 없음 | localStorage.setItem(`${prefix}:context:${name}:device`, value)<br>preservation-boundary |

## H-c5e65c11b5ff

**App** · [src/App.tsx:111](../../../src/App.tsx#L111)

분기 조건과 가능한 갈림길:

- B-05f33761103e · ConditionalExpression · personal → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 114행 | 별도 조건식 없음 | useState(() => location.hash === '#/account' \|\| new URLSearchParams(location.search).get('space') !== 'demo')<br>call<br>전달 콜백: H-5930a0b35b23 |
| 115행 | 별도 조건식 없음 | useEffect(() => { if (location.hash === '#/account') { try { sessionStorage.setItem('study-space:active-space', 'personal'); } catch { /* Space stays open for this visit. */ } location.hash = '#/'; } }, [])<br>call<br>전달 콜백: H-9c6bdb1e335f |

반환/조기 중단: 117행 <render> [별도 조건식 없음]

## H-5930a0b35b23

**@callback:useState** · [src/App.tsx:114](../../../src/App.tsx#L114)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 114행 | falsy: location.hash === '#/account' | new URLSearchParams(location.search).get('space')<br>call |

## H-9c6bdb1e335f

**@callback:useEffect** · [src/App.tsx:115](../../../src/App.tsx#L115)

분기 조건과 가능한 갈림길:

- B-a63a4b01e0f9 · IfStatement · location.hash === '#/account' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-e26b64e0b418 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: location.hash === '#/account' (115행).
- B-83db7ff827f9 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: location.hash === '#/account' (115행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 115행 | truthy: location.hash === '#/account' | sessionStorage.setItem('study-space:active-space', 'personal')<br>preservation-boundary |

## H-15a2797d15e4

**choose** · [src/App.tsx:116](../../../src/App.tsx#L116)

분기 조건과 가능한 갈림길:

- B-127dd12ef01f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (116행).
- B-d063294acb58 · ConditionalExpression · value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).
- B-e4dc9661563a · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (116행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 116행 | 별도 조건식 없음 | url.searchParams.delete('space')<br>mutation-request |
| 116행 | 별도 조건식 없음 | history.replaceState(null, '', url)<br>navigation |
| 116행 | 별도 조건식 없음 | sessionStorage.setItem('study-space:active-space', value ? 'personal' : 'demo')<br>preservation-boundary |
| 116행 | 별도 조건식 없음 | setPersonal(value)<br>state-update |

## H-434f7c6225e3

**@onClick** · [src/App.tsx:118](../../../src/App.tsx#L118)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | falsy: personal | choose(true)<br>call → [H-15a2797d15e4](App.md#h-15a2797d15e4) |

## H-ace7afcee788

**DemoApp** · [src/App.tsx:120](../../../src/App.tsx#L120)

분기 조건과 가능한 갈림길:

- B-4e2dc69874c0 · IfStatement · boot.loading → truthy / falsy; 바깥 조건: 별도 조건식 없음 (177행).
- B-97ba85835c24 · IfStatement · !boot.repo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (183행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | 별도 조건식 없음 | useState(false)<br>call |
| 122행 | 별도 조건식 없음 | useState({ repo: null, error: "", loading: true })<br>call |
| 127행 | 별도 조건식 없음 | useEffect(() => { let disposed = false, release: (() => void) \| undefined; if (!navigator.locks) { setBoot({ repo: null, error: "이 브라우저에서는 동시 작성을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.", loading: false, }); return; } void navigator.locks .request( "study-space:demo:writer", { ifAvailable: true }, async (lock) => { if (disposed) return; if (!lock) { setBoot({ repo: null, error: "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.", loading: false, }); return; } // Register release before publishing the mounted workspace, including refresh cleanup. const held = new Promise<void>((resolve) => { release = resolve; }); try { setBoot({ repo: new DemoRepository(localStorage), error: "", loading: false, … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-ab2498e472d3 |

반환/조기 중단: 178행 <render> [truthy: boot.loading]; 184행 <render> [truthy: !boot.repo]; 196행 <render> [별도 조건식 없음]

## H-ab2498e472d3

**@callback:useEffect** · [src/App.tsx:127](../../../src/App.tsx#L127)

분기 조건과 가능한 갈림길:

- B-7de68a2cfa4c · IfStatement · !navigator.locks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (130행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 131행 | truthy: !navigator.locks | setBoot({ repo: null, error: "이 브라우저에서는 동시 작성을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.", loading: false, })<br>state-update |
| 139행 | 별도 조건식 없음 | navigator.locks<br>      .request(<br>        "study-space:demo:writer",<br>        { ifAvailable: true },<br>        async (lock) => {<br>          if (disposed) return;<br>          if (!lock) {<br>            setBoot({<br>              repo: null,<br>              error:<br>                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",<br>              loading: false,<br>            });<br>            return;<br>          }<br>          // Register release before publishing the mounted workspace, including refresh cleanup.<br>          const held = new Promise<void>((resolve) => { release = resolve; });<br>          try {<br>            setBoot({<br>              repo: new DemoRepository(localStorage),<br>              error: "",<br>              loading: false,<br>            });<br>          } catch (e) {<br>            setBoot({ repo: null, error: message(e), loading: false });<br>          }<br>          await held;<br>        },<br>      )<br>      .catch((e) => { if (!disposed) setBoot({ repo: null, error: message(e), loading: false }); })<br>preservation-boundary<br>전달 콜백: H-9c828fe540d5 |
| 139행 | 별도 조건식 없음 | navigator.locks<br>      .request("study-space:demo:writer", { ifAvailable: true }, async (lock) => { if (disposed) return; if (!lock) { setBoot({ repo: null, error: "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.", loading: false, }); return; } // Register release before publishing the mounted workspace, including refresh cleanup. const held = new Promise<void>((resolve) => { release = resolve; }); try { setBoot({ repo: new DemoRepository(localStorage), error: "", loading: false, }); } catch (e) { setBoot({ repo: null, error: message(e), loading: false }); } await held; })<br>call<br>전달 콜백: H-b2f9d3dd6f39 |

반환/조기 중단: 137행 <render> [truthy: !navigator.locks]; 172행 () => { disposed = true; release?.(); } [별도 조건식 없음]

## H-b2f9d3dd6f39

**@callback:navigator.locks
      .request** · [src/App.tsx:143](../../../src/App.tsx#L143) · async

분기 조건과 가능한 갈림길:

- B-90e77b2b14a4 · IfStatement · disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (144행).
- B-41507b74c5fc · IfStatement · !lock → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).
- B-5df3482050fe · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (156행).
- B-db8d55d5b192 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (162행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 146행 | truthy: !lock | setBoot({ repo: null, error: "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.", loading: false, })<br>state-update |
| 157행 | 별도 조건식 없음 | setBoot({ repo: new DemoRepository(localStorage), error: "", loading: false, })<br>state-update |
| 163행 | exception: e | setBoot({ repo: null, error: message(e), loading: false })<br>state-update |
| 163행 | exception: e | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |

반환/조기 중단: 144행 <render> [truthy: disposed]; 152행 <render> [truthy: !lock]

## H-9c828fe540d5

**@callback:navigator.locks
      .request(
        "study-space:demo:writer",
        { ifAvailable: true },
        async (lock) => {
          if (disposed) return;
          if (!lock) {
            setBoot({
              repo: null,
              error:
                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",
              loading: false,
            });
            return;
          }
          // Register release before publishing the mounted workspace, including refresh cleanup.
          const held = new Promise<void>((resolve) => { release = resolve; });
          try {
            setBoot({
              repo: new DemoRepository(localStorage),
              error: "",
              loading: false,
            });
          } catch (e) {
            setBoot({ repo: null, error: message(e), loading: false });
          }
          await held;
        },
      )
      .catch** · [src/App.tsx:168](../../../src/App.tsx#L168)

분기 조건과 가능한 갈림길:

- B-ce47aaa2eeb4 · IfStatement · !disposed → truthy / falsy; 바깥 조건: rejected: navigator.locks
      .request(
        "study-space:demo:writer",
        { ifAvailable: true },
        async (lock) => {
          if (disposed) return;
          if (!lock) {
            setBoot({
              repo: null,
              error:
                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",
              loading: false,
            });
            return;
          }
          // Register release before publishing the mounted workspace, including refresh cleanup.
          const held = new Promise<void>((resolve) => { release = resolve; });
          try {
            setBoot({
              repo: new DemoRepository(localStorage),
              error: "",
              loading: false,
            });
          } catch (e) {
            setBoot({ repo: null, error: message(e), loading: false });
          }
          await held;
        },
      ) (169행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 170행 | rejected: navigator.locks<br>      .request(<br>        "study-space:demo:writer",<br>        { ifAvailable: true },<br>        async (lock) => {<br>          if (disposed) return;<br>          if (!lock) {<br>            setBoot({<br>              repo: null,<br>              error:<br>                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",<br>              loading: false,<br>            });<br>            return;<br>          }<br>          // Register release before publishing the mounted workspace, including refresh cleanup.<br>          const held = new Promise<void>((resolve) => { release = resolve; });<br>          try {<br>            setBoot({<br>              repo: new DemoRepository(localStorage),<br>              error: "",<br>              loading: false,<br>            });<br>          } catch (e) {<br>            setBoot({ repo: null, error: message(e), loading: false });<br>          }<br>          await held;<br>        },<br>      ) ∧ truthy: !disposed | setBoot({ repo: null, error: message(e), loading: false })<br>state-update |
| 170행 | rejected: navigator.locks<br>      .request(<br>        "study-space:demo:writer",<br>        { ifAvailable: true },<br>        async (lock) => {<br>          if (disposed) return;<br>          if (!lock) {<br>            setBoot({<br>              repo: null,<br>              error:<br>                "다른 창에서 예시 자료를 사용하고 있습니다. 그 창을 닫은 뒤 다시 열어 주세요. 저장된 자료는 그대로 남아 있습니다.",<br>              loading: false,<br>            });<br>            return;<br>          }<br>          // Register release before publishing the mounted workspace, including refresh cleanup.<br>          const held = new Promise<void>((resolve) => { release = resolve; });<br>          try {<br>            setBoot({<br>              repo: new DemoRepository(localStorage),<br>              error: "",<br>              loading: false,<br>            });<br>          } catch (e) {<br>            setBoot({ repo: null, error: message(e), loading: false });<br>          }<br>          await held;<br>        },<br>      ) ∧ truthy: !disposed | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |

## H-94fca0695a93

**@onRetry** · [src/App.tsx:189](../../../src/App.tsx#L189)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 189행 | truthy: !boot.repo | location.reload()<br>call |

## H-5e1a27367490

**@onClick** · [src/App.tsx:191](../../../src/App.tsx#L191)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 191행 | truthy: !boot.repo | setShowBootArchives(value => !value)<br>state-update<br>전달 콜백: H-685f6aa2ecc1 |

## H-685f6aa2ecc1

**@callback:setShowBootArchives** · [src/App.tsx:191](../../../src/App.tsx#L191)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-87e0150188a8

**Workspace** · [src/App.tsx:198](../../../src/App.tsx#L198)

분기 조건과 가능한 갈림길:

- B-ae0f0e6c6ec7 · IfStatement · !record.body.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (268행).
- B-965e4ae20a18 · IfStatement · !previous || record.createdAt >= previous.createdAt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (270행).
- B-7022aacc7b20 · ConditionalExpression · data.namespace === "demo" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (305행).
- B-88a13da56f29 · ConditionalExpression · node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (512행).
- B-408610745e6b · ConditionalExpression · node?.role === 'topic' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (534행).
- B-f15d8b7e465a · ConditionalExpression · commandTopic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (544행).
- B-475ebcfa68b4 · ConditionalExpression · observatory.studySource || observatory.caller → truthy / falsy; 바깥 조건: 별도 조건식 없음 (557행).
- B-e3d860521074 · ConditionalExpression · route === "/concepts" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (571행).
- B-1419882d6ab6 · ConditionalExpression · route === "/about" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" (571행).
- B-763ee2ce8aa6 · ConditionalExpression · route === "/help" || route === "/subscription" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" (571행).
- B-160ca5bc211f · ConditionalExpression · route === "/my-progress" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" (571행).
- B-635fbac19340 · ConditionalExpression · route === "/schedules" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" (572행).
- B-9866fc58ed72 · ConditionalExpression · route === "/material-cards" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" (572행).
- B-4e1a7ba21be8 · ConditionalExpression · route === "/math" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" (572행).
- B-fe096faf8aba · ConditionalExpression · memoryTestRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" (572행).
- B-dfdae232621e · ConditionalExpression · materialRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute (572행).
- B-2d8eb0761a1e · ConditionalExpression · practiceRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute (572행).
- B-dc767b9546a5 · ConditionalExpression · codeRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute (572행).
- B-3c45a84c940b · ConditionalExpression · route === "/statistics" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute (572행).
- B-cfdf2a21b1ff · ConditionalExpression · route === "/backup" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" (573행).
- B-58774c5abdaa · ConditionalExpression · route === "/graph" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" (573행).
- B-310a0825c095 · ConditionalExpression · route === "/board" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" (573행).
- B-144f2628c80e · ConditionalExpression · route === "/canvas" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" (573행).
- B-58050903bba5 · ConditionalExpression · route === "/recall" || route === "/recall/scheduled" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" (575행).
- B-6286001a8383 · ConditionalExpression · memoRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" (577행).
- B-dd1eba35ac9e · ConditionalExpression · route === "/draft-archives" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute (579행).
- B-68fc7b4eb531 · ConditionalExpression · route === "/subjects" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" (581행).
- B-e515dd7ba469 · ConditionalExpression · route === "/search" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" ∧ falsy: route === "/subjects" (583행).
- B-7f0de5996030 · ConditionalExpression · route === "/trash" → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" ∧ falsy: route === "/subjects" ∧ falsy: route === "/search" (585행).
- B-be99edc539ca · ConditionalExpression · route.startsWith("/free") → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" ∧ falsy: route === "/subjects" ∧ falsy: route === "/search" ∧ falsy: route === "/trash" (587행).
- B-e93ffe4a96d6 · ConditionalExpression · recordRoute → truthy / falsy; 바깥 조건: falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" || route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" || route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" ∧ falsy: route === "/subjects" ∧ falsy: route === "/search" ∧ falsy: route === "/trash" ∧ falsy: route.startsWith("/free") (589행).
- B-e1d3333ed337 · ConditionalExpression · route === "/" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (595행).
- B-da8f5880ee04 · ConditionalExpression · route === "/canvas" → truthy / falsy; 바깥 조건: falsy: route === "/" (595행).
- B-9444fce58bc2 · ConditionalExpression · data.namespace === "demo" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (622행).
- B-6ea1148c7847 · ConditionalExpression · subject → truthy / falsy; 바깥 조건: truthy: route !== "/" (678행).
- B-a08e69f928d0 · ConditionalExpression · node → truthy / falsy; 바깥 조건: truthy: route !== "/" (681행).
- B-f31a5d3970d5 · ConditionalExpression · route !== "/" && !subject → truthy / falsy; 바깥 조건: truthy: route !== "/" ∧ falsy: node (686행).
- B-f18016e55f98 · ConditionalExpression · cleanupKeys.length → truthy / falsy; 바깥 조건: truthy: error (692행).
- B-6f6952238518 · ConditionalExpression · node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (728행).
- B-981c7c069f9e · ConditionalExpression · subject → truthy / falsy; 바깥 조건: falsy: node (730행).
- B-6c8f8a3ae897 · ConditionalExpression · route === "/subscription" → truthy / falsy; 바깥 조건: truthy: ["/about", "/help", "/my-progress", "/subscription"].includes(route) (742행).
- B-1faf8a4fc072 · ConditionalExpression · recentTopics.length → truthy / falsy; 바깥 조건: truthy: route === "/" (765행).
- B-9757c153ba3e · ConditionalExpression · recentTopics.length → truthy / falsy; 바깥 조건: truthy: route === "/" (772행).
- B-5b96497e0878 · ConditionalExpression · scope === "independent" → truthy / falsy; 바깥 조건: truthy: route === "/subjects" (855행).
- B-9b6b6a1e103d · ConditionalExpression · scope === "all" || scope === "unassigned" → truthy / falsy; 바깥 조건: truthy: route === "/subjects" ∧ falsy: scope === "independent" (855행).
- B-01b3ef99b47d · ConditionalExpression · node.role === "unit" → truthy / falsy; 바깥 조건: truthy: node (966행).
- B-81305acd9660 · ConditionalExpression · node.role === "unit" → truthy / falsy; 바깥 조건: truthy: node (968행).
- B-c4786d5dbd98 · ConditionalExpression · records.filter((r) => r.targetId === node.id).length → truthy / falsy; 바깥 조건: truthy: node (974행).
- B-cd52057559cf · ConditionalExpression · route.startsWith("/record/") → truthy / falsy; 바깥 조건: truthy: recordRoute (1013행).
- B-71bafe3c1b87 · ConditionalExpression · route === "/recall/scheduled" → truthy / falsy; 바깥 조건: truthy: route === "/recall" || route === "/recall/scheduled" (1033행).
- B-44495ce0d411 · ConditionalExpression · route.startsWith("/memos/") → truthy / falsy; 바깥 조건: truthy: memoRoute (1034행).
- B-1a6061fab2db · ConditionalExpression · route.startsWith('/materials/') → truthy / falsy; 바깥 조건: truthy: materialRoute (1048행).
- B-12162dd13586 · ConditionalExpression · route.startsWith("/code/") → truthy / falsy; 바깥 조건: truthy: codeRoute (1090행).
- B-f6d7ff662d29 · ConditionalExpression · route.startsWith("/memory-test/result/") → truthy / falsy; 바깥 조건: truthy: memoryTestRoute (1092행).
- B-bd7fcab2ed4d · ConditionalExpression · route.startsWith("/memory-test/") && !route.startsWith("/memory-test/result/") → truthy / falsy; 바깥 조건: truthy: memoryTestRoute (1092행).
- B-89fce9f737ef · ConditionalExpression · route.startsWith('/practice/') → truthy / falsy; 바깥 조건: truthy: practiceRoute (1093행).
- B-f97f057013c0 · ConditionalExpression · dialog === "semester" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) (1162행).
- B-8ba5aba15f79 · ConditionalExpression · dialog === "subject" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "semester" (1164행).
- B-23ccfeddf2d5 · ConditionalExpression · dialog === "move" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "semester" ∧ falsy: dialog === "subject" (1166행).
- B-e2dc650d0fc5 · ConditionalExpression · dialog === "rename" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "semester" ∧ falsy: dialog === "subject" ∧ falsy: dialog === "move" (1168행).
- B-71dd3ebd2efb · ConditionalExpression · dialog === "trash" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "semester" ∧ falsy: dialog === "subject" ∧ falsy: dialog === "move" ∧ falsy: dialog === "rename" (1170행).
- B-3b3933791231 · ConditionalExpression · dialog === "move" && node → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) (1178행).
- B-8116c87f73db · ConditionalExpression · dialog === "trash" && node → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node (1187행).
- B-477b8872815d · ConditionalExpression · dialog === "bulk" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node (1209행).
- B-5b449f9305ad · ConditionalExpression · dialog === "rename" → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node (1268행).
- B-9bfa2721245e · ConditionalExpression · notice.undo → truthy / falsy; 바깥 조건: truthy: notice?.undo && !recordRoute (1279행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | 별도 조건식 없음 | useState(repository.getSnapshot())<br>call |
| 199행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 200행 | 별도 조건식 없음 | useEffect(() => repository.subscribe?.(() => setData(repository.getSnapshot())), [repository])<br>call<br>전달 콜백: H-9e861f8434ca |
| 201행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 202행 | 별도 조건식 없음 | useRoute(prefix)<br>call |
| 203행 | 별도 조건식 없음 | useRoutePerformance(route)<br>call |
| 204행 | 별도 조건식 없음 | useExperience(data)<br>call → [H-1bd5ad56fe0b](ui__brand-experience.md#h-1bd5ad56fe0b) |
| 205행 | 별도 조건식 없음 | useObservatoryJourney(data, route)<br>call → [H-2779eeb2ca9b](ui__observatory-navigation.md#h-2779eeb2ca9b) |
| 206행 | 별도 조건식 없음 | useStudyWorkspace(data, route)<br>call → [H-60e25e72a3d7](ui__study-workspace.md#h-60e25e72a3d7) |
| 207행 | 별도 조건식 없음 | useState(() => readPreference("scope", "all", prefix))<br>call<br>전달 콜백: H-c18279088900 |
| 208행 | 별도 조건식 없음 | useState(() => readPreference("query", "", prefix))<br>call<br>전달 콜백: H-7f695f571c9e |
| 209행 | 별도 조건식 없음 | useState("")<br>call |
| 210행 | 별도 조건식 없음 | useState([])<br>call |
| 211행 | 별도 조건식 없음 | useState(null)<br>call |
| 215행 | 별도 조건식 없음 | useState(null)<br>call |
| 218행 | 별도 조건식 없음 | useState("")<br>call |
| 219행 | 별도 조건식 없음 | useState("")<br>call |
| 220행 | 별도 조건식 없음 | useState("topic")<br>call |
| 221행 | 별도 조건식 없음 | useState("")<br>call |
| 222행 | 별도 조건식 없음 | useState("")<br>call |
| 223행 | 별도 조건식 없음 | useState(false)<br>call |
| 224행 | 별도 조건식 없음 | useState(["", "", ""])<br>call |
| 225행 | 별도 조건식 없음 | useState("")<br>call |
| 226행 | 별도 조건식 없음 | useState(false)<br>call |
| 227행 | 별도 조건식 없음 | useState("")<br>call |
| 228행 | 별도 조건식 없음 | useState(() => readPreference("theme", "auto", prefix))<br>call<br>전달 콜백: H-572a7a63a997 |
| 229행 | 별도 조건식 없음 | useState(() => readPreference("motion", "auto", prefix) === "reduce")<br>call<br>전달 콜백: H-d87ffe071e31 |
| 230행 | 별도 조건식 없음 | useState(() => { try { return JSON.parse(sessionStorage.getItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`) \|\| "[]"); } catch { return []; } })<br>call<br>전달 콜백: H-14d3d6c5d254 |
| 237행 | 별도 조건식 없음 | useEffect(() => { writePreference("scope", scope, prefix); }, [scope, prefix])<br>call<br>전달 콜백: H-5c50daeb4952 |
| 238행 | 별도 조건식 없음 | useEffect(() => { writePreference("query", query, prefix); }, [query, prefix])<br>call<br>전달 콜백: H-b1a2f8a20c73 |
| 239행 | 별도 조건식 없음 | useEffect(() => { writePreference("theme", theme, prefix); }, [theme, prefix])<br>call<br>전달 콜백: H-4649ea83bd09 |
| 240행 | 별도 조건식 없음 | useEffect(() => { writePreference("motion", reducedMotion ? "reduce" : "auto", prefix); if (reducedMotion) document.documentElement.dataset.motion = 'reduce'; else delete document.documentElement.dataset.motion; return () => { delete document.documentElement.dataset.motion; }; }, [reducedMotion, prefix])<br>call<br>전달 콜백: H-da6324198312 |
| 246행 | 별도 조건식 없음 | useRef(new Set<string>())<br>call |
| 247행 | 별도 조건식 없음 | active(data.nodes)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 248행 | 별도 조건식 없음 | active(data.subjects)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 249행 | 별도 조건식 없음 | nodes.find((n) => route === `/node/${n.id}`)<br>call<br>전달 콜백: H-4b3915665527 |
| 251행 | 별도 조건식 없음 | subjects.find((s) => route === `/subject/${s.id}` \|\| s.id === node?.subjectId)<br>call<br>전달 콜백: H-cca14fd1ddbe |
| 254행 | 별도 조건식 없음 | subjects.filter((s) => scope === "all" \|\| s.scope.kind === scope \|\| (s.scope.kind === "semester" && s.scope.semesterId === scope))<br>call<br>전달 콜백: H-7af3e2ee78ac |
| 260행 | 별도 조건식 없음 | nodes.filter((n) => shownSubjects.some((s) => s.id === n.subjectId))<br>call<br>전달 콜백: H-b78a6feafa76 |
| 263행 | 별도 조건식 없음 | shownNodes.filter((n) => n.role === "topic")<br>call<br>전달 콜백: H-ed50e3d5d906 |
| 264행 | 별도 조건식 없음 | active(data.records)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 268행 | 별도 조건식 없음 | record.body.trim()<br>call |
| 269행 | 별도 조건식 없음 | latestWrittenRecords.get(record.targetId)<br>call |
| 271행 | truthy: !previous \|\| record.createdAt >= previous.createdAt | latestWrittenRecords.set(record.targetId, record)<br>call |
| 273행 | 별도 조건식 없음 | recent<br>    .map((id) => topics.find((t) => t.id === id))<br>    .filter(Boolean)<br>call |
| 273행 | 별도 조건식 없음 | recent<br>    .map((id) => topics.find((t) => t.id === id))<br>call<br>전달 콜백: H-a186a6954edf |
| 306행 | 별도 조건식 없음 | useEffect(() => { if (!recentNodeId) return; setRecent((previous) => { const next = [recentNodeId, ...previous.filter((id) => id !== recentNodeId)].slice( 0, 6, ); try { sessionStorage.setItem(recentStorageKey, JSON.stringify(next)); } catch {} return next; }); }, [recentNodeId, recentStorageKey])<br>call<br>전달 콜백: H-e0ad1b0c16bb |
| 319행 | 별도 조건식 없음 | useEffect(() => { if (theme === "auto") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = theme; }, [theme])<br>call<br>전달 콜백: H-fc3406b7f2dc |
| 360행 | 별도 조건식 없음 | useEffect(() => { setDialog(null); }, [route, scope])<br>call<br>전달 콜백: H-5f07ea231b77 |
| 406행 | 별도 조건식 없음 | nodes.filter(item => item.subjectId === subject?.id && item.parentId === (node?.id \|\| null) && previewOutlineEntries(bulkNames).entries.some(entry => entry.name === item.name)).sort((a, b) => a.order - b.order)<br>call<br>전달 콜백: H-8dd334e6f754 |
| 406행 | 별도 조건식 없음 | nodes.filter(item => item.subjectId === subject?.id && item.parentId === (node?.id \|\| null) && previewOutlineEntries(bulkNames).entries.some(entry => entry.name === item.name))<br>call<br>전달 콜백: H-beb192dfab10 |
| 407행 | 별도 조건식 없음 | previewOutlineEntries(bulkNames).entries.filter(entry => duplicateChoice !== "reuse" \|\| !bulkExisting.some(item => item.name === entry.name))<br>call<br>전달 콜백: H-125b29c88d7e |
| 407행 | 별도 조건식 없음 | previewOutlineEntries(bulkNames)<br>call |
| 512행 | truthy: node | nodes.filter(item => item.subjectId === node.subjectId && item.parentId === node.parentId).sort((a,b) => a.order - b.order)<br>call<br>전달 콜백: H-771651c46f89 |
| 512행 | truthy: node | nodes.filter(item => item.subjectId === node.subjectId && item.parentId === node.parentId)<br>call<br>전달 콜백: H-dccfa2b933f9 |
| 513행 | 별도 조건식 없음 | siblings.findIndex(item => item.id === node?.id)<br>call<br>전달 콜백: H-20ef1db7e85b |
| 536행 | 별도 조건식 없음 | navItems.map((item) => ({ id: `nav:${item.href}`, title: `${item.text} 열기`, run: () => go(item.href), }))<br>call<br>전달 콜백: H-a56975c302b9 |
| 547행 | 별도 조건식 없음 | (['memo', 'math', 'code', 'record'] as const).map((tool) => ({ id: `side:${tool}`, title: `${{ memo: '메모', math: '수식', code: '코딩 연습', record: '기록' }[tool]} 곁에 열기`, disabled: deskMaterial ? undefined : '강의 자료를 먼저 열어 주세요.', run: () => studyWorkspace.openTool(tool), }))<br>call<br>전달 콜백: H-f1425dc8f839 |
| 563행 | 별도 조건식 없음 | route.startsWith("/record")<br>call |
| 564행 | falsy: route === "/memos" | route.startsWith("/memos/")<br>call |
| 565행 | falsy: route === "/materials" | route.startsWith("/materials/")<br>call |
| 566행 | falsy: route === "/code" | route.startsWith("/code/")<br>call |
| 567행 | falsy: route === "/memory-test" | route.startsWith("/memory-test/")<br>call |
| 568행 | falsy: route === "/practice" | route.startsWith("/practice/")<br>call |
| 569행 | falsy: route === "/free" | route.startsWith("/free/")<br>call |
| 587행 | falsy: route === "/concepts" ∧ falsy: route === "/about" ∧ falsy: route === "/help" \|\| route === "/subscription" ∧ falsy: route === "/my-progress" ∧ falsy: route === "/schedules" ∧ falsy: route === "/material-cards" ∧ falsy: route === "/math" ∧ falsy: memoryTestRoute ∧ falsy: materialRoute ∧ falsy: practiceRoute ∧ falsy: codeRoute ∧ falsy: route === "/statistics" ∧ falsy: route === "/backup" ∧ falsy: route === "/graph" ∧ falsy: route === "/board" ∧ falsy: route === "/canvas" ∧ falsy: route === "/recall" \|\| route === "/recall/scheduled" ∧ falsy: memoRoute ∧ falsy: route === "/draft-archives" ∧ falsy: route === "/subjects" ∧ falsy: route === "/search" ∧ falsy: route === "/trash" | route.startsWith("/free")<br>call |
| 598행 | 별도 조건식 없음 | navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href \|\| item.href === "/record" && recordRoute \|\| item.href === "/memos" && memoRoute \|\| item.href === "/materials" && materialRoute \|\| item.href === "/code" && codeRoute \|\| item.href === "/practice" && practiceRoute \|\| item.href === "/memory-test" && memoryTestRoute \|\| item.href === "/subjects" && Boolean(subject)}))<br>call<br>전달 콜백: H-0f647248b0d1 |
| 632행 | 별도 조건식 없음 | active(data.semesters).map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>call<br>전달 콜백: H-4aa1f6b218a5 |
| 632행 | 별도 조건식 없음 | active(data.semesters)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 664행 | truthy: route === "/" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-0df9f9a86e4d |
| 682행 | truthy: route !== "/" ∧ truthy: node | topicPath(node.id).map((n) => ({ label: n.name, href: `#/node/${n.id}`, }))<br>call<br>전달 콜백: H-a3e902036dbe |
| 682행 | truthy: route !== "/" ∧ truthy: node | topicPath(node.id)<br>call → [H-c594f5bfb70f](App.md#h-c594f5bfb70f) |
| 742행 | 별도 조건식 없음 | ["/about", "/help", "/my-progress", "/subscription"].includes(route)<br>call |
| 744행 | truthy: route === "/schedules" | shownSubjects.map(subject=>subject.id)<br>call<br>전달 콜백: H-181ca0feee72 |
| 745행 | truthy: route === "/statistics" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-3efa72acce96 |
| 748행 | truthy: route === "/" | records.some(record => shownSubjects.some(subject => subject.id === record.subjectId))<br>call<br>전달 콜백: H-48602055096b |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3).map(record => <article key={record.id}> <h3><a href={`#/node/${encodeURIComponent(record.targetId)}`}>{nodes.find(node => node.id === record.targetId)?.name ?? subjects.find(subject => subject.id === record.targetId)?.name ?? '보관된 공부 주제'}</a></h3> <div className="record-source">{subjects.find(subject => subject.id === record.subjectId)?.name} · {record.dateEvidence.kind === 'exact' ? record.dateEvidence.date : record.dateEvidence.kind === 'range' ? `${record.dateEvidence.from}~${record.dateEvidence.to}` : '공부한 날짜 미정'}</div> {record.body && <p className="prose">{record.body}</p>} <footer><a href={`#/node/${encodeURIComponent(record.targetId)}`}>기록 열기</a><a href={`#/record/${encodeURIComponent(rec … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-0d9ad7e36d19 |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)<br>call |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))<br>call<br>전달 콜백: H-219165564c22 |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice()<br>call |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId))<br>call<br>전달 콜백: H-52892756fea0 |
| 759행 | truthy: route === "/" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-4698aef785f2 |
| 760행 | truthy: route === "/" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-b2ba77a57014 |
| 772행 | truthy: route === "/" | (recentTopics.length<br>                      ? recentTopics<br>                      : topics.slice(0, 3)<br>                    ).map((t) => ( <Card key={t.id} className="quick-topic"> <div> <p className="muted"> {subjects.find((s) => s.id === t.subjectId)?.name} </p> <a className="topic-title" href={`#/node/${t.id}`}> {t.name} </a> {latestWrittenRecords.has(t.id) && ( <a className="recent-record-preview" href={`#/node/${encodeURIComponent(t.id)}`} aria-label={`${t.name} 최근 남긴 글 보기`}> 최근 남긴 글: {latestWrittenRecords.get(t.id)!.body.trim().replace(/\s+/g, " ")} </a> )} </div> <Button onClick={() => quickGuard.current.has(t.id) ? go(`/record/${t.id}`) : quickRecord(t) } > {quickGuard.current.has(t.id) ? "새 기록" : "공부함"} </Button> </Card> ))<br>call<br>전달 콜백: H-8e66357d419e |
| 774행 | truthy: route === "/" ∧ falsy: recentTopics.length | topics.slice(0, 3)<br>call |
| 810행 | truthy: route === "/" | records<br>                            .filter(<br>                              (r) =><br>                                (r.done \|\|<br>                                  Object.values(r.trace).some(<br>                                    (t) =><br>                                      t.status === "checked" \|\|<br>                                      (t.repeats?.length \|\| 0) > 0,<br>                                  )) &&<br>                                shownSubjects.some(<br>                                  (subject) => subject.id === r.subjectId,<br>                                ),<br>                            )<br>                            .map((r) => r.sessionId)<br>call<br>전달 콜백: H-bbabf92f939b |
| 810행 | truthy: route === "/" | records<br>                            .filter((r) => (r.done \|\| Object.values(r.trace).some( (t) => t.status === "checked" \|\| (t.repeats?.length \|\| 0) > 0, )) && shownSubjects.some( (subject) => subject.id === r.subjectId, ))<br>call<br>전달 콜백: H-f97023a79b4b |
| 837행 | truthy: route === "/" | topics.filter((t) => !records.some((r) => r.targetId === t.id))<br>call<br>전달 콜백: H-a27e13b549db |
| 866행 | truthy: route === "/subjects" | shownSubjects.map((s) => ( <Card key={s.id}> <p className="eyebrow"> {s.scope.kind === "semester" ? data.semesters.find( (x) => s.scope.kind === "semester" && x.id === s.scope.semesterId, )?.name : s.scope.kind === "independent" ? "독립 공부" : "학기 미지정"} </p> <h2> <a href={`#/subject/${s.id}`}>{s.name}</a> </h2> <p className="muted"> { nodes.filter( (n) => n.subjectId === s.id && n.role === "topic", ).length } 개 주제 </p> </Card> ))<br>call<br>전달 콜백: H-7b98ecc144e7 |
| 913행 | truthy: subject && !node | tree(null)<br>call → [H-e75b2b003988](App.md#h-e75b2b003988) |
| 962행 | truthy: node | tree(node.id)<br>call → [H-e75b2b003988](App.md#h-e75b2b003988) |
| 974행 | truthy: node | records.filter((r) => r.targetId === node.id)<br>call<br>전달 콜백: H-67cb2bb1fe48 |
| 978행 | truthy: node ∧ truthy: records.filter((r) => r.targetId === node.id).length | records.filter((r) => r.targetId === node.id)<br>call<br>전달 콜백: H-8e25f6c4ec54 |
| 1012행 | truthy: recordRoute | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-b461f0d33ee9 |
| 1013행 | truthy: recordRoute | route.startsWith("/record/")<br>call |
| 1013행 | truthy: recordRoute ∧ truthy: route.startsWith("/record/") | route.slice("/record/".length)<br>call |
| 1027행 | truthy: route === "/graph" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-7c80d2fe7d50 |
| 1028행 | truthy: route === "/board" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-1c465b53bebf |
| 1029행 | truthy: route === "/canvas" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-94197ddab9b9 |
| 1033행 | truthy: route === "/recall" \|\| route === "/recall/scheduled" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-f76d3c9511e6 |
| 1034행 | truthy: memoRoute | route.startsWith("/memos/")<br>call |
| 1034행 | truthy: memoRoute ∧ truthy: route.startsWith("/memos/") | route.slice("/memos/".length)<br>call |
| 1046행 | truthy: materialRoute | shownSubjects.map((item) => item.id)<br>call<br>전달 콜백: H-30fdb7524fb7 |
| 1048행 | truthy: materialRoute | route.startsWith('/materials/')<br>call |
| 1049행 | truthy: materialRoute ∧ truthy: route.startsWith('/materials/') | decodeURIComponent(route.slice('/materials/'.length))<br>call |
| 1049행 | truthy: materialRoute ∧ truthy: route.startsWith('/materials/') | route.slice('/materials/'.length)<br>call |
| 1090행 | truthy: codeRoute | route.startsWith("/code/")<br>call |
| 1090행 | truthy: codeRoute ∧ truthy: route.startsWith("/code/") | route.slice("/code/".length)<br>call |
| 1091행 | truthy: route === "/material-cards" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-9112da4cf36f |
| 1092행 | truthy: memoryTestRoute | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-c90647a79fde |
| 1092행 | truthy: memoryTestRoute | route.startsWith("/memory-test/result/")<br>call |
| 1092행 | truthy: memoryTestRoute ∧ truthy: route.startsWith("/memory-test/result/") | decodeURIComponent(route.slice("/memory-test/result/".length))<br>call |
| 1092행 | truthy: memoryTestRoute ∧ truthy: route.startsWith("/memory-test/result/") | route.slice("/memory-test/result/".length)<br>call |
| 1092행 | truthy: memoryTestRoute | route.startsWith("/memory-test/")<br>call |
| 1092행 | truthy: memoryTestRoute ∧ truthy: route.startsWith("/memory-test/") | route.startsWith("/memory-test/result/")<br>call |
| 1092행 | truthy: memoryTestRoute ∧ truthy: route.startsWith("/memory-test/") && !route.startsWith("/memory-test/result/") | decodeURIComponent(route.slice("/memory-test/".length))<br>call |
| 1092행 | truthy: memoryTestRoute ∧ truthy: route.startsWith("/memory-test/") && !route.startsWith("/memory-test/result/") | route.slice("/memory-test/".length)<br>call |
| 1093행 | truthy: practiceRoute | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-fbb9fa4c0e4e |
| 1093행 | truthy: practiceRoute | route.startsWith('/practice/')<br>call |
| 1093행 | truthy: practiceRoute ∧ truthy: route.startsWith('/practice/') | route.slice('/practice/'.length)<br>call |
| 1094행 | truthy: route === "/search" | shownSubjects.map(subject => subject.id)<br>call<br>전달 콜백: H-72fbabc96231 |
| 1101행 | truthy: route === "/trash" | data.nodes.some((n) => n.deletedAt)<br>call<br>전달 콜백: H-808e88ff3a1f |
| 1101행 | truthy: route === "/trash" ∧ truthy: !data.nodes.some((n) => n.deletedAt) | (data.memos ?? []).some(memo => memo.deletedAt)<br>call<br>전달 콜백: H-cbb62950764e |
| 1104행 | truthy: route === "/trash" | data.nodes<br>                .filter(<br>                  (n) =><br>                    n.deletedAt &&<br>                    !data.nodes.find((parent) => parent.id === n.parentId)<br>                      ?.deletedAt,<br>                )<br>                .map((n) => ( <Card className="quick-topic" key={n.id}> <span>{n.name}</span> <Button onClick={() => commit( { type: "restoreNode", id: n.id, expectedVersion: n.version, }, "목차를 복원했습니다.", ) } > 복원 </Button> </Card> ))<br>mutation-request<br>전달 콜백: H-5f73d9f842c8 |
| 1104행 | truthy: route === "/trash" | data.nodes<br>                .filter((n) => n.deletedAt && !data.nodes.find((parent) => parent.id === n.parentId) ?.deletedAt)<br>call<br>전달 콜백: H-84ddd56f3dd1 |
| 1135행 | 별도 조건식 없음 | ["/", "/subjects", "/concepts", "/search", "/trash", "/free", "/draft-archives", "/material-cards", "/recall", "/recall/scheduled", "/canvas", "/graph", "/board", "/statistics", "/math", "/backup", "/about", "/help", "/my-progress", "/subscription"].includes(route)<br>preservation-boundary |
| 1157행 | 별도 조건식 없음 | navItems.map(item => ({href:`#${item.href}`, label:item.text, active:route === item.href \|\| item.href === "/record" && recordRoute \|\| item.href === "/memos" && memoRoute \|\| item.href === "/materials" && materialRoute \|\| item.href === "/code" && codeRoute \|\| item.href === "/practice" && practiceRoute \|\| item.href === "/memory-test" && memoryTestRoute \|\| item.href === "/subjects" && Boolean(subject)}))<br>call<br>전달 콜백: H-1f72ac983e3d |
| 1160행 | truthy: Boolean(dialog) | Boolean(dialog)<br>call |
| 1180행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | descendants(node.id)<br>call → [H-fd82bc4adb00](App.md#h-fd82bc4adb00) |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | nodes.filter(candidate => candidate.subjectId === node.subjectId && candidate.id !== node.id && !descendants(node.id).some(child => child.id === candidate.id)).map(candidate => <option key={candidate.id} value={candidate.id}>{topicPath(candidate.id).map(parent => parent.name).join(" / ")}</option>)<br>call<br>전달 콜백: H-4ab4e9332975 |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | nodes.filter(candidate => candidate.subjectId === node.subjectId && candidate.id !== node.id && !descendants(node.id).some(child => child.id === candidate.id))<br>call<br>전달 콜백: H-c57f69799139 |
| 1190행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ truthy: dialog === "trash" && node | descendants(node.id)<br>call → [H-fd82bc4adb00](App.md#h-fd82bc4adb00) |
| 1212행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | bulkNames.map((value, index) => <Input key={index} label={`항목 ${index + 1} 이름`} value={value} maxLength={180} onKeyDown={event => { if (event.key !== "Enter" \|\| event.nativeEvent.isComposing \|\| event.keyCode === 229) return; event.preventDefault(); if (index === bulkNames.length - 1 && bulkNames.length < 500) { const next = [...bulkNames, ""]; setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next }); } requestAnimationFrame(() => document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach(input => { if (input.dataset.editingContext === `${modalKey}:row:${index + 1}`) input.focus(); })); }} data-editing-context={`${modalKey}:row:${index}`} onChange={event => { const ne … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-bc348f83e2cb |
| 1255행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | bulkNames.some(value => value.trim())<br>call<br>전달 콜백: H-51ed8060c820 |
| 1256행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview | previewOutlineEntries(bulkNames)<br>call |
| 1256행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview | previewOutlineEntries(bulkNames).entries.map(({name}) => <li key={name}>{name}</li>)<br>call<br>전달 콜백: H-e9ed851591a1 |
| 1256행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview | previewOutlineEntries(bulkNames)<br>call |
| 1257행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview | previewOutlineEntries(bulkNames).issues.map(issue => <p role="alert" key={`${issue.line}:${issue.message}`}>{issue.line}행: {issue.message}</p>)<br>call<br>전달 콜백: H-75f1dcfacc59 |
| 1257행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview | previewOutlineEntries(bulkNames)<br>call |
| 1262행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview ∧ truthy: bulkExisting.length > 0 | bulkExisting.map((item, index) => <li key={item.id}>{item.name} · 현재 목록의 {index + 1}번째 항목</li>)<br>call<br>전달 콜백: H-1fc5c1524a19 |
| 1267행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ falsy: modalBlocked ∧ truthy: dialog === "bulk" ∧ falsy: !bulkPreview | previewOutlineEntries(bulkNames)<br>call |
| 1267행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ falsy: modalBlocked ∧ truthy: dialog === "bulk" ∧ falsy: !bulkPreview \|\| !previewOutlineEntries(bulkNames).entries.length | previewOutlineEntries(bulkNames)<br>call |

반환/조기 중단: 594행 <render> [별도 조건식 없음]

## H-9e861f8434ca

**@callback:useEffect** · [src/App.tsx:200](../../../src/App.tsx#L200)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c18279088900

**@callback:useState** · [src/App.tsx:207](../../../src/App.tsx#L207)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 207행 | 별도 조건식 없음 | readPreference("scope", "all", prefix)<br>call → [H-32d9e181cddf](App.md#h-32d9e181cddf) |

## H-7f695f571c9e

**@callback:useState** · [src/App.tsx:208](../../../src/App.tsx#L208)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 208행 | 별도 조건식 없음 | readPreference("query", "", prefix)<br>call → [H-32d9e181cddf](App.md#h-32d9e181cddf) |

## H-572a7a63a997

**@callback:useState** · [src/App.tsx:228](../../../src/App.tsx#L228)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 228행 | 별도 조건식 없음 | readPreference("theme", "auto", prefix)<br>call → [H-32d9e181cddf](App.md#h-32d9e181cddf) |

## H-d87ffe071e31

**@callback:useState** · [src/App.tsx:229](../../../src/App.tsx#L229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 229행 | 별도 조건식 없음 | readPreference("motion", "auto", prefix)<br>call → [H-32d9e181cddf](App.md#h-32d9e181cddf) |

## H-14d3d6c5d254

**@callback:useState** · [src/App.tsx:230](../../../src/App.tsx#L230)

분기 조건과 가능한 갈림길:

- B-2463fab8fedc · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (231행).
- B-e5e5fb4ea883 · ConditionalExpression · data.namespace === "demo" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (232행).
- B-d642b7ae5102 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (233행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 232행 | 별도 조건식 없음 | JSON.parse(sessionStorage.getItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`) \|\| "[]")<br>call |
| 232행 | 별도 조건식 없음 | sessionStorage.getItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`)<br>preservation-boundary |

반환/조기 중단: 232행 JSON.parse(sessionStorage.getItem(data.namespace === "demo" ? "demo:recent" : `${prefix}:recent`) || "[]") [별도 조건식 없음]; 234행 [] [exception: exception]

## H-5c50daeb4952

**@callback:useEffect** · [src/App.tsx:237](../../../src/App.tsx#L237)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 237행 | 별도 조건식 없음 | writePreference("scope", scope, prefix)<br>call → [H-06d98b350952](App.md#h-06d98b350952) |

## H-b1a2f8a20c73

**@callback:useEffect** · [src/App.tsx:238](../../../src/App.tsx#L238)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 238행 | 별도 조건식 없음 | writePreference("query", query, prefix)<br>call → [H-06d98b350952](App.md#h-06d98b350952) |

## H-4649ea83bd09

**@callback:useEffect** · [src/App.tsx:239](../../../src/App.tsx#L239)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 239행 | 별도 조건식 없음 | writePreference("theme", theme, prefix)<br>call → [H-06d98b350952](App.md#h-06d98b350952) |

## H-da6324198312

**@callback:useEffect** · [src/App.tsx:240](../../../src/App.tsx#L240)

분기 조건과 가능한 갈림길:

- B-b55f67eb7ce4 · ConditionalExpression · reducedMotion → truthy / falsy; 바깥 조건: 별도 조건식 없음 (241행).
- B-01cf62b1c939 · IfStatement · reducedMotion → truthy / falsy; 바깥 조건: 별도 조건식 없음 (242행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 241행 | 별도 조건식 없음 | writePreference("motion", reducedMotion ? "reduce" : "auto", prefix)<br>call → [H-06d98b350952](App.md#h-06d98b350952) |

반환/조기 중단: 244행 () => { delete document.documentElement.dataset.motion; } [별도 조건식 없음]

## H-4b3915665527

**@callback:nodes.find** · [src/App.tsx:249](../../../src/App.tsx#L249)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cca14fd1ddbe

**@callback:subjects.find** · [src/App.tsx:252](../../../src/App.tsx#L252)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7af3e2ee78ac

**@callback:subjects.filter** · [src/App.tsx:255](../../../src/App.tsx#L255)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b78a6feafa76

**@callback:nodes.filter** · [src/App.tsx:260](../../../src/App.tsx#L260)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 261행 | 별도 조건식 없음 | shownSubjects.some((s) => s.id === n.subjectId)<br>call<br>전달 콜백: H-f681e73d6dfb |

## H-f681e73d6dfb

**@callback:shownSubjects.some** · [src/App.tsx:261](../../../src/App.tsx#L261)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ed50e3d5d906

**@callback:shownNodes.filter** · [src/App.tsx:263](../../../src/App.tsx#L263)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a186a6954edf

**@callback:recent
    .map** · [src/App.tsx:274](../../../src/App.tsx#L274)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 274행 | 별도 조건식 없음 | topics.find((t) => t.id === id)<br>call<br>전달 콜백: H-609d4c3c1253 |

## H-609d4c3c1253

**@callback:topics.find** · [src/App.tsx:274](../../../src/App.tsx#L274)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c594f5bfb70f

**topicPath** · [src/App.tsx:276](../../../src/App.tsx#L276)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 278행 | 별도 조건식 없음 | nodes.find((n) => n.id === id)<br>call<br>전달 콜백: H-7dc7a5696a63 |
| 280행 | 별도 조건식 없음 | result.unshift(current)<br>call |
| 281행 | 별도 조건식 없음 | nodes.find((n) => n.id === current!.parentId)<br>call<br>전달 콜백: H-d950b95adf28 |

반환/조기 중단: 283행 result [별도 조건식 없음]

## H-7dc7a5696a63

**@callback:nodes.find** · [src/App.tsx:278](../../../src/App.tsx#L278)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d950b95adf28

**@callback:nodes.find** · [src/App.tsx:281](../../../src/App.tsx#L281)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f91d9cc5d28f

**commit** · [src/App.tsx:285](../../../src/App.tsx#L285)

분기 조건과 가능한 갈림길:

- B-508219baa456 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (286행).
- B-b1228091664d · IfStatement · success → truthy / falsy; 바깥 조건: 별도 조건식 없음 (296행).
- B-359d0701efa2 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (298행).
- B-1a05d4bd7957 · IfStatement · dialog → truthy / falsy; 바깥 조건: exception: e (300행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 287행 | 별도 조건식 없음 | repository.execute({ ...action, opId: operation?.opId \|\| uid(), at: operation?.at \|\| new Date().toISOString(), userId: data.userId, namespace: data.namespace, } as Command)<br>call |
| 289행 | falsy: operation?.opId | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 290행 | falsy: operation?.at | new Date().toISOString()<br>call |
| 294행 | 별도 조건식 없음 | setData(next)<br>state-update |
| 295행 | 별도 조건식 없음 | setError("")<br>state-update |
| 296행 | truthy: success | setNotice({ message: success })<br>state-update |
| 299행 | exception: e | setError(message(e))<br>state-update |
| 299행 | exception: e | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |
| 300행 | exception: e ∧ truthy: dialog | setModalError(message(e))<br>state-update |
| 300행 | exception: e ∧ truthy: dialog | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |

반환/조기 중단: 297행 next [별도 조건식 없음]; 301행 null [exception: e]

## H-e0ad1b0c16bb

**@callback:useEffect** · [src/App.tsx:306](../../../src/App.tsx#L306)

분기 조건과 가능한 갈림길:

- B-65d71fa83f35 · IfStatement · !recentNodeId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (307행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 308행 | 별도 조건식 없음 | setRecent((previous) => { const next = [recentNodeId, ...previous.filter((id) => id !== recentNodeId)].slice( 0, 6, ); try { sessionStorage.setItem(recentStorageKey, JSON.stringify(next)); } catch {} return next; })<br>state-update<br>전달 콜백: H-4c4ab4d08769 |

반환/조기 중단: 307행 <render> [truthy: !recentNodeId]

## H-4c4ab4d08769

**@callback:setRecent** · [src/App.tsx:308](../../../src/App.tsx#L308)

분기 조건과 가능한 갈림길:

- B-bb2beacdfea9 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (313행).
- B-7285a922a293 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (315행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 309행 | 별도 조건식 없음 | [recentNodeId, ...previous.filter((id) => id !== recentNodeId)].slice(0, 6)<br>call |
| 309행 | 별도 조건식 없음 | previous.filter((id) => id !== recentNodeId)<br>call<br>전달 콜백: H-3abf66f49f32 |
| 314행 | 별도 조건식 없음 | sessionStorage.setItem(recentStorageKey, JSON.stringify(next))<br>preservation-boundary |
| 314행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |

반환/조기 중단: 316행 next [별도 조건식 없음]

## H-3abf66f49f32

**@callback:previous.filter** · [src/App.tsx:309](../../../src/App.tsx#L309)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fc3406b7f2dc

**@callback:useEffect** · [src/App.tsx:319](../../../src/App.tsx#L319)

분기 조건과 가능한 갈림길:

- B-1f1e96343b05 · IfStatement · theme === "auto" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (320행).

## H-d0729251aab3

**quickRecord** · [src/App.tsx:323](../../../src/App.tsx#L323)

분기 조건과 가능한 갈림길:

- B-e4c70c2a6408 · IfStatement · quickGuard.current.has(target.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (324행).
- B-208c7b13e055 · IfStatement · !next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (332행).
- B-3fe8d5ec3afe · ConditionalExpression · revision → truthy / falsy; 바깥 조건: 별도 조건식 없음 (344행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 324행 | 별도 조건식 없음 | quickGuard.current.has(target.id)<br>call |
| 325행 | 별도 조건식 없음 | quickGuard.current.add(target.id)<br>call |
| 326행 | 별도 조건식 없음 | commit({ type: "saveRecords", sessionId: uid(), entries: [{ targetId: target.id, done: true }], dateEvidence: { kind: "exact", date: localDay() }, })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 328행 | 별도 조건식 없음 | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 330행 | 별도 조건식 없음 | localDay()<br>call |
| 333행 | truthy: !next | quickGuard.current.delete(target.id)<br>mutation-request |
| 336행 | 별도 조건식 없음 | [...next.revisions]<br>      .reverse()<br>      .find((r) => r.collection === "records" && r.entityId === next.records.at(-1)?.id)<br>call<br>전달 콜백: H-c91fa4e2a222 |
| 336행 | 별도 조건식 없음 | [...next.revisions]<br>      .reverse()<br>call |
| 342행 | 별도 조건식 없음 | setNotice({ message: `‘${target.name}’ 공부함을 기록했습니다.`, undo: revision ? () => { const restored = commit( { type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version, }, "기록을 되돌렸습니다.", ); if (restored) quickGuard.current.delete(target.id); } : undefined, })<br>state-update |

반환/조기 중단: 324행 <render> [truthy: quickGuard.current.has(target.id)]; 334행 <render> [truthy: !next]

## H-c91fa4e2a222

**@callback:[...next.revisions]
      .reverse()
      .find** · [src/App.tsx:339](../../../src/App.tsx#L339)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 340행 | truthy: r.collection === "records" | next.records.at(-1)<br>call |

## H-5f07ea231b77

**@callback:useEffect** · [src/App.tsx:360](../../../src/App.tsx#L360)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 360행 | 별도 조건식 없음 | setDialog(null)<br>state-update |

## H-ea7bb835afd0

**modalValue** · [src/App.tsx:361](../../../src/App.tsx#L361)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-870edca10b40

**persistModal** · [src/App.tsx:362](../../../src/App.tsx#L362)

분기 조건과 가능한 갈림길:

- B-261c3521a30c · IfStatement · modalBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (364행).
- B-97dc9acf7c9a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (365행).
- B-0fdedf06e5ed · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (366행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 363행 | 별도 조건식 없음 | JSON.stringify(modalValue(patch))<br>call |
| 363행 | 별도 조건식 없음 | modalValue(patch)<br>call → [H-ea7bb835afd0](App.md#h-ea7bb835afd0) |
| 364행 | truthy: modalBlocked | rescueWithoutOverwrite(modalKey, raw)<br>call |
| 365행 | 별도 조건식 없음 | storeDraftSafely(modalKey, raw)<br>preservation-boundary |
| 365행 | 별도 조건식 없음 | setModalError("")<br>state-update |
| 366행 | exception: exception | setModalError("초안을 이 기기에 보관하지 못했습니다. 입력은 현재 창에만 남아 있습니다. 다시 보관하거나 복사한 뒤 창을 닫아 주세요.")<br>state-update |

반환/조기 중단: 364행 <render> [truthy: modalBlocked]

## H-99a50fd3a414

**recoverModal** · [src/App.tsx:368](../../../src/App.tsx#L368)

분기 조건과 가능한 갈림길:

- B-bd941dcc6924 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (369행).
- B-c1a795191e6e · IfStatement · modalBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (370행).
- B-0e6c73b8500f · CatchClause · reason → exception; 바깥 조건: 별도 조건식 없음 (373행).
- B-e5a061372749 · ConditionalExpression · reason instanceof DraftArchiveError → truthy / falsy; 바깥 조건: exception: reason (373행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 370행 | truthy: modalBlocked | archiveDamagedDraft(modalKey)<br>preservation-boundary |
| 371행 | 별도 조건식 없음 | storeDraftSafely(modalKey, JSON.stringify(modalValue()))<br>preservation-boundary |
| 371행 | 별도 조건식 없음 | JSON.stringify(modalValue())<br>call |
| 371행 | 별도 조건식 없음 | modalValue()<br>call → [H-ea7bb835afd0](App.md#h-ea7bb835afd0) |
| 372행 | 별도 조건식 없음 | setModalBlocked(false)<br>state-update |
| 372행 | 별도 조건식 없음 | setModalError("")<br>state-update |
| 373행 | exception: reason | setModalError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요.")<br>state-update |

## H-efd410044e08

**finishModal** · [src/App.tsx:375](../../../src/App.tsx#L375)

분기 조건과 가능한 갈림길:

- B-63a0214a9fc6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (376행).
- B-8b68e893ca23 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (377행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 376행 | 별도 조건식 없음 | clearStoredDraft(modalKey)<br>preservation-boundary |
| 376행 | 별도 조건식 없음 | setModalError("")<br>state-update |
| 378행 | exception: exception | setCleanupKeys(keys => [...new Set([...keys, modalKey])])<br>state-update<br>전달 콜백: H-b5f958728b5b |
| 379행 | exception: exception | setError("변경은 저장했지만 초안을 정리하지 못했습니다. 이 창에서는 다시 적용하지 않습니다. 새로 열기 전에 초안 정리를 다시 시도해 주세요.")<br>state-update |
| 381행 | 별도 조건식 없음 | setDialog(null)<br>state-update |

## H-b5f958728b5b

**@callback:setCleanupKeys** · [src/App.tsx:378](../../../src/App.tsx#L378)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-132c9e1c9845

**openDialog** · [src/App.tsx:383](../../../src/App.tsx#L383)

분기 조건과 가능한 갈림길:

- B-8e33ade77ca8 · ConditionalExpression · next === "semester" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (384행).
- B-aff4ad243989 · ConditionalExpression · next === "subject" → truthy / falsy; 바깥 조건: falsy: next === "semester" (384행).
- B-0600ea5aee00 · ConditionalExpression · next === "rename" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (386행).
- B-a65520908311 · IfStatement · next !== "trash" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (387행).
- B-ad3b7aae054a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: next !== "trash" (388행).
- B-664c42c87373 · IfStatement · raw → truthy / falsy; 바깥 조건: truthy: next !== "trash" (390행).
- B-2dfca89537f8 · IfStatement · !saved || typeof saved.name !== "string" || typeof saved.moveParent !== "string" || !["unit", "outline", "topic"].includes(saved.role) || !Array.isArray(saved.bulkNames) || saved.bulkNames.length > 500 || !saved.bulkNames.every((value: unknown) => typeof value === "string") → truthy / falsy; 바깥 조건: truthy: next !== "trash" ∧ truthy: raw (392행).
- B-ef96bf5b2030 · IfStatement · draftReadError(key) → truthy / falsy; 바깥 조건: truthy: next !== "trash" (395행).
- B-fae055acc419 · IfStatement · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: truthy: next !== "trash" ∧ falsy: draftReadError(key) (396행).
- B-f45b23d08d39 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: next !== "trash" (397행).
- B-87d584fcbb47 · IfStatement · subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (403행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 385행 | 별도 조건식 없음 | setModalKey(key)<br>state-update |
| 385행 | 별도 조건식 없음 | setModalError("")<br>state-update |
| 385행 | 별도 조건식 없음 | setModalBlocked(false)<br>state-update |
| 385행 | 별도 조건식 없음 | setBulkPreview(false)<br>state-update |
| 385행 | 별도 조건식 없음 | setDuplicateChoice("")<br>state-update |
| 389행 | truthy: next !== "trash" | readRescuedDraft(key)<br>preservation-boundary |
| 389행 | truthy: next !== "trash" ∧ nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |
| 391행 | truthy: next !== "trash" ∧ truthy: raw | JSON.parse(raw)<br>call |
| 392행 | truthy: next !== "trash" ∧ truthy: raw ∧ falsy: !saved \|\| typeof saved.name !== "string" \|\| typeof saved.moveParent !== "string" | ["unit", "outline", "topic"].includes(saved.role)<br>call |
| 392행 | truthy: next !== "trash" ∧ truthy: raw ∧ falsy: !saved \|\| typeof saved.name !== "string" \|\| typeof saved.moveParent !== "string" \|\| !["unit", "outline", "topic"].includes(saved.role) | Array.isArray(saved.bulkNames)<br>call |
| 392행 | truthy: next !== "trash" ∧ truthy: raw ∧ falsy: !saved \|\| typeof saved.name !== "string" \|\| typeof saved.moveParent !== "string" \|\| !["unit", "outline", "topic"].includes(saved.role) \|\| !Array.isArray(saved.bulkNames) \|\| saved.bulkNames.length > 500 | saved.bulkNames.every((value: unknown) => typeof value === "string")<br>call<br>전달 콜백: H-d972219d95a2 |
| 392행 | truthy: next !== "trash" ∧ truthy: raw ∧ truthy: !saved \|\| typeof saved.name !== "string" \|\| typeof saved.moveParent !== "string" \|\| !["unit", "outline", "topic"].includes(saved.role) \|\| !Array.isArray(saved.bulkNames) \|\| saved.bulkNames.length > 500 \|\| !saved.bulkNames.every((value: unknown) => typeof value === "string") | Error()<br>call |
| 395행 | truthy: next !== "trash" | draftReadError(key)<br>preservation-boundary |
| 395행 | truthy: next !== "trash" ∧ truthy: draftReadError(key) | setModalBlocked(true)<br>state-update |
| 395행 | truthy: next !== "trash" ∧ truthy: draftReadError(key) | setModalError(draftReadError(key))<br>state-update |
| 395행 | truthy: next !== "trash" ∧ truthy: draftReadError(key) | draftReadError(key)<br>preservation-boundary |
| 396행 | truthy: next !== "trash" ∧ falsy: draftReadError(key) | draftHasUnstoredText(key)<br>preservation-boundary |
| 396행 | truthy: next !== "trash" ∧ falsy: draftReadError(key) ∧ truthy: draftHasUnstoredText(key) | setModalError("저장에 실패한 초안을 현재 창에서 이어 쓰고 있습니다. 새로고침 전 다시 보관해 주세요.")<br>state-update |
| 398행 | truthy: next !== "trash" ∧ exception: exception | rememberDraftReadError(key, "기존 초안을 읽지 못했습니다. 원본을 덮어쓰지 않았습니다. 원본 사본을 보관한 뒤 현재 입력을 새 초안으로 보관할 수 있습니다.")<br>preservation-boundary |
| 399행 | truthy: next !== "trash" ∧ exception: exception | setModalBlocked(true)<br>state-update |
| 399행 | truthy: next !== "trash" ∧ exception: exception | setModalError("기존 초안을 읽지 못했습니다. 원본을 덮어쓰지 않았습니다. 원본 사본을 보관한 뒤 현재 입력을 새 초안으로 보관할 수 있습니다.")<br>state-update |
| 402행 | 별도 조건식 없음 | setName(values.name)<br>state-update |
| 402행 | 별도 조건식 없음 | setMoveParent(values.moveParent)<br>state-update |
| 402행 | 별도 조건식 없음 | setRole(values.role)<br>state-update |
| 402행 | 별도 조건식 없음 | setBulkNames(values.bulkNames)<br>state-update |
| 403행 | truthy: subject | setOutlineToken(outlineRevisionToken(data, subject.id, node?.id \|\| null))<br>state-update |
| 403행 | truthy: subject | outlineRevisionToken(data, subject.id, node?.id \|\| null)<br>call |
| 404행 | 별도 조건식 없음 | setDialog(next)<br>state-update |

throw: 392행 Error()

## H-d972219d95a2

**@callback:saved.bulkNames.every** · [src/App.tsx:392](../../../src/App.tsx#L392)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-beb192dfab10

**@callback:nodes.filter** · [src/App.tsx:406](../../../src/App.tsx#L406)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 406행 | truthy: item.subjectId === subject?.id && item.parentId === (node?.id \|\| null) | previewOutlineEntries(bulkNames).entries.some(entry => entry.name === item.name)<br>call<br>전달 콜백: H-3db01be5ae1d |
| 406행 | truthy: item.subjectId === subject?.id && item.parentId === (node?.id \|\| null) | previewOutlineEntries(bulkNames)<br>call |

## H-3db01be5ae1d

**@callback:previewOutlineEntries(bulkNames).entries.some** · [src/App.tsx:406](../../../src/App.tsx#L406)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8dd334e6f754

**@callback:nodes.filter(item => item.subjectId === subject?.id && item.parentId === (node?.id || null) && previewOutlineEntries(bulkNames).entries.some(entry => entry.name === item.name)).sort** · [src/App.tsx:406](../../../src/App.tsx#L406)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-125b29c88d7e

**@callback:previewOutlineEntries(bulkNames).entries.filter** · [src/App.tsx:407](../../../src/App.tsx#L407)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 407행 | falsy: duplicateChoice !== "reuse" | bulkExisting.some(item => item.name === entry.name)<br>call<br>전달 콜백: H-182194e068de |

## H-182194e068de

**@callback:bulkExisting.some** · [src/App.tsx:407](../../../src/App.tsx#L407)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a447162cf962

**addItem** · [src/App.tsx:408](../../../src/App.tsx#L408)

분기 조건과 가능한 갈림길:

- B-269de8ee232f · IfStatement · modalBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (409행).
- B-aeb0dca2be64 · IfStatement · dialog === "bulk" && (!bulkPreview || previewOutlineEntries(bulkNames).issues.length || (bulkExisting.length > 0 && !duplicateChoice)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (410행).
- B-640b5d57485c · IfStatement · dialog === "bulk" && duplicateChoice === "reuse" && !bulkEntries.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (411행).
- B-c0b813652ac8 · IfStatement · dialog === "semester" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (416행).
- B-2a9cfd6fe65a · IfStatement · dialog === "subject" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (417행).
- B-32460584cfb3 · ConditionalExpression · scope === "independent" → truthy / falsy; 바깥 조건: truthy: dialog === "subject" (423행).
- B-99002e80f8e8 · ConditionalExpression · scope === "all" || scope === "unassigned" → truthy / falsy; 바깥 조건: truthy: dialog === "subject" ∧ falsy: scope === "independent" (425행).
- B-455ab71934fe · IfStatement · dialog === "node" && subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (429행).
- B-a441e6648839 · IfStatement · dialog === "bulk" && subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (438행).
- B-2c495bc9321e · ConditionalExpression · duplicateChoice === "create" → truthy / falsy; 바깥 조건: truthy: dialog === "bulk" && subject (440행).
- B-d80785a49c8a · IfStatement · dialog === "rename" && node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (441행).
- B-79f1950adb89 · IfStatement · next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (448행).
- B-4d9d2e9525bd · ConditionalExpression · dialog === "bulk" → truthy / falsy; 바깥 조건: truthy: next (450행).
- B-807752e2a174 · ConditionalExpression · revision → truthy / falsy; 바깥 조건: truthy: next (451행).
- B-03c59b18cf53 · IfStatement · dialog === "semester" → truthy / falsy; 바깥 조건: truthy: next (452행).
- B-91b0ee077c43 · IfStatement · dialog === "subject" → truthy / falsy; 바깥 조건: truthy: next (453행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 410행 | truthy: dialog === "bulk" ∧ falsy: !bulkPreview | previewOutlineEntries(bulkNames)<br>call |
| 412행 | truthy: dialog === "bulk" && duplicateChoice === "reuse" && !bulkEntries.length | finishModal()<br>call → [H-efd410044e08](App.md#h-efd410044e08) |
| 412행 | truthy: dialog === "bulk" && duplicateChoice === "reuse" && !bulkEntries.length | setNotice({ message: "같은 이름의 기존 항목을 유지했습니다. 새 항목이나 공부 기록은 만들지 않았습니다." })<br>state-update |
| 415행 | 별도 조건식 없음 | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 416행 | truthy: dialog === "semester" | commit({ type: "addSemester", id, name })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 418행 | truthy: dialog === "subject" | commit({ type: "addSubject", id, name, scope: scope === "independent" ? { kind: "independent" } : scope === "all" \|\| scope === "unassigned" ? { kind: "unassigned" } : { kind: "semester", semesterId: scope }, })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 430행 | truthy: dialog === "node" && subject | commit({ type: "addNode", id, name, role, subjectId: subject.id, parentId: node?.id \|\| null, })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 439행 | truthy: dialog === "bulk" && subject | commit({ type: "addNodes", subjectId: subject.id, parentId: node?.id \|\| null, role, entries: bulkEntries.map(value => ({ id: uid(), name: value.name })), expectedToken: outlineToken, ...(duplicateChoice === "create" ? { duplicateNames: "create" as const } : {}) })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 440행 | truthy: dialog === "bulk" && subject | bulkEntries.map(value => ({ id: uid(), name: value.name }))<br>call<br>전달 콜백: H-d56cf50e8689 |
| 442행 | truthy: dialog === "rename" && node | commit({ type: "renameNode", id: node.id, name, expectedVersion: node.version, })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 449행 | truthy: next | finishModal()<br>call → [H-efd410044e08](App.md#h-efd410044e08) |
| 450행 | truthy: next ∧ truthy: dialog === "bulk" | next.revisions.at(-1)<br>call |
| 451행 | truthy: next | setNotice({ message: "저장했습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "추가한 목차를 되돌렸습니다."); } : undefined })<br>state-update |
| 452행 | truthy: next ∧ truthy: dialog === "semester" | setScope(id)<br>state-update |
| 453행 | truthy: next ∧ truthy: dialog === "subject" | go(`/subject/${id}`)<br>navigation |

반환/조기 중단: 409행 <render> [truthy: modalBlocked]; 410행 <render> [truthy: dialog === "bulk" && (!bulkPreview || previewOutlineEntries(bulkNames).issues.length || (bulkExisting.length > 0 && !duplicateChoice))]; 412행 <render> [truthy: dialog === "bulk" && duplicateChoice === "reuse" && !bulkEntries.length]

## H-d56cf50e8689

**@callback:bulkEntries.map** · [src/App.tsx:440](../../../src/App.tsx#L440)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 440행 | truthy: dialog === "bulk" && subject | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |

## H-fd82bc4adb00

**descendants** · [src/App.tsx:456](../../../src/App.tsx#L456)

분기 조건과 가능한 갈림길:

- B-0f316f91aaea · IfStatement · !seen.has(child.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (461행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 459행 | 별도 조건식 없음 | stack.pop()<br>call |
| 460행 | 별도 조건식 없음 | nodes.filter(n => n.parentId === parent)<br>call<br>전달 콜백: H-5ba1ae317afa |
| 461행 | 별도 조건식 없음 | seen.has(child.id)<br>call |
| 461행 | truthy: !seen.has(child.id) | seen.add(child.id)<br>call |
| 461행 | truthy: !seen.has(child.id) | found.push(child)<br>call |
| 461행 | truthy: !seen.has(child.id) | stack.push(child.id)<br>call |

반환/조기 중단: 464행 found [별도 조건식 없음]

## H-5ba1ae317afa

**@callback:nodes.filter** · [src/App.tsx:460](../../../src/App.tsx#L460)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-411a9bc242d6

**moveNode** · [src/App.tsx:466](../../../src/App.tsx#L466)

분기 조건과 가능한 갈림길:

- B-ab86cce0d9fc · IfStatement · !node || modalBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (467행).
- B-a2b40629beee · IfStatement · !next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (469행).
- B-9f8ddaf8637a · ConditionalExpression · revision → truthy / falsy; 바깥 조건: 별도 조건식 없음 (472행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 468행 | 별도 조건식 없음 | commit({ type: "moveNode", id: node.id, parentId: moveParent \|\| null, expectedVersion: node.version })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 470행 | 별도 조건식 없음 | next.revisions.slice().reverse().find(r => r.collection === "nodes" && r.entityId === node.id)<br>call<br>전달 콜백: H-bdfcbc24d5c3 |
| 470행 | 별도 조건식 없음 | next.revisions.slice().reverse()<br>call |
| 470행 | 별도 조건식 없음 | next.revisions.slice()<br>call |
| 471행 | 별도 조건식 없음 | finishModal()<br>call → [H-efd410044e08](App.md#h-efd410044e08) |
| 472행 | 별도 조건식 없음 | setNotice({ message: "목차 위치를 옮겼습니다. 하위 항목과 기록은 같은 항목에 남습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "원래 위치로 되돌렸습니다."); } : undefined })<br>state-update |

반환/조기 중단: 467행 <render> [truthy: !node || modalBlocked]; 469행 <render> [truthy: !next]

## H-bdfcbc24d5c3

**@callback:next.revisions.slice().reverse().find** · [src/App.tsx:470](../../../src/App.tsx#L470)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dc2d69957ec8

**deleteNode** · [src/App.tsx:476](../../../src/App.tsx#L476)

분기 조건과 가능한 갈림길:

- B-f3be5b4510b5 · IfStatement · !node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (477행).
- B-b3670bdf0c2b · IfStatement · next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (484행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 479행 | 별도 조건식 없음 | commit({ type: "trashNode", id, expectedVersion: node.version, })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 485행 | truthy: next | setDialog(null)<br>state-update |
| 486행 | truthy: next | go(`/subject/${node.subjectId}`)<br>navigation |
| 487행 | truthy: next | next.nodes.find((n) => n.id === id)<br>call<br>전달 콜백: H-82b1e909ad31 |
| 488행 | truthy: next | setNotice({ message: "목차를 휴지통으로 옮겼습니다. 공부 기록은 남아 있습니다.", undo: () => { if ( commit( { type: "restoreNode", id, expectedVersion: after.version }, "목차를 복원했습니다.", ) ) go(`/node/${id}`); }, })<br>state-update |

반환/조기 중단: 477행 <render> [truthy: !node]

## H-82b1e909ad31

**@callback:next.nodes.find** · [src/App.tsx:487](../../../src/App.tsx#L487)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-69f3f5e70db3

**reorderNode** · [src/App.tsx:502](../../../src/App.tsx#L502)

분기 조건과 가능한 갈림길:

- B-a3aac773edf2 · IfStatement · !node || !subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (503행).
- B-f950a719c699 · IfStatement · other < 0 || other >= siblings.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (506행).
- B-35d9ec4dde02 · IfStatement · revision → truthy / falsy; 바깥 조건: 별도 조건식 없음 (510행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 504행 | 별도 조건식 없음 | nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId).sort((a, b) => a.order - b.order)<br>call<br>전달 콜백: H-9a2b215de1aa |
| 504행 | 별도 조건식 없음 | nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId)<br>call<br>전달 콜백: H-0aea25bd534f |
| 505행 | 별도 조건식 없음 | siblings.findIndex(item => item.id === node.id)<br>call<br>전달 콜백: H-8033fcf9efcd |
| 508행 | 별도 조건식 없음 | commit({ type: "reorderNodes", subjectId: subject.id, parentId: node.parentId, ids: siblings.map(item => item.id), expectedToken: outlineRevisionToken(data, subject.id, node.parentId) })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 508행 | 별도 조건식 없음 | siblings.map(item => item.id)<br>call<br>전달 콜백: H-16f08bd0c815 |
| 508행 | 별도 조건식 없음 | outlineRevisionToken(data, subject.id, node.parentId)<br>call |
| 510행 | truthy: revision | setNotice({ message: "형제 항목의 순서를 바꿨습니다.", undo: () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "목차 순서를 되돌렸습니다."); } })<br>state-update |

반환/조기 중단: 503행 <render> [truthy: !node || !subject]; 506행 <render> [truthy: other < 0 || other >= siblings.length]

## H-0aea25bd534f

**@callback:nodes.filter** · [src/App.tsx:504](../../../src/App.tsx#L504)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9a2b215de1aa

**@callback:nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId).sort** · [src/App.tsx:504](../../../src/App.tsx#L504)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8033fcf9efcd

**@callback:siblings.findIndex** · [src/App.tsx:505](../../../src/App.tsx#L505)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-16f08bd0c815

**@callback:siblings.map** · [src/App.tsx:508](../../../src/App.tsx#L508)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dccfa2b933f9

**@callback:nodes.filter** · [src/App.tsx:512](../../../src/App.tsx#L512)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-771651c46f89

**@callback:nodes.filter(item => item.subjectId === node.subjectId && item.parentId === node.parentId).sort** · [src/App.tsx:512](../../../src/App.tsx#L512)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-20ef1db7e85b

**@callback:siblings.findIndex** · [src/App.tsx:513](../../../src/App.tsx#L513)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a56975c302b9

**@callback:navItems.map** · [src/App.tsx:536](../../../src/App.tsx#L536)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-01b03a4fe920

**run** · [src/App.tsx:539](../../../src/App.tsx#L539)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 539행 | 별도 조건식 없음 | go(item.href)<br>navigation |

## H-9ddb63d4e067

**run** · [src/App.tsx:545](../../../src/App.tsx#L545)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 545행 | 별도 조건식 없음 | go(`/record/${commandTopic}`)<br>navigation |

## H-f1425dc8f839

**@callback:(['memo', 'math', 'code', 'record'] as const).map** · [src/App.tsx:547](../../../src/App.tsx#L547)

분기 조건과 가능한 갈림길:

- B-0a1092df234b · ConditionalExpression · deskMaterial → truthy / falsy; 바깥 조건: 별도 조건식 없음 (550행).

## H-be2e44737518

**run** · [src/App.tsx:551](../../../src/App.tsx#L551)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 551행 | 별도 조건식 없음 | studyWorkspace.openTool(tool)<br>call |

## H-5e129c16c4f2

**run** · [src/App.tsx:560](../../../src/App.tsx#L560)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 560행 | 별도 조건식 없음 | go(observatory.studySource?.route ?? observatory.caller?.route ?? '/')<br>navigation |

## H-e75b2b003988

**tree** · [src/App.tsx:592](../../../src/App.tsx#L592)

분기 조건과 가능한 갈림길:

- B-0c2ac856d120 · ConditionalExpression · nodes.some(n => n.subjectId === subject?.id && n.parentId === parentId) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (592행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 592행 | 별도 조건식 없음 | nodes.some(n => n.subjectId === subject?.id && n.parentId === parentId)<br>call<br>전달 콜백: H-a9b72ddb33fc |

## H-a9b72ddb33fc

**@callback:nodes.some** · [src/App.tsx:592](../../../src/App.tsx#L592)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0f647248b0d1

**@callback:navItems.map** · [src/App.tsx:598](../../../src/App.tsx#L598)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 598행 | falsy: route === item.href \|\| item.href === "/record" && recordRoute \|\| item.href === "/memos" && memoRoute \|\| item.href === "/materials" && materialRoute \|\| item.href === "/code" && codeRoute \|\| item.href === "/practice" && practiceRoute \|\| item.href === "/memory-test" && memoryTestRoute ∧ truthy: item.href === "/subjects" | Boolean(subject)<br>call |

## H-00b313ab8edf

**@onChange** · [src/App.tsx:611](../../../src/App.tsx#L611)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 611행 | 별도 조건식 없음 | setTheme(e.target.value)<br>state-update |

## H-93c88eb777ae

**@onChange** · [src/App.tsx:626](../../../src/App.tsx#L626)

분기 조건과 가능한 갈림길:

- B-13982e24741b · IfStatement · subject → truthy / falsy; 바깥 조건: 별도 조건식 없음 (628행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 627행 | 별도 조건식 없음 | setScope(e.target.value)<br>state-update |
| 628행 | truthy: subject | go("/subjects")<br>navigation |

## H-4aa1f6b218a5

**@callback:active(data.semesters).map** · [src/App.tsx:632](../../../src/App.tsx#L632)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a836eb988662

**@onClick** · [src/App.tsx:640](../../../src/App.tsx#L640)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 640행 | 별도 조건식 없음 | openDialog("semester")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-c172811efe15

**@onChange** · [src/App.tsx:655](../../../src/App.tsx#L655)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 655행 | 별도 조건식 없음 | setTheme(e.target.value)<br>state-update |

## H-0df9f9a86e4d

**@callback:shownSubjects.map** · [src/App.tsx:664](../../../src/App.tsx#L664)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a3e902036dbe

**@callback:topicPath(node.id).map** · [src/App.tsx:682](../../../src/App.tsx#L682)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8408ce21501c

**@onClick** · [src/App.tsx:693](../../../src/App.tsx#L693)

분기 조건과 가능한 갈림길:

- B-fc16a6c0ab3c · IfStatement · !remaining.length → truthy / falsy; 바깥 조건: truthy: cleanupKeys.length > 0 (700행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 694행 | truthy: cleanupKeys.length > 0 | cleanupKeys.filter(key => { // A later edit replaces the empty committed marker; never clear that new input. if (readRescuedDraft(key) !== "") return false; try { clearStoredDraft(key); return false; } catch { return true; } })<br>call<br>전달 콜백: H-7f20fbff8449 |
| 699행 | truthy: cleanupKeys.length > 0 | setCleanupKeys(remaining)<br>state-update |
| 700행 | truthy: cleanupKeys.length > 0 ∧ truthy: !remaining.length | setError("")<br>state-update |
| 700행 | truthy: cleanupKeys.length > 0 ∧ truthy: !remaining.length | setNotice({ message: "저장된 내용은 유지하고 이전 초안만 정리했습니다." })<br>state-update |

## H-7f20fbff8449

**@callback:cleanupKeys.filter** · [src/App.tsx:694](../../../src/App.tsx#L694)

분기 조건과 가능한 갈림길:

- B-13e956b3315f · IfStatement · readRescuedDraft(key) !== "" → truthy / falsy; 바깥 조건: truthy: cleanupKeys.length > 0 (696행).
- B-3c3ca8beae5a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: cleanupKeys.length > 0 (697행).
- B-a257436d4bdf · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: cleanupKeys.length > 0 (697행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 696행 | truthy: cleanupKeys.length > 0 | readRescuedDraft(key)<br>preservation-boundary |
| 697행 | truthy: cleanupKeys.length > 0 | clearStoredDraft(key)<br>preservation-boundary |

반환/조기 중단: 696행 false [truthy: cleanupKeys.length > 0 ∧ truthy: readRescuedDraft(key) !== ""]; 697행 false [truthy: cleanupKeys.length > 0]; 697행 true [truthy: cleanupKeys.length > 0 ∧ exception: exception]

## H-0a52d7bf47ce

**@onClick** · [src/App.tsx:707](../../../src/App.tsx#L707)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 709행 | truthy: notice && (!notice.undo \|\| recordRoute) ∧ truthy: notice.undo | setNotice(null)<br>state-update |

## H-c822ee80ecbc

**@onClick** · [src/App.tsx:719](../../../src/App.tsx#L719)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 719행 | truthy: notice && (!notice.undo \|\| recordRoute) | setNotice(null)<br>state-update |

## H-b88de54647ca

**@onClick** · [src/App.tsx:737](../../../src/App.tsx#L737)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 737행 | truthy: subject && !node | openDialog("node")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-c2c4f11731a8

**@onClick** · [src/App.tsx:737](../../../src/App.tsx#L737)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 737행 | truthy: subject && !node | openDialog("bulk")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-181ca0feee72

**@callback:shownSubjects.map** · [src/App.tsx:744](../../../src/App.tsx#L744)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3efa72acce96

**@callback:shownSubjects.map** · [src/App.tsx:745](../../../src/App.tsx#L745)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-48602055096b

**@callback:records.some** · [src/App.tsx:748](../../../src/App.tsx#L748)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 748행 | truthy: route === "/" | shownSubjects.some(subject => subject.id === record.subjectId)<br>call<br>전달 콜백: H-c8736ed17eeb |

## H-c8736ed17eeb

**@callback:shownSubjects.some** · [src/App.tsx:748](../../../src/App.tsx#L748)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-52892756fea0

**@callback:records.filter** · [src/App.tsx:750](../../../src/App.tsx#L750)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | shownSubjects.some(subject => subject.id === record.subjectId)<br>call<br>전달 콜백: H-9cb2647ef54d |

## H-9cb2647ef54d

**@callback:shownSubjects.some** · [src/App.tsx:750](../../../src/App.tsx#L750)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-219165564c22

**@callback:records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort** · [src/App.tsx:750](../../../src/App.tsx#L750)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 750행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | b.createdAt.localeCompare(a.createdAt)<br>call |

## H-0d9ad7e36d19

**@callback:records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3).map** · [src/App.tsx:750](../../../src/App.tsx#L750)

분기 조건과 가능한 갈림길:

- B-554eda31ca93 · ConditionalExpression · record.dateEvidence.kind === 'exact' → truthy / falsy; 바깥 조건: truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) (752행).
- B-c50dbb3ce60b · ConditionalExpression · record.dateEvidence.kind === 'range' → truthy / falsy; 바깥 조건: truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) ∧ falsy: record.dateEvidence.kind === 'exact' (752행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 751행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | encodeURIComponent(record.targetId)<br>call |
| 751행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | nodes.find(node => node.id === record.targetId)<br>call<br>전달 콜백: H-0bc41f1851f1 |
| 751행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) ∧ nullish: nodes.find(node => node.id === record.targetId)?.name | subjects.find(subject => subject.id === record.targetId)<br>call<br>전달 콜백: H-11437db8b75e |
| 752행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | subjects.find(subject => subject.id === record.subjectId)<br>call<br>전달 콜백: H-3416f5d83c5b |
| 754행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | encodeURIComponent(record.targetId)<br>call |
| 754행 | truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId)) | encodeURIComponent(record.targetId)<br>call |

## H-0bc41f1851f1

**@callback:nodes.find** · [src/App.tsx:751](../../../src/App.tsx#L751)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-11437db8b75e

**@callback:subjects.find** · [src/App.tsx:751](../../../src/App.tsx#L751)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3416f5d83c5b

**@callback:subjects.find** · [src/App.tsx:752](../../../src/App.tsx#L752)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4698aef785f2

**@callback:shownSubjects.map** · [src/App.tsx:759](../../../src/App.tsx#L759)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b2ba77a57014

**@callback:shownSubjects.map** · [src/App.tsx:760](../../../src/App.tsx#L760)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8e66357d419e

**@callback:(recentTopics.length
                      ? recentTopics
                      : topics.slice(0, 3)
                    ).map** · [src/App.tsx:775](../../../src/App.tsx#L775)

분기 조건과 가능한 갈림길:

- B-dbde94889b83 · ConditionalExpression · quickGuard.current.has(t.id) → truthy / falsy; 바깥 조건: truthy: route === "/" (798행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 779행 | truthy: route === "/" | subjects.find((s) => s.id === t.subjectId)<br>call<br>전달 콜백: H-e66e04998c6a |
| 784행 | truthy: route === "/" | latestWrittenRecords.has(t.id)<br>call |
| 785행 | truthy: route === "/" ∧ truthy: latestWrittenRecords.has(t.id) | encodeURIComponent(t.id)<br>call |
| 787행 | truthy: route === "/" ∧ truthy: latestWrittenRecords.has(t.id) | latestWrittenRecords.get(t.id)!.body.trim().replace(/\s+/g, " ")<br>call |
| 787행 | truthy: route === "/" ∧ truthy: latestWrittenRecords.has(t.id) | latestWrittenRecords.get(t.id)!.body.trim()<br>call |
| 787행 | truthy: route === "/" ∧ truthy: latestWrittenRecords.has(t.id) | latestWrittenRecords.get(t.id)<br>call |
| 798행 | truthy: route === "/" | quickGuard.current.has(t.id)<br>call |

## H-e66e04998c6a

**@callback:subjects.find** · [src/App.tsx:779](../../../src/App.tsx#L779)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9502c3d3ee65

**@onClick** · [src/App.tsx:792](../../../src/App.tsx#L792)

분기 조건과 가능한 갈림길:

- B-c6240d089e8e · ConditionalExpression · quickGuard.current.has(t.id) → truthy / falsy; 바깥 조건: truthy: route === "/" (793행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 793행 | truthy: route === "/" | quickGuard.current.has(t.id)<br>call |
| 794행 | truthy: route === "/" ∧ truthy: quickGuard.current.has(t.id) | go(`/record/${t.id}`)<br>navigation |
| 795행 | truthy: route === "/" ∧ falsy: quickGuard.current.has(t.id) | quickRecord(t)<br>call → [H-d0729251aab3](App.md#h-d0729251aab3) |

## H-f97023a79b4b

**@callback:records
                            .filter** · [src/App.tsx:812](../../../src/App.tsx#L812)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 814행 | truthy: route === "/" ∧ falsy: r.done | Object.values(r.trace).some((t) => t.status === "checked" \|\| (t.repeats?.length \|\| 0) > 0)<br>call<br>전달 콜백: H-1100e879107e |
| 814행 | truthy: route === "/" ∧ falsy: r.done | Object.values(r.trace)<br>call |
| 819행 | truthy: route === "/" ∧ truthy: r.done \|\|<br>                                  Object.values(r.trace).some(<br>                                    (t) =><br>                                      t.status === "checked" \|\|<br>                                      (t.repeats?.length \|\| 0) > 0,<br>                                  ) | shownSubjects.some((subject) => subject.id === r.subjectId)<br>call<br>전달 콜백: H-6339fadc3337 |

## H-1100e879107e

**@callback:Object.values(r.trace).some** · [src/App.tsx:815](../../../src/App.tsx#L815)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6339fadc3337

**@callback:shownSubjects.some** · [src/App.tsx:820](../../../src/App.tsx#L820)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bbabf92f939b

**@callback:records
                            .filter(
                              (r) =>
                                (r.done ||
                                  Object.values(r.trace).some(
                                    (t) =>
                                      t.status === "checked" ||
                                      (t.repeats?.length || 0) > 0,
                                  )) &&
                                shownSubjects.some(
                                  (subject) => subject.id === r.subjectId,
                                ),
                            )
                            .map** · [src/App.tsx:823](../../../src/App.tsx#L823)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a27e13b549db

**@callback:topics.filter** · [src/App.tsx:838](../../../src/App.tsx#L838)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 838행 | truthy: route === "/" | records.some((r) => r.targetId === t.id)<br>call<br>전달 콜백: H-62c7383ab3e8 |

## H-62c7383ab3e8

**@callback:records.some** · [src/App.tsx:838](../../../src/App.tsx#L838)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-91a4fbc233f8

**@onClick** · [src/App.tsx:851](../../../src/App.tsx#L851)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 851행 | truthy: route === "/subjects" | openDialog("subject")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-2316e82bff82

**@onApply** · [src/App.tsx:856](../../../src/App.tsx#L856)

분기 조건과 가능한 갈림길:

- B-bf03d507d52b · IfStatement · result → truthy / falsy; 바깥 조건: truthy: route === "/subjects" (859행).
- B-20ea33d3d076 · ConditionalExpression · revision → truthy / falsy; 바깥 조건: truthy: route === "/subjects" ∧ truthy: result (859행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 857행 | truthy: route === "/subjects" | commit(command, undefined, { opId: command.opId, at: command.at })<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 859행 | truthy: route === "/subjects" ∧ truthy: result | setNotice({ message: "표의 과목과 목차를 저장했습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "표에서 생성한 항목을 되돌렸습니다."); } : undefined })<br>state-update |

반환/조기 중단: 860행 result [truthy: route === "/subjects"]

## H-46c4c6b46b53

**@onUndo** · [src/App.tsx:862](../../../src/App.tsx#L862)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 862행 | truthy: route === "/subjects" | commit({ type: "undoRevision", revisionId, expectedVersion }, "표에서 생성한 항목을 되돌렸습니다.")<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |

## H-7b98ecc144e7

**@callback:shownSubjects.map** · [src/App.tsx:866](../../../src/App.tsx#L866)

분기 조건과 가능한 갈림길:

- B-e52cdd924a18 · ConditionalExpression · s.scope.kind === "semester" → truthy / falsy; 바깥 조건: truthy: route === "/subjects" (869행).
- B-767e9140afe7 · ConditionalExpression · s.scope.kind === "independent" → truthy / falsy; 바깥 조건: truthy: route === "/subjects" ∧ falsy: s.scope.kind === "semester" (875행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 870행 | truthy: route === "/subjects" ∧ truthy: s.scope.kind === "semester" | data.semesters.find((x) => s.scope.kind === "semester" && x.id === s.scope.semesterId)<br>call<br>전달 콜백: H-e53db214023b |
| 884행 | truthy: route === "/subjects" | nodes.filter((n) => n.subjectId === s.id && n.role === "topic")<br>call<br>전달 콜백: H-ce1ab6983722 |

## H-e53db214023b

**@callback:data.semesters.find** · [src/App.tsx:871](../../../src/App.tsx#L871)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ce1ab6983722

**@callback:nodes.filter** · [src/App.tsx:885](../../../src/App.tsx#L885)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-785ff4f68a6b

**@onClick** · [src/App.tsx:930](../../../src/App.tsx#L930)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 930행 | truthy: node | go(`/record/${node.id}`)<br>navigation |

## H-e661483506e7

**onSelect** · [src/App.tsx:935](../../../src/App.tsx#L935)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 935행 | truthy: node | openDialog("node")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-267a2e90a58a

**onSelect** · [src/App.tsx:936](../../../src/App.tsx#L936)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 936행 | truthy: node | openDialog("bulk")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-3a3290942bcd

**onSelect** · [src/App.tsx:937](../../../src/App.tsx#L937)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 937행 | truthy: node | openDialog("rename")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-cfde7341970e

**onSelect** · [src/App.tsx:938](../../../src/App.tsx#L938)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 938행 | truthy: node | openDialog("move")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-ff9d3ee85f2c

**onSelect** · [src/App.tsx:939](../../../src/App.tsx#L939)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 939행 | truthy: node | openDialog("trash")<br>call → [H-132c9e1c9845](App.md#h-132c9e1c9845) |

## H-9749951ded58

**@onClick** · [src/App.tsx:944](../../../src/App.tsx#L944)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 944행 | truthy: node ∧ truthy: node.role === 'topic' | go(`/memory-test/${encodeURIComponent(node.id)}`)<br>navigation |
| 944행 | truthy: node ∧ truthy: node.role === 'topic' | encodeURIComponent(node.id)<br>call |

## H-f01cf76b1970

**@onClick** · [src/App.tsx:945](../../../src/App.tsx#L945)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 945행 | truthy: node ∧ truthy: node.role === 'topic' | go(`/practice/${encodeURIComponent(node.id)}`)<br>navigation |
| 945행 | truthy: node ∧ truthy: node.role === 'topic' | encodeURIComponent(node.id)<br>call |

## H-5395926aa1ca

**@onClick** · [src/App.tsx:946](../../../src/App.tsx#L946)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 946행 | truthy: node | reorderNode(-1)<br>call → [H-69f3f5e70db3](App.md#h-69f3f5e70db3) |

## H-558dbeda6db1

**@onClick** · [src/App.tsx:947](../../../src/App.tsx#L947)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 947행 | truthy: node | reorderNode(1)<br>call → [H-69f3f5e70db3](App.md#h-69f3f5e70db3) |

## H-8eb9e976c3db

**@onApply** · [src/App.tsx:951](../../../src/App.tsx#L951)

분기 조건과 가능한 갈림길:

- B-148a57adac2c · IfStatement · revision → truthy / falsy; 바깥 조건: truthy: node (954행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 952행 | truthy: node | commit({type: "adjustCriteria", ...change})<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 954행 | truthy: node ∧ truthy: revision | setNotice({ message: "공부 기준을 조정했습니다.", undo: () => { commit({type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version}, "기준 변경을 되돌렸습니다."); } })<br>state-update |

반환/조기 중단: 955행 result [truthy: node]

## H-75b6780054ac

**@onUndo** · [src/App.tsx:957](../../../src/App.tsx#L957)

분기 조건과 가능한 갈림길:

- B-4d4e24993286 · IfStatement · result → truthy / falsy; 바깥 조건: truthy: node (959행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 958행 | truthy: node | commit({type: "undoRevision", revisionId, expectedVersion})<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |
| 959행 | truthy: node ∧ truthy: result | setNotice({ message: "기준 변경을 되돌렸습니다." })<br>state-update |

반환/조기 중단: 960행 result [truthy: node]

## H-67cb2bb1fe48

**@callback:records.filter** · [src/App.tsx:974](../../../src/App.tsx#L974)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8e25f6c4ec54

**@callback:records.filter** · [src/App.tsx:978](../../../src/App.tsx#L978)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b461f0d33ee9

**@callback:shownSubjects.map** · [src/App.tsx:1012](../../../src/App.tsx#L1012)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-34f648975b99

**@onSaved** · [src/App.tsx:1015](../../../src/App.tsx#L1015)

분기 조건과 가능한 갈림길:

- B-666d0dbae3d5 · IfStatement · cleanupKey → truthy / falsy; 바깥 조건: truthy: recordRoute (1016행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1016행 | truthy: recordRoute ∧ truthy: cleanupKey | setCleanupKeys(keys => [...new Set([...keys, cleanupKey])])<br>state-update<br>전달 콜백: H-72811ba40961 |
| 1016행 | truthy: recordRoute ∧ truthy: cleanupKey | setError(warning \|\| "초안 정리를 다시 시도해 주세요.")<br>state-update |
| 1017행 | truthy: recordRoute | setNotice({ message: warning \|\| "공부 기록을 저장했습니다." })<br>state-update |
| 1018행 | truthy: recordRoute | go(observatory.studySource?.route ?? observatory.caller?.route ?? "/")<br>navigation |

## H-72811ba40961

**@callback:setCleanupKeys** · [src/App.tsx:1016](../../../src/App.tsx#L1016)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-074f9aeef79f

**@onCleanupFailure** · [src/App.tsx:1022](../../../src/App.tsx#L1022)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1023행 | truthy: freeRoute | setCleanupKeys(keys => [...new Set([...keys, key])])<br>state-update<br>전달 콜백: H-33b6c69f867b |
| 1024행 | truthy: freeRoute | setError("자유 기록은 저장했습니다. 이전 초안 정리가 남았습니다. 창을 닫기 전에 다시 시도해 주세요.")<br>state-update |

## H-33b6c69f867b

**@callback:setCleanupKeys** · [src/App.tsx:1023](../../../src/App.tsx#L1023)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7c80d2fe7d50

**@callback:shownSubjects.map** · [src/App.tsx:1027](../../../src/App.tsx#L1027)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1c465b53bebf

**@callback:shownSubjects.map** · [src/App.tsx:1028](../../../src/App.tsx#L1028)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-94197ddab9b9

**@callback:shownSubjects.map** · [src/App.tsx:1029](../../../src/App.tsx#L1029)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-65920b0d1ae4

**@onSaved** · [src/App.tsx:1031](../../../src/App.tsx#L1031)

분기 조건과 가능한 갈림길:

- B-e0560b0fe371 · IfStatement · !cleanupKey → truthy / falsy; 바깥 조건: truthy: route === "/canvas" (1031행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1031행 | truthy: route === "/canvas" ∧ truthy: !cleanupKey | finishEditing()<br>call |

## H-f76d3c9511e6

**@callback:shownSubjects.map** · [src/App.tsx:1033](../../../src/App.tsx#L1033)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4af84e67372d

**@onCloseDetail** · [src/App.tsx:1034](../../../src/App.tsx#L1034)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1034행 | truthy: memoRoute | returnFromObservatory(observatory.caller, "/memos")<br>call → [H-0985fc875894](ui__observatory-navigation.md#h-0985fc875894) |

## H-30fdb7524fb7

**@callback:shownSubjects.map** · [src/App.tsx:1046](../../../src/App.tsx#L1046)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d3c77fe8f7f2

**@onOpenExample** · [src/App.tsx:1069](../../../src/App.tsx#L1069)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1069행 | truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ truthy: tool === 'code' | studyWorkspace.setLayout({ ...studyWorkspace.layout, codeExampleId: id })<br>call |

## H-d7e1ee7ea845

**@onSaved** · [src/App.tsx:1076](../../../src/App.tsx#L1076)

분기 조건과 가능한 갈림길:

- B-6c7e6e6b9881 · IfStatement · cleanupKey → truthy / falsy; 바깥 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code' (1077행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1078행 | truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code' ∧ truthy: cleanupKey | setCleanupKeys((previous) => previous.includes(cleanupKey) ? previous : [...previous, cleanupKey])<br>state-update<br>전달 콜백: H-00716cbd6b76 |
| 1081행 | truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code' | setNotice({ message: warning \|\| '공부 기록을 저장했습니다.' })<br>state-update |

## H-00716cbd6b76

**@callback:setCleanupKeys** · [src/App.tsx:1078](../../../src/App.tsx#L1078)

분기 조건과 가능한 갈림길:

- B-320dd182ed4a · ConditionalExpression · previous.includes(cleanupKey) → truthy / falsy; 바깥 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code' ∧ truthy: cleanupKey (1079행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1079행 | truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code' ∧ truthy: cleanupKey | previous.includes(cleanupKey)<br>call |

## H-9112da4cf36f

**@callback:shownSubjects.map** · [src/App.tsx:1091](../../../src/App.tsx#L1091)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c90647a79fde

**@callback:shownSubjects.map** · [src/App.tsx:1092](../../../src/App.tsx#L1092)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fbb9fa4c0e4e

**@callback:shownSubjects.map** · [src/App.tsx:1093](../../../src/App.tsx#L1093)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-72fbabc96231

**@callback:shownSubjects.map** · [src/App.tsx:1094](../../../src/App.tsx#L1094)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8b5622e71f01

**@onAllScopes** · [src/App.tsx:1094](../../../src/App.tsx#L1094)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1094행 | truthy: route === "/search" | setScope("all")<br>state-update |

## H-808e88ff3a1f

**@callback:data.nodes.some** · [src/App.tsx:1101](../../../src/App.tsx#L1101)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cbb62950764e

**@callback:(data.memos ?? []).some** · [src/App.tsx:1101](../../../src/App.tsx#L1101)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-84ddd56f3dd1

**@callback:data.nodes
                .filter** · [src/App.tsx:1106](../../../src/App.tsx#L1106)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1108행 | truthy: route === "/trash" ∧ truthy: n.deletedAt | data.nodes.find((parent) => parent.id === n.parentId)<br>call<br>전달 콜백: H-3b61f62f961c |

## H-3b61f62f961c

**@callback:data.nodes.find** · [src/App.tsx:1108](../../../src/App.tsx#L1108)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5f73d9f842c8

**@callback:data.nodes
                .filter(
                  (n) =>
                    n.deletedAt &&
                    !data.nodes.find((parent) => parent.id === n.parentId)
                      ?.deletedAt,
                )
                .map** · [src/App.tsx:1111](../../../src/App.tsx#L1111)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b85441c81e82

**@onClick** · [src/App.tsx:1115](../../../src/App.tsx#L1115)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1116행 | truthy: route === "/trash" | commit({ type: "restoreNode", id: n.id, expectedVersion: n.version, }, "목차를 복원했습니다.")<br>mutation-request → [H-f91d9cc5d28f](App.md#h-f91d9cc5d28f) |

## H-fe1b7409097c

**@onClick** · [src/App.tsx:1149](../../../src/App.tsx#L1149)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1149행 | truthy: !["/", "/subjects", "/concepts", "/search", "/trash", "/free", "/draft-archives", "/material-cards", "/recall", "/recall/scheduled", "/canvas", "/graph", "/board", "/statistics", "/math", "/backup", "/about", "/help", "/my-progress", "/subscription"].includes(route) &&<br>            !recordRoute &&<br>            !memoRoute &&<br>            !materialRoute &&<br>            !codeRoute &&<br>            !practiceRoute &&<br>            !memoryTestRoute &&<br>            route !== "/schedules" &&<br>            !freeRoute &&<br>            !subject | go("/subjects")<br>navigation |

## H-1f72ac983e3d

**@callback:navItems.map** · [src/App.tsx:1157](../../../src/App.tsx#L1157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1157행 | falsy: route === item.href \|\| item.href === "/record" && recordRoute \|\| item.href === "/memos" && memoRoute \|\| item.href === "/materials" && materialRoute \|\| item.href === "/code" && codeRoute \|\| item.href === "/practice" && practiceRoute \|\| item.href === "/memory-test" && memoryTestRoute ∧ truthy: item.href === "/subjects" | Boolean(subject)<br>call |

## H-0238be348c55

**@onClose** · [src/App.tsx:1174](../../../src/App.tsx#L1174)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1174행 | truthy: Boolean(dialog) | setDialog(null)<br>state-update |

## H-1558c67bd2bf

**@onChange** · [src/App.tsx:1181](../../../src/App.tsx#L1181)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1181행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | setMoveParent(e.target.value)<br>state-update |
| 1181행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | persistModal({ moveParent: e.target.value })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |

## H-c57f69799139

**@callback:nodes.filter** · [src/App.tsx:1183](../../../src/App.tsx#L1183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node ∧ truthy: candidate.subjectId === node.subjectId && candidate.id !== node.id | descendants(node.id).some(child => child.id === candidate.id)<br>call<br>전달 콜백: H-cd3aa3b6ca49 |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node ∧ truthy: candidate.subjectId === node.subjectId && candidate.id !== node.id | descendants(node.id)<br>call → [H-fd82bc4adb00](App.md#h-fd82bc4adb00) |

## H-cd3aa3b6ca49

**@callback:descendants(node.id).some** · [src/App.tsx:1183](../../../src/App.tsx#L1183)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4ab4e9332975

**@callback:nodes.filter(candidate => candidate.subjectId === node.subjectId && candidate.id !== node.id && !descendants(node.id).some(child => child.id === candidate.id)).map** · [src/App.tsx:1183](../../../src/App.tsx#L1183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | topicPath(candidate.id).map(parent => parent.name).join(" / ")<br>call |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | topicPath(candidate.id).map(parent => parent.name)<br>call<br>전달 콜백: H-984aef380c9c |
| 1183행 | truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node | topicPath(candidate.id)<br>call → [H-c594f5bfb70f](App.md#h-c594f5bfb70f) |

## H-984aef380c9c

**@callback:topicPath(candidate.id).map** · [src/App.tsx:1183](../../../src/App.tsx#L1183)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4fb892861f8c

**@onKeyDown** · [src/App.tsx:1200](../../../src/App.tsx#L1200)

분기 조건과 가능한 갈림길:

- B-af88f2e0500c · IfStatement · event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229) → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node (1201행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1201행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: event.key === "Enter" && (event.nativeEvent.isComposing \|\| event.keyCode === 229) | event.preventDefault()<br>input-control |

## H-651c9d73cb23

**@onSubmit** · [src/App.tsx:1203](../../../src/App.tsx#L1203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1204행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node | e.preventDefault()<br>input-control |
| 1205행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node | addItem()<br>call → [H-a447162cf962](App.md#h-a447162cf962) |

## H-bc348f83e2cb

**@callback:bulkNames.map** · [src/App.tsx:1212](../../../src/App.tsx#L1212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2ffd0ecd09c4

**@onKeyDown** · [src/App.tsx:1213](../../../src/App.tsx#L1213)

분기 조건과 가능한 갈림길:

- B-59b77ba9992e · IfStatement · event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229 → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" (1214행).
- B-fe857efee999 · IfStatement · index === bulkNames.length - 1 && bulkNames.length < 500 → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" (1216행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1215행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | event.preventDefault()<br>input-control |
| 1217행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: index === bulkNames.length - 1 && bulkNames.length < 500 | setBulkNames(next)<br>state-update |
| 1217행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: index === bulkNames.length - 1 && bulkNames.length < 500 | setBulkPreview(false)<br>state-update |
| 1217행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: index === bulkNames.length - 1 && bulkNames.length < 500 | persistModal({ bulkNames: next })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |
| 1219행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | requestAnimationFrame(() => document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach(input => { if (input.dataset.editingContext === `${modalKey}:row:${index + 1}`) input.focus(); }))<br>call<br>전달 콜백: H-aa6069a85087 |

반환/조기 중단: 1214행 <render> [truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229]

## H-aa6069a85087

**@callback:requestAnimationFrame** · [src/App.tsx:1219](../../../src/App.tsx#L1219)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1219행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach(input => { if (input.dataset.editingContext === `${modalKey}:row:${index + 1}`) input.focus(); })<br>call<br>전달 콜백: H-2b31824d485b |
| 1219행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | document.querySelectorAll('[data-editing-context]')<br>call |

## H-2b31824d485b

**@callback:document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach** · [src/App.tsx:1219](../../../src/App.tsx#L1219)

분기 조건과 가능한 갈림길:

- B-d091c3adcefe · IfStatement · input.dataset.editingContext === `${modalKey}:row:${index + 1}` → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" (1220행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1220행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: input.dataset.editingContext === `${modalKey}:row:${index + 1}` | input.focus()<br>input-control |

## H-a04ab42e0e68

**@onChange** · [src/App.tsx:1223](../../../src/App.tsx#L1223)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1224행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | bulkNames.map((name, row) => row === index ? event.target.value : name)<br>call<br>전달 콜백: H-11eb39a38f79 |
| 1225행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | setBulkNames(next)<br>state-update |
| 1225행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | setBulkPreview(false)<br>state-update |
| 1225행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | persistModal({ bulkNames: next })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |

## H-11eb39a38f79

**@callback:bulkNames.map** · [src/App.tsx:1224](../../../src/App.tsx#L1224)

분기 조건과 가능한 갈림길:

- B-eda3dfd11fde · ConditionalExpression · row === index → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" (1224행).

## H-5c25cda61b72

**@onClick** · [src/App.tsx:1227](../../../src/App.tsx#L1227)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1227행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | setBulkNames(next)<br>state-update |
| 1227행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | setBulkPreview(false)<br>state-update |
| 1227행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | persistModal({ bulkNames: next })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |

## H-751900e010a8

**@onChange** · [src/App.tsx:1232](../../../src/App.tsx#L1232)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1232행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ falsy: dialog === "bulk" | setName(e.target.value)<br>state-update |
| 1232행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ falsy: dialog === "bulk" | persistModal({ name: e.target.value })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |

## H-4b22624fa9ce

**@onChange** · [src/App.tsx:1239](../../../src/App.tsx#L1239)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1240행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "node" \|\| dialog === "bulk" | setRole(e.target.value as OutlineNode["role"])<br>state-update |
| 1240행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "node" \|\| dialog === "bulk" | setBulkPreview(false)<br>state-update |
| 1240행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "node" \|\| dialog === "bulk" | persistModal({ role: e.target.value })<br>call → [H-870edca10b40](App.md#h-870edca10b40) |

## H-51ed8060c820

**@callback:bulkNames.some** · [src/App.tsx:1255](../../../src/App.tsx#L1255)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1255행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | value.trim()<br>call |

## H-9b9110600d43

**@onClick** · [src/App.tsx:1255](../../../src/App.tsx#L1255)

분기 조건과 가능한 갈림길:

- B-fa4de2b50f8c · IfStatement · subject → truthy / falsy; 바깥 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" (1255행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1255행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: subject | setOutlineToken(outlineRevisionToken(data, subject.id, node?.id \|\| null))<br>state-update |
| 1255행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: subject | outlineRevisionToken(data, subject.id, node?.id \|\| null)<br>call |
| 1255행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" | setBulkPreview(true)<br>state-update |

## H-e9ed851591a1

**@callback:previewOutlineEntries(bulkNames).entries.map** · [src/App.tsx:1256](../../../src/App.tsx#L1256)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-75f1dcfacc59

**@callback:previewOutlineEntries(bulkNames).issues.map** · [src/App.tsx:1257](../../../src/App.tsx#L1257)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c7bd1cc6a939

**@onChange** · [src/App.tsx:1259](../../../src/App.tsx#L1259)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1259행 | truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview ∧ truthy: bulkExisting.length > 0 | setDuplicateChoice(event.target.value as typeof duplicateChoice)<br>state-update |

## H-1fc5c1524a19

**@callback:bulkExisting.map** · [src/App.tsx:1262](../../../src/App.tsx#L1262)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-98e1466090ed

**@onClose** · [src/App.tsx:1287](../../../src/App.tsx#L1287)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1287행 | truthy: notice?.undo && !recordRoute | setNotice(null)<br>state-update |

## H-5a1b8bd8ef05

**useTextDraft** · [src/App.tsx:1295](../../../src/App.tsx#L1295)

분기 조건과 가능한 갈림길:

- B-975899aad471 · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: falsy: boot.error (1325행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1296행 | 별도 조건식 없음 | useState(() => { try { const raw = readRescuedDraft(key) ?? localStorage.getItem(key); if (!raw) return { body: initial, version, error: "", entityId: identity?.entityId }; const draft = JSON.parse(raw); if ( typeof draft.body !== "string" \|\| !Number.isSafeInteger(draft.version) \|\| (draft.entityId !== undefined && (typeof draft.entityId !== "string" \|\| !draft.entityId.trim())) \|\| (identity && !identity.restoreIdentity && draft.entityId !== undefined && draft.entityId !== identity.entityId) ) throw Error(); return { ...draft, entityId: draft.entityId \|\| identity?.entityId, error: draftReadError(key) } as { body: string; version: number; error: string; entityId?: string; }; } catch { rememberDraftReadE … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-bda3dfdfc0e1 |
| 1324행 | 별도 조건식 없음 | useState(boot.body)<br>call |
| 1325행 | 별도 조건식 없음 | useState(boot.error \|\| (draftHasUnstoredText(key) ? "저장 실패한 입력을 이 창에서 유지하고 있습니다. 다시 저장하거나 복사해 주세요." : ""))<br>call |
| 1325행 | falsy: boot.error | draftHasUnstoredText(key)<br>preservation-boundary |
| 1326행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 1326행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 1327행 | 별도 조건식 없음 | useState(false)<br>call |
| 1328행 | 별도 조건식 없음 | useRef(boot.version)<br>call |
| 1331행 | 별도 조건식 없음 | useRef(boot.body !== initial \|\| boot.version !== version \|\| Boolean(boot.error) \|\| draftHasUnstoredText(key))<br>call |
| 1331행 | falsy: boot.body !== initial \|\| boot.version !== version | Boolean(boot.error)<br>call |
| 1331행 | falsy: boot.body !== initial \|\| boot.version !== version \|\| Boolean(boot.error) | draftHasUnstoredText(key)<br>preservation-boundary |
| 1332행 | 별도 조건식 없음 | useEffect(() => { if (dirty.current \|\| blocked \|\| cleanupPending \|\| error \|\| version < expected.current) return; expected.current = version; setBody(initial); }, [initial, version, blocked, cleanupPending, error])<br>call<br>전달 콜백: H-ecd172900d2c |

반환/조기 중단: 1375행 { body, change, error, blocked, expected, clear, retry, cleanupPending, entityId: boot.entityId } [별도 조건식 없음]

## H-bda3dfdfc0e1

**@callback:useState** · [src/App.tsx:1296](../../../src/App.tsx#L1296)

분기 조건과 가능한 갈림길:

- B-d97f15203bf4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1297행).
- B-e02e0683c2e5 · IfStatement · !raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1299행).
- B-0a508074fecf · IfStatement · typeof draft.body !== "string" || !Number.isSafeInteger(draft.version) || (draft.entityId !== undefined && (typeof draft.entityId !== "string" || !draft.entityId.trim())) || (identity && !identity.restoreIdentity && draft.entityId !== undefined && draft.entityId !== identity.entityId) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1301행).
- B-625ccb2961ff · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1314행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1298행 | 별도 조건식 없음 | readRescuedDraft(key)<br>preservation-boundary |
| 1298행 | nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |
| 1300행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |
| 1303행 | falsy: typeof draft.body !== "string" | Number.isSafeInteger(draft.version)<br>call |
| 1304행 | falsy: typeof draft.body !== "string" \|\|<br>        !Number.isSafeInteger(draft.version) ∧ truthy: draft.entityId !== undefined ∧ falsy: typeof draft.entityId !== "string" | draft.entityId.trim()<br>preservation-boundary |
| 1307행 | truthy: typeof draft.body !== "string" \|\|<br>        !Number.isSafeInteger(draft.version) \|\|<br>        (draft.entityId !== undefined && (typeof draft.entityId !== "string" \|\| !draft.entityId.trim())) \|\|<br>        (identity && !identity.restoreIdentity && draft.entityId !== undefined && draft.entityId !== identity.entityId) | Error()<br>call |
| 1308행 | 별도 조건식 없음 | draftReadError(key)<br>preservation-boundary |
| 1315행 | exception: exception | rememberDraftReadError(key, "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.")<br>preservation-boundary |

반환/조기 중단: 1299행 { body: initial, version, error: "", entityId: identity?.entityId } [truthy: !raw]; 1308행 { ...draft, entityId: draft.entityId || identity?.entityId, error: draftReadError(key) } as { body: string; version: number; error: string; entityId?: string; } [별도 조건식 없음]; 1316행 { body: initial, version, error: "초안을 읽지 못했습니다. 저장된 초안을 덮어쓰지 않았습니다.", entityId: identity?.entityId, } [exception: exception]

throw: 1307행 Error()

## H-ecd172900d2c

**@callback:useEffect** · [src/App.tsx:1332](../../../src/App.tsx#L1332)

분기 조건과 가능한 갈림길:

- B-3c2cc2defc9f · IfStatement · dirty.current || blocked || cleanupPending || error || version < expected.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1333행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1335행 | 별도 조건식 없음 | setBody(initial)<br>state-update |

반환/조기 중단: 1333행 <render> [truthy: dirty.current || blocked || cleanupPending || error || version < expected.current]

## H-f1eacfb6a5cb

**NarrativeEditor** · [src/App.tsx:1377](../../../src/App.tsx#L1377)

분기 조건과 가능한 갈림길:

- B-336f33e147bf · ConditionalExpression · newNote → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1424행).
- B-ba4ccceac862 · ConditionalExpression · original?.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1487행).
- B-f9a05ac297d6 · ConditionalExpression · kind === "free-note" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1500행).
- B-509c7a38389b · ConditionalExpression · saving → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1505행).
- B-bb93c885af8b · ConditionalExpression · repository && data.namespace !== 'demo' → truthy / falsy; 바깥 조건: truthy: saving (1505행).
- B-f6a476eae29f · ConditionalExpression · saved → truthy / falsy; 바깥 조건: falsy: saving (1505행).
- B-50b8ddd6205e · ConditionalExpression · repository && data.namespace !== 'demo' → truthy / falsy; 바깥 조건: falsy: saving ∧ truthy: saved (1506행).
- B-598768556e2c · ConditionalExpression · draft.blocked → truthy / falsy; 바깥 조건: truthy: draft.error (1514행).
- B-d31884eb2b60 · ConditionalExpression · draft.cleanupPending → truthy / falsy; 바깥 조건: truthy: draft.error ∧ falsy: draft.blocked (1514행).
- B-c1ea213ad602 · ConditionalExpression · saving → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1516행).
- B-7824320faf94 · ConditionalExpression · saveError → truthy / falsy; 바깥 조건: falsy: saving (1516행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1402행 | 별도 조건식 없음 | active(data.narratives).find((n) => !newNote && (narrativeId ? n.id === narrativeId : n.kind === kind && n.ownerId === ownerId))<br>call<br>전달 콜백: H-e5029a45a92f |
| 1402행 | 별도 조건식 없음 | active(data.narratives)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 1405행 | 별도 조건식 없음 | useRef(original?.id \|\| narrativeId \|\| uid())<br>call |
| 1405행 | falsy: original?.id \|\| narrativeId | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 1406행 | falsy: draftKey | storagePrefix(data)<br>call |
| 1408행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1409행 | 별도 조건식 없음 | useState(() => { if (inline) return true; try { const saved = sessionStorage.getItem(disclosureKey); if (saved === "open" \|\| saved === "closed") return saved === "open"; } catch { /* A missing view hint must not block writing. */ } return kind === "free-note"; })<br>call<br>전달 콜백: H-2a020277dc12 |
| 1417행 | 별도 조건식 없음 | useTextDraft(storageKey, original?.body \|\| "", original?.version \|\| 0, { entityId: initialId.current, restoreIdentity: newNote \|\| (!original && !narrativeId) })<br>preservation-boundary → [H-5a1b8bd8ef05](App.md#h-5a1b8bd8ef05) |
| 1419행 | 별도 조건식 없음 | useState(false)<br>call |
| 1420행 | 별도 조건식 없음 | useState(false)<br>call |
| 1420행 | 별도 조건식 없음 | useState('')<br>call |
| 1421행 | 별도 조건식 없음 | useRef(false)<br>call |
| 1421행 | 별도 조건식 없음 | useRef(true)<br>call |
| 1422행 | 별도 조건식 없음 | useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, [])<br>call<br>전달 콜백: H-e0a8022dc3a7 |
| 1424행 | truthy: newNote | active(data.narratives).find(item => item.id === stableId && item.kind === kind && item.ownerId === ownerId)<br>call<br>전달 콜백: H-3b86b341e421 |
| 1424행 | truthy: newNote | active(data.narratives)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |

반환/조기 중단: 1478행 <render> [별도 조건식 없음]

## H-e5029a45a92f

**@callback:active(data.narratives).find** · [src/App.tsx:1403](../../../src/App.tsx#L1403)

분기 조건과 가능한 갈림길:

- B-e7ef8cf00b9a · ConditionalExpression · narrativeId → truthy / falsy; 바깥 조건: truthy: !newNote (1403행).

## H-2a020277dc12

**@callback:useState** · [src/App.tsx:1409](../../../src/App.tsx#L1409)

분기 조건과 가능한 갈림길:

- B-f30a91f7a0de · IfStatement · inline → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1410행).
- B-7f2dfae04659 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1411행).
- B-c8c09c71f587 · IfStatement · saved === "open" || saved === "closed" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1413행).
- B-5557a2a37082 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1414행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1412행 | 별도 조건식 없음 | sessionStorage.getItem(disclosureKey)<br>preservation-boundary |

반환/조기 중단: 1410행 true [truthy: inline]; 1413행 saved === "open" [truthy: saved === "open" || saved === "closed"]; 1415행 kind === "free-note" [별도 조건식 없음]

## H-e0a8022dc3a7

**@callback:useEffect** · [src/App.tsx:1422](../../../src/App.tsx#L1422)


반환/조기 중단: 1422행 () => { mounted.current = false; } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3b86b341e421

**@callback:active(data.narratives).find** · [src/App.tsx:1424](../../../src/App.tsx#L1424)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-46e5b3688da2

**save** · [src/App.tsx:1425](../../../src/App.tsx#L1425) · async

분기 조건과 가능한 갈림길:

- B-351d8744e24c · IfStatement · savingGuard.current || draft.blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1426행).
- B-158be0cfd0ac · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (1428행).
- B-8cf1e5c93201 · IfStatement · !repository && alreadyCreated && alreadyCreated.body === draft.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1433행).
- B-866eda565e69 · ConditionalExpression · cleaned → truthy / falsy; 바깥 조건: truthy: !repository && alreadyCreated && alreadyCreated.body === draft.body (1435행).
- B-e61171b05098 · ConditionalExpression · queued → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1437행).
- B-d6441e85ba69 · ConditionalExpression · repository → truthy / falsy; 바깥 조건: falsy: queued (1446행).
- B-c739b40d455d · IfStatement · result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1448행).
- B-f37d35a7c170 · IfStatement · repository → truthy / falsy; 바깥 조건: truthy: result (1449행).
- B-bd5ed6626941 · IfStatement · repository && data.namespace !== 'demo' → truthy / falsy; 바깥 조건: truthy: result (1455행).
- B-dc1924f446a9 · IfStatement · !repository.flush || !repository.getStatus → truthy / falsy; 바깥 조건: truthy: result ∧ truthy: repository && data.namespace !== 'demo' (1456행).
- B-aeff5d52a320 · IfStatement · !mounted.current → truthy / falsy; 바깥 조건: truthy: result ∧ truthy: repository && data.namespace !== 'demo' (1458행).
- B-ff2ab6e31b5d · IfStatement · status.phase !== 'saved' || status.pending !== 0 → truthy / falsy; 바깥 조건: truthy: result ∧ truthy: repository && data.namespace !== 'demo' (1460행).
- B-600236728c4b · IfStatement · !mounted.current → truthy / falsy; 바깥 조건: truthy: result (1462행).
- B-d537fbbc3fd2 · ConditionalExpression · cleaned → truthy / falsy; 바깥 조건: truthy: result (1467행).
- B-03f4e8e44df8 · IfStatement · repository → truthy / falsy; 바깥 조건: falsy: result (1468행).
- B-2c2889339d1b · CatchClause · reason → exception; 바깥 조건: 별도 조건식 없음 (1471행).
- B-2b689e6e13a3 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: exception: reason (1472행).
- B-28539efc1dd1 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (1475행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1427행 | 별도 조건식 없음 | setSaving(true)<br>state-update |
| 1427행 | 별도 조건식 없음 | setSaveError('')<br>state-update |
| 1434행 | truthy: !repository && alreadyCreated && alreadyCreated.body === draft.body | draft.clear(alreadyCreated.version)<br>preservation-boundary |
| 1435행 | truthy: !repository && alreadyCreated && alreadyCreated.body === draft.body | setSaved(true)<br>state-update |
| 1437행 | truthy: queued | repository!.getSnapshot()<br>call |
| 1437행 | falsy: queued | commit({ type: "updateNarrative", id: stableId, kind, ownerId, body: draft.body, expectedVersion: draft.expected.current, }, repository ? undefined : `${label}을 저장했습니다.`)<br>mutation-request |
| 1452행 | truthy: result ∧ truthy: repository | result.narratives.find(n => n.id === stableId)<br>call<br>전달 콜백: H-1ed36b892a35 |
| 1453행 | truthy: result ∧ truthy: repository | draft.change(draft.body)<br>preservation-boundary |
| 1457행 | truthy: result ∧ truthy: repository && data.namespace !== 'demo' | repository.flush()<br>mutation-request |
| 1459행 | truthy: result ∧ truthy: repository && data.namespace !== 'demo' | repository.getStatus()<br>call |
| 1463행 | truthy: result | draft.clear(result.narratives.find((n) => n.id === stableId)!.version)<br>preservation-boundary |
| 1464행 | truthy: result | result.narratives.find((n) => n.id === stableId)<br>call<br>전달 콜백: H-74385c4eb58a |
| 1466행 | truthy: result | setSaved(true)<br>state-update |
| 1469행 | falsy: result ∧ truthy: repository | setSaveError('내용을 저장하지 못했습니다. 편집 내용은 유지했습니다. 다시 저장해 주세요.')<br>state-update |
| 1472행 | exception: reason ∧ truthy: mounted.current | setSaveError(message(reason))<br>state-update |
| 1472행 | exception: reason ∧ truthy: mounted.current | message(reason)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |
| 1475행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setSaving(false)<br>state-update |

반환/조기 중단: 1426행 <render> [truthy: savingGuard.current || draft.blocked]; 1435행 <render> [truthy: !repository && alreadyCreated && alreadyCreated.body === draft.body]; 1458행 <render> [truthy: result ∧ truthy: repository && data.namespace !== 'demo' ∧ truthy: !mounted.current]; 1462행 <render> [truthy: result ∧ truthy: !mounted.current]

throw: 1456행 new Error('서버 저장을 확인하지 못했습니다. 입력은 이 기기에 남아 있습니다.'); 1460행 new Error(`${status.message} 편집 내용은 유지했습니다. 다시 저장해 주세요.`)

## H-1ed36b892a35

**@callback:result.narratives.find** · [src/App.tsx:1452](../../../src/App.tsx#L1452)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-74385c4eb58a

**@callback:result.narratives.find** · [src/App.tsx:1464](../../../src/App.tsx#L1464)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8bb0f97a3c44

**@onToggle** · [src/App.tsx:1479](../../../src/App.tsx#L1479)

분기 조건과 가능한 갈림길:

- B-2aa9afa01dcc · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1482행).
- B-33b6712b24df · ConditionalExpression · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1482행).
- B-ab50745377ba · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1483행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1481행 | 별도 조건식 없음 | setExpanded(open)<br>state-update |
| 1482행 | 별도 조건식 없음 | sessionStorage.setItem(disclosureKey, open ? "open" : "closed")<br>preservation-boundary |

## H-b8eb18005c2a

**@onChange** · [src/App.tsx:1495](../../../src/App.tsx#L1495)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1496행 | 별도 조건식 없음 | draft.change(e.target.value)<br>preservation-boundary |
| 1497행 | 별도 조건식 없음 | setSaved(false)<br>state-update |
| 1498행 | 별도 조건식 없음 | setSaveError('')<br>state-update |

## H-c41938c93af9

**@onClick** · [src/App.tsx:1515](../../../src/App.tsx#L1515)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1515행 | 별도 조건식 없음 | save()<br>call → [H-46e5b3688da2](App.md#h-46e5b3688da2) |

## H-f0c55b4a225b

**FreeNotes** · [src/App.tsx:1522](../../../src/App.tsx#L1522)

분기 조건과 가능한 갈림길:

- B-b86d21400691 · ConditionalExpression · route === "/free" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1534행).
- B-21d3067f246a · IfStatement · legacy.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1537행).
- B-174f7e1c3f0c · ConditionalExpression · route !== "/free" && id !== legacy.id && !creating && !selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1543행).
- B-155bd5550f71 · ConditionalExpression · creating → truthy / falsy; 바깥 조건: falsy: route !== "/free" && id !== legacy.id && !creating && !selected (1546행).
- B-b91ff5101ea4 · ConditionalExpression · creating → truthy / falsy; 바깥 조건: falsy: route !== "/free" && id !== legacy.id && !creating && !selected (1547행).
- B-416d7a68e062 · ConditionalExpression · id === legacy.id → truthy / falsy; 바깥 조건: falsy: route !== "/free" && id !== legacy.id && !creating && !selected ∧ falsy: creating (1547행).
- B-000a1afbbb4b · ConditionalExpression · creating → truthy / falsy; 바깥 조건: falsy: route !== "/free" && id !== legacy.id && !creating && !selected (1548행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1523행 | 별도 조건식 없음 | active(data.narratives).filter(n => n.kind === "free-note" && n.ownerId === null)<br>call<br>전달 콜백: H-ec9bd0f06afa |
| 1523행 | 별도 조건식 없음 | active(data.narratives)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 1524행 | 별도 조건식 없음 | useState(() => { try { const key = `${storagePrefix(data)}:free-default-id`; const existing = localStorage.getItem(key); const id = existing \|\| notes[0]?.id \|\| uid(); if (!id.trim()) throw new Error(); if (!existing) localStorage.setItem(key, id); return { id, error: "" }; } catch { return { id: "", error: "자유 기록의 연결을 보관하지 못했습니다. 기존 초안을 남겨 두었습니다." }; } })<br>call<br>전달 콜백: H-690b0364c302 |
| 1534행 | falsy: route === "/free" | route.slice("/free/".length)<br>call |
| 1536행 | 별도 조건식 없음 | notes.find(n => n.id === id)<br>call<br>전달 콜백: H-1bae249e442d |
| 1547행 | falsy: route !== "/free" && id !== legacy.id && !creating && !selected ∧ truthy: creating | storagePrefix(data)<br>call |
| 1547행 | falsy: route !== "/free" && id !== legacy.id && !creating && !selected ∧ falsy: creating ∧ truthy: id === legacy.id | storagePrefix(data)<br>call |
| 1547행 | falsy: route !== "/free" && id !== legacy.id && !creating && !selected ∧ falsy: creating ∧ falsy: id === legacy.id | storagePrefix(data)<br>call |
| 1552행 | 별도 조건식 없음 | notes.slice().reverse().map(note => <Card key={note.id}> <a href={`#/free/${note.id}`} aria-current={selected?.id === note.id ? "page" : undefined}> {note.body.trim().split("\n")[0].slice(0, 80) \|\| "내용 없이 남긴 자유 기록"} </a> <small>{new Date(note.updatedAt).toLocaleString("ko-KR")}</small> </Card>)<br>call<br>전달 콜백: H-e7aace710bd2 |
| 1552행 | 별도 조건식 없음 | notes.slice().reverse()<br>call |
| 1552행 | 별도 조건식 없음 | notes.slice()<br>call |

반환/조기 중단: 1537행 <render> [truthy: legacy.error]; 1538행 <render> [별도 조건식 없음]

## H-ec9bd0f06afa

**@callback:active(data.narratives).filter** · [src/App.tsx:1523](../../../src/App.tsx#L1523)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-690b0364c302

**@callback:useState** · [src/App.tsx:1524](../../../src/App.tsx#L1524)

분기 조건과 가능한 갈림길:

- B-ab6cc8b98062 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1525행).
- B-da5f9b44ecc0 · IfStatement · !id.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1529행).
- B-a2b2d7fe9433 · IfStatement · !existing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1530행).
- B-55f72c8ec257 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1532행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1526행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1527행 | 별도 조건식 없음 | localStorage.getItem(key)<br>preservation-boundary |
| 1528행 | falsy: existing \|\| notes[0]?.id | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 1529행 | 별도 조건식 없음 | id.trim()<br>call |
| 1530행 | truthy: !existing | localStorage.setItem(key, id)<br>preservation-boundary |

반환/조기 중단: 1531행 { id, error: "" } [별도 조건식 없음]; 1532행 { id: "", error: "자유 기록의 연결을 보관하지 못했습니다. 기존 초안을 남겨 두었습니다." } [exception: exception]

throw: 1529행 new Error()

## H-1bae249e442d

**@callback:notes.find** · [src/App.tsx:1536](../../../src/App.tsx#L1536)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0d7038513299

**@onClick** · [src/App.tsx:1540](../../../src/App.tsx#L1540)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1540행 | 별도 조건식 없음 | go("/free/new")<br>navigation |

## H-e7aace710bd2

**@callback:notes.slice().reverse().map** · [src/App.tsx:1552](../../../src/App.tsx#L1552)

분기 조건과 가능한 갈림길:

- B-7f83d5cb5095 · ConditionalExpression · selected?.id === note.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1553행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1554행 | 별도 조건식 없음 | note.body.trim().split("\n")[0].slice(0, 80)<br>call |
| 1554행 | 별도 조건식 없음 | note.body.trim().split("\n")<br>call |
| 1554행 | 별도 조건식 없음 | note.body.trim()<br>call |
| 1556행 | 별도 조건식 없음 | new Date(note.updatedAt).toLocaleString("ko-KR")<br>call |

## H-659c90331128

**RecordForm** · [src/App.tsx:1562](../../../src/App.tsx#L1562)

분기 조건과 가능한 갈림길:

- B-7e44df36d2d6 · ConditionalExpression · draftHasUnstoredText(`${storagePrefix(data)}:draft:${key}`) → truthy / falsy; 바깥 조건: falsy: boot.error (1601행).
- B-08e05b8bf874 · ConditionalExpression · filter → truthy / falsy; 바깥 조건: truthy: !hasMatches (1678행).
- B-9de0c4541e68 · ConditionalExpression · filter → truthy / falsy; 바깥 조건: truthy: !hasMatches (1679행).
- B-0ac3fbb32477 · ConditionalExpression · form.dateEvidence.kind === "exact" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1750행).
- B-b79f4da95d45 · ConditionalExpression · form.dateEvidence.kind === "range" → truthy / falsy; 바깥 조건: falsy: form.dateEvidence.kind === "exact" (1752행).
- B-6634e26123c7 · ConditionalExpression · draftBlocked → truthy / falsy; 바깥 조건: truthy: draftError (1831행).
- B-ba84ddd31024 · ConditionalExpression · boot.draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1834행).
- B-98da587f7bdc · ConditionalExpression · form.selectedIds.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1843행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1576행 | 별도 조건식 없음 | useState(() => { try { const storageKey = `${storagePrefix(data)}:draft:${key}`; const rescued = readRescuedDraft(storageKey); if (rescued === "") return { draft: null, error: "" }; if (rescued) { const draft = JSON.parse(rescued); validateFormDraft(draft, key); return { draft, error: draftReadError(storageKey) }; } return { draft: readDraft(localStorage, key, storagePrefix(data)), error: draftReadError(storageKey) }; } catch (e) { rememberDraftReadError(`${storagePrefix(data)}:draft:${key}`, message(e)); return { draft: null, error: message(e) }; } })<br>call<br>전달 콜백: H-d021e090b9f8 |
| 1588행 | 별도 조건식 없음 | useState(() => boot.draft \|\| { key, sessionId: uid(), selectedIds: initialTarget ? [initialTarget] : [], bodies: {}, done: initialTarget ? { [initialTarget]: true } : {}, trace: {}, dateEvidence: { kind: "exact", date: localDay() }, })<br>call<br>전달 콜백: H-1dc59ae5e8f3 |
| 1600행 | 별도 조건식 없음 | useRef(form)<br>call |
| 1601행 | 별도 조건식 없음 | useState(boot.error \|\| (draftHasUnstoredText(`${storagePrefix(data)}:draft:${key}`) ? "저장에 실패한 입력을 이 창에서 유지합니다. 다시 저장하거나 복사해 주세요." : ""))<br>call |
| 1601행 | falsy: boot.error | draftHasUnstoredText(`${storagePrefix(data)}:draft:${key}`)<br>preservation-boundary |
| 1601행 | falsy: boot.error | storagePrefix(data)<br>call |
| 1602행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 1602행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 1603행 | 별도 조건식 없음 | useState(() => readPreference(`record-filter:${key}`, "", storagePrefix(data)))<br>call<br>전달 콜백: H-1f71e30548f8 |
| 1604행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1605행 | 별도 조건식 없음 | useEffect(() => { writePreference(`record-filter:${key}`, filter, recordStoragePrefix); }, [key, filter, recordStoragePrefix])<br>call<br>전달 콜백: H-14c105df4d8e |
| 1606행 | 별도 조건식 없음 | useRef(false)<br>call |
| 1607행 | 별도 조건식 없음 | active(data.nodes).filter((n) => n.role === "topic" \|\| n.id === initialTarget)<br>call<br>전달 콜백: H-047785ba25fb |
| 1607행 | 별도 조건식 없음 | active(data.nodes)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 1610행 | 별도 조건식 없음 | active(data.subjects).filter(subject => subjectIds.includes(subject.id))<br>call<br>전달 콜백: H-f4a2164fee00 |
| 1610행 | 별도 조건식 없음 | active(data.subjects)<br>call → [H-96c4a47c6bd4](App.md#h-96c4a47c6bd4) |
| 1611행 | 별도 조건식 없음 | nodes.filter(node => subjectIds.includes(node.subjectId))<br>call<br>전달 콜백: H-e5c2b6e272a7 |
| 1612행 | 별도 조건식 없음 | pickerNodes.some(node => node.name.includes(filter))<br>call<br>전달 콜백: H-ee444221ee0f |
| 1613행 | 별도 조건식 없음 | form.selectedIds.some(id => !pickerNodes.some(node => node.id === id))<br>call<br>전달 콜백: H-9a3e4097c253 |
| 1668행 | 별도 조건식 없음 | pickerSubjects.map(subject => { const matching = pickerNodes.filter(node => node.subjectId === subject.id && node.name.includes(filter)); if (!matching.length) return null; const groups = [...new Set(matching.map(node => node.parentId))]; return <fieldset className="record-topic-group" key={subject.id}><legend>{subject.name}</legend>{groups.map(parentId => <div key={parentId ?? 'root'}> {parentId && <h3 className="record-unit-heading">{recallPath(data.nodes, parentId).map(node => node.name).join(' / ')}</h3>} {matching.filter(node => node.parentId === parentId).map(node => <Checkbox key={node.id} label={node.name} checked={form.selectedIds.includes(node.id)} onChange={event => select(node.id, event.target.chec … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-3a0b44ca9f3d |
| 1702행 | 별도 조건식 없음 | form.selectedIds.map((id) => ( <Card key={id} className="record-entry"> <div className="record-entry-heading"><h2> {nodes.find((n) => n.id === id)?.name \|\| "현재 목록에 없는 주제"} </h2> <Checkbox label="공부함" checked={form.done[id] ?? true} onChange={(e) => change({ ...form, done: { ...form.done, [id]: e.target.checked }, }) } /> </div> <Textarea label="메모" hint="선택 입력" data-editing-context={`record-draft:${key}:${id}`} value={form.bodies[id] \|\| ""} rows={3} onChange={(e) => change({ ...form, bodies: { ...form.bodies, [id]: e.target.value }, }) } placeholder="짧은 메모, 막힌 점, 긴 생각 모두 괜찮습니다." /> <TraceEditor contextKey={`record-draft:${key}:${form.sessionId}:${id}`} definitions={data.nodes.some(node => node.id === id) ? resol … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9c403b319a03 |

반환/조기 중단: 1663행 <render> [별도 조건식 없음]

## H-d021e090b9f8

**@callback:useState** · [src/App.tsx:1576](../../../src/App.tsx#L1576)

분기 조건과 가능한 갈림길:

- B-113977462ed3 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1577행).
- B-17ddcf038fd4 · IfStatement · rescued === "" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1580행).
- B-2d9b4e77b9df · IfStatement · rescued → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1581행).
- B-9010715b6fd9 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (1583행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1578행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1579행 | 별도 조건식 없음 | readRescuedDraft(storageKey)<br>preservation-boundary |
| 1581행 | truthy: rescued | JSON.parse(rescued)<br>call |
| 1581행 | truthy: rescued | validateFormDraft(draft, key)<br>preservation-boundary |
| 1581행 | truthy: rescued | draftReadError(storageKey)<br>preservation-boundary |
| 1582행 | 별도 조건식 없음 | readDraft(localStorage, key, storagePrefix(data))<br>preservation-boundary |
| 1582행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1582행 | 별도 조건식 없음 | draftReadError(storageKey)<br>preservation-boundary |
| 1584행 | exception: e | rememberDraftReadError(`${storagePrefix(data)}:draft:${key}`, message(e))<br>preservation-boundary |
| 1584행 | exception: e | storagePrefix(data)<br>call |
| 1584행 | exception: e | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |
| 1585행 | exception: e | message(e)<br>call → [H-511c1a5c281e](App.md#h-511c1a5c281e) |

반환/조기 중단: 1580행 { draft: null, error: "" } [truthy: rescued === ""]; 1581행 { draft, error: draftReadError(storageKey) } [truthy: rescued]; 1582행 { draft: readDraft(localStorage, key, storagePrefix(data)), error: draftReadError(storageKey) } [별도 조건식 없음]; 1585행 { draft: null, error: message(e) } [exception: e]

## H-1dc59ae5e8f3

**@callback:useState** · [src/App.tsx:1589](../../../src/App.tsx#L1589)

분기 조건과 가능한 갈림길:

- B-77c046499493 · ConditionalExpression · initialTarget → truthy / falsy; 바깥 조건: falsy: boot.draft (1593행).
- B-0272c59cfb48 · ConditionalExpression · initialTarget → truthy / falsy; 바깥 조건: falsy: boot.draft (1595행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1592행 | falsy: boot.draft | uid()<br>call → [H-d0766b91b8fb](App.md#h-d0766b91b8fb) |
| 1597행 | falsy: boot.draft | localDay()<br>call |

## H-1f71e30548f8

**@callback:useState** · [src/App.tsx:1603](../../../src/App.tsx#L1603)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1603행 | 별도 조건식 없음 | readPreference(`record-filter:${key}`, "", storagePrefix(data))<br>call → [H-32d9e181cddf](App.md#h-32d9e181cddf) |
| 1603행 | 별도 조건식 없음 | storagePrefix(data)<br>call |

## H-14c105df4d8e

**@callback:useEffect** · [src/App.tsx:1605](../../../src/App.tsx#L1605)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1605행 | 별도 조건식 없음 | writePreference(`record-filter:${key}`, filter, recordStoragePrefix)<br>call → [H-06d98b350952](App.md#h-06d98b350952) |

## H-047785ba25fb

**@callback:active(data.nodes).filter** · [src/App.tsx:1608](../../../src/App.tsx#L1608)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f4a2164fee00

**@callback:active(data.subjects).filter** · [src/App.tsx:1610](../../../src/App.tsx#L1610)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1610행 | 별도 조건식 없음 | subjectIds.includes(subject.id)<br>call |

## H-e5c2b6e272a7

**@callback:nodes.filter** · [src/App.tsx:1611](../../../src/App.tsx#L1611)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1611행 | 별도 조건식 없음 | subjectIds.includes(node.subjectId)<br>call |

## H-ee444221ee0f

**@callback:pickerNodes.some** · [src/App.tsx:1612](../../../src/App.tsx#L1612)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1612행 | 별도 조건식 없음 | node.name.includes(filter)<br>call |

## H-9a3e4097c253

**@callback:form.selectedIds.some** · [src/App.tsx:1613](../../../src/App.tsx#L1613)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1613행 | 별도 조건식 없음 | pickerNodes.some(node => node.id === id)<br>call<br>전달 콜백: H-abe68297659d |

## H-abe68297659d

**@callback:pickerNodes.some** · [src/App.tsx:1613](../../../src/App.tsx#L1613)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d01824652e3f

**change** · [src/App.tsx:1614](../../../src/App.tsx#L1614)

분기 조건과 가능한 갈림길:

- B-7c172d8c7cf3 · IfStatement · draftBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1618행).
- B-b1c0a542e2e4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (1619행).
- B-44bca45494ae · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (1623행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1616행 | 별도 조건식 없음 | setForm(next)<br>state-update |
| 1617행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 1618행 | truthy: draftBlocked | rescueWithoutOverwrite(storageKey, JSON.stringify(next))<br>call |
| 1618행 | truthy: draftBlocked | JSON.stringify(next)<br>call |
| 1620행 | 별도 조건식 없음 | validateFormDraft(next, key)<br>preservation-boundary |
| 1621행 | 별도 조건식 없음 | storeDraftSafely(storageKey, JSON.stringify(next))<br>preservation-boundary |
| 1621행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |
| 1622행 | 별도 조건식 없음 | setDraftError("")<br>state-update |
| 1624행 | exception: exception | setDraftError("초안을 보관하지 못했습니다. 화면을 닫기 전에 입력을 복사해 주세요.")<br>state-update |

반환/조기 중단: 1618행 <render> [truthy: draftBlocked]

## H-cec0d74e93a8

**select** · [src/App.tsx:1629](../../../src/App.tsx#L1629)

분기 조건과 가능한 갈림길:

- B-0dee9573d055 · ConditionalExpression · checked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1632행).
- B-0591e4cff2df · ConditionalExpression · checked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1635행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1630행 | 별도 조건식 없음 | change({ ...form, selectedIds: checked ? [...form.selectedIds, id] : form.selectedIds.filter((x) => x !== id), done: checked ? { ...form.done, [id]: form.done[id] ?? true } : form.done, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |
| 1634행 | falsy: checked | form.selectedIds.filter((x) => x !== id)<br>call<br>전달 콜백: H-58bac01c2a09 |

## H-58bac01c2a09

**@callback:form.selectedIds.filter** · [src/App.tsx:1634](../../../src/App.tsx#L1634)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1d308e7a8e15

**submit** · [src/App.tsx:1637](../../../src/App.tsx#L1637)

분기 조건과 가능한 갈림길:

- B-b350516f8b85 · IfStatement · guard.current || draftBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1638행).
- B-7fe5be2490df · IfStatement · next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1652행).
- B-b853edb739d1 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: next (1654행).
- B-a155b694c903 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: next (1656행).
- B-e2bc1b15c6f8 · ConditionalExpression · warning → truthy / falsy; 바깥 조건: truthy: next (1660행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1641행 | 별도 조건식 없음 | commit({ type: "saveRecords", sessionId: form.sessionId, dateEvidence: form.dateEvidence, entries: form.selectedIds.map((id) => ({ targetId: id, done: form.done[id] ?? true, body: form.bodies[id] \|\| "", trace: form.trace[id] \|\| {}, })), })<br>mutation-request |
| 1645행 | 별도 조건식 없음 | form.selectedIds.map((id) => ({ targetId: id, done: form.done[id] ?? true, body: form.bodies[id] \|\| "", trace: form.trace[id] \|\| {}, }))<br>call<br>전달 콜백: H-c7d9f4d68c52 |
| 1655행 | truthy: next | clearStoredDraft(`${storagePrefix(data)}:draft:${key}`)<br>preservation-boundary |
| 1655행 | truthy: next | storagePrefix(data)<br>call |
| 1660행 | truthy: next | onSaved(warning, warning ? `${storagePrefix(data)}:draft:${key}` : undefined)<br>call |
| 1660행 | truthy: next ∧ truthy: warning | storagePrefix(data)<br>call |

반환/조기 중단: 1638행 <render> [truthy: guard.current || draftBlocked]

## H-c7d9f4d68c52

**@callback:form.selectedIds.map** · [src/App.tsx:1645](../../../src/App.tsx#L1645)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3a0b44ca9f3d

**@callback:pickerSubjects.map** · [src/App.tsx:1668](../../../src/App.tsx#L1668)

분기 조건과 가능한 갈림길:

- B-ee8cdba6ab3b · IfStatement · !matching.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1670행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1669행 | 별도 조건식 없음 | pickerNodes.filter(node => node.subjectId === subject.id && node.name.includes(filter))<br>call<br>전달 콜백: H-be35b8984bdc |
| 1671행 | 별도 조건식 없음 | matching.map(node => node.parentId)<br>call<br>전달 콜백: H-c85c33b50cba |
| 1672행 | 별도 조건식 없음 | groups.map(parentId => <div key={parentId ?? 'root'}> {parentId && <h3 className="record-unit-heading">{recallPath(data.nodes, parentId).map(node => node.name).join(' / ')}</h3>} {matching.filter(node => node.parentId === parentId).map(node => <Checkbox key={node.id} label={node.name} checked={form.selectedIds.includes(node.id)} onChange={event => select(node.id, event.target.checked)} />)} </div>)<br>call<br>전달 콜백: H-5ae282e7b2db |

반환/조기 중단: 1670행 null [truthy: !matching.length]; 1672행 <render> [별도 조건식 없음]

## H-be35b8984bdc

**@callback:pickerNodes.filter** · [src/App.tsx:1669](../../../src/App.tsx#L1669)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1669행 | truthy: node.subjectId === subject.id | node.name.includes(filter)<br>call |

## H-c85c33b50cba

**@callback:matching.map** · [src/App.tsx:1671](../../../src/App.tsx#L1671)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5ae282e7b2db

**@callback:groups.map** · [src/App.tsx:1672](../../../src/App.tsx#L1672)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1673행 | truthy: parentId | recallPath(data.nodes, parentId).map(node => node.name).join(' / ')<br>call |
| 1673행 | truthy: parentId | recallPath(data.nodes, parentId).map(node => node.name)<br>call<br>전달 콜백: H-68be7d8221ae |
| 1673행 | truthy: parentId | recallPath(data.nodes, parentId)<br>call |
| 1674행 | 별도 조건식 없음 | matching.filter(node => node.parentId === parentId).map(node => <Checkbox key={node.id} label={node.name} checked={form.selectedIds.includes(node.id)} onChange={event => select(node.id, event.target.checked)} />)<br>call<br>전달 콜백: H-bcc139038de9 |
| 1674행 | 별도 조건식 없음 | matching.filter(node => node.parentId === parentId)<br>call<br>전달 콜백: H-e522b05abfbc |

## H-68be7d8221ae

**@callback:recallPath(data.nodes, parentId).map** · [src/App.tsx:1673](../../../src/App.tsx#L1673)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e522b05abfbc

**@callback:matching.filter** · [src/App.tsx:1674](../../../src/App.tsx#L1674)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bcc139038de9

**@callback:matching.filter(node => node.parentId === parentId).map** · [src/App.tsx:1674](../../../src/App.tsx#L1674)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1674행 | 별도 조건식 없음 | form.selectedIds.includes(node.id)<br>call |

## H-c86618d01c4a

**@onChange** · [src/App.tsx:1674](../../../src/App.tsx#L1674)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1674행 | 별도 조건식 없음 | select(node.id, event.target.checked)<br>call → [H-cec0d74e93a8](App.md#h-cec0d74e93a8) |

## H-f609a6b175b0

**@onClick** · [src/App.tsx:1687](../../../src/App.tsx#L1687)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1688행 | truthy: form.selectedIds.length > 1 | change({ ...form, done: { ...form.done, ...Object.fromEntries( form.selectedIds.map((id) => [id, true]), ), }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |
| 1692행 | truthy: form.selectedIds.length > 1 | Object.fromEntries(form.selectedIds.map((id) => [id, true]))<br>call |
| 1693행 | truthy: form.selectedIds.length > 1 | form.selectedIds.map((id) => [id, true])<br>call<br>전달 콜백: H-87159e8356f7 |

## H-87159e8356f7

**@callback:form.selectedIds.map** · [src/App.tsx:1693](../../../src/App.tsx#L1693)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9c403b319a03

**@callback:form.selectedIds.map** · [src/App.tsx:1702](../../../src/App.tsx#L1702)

분기 조건과 가능한 갈림길:

- B-6010610679f9 · ConditionalExpression · data.nodes.some(node => node.id === id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1733행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1705행 | 별도 조건식 없음 | nodes.find((n) => n.id === id)<br>call<br>전달 콜백: H-0d945bc73e04 |
| 1733행 | 별도 조건식 없음 | data.nodes.some(node => node.id === id)<br>call<br>전달 콜백: H-e08e7a9cfe21 |
| 1733행 | truthy: data.nodes.some(node => node.id === id) | resolveCriteria(data, id)<br>call |

## H-0d945bc73e04

**@callback:nodes.find** · [src/App.tsx:1705](../../../src/App.tsx#L1705)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-517269f03f01

**@onChange** · [src/App.tsx:1710](../../../src/App.tsx#L1710)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1711행 | 별도 조건식 없음 | change({ ...form, done: { ...form.done, [id]: e.target.checked }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-a2838de4371b

**@onChange** · [src/App.tsx:1723](../../../src/App.tsx#L1723)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1724행 | 별도 조건식 없음 | change({ ...form, bodies: { ...form.bodies, [id]: e.target.value }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-e08e7a9cfe21

**@callback:data.nodes.some** · [src/App.tsx:1733](../../../src/App.tsx#L1733)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8d27074f6b21

**@onChange** · [src/App.tsx:1735](../../../src/App.tsx#L1735)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1736행 | 별도 조건식 없음 | change({ ...form, trace: { ...form.trace, [id]: trace } })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-c7e304988962

**@onChange** · [src/App.tsx:1759](../../../src/App.tsx#L1759)

분기 조건과 가능한 갈림길:

- B-bc124e8cbfb6 · ConditionalExpression · e.target.value === "unknown" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1763행).
- B-78cde8f544e5 · ConditionalExpression · e.target.value === "range" → truthy / falsy; 바깥 조건: falsy: e.target.value === "unknown" (1765행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1760행 | 별도 조건식 없음 | change({ ...form, dateEvidence: e.target.value === "unknown" ? { kind: "unknown" } : e.target.value === "range" ? { kind: "range", from: localDay(), to: localDay() } : { kind: "exact", date: localDay() }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |
| 1766행 | falsy: e.target.value === "unknown" ∧ truthy: e.target.value === "range" | localDay()<br>call |
| 1766행 | falsy: e.target.value === "unknown" ∧ truthy: e.target.value === "range" | localDay()<br>call |
| 1767행 | falsy: e.target.value === "unknown" ∧ falsy: e.target.value === "range" | localDay()<br>call |

## H-7b19b53f329e

**@onChange** · [src/App.tsx:1780](../../../src/App.tsx#L1780)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1781행 | truthy: form.dateEvidence.kind === "exact" | change({ ...form, dateEvidence: { kind: "exact", date: e.target.value }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-452e03b1773c

**@onChange** · [src/App.tsx:1794](../../../src/App.tsx#L1794)

분기 조건과 가능한 갈림길:

- B-bd19da9db016 · IfStatement · form.dateEvidence.kind === "range" → truthy / falsy; 바깥 조건: truthy: form.dateEvidence.kind === "range" (1795행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1796행 | truthy: form.dateEvidence.kind === "range" ∧ truthy: form.dateEvidence.kind === "range" | change({ ...form, dateEvidence: { ...form.dateEvidence, from: e.target.value, }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-d8f2f362057e

**@onChange** · [src/App.tsx:1809](../../../src/App.tsx#L1809)

분기 조건과 가능한 갈림길:

- B-9ef8e1d02ebc · IfStatement · form.dateEvidence.kind === "range" → truthy / falsy; 바깥 조건: truthy: form.dateEvidence.kind === "range" (1810행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1811행 | truthy: form.dateEvidence.kind === "range" ∧ truthy: form.dateEvidence.kind === "range" | change({ ...form, dateEvidence: { ...form.dateEvidence, to: e.target.value, }, })<br>call → [H-d01824652e3f](App.md#h-d01824652e3f) |

## H-56a0046fd907

**@onClick** · [src/App.tsx:1823](../../../src/App.tsx#L1823)

분기 조건과 가능한 갈림길:

- B-19d84d4baf41 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draftError (1825행).
- B-d7581844fbce · IfStatement · draftBlocked → truthy / falsy; 바깥 조건: truthy: draftError (1826행).
- B-f5eaef2c0444 · CatchClause · reason → exception; 바깥 조건: truthy: draftError (1830행).
- B-298e2fa8a174 · ConditionalExpression · reason instanceof DraftArchiveError → truthy / falsy; 바깥 조건: truthy: draftError ∧ exception: reason (1830행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1824행 | truthy: draftError | storagePrefix(data)<br>call |
| 1826행 | truthy: draftError ∧ truthy: draftBlocked | archiveDamagedDraft(storageKey)<br>preservation-boundary |
| 1827행 | truthy: draftError | validateFormDraft(currentForm.current, key)<br>preservation-boundary |
| 1828행 | truthy: draftError | storeDraftSafely(storageKey, JSON.stringify(currentForm.current))<br>preservation-boundary |
| 1828행 | truthy: draftError | JSON.stringify(currentForm.current)<br>call |
| 1829행 | truthy: draftError | setDraftBlocked(false)<br>state-update |
| 1829행 | truthy: draftError | setDraftError("")<br>state-update |
| 1830행 | truthy: draftError ∧ exception: reason | setDraftError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요.")<br>state-update |

## H-1043b7f22d21

**RecordCard** · [src/App.tsx:1852](../../../src/App.tsx#L1852)

분기 조건과 가능한 갈림길:

- B-3e928d26b624 · ConditionalExpression · record.dateEvidence.kind === "exact" → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1876행).
- B-fa5d7ea107fc · ConditionalExpression · record.dateEvidence.kind === "range" → truthy / falsy; 바깥 조건: falsy: record.dateEvidence.kind === "exact" (1878행).
- B-acfad1c29d27 · ConditionalExpression · record.done → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1882행).
- B-ce9eadf9a926 · ConditionalExpression · Object.values(record.trace).some((t) => t.status === "checked") → truthy / falsy; 바깥 조건: falsy: record.done (1884행).
- B-29862e681e16 · ConditionalExpression · editing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1888행).
- B-6f4817d21c5f · ConditionalExpression · body.blocked → truthy / falsy; 바깥 조건: truthy: body.error (1932행).
- B-1c1a6f42d414 · ConditionalExpression · body.cleanupPending → truthy / falsy; 바깥 조건: truthy: body.error ∧ falsy: body.blocked (1932행).
- B-2d8979ccc749 · ConditionalExpression · answer.blocked → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body ∧ truthy: answer.error (2003행).
- B-79d23b0627b7 · ConditionalExpression · answer.cleanupPending → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body ∧ truthy: answer.error ∧ falsy: answer.blocked (2003행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1861행 | 별도 조건식 없음 | useTextDraft(`${storagePrefix(record)}:record:${record.id}`, record.body, record.version)<br>preservation-boundary → [H-5a1b8bd8ef05](App.md#h-5a1b8bd8ef05) |
| 1862행 | 별도 조건식 없음 | storagePrefix(record)<br>call |
| 1867행 | 별도 조건식 없음 | useTextDraft(`${storagePrefix(record)}:review:${record.id}`, review?.answer \|\| "", record.version)<br>preservation-boundary → [H-5a1b8bd8ef05](App.md#h-5a1b8bd8ef05) |
| 1868행 | 별도 조건식 없음 | storagePrefix(record)<br>call |
| 1872행 | 별도 조건식 없음 | useState(body.body !== record.body)<br>call |
| 1884행 | falsy: record.done | Object.values(record.trace).some((t) => t.status === "checked")<br>call<br>전달 콜백: H-9973e213f0e8 |
| 1884행 | falsy: record.done | Object.values(record.trace)<br>call |
| 1936행 | 별도 조건식 없음 | Object.entries(record.trace)<br>            .filter(([, value]) => value.status === "checked")<br>            .map(<br>              ([id, value]) => value.definition?.label \|\| TRACE_ITEMS.find((item) => item.id === id)?.label \|\| id,<br>            )<br>            .join(" · ")<br>call |
| 1936행 | 별도 조건식 없음 | Object.entries(record.trace)<br>            .filter(([, value]) => value.status === "checked")<br>            .map(([id, value]) => value.definition?.label \|\| TRACE_ITEMS.find((item) => item.id === id)?.label \|\| id)<br>call<br>전달 콜백: H-ee75677c3787 |
| 1936행 | 별도 조건식 없음 | Object.entries(record.trace)<br>            .filter(([, value]) => value.status === "checked")<br>call<br>전달 콜백: H-ec9901ac00e5 |
| 1936행 | 별도 조건식 없음 | Object.entries(record.trace)<br>call |
| 1943행 | 별도 조건식 없음 | Object.entries(record.trace).map(([id, item]) => <details key={id}> <summary>{item.definition?.label \|\| TRACE_ITEMS.find(value => value.id === id)?.label \|\| `이전 항목 (${id})`} · {{checked:"체크함",unchecked:"미체크",na:"해당 없음",deferred:"보류"}[item.status]}</summary> {item.note !== undefined && <p className="prose">{item.note}</p>} {item.repeats?.map(repeat => <div key={repeat.id}> <p>{repeat.kind === "unknown" ? "반복 횟수 모름" : `${repeat.kind === "minimum" ? "최소 " : ""}${repeat.count}회 반복`}</p> {repeat.note !== undefined && <p className="prose">{repeat.note}</p>} </div>)} </details>)<br>call<br>전달 콜백: H-a35d6184f125 |
| 1943행 | 별도 조건식 없음 | Object.entries(record.trace)<br>call |
| 1981행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body | Boolean(review?.checked)<br>call |

반환/조기 중단: 1873행 <render> [별도 조건식 없음]

## H-9973e213f0e8

**@callback:Object.values(record.trace).some** · [src/App.tsx:1884](../../../src/App.tsx#L1884)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7ed5223e3eb1

**@onChange** · [src/App.tsx:1894](../../../src/App.tsx#L1894)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1894행 | truthy: editing | body.change(e.target.value)<br>call |

## H-f87321b226fc

**@onClick** · [src/App.tsx:1898](../../../src/App.tsx#L1898)

분기 조건과 가능한 갈림길:

- B-a5fa5e763428 · IfStatement · result → truthy / falsy; 바깥 조건: truthy: editing (1908행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1899행 | truthy: editing | commit({ type: "updateRecord", id: record.id, expectedVersion: body.expected.current, patch: { body: body.body }, }, "기록을 수정했습니다.")<br>mutation-request |
| 1909행 | truthy: editing ∧ truthy: result | result.records.find((r) => r.id === record.id)<br>call<br>전달 콜백: H-7cdbc6f36f6f |
| 1910행 | truthy: editing ∧ truthy: result | body.clear(updated.version)<br>call |
| 1912행 | truthy: editing ∧ truthy: result | setEditing(false)<br>state-update |

## H-7cdbc6f36f6f

**@callback:result.records.find** · [src/App.tsx:1909](../../../src/App.tsx#L1909)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7c8a77d4ee88

**@onClick** · [src/App.tsx:1918](../../../src/App.tsx#L1918)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1918행 | truthy: editing | setEditing(false)<br>state-update |

## H-a5497a4f93fe

**@onClick** · [src/App.tsx:1927](../../../src/App.tsx#L1927)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1927행 | falsy: editing | setEditing(true)<br>state-update |

## H-ec9901ac00e5

**@callback:Object.entries(record.trace)
            .filter** · [src/App.tsx:1937](../../../src/App.tsx#L1937)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ee75677c3787

**@callback:Object.entries(record.trace)
            .filter(([, value]) => value.status === "checked")
            .map** · [src/App.tsx:1939](../../../src/App.tsx#L1939)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1939행 | falsy: value.definition?.label | TRACE_ITEMS.find((item) => item.id === id)<br>call<br>전달 콜백: H-31c3e31496b4 |

## H-31c3e31496b4

**@callback:TRACE_ITEMS.find** · [src/App.tsx:1939](../../../src/App.tsx#L1939)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a35d6184f125

**@callback:Object.entries(record.trace).map** · [src/App.tsx:1943](../../../src/App.tsx#L1943)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1944행 | falsy: item.definition?.label | TRACE_ITEMS.find(value => value.id === id)<br>call<br>전달 콜백: H-3d117a4ff27e |

## H-3d117a4ff27e

**@callback:TRACE_ITEMS.find** · [src/App.tsx:1944](../../../src/App.tsx#L1944)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-151ea4f84621

**@onChange** · [src/App.tsx:1956](../../../src/App.tsx#L1956)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1956행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body | answer.change(e.target.value)<br>call |

## H-ae6eaa1496f4

**@onClick** · [src/App.tsx:1960](../../../src/App.tsx#L1960)

분기 조건과 가능한 갈림길:

- B-b243a4b8929d · IfStatement · result → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body (1970행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1961행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body | commit({ type: "editWrittenReview", recordId: record.id, expectedVersion: answer.expected.current, answer: answer.body, }, "서술을 저장했습니다. 점검 체크는 다시 열었습니다.")<br>mutation-request |
| 1971행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body ∧ truthy: result | result.records.find((r) => r.id === record.id)<br>call<br>전달 콜백: H-b74a71535b28 |
| 1972행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body ∧ truthy: result | answer.clear(updated.version)<br>call |

## H-b74a71535b28

**@callback:result.records.find** · [src/App.tsx:1971](../../../src/App.tsx#L1971)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e918979e3570

**@onChange** · [src/App.tsx:1983](../../../src/App.tsx#L1983)

분기 조건과 가능한 갈림길:

- B-53a3d631a1ac · ConditionalExpression · review?.checked → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body (1986행).
- B-e6b0d8f848ba · ConditionalExpression · review?.checked → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body (1992행).
- B-f6d199da7ecd · IfStatement · result → truthy / falsy; 바깥 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body (1996행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1984행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body | commit({ type: review?.checked ? "unconfirmWrittenReview" : "confirmWrittenReview", recordId: record.id, expectedVersion: record.version, }, review?.checked ? "점검만 해제했습니다. 서술은 남아 있습니다." : "서술 점검을 기록했습니다.")<br>mutation-request |
| 1997행 | truthy: allowNewWrittenReview \|\| record.trace.Cself1 \|\| answer.body ∧ truthy: result | result.records.find((r) => r.id === record.id)<br>call<br>전달 콜백: H-0ad4ed888dcd |

## H-0ad4ed888dcd

**@callback:result.records.find** · [src/App.tsx:1997](../../../src/App.tsx#L1997)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

