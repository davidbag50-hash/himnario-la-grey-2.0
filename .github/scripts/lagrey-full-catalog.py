#!/usr/bin/env python3
import os,re,json,sys,tempfile,zipfile,sqlite3,subprocess,importlib.util,base64,binascii,html,collections
from pathlib import Path

spec=importlib.util.spec_from_file_location('bulk',Path('.github/scripts/lagrey-bulk-import.py'))
bulk=importlib.util.module_from_spec(spec);spec.loader.exec_module(bulk)

NOTE_PC={'C':0,'B#':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,'E#':5,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11,'Cb':11}
PC_SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];PC_FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
LAT={'DO':'C','RE':'D','MI':'E','FA':'F','SOL':'G','LA':'A','SI':'B'}
ROOT=r'(?:SOL|DO|RE|MI|FA|LA|SI|[A-G])(?:#|b)?'
CHORD=re.compile(rf'(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])({ROOT})(m|maj|dim|aug|sus|add)?(?:\d+)?(?:\([^)]*\))?(?:/({ROOT}))?',re.I)
LATROOT=re.compile(r'(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])(SOL|DO|RE|MI|FA|LA|SI)([#b]?)(?=(?:m|M|maj|sus|dim|aug|add|\+|-|\d|/|\s|[,.;:)\]}]|$))',re.I)
MANUAL_TONES={5654:'A'} # Única entrada de la fuente que contiene solo tablatura de bajo, sin símbolos de acorde.

def fail(m): raise RuntimeError(m)
def run(*a):
    p=subprocess.run(a,text=True,capture_output=True)
    if p.returncode: fail(p.stderr or p.stdout)
    return p.stdout.strip()
def replace_once(src,old,new,label):
    if src.count(old)!=1: fail(f'{label}: se esperó exactamente 1 coincidencia y aparecieron {src.count(old)}.')
    return src.replace(old,new,1)
def decode_text(x):
    raw=str(x or '');c=''.join(raw.split());dec=False
    if len(c)>=40 and len(c)%4==0 and not re.search(r'[^A-Za-z0-9+/=]',c):
        try:
            y=base64.b64decode(c,validate=True).decode('utf-8');ratio=sum(ch.isprintable() or ch in '\r\n\t\x85' for ch in y)/max(1,len(y))
            if ratio>.98 and ('{' in y or '\n' in y):raw=y;dec=True
        except (ValueError,UnicodeDecodeError,binascii.Error):pass
    raw=html.unescape(raw).replace('\u00a0',' ').replace('\x85','\n');raw=re.sub(r'<br\s*/?>','\n',raw,flags=re.I);raw=re.sub(r'<[^>]+>','',raw)
    return ''.join(ch if ch in '\n\r\t' or ord(ch)>=32 else ' ' for ch in raw),dec
def parse(seg):
    out=[]
    for m in CHORD.finditer(seg or ''):
        t=m.group(1);acc=t[-1] if t.endswith(('#','b')) else '';b=t[:-1] if acc else t;u=b.upper();note=(LAT[u] if u in LAT else u)+acc;pc=NOTE_PC.get(note)
        if pc is None:continue
        q=(m.group(2) or '').lower();qual='min' if q=='m' else ('dim' if q=='dim' else ('aug' if q=='aug' else 'maj'));out.append((pc,qual,note))
    return out
def chordline(s):
    a=parse(s)
    if not a:return None
    rem=CHORD.sub('',s);rem=re.sub(r'[\s|,;:/\\()\[\]{}\-–—.+*xX\d]+','',rem)
    return a if not rem.strip() else None
def groups(src):
    text,_=decode_text(src);gs=[]
    for line in text.replace('\r\n','\n').replace('\r','\n').split('\n'):
        had=False;pos=0
        while True:
            i=line.find('{',pos)
            if i<0:break
            j=line.find('}',i+1);a=parse(line[i+1:(j if j>=0 else len(line))])
            if a:gs.append(a)
            had=True
            if j<0:break
            pos=j+1
        sq=[]
        for m in re.finditer(r'\[([^\]]+)\]',line):
            a=chordline(m.group(1));sq.extend(a or [])
        if sq:gs.append(sq);had=True
        if not had:
            a=chordline(line.strip())
            if a:gs.append(a)
    return gs
def expected(t,mode):
    d=[(0,'maj'),(2,'min'),(4,'min'),(5,'maj'),(7,'maj'),(9,'min'),(11,'dim')] if mode=='maj' else [(0,'min'),(2,'dim'),(3,'maj'),(5,'min'),(7,'min'),(8,'maj'),(10,'maj'),(7,'maj')]
    return {(t+i)%12:q for i,q in d}
def infer_tone(src):
    gs=groups(src)
    if not gs:return None
    cs=[c for g in gs for c in g];n=min(24,len(cs));early=cs[:n];ce=collections.Counter((p,q) for p,q,_ in early);ca=collections.Counter((p,q) for p,q,_ in cs)
    egs=[];used=0
    for g in gs:
        if used>=n:break
        egs.append(g);used+=len(g)
    starts=collections.Counter((g[0][0],g[0][1]) for g in egs);roots=[c[0] for c in early];pairs=collections.Counter(zip(roots,roots[1:]));scores=[]
    for t in range(12):
        for mode in ('maj','min'):
            ex=expected(t,mode);tq='maj' if mode=='maj' else 'min';s=0
            for (p,q),k in ce.items():s+=(4 if p in ex and ex[p]==q else 0 if p in ex else -2)*k
            for (p,q),k in ca.items():s+=(.2 if p in ex and ex[p]==q else 0 if p in ex else -.05)*k
            s+=3*starts.get((t,tq),0)+(20 if early[0][0]==t and early[0][1]==tq else 0)+2*pairs.get(((t+7)%12,t),0)+pairs.get(((t+5)%12,t),0);scores.append((s,t,mode))
    scores.sort(reverse=True);_,t,mode=scores[0];obs=[c[2] for c in early if c[0]==t] or [c[2] for c in cs if c[0]==t]
    root=collections.Counter(obs).most_common(1)[0][0] if obs else (PC_FLAT if sum('b' in c[2] for c in cs)>sum('#' in c[2] for c in cs) else PC_SHARP)[t]
    return root+('m' if mode=='min' else '')
def latinize_content(content):
    def rep(s):return LATROOT.sub(lambda m:LAT[m.group(1).upper()]+(m.group(2) or ''),s)
    out=[]
    for line in content.split('\n'):
        if chordline(line.strip()):out.append(rep(line));continue
        i=line.find('{');out.append(line[:i+1]+rep(line[i+1:]) if i>=0 else line)
    return '\n'.join(out)
def prepared(src,tipo):
    d,_=decode_text(src);c=bulk.convert_lam_content(d);return latinize_content(c) if int(tipo or 0)==1 else c

def main():
    base=run('git','rev-parse','HEAD');dry=os.environ.get('LAGREY_FULL_DRY_RUN','false').lower()=='true'
    existing=bulk.load_existing_songs();ids=[int(x.get('id')) for x in existing]
    if len(ids)!=len(set(ids)) or any(i<=0 for i in ids):fail('IDs existentes inválidos/duplicados.')
    existing_cantos=[x for x in existing if x.get('type')=='cantos']
    if len(existing_cantos)!=2779:fail(f'Base actual inesperada: {len(existing_cantos)} cantos; se esperaban 2779 antes de completar el catálogo.')
    if max(ids)!=11779:fail(f'ID máximo inesperado: {max(ids)}; se esperaba 11779.')
    old=Path('songs.js').read_text(encoding='utf-8')
    if not old.startswith('window.LAGREY_SONGS = [') or not old.rstrip().endswith('];'):fail('songs.js no es canónico.')

    with tempfile.TemporaryDirectory() as td:
        x=Path(td)/'source.xapk';bulk.download_xapk(x)
        with zipfile.ZipFile(x) as z:
            a=Path(td)/bulk.PACKAGE_APK;a.write_bytes(z.read(bulk.PACKAGE_APK))
        with zipfile.ZipFile(a) as z:
            d=Path(td)/'db';d.write_bytes(z.read(bulk.DB_PATH))
        con=sqlite3.connect(d);con.row_factory=sqlite3.Row
        rows=con.execute('SELECT id,titulo,artista,cancion,tipo_acordes FROM Canciones ORDER BY artista COLLATE NOCASE,titulo COLLATE NOCASE,id').fetchall()
    if len(rows)!=8577:fail(f'Fuente inesperada: {len(rows)} canciones; se esperaban 8577.')

    display_map=dict(bulk.SELECTED)
    existing_keys={(bulk.norm(x.get('title')),bulk.artist_key(x.get('artist'))) for x in existing_cantos}
    if len(existing_keys)!=len(existing_cantos):fail('El catálogo actual contiene claves título/artista ambiguas.')
    seen=set(existing_keys);new=[];existing_dups=0;source_dups=0;empty=0;manual=0;next_id=max(i for i in ids if i>=10000)+1
    for r in rows:
        title=str(r['titulo'] or '').strip();source_artist=str(r['artista'] or '').strip();artist=display_map.get(source_artist,source_artist);content=prepared(r['cancion'],r['tipo_acordes'])
        if not title or not artist or not content:empty+=1;continue
        key=(bulk.norm(title),bulk.artist_key(artist))
        if key in seen:
            if key in existing_keys:existing_dups+=1
            else:source_dups+=1
            continue
        t=infer_tone(r['cancion'])
        if not t:
            t=MANUAL_TONES.get(int(r['id']))
            if not t:fail(f'Sin tono determinable para fuente ID {r["id"]}: {title} — {artist}')
            manual+=1
        seen.add(key);new.append({'id':next_id,'title':title,'artist':artist,'type':'cantos','tone':t,'content':content});next_id+=1

    if len(new)!=5752 or source_dups!=41 or existing_dups!=2784 or empty!=0 or manual!=1:
        fail(f'Conteos inesperados: nuevas={len(new)}, fuente_dup={source_dups}, existentes={existing_dups}, vacías={empty}, tonos_manuales={manual}.')
    objs=[]
    for x in new:
        objs.append('  '+json.dumps(x,ensure_ascii=False,indent=2).replace('\n','\n  '))
    m=re.search(r'\n\];\s*$',old)
    if not m:fail('No se encontró cierre final de songs.js.')
    candidate=old[:m.start()]+',\n'+',\n'.join(objs)+old[m.start():]
    Path('songs.js').write_text(candidate,encoding='utf-8');run('node','--check','songs.js')

    final=bulk.load_existing_songs();fids=[int(x['id']) for x in final]
    if len(final)!=8531 or len(fids)!=len(set(fids)) or max(fids)!=17531:fail(f'Catálogo final inconsistente: {len(final)} elementos, max={max(fids)}.')
    if any(1000<=i<10000 for i in fids):fail('Un canto invadió el rango 1000-9999 reservado para himnos.')
    if any(not str(x.get('tone') or '').strip() for x in final):fail('Quedó algún canto sin tono.')
    if final[:len(existing)]!=existing:fail('Algún canto existente cambió durante la importación.')

    app=Path('app.js').read_text(encoding='utf-8')
    app=replace_once(app,"const canonicalArtist=a=>ARTIST_ALIAS.get(artistNorm(a))||null;","const canonicalArtist=a=>{const raw=String(a||'').trim();return raw?(ARTIST_ALIAS.get(artistNorm(raw))||raw):null};",'canonicalArtist')
    old_search="function searchSongs(){const q=$('q').value.trim().toLowerCase();if(!q){$('results').classList.add('hidden');$('results').innerHTML='';return}const found=songs.filter(s=>(s.title+' '+s.artist).toLowerCase().includes(q));$('results').classList.remove('hidden');$('results').innerHTML=found.map(s=>`<button class=\"song\" data-search-song=\"${s.id}\"><span><b>${esc(s.title)}</b><br><small class=\"muted\">${esc(s.artist)}</small></span><span class=\"tone\">${esc(displayTone(s.tone))}</span></button>`).join('');$('results').querySelectorAll('[data-search-song]').forEach(b=>b.onclick=()=>{songReturn={type:'home'};openSong(Number(b.dataset.searchSong))})}"
    new_search="function searchSongs(){const q=$('q').value.trim().toLowerCase();if(!q){$('results').classList.add('hidden');$('results').innerHTML='';return}const all=songs.filter(s=>(s.title+' '+s.artist).toLowerCase().includes(q)),found=all.slice(0,120);$('results').classList.remove('hidden');$('results').innerHTML=found.map(s=>`<button class=\"song\" data-search-song=\"${s.id}\"><span><b>${esc(s.title)}</b><br><small class=\"muted\">${esc(s.artist)}</small></span><span class=\"tone\">${esc(displayTone(s.tone))}</span></button>`).join('')+(all.length>found.length?`<p class=\"muted\">${appText('Mostrando los primeros 120 resultados. Escribe más para afinar la búsqueda.','Showing the first 120 results. Type more to refine the search.')}</p>`:'');$('results').querySelectorAll('[data-search-song]').forEach(b=>b.onclick=()=>{songReturn={type:'home'};openSong(Number(b.dataset.searchSong))})}"
    app=replace_once(app,old_search,new_search,'searchSongs')
    Path('app.js').write_text(app,encoding='utf-8');run('node','--check','app.js')

    index=Path('index.html').read_text(encoding='utf-8')
    index=replace_once(index,'<script src="songs.js"></script>','<script src="songs.js?v=full1"></script>','loader songs.js')
    index=replace_once(index,'<script src="app.js"></script>','<script src="app.js?v=full1"></script>','loader app.js')
    Path('index.html').write_text(index,encoding='utf-8')

    sw=Path('sw.js').read_text(encoding='utf-8');mm=re.search(r"const CACHE\s*=\s*(['\"])([^'\"]+)\1\s*;",sw)
    if not mm:fail('No se encontró CACHE en sw.js.')
    old_cache=mm.group(2);vm=re.match(r'^la-grey-v3-(\d+)',old_cache)
    if not vm:fail('CACHE fuera de formato.')
    new_cache=f'la-grey-v3-{int(vm.group(1))+1}-full-song-catalog';p=mm.start()+mm.group(0).index(old_cache)
    Path('sw.js').write_text(sw[:p]+new_cache+sw[p+len(old_cache):],encoding='utf-8');run('node','--check','sw.js')

    rt=Path(os.environ.get('RUNNER_TEMP','/tmp'));(rt/'lagrey-base.txt').write_text(base+'\n');(rt/'lagrey-message.txt').write_text(f'Completar catálogo L.A.M con {len(new)} cantos restantes\n',encoding='utf-8')
    result=f'Fuente verificada {bulk.EXPECTED_XAPK_SHA256} | 8577 filas | 5752 nuevas | 41 duplicadas internas omitidas | 2784 ya representadas | cantos 2779 -> 8531 | IDs nuevos 11780-17531 | 1 tono manual de tablatura | CACHE {old_cache} -> {new_cache}'
    (rt/'lagrey-result.txt').write_text(result+'\n',encoding='utf-8')
    if os.environ.get('GITHUB_ENV'):
        with open(os.environ['GITHUB_ENV'],'a') as f:f.write(f'LAGREY_FULL_DRY_RUN={"true" if dry else "false"}\n')
    print(result)

if __name__=='__main__':
    try:main()
    except Exception as e:print('ERROR:',e,file=sys.stderr);sys.exit(1)
