# 본 작업 체크리스트 재대조·가능한 잔여 실행 — 2026-10-03

**요청한 웹앱7항목은 이미 실제 마감됐고, 이번에는 합성 학기 저장·복원 회귀와 불안정했던 관련 브라우저 경로를 마감했다. 본 작업 전체 종료는 아직 아니다.** 최신 판정은 [마무리 체크리스트](project-closure-checklist-20261002.md), 비교용 이전 가정은 [착수 전 기준](project-closure-baseline-20261002.md)에 둔다. 추적은 [MAN-27](https://linear.app/manseeksong/issue/MAN-27/본-작업-체크리스트-재검증학기-누적-저장과-복원-마감)이다.

## 완료한 실행

1. 최신 인계·통합/교재/Figma/모바일 정본·Linear·현재 채팅 상태를 대조했다. 통합4683471/CI37060845646/운영v35/719자산·실행 ZIP과 후속 공개15feb28/CI37091693073의 완료 근거를 재사용했다. 이전의 첫 저장 운영 미반영·Storage 탈퇴 미구현·239Figma 레이아웃 미반영은 현재 잔여에서 제거했다.
2. 운영 `study-command ACTIVE v35`, `study-openai-api ACTIVE v8`와 첫 저장 초기화/탈퇴 경로를 읽기 전용으로 확인했다. 탈퇴4RPC의 `SECURITY DEFINER`·빈 `search_path`, anon/authenticated 실행 불가·service_role 실행 허용을 재확인했다. 이 확인은 전체 보안 감사나 새 실제 탈퇴 시험이 아니다.
3. 실제 PersonalRepository·IndexedPersonalJournal·도메인 명령·통계·ZIP 백업/복원 경로에 격리 학기 회귀를 추가했다.15합성 주/3과목/18주제/45기록/15공부사건/30활동, 오프라인2회→재열기/재연결, 응답 유실→재시도/중복 방지, 이름 변경의 ID 보존, 휴지통/복원, 인출1회, 자유 글/Canvas 좌표를 연결했다.
4. 원문 CRLF/NUL/단독 UTF16·미완 초안·개인 서체를 ZIP→새 IndexedDB/Storage에서 대조했다. 서버 데이터가 없는 캐시 시작에서도 복원본이 유지되는 것을 확인한 뒤 모의 서버와 대조했다. 다른 소유자 백업은 거부되고 인증정보는 내보내지 않는다. 실제 API·실제 학기 날짜/공부·운영 쓰기를 생성하지 않았다.
5. 시험용 esbuild가 Vite `?url` import를 처리하지 못해 PDF worker의 default export 오류로 시작에 실패했다. `scripts/device-ai-fixture.mjs`에 명시 URL 자산 처리만 추가하여 시험 환경을 보수했다. 제품 코드/공개 빌드/다른 채팅의 UI 구현은 변경하지 않았다.
6. 이전 공개15feb28의 고정 생산 빌드를 복제·manifest 기록하고 관련 WebKit 경로를 반복했다. 원문 복원/복원 실패 차단/빠른 편집/다른 창 설정/복습 묶음5흐름×5환경×2회=50통과. 휴대전화 가로의 책상 목록/실제 스크롤 후 메모·통계2흐름×2회=4통과. 합계54회, 실패/재시도/생략0이다. 복습 묶음의 생성은 현재 공유 소스의 격리된 합성 API 화면을 사용하며 고정 생산 UI 검사와 구별한다.

## 최종 확인

| 확인 | 결과 | 증거 |
|---|---|---|
|학기 저장/복원·전체 백업·탈퇴 복구 관련 단위|4파일23통과|`work/project-closure-20261003/related-tests-final.log`|
|공유 소스 타입|`tsc --noEmit` exit0|`work/project-closure-20261003/typecheck-final.log`|
|5환경 반복 브라우저|50통과/재시도0/생략0|`work/device-runs/run-jEZsRc/results.json`와 `build-manifest.json`|
|휴대전화 가로 책상/스크롤 반복|4통과/재시도0|`work/device-runs/run-PGaygM/results.json`와 `build-manifest.json`|
|합성 학기 원기록/집계·백업|15주/45기록·30활동·독립시도/성공0,62395바이트 백업|`work/project-closure-20261003/semester-result.json`|
|운영 읽기/진행 채팅 대조|함수 버전/권한과9개 활성 작업의 최근 상태|`work/project-closure-20261003/current-state.json`|
|범위/고정 빌드/반복 결과|54통과와 새 후보의 미포함 경계|`work/project-closure-20261003/browser-result.json`|

초기 학기 검사의 Canvas fixture가 `node:` 접두사를 누락한 실패는 시험 자료 정정이며 제품 결함 보수로 보고하지 않는다. 초기 브라우저 서버 시작 실패는 `device-regressions.log`, 수정 후 결과는 `device-regressions-fixed.log`, 책상 결과는 `desk-regressions.log`에 보존했다. 처음부터 모두 통과했다고 표현하지 않는다. 기존 선택 성능 검사와 관련 없는 전체 CI를 이번 실행에서 반복하지 않았다.

## 진행 중과 남은 조건

다른 활성 채팅의 실제 최근 턴을 읽었다. 모바일3문제(하단 메뉴의 버튼/초점 가림·현재 메뉴 숨김·좁은 본문 공백), 버튼/창/메뉴/화면 이동 모션, 물리·화학·벡터 관찰 확장/배포, 지식 표현 공개 대조와 재게시 추적은 각 채팅에서 진행 중이다. 원격 main71fef95/Pages37105323970은 최종 조회 당시 in_progress이며 이번54회 검사 대상으로 선체크하지 않았다. 통합7항목의 기존 완료와 새 후보의 완료 조건을 구별한다.

Figma MCP의 지정 노드52:5148 메타데이터 읽기는 성공했으나, 편집 API에서 동일 노드를 읽는 호출은 실패했다(Debug `6b2cd585-b20d-4b80-b5c3-46082580af2d`, `safeToRetryWithoutCanvasRead:false`). 이 경로로 새 변경을 실행하지 않았다. 다른 채팅 「천문대 콘셉트로 OS UX 정체성 설계 (2)」는 로컬 플러그인을 복구하고 실패 배치 상태/공백 복구 사례/95%서체 인식을 확인했다. 기존 정본의 잔여96root·26root 실패 상태·16재사용 본문 등의 전체 마감 수치는 그 채팅의 최종 결과를 기다려 갱신한다. 로컬 복구가 가능한 상태를 전체 접근 불가로 보고하지 않는다.

합성 학기 저장 생애주기는 완료했지만 실제 강의계획/학기 날짜·과제/중간·기말·출석·API 생성→검토/풀이/피드백/복습을 포함한 전 과정은 남았다. 실제 기기의 IME/Pencil/VoiceOver·알림·두 기기 교대/장기 사용과 민석의 공부를 자동검사로 대체하지 않는다. Q01–Q15의 담당 본문은 iCloud dataless로 이번 새 읽기를 완료하지 못했으며 기존 채택 항목/착수 전 기준표를 재사용했다. 미대조를 통과로 바꾸지 않는다.

화요일2026-10-06까지 쿠폰 사용 금지와 이 대화의 화요일 이후 신규 과목 생성 조건을 지켰다. 다른 채팅에서 이미 별도 시작한 교재 구현은 현재 근거로만 대조했다. 이번에는 유료 API 호출·사용량 리셋·개인 원장/첨부 수정·운영 쓰기·새 배포·다른 채팅에 메시지 전달을 실행하지 않았다. 후속 예약도 만들지 않았다.

채택한 방법은 기존 진행 보고 정책/Q01–Q15·데이터 계약, PersonalRepository/IndexedDB/ZIP 실제 경로, 격리 합성 자료, Vitest·고정 빌드 Playwright/manifest·운영 읽기 대조다. `study-fix-issue`와 `figma-use`, Supabase 읽기 지침을 해당 범위에 적용했다. 새로 만든 부분은 여러 주차를 연결한 저장/복원 회귀와 시험 환경의 Vite URL 처리이며, 이를 공식 표준·학습 효과로 표현하지 않는다.
