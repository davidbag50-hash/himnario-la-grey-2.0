# La Grey — Ruta de integración para integrantes nuevos v1

## Estado

Diseño de producto. No añade todavía una pantalla ni automatiza decisiones sobre quién puede participar en un ministerio.

## Objetivo

Guiar a una persona desde sus primeros pasos musicales hasta poder integrarse responsablemente al repertorio, ensayo y servicio de su ministerio.

La ruta debe funcionar tanto para alguien que empieza desde cero como para alguien que ya sabe tocar o cantar pero necesita aprender la forma de trabajo de su ministerio.

## Principio central

La Grey acompaña y organiza; no sustituye el criterio pastoral, musical o humano del ministerio.

La aplicación puede mostrar progreso, tareas y preparación, pero no debe declarar automáticamente que una persona está “apta” o “no apta” para servir.

## Separaciones importantes

- Rol administrativo: owner/admin/leader/member.
- Función musical: voz, piano, guitarra, bajo, batería, etc.
- Progreso formativo: qué contenido ha estudiado/practicado.
- Participación en un servicio: decisión concreta del ministerio.

Estas cuatro cosas no se mezclan.

## Track ID estable

`ministry-integration-v1`

El track sirve para hitos comunes de integración. Las lecciones técnicas siguen viviendo en los tracks de cada instrumento o Voz.

## Etapas

### 1. Conocer mi función

Objetivo: que la persona entienda qué hace su instrumento o voz dentro del equipo.

Hitos sugeridos:

- `integration-01-role` — Entiendo mi función dentro del arreglo.
- `integration-02-team-listening` — Sé escuchar al resto del grupo.
- `integration-03-basic-preparation` — Sé cómo prepararme antes de un ensayo.

La Grey usa el perfil musical para recomendar el track correspondiente.

### 2. Fundamentos mínimos

La persona avanza en su track:

- `voice-foundations-v1` y después `voice-advanced-v1`;
- `piano-foundations-v1`;
- `guitar-foundations-v1`;
- `bass-foundations-v1`;
- `drums-foundations-v1`.

No todos necesitan empezar en la primera lección. En el futuro podrá existir una autoevaluación sencilla para ubicar el punto de entrada, sin convertirla en un examen definitivo.

### 3. Mi primer repertorio

La Grey deja de enseñar solo ejercicios genéricos y usa canciones reales del ministerio.

Flujo:

1. mostrar un grupo pequeño de canciones del `ministry_repertoire`;
2. mostrar tonalidad oficial;
3. mostrar notas compartidas;
4. abrir herramientas del instrumento;
5. permitir marcar “estoy trabajando esta canción”;
6. permitir marcar secciones que todavía necesitan práctica.

Hitos:

- `integration-04-first-song`
- `integration-05-three-songs`
- `integration-06-official-keys`

Los números son una guía inicial y no una regla de aptitud.

### 4. Prepararme para un ensayo

Cuando exista un ensayo próximo en el calendario:

La Grey puede mostrar:

- fecha/hora;
- setlist;
- tonalidades oficiales;
- notas del ministerio;
- canciones que el usuario todavía no ha trabajado;
- acceso directo a práctica.

Checklist personal:

- revisé el setlist;
- conozco las estructuras;
- practiqué las secciones difíciles;
- conozco tonos oficiales;
- sé qué dudas llevar al ensayo;
- tengo instrumento/equipo preparado cuando aplique.

Hito:
- `integration-07-rehearsal-ready`

“Preparado” aquí significa que completó su checklist personal, no que La Grey certifica su habilidad.

### 5. Mi primer ensayo

Después del ensayo, la persona puede registrar de forma privada:

- qué salió bien;
- qué necesita practicar;
- qué canciones requieren otra sesión;
- una nota personal para el próximo ensayo.

Hito:
- `integration-08-first-rehearsal`

En una fase futura, el ministerio podrá tener feedback compartido explícito, pero no debe hacerse público por defecto.

### 6. Preparación para servicio

Si el usuario está asignado a un servicio futuro:

La Grey muestra una vista enfocada:

- servicio;
- horario;
- setlist definitivo;
- tono oficial;
- función musical del usuario;
- notas;
- últimas tareas personales.

Hito:
- `integration-09-service-prep`

### 7. Primer servicio y continuidad

Después del servicio:

- marcar experiencia completada;
- registrar una reflexión corta;
- continuar aprendiendo;
- evitar tratar “primer servicio” como final del aprendizaje.

Hito:
- `integration-10-first-service`

## Estado de aprendizaje

Primera versión propuesta:

- no iniciado;
- en progreso;
- completado.

No usar puntuaciones de habilidad ni porcentajes de “aptitud ministerial”.

El porcentaje puede mostrar únicamente contenido completado, por ejemplo “6 de 10 hitos”, no una evaluación del valor o capacidad de la persona.

## Integración con datos existentes

### Perfil

Lee:

- funciones musicales;
- instrumento preferido;
- ministerio actual.

### Repertorio

Lee:

- `ministry_repertoire`;
- `official_tone`;
- notas compartidas.

### Calendario

Lee:

- ensayos;
- servicios;
- setlists.

### Academia

Lee progreso por `track_id` e `item_id`.

### Favoritos

Siguen siendo personales y no representan preparación del ministerio.

## Contexto de eventos

Cuando el usuario ya tiene una ficha del roster, La Grey prioriza sus próximos ensayos/servicios asignados en:

- Inicio;
- Mi Ruta;
- preparación contextual de Academia.

Si todavía no tiene asignaciones, se usa el próximo evento general del ministerio como fallback.

Una respuesta `unavailable` no se prioriza como evento personal de preparación.

## Privacidad

El progreso de aprendizaje es personal por defecto.

No mostrar automáticamente a administradores:

- qué clases abrió una persona;
- qué ejercicios hizo;
- reflexiones personales;
- dificultades declaradas.

Si en el futuro se crea seguimiento por mentor, debe ser una función explícita con visibilidad clara para el usuario.

## Ruta para personas con varias funciones musicales

Ejemplo: cantante + guitarrista.

La Grey puede:

1. mantener un solo track de integración;
2. mostrar dos tracks técnicos;
3. usar el instrumento preferido para priorizar la interfaz;
4. no duplicar los hitos comunes de ensayo/servicio.

## Ruta para alguien que ya tiene experiencia

Debe poder saltar fundamentos manualmente y comenzar en repertorio/ensayo.

No forzar a un músico experimentado a completar lecciones introductorias solo para desbloquear funciones.

## Cómo se conecta con Premium

La ruta de integración básica no debe depender de Premium.

Premium puede añadir:

- cursos avanzados;
- rutas especializadas;
- videos extensos;
- planificación de práctica;
- historial y análisis de progreso;
- mentoría/formación avanzada para equipos.

Pero un integrante nuevo debe poder usar La Grey gratuitamente para:

- entender su función;
- acceder al repertorio;
- ver tonos;
- prepararse para ensayo;
- seguir un setlist;
- completar fundamentos esenciales.

## Primera implementación futura

Cuando se implemente:

1. reutilizar el motor de progreso genérico;
2. no crear otra tabla de progreso;
3. mostrar la ruta solo a usuarios con ministerio;
4. conectar primero repertorio y calendario existentes;
5. empezar con checklist personal y links a recursos;
6. probar con un flujo real de ensayo antes de añadir automatizaciones.

## No implementar todavía

- ranking de integrantes;
- “nivel” público;
- aprobación automática para servir;
- comparación entre miembros;
- IA que decida si alguien está listo;
- feedback público automático;
- asignación automática a servicios.

La Grey debe ayudar a formar personas, no convertir la vida del ministerio en una tabla de puntuaciones.
