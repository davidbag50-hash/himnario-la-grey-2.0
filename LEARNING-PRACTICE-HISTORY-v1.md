# Academia La Grey — Práctica, objetivos e historial v1

## Estado

Diseño de producto y datos.

El historial privado de práctica y los objetivos personales ya están implementados. El progreso actual `user_learning_progress` sigue siendo la fuente de completado de lecciones.

## Objetivo

Añadir profundidad al aprendizaje sin convertir Academia en una competencia ni decidir automáticamente quién está listo para servir.

Debe responder:

1. ¿Qué practiqué?
2. ¿Qué quiero trabajar?
3. ¿Qué debo preparar para mi próximo ensayo/servicio?
4. ¿Cómo he sido constante?

## Principio de privacidad

La práctica es **privada por defecto**.

Un líder o mentor no recibe automáticamente:

- tiempo practicado;
- dificultades;
- notas personales;
- historial;
- objetivos.

Compartir algo con mentoría futura debe ser opt-in, visible y reversible.

## No reutilizar `user_learning_progress`

`user_learning_progress(track_id,item_id)` significa:

- item completado / no completado.

No cargar ahí:

- minutos;
- fecha de práctica;
- dificultad;
- objetivo;
- reflexión.

Eso merece entidades separadas si se implementa.

## Entidades conceptuales futuras

### practice_sessions — implementado

- id
- user_id
- started_at
- duration_minutes opcional
- instrument_or_role
- track_id opcional
- item_id opcional
- song_id opcional
- event_id opcional
- note opcional
- created_at

### learning_goals — implementado

- id
- user_id
- title
- target_type: track / song / event / technique
- target_id
- due_date opcional
- status: active / completed / archived
- created_at
- updated_at

## Primera experiencia útil

No empezar con cronómetro complejo.

V1 futura:

- botón “Registrar práctica”;
- elegir qué trabajaste;
- duración opcional;
- nota opcional;
- vincular canción o lección;
- objetivo personal sencillo.

## Integración con repertorio

Desde una canción del ministerio:

- “Practiqué esta canción”;
- vincular al próximo evento;
- mantener “Mis notas” separado.

Desde un setlist:

- las canciones preparadas siguen usando el checklist actual;
- una sesión de práctica puede complementar ese estado, no sustituirlo.

## Integración con Academia

Una lección puede ofrecer:

- Registrar práctica;
- Crear objetivo;
- Abrir repertorio relacionado.

Completar la lección sigue siendo una acción manual independiente.

## Recomendaciones futuras

La Grey puede recomendar:

- continuar la ruta iniciada;
- revisar una canción pendiente del próximo setlist;
- practicar una técnica asociada a una dificultad marcada voluntariamente.

No debe afirmar:

- “estás listo para servir”;
- “eres mejor/peor que otro integrante”;
- puntuaciones públicas de talento.

## Métricas permitidas

Personales:

- días con práctica;
- sesiones por semana;
- minutos aproximados si el usuario decide registrarlos;
- objetivos completados;
- canciones trabajadas.

Evitar:

- rankings;
- rachas punitivas;
- comparaciones entre integrantes.

## Offline

Si se implementa:

- crear sesiones offline con UUID estable;
- ponerlas en cola por usuario;
- sincronizar por ID;
- no duplicar una sesión al reintentar.

## Premium

Fundamentos:

- registrar práctica básica;
- objetivos básicos;
- ver historial reciente

pueden seguir gratis.

Premium puede añadir:

- planes de práctica;
- historial extendido;
- recomendaciones avanzadas;
- análisis de constancia;
- plantillas especializadas.

No borrar historial si termina Premium.

## Siguiente expansión

1. Validar UX de registro rápido.
2. Definir esquema y RLS.
3. Implementar offline-first.
4. Integrar con Academia.
5. Integrar con repertorio/setlists.
6. Añadir planes y analítica avanzada después.
