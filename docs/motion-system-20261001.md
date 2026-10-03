# 웹앱 모션과 실시간 위젯

2026-10-03 후속: [버튼·창·화면 이동의 기능적 모션](interaction-motion-20261003.md)이 대표 기준 조사와 실제 공통 조작/공개 반영을 담당한다. 아래8개 도구의 최초 적용 범위와 당시 증거는 보존한다.

2026-10-01 사용자 요청: 조사한 8개 후보를 실제 학습 입력 웹앱에서 사용한다. 웹앱에 코드와 재생기를 연결하며 Figma 플러그인은 필요하지 않다. 유료 구매, 계정 생성, 개인 자료 업로드는 포함하지 않는다. 후속 배포 요청에 따라 기존 GitHub Pages에 적용한다.

| 출처 | 실제 연결 | 가져온 형태 |
| --- | --- | --- |
| [UI Ball LDRS](https://uiball.com/ldrs/) | `Button.busy`, `LoadingState`의 DotPulse | `ldrs@1.1.9` |
| [Animate UI](https://animate-ui.com/) | 자유 글 저장의 실제 acknowledgment 뒤 CheckLine | 필요한 SVG/경로 모션을 앱에 맞춰 조정 |
| [Motion Primitives](https://motion-primitives.com/) | 공통 Tabs의 선택 배경 이동 | AnimatedBackground의 shared-layout 방식. 기존 선택/키보드 이벤트는 유지 |
| [Magic UI](https://magicui.design/) | 공통 Toast의 짧은 등장 | BlurFade를 180ms, 이동/blur=0으로 조정하여 기존 viewport 고정 위치를 유지 |
| [React Bits](https://reactbits.dev/) | 공통 EmptyState의 짧은 등장 | FadeContent/GSAP를 180ms로 조정. 숨긴 뒤 시작하지 않으며 ScrollTrigger는 추가하지 않음 |
| [Lordicon](https://lordicon.com/) | 움직임 위젯의 선형 자물쇠와 다시 재생 | `@lordicon/react@1.11.0`, `lottie-web@5.13.0`, 공식 예제 JSON |
| [LottieFiles](https://lottiefiles.com/) | 움직임 위젯의 쉬어가기 원형 선 | `@lottiefiles/dotlottie-react@0.19.16`, 앱에서 직접 만든 중립색 벡터 JSON |
| [Rive](https://rive.app/) | 움직임 위젯의 별 개수에 반응하는 카드 | `@rive-app/react-canvas@4.36.0`, 공식 `rating.riv`, 실제 state machine `rating` 입력 |

전환 엔진은 `motion@13.4.6`, FadeContent는 `gsap@3.15.0`이다. Animate UI/Magic UI 등의 전체 웹사이트나 모든 효과를 복제하지 않는다. 각 출처에서 이번 화면의 역할에 맞는 부품을 사용한다. 후보 비교 보고에 별도로 언급한 Spline은 3D 도구이며 이번 8개 모션 구성에는 포함하지 않는다.

## 사용과 상태

데스크톱 `보관함·화면 설정 → 움직임 위젯`, 좁은 화면 `더 보기 → 움직임 위젯`에서 쉬어가기/선형 아이콘/인터랙티브 카드/화면 동작을 연다. 여는 동안 원래 화면의 입력은 그대로 마운트된 상태이며 닫을 때 기존 Modal 초점 복귀를 사용한다. 자료와 위젯의 별 개수는 연결하지 않으며 공부 수행·정확성·숙달을 추론하지 않는다.

`움직임 줄이기`는 기존 공간별 preference prefix에 `motion=reduce|auto`만 추가한다. 원장, 초안, 수정 이력, theme/font preference를 이관하거나 덮어쓰지 않는다. OS reduced-motion은 수동 설정보다 우선한다. Motion/GSAP/LDRS 및 재생기의 움직임을 줄이거나 멈추고, Rive의 숫자 선택은 정지된 별 표시에서도 유지한다. 브라우저가 숨겨지면 반복 재생을 멈추고 Modal 닫기/탭 이동 시 이전 재생기를 unmount하여 정리한다.

작은 모션은 기존 120/180ms 토큰 기준을 따른다. LDRS는 실제 busy 동안만 등장하며 처리 시간과 별개인 가짜 완료/진행률을 만들지 않는다. 저장 확인 SVG는 기존 저장 함수가 로컬 또는 서버 acknowledgment를 확인한 `saved` 상태에서만 표시한다. 사용자에게 노출되는 상태/오류/재시도/되돌리기를 애니메이션으로 감추거나 지연하지 않는다.

세 재생기를 각각 `React.lazy`로 분리한다. WASM과 JSON/RIV도 앱 파일로 제공하므로 위젯 방문이 에셋 서비스에 공부 내용을 전송하지 않는다. 개별 import 실패는 위젯 안의 오류 복귀 경로로 제한한다. WASM의 압축 전 용량은 Lottie 약1.24MB, Rive 약1.99MB이며 필요한 패널을 열 때만 불러온다.

## 출처와 사용 조건

코드 원본은 `work/motion-20261001/upstream/`에 조사 시점으로 보존했다. Animate UI `efeb96ffd7a3b7a4868667e4ac3c346620fb3044`, Motion Primitives `120f64f6ca60348e251f929e9c81f11ccbe45eda`, Magic UI `d7207e5692d14c00dceafa8488d6d01f197fa0e4`, React Bits `e1bbb696fc53f7f91e694c529e4d68c899773b6e`, Lordicon `aea02388a4d11d93363ef2fea8e8b31557f4708d`, Rive React `6910f089f841b5421fc4dded4530de6b4fec4cb5`이다.

Animate UI의 현재 LICENSE.md는 MIT+Commons Clause이다. 이전 조사에서 이를 단순 MIT로 분류한 부분을 정정한다. React Bits도 MIT+Commons Clause이며 앱 사용과 부품 자체의 재판매/재배포를 구별한다. Magic UI, Lordicon 공식 예제 저장소, Rive 공식 예제 저장소 및 주요 런타임은 해당 MIT 고지를 보존한다. Lordicon의 일반 무료 마켓 에셋 정책과 이번 MIT 공식 예제의 출처를 구별하며 UI에 Lordicon 링크도 표시한다. Lottie JSON은 마켓에서 가져온 작품이 아니므로 별도 작가 작품 사용 허가를 추정하지 않는다. GSAP은 Standard no-charge license이다. Motion Primitives README는 MIT를 선언하지만 해당 commit의 연결된 LICENSE.md는 404였으므로 그 사실과 참고한 방식의 범위를 남긴다.

`src/ui/motion-licenses/`와 배포 파일에 포함되는 `public/motion-NOTICES.txt`에 고지를 유지한다. 검증은 React best practices의 지연 import, effect cleanup, 기존 상태/입력 보존을 적용한다. 설치나 라이브러리의 유명세 자체를 UX 효과나 접근성 전체 준수의 증거로 삼지 않는다.

## 확인 범위

실제 앱의 별도 로컬 origin, 예시 namespace에서 3종 재생기, 숫자 선택, 모션 감소 중 선택 유지, 공통 탭/알림/되돌리기, 위젯 종료 후 자유 글 입력 보존, 실제 저장 확인 SVG, 모션 preference 재접속 보존을 직접 확인했다. 공백과 줄바꿈이 포함된 합성 글만 사용했고 개인 기록/운영 서버 저장은 조작하지 않았다.

공유 node_modules의 일부 파일 읽기 지연/비어 있는 읽기로 기존 jsdom와 Testing Library 초기화가 실패하여 같은 package/lock의 새 로컬 의존 환경에서 관련 5파일 76검사를 실행했다. Happy DOM은 기존 검사와 애니메이션 취소의 동작 차이가 있어 채택하지 않았고 추가 설치를 제거했다. 기존 jsdom로 76개 전체 통과이며 보고는 `work/motion-20261001/tests-verified.json`이다. 변경 파일 타입, 디자인 토큰, Vite 번들을 확인했다. 병행 작업 파일이 계속 추가되는 공유 전체 타입/build 결과와 이 변경의 범위는 최종 결과 파일에 별도로 기록한다. 물리 iPad/iPhone, IME/VoiceOver, 운영 서버, 공개 배포, 장기 사용 효과는 이번 검증의 완료 주장에 포함하지 않는다.

## 2026-10-01 배포와 반복 사용 세부 보완

쉬어가기에는 직접 일시정지/재생을 제공한다. IntersectionObserver의 실제 가시성과 document.visibilityState, OS/app 모션 감소를 함께 확인하여 Lottie·Rive·Lordicon 재생을 멈춘다. 화면에서 사라져도 수동 일시정지·선택은 유지하며, 재생기의 선택 상태와 학습 기록을 연결하지 않는다. Rive canvas는 모션 감소 시 제거하지 않고 숨겨 두어 설정 복귀 때 같은 인스턴스와 입력을 유지한다.

공통 모션 환경의 구독은 하나의 MediaQuery/visibility listener/MutationObserver로 공유하고 마지막 구독 종료 시 해제한다. 빠른 작업에서는 120ms 이후에만 장식 점이 나타나며, 실제 busy/버튼 비활성화/접근 가능한 설명은 즉시 반영한다. 완료를 인위적으로 늦추거나 진행률을 만들지 않는다. 모달은 기존 초점/입력 동작 위에 opacity만 짧게 바꾸고, 위젯의 터치 진입 버튼은 preventScroll focus로 닫기 후 복귀 대상을 정한다. 탭과 패널은 aria-controls로 연결한다.

채택 근거는 [Motion 접근성](https://motion.dev/docs/react-accessibility), [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), 기존 디자인 시스템의 120/180ms와 Q03/Q04/Q07/Q09/Q10/Q13/Q15다. 120ms는 프로젝트 기본값이며 공인 반응시간 법칙으로 표현하지 않는다. 이 검증의 공개/기기/빌드 결과는 최신 인계와 배포 확인 파일을 따른다. 앞의 76개 로컬 검사와 미배포 기록은 당시 증거다.
