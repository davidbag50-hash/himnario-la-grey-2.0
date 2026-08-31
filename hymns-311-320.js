(()=>{
'use strict';
const hymns=[
{id:1311,bookNumber:311,title:"Oh Dios, Mi Soberano Rey",artist:"Autor anónimo · DAUGAVA",type:'himnos',tone:"Dm",content:"[Himno 311]\n\n[Verso 1]\nDm        Dm/C       Dm/Bb        A\nOh Dios, mi Soberano Rey, a ti daré loor;\nGm          Am        Dm      A7  Dm\nTu nombre yo ensalzaré, Santísimo Señor.\n\n[Verso 2]\nDm        Dm/C       Dm/Bb        A\nTus obras evidencias son de infinito amor;\nGm          Am        Dm      A7  Dm\ny cantan con alegre voz las glorias del Señor.\n\n[Verso 3]\nDm        Dm/C       Dm/Bb        A\nAquel que busca salvación, en Cristo la hallará;\nGm          Am        Dm      A7  Dm\na su ferviente petición, él pronto atenderá."}
];
const target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];
})();
