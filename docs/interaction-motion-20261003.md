# 버튼·창·화면 이동의 기능적 모션 — 2026-10-03

사용자 요청: 버튼, 창 전환, 이동 등의 고급 UX 대표 기준을 찾아 실제 앱에 적용하고 기존 GitHub Pages로 공개 배포한다. 평소 조작에서 변화의 대상과 이동 관계가 보이도록 공통 부품과 실제 경로에 연결한다. 원문·ID·초안·수정 이력·저장 키·커서·개인 배치·서체·기존 권한은 유지한다.

## 조사·선정과 적용 범위

2026-10-03 공식 자료를 직접 확인했다. 디자인 시스템의 권고, W3C 접근성 기준, 브라우저 API, 이번 제품의 수치 선택을 구별한다.

| 근거 | 채택 이유와 실제 적용 | 한계 |
| --- | --- | --- |
| [Microsoft Fluent 2 Motion](https://fluent2.microsoft.design/motion) | 기능적·자연스러운·일관된 모션, enter/exit·elevation·top-level 구분. 버튼 눌림/복귀, 창/메뉴 등장, 큰 과업 간 페이드 | 개별 디자인 시스템의 지침이며 학습 효과나 법정 표준은 아니다. 큰 본문을 화면 밖으로 미는 동작은 쓰지 않는다. |
| [IBM Carbon v10 Motion](https://v10.carbondesignsystem.com/guidelines/motion/overview/) | productive/expressive, standard/entrance/exit 곡선과 크기·거리별 시간. 버튼70ms, 창240ms, 퇴장110ms. 빠르게 시작하고 부드럽게 멈춤 | 접근 가능한 공식 v10 지침을 명시적으로 참고했다. 현행 Carbon 패키지를 설치하거나 최신 버전으로 전면 이관한 것이 아니다. 기존120/180ms 미세 피드백·탭 값은 호환 보존한다. |
| [Material Components 공식 Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md) | navigational transitions의 shared-axis/fade 관계를 참고. 목록→상세/상위 목록 복귀에 서로 반대인 제목 이동, 독립 과업은 페이드 | Android SDK 구현을 웹에 이식하지 않는다. 전체 편집기 복제·마운트 대기·공유 컨테이너 변형은 만들지 않는다. M3 사이트는 JS 필요 응답이므로 본문 독해 근거로 삼지 않았다. |
| [WCAG 2.2 SC 2.3.3 해설](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) | 비필수 상호작용 모션을 줄이거나 끌 수 있도록 OS/앱 감소 설정 연결 | 2.3.3은 AAA 항목이다. 이번 항목 적용을 앱 전체 WCAG 준수로 승격하지 않는다. |
| [WAI-ARIA APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | 기존 Tab/Escape·배경 inert·초점 복귀 유지. 닫힘 효과 중에도 의미상 창은 즉시 닫힌다. | APG는 구현 지침이며 물리 VoiceOver/OS IME 검증을 대신하지 않는다. |
| [Motion 접근성](https://motion.dev/docs/react-accessibility), [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate) | 기존 Motion shared-layout, CSS/WAAPI와 효과 정리 재사용. 새 대형 런타임/유료 패키지 없음 | WAAPI 미지원 시 즉시 정상 화면. 라이브러리 설치 자체는 UX 개선의 증거가 아니다. |

## 실제 연결

- **버튼:** 기존 common Button/IconButton와 같은 `.ui-button`을 쓰는 직접 버튼.70ms 눌림·120ms 복귀, 기존 상태색/명시적 초점/최소 조작 크기 유지. 탭은 글자 확대 없이1px 눌림만. 비활성/저장 중 버튼은 장식으로 다시 활성화하지 않는다.
- **대화창·시트:** 공통 Modal/Sheet.240ms 진입,110ms 퇴장. 표준 창은16px 이동/0.98 배율, 시트는32px 수직 이동. 실제 원문을 복사한 두 번째 편집기를 만들지 않는다. 호출자가 선택한 창을 비워도 퇴장 중 제목·본문은 마지막 열린 표시를 유지한다.110ms 뒤 해제하고 재열면 이전 해제 타이머를 취소한다. Sheet는 공통 API 지원이며 현재 공개 앱에 별도 신규 시트 과업을 추가한 것은 아니다.
- **목차 관리 메뉴:** 기존 ContextMenu.180ms 진입·110ms 퇴장. 변형 전 레이아웃 크기로 화면 가장자리 위치를 계산한다. 방향키/Home/End/Escape와 터치 밖 누르기를 유지한다.
- **탭·분할 선택·내비게이션:** 기존 선택 배경 shared-layout을 SegmentedControl 및 실제 NavigationBar에도 연결한다. `aria-current`, `aria-selected`, `aria-pressed`, 링크 주소·키보드·수정키 클릭을 유지한다.
- **화면 이동:** `useRoute`의 실제 hash 이동/브라우저 뒤로가기와 로딩 완료·기존 초점/스크롤 복원 뒤에 현재 DOM을240ms 페이드한다. 관계가 명확한 목록/상세만 제목에±16px 방향을 부여한다. 메인 본문 좌표는 움직이지 않는다. 처음 열기·새로고침·원문 입력·일반 데이터 갱신마다 진입을 반복하지 않는다. 동시에 움직이는 모든 행에 개별 모션을 추가하지 않아 누적 자료 수에 따라 작업량이 증가하지 않는다.

값 원본은 `observatory-experience-baseline.json`의 `motion.interaction`과 기존 `motion`이다. CSS 토큰은 `tokens.css`, 소비는 `motion.css`, `interaction-motion.ts`, 공통 `index.tsx`, `context-menu.tsx`, `navigation-bar.tsx`, `navigation-context.ts`다. 수치는 이번 제품에서 관련 환경을 확인해 채택한 기본값이며 보편적인 최적 법칙이 아니다.

## 중단·복귀·감소 동작

닫는 순간 닫힌 overlay/menu는 `inert`, `aria-hidden`, pointer-events:none이 된다. 초점 트랩·body scroll 잠금·배경 inert는 기존 open 계약에 따라 즉시 해제한다. 장식 퇴장은 완료를 기다리는 사용자 작업이 아니다. 반복 재열기에서 이전 타이머가 새 창을 지우지 않으며 원문/커서 소유자는 유지한다.

빠른 경로 이동·원문 입력·포인터/키보드·스크롤·숨김 탭에서는 이번 경로의 애니메이션만 취소한다. 로딩 중 다른 이동을 선택하면 현재 목적지의 정상 복원이 우선한다. 새 `data-motion` 또는 OS reduced-motion 변경도 진행 중 효과를 취소한다. 기존 사용자별 설정 키를 재사용하며 원장·서버 저장 계약은 바꾸지 않는다.

## 확인과 공개 근거

정본 로그와 실제 배포/공개 확인은 `work/ux-motion-20261003/`에 둔다. 로컬 6파일60단위 검사로 기본 키보드/트랩/초점·재열기/타이머 취소·닫는 중 표시 보존·모션 감소·경로 분류/효과 취소를 확인했다. 실제 다섯 WebKit 환경의25검사(실패·건너뜀·재시도0)가 통과했다. 창 열기/닫기/긴 초안/즉시 초점 복귀/재접속, 버튼 눌림·목차 관리 메뉴, 상세/뒤로가기/연속 이동, OS 감소와 기존 지연 모듈 실패 복구를 확인했다. CI는 기존 필수 전체 단위·프론트/백엔드 번들·동일 빌드의5환경 확인 후 게시한다.

최초 검사에서 메모 입력 전 주제 선택과 목차 관리 전 주제 상세 진입을 빠뜨린 하네스 실패·중단은 해당 로그를 보존한다. 통과로 덮어쓰지 않는다. 최종 결과는 같은 폴더의 배포 검증 JSON 및 최신 인계를 따른다. 실제 공개 화면의 조작, CI/산출물, 물리 기기/IME/VoiceOver·서버Sync·장기/학습 효과는 각각 별도 근거이며 후자는 이번 작업에서 확인하지 않는다.

2026-10-03 통합CI37106291600의전체검사에서수식2개(닫힌창의라벨입력까지조회)와목차2개(새ID에이전DOM스크롤잔류)가실패해게시를차단했다. 수식검사는현재조작가능한textbox로조회하고,목차는기존modal-context의무효힌트분기에서잔류스크롤도초기화한다. 후자는공유작업본의동일수정을재사용했으며정상초안의커서/스크롤복구는유지한다. 로컬기본5초검사의시간초과도로그로보존하고필수CI와같은60초제한으로재확인한다. 전체실패를단순재시도로지우거나닫힘시간을기다리는사용자지연을추가하지않는다.
