window.LAGREY_MEMBERS=[
 {id:'cristian',name:'Cristian',aliases:['cristian'],roles:['Todos los instrumentos','Voz'],instrument:'all',icon:'🎹🎸🎤'},
 {id:'nicole',name:'Nicole',aliases:['nicole','nicol','nícol'],roles:['Piano','Voz'],instrument:'piano',icon:'🎹🎤'},
 {id:'diego',name:'Diego',aliases:['diego'],roles:['Piano'],instrument:'piano',icon:'🎹'},
 {id:'alberto',name:'Alberto',aliases:['alberto'],roles:['Guitarra','Voz'],instrument:'guitar',icon:'🎸🎤'},
 {id:'nodier',name:'Nodier',aliases:['nodier'],roles:['Voz'],instrument:'voice',icon:'🎤'},
 {id:'heather',name:'Heather',aliases:['heather'],roles:['Voz'],instrument:'voice',icon:'🎤'},
 {id:'carol',name:'Carol',aliases:['carol'],roles:['Voz'],instrument:'voice',icon:'🎤'},
 {id:'david',name:'David',aliases:['david'],roles:['Voz'],instrument:'voice',icon:'🎤'}
];

/* Himnos 201-300: carga sincrónica antes de app.js para que formen parte del repertorio desde el arranque. */
document.write('<script src="hymns-201-210.js"><\/script>');
document.write('<script src="hymns-211-220.js"><\/script>');
document.write('<script src="hymns-221-230.js"><\/script>');
document.write('<script src="hymns-231-240.js"><\/script>');
document.write('<script src="hymns-241-250.js"><\/script>');
document.write('<script src="hymns-251-260.js"><\/script>');
document.write('<script src="hymns-261-270.js"><\/script>');
document.write('<script src="hymns-271-280.js"><\/script>');
document.write('<script src="hymns-281-290.js"><\/script>');
document.write('<script src="hymns-291-300.js"><\/script>');

/* Entrenamiento vocal: módulo independiente para no tocar la lógica estable de app.js. */
(()=>{const s=document.createElement('script');s.src='voice.js';s.defer=true;document.head.appendChild(s)})();
