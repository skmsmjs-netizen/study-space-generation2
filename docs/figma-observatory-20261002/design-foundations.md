# 천문대 정체성 — Figma 제작용 기초와 공통 부품 대응

2026-10-02 작업 트리에서 채택 기준과 실제 소스를 읽어 만든 제작 패키지다. **최신 정본 v2.0.0 전체를 JSON의 `canonicalBaseline`에 보존**하고, 제작에 바로 쓸 색·치수·상태·부품 대응을 추출했다. 새 숫자·색·원본 천문대 그림을 임의로 만들지 않았다. 자료의 채택, 현재 앱 소비자, Figma 원격 제작·검증은 별도 증거다.

초기 Figma 제한은 사용자 구매 이후 Pro/Full 및 metadata/libraries 성공으로 해제되었다. 이 문서는 로컬 소스 대조 결과이며 실제 원격 변수·부품·폰트·프로토타입 검증은 Figma 제작 담당의 결과에 따른다.

체크섬: **재질 색 28개 = 실내14 + 종이14 / 원본 장면 색16개 / 장면 역할 참조10개 / 타입5개 + 입력 최소값 / 장소4개 / 공통 상태8개 / 부품48개 = 공통UI22 + 천문대20 + 모션5 + 워드마크1**. 이 부품 전수 범위는 아래 지정된 공통·천문대 모듈의 시각 export다. 기능별 화면·보조 패널·모달의 전체 목록은 별도 화면 대응표가 담당한다. 내부 `Field`, hooks, 계산 함수, 데이터 타입은 독립 Figma 부품 수에 섞지 않았다.

원본과 연결되는 모든 값은 [design-foundations.json](./design-foundations.json)에 있다. `canonicalBaseline`은 정본 전체, `materials/metrics/pixelTreatment/motion/spatialWorkspace`는 제작용 동일값 별칭이다. `sourceSnapshot.files`에는 읽은 작업 트리 파일 SHA-256을 남겼다. 병행 변경이 있으므로 HEAD만으로 이 스냅샷이 커밋·배포되었다고 판단하지 않는다.

## 기준의 우선순위

1. [천문대 디자인 정본](../observatory-design-standard.md)의 살아 움직이는 픽셀 천문대 정체성, 사용자 설정·기록 보존, 원본 위젯 전체와 바깥 창틀 요구를 먼저 적용한다.
2. [기계 판독 정본](../observatory-experience-baseline.json)의 `/materials`, `/metrics`, `/spatialWorkspace`, `/pixelTreatment`, `/motion`, `/language`, `/enginePresentation`을 새 Figma 기초로 연결한다. 이 값은 근거를 남겨 조정할 수 있는 공통 기본값이며 표현 기술의 상한이 아니다.
3. [원본 장면 팔레트](../observatory-palette.json)와 실제 렌더러의 도형·비율·시간·장식 반응을 재사용한다. 현재 16색이나 단계별 샘플 수가 영구 제한이라는 뜻은 아니다.
4. 시험·상태·통계의 기능색은 [색 시스템](../color-system.json)과 실제 담당 토큰의 의미를 유지한다. 밤하늘의 장식 색으로 오류·출제 여부·자료 계층을 재정의하지 않는다.
5. 현재 소스는 이름·속성·동작 계약의 근거다. 현재 전역 CSS와 v2 외형이 다른 부분은 명시적으로 구별한다. `/workSurfaceColors`는 수식 화면의 v1.1 호환 소비자를 위한 값이며 최신 재질 팔레트로 잘못 가져오지 않는다.

## 정체성과 네 장소

사용자는 어두운 천문대 안에서 공부하고, 창밖에는 원래의 살아 움직이는 픽셀 천문대가 보이며, 작업은 불투명한 종이 표면에서 한다. 실내의 나와 창밖에서 동료처럼 보이는 천문대의 나는 같은 사용자의 상징적 두 시점이다. 실제 건축 시점에 맞추려고 원래 천문대 건물을 지우거나 새로 그리지 않는다. 다른 계정·AI 동료·숙달 보상을 뜻하지 않는다.

| 방향 | 장소 | 실제 과업 |
|---|---|---|
| front · 0° | 공부 책상 | 오늘의 공부·기록·메모·인출 |
| left · 270° | 자료 책장 | 과목·강의 자료·자료 카드·개념 전집 |
| right · 90° | 탐구 작업대 | 수식 탐색·코딩 연습 |
| back · 180° | 기록·계획 벽 | 통계·일정과 과제·Canvas·그래프뷰·칸반 |

직접 메뉴·검색·딥링크는 기능 이름으로 바로 도달한다. 장소는 사용자의 방향감에 도움을 주며 매번 아바타 걷기·중앙 경유를 요구하지 않는다. 왼쪽에서는 정면 창이 오른쪽 가장자리에, 오른쪽에서는 왼쪽 가장자리에 이어지고, 뒤쪽은 창을 복제하지 않는다. 보조 자료·작은 도구는 하던 과업 곁에서 쓸 수 있다. 브라우저 뒤로가기는 실제 방문 이력이고 뒤쪽 벽 이동은 별도 동작이다. 저장된 초안·사용자 Canvas 배치·필터·스크롤·카메라와 유효한 호출자를 각 기존 소유자가 보존한다.

## 재질 색과 변수

Figma 변수 이름은 `observatory/{interior|paper}/{role}`이다. 의미는 재질에 따라 바뀌며 장식 팔레트와 별도다. 실제 변수를 만들고 연결했는지는 원격 제작 결과로 확인한다.

| 역할 | 실내 interior | 종이 paper |
|---|---|---|
| canvas | #1F1E1B | #E4DCCD |
| surface | #282722 | #E4DCCD |
| subtle | #33312D | #D7CBB4 |
| text | #E8E3D7 | #34312B |
| muted | #B7B0A2 | #5B5448 |
| borderDecorative | #514A42 | #B4A891 |
| borderInteractive | #8B8071 | #796D5D |
| focus | #D7B477 | #725425 |
| selected | #33312D | #D7CBB4 |
| selectedText | #E8E3D7 | #34312B |
| primary | #D7B477 | #554530 |
| primaryHover | #E5C890 | #473924 |
| primaryPressed | #C2A062 | #3B3022 |
| onPrimary | #1F1E1B | #E4DCCD |

장식 장면의 대표 역할은 deepSky #110F29, navySky #1E1B4B, coldBlueAtmosphere #1E3A8A, blueStarlight #80AEF9, orangeBurst #F66623, warmStarlight #FCB67F, whiteCore #FFFFFF, violetNebula #818CF8이다. 추가 장식색은 atmosphereBlue #2B6E9F, warmWindow #E7CE84, nebulaViolet #A995D6이다. `sceneVariables`에는 현재 원본 16색 전체를, `sceneRoleReferences`에는 최신 재질 문서의 10개 역할 참조를 담았다. 시간대 변화는 창밖 하늘·조명에 적용하며 종이·본문·사용자 테마를 자동 교체하지 않는다.

## 글자·간격·형태

현재 제품 본문은 `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`, 읽기 서체는 같은 스택의 별칭, 코드는 `ui-monospace, SFMono-Regular, monospace`다. CSS 시스템 별칭을 Figma의 실제 font family로 그대로 넘기지 않는다. Figma에서 사용할 수 있는 한글 서체와 정확한 굵기를 조회·로드한 뒤 연결하고, 없으면 실제로 제공되는 한글 서체를 명시적 대체로 기록한다. 이 대조 작업은 OS 설치 글꼴을 전수 확인하거나 Figma 폰트 로드를 실행하지 않았다.

동봉된 [assets/brand/InterVariable.ttf](../../assets/brand/InterVariable.ttf)와 [assets/brand/OFL.txt](../../assets/brand/OFL.txt)는 Inter 원본과 SIL Open Font License 1.1이다. 이 패키지는 **워드마크 생성용**이며 한국어 본문이 Inter라는 뜻이 아니다. [assets/brand/wordmark-design.json](../../assets/brand/wordmark-design.json)의 굵기500·광학크기32·자간−0.018em을 이미 경로로 만든 [assets/brand/manseeksong-os.svg](../../assets/brand/manseeksong-os.svg)를 그대로 재사용한다. 워드마크를 다시 타이핑해서 폰트 의존성을 만들지 않는다. 개인 본문 서체 설정은 유지한다.

| 타입 | 16px 루트에서 크기 | 행간 | 굵기 |
|---|---:|---:|---:|
| body | 16px | 165% | 400 |
| label | 15px | 150% | 600 |
| caption | 14px | 160% | 400 |
| heading | 20px | 140% | 600 |
| title | 28px / 좁을 때 24px | 135% | 600 |

입력 글자는 최소16px다. 실제 앱은 rem과 사용자 글자 크기에 따라 늘어나므로 Figma의 16px 루트 시안을 픽셀 고정 높이로 구현하지 않는다. 픽셀 글꼴은 짧은 장식 이름에만 선택적으로 쓰고 긴 한국어·기록·폼에는 강제하지 않는다.

| 항목 | 정본 기본값과 조건 |
|---|---|
| 간격 | 0·4·8·12·16·24·32·48·64px, 별도 그룹18px. 16px 루트 기준. |
| 조작 | 보통 컨트롤 최소48px, 아이콘 타깃 최소44px, 아이콘 그림20px. 긴 한글은 줄바꿈하며 높이 증가. |
| 경계·포커스 | 경계1px, 포커스2px, 표면색 틈3px. 선택 표시와 포커스는 구별. |
| 폭 | 읽기 최대48rem=768px, 대화상자36rem=576px. 컨테이너40rem/64rem에서 조합 조정. |
| 페이지 | 패딩24/좁을 때16px, 구역24px, 관련 요소8px, 입력 항목16px. |
| 종이 | 패딩24/16px, 경계1px, 불투명도1, 회전0°, 글자 아래 질감0, 글자 glow/blur0. |
| 종이 그림자 | x2 y2 blur0 spread0 #00000033. 기본은 연속 문서1장, 뒤로 어긋난 쌓임0장. |
| 픽셀 | 계단2px, 장식 둥근모서리0. button/input/tab/panel/toast0, dialog2px. |
| 떠 있는 표면 | x2 y4 blur0 spread0, 밝은 표면 #302D3233 / 어두운 표면 #00000066. 일반 표면 그림자 없음. |
| 창틀 | 원본 밖8px, 좁을 때4px. 창턱8/4px, 계단2px. 장식 가림0px. |

종이는 긴 글을 읽는 실제 영역에서 늘어나고 스크롤한다. 장식 종이 높이에 맞춰 잘라내거나 수식 뒤에 강제 줄무늬를 깔지 않는다. 자동 컨테이너 조정은 사용자의 Canvas 좌표·카메라·선택 상태를 임의 초기화하지 않는다.

## 원본 위젯 자산 재사용

원본은 [src/ui/pixel-worlds.tsx](../../src/ui/pixel-worlds.tsx)의 `ObservatoryWorld`, 논리 좌표는 [src/ui/observatory-geometry.ts](../../src/ui/observatory-geometry.ts)의 **viewBox `0 -100 960 400`, 비율2.4**다. 전체 원본을 비율대로 축소하고 `meet`로 배치한다. Figma의 Fill/cover crop으로 원본 가장자리를 잘라내지 않는다. 외부 창틀·창턱의 공간을 추가 확보하고 기존 제어와 포인터 범위를 유지한다. 사용자가 명시적으로 카메라를 조작하는 기존 동작은 보존한다.

병행 변경을 마지막으로 다시 읽었을 때 `ObservatoryRoom`은 정본8/4px를 외부 border로 읽고 창턱과 책상에 독립 공간을 확보했다. `StudyLandscapes`는 `meet`이고 포인터는 전체 SVG 경계를 쓴다. 초기 관측의 내부 overlay·aperture·slice는 이 수정으로 대체되었다. 이 문서가 실제 화면·터치·배포 검증까지 수행했다는 뜻은 아니다.

가장 짧은 정적 자산 경로는 빈 합성 자료에서 `buildStudyLandscape`를 호출하고, `observatorySkyAt(observatoryPreviewTime("night"))`, 필요시 `buildObservatoryEvents`, `observatoryPresentation`을 같은 원본에 공급하여 `renderToStaticMarkup`으로 SVG를 얻는 것이다. 실제 사용자 자료를 업로드할 필요가 없다. `thumbnail=true`는 고급 레이어를 제외하므로 전체 장면 참조에는 쓰지 않는다. CSS 클래스·var·color-mix를 Figma SVG가 그대로 처리한다고 가정하지 말고 브라우저에서 계산한 fill/stroke/opacity/stop-color 등을 인라인해야 한다. **SSR만으로 WebGL canvas 픽셀·실제 애니메이션·포인터·설정 제어가 재현되지는 않는다.** 정적 SVG 참조임을 표시한다. 구체 입력과 CSS 의존성은 JSON `widgetAsset.SSR`에 있다.

## 공통 부품 전체 대응

다음22개는 [src/ui/index.tsx](../../src/ui/index.tsx)에서 실제로 export한다. Figma 이름·variant축은 실제 속성/상태 계약에서 뽑은 제작 제안이며 원격 부품이 이미 존재한다는 주장이 아니다. 모든 부품은 해당 표면의 interior/paper 재질을 따른다. 시각적으로 의미 있는 상태만 구성하며 모든 축의 직교곱을 무작정 만들지 않는다. 정적 Card/ListItem에 구현되지 않은 클릭·선택 API를 붙이지 않는다.

| ID · 코드 이름 | Figma 이름 | variant·상태 축 | 역할 |
|---|---|---|---|
| UI01 · [Button](../../src/ui/index.tsx) | Controls/Button | variant: primary/secondary/quiet/danger; state: default/hover/pressed/focus/disabled/busy | 명시적 행동 실행 |
| UI02 · [IconButton](../../src/ui/index.tsx) | Controls/IconButton | variant: quiet/primary/secondary/danger; state: default/hover/pressed/focus/disabled/busy | 이름이 있는 아이콘 행동 |
| UI03 · [Input](../../src/ui/index.tsx) | Fields/Input | state: default/hover/focus/disabled/invalid/readOnly; content: empty/filled/long; helper: none/hint/error | 단일행 원문 입력 |
| UI04 · [Textarea](../../src/ui/index.tsx) | Fields/Textarea | state: default/hover/focus/disabled/invalid/readOnly; content: empty/filled/long; helper: none/hint/error | 긴 자유 글 입력 |
| UI05 · [Select](../../src/ui/index.tsx) | Fields/Select | state: default/hover/focus/disabled/invalid; content: empty/selected/long | 네이티브 선택 |
| UI06 · [Checkbox](../../src/ui/index.tsx) | Controls/Checkbox | value: unchecked/checked/mixed; state: default/hover/focus/disabled | 독립·복수 선택 |
| UI07 · [Radio](../../src/ui/index.tsx) | Controls/Radio | value: unchecked/checked; state: default/hover/focus/disabled | 같은 그룹에서 하나 선택 |
| UI08 · [Tabs](../../src/ui/index.tsx) | Navigation/Tabs | selection: selected/unselected; state: default/hover/focus/disabled | 관련 패널 사이 이동 |
| UI09 · [SegmentedControl](../../src/ui/index.tsx) | Controls/SegmentedControl | selection: selected/unselected; state: default/hover/focus/disabled | 표시 방식 전환 |
| UI10 · [Card](../../src/ui/index.tsx) | Containers/Card | content: default/long/empty | 관련 내용 묶음 |
| UI11 · [ListItem](../../src/ui/index.tsx) | Containers/ListItem | content: default/long/with-actions | 의미 있는 목록 한 행 |
| UI12 · [Modal](../../src/ui/index.tsx) | Overlays/Modal | visibility: closed/open; content: short/long | 집중 대화상자 |
| UI13 · [Sheet](../../src/ui/index.tsx) | Overlays/Sheet | visibility: closed/open; content: short/long | 넓은 보조 작업면 |
| UI14 · [Toast](../../src/ui/index.tsx) | Feedback/Toast | action: message/undo/close/undo-and-close | 일시적 사실 알림 |
| UI15 · [Breadcrumb](../../src/ui/index.tsx) | Navigation/Breadcrumb | item: ancestor-link/ancestor-action/current | 현재 위치와 상위 경로 |
| UI16 · [Search](../../src/ui/index.tsx) | Fields/Search | state: default/focus/disabled/invalid; content: empty/query/long/composing | 검색어 입력과 검색 전달 |
| UI17 · [EmptyState](../../src/ui/index.tsx) | Feedback/EmptyState | scenario: first-use/filtered-empty/unavailable-with-cause | 첫 사용·빈 결과와 가능한 다음 행동 |
| UI18 · [LoadingState](../../src/ui/index.tsx) | Feedback/LoadingState | motion: running/reduced | 진행 중인 실제 요청 |
| UI19 · [ErrorState](../../src/ui/index.tsx) | Feedback/ErrorState | recovery: message-only/retry | 실제 오류와 복구 |
| UI20 · [ScreenBoundary](../../src/ui/index.tsx) | Feedback/ScreenBoundary | state: content/render-error | 화면 렌더 실패 격리 |
| UI21 · [NavigationBar](../../src/ui/navigation-bar.tsx) | Navigation/NavigationBar | orientation: horizontal/vertical; item: current/other | 실제 목적지 직접 이동 |
| UI22 · [ContextMenu](../../src/ui/context-menu.tsx) | Overlays/ContextMenu | visibility: closed/open; item: normal/danger/disabled; state: default/focus | 대상별 보조 명령 |

기본8상태는 default·hover·pressed·focus·disabled·busy·invalid·readOnly다. 각각 적용 가능한 부품에만 연결한다. disabled는 실제 비활성 동작+읽을 수 있는 보조색이며 표면 전체 opacity를 낮추지 않는다. busy는 실제 요청 중일 때 같은 명령의 중복만 막는다. invalid는 기존 오류 의미색과 해당 입력의 설명을 연결한다. readOnly는 내용을 읽고 선택할 수 있게 하며 네이티브 Select의 존재하지 않는 readOnly 기능을 만들지 않는다.

Tabs는 tablist/tabpanel 연결과 방향키 순환을 유지하고 SegmentedControl은 aria-pressed 버튼 그룹이다. Modal/Sheet는 포커스·배경 inert·IME 중 Escape 제외·닫기 뒤 복귀를 유지한다. Search는 한글 조합 중 검색 전달을 미룬다. Toast의 저장 성공은 실제 로컬/서버 응답을 구별한다. ScreenBoundary는 렌더 실패 경계이며 모든 비동기 오류를 잡는다고 표시하지 않는다. 각 부품의 자세한 동작은 JSON `behavior`와 실제 코드에 연결했다.

## 천문대·모션·브랜드 재사용 부품

아래26개를 더해 총48개다. 천문대 하위 레이어는 원본 도형/렌더러 참조로 보존하며 각각을 별도 기능·새 점수·새 사용자 설정으로 승격하지 않는다.

| ID · 코드 이름 | 원본 | 역할·상태 |
|---|---|---|
| SC01 · StudyLandscapes | [src/ui/study-landscapes.tsx](../../src/ui/study-landscapes.tsx) | 풍경 위젯 전체와 정지·표시·설정 저장 · running/paused, system-reduced, visible/offscreen, garden/river/walk visibility, storage-error |
| SC02 · ObservatoryWorld | [src/ui/pixel-worlds.tsx](../../src/ui/pixel-worlds.tsx) | 원본 천문대 SVG 합성 · actual world evolution/time/event; thumbnail omits advanced layer |
| SC03 · ObservatoryRoom | [src/ui/observatory-room.tsx](../../src/ui/observatory-room.tsx) | 전체 위젯 외부 창틀·창턱·책상 배치 · wide8px/compact4px external frame; no crop; current updated consumer |
| SC04 · ObservatoryDesk | [src/ui/observatory-desk.tsx](../../src/ui/observatory-desk.tsx) | 정적인 책상 소품 벡터 · decorative, pointer-events none via desk wrapper |
| SC05 · ObservatoryAdvanced | [src/ui/observatory-advanced.tsx](../../src/ui/observatory-advanced.tsx) | 고급 WebGL/SVG·확대 세부 표현 · visible/hidden; runtime GPU/static SVG fallback; camera LOD independent of learning stage |
| SC06 · ObservatorySkyDetails | [src/ui/observatory-details.tsx](../../src/ui/observatory-details.tsx) | 하늘 세부 표현 · renderer-owned evolution |
| SC07 · ObservatoryStationDetails | [src/ui/observatory-details.tsx](../../src/ui/observatory-details.tsx) | 천문대 건물 세부 표현 · renderer-owned evolution |
| SC08 · ObservatoryTimeSky | [src/ui/observatory-time-sky.tsx](../../src/ui/observatory-time-sky.tsx) | 시간에 따른 장식 하늘 · morning/day/sunset/night/late-night/dawn; no real astronomy claim |
| SC09 · ObservatoryTimeGround | [src/ui/observatory-time-sky.tsx](../../src/ui/observatory-time-sky.tsx) | 시간에 따른 장식 지면 · same time palette; no paper/text theme autochange |
| SC10 · ObservatoryClouds | [src/ui/observatory-atmosphere.tsx](../../src/ui/observatory-atmosphere.tsx) | 픽셀 구름 · renderer-owned density and movement |
| SC11 · ObservatoryGroundDetails | [src/ui/observatory-atmosphere.tsx](../../src/ui/observatory-atmosphere.tsx) | 지면 세부 · decorative |
| SC12 · ObservatoryDomeTiles | [src/ui/observatory-atmosphere.tsx](../../src/ui/observatory-atmosphere.tsx) | 천문대 돔 타일 · original building geometry |
| SC13 · ObservatoryShockwave | [src/ui/observatory-atmosphere.tsx](../../src/ui/observatory-atmosphere.tsx) | 기존 반응 엔진의 파동 표현 · actual engine parameter, not new study score |
| SC14 · ObservatoryStudySky | [src/ui/observatory-reactivity.tsx](../../src/ui/observatory-reactivity.tsx) | 관측된 공부 활동의 하늘 반응 · existing response only |
| SC15 · ObservatoryStudyStation | [src/ui/observatory-reactivity.tsx](../../src/ui/observatory-reactivity.tsx) | 관측된 공부 활동의 천문대 반응 · existing response only |
| SC16 · ObservatoryRadiance | [src/ui/observatory-radiance.tsx](../../src/ui/observatory-radiance.tsx) | 기존 빛 표현 · renderer-owned light |
| SC17 · ObservatoryRadianceGround | [src/ui/observatory-radiance.tsx](../../src/ui/observatory-radiance.tsx) | 지면의 반응광 · renderer-owned light |
| SC18 · ObservatoryEvents | [src/ui/observatory-events.tsx](../../src/ui/observatory-events.tsx) | 시간·세계의 장식 현상 집합 · sky/ground, actual event base/variant/phase/population |
| SC19 · ObservatoryEventVariationSymbol | [src/ui/observatory-event-variations.tsx](../../src/ui/observatory-event-variations.tsx) | 현상별 재사용 SVG 도형 · base variant or recipe; no unbounded instance copy |
| SC20 · ObservatoryEventVariation | [src/ui/observatory-event-variations.tsx](../../src/ui/observatory-event-variations.tsx) | 현상 도형 인스턴스 · variant-derived composition/motion |
| MO01 · BusyDots | [src/ui/motion.tsx](../../src/ui/motion.tsx) | Delayed loading dots · 120ms delay, dot size20, speed1.5; static dots when reduced |
| MO02 · SavedMark | [src/ui/motion.tsx](../../src/ui/motion.tsx) | Acknowledged-save mark · 24×24 SVG, stroke1.75, draw/opacity180ms easeOut; reduced0 |
| MO03 · SelectionBackground | [src/ui/motion.tsx](../../src/ui/motion.tsx) | Shared selection surface · layout transition180ms easeOut; reduced0 |
| MO04 · NoticeEntrance | [src/ui/motion.tsx](../../src/ui/motion.tsx) | Notice appearance · opacity0.9→1,180ms easeOut; reduced0 |
| MO05 · FadeContent | [src/ui/motion.tsx](../../src/ui/motion.tsx) | Content appearance · GSAP opacity0.9→1,180ms power2.out; cleanup and reduced-motion check |
| BR01 · BrandWordmark | [src/ui/brand-wordmark.tsx](../../src/ui/brand-wordmark.tsx) | Existing outlined ManSeekSong OS product wordmark |

정본 모션은 피드백120ms, 전환180ms ease-out, 누를 때1px, reduced-motion0ms다. 작업면 반복 모션·키입력 효과·자동저장 축하·강제 입장 애니메이션은 모두0, 소리는 기본 꺼짐이다. 현재 공통 모션은 위 표처럼180ms fade/draw와 로딩 표시 지연120ms 등 역할별로 구분된다. 천문대의 주기·입자수·이벤트 시간은 기존 엔진 소유이므로 Figma 공통180ms를 하늘의 모든 현상에 강제로 적용하지 않는다. 수동 정지·화면 밖·숨겨진 탭·움직임 줄이기를 존중하고 사용자가 멈춘 장면을 자동 재시작하지 않는다.

## 현재 코드와 채택안의 남은 차이

- **D01 · remaining current-vs-adopted styling difference** — Current global runtime retains indigo/gray role aliases, 4/6/8/12px radii, blurred overlay shadow and disabled opacity .55. Adopted v2 materials/radii/no-global-opacity remain the Figma target; not proof of app migration. 근거: src/ui/tokens.css; src/ui/components.css.
- **D02 · intentional legacy consumer** — Math consumer retains v1.1 workSurfaceColors while sharing current pixelTreatment. Use canonical v2 /materials for new foundations, preserve consumer version distinction. 근거: src/ui/math-observatory-tokens.css; scripts/sync-math-observatory.mjs.
- **D03 · concurrent source correction observed; visual/interaction verification outside this task** — Earlier overlay/aperture/slice inspection was superseded while this task ran. Latest source now reads baseline frame8/4px, reserves border/sill layout space, renders scene with meet, and uses full SVG pointer bounds. Do not repeat old defect as current; code changes do not establish runtime/deployment verification. 근거: src/ui/observatory-room.tsx; src/ui/observatory-room.css; src/ui/study-landscapes.tsx; src/ui/observatory-pointer.ts.
- **D04 · spatial adoption does not prove every route migration** — Four places and continuity are adopted design. Route/page inventory and implementation evidence are owned by the separate mapping task. 근거: docs/observatory-experience-baseline.json#/spatialWorkspace.
- **D05 · remote Figma unverified** — Remote access restored after initial limit. This local source map alone does not establish variable binding, loaded font, editable node or prototype behavior; use separate Figma production evidence. 근거: Parent reported Pro/Full plus successful metadata/libraries.

이 대조 작업은 앱 코드·AGENTS를 수정하지 않았다. 정본·팔레트·실제 export·동봉 서체·동작 계약과 JSON 정합성만 확인했다. 원격 디자인에서 실제 폰트 로드, 변수 연결, 원본 SVG 전체 영역, 긴 한글/빈 상태/오류 상태, 오버레이 포커스와 클릭 동작을 확인한 결과는 제작 담당의 별도 증거로 남긴다.
