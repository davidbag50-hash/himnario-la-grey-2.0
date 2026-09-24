(()=>{
'use strict';

/*
 * La Grey Cloud — capa de acceso a datos v1
 *
 * Este archivo NO se carga todavía desde index.html.
 * Define el contrato que usará la UI cuando conectemos Supabase.
 * La interfaz no debe depender directamente del proveedor de nube.
 */

const SONGS=()=>window.LAGREY_SONGS||[];
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback))}catch{return fallback}};
const writeJSON=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
const songById=id=>SONGS().find(song=>String(song.id)===String(id))||null;

class GuestLocalAdapter{
  constructor(){
    this.kind='guest-local';
    this.favoritesKey='lagrey_favs';
    this.metaKey='lagrey_guest_repertoire_meta';
  }

  async getCurrentProfile(){
    const saved=readJSON('lagrey_member_profile',null);
    return saved?.id==='visitor'?saved:{id:'visitor',name:'Visitante',roles:[],instrument:'none',ministryId:null,ministryName:null};
  }

  async getCurrentMinistry(){return null}

  async getRepertoire(){
    const ids=readJSON(this.favoritesKey,[]);
    const meta=readJSON(this.metaKey,{});
    return ids.map(id=>{
      const song=songById(id);
      if(!song)return null;
      return {
        songId:song.id,
        songType:song.type,
        officialTone:meta[String(song.id)]?.officialTone||null,
        source:'local'
      };
    }).filter(Boolean);
  }

  async addToRepertoire(songId){
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const ids=readJSON(this.favoritesKey,[]);
    if(!ids.some(id=>String(id)===String(song.id))){ids.push(song.id);writeJSON(this.favoritesKey,ids)}
    return {songId:song.id,songType:song.type,source:'local'};
  }

  async removeFromRepertoire(songId){
    const ids=readJSON(this.favoritesKey,[]).filter(id=>String(id)!==String(songId));
    writeJSON(this.favoritesKey,ids);
    const meta=readJSON(this.metaKey,{});delete meta[String(songId)];writeJSON(this.metaKey,meta);
    return true;
  }

  async setOfficialTone(songId,tone){
    /* Para invitado esta propiedad es solo local; no representa un tono de ministerio. */
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const meta=readJSON(this.metaKey,{});
    meta[String(song.id)]={...(meta[String(song.id)]||{}),officialTone:String(tone||'').trim()||null};
    writeJSON(this.metaKey,meta);
    return meta[String(song.id)].officialTone;
  }

  async getSharedSongNotes(songId){
    const meta=readJSON(this.metaKey,{});
    return meta[String(songId)]?.notes||'';
  }

  async saveSharedSongNotes(songId,body){
    /* En invitado son notas privadas/locales aunque la UI futura use el mismo contrato. */
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const meta=readJSON(this.metaKey,{});
    meta[String(song.id)]={...(meta[String(song.id)]||{}),notes:String(body||'')};
    writeJSON(this.metaKey,meta);
    return meta[String(song.id)].notes;
  }
}

class MinistryCloudAdapter{
  constructor({client,userId,ministryId}){
    if(!client)throw new Error('Cloud client is required');
    if(!userId)throw new Error('Authenticated userId is required');
    if(!ministryId)throw new Error('ministryId is required');
    this.kind='ministry-cloud';
    this.client=client;
    this.userId=userId;
    this.ministryId=ministryId;
  }

  _ok(result){
    if(result?.error)throw result.error;
    return result?.data;
  }

  async getCurrentProfile(){
    return this._ok(await this.client.from('profiles').select('*').eq('id',this.userId).single());
  }

  async getCurrentMinistry(){
    return this._ok(await this.client.from('ministries').select('*').eq('id',this.ministryId).single());
  }

  async getRepertoire(){
    const rows=this._ok(await this.client.from('ministry_repertoire').select('*').eq('ministry_id',this.ministryId).order('added_at',{ascending:true}))||[];
    return rows.map(row=>({
      id:row.id,
      songId:row.song_id,
      songType:row.song_type,
      officialTone:row.official_tone,
      addedBy:row.added_by,
      addedAt:row.added_at,
      updatedAt:row.updated_at,
      source:'cloud'
    }));
  }

  async addToRepertoire(songId){
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const row={ministry_id:this.ministryId,song_id:song.id,song_type:song.type,added_by:this.userId};
    const data=this._ok(await this.client.from('ministry_repertoire').upsert(row,{onConflict:'ministry_id,song_id'}).select().single());
    return data;
  }

  async removeFromRepertoire(songId){
    this._ok(await this.client.from('ministry_repertoire').delete().eq('ministry_id',this.ministryId).eq('song_id',Number(songId)));
    return true;
  }

  async setOfficialTone(songId,tone){
    const data=this._ok(await this.client.from('ministry_repertoire').update({official_tone:String(tone||'').trim()||null}).eq('ministry_id',this.ministryId).eq('song_id',Number(songId)).select().single());
    return data?.official_tone??null;
  }

  async getSharedSongNotes(songId){
    const result=await this.client.from('ministry_song_notes').select('body').eq('ministry_id',this.ministryId).eq('song_id',Number(songId)).maybeSingle();
    if(result?.error)throw result.error;
    return result?.data?.body||'';
  }

  async saveSharedSongNotes(songId,body){
    const row={ministry_id:this.ministryId,song_id:Number(songId),body:String(body||''),updated_by:this.userId};
    const data=this._ok(await this.client.from('ministry_song_notes').upsert(row,{onConflict:'ministry_id,song_id'}).select().single());
    return data?.body||'';
  }

  async getEvents(){
    const result=await this.client
      .from('ministry_events')
      .select('id,ministry_id,event_type,event_date,event_time,rehearsal_at,title,leader,singers,notes,created_by,created_at,updated_at,ministry_event_setlist(id,position,song_id,song_type,tone)')
      .eq('ministry_id',this.ministryId)
      .order('event_date',{ascending:true})
      .order('event_time',{ascending:true});
    const rows=this._ok(result)||[];
    const assignmentsByEvent=new Map();
    const eventIds=rows.map(row=>row.id).filter(Boolean);
    if(eventIds.length){
      try{
        const assignmentResult=await this.client
          .from('ministry_event_assignments')
          .select('event_id,roster_member_id,display_name,music_role,position')
          .in('event_id',eventIds)
          .order('position',{ascending:true});
        if(assignmentResult.error)throw assignmentResult.error;
        for(const item of assignmentResult.data||[]){
          const list=assignmentsByEvent.get(item.event_id)||[];
          list.push({
            rosterMemberId:item.roster_member_id||null,
            displayName:item.display_name||'',
            musicRole:item.music_role||'',
            position:Number(item.position)||list.length+1
          });
          assignmentsByEvent.set(item.event_id,list);
        }
      }catch(error){
        console.warn('[La Grey Cloud] event assignments unavailable',error);
      }
    }
    return rows.map(row=>({
      id:row.id,
      type:row.event_type||'service',
      date:row.event_date,
      time:row.event_time?String(row.event_time).slice(0,5):'',
      rehearsal:row.rehearsal_at?String(row.rehearsal_at).slice(0,16):'',
      title:row.title||'',
      leader:row.leader||'',
      singers:row.singers||'',
      notes:row.notes||'',
      assignments:assignmentsByEvent.get(row.id)||[],
      setlist:(row.ministry_event_setlist||[])
        .slice()
        .sort((a,b)=>Number(a.position)-Number(b.position))
        .map(item=>({
          songId:Number(item.song_id),
          songType:item.song_type,
          tone:item.tone||''
        })),
      source:'cloud'
    }));
  }

  async saveEvent(event){
    const setlist=(event?.setlist||[]).map(item=>{
      const song=songById(item?.songId);
      if(!song)throw new Error('Song not found in local catalog');
      return {
        songId:Number(song.id),
        songType:item?.songType||song.type,
        tone:String(item?.tone||'').trim()
      };
    });
    const {data,error}=await this.client.rpc('upsert_ministry_event',{
      target_event:event?.id||null,
      target_ministry:this.ministryId,
      new_event_type:event?.type||'service',
      new_event_date:event?.date||null,
      new_event_time:event?.time||null,
      new_rehearsal_at:event?.rehearsal||null,
      new_title:String(event?.title||'').trim(),
      new_leader:String(event?.leader||'').trim(),
      new_singers:String(event?.singers||'').trim(),
      new_notes:String(event?.notes||'').trim(),
      new_setlist:setlist
    });
    if(error)throw error;
    let assignmentsSynced=true,assignmentError='';
    if(Array.isArray(event?.assignments)){
      try{await this.saveEventAssignments(data,event.assignments)}
      catch(error){
        assignmentsSynced=false;
        assignmentError=error?.message||String(error);
        console.warn('[La Grey Cloud] event assignments not synced',error);
      }
    }
    return{id:data,assignmentsSynced,assignmentError};
  }

  async saveEventAssignments(eventId,assignments=[]){
    const payload=(Array.isArray(assignments)?assignments:[]).map(item=>({
      rosterMemberId:String(item?.rosterMemberId||'').trim(),
      musicRole:String(item?.musicRole||'').trim()
    })).filter(item=>item.rosterMemberId&&['voice','guitar','piano','bass','drums'].includes(item.musicRole));
    const {error}=await this.client.rpc('set_ministry_event_assignments',{
      target_event:eventId,
      new_assignments:payload
    });
    if(error)throw error;
    return true;
  }

  async deleteEvent(eventId){
    const {error}=await this.client.rpc('delete_ministry_event',{target_event:eventId});
    if(error)throw error;
    return true;
  }

  async getFavorites(){
    const rows=this._ok(await this.client.from('user_favorites').select('song_id,song_type,created_at').eq('user_id',this.userId).order('created_at',{ascending:true}))||[];
    return rows.map(row=>({songId:Number(row.song_id),songType:row.song_type,createdAt:row.created_at})).filter(row=>Number.isFinite(row.songId));
  }

  async addFavorite(songId){
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const row={user_id:this.userId,song_id:Number(song.id),song_type:song.type};
    this._ok(await this.client.from('user_favorites').upsert(row,{onConflict:'user_id,song_id',ignoreDuplicates:true}));
    return row;
  }

  async removeFavorite(songId){
    this._ok(await this.client.from('user_favorites').delete().eq('user_id',this.userId).eq('song_id',Number(songId)));
    return true;
  }

  async getPreferences(){
    const result=await this.client.from('user_preferences').select('preferred_instrument,notation,font_size,autoscroll_speed,language,updated_at').eq('user_id',this.userId).maybeSingle();
    if(result?.error)throw result.error;
    return result?.data||null;
  }

  async savePreferences(patch={}){
    const row={user_id:this.userId};
    if(['guitar','piano','voice','bass','drums','all','none'].includes(patch.preferredInstrument))row.preferred_instrument=patch.preferredInstrument;
    if(['american','latin'].includes(patch.notation))row.notation=patch.notation;
    if(Number.isInteger(Number(patch.fontSize))&&Number(patch.fontSize)>=8&&Number(patch.fontSize)<=30)row.font_size=Number(patch.fontSize);
    if(Number.isInteger(Number(patch.autoscrollSpeed))&&Number(patch.autoscrollSpeed)>=1&&Number(patch.autoscrollSpeed)<=100)row.autoscroll_speed=Number(patch.autoscrollSpeed);
    if(['es','en'].includes(patch.language))row.language=patch.language;
    if(Object.keys(row).length===1)return this.getPreferences();
    const data=this._ok(await this.client.from('user_preferences').upsert(row,{onConflict:'user_id'}).select().single());
    return data||null;
  }

  async getLearningProgress(trackId){
    const cleanTrack=String(trackId||'').trim();
    if(!cleanTrack)throw new Error('Track id is required');
    const rows=this._ok(await this.client.from('user_learning_progress').select('item_id,completed_at').eq('user_id',this.userId).eq('track_id',cleanTrack).order('completed_at',{ascending:true}))||[];
    return rows.map(row=>({itemId:row.item_id,completedAt:row.completed_at}));
  }

  async setLearningItemCompleted(trackId,itemId,completed=true){
    const cleanTrack=String(trackId||'').trim(),cleanItem=String(itemId||'').trim();
    if(!cleanTrack||!cleanItem)throw new Error('Track and item ids are required');
    if(completed){
      const row={user_id:this.userId,track_id:cleanTrack,item_id:cleanItem};
      this._ok(await this.client.from('user_learning_progress').upsert(row,{onConflict:'user_id,track_id,item_id',ignoreDuplicates:true}));
      return true;
    }
    this._ok(await this.client.from('user_learning_progress').delete().eq('user_id',this.userId).eq('track_id',cleanTrack).eq('item_id',cleanItem));
    return false;
  }

  async getPersonalSongNote(songId){
    const result=await this.client.from('user_song_notes').select('body,updated_at').eq('user_id',this.userId).eq('song_id',Number(songId)).maybeSingle();
    if(result?.error)throw result.error;
    return result?.data||null;
  }

  async savePersonalSongNote(songId,body){
    const song=songById(songId);
    if(!song)throw new Error('Song not found in local catalog');
    const clean=String(body||'');
    if(clean.length>10000)throw new Error('Personal note is too long');
    if(!clean.trim()){
      this._ok(await this.client.from('user_song_notes').delete().eq('user_id',this.userId).eq('song_id',Number(song.id)));
      return null;
    }
    const row={user_id:this.userId,song_id:Number(song.id),body:clean};
    return this._ok(await this.client.from('user_song_notes').upsert(row,{onConflict:'user_id,song_id'}).select('body,updated_at').single());
  }
}

function createGuestDataService(){return new GuestLocalAdapter()}
function createMinistryDataService(options){return new MinistryCloudAdapter(options)}

window.LAGREY_DATA={
  GuestLocalAdapter,
  MinistryCloudAdapter,
  createGuestDataService,
  createMinistryDataService
};
})();
