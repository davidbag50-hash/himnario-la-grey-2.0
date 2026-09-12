#!/usr/bin/env python3
import re,sys,tempfile,zipfile,sqlite3,importlib.util,difflib
from pathlib import Path

spec=importlib.util.spec_from_file_location('full',Path('.github/scripts/lagrey-full-catalog.py'))
full=importlib.util.module_from_spec(spec);spec.loader.exec_module(full)
bulk=full.bulk

PRE_FULL_COUNT=2779
EXPECTED_OLD_SOURCE_EXTRAS=6
EXPECTED_FULL_SOURCE_EXTRAS=41

def norm_content(s):
    s=str(s or '').replace('\r\n','\n').replace('\r','\n')
    lines=[' '.join(x.split()) for x in s.split('\n')]
    return '\n'.join(x for x in lines if x).strip().lower()

def lyricish(s):
    out=[]
    for line in str(s or '').splitlines():
        t=' '.join(line.split()).strip()
        if not t: continue
        if full.chordline(t): continue
        t=re.sub(r'^[\[\](){}\-–—:;,.\s]+|[\[\](){}\-–—:;,.\s]+$','',t)
        if t: out.append(t.lower())
    return '\n'.join(out)

def ratio(a,b):
    return difflib.SequenceMatcher(None,a,b,autojunk=False).ratio()

def source_key(r,display_map):
    title=str(r['titulo'] or '').strip()
    source_artist=str(r['artista'] or '').strip()
    artist=display_map.get(source_artist,source_artist)
    return (bulk.norm(title),bulk.artist_key(artist)),title,artist

def compare_pair(base_r,other_r,title,artist,origin):
    base=full.prepared(base_r['cancion'],base_r['tipo_acordes'])
    cur=full.prepared(other_r['cancion'],other_r['tipo_acordes'])
    bn=norm_content(base);cn=norm_content(cur)
    bl=lyricish(base);cl=lyricish(cur)
    bt=full.infer_tone(base_r['cancion']) or full.MANUAL_TONES.get(int(base_r['id'])) or '?'
    ct=full.infer_tone(other_r['cancion']) or full.MANUAL_TONES.get(int(other_r['id'])) or '?'
    cr=ratio(bn,cn);lr=ratio(bl,cl) if bl or cl else cr
    return {
        'title':title,'artist':artist,'a':int(base_r['id']),'b':int(other_r['id']),
        'tone_a':bt,'tone_b':ct,'content_ratio':cr,'lyric_ratio':lr,
        'len_a':len(bn),'len_b':len(cn),'origin':origin,
        'exact':bn==cn
    }

def main():
    # Reconstruye exactamente la frontera anterior a la importación completa.
    catalog=[x for x in bulk.load_existing_songs() if x.get('type')=='cantos']
    if len(catalog)!=8531:
        raise RuntimeError(f'Catálogo actual inesperado: {len(catalog)} cantos; se esperaban 8531.')
    pre=catalog[:PRE_FULL_COUNT]
    existing_keys={(bulk.norm(x.get('title')),bulk.artist_key(x.get('artist'))) for x in pre}
    if len(existing_keys)!=PRE_FULL_COUNT:
        raise RuntimeError('La base anterior a la importación completa tiene claves título/artista ambiguas.')

    with tempfile.TemporaryDirectory() as td:
        x=Path(td)/'source.xapk';bulk.download_xapk(x)
        with zipfile.ZipFile(x) as z:
            apk=Path(td)/bulk.PACKAGE_APK;apk.write_bytes(z.read(bulk.PACKAGE_APK))
        with zipfile.ZipFile(apk) as z:
            db=Path(td)/'db.sqlite';db.write_bytes(z.read(bulk.DB_PATH))
        con=sqlite3.connect(db);con.row_factory=sqlite3.Row
        rows=con.execute('SELECT id,titulo,artista,cancion,tipo_acordes FROM Canciones ORDER BY artista COLLATE NOCASE,titulo COLLATE NOCASE,id').fetchall()
    if len(rows)!=8577: raise RuntimeError(f'Fuente inesperada: {len(rows)} filas')

    display_map=dict(bulk.SELECTED)
    first_source={}
    old_extras=[]
    full_extras=[]
    for r in rows:
        key,title,artist=source_key(r,display_map)
        if not title or not artist: continue
        first=first_source.get(key)
        if first is None:
            first_source[key]=(r,title,artist)
            continue
        base_r,base_title,base_artist=first
        origin='32 artistas iniciales' if key in existing_keys else 'catálogo restante'
        rec=compare_pair(base_r,r,base_title,base_artist,origin)
        (old_extras if key in existing_keys else full_extras).append(rec)

    if len(old_extras)!=EXPECTED_OLD_SOURCE_EXTRAS or len(full_extras)!=EXPECTED_FULL_SOURCE_EXTRAS:
        raise RuntimeError(
            f'Conteos inesperados: colisiones antiguas={len(old_extras)} (esperadas 6), '
            f'colisiones del catálogo restante={len(full_extras)} (esperadas 41).'
        )

    all_recs=old_extras+full_extras
    exact=[];near=[];variants=[]
    for rec in all_recs:
        if rec['exact']:
            exact.append(rec)
        elif rec['content_ratio']>=0.985 and rec['lyric_ratio']>=0.99 and rec['tone_a']==rec['tone_b']:
            near.append(rec)
        else:
            variants.append(rec)

    def row(r):
        return (
            f"| {r['title'].replace('|','/')} | {r['artist'].replace('|','/')} | {r['origin']} | "
            f"{r['a']} / {r['b']} | {r['tone_a']} / {r['tone_b']} | "
            f"{r['content_ratio']:.3f} | {r['lyric_ratio']:.3f} |"
        )

    report=[]
    report.append('## Auditoría de colisiones título + artista en L.A.M 1.26.7')
    report.append('')
    report.append(f'Fuente verificada: `{bulk.EXPECTED_XAPK_SHA256}`.')
    report.append('')
    report.append(
        f'Se reprodujo la lógica histórica del importador: **{len(old_extras)}** entradas extra pertenecen '
        f'a los 32 artistas importados anteriormente y **{len(full_extras)}** son las 41 entradas extra '
        f'detectadas al completar el catálogo. Total auditado: **{len(all_recs)}**.'
    )
    report.append('')
    report.append(f'- Exactamente iguales tras normalizar espacios/formato: **{len(exact)}**')
    report.append(f'- Casi iguales (>=98.5% contenido, >=99% letra, mismo tono): **{len(near)}**')
    report.append(f'- Requieren revisión porque pueden ser versiones/arreglos distintos: **{len(variants)}**')
    report.append('')

    if variants:
        report.append('### Posibles versiones distintas — NO borrar ni fusionar automáticamente')
        report.append('')
        report.append('| Título | Artista | Origen | IDs fuente | Tonos | Sim. contenido | Sim. letra |')
        report.append('|---|---|---|---:|---|---:|---:|')
        report.extend(row(r) for r in variants)
        report.append('')
    if near:
        report.append('### Casi iguales — conservar por ahora')
        report.append('')
        report.append('| Título | Artista | Origen | IDs fuente | Tonos | Sim. contenido | Sim. letra |')
        report.append('|---|---|---|---:|---|---:|---:|')
        report.extend(row(r) for r in near)
        report.append('')
    if exact:
        report.append('### Idénticas tras normalización')
        report.append('')
        report.append('| Título | Artista | Origen | IDs fuente | Tonos | Sim. contenido | Sim. letra |')
        report.append('|---|---|---|---:|---|---:|---:|')
        report.extend(row(r) for r in exact)
        report.append('')

    report.append('### Criterio y seguridad')
    report.append(
        'Esta auditoría no modifica `songs.js`, no cambia IDs y no elimina ninguna entrada. '
        'Mismo título con artista diferente nunca se trata como duplicado. Incluso con mismo título y artista, '
        'cualquier diferencia significativa queda marcada para revisión humana antes de recuperar, fusionar o descartar una versión.'
    )
    p=Path('/tmp/lagrey-duplicate-audit.md');p.write_text('\n'.join(report)+'\n',encoding='utf-8')
    print(
        f'antiguas={len(old_extras)} catálogo_restante={len(full_extras)} total={len(all_recs)} '
        f'exactas={len(exact)} casi={len(near)} posibles_versiones={len(variants)}'
    )

if __name__=='__main__':
    try: main()
    except Exception as e:
        print('ERROR:',e,file=sys.stderr);sys.exit(1)
