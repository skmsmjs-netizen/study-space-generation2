# 여러 창의 화면 설정과 초안 보존

본문 읽기 폭과 그래프 보기 설정은 같은 계정·기기의 창에서 재사용합니다. 다음 행동·이어 쓰던 글·수식 초안은 기존 창별 사본을 유지하며 다른 창의 글을 자동 적용하지 않습니다. 기존 namespace·계정·저장 키와 원문 공백·줄바꿈·이력은 유지합니다.

기존 `experience:v1`을 창별 초안처럼 읽을 때 새 창에는 빈 문자열 표시가 반환될 수 있습니다. 이를 JSON으로 읽던 오류는 빈 표시의 의미를 구분해 해결합니다. 읽기 폭은 `experience:v1:reading-width:v1`에 normal/wide만 보관하고, 아직 이 키가 없으면 기존 값에서 읽기 폭만 재사용합니다. 읽기만으로 원본을 바꾸지 않으며 다음 행동과 원문은 가져오지 않습니다. 그래프의 기존 `graph-view:v1`은 공통 보기 설정으로 읽습니다. 이전 window-author와 recovery 사본은 삭제하거나 이관하지 않습니다.

본문 읽기 폭을 바꾸면 기존 창의 표시도 갱신합니다. 저장 실패·읽기 확인 실패는 성공으로 처리하지 않으며 현재 선택과 글을 기존 rescue에 남겨 재시도합니다. 손상된 실제 원문은 초기화하지 않습니다. 새 읽기 폭 키는 기존 소유자별 전체 백업·계정 정리 범위에 포함되며 서버 공부 원장에 기록하지 않습니다.

적용 경로는 personal-draft-window.ts, experience-state.ts, brand-experience.tsx입니다. 관련 단위 검사는 다른 창/이전 사본/정확한 다음 행동 원문/저장 실패/재시도/손상 자료/백업·계정 정리를 확인하고, personal-settings.pw.ts는 다섯 화면 환경에서 개인 공간 두 창의 읽기 폭/재접속/이전 원문 사본/공부 쓰기0을 확인합니다. physical device·OS IME·Pencil·VoiceOver의 결과와 구별합니다.

기준은 [Storage.getItem의 null과 문자열 구별](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem), 기존 draft rescue와 소유자별 저장 계약, 기기별 preference/창별 draft의 분리입니다. 새 패키지를 추가하지 않습니다.

전체 백업은 화면에 적용할 창별 값을 대신 쓰지 않고 기기에 저장된 원문과 각 recovery 키를 그대로 보관합니다. 실패한 쓰기의 메모리 원문만 기존 device-scope rescue로 재사용합니다. 다른 창의 빈 표시와 정상 창별 표시 사본이 primary 원문을 대체하던 사례를 실제로 재현한 뒤 수정했으며, full-backup-window-settings 검사는 primary·window-author·각 창 사본의 정확한 백업/복원과 고립 UTF16을 확인합니다. 백업 원문 손상 재현 전 로그와 수정 후 검사 결과는 work/settings-repair-20261001에 보존합니다.
