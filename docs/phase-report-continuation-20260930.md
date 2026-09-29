# 2026-09-30 실제 다운로드·선택 글 복귀·조건부 UX 실행 보고

이 보고는 b783fb4 이후 실제 실행의 중간 도달점입니다. 전체 마이그레이션·P07/P08/P09 통과·1.0 완료가 아닙니다. 최신 명령문 전체와 원래 실행명령문/최초 요청·10개 감사 문서를 분할 재독했습니다. 서문 관련 원문/1세대 코드도 확인했습니다. HISTORY665는 기계적 위치/내용 대응과 의미전수 완료를 구별하며 이번 전체 의미정독을 주장하지 않습니다.

이번 검증 원자료는 프로젝트의 저장소 밖 `outputs/gen2-execution-20260930-023030/`에 보존합니다. 공개 가능한 새 로그·조작표·스크린샷만 docs/validation에 복제했습니다. 대화·Vault·개인 응답·비공개 locator·secret은 공개하지 않습니다.

실제 변경 코드 커밋: cfbd5d8(선택글 ID/펼침), b50ab37(보이는 메뉴초점), 06b2707(다운로드 회귀실행기). 검색482d302 및 기록필터d2e3164를 후속 반영했습니다. 최종 배포는 최신 인계·외부 final-release를 따릅니다.

## Phase 07 / 공통 Components

- 상태: **미검증** — 아래 좁은 수정·실행과 Phase 전체 판정을 구분합니다.
- 목표: 표시된 NavigationBar에 정확히 초점 복귀하고 조건부 검색 상태를 기존 계약으로 다룹니다.
- 기존 요구사항과 근거 ID: WORK.R05; CORE.C07/C08/C20; UI.UI22/UI23
- 변경 파일: src/ui/navigation-bar.tsx 및 test, src/ui/navigation-context.ts 및 test, src/App.tsx 검색 영역 및 src/search.test.tsx
- 데이터 영향: 개인 자료·Vault 무변경. demo 원문·ID·현재초안 보존; 선택 글 저장은 회차 증가 없음. 보기 힌트는 본문과 분리됩니다.
- 구현: 메뉴 identity를 명시하고 실제 표시된 복사만 초점 후보로 선택합니다. 검색의 빈 결과는 오류와 구분합니다.
- 자동 검증: 실패 재현 로그와 수정후 회귀를 continuation-* artifact로 보존합니다. 최종 통합 test/build 결과는 continuation-final-227-tests-20260930.txt 및 continuation-final-227-build-20260930.txt를 따릅니다. 합성 오류는 실제 OS/저장소 고장과 다릅니다.
- 실제 UI 검증: [B29 이후 실행](validation/continuation-ui-20260930.md). 실제 다운로드 수신·디스크 재열기, 서문 복귀/저장/접기,1280/390 메뉴초점, 최근 없음/다른범위/후속수정. 각각의 실행 환경·범위는 표에 명시했습니다.
- 물리기기 검증: 이번 새 직접 증거 없음. 과거 iPhone17Pro P01을 반복 요구하지 않고 긴표 요청의 답변은 미수신으로 남깁니다. IAB fill/390폭은 물리 IME가 아닙니다.
- 동기화 검증: 미검증. 기존 Supabase 로그인/Healthy를 현재 확인했지만 Auth/CRUD/RLS/server_peer는 구현·실행하지 않았습니다.
- 성능: 미검증. 일반 test에서 opt-in1개 건너뜀; 다운로드228000단위 원문은 응답성 benchmark가 아닙니다.
- 발견한 문제: 같은 href의 첫 링크(브랜드)를 선택하던 초점 복원과 숨은 넓은/좁은 메뉴 구별 누락. nonempty 무결과 검색의 안내 부재.
- 수정과 원인: 메뉴 identity를 명시하고 실제 표시된 복사만 초점 후보로 선택합니다. 검색의 빈 결과는 오류와 구분합니다.
- 회귀검증: 해당 실패 자동검사→수정후 동일 조건과 실제 화면 복귀; 전체 suite/type/build는 최종 로그를 따릅니다. 이미 구현된 긴표/F08를 다시 작성하지 않았습니다.
- 남은 문제: 현재 사용하는16종의 남은 상태·대비/감소된모션·실물 접근성과 선행 P06 조건. 미사용5종을 억지 추가하지 않습니다.
- 미검증 범위와 이유: 단일Mac의 브라우저 증거로 실제 iPhone/iPad/IME/Sync/장기사용을 대체할 수 없습니다. P09 minimum automated/browser/physical_device 및 P10/P11 선행을 유지합니다. 미래 Canvas/Backup/UI38 전부를 새 Prototype 선행조건으로 만들지 않습니다.
- Commit/배포 버전/artifact: 위 코드 commit·validation 파일과 외부 final-release.json/final-pages-run.json. 마지막 문서 commit도 main 배포후 localHEAD=remoteMain=ActionsheadSha를 확인합니다.
- 다음 Phase와 정확한 다음 행동: 해당 현재 범위의 잔여 상태/기기·baseline을 닫은 뒤 P09를 재판정합니다. 충족되면 기존 Supabase에 Auth→온라인CRUD/RLS/revision/version을 실제 연결·시험합니다. 현재 로그인 차단으로 설명하지 않습니다.
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래45행에서 이번 변화와 원래 남은 범위를 각각 유지합니다.

## Phase 08 / 가짜 데이터 UI Prototype

- 상태: **미검증** — 아래 좁은 수정·실행과 Phase 전체 판정을 구분합니다.
- 목표: 보관본 파일을 실제 수신·재열기하고 선택 글의 최초초안ID/펼침 복귀를 보존합니다.
- 기존 요구사항과 근거 ID: WORK.R03/R04/R13/R20; FEATURE.F15/F37; CORE.C10/C17; INV.INV18
- 변경 파일: src/App.tsx, src/App.test.tsx, scripts/check-archive-download.mjs
- 데이터 영향: 개인 자료·Vault 무변경. demo 원문·ID·현재초안 보존; 선택 글 저장은 회차 증가 없음. 보기 힌트는 본문과 분리됩니다.
- 구현: 기존 글/명시ID가 없을 때만 draft ID 복원; 기존owner/kind 검사 유지. 펼침은 본문과 별도 탭 보기힌트로 유지하며 힌트 오류가 입력을 차단하지 않습니다.
- 자동 검증: 실패 재현 로그와 수정후 회귀를 continuation-* artifact로 보존합니다. 최종 통합 test/build 결과는 continuation-final-227-tests-20260930.txt 및 continuation-final-227-build-20260930.txt를 따릅니다. 합성 오류는 실제 OS/저장소 고장과 다릅니다.
- 실제 UI 검증: [B29 이후 실행](validation/continuation-ui-20260930.md). 실제 다운로드 수신·디스크 재열기, 서문 복귀/저장/접기,1280/390 메뉴초점, 최근 없음/다른범위/후속수정. 각각의 실행 환경·범위는 표에 명시했습니다.
- 물리기기 검증: 이번 새 직접 증거 없음. 과거 iPhone17Pro P01을 반복 요구하지 않고 긴표 요청의 답변은 미수신으로 남깁니다. IAB fill/390폭은 물리 IME가 아닙니다.
- 동기화 검증: 미검증. 기존 Supabase 로그인/Healthy를 현재 확인했지만 Auth/CRUD/RLS/server_peer는 구현·실행하지 않았습니다.
- 성능: 미검증. 일반 test에서 opt-in1개 건너뜀; 다운로드228000단위 원문은 응답성 benchmark가 아닙니다.
- 발견한 문제: 미저장 최초 개요/서문/주제메모 재마운트에서 새 UUID가 생겨 자신의 초안이 불일치로 차단됨. 펼침 상태도 재마운트 때 닫힘.
- 수정과 원인: 기존 글/명시ID가 없을 때만 draft ID 복원; 기존owner/kind 검사 유지. 펼침은 본문과 별도 탭 보기힌트로 유지하며 힌트 오류가 입력을 차단하지 않습니다.
- 회귀검증: 해당 실패 자동검사→수정후 동일 조건과 실제 화면 복귀; 전체 suite/type/build는 최종 로그를 따릅니다. 이미 구현된 긴표/F08를 다시 작성하지 않았습니다.
- 남은 문제: 일부/막힘/바쁨/여러주제/몰아기록/장기복귀 맥락의 필요한 시작조건 대조와 범위표시 명확화. 정식 영구보존/온라인을 이 결과로 닫지 않습니다.
- 미검증 범위와 이유: 단일Mac의 브라우저 증거로 실제 iPhone/iPad/IME/Sync/장기사용을 대체할 수 없습니다. P09 minimum automated/browser/physical_device 및 P10/P11 선행을 유지합니다. 미래 Canvas/Backup/UI38 전부를 새 Prototype 선행조건으로 만들지 않습니다.
- Commit/배포 버전/artifact: 위 코드 commit·validation 파일과 외부 final-release.json/final-pages-run.json. 마지막 문서 commit도 main 배포후 localHEAD=remoteMain=ActionsheadSha를 확인합니다.
- 다음 Phase와 정확한 다음 행동: 해당 현재 범위의 잔여 상태/기기·baseline을 닫은 뒤 P09를 재판정합니다. 충족되면 기존 Supabase에 Auth→온라인CRUD/RLS/revision/version을 실제 연결·시험합니다. 현재 로그인 차단으로 설명하지 않습니다.
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래45행에서 이번 변화와 원래 남은 범위를 각각 유지합니다.

## Phase 09 / 핵심 UX 검증

- 상태: **미검증** — 아래 좁은 수정·실행과 Phase 전체 판정을 구분합니다.
- 목표: 미실행 시작조건과 실제 화면을 수행하고 조작·초점·문자·이동·판단을 구별합니다.
- 기존 요구사항과 근거 ID: WORK.R06; CORE.C06/C18–C20/C30–C35; UI.UI10/UI23
- 변경 파일: docs/validation/continuation-ui-20260930.md 및 실행 artifact; 앱 수정은 P07/08 파일과 같음
- 데이터 영향: 개인 자료·Vault 무변경. demo 원문·ID·현재초안 보존; 선택 글 저장은 회차 증가 없음. 보기 힌트는 본문과 분리됩니다.
- 구현: 최근 없음 A/다른 범위 E/후속수정 G를 실제로 실행하고 수치·한계를 기록. 독립 Chrome에서 실제 zoom 확인을 시도하며 결과 artifact를 분리합니다.
- 자동 검증: 실패 재현 로그와 수정후 회귀를 continuation-* artifact로 보존합니다. 최종 통합 test/build 결과는 continuation-final-227-tests-20260930.txt 및 continuation-final-227-build-20260930.txt를 따릅니다. 합성 오류는 실제 OS/저장소 고장과 다릅니다.
- 실제 UI 검증: [B29 이후 실행](validation/continuation-ui-20260930.md). 실제 다운로드 수신·디스크 재열기, 서문 복귀/저장/접기,1280/390 메뉴초점, 최근 없음/다른범위/후속수정. 각각의 실행 환경·범위는 표에 명시했습니다.
- 물리기기 검증: 이번 새 직접 증거 없음. 과거 iPhone17Pro P01을 반복 요구하지 않고 긴표 요청의 답변은 미수신으로 남깁니다. IAB fill/390폭은 물리 IME가 아닙니다.
- 동기화 검증: 미검증. 기존 Supabase 로그인/Healthy를 현재 확인했지만 Auth/CRUD/RLS/server_peer는 구현·실행하지 않았습니다.
- 성능: 미검증. 일반 test에서 opt-in1개 건너뜀; 다운로드228000단위 원문은 응답성 benchmark가 아닙니다.
- 발견한 문제: 과거 B20–28을 현재 측정으로 재사용할 수 없으며 글자 크기만의200%를 브라우저 zoom으로 읽을 수 없습니다.
- 수정과 원인: 최근 없음 A/다른 범위 E/후속수정 G를 실제로 실행하고 수치·한계를 기록. 독립 Chrome에서 실제 zoom 확인을 시도하며 결과 artifact를 분리합니다.
- 회귀검증: 해당 실패 자동검사→수정후 동일 조건과 실제 화면 복귀; 전체 suite/type/build는 최종 로그를 따릅니다. 이미 구현된 긴표/F08를 다시 작성하지 않았습니다.
- 남은 문제: 안전한1세대 baseline 비교, iPhone/iPad 필요한 물리기기 맥락과 IME/VoiceOver. 과거 P01 두줄 보고는 보존하나 긴표 새답변은 아직 없습니다.
- 미검증 범위와 이유: 단일Mac의 브라우저 증거로 실제 iPhone/iPad/IME/Sync/장기사용을 대체할 수 없습니다. P09 minimum automated/browser/physical_device 및 P10/P11 선행을 유지합니다. 미래 Canvas/Backup/UI38 전부를 새 Prototype 선행조건으로 만들지 않습니다.
- Commit/배포 버전/artifact: 위 코드 commit·validation 파일과 외부 final-release.json/final-pages-run.json. 마지막 문서 commit도 main 배포후 localHEAD=remoteMain=ActionsheadSha를 확인합니다.
- 다음 Phase와 정확한 다음 행동: 해당 현재 범위의 잔여 상태/기기·baseline을 닫은 뒤 P09를 재판정합니다. 충족되면 기존 Supabase에 Auth→온라인CRUD/RLS/revision/version을 실제 연결·시험합니다. 현재 로그인 차단으로 설명하지 않습니다.
- CORE CHECKSUM 결과 및 이전 대비 변경: 아래45행에서 이번 변화와 원래 남은 범위를 각각 유지합니다.

## CORE45 개별 대조

각 전체 계약 상태는 원장과 같이 미검증입니다. 코드/브라우저의 좁은 통과를 전체 계승·제품 완성으로 승격하지 않습니다.

| ID | 상태 | 이번 실제 영향·남은 범위 |
|---|---|---|
| C01 | 미검증 | 1세대1851개 중1849동일·기존 안내문서 추가2·누락0. 별도 generation2 변경이며 연구/피드백 의미 전체 이관은 미완. |
| C02 | 미검증 | 미완9행과 원장의 모든 기존 ID 유지. 미완 기능 전체 처리를 끝냈다는 뜻은 아님. |
| C03 | 미검증 | 기존 PDF33쪽/90원자 요구 및 audit를 재독. 이번에33쪽 이미지를 재실행해 읽었다고 주장하지 않음. |
| C04 | 미검증 | TRACE 하위ID·정의·기준·체크를 수정하지 않음. 선택 서문 저장은 공부 사건으로 세지 않음. 전체 옛기준 이관은 남음. |
| C05 | 미검증 | 선택 펼침·초안 복귀라는 원 UX 목적을 실제 화면에 반영. UX112/Dashboard 전체 적용은 남음. |
| C06 | 미검증 | 닫기/복귀 후 재입력과 재탐색을 줄이는 경로 수정. 비교 baseline이 없어 개선율/우수성을 주장하지 않음. |
| C07 | 미검증 | 기존 details/Textarea/EmptyState와 토큰 사용. 새 팔레트/글꼴 없음. 전체 대비·기기 상태는 미검증. |
| C08 | 미검증 | NavigationBar의 같은href 브랜드 혼동·숨은 메뉴 초점 수정.21계약/21구현/16제품사용/5미사용 유지. 전상태·물리 접근성 미검증. |
| C09 | 미검증 | 본문 없는 공부함1클릭·선택 글·회차 구분 실제 확인.11가지 기본 맥락과 각 기기 검증 전체는 남음. |
| C10 | 미검증 | 최초 서문/개요/주제메모 초안ID 복귀와 펼침 상태 보존 수정. 보기 hint 손상/거부 자동회귀. OS 종료/퇴거/IDB는 남음. |
| C11 | 미검증 | 다운로드 시작 실패/재시도·현재 원문 불변 확인. 자동적용/삭제 없음. 전체 Undo/휴지통 정책은 미완. |
| C12 | 미검증 | 서문 draft entity ID·owner/kind 격리 자동검사. 서버 RLS/소속 제약은 후속. |
| C13 | 미검증 | Canvas/Graph 파생 View 계약 그대로. 구현하지 않았고 Prototype 선행조건으로 확대하지 않음. |
| C14 | 미검증 | 자동 Canvas 생성/배치 변경 없음. 실제 필요성과 정책 판정은 후속. |
| C15 | 미검증 | localStorage 보관본·sessionStorage 보기힌트·정식 백업/IDB/서버 역할을 분리. 정식 저장 계층 미완. |
| C16 | 미검증 | 개인 원본 수정 없이 demo 사본을 제품에서 실제 다운로드. 정식 Import/Restore는 후속. |
| C17 | 미검증 | raw/metadata/식별자 수신파일 대조와 최초 draft ID 보존 추가. Backup/Revision/Conflict 전체는 미완. |
| C18 | 미검증 | Mac 환경 IAB 및 별도 headless Chrome 실행.390폭은 물리 iPhone이 아님. P01 과거 사용자 보고 유지. |
| C19 | 미검증 | 390/1280 dark 화면의 복귀·가로폭 확인. 브라우저 zoom 결과는 별도 근거를 따름. 실제 회전/Split View/키보드는 남음. |
| C20 | 미검증 | 메뉴 초점·본문 원문 복귀 확인. fill/합성 composition을 native IME·VoiceOver로 보고하지 않음. |
| C21 | 미검증 | 빈/228000단위/특수원문 파일 수신·실패재시도·좁은 복귀 확인. 전체 대량/깊이/연속 실험 완료 아님. |
| C22 | 미검증 | 기존 대상과 ID가 다른 초안 거부 자동회귀. 온라인 race·역순 응답·다기기 충돌은 후속. |
| C23 | 미검증 | 새 무거운 파싱·집계/Sync 추가 없음. 일반시험의 opt-in 성능 건너뜀은 측정 아님. |
| C24 | 미검증 | B29 이후 보관본/서문/초점/다른범위/조건부 검색 실행을 추가. UI38 전체 미완. |
| C25 | 미검증 | 한 학기→다음 학기/과거조회 E2E 미실행. 좁은 demo 조작으로 대체하지 않음. |
| C26 | 미검증 | 개요/서문/주제메모 목적을 보존. 일정·시험·Anki·자료 등 잔여 기능 계약 유지. |
| C27 | 미검증 | localhost4187 demo와 disposable Chrome profile 사용. 공개 origin/개인자료 손상 fixture 없음. |
| C28 | 미검증 | 원문 공백/줄바꿈/NUL/고립surrogate/ID/metadata/기존초안 보호. 전체 Canvas/첨부/이관 호환은 후속. |
| C29 | 미검증 | 기존 코드 삭제·dead-code 정리 없음. 동적 호출/호환 검토 의무 유지. |
| C30 | 미검증 | 자동 assertion·IAB 조작·Chrome 파일수신·사용자 물리 보고를 별도 기록. 전체 UX/Engineering QA 미완. |
| C31 | 미검증 | 초기초안ID 실패4개/초점 실패2개→원인수정→동일 자동회귀·실제 경로 재실행. 검색 빈 상태도 별도 증거 연결. |
| C32 | 미검증 | 자동검사만으로 완료하지 않고 실제 UI/수신파일 확인. 상위 Phase 미검증 유지. |
| C33 | 미검증 | 자동/브라우저/물리/서버/성능 증거의 차이를 유지. IAB 다운로드 timeout과 별도 Chrome 성공도 구분. |
| C34 | 미검증 | 열린 조건은 미검증. Supabase Healthy를 Auth/CRUD 통과로 쓰지 않음. |
| C35 | 미검증 | 장기사용·학습효과 실험 없음. 입력보존/체크 수를 효과로 표현하지 않음. |
| C36 | 미검증 | 검색무결과/보관본 오류/일반 홈을 확인. 원문은 보관본에서 의도해 열람. 전체 정상/오류 상태 누출검사 미완. |
| C37 | 미검증 | 최신 명령문·구체 과거 정정 우선. HISTORY665 기계 확인과 의미 정독을 구분. F04/F05 분리 유지. |
| C38 | 미검증 | 필요한 회귀·실제 파일수신에 기존 도구 사용. 불필요한 패키지 설치 없음. 전체 비동기/성능 미완. |
| C39 | 미검증 | 기존 React 컴포넌트/저장/테마 재사용. 새 프레임워크·수량을 채우는 미사용 컴포넌트 화면 없음. |
| C40 | 미검증 | 목적별 작은 commit과 승인된 main 배포. 최종 HEAD/remote/Actions는 저장소 밖 final-release 결과로 고정. |
| C41 | 미검증 | 기존 clean 기준부터 소유파일 분리. 타 작업 서버/탭 종료나 reset 없음. 기존 원본2문서 변경 보존. |
| C42 | 미검증 | A–E 분류·F49 영구삭제 유보 등 기존 계약 유지.49기능 전체 판정 완료 아님. |
| C43 | 미검증 | Dashboard 새 기능 확정 없음. 기존 연구 기반의 후속 구현 요구 보존. |
| C44 | 미검증 | 1세대 node-overview/UI와 원문 REQUEST.R32/H642를 참고해 Narrative 요구 확인. 실제 Vault로 시험하지 않음. |
| C45 | 미검증 | CORE45 개별영향 재검토 및1370행 snapshot/원목록/증거 보존 비교. 전체 의미전수·상위Phase 통과 아님. |

## 보존과 다음 의존관계

1세대 보존1851개:1849동일·기존 안내2변경·누락0/오류0. tar와 실제 diff는 AGENTS.md의 문서 안내/도구 기준 추가 및 간단 인계의2세대 진입 안내 추가만이며 이전 본문이 남아 있습니다. 원상복구하지 않았습니다. 해시 일치는 의미 이관·동작 호환·학습효과의 증거가 아닙니다.

원장 편집 직전 새 ledger-before.json을 저장했습니다. 기존1370행·baseline1366개·증거·분류·선행조건을 보존하고 이번 좁은 결함을 추가 연결합니다. sources에 있는 기준문서를 바꾸지 않았다면 source hash는 유지합니다. validate-ledger의 --previous/--check-sources와 검증기26개는 새 결과 파일로 실행합니다. 과거 실패 artifact를 지우지 않습니다.

남은 전체 요구는 P10/Auth→P11/온라인→IndexedDB→queue→Sync→Conflict→Canvas/PWA→기기·Dashboard·통계→Backup/Import→전체QA/E2E/성능→후보판→1.0입니다. F04개별칸/F05파서, F22파생지도, F47선택도구, F49정책전 영구삭제 비노출을 유지합니다. HISTORY665/141장면/460이력 의미전수·13첨부 내용 전체·181부재도 열린 상태입니다. 현재 작업은 이 전체 요구를 줄인 완료 보고가 아니며 재현 가능한 다음 실행을 인계에 남깁니다.

## 마지막 추가실행 반영

기록화면 주제찾기필터가 같은초안 복귀 때 사라지는 WORK.R04 결함을 d2e3164에서 수정했습니다. 기존sessionStorage preference를 form키별로 재사용한3줄 변경이며 본문/선택초안/사건ID를 변경하지 않습니다. 신규3회귀의 수정전2fail/1pass→관련45pass, 최종227pass/1성능skip. B40에서 실제검색·선택·메모/Back/reload·명시적지우기·다른명시대상분리를 확인했습니다. P07/08/09 전체 상태는 그대로 미검증이며 C09/C10/C20/C31의 좁은 증거만 추가합니다.

원장은 기존1370행+이번4후속=1374행으로 보존했고 다운로드후속만 좁은수신조건을 충족해 수정후통과로 바꿨습니다. 실제Chrome200%의 메뉴/오류/저장/복귀와 reduced-motion 모사도 B37/38에서 통과했습니다. 반면 물리기기 새답변·전체대비/소비상태·안전한1세대baseline은 남습니다. 최초코드배포482d302의 CI/공개자산을 확인했고 마지막코드/문서배포 해시는 외부final-release에 남깁니다.
