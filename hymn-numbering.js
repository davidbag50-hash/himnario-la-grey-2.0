(()=>{
'use strict';
const $=id=>document.getElementById(id),songs=()=>window.LAGREY_SONGS||[];
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es';
const byId=id=>songs().find(s=>Number(s.id)===Number(id));
function decorate(root=document){
 root.querySelectorAll('[data-song],[data-search-song]').forEach(b=>{
  const s=byId(b.dataset.song||b.dataset.searchSong);if(!s||s.type!=='himnos'||!s.bookNumber)return;
  const title=b.querySelector('b');if(title&&!title.dataset.numbered){title.textContent=`${s.bookNumber}. ${s.title}`;title.dataset.numbered='1'}
 });
 const badge=$('songTypeBadge'),title=$('songTitle');
 const s=title?songs().find(x=>x.type==='himnos'&&x.title===title.textContent.trim()):null;
 let n=$('hymnNumberBadge');
 if(s?.bookNumber){if(!n){n=document.createElement('span');n.id='hymnNumberBadge';n.className='badge';badge?.insertAdjacentElement('afterend',n)}if(n){n.textContent=`${lang()==='en'?'No.':'N.º'} ${s.bookNumber}`;n.classList.remove('hidden')}}
 else n?.classList.add('hidden');
}
function numericSearch(){
 const q=$('q')?.value.trim();if(!q)return;const m=q.match(/^(?:(?:himno|hymn)\s*)?#?\s*(\d{1,3})$/i);if(!m)return;const num=Number(m[1]);const found=songs().filter(s=>s.type==='himnos'&&Number(s.bookNumber)===num);const r=$('results');if(!r)return;r.classList.toggle('hidden',!found.length);r.innerHTML=found.map(s=>`<button class="song" data-search-song="${s.id}"><span><b>${s.bookNumber}. ${s.title}</b><br><small class="muted">${s.artist}</small></span><span class="tone">${s.tone}</span></button>`).join('');r.querySelectorAll('[data-search-song]').forEach(b=>{const id=Number(b.dataset.searchSong);b.onclick=()=>{
   /* La lista se prepara y el himno se abre en el mismo ciclo, antes de que el navegador pinte la vista intermedia. */
   document.querySelector('[data-open="hymns"]')?.click();
   const item=document.querySelector(`#songList [data-song="${id}"]`);
   if(item)item.click();
 }});
}
function schedule(){setTimeout(()=>{decorate();numericSearch()},0);setTimeout(()=>decorate(),80)}
function wire(){
 document.addEventListener('click',schedule);
 $('q')?.addEventListener('input',()=>setTimeout(()=>{numericSearch();decorate()},0));
 new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))decorate()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 /* Evitamos observar todo el body: las listas y búsquedas ya se actualizan por sus eventos reales. */
 schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();

(()=>{
'use strict';
const BASE='https://davidbag50-hash.github.io/himnario-la-grey-2.0/';
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',tx=(es,en)=>lang()==='en'?en:es;
const HOME_SEO={
 es:{title:'La Grey — Himnario, Cantos, Acordes y Entrenamiento Vocal',desc:'La Grey es un himnario y cancionero cristiano con himnos, cantos, acordes para guitarra y piano, afinador, calendario y ejercicios de entrenamiento vocal.',short:'Himnario y cancionero cristiano con cantos, himnos, acordes, afinador y entrenamiento vocal.',twitter:'La Grey — Himnario y Cancionero Cristiano',twitterDesc:'Cantos, himnos, acordes, afinador y entrenamiento vocal en La Grey.'},
 en:{title:'La Grey — Hymns, Songs, Chords and Vocal Training',desc:'La Grey is a Christian hymn and song app with hymns, songs, guitar and piano chords, tuner, calendar and vocal training exercises.',short:'Christian hymns and songs with chords, tuner, calendar and vocal training.',twitter:'La Grey — Christian Hymns and Songs',twitterDesc:'Songs, hymns, chords, tuner and vocal training in La Grey.'}
};
const songs=()=>window.LAGREY_SONGS||[];
const byId=id=>songs().find(s=>Number(s.id)===Number(id));
function setNamed(name,value){const el=document.querySelector(`meta[name="${name}"]`);if(el)el.setAttribute('content',value)}
function setProp(name,value){const el=document.querySelector(`meta[property="${name}"]`);if(el)el.setAttribute('content',value)}
function canonical(url){const el=document.querySelector('link[rel="canonical"]');if(el)el.setAttribute('href',url)}
function songUrl(s){return BASE+'?song='+encodeURIComponent(s.id)}
function songLabel(s){return s.type==='himnos'&&s.bookNumber?`${tx('Himno','Hymn')} ${s.bookNumber}: ${s.title}`:s.title}
function songDescription(s){const kind=s.type==='himnos'?(s.bookNumber?`${tx('Himno','Hymn')} ${s.bookNumber}`:tx('Himno','Hymn')):tx('Canto','Song');return lang()==='en'?`${kind}: ${s.title}. Chords, key ${s.tone} and musical tools in La Grey.`:`${kind}: ${s.title}. Acordes, tono ${s.tone} y herramientas musicales en La Grey.`}
function structured(s,url,desc){let el=document.getElementById('songSeoJsonLd');if(!el){el=document.createElement('script');el.id='songSeoJsonLd';el.type='application/ld+json';document.head.appendChild(el)}el.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:songLabel(s)+' — La Grey',url,description:desc,inLanguage:lang(),isPartOf:{'@type':'WebSite',name:'La Grey',url:BASE},about:{'@type':'MusicComposition',name:s.title}})}
function siteStructured(){const meta=HOME_SEO[lang()],el=document.querySelector('script[type="application/ld+json"]:not(#songSeoJsonLd)');if(el)el.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'La Grey',alternateName:tx('Himnario-Cancionero La Grey','La Grey Hymns and Songs'),url:BASE,description:meta.desc,inLanguage:lang()})}
function setSongSeo(s){if(!s)return;const url=songUrl(s),label=songLabel(s),desc=songDescription(s),title=`${label} — ${tx('Acordes','Chords')} | La Grey`;document.title=title;canonical(url);setNamed('description',desc);setProp('og:locale',lang()==='en'?'en_US':'es_PA');setProp('og:title',title);setProp('og:description',desc);setProp('og:url',url);setNamed('twitter:title',title);setNamed('twitter:description',desc);structured(s,url,desc)}
function setHomeSeo(){const meta=HOME_SEO[lang()];document.title=meta.title;canonical(BASE);setNamed('description',meta.desc);setProp('og:locale',lang()==='en'?'en_US':'es_PA');setProp('og:title',meta.title);setProp('og:description',meta.short);setProp('og:url',BASE);setNamed('twitter:title',meta.twitter);setNamed('twitter:description',meta.twitterDesc);document.getElementById('songSeoJsonLd')?.remove();siteStructured()}
function routeUrl(s,mode='push'){const url=songUrl(s);if(location.href===url)return;history[mode==='replace'?'replaceState':'pushState']({song:s.id},'',url)}
function clearRoute(){if(location.href!==BASE)history.replaceState({},'',BASE)}
function openThroughApp(s){if(!s)return;const opener=document.querySelector(`[data-open="${s.type==='himnos'?'hymns':'songs'}"]`);opener?.click();setTimeout(()=>{const item=document.querySelector(`#songList [data-song="${s.id}"]`);if(item)item.click()},60)}
function clickedId(el){return Number(el?.dataset?.song||el?.dataset?.searchSong||el?.dataset?.eventSong||0)}
function currentOpenSong(){const detail=document.getElementById('detail'),title=document.getElementById('songTitle')?.textContent?.trim();return detail&&!detail.classList.contains('hidden')&&title?songs().find(s=>s.title===title)||null:null}
function refreshSeoLanguage(){const s=currentOpenSong();s?setSongSeo(s):setHomeSeo()}
function wireClicks(){document.addEventListener('click',e=>{const target=e.target.closest('[data-song],[data-search-song],[data-event-song]');const id=clickedId(target);if(id){setTimeout(()=>{const s=byId(id);const detail=document.getElementById('detail');if(s&&detail&&!detail.classList.contains('hidden')){routeUrl(s);setSongSeo(s)}},20);return}if(e.target.closest('#songBackBtn,[data-home],nav button'))setTimeout(()=>{const detail=document.getElementById('detail');if(!detail||detail.classList.contains('hidden')){clearRoute();setHomeSeo()}},30)},true)}
function directRoute(){const raw=new URLSearchParams(location.search).get('song');if(!raw){setHomeSeo();return}const s=byId(raw);if(!s){clearRoute();setHomeSeo();return}setSongSeo(s);setTimeout(()=>openThroughApp(s),100)}
function init(){document.getElementById('seoRepertoireDirectory')?.remove();document.getElementById('seoRouteStyles')?.remove();wireClicks();directRoute();new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))refreshSeoLanguage()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});window.addEventListener('popstate',()=>location.reload())}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();