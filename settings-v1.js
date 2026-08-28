(()=>{
'use strict';
const $=id=>document.getElementById(id);
const BASE='https://davidbag50-hash.github.io/himnario-la-grey-2.0/';
const K={theme:'lagrey_theme',lang:'lagrey_language',instrument:'lagrey_preferred_instrument',awake:'lagrey_keep_awake',notation:'lagrey_notation',font:'lagrey_font',rating:'lagrey_rating'};
const media=window.matchMedia?.('(prefers-color-scheme: light)');
let wakeLock=null,translationBusy=false,translationTimer=null;
const get=(k,f)=>localStorage.getItem(k)??f;
const set=(k,v)=>localStorage.setItem(k,String(v));
function toast(msg){const e=$('toast');if(!e)return;e.textContent=msg;e.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.add('hidden'),2200)}
function lang(){return get(K.lang,'es')==='en'?'en':'es'}
function themeChoice(){const v=get(K.theme,'dark');return ['dark','light','system'].includes(v)?v:'dark'}
function actualTheme(){const c=themeChoice();return c==='system'?(media?.matches?'light':'dark'):c}
function applyTheme(){const t=actualTheme();document.documentElement.dataset.theme=t;document.documentElement.dataset.themeChoice=themeChoice();const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=t==='light'?'#f7fbff':'#17324d'}
function setText(el,value){if(el&&el.textContent!==value)el.textContent=value}
function setPlaceholder(el,value){if(el&&el.placeholder!==value)el.placeholder=value}
function card(open,title,sub){const c=document.querySelector(`[data-open="${open}"]`);if(!c)return;setText(c.querySelector('h2'),title);setText(c.querySelector('.muted'),sub)}
const T={
 es:{
  eyebrow:'GRUPO DE ALABANZA',profile:'Perfil',search:'🔎 Buscar canto, himno o número...',home:'Inicio',songs:'Cantos',hymns:'Himnos',chords:'Acordes',calendar:'Calendario',tuner:'Afinador',voice:'Voz',favorites:'Favoritos',
  songSub:'Repertorio de cantos',hymnSub:'Repertorio de himnos',voiceSub:'Calentamiento y entrenamiento vocal',chordSub:'Guitarra y piano',tunerSub:'Afinación por micrófono',calendarSub:'Cultos, ensayos y repertorios',favSub:'Acceso rápido',
  back:'← Volver',detailHint:'🎸🎹 Toca cualquier acorde para ver guitarra y piano.',chordPage:'🎸🎹 Acordes',chordPageSub:'Posiciones de guitarra, notas de piano e inversiones.',chordSearch:'Buscar: C, Do, F#m, maj7...',
  tunerPage:'🎤 Afinador',tunerIntro:'Usa el micrófono del dispositivo. El audio se analiza localmente y no se sube.',startMic:'Activar micrófono',stopMic:'Detener',chromatic:'Cromático',guitar:'Guitarra',piano:'Piano',
  calendarPage:'📅 Calendario',calendarIntro:'Organiza cultos, ensayos y el repertorio de cada fecha.',today:'Hoy',export:'Exportar calendario',
  settings:'Ajustes',settingsSub:'Personaliza La Grey a tu manera.',appearance:'Apariencia',theme:'Tema',themeHelp:'Oscuro es el diseño predeterminado de La Grey.',dark:'Oscuro · Predeterminado',light:'Claro',system:'Según el dispositivo',
  language:'Idioma',languageHelp:'Cambia la interfaz. Las letras de cantos e himnos no se traducen.',spanish:'Español',english:'English',music:'Música y lectura',notation:'Notación musical',notationHelp:'Elige entre C D E o Do Re Mi.',instrument:'Instrumento al abrir acordes',instrumentHelp:'Decide qué vista aparece primero.',font:'Tamaño de letra de canciones',fontHelp:'Ajusta la lectura de letras y acordes.',small:'Pequeño',normal:'Normal',large:'Grande',xlarge:'Muy grande',
  behavior:'Comportamiento',awake:'Mantener pantalla activa',awakeHelp:'Evita que la pantalla se apague mientras usas La Grey, si tu dispositivo lo permite.',account:'Perfil y aplicación',editProfile:'Editar perfil',editProfileHelp:'Cambia el nombre o el modo de visitante.',open:'Abrir',share:'Compartir La Grey',shareHelp:'Envía el enlace de la aplicación a otra persona.',shareBtn:'Compartir',rate:'Calificar La Grey',rateHelp:'Guarda una valoración en este dispositivo.',rateBtn:'Calificar',about:'Información de la aplicación',aboutHelp:'Propósito, autor y versión de La Grey.',aboutBtn:'Ver información',reset:'Restablecer preferencias',resetHelp:'Vuelve a Oscuro, Español y los valores predeterminados. No borra favoritos, perfil ni calendario.',resetBtn:'Restablecer',version:'La Grey · Versión 2.0',
  aboutTitle:'Acerca de La Grey',aboutPurpose:'La Grey nació para facilitar a músicos, cantantes y grupos de alabanza el acceso a himnos, cantos, acordes y herramientas prácticas desde un solo lugar.',author:'Autor',createdBy:'David Acosta',purpose:'Propósito',versionLabel:'Versión',close:'Cerrar',ratingTitle:'Calificar La Grey',ratingNote:'Tu valoración queda guardada en este dispositivo por ahora.',thanks:'¡Gracias por calificar La Grey!',shared:'Enlace de La Grey listo para compartir.',copied:'Enlace copiado.',resetConfirm:'¿Restablecer las preferencias de La Grey? Tus favoritos, perfil y calendario no se borrarán.',wakeUnsupported:'Tu navegador no admite mantener la pantalla activa.',
 },
 en:{
  eyebrow:'WORSHIP TEAM',profile:'Profile',search:'🔎 Search song, hymn or number...',home:'Home',songs:'Songs',hymns:'Hymns',chords:'Chords',calendar:'Calendar',tuner:'Tuner',voice:'Voice',favorites:'Favorites',
  songSub:'Song repertoire',hymnSub:'Hymn repertoire',voiceSub:'Warm-ups and vocal training',chordSub:'Guitar and piano',tunerSub:'Microphone tuning',calendarSub:'Services, rehearsals and setlists',favSub:'Quick access',
  back:'← Back',detailHint:'🎸🎹 Tap any chord to view guitar and piano.',chordPage:'🎸🎹 Chords',chordPageSub:'Guitar shapes, piano notes and inversions.',chordSearch:'Search: C, Do, F#m, maj7...',
  tunerPage:'🎤 Tuner',tunerIntro:'Uses your device microphone. Audio is analyzed locally and is not uploaded.',startMic:'Activate microphone',stopMic:'Stop',chromatic:'Chromatic',guitar:'Guitar',piano:'Piano',
  calendarPage:'📅 Calendar',calendarIntro:'Organize services, rehearsals and each date’s setlist.',today:'Today',export:'Export calendar',
  settings:'Settings',settingsSub:'Make La Grey work the way you like.',appearance:'Appearance',theme:'Theme',themeHelp:'Dark is La Grey’s default design.',dark:'Dark · Default',light:'Light',system:'Follow device',
  language:'Language',languageHelp:'Changes the interface. Song and hymn lyrics are not translated.',spanish:'Español',english:'English',music:'Music and reading',notation:'Music notation',notationHelp:'Choose between C D E and Do Re Mi.',instrument:'Default chord instrument',instrumentHelp:'Choose which view opens first.',font:'Song text size',fontHelp:'Adjust lyrics and chord readability.',small:'Small',normal:'Normal',large:'Large',xlarge:'Extra large',
  behavior:'Behavior',awake:'Keep screen awake',awakeHelp:'Prevents the screen from sleeping while using La Grey, when supported by your device.',account:'Profile and app',editProfile:'Edit profile',editProfileHelp:'Change your name or visitor mode.',open:'Open',share:'Share La Grey',shareHelp:'Send the app link to someone else.',shareBtn:'Share',rate:'Rate La Grey',rateHelp:'Saves your rating on this device.',rateBtn:'Rate',about:'App information',aboutHelp:'Purpose, author and La Grey version.',aboutBtn:'View info',reset:'Reset preferences',resetHelp:'Returns to Dark, Spanish and default values. Favorites, profile and calendar stay intact.',resetBtn:'Reset',version:'La Grey · Version 2.0',
  aboutTitle:'About La Grey',aboutPurpose:'La Grey was created to help musicians, singers and worship teams access hymns, songs, chords and practical tools in one place.',author:'Author',createdBy:'David Acosta',purpose:'Purpose',versionLabel:'Version',close:'Close',ratingTitle:'Rate La Grey',ratingNote:'For now, your rating is stored only on this device.',thanks:'Thanks for rating La Grey!',shared:'La Grey link ready to share.',copied:'Link copied.',resetConfirm:'Reset La Grey preferences? Your favorites, profile and calendar will not be deleted.',wakeUnsupported:'Your browser does not support keeping the screen awake.',
 }
};
function t(k){return T[lang()][k]||T.es[k]||k}
function translateSettings(){
 document.documentElement.lang=lang();
 document.querySelectorAll('[data-settings-i18n]').forEach(el=>{const k=el.dataset.settingsI18n;setText(el,t(k))});
 const theme=$('settingsTheme');if(theme){theme.options[0].text=t('dark');theme.options[1].text=t('light');theme.options[2].text=t('system')}
 const language=$('settingsLanguage');if(language){language.options[0].text=t('spanish');language.options[1].text=t('english')}
 const instr=$('settingsInstrument');if(instr){instr.options[0].text=t('guitar');instr.options[1].text=t('piano')}
 const font=$('settingsFont');if(font){font.options[0].text=t('small');font.options[1].text=t('normal');font.options[2].text=t('large');font.options[3].text=t('xlarge')}
}
function translateApp(){
 if(translationBusy)return;translationBusy=true;
 try{
  const x=T[lang()];
  setText(document.querySelector('.eyebrow'),x.eyebrow);setText(document.querySelector('#profileBtn span'),x.profile);setPlaceholder($('q'),x.search);
  card('songs',x.songs,x.songSub);card('hymns',x.hymns,x.hymnSub);card('voice',x.voice,x.voiceSub);card('chords',x.chords,x.chordSub);card('tuner',x.tuner,x.tunerSub);card('calendar',x.calendar,x.calendarSub);card('favorites',x.favorites,x.favSub);
  const navs={home:x.home,songs:x.songs,chords:x.chords,calendar:x.calendar,tuner:x.tuner};Object.entries(navs).forEach(([k,v])=>setText(document.querySelector(`nav [data-nav="${k}"] span`),v));
  document.querySelectorAll('.back[data-home]').forEach(el=>setText(el,x.back));setText($('songBackBtn'),x.back);
  setText(document.querySelector('#detail .hint'),x.detailHint);setText(document.querySelector('#chordsView h1'),x.chordPage);setText(document.querySelector('#chordsView .muted'),x.chordPageSub);setPlaceholder($('chordSearch'),x.chordSearch);
  setText(document.querySelector('#tunerView h1'),x.tunerPage);setText(document.querySelector('#tunerView .artist'),x.tunerIntro);setText($('startTunerBtn'),x.startMic);setText($('stopTunerBtn'),x.stopMic);setText(document.querySelector('[data-tuner-mode="chromatic"]'),x.chromatic);setText(document.querySelector('[data-tuner-mode="guitar"]'),x.guitar);
  setText(document.querySelector('#calendarView h1'),x.calendarPage);setText(document.querySelector('#calendarView .calendar-head .muted'),x.calendarIntro);setText($('todayBtn'),x.today);setText($('exportCalendar'),x.export);
  const lt=$('listTitle');if(lt&&lang()==='en'){if(lt.textContent==='🎵 Cantos')setText(lt,'🎵 Songs');if(lt.textContent==='🎼 Himnos')setText(lt,'🎼 Hymns');if(lt.textContent==='⭐ Favoritos')setText(lt,'⭐ Favorites')}
  const badge=$('songTypeBadge');if(badge&&lang()==='en'){if(badge.textContent.trim()==='Canto')setText(badge,'Song');if(badge.textContent.trim()==='Himno')setText(badge,'Hymn')}
  const fav=$('favBtn');if(fav&&lang()==='en'){if(fav.textContent==='☆ Favorito')setText(fav,'☆ Favorite');if(fav.textContent==='★ Favorito')setText(fav,'★ Favorite')}
  translateSettings();
 }finally{translationBusy=false}
}
function scheduleTranslate(){clearTimeout(translationTimer);translationTimer=setTimeout(translateApp,30)}
function syncControls(){
 if($('settingsTheme'))$('settingsTheme').value=themeChoice();if($('settingsLanguage'))$('settingsLanguage').value=lang();if($('settingsNotation'))$('settingsNotation').value=get(K.notation,'american');if($('settingsInstrument'))$('settingsInstrument').value=get(K.instrument,'guitar');if($('settingsFont'))$('settingsFont').value=get(K.font,'17');if($('settingsAwake'))$('settingsAwake').checked=get(K.awake,'0')==='1';translateSettings()
}
function openSettings(){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('settingsView')?.classList.remove('hidden');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));syncControls();window.scrollTo(0,0)}
function closeSettings(){ $('settingsView')?.classList.add('hidden');const home=document.querySelector('nav [data-nav="home"]');home?.click();scheduleTranslate() }
async function requestWake(){
 if(get(K.awake,'0')!=='1'||document.visibilityState!=='visible')return;
 if(!('wakeLock' in navigator)){toast(t('wakeUnsupported'));if($('settingsAwake'))$('settingsAwake').checked=false;set(K.awake,'0');return}
 try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null})}catch{}
}
async function releaseWake(){try{await wakeLock?.release()}catch{}wakeLock=null}
function applyFont(){const n=Number(get(K.font,'17'));const chart=$('chart');if(chart)chart.style.fontSize=n+'px'}
function applyInstrumentPreference(){const modal=$('chordModal');if(!modal||modal.classList.contains('hidden'))return;const pref=get(K.instrument,'guitar');setTimeout(()=>$(pref==='piano'?'pianoTab':'guitarTab')?.click(),0)}
function ensureModals(){
 if(!$('settingsAboutModal')){const m=document.createElement('div');m.id='settingsAboutModal';m.className='modal hidden';m.innerHTML=`<div class="modal-card"><div class="modal-top"><div><h2 data-about-title></h2><div class="chord-sub">La Grey</div></div><button class="close" data-settings-close="settingsAboutModal">×</button></div><div class="settings-about-logo">🎵</div><h3 class="settings-about-name">La Grey</h3><div class="settings-about-version">2.0</div><div class="info-card"><b data-about-purpose-label></b><p data-about-purpose style="line-height:1.6;margin-bottom:0"></p></div><div class="info-card"><b data-about-author-label></b><p data-about-author style="margin-bottom:0"></p></div><button class="btn wide" data-settings-close="settingsAboutModal"></button></div>`;document.body.appendChild(m)}
 if(!$('settingsRatingModal')){const m=document.createElement('div');m.id='settingsRatingModal';m.className='modal hidden';m.innerHTML=`<div class="modal-card"><div class="modal-top"><div><h2 data-rating-title></h2><div class="chord-sub">La Grey</div></div><button class="close" data-settings-close="settingsRatingModal">×</button></div><div class="rating-stars">${[1,2,3,4,5].map(n=>`<button class="rating-star" data-rating="${n}" aria-label="${n}">★</button>`).join('')}</div><p class="rating-note" data-rating-note></p></div>`;document.body.appendChild(m)}
 refreshModalLanguage();refreshRating()
}
function refreshModalLanguage(){
 const a=$('settingsAboutModal');if(a){setText(a.querySelector('[data-about-title]'),t('aboutTitle'));setText(a.querySelector('[data-about-purpose-label]'),t('purpose'));setText(a.querySelector('[data-about-purpose]'),t('aboutPurpose'));setText(a.querySelector('[data-about-author-label]'),t('author'));setText(a.querySelector('[data-about-author]'),t('createdBy'));setText(a.querySelector('[data-settings-close="settingsAboutModal"]:last-child'),t('close'))}
 const r=$('settingsRatingModal');if(r){setText(r.querySelector('[data-rating-title]'),t('ratingTitle'));setText(r.querySelector('[data-rating-note]'),t('ratingNote'))}
}
function refreshRating(){const n=Number(get(K.rating,'0'));document.querySelectorAll('.rating-star').forEach(b=>b.classList.toggle('active',Number(b.dataset.rating)<=n))}
async function shareApp(){try{if(navigator.share){await navigator.share({title:'La Grey',text:'La Grey — Himnario y herramientas para grupos de alabanza',url:BASE});toast(t('shared'))}else{await navigator.clipboard.writeText(BASE);toast(t('copied'))}}catch{}}
function resetPrefs(){if(!confirm(t('resetConfirm')))return;set(K.theme,'dark');set(K.lang,'es');set(K.instrument,'guitar');set(K.awake,'0');set(K.notation,'american');set(K.font,'17');location.reload()}
function wire(){
 applyTheme();ensureModals();syncControls();translateApp();applyFont();
 $('settingsBtn')?.addEventListener('click',openSettings);$('settingsBackBtn')?.addEventListener('click',closeSettings);
 document.addEventListener('click',e=>{if(e.target.closest('nav button,[data-open]'))$('settingsView')?.classList.add('hidden');const close=e.target.closest('[data-settings-close]');if(close)$(close.dataset.settingsClose)?.classList.add('hidden');const star=e.target.closest('[data-rating]');if(star){set(K.rating,star.dataset.rating);refreshRating();toast(t('thanks'))}});
 $('settingsTheme')?.addEventListener('change',e=>{set(K.theme,e.target.value);applyTheme()});
 $('settingsLanguage')?.addEventListener('change',e=>{set(K.lang,e.target.value);translateApp();refreshModalLanguage()});
 $('settingsNotation')?.addEventListener('change',e=>{const wanted=e.target.value,current=get(K.notation,'american');if(wanted!==current)$('notationBtn')?.click();else set(K.notation,wanted);scheduleTranslate()});
 $('settingsInstrument')?.addEventListener('change',e=>set(K.instrument,e.target.value));
 $('settingsFont')?.addEventListener('change',e=>{set(K.font,e.target.value);applyFont()});
 $('settingsAwake')?.addEventListener('change',async e=>{set(K.awake,e.target.checked?'1':'0');e.target.checked?await requestWake():await releaseWake()});
 $('settingsProfileBtn')?.addEventListener('click',()=>$('profileBtn')?.click());$('settingsShareBtn')?.addEventListener('click',shareApp);$('settingsRateBtn')?.addEventListener('click',()=>{ensureModals();$('settingsRatingModal')?.classList.remove('hidden')});$('settingsAboutBtn')?.addEventListener('click',()=>{ensureModals();$('settingsAboutModal')?.classList.remove('hidden')});$('settingsResetBtn')?.addEventListener('click',resetPrefs);
 const chord=$('chordModal');if(chord)new MutationObserver(applyInstrumentPreference).observe(chord,{attributes:true,attributeFilter:['class']});
 new MutationObserver(scheduleTranslate).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')requestWake();else releaseWake()});requestWake();
 media?.addEventListener?.('change',()=>{if(themeChoice()==='system')applyTheme()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
