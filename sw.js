const CACHE='la-grey-v3-120-hymn-loading-cleanup';
const STARTUP_COLLAGE='./la-grey-collage-recorte-como-referencia-2.png';
const ASSETS=['./','./index.html','./robots.txt','./sitemap.xml','./sitemap.txt','./styles.css','./profiles.css','./settings-v1.css','./exact-home-v1.css','./layout-v35.css','./voice-accordion-v1.css','./voice-category-v2.css','./voice.css','./songs.js','./hymns.js','./hymns-006-013.js','./hymns-014-022.js','./hymns-023-027.js','./hymns-028-032.js','./hymns-033-042.js','./hymns-043-052.js','./hymns-053-062.js','./hymns-063-072.js','./hymns-073-082.js','./hymns-083-092.js','./hymns-093-100.js','./hymns-101-110.js','./hymns-111-120.js','./hymns-121-130.js','./hymns-131-140.js','./hymns-141-150.js','./hymns-151-160.js','./hymns-161-170.js','./hymns-171-180.js','./hymns-181-190.js','./hymns-191-200.js','./hymns-201-210.js','./hymns-211-220.js','./hymns-221-230.js','./hymns-231-240.js','./hymns-241-250.js','./hymns-251-260.js','./hymns-261-270.js','./hymns-271-280.js','./hymns-281-290.js','./hymns-291-300.js','./hymns-301-310.js','./chords.js','./members.js','./app.js','./profiles-v3.js','./stage-ui.js','./song-reader.js','./voice-pro.js','./voice-accordion-v1.js','./voice-category-v2.js','./voice-foldables-v1.js','./voice-extra-exercises-v1.js','./hymn-numbering.js','./hymn-tools-v2.js','./hymn-core-v20.js','./layout-v35.js','./settings-v2.js','./exact-home-controller-v1.js','./la-grey-consolidation-v1.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',STARTUP_COLLAGE];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.pathname.endsWith('/la-grey-collage-recorte-como-referencia-2.png')){
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response})));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));
});