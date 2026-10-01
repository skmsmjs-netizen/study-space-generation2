/* Push only: no fetch interception and no claim of offline app support. */
self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let payload; try { payload = event.data?.json(); } catch { payload = null; }
    const title = typeof payload?.title === 'string' ? payload.title : '공부 일정';
    const body = typeof payload?.body === 'string' ? payload.body : '공부 공간에서 일정을 확인해 주세요.';
    await self.registration.showNotification(title, { body, tag: 'study-schedule-daily', data: { url: new URL('./?space=personal#/schedules', self.registration.scope).href } });
  })());
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL('./?space=personal#/schedules', self.registration.scope).href;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = windows.find(client => client.url.startsWith(self.registration.scope));
    if (existing) { await existing.navigate(url); await existing.focus(); } else await self.clients.openWindow(url);
  })());
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
