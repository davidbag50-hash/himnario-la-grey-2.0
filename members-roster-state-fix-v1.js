(()=>{
'use strict';
let unsubscribe=null,lastKey='';
function start(){
  if(unsubscribe||!window.LAGREY_CLOUD?.subscribe)return;
  unsubscribe=window.LAGREY_CLOUD.subscribe(state=>{
    const key=[state?.mode,state?.user?.id||'',state?.ministry?.id||'',state?.role||'',state?.ready?'1':'0'].join('|');
    if(key===lastKey)return;
    lastKey=key;
    window.dispatchEvent(new CustomEvent('lagrey:cloud-ready',{detail:state||null}));
  });
}
start();
window.addEventListener('lagrey:cloud-ready',start,{once:true});
})();
