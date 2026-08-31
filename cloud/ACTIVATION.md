# La Grey Cloud — Activación

La infraestructura del cliente y las migraciones están preparadas, pero la nube permanece desactivada hasta conectar un proyecto Supabase real.

## 1. Crear proyecto Supabase

Crear un proyecto de desarrollo para La Grey en Supabase.

Guardar solamente estos valores públicos del cliente:

- Project URL
- anon/public key

Nunca copiar ni publicar `service_role` ni secretos privados dentro del repositorio o de la aplicación cliente.

## 2. Aplicar migraciones

Ejecutar, en este orden:

1. `supabase/migrations/20260831_000001_lagrey_cloud_base.sql`
2. `supabase/migrations/20260831_000002_security_hardening.sql`
3. `supabase/migrations/20260831_000003_ministry_invites.sql`

## 3. Activar configuración pública

Editar `cloud/config.js`:

```js
window.LAGREY_CLOUD_CONFIG={
  enabled:true,
  supabaseUrl:'https://TU-PROYECTO.supabase.co',
  supabaseAnonKey:'TU-ANON-PUBLIC-KEY',
  schema:'public'
};
```

La anon key es pública por diseño. La seguridad real depende de Auth + RLS.

## 4. Cargar Cloud desde la app

La integración se concentra en un único cargador:

```html
<script src="cloud/loader.js"></script>
```

`cloud/loader.js` carga, en orden:

- `config.js`
- `data-service.js`
- `supabase-client.js`
- `auth-service.js`
- `ministry-service.js`
- `bootstrap.js`
- `diagnostics.js`

Mientras `enabled=false`, no se crea cliente Supabase ni se realizan consultas de nube.

## 5. Diagnóstico

Con Cloud cargado y un usuario autenticado:

```js
await LAGREY_CLOUD_DIAGNOSTICS.run()
```

Debe comprobar:

- configuración;
- cliente Supabase;
- autenticación;
- perfil;
- membresías;
- ministerios visibles;
- bootstrap;
- lectura de repertorio.

## 6. Prueba de aislamiento obligatoria

Antes de conectar Favoritos/Repertorio a producción, crear dos ministerios de prueba y verificar que:

- usuarios de A no leen B;
- usuarios de B no leen A;
- `member` solo lee repertorio;
- `leader` puede gestionar repertorio y tono;
- `admin` gestiona membresías sin poder modificar al owner;
- el owner no puede transferirse mediante UPDATE normal;
- modificar manualmente `ministry_id` desde el navegador no evade RLS.

Ver también `supabase/tests/README.md`.

## 7. Flujo previsto

- invitado -> `GuestLocalAdapter` -> favoritos/localStorage;
- autenticado sin ministerio -> modo local provisional + opción crear/unirse;
- autenticado con ministerio -> `MinistryCloudAdapter`;
- repertorio y tono oficial -> ministerio;
- preferencias personales -> usuario;
- catálogo de cantos/himnos -> sigue empaquetado/offline.

## Estado

No activar producción hasta disponer de proyecto Supabase real y completar las pruebas RLS.
