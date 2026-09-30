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
const add = () => fireEvent.click(screen.getByRole('button',{ name:'메모 추가' }));
describe('quick memo editor recovery', () => {
  it('autosaves exact text and restores after close/reload without adding a study record', async () => {
    const view = render(<Harness />); add();
    const body = '  결론 한 줄\n아직 의문  ';
    fireEvent.change(screen.getByRole('textbox',{name:'짧은 글'}),{target:{value:body}});
    const key = memoDraftKey(repo.getSnapshot(), repo.getSnapshot().memos![0].id);
    expect(JSON.parse(localStorage.getItem(key)!).body).toBe(body);
    await waitFor(() => expect(repo.getSnapshot().memos![0].body).toBe(body));
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
