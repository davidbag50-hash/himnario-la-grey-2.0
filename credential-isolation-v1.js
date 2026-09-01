(()=>{
'use strict';
const modal=document.getElementById('profileModal');
if(!modal)return;
const email=()=>document.getElementById('profileName');
const password=()=>document.getElementById('profilePassword');

function authStepActive(){
 const p=password();
 if(!p||modal.classList.contains('hidden'))return false;
 const label=p.closest('label');
 return !!label&&!label.classList.contains('hidden');
}

function syncCredentialIsolation(){
 const open=!modal.classList.contains('hidden');
 const user=email();
 const pass=password();
 const auth=authStepActive();

 if(user){
  if(!open){
   user.value='';
   user.disabled=true;
   user.autocomplete='off';
   user.name='lagrey_inactive_profile_field';
  }else{
   user.disabled=false;
   if(auth){
    user.autocomplete='username';
    user.name='lagrey_cloud_email';
   }else{
    user.autocomplete='off';
    user.name='lagrey_profile_field';
   }
  }
 }

 if(pass){
  if(auth){
   pass.disabled=false;
   pass.autocomplete='current-password';
   pass.name='lagrey_cloud_password';
  }else{
   pass.value='';
   pass.disabled=true;
   pass.autocomplete='new-password';
   pass.name='lagrey_inactive_password_field';
  }
 }
}

const observer=new MutationObserver(()=>queueMicrotask(syncCredentialIsolation));
observer.observe(modal,{subtree:true,attributes:true,attributeFilter:['class']});
document.addEventListener('lagrey:profile-changed',syncCredentialIsolation);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncCredentialIsolation()});
window.addEventListener('pageshow',syncCredentialIsolation);
setTimeout(syncCredentialIsolation,0);
setTimeout(syncCredentialIsolation,120);
setTimeout(syncCredentialIsolation,500);
})();