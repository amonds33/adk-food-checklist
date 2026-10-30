// V4: réseau prioritaire pour recevoir les mises à jour, cache en secours hors connexion.
const CACHE = 'adk-check-v4-network-first';
const FILES = ['./', './index.html', './app.js?v=4', './styles.css?v=4', './manifest.webmanifest', './icon-192.png', './icon-512.png', './logo-adk.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('adk-check-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
 event.respondWith(fetch(event.request).then(response => {
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
   return response;
 }).catch(async () => (await caches.match(event.request)) || (await caches.match('./index.html'))));
});
