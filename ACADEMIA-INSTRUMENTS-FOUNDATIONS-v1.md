# Academia La Grey — Fundamentos instrumentales v1

## Estado

Diseño de producto y contenido. No activa cursos nuevos en producción todavía.

La Grey ya tiene una implementación madura de Voz y un modelo genérico de progreso de aprendizaje. Este documento define cómo deben crecer Piano, Guitarra, Bajo y Batería sin duplicar sistemas ni convertir la formación en una colección de tutoriales aislados.

## Objetivo

Llevar a una persona desde cero hasta poder preparar y tocar de manera responsable canciones reales del repertorio de su ministerio.

La ruta no termina en “aprendí acordes” o “aprendí ritmos”. Termina cuando el usuario puede:

1. entender su función dentro del arreglo;
2. preparar una canción del repertorio;
3. seguir una tonalidad oficial;
4. ensayar con el grupo;
5. reconocer qué todavía necesita practicar;
6. integrarse gradualmente a un servicio.

## Principios

- La formación básica debe aportar valor incluso en el plan gratuito.
- Premium podrá ampliar profundidad, acompañamiento, rutas avanzadas, videos y seguimiento, pero no quitar los fundamentos.
- Los IDs de cursos y lecciones son contratos estables.
- El catálogo y el repertorio existente se reutilizan; no se crean copias de canciones para Academia.
- La tonalidad oficial del ministerio debe ser la referencia cuando una práctica usa una canción real.
- La formación debe funcionar con contenido fijo y revisado; no depende de IA en tiempo real.
- El progreso usa la estructura genérica `user_learning_progress(track_id,item_id)`.
- Offline debe seguir siendo posible para contenido ya disponible en el dispositivo.
- No se mezclan rol administrativo y función musical.

## Estructura común de una ruta

Cada instrumento usa seis etapas.

### Etapa 0 — Conocer el instrumento

Para alguien que empieza desde cero.

- partes principales;
- postura y ergonomía;
- afinación/preparación;
- nombres de notas o elementos del instrumento;
- cómo practicar sin desarrollar hábitos innecesariamente tensos;
- qué hace ese instrumento dentro de un ministerio.

### Etapa 1 — Fundamentos

Habilidades mínimas para producir notas/ritmos limpios y controlados.

### Etapa 2 — Vocabulario de alabanza

Acordes, patrones, grooves o recursos frecuentes en repertorio congregacional.

### Etapa 3 — Tocar dentro de una canción

Leer estructura, escuchar entradas, seguir tempo, reconocer verso/coro/puente y mantener una parte estable.

### Etapa 4 — Preparar el repertorio del ministerio

La Grey toma canciones del repertorio compartido y usa:

- tonalidad oficial;
- orden del setlist;
- notas compartidas;
- instrumento del usuario.

La práctica deja de ser genérica y se conecta con canciones que el usuario realmente va a tocar.

### Etapa 5 — Preparación para ensayo y servicio

Checklist práctica:

- conozco la estructura;
- puedo tocar mi parte sin detenerme;
- conozco entradas y cortes;
- puedo seguir al líder;
- sé qué partes debo simplificar;
- conozco la tonalidad oficial;
- tengo identificadas las secciones difíciles;
- llego al ensayo con preguntas concretas.

## Track IDs estables

- `piano-foundations-v1`
- `guitar-foundations-v1`
- `bass-foundations-v1`
- `drums-foundations-v1`

Estos IDs no deben cambiar aunque después cambien nombres comerciales, diseño o duración.

---

# Piano — piano-foundations-v1

## P0 — Primer contacto

IDs sugeridos:

- `piano-foundations-01-layout`
- `piano-foundations-02-posture`
- `piano-foundations-03-finger-numbers`
- `piano-foundations-04-first-notes`

Objetivo: ubicarse en el teclado y tocar notas sencillas con control.

## P1 — Acordes esenciales

- tríadas mayores y menores;
- inversiones;
- cambios entre acordes;
- mano derecha e izquierda;
- relación entre cifrado y teclado.

La Grey ya tiene visualización de acordes de piano; la Academia debe reutilizar esa herramienta.

## P2 — Patrones de acompañamiento

- acordes en bloque;
- bajo + acorde;
- arpegios sencillos;
- pulsos de 4/4 y 6/8;
- dinámica entre verso y coro.

## P3 — Canciones

- leer progresiones;
- mantener tempo;
- cambiar inversiones para evitar saltos grandes;
- simplificar cuando sea necesario.

## P4 — Repertorio real

Elegir una canción del ministerio y practicarla en su tonalidad oficial.

## P5 — Ensayo/servicio

Entradas, transiciones, pads/sostenimiento cuando aplique, cortes y comunicación con bajo/batería.

---

# Guitarra — guitar-foundations-v1

## G0 — Primer contacto

- partes de la guitarra;
- postura;
- afinación;
- nombres de cuerdas;
- cómo sostener púa o usar dedos.

## G1 — Acordes esenciales

- acordes abiertos;
- cambios limpios;
- cejilla cuando sea apropiado;
- lectura de diagramas;
- relación entre cifrado y posiciones.

La Grey ya tiene diagramas y variantes; reutilizarlos.

## G2 — Ritmo

- pulso;
- negras y corcheas;
- patrones básicos;
- 4/4;
- 6/8;
- acentos;
- tocar menos para acompañar mejor.

## G3 — Canciones

- progresiones frecuentes;
- capo/transposición como herramienta práctica;
- estructura;
- entradas/cortes.

## G4 — Repertorio real

Practicar canciones del ministerio en tonalidad oficial.

## G5 — Ensayo/servicio

Elegir posición/registro apropiado, no competir con piano y seguir dinámica del equipo.

---

# Bajo — bass-foundations-v1

## B0 — Primer contacto

- partes del bajo;
- postura;
- afinación;
- cuerdas;
- técnica básica de mano derecha/izquierda.

## B1 — Raíces y tiempo

- localizar raíces;
- tocar con metrónomo;
- negras/corcheas;
- silencios;
- duración de nota.

## B2 — Armonía útil

- raíz;
- quinta;
- octava;
- aproximaciones sencillas;
- entender el acorde sin llenar demasiado.

## B3 — Groove y batería

- relación con bombo;
- mantener pulso;
- distinguir patrón estable de adorno.

## B4 — Repertorio real

Preparar líneas simples para canciones del ministerio y luego enriquecerlas solo si son estables.

## B5 — Ensayo/servicio

Entradas, cortes, cambios de dinámica, comunicación con batería y simplificación bajo presión.

---

# Batería — drums-foundations-v1

## D0 — Primer contacto

- piezas de batería;
- postura;
- agarre;
- coordinación básica;
- cuidado auditivo.

## D1 — Pulso y groove

- negras;
- corcheas;
- hi-hat;
- caja;
- bombo;
- groove básico de 4/4.

## D2 — Variaciones

- 6/8;
- dinámica;
- fills cortos;
- transiciones;
- tocar con click.

## D3 — Estructura de canción

- contar compases;
- reconocer entradas;
- preparar cambios;
- evitar fills innecesarios.

## D4 — Repertorio real

Practicar el tempo, estructura y dinámica de canciones del ministerio.

## D5 — Ensayo/servicio

Click cuando se use, count-in, finales, comunicación y control de volumen.

---

# Formato de cada lección

Cada lección debe tener:

- ID estable;
- objetivo;
- explicación corta;
- demostración;
- práctica guiada;
- ejercicio verificable;
- error común;
- aplicación al ministerio;
- criterio de “listo para seguir”;
- enlace opcional a una canción/recurso del repertorio.

No marcar una lección como completada automáticamente solo por abrirla.

## Progreso

Primera versión:

- usuario marca una lección completada;
- porcentaje por track;
- última lección abierta localmente;
- completadas sincronizadas con `user_learning_progress`.

Futuro:

- práctica registrada;
- repeticiones;
- objetivos semanales;
- evaluación del instructor;
- recomendaciones por repertorio;
- rutas avanzadas.

## Integración con perfil

La Grey debe sugerir la ruta correspondiente a las funciones musicales reales del usuario:

- `piano` → Piano;
- `guitar` → Guitarra;
- `bass` → Bajo;
- `drums` → Batería;
- `voice` → Voz;
- múltiples funciones → mostrar rutas correspondientes, priorizando instrumento preferido.

La sugerencia nunca debe impedir explorar otras rutas.

## Integración con repertorio

Cuando el usuario llegue a la etapa de repertorio:

1. leer `ministry_repertoire`;
2. mostrar canciones del ministerio;
3. usar `official_tone`;
4. permitir abrir la canción y herramientas de acordes existentes;
5. mostrar notas compartidas;
6. enlazar con próximos setlists cuando sea útil.

## Orden de implementación recomendado

1. Construir el motor común de rutas/lecciones reutilizando el progreso ya existente.
2. Crear primero contenido inicial de Piano y Guitarra porque La Grey ya tiene herramientas visuales para ambos.
3. Validar la experiencia de principiante.
4. Añadir Bajo.
5. Añadir Batería.
6. Conectar cada ruta con repertorio/setlists.
7. Añadir videos después de validar las lecciones, no antes.
8. Añadir contenido avanzado como expansión de Academia.

## Lo que no se implementa todavía

- tutor IA en tiempo real;
- evaluación automática de habilidad;
- certificaciones;
- paywall de fundamentos;
- recomendaciones algorítmicas complejas;
- generación automática de partes instrumentales.

Primero debe funcionar bien la ruta humana básica: aprender → practicar → repertorio → ensayo → servicio.
