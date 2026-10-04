# src/ui/material-sources.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-59542d98ede1

**MaterialSources** · [src/ui/material-sources.tsx:9](../../../src/ui/material-sources.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | useState('')<br>call |
| 13행 | 별도 조건식 없음 | useState('')<br>call |
| 13행 | 별도 조건식 없음 | useState(false)<br>call |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 15행 | 별도 조건식 없음 | useState({})<br>call |
| 16행 | 별도 조건식 없음 | useRef([])<br>call |
| 17행 | 별도 조건식 없음 | useEffect(() => () => { previewURLs.current.forEach(URL.revokeObjectURL); previewURLs.current = []; }, [])<br>call<br>전달 콜백: H-1307d578a735 |
| 18행 | 별도 조건식 없음 | useRef(null)<br>call |
| 19행 | 별도 조건식 없음 | useRef(null)<br>call |
| 19행 | 별도 조건식 없음 | useRef(null)<br>call |
| 19행 | 별도 조건식 없음 | useRef(true)<br>call |
| 20행 | 별도 조건식 없음 | useRef(documents)<br>call |
| 21행 | 별도 조건식 없음 | useEffect(() => { alive.current = true; return () => { alive.current = false; controller.current?.abort(); }; }, [])<br>call<br>전달 콜백: H-414007dfe542 |
| 65행 | 별도 조건식 없음 | documents.map(doc => <details key={doc.id} className="material-source-document"><summary>{doc.name} · {doc.blocks.length}개 구간</summary> {doc.url && <a href={doc.url} target="_blank" rel="noreferrer">원본 영상 열기</a>} {doc.file && <div className="material-actions"><Button disabled={busy} onClick={async () => { try { const blob = await readDocumentFile(owner, doc.file!); if (!blob) throw Error('이 기기에 원본 파일이 없습니다. 같은 파일을 다시 가져와 주세요.'); const href = URL.createObjectURL(blob), link = document.createElement('a'); link.href = href; link.download = doc.file!.name; link.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); } catch (cause) { setError(cause instanceof Error ? cause.message : '파일을 열지 못했습니다.'); } }} … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9161faab1b15 |

반환/조기 중단: 57행 <render> [별도 조건식 없음]

## H-1307d578a735

**@callback:useEffect** · [src/ui/material-sources.tsx:17](../../../src/ui/material-sources.tsx#L17)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-414007dfe542

**@callback:useEffect** · [src/ui/material-sources.tsx:21](../../../src/ui/material-sources.tsx#L21)


반환/조기 중단: 21행 () => { alive.current = false; controller.current?.abort(); } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a97a574266bf

**update** · [src/ui/material-sources.tsx:22](../../../src/ui/material-sources.tsx#L22) · async

분기 조건과 가능한 갈림길:

- B-52d2a07d6669 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (22행).
- B-6328484e06ce · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (22행).
- B-c63540a686bb · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: exception: cause (22행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | current.current.map(row => row.id === doc.id ? doc : row)<br>call<br>전달 콜백: H-e4238b2127a0 |
| 22행 | 별도 조건식 없음 | onChange(next)<br>call |
| 22행 | exception: cause | setError(cause instanceof Error ? cause.message : '수정을 보관하지 못했습니다. 원문을 확인해 주세요.')<br>state-update |

## H-e4238b2127a0

**@callback:current.current.map** · [src/ui/material-sources.tsx:22](../../../src/ui/material-sources.tsx#L22)

분기 조건과 가능한 갈림길:

- B-9b3c1fc1b3b6 · ConditionalExpression · row.id === doc.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).

## H-b5b5143a0ac3

**bring** · [src/ui/material-sources.tsx:23](../../../src/ui/material-sources.tsx#L23) · async

분기 조건과 가능한 갈림길:

- B-07d8b89c7560 · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).
- B-84aa4e29e6cd · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (27행).
- B-2db542815b30 · IfStatement · !replace && current.current.length >= 20 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).
- B-d91ec907ee30 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (32행).
- B-3a0e3e4a6bbb · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (35행).
- B-693609e07219 · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: exception: cause (38행).
- B-5378da8068fc · ConditionalExpression · /[가-힣]/.test(message) → truthy / falsy; 바깥 조건: exception: cause (39행).
- B-be4e5b209cbb · ConditionalExpression · cancel.signal.aborted → truthy / falsy; 바깥 조건: exception: cause (40행).
- B-4cf9d22dafda · IfStatement · replace → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-5b955e35fbe2 · IfStatement · duplicate → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-834100fef37f · IfStatement · imported.blocks.some(b => !b.included) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-33217d514c02 · ConditionalExpression · replace → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-3e3b23f1d66e · IfStatement · cancel.signal.aborted → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-fb3cde129352 · IfStatement · alive.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).
- B-a731ea79250a · ConditionalExpression · cancel.signal.aborted → truthy / falsy; 바깥 조건: truthy: alive.current (53행).
- B-507ce5370ba1 · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (54행).
- B-62c910165469 · IfStatement · alive.current → truthy / falsy; 바깥 조건: exception: cause (54행).
- B-d033a54dcb0e · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: exception: cause ∧ truthy: alive.current (54행).
- B-35b1ee3d0c96 · IfStatement · alive.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 25행 | 별도 조건식 없음 | onBusy(true)<br>call |
| 25행 | 별도 조건식 없음 | setError('')<br>state-update |
| 29행 | 별도 조건식 없음 | cancel.signal.throwIfAborted()<br>call |
| 30행 | truthy: !replace && current.current.length >= 20 | Error('한 자료에 파일 20개까지 보관할 수 있습니다. 새 자료에 이어 넣어 주세요.')<br>call |
| 34행 | 별도 조건식 없음 | importMaterialFile(owner, file, { signal: cancel.signal, progress: message => { if (alive.current) setProgress(message); }, firstPage: range(first), lastPage: range(last) })<br>call |
| 34행 | 별도 조건식 없음 | range(first)<br>call → [H-548f7435af0d](ui__material-sources.md#h-548f7435af0d) |
| 34행 | 별도 조건식 없음 | range(last)<br>call → [H-548f7435af0d](ui__material-sources.md#h-548f7435af0d) |
| 37행 | exception: cause | keepDocumentFile(owner, file)<br>call |
| 39행 | exception: cause | /[가-힣]/.test(message)<br>call |
| 40행 | exception: cause ∧ nullish: replace | crypto.randomUUID()<br>call |
| 43행 | truthy: !replace | current.current.find(doc => doc.file?.sha256 === imported.file?.sha256)<br>call<br>전달 콜백: H-ea4197499d9a |
| 44행 | truthy: duplicate | setProgress('같은 원본 파일이 이미 있습니다. 기존 원문과 수정을 유지했습니다.')<br>state-update |
| 46행 | 별도 조건식 없음 | documentSegments(current.current.filter(d => d.id !== replace)).reduce((n, b) => n + b.text.length, 0)<br>call<br>전달 콜백: H-8a46cc2b5695 |
| 46행 | 별도 조건식 없음 | documentSegments(current.current.filter(d => d.id !== replace))<br>call |
| 46행 | 별도 조건식 없음 | current.current.filter(d => d.id !== replace)<br>call<br>전달 콜백: H-7b59a1b5c02f |
| 47행 | 별도 조건식 없음 | imported.blocks.map(b => { const included = b.text.length <= remaining; if (included) remaining -= b.text.length; return { ...b, included }; })<br>call<br>전달 콜백: H-50f6fa313f5f |
| 48행 | 별도 조건식 없음 | imported.blocks.some(b => !b.included)<br>call<br>전달 콜백: H-aaab2126f965 |
| 48행 | truthy: imported.blocks.some(b => !b.included) | imported.warnings.push('전체 원문을 보관했습니다. 긴 자료는 일부 구간부터 GPT에 보냅니다. 아래에서 사용할 범위를 바꿀 수 있습니다.')<br>call |
| 49행 | truthy: replace | current.current.map(d => d.id === replace ? imported : d)<br>call<br>전달 콜백: H-ceeda02d3f56 |
| 50행 | 별도 조건식 없음 | onChange(next)<br>call |
| 53행 | truthy: alive.current | setProgress(cancel.signal.aborted ? '중단했습니다. 가져온 원문과 원본 파일은 보관했습니다.' : '원문을 가져왔습니다. 사용할 구간을 확인해 주세요.')<br>state-update |
| 54행 | exception: cause ∧ truthy: alive.current | setError(cause instanceof Error ? cause.message : '파일을 가져오지 못했습니다.')<br>state-update |
| 55행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | setBusy(false)<br>state-update |
| 55행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: alive.current | onBusy(false)<br>call |

반환/조기 중단: 24행 <render> [truthy: busy]

throw: 30행 Error('한 자료에 파일 20개까지 보관할 수 있습니다. 새 자료에 이어 넣어 주세요.')

## H-548f7435af0d

**range** · [src/ui/material-sources.tsx:33](../../../src/ui/material-sources.tsx#L33)

분기 조건과 가능한 갈림길:

- B-8345db43e2c7 · IfStatement · !value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).
- B-d49bf8f4355e · IfStatement · !Number.isInteger(n) || n < 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | Number(value)<br>call |
| 33행 | 별도 조건식 없음 | Number.isInteger(n)<br>call |
| 33행 | truthy: !Number.isInteger(n) \|\| n < 1 | Error('PDF 쪽 범위에 1 이상의 정수를 넣어 주세요.')<br>call |

반환/조기 중단: 33행 undefined [truthy: !value]; 33행 n [별도 조건식 없음]

throw: 33행 Error('PDF 쪽 범위에 1 이상의 정수를 넣어 주세요.')

## H-ea4197499d9a

**@callback:current.current.find** · [src/ui/material-sources.tsx:43](../../../src/ui/material-sources.tsx#L43)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7b59a1b5c02f

**@callback:current.current.filter** · [src/ui/material-sources.tsx:46](../../../src/ui/material-sources.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8a46cc2b5695

**@callback:documentSegments(current.current.filter(d => d.id !== replace)).reduce** · [src/ui/material-sources.tsx:46](../../../src/ui/material-sources.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-50f6fa313f5f

**@callback:imported.blocks.map** · [src/ui/material-sources.tsx:47](../../../src/ui/material-sources.tsx#L47)

분기 조건과 가능한 갈림길:

- B-598501000484 · IfStatement · included → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).

반환/조기 중단: 47행 { ...b, included } [별도 조건식 없음]

## H-aaab2126f965

**@callback:imported.blocks.some** · [src/ui/material-sources.tsx:48](../../../src/ui/material-sources.tsx#L48)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ceeda02d3f56

**@callback:current.current.map** · [src/ui/material-sources.tsx:49](../../../src/ui/material-sources.tsx#L49)

분기 조건과 가능한 갈림길:

- B-8551e515b082 · ConditionalExpression · d.id === replace → truthy / falsy; 바깥 조건: truthy: replace (49행).

## H-ec18a933686c

**@onClick** · [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b6f8464279ac

**@onClick** · [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7fd713953772

**@onClick** · [src/ui/material-sources.tsx:58](../../../src/ui/material-sources.tsx#L58)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2bdc67048d86

**@onChange** · [src/ui/material-sources.tsx:59](../../../src/ui/material-sources.tsx#L59)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 59행 | 별도 조건식 없음 | Array.from(e.target.files ?? [])<br>call |
| 59행 | 별도 조건식 없음 | bring(files)<br>call → [H-b5b5143a0ac3](ui__material-sources.md#h-b5b5143a0ac3) |

## H-e3012ec32b06

**@onChange** · [src/ui/material-sources.tsx:61](../../../src/ui/material-sources.tsx#L61)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | 별도 조건식 없음 | Array.from(e.target.files ?? [])<br>call |
| 61행 | 별도 조건식 없음 | bring(files)<br>call → [H-b5b5143a0ac3](ui__material-sources.md#h-b5b5143a0ac3) |

## H-3165e7af047c

**@onChange** · [src/ui/material-sources.tsx:63](../../../src/ui/material-sources.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | 별도 조건식 없음 | setFirst(e.target.value)<br>state-update |

## H-707e6f48f8b2

**@onChange** · [src/ui/material-sources.tsx:63](../../../src/ui/material-sources.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | 별도 조건식 없음 | setLast(e.target.value)<br>state-update |

## H-9161faab1b15

**@callback:documents.map** · [src/ui/material-sources.tsx:65](../../../src/ui/material-sources.tsx#L65)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | 별도 조건식 없음 | occurrenceRows(doc.warnings, value => value).map(({value: w, key}) => <p className="material-hint" key={key}>{w}</p>)<br>call<br>전달 콜백: H-013accddd492 |
| 70행 | 별도 조건식 없음 | occurrenceRows(doc.warnings, value => value)<br>call<br>전달 콜백: H-2fd694e17719 |
| 72행 | 별도 조건식 없음 | doc.blocks.map(b => <details key={b.id}><summary>{b.label} · {b.included ? 'GPT에 포함' : '보관만'}</summary> <Checkbox label={`${b.label} GPT에 포함`} checked={b.included} disabled={disabled \|\| busy} onChange={e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, included: e.target.checked } : row) })}/> <Textarea label={`${doc.name} ${b.label} 원문`} value={b.text} disabled={disabled \|\| busy} rows={4} maxLength={100000} onChange={e => void update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, originalText: row.originalText ?? row.text, text: e.target.value } : row) })}/> {b.originalText !== undefined && <details><summary>처음 읽은 원문</summary><p className="material-an … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-d6fb833beadd |

## H-3dfa96a82417

**@onClick** · [src/ui/material-sources.tsx:67](../../../src/ui/material-sources.tsx#L67) · async

분기 조건과 가능한 갈림길:

- B-f9810f97cb6a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: doc.file (67행).
- B-868eed297c8b · IfStatement · !blob → truthy / falsy; 바깥 조건: truthy: doc.file (67행).
- B-0e3627d68d14 · CatchClause · cause → exception; 바깥 조건: truthy: doc.file (67행).
- B-ad57052df943 · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: truthy: doc.file ∧ exception: cause (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | truthy: doc.file | readDocumentFile(owner, doc.file!)<br>call |
| 67행 | truthy: doc.file ∧ truthy: !blob | Error('이 기기에 원본 파일이 없습니다. 같은 파일을 다시 가져와 주세요.')<br>call |
| 67행 | truthy: doc.file | URL.createObjectURL(blob)<br>call |
| 67행 | truthy: doc.file | document.createElement('a')<br>call |
| 67행 | truthy: doc.file | link.click()<br>call |
| 67행 | truthy: doc.file | setTimeout(() => URL.revokeObjectURL(href), 1000)<br>state-update<br>전달 콜백: H-1a9a66c5344b |
| 67행 | truthy: doc.file ∧ exception: cause | setError(cause instanceof Error ? cause.message : '파일을 열지 못했습니다.')<br>state-update |

throw: 67행 Error('이 기기에 원본 파일이 없습니다. 같은 파일을 다시 가져와 주세요.')

## H-1a9a66c5344b

**@callback:setTimeout** · [src/ui/material-sources.tsx:67](../../../src/ui/material-sources.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | truthy: doc.file | URL.revokeObjectURL(href)<br>call |

## H-81a95409550f

**@onClick** · [src/ui/material-sources.tsx:68](../../../src/ui/material-sources.tsx#L68) · async

분기 조건과 가능한 갈림길:

- B-cbbd113d4c7e · IfStatement · blob → truthy / falsy; 바깥 조건: truthy: doc.file ∧ truthy: !doc.blocks.length (68행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | truthy: doc.file ∧ truthy: !doc.blocks.length | readDocumentFile(owner, doc.file!)<br>call |
| 68행 | truthy: doc.file ∧ truthy: !doc.blocks.length ∧ truthy: blob | bring([new File([blob], doc.file!.name, { type: doc.file!.type })], doc.id)<br>call → [H-b5b5143a0ac3](ui__material-sources.md#h-b5b5143a0ac3) |
| 68행 | truthy: doc.file ∧ truthy: !doc.blocks.length ∧ falsy: blob | setError('같은 원본 파일을 다시 가져와 주세요.')<br>state-update |

## H-cca0f302b978

**@onClick** · [src/ui/material-sources.tsx:69](../../../src/ui/material-sources.tsx#L69) · async

분기 조건과 가능한 갈림길:

- B-fd5a6eff82c8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: doc.kind === 'image' && doc.file (69행).
- B-9b7dcd253446 · IfStatement · previews[doc.id] → truthy / falsy; 바깥 조건: truthy: doc.kind === 'image' && doc.file (69행).
- B-c7def2cddc6f · IfStatement · !blob → truthy / falsy; 바깥 조건: truthy: doc.kind === 'image' && doc.file (69행).
- B-6c5276695489 · CatchClause · cause → exception; 바깥 조건: truthy: doc.kind === 'image' && doc.file (69행).
- B-c045df163874 · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: truthy: doc.kind === 'image' && doc.file ∧ exception: cause (69행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | truthy: doc.kind === 'image' && doc.file | readDocumentFile(owner, doc.file!)<br>call |
| 69행 | truthy: doc.kind === 'image' && doc.file ∧ truthy: !blob | Error('원본 사진을 다시 가져와 주세요.')<br>call |
| 69행 | truthy: doc.kind === 'image' && doc.file | URL.createObjectURL(blob)<br>call |
| 69행 | truthy: doc.kind === 'image' && doc.file | previewURLs.current.push(url)<br>call |
| 69행 | truthy: doc.kind === 'image' && doc.file | setPreviews(p => ({...p,[doc.id]:url}))<br>state-update<br>전달 콜백: H-c0fdb3540093 |
| 69행 | truthy: doc.kind === 'image' && doc.file ∧ exception: cause | setError(cause instanceof Error ? cause.message : '사진을 열지 못했습니다.')<br>state-update |

반환/조기 중단: 69행 <render> [truthy: doc.kind === 'image' && doc.file ∧ truthy: previews[doc.id]]

throw: 69행 Error('원본 사진을 다시 가져와 주세요.')

## H-c0fdb3540093

**@callback:setPreviews** · [src/ui/material-sources.tsx:69](../../../src/ui/material-sources.tsx#L69)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2fd694e17719

**@callback:occurrenceRows** · [src/ui/material-sources.tsx:70](../../../src/ui/material-sources.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-013accddd492

**@callback:occurrenceRows(doc.warnings, value => value).map** · [src/ui/material-sources.tsx:70](../../../src/ui/material-sources.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-44837c6d81ed

**@onClick** · [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | 별도 조건식 없음 | update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: true })) })<br>call → [H-a97a574266bf](ui__material-sources.md#h-a97a574266bf) |
| 71행 | 별도 조건식 없음 | doc.blocks.map(b => ({ ...b, included: true }))<br>call<br>전달 콜백: H-ebd0690e9933 |

## H-ebd0690e9933

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9025c9e8eabe

**@onClick** · [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | 별도 조건식 없음 | update({ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: false })) })<br>call → [H-a97a574266bf](ui__material-sources.md#h-a97a574266bf) |
| 71행 | 별도 조건식 없음 | doc.blocks.map(b => ({ ...b, included: false }))<br>call<br>전달 콜백: H-4382c591b03d |

## H-4382c591b03d

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:71](../../../src/ui/material-sources.tsx#L71)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d6fb833beadd

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:72](../../../src/ui/material-sources.tsx#L72)

분기 조건과 가능한 갈림길:

- B-79dc02029bbd · ConditionalExpression · b.included → truthy / falsy; 바깥 조건: 별도 조건식 없음 (72행).

## H-ecb2b1c399ba

**@onChange** · [src/ui/material-sources.tsx:73](../../../src/ui/material-sources.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | 별도 조건식 없음 | update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, included: e.target.checked } : row) })<br>call → [H-a97a574266bf](ui__material-sources.md#h-a97a574266bf) |
| 73행 | 별도 조건식 없음 | doc.blocks.map(row => row.id === b.id ? { ...row, included: e.target.checked } : row)<br>call<br>전달 콜백: H-47244bb4d24e |

## H-47244bb4d24e

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:73](../../../src/ui/material-sources.tsx#L73)

분기 조건과 가능한 갈림길:

- B-264e44b387df · ConditionalExpression · row.id === b.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).

## H-3f919c93c92a

**@onChange** · [src/ui/material-sources.tsx:74](../../../src/ui/material-sources.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | 별도 조건식 없음 | update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, originalText: row.originalText ?? row.text, text: e.target.value } : row) })<br>call → [H-a97a574266bf](ui__material-sources.md#h-a97a574266bf) |
| 74행 | 별도 조건식 없음 | doc.blocks.map(row => row.id === b.id ? { ...row, originalText: row.originalText ?? row.text, text: e.target.value } : row)<br>call<br>전달 콜백: H-cb33efe90fcb |

## H-cb33efe90fcb

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:74](../../../src/ui/material-sources.tsx#L74)

분기 조건과 가능한 갈림길:

- B-6c044707ee3d · ConditionalExpression · row.id === b.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).

## H-f4ac5f766e44

**@onClick** · [src/ui/material-sources.tsx:75](../../../src/ui/material-sources.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: b.originalText !== undefined | update({ ...doc, blocks: doc.blocks.map(row => row.id === b.id ? { ...row, text: row.originalText ?? row.text } : row) })<br>call → [H-a97a574266bf](ui__material-sources.md#h-a97a574266bf) |
| 75행 | truthy: b.originalText !== undefined | doc.blocks.map(row => row.id === b.id ? { ...row, text: row.originalText ?? row.text } : row)<br>call<br>전달 콜백: H-fb851f3a68af |

## H-fb851f3a68af

**@callback:doc.blocks.map** · [src/ui/material-sources.tsx:75](../../../src/ui/material-sources.tsx#L75)

분기 조건과 가능한 갈림길:

- B-68cd7eca6ce2 · ConditionalExpression · row.id === b.id → truthy / falsy; 바깥 조건: truthy: b.originalText !== undefined (75행).

