(()=>{
'use strict';
const nav=document.querySelector('body>nav');if(!nav)return;
const icons={
 home:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 15L16 4l13 11v14H20v-9h-8v9H3z" fill="currentColor"/></svg>`,
 songs:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19 5v17.5a5 5 0 1 1-3-4.6V8.5l11-2.6v13.5a5 5 0 1 1-3-4.6V4.2z" fill="currentColor"/></svg>`,
 chords:`<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="4" width="22" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M10 4v24M16 4v24M22 4v24M5 10h22M5 16h22M5 22h22" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="16" r="2.4" fill="currentColor"/><circle cx="16" cy="10" r="2.4" fill="currentColor"/><circle cx="22" cy="22" r="2.4" fill="currentColor"/></svg>`,
 calendar:`<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M4 12h24M10 3v6M22 3v6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><path d="M9 17h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3zM9 22h3v3H9zm6 0h3v3h-3z" fill="currentColor"/></svg>`,
 tuner:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 23a11 11 0 0 1 22 0" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16 23l5-11" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><circle cx="16" cy="23" r="2.5" fill="currentColor"/><path d="M7 25h18" stroke="currentColor" stroke-width="2.4"/></svg>`
};
const labels={home:'Inicio',songs:'Cantos',chords:'Acordes',calendar:'Calendario',tuner:'Afinador'};
function refresh(){nav.querySelectorAll('button[data-nav]').forEach(b=>{const k=b.dataset.nav;if(!icons[k])return;const span=b.querySelector('span');const text=span?.textContent?.trim()||labels[k];b.innerHTML=icons[k]+`<span>${text}</span>`})}
refresh();
new MutationObserver(()=>{if(!nav.dataset.lgFixing){nav.dataset.lgFixing='1';refresh();requestAnimationFrame(()=>delete nav.dataset.lgFixing)}}).observe(nav,{childList:true,subtree:true});
})();

(()=>{
'use strict';
const svg={
 songs:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 9c6-3 11-2 14 1v15c-4-2-9-2-14 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M26 9c-6-3-11-2-14 1v15c4-2 9-2 14 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10v15" stroke="#d8a52d" stroke-width="2"/></svg>',
 hymns:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="4" width="18" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M16 9v10M11 14h10" stroke="#d8a52d" stroke-width="2.4" stroke-linecap="round"/></svg>',
 chords:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4h5l-1 24H8z" fill="#9b652f"/><rect x="14" y="8" width="13" height="15" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 8v15M22 8v15M14 13h13M14 18h13" stroke="currentColor" stroke-width="1.3"/><circle cx="18" cy="18" r="1.8" fill="#0d72d8"/><circle cx="22" cy="13" r="1.8" fill="#0d72d8"/></svg>',
 tuner:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 22a10 10 0 0 1 20 0" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M16 22l5-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="22" r="2.5" fill="currentColor"/><path d="M7 25h18" stroke="#d8a52d" stroke-width="2"/></svg>',
 calendar:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="22" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M5 12h22M10 4v6M22 4v6" stroke="currentColor" stroke-width="2.2"/><path d="M20 16l1.5 3 3.5.4-2.6 2.4.7 3.4-3.1-1.6-3.1 1.6.7-3.4-2.6-2.4 3.5-.4z" fill="#d8a52d"/></svg>',
 settings:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
 voice:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="11" y="4" width="10" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M8 16a8 8 0 0 0 16 0M16 24v5M11 29h10" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>'
};
function cleanText(h){if(!h)return'';const clone=h.cloneNode(true);clone.querySelectorAll('.lg-section-icon').forEach(n=>n.remove());return clone.textContent.replace(/[🎵🎼🎤🎸🎹📅⚙️⭐✨]/g,'').trim()}
function decorate(h,type){if(!h||h.querySelector('.lg-section-icon'))return;const text=cleanText(h);h.textContent='';const icon=document.createElement('span');icon.className='lg-section-icon';icon.innerHTML=svg[type]||svg.songs;const label=document.createElement('span');label.textContent=text;h.append(icon,label)}
function apply(){const list=document.querySelector('#listing>h1');if(list){const t=cleanText(list).toLowerCase();decorate(list,t.includes('himno')?'hymns':t.includes('favor')?'songs':'songs')}decorate(document.querySelector('#chordsView .section-title-row h1'),'chords');decorate(document.querySelector('#tunerView .head h1'),'tuner');decorate(document.querySelector('#calendarView .calendar-head h1'),'calendar');decorate(document.querySelector('#settingsView .settings-title h1'),'settings');decorate(document.querySelector('#voiceView h1'),'voice')}
apply();document.addEventListener('click',()=>setTimeout(apply,50),true);
})();