# 천문대 웹앱 개발 참조 조사 — 품질·성능·보안·저장·운영

조사일: 2026-10-02. 사용자 요청에 따른 조사 결과이며, 새 패키지 설치·운영 설정 변경·자료 이관·배포를 수행한 문서가 아니다. 기준 후보의 확인과 현재 제품의 준수 여부를 구분한다.

**이 프로젝트에는 기존 React/Vite·Supabase·검사 도구를 유지하면서, 핵심 과업의 실제 저장·복귀·반복 사용을 검증하는 구성이 가장 적합하다.** 고급 기술은 확인된 문제를 해결할 때 추가한다. 특히 천문대의 움직임과 큰 자료 처리를 함께 쓰는 화면에서는 입력 지연을 측정하고, 서버 승인·로컬 보관·미전송·실패를 실제 상태대로 보여 주는 것이 중요하다.

## 조사 범위와 대조 수

대표 항목은 **Q01–Q28, 총 28개**다. 단위/통합·브라우저·접근성·성능·보안·인증/권한·서버 원자성·로컬 저장·오프라인/동기화·백업·공급망·관측·고급 검증/계산을 모두 포함한다. 전 세계 도구를 모두 수집했다는 뜻은 아니다. 각 항목의 공식 원문·확인 내용·한계는 [출처 원장](quality-storage-sources.json)에 대응한다.

판정의 의미는 다음과 같다.

- **기존 유지**: 현재 의존성 또는 활성 아키텍처에 존재해 우선 재사용한다. 현재 구현 전체 통과를 뜻하지 않는다.
- **기본 권고**: 앞으로 해당 분야의 판단에 기본 참조로 삼을 후보다. 이번 조사만으로 프로젝트 최우선 지침을 새로 변경한 것은 아니다.
- **조건부**: 실제 요구·병목·비용·호환성이 확인될 때 도입 후보로 검토한다.
- **참고**: 위험 인식·비교에 유용하지만 시험 가능한 표준이나 직접 구현 수단과 구별한다.

## 현재 프로젝트와의 접점

직접 확인한 [package.json](../../../package.json)에는 Vitest, Testing Library, Playwright, axe/Storybook 접근성 애드온, Lighthouse가 이미 선언되어 있다. [개발 도구 안내](../../development-tools.md)의 실사용 순서는 공통 부품 상태 비교 → 실제 앱 구현 → 변경 관련 검사 → 실제 브라우저 확인이다. 이번 조사에서는 패키지를 실행하거나 설치 상태·브라우저 통과를 새로 검증하지 않았다.

[아키텍처](../../architecture.md)는 브라우저 UI → 저장 인터페이스 → 저장 어댑터 → 서버 책임을 구분한다. 실제 온라인 구현 절은 개인 명령을 로컬 원장에 보관하고 인증 API·도메인 명령·PostgreSQL 조건부 transaction에 연결하며, 사용자 단위 snapshot 원장이라고 설명한다. 일부 첨부 경로의 IndexedDB 사용과 전체 원장/outbox/자동 다기기 동기화 완료를 같게 취급하지 않는다.

[데이터 계약](../../data-contract.md)의 INV01·INV10·INV11·INV12·INV18·INV19·INV20이 선택 기준이다. 소유권, 동일 요청의 중복 적용 금지, 버전 충돌 시 양쪽 원문 보존, 되돌리기의 이력, 실제 저장 단계, 오래된 응답 무시, 내보내기/복원 완전성을 라이브러리 편의보다 우선한다.

## 28개 대표 기준·도구와 적용 판단

| ID | 대표 기준·도구 | 판정 | 이 앱에서의 역할·선정 이유 | 비용·한계·대안 |
|---|---|---|---|---|
| Q01 | [Vitest](https://vitest.dev/guide/) | 기존 유지 | 학습 의미·ID·집계·명령·변경 이력 등 순수 규칙과 저장 어댑터의 작은 검사를 기존 Vite 환경에서 실행한다. | 검사 작성·fixture 유지비가 든다. 단순 표시 변경마다 구현을 복제하는 테스트를 늘리지 않는다. |
| Q02 | [Testing Library](https://testing-library.com/docs/guiding-principles/) | 기존 유지 | 역할·이름·입력·실제 DOM 행동으로 공통 부품과 화면을 확인한다. | 가상 DOM은 실제 브라우저와 다르다. OS 한글 조합·기기 입력은 별도 실제 경로가 필요하다. |
| Q03 | [Playwright](https://playwright.dev/docs/best-practices) | 기존 유지 | 작성→수정→저장→재접속, 창·패널 복귀, 좁은 화면, 시각 회귀를 실제 브라우저에서 반복한다. | 독립 fixture·브라우저/기준 이미지 관리와 CI 시간이 든다. 모사 환경을 물리 기기 증거로 올리지 않는다. |
| Q04 | [axe-core](https://github.com/dequelabs/axe-core) | 기존 유지 | 누락 이름·구조·대비 등 자동으로 찾을 수 있는 접근성 결함을 부품과 대표 흐름에서 찾는다. | 위반 0개는 전체 준수 판정이 아니다. 초점 순서·터치·확대·조작을 관련 범위에서 직접 확인한다. |
| Q05 | [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) | 기존 유지 | 제품 빌드의 로딩과 병목을 고정 조건에서 비교하고 회귀 원인을 찾는다. | Storybook 개발 화면 점수를 제품 점수로 쓰지 않는다. 측정 변동과 로그인 상태를 기록한다. |
| Q06 | [Core Web Vitals](https://web.dev/articles/vitals) | 기본 권고 | 로딩 LCP, 반응 INP, 배치 안정성 CLS를 성능의 공통 언어로 삼는다. | 좋은 경계는 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1이며 실제 사용 75백분위를 기기군별로 본다. 자료가 없으면 현장 통과로 표시하지 않는다. |
| Q07 | [OWASP ASVS 5.0.0](https://owasp.org/projects/asvs) | 기본 권고 | 인증·권한·자료 보호·입력 처리의 검증 요구를 구체적인 버전/항목 ID로 연결한다. | 전체 인증 획득을 가정하지 않는다. 위험에 맞는 요구와 실제 허용/거부 시험이 필요하다. |
| Q08 | [OWASP Top 10:2025](https://top10.owasp.org/2025/) | 참고 | 접근 통제·공급망·설정·인증·예외 처리의 큰 누락을 점검하는 위험 지도다. | 교육·위험 분류용이다. ASVS의 상세 요구나 침투 시험을 대신하지 않는다. |
| Q09 | [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) / [Trusted Types](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) | 기본 권고 | 가져온 문서·수식·마크업이 실행 코드로 바뀌는 경계를 좁힌다. | 안전한 DOM 렌더링·정화가 먼저다. 정적 호스팅의 header/meta 제약과 기존 WASM·Worker·라이브러리 호환성을 확인한다. |
| Q10 | [Supabase Auth/JWT](https://supabase.com/docs/guides/auth/jwts) | 기존 유지 | 이미 사용하는 인증과 서버 측 소유자 확인을 유지한다. | 클라이언트에 secret/service-role을 두지 않는다. 인증 UI 숨김과 실제 서버 거부를 따로 확인한다. |
| Q11 | [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | 기존 유지 | 다른 사용자의 행을 읽고 바꾸지 못하도록 서버/DB 경계를 강제한다. | RLS가 켜졌다는 표시만으로 충분하지 않다. GRANT·보기·함수·Storage와 실제 경로를 함께 본다. |
| Q12 | [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | 기존 유지 | 버전 비교·실제 쓰기·수정 이력·중복 요청 판정을 원자적으로 연결한다. | 긴 잠금·재시도·직렬화 오류 비용이 있다. 앱의 명령 계약을 DB 연산에 반영해야 하며 ORM만으로 해결되지 않는다. |
| Q13 | [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) | 기존 유지 | 구조화 자료·첨부·초안·미전송 큐를 비동기로 보관할 수 있다. | 기존 저장 키·원문을 보존하는 점진 이관이 필요하다. 브라우저 삭제/퇴거·용량 실패·다중 탭을 다룬다. |
| Q14 | [Dexie.js](https://dexie.org/docs/Tutorial/Design) | 조건부 | 전체 로컬 계층을 정리할 때 질의·스키마/버전·transaction 관리 비용을 줄일 후보다. | 기존 래퍼와 중복 도입하지 않는다. 라이브러리 채택과 별도 Dexie Cloud 서비스 사용은 구별한다. |
| Q15 | [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) | 조건부 | 큰 녹음/파일이나 WASM 작업의 실제 파일 처리 병목이 있을 때 비교한다. | 일반 다운로드 폴더와 다르며 자동 백업도 아니다. 원본 bytes·호환·내보내기·이관 비용이 증가한다. |
| Q16 | [WebKit 저장 정책](https://webkit.org/blog/14403/updates-to-storage-policy/) | 기본 권고 | 용량 추정·persistent 요청·퇴거 가능성을 저장 UX와 복구에 반영한다. | 추정된 quota는 보장 공간이 아니다. Safari 특정 기기의 영구 보관을 문서만으로 보증하지 않는다. |
| Q17 | [Workbox](https://developer.chrome.com/docs/workbox/) | 조건부 | 온라인 저장이 안정된 뒤 앱 껍데기 캐시와 서비스워커 갱신을 관리한다. | 인증 자료의 오캐시·구버전 혼재·갱신 중 초안 손실 위험이 있다. 단순 앱 셸은 기존 작은 구현으로 충분할 수 있다. |
| Q18 | [Yjs](https://docs.yjs.dev/) | 조건부 | 동시 문서 편집 요구가 생기면 기존 CodeMirror/Monaco 등 편집기 연결 후보로 검토한다. | 공급자·영속화·권한·문서 삭제와 이력 설계가 별도로 필요하다. CRDT가 학습 기록의 의미 충돌을 해결하지 않는다. |
| Q19 | [Automerge Repo](https://automerge.org/docs/reference/repositories/) | 조건부 | 문서 단위 로컬 우선·병합 요구가 생길 때 JSON 유사 자료와 동기화 구조를 비교한다. | 기존 snapshot 원장 전환·과거 자료 호환 비용이 크다. Yjs와 둘 다 기본 설치할 이유는 없다. |
| Q20 | [GitHub Actions Secure Use](https://docs.github.com/en/actions/reference/security/secure-use) | 기본 권고 | 최소 권한, action 전체 commit SHA 고정, 비신뢰 PR 입력 처리, 배포 비밀 분리를 적용한다. | SHA를 고정한 뒤에도 유지보수와 업데이트 검토가 필요하다. 현재 workflow 준수는 이번에 감사하지 않았다. |
| Q21 | [Dependency Review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review) | 기본 권고 | lockfile의 간접 의존성까지 변경·취약점을 검토한다. | 저장소/상품별 이용 조건이 있다. 이용 불가 시 기존 패키지 보안 검사와 변경 검토를 유지한다. |
| Q22 | [OpenTelemetry JS](https://opentelemetry.io/docs/languages/js/) | 조건부 | 브라우저 요청과 서버 처리 사이 지연 원인을 공통 trace/metric으로 연결할 필요가 있을 때 검토한다. | 브라우저 계측은 공식 문서상 experimental이다. 수집기 운영·보관·샘플링·개인정보 관리 비용이 있다. |
| Q23 | [Sentry JS SDK](https://github.com/getsentry/sentry-javascript) | 조건부 | 출시 후 재현하기 어려운 오류를 파악할 필요가 있을 때 기존 자체 오류 기록과 비교한다. | SDK 존재는 확인했다. 개인정보 설정 상세·가격은 문서 접근 문제로 이번에 확정하지 않았다. 외부 전송·Replay를 자동 활성화하지 않는다. |
| Q24 | [MSW](https://mswjs.io/docs/) | 조건부 | 저장 실패·지연·만료·충돌 응답을 Storybook과 검사에서 같은 계약으로 재현한다. | 현재 repository fake/Playwright route가 충분하면 유지한다. mocks를 제품 서비스워커나 실제 서버 검증과 혼동하지 않는다. |
| Q25 | [fast-check](https://fast-check.dev/docs/introduction/) | 조건부 | 다양한 명령 순서에서도 ID·원문·중복 적용·복원 속성이 유지되는지 검사한다. | 평범한 예제 검사로 충분한 코드에는 도입하지 않는다. seed·최소 재현·도메인 생성기 유지비가 있다. |
| Q26 | [Supabase Backups](https://supabase.com/docs/guides/platform/backups) | 기본 권고 | DB 백업의 보관 기간·복원점과 실제 복원 절차를 운영 책임으로 관리한다. | DB 백업에는 Storage 객체 bytes가 포함되지 않는다. 앱 초안·첨부·미전송 자료와 별도 보관이 필요하다. 요금제/PITR 추가 비용은 조건부다. |
| Q27 | [Supabase Realtime](https://supabase.com/docs/guides/realtime/postgres-changes) | 조건부 | 다른 기기의 변경을 알아차리는 알림 경로로 검토한다. | 누락 없는 Sync 원장이 아니다. 재접속 재조회·버전/명령 대조·권한·구독 비용을 함께 설계한다. |
| Q28 | [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) | 조건부 | OCR·파싱·그래프 배치 등 메인 스레드 계산이 입력을 막는 경우 분리한다. | 메시지/복사 비용·취소·오래된 응답·Worker 실패를 다룬다. DOM 조작을 그대로 옮길 수 없다. |

## 현재 문서에서 확인한 변경·도입 경계

**보안 문서를 오래된 기억으로 고르면 필요한 제약을 놓칠 수 있다.** 공식 OWASP 페이지는 ASVS 5.0.0과 Top 10:2025를 제공한다. 문서 연결에는 버전을 남긴다. Trusted Types는 현재 MDN에서 Baseline 2026으로 표시되므로 Chromium만의 기능이라고 설명하지 않는다. 다만 사용자가 가진 구버전 브라우저와 현재 렌더링 라이브러리의 실제 지원은 적용할 때 확인한다.

**Supabase의 테이블 노출과 행 접근은 따로 관리해야 한다.** 공식 문서상 GRANT는 객체에 접근할 수 있는 역할을, RLS는 그 역할이 읽고 바꿀 수 있는 행을 제한한다. 공식 changelog에는 새 테이블의 Data API 자동 노출 중단이 기존 프로젝트에도 2026-10-30 적용 예정이라고 안내된다. 다음 스키마 작업에서는 새 테이블/함수의 명시적 권한과 RLS를 함께 migration에서 관리하는 것이 적절하다. 이것은 현재 운영 앱에 장애가 있다는 판정이 아니다. [Data API 보안](https://supabase.com/docs/guides/api/securing-your-api), [공식 변경 안내](https://supabase.com/changelog?types=breaking-change)

**DB의 최적화는 실제 질의 계획에서 시작한다.** 필요한 필터·조인·소유자 컬럼의 인덱스, 요청 결과 크기, transaction의 잠금 시간을 먼저 확인한다. 스킬의 ‘몇 배 빨라진다’는 예시를 이 앱의 효과로 인용하지 않는다. 인덱스는 쓰기와 저장 공간 비용도 있으므로 측정 없이 모든 컬럼에 추가하지 않는다. [Supabase 질의 최적화](https://supabase.com/docs/guides/database/query-optimization)

## 이 프로젝트에 특히 유용한 고급 기법

아래는 공식 도구의 기능과 현재 보존 계약을 연결한 **프로젝트 적용 제안**이다. 새 국제 표준이나 이미 구현·통과한 결과가 아니다.

1. **실제 과업을 기준으로 한 검사 층 연결.** 기록 규칙은 Vitest, 입력·부품 반응은 Testing Library, 실제 브라우저의 저장·복귀는 Playwright로 역할을 나눈다. 같은 의미를 여러 도구로 반복하는 대신 각 층이 놓치는 실패를 보완한다. 서버 권한 변경은 별도 시험 계정의 허용/거부와 실제 서버 결과가 필요하다.
2. **실패를 재현하는 계약 기반 화면 설계.** Figma에 저장 중·로컬 보관·서버 반영·충돌·재시도 상태를 정하고, 기존 repository fake 또는 필요할 때 MSW로 같은 상태를 실행한다. 서버가 거부한 결과를 성공 애니메이션으로 표현하지 않는다.
3. **명령 중복과 버전 충돌을 한 transaction에서 처리.** 사용자/namespace·opId·payloadHash·expectedVersion을 검증하고 본문·이력·반영 결과를 함께 처리한다. 응답 유실 뒤 재시도와 같은 opId의 다른 본문을 별도로 시험한다. 낙관적 화면 반응은 가능하지만 서버 승인 상태를 앞당기지 않는다.
4. **로컬 원본과 outbox의 원자적 보관.** 전체 로컬 저장 계층을 확장할 때 자료 변경과 미전송 명령 등록을 같은 IndexedDB transaction에 넣는다. 뒤늦은 네트워크 성공·계정 변경·탭 경합에서도 원문과 명령 소유권을 유지한다. 단순 캐시 삭제가 미전송 자료를 지우지 않도록 구별한다.
5. **보존 규칙의 속성 기반 검사.** 생성한 명령 열에서 ‘중복 요청으로 공부 횟수가 늘지 않는다’, ‘휴지통·복원 후 같은 ID와 글이 남는다’, ‘다른 소유자의 자료는 들어오지 않는다’를 검사한다. 단위 규칙이 복잡해졌을 때 fast-check를 검토한다.
6. **천문대 표현을 포함한 성능 예산.** 실제 자료량을 기준으로 초기 진입·반복 입력·패널 이동·그래프 조작의 지연과 메모리를 측정한다. CWV와 함께 프로젝트의 실제 편집 동작을 관찰한다. 불필요한 모션 제거만으로 해결했다고 하지 않고 그리기 범위, 갱신 빈도, 지연 로딩, 비싼 계산의 Worker 분리를 원인에 맞춰 선택한다.
7. **시각 회귀의 결정적 조건.** 글꼴·테마·viewport·자료·시간/난수 조건을 고정해 배치와 글자 차이를 비교하고, 애니메이션의 실제 동작은 별도로 시험한다. 임의로 전부 정지시킨 이미지 통과를 움직이는 제품의 품질로 주장하지 않는다.
8. **복원의 시험과 저장원의 대조.** 백업 파일이 존재하는지에 더해 ID·원문·이력·초안·설정·배치·첨부 bytes를 격리된 곳에서 복원해 대조한다. DB 백업, 앱 ZIP, 로컬 미전송 자료, Storage 객체의 담당 범위를 구분한다.
9. **개인 자료를 보내지 않는 오류 관측.** 먼저 오류 종류·버전·단계·시간 등 최소 자료로 진단한다. 공부 본문·답안·녹음·토큰·URL의 개인 식별값을 외부 오류 서비스에 실어 보내지 않는 설계를 확인한다. 원격 수집이 필요하면 목적·보관·삭제·샘플링·계정/비용을 확정한 다음 해당 범위에서 연결한다.
10. **변경과 일치하는 검증 증거.** 적용한 commit/빌드와 검사 결과·브라우저·fixture 조건을 연결한다. 병행 작업 중 다른 버전의 검사 통과를 현재 변경의 근거로 사용하지 않고, 새 변경·실패가 없으면 의미 없는 전수 재검사를 늘리지 않는다.

## 적용 순서와 완료 판단

**우선 재사용:** 현재 Vitest/Testing Library/Playwright/axe/Lighthouse와 Supabase Auth/RLS/PostgreSQL 계약을 해당 사용자 과업에 연결한다. 외형을 고르기 전에 기능마다 서버 승인·실패·복구에 대한 화면 상태를 명시한다.

**조건이 생길 때 추가:** 같은 API 상태가 여러 곳에 중복되면 MSW, 원장 입력 조합의 위험이 커지면 fast-check, 로컬 저장 계층 정비 시 Dexie, 계산 병목이 있으면 Worker를 검토한다. PWA/Workbox·OPFS·CRDT·외부 관측 서비스는 실제 요구와 운영 부담이 더 크므로 별도 근거가 있어야 한다.

**설계 기준과 구현 결과를 구분:** 공식 문서를 읽은 것, 패키지 선언, 로컬 모사 통과, 실제 브라우저 실행, 운영 서버 반영, 공개 배포, 물리 기기 결과를 각각 기록한다. 기존 다섯 합의 기기 모사 기준을 재사용하며 VoiceOver 전용 작업·제외된 결제/문의 기능을 이번 조사로 재개하지 않는다.

## 스킬 사용과 확인 한계

이번 조사에서는 [Supabase 스킬](/Users/manseeksong/.codex/plugins/cache/openai-curated-remote/supabase/1.0.0/skills/supabase/SKILL.md)과 [Postgres Best Practices 스킬](/Users/manseeksong/.codex/plugins/cache/openai-curated-remote/supabase/1.0.0/skills/supabase-postgres-best-practices/SKILL.md)을 실제 읽었다. 현재 공식 문서·변경 안내 확인, GRANT/RLS 책임 구분, 인덱스/질의 계획·짧은 transaction 검토에 절차를 활용했다. 대표 reference 세 편도 읽었으며 스킬의 효과 수치를 이 앱의 성능으로 일반화하지 않았다. 서버 조회나 schema 변경·권한 변경·migration 실행은 수행하지 않았다.

공식 웹 조회에서 Supabase changelog의 Markdown 엔드포인트가 오류를 반환해 HTML 변경 목록으로 전환했다. Automerge 문서 입구가 열리지 않아 실제 repositories 하위 문서로 확인했다. Sentry 상세 문서는 조회 도구가 Markdown 응답 형식을 처리하지 못해 공식 GitHub SDK 저장소로 제품/패키지 존재를 확인했다. 개인정보 설정의 현재 기본값·요금·수집 항목은 미확정이며, 정확한 도입 설정을 이번에 완성했다고 표시하지 않는다.

나머지 항목의 공식 페이지 접근·본문과 현재 프로젝트의 관련 선언/계약을 확인했다. 이 조사는 실제 운영 보안 감사·부하 시험·브라우저 보관 보증·물리 기기 검증을 수행한 결과가 아니다.

