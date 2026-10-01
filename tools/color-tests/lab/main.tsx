import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Input, Textarea, Checkbox, Tabs, ErrorState, Select } from '../../../src/ui';
import '../../../src/app.css';
import axe from 'axe-core';
function ColorCheck() {
  const [theme, setTheme] = useState('light');
  useEffect(()=>{document.documentElement.dataset.theme=theme;},[theme]);
  const [tab, setTab] = useState('record');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const check = async () => {
    setResult('검사 중');
    const report = await axe.run('#color-fixture', {runOnly:{type:'rule',values:['color-contrast']}});
    setResult(JSON.stringify({theme,version:axe.version,timestamp:report.timestamp,violations:report.violations,passes:report.passes,incomplete:report.incomplete},null,2));
  };
  const changeTheme = (value: string) => { setTheme(value); document.documentElement.dataset.theme=value; };
  return <main className="color-check"><h1>중립색과 브랜드 · 실제 공통 UI</h1><p>회색 바탕과 선택 영역, 주요 행동에 쓰는 보라. 아래 입력은 색상 확인용이며 공부 기록으로 저장하지 않습니다.</p><Select label="검토 화면 밝기" value={theme} onChange={e=>changeTheme(e.target.value)}><option value="light">밝게</option><option value="dark">어둡게</option></Select><section id="color-fixture"><Tabs label="선택 색상 확인" value={tab} onChange={setTab} items={[{id:'record',label:'공부 기록'},{id:'notes',label:'자유 글·이유·예외'}]}/><div className="color-fields"><Input label="입력 힌트" placeholder="어디가 막혔는지, 무엇을 다시 확인했는지 적을 수 있습니다."/><Input label="읽기 전용 힌트" placeholder="내용을 보존한 채 읽기 전용으로 표시합니다." readOnly/><Input label="오류가 있는 입력" defaultValue="원래 입력은 그대로 남아 있습니다." error="저장하지 못했습니다. 입력한 내용을 확인하고 다시 시도해 주세요."/><Textarea label="긴 한국어 입력" value={notes} onChange={e=>setNotes(e.target.value)} hint="입력과 줄바꿈은 이 화면을 열어 둔 동안 유지됩니다."/><Checkbox label="공부를 시도함 · 완전 이해나 정답을 뜻하지 않음"/><div className="color-actions"><Button variant="primary">기록 남기기</Button><Button>원래 기록으로 돌아가 이유와 예외를 함께 확인하기</Button><Button variant="danger">선택 취소</Button><Button disabled>지금 사용할 수 없음</Button></div><ErrorState message="저장 실패 안내의 색상과 연결 문구를 확인하는 합성 예시입니다." onRetry={()=>{}}/><p>주황은 출제 가능성, 빨강은 출제 확정입니다. 체크와 함께 글자·아이콘·문구로도 상태를 확인합니다.</p></div></section><Button onClick={check}>글자 대비 검사 실행</Button><pre id="axe-result">{result}</pre></main>;
}
createRoot(document.getElementById('root')!).render(<ColorCheck/>);
