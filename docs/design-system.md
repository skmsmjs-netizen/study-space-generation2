# 디자인 시스템 · 2세대 프로토타입

2026-10-01 [작은 도구를 바로 쓸 수 있는 개인 공부 공간](widget-lounge-experience.md)의 다섯 기준을 적용합니다. 핵심 값의 위계·상황에 맞는 작은 과업·입력 전 쓸모·구체적인 안내를 기존 토큰/공통 부품/보존 계약에 연결합니다. 홈의 세 도구 영역에만 얇은 경계를 추가하며 일반 목록과 개인 배치의 일괄 카드화·재배치를 하지 않습니다.

기준: 기존 `theme.css`, `ui-system.css`, `node-highlight.css`, UI 공통 규칙, 1차 발굴 보고서와 2026-09-29 재감사 U01–U08. 새 디자인은 학습 의미와 입력 신뢰를 보존하며 Obsidian의 CSS 중첩을 재현하지 않는다.

## 구현과 적용

2026-10-01 브랜드/중립색과 Primitive·Semantic 연결은 [Vibecoding 컬러 시스템](vibecoding-colors.md)을 따릅니다.

`src/ui/tokens.css`는 값을, `components.css`는 공통 역할을 소유한다. `src/ui/index.tsx`를 가져오면 두 CSS가 함께 적용된다. 화면 CSS는 이 토큰을 사용하고 새로운 palette·radius·shadow를 직접 쓰지 않는다. 한 화면에서만 쓰는 레이아웃은 화면에 남긴다.

| 영역 | 구현 기준 |
| --- | --- |
| 색 | primary/on-primary, secondary, background, surface/inset, text/muted, border/strong, success/warning/danger, focus |
| 계층 | subject 회색, unit 주황 계열, outline 파랑, topic 노랑의 역할 토큰. 이름 자체는 본문색이며 형광펜 배경으로 역할을 보조 |
| 출제 | exam-possible/confirmed 별도 의미 토큰. 주황/빨강을 쓰되 반드시 상태 텍스트 동반. 계층색으로 시험 상태 추론 금지 |
| 서체 | interface/reading/mono 변수. OS 한글 글꼴을 기본으로 하고 사용자가 선택한 reading/interface 글꼴을 덮어쓸 수 있게 분리 |
| 간격 | space-0…8 = 0/4/8/12/16/24/32/48/64px. 기존 18px 구획은 space-group으로 유지 |
| 모서리 | sm/md/lg/overlay = 4/6/8/12px, pill은 원형 역할에만 사용 |
| 깊이 | 일반 영역은 그림자 없음. overlay는 팝업의 층 구분에만 사용. 선택·오류를 그림자만으로 전달하지 않음 |
| 경계 | 기본 1px, 초점 2px와 간격 3px. 오류는 경계와 연결 문구를 함께 표시 |
| 아이콘 | 20px 선형 아이콘, stroke 1.75, 터치 영역 최소 44px. 아이콘만 있는 조작은 label 필수 |
| 동작 | feedback 120ms, transition 180ms. reduced-motion에서 0ms. 숨은 저장 지연을 애니메이션으로 속이지 않음 |
| 레이아웃 | compact 40rem, wide 64rem을 기준 후보로 사용. 창의 실제 가용 폭 우선, iPad Split View를 데스크톱으로 고정하지 않음 |
| 상태 | hover/pressed/focus/disabled/busy/invalid/read-only를 공통 처리. local-saved/pending/synced/conflict/error의 의미와 문구는 저장 계층이 결정 |

## Typography

| 역할 | 크기 | 굵기 | 행간 | 사용 |
| --- | --- | --- | --- | --- |
| Display | 2.25rem | 700 | 1.25 | 제한적인 큰 인사·빈 상태 제목 |
| Title | 1.65rem | 700 | 1.4 | 화면 제목 |
| Heading | 1.2rem | 650 | 1.4 | 구역 제목 |
| Body | 1rem | 400 | 1.65 | 자유 글·본문 |
| Label | .9375rem | 600 | 1.5 | 조작·입력 이름 |
| Caption | .875rem | 400 | 1.6 | 선택 안내·보조 메타 정보 |

편집 입력은 `max(16px, body)`이다. 일반 텍스트 버튼의 영역은 최소 48px이며 긴 한국어는 높이를 늘린다. 작은 표시 글자와 조작 영역은 분리한다. 제목·도움말 크기를 이유로 사용자 원문을 줄이거나 줄 수를 제한하지 않는다.

`ui-hierarchy[data-kind=topic]`만 주제 이름의 기울임을 적용한다. 다른 계층은 정체이며 기본 보통 굵기다. 사용자 본문에는 자동 적용하지 않는다. 도움말의 기울임은 이름 역할과 분리해 필요한 곳에만 적용한다.

## Light/Dark와 사용자 설정

`document.documentElement.dataset.theme`가 light/dark이면 명시 설정을 따르고, 속성이 없으면 OS `prefers-color-scheme`을 따른다. 화면별 색상 반전을 하지 않는다. 기존 사용자 글꼴·간격·색 설정의 실데이터 Import는 후속 Phase이며 지금 자동 이전했다고 주장하지 않는다.

색의 hex와 shadow 숫자는 token 파일에만 둔다. CSS media query에는 custom property를 쓸 수 없어 40rem 조건을 사용하며 같은 토큰의 명시 예외로 문서화한다. 화면의 도형·막대 값 등 데이터 의존 치수는 일반 간격 토큰과 별도다.

## 화면 검증 기준

- Hick: 공부함만 남길 때 날짜·TRACE·난이도·본문을 필수 판단으로 늘리지 않는다.
- Fitts: 핵심 조작 48px, 아이콘 44px을 출발점으로 실제 화면과 터치 기기에서 확인한다.
- Jakob: 기본 HTML 입력·버튼·select의 키보드 관습, 예측 가능한 뒤로가기와 초점 복귀를 사용한다.
- Proximity: 이름·상위 경로·해당 항목 조작을 함께 둔다.
- Von Restorff: 화면마다 핵심 행동의 우선순위가 보이고 오류·시험 상태와 구별된다.

이 문서의 토큰 정의는 접근성 전체 준수나 물리기기 검증의 증거가 아니다. 컴포넌트 자동검사, 실제 브라우저, 물리기기 한글 IME, Split View·회전·키보드, 동기화 검증을 각각 기록한다.

## 2026-10-01 실제 웹앱의 공통 표현 적용

사용자 요청에 따라 채택한 기준을 공통 토큰·컴포넌트와 홈에 적용했습니다. 밝은 화면은 흰 본문과 중성 사이드바, 어두운 화면은 중성 짙은 바탕을 사용합니다. 일반 Card는 투명한 면·구분선·여백으로 표현하고 홈의 큰 색 안내 면과 세로 버튼 묶음을 줄였습니다. 과목·검색·기록·추천·통계도 같은 Card 계약을 사용합니다. 메모의 3:2 종이와 Canvas 카드 경계·관계선, 모달의 층 구분은 역할에 맞게 유지합니다.

기본 터치 영역44/48px·입력16px·포커스 표시·모션 감소·서체/테마 설정 경로를 유지합니다. 출제 가능성/확정·계층·오류 의미색은 바꾸지 않습니다. 초록 펜은 브랜드 primary와 분리한 color-memo-green으로 기존 밝게/어둡게 색을 그대로 사용합니다. 저장 키·ID·원문·선 좌표·필압·수정 이력·Canvas 배치·입력 동작은 바꾸지 않습니다.

이는 기존 핵심 흐름의 실제 화면에 공통 표현을 반영한 결과입니다. 56개 정의의 모든 상태·물리기기·서버/Sync·실사용 만족까지 완료했다는 판정은 아닙니다. 이번 브라우저·자동검사·배포 범위는 최신 인계의 같은 날짜 항목을 따릅니다.


## 2026-10-01 토큰 준수 검사와 기존 표현 보존

첨부 `436.heic` 등 9장의 Color·Typography·Component·State·Spacing·Radius·Shadow 원칙은 이 문서의 공통 역할과 부품으로 적용합니다. 사진의 색상값이나 도구 화면을 그대로 복제하지 않습니다. `npm run check:design`은 `src/**/*.css`를 읽기 전용으로 확인하고, 위반의 파일·줄·속성을 출력하며 오류 시 종료 코드 1을 반환합니다. 개발 시작·앱 빌드·lint에 연결되어 있고 `npm run test:design`은 허용/거부 경계를 검증합니다. `npm test`는 이 검사기의 회귀를 먼저 실행합니다. 기존 Pages workflow의 npm test·npm run build가 두 검사를 실행합니다.

- 확인: 색상 직접 값·색 함수, 글꼴/크기/굵기/행간/자간 직접 값, 절대 간격·모서리·그림자 직접 값, 정의되지 않은 디자인 토큰, 변수 fallback 안의 직접 값. 지역 별칭으로 우회한 값도 소비 속성의 역할을 따라 확인합니다. 공통 `src/ui/tokens.css`는 실제 값의 정의를 소유합니다.
- 허용: 0·0px, inherit/normal/none/auto/transparent/currentColor 등 기본 CSS 의미, 토큰의 계산식·단위 없는 배율, 비율 간격, env 안전 영역, 이미지 URL, 미디어 조건. 폭·높이·위치·변환·격자 치수·SVG stroke-width·기존 경계 두께 등 도형/레이아웃 값은 이 좁은 검사의 대상이 아닙니다. 강제 색상 모드의 시스템 색은 그 미디어 조건 안에서 허용합니다. 런타임 목차 깊이 `--outline-indent`는 디자인 토큰으로 오인하지 않습니다.
- 국소 예외: 필요할 때 바로 앞에 `/* design-token-exception: padding -- 외부 임베드가 요구하는 고정 여백 */`처럼 **다음 한 선언의 속성과 구체적인 이유**를 적습니다. 전체 파일의 검사를 끄지 않으며, 예외로 토큰 오타나 파싱 오류를 숨기지 않습니다. 예외 수는 결과에 표시됩니다. 새 토큰·예외의 필요성과 역할 적합성은 작업자가 판단합니다.
- 한계: TSX 인라인 스타일·외부 라이브러리의 CSS는 검사하지 않습니다. 토큰이 실제 선택자/테마에서 제공되는지, 같은 역할의 부품을 재사용했는지, 상태의 실제 의미·접근성·저장 신뢰·시각적 만족은 정적 검사만으로 보장하지 않습니다. 관련 공통 부품과 실제 앱에서 확인합니다.

공개 화면의 기존 크기를 보존하기 위해 metric(통계 숫자 `1.5rem`), chart(차트 글자 `12px`), title/brand tracking(`-.035em`/`.12em`)을 역할 토큰으로 옮겼습니다. 개인 진입의 16/24/48px 간격, 시험 타이머·주제 카드의 글자 역할은 같은 값의 기존 토큰을 참조합니다. 시험 화면의 compact 폭은 기존 fallback과 같은 40rem입니다. 메모 오류 문구의 존재하지 않던 `--color-error`는 기존 오류 의미색 `--color-danger`로 수정합니다. 저장·ID·초안·원문·배치를 바꾸지 않습니다. 다른 개발 작업의 자료·그래프·수식 기능과 색상 체계 변경은 이번 공개 배포에 포함하지 않습니다.

도구 선택은 [PostCSS](https://github.com/postcss/postcss/blob/main/docs/api.md)와 [postcss-value-parser](https://github.com/postcss/postcss-value-parser)의 공개 파싱 API를 재사용하고, **프로젝트의 토큰 정책만 작은 검사로 구현**했습니다. 기존 Vite의 PostCSS 8.5.28을 직접 개발 의존성으로 명시하고 값 파서 4.2.0을 추가합니다. [Stylelint 기본 규칙](https://stylelint.io/user-guide/rules/)과 [declaration-strict-value](https://github.com/AndyOGo/stylelint-declaration-strict-value)는 일반 CSS 검사/변수 사용 강제 후보로 확인했습니다. 이번에는 이미 있는 파서를 이용하여 토큰 정의·fallback·지역 별칭·선언별 예외를 하나의 제한된 검사로 다루고, 기존 공개 앱의 Vitest·TypeScript·Vite와 Pages 배포 경로를 유지합니다. 이 자체 정책을 공인 표준이나 전체 CSS 검증으로 표현하지 않습니다. 더 넓은 CSS 문법·관례 검사 필요가 생기면 Stylelint 도입을 해당 요구에서 다시 판단합니다.

## 공통 모션과 재생 위젯

[모션 시스템](motion-system-20261001.md)에 따라 실제 busy의 장식 점, acknowledgment 뒤 저장 표시, Tabs 선택 배경, Toast/빈 상태/Modal opacity를 제공한다. 위젯은 늦게 불러오며 OS/app 모션 감소·화면 가시성·일시정지를 따른다. 입력·초점·원장 의미를 바꾸지 않는다.
