(()=>{
'use strict';
const $=id=>document.getElementById(id),songs=()=>window.LAGREY_SONGS||[];
const byId=id=>songs().find(s=>Number(s.id)===Number(id));
function decorate(root=document){
 root.querySelectorAll('[data-song],[data-search-song]').forEach(b=>{
  const s=byId(b.dataset.song||b.dataset.searchSong);if(!s||s.type!=='himnos'||!s.bookNumber)return;
  const title=b.querySelector('b');if(title&&!title.dataset.numbered){title.textContent=`${s.bookNumber}. ${s.title}`;title.dataset.numbered='1'}
 });
 const badge=$('songTypeBadge'),title=$('songTitle');
 if(badge?.textContent?.trim()==='Himno'&&title){const s=songs().find(x=>x.type==='himnos'&&x.title===title.textContent.trim());let n=$('hymnNumberBadge');if(s?.bookNumber){if(!n){n=document.createElement('span');n.id='hymnNumberBadge';n.className='badge';badge.insertAdjacentElement('afterend',n)}n.textContent=`N.º ${s.bookNumber}`;n.classList.remove('hidden')}else n?.classList.add('hidden')}
 else $('hymnNumberBadge')?.classList.add('hidden');
}
function numericSearch(){
 const q=$('q')?.value.trim();if(!q)return;const m=q.match(/^(?:himno\s*)?#?\s*(\d{1,3})$/i);if(!m)return;const num=Number(m[1]);const found=songs().filter(s=>s.type==='himnos'&&Number(s.bookNumber)===num);const r=$('results');if(!r)return;r.classList.toggle('hidden',!found.length);r.innerHTML=found.map(s=>`<button class="song" data-search-song="${s.id}"><span><b>${s.bookNumber}. ${s.title}</b><br><small class="muted">${s.artist}</small></span><span class="tone">${s.tone}</span></button>`).join('');r.querySelectorAll('[data-search-song]').forEach(b=>{const id=Number(b.dataset.searchSong);b.onclick=()=>{const original=document.querySelector(`[data-song="${id}"]`);if(original)original.click();else{const s=byId(id);if(!s)return;document.querySelector('[data-open="hymns"]')?.click();setTimeout(()=>document.querySelector(`[data-song="${id}"]`)?.click(),30)}}});
}
function schedule(){setTimeout(()=>{decorate();numericSearch()},0);setTimeout(()=>decorate(),80)}
function wire(){document.addEventListener('click',schedule);$('q')?.addEventListener('input',()=>setTimeout(()=>{numericSearch();decorate()},0));new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();

(()=>{
'use strict';
const BASE='https://davidbag50-hash.github.io/himnario-la-grey-2.0/';
const HOME_TITLE='La Grey — Himnario, Cantos, Acordes y Entrenamiento Vocal';
const HOME_DESC='La Grey es un himnario y cancionero cristiano con himnos, cantos, acordes para guitarra y piano, afinador, calendario y ejercicios de entrenamiento vocal.';
const songs=()=>window.LAGREY_SONGS||[];
const byId=id=>songs().find(s=>Number(s.id)===Number(id));
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function setNamed(name,value){const el=document.querySelector(`meta[name="${name}"]`);if(el)el.setAttribute('content',value)}
function setProp(name,value){const el=document.querySelector(`meta[property="${name}"]`);if(el)el.setAttribute('content',value)}
function canonical(url){const el=document.querySelector('link[rel="canonical"]');if(el)el.setAttribute('href',url)}
function songUrl(s){return BASE+'?song='+encodeURIComponent(s.id)}
function songLabel(s){return s.type==='himnos'&&s.bookNumber?`Himno ${s.bookNumber}: ${s.title}`:s.title}
function songDescription(s){const kind=s.type==='himnos'?(s.bookNumber?`Himno ${s.bookNumber}`:'Himno'):'Canto';return `${kind}: ${s.title}. Acordes, tono ${s.tone} y herramientas musicales en La Grey.`}
function structured(s,url,desc){let el=document.getElementById('songSeoJsonLd');if(!el){el=document.createElement('script');el.id='songSeoJsonLd';el.type='application/ld+json';document.head.appendChild(el)}el.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:songLabel(s)+' — La Grey',url,description:desc,inLanguage:'es',isPartOf:{'@type':'WebSite',name:'La Grey',url:BASE},about:{'@type':'MusicComposition',name:s.title}})}
function setSongSeo(s){if(!s)return;const url=songUrl(s),label=songLabel(s),desc=songDescription(s),title=`${label} — Acordes | La Grey`;document.title=title;canonical(url);setNamed('description',desc);setProp('og:title',title);setProp('og:description',desc);setProp('og:url',url);setNamed('twitter:title',title);setNamed('twitter:description',desc);structured(s,url,desc)}
function setHomeSeo(){document.title=HOME_TITLE;canonical(BASE);setNamed('description',HOME_DESC);setProp('og:title',HOME_TITLE);setProp('og:description','Himnario y cancionero cristiano con cantos, himnos, acordes, afinador y entrenamiento vocal.');setProp('og:url',BASE);setNamed('twitter:title','La Grey — Himnario y Cancionero Cristiano');setNamed('twitter:description','Cantos, himnos, acordes, afinador y entrenamiento vocal en La Grey.');document.getElementById('songSeoJsonLd')?.remove()}
function routeUrl(s,mode='push'){const url=songUrl(s);if(location.href===url)return;history[mode==='replace'?'replaceState':'pushState']({song:s.id},'',url)}
function clearRoute(){if(location.href!==BASE)history.replaceState({},'',BASE)}
function openThroughApp(s){if(!s)return;const opener=document.querySelector(`[data-open="${s.type==='himnos'?'hymns':'songs'}"]`);opener?.click();setTimeout(()=>{const item=document.querySelector(`#songList [data-song="${s.id}"]`);if(item)item.click()},60)}
function buildDirectory(){if(document.getElementById('seoRepertoireDirectory'))return;const home=document.getElementById('home');if(!home)return;const details=document.createElement('details');details.id='seoRepertoireDirectory';details.className='info-card';const cantos=songs().filter(s=>s.type==='cantos');const himnos=songs().filter(s=>s.type==='himnos').sort((a,b)=>(a.bookNumber||0)-(b.bookNumber||0));const links=a=>a.map(s=>`<a class="seo-song-link" data-seo-song="${s.id}" href="${songUrl(s)}"><span><b>${esc(s.type==='himnos'&&s.bookNumber?`${s.bookNumber}. ${s.title}`:s.title)}</b><br><small class="muted">${esc(s.artist||'La Grey')}</small></span><span class="tone">${esc(s.tone||'')}</span></a>`).join('');details.innerHTML=`<summary>📚 Índice completo de cantos e himnos</summary><p class="muted">Abre cualquier título o comparte su enlace directo.</p><h3>🎵 Cantos (${cantos.length})</h3><div class="seo-song-grid">${links(cantos)}</div><h3>🎼 Himnos (${himnos.length})</h3><div class="seo-song-grid">${links(himnos)}</div>`;home.appendChild(details);details.addEventListener('click',e=>{const a=e.target.closest('[data-seo-song]');if(!a)return;e.preventDefault();const s=byId(a.dataset.seoSong);if(!s)return;routeUrl(s);setSongSeo(s);openThroughApp(s)});if(!document.getElementById('seoRouteStyles')){const style=document.createElement('style');style.id='seoRouteStyles';style.textContent='#seoRepertoireDirectory{margin-top:16px}#seoRepertoireDirectory summary{cursor:pointer;font-weight:800}.seo-song-grid{display:grid;gap:8px;margin:8px 0 18px;max-height:55vh;overflow:auto}.seo-song-link{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid rgba(100,116,139,.22);border-radius:12px;text-decoration:none;color:inherit;background:rgba(255,255,255,.35)}.seo-song-link .tone{flex:0 0 auto}';document.head.appendChild(style)}}
function clickedId(el){return Number(el?.dataset?.song||el?.dataset?.searchSong||el?.dataset?.eventSong||0)}
function wireClicks(){document.addEventListener('click',e=>{const target=e.target.closest('[data-song],[data-search-song],[data-event-song]');const id=clickedId(target);if(id){setTimeout(()=>{const s=byId(id);const detail=document.getElementById('detail');if(s&&detail&&!detail.classList.contains('hidden')){routeUrl(s);setSongSeo(s)}},20);return}if(e.target.closest('#songBackBtn,[data-home],nav button'))setTimeout(()=>{const detail=document.getElementById('detail');if(!detail||detail.classList.contains('hidden')){clearRoute();setHomeSeo()}},30)},true)}
function directRoute(){const raw=new URLSearchParams(location.search).get('song');if(!raw)return;const s=byId(raw);if(!s){clearRoute();setHomeSeo();return}setSongSeo(s);setTimeout(()=>openThroughApp(s),100)}
function init(){buildDirectory();wireClicks();directRoute();window.addEventListener('popstate',()=>location.reload())}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
