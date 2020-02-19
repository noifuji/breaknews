/*global self*/


// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v5';
const DATA_CACHE_NAME = 'data-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    './',
    './index.html',
    './img/favicon.ico',
    './img/ic_launcher_144.png',
    './img/ic_launcher_192.png',
    './img/ic_launcher_36.png',
    './img/ic_launcher_48.png',
    './img/ic_launcher_72.png',
    './img/ic_launcher_96.png',
    './js/app.bundle.js',
    './js/onsenui.min.js',
    './stylesheets/style.css',
    './stylesheets/onsen-css-components.min.css',
    './stylesheets/onsenui.css'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    //Add offline files
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    //Remove all caches
    evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
);

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // CODELAB: Add fetch event handler here.
  
  evt.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(evt.request)
          .then((response) => {
            return response || fetch(evt.request);
          });
    })
);
});
