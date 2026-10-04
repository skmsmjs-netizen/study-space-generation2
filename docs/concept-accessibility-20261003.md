# 개념 전집 접근성 보수와 실제 확인 범위

2026-10-03 사용자 「해」에 따른 잔여 작업이다. 개념 전집의 1,168개 원문·설명·1,851개 장면을 보존하고, 공통 읽기와 확대 도해의 접근성 위험을 확인했다. `study-review`와 프로젝트 MI09/WCAG 기준을 적용했다. 물리 기기나 실제 VoiceOver 실행을 자동 검사로 대신했다고 보고하지 않는다.

정본 증거는 `work/concept-completion-20261003/accessibility/verification.json`이다. 초기 불변 대상은 공개 commit `6318aba05e2d6d0b8d43fbe9ce5cc607559d42f7`의 실제 CI 산출물이며, 보수 후에는 같은 소스에서 아래 공통 Modal 두 파일만 변경한 별도 사본의 생산 빌드를 사용했다. 다른 과목·병행 소스·공유 Git index·개인 원장에는 쓰지 않았다. 원격 통합·새 공개 배포 결과는 담당 배포 기록과 별도로 연결한다.

## 최신 병행 변경을 포함한 실제 배포 후보 확인

최신 공개 `1e004a5` 위에 이 보수 두 파일만 통합한 실제 후보 **595c7cb6a9385be8307323f8f0804837c9b4ec0e**도 따로 확인했다. `/Users/manseeksong/.cache/concept-modal-pages-20261003/dist`의 실제 생산 산출물을 그대로 `http://127.0.0.1:6154/`에서 제공했다. **기존 10개 위험 사례가 다섯 환경 모두 첫 시도 통과**했다(64.0초·재시도 0). axe 25번의 판정된 위반 0과 환경별 36번 모달 Tab 순환의 탈출 0을 재확인했다. index·reader JS·읽기 CSS·전집 JS의 HTTP 응답은 해당 dist와 SHA 동일이었다. 제품 코드 수정·원장 쓰기·CI 취소는 0이다.

고유 정본은 `work/concept-completion-20261003/accessibility/release-candidate-verification.json`이며 `results-release-candidate-root-base.json`과 `run-release-candidate-root-base.log`를 함께 보존한다. 이 확인은 실제 595c7cb 후보의 최신 병행 변경을 포함한다. Pages CI `37105218650`의 배포 완료나 공개 화면 검증은 해당 담당 기록에서 실제 결과를 연결한다.

최초 6153 확인은 root base(`/`)로 빌드한 dist를 `/study-space-generation2/` preview로 제공해 `/assets/*`가 404가 됐다. 이는 검증 서버 base를 잘못 지정한 오류이며 제품 결함으로 세지 않는다. 해당 실패·HTTP 진단·중단 보고서를 보존하고 dist를 변경하지 않은 채 올바른 root 주소로 확인했다. 원 보고서의 오래된 `immutableCommit=6318aba` fixture 라벨은 초기 전집 기준이고 실제 대상은 위 후보임을 새 manifest에 명시했다. 향후 검사에서는 `bookBaselineCommit`과 `CONCEPT_ACCESSIBILITY_COMMIT`의 실제 대상을 구별한다.

## 병행 모션 변경의 CI 실패 — 공개 확인 대기

다른 채팅의 물리 보수 `71fef95`가 595의 조상·보수를 유지했고, 이어 모션/화학 `c624b5ec4b086bd6df40ee77cd4cdd735819c2c5`가 이를 포함했다. 앞선 Pages `37105218650`/`37105323970`은 병행 배포 후보로 대체 취소됐다. 이를 이 작업의 검사 통과로 세지 않는다. c624의 **Pages 37106291600은 build의 단위 검사 4개 실패로 종료되어 새 공개 배포가 이뤄지지 않았다.** 우리 Modal의 `available()`·`onKeyDown` 두 보수 구간은 c624에서도 595와 바이트 동일이다.

| 실패 위치·테스트 | 기대와 실제 | 관련 호출 경로 |
| --- | --- | --- |
| `math-explorer.test.tsx:103` — `keeps question, formula, conditions and source available in both views and preserves unfinished numeric input on return` | 닫은 뒤 `a 값` 하나의 원문 `1+`를 확인하려 했으나 같은 라벨 입력 2개가 조회됨(둘 다 `1+`). | `math-templates.tsx:724`의 작은 exploration 재등장 + `Modal`의 닫힘 중 이전 children 유지. 라벨 조회는 inert/숨긴 입력도 포함한다. |
| `math-explorer.test.tsx:142` — `keeps out-of-range numbers visibly uncommitted across view changes and saves only corrected values` | 닫은 뒤 범위 밖 원문 `99` 하나를 확인하려 했으나 같은 라벨 입력 2개가 조회됨(둘 다 `99`). | 위와 같은 닫힘 모션·작은 읽기 전환. 중복 조회 자체를 원문 수치 손실로 해석하지 않는다. |
| `outline-table-editor.test.tsx:74` — `ignores a removed cell and never applies its position to the next row` | 삭제한 셀의 위치 힌트를 무시하고 새 창 scrollTop=0을 기대했으나 **600**. | `useVisualPresence` 동안 dialog DOM이 남고 빠르게 다시 열린다. `modal-context.ts`의 없는 셀 분기는 위치 힌트만 지우며 재사용 DOM의 scrollTop을 0으로 바꾸지 않는다. |
| `outline-table-editor.test.tsx:85` — `does not carry a finished table position into newly generated row IDs` | 새 행 ID의 입력·스크롤 초기 상태에서 scrollTop=0을 기대했으나 **600**. | 같은 dialog DOM 재사용과 새 대상/무효 위치의 복귀 처리. |

원인은 `interaction-motion.ts:11–22`의 닫힘 시 `present` 지연과 `index.tsx`의 `exitingView.children` 유지, `math-templates.tsx`의 작은 읽기 재표시, `modal-context.ts:50–66`의 무효 대상 분기를 실제로 읽어 연결했다. 닫힌 창은 inert/aria-hidden이라 라벨 중복 실패와 실제 잘못된 스크롤 복귀를 구별한다. CI의 실제 실패와 코드 경로를 근거로 하며 실제 사용자 입력 손실이나 모든 브라우저 재현을 추가로 주장하지 않는다.

실패 정본 `ci-c624-failure-analysis.json`, 원 로그 `ci-c624-build-failure.log`, 최신 보수 동일성 `latest-modal-follow.json`에 기록했다. 단위 결과는 1,374통과·4실패·1생략이다. 부모가 별도 모션 담당의 이 네 실패 보수 진행을 확인했으므로 **중복 제품 편집·전체 자동 재실행·워크플로우 우회·새 공개 시도는 하지 않았다.** 다음 최신 성공 CI를 기다린 뒤 실제 공개 주소의 열 가지 위험 검사를 이어 확인한다.

다음 보수 `c5ea248bd27b065e24552496190888513cc94546`의 Pages `37107267649`에서는 **단위 235파일·1,378개 통과/1개 생략**으로 앞선 네 실패가 해결됐다. 이후 `npm run build`의 타입 검사에서 `math-explorer.test.tsx:103/:142/:143`의 `getByRole` 옵션 `exact`가 `ByRoleOptions`에 없다는 TS2769 세 건으로 중단됐다. 타입·생산 빌드·5기기·배포 성공으로 승격하지 않는다. `ci-c5ea-build-failure.log`와 `ci-c5ea-failure-analysis.json`에 원인과 수행 경계를 보존하고 같은 모션 담당의 보수와 다음 CI를 기다린다.

다음 `da4ed57d`의 Pages `37107574142`는 build를 통과했지만 iPhone 가로 환경 job `111159663451`에서 **223통과·2실패·3생략**이었다. `chemistry-observations.pw.ts:45`는 오류 배열 0을 기대했으나 GeoGebra `15.cache.js`의 access control 오류를 받았다. `partial-batch.pw.ts:116`은 합성 서버의 부분 저장 실패 후 재시도 alert를 기대했으나 5초 동안 해당 alert가 없었다. 둘 다 CI의 자동 재시도에서도 실패했다. 실제 서버/사용자 자료 손실로 단정하지 않으며 `ci-da4-landscape-failure.log`와 `ci-da4-landscape-failure-analysis.json`에 기대·실제·확인 범위를 보존했다. 이 job의 개념 읽기·개념 전집·modal keyboard 검사는 통과했지만 전체 배포 성공으로 세지 않는다. 실제 공개 열 가지 검사는 배포 성공까지 실행하지 않는다.

da4 iPhone 세로 job `111159663456`도 **223통과·1실패·1flaky·3생략**으로 종료됐다. 같은 `partial-batch.pw.ts:116` alert 부재가 첫 시도와 재시도에서 실패했다. `math-labels.pw.ts:118`의 벡터 B KaTeX는 기대 1/첫 시도 실제 0이었으나 자동 재시도에서 통과해 flaky로 구별한다. `ci-da4-portrait-failure.log`/`ci-da4-portrait-failure-analysis.json`에 보존했다. iPad 가로와 좁은 창은 CI 성공, 세로는 이 기록 시점 진행 중이다.

병행 main은 da4의 조상 관계를 유지한 `322deff3c01c3f04f5555f5f48ea931ab1d7add9`와 Pages `37108738817`로 승계됐다. Modal 두 파일은 da4 대비 차이가 없다. 제품 중복 수정·workflow 취소·대량 재실행 없이 실제 마지막 성공 배포를 따른다.

da4 워크플로우 전체는 위 실패 job 두 건 후 최종 `cancelled`로 종료됐다. failed job과 workflow 취소를 구별하며 이 작업에서는 취소하지 않았다. 후속 322/685 워크플로우도 병행 최신 후보로 대체됐고, 마지막 확인 대상은 da4의 후손 `9665045811dd2bef96b4170b02aab835fba007e3` / Pages `37109231208`이다. `latest-966-follow.json`의 ancestor·변경 목록·index SHA로 Modal 보수 보존을 확인했다. 모바일 `concept-library.css` 조판 변경도 포함되므로 공개10을 실제 마지막 배포에 적용한다.

후속 `2116c0f674f7f667016f8a68b11a0dc7e9c2f9be`는 `partial-batch.pw.ts` 합성 fixture만 보수했다. prefix 실패 직후 서버 mode를 online으로 바꾸던 부분을 offline으로 유지해 백그라운드 복구가 오류 관측보다 앞서 완료되지 않게 하고, 다음 명시적 재시도 때 online으로 바꾼다. 원문·서버 저장 제품 코드는 변경하지 않았다. Pages `37109586654`의 실제 결과를 기다리며 fixture 보수 자체를 CI/공개 성공으로 세지 않는다(`latest-2116-follow.json`).

이후 병행 후보 `6e1382b2` / Pages `37110751389`의 iPad 좁은 창 job `111168971697`은 **230통과·2실패·1flaky·1생략**으로 종료됐다. `/schedules` light/dark의 `design-system.pw.ts:84`에서 `.schedule-agenda`의 `div aria-label="일정 요약 목록"`에 유효 role이 없다는 axe `aria-prohibited-attr` serious 위반을 실제 HTML로 확인했다. 빠른 명령의 입력란을 기다린 `frontend-workspace-opportunities.pw.ts:31` 90초 timeout은 재시도 통과한 flaky로 구별한다. `ci-6e138-half-window-failure.log`/`ci-6e138-half-window-failure-analysis.json`에 보존했으며 일정 담당의 소스 범위를 중복 편집하지 않았다. 새 공개 배포와 공개10 확인은 이 CI 실패만으로 완료 처리하지 않는다.

최신 `d7b8be3668d546b253322effa2db59efead48398` / Pages `37112196689`는 일정 요약 wrapper를 이름 있는 `section`으로 보수했다. 앞선 ARIA 실패의 실제 원인과 수정 파일을 연결하며 새 CI 결과는 별도로 기다린다. 이 병행 갱신의 `AGENTS.md`에는 2026-10-03 사용자 결정으로 **VoiceOver 전용 지원·구현·검증·QA·완료·배포 조건 제외**가 명시됐다. 일반 키보드·초점·레이블·원문/저장·복귀 검사와 과거 VoiceOver 실행 0 기록은 유지하고 현재 작업의 차단이나 잔여 조건으로 VoiceOver를 요구하지 않는다.

## 선택한 기준과 적용

| 기준 | 성격과 이번 적용 | 실제 한계 |
| --- | --- | --- |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/)와 [200% 글자 확대 해설](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | 웹 표준과 비규범 해설을 구별한다. 가장 긴 본문에 200% 글자 확대, 전체 CSS zoom 2의 대리 조건에서 조작·내용을 확인했다. | 실제 브라우저 메뉴의 확대나 물리 iPhone의 글자 설정 확인은 아니다. |
| [Reflow 해설](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | 320 CSS px에서 원문과 조작이 유지되는지 확인했다. | 실제 400% 브라우저 메뉴 확대 결과로 승격하지 않는다. |
| [WAI-ARIA APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | 모달의 Tab/Shift+Tab 순환, Esc와 호출자 초점 복귀를 실제 WebKit 조작으로 확인했다. | APG는 구현 지침이며 전체 WCAG 인증이 아니다. |
| [WHATWG details/summary](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-summary-element) | 첫 직접 자식 summary가 펼침 조작을 맡는 native 의미를 재사용했다. | 모든 summary를 일반 버튼으로 바꾸지 않는다. |
| [KaTeX 출력 옵션](https://katex.org/docs/options.html) | 기존 HTML+MathML 출력과 시각 HTML의 aria-hidden을 확인했다. | 수식의 실제 한국어 음성 전달과 VoiceOver 사용성은 별도 확인이다. |

수식·그림·표를 새로 생성하지 않았다. 기존 ConceptReader/ConceptText/ConceptFigureView/MathFormula/Modal을 그대로 사용하고, 원문·수식·장면·ID·설정·위치·이력과 저장 계약은 보존했다.

## 재현한 결함과 보수

확대 도해의 **「도해 설명과 표시값」에서 Tab을 누르면 초점이 모달 밖으로 빠졌다.** 다섯 WebKit 환경에서 모두 재현했다. `focusableSelector`가 native summary를 빠뜨렸고, WebKit의 기본 Tab 선호가 일부 버튼을 건너뛰는 상황에서 첫·마지막 요소에서만 순환을 보정하던 처리가 역방향 탈출도 허용했다. `diagnostic-observations.json`에 summary → BODY 및 역방향 viewport → BODY의 실제 초점 순서를 보존했다.

`src/ui/index.tsx`의 공통 Modal 구간을 다음과 같이 좁게 보수했다.

- `details > summary:first-of-type`을 초점 후보에 포함했다.
- 닫힌 details 안의 첫 summary 이외 조작은 후보에서 제외했다.
- 기본 Tab/Shift+Tab마다 기존 `available()` 목록의 인접 대상으로 이동하도록 했다. Safari의 기본 Tab 선호에서도 조작을 빠뜨리지 않고 양방향으로 순환한다.
- 조합 중인 IME와 Alt/Ctrl/Meta를 함께 누르는 Tab, 편집기/복합 위젯이 이미 처리한 `defaultPrevented` Tab에는 개입하지 않는다. 기존 Escape·inert 배경 보호·원래 overflow 복원·호출자 초점 복귀는 유지했다.

`src/ui/component.test.tsx`에 native summary·닫힌 내부 입력·펼친 뒤 입력·양방향 이동·IME/수정 키를 확인하는 회귀 한 건을 추가했다. 기존 공통 입력/편집 메뉴/읽기/도해 검사와 함께 최종 **4파일 29개 통과**했다. 최초 단위 fixture가 jsdom에서 summary의 Enter 기본 펼침을 기대해 실패한 기록은 `unit-fixture-enter-failure.log`에 보존했다. 단위 fixture는 실제 native click으로 펼침을 확인하도록 정정했고, 실제 WebKit 키보드 검사는 별도로 유지했다.

코드 변경은 `modal-repair.patch`와 `verification.json`의 파일 SHA로 식별한다. 별도 사본의 전체 타입·디자인 검사·생산 빌드는 통과했다. 10개 위험 검사 후 마지막으로 편집기가 소비한 Tab 보존 guard를 더했고, 최종 전체 빌드/29개 단위 검사/해당 5환경 추가 검사를 다시 통과했다(21.9초·재시도 0). 이를 마지막 버전의 단일 10개 재실행이라고 세지 않는다. 서버와 공개 배포는 이 로컬 확인만으로 완료로 승격하지 않는다.

## 확인 결과

기존의 일곱 유형 90장면 검사를 다시 세는 대신, 이번에 새로 확인할 위험을 좁혔다. 선택형은 심슨의 역설, 가장 긴 본문은 대기행렬 이론(최대 장면 804자), 수식·도해·확대 모달은 암달의 법칙을 사용했다.

| 확인 | 수행 범위와 결과 |
| --- | --- |
| 다섯 화면 환경 | iPhone 17 Pro 세로/가로, iPad Pro 13 세로/가로/좁은 창의 WebKit 모사. 최종 2검사 × 5환경 = **10개 첫 시도 통과**, 49.2초, 재시도 0. |
| axe | 목록·선택형 읽기·긴 수식/단계 읽기·수식/도해·확대 모달의 5조건 × 5환경 = **25번 실행, 판정된 위반 0**. 불완전 판정은 아래에 따로 남긴다. |
| 키보드 | 목록에서 Enter로 열기, Space로 사례 전환, 다음 단계의 live 위치, 방향키로 확대 도해 이동, Esc 닫기, 목록/모달 호출자 초점 복귀. |
| 모달 순환 | 각 환경에서 앞으로 18번·뒤로 18번, 총 **180번 Tab 조작**, 보수 후 모달 밖 초점 0. 초기 5실패와 진단 1재현은 최종 성공과 별도로 보존. |
| 수식·대체 내용 | 암달 읽기의 MathML 19개 존재와 시각 HTML aria-hidden, 도해의 이름/설명, 확대 모달의 표시값 펼침, 읽기 접근성 스냅샷. |
| 확대·간격 | 본문 16→32 또는 18→36px 대리 확대, 전체 CSS zoom 2에서 단계 이동과 조작 유지. 320px와 1.5줄 높이/0.12em 글자 간격/0.16em 단어 간격/2em 문단 간격 조건에서 가로 넘침 0. |
| 모션 | prefers-reduced-motion 조건에서 현재 장면 transition-duration 0s. |
| 선택한 대비 | 실제 계산 색 잉크 rgb(52,49,43)/종이 rgb(228,220,205)의 대비 **9.516:1**. 본문·도해 라벨·수식 토큰의 선택한 계산 색 조합에 한정한다. |

axe의 `color-contrast`가 겹친 KaTeX 글리프와 도해 라벨에서 일부 **incomplete**를 반환했다. 이를 위반 0과 섞어 전체 대비 통과로 처리하지 않는다. 각 환경·조건의 대상 수와 실제 selector는 원 보고서와 환경별 JSON에 보존했다. 위 계산한 색 대비는 대표 색 조합의 근거이며, 모든 겹친 픽셀과 상태의 독립 대비 점검을 대신하지 않는다.

공개 전집 데이터 JS와 읽기 CSS는 2026-10-03 조회 시 초기 CI와 바이트 동일이었다. 병행 선형대수 배포로 기존 reader JS의 해시 파일명은 바뀌어 구 파일 URL이 404였으므로, 기존 reader JS의 공개 바이트 동일성을 최신 전체 앱까지 주장하지 않는다. 실제 보수의 공개 반영 확인은 다음 통합 배포에서 새 파일과 공개 조작으로 확인한다.

## 넓은 화면의 도해 확대 — 실제 추가 측정

라벨 자동 맞춤이 글자 확대를 상쇄한다는 코드 추측은 결함으로 확정하지 않았다. 부모 요청에 따라 실제 최종 사본 `http://127.0.0.1:6155/study-space-generation2/`의 `01-134` 첫 도해(viewBox 320×240)를 iPad 세로/가로 두 격리 WebKit에서 조작했다. 닫힌 도해 frame은 두 환경 모두 576×432, label fontSize 28.8px, fit 1이었다. 확대 버튼으로 실제 최대 scale 3에 도달했지만 같은 A/B/각도 표지의 bounding rect와 glyph 높이는 닫힌 그림의 **1.66638–1.66667배**였다. 즉 이 화면에서는 현재 도해 확대 조작만으로 200%에 도달하지 못했다.

이 결과는 지원 확대 방법 하나의 제한이다. 다른 지원 확대 방법과 실제 브라우저 메뉴 확대를 검토하지 않았으므로 WCAG 1.4.4 전체 실패나 모든 도해 실패로 확대하지 않는다. 실제 제어로 도해 이동·표시값(A/B·0°/30°/60°) 펼침·Esc 닫기·호출자 초점 복귀가 유지됐고 pageerror는 없었다. font family는 ManSeekSong Paper 계열, wrapper의 computed fontWeight 400이며 700 face 가용 검사 true를 실제 렌더링 face 확정과 구별한다. `figure-zoom-probe.json`, 재사용 측정 스크립트와 두 스크린샷에 실제 비율·제어·표지·폰트 값을 보존했다. 제품 소스는 수정하지 않았다. 최대 4는 계산상 현재 화면 대비 약222%를 허용하므로 후보 변경 시 실제 비율을 다시 확인할 직접 근거다.

## 실행과 재사용

필요한 경우 실제 확인할 생산 산출물만 별도 포트에서 제공하고, 원문·사용자 자료를 쓰지 않는 격리 브라우저로 다음 검사를 실행한다. 기본 주소는 이 보수 사본의 6152이며, 다른 생산 후보/공개 주소는 `CONCEPT_ACCESSIBILITY_BASE_URL`로 지정한다. `CONCEPT_ACCESSIBILITY_RUN`을 새 이름으로 주어 기존 실패·성공 증거를 덮어쓰지 않는다.

```sh
CONCEPT_ACCESSIBILITY_RUN=release \
CONCEPT_ACCESSIBILITY_BASE_URL=http://127.0.0.1:6152/study-space-generation2/ \
node node_modules/@playwright/test/cli.js test \
  --config work/concept-completion-20261003/accessibility/playwright.config.ts
```

위 검사는 격리된 demo 브라우저의 화면 선택·보기 상태만 쓴다. 실제 계정 로그인·원장 기록·개인 설명 복사/수정·자료 가져오기·서버 쓰기 조작은 없다.

## 수행하지 않은 범위

USB 목록에서 연결된 iPhone/iPad 시험 기기가 발견되지 않았다. 이는 USB 조사만이며 무선 연결 여부나 사용자가 기기를 갖고 있는지에 대한 판단은 아니다. **물리 iPhone/iPad, 실제 VoiceOver 음성·수식 탐색, 실제 브라우저 메뉴 확대, 모든 상태의 독립 픽셀 대비, 1,168개 각각의 접근성 의미 전수 검토, 실제 중학생 이해 확인은 수행하지 않았다.** `physical-device-boundary.json`과 `verification.json`에 같은 범위를 명시했다.

이번 결과는 확인한 공통 경로의 실제 결함을 보수한 근거다. WCAG 전체 준수 인증, 실제 기기 통과, 학습 효과, Figma 완료 또는 제품 전체 완료로 읽지 않는다.
