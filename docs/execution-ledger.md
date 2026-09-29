# 이번 실행 원장 연결 — 2026-09-30 다운로드·복귀 보완

[최신 인계](resume-handoff.md), [Phase·CORE45 보고](phase-report-continuation-20260930.md), [B29–B40](validation/continuation-ui-20260930.md)를 우선합니다. 앱d2e3164, 최종227개/성능1skip·타입/Pages빌드통과. 실제 파일수신/200%zoom·서문ID/펼침·메뉴초점·검색빈결과·기록필터 복귀를 처리했습니다. 원장1374행, 보존1849동일/기존문서2추가/누락0. P07/P08/P09 전체와 Auth/온라인·물리기기는 미검증입니다. 아래 이전기록은 역사적 상태이며 전체통과나 현재차단으로 읽지 않습니다.

# 2세대 실행 원장

작성: 2026-09-29T15:22:02.335348+00:00. 코드 기준: `7f813c251770ba2fda3face8fc971dac782c0817`.

**이 원장은 제품 통과 보고가 아닙니다.** 모든 요구 집합을 별도 ID로 연결했지만 현재 실행하지 않은 검증은 미검증으로 남겼습니다. 원본 과거 발화 전체 의미 판정은 열린 요구입니다. PDF 33쪽 이미지 재대조는 별도 audit 근거로 연결했고 제품 기능 상태는 미검증입니다.

정본은 [execution-ledger.json](execution-ledger.json), 최초 목록 비교 기준은 [execution-ledger-baseline.json](execution-ledger-baseline.json)입니다. 검사기는 목록 소실·고아 참조·목적지·분류 변경·근거 없는 승격·Phase 선행조건을 검사합니다. 수량과 SHA-256은 내용의 완전성을 증명하지 않습니다.

## 2026-09-30 보관본·긴 표 복귀·공부 시작 후속 실행

이번 코드 변경은 `fca7f88`(초안 보관본 확인·내보내기), `e154a45`(긴 표 편집 위치 복원), `2d240fc`(선택적 공부 시작·기록 복귀)입니다. 기존 1,367행을 유지하고 좁은 후속 요구 3행을 추가하여 **1,370행**입니다. [새 자동 실행](validation/archive-final-tests-20260930-0225.txt)은 213개 통과·선택 성능 1개 건너뜀, [타입·빌드](validation/archive-final-build-20260930-0225.txt)는 통과입니다. [실제 브라우저 증거](validation/archive-ui-20260930.md)와 자동·물리·서버·성능 증거를 구별합니다.

보관본의 원문·대상·이유·시각·현재 초안 관계를 읽기 전용으로 확인합니다. 읽기·메타데이터 실패와 재시도에서 원본과 사본을 유지했고 특수 문자를 포함한 JSON 클립보드 복사의 원문 일치를 확인했습니다. **다운로드한 실제 파일 수신은 미검증**이므로 이 요구 전체는 미검증입니다. 정식 백업·데이터 삭제 복구·강제종료·IndexedDB 영구 보존 완료가 아닙니다.

긴 표는 1280px/390px 브라우저에서 닫기·재열기·새로고침 뒤 같은 필드·선택·내부 스크롤을 복원했습니다. 선택적 공부 시작 안내는 홈·새로고침 뒤 기록 복귀로 이어지며 저장 전 공부 사건을 만들지 않습니다. 이 두 좁은 흐름만 수정 후 통과이며 F08 전체, CORE C10/C17, 상위 Phase는 승격하지 않았습니다. 기존 P01 사용자 보고를 이번 직접 실기기 증거로 복제하지 않았습니다.

## 2026-09-30 Prototype 후속 실행

이번 구현은 ce6ee43 및 앞선 dd39f5b/5e1d223/752ab1e입니다. [170개 자동검사·빌드](validation/followup-execution-20260930.json), [실제 B10–B18](validation/followup-ui-20260930.md), [원본·접근·의미감사 경계](validation/followup-audit-20260930.json)를 연결합니다. 기존 1,366행은 모두 보존했고 새 자유기록 ID 복구 결함 1행을 추가하여 1,367행입니다. 상위 Phase/전체 요구 상태를 일괄 통과로 바꾸지 않았습니다.

형제 정렬·3단계 표·Modal초안·긴글 선택/내부scroll·기준 범위Undo를 구현/검증했습니다. 손상/실패는 자동 오류주입과 실제 정상조작 증거를 나누었습니다. 과거 접근불가181경로는 현재도 없으며13기존파일은 가독성만 확인했습니다. HISTORY665 위치/텍스트 일치는 의미전수 완료가 아닙니다. 아래 예전 열린 조건은 당시 기록이며 최신 남은 조건은 JSON과 resume-handoff.md를 따릅니다.

## 집합과 경계

| 집합 | 행 수 | 경계 |
|---|---:|---|
| CORE | 45 | 각 원래 ID 보존 |
| PHASE | 38 | 각 원래 ID 보존 |
| UNFINISHED | 9 | 각 원래 ID 보존 |
| WORK | 26 | 각 원래 ID 보존 |
| FEATURE | 49 | 각 원래 ID 보존 |
| INPUT | 92 | 각 원래 ID 보존 |
| REQUEST | 67 | 각 원래 ID 보존 |
| INV | 22 | 각 원래 ID 보존 |
| FAILURE | 40 | 각 원래 ID 보존 |
| UI | 38 | 각 원래 ID 보존 |
| PUI | 20 | 각 원래 ID 보존 |
| PDF | 90 | 각 원래 ID 보존 |
| UX | 112 | 각 원래 ID 보존 |
| UX_SURFACE | 32 | 각 원래 ID 보존 |
| COMPONENT | 21 | 각 원래 ID 보존 |
| FOLLOWUP | 8 | 기존4개와 이번 Narrative/메뉴초점/검색무결과/기록필터4개 |
| HISTORY | 665 | 과거 원문 위치 색인, 모두 독립 요구 또는 원문 정독이라고 판정하지 않음 |

## 현재 열린 조건

- GitHub/Pages는 구현 commit 7b911a4 배포와 실제 상세 reload까지 확인했습니다. Supabase는 프로젝트 Healthy만 확인했으며 Auth/CRUD는 미검증입니다. [이번 실행](validation/resume-execution.json), [실제UI](validation/resume-ui.md), [Phase·CORE45](phase-report-20260930.md).
- Online CRUD → IndexedDB → Offline queue → Sync → Conflict → Canvas/PWA → 기기 최적화/통계 → Backup/Import → QA/E2E/성능 → 후보판 → 1.0의 선행 검증을 건너뛸 수 없습니다.
- 물리기기/서버 수신/장기사용은 자동·브라우저 증거와 다른 열입니다.
- 초기 조사 141장면·460이력과 665발화의 전수 의미 대조, 과거 접근 불가 181개 경로 재조사는 완료되지 않았습니다.
- 공통 컴포넌트는 계약21종/실제 export21종입니다. NavigationBar·ContextMenu를 실제 화면에 연결했고 자동/부분 브라우저 증거만 추가했습니다. 전체 상태·물리 접근성은 미검증입니다.

## 행별 목적지와 다음 행동

각 행의 JSON에는 근거 위치·정정 날짜, 사용자 의미, A–E 분류, Phase·선행, 데이터 목적지, UI·조작·상태, 구현/시험 파일, 자동·브라우저·물리·서버/상대기기·성능·장기사용 증거, 남은 문제, 다음 행동, commit/artifact를 따로 기록합니다. 비공개 원문·개인 응답을 이 저장소에 복제하지 않습니다.

| ID | 요구 의미 | Phase | 목적지/판정 | 상태 |
|---|---|---|---|---|
| CORE.C01 | 1세대를 덮어쓰지 않고 연구·코드·피드백을 계승한다. | PHASE.01,PHASE.02,PHASE.30 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| CORE.C02 | ‘미완 -’ 전 항목에 처리상태·근거·담당 Phase가 있다. | PHASE.02,PHASE.09,PHASE.31,PHASE.33 | OutlineNode / derived View | 미검증 |
| CORE.C03 | PDF33쪽과 각 실제 요구를 이미지 페이지까지 누락하지 않는다. | PHASE.00,PHASE.02,PHASE.31 | ExecutionLedger/EvidenceManifest | 미검증 |
| CORE.C04 | TRACE·하위ID·학습구조·최신 정정·개인 기준을 보존한다. | PHASE.14,PHASE.30 | ActivityDefinition / ImportBatch / LegacyArchive / SourceMap / StudyRecord.trace / TraceItem.definition / TraceItem.repeats / TraceItem.status / WrittenReview / derived SubjectStatus | 미검증 |
| CORE.C05 | UI/UX와 대시보드 연구를 회수하여 사용한다. | PHASE.06,PHASE.09,PHASE.27,PHASE.28 | StudyRecord / Task / ViewPreference / derived Dashboard / derived Statistics | 미검증 |
| CORE.C06 | Hick/Fitts/Jakob/Proximity/Von Restorff를 실제 검증 기준으로 적용한다. | PHASE.09,PHASE.31 | NavigationContext / StudyRecord / StudySession | 미검증 |
| CORE.C07 | Color/Typography/Spacing/Radius/Shadow/Border/Icon/Motion/Breakpoint/State를 통일한다. | PHASE.06,PHASE.07 | AppSettings / OutlineNode / Preference / derived View | 미검증 |
| CORE.C08 | 공통 Component·상태·접근성·키보드·터치 계약과 구현이 있다. | PHASE.07,PHASE.31 | OutlineNode / derived View | 미검증 |
| CORE.C09 | 공부기록 핵심 흐름을 짧게 하되 자유서술·부분·예외 의미를 삭제하지 않는다. | PHASE.08,PHASE.13,PHASE.14 | ActivityDefinition / Draft / Narrative / StudyRecord / StudyRecord.body / StudySession / TraceItem.definition / TraceItem.status | 미검증 |
| CORE.C10 | 미저장 입력·이탈·종료·실패·재실행에서 예상 밖의 손실을 막고 보존 한계를 명확히 표시한다. | PHASE.18,PHASE.19,PHASE.23 | Draft / SyncOperation | 미검증 |
| CORE.C11 | 위험 결과·구체적 CTA·Undo/휴지통/복구 경로를 제공한다. | PHASE.15,PHASE.29 | DeletionPolicy / LegacyArchive / OutlineNode.deletedAt / Revision | 미검증 |
| CORE.C12 | 사용자·학기/독립/미지정·과목·단원·주제·기록 소속을 구조적으로 검증한다. | PHASE.03,PHASE.11,PHASE.12,PHASE.13 | OutlineNode.order / OutlineNode.parentId / Semester / StudyRecord / StudySession / Subject.scope | 미검증 |
| CORE.C13 | Canvas/Graph는 정규 원본에서 만드는 파생 View이다. | PHASE.22 | Memo / OutlineNode / Question / Relation / StudyRecord / ViewLayout | 미검증 |
| CORE.C14 | Canvas 자동생성을 전제하지 않고 실제 UX 근거로 결정한다. | PHASE.22 | OutlineNode / ViewLayout | 미검증 |
| CORE.C15 | Server·IndexedDB·미전송 원본·cache·backup·code 역할을 구분한다. | PHASE.11,PHASE.18,PHASE.20,PHASE.29 | AppShell / Attachment / Cache / Draft / ExportPackage / Revision / SyncOperation / SyncState | 미검증 |
| CORE.C16 | 원본파일 직접수정·임의삭제에 의존한 이관/복구를 하지 않는다. | PHASE.29,PHASE.30 | Attachment / ExportPackage / ImportBatch / LegacyArchive / Revision / SourceMap | 미검증 |
| CORE.C17 | Stable ID/Draft/Autosave/Revision/Undo/Soft delete/Restore/Backup/Export/Conflict recovery를 검증한다. | PHASE.18,PHASE.21,PHASE.29,PHASE.30 | Attachment / Conflict / Draft / ExportPackage / ImportBatch / LegacyArchive / OutlineNode.deletedAt / Revision / SourceMap / SyncOperation | 미검증 |
| CORE.C18 | iPhone 빠른 기록·iPad 학습·Mac 관리 맥락을 반영한다. | PHASE.24,PHASE.25,PHASE.26 | Attachment / Draft / ExportPackage / Narrative / NavigationContext / Revision / StudyRecord / StudyRecord.body / StudySession / derived SearchIndex | 미검증 |
| CORE.C19 | Split View/회전/키보드/Light-Dark/좁고 넓은 창을 검증한다. | PHASE.24,PHASE.25,PHASE.26 | AppSettings / Draft / Narrative / NavigationContext / Preference / StudyRecord.body | 미검증 |
| CORE.C20 | 실제 한글 IME/Enter/Backspace/커서/Focus/Scroll jump/키보드 가림을 검증한다. | PHASE.24,PHASE.25,PHASE.26 | Draft / Narrative / NavigationContext / StudyRecord / StudyRecord.body / StudySession / SyncOperation / derived SearchIndex | 미검증 |
| CORE.C21 | 빈/잘못된/긴/깊은/대량/연속/중복/저장 실패/재실행 상태를 검증한다. | PHASE.31,PHASE.32,PHASE.34 | Draft / Narrative / OutlineNode.order / OutlineNode.parentId / StudyRecord / StudyRecord.body / StudySession / SyncOperation / derived runtime metrics | 미검증 |
| CORE.C22 | race/stale/취소/순서 역전/동시 수정/sync conflict를 검증한다. | PHASE.11,PHASE.20,PHASE.21,PHASE.32 | Conflict / NavigationContext / Revision / SyncOperation / SyncState / derived SearchIndex | 미검증 |
| CORE.C23 | 무거운 파싱·집계·통계·Canvas·Sync·검색 인덱스가 입력을 막지 않게 한다. | PHASE.17,PHASE.22,PHASE.28,PHASE.34 | NavigationContext / OutlineNode / StudyRecord / ViewLayout / derived SearchIndex / derived Statistics / derived runtime metrics | 미검증 |
| CORE.C24 | 모든 탭·화면·모달·조작·조건부 상태 Inventory와 실제 조작 결과가 있다. | PHASE.31 | Assignment / Attachment / Conflict / ExportPackage / NavigationContext / OnlineLecture / Revision / StudyRecord / StudySession / Task / derived SearchIndex | 미검증 |
| CORE.C25 | 학기 생성부터 다음 학기·과거 학기 재조회까지 전체 E2E가 있다. | PHASE.33 | Assignment / ExamDate / ExamFocus / ExamPlan / ExamResponse / OnlineLecture / OutlineNode / OutlineNode.order / OutlineNode.parentId / Schedule / Semester / StudyRecord / StudySession / Subject.scope / Task / ViewLayout / derived Statistics | 미검증 |
| CORE.C26 | 일정·할 일·과제·온라인 강의·시험·수행·Anki·자료·설정 등 기존 기능을 임의로 잃지 않는다. | PHASE.16,PHASE.17,PHASE.22,PHASE.26,PHASE.28,PHASE.30 | AnkiCard / AnkiReview / AppSettings / Assignment / Attachment / Draft / ExamDate / ExamFocus / ExamPlan / ExamResponse / Guidance / LegacyArchive / MaterialLink / NavigationContext / OnlineLecture / OutlineNode / PerformanceAttempt / PerformanceItem / Preference / ResearchDecision / Schedule / SourceMap / StudyRecord / Task / ViewLayout / derived SearchIndex / derived Statistics | 미검증 |
| CORE.C27 | 시험계정/namespace/복제 자료와 실제 개인 데이터·통계를 분리한다. | PHASE.11,PHASE.30,PHASE.33 | AppShell / Cache / ImportBatch / LegacyArchive / SourceMap / StudyRecord / StudySession / SyncState / derived Statistics | 미검증 |
| CORE.C28 | 기존 ID·본문·Draft·Revision·기준·설정·Canvas 배치·연결·첨부와 다른 작업 변경을 보존한다. | PHASE.01,PHASE.29,PHASE.30 | ActivityDefinition / Attachment / Draft / ExportPackage / ImportBatch / LegacyArchive / MaterialLink / Memo / OutlineNode / Question / Relation / Revision / SourceMap / TraceItem.definition / TraceItem.status / ViewLayout | 미검증 |
| CORE.C29 | dead code 삭제 전에 동적호출·이벤트·호환·migration·복구 경로를 확인한다. | PHASE.30,PHASE.35 | ImportBatch / LegacyArchive / OutlineNode / Revision / SourceMap / derived View | 미검증 |
| CORE.C30 | UX QA와 Engineering QA를 별도로 기록하고 둘 다 Phase 판정에 사용한다. | PHASE.31,PHASE.32 | Conflict / Draft / NavigationContext / Revision / StudyRecord / StudySession / SyncOperation | 미검증 |
| CORE.C31 | 발견한 문제를 원인→수정→적용→재검증→회귀까지 처리한다. | PHASE.35 | Conflict / Draft / Revision / StudyRecord / StudySession / SyncOperation / derived runtime metrics | 미검증 |
| CORE.C32 | 자동 테스트만으로 실제 화면·제품 완료를 판정하지 않는다. | PHASE.09,PHASE.31,PHASE.36 | ExecutionLedger/EvidenceManifest | 미검증 |
| CORE.C33 | 정적/자동/합성 DOM/실제 브라우저/물리기기/동기화 수신/장기사용 증거를 구분한다. | PHASE.31,PHASE.36,PHASE.37 | ExecutionLedger/EvidenceManifest | 미검증 |
| CORE.C34 | 확인하지 못한 것은 미검증이며 근거 없는 완료·추정을 쓰지 않는다. | PHASE.35,PHASE.36,PHASE.37 | ExecutionLedger/EvidenceManifest | 미검증 |
| CORE.C35 | 한 학기 시뮬레이션을 실제 장기사용·학습효과 증거라고 하지 않는다. | PHASE.33,PHASE.36,PHASE.37 | ExecutionLedger/EvidenceManifest | 미검증 |
| CORE.C36 | 시작 화면과 각 정상/오류 상태의 내부JSON·개발용·불필요한 시스템 UI 노출을 검사한다. | PHASE.08,PHASE.31 | Conflict / Draft / Revision / StudyRecord / SyncOperation / Task / derived Dashboard | 미검증 |
| CORE.C37 | 명시적 정정→이유 있는 최신 합의→구체적인 과거 요구→임시 아이디어 순서로 충돌을 추적한다. | PHASE.02,PHASE.14,PHASE.30 | ActivityDefinition / ImportBatch / LegacyArchive / SourceMap / TraceItem.definition / TraceItem.status | 미검증 |
| CORE.C38 | 필요한 정적/계약/상태/비동기/오류주입/회귀/성능 분석을 쓰되 과설계하지 않는다. | PHASE.32,PHASE.34,PHASE.35 | Conflict / Draft / Revision / StudyRecord / StudySession / SyncOperation / derived runtime metrics | 미검증 |
| CORE.C39 | 문제보다 유지보수 비용을 크게 늘리는 추상화·프레임워크를 도입하지 않는다. | PHASE.07,PHASE.34,PHASE.35 | OutlineNode / derived View / derived runtime metrics | 미검증 |
| CORE.C40 | GitHub를 코드 Source of Truth로 하고 안정된 의미 단위 commit·실제 배포 버전을 남긴다. | PHASE.05,PHASE.36 | CodeRepository / DeploymentArtifact / AuthCallbackConfiguration | 미검증 |
| CORE.C41 | 모든 단계에서 다른 진행 중 변경을 덮어쓰거나 revert/삭제/대량 포맷하지 않는다. | PHASE.01,PHASE.35 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| CORE.C42 | 모든 기능 A보존/B개선/C웹재설계/D제거/E연구 분류와 이유·대체 해결·검증이 있다. | PHASE.02,PHASE.30 | BrowserWindow / DeletionPolicy / DocumentTitle / Guidance / ImportPreview / LegacyArchive / Material / OutlineNode / OutlineReview / Relation / ResearchDecision / ViewLayout / derived View | 미검증 |
| CORE.C43 | Dashboard는 기존 연구와 실제 자료를 기반으로 하며 PDF의 한 메모로 기능을 추측하지 않는다. | PHASE.27,PHASE.28 | Preference / StudyRecord / Task / ViewPreference / derived Dashboard / derived Statistics | 미검증 |
| CORE.C44 | 1세대를 요구사항을 발견한 프로토타입 연구자산으로 다룬다. | PHASE.01,PHASE.02,PHASE.30 | ImportBatch / LegacyArchive / OutlineNode / SourceMap / derived View | 미검증 |
| CORE.C45 | C01–C45 전부와 요구 원장의 누락·중복·고아 연결·근거 없는 승격을 마지막에 다시 감사한다. | PHASE.02,PHASE.35,PHASE.36 | ExecutionLedger/EvidenceManifest | 미검증 |
| PHASE.00 | 발굴 보고서 검증 — 현재 정정/근거 재확인. | PHASE.00 | process | 미검증 |
| PHASE.01 | 원본/버전관리 안전화 — 현재 변경 보호 및 보존본 확인. | PHASE.01 | process | 미검증 |
| PHASE.02 | 마이그레이션 최종 명세 —49기능·세부 입력·예외·분류 계약. | PHASE.02 | process | 미검증 |
| PHASE.03 | 데이터 모델 + invariants —22조건을 서버/로컬/이관에 연결. | PHASE.03 | process | 미검증 |
| PHASE.04 | 웹앱 뼈대 —현재 React/TypeScript/Vite 유지. | PHASE.04 | process | 미검증 |
| PHASE.05 | GitHub Pages 최초 배포 —실제 remote/URL/commit 확인. | PHASE.05 | process | 미검증 |
| PHASE.06 | Design System —토큰/역할/상태/테마 검증. | PHASE.06 | process | 미검증 |
| PHASE.07 | 공통 Components —계약과 실제 조작 상태 검증. | PHASE.07 | process | 미검증 |
| PHASE.08 | 가짜 데이터 UI Prototype —남은 핵심 흐름 완성. | PHASE.08 | process | 미검증 |
| PHASE.09 | 핵심 UX 검증 —A–G·비교 기준·기기 맥락. | PHASE.09 | process | 미검증 |
| PHASE.10 | Supabase/Auth —계정·세션·환경 연결. | PHASE.10 | process | 미검증 |
| PHASE.11 | 실제 CRUD —온라인 무결성·RLS·version·revision. | PHASE.11 | process | 미검증 |
| PHASE.12 | 학기/과목/단원/주제 —온라인 소속·계층·순서. | PHASE.12 | process | 미검증 |
| PHASE.13 | 공부기록 —원 사건·대상 기록·예외. | PHASE.13 | process | 미검증 |
| PHASE.14 | TRACE/체크리스트/자기화 —정의/기준/반복/C2. | PHASE.14 | process | 미검증 |
| PHASE.15 | 목차 관리/Navigation —편집·복귀·맥락. | PHASE.15 | process | 미검증 |
| PHASE.16 | 일정/할 일/과제/온라인 강의 등 —부가 기능 보존. | PHASE.16 | process | 미검증 |
| PHASE.17 | 검색 —범위·IME·결과/복귀·성능. | PHASE.17 | process | 미검증 |
| PHASE.18 | IndexedDB —온라인 안정화 이후 로컬 원자 저장. | PHASE.18 | process | 미검증 |
| PHASE.19 | Offline queue —데이터+outbox·idempotency. | PHASE.19 | process | 미검증 |
| PHASE.20 | Sync —재연결·전송/수신·재시도·순서. | PHASE.20 | process | 미검증 |
| PHASE.21 | Conflict handling —양쪽 원문·선택·복구. | PHASE.21 | process | 미검증 |
| PHASE.22 | Canvas/Graph —파생 View·개인 배치 보존. | PHASE.22 | process | 미검증 |
| PHASE.23 | PWA —설치·cache·update·offline app shell. | PHASE.23 | process | 미검증 |
| PHASE.24 | iPhone 최적화 —빠른 기록·키보드·홈 화면. | PHASE.24 | process | 미검증 |
| PHASE.25 | iPad 최적화 —학습·Split View·방향·입력. | PHASE.25 | process | 미검증 |
| PHASE.26 | Mac 최적화 —대량 관리·키보드·백업. | PHASE.26 | process | 미검증 |
| PHASE.27 | Dashboard —기존 연구와 실제 자료 기반 관제. | PHASE.27 | process | 미검증 |
| PHASE.28 | 통계/진도 —8종 정의·모집단·기간·불확실성. | PHASE.28 | process | 미검증 |
| PHASE.29 | Backup/Restore/Export —독립 백업·roundtrip. | PHASE.29 | process | 미검증 |
| PHASE.30 | Obsidian Import/Migration —Preview·Dry-run·무결성. | PHASE.30 | process | 미검증 |
| PHASE.31 | 전체 UI QA —모든 화면/조작/상태. | PHASE.31 | process | 미검증 |
| PHASE.32 | Engineering QA —데이터/상태/비동기/오류/모듈. | PHASE.32 | process | 미검증 |
| PHASE.33 | 한 학기 E2E —시험 자료로 전 흐름. | PHASE.33 | process | 미검증 |
| PHASE.34 | 성능/대량 데이터 테스트 —실측 후 개선. | PHASE.34 | process | 미검증 |
| PHASE.35 | 회귀 수정 —같은 문제와 인접 경로 재검증. | PHASE.35 | process | 미검증 |
| PHASE.36 | 실사용 후보판 —실제 배포·한계·복구. | PHASE.36 | process | 미검증 |
| PHASE.37 | 안정판1.0 —필수 증거 충족 및 잔여 결함 판정. | PHASE.37 | process | 미검증 |
| UNFINISHED.U01 | `미완 - ux 적용`:112개 UX 후보와32영역 대응을 실제 동작·웹의 사용자 문제로 검토한다. 기본 기록·저장·복귀·일괄 입력 마찰부터 해결한다. | PHASE.09 | process | 미검증 |
| UNFINISHED.U02 | `미완 - ui 적용`: 기존 토큰·색 의미·계층 구분·전 화면 일관성과 시각화 연구를 계승한다. Obsidian DOM patch나 도구7개를 웹에 무조건 이식하지 않는다. | PHASE.07 | process | 미검증 |
| UNFINISHED.U03 | `미완 - 맥북 창 이동 바 추가`: 창 조작·명확한 제목이라는 목적을 보존한다. 브라우저/PWA 창 관습으로 충족되는지 실제 확인하고 Obsidian 전용 drag CSS의 제거 근거를 남긴다. | PHASE.26 | process | 미검증 |
| UNFINISHED.U04 | `미완 - 학습 프로그램 전체 사용성 점검`: 해당 과거 대화는 요청문 정리였으며 한 학기 QA를 수행한 증거가 아니다. 이번 실제 E2E·UX/Engineering QA로 이어라. | PHASE.33 | process | 미검증 |
| WORK.R01 | 현재 상태와 안전 경계를 재확인하라. | PHASE.01 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| WORK.R02 | 계약과 증거 원장을 보완하라. | PHASE.02 | ActivityDefinition / AnkiCard / AnkiReview / AppSettings / AppShell / Assignment / Attachment / BrowserWindow / Cache / Conflict / DeletionPolicy / DocumentTitle / Draft / ExamDate / ExamFocus / ExamPlan / ExamResponse / ExportPackage / Guidance / ImportBatch / ImportPreview / LegacyArchive / Material / MaterialLink / Memo / Narrative / NavigationContext / OnlineLecture / OutlineNode / OutlineNode.deletedAt / OutlineNode.order / OutlineNode.parentId / OutlineReview / PerformanceAttempt / PerformanceItem / Preference / Question / Relation / ResearchDecision / Revision / Schedule / Semester / SourceMap / StudyRecord / StudyRecord.body / StudyRecord.trace / StudySession / Subject.scope / SyncOperation / SyncState / Task / TraceItem.definition / TraceItem.repeats / TraceItem.status / ViewLayout / ViewPreference / WrittenReview / derived Dashboard / derived SearchIndex / derived Statistics / derived SubjectStatus / derived View / derived runtime metrics | 미검증 |
| WORK.R03 | Prototype의 남은 기본 UX를 닫아라. | PHASE.08 | ActivityDefinition / Draft / Guidance / Narrative / NavigationContext / StudyRecord / StudyRecord.body / StudySession / Task / TraceItem.definition / TraceItem.repeats / TraceItem.status / WrittenReview / derived Dashboard | 미검증 |
| WORK.R04 | Navigation과 목차 관리를 완성하라. | PHASE.15 | ImportPreview / NavigationContext / OutlineNode / OutlineNode.deletedAt / OutlineNode.order / OutlineNode.parentId / Revision | 미검증 |
| WORK.R05 | Design System·공통 컴포넌트 검증을 마쳐라. | PHASE.07 | AppSettings / OutlineNode / Preference / derived View | 미검증 |
| WORK.R06 | A–G UX 기준선을 측정하라. | PHASE.09 | Draft / Narrative / NavigationContext / OutlineNode.deletedAt / Revision / StudyRecord / StudyRecord.body / StudySession | 미검증 |
| WORK.R07 | GitHub와 Pages를 실제 연결하라. | PHASE.05 | AppShell / Cache / SyncState | 미검증 |
| WORK.R08 | Supabase/Auth와 데이터 모델을 실제 연결하라. | PHASE.10 | AppShell / Cache / ImportBatch / LegacyArchive / SourceMap / SyncState | 미검증 |
| WORK.R09 | Online CRUD를 먼저 안정화하라. | PHASE.11 | OutlineNode.order / OutlineNode.parentId / Revision / Semester / StudyRecord / StudySession / Subject.scope | 미검증 |
| WORK.R10 | 공부 기록·TRACE·체크리스트·자기화를 정식 데이터에 연결하라. | PHASE.14 | ActivityDefinition / StudyRecord / StudyRecord.trace / StudySession / TraceItem.definition / TraceItem.repeats / TraceItem.status / WrittenReview / derived SubjectStatus | 미검증 |
| WORK.R11 | 부가기능 전체를 이식하라. | PHASE.16 | AnkiCard / AnkiReview / Assignment / Attachment / Draft / ExamDate / ExamFocus / ExamPlan / ExamResponse / Guidance / MaterialLink / OnlineLecture / PerformanceAttempt / PerformanceItem / Preference / ResearchDecision / Schedule / Task | 미검증 |
| WORK.R12 | 검색을 완성하라. | PHASE.17 | NavigationContext / derived SearchIndex | 미검증 |
| WORK.R13 | IndexedDB·Draft·Autosave를 단계적으로 구현하라. | PHASE.18 | Draft / SyncOperation | 미검증 |
| WORK.R14 | Offline queue와 Sync를 완성하라. | PHASE.20 | SyncOperation / SyncState | 미검증 |
| WORK.R15 | Conflict를 별도 기능으로 구현하라. | PHASE.21 | Conflict / Revision | 미검증 |
| WORK.R16 | Canvas/Graph와 Kanban을 파생 View로 구현하라. | PHASE.22 | Memo / OutlineNode / Question / Relation / StudyRecord / ViewLayout | 미검증 |
| WORK.R17 | PWA와 업데이트 정책을 완성하라. | PHASE.23 | AppShell / Cache / SyncState | 미검증 |
| WORK.R18 | iPhone/iPad/Mac UX를 각각 최적화하라. | PHASE.24 | AppSettings / Draft / Narrative / NavigationContext / Preference / StudyRecord / StudyRecord.body / StudySession | 미검증 |
| WORK.R19 | Dashboard와8종 통계를 구현하라. | PHASE.28 | StudyRecord / Task / ViewPreference / derived Dashboard / derived Statistics | 미검증 |
| WORK.R20 | 삭제·Undo·Revision·Backup/Export/Restore를 완성하라. | PHASE.29 | Attachment / DeletionPolicy / ExportPackage / LegacyArchive / OutlineNode.deletedAt / Revision | 미검증 |
| WORK.R21 | Obsidian Import/Migration을 안전하게 구현하라. | PHASE.30 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| WORK.R22 | 모든 조작의 UX QA와 Engineering QA를 수행하라. | PHASE.31 | ActivityDefinition / AnkiCard / AnkiReview / AppSettings / AppShell / Assignment / Attachment / BrowserWindow / Cache / Conflict / DeletionPolicy / DocumentTitle / Draft / ExamDate / ExamFocus / ExamPlan / ExamResponse / ExportPackage / Guidance / ImportBatch / ImportPreview / LegacyArchive / Material / MaterialLink / Memo / Narrative / NavigationContext / OnlineLecture / OutlineNode / OutlineNode.deletedAt / OutlineNode.order / OutlineNode.parentId / OutlineReview / PerformanceAttempt / PerformanceItem / Preference / Question / Relation / ResearchDecision / Revision / Schedule / Semester / SourceMap / StudyRecord / StudyRecord.body / StudyRecord.trace / StudySession / Subject.scope / SyncOperation / SyncState / Task / TraceItem.definition / TraceItem.repeats / TraceItem.status / ViewLayout / ViewPreference / WrittenReview / derived Dashboard / derived SearchIndex / derived Statistics / derived SubjectStatus / derived View / derived runtime metrics | 미검증 |
| WORK.R23 | Failure Matrix 전40행과 회귀를 닫아라. | PHASE.32 | Conflict / Draft / ImportBatch / LegacyArchive / Revision / SourceMap / SyncOperation / SyncState | 미검증 |
| WORK.R24 | 한 학기 E2E와 누적 성능을 검증하라. | PHASE.33 | Assignment / ExamDate / ExamFocus / ExamPlan / ExamResponse / OnlineLecture / OutlineNode / OutlineNode.order / OutlineNode.parentId / Semester / StudyRecord / StudySession / Subject.scope / Task / ViewLayout / derived Statistics / derived runtime metrics | 미검증 |
| WORK.R25 | 실사용 후보판과1.0의 완료 조건을 분리하라. | PHASE.36 | AppShell / Attachment / Cache / ExportPackage / Revision / SyncState | 미검증 |
| WORK.R26 | 매 작업을 추적 가능한 상태로 마감하라. | PHASE.35 | AppShell / Cache / ImportBatch / LegacyArchive / SourceMap / SyncState | 미검증 |
| FEATURE.F01 | 앱 공통 탐색 | PHASE.15 | NavigationContext | 미검증 |
| FEATURE.F02 | 학기 관리 | PHASE.12 | Semester / Subject.scope | 미검증 |
| FEATURE.F03 | 과목·목차 관리 | PHASE.15 | OutlineNode.parentId / OutlineNode.order | 미검증 |
| FEATURE.F04 | 표로 일괄 생성 | PHASE.15 | OutlineNode / ImportPreview | 미검증 |
| FEATURE.F05 | 목차 원문 받아들이기 | PHASE.15 | Material / OutlineReview / ImportPreview | 미검증 |
| FEATURE.F06 | 홈 현황 | PHASE.27 | StudyRecord / Task / derived Dashboard | 미검증 |
| FEATURE.F07 | 공부 후보·룰렛 | PHASE.08 | Preference / OutlineNode | 미검증 |
| FEATURE.F08 | 공부 시작과 복귀 | PHASE.08 | Guidance / NavigationContext | 미검증 |
| FEATURE.F09 | 짧은 공부 기록 | PHASE.13 | StudySession / StudyRecord | 미검증 |
| FEATURE.F10 | 긴 자유 글·코드 | PHASE.13 | Narrative / StudyRecord.body / Draft | 미검증 |
| FEATURE.F11 | TRACE 15개·개인기준 | PHASE.14 | ActivityDefinition / TraceItem.definition / TraceItem.status | 미검증 |
| FEATURE.F12 | 추가 반복 | PHASE.14 | TraceItem.repeats | 미검증 |
| FEATURE.F13 | 자기화·시험 전 점검 | PHASE.14 | WrittenReview | 미검증 |
| FEATURE.F14 | 과목별 TRACE | PHASE.14 | StudyRecord.trace / derived SubjectStatus | 미검증 |
| FEATURE.F15 | 과목 개요·단원 서문 | PHASE.13 | Narrative | 미검증 |
| FEATURE.F16 | 기본 공부·옛 상세 | PHASE.30 | LegacyArchive / SourceMap | 미검증 |
| FEATURE.F17 | 수행 확인·문제 연습 | PHASE.16 | PerformanceItem / PerformanceAttempt | 미검증 |
| FEATURE.F18 | 시험·범위·출제 | PHASE.16 | ExamPlan / ExamResponse / ExamDate / ExamFocus | 미검증 |
| FEATURE.F19 | Anki 일반·시험·무한 | PHASE.16 | AnkiCard / AnkiReview / Draft | 미검증 |
| FEATURE.F20 | 8가지 공부 통계 | PHASE.28 | derived Statistics / StudyRecord | 미검증 |
| FEATURE.F21 | 통계 그래프 조작 | PHASE.28 | derived Statistics / ViewPreference | 미검증 |
| FEATURE.F22 | 구조 연결 지도 | PHASE.22 | Relation / ViewLayout | 미검증 |
| FEATURE.F23 | 목차 Kanban | PHASE.22 | OutlineNode / ViewLayout | 미검증 |
| FEATURE.F24 | 기록·진행 Kanban | PHASE.22 | StudyRecord / ViewLayout | 미검증 |
| FEATURE.F25 | Canvas 탐색·개인배치 | PHASE.22 | ViewLayout / OutlineNode | 미검증 |
| FEATURE.F26 | Canvas 의문·메모 | PHASE.22 | Question / Memo / Relation | 미검증 |
| FEATURE.F27 | 첨부 PDF·이미지 | PHASE.22 | Attachment / MaterialLink | 미검증 |
| FEATURE.F28 | 할 일·과제 | PHASE.16 | Task / Assignment | 미검증 |
| FEATURE.F29 | 온라인 강의 | PHASE.16 | OnlineLecture | 미검증 |
| FEATURE.F30 | 할 일 달력 | PHASE.16 | Schedule / Task | 미검증 |
| FEATURE.F31 | 일정·시험일 | PHASE.16 | Schedule / ExamDate | 미검증 |
| FEATURE.F32 | 앱 내 묶음 알림 | PHASE.16 | Task / Preference | 미검증 |
| FEATURE.F33 | 검색·명령 | PHASE.17 | derived SearchIndex / NavigationContext | 미검증 |
| FEATURE.F34 | 설정 | PHASE.26 | AppSettings / Preference | 미검증 |
| FEATURE.F35 | 공부 안내·WHY/HOW/WHAT | PHASE.08 | Guidance | 미검증 |
| FEATURE.F36 | Autosave·Dirty | PHASE.18 | Draft / SyncOperation | 미검증 |
| FEATURE.F37 | Draft 복원 | PHASE.18 | Draft | 미검증 |
| FEATURE.F38 | Revision·Undo/Redo | PHASE.29 | Revision | 미검증 |
| FEATURE.F39 | 충돌 비교·복구 | PHASE.21 | Conflict / Revision | 미검증 |
| FEATURE.F40 | Obsidian Sync 반영 | PHASE.20 | SyncOperation / SyncState | 미검증 |
| FEATURE.F41 | 목차 휴지통·복원 | PHASE.15 | OutlineNode.deletedAt / Revision | 미검증 |
| FEATURE.F42 | 백업·내보내기·자료복구 | PHASE.29 | ExportPackage / Attachment / Revision | 미검증 |
| FEATURE.F43 | 이전 schema 호환·Migration | PHASE.30 | ImportBatch / SourceMap / LegacyArchive | 미검증 |
| FEATURE.F44 | 성능·렌더 캐시 | PHASE.34 | derived runtime metrics | 미검증 |
| FEATURE.F45 | macOS 제목바·호스트 숨김 | PHASE.26 | BrowserWindow / DocumentTitle | 미검증 |
| FEATURE.F46 | Obsidian DOM 패치·플러그인 호환 | PHASE.22 | derived View / OutlineNode | 미검증 |
| FEATURE.F47 | 선택 사고 도구·동역학 | PHASE.27 | Guidance / ResearchDecision | 미검증 |
| FEATURE.F48 | PWA·공통DB·오프라인queue | PHASE.23 | AppShell / Cache / SyncState | 미검증 |
| FEATURE.F49 | 일반 영구삭제 | PHASE.29 | DeletionPolicy / LegacyArchive | 미검증 |
| INPUT.R01 | 과목 선택 | PHASE.13 | StudyRecord.subjectId / Subject | 미검증 |
| INPUT.R02 | 주제와 하위 대상 선택 | PHASE.13 | StudyRecord.targetId / OutlineNode | 미검증 |
| INPUT.R03 | 공부 날짜 | PHASE.13 | StudySession.dateEvidence / StudyRecord.dateEvidence | 미검증 |
| INPUT.R04 | 날짜 범위·날짜 모름 | PHASE.13 | DateEvidence | 미검증 |
| INPUT.R05 | 실제 시작 시각·하루 경계 | PHASE.13 | DateEvidence.startedAt / AppSettings.dayCutoffMinutes | 미검증 |
| INPUT.R06 | 공부함 | PHASE.13 | StudyRecord.done | 미검증 |
| INPUT.R07 | 공부 내용과 생각 | PHASE.13 | StudyRecord.body | 미검증 |
| INPUT.R08 | 해 본 방법 태그 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R09 | 기본 공부·자율 복습 구분 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R10 | 이번 범위 마침 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R11 | 설명해 본 결과 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R12 | 명료함·익숙함·혼란 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R13 | 정확성·속도 예상 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R14 | 이번에 공부한 위치 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R15 | 다음에 이어 할 내용 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R16 | 이전 공부 이어 하기 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.R17 | 옛 상위 기록의 실제 대상 보정 | PHASE.30 | SourceMap / StudyRecord.targetId | 미검증 |
| INPUT.R18 | 선택 주제에 일괄 적용 | PHASE.13 | StudyRecord.done | 미검증 |
| INPUT.T01 | 현재 15개 하위 활동 체크 | PHASE.14 | TraceItem.status / ActivityDefinition | 미검증 |
| INPUT.T02 | 해당 없음·보류·체크 해제 | PHASE.14 | TraceItem.status | 미검증 |
| INPUT.T03 | 활동별 메모 | PHASE.14 | TraceItem.note | 미검증 |
| INPUT.T04 | 추가 반복 횟수와 기억 정도 | PHASE.14 | TraceItem.repeats | 미검증 |
| INPUT.T05 | 반복 메모 | PHASE.14 | TraceItem.repeats.note | 미검증 |
| INPUT.T06 | 학습 목표 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T07 | 학습 자료 서술 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T08 | 검증 조건 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T09 | 목표 달성 결과 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T10 | 백지 서술 결과 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T11 | 남은 부족함 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T12 | 다음 행동 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.T13 | C2 시험 전 서술 점검 | PHASE.14 | WrittenReview | 미검증 |
| INPUT.T14 | TRACE 기준 조정 | PHASE.14 | ActivityDefinition / TraceItem.definition | 미검증 |
| INPUT.C01 | 학기 등록과 연결 | PHASE.12 | Semester / Subject.scope | 미검증 |
| INPUT.C02 | 목차 이름·계층·순서 | PHASE.15 | OutlineNode | 미검증 |
| INPUT.C03 | 과목·단원·주제 표 입력 | PHASE.15 | OutlineNode / ImportPreview | 미검증 |
| INPUT.C04 | 목차 붙여넣기와 검수 | PHASE.15 | OutlineReview / Material / ImportPreview | 미검증 |
| INPUT.C05 | 자료 등록 | PHASE.16 | Material / Attachment | 미검증 |
| INPUT.C06 | 자료와 목차 연결 | PHASE.16 | MaterialLink | 미검증 |
| INPUT.C07 | 자료·목차의 쪽수 범위 | PHASE.16 | MaterialLink.pageRange | 미검증 |
| INPUT.C08 | 목차 검수 기록 | PHASE.16 | OutlineReview | 미검증 |
| INPUT.C09 | 예전 마침 기준·기준 라이브러리 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.C10 | 예전 기준의 자료 준비 상태 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.L01 | 예전 기준의 일부 함·마침 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.L02 | 단원 자체 공부의 범위 | PHASE.30 | StudyRecord.targetId / LegacyArchive.entryScope | 미검증 |
| INPUT.L03 | 이번에 공부한 쪽수·문제 범위 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.L04 | 이전 반복 목표 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.L05 | 이전 행동별 횟수 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.L06 | 기억으로 보충한 지난 공부 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.P01 | 확인할 항목 등록 | PHASE.16 | PerformanceItem | 미검증 |
| INPUT.P02 | 문제 원본·판본·동일성 | PHASE.16 | PerformanceItem.problemRef / Material | 미검증 |
| INPUT.P03 | 실제 수행 결과·도움 여부 | PHASE.16 | PerformanceAttempt | 미검증 |
| INPUT.P04 | 첫 시도·시점·조건 | PHASE.16 | PerformanceAttempt.conditions | 미검증 |
| INPUT.P05 | 채점·판정 근거 | PHASE.16 | PerformanceAttempt.grading | 미검증 |
| INPUT.P06 | 떠올린 목록·없음·중간 저장 | PHASE.16 | PerformanceRecallList / Draft | 미검증 |
| INPUT.P07 | 시험 계획과 범위 | PHASE.16 | ExamPlan | 미검증 |
| INPUT.P08 | 시험 응답·시도·채점 | PHASE.16 | ExamResponse | 미검증 |
| INPUT.P09 | 공식 시험 점수 | PHASE.16 | ExamScore | 미검증 |
| INPUT.P10 | 출제 가능·확정 표시 | PHASE.16 | ExamFocus | 미검증 |
| INPUT.P11 | 시험 준비 노출 설정 | PHASE.16 | AppSettings.examFocus | 미검증 |
| INPUT.G01 | WHY·HOW·원하는 수행 | PHASE.16 | Guidance.profile | 미검증 |
| INPUT.G02 | 이유 판단 유보 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.G03 | 선수 내용·다시 확인할 날 | PHASE.16 | Guidance.prerequisiteIds / Guidance.recheckDate | 미검증 |
| INPUT.G04 | 흥미·피로·여유·기대 도움·시작 부담 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.G05 | 느낌의 시점·대상·메모 | PHASE.30 | LegacyArchive.payload / Draft.legacyPayload / SourceMap | 미검증 |
| INPUT.G06 | 추천 숨기기·피드백 | PHASE.16 | Preference.guidance | 미검증 |
| INPUT.G07 | 오늘 그만하기·선택한 범위 | PHASE.16 | Guidance.finish / DefinitionSnapshot | 미검증 |
| INPUT.D01 | 해야 할 일 등록 | PHASE.16 | Task / Assignment / OnlineLecture | 미검증 |
| INPUT.D02 | 제출·시청 가능 시점과 기한 | PHASE.16 | Schedule.available / Schedule.due / Schedule.dueMeaning | 미검증 |
| INPUT.D03 | 범위·안내·첨부 | PHASE.16 | Task.detail / Attachment | 미검증 |
| INPUT.D04 | 과제 작성·제출 상태 | PHASE.16 | Assignment.preparation / Assignment.submission | 미검증 |
| INPUT.D05 | 강의 재생·수강 개수 | PHASE.16 | OnlineLecture.quantity / OnlineLecture.listened | 미검증 |
| INPUT.D06 | 강의 메모 여부·개수 | PHASE.16 | OnlineLecture.notesRequired / OnlineLecture.noted | 미검증 |
| INPUT.D07 | 출석 인정 확인 | PHASE.16 | OnlineLecture.attendanceConfirmed | 미검증 |
| INPUT.D08 | 실제 완료일·취소·보관·복원 | PHASE.16 | Task.completedAt / Task.completedOn / Revision | 미검증 |
| INPUT.W01 | Canvas 의문·메모 본문 | PHASE.22 | Question / Memo / Narrative | 미검증 |
| INPUT.W02 | 메모 종류·연결·배치 | PHASE.22 | Relation / ViewLayout | 미검증 |
| INPUT.W03 | 파일·이미지 첨부 | PHASE.22 | Attachment | 미검증 |
| INPUT.W04 | 코드·수식 표현 보조 | PHASE.13 | Narrative.body / StudyRecord.body | 미검증 |
| INPUT.W05 | Anki 자기 서술 | PHASE.16 | AnkiCard / Narrative / Draft | 미검증 |
| INPUT.W06 | Anki 회상 평가 | PHASE.16 | AnkiReview.rating / Revision | 미검증 |
| INPUT.W07 | Anki 복습 간격 | PHASE.16 | AppSettings.anki | 미검증 |
| INPUT.U01 | 통계 범위·기간 | PHASE.28 | Preference.statistics / derived Statistics | 미검증 |
| INPUT.U02 | 진행도·연결 지도 탐색 | PHASE.22 | ViewPreference / NavigationContext | 미검증 |
| INPUT.U03 | Home·보조 창 범위·창 배치 | PHASE.27 | NavigationContext / ViewLayout | 미검증 |
| INPUT.U04 | 글꼴·간격 등 디자인 설정 | PHASE.26 | AppSettings | 미검증 |
| INPUT.U05 | 백업 가져오기·내보내기 | PHASE.29 | ExportPackage / ImportBatch | 미검증 |
| INPUT.U06 | 충돌·기록 선택·되돌리기 | PHASE.21 | Revision / Conflict | 미검증 |
| INPUT.U07 | 작성 중 초안·단계 복원 | PHASE.18 | Draft / NavigationContext | 미검증 |
| INPUT.U08 | 식별자·정의·수정 시각 | PHASE.03 | Entity / Revision / DefinitionSnapshot | 미검증 |
| INPUT.U09 | 공부 후보로 표시할 과목 | PHASE.27 | Preference.studyCandidates | 미검증 |
| INPUT.N01 | 전반적 체감 어려움 | PHASE.13 | StudyRecord.generalDifficulty | 미검증 |
| INPUT.N02 | TRACE 반복의 실제 날짜 근거 | PHASE.14 | TraceItem.repeats.dateEvidence | 미검증 |
| REQUEST.R01 | 작은 공부→기록 변화→다음 공부→실제 수행 성공 | PHASE.08 | Guidance / NavigationContext / StudyRecord / StudySession | 미검증 |
| REQUEST.R02 | 공부 후 책을 정리한 뒤 iPad에서 여러 주제 기록 | PHASE.13 | StudyRecord / StudySession | 미검증 |
| REQUEST.R03 | 글 없이 공부 사실 기록 | PHASE.13 | StudyRecord / StudySession | 미검증 |
| REQUEST.R04 | 부분 수행·막힘도 시도 기록 | PHASE.13 | ActivityDefinition / StudyRecord / StudySession / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R05 | 목차 깊이 자유·추가/이동 전체 연동 | PHASE.15 | OutlineNode.order / OutlineNode.parentId | 미검증 |
| REQUEST.R06 | 이전 14체크→5묶음→C2추가→15하위항목 | PHASE.14 | ActivityDefinition / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R07 | 평소 입력에는 쉬운 한글 행동명 | PHASE.14 | ActivityDefinition / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R08 | T→R→A→C→E 순서 강제 없음 | PHASE.14 | ActivityDefinition / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R09 | C2 자기화 재구성 | PHASE.14 | WrittenReview | 미검증 |
| REQUEST.R10 | 의인화 문답은 공통 기법 | PHASE.14 | ActivityDefinition / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R11 | 시험 전 C2 서술 점검 | PHASE.14 | WrittenReview | 미검증 |
| REQUEST.R12 | C4 백지 서술 선택 | PHASE.14 | ActivityDefinition / LegacyArchive / SourceMap / TraceItem.definition / TraceItem.status | 미검증 |
| REQUEST.R13 | 한 공부 여러 활동은 회차 하나 | PHASE.13 | StudyRecord / StudySession | 미검증 |
| REQUEST.R14 | 정확/최소/미정 반복 | PHASE.14 | TraceItem.repeats | 미검증 |
| REQUEST.R15 | 변형·대표 문제 세부 분류 피로 | PHASE.16 | PerformanceAttempt / PerformanceItem | 미검증 |
| REQUEST.R16 | 과제 준비와 제출, 강의 재생/학습/출석 구별 | PHASE.16 | Assignment / OnlineLecture / Task | 미검증 |
| REQUEST.R17 | 늦은 제출·재제출 특수 흐름 제외 | PHASE.16 | Assignment / Task | 미검증 |
| REQUEST.R18 | 알림은 앱 내 임박 묶음 | PHASE.16 | Preference / Task | 미검증 |
| REQUEST.R19 | 생활 동역학은 필수 흐름 제외 | PHASE.27 | Guidance / ResearchDecision | 미검증 |
| REQUEST.R20 | 쪽수 등 쓰지 않는 상세 입력 축소 | PHASE.30 | LegacyArchive / SourceMap | 미검증 |
| REQUEST.R21 | 통계6개→8개, 공부 행동으로 연결 | PHASE.28 | StudyRecord / derived Statistics | 미검증 |
| REQUEST.R22 | TRACE 가중/최근성 지표 | PHASE.28 | StudyRecord / derived Statistics | 미검증 |
| REQUEST.R23 | 통계에 반영 안 되는 입력 정리 | PHASE.30 | LegacyArchive / SourceMap | 미검증 |
| REQUEST.R24 | 과목 내부 TRACE 현황 | PHASE.14 | StudyRecord.trace / derived SubjectStatus | 미검증 |
| REQUEST.R25 | 홈은 기록 입구와 쌓인 변화 | PHASE.27 | StudyRecord / Task / derived Dashboard | 미검증 |
| REQUEST.R26 | 과제와 강의 달력 별도 | PHASE.16 | ExamDate / Schedule / Task | 미검증 |
| REQUEST.R27 | 설정은 설정 탭에서 탭별 관리 | PHASE.26 | AppSettings / Preference | 미검증 |
| REQUEST.R28 | K-A-C 탐색과 기존 테마 보존 | PHASE.15 | NavigationContext | 미검증 |
| REQUEST.R29 | 과목/단원/목차/주제 형광펜 일관성 | PHASE.22 | OutlineNode / ViewLayout | 미검증 |
| REQUEST.R30 | 출제 가능 orange / 확정 red | PHASE.16 | ExamDate / ExamFocus / ExamPlan / ExamResponse | 미검증 |
| REQUEST.R31 | 볼드체는 특정 시험계층 한정 | PHASE.16 | AppSettings / ExamDate / ExamFocus / ExamPlan / ExamResponse / Preference | 미검증 |
| REQUEST.R32 | 과목 개요·단원 서문 | PHASE.13 | Narrative | 미검증 |
| REQUEST.R33 | 뒤로가기·현재 입력 대상 표시 | PHASE.15 | NavigationContext | 미검증 |
| REQUEST.R34 | 한글 IME·키보드 보존 | PHASE.13 | NavigationContext / StudyRecord / StudySession / derived SearchIndex | 미검증 |
| REQUEST.R35 | Canvas 주제→의문→메모 | PHASE.22 | Memo / Question / Relation | 미검증 |
| REQUEST.R36 | Canvas 자동생성 재검토 | PHASE.22 | OutlineNode / ViewLayout | 미검증 |
| REQUEST.R37 | Anki 메모와 Canvas 메모 통합 | PHASE.16 | AnkiCard / AnkiReview / Draft / Memo / Question / Relation | 미검증 |
| REQUEST.R38 | Canvas 간격·개인 배치 | PHASE.22 | OutlineNode / ViewLayout | 미검증 |
| REQUEST.R39 | 입력·파일 변경·창 전환 지연 | PHASE.34 | derived runtime metrics | 미검증 |
| REQUEST.R40 | 다른 기기 충돌로 전체 창 중단 | PHASE.21 | Conflict / Revision | 미검증 |
| REQUEST.R41 | 반복 초안 확인 배너 | PHASE.18 | Draft | 미검증 |
| REQUEST.R42 | 학기 경계·새 학기 데이터 이동 | PHASE.12 | Semester / Subject.scope | 미검증 |
| REQUEST.R43 | 휴지통과 영구삭제 | PHASE.15 | DeletionPolicy / LegacyArchive / OutlineNode.deletedAt / Revision | 미검증 |
| REQUEST.R44 | 앱 내 내부 JSON·개발 UI 숨기기 | PHASE.27 | StudyRecord / Task / derived Dashboard | 미검증 |
| REQUEST.R45 | 토큰·컴포넌트 먼저 | PHASE.22 | OutlineNode / derived View | 미검증 |
| REQUEST.R46 | 실제 데이터/시험 데이터 분리 | PHASE.23 | AppShell / Cache / SyncState | 미검증 |
| REQUEST.R47 | GitHub 코드 기준·작은 commit | PHASE.23 | AppShell / Cache / SyncState | 미검증 |
| REQUEST.R48 | Supabase/IndexedDB/PWA는 후보 | PHASE.23 | AppShell / Cache / SyncState | 미검증 |
| REQUEST.R49 | 미완4개는 우선 발굴 | PHASE.22 | OutlineNode / derived View | 미검증 |
| REQUEST.R50 | 실제한학기QA·전조작 | PHASE.34 | derived runtime metrics | 미검증 |
| REQUEST.R51 | 자료 전체회수, 불명확하면미검증 | PHASE.30 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| REQUEST.R52 | 3단계 표와4단계후보 충돌 | PHASE.15 | ImportPreview / OutlineNode / Preference | 미검증 |
| REQUEST.R53 | 일반 공부 입력만 줄이고 별도 학습 평가는 유지 | PHASE.30 | AnkiCard / AnkiReview / Draft / LegacyArchive / PerformanceAttempt / PerformanceItem / SourceMap | 미검증 |
| REQUEST.R54 | 최초 조사 답변의 잠정성과 자유서술 보존 | PHASE.30 | ImportBatch / LegacyArchive / SourceMap | 미검증 |
| REQUEST.CORRECTION01 | 도메인 Stable ID는 문자열입니다. UUID만 허용하지 않습니다. | PHASE.03,PHASE.30 | Stable ID / SourceMap | 미검증 |
| REQUEST.CORRECTION02 | 학기 미지정(unassigned), 독립(independent), 실제 학기(semester)를 구분합니다. 기존 자료를 임의 학기로 배정하지 않습니다. | PHASE.12,PHASE.30 | Scope / Subject | 미검증 |
| REQUEST.CORRECTION03 | StudySession은 원 사건 ID를 보존합니다. 여러 과목/학기 entry를 가진 기존 세션을 자동 분할하지 않습니다. 대상별 StudyRecord의 소속만 정확히 검증합니다. | PHASE.13,PHASE.30 | StudySession / StudyRecord | 미검증 |
| REQUEST.CORRECTION04 | 자료·목차검수·Guidance·수행·시험·Anki·시험일 별도 원장과 기기 초안도 이관 범위입니다. | PHASE.16,PHASE.30 | Material / OutlineReview / Guidance / Performance / Exam / Anki / Draft | 미검증 |
| REQUEST.CORRECTION05 | 일정의 예상 기한 anchorDate, available date/time, dueMeaning, 수강/메모/출석 개수, 시험일 unknown/scheduled/none·previousDate·trackStart를 보존합니다. | PHASE.16,PHASE.30 | Schedule / OnlineLecture / ExamDate | 미검증 |
| REQUEST.CORRECTION06 | C2 일반 글 수정과 시험 전 점검 확인은 서로 다른 명령입니다. 글 수정은 점검만 해제하고 원문·평소 체크는 보존합니다. | PHASE.14 | WrittenReview | 미검증 |
| REQUEST.CORRECTION07 | UX112개 pending은 미구현 판정이 아닙니다. 후속 최종 실행 README는 현재 없고 원래 후보보다 좁은 구현 범위도 있습니다. | PHASE.09,PHASE.31 | UXDecision | 미검증 |
| REQUEST.CORRECTION08 | 홈 후보의 정확한 의미는 ‘아직 기록이 없는 주제’입니다. 자유 메모만 있어도 후보에서 제외하지만 공부 횟수를 증가시키지 않습니다. | PHASE.27,PHASE.28 | StudyRecord / derived Dashboard | 미검증 |
| REQUEST.CORRECTION09 | 통계는 examStatus=no 제외·고유 session·각 지표의 날짜 범위·unknown·snapshot만 집계하는 계약을 보존합니다. 후보 숨김과 통계 제외는 다릅니다. | PHASE.28 | derived Statistics / Preference | 미검증 |
| REQUEST.CORRECTION10 | CSS 문서의 마지막 우선순위 설명과 현재 build 순서는 다릅니다. 과목 회색/단원 주황/목차 파랑/주제 노랑, 주제 이름 기울임을 회수하며 시험 표시 색과는 별도 축입니다. | PHASE.06,PHASE.22 | OutlineNode.role / ViewLayout / semantic tokens | 미검증 |
| REQUEST.CORRECTION11 | 여러 주제 공통 적용은 done이며 개별 글·활동·어려움을 일괄 덮지 않습니다. | PHASE.13 | StudyRecord.done | 미검증 |
| REQUEST.CORRECTION12 | PDF1쪽의 ‘기존 경험 회수’는 PDF 원문이 아니라 현재 사용자 지시였습니다. 원문 출처를 정정했습니다. 위험 행동 분리와 같은 논리 ID의 여러 상이한 원문 보존을 독립 불변조건으로 추가했습니다. | PHASE.21,PHASE.31 | Conflict / Revision / SourceMap | 미검증 |
| REQUEST.CORRECTION13 | 현재 요청에 따라 가짜 데이터 UX → 온라인 CRUD → IndexedDB/offline 순서가 이전 발굴 Phase 초안보다 우선합니다. | PHASE.09,PHASE.11,PHASE.18 | OnlineRepository / Draft / SyncOperation | 미검증 |
| INV.INV01 | 모든 대상은 같은 user/namespace에 속한다. 다른 사용자의 읽기·쓰기를 거부한다. | PHASE.03 | process | 미검증 |
| INV.INV02 | Subject의 Scope는 명시 명령 없이 바뀌지 않는다. 새 학기 생성은 기존 학기 무변경이다. | PHASE.03 | process | 미검증 |
| INV.INV03 | 노드 부모는 같은 Subject이며 자기/후손 밑으로 이동할 수 없다. 동명은 중복 ID가 아니다. | PHASE.03 | process | 미검증 |
| INV.INV04 | StudySession은 원 ID와 실제 사건 의미를 유지한다. 대상별 Record 소속은 검증하되 과거 복수 범위 세션을 쪼개지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV05 | Topic 휴지통 이동은 StudyRecord/본문/Revision을 삭제하지 않는다. 복원은 같은 ID로 한다. | PHASE.03 | process | 미검증 |
| INV.INV06 | done 또는 실제 활동 체크와 메모/조회/자료 열기를 구별한다. 여러 활동을 한 사건의 여러 회차로 세지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV07 | TRACE 순서 잠금·자동 숙련 판정·옛 체크의 새 항목 전체 환산을 하지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV08 | C2 평소 체크에는 글이 필수가 아니다. 시험 전 점검만 nonblank를 요구하고 글 수정 시 재확인한다. | PHASE.03 | process | 미검증 |
| INV.INV09 | 정확/최소/미정·날짜 범위·미응답은 0이나 확정값이 되지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV10 | 같은 opId+같은 payload는 한 번만 적용한다. 같은 opId+다른 payload는 오류다. | PHASE.03 | process | 미검증 |
| INV.INV11 | 수정은 expectedVersion과 실제 version을 비교한다. 충돌 시 양쪽 본문을 남긴다. | PHASE.03 | process | 미검증 |
| INV.INV12 | Undo도 새 수정 이력이다. 그 뒤 다른 변경을 조용히 되감지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV13 | Canvas/layout 명령은 도메인 트리나 기록을 변경할 수 없다. | PHASE.03 | process | 미검증 |
| INV.INV14 | 사용자 배치는 자동 재계산으로 덮어쓰지 않는다. Canvas 자동 생성은 필요 시 열기 후보를 검증 후 채택한다. | PHASE.03 | process | 미검증 |
| INV.INV15 | 중복 공부 페이지는 읽기 보류/충돌로 보존한다. 이름이 같다는 이유로 자동 병합하거나 덮어쓰지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV16 | 같은 import의 재실행은 동일 source map을 재사용한다. 깨진/누락 원문을 건너뛰고 성공으로 표시하지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV17 | 테스트 데이터는 demo/test namespace에서만 만들며 개인 통계에 합산하지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV18 | 저장 성공 표시는 실제 저장 단계와 일치한다. 미전송 원본은 캐시 삭제 대상이 아니다. | PHASE.03 | process | 미검증 |
| INV.INV19 | stale 응답은 user/scope/request identity가 일치할 때만 반영한다. | PHASE.03 | process | 미검증 |
| INV.INV20 | Export/복원은 ID·원문·draft·revision·설정·배치·연결·첨부를 검증한다. | PHASE.03 | process | 미검증 |
| INV.INV21 | 위험 조작은 자주 쓰는 조작과 분리한다. 휴지통과 영구삭제를 같은 버튼으로 숨기지 않는다. | PHASE.03 | process | 미검증 |
| INV.INV22 | 일반 입력의 퇴역 필드를 자동 복원하지 않는다. 별도 수행/시험/Anki 입력과 legacy 원문은 보존한다. | PHASE.03 | process | 미검증 |
| FAILURE.FM01 | 빈 입력 | PHASE.32 | process | 미검증 |
| FAILURE.FM02 | 잘못된 입력 | PHASE.32 | process | 미검증 |
| FAILURE.FM03 | 긴 입력 | PHASE.32 | process | 미검증 |
| FAILURE.FM04 | 대량 데이터 | PHASE.32 | process | 미검증 |
| FAILURE.FM05 | 빠른 연속 클릭 | PHASE.32 | process | 미검증 |
| FAILURE.FM06 | 중복 저장/업로드 | PHASE.32 | process | 미검증 |
| FAILURE.FM07 | 요청 취소 | PHASE.32 | process | 미검증 |
| FAILURE.FM08 | 저장 도중 화면 이동 | PHASE.32 | process | 미검증 |
| FAILURE.FM09 | 앱 종료 | PHASE.32 | process | 미검증 |
| FAILURE.FM10 | 앱 재실행 | PHASE.32 | process | 미검증 |
| FAILURE.FM11 | 로컬 저장 실패 | PHASE.32 | process | 미검증 |
| FAILURE.FM12 | 서버 오류 | PHASE.32 | process | 미검증 |
| FAILURE.FM13 | Offline 진입 | PHASE.32 | process | 미검증 |
| FAILURE.FM14 | Online 복귀 | PHASE.32 | process | 미검증 |
| FAILURE.FM15 | stale response | PHASE.32 | process | 미검증 |
| FAILURE.FM16 | race condition | PHASE.32 | process | 미검증 |
| FAILURE.FM17 | 두 기기 동시 수정 | PHASE.32 | process | 미검증 |
| FAILURE.FM18 | sync conflict | PHASE.32 | process | 미검증 |
| FAILURE.FM19 | Import 중 실패 | PHASE.32 | process | 미검증 |
| FAILURE.FM20 | 같은 Import 반복 | PHASE.32 | process | 미검증 |
| FAILURE.FM21 | 새 학기 생성 | PHASE.32 | process | 미검증 |
| FAILURE.FM22 | 다른 과목 부모 지정 | PHASE.32 | process | 미검증 |
| FAILURE.FM23 | 목차 삭제와 복원 | PHASE.32 | process | 미검증 |
| FAILURE.FM24 | Undo 후 다른 변경 | PHASE.32 | process | 미검증 |
| FAILURE.FM25 | Canvas 렌더/배치 오류 | PHASE.32 | process | 미검증 |
| FAILURE.FM26 | 충돌 파일 다수 | PHASE.32 | process | 미검증 |
| FAILURE.FM27 | 한글 조합 중 autosave | PHASE.32 | process | 미검증 |
| FAILURE.FM28 | 한글 검색 조합 | PHASE.32 | process | 미검증 |
| FAILURE.FM29 | 키보드 가림·scroll jump | PHASE.32 | process | 미검증 |
| FAILURE.FM30 | 인증 만료/사용자 변경 | PHASE.32 | process | 미검증 |
| FAILURE.FM31 | 기기 로컬 용량/삭제 | PHASE.32 | process | 미검증 |
| FAILURE.FM32 | Service Worker 업데이트 | PHASE.32 | process | 미검증 |
| FAILURE.FM33 | Export/Restore 실패 | PHASE.32 | process | 미검증 |
| FAILURE.FM34 | 시험 데이터 통계 혼입 | PHASE.32 | process | 미검증 |
| FAILURE.FM35 | C2 시험 서술 수정 | PHASE.32 | process | 미검증 |
| FAILURE.FM36 | 불확실한 날짜/반복 | PHASE.32 | process | 미검증 |
| FAILURE.FM37 | 퇴역 필드 재등장 | PHASE.32 | process | 미검증 |
| FAILURE.FM38 | 위험 조작 근접/Enter | PHASE.32 | process | 미검증 |
| FAILURE.FM39 | 부분 성공 | PHASE.32 | process | 미검증 |
| FAILURE.FM40 | 시간대·기한 변경 | PHASE.32 | process | 미검증 |
| UI.UI01 | 홈/대시보드 | PHASE.27 | view | 미검증 |
| UI.UI02 | 학기 선택 | PHASE.12 | view | 미검증 |
| UI.UI03 | 학기 생성 | PHASE.12 | view | 미검증 |
| UI.UI04 | 과목 목록 | PHASE.15 | view | 미검증 |
| UI.UI05 | 과목 개요 | PHASE.13 | view | 미검증 |
| UI.UI06 | 단원·목차 | PHASE.15 | view | 미검증 |
| UI.UI07 | 일괄 목차 입력 | PHASE.15 | view | 미검증 |
| UI.UI08 | 목차 자료 받아들이기 | PHASE.15 | view | 미검증 |
| UI.UI09 | 주제 상세 | PHASE.08 | view | 미검증 |
| UI.UI10 | 기록 입구 | PHASE.13 | view | 미검증 |
| UI.UI11 | 자유 기록 | PHASE.13 | view | 미검증 |
| UI.UI12 | TRACE | PHASE.14 | view | 미검증 |
| UI.UI13 | C2 시험 전 점검 | PHASE.14 | view | 미검증 |
| UI.UI14 | 추가 반복 | PHASE.14 | view | 미검증 |
| UI.UI15 | 체크리스트 기준 | PHASE.14 | view | 미검증 |
| UI.UI16 | 직접 수행 | PHASE.16 | view | 미검증 |
| UI.UI17 | 시험 | PHASE.16 | view | 미검증 |
| UI.UI18 | Anki 복습 | PHASE.16 | view | 미검증 |
| UI.UI19 | 과목별 현황 | PHASE.14 | view | 미검증 |
| UI.UI20 | 통계 | PHASE.28 | view | 미검증 |
| UI.UI21 | 통계 그래프 | PHASE.28 | view | 미검증 |
| UI.UI22 | 검색 | PHASE.17 | view | 미검증 |
| UI.UI23 | 최근/뒤로/Breadcrumb | PHASE.15 | view | 미검증 |
| UI.UI24 | 할 일·과제 | PHASE.16 | view | 미검증 |
| UI.UI25 | 온라인 강의 | PHASE.16 | view | 미검증 |
| UI.UI26 | 일정·시험일 | PHASE.16 | view | 미검증 |
| UI.UI27 | Kanban | PHASE.22 | view | 미검증 |
| UI.UI28 | Canvas/Graph | PHASE.22 | view | 미검증 |
| UI.UI29 | 첨부 | PHASE.22 | view | 미검증 |
| UI.UI30 | 설정 | PHASE.26 | view | 미검증 |
| UI.UI31 | 안내·선택 도구 | PHASE.08 | view | 미검증 |
| UI.UI32 | 저장·초안 복구 | PHASE.18 | view | 미검증 |
| UI.UI33 | Revision·Undo | PHASE.29 | view | 미검증 |
| UI.UI34 | Conflict | PHASE.21 | view | 미검증 |
| UI.UI35 | 휴지통 | PHASE.15 | view | 미검증 |
| UI.UI36 | Backup/Export/Restore | PHASE.29 | view | 미검증 |
| UI.UI37 | Obsidian Import | PHASE.30 | view | 미검증 |
| UI.UI38 | PWA·업데이트 | PHASE.23 | view | 미검증 |
| PUI01 | 홈의 본문 없는 공부함 | PHASE.08 | process | 미검증 |
| PUI02 | 홈 기록 Undo | PHASE.08 | process | 미검증 |
| PUI03 | 여러 주제 선택·서로 다른 메모·공통 공부함·저장 | PHASE.08 | process | 미검증 |
| PUI04 | 주제→기록 입력→메모·공부함 해제 | PHASE.08 | process | 미검증 |
| PUI05 | 저장된 기록 수정 중 과목으로 이탈→같은 주제 복귀 | PHASE.08 | process | 미검증 |
| PUI06 | 완전한 페이지 재실행→작성 초안 | PHASE.08 | process | 미검증 |
| PUI07 | TRACE 펼침·15개 활동 표시·C2 선택 | PHASE.08 | process | 미검증 |
| PUI08 | 본문 빈 상태에서 C2 일반 체크 저장 | PHASE.08 | process | 미검증 |
| PUI09 | 시험 전 서술 저장→점검 체크→체크 해제 | PHASE.08 | process | 미검증 |
| PUI10 | Breadcrumb 과목·주제 이동, 최근 주제 복귀 | PHASE.08 | process | 미검증 |
| PUI11 | 과목의 목차 추가·긴 한글 이름 | PHASE.08 | process | 미검증 |
| PUI12 | 주제 이름 수정 | PHASE.08 | process | 미검증 |
| PUI13 | 목차 휴지통 이동 전 영향 안내→실행→휴지통 복원 | PHASE.08 | process | 미검증 |
| PUI14 | 새 학기 생성→빈 과목 목록→새 과목 추가→기존 학기 조회 | PHASE.08 | process | 미검증 |
| PUI15 | 자유 기록 여러 문단 입력→저장 | PHASE.08 | process | 미검증 |
| PUI16 | 기록 본문 ‘기울기’ 검색→다른 주제 열기 | PHASE.08 | process | 미검증 |
| PUI17 | Light/Dark 선택·390/510/768 폭 | PHASE.08 | process | 미검증 |
| PUI18 | 두 번째 창에서 동일 demo 열기 | PHASE.08 | process | 미검증 |
| PUI19 | 좁은 화면 저장 알림→하단 기록 버튼 | PHASE.08 | process | 미검증 |
| PUI20 | 기본 필드와 하단 이동의 DOM 크기 | PHASE.08 | process | 미검증 |
| PDF.P01 | 겨울방학 계획과 GitHub Pages 모바일 웹앱을 쓰고 싶다는 회고 | PHASE.02 | undecided | 미검증 |
| PDF.P02 | 선택지를 줄이고 묶어 판단을 쉽게 | PHASE.02 | undecided | 미검증 |
| PDF.P03 | 관계있는 정보와 조작을 가깝게 | PHASE.02 | undecided | 미검증 |
| PDF.P04 | 익숙한 탐색 방식 | PHASE.02 | undecided | 미검증 |
| PDF.P05 | 한 화면의 핵심 행동 구별 | PHASE.02 | undecided | 미검증 |
| PDF.P06 | 핵심 조작은 충분한 크기와 가까운 위치 | PHASE.02 | undecided | 미검증 |
| PDF.P07 | 16가지 사고·전략 프레임워크 이미지 | PHASE.02 | undecided | 미검증 |
| PDF.P08 | 공통 컴포넌트부터 만들기 | PHASE.02 | undecided | 미검증 |
| PDF.P09 | 대시보드 별도 메모 | PHASE.02 | undecided | 미검증 |
| PDF.P10 | 글자 역할과 size/weight/line-height | PHASE.02 | undecided | 미검증 |
| PDF.P11 | 그림자 단계 제한 | PHASE.02 | undecided | 미검증 |
| PDF.P12 | 기준 먼저, 화면 생성은 그 뒤 | PHASE.02 | undecided | 미검증 |
| PDF.P13 | 버튼과 입력의 주요 상태 | PHASE.02 | undecided | 미검증 |
| PDF.P14 | 간격을 scale로 | PHASE.02 | undecided | 미검증 |
| PDF.P15 | 모서리 반경을 scale로 | PHASE.02 | undecided | 미검증 |
| PDF.P16 | 색을 Hex 대신 역할로 | PHASE.02 | undecided | 미검증 |
| PDF.P17 | Undo·휴지통·복원 | PHASE.02 | undecided | 미검증 |
| PDF.P18 | 확인 버튼에 실제 행동명 | PHASE.02 | undecided | 미검증 |
| PDF.P19 | 미저장 입력 이탈 방지 | PHASE.02 | undecided | 미검증 |
| PDF.P20 | 실행 전에 위험 결과 이해 | PHASE.02 | undecided | 미검증 |
| PDF.P21 | 미완 항목부터 조사 | PHASE.02 | undecided | 미검증 |
| PDF.P22 | Kanban 위계와 Canvas 배열이 다름 | PHASE.02 | undecided | 미검증 |
| PDF.P23 | 충돌 파일 직접 삭제 후 오작동 | PHASE.02 | undecided | 미검증 |
| PDF.P24 | 새 학기 만들 때 기존 데이터 이동 | PHASE.02 | undecided | 미검증 |
| PDF.P25 | 삭제한 목차·내용 영구삭제 방법 불명확 | PHASE.02 | undecided | 미검증 |
| PDF.P26 | 과목·목차마다 Canvas 자동생성이 적절한가 | PHASE.02 | undecided | 미검증 |
| PDF.P27 | 로컬 파일 의존이 위험 | PHASE.02 | undecided | 미검증 |
| PDF.P28 | 첫 화면에 왜 있는지 모를 요소 | PHASE.02 | undecided | 미검증 |
| PDF.P29 | 깐깐한 실제 학생의 한 학기 사용 QA | PHASE.02 | undecided | 미검증 |
| PDF.P30 | 문제를 재현·원인·수정·재검증까지 | PHASE.02 | undecided | 미검증 |
| PDF.P31 | 원본·ID·기록·설정·병행 작업 보존 | PHASE.02 | undecided | 미검증 |
| PDF.P32 | UX/UI와 내부 품질 각각 검토 | PHASE.02 | undecided | 미검증 |
| PDF.P33 | 죽은 코드처럼 보여도 성급한 삭제 금지 | PHASE.02 | undecided | 미검증 |
| PDF.PAGE01 | 개발 방향·겨울방학 전환 메모, UX 링크 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE02 | Hick: 선택지 수와 판단 부담 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE03 | UX 원칙 소개 표지 | PHASE.00 | context | 미검증 |
| PDF.PAGE04 | 다섯 원칙 및 좋은 화면의 요점 요약 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE05 | Proximity: 관계있는 요소를 가까이 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE06 | Jakob: 익숙한 사용 관습 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE07 | Von Restorff: 핵심 행동의 구별 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE08 | Fitts: 조작 크기·거리 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE09 | 빈 페이지 | PHASE.00 | context | 미검증 |
| PDF.PAGE10 | 논리·전략 프레임워크 16개 이미지 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE11 | 공통 컴포넌트부터 만들기 / 대시보드 메모와 외부 링크 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE12 | Typography: 역할·크기·두께·행간 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE13 | Shadow: 제한된 깊이 단계 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE14 | 디자인 기준을 먼저 정하기 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE15 | 버튼·입력의 상태 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE16 | Spacing scale 예시 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE17 | Button / Input / List 공통 컴포넌트 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE18 | Radius scale 예시 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE19 | 컬러 시스템 소개 이미지 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE20 | Color: 역할 중심 이름 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE21 | 빈 페이지 | PHASE.00 | context | 미검증 |
| PDF.PAGE22 | 오류 예방 UX 네 원칙 요약 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE23 | Undo·휴지통·복원 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE24 | 확인 대신 구체적인 행동명 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE25 | 저장되지 않은 입력이 있을 때 이탈 예방 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE26 | 파괴적 행동의 결과를 미리 안내 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE27 | 오류 예방 UX 표지 | PHASE.00 | context | 미검증 |
| PDF.PAGE28 | 미완 작업 우선, Kanban/Canvas 위계 어긋남 및 오류 화면 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE29 | Finder에서 충돌 파일 직접 삭제 후 다수 충돌·오작동 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE30 | 학기 데이터 이동 / 영구 삭제 / Canvas 자동생성 / 로컬 위험 / 시작 화면 의문 / 실제 사용 QA 요청 시작 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE31 | 실제 한 학기 사용 시나리오와 결함·수정 기준 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE32 | 원본·병행 변경 보존, 검증 증거 분리, UI와 코드 검토 분리 | PHASE.00 | undecided | 미검증 |
| PDF.PAGE33 | UI 전 상태·코드 구조·동시성·호환·검증 요구 | PHASE.00 | undecided | 미검증 |
| UX.UX001 | 명령 팔레트 | PHASE.17 | undecided | 미검증 |
| UX.UX002 | 오타 허용 검색 | PHASE.17 | undecided | 미검증 |
| UX.UX003 | 검색 결과 문맥 강조 | PHASE.17 | undecided | 미검증 |
| UX.UX004 | 경로에서 바로 이동 | PHASE.17 | undecided | 미검증 |
| UX.UX005 | 최근 열었던 위치 | PHASE.17 | undecided | 미검증 |
| UX.UX006 | 돌아오면 같은 자리 | PHASE.17 | undecided | 미검증 |
| UX.UX007 | 검색 범위 칩 | PHASE.17 | undecided | 미검증 |
| UX.UX008 | 단축키 안내 | PHASE.17 | undecided | 미검증 |
| UX.UX009 | 제자리 이름 수정 | PHASE.13 | undecided | 미검증 |
| UX.UX010 | 내용에 맞게 자라는 메모 | PHASE.13 | undecided | 미검증 |
| UX.UX011 | 입력 중 추천 목록 | PHASE.13 | undecided | 미검증 |
| UX.UX012 | 붙여넣기 미리보기 | PHASE.13 | undecided | 미검증 |
| UX.UX013 | 여러 셀 일괄 편집 | PHASE.13 | undecided | 미검증 |
| UX.UX014 | 입력칸 옆 검증 | PHASE.13 | undecided | 미검증 |
| UX.UX015 | 서식 도구막대 | PHASE.13 | undecided | 미검증 |
| UX.UX016 | 서술 차이 비교 | PHASE.13 | undecided | 미검증 |
| UX.UX017 | 선택 항목 도구막대 | PHASE.13 | undecided | 미검증 |
| UX.UX018 | Shift 범위 선택 | PHASE.13 | undecided | 미검증 |
| UX.UX019 | 드래그 영역 선택 | PHASE.13 | undecided | 미검증 |
| UX.UX020 | 필터 뒤 선택 유지 | PHASE.13 | undecided | 미검증 |
| UX.UX021 | 일부 선택 표시 | PHASE.13 | undecided | 미검증 |
| UX.UX022 | 선택 범위 미리보기 | PHASE.13 | undecided | 미검증 |
| UX.UX023 | 선택만 되돌리기 | PHASE.13 | undecided | 미검증 |
| UX.UX024 | 터치 선택 모드 | PHASE.13 | undecided | 미검증 |
| UX.UX025 | 폭을 바꾸는 분할 창 | PHASE.25 | undecided | 미검증 |
| UX.UX026 | 옆에서 여는 상세 창 | PHASE.25 | undecided | 미검증 |
| UX.UX027 | 높이 단계가 있는 아래 시트 | PHASE.25 | undecided | 미검증 |
| UX.UX028 | 화면 끝을 피하는 팝오버 | PHASE.25 | undecided | 미검증 |
| UX.UX029 | 창 도킹·탭 묶음 | PHASE.25 | undecided | 미검증 |
| UX.UX030 | 배치 저장·복원 | PHASE.25 | undecided | 미검증 |
| UX.UX031 | 한 창만 넓게 보기 | PHASE.25 | undecided | 미검증 |
| UX.UX032 | 작업 중 창 전환 | PHASE.25 | undecided | 미검증 |
| UX.UX033 | 카드 들어 올려 정렬 | PHASE.15 | undecided | 미검증 |
| UX.UX034 | 놓을 위치 안내선 | PHASE.15 | undecided | 미검증 |
| UX.UX035 | 경계에서 자동 스크롤 | PHASE.15 | undecided | 미검증 |
| UX.UX036 | 자석처럼 정렬 맞추기 | PHASE.15 | undecided | 미검증 |
| UX.UX037 | 여러 카드 함께 이동 | PHASE.15 | undecided | 미검증 |
| UX.UX038 | 크기 조절 손잡이 | PHASE.15 | undecided | 미검증 |
| UX.UX039 | 끌지 않고 위치 지정 | PHASE.15 | undecided | 미검증 |
| UX.UX040 | 파일 끌어 놓기 미리보기 | PHASE.15 | undecided | 미검증 |
| UX.UX041 | 작업 직후 되돌리기 | PHASE.21 | undecided | 미검증 |
| UX.UX042 | 다시 실행 | PHASE.21 | undecided | 미검증 |
| UX.UX043 | 저장 대기·성공 구별 | PHASE.21 | undecided | 미검증 |
| UX.UX044 | 실패해도 입력 유지 | PHASE.21 | undecided | 미검증 |
| UX.UX045 | 충돌 전후 비교 | PHASE.21 | undecided | 미검증 |
| UX.UX046 | 일부 성공 상세 | PHASE.21 | undecided | 미검증 |
| UX.UX047 | 초안 이어 쓰기 | PHASE.21 | undecided | 미검증 |
| UX.UX048 | 작업 이력에서 복원 | PHASE.21 | undecided | 미검증 |
| UX.UX049 | 자리를 유지하는 로딩 윤곽 | PHASE.07 | undecided | 미검증 |
| UX.UX050 | 조용한 결과 알림 | PHASE.07 | undecided | 미검증 |
| UX.UX051 | 버튼의 처리 상태 | PHASE.07 | undecided | 미검증 |
| UX.UX052 | 변한 부분만 잠깐 강조 | PHASE.07 | undecided | 미검증 |
| UX.UX053 | 빈 화면의 바로 할 일 | PHASE.07 | undecided | 미검증 |
| UX.UX054 | 오래된 값 표시 | PHASE.07 | undecided | 미검증 |
| UX.UX055 | 선택형 작은 축하 | PHASE.07 | undecided | 미검증 |
| UX.UX056 | 중단 가능한 오래 걸리는 작업 | PHASE.07 | undecided | 미검증 |
| UX.UX057 | 막대에서 원기록 열기 | PHASE.28 | undecided | 미검증 |
| UX.UX058 | 구간을 칠해 비교 | PHASE.28 | undecided | 미검증 |
| UX.UX059 | 연결된 차트 강조 | PHASE.28 | undecided | 미검증 |
| UX.UX060 | 계층 내려가기·돌아오기 | PHASE.28 | undecided | 미검증 |
| UX.UX061 | 이전 기간 겹쳐 보기 | PHASE.28 | undecided | 미검증 |
| UX.UX062 | 3D 시점 저장·리셋 | PHASE.28 | undecided | 미검증 |
| UX.UX063 | 변화한 막대만 반응 | PHASE.28 | undecided | 미검증 |
| UX.UX064 | 정확한 값 고정 보기 | PHASE.28 | undecided | 미검증 |
| UX.UX065 | 화면 축소 지도 | PHASE.22 | undecided | 미검증 |
| UX.UX066 | 선택 노드로 카메라 이동 | PHASE.22 | undecided | 미검증 |
| UX.UX067 | 배율별 정보량 조정 | PHASE.22 | undecided | 미검증 |
| UX.UX068 | 노드 정렬 안내 | PHASE.22 | undecided | 미검증 |
| UX.UX069 | 연결선 미리보기 | PHASE.22 | undecided | 미검증 |
| UX.UX070 | 묶음 접기·펼치기 | PHASE.22 | undecided | 미검증 |
| UX.UX071 | 3D 관계 지도 | PHASE.22 | undecided | 미검증 |
| UX.UX072 | 배치 잠금 | PHASE.22 | undecided | 미검증 |
| UX.UX073 | 원문 나란히 보기 | PHASE.16 | undecided | 미검증 |
| UX.UX074 | 선택 구절에 메모 달기 | PHASE.16 | undecided | 미검증 |
| UX.UX075 | 이미지 확대와 돌아오기 | PHASE.16 | undecided | 미검증 |
| UX.UX076 | 읽던 페이지 기억 | PHASE.16 | undecided | 미검증 |
| UX.UX077 | 답 열기 전 내 서술 | PHASE.16 | undecided | 미검증 |
| UX.UX078 | 카드 넘김의 연속성 | PHASE.16 | undecided | 미검증 |
| UX.UX079 | 본문 집중 보기 | PHASE.16 | undecided | 미검증 |
| UX.UX080 | 문서 안 검색 표시 | PHASE.16 | undecided | 미검증 |
| UX.UX081 | 스와이프 보조 행동 | PHASE.24 | undecided | 미검증 |
| UX.UX082 | 길게 눌러 도구 열기 | PHASE.24 | undecided | 미검증 |
| UX.UX083 | 카드가 정렬되는 스크롤 | PHASE.24 | undecided | 미검증 |
| UX.UX084 | 키보드 위 입력 유지 | PHASE.24 | undecided | 미검증 |
| UX.UX085 | 터치 여유 영역 | PHASE.24 | undecided | 미검증 |
| UX.UX086 | 핀치 확대·원위치 | PHASE.24 | undecided | 미검증 |
| UX.UX087 | 펜으로 선택 주석 | PHASE.24 | undecided | 미검증 |
| UX.UX088 | 진동 피드백 후보 | PHASE.24 | undecided | 미검증 |
| UX.UX089 | 필요할 때 한 부분 안내 | PHASE.27 | undecided | 미검증 |
| UX.UX090 | 최근 작업 이어가기 | PHASE.27 | undecided | 미검증 |
| UX.UX091 | 다음 행동 바로가기 | PHASE.27 | undecided | 미검증 |
| UX.UX092 | 접어 두는 자세한 설명 | PHASE.27 | undecided | 미검증 |
| UX.UX093 | 보이는 밀도 조절 | PHASE.27 | undecided | 미검증 |
| UX.UX094 | 즐겨 쓰는 도구 고정 | PHASE.27 | undecided | 미검증 |
| UX.UX095 | 화면 설정 즉시 비교 | PHASE.27 | undecided | 미검증 |
| UX.UX096 | 음성 입력 후보 | PHASE.27 | undecided | 미검증 |
| UX.UX097 | 짧은 누름 탄성 | PHASE.06 | undecided | 미검증 |
| UX.UX098 | 선택 표시의 연결 이동 | PHASE.06 | undecided | 미검증 |
| UX.UX099 | 카드에서 상세로 이어짐 | PHASE.06 | undecided | 미검증 |
| UX.UX100 | 위치 변화가 보이는 정렬 | PHASE.06 | undecided | 미검증 |
| UX.UX101 | 빛을 따라 움직이는 표면 | PHASE.06 | undecided | 미검증 |
| UX.UX102 | 쌓인 종이의 깊이 | PHASE.06 | undecided | 미검증 |
| UX.UX103 | 숫자 변화의 연결 | PHASE.06 | undecided | 미검증 |
| UX.UX104 | 결과에 맞는 짧은 도형 반응 | PHASE.06 | undecided | 미검증 |
| UX.UX105 | 키보드만으로 조작 | PHASE.31 | undecided | 미검증 |
| UX.UX106 | 동작 줄이기 | PHASE.31 | undecided | 미검증 |
| UX.UX107 | 상태를 소리로 전달 | PHASE.31 | undecided | 미검증 |
| UX.UX108 | 긴 목록의 부분 렌더 | PHASE.31 | undecided | 미검증 |
| UX.UX109 | 화면 밖 효과 쉬기 | PHASE.31 | undecided | 미검증 |
| UX.UX110 | 필요할 때만 도구 읽기 | PHASE.31 | undecided | 미검증 |
| UX.UX111 | 큰 글자·고대비 대응 | PHASE.31 | undecided | 미검증 |
| UX.UX112 | 화면 변경 상태 관리 | PHASE.31 | undecided | 미검증 |
| UX_SURFACE.UI01 | 앱 바탕·공통 창 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI02 | 상단·하단 메뉴 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI03 | Home 요약·과목 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI04 | 공부 자판기 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI05 | 공부 시작·복귀 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI06 | 공부 기록 폼 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI07 | TRACE 하위 항목 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI08 | 반복·시험 전 서술 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI09 | 과목별 TRACE 현황 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI10 | 통계 기간·필터 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI11 | 빈도 막대 통계 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI12 | 누적선·시간 흐름 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI13 | 주제 진행도 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI14 | 수행·설명·느낌 통계 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI15 | 원기록·이력 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI16 | 과목·단원·주제 표 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI17 | 목차 트리·탐색 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI18 | 목차·기록 Kanban | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI19 | Canvas 노드·엣지 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI20 | 연결 지도 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI21 | Anki | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI22 | 일정 달력 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI23 | 마감·D-day·시간 막대 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI24 | 강의·출석·제출 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI25 | 자료·첨부 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI26 | 시험·문제·인출 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI27 | 검색·명령·선택 메뉴 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI28 | 설정·기준 조정 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI29 | 안내·시작 전 입력 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI30 | 저장·실패·충돌·빈 화면 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI31 | 공통 팝업·시트 | PHASE.31 | view | 미검증 |
| UX_SURFACE.UI32 | 출제·형광펜·기능 표시 | PHASE.31 | view | 미검증 |
| COMPONENT.Button | Button | PHASE.07 | view | 미검증 |
| COMPONENT.IconButton | IconButton | PHASE.07 | view | 미검증 |
| COMPONENT.Input | Input | PHASE.07 | view | 미검증 |
| COMPONENT.Textarea | Textarea | PHASE.07 | view | 미검증 |
| COMPONENT.Select | Select | PHASE.07 | view | 미검증 |
| COMPONENT.Checkbox | Checkbox | PHASE.07 | view | 미검증 |
| COMPONENT.Radio | Radio | PHASE.07 | view | 미검증 |
| COMPONENT.Tabs | Tabs | PHASE.07 | view | 미검증 |
| COMPONENT.SegmentedControl | SegmentedControl | PHASE.07 | view | 미검증 |
| COMPONENT.Card | Card | PHASE.07 | view | 미검증 |
| COMPONENT.ListItem | ListItem | PHASE.07 | view | 미검증 |
| COMPONENT.Modal | Modal | PHASE.07 | view | 미검증 |
| COMPONENT.Sheet | Sheet | PHASE.07 | view | 미검증 |
| COMPONENT.Toast | Toast | PHASE.07 | view | 미검증 |
| COMPONENT.Breadcrumb | Breadcrumb | PHASE.07 | view | 미검증 |
| COMPONENT.Search | Search | PHASE.07 | view | 미검증 |
| COMPONENT.EmptyState | EmptyState | PHASE.07 | view | 미검증 |
| COMPONENT.LoadingState | LoadingState | PHASE.07 | view | 미검증 |
| COMPONENT.ErrorState | ErrorState | PHASE.07 | view | 미검증 |
| COMPONENT.NavigationBar | NavigationBar | PHASE.07 | view | 미검증 |
| COMPONENT.ContextMenu | ContextMenu | PHASE.07 | view | 미검증 |
| UNFINISHED.U05 | 원본 과거 발화 665개의 모든 세부 의미 전수 판정은 아직 완료되지 않음 | PHASE.02 | undecided | 미해결 |
| UNFINISHED.U06 | 3단계 표 입력과 4단계 공부 후보 자격의 정책 충돌 | PHASE.15 | undecided | 미해결 |
| UNFINISHED.U07 | PDF11 외부 영상 2개의 실제 내용은 미확인 | PHASE.27 | undecided | 미해결 |
| UNFINISHED.U08 | 기존 감사의 접근 불가 181개 경로 재접근·누락 판정 미완 | PHASE.02 | undecided | 미해결 |
| UNFINISHED.U09 | 원본 일반 입력 날짜 startedAt/cutoffMinutes 및 선택 어려움은 현 모델에 전체 목적지 미구현 | PHASE.13 | undecided | 미해결 |
| PDF.A01 | 원래 피드백을 ‘겨울방학 개발 계획 및 Obsidian 대신 GitHub Pages 모바일 웹앱을 쓰고 싶다는 회고’로 정정합니다. 기존 연구 회수는 현재 사용자 요청의 근거로 따로 표기합니다. 당시 ‘일단 사용’·시기·예산 메모를 현재 개발 보류나 지출 승인으로 해석하지 않습니다. | PHASE.02 | process | 미검증 |
| PDF.A02 | 일반 기록·저장·복구 버튼과 영구삭제를 분리하고, 기본 primary 행동·Enter·연속 클릭이 영구삭제로 연결되지 않도록 검증합니다. 이 분리는 모든 작업에 경고창을 추가한다는 뜻이 아닙니다. | PHASE.02 | process | 미검증 |
| PDF.A03 | 충돌 파일 ‘개수 감소’를 성공으로 삼지 않습니다. 동일 논리 ID의 상이한 본문을 모두 보존하고, 후보 출처·내용·revision을 비교한 뒤 사용자가 선택하거나 검증된 병합을 해야 합니다. 판정 불가 상태에서도 충돌과 무관한 데이터 접근을 전부 막지 않는 경로를 검토합니다. | PHASE.02 | process | 미검증 |
| PDF.A04 | 아래 ‘원자 QA 계약’을 화면 Inventory·Failure Matrix·Phase 게이트에 별도 항목으로 연결합니다. 보고서의 큰 문단이 존재하는 것만으로 개별 조작이 검증된 것은 아닙니다. | PHASE.02 | process | 미검증 |
| PDF.Q01 | 모든 탭·하위 화면·메뉴·설정·입력·팝업·조건부 요소를 명명하고 실제 진입 조건 및 실행 증거와 연결합니다. | PHASE.31 | process | 미검증 |
| PDF.Q02 | 추가·수정·선택·체크·검색·필터·정렬·펼침·접기·이동·저장·취소·삭제·복원·Undo 각각 결과와 취소 후 무변경을 확인합니다. | PHASE.31 | process | 미검증 |
| PDF.Q03 | 원기록 변경이 선택 목록·과목 현황·통계·Canvas의 같은 대상 ID에 반영되고 새로고침·재실행 뒤 유지되는지 확인합니다. | PHASE.31 | process | 미검증 |
| PDF.Q04 | 학기 생성→여러 과목→서로 다른 목차 깊이·긴 이름·동명 항목→수정·이동→다음 학기→과거 학기 조회를 시험 데이터로 수행합니다. | PHASE.31 | process | 미검증 |
| PDF.Q05 | 한 주제와 여러 주제, 일부 공부, 막힘, 본문 없음, 긴 글, 중단·복귀, 몰아쓰기를 각각 수행합니다. | PHASE.31 | process | 미검증 |
| PDF.Q06 | 일정·할 일·과제·온라인 강의를 등록·변경·완료·취소하고 기한 미정 및 변경을 각각 확인합니다. | PHASE.31 | process | 미검증 |
| PDF.Q07 | Canvas 안의 목차·의문·메모·연결과 편집·이동·탐색·복귀를 확인하며 원본과 개인 배치를 보존합니다. | PHASE.31 | process | 미검증 |
| PDF.Q08 | 빈 상태만이 아니라 깊은 목차·많은 과목·긴 글·많은 기록·많은 Canvas 노드에서 지연·멈춤·깜빡임을 측정합니다. | PHASE.31 | process | 미검증 |
| PDF.Q09 | Mac/iPad/iPhone, 분할 화면, 방향, 키보드 표시, Light/Dark에서 가림·초점·스크롤·한글 입력을 구별해 기록합니다. | PHASE.31 | process | 미검증 |
| PDF.Q10 | 버튼·글자와 버튼 사이 여백·정렬·크기·색·대비·강조·잘림·겹침·불필요한 가로 스크롤을 확인합니다. | PHASE.31 | process | 미검증 |
| PDF.Q11 | 문제를 재현→원인→수정→실제 적용→동일 행동 재검증→연관 화면 회귀로 닫습니다. 공통 원인일 때 공통 계층에서 고칩니다. | PHASE.31 | process | 미검증 |
| PDF.Q12 | 시험 데이터는 실제 통계에서 제외하고 ID·자유서술·초안·revision·설정·Canvas 배치·연결·병행 변경을 보존합니다. | PHASE.31 | process | 미검증 |
| PDF.Q13 | 각 결과를 통과/수정 후 통과/미해결/미검증/해당 없음으로 기록합니다. 자동·실제 화면·물리기기·동기화 수신을 분리합니다. | PHASE.31 | process | 미검증 |
| PDF.Q14 | Empty/Loading/Error/Partial success/Large-data 및 사용자 다음 행동을 확인합니다. 정상 상태 화면 하나로 대체하지 않습니다. | PHASE.31 | process | 미검증 |
| PDF.Q15 | 빠른 연속 클릭·중복 요청·취소·화면 전환·앱 종료와 재실행·저장 실패·순서 역전·동시 변경·sync conflict를 재현합니다. | PHASE.31 | process | 미검증 |
| PDF.Q16 | 입력/출력 계약·상태 전이·의존성·예외·회복·반복 계산·불필요한 IO·과도한 갱신·누수를 필요한 범위에서 검사합니다. | PHASE.31 | process | 미검증 |
| PDF.Q17 | 코드 제거 전 정적 참조뿐 아니라 동적 호출·이벤트·이전 데이터 호환·복구 경로를 확인합니다. | PHASE.31 | process | 미검증 |
| PDF.Q18 | 최종 결과에는 변경 이유·파일·실제 적용·검증한 상황·남은 문제·미검증 범위를 포함하며 시뮬레이션을 장기사용 또는 학습효과로 주장하지 않습니다. | PHASE.31 | process | 미검증 |
| PDF.Q19 | 바빠서 본문 없이 최소 입력, 일부/막힘, 몰아 입력, 장기 미사용 후 최근 맥락 복귀를 fake 자료로 실제 조작한다. 필수 상세 없이 저장되고 미사용 기간을 실패·의무로 쌓지 않는지 확인한다. 클릭/입력/판단 부담은 각각 기록한다. | PHASE.09 | process | 미검증 |
| PDF.Q20 | 초심자가 화면 목적/다음 행동을 구별할 수 있고 빈번한 행동이 보이는지, 반복 선택·이동·확인·설명이 과도한지 A–G별 시작 맥락과 조작으로 평가한다. 자동 숫자만으로 이해도 개선을 주장하지 않는다. | PHASE.09 | process | 미검증 |

HISTORY 665행은 JSON에 로컬 비공개 원목록의 index·날짜와 연결 REQUEST만 기록했습니다. 실제 세션 경로는 공개 저장소 밖 로컬 산출물에 남겼습니다. 본문을 복사하지 않았고 미대조 원문을 통과로 처리하지 않았습니다.

## 실행

```sh
python3 scripts/validate-ledger.py
python3 scripts/test-validate-ledger.py
# 이전 원장과 비교할 때:
python3 scripts/validate-ledger.py --previous /absolute/path/to/prior-execution-ledger.json
```

검사 결과를 보존하려면 `--output docs/validation/ledger-YYYYMMDD-HHMMSS.json`을 사용합니다. 이미 있는 결과 파일은 덮어쓰지 않습니다. `--check-sources`는 로컬 프로젝트의 비공개 요구 목록 원본과 ID/필드/페이지 요구를 다시 대조합니다. 원본 파일이 없는 다른 머신에서는 고정 baseline으로만 검사하며 원본 재대조를 수행했다고 하지 않습니다.

## 이번 구조 검증 실행

- [원목록/구조 검사 결과](validation/ledger-20260930-002510.json): 1,366행의 namespace·목적지·양방향 PDF·참조 및 로컬 원목록 대조 통과. 제품 구현 통과가 아닙니다.
- [음성 fixture 실행](validation/ledger-negative-fixtures-20260930-002510.txt): 22개 검사 통과. 입력 ID 소실·중복·고아·원필드 손실·PDF 요구 탈락·무근거 통과·증거 수준 전용·Phase 생략·분류 변경·이전 증거 삭제를 거부했습니다.
- 기존 결과를 보존하는 exclusive-create 출력 방식을 사용합니다. 후속 원장 수정 뒤 새 결과를 별도 시점으로 남겨야 합니다.

## CORE와 현재 작업의 개별 연결 보완

C01–C45의 담당 Phase·선행조건·연결 WORK/FEATURE/INV·데이터 목적지·UI 조작·상태·검증 수준·다음 행동을 각각 작성했습니다. 화면이 없는 감사 규칙에는 직접 UI가 적용되지 않는 이유를 기록했습니다. Feature49개는 개별 정상/실패/보존 관찰값과 실행 기준으로 바꾸었고 REQUEST 정정13개도 실제 INPUT/INV에 연결했습니다. 이 연결의 존재는 해당 조건의 통과 증거가 아닙니다.

WORK.R07에는 기존 commit의 GitHub/Pages 배포 진전, WORK.R08에는 사용자가 준비한 Supabase 프로젝트 Healthy 상태를 별도 current_progress로 기록했습니다. 최종 변경 코드 배포·Auth/CRUD·callback 검증은 아직 열린 상태입니다.

개별 연결 보완 뒤 [원목록·이전 원장 비교](validation/ledger-refined-20260930-003500.json)와 [26개 검증기 fixture](validation/ledger-negative-fixtures-20260930-003400.txt)를 실행했습니다. 공개 원장에 사용자 절대경로/세션파일 위치/대화 본문이 재유입되거나 CORE가 빈 검증 템플릿으로 퇴행하는 경우도 거부합니다. 이 기록 다음에 원장을 수정하면 새 시점 결과를 다시 남깁니다.

## 추가로 발견한 실패 경계

| ID | 요구 의미 | Phase | 목적지 | 상태 |
|---|---|---|---|---|
| FOLLOWUP.FREE_ID_RECOVERY | 로컬 자유기록 정리 실패 뒤 같은 ID·양쪽 본문 보존 | PHASE.08 | Draft/Narrative | 수정 후 통과 |
| FOLLOWUP.DRAFT_ARCHIVE_INSPECTION | 보관본 읽기·정확한 원문 내보내기·실패 보존; 이번 실제Chrome3파일수신·재열기 B29/B30 | PHASE.08 | DraftArchive / DraftArchiveExport | 수정 후 통과 |
| FOLLOWUP.TABLE_EDITING_CONTEXT | 긴 표의 안정된 필드·선택·방향·내부 스크롤 복귀 | PHASE.08 | ModalEditingContext / OutlineTableDraft | 수정 후 통과 |
| FOLLOWUP.STUDY_LAUNCH_RETURN | 선택적 공부 시작·복귀 힌트, 저장 전 공부 사건 비생성 | PHASE.08 | StudyLaunchHint | 수정 후 통과 |

## 이번 추가 후속행과 검증

| ID | 좁은 완료 범위 | 상태 |
|---|---|---|
| FOLLOWUP.NARRATIVE_RETURN_ID | 선택글 최초초안ID·펼침/접기·복귀 | 수정 후 통과 |
| FOLLOWUP.VISIBLE_NAVIGATION_FOCUS | 실제 표시된 메뉴초점복귀 | 수정 후 통과 |
| FOLLOWUP.SEARCH_EMPTY_FEEDBACK | 검색어 있음/결과0 안내·범위/검색어보존 | 수정 후 통과 |
| FOLLOWUP.RECORD_FILTER_RETURN | 같은작성초안 주제필터복귀·명시대상분리 | 수정 후 통과 |

[1374행 previous/source 검사](validation/continuation-ledger-20260930.json), [26검증기](validation/continuation-validator-tests-20260930.txt), [최종실행](validation/continuation-execution-20260930.json). 위8후속행의 좁은 통과와 달리 CORE45/P07–09 등 전체요구는 미검증입니다. 과거 미수신 증거는 JSON previous_executions와 과거 artifact에 보존했습니다.
