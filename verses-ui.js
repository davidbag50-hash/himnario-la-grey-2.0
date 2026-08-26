(()=>{
'use strict';
const verses=window.LAGREY_VERSES||[];
const $=id=>document.getElementById(id);
let currentIndex=0;
function localDayNumber(){const d=new Date(),start=new Date(d.getFullYear(),0,0);return Math.floor((d-start)/86400000)}
function dailyIndex(){if(!verses.length)return 0;const d=new Date();const seed=d.getFullYear()*367+localDayNumber();return Math.abs(seed)%verses.length}
function fmtDate(){return new Intl.DateTimeFormat('es-PA',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}
function escapeHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function inject(){
 const grid=document.querySelector('#home .home-grid');
 if(grid&&!document.querySelector('[data-open="verse"]')){
  const b=document.createElement('button');b.className='card verse-home-card';b.dataset.open='verse';b.innerHTML='<div class="icon">📖</div><h2>Versículo del día</h2><div class="muted">Una palabra para hoy</div><div id="dailyVerseHome" class="count"></div>';grid.appendChild(b);
 }
 const main=document.querySelector('main');
 if(main&&!$('verseView')){
  const s=document.createElement('section');s.id='verseView';s.className='view hidden';s.innerHTML=`<button class="back" id="verseBack">← Volver</button><div class="verse-shell"><div class="verse-kicker">VERSÍCULO DEL DÍA</div><div id="verseDate" class="verse-date"></div><blockquote id="verseText" class="verse-text"></blockquote><div id="verseRef" class="verse-ref"></div><div class="verse-actions"><button id="verseShare" class="btn primary" type="button">↗ Compartir</button><button id="verseAnother" class="btn" type="button">Otro versículo</button><button id="verseToday" class="btn" type="button">Hoy</button></div><div class="verse-mini">El versículo diario cambia automáticamente cada día y queda disponible aun sin conexión.</div></div>`;main.appendChild(s);
 }
}
function render(i){if(!verses.length)return;currentIndex=(i+verses.length)%verses.length;const v=verses[currentIndex];$('verseText').textContent='“'+v.text+'”';$('verseRef').textContent=v.ref;$('verseDate').textContent=fmtDate();const home=$('dailyVerseHome');if(home)home.textContent=v.ref}
function show(){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('verseView')?.classList.remove('hidden');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));window.scrollTo(0,0);render(dailyIndex())}
function back(){document.querySelector('nav button[data-nav="home"]')?.click()}
async function share(){const v=verses[currentIndex];if(!v)return;const text=`${v.text}\n— ${v.ref}\n\nHimnario-Cancionero La Grey`;try{if(navigator.share)await navigator.share({title:'Versículo del día',text});else if(navigator.clipboard){await navigator.clipboard.writeText(text);toast('Versículo copiado al portapapeles.')}}catch(e){if(e?.name!=='AbortError')toast('No se pudo compartir el versículo.')}}
function toast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.add('hidden'),2200)}
function wire(){inject();render(dailyIndex());document.querySelector('[data-open="verse"]')?.addEventListener('click',show);$('verseBack')?.addEventListener('click',back);$('verseToday')?.addEventListener('click',()=>render(dailyIndex()));$('verseAnother')?.addEventListener('click',()=>{let n=currentIndex;while(verses.length>1&&n===currentIndex)n=Math.floor(Math.random()*verses.length);render(n)});$('verseShare')?.addEventListener('click',share)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
