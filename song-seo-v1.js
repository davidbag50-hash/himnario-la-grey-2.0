(()=>{
'use strict';

const params=new URLSearchParams(location.search);
const raw=params.get('song');
if(!/^\d+$/.test(String(raw||'')))return;

const id=Number(raw);
const item=(window.LAGREY_SONGS||[]).find(s=>Number(s.id)===id);
if(!item)return;

const BASE='https://davidbag50-hash.github.io/himnario-la-grey-2.0/';
const url=`${BASE}?song=${encodeURIComponent(String(id))}`;
const isHymn=item.type==='himnos';
const number=isHymn&&item.bookNumber?` ${item.bookNumber}`:'';
const credit=String(item.artist||'').trim();
const tone=String(item.tone||'').trim();
const title=isHymn
 ?`${item.title} | Himno${number} con acordes | La Grey`
 :`${item.title}${credit?` - ${credit}`:''} | Canto cristiano con acordes | La Grey`;
const description=isHymn
 ?`Himno${number}: ${item.title}. Consulta la letra y los acordes${tone?` en tono ${tone}`:''} en el himnario cristiano La Grey.`
 :`${item.title}${credit?` de ${credit}`:''}. Consulta la letra y los acordes${tone?` en tono ${tone}`:''} en el cancionero cristiano La Grey.`;

function setMeta(selector,attribute,value){
 const el=document.head.querySelector(selector);
 if(el)el.setAttribute(attribute,value);
}

document.title=title;
setMeta('meta[name="description"]','content',description);
setMeta('link[rel="canonical"]','href',url);
setMeta('meta[property="og:title"]','content',title);
setMeta('meta[property="og:description"]','content',description);
setMeta('meta[property="og:url"]','content',url);
setMeta('meta[name="twitter:title"]','content',title);
setMeta('meta[name="twitter:description"]','content',description);

let ld=document.getElementById('lgSongSeoJsonLd');
if(!ld){ld=document.createElement('script');ld.id='lgSongSeoJsonLd';ld.type='application/ld+json';document.head.appendChild(ld)}
const data={
 '@context':'https://schema.org',
 '@type':'CreativeWork',
 name:String(item.title||''),
 url,
 inLanguage:'es',
 genre:'Música cristiana',
 identifier:String(id),
 isPartOf:{'@type':'WebSite',name:'La Grey',url:BASE},
 additionalProperty:[
  {'@type':'PropertyValue',name:'Tipo',value:isHymn?'Himno':'Canto'},
  ...(item.bookNumber?[{'@type':'PropertyValue',name:'Número de himno',value:String(item.bookNumber)}]:[]),
  ...(tone?[{'@type':'PropertyValue',name:'Tono',value:tone}]:[])
 ]
};
if(credit)data.creator=credit;
ld.textContent=JSON.stringify(data);

/* Una visita desde Google abre directamente la ficha visible del canto/himno. */
let attempts=0;
function openDeepLink(){
 attempts+=1;
 const q=document.getElementById('q');
 const results=document.getElementById('results');
 if(q&&results){
  q.value=String(item.title||'');
  q.dispatchEvent(new Event('input',{bubbles:true}));
  const direct=results.querySelector(`[data-search-song="${id}"]`);
  if(direct){direct.click();return}
 }
 if(attempts<20)setTimeout(openDeepLink,100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(openDeepLink,0),{once:true});
else setTimeout(openDeepLink,0);
})();
