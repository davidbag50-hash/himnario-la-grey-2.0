(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const home=$('#home'); if(!home)return;
const originals={};
['songs','hymns','voice','chords','tuner','calendar','favorites'].forEach(k=>originals[k]=home.querySelector(`.home-grid [data-open="${k}"]`));
const profile=$('#profileBtn'), notation=$('#notationBtn'), settings=$('#settingsBtn'), sourceSearch=$('#q');
const oldNav=[...document.querySelectorAll('nav button')];
const navFor=k=>document.querySelector(`nav [data-nav="${k}"]`)||oldNav.find(b=>(b.dataset.nav||'')===k||((b.textContent||'').toLowerCase().includes(k==='home'?'inicio':k==='songs'?'cantos':k==='chords'?'acordes':k==='calendar'?'calendario':'afinador')));
const i={
 person:`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="6" fill="#0d72d8"/><path d="M5 29c1.1-7.2 4.9-11 11-11s9.9 3.8 11 11" fill="#0d72d8"/></svg>`,
 note:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 5v17.2a5 5 0 1 1-3-4.6V8.4l12-2.6v13.4a5 5 0 1 1-3-4.6V4z" fill="#0d72d8"/></svg>`,
 gear:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M13.1 2h5.8l.9 4a11.5 11.5 0 0 1 2.2.9l3.5-2.1 4.1 4.1-2.2 3.5c.4.7.7 1.4.9 2.2l4 .9v5.8l-4 .9c-.2.8-.5 1.5-.9 2.2l2.2 3.5-4.1 4.1-3.5-2.1c-.7.4-1.4.7-2.2.9l-.9 4h-5.8l-.9-4c-.8-.2-1.5-.5-2.2-.9L6.5 32l-4.1-4.1 2.2-3.5c-.4-.7-.7-1.4-.9-2.2l-4-.9v-5.8l4-.9c.2-.8.5-1.5.9-2.2L2.4 8.9l4.1-4.1L10 6.9c.7-.4 1.4-.7 2.2-.9z" fill="#123b67" transform="scale(.9) translate(1.8 0)"/><circle cx="16" cy="16" r="5.5" fill="#fff"/></svg>`,
 search:`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="13.5" cy="13.5" r="9" fill="none" stroke="#0d72d8" stroke-width="2.8"/><path d="M20.2 20.2L29 29" stroke="#0d72d8" stroke-width="2.8" stroke-linecap="round"/></svg>`,
 brand:`<svg viewBox="0 0 130 165" aria-hidden="true"><defs><radialGradient id="rg"><stop stop-color="#e7c85b" stop-opacity=".34"/><stop offset="1" stop-color="#e7c85b" stop-opacity="0"/></radialGradient></defs><circle cx="63" cy="88" r="58" fill="url(#rg)"/><path d="M62 45C35 28 16 53 19 78c4 35 43 60 43 60s39-25 43-60c3-25-16-50-43-33z" fill="none" stroke="#d7a42a" stroke-width="4"/><path d="M61 29c-16 25-18 50-6 69 13 20 2 41-14 35-12-5-10-20 3-23 14-3 31 4 36 20 4 12-3 25-13 27" fill="none" stroke="#083873" stroke-width="7" stroke-linecap="round"/><circle cx="58" cy="87" r="14" fill="none" stroke="#083873" stroke-width="5"/><path d="M62 39v111" stroke="#083873" stroke-width="5" stroke-linecap="round"/></svg>`,
 staff:`<svg viewBox="0 0 300 90" aria-hidden="true"><g fill="none" stroke="#7fb8ea" stroke-width="1.2"><path d="M0 42c75 12 150 12 300 0"/><path d="M0 49c75 12 150 12 300 0"/><path d="M0 56c75 12 150 12 300 0"/><path d="M0 63c75 12 150 12 300 0"/><path d="M0 70c75 12 150 12 300 0"/></g><g fill="#7fb8ea"><path d="M185 30h3v29a6 6 0 1 1-3-5z"/><path d="M230 15h3v34a6 6 0 1 1-3-5z"/><path d="M273 25h3v31a6 6 0 1 1-3-5z"/></g></svg>`,
 songs:`<svg viewBox="0 0 160 150" aria-hidden="true"><path d="M19 58c26-12 47-8 61 3v58c-18-8-39-9-61 1z" fill="#fff" stroke="#123f78" stroke-width="4"/><path d="M141 58c-26-12-47-8-61 3v58c18-8 39-9 61 1z" fill="#fff" stroke="#123f78" stroke-width="4"/><path d="M80 61v58" stroke="#d6a42d" stroke-width="4"/><path d="M45 73h23M45 82h23M45 91h23M92 73h23M92 82h23M92 91h23" stroke="#dce9f5" stroke-width="2"/><path d="M36 75v-17h3v14a6 6 0 1 1-3 3" fill="#0d72d8"/><path d="M118 45v-20h3v17a6 6 0 1 1-3 3" fill="#0d72d8"/><path d="M132 38v-15h3v12a5 5 0 1 1-3 3" fill="#0d72d8"/><path d="M71 119h18l-4 24-5-5-5 5z" fill="#d6a42d"/><path d="M62 34l-3-9M73 31V19M84 34l4-9" stroke="#e1b442" stroke-width="2.5" stroke-linecap="round"/></svg>`,
 hymns:`<svg viewBox="0 0 160 150" aria-hidden="true"><path d="M45 25h66c10 0 17 7 17 17v82H48c-10 0-18-8-18-18V43c0-10 6-18 15-18z" fill="#0d3e78"/><path d="M51 31h61c7 0 10 4 10 11v74H51c-7 0-12-6-12-12V44c0-7 5-13 12-13z" fill="#154f8f"/><path d="M80 49v43M61 70h38" stroke="#dfb23c" stroke-width="7" stroke-linecap="round"/><path d="M48 124h64l-7 18H55z" fill="#d8a52d"/><g fill="none" stroke="#79afe2" stroke-width="2.5" stroke-linecap="round"><path d="M29 82c-11 8-15 22-9 36"/><path d="M25 93l-10-8M23 104l-12-2M26 114l-8 8"/><path d="M130 82c11 8 15 22 9 36"/><path d="M134 93l10-8M136 104l12-2M133 114l8 8"/></g></svg>`,
 voice:`<svg viewBox="0 0 160 150" aria-hidden="true"><circle cx="84" cy="62" r="43" fill="#eaf5ff"/><g transform="rotate(35 82 74)"><rect x="68" y="27" width="30" height="56" rx="15" fill="#194f8f"/><rect x="73" y="31" width="20" height="37" rx="10" fill="#2b6eae"/><path d="M73 41h20M73 49h20M73 57h20" stroke="#8cc4ef" stroke-width="2"/><rect x="77" y="77" width="12" height="45" rx="6" fill="#0c3c75"/><path d="M67 121h32" stroke="#0c3c75" stroke-width="7" stroke-linecap="round"/></g><path d="M32 36v-17h3v14a6 6 0 1 1-3 3M122 47v-22h3v19a6 6 0 1 1-3 3M135 70v-14h3v11a5 5 0 1 1-3 3" fill="#0d72d8"/><path d="M106 26l6-10M115 31l11-4" stroke="#d8a52d" stroke-width="3" stroke-linecap="round"/></svg>`,
 chords:`<svg viewBox="0 0 160 150" aria-hidden="true"><path d="M25 17h29l-5 94H30z" fill="#8a5527"/><path d="M31 27h18M30 41h19M29 56h20M29 72h19M28 88h19" stroke="#d7b278" stroke-width="2"/><path d="M29 17l-5-10M49 17l6-10" stroke="#855124" stroke-width="5" stroke-linecap="round"/><rect x="65" y="48" width="63" height="58" rx="3" fill="#fff" stroke="#1a5188" stroke-width="3"/><path d="M77 48v58M90 48v58M103 48v58M116 48v58M65 61h63M65 76h63M65 91h63" stroke="#1a5188" stroke-width="2"/><circle cx="77" cy="76" r="5" fill="#0d72d8"/><circle cx="90" cy="61" r="5" fill="#0d72d8"/><circle cx="103" cy="91" r="5" fill="#0d72d8"/><g fill="none" stroke="#76ace0" stroke-width="2.5"><path d="M20 92c-9 6-11 19-5 31M134 92c9 6 11 19 5 31"/><path d="M17 100l-8-7M16 111l-9 1M137 100l8-7M138 111l9 1"/></g></svg>`,
 tuner:`<svg viewBox="0 0 160 150" aria-hidden="true"><path d="M25 103a55 55 0 0 1 110 0" fill="#fff" stroke="#0d3d76" stroke-width="5"/><path d="M36 95l-7-8M50 72l-5-12M73 61l-1-14M109 72l6-11M124 95l8-8" stroke="#0d3d76" stroke-width="3" stroke-linecap="round"/><path d="M80 103L103 48" stroke="#0d3d76" stroke-width="6" stroke-linecap="round"/><circle cx="80" cy="103" r="12" fill="#0d3d76"/><path d="M26 108h108" stroke="#0d3d76" stroke-width="5"/><path d="M75 100h10l6 31H69z" fill="#0d3d76"/><text x="80" y="125" text-anchor="middle" font-size="18" font-weight="700" fill="#fff">A</text><path d="M80 25v-12M58 30l-5-10M102 30l5-10" stroke="#d8a52d" stroke-width="2.5" stroke-linecap="round"/></svg>`,
 calendar:`<svg viewBox="0 0 160 150" aria-hidden="true"><rect x="28" y="27" width="103" height="98" rx="10" fill="#fff" stroke="#dbe7f2" stroke-width="2"/><path d="M28 48h103V34c0-4-3-7-7-7H35c-4 0-7 3-7 7z" fill="#1b64ad"/><path d="M51 18v21M108 18v21" stroke="#d8a52d" stroke-width="6" stroke-linecap="round"/><g fill="#c9e0f3"><rect x="42" y="62" width="16" height="14" rx="2"/><rect x="66" y="62" width="16" height="14" rx="2"/><rect x="90" y="62" width="16" height="14" rx="2"/><rect x="42" y="84" width="16" height="14" rx="2"/><rect x="66" y="84" width="16" height="14" rx="2"/><rect x="90" y="84" width="16" height="14" rx="2"/></g><path d="M116 75l4 8 9 1-6.5 6 1.5 9-8-4-8 4 1.5-9-6.5-6 9-1z" fill="#d8a52d"/><g fill="none" stroke="#78afe2" stroke-width="2.3"><path d="M22 95c-9 8-11 20-5 31M137 95c9 8 11 20 5 31"/></g></svg>`,
 fav:`<svg viewBox="0 0 140 120" aria-hidden="true"><path d="M70 101S24 76 24 43c0-15 11-27 26-27 10 0 17 5 20 12 4-7 11-12 21-12 15 0 25 12 25 27 0 33-46 58-46 58z" fill="none" stroke="#d6a42d" stroke-width="4" stroke-linejoin="round"/></svg>`,
 home:`<svg viewBox="0 0 32 32"><path d="M3 15L16 4l13 11v14H20v-9h-8v9H3z" fill="currentColor"/></svg>`,
 chordsNav:`<svg viewBox="0 0 32 32"><rect x="5" y="4" width="22" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M10 4v24M16 4v24M22 4v24M5 10h22M5 16h22M5 22h22" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="16" r="2.5" fill="currentColor"/><circle cx="16" cy="10" r="2.5" fill="currentColor"/><circle cx="22" cy="22" r="2.5" fill="currentColor"/></svg>`,
 calNav:`<svg viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="21" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M4 13h24M10 4v6M22 4v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M9 18h3M15 18h3M21 18h3M9 23h3M15 23h3" stroke="currentColor" stroke-width="2.3"/></svg>`,
 tunerNav:`<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 16l6-8" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="16" cy="16" r="2.2" fill="currentColor"/></svg>`
};
const shell=document.createElement('div');shell.id='lgExactHome';shell.innerHTML=`
 <section class="exact-brand" aria-label="La Grey">
   <div class="exact-rays"></div><div class="exact-cross">✝</div><div class="exact-logo-mark">${i.brand}</div><div class="exact-crown">♛</div>
   <div class="exact-kicker">GRUPO DE ALABANZA</div><div class="exact-wordmark">La Grey</div><div class="exact-staff">${i.staff}</div>
 </section>
 <div class="exact-actions">
   <button class="exact-pill" data-exact-action="profile">${i.person}<span>Perfil</span></button>
   <button class="exact-pill" data-exact-action="notation">${i.note}<span class="exact-notation-label">C D E</span></button>
   <button class="exact-pill exact-gear" data-exact-action="settings" aria-label="Ajustes">${i.gear}</button>
 </div>
 <div class="exact-divider"><span>❧</span></div>
 <div class="exact-search-wrap">${i.search}<input id="exactSearch" class="exact-search" autocomplete="off" placeholder="Buscar cantos, himnos, acordes..."></div>
 <div class="exact-card-grid">
   ${card('songs','Cantos','Cantemos al Señor<br>un cántico nuevo',i.songs)}
   ${card('hymns','Himnos','Alabanzas que<br>edifican el alma',i.hymns)}
   ${card('voice','Voz','Ejercita y eleva<br>tu voz al Señor',i.voice)}
   ${card('chords','Acordes','Acompaña con<br>excelencia',i.chords)}
   ${card('tuner','Afinador','Afina tu instrumento<br>con precisión',i.tuner)}
   ${card('calendar','Calendario','Eventos y ensayos<br>del ministerio',i.calendar)}
 </div>
 <button class="exact-favorite" data-exact-open="favorites"><span class="exact-fav-art">${i.fav}</span><span class="exact-fav-copy"><h2>Favoritos</h2><p>Tus cantos y acordes favoritos<br>siempre a la mano</p></span><span class="exact-chevron">›</span></button>
 <div class="exact-bottom" role="navigation" aria-label="Navegación principal">
   ${nav('home','Inicio',i.home,true)}${nav('songs','Cantos',i.note)}${nav('chords','Acordes',i.chordsNav)}${nav('calendar','Calendario',i.calNav)}${nav('tuner','Afinador',i.tunerNav)}
 </div>`;
function card(key,title,desc,svg){return `<button class="exact-card" data-exact-open="${key}"><span class="exact-illustration">${svg}</span><h2>${title}</h2><p>${desc}</p><span class="exact-mini"><b>♥</b></span></button>`}
function nav(key,label,svg,active=false){return `<button class="exact-nav-btn${active?' active':''}" data-exact-nav="${key}">${svg}<span>${label}</span></button>`}
home.insertBefore(shell,home.firstChild);
const exactSearch=$('#exactSearch');
function syncNotation(){const txt=(notation?.textContent||'C D E').replace(/[^A-Za-zÁÉÍÓÚáéíóú ]/g,' ').replace(/\s+/g,' ').trim();$('.exact-notation-label').textContent=/Do|Re|Mi/i.test(txt)?'Do Re Mi':'C D E'}
function updateScreen(){const visible=!home.classList.contains('hidden');document.body.classList.toggle('exact-home-screen',visible);if(visible){$$('#home>.stage-hero,#home>#profileWelcome,#home>#lg35HomeLabel,#home>[class*="verse"],#home>[id*="verse"],#home>[class*="welcome"]').forEach(e=>e.style.setProperty('display','none','important'));syncNotation()}}
new MutationObserver(updateScreen).observe(home,{attributes:true,attributeFilter:['class'],childList:true,subtree:false});
updateScreen();
shell.addEventListener('click',e=>{
 const a=e.target.closest('[data-exact-action]');if(a){({profile,notation,settings}[a.dataset.exactAction])?.click();setTimeout(syncNotation,30);return}
 const o=e.target.closest('[data-exact-open]');if(o){originals[o.dataset.exactOpen]?.click();return}
 const n=e.target.closest('[data-exact-nav]');if(n){const k=n.dataset.exactNav;if(k==='home'){navFor('home')?.click();window.scrollTo(0,0)}else if(originals[k])originals[k].click();else navFor(k)?.click();return}
});
if(exactSearch&&sourceSearch){exactSearch.addEventListener('input',()=>{sourceSearch.value=exactSearch.value;sourceSearch.dispatchEvent(new Event('input',{bubbles:true}))});sourceSearch.addEventListener('input',()=>{if(document.activeElement!==exactSearch)exactSearch.value=sourceSearch.value})}
document.addEventListener('click',e=>{if(e.target.closest('#notationBtn'))setTimeout(syncNotation,35)},true);
setTimeout(updateScreen,80);setTimeout(updateScreen,500);
})();
