(()=>{
'use strict';
const $=id=>document.getElementById(id);
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',tx=(es,en)=>lang()==='en'?en:es;
let running=false,raf=0,last=0,pinchStart=0,pinchFont=0,fitTimer=0;
let fromList=false,savedY=0,savedId='',savedKey='cantos';
const pointers=new Map();
const minFont=8,maxFont=30;
const speedKey='lagrey_autoscroll_speed';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function speedPx(){const v=Number($('readerSpeed')?.value||32);return 6+v*0.72}
function updateSpeed(){const r=$('readerSpeed'),v=$('readerSpeedValue');if(v&&r)v.textContent=r.value+'%';if(r)localStorage.setItem(speedKey,r.value)}
function setButton(){const b=$('readerPlay');if(!b)return;b.classList.toggle('active',running);b.textContent=running?tx('⏸ Pausar','⏸ Pause'):'▶ Auto-scroll'}
function refreshLanguage(){
 setButton();
 const fit=$('readerFit');if(fit){fit.title=tx('Ajustar letra al ancho','Fit lyrics to width');fit.setAttribute('aria-label',fit.title)}
 const resetBtn=$('readerReset');if(resetBtn){resetBtn.title=tx('Volver al inicio de la letra','Back to the start of the lyrics');resetBtn.setAttribute('aria-label',resetBtn.title)}
 const speed=$('readerSpeed');if(speed)speed.setAttribute('aria-label',tx('Velocidad de desplazamiento','Scroll speed'));
 const tip=document.querySelector('#readerTools .reader-tip');if(tip)tip.textContent=tx('Un dedo: desplaza la canción normalmente · Dos dedos: junta para reducir o separa para ampliar.','One finger: scroll the song normally · Two fingers: pinch to reduce or spread to enlarge.');
 const listBack=document.querySelector('#listing .back[data-home]');if(listBack)listBack.textContent=tx('← Volver','← Back');
 const songBack=$('songBackBtn');if(songBack)songBack.textContent=tx('← Volver','← Back');
 const tone=$('songTone')?.parentElement;if(tone){const node=[...tone.childNodes].find(n=>n.nodeType===3);if(node)node.nodeValue=tx('Tono: ','Key: ')}
 const install=$('installBtn');if(install)install.textContent=tx('⬇ Instalar app','⬇ Install app');
 const hint=document.querySelector('#detail .head > .hint');if(hint)hint.textContent=tx('🎸🎹 Toca cualquier acorde para ver guitarra y piano.','🎸🎹 Tap any chord to view guitar and piano.');
}
function stop(){running=false;cancelAnimationFrame(raf);raf=0;last=0;setButton()}
function tick(t){if(!running)return;if($('detail')?.classList.contains('hidden'))return stop();if(!$('chordModal')?.classList.contains('hidden')){last=t;raf=requestAnimationFrame(tick);return}if(!last)last=t;const dt=Math.min(50,t-last)/1000;last=t;window.scrollBy(0,speedPx()*dt);const bottom=window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-3;if(bottom)return stop();raf=requestAnimationFrame(tick)}
function toggle(){running=!running;setButton();if(running){last=0;raf=requestAnimationFrame(tick)}else stop()}
function reset(){stop();const chart=document.querySelector('#detail .chart');const y=(chart?.getBoundingClientRect().top||0)+window.scrollY-8;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})}
function fitWidth(){
 const wrap=document.querySelector('#detail .chart'),chart=$('chart'),btn=$('readerFit');
 if(!wrap||!chart||$('detail')?.classList.contains('hidden'))return;
 let size=clamp(parseFloat(getComputedStyle(chart).fontSize)||17,minFont,maxFont);
 chart.style.fontSize=size+'px';
 const available=Math.max(120,wrap.clientWidth-6);
 let guard=0;
 while(chart.scrollWidth>available&&size>minFont&&guard++<60){size=Math.max(minFont,size-.5);chart.style.fontSize=size.toFixed(1)+'px'}
 localStorage.setItem('lagrey_font',String(Math.round(size)));
 btn?.classList.toggle('active',chart.scrollWidth<=available+2);
}
function scheduleFit(){clearTimeout(fitTimer);fitTimer=setTimeout(fitWidth,40)}
function inject(){const head=document.querySelector('#detail .head');if(!head||$('readerTools'))return;const box=document.createElement('div');box.id='readerTools';box.className='reader-tools';box.innerHTML=`<div class="reader-tools-top"><button id="readerPlay" class="btn reader-play" type="button">▶ Auto-scroll</button><button id="readerFit" class="btn reader-fit" type="button">↔</button><button id="readerReset" class="btn reader-reset" type="button">↺</button></div><div class="reader-speed-wrap"><span>🐢</span><input id="readerSpeed" class="reader-speed" type="range" min="1" max="100" step="1" value="32"><span id="readerSpeedValue" class="reader-speed-value">32%</span></div><p class="reader-tip"></p>`;head.appendChild(box);const saved=clamp(Number(localStorage.getItem(speedKey)||32),1,100);$('readerSpeed').value=saved;$('readerPlay').addEventListener('click',toggle);$('readerFit').addEventListener('click',()=>{stop();fitWidth()});$('readerReset').addEventListener('click',reset);$('readerSpeed').addEventListener('input',updateSpeed);updateSpeed();refreshLanguage()}
function pointerDistance(){const a=[...pointers.values()];if(a.length<2)return 0;return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}
function setupTouch(){const wrap=document.querySelector('#detail .chart');const chart=$('chart');if(!wrap||!chart)return;
 wrap.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;if(running)stop();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){pinchStart=pointerDistance();pinchFont=parseFloat(getComputedStyle(chart).fontSize)||17}},{passive:true});
 wrap.addEventListener('pointermove',e=>{if(e.pointerType!=='touch'||!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size!==2||!pinchStart)return;e.preventDefault();const d=pointerDistance();if(!d)return;const next=clamp(pinchFont*(d/pinchStart),minFont,maxFont);chart.style.fontSize=next.toFixed(1)+'px';localStorage.setItem('lagrey_font',String(Math.round(next)));$('readerFit')?.classList.remove('active')},{passive:false});
 const end=e=>{if(e.pointerType!=='touch')return;pointers.delete(e.pointerId);if(pointers.size<2){pinchStart=0;pinchFont=0}};
 wrap.addEventListener('pointerup',end,{passive:true});wrap.addEventListener('pointercancel',end,{passive:true});wrap.addEventListener('pointerleave',e=>{if(e.pointerType==='touch'&&pointers.has(e.pointerId)&&pointers.size>1)end(e)},{passive:true});
}
function listKey(){const t=($('listTitle')?.textContent||'').toLowerCase();return t.includes('himno')||t.includes('hymn')?'himnos':t.includes('favor')?'fav':'cantos'}
function saveListState(button){fromList=true;savedY=window.scrollY||window.pageYOffset||0;savedId=String(button.dataset.song||'');savedKey=listKey()}
function restoreExistingList(){const detail=$('detail'),listing=$('listing');if(!listing)return;detail?.classList.add('hidden');$('settingsView')?.classList.add('hidden');listing.classList.remove('hidden');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));if(savedKey==='cantos')document.querySelector('nav button[data-nav="songs"]')?.classList.add('active');const apply=()=>{const safe=(window.CSS&&CSS.escape)?CSS.escape(savedId):savedId.replace(/[^a-zA-Z0-9_-]/g,''),a=savedId?document.querySelector(`#songList [data-song="${safe}"]`):null;if(a){const lt=($('songList')?.getBoundingClientRect().top||0)+(window.scrollY||0),at=a.getBoundingClientRect().top+(window.scrollY||0);window.scrollTo(0,Math.max(0,Math.min(savedY,at-lt+savedY)))}else window.scrollTo(0,savedY)};window.scrollTo(0,savedY);requestAnimationFrame(()=>requestAnimationFrame(apply));setTimeout(apply,40);setTimeout(apply,120);fromList=false}
function wireListReturn(){if(document.documentElement.dataset.lgSongReaderListReturn==='1')return;document.documentElement.dataset.lgSongReaderListReturn='1';document.addEventListener('click',e=>{const song=e.target.closest?.('#songList [data-song]');if(song&&!$('listing')?.classList.contains('hidden')){saveListState(song);return}if(e.target.closest?.('#songBackBtn')&&fromList){e.preventDefault();e.stopImmediatePropagation();restoreExistingList()}},true)}
function setImmersive(on){
 document.body.classList.toggle('song-immersive',!!on);
 document.body.classList.toggle('song-detail-open',!!on);
 if(on){scheduleFit();refreshLanguage()}else stop();
}
function watchViews(){const detail=$('detail');if(detail){new MutationObserver(()=>setImmersive(!detail.classList.contains('hidden'))).observe(detail,{attributes:true,attributeFilter:['class']});setImmersive(!detail.classList.contains('hidden'))}const chart=$('chart');if(chart)new MutationObserver(()=>{if(!$('detail')?.classList.contains('hidden'))scheduleFit()}).observe(chart,{childList:true,subtree:true});}
function wire(){inject();setupTouch();wireListReturn();watchViews();refreshLanguage();window.addEventListener('resize',scheduleFit,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))refreshLanguage()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
