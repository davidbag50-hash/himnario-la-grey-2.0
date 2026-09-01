(()=>{
'use strict';

const ACTIVE='lagrey_favs';
const GUEST='lagrey_guest_favs';
const GUEST_INIT='lagrey_guest_favs_initialized';
let lastMode='';
let lastMinistryId='';
let syncPromise=null;

const read=(key,fallback=[])=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return Array.isArray(v)?v:fallback}catch{return fallback}};
const normalize=values=>[...new Set((values||[]).map(v=>Number(v)).filter(Number.isFinite))];
const write=(key,values)=>localStorage.setItem(key,JSON.stringify(normalize(values)));
const state=()=>window.LAGREY_CLOUD?.getState?.()||null;
const ministryKey=id=>`lagrey_ministry_favs_${id}`;
const migratedKey=id=>`lagrey_ministry_favs_migrated_${id}`;

function toast(message){
 const t=document.getElementById('toast');
 if(!t)return;
 t.textContent=message;
 t.classList.remove('hidden');
 clearTimeout(toast.timer);
 toast.timer=setTimeout(()=>t.classList.add('hidden'),2600);
}

function backupGuestOnce(){
 if(localStorage.getItem(GUEST_INIT)==='1')return;
 write(GUEST,read(ACTIVE,[]));
 localStorage.setItem(GUEST_INIT,'1');
}

function refreshVisibleUI(ids){
 const set=new Set(normalize(ids));
 const count=document.getElementById('countFavs');
 if(count)count.textContent=`${set.size} ${document.documentElement.lang==='en'?'saved':'guardados'}`;

 const detail=document.getElementById('detail');
 const favBtn=document.getElementById('favBtn');
 if(detail&&!detail.classList.contains('hidden')&&favBtn){
  const title=document.getElementById('songTitle')?.textContent?.trim()||'';
  const artist=document.getElementById('songArtist')?.textContent?.trim()||'';
  const song=(window.LAGREY_SONGS||[]).find(s=>s.title===title&&s.artist===artist);
  if(song)favBtn.textContent=set.has(Number(song.id))?(document.documentElement.lang==='en'?'★ Favorite':'★ Favorito'):(document.documentElement.lang==='en'?'☆ Favorite':'☆ Favorito');
 }

 const listing=document.getElementById('listing');
 const title=document.getElementById('listTitle')?.textContent||'';
 if(listing&&!listing.classList.contains('hidden')&&/favorit/i.test(title)){
  setTimeout(()=>document.querySelector('[data-open="favorites"]')?.click(),0);
 }

 window.dispatchEvent(new CustomEvent('lagrey:favorites-synced',{detail:{ids:[...set]}}));
}

function restoreGuest(){
 if(localStorage.getItem(GUEST_INIT)!=='1')return;
 const ids=read(GUEST,[]);
 write(ACTIVE,ids);
 refreshVisibleUI(ids);
}

function currentSongId(){
 const title=document.getElementById('songTitle')?.textContent?.trim()||'';
 const artist=document.getElementById('songArtist')?.textContent?.trim()||'';
 const song=(window.LAGREY_SONGS||[]).find(s=>s.title===title&&s.artist===artist);
 return song?Number(song.id):null;
}

async function pullCloud(options={}){
 const s=state();
 if(!s||s.mode!=='ministry'||!s.ministry?.id||!s.data?.getRepertoire)return null;
 if(syncPromise)return syncPromise;
 syncPromise=(async()=>{
  const ministryId=String(s.ministry.id);
  backupGuestOnce();

  let rows=await s.data.getRepertoire();
  let cloudIds=normalize(rows.map(r=>r.songId));
  const localIds=normalize(read(ACTIVE,[]));
  const alreadyMigrated=localStorage.getItem(migratedKey(ministryId))==='1';

  if(options.allowMigration!==false&&!alreadyMigrated&&cloudIds.length===0&&localIds.length){
   const results=await Promise.allSettled(localIds.map(id=>s.data.addToRepertoire(id)));
   const succeeded=results.some(r=>r.status==='fulfilled');
   if(succeeded){
    rows=await s.data.getRepertoire();
    cloudIds=normalize(rows.map(r=>r.songId));
   }
   localStorage.setItem(migratedKey(ministryId),'1');
  }else if(!alreadyMigrated){
   localStorage.setItem(migratedKey(ministryId),'1');
  }

  write(ministryKey(ministryId),cloudIds);
  write(ACTIVE,cloudIds);
  lastMode='ministry';
  lastMinistryId=ministryId;
  refreshVisibleUI(cloudIds);
  return cloudIds;
 })().catch(error=>{
  console.warn('[La Grey favorites] sync failed',error);
  return null;
 }).finally(()=>{syncPromise=null});
 return syncPromise;
}

async function toggleCloudFavorite(id){
 const s=state();
 if(!s||s.mode!=='ministry'||!s.data)return false;
 const before=normalize(read(ACTIVE,[]));
 const had=before.includes(id);
 const next=had?before.filter(x=>x!==id):[...before,id];
 write(ACTIVE,next);
 write(ministryKey(s.ministry.id),next);
 refreshVisibleUI(next);
 try{
  if(had)await s.data.removeFromRepertoire(id);else await s.data.addToRepertoire(id);
  await pullCloud({allowMigration:false});
  toast(had?(document.documentElement.lang==='en'?'Removed from shared repertoire':'Quitado del repertorio compartido'):(document.documentElement.lang==='en'?'Added to shared repertoire':'Añadido al repertorio compartido'));
  return true;
 }catch(error){
  console.warn('[La Grey favorites] write failed',error);
  write(ACTIVE,before);
  write(ministryKey(s.ministry.id),before);
  refreshVisibleUI(before);
  toast(document.documentElement.lang==='en'?'Could not sync this favorite':'No se pudo sincronizar este favorito');
  return false;
 }
}

function handleState(next){
 if(!next)return;
 if(next.mode==='ministry'&&next.ministry?.id){
  pullCloud({allowMigration:true});
  return;
 }
 if((next.mode==='guest'||next.mode==='authenticated-no-ministry')&&lastMode==='ministry'){
  lastMode=next.mode;
  lastMinistryId='';
  restoreGuest();
 }
}

document.addEventListener('click',event=>{
 const button=event.target.closest?.('#favBtn');
 if(!button)return;
 const s=state();
 if(!s||s.mode!=='ministry')return;
 const id=currentSongId();
 if(id==null)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 toggleCloudFavorite(id);
},true);

window.addEventListener('focus',()=>pullCloud({allowMigration:false}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)pullCloud({allowMigration:false})});
window.addEventListener('online',()=>pullCloud({allowMigration:false}));
document.addEventListener('lagrey:profile-changed',()=>setTimeout(()=>pullCloud({allowMigration:true}),80));
window.addEventListener('pageshow',()=>setTimeout(()=>pullCloud({allowMigration:false}),80));

if(window.LAGREY_CLOUD?.subscribe){
 window.LAGREY_CLOUD.subscribe(handleState);
}else{
 window.addEventListener('lagrey:cloud-ready',()=>window.LAGREY_CLOUD?.subscribe?.(handleState),{once:true});
}

window.LAGREY_FAVORITES_SYNC={pull:()=>pullCloud({allowMigration:false}),getMinistryId:()=>lastMinistryId};
})();
