# src/ui/study-result-text.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-f1655d7f306a

**isDisplayFormula** · [src/ui/study-result-text.tsx:6](../../../src/ui/study-result-text.tsx#L6)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | truthy: !!text | text.startsWith('$$')<br>call |
| 7행 | truthy: !!text ∧ falsy: text.startsWith('$$') | /^\\{1,2}\[/.test(text)<br>call |

반환/조기 중단: 7행 !!text && (text.startsWith('$$') || /^\\{1,2}\[/.test(text)) [별도 조건식 없음]

## H-12bef0f1e5ff

**Formula** · [src/ui/study-result-text.tsx:10](../../../src/ui/study-result-text.tsx#L10)

분기 조건과 가능한 갈림길:

- B-9094e76d8607 · ConditionalExpression · /^\\\\[([]/.test(text) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (13행).
- B-7fc3f27376ff · ConditionalExpression · display → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-ff590541f161 · ConditionalExpression · display → truthy / falsy; 바깥 조건: 별도 조건식 없음 (43행).
- B-bbb8f59bf608 · ConditionalExpression · display → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-b0cccc0a2f30 · ConditionalExpression · display → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-70064efe5924 · ConditionalExpression · display → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | /^\\\\[([]/.test(text)<br>call |
| 13행 | truthy: /^\\\\[([]/.test(text) | text.replace(/\\\\/g, '\\')<br>call |
| 14행 | 별도 조건식 없음 | useRef(null)<br>call |
| 15행 | 별도 조건식 없음 | source.startsWith('$$')<br>call |
| 15행 | falsy: source.startsWith('$$') | source.startsWith('\\[')<br>call |
| 16행 | 별도 조건식 없음 | useEffect(() => { let alive = true; void import('katex') .then(({ default: katex }) => { if (alive && host.current) katex.render(source.slice(2, -2), host.current, { throwOnError: false, trust: false, displayMode: display, maxExpand: 1000, maxSize: 10, }); }) .catch(() => undefined); return () => { alive = false; }; }, [source, display])<br>call<br>전달 콜백: H-e67f90fa254c |

반환/조기 중단: 34행 <render> [별도 조건식 없음]

## H-e67f90fa254c

**@callback:useEffect** · [src/ui/study-result-text.tsx:16](../../../src/ui/study-result-text.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | import('katex')<br>      .then(({ default: katex }) => {<br>        if (alive && host.current)<br>          katex.render(source.slice(2, -2), host.current, {<br>            throwOnError: false,<br>            trust: false,<br>            displayMode: display,<br>            maxExpand: 1000,<br>            maxSize: 10,<br>          });<br>      })<br>      .catch(() => undefined)<br>call<br>전달 콜백: H-994af3547779 |
| 18행 | 별도 조건식 없음 | import('katex')<br>      .then(({ default: katex }) => { if (alive && host.current) katex.render(source.slice(2, -2), host.current, { throwOnError: false, trust: false, displayMode: display, maxExpand: 1000, maxSize: 10, }); })<br>call<br>전달 콜백: H-233dda57ec7a |

반환/조기 중단: 30행 () => { alive = false; } [별도 조건식 없음]

## H-233dda57ec7a

**@callback:import('katex')
      .then** · [src/ui/study-result-text.tsx:19](../../../src/ui/study-result-text.tsx#L19)

분기 조건과 가능한 갈림길:

- B-65686d48d618 · IfStatement · alive && host.current → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: import('katex') (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | fulfilled-or-explicit-rejection-handler: import('katex') ∧ truthy: alive && host.current | katex.render(source.slice(2, -2), host.current, { throwOnError: false, trust: false, displayMode: display, maxExpand: 1000, maxSize: 10, })<br>call |
| 21행 | fulfilled-or-explicit-rejection-handler: import('katex') ∧ truthy: alive && host.current | source.slice(2, -2)<br>call |

## H-994af3547779

**@callback:import('katex')
      .then(({ default: katex }) => {
        if (alive && host.current)
          katex.render(source.slice(2, -2), host.current, {
            throwOnError: false,
            trust: false,
            displayMode: display,
            maxExpand: 1000,
            maxSize: 10,
          });
      })
      .catch** · [src/ui/study-result-text.tsx:29](../../../src/ui/study-result-text.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-250e19f2707f

**StudyResultText** · [src/ui/study-result-text.tsx:65](../../../src/ui/study-result-text.tsx#L65)

분기 조건과 가능한 갈림길:

- B-8de9bc2cb118 · IfStatement · !formula → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).
- B-1baf6dee8f02 · ConditionalExpression · Tag === 'span' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (83행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | text<br>        .split(/(```[\s\S]*?```\|`[^`\n]*`\|\$\$[\s\S]*?\$\$\|\\{1,2}\([\s\S]*?\\{1,2}\)\|\\{1,2}\[[\s\S]*?\\{1,2}\])/g)<br>call |
| 83행 | 별도 조건식 없음 | ['study-result-text', Tag === 'span' ? 'study-result-text--inline' : '', className]<br>        .filter(Boolean)<br>        .join(' ')<br>call |
| 83행 | 별도 조건식 없음 | ['study-result-text', Tag === 'span' ? 'study-result-text--inline' : '', className]<br>        .filter(Boolean)<br>call |
| 87행 | 별도 조건식 없음 | occurrenceRows(pieces, part => part)<br>        .map(({value: part, index, key}) => part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) ? ( <Formula key={key} text={part} /> ) : ( <span key={key}> {part.startsWith('`') ? part : (isDisplayFormula(pieces[index - 1]) ? part.replace(/^(?:[ \t]*\r?\n)+/, '') : part ).replace(isDisplayFormula(pieces[index + 1]) ? /(?:\r?\n[ \t]*)+$/ : /$^/, '')} </span> ))<br>call<br>전달 콜백: H-d9cd6ef26d63 |
| 87행 | 별도 조건식 없음 | occurrenceRows(pieces, part => part)<br>call<br>전달 콜백: H-140cffbec6f8 |

반환/조기 중단: 76행 <render> [truthy: !formula]; 81행 <render> [별도 조건식 없음]

## H-140cffbec6f8

**@callback:occurrenceRows** · [src/ui/study-result-text.tsx:87](../../../src/ui/study-result-text.tsx#L87)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d9cd6ef26d63

**@callback:occurrenceRows(pieces, part => part)
        .map** · [src/ui/study-result-text.tsx:88](../../../src/ui/study-result-text.tsx#L88)

분기 조건과 가능한 갈림길:

- B-ddb333cb52c4 · ConditionalExpression · part.startsWith('$$') || /^\\{1,2}[([]/.test(part) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).
- B-3cafd3851115 · ConditionalExpression · part.startsWith('`') → truthy / falsy; 바깥 조건: falsy: part.startsWith('$$') || /^\\{1,2}[([]/.test(part) (93행).
- B-41a997ef1b98 · ConditionalExpression · isDisplayFormula(pieces[index - 1]) → truthy / falsy; 바깥 조건: falsy: part.startsWith('$$') || /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') (95행).
- B-1a70f32fe94a · ConditionalExpression · isDisplayFormula(pieces[index + 1]) → truthy / falsy; 바깥 조건: falsy: part.startsWith('$$') || /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') (98행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | 별도 조건식 없음 | part.startsWith('$$')<br>call |
| 89행 | falsy: part.startsWith('$$') | /^\\{1,2}[([]/.test(part)<br>call |
| 93행 | falsy: part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) | part.startsWith('`')<br>call |
| 95행 | falsy: part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') | (isDisplayFormula(pieces[index - 1])<br>                    ? part.replace(/^(?:[ \t]*\r?\n)+/, '')<br>                    : part<br>                  ).replace(isDisplayFormula(pieces[index + 1]) ? /(?:\r?\n[ \t]*)+$/ : /$^/, '')<br>call |
| 95행 | falsy: part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') | isDisplayFormula(pieces[index - 1])<br>call → [H-f1655d7f306a](ui__study-result-text.md#h-f1655d7f306a) |
| 96행 | falsy: part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') ∧ truthy: isDisplayFormula(pieces[index - 1]) | part.replace(/^(?:[ \t]*\r?\n)+/, '')<br>call |
| 98행 | falsy: part.startsWith('$$') \|\| /^\\{1,2}[([]/.test(part) ∧ falsy: part.startsWith('`') | isDisplayFormula(pieces[index + 1])<br>call → [H-f1655d7f306a](ui__study-result-text.md#h-f1655d7f306a) |

