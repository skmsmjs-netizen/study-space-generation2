# 함수·공간곡선 그래프 전체화면

2026-10-03 사용자 첨부의 GeoGebra 함수·공간곡선 화면에서 전체화면 진입이 빠진 것을 보완한다. 기존 수식 유형별 탐색의 전체 화면과 이번 기본 수식 탐색의 누락을 구별한다.

- 진입: 동쪽 수식 탐색 → 함수와 공간곡선 → `그래프 전체화면`. GeoGebra와 Plotly 모두 적용한다. `전체화면 닫기` 또는 Esc로 같은 위치와 버튼으로 돌아온다.
- 그래프·조절 영역의 기존 DOM/React 인스턴스를 유지하고 native `dialog.showModal()`로 같은 요소를 최상위 표시 영역으로 승격한다. 전체화면 왕복이 회전/확대 시야, 미완성 숫자 입력, 오류 안내, 변수/위치, T/N/B 선택과 메모를 초기화하지 않는다.
- 지원 브라우저에서는 표준 Fullscreen API로 브라우저 전체화면을 요청한다. 미지원/거부에서는 창 크기 전체의 모달을 유지한다. 빠른 닫기와 늦은 전체화면 진입의 경합도 종료 처리한다. 활성 과업을 떠나거나 구성 요소가 제거되면 전체화면을 정리한다.
- 넓은 화면은 그래프와 조절 영역을 나란히 배치한다. 좁은 세로 화면은 그래프 아래 조절 영역을 내부 스크롤로 표시하고, 낮은 가로 화면은 다시 나란히 놓는다. 닫기 버튼은 조절 영역과 별도로 항상 화면 안에 유지한다. 그래프 높이는 카드의 고정 높이에서 남은 화면 공간으로 바뀌며 기존 ResizeObserver가 렌더러 크기를 갱신한다.
- 전체화면 여부는 임시 표시 상태이다. 재접속은 일반 보기로 돌아오며 기존 기기 저장 경로의 변수/수식/메모/시야는 복원한다. 저장 키·개인 자료·서버·권한을 변경하지 않는다.

선정 기준: 기존 선택 계약 O14/P05/L194(조절·관찰·근거)을 재사용한다. 표준 [WHATWG Fullscreen API](https://fullscreen.spec.whatwg.org/)와 공식 [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의 모달 초점/배경 차단/닫기/복귀를 native dialog와 기존 Button에 연결한다. 기존 공통 Modal은 확대 화면으로 React 자식을 이동하면 그래프가 다시 마운트되므로 이 경로만 같은 native dialog 요소를 승격한다. 공통 Modal·다른 과목의 병행 구현은 덮어쓰지 않는다.

구현: `src/ui/math-graph-fullscreen.tsx`, `src/ui/math-explorer.tsx`, `src/ui/math-explorer-plot.tsx`, `src/ui/math-explorer.css`. 마지막 보정은 전체화면의 시점 조절/조작 안내를 native details로 펼쳐 보이며, 낮은 화면에서 두 요약을 같은 줄에 둔다. 일반 보기에서는 기존 내용을 펼쳐 유지한다. Provider/실제 그래프 노드는 같은 자리에 유지한다. 회귀: `src/ui/math-graph-fullscreen.test.tsx`, `e2e/devices/math-fullscreen.pw.ts`. 전체 앱 빌드를 막던 `src/domain/riley-observations.ts`의 중복 union 기호 한 글자만 제거했다. 병행 추가 모델·수식 의미를 유지한다.

확인 기록: `work/math-fullscreen-20261003/`의 빌드/단위/기기 로그, `work/device-runs/run-ByV6Xg/`의 고정 빌드 manifest와 실제 WebKit 결과. 초기 전역 타입 오류, 교재 파일 문법 오류, jsdom의 native dialog 미구현, 병행 부하의 단위 시간초과와 기존 모달 닫힘 애니메이션 검사의 숨은 입력 중복 실패를 보존한다. 이들을 제품 전체 통과로 승격하지 않는다. 최종 확인 범위는 아래에 갱신한다.

공개 배포·물리 기기·서버/다기기 동기화·학습 효과는 이번 로컬 전체화면 구현의 확인과 구별한다.

## 실제 확인과 최종 범위

- 초기 `npm run build` 성공. 마지막 TypeScript 코드의 `typecheck-complete.log`/종료0 통과. 최종 CSS 배치 보정 후의 완전한 생산 빌드 성공을 이 근거로 대신하지 않는다.
- 전체화면 전용 단위2개 통과: 반복 진입/닫기/취소/활성 과업 이탈에서 같은 renderer·미완 입력·초점·배경 잠금 보존, native fullscreen 거부의 대체 화면. 기존 수식 검사6개가 마지막 선택 실행에서 통과했고 부하로 시간초과한 초기화1개도 별도 실행에서 통과했다. 다른 유형별 탐색2개는 기존 모달 닫힘 애니메이션의 숨은 입력 중복 실패로 따로 남긴다.
- 첫 실제 앱 고정 빌드 `run-ByV6Xg`: 기본 바깥틀5흐름 통과. 그래프의 낮은 가로 높이와 짧아진 문서의 스크롤 clamp를 발견했다. 첫 보정 고정 빌드 `run-7ddFfm`: 두 renderer×다섯 WebKit 환경10흐름 중9통과, 재시도0. 남은 실패는 iPhone가로 Plotly 그래프 높이45.28px이었다. 상세 도구를 접고 두 요약을 한 줄로 놓는 마지막 소스 보정을 추가했다.
- `native-result.json`: Chromium 실제 Fullscreen API 진입/닫기와 browser API로 해제 시 앱 모달 종료, 같은 graph node/변수값 유지 통과. 이 검사는 마지막 details 배치 보정 전 판본이다.
- 마지막 배치 보정 재확인 전에 다음 도구/환경 실패를 겪었다. 전체 빌드/자산 준비가 정지해 자신의 두 실행만 종료143으로 남겼고, `run-IlWxNT`는 시험 서버 시작60초 초과로 흐름을 실행하지 못했다. 그래프만 쓰는 격리 fixture도 `node_modules/rolldown/package.json`의 `ERR_INVALID_PACKAGE_CONFIG`로 빌드 전에 중단했다. 해당6,219byte 파일에서 macOS `compressed,dataless` 플래그를 직접 확인했고 읽기가 지연되는 것을 관측했다. iCloud 미다운로드 상태가 현재 개발 도구 접근을 막는 것으로 판단하되, 모든 중단의 단일 원인으로 단정하지 않는다. 그 시점의 `fixture/`는 빌드에 실패한 준비본이었다. 이후 재확인 결과는 다음 항목에 따로 기록한다.
- 직접 남은 일: 개발 의존성의 접근 가능한 사본을 복구한 뒤 마지막 소스를 빌드하고 `math-fullscreen.pw.ts`의 두 renderer×다섯 환경을 마감한다. 보존 조건은 동일하며 새로운 DB 적용/개인 기록 쓰기/공개 배포는 수행하지 않았다.

- 최종 재확인: iCloud 밖 임시 도구 환경과 현재 실제 MathExplorer/GeoGebra/Plotly/전체화면 소스·CSS로 격리 화면을 빌드했다(2.30초, 종료0). 두 renderer×다섯 WebKit 환경10흐름 전부 통과, skip/flaky/실패0·재시도0(62.92초). iPhone 가로 Plotly도 그래프 높이80px 초과·화면 안 배치 통과. 같은 graph node, 미완성 a 입력, 조절·닫기 접근, 초점/스크롤 복귀, Esc 종료, 재접속 값과 renderer 유지 확인. 근거는 fixture-results.json/fixture-browser.log/fixture-manifest.json이다.
- 격리 확인 경계: 합성 사용자 상태와 실제 기기 localStorage의 수식 초안을 사용한다. 무관한 과목 경로와 math-observatory.css를 생략하고 memo 저장·서버 repository를 실행하지 않았다. 초기 실제 앱 검사9/10과 최종 그래프 격리10/10을 구별한다. 전체 앱 최종 생산 빌드·공개 배포·물리 기기는 이번 마지막 격리 확인으로 완료 처리하지 않는다. node_modules/lock/다른 대화 소스는 복구를 이유로 덮어쓰지 않았다.

## 2026-10-03 축 숫자 분포 후속 보완

사용자 ‘축 숫자가 왜 원점 근처에 몰려 있어’에 따라 전체화면 확인을 눈금 분포로 확장했다. 기존 코드가 숫자를 1단위/화면 픽셀38–56 기준으로 숨기는 데 그치고, GeoGebra는 낮은 밀도에서 이전 값 배열을 유지했다. 실제 기본 전체화면에서 GeoGebra 밀도15.21/10.01/16.19, Plotly35.77에서 숫자 불투명도0을 관측했다. 이 결과만으로 사용자 화면의 모든 숫자 위치 오류가 재현됐다고 단정하지 않는다. 표시 범위와 간격을 함께 조정하는 필수 누락을 보완했다.

기존 [D3 ticks의1/2/5 간격 계열](https://d3js.org/d3-array/ticks)을 재사용하며, 프로젝트의 정수 눈금 계약/화면 여유에 맞춰 위쪽 반올림·최소56px/긴 값 글자폭·현재 범위 전체/개수 상한을 작은 공통 함수integerAxisTicks에 연결했다. 새 패키지를 설치하지 않았다. GeoGebra는 매 회전·확대·전체화면 크기 변경에 현재 보이는 축 전체를 다시 생성하고, Plotly는 같은 정수 간격을3D 실제 좌표에 붙인다. 불투명도는1단위 폭 대신 실제 표시 숫자 간격을 사용한다. 값/수식/시야/세계 단위/저장 키는 변경하지 않는다. 확대하면1단위로 돌아오고 먼 화면에서는2·5·10 등 정수 간격이 넓어진다. function모드와 native tickDistance1 계약은 유지한다.

실제 계산 회귀5개(넓은 범위 양끝/확대/크기 증가/이동/개수 상한·축 정면/비유한 값) 통과. 현재 그래프 소스 격리 빌드1.22초 성공. WebKit5환경에서 새 축 분포5흐름+기존 전체화면10흐름=15/15·실패/skip/flaky/재시도0(50.1초). GeoGebra의180px 이상 축에서 숫자 표시 span45% 초과·확대 후 눈금 간격 감소·정수 값 유지, Plotly의 양방향 정수 좌표/불투명도, 기존 미완 입력/닫기/재접속을 확인했다. 전체 npm run typecheck도 종료0. 근거 axis-browser.log/axis-results.json/axis-regression.log/axis-typecheck.log/axis-manifest.json, 화면axis-spacing.png. 이 결과는 실제 그래프 구성 요소의 합성 사용자 격리 화면이다. 전체 앱 새 생산 빌드·공개 배포·물리 기기 확인으로 확대하지 않는다.
