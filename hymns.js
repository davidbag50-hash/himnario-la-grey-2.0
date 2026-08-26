(()=>{
'use strict';
const hymns=[
{
 id:1001,
 bookNumber:1,
 title:'Santo, Santo, Santo',
 artist:'Reginald Heber · NICAEA',
 type:'himnos',
 tone:'D',
 content:`[Himno 1]\n\n[Verso 1]\nD                 A7        D\n¡Santo! ¡Santo! ¡Santo! Señor omnipotente,\nG                  D                 A7\nSiempre el labio mío loores te dará;\nD                 G          D       Bm\n¡Santo! ¡Santo! ¡Santo! te adoro reverente,\nEm                 A7              D\nDios en tres Personas, bendita Trinidad.\n\n[Verso 2]\nD                 A7             D\n¡Santo! ¡Santo! ¡Santo! en numeroso coro,\nG                    D              A7\nSantos escogidos te adoran sin cesar,\nD                  G               D       Bm\nDe alegría llenos, y sus coronas de oro\nEm                   A7                D\nRinden ante el trono y el cristalino mar.\n\n[Verso 3]\nD                 A7                 D\n¡Santo! ¡Santo! ¡Santo! la inmensa muchedumbre,\nG                         D               A7\nDe ángeles que cumplen tu santa voluntad,\nD                     G             D       Bm\nAnte ti se postra bañada de tu lumbre,\nEm                    A7               D\nAnte ti que has sido, que eres y serás.\n\n[Verso 4]\nD                 A7                    D\n¡Santo! ¡Santo! ¡Santo! por más que estés velado,\nG                         D                 A7\nE imposible sea tu gloria contemplar;\nD                  G                  D       Bm\nSanto tú eres solo y nada hay a tu lado,\nEm                    A7               D\nEn poder perfecto, pureza y caridad.\n\n[Verso 5]\nD                 A7                   D\n¡Santo! ¡Santo! ¡Santo! la gloria de tu nombre,\nG                         D               A7\nVemos en tus obras en cielo, tierra y mar.\nD                 G                D       Bm\n¡Santo! ¡Santo! ¡Santo! te adora todo hombre,\nEm                 A7              D\nDios en tres Personas, bendita Trinidad. Amén.`
},
{
 id:1002,
 bookNumber:2,
 title:'¡Oh Padre, Eterno Dios!',
 artist:'Vicente Mendoza · ITALIAN HYMN',
 type:'himnos',
 tone:'Eb',
 content:`[Himno 2]\n\n[Verso 1]\nEb              Bb7       Eb\n¡Oh Padre, eterno Dios! Alzamos nuestra voz\nAb           Eb       Bb7\nCon santo ardor, por cuanto tú nos das,\nEb              Ab              Eb\nTu ayuda sin igual, hallando nuestra paz\nBb7          Eb\nEn ti, Señor.\n\n[Verso 2]\nEb                Bb7       Eb\n¡Bendito Salvador! Te damos con amor\nAb             Eb       Bb7\nEl corazón. Y tú nos puedes ver,\nEb                 Ab                Eb\nQue humildes a tu altar venimos a traer,\nBb7             Eb\nPrecioso don.\n\n[Verso 3]\nEb               Bb7       Eb\n¡Espíritu de Dios! Escucha nuestra voz;\nAb              Eb       Bb7\nY tu bondad derrame en nuestro ser\nEb                 Ab               Eb\nDivina claridad, para poder vivir\nBb7             Eb\nEn santidad. Amén.`
},
{
 id:1003,
 bookNumber:3,
 title:'Te Loamos, ¡Oh Dios!',
 artist:'William P. Mackay · REVIVE US AGAIN',
 type:'himnos',
 tone:'G',
 content:`[Himno 3]\n\n[Verso 1]\nG\nTe loamos, ¡oh Dios! Con unánime voz,\nG                         C     G             D\nPues en Cristo tu Hijo nos diste perdón.\n\n[Verso 2]\nG\nTe loamos, Jesús, pues tu trono de luz\nG                          C     G          D\nTú dejaste por darnos salud en la cruz.\n\n[Verso 3]\nG\nTe damos loor, Santo Consolador,\nG                         C      G          D\nQue nos llenas de gozo y santo valor.\n\n[Verso 4]\nG\nUnidos load a la gran Trinidad,\nG                         C     G           D\nQue es la fuente de gracia, poder y verdad.\n\n[Coro]\nG        C  G\n¡Aleluya! Te alabamos,\n                 C    G        D\n¡Oh, cuán grande es tu amor!\nG        C  G\n¡Aleluya! Te adoramos,\n              C  G  D  G\nBendito Señor.`
},
{
 id:1004,
 bookNumber:4,
 title:'A Dios el Padre Celestial',
 artist:'Thomas Ken · DOXOLOGY',
 type:'himnos',
 tone:'Eb',
 content:`[Himno 4]\n\n[Verso 1]\nEb          Gm          Ab       Eb       Fm\nA Dios el Padre celestial, al Hijo nuestro Redentor,\nEb/Bb      Bb7        Eb                 Gm\nY al eterno Consolador,\nAb          Eb       Fm       Eb/Bb  Bb7   Eb\nUnidos todos a alabad.\n\n[Verso 2]\nEb          Gm          Ab       Eb       Fm\nCantad al trino y uno Dios, sus alabanzas entonad;\nEb/Bb      Bb7        Eb                 Gm\nSu eterna gloria proclamad\nAb          Eb       Fm       Eb/Bb  Bb7   Eb\nCon gozo, gratitud y amor.`
},
{
 id:1005,
 bookNumber:5,
 title:'A Nuestro Padre Dios',
 artist:'Estrella de Belén · AMERICA',
 type:'himnos',
 tone:'F',
 content:`[Himno 5]\n\n[Verso 1]\nF                   C7          F\nA nuestro Padre Dios alcemos nuestra voz,\nBb            F                 C7\n¡Gloria a él! Tal fue su amor que dio al Hijo\nF                   Bb            F\nque murió, y así nos redimió;\nC7          F\n¡Gloria a él!\n\n[Verso 2]\nF                    C7          F\nA nuestro Salvador demos con fe loor,\nBb            F                 C7\n¡Gloria a él! Su sangre derramó; con ella\nF                    Bb              F\nnos lavó, y el cielo nos abrió;\nC7          F\n¡Gloria a él!\n\n[Verso 3]\nF                    C7          F\nAl fiel Consolador celebre nuestra voz,\nBb            F                  C7\n¡Gloria a él! Con celestial fulgor nos muestra\nF                    Bb            F\nel amor de Cristo, el Señor;\nC7          F\n¡Gloria a él!\n\n[Verso 4]\nF                   C7          F\nCon gozo y amor cantemos con fervor\nBb             F                 C7\nAl Trino Dios. En la eternidad mora la\nF                    Bb             F\nTrinidad; ¡por siempre alabad,\nC7          F\nAl Trino Dios!`
}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);
for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}
window.LAGREY_HYMNS=hymns;
})();
