(()=>{
 const s=document.createElement('script');s.src='settings-v2.js?v=2';s.async=false;document.head.appendChild(s);
 const d=document.createElement('script');d.src='exact-home-v1.js?v=1';d.async=false;document.head.appendChild(d);
 const consolidated=document.createElement('script');consolidated.src='la-grey-consolidation-v1.js?v=96';consolidated.async=false;
 consolidated.addEventListener('load',()=>document.documentElement.classList.add('lg-runtime-ready'),{once:true});
 document.head.appendChild(consolidated);
})();