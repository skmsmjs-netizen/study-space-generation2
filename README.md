# 학습 공간 · 2세대

**2026-09-30 Prototype 후속 기준:** [새 실행/한계](docs/resume-handoff.md), [Phase·CORE45](docs/phase-report-followup-20260930.md)를 먼저 확인합니다. 앱 `ce6ee43`/자동170개/별도성능1개 미실행/실제B10–B19/원본1851변경0·누락0. 과목·단원·주제 표, 형제정렬, 입력Modal초안, 장문선택/내부scroll, 기준Undo, 자유기록ID복구를 반영했습니다. 원장1367행이며 상위 UX·온라인·물리·장기 gate는 미검증입니다. 아래 이전 시점 내용은 역사적 범위입니다.


1세대 연구와 기록 의미를 계승하는 독립형 학습 웹앱입니다. 현재 개발 단계와 미검증 범위는 docs/phase-status.md에 기록합니다.

실제 사용자 자료·대화·Vault·인증 비밀·원본 백업은 이 저장소에 포함하지 않습니다. 가짜 데이터는 demo namespace에서만 사용합니다. 1세대는 별도로 보존되어 있으며 이 앱에서 변경하지 않습니다.

## 현재 사용 가능한 것

가짜 자료로 동작하는 Prototype입니다. 홈, 학기·과목·깊이 제한 없는 목차, 여러 주제 기록, 개인 공부 기준, 활동별 예외·메모·반복, C2 서술 점검, 여러 자유 기록, 초안, 수정 이력, 목차 이동·Undo·휴지통·복원, 검색과 탐색 복원을 포함합니다. 실제 학습자료를 넣는 단계가 아닙니다. 일반 화면 너비에서는 왼쪽 탐색, 좁은 창에서는 하단 탐색을 사용합니다.

[배포된 시연 앱](https://skmsmjs-netizen.github.io/study-space-generation2/) · [현재 실행 원장](docs/execution-ledger.md) · [정확한 다음 실행 위치](docs/resume-handoff.md)

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
```

브라우저에서 `http://127.0.0.1:4173/`을 엽니다. 개발은 `npm run dev`입니다. 개발 중 자동 재로딩과 단일 작성 창 잠금이 겹치면 페이지를 완전히 새로고침합니다. 시연 저장소의 동시 덮어쓰기를 막기 위해 한 번에 한 창에서 작성합니다.

- [검증 기록과 A–G 조작 비용](docs/prototype-validation.md)
- [Phase0–37와 C01–C45](docs/phase-status.md)
- [49개 기능 마이그레이션 계약](docs/migration-spec.md)
- [데이터 계약·22개 불변조건](docs/data-contract.md)
- [디자인 시스템](docs/design-system.md), [공통 컴포넌트](docs/component-matrix.md)
- [실패 행렬](docs/failure-matrix.md), [도메인 성능 측정](docs/domain-performance.md)

2026-09-30: 공개 GitHub/Pages 배포와 실제 상세 URL 새로고침을 확인했습니다. 자동검사119개 통과/성능1개 미실행이며, 실제 브라우저와 iPhone 17 Pro 사용자 보고의 범위는 [이번 검증](docs/validation/resume-ui.md)에 분리했습니다. Supabase는 프로젝트 생성·Healthy만 확인했습니다. Auth/RLS/온라인 데이터, 정식 IndexedDB/Offline/Sync/Conflict, PWA, 실제 Obsidian Import는 연결 전입니다. 전체 물리기기/IME/다기기 검증은 별도 gate입니다.
