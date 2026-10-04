# src/ui/concept-text.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-408668d563a3

**conceptTextParts** · [src/ui/concept-text.tsx:3](../../../src/ui/concept-text.tsx#L3)

분기 조건과 가능한 갈림길:

- B-fb82e282d39c · IfStatement · index > start → truthy / falsy; 바깥 조건: 별도 조건식 없음 (9행).
- B-4e440ed992e0 · IfStatement · /^[A-Za-z]/.test(token) && !/^(?:[A-Z]{2,12}|[A-Za-z][0-9]+|[A-Za-z][²³⁺⁻]*|kg|ms|nm|km|Hz|Pa|MW|MWh|MJ|MB|mL|ml|Tc|Th|mf|m0|ve|hbar|sin[0-9]*|cos[0-9]*|tan[0-9]*|ln[0-9]*|log[0-9]*|exp[0-9]*|H2O|H2O2|CO2|O2|CH4|Cas9|Zn[²³⁺⁻]*|Cu[²³⁺⁻]*)$/.test(token) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).
- B-78861cc18c15 · IfStatement · !tex && symbols[token[0]] → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).
- B-1f3b72bc82c5 · ConditionalExpression · token[0] === 'σ' → truthy / falsy; 바깥 조건: truthy: !tex && symbols[token[0]] (32행).
- B-cef556b54eaf · IfStatement · !tex → truthy / falsy; 바깥 조건: 별도 조건식 없음 (34행).
- B-644931646a5a · IfStatement · variable → truthy / falsy; 바깥 조건: truthy: !tex (38행).
- B-3c727d089dda · IfStatement · token === 'hbar' → truthy / falsy; 바깥 조건: truthy: !tex ∧ falsy: variable (39행).
- B-1619153339e7 · IfStatement · /^(?:sin|cos|tan|ln|log|exp)[0-9]*$/.test(token) → truthy / falsy; 바깥 조건: truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' (40행).
- B-3bde0d277d9f · IfStatement · /^[a-z]$/.test(token) && !(physicalUnit.test(token) && afterNumber) → truthy / falsy; 바깥 조건: truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ falsy: /^(?:sin|cos|tan|ln|log|exp)[0-9]*$/.test(token) (41행).
- B-b0ca65501180 · ConditionalExpression · power → truthy / falsy; 바깥 조건: truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ falsy: /^(?:sin|cos|tan|ln|log|exp)[0-9]*$/.test(token) ∧ falsy: /^[a-z]$/.test(token) && !(physicalUnit.test(token) && afterNumber) (47행).
- B-b2eb2faa4b0a · IfStatement · start < text.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | text.matchAll(pattern)<br>call |
| 9행 | truthy: index > start | parts.push({ text: text.slice(start, index) })<br>call |
| 9행 | truthy: index > start | text.slice(start, index)<br>call |
| 11행 | 별도 조건식 없음 | /^[A-Za-z]/.test(token)<br>call |
| 11행 | truthy: /^[A-Za-z]/.test(token) | /^(?:[A-Z]{2,12}\|[A-Za-z][0-9]+\|[A-Za-z][²³⁺⁻]*\|kg\|ms\|nm\|km\|Hz\|Pa\|MW\|MWh\|MJ\|MB\|mL\|ml\|Tc\|Th\|mf\|m0\|ve\|hbar\|sin[0-9]*\|cos[0-9]*\|tan[0-9]*\|ln[0-9]*\|log[0-9]*\|exp[0-9]*\|H2O\|H2O2\|CO2\|O2\|CH4\|Cas9\|Zn[²³⁺⁻]*\|Cu[²³⁺⁻]*)$/.test(token)<br>call |
| 12행 | truthy: /^[A-Za-z]/.test(token) && !/^(?:[A-Z]{2,12}\|[A-Za-z][0-9]+\|[A-Za-z][²³⁺⁻]*\|kg\|ms\|nm\|km\|Hz\|Pa\|MW\|MWh\|MJ\|MB\|mL\|ml\|Tc\|Th\|mf\|m0\|ve\|hbar\|sin[0-9]*\|cos[0-9]*\|tan[0-9]*\|ln[0-9]*\|log[0-9]*\|exp[0-9]*\|H2O\|H2O2\|CO2\|O2\|CH4\|Cas9\|Zn[²³⁺⁻]*\|Cu[²³⁺⁻]*)$/.test(token) | parts.push({ text: token })<br>call |
| 31행 | truthy: !tex && symbols[token[0]] | token.slice(1)<br>call |
| 35행 | truthy: !tex | token.match(/^([a-z])([0-9]+)$/)<br>call |
| 37행 | truthy: !tex | /[0-9]\s*$/.test(text.slice(0, index))<br>call |
| 37행 | truthy: !tex | text.slice(0, index)<br>call |
| 40행 | truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' | /^(?:sin\|cos\|tan\|ln\|log\|exp)[0-9]*$/.test(token)<br>call |
| 40행 | truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ truthy: /^(?:sin\|cos\|tan\|ln\|log\|exp)[0-9]*$/.test(token) | token.match(/^([a-z]+)([0-9]*)$/)<br>call |
| 41행 | truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ falsy: /^(?:sin\|cos\|tan\|ln\|log\|exp)[0-9]*$/.test(token) | /^[a-z]$/.test(token)<br>call |
| 41행 | truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ falsy: /^(?:sin\|cos\|tan\|ln\|log\|exp)[0-9]*$/.test(token) ∧ truthy: /^[a-z]$/.test(token) | physicalUnit.test(token)<br>call |
| 44행 | truthy: !tex ∧ falsy: variable ∧ falsy: token === 'hbar' ∧ falsy: /^(?:sin\|cos\|tan\|ln\|log\|exp)[0-9]*$/.test(token) ∧ falsy: /^[a-z]$/.test(token) && !(physicalUnit.test(token) && afterNumber) | token.match(/^(.*?)([²³⁺⁻]+)$/)<br>call |
| 50행 | 별도 조건식 없음 | parts.push({ text: token, tex })<br>call |
| 53행 | truthy: start < text.length | parts.push({ text: text.slice(start) })<br>call |
| 53행 | truthy: start < text.length | text.slice(start)<br>call |

반환/조기 중단: 54행 parts [별도 조건식 없음]

## H-d0f33bc7015d

**ConceptText** · [src/ui/concept-text.tsx:56](../../../src/ui/concept-text.tsx#L56)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 57행 | 별도 조건식 없음 | conceptTextParts(text).map((part, index) => part.tex ? ( <span className="concept-math-token" role="math" aria-label={part.text} data-source-token={part.text} key={index}> <MathFormula inline tex={part.tex} /> </span> ) : <span key={index}>{part.text}</span>)<br>call<br>전달 콜백: H-ec30516ce0f2 |
| 57행 | 별도 조건식 없음 | conceptTextParts(text)<br>call → [H-408668d563a3](ui__concept-text.md#h-408668d563a3) |

반환/조기 중단: 57행 <render> [별도 조건식 없음]

## H-ec30516ce0f2

**@callback:conceptTextParts(text).map** · [src/ui/concept-text.tsx:57](../../../src/ui/concept-text.tsx#L57)

분기 조건과 가능한 갈림길:

- B-a6d9f95b8c92 · ConditionalExpression · part.tex → truthy / falsy; 바깥 조건: 별도 조건식 없음 (57행).

