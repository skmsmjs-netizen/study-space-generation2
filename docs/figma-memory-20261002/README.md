# Figma 메모리 보수와 실제 위젯 구현 연결

2026-10-02 사용자 「복잡한 위젯이라면 피그마에는 목업만 두고, 실제 개발 시 대입」 및 「그 기능이 사라지는 것은 아니지? 실제 웹앱에는 넣는 것이지?」에 따른 보수이다. **Figma의 무거운 표현만 가볍게 바꾼다. 실제 웹앱의 기능·렌더러·조작·계산·저장과 원본 자료는 유지한다.** 작업 파일은 [기존 천문대 Figma](https://www.figma.com/design/YHmD1PpWWfR9JGTEs77JsX)이다.

## 실제 반영 결과

| 대상 | 변경 전 | 변경 후 | 보존 |
| --- | ---: | ---: | --- |
| 원본 천문대 장면 master `10:68` | 1,672노드 | 1노드 | 같은 component ID·이름·전체 960×400 범위·원본 SVG/PNG |
| 수학관측실 페이지 | 41,555노드 | 6,464노드 | 본문 19,349자·prototype 반응 195개 |
| 두 관측실 이동 prototype 페이지 | 8,639노드 | 3,626노드 | prototype 반응 309개 |
| 정체성과 디자인 페이지 | 1,840노드 | 169노드 | 본문 1,500자·반응 5개 |
| 전체 UX 페이지 표시 글 | 2,815,050자 | 704,243자 | 카드 1,589개·기존 ID/제목/소스·원문 담당 파일 |

천문대 장면은 원래 전체 장면을 2배 PNG로 내보내 현재 파일에 업로드한 이미지 fill이다. 수천 개 벡터를 복사하던 장면 master를 바꿨으므로 같은 master를 사용하는 화면도 함께 가벼워졌다. native 버튼·입력·중요 문구·바깥 틀·이동 연결은 호출자에 남는다. 그림을 자르거나 실제 앱을 이미지로 대체하지 않는다.

UX는 표면 121개·조작 1,462개, 합계 1,583개 카드의 반복된 긴 본문만 요약했다. 개요·체크섬·읽기·색인 카드 6개는 유지했다. 요약 본문 최장 650자, 기존 카드 ID와 본문의 FNV 대조 digest `0a08250c`가 실제 Figma 재조회와 일치한다. 카드 겹침 0, 기존 링크 목적지 미해결 0을 확인했다. 공유 핸들러의 모든 분기·원문은 기존 Markdown/JSON에 남고, 요약과 전체 참조 배열을 함께 보관한다.

실제 Figma Desktop에서 같은 파일의 **24개 페이지를 모두 연 후 총 메모리 42.2%**를 확인했다. 페이지 콘텐츠 42.0%, 가져온 컴포넌트 0.1%, 로드된 총 레이어 97,136이다. 첨부의 98.1%·66,935레이어와 페이지 로드 범위·세션이 다르므로 통제된 동일 조건의 감소율로 환산하지 않는다. 현재 전체 페이지를 연 세션에서 경고 구간 아래인 것은 실제 화면으로 확인했다. 페이지 수·다른 작업·세션에 따라 값이 달라질 수 있다.

## 선택한 방법과 실제 구현의 경계

[Figma 공식 메모리 안내](https://help.figma.com/hc/en-us/articles/360040528173-Reduce-memory-usage-in-files)의 복잡한 벡터·텍스트 누적을 줄이는 방법을 적용했다. Figma는 페이지를 열 때 로드하며 숨긴 레이어도 메모리를 사용하므로 단순히 감추는 방식은 쓰지 않는다. 파일을 나누기 전에 반복 장면의 이미지 재사용과 원문 참조를 적용했다. 특정 레이어 수를 모든 파일의 공인 상한으로 정한 기준은 아니다.

복잡한 그림·GPU 장면·그래프·연결도·필기·코드 실행 영역은 Figma에 전체 범위의 이미지 목업을 두고, 실제 웹앱에서는 담당 구현을 연결한다. 간단한 제목·배치·버튼·입력·상태·prototype 이동은 Figma에서 편집 가능한 요소를 유지한다. 목업마다 구현 소스·entry·소유 component와 보존 범위를 연결한다.

[목업 계약](mockup-contracts.json)은 기존 source component 20개와 복잡한 runtime 영역 9개, 합계 29개를 연결한다. 이는 29개 전부를 새로 구현하거나 원격 이미지를 전부 교체했다는 뜻이 아니다. 실제 source export 29개는 존재한다. 계약 SHA는 작성 시점의 snapshot이며 최종 리뷰의 `StudyStatistics` 병행 변경 1개는 [재사용 검증](world-mockup-reuse-verification.json)에 기존/현재 SHA로 남겼다. runtime 실행·저장·물리 기기·배포 완료는 source 대조와 구별한다.

## 재생성에서 같은 문제가 반복되지 않게 한다

[위젯 표현 정책](widget-policy.json)이 이미지 준비·재사용·원본 보존의 담당 원본이다. 현재 파일에 업로드한 이미지 hash와 전체 논리 크기를 확인한 뒤 복사한다. 기존 image master 자체 fill과 이미지 사각형 하나를 가진 master 모두 같은 ID 그대로 재사용한다. 벡터 master·다른 이미지·추가 자식·잘못된 전체 범위·자르기는 쓰기 전에 거부한다. SC01–SC03은 전체 장면 경로를 사용해 정지/설정 버튼과 외부 틀을 유지한다.

변경된 실제 생성 경로는 다음과 같다.

- `docs/figma-observatory-20261002/scripts/build-world-asset.js`: 이미지가 준비되지 않으면 중단하며 벡터를 자동 재생성하지 않는다. 현재 `10:68` 직접 fill도 재시도할 수 있다.
- `docs/figma-observatory-20261002/scripts/build-components.js`: 복사 전 전체 image master를 확인하고 native 조작과 wrapper를 유지한다.
- `work/figma-reconcile-20261002/scene-assets/import-scenes.js`: 기존 source/owner/asset ID·SHA를 보존하고 이미지 입력을 요구한다.
- `docs/ux-paths-20261002/render-docs.cjs`와 `build-figma-paths.js`: 전체 원문은 계속 출력하되 Figma에는 기본 요약을 전달한다. 예전 긴 입력도 쓰기 전에 요약하고 전체본문 모드를 거부한다.

작성 시점의 구 코드를 내장한 과거 호출 파일은 이력으로 보존한다. **그대로 재실행하지 않고 현재 생성기와 준비된 이미지 hash로 다시 만든다.** 프로젝트 배치/표시 예산은 Figma 작업값이며 실제 웹앱 기술 표현의 상한이 아니다.

## 증거와 재사용

- [실제 원격 반영·재조회](../../work/figma-memory-20261002/live-verification.json): master 교체 ID, 40배치·1,583본문, 모든 카드·digest·배치 확인. 앞선 페이지 노드 통계는 페이지 자체를 포함하며 마지막 UX descendant-only 조회는 9,543이다.
- [실제 메모리 화면](../../work/figma-memory-20261002/memory-after-all-pages.jpeg)과 [수치/페이지 방문 기록](../../work/figma-memory-20261002/native-memory-after.json).
- [수학관측실 결과](../../work/figma-memory-20261002/math-mockup-after.png)와 [UX 요약 카드 결과](../../work/figma-memory-20261002/ux-card-after.png): 전체 장면·문구·조작 영역과 카드의 읽기 확인.
- [원본 SVG](../../work/figma-memory-20261002/original-world.svg), [원본 전체 PNG](../../work/figma-memory-20261002/original-world.png), `master-compaction.json`, `master-description.json`: 원본과 변경 전/후 추적.
- [UX 투영 정책](ux-projection-policy.md), [요약 입력](compact-ux-cards.json), [입력 보존/참조 요약](compact-ux-summary.json), `work/figma-memory-20261002/ux-evidence/*.json`: 이전 전체 원문과 새 표시를 구별한다.
- [전체 원문 보존 확인](../../work/figma-memory-20261002/full-documents-preservation.json): 격리 생성에서 326개 전체 원문을 대조한 당시 도구 반환 결과를 회수했다. 원래 보고는 후속 기본 호출로 갱신되었으며 회수 출처·한계를 명시했다.
- [재생성 재사용 검증](world-mockup-reuse-verification.json): 실제 생성기 본문을 격리 mock API로 실행해 정상 두 형태 각각 두 번 재시도와 벡터/hash/bounds/자르기 거부 10조건을 확인했다. 원격 실행·앱 실행으로 확대하지 않는다.
- [현재 master 실제 재시도](../../work/figma-memory-20261002/actual-world-retries.json): 같은 파일의 실제 `10:68`에 현재 생성기를 두 번 호출해 기존 asset/part ID 유지·created/mutated 0·reused true를 확인했다. 위 격리 검증과 별도 근거이다.

실제 앱 `src/`·저장 스키마·운영 서버·공개 배포는 이 보수에서 변경하지 않았다. Figma에 목업을 쓴다는 이유로 구현 목록에서 기능을 없애거나 실제 위젯을 정지 이미지로 바꾸지 않는다. 이 작업은 표현 비용 보수이며 앱 전체 구현·저장 성공을 새로 판정하는 작업은 아니다.
