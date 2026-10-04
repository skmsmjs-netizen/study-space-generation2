# src/ui/full-backup.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b0e346d450b1

**requestDownload** · [src/ui/full-backup.tsx:6](../../../src/ui/full-backup.tsx#L6)

분기 조건과 가능한 갈림길:

- B-80b87f5a22a9 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (10행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 9행 | 별도 조건식 없음 | document.body.append(anchor)<br>call |
| 10행 | 별도 조건식 없음 | anchor.click()<br>call |
| 10행 | always-after-try: try 완료 또는 예외 이후 | anchor.remove()<br>call |

## H-715f0d33795a

**errorText** · [src/ui/full-backup.tsx:12](../../../src/ui/full-backup.tsx#L12)

분기 조건과 가능한 갈림길:

- B-10c75b835366 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).

## H-00763f50eb7a

**FullBackup** · [src/ui/full-backup.tsx:13](../../../src/ui/full-backup.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 15행 | 별도 조건식 없음 | useState(false)<br>call |
| 15행 | 별도 조건식 없음 | useState('')<br>call |
| 15행 | 별도 조건식 없음 | useState('')<br>call |
| 16행 | 별도 조건식 없음 | useState(null)<br>call |
| 16행 | 별도 조건식 없음 | useState(false)<br>call |
| 16행 | 별도 조건식 없음 | useState(false)<br>call |
| 18행 | 별도 조건식 없음 | useState(null)<br>call |
| 21행 | 별도 조건식 없음 | useEffect(() => () => { if (prepared) URL.revokeObjectURL(prepared.url); }, [prepared])<br>call<br>전달 콜백: H-5a02b567513e |
| 22행 | 별도 조건식 없음 | useEffect(() => { if (prepared && prepared.ownerKey !== ownerKey) setPrepared(null); }, [ownerKey, prepared])<br>call<br>전달 콜백: H-a90f29415d98 |
| 32행 | 별도 조건식 없음 | useEffect(() => { const areas = Array.from(document.querySelectorAll<HTMLElement>('.sidebar, .topbar, .bottom-nav')); for (const area of areas) area.inert = busy \|\| restored; return () => { for (const area of areas) area.inert = false; }; }, [busy, restored])<br>call<br>전달 콜백: H-7618607deed2 |
| 37행 | 별도 조건식 없음 | useState([])<br>call |
| 38행 | 별도 조건식 없음 | useEffect(() => { void priorRestoreBackups(owner).then(setPrior).catch(error => setError(errorText(error))); }, [owner])<br>call<br>전달 콜백: H-4d0da1b201fb |
| 39행 | 별도 조건식 없음 | useEffect(() => { if (!busy && !restored) return; const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; }; window.addEventListener('beforeunload', prevent); return () => window.removeEventListener('beforeunload', prevent); }, [busy, restored])<br>call<br>전달 콜백: H-4c694083c815 |
| 74행 | truthy: !restored ∧ truthy: checked | new Date(checked.manifest.createdAt).toLocaleString('ko-KR')<br>call |
| 74행 | truthy: !restored ∧ truthy: checked | checked.rows.filter(row => row.value instanceof Blob)<br>call<br>전달 콜백: H-531f0895185c |
| 89행 | truthy: prior.length > 0 | prior.map(row => <p key={row.id}><Button disabled={busy} variant="quiet" onClick={() => download(row.file, `study-before-restore-${row.id}.zip`)}>{new Date(row.createdAt).toLocaleString('ko-KR')} 보관본 내려받기</Button></p>)<br>call<br>전달 콜백: H-7f822201beb7 |

반환/조기 중단: 68행 <render> [별도 조건식 없음]

## H-5a02b567513e

**@callback:useEffect** · [src/ui/full-backup.tsx:21](../../../src/ui/full-backup.tsx#L21)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a90f29415d98

**@callback:useEffect** · [src/ui/full-backup.tsx:22](../../../src/ui/full-backup.tsx#L22)

분기 조건과 가능한 갈림길:

- B-b06cf9f529a0 · IfStatement · prepared && prepared.ownerKey !== ownerKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (23행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | truthy: prepared && prepared.ownerKey !== ownerKey | setPrepared(null)<br>state-update |

## H-1a13821307fd

**download** · [src/ui/full-backup.tsx:25](../../../src/ui/full-backup.tsx#L25)

분기 조건과 가능한 갈림길:

- B-96423dcc4ed6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (29행).
- B-8b82b726a2ce · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | URL.createObjectURL(file)<br>call |
| 27행 | 별도 조건식 없음 | setPrepared({ url, name, ownerKey })<br>state-update |
| 28행 | 별도 조건식 없음 | setNotice('백업 파일을 준비했습니다. 다운로드 목록에서 저장을 확인해 주세요. 파일이 없으면 아래에서 다시 저장할 수 있습니다.')<br>state-update |
| 29행 | 별도 조건식 없음 | requestDownload(url, name)<br>call → [H-b0e346d450b1](ui__full-backup.md#h-b0e346d450b1) |
| 30행 | exception: exception | setNotice('백업 파일을 준비했습니다. 아래에서 파일을 저장해 주세요.')<br>state-update |

## H-7618607deed2

**@callback:useEffect** · [src/ui/full-backup.tsx:32](../../../src/ui/full-backup.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | Array.from(document.querySelectorAll<HTMLElement>('.sidebar, .topbar, .bottom-nav'))<br>call |
| 33행 | 별도 조건식 없음 | document.querySelectorAll('.sidebar, .topbar, .bottom-nav')<br>call |

반환/조기 중단: 35행 () => { for (const area of areas) area.inert = false; } [별도 조건식 없음]

## H-4d0da1b201fb

**@callback:useEffect** · [src/ui/full-backup.tsx:38](../../../src/ui/full-backup.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | 별도 조건식 없음 | priorRestoreBackups(owner).then(setPrior).catch(error => setError(errorText(error)))<br>call<br>전달 콜백: H-cae5adeaf5da |
| 38행 | 별도 조건식 없음 | priorRestoreBackups(owner).then(setPrior)<br>call |
| 38행 | 별도 조건식 없음 | priorRestoreBackups(owner)<br>call |

## H-cae5adeaf5da

**@callback:priorRestoreBackups(owner).then(setPrior).catch** · [src/ui/full-backup.tsx:38](../../../src/ui/full-backup.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | rejected: priorRestoreBackups(owner).then(setPrior) | setError(errorText(error))<br>state-update |
| 38행 | rejected: priorRestoreBackups(owner).then(setPrior) | errorText(error)<br>call → [H-715f0d33795a](ui__full-backup.md#h-715f0d33795a) |

## H-4c694083c815

**@callback:useEffect** · [src/ui/full-backup.tsx:39](../../../src/ui/full-backup.tsx#L39)

분기 조건과 가능한 갈림길:

- B-7af3a2bfb123 · IfStatement · !busy && !restored → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | window.addEventListener('beforeunload', prevent)<br>call<br>전달 콜백: H-01708d1eeaf4 |

반환/조기 중단: 40행 <render> [truthy: !busy && !restored]; 42행 () => window.removeEventListener('beforeunload', prevent) [별도 조건식 없음]

## H-01708d1eeaf4

**prevent** · [src/ui/full-backup.tsx:41](../../../src/ui/full-backup.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-f05eb78d7965

**backup** · [src/ui/full-backup.tsx:44](../../../src/ui/full-backup.tsx#L44) · async

분기 조건과 가능한 갈림길:

- B-3ba3748071ea · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (47행).
- B-67f4de5b7ced · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (48행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 45행 | 별도 조건식 없음 | setError('')<br>state-update |
| 45행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 47행 | 별도 조건식 없음 | createFullBackup(owner, undefined, repository.getBackupKey?.())<br>call |
| 47행 | 별도 조건식 없음 | download(new Blob([bytes.slice().buffer], { type: 'application/zip' }), `study-backup-${new Date().toISOString().slice(0,10)}.zip`)<br>call → [H-1a13821307fd](ui__full-backup.md#h-1a13821307fd) |
| 47행 | 별도 조건식 없음 | bytes.slice()<br>call |
| 47행 | 별도 조건식 없음 | new Date().toISOString().slice(0, 10)<br>call |
| 47행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 48행 | exception: error | setError(errorText(error))<br>state-update |
| 48행 | exception: error | errorText(error)<br>call → [H-715f0d33795a](ui__full-backup.md#h-715f0d33795a) |
| 48행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

## H-c512e359c39f

**review** · [src/ui/full-backup.tsx:50](../../../src/ui/full-backup.tsx#L50) · async

분기 조건과 가능한 갈림길:

- B-4b33c9a11551 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (52행).
- B-9ca966703404 · IfStatement · file.size > 512 * 1024 * 1024 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-5462919f259b · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 51행 | 별도 조건식 없음 | setError('')<br>state-update |
| 51행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 51행 | 별도 조건식 없음 | setChecked(null)<br>state-update |
| 51행 | 별도 조건식 없음 | setConfirmed(false)<br>state-update |
| 52행 | truthy: file.size > 512 * 1024 * 1024 | Error('백업 파일은 512MB 이하로 골라 주세요.')<br>call |
| 52행 | 별도 조건식 없음 | setChecked(await checkFullBackup(new Uint8Array(await file.arrayBuffer()), owner))<br>state-update |
| 52행 | 별도 조건식 없음 | checkFullBackup(new Uint8Array(await file.arrayBuffer()), owner)<br>call |
| 52행 | 별도 조건식 없음 | file.arrayBuffer()<br>call |
| 53행 | exception: error | setError(errorText(error))<br>state-update |
| 53행 | exception: error | errorText(error)<br>call → [H-715f0d33795a](ui__full-backup.md#h-715f0d33795a) |
| 53행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

throw: 52행 Error('백업 파일은 512MB 이하로 골라 주세요.')

## H-5b6a02deb878

**restore** · [src/ui/full-backup.tsx:55](../../../src/ui/full-backup.tsx#L55) · async

분기 조건과 가능한 갈림길:

- B-778bd5f09338 · IfStatement · !checked || !confirmed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (56행).
- B-c089e6e4f9f7 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (59행).
- B-72337f795fb6 · IfStatement · !navigator.locks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (62행).
- B-638eed2819d9 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (66행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 57행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 57행 | 별도 조건식 없음 | setError('')<br>state-update |
| 62행 | truthy: !navigator.locks | Error('동시 복원을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.')<br>call |
| 63행 | 별도 조건식 없음 | navigator.locks.request('study-space:backup-recovery', () => stageFullBackup(checked, owner))<br>call<br>전달 콜백: H-a8a4ba088dcc |
| 64행 | 별도 조건식 없음 | setRestored(true)<br>state-update |
| 64행 | 별도 조건식 없음 | setChecked(null)<br>state-update |
| 65행 | 별도 조건식 없음 | setNotice('백업을 확인했습니다. 다른 공부 창을 마친 뒤 아래 버튼으로 다시 열면, 현재 자료를 보관하고 복원합니다. 서버 자료는 변경하지 않습니다.')<br>state-update |
| 66행 | exception: error | setError(errorText(error))<br>state-update |
| 66행 | exception: error | errorText(error)<br>call → [H-715f0d33795a](ui__full-backup.md#h-715f0d33795a) |
| 66행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 56행 <render> [truthy: !checked || !confirmed]

throw: 62행 Error('동시 복원을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.')

## H-a8a4ba088dcc

**@callback:navigator.locks.request** · [src/ui/full-backup.tsx:63](../../../src/ui/full-backup.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | 별도 조건식 없음 | stageFullBackup(checked, owner)<br>call |

## H-d52444715284

**@onClick** · [src/ui/full-backup.tsx:70](../../../src/ui/full-backup.tsx#L70)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | 별도 조건식 없음 | backup()<br>call → [H-f05eb78d7965](ui__full-backup.md#h-f05eb78d7965) |

## H-559c9d1433c4

**@onChange** · [src/ui/full-backup.tsx:73](../../../src/ui/full-backup.tsx#L73)

분기 조건과 가능한 갈림길:

- B-c5170500f22e · IfStatement · file → truthy / falsy; 바깥 조건: truthy: !restored (73행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | truthy: !restored ∧ truthy: file | review(file)<br>call → [H-c512e359c39f](ui__full-backup.md#h-c512e359c39f) |

## H-531f0895185c

**@callback:checked.rows.filter** · [src/ui/full-backup.tsx:74](../../../src/ui/full-backup.tsx#L74)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-643c2fbc9974

**@onChange** · [src/ui/full-backup.tsx:76](../../../src/ui/full-backup.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | truthy: !restored ∧ truthy: checked | setConfirmed(event.target.checked)<br>state-update |

## H-a2966ca182be

**@onClick** · [src/ui/full-backup.tsx:77](../../../src/ui/full-backup.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | truthy: !restored ∧ truthy: checked | restore()<br>call → [H-5b6a02deb878](ui__full-backup.md#h-5b6a02deb878) |

## H-cd5daeb0ed91

**@onClick** · [src/ui/full-backup.tsx:77](../../../src/ui/full-backup.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | truthy: !restored ∧ truthy: checked | setChecked(null)<br>state-update |
| 77행 | truthy: !restored ∧ truthy: checked | setConfirmed(false)<br>state-update |

## H-fe0f9f692e74

**@onClick** · [src/ui/full-backup.tsx:88](../../../src/ui/full-backup.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | truthy: restored | location.reload()<br>call |

## H-7f822201beb7

**@callback:prior.map** · [src/ui/full-backup.tsx:89](../../../src/ui/full-backup.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: prior.length > 0 | new Date(row.createdAt).toLocaleString('ko-KR')<br>call |

## H-2a6b199c885f

**@onClick** · [src/ui/full-backup.tsx:89](../../../src/ui/full-backup.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: prior.length > 0 | download(row.file, `study-before-restore-${row.id}.zip`)<br>call → [H-1a13821307fd](ui__full-backup.md#h-1a13821307fd) |

## H-a074dba231af

**BackupRecoveryGate** · [src/ui/full-backup.tsx:92](../../../src/ui/full-backup.tsx#L92)

분기 조건과 가능한 갈림길:

- B-4b50bee079ef · IfStatement · error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-18abb5327615 · ConditionalExpression · ready → truthy / falsy; 바깥 조건: 별도 조건식 없음 (102행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | 별도 조건식 없음 | useState(false)<br>call |
| 93행 | 별도 조건식 없음 | useState('')<br>call |
| 94행 | 별도 조건식 없음 | useEffect(() => { let alive = true; async function recover() { if (typeof indexedDB === 'undefined') return; await recoverInterruptedBackup(); } const recovery = navigator.locks ? navigator.locks.request('study-space:backup-recovery', recover) : recover(); void recovery.then(() => { if (alive) setReady(true); }).catch(error => { if (alive) setError(errorText(error)); }); return () => { alive = false; }; }, [])<br>call<br>전달 콜백: H-1d8f491173ac |

반환/조기 중단: 101행 <render> [truthy: error]; 102행 ready ? children : <main className="boot"><LoadingState message="보관 자료를 확인하고 있습니다…" /></main> [별도 조건식 없음]

## H-1d8f491173ac

**@callback:useEffect** · [src/ui/full-backup.tsx:94](../../../src/ui/full-backup.tsx#L94)

분기 조건과 가능한 갈림길:

- B-905e7826aa5c · ConditionalExpression · navigator.locks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | truthy: navigator.locks | navigator.locks.request('study-space:backup-recovery', recover)<br>call<br>전달 콜백: H-20099877268a |
| 97행 | falsy: navigator.locks | recover()<br>call → [H-20099877268a](ui__full-backup.md#h-20099877268a) |
| 98행 | 별도 조건식 없음 | recovery.then(() => { if (alive) setReady(true); }).catch(error => { if (alive) setError(errorText(error)); })<br>preservation-boundary<br>전달 콜백: H-69cc480745c1 |
| 98행 | 별도 조건식 없음 | recovery.then(() => { if (alive) setReady(true); })<br>preservation-boundary<br>전달 콜백: H-e0309950de80 |

반환/조기 중단: 99행 () => { alive = false; } [별도 조건식 없음]

## H-20099877268a

**recover** · [src/ui/full-backup.tsx:96](../../../src/ui/full-backup.tsx#L96) · async

분기 조건과 가능한 갈림길:

- B-7a1964d5e07b · IfStatement · typeof indexedDB === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | 별도 조건식 없음 | recoverInterruptedBackup()<br>call |

반환/조기 중단: 96행 <render> [truthy: typeof indexedDB === 'undefined']

## H-e0309950de80

**@callback:recovery.then** · [src/ui/full-backup.tsx:98](../../../src/ui/full-backup.tsx#L98)

분기 조건과 가능한 갈림길:

- B-79e288ecfdcb · IfStatement · alive → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: recovery (98행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | fulfilled-or-explicit-rejection-handler: recovery ∧ truthy: alive | setReady(true)<br>state-update |

## H-69cc480745c1

**@callback:recovery.then(() => { if (alive) setReady(true); }).catch** · [src/ui/full-backup.tsx:98](../../../src/ui/full-backup.tsx#L98)

분기 조건과 가능한 갈림길:

- B-1301cbf29246 · IfStatement · alive → truthy / falsy; 바깥 조건: rejected: recovery.then(() => { if (alive) setReady(true); }) (98행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | rejected: recovery.then(() => { if (alive) setReady(true); }) ∧ truthy: alive | setError(errorText(error))<br>state-update |
| 98행 | rejected: recovery.then(() => { if (alive) setReady(true); }) ∧ truthy: alive | errorText(error)<br>call → [H-715f0d33795a](ui__full-backup.md#h-715f0d33795a) |

## H-d665a5197623

**@onRetry** · [src/ui/full-backup.tsx:101](../../../src/ui/full-backup.tsx#L101)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | truthy: error | location.reload()<br>call |

## H-c7831a235455

**@onClick** · [src/ui/full-backup.tsx:101](../../../src/ui/full-backup.tsx#L101)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | truthy: error | cancelPlannedBackup().then(() => location.reload())<br>call<br>전달 콜백: H-f18122a38ea3 |
| 101행 | truthy: error | cancelPlannedBackup()<br>call |

## H-f18122a38ea3

**@callback:cancelPlannedBackup().then** · [src/ui/full-backup.tsx:101](../../../src/ui/full-backup.tsx#L101)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | truthy: error ∧ fulfilled-or-explicit-rejection-handler: cancelPlannedBackup() | location.reload()<br>call |

