# La Grey Cloud — base de datos y seguridad

Este directorio contiene las migraciones y pruebas de seguridad de La Grey Cloud.

## Estado

El cliente público ya está configurado para usar Supabase. El estado real del esquema remoto debe verificarse con el diagnóstico de la aplicación; este repositorio no debe asumir que una migración existe en producción solo porque el archivo SQL está aquí.

## Migraciones actuales

En orden:

1. `20260831_000001_lagrey_cloud_base.sql`
2. `20260831_000002_harden_ministry_ownership.sql`
3. `20260831_000003_ministry_invites.sql`
4. `20260831_000004_fix_invite_pgcrypto_search_path.sql`
5. `20260901_000005_ministry_roster_presence.sql`
6. `20260901_000006_roster_member_management.sql`
7. `20260924_000007_ministry_calendar.sql`
8. `20260924_000008_user_favorites.sql`
9. `20260924_000009_learning_progress.sql`
10. `20260924_000010_preferred_music_roles.sql`
11. `20260924_000011_user_song_notes.sql`
12. `20260924_000012_event_member_assignments.sql`

No renombrar migraciones ya aplicadas ni cambiar su orden histórico.

## Principio de seguridad

La interfaz nunca debe confiar en IDs enviados por el navegador.

La seguridad real depende de:

- Supabase Auth;
- Row Level Security;
- funciones/RPCs que vuelven a validar rol y pertenencia.

Nunca distribuir `service_role`.

## Datos de ministerio

Incluyen:

- membresías/roster;
- repertorio;
- tonalidades oficiales;
- notas compartidas;
- calendario;
- ensayos;
- servicios;
- setlists;
- asignaciones estructuradas de integrantes por evento.

La frontera de seguridad es el ministerio.

## Datos personales

Incluyen:

- preferencias;
- favoritos;
- progreso de aprendizaje;
- notas personales por canción.

La frontera de seguridad es el usuario autenticado.

## Catálogo

Canciones e himnos permanecen en los archivos empaquetados de La Grey.

PostgreSQL guarda referencias mediante `song_id` estable. No duplicar el catálogo completo en Supabase.

## Diagnóstico

Con sesión autenticada:

```js
const report = await LAGREY_CLOUD_DIAGNOSTICS.run();
console.table(report.checks);
```

Debe verificarse especialmente cada check `schema:...`.

Ver `../cloud/ACTIVATION.md` para la secuencia completa.

## Pruebas RLS

Ver `tests/README.md`.

Antes de considerar la nube lista:

- usar dos ministerios distintos;
- probar roles owner/admin/leader/member;
- probar acceso cruzado fallido;
- probar tablas personales entre dos usuarios;
- usar únicamente sesiones normales y la clave pública.

## Offline

El fallback local es intencional para mantener La Grey utilizable sin red o mientras una capacidad cloud no esté disponible.

Un fallback exitoso no reemplaza la prueba de sincronización real.
