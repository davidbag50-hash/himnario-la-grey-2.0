# La Grey Cloud — Activación y verificación

## Estado actual

La configuración pública del cliente está activa en `cloud/config.js`.

Eso significa que La Grey **ya intenta iniciar Supabase** cuando la aplicación carga. Este documento ya no describe una nube “apagada”; ahora sirve para comprobar que el proyecto remoto tenga todas las migraciones necesarias y que cada capacidad funcione con RLS.

Nunca colocar `service_role`, secret keys, secretos de pago ni claves privadas en el repositorio o cliente.

## Migraciones requeridas

Aplicar **en este orden**, sin saltos:

1. `20260831_000001_lagrey_cloud_base.sql`
   - perfiles
   - ministerios
   - membresías
   - repertorio
   - notas compartidas
   - preferencias base
   - RLS inicial

2. `20260831_000002_harden_ministry_ownership.sql`
   - endurece propiedad del ministerio
   - protege al owner

3. `20260831_000003_ministry_invites.sql`
   - invitaciones

4. `20260831_000004_fix_invite_pgcrypto_search_path.sql`
   - corrige el `search_path` de invitaciones

5. `20260901_000005_ministry_roster_presence.sql`
   - roster del ministerio
   - funciones musicales
   - instrumento preferido inicial

6. `20260901_000006_roster_member_management.sql`
   - administración segura de miembros
   - RPCs de edición

7. `20260924_000007_ministry_calendar.sql`
   - calendario compartido
   - ensayos
   - servicios/eventos
   - setlists

8. `20260924_000008_user_favorites.sql`
   - favoritos personales sincronizados

9. `20260924_000009_learning_progress.sql`
   - progreso genérico de Academia/Mi Ruta/setlists

10. `20260924_000010_preferred_music_roles.sql`
    - amplía función/instrumento preferido a Bajo y Batería

11. `20260924_000011_user_song_notes.sql`
    - notas personales privadas por canción

12. `20260924_000012_event_member_assignments.sql`
    - integrantes asignados a ensayos/servicios
    - funciones musicales por evento
    - snapshot de nombre para historial

13. `20260924_000013_self_music_profile.sql`
    - permite que cada miembro edite sus propias funciones musicales
    - permite cambiar su instrumento/función preferida
    - no permite modificar rol administrativo, identidad ni otro miembro

14. `20260924_000014_event_participation_response.sql`
    - respuesta personal a ensayos/servicios asignados
    - estados confirmado / tal vez / no disponible
    - un miembro solo puede responder por su propia ficha y si está asignado

## Cómo comprobar el estado real

Con La Grey abierta, autenticado:

```js
const report = await LAGREY_CLOUD_DIAGNOSTICS.run();
console.table(report.checks);
report.summary;
```

El diagnóstico comprueba:

- configuración;
- cliente Supabase;
- existencia del esquema esperado;
- autenticación;
- perfil;
- membresías;
- ministerios;
- bootstrap;
- repertorio;
- calendario;
- favoritos;
- progreso de aprendizaje;
- notas personales.

Los checks con nombre `schema:...` permiten detectar una migración que aún no está aplicada.

## Importante sobre fallbacks

Varias funciones nuevas tienen fallback local/offline para no romper la aplicación cuando la tabla remota todavía no existe.

Eso **no significa** que la función esté sincronizando en nube.

Ejemplos:

- calendario puede seguir local si falta el esquema compartido;
- favoritos pueden seguir locales;
- progreso puede seguir local;
- notas personales pueden seguir locales.

Por eso la verificación del diagnóstico es obligatoria antes de dar una capacidad cloud por activada.

## Prueba de aislamiento obligatoria

Crear como mínimo:

- Ministerio A
  - owner A
  - admin/leader A
  - member A
- Ministerio B
  - owner B
  - member B

Verificar:

### Ministerios y miembros

- A no puede leer datos privados de B.
- B no puede leer datos privados de A.
- `member` no puede administrar miembros.
- `admin` no puede editar/eliminar al owner.
- `owner_user_id` no se cambia mediante un UPDATE normal.

### Repertorio

- owner/admin/leader pueden administrar repertorio.
- member solo lee.
- tono oficial y notas compartidas pertenecen al ministerio.

### Calendario

- cualquier miembro puede leer eventos de su ministerio.
- owner/admin/leader pueden crear/editar/eliminar eventos.
- member no puede escribir eventos.
- un usuario de otro ministerio no puede leer ni modificar esos eventos.

### Datos personales

Cada usuario solo puede leer/escribir los suyos:

- `user_preferences`
- `user_favorites`
- `user_learning_progress`
- `user_song_notes`

Cambiar manualmente `user_id` o `ministry_id` desde el navegador no debe saltarse RLS.

## Catálogo y offline

El catálogo global de canciones e himnos sigue empaquetado en la aplicación y no se duplica en PostgreSQL.

Los IDs de canciones/himnos siguen siendo los IDs estables usados por:

- repertorio;
- favoritos;
- setlists;
- notas;
- progreso vinculado a canciones;
- SEO.

La nube complementa el catálogo, no lo sustituye.

## Criterio de aprobación

Considerar La Grey Cloud plenamente activa solo cuando:

1. las 14 migraciones estén aplicadas;
2. `LAGREY_CLOUD_DIAGNOSTICS.run()` no reporte capacidades faltantes;
3. las pruebas RLS entre dos ministerios pasen;
4. se confirme comportamiento offline y reconciliación al recuperar conexión.

No asumir estado remoto únicamente porque `cloud/config.js` tenga `enabled:true`.
