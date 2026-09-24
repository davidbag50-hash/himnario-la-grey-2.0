const CACHE='la-grey-v3-237-academy-photo-cache';
const STARTUP_COLLAGE='./la-grey-collage-recorte-como-referencia-2.png';
const OFFLINE_ENTRY='./index.html';
const REQUIRED_ASSETS=['./','./index.html','./styles.css','./profiles.css','./settings-v1.css','./exact-home-v1.css','./layout-v35.css','./voice-accordion-v1.css','./voice-category-v2.css','./songs.js','./hymns.js','./hymns-006-013.js','./hymns-014-022.js','./hymns-023-027.js','./hymns-028-032.js','./hymns-033-042.js','./hymns-043-052.js','./hymns-053-062.js','./hymns-063-072.js','./hymns-073-082.js','./hymns-083-092.js','./hymns-093-100.js','./hymns-101-110.js','./hymns-111-120.js','./hymns-121-130.js','./hymns-131-140.js','./hymns-141-150.js','./hymns-151-160.js','./hymns-161-170.js','./hymns-171-180.js','./hymns-181-190.js','./hymns-191-200.js','./hymns-201-210.js','./hymns-211-220.js','./hymns-221-230.js','./hymns-231-240.js','./hymns-241-250.js','./hymns-251-260.js','./hymns-261-270.js','./hymns-271-280.js','./hymns-281-290.js','./hymns-291-300.js','./hymns-301-310.js','./hymns-311-320.js','./chords.js','./members.js','./app.js','./ministry-history-v1.js','./profiles-v3.js','./stage-ui.js','./song-reader.js','./voice.js','./voice-extra-exercises-v1.js','./voice-pro.js','./voice-accordion-v1.js','./hymn-numbering.js','./hymn-tools-v2.js','./layout-v35.js','./voice-category-v2.js','./settings-v2.js','./exact-home-controller-v1.js','./la-grey-consolidation-v1.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',STARTUP_COLLAGE];
const OPTIONAL_ASSETS=['./robots.txt','./sitemap.xml','./sitemap.txt','./voice-foldables-v1.css','./voice-foldables-v1.js','./credential-isolation-v1.js','./account-onboarding-v2.js','./members-roster-v1.js','./members-management-v1.js','./song-seo-v1.js','./cloud/config.js','./cloud/data-service.js','./cloud/supabase-client.js','./cloud/auth-service.js','./cloud/ministry-service.js','./cloud/bootstrap.js','./cloud/diagnostics.js','./cloud/loader.js'];
const PRECACHE_BATCH_SIZE=6;

async function cacheRequiredAssets(cache){
  for(let i=0;i<REQUIRED_ASSETS.length;i+=PRECACHE_BATCH_SIZE){
    const batch=REQUIRED_ASSETS.slice(i,i+PRECACHE_BATCH_SIZE);
    await Promise.all(batch.map(asset=>cache.add(asset)));
  }
}

async function cacheOptionalAssets(cache){
  for(let i=0;i<OPTIONAL_ASSETS.length;i+=PRECACHE_BATCH_SIZE){
    const batch=OPTIONAL_ASSETS.slice(i,i+PRECACHE_BATCH_SIZE);
    const results=await Promise.allSettled(batch.map(asset=>cache.add(asset)));
    results.forEach((result,index)=>{
      if(result.status==='rejected'){
        console.warn('[La Grey SW] No se pudo precargar recurso opcional:',batch[index],result.reason);
      }
    });
  }
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);

    // La nueva versión solo se instala si el núcleo completo de la app queda
    // realmente disponible offline. Así nunca sustituimos una caché anterior
    // por otra que no tenga index.html, songs.js u otro archivo esencial.
    await cacheRequiredAssets(cache);
    await cacheOptionalAssets(cache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    const offlineEntry=await cache.match(OFFLINE_ENTRY,{ignoreSearch:true});
    if(!offlineEntry){
      throw new Error('[La Grey SW] No se activará una caché sin index.html');
    }

    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('la-grey-')&&key!==CACHE).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;

  const url=new URL(event.request.url);
  if(url.hostname==='images.pexels.com'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(event.request);
      if(cached)return cached;
      try{
        const response=await fetch(event.request);
        if(response.ok||response.type==='opaque')await cache.put(event.request,response.clone());
        return response;
      }catch(error){
        if(cached)return cached;
        throw error;
      }
    })());
    return;
  }
  if(url.origin!==self.location.origin)return;

  if(url.pathname.endsWith('/la-grey-collage-recorte-como-referencia-2.png')){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(event.request,{ignoreSearch:true});
      if(cached)return cached;

      const response=await fetch(event.request);
      if(response.ok)await cache.put(event.request,response.clone());
      return response;
    })());
    return;
  }

  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const response=await fetch(event.request,{cache:'no-store'});
        if(response.ok){
          await cache.put(OFFLINE_ENTRY,response.clone());
          return response;
        }

        const cachedIndex=await cache.match(OFFLINE_ENTRY,{ignoreSearch:true});
        return cachedIndex||response;
      }catch(error){
        const cachedIndex=await cache.match(OFFLINE_ENTRY,{ignoreSearch:true});
        if(cachedIndex)return cachedIndex;
        throw error;
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request,{cache:'no-store'});
      if(response.ok){
        await cache.put(event.request,response.clone());
        return response;
      }

      const cached=await cache.match(event.request,{ignoreSearch:true});
      return cached||response;
    }catch(error){
      const cached=await cache.match(event.request,{ignoreSearch:true});
      if(cached)return cached;
      throw error;
    }
  })());
});
