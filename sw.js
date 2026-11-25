const C='kolekta-v45',A=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'],X=['https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js','https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'];   // X = scanner libraries, cached at install so scanning works offline right away
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A).then(()=>Promise.allSettled(X.map(u=>c.add(u))))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.hostname.endsWith('google.com'))return;
const k=(e.request.mode==='navigate'&&u.search)?new Request(u.origin+u.pathname):e.request;   // receipt links (?v=...) all share one cached page
e.respondWith(caches.match(k).then(m=>{const n=fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const cl=r.clone();caches.open(C).then(c=>c.put(k,cl))}return r}).catch(()=>m);return m||n}))});
