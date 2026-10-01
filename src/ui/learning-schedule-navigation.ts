export function openLearningSchedules(scheduleId?: string) {
  const panel = document.getElementById('learning-schedules');
  if (!(panel instanceof HTMLDetailsElement)) return;
  panel.open = true;
  if (scheduleId) { window.dispatchEvent(new CustomEvent('study-space:open-schedule', { detail: scheduleId })); return; }
  panel.querySelector('summary')?.focus({ preventScroll: true });
  panel.scrollIntoView({ block: 'start' });
}
