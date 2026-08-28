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