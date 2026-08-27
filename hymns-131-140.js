(()=>{
'use strict';
const hymns=[
{id:1131,bookNumber:131,title:'Cristo Viene',artist:'John R. MacDuff · BRYN CALFARIA',type:'himnos',tone:'Eb',content:`[Himno 131]

[Verso 1]
Eb                 Ab          Eb
¡Cristo viene! No más guerras ni trabajo ni aflicción; hoy nos trae fe, esperanza. Esta fiel proclamación: Cristo viene, Cristo viene, Cristo viene, Cristo viene. Ven, sí, Príncipe de Paz, ven, oh Príncipe de Paz.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
De esta tierra es la historia de amargura y dolor, pero si se ha de terminar cuando venza el Señor. Cristo viene, Cristo viene, Cristo viene, Cristo viene. Que lo diga hoy la grey, que lo diga hoy la grey.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Y al tener tan grata nueva la debemos compartir; y éste es nuestro mensaje: pueda el mundo oír hoy: Cristo viene, Cristo viene, Cristo viene, Cristo viene. Ven, Jesús, oh pronto ven. Ven, Jesús, oh pronto ven. Amén.
Bb7                             Eb`},
{id:1132,bookNumber:132,title:'Yo Solo Espero Ese Día',artist:'YO SOLO ESPERO ESE DÍA',type:'himnos',tone:'F',content:`[Himno 132]

[Verso 1]
F                 Bb          F
Yo sólo espero ese día cuando Cristo volverá; yo sólo espero ese día cuando él regresará. Entonces iré a su reino inmortal y celestial.
C7                             F

[Verso 2]
F                 Bb          F
No me importa que el mundo me desprecie por doquier; no soy más de este mundo, de la tumba frío no temeré. A Cristo le veré.
C7                             F

[Verso 3]
F                 Bb          F
Entonces allí triunfante y victorioso estaré; mi Señor Jesucristo cara a cara le veré. Con los redimidos al Cordero alabaré.
C7                             F`},
{id:1133,bookNumber:133,title:'Santo Espíritu, Sé Mi Guía',artist:'Mildred Cope · HOLY SPIRIT, BE MY GUIDE',type:'himnos',tone:'D',content:`[Himno 133]

[Verso 1]
D                 G          D
Santo Espíritu, sé mi guía con prontitud; cubra mi maldad y lléname de amor. Hazme atento a tu voz y ven a reinar en mi corazón.
A7                             D

[Verso 2]
D                 G          D
Nunca aquí me abandones; en contrición ven a mí. Mientras tu voz escucho, santifícame, Señor. Santo Espíritu, ven a mí.
A7                             D

[Verso 3]
D                 G          D
Tú no engañas, oh Señor; toma mi corazón. Al que soy, cúbreme hoy. Santo Espíritu, Trino Dios, en mi ser ven a reinar.
A7                             D`},
{id:1134,bookNumber:134,title:'¡Santo Espíritu, Lléname!',artist:'B. B. McKinney · TRUETT',type:'himnos',tone:'Eb',content:`[Himno 134]

[Verso 1]
Eb                 Ab          Eb
¡Oh Santo Espíritu de Dios! Unge mi corazón; tu luz divina brille en mí con todo su esplendor.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
¡Oh Santo Espíritu de Dios! Toma mi voluntad; hazme saber el gran poder de Cristo con claridad.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
¡Oh Santo Espíritu de Dios! Dame tu gran poder; enciende el fuego de tu amor muy dentro de mi ser.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
¡Oh Santo Espíritu de Dios! Escucha mi oración; mi vida entera te la doy en fiel consagración.
Bb7                             Eb

[Verso 5]
Eb                 Ab          Eb
¡Lléname! ¡Lléname! Santo Espíritu, lléname.
Bb7                             Eb`},
{id:1135,bookNumber:135,title:'Ven, Santo Espíritu',artist:'Gloria y William J. Gaither · COME, HOLY SPIRIT',type:'himnos',tone:'F',content:`[Himno 135]

[Verso 1]
F                 Bb          F
Ven y concédenos vida; ven, danos luz para ver. Ven, danos hoy fortaleza; toma, Señor, nuestro ser.
C7                             F

[Verso 2]
F                 Bb          F
Ven a brindarnos descanso; ven a librarnos del mal. Ven a calmar la tristeza dándonos vida eternal.
C7                             F

[Verso 3]
F                 Bb          F
Ven como flor en desierto, dale a nuestra alma solaz; y tu poder nos eleve a tu paraíso de paz.
C7                             F

[Verso 4]
F                 Bb          F
Ven con poder y victoria. Amén.
C7                             F`},
{id:1136,bookNumber:136,title:'Llena, Oh Santo Espíritu',artist:'Isaac H. Meredith · CARSON',type:'himnos',tone:'Eb',content:`[Himno 136]

[Verso 1]
Eb                 Ab          Eb
Llena, oh Santo Espíritu, llena sí hoy nuestro ser; y así la imagen de Cristo otros con fe podrán ver.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Llena, oh Santo Espíritu, para tu gloria mostrar; y así podremos a otros tus bendiciones brindar.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Llena, oh Santo Espíritu, llénanos de santo ardor; para servir en la causa de nuestro gran Salvador.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Llena, llena, Santo Espíritu, para servirte en amor. Amén.
Bb7                             Eb`},
{id:1137,bookNumber:137,title:'Espíritu de Amor',artist:'Carmelo Álvarez Santos · SEMINARIO',type:'himnos',tone:'C',content:`[Himno 137]

[Verso 1]
C                 F          C
Espíritu de amor que estás en nosotros, ven pronto a revelarnos tu santa voluntad.
G7                             C

[Verso 2]
C                 F          C
Espíritu de amor, ven hoy a dirigirnos, y que al vivir podamos hacer tu voluntad.
G7                             C

[Verso 3]
C                 F          C
Espíritu de amor, haz que vivamos en paz, amor y gozo. Sostennos hasta el fin. Amén.
G7                             C`},
{id:1138,bookNumber:138,title:'Divino Espíritu de Dios',artist:'William L. Hendricks · ST. AGNES',type:'himnos',tone:'F',content:`[Himno 138]

[Verso 1]
F                 Bb          F
Divino Espíritu de Dios, enviado por Jesús, del bien condúcenos en pos y alúmbrenos tu luz.
C7                             F

[Verso 2]
F                 Bb          F
Haz comprender al corazón cuán grave es su maldad, y danos el precioso don de andar en santidad.
C7                             F

[Verso 3]
F                 Bb          F
Venza la fuerza de tu luz al fiero tentador; por Cristo quien muriendo en cruz nuestro dolor sufrió.
C7                             F

[Verso 4]
F                 Bb          F
Sé nuestro guía al transitar la senda que él trazó; danos poder y así triunfar, siguiendo de él en pos. Amén.
C7                             F`},
{id:1139,bookNumber:139,title:'Santo Espíritu, Fluye en Mí',artist:'Walt Mills · MILLS',type:'himnos',tone:'G',content:`[Himno 139]

[Verso 1]
G                 C          G
Santo Espíritu, fluye en mí; santo Espíritu, fluye en mí. Mi vida sea señal para ti; santo Espíritu, mora en mí.
D7                             G

[Verso 2]
G                 C          G
Santo Espíritu, mora en mí; santo Espíritu, mora en mí. Las almas quiero ganar para ti; santo Espíritu, usa mi ser.
D7                             G

[Verso 3]
G                 C          G
Santo Espíritu, úsame; santo Espíritu, úsame. Y así verán que tú estás en mí; santo Espíritu, úsame.
D7                             G`},
{id:1140,bookNumber:140,title:'Espíritu de Luz y Amor',artist:'DOMINUS REGIT ME',type:'himnos',tone:'G',content:`[Himno 140]

[Verso 1]
G                 C          G
Espíritu de luz y amor, escucha nuestro ruego; inflama nuestro corazón con tu divino fuego.
D7                             G

[Verso 2]
G                 C          G
Ven a los más vividos del pecado, ya la vida; Espíritu que en el Padre vienes a levantarnos.
D7                             G

[Verso 3]
G                 C          G
Prodiga tu dádiva del Señor Jesús; con tu poder, no tardes. Amén.
D7                             G`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();