# 기록 주제의 과목 선택 수정 · 2026-10-04

사용자 사진1의 기록 화면에서 대학수학및연습1만 보이는 문제. 공개 개인 공간의 DOM을 읽기 전용으로 확인했고 다른 과목의 주제도 첫 과목 뒤에 존재했다. 첫 과목 전체 목차를 먼저 펼치는 긴 목록과 독립 스크롤, 과목 전환 수단/개수 부재가 원인이다. 데이터 누락으로 판단하지 않았고 개인 기록에 시험 쓰기를 하지 않았다.

기존 등록 목록→상세 레이아웃과 Select/Search, 기기별 저장 preference를 재사용했다. [NN/g 상태 가시성](https://www.nngroup.com/articles/visibility-system-status/)과 [필터 사용 목적](https://www.nngroup.com/articles/applying-filters/)은 UX 관례의 근거이며 공인 표준/효과 보증이 아니다. 과목 선택란에 범위 내 모든 과목과 실제 주제 수(0개 포함), 목록 상단의 과목/주제 수를 표시한다. 검색은 주제명과 과목명에 적용한다. 긴 목록에서 선택·검색은 상단에 유지하며 과목을 바꾸면 목록 스크롤을 처음으로 돌린다. 기본값은 모든 과목, 사용자가 고른 과목은 기존 namespace/user prefix에 저장한다. 범위 밖/삭제된 선택 과목은 보이는 모든 과목으로 대체 표시하며 기존 범위 설정을 바꾸지 않는다.

주제 선택·메모·TRACE·기록 ID/회차·초안 키/원문·기존 기록과 서버 명령을 유지한다. 다른 과목/검색 밖의 선택 주제도 작성면에 남고 함께 저장한다. 주제 없는 과목은 0개로 표시하고 과목 상세의 추가 경로를 제공한다. unit/outline을 topic으로 자동 변환하지 않는다.

변경: src/App.tsx RecordForm, src/app.css의 목록 상단, src/record-filter.test.tsx, e2e/devices/record-course-picker.pw.ts. 격리 사본 /tmp/study-record-picker-20261004에서 최신 공개 소스3848645를 기준으로 작업했으며 공유 checkout/index와 병행 변경을 보존한다. 추적 MAN-32.

로컬 확인: 관련 Vitest9통과, 타입/Pages 생산빌드와68CSS 검사0오류. 92개 첫 과목→다른 과목 선택→두 글 작성→새로고침 복원→0개 과목 안내→과목명 검색→두 과목 한 회차 저장·공백/줄바꿈 보존을 다섯 WebKit 환경에서5/5첫 통과했다. 기기 근거 work/device-runs/run-4EYIlY. 공개 적용·CI 결과는 배포 후 같은 문서에 추가한다. 물리기기/IME/개인 계정 Sync·학습효과는 별도다.
