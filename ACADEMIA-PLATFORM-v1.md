# Academia La Grey — Plataforma v1

## Estado

Diseño de producto y arquitectura. No crea todavía una nueva pantalla general de Academia.

## Objetivo

Convertir la formación de La Grey en un sistema coherente de cursos y rutas que lleve al usuario desde fundamentos hasta aplicación real en su ministerio.

La Academia no será una biblioteca de videos desconectados. Cada contenido debe pertenecer a una ruta y terminar conectado con práctica, repertorio, ensayo o servicio.

## Lo que ya existe

- Formación vocal interactiva.
- Curso `voice-advanced-v1`.
- Videos del curso de Voz avanzada.
- Progreso local y sincronizable.
- Modelo genérico `user_learning_progress(track_id,item_id)`.
- Diseños para:
  - `piano-foundations-v1`
  - `guitar-foundations-v1`
  - `bass-foundations-v1`
  - `drums-foundations-v1`
- Ruta común `ministry-integration-v1`.

No duplicar estos sistemas.

## Entidades conceptuales

### Track

Una ruta completa de aprendizaje.

Campos futuros:

- id estable;
- título;
- instrumento/área;
- nivel;
- descripción;
- orden;
- disponibilidad gratuita/premium;
- versión de contenido;
- requisitos opcionales.

### Item

Unidad estable dentro de un track.

Puede ser:

- lección;
- práctica;
- proyecto;
- checklist;
- aplicación al repertorio.

Campos futuros:

- id estable;
- track_id;
- tipo;
- título;
- objetivos;
- contenido;
- recursos;
- duración orientativa;
- referencias a herramientas existentes.

## Tracks iniciales

- `voice-foundations-v1`
- `voice-advanced-v1`
- `piano-foundations-v1`
- `guitar-foundations-v1`
- `bass-foundations-v1`
- `drums-foundations-v1`
- `ministry-integration-v1`

Futuro:

- armonía vocal;
- `piano-intermediate-v1` — implementado;
- guitarra intermedia;
- bajo para worship;
- batería para worship;
- liderazgo musical;
- dirección de ensayos;
- preparación de setlists;
- audio/monitoreo básico.

## Niveles

Usar niveles comprensibles:

- fundamentos;
- intermedio;
- avanzado.

No convertir el nivel en una puntuación pública del usuario.

## Motor de Academia

Una futura UI general debe consumir un catálogo de tracks y reutilizar:

- progreso existente;
- videos existentes;
- ejercicios existentes;
- repertorio;
- tonalidad oficial;
- calendario;
- setlists.

No crear un motor diferente por instrumento.

## Personalización

La Academia puede priorizar cursos según:

1. funciones musicales;
2. instrumento preferido;
3. progreso;
4. repertorio del ministerio;
5. próximos ensayos/setlists.

Ejemplo:

Pianista + track Piano iniciado + ensayo próximo
→ mostrar primero “Continuar Piano” y después “Preparar repertorio del ensayo”.

La personalización prioriza, no bloquea.

## Integración con repertorio

Las etapas avanzadas deben poder abrir una canción real y usar:

- song_id estable;
- tonalidad oficial;
- notas compartidas;
- acordes/diagramas;
- setlist próximo.

No duplicar canciones dentro de Academia.

## Progreso

Fuente:

`user_learning_progress(track_id,item_id)`

Primera versión:

- completado/no completado;
- porcentaje por track;
- continuidad entre dispositivos;
- funcionamiento offline con caché local.

Futuro:

- fecha de práctica;
- tiempo aproximado;
- objetivos;
- historial;
- feedback voluntario;
- recomendaciones.

No crear otra tabla de progreso por instrumento.

## Offline

Contenido textual y herramientas básicas deben seguir disponibles offline cuando ya formen parte de la aplicación o estén cacheados.

Los videos pueden requerir conexión salvo que en el futuro exista una función explícita de descarga/caché.

## Videos

Los videos apoyan la lección; no sustituyen la estructura del curso.

Cada video debe:

- pertenecer a un item estable;
- tener alternativa textual;
- tener práctica asociada;
- poder reemplazarse sin cambiar el ID de la lección.

## IA

V1:
- editorial;
- generación asistida de borradores;
- revisión;
- traducción;
- creación de material.

Futuro:
- explicación contextual;
- recomendación de práctica;
- tutor de contenido.

No usar IA para declarar aptitud musical, diagnosticar voz ni decidir quién debe servir.

## Privacidad

El progreso es privado por defecto.

Un ministerio no recibe automáticamente:
- clases abiertas;
- dificultades;
- prácticas;
- reflexiones.

Una futura mentoría compartida deberá ser explícita y visible.

## Experiencia de usuario

La Academia debe responder tres preguntas:

1. ¿Qué estoy aprendiendo?
2. ¿Qué hago ahora?
3. ¿Cómo lo aplico al repertorio de mi ministerio?

No mostrar un catálogo enorme sin orientación.

## Navegación futura

Inicio de Academia:

- Continuar aprendiendo.
- Ruta recomendada.
- Mis rutas.
- Explorar.
- Preparar repertorio.

Dentro de una ruta:

- progreso;
- módulos;
- próxima lección;
- práctica;
- aplicación al ministerio.

## Relación con Premium

La arquitectura no depende de Premium.

Cada track/item puede tener una política de acceso, pero:
- fundamentos esenciales permanecen útiles gratis;
- Premium añade profundidad, contenido avanzado y acompañamiento;
- el progreso técnico no se borra si una suscripción termina.

La definición comercial vive en un documento separado.

## Orden de implementación

1. Mantener IDs actuales.
2. Crear un catálogo de tracks cuando haya al menos dos rutas con contenido real.
3. Reutilizar el motor de progreso existente.
4. Construir Piano/Guitarra antes de una pantalla general vacía.
5. Crear la pantalla general de Academia cuando pueda mostrar contenido real.
6. Conectar repertorio/setlists.
7. Añadir Bajo/Batería.
8. Añadir expansión premium.
9. Añadir tutor IA al final.

## Regla de producto

No lanzar una “Academia” llena de tarjetas que dicen “próximamente”.

Primero contenido real; después superficie general.
