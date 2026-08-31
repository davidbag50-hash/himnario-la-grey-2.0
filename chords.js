window.LAGREY_CHORDS = (() => {
  const NOTES_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  const FLAT_TO_SHARP = {"Db":"C#","Eb":"D#","Gb":"F#","Ab":"G#","Bb":"A#"};
  const LATIN = {"C":"Do","C#":"Do#","D":"Re","D#":"Re#","E":"Mi","F":"Fa","F#":"Fa#","G":"Sol","G#":"Sol#","A":"La","A#":"La#","B":"Si"};
  const QUALITY_LABELS = {
    "":"Mayor","m":"Menor","7":"Séptima","maj7":"Mayor 7","m7":"Menor 7",
    "sus2":"Sus2","sus4":"Sus4","dim":"Disminuido","dim7":"Disminuido 7",
    "aug":"Aumentado","6":"Sexta","m6":"Menor 6","add9":"Add9",
    "9":"Novena","maj9":"Mayor 9","m9":"Menor 9"
  };
  const QUALITY_INTERVALS = {
    "":[0,4,7],"m":[0,3,7],"7":[0,4,7,10],"maj7":[0,4,7,11],"m7":[0,3,7,10],
    "sus2":[0,2,7],"sus4":[0,5,7],"dim":[0,3,6],"dim7":[0,3,6,9],
    "aug":[0,4,8],"6":[0,4,7,9],"m6":[0,3,7,9],"add9":[0,4,7,14],
    "9":[0,4,7,10,14],"maj9":[0,4,7,11,14],"m9":[0,3,7,10,14]
  };
  const COMMON_QUALITIES = ["","m","7","maj7","m7","sus2","sus4","dim","dim7","aug","6","m6","add9","9","maj9","m9"];
  const OPEN = {
    "C":[{label:"Abierto",frets:["x",3,2,0,1,0],fingers:["",3,2,"",1,""]},{label:"C/G",frets:[3,3,2,0,1,0],fingers:[4,3,2,"",1,""]}],
    "Cm":[{label:"Cejilla",frets:["x",3,5,5,4,3],fingers:["",1,3,4,2,1]}],
    "C7":[{label:"Abierto",frets:["x",3,2,3,1,0],fingers:["",3,2,4,1,""]}],
    "Cmaj7":[{label:"Abierto",frets:["x",3,2,0,0,0],fingers:["",3,2,"","",""]}],
    "Cadd9":[{label:"Abierto",frets:["x",3,2,0,3,0],fingers:["",2,1,"",3,""]}],
    "D":[{label:"Abierto",frets:["x","x",0,2,3,2],fingers:["","","",1,3,2]},{label:"Cejilla A",frets:["x",5,7,7,7,5],fingers:["",1,3,3,3,1]}],
    "Dm":[{label:"Abierto",frets:["x","x",0,2,3,1],fingers:["","","",2,3,1]}],
    "D7":[{label:"Abierto",frets:["x","x",0,2,1,2],fingers:["","","",2,1,3]}],
    "Dmaj7":[{label:"Abierto",frets:["x","x",0,2,2,2],fingers:["","","",1,1,1]}],
    "Dsus2":[{label:"Abierto",frets:["x","x",0,2,3,0],fingers:["","","",1,3,""]}],
    "Dsus4":[{label:"Abierto",frets:["x","x",0,2,3,3],fingers:["","","",1,3,4]}],
    "E":[{label:"Abierto",frets:[0,2,2,1,0,0],fingers:["",2,3,1,"",""]},{label:"Cejilla A",frets:["x",7,9,9,9,7],fingers:["",1,3,3,3,1]}],
    "Em":[{label:"Abierto",frets:[0,2,2,0,0,0],fingers:["",2,3,"","",""]}],
    "E7":[{label:"Abierto",frets:[0,2,0,1,0,0],fingers:["",2,"",1,"",""]}],
    "Emaj7":[{label:"Abierto",frets:[0,2,1,1,0,0],fingers:["",3,1,2,"",""]}],
    "Esus4":[{label:"Abierto",frets:[0,2,2,2,0,0],fingers:["",1,2,3,"",""]}],
    "F":[{label:"Cejilla",frets:[1,3,3,2,1,1],fingers:[1,3,4,2,1,1]}],
    "Fm":[{label:"Cejilla",frets:[1,3,3,1,1,1],fingers:[1,3,4,1,1,1]}],
    "Fmaj7":[{label:"Abierto",frets:["x","x",3,2,1,0],fingers:["","",3,2,1,""]}],
    "G":[{label:"Abierto",frets:[3,2,0,0,0,3],fingers:[2,1,"","","",3]},{label:"Alternativa",frets:[3,2,0,0,3,3],fingers:[2,1,"","",3,4]}],
    "Gm":[{label:"Cejilla",frets:[3,5,5,3,3,3],fingers:[1,3,4,1,1,1]}],
    "G7":[{label:"Abierto",frets:[3,2,0,0,0,1],fingers:[3,2,"","","",1]}],
    "Gmaj7":[{label:"Abierto",frets:[3,2,0,0,0,2],fingers:[3,2,"","","",1]}],
    "Gsus4":[{label:"Abierto",frets:[3,3,0,0,1,3],fingers:[2,3,"","",1,4]}],
    "A":[{label:"Abierto",frets:["x",0,2,2,2,0],fingers:["","",1,2,3,""]},{label:"Cejilla E",frets:[5,7,7,6,5,5],fingers:[1,3,4,2,1,1]}],
    "Am":[{label:"Abierto",frets:["x",0,2,2,1,0],fingers:["","",2,3,1,""]}],
    "A7":[{label:"Abierto",frets:["x",0,2,0,2,0],fingers:["","",1,"",2,""]}],
    "Amaj7":[{label:"Abierto",frets:["x",0,2,1,2,0],fingers:["","",2,1,3,""]}],
    "Am7":[{label:"Abierto",frets:["x",0,2,0,1,0],fingers:["","",2,"",1,""]}],
    "Asus2":[{label:"Abierto",frets:["x",0,2,2,0,0],fingers:["","",1,2,"",""]}],
    "Asus4":[{label:"Abierto",frets:["x",0,2,2,3,0],fingers:["","",1,2,3,""]}],
    "B":[{label:"Cejilla",frets:["x",2,4,4,4,2],fingers:["",1,3,3,3,1]}],
    "Bm":[{label:"Cejilla",frets:["x",2,4,4,3,2],fingers:["",1,3,4,2,1]}],
    "B7":[{label:"Abierto",frets:["x",2,1,2,0,2],fingers:["",2,1,3,"",4]}]
  };
  const SPECIAL = {
    "D/F#":[{label:"Bajo F#",frets:[2,"x",0,2,3,2],fingers:["T","","",1,3,2]}],"G/B":[{label:"Bajo B",frets:["x",2,0,0,0,3],fingers:["",1,"","","",3]}],"A/C#":[{label:"Bajo C#",frets:["x",4,2,2,2,0],fingers:["",3,1,1,1,""]}],"E/G#":[{label:"Bajo G#",frets:[4,2,2,1,0,0],fingers:[4,2,3,1,"",""]}],"C/E":[{label:"Bajo E",frets:[0,3,2,0,1,0],fingers:["",3,2,"",1,""]}],"Am/G":[{label:"Bajo G",frets:[3,0,2,2,1,0],fingers:[4,"",2,3,1,""]}],"Fmaj9":[{label:"Abierto",frets:[1,0,3,0,1,0],fingers:["T","",3,"",1,""]}],"D#m":[{label:"Cejilla",frets:["x",6,8,8,7,6],fingers:["",1,3,4,2,1]}],"Gb":[{label:"Cejilla",frets:[2,4,4,3,2,2],fingers:[1,3,4,2,1,1]}],"G#m":[{label:"Cejilla",frets:[4,6,6,4,4,4],fingers:[1,3,4,1,1,1]}],"A#m":[{label:"Cejilla",frets:["x",1,3,3,2,1],fingers:["",1,3,4,2,1]}],"C#":[{label:"Cejilla",frets:["x",4,6,6,6,4],fingers:["",1,3,3,3,1]}],"Csus":[{label:"Sus4",frets:["x",3,3,0,1,1],fingers:["",3,4,"",1,1]}],"Dsus":[{label:"Sus4",frets:["x","x",0,2,3,3],fingers:["","","",1,3,4]}],"Gsus":[{label:"Sus4",frets:[3,3,0,0,1,3],fingers:[2,3,"","",1,4]}],"Asus":[{label:"Sus4",frets:["x",0,2,2,3,0],fingers:["","",1,2,3,""]}],"Esus":[{label:"Sus4",frets:[0,2,2,2,0,0],fingers:["",1,2,3,"",""]}]
  };
  const MOVABLE = {
    "":[{label:"Forma E",root:"E",frets:[0,2,2,1,0,0],fingers:[1,3,4,2,1,1]},{label:"Forma A",root:"A",frets:["x",0,2,2,2,0],fingers:["",1,3,3,3,1]}],
    "m":[{label:"Forma Em",root:"E",frets:[0,2,2,0,0,0],fingers:[1,3,4,1,1,1]},{label:"Forma Am",root:"A",frets:["x",0,2,2,1,0],fingers:["",1,3,4,2,1]}],
    "7":[{label:"Forma E7",root:"E",frets:[0,2,0,1,0,0],fingers:[1,3,1,2,1,1]},{label:"Forma A7",root:"A",frets:["x",0,2,0,2,0],fingers:["",1,3,1,4,1]}],
    "maj7":[{label:"Forma Emaj7",root:"E",frets:[0,2,1,1,0,0],fingers:[1,4,2,3,1,1]},{label:"Forma Amaj7",root:"A",frets:["x",0,2,1,2,0],fingers:["",1,3,2,4,1]}],
    "m7":[{label:"Forma Em7",root:"E",frets:[0,2,0,0,0,0],fingers:[1,3,1,1,1,1]},{label:"Forma Am7",root:"A",frets:["x",0,2,0,1,0],fingers:["",1,3,1,2,1]}],
    "sus2":[{label:"Forma Esus2",root:"E",frets:[0,2,4,4,0,0],fingers:[1,2,3,4,1,1]},{label:"Forma Asus2",root:"A",frets:["x",0,2,2,0,0],fingers:["",1,3,4,1,1]}],
    "sus4":[{label:"Forma Esus4",root:"E",frets:[0,2,2,2,0,0],fingers:[1,2,3,4,1,1]},{label:"Forma Asus4",root:"A",frets:["x",0,2,2,3,0],fingers:["",1,2,3,4,1]}],
    "dim":[{label:"Forma Edim",root:"E",frets:[0,1,2,0,"x","x"],fingers:[1,2,4,1,"",""]},{label:"Forma Adim",root:"A",frets:["x",0,1,2,1,"x"],fingers:["",1,2,4,3,""]}],
    "dim7":[{label:"Forma Edim7",root:"E",frets:[0,1,2,0,2,"x"],fingers:[1,2,3,1,4,""]},{label:"Forma Adim7",root:"A",frets:["x",0,1,2,1,2],fingers:["",1,2,3,1,4]}],
    "aug":[{label:"Forma Eaug",root:"E",frets:[0,3,2,1,1,"x"],fingers:[1,4,3,1,2,""]},{label:"Forma Aaug",root:"A",frets:["x",0,3,2,2,"x"],fingers:["",1,4,2,3,""]}],
    "6":[{label:"Forma E6",root:"E",frets:[0,2,2,1,2,0],fingers:[1,3,3,2,4,1]},{label:"Forma A6",root:"A",frets:["x",0,2,2,2,2],fingers:["",1,2,3,4,4]}],
    "m6":[{label:"Forma Em6",root:"E",frets:[0,2,2,0,2,0],fingers:[1,3,4,1,2,1]},{label:"Forma Am6",root:"A",frets:["x",0,2,2,1,2],fingers:["",1,3,4,2,4]}],
    "add9":[{label:"Forma Eadd9",root:"E",frets:[0,2,2,1,0,2],fingers:[1,3,4,2,1,4]},{label:"Forma Aadd9",root:"A",frets:["x",0,2,4,2,0],fingers:["",1,2,4,3,1]}],
    "9":[{label:"Forma E9",root:"E",frets:[0,2,0,1,0,2],fingers:[1,3,1,2,1,4]},{label:"Forma A9",root:"A",frets:["x",0,2,4,2,3],fingers:["",1,2,4,2,3]}],
    "maj9":[{label:"Forma Emaj9",root:"E",frets:[0,2,1,1,0,2],fingers:[1,4,2,3,1,4]},{label:"Forma Amaj9",root:"A",frets:["x",0,2,4,2,4],fingers:["",1,2,4,2,4]}],
    "m9":[{label:"Forma Em9",root:"E",frets:[0,2,0,0,0,2],fingers:[1,3,1,1,1,4]},{label:"Forma Am9",root:"A",frets:["x",0,2,4,1,3],fingers:["",1,2,4,1,3]}]
  };
  function canonicalRoot(root){ return FLAT_TO_SHARP[root] || root; }
  function parseChord(symbol){ const clean=(symbol||"").trim().replace(/[.,;:]+$/ ,""); const m=clean.match(/^([A-G](?:#|b)?)([^/]*?)(?:\/([A-G](?:#|b)?))?$/); if(!m) return null; let q=m[2]||""; if(q==="sus") q="sus4"; return {raw:clean,root:canonicalRoot(m[1]),quality:q,bass:m[3]?canonicalRoot(m[3]):null}; }
  function noteIndex(note){ return NOTES_SHARP.indexOf(canonicalRoot(note)); }
  function spellNotes(symbol){ const p=parseChord(symbol); if(!p) return []; const ints=QUALITY_INTERVALS[p.quality]||QUALITY_INTERVALS[""]; const ri=noteIndex(p.root); return ints.map(i=>NOTES_SHARP[(ri+i)%12]); }
  function inversions(symbol){ const notes=spellNotes(symbol); if(!notes.length) return []; const p=parseChord(symbol),out=[],n=Math.min(notes.length,4); for(let i=0;i<n;i++){ const inv=notes.slice(i).concat(notes.slice(0,i)); out.push({label:i===0?"Fundamental":`${i}ª inversión`,notes:inv,bass:p&&p.bass?p.bass:null}); } return out; }
  function fretFrom(root,openRoot){ const r=noteIndex(root),o=noteIndex(openRoot); return (r-o+12)%12; }
  function transposeShape(template,root){ const shift=fretFrom(root,template.root),base=shift===0?12:shift; return {label:template.label,frets:template.frets.map(f=>typeof f==="number"?f+base:f),fingers:[...template.fingers]}; }
  function movableShapes(symbol){ const p=parseChord(symbol); if(!p||p.bass) return []; return (MOVABLE[p.quality]||[]).map(t=>transposeShape(t,p.root)).filter(v=>{const nums=v.frets.filter(x=>typeof x==="number");return nums.length&&Math.max(...nums)<=16;}); }
  function guitarVariations(symbol){ const clean=(symbol||"").trim().replace(/[.,;:]+$/ ,""); const vals=[...(SPECIAL[clean]||[]),...(OPEN[clean]||[]),...movableShapes(clean)],seen=new Set(); return vals.filter(v=>{const k=JSON.stringify(v.frets);if(seen.has(k))return false;seen.add(k);return true;}); }
  function latin(symbol){ const p=parseChord(symbol); if(!p)return symbol; const main=(LATIN[p.root]||p.root)+(p.quality==="sus4"&&/sus$/.test(symbol)?"sus":p.quality); return main+(p.bass?"/"+(LATIN[p.bass]||p.bass):""); }
  function catalog(){ const out=[]; NOTES_SHARP.forEach(root=>COMMON_QUALITIES.forEach(q=>{const symbol=root+q;out.push({symbol,root,quality:q,label:QUALITY_LABELS[q],notes:spellNotes(symbol)});})); return out; }
  return {NOTES_SHARP,LATIN,QUALITY_LABELS,COMMON_QUALITIES,parseChord,spellNotes,inversions,guitarVariations,latin,catalog};
})();
