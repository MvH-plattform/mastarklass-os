const CACHE_NAME='mastarklass-os-9.9.0';
const APP_SHELL=['./','./index.html','./manifest.json','./icon.svg','./stable_foundation_9_9_0.css','./stable_foundation_9_9_0.js'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).catch(()=>{}))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return; if(event.request.mode==='navigate'){event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return;} event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(event.request,c));return r}).catch(()=>caches.match(event.request)))});
