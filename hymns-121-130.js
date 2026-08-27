(()=>{
'use strict';
const hymns=[
{id:1121,bookNumber:121,title:'Oh Hermanos, Dad a Cristo',artist:'Samuel P. Craver · HOLD THE FORT',type:'himnos',tone:'C',content:`[Himno 121]

[Verso 1]
C                 F          C
Oh hermanos, dad a Cristo alabanzas mil; él la muerte ha vencido y la tumba vil. Cristo, por tu gran victoria me das vida a mí; vencedor tú de la muerte, ¡gloria doy a ti!
G7                             C

[Verso 2]
C                 F          C
En la cruz él fue clavado por mí, pecador; por su muerte él se hizo nuestro Redentor. Por su gran victoria me das vida a mí; vencedor tú de la muerte, ¡gloria doy a ti!
G7                             C

[Verso 3]
C                 F          C
En la tumba sepultaron a mi Salvador; del sepulcro tenebroso quitó todo el terror. Por su gran victoria me das vida a mí; vencedor tú de la muerte, ¡gloria doy a ti!
G7                             C

[Verso 4]
C                 F          C
La potencia de la muerte Cristo derrotó; y del sepulcro tenebroso él se levantó. Por su gran victoria me das vida a mí; vencedor tú de la muerte, ¡gloria doy a ti!
G7                             C`},
{id:1122,bookNumber:122,title:'Jesús Venció la Muerte',artist:'Jaime Redín · JESÚS VENCIÓ LA MUERTE',type:'himnos',tone:'Dm',content:`[Himno 122]

[Verso 1]
Dm                 Gm          Dm
A Jesús crucificado lo llevaron al jardín; a Jesús lo han sepultado entre flores de jazmín.
A7                             Dm

[Verso 2]
Dm                 Gm          Dm
Vino un ángel al sepulcro y la piedra le quitó; Jesús venció la muerte, el Señor resucitó.
A7                             Dm

[Verso 3]
Dm                 Gm          Dm
Alegres las aves cantan, perfuman las flores ya; porque vive el Bien Amado, Jesús resucitado ha.
A7                             Dm

[Verso 4]
Dm                 Gm          Dm
Oh Jesús resucitado, te adoramos con amor; Príncipe de nuestras almas, sé tú, oh buen Salvador.
A7                             Dm`},
{id:1123,bookNumber:123,title:'Se Levantó el Señor',artist:'Oswald J. Smith · HE ROSE TRIUMPHANTLY',type:'himnos',tone:'Ab',content:`[Himno 123]

[Verso 1]
Ab                 Db          Ab
Mataron al Señor, a Cristo nuestro Rey, y en tumba de dolor brotó el amanecer.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Su pueblo se enlutó, sumido de dolor; mas pronto el cuadro fue cambiado por la fe.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
La piedra se apartó, Jesús resucitó; y ahora vive él, nos da su amor muy fiel.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
Se levantó el Señor con majestad, poder; y así triunfó sobre el dolor. Hoy proclamemos, pues, la gloria de su ser: resucitó Jesús el Rey.
Eb7                             Ab`},
{id:1124,bookNumber:124,title:'Tuya Es la Gloria',artist:'Edmund L. Budry · THINE IS THE GLORY',type:'himnos',tone:'Bb',content:`[Himno 124]

[Verso 1]
Bb                 Eb          Bb
Tuya es la gloria, victorioso Redentor, porque tú la muerte venciste, Señor. Quitan la gran piedra ángeles de luz, y en la tumba el lienzo guardan, oh Jesús.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Vemos que has resucitado ya; ansias y temores él nos quitará. Que su iglesia alegre cante la canción: ¡vivo está! La muerte pierde su aguijón.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
¡Ya no dudamos, Príncipe de vida y paz! Sin ti no valemos; fortaleza das. Más que vencedores haznos por tu amor, y al hogar celeste llévanos, Señor.
F7                             Bb

[Verso 4]
Bb                 Eb          Bb
Tuya es la gloria, victorioso Redentor, porque tú la muerte venciste, Señor. Amén.
F7                             Bb`},
{id:1125,bookNumber:125,title:'La Tumba Le Encerró',artist:'Robert Lowry · CHRIST AROSE',type:'himnos',tone:'C',content:`[Himno 125]

[Verso 1]
C                 F          C
La tumba le encerró, Cristo, mi Cristo; el alba allí esperó, Cristo el Señor.
G7                             C

[Verso 2]
C                 F          C
De guardas escapó, Cristo, mi Cristo; el sello destruyó, Cristo el Señor.
G7                             C

[Verso 3]
C                 F          C
La muerte dominó Cristo, mi Cristo; y su poder venció, Cristo el Señor.
G7                             C

[Verso 4]
C                 F          C
Cristo la tumba venció y con gran poder resucitó; de sepulcro y muerte Cristo es vencedor. Vive para siempre nuestro Salvador. ¡Gloria a Dios! ¡Gloria a Dios! El Señor resucitó.
G7                             C`},
{id:1126,bookNumber:126,title:'El Rey Ya Viene',artist:'Gloria y William J. Gaither · KING IS COMING',type:'himnos',tone:'A',content:`[Himno 126]

[Verso 1]
A                 D          A
El comercio ya ha cesado, el bullicio terminó; los talleres se han cerrado, la cosecha se dejó. En las casas no hay labores, en las cortes no hay ley; el planeta ya está listo para recibir al Rey.
E7                             A

[Verso 2]
A                 D          A
En los rostros sonrientes que conocen la verdad se ven vidas redimidas que ya tienen libertad. Se ven niños y ancianitos que sufrieron gran dolor; tienen ya salud y gozo gracias a su Redentor.
E7                             A

[Verso 3]
A                 D          A
Oigo carros que retumban porque vienen a anunciar la victoria de la vida y el final de la maldad. Togas reales se reparten, la tribuna lista está, y el gran coro de los cielos canta gracia, amor y paz.
E7                             A

[Verso 4]
A                 D          A
¡Oh, el Rey ya viene, el Rey ya viene! Ya sonó la gran trompeta y su rostro veo ya. ¡Oh, el Rey ya viene, el Rey ya viene! ¡Gloria a Dios! Él viene por mí.
E7                             A`},
{id:1127,bookNumber:127,title:'Viene Otra Vez',artist:'Lelia N. Morris · SECOND COMING',type:'himnos',tone:'Bb',content:`[Himno 127]

[Verso 1]
Bb                 Eb          Bb
Viene otra vez nuestro Salvador, ¡oh, que si fuera hoy! Para reinar con poder y amor, ¡oh, que si fuera hoy! Él por su iglesia viene esta vez, purificada en su grande amor. Del mundo por la redondez, ¡oh, que si fuera hoy!
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Terminará la obra de Satán, ¡ojalá fuera hoy! No más tristezas aquí verán, ¡ojalá fuera hoy! Todos los muertos en Cristo irán arrebatados por su Señor. ¿Cuándo estas glorias aquí vendrán? ¡Ojalá fuera hoy!
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Fieles y leales nos debe hallar, ¡si él viniera hoy! Todo su pueblo con gozo y paz, ¡si él viniera hoy! Multiplicadas señales hay, de su venida se ve el fulgor. Ya más cercano el tiempo está, ¡ojalá fuera hoy!
F7                             Bb

[Verso 4]
Bb                 Eb          Bb
¡Gloria! ¡Gloria! Gozo sin fin traerá, al coronarle Rey. ¡Gloria! ¡Gloria! La senda preparad; Cristo viene otra vez.
F7                             Bb`},
{id:1128,bookNumber:128,title:'Cristianos Todos, a Prepararse',artist:'SUNLIGHT · G. H. Cook',type:'himnos',tone:'F',content:`[Himno 128]

[Verso 1]
F                 Bb          F
Cristianos todos, a prepararse: ved al Esposo, vuestro Señor; llenas tened las lámparas siempre, a su encuentro id con amor.
C7                             F

[Verso 2]
F                 Bb          F
Ya las señales cúmplense todas, quiere brotar ya la higuera; fieles, venid, el Salvador llama; nadie en su boda debe faltar.
C7                             F

[Verso 3]
F                 Bb          F
Presto acude, alma, acepta de tu Señor; él te dará su gozo y gloria. Este convite se ha de recibir, y se ha de ver el reino del amor.
C7                             F

[Verso 4]
F                 Bb          F
Cristo ya viene, pronto, sí, viene; sin tardanza aparecerá. Con él iremos, ¡aleluya!, a la mansión que él nos dará.
C7                             F`},
{id:1129,bookNumber:129,title:'Día de Victoria',artist:'Raúl R. Solís · GLORIA AL SALVADOR',type:'himnos',tone:'Ab',content:`[Himno 129]

[Verso 1]
Ab                 Db          Ab
Día de victoria viene ya, cuando Cristo venga a reinar. Y los redimidos triunfarán, del sepulcro nos levantará.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Cuando Cristo dijo: “Yo vendré”, él nos prometió bella mansión. Y en su promesa confiaré, gozo llenará mi corazón.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
Esta vida pronto pasará, pues lo terrenal terminará. Cristo nos ofrece lo eternal, en la patria celestial.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
¡Oh gloria al Salvador que pronto volverá! Con él yo viviré por toda la eternidad.
Eb7                             Ab`},
{id:1130,bookNumber:130,title:'¡Oh Dios, Qué Mañana!',artist:'STARS FALL · canción religiosa tradicional',type:'himnos',tone:'G',content:`[Himno 130]

[Verso 1]
G                 C          G
¡Oh Dios, qué mañana! ¡Oh Dios, qué mañana! Oh mi Dios, cuando estrellas ya empiecen a caer.
D7                             G

[Verso 2]
G                 C          G
Los hombres llorarán, naciones despertarán, viendo a mi Señor venir; las estrellas caerán.
D7                             G

[Verso 3]
G                 C          G
Los hombres orarán, naciones despertarán, viendo a mi Señor venir; las estrellas caerán.
D7                             G

[Verso 4]
G                 C          G
Cristianos gritarán, naciones despertarán, viendo a mi Señor venir; las estrellas caerán.
D7                             G

[Verso 5]
G                 C          G
Cristianos cantarán, naciones despertarán, viendo a mi Señor venir; las estrellas caerán.
D7                             G`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();