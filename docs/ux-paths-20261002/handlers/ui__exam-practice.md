# src/ui/exam-practice.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3f4fde0d7a11

**message** · [src/ui/exam-practice.tsx:21](../../../src/ui/exam-practice.tsx#L21)

분기 조건과 가능한 갈림길:

- B-0ff4540dd2d6 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).

## H-66b4087d8015

**clock** · [src/ui/exam-practice.tsx:23](../../../src/ui/exam-practice.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | Math.floor(ms / 60000)<br>    .toString()<br>    .padStart(2, '0')<br>call |
| 24행 | 별도 조건식 없음 | Math.floor(ms / 60000)<br>    .toString()<br>call |
| 24행 | 별도 조건식 없음 | Math.floor(ms / 60000)<br>call |
| 26행 | 별도 조건식 없음 | (Math.floor(ms / 1000) % 60).toString().padStart(2, '0')<br>call |
| 26행 | 별도 조건식 없음 | (Math.floor(ms / 1000) % 60).toString()<br>call |
| 26행 | 별도 조건식 없음 | Math.floor(ms / 1000)<br>call |

## H-70bbb85f6cbe

**ExamPractice** · [src/ui/exam-practice.tsx:27](../../../src/ui/exam-practice.tsx#L27)

분기 조건과 가능한 갈림길:

- B-8c15b9d504d2 · ConditionalExpression · boot.error → truthy / falsy; 바깥 조건: truthy: error ∧ truthy: blocked && boot.key (194행).
- B-309780e45f45 · ConditionalExpression · draft.phase === 'setup' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (225행).
- B-0e0472cae4a5 · ConditionalExpression · !topics.length → truthy / falsy; 바깥 조건: truthy: draft.phase === 'setup' (228행).
- B-5c9d74ef76ba · ConditionalExpression · draft.phase === 'running' || draft.phase === 'paused' → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' (287행).
- B-7394872d8a3a · ConditionalExpression · draft.phase === 'paused' → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' (290행).
- B-a22110e7225b · ConditionalExpression · draft.minutes → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' ∧ falsy: draft.phase === 'paused' (292행).
- B-d7e7db6bd568 · ConditionalExpression · expired → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' ∧ falsy: draft.phase === 'paused' ∧ truthy: draft.minutes (293행).
- B-d8d07dd056be · ConditionalExpression · draft.minutes → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' (301행).
- B-6d79adbf9cb7 · ConditionalExpression · expired → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' ∧ truthy: draft.minutes (301행).
- B-055134ef1408 · ConditionalExpression · draft.minutes → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' (303행).
- B-6e647acb0dda · ConditionalExpression · draft.phase === 'running' → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' (310행).
- B-27505ddd5f12 · ConditionalExpression · draft.phase === 'running' → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' || draft.phase === 'paused' (315행).
- B-133813e98f0e · ConditionalExpression · draft.phase === 'review' → truthy / falsy; 바깥 조건: falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' || draft.phase === 'paused' (333행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | useState(() => { let key = ''; try { key = practiceDraftKey(data); const stored = readPracticeDraft(key); return { key, ...stored, error: '' }; } catch (e) { return { key, raw: null, draft: null, error: message(e) }; } })<br>call<br>전달 콜백: H-52f6ffad20f3 |
| 50행 | 별도 조건식 없음 | useState(() => boot.draft ?? freshExamPractice(initialTopicId))<br>call<br>전달 콜백: H-9bb60efb60ab |
| 53행 | 별도 조건식 없음 | useRef(boot.raw)<br>call |
| 54행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 55행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 55행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 56행 | 별도 조건식 없음 | useState(Date.now())<br>call |
| 56행 | 별도 조건식 없음 | Date.now()<br>call |
| 57행 | 별도 조건식 없음 | useState('')<br>call |
| 58행 | 별도 조건식 없음 | useState(false)<br>call |
| 59행 | 별도 조건식 없음 | useRef(null)<br>call |
| 60행 | 별도 조건식 없음 | data.subjects.filter((row) => !row.deletedAt && subjectIds.includes(row.id))<br>call<br>전달 콜백: H-fde53b127770 |
| 61행 | 별도 조건식 없음 | data.nodes.filter((row) => !row.deletedAt && row.role === 'topic' && subjects.some((subject) => subject.id === row.subjectId))<br>call<br>전달 콜백: H-33b7e8d335d4 |
| 67행 | 별도 조건식 없음 | data.nodes.find((row) => row.id === draft.topicId && !row.deletedAt)<br>call<br>전달 콜백: H-b95150b55cb6 |
| 71행 | falsy: data.namespace === 'demo' \|\|<br>    !repository.getCapabilities | repository.getCapabilities().includes('saveMemo')<br>call |
| 71행 | falsy: data.namespace === 'demo' \|\|<br>    !repository.getCapabilities | repository.getCapabilities()<br>call |
| 72행 | 별도 조건식 없음 | practiceElapsed(draft, now)<br>call |
| 74행 | 별도 조건식 없음 | useEffect(() => { if (draft.phase !== 'running') return; const tick = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(tick); }, [draft.phase])<br>call<br>전달 콜백: H-4a4c3f05f029 |
| 79행 | 별도 조건식 없음 | useEffect(() => { if (draft.phase !== 'setup') heading.current?.focus({ preventScroll: true }); }, [draft.phase])<br>call<br>전달 콜백: H-f70041c5d8db |
| 144행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter(<br>      (memo) =><br>        !memo.deletedAt &&<br>        memo.id.startsWith(EXAM_MEMO_PREFIX) &&<br>        (memo.ownerId === null \|\| topics.some((row) => row.id === memo.ownerId)),<br>    )<br>    .slice()<br>    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))<br>mutation-request<br>전달 콜백: H-41e4a763ea54 |
| 144행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter(<br>      (memo) =><br>        !memo.deletedAt &&<br>        memo.id.startsWith(EXAM_MEMO_PREFIX) &&<br>        (memo.ownerId === null \|\| topics.some((row) => row.id === memo.ownerId)),<br>    )<br>    .slice()<br>mutation-request |
| 144행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter((memo) => !memo.deletedAt && memo.id.startsWith(EXAM_MEMO_PREFIX) && (memo.ownerId === null \|\| topics.some((row) => row.id === memo.ownerId)))<br>call<br>전달 콜백: H-ce93082d7499 |
| 222행 | truthy: draft.previous && draft.phase !== 'saved' | encodeURIComponent(draft.previous.memoId)<br>call |
| 253행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | subjects.map((subject) => ( <optgroup label={subject.name} key={subject.id}> {topics .filter((row) => row.subjectId === subject.id) .map((row) => ( <option value={row.id} key={row.id}> {row.name} </option> ))} </optgroup> ))<br>call<br>전달 콜백: H-a4b728c6b7c5 |
| 303행 | falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' \|\| draft.phase === 'paused' | clock(draft.minutes ? Math.abs(draft.minutes * 60000 - elapsed) : elapsed)<br>call → [H-66b4087d8015](ui__exam-practice.md#h-66b4087d8015) |
| 303행 | falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.minutes | Math.abs(draft.minutes * 60000 - elapsed)<br>call |
| 335행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | clock(draft.elapsedMs)<br>call → [H-66b4087d8015](ui__exam-practice.md#h-66b4087d8015) |
| 386행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | repository.getSnapshot()<br>call |
| 395행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ falsy: draft.phase === 'review' | clock(draft.elapsedMs)<br>call → [H-66b4087d8015](ui__exam-practice.md#h-66b4087d8015) |
| 397행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ falsy: draft.phase === 'review' | encodeURIComponent(draft.id)<br>call |
| 411행 | truthy: history.length > 0 | history.map((memo) => ( <li key={memo.id}> <a href={`#/memos/${encodeURIComponent(memo.id)}`}> {memo.body.split('\n')[0] \|\| '연습 메모'} </a> <span>{new Date(memo.createdAt).toLocaleDateString('ko-KR')}</span> <Button variant="quiet" disabled={ blocked \|\| composing \|\| !['setup', 'saved'].includes(draft.phase) \|\| !topics.some((row) => row.id === memo.ownerId) } onClick={() => repeat(memo)} > 같은 주제로 다시 연습 </Button> {memo.ownerId && <PerformanceFromSource data={data} repository={repository} onSaved={onSaved} kind="exam-memo" id={memo.id} />} </li> ))<br>navigation<br>전달 콜백: H-852511fecffd |

반환/조기 중단: 165행 <render> [별도 조건식 없음]

## H-52f6ffad20f3

**@callback:useState** · [src/ui/exam-practice.tsx:40](../../../src/ui/exam-practice.tsx#L40)

분기 조건과 가능한 갈림길:

- B-1edbc7e3c56b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (42행).
- B-c3f27419a3e5 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (46행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | practiceDraftKey(data)<br>preservation-boundary |
| 44행 | 별도 조건식 없음 | readPracticeDraft(key)<br>preservation-boundary |
| 47행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

반환/조기 중단: 45행 { key, ...stored, error: '' } [별도 조건식 없음]; 47행 { key, raw: null, draft: null, error: message(e) } [exception: e]

## H-9bb60efb60ab

**@callback:useState** · [src/ui/exam-practice.tsx:51](../../../src/ui/exam-practice.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | nullish: boot.draft | freshExamPractice(initialTopicId)<br>call |

## H-fde53b127770

**@callback:data.subjects.filter** · [src/ui/exam-practice.tsx:60](../../../src/ui/exam-practice.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | truthy: !row.deletedAt | subjectIds.includes(row.id)<br>call |

## H-33b7e8d335d4

**@callback:data.nodes.filter** · [src/ui/exam-practice.tsx:62](../../../src/ui/exam-practice.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | truthy: !row.deletedAt &&<br>      row.role === 'topic' | subjects.some((subject) => subject.id === row.subjectId)<br>call<br>전달 콜백: H-0d198d821ffe |

## H-0d198d821ffe

**@callback:subjects.some** · [src/ui/exam-practice.tsx:65](../../../src/ui/exam-practice.tsx#L65)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b95150b55cb6

**@callback:data.nodes.find** · [src/ui/exam-practice.tsx:67](../../../src/ui/exam-practice.tsx#L67)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4a4c3f05f029

**@callback:useEffect** · [src/ui/exam-practice.tsx:74](../../../src/ui/exam-practice.tsx#L74)

분기 조건과 가능한 갈림길:

- B-61a450697466 · IfStatement · draft.phase !== 'running' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (75행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | window.setInterval(() => setNow(Date.now()), 500)<br>call<br>전달 콜백: H-7b25b6bdee75 |

반환/조기 중단: 75행 <render> [truthy: draft.phase !== 'running']; 77행 () => window.clearInterval(tick) [별도 조건식 없음]

## H-7b25b6bdee75

**@callback:window.setInterval** · [src/ui/exam-practice.tsx:76](../../../src/ui/exam-practice.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | setNow(Date.now())<br>state-update |
| 76행 | 별도 조건식 없음 | Date.now()<br>call |

## H-f70041c5d8db

**@callback:useEffect** · [src/ui/exam-practice.tsx:79](../../../src/ui/exam-practice.tsx#L79)

분기 조건과 가능한 갈림길:

- B-0ebd98b887de · IfStatement · draft.phase !== 'setup' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (80행).

## H-2c4f55dbb2e7

**persist** · [src/ui/exam-practice.tsx:82](../../../src/ui/exam-practice.tsx#L82)

분기 조건과 가능한 갈림길:

- B-05ab86981bf1 · IfStatement · blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (83행).
- B-b23da1a176db · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (87행).
- B-503cebcd4672 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (91행).
- B-31feee793de5 · IfStatement · message(e).includes('다른 창') → truthy / falsy; 바깥 조건: exception: e (92행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 85행 | 별도 조건식 없음 | setNow(Date.now())<br>state-update |
| 85행 | 별도 조건식 없음 | Date.now()<br>call |
| 86행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 88행 | 별도 조건식 없음 | writePracticeDraft(boot.key, next, raw.current)<br>preservation-boundary |
| 89행 | 별도 조건식 없음 | setError('')<br>state-update |
| 92행 | exception: e | message(e).includes('다른 창')<br>call |
| 92행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |
| 92행 | exception: e ∧ truthy: message(e).includes('다른 창') | setBlocked(true)<br>state-update |
| 93행 | exception: e ∧ falsy: message(e).includes('다른 창') | JSON.stringify(next)<br>call |
| 94행 | exception: e | setError(message(e))<br>state-update |
| 94행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

반환/조기 중단: 83행 false [truthy: blocked]; 90행 true [별도 조건식 없음]; 95행 false [exception: e]

## H-0f8007097feb

**start** · [src/ui/exam-practice.tsx:98](../../../src/ui/exam-practice.tsx#L98)

분기 조건과 가능한 갈림길:

- B-c1b64585a7f3 · IfStatement · !topic || composing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (99행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | 별도 조건식 없음 | Date.now()<br>call |
| 101행 | 별도 조건식 없음 | persist({ ...draft, topicName: topic.name, phase: 'running', startedAt: new Date(at).toISOString(), runningSince: at, })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 105행 | 별도 조건식 없음 | new Date(at).toISOString()<br>call |

반환/조기 중단: 99행 <render> [truthy: !topic || composing]

## H-e86c52a05e0d

**pause** · [src/ui/exam-practice.tsx:109](../../../src/ui/exam-practice.tsx#L109)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | 별도 조건식 없음 | persist({ ...draft, phase: 'paused', elapsedMs: practiceElapsed(draft), runningSince: null })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 110행 | 별도 조건식 없음 | practiceElapsed(draft)<br>call |

## H-7837096ed0bc

**finish** · [src/ui/exam-practice.tsx:111](../../../src/ui/exam-practice.tsx#L111)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | 별도 조건식 없음 | persist({ ...draft, phase: 'review', elapsedMs: practiceElapsed(draft), runningSince: null, endedAt: new Date().toISOString(), })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 115행 | 별도 조건식 없음 | practiceElapsed(draft)<br>call |
| 117행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-c102dcc23b8a

**save** · [src/ui/exam-practice.tsx:119](../../../src/ui/exam-practice.tsx#L119)

분기 조건과 가능한 갈림길:

- B-2f1872450be8 · IfStatement · composing || blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (120행).
- B-c76cc07e7086 · ConditionalExpression · separate → truthy / falsy; 바깥 조건: 별도 조건식 없음 (121행).
- B-365338ed6d7c · IfStatement · !persist(next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (122행).
- B-20df07999a4b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (123행).
- B-dfb51f488fd4 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (129행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | truthy: separate | crypto.randomUUID()<br>call |
| 122행 | 별도 조건식 없음 | persist(next)<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 124행 | 별도 조건식 없음 | savePracticeMemo(repository, next, !topic)<br>call |
| 125행 | 별도 조건식 없음 | onSaved(snapshot)<br>call |
| 127행 | 별도 조건식 없음 | persist({ ...next, phase: 'saved' })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 128행 | 별도 조건식 없음 | setNotice('연습 기록을 메모에 남겼습니다.')<br>state-update |
| 130행 | exception: e | setError(message(e))<br>state-update |
| 130행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

반환/조기 중단: 120행 <render> [truthy: composing || blocked]; 122행 <render> [truthy: !persist(next)]

## H-5f8e1305c612

**restart** · [src/ui/exam-practice.tsx:133](../../../src/ui/exam-practice.tsx#L133)

분기 조건과 가능한 갈림길:

- B-d136b66ca3b4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (134행).
- B-7e1943238a92 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (140행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 135행 | 별도 조건식 없음 | clearPracticeDraft(boot.key, raw.current)<br>preservation-boundary |
| 137행 | 별도 조건식 없음 | setDraft(freshExamPractice(topic?.id))<br>state-update |
| 137행 | 별도 조건식 없음 | freshExamPractice(topic?.id)<br>call |
| 138행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 139행 | 별도 조건식 없음 | setError('')<br>state-update |
| 141행 | exception: e | setError(message(e))<br>state-update |
| 141행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

## H-ce93082d7499

**@callback:(data.memos ?? [])
    .filter** · [src/ui/exam-practice.tsx:146](../../../src/ui/exam-practice.tsx#L146)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 148행 | truthy: !memo.deletedAt | memo.id.startsWith(EXAM_MEMO_PREFIX)<br>call |
| 149행 | truthy: !memo.deletedAt &&<br>        memo.id.startsWith(EXAM_MEMO_PREFIX) ∧ falsy: memo.ownerId === null | topics.some((row) => row.id === memo.ownerId)<br>call<br>전달 콜백: H-eb1025c83928 |

## H-eb1025c83928

**@callback:topics.some** · [src/ui/exam-practice.tsx:149](../../../src/ui/exam-practice.tsx#L149)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-41e4a763ea54

**history** · [src/ui/exam-practice.tsx:152](../../../src/ui/exam-practice.tsx#L152)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 152행 | 별도 조건식 없음 | b.createdAt.localeCompare(a.createdAt)<br>call |

## H-ece1a7469925

**repeat** · [src/ui/exam-practice.tsx:153](../../../src/ui/exam-practice.tsx#L153)

분기 조건과 가능한 갈림길:

- B-07c1a2185a07 · IfStatement · blocked || composing || !['setup', 'saved'].includes(draft.phase) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (154행).
- B-c1bbc410072a · IfStatement · draft.phase === 'setup' && draft.answer → truthy / falsy; 바깥 조건: 별도 조건식 없음 (155행).
- B-dce8fcd7616d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (159행).
- B-b607163f20a0 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (161행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | falsy: blocked \|\| composing | ['setup', 'saved'].includes(draft.phase)<br>call |
| 156행 | truthy: draft.phase === 'setup' && draft.answer | setError('작성 중인 연습을 먼저 마쳐 주세요. 현재 내용은 유지했습니다.')<br>state-update |
| 160행 | 별도 조건식 없음 | persist(repeatExamPractice(memo))<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 160행 | 별도 조건식 없음 | repeatExamPractice(memo)<br>call |
| 162행 | exception: e | setError(message(e))<br>state-update |
| 162행 | exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

반환/조기 중단: 154행 <render> [truthy: blocked || composing || !['setup', 'saved'].includes(draft.phase)]; 157행 <render> [truthy: draft.phase === 'setup' && draft.answer]

## H-5d02c81ee089

**@onCompositionStart** · [src/ui/exam-practice.tsx:169](../../../src/ui/exam-practice.tsx#L169)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | 별도 조건식 없음 | setComposing(true)<br>state-update |

## H-571094334bfa

**@onCompositionEnd** · [src/ui/exam-practice.tsx:170](../../../src/ui/exam-practice.tsx#L170)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 170행 | 별도 조건식 없음 | setComposing(false)<br>state-update |

## H-83d632104d82

**@onClick** · [src/ui/exam-practice.tsx:175](../../../src/ui/exam-practice.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: error ∧ truthy: !blocked | persist(draft)<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-c8ed30a604c0

**@onClick** · [src/ui/exam-practice.tsx:178](../../../src/ui/exam-practice.tsx#L178)

분기 조건과 가능한 갈림길:

- B-44355a7265c6 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: blocked && boot.key (179행).
- B-c41a639db61d · IfStatement · boot.error → truthy / falsy; 바깥 조건: truthy: error ∧ truthy: blocked && boot.key (181행).
- B-7dd139f20943 · CatchClause · e → exception; 바깥 조건: truthy: error ∧ truthy: blocked && boot.key (189행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 180행 | truthy: error ∧ truthy: blocked && boot.key | preservePracticeDraft(boot.key, Boolean(boot.error))<br>preservation-boundary |
| 180행 | truthy: error ∧ truthy: blocked && boot.key | Boolean(boot.error)<br>call |
| 183행 | truthy: error ∧ truthy: blocked && boot.key ∧ truthy: boot.error | setBlocked(false)<br>state-update |
| 184행 | truthy: error ∧ truthy: blocked && boot.key ∧ truthy: boot.error | setError('')<br>state-update |
| 186행 | truthy: error ∧ truthy: blocked && boot.key ∧ falsy: boot.error | setError('원문 사본을 보관했습니다. 현재 입력도 유지했습니다. 초안 보관본에서 확인해 주세요.')<br>state-update |
| 190행 | truthy: error ∧ truthy: blocked && boot.key ∧ exception: e | setError(message(e))<br>state-update |
| 190행 | truthy: error ∧ truthy: blocked && boot.key ∧ exception: e | message(e)<br>call → [H-3f4fde0d7a11](ui__exam-practice.md#h-3f4fde0d7a11) |

## H-f2b9932ab6c6

**@onSubmit** · [src/ui/exam-practice.tsx:235](../../../src/ui/exam-practice.tsx#L235)

분기 조건과 가능한 갈림길:

- B-1329881ca781 · IfStatement · !blocked → truthy / falsy; 바깥 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length (237행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 236행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | e.preventDefault()<br>input-control |
| 237행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length ∧ truthy: !blocked | start()<br>call → [H-0f8007097feb](ui__exam-practice.md#h-0f8007097feb) |

## H-fa125a9abe85

**@onChange** · [src/ui/exam-practice.tsx:244](../../../src/ui/exam-practice.tsx#L244)

분기 조건과 가능한 갈림길:

- B-a3214338be6a · ConditionalExpression · e.target.value === draft.topicId → truthy / falsy; 바깥 조건: truthy: draft.phase === 'setup' ∧ falsy: !topics.length (248행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 245행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | persist({ ...draft, topicId: e.target.value, previous: e.target.value === draft.topicId ? draft.previous : undefined, })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-a4b728c6b7c5

**@callback:subjects.map** · [src/ui/exam-practice.tsx:253](../../../src/ui/exam-practice.tsx#L253)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 255행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | topics<br>                      .filter((row) => row.subjectId === subject.id)<br>                      .map((row) => ( <option value={row.id} key={row.id}> {row.name} </option> ))<br>call<br>전달 콜백: H-0a39622da45b |
| 255행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | topics<br>                      .filter((row) => row.subjectId === subject.id)<br>call<br>전달 콜백: H-ec850b846fde |

## H-ec850b846fde

**@callback:topics
                      .filter** · [src/ui/exam-practice.tsx:256](../../../src/ui/exam-practice.tsx#L256)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0a39622da45b

**@callback:topics
                      .filter((row) => row.subjectId === subject.id)
                      .map** · [src/ui/exam-practice.tsx:257](../../../src/ui/exam-practice.tsx#L257)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ab0211b03282

**@onChange** · [src/ui/exam-practice.tsx:269](../../../src/ui/exam-practice.tsx#L269)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 269행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | persist({ ...draft, minutes: Number(e.target.value) })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |
| 269행 | truthy: draft.phase === 'setup' ∧ falsy: !topics.length | Number(e.target.value)<br>call |

## H-513711db63e9

**@onChange** · [src/ui/exam-practice.tsx:329](../../../src/ui/exam-practice.tsx#L329)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 329행 | falsy: draft.phase === 'setup' ∧ truthy: draft.phase === 'running' \|\| draft.phase === 'paused' | persist({ ...draft, answer: e.target.value })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-758786eadae2

**@onChange** · [src/ui/exam-practice.tsx:344](../../../src/ui/exam-practice.tsx#L344)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 344행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' ∧ truthy: draft.answer | persist({ ...draft, answer: e.target.value })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-02defa603394

**@onChange** · [src/ui/exam-practice.tsx:355](../../../src/ui/exam-practice.tsx#L355)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 355행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | persist({ ...draft, reflection: e.target.value })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-9feb59f8d707

**@onChange** · [src/ui/exam-practice.tsx:364](../../../src/ui/exam-practice.tsx#L364)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 364행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | persist({ ...draft, nextStep: e.target.value })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-bd0c448624f6

**@onClick** · [src/ui/exam-practice.tsx:376](../../../src/ui/exam-practice.tsx#L376)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 376행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | save()<br>call → [H-c102dcc23b8a](ui__exam-practice.md#h-c102dcc23b8a) |

## H-0594bde5f556

**@onClick** · [src/ui/exam-practice.tsx:382](../../../src/ui/exam-practice.tsx#L382)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 382행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' | persist({ ...draft, phase: 'paused', endedAt: null })<br>call → [H-2c4f55dbb2e7](ui__exam-practice.md#h-2c4f55dbb2e7) |

## H-51d8433e7e8c

**@onClick** · [src/ui/exam-practice.tsx:387](../../../src/ui/exam-practice.tsx#L387)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 387행 | falsy: draft.phase === 'setup' ∧ falsy: draft.phase === 'running' \|\| draft.phase === 'paused' ∧ truthy: draft.phase === 'review' ∧ truthy: repository.getSnapshot().memos?.some((m) => m.id === draft.id) | save(true)<br>call → [H-c102dcc23b8a](ui__exam-practice.md#h-c102dcc23b8a) |

## H-852511fecffd

**@callback:history.map** · [src/ui/exam-practice.tsx:411](../../../src/ui/exam-practice.tsx#L411)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 413행 | truthy: history.length > 0 | encodeURIComponent(memo.id)<br>call |
| 414행 | truthy: history.length > 0 | memo.body.split('\n')<br>call |
| 416행 | truthy: history.length > 0 | new Date(memo.createdAt).toLocaleDateString('ko-KR')<br>call |
| 422행 | truthy: history.length > 0 ∧ falsy: blocked \|\|<br>                    composing | ['setup', 'saved'].includes(draft.phase)<br>call |
| 423행 | truthy: history.length > 0 ∧ falsy: blocked \|\|<br>                    composing \|\|<br>                    !['setup', 'saved'].includes(draft.phase) | topics.some((row) => row.id === memo.ownerId)<br>call<br>전달 콜백: H-ed99efc4ecbf |

## H-ed99efc4ecbf

**@callback:topics.some** · [src/ui/exam-practice.tsx:423](../../../src/ui/exam-practice.tsx#L423)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-09e2dfc5f530

**@onClick** · [src/ui/exam-practice.tsx:425](../../../src/ui/exam-practice.tsx#L425)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 425행 | truthy: history.length > 0 | repeat(memo)<br>call → [H-ece1a7469925](ui__exam-practice.md#h-ece1a7469925) |

