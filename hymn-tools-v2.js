(()=>{
'use strict';
const $=id=>document.getElementById(id);
const songs=()=>window.LAGREY_SONGS||[];
const SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const FLAT_TO_SHARP={Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#'};
const LATIN={C:'Do','C#':'Do#',Db:'Reb',D:'Re',D#:'Re#',Eb:'Mib',E:'Mi',F:'Fa',F#:'Fa#',Gb:'Solb',G:'Sol',G#:'Sol#',Ab:'Lab',A:'La',A#:'La#',Bb:'Sib',B:'Si'};
const KEY='lagrey_hymn_default_shifts';
let currentSong=null,currentShift=0;
function defaults(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function saveDefaults(v){localStorage.setItem(KEY,JSON.stringify(v))}
function parseChord(s){const m=String(s||'').trim().match(/^([A-G](?:#|b)?)([^/]*?)(?:\/([A-G](?:#|b)?))?$/);return m?{root:m[1],quality:m[2]||'',bass:m[3]||null}:null}
function idx(n){return SHARP.indexOf(FLAT_TO_SHARP[n]||n)}
function wantsFlat(s){const p=parseChord(s);return !!(p&&(p.root.includes('b')||p.bass?.includes('b')))}
function transpose(s,steps,flatHint=false){const p=parseChord(s);if(!p)return s;const arr=(flatHint||wantsFlat(s))?FLAT:SHARP;let out=arr[(idx(p.root)+steps+120)%12]+p.quality;if(p.bass)out+='/'+arr[(idx(p.bass)+steps+120)%12];return out}
function notation(){return localStorage.getItem('lagrey_notation')||'american'}
function display(s){if(notation()!=='latin')return s;const p=parseChord(s);if(!p)return s;return (LATIN[p.root]||p.root)+p.quality+(p.bass?'/'+(LATIN[p.bass]||p.bass):'')}
function findOpenHymn(){const title=$('songTitle')?.textContent?.trim();if(!title)return null;return songs().find(s=>s.type==='himnos'&&s.title===title)||null}
function ensureStyle(){if($('hymnToolsV2Style'))return;const st=document.createElement('style');st.id='hymnToolsV2Style';st.textContent='.hymn-transpose-v2{margin:12px 0;padding:12px;border:1px solid rgba(100,181,246,.25);border-radius:16px;background:#071a2d}.hymn-transpose-v2 .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.hymn-transpose-v2 .label{font-weight:900;color:#79d1ff;margin-right:auto}.hymn-transpose-v2 .tone-now{color:#fff;font-weight:850}.hymn-transpose-v2 .status{margin-top:8px;font-size:11px;color:#a9bdcf}.hymn-transpose-v2 .save{color:#ffd76a}@media(max-width:620px){.hymn-transpose-v2 .row{display:grid;grid-template-columns:1fr 1fr}.hymn-transpose-v2 .label,.hymn-transpose-v2 .tone-now,.hymn-transpose-v2 .save{grid-column:1/-1}.hymn-transpose-v2 .btn{width:100%;margin:0}}';document.head.appendChild(st)}
function ensureBox(){let box=$('hymnTransposeV2');if(box)return box;const head=document.querySelector('#detail .head');if(!head)return null;box=document.createElement('div');box.id='hymnTransposeV2';box.className='hymn-transpose-v2';box.innerHTML='<div class="row"><span class="label">🎼 Ajustar tono</span><span id="hymnToneNowV2" class="tone-now"></span><button id="hymnDownV2" class="btn" type="button">−½</button><button id="hymnUpV2" class="btn" type="button">+½</button><button id="hymnResetV2" class="btn" type="button">↺ Restablecer</button><button id="hymnSaveV2" class="btn save" type="button">★ Guardar tono predeterminado</button></div><div id="hymnStatusV2" class="status"></div>';const meta=head.querySelector('.meta');meta?meta.insertAdjacentElement('afterend',box):head.prepend(box);$('hymnDownV2').onclick=()=>change(-1);$('hymnUpV2').onclick=()=>change(1);$('hymnResetV2').onclick=reset;$('hymnSaveV2').onclick=saveDefault;return box}
function removeBox(){$('hymnTransposeV2')?.remove()}
function originalChord(b){if(!b.dataset.hymnV2Original)b.dataset.hymnV2Original=b.dataset.chord;return b.dataset.hymnV2Original}
function render(){if(!currentSong)return;const flat=wantsFlat(currentSong.tone);document.querySelectorAll('#chart [data-chord]').forEach(b=>{const next=transpose(originalChord(b),currentShift,flat||wantsFlat(originalChord(b)));b.dataset.chord=next;b.textContent=display(next)});const tone=transpose(currentSong.tone,currentShift,flat);if($('songTone'))$('songTone').textContent=display(tone);if($('hymnToneNowV2'))$('hymnToneNowV2').textContent='Tono: '+display(tone);const saved=Number(defaults()[currentSong.id]||0);if($('hymnStatusV2'))$('hymnStatusV2').textContent=currentShift===saved?'Usando el tono predeterminado guardado.':'Cambio temporal · guarda si este será el tono habitual.'}
function activate(){const hymn=findOpenHymn();if(!hymn){currentSong=null;removeBox();return}const changed=!currentSong||currentSong.id!==hymn.id;currentSong=hymn;if(changed)currentShift=Number(defaults()[hymn.id]||0);ensureBox();render()}
function change(n){if(!currentSong)return;currentShift+=n;render()}
function reset(){if(!currentSong)return;currentShift=Number(defaults()[currentSong.id]||0);render()}
function saveDefault(){if(!currentSong)return;const d=defaults();d[currentSong.id]=currentShift;saveDefaults(d);render();if($('hymnStatusV2'))$('hymnStatusV2').textContent='✓ Tono guardado como predeterminado para este himno.'}
function schedule(){setTimeout(activate,0);setTimeout(activate,80);setTimeout(activate,220)}
function wire(){ensureStyle();document.addEventListener('click',e=>{if(e.target.closest('[data-song],[data-search-song]'))schedule();if(e.target.closest('#notationBtn'))setTimeout(render,80)});const detail=$('detail');if(detail)new MutationObserver(()=>schedule()).observe(detail,{attributes:true,attributeFilter:['class']});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();