(()=>{
'use strict';

/*
 * La Grey Cloud — configuración pública del cliente.
 *
 * IMPORTANTE:
 * - SUPABASE_URL y SUPABASE_ANON_KEY son valores PUBLICABLES del cliente.
 * - NUNCA colocar aquí service_role, secretos de pago ni claves privadas.
 * - Mientras enabled=false, La Grey conserva el comportamiento local actual.
 */
window.LAGREY_CLOUD_CONFIG={
  enabled:false,
  supabaseUrl:'',
  supabaseAnonKey:'',
  schema:'public'
};
})();
