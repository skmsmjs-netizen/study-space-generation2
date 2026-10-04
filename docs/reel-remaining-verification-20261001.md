# 릴스 적용 후 남은 성능·실제 서버 검증 · 2026-10-01

사용자 “다 해”에 직전 배포 보고에서 남긴 선택 성능 검사와 실제 서버 저장·다른 창 전달·재접속·오프라인 복귀를 수행했습니다. 현재 공개 버전 d4560dca4bf95ff91b8c9b77b3a0f7920560b86a에 기존 릴스 반영 커밋 7b1594f가 포함됩니다. [Pages36852509816](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36852509816)의 배포 성공과 공개 진입 파일의 지문을 확인했습니다. 이번 후속 작업에서 운영 코드를 새로 수정하거나 배포하지 않았습니다.

## 적용한 방법

프로젝트의 기존 `study-deploy`, `docs/sync-performance.md`, 선택 `src/domain/performance.test.ts`, 다섯 WebKit 환경 및 기존 공개 저장 왕복 방법을 재사용했습니다. 실제 Auth 시험은 [Supabase signInWithPassword 공식 문서](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)에 따른 기존 앱 로그인 경로를 사용했습니다. 운영 계정의 비밀번호·세션이나 기존 개인 자료를 가져오지 않았습니다. 별도 합성 계정의 생성·이메일 확인·승인 상태는 시험 준비로 설정했으므로 가입 화면·이메일 수신·관리자의 승인 버튼 검증과 구별합니다.

## 누적 자료 성능

기록10,000·공부 회차10,000·수정 이력10,000·목차880·과목80·학기8, 직렬화19,368,394바이트의 합성 자료에서 기존 선택 검사1개가 통과했습니다. 세 관측의 검증 시간은62.09/31.88/30.04ms, 본문 한 곳 변경은95.72/67.73/62.53ms입니다. 기존 원장과 다른 기록의 불변·변경한 본문의 정확성을 확인했습니다. 승인된 속도 예산이 있는 시험은 아니며 Mac 도메인 계산을 실제 iPhone/iPad의 입력 지연이나 전체 저장 속도로 표현하지 않습니다.

증거: `work/reel-remaining-verification-20261001/{domain-benchmark.log,domain-benchmark-results.json,benchmark-metrics.json}`. 결과를 잘못된 경로에 저장했던 최초 실행의 JSON도 `domain-benchmark-first-results.json`으로 보관했습니다.

## 공개 앱의 실제 서버 왕복

예비1회 통과 뒤 최종 다섯 환경5개 모두 통과했습니다. 실패·보류·flaky0입니다. iPhone 세로/가로, iPad 세로/가로/반 창 크기의 WebKit 모사이며 각 환경에서 독립된 두 브라우저 저장소와 비밀번호 로그인을 사용했습니다.

각 흐름에서 메모 생성→실제 서버 응답→두 번째 창 로그인/읽기→첫 창 수정→두 번째 창 자동 수신→첫 창 오프라인 수정/전송 대기→온라인 복귀/서버 응답→두 번째 창 자동 수신→새로고침 후 정확한 글을 확인했습니다. 앞뒤 공백과 줄바꿈을 그대로 보존했고 최종 편집 화면의 가로 넘침이 없었습니다. 공통 메모와 개인 저장·동기화 경로를 실제 서버와 연결한 근거이며 모든 기능의 Sync 완료로 확대하지 않습니다.

시험 계정의 마지막 서버 상태는 개인 공간 sequence30, 합성 메모6개, 공부 기록0·공부 회차0·관리자 지정0이었습니다. 해당 계정 하나만 삭제했고 users/identities/sessions/refresh tokens/workspaces/operations/permissions/profiles가 모두0임을 다시 조회했습니다. 임시 비밀번호 파일도 제거했습니다. 기존 민석 계정의 기록이나 AI 키·모델·상한·소유자 권한은 변경하지 않았습니다.

검사 시작과 종료의 공개 HTML·진입JS·CSS2개 SHA256이 같았으며 기존 성공 d456 산출물 지문과 일치합니다. 다른 대화의 후속 CI 취소/실패/진행 상태는 이번 공개 버전의 검증 결과와 구별합니다.

증거: `work/reel-remaining-verification-20261001/{public-two-context-all.log,public-two-context-results.json,public-assets-start.json,public-assets-end.json,public-assets-d456-comparison.json,verification.json}`. 각 환경의 합성 메모 화면은 같은 폴더 `test-results/`에 있습니다. 예비 실행과 ES module 검사 설정의 최초 오류 로그도 보존했습니다.

## 직접 남은 조건

USB와 사용 가능한 장치 연결을 확인했으나 iPhone/iPad가 발견되지 않았습니다. 실기기 연결과 잠금 해제를 요청했으며 답변은 아직 없습니다. 물리기기의 한국어 IME·Pencil·VoiceOver·실제 두 기기 사이 Sync 및 장기 관찰은 미검증입니다. Mac WebKit의 실제 서버 왕복을 물리기기 통과로 승격하지 않습니다.

## 작업 중 파일 손상

검증 출력 경로의 공백을 따옴표로 감싸지 않은 명령으로 `/Users/manseeksong/Documents/ChatGPT/학습` 파일에 결과 JSON을 덮어썼습니다. 이전 내용은 알 수 없으며 복원하지 못했습니다. 사용자에게 실수를 알리고 사과했습니다. 결과는 올바른 담당 폴더로 옮겼고 잘못 생성한 빈 폴더만 정리했습니다. 해당 파일이 복구됐다고 보고하지 않으며 종료한 보관본·백업을 임의 열람하지 않았습니다.


### 후속 정리 완료 · 사용자 “실수 해결해”

생성 명령과 시각을 추적한 결과 문제의 파일은 16:06:57에 다른 검증 명령의 경로가 공백에서 잘리며 처음 생성된 임시 시험 로그였습니다. 현재 성능 JSON을 정확히 보관/해시 확인 후 잘못된 부모 경로의 파일을 제거했습니다. shell=False 인자 배열·새 결과 폴더·기존 결과/링크 거부를 사용하는 실행기를 연결해 관련3검사와 실제 성능1검사를 통과했습니다. 이전 임시 오류 로그의 정확한 바이트는 복원하지 못했으며 motion의 별도 정상76개 결과는 남아 있습니다. [파일 출력 정리 결과](file-output-recovery-20261001.md)와 work/file-recovery-20261001/verification.json이 후속 상태를 담당합니다.
