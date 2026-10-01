# 공통 컴포넌트 상태·동작 계약

`src/ui/index.tsx`에서 내보내는 구현 목록과 미검증 범위를 구분한다. 2026-09-30 NavigationBar와 ContextMenu를 추가하여 계약21종에 대응하는 구현이 존재한다. 구현 존재는 전체 상태·실제 화면·물리기기 검증 완료를 뜻하지 않는다. 표준 HTML 속성과 이벤트를 재사용하며 Input/Textarea/Select의 `onChange`는 문자열이 아닌 React 이벤트다. 입력 컴포넌트는 값을 정규화하거나 자동 저장하지 않는다.

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
| NavigationBar | active/inactive/focus/horizontal/vertical | nav 이름, 현재 aria-current=page, native anchor의 Tab·기본 브라우저 행동, 긴 한글 줄바꿈·최소폭0·48px높이 | `navigation-bar.tsx/css`. sidebar/bottom-nav의 실제 href/label/active를 받음. route·저장·스크롤 복원은 호출자/탐색 계층 책임. 좁은폭 실렌더·물리기기 검증은 별도 |
| ContextMenu | closed/open/focus/disabled/danger | 대상명 표시 및 접근 가능한 이름, trigger aria-expanded/haspopup, 방향키/Home/End와 disabled 건너뜀, Esc·바깥클릭·선택·Tab 닫기, 초점복귀 | `context-menu.tsx/css`. 주제의 하위 추가·이름수정·휴지통 명령 요청. 위험 항목 색+분리선+명확한 라벨, 실제 삭제/확인창/Undo는 호출자 책임. 바깥 입력 초점은 유지. viewport 안 배치/scroll 재배치의 실제 화면 검증 필요 |

## 주요 API

```tsx
<Button variant="primary" busy={saving} onClick={save}>공부함 기록</Button>
<Input label="이름" value={name} onChange={e => setName(e.target.value)} error={error} />
<Textarea label="자유 메모" value={body} onChange={e => setBody(e.target.value)} />
<Tabs items={[{ id: 'notes', label: '기록' }]} value={tab} onChange={setTab} />
<Modal open={open} title="목차 추가" onClose={requestClose}>{form}</Modal>
<Toast message="휴지통으로 옮겼습니다." onUndo={undo} onClose={dismiss} />
<NavigationBar label="주 메뉴" orientation="vertical" items={[
  { href: '#/', label: '홈', active: route === '/' },
  { href: '#/subjects', label: '과목', active: route === '/subjects' },
]} />
<ContextMenu targetLabel={node.name} label="목차 관리" items={[
  { id: 'add', label: '하위 항목 추가', onSelect: () => openDialog('node') },
  { id: 'rename', label: '이름 수정', onSelect: () => openDialog('rename') },
  { id: 'trash', label: '휴지통으로 이동', danger: true, onSelect: () => openDialog('trash') },
]} />
```

## 상태를 나누는 책임

UI의 hover/pressed/focus는 기록 의미를 바꾸지 않는다. 체크 표시 역시 능력 판정이 아니다. 저장 버튼 누름·메모리 반영·로컬 commit·서버 반영은 기능 계층이 받은 사실에 따라 문구를 제공한다. 버튼의 busy 속성만으로 저장 중복·동기화·충돌 처리가 완성됐다고 하지 않는다.

Modal/Sheet의 `onClose`는 초안 보관을 먼저 확인하거나 이탈 확인을 열 수 있다. 컴포넌트가 원문을 삭제하지 않는다. 현재 설계는 중첩 모달을 기본 패턴으로 사용하지 않는다. 필요할 때 자식 모달을 추가하기보다 같은 시트 내 확인 상태로 전환하고, 실제 nested modal이 필요해지면 top-layer 초점 처리를 별도 검증한다.

## 자동 검증과 실제 검증

`src/ui/component.test.tsx`는 busy 실행 차단, 원문 공백·label/error 연결, Tabs의 disabled 건너뛰기·초점, 혼합 체크, 한글 조합 이벤트 중 검색 보류, Undo 접근, Modal 순환·Escape·초점 복귀 및 조합 중 Escape 보류를 검사한다.

이 시험은 jsdom의 합성 이벤트이며 실제 한글 IME·모바일 키보드·터치·VoiceOver 검증이 아니다. 실제 브라우저의 각 사용 화면, Light/Dark, 좁은 창·긴 글·키보드, 물리 iPhone/iPad/Mac의 검증은 Phase 보고서에서 별도로 기록한다.

2026-09-29 실행 결과: 컴포넌트 시험 8/8 통과, TypeScript 검사 통과. 처음 Modal Shift+Tab 검사에서 DOM 순서와 다른 초점 후보 순서가 검출되어, 전체 하위 DOM 순서에서 focusable 조건을 판정하도록 수정한 뒤 8개를 재실행했다. 테스트에서 확인한 초점 복귀를 실제 브라우저·실제 IME 결과로 확대하지 않는다.

2026-09-30 추가 구현의 자동검증: `navigation-bar.test.tsx` 1개와 `context-menu.test.tsx` 6개, 합계7개 통과. 현재 위치 변경·native Tab 순서·정확한 대상·방향키 순환·Home/End·disabled 건너뜀·실행1회·바깥 입력·Tab/Shift+Tab 이탈·조합 중 Escape 보류·전체 disabled·기존 확인 Modal과 초점 복귀 연결을 검사했다. CSS 속성만으로 좁은폭·키보드 가림·물리 터치가 통과했다고 판정하지 않는다. 원장에는 실제 App 연결과 실제 UI 조작 결과를 추가한 뒤 해당 범위만 승격한다.

00:37:05 KST에 기존 `component.test.tsx`까지 함께 실행한 공통 UI 회귀검사3파일/15개도 통과했다. 실제 브라우저·실제기기 상태는 이 합성 DOM 결과와 구별한다.

## 2026-09-30 Prototype 후속 검증

기존 21종 계약을 보존합니다. production JSX 호출과 실제 브라우저를 구별하여 확인했습니다. 직접·내부 호출이 있는 것은 16종이며 Radio/Tabs/SegmentedControl/ListItem/Sheet 5종은 현재 App 호출처가 없습니다. 계약을 맞추려고 불필요한 화면을 추가하지 않았으며 실사용·전체 상태는 미검증입니다.

| 컴포넌트 | 현재 사용처 | 이번 실제 확인 또는 남은 상태 | 판정 |
|---|---|---|---|
| Button | 저장·목차 정렬·표 Preview/생성 | disabled 경계, 390px 표 생성48px, Undo | 수정 후 통과 |
| IconButton | Modal 닫기·Toast 닫기 | Escape/Tab 순환과 닫기 초점 | 수정 후 통과 |
| Input | 생성/이름/개인기준/표 셀 | 입력·공백·닫기/reload; 실제 IME 별도 | 수정 후 통과 |
| Textarea | 자유글·메모·공부 기록·활동 메모 | 80줄3190자 선택방향/내부scroll 복귀 | 수정 후 통과 |
| Select | 학기·테마·이동·표 재사용 | 과목/단원 단계별 선택, 밝기 | 통과 |
| Checkbox | 공부 대상·활동 | 전체 기준 적용 후 새 활동 미체크 확인 | 통과 |
| Radio | 없음 | 실제 사용 수요와 상태 미확인 | 미검증 |
| Tabs | 없음 | 자동 keyboard 검사만; 실제 패널 연계 없음 | 미검증 |
| SegmentedControl | 없음 | 실제 사용 수요와 상태 미확인 | 미검증 |
| Card | 과목·표 입력 블록 | 넓고 좁은 표·긴 이름, 횡넘침 없음 | 통과 |
| ListItem | 없음 | 실제 사용 수요와 상태 미확인 | 미검증 |
| Modal | 생성/이름/이동/기준/표 | 배경 inert, 숨은/disabled/음수 tabindex 배제; B16/B18 | 수정 후 통과 |
| Sheet | 없음 | 공통 구현만 있으며 detent 미구현 | 미검증 |
| Toast | Workspace Undo | 기준/생성 뒤 route 이동에도 Undo; 성공 알림 유지 | 수정 후 통과 |
| Breadcrumb | 과목·주제 경로 | 상위 이동 뒤 입력맥락 복귀 | 통과 |
| Search | 찾기 | 기존 검색 회귀 자동검사; 이번 전상태 실조작 없음 | 미검증 |
| EmptyState | 기록 없음·없어진 항목 | 표 생성 Undo 뒤 없어진 항목의 과목 복귀 | 통과 |
| LoadingState | 앱 시작 | 조건부 호출 존재, 이번 느린 시작 실관찰 없음 | 미검증 |
| ErrorState | 저장/복구/손상 초안 | 오류주입은 자동검사, 실제 용량실패 미주입 | 미검증 |
| NavigationBar | 넓은 sidebar·좁은 하단 | route 복귀·좁은390px 이동 | 통과 |
| ContextMenu | 주제 목차 관리 | rename/move/bulk 진입; 이전 keyboard 회귀 유지 | 통과 |

표 판정은 적힌 이번 조작 범위에만 적용됩니다. 모든 hover/pressed/대비/고대비/200%확대/VoiceOver/터치/물리IME를 통과로 판정하지 않습니다. Modal은 배경의 이전 inert 상태를 보존·복원하고 숨은 조상, disabled fieldset, tabindex=-1 후보를 탭 순환에서 배제합니다. component.test.tsx 9개 및 이번 통합 로그, [실제 UI 기록](validation/followup-ui-20260930.md)을 연결합니다.

2026-10-01 `APIBudgetSummary({billing})`는 GPT 연결의 저장된 월 상한/사용액/미확인 예약을 도넛과 소수 한 자리 금액으로 표시한다. 사용 전/일부/예약/상한 도달·초과를 지원하며 자체 저장/차감을 하지 않는다. 로딩/재조회/실패와 마지막 확인값은 부모 패널이 담당한다. [API 예산 표시](api-budget-chart-20261001.md)를 따른다.
