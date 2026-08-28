(()=>{
'use strict';
const $=s=>document.querySelector(s);
const icons={
 songs:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M25 22h48v45H25z" fill="#fff" stroke="#1e5b9b" stroke-width="3" rx="3"/><path d="M48 22v45" stroke="#d6a733" stroke-width="3"/><path d="M31 30c7 2 11 6 17 10-7 3-12 7-17 12m34-22c-7 2-11 6-17 10 7 3 12 7 17 12" fill="none" stroke="#85bdf0" stroke-width="2"/><path d="M25 67c8-5 15-6 23-1 8-5 15-4 25 1" fill="none" stroke="#1e5b9b" stroke-width="3"/><path d="M46 23h4v49h-4z" fill="#d8a52d"/></svg>`,
 hymns:`<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="28" y="18" width="40" height="58" rx="6" fill="#184a85"/><rect x="33" y="23" width="30" height="48" rx="3" fill="#0f3d75"/><path d="M48 31v30M38 46h20" stroke="#d9aa33" stroke-width="5" stroke-linecap="round"/><path d="M34 76h28l-4 7H38z" fill="#d8a52d"/></svg>`,
 voice:`<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="51" cy="37" r="18" fill="#1e5b9b"/><rect x="44" y="49" width="14" height="27" rx="7" transform="rotate(35 51 62)" fill="#0f3d75"/><path d="M35 52l-9 13M68 20l8-8M74 33h11" stroke="#d8a52d" stroke-width="3" stroke-linecap="round"/><circle cx="45" cy="31" r="1.8" fill="#fff"/><circle cx="52" cy="28" r="1.8" fill="#fff"/><circle cx="58" cy="33" r="1.8" fill="#fff"/></svg>`,
 chords:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M24 22h14v54H24z" fill="#9a5a22"/><path d="M20 30h22M20 43h22M20 56h22" stroke="#f0c56b" stroke-width="2"/><rect x="48" y="28" width="34" height="40" rx="4" fill="#fff" stroke="#1e5b9b" stroke-width="3"/><path d="M56 28v40M65 28v40M74 28v40M48 38h34M48 48h34M48 58h34" stroke="#1e5b9b" stroke-width="2"/><circle cx="56" cy="48" r="4" fill="#176fd0"/><circle cx="65" cy="38" r="4" fill="#176fd0"/><circle cx="74" cy="58" r="4" fill="#176fd0"/></svg>`,
 tuner:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 63a30 30 0 0 1 60 0" fill="#fff" stroke="#1e5b9b" stroke-width="4"/><path d="M48 63L63 34" stroke="#0f3d75" stroke-width="4" stroke-linecap="round"/><circle cx="48" cy="63" r="7" fill="#0f3d75"/><path d="M27 58l-4-4m12-7-2-6m23 6 2-6m11 17 4-4" stroke="#d8a52d" stroke-width="3" stroke-linecap="round"/><path d="M24 69h48" stroke="#1e5b9b" stroke-width="4"/></svg>`,
 calendar:`<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="22" y="24" width="52" height="48" rx="7" fill="#fff" stroke="#1e5b9b" stroke-width="3"/><path d="M22 36h52" stroke="#176fd0" stroke-width="7"/><path d="M33 18v12M63 18v12" stroke="#d8a52d" stroke-width="4" stroke-linecap="round"/><g fill="#bad7ef"><rect x="31" y="44" width="8" height="8" rx="2"/><rect x="44" y="44" width="8" height="8" rx="2"/><rect x="57" y="44" width="8" height="8" rx="2"/><rect x="31" y="57" width="8" height="8" rx="2"/><rect x="44" y="57" width="8" height="8" rx="2"/></g><path d="M61 55l2.3 4.6 5.1.7-3.7 3.6.9 5.1-4.6-2.4-4.5 2.4.9-5.1-3.7-3.6 5.1-.7z" fill="#d8a52d"/></svg>`,
 favorites:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M48 72S22 57 22 37c0-9 7-16 16-16 6 0 10 3 10 7 0-4 5-7 11-7 9 0 15 7 15 16 0 20-26 35-26 35z" fill="none" stroke="#d8a52d" stroke-width="4"/></svg>`
};
function clean(){
 document.body.classList.add('lg-selected-home');
 document.querySelectorAll('#home .stage-hero,#lg35HomeLabel,#home .daily-verse-card,#home [class*="verse"],#home [id*="verse"]').forEach(e=>e.remove());
 const welcome=$('#profileWelcome');if(welcome)welcome.classList.add('hidden');
 document.querySelectorAll('.home-grid .card[data-open]').forEach(card=>{const icon=card.querySelector('.icon');const key=card.dataset.open;if(icon&&icons[key])icon.innerHTML=icons[key]});
}
function init(){clean();setTimeout(clean,60);setTimeout(clean,350)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
