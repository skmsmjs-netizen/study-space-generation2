# 디자인 시스템 후속 수정 · 남은 검사 처리

2026-10-01 사용자 “어 다 작업시작해”에 따라 앞선 [전수 대조](design-system-verification-20261001.md)의 정적 오류·접근성 자동 판단 보류·Firefox 실행 제한과 관련 회귀를 처리합니다. 게시물에서 채택한 11개 영역과 기존 보존 계약을 그대로 적용합니다. 이번 작업의 증거는 `work/design-system-remediation-20261001/`에 남깁니다.

## 판단 기준과 실제 수정

React의 [Effect 의존성 정리](https://react.dev/learn/removing-effect-dependencies)와 [useEffectEvent](https://react.dev/reference/react/useEffectEvent)를 적용했습니다. 구독·파일·계정·선택 항목을 바꾸는 값은 실제 재실행 조건으로 유지하고, 같은 구독 안에서 읽을 최신 편집값/콜백은 EffectEvent로 읽습니다. 검사기를 잠재우려고 모든 객체나 저장 콜백을 의존성에 넣지 않습니다. 코드 편집기는 처음 만든 인스턴스를 유지하고 기존 개별 갱신 경로로 값·언어·읽기 권한을 바꿉니다. 따라서 한글 입력 때 커서/선택/Undo가 다시 만들어지지 않습니다. retry·route·선택 변경처럼 의도적인 재실행 조건은 [Biome가 지원하는 해당 의존성 예외](https://biomejs.dev/linter/rules/use-exhaustive-dependencies/javascript/)와 이유를 선언 옆에 남깁니다.

목록의 원래 ID는 그대로 사용합니다. ID가 없는 읽기 전용 진단/문장/표에는 `occurrenceRows`의 내용+동일 내용 발생 순번을 보기용 키로 사용해 같은 원문이 반복돼도 없애거나 합치지 않습니다. 편집 가능한 고정 입력 칸과 수학 벡터 성분은 값이 바뀌어도 편집 상태를 유지하도록 고정 칸 정체성을 유지합니다. 저장 ID/키·원문·이력은 이 보기용 키로 치환하지 않습니다. forEach의 불필요한 반환값, void 검증 경로의 반환, 버튼 type, 실제 화면을 여는 조작의 button 의미도 정리했습니다. C0 문자 검사/ANSI 표시/Anki 필드 구분처럼 필요한 바이트 규칙은 동작을 유지하고 적용 이유를 기록했습니다.

자료 카드의 답 표시와 편집창 초기화를 분리합니다. 답 표시/입력은 답 편집창을 닫지 않으며, 실제 결과/카드/탭 변경에만 임시 편집창을 초기화합니다. 복습 정규화·Canvas 구독·PDF 배경 갱신도 타이핑이나 선 하나의 추가를 새 문서/새 선택으로 다루지 않습니다. 서버 권한·민석 전용AI 조건·원장 계산을 변경하지 않습니다.

자동 ARIA 판단에서 실제 이름이 붙은 generic div에 역할이 없음을 확인했습니다. 이름 있는 공통 Card는 기본 group, React Flow가 실제로 만든 조절 버튼 구역도 group으로 연결했습니다. React Flow Controls는 role 속성을 전달하지 않으므로 공통 FlowControls가 마운트된 실제 구역에 역할을 설정하며 기존 버튼/줌/키보드/배치를 유지합니다. GeoGebra가 생성한 appletParameters도 초기화 후 group으로 연결합니다. 단순히 자동 보류를 숨기거나 필요한 이름을 지우지 않습니다.

macOS27의 Firefox 프로필 오류는 [Playwright 공식 저장소의 동일 환경 보고](https://github.com/microsoft/playwright/issues/42768)를 확인하고 실제 이 Mac에서 별도 앱 정체성으로 실행해 검증했습니다. `prepare-firefox.mjs`는 필요한 OS에서만 번들 복사본과 전용 launcher를 작업 폴더에 만듭니다. 원래 Firefox/Playwright 번들, 개인 프로필·전역 설정을 바꾸지 않습니다. Linux CI와 다른 환경은 기본 실행기를 사용합니다. 등록된 Storybook 예시는 각각 새 문맥에서 검사하여 특정 예시/테마의 실패를 바로 식별하고 편집기/Worker 누적 상태를 분리합니다. 실제 작업실 index와 검사 index가 같은지도 확인합니다.

## Canvas의 실제 키보드 이동

초점을 줄 수 있는 이름 있는 section만으로는 WebKit의 변환된 카드 안에서 본문이 이동하지 않았습니다. 키 전달 차단만으로도 해결되지 않았으며 그 실패를 로그에 남겼습니다. 기존 수식 영역에서 사용하는 본문 이동 방식을 재사용해 방향키·PageUp/PageDown·Home/End·Space를 해당 본문의 scrollTop/scrollLeft로 연결했습니다. 본문 자체에 초점이 있을 때만 처리하고 내부 입력·한글 조합·Ctrl/Meta/Alt와 Shift 선택 조작은 보존합니다. 실제 카드 이동/배치·원문·저장값은 바꾸지 않습니다. [W3C 키보드 해설](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)

회귀는 격리된 페이지 DOM에만 긴 문단을 추가하여 실제 키 입력으로 이동을 확인합니다. 방향키/End/Home/PageDown 전후 모든 카드 위치와 원래 저장 문자열이 같은지도 확인합니다. 다섯 WebKit 모사에서 5건과 같은 Canvas의 두 테마 검사10건, 합계15건을 최종 코드로 통과했습니다. 실제 화면 검토에서는 두 테마 모두 본문이26px 이동하고 같은 section에 초점이 남았습니다.

## 완료 확인

2026-10-01 마지막 확인입니다. 고정 사본과 병행 변경이 있는 현재 소스를 구별합니다. 표의 화면/과업/부품/전체 단위 검사는 고정 사본의 결과이며, 현재 소스에는 아래 별도 타입/정적/관련 회귀를 수행했습니다.

| 확인 | 결과 | 근거 |
| --- | --- | --- |
| 최종 앱 빌드 | 통과. CSS39파일 오류0·기존 예외1, TypeScript/Vite 성공 | build-scroll-fallback-valid.log |
| 현재 앱 타입 | 통과 | current-source-type-corrected-final.log |
| 현재 전체 정적 검사 | 480파일 오류0·경고778·정보78. 경고가 없는 결과는 아님 | current-source-lint-corrected-final.json |
| 현재 CSS 토큰 | 40파일 오류0·기존 예외1 | current-design-tokens-final.log |
| 도구 타입/정적/포맷 | 현재/고정 사본 타입 통과, 현재67파일 정적 오류0·경고126·정보17, 포맷 통과 | current-tools-type-final.log, current-tools-lint-final.json, current-format-tools-corrected-final.log |
| 등록 부품 전부 | Chromium/Firefox/WebKit114/114 통과. 등록16예시 ×2테마 ×3엔진96화면 조합과 기존 조작18건 | workshop-individual.json |
| 화면/관련 과업 | 350/350 통과, 건너뜀/불안정 재시도0. 30경로 ×2테마 ×5모사300건 + 편집/저장/복귀50건 | device-runs/run-t9XHOH/results.json |
| 마지막 Canvas 변경 | 15/15 통과. 두 테마10건·실제 긴 본문 키 이동/원문·배치 보존5건 | device-runs/run-1Jec9z/results.json |
| 전체 Vitest | 190파일 중189통과·기본 제외 성능파일1. 테스트1040개 중1039통과·실패0·성능1기본 제외. 마지막 실행249.99초 | units-quiet-final.json, units-quiet-final.log |
| 별도 성능 확인 | 기본 제외1건을 명시 실행해 통과. 합성 기록/공부 사건/수정 이력 각1만, 직렬화19,368,394바이트 | domain-benchmark.log |
| npm test 사전 검사 | 디자인 토큰27·검사 사본 보존3·개념 설계9, 모두 통과 | units-quiet-final.log |
| 현재 소스의 직접 관련 회귀 | Canvas 저장/ACK·새 관측 화면·도해 원문/이름11/11 통과 | current-affected-tests-final.json |
| 자동 접근성 | 300개 화면에서 위반0, 대비 외 판단 보류0 | contrast-final-review.json |
| 대비 별도 확인 | 자동 대비 보류47개 화면 조건의 대상898건 전부 CSS 기준 충족. 최소4.805292774861394:1 | contrast-final-review.json |
| 렌더링 검토 | 홈/수식/Canvas/그래프 ×두 테마8구역 실제 그림과 글자/SVG opacity 확인 | visual-proof/, visual-review.json |

전체 화면 검사는 기본 크기와125% 글자의 가로 넘침, 최소 입력 글자, 실제 보이는 글꼴의 로딩을 확인합니다. 자료 카드 편집, 수식 보기 저장/재열기, 복습 답과 평가 기준의 구별, 보드 긴 글, Canvas/그래프의 끌기 없는 조작, 시험 중단/초안 복귀, 과목 검색 맥락, 메모 내보내기/다시 열기, 인출 답/되돌리기를 포함합니다. 30경로의 인벤토리 전체와 모든 URL 매개변수/자료/펼침 조합은 구별합니다. 다섯 모사는 iPhone17Pro 세로/가로·iPadPro13 세로/가로/반창입니다.

접근성 자동 판단 보류를 숨기지 않았습니다. 일반 글자4.5:1/큰 글자3:1은 [WCAG 대비 해설](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)을 적용했습니다. SVG의 fill/부모 배경/겹친 edge label 배경/알파 값을 계산하고 그림/opacity가 남는지 확인했습니다. 단색 배경의 CSS 대상898건은 모두 통과했고 대표8구역의 렌더링을 별도로 검토했습니다. 자동 도구에는 대비 incomplete가47조건에 계속 남으며 이는 별도 계산/검토와 다른 결과입니다. 898개의 서로 다른 그림을 모두 눈으로 검토하거나 전체 WCAG 적합성을 인증한 결과는 아닙니다. 개인 Canvas25%·그래프60%의 저장된 개요 보기는 유지하고, 개요 글자를 상세 보기의 가독성 증거로 사용하지 않습니다.

## 실패 이력과 검사 유지

첫 전체1040검사는1025통과·11실패·4보류였습니다. Canvas 대역에 필요한 SelectionMode가 없던 오류, 시험 자료가 공유 예시 namespace를 사용하던 소유자 분리 오류를 고쳤습니다. 관련39/39, 마이그레이션3/3과 Node9/9를 확인한 뒤 최종 전체 실행에서도 실패0을 확인했습니다. Node 전용 파일은 [Node ESM의 JSON import 속성](https://nodejs.org/api/esm.html#import-attributes)과 원래 Node 실행기를 적용해 npm test pretest에 연결했습니다. Vitest에서 제외한 정확한 파일을 실제 Node 실행으로 검사하므로 시험을 빼거나 버리지 않았습니다. 기본 제한 시간을 늘려 통과시키지 않았습니다.

브라우저와 겹친 재실행의 부하/시간초과는 해당 소유 실행만 중단하고 units-final-all.log 및 unit-repeat-interruption.json에 남겼습니다. 이후 브라우저를 종료한 상태에서 전체 실행1039통과를 얻었습니다. 최초 실패, 개별 재검사, 중단과 마지막 전체 통과를 하나의 성공 실행으로 합치지 않습니다. 앞선 Firefox22/24의 시간초과, 초점/키 전달 차단만 적용한 Canvas 실패, 수식 로딩 중 그림, 포맷38파일 및 후속3파일 보완 이력도 보존했습니다.

CI의 기존 format:tools:check도 확인했습니다. 도구/검사 코드38파일을 기존 Prettier로 정리하고 기능·조건·검사 수는 유지했습니다. 저장 전 내용이 바뀐 경우 쓰지 않는 비교를 두었고, 마지막3파일은 CLI로 재정리해 현재/고정 사본의 전체 포맷 검사 통과를 확인했습니다. 포맷만 바뀐 코드의 기존 브라우저 결과를 새 실행으로 표현하지 않습니다. 남은 경고778·정보78은 목록에 보존하며 오류0/제품 전체 완료와 구별합니다.

## 버전과 보존

검증 사본은 `/private/tmp/manseeksong-remediation-s1kyuwag`입니다. 원본 앱/개인자료 대신 격리된 예시를 사용합니다. 병행 작업은 계속 보존하고 전체 dirty 저장소를 일괄 커밋·배포하지 않습니다. 소스와 설치 패키지의 연결 준비 중단, 중간 실패, 최종 고정 검사와 뒤의 병행 변경을 같은 통과로 합치지 않습니다. 검증본 652개 파일의 소스 해시는 `delivery-source-manifest.json`, 최종 차이는 `delivery-source-drift.json`으로 기록합니다. 마지막 대조에서 병행 수정36파일과 추가16파일이 있었으며 그 기능 전체를 이 사본의 통과로 승격하지 않습니다. 현재480파일의 오류0·타입·관련11검사와 별도로 보고합니다. 기기 검사기는 각 실행의 고정 빌드와 결과를 함께 보관합니다. 전체 요약은 `verification-summary.json`입니다. 운영 배포/실계정/물리기기·IME/장기Sync/학습 효과는 이번 로컬 검사 결과와 구별합니다.
