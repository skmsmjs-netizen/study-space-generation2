import type { AppState } from './model';
import type { RecommendationWorkspace } from './recommendation-workspace';
import { recallPrompts, recallQueue } from './recall-scheduler';
import { recallTopics } from './topic-recall';
import { scheduleSteps } from './learning-schedule';
/** Uses existing FSRS and calendar rules, without mixing them into a fabricated ability score. */
export function todayStudy(data: AppState, workspace: RecommendationWorkspace, subjectIds: string[], at: string) {
  const topics = recallTopics(data,subjectIds,{subjectId:'all',unitId:'all'}), queue = recallQueue(data,recallPrompts(data,topics),at);
  const today = new Date(Date.parse(at)+9*60*60*1000).toISOString().slice(0,10);
  const schedules = (workspace.schedules ?? []).filter(s => !s.deletedAt && s.status === 'active' && subjectIds.includes(s.subjectId) && data.subjects.some(sub => sub.id === s.subjectId && !sub.deletedAt) && s.dueDate && (!s.opensDate || s.opensDate <= today) && (scheduleSteps(s.kind).length === 0 || scheduleSteps(s.kind).some(step => s.states[step] !== 'done'))).sort((a,b) => a.dueDate.localeCompare(b.dueDate) || a.id.localeCompare(b.id));
  return { due: queue.due, schedules, topics };
}
