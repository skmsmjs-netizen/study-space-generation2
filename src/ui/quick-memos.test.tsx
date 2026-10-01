import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { QuickMemos } from './quick-memos';
import { DemoRepository, DEMO_KEY } from '../data/demo-repository';
import { memoDraftKey } from '../data/memo-draft';
import type { AppState } from '../domain/model';

let repo: DemoRepository;
function Harness() { const [data,setData] = useState<AppState>(repo.getSnapshot()); return <QuickMemos data={data} repository={repo} onSaved={setData} />; }
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); });
afterEach(() => { vi.restoreAllMocks(); });
const add = () => { fireEvent.click(screen.getByRole('button',{ name:'메모 추가' })); fireEvent.click(screen.getByText('글·연결·입력 설정')); };
it('limits accumulated previews while searching all saved memo text and preserves hidden cards', () => {
  const data = repo.getSnapshot();
  for (let index = 0; index < 65; index++) repo.execute({
    type:'saveMemo', id:`accumulated-${String(index).padStart(2,'0')}`, ownerId:null,
    body:index === 64 ? '  마지막 메모의 긴 원문\n찾을 단서  ' : `메모 ${index}`, strokes:[], expectedVersion:0,
    opId:`memo-op-${index}`, at:'2026-10-01T00:00:00.000Z', userId:data.userId, namespace:data.namespace,
  });
  render(<Harness />);
  expect(screen.getAllByRole('button',{name:/메모 \d+ 열기/})).toHaveLength(40);
  fireEvent.change(screen.getByRole('textbox',{name:'메모 찾기'}),{target:{value:'찾을 단서'}});
  expect(screen.getAllByRole('button',{name:/메모 \d+ 열기/})).toHaveLength(1);
  fireEvent.click(screen.getByRole('button',{name:/메모 1 열기/}));
  expect(screen.getByRole('textbox',{name:'짧은 글'})).toHaveValue('  마지막 메모의 긴 원문\n찾을 단서  ');
  fireEvent.click(screen.getByRole('button',{name:'닫기'}));
  fireEvent.change(screen.getByRole('textbox',{name:'메모 찾기'}),{target:{value:''}});
  fireEvent.click(screen.getByRole('button',{name:'메모 더 보기'}));
  expect(screen.getAllByRole('button',{name:/메모 \d+ 열기/})).toHaveLength(65);
  expect(repo.getSnapshot().memos).toHaveLength(65);
});
describe('quick memo editor recovery', () => {
  it('autosaves exact text and restores after close/reload without adding a study record', async () => {
    const view = render(<Harness />); add();
    const body = '  결론 한 줄\n아직 의문  ';
    fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:body}});
    const key = memoDraftKey(repo.getSnapshot(), repo.getSnapshot().memos![0].id);
    await waitFor(() => expect(JSON.parse(localStorage.getItem(key)!).body).toBe(body));
    await waitFor(() => expect(repo.getSnapshot().memos![0].body).toBe(body), {timeout:2500});
    fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    view.unmount(); repo = new DemoRepository(localStorage); render(<Harness />);
    fireEvent.click(screen.getByRole('button',{name:/메모 1 열기/}));
    expect(screen.getByRole('textbox',{name:'짧은 글'})).toHaveValue(body);
    expect(repo.getSnapshot().records).toHaveLength(0); expect(repo.getSnapshot().sessions).toHaveLength(0);
  });
  it('retains draft and editor on main storage failure, then retries without losing text', () => {
    render(<Harness />); add();
    const original = Storage.prototype.setItem;
    const mock = vi.spyOn(Storage.prototype,'setItem').mockImplementation(function(this: Storage,key,value) { if (key === DEMO_KEY) throw Error('quota'); original.call(this,key,value); });
    fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:'실패 때도 보존\n '}});
    fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    expect(screen.getByRole('dialog')).toBeInTheDocument(); expect(screen.getByRole('alert')).toHaveTextContent('초안');
    expect(repo.getSnapshot().memos![0].body).toBe('');
    mock.mockRestore(); fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(repo.getSnapshot().memos![0].body).toBe('실패 때도 보존\n ');
  });
  it('recovers a valid unfinished draft and preserves stale/current content as separate cards', () => {
    render(<Harness />); add(); fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:'저장된 글'}}); fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    const memo = repo.getSnapshot().memos![0], key = memoDraftKey(repo.getSnapshot(),memo.id);
    localStorage.setItem(key,JSON.stringify({id:memo.id,baseVersion:1,ownerId:null,body:'이전 창의 초안',strokes:[]}));
    fireEvent.click(screen.getByRole('button',{name:/메모 1 열기/}));
    expect(screen.getByRole('textbox',{name:'짧은 글'})).toHaveValue('저장된 글'); expect(screen.getByRole('textbox',{name:'짧은 글'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:'초안을 별도 메모로 보관'}));
    expect(repo.getSnapshot().memos?.map(memo=>memo.body)).toEqual(['저장된 글','이전 창의 초안']);
    expect(screen.getByRole('textbox',{name:'짧은 글'})).toHaveValue('이전 창의 초안');
  });
  it('soft deletion and restore preserve the card and original identity', () => {
    render(<Harness />); add(); fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:'휴지통에서도 남김'}}); fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    const id = repo.getSnapshot().memos![0].id;
    fireEvent.click(screen.getByRole('button',{name:'메모 1 휴지통으로 이동'}));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button',{name:'휴지통으로 이동'}));
    expect(screen.queryByRole('button',{name:/메모 1 열기/})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'메모 복원'}));
    expect(repo.getSnapshot().memos![0]).toMatchObject({id,body:'휴지통에서도 남김',deletedAt:null});
  });
});

describe('iPad feedback repairs', () => {
  it('erases intersecting lines during a single sweep immediately, and undo restores their exact coordinates before persistence', () => {
    const data = repo.getSnapshot();
    const strokes = [100,300].map((y,i)=>({id:`line-${i}`,ink:'ink' as const,width:3.5,points:[{x:100,y,pressure:.23},{x:500,y,pressure:.76}]}));
    repo.execute({type:'saveMemo',id:'eraser',ownerId:null,body:'',strokes,expectedVersion:0,opId:'eraser-create',at:new Date().toISOString(),userId:data.userId,namespace:data.namespace});
    render(<Harness/>); fireEvent.click(screen.getByRole('button',{name:/메모 1 열기/}));
    const svg = screen.getByRole('img',{name:'메모 스케치 영역'});
    Object.defineProperty(svg,'setPointerCapture',{value:vi.fn()});
    vi.spyOn(svg,'getBoundingClientRect').mockReturnValue({left:0,top:0,width:900,height:600,right:900,bottom:600,x:0,y:0,toJSON:()=>({})});
    fireEvent.click(screen.getByRole('button',{name:'지우개'}));
    fireEvent.change(screen.getByRole('combobox',{name:'지우는 방식'}),{target:{value:'whole'}});
    fireEvent.pointerDown(svg,{pointerId:1,pointerType:'pen',button:0,clientX:200,clientY:100});
    fireEvent.pointerMove(svg,{pointerId:1,pointerType:'pen',clientX:200,clientY:300});
    fireEvent.pointerUp(svg,{pointerId:1,pointerType:'pen',clientX:200,clientY:300});
    expect(svg.querySelectorAll('path[d]:not([d=""])').length).toBe(0);
    expect(repo.getSnapshot().memos![0].strokes).toEqual(strokes);
    fireEvent.click(screen.getByRole('button',{name:'그림 되돌리기'}));
    expect(svg.querySelectorAll('path[d]:not([d=""])').length).toBe(2);
    fireEvent.click(screen.getByRole('button',{name:'지금 저장'}));
    expect(screen.getByRole('status')).toHaveTextContent('이 기기에 저장됨');
    fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    expect(repo.getSnapshot().memos![0].strokes).toEqual(strokes);
  });
  it('reports volatile input honestly when both draft and main writes fail and retains the editor', () => {
    render(<Harness/>); add();
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('The quota has been exceeded.','QuotaExceededError');});
    fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:' 현재 창 원문\n '}});
    fireEvent.click(screen.getByRole('button',{name:'닫기'}));
    expect(screen.getByRole('alert')).toHaveTextContent('현재 창에만');
    expect(screen.getByRole('alert')).not.toHaveTextContent('초안에 보관');
    expect(screen.getByRole('button',{name:'메모 파일로 보관'})).toBeEnabled();
    expect(screen.getByRole('textbox',{name:'짧은 글'})).toHaveValue(' 현재 창 원문\n ');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
