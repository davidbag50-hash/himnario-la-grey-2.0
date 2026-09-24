# La Grey — Estado de roadmap v1

Fecha de referencia: 2026-09-24.

Este archivo describe el estado técnico/producto actual. Antes de modificar código, verificar `main` porque otros frentes del proyecto pueden haber avanzado.

## Núcleo implementado

### Catálogo

- cantos e himnos con IDs estables;
- búsqueda;
- artistas;
- favoritos;
- acordes;
- afinador;
- PWA/offline;
- validación automática de biblioteca.

### Usuarios y ministerios

- Supabase Auth;
- creación de cuenta;
- creación de ministerio;
- unión mediante invitación;
- owner/admin/leader/member;
- roster;
- funciones musicales separadas de permisos;
- instrumento/función preferida;
- edición segura del propio perfil musical.

### Repertorio

- repertorio compartido;
- tonalidad oficial;
- notas compartidas;
- notas personales privadas;
- favoritos personales sincronizables.

### Organización

- calendario;
- ensayos;
- servicios/eventos;
- setlists;
- asignación estructurada de integrantes;
- múltiples funciones musicales por integrante/evento;
- respuesta Confirmo / Tal vez / No puedo / Pendiente;
- preparación personal por canción de setlist;
- prioridad automática de eventos asignados;
- panel operativo básico para owner/admin/leader.

### Academia

- sección nativa;
- Voz · Fundamentos;
- Voz avanzada;
- Piano · Fundamentos + Intermedio;
- Guitarra · Fundamentos + Intermedio;
- Bajo · Fundamentos + Intermedio;
- Batería · Fundamentos + Intermedio;
- progreso privado;
- sincronización/offline;
- recomendación por función musical y progreso;
- preparación contextual del próximo setlist;
- Mi Ruta de integración al ministerio;
- historial privado de práctica con sincronización offline-first.

### Cloud / seguridad

- RLS y migraciones versionadas;
- diagnóstico desde Ajustes;
- fallbacks offline;
- reintentos de datos pendientes;
- CI de integridad del núcleo.

### SEO actual

- landing pages públicas;
- sitemap;
- deep links `?song=ID`;
- metadata/JSON-LD dinámica por obra.

## Diseñado pero no implementado

- objetivos personales de aprendizaje;
- herramientas avanzadas de ministerio (plantillas, historial, mentoría; resumen operativo básico ya implementado);
- expansión Premium/pagos;
- SEO estático por canción/himno como artefacto de deployment;
- multi-himnario/denominaciones.

## Bloqueado por información o decisión externa

### Multi-himnario

Falta confirmar metadata real del himnario actual. Ver `MULTI-HYMNAL-DENOMINATIONS-v1.md`.

No inventar denominación ni nombre de himnario.

### Supabase producción

Los archivos de migración existen, pero no asumir que todos están aplicados remotamente.

Usar “Estado de nube” dentro de Ajustes para comprobar capacidades reales.

### SEO estático

El diseño existe en `SEO-STATIC-BUILD-v1.md`.

La publicación actual de GitHub Pages funciona. Migrar a un deployment por artefacto debe hacerse de forma deliberada para no romper la PWA.

### Premium / pagos

Modelo definido en `FREE-PREMIUM-MODEL-v1.md`.

No integrar pagos hasta definir precios, quién paga, proveedor y reglas de tiendas.

### Tiendas móviles

Pausado por presupuesto/cuentas de desarrollador.

La PWA sigue siendo la base única.

## Próximas expansiones después de desbloqueos

- más contenido y videos de Academia;
- objetivos personales;
- resumen operativo para líderes;
- plantillas;
- historial de repertorio;
- multi-himnarios;
- SEO estático;
- Premium cuando tenga valor suficiente.

## Regla

No rehacer el núcleo estable para perseguir funciones futuras.

Construir alrededor de lo ya probado y mantener simple la experiencia del usuario.
