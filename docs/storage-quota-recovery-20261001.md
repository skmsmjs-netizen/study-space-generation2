# 기기 저장 용량 복구

공개 개인 공간에서 원장 사본의 localStorage QuotaExceededError와 로그인 저장 probe 실패가 재현됐다. 작은 저장소에 먼저 쓰도록 강제하던 IndexedDB 미러를 보완했다. 원장/미전송 변경 전체의 IndexedDB 트랜잭션 완료 전에는 서버에 보내지 않는다. 용량 초과 때 DB 전용 원장으로 계속 저장하고 기기 보관 완료와 서버 성공을 구별한다.

로그인/토큰 갱신의 실제 용량 초과에서만 현재 앱의 유효한 원장 사본을 기존 키 그대로 IndexedDB로 옮긴다. 원문/명령/ID/이력/당시 상태 전체를 보관한 뒤, 아직 같은 내용인 localStorage 슬롯만 정리한다. 살아 있는 창의 lease는 건드리지 않으며 손상/미지정 저장 형식, 초안/인증 키/다른 자료는 옮기지 않는다. 이전 DB 내용이 다르면 복구 사본을 함께 보관한다. DB도 실패하면 기존 슬롯을 유지하고 서버로 전송하지 않는다.

DB 전용 창도 이전 창 힌트가 없어진 새 방문에서 발견하고 해당 원장으로 복귀한다. 임시 로그인 선택은 계속 sessionStorage만 사용하고 영구 로그인으로 바꾸지 않는다. 전체 ZIP 백업의 journals/recovery 보존 경로를 유지한다.

기존 IndexedDB 트랜잭션과 Web Locks, Supabase 비동기 SupportedStorage를 재사용했다. [MDN 저장 용량과 삭제 기준](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)에서 Web Storage와 별도 IndexedDB 용량/완료 확인을 대조했다. 무제한 공간을 보장하지 않으며 접근 차단, 실제 디스크/IndexedDB 부족, 아직 열린 작성 창은 사실에 맞게 안내한다.

검사 범위와 최초 실패/보수/최종 결과는 작업 경로 work/storage-quota-repair-20261001의 보고를 따른다. 격리된 실제 브라우저 합성 자료와 기존 실제 개인 계정 검증은 구별한다. 개인 계정 비밀번호를 읽거나 실제 기록/진행 상태를 시험 자료로 사용하지 않는다.
