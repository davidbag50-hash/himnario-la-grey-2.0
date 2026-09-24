# La Grey Cloud — Política de conflictos y reconciliación v1

## Estado

Diseño técnico basado en el comportamiento que La Grey ya usa.

No introduce un motor nuevo ni reemplaza los fallbacks actuales.

## Objetivo

Mantener una regla simple y predecible cuando un usuario trabaja offline, cambia de dispositivo o recupera conexión.

Principio:

**una modificación local explícita pendiente se intenta subir primero; cuando no existe una modificación local pendiente, la nube es la referencia compartida.**

## Lo que ya existe

### Favoritos personales

- caché local por usuario;
- dirty flag por usuario;
- primera migración conserva favoritos locales;
- después de migrar, un cambio local pendiente calcula altas/bajas frente a Cloud;
- tras sincronizar, Cloud vuelve a ser la referencia.

### Notas personales

- caché local por usuario + canción;
- mapa de notas dirty;
- una nota editada offline se sube antes de volver a descargar esa misma nota;
- una nota vacía equivale a eliminarla.

### Progreso de Academia / Mi Ruta / preparación de setlists

- progreso por `track_id + item_id`;
- cambios pendientes guardan el último estado local del item;
- cada item se sincroniza independientemente;
- completar/descompletar no crea otro sistema de progreso.

### Asignaciones de eventos

- si el esquema/capacidad remota no está disponible, las asignaciones pueden quedar como fallback local;
- cuando Cloud vuelve, La Grey reintenta enviarlas;
- el evento compartido sigue siendo una entidad del ministerio.

### Respuesta personal a eventos

- la respuesta del usuario queda pendiente localmente por evento;
- al recuperar Cloud se reintenta;
- una respuesta pendiente local sustituye temporalmente el estado remoto mostrado a ese usuario;
- al sincronizar se elimina el pendiente.

## Reglas v1

### Datos personales

Para datos privados modificados explícitamente por el usuario:

1. guardar local inmediatamente;
2. marcar la unidad exacta como pendiente;
3. reintentar al recuperar conexión;
4. no sobrescribir esa unidad con una descarga mientras siga dirty;
5. después del éxito, limpiar dirty y aceptar Cloud como referencia.

### Datos compartidos del ministerio

Para repertorio, tonalidades oficiales, notas compartidas, calendario y setlists:

- Cloud es la referencia compartida;
- no fusionar silenciosamente dos ediciones completas del mismo texto/evento;
- una escritura debe respetar permisos actuales;
- si una edición compartida no puede enviarse con seguridad, mantener el último estado confirmado visible y avisar del pendiente cuando corresponda.

## Textos completos

No intentar merge automático de texto libre para:

- notas personales;
- notas compartidas;
- descripciones largas futuras.

En v1 se usa la última edición explícita pendiente del usuario sobre esa unidad.

Un futuro historial/versionado puede permitir comparar cambios; no introducir CRDT ni merge carácter por carácter ahora.

## Sets y checklists

Para datos naturalmente independientes por elemento, usar operaciones por item:

- favoritos: canción;
- aprendizaje: item;
- preparación: canción del evento;
- respuesta: evento + usuario.

Esto reduce conflictos y evita reemplazar colecciones completas innecesariamente.

## Conflictos entre dispositivos

Si dos dispositivos cambian la misma unidad antes de sincronizar:

- v1 no promete merge perfecto;
- gana la última escritura que llegue al servidor para unidades simples;
- el cliente debe refrescar después de confirmar la escritura;
- no presentar esta regla como historial definitivo.

Para contenido crítico futuro se debe añadir versionado antes de ofrecer edición simultánea avanzada.

## Cambio de cuenta

Los pendientes personales deben quedar asociados al ID de usuario que los creó.

Nunca migrar automáticamente:

- favoritos de un usuario autenticado a otro;
- notas privadas entre cuentas;
- progreso entre cuentas;
- respuestas de eventos entre cuentas.

El modo invitado permanece separado.

## Cambio de ministerio

Los fallbacks compartidos deben estar namespaced por `ministry_id`.

Nunca reutilizar:

- asignaciones;
- calendario compartido;
- repertorio;
- notas compartidas

de un ministerio dentro de otro.

## UX

La Grey debe usar estados simples:

- Sincronizado;
- Disponible offline;
- Sincronización pendiente;
- Capacidad Cloud pendiente de activación.

No mostrar terminología técnica de base de datos al usuario normal.

## Futuro

Antes de colaboración simultánea avanzada considerar:

- `updated_at`/version por registro;
- historial para notas/eventos sensibles;
- detección de edición sobre versión obsoleta;
- pantalla de comparación solo cuando realmente haga falta.

## Regla

No añadir un “motor de sincronización universal” pesado mientras los flujos actuales por dominio sigan siendo claros y pequeños.
