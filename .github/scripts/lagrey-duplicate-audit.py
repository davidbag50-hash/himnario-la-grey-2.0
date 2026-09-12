#!/usr/bin/env python3
import re,sys,tempfile,zipfile,sqlite3,importlib.util,difflib
from pathlib import Path

spec=importlib.util.spec_from_file_location('full',Path('.github/scripts/lagrey-full-catalog.py'))
full=importlib.util.module_from_spec(spec);spec.loader.exec_module(full)
bulk=full.bulk

def norm_content(s):
    s=str(s or '').replace('\r\n','\n').replace('\r','\n')
    lines=[' '.join(x.split()) for x in s.split('\n')]
    return '\n'.join(x for x in lines if x).strip().lower()

def lyricish(s):
    out=[]
    for line in str(s or '').splitlines():
        t=' '.join(line.split()).strip()
        if not t: continue
        # Quita líneas que parecen ser solo acordes/separadores para comparar la letra/arreglo textual.
        if full.chordline(t): continue
        t=re.sub(r'^[\[\](){}\-–—:;,.\s]+|[\[\](){}\-–—:;,.\s]+$','',t)
        if t: out.append(t.lower())
    return '\n'.join(out)

def ratio(a,b):
    return difflib.SequenceMatcher(None,a,b,autojunk=False).ratio()

def main():
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
    groups={}
    for r in rows:
        title=str(r['titulo'] or '').strip(); source_artist=str(r['artista'] or '').strip(); artist=display_map.get(source_artist,source_artist)
        if not title or not artist: continue
        key=(bulk.norm(title),bulk.artist_key(artist))
        groups.setdefault(key,[]).append((r,title,artist))

    dup_groups=[v for v in groups.values() if len(v)>1]
    extras=sum(len(v)-1 for v in dup_groups)
    if extras!=41: raise RuntimeError(f'Se esperaban 41 entradas extra duplicadas; aparecieron {extras}')

    exact=[];near=[];variants=[]
    for items in dup_groups:
        base_r,title,artist=items[0]
        base=full.prepared(base_r['cancion'],base_r['tipo_acordes'])
        bn=norm_content(base); bl=lyricish(base); bt=full.infer_tone(base_r['cancion']) or full.MANUAL_TONES.get(int(base_r['id'])) or '?'
        for r,_,_ in items[1:]:
            cur=full.prepared(r['cancion'],r['tipo_acordes'])
            cn=norm_content(cur); cl=lyricish(cur); ct=full.infer_tone(r['cancion']) or full.MANUAL_TONES.get(int(r['id'])) or '?'
            cr=ratio(bn,cn); lr=ratio(bl,cl) if bl or cl else cr
            rec={'title':title,'artist':artist,'a':int(base_r['id']),'b':int(r['id']),'tone_a':bt,'tone_b':ct,'content_ratio':cr,'lyric_ratio':lr,'len_a':len(bn),'len_b':len(cn)}
            if bn==cn: exact.append(rec)
            elif cr>=0.985 and lr>=0.99 and bt==ct: near.append(rec)
            else: variants.append(rec)

    def row(r):
        return f"| {r['title'].replace('|','/')} | {r['artist'].replace('|','/')} | {r['a']} / {r['b']} | {r['tone_a']} / {r['tone_b']} | {r['content_ratio']:.3f} | {r['lyric_ratio']:.3f} |"

    report=[]
    report.append('## Auditoría de las 41 coincidencias título + artista')
    report.append('')
    report.append(f'Fuente verificada: `{bulk.EXPECTED_XAPK_SHA256}`. Se encontraron **{len(dup_groups)} grupos** con **{extras} entradas extra**.')
    report.append('')
    report.append(f'- Exactamente iguales tras normalizar espacios/formato: **{len(exact)}**')
    report.append(f'- Casi iguales (>=98.5% contenido, >=99% letra, mismo tono): **{len(near)}**')
    report.append(f'- Requieren revisión porque pueden ser versiones/arreglos distintos: **{len(variants)}**')
    report.append('')
    if variants:
        report.append('### Posibles versiones distintas — NO borrar ni fusionar automáticamente')
        report.append('')
        report.append('| Título | Artista | IDs fuente | Tonos | Sim. contenido | Sim. letra |')
        report.append('|---|---|---:|---|---:|---:|')
        report.extend(row(r) for r in variants)
        report.append('')
    if near:
        report.append('### Casi iguales — conservar por ahora')
        report.append('')
        report.append('| Título | Artista | IDs fuente | Tonos | Sim. contenido | Sim. letra |')
        report.append('|---|---|---:|---|---:|---:|')
        report.extend(row(r) for r in near)
        report.append('')
    report.append('### Criterio')
    report.append('Esta auditoría no modifica `songs.js`, no cambia IDs y no elimina ninguna entrada. Mismo título con artista diferente nunca se trata como duplicado. Incluso con mismo título y artista, cualquier diferencia significativa queda marcada para revisión humana.')
    p=Path('/tmp/lagrey-duplicate-audit.md');p.write_text('\n'.join(report)+'\n',encoding='utf-8')
    print(f'grupos={len(dup_groups)} extras={extras} exactas={len(exact)} casi={len(near)} posibles_versiones={len(variants)}')

if __name__=='__main__':
    try: main()
    except Exception as e:
        print('ERROR:',e,file=sys.stderr);sys.exit(1)
