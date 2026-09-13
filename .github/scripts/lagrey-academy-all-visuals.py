from pathlib import Path
from html import escape

ROOT=Path(__file__).resolve().parents[2]
BASE=ROOT/'academy-videos'

classes={
 'mix':[
  ('Mezcla vocal','Coordinar registros sin empujar','La mezcla no es una voz nueva: es una coordinación progresiva al subir.'),
  ('Qué cambia al subir','Menos peso · vocal más eficiente · intensidad útil','La nota alta debe sentirse algo más ligera, no más pesada.'),
  ('Qué evitar','Pecho empujado · barbilla alta · volumen como única estrategia','Más fuerza no sustituye una buena coordinación.'),
  ('Ejercicio 1','NG / WOO · 1–3–5–8–5–3–1','Mantén el sonido pequeño y continuo. La voz 1 hará el patrón.'),
  ('Ejercicio 2','MUM · 1–2–3–4–5–4–3–2–1','Sube por semitonos solo mientras siga cómodo.'),
  ('Al repertorio','Lleva la facilidad a una frase que suba hacia el coro','Expresión sí; presión extra no.')],
 'passaggio':[
  ('Passaggio sin tensión','Coordina la transición. No conquistes la nota a la fuerza.','Grave → medio → agudo: la voz necesita reorganizarse.'),
  ('Zona de transición','Haz la nota más fácil, no más grande','Permite cambios graduales de peso, resonancia, vocal e intensidad.'),
  ('Qué evitar','Empujar · levantar barbilla · gritar · repetir tensión','Repetir una coordinación tensa también la entrena.'),
  ('Ejercicio 1','NG → A · 1–2–3–2–1','La voz 1 hará el patrón. Abre la vocal sin aumentar presión.'),
  ('Ejercicio 2','MUM / NO · 1–3–5–3–1','Sube un semitono solo si la repetición anterior fue cómoda.'),
  ('Seguridad vocal','Dolor · ardor · ronquera creciente · pérdida marcada de voz','Si aparece alguna de estas señales, detente.')],
 'dynamics':[
  ('Control dinámico','Suave, medio y firme sin perder coordinación','La dinámica crea contraste; el micrófono evita tener que cantar todo fuerte.'),
  ('Suave bien hecho','Menos intensidad, misma afinación','Suave no significa aire descontrolado ni sonido sin centro.'),
  ('Firme bien hecho','Más energía sin gritar','El sonido puede crecer sin endurecer cuello ni mandíbula.'),
  ('Ejercicio 1','MMM → MA · cinco notas','Primera vuelta suave; segunda a intensidad media.'),
  ('Ejercicio 2','Una nota: suave → medio → firme → medio → suave','La voz 1 demostrará el cambio de intensidad.'),
  ('Al repertorio','Verso 40–55% · pre-coro 55–70% · coro 65–80%','Son referencias musicales, no porcentajes físicos de esfuerzo.')],
 'intervals':[
  ('Afinación e intervalos','Escucha la distancia antes de cantar','Afinar también es anticipar la siguiente nota mentalmente.'),
  ('Entrada limpia','Llega directo, sin deslizar','Escucha primero; canta después.'),
  ('Saltos útiles','1→3 · 1→5 · 3→5 · 5→8','Aísla dos notas antes de volver a la frase completa.'),
  ('Ejercicio 1','1 → 3 → 1','La voz 1 hará el salto sin arrastrarse entre notas.'),
  ('Ejercicio 2','1 → 5 → 1','Mantén el volumen estable cuando el intervalo sea más grande.'),
  ('Al repertorio','Practica entradas después de silencio','Dos notas primero; luego recupera la frase real.')],
 'harmony':[
  ('Armonías','Escucha el acorde, no solo tu voz','Una armonía útil pertenece al acorde y cumple una función.'),
  ('Tríada mayor','Raíz · tercera · quinta','Aprende cada grado por separado antes de sostener una segunda voz.'),
  ('No vuelvas a la melodía','Mantén tu función mientras otra voz lleva la línea principal','Bajar el volumen puede ayudarte a escuchar el conjunto.'),
  ('Ejercicio 1','1 · 3 · 5','La voz 1 cantará los tres grados por separado.'),
  ('Ejercicio 2','1 ↔ 3','Alterna raíz y tercera sin deslizar.'),
  ('Arreglo de ministerio','Define dónde entra, sale y descansa cada voz','No toda frase necesita armonía.')],
 'endurance':[
  ('Resistencia vocal','Eficiencia + pausas + intensidad sostenible','Resistencia no significa aguantar dolor.'),
  ('Distribuye la carga','No cantes todo al máximo','Usa instrumentales y otras voces como espacios de recuperación.'),
  ('Monitoreo inteligente','No compitas con batería ni monitores','Si no te escuchas, corrige mezcla y posición antes de gritar.'),
  ('Ejercicio 1','Trino / humming suave','La voz 1 hará una demostración corta y cómoda.'),
  ('Ejercicio 2','Afinación media + frase real + humming descendente','Alterna trabajo y recuperación.'),
  ('Detente a tiempo','Dolor · ardor · ronquera creciente','Terminar parecido a como empezaste es una buena señal.')],
 'agility':[
  ('Agilidad y melismas','Primero lento; luego rápido','Cada nota debe existir claramente antes de acelerar.'),
  ('Pulso claro','La mandíbula no marca cada nota','La coordinación viene de precisión, no de golpes físicos.'),
  ('Tres limpias','Aumenta velocidad solo después de tres repeticiones claras','La velocidad se gana; no se adivina.'),
  ('Ejercicio 1','1–2–3–4–5–4–3–2–1','La voz 1 hará el patrón primero con control.'),
  ('Ejercicio 2','1–3–5–3–1','Usa una sola vocal y conserva ritmo y afinación.'),
  ('Al repertorio','Un adorno debe servir a la canción','Prepara también una versión sencilla de la frase.')],
 'setlist':[
  ('Preparar un setlist','Tono · carga · armonías · descansos','La preparación vocal empieza antes de cantar.'),
  ('Mapa de demanda','Marca la frase más exigente de cada canción','Evita descubrir en vivo que un tono queda demasiado alto.'),
  ('Orden inteligente','Distribuye canciones exigentes','Reserva energía para los momentos que realmente la necesitan.'),
  ('Ejercicio 1','Calienta según lo que el set necesita','La voz 1 hará un patrón breve de preparación media.'),
  ('Ejercicio 2','Frase crítica: aislada → contexto real','Practica primero el punto difícil y luego vuelve al orden del set.'),
  ('Equipo vocal','Define voces principales, secundarias y descansos','Un buen arreglo también administra la carga del ministerio.')]
}

palette={
 'mix':('#071f2b','#0b5360','#75d9d3'), 'passaggio':('#071f2b','#0b5360','#75d9d3'),
 'dynamics':('#102036','#364c78','#8bd0ff'), 'intervals':('#121d32','#304c73','#86d6ff'),
 'harmony':('#241933','#5c3c78','#d0a3ff'), 'endurance':('#17241e','#315e48','#8fe0ae'),
 'agility':('#2a1b18','#744832','#ffbb86'), 'setlist':('#1d2230','#444f6d','#b4c6ff')}

def svg(slug,n,title,kicker,body):
    c1,c2,accent=palette[slug]
    pattern=''
    if n in (4,5):
        vals=['1','2','3','4','5','8'] if slug not in ('harmony','dynamics','endurance','setlist') else ['1','3','5','3','1']
        xs=[490+i*105 for i in range(len(vals))]
        dots=''.join(f'<circle cx="{x}" cy="505" r="19" fill="{accent}" opacity="{0.55+0.07*(i%3)}"/><text x="{x}" y="512" text-anchor="middle" fill="#071218" font-size="17" font-family="Arial">{escape(v)}</text>' for i,(x,v) in enumerate(zip(xs,vals)))
        pattern=f'<g>{dots}</g>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient><radialGradient id="g"><stop stop-color="{accent}" stop-opacity=".30"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="1280" height="720" fill="url(#bg)"/><circle cx="1060" cy="155" r="290" fill="url(#g)"/>
<path d="M0 570 C180 500 320 660 510 575 S830 490 1000 585 S1190 650 1280 590" fill="none" stroke="{accent}" stroke-opacity=".16" stroke-width="4"/>
<text x="82" y="88" fill="{accent}" font-family="Arial,sans-serif" font-size="22" letter-spacing="5">LA GREY · ACADEMIA</text>
<text x="82" y="126" fill="#c9d9dd" font-family="Arial,sans-serif" font-size="14" letter-spacing="4">VOZ AVANZADA · CLASE {n:02d}</text>
<line x1="82" y1="156" x2="388" y2="156" stroke="{accent}" stroke-width="2" opacity=".65"/>
<text x="82" y="290" fill="#f6f8f7" font-family="Georgia,serif" font-size="64">{escape(title)}</text>
<text x="84" y="358" fill="{accent}" font-family="Arial,sans-serif" font-size="28" font-weight="600">{escape(kicker)}</text>
<foreignObject x="84" y="394" width="1030" height="130"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;font-size:23px;line-height:1.45;color:#d8e5e8;max-width:980px">{escape(body)}</div></foreignObject>
{pattern}
<text x="84" y="655" fill="#a5bac0" font-family="Arial,sans-serif" font-size="14" letter-spacing="3">TÉCNICA · PRÁCTICA · MINISTERIO</text>
</svg>'''

for slug,slides in classes.items():
    folder=BASE/slug
    folder.mkdir(parents=True,exist_ok=True)
    for i,(title,kicker,body) in enumerate(slides,1):
        (folder/f'scene-{i:02d}.svg').write_text(svg(slug,i,title,kicker,body),encoding='utf-8')
print('generated',sum(len(v) for v in classes.values()),'academy SVG scenes')
