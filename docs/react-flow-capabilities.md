# React Flow 전체 조사와 실제 반영

2026-10-01. 대상은 현재 웹앱의 Canvas, 그래프뷰, 자료 개념도다. 공식 문서의 모든 항목을 조사 대상으로 삼되, API/예제 수를 사용자 기능 수나 구현 완료 수로 바꾸지 않는다. 아래 각 행은 반영, 기존 경로 재사용, 대안 검토, 별도 미적용을 명시한다.

## 조사 범위와 원본

- [공식 색인](https://reactflow.dev/llms.txt)의 222항목: 가이드34, 예제69, API119. [전체 본문](https://reactflow.dev/llms-full.txt)에 예제 본문이 비어 있어 69개 페이지를 별도로 읽었다.
- 설치 버전12.12.0의 공개 타입 선언도 함께 확인했다. ReactFlowProps122개와 instance 선언27개 키는 부록에 전부 열거한다. 상속하는 viewport 함수 등은 설치 선언 원본에도 남겼다.
- 예제16개는 Pro 라이선스이며 공개 설명/의존성/적용 조건까지만 확인했다. 공개 설명을 바탕으로 만든 undo/redo는 앱의 원문 보존 계약에 맞춘 독자 구현이며 Pro ZIP 소스를 복사한 것이 아니다.
- 증거: `work/react-flow-quality-20261001/official-index.txt`, `official-full.txt`, `examples/`, `example-evidence.json`, `installed-react-flow-api.txt`, `index-inventory.json`, `api-fields.json`. 이 파일들은 조사 시점의 근거이며 앞으로의 공식 기능 추가를 자동 포괄하지 않는다.

## 선정 근거와 실제 사용

React Flow의 공식 [배치 안내](https://reactflow.dev/learn/layouting/layouting)는 배치 엔진을 별도로 선택하도록 설명한다. 단순 방향/목차 배치에는 Dagre, 일반 관계에는 기존 D3 force를 재사용했다. 실제 노드의 측정 크기로 배치하며 개인 Canvas 위치를 갱신마다 재계산하지 않는다. 복합 포트/중첩 라우팅을 위해 ELK/libavoid를 추가하는 선택은 이번 구현에 포함하지 않았다.

React Flow의 [접근성](https://reactflow.dev/learn/advanced-use/accessibility), [성능](https://reactflow.dev/learn/advanced-use/performance), [실제 브라우저 검사](https://reactflow.dev/learn/advanced-use/testing)를 적용했다. 한국어 안내, 목록/폼 대안, stable nodeTypes, memo 카드, 선택 상태의 단일 관리와 기존 Worker를 사용한다. 이 근거는 WCAG 전체 인증이나 학습 효과 검증이 아니다.

실제 코드: `src/ui/flow-experience.tsx`, `study-canvas.tsx`, `study-graph.tsx`, `material-map.tsx`; 저장: `src/data/flow-preferences.ts`, 기존 Canvas repository/draft; 배치/기록/내보내기: `src/domain/flow-layout.ts`, `flow-history.ts`, `flow-transfer.ts`.

## 예제69개 전체 대조

| 공식 항목 | 판정 | 적용 범위와 이유 |
|---|---|---|
| [All Examples](https://reactflow.dev/examples) | 조사 | 69개 개별 페이지의 공개 설명·코드·라이선스 범위를 확인 |
| [Pro Examples](https://reactflow.dev/examples/pro-examples) | 조사 | 유료 예제16개의 공개 설명과 의존성만 확인. 비공개 ZIP 소스는 열람하지 않음 |
| [Feature Overview](https://reactflow.dev/examples/overview) | 반영 | 기본 부품·선·카드·선택·뷰포트의 세 화면 실제 사용을 대조 |
| [Add Node On Edge Drop](https://reactflow.dev/examples/nodes/add-node-on-edge-drop) | 별도 미적용 | 빈 곳에 놓기만 해 원문 카드를 생성하지 않음. 개념 카드 추가 폼으로 이름·설명을 먼저 저장 |
| [Connection Limit](https://reactflow.dev/examples/nodes/connection-limit) | 조정 반영 | isValidConnection으로 자기 연결·없는 카드·같은 방향 중복을 거부. 임의 연결 개수 제한은 두지 않음 |
| [Custom Nodes](https://reactflow.dev/examples/nodes/custom-node) | 반영 | StudyCard와 Dot에서 실제 목차·설명·그림·원문 링크를 표시 |
| [Delete Middle Node](https://reactflow.dev/examples/nodes/delete-middle-node) | 별도 미적용 | 카드 삭제 뒤 A→C를 자동 추론하면 관계 의미가 달라짐. 원문 삭제 및 자동 재연결을 실행하지 않음 |
| [Drag Handle](https://reactflow.dev/examples/nodes/drag-handle) | 반영 | 제목만 이동 손잡이로 사용하고 입력·그림은 nodrag/nopan/nowheel |
| [Easy Connect](https://reactflow.dev/examples/nodes/easy-connect) | 조정 반영 | 카드 전체 연결점 대신 기존 양옆 Handle과 터치/키보드용 연결 폼을 함께 제공 |
| [Intersections](https://reactflow.dev/examples/nodes/intersections) | 조정 반영 | Dagre의 실측 너비/높이와 기존 D3 충돌 계산으로 배치 겹침을 줄임. 교차 접촉으로 의미를 바꾸지 않음 |
| [Node Resizer](https://reactflow.dev/examples/nodes/node-resizer) | 반영 | NodeResizeControl 가로 조절과 숫자 너비 조절. 240–1000, 계정/화면별 기기 설정으로 재접속 보존 |
| [Node Toolbar](https://reactflow.dev/examples/nodes/node-toolbar) | 반영 | 확대에 영향받지 않는 선택 카드/점 도구와 우클릭 선택 |
| [Proximity Connect](https://reactflow.dev/examples/nodes/proximity-connect) | 별도 미적용 | 가까이 놓았다는 이유만으로 개념 관계를 만들지 않음 |
| [Rotatable Node](https://reactflow.dev/examples/nodes/rotatable-node) | 별도 미적용 | 한국어 본문 카드의 읽기 방향을 유지. 회전 기능은 추가하지 않음 |
| [Node Position Animation](https://reactflow.dev/examples/nodes/node-position-animation) · Pro 공개 설명 | 별도 미적용 | 기존 공통 동작/감소된 움직임 설정 유지. 자동 재배치 애니메이션은 추가하지 않음 |
| [Stress Test](https://reactflow.dev/examples/nodes/stress) | 검증 적용 | 150개 실측 카드·순환·분리 관계의 배치와 실제 누적 카드 화면을 별도로 검증 |
| [Updating Nodes](https://reactflow.dev/examples/nodes/update-node) | 반영 | 제어 상태와 applyNodeChanges를 재사용. 선택 상태의 양방향 재갱신 루프를 실제 검사에서 수정 |
| [Shapes](https://reactflow.dev/examples/nodes/shapes) · Pro 공개 설명 | 조정 반영 | 그래프는 원형, Canvas는 원문 카드. 의미 없는 도형/색 선택기는 추가하지 않음 |
| [Animating Edges](https://reactflow.dev/examples/edges/animating-edges) | 별도 미적용 | 실제 시간 흐름이나 전송을 관측하지 않는 관계에 이동 애니메이션을 붙이지 않음 |
| [Custom Connection Line](https://reactflow.dev/examples/edges/custom-connectionline) | 기본 재사용 | 기본 연결 미리보기와 중앙 검증을 사용 |
| [Custom Edges](https://reactflow.dev/examples/edges/custom-edges) | 반영 | BaseEdge 기반 DotEdge가 실제 원 둘레까지 이어짐. 직선·곡선·꺾임을 지원 |
| [Delete Edge on Drop](https://reactflow.dev/examples/edges/delete-edge-on-drop) | 별도 미적용 | 연결 변경을 빈 곳에 놓으면 기존 연결 유지. 명시적인 이 연결 지우기와 undo 경로 사용 |
| [Edge Label Renderer](https://reactflow.dev/examples/edges/edge-label-renderer) | 기본 재사용 | 기본 선 이름과 하단 관계 수정 폼을 사용. SVG 밖 별도 라벨 포털은 불필요 |
| [Edge Intersection](https://reactflow.dev/examples/edges/edge-intersection) | 별도 미적용 | 선 위에 카드를 놓았다는 이유로 관계를 분리·변경하지 않음 |
| [Edge Toolbar](https://reactflow.dev/examples/edges/edge-toolbar) | 조정 반영 | 선 선택과 관계 목록을 같은 편집 폼에 연결. 작게 확대된 선 위 조작 대신 폼으로 원문·시작·끝 수정 |
| [Edge Types](https://reactflow.dev/examples/edges/edge-types) | 반영 | default(bezier), straight, step, smoothstep 네 모양. UI 이름과 내부 타입을 명시 변환 |
| [Edge Routing](https://reactflow.dev/examples/edges/edge-routing) · Pro 공개 설명 | 별도 미적용 | libavoid 자동 장애물 우회 엔진 미도입. 현재 꺾임/곡선과 Dagre 배치를 사용하며 모든 선 교차 제거를 보장하지 않음 |
| [Floating Edges](https://reactflow.dev/examples/edges/floating-edges) | 반영 | 점 중심/실제 반지름으로 끝점을 계산. 확대·축소와 이동을 반영 |
| [Edge Markers](https://reactflow.dev/examples/edges/markers) | 반영 | 직접 저장한 관계만 방향 화살표. 자동 목차 관계와 구별 |
| [Multi Connection Line](https://reactflow.dev/examples/edges/multi-connection-line) | 별도 미적용 | 여러 원문에 같은 관계를 추측하여 일괄 생성하지 않음. 두 카드마다 설명을 확인 |
| [Reconnect Edge](https://reactflow.dev/examples/edges/reconnect-edge) | 반영 | onReconnect와 시작/도착 Select. 기존 ID와 설명 보존, 실패·취소는 원래 연결 유지 |
| [Simple Floating Edges](https://reactflow.dev/examples/edges/simple-floating-edges) | 대안 검토 | 네 면 손잡이 선택 대신 원 둘레를 사용하는 floating edge 적용 |
| [Temporary Edges](https://reactflow.dev/examples/edges/temporary-edges) | 별도 미적용 | 기록이 없는 ghost node를 원문 카드로 보이지 않게 함. 연결 중 미리보기는 기본 기능 사용 |
| [Editable Edge](https://reactflow.dev/examples/edges/editable-edge) · Pro 공개 설명 | 별도 미적용 | 임의 제어점 저장 미구현. 현재 계약의 끝점/설명/선 모양 조절을 제공 |
| [Computing Flows](https://reactflow.dev/examples/interaction/computing-flows) | 별도 미적용 | 개념 연결은 실행 프로그램이나 성취 계산 그래프가 아님. 수학 도구의 별도 계산 책임 유지 |
| [Connection Events](https://reactflow.dev/examples/interaction/connection-events) | 반영 | onConnect/isValidConnection/onReconnect의 실제 저장 경로와 취소 동작 대조 |
| [Context Menu](https://reactflow.dev/examples/interaction/context-menu) | 조정 반영 | 우클릭으로 카드 선택 도구를 열고 키보드/목록 선택으로 동일 조작 제공 |
| [Contextual Zoom](https://reactflow.dev/examples/interaction/contextual-zoom) | 반영 | 작은 카드의 편집 버튼을 선택 도구로 제공. 점 이름은 화면 크기를 유지하고 겹침을 접음 |
| [Drag and Drop](https://reactflow.dev/examples/interaction/drag-and-drop) | 기본 재사용 | 기존 원문 카드의 내부 이동. 외부 자료는 기존 가져오기와 개념 폼을 사용 |
| [Preventing Cycles](https://reactflow.dev/examples/interaction/prevent-cycles) | 의미에 맞게 조정 | 자기 연결은 거부하되 개념 간 양방향/순환 관계는 허용. 학습 원문을 DAG로 강제하지 않음 |
| [Save and Restore](https://reactflow.dev/examples/interaction/save-and-restore) | 반영 | 기존 Canvas 명령/버전/초안/이력 유지, 설정 저장·재접속·확인 후 JSON 가져오기 |
| [Touch Device](https://reactflow.dev/examples/interaction/touch-device) | 반영 | 기본 Handle 두 번 선택 + 넓은 연결 폼 + 기기별 브라우저 검사. 실제 물리 기기 증거와 구별 |
| [Validation](https://reactflow.dev/examples/interaction/validation) | 반영 | 서로 다른 실제 카드, 동일 방향 중복 방지, 가져오기 소유자/ID/유한 좌표/크기 검증 |
| [Helper Lines](https://reactflow.dev/examples/interaction/helper-lines) · Pro 공개 설명 | 조정 반영 | 24px 스냅과 선택 카드 왼쪽/위쪽 맞춤. 자동 정렬선 미리보기는 별도 미구현 |
| [Collaborative](https://reactflow.dev/examples/interaction/collaborative) · Pro 공개 설명 | 별도 미적용 | Yjs 실시간 다중 사용자 공동 편집은 미구현. 기존 소유자/버전 충돌 계약을 유지 |
| [Copy and Paste](https://reactflow.dev/examples/interaction/copy-paste) · Pro 공개 설명 | 기존 경로 재사용 | MemoEditor의 새 ID 복사·자료 개념도의 Canvas 추가를 유지. 도메인 원문 무차별 클립보드 복제 미도입 |
| [Undo and Redo](https://reactflow.dev/examples/interaction/undo-redo) · Pro 공개 설명 | 반영 | 원문을 담지 않는 배치 snapshot의 past/future100단계, 화면 이동 제외, 새 편집 시 redo 분기 정리 |
| [Selection Grouping](https://reactflow.dev/examples/grouping/selection-grouping) · Pro 공개 설명 | 조정 반영 | 다중 선택/선택 영역 보기/함께 이동/정렬. 영구 컨테이너 그룹을 저장하지는 않음 |
| [Parent Child Relation](https://reactflow.dev/examples/grouping/parent-child-relation) · Pro 공개 설명 | 별도 미적용 | 목차 소속은 도메인이 소유. 드롭으로 원문 소속/상대 좌표를 임의 변경하지 않음 |
| [Sub Flow](https://reactflow.dev/examples/grouping/sub-flows) | 기존 경로 재사용 | 과목/목차 필터와 그래프 주변 관계 탐색. 중첩 parentId 컨테이너 미도입 |
| [Dagre Tree](https://reactflow.dev/examples/layout/dagre) | 반영 | @dagrejs/dagre3.1.1을 실제 측정 카드 배치에 사용. 기존 개인 배치는 명시 조작 때만 변경 |
| [Elkjs Tree](https://reactflow.dev/examples/layout/elkjs) | 대안 검토 | 복합 포트/중첩 그래프 요구가 없는 현 범위에서 Dagre 선택. ELK 추가 설치 미수행 |
| [Elkjs Multiple Handles](https://reactflow.dev/examples/layout/elkjs-multiple-handles) | 대안 검토 | 포트별 의미/순서 데이터가 없어 기존 두 연결점 유지 |
| [Horizontal Flow](https://reactflow.dev/examples/layout/horizontal) | 반영 | Canvas LR, 그래프는 가용 화면에 따라 LR/TB |
| [Expand and Collapse](https://reactflow.dev/examples/layout/expand-collapse) · Pro 공개 설명 | 조정 반영 | 과목/메모 표시/검색/선택 중심 깊이1–3 탐색. 노드별 하위 트리 접기 미구현 |
| [Auto Layout](https://reactflow.dev/examples/layout/auto-layout) · Pro 공개 설명 | 반영 | 목차 관계는 Dagre, 직접 이은 관계는 기존 D3. 사용자가 배치 모드와 간격을 선택하고 설정 보존 |
| [Force Layout](https://reactflow.dev/examples/layout/force-layout) · Pro 공개 설명 | 반영 | 기존 D3 worker와 직접 옮긴 점 고정 유지 |
| [Dynamic Layouting](https://reactflow.dev/examples/layout/dynamic-layouting) · Pro 공개 설명 | 조정 반영 | 새 카드의 기존 기본 위치 캐시 유지. 카드 추가 때 개인 배치를 전부 흔들지 않음 |
| [Node Collisions](https://reactflow.dev/examples/layout/node-collisions) | 반영 | D3 충돌/라벨 겹침 계산과 실측 Dagre. 사용자가 직접 겹친 위치는 자동 덮어쓰기하지 않음 |
| [Base Style](https://reactflow.dev/examples/styling/base-style) | 반영 | 필수 React Flow CSS + 앱의 공통 토큰 |
| [Dark Mode](https://reactflow.dev/examples/styling/dark-mode) | 반영 | 기존 앱 테마 토큰으로 노드/선/도구/미니맵 색을 연결 |
| [Tailwind](https://reactflow.dev/examples/styling/tailwind) | 대안 검토 | 기존 토큰/CSS와 공통 UI를 재사용하여 두 번째 스타일 체계 미도입 |
| [Turbo Flow](https://reactflow.dev/examples/styling/turbo-flow) | 별도 미적용 | 발광 테두리/장식 애니메이션을 개인 공부 화면에 강제하지 않음 |
| [Eraser Tool](https://reactflow.dev/examples/whiteboard/eraser) | 별도 미적용 | 쓸기 조작으로 원문 카드/관계를 삭제하지 않음. 기존 그림 편집의 지우개는 유지 |
| [Lasso Selection](https://reactflow.dev/examples/whiteboard/lasso-selection) | 대안 검토 | 기본 부분 사각 선택과 전체/목록 선택을 제공. 자유곡선 올가미 미구현 |
| [Rectangle](https://reactflow.dev/examples/whiteboard/rectangle) | 기존 경로 재사용 | 기존 그림/필기 도구 유지. 원문 ID 없는 사각 도형을 도메인 카드로 저장하지 않음 |
| [Freehand Draw](https://reactflow.dev/examples/whiteboard/freehand-draw) · Pro 공개 설명 | 기존 경로 재사용 | 기존 MemoEditor/InkPreview/perfect-freehand의 실제 그림 저장 유지 |
| [Download Image](https://reactflow.dev/examples/misc/download-image) | 조정 반영 | 편집 가능한 관계도 SVG를 로컬 생성. html-to-image 예제의 버전 제약을 확인했고 PNG 화면 복제는 미도입 |
| [Server Side Image Creation](https://reactflow.dev/examples/misc/server-side-image-creation) · Pro 공개 설명 | 별도 미적용 | Puppeteer 서버 이미지 생성 미구현. 로컬 SVG/JSON 다운로드 사용 |

## 가이드34개 전체 대조

| 공식 항목 | 이번 적용 판단 |
|---|---|
| [Quick Start](https://reactflow.dev/learn) | 기존 @xyflow/react12.12.0/CSS/고정 높이 컨테이너를 재사용. 별도 새 앱을 만들지 않음 |
| [Overview](https://reactflow.dev/learn/concepts/terms-and-definitions) | node/edge/handle/viewport 용어를 실제 코드 접점과 구별. 데이터 의미는 기존 domain이 담당 |
| [Building a Flow](https://reactflow.dev/learn/concepts/building-a-flow) | 실제 원문 ID를 node/edge에 투영하고 stable nodeTypes/edgeTypes를 모듈 바깥에 유지 |
| [Adding Interactivity](https://reactflow.dev/learn/concepts/adding-interactivity) | controlled nodes와 applyNodeChanges, 연결/재연결 콜백을 기존 저장 명령에 연결 |
| [The Viewport](https://reactflow.dev/learn/concepts/the-viewport) | 기본 Controls, 수치 확대율, fitView, 선택 항목 맞춤, 미니맵으로 이동/확대 조작 제공 |
| [Built-In Components](https://reactflow.dev/learn/concepts/built-in-components) | Controls/Background/MiniMap/Panel을 공통 FlowExperience로 재사용 |
| [Nodes](https://reactflow.dev/learn/customization/custom-nodes) | StudyCard와 Dot의 memo custom node. 원문/그림/편집기와 비확대 NodeToolbar 연결 |
| [Handles](https://reactflow.dev/learn/customization/handles) | Canvas 좌우 연결점과 nodrag 입력을 분리. 그래프 점은 실제 중심/반지름으로 끝점 계산 |
| [Edges](https://reactflow.dev/learn/customization/custom-edges) | 그래프는 BaseEdge와 내장 path 함수. Canvas/자료는 내장 네 가지 선 모양 재사용 |
| [Edge Labels](https://reactflow.dev/learn/customization/edge-labels) | Canvas·자료 관계 원문은 label/labelStyle로 표시. 그래프는 선택 상세에서 전체 설명 확인 |
| [Utility Classes](https://reactflow.dev/learn/customization/utility-classes) | 편집/스크롤/도구를 nodrag/nopan/nowheel로 분리하고 제목 영역만 dragHandle로 사용 |
| [Theming](https://reactflow.dev/learn/customization/theming) | 기존 CSS 토큰과 앱 테마 재사용. 별도 팔레트나 Tailwind 체계 미도입 |
| [Overview](https://reactflow.dev/learn/layouting/layouting) | Dagre/D3/ELK의 특성과 비용 검토. 단순 목차는 실측 Dagre, 일반 관계는 기존 D3 Worker 선정 |
| [Sub Flows](https://reactflow.dev/learn/layouting/sub-flows) | 부모 상대좌표·순서 계약 검토. 실제 목차 소속과 혼동할 영구 중첩 컨테이너는 미도입 |
| [Hooks and Providers](https://reactflow.dev/learn/advanced-use/hooks-providers) | ReactFlow 자식의 useReactFlow/useViewport로 인스턴스와 현재 줌을 읽음. 외부 인스턴스는 onInit ref |
| [Accessibility](https://reactflow.dev/learn/advanced-use/accessibility) | 한국어 ariaLabelConfig, 이름 있는 Controls, 키보드 이동, 연결/정렬/크기 목록·폼 대안 사용 |
| [Testing](https://reactflow.dev/learn/advanced-use/testing) | jsdom은 저장/회복 계약 검사, Playwright WebKit은 실제 geometry·조작·저장·복귀 검사로 분리 |
| [TypeScript](https://reactflow.dev/learn/advanced-use/typescript) | Node/Edge/NodeProps/EdgeProps/ReactFlowInstance/AriaLabelConfig로 각 surface 타입 연결 |
| [Uncontrolled Flow](https://reactflow.dev/learn/advanced-use/uncontrolled-flow) | defaultNodes/defaultEdges 대안 검토. 앱의 저장/충돌/복구가 소유하므로 controlled 방식 유지 |
| [Performance](https://reactflow.dev/learn/advanced-use/performance) | memo custom nodes, stable types/selection callback, 필요한 상태만 구독, 기존 D3 Worker 유지. 무제한 성능 보장 아님 |
| [State Management](https://reactflow.dev/learn/advanced-use/state-management) | 외부 원문은 repository, Canvas 좌표는 기존 명령, 임시 드래그는 ReactFlow state. 선택을 양쪽에서 재주입하지 않음 |
| [Computing Flows](https://reactflow.dev/learn/advanced-use/computing-flows) | 실행 그래프 데이터 전파 검토. 공부 개념 간 관계를 자동 계산/성취 추론으로 바꾸지 않아 별도 미적용 |
| [Server Side Rendering](https://reactflow.dev/learn/advanced-use/ssr-ssg-configuration) | 서버의 명시 width/height/handles 요구 확인. 현재 브라우저 앱에 SSR/SSG 그래프 렌더링 미도입 |
| [Devtools](https://reactflow.dev/learn/advanced-use/devtools-and-debugging) | 공개 debug 부품을 참고. 제품 화면에 내부 좌표 inspector를 추가하지 않고 Playwright geometry·pageerror·trace로 확인 |
| [Multiplayer](https://reactflow.dev/learn/advanced-use/multiplayer) | Yjs/공유 상태 전제 검토. 실시간 공동 편집 미구현, 기존 단일 소유자와 버전 충돌 계약 유지 |
| [Whiteboard Features](https://reactflow.dev/learn/advanced-use/whiteboard) | 공개 도형/선택 예제 검토. 기존 필기/InkPreview를 재사용하고 전체 원문 쓸어 지우기는 미도입 |
| [Slideshow App](https://reactflow.dev/learn/tutorials/slide-shows-with-react-flow) | 노드 기반 슬라이드/키보드 전환 사례 검토. 공부 관계도 과업에 슬라이드 생성/페이지 전환 미도입 |
| [Web Audio API](https://reactflow.dev/learn/tutorials/react-flow-and-the-web-audio-api) | 노드별 오디오 실행 사례 검토. 개념 관계를 오디오 처리 노드로 해석하지 않아 미적용 |
| [Mind Map App](https://reactflow.dev/learn/tutorials/mind-map-app-with-react-flow) | custom node/손잡이/드롭 생성 사례 검토. 이름·설명을 작성하는 기존 개념 폼을 사용하며 빈 드롭 자동 생성 미도입 |
| [React Flow UI](https://reactflow.dev/learn/tutorials/getting-started-with-react-flow-components) | shadcn/Tailwind 전제와 부품 복사 방식 검토. 기존 공통 Button/Input/Select와 토큰을 재사용 |
| [Common Errors](https://reactflow.dev/learn/troubleshooting/common-errors) | 컨테이너 크기, 필수 CSS, type 이름과 Handle, selection update loop를 실제 경로에서 확인/보완 |
| [Migrate to v12](https://reactflow.dev/learn/troubleshooting/migrate-to-v12) | v12 측정 크기의 measured 구분 및 @xyflow/react import 유지. 이전 도메인 자료를 마이그레이션하지 않음 |
| [Migrate to v11](https://reactflow.dev/learn/troubleshooting/migrate-to-v11) | 이전 major 이행 차이 참조. 현재 v12이며 v11 이행/저장 키 변경 미수행 |
| [Migrate to v10](https://reactflow.dev/learn/troubleshooting/migrate-to-v10) | 이전 major 이행 차이 참조. 현재 v12이며 v10 이행/저장 키 변경 미수행 |

## API119개 전체 대조

API는 개발용 구성 요소·훅·타입·도우미의 목록이다. 직접 사용하는 심볼을 표시하고 나머지는 대안/기본 동작/타입의 참조로 남긴다. 미사용 API까지 각각 별도 사용자 버튼을 만드는 뜻으로 해석하지 않는다.

| API | 코드 접점 |
|---|---|
| [API Reference](https://reactflow.dev/api-reference) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;ReactFlow /&gt;](https://reactflow.dev/api-reference/react-flow) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;ReactFlowProvider /&gt;](https://reactflow.dev/api-reference/react-flow-provider) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Components](https://reactflow.dev/api-reference/components) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;Background /&gt;](https://reactflow.dev/api-reference/components/background) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;BaseEdge /&gt;](https://reactflow.dev/api-reference/components/base-edge) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;ControlButton /&gt;](https://reactflow.dev/api-reference/components/control-button) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;Controls /&gt;](https://reactflow.dev/api-reference/components/controls) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;EdgeLabelRenderer /&gt;](https://reactflow.dev/api-reference/components/edge-label-renderer) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;EdgeText /&gt;](https://reactflow.dev/api-reference/components/edge-text) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;EdgeToolbar /&gt;](https://reactflow.dev/api-reference/components/edge-toolbar) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;Handle /&gt;](https://reactflow.dev/api-reference/components/handle) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;MiniMap /&gt;](https://reactflow.dev/api-reference/components/minimap) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;NodeResizeControl /&gt;](https://reactflow.dev/api-reference/components/node-resize-control) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;NodeResizer /&gt;](https://reactflow.dev/api-reference/components/node-resizer) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [&lt;NodeToolbar /&gt;](https://reactflow.dev/api-reference/components/node-toolbar) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;Panel /&gt;](https://reactflow.dev/api-reference/components/panel) | 현재 세 화면/공통 부품에서 직접 사용 |
| [&lt;ViewportPortal /&gt;](https://reactflow.dev/api-reference/components/viewport-portal) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Hooks](https://reactflow.dev/api-reference/hooks) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useConnection()](https://reactflow.dev/api-reference/hooks/use-connection) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useEdges()](https://reactflow.dev/api-reference/hooks/use-edges) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useEdgesState()](https://reactflow.dev/api-reference/hooks/use-edges-state) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useHandleConnections()](https://reactflow.dev/api-reference/hooks/use-handle-connections) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useInternalNode()](https://reactflow.dev/api-reference/hooks/use-internal-node) | 현재 세 화면/공통 부품에서 직접 사용 |
| [useKeyPress()](https://reactflow.dev/api-reference/hooks/use-key-press) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodeConnections()](https://reactflow.dev/api-reference/hooks/use-node-connections) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodeId()](https://reactflow.dev/api-reference/hooks/use-node-id) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodes()](https://reactflow.dev/api-reference/hooks/use-nodes) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodesData()](https://reactflow.dev/api-reference/hooks/use-nodes-data) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodesInitialized()](https://reactflow.dev/api-reference/hooks/use-nodes-initialized) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useNodesState()](https://reactflow.dev/api-reference/hooks/use-nodes-state) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useOnSelectionChange()](https://reactflow.dev/api-reference/hooks/use-on-selection-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useOnViewportChange()](https://reactflow.dev/api-reference/hooks/use-on-viewport-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useReactFlow()](https://reactflow.dev/api-reference/hooks/use-react-flow) | 현재 세 화면/공통 부품에서 직접 사용 |
| [useStore()](https://reactflow.dev/api-reference/hooks/use-store) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useStoreApi()](https://reactflow.dev/api-reference/hooks/use-store-api) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useUpdateNodeInternals()](https://reactflow.dev/api-reference/hooks/use-update-node-internals) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [useViewport()](https://reactflow.dev/api-reference/hooks/use-viewport) | 현재 세 화면/공통 부품에서 직접 사용 |
| [Types](https://reactflow.dev/api-reference/types) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Align](https://reactflow.dev/api-reference/types/align) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [AriaLabelConfig](https://reactflow.dev/api-reference/types/aria-label-config) | 현재 세 화면/공통 부품에서 직접 사용 |
| [BackgroundVariant](https://reactflow.dev/api-reference/types/background-variant) | 현재 세 화면/공통 부품에서 직접 사용 |
| [ColorMode](https://reactflow.dev/api-reference/types/color-mode) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Connection](https://reactflow.dev/api-reference/types/connection) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ConnectionLineComponent](https://reactflow.dev/api-reference/types/connection-line-component) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ConnectionLineComponentProps](https://reactflow.dev/api-reference/types/connection-line-component-props) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ConnectionLineType](https://reactflow.dev/api-reference/types/connection-line-type) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ConnectionMode](https://reactflow.dev/api-reference/types/connection-mode) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ConnectionState](https://reactflow.dev/api-reference/types/connection-state) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [CoordinateExtent](https://reactflow.dev/api-reference/types/coordinate-extent) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [DefaultEdgeOptions](https://reactflow.dev/api-reference/types/default-edge-options) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [DeleteElements](https://reactflow.dev/api-reference/types/delete-elements) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Edge](https://reactflow.dev/api-reference/types/edge) | 현재 세 화면/공통 부품에서 직접 사용 |
| [EdgeChange](https://reactflow.dev/api-reference/types/edge-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [EdgeMarker](https://reactflow.dev/api-reference/types/edge-marker) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [EdgeMouseHandler](https://reactflow.dev/api-reference/types/edge-mouse-handler) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [EdgeProps](https://reactflow.dev/api-reference/types/edge-props) | 현재 세 화면/공통 부품에서 직접 사용 |
| [EdgeTypes](https://reactflow.dev/api-reference/types/edge-types) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [FitViewOptions](https://reactflow.dev/api-reference/types/fit-view-options) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Handle](https://reactflow.dev/api-reference/types/handle) | 현재 세 화면/공통 부품에서 직접 사용 |
| [HandleConnection](https://reactflow.dev/api-reference/types/handle-connection) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [InternalNode](https://reactflow.dev/api-reference/types/internal-node) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [IsValidConnection](https://reactflow.dev/api-reference/types/is-valid-connection) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [KeyCode](https://reactflow.dev/api-reference/types/key-code) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [MarkerType](https://reactflow.dev/api-reference/types/marker-type) | 현재 세 화면/공통 부품에서 직접 사용 |
| [MiniMapNodeProps](https://reactflow.dev/api-reference/types/mini-map-node-props) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Node](https://reactflow.dev/api-reference/types/node) | 현재 세 화면/공통 부품에서 직접 사용 |
| [NodeChange](https://reactflow.dev/api-reference/types/node-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [NodeConnection](https://reactflow.dev/api-reference/types/node-connection) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [NodeHandle](https://reactflow.dev/api-reference/types/node-handle) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [NodeMouseHandler](https://reactflow.dev/api-reference/types/node-mouse-handler) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [NodeOrigin](https://reactflow.dev/api-reference/types/node-origin) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [NodeProps](https://reactflow.dev/api-reference/types/node-props) | 현재 세 화면/공통 부품에서 직접 사용 |
| [NodeTypes](https://reactflow.dev/api-reference/types/node-types) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnBeforeDelete](https://reactflow.dev/api-reference/types/on-before-delete) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnConnect](https://reactflow.dev/api-reference/types/on-connect) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnConnectEnd](https://reactflow.dev/api-reference/types/on-connect-end) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnConnectStart](https://reactflow.dev/api-reference/types/on-connect-start) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnDelete](https://reactflow.dev/api-reference/types/on-delete) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnEdgesChange](https://reactflow.dev/api-reference/types/on-edges-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnEdgesDelete](https://reactflow.dev/api-reference/types/on-edges-delete) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnError](https://reactflow.dev/api-reference/types/on-error) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnInit](https://reactflow.dev/api-reference/types/on-init) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnMove](https://reactflow.dev/api-reference/types/on-move) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnNodeDrag](https://reactflow.dev/api-reference/types/on-node-drag) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnNodesChange](https://reactflow.dev/api-reference/types/on-nodes-change) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnNodesDelete](https://reactflow.dev/api-reference/types/on-nodes-delete) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnReconnect](https://reactflow.dev/api-reference/types/on-reconnect) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [OnSelectionChangeFunc](https://reactflow.dev/api-reference/types/on-selection-change-func) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [PanOnScrollMode](https://reactflow.dev/api-reference/types/pan-on-scroll-mode) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [PanelPosition](https://reactflow.dev/api-reference/types/panel-position) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Position](https://reactflow.dev/api-reference/types/position) | 현재 세 화면/공통 부품에서 직접 사용 |
| [ProOptions](https://reactflow.dev/api-reference/types/pro-options) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ReactFlowInstance](https://reactflow.dev/api-reference/types/react-flow-instance) | 현재 세 화면/공통 부품에서 직접 사용 |
| [ReactFlowJsonObject](https://reactflow.dev/api-reference/types/react-flow-json-object) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Rect](https://reactflow.dev/api-reference/types/rect) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ResizeParams](https://reactflow.dev/api-reference/types/resize-params) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [SelectionDragHandler](https://reactflow.dev/api-reference/types/selection-drag-handler) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [SelectionMode](https://reactflow.dev/api-reference/types/selection-mode) | 현재 세 화면/공통 부품에서 직접 사용 |
| [SnapGrid](https://reactflow.dev/api-reference/types/snap-grid) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Viewport](https://reactflow.dev/api-reference/types/viewport) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [XYPosition](https://reactflow.dev/api-reference/types/xy-position) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [ZIndexMode](https://reactflow.dev/api-reference/types/z-index-mode) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [Utils](https://reactflow.dev/api-reference/utils) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [addEdge()](https://reactflow.dev/api-reference/utils/add-edge) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [applyEdgeChanges()](https://reactflow.dev/api-reference/utils/apply-edge-changes) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [applyNodeChanges()](https://reactflow.dev/api-reference/utils/apply-node-changes) | 현재 세 화면/공통 부품에서 직접 사용 |
| [getBezierPath()](https://reactflow.dev/api-reference/utils/get-bezier-path) | 현재 세 화면/공통 부품에서 직접 사용 |
| [getConnectedEdges()](https://reactflow.dev/api-reference/utils/get-connected-edges) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [getIncomers()](https://reactflow.dev/api-reference/utils/get-incomers) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [getNodesBounds()](https://reactflow.dev/api-reference/utils/get-nodes-bounds) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [getOutgoers()](https://reactflow.dev/api-reference/utils/get-outgoers) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [getSimpleBezierPath()](https://reactflow.dev/api-reference/utils/get-simple-bezier-path) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [getSmoothStepPath()](https://reactflow.dev/api-reference/utils/get-smooth-step-path) | 현재 세 화면/공통 부품에서 직접 사용 |
| [getStraightPath()](https://reactflow.dev/api-reference/utils/get-straight-path) | 현재 세 화면/공통 부품에서 직접 사용 |
| [getViewportForBounds()](https://reactflow.dev/api-reference/utils/get-viewport-for-bounds) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [isEdge()](https://reactflow.dev/api-reference/utils/is-edge) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [isNode()](https://reactflow.dev/api-reference/utils/is-node) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |
| [reconnectEdge()](https://reactflow.dev/api-reference/utils/reconnect-edge) | 설치 선언/공식 API 참조 검토. 현재 호출 경로에서 직접 사용하지 않음 |

## 설치 버전의 ReactFlowProps122개

이름 누락을 확인하기 위한 선언 목록이다. 유효한 콜백/타입/기본값은 설치 선언과 공식 ReactFlow API가 담당한다. 상호 배타적인 controlled/default 입력이나 사용자 원문 삭제 옵션을 모두 켜지 않는다.

| 속성 | 현재 세 화면 |
|---|---|
| `nodes` | 명시 사용 |
| `edges` | 명시 사용 |
| `defaultNodes` | 기본값 유지 또는 별도 미사용 |
| `defaultEdges` | 기본값 유지 또는 별도 미사용 |
| `defaultEdgeOptions` | 기본값 유지 또는 별도 미사용 |
| `onNodeClick` | 명시 사용 |
| `onNodeDoubleClick` | 기본값 유지 또는 별도 미사용 |
| `onNodeMouseEnter` | 기본값 유지 또는 별도 미사용 |
| `onNodeMouseMove` | 기본값 유지 또는 별도 미사용 |
| `onNodeMouseLeave` | 기본값 유지 또는 별도 미사용 |
| `onNodeContextMenu` | 명시 사용 |
| `onNodeDragStart` | 기본값 유지 또는 별도 미사용 |
| `onNodeDrag` | 기본값 유지 또는 별도 미사용 |
| `onNodeDragStop` | 명시 사용 |
| `onEdgeClick` | 명시 사용 |
| `onEdgeContextMenu` | 기본값 유지 또는 별도 미사용 |
| `onEdgeMouseEnter` | 기본값 유지 또는 별도 미사용 |
| `onEdgeMouseMove` | 기본값 유지 또는 별도 미사용 |
| `onEdgeMouseLeave` | 기본값 유지 또는 별도 미사용 |
| `onEdgeDoubleClick` | 기본값 유지 또는 별도 미사용 |
| `onReconnect` | 명시 사용 |
| `onReconnectStart` | 기본값 유지 또는 별도 미사용 |
| `onReconnectEnd` | 기본값 유지 또는 별도 미사용 |
| `onNodesChange` | 명시 사용 |
| `onEdgesChange` | 기본값 유지 또는 별도 미사용 |
| `onNodesDelete` | 기본값 유지 또는 별도 미사용 |
| `onEdgesDelete` | 기본값 유지 또는 별도 미사용 |
| `onDelete` | 기본값 유지 또는 별도 미사용 |
| `onSelectionDragStart` | 기본값 유지 또는 별도 미사용 |
| `onSelectionDrag` | 기본값 유지 또는 별도 미사용 |
| `onSelectionDragStop` | 기본값 유지 또는 별도 미사용 |
| `onSelectionStart` | 기본값 유지 또는 별도 미사용 |
| `onSelectionEnd` | 기본값 유지 또는 별도 미사용 |
| `onSelectionContextMenu` | 기본값 유지 또는 별도 미사용 |
| `onConnect` | 명시 사용 |
| `onConnectStart` | 기본값 유지 또는 별도 미사용 |
| `onConnectEnd` | 기본값 유지 또는 별도 미사용 |
| `onClickConnectStart` | 기본값 유지 또는 별도 미사용 |
| `onClickConnectEnd` | 기본값 유지 또는 별도 미사용 |
| `onInit` | 명시 사용 |
| `onMove` | 명시 사용 |
| `onMoveStart` | 기본값 유지 또는 별도 미사용 |
| `onMoveEnd` | 명시 사용 |
| `onSelectionChange` | 명시 사용 |
| `onPaneScroll` | 기본값 유지 또는 별도 미사용 |
| `onPaneClick` | 기본값 유지 또는 별도 미사용 |
| `onPaneContextMenu` | 기본값 유지 또는 별도 미사용 |
| `onPaneMouseEnter` | 기본값 유지 또는 별도 미사용 |
| `onPaneMouseMove` | 기본값 유지 또는 별도 미사용 |
| `onPaneMouseLeave` | 기본값 유지 또는 별도 미사용 |
| `paneClickDistance` | 기본값 유지 또는 별도 미사용 |
| `nodeClickDistance` | 기본값 유지 또는 별도 미사용 |
| `onBeforeDelete` | 기본값 유지 또는 별도 미사용 |
| `nodeTypes` | 명시 사용 |
| `edgeTypes` | 명시 사용 |
| `connectionLineType` | 기본값 유지 또는 별도 미사용 |
| `connectionLineStyle` | 기본값 유지 또는 별도 미사용 |
| `connectionLineComponent` | 기본값 유지 또는 별도 미사용 |
| `connectionLineContainerStyle` | 기본값 유지 또는 별도 미사용 |
| `connectionMode` | 기본값 유지 또는 별도 미사용 |
| `deleteKeyCode` | 명시 사용 |
| `selectionKeyCode` | 기본값 유지 또는 별도 미사용 |
| `selectionOnDrag` | 명시 사용 |
| `selectionMode` | 명시 사용 |
| `panActivationKeyCode` | 기본값 유지 또는 별도 미사용 |
| `multiSelectionKeyCode` | 기본값 유지 또는 별도 미사용 |
| `zoomActivationKeyCode` | 기본값 유지 또는 별도 미사용 |
| `snapToGrid` | 명시 사용 |
| `snapGrid` | 명시 사용 |
| `onlyRenderVisibleElements` | 기본값 유지 또는 별도 미사용 |
| `nodesDraggable` | 명시 사용 |
| `autoPanOnNodeFocus` | 기본값 유지 또는 별도 미사용 |
| `nodesConnectable` | 명시 사용 |
| `nodesFocusable` | 기본값 유지 또는 별도 미사용 |
| `nodeOrigin` | 기본값 유지 또는 별도 미사용 |
| `edgesFocusable` | 기본값 유지 또는 별도 미사용 |
| `edgesReconnectable` | 기본값 유지 또는 별도 미사용 |
| `elementsSelectable` | 기본값 유지 또는 별도 미사용 |
| `selectNodesOnDrag` | 기본값 유지 또는 별도 미사용 |
| `panOnDrag` | 명시 사용 |
| `minZoom` | 명시 사용 |
| `maxZoom` | 명시 사용 |
| `viewport` | 기본값 유지 또는 별도 미사용 |
| `defaultViewport` | 명시 사용 |
| `onViewportChange` | 기본값 유지 또는 별도 미사용 |
| `translateExtent` | 기본값 유지 또는 별도 미사용 |
| `preventScrolling` | 기본값 유지 또는 별도 미사용 |
| `nodeExtent` | 기본값 유지 또는 별도 미사용 |
| `defaultMarkerColor` | 기본값 유지 또는 별도 미사용 |
| `zoomOnScroll` | 기본값 유지 또는 별도 미사용 |
| `zoomOnPinch` | 기본값 유지 또는 별도 미사용 |
| `panOnScroll` | 기본값 유지 또는 별도 미사용 |
| `panOnScrollSpeed` | 기본값 유지 또는 별도 미사용 |
| `panOnScrollMode` | 기본값 유지 또는 별도 미사용 |
| `zoomOnDoubleClick` | 명시 사용 |
| `reconnectRadius` | 기본값 유지 또는 별도 미사용 |
| `noDragClassName` | 기본값 유지 또는 별도 미사용 |
| `noWheelClassName` | 기본값 유지 또는 별도 미사용 |
| `noPanClassName` | 기본값 유지 또는 별도 미사용 |
| `fitView` | 명시 사용 |
| `fitViewOptions` | 명시 사용 |
| `connectOnClick` | 기본값 유지 또는 별도 미사용 |
| `attributionPosition` | 기본값 유지 또는 별도 미사용 |
| `proOptions` | 기본값 유지 또는 별도 미사용 |
| `elevateNodesOnSelect` | 기본값 유지 또는 별도 미사용 |
| `elevateEdgesOnSelect` | 기본값 유지 또는 별도 미사용 |
| `disableKeyboardA11y` | 기본값 유지 또는 별도 미사용 |
| `autoPanOnNodeDrag` | 기본값 유지 또는 별도 미사용 |
| `autoPanOnConnect` | 기본값 유지 또는 별도 미사용 |
| `autoPanOnSelection` | 기본값 유지 또는 별도 미사용 |
| `autoPanSpeed` | 기본값 유지 또는 별도 미사용 |
| `connectionRadius` | 기본값 유지 또는 별도 미사용 |
| `onError` | 기본값 유지 또는 별도 미사용 |
| `isValidConnection` | 명시 사용 |
| `nodeDragThreshold` | 기본값 유지 또는 별도 미사용 |
| `connectionDragThreshold` | 기본값 유지 또는 별도 미사용 |
| `width` | 명시 사용 |
| `height` | 명시 사용 |
| `colorMode` | 기본값 유지 또는 별도 미사용 |
| `debug` | 기본값 유지 또는 별도 미사용 |
| `ariaLabelConfig` | 명시 사용 |
| `zIndexMode` | 기본값 유지 또는 별도 미사용 |

## 인스턴스 선언27개 키

`nodes`, `edges`, `viewport`, `nodes`, `edges`, `getNodes`, `setNodes`, `addNodes`, `getNode`, `getInternalNode`, `getEdges`, `setEdges`, `addEdges`, `getEdge`, `toObject`, `deleteElements`, `getIntersectingNodes`, `isNodeIntersecting`, `updateNode`, `updateNodeData`, `updateEdge`, `updateEdgeData`, `getNodesBounds`, `getHandleConnections`, `getNodeConnections`, `fitView`, `viewportInitialized`

확대/축소/중심/fitView 등은 ViewportHelperFunctions에서 상속한다. 전체 타입 선언 원본과 해시: `a9921c7f259e18cc1d3341896db6512375f709aaae8ffafd6484a73a7d9bd122`.

## 보존·복귀 범위

- Canvas 위치/연결/뷰포트는 기존 saveCanvasLayout 명령과 초안·수정 이력으로 저장한다. 수치 확대/Controls/전체 보기의 최종 viewport를 보관하고 가져온 viewport도 화면에 적용한다. 되돌리기/다시 실행100단계는 현재 화면 세션에 적용하며 과거 영구 수정 이력을 제거하지 않는다. 원문 편집의 undo와 혼합하지 않는다.
- 미니맵/선 모양/선택 모드/격자/스냅/배치 모드/카드 너비는 계정·화면별 기기 설정이다. 다른 계정으로 옮기지 않으며 원문 손상 시 보관 후 초기화한다. 서버 동기화 설정으로 보고하지 않는다.
- 전체 위치 지도 자동 표시 기준24개, 스냅24px, 카드 너비240–1000, undo100단계는 이번 UI의 기본값이다. 사용자 자료 규모나 학습 법칙을 뜻하지 않는다.
- JSON 가져오기는 동일 공부 공간, 실제 카드 ID, 유한 좌표/확대율, 파일 크기를 확인한 뒤 명시 적용한다. 원문 전체 백업은 기존 전체 내보내기가 담당한다. SVG는 카드 이름과 목차·직접 연결의 편집 가능한 도해이며 픽셀 단위 화면 복제나 원문 전체 내보내기가 아니다.
- 공개 배포/운영 서버 쓰기/물리 기기/장기 학습 효과는 별도 증거가 필요하다. 이번 실제 검사와 남은 직접 조건은 `work/react-flow-quality-20261001/결과.md` 및 최신 인계를 따른다.
