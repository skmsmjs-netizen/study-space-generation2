# 기록 주제의 과목 선택 수정 · 2026-10-04

사용자 사진1의 기록 화면에서 대학수학및연습1만 보이는 문제. 공개 개인 공간의 DOM을 읽기 전용으로 확인했고 다른 과목의 주제도 첫 과목 뒤에 존재했다. 첫 과목 전체 목차를 먼저 펼치는 긴 목록과 독립 스크롤, 과목 전환 수단/개수 부재가 원인이다. 데이터 누락으로 판단하지 않았고 개인 기록에 시험 쓰기를 하지 않았다.

기존 등록 목록→상세 레이아웃과 Select/Search, 기기별 저장 preference를 재사용했다. [NN/g 상태 가시성](https://www.nngroup.com/articles/visibility-system-status/)과 [필터 사용 목적](https://www.nngroup.com/articles/applying-filters/)은 UX 관례의 근거이며 공인 표준/효과 보증이 아니다. 과목 선택란에 범위 내 모든 과목과 실제 주제 수(0개 포함), 목록 상단의 과목/주제 수를 표시한다. 검색은 주제명과 과목명에 적용한다. 긴 목록에서 선택·검색은 상단에 유지하며 과목을 바꾸면 목록 스크롤을 처음으로 돌린다. 기본값은 모든 과목, 사용자가 고른 과목은 기존 namespace/user prefix에 저장한다. 범위 밖/삭제된 선택 과목은 보이는 모든 과목으로 대체 표시하며 기존 범위 설정을 바꾸지 않는다.

주제 선택·메모·TRACE·기록 ID/회차·초안 키/원문·기존 기록과 서버 명령을 유지한다. 다른 과목/검색 밖의 선택 주제도 작성면에 남고 함께 저장한다. 주제 없는 과목은 0개로 표시하고 과목 상세의 추가 경로를 제공한다. unit/outline을 topic으로 자동 변환하지 않는다.

변경: src/App.tsx RecordForm, src/app.css의 목록 상단, src/record-filter.test.tsx, e2e/devices/record-course-picker.pw.ts. 격리 사본 /tmp/study-record-picker-20261004에서 최신 공개 소스3848645를 기준으로 작업했으며 공유 checkout/index와 병행 변경을 보존한다. 추적 MAN-32.

로컬 확인: 관련 Vitest9통과, 타입/Pages 생산빌드와68CSS 검사0오류. 92개 첫 과목→다른 과목 선택→두 글 작성→새로고침 복원→0개 과목 안내→과목명 검색→두 과목 한 회차 저장·공백/줄바꿈 보존을 다섯 WebKit 환경에서5/5첫 통과했다. 기기 근거 work/device-runs/run-4EYIlY. 공개 적용·CI 결과는 배포 후 같은 문서에 추가한다. 물리기기/IME/개인 계정 Sync·학습효과는 별도다.

## 2026-10-07 낮은 가로 화면 보완

이전 전체CI37197467435는 build/4환경success, iPhone가로failure였다. 고정 record-picker-controls가 낮은 viewport에서 checkbox를 가려 기록/복원 등24경로의 클릭을 막았다. 초기 로컬5통과와 전체CI실패를 별도로 보존한다. 실제 공개는 수동37197856590의success로 게시된 상태였다.

32rem 이하 높이에서는 목록과 상단의position을static으로 두고 목록의높이제한/내부스크롤을해제했다. 이 값은iPhone가로화면의실측가림을해결하기위한프로젝트조건이며표준수치가아니다. 더높은화면의기존고정/과목선택과모든원문/선택/초안/ID·저장명령을유지한다. 낮은화면에서긴목록하단뒤과목선택으로스크롤복귀하는조건도회귀에반영했다. 생산/타입/68CSS오류0, 직접다섯WebKit5/5통과(run-O0VEWi). 이전실패24경로를동일생산빌드의iPhone가로환경에서선택확인중이다. 최종배포와결과는확인후추가한다.

보완 결과: 이전 실패24개 경로는 같은 생산빌드의 iPhone가로 환경에서24/24첫통과, 재시도/생략/최종실패0(run-eFCnwu). 새5기기 직접회귀도5/5첫통과했다. 이전 전체CI의4기기success·iPhone가로failure·자동deploy생략은 당시결과로보존하며수동공개성공과구별한다. 보완수정의공개빌드/게시결과는게시후추가한다.

## 최종 공개 반영 · 2026-10-07

앱c7f0fc644e83e3cd003f9e5b5a4eb512ac57e423의빌드37570445859에서전체단위1410통과/1생략·백엔드번들/타입/생산빌드성공. 같은verified-build를기존수동게시[37570873897](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/37570873897)로게시하고success확인. 새로운전체5환경회귀는[37570445859](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/37570445859)에서별도진행중이며전체통과로보고하지않는다.

공개HTML/JS/CSS/manifest/icon8파일HTTP200·CI산출물과byte/SHA256전부일치. 공개주소에서새격리합성WebKit5/5첫통과(92개첫과목·과목전환/빈과목/검색/두글/reload/한회차저장·원문공백보존),재시도/생략/실패0. 실제개인공개화면읽기전용확인에서7개과목/171개주제와C프로그래밍7주제전환확인·확인뒤모든과목보기복귀. 개인공부기록시험쓰기/운영서버변경0. 물리기기/IME/개인Sync는이번증거밖이다.

근거정본:work/record-course-picker-20261004/의ci-build-20261007.log·failed-paths-20261007.log·five-20261007.log·public-five-20261007.log·public-assets-20261007.json·public-device-results-20261007.json·public-record-picker-final-20261007.png·verification.json,MAN-32. 이전실패/초기공개성공과범위검증을보존한다.
