# 개념 전체의 최신 본문 조판 확인 — 2026-10-03

현재 승인된 나눔명조 Bold 700·실제 글자 폭 95%로 공개 정본 1,168개·1,851장면을 다섯 WebKit 화면에서 실제 제품 `ConceptLibrary`와 `ConceptReader`로 검사했다. 이전 전수 검사의 500·100% 결과와 최신 조판의 유형 대표/14개 표본 결과를 합쳐 최신 전수 통과로 처리하지 않는다.

## 현재 확인 상태

**최종 통합판 전수 검사도 완료했다.** `9665045811dd2bef96b4170b02aab835fba007e3` 기반에 도해 표지 폭 맞춤을 적용한 실제 production 사본에서 다섯 환경 모두 1,168개·1,851장면을 다시 끝까지 확인했다. 이번 최종 실행만 5,840개 개념 방문·9,255장면이며 기존 기준판 수행 건수를 합치지 않는다. 전역 본문 CSS가 바뀌었으므로 도해 표본 검사로 대신하지 않고 전체를 새로 수행했다.

[최종 범위와 수치 후보](../work/concept-completion-20261003/full-corpus/final-coverage-and-findings.json), [최종 전수 인벤토리](../work/concept-completion-20261003/full-corpus/final-inventory.json), [판정과 진단 연결](../work/concept-completion-20261003/full-corpus/final-gate-assessment.json)이 실제 결과를 소유한다. 누락·런타임 실패·페이지 오류·브라우저 외부 요청은 0이다. 본문 원문/비수식 기호 재구성, 수식 원문 연결/KaTeX 오류/남은 TeX, 실제 700·95% 서체, 문서 가로 넘침, 장면 높이/읽기 화면 높이, 목록 복귀 검색·초점의 오류도 0이다. 실제 MathML 인스턴스 34,080개, 개념 안의 높이 변화 0px를 확인했다. 후속 도해 표지 경계와 표지 겹침 후보도 0이다.

| 최종 환경 | 실제 개념/장면 | 본문 크기 | 본문 수치 후보 | 실제 실행 시간 |
|---|---:|---:|---:|---:|
| iPhone 17 Pro 세로 | 1,168 / 1,851 | 16px | 1 | 288초 |
| iPhone 17 Pro 가로 | 1,168 / 1,851 | 16px | 2 | 287초 |
| iPad Pro 13 세로 | 1,168 / 1,851 | 18px | 1 | 316초 |
| iPad Pro 13 가로 | 1,168 / 1,851 | 18px | 1 | 314초 |
| iPad Pro 13 절반 창 | 1,168 / 1,851 | 16px | 0 | 309초 |

본문 `scrollWidth` 2px 수치 후보는 최종 5회이며 원래 값과 `allMeasuredChecksPass: false`를 유지한다. KaTeX U+200B 보조 셀의 측정값과 실제 표시 문자/수식의 정보소실을 구별해 독립 진단에 연결했고 미해결 후보는 0이다. 기준판에서 이미 진단한 동일 본문·수식·서체/뷰포트와 wrap 변화의 후보 근거를 명시하여 재사용한다. 새로운 줄 배치의 `02-035`는 [최종 6155 실제 생산판에서 새로 재현한 진단](../work/concept-completion-20261003/full-corpus-diagnostics/final-diagnosis.md)에 연결한다. 174개 표시 문자·첨자·보조 셀·조상 경계를 실제로 대조해 표시 잘림이 관찰되지 않았다. JSON SHA는 `488bb9a6bbceaccb7f652fa434c23ec1d87ac12eebe1c66eb757cd497bd62642`다. 수치 임계값을 전역으로 높이거나 후보를 지우지 않는다.

[최종 소스/빌드 고정](../work/concept-completion-20261003/full-corpus/final-source-manifest.json)은 관련 소스 19개·실제 production 740파일을 기록하며 [종료 무결성](../work/concept-completion-20261003/full-corpus/final-evidence-integrity.json)에서 759파일 모두 동일했다. 고정 정본 SHA와 실제 700·95% 폰트는 유지됐으며 본문/원문 변경은 0이다. 배포 성공은 이 로컬 결과로 자동 승격하지 않는다. root가 실제 공개 반영 결과와 최종 커밋의 읽기 파일 동일성을 따로 연결한다.

최종 장면별 전체 측정은 [최종 환경별 기록](../work/concept-completion-20261003/full-corpus/final-results/)의 `results.json.gz`로 무손실 보관한다. [압축/원본 SHA와 해제 동일성](../work/concept-completion-20261003/full-corpus/final-compressed-results-manifest.json), [실행 로그](../work/concept-completion-20261003/full-corpus/final-scan.log), [최종 CSV](../work/concept-completion-20261003/full-corpus/final-inventory.csv)도 별도로 보존한다.

새 다섯 문맥의 `03-095` 기본 두 장면×5환경 10장면과 기본/20px/서체변경/원복 총40측정은 [최종 짧은 확인](../work/concept-completion-20261003/full-corpus/final-smoke/results.json)에 있다. 넘친 표지만 fit 비율을 재계산하며 서체·크기 변경 뒤에도 경계 넘침/원문/수식 오류 0이었다. 실제 설정 UI·저장 시험이 아니라 폐기 가능한 문맥의 CSS 변화 시험이다. 첫 의존성/서버 접두사 오류, 본문20px만 변경된 첫 정상 확인, 실제 도해 토큰까지20px로 보완한 최종 확인을 각각 보존했다. 제품 결함과 준비 오류를 섞지 않는다.

## 기준판 전수 완료 근거의 보존

아래는 불변 `c624b5e` 기준판의 별도 전수 기록이다. 후속 `9665045`에서 모바일 본문 줄바꿈 CSS와 이동/원문 영역 CSS가 합류하고 도해 표지 폭 맞춤이 추가되어 최종 전체 재검사를 실행했다. 기준판의 미해결 수치 후보나 수행 건수를 최종 결과로 덮어쓰지 않는다.

다섯 환경 모두 1,168개·1,851장면을 끝까지 실제 확인했다. 합계 5,840개 개념 방문·9,255장면이며 누락과 런타임 실패는 0이다. [전체 집계](../work/concept-completion-20261003/full-corpus/coverage-and-findings.json)와 [개념별 전수 인벤토리](../work/concept-completion-20261003/full-corpus/inventory.json)가 각 개념/환경의 실제 측정 여부를 소유한다. [CSV](../work/concept-completion-20261003/full-corpus/inventory.csv)에서도 각 환경의 장면 수와 후보 수를 확인할 수 있다.

원문/문단별 비수식 글자·기호 재구성, 수식 원문 연결, KaTeX 오류와 남은 TeX, 실제 700·95% 서체 조판, 문서 가로 넘침, 목록 복귀 검색·초점의 검사 실패는 0이다. 실제 MathML 수식 인스턴스는 34,080개였다. 개념마다 장면 높이와 전체 읽기 화면 높이의 최대 변화는 모두 0px이었다. 페이지 오류와 브라우저 외부 요청도 0이다.

수치 경계를 넘은 **측정 후보 16회**는 원래 기록에 그대로 남긴다. 본문 `scrollWidth` 2px 후보 6회와 도해 표지 경계 후보 10회이며 실제 글자/수식 잘림과 구별한다. 따라서 원래 `allMeasuredChecksPass`는 false이다. 범위 완료를 모든 수치 임계값 통과로 바꾸지 않는다.

| 환경 | 실제 개념/장면 | 본문 크기 | 측정 후보 | 실제 실행 시간 |
|---|---:|---:|---:|---:|
| iPhone 17 Pro 세로 | 1,168 / 1,851 | 16px | 3 | 470초 |
| iPhone 17 Pro 가로 | 1,168 / 1,851 | 16px | 4 | 467초 |
| iPad Pro 13 세로 | 1,168 / 1,851 | 18px | 3 | 503초 |
| iPad Pro 13 가로 | 1,168 / 1,851 | 18px | 3 | 496초 |
| iPad Pro 13 절반 창 | 1,168 / 1,851 | 16px | 3 | 440초 |

최종 장면별 전체 측정은 [환경별 폴더](../work/concept-completion-20261003/full-corpus/results/)의 `results.json.gz`로 무손실 보관한다. 로컬에는 같은 원본 `results.json`도 있으며 [압축/원본 SHA 기록](../work/concept-completion-20261003/full-corpus/compressed-results-manifest.json)으로 동일성을 확인할 수 있다. 원본 다섯 파일 약 29.9MB를 약 3.9MB로 압축했으며 장면 기록을 줄이지 않았다. [실행 로그](../work/concept-completion-20261003/full-corpus/full-scan.log)와 대표/후보 이미지도 유지한다.

| 확인 범위 | 당시 조건 | 현재 의미 |
|---|---|---|
| 기존 내용 전체 검토 | 1,168개 원문/편집 설명 | 전체 문장의 AI 검토이며 실제 학생 이해 관찰이 아님 |
| 기존 전수 화면 | 500·100% 본문 | 최신 700·95% 전수 결과로 승격하지 않음 |
| 최신 유형 대표 화면 | 7유형·90장면 | 대표 화면 확인 |
| 최신 참여 평가 준비 화면 | 14개·33장면·5환경=165장면 | 참여자 화면 표본 확인, 실제 참여 응답 0 |
| 이번 전체 화면 | 700·95%·1,168개·1,851장면·5환경 | 전수 측정 완료·누락 0, 측정 후보는 별도 진단 |

## 고정한 자료와 실제 앱

자료 원본은 `src/data/concept-reading-pack.published.json`, SHA-256 `64f19457f183cc9712793b111595784916e36706932f796c06408b59fe2f3c39`이다. 새로 생성하거나 가져오거나 원장에 쓰지 않는다.

실행 사본은 불변 커밋 `c624b5ec4b086bd6df40ee77cd4cdd735819c2c5`의 Vite production build이다. 공개 배포 성공으로 표현하지 않는다. 시작 시 확인한 마지막 실제 성공 배포는 커밋 `15feb2835a0f7edad05d32bda76937fe3d699191`, GitHub Pages deployment `6822688718`이다. 두 버전의 개념 읽기 부품·본문 CSS·서체·정본은 동일하며 공통 모달 모션의 차이는 별도다. 후보 `da4ed57d8f6f42b9ab430c67aadb5a5bcce1decb`와 관련 19파일은 [SHA 대조](../work/concept-completion-20261003/full-corpus/candidate-parity.json)에서 전부 동일했다. 후속 `322deff`에서는 18파일이 동일하고 `observatory-layout.css`에 자료 카드/자유 글 전용 선택자만 추가되었다. [후속 대조](../work/concept-completion-20261003/full-corpus/candidate-parity-322deff.json)와 [변경 패치](../work/concept-completion-20261003/full-corpus/candidate-layout-diff-322deff.patch)에서 개념 읽기 선택자의 변경이 없음을 확인했다. 이후 표지 폭 맞춤 변경은 해당 부품의 실제 재검사를 추가로 연결해야 한다.

[소스/빌드 무결성 기록](../work/concept-completion-20261003/full-corpus/source-manifest.json)은 관련 소스 19개 및 실제 production 파일 207개의 SHA와 크기를 기록한다. 검사 종료 후 [무결성 대조](../work/concept-completion-20261003/full-corpus/evidence-integrity.json)에서도 226파일 모두 동일했다. 실제 제품의 `ConceptText`·`MathFormula`·`ConceptFigureView`·`KnowledgeStructure`와 전체 앱 CSS/서체 조합을 그대로 사용한다. 대체 화면이나 별도 평가 화면의 렌더를 전수 앱 확인으로 세지 않는다.

로컬 미리보기: <http://127.0.0.1:6094/study-space-generation2/?space=demo#/concepts>. 첫 확인은 iPhone 세로의 실제 개념 5개·10장면이며 실패 0이었다. 대표 이미지와 실제 측정값은 [첫 확인](../work/concept-completion-20261003/full-corpus/sample/)에 보존한다.

## 기준과 확인 방법

[기존 개념 표현 기준](concept-interaction-design.md)의 PhET 표현 일관성, DeFT 표현 대응, 해당 수학 표현의 NCTM 기준과 WCAG/APG의 조작·초점·라벨을 재사용한다. [종이 본문 기준](paper-typography-standard/README.md)의 최신 700·95%, 양쪽 정렬/마지막 줄 시작 정렬, 넓은 18px·좁은 16px을 실제 로드 서체와 계산 스타일로 확인한다. 이 측정은 화면의 구체적인 오류를 발견하는 절차이며 WCAG 전체 인증이나 교육 효과의 증거가 아니다.

프로젝트의 실제 기기 환경 정의를 불변 사본에서 불러온다. iPhone 17 Pro 세로·가로, iPad Pro 13 세로·가로·절반 창의 다섯 WebKit 환경이다. 절반 창은 현재 정의인 517×1200을 사용한다. 브라우저 모사와 물리 기기는 구별한다.

매 개념을 실제 검색하고 읽기 화면을 열어 모든 장면을 실제 버튼으로 이동한다. 본문 원문과 문단별 재구성의 동일성, 수식 토큰의 원문 연결, 비수식 글자/기호 보존, KaTeX 오류와 남은 TeX 표시, 글자 조판, 문서/본문 가로 넘침, 도해 표지의 경계와 겹침, 개념 안에서의 장면 높이 유지, 목록으로 돌아올 때 검색·초점 보존을 측정한다. 장면마다 두 번의 화면 갱신을 기다린다. 평상시 고정 지연은 두지 않으며 발견/대표 이미지를 찍는 경우만 150ms를 둔다. 모든 장면의 이미지를 만드는 대신 실제 측정 전수와 실패/대표 이미지를 보존한다.

한 브라우저에서 환경별 격리 문맥을 최대 두 개만 동시에 실행한다. 조작별 대기는 20초이며 제한에 도달한 실제 오류는 기록하고 다음 개념을 계속 확인한다. 결과에서 검사 건수와 통과 여부를 따로 표시한다. 발견이 있어도 전 범위 검사는 이어가되 발견 0으로 바꾸지 않는다.

## 측정 후보의 독립 진단과 후속 변경 범위

[독립 진단](../work/concept-completion-20261003/full-corpus-diagnostics/diagnosis.md)은 귀류법·광합성·09-061·표본화 정리의 본문 2px가 KaTeX의 U+200B 보조 셀 또는 작은 글리프 잉크 돌출을 포함한 크기 측정임을 확인했다. 표시 문자 Range·루트 SVG의 실제 clip·조상 overflow를 대조했을 때 처음 네 개념의 실제 정보소실은 관찰되지 않았다. 표본화 정리는 두 iPad 환경에서 같은 현상이어서 이 근거가 후보 5회에 대응한다. `02-063` 절반 창의 추가 후보 1회도 이후 같은 방법으로 독립 방문하여 실제 문자 Range·보조 셀·잉크를 대조했다. 따라서 본문 후보 6회 모두 별도 관측으로 진단했고 실제 글자·수식의 정보소실은 관찰되지 않았다.

`03-095` 두 장면의 하단 표지는 다섯 환경에서 그림 구역 경계를 넘었지만 실제 페이지의 종이 여백 안에서는 끝말까지 보였다. 읽기 요소만 자르는 이미지와 전체 페이지의 정보소실을 구별한다. 그림 안에서 넘친 표지만 폭을 맞추는 후속 보수는 본문·원문·서체·수식 변경을 뜻하지 않는다. 도해만 바뀌었을 때는 363도해 장면이 있는 252개 개념을 다섯 환경에서 다시 확인하는 범위가 적합했으나, 후속 전역 본문 CSS 변경으로 최종 전체 검사를 새로 수행한다. 현재 본 문서가 소유한 전수 근거는 수정 전 불변 실행 사본이다.

진단 JSON SHA는 `7335faccbffcf178255a3eec1bb9b019f91b6b70968a404d23f162708b0bc582`이다. 이 진단의 범위를 실제 학생 이해, 물리 기기 또는 모든 문장의 사실성으로 확대하지 않는다.

## 남은 실제 관찰 조건

실제 중학생 참여 응답 0, 실제 iPhone/iPad 관찰 0, VoiceOver 관찰 0이다. 이번 화면 전수 측정으로 모든 문장의 사실 확인이나 실제 이해 검증이 완료됐다고 주장하지 않는다. 사람이 진행할 평가와 기기 관찰의 실행 안내는 [참여 평가 꾸러미](concept-learner-validation-20261003.md)에 연결한다. 원문·ID·개인 기록·설정은 수정하지 않는다.
