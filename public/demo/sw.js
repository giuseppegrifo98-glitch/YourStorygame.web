const CACHE='yourstory-demo-2026-09-25-v3';
const VERSION='20260925-3';
const sprites=['me','lana','pere','maria','kitten','pablo','head-me','head-lana','head-pere','head-maria','head-kitten','angry','run','attacker'];
const versioned=['style.css','mobile.css','game.js','mobile.js','arcade.js','moments.js','assets/club.png','assets/home.png','assets/sofa-memory.png',...sprites.map(name=>'assets/sprites/'+name+'.png')];
const ASSETS=['./','./index.html','./icon.svg','./manifest.webmanifest','./assets/plex.woff2',...versioned.map(path=>'./'+path+'?v='+VERSION)];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!event.request.url.startsWith(self.registration.scope))return;
 event.respondWith(fetch(event.request,{cache:'no-cache'}).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
  return response;
 }).catch(async()=>{
  const cache=await caches.open(CACHE),cached=await cache.match(event.request);
  if(cached)return cached;
  if(event.request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
  return Response.error();
 }));
});
