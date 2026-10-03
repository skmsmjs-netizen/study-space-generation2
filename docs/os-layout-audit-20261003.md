# OS 정체성·레이아웃 실제 대조 — 2026-10-03

사용자 요청: 첨부 일정 화면의 정체성/배치 누락 수정, 25역할·111엔터티 대조, 기존 Pages 배포. 기준 채택·소스 연결·실제 배치·기기 모사·공개 반영은 별도 증거다.

## 판정과 수정

- 25역할/111엔터티의 소스 연결에 누락된 파일·지정 선언은 없다. export가 null인 모션 어댑터 3개는 모듈 단위 참조다.
- 일정(R03/U21)은 큰 입력 카드 반복으로 P09/L197의 기간→일정→선택 상세 순서를 충족하지 못했다. 간결한 날짜/상태 목록, 한 개의 상세, 선택 날짜/항목/더 보기/복귀를 실제 구현했다. 필터는 새 일정 저장 때도 보존하며 필터 밖 상세에는 목록 이동을 명시한다.
- 자료 카드(R12/U25)는 카드 그리드 계약이 있으나 실제 목록은 한 열이었다. 원자료/답 펼침/20개 페이지를 유지하는 반응형 그리드로 수정했다.
- 자유 기록(R30/R31/R32/U41)은 목록과 편집부가 순차적으로만 있었다. 넓은 화면 목록→편집부, 좁은 화면 동일 순서로 전환하는 실제 영역을 구현했다. 기존 ID·초안 키·글·줄바꿈·저장/이력은 유지한다.
- 기존 천문대 바깥틀/네 고정 장소/천장 공통 기능, 위젯 전체, 본문 서체/설정, Canvas 개인 좌표를 재사용했다. 재생·학습·출석, 준비·제출을 자동 합치지 않는다.

## 채택 기준과 확인 범위

원본은 [레이아웃 기준](layout-standard.md), [선택 계약](layout-standard-contract.json), [역할별 정체성](observatory-feature-identities.json), [천문대 기준](observatory-design-standard.md)이다. 등록 패턴과 기존 부품·토큰·Playwright/WebKit·axe 검사를 재사용했다. AST 선언/하위 부품/저장 목록은 조사 보조 자료다. 원격 Figma 수정, 운영 DB/권한/Edge 변경, 개인 기록·유료 AI 호출은 대상이 아니다.

## 역할 25개 — 등록 범위 전수 연결

| 역할 | 정체성·실제 과업 | 엔터티 | 구현과 잔여 |
|---|---|---|---|
| today · 오늘 | 오늘 펼친 책상 — 지금 이어갈 주제와 실제 남긴 기록을 보고 작은 공부 행동을 시작한다. | R01, O10, O29, U09, U11, U12, U13, U14, U15 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| study-record · 공부 기록·주제 상세 | 관측일지 — 한 주제에서 실제로 한 시도와 답·이유·막힘을 남기고 다시 고친다. | R05, R20, R21, O11, U19 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| notes · 메모·자유 기록 | 곁에 둔 기록지 — 하던 자료를 잃지 않고 짧은 생각부터 긴 자유 글까지 남긴다. | R06, R22, R30, R31, R32, O23, O24, U41 | 누락 배치 수정; 상태별 검증 잔여 |
| ink · 필기·OCR·PDF 배경 | 손으로 쓰는 관측지 — 펜과 페이지를 사용해 답·도해·생각을 직접 쓰고 원본과 인식 글을 함께 보관한다. | U29 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| subjects · 과목·학기 등록 | 공부 범위의 책등 — 실제 배우는 학기·과목을 등록하고 해당 범위의 자료와 기록을 찾는다. | R04, R19, O01, O02 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| outline · 목차 관리 | 공부 범위의 색인 — 교재·강의계획서의 단원과 주제를 실제 계층으로 관리한다. | O03, O04, O06, O07, O19, O22, U16, U17 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| materials · 강의 자료·PDF | 펼쳐 보는 원자료 — 원자료를 보관·읽고 필요한 구간을 골라 메모와 다음 공부에 연결한다. | R07, R23, U23, U24 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| material-cards · 자료 카드·주제 연결 | 출처가 붙은 발췌함 — 원자료에서 얻은 조각을 출처와 함께 다시 찾아 주제·코드에 연결한다. | R12, U25 | 누락 배치 수정; 상태별 검증 잔여 |
| concepts · 개념 전집 | 참조 사전 — 정의·조건·관계·예제를 찾아 현재 공부와 연결해 읽는다. | R13 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| exam-practice · 시험 연습·수행 결과 | 실행을 확인하는 연습지 — 범위를 정해 답을 쓰고 실제 확인한 수행을 근거와 함께 남긴다. | R10, R26, O18, O20, U20 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| memory-test · 암기시험 | 기억을 꺼내 쓰는 답안지 — 배운 항목의 답을 먼저 꺼내 쓰고 기준과 직접 비교한다. | R11, R27, R28, U28 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| recall · 주제 카드·Anki·예약 복습 | 인출 카드함 — 현재 범위의 카드에 답하고 설명을 확인한 뒤 자신의 반응을 남긴다. | R14, R29, U26, U27 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| code · 코딩 연습 | 실행 실험대 — 코드를 수정·실행하고 실제 출력과 오류를 확인해 주제에 연결한다. | R08, R25, U30 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| math · 수식 탐색·개념 도해 | 조건을 조절하는 관측기 — 정의와 조건을 바꾸며 수식·그래프·정밀 도해의 변화를 확인한다. | R09, O14, U31, U32, U33 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| statistics · 통계·여러 그래프·원기록 | 공부의 관측판 — 실제 기록의 비교·추세·분포·관계·구성·흐름을 원기록까지 확인한다. | R02, O26, U36 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| canvas · Canvas | 내가 놓은 관계 배치도 — 자료와 생각을 자신의 위치·크기·연결로 놓고 원문과 왕복한다. | R15, U34 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| graph · 그래프뷰 | 관계 탐색 지도 — 실제 연결을 살펴보고 관련 원문으로 이동하며 구조를 찾는다. | R16, U35 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| board · 칸반보드 | 진행을 옮기는 작업 보드 — 할 일과 공부 대상을 실제 열과 카드의 순서로 정리한다. | R17, O27, O28 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| schedule · 일정·과제·다음 공부 | 앞으로 펼칠 계획표 — 날짜와 실제 해야 할 일을 보고 가능한 다음 공부를 정한다. | R03, O13, O16, O17, O25, U18, U21, U22 | 누락 배치 수정; 상태별 검증 잔여 |
| reflection · 내 생각 | 기록을 돌아보는 여백 — 자신이 남긴 생각과 기록 사이의 연결을 다시 읽고 수정한다. | R36, U39 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| search · 찾기 | 공간 전체의 색인등 — 어느 자리에서든 원문과 대상을 찾아 실제 과업으로 이동한다. | R18, R41 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| workspace-controls · 공간 설정·도움말 | 공간을 조율하는 천장 조명 — 읽기와 동작을 조절하고 사용 중 필요한 도움을 원래 과업을 유지하며 확인한다. | R37, R38, R39, O12, O15, U01, U10, U38, U40 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| api-connection · API·GPT 연결·사용량 | 외부 연산 연결대 — 전송할 자료·연결 상태·한도·사용량을 확인하고 허용된 외부 연산을 명시적으로 요청한다. | U37 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| account · 계정·가입·승인·탈퇴 | 개인 공간의 출입 관리 — 자신의 공간에 접근하고 실제 계정 상태와 자료 권한을 관리한다. | R40, O08, O09, U02, U03, U04, U05, U06 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |
| recovery · 저장 상태·백업·휴지통·초안 | 기록 보관함과 복구대 — 기록이 어디에 남아 있는지 확인하고 선택한 자료를 안전하게 되돌린다. | R24, R33, R34, R35, O05, O21, U07, U08 | 기존 과업·상태·복귀 재사용; 상태별 검증 잔여 |

## 엔터티 111개 — 빠짐없는 실제 연결

판정은 구현됐으나 검증 잔여를 기본으로 둔다. 존재하는 부품을 미구현으로 오인하지 않으면서 일반 화면 검사를 모든 권한·실패·자료·실물 기기 상태의 완료로 승격하지 않기 위해서다. 발견한 배치 결함은 위 8개 연결에서 수정했다. 새 과목별 관측소·미정 기능은 등록 대상 밖의 제외/보류다. R39/R40은 별도 기능이 아니라 기존 링크의 의도된 호환/계정 진입이다.

| ID·대상 | 역할·프로필·대표 패턴 | 실제 소스 선언 | 구현과 잔여 |
|---|---|---|---|
| R01 · 오늘 | today · P01 · L025 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R02 · 통계 | statistics · P06 · L195 | src/ui/statistics.tsx · StudyStatistics | 구현됐으나 검증 잔여 |
| R03 · 일정·과제 | schedule · P09 · L197 | src/ui/next-study.tsx · NextStudy | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| R04 · 과목 | subjects · P02 · L037 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R05 · 기록 | study-record · P01 · L053 | src/App.tsx · RecordForm | 구현됐으나 검증 잔여 |
| R06 · 메모 | notes · P03 · L045 | src/ui/quick-memos.tsx · QuickMemos | 구현됐으나 검증 잔여 |
| R07 · 강의 자료 | materials · P03 · L045 | src/ui/study-materials.tsx · StudyMaterials | 구현됐으나 검증 잔여 |
| R08 · 코딩 연습 | code · P05 · L082 | src/ui/code-practice.tsx · CodePractice | 구현됐으나 검증 잔여 |
| R09 · 수식 탐색 | math · P05 · L194 | src/ui/math-explorer.tsx · MathExplorer | 구현됐으나 검증 잔여 |
| R10 · 시험 연습 | exam-practice · P04 · L193 | src/ui/exam-practice.tsx · ExamPractice | 구현됐으나 검증 잔여 |
| R11 · 암기시험 | memory-test · P04 · L193 | src/ui/memory-test.tsx · MemoryTests | 구현됐으나 검증 잔여 |
| R12 · 자료 카드 | material-cards · P02 · L037 | src/ui/material-card-library.tsx · MaterialCardLibrary | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| R13 · 개념 전집 | concepts · P02 · L045 | src/ui/concept-library.tsx · ConceptLibrary | 구현됐으나 검증 잔여 |
| R14 · 주제 카드 | recall · P04 · L193 | src/ui/topic-recall.tsx · TopicRecall | 구현됐으나 검증 잔여 |
| R15 · Canvas | canvas · P07 · L062 | src/ui/study-canvas.tsx · StudyCanvas | 구현됐으나 검증 잔여 |
| R16 · 그래프뷰 | graph · P07 · L196 | src/ui/study-graph.tsx · StudyGraph | 구현됐으나 검증 잔여 |
| R17 · 칸반보드 | board · P08 · L049 | src/ui/study-board.tsx · StudyBoard | 구현됐으나 검증 잔여 |
| R18 · 찾기 | search · P02 · L055 | src/ui/workspace-search.tsx · WorkspaceSearch | 구현됐으나 검증 잔여 |
| R19 · 과목 상세 | subjects · P02 · L189 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R20 · 단원·주제 상세 | study-record · P01 · L045 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R21 · 선택 주제 기록 | study-record · P01 · L053 | src/App.tsx · RecordForm | 구현됐으나 검증 잔여 |
| R22 · 메모 상세 | notes · P03 · L190 | src/ui/quick-memos.tsx · QuickMemos | 구현됐으나 검증 잔여 |
| R23 · 자료 상세·새 자료 | materials · P03 · L190 | src/ui/study-materials.tsx · StudyMaterials | 구현됐으나 검증 잔여 |
| R24 · 강의 자료 휴지통 | recovery · P10 · L045 | src/ui/study-materials.tsx · StudyMaterials | 구현됐으나 검증 잔여 |
| R25 · 코드 예제 상세 | code · P05 · L082 | src/ui/code-practice.tsx · CodePractice | 구현됐으나 검증 잔여 |
| R26 · 주제 지정 시험 연습 | exam-practice · P04 · L193 | src/ui/exam-practice.tsx · ExamPractice | 구현됐으나 검증 잔여 |
| R27 · 주제 지정 암기시험 | memory-test · P04 · L193 | src/ui/memory-test.tsx · MemoryTests | 구현됐으나 검증 잔여 |
| R28 · 암기시험 결과 | memory-test · P04 · L193 | src/ui/memory-test.tsx · MemoryTests | 구현됐으나 검증 잔여 |
| R29 · 예약 복습 | recall · P04 · L193 | src/ui/topic-recall.tsx · TopicRecall | 구현됐으나 검증 잔여 |
| R30 · 자유 기록 목록·기본 글 | notes · P03 · L045 | src/App.tsx · FreeNotes | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| R31 · 새 자유 기록 | notes · P03 · L025 | src/App.tsx · FreeNotes | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| R32 · 자유 기록 상세 | notes · P03 · L025 | src/App.tsx · FreeNotes | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| R33 · 전체 백업·복구 | recovery · P10 · L198 | src/ui/full-backup.tsx · FullBackup | 구현됐으나 검증 잔여 |
| R34 · 휴지통 | recovery · P10 · L045 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R35 · 초안 보관본 | recovery · P10 · L045 | src/ui/draft-archives.tsx · DraftArchives | 구현됐으나 검증 잔여 |
| R36 · 내 생각 | reflection · P01 · L025 | src/ui/brand-experience.tsx · BrandService | 구현됐으나 검증 잔여 |
| R37 · 도움말·문제 메모 | workspace-controls · P10 · L081 | src/ui/brand-experience.tsx · BrandService | 구현됐으나 검증 잔여 |
| R38 · 소개 | workspace-controls · P10 · L040 | src/ui/brand-experience.tsx · BrandService | 구현됐으나 검증 잔여 |
| R39 · 기존 구독 링크 | workspace-controls · P10 · L198 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| R40 · 기존 계정 링크 | account · P10 · L198 | src/App.tsx · App | 구현됐으나 검증 잔여 |
| R41 · 찾을 수 없는 항목 | search · P02 · L025 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O01 · 학기 추가 | subjects · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O02 · 과목 추가 | subjects · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O03 · 목차 추가 | outline · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O04 · 여러 목차 추가 | outline · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O05 · 휴지통으로 옮길까요? | recovery · P10 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O06 · 이름 수정 | outline · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O07 · 목차 위치 옮기기 | outline · P02 · L053 | src/App.tsx · Workspace | 구현됐으나 검증 잔여 |
| O08 · 가입 계정 관리 | account · P10 · L053 | src/ui/account-administration.tsx · AccountAdministration | 구현됐으나 검증 잔여 |
| O09 · 내 계정 | account · P10 · L053 | src/ui/account-settings.tsx · AccountSettings | 구현됐으나 검증 잔여 |
| O10 · 다음에 펼칠 곳을 남겨둘까요? | today · P01 · L053 | src/ui/brand-experience.tsx · BrandIdentity | 구현됐으나 검증 잔여 |
| O11 · 공부 기준 조정 | study-record · P01 · L053 | src/ui/criteria-editor.tsx · CriteriaEditor | 구현됐으나 검증 잔여 |
| O12 · 이어가기 설정 복구 | workspace-controls · P10 · L198 | src/ui/experience-recovery.tsx · ExperienceRecoveryControl | 구현됐으나 검증 잔여 |
| O13 · 시험·과제·강의 일정 | schedule · P09 · L053 | src/ui/learning-schedule.tsx · LearningScheduleEditor | 구현됐으나 검증 잔여 |
| O14 · 수식 탐색 전체 화면 | math · P05 · L194 | src/ui/math-templates.tsx · MathTemplates | 구현됐으나 검증 잔여 |
| O15 · 움직임 위젯 | workspace-controls · P10 · L048 | src/ui/motion-widgets.tsx · MotionWidgets | 구현됐으나 검증 잔여 |
| O16 · 다음에 확인할 내용 | schedule · P09 · L053 | src/ui/next-study.tsx · NextStudy | 구현됐으나 검증 잔여 |
| O17 · 학기 기간 | schedule · P09 · L053 | src/ui/next-study.tsx · NextStudy | 구현됐으나 검증 잔여 |
| O18 · 지금 확인한 결과 | exam-practice · P04 · L053 | src/ui/next-study.tsx · NextStudy | 구현됐으나 검증 잔여 |
| O19 · 공부할 목차 만들기 | outline · P02 · L053 | src/ui/outline-table-editor.tsx · OutlineTableEditor | 구현됐으나 검증 잔여 |
| O20 · 답안에서 수행 결과 남기기 | exam-practice · P04 · L053 | src/ui/performance-from-source.tsx · SourceInk | 구현됐으나 검증 잔여 |
| O21 · 내 기록의 저장 상태 | recovery · P10 · L198 | src/ui/personal-space.tsx · PersonalSpace | 구현됐으나 검증 잔여 |
| O22 · 사진으로 목차·내용 가져오기 | outline · P02 · L053 | src/ui/photo-outline-import.tsx · PhotoOutlineImport | 구현됐으나 검증 잔여 |
| O23 · 메모를 휴지통으로 옮길까요? | notes · P03 · L053 | src/ui/quick-memos.tsx · QuickMemos | 구현됐으나 검증 잔여 |
| O24 · 작은 메모 | notes · P03 · L053 | src/ui/quick-memos.tsx · QuickMemos | 구현됐으나 검증 잔여 |
| O25 · 강의 주차 만들기 | schedule · P09 · L053 | src/ui/semester-weeks.tsx · SubjectWeeks | 구현됐으나 검증 잔여 |
| O26 · 통계의 원기록 | statistics · P06 · L043 | src/ui/statistics.tsx · StudyStatistics | 구현됐으나 검증 잔여 |
| O27 · 카드 추가·편집 | board · P08 · L053 | src/ui/study-board.tsx · StudyBoard | 구현됐으나 검증 잔여 |
| O28 · 보드 열 | board · P08 · L053 | src/ui/study-board.tsx · StudyBoard | 구현됐으나 검증 잔여 |
| O29 · 이 주제부터 해볼까요? | today · P01 · L053 | src/ui/study-launch.tsx · StudyLaunch | 구현됐으나 검증 잔여 |
| U01 · 앱 내비게이션·범위·테마 | workspace-controls · P10 · L064 | src/App.tsx · Workspace<br>src/ui/navigation-bar.tsx · NavigationBar<br>src/ui/observatory-navigation.tsx · ObservatoryNavigation | 구현됐으나 검증 잔여 |
| U02 · 개인 공간 진입·인증 | account · P10 · L053 | src/ui/personal-space.tsx · PersonalSpace | 구현됐으나 검증 잔여 |
| U03 · 로그인·가입 | account · P10 · L053 | src/ui/personal-space.tsx · SignIn | 구현됐으나 검증 잔여 |
| U04 · 가입 승인 대기·제한 | account · P10 · L025 | src/ui/personal-space.tsx · PersonalSpace | 구현됐으나 검증 잔여 |
| U05 · 내 계정·탈퇴 | account · P10 · L198 | src/ui/account-settings.tsx · AccountSettings | 구현됐으나 검증 잔여 |
| U06 · 가입 계정 관리 | account · P10 · L045 | src/ui/account-administration.tsx · AccountAdministration | 구현됐으나 검증 잔여 |
| U07 · 내 기록의 저장 상태 | recovery · P10 · L198 | src/ui/personal-space.tsx · ServerStatus | 구현됐으나 검증 잔여 |
| U08 · 전체 복구 진입 | recovery · P10 · L198 | src/ui/full-backup.tsx · BackupRecoveryGate | 구현됐으나 검증 잔여 |
| U09 · 이어가기와 다음 위치 | today · P01 · L025 | src/ui/brand-experience.tsx · BrandContinuity | 구현됐으나 검증 잔여 |
| U10 · 읽기 폭·이어가기 복구 | workspace-controls · P10 · L053 | src/ui/brand-experience.tsx · ExperienceSettings<br>src/ui/experience-recovery.tsx · ExperienceRecoveryControl | 구현됐으나 검증 잔여 |
| U11 · 천문대 원본 위젯 | today · P01 · L048 | src/ui/study-landscapes.tsx · StudyLandscapes<br>src/ui/pixel-worlds.tsx · ObservatoryWorld<br>src/ui/observatory-room.tsx · ObservatoryRoom<br>src/ui/observatory-desk.tsx · ObservatoryDesk | 구현됐으나 검증 잔여 |
| U12 · 천문대 세부 렌더러 | today · P01 · L048 | src/ui/observatory-advanced.tsx · ObservatoryAdvanced<br>src/ui/observatory-atmosphere.tsx · ObservatoryClouds<br>src/ui/observatory-details.tsx · ObservatorySkyDetails<br>src/ui/observatory-event-variations.tsx · ObservatoryEventVariationSymbol<br>src/ui/observatory-events.tsx · ObservatoryEvents<br>src/ui/observatory-radiance.tsx · ObservatoryRadiance<br>src/ui/observatory-reactivity.tsx · ObservatoryStudySky<br>src/ui/observatory-time-sky.tsx · ObservatoryTimeSky | 구현됐으나 검증 잔여 |
| U13 · 작은 도구와 시계 | today · P01 · L048 | src/ui/home-tools.tsx · HomeTools | 구현됐으나 검증 잔여 |
| U14 · 오늘·한 주 공부 | today · P01 · L025 | src/ui/week-overview.tsx · WeekOverview<br>src/ui/today-study.tsx · TodayStudy | 구현됐으나 검증 잔여 |
| U15 · 공부 시작 제안 | today · P01 · L025 | src/ui/study-launch.tsx · StudyLaunch | 구현됐으나 검증 잔여 |
| U16 · 목차와 항목 관리 | outline · P02 · L189 | src/ui/outline-tree.tsx · OutlineTree<br>src/ui/context-menu.tsx · ContextMenu | 구현됐으나 검증 잔여 |
| U17 · 표·사진 목차 만들기 | outline · P02 · L053 | src/ui/outline-table-editor.tsx · OutlineTableEditor<br>src/ui/photo-outline-import.tsx · PhotoOutlineImport | 구현됐으나 검증 잔여 |
| U18 · 학기·강의 주차 | schedule · P09 · L197 | src/ui/semester-weeks.tsx · SubjectWeeks | 구현됐으나 검증 잔여 |
| U19 · 공부 기준·TRACE | study-record · P01 · L053 | src/ui/criteria-editor.tsx · CriteriaEditor<br>src/ui/trace-editor.tsx · TraceEditor | 구현됐으나 검증 잔여 |
| U20 · 답안에서 수행 결과 | exam-practice · P04 · L053 | src/ui/performance-from-source.tsx · PerformanceFromSource<br>src/ui/performance-evidence.tsx · PerformanceEvidence | 구현됐으나 검증 잔여 |
| U21 · 일정 편집 | schedule · P09 · L053 | src/ui/learning-schedule.tsx · LearningScheduleEditor<br>src/ui/schedule-dashboard.tsx · ScheduleDashboard<br>src/ui/schedule-notifications.tsx · ScheduleNotifications | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| U22 · 다음 공부 기준·결과 | schedule · P09 · L198 | src/ui/next-study.tsx · NextStudy | 구현됐으나 검증 잔여 |
| U23 · 자료 출처·PDF 구간 | materials · P03 · L190 | src/ui/material-sources.tsx · MaterialSources | 구현됐으나 검증 잔여 |
| U24 · 자료 퀴즈·관계·대화 | materials · P03 · L190 | src/ui/material-tutor.tsx · MaterialTutor<br>src/ui/material-quiz.tsx · MaterialQuiz<br>src/ui/material-map.tsx · MaterialMap | 구현됐으나 검증 잔여 |
| U25 · 카드·코드 주제 연결 | material-cards · P02 · L045 | src/ui/learning-links.tsx · UseMaterialCard<br>src/ui/material-card-library.tsx · MaterialCardLibrary | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |
| U26 · 덱·카드·Anki 가져오기 | recall · P04 · L198 | src/ui/recall-decks.tsx · RecallDecks<br>src/ui/recall-card-editor.tsx · RecallCardEditor<br>src/ui/recall-import.tsx · RecallImport | 구현됐으나 검증 잔여 |
| U27 · 복습 설정·최적화 | recall · P04 · L053 | src/ui/recall-settings.tsx · RecallSettings<br>src/ui/recall-optimization.tsx · RecallOptimization | 구현됐으나 검증 잔여 |
| U28 · 암기 항목 생성 | memory-test · P04 · L053 | src/ui/topic-memory-generator.tsx · TopicMemoryGenerator | 구현됐으나 검증 잔여 |
| U29 · 펜·OCR·PDF 배경 | ink · P03 · L190 | src/ui/memo-ink-pad.tsx · MemoInkPad<br>src/ui/ink-drawing.tsx · InkStroke<br>src/ui/ink-ocr.tsx · InkOCR<br>src/ui/ink-pdf-background.tsx · InkPDFBackground | 구현됐으나 검증 잔여 |
| U30 · 코드 편집·구문·터미널 | code · P05 · L082 | src/ui/source-editor.tsx · SourceEditor<br>src/ui/monaco-source-editor.tsx · MonacoSourceEditor<br>src/ui/touch-source-editor.tsx · TouchSourceEditor<br>src/ui/code-syntax-status.tsx · CodeSyntaxStatus<br>src/ui/code-terminal.tsx · CodeTerminal | 구현됐으나 검증 잔여 |
| U31 · 수식·그래프·카메라 | math · P05 · L194 | src/ui/math-explorer-plot.tsx · MathExplorerPlot<br>src/ui/math-formula.tsx · MathFormula<br>src/ui/math-geogebra.tsx · MathGeoGebra<br>src/ui/math-plot-camera.tsx · MathCameraControls<br>src/ui/math-template-plot.tsx · MathTemplatePlot | 구현됐으나 검증 잔여 |
| U32 · 수식 유형·전체 화면 | math · P05 · L194 | src/ui/math-templates.tsx · MathTemplates | 구현됐으나 검증 잔여 |
| U33 · 급수·개념 도해 | math · P05 · L194 | src/ui/integral-reasoning.tsx · IntegralReasoning<br>src/ui/concept-figure.tsx · ConceptFigureView<br>src/ui/concept-interactives.tsx · ConceptInteractives | 구현됐으나 검증 잔여 |
| U34 · Canvas 편집·이관 | canvas · P07 · L062 | src/ui/canvas-transfer.tsx · CanvasTransfer<br>src/ui/canvas-concept-editor.tsx · CanvasConceptEditor | 구현됐으나 검증 잔여 |
| U35 · Canvas·그래프 보기 | graph · P07 · L196 | src/ui/flow-controls.tsx · FlowControls<br>src/ui/flow-experience.tsx · FlowExperience | 구현됐으나 검증 잔여 |
| U36 · 통계 여러 그래프·값 | statistics · P06 · L195 | src/ui/statistics-gallery.tsx · StatisticsGallery<br>src/ui/statistics-plot.tsx · StatisticsPlot<br>src/ui/statistics-trend.tsx · StatisticsTrend<br>src/ui/month-summary.tsx · MonthSummary | 구현됐으나 검증 잔여 |
| U37 · GPT 연결·문맥·사용량 | api-connection · P10 · L198 | src/ui/gpt-connection-panel.tsx · GPTConnectionPanel<br>src/ui/api-budget-summary.tsx · APIBudgetSummary<br>src/ui/study-ai-context-picker.tsx · StudyAIContextPicker | 구현됐으나 검증 잔여 |
| U38 · 움직임 위젯 | workspace-controls · P10 · L048 | src/ui/motion-widgets.tsx · MotionWidgets<br>src/ui/motion-lottie.tsx · 모듈<br>src/ui/motion-lordicon.tsx · 모듈<br>src/ui/motion-rive.tsx · 모듈<br>src/ui/motion.tsx · BusyDots | 구현됐으나 검증 잔여 |
| U39 · 브랜드·관련 생각 | reflection · P01 · L025 | src/ui/brand-experience.tsx · RelatedThinking<br>src/ui/brand-wordmark.tsx · BrandWordmark<br>src/ui/brand-copyright.tsx · BrandCopyright | 구현됐으나 검증 잔여 |
| U40 · 공통 부품·오류·포커스 | workspace-controls · P10 · L025 | src/ui/index.tsx · Modal<br>src/ui/study-result-text.tsx · StudyResultText | 구현됐으나 검증 잔여 |
| U41 · 장문 원문·기록 수정 | notes · P03 · L025 | src/App.tsx · NarrativeEditor | 누락된 실제 배치/복귀 보완; 구현됐으나 검증 잔여 |

## 실제 확인과 남은 조건

- 일정: 55개 합성 일정의 더 보기/선택/날짜/목록 복귀, 상태 의미 분리, 저장 전후 원문, 재접속 복구를 단위·브라우저 검사에 연결했다.
- 전체 화면: OS UI inventory는 R01–R41의 합성 상세/진입 화면을 열고 폭·본문/입력 글자·접근성·기록 불변과 125% 확대를 검사한다. R40은 계정 진입이며 실제 인증/권한 시험이 아니다.
- 실제 과업 조작: 일정 입력/수정/상태/복귀, 카드45개·20개 페이지/선택 답/원문/재접속, 긴 자유 글 저장/초안/복귀, 네 장소/천장 복귀를 확인한다.
- 기기 범위는 WebKit의 iPhone 세로/가로, iPad 세로/가로/반창 모사다. 실물 기기·Apple Pencil/한글 IME, 장기간 누적 사용, 실제 계정 서버/Sync의 전 상태는 미확인이다.
- 공개 반영은 Pages 빌드·전 기기 검사·배포 및 공개 자산 대조 후 MAN-28에 커밋/실행 URL을 기록한다. 목록 수는 그 성공을 대신하지 않는다.

