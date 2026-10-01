# 여러 창에서 개인 공간 열기와 입력 위치 복원

2026-10-01 사용자 요청으로 개인 공간 전체의 lifetime writer 잠금을 창별 journal lease로 좁힙니다. 새 창은 독립 원장과 초안 사본을 사용하며 기존 탭·원문·legacy 저장 키를 보존합니다. 새 탭은 같은 계정/기기의 마지막 입력 경로와 커서/스크롤 힌트를 참고하고 자기 탭 위치 및 명시 URL이 우선합니다. 승인·서버 소유자 검사는 유지합니다.

기존 서버 CAS·작업 ID/receipt·충돌 보존을 재사용합니다. 다른 엔터티의 변경만 원본이 같음을 확인하고 재적용하며 같은 엔터티의 경쟁 수정은 양쪽 원문을 보존합니다. 기록 내려받기에 같은 계정의 다른 창 원장/초안 사본을 포함합니다. 탈퇴 정리는 shared sessions와 이전 writer를 확인합니다. IndexedDB에 상태와 미전송 명령을 같이 보관합니다.

[Web Locks 작업 초안](https://w3c.github.io/web-locks/)과 [sessionStorage 문서](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)를 확인했으며 새 라이브러리 없이 기존 저장·탐색 경로에 연결했습니다. Web Locks는 서버 권한 검사가 아니며 탭 복제 시 sessionStorage 식별자를 독점 lease로 확인합니다.

이번 배포는 최신 공개 main에 해당 변경만 적용합니다. 병행 PDF·필기·브랜드·GPT 기능은 자동 포함하지 않습니다. 시험 서버/계정의 다섯 WebKit 모사 환경과 운영 서버·실계정·물리 기기 결과를 구별합니다. 공개 배포 실행과 최종 자산은 작업 인계/검증 기록에 남깁니다.
