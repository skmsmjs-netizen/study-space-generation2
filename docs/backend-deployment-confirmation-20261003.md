# 백엔드 운영 반영 확인 — 2026-10-03

사용자 「너는 백엔드를 개발해」와 「운영 DB·서버 반영 승인」, 후속 「배포해」의 대상인 백엔드는 운영에 반영돼 있다. 승인 후 배포한 v34의 구현이 현재 운영 `study-command` v35에도 포함돼 있음을 실제 운영 메타데이터·소스·HTTPS 응답으로 재확인했다. 확인 시각은 2026-10-03 19:36 KST이다.

## 실제 운영 결과

- Supabase 프로젝트: `lbuiwotjisbzgflixjvg`.
- Edge Function: `study-command`, **v35 ACTIVE**. 현재 운영 소스에 `study_read_workspace_conditional`, `readConditional`, `readCommandRequestText`가 모두 존재한다.
- 운영 마이그레이션: `20261001173455`, `conditional_workspace_read`.
- RPC: `study_read_workspace_conditional(uuid,text,bigint)`. `SECURITY DEFINER`, 빈 `search_path`; `anon`과 `authenticated` 실행 불가, `service_role` 실행 가능.
- 실제 HTTPS: OPTIONS **204**, 지원하지 않는 GET **405**, 인증 없는 POST **401**, 잘못된 토큰의 POST **401**. CORS와 `Cache-Control: no-store` 응답도 확인했다.
- 현재 운영 소스: 281,061 UTF-8 바이트, SHA-256 `584f50e20637cd2e51af301707229e17fc60bfe83a9ecd56279216f969a21be8`. 플랫폼 배포 ZIP의 해시와 소스 해시는 구별한다.

이번 확인은 읽기와 인증 거부 확인만 수행했다. 운영 DB 변경·개인 기록 시험 쓰기·Edge 재배포는 **0건**이다. 다른 작업이 추가한 현재 v35를 유지했으며 이전 v34로 덮어쓰지 않았다.

## 구현과 검증의 범위

조건부 조회, 요청 본문 크기 제한과 읽기 실패 처리, 기존 저장 계약 보존, 승인 후 실제 배포 과정은 [백엔드 구현 기록](backend-development-20261002.md)이 소유한다. 그 기록의 격리된 DB 조건 23개 통과와 ROLLBACK 후 잔여 시험자료 0건은 당시의 검증이며, 오늘 다시 시험자료를 쓰거나 전체 검사를 반복하지 않았다.

오늘의 운영 확인은 [확인 근거 JSON](../work/pages-redeploy-20261003/backend-deployment-confirmation.json), `backend-live-acl-result.json`, `backend-live-http.json`, 현재 소스 `live-study-command-v35.ts`에 보존했다. 실제 로그인 계정으로 브라우저에서 저장하고 재접속하는 흐름과 다기기 Sync는 이번 운영 확인에 포함하지 않았다. 서버 반영과 인증 거부 응답을 제품 전체 검증으로 확대하지 않는다.

## 프론트엔드 통합과의 구분

이 대화에서 백엔드 요청을 병행 프론트엔드 Pages 통합 배포까지 확대한 것은 작업 범위 판단 오류였다. 백엔드 완료가 해당 통합 CI의 완료를 기다려야 하는 것은 아니다. 이 대화의 프론트엔드 확인에서는 새 공개 게시 성공을 확보하지 못했으며 별도 병행 작업의 진행 결과를 배포 완료로 보고하지 않는다. 중간 후보·실패·취소의 근거는 [프론트엔드 확인 기록](frontend-deployment-20261003.md)에 남긴다.
