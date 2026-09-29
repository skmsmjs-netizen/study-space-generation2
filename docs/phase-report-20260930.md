# 2026-09-30 주요 Phase 진행 및 CORE45 재대조

검증 대상 구현 commit: `7b911a4630b4e0783dcf728482c91f307ea14812`. 작성: 2026-09-29T15:46:42.223149+00:00. 과거 62개 자동검사/일부 브라우저 기록과 분리합니다. 이번 통합은 119개 통과/성능1개 미실행입니다. 기존 보고는 삭제하지 않습니다.

각 Phase는 전체 요구를 아직 닫지 않아 **미검증**입니다. 배포 성공·구현 존재·부분 실제 동작은 각 증거에만 통과로 기록합니다. 아래 CORE 판정은 이번 변경 범위의 대조이며, 전제품 CORE 원장 행을 자동 승격하지 않습니다.

## [Phase 05] GitHub Pages 최초 배포

상태: **미검증**

- 목표: 공개 코드 원격과 실제 배포 버전을 확인
- 기존 요구사항과 근거 ID: WORK.R07, FEATURE.F48, CORE.C27/C40
- 변경 파일: 현재 repo와 Pages 정상 공개, 7b911a4 Actions 36591993097 성공. 비공개 자료는 추가하지 않음
- 데이터 영향: 기존 원본을 수정하지 않았습니다. 가짜 demo에 criteria/assignment 선택 컬렉션과 수정이력이 추가되며 과거 기록의 원문·정의·ID를 재작성하지 않습니다.
- 구현: 현재 repo와 Pages 정상 공개, 7b911a4 Actions 36591993097 성공. 비공개 자료는 추가하지 않음
- 자동 검증: 통과 — npm test 119개, npm run build. 실행 범위는 validation/resume-execution.json.
- 실제 UI 검증: 통과 — 해당되는 B01–B09 범위만. 전체 상태는 미검증.
- 물리기기 검증: 미검증 — iPhone 17 Pro 두 줄 입력·복귀의 본문/줄바꿈 보존 사용자 보고 P01 수신. 가림은 없어 보인다는 한정 관찰. 전체기기 상태는 미검증.
- 동기화 검증: 미검증 — demo 로컬 저장이며 Supabase Auth/CRUD·상대기기 수신 없음.
- 성능: 미검증 — 이번에 domain 성능 opt-in 시험은 실행하지 않았으며 장기누적 입력/통신 미실측.
- 발견한 문제: 깊이8 잘림, 자유기록 단일슬롯, 활동 예외 입력 미제공, 기준 정의 덮기, quota 후 화면이동 손실, 좁은 홈 핵심카드 밀림, 구 C2 자동 재노출, 기준 Undo 내부참조 오인.
- 수정과 원인: 실제 ID와 현재기준/과거정의 분리, 반복/예외 UI, route context, 현재창 RAM rescue, iterative 목차, 공통 메뉴/탐색 적용. 근본범위와 제한은 resume-ui.md.
- 회귀검증: 자동119개/실제 B01–B09. quota·손상disk·개인기준 적용/Undo·새사건·기존원문 보존을 포함.
- 남은 문제: Auth callback과 모든 좁은폭/테마 상태 미검증; Phase4의 원장 전수 완료 승격도 없음
- 미검증 범위와 이유: 물리기기·서버 수신·전체원문 의미·장기사용. 접근/구현되지 않은 범위의 결과를 추정하지 않습니다.
- Commit/배포 버전/artifact: 17bba77, 7b911a4; Actions36591993097; validation/resume-execution.json, validation/resume-ui.md.
- 다음 Phase와 정확한 다음 행동: 06–09의 남은 UX와 전체기기 검증을 마치고 10 Auth로 이동
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래 C01–C45 전부 적용. 이번 실행이 추가되었지만 역사적 통과를 전제품 통과로 승격하지 않습니다.

## [Phase 07] 공통 Components

상태: **미검증**

- 목표: NavigationBar·ContextMenu 계약/구현 차이를 실제 사용으로 닫음
- 기존 요구사항과 근거 ID: WORK.R05, COMPONENT.NavigationBar, COMPONENT.ContextMenu, CORE.C07/C08
- 변경 파일: src/ui/navigation-bar.*,context-menu.*,index.tsx. 별도21종 export; 기존8+새7 자동검사; B05/B09 실제조작
- 데이터 영향: 기존 원본을 수정하지 않았습니다. 가짜 demo에 criteria/assignment 선택 컬렉션과 수정이력이 추가되며 과거 기록의 원문·정의·ID를 재작성하지 않습니다.
- 구현: src/ui/navigation-bar.*,context-menu.*,index.tsx. 별도21종 export; 기존8+새7 자동검사; B05/B09 실제조작
- 자동 검증: 통과 — npm test 119개, npm run build. 실행 범위는 validation/resume-execution.json.
- 실제 UI 검증: 통과 — 해당되는 B01–B09 범위만. 전체 상태는 미검증.
- 물리기기 검증: 미검증 — iPhone 17 Pro 두 줄 입력·복귀의 본문/줄바꿈 보존 사용자 보고 P01 수신. 가림은 없어 보인다는 한정 관찰. 전체기기 상태는 미검증.
- 동기화 검증: 미검증 — demo 로컬 저장이며 Supabase Auth/CRUD·상대기기 수신 없음.
- 성능: 미검증 — 이번에 domain 성능 opt-in 시험은 실행하지 않았으며 장기누적 입력/통신 미실측.
- 발견한 문제: 깊이8 잘림, 자유기록 단일슬롯, 활동 예외 입력 미제공, 기준 정의 덮기, quota 후 화면이동 손실, 좁은 홈 핵심카드 밀림, 구 C2 자동 재노출, 기준 Undo 내부참조 오인.
- 수정과 원인: 실제 ID와 현재기준/과거정의 분리, 반복/예외 UI, route context, 현재창 RAM rescue, iterative 목차, 공통 메뉴/탐색 적용. 근본범위와 제한은 resume-ui.md.
- 회귀검증: 자동119개/실제 B01–B09. quota·손상disk·개인기준 적용/Undo·새사건·기존원문 보존을 포함.
- 남은 문제: disabled/긴이름/터치/VoiceOver와 전체21종 상태matrix 실제 전수 미검증
- 미검증 범위와 이유: 물리기기·서버 수신·전체원문 의미·장기사용. 접근/구현되지 않은 범위의 결과를 추정하지 않습니다.
- Commit/배포 버전/artifact: 17bba77, 7b911a4; Actions36591993097; validation/resume-execution.json, validation/resume-ui.md.
- 다음 Phase와 정확한 다음 행동: 남은 상태matrix를 각 실제 화면에서 조작하고 물리 결과를 기록
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래 C01–C45 전부 적용. 이번 실행이 추가되었지만 역사적 통과를 전제품 통과로 승격하지 않습니다.

## [Phase 08] 가짜 데이터 UI Prototype

상태: **미검증**

- 목표: 개인기준·기록예외·자유서술·초안·Navigation의 누락된 조작을 구현
- 기존 요구사항과 근거 ID: WORK.R02–R06, UI.UI01/UI.UI23, INPUT.T01/INPUT.T13, CORE.C04/C09/C10/C17
- 변경 파일: src/App.tsx,domain/criteria.*,ui/criteria-editor.*,trace-editor.*,outline-tree.*,navigation-context.*,data/draft-safety.ts,app.css
- 데이터 영향: 기존 원본을 수정하지 않았습니다. 가짜 demo에 criteria/assignment 선택 컬렉션과 수정이력이 추가되며 과거 기록의 원문·정의·ID를 재작성하지 않습니다.
- 구현: src/App.tsx,domain/criteria.*,ui/criteria-editor.*,trace-editor.*,outline-tree.*,navigation-context.*,data/draft-safety.ts,app.css
- 자동 검증: 통과 — npm test 119개, npm run build. 실행 범위는 validation/resume-execution.json.
- 실제 UI 검증: 통과 — 해당되는 B01–B09 범위만. 전체 상태는 미검증.
- 물리기기 검증: 미검증 — iPhone 17 Pro 두 줄 입력·복귀의 본문/줄바꿈 보존 사용자 보고 P01 수신. 가림은 없어 보인다는 한정 관찰. 전체기기 상태는 미검증.
- 동기화 검증: 미검증 — demo 로컬 저장이며 Supabase Auth/CRUD·상대기기 수신 없음.
- 성능: 미검증 — 이번에 domain 성능 opt-in 시험은 실행하지 않았으며 장기누적 입력/통신 미실측.
- 발견한 문제: 깊이8 잘림, 자유기록 단일슬롯, 활동 예외 입력 미제공, 기준 정의 덮기, quota 후 화면이동 손실, 좁은 홈 핵심카드 밀림, 구 C2 자동 재노출, 기준 Undo 내부참조 오인.
- 수정과 원인: 실제 ID와 현재기준/과거정의 분리, 반복/예외 UI, route context, 현재창 RAM rescue, iterative 목차, 공통 메뉴/탐색 적용. 근본범위와 제한은 resume-ui.md.
- 회귀검증: 자동119개/실제 B01–B09. quota·손상disk·개인기준 적용/Undo·새사건·기존원문 보존을 포함.
- 남은 문제: 형제정렬/대량관리·긴글커서/내부스크롤·전체Modal초안·전체요구 의미전수 미완
- 미검증 범위와 이유: 물리기기·서버 수신·전체원문 의미·장기사용. 접근/구현되지 않은 범위의 결과를 추정하지 않습니다.
- Commit/배포 버전/artifact: 17bba77, 7b911a4; Actions36591993097; validation/resume-execution.json, validation/resume-ui.md.
- 다음 Phase와 정확한 다음 행동: 현재 상세 UX부터 닫고 Phase9의 A–G/물리맥락 검증 뒤에 온라인으로 진행
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래 C01–C45 전부 적용. 이번 실행이 추가되었지만 역사적 통과를 전제품 통과로 승격하지 않습니다.

## [Phase 09] 핵심 UX 검증

상태: **미검증**

- 목표: 자동검사와 별도로 실제브라우저 UX를 관찰
- 기존 요구사항과 근거 ID: WORK.R06, UI.UI01–UI.UI38, FAILURE.FM01–FM40, CORE.C18–C25/C30–C35
- 변경 파일: validation/resume-ui.md B01–B09; 390px 홈 첫카드/메뉴/기준/Back·검색, Pages상세reload
- 데이터 영향: 기존 원본을 수정하지 않았습니다. 가짜 demo에 criteria/assignment 선택 컬렉션과 수정이력이 추가되며 과거 기록의 원문·정의·ID를 재작성하지 않습니다.
- 구현: validation/resume-ui.md B01–B09; 390px 홈 첫카드/메뉴/기준/Back·검색, Pages상세reload
- 자동 검증: 통과 — npm test 119개, npm run build. 실행 범위는 validation/resume-execution.json.
- 실제 UI 검증: 통과 — 해당되는 B01–B09 범위만. 전체 상태는 미검증.
- 물리기기 검증: 미검증 — iPhone 17 Pro 두 줄 입력·복귀의 본문/줄바꿈 보존 사용자 보고 P01 수신. 가림은 없어 보인다는 한정 관찰. 전체기기 상태는 미검증.
- 동기화 검증: 미검증 — demo 로컬 저장이며 Supabase Auth/CRUD·상대기기 수신 없음.
- 성능: 미검증 — 이번에 domain 성능 opt-in 시험은 실행하지 않았으며 장기누적 입력/통신 미실측.
- 발견한 문제: 깊이8 잘림, 자유기록 단일슬롯, 활동 예외 입력 미제공, 기준 정의 덮기, quota 후 화면이동 손실, 좁은 홈 핵심카드 밀림, 구 C2 자동 재노출, 기준 Undo 내부참조 오인.
- 수정과 원인: 실제 ID와 현재기준/과거정의 분리, 반복/예외 UI, route context, 현재창 RAM rescue, iterative 목차, 공통 메뉴/탐색 적용. 근본범위와 제한은 resume-ui.md.
- 회귀검증: 자동119개/실제 B01–B09. quota·손상disk·개인기준 적용/Undo·새사건·기존원문 보존을 포함.
- 남은 문제: 물리 iPhone/iPad, nativeIME, 회전/SplitView, A–G 전부, 전체inventory actual UI 미검증
- 미검증 범위와 이유: 물리기기·서버 수신·전체원문 의미·장기사용. 접근/구현되지 않은 범위의 결과를 추정하지 않습니다.
- Commit/배포 버전/artifact: 17bba77, 7b911a4; Actions36591993097; validation/resume-execution.json, validation/resume-ui.md.
- 다음 Phase와 정확한 다음 행동: 수신한 iPhone 17 Pro P01을 연결하고, 브라우저만으로 가능한 나머지 조작도 계속
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래 C01–C45 전부 적용. 이번 실행이 추가되었지만 역사적 통과를 전제품 통과로 승격하지 않습니다.

## CORE CHECKSUM 45

| ID | 이번 변경 범위의 상태 | 근거·남은 조건 |
| --- | --- | --- |
| C01 | 미검증 | 1세대 보존1851파일 변경0/누락0 검사. 실제 이관과 연구 전체 의미 승계는 후속. |
| C02 | 미해결 | 기존 미완4행과 추가5행 유지. 665발화의 추가 미완 발견 가능성은 열려 있음. |
| C03 | 미검증 | 33쪽 실제 이미지 검토·PDF90행 연결. 외부 링크와 전체 기능 검증은 미완. |
| C04 | 미검증 | 개인 기준 새ID/원기록 보존·새 공부 미체크·C2 제외 경계 구현. 전체 이관은 미검증. |
| C05 | 미검증 | UX112/32영역 연결 및 홈 수정. 대시보드 연구 전체 구현은 미완. |
| C06 | 미검증 | 좁은 홈 첫카드와 대상 메뉴 검증. A–G 비교 조작수·전체 법칙 기준은 미검증. |
| C07 | 미검증 | 기존 토큰 재사용. 전체 Light/Dark·상태·대비·모션 matrix는 미검증. |
| C08 | 미검증 | 계약21/구현21로 변경, 공통 자동15개 통과·메뉴 실제키 검증. 물리 터치/VoiceOver 미검증. |
| C09 | 미검증 | 본문 없는 공부·자유기록 분리·활동 보류/메모/반복 구현. 전체 실제 저마찰 시나리오 미검증. |
| C10 | 미검증 | 초안 route/reload·quota RAM rescue·손상 원본 비덮기 검사. 강제종료·OS퇴거·모든 modal draft 미검증. |
| C11 | 미검증 | 같은과목 부모 이동 Undo·위험 메뉴와 휴지통 확인 보존. 모든 위험경로 미검증. |
| C12 | 미검증 | 기존 domain 소속 검사 회귀 유지. 온라인/RLS/이관 무결성 미검증. |
| C13 | 미검증 | Canvas 파생 View 계약 보존, 구현 미착수. |
| C14 | 미검증 | 자동 Canvas 생성 결정은 유보 유지, 실제사용 근거 미검증. |
| C15 | 미검증 | demo localStorage와 정식 IDB/queue/server 역할을 구분. 정식 계층 미구현. |
| C16 | 미검증 | 원본 직접수정 없이 독립 repo만 변경. 이관/복구 구현은 후속. |
| C17 | 미검증 | 현재 ID·draft·revision·Undo 일부검사. Backup/Export/Conflict 포함 전체는 미검증. |
| C18 | 미검증 | 390px 핵심조작 개선. iPhone/iPad/Mac 물리사용 맥락 미검증. |
| C19 | 미검증 | 390×844/672×941 브라우저 관찰. 회전·Split View·키보드 및 전체 테마 matrix 미검증. |
| C20 | 미검증 | 합성 composition와 실제 브라우저 메뉴key/Back초점 확인. native 한글IME·물리키보드 가림 미검증. |
| C21 | 미검증 | 깊이16·동명·연속입력·저장실패 자동검사. 전체 대량/실기 상태 미검증. |
| C22 | 미검증 | stale snapshot/기준 토큰·Undo 충돌 검사. 서버 순서역전/다기기 sync conflict 미검증. |
| C23 | 미검증 | 새 프레임워크 없음. 장기누적 파싱·집계·검색·Canvas/Sync 성능 미검증. |
| C24 | 미검증 | UI38·PUI20 유지, B01–B09 실제 조작 연결. 전체탭/조건부 상태 미검증. |
| C25 | 미검증 | 학기 전체 E2E 미실행, 기존 단위/통합시험으로 대신하지 않음. |
| C26 | 미검증 | F49행 목적지와 분류 보존. 일정/온라인강의/Anki 등 전체 구현 미완. |
| C27 | 통과 | 이번 입력은 demo namespace의 가짜 문구만 사용, 개인자료 가져오기 없음. |
| C28 | 미검증 | 1세대 원본과 기존ID/기준/본문 보존. 실제migration·첨부/Canvas배치 roundtrip 미검증. |
| C29 | 통과 | 동적호출/호환 경로를 삭제하지 않음. 이번 변경의 dead-code 정리 없음. |
| C30 | 미검증 | 자동실행/실제UI 보고를 분리. 전체 UX QA+Engineering QA gate 미검증. |
| C31 | 미검증 | 초안실패·깊이잘림·정의덮기·C2 재노출·Undo 의존성 문제 수정/회귀. 전체미완 유지. |
| C32 | 통과 | 119자동검사와 build/배포를 제품전체 완료로 표현하지 않음. |
| C33 | 통과 | 자동/실제브라우저/물리/서버/장기사용 열 분리 유지. |
| C34 | 통과 | 확인하지 않은 범위는 미검증 유지, 원장 전체 통과 승격 없음. |
| C35 | 통과 | 학기시뮬레이션 미실행·장기사용/학습효과 주장 없음. |
| C36 | 미검증 | 확인한 시작/메뉴/개인기준 화면은 내부JSON 없음. 전체 오류/서버 상태 미검증. |
| C37 | 미해결 | 개인기준 원본 trace-basis와 최신퇴역필드 정정을 우선. 과거665발화 의미전수 미완. |
| C38 | 미검증 | 필요한 quota·stale·회귀 실행. 이번 성능시험1은 미실행 명시. |
| C39 | 통과 | 기존 React/TypeScript/native UI 재사용, 새 의존성/범용 프레임워크 추가 없음. |
| C40 | 미검증 | 공개remote·2개 새 구현commit·CI배포·실제asset/상세reload 확인. Authcallback과 후보판 미검증. |
| C41 | 통과 | 초기 Git clean 확인·담당파일 분리·원본과 다른작업 변경 revert 없음. |
| C42 | 미검증 | F49 A–E분류/대체·연결 존재. 원문전수 및 미결정4건과 실제검증 미완. |
| C43 | 미검증 | Dashboard는 이번 홈 접근성 범위만 변경. 연구기반 전체 통계/대시보드 미구현. |
| C44 | 통과 | 1세대 소스의 기준변경 의미를 직접 확인하여 계승, 원본미변경. |
| C45 | 미해결 | CORE45전부 이번표 대조, 1366행 자동무결성·음성fixture. 의미전수는 미완으로 보존. |

중단/완료 구분: 이번은 맥락 인계가 필요한 구현·검증·배포 중간 지점입니다. 전체완료·실사용후보·안정판1.0이 아닙니다. 독립 미완 작업을 외부 계정 차단으로 바꾸어 설명하지 않습니다. 정확한 열린 요구와 다음 행동은 execution-ledger.json 및 resume-handoff.md에 유지합니다.
