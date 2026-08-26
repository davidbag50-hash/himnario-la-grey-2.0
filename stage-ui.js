(()=>{
'use strict';
const $=id=>document.getElementById(id);
function injectBrand(){
 document.body.classList.add('stage-ui');
 const headerLeft=document.querySelector('.header-row>div:first-child');
 if(headerLeft&&!headerLeft.classList.contains('stage-brand')){
   const eyebrow=headerLeft.querySelector('.eyebrow')?.outerHTML||'';
   const title=headerLeft.querySelector('.title')?.outerHTML||'';
   headerLeft.className='stage-brand';
   headerLeft.innerHTML=`<img class="stage-brand-logo" src="icon-192.png" alt="La Grey"><div class="stage-brand-text">${eyebrow}${title}</div>`;
 }
 const home=$('home');
 if(home&&!home.querySelector('.stage-hero')){
   const hero=document.createElement('div');
   hero.className='stage-hero';
   hero.innerHTML='<div class="stage-hero-kicker">HIMNARIO · CANCIONERO</div><h1>LA GREY</h1><p>Música y adoración en un solo lugar.</p><div class="stage-hero-line"><span>✦</span><b>Repertorio, acordes, afinación y planificación para el grupo de alabanza.</b></div>';
   const welcome=$('profileWelcome');
   home.insertBefore(hero,welcome||home.firstChild);
 }
}
function styleGuitar(){
 const svg=$('diagramSvg'); if(!svg)return;
 const rects=[...svg.querySelectorAll('rect')];
 rects.forEach((r,i)=>{if(i===0)r.setAttribute('fill','#061523')});
 svg.querySelectorAll('line').forEach(l=>{l.setAttribute('stroke','#6cc5ff');l.setAttribute('stroke-opacity','.72')});
 svg.querySelectorAll('text').forEach(t=>{const txt=(t.textContent||'').trim();t.setAttribute('fill',/^[1-6]$|fr|cuerda/.test(txt)?'#8da9bf':'#dff4ff')});
 svg.querySelectorAll('circle').forEach(c=>{
   const fill=c.getAttribute('fill');
   if(fill==='none'){c.setAttribute('stroke','#f4bd3d');c.setAttribute('stroke-width','2.5')}
   else {c.setAttribute('fill','#178ff1');c.setAttribute('stroke','#8ed3ff');c.setAttribute('stroke-width','1')}
 });
}
function stylePiano(){
 const svg=$('pianoSvg'); if(!svg)return;
 const rects=[...svg.querySelectorAll('rect')];
 rects.forEach((r,i)=>{
   const fill=(r.getAttribute('fill')||'').toLowerCase();
   if(i===0){r.setAttribute('fill','#061523');return}
   if(fill==='white')r.setAttribute('fill','#eaf4fb');
   else if(fill==='#9ec9e5')r.setAttribute('fill','#57bfff');
   else if(fill==='#20252a')r.setAttribute('fill','#07101a');
   else if(fill==='#2f7faa')r.setAttribute('fill','#f0b83a');
   r.setAttribute('stroke','#284d68');
 });
 svg.querySelectorAll('text').forEach(t=>t.setAttribute('fill','#9db6c9'));
}
function syncNeedle(){
 const n=$('meterNeedle'); if(!n)return;
 const left=parseFloat(n.style.left||'50');
 const clamped=Math.max(10,Math.min(90,isFinite(left)?left:50));
 const angle=(clamped-50)*1.7;
 n.style.setProperty('--needle-angle',`${angle}deg`);
}
function observe(){
 const dg=$('diagramSvg'),pn=$('pianoSvg'),needle=$('meterNeedle');
 if(dg){new MutationObserver(styleGuitar).observe(dg,{childList:true,subtree:true});styleGuitar()}
 if(pn){new MutationObserver(stylePiano).observe(pn,{childList:true,subtree:true});stylePiano()}
 if(needle){new MutationObserver(syncNeedle).observe(needle,{attributes:true,attributeFilter:['style']});syncNeedle()}
}
function init(){injectBrand();observe()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
