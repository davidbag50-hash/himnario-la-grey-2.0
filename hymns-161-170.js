(()=>{
'use strict';
const hymns=[
{id:1161,bookNumber:161,title:'Bendito Dios',artist:'Raúl R. Solís · ELECCIÓN',type:'himnos',tone:'C',content:`[Himno 161]

[Verso 1]
C                 F          C
Descendió de gloria Cristo Salvador, vino a este mundo, mundo pecador. Antes que formara toda su creación, Dios quiso librarme de condenación.
G7                             C

[Verso 2]
C                 F          C
En el plan divino de la redención, vino a buscarnos para salvación. Antes que formara toda su creación, Dios quiso librarme de condenación.
G7                             C

[Verso 3]
C                 F          C
El Amado Hijo, glorioso Jesús, derramó su sangre en la cruenta cruz. Y fue sepultado; ya resucitó. Vive eternamente; Dios le ensalzó.
G7                             C

[Verso 4]
C                 F          C
Bendito Dios por su amor y luz.
G7                             C`},
{id:1162,bookNumber:162,title:'Todos los Que Tengan Sed',artist:'T. M. Westrup · JESUS SAVES',type:'himnos',tone:'G',content:`[Himno 162]

[Verso 1]
G                 C          G
Todos los que tengan sed vengan, cuantos pobres hay: beberán, comerán. No malgasten el haber; compren verdadero pan. Si a Jesús acuden hoy, gozarán.
D7                             G

[Verso 2]
G                 C          G
Si le prestan atención, de su amor el sumo bien les dará eternal. Con el místico David, Rey, Maestro, Capitán, de las huestes que al Edén llevará.
D7                             G

[Verso 3]
G                 C          G
Como baja bienhechor riego que las nubes dan, sin volver ha de ser. La Palabra del Señor, productivo, pleno bien, vencedora al fin será por la fe.
D7                             G`},
{id:1163,bookNumber:163,title:'Todos los Que Tengan Sed',artist:'T. M. Westrup · LIMPSFIELD',type:'himnos',tone:'D',content:`[Himno 163]

[Verso 1]
D                 G          D
Todos los que tengan sed vengan, cuantos pobres hay: beberán, comerán. No malgasten el haber; compren verdadero pan. Si a Jesús acuden hoy, gozarán.
A7                             D

[Verso 2]
D                 G          D
Si le prestan atención, de su amor el sumo bien les dará eternal. Con el místico David, Rey, Maestro, Capitán, de las huestes que al Edén llevará.
A7                             D

[Verso 3]
D                 G          D
Como baja bienhechor riego que las nubes dan, sin volver ha de ser. La Palabra del Señor, productivo, pleno bien, vencedora al fin será por la fe.
A7                             D`},
{id:1164,bookNumber:164,title:'Amigo Hallé',artist:'Jack P. Scholfield · RAPTURE',type:'himnos',tone:'Eb',content:`[Himno 164]

[Verso 1]
Eb                 Ab          Eb
Amigo hallé más fiel que todo amor; salvóme del grave mal. Salvo por su poder, vida con él tendré; salvación me dio el Señor.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
De día en día potente y fiel, que no me espanta la tentación. Mi senda sigo fiado en él. ¡Salvo, sí, salvo por su poder!
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
En gran misericordia se apiadó de mí; “por ti”, me dijo, “he muerto yo”. Hay vida eterna para tener; salvo por su poder, vida con él tendré.
Bb7                             Eb`},
{id:1165,bookNumber:165,title:'Jesús Es la Luz del Mundo',artist:'P. P. Bliss · LIGHT OF THE WORLD',type:'himnos',tone:'C',content:`[Himno 165]

[Verso 1]
C                 F          C
El mundo perdido en pecado se vio: ¡Jesús es la luz del mundo! Mas en las tinieblas la gloria brilló: ¡Jesús es la luz del mundo!
G7                             C

[Verso 2]
C                 F          C
La noche se cambia en día con él: ¡Jesús es la luz del mundo! Y andamos en luz tras un Guía tan fiel: ¡Jesús es la luz del mundo!
G7                             C

[Verso 3]
C                 F          C
¡Oh ciegos y presos del lóbrego error! ¡Jesús es la luz del mundo! Él manda lavaros y ver su fulgor: ¡Jesús es la luz del mundo!
G7                             C

[Verso 4]
C                 F          C
Ni soles ni lunas el cielo tendrá: ¡Jesús es la luz del mundo! La luz de su rostro lo iluminará: ¡Jesús es la luz del mundo!
G7                             C

[Verso 5]
C                 F          C
¡Ven a la luz! No debes perder gozo perfecto al amanecer. Jesús es la luz del mundo.
G7                             C`},
{id:1166,bookNumber:166,title:'Cariñoso Salvador',artist:'Charles Wesley · HOLLINGSIDE',type:'himnos',tone:'Eb',content:`[Himno 166]

[Verso 1]
Eb                 Ab          Eb
Cariñoso Salvador, huyo de la tempestad a tu seno protector; sálvame, Señor Jesús. Fiándome de tu bondad, de la furia del turbión, hasta el puerto de salud guía tú mi embarcación.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Otro asilo no he de hallar; indefenso acudo a ti. Voy en mi necesidad, solamente tú, Señor. Porque mi peligro vi, puedes dar consuelo y luz; a librarme del temor corro a ti, mi buen Jesús.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Cristo, encuentro todo en ti; débil, me pusiste en pie. Al enfermo das salud, y no necesito más. Triste, tú mi amparo das; guías tierno al que no ve; con gratitud tu bondad ensalzaré. Amén.
Bb7                             Eb`},
{id:1167,bookNumber:167,title:'Cariñoso Salvador',artist:'Charles Wesley · MARTYN',type:'himnos',tone:'F',content:`[Himno 167]

[Verso 1]
F                 Bb          F
Cariñoso Salvador, huyo de la tempestad a tu seno protector; sálvame, Señor Jesús. Fiándome de tu bondad, de la furia del turbión, hasta el puerto de salud guía tú mi embarcación.
C7                             F

[Verso 2]
F                 Bb          F
Otro asilo no he de hallar; indefenso acudo a ti. Voy en mi necesidad, solamente tú, Señor. Porque mi peligro vi, puedes dar consuelo y luz; a librarme del temor corro a ti, mi buen Jesús.
C7                             F

[Verso 3]
F                 Bb          F
Cristo, encuentro todo en ti; débil, me pusiste en pie. Al enfermo das salud, y no necesito más. Triste, tú mi amparo das; guías tierno al que no ve; con gratitud tu bondad ensalzaré.
C7                             F`},
{id:1168,bookNumber:168,title:'Salvante Amor',artist:'Gloria Gaither · REDEEMING LOVE',type:'himnos',tone:'Bb',content:`[Himno 168]

[Verso 1]
Bb                 Eb          Bb
Su riqueza abandonó, a un pesebre descendió; a este mundo se acercó. Amor que nunca cesa, salvante amor.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Con su sangre me lavó; paz que el mundo rechazó. Dios nos rescató, fue Cristo el Señor. Salvante amor.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
A brutal y dura cruz fue llevado mi Jesús; con su sangre me lavó. Salvante amor.
F7                             Bb`},
{id:1169,bookNumber:169,title:'Levantado Fue Jesús',artist:'Philip P. Bliss · HALLELUJAH! WHAT A SAVIOR',type:'himnos',tone:'Bb',content:`[Himno 169]

[Verso 1]
Bb                 Eb          Bb
Levantado fue Jesús en la vergonzosa cruz para darme la salud. ¡Aleluya! ¡Gloria a Cristo!
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Soy indigno pecador; él es justo Salvador, dio su vida en mi favor. ¡Aleluya! ¡Gloria a Cristo!
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Por mis culpas yo me vi en peligro de morir, mas Jesús murió por mí. ¡Aleluya! ¡Gloria a Cristo!
F7                             Bb`},
{id:1170,bookNumber:170,title:'¿Quieres Ser Salvo de Toda Maldad?',artist:'Lewis E. Jones · POWER IN THE BLOOD',type:'himnos',tone:'Eb',content:`[Himno 170]

[Verso 1]
Eb                 Ab          Eb
¿Quieres ser salvo de toda maldad? Tan sólo hay poder en mi Jesús. ¿Quieres vivir y gozar santidad? Tan sólo hay poder en Jesús.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
¿Quieres ser libre de orgullo y pasión? Tan sólo hay poder en mi Jesús. ¿Quieres vencer toda cruel tentación? Tan sólo hay poder en Jesús.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
¿Quieres servir a tu Rey y Señor? Tan sólo hay poder en mi Jesús. Ven, y ser salvo podrás en su amor; tan sólo hay poder en Jesús.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Hay poder, sí, sin igual poder en Jesús quien murió; hay poder, sí, sin igual poder en la sangre que él vertió.
Bb7                             Eb`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();