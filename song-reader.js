(()=>{
'use strict';
const $=id=>document.getElementById(id);
let running=false,raf=0,last=0,pinchStart=0,pinchFont=0,fitTimer=0;
const minFont=8,maxFont=30;
const speedKey='lagrey_autoscroll_speed';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function speedPx(){const v=Number($('readerSpeed')?.value||32);return 6+v*0.72}
function updateSpeed(){const r=$('readerSpeed'),v=$('readerSpeedValue');if(v&&r)v.textContent=r.value+'%';if(r)localStorage.setItem(speedKey,r.value)}
function setButton(){const b=$('readerPlay');if(!b)return;b.classList.toggle('active',running);b.textContent=running?'⏸ Pausar':'▶ Auto-scroll'}
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
function inject(){const head=document.querySelector('#detail .head');if(!head||$('readerTools'))return;const box=document.createElement('div');box.id='readerTools';box.className='reader-tools';box.innerHTML=`<div class="reader-tools-top"><button id="readerPlay" class="btn reader-play" type="button">▶ Auto-scroll</button><button id="readerFit" class="btn reader-fit" type="button" title="Ajustar letra al ancho">↔</button><button id="readerReset" class="btn reader-reset" type="button" title="Volver al inicio de la letra">↺</button></div><div class="reader-speed-wrap"><span>🐢</span><input id="readerSpeed" class="reader-speed" type="range" min="1" max="100" step="1" value="32" aria-label="Velocidad de desplazamiento"><span id="readerSpeedValue" class="reader-speed-value">32%</span></div><p class="reader-tip">Dos dedos sobre la letra: junta para reducir · separa para ampliar. El auto-scroll es opcional y puedes seguir desplazando la letra con un dedo.</p>`;head.appendChild(box);const saved=clamp(Number(localStorage.getItem(speedKey)||32),1,100);$('readerSpeed').value=saved;$('readerPlay').addEventListener('click',toggle);$('readerFit').addEventListener('click',()=>{stop();fitWidth()});$('readerReset').addEventListener('click',reset);$('readerSpeed').addEventListener('input',updateSpeed);updateSpeed()}
function dist(t){const dx=t[0].clientX-t[1].clientX,dy=t[0].clientY-t[1].clientY;return Math.hypot(dx,dy)}
function setupTouch(){const wrap=document.querySelector('#detail .chart');const chart=$('chart');if(!wrap||!chart)return;
 wrap.addEventListener('touchstart',e=>{if(e.touches.length===1&&running)stop();if(e.touches.length===2){stop();pinchStart=dist(e.touches);pinchFont=parseFloat(getComputedStyle(chart).fontSize)||17}},{passive:true});
 wrap.addEventListener('touchmove',e=>{if(e.touches.length!==2||!pinchStart)return;e.preventDefault();const scale=dist(e.touches)/pinchStart;const next=clamp(pinchFont*scale,minFont,maxFont);chart.style.fontSize=next.toFixed(1)+'px';localStorage.setItem('lagrey_font',String(Math.round(next)));$('readerFit')?.classList.remove('active')},{passive:false});
 wrap.addEventListener('touchend',e=>{if(e.touches.length<2){pinchStart=0;pinchFont=0}},{passive:true});
}
function setImmersive(on){document.body.classList.toggle('song-immersive',!!on);if(on)scheduleFit();else stop()}
function watchViews(){const detail=$('detail');if(detail){new MutationObserver(()=>setImmersive(!detail.classList.contains('hidden'))).observe(detail,{attributes:true,attributeFilter:['class']});setImmersive(!detail.classList.contains('hidden'))}const chart=$('chart');if(chart)new MutationObserver(()=>{if(!$('detail')?.classList.contains('hidden'))scheduleFit()}).observe(chart,{childList:true,subtree:true});}
function wire(){inject();setupTouch();watchViews();window.addEventListener('resize',scheduleFit,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
