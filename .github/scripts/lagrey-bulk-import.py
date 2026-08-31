#!/usr/bin/env python3
import os, re, json, sys, hashlib, tempfile, zipfile, sqlite3, subprocess, urllib.request, unicodedata
from pathlib import Path

EXPECTED_XAPK_SHA256='c705694439047ddc3226f52cd010392166e72b2b4eb016d2ee533712c0a5bc4a'
DOWNLOAD_URL='https://d.apkpure.com/b/XAPK/com.ncrdesarrollo.cancionerocristiano?version=latest'
PACKAGE_APK='com.ncrdesarrollo.cancionerocristiano.apk'
DB_PATH='assets/databases/Cancionero041.db'
SELECTED=[
 ('Alex Campos','Alex Campos'),('Annette Moreno','Annette Moreno'),('Blest','Blest'),('Danilo Montero','Danilo Montero'),('Doulos','Doulos'),
 ('Elevation Worship','Elevation Worship'),('Evan Craft','Evan Craft'),('Generación 12','Generación 12'),('Hillsong','Hillsong'),('Ingrid Rosario','Ingrid Rosario'),
 ('Jaime Murrell','Jaime Murrell'),('Jesús Adrián Romero','Jesús Adrián Romero'),('Jonathan & Sarah Jerez','Jonathan & Sarah Jerez'),('La IBI','La IBI'),('Living','Living'),
 ('Majo y Dan','Majo y Dan'),('Marcela Gándara','Marcela Gándara'),('Marco Barrientos','Marco Barrientos'),('Marcos Brunet','Marcos Brunet'),('Marcos Witt','Marcos Witt'),
 ('Para su Gloria','Para Su Gloria'),('Roberto Orellana','Roberto Orellana'),('Rojo','Rojo'),('Samuel Adrián','Samuel Adrián'),('Satelite','Satélite'),
 ('Tercer Cielo','Tercer Cielo'),('Twice','Twice'),('Un Corazón','Un Corazón'),('Veinte veinte','Veinte Veinte'),('Sarai Rivera','Sarai Rivera'),
 ('Gadiel Espinoza','Gadiel Espinoza'),('En Espiritu y en Verdad','En Espíritu y en Verdad')]

def fail(msg): raise RuntimeError(msg)
def run(*args, check=True):
    p=subprocess.run(args,text=True,capture_output=True)
    if check and p.returncode: fail(f"Comando falló: {' '.join(args)}\n{p.stderr or p.stdout}")
    return p.stdout.strip()
def norm(s):
    s=unicodedata.normalize('NFD',str(s or ''))
    s=''.join(c for c in s if unicodedata.category(c)!='Mn').lower().replace('&',' y ')
    s=re.sub(r'[^a-z0-9]+',' ',s)
    return ' '.join(s.split())
def artist_key(s):
    n=norm(s)
    aliases={'adoracion la ibi':'la ibi','de la ibi':'la ibi','la ibi':'la ibi','hillsong en espanol':'hillsong','hillsong':'hillsong','en espiritu y en verdad':'en espiritu y en verdad','satelite':'satelite','veinte veinte':'veinte veinte','para su gloria':'para su gloria'}
    return aliases.get(n,n)
def sha256_file(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
def download_xapk(dest):
    req=urllib.request.Request(DOWNLOAD_URL,headers={'User-Agent':'Mozilla/5.0 LaGreyImporter/1.0','Accept':'application/octet-stream,*/*'})
    with urllib.request.urlopen(req,timeout=120) as r, open(dest,'wb') as out:
        while True:
            b=r.read(1024*1024)
            if not b: break
            out.write(b)
    got=sha256_file(dest)
    if got!=EXPECTED_XAPK_SHA256: fail(f'XAPK SHA-256 inesperado: {got}; esperado {EXPECTED_XAPK_SHA256}.')

def load_existing_songs():
    js="global.window={};require('./songs.js');process.stdout.write(JSON.stringify(window.LAGREY_SONGS));"
    out=run('node','-e',js); data=json.loads(out)
    if not isinstance(data,list): fail('songs.js no produjo un array.')
    return data

def sectionish(text):
    t=text.strip().strip(':').strip().strip('()[]').upper()
    return bool(re.match(r'^(INTRO|VERSO|ESTROFA|CORO|REFR|PUENTE|SOLO|PRE.?CORO|FINAL|OUTRO|INTERLUDIO)(?:\s*\d+)?$',t))

def convert_lam_content(text):
    text=(text or '').replace('\r\n','\n').replace('\r','\n'); out=[]; brace=re.compile(r'\{([^{}]*)\}')
    for raw in text.split('\n'):
        line=raw.rstrip(); ms=list(brace.finditer(line))
        if not ms: out.append(line); continue
        outside=brace.sub('',line)
        if outside.strip()=='': out.append(brace.sub(lambda m:m.group(1),line).rstrip()); continue
        if sectionish(outside):
            label=outside.strip(); out.append(label); chords=' '.join(m.group(1).strip() for m in ms if m.group(1).strip())
            if chords: out.append(chords)
            continue
        lyric_parts=[]; chord_at=[]; src=0; col=0
        for m in ms:
            before=line[src:m.start()]; lyric_parts.append(before); col+=len(before); chord=m.group(1).strip()
            if chord: chord_at.append((col,chord))
            src=m.end()
        tail=line[src:]; lyric_parts.append(tail); lyric=''.join(lyric_parts).rstrip()
        if chord_at:
            chars=[]
            for pos,ch in chord_at:
                if len(chars)<pos: chars.extend(' '*(pos-len(chars)))
                if chars and len(chars)>pos and chars[pos-1]!=' ': chars.append(' ')
                cur=len(chars)
                if cur<pos: chars.extend(' '*(pos-cur))
                chars.extend(ch)
            out.append(''.join(chars).rstrip())
        out.append(lyric)
    cleaned=[]; blanks=0
    for line in out:
        if line.strip()=='':
            blanks+=1
            if blanks<=2: cleaned.append('')
        else: blanks=0; cleaned.append(line.rstrip())
    return '\n'.join(cleaned).strip()

def main():
    dry=os.environ.get('LAGREY_BULK_DRY_RUN','true').lower()=='true'; base=run('git','rev-parse','HEAD'); existing=load_existing_songs()
    ids=[int(x.get('id')) for x in existing]
    if len(ids)!=len(set(ids)) or any(i<=0 for i in ids): fail('IDs existentes inválidos/duplicados.')
    before_bytes=Path('songs.js').read_bytes(); old=before_bytes.decode('utf-8')
    if not old.startswith('window.LAGREY_SONGS = [') or not old.rstrip().endswith('];'): fail('songs.js no es canónico.')
    with tempfile.TemporaryDirectory() as td:
        xapk=Path(td)/'source.xapk'; download_xapk(xapk)
        with zipfile.ZipFile(xapk) as z:
            if PACKAGE_APK not in z.namelist(): fail(f'Falta {PACKAGE_APK} en XAPK.')
            apk=Path(td)/PACKAGE_APK; apk.write_bytes(z.read(PACKAGE_APK))
        with zipfile.ZipFile(apk) as z:
            if DB_PATH not in z.namelist(): fail(f'Falta {DB_PATH} en APK.')
            db=Path(td)/'Cancionero041.db'; db.write_bytes(z.read(DB_PATH))
        con=sqlite3.connect(db); con.row_factory=sqlite3.Row; total=con.execute('select count(*) from Canciones').fetchone()[0]
        if total<8500: fail(f'Base inesperadamente pequeña: {total} canciones.')
        actual_to_display=dict(SELECTED); q=','.join('?'*len(actual_to_display))
        rows=con.execute(f'SELECT id,titulo,artista,cancion,tipo_acordes FROM Canciones WHERE artista IN ({q}) ORDER BY artista COLLATE NOCASE,titulo COLLATE NOCASE,id',tuple(actual_to_display)).fetchall()
        counts={a:0 for a in actual_to_display}
        for r in rows: counts[r['artista']]+=1
        missing=[a for a,n in counts.items() if n==0]
        if missing: fail('Artistas sin coincidencias en DB: '+', '.join(missing))
    existing_keys={(norm(x.get('title')),artist_key(x.get('artist'))) for x in existing if x.get('type')=='cantos'}
    seen=set(existing_keys); new=[]; source_dups=0; existing_dups=0; used_ids=set(ids); low_cursor=10; high_cursor=max([i for i in used_ids if i>=10000] or [9999])+1
    def allocate_song_id():
        nonlocal low_cursor,high_cursor
        while low_cursor<=999 and low_cursor in used_ids: low_cursor+=1
        if low_cursor<=999: v=low_cursor; low_cursor+=1
        else:
            while high_cursor in used_ids: high_cursor+=1
            v=high_cursor; high_cursor+=1
        used_ids.add(v); return v
    for r in rows:
        title=str(r['titulo'] or '').strip(); source_artist=str(r['artista'] or '').strip(); display_artist=actual_to_display[source_artist]; content=convert_lam_content(r['cancion'])
        if not title or not content: continue
        key=(norm(title),artist_key(display_artist))
        if key in seen:
            if key in existing_keys: existing_dups+=1
            else: source_dups+=1
            continue
        seen.add(key); new.append({'id':allocate_song_id(),'title':title,'artist':display_artist,'type':'cantos','tone':'','content':content})
    if len(rows)!=2784: fail(f'Conteo fuente cambió: {len(rows)}; esperado 2784 para esta XAPK verificada.')
    if len(new)<2700: fail(f'Demasiados descartes: solo {len(new)} canciones nuevas.')
    obj_text=[]
    for x in new:
        lines=['  {',f'    "id": {x["id"]},',f'    "title": {json.dumps(x["title"],ensure_ascii=False)},',f'    "artist": {json.dumps(x["artist"],ensure_ascii=False)},','    "type": "cantos",','    "tone": "",',f'    "content": {json.dumps(x["content"],ensure_ascii=False)}','  }']; obj_text.append('\n'.join(lines))
    m=re.search(r'\n\];\s*$',old)
    if not m: fail('No se encontró cierre final de songs.js.')
    next_text=old[:m.start()]+(',\n' if new else '')+',\n'.join(obj_text)+old[m.start():]
    tmp=Path(os.environ.get('RUNNER_TEMP','/tmp'))/'songs.bulk.candidate.js'; tmp.write_text(next_text,encoding='utf-8'); run('node','--check',str(tmp))
    new_json=run('node','-e',f"global.window={{}};require({json.dumps(str(tmp))});process.stdout.write(JSON.stringify(window.LAGREY_SONGS));"); final=json.loads(new_json)
    if final[:len(existing)]!=existing: fail('Algún canto previo cambió durante la importación.')
    if len(final)!=len(existing)+len(new): fail('Conteo final inconsistente.')
    all_ids=[int(x['id']) for x in final]
    if len(all_ids)!=len(set(all_ids)): fail('IDs de cantos duplicados.')
    if any(1000<=i<10000 for i in all_ids): fail('Un canto invadió el rango reservado de himnos 1000-9999.')
    rt=Path(os.environ.get('RUNNER_TEMP','/tmp')); (rt/'lagrey-base.txt').write_text(base+'\n')
    result=(f'Fuente verificada SHA256 {EXPECTED_XAPK_SHA256} | {len(rows)} candidatas de 32 artistas | {len(new)} nuevas | {existing_dups} ya existentes preservadas | {source_dups} duplicadas internas omitidas | Cantos {len(existing)} -> {len(final)} | bytes {len(before_bytes)} -> {len(next_text.encode("utf-8"))}')
    (rt/'lagrey-message.txt').write_text(f'Importar {len(new)} cantos de 32 artistas desde L.A.M 1.26.7\n',encoding='utf-8')
    Path('songs.js').write_text(next_text,encoding='utf-8')
    sw=Path('sw.js').read_text(encoding='utf-8'); mm=list(re.finditer(r"const CACHE\s*=\s*(['\"])([^'\"]+)\1\s*;",sw))
    if len(mm)!=1: fail('sw.js debe contener exactamente un const CACHE.')
    cm=mm[0]; old_cache=cm.group(2); vm=re.match(r'^la-grey-v3-(\d+)(?:-|$)',old_cache)
    if not vm: fail('CACHE fuera de formato.')
    new_cache=f'la-grey-v3-{int(vm.group(1))+1}-bulk-artists-32'; value_start=cm.start()+cm.group(0).index(old_cache); sw2=sw[:value_start]+new_cache+sw[value_start+len(old_cache):]
    Path('sw.js').write_text(sw2,encoding='utf-8'); run('node','--check','sw.js'); result+=f' | CACHE {old_cache} -> {new_cache}'; (rt/'lagrey-result.txt').write_text(result+'\n',encoding='utf-8')
    env=os.environ.get('GITHUB_ENV')
    if env:
        with open(env,'a') as f: f.write(f'LAGREY_DRY_RUN={"true" if dry else "false"}\n')
    print(result)

if __name__=='__main__':
    try: main()
    except Exception as e: print(f'ERROR: {e}',file=sys.stderr); sys.exit(1)
