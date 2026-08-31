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
