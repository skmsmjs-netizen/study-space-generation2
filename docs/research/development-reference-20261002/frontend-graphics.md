# 프론트엔드·상태·모션·천문대 그래픽 조사

확인일: 2026-10-02. 이 문서는 현재 웹앱에 맞는 조사와 채택 제안이다. `기본 권고`는 관련 작업에서 우선 사용할 방법, `기존 유지`는 이미 있는 기술을 존중하는 판단, `조건부`는 구체적인 부족과 이득을 확인한 뒤 도입할 후보, `참고`는 비교·라이선스 판단 자료를 뜻한다. 지침의 자동 변경, 패키지 설치, 앱 전체 검증·배포를 뜻하지 않는다.

출처 대조표는 [frontend-graphics-sources.json](frontend-graphics-sources.json)의 **F01–F31, 31개**다. 기본 권고 7 / 기존 유지 7 / 조건부 14 / 참고 3이다. 공식 문서·표준 제정 기관·공식 저장소와 구현 기관의 웹 API 문서를 직접 확인했다. 인터넷의 모든 도구를 전수 조사한 목록은 아니며, 현재 앱의 기술 선택에 필요한 대표 후보를 다룬다.

## 1. 현재 코드 선언과 문서에서 확인한 출발점

[package.json](../../../package.json)에 React 19.3.0 / React DOM 19.3.0 / Vite 8.3.1 / TypeScript 7.0.2가 선언돼 있다. Motion 13.4.6, GSAP 3.15.0, Rive React Canvas 4.36.0, dotLottie React 0.19.16, lottie-web 5.13.0, Lordicon React 1.11.0도 이미 있다. 이는 이번에 읽은 패키지 선언이며 실제 설치 파일·모든 실행 경로·최신 버전 여부까지 확인했다는 뜻은 아니다.

[기존 모션 문서](../../motion-system-20261001.md)는 공통 버튼·탭·알림·저장 확인과 별도 재생기를 연결하고, 에셋의 지연 로드·모션 감소·정지·화면 밖 재생 중단·실제 저장 acknowledgment 뒤의 완료 반응을 규정한다. 기존 Animate UI·Motion Primitives·Magic UI·React Bits 등의 채택 경위를 유지하며, 그 문서에 기록된 과거 라이선스 확인을 이번 날짜의 모든 upstream 재확인으로 확대하지 않는다.

[천문대 고급 표현 문서](../../observatory-advanced-20261002.md)는 실제 경로에 WebGL2+SVG, 확대별 LOD, curl noise, 파장 변위, 국소 bloom, OKLCH 혼합, 시간 기반 재생과 GPU 자원 정리를 연결했다고 기록한다. PixiJS·Three.js는 설치한 엔진이 아니며 WebGPU도 현재 렌더러가 아니다. 문서의 로컬·기기 모사 근거와 이번 조사에서 새로 실행한 시험은 구별한다. 이번에는 제품 코드 시험·공개 배포·물리 기기 GPU 측정을 하지 않았다.

**판단:** 현재 React/Vite 구조와 공통 UI·모션·WebGL2+SVG 경로를 유지하면서 상태·재사용·측정의 품질을 높이는 것이 기본이다. 전체 UI 키트나 3D 엔진을 추가하는 일은 목표가 아니다. 아래 후보가 현재 구현보다 특정 문제를 더 잘 해결한다는 증거가 있어야 교체 비용이 정당화된다.

## 2. UI 기반과 부품 라이브러리

| ID·후보 | 이 앱에서 맡길 역할 | 선택과 제한 |
| --- | --- | --- |
| [F01 React 상태 설계](https://react.dev/learn/managing-state) | 입력·선택·열림·오류 상태의 소유권, 원본에서 계산할 수 있는 값의 중복 제거, reducer/context 경계 | **기존 유지.** 화면 전환이나 key 변경으로 초안·커서가 뜻밖에 초기화되지 않도록 한다. 학습 원장과 UI 상태는 구별한다. |
| [F02 HTML dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) | 실제로 다른 조작을 막아야 하는 대화상자, 기본 초점과 닫기 동작 | **기본 권고.** 기존 Modal을 재검토할 때 먼저 비교한다. 작성 중 글·초점 복귀·모바일 키보드는 앱에서 확인한다. |
| [F03 Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) | 다른 화면을 함께 사용할 수 있는 간단한 보조 패널·선택 안내 | **기본 권고.** Popover API는 비모달이다. 메뉴·콤보박스 전체의 키보드 패턴을 자동으로 완성해 주는 것으로 취급하지 않는다. |
| [F04 CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | 창·분할 화면·작은 위젯에서 자신에게 주어진 폭에 맞는 배치 | **기본 권고.** 전체 화면 폭만으로 모든 부품을 판단하지 않는다. 크기 containment의 영향과 대체 배치를 확인한다. |
| [F05 React Aria](https://react-aria.adobe.com/) | 복잡한 콤보박스·날짜·선택·목록 등의 조작과 국제화 | **조건부 우선 후보.** 천문대 외형을 직접 입히면서 복잡한 입력 동작을 재사용할 수 있다. 기능별 필요한 부분만 비교한다. |
| [F06 Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction) | 대화상자·메뉴·탭·툴팁 등의 무스타일 조합 부품 | **조건부 대안.** 초점·키보드·ARIA 구현의 재사용에 적합하다. React Aria와 같은 역할을 이중 도입하지 않는다. |
| [F07 shadcn/ui](https://ui.shadcn.com/docs) | 수정 가능한 부품 코드를 가져오는 방식과 조합 사례 | **참고.** 완성 외형과 설정을 프로젝트 기본값으로 덮어쓰지 않는다. 가져온 코드의 수정·업데이트 책임이 우리 쪽에 남는다. |
| [F08 Floating UI](https://floating-ui.com/docs/getting-started) | 스크롤·좁은 화면·화면 경계에서 팝오버 위치와 충돌 조절 | **조건부.** native 방식과 기존 위치 계산으로 부족할 때 쓴다. 위치 전용 패키지와 상호작용 패키지를 구별한다. |

React Aria·Radix·shadcn은 동일한 종류의 선택지가 아니다. 앞의 두 도구는 조작과 접근성의 재사용에 강점이 있고, shadcn은 수정할 부품 소스를 배포하는 방식이다. 현재 앱에는 자체 공통 UI와 토큰이 있으므로 먼저 문제 있는 부품 한 개에서 입력·초점·복귀와 스타일 호환성을 비교한 뒤 확대하는 편이 적절하다. 라이브러리 소개의 접근성 주장은 우리 앱 전체 준수의 증거가 아니다.

## 3. 상태·서버 데이터·누적 자료

| ID·후보 | 도입이 필요한 신호 | 이 프로젝트에서 보존할 경계 |
| --- | --- | --- |
| [F09 TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) | 서버 조회 캐시, 중복 요청, 무효화·재조회 정책이 여러 곳에 흩어짐 | **조건부.** 서버 상태 읽기와 갱신에 맡긴다. 기존 원장·outbox·초안·충돌 처리와 역할을 정하고 두 개의 저장 원본을 만들지 않는다. |
| [F10 TanStack Virtual](https://tanstack.com/virtual/latest/docs/introduction) | 실제 누적 목록에서 DOM 규모와 렌더 비용 때문에 입력·스크롤이 느려짐 | **조건부.** 긴 한국어·가변 높이·편집 중 항목·키보드 초점·찾기·뒤로 복귀를 함께 검증한다. 데이터 삭제나 검색 대상 축소로 빠르게 만들지 않는다. |
| [F11 XState](https://stately.ai/docs/xstate) | 저장·취소·재시도·대기·충돌 등 허용 전이를 boolean 여러 개로 관리해 모순이 생김 | **조건부.** 복잡한 기능의 statechart와 전이 검증에 사용한다. 단순 토글에는 기존 reducer로 충분할 수 있다. 읽은 공식 페이지의 alpha 안내와 안정 버전 문서는 구별한다. |
| [F12 Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction) | 많은 먼 컴포넌트가 공유하는 UI 상태에 선택 구독이 필요함 | **조건부.** 화면 상태를 공유할 이유가 있을 때만 검토한다. persisted store를 추가하면서 기존 owner namespace·원장·설정 계약을 중복시키지 않는다. |

네 도구를 모두 설치해야 좋은 구조가 되는 것은 아니다. Query는 주로 서버 상태, Zustand는 클라이언트 공유 상태, XState는 전이의 정확성, Virtual은 렌더할 구간을 다룬다. 먼저 문제의 책임을 분리하면 도구가 필요한지 판단할 수 있다. 현재 상태 저장 구조를 읽지 않은 채 전역 store나 query cache로 전면 이관하는 것은 권고하지 않는다.

## 4. 모션의 역할과 수명

| ID·후보 | 적절한 용도 | 이 앱의 권고 |
| --- | --- | --- |
| [F13 Motion](https://motion.dev/docs/react-accessibility) | 공통 부품의 등장·퇴장·선택 이동·layout 반응 | **기존 유지.** 현재 토큰과 모션 환경을 사용한다. reducedMotion은 이동을 줄여도 상태 의미와 조작 가능성을 유지하도록 설계한다. |
| [F14 GSAP context](https://gsap.com/docs/v3/GSAP/gsap.context()/) | 여러 요소를 묶는 시퀀스와 명시적인 정리 | **기존 유지.** 범위 안에 만든 애니메이션을 revert/cleanup한다. 같은 DOM 속성을 Motion·CSS·GSAP이 동시에 쓰지 않게 한다. |
| [F15 GSAP 라이선스](https://gsap.com/community/standard-license/) | 채택과 배포의 사용 조건 확인 | **참고.** 현행은 Standard No Charge License이며 상업 사용도 무상 허용한다고 안내한다. MIT로 바꾸어 표기하지 않고 금지 용도와 고지를 보존한다. |
| [F16 Rive React](https://rive.app/docs/runtimes/react/react) | 사용자 입력과 상태에 반응하는 벡터 장면·위젯 | **기존 유지.** 현재 react-canvas와 공식 예제의 react-webgl2는 다른 렌더러 선택이다. 예제 import를 보고 기존 패키지를 자동 교체하지 않는다. |
| [F17 dotLottie React](https://docs.lottiefiles.com/en/runtimes/distributions/react/v0.x) | 제작된 lottie/json 동작을 재생하고 상태에 맞게 제어 | **기존 유지.** 실제 호출되는 재생기와 정지·로드 실패·재접속 정책을 유지한다. 정적인 벡터나 CSS로 충분한 자리에 추가하지 않는다. |
| [F28 Rive 제작 요금](https://rive.app/pricing) | 새로운 RIV 에셋의 제작·내보내기 비용 확인 | **참고.** 현재 Free는 splash가 있는 RIV export, Cadet은 splash 없는 export를 안내한다. 설치된 런타임과 새 제작물의 내보내기 조건은 별개다. |

Rive나 Lottie 재생기를 사용한다고 해당 마켓의 모든 작품을 재사용할 수 있는 것은 아니다. 플레이어 코드의 조건, 제작 편집기 기능, 개별 에셋의 권리를 각각 확인한다. Motion 문서의 유료 Motion+ 자료·기능도 현재 사용하는 기본 런타임과 구별한다. 이번 조사에서는 구매·계정 생성·새 외부 자료 업로드를 하지 않았다.

천문대 모션은 실제 상태를 설명하는 시간에 맞춰야 한다. 입력을 받았다는 반응, 서버가 저장을 확인한 반응, 장식이 계속 움직이는 상태는 각각 의미가 다르다. 애니메이션을 재생했다는 이유로 저장 성공·공부 완료를 생성하지 않으며, 실패 안내와 다시 시도하기를 모션이 지연시키지 않는다.

## 5. 그래픽 엔진과 고급 기술

| ID·기술 | 얻는 것 | 지금의 판단 |
| --- | --- | --- |
| [F18 PixiJS](https://pixijs.com/8.x/guides/concepts/performance-tips) | 2D sprite·장면·텍스처·필터·입력의 체계적 관리 | **조건부.** 많은 2D 장면의 관리 비용이 커질 때 먼저 비교할 엔진이다. 현재 소규모 GPU층과 SVG를 전면 이관하지 않는다. |
| [F19 Three.js](https://threejs.org/manual/pages/cleanup.html) | 입체 모델·카메라·재질·광원 중심의 장면 구성 | **조건부.** 실제 3D 필요가 있을 때 검토한다. texture/material/geometry를 명시적으로 해제해야 하며 장면 밖으로 제거하는 것만으로 충분하지 않다. |
| [F20 React Three Fiber](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx) | React와 Three 장면의 통합, on-demand rendering·instancing·LOD·적응 해상도 패턴 | **조건부.** Three를 선택한 뒤 필요하면 채택한다. 각 라이브러리 예제의 수량/FPS는 이 앱의 보장값이 아니다. |
| [F21 Khronos WebGL](https://www.khronos.org/webgl/) | 브라우저에서 GLSL 셰이더와 GPU 그리기를 쓰는 표준 | **기존 유지.** 현재 WebGL2+SVG의 이점을 먼저 살린다. GPU 미지원·실패·context loss에 대한 대체 표현을 유지한다. |
| [F22 WebGPU](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) | 고급 GPU pipeline과 일반 계산 | **조건부.** 조사 시점 MDN은 Limited availability로 표시한다. 지원 기기 확인, 선택 경로, WebGL/SVG 대체, 실제 성능 이득이 필요하다. |
| [F23 Worker+OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) | canvas 렌더링 일을 주 스레드 밖으로 분리 | **조건부.** 렌더 CPU 작업이 한글 입력·스크롤을 막는다고 측정됐을 때 검토한다. 통신 비용과 포인터·크기·정지 동기화가 추가된다. |
| [F24 WebGL 운용 지침](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) | draw call·해상도·메모리·자원 수명 관리 | **기본 권고.** 새 장식을 추가할 때 자원 정리와 재접속/재진입을 함께 확인한다. CPU 제출 시간은 GPU 시간과 다르다. |
| [F25 Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) | 숨긴 탭에서 불필요한 작업 중단 | **기본 권고.** 기존 화면 밖 감지와 함께 적용하되 두 조건을 혼동하지 않는다. 복귀 때 수동 정지 선택을 보존한다. |
| [F26 React Profiler](https://react.dev/reference/react/Profiler) | 어느 컴포넌트가 입력 때 과도하게 다시 그려지는지 측정 | **기본 권고.** 렌더 비용과 GPU·네트워크 비용을 나누어 진단한다. 측정 모드 자체의 오버헤드도 고려한다. |
| [F27 Web Animations](https://www.w3.org/TR/web-animations-1/) | 타임라인과 효과의 재생·중단·시간 관계 | **기존 유지.** 현재 CSS/GPU의 공통 시간 연결을 정리한다. 같은 장면의 효과마다 독립 시계를 불필요하게 만들지 않는다. |

이 프로젝트에서 의미 있는 고급화는 다음처럼 실제 문제와 연결된다.

1. **장면 규모가 커질 때:** 화면에 보이는 것만 그리는 culling, 같은 모양을 묶는 batching/instancing, sprite atlas, 공유 자원을 사용한다. 이득은 CPU/GPU 병목에 따라 달라지므로 무조건 적용하지 않는다. [F18](https://pixijs.com/8.x/guides/concepts/performance-tips), [F20](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
2. **기기 여유가 다를 때:** LOD·렌더 해상도·후처리 품질을 바꾸되 장면 의미와 조작은 유지한다. 현재 문서의 해상도 조절은 시작점이며 물리 기기 FPS 검증을 대신하지 않는다. [F20](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx), [기존 구현 기록](../../observatory-advanced-20261002.md)
3. **반복 방문할 때:** 재생 루프·이벤트·worker·GPU buffer/program/shader·texture 등 각각의 생성자와 종료 책임을 정한다. 들어왔다 나가기를 반복해 메모리와 실행 수가 계속 늘지 않는지 확인한다. [F19](https://threejs.org/manual/pages/cleanup.html), [F24](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
4. **화면·탭 밖으로 갈 때:** 장식은 중단하고 저장·복구 등 필요한 책임과 구분한다. 일시정지와 복귀는 사용자가 선택한 상태를 유지한다. [F25](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
5. **입력이 느릴 때:** 먼저 React 재렌더·layout·GPU 제출·파일 처리 중 비용을 구별한다. 복잡한 worker나 새 엔진 도입은 해당 원인이 입증된 뒤 선택한다. [F26](https://react.dev/reference/react/Profiler), [F23](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

현재 2D 천문대에 대한 조건부 후보는 PixiJS, 실제 3D 요구에는 Three+R3F까지로 좁혔다. Babylon.js 등의 추가 엔진 전수 비교는 이번 결정을 바꿀 구체적인 요구가 없어서 확장하지 않았다. 위 후보가 항상 가장 빠르다는 순위를 뜻하지 않는다.

## 6. 픽셀 자산 제작과 윤곽 유지

| ID·후보 | 사용 조건 | 이 프로젝트의 판단 |
| --- | --- | --- |
| [F29 Aseprite](https://www.aseprite.org/docs/sprite-sheet/) | 작은 물체·캐릭터·건물의 픽셀 원본과 프레임 애니메이션을 제작할 때 | **조건부.** 레이어·프레임·태그를 유지한 원본과 sprite sheet/atlas를 함께 관리할 수 있는 제작 후보다. 현재 SVG/셰이더로 충분한 장면을 비트맵으로 일괄 바꾸지 않는다. 편집기 구매·설치를 수행하지 않았다. |
| [F30 Piskel](https://github.com/piskelapp/piskel) | 가벼운 브라우저 기반 sprite·픽셀 애니메이션 편집이 필요할 때 | **조건부.** 공식 저장소는 Apache-2.0을 표시한다. 공식 README가 모바일 미지원을 명시하므로 iPad에서의 제작을 보장하지 않는다. |
| [F31 image-rendering](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering) | 확대된 비트맵의 픽셀 윤곽을 유지할 때 | **기본 권고.** crisp-edges/pixelated와 실제 DPR·배율을 확인한다. pixelated는 비정수 배율에서 항상 순수 nearest-neighbor가 되는 설정이 아니다. |

**적용 제안:** sprite sheet는 여러 프레임을 한 이미지에 담고, atlas는 여러 자산을 묶어 텍스처 변경과 묶음 그리기에 활용한다. 반복 자산이 늘어나고 실제 렌더 경로가 이를 활용할 때 도입한다. 원본 크기·프레임 시간·pivot·투명 여백·패딩·내보내기 규칙을 함께 기록한다. [Aseprite 문서](https://www.aseprite.org/docs/sprite-sheet/), [PixiJS 지침](https://pixijs.com/8.x/guides/concepts/performance-tips)

픽셀 윤곽을 위해 정수 배율과 최종 그리기 좌표의 pixel snapping을 후보로 쓰되, CSS 픽셀과 기기 픽셀 비율을 구분해 이동·확대 때의 떨림을 확인한다. 모든 좌표를 무조건 반올림하면 느린 카메라 이동이 계단처럼 보일 수 있으므로 건물 윤곽·스프라이트·카메라 중 필요한 층에만 적용한다. 이는 현재 장면에 대한 구현 제안이며 공인된 단일 최적값이 아니다. 부드러운 성운·빛 번짐과 본문 글자까지 최근접 확대를 강제하지 않는다. 편집기 코드의 라이선스, 폰트·브러시·외부 sprite/마켓 작품의 사용권, 직접 제작한 원본의 출처는 각각 보존한다.

## 7. 읽은 고급 작업 스킬과 적용 조건

이번 조사에서는 아래 SKILL 본문을 읽고 발동 조건과 적용 범위를 확인했다. 제작·코드 수정 도구를 실행한 것은 아니다.

| 스킬 | 유용한 작업 | 현재 프로젝트에 적용할 범위와 한계 |
| --- | --- | --- |
| [vercel:react-best-practices](</Users/manseeksong/.codex/plugins/cache/openai-curated-remote/vercel/0.21.4/skills/react-best-practices/SKILL.md>) | React 부품 작성·성능 리뷰·여러 TSX 변경 후 점검 | 요청 병렬화·필요할 때만 로드·구독/리스너 중복 제거·렌더 중 파생 값·일시 값 ref·입력 우선 갱신을 관련 부분에 적용한다. Next.js 전용 server/RSC/next-dynamic 항목은 React/Vite에 그대로 복제하지 않는다. |
| [figma:figma-implement-motion](</Users/manseeksong/.codex/plugins/cache/openai-curated-remote/figma/15.0.0/skills/figma-implement-motion/SKILL.md>) | Figma에 정의된 모션을 실제 앱 코드로 옮길 때 | 구조 정보와 모션의 시간/곡선/노드 ID를 함께 읽고, 기존 엔진에 맞추며 한 타임라인을 실제 재생 확인한 뒤 확대한다. 이번에는 대상 Figma 모션이 없으므로 변환을 실행하지 않았다. |

스킬의 이름에 고급이 들어가는지보다 작업의 실패를 얼마나 구체적으로 막는지가 중요하다. 예컨대 모션의 위치 변형과 layout 변형을 분리하고, 반복 모션을 공통 부품으로 만들고, 이벤트와 GPU 수명을 정리하는 절차가 실제 고급 역량에 해당한다. 새 스킬의 다운로드·설치를 이번 조사의 산출물로 세지 않는다.

## 8. 이번 조사로 권하는 기본 조합

- **화면:** 현재 React/Vite/TypeScript + 공통 UI/토큰을 유지한다.
- **기본 조작:** 기존 부품과 HTML/CSS를 먼저 활용한다. 어려운 입력 동작에 React Aria 또는 Radix, 어려운 위치 계산에 Floating UI를 개별 비교한다.
- **상태:** React 상태 소유권과 기존 repository 계약을 먼저 정리한다. 서버 캐시 문제에는 Query, 복잡한 전이에는 XState, 공유 UI 상태에는 Zustand 중 해당되는 것만 검토한다.
- **누적 자료:** 실제 목록 병목이 보이면 Virtual을 사용하되 편집·검색·초점·위치 보존을 함께 해결한다.
- **미세 동작:** 기존 Motion/CSS를 공통 기준으로 사용하고, GSAP·Rive·Lottie는 현재 맡긴 역할과 자원 수명을 유지한다.
- **천문대:** WebGL2+SVG를 유지하고 LOD·국소 bloom·정지·복구·메모리와 입력 성능을 확인한다. Pixi/Three/WebGPU는 구체적인 확장 요구와 비교 측정 후 선택한다.
- **비용과 유지보수:** 가져오는 코드·런타임·편집기·에셋의 조건을 분리하고 기존 고지를 유지한다. 기능당 의존성을 늘리기 전에 실제 재사용과 제거/업데이트 경로를 확인한다.

이 조합은 새 표현을 금지하는 기준이 아니다. 천문대의 정체성을 유지하면서 필요한 외형·입력·반복 사용 품질을 안정적으로 확대하기 위한 현재의 채택 제안이다. 신규 라이브러리를 필요 없이 설치하거나 모든 부품을 교체하는 작업은 실행하지 않았다.
