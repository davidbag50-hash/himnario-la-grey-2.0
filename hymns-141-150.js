(()=>{
'use strict';
const hymns=[
{id:1141,bookNumber:141,title:'Dicha Grande Es la del Hombre',artist:'T. M. Westrup · BEECHER',type:'himnos',tone:'Bb',content:`[Himno 141]

[Verso 1]
Bb                 Eb          Bb
Dicha grande es la del hombre cuyas sendas rectas son; no anda con los pecadores en actuar de perversión. A los malos consejeros deja porque teme el mal; huye de la burladora gente impía sin moral.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Antes, en la ley divina cifra su mayor placer, meditando día y noche en su divino saber. Éste, como el árbol verde, bien regado y en sazón, frutos abundantes rinde y hojas que perennes son.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Él prospera en lo que emprende y le sale todo bien; mas funestos resultados los impíos siempre ven. Porque Dios la senda mira por la cual los suyos van; otra es la de los impíos: al infierno bajarán. Amén.
F7                             Bb`},
{id:1142,bookNumber:142,title:'Padre, Tu Palabra Es',artist:'Juan B. Cabrera · ALL TO CHRIST',type:'himnos',tone:'Eb',content:`[Himno 142]

[Verso 1]
Eb                 Ab          Eb
Padre, tu Palabra es mi delicia y mi solaz; guíe siempre aquí mis pies, y a mi alma traiga paz. Faro celestial, que en perenne resplandor, norte y guía da al mortal.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Si obediente oí tu voz, en tu gracia fuerza hallé, y con firme pie y veloz por tus sendas caminé. Faro celestial, que en perenne resplandor, norte y guía da al mortal.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Tu verdad es mi sostén contra duda y tentación, y destila calma y bien cuando asalta la aflicción. Faro celestial, que en perenne resplandor, norte y guía da al mortal.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Son tus dichos para mí prendas fieles de salud; dame, pues, que te oiga a ti con filial solicitud. Faro celestial, que en perenne resplandor, norte y guía da al mortal.
Bb7                             Eb`},
{id:1143,bookNumber:143,title:'Bellas Palabras de Vida',artist:'Philip P. Bliss · WORDS OF LIFE',type:'himnos',tone:'F',content:`[Himno 143]

[Verso 1]
F                 Bb          F
¡Oh, cantádmelas otra vez! Bellas palabras de vida; hallo en ellas mi gozo y luz, sí, de luz y vida. Bellas palabras de vida; son sostén y guía.
C7                             F

[Verso 2]
F                 Bb          F
Jesucristo a todos da bellas palabras de vida; él llamándote hoy está, bondadoso te salva. Bellas palabras de vida; y al cielo te llama.
C7                             F

[Verso 3]
F                 Bb          F
Grato el cántico sonará: bellas palabras de vida; tus pecados perdonará, sí, de luz y vida. Bellas palabras de vida; son sostén y guía.
C7                             F`},
{id:1144,bookNumber:144,title:'Gozo la Santa Palabra al Leer',artist:'Philip P. Bliss · JESUS LOVES EVEN ME',type:'himnos',tone:'G',content:`[Himno 144]

[Verso 1]
G                 C          G
Gozo la santa Palabra al leer, cosas preciosas allí puedo ver; y sobre todo, que el gran Redentor es de los niños el tierno Pastor.
D7                             G

[Verso 2]
G                 C          G
Me ama Jesús, pues su vida entregó por mi salud y de niños habló: “Dejad los niños que vengan a mí; para salvarlos mi sangre vertí.”
D7                             G

[Verso 3]
G                 C          G
Si alguien pregunta que cómo lo sé: “Busca a Jesús, pecador”, le diré; “por su Palabra que tienes aquí, aprende y siente que te ama a ti.”
D7                             G

[Verso 4]
G                 C          G
Con alegría yo cantaré al tierno Pastor, que en el Calvario murió por mí.
D7                             G`},
{id:1145,bookNumber:145,title:'Tu Palabra Es Divina y Santa',artist:'Zinzendorf y Christian Gregor',type:'himnos',tone:'C',content:`[Himno 145]

[Verso 1]
C                 F          C
Es de Dios la Santa Biblia, su Palabra de verdad. Yo la creo con el alma hoy y por la eternidad.
G7                             C

[Verso 2]
C                 F          C
¡Aleluya! ¡Cuán preciosa es la Biblia, roca fiel! Sus preceptos son seguros y son dulces cual la miel.
G7                             C`},
{id:1146,bookNumber:146,title:'Santa Biblia, para Mí',artist:'John Burton · SPANISH HYMN',type:'himnos',tone:'Ab',content:`[Himno 146]

[Verso 1]
Ab                 Db          Ab
Santa Biblia, para mí eres un tesoro aquí; tú me dices lo que soy, de quién vine y a quién voy.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Tú reprendes mi dudar; tú me exhortas sin cesar; eres faro que a mi pie lo conduce por la fe a las fuentes del amor del bendito Salvador.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
Eres infalible voz del Espíritu de Dios; al alma das cuando en aflicción está. Tú me enseñas a triunfar de la muerte y el pecar.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
Por tu santa letra sé que con Cristo reinaré; indigno soy, por tu luz al cielo voy. ¡Santa Biblia!, para mí eres un tesoro aquí.
Eb7                             Ab`},
{id:1147,bookNumber:147,title:'La Ley de Dios Perfecta Es',artist:'Salmo 19 · MEAR',type:'himnos',tone:'G',content:`[Himno 147]

[Verso 1]
G                 C          G
La ley de Dios perfecta es: convierte al pecador; su testimonio es tan fiel que al simple ilumina.
D7                             G

[Verso 2]
G                 C          G
Los mandamientos del Señor dan gozo al corazón; tan puro su precepto es que aclara la visión.
D7                             G

[Verso 3]
G                 C          G
Es limpio el temor de Dios, que permanecerá; los sabios juicios del Señor son justos, son verdad.
D7                             G

[Verso 4]
G                 C          G
Deseables más que el oro son sus juicios, mucho más; aun más dulces que la miel que fluye del panal.
D7                             G`},
{id:1148,bookNumber:148,title:'La Escalera de Jacob',artist:'JACOB’S LADDER',type:'himnos',tone:'G',content:`[Himno 148]

[Verso 1]
G                 C          G
Todos vamos caminando y subiendo la escalera, hacia el cielo, hacia el cielo, siervos de la cruz.
D7                             G

[Verso 2]
G                 C          G
Cada paso nos acerca, cada paso nos acerca, cada paso nos acerca, siervos de la cruz.
D7                             G

[Verso 3]
G                 C          G
¿Amas tú a Jesucristo? ¿Amas tú a Jesucristo? Todos deben de amarle, siervos de la cruz.
D7                             G

[Verso 4]
G                 C          G
Sirve a Cristo si le amas, sirve a Cristo si le amas, todos deben de servirle, siervos de la cruz.
D7                             G`},
{id:1149,bookNumber:149,title:'Omnipotente Padre Dios',artist:'Frederick W. Faber · ST. CATHERINE',type:'himnos',tone:'G',content:`[Himno 149]

[Verso 1]
G                 C          G
Omnipotente Padre Dios, da a nuestros corazones poder para cumplir. A los soldados tuyos sostén hasta la muerte en la fe; nuestra esperanza y nuestra fe.
D7                             G

[Verso 2]
G                 C          G
Que en medio de dolor nos des valor por Jesús; para enfrentar la lucha danos de beber hasta la muerte en la fe; nuestra esperanza y nuestra fe.
D7                             G

[Verso 3]
G                 C          G
Que a todos nuestros pasos des acción para siempre; la muerte enfrentaremos en la fe, nuestra esperanza y nuestra fe.
D7                             G`},
{id:1150,bookNumber:150,title:'Por los Santos Que Descansan Ya',artist:'William W. How · SINE NOMINE',type:'himnos',tone:'G',content:`[Himno 150]

[Verso 1]
G                 C          G
Hoy, por los santos que descansan ya, después de confesarte por la fe, tu nombre, oh Cristo, hemos de alabar.
D7                             G

[Verso 2]
G                 C          G
Tú fuiste amparo, roca y defensor; en la batalla, recio Capitán; tu luz venció las sombras del temor.
D7                             G

[Verso 3]
G                 C          G
Oh bendecida y santa comunión de los que aún luchan o en la gloria están; un solo cuerpo, porque tuyos son.
D7                             G

[Verso 4]
G                 C          G
Y cuando ruda la batalla es, del cielo se oye un cántico triunfal; se afirma el brazo, vence al fin la fe.
D7                             G

[Verso 5]
G                 C          G
La aurora eterna ya despuntará; las huestes fieles llegarán al Rey, cantando alegres a la Trinidad.
D7                             G`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();