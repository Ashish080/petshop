/**
 * Pet Shop Service Worker: Background Notification Orchestrator
 */

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { 
    title: 'Status Update 🐾', 
    body: 'Your mission has progressed to the next phase.' 
  };

  const options = {
    body: data.body,
    icon: '/next.svg', // In real app, provide a dedicated notification icon
    badge: '/favicon.ico',
    tag: 'order-update',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/orders'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
