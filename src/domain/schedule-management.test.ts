import { expect, it } from 'vitest';
import { addDays, calendarFile, changeSchedule, koreanDay, monthDays, remainingTime, restoreSchedule, scheduleDigest, weeklySchedules } from './schedule-management';
import { scheduleDeadline, type LearningSchedule } from './learning-schedule';
import { createDemoState } from './fixtures';
import { emptyRecommendations, recommendationInput, validateRecommendations } from './recommendation-workspace';
const base:LearningSchedule={id:'task',subjectId:'demo-subject-math',name:'조건과 예외\n과제',kind:'assignment',goalIds:[],targetIds:[],dueDate:'2026-10-08',opensDate:'',weight:null,status:'active',states:{prepare:'done',submit:'unknown'},dueMeaning:'submission',note:'  原文\r\n\u0000\ud800  '};
it('keeps unknown time, uses Korean midnight and honors an explicitly entered deadline time',()=>{
 expect(koreanDay('2026-09-30T15:00:00Z')).toBe('2026-10-01');
 expect(remainingTime(base,'2026-10-01T00:00:00Z')).toBe('7일 남음 · 시각 미정');
 expect(scheduleDeadline({...base,dueTime:'09:30'})).toBe('2026-10-08T00:30:00.000Z');
 expect(remainingTime({...base,dueTime:'09:30'},'2026-10-08T00:15:00Z')).toBe('15분 남음');
 const data=createDemoState(),w=emptyRecommendations(data);w.schedules=[{...base,dueTime:'09:30'}];validateRecommendations(w,data);expect(recommendationInput(data,w).model.tasks.find(t=>t.kind==='submit')?.dueAt).toBe('2026-10-08T00:30:00.000Z');
 w.schedules[0].opensDate='2026-10-08';w.schedules[0].opensTime='10:00';expect(()=>validateRecommendations(w,data)).toThrow('시작');
});
it('makes one digest across kinds without completed deadlines, archived/trash data or unknown-result invention',()=>{
 const lecture:LearningSchedule={...base,id:'lecture',kind:'lecture' as const,dueMeaning:'attendance' as const,states:{attendance:'done',learn:'unknown'}};
 const unknown={...base,id:'unknown',dueDate:'',reviewDate:'2026-10-01'};
 expect(scheduleDigest([base,lecture,unknown,{...base,id:'ended',status:'ended'},{...base,id:'trash',deletedAt:'2026-10-01T00:00:00Z'},{...base,id:'submitted',states:{submit:'done'}}],'2026-10-01T00:00:00Z')).toMatchObject({count:2,due:[base],unknown:[unknown]});
});
it('preserves exact previous content and restores optional fields without retaining a later deadline time',()=>{
 const changed=changeSchedule(base,{dueDate:'2026-10-09',dueTime:'12:00',note:'수정'},'2026-10-01T00:00:00Z','기한 수정');
 expect(changed.history![0].previous).toEqual(base);expect(base.history).toBeUndefined();
 const restored=restoreSchedule(changed,changed.history![0].previous,'2026-10-01T01:00:00Z');expect(restored.note).toBe(base.note);expect(restored.dueDate).toBe(base.dueDate);expect(restored.dueTime).toBeUndefined();expect(restored.history).toHaveLength(2);
});
it('expands explicit weekly dates with independent IDs and blank subsequent performance, never forever',()=>{
 let id=0;const rows=weeklySchedules({...base,opensDate:'2026-10-01'},'2026-10-15',()=>`week-${++id}`);
 expect(rows.map(s=>s.opensDate)).toEqual(['2026-10-01','2026-10-08','2026-10-15']);expect(new Set(rows.map(s=>s.id)).size).toBe(3);expect(rows[1].states).toEqual({});expect(rows[0].states).toEqual(base.states);expect(()=>weeklySchedules(base,'2028-01-01',()=>'' )).toThrow('1년');
 expect(monthDays('2026-10')).toHaveLength(42);expect(addDays('2026-12-31',1)).toBe('2027-01-01');
});
it('exports RFC calendar dates, escaping and UTF-8 folding and one aggregate 9am alarm per day',()=>{
 const s={...base,name:'긴 한국어 제목,조건;예외\\'.repeat(12),note:'원문\n예외',dueTime:'10:00'};
 const file=calendarFile([s,{...s,id:'second'}],'2026-10-01T00:00:00Z','owner');
 expect(file).toContain('DTSTART:20261008T010000Z');expect(file).toContain('TRIGGER:PT0S');expect(file).toContain('SUMMARY:일주일 안의 공부 일정 2개');
 for(const line of file.split('\r\n'))expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
 const unwrapped=file.replace(/\r\n /g,'');expect(unwrapped).toContain('\\,조건\\;예외\\\\');expect((file.match(/BEGIN:VALARM/g)||[]).length).toBe(8);
});
