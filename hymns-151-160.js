(()=>{
'use strict';
const hymns=[
{id:1151,bookNumber:151,title:'Oh Juventud, Que Alabas al Señor',artist:'Rubén Giménez · melodía del Himno 150',type:'himnos',tone:'G',content:`[Himno 151]

[Verso 1]
G                 C          G
Oh juventud, que alabas al Señor con voz de júbilo y devoción; tu nombre, oh Cristo, hemos de alabar. ¡Aleluya! ¡Aleluya!
D7                             G

[Verso 2]
G                 C          G
Oh juventud, que sirves al Señor con fe, con gozo y constante amor; tu nombre, oh Cristo, hemos de anunciar. ¡Aleluya! ¡Aleluya!
D7                             G

[Verso 3]
G                 C          G
Oh juventud, que marchas por la fe, siguiendo a Cristo lograrás vencer. Consagra hoy tus dones al Señor. ¡Aleluya! ¡Aleluya!
D7                             G

[Verso 4]
G                 C          G
Oye, oh Dios, mi humilde oración. Mi vida es tuya, tómala, Señor. Mis pasos guía hacia tu mansión. ¡Aleluya! ¡Aleluya!
D7                             G

[Verso 5]
G                 C          G
Oh juventud, triunfante llegarás. Dios ha guardado para ti lugar. Tú has cumplido con valor la misión. ¡Aleluya! ¡Aleluya!
D7                             G`},
{id:1152,bookNumber:152,title:'Señor Jehová, Omnipotente Dios',artist:'Daniel C. Roberts · NATIONAL HYMN',type:'himnos',tone:'Eb',content:`[Himno 152]

[Verso 1]
Eb                 Ab          Eb
Señor Jehová, omnipotente Dios, tú que los astros riges con poder, oye clemente nuestra humilde voz; nuestra canción hoy dígnate atender.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Eterno Padre, nuestro corazón a ti profesa un inefable amor; hazte presente en tu pueblo hoy; tiéndenos, pues, tu brazo protector.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
A nuestra patria da tu bendición; enséñanos tus leyes a guardar; alumbra la conciencia y la razón; domina siempre tú en todo hogar.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Defiéndenos del enemigo cruel; concede a nuestras faltas corrección; nuestro servicio sea siempre fiel; rodéanos de tu gran protección. Amén.
Bb7                             Eb`},
{id:1153,bookNumber:153,title:'La Creación',artist:'José Juan Naula Yupanqui · LA CREACIÓN',type:'himnos',tone:'Dm',content:`[Himno 153]

[Verso 1]
Dm                 Gm          Dm
Dios ha hecho todo lo que el ojo ve; cada cosa de este mundo terrenal. Todo árbol y las plantas son de él, las estrellas y el manto celestial. “¡Sea ya la luz!”
A7                             Dm

[Verso 2]
Dm                 Gm          Dm
A su imagen Dios formó al hombre Adán, luego hizo una mujer tomada de él; y los colocó en el jardín de Edén, donde habrían de seguirle siempre fiel.
A7                             Dm

[Verso 3]
Dm                 Gm          Dm
El perfecto gozo había en el Edén, ellos caminaban al andar con Dios. Comunión completa había allá también al oír de Jehová la tierna voz.
A7                             Dm`},
{id:1154,bookNumber:154,title:'El Mundo Entero Es del Padre',artist:'Maltbie D. Babcock · TERRA PATRIS',type:'himnos',tone:'F',content:`[Himno 154]

[Verso 1]
F                 Bb          F
El mundo entero es del Padre celestial; su alabanza en la creación escucho resonar. ¡De Dios el mundo es! ¡Qué grato es recordar que en tanto bien podemos descansar!
C7                             F

[Verso 2]
F                 Bb          F
El mundo entero es del Padre celestial; el pájaro, la luz, la flor muestran su bondad. ¡De Dios el mundo es! El fruto de su acción se manifiesta en toda la expansión.
C7                             F

[Verso 3]
F                 Bb          F
El mundo entero es del Padre celestial; y nada habrá de detener su triunfo sobre el mal. ¡De Dios el mundo es! Confiada mi alma está, pues Cristo nuestro Rey por siempre reinará.
C7                             F`},
{id:1155,bookNumber:155,title:'Alcemos Nuestra Voz',artist:'Joseph C. Macaulay · BOUNDLESS PRAISE',type:'himnos',tone:'G',content:`[Himno 155]

[Verso 1]
G                 C          G
Alcemos nuestra voz al Rey y Creador, y al Cordero que murió. Cantemos de su amor, poder y majestad. Cantemos todos a una voz por la eternidad.
D7                             G

[Verso 2]
G                 C          G
Desconocidos éramos para el Padre, mas Dios nos recibió. Su sangre carmesí nos unió; salvó al pecador. El sacrificio se cumplió, incomparable amor.
D7                             G

[Verso 3]
G                 C          G
Los redimidos cantarán por siempre al Rey Jesús. Loemos al gran Yo Soy, los santos cantarán. Digno el Cordero, el Rey Jesús, su nombre alabarán. Amén.
D7                             G`},
{id:1156,bookNumber:156,title:'Siempre Amanece',artist:'Eleanor Farjeon · BUNESSAN',type:'himnos',tone:'C',content:`[Himno 156]

[Verso 1]
C                 F          C
Siempre amanece como al principio; aves que cantan siempre se ven. Todo hermoso cuando amanece. Demos con gozo gloria a Dios.
G7                             C

[Verso 2]
C                 F          C
Cae la lluvia sobre la hierba como al principio de la creación. ¡Dios es loado! Pues nos ha dado con el rocío su bendición.
G7                             C

[Verso 3]
C                 F          C
Suya es la aurora, suyo es el día; todo perfecto Dios lo creó. Una alabanza siempre elevemos, cada mañana al Creador.
G7                             C`},
{id:1157,bookNumber:157,title:'¿Has Hallado en Cristo?',artist:'Elisha A. Hoffman · WASHED IN THE BLOOD',type:'himnos',tone:'Ab',content:`[Himno 157]

[Verso 1]
Ab                 Db          Ab
¿Has hallado en Cristo plena salvación por la sangre que Cristo vertió? ¿Toda mancha lava de tu corazón? ¿Eres limpio en la sangre eficaz?
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
¿Vives siempre al lado de tu Salvador por la sangre que él derramó? ¿Del pecado eres vencedor? ¿Eres limpio en la sangre eficaz?
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
¿Tendrás ropa blanca al venir Jesús? ¿Eres limpio en la fuente de amor? ¿Estás listo para andar en luz? ¿Eres limpio en la sangre eficaz?
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
Cristo ofrece hoy pureza y poder; ¡oh, acude a la cruz del Señor! Él la fuente es que puede limpiar tu ser; ¡oh, acepta su sangre eficaz!
Eb7                             Ab`},
{id:1158,bookNumber:158,title:'Rey de Reyes',artist:'Gloria y William J. Gaither · KING OF KINGS',type:'himnos',tone:'C',content:`[Himno 158]

[Verso 1]
C                 F          C
Solitarios pastores en vigilia están; nada ven que merezca canciones. Pero el ángel proclama: “Nació un Salvador”, y el cielo alaba su nombre.
G7                             C

[Verso 2]
C                 F          C
En sus tumbas las grandes figuras están, que con él vanas pugnas libraron; mas su amor compasivo a todos venció, y hoy sus voces al cielo proclaman.
G7                             C

[Verso 3]
C                 F          C
Y al sonar las trompetas el cielo arderá; nuestro Dios juzgará al indeciso. El cristiano, sin miedo, tendrá un Salvador. Gloria a Dios, al Señor Jesucristo.
G7                             C

[Verso 4]
C                 F          C
De reyes, él es Rey; de todos, Señor.
G7                             C`},
{id:1159,bookNumber:159,title:'Roca de la Eternidad',artist:'Augustus M. Toplady · TOPLADY',type:'himnos',tone:'Bb',content:`[Himno 159]

[Verso 1]
Bb                 Eb          Bb
Roca de la eternidad, sé mi escondedero fiel; paz encuentro sólo en ti, rico, limpio manantial, en el cual lavado fui.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Del pecado no podré justificación lograr; sólo en ti teniendo fe sobre el mal podré triunfar.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Cuando vaya a responder en tu augusto tribunal, sé mi escondedero fiel, Roca de la eternidad. Amén.
F7                             Bb`},
{id:1160,bookNumber:160,title:'¿Qué Me Puede Dar Perdón?',artist:'Robert Lowry · PLAINFIELD',type:'himnos',tone:'G',content:`[Himno 160]

[Verso 1]
G                 C          G
¿Qué me puede dar perdón? Sólo de Jesús la sangre. ¿Y un nuevo corazón? Sólo de Jesús la sangre.
D7                             G

[Verso 2]
G                 C          G
Fue el rescate eficaz, sólo de Jesús la sangre; trajo santidad y paz, sólo de Jesús la sangre.
D7                             G

[Verso 3]
G                 C          G
Veo para mi salud, sólo de Jesús la sangre; tiene de sanar virtud, sólo de Jesús la sangre.
D7                             G

[Verso 4]
G                 C          G
Cantaré junto a sus pies, sólo de Jesús la sangre. El Cordero digno es, sólo de Jesús la sangre.
D7                             G

[Verso 5]
G                 C          G
Precioso es el raudal que limpia todo mal; no hay otro manantial, sólo de Jesús la sangre.
D7                             G`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();