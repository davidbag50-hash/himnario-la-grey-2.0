# La Grey Cloud — Arquitectura base v1

## Objetivo

Convertir La Grey de una PWA local en una plataforma para ministerios de alabanza, manteniendo el catálogo global de cantos/himnos y el funcionamiento offline, pero sincronizando en la nube los datos que pertenecen a cada ministerio y a cada usuario.

## Principios

1. El catálogo global de cantos e himnos sigue siendo común para todos y mantiene sus IDs actuales.
2. Los IDs de canciones/himnos son contratos estables: nunca se reutilizan para otra obra.
3. El repertorio pertenece al ministerio, no a un usuario individual.
4. El invitado no pertenece a ningún ministerio y conserva favoritos/configuración en localStorage.
5. Las preferencias personales pertenecen al usuario.
6. Los datos compartidos del grupo pertenecen al ministerio.
7. La seguridad debe imponerse en la base de datos/backend, no solo en JavaScript.
8. La app debe seguir funcionando offline con una copia local sincronizable.
9. La nube se integra por una capa de servicios para no acoplar la UI directamente al proveedor.

## Entidades iniciales

### profiles
Perfil real del usuario autenticado.

Campos base:
- id
- display_name
- created_at
- updated_at

### ministries
Representa una agrupación o ministerio.

Campos base:
- id
- name
- slug
- owner_user_id
- plan
- created_at
- updated_at

### ministry_members
Relaciona usuarios con ministerios y define permisos.

Campos base:
- ministry_id
- user_id
- role
- status
- joined_at

Roles iniciales sugeridos:
- owner
- admin
- leader
- member

### ministry_repertoire
Representa el repertorio compartido de un ministerio.

Campos base:
- id
- ministry_id
- song_id
- song_type
- official_tone
- added_by
- added_at
- updated_at

Restricción importante:
- único por (ministry_id, song_id)

### ministry_song_notes
Notas compartidas visibles por los miembros del ministerio.

Campos base:
- id
- ministry_id
- song_id
- body
- updated_by
- updated_at

### user_preferences
Preferencias privadas de cada usuario.

Campos posibles:
- user_id
- preferred_instrument
- notation
- font_size
- autoscroll_speed
- language
- updated_at

## Invitado

El perfil invitado no tendrá cuenta ni ministry_id.

Comportamiento:
- usa catálogo global;
- favoritos locales;
- tonos locales;
- preferencias locales;
- no puede leer información privada de ministerios;
- no sincroniza datos entre dispositivos.

## Repertorio de ministerio

La sección hoy llamada Favoritos evoluciona para miembros autenticados hacia el repertorio compartido del ministerio.

Ejemplo:

La Grey -> song_id 58 -> tono oficial G

Todos los miembros autorizados de La Grey reciben esa misma entrada.

Para un invitado, la misma interfaz puede seguir usando sus favoritos locales.

## Tono oficial y tono personal

Se separan dos conceptos:

- tono oficial del ministerio: compartido con todos;
- ajustes personales: privados del usuario/dispositivo.

El tono oficial debe vivir en ministry_repertoire. La transposición existente de La Grey podrá usar ese valor como tono predeterminado para miembros del ministerio.

## Arquitectura de acceso a datos

La interfaz no debe consultar directamente Supabase u otro proveedor.

Contrato conceptual:

- getCurrentProfile()
- getCurrentMinistry()
- getRepertoire()
- addToRepertoire(songId)
- removeFromRepertoire(songId)
- setOfficialTone(songId, tone)
- getSharedSongNotes(songId)
- saveSharedSongNotes(songId, body)

Implementaciones:

- GuestLocalAdapter -> localStorage
- MinistryCloudAdapter -> nube + caché local/offline

## Seguridad mínima

Las reglas del backend deben garantizar:

- un usuario solo puede leer ministerios a los que pertenece;
- un usuario solo puede leer repertorios de sus ministerios;
- solo roles autorizados pueden modificar repertorio, tonos o notas;
- cambiar ministry_id desde el navegador no debe permitir acceso a otro grupo;
- el invitado no obtiene acceso a tablas privadas.

## Offline

La Grey debe conservar su comportamiento offline.

Estrategia inicial:
- catálogo sigue empaquetado en la aplicación;
- último repertorio sincronizado se guarda localmente;
- lectura offline usa caché local;
- escrituras realizadas sin conexión se pueden encolar para sincronizar después;
- conflictos se resolverán en una fase posterior con una política explícita.

## Fases

### Fase 1 — Base
- autenticación real;
- profiles;
- ministries;
- ministry_members;
- ministry_repertoire;
- permisos/RLS;
- invitado local sin cambios.

### Fase 2 — Repertorio sincronizado
- Favoritos de miembros pasan a repertorio de ministerio;
- Cantos/Himnos siguen separados en la interfaz;
- tono oficial compartido.

### Fase 3 — Trabajo de grupo
- notas compartidas;
- calendario en nube;
- setlists compartidos;
- roles y permisos más finos.

### Fase 4 — Plataforma
- creación y unión de nuevos ministerios;
- invitaciones/códigos;
- planes y suscripciones;
- panel de administración del ministerio.

### Fase 5 — Distribución
- empaquetado multiplataforma;
- Android / Play Store;
- iOS / iPadOS / App Store;
- otras tiendas o escritorio cuando convenga;
- una sola base de código compartida.

## Primera decisión técnica propuesta

Backend recomendado para la primera implementación: Supabase (PostgreSQL + Auth + Row Level Security), manteniendo La Grey como cliente web/PWA y preparando posteriormente el empaquetado móvil.

Esta decisión debe validarse antes de introducir credenciales o dependencias de producción.
