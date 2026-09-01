const CACHE='la-grey-v3-181-smooth-search-ui';
const STARTUP_COLLAGE='./la-grey-collage-recorte-como-referencia-2.png';
const ASSETS=['./','./index.html','./robots.txt','./sitemap.xml','./sitemap.txt','./styles.css','./profiles.css','./settings-v1.css','./exact-home-v1.css','./layout-v35.css','./voice-accordion-v1.css','./voice-category-v2.css','./voice-foldables-v1.css','./voice.css','./songs.js','./hymns.js','./hymns-006-013.js','./hymns-014-022.js','./hymns-023-027.js','./hymns-028-032.js','./hymns-033-042.js','./hymns-043-052.js','./hymns-053-062.js','./hymns-063-072.js','./hymns-073-082.js','./hymns-083-092.js','./hymns-093-100.js','./hymns-101-110.js','./hymns-111-120.js','./hymns-121-130.js','./hymns-131-140.js','./hymns-141-150.js','./hymns-151-160.js','./hymns-161-170.js','./hymns-171-180.js','./hymns-181-190.js','./hymns-191-200.js','./hymns-201-210.js','./hymns-211-220.js','./hymns-221-230.js','./hymns-231-240.js','./hymns-241-250.js','./hymns-251-260.js','./hymns-261-270.js','./hymns-271-280.js','./hymns-281-290.js','./hymns-291-300.js','./hymns-301-310.js','./hymns-311-320.js','./chords.js','./members.js','./app.js','./profiles-v3.js','./stage-ui.js','./song-reader.js','./voice.js','./voice-pro.js','./voice-accordion-v1.js','./voice-category-v2.js','./voice-foldables-v1.js','./voice-extra-exercises-v1.js','./hymn-numbering.js','./hymn-tools-v2.js','./layout-v35.js','./settings-v2.js','./exact-home-controller-v1.js','./la-grey-consolidation-v1.js','./cloud/config.js','./cloud/data-service.js','./cloud/supabase-client.js','./cloud/auth-service.js','./cloud/ministry-service.js','./cloud/bootstrap.js','./cloud/loader.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',STARTUP_COLLAGE];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const results=await Promise.allSettled(ASSETS.map(asset=>cache.add(asset)));
    results.forEach((result,index)=>{
      if(result.status==='rejected'){
        console.warn('[La Grey SW] No se pudo precargar:',ASSETS[index],result.reason);
      }
    });
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('la-grey-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  const url=new URL(event.request.url);

  if(url.origin!==self.location.origin)return;

  if(url.pathname.endsWith('/la-grey-collage-recorte-como-referencia-2.png')){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached)return cached;

      const response=await fetch(event.request);
      if(response.ok){
        const cache=await caches.open(CACHE);
        await cache.put(event.request,response.clone());
      }
      return response;
    })());
    return;
  }

  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(event.request,{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(CACHE);
          await cache.put('./index.html',response.clone());
        }
        return response;
      }catch(error){
        const cachedIndex=await caches.match('./index.html');
        if(cachedIndex)return cachedIndex;
        throw error;
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok){
        const cache=await caches.open(CACHE);
        await cache.put(event.request,response.clone());
      }
      return response;
    }catch(error){
      const cached=await caches.match(event.request,{ignoreSearch:true});
      if(cached)return cached;
      throw error;
    }
  })());
});