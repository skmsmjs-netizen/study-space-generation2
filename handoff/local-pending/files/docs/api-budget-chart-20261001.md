# API 월 예산 그래프

2026-10-01 사용자 ‘api 사용량과 남은것도 원형 그래프나 이런걸로 보여줘야겠지?’에 GPT 연결의 글로 된 집계를 도넛과 정확한 금액 목록으로 연결했다.

- 구성 질문과 같은 달러 단위의 분모/세 부분을 사용한다. 기존 [그래프 선택 기준](statistics-chart-selection.md)과 [Data to Viz 도넛 지침](https://www.data-to-viz.com/graph/donut.html)을 참고했다. 외부 지침은 시각화 관행이며 제품 효과의 증거가 아니다.
- 정산된 `usedMicro`, 미확인 `pendingMicro`와 서버에 저장된 `limitMicro`를 재사용한다. SQL의 두 집계는 상호 배타적이다. 남은 예산은 `max(0, limitMicro - usedMicro - pendingMicro)`이다. 저장 전 선택한 상한을 이미 적용된 예산으로 표시하지 않는다.
- 표시만 담당하는 APIBudgetSummary는 native SVG/HTML·기존 중립 토큰을 사용한다. 기존 Plotly 통계는 여러 종류/축/선택이 있는 탐색을 담당하며, 이번 세 부분과 금액에는 무거운 엔진을 추가 호출하지 않았다.
- 후속 사용자 정정에 따라 금액·비율 표시는 소수 한 자리까지로 제한한다. 0보다 크고 US$0.1보다 작은 금액은 ‘US$0.1 미만’으로 표시하며, 0.1% 미만의 양수 잔여를 0으로 표시하지 않는다. 상한 축소 뒤 초과분은 소수 한 자리 금액으로 안내하고 원호만 100%로 제한한다. 서버의 예약/차감/월/키/권한 계약은 변경하지 않았다.
- 생성 종료 시 설정을 다시 조회하되 저장 전 상한 선택을 덮어쓰지 않는다. 재접속/수동 조회에도 동일한 서버 집계를 사용하고, 조회 실패 시 이전 그래프와 ‘마지막 확인값’ 안내를 유지한다. 별도 유료 생성/설정 자동 저장은 없다.
- [OpenAI 선충전 안내](https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing)의 충전 잔액은 앱 월 예산과 다르다. 충전 잔액/청구서를 앱의 집계에서 추정하지 않고 기존 결제·잔액 확인 링크를 유지한다.

확인: 최종 관련 Vitest 11/11, 공통 토큰 검사/타입 포함 앱 빌드 통과. `npm run test:devices -- api-budget.pw.ts`의 다섯 WebKit에서 최초 금액, 예약 정산, 상한 축소, 사용 전, 새로고침과 문서 넘침 없음을 확인했다(5/5). 인앱 브라우저에서도 70%→정산 후70%→상한 축소0%와 초과 금액 안내를 실제 조작했다. 그래프 기기 검증은 실제 컴포넌트와 합성 금액이며 전체 로그인/공급자 청구 검증이 아니다.

근거: `work/api-budget-chart-20261001/unit-final.log`, `build-final.log`, `devices.log`, `preview.png`; 기기 원본 결과 `work/device-runs/run-uJfDJD/`. 공개 배포/추가 유료 API 호출/실제 키·예산·학습 자료 변경은 실행하지 않았다. 물리 기기와 실제 청구액은 이번 검증에 포함하지 않는다.

## 후속 한 자리 표시와 공개 배포 — 2026-10-01

사용자 후속 요청에 금액 US$7.0·비율70.0%의 한 자리 표시를 적용했고 원래 서버 집계 정밀도/키/월 상한/기록/소유자 권한을 보존했습니다. 최종 관련 단위11/11, 다섯 WebKit API 예산5/5, 공개 기준 앱 빌드 및 인앱 브라우저의 예약 정산/상한 축소 실제 조작이 통과했습니다. 현재 표시의 합성 금액 화면은 work/api-budget-chart-deploy-20261001/one-decimal-preview.png입니다.

source b1f7ac4가 통합된 1f30299를 [Pages36871842531](https://github.com/skmsmjs-netizen/study-space-generation2/actions/runs/36871842531) attempt2에서 배포했습니다. 빌드·다섯 환경·deploy 성공 뒤 공개 HTML/진입 JS·CSS/GPT 패널 JS·CSS 등7파일을 같은 실행의 verified-build와 바이트/SHA-256으로 대조해 전부 일치했습니다. 공개 번들의 한 자리/미만/잔여 표시도 확인했습니다. 앞선 ‘공개 배포를 실행하지 않았다’는 최초 로컬 확인 시점의 이력이며 이 후속 배포로 갱신합니다.

배포 도중 통계 기본 종류 변경에 따른 접근성 검사 대상 오류는 병행 수정3d6bf27을 채택하고 해당5환경 재검사로 확인했습니다. 별도의 대안 패치를 중복 공개하지 않았습니다. 환경 설치 지연·앞선 실패/취소 로그는 보존합니다. 상세 결과와 배포·공개 지문은 work/api-budget-chart-deploy-20261001/결과.md·deployment-run.json·public-verification.json·deployment-verification.json에 있습니다. 추가 유료 API 호출·실제 개인 기록/키/예산 변경은0이며 공개 로그인 후 실제 소유자 사용량 UI·물리 기기·공급자 청구액은 이번 후속에서 새로 검증하지 않았습니다.
