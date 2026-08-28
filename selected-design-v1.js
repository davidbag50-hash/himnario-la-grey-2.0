(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function sanitizeHome(){
 const home=$('#home');if(!home)return;
 const allowed=new Set(['profileWelcome','results']);
 [...home.children].forEach(el=>{
  const keep=allowed.has(el.id)||el.classList.contains('search')||el.classList.contains('home-grid');
  if(!keep)el.remove();
 });
 const welcome=$('#profileWelcome');if(welcome)welcome.classList.add('hidden');
 $('#lg35HomeLabel')?.remove();
 $$('.stage-hero,.verse-card,.daily-verse,.verse-of-day,.home-verse,.lg-verse').forEach(x=>x.remove());
 const grid=$('#home .home-grid');
 if(grid){
  const wanted=['songs','hymns','voice','chords','tuner','calendar','favorites'];
  const cards=new Map([...grid.querySelectorAll('[data-open]')].map(x=>[x.dataset.open,x]));
  wanted.forEach(k=>{const c=cards.get(k);if(c)grid.appendChild(c)});
 }
}
function normalizeHeader(){
 const row=$('header .header-row');if(!row)return;
 let brand=row.firstElementChild;
 if(!brand)return;
 brand.className='selected-brand';
 brand.innerHTML='<div class="selected-brand-kicker">GRUPO DE ALABANZA</div><div class="selected-brand-main"><span class="selected-brand-note">♪</span><img src="icon-192.png" alt="La Grey" class="selected-brand-logo"><span class="selected-brand-title">La Grey</span><span class="selected-brand-cross">✝</span></div><div class="selected-brand-crown">♛</div>';
 row.classList.add('selected-header-row');
}
function decorateCards(){
 const map={songs:['🎵','Cantos','Repertorio de cantos'],hymns:['🎼','Himnos','Repertorio de himnos'],voice:['🎤','Voz','Calentamiento y entrenamiento vocal'],chords:['🎸🎹','Acordes','Guitarra y piano'],tuner:['🎤','Afinador','Afinación por micrófono'],calendar:['📅','Calendario','Cultos, ensayos y repertorios'],favorites:['⭐','Favoritos','Acceso rápido']};
 Object.entries(map).forEach(([k,v])=>{const c=$(`[data-open="${k}"]`);if(!c)return;c.dataset.selected='1';const icon=c.querySelector('.icon');if(icon)icon.textContent=v[0];const h=c.querySelector('h2');if(h)h.textContent=v[1];const m=c.querySelector('.muted');if(m)m.textContent=v[2]});
}
function init(){sanitizeHome();normalizeHeader();decorateCards();setTimeout(()=>{sanitizeHome();decorateCards()},300);setTimeout(()=>{sanitizeHome();decorateCards()},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();