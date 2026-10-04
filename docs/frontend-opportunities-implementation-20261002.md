# 천문대 OS 프론트엔드 A01–A10 구현 기록

2026-10-03 공개 상태 갱신: 이후 병행 통합 공개본15feb283에 A01–A10이 포함되었음을 핵심 소스14개 byte 동일·공개16흐름·공개자산134개 일치로 확인했다. [공개 반영 확인과 후속 배포 경계](frontend-opportunities-pages-20261003.md)를 따른다. 아래의 이 대화 배포 미수행 기록은 당시 작업 결과이며, 이후 다른 작업의 공개 결과와 구별한다.

기준일: 2026-10-02. 사용자 승인: [추가 개발 검토](frontend-opportunities-20261002.md)의 후보 A01–A10 모두 적용. 이 문서는 승인 후 실제 코드·통합 검사·정적 대응 결과를 기록한다. 검토 문서의 ‘추가할 기능’과 ‘미구현’ 설명은 당시 판단으로 보존하며, 현재 구현 여부는 이 문서를 따른다.

**A01–A10을 기존 웹앱의 실제 호출 경로에 연결했고, 해당 통합 시점의 WebKit 다섯 모사 환경 검사 50개가 통과했다. 이후 병행된 장소·천장 풍경 변경까지 포함한 최신 타입 검사·빌드와 관련 브라우저 검사 15개도 통과했다.** 두 브라우저 실행은 시점과 범위가 다르며 합산하지 않는다. 원문·ID·초안·이력·개인 설정/배치·통계 분모·날짜 미정·학습 의미를 보존한다. 구현과 로컬 확인은 공개 배포·운영 서버 적용·물리 기기 검증·학습 효과의 증거로 확대하지 않는다. Figma 원격 대응은 아래 별도 상태를 따른다.

## A01–A10 전수 대조

| ID | 실제 구현과 사용 동선 | 담당 소스 |
| --- | --- | --- |
| A01 | 강의 자료의 **곁 도구 펼치기**에서 메모·수식 탐색·코딩 연습·공부 기록을 같은 자료 옆에 연다. 자료 폭 조절, 두 면 함께/자료만 크게/도구만 크게, 접기, 기본 폭 복귀를 제공한다. 좁은 작업면은 자료 보기/도구 보기로 전환한다. 곁 코딩 예제 선택은 전역 경로를 바꾸지 않고 자료 옆에서 열린다. | [App.tsx](../src/App.tsx), [study-workspace.tsx](../src/ui/study-workspace.tsx), [study-workspace.css](../src/ui/study-workspace.css), [code-practice.tsx](../src/ui/code-practice.tsx) |
| A02 | **빠른 명령** 버튼 또는 ⌘/Ctrl+Shift+K로 현재 과업의 명령을 찾는다. 메뉴 이동, 현재 주제로 기록, 자료 곁 도구 열기, 이전 공부 화면 복귀를 기존 동작에 연결한다. 대상이 없으면 이유와 비활성 상태를 표시한다. 입력기·코드 편집기·대화상자 안의 단축키와 한글 조합을 가로채지 않는다. | [workspace-commands.tsx](../src/ui/workspace-commands.tsx), [App.tsx](../src/App.tsx), [observatory-navigation.tsx](../src/ui/observatory-navigation.tsx) |
| A03 | 검색 결과에 **실제 원문 발췌·일치 부분·일치 이유**, 자료 종류 필터, 제목 전체 일치→제목 포함→본문 포함 순 정렬을 제공한다. 같은 등급은 원래 자료 순서를 유지하며 원래 목록 순으로도 바꿀 수 있다. 기존 과목 범위와 모든 범위 선택을 유지한다. | [domain/workspace-search.ts](../src/domain/workspace-search.ts), [ui/workspace-search.tsx](../src/ui/workspace-search.tsx), [workspace-search.css](../src/ui/workspace-search.css) |
| A04 | 통계의 **같은 기록을 여러 그래프에서 보기**에서 정확한 날짜 구간·과목을 선택하거나, 값 목록/원기록에서 **함께 선택**한다. 여러 차트의 강조와 값 목록·선택한 원기록에 같은 근거 집합을 전달한다. 전체 집계·분모를 바꾸는 필터와 구별하고 선택 수/전체 수·0개 선택·선택 해제를 표시한다. | [statistics-selection.ts](../src/ui/statistics-selection.ts), [statistics.tsx](../src/ui/statistics.tsx), [statistics-gallery.tsx](../src/ui/statistics-gallery.tsx), [statistics-plot.tsx](../src/ui/statistics-plot.tsx) |
| A05 | **반응 속도 확인**에서 입력→표시 기회, 검색→결과 표시, 이력 펼치기→표시, 화면 이동→표시를 구별해 본다. 기존 저장/불러오기 요청 측정도 별도 구역에서 확인한다. 측정값 새로고침·JSON 내보내기·비우기를 제공한다. | [ui-performance.ts](../src/data/ui-performance.ts), [ui-performance-panel.tsx](../src/ui/ui-performance-panel.tsx), [ui-performance-access.tsx](../src/ui/ui-performance-access.tsx), [use-route-performance.ts](../src/ui/use-route-performance.ts) |
| A06 | 주제별 공부 기록, 주제 복습의 자기 평가 기록·이전 메모를 **40개부터 표시**하고 40개씩 더 보거나 모두 펼칠 수 있다. 펼친 수·접힘 상태를 기존 보기 보존 경로에 연결한다. 원본 전체·검색·백업을 삭제하거나 잘라 저장하지 않는다. | [progressive-history.tsx](../src/ui/progressive-history.tsx), [App.tsx](../src/App.tsx), [topic-recall.tsx](../src/ui/topic-recall.tsx), [use-view-context.ts](../src/ui/use-view-context.ts) |
| A07 | 검색용 Web Worker에 변경/추가 항목·삭제 키·순서만 전달하는 색인 갱신을 연결했다. 계정/공간·색인 revision·요청 번호가 맞는 응답만 표시한다. Worker 생성/전송/응답 실패 또는 응답 대기 10초 초과 시 로컬 검색 경로로 전환하며, 해당 검색 클라이언트 종료 때 Worker·색인을 폐기한다. | [workspace-search-client.ts](../src/data/workspace-search-client.ts), [workspace-search-engine.ts](../src/data/workspace-search-engine.ts), [workspace-search.worker.ts](../src/data/workspace-search.worker.ts), [workspace-search.tsx](../src/ui/workspace-search.tsx) |
| A08 | **작업 구성**에서 현재 경로·곁 도구·폭·표시 면·선택 코드 예제를 이름 붙여 보관하고, 이름 변경·열기·구성 삭제·삭제 되돌리기를 제공한다. 원문을 복제하는 묶음이 아니라 기존 자료와 도구의 참조/배치 설정이다. 없어진 대상은 휴지통 복원 경로로 안내한다. | [data/study-workspace.ts](../src/data/study-workspace.ts), [ui/study-workspace.tsx](../src/ui/study-workspace.tsx), [observatory-navigation.tsx](../src/ui/observatory-navigation.tsx) |
| A09 | 기존 네 장소와 실제 출발지/복귀 경로를 유지하고 **현재 장소 표시에 짧은 방향 전환**을 적용한다. 기존 모션 허용 설정을 소비하며 감소/정지 조건에서는 즉시 표시한다. 본문 편집기와 개인 Canvas를 이동·복제·재배치하지 않는다. 이후 병행 작업의 공통 기능 ‘천장 조명’과 펼치고 접는 장소 풍경도 최신 스냅샷에 포함한다. | [observatory-navigation.tsx](../src/ui/observatory-navigation.tsx), [motion.tsx](../src/ui/motion.tsx), [navigation-context.ts](../src/ui/navigation-context.ts), [observatory-place-scene.tsx](../src/ui/observatory-place-scene.tsx), [observatory-place-art.tsx](../src/ui/observatory-place-art.tsx) |
| A10 | 수식 탐색에서 **현재 조건을 A로 고정**한 뒤 기존 수식·매개값·위치를 바꾸면 B에 반영된다. A 점선/B 실선, 같은 축·배율, 입력/좌표 표, xy/xz/yz 정사영, 확대/축소/이동/전체 맞춤을 제공한다. 기존 계산의 A 표본과 현재 B 결과를 SVG에 그려 두 번째 GPU 장면을 만들지 않는다. | [math-comparison.tsx](../src/ui/math-comparison.tsx), [math-comparison-model.ts](../src/ui/math-comparison-model.ts), [math-comparison.ts](../src/data/math-comparison.ts), [math-explorer.tsx](../src/ui/math-explorer.tsx), [domain/math-explorer.ts](../src/domain/math-explorer.ts) |

## 기본값과 반복 사용

작업면 기본값은 곁 도구 닫힘, 메모 선택, 자료 폭 **52%**, 좁은 화면의 자료 면 선택이다. 폭 조절 범위는 **30–70%**이며, 작업면 **컨테이너 폭 760px 이하**에서 한 면씩 표시한다. 기기 모델이나 브라우저 창 전체 폭을 고정 기준으로 삼지 않는다. 좁은 화면으로 바뀌어도 사용자의 저장 폭을 덮어쓰지 않으며 ‘기본 폭’은 사용자가 직접 복원한다. 이름 있는 작업은 사용자가 보관할 때만 생성한다.

원자료와 메모·기록·코드 편집기는 접기와 도구 전환 때 기존 인스턴스를 유지한다. 전체 편집기를 React Activity로 숨겨 effect를 정리하던 초기 구성은 실제 비동기 수명과 맞지 않아 보완했다. **Activity는 자유 수식의 Plot/GeoGebra 렌더러에만 적용**한다. 수식의 미확정 매개값 입력·오류·메모·A/B 비교는 그 바깥에서 유지한다. GeoGebra는 정리 전에 XML을 보관하고, Plotly는 시점/범위 참조를 유지한 채 그래프를 해제·복원한다. 별도 유형별 수식·개념 화면 전체에 새 Activity 정책을 적용했다고 보고하지 않는다.

곁 코드의 비활성화는 실행만 취소한다. 편집기 effect·자동 저장·실행 결과 정리 경로를 통째로 해제하지 않으므로 복귀 후 입력·저장 상태를 이어간다. 코드의 현재 예제 ID는 작업 구성에 함께 보관한다. 단독 코딩 화면의 기존 경로 이동은 유지한다.

통계 공유 선택은 현재 통계 화면 동안 유지하며 화면을 나가면 해제된다. 날짜 구간 선택은 정확한 날짜만 포함하고, 기간으로만 알려진 날짜와 날짜 미정 기록은 원기록에서 직접 선택할 수 있다. 선택은 근거가 들어 있는 행을 강조하며 집계된 점 전체를 선택 근거만의 새 수치로 바꾸지 않는다. Plotly의 선택 스타일 변경은 기존 장면을 purge하지 않고 동일한 `uirevision`으로 갱신하여 확대·범례 상태를 유지한다. 모든 그래프에 동일한 드래그 선택을 강제하지 않으며 값 목록의 키보드 버튼을 함께 제공한다.

A 조건은 소유자별 별도 sessionStorage 키로 **같은 탭에서 복귀·새로고침할 때** 이어진다. 기존 수식 초안·메모·저장 장면과 분리되며, 탭 종료 후 영구 비교 자료나 기기 간 동기화로 보장하지 않는다. 읽지 못한 비교 원문은 명시적 초기화 전 덮어쓰지 않는다. 저장 실패 때 현재 A를 화면에 유지하고 탭 보관 실패를 알리며, 비교 종료의 삭제 실패 때도 A를 유지한다. 함수와 공간 곡선은 축의 의미가 달라 서로 겹치지 않는다. 현재 자유 수식에 물리 단위 필드가 없으므로 **단위 미지정**을 표시하고 없는 단위를 만들지 않는다. 표본 사이의 선은 근사이며 null/단절 구간은 잇지 않는다.

## 저장·계정·동시 작업

작업 구성은 `${storagePrefix(data)}:study-workspace:v1`에 보관한다. 계정/namespace별로 분리하며, 경로·도구·폭·표시 면·코드 예제 참조·구성 이름만 담는다. 본문·답변·메모 원문·학습 기록은 각 기존 저장소가 담당한다.

같은 키의 읽은 원문과 교체 쓰기를 **Web Locks의 동일 origin 잠금 안에서 함께 수행**한다. 협력하는 앱 탭끼리 비교 후 교체가 분리되지 않으며, 다른 창의 값이 먼저 바뀌면 `WORKSPACE_CHANGED`로 거부하고 현재 창의 미저장 구성을 유지한다. ‘다시 읽기’는 저장된 새 구성을 불러오고, 저장소 용량 등 쓰기 실패에는 ‘저장 다시 시도’를 제공한다. 읽기/형식 검사 실패 시 기존 raw를 자동 덮어쓰지 않는다. Web Locks가 없으면 안전한 보관이 불가능함을 알리고 현재 구성만 창에 유지한다. 이 잠금은 서버 권한·기기 간 충돌 해결의 근거가 아니다.

검색은 기존 소유권·삭제·자료 범위에서 만든 항목만 사용한다. 정규화는 검색 판단에 사용하고, 발췌와 강조는 원문으로 대응한다. 계정 전환 때 이전 Worker를 종료하고 새 클라이언트를 만들며, 이전 계정/자료 revision/요청의 결과를 표시하지 않는다. Worker로 보내는 것은 로컬 브라우저 스레드 사이의 자료이며 새 외부 전송 경로는 만들지 않는다.

## 기준과 도구의 실제 적용

기존 [천문대 디자인 기준](observatory-design-standard.md), [최우선 디자인·UI·UX 지침](design-ui-ux-priority.md), [수학 인터랙티브 기준](../../docs/수학%20인터랙티브%20설계·검증%20기준.md), [작업 진행·검증 정책](../../docs/작업%20진행과%20검증%20정책.md)의 관련 범위를 재사용했다. 검토 단계의 공식 출처와 후보 비교는 [추가 개발 검토](frontend-opportunities-20261002.md)에 보존한다.

- 패널은 기존 공통 버튼/Select와 네이티브 range, CSS Grid/Container Queries로 구현했다. 검토한 패널·가상 목록 라이브러리를 설치하는 것으로 구현을 대신하지 않았다.
- 이번 A09의 Motion은 현재 장소 표시를 대상으로 기존 감소 모션 설정과 연결했다. 이후 병행된 장소 풍경의 짧은 전환도 최신 소스에 포함하며, 편집기 전체의 수명을 전환 효과에 묶지 않는다. Plotly는 통계의 기존 값·집계와 시점을 보존하는 갱신에 사용했다.
- Worker는 실제 검색 클라이언트에 연결했고, 실패 시 동일 검색 규칙의 로컬 대체 경로를 둔다. 색인 추출·변경 감지의 메인 스레드 비용까지 모두 Worker로 사라졌다고 주장하지 않는다.
- A/B는 math.js의 기존 `buildScene`을 재사용하고 KaTeX 수식·SVG 비교면을 사용한다. 자유 수식의 저장/계산과 비교 표시를 별도 계층으로 둔다.

## 최종 확인 근거

아래 검사는 단계가 다르며 건수를 합산하여 제품 전체 검증 수로 만들지 않는다. 앞선 실패·중간 실행 기록도 삭제하지 않고 최종 로그와 구별한다.

| 확인 | 최종 결과 | 근거와 의미 |
| --- | --- | --- |
| 통합 관련 단위/UI 검사 | **5파일·65검사 통과** | [integration-unit.log](../work/frontend-opportunities-20261002/integration-unit.log). 실제 브라우저 그래픽 대신 합성 환경을 쓰는 검사는 그 범위의 근거다. 로그의 jsdom canvas 미구현 안내를 실제 그래픽 실패나 실제 GPU 검증으로 확대하지 않는다. |
| 검색·이력·관측 담당 검사 | **별도 8파일·41검사 통과 보고** | 검색/색인·Worker·성능 관측·이력 담당자의 해당 검사 결과. 통합 65검사와 중복 여부를 무시하고 합산하지 않는다. |
| 최신 타입 검사 | **통과** | [types-current.log](../work/frontend-opportunities-20261002/types-current.log). 병행 작업의 `ceiling` 렌더링 타입 대응을 포함한 현재 소스의 결과다. |
| 최신 사용 빌드 | **통과** | [build-final.log](../work/frontend-opportunities-20261002/build-final.log). 이전 [build.log](../work/frontend-opportunities-20261002/build.log)와 구별한다. 빌드 완료와 기존 의존성 경고를 구별한다. |
| A01–A10 통합 시점의 WebKit 기기 모사 | **10흐름 × 5환경 = 50/50 통과** | [devices-final.log](../work/frontend-opportunities-20261002/devices-final.log), 실행 ID `run-iUnlbd`, [해당 실행 폴더](../work/device-runs/run-iUnlbd). 합성 자료의 실제 브라우저 조작·저장·새로고침·복귀 근거이며, 이후 추가된 장소 풍경 변경까지 같은 50개를 다시 실행한 결과는 아니다. |
| 장소·천장 변경 후 최신 WebKit 기기 모사 | **3흐름 × 5환경 = 15/15 통과** | [devices-navigation-final.log](../work/frontend-opportunities-20261002/devices-navigation-final.log), 실행 ID `run-9ZXxSv`, [해당 실행 폴더](../work/device-runs/run-9ZXxSv). 최신 `observatory-workspace.pw.ts`의 장소·천장 이동/복귀, 풍경 보존, 자료에서 출발한 왕복을 확인했다. |

다섯 환경은 iPhone-17-Pro 세로/가로, iPad-Pro-13 세로/가로/half-window 프로필이다. WebKit의 화면·터치 모사이며 물리 기기에서 실행했다는 뜻이 아니다. `run-iUnlbd`의 열 가지 흐름은 다음과 같다.

1. 날짜·과목·원기록 공유 선택, 여러 차트/키보드 값 목록 반영, 해제와 원문 보존.
2. A 고정 후 실제 B 변경, 공통 축/배율, 탭 복귀, 저장 장면·메모 불변.
3. 명령 검색·원문 발췌·필터·복귀·로컬 관측 조작.
4. 누적 기록의 40개 단위 표시·펼친 범위 복원·기록 불변.
5. 원자료·곁 메모·이름 있는 구성·명령의 왕복 및 재접속.
6. 구성 저장 실패를 대화상자 안에서도 표시하고 재시도.
7. 자료 곁의 코드 예제 열기·숨김·복귀와 메모 보존.
8. 오래된 탭이 다른 탭의 새 구성을 덮지 않고 자기 작업 구성을 유지.
9. 네 장소의 직접 경로·브라우저 뒤로 가기·공통 검색의 실제 호출 장소.
10. 자료→곁 메모→도구→기록→출발지 복귀와 원문 보존.

검사 소스는 [frontend-comparison-selection.pw.ts](../e2e/devices/frontend-comparison-selection.pw.ts), [frontend-search-history.pw.ts](../e2e/devices/frontend-search-history.pw.ts), [frontend-workspace-opportunities.pw.ts](../e2e/devices/frontend-workspace-opportunities.pw.ts), [observatory-workspace.pw.ts](../e2e/devices/observatory-workspace.pw.ts)다. 인계의 과거 검사 수와 합치지 않는다.

이후 장소 풍경·천장 경로가 병행 변경되어 `run-9ZXxSv`에서 최신 `observatory-workspace.pw.ts`의 세 흐름을 다시 확인했다. 네 장소와 천장의 직접 이동·브라우저 뒤로 가기·실제 호출자 복귀, 풍경 접힘의 새로고침/장소 이동 보존과 자료/감소 모션 불변, 선택 자료→곁 메모→도구→기록→출발지의 원문 보존이 대상이다. 기존 50개와 겹치는 왕복 검사가 있으므로 ‘서로 다른 65개 흐름’으로 세지 않는다.

## 전수 대응과 Figma 상태

[UX 경로 검증 파일](ux-paths-20261002/verification.json)은 원래 표면 **111개 + 확장 10개 = 121개**, 조작 **1,462개 전부 대응**, 전이 연결 **6,657개**를 기록한다. 최신 소스 포착 시각은 **2026-10-02T03:27:44.072Z**, 원격 검증 근거를 포함한 최종 대조 시각은 **2026-10-02T03:45:39.042Z**다. 이 대조 시점의 파싱/분류/대응 오류와 source/origin drift는 모두 0이다. 병행 작업 전체가 영구 동결되었다는 뜻은 아니며, 해당 시점 소스 목록의 SHA-256은 다음과 같다.

```text
c080b1b82f58bf46d05fac967061f05dab35509e011193b6e812e44f783f8ebe
```

이전 목록 이후 병행된 장소 풍경 작업에서 조작 정의 4개(내비게이션 2개·풍경 2개)가 추가되었다. 소스 위치를 기준으로 생성한 기존 조작 ID 13개도 현재 위치에 맞게 교체했다. 이는 정적 대응표의 소스 오프셋 식별자 변경이며 앱 자료의 ID를 바꾼 것이 아니다.

이는 `documentation-integrity-not-product-test`로 표시된 **정적 목록/연결의 완전성 검사**다. 1,462개 조작·6,657개 전이 연결을 각각 실제로 실행했거나 모든 자료 조합·분기·권한·실패 상태를 동적 검증했다는 뜻이 아니다. 위 50개 통합 시점 검사와 최신 장소·천장 15개 검사는 범위가 명시된 별도 동적 증거다.

**Figma 전용 페이지 `20 전체 UX 경우·경로`(노드 `73:68`)의 원격 반영과 재조회 검증을 완료했다.** 표면 카드 **121개**, 조작 카드 **1,462개**, 개요 카드 **6개**, 합계 **1,589개**를 편집 가능한 UX 경로 문서 카드로 연결했다. [전체 경로 목차 열기](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=79-92667)에서 시작하거나 [A01 자료와 곁 도구 카드](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX?node-id=74-67269)를 바로 열 수 있다. 이번 추가는 동선·조건·조작·복귀의 문서 대응이며, 기존 **155개 디자인 화면은 이 작업에서 변경하지 않았다.**

[Figma 원격 검증 요약](../work/frontend-opportunities-20261002/figma-validation-summary.json)의 완료 시각은 **2026-10-02T03:43:11.349Z**다. 1,589개 전체 카드의 실제 본문·제목·문자열 길이·FNV 해시와 구조/경계를 기대값과 대조하고, **12,630개 링크 참조의 목적지**를 확인했다. 미확인 참조와 검증 오류는 0이다. 대표 `INDEX-R`와 `A01` 두 카드의 실제 PNG에서도 한글 줄바꿈·마지막 본문·하단 안내를 확인했으며 겹침·잘림이 없었다. 전체 카드의 구조·내용·링크 재조회와 대표 두 카드의 픽셀 확인을 구별하고, 1,589개 전체의 스크린샷을 검사했다고 표현하지 않는다.

현재 UX 검증 파일의 `remoteExecutionVerified`는 **true**다. 저장된 실제 원격 근거의 SHA와 현재 카드 본문 해시를 대조한 결과이며, 생성 입력이나 예정된 카드 수만으로 완료 처리하지 않았다. 이 원격 검증은 문서 대응의 정확성을 확인한 것으로 앱의 모든 조작·분기를 실행한 결과는 아니다.

재현용 생성기의 원시 입력 예산을 **42,500자**로 조정하고 입력을 **56개에서 73개 묶음**으로 다시 나누었다. [재분할 검증](../work/frontend-opportunities-20261002/figma-input-repack-verification.json)에서 해당 생성 payload의 **1,585개 카드** ID·본문·제목·출처가 모두 유지됐고, 전후 내용 SHA-256은 `6077f25476be8daaece5b2dfd6e0d174c23c83069e48717e86ed24933ed36f13`으로 같았다. 최대 원시 입력은 42,445자, 실행 코드는 47,312자로 50,000자 제한 안이다. 묶음 재분할에 따른 추가 Figma 쓰기는 필요하지 않았다. 이 문서 마감에서 제품 코드를 변경하거나 배포하지 않았다.

## 적용 범위와 남은 경계

검색 발췌 링크는 **해당 원문 항목을 연다.** 자료마다 영구 문단 ID와 원문 오프셋 계약이 있는 것이 아니므로 정확한 문단 앵커 이동을 구현했다고 표현하지 않는다. 브라우저가 이미 읽을 수 있는 자료를 검색하며 원격 파일 전체 추출·외부 내용 색인은 별도다.

반응 속도 표본은 원문·계정·자료명·URL 없이 고정 필드만 창의 메모리에 각각 최근 **120개**까지 보관하고 새로고침 때 비운다. 사용자가 요청한 JSON 내보내기 외 자동 전송은 없다. 두 animation frame을 지난 시점은 표시 기회에 대한 앱 내부 관측이며 표준 **INP/LCP/CLS·현장 75백분위·실제 기기 전체의 성능 보장**이 아니다. 검색 Worker와 점진 표시가 모든 자료 규모에서 더 빠르다는 수치도 이번 통과 건수로 주장하지 않는다.

이번 작업은 프론트 코드·로컬 저장/복귀·관련 빌드/검사와 정적 디자인 대응이다. 새 운영 서버 적용·공개 배포·물리 iPhone/iPad·OS 한글 IME·VoiceOver·장기간 실제 누적 사용·학습 효과는 이번 결과에 포함하지 않는다. 원래 자료와 개인 설정을 유지하는 변경 관련 검증을 완료한 것과 제품의 모든 동적 조합을 완료한 것을 구별한다.
