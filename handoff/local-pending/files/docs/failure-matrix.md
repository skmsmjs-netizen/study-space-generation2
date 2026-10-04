# Failure Matrix

**2026-09-30 작업 순서 정정:** [작업 진행과 검증 정책](../../docs/작업%20진행과%20검증%20정책.md)을 따릅니다. 초안을 먼저 제시하고 검사는 변경·위험·실사용 단계에 맞게 선택합니다. 이 문서의 검사·완료 항목은 모든 초안의 선행조건이 아닙니다.

이 문서는 **실패 시험 계약과 현재 자동검사 증거**입니다. 통합 자동검사는 62개 통과, 성능 1개 일반 실행 건너뜀이며 성능시험은 명시 실행에서 통과했습니다. 실제 브라우저 QA는 [prototype-validation.md](prototype-validation.md)에서 부모 작업이 별도 기록합니다. 아래 자동 열은 해당 하위 범위에만 적용되며 물리기기·서버·다기기 Sync 통과로 확대하지 않습니다. 시나리오나 자동 테스트를 작성한 것만으로 실제 UI·물리기기·다기기 수신을 통과로 바꾸지 않습니다. 참조 불변조건은 [data-contract.md](data-contract.md)의 INV01–INV22입니다.

## 실행 규칙

아래 실패 사례는 변경 위험에 맞게 선택합니다. 실제 기록 적용 전에 필요한 보존·복구 확인은 유지하고, 관련 없는 전체 실패 조합을 초안 제시 전에 실행하지 않습니다.



- demo/test 계정·namespace·복제 데이터만 사용합니다. 실제 Vault를 열거나 시험 레코드를 개인 통계에 넣지 않습니다.
- 각 실행은 build commit, 테스트 데이터 해시, 시작 상태, 주입 시점, 동작, 기대/실제 결과, 저장 전후 비교, 재시작 결과를 남깁니다.
- 자동 검증은 테스트 로그, UI는 실제 브라우저 조작 기록, 물리기기는 모델/OS/입력 방식, Sync는 서로 다른 클라이언트의 전송과 수신 증거를 따로 남깁니다.
- 저장 확인은 로컬 commit과 서버 반영을 구별합니다. UI 낙관 반영이나 네트워크 200 응답만으로 전체 무결성을 확인했다고 하지 않습니다.
- 실패를 발견하면 root cause→수정→적용→동일 시험→연관 흐름 회귀를 수행합니다. 모든 행의 결과 상태는 통과/수정 후 통과/미해결/미검증/해당 없음 중 하나입니다.

## 현재 자동검사 근거

- `src/domain/domain.test.ts`: stable ID·학기/과목/namespace·메모와 공부 의미·중복 op·순환·삭제/복원·version 충돌·Undo·날짜/반복·C2.
- `src/data/demo-repository.test.ts`: demo localStorage 저장 실패·stale snapshot·손상 원본·로컬 날짜·초안 원문 보존. IndexedDB나 실제 서버 시험이 아닙니다.
- `src/ui/component.test.tsx`: busy·focus·label/error·tabs·mixed checkbox·합성 한글 composition·Undo toast·modal.
- `src/App.test.tsx`: 단일 쓰기 창·본문 없는 기록·일괄 메모·초안 재마운트·stale·손상 초안·draft 정리 실패·C2.
- `docs/domain-performance.md`: 합성 10,000개 기록·약 19.4MB, Node/Vitest 전체 검증과 단일 수정. 전체 저장·브라우저·Sync 성능이 아닙니다.
- 기준 commit: `5db9395`(도메인), `7de8b75`(공통 UI). App 최종 구현 commit은 `7d9d775`입니다.

## 실패 조건별 계약

| ID | 실패 조건 | 기대 동작 | 불변조건 | 주입/관찰 방법 | 자동 검증 | 실제 UI | 물리기기 | Sync 수신 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FM01 | 빈 입력 | 본문 없이 공부함 저장은 허용, 대상 없는 구조 생성·공백 제목 거부. 시험 전 서술 점검은 공백 거부 | INV06/08 | 빈 메모와 공백 제목·C2 예외를 분리 | 통과 — 본문 없는 공부와 공백 C2 점검 거부의 도메인 시험. 전체 입력 종류는 미검증 | 통과 — 본문 없는 공부함·빈 시험서술 disabled, PUI01/08/09. 전체 빈 입력 아님 | 미검증 | 미검증 |
| FM02 | 잘못된 입력 | 존재하지 않는 ID·다른 사용자/과목·순환 부모를 거부하고 입력 보존 | INV01/03/04 | 유효성 오류·무변경·재입력 | 통과 — 잘못된 소유권·부모·순환·날짜 거부의 도메인 시험 | 미검증 | 미검증 | 미검증 |
| FM03 | 긴 입력 | 장문·공백·줄바꿈·한글 원문 보존; 크기 제한 시 미저장 상태를 명확히 표시 | INV11/18/20 | 길이·checksum·커서·scroll | 통과 — 공백 및 100KB 본문 충돌 보존 시험. 실제 입력/커서는 미검증 | 미검증 | 미검증 | 미검증 |
| FM04 | 대량 데이터 | 다학기·깊은 목차·동명·수천 기록에서도 소속과 저장 의미 유지 | INV02/03/06/09 | 누적 fixture와 측정 | 수정 후 통과 — 10,000개 기록 도메인 측정만. 전체 대량 UI/저장/Sync 미검증 | 미검증 | 미검증 | 미검증 |
| FM05 | 빠른 연속 클릭 | 한 사용자 저장 의도를 중복 사건으로 만들지 않음 | INV06/10 | pending 상태·중복 op | 통과 — App 반복 클릭과 busy 컴포넌트 시험. 실제 터치 미검증 | 미검증 | 미검증 | 미검증 |
| FM06 | 중복 저장/업로드 | 같은 opId/payload 한 번 적용, 다른 payload는 오류 | INV10 | 서버 commit 후 응답 유실 | 통과 — 도메인 opId 동일 payload 중복 방지/상이 payload 거부. 서버 ack 유실은 미검증 | 미검증 | 미검증 | 미검증 |
| FM07 | 요청 취소 | 취소 뒤 stale 결과가 화면을 변경하지 않음. 서버 반영 여부는 조회로 확인 | INV10/19 | Abort 및 늦은 응답 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM08 | 저장 도중 화면 이동 | 대상 ID에 저장하고 새 화면을 이전 응답으로 덮지 않음 | INV18/19 | A 저장중 B 이동 | 통과 — App 탐색 중 자유글 draft 보존. 온라인 저장·stale 탐색 응답 미검증 | 통과 — 기록 수정 도중 화면 이탈/복귀 초안 보존 PUI05. 온라인 저장 미검증 | 미검증 | 미검증 |
| FM09 | 앱 종료 | commit 이전/이후를 구별하고 재시작 때 마지막 보존 draft 확인 | INV18 | 강제 종료·종료 hook 미실행 | 미검증 — 재마운트 복구 자동시험만 있으며 OS 강제 종료는 미검증 | 미검증 | 미검증 | 미검증 |
| FM10 | 앱 재실행 | pending 작업과 draft 소유권·baseVersion 복구, 새 기록 중복 생성 금지 | INV10/18 | 종료 직후 재실행 | 통과 — App unmount/remount 초안 복원과 무사건 생성. 실제 앱 재실행·outbox 미검증 | 통과 — 완전 페이지 재실행 및 다른 창으로 이전 후 보존 PUI06/18. outbox 미검증 | 미검증 | 미검증 |
| FM11 | 로컬 저장 실패 | 성공 표시 금지, 편집 내용 유지, 재시도/안전 내보내기 안내 | INV18/20 | transaction abort·quota | 통과 — demo 저장 예외 시 미공개·stale 입력 보존. IndexedDB transaction/quota 미검증 | 미검증 | 미검증 | 미검증 |
| FM12 | 서버 오류 | 로컬 pending 보존, 서버 오류를 성공으로 표시하지 않음 | INV10/18 | 4xx/5xx/timeout | 미검증 | 미검증 | 미검증 | 미검증 |
| FM13 | Offline 진입 | 로컬 commit은 계속, 서버 저장과 구별 표시 | INV18 | 입력 전/중/후 네트워크 차단 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM14 | Online 복귀 | pending 재시도, opId 유지, 성공 확인 후 상태 전환 | INV10/18 | 여러 번 on/off | 미검증 | 미검증 | 미검증 | 미검증 |
| FM15 | stale response | A 로드→B 로드→A 늦은 도착은 B 유지 | INV19 | 역순 응답 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM16 | race condition | 의존 명령 순서·version 보장, 최신 입력 덮어쓰기 금지 | INV10/11/19 | 읽기/쓰기 순서 역전 | 통과 — demo 두 창 stale snapshot/단일 writer 거부. 네트워크 race 미검증 | 통과 — 실제 두 번째 탭 쓰기 차단 PUI18. 네트워크 race 미검증 | 미검증 | 미검증 |
| FM17 | 두 기기 동시 수정 | expectedVersion 충돌을 감지하고 양쪽 원문 보존 | INV11 | 같은 계정 별도 기기/컨텍스트 | 미검증 — 단일 환경 expectedVersion 충돌 시험은 통과. 두 기기 동시 수정 미검증 | 미검증 | 미검증 | 미검증 |
| FM18 | sync conflict | base/local/server와 선택 이력 보존, timestamp만으로 긴 글 삭제 금지 | INV11/15 | offline iPhone + online iPad | 미검증 — 도메인 양쪽 본문 보존 시험은 통과. 서버 sync conflict 미검증 | 미검증 | 미검증 | 미검증 |
| FM19 | Import 중 실패 | 원본 무변경, 성공 범위와 미완 범위 명시, 재실행에 중복 없음 | INV16/20 | 단계별 중단·누락 파일 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM20 | 같은 Import 반복 | sourceInstance/oldId/type 대응 재사용, 같은 ID 다른 본문은 충돌 | INV15/16 | 동일 및 변경 package | 미검증 | 미검증 | 미검증 | 미검증 |
| FM21 | 새 학기 생성 | 기존 Subject scope·기록·배치가 무명령 이동하지 않음 | INV02/04 | A snapshot→B 생성→A 비교 | 통과 — 새 학기 생성 후 기존 Subject 소속 보존 시험 | 통과 — 새 학기·과목 생성 후 기존 학기 과목 보존 PUI14 | 미검증 | 미검증 |
| FM22 | 다른 과목 부모 지정 | 동명 항목이어도 다른 Subject 부모 연결 거부 | INV01/03 | 동명·cross-scope fixture | 통과 — cross-subject 부모와 cycle 거부, 원 state 무변경 시험 | 미검증 | 미검증 | 미검증 |
| FM23 | 목차 삭제와 복원 | 기록·본문·이력은 보존, 같은 ID 복원, 이전 별도 삭제 자식 부활 금지 | INV05 | 부모 삭제 batch·독립 trash | 통과 — 부모 삭제/복원 시 기록·revision 보존, 이전 별도 삭제 자식 보존 시험 | 통과 — 주제 휴지통 이동/복원·기록 표시 PUI13. 모든 자식 정책 실조작 아님 | 미검증 | 미검증 |
| FM24 | Undo 후 다른 변경 | Undo가 이후 변경을 조용히 지우지 않음 | INV11/12 | edit A→edit B→undo A | 통과 — Undo 새 revision 및 이후 변경/새 자식 보존 시험 | 미검증 | 미검증 | 미검증 |
| FM25 | Canvas 렌더/배치 오류 | 원본 트리·기록 무변경, 기존 개인 좌표 보존 | INV13/14 | layout throw·부분 렌더 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM26 | 충돌 파일 다수 | 논리 ID별 상이한 원문 모두 보존, 파일명만으로 자동 병합 금지 | INV15 | 여러 기기 충돌본 fixture | 미검증 | 미검증 | 미검증 | 미검증 |
| FM27 | 한글 조합 중 autosave | 미완 조합이 저장 확정되거나 초점/커서가 이동하지 않음 | INV18 | 실제 IME와 composition 자동검사 분리 | 미검증 — 합성 조합/Escape 시험만. 실제 autosave 중 한글 IME 미검증 | 미검증 | 미검증 | 미검증 |
| FM28 | 한글 검색 조합 | 조합중 Enter가 조기 선택하지 않고 늦은 검색이 덮지 않음 | INV19 | Enter/Backspace/연속 타이핑 | 통과 — 공통 Search 합성 composition 종료 후 한 번 발행. 실제 IME/서버 stale 검색 미검증 | 미검증 | 미검증 | 미검증 |
| FM29 | 키보드 가림·scroll jump | 입력과 핵심 CTA 접근 가능, 초점·선택·맥락 유지 | INV18 | iPhone/iPad 키보드·Split View | 미검증 | 미검증 | 미검증 | 미검증 |
| FM30 | 인증 만료/사용자 변경 | 다른 사용자 데이터 접근 금지, 미전송 원문 귀속 유지 | INV01/18 | signout/signin/RLS negative | 미검증 — 도메인 다른 사용자/namespace 거부 시험 통과. Auth 만료·RLS 미검증 | 미검증 | 미검증 | 미검증 |
| FM31 | 기기 로컬 용량/삭제 | 재생성 캐시와 미전송 원본 분리; 실제 보존 불가 시 명확히 알림 | INV18/20 | quota/eviction·독립 export | 미검증 | 미검증 | 미검증 | 미검증 |
| FM32 | Service Worker 업데이트 | 입력 중 강제 새로고침 금지, 호환 version·재시작 복구 | INV18/20 | 구버전 tab+새 배포 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM33 | Export/Restore 실패 | 검증 없이 성공 표시 금지; 원본 ID·내용·이력·설정·첨부 비교 | INV20 | 잘린 파일·checksum·중복 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM34 | 시험 데이터 통계 혼입 | demo/test가 personal 조회·집계에 포함되지 않음 | INV01/17 | 같은 제목·날짜 fixture | 통과 — demo/test fixture 및 오염 snapshot 거부. 온라인 personal 통계 격리 미검증 | 미검증 | 미검증 | 미검증 |
| FM35 | C2 시험 서술 수정 | 일반 C2 체크 보존, 시험 점검만 재확인, 원문 삭제 금지 | INV07/08 | 공백/수정/체크해제/새 공부 | 통과 — C2 공백·수정·해제·새 공부·generic patch 보호의 도메인/App 시험 | 통과 — 글 없는 일반 C2·시험점검 저장/해제 원문 보존 PUI08/09 | 미검증 | 미검증 |
| FM36 | 불확실한 날짜/반복 | unknown/minimum/range를 0·확정·createdAt으로 바꾸지 않음 | INV09 | 집계·필터·표시·Export | 통과 — 날짜 range/unknown·최소 반복 보존 및 잘못된 날짜 거부. 전체 집계/Export 미검증 | 미검증 | 미검증 | 미검증 |
| FM37 | 퇴역 필드 재등장 | 과거 원문은 읽되 일반 입력 필수 질문으로 재승격 금지 | INV22 | legacy fixture·기본 기록 A | 미검증 | 미검증 | 미검증 | 미검증 |
| FM38 | 위험 조작 근접/Enter | 영구삭제를 기본 저장/Enter와 분리, 미확정 정책은 노출 안 함 | INV21 | focus·keyboard·double click | 미검증 | 미검증 | 미검증 | 미검증 |
| FM39 | 부분 성공 | 반영/미반영 대상을 명확히 표시하고 실패분만 재시도 | INV10/16/18 | 일괄 기록·Import 일부 실패 | 미검증 | 미검증 | 미검증 | 미검증 |
| FM40 | 시간대·기한 변경 | 실제 날짜 근거·기한 미정·출석/개인 목표 구분 유지 | INV09 | 기기 timezone·DST·anchorDate | 통과 — localDay 자정 경계 시험. DST·기한 의미·일정 변경 전체 미검증 | 미검증 | 미검증 | 미검증 |

## 증거 기록 양식

```text
실행 ID / FM ID:
Phase / build commit:
환경 / 브라우저 / OS / 물리기기:
namespace / fixture ID 및 hash:
선행 상태:
실제 실행·오류 주입 시점:
기대 결과 / 실제 결과:
UI 상태 / 로컬 commit / 서버 version / 상대 기기 수신:
원문·ID·개수·revision 비교:
자동 검증 상태와 artifact:
실제 UI 상태와 artifact:
물리기기 상태와 artifact:
Sync 수신 상태와 artifact:
발견한 원인:
수정 commit:
재검증 / 회귀 artifact:
남은 문제 / 미검증 범위:
최종 상태:
```

## 누적 데이터 기준

여러 학기·과목, 서로 다른 깊이, 긴 제목, 같은 이름의 다른 ID, 수백~수천 기록, 긴 자유서술, 많은 체크·Canvas 노드를 가진 고정 seed fixture를 생성합니다. 개수와 크기는 실행 전 기록하고 매번 같은 자료로 비교합니다. 입력 이벤트의 즉시 반응, local commit, 서버 ack, 검색·집계·Canvas 완료를 따로 측정합니다. 시작·이동·입력·저장·검색·통계·Canvas·Sync의 percentile과 최악 사례를 남기며 빈 화면의 한 번 측정을 일반화하지 않습니다.

최종 Prototype 구현 commit: `7d9d775`. 이후 이 문서의 보완 commit은 `git log`로 추적합니다.
