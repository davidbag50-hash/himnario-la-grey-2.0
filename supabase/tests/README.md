# Pruebas RLS — La Grey Cloud

Estas pruebas validan que los datos de ministerios y usuarios no puedan cruzar fronteras mediante el cliente público.

## Preparación

Crear:

- owner A
- admin A
- leader A
- member A
- owner B
- member B

Crear:

- Ministerio A
- Ministerio B

Usar sesiones normales de Supabase Auth y la clave pública del cliente.

**Nunca usar `service_role` para estas pruebas**, porque omite RLS.

## 1. Aislamiento de ministerios

Como usuario de A:

- puede leer su ministerio;
- puede leer miembros/roster permitidos de A;
- no puede leer datos privados de B;
- modificar manualmente `ministry_id` hacia B no funciona.

Repetir desde B hacia A.

## 2. Roles administrativos

### member

Puede leer lo necesario para participar.

No puede:

- administrar miembros;
- modificar repertorio;
- cambiar tono oficial;
- escribir notas compartidas;
- crear/editar/eliminar calendario compartido.

### leader

Puede:

- administrar repertorio;
- tono oficial;
- notas compartidas;
- calendario/setlists.

No puede:

- promoverse a owner;
- cambiar al owner;
- administrar propiedad del ministerio fuera de las reglas definidas.

### admin

Puede administrar miembros no-owner y las capacidades de líder.

No puede:

- eliminar/editar el owner como si fuera un miembro normal;
- asignar owner mediante el RPC de edición;
- cambiar `owner_user_id` con un UPDATE normal.

### owner

Mantiene las capacidades máximas del ministerio según el modelo actual.

## 3. Repertorio

Crear una canción distinta en A y B.

Comprobar:

- member A lee repertorio A;
- member A no escribe repertorio A;
- leader/admin/owner A sí pueden escribir;
- ningún rol de B puede leer/escribir repertorio A.

Probar:

- agregar canción;
- quitar canción;
- cambiar `official_tone`;
- guardar notas compartidas.

## 4. Calendario y setlists

En A:

- leader/admin/owner pueden crear evento;
- pueden guardar setlist;
- member puede leer;
- member no puede llamar con éxito a RPCs de escritura;
- B no puede leer eventos ni setlists de A.

Comprobar cascada:

- eliminar evento elimina sus filas de setlist.

Comprobar repertorio:

- el RPC no permite meter una canción fuera del repertorio del ministerio.

### Asignaciones de integrantes

- leader/admin/owner pueden asignar integrantes del roster al evento;
- member puede leer las asignaciones pero no modificarlas;
- no se puede asignar una ficha de roster perteneciente a otro ministerio;
- las funciones permitidas son `voice`, `guitar`, `piano`, `bass`, `drums`;
- eliminar una ficha del roster conserva el nombre histórico ya guardado en el evento;
- eliminar el evento elimina sus asignaciones por cascada.

## 5. Datos personales

Usar al menos dos usuarios autenticados.

Cada usuario solo puede leer/escribir sus propios registros en:

- `profiles` según las reglas existentes;
- `user_preferences`;
- `user_favorites`;
- `user_learning_progress`;
- `user_song_notes`.

Intentar manualmente usar el `user_id` del otro usuario.

Debe fallar o devolver cero filas según la operación.

## 6. Favoritos

- Usuario A añade un favorito.
- Usuario B no lo puede leer.
- A lo puede eliminar.
- B no lo puede eliminar.
- repetir insert no debe crear duplicados.

## 7. Progreso de aprendizaje

Probar varios `track_id`:

- `voice-advanced-v1`
- `piano-foundations-v1`
- `ministry-integration-v1`
- un track de preparación de setlist

Verificar:

- completar item;
- descompletar item;
- el progreso de A no es visible para B.

## 8. Notas personales

- A guarda una nota personal para una canción.
- B no puede leerla.
- A puede editarla.
- guardar cuerpo vacío elimina la nota mediante la lógica cliente.
- las notas personales no aparecen en `ministry_song_notes`.

## 9. Invitaciones

Verificar:

- token válido permite el flujo esperado;
- token inválido/expirado no concede membresía;
- manipular ministerio/token no concede acceso a otro ministerio.

## 10. Anon

Sin sesión autenticada:

- no puede leer tablas privadas;
- no puede ejecutar escrituras privadas;
- el catálogo local de canciones/himnos sigue funcionando porque no depende de estas tablas.

## 11. Diagnóstico de esquema

Antes de las pruebas funcionales ejecutar:

```js
const report = await LAGREY_CLOUD_DIAGNOSTICS.run();
console.table(report.checks);
report.summary;
```

No continuar con la certificación cloud si hay checks `schema:...` fallidos.

## Criterio de aprobación

La nube se considera correctamente activada solo cuando:

- esquema completo;
- aislamiento A/B correcto;
- permisos member/leader/admin/owner correctos;
- datos personales aislados;
- calendario y repertorio protegidos;
- fallbacks offline probados;
- reconciliación al recuperar conexión probada.

Un éxito visual en la interfaz no sustituye estas pruebas.
