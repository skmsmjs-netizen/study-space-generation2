import type { AppState } from '../domain/model';
import { calendarMonth } from '../domain/study-calendar';
const key = (data: AppState) => `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:statistics-month:v1`;
export function readStatisticsMonth(data: AppState, fallback: string) {
  try { const month = localStorage.getItem(key(data)) ?? fallback; calendarMonth(month); return { month, error: '' }; }
  catch { return { month: fallback, error: '이 기기의 월 선택을 읽지 못했습니다. 저장된 기록은 유지했습니다.' }; }
}
export function saveStatisticsMonth(data: AppState, month: string) { calendarMonth(month); localStorage.setItem(key(data), month); }
