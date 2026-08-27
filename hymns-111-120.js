(()=>{
'use strict';
const hymns=[
{id:1111,bookNumber:111,title:'En la Vergonzosa Cruz',artist:'VERGONZOSA CRUZ',type:'himnos',tone:'Bb',content:`[Himno 111]

[Verso 1]
Bb                 Eb          Bb
En la vergonzosa cruz padeció por mí Jesús; por la sangre que vertió mis pecados él expió. Lavará de todo mal ese rojo manantial, el que abrió por mí Jesús en la vergonzosa cruz.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
¡Oh qué amor, qué inmenso amor reveló mi Salvador! La maldad que hice yo al suplicio le llevó. Ahora a ti mi todo doy, cuerpo y alma, tuyo soy; mientras permanezca aquí, hazme siempre fiel a ti.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Yo de Cristo sólo soy, a seguirle pronto estoy; al bendito Redentor serviré con firme amor. Sea mi alma ya su hogar y mi corazón su altar; vida emana, paz y luz, del Calvario, de la cruz.
F7                             Bb

[Verso 4]
Bb                 Eb          Bb
Sí, fue por mí; sí, fue por mí; sí, por mí murió Jesús en la vergonzosa cruz.
F7                             Bb`},
{id:1112,bookNumber:112,title:'Inmensa y sin Igual Piedad',artist:'Isaac Watts · REMEMBER ME',type:'himnos',tone:'F',content:`[Himno 112]

[Verso 1]
F                 Bb          F
¡Inmensa y sin igual piedad! Jesús murió por mí; y por mi culpa vil sufrió la muerte en la cruz.
C7                             F

[Verso 2]
F                 Bb          F
Por la maldad que hice yo, murió el Redentor. ¡Oh qué divina compasión! ¡Qué infinito amor!
C7                             F

[Verso 3]
F                 Bb          F
Y tuvo que esconderse el sol en negra confusión, al ver morir al Salvador por nuestra redención.
C7                             F

[Verso 4]
F                 Bb          F
¡Amado Cristo!, no podré jamás pagar tu amor; mas lo que tengo doy a ti, tu siervo soy, Señor.
C7                             F

[Verso 5]
F                 Bb          F
Acuérdate, Señor Jesús; acuérdate de mí; y por tu muerte y tu pasión, ¡oh, ten piedad de mí!
C7                             F`},
{id:1113,bookNumber:113,title:'Vuestro Himno Hoy Cantad',artist:'Juan de Damasco · ST. KEVIN',type:'himnos',tone:'G',content:`[Himno 113]

[Verso 1]
G                 C          G
Vuestro himno hoy cantad de triunfante gozo; a su pueblo Dios le dio justo alborozo. Cantad hoy, Jerusalén, con amor sagrado, que Jesús, el que murió, ¡ha resucitado!
D7                             G

[Verso 2]
G                 C          G
De almas primavera es hoy, Cristo ya es libre; de la muerte y su terror vida y luz brotaron. Nuestro invierno de pecar ya se va volando; y a Jesús, quien es Señor, himnos le cantamos.
D7                             G

[Verso 3]
G                 C          G
¡Aleluya! canten hoy a Jesús bendito; de la tumba invicto emergió. ¡Aleluya a Jesús, y a Dios el Padre; y al Espíritu de luz loas le complacen! Amén.
D7                             G`},
{id:1114,bookNumber:114,title:'El Señor Resucitó',artist:'Michael Weisse · EASTER HYMN',type:'himnos',tone:'C',content:`[Himno 114]

[Verso 1]
C                 F          C
El Señor resucitó, ¡aleluya! Muerte y tumba él venció, ¡aleluya! Con su fuerza y su virtud, ¡aleluya! Cautivó la esclavitud, ¡aleluya!
G7                             C

[Verso 2]
C                 F          C
Jesucristo se humilló, ¡aleluya! Vencedor se levantó, ¡aleluya! Cante hoy la cristiandad, ¡aleluya! Su gloriosa majestad, ¡aleluya!
G7                             C

[Verso 3]
C                 F          C
Cristo que la cruz sufrió, ¡aleluya! Y en desolación se vio, ¡aleluya! Hoy en gloria celestial, ¡aleluya! Reina vivo e inmortal, ¡aleluya!
G7                             C

[Verso 4]
C                 F          C
Hoy al lado está de Dios, ¡aleluya! Donde escucha nuestra voz, ¡aleluya! Por nosotros rogará, ¡aleluya! Con su amor nos salvará, ¡aleluya! Amén.
G7                             C`},
{id:1115,bookNumber:115,title:'Jesucristo Resucitó',artist:'Michael Weisse · LLANFAIR',type:'himnos',tone:'C',content:`[Himno 115]

[Verso 1]
C                 F          C
El Señor resucitó, ¡aleluya! Muerte y tumba ya venció, ¡aleluya! Con su fuerza y su virtud, ¡aleluya! Cautivó la esclavitud, ¡aleluya!
G7                             C

[Verso 2]
C                 F          C
Jesucristo se humilló, ¡aleluya! Vencedor se levantó, ¡aleluya! Cante hoy la cristiandad, ¡aleluya! Su gloriosa majestad, ¡aleluya!
G7                             C

[Verso 3]
C                 F          C
Cristo que la cruz sufrió, ¡aleluya! Y en desolación se vio, ¡aleluya! Hoy en gloria celestial, ¡aleluya! Reina vivo e inmortal, ¡aleluya!
G7                             C

[Verso 4]
C                 F          C
Hoy al lado está de Dios, ¡aleluya! Donde escucha nuestra voz, ¡aleluya! Por nosotros rogará, ¡aleluya! Con su amor nos salvará, ¡aleluya!
G7                             C`},
{id:1116,bookNumber:116,title:'Un Día',artist:'J. Wilbur Chapman · CHAPMAN',type:'himnos',tone:'Db',content:`[Himno 116]

[Verso 1]
Db                 Gb          Db
Un día que el cielo sus glorias cantaba, un día que el mal imperaba más cruel; Jesús descendió, y al nacer de una virgen, nos dio por su vida un ejemplo tan fiel.
Ab7                             Db

[Verso 2]
Db                 Gb          Db
Un día lleváronle al monte Calvario, un día enclaváronle sobre una cruz; sufriendo dolores y pena de muerte, expiando el pecado, salvóme Jesús.
Ab7                             Db

[Verso 3]
Db                 Gb          Db
Un día dejaron su cuerpo en el huerto, tres días en paz reposó de dolor. Velaban los ángeles sobre el sepulcro de mi única y eterna esperanza, el Señor.
Ab7                             Db

[Verso 4]
Db                 Gb          Db
Un día la tumba ocultarle no pudo, un día el ángel la piedra quitó; habiendo Jesús a la muerte vencido, a estar con su Padre en su trono ascendió.
Ab7                             Db

[Verso 5]
Db                 Gb          Db
Un día otra vez viene con voz de arcángel; un día en su gloria el Señor brillará. ¡Oh día admirable en que unido su pueblo, loores a Cristo por siempre dará!
Ab7                             Db

[Verso 6]
Db                 Gb          Db
Vivo, me amaba; muerto, salvóme; y en el sepulcro venció mi justicia. Un día él viene, pues lo prometió.
Ab7                             Db`},
{id:1117,bookNumber:117,title:'Herido, Triste, a Jesús',artist:'Isaac Watts · AVON',type:'himnos',tone:'Ab',content:`[Himno 117]

[Verso 1]
Ab                 Db          Ab
Herido, triste, a Jesús mostréle mi dolor; perdido, errante, vi su luz, bendíjome en su amor.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Sobre una cruz mi buen Jesús su sangre derramó por este pobre pecador, a quien así salvó.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
Venció a la muerte con poder y el Padre le exaltó; confiar en él es mi placer, morir no temo yo.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
Aunque él se fue, conmigo está el gran Consolador; por él entrada tengo ya al reino del Señor.
Eb7                             Ab

[Verso 5]
Ab                 Db          Ab
Vivir en Cristo me da paz; con él habitaré; ya suyo soy, y de hoy en más a nadie temeré.
Eb7                             Ab`},
{id:1118,bookNumber:118,title:'¿Viste Tú?',artist:'WERE YOU THERE',type:'himnos',tone:'Eb',content:`[Himno 118]

[Verso 1]
Eb                 Ab          Eb
¿Viste tú cuando en la cruz murió? ¿Viste tú cuando en la cruz murió? Hay veces que al pensarlo tiemblo, tiemblo, tiemblo. ¿Viste tú cuando en la cruz murió?
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
¿Viste tú cuando expiró allí? ¿Viste tú cuando expiró allí? Hay veces que al pensarlo tiemblo, tiemblo, tiemblo. ¿Viste tú cuando expiró allí?
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
¿Viste tú cuando enterrado fue? ¿Viste tú cuando enterrado fue? Hay veces que al pensarlo tiemblo, tiemblo, tiemblo. ¿Viste tú cuando enterrado fue?
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
¿Viste tú cuando él resucitó? ¿Viste tú cuando él resucitó? Hay veces que al pensarlo tiemblo, tiemblo, tiemblo. ¿Viste tú cuando él resucitó?
Bb7                             Eb`},
{id:1119,bookNumber:119,title:'El Día del Señor',artist:'William N. McElrath · SPRINGBROOK',type:'himnos',tone:'F',content:`[Himno 119]

[Verso 1]
F                 Bb          F
Quitada fue la piedra allí, la tumba de dolor; mas Cristo el Rey resucitó y él es nuestro Señor.
C7                             F

[Verso 2]
F                 Bb          F
Del ave el canto no se oyó, ni aroma dio la flor; mas Cristo fiel resucitó y es nuestro Rey y Señor.
C7                             F

[Verso 3]
F                 Bb          F
Verdor el mundo tiene hoy de gozo por Jesús; le damos gloria y loor, pues él nos da la luz.
C7                             F

[Verso 4]
F                 Bb          F
Alegres todos canten, sí, con gratitud y amor: resucitó Dios Hijo así, el día del Señor.
C7                             F`},
{id:1120,bookNumber:120,title:'Alegres Cantemos Canciones de Loor',artist:'METHFESSEL',type:'himnos',tone:'Ab',content:`[Himno 120]

[Verso 1]
Ab                 Db          Ab
Alegres cantemos canciones de loor: Jesús victorioso es nuestro Salvador. Al Salvador rindámosle honor; la muerte ya venció nuestro Salvador.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Los malos negaron a nuestro Redentor y le condenaron a la crucifixión. Resucitó Jesús nuestro Señor; los ángeles del cielo le dan loor.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
Jesús, Hijo Santo del Padre celestial, el mundo está lleno de tu majestad. Tu gran amor nos da felicidad; y al cielo junto a ti hemos de llegar.
Eb7                             Ab`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();