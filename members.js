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
document.write('<script src="hymns-301-310.js"><\/script>');

/* Voz + herramientas avanzadas. El diseño v35 se carga directamente desde index.html. */
(()=>{const s=document.createElement('script');s.src='voice.js?v=35';s.onload=()=>{const p=document.createElement('script');p.src='voice-pro.js?v=35';p.defer=true;document.head.appendChild(p)};s.defer=true;document.head.appendChild(s)})();
