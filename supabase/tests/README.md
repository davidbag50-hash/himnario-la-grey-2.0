# Pruebas RLS — La Grey Cloud

Estas pruebas se ejecutarán cuando exista un proyecto Supabase de desarrollo con las migraciones aplicadas.

## Objetivo

Comprobar que Row Level Security aísla completamente los datos entre ministerios y que los roles solo pueden realizar las acciones autorizadas.

## Escenarios mínimos

1. Crear dos usuarios de prueba: usuario A y usuario B.
2. Crear dos ministerios: Ministerio A propiedad del usuario A y Ministerio B propiedad del usuario B.
3. Añadir una canción distinta al repertorio de cada ministerio.
4. Iniciar sesión como usuario A y verificar:
   - puede leer Ministerio A;
   - puede leer el repertorio de Ministerio A;
   - no puede leer Ministerio B;
   - no puede leer el repertorio de Ministerio B;
   - no puede insertar, actualizar o eliminar datos usando el ministry_id de Ministerio B.
5. Repetir el mismo conjunto de pruebas iniciando sesión como usuario B.
6. Crear un miembro con rol `member` dentro del Ministerio A y verificar:
   - puede leer ministerio, miembros, repertorio y notas compartidas;
   - no puede añadir ni eliminar canciones del repertorio;
   - no puede cambiar el tono oficial;
   - no puede modificar notas compartidas;
   - no puede administrar membresías.
7. Cambiar ese usuario a rol `leader` y verificar:
   - puede añadir/eliminar repertorio;
   - puede cambiar tono oficial;
   - puede modificar notas compartidas;
   - no puede administrar membresías ni cambiar propietario.
8. Crear un `admin` y verificar:
   - puede administrar miembros que no sean owner;
   - no puede cambiar ni eliminar la fila owner;
   - no puede cambiar `owner_user_id` mediante un UPDATE normal.
9. Verificar que un usuario autenticado solo pueda leer/modificar su propio `profiles` y `user_preferences`.
10. Verificar que el rol `anon` no pueda leer ninguna tabla privada de ministerios.

## Criterio de aprobación

La nube no se conectará a la interfaz pública de La Grey hasta que todas estas pruebas pasen. Manipular manualmente `ministry_id`, `user_id` o cualquier payload desde el navegador nunca debe permitir cruzar la frontera de otro ministerio.

## Nota sobre el cliente

Estas pruebas deben realizarse usando sesiones normales de Supabase Auth y la clave pública del cliente. No deben ejecutarse con `service_role`, porque esa clave omite RLS y no representa el comportamiento real de la aplicación.
