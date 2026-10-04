# 현재 엔터티 전체의 등록 레이아웃 지정

2026-10-02 정식 목표. 기능 정의/현재 소스 참조에 연결했다. 전체 실제 화면 준수/렌더/저장 검증과는 구별한다.

| ID | 실제 기능명 | 범위/프로필 | 대표 패턴 | 보조면 외곽 |
| --- | --- | --- | --- | --- |
| R01 | 오늘 | screen / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| R02 | 통계 | screen / P06 | L195 · Data View–Record Detail — 여러 표현과 원기록 | 상위 공통 외곽 |
| R03 | 일정·과제 | screen / P09 | L197 · Schedule–Agenda Detail — 시간표와 선택 과업 | 상위 공통 외곽 |
| R04 | 과목 | screen / P02 | L037 · Card Grid Layout | 상위 공통 외곽 |
| R05 | 기록 | screen / P01 | L053 · Form Layout | 상위 공통 외곽 |
| R06 | 메모 | screen / P03 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R07 | 강의 자료 | screen / P03 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R08 | 코딩 연습 | screen / P05 | L082 · IDE Layout | 상위 공통 외곽 |
| R09 | 수식 탐색 | screen / P05 | L194 · Parameter–Visualization–Evidence — 조절·관찰·근거 | 상위 공통 외곽 |
| R10 | 시험 연습 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R11 | 암기시험 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R12 | 자료 카드 | screen / P02 | L037 · Card Grid Layout | 상위 공통 외곽 |
| R13 | 개념 전집 | screen / P02 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R14 | 주제 카드 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R15 | Canvas | screen / P07 | L062 · Canvas Layout | 상위 공통 외곽 |
| R16 | 그래프뷰 | screen / P07 | L196 · Graph–Detail Workspace — 관계 지도와 원문 | 상위 공통 외곽 |
| R17 | 칸반보드 | screen / P08 | L049 · Kanban Layout | 상위 공통 외곽 |
| R18 | 찾기 | screen / P02 | L055 · Search–Results Layout | 상위 공통 외곽 |
| R19 | 과목 상세 | screen / P02 | L189 · Tree–Detail Workspace — 계층 색인과 상세 | 상위 공통 외곽 |
| R20 | 단원·주제 상세 | screen / P01 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R21 | 선택 주제 기록 | screen / P01 | L053 · Form Layout | 상위 공통 외곽 |
| R22 | 메모 상세 | screen / P03 | L190 · Document–Annotation Workspace — 원자료와 기록지 | 상위 공통 외곽 |
| R23 | 자료 상세·새 자료 | screen / P03 | L190 · Document–Annotation Workspace — 원자료와 기록지 | 상위 공통 외곽 |
| R24 | 강의 자료 휴지통 | screen / P10 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R25 | 코드 예제 상세 | screen / P05 | L082 · IDE Layout | 상위 공통 외곽 |
| R26 | 주제 지정 시험 연습 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R27 | 주제 지정 암기시험 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R28 | 암기시험 결과 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R29 | 예약 복습 | screen / P04 | L193 · Question–Response–Explanation — 질문·내 답·설명 공개 | 상위 공통 외곽 |
| R30 | 자유 기록 목록·기본 글 | screen / P03 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R31 | 새 자유 기록 | screen / P03 | L025 · Single-column Layout | 상위 공통 외곽 |
| R32 | 자유 기록 상세 | screen / P03 | L025 · Single-column Layout | 상위 공통 외곽 |
| R33 | 전체 백업·복구 | screen / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| R34 | 휴지통 | screen / P10 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R35 | 초안 보관본 | screen / P10 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| R36 | 내 생각 | screen / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| R37 | 도움말·문제 메모 | screen / P10 | L081 · Documentation Layout | 상위 공통 외곽 |
| R38 | 소개 | screen / P10 | L040 · Magazine / Editorial Layout | 상위 공통 외곽 |
| R39 | 기존 구독 링크 | screen / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| R40 | 기존 계정 링크 | screen / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| R41 | 찾을 수 없는 항목 | screen / P02 | L025 · Single-column Layout | 상위 공통 외곽 |
| O01 | 학기 추가 | overlay / P02 | L053 · Form Layout | L170 |
| O02 | 과목 추가 | overlay / P02 | L053 · Form Layout | L170 |
| O03 | 목차 추가 | overlay / P02 | L053 · Form Layout | L170 |
| O04 | 여러 목차 추가 | overlay / P02 | L053 · Form Layout | L170 |
| O05 | 휴지통으로 옮길까요? | overlay / P10 | L053 · Form Layout | L170 |
| O06 | 이름 수정 | overlay / P02 | L053 · Form Layout | L170 |
| O07 | 목차 위치 옮기기 | overlay / P02 | L053 · Form Layout | L170 |
| O08 | 가입 계정 관리 | overlay / P10 | L053 · Form Layout | L170 |
| O09 | 내 계정 | overlay / P10 | L053 · Form Layout | L170 |
| O10 | 다음에 펼칠 곳을 남겨둘까요? | overlay / P01 | L053 · Form Layout | L170 |
| O11 | 공부 기준 조정 | overlay / P01 | L053 · Form Layout | L170 |
| O12 | 이어가기 설정 복구 | overlay / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | L170 |
| O13 | 시험·과제·강의 일정 | overlay / P09 | L053 · Form Layout | L170 |
| O14 | 수식 탐색 전체 화면 | overlay / P05 | L194 · Parameter–Visualization–Evidence — 조절·관찰·근거 | L061 |
| O15 | 움직임 위젯 | overlay / P10 | L048 · Widget Layout | L170 |
| O16 | 다음에 확인할 내용 | overlay / P09 | L053 · Form Layout | L170 |
| O17 | 학기 기간 | overlay / P09 | L053 · Form Layout | L170 |
| O18 | 지금 확인한 결과 | overlay / P04 | L053 · Form Layout | L170 |
| O19 | 공부할 목차 만들기 | overlay / P02 | L053 · Form Layout | L170 |
| O20 | 답안에서 수행 결과 남기기 | overlay / P04 | L053 · Form Layout | L170 |
| O21 | 내 기록의 저장 상태 | overlay / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | L170 |
| O22 | 사진으로 목차·내용 가져오기 | overlay / P02 | L053 · Form Layout | L170 |
| O23 | 메모를 휴지통으로 옮길까요? | overlay / P03 | L053 · Form Layout | L170 |
| O24 | 작은 메모 | overlay / P03 | L053 · Form Layout | L170 |
| O25 | 강의 주차 만들기 | overlay / P09 | L053 · Form Layout | L170 |
| O26 | 통계의 원기록 | overlay / P06 | L043 · List Layout | L170 |
| O27 | 카드 추가·편집 | overlay / P08 | L053 · Form Layout | L170 |
| O28 | 보드 열 | overlay / P08 | L053 · Form Layout | L170 |
| O29 | 이 주제부터 해볼까요? | overlay / P01 | L053 · Form Layout | L170 |
| U01 | 앱 내비게이션·범위·테마 | surface / P10 | L064 · Top Navigation Layout | 상위 공통 외곽 |
| U02 | 개인 공간 진입·인증 | surface / P10 | L053 · Form Layout | 상위 공통 외곽 |
| U03 | 로그인·가입 | surface / P10 | L053 · Form Layout | 상위 공통 외곽 |
| U04 | 가입 승인 대기·제한 | surface / P10 | L025 · Single-column Layout | 상위 공통 외곽 |
| U05 | 내 계정·탈퇴 | surface / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U06 | 가입 계정 관리 | surface / P10 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| U07 | 내 기록의 저장 상태 | surface / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U08 | 전체 복구 진입 | surface / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U09 | 이어가기와 다음 위치 | surface / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| U10 | 읽기 폭·이어가기 복구 | surface / P10 | L053 · Form Layout | 상위 공통 외곽 |
| U11 | 천문대 원본 위젯 | surface / P01 | L048 · Widget Layout | 상위 공통 외곽 |
| U12 | 천문대 세부 렌더러 | surface / P01 | L048 · Widget Layout | 상위 공통 외곽 |
| U13 | 작은 도구와 시계 | surface / P01 | L048 · Widget Layout | 상위 공통 외곽 |
| U14 | 오늘·한 주 공부 | surface / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| U15 | 공부 시작 제안 | surface / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| U16 | 목차와 항목 관리 | surface / P02 | L189 · Tree–Detail Workspace — 계층 색인과 상세 | 상위 공통 외곽 |
| U17 | 표·사진 목차 만들기 | surface / P02 | L053 · Form Layout | 상위 공통 외곽 |
| U18 | 학기·강의 주차 | surface / P09 | L197 · Schedule–Agenda Detail — 시간표와 선택 과업 | 상위 공통 외곽 |
| U19 | 공부 기준·TRACE | surface / P01 | L053 · Form Layout | 상위 공통 외곽 |
| U20 | 답안에서 수행 결과 | surface / P04 | L053 · Form Layout | 상위 공통 외곽 |
| U21 | 일정 편집 | surface / P09 | L053 · Form Layout | 상위 공통 외곽 |
| U22 | 다음 공부 기준·결과 | surface / P09 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U23 | 자료 출처·PDF 구간 | surface / P03 | L190 · Document–Annotation Workspace — 원자료와 기록지 | 상위 공통 외곽 |
| U24 | 자료 퀴즈·관계·대화 | surface / P03 | L190 · Document–Annotation Workspace — 원자료와 기록지 | 상위 공통 외곽 |
| U25 | 카드·코드 주제 연결 | surface / P02 | L045 · Master–Detail Layout | 상위 공통 외곽 |
| U26 | 덱·카드·Anki 가져오기 | surface / P04 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U27 | 복습 설정·최적화 | surface / P04 | L053 · Form Layout | 상위 공통 외곽 |
| U28 | 암기 항목 생성 | surface / P04 | L053 · Form Layout | 상위 공통 외곽 |
| U29 | 펜·OCR·PDF 배경 | surface / P03 | L190 · Document–Annotation Workspace — 원자료와 기록지 | 상위 공통 외곽 |
| U30 | 코드 편집·구문·터미널 | surface / P05 | L082 · IDE Layout | 상위 공통 외곽 |
| U31 | 수식·그래프·카메라 | surface / P05 | L194 · Parameter–Visualization–Evidence — 조절·관찰·근거 | 상위 공통 외곽 |
| U32 | 수식 유형·전체 화면 | surface / P05 | L194 · Parameter–Visualization–Evidence — 조절·관찰·근거 | 상위 공통 외곽 |
| U33 | 급수·개념 도해 | surface / P05 | L194 · Parameter–Visualization–Evidence — 조절·관찰·근거 | 상위 공통 외곽 |
| U34 | Canvas 편집·이관 | surface / P07 | L062 · Canvas Layout | 상위 공통 외곽 |
| U35 | Canvas·그래프 보기 | surface / P07 | L196 · Graph–Detail Workspace — 관계 지도와 원문 | 상위 공통 외곽 |
| U36 | 통계 여러 그래프·값 | surface / P06 | L195 · Data View–Record Detail — 여러 표현과 원기록 | 상위 공통 외곽 |
| U37 | GPT 연결·문맥·사용량 | surface / P10 | L198 · Settings–Operation–Recovery — 변경·실행·복구 | 상위 공통 외곽 |
| U38 | 움직임 위젯 | surface / P10 | L048 · Widget Layout | 상위 공통 외곽 |
| U39 | 브랜드·관련 생각 | surface / P01 | L025 · Single-column Layout | 상위 공통 외곽 |
| U40 | 공통 부품·오류·포커스 | surface / P10 | L025 · Single-column Layout | 상위 공통 외곽 |
| U41 | 장문 원문·기록 수정 | surface / P03 | L025 · Single-column Layout | 상위 공통 외곽 |
