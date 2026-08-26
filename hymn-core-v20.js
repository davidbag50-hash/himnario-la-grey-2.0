(()=>{
'use strict';
const $=id=>document.getElementById(id), songs=()=>window.LAGREY_SONGS||[];
const KEY='lagrey_hymn_default_shifts',SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'],F2S={Db:'C#',Eb:'D#',Gb:'F#',Ab:'G#',Bb:'A#'};
let song=null,shift=0,rendering=false;
function store(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
function parts(s){const m=String(s||'').trim().match(/^([A-G](?:#|b)?)([^/]*?)(?:\/([A-G](?:#|b)?))?$/);return m?{root:m[1],q:m[2]||'',bass:m[3]||null}:null}
function idx(n){return SHARP.indexOf(F2S[n]||n)}
function flat(s){const p=parts(s);return!!(p&&(p.root.includes('b')||p.bass?.includes('b')))}
function transpose(s,n,useFlat=false){const p=parts(s);if(!p)return s;const a=(useFlat||flat(s))?FLAT:SHARP;let out=a[(idx(p.root)+n+120)%12]+p.q;if(p.bass)out+='/'+a[(idx(p.bass)+n+120)%12];return out}
function notation(){return localStorage.getItem('lagrey_notation')||'american'}
const LAT={C:'Do','C#':'Do#',Db:'Reb',D:'Re','D#':'Re#',Eb:'Mib',E:'Mi',F:'Fa','F#':'Fa#',Gb:'Solb',G:'Sol','G#':'Sol#',Ab:'Lab',A:'La','A#':'La#',Bb:'Sib',B:'Si'};
function display(s){if(notation()!=='latin')return s;const p=parts(s);return p?(LAT[p.root]||p.root)+p.q+(p.bass?'/'+(LAT[p.bass]||p.bass):''):s}
function findSong(){const title=$('songTitle')?.textContent?.trim();return songs().find(s=>s.type==='himnos'&&s.title===title)||null}
function render(){if(rendering||!song)return;rendering=true;try{const useFlat=flat(song.tone);document.querySelectorAll('#chart [data-chord]').forEach(b=>{const original=b.dataset.hymnCoreOriginal||(b.dataset.hymnCoreOriginal=b.dataset.chord),next=transpose(original,shift,useFlat||flat(original));b.dataset.chord=next;b.textContent=display(next)});const tone=transpose(song.tone,shift,useFlat);if($('songTone'))$('songTone').textContent=display(tone);if($('hymnToneNow'))$('hymnToneNow').textContent='Tono: '+display(tone);const saved=Number(store()[song.id]||0);if($('hymnToneStatus'))$('hymnToneStatus').textContent=shift===saved?'Usando el tono predeterminado guardado.':'Cambio temporal · guarda si este será el tono habitual.'}finally{rendering=false}}
function sync(){const box=$('hymnTranspose'),detail=$('detail'),isHymn=!detail?.classList.contains('hidden')&&$('songTypeBadge')?.textContent?.trim()==='Himno';if(box)box.classList.toggle('hidden',!isHymn);if(!isHymn){song=null;return}const next=findSong();if(!next)return;if(!song||song.id!==next.id){song=next;shift=Number(store()[song.id]||0)}render()}
function change(n){if(!song)sync();if(!song)return;shift+=n;render()}
function reset(){if(!song)return;shift=Number(store()[song.id]||0);render()}
function saveDefault(){if(!song)return;const d=store();d[song.id]=shift;save(d);render();$('hymnToneStatus').textContent='✓ Tono guardado como predeterminado para este himno.'}
function schedule(){setTimeout(sync,0);setTimeout(sync,60);setTimeout(sync,180)}
function wire(){const box=$('hymnTranspose');box?.classList.add('hidden');$('hymnDown')?.addEventListener('click',()=>change(-1));$('hymnUp')?.addEventListener('click',()=>change(1));$('hymnReset')?.addEventListener('click',reset);$('hymnSave')?.addEventListener('click',saveDefault);document.addEventListener('click',e=>{if(e.target.closest('[data-song],[data-search-song],[data-event-song],#notationBtn'))schedule()});const badge=$('songTypeBadge');if(badge)new MutationObserver(schedule).observe(badge,{childList:true,characterData:true,subtree:true});const chart=$('chart');if(chart)new MutationObserver(()=>{if(song)schedule()}).observe(chart,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
