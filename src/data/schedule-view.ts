import type { AppState } from '../domain/model';
export interface ScheduleView {
  view: 'list' | 'calendar';
  kind: string;
  status: 'active' | 'ended' | 'trash';
  query: string;
  month: string;
  selectedDate?: string;
  selectedId?: string;
  period?: 'all' | 'week' | 'month';
  limit?: number;
}
const key = (data: AppState) =>
  `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:schedule-view:v1`;
export function readScheduleView(data: AppState, month: string): ScheduleView {
  const fallback: ScheduleView = { view: 'list', kind: 'all', status: 'active', query: '', month };
  try {
    const value = JSON.parse(localStorage.getItem(key(data)) || 'null');
    return value &&
      ['list', 'calendar'].includes(value.view) &&
      ['active', 'ended', 'trash'].includes(value.status) &&
      typeof value.kind === 'string' &&
      typeof value.query === 'string' &&
      /^\d{4}-(0[1-9]|1[0-2])$/.test(value.month)
      ? {
          ...value,
          selectedDate:
            typeof value.selectedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.selectedDate)
              ? value.selectedDate
              : '',
          selectedId: typeof value.selectedId === 'string' ? value.selectedId : '',
          period: ['all', 'week', 'month'].includes(value.period) ? value.period : 'all',
          limit: Number.isSafeInteger(value.limit) && value.limit >= 20 ? value.limit : 20,
        }
      : fallback;
  } catch {
    return fallback;
  }
}
export function saveScheduleView(data: AppState, value: ScheduleView) {
  localStorage.setItem(key(data), JSON.stringify(value));
}
export function downloadCalendar(content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' }),
    url = URL.createObjectURL(blob),
    a = document.createElement('a');
  a.href = url;
  a.download = '공부-일정.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
