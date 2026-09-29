# 공통 컴포넌트 상태·동작 계약

`src/ui/index.tsx`의 구현 목록과 미구현 범위를 구분한다. 표준 HTML 속성과 이벤트를 재사용하며 Input/Textarea/Select의 `onChange`는 문자열이 아닌 React 이벤트다. 입력 컴포넌트는 값을 정규화하거나 자동 저장하지 않는다.

| 컴포넌트 | 상태 | 접근성·키보드·터치 | 저장·구현 경계 |
| --- | --- | --- | --- |
| Button | default/hover/pressed/focus/disabled/busy | 기본 button, Enter/Space, 최소 48px | busy는 disabled와 aria-busy. 같은 op의 재시도 중복 방지는 domain 책임 |
| IconButton | Button 상태 | label 필수, aria-label/title, 최소 44px | 동작을 아이콘 모양만으로 전달하지 않음 |
| Input | empty/filled/focus/disabled/read-only/error/composing | label과 hint/error ID 연결, 입력16px 이상 | 원문 trim·IME 조합 변경 없음, forwardRef |
| Textarea | Input 상태+long | 가로 넘침 억제, 세로 resize, 줄바꿈·공백 보존 | 긴 글의 revision·복귀 커서는 편집 기능 책임 |
| Select | empty/selected/focus/disabled/error | native select, 같은 Field 계약 | 동명 항목은 호출자가 상위 경로를 표시 |
| Checkbox | unchecked/checked/mixed/disabled | native checkbox·label 영역 최소48px, indeterminate 반영 | mixed는 일부 선택이며 학습 완료가 아님 |
| Radio | unchecked/checked/disabled | native radio, 같은 name끼리 방향키 관습 | 호출자가 fieldset/legend로 그룹 의미 제공 |
| Tabs | selected/focus/disabled/overflow | tablist/tab, roving tabIndex, 좌우/Home/End, disabled 건너뜀 | panelId는 aria-controls, 화면의 패널/route는 호출자 책임 |
| SegmentedControl | selected/idle/disabled | button group, aria-pressed, Tab과 Enter/Space | 소수 표시 방식 선택. tab 패널 의미로 쓰지 않음 |
| Card | static | div, 본문을 클릭 대상으로 위장하지 않음 | 실제 조작은 내부 Button/Link 사용 |
| ListItem | static/with-actions | li, 상위 ul/ol 필요 | 선택·드래그·정렬은 domain 화면 책임. 가짜 draggable 속성 없음 |
| Modal | closed/open | dialog label, aria-modal, Tab 순환, Esc, 닫으면 진입 초점 복귀 | onClose는 요청. 미저장 초안 보존·dirty 차단은 호출자가 결정. 자동 저장 없음 |
| Sheet | Modal+compact | 같은 모달 계약, 좁은 화면 아래 위치, safe-area | 높이 드래그·여러 detent는 이번에 구현하지 않음 |
| Toast | info/undo | 메시지 role=status, Undo와 닫기 버튼 | 자동 타이머 없음. 사용자가 읽기 전에 Undo가 사라지지 않음. 실제 역명령은 호출자 책임 |
| Breadcrumb | ancestor/current/wrapped | nav label, 현재 aria-current, 경로 줄바꿈 | ID에 대한 route/callback은 호출자 제공. 현재 항목은 조작하지 않음 |
| Search | composing/query | type=search, 조합 중 onQueryChange 보류, 종료 후 한 번 전달 | debounce·취소·stale 응답 방지는 검색 기능 책임. 일반 onChange는 조합 중에도 전달 |
| EmptyState | first-use/filtered-empty/offline-unavailable | 제목·설명·children action | 상태별 문구와 다음 행동은 호출자가 제공 |
| LoadingState | loading | role=status·polite | 기존 화면 삭제나 서버 완료 암시 없음 |
| ErrorState | error/retry | 오류 role=alert, 구체 메시지, 선택적 재시도 | 내부 JSON·secret을 message에 넘기지 않음 |
| NavigationBar | 상태 명세만 | 현재 위치·키보드·좁은폭·가로 넘침 | 화면의 sidebar/bottom-nav 구성이 먼저이므로 범용 컴포넌트를 아직 만들지 않음 |
| ContextMenu | 상태 명세만 | ⋯ 버튼 대안, 정확한 대상, 위험 동작 분리, Esc·초점 복귀 | 실제 공통 메뉴 수요와 명령이 정해지면 구현. 빈 wrapper 없음 |

## 주요 API

```tsx
<Button variant="primary" busy={saving} onClick={save}>공부함 기록</Button>
<Input label="이름" value={name} onChange={e => setName(e.target.value)} error={error} />
<Textarea label="자유 메모" value={body} onChange={e => setBody(e.target.value)} />
<Tabs items={[{ id: 'notes', label: '기록' }]} value={tab} onChange={setTab} />
<Modal open={open} title="목차 추가" onClose={requestClose}>{form}</Modal>
<Toast message="휴지통으로 옮겼습니다." onUndo={undo} onClose={dismiss} />
```

## 상태를 나누는 책임

UI의 hover/pressed/focus는 기록 의미를 바꾸지 않는다. 체크 표시 역시 능력 판정이 아니다. 저장 버튼 누름·메모리 반영·로컬 commit·서버 반영은 기능 계층이 받은 사실에 따라 문구를 제공한다. 버튼의 busy 속성만으로 저장 중복·동기화·충돌 처리가 완성됐다고 하지 않는다.

Modal/Sheet의 `onClose`는 초안 보관을 먼저 확인하거나 이탈 확인을 열 수 있다. 컴포넌트가 원문을 삭제하지 않는다. 현재 설계는 중첩 모달을 기본 패턴으로 사용하지 않는다. 필요할 때 자식 모달을 추가하기보다 같은 시트 내 확인 상태로 전환하고, 실제 nested modal이 필요해지면 top-layer 초점 처리를 별도 검증한다.

## 자동 검증과 실제 검증

`src/ui/component.test.tsx`는 busy 실행 차단, 원문 공백·label/error 연결, Tabs의 disabled 건너뛰기·초점, 혼합 체크, 한글 조합 이벤트 중 검색 보류, Undo 접근, Modal 순환·Escape·초점 복귀 및 조합 중 Escape 보류를 검사한다.

이 시험은 jsdom의 합성 이벤트이며 실제 한글 IME·모바일 키보드·터치·VoiceOver 검증이 아니다. 실제 브라우저의 각 사용 화면, Light/Dark, 좁은 창·긴 글·키보드, 물리 iPhone/iPad/Mac의 검증은 Phase 보고서에서 별도로 기록한다.

2026-09-29 실행 결과: 컴포넌트 시험 8/8 통과, TypeScript 검사 통과. 처음 Modal Shift+Tab 검사에서 DOM 순서와 다른 초점 후보 순서가 검출되어, 전체 하위 DOM 순서에서 focusable 조건을 판정하도록 수정한 뒤 8개를 재실행했다. 테스트에서 확인한 초점 복귀를 실제 브라우저·실제 IME 결과로 확대하지 않는다.
