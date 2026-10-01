# Vibecoding 컬러 시스템

브랜드 원색은 #4F46E6입니다. Primitive50개와 Semantic Light81개는 `color-system.json`에 정의하고, `node scripts/sync-color-tokens.mjs`로 공통 CSS 변수에 생성합니다. Semantic은 원시 값 대신 Primitive 변수를 참조합니다. 화면은 기존 앱 역할과 공통 컴포넌트를 통해 이를 사용합니다.

흰 본문·중성 회색 바탕·회색 선택 영역을 기본으로 하며 주요 행동/체크/포커스에 브랜드를 사용합니다. 버튼의 기본/hover/pressed, 입력 힌트/읽기 전용/오류, 탭·메뉴·주제 선택을 연결합니다. Gray200 장식선은 의미 경계의 유일한 표시로 사용하지 않습니다. 오류 입력 경계는 Error600 solid를 사용합니다. 주황=출제 가능성·빨강=출제 확정과 기존 다크 팔레트·서체·간격·데이터를 유지합니다.

Figma: [Color Foundations](https://www.figma.com/design/5RKglEvhscGpWAz5T6qLGQ?node-id=12-2). Figma와 원본JSON 사이의 갱신은 명시적으로 수행하며 실시간 동기화라고 표현하지 않습니다. 기존 Figma Dark81개와 앱의 현재 다크 팔레트는 별개입니다.

검증 기준은 [WCAG 글자 대비](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [비텍스트 대비](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html), [색 외의 상태 표시](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)입니다. 대비 통과는 미감의 최적성이나 전체 접근성 인증이 아닙니다. 기기 크기·브라우저 엔진 재현과 물리 기기·한글 IME·장기 사용은 구별합니다.

환경 회귀는 `tools/color-tests/`에서 실제 앱과 공통 UI를 Chromium·Firefox·WebKit, 휴대폰·태블릿·320px 폭 및 명시/기기 테마로 확인합니다. 원문 입력·크기 변경·저장·재접속과 대비/가로 넘침을 검사합니다. 별도 GitHub Actions의 Linux 환경에서도 실행하며 Firefox의 로컬 macOS 실행 제한과 구별합니다. 그래프 라이브러리 출처 링크는 공통 surface/muted를 사용해 대비를 유지합니다.


## 2026-10-01 접근성 검증 범위 확대

컬러 대비 외에 WCAG2 A/AA·2.1 A/AA 태그의 자동 규칙을 같은 환경 회귀에 연결했습니다. 좁은 화면에서 공부 범위 label을 display:none으로 지우던 부분은 시각적으로만 숨기는 기존 로컬 수정을 재사용해 접근 가능한 이름을 유지합니다. 조작 가능한 홈/통계 차트 SVG는 image 대신 이름 있는 group으로 표시해 내부 근거 버튼을 접근성 구조에 남깁니다. 기존 값/원문/저장/배치/색은 보존합니다. 자동 규칙·키보드 이동/이름/상태 검사와 실제 VoiceOver 읽기·한글 IME·물리 기기·Sync 검증은 별도입니다.
