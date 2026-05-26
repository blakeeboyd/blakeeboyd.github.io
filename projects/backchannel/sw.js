/* Backchannel Service Worker.

   Stage 1 scope: register the worker so the page is PWA-installable and so
   showNotification() can be called via the worker registration (more
   reliable than `new Notification()` on Android background tabs and required
   for iOS PWA notifications). No caching, no offline fallback in this stage.

   Stage 2 will add push-subscription handling. The push and notificationclick
   handlers are in place now so the worker doesn't need a redeploy for
   that — the server just needs to start sending pushes.
*/

const SW_VERSION = "backchannel-sw-v1";

self.addEventListener("install", (event) => {
  // Skip waiting so a fresh deploy starts serving notifications immediately
  // on the next page load. There's no cached content to invalidate.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Claim all open clients so existing tabs start using the new worker
  // without a reload.
  event.waitUntil(self.clients.claim());
});

/* Push events: when Stage 2 lands, the server sends a JSON payload like
   { title, body, tag, url } and this handler surfaces it. For Stage 1 we
   wire it up so the worker is ready, but no pushes actually arrive yet. */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    // Fall back to plain text bodies if the payload isn't JSON.
    try { data = { body: event.data ? event.data.text() : "" }; } catch (e2) {}
  }
  const title = data.title || "Backchannel";
  const options = {
    body: data.body || "",
    tag: data.tag || "backchannel",
    icon: "icons/icon-192.png",
    badge: "icons/icon-192.png",
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

/* In-tab notification path: the page calls registration.showNotification()
   for its own (already-in-tab) notifications. This handler runs identically
   for those and for push-driven ones — when the user taps the notification,
   focus an existing Backchannel tab if there is one, otherwise open the
   notification's target URL. */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    // Prefer focusing an existing Backchannel tab over opening a new one.
    for (const client of allClients) {
      // Match on pathname so the focus works regardless of ?room= query.
      try {
        const url = new URL(client.url);
        if (url.pathname.includes("/projects/backchannel/")) {
          await client.focus();
          return;
        }
      } catch (e) {}
    }
    // No existing tab; open one.
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
  })());
});
