import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {StudyStatistics} from './statistics';
import {createDemoState} from '../domain/fixtures';
import {applyCommand} from '../domain/commands';
import {emptyRecommendations,makeResultEvent,emptyResponse} from '../domain/recommendation-workspace';
import {koreanDay} from '../domain/statistics';
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();vi.useRealTimers();});
it('keeps pinned originals when records change, and shows the same evidence through 2D, depth and list views',()=>{
 let data=createDemoState();const at=new Date().toISOString();data=applyCommand(data,{type:'saveRecords',sessionId:'statistics-session',dateEvidence:{kind:'exact',date:koreanDay(at)},entries:[{targetId:'demo-topic-function',done:true,body:'  시연 원문\n예외'}],userId:data.userId,opId:'statistics-record',at});
 const props={data,subjectIds:['demo-subject-math']};const{rerender}=render(<StudyStatistics {...props}/>);
 fireEvent.click(screen.getByRole('button',{name:'입체'}));expect(screen.getByRole('img')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'목록'}));expect(screen.getByRole('table')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'전체 근거 보기'}));const dialog=screen.getByRole('dialog');fireEvent.click(within(dialog).getByRole('button',{name:'이 근거 고정하기'}));
 data={...data,records:data.records.map(r=>({...r,body:'새 수정 원문'}))};rerender(<StudyStatistics {...props} data={data}/>);expect(within(dialog).getByText('시연 원문 예외')).toBeInTheDocument();expect(within(dialog).queryByText('새 수정 원문')).toBeNull();
});
it('disables automatic playback for reduced motion while preserving manual interval navigation',()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:()=>{},removeEventListener:()=>{}}));render(<StudyStatistics data={createDemoState()} subjectIds={['demo-subject-math']}/>);
 expect(screen.getByRole('button',{name:'시간순 재생'})).toBeDisabled();fireEvent.click(screen.getByRole('button',{name:'다음 구간'}));expect(screen.getByText(/구간까지 강조/)).toBeInTheDocument();
});

it('shows the latest verdict in graph evidence and keeps the pinned revision after a later correction',()=>{
 let data=createDemoState();const at=new Date().toISOString(),workspace=emptyRecommendations(data);
 const goal={id:'g',targetId:'demo-topic-function',label:'조건',dueDate:'',novelty:'same' as const,createdAt:at,ended:false};workspace.goals=[goal];
 const event=makeResultEvent(goal,{...emptyResponse(),answer:'당시 답안',result:'pass',assistance:'none',novelty:'same'},workspace,at,'event');
 workspace.events=[event,{...event,revision:2,result:'fail'}];
 data=applyCommand(data,{type:'saveLearningPlan',id:'learning-plan:main',expectedVersion:0,workspace,userId:data.userId,namespace:data.namespace,opId:'result',at});
 const {rerender}=render(<StudyStatistics data={data} subjectIds={['demo-subject-math']}/>);
 fireEvent.click(screen.getByRole('button',{name:/도움 없이 확인한 수행/}));fireEvent.click(screen.getByRole('button',{name:'전체 근거 보기'}));
 const dialog=screen.getByRole('dialog');expect(within(dialog).getByText('막힘 · 자기 보고')).toBeInTheDocument();expect(within(dialog).queryByText('기준 충족 · 자기 보고')).toBeNull();
 fireEvent.click(within(dialog).getByRole('button',{name:'이 근거 고정하기'}));
 workspace.events.push({...event,revision:3,result:'pass'});data=applyCommand(data,{type:'saveLearningPlan',id:'learning-plan:main',expectedVersion:1,workspace,userId:data.userId,namespace:data.namespace,opId:'correct',at});
 rerender(<StudyStatistics data={data} subjectIds={['demo-subject-math']}/>);expect(within(dialog).getByText('막힘 · 자기 보고')).toBeInTheDocument();
 fireEvent.click(within(dialog).getByRole('button',{name:'고정 풀기'}));expect(within(dialog).getByText('기준 충족 · 자기 보고')).toBeInTheDocument();
});
