(()=>{
'use strict';
const hymns=[
{id:1181,bookNumber:181,title:'Ten Misericordia de Mí',artist:'Rafael Cuña · MISERICORDIA',type:'himnos',tone:'C',content:`[Himno 181]

[Verso 1]
C                 F          C
Yo sé a quién tendré y cuánto será por la fe; cuánto yo aprovecharé. Ten misericordia de mí, misericordia de mí, misericordia de mí, oh Señor.
G7                             C

[Verso 2]
C                 F          C
Padre, compadécete hoy; en mi aflicción ten piedad. ¡Oh compadécete ya! Ten misericordia de mí, misericordia de mí, misericordia de mí, oh Señor.
G7                             C`},
{id:1182,bookNumber:182,title:'Jesús Me Incluye a Mí',artist:'Johnson Oatman, Jr. · SEWELL',type:'himnos',tone:'Bb',content:`[Himno 182]

[Verso 1]
Bb                 Eb          Bb
Salvo y feliz, pues sé la señal: muy feliz por Jesús ya soy. Él siempre fiel muy seguro estoy; que Jesús me incluye a mí.
F7                             Bb

[Verso 2]
Bb                 Eb          Bb
Gozo al leer: “El que tenga sed venga a la fuente de vida y bien.” ¡Gozo inefable! que Jesús me incluye a mí.
F7                             Bb

[Verso 3]
Bb                 Eb          Bb
Siempre el Espíritu dice: “Ven al que te llama al más alto Edén.” En su llamado sé que Jesús me incluye a mí.
F7                             Bb

[Verso 4]
Bb                 Eb          Bb
Alma infeliz, ven y encontrarás dicha indecible, consuelo y paz. Ven sin tardar y saber podrás que Jesús te incluye a ti.
F7                             Bb

[Verso 5]
Bb                 Eb          Bb
Oh sí, me incluye a mí; en su tierno amor Jesús me incluye a mí.
F7                             Bb`},
{id:1183,bookNumber:183,title:'Gracia Admirable',artist:'John Newton · AMAZING GRACE',type:'himnos',tone:'G',content:`[Himno 183]

[Verso 1]
G                 C          G
Oh gracia admirable, ¡dulce es! que a mí, pecador, salvó. Perdido estaba yo, mas vine a sus pies; fui ciego, visión me dio.
D7                             G

[Verso 2]
G                 C          G
La gracia me enseñó a temer; del miedo libre fui. ¡Cuán bella esa gracia fue en mi ser, la hora en que creí!
D7                             G

[Verso 3]
G                 C          G
Peligro, lucha y tentación por fin los logré pasar; la gracia me libró de perdición y me llevará al hogar.
D7                             G

[Verso 4]
G                 C          G
Después de años mil de estar allí, en luz como la del sol, podremos cantar por tiempo sin fin las glorias del Señor. Amén.
D7                             G`},
{id:1184,bookNumber:184,title:'Gracia Admirable del Dios de Amor',artist:'Julia H. Johnston · MOODY',type:'himnos',tone:'G',content:`[Himno 184]

[Verso 1]
G                 C          G
¡Gracia admirable del Dios de amor, que excede a todo! Su vida ha dado. ¡Qué amor sin par! ¡Gracia gloriosa, maravillosa, que excede toda mi maldad!
D7                             G

[Verso 2]
G                 C          G
Negras las olas de la maldad me amenazaron con perdición; dulce refugio mi corazón halló en la gracia que Dios me da.
D7                             G

[Verso 3]
G                 C          G
Nunca mi mancha podré limpiar sino en la sangre que fluye de la cruz. Hoy sin cesar fluye de la cruz: ¡gracia gloriosa, maravillosa!
D7                             G

[Verso 4]
G                 C          G
Gracia infinita recibirá todo el que crea en el Salvador. Ven, gracia ofrece tu Salvador; ¡gracia gloriosa, maravillosa!
D7                             G`},
{id:1185,bookNumber:185,title:'Alabad a Jehová',artist:'Salmo 107:1 · PUNTA INDIO',type:'himnos',tone:'F',content:`[Himno 185]

[Verso 1]
F                 Bb          F
Alabad a Jehová porque él es bueno; porque para siempre es su misericordia, es su misericordia.
C7                             F

[Verso 2]
F                 Bb          F
Alabad a Jehová porque él es bueno; porque para siempre es su misericordia.
C7                             F`},
{id:1186,bookNumber:186,title:'Si Creyere Puede a Él Venir',artist:'J. Edwin McConnell · MCCONNELL',type:'himnos',tone:'Ab',content:`[Himno 186]

[Verso 1]
Ab                 Db          Ab
¡Oh, qué gozo yo siento en mi corazón! De oscuridad Jesús me sacó; me ha dicho que todo aquel que cree salvo será.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Alabado es Cristo el Redentor; desciende aquí y transforma la vida del pecador. Si creyere puede a él venir; salvará.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
¡Qué merced, qué amor el Señor mostró! En dura cruz las puertas abrió el buen Salvador al gozo celestial. Si creyere puede a él venir; salvará.
Eb7                             Ab`},
{id:1187,bookNumber:187,title:'Vengo, Jesús, a Ti',artist:'William T. Sleeper · JESUS I COME',type:'himnos',tone:'Ab',content:`[Himno 187]

[Verso 1]
Ab                 Db          Ab
De mi tristeza y esclavitud vengo, Jesús, vengo, Jesús; a tu alegría y tu virtud vengo, Jesús, a ti. De mi pobreza y enfermedad a tu salud y rica bondad, a tu presencia, de mi maldad, vengo, Jesús, a ti.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
De mi flaqueza y falta de luz vengo, Jesús, vengo, Jesús; al eminente bien de tu cruz vengo, Jesús, a ti. Del sufrimiento que es terrenal a ti, mi Médico celestial; para ser libre de todo mal, vengo, Jesús, a ti.
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
De mi soberbia y ansiedad vengo, Jesús, vengo, Jesús; para morar en tu voluntad vengo, Jesús, a ti. De mi tristeza a tu gran amor, a lo del cielo consolador; para por siempre darte loor, vengo, Jesús, a ti.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
De ese terror que la tumba da vengo, Jesús, vengo, Jesús; a la brillante luz de tu hogar vengo, Jesús, a ti. De la indecible profundidad a tu redil de tranquilidad; a ver tu faz por la eternidad, vengo, Jesús, a ti.
Eb7                             Ab`},
{id:1188,bookNumber:188,title:'2 Crónicas 7:14',artist:'2 Crónicas 7:14 · ARREPENTIMIENTO',type:'himnos',tone:'C',content:`[Himno 188]

[Verso 1]
C                 F          C
Si se humillare mi pueblo, sobre el cual mi nombre es invocado, y oraren, y buscaren mi rostro, y se convirtieren de sus malos caminos; entonces yo oiré desde los cielos, perdonaré sus pecados y sanaré su tierra.
G7                             C`},
{id:1189,bookNumber:189,title:'Yo Escucho, Buen Jesús',artist:'Lewis Hartsough · WELCOME VOICE',type:'himnos',tone:'Eb',content:`[Himno 189]

[Verso 1]
Eb                 Ab          Eb
Yo escucho, buen Jesús, tu dulce voz de amor, que desde el árbol de la cruz invita al pecador. Yo soy pecador, nada hay bueno en mí; ser objeto de tu amor deseo, y vengo a ti.
Bb7                             Eb

[Verso 2]
Eb                 Ab          Eb
Tú ofreces el perdón de toda iniquidad, si el llanto inunda el corazón que acude a tu piedad. Yo soy pecador, ten de mí piedad; dame llanto de dolor y borra mi maldad.
Bb7                             Eb

[Verso 3]
Eb                 Ab          Eb
Tú ofreces aumentar la fe del que creyó, y gracia sobre gracia dar a quien en ti esperó. Creo en ti, Señor; sólo espero en ti; dame tu infinito amor, pues basta para mí.
Bb7                             Eb`},
{id:1190,bookNumber:190,title:'Salvador, a Ti Acudo',artist:'Fanny J. Crosby · PASS ME NOT',type:'himnos',tone:'Ab',content:`[Himno 190]

[Verso 1]
Ab                 Db          Ab
Salvador, a ti acudo, Príncipe de amor; sólo en ti hay paz y vida para el pecador.
Eb7                             Ab

[Verso 2]
Ab                 Db          Ab
Salvación y paz buscando vengo a tu cruz; en tu muerte esperando, ¡sálvame, Jesús!
Eb7                             Ab

[Verso 3]
Ab                 Db          Ab
Son tus méritos la fuente de mi salvación; en tu sangre yo encuentro vida y perdón.
Eb7                             Ab

[Verso 4]
Ab                 Db          Ab
¡Cristo, Cristo! Alzo a ti mi voz; Salvador, tu gracia dame, oye mi clamor.
Eb7                             Ab`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();