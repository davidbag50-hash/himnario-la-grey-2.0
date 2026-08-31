# La Grey Cloud — puesta en marcha

Este directorio contiene la base de datos inicial de La Grey Cloud.

## Estado actual

Todavía no hay credenciales de producción dentro del repositorio y la aplicación pública no depende de Supabase. Las migraciones están preparadas para ejecutarse en un proyecto Supabase cuando se cree.

Migraciones actuales:

1. `migrations/20260831_000001_lagrey_cloud_base.sql`
   - profiles
   - ministries
   - ministry_members
   - ministry_repertoire
   - ministry_song_notes
   - user_preferences
   - triggers de `updated_at`
   - creación automática de perfil al registrar usuario
   - RLS base

2. `migrations/20260831_000002_harden_ministry_ownership.sql`
   - bloquea cambios directos de `owner_user_id`
   - impide modificar/eliminar la membresía `owner` desde el cliente
   - endurece políticas de administración del ministerio

## Principio de seguridad

La interfaz nunca debe confiar en un `ministry_id` enviado por el navegador. La base de datos valida la pertenencia del usuario mediante RLS y las funciones `is_ministry_member` / `has_ministry_role`.

El catálogo de canciones e himnos NO se duplica en PostgreSQL. `ministry_repertoire.song_id` referencia el ID estable que ya existe en los archivos de catálogo de La Grey.

## Primer despliegue

Cuando se cree el proyecto Supabase:

1. Crear el proyecto en una cuenta controlada por el propietario de La Grey.
2. Guardar URL pública y clave pública/anon únicamente en la configuración del cliente que corresponda.
3. Nunca colocar `service_role` en JavaScript, PWA, APK, IPA ni ningún cliente distribuido.
4. Ejecutar las migraciones en orden.
5. Crear usuarios de prueba antes de conectar la aplicación real.
6. Validar aislamiento entre ministerios.
7. Solo después integrar autenticación/repertorio en la UI.

## Matriz mínima de prueba RLS

Crear dos ministerios independientes:

- Ministerio A
  - owner A
  - leader A
  - member A

- Ministerio B
  - owner B
  - leader B
  - member B

Comprobar:

### Lectura

- owner A puede leer Ministerio A.
- member A puede leer Ministerio A.
- cualquier usuario de A NO puede leer Ministerio B.
- cualquier usuario de B NO puede leer Ministerio A.
- usuarios autenticados sin membresía no pueden leer datos privados de A o B.

### Repertorio

- owner/admin/leader A pueden añadir y quitar canciones del repertorio A.
- member A puede leer el repertorio A pero no modificarlo.
- ningún usuario de B puede leer o modificar el repertorio A.
- cambiar manualmente `ministry_id` en una petición no debe saltarse RLS.

### Tono oficial

- owner/admin/leader pueden cambiar `official_tone` del repertorio de su ministerio.
- member solo lo puede leer.
- el valor pertenece al ministerio, no al usuario individual.

### Membresías

- owner/admin pueden administrar miembros no-owner de su ministerio.
- un admin no puede crear otro `owner` desde el cliente.
- un admin no puede editar/eliminar la fila del owner.
- `owner_user_id` no puede cambiarse mediante un UPDATE normal.

### Preferencias personales

- cada usuario solo puede leer/escribir su propia fila en `user_preferences`.
- un usuario no puede leer preferencias privadas de otro.

## Invitado

El invitado no usa estas tablas privadas. Sigue trabajando con el catálogo global y almacenamiento local del dispositivo.

Mientras no exista sesión autenticada con ministerio real:

- favoritos -> localStorage
- tonos personales -> localStorage
- preferencias -> localStorage
- sin acceso a repertorio privado de ministerios

## Orden de integración con la app

1. Cliente de autenticación.
2. Sesión y perfil real.
3. Resolver ministerio activo.
4. Crear capa de datos:
   - GuestLocalAdapter
   - MinistryCloudAdapter
5. Conectar Favoritos/Repertorio.
6. Conectar tono oficial.
7. Añadir caché offline y cola de sincronización.
8. Después: notas, calendario, setlists y suscripciones.

## Regla para distribución móvil

Toda clave incluida en una aplicación cliente debe considerarse pública. La seguridad real debe depender de Auth + RLS. Nunca se distribuirá una clave administrativa `service_role` dentro de la app.
