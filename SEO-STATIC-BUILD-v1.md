# La Grey — SEO estático por canción/himno v1

## Estado

Diseño técnico. No genera miles de archivos dentro de `main`.

## Problema actual

La Grey ya tiene:

- sitemaps;
- deep links `?song=ID`;
- metadatos dinámicos;
- JSON-LD dinámico;
- landing pages públicas.

El runtime `song-seo-v1.js` ya actualiza metadatos cuando abre una obra, pero el HTML inicial de GitHub Pages sigue siendo genérico hasta que JavaScript ejecuta.

Para buscadores modernos esto puede funcionar, pero una página estática prerenderizada es más robusta para:

- título;
- description;
- canonical;
- Open Graph;
- JSON-LD;
- previews de enlaces;
- indexación sin depender del render JS.

## Restricción importante

El catálogo global ya contiene miles de cantos, con IDs por encima de 17,500, además de himnos.

No es aceptable guardar manualmente miles de páginas derivadas en la rama fuente:

- infla el repositorio;
- vuelve ruidosos los diffs;
- complica PRs;
- duplica metadatos derivados;
- aumenta riesgo de desincronización.

## Decisión

Las páginas SEO estáticas deben ser **artefactos de despliegue**, generados automáticamente desde el catálogo canónico.

La fuente de verdad sigue siendo:

- `songs.js`;
- `hymns.js`;
- bloques `hymns-XXX-XXX.js`.

## Generador futuro

Un script Node de build debe:

1. crear un sandbox con `window={}`;
2. ejecutar `songs.js`;
3. ejecutar todos los scripts de himnos declarados en `index.html`;
4. leer `window.LAGREY_SONGS`;
5. validar IDs únicos;
6. generar metadata pública por obra;
7. escribir el resultado solo en el directorio temporal de deployment.

No mantener una segunda copia manual del catálogo.

## Ruta pública futura

Formato sugerido:

`/cancion/{id}/{slug}/`

Para himnos, mientras no exista multi-himnario:

`/himno/{id}/{slug}/`

Cuando exista el modelo multi-himnario:

`/himnarios/{hymnal-slug}/{number}-{slug}/`

Los enlaces actuales `?song=ID` deben seguir funcionando.

## Contenido estático por obra

Cada página puede incluir:

- título;
- artista/autor;
- tipo;
- tono base;
- número de himno cuando corresponda;
- descripción breve;
- enlace “Abrir en La Grey”;
- canonical;
- Open Graph;
- JSON-LD.

No duplicar automáticamente la letra completa dentro del HTML SEO.

Razones:

- peso;
- derechos/licencias;
- contenido fuente variable;
- no es necesario para que la página sea útil y descubrible.

## Canonical y compatibilidad

Durante transición:

- páginas estáticas nuevas = canonical;
- `?song=ID` sigue resolviendo en la app;
- los deep links viejos no se rompen;
- sitemap migra de forma gradual a URLs estáticas.

No cambiar todos los canonical hasta verificar deployment real.

## Deployment

La mejor arquitectura con GitHub Pages es:

1. checkout de `main`;
2. ejecutar validación de biblioteca;
3. generar sitio temporal;
4. copiar aplicación actual;
5. generar páginas SEO dentro del sitio temporal;
6. generar sitemap final;
7. publicar el artefacto de Pages.

Esto evita commits automáticos con decenas de miles de archivos.

## Ingesta de catálogo

Los workflows de cantos/himnos deben seguir actualizando el catálogo canónico.

Una publicación del sitio regenerará todas las páginas derivadas a partir del estado final del catálogo.

Por eso no hay que añadir un HTML manual en cada ingestión.

## Antes de activar

Hay que confirmar:

1. que GitHub Pages del repo puede migrarse de publicación directa a GitHub Actions sin afectar la PWA;
2. que `sw.js` y rutas relativas funcionan desde el artefacto;
3. que el deployment mantiene `.nojekyll`;
4. que las URLs existentes siguen funcionando;
5. que el tiempo/tamaño del build de miles de páginas es aceptable;
6. política de copyright/licencias para metadata y snippets.

## Regla

No llenar `main` de páginas generadas.

Fuente pequeña y estable; artefacto público grande y regenerable.
