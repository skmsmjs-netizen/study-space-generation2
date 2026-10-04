# src/ui/outline-tree.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-082d959dc642

**`${roleLabels[node.role]} ${fullPath}${duplicatePath ? ` · 구분 ID: ${node.id}` : ''}${hasRecord ? ' · 기록 있음' : ''} · 공부함 기록 ${count}회`** · a · user-control

- 실제 소스: [src/ui/outline-tree.tsx:38](../../../src/ui/outline-tree.tsx#L38)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [U16](../paths/U16.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(node.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**onKeyDown** → [@onKeyDown · H-e9e06a863d05](../handlers/ui__outline-tree.md#h-e9e06a863d05) → [@callback:rows.findIndex · H-6edf1f3c5c6e](../handlers/ui__outline-tree.md#h-6edf1f3c5c6e) → [@callback:rows.findIndex · H-5f4f06eae15b](../handlers/ui__outline-tree.md#h-5f4f06eae15b)

```tsx
event => {
                if (event.nativeEvent.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                let next: number | undefined;
                if (event.key === 'ArrowDown') next = Math.min(index + 1, rows.length - 1);
                if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
                if (event.key === 'Home') next = 0;
                if (event.key === 'End') next = rows.length - 1;
                if (event.key === 'ArrowLeft') next = rows.findIndex(row => row.node.id === node.parentId);
                if (event.key === 'ArrowRight') next = rows.findIndex(row => row.node.parentId === node.id);
                if (next === undefined || next < 0) return;
                event.preventDefault();
                list.current?.querySelectorAll<HTMLAnchorElement>('a.node-link')[next]?.focus();
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0fcaf10a50ea, B-18d71331a83d, B-a7ceba90be8c, B-184997949329, B-3e8d8b00d4ce, B-d2b2a041da9b, B-e5cff81fdc8f, B-e407397a58be

반복: map(rows) · 32행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

