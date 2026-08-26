(()=>{
'use strict';
if(window.LAGREY_HYMN_TOOLS_LOADED)return;
window.LAGREY_HYMN_TOOLS_LOADED=true;
const $=id=>document.getElementById(id);
const songs=window.LAGREY_SONGS||[];
const SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const LATIN={C:'Do','C#':'Do#',Db:'Reb',D:'Re',D#:'Re#',Eb:'Mib',E:'Mi',F:'Fa',F#:'Fa#',Gb:'Solb',G:'Sol',G#:'Sol#',Ab:'Lab',A:'La',A#:'La#',Bb:'Sib',B:'Si'};
const KEY='lagrey_hymn_default_shifts';
let activeId=null,currentShift=0,guard=false,timer=0;
function defaults(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function saveDefaults(o){localStorage.setItem(KEY,JSON.stringify(o))}
function songById(id){return songs.find(s=>Number(s.id)===Number(id))||null}
function activeSong(){const title=$('songTitle')?.textContent?.trim();return songs.find(s=>s.type==='himnos'&&s.title===title)||null}
function noteParts(symbol){const m=String(symbol||'').match(/^([A-G](?:#|b)?)([^/]*?)(?:\/([A-G](?:#|b)?))?$/);return m?{root:m[1],quality:m[2]||'',bass:m[3]||null}:null}
function idx(n){const sharp={Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#'}[n]||n;return SHARP.indexOf(sharp)}
function preferFlat(s){const p=noteParts(s);return !!(p&&(p.root.includes('b')||p.bass?.includes('b')))}
function transpose(symbol,steps,flatHint=false){const p=noteParts(symbol);if(!p)return symbol;const arr=(flatHint||preferFlat(symbol))?FLAT:SHARP;const r=(idx(p.root)+steps%12+12)%12;let out=arr[r]+p.quality;if(p.bass){const b=(idx(p.bass)+steps%12+12)%12;out+='/'+arr[b]}return out}
function notation(){return localStorage.getItem('lagrey_notation')||'american'}
function display(symbol){if(notation()!=='latin')return symbol;const p=noteParts(symbol);if(!p)return symbol;return (LATIN[p.root]||p.root)+p.quality+(p.bass?'/'+(LATIN[p.bass]||p.bass):'')}
function shiftTone(song,steps){return transpose(song.tone,steps,preferFlat(song.tone))}
function ensureStyle(){if($('hymnToolsStyle'))return;const s=document.createElement('style');s.id='hymnToolsStyle';s.textContent=`
.hymn-transpose{margin-top:14px;padding:12px;border:1px solid rgba(100,181,246,.18);border-radius:16px;background:rgba(4,20,35,.54)}
.hymn-transpose-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}.hymn-transpose-head b{color:#79d1ff}.hymn-transpose-head span{font-size:12px;color:#a9bdcf}
.hymn-transpose-controls{display:flex;gap:8px;flex-wrap:wrap}.hymn-transpose-controls .btn{margin:0}.hymn-shift-btn{min-width:58px;font-weight:900}.hymn-save{color:#ffd76a}.hymn-transpose-status{margin-top:8px;font-size:11px;color:#9fb3c6}
@media(max-width:620px){.hymn-transpose-controls{display:grid;grid-template-columns:1fr 1fr}.hymn-transpose-controls .btn{width:100%}.hymn-save{grid-column:1/-1}}
`;document.head.appendChild(s)}
function ensureControls(song){const head=document.querySelector('#detail .head');if(!head)return;let box=$('hymnTranspose');if(!song){box?.remove();return}if(!box){box=document.createElement('div');box.id='hymnTranspose';box.className='hymn-transpose';box.innerHTML=`<div class="hymn-transpose-head"><b>🎼 Ajustar tono</b><span id="hymnCurrentTone"></span></div><div class="hymn-transpose-controls"><button id="hymnDown" class="btn hymn-shift-btn" type="button">−½</button><button id="hymnUp" class="btn hymn-shift-btn" type="button">+½</button><button id="hymnReset" class="btn" type="button">↺ Restablecer</button><button id="hymnSave" class="btn hymn-save" type="button">★ Guardar tono predeterminado</button></div><div id="hymnTransposeStatus" class="hymn-transpose-status"></div>`;const actions=head.querySelector('.actions');actions?head.insertBefore(box,actions):head.appendChild(box);$('hymnDown').onclick=()=>change(-1);$('hymnUp').onclick=()=>change(1);$('hymnReset').onclick=reset;$('hymnSave').onclick=saveDefault}}
function markOriginals(){document.querySelectorAll('#chart [data-chord]').forEach(b=>{if(!b.dataset.hymnOriginal)b.dataset.hymnOriginal=b.dataset.chord})}
function applyToChart(song){if(!song||guard)return;guard=true;try{markOriginals();const flat=preferFlat(song.tone);document.querySelectorAll('#chart [data-chord]').forEach(b=>{const original=b.dataset.hymnOriginal||b.dataset.chord;const next=transpose(original,currentShift,flat||preferFlat(original));b.dataset.chord=next;b.textContent=display(next)});const t=shiftTone(song,currentShift);if($('songTone'))$('songTone').textContent=display(t);if($('hymnCurrentTone'))$('hymnCurrentTone').textContent='Tono: '+display(t);const saved=Number(defaults()[song.id]||0);if($('hymnTransposeStatus'))$('hymnTransposeStatus').textContent=currentShift===saved?'Usando el tono predeterminado guardado.':'Cambio temporal · toca Guardar para conservarlo como predeterminado.'}finally{setTimeout(()=>guard=false,0)}}
function refreshListingTones(){const d=defaults();document.querySelectorAll('[data-song],[data-search-song]').forEach(b=>{const id=Number(b.dataset.song||b.dataset.searchSong);const s=songById(id);if(!s||s.type!=='himnos')return;const shift=Number(d[s.id]||0);const tone=b.querySelector('.tone');if(tone)tone.textContent=display(shiftTone(s,shift))})}
function sync(){if(guard)return;const detail=$('detail');if(!detail||detail.classList.contains('hidden')){activeId=null;return}const song=activeSong();ensureControls(song);if(!song)return;if(activeId!==song.id){activeId=song.id;currentShift=Number(defaults()[song.id]||0)}applyToChart(song);refreshListingTones()}
function change(n){const s=activeSong();if(!s)return;currentShift+=n;applyToChart(s)}
function reset(){const s=activeSong();if(!s)return;currentShift=Number(defaults()[s.id]||0);applyToChart(s)}
function saveDefault(){const s=activeSong();if(!s)return;const d=defaults();d[s.id]=currentShift;saveDefaults(d);applyToChart(s);refreshListingTones();const status=$('hymnTransposeStatus');if(status)status.textContent='✓ Este tono quedó guardado como predeterminado para este himno.'}
function updateCount(){const e=$('countHymns');if(e)e.textContent=songs.filter(s=>s.type==='himnos').length+' himnos'}
function schedule(){clearTimeout(timer);timer=setTimeout(()=>{sync();updateCount();refreshListingTones()},35)}
function wire(){ensureStyle();updateCount();sync();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});window.addEventListener('storage',schedule);document.addEventListener('click',e=>{if(e.target.closest('#notationBtn'))setTimeout(schedule,50)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();