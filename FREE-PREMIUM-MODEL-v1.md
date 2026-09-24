# La Grey — Modelo Gratis y Premium v1

## Estado

Diseño de producto. No implementa cobros, paywalls ni proveedor de pagos.

## Objetivo

Definir una diferencia clara entre Gratis y Premium sin convertir funciones básicas del ministerio en castigo o bloqueo artificial.

La Grey debe ser útil de verdad gratuitamente. Premium debe vender profundidad, formación, acompañamiento y herramientas avanzadas.

## Valores técnicos existentes

La tabla `ministries` ya permite:

- `free`
- `ministry`
- `pro`

No cambiar estos valores todavía.

Hasta definir precios y proveedor, se interpretan únicamente como capacidades futuras.

## Principio principal

No cobrar por resolver el problema básico para el que existe La Grey.

Un ministerio gratuito debe poder organizarse y una persona gratuita debe poder aprender fundamentos.

## Gratis — usuario

Debe incluir:

- catálogo de cantos e himnos;
- búsqueda;
- acordes;
- transposición/herramientas musicales existentes;
- favoritos personales;
- perfil;
- instrumento preferido;
- funciones musicales;
- sincronización básica cuando esté disponible;
- formación vocal básica;
- fundamentos esenciales de instrumento;
- progreso básico;
- acceso al repertorio de su ministerio;
- tonalidades oficiales;
- setlists y calendario que su ministerio comparta.

## Gratis — ministerio

Debe incluir una experiencia completa y útil:

- perfil de ministerio;
- miembros;
- roles administrativos;
- funciones musicales;
- repertorio compartido;
- tonos oficiales;
- notas compartidas;
- setlists;
- ensayos;
- servicios;
- calendario;
- sincronización básica;
- invitaciones y acceso de miembros.

No limitar artificialmente estas funciones solo para obligar a pagar.

## Premium individual

Valor posible:

- rutas completas de Academia;
- niveles intermedios/avanzados;
- biblioteca completa de videos;
- planes de práctica;
- historial detallado;
- objetivos personales;
- recomendaciones según repertorio;
- contenido especializado;
- tutor de Academia cuando exista;
- descargas/offline avanzado de contenido formativo cuando sea viable.

Premium individual no cambia los permisos administrativos del ministerio.

## Plan Ministry / Pro

Valor avanzado para equipos:

- planificación avanzada de ensayos;
- historial de repertorio y setlists;
- métricas de preparación no competitivas;
- rutas formativas para integrantes nuevos;
- mentoría/seguimiento compartido voluntario;
- plantillas de preparación;
- múltiples responsables/formadores;
- herramientas de organización avanzadas;
- biblioteca formativa del ministerio;
- futuras integraciones/exportaciones.

## Nunca usar Premium para

- quitar canciones del catálogo básico;
- impedir ver un setlist al miembro que debe tocarlo;
- ocultar tonalidad oficial;
- impedir recibir información de un ensayo;
- limitar artificialmente el acceso de un miembro a su ministerio;
- borrar progreso si deja de pagar;
- bloquear fundamentos necesarios para empezar;
- mezclar “paga” con “eres mejor músico”.

## Contenido Premium

La diferencia debe estar en:

- profundidad;
- rutas completas;
- acompañamiento;
- especialización;
- contenido avanzado;
- herramientas de análisis;
- ahorro de tiempo para líderes.

No en deteriorar la experiencia gratuita.

## Propiedad del progreso

El progreso pertenece al usuario.

Si Premium termina:
- las clases premium pueden volver a quedar cerradas;
- el progreso ya ganado se conserva;
- sus IDs y registros no se eliminan;
- el usuario mantiene acceso al contenido gratuito.

## Propiedad de datos del ministerio

El ministerio conserva:
- repertorio;
- miembros;
- setlists;
- calendario;
- notas;
- tonalidades.

Cambiar de plan no debe provocar pérdida de datos.

## Límites futuros razonables

Si hacen falta límites para costos reales, deben basarse en recursos costosos, por ejemplo:

- almacenamiento de video propio;
- IA;
- exportaciones pesadas;
- analítica avanzada;
- historial extenso;
- automatizaciones;
- funciones de administración masiva.

No limitar acciones baratas y esenciales solo porque sí.

## Modelo de acceso futuro

Cada capacidad puede tener una clave estable, por ejemplo:

- `academy.voice.advanced`
- `academy.piano.intermediate`
- `learning.practice_plans`
- `ministry.analytics`
- `ministry.training_management`

La UI consulta capacidades; no debe llenar el código de comprobaciones dispersas tipo `plan === 'pro'`.

No implementar este sistema hasta que exista una necesidad comercial real.

## Pagos

Pendiente.

Antes de integrar Stripe u otro proveedor hay que definir:

1. quién paga: usuario, ministerio o ambos;
2. moneda/precios;
3. mensual/anual;
4. prueba gratuita o no;
5. impuestos/facturación;
6. cancelación;
7. qué pasa con un ministerio al bajar de plan;
8. política de reembolso;
9. tiendas móviles y sus reglas si se vende dentro de apps nativas.

No integrar pagos antes de cerrar estas decisiones.

## Propuesta de oferta inicial

Cuando exista suficiente contenido:

### La Grey Gratis

Cancionero + organización básica del ministerio + formación esencial.

### La Grey Premium

Academia completa + rutas avanzadas + seguimiento personal avanzado.

### La Grey Ministry / Pro

Herramientas avanzadas de formación y administración para equipos.

Los nombres comerciales pueden cambiar; las capacidades deben ser independientes del nombre.

## Criterio para lanzar Premium

No lanzar Premium hasta que podamos señalar varias funciones y decir:

“Esto ahorra tiempo o enseña algo que realmente vale pagar.”

No lanzar solo porque técnicamente ya podamos cobrar.
