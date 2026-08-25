Himnario-Cancionero La Grey — PWA v1.0

Esta versión está lista para publicarse como sitio web y PWA.

Incluye:
- 6 cantos de la versión v0.8
- Diseño adaptable a PC, Android, iPhone/iPad
- Instalación como app desde el navegador compatible
- Funcionamiento offline después de la primera visita
- Favoritos guardados localmente
- Buscador
- Ajuste de tamaño de letra
- Acordes en fuente monoespaciada

PUBLICAR CON GITHUB PAGES

1. En GitHub crea un repositorio nuevo, por ejemplo:
   himnario-la-grey

2. Sube TODO el contenido de esta carpeta a la raíz del repositorio:
   index.html
   manifest.webmanifest
   sw.js
   icon.svg
   icon-192.png
   icon-512.png
   .nojekyll

3. En GitHub abre:
   Settings > Pages

4. En "Build and deployment":
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   Save

GitHub mostrará la dirección pública del sitio.

IMPORTANTE
El service worker/PWA funciona correctamente cuando el sitio se sirve por HTTPS
(como GitHub Pages), no simplemente abriendo index.html como archivo local.
