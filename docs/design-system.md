# 디자인 시스템 · 2세대 프로토타입

기준: 기존 `theme.css`, `ui-system.css`, `node-highlight.css`, UI 공통 규칙, 1차 발굴 보고서와 2026-09-29 재감사 U01–U08. 새 디자인은 학습 의미와 입력 신뢰를 보존하며 Obsidian의 CSS 중첩을 재현하지 않는다.

## 구현과 적용

`src/ui/tokens.css`는 값을, `components.css`는 공통 역할을 소유한다. `src/ui/index.tsx`를 가져오면 두 CSS가 함께 적용된다. 화면 CSS는 이 토큰을 사용하고 새로운 palette·radius·shadow를 직접 쓰지 않는다. 한 화면에서만 쓰는 레이아웃은 화면에 남긴다.

| 영역 | 구현 기준 |
| --- | --- |
| 색 | primary/on-primary, secondary, background, surface/inset, text/muted, border/strong, success/warning/danger, focus |
| 계층 | subject 회색, unit 주황 계열, outline 파랑, topic 노랑의 역할 토큰. 이름 자체는 본문색이며 형광펜 배경으로 역할을 보조 |
| 출제 | exam-possible/confirmed 별도 의미 토큰. 주황/빨강을 쓰되 반드시 상태 텍스트 동반. 계층색으로 시험 상태 추론 금지 |
| 서체 | interface/reading/mono 변수. OS 한글 글꼴을 기본으로 하고 사용자가 선택한 reading/interface 글꼴을 덮어쓸 수 있게 분리 |
| 간격 | space-0…8 = 0/4/8/12/16/24/32/48/64px. 기존 18px 구획은 space-group으로 유지 |
| 모서리 | sm/md/lg/overlay = 10/14/20/28px, pill은 원형 역할에만 사용 |
| 깊이 | none/raised/overlay 세 단계. 선택·오류를 그림자만으로 전달하지 않음 |
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
| Caption | .8125rem | 400 | 1.6 | 선택 안내·보조 메타 정보 |

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
