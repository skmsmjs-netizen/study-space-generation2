# 전체 UI의 조건별 UX 경로 원장

2026-10-02 메모리 보수 이후 Figma는 1,589개 카드의 ID/제목/소스를 유지하면서 표면121·조작1,462개의 표시 본문만 요약한다. 아래 12,630링크·전체본문 원격 검증은 작성 시점의 이력이며, 현재 요약의 실제 digest·링크 목적지·카드 겹침·메모리 확인은 [메모리 보수 결과](../figma-memory-20261002/README.md)를 따른다. 전체 원문 Markdown/JSON과 실제 웹앱 기능은 보존한다.

## 실제 Figma 반영과 최종 확인

[전체 UX 경우·경로 목차](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=79-92667)에 실제 편집 가능한 카드 **1,589개**를 반영했다. 표면 121개·조작 1,462개·체크섬/읽기/색인 6개이며, **12,630개 참조 링크**의 실제 목적지를 다시 읽어 대조했다. 전체 제목·본문 길이/FNV·청크 순서·카드 경계·글꼴·링크 오류는 0이다. 대표 INDEX-R과 A01의 실제 PNG도 확인했다. 기존 화면 디자인은 [기존 Figma 전수 목차](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=36-92)에서 확인한다.

최종 증거는 [Figma 검증 요약](../../work/frontend-opportunities-20261002/figma-validation-summary.json)에 있다. `verify.cjs`는 이 저장된 원격 증거의 해시·카드 본문·소스 체크섬이 현재 캡처와 일치할 때만 `remoteExecutionVerified:true`를 보고한다. 이는 기록된 시점의 원격 재조회 근거이며, 이후 Figma 수정을 실시간으로 감시하는 기능은 아니다. 정적 문서 검증의 `runtimeTested:false`는 그대로 유지한다.

현재 웹앱의 원래 **41개 경로·29개 모달·41개 보조면, 합계 111개**와 새 확장 **A01–A10**을 구분하여 정리했다. [전체경로.md](전체경로.md)에서 시작하면 각 표면의 진입·표시·실행 차단·저장/취소·빈 상태·오류/재시도·복귀·중단 조건으로 내려갈 수 있다. 조작 이름 목록에서 끝내지 않고 실제 이벤트 식과 핸들러의 조건별 갈림길·호출·반환·예외·마지막 처리까지 연결한다.

이 원장은 유한한 **표면 → 조작 → 조건부 전이 → 핸들러** 그래프이다. 같은 조작을 여러 화면에서 재사용하는 경우 고유 조작 정의는 한 번 유지한다. 입력 글·자료 수·선택 집합·서버 응답 시점은 같은 경로의 매개변수와 반복 규칙으로 남긴다. 모든 입력 조합의 만족 가능성을 수학적으로 증명하거나 모든 조합을 실제로 실행했다고 주장하지 않는다.

## 체크섬과 현재 범위

최종 수치는 [summary.json](summary.json)과 [verification.json](verification.json)을 우선한다. 2026-10-02T03:27:44.072Z(한국 시각 12:27:44) 고정 캡처 기준은 다음과 같다.

| 대상 | 캡처 결과 |
| --- | ---: |
| 원래 표면 | 111, 등록 누락 0 |
| 새 확장 | 10 |
| 고유 TSX 조작/콜백/리스너/명령 선언 | 1,462 |
| 담당 표면 또는 확장 연결 | 1,462, 미분류 0 |
| 표면에 바인딩한 이벤트 전이 | 6,657 |
| 기존 과업 / 공통 상태 / 공통 전이 | 14 / 42 / 32 |
| TSX / 추적 함수 / 조건 분기 | 112 / 3,821 / 3,130 |
| 도달 가능한 모듈 / 별도 확장 계약 파일 | 280 / 3 |
| AST 구문 오류 / 캡처 중 변경 | 0 / 0 |

고유 조작 수에는 실제 native 버튼·링크·입력뿐 아니라 자식 컴포넌트의 callback 계약, imperative listener, 명령 정의가 포함된다. `kind` 필드가 이를 구분한다. 따라서 1,462은 실제 화면의 동시 버튼 수나 실행 시험 수가 아니다. 같은 고유 조작이 여러 표면에서 제공되므로 6,657개 바인딩 전이는 서로 다른 이벤트 정의 6,657개라는 뜻도 아니다.

- 표면 ID SHA-256: `d175ecae11746923aca739d7734625ce910224f5a5da3281a460bb952197f54f`
- 소스 파일/해시 집합 SHA-256: `c080b1b82f58bf46d05fac967061f05dab35509e011193b6e812e44f783f8ebe`
- 조작 ID SHA-256: `aaf2a8517653b4f5437d23918ce804461a613b194f1d95c57f518cba2c11ff42`

원래 111개 등록 누락, 고유 조작의 미분류, AST 분석 실패, 외부/props 경계, 캡처 후 소스 변경은 각각 다른 항목이다. 미분류 0은 마지막 세 항목의 실행 검증을 뜻하지 않는다. `X-`, `H-`, `B-` 등은 경로와 소스 오프셋에서 만든 문서 스냅샷 ID이므로 코드가 수정되면 바뀔 수 있다. 앱의 사용자 원문·record ID·저장 키와 관계없는 문서 식별자다.

## 파일과 읽기 순서

1. [전체경로.md](전체경로.md): 111+10 범위, 체크섬, 14개 과업, 미분류/변경 안내.
2. `paths/R01.md`–`R41.md`, `O01.md`–`O29.md`, `U01.md`–`U41.md`, `A01.md`–`A10.md`: 표면별 모든 조작 바인딩, 표시/차단 조건, 빈/오류/로딩, effect와 반복 규칙.
3. `actions/*.md`: 고유 조작별 이벤트 원문, 호출자 경계, 차단 조건, 정상/예외/마지막 처리. 각 조작은 하나의 정의를 유지한다.
4. `handlers/*.md`: 실제 함수의 조건식, 분기, 호출, 반환/중단, throw. 긴 호출 인수는 읽기 위해 문서에서 줄일 수 있으나 JSON과 실제 소스에 전체를 보존한다.
5. [공통상태.md](공통상태.md): 기존 42개 상태와 32개 전이의 원문.
6. [manifest.json](manifest.json), [source-actions.json](source-actions.json), [action-ownership.json](action-ownership.json): 기계 판독과 재생성을 위한 전체 구조. 이벤트 참조는 실제 JSON 배열 인덱스를 사용한다.
7. [extensions.json](extensions.json): A01–A10의 실제 소스 경로와 구체적 경우. 새 UI와 기반 엔진, 영구 보관과 탭 임시 보관을 구분한다.

## 선택한 방법과 실제 추출 범위

기존 Figma 전수 목록, React 상태 소유/콜백 경계, 유한 상태·조건부 전이 모델을 재사용했다. 같은 프로젝트의 [기존 프론트엔드 조사](../research/development-reference-20261002/frontend-graphics.md)와 기존 상태 계약이 방법의 출발점이다. 새 표준을 만든 것이 아니라 이 저장소를 읽기 위한 최소 어댑터를 작성했다.

설치된 **`@babel/parser`의 TypeScript+JSX AST와 `@babel/traverse`**를 사용한다. TypeScript compiler API로 타입 검증했다고 표현하지 않는다. `src/main.tsx`의 정적 import·문자열 리터럴 dynamic import에서 도달한 모듈을 읽고, 명시한 A01–A10의 worker/CSS 계약 파일도 해시 집합에 포함한다. 사용자 조작 추출 대상은 실제 TSX이다. worker/저장 모듈은 소스 근거로 별도 경우를 기술하고 원본 파일 해시를 고정한다.

- JSX `on*`, href/to, 기본·공통 입력/버튼/폼/summary, imperative `addEventListener`, 명령 객체를 수집한다.
- 조건부 JSX, if, switch, catch, Promise then/catch/finally, 모달 open, 조상 hidden/inert/disabled fieldset, React Activity mode, 배열 반복을 보존한다. CSS 내부 미디어 쿼리·브라우저 엔진 자체는 자동 AST 분기 범위가 아니므로 담당 소스와 실제 화면 확인이 필요하다.
- 실제 함수 호출·전달 콜백·JSX render 호출·React Flow의 nodeTypes/edgeTypes 등록을 연결한다. imported TS 저장/엔진/props는 확인 가능한 경계로 남긴다.
- 리터럴 경로/dialog/단순 props 조건만 제외 판정에 사용하고, hook/사용자 입력/서버 값은 임의로 true나 false라고 가정하지 않는다. App의 route 변수군과 node/subject 미선택 조건은 실제 App 선언을 반영한 저장소별 어댑터다.
- 원래 O20의 소유 함수가 `SourceInk`로 등록되어 있었지만 실제 동일 제목의 Modal은 `PerformanceFromSource`에 있다. 원본 inventory는 수정하지 않고 `entry.modalOwnerCorrections`에 실제 제목·소유자 근거를 보완했다.

모든 handler 목록이 그대로 시간 순서를 뜻하지는 않는다. 호출/콜백 관계가 연결된 집합이며 실제 실행 순서는 소스의 조건·호출·Promise 반환에 따른다. 읽기 편한 의미 태그는 이름/호출을 이용한 안내용 분류이므로 원문 이벤트가 판단의 근거다.

## 중단·재접속과 새 확장

A01 자료/메모/기록/코드의 기존 인스턴스를 유지하면서 표시만 전환한다. 수식은 Plot/GeoGebra 부분만 Activity로 멈추며 수식 입력·메모·A/B 비교는 바깥에 둔다. 곁 코드의 실행 중단/결과 수집·예제 선택은 원래 부품의 실제 active/onOpenExample 경로다.

A08은 원문 복제 없이 작업 경로/선택/폭 구성만 owner별로 보관한다. 같은 창 큐와 `navigator.locks` 안의 원본 비교/쓰기, 다른 창 변경 거부, 손상값 보존, 쓰기 재시도/다시 읽기, locks가 없을 때의 현재 창 유지가 서로 다른 경우다. A10은 A 조건을 **sessionStorage**에 보관하므로 같은 탭의 이어가기와 영구 장면/메모 저장을 구별한다. A05 측정값은 창 메모리의 값이며 새로고침 뒤 유지되는 기록이 아니다. A07의 검색 색인은 권한/저장 원장이 아니다.

각 표면의 effect/상태 변수가 존재한다는 사실만으로 실제 기기 재접속·동기화·서버 권한·원문 보존 검증을 통과했다고 하지 않는다. 이 원장 생성·검사는 제품 실행 시험과 구별한다. 실제 A01–A10 구현과 브라우저 검사는 [구현 기록](../frontend-opportunities-implementation-20261002.md)에 연결했다.

## 재생성과 문서 무결성 확인

프로젝트 `generation2`에서 실행한다. 모든 쓰기는 이 문서 폴더 내부뿐이다. 다른 작업의 소스나 기존 Figma 원본 폴더를 수정하지 않는다.

```sh
node docs/ux-paths-20261002/prepare-extensions.cjs
node docs/ux-paths-20261002/build-paths.cjs
node docs/ux-paths-20261002/verify.cjs
```

마지막 명령은 읽기 전용 문서 확인이다. 111/10의 범위, ID·참조·분류·JSON pointer·체크섬·Figma 입력의 누락, 현재 소스 해시와 원본 목록 변경을 대조하며 제품을 실행하지 않는다. `sourceDrift` 또는 `originDrift`가 있으면 최신 자료를 캡처하고 원격 Figma 입력도 같은 source checksum으로 갱신한다. `verification.json`은 특정 시점의 결과이며 실행 이후 소스가 바뀌지 않았다는 영구 보증이 아니다.

## Figma 대응 패키지

[build-figma-paths.js](build-figma-paths.js)는 부모 작업이 `use_figma`에 전달할 native async body이다. **`20 전체 UX 경우·경로` 페이지만 쓰도록 제한**하며 기존 디자인/관측실 페이지를 보존한다. `set/getPluginData` 없이 native 노드의 `[UXPATH runKey/group]`·`[ID] 제목`으로 안전한 재실행 대상을 찾고, 결과의 모든 생성·수정·제거 ID는 외부 evidence에 보관한다.

[figma-inputs/index.json](figma-inputs/index.json)에 명시한 입력만 사용한다. 현재 overview 1배치, 121개 표면 11배치, 1,462개 고유 조작 61배치다. 각 조작 카드에는 직접 표시/차단, 이벤트 원문, 실제 추적 핸들러의 모든 분기·호출 조건과 결과 표현을 넣었다. 표면 카드가 조작 ID를 참조하므로 같은 정의를 수천 번 복제하지 않는다. 편집 가능한 TextNode와 auto-layout 카드/열/그룹을 생성하며 이미지 한 장으로 평탄화하지 않는다.

입력은 별도 압축 도구 없이 그대로 전달할 수 있도록 실제 JSON 문자열 42,500자와 builder를 합친 code 50,000자 경계를 함께 확인한다. 한 카드가 경계를 넘으면 이전 Figma 입력을 지우기 전에 명시적으로 중단한다. 최초의 압축 길이 기준 56묶음은 실제 게시 과정에서 직접 호출 크기로 나누었고, 최종 생성기도 같은 기준의 73묶음으로 고쳤다. 재포장 전후 1,585개 본문 카드의 ID·제목·본문·출처는 모두 같으며 [재포장 검증](../../work/frontend-opportunities-20261002/figma-input-repack-verification.json)에 증거를 남겼다. 추가 색인 네 카드는 별도 입력으로 유지한다. 입력의 `remoteExecuted:false`는 새 생성 입력 자체가 실행 증거가 아님을 뜻한다. 실제 원격 결과는 아래의 별도 증거로 판단한다.

색은 기존 종이 작업면의 surface·text·borderDecorative·primary 변수를 사용한다. 최초 입력의 primaryHover 대신 실제 게시에 사용한 `VariableID:7:105` primary를 최종 생성기 기본값으로 연결했다. 최초 실행 차이는 검증 입력의 `executionOverrides`에 보존한다. 텍스트 높이는 resize·append·FILL 이후 `HEIGHT`로 설정한다. 문서 카드용 배치이며 기존 웹앱의 실제 UI를 새 디자인으로 덮어쓰는 작업이 아니다.


## 동시 수정에 따른 최종 증분

첫 게시 도중 다른 작업의 소스 변경이 확인되어 기존 문서 전체 391개 파일을 `work/frontend-opportunities-20261002/ux-before-drift/`에 먼저 보존했다. 현재 스냅샷은 위 시각의 소스와 연결한다. 개념 전집의 장면 선택/이전/다음 버튼은 `quiet` 표시로 조정되었으며 기존 이벤트·선택·양끝 차단은 유지된다. 내비게이션에는 천장 조명/원래 자리로 이동, 장소 풍경의 접기·펼치기와 바로가기가 추가되었다. A09는 기존 네 장소와 천장 보조 위치, owner별 풍경 표시 설정, 모션 감소 조건을 구분한다.

[prepare-figma-delta.cjs](prepare-figma-delta.cjs)는 보존한 첫 입력과 현재 입력의 전체 제목·본문·출처를 비교하여 `work/frontend-opportunities-20261002/ux-delta/index.json`을 만든다. 추가 17개·변경 14개·제거 13개·동일 1,554개이며, 기존 색인 4개까지 포함한 목표 지도는 1,589개 카드다. 제거 목록은 코드 오프셋에서 만든 문서 ID이며 앱의 사용자 자료 ID가 아니다. 원격에서 관리 그룹의 실제 카드 ID를 대조한 뒤 적용해야 한다.

`work/frontend-opportunities-20261002/validation-inputs/index.json`은 본문 UTF-16 길이/FNV-1a, 입력 SHA-256, 제목과 body 조각 순서, 전체 ID 지도, 줄바꿈·높이·카드 경계, 실제 링크 목적지를 대조하는 입력이다. 표면은 최대 8개, 조작은 최대 60개로 나누며 첫 유효 참조만 링크하고 자기 참조는 생략한다. 색인 카드 4개의 기존 본문은 121개 ID/제목이 현재 표면과 정확히 일치하는지 확인한 뒤 재사용한다. 이 폴더의 생성 자체는 원격 적용이나 실제 앱의 모든 사용자 경우를 시험했다는 증거가 아니다. 이후 소스 변경은 캡처 시각과 구분해 `verification.json`의 `sourceDrift`로 보고한다.
