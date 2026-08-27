(()=>{
'use strict';
const hymns=[
{id:1251,bookNumber:251,title:'Tu Sangre Carmesí',artist:'ZUVERSICHT · Johann Crüger',type:'himnos',tone:'G',content:`[Himno 251]

[Verso 1]
G
Son tu sangre carmesí y tu cuerpo roto
C                         G
sello, Cristo, de tu amor por mí;
D7
sean como eterno emblema.

[Verso 2]
G
Por tu muerte vivo yo, pues viniste a rescatarme;
C                         G
Dios así su amor mostró:
D7                         G
dio a su Hijo por salvarme.

[Verso 3]
G
Las espinas en tu sien, las heridas en tus manos
C                         G
hablan de tu amor y bien,
D7                         G
de tu gracia en perdonarme.

[Verso 4]
G
Cristo, toma el corazón que por fe yo quiero darte;
C                         G
de mi amor es la expresión:
D7                         G
hoy, Señor, me entrego a ti.`},
{id:1252,bookNumber:252,title:'Obediente a Tu Mandato',artist:'James Montgomery · ORDENANZA',type:'himnos',tone:'Eb',content:`[Himno 252]

[Verso 1]
Eb
Obediente a tu mandato participa hoy tu grey
Ab                         Eb
de la cena; y con gozo la recibe nuestra fe.
Bb7
Tu dolor en el Calvario y tu pena y gran amor
Eb
anunciamos en tu nombre, amantísimo Señor.

[Verso 2]
Eb
Recordamos la tristeza que afligió tu corazón,
Ab                         Eb
y la copa de amargura que por todo pecador
Bb7
en el Gólgota tomaste, despreciando tu dolor;
Eb
te pedimos que, fervientes, te sigamos con valor.

[Verso 3]
Eb
Gracias, oh Jesús, te damos los que unidos en tu amor,
Ab                         Eb
gracias mil, pues disfrutamos tu clemencia y tu favor.
Bb7
Tuya fue la cruz, mas nuestra es la dicha y es la paz;
Eb
tuyas sean hoy la gloria, tuyas por siempre jamás.`},
{id:1253,bookNumber:253,title:'Cara a Cara Yo Te Miro Aquí',artist:'Horatius Bonar · LANGRAN',type:'himnos',tone:'F',content:`[Himno 253]

[Verso 1]
F
Cara a cara yo te miro aquí;
Bb                         F
cómo ser inefable de amor;
C7
quiero asir con mi mano tu gran don
y todo mi cansancio en ti dejar.

[Verso 2]
F
Comer quisiera de ese pan de Dios;
Bb                         F
beber contigo el vino real de Dios;
C7
y despreciando el terrenal dolor,
gustar la dulce calma del perdón.

[Verso 3]
F
No tengo ayuda sino sólo a ti;
Bb                         F
sólo tu brazo es fuerte para mí;
C7
este es propicio, bástame en verdad;
mi fuerza está sólo en tu poder.

[Verso 4]
F
Mío el pecado, tuya la equidad;
Bb                         F
mía la culpa, tuyo el perdón.
C7
He aquí el refugio, he aquí mi paz:
F
tu sangre, mi justicia, mi Señor. Amén.`},
{id:1254,bookNumber:254,title:'Tu Cena, Oh Dios',artist:'Joseph F. Green · REYNOLDS',type:'himnos',tone:'F',content:`[Himno 254]

[Verso 1]
F
Tu cena, oh Dios, y el roto pan
Bb                         F
nos hacen recordar, Jesús,
C7
Tu muerte cruenta en dura cruz.

[Verso 2]
F
Tu sacrificio y muerte cruel,
Bb                         F
corona hiriente de laurel,
C7
pues fue la prueba de tu amor;
hoy te adoramos, oh Señor.

[Verso 3]
F
Presente estás en comunión
en nuestro propio corazón,
Bb                         F
y en este culto eres tan real
C7                         F
que tu virtud brota a raudal.

[Verso 4]
F
De cada cual muy cerca estás,
Bb                         F
pues te sentimos más y más.
C7
Tu gracia danos, oh Señor,
y viviremos en tu amor.`},
{id:1255,bookNumber:255,title:'Ardan Nuestros Corazones',artist:'Nicolaus L. von Zinzendorf · CASSELL',type:'himnos',tone:'G',content:`[Himno 255]

[Verso 1]
G
¡Ardan nuestros corazones adorando al Salvador!
C                         G
Y en amor ferviente unidos, busquen paz en el Señor.
D7
De su cuerpo somos miembros, de su luz reflejo fiel;
G
entre hermanos es Maestro, suyos somos, nuestro es él.

[Verso 2]
G
¡Renovad el santo pacto, y acercaos al Señor!
C                         G
Prometed a quien os salva fe, lealtad y puro amor.
D7
Y si un día vacilara vuestra parte en esa unión,
G
a Jesús clamad, oh fieles, por firmeza y por fervor.

[Verso 3]
G
Oh Amor, tú has ordenado: vivifica nuestras almas,
C                         G
líbralas de confusión.
D7
Prende tú la llama viva del amor que así unirá
a los hijos que ha engendrado nuestro Padre celestial.

[Verso 4]
G
La unidad de Dios y el Hijo nadie pueda separar;
C                         G
de esta comunión vivir y seamos en la tierra
D7
los testigos ante el mundo del eterno Salvador. Amén.`},
{id:1256,bookNumber:256,title:'Amémonos, Hermanos',artist:'Juan Bautista Cabrera · MUNICH',type:'himnos',tone:'G',content:`[Himno 256]

[Verso 1]
G
Amémonos, hermanos, con tierno y puro amor;
C                         G
y nuestro Padre es Dios.
D7
Amémonos, hermanos, lo quiere el Salvador,
G
quien su preciosa sangre por todos derramó.

[Verso 2]
G
Amémonos, hermanos, en dulce comunión;
C                         G
perfecta gracia dará el Consolador.
D7
Amémonos, hermanos, y en nuestra santa unión
G
no existan asperezas ni discordante voz.

[Verso 3]
G
Un solo cuerpo, hermanos, al mundo pecador;
C                         G
los que salvados son.
D7
Amémonos, hermanos, con todo el corazón;
G
lo ordena el Dios y Padre; su ley es ley de amor. Amén.`},
{id:1257,bookNumber:257,title:'Después de Haber Oído Tu Palabra',artist:'John Ellerton · ELLERS',type:'himnos',tone:'G',content:`[Himno 257]

[Verso 1]
G
Después, Señor, de haber tenido aquí
de tu palabra la bendita luz,
C                         G
a nuestro hogar condúcenos y allí
D7                         G
de todos cuida, ¡buen Pastor Jesús!

[Verso 2]
G
En nuestras almas graba con poder
tu fiel palabra, cada exhortación;
C                         G
y que tu ley pudiendo comprender,
D7                         G
contigo estemos en mayor unión.

[Verso 3]
G
Danos tu paz, la senda al transitar
de alegrías, pruebas o dolor;
C                         G
y cuando al fin podamos descansar,
D7                         G
nos cubra el manto de tu inmenso amor. Amén.`},
{id:1258,bookNumber:258,title:'Por los Lazos del Santo Amor',artist:'Otis Skillings · BONDS OF LOVE',type:'himnos',tone:'Bb',content:`[Himno 258]

[Verso 1]
Bb
Por los lazos del santo amor,
Eb                         Bb
somos uno en el Señor;
F7
nuestro espíritu y corazón,
hoy cantemos de amor.

[Verso 2]
Bb
Que el mundo vea que somos uno,
Eb                         Bb
unidos por su amor;
F7
que nuestra vida sea canción
Bb
del amor del Salvador.`},
{id:1259,bookNumber:259,title:'Dulce Espíritu',artist:'Doris Akers · MANNA',type:'himnos',tone:'G',content:`[Himno 259]

[Verso 1]
G
Hay un dulce espíritu aquí,
C                         G
y yo sé que es el Espíritu del Señor.
D7
Cada rostro expresa el gozo, sí,
G
pues sentimos la presencia del Salvador.

[Verso 2]
G
Bendiciones puedes recibir
C                         G
si le entregas fiel tu vida a tu Salvador.
D7
Eres tú dichoso al decir:
G
«A Jesús con fe yo siempre le seguiré».

[Coro]
C                         G
Santo Espíritu, fiel, celestial,
D7                         G
llena hoy tu pueblo con tu amor.`},
{id:1260,bookNumber:260,title:'Sagrado Es el Amor',artist:'John Fawcett · DENNIS',type:'himnos',tone:'F',content:`[Himno 260]

[Verso 1]
F
Sagrado es el amor que nos ha unido aquí;
Bb                         F
en Cristo, nuestro Salvador,
C7                         F
somos un cuerpo, sí.

[Verso 2]
F
Señor, rogamos con fervor
que guardes nuestra unión;
Bb                         F
y que tu gracia y bendición
C7                         F
nos llenen el corazón.

[Verso 3]
F
Si hemos de apartarnos ya,
mas nuestra firme unión
Bb                         F
permanezca en el Señor,
C7                         F
y viva en comunión.`}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();