# 출처와 적용 범위

확인일: **2026-09-08**. 이 문서는 설계 판단의 근거와 로컬 선택을 구분한다.
공식 문서를 참고했다는 사실은 산출물의 플랫폼 적합성이나 접근성 준수를 증명하지 않는다.

## 근거를 구분하는 법

| 구분 | 적용하는 내용 | 해석의 한계 |
| --- | --- | --- |
| Apple 공개 지침 | 목적, 선택권, 익숙한 조작, 적응, 정보 위계, 접근성 | Apple 플랫폼의 설계 권고이다. 웹의 보편 규범이나 모든 결과물의 고정 양식이 아니다. |
| WCAG 2.2 | 웹 콘텐츠의 검증 가능한 성공 기준과 준수 조건 | 기준별 수준·예외·적용 범위를 확인한다. 일부 검사로 전체 준수를 선언하지 않는다. |
| 프로젝트 선택 | 한국어 표현, 근거 보존, 검증 기록, 회귀 뷰포트, 기본 토큰 | 사용자 목적에 맞춘 운영 기본값이다. Apple이나 W3C의 의무 규칙으로 귀속하지 않는다. |

## Apple 자료와 확인 범위

| 자료 | 확인한 핵심과 사용처 | 확인 방식 |
| --- | --- | --- |
| [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) | 목적·선택권·책임·친숙함·유연성·단순함·세부 완성도·즐거움을 함께 판단한다. 단일 행동을 강제하는 공식으로 쓰지 않는다. | 공식 도메인의 검색 수록 본문 확인 |
| [Principles of great design, WWDC26](https://developer.apple.com/videos/play/wwdc2026/250/) | 사용자 통제와 회복 가능성을 보존한다. 중단·확인은 큰 실수를 막는 경우에 신중히 사용한다. | 공식 도메인의 검색 수록 발화 본문 확인; 영상 시청은 하지 않음 |
| [Writing](https://developer.apple.com/design/human-interface-guidelines/writing) | 화면 목적에 맞춰 중요한 정보를 앞에 두고, 행동과 목적지가 명확한 문구를 일관되게 쓴다. | 공식 도메인의 검색 수록 본문 확인 |
| [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) | 감각·입력 방식의 대안을 제공하고, 플랫폼별 제어 크기와 글자 확대를 구분하며 실제 보조기술 사용을 검사한다. | [공식 DocC JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/accessibility.json)의 관련 본문·표 직접 재조회 |
| [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) | 안전 영역, 창 크기, 회전, 글자 크기, 언어와 내용 길이의 변화에 적응한다. | [공식 DocC JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/layout.json)의 관련 본문 직접 재조회 |
| [Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets) | 유용한 크기만 지원하고, 큰 크기는 맥락을 더한다. 간단한 조작과 정확한 상세 이동을 제공하며 지원되는 표시 맥락에 적응한다. | 공식 도메인의 검색 수록 본문 확인 |
| [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) | 네이티브 재질의 역할과 콘텐츠·조작의 위계를 구별한다. 웹의 임의 블러를 같은 구현으로 취급하지 않는다. | 공식 도메인의 검색 수록 본문 확인 |
| [VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover) | 의미 있는 요소의 이름·묶음·순서와 콘텐츠 변화를 전달한다. 그림·차트의 정보와 조작도 접근 가능하게 한다. | 공식 도메인의 검색 수록 본문 확인 |

일부 Apple 본문 URL은 조회 도구에 JavaScript 안내만 반환했다. 해당 응답을 본문 확인으로 세지 않았다.
Accessibility와 Layout은 같은 공식 도메인의 DocC JSON으로 보완했다. 다른 자료의 검색 수록 본문 확인은 전체 페이지 렌더 확인과 구별한다.
Writing·Design principles·Widgets의 DocC JSON 조회는 성공하지 않았으므로 JSON 확인 완료로 기록하지 않는다.
위 표에 없는 자료는 이번 갱신에서 확인한 출처로 간주하지 않는다.

## WCAG 2.2의 웹 기준

[WCAG 2.2 권고 본문](https://www.w3.org/TR/WCAG22/)은 직접 조회했다. 확인된 발행 표시는 2024-12-12이다.
아래 WAI Understanding 문서도 직접 조회했다. 이 문서들은 규범 본문을 설명하는 보조 자료이며, 독립된 추가 의무가 아니다.

| 검증 대상 | 규범과 해석에 사용할 자료 |
| --- | --- |
| 글자·비텍스트 대비 | [1.4.3 Contrast 해설](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [1.4.11 Non-text Contrast 해설](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): 대상과 예외, 크기·색 조합을 구별 |
| 드래그 조작 대안 | [2.5.7 Dragging Movements 해설](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html): 드래그 없이 단일 포인터로 수행하는 대안과 필수 표현·기본 컨트롤 예외 |
| 글자 확대 | [1.4.4 Resize Text](https://www.w3.org/TR/WCAG22/#resize-text): 예외를 제외한 200% 확대에서 내용·기능 보존 |
| 좁은 화면에서 재배치 | [1.4.10 Reflow 해설](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): 320 CSS px 폭 기준과 의미상 필요한 2차원 콘텐츠의 예외 |
| 사용자가 바꾼 글자 간격 | [1.4.12 Text Spacing 해설](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html): 지정된 간격 변경을 수용하는 조건이며 기본 조판값을 강제하지 않음 |
| 가려지는 키보드 포커스 | [2.4.11 해설](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): AA 최소 기준과 더 강한 비가림 목표를 구별 |
| 포인터 조작 영역 | [2.5.8 Target Size 해설](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): 24×24 CSS px 최소와 간격·동등 조작·인라인 등의 예외 |
| 비동기 상태 안내 | [4.1.3 Status Messages 해설](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html): 포커스를 받지 않고도 보조기술에 상태를 전달하는 조건 |

텍스트 대비, 비텍스트 대비, 이름·역할·값, 키보드 사용 등은 해당 성공 기준과 실제 구현을 함께 대조한다.
자동 검사·스크린샷·접근성 트리 검사는 각각의 증거이다. 모든 적용 기준과 전체 작업 흐름을 확인하기 전에는 WCAG 준수라고 쓰지 않는다.

## 프로젝트가 선택한 기본값

- 웹의 44 CSS px 터치 목표, 본문 크기·행간, 간격·색·모서리 토큰은 로컬 설계 선택이다.
- Apple의 pt와 웹의 CSS px를 같은 규범 단위로 취급하지 않는다. 현행 HIG는 플랫폼별 기본 제어 크기와 최소 크기를 구분한다.
- 375×667은 지식 보관소의 작은 휴대전화 회귀 뷰포트이다. WCAG 재배치 검사나 실제 기기 확인을 대신하지 않는다.
- 작은·중간·큰 위젯의 정보량은 출발점이다. 모든 크기 제작이나 고정 행동 수를 의무화하지 않는다.
- 근거·수식·원문·불확실성을 보존하고, 호스트 앱의 편집·탐색·데이터 동작을 유지하는 것은 이 프로젝트의 계약이다.
- 검증 범위는 수정된 요소, 목표 환경, 실제로 가능한 상태와 중요한 실패 경로에 따라 정한다. 관련 없는 전체 환경을 매번 검사하지 않는다.

## 재확인이 필요한 때

- 플랫폼 버전·위젯 family·표시 모드·입력 방식이 바뀌거나 해당 플랫폼 적합성을 주장할 때 관련 Apple 본문을 다시 확인한다.
- 수치·예외·접근성 수준을 새로 인용하거나 준수를 주장할 때 WCAG 규범 본문을 다시 확인한다.
- 검색 수록 본문만 확인한 내용이 구현 결정의 핵심이면 공식 본문을 재조회한다. 접근 실패 시 확인 범위를 그대로 남긴다.
- 로컬 토큰이나 회귀 뷰포트를 바꾸면 실제 산출물에서 비교한다. 출처 갱신만으로 렌더·조작·실기기 검증을 완료 처리하지 않는다.
