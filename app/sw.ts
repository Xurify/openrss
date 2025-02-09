import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, StaleWhileRevalidate } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();

self.addEventListener("activate", () => self.clients.claim());

//const queue = new BackgroundSyncQueue("OpenRSS_Queue");

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
    fallbacks: {
      entries: [
        {
          url: "/~offline",
          matcher({ request }) {
            return request.destination === "document";
          },
        },
      ],
    },
  });
  
const swr = new StaleWhileRevalidate();

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin && url.pathname === "/") {
    event.respondWith(swr.handle({ event, request }));
  }
});

// self.addEventListener("fetch", (event) => {
//     const url = new URL(event.request.url);
//     // For "/legacy-post" with the method "POST", this simply makes a network request,
//     // but if that fails due to a network problem, the request is added to the background
//     // synchronization queue and will be retried later.
//     if (event.request.method === "POST" && url.origin === location.origin && url.pathname === "/legacy-post") {
//       const backgroundSync = async () => {
//         try {
//           const response = await fetch(event.request.clone());
//           return response;
//         } catch (error) {
//           await queue.pushRequest({ request: event.request });
//           return Response.error();
//         }
//       };
//       event.respondWith(backgroundSync());
//     }
//   });

serwist.addEventListeners();