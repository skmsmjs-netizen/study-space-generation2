export function openLearningSchedules() {
  const panel = document.getElementById('learning-schedules');
  if (!(panel instanceof HTMLDetailsElement)) return;
  panel.open = true;
  panel.querySelector('summary')?.focus({ preventScroll: true });
  panel.scrollIntoView({ block: 'start' });
}
