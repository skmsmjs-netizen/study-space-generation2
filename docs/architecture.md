# 아키텍처 결정 · 2026-09-29

상태: 개발 기준 채택. 배포·온라인·오프라인 동작 검증은 별도 Phase이며 채택만으로 통과하지 않는다.

React + TypeScript + Vite를 사용한다. 과목/범위/초안/원기록 상태를 명시적으로 연결하고 공통 컴포넌트를 재사용하며, Obsidian DOM 및 파일 이벤트를 웹으로 복제하지 않는다. 별도 SSR 서버, Next.js, 자체 인증 서버는 필요하지 않다.

GitHub를 코드 기준으로 하고 GitHub Pages에 정적 app shell을 배포한다. 하위 저장소 경로를 Vite base로 지정하고 hash route로 직접 링크·새로고침을 지원한다. Auth callback의 허용 URL은 실제 배포 주소에 맞춘다. 현재 로컬 독립 Git에서 시작하며 원격 생성·배포 전까지 GitHub 완료로 표시하지 않는다.

Supabase PostgreSQL/Auth는 온라인 승인 데이터·조건부 쓰기·관계 무결성·사용자 소유권을 맡는다. 모든 사용자 행은 RLS 및 소속 FK로 보호한다. 프런트는 publishable key만 사용하며 service-role/secret을 포함하지 않는다. Realtime 알림은 변경 통지를 보조할 뿐 누락 없는 Sync 원장이 아니다.

IndexedDB는 온라인 기본 CRUD를 검증한 다음 추가한다. 캐시와 미전송 원본/초안/outbox를 구별하며, 로컬 엔터티 변경+outbox는 하나의 transaction으로 commit한다. PWA 서비스워커는 앱 껍데기만 관리하고 인증 응답/API를 무조건 캐시하지 않는다.

## 모듈 경계

- domain: ID, 범위, 계층, 실제 사건/기록, TRACE, 삭제/이력의 순수 명령과 검증.
- data: 먼저 demo 저장소, 다음 Supabase online adapter, 이후 IndexedDB/outbox adapter. UI는 저장 상태를 구별한다.
- ui: semantic token, 실제 공통 컴포넌트, 접근성·터치·키보드 상태.
- features: 홈·목차·기록·일정·조회. 한 번만 쓰는 화면은 억지 범용화하지 않는다.
- migration: 읽기 전용 parser → validation → preview → dry-run → import → integrity. 원본 수정 금지.

## 순서 변경 근거

이전 발굴 초안의 '초기부터 offline 세로 흐름 실증'보다 현재 요청의 '가짜 데이터 UX → 온라인 정상동작 → IndexedDB/offline'이 우선한다. 데이터 불변조건은 미리 정의하지만 온라인 검증 전에 offline 구현 완료로 넘어가지 않는다.

## 근거

- [Vite GitHub Pages 배포](https://vite.dev/guide/static-deploy)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase 사용자 데이터](https://supabase.com/docs/guides/auth/managing-user-data)
- [WebKit 저장 정책](https://webkit.org/blog/14403/updates-to-storage-policy/)

이 문서에 실제 사용자 자료·계정 비밀·비공개 대화는 포함하지 않는다.

## 2026-09-30 실제 온라인 구현

이제 StudyRepository 경계에서 demo와 personal 구현을 분리하고 기존 입력 화면을 재사용합니다. 개인 명령은 local journal에 먼저 보관한 뒤 인증 API·도메인 명령·PostgreSQL CAS transaction에 연결됩니다. 서버 승인 snapshot/sequence와 미전송 원문을 구별합니다. [온라인 저장 계약](online-storage.md)에 실제 적용·권한·보존·검증·직접 잔여를 기록했습니다. 현재는 사용자 단위 snapshot 원장이며 엔터티별 서버 정규화, IndexedDB 및 자동 다기기 Sync 완료를 뜻하지 않습니다.
