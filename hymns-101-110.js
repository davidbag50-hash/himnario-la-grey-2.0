(()=>{
'use strict';
const hymns=[
{id:1101,bookNumber:101,title:'Cristo Su Preciosa Sangre',artist:'Frances R. Havergal · STEPHANOS',type:'himnos',tone:'G',content:`[Himno 101]

[Verso 1]
G                 C          G
Cristo su preciosa sangre en la cruz la dio; por nosotros pecadores la vertió.
D7                             G

[Verso 2]
G                 C          G
Con su sangre tan preciosa hizo redención; y por eso Dios te brinda el perdón.
D7                             G

[Verso 3]
G                 C          G
Es la sangre tan preciosa del buen Salvador, la que quita los pecados y el temor.
D7                             G

[Verso 4]
G                 C          G
Sin la sangre es imposible que haya remisión; por las obras no se alcanza salvación. Amén.
D7                             G`},
{id:1102,bookNumber:102,title:'Jesucristo Fue Inmolado',artist:'R. D. Grullón · INMOLADO',type:'himnos',tone:'Cm',content:`[Himno 102]

[Verso 1]
Cm                 Fm          Cm
Jesucristo fue inmolado por salvarte, pecador; dio su sangre en el Calvario por brindarte salvación.
G7                             Cm

[Verso 2]
Cm                 Fm          Cm
Cual cordero fue llevado, y sus labios él no abrió; mansamente y con arrojo a la muerte se enfrentó.
G7                             Cm

[Verso 3]
Cm                 Fm          Cm
Fue sin mancha y sin pecado, culpa nunca se le halló; sin embargo se ensañaron con mi Cristo, con mi Dios.
G7                             Cm

[Verso 4]
Cm                 Fm          Cm
Él tus culpas y desgracias las llevó con tanto amor. No desprecies su llamado, pecador.
G7                             Cm`},
{id:1103,bookNumber:103,title:'Al Salvador Jesús',artist:'Matthew Bridges · DIADEMATA',type:'himnos',tone:'Eb',content:`[Himno 103]

[Verso 1]
Eb                 Ab          Eb
Al Salvador Jesús canciones por doquier; con gratitud y puro amor entone todo ser. A quien nos redimió en santa caridad, cristianos todos con ardor su nombre celebrad.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Cristo el Salvador, Rey de la eternidad; tributa cantos de loor el coro celestial. Con ellos a una voz, con júbilo sin par, las glorias de su inmenso amor, cristianos, entonad.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Las glorias declarad del Príncipe de paz; es su justicia salvación y su poder bondad. Es digno sólo él de gloria sin igual, pues con su sangre nos abrió el reino celestial.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Rey de la vida es él, del mundo el vencedor; quien a la muerte despojó de todo su terror. En el poder vivid de su resurrección; glorioso el día llegará de plena redención.
Bb7                             Eb`},
{id:1104,bookNumber:104,title:'De Tal Manera Me Amó',artist:'Robert Harkness · WHY SHOULD HE LOVE ME SO?',type:'himnos',tone:'C',content:`[Himno 104]

[Verso 1]
C                 F          C
Crucificado por mí fue Jesús; de tal manera me amó. Sin murmurar fue llevado a la cruz; de tal manera me amó.
G7                             C

[Verso 2]
C                 F          C
El inocente Cordero de Dios, de tal manera me amó. Y por salvarme sufrió muerte atroz; de tal manera me amó.
G7                             C

[Verso 3]
C                 F          C
En mi lugar padeció aflicción; de tal manera me amó. Ya consumó mi eternal salvación; de tal manera me amó.
G7                             C

[Verso 4]
C                 F          C
De tal manera me amó; de tal manera me amó; Cristo en la cruz del Calvario murió; de tal manera me amó.
G7                             C`},
{id:1105,bookNumber:105,title:'Rey de Mi Vida',artist:'Jennie E. Hussey · DUNCANNON',type:'himnos',tone:'Eb',content:`[Himno 105]

[Verso 1]
Eb                 Ab          Eb
Rey de mi vida tú eres hoy; en ti me gloriaré. Es por tu cruz que salvo soy; no te olvidaré.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Mas vi la luz amanecer de la eternidad; te vi, Señor, aparecer con la inmortalidad.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Rey de mi vida, Rey de luz, en ti me gloriaré. Por mí moriste en la cruz; no te olvidaré.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Después de tu Getsemaní subiste a la cruz más cruel; todo sufriste tú por mí; yo quiero serte fiel.
Bb7                             Eb`},
{id:1106,bookNumber:106,title:'Espinas de Mi Cristo',artist:'Rafael Moreno Guillén · ESPINAS DE MI CRISTO',type:'himnos',tone:'Cm',content:`[Himno 106]

[Verso 1]
Cm                 Fm          Cm
Espinas de mi Cristo, claveles de la cruz, que crueles traspasaron las sienes de Jesús.
G7                             Cm

[Verso 2]
Cm                 Fm          Cm
Corona ensangrentada, perdón del pecador; corona dolorosa de nuestro Salvador.
G7                             Cm

[Verso 3]
Cm                 Fm          Cm
Espinas de mi Cristo, claveles de la cruz; espinas de mi Cristo, las sienes de Jesús.
G7                             Cm

[Verso 4]
Cm                 Fm          Cm
Corona ensangrentada, corona de dolor; corona ensangrentada de nuestro Salvador.
G7                             Cm`},
{id:1107,bookNumber:107,title:'Manos Cariñosas',artist:'Alfredo Colom M. · MANOS CARIÑOSAS',type:'himnos',tone:'Dm',content:`[Himno 107]

[Verso 1]
Dm                 Gm          Dm
Manos cariñosas, manos de Jesús; manos que llevaron la pesada cruz. Manos que supieron sólo hacer el bien; ¡gloria a esas manos! ¡Aleluya, amén!
A7                             Dm

[Verso 2]
Dm                 Gm          Dm
Blancas azucenas, lirios de amor, fueron esas manos de mi Redentor. Manos que a los ciegos dieron la visión, con el real consuelo de su gran perdón.
A7                             Dm

[Verso 3]
Dm                 Gm          Dm
Manos que supieron calmar el dolor, ¡oh manos divinas de mi Redentor! Que multiplicaron los panes y el pan; manos milagrosas que la vida dan.
A7                             Dm

[Verso 4]
Dm                 Gm          Dm
Manos que sufrieron el clavo y la cruz; manos redentoras de mi buen Jesús. De esas manos bellas yo dependo hoy; ellas van guiando, pues al cielo voy.
A7                             Dm

[Verso 5]
Dm                 Gm          Dm
¡Oh Jesús!, tus manos yo las vi en visión y vertí mi llanto con el corazón; vi sus dos heridas y la sangre vi, que tú derramaste por salvarme a mí.
A7                             Dm`},
{id:1108,bookNumber:108,title:'Mi Bendito Redentor',artist:'Avis B. Christiansen · REDEEMER',type:'himnos',tone:'Eb',content:`[Himno 108]

[Verso 1]
Eb                 Ab          Eb
Hacia el Calvario mi Salvador una mañana triste subió; y amarga muerte, llena de horror, sobre una cruz él por mí sufrió.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Padre, perdona en oración, a los que hacen muy mal; yo doy por todos mi corazón para que tengan paz celestial.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
¡Oh cuánto le amo, mi amigo fiel! Servirle quiero y honrarle más. Mi vida toda es sólo de él; gloria a su nombre siempre jamás.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
¡Oh qué divino! ¡Oh qué precioso! Miro su cuerpo herido por mí; y hoy canto alegre, vivo gozoso, desde ese día que en él creí.
Bb7                             Eb`},
{id:1109,bookNumber:109,title:'La Cruz Excelsa al Contemplar',artist:'Isaac Watts · HAMBURG',type:'himnos',tone:'Eb',content:`[Himno 109]

[Verso 1]
Eb                 Ab          Eb
La cruz excelsa al contemplar do Cristo allí por mí murió, nada se puede comparar a las riquezas de su amor.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Yo no me quiero, Dios, gloriar más que en la muerte del Señor; lo que más pueda ambicionar lo doy gozoso por su amor.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Ved en su rostro, manos, pies, las marcas vivas del dolor; es imposible comprender tal sufrimiento y tanto amor.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
El mundo entero no será dádiva digna de ofrecer; amor tan grande, sin igual, en cambio exige todo el ser. Amén.
Bb7                             Eb`},
{id:1110,bookNumber:110,title:'En la Cruz',artist:'Isaac Watts · HUDSON',type:'himnos',tone:'Eb',content:`[Himno 110]

[Verso 1]
Eb                 Ab          Eb
Herido, triste, a Jesús mostréle mi dolor; perdido, errante, vi su luz, bendíjome en su amor.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Sobre una cruz mi buen Jesús su sangre derramó por este pobre pecador, a quien así salvó.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Venció a la muerte con poder y el Padre le exaltó; confiar en él es mi placer, morir no temo yo.
Bb7                             Eb

[Verso 4]
Eb                 Ab          Eb
Aunque él se fue, conmigo está el gran Consolador; por él entrada tengo ya al reino del Señor.
Bb7                             Eb

[Verso 5]
Eb                 Ab          Eb
Vivir en Cristo me da paz; con él habitaré; ya suyo soy, y de hoy en más a nadie temeré.
Bb7                             Eb

[Verso 6]
Eb                 Ab          Eb
En la cruz, en la cruz, do primero vi la luz, y las manchas de mi alma yo lavé; fue allí por fe do vi a Jesús, y siempre feliz con él seré.
Bb7                             Eb`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();