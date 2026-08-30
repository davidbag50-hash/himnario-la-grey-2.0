(()=>{
'use strict';
const $=id=>document.getElementById(id);
const isLight=()=>document.documentElement.dataset.theme==='light';
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
 const light=isLight(),rects=[...svg.querySelectorAll('rect')];
 rects.forEach((r,i)=>{if(i===0)r.setAttribute('fill',light?'#fbfdff':'#061523')});
 svg.querySelectorAll('line').forEach(l=>{l.setAttribute('stroke',light?'#477899':'#6cc5ff');l.setAttribute('stroke-opacity',light?'.72':'.72')});
 svg.querySelectorAll('text').forEach(t=>{const txt=(t.textContent||'').trim();t.setAttribute('fill',/^[1-6]$|fr|cuerda|string/.test(txt)?(light?'#647b8e':'#8da9bf'):(light?'#173a5d':'#dff4ff'))});
 svg.querySelectorAll('circle').forEach(c=>{
   const fill=c.getAttribute('fill');
   if(fill==='none'){c.setAttribute('stroke',light?'#d8a52d':'#f4bd3d');c.setAttribute('stroke-width','2.5')}
   else {c.setAttribute('fill',light?'#0d72d8':'#178ff1');c.setAttribute('stroke',light?'#d8edf9':'#8ed3ff');c.setAttribute('stroke-width','1')}
 });
}
function stylePiano(){
 const svg=$('pianoSvg'); if(!svg)return;
 const light=isLight(),rects=[...svg.querySelectorAll('rect')];
 rects.forEach((r,i)=>{
   const fill=(r.getAttribute('fill')||'').toLowerCase();
   if(i===0){r.setAttribute('fill',light?'#fbfdff':'#061523');return}
   if(fill==='white'||fill==='#eaf4fb')r.setAttribute('fill',light?'#ffffff':'#eaf4fb');
   else if(fill==='#9ec9e5'||fill==='#57bfff')r.setAttribute('fill',light?'#b9ddf5':'#57bfff');
   else if(fill==='#20252a'||fill==='#07101a')r.setAttribute('fill',light?'#173a5d':'#07101a');
   else if(fill==='#2f7faa'||fill==='#f0b83a')r.setAttribute('fill',light?'#d8a52d':'#f0b83a');
   r.setAttribute('stroke',light?'#9bb0c0':'#284d68');
 });
 svg.querySelectorAll('text').forEach(t=>t.setAttribute('fill',light?'#5f7489':'#9db6c9'));
}
function syncNeedle(){
 const n=$('meterNeedle'); if(!n)return;
 const left=parseFloat(n.style.left||'50');
 const clamped=Math.max(10,Math.min(90,isFinite(left)?left:50));
 const angle=(clamped-50)*1.7;
 n.style.setProperty('--needle-angle',`${angle}deg`);
}
function restyleTheme(){styleGuitar();stylePiano()}
function observe(){
 const dg=$('diagramSvg'),pn=$('pianoSvg'),needle=$('meterNeedle');
 if(dg){new MutationObserver(styleGuitar).observe(dg,{childList:true,subtree:true});styleGuitar()}
 if(pn){new MutationObserver(stylePiano).observe(pn,{childList:true,subtree:true});stylePiano()}
 if(needle){new MutationObserver(syncNeedle).observe(needle,{attributes:true,attributeFilter:['style']});syncNeedle()}
 new MutationObserver(restyleTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
}
function init(){injectBrand();observe()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();