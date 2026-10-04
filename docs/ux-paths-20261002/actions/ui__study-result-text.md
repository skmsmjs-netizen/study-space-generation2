# src/ui/study-result-text.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-9245d5c4ef7a

**display ? '수식 · 가로로 이동해 전체 보기' : undefined** · span · event-surface

- 실제 소스: [src/ui/study-result-text.tsx:38](../../../src/ui/study-result-text.tsx#L38)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R12](../paths/R12.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U24](../paths/U24.md), [U25](../paths/U25.md), [U28](../paths/U28.md), [U40](../paths/U40.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → 네이티브/호출자 동작

```tsx
display
          ? (event) => {
              const element = event.currentTarget;
              if (event.target !== element || element.scrollWidth <= element.clientWidth) return;
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                element.scrollLeft +=
                  ((event.key === 'ArrowLeft' ? -1 : 1) * element.clientWidth) / 4;
              }
            }
          : undefined
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

