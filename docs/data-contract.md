# 데이터 모델과 불변조건 · 구현 기준

## 2026-10-01 공통 필기 확장

`MemoStroke`의 선택 속성 `page`(없으면 0)·`pressureSensitive`를 기존 벡터 원문 JSON에 추가한다. 좌표는 쪽마다 기존 900×600이며 기존 점/필압/ID를 이관하지 않는다. 페이지와 필압 표시의 검증·읽기 화면, 기기별 보기/펜 설정/최근 50동작의 보존과 구버전 호환 경계는 [필기 계약](handwriting.md)을 따른다. 메모·답안의 기존 서버 원장 경로를 유지하며 별도 SQL 스키마를 추가하지 않는다.

## 2026-10-01 일정 관리 확장과 기기 알림

학습 계획의 `schedules`에 주차별 강의 kind `class`와 선택 속성 `dueTime`·`opensTime`·`reviewDate`·`taskText`·`sourceUrl`·`notesRequired`·`week`·`seriesId`·`deletedAt`·`history`를 추가했다. 기존 ID·상태·원문·저장 키·날짜 미정과 시각 미정을 유지한다. history의 previous는 history를 제외한 이전 일정 전체이며 복원도 현재 원문을 새 이력에 남긴다. `scheduleChecks`는 독립 ID/subjectId/at의 실제 과목 공지 확인 기록이며 제출·출석·새 과제 없음의 근거로 자동 환산하지 않는다. 기존 학습 계획 command/sequence/opId/packed-state 경로로 서버에 저장한다.

기기 구독은 새 서버 전용 `study_push_subscriptions`에 따로 보관한다. 서버는 Auth owner와 가입 승인·구독 키·허용된 provider endpoint를 확인하며 service role만 RPC/테이블을 사용한다. 일반 client role 직접 조회·수정은 거부한다. 하루 발송 claim/완료/재시도와 만료 비활성화는 일정 원문과 별개이며 FK는 계정 삭제 시 구독을 정리한다. 알림 활성화 전 개인 대기 기록의 서버 저장을 확인하고 로그아웃 시 이 기기의 구독을 끈다. 키·cron 설정과 실제 수신은 운영 적용 후 별도 확인이다. 상세 동작·보존·근거·한도·운영 적용은 [일정 관리](schedule-management.md)를 따른다.

## 기존 모델의 공통 조건

모든 도메인 ID는 문자열이다. 새 ID는 UUID를 써도 기존 ID를 UUID로 강제 교체하지 않는다. User ID만 Supabase Auth UUID와 대응한다. 공통 필드는 id, userId, namespace, createdAt, updatedAt, version, deletedAt이며 필요한 엔터티는 order를 가진다. syncState는 기기 로컬 상태이며 서버 원문 필드와 구별한다. demo/test와 personal namespace는 명시적으로 분리한다.

## 모델

| 엔터티 | 소속·관계·의미 |
|---|---|
| User | Auth 사용자. 개인 정보는 코드/fixture에 포함하지 않음 |
| Scope | semester/independent/unassigned. 과거 학기 미지정과 독립 공부를 임의 학기로 배정하지 않음 |
| Semester | 사용자 소유의 실제 학기. Scope의 semester 종류와 연결 |
| Subject | user+scope에 소속, order. 다른 학기 만들기가 기존 Subject의 scope를 변경하지 않음 |
| Unit/OutlineNode/Topic | 하나의 가변 깊이 트리. role=unit/outline/topic/legacy-unknown, 같은 Subject의 부모만 허용. 단원도 자체 기록 가능 |
| StudySession | 하나의 공부 사건과 원래 ID. 기존 복수 과목/학기 세션을 자동 분할하지 않음. 원문 payload와 수정 이력 유지 |
| StudyRecord | session과 하나의 대상(node 또는 subject)의 연결. 해당 대상의 Subject/Scope는 일치해야 함. done/본문/날짜근거/TRACE를 기록하며 본문만으로 공부 횟수 증가하지 않음 |
| DateEvidence | exact/range/unknown. createdAt을 실제 공부 날짜로 대체하지 않음 |
| ActivityDefinition/Checklist | ID·정의 version·원문·group·label·required/optional/excluded. 사용자 조정 및 옛14/5/6체계 별도 보존 |
| ActivityAttempt/Repeat | checked/unchecked/na/deferred, note, exact/minimum/unknown 반복. 재체크/저장 재시도는 새 반복 아님 |
| WrittenReview | Cself1의 시험 전 자기 서술. 공백 거부, 글 수정 시 checked=false, 글과 일반 C2 체크 보존 |
| Narrative | subject-overview/unit-introduction/topic-note/free-note. body와 version/revision. 원문 공백도 보존 |
| Question/Memo/Relation | Canvas의 의미 있는 원문과 연결. 배치와 별개 ID; 체크가 자동으로 메모를 생성하지 않음 |
| QuickMemo | 선택적 memos 컬렉션. 제목 없는 직사각형 메모의 body·ownerId·벡터 선 원문·version·휴지통/복원·수정 이력. 메모는 공부 회차를 만들지 않음 |
| MemoryCard | 선택적 memoryCards. 주제별 질문·기준 답안·원본 벡터 선·버전·수정 이력·보관/복원. 등록은 공부 체크나 숙달이 아님. [암기시험](memory-tests.md) |
| MemoryTest | 선택적 memoryTests. 출제 당시 항목 ID/버전·질문/답안/선, 실제 응답과 직접 비교 결과. 미응답/미판정/판단 보류를 오답/0으로 바꾸지 않음. 항목 수정·보관 후에도 당시 기준과 응답 보존 |
| CodeExample | 선택적 codeExamples 컬렉션. 제목·언어·코드·stdin·자유 설명·마지막 실행 원문/출력과 version·수정 이력·휴지통/복원. 실행 결과는 사용한 소스/입력과 연결하며 코드 수정 뒤 이전 결과임을 표시. 예제/실행은 공부 회차·완료·정답 판정이 아님. [코딩 연습 계약](code-practice.md) |
| StudyMaterial | 선택적 studyMaterials 컬렉션. 과목/선택 주제·필기 원문·기기 음성 참조/hash·생성 당시 입력·받아쓰기/요약/근거 연결 카드·수정 전 문장·version/이력·휴지통/복원. 생성/열람은 공부 회차·정답·숙달 아님. 실제 음성 bytes는 기기 IndexedDB이며 다기기 음성 저장은 미구현. [강의 AI 자료 계약](ai-materials.md) |
| ViewLayout / CanvasLayout | view 및 노드별 x/y/size/color/edge. 현재 선택적 `canvasLayouts`에는 원본 엔터티 ID를 참조하는 카드 좌표·사용자 연결·뷰포트만 버전/이력과 함께 저장. 원문은 기존 목차·QuickMemo·Narrative에 유지하며 사용자 배치와 자동 계산 결과를 분리 |
| Schedule/ExamDate | 정확/미정 기한·시간대·변경 이력. 계획은 실제 수행과 다름 |
| Task/Assignment | 종류·Subject·준비/실제 제출·완료일·취소·보관을 구별 |
| OnlineLecture | 재생·필기하며 학습·출석 인정 확인을 독립 상태로 보존 |
| Material/MaterialLink/OutlineReview | 원자료·판본·가용성·목차연결·쪽수·목차검수. 등록은 공부 아님 |
| PerformanceItem/Attempt | 문제 동일성·도움·첫 시도·결과·시점·근거. TRACE 체크와 독립 |
| ExamPlan/Response/Score | 범위·시험 시도·채점·공식 점수 및 불확실성 |
| AnkiCard/Review | 자체 복습 카드·서술·again/hard/good/easy·기한·Undo. 일반 어려움과 별개 |
| Guidance/Preference | WHY/HOW/WHAT, 선택적 안내와 후보 숨김. 퇴역 설문은 legacy로 보존 |
| Draft | user/device/entity/session별 소유권, baseVersion, 원문. 다른 세션 draft 자동 적용 금지 |
| Revision | entity와 부모 revision, 이전/새 원문 또는 원본 snapshot, 원인 operation |
| Conflict | base/local/server와 상태. timestamp만으로 긴 글을 폐기하지 않음 |
| SyncOperation/State | opId, payloadHash, baseVersion, attempts, pending/syncing/synced/conflict/error. 중복 적용 거부 |
| AppSettings | 공유 또는 기기별 scope. 글꼴·간격·색·후보 설정의 의미 보존 |
| Attachment | hash·원 bytes·mime·참조. 마지막 참조와 삭제 정책 검증 전 blob 삭제 금지 |
| ImportBatch/SourceMap/LegacyArchive | sourceInstance+oldId+type+hash. 반복 import 재사용, 같은ID 다른원문 충돌. unmapped도 버리지 않음 |

## 절대 깨지면 안 되는 조건

- INV01: 모든 대상은 같은 user/namespace에 속한다. 다른 사용자의 읽기·쓰기를 거부한다.
- INV02: Subject의 Scope는 명시 명령 없이 바뀌지 않는다. 새 학기 생성은 기존 학기 무변경이다.
- INV03: 노드 부모는 같은 Subject이며 자기/후손 밑으로 이동할 수 없다. 동명은 중복 ID가 아니다.
- INV04: StudySession은 원 ID와 실제 사건 의미를 유지한다. 대상별 Record 소속은 검증하되 과거 복수 범위 세션을 쪼개지 않는다.
- INV05: Topic 휴지통 이동은 StudyRecord/본문/Revision을 삭제하지 않는다. 복원은 같은 ID로 한다.
- INV06: done 또는 실제 활동 체크와 메모/조회/자료 열기를 구별한다. 여러 활동을 한 사건의 여러 회차로 세지 않는다.
- INV07: TRACE 순서 잠금·자동 숙련 판정·옛 체크의 새 항목 전체 환산을 하지 않는다.
- INV08: C2 평소 체크에는 글이 필수가 아니다. 시험 전 점검만 nonblank를 요구하고 글 수정 시 재확인한다.
- INV09: 정확/최소/미정·날짜 범위·미응답은 0이나 확정값이 되지 않는다.
- INV10: 같은 opId+같은 payload는 한 번만 적용한다. 같은 opId+다른 payload는 오류다.
- INV11: 수정은 expectedVersion과 실제 version을 비교한다. 충돌 시 양쪽 본문을 남긴다.
- INV12: Undo도 새 수정 이력이다. 그 뒤 다른 변경을 조용히 되감지 않는다.
- INV13: Canvas/layout 명령은 도메인 트리나 기록을 변경할 수 없다.
- INV14: 사용자 배치는 자동 재계산으로 덮어쓰지 않는다. 2026-09-30 사용자 요청에 따라 현재 목차·주제·저장한 설명은 원래 ID로 Canvas에 자동 투영한다. 명시적인 ‘목차 배치’만 현재 표시 카드의 위치를 다시 계산하고 이력으로 되돌릴 수 있게 한다.
- INV15: 중복 공부 페이지는 읽기 보류/충돌로 보존한다. 이름이 같다는 이유로 자동 병합하거나 덮어쓰지 않는다.
- INV16: 같은 import의 재실행은 동일 source map을 재사용한다. 깨진/누락 원문을 건너뛰고 성공으로 표시하지 않는다.
- INV17: 테스트 데이터는 demo/test namespace에서만 만들며 개인 통계에 합산하지 않는다.
- INV18: 저장 성공 표시는 실제 저장 단계와 일치한다. 미전송 원본은 캐시 삭제 대상이 아니다.
- INV19: stale 응답은 user/scope/request identity가 일치할 때만 반영한다.
- INV20: Export/복원은 ID·원문·draft·revision·설정·배치·연결·첨부를 검증한다.
- INV21: 위험 조작은 자주 쓰는 조작과 분리한다. 휴지통과 영구삭제를 같은 버튼으로 숨기지 않는다.
- INV22: 일반 입력의 퇴역 필드를 자동 복원하지 않는다. 별도 수행/시험/Anki 입력과 legacy 원문은 보존한다.

## 삭제 결정

현재 구현 범위에서는 soft delete와 restore만 제공한다. 부모 삭제는 하위 노드의 논리 삭제 묶음을 만들고 기록/원문/이력/첨부는 보존한다. 다른 시점에 이미 삭제된 자식은 그 묶음 복원으로 되살리지 않는다. 영구삭제는 원문·이력·백업 보존 범위의 사용자 정책이 정해지기 전 노출하지 않는다. 이것은 기능 제거가 아니라 정책 미확정 상태다.

## 구현 순서

먼저 가짜 데이터에서 명령/화면 계약을 검증한다. 온라인 Auth/CRUD를 검증한 후 IndexedDB/outbox를 추가하고, 동기화 뒤 conflict, 그 뒤 Canvas/PWA/실제 Import로 진행한다. 테스트 설계가 있다는 이유로 뒤 단계의 통과를 주장하지 않는다.

## 일정 세부 보존

approximate 기한은 anchorDate+days를 유지하며 오늘 기준으로 매번 미루지 않는다. available date/time, dueMeaning(출석/개인목표/시청/미정), 메모 필요 여부·수강/메모/출석 개수를 분리한다. 시험일 unknown/scheduled/none, previousDate, trackStart와 기기 prompted/drafts도 Import manifest에 포함한다.


## 2026-10-01 칸반보드

선택적 `studyBoards`에는 자유 카드 원문·주제 참조·열·카드 순서·보관 상태와 버전/수정 이력을 저장합니다. `saveStudyBoard`는 공부 기록/TRACE/Canvas 좌표를 바꾸지 않습니다. 초안/권한/원자적 쓰기와 현재 서버 적용 상태는 [그래프뷰·칸반보드 계약](graph-and-board.md)을 따릅니다.

## 덱·빈칸·Anki 가져오기 선택 필드

`recallPreferences.deckName`이 없는 기존 행은 기본 설정, 있는 행은 ID별 덱 설정입니다. `RecallOptions.burySiblings`가 없으면 형제 카드 미루기를 사용합니다. `recallCards.deckId`가 없는 기존 카드는 기본 덱에 남으며 `cloze`는 원문/노트ID/번호, `suspended`와 `clozeRemoved`는 수동 보관과 번호 삭제를 구별합니다. `importSource`는 GUID/ordinal 원본 키·필드·태그·템플릿과 최초 표시 내용을 보존합니다. 새 컬렉션이나 기존 ID/메모/이력의 이관은 없습니다. `saveRecallCloze`는 형제 전체 버전을 확인하고 `importRecallCards`는 요청마다 최대100개와 원본 키 중복을 확인합니다. 세부 보존과 한도는 [덱·빈칸·가져오기 계약](recall-decks-import.md)을 따릅니다.

## 2026-10-01 강의 자료 문서·퀴즈·튜터·지도와 원본 파일

`studyMaterials.documents`는 파일 SHA256/선택적 cloudPath, 파일명·kind·URL, stable block id·label·시간·원문·수정 전 원문·included를 보관합니다. 전체 원문과 선택 생성 snapshot을 구별하며 `sourceIdentity`는 선택 원문 내용/구간을 기준으로 합니다. cloudPath나 제외한 내용 변경만으로 기존 대화를 무효화하지 않습니다. `originalStorage`는 명시적 local/cloud 선택이며 서버 파일은 본인/공간/kind/hash 경로로만 연결합니다. 수정 전 결과·revisions도 같은 소유권 검증을 적용합니다.

`quizAttempts`는 결과 ID와 문항 snapshot, 실제 선택·제출 시점을 보관합니다. 저장 전이는 실제 결과의 문항인지 확인하고 제출한 기존 답·문항을 바꾸거나 없애는 요청을 거부합니다. PostgreSQL JSON key 순서가 바뀌어도 동일한 문항으로 비교합니다. `tutorDraft`와 tutor 결과/request history는 질문 초안·출처 있는 답·지난 대화를 보존합니다. `map`/`originalMap`은 근거 있는 node/edge와 위치이며 Canvas 추가는 stable ID로 기존 편집·layout을 보존합니다. 최대20문서/100만 원문 문자/50MiB 파일, GPT15만 문자,100퀴즈 시도, 지도40개념/80관계입니다.

서버의 자료 계약과 private Storage를 좁혀 적용했습니다. 정확한 현재 적용·실제 authenticated 파일 왕복·합성 metadata 저장·GPT/물리 기기 미검증은 [담당 보고](univ-materials-20261001.md)를 확인합니다.


### GPT 분할 명세 연결의 선택 필드 · 2026-10-01

기존 ID·원문·저장 키·과거 결과는 유지합니다. `MaterialResult.contractVersion=jun-split-20261001-1`이 있는 신규 결과만 역할 근거 검사를 적용하며 버전 없는 과거 결과는 기존 검사로 읽습니다. `SourceSegment.role`은 material/problem/attempt/reference/focus입니다. history는 별도 맥락으로 보내며 원문 사실 근거로 승격하지 않습니다. summary의 evidenceType은 material-grounded/general-supplement이며 자료 기반 문항을 일반 보충으로 만들 수 없습니다.

`MaterialResult.diagnostics`는 needs-input/insufficient-evidence/partial, message, 최대2 questions, 선택 sourceIds를 받습니다. 진단의 sourceIds는 생략할 수 있지만 일반 결과의 근거 검사는 유지합니다. status는 생성 처리 상태로서 학습 완료·점수·숙달을 의미하지 않습니다. `range`는 입력 변경 표지·범위 index/count·실제 sourceIds·overlapIds·전체 전달 구간 수를 보존합니다. `MaterialContent.generationProgress`는 명시 범위 선택과 진단 없는 결과의 연결을 저장하며 과거 입력의 결과는 results에 그대로 남습니다.

`MaterialContent.learningView`와 기기 `MaterialDraft.view`는 result/card ID·탭·현재 공개 및 공개/열람 이력을 보관합니다. 새 카드나 다른 결과의 편집/공개 상태는 이전 카드로부터 옮기지 않습니다. 같은 카드의 사용자 수정은 유지합니다. `MaterialQuizAttempt.helpedQuestionIds`는 열린 시도에서 자료·다른 결과를 열 때 남기는 선택 필드이며 기존 도움 이력을 제거할 수 없습니다. 제출된 응답의 불변 계약은 유지합니다. 설명 지원 수준은 `StudyAIRequest.support=full/key/check`의 명시 선택이며 자동 숙달 판정이나 단계 축소가 아닙니다.

`TopicMemoryResult.evidenceType=topic-general`은 강의 자료 근거와 구별합니다. 문항0개의 진단은 sourceIds를 만들지 않고 주제 입력 snapshot과 함께 보관하며 등록 항목·학습 사건을 생성하지 않습니다. 목차 카드 등록의 topicGeneration은 최초 질문/답, 입력 version, 생성 경로를 계속 보관합니다.

초안 저장 대기/실패, 완료 결과의 메모리 보유, 기기 초안 성공, 개인 서버 acknowledgment를 구별합니다. 실패 시 동일 현재 초안의 쓰기만 재시도할 수 있고 기존 내보내기를 유지합니다. 강제 종료나 저장 장치 불능의 복구 성공은 보장하지 않습니다. 운영 서버·실제 GPT·물리 기기·Sync 증거는 이번 로컬 합성 검사에 포함되지 않습니다.


## 2026-10-01 읽기 전용 통합 검색과 탭 보기 힌트

통합 검색은 현재 계정·공간의 등록 자료를 읽기 전용으로 색인하며 원문·ID·이력·학습 사건을 변경하지 않습니다. 삭제된 과목/자료와 다른 소유자의 자료는 제외합니다. 여러 과목이 섞인 시험은 일치 문항의 실제 소속으로 범위를 판정하며 소속이 없는 역사적 문항은 전체 범위에서만 찾습니다. 이전 일정의 읽기 어댑터는 자동 이관이나 업로드를 실행하지 않습니다.

`view-context`는 같은 탭의 `sessionStorage`에 공간·계정·화면·활성/휴지통별 검색어, 필터, 펼침, 페이지/표시 개수를 선택적으로 저장합니다. 실패해도 본문 입력·저장을 막지 않습니다. 보기 힌트는 원문·초안·서버 동기화 계약을 대신하지 않으며 다른 계정이나 휴지통 조건으로 섞지 않습니다. 전체 연결과 검증 범위는 [적용 기록](reel-flow-application-20261001.md)에 있습니다.


## 2026-10-01 제품 품질 보완의 저장 호환

브라우저의 큰 문자열은 `study-space:gzip15:v1:` 형식으로 저장할 수 있습니다. UTF-16 코드 단위를 그대로 gzip으로 압축하며 고정 mtime, CRC-32와 길이, 저장 전 원문 일치를 확인합니다. 압축 바이트는 서로게이트를 피한 15비트 단위로 담아 브라우저 저장 용량을 줄입니다. 기존 일반 문자열·`study-space:lz16:v1:`·이전 `study-space:gzip16:v1:` 형식도 계속 읽습니다. 원문·서로게이트·ID·이력·좌표의 의미를 바꾸지 않으며 서버의 별도 압축 프로토콜은 유지합니다.

IndexedDB의 첨부·녹음·복원 저널은 ArrayBuffer와 MIME을 저장하고 읽을 때 Blob으로 돌려줍니다. 기존 Blob 및 문서 원본의 `bytes/type` 형식도 읽습니다. 전체 백업은 이 저장 표현을 풀어 실제 바이트 지문과 참조를 검사합니다. 관련 구현은 `src/data/storage-codec.ts`, `binary-storage.ts`, `material-files.ts`, `full-backup.ts`이며 [보완 결과](product-quality-fixes-20261001-2053.md)에서 실제 확인 범위와 한도를 구별합니다.
