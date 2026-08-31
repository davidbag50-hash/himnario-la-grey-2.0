#!/usr/bin/env python3
import os,re,json,sys,tempfile,zipfile,sqlite3,subprocess,importlib.util,base64,binascii,html,collections
from pathlib import Path

# Reutiliza únicamente la fuente verificada y las reglas de nombres del importador actual.
spec=importlib.util.spec_from_file_location('bulk',Path(__file__).with_name('lagrey-bulk-import.py'))
bulk=importlib.util.module_from_spec(spec);spec.loader.exec_module(bulk)
NOTE_PC={'C':0,'B#':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,'E#':5,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11,'Cb':11}
PC_SHARP=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];PC_FLAT=['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
LAT={'DO':'C','RE':'D','MI':'E','FA':'F','SOL':'G','LA':'A','SI':'B'}
ROOT=r'(?:SOL|DO|RE|MI|FA|LA|SI|[A-G])(?:#|b)?'
CHORD=re.compile(rf'(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])({ROOT})(m|maj|dim|aug|sus|add)?(?:\d+)?(?:\([^)]*\))?(?:/({ROOT}))?',re.I)
LATROOT=re.compile(r'(?<![A-Za-zÁÉÍÓÚáéíóúÑñ])(SOL|DO|RE|MI|FA|LA|SI)([#b]?)(?=(?:m|M|maj|sus|dim|aug|add|\+|-|\d|/|\s|[,.;:)\]}]|$))',re.I)
def fail(m):raise RuntimeError(m)
def run(*a):
 p=subprocess.run(a,text=True,capture_output=True)
 if p.returncode:fail(p.stderr or p.stdout)
 return p.stdout.strip()
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
def tone(src):
 gs=groups(src)
 if not gs:fail('Sin acordes utilizables para determinar tono.')
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
def render(o):return json.dumps(o,ensure_ascii=False,indent=2).replace('\n','\n  ')
def rewrite(text,updates):
 rs=[];depth=0;inside=False;esc=False;start=None;arr=text.find('[')
 for i in range(arr+1,len(text)):
  ch=text[i]
  if inside:
   if esc:esc=False
   elif ch=='\\':esc=True
   elif ch=='"':inside=False
   continue
  if ch=='"':inside=True
  elif ch=='{':
   if depth==0:start=i
   depth+=1
  elif ch=='}' and depth:
   depth-=1
   if depth==0:
    b=text[start:i+1];m=re.search(r'"id"\s*:\s*(\d+)',b)
    if m and int(m.group(1)) in updates:
     o=json.loads(b);u=updates[int(m.group(1))];o['tone']=u['tone'];o['content']=u['content'];rs.append((start,i+1,render(o)))
    start=None
 if len(rs)!=len(updates):fail(f'Localizados {len(rs)} de {len(updates)} objetos.')
 for a,b,v in reversed(rs):text=text[:a]+v+text[b:]
 return text
def main():
 base=run('git','rev-parse','HEAD');old=Path('songs.js').read_text(encoding='utf-8');songs=json.loads(run('node','-e',"global.window={};require('./songs.js');process.stdout.write(JSON.stringify(window.LAGREY_SONGS));"))
 with tempfile.TemporaryDirectory() as td:
  x=Path(td)/'s.xapk';bulk.download_xapk(x)
  with zipfile.ZipFile(x) as z:a=Path(td)/bulk.PACKAGE_APK;a.write_bytes(z.read(bulk.PACKAGE_APK))
  with zipfile.ZipFile(a) as z:d=Path(td)/'db';d.write_bytes(z.read(bulk.DB_PATH))
  con=sqlite3.connect(d);con.row_factory=sqlite3.Row;mp=dict(bulk.SELECTED);qs=','.join('?'*len(mp));rows=con.execute(f'SELECT id,titulo,artista,cancion,tipo_acordes FROM Canciones WHERE artista IN ({qs}) ORDER BY artista COLLATE NOCASE,titulo COLLATE NOCASE,id',tuple(mp)).fetchall()
 if len(rows)!=2784:fail(f'Fuente inesperada: {len(rows)}')
 source={};dups=0;decoded=0
 for r in rows:
  title=str(r['titulo'] or '').strip();artist=mp[r['artista']];key=(bulk.norm(title),bulk.artist_key(artist))
  if key in source:dups+=1;continue
  _,was=decode_text(r['cancion']);decoded+=int(was);source[key]={'tone':tone(r['cancion']),'content':prepared(r['cancion'],r['tipo_acordes'])}
 if len(source)!=2778 or dups!=6:fail(f'Deduplicación inesperada {len(source)}/{dups}')
 bykey={}
 for s in songs:
  if s.get('type')!='cantos':continue
  k=(bulk.norm(s.get('title')),bulk.artist_key(s.get('artist')))
  if k in bykey:fail(f'Clave ambigua {k}')
  bykey[k]=s
 updates={};preserved=0;crepairs=0
 for k,src in source.items():
  s=bykey.get(k)
  if not s:fail(f'Falta canto importado: {k}')
  if str(s.get('tone') or '').strip():preserved+=1;continue
  updates[int(s['id'])]=src;crepairs+=int(s.get('content')!=src['content'])
 if len(updates)!=2770 or preserved!=8:fail(f'Conteos inesperados: reparar={len(updates)}, preservar={preserved}')
 nxt=rewrite(old,updates);Path('songs.js').write_text(nxt,encoding='utf-8');run('node','--check','songs.js')
 final=json.loads(run('node','-e',"global.window={};require('./songs.js');process.stdout.write(JSON.stringify(window.LAGREY_SONGS));"));blanks=[s['id'] for s in final if s.get('type')=='cantos' and not str(s.get('tone') or '').strip()]
 if blanks:fail(f'Quedan {len(blanks)} tonos vacíos')
 sw=Path('sw.js').read_text();m=re.search(r"const CACHE\s*=\s*(['\"])([^'\"]+)\1\s*;",sw);oldc=m.group(2);vm=re.match(r'la-grey-v3-(\d+)',oldc);newc=f'la-grey-v3-{int(vm.group(1))+1}-bulk-song-tones';p=m.start()+m.group(0).index(oldc);Path('sw.js').write_text(sw[:p]+newc+sw[p+len(oldc):]);run('node','--check','sw.js')
 rt=Path(os.environ['RUNNER_TEMP']);(rt/'lagrey-base.txt').write_text(base+'\n');(rt/'lagrey-message.txt').write_text('Completar tonos de cantos importados desde L.A.M 1.26.7\n');(rt/'lagrey-result.txt').write_text(f'{len(updates)} tonos completados | {crepairs} contenidos normalizados | Base64 recuperados {decoded} | cantos sin tono 0 | CACHE {oldc} -> {newc}\n')
 print((rt/'lagrey-result.txt').read_text().strip())
if __name__=='__main__':
 try:main()
 except Exception as e:print('ERROR:',e,file=sys.stderr);sys.exit(1)
