import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Workspace } from './App';
import { PersonalRepository, type OnlineTransport } from './data/personal-repository';
import { applyCommand } from './domain/commands';
import { DomainError, emptyState, type Command } from './domain/model';
import { storagePrefix } from './data/repository';
const userId = '70000000-0000-4000-8000-000000000001';
function fixture() {
  let data = emptyState(userId,'test');
  const base = { userId, namespace: 'test' as const, at: '2026-09-30T01:00:00.000Z' };
  data = applyCommand(data,{ ...base, opId:'seed-1',type:'addSubject',id:'course',name:'검증용 과목',scope:{kind:'independent'} });
  data = applyCommand(data,{ ...base, opId:'seed-2',type:'addNode',id:'topic',subjectId:'course',parentId:null,role:'topic',name:'검증용 주제' });
  let server = { sequence: 2, data };
  let unavailable = false;
  const transport: OnlineTransport = { load: async () => server, execute: async (command: Command, base: number) => {
    if (unavailable) throw new DomainError('AUTH_REQUIRED','로그인이 만료되었습니다. 글은 이 기기에 남아 있습니다.');
    if (base !== server.sequence) throw Error('stale');
    server = { sequence: server.sequence + 1, data: applyCommand(server.data,command) }; return server;
  } };
  return { repository: new PersonalRepository(localStorage,transport,server), transport, server: () => server, fail: () => { unavailable = true; }, recover: () => { unavailable = false; } };
}
beforeEach(() => { localStorage.clear(); sessionStorage.clear(); history.replaceState(null,'','/#/record'); });
afterEach(cleanup);
describe('existing input screens connected to the personal repository', () => {
  it('saves exact writing, reloads it, preserves demo storage and isolates drafts', async () => {
    localStorage.setItem('study-space:demo:v1','untouched demo');
    localStorage.setItem('study-space:demo:draft:multiple','unrelated damaged demo draft');
    const f = fixture(), user = userEvent.setup(), view = render(<Workspace repository={f.repository} />);
    await user.click(screen.getByRole('checkbox',{name:/검증용 주제/}));
    const body = '  남길 원문\n일부 수행과 이유\n';
    fireEvent.change(screen.getByRole('textbox',{name:'메모'}),{target:{value:body}});
    expect(localStorage.getItem(`${storagePrefix(f.repository.getSnapshot())}:draft:multiple`)).toContain('남길 원문');
    await user.click(screen.getByRole('button',{name:'1개 주제 기록 저장'}));
    await act(async () => { await f.repository.flush(); });
    expect(f.server().data.records[0].body).toBe(body); expect(f.repository.getStatus().phase).toBe('saved');
    expect(localStorage.getItem('study-space:demo:v1')).toBe('untouched demo'); expect(localStorage.getItem('study-space:demo:draft:multiple')).toBe('unrelated damaged demo draft');
    view.unmount(); const reopened = new PersonalRepository(localStorage,f.transport,f.server());
    expect(reopened.getSnapshot().records[0].body).toBe(body); expect(reopened.getSnapshot().sessions).toHaveLength(1);
  });
  it('retains written records after session expiry and retries the same operation', async () => {
    const f = fixture(), user = userEvent.setup(); f.fail(); render(<Workspace repository={f.repository} />);
    await user.click(screen.getByRole('checkbox',{name:/검증용 주제/}));
    fireEvent.change(screen.getByRole('textbox',{name:'메모'}),{target:{value:'만료되어도 보존할 원문'}});
    await user.click(screen.getByRole('button',{name:'1개 주제 기록 저장'}));
    await act(async () => { await f.repository.flush(); });
    expect(f.server().data.records).toHaveLength(0); expect(f.repository.getStatus().phase).toBe('error'); expect(f.repository.getSnapshot().records[0].body).toBe('만료되어도 보존할 원문');
    f.recover(); await act(async () => { await f.repository.flush(); });
    expect(f.server().data.records).toHaveLength(1); expect(f.server().data.sessions).toHaveLength(1);
  });
});
