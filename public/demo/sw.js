const CACHE='yourstory-demo-2026-09-11-v1';
const ASSETS=['./','./index.html','./style.css','./mobile.css','./game.js','./mobile.js','./arcade.js','./moments.js','./icon.svg','./manifest.webmanifest','./assets/characters.png','./assets/club.png','./assets/home.png','./assets/sofa-memory.png','./assets/club-action.png','./assets/plex.woff2'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return response;}).catch(()=>caches.open(CACHE).then(cache=>cache.match(event.request))));});
