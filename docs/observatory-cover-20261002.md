# 천문대 전체 폭 상단 커버와 각 자리의 움직임

2026-10-02 사용자 「각 방위…창문 풍경처럼 고급기술」 및 「위쪽 상단을 다 차지…노션 배경처럼」의 실제 앱 변경이다. `App`의 첫 행에서 사이드바와 작업면 전체 폭에 `ObservatoryCover`를 놓고, 자리 이동과 공부 화면은 그 아래에 둔다. 기존 정면 풍경은 홈뿐 아니라 정면으로 분류된 과업에서도 재사용한다. 다른 네 방향은 같은 커버에서 교체된다. 새로운 결과이며 [이전 정적 위젯 기록](observatory-place-widgets-20261002.md)의 검증 시점을 그대로 보존한다.

## 재사용 기준과 기술

[천문대 확정 기준](observatory-design-standard.md), 기준 JSON `spatialWorkspace.cover`, 기존 실내·종이 재료와 180ms 전환을 적용했다. 원본 SVG 비율·viewBox·바깥 창틀·책상 전체를 유지하며 장식용 cover crop이나 고정 높이로 자르지 않는다. 커버는 스크롤에 따라 지나가고 실제 공부 면은 기존 위치·편집·복귀 소유자를 유지한다.

- 기존 `connectObservatoryPointer`의 900ms 대기·3.5초 접근·감쇠 패닝·확대 유지와 `observatoryLOD`를 재사용한다. SVG 선택자와 카메라 y 기준만 옵션으로 확장하고 이름 있는 ‘가까이 보기 / 전체 보기’를 연결했다. outer SVG는 고정하고 내부 그룹만 변환한다. 포인터를 옮겼다는 이유로 즉시 축소하지 않는다. 탐색 카메라는 일시 상태다.
- 뒤·중간·앞의 세 깊이 그룹이 패닝에 서로 다른 비율로 움직이며 근거리에서 제본선·종이 섬유·유리 눈금·금속 이음새가 나타난다. 확대 후 감쇠 프레임의 pan 좌표도 기존 이벤트에 전달하여 SVG/GPU 정렬을 유지한다. 원점0을 유효 좌표로 보존한다.
- 책장은 책등의 빛과 종이 끝, 작업대는 진자·바늘·찻잔 김과 유리 굴절광, 벽은 핀·연결선 빛과 종이, 천장은 투영된 황동 링·유리 반사가 움직인다. 실제 기록 이름·날짜·점수처럼 보이는 가짜 자료를 그리지 않는다.
- GPU 지역 조명과 curl 입자는 각 실제 광원 좌표에 고정한다. 그림 전체를 다시 그리는 두 번째 하늘을 만들지 않는다. [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)의 자원 해제·그리기 묶음·해상도 예산을 적용한다. 실제 WebGL2는 프로그램2개/정적버퍼2개/최대192입자/프레임2draw/최대30Hz이며, 지속 지연 시 공유 예산에 따라 너비400px이하로 줄였다가 복귀한다. 일반 상한은960px이다. DOM 아트는 최대207노드로 자료량과 무관하다.
- [WCAG Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)를 동작 감소의 참고 기준으로 사용했다. OS/앱 동작 감소, 사용자 정지, 접힘, 화면 밖, 숨긴 탭에서 반복 애니메이션을 멈춘다. GPU 미지원/컨텍스트 손실에서는 원본 SVG와 이름 있는 실제 기능이 남고, 복구 후 직전 정지 선택과 시간을 유지한다. 전체 WCAG 인증·실제 기기 성능 검증을 뜻하지 않는다.

## 공부 기록·시간과 연결

`RoomCover → buildStudyLandscape → world.response`가 정면 하늘과 같은 사용자·공간·선택 과목의 정규 기록 필터와 계산을 소비한다. `activity`, `density`, `earlyGlimmer`, `evolution.position / 11`을 움직임 주기/입자/빛/근거리 선명도에 연속 전달한다. 0→1→2개의 정규 입력이 DOM/CSS/GPU 갱신에 실제로 대응하며 렌더 연결을 재생성하지 않는다. 수면이나 새 생활점수·숙달률을 추정하지 않는다. 시간은 기존 KST 여섯 시간대와 경계 혼합의 `nightLight`를 사용하고 분 경계/다시 열린 탭에서 갱신한다.

## 연결 중 재현한 시선 이동 문제

실제 WebKit에서 작업대의 수식 도구가 늦게 초기화되면서 `canvas.cursor_hit.focus()`로 상단에서 아래로 이동하는 문제를 확인했다. `preventFocus:true`가 있어도 직접 `setPerspective`를 호출한 초기 화면 배치는 초점을 가져왔다. 처음에는 인접한 `setMode` 호출로 잘못 특정했으나 실제 스택의 정확한 열과 focus/inert 관측으로 정정했다. [GeoGebra App Parameters](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/)와 [API](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/), [HTML inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)를 확인하고 초기 화면 배치/도구 지정의 동기 호출 동안 해당 그래프 host만 `inert`로 보호하고 즉시 이전 값을 복구한다. 이미 그래프 안에 초점을 둔 사용자 조작은 유지한다. 인위적으로 화면을 다시 스크롤하는 방식 없이 현재 입력/풍경 탐색을 보존한다. 진단 `run-tNAPlT`/`run-BkWpux` 및 보수 중 실패는 실제 통과와 구별하여 보존한다.

## 보존과 반복 사용

기존 접기 키 `storagePrefix:view:observatory-room:encodedUserId:v1`을 유지하고 그 뒤 `:paused`에 정지 선택을 보존한다. 다른 탭의 동일 설정 변경도 반영한다. 저장 실패 시 현재 화면에 적용한 사실과 기기 저장 실패를 구별한다. 방향 변경은 그림/GPU만 정리·교체하며 본문 초안과 원장은 수정하지 않는다. 정면 풍경의 기존 개인 선택도 유지한다. 기능 링크는 실제 경로이며 천장을 닫을 때의 원래 과업 복귀도 기존 이력을 사용한다.

## 확인

- 연결·카메라·GPU·정규입력·장소/복귀의 6파일25단위 검사 통과. GPU 단위는 모의 GL, 실제 인앱에서는 `webgl2` 컴파일·960×260·2draw 및 화면 표시를 따로 확인했다.
- 실제 상단 커버가 x0/y0부터 1280px 전체 폭인 그림, 확대2배/근거리 LOD와 1375px 너비의 다른 장면을 `work/observatory-cover-20261002/`에 저장한다.
- WebKit 다섯 프로필에서 최종 관련 35흐름 통과/실패·생략·재시도 통과0: `run-jc0VRG`의 커버·원본 창문·방향·접기/정지 재접속·동작 감소/GPU 미지원·원장 보존·자료 복귀30개, `run-Vz0HiZ`/`run-S9abdp`의 수식 native 회전·핀치·2D 팬·수식/t·재접속5개. 실제 초점 회귀가 수정된 뒤의 결과이다. 이전 실패/중단 run은 통과로 합산하지 않는다. [최종 검증 JSON](../work/observatory-cover-20261002/verification.json)에 실행·소스 해시·화면 근거를 남겼다.
- 수학 테스트의 이전 summary 문구 네 곳을 실제 화면의 ‘수식·슬라이더 범위 편집’에 맞췄다. 기대값/동작을 완화하지 않았다. 기존 창문의 모든 레이어를 접은 뒤에도 설정 메뉴가 커버 밖에 보이고 기본 풍경으로 복귀하는 실제 조작을 확인했다.

이번은 로컬 코드·화면의 구현이다. 공개 배포·운영서버·Figma 추가 편집·물리 iPhone/iPad 확인과 장기 학습 효과는 포함하지 않는다. 병행 구현을 보존했다. 공유 CSS의 미정의 `--focus-outline-width` 한 곳은 기존 `--focus-width`로 교정하여 개발 서버의 필수 디자인 검사 실패를 해소했다.
