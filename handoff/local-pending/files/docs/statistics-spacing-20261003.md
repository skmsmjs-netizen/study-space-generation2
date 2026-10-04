# 과목 비교 그래프의 글자·간격 보정

2026-10-03 사용자 첨부 화면과 「글씨가 너무 촘촘」 요청에 따른 국소 수정이다. `StatisticsPlot`의 가로막대/나란한 막대와 그래프 SVG 글자만 보정한다.

기존 통계·그래프 선택 기준과 디자인 지침의 여백·누적·긴 이름·좁은 화면 계약을 재사용했다. 기존 Plotly의 [축 여백 공식 기능](https://plotly.com/javascript/reference/layout/yaxis/#layout-yaxis-ticklabelstandoff)을 적용하고 새 그래프 도구를 도입하지 않았다. 항목에 따른 높이와 이름 줄바꿈은 프로젝트의 표시 규칙이며 공인 표준 수치가 아니다.

- 그래프 글자의 축소 자간 상속을 끊고 `normal`을 적용한다. 비교 그래프 글자 크기는 기존 `--type-caption-size`를 읽는다(현재14px, 기존12px).
- 과목명과 축의 추가 여백12px, 숫자와 축의 추가 여백8px. 가로막대 한 항목 기본44px, 비교막대56px이며 가장 긴 이름의 줄 수가 더 많은 공간을 요구하면 같은 범주 띠를 넓힌다. 실제 여백은 Plotly 자동 여백의 결과를 따른다.
- 과목명이 쓸 수 있는 폭은 그래프 폭의40%, 최소72px/최대200px. 실제 서체 폭으로 줄바꿈하고 전체 이름·원래 범주 값과 클릭 인덱스는 유지한다. 표시 문자열의 HTML 문자를 이스케이프한다.
- 자료·폭 변경 시에만 다시 계산하며 기존 `uirevision`, 값표/원기록, 개인 설정·선택과 저장 경로를 유지한다. 저장·서버를 수정하지 않았다.

관련 단위검사 최종8통과와 디자인65CSS오류0. 병행 부하에서 기본5초 제한을 넘긴 중간 실행을 보존하고, 단일worker/30초 제한으로 최종8개가 모두 통과했다. 기존 통계 조작/원기록/저장·재접속 회귀는 다섯WebKit환경5통과. 과목8개/긴 한국어 이름의 글자 겹침·가로 넘침·전체 이름·원자료 보존·폭 변경·재접속은 다섯환경에서 통과했다(휴대전화2/좁은창1은 `devices-final.log`, 태블릿2는 `devices-tablet.log`). 기존 fixture가 시작하면서 압축/기본값을 보완하는 동작은 자료 변경으로 오판하지 않고 원래 엔터티를 대조한 뒤 조회/재접속 동안의저장 byte보존을 확인했다. 최초 fixture 표현 비교 실패와 태블릿의 본체 노출/대기 실패도 로그에 보존한다.

이번 기기 검사는 현재 개발서버에서 수행했으며 생산빌드의 `npm run test:devices` 전체 통과로 보고하지 않는다. 전체 빌드는 병행 중인 `vector-calculus-general.ts:1239` 타입 오류, 후속 `riley-observations.ts:6` 구문 오류로 실패했다. 해당 파일을 수정하거나 병행 변경을 되돌리지 않았다. 공개 배포·운영서버·개인기록 쓰기·실물기기 확인은 수행하지 않았다. 증거는 `work/statistics-spacing-20261003/`에 있으며 `preview.png`는 합성 긴 이름을 포함한 실제 렌더링 화면이다.

## 같은 날 후속 공개 배포 완료

사용자 후속 「배포」를 받아 청정 원격 기반에서 통계 수정 dc6a88bc를 main에 반영했다. 해당 생산 빌드·단위8·5WebKit 통계10회귀 통과. 공유 HEAD/index·다른 대화의 미커밋 변경과 개인 기록은 보존했다.

최종 통합 후보 `c56b20c1f2d3f89074dffe0f16de2af6611a6f8c`의 [Pages37121125491](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/37121125491)이 build·5기기 검사·deploy 모두 성공, 2026-10-03 21:27:58 KST 공개 게시 완료. 통계 제품2파일/spacing회귀는 dc6a88과 동일하다. 최종 단위1398통과/1skip. 전체기기 요약은1210passed·8flaky(재시도통과)·27skip·최종실패0으로, 전수첫시도/무생략으로 확대하지 않는다.

[공개 통계 화면](https://skmsmjs-netizen.github.io/study-space-generation2/#/statistics)의 index/JS/CSS125파일이 해당 verified-build와 byte/SHA256 모두 일치했다. 공개 주소에서 합성 demo 자료로 5WebKit의 통계10회귀21.3초 통과, fail/flaky/retry/skip0. 긴 과목명8개·font14px이상·라벨간12px이상·완전한 이름·폭 변경·가로넘침없음·원기록/값목록·월간집계·조회/새로고침 중 저장byte보존을 확인했다. 공개 iPad세로 캡처도 시각 확인. 실제개인계정·운영서버쓰기/Sync·물리기기/장기사용·학습효과의 증거는 아니다.

초기 pending교체 취소, 다른 화면 준비/복귀 검사 실패, 선형대수 연결도2개 selector오류, 새전체메뉴/공간설정 selector오류와 renderer누적90초초과를 보존했다. 독립진단20/5/1통과 후 통합담당의 동등 준비보완·selector한정·renderer시험분리를 재사용했고 제품변경 없이 기존 단언/tap/90초를 유지했다. 큐/후보 조정은 단일 통합담당이 수행, 이 대화는 최초 dc6a 이후 추가push/cancel0. 전체제품/전체MAN-10완료로 확대하지 않는다.

최종 정본 `work/statistics-spacing-deploy-20261003/release.json`, `c56-ci-final.json`, `c56-device-summary.json`, `public-results.json`, `public-parity.json`, `public-preview.png` 및 실패/성공 로그. MAN-10/MAN-7/MAN-9에 범위·실제 근거 연결. 문서만의 새배포를 반복하지 않는다.
