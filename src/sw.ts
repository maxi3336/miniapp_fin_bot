/// <reference lib="webworker" />

self.__WB_MANIFEST;

import { precacheAndRoute } from "workbox-precaching";

self.addEventListener("install", () => {
  const serviceWorkerGlobalScope = self as unknown as ServiceWorkerGlobalScope;
  serviceWorkerGlobalScope.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const serviceWorkerGlobalScope = self as unknown as ServiceWorkerGlobalScope;
  const installEvent = event as ExtendableEvent;

  installEvent.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== "my-cache") {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );

  serviceWorkerGlobalScope.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const fetchEvent = event as FetchEvent;

  if (
    fetchEvent.request.url.includes("A2:A9") ||
    fetchEvent.request.url.includes("A2:A16")
  ) {
    fetchEvent.respondWith(
      caches.open("my-cache").then(async (cache) => {
        const cachedResponse = await cache.match(fetchEvent.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetch(fetchEvent.request);
        cache.put(fetchEvent.request, networkResponse.clone());
        return networkResponse;
      })
    );
  }
});

precacheAndRoute(self.__WB_MANIFEST);
