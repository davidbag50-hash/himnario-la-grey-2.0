# La Grey — Denominaciones, himnarios y biblioteca global v1

## Estado

Diseño de producto y datos. No modifica todavía el catálogo ni la base de datos de producción.

## Objetivo

Permitir que La Grey crezca desde un solo himnario actual hacia múltiples himnarios organizados por denominación o iglesia, sin romper los IDs estables de los himnos existentes y sin limitar la sección global de cantos.

## Decisión principal

**Denominación e himnario preferido son conceptos distintos.**

Una denominación puede:

- no tener himnario definido;
- tener un himnario principal;
- tener varios himnarios;
- cambiar de edición con el tiempo.

Un usuario o ministerio puede pertenecer a una denominación y elegir un himnario diferente como preferido.

## Conceptos

### Denominación

Representa una familia/organización denominacional.

Conceptualmente:

- id estable;
- slug;
- nombre;
- descripción opcional;
- estado activo.

No usar el nombre como clave técnica.

### Himnario

Representa una colección/edición concreta.

Conceptualmente:

- id estable;
- slug;
- nombre;
- denominación opcional;
- iglesia/organización opcional;
- edición/año opcional;
- idioma;
- estado;
- descripción.

Un himnario puede ser interdenominacional o pertenecer a una iglesia concreta, por eso `denomination_id` debe poder ser opcional.

### Entrada de himnario

Relaciona un himno del catálogo global con una colección concreta.

Conceptualmente:

- hymnal_id;
- song_id estable;
- número dentro de ese himnario;
- título mostrado opcional;
- orden;
- metadatos de edición opcionales.

Restricción futura:

- único por `(hymnal_id, number)`;
- único por `(hymnal_id, song_id)` salvo que aparezca más de una vez por una razón explícita.

## IDs actuales

Los IDs existentes de La Grey no se cambian.

Ejemplo actual:

- himno número 1 → song_id 1001;
- himno número 311 → song_id 1311.

Ese `song_id` sigue siendo el identificador global de la obra/entrada actual en La Grey.

No renumerar ni reutilizar IDs para encajar un segundo himnario.

## Qué pasa con bookNumber

El campo actual `bookNumber` se mantiene por compatibilidad.

Mientras exista un solo himnario histórico en la app, representa su numeración actual.

Cuando se implemente multi-himnario:

- la numeración canónica por colección vivirá en `hymnal_entries.number`;
- `bookNumber` seguirá sirviendo como compatibilidad del himnario original hasta completar una migración segura;
- no borrar `bookNumber` en la primera versión.

## Himnos compartidos entre himnarios

Si la misma obra aparece en dos himnarios con números distintos:

- conservar el mismo `song_id` cuando el contenido sea esencialmente la misma obra;
- crear dos `hymnal_entries`;
- cada entrada tiene su propio número.

Ejemplo conceptual:

`song_id 1050`
- Himnario A → #50
- Himnario B → #127

No duplicar la obra solo por el número.

## Variantes de letra

Futuro, no v1.

Si dos himnarios contienen variantes importantes de letra/versos, no meter texto alternativo de manera improvisada dentro de `hymnal_entries`.

Diseñar después una entidad de versión/variante del himno que conserve relación con la obra base.

Para la primera implementación multi-himnario, usar solo himnos cuyo contenido compartido sea suficientemente compatible.

## Preferencias

### Usuario

Debe poder tener:

- denominación opcional;
- himnario preferido opcional.

Son campos independientes.

### Ministerio

Debe poder tener:

- denominación opcional;
- himnario principal/preferido opcional.

La preferencia del ministerio sirve como default para miembros cuando ellos no hayan elegido una preferencia personal.

## Resolución automática

Orden sugerido para decidir qué himnario mostrar por defecto:

1. himnario preferido del usuario;
2. himnario preferido del ministerio;
3. himnario recomendado para la denominación del usuario/ministerio;
4. himnario general/predeterminado de La Grey.

Siempre permitir cambiar manualmente.

## Sección de Himnos

Debe evolucionar a:

- selector de himnario;
- búsqueda dentro del himnario actual;
- número del himno según la colección;
- posibilidad futura de explorar por denominación.

La experiencia inicial debe seguir simple: si el usuario ya tiene un himnario preferido, no obligarlo a escoger cada vez.

## Sección de Cantos

**Permanece global.**

No filtrar automáticamente el catálogo de cantos a una denominación.

Puede contener:

- artistas de distintas iglesias;
- estilos distintos;
- canciones usadas por múltiples denominaciones;
- etiquetas futuras.

La denominación puede ayudar a recomendar, pero no a encerrar el catálogo.

## Biblioteca global

El catálogo global conserva:

- song_id estable;
- título;
- artista/autor;
- tipo;
- tono base;
- contenido;
- metadatos musicales.

Futuro:

- estilos;
- temas;
- idiomas;
- autores/compositores estructurados;
- fuente;
- licencias/derechos;
- etiquetas denominacionales como contexto, no como propiedad exclusiva.

## Modelo de datos futuro sugerido

### denominations

```text
id
slug
name
description
active
created_at
updated_at
```

### hymnals

```text
id
slug
name
denomination_id nullable
organization_name nullable
edition nullable
language
active
created_at
updated_at
```

### hymnal_entries

```text
hymnal_id
song_id
number
display_title nullable
sort_order
created_at
```

### preferencias

Extender en el futuro:

```text
profiles / user_preferences:
denomination_id nullable
preferred_hymnal_id nullable

ministries:
denomination_id nullable
preferred_hymnal_id nullable
```

No implementar todavía hasta definir el himnario actual con nombre/denominación/edición reales.

## Migración futura del himnario actual

Antes de tocar producción se debe confirmar:

1. nombre oficial de la colección actual;
2. denominación u organización, si aplica;
3. edición/año, si se conoce;
4. si los números 1–311 corresponden exactamente a esa edición;
5. si existen permisos/licencias necesarios para distribuir el contenido.

Después:

1. crear denominación si corresponde;
2. crear registro de himnario;
3. crear `hymnal_entries` usando los `song_id` actuales;
4. conservar `bookNumber`;
5. validar que ningún ID o número cambió;
6. recién después añadir selector de himnario a la UI.

## SEO futuro

Las páginas públicas deberían poder distinguir:

- obra/himno;
- himnario;
- número dentro del himnario.

URL futura estable sugerida conceptualmente:

`/himnarios/{hymnal-slug}/{number}-{slug}`

No migrar hoy los enlaces `?song=ID`; conservarlos como URLs válidas/canónicas hasta diseñar redirecciones seguras.

## Personalización

Ejemplos:

Usuario:
- denominación X;
- himnario preferido B;
- pianista.

Inicio:
- recursos de piano priorizados;
- sección Himnos abre B;
- cantos siguen globales.

Ministerio:
- denominación X;
- himnario principal A.

Miembro sin preferencia personal:
- recibe A por defecto.

Miembro que eligió B:
- conserva B.

## Orden de implementación recomendado

1. Confirmar metadata real del himnario actual.
2. Crear tablas `denominations`, `hymnals`, `hymnal_entries`.
3. Migrar el himnario actual sin cambiar IDs.
4. Añadir preferencias de ministerio.
5. Añadir preferencia personal.
6. Añadir selector simple en Himnos.
7. Incorporar segundo himnario.
8. Validar numeración/búsqueda/offline.
9. Expandir SEO por himnario.
10. Solo después estudiar variantes de letra.

## Lo que no se hace todavía

- renumerar himnos existentes;
- asignar una denominación al catálogo actual sin confirmación;
- duplicar canciones por denominación;
- filtrar Cantos a una sola iglesia;
- diseñar variantes complejas de letra antes de necesitarlo;
- cambiar URLs públicas actuales de golpe.

## Regla de compatibilidad

Agregar un nuevo himnario nunca debe romper:

- favoritos;
- repertorios;
- setlists;
- notas;
- tonalidades;
- enlaces;
- progreso;
- IDs existentes.

La relación con un himnario es metadata adicional alrededor del catálogo estable, no una razón para reconstruirlo.
