# 천문대의 확대 상세·성운 흐름·GPU 표현

2026-10-02 추가 구현: [프론트엔드 고급 기법 구현](frontend-advanced-20261002.md)에서 실제 SVG 표시 폭/픽셀 밀도/확대에 따른 240–1280px 해상도 단계, 지속 부담 시 최대400px, 정지 중 크기 변경, 화면 밖 GPU 정리 후 입자 상태 재사용과 해상도별 입자 크기 보정을 연결했다. 외부 창틀/전체 원본 표시도 같은 최종 빌드에서 확인했다. 관련52단위·다섯 환경55흐름 통과이며 공개 배포는 별개다. 아래 최초 해상도 수치는 당시 기록이고 현재 정책은 새 문서와 `observatory-render-budget.ts`가 담당한다.

후속 변경: 같은 날 사용자의 확대 버벅임·즉시 축소·단조로운 상세 정정은 [252상황·첫 기록·성능 보완](observatory-situations-20261002.md#첫-기록최근-입력-밀도확대-성능-보완)에 반영했다. 현재 구현은 확대 중 이동/내부 놓기에서 시점을 유지하며 전체 하늘 필터를 국소 성운으로 좁혔다. 아래 표와 수치 및 검사 결과는 최초 적용 시점의 기록이다. 현재 근접32미세별+8천체 묘사·3옥타브 해석적 흐름·rAF 간격 기반 해상도·수명 유지 update/WAAPI 변경은 후속 문서와 variations 검증 결과가 우선한다.

사용자 「다 적용해」에 따라 2026-10-01 조사한 여섯 기법과 입력/애니메이션 웹 규격을 실제 홈의 `StudyLandscapes → ObservatoryWorld`에 연결했다. 2026-10-02 마감. 기존 12성장단계·6시간대·36상황·공부 원장과 owner별 표시 설정을 유지한다. 합성 비교 화면도 같은 부품을 사용한다.

## 채택과 구현

| 항목 | 실제 연결 | 근거와 선택 이유 |
| --- | --- | --- |
| 다중 상세 LOD | 기본 하늘 + 가는 성운 실 + 미세 별/먼지의 세 층. 확대 1.12–1.77에서 중간 층, 1.65–2.30에서 근접 층을 smoothstep으로 교차 노출. 기존 커서 상세층도 유지한다. | [Three.js LOD](https://threejs.org/docs/pages/LOD.html)의 거리별 상세도 개념을 2D 확대에 맞게 조정. 성장 좌표와 카메라 거리를 별개로 두며 1단계에서도 확대 상세가 보인다. |
| Curl Noise | 3주파수 잠재함수의 분석적 curl과 입자의 중점 적분. GPU 성운에는 5옥타브 noise의 수치 curl. 포인터 주변 소용돌이와 놓은 뒤 지수 감쇠를 연결한다. | [Bridson 등 원 논문](https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph2007-curlnoise.pdf). 유체처럼 보이는 절차적 흐름이며 실제 천체 유체 계산이나 공부 효과 이론은 아니다. |
| 파장 변위 | GPU 성운/입자의 방사형 변위, 벡터 별/성운의 `feTurbulence → feDisplacementMap`. 건물의 픽셀 윤곽은 변위 대상 밖에 유지한다. | [W3C Filter Effects](https://www.w3.org/TR/filter-effects-1/). 기존 SVG와 GPU 하늘을 같이 쓰는 경계에 맞는 조합. |
| GPU 셰이더/입자 | WebGL2/GLSL ES3.00. 성운 사각면1회 + 최대384입자1회, 총2draw. 입자 위치는 유계 CPU 흐름 적분, 표현·반짝임·변위는 GPU. 소수 입자량은 다음 입자의 투명도로 반영한다. | [Khronos WebGL](https://www.khronos.org/webgl/). 기존 SVG/카메라를 유지하므로 전 장면을 새 라이브러리로 이관하지 않았다. PixiJS/Three.js는 조사한 도구 후보였으며 이번에 설치하지 않았다. WebGPU는 향후 계산 후보로 설명한 것이며 현재 선택한 렌더러는 WebGL2이다. |
| 선택적 Bloom | 별 중심만 작은 Gaussian blur + 원본 합성. GPU 성운의 밝은 실/파장에 국소 빛 번짐을 더하고 파장 때 건물 테두리/벽 색이 다홍으로 반응한다. | [Three.js Bloom](https://threejs.org/docs/pages/UnrealBloomPass.html)의 제한적 빛 번짐 개념을 참고하고 [Filter Effects](https://www.w3.org/TR/filter-effects-1/)로 기존 픽셀 광원에 적용. 전체 화면 흐림은 적용하지 않는다. |
| OKLCH | 시간대 역할색/별빛 혼합을 OKLCH로 전환. GPU는 CSS Color4 Oklab 변환으로 만든 선형RGB를 셰이더에서 sRGB로 출력한다. 주황·다홍의 따뜻한 광원과 차가운 보조색을 유지한다. | [W3C CSS Color4](https://www.w3.org/TR/css-color-4/). 기존16색 원본과 공통 의미색/사용자 테마를 유지하고 커버 안의 혼합만 바꾼다. |
| 포인터·시간 동기화 | 기존 Pointer Events/capture/시간기반rAF. 카메라의 일시적 이벤트를 GPU에 전달. Web Animations API로 28초 초신성의 시간과 GPU 변위/지면 조명을 같은 시계에 연결한다. 모션 설정 변화 후 새 CSS 애니메이션을 다시 연결한다. | [Pointer Events](https://www.w3.org/TR/pointerevents3/), [Web Animations](https://www.w3.org/TR/web-animations-1/). 프레임별 React 상태나 공부/설정 저장을 만들지 않는다. |

그래픽 방법·웹 규격·도구 후보를 구별한다. 확대 임계값·색/밝기·입자 상한·파장/흐름 계수는 이 제품의 시각 표현 정책이며 공인된 공부 점수/숙달/물리 법칙이 아니다.

## 엔진 대응과 반복 사용

- 기존 `evolution.position / 11`, `evolution.supernova/colorBloom`, `dynamics.recent[0]`를 밀도·흐름 세기·따뜻함·빛 번짐에 전달한다. 기존 시간/36상황 엔진은 그대로 유지한다. 입력 없는 수면·생리·실제 성과를 추정하지 않는다.
- GPU 입자량은 `34 + 270*growth + 40*activity + 40*closeLOD`, 최대384. 근접 벡터 미세별은 `8 + 48*growth + 8*activity`, 최대64. 원장은 변경하지 않고 연속 출력만 읽는다.
- 약30Hz를 상한으로 장식을 갱신하고 흐름 적분dt는 최대50ms이다. 렌더 해상도는640×213, 60회 평균 CPU 제출 시간이7ms를 넘으면400×133으로 낮춘다. 제출 시간은 GPU/물리 기기 프레임률의 증거가 아니다.
- 화면 밖 canvas는 DOM에서 제거하고 버퍼·프로그램·셰이더와 분리된 context를 정리한다. 여러 갤러리의 화면 밖 장면이 계속 GPU를 점유하지 않는다. 시계는 같은 부품 안에서 유지한다.
- 사용자 정지/모션 감소/화면 밖/숨긴 탭에서 반복 프레임을 중단한다. 터치 스크롤·포인터 취소/이탈·원래 확대 복귀를 유지한다. GPU 미지원/생성 실패/손실 때 SVG 풍경과 상세 흐름이 유지되고 복구 이벤트에 GPU를 다시 구성한다.
- key/version1·owner namespace·층/정지 선택·원문/ID/이력/초안/개인 배치를 변경하지 않는다. 코드는 `observatory-advanced.tsx`, `observatory-gpu.ts`, `observatory-shaders.ts`, `observatory-flow.ts`가 담당한다.

## 확인

이번 로그와 화면은 `work/pixel-daily-20261001/advanced/`에 보존한다. 최초 단위 검사의 추가 프레임 루프/숨긴 탭 실패를 수정했다. 첫 기기 검사의 복구 핸들 오류와 가로 화면의 화면 밖 망원경 좌표는 시험 코드를 보완해 재확인한다. 이전 실패를 새 성공으로 바꾸거나 검사 수를 누적하여 부풀리지 않는다. 최종 실행/빌드 지문/개별 결과는 `verification.json`과 연결된 실행별 manifest/results를 따른다.

전체 빌드 중 병행 코드의 `supabase-sync.test.ts` 타입 오류는 담당 변경 후 해소되었고, `personal-space-lock.test.ts`의 Testing Library `exact` 옵션 타입 오류는 정확한 이름 정규식으로 국소 보완하여 관련15검사를 확인했다. 다른 작업의 원문·런타임·저장 계약을 바꾸지 않았다.

초기 로컬 시험 서버는 sandbox EPERM, 첫 자동 승인 검토는 시간 초과로 차단되었다. 허용된 재시도 뒤 실행한 검사를 별도로 남긴다. 공개 배포·실물 기기 FPS·천체 물리 정확성·학습 효과 검증으로 확대하지 않는다.

최종 결과: 표준 build 통과/41CSS 오류0(기존 예외1), 관련17단위 통과, 선택lint 오류0/기존12info, 조판 통과. 최신 완성 빌드의 `run-Doc6Ee`에서 관련4흐름×5환경20통과/실패·생략·flaky0. 첫 `run-U3rkME`는 시험 코드 문제6실패/14통과이며 최종 통과로 덮지 않는다. IAB53582는 WebGL2/LOD2/zoom2.4657/2184벡터노드/넘침0/별중심glow1/오류0와 실제 드래그 후zoom1복귀를 확인했다. 이번 변경의 공개 배포는 수행하지 않았다.
