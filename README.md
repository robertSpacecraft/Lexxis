# Lexxis Frontend

SPA React de Lexxis. Consume la API Laravel del backend para catálogo, autenticación, carrito, pedidos, diseños personalizados y subida/configuración de archivos 3D.

## Stack verificado

- React 19.
- Vite 7.
- React Router DOM 7.
- JavaScript.
- CSS Modules junto con estilos globales.
- Cliente HTTP propio basado en `fetch` nativo.

No hay dependencia `axios` en `frontend/package.json` ni imports de Axios en `frontend/src`.

## Cliente HTTP real

Actualmente el frontend usa `fetch` nativo centralizado en `src/api/apiClient.js`.

`apiClient`:

- construye la URL con `VITE_API_BASE_URL` y `VITE_API_PREFIX`;
- añade `Accept: application/json` y `X-Requested-With: XMLHttpRequest`;
- envía `Authorization: Bearer <token>` cuando existe token local;
- envía credenciales con `credentials: 'include'`;
- obtiene cookie CSRF desde `/sanctum/csrf-cookie`;
- normaliza respuestas JSON y errores de API;
- soporta descargas con `responseType: 'blob'`.

El token se guarda en `src/store/authStorage.js` usando `localStorage`.

## Instalación local

```bash
cd frontend
npm install
npm run dev
```

Por defecto Vite levanta el frontend en un puerto local, normalmente `5173`.

## Variables de entorno

El código usa:

- `VITE_API_BASE_URL`: URL base del backend, por ejemplo `http://localhost`.
- `VITE_API_PREFIX`: prefijo de API, por ejemplo `/api`.

Ejemplo local:

```env
VITE_API_BASE_URL=http://localhost
VITE_API_PREFIX=/api
```

En Vercel deben apuntar al backend desplegado.

## Scripts disponibles

Definidos en `frontend/package.json`:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estructura actual

La app activa arranca desde:

- `src/main.jsx`;
- `src/App.jsx`;
- `src/router/AppRouter.jsx`.

Estructura principal usada:

- `src/api`: cliente HTTP y módulos de API.
- `src/pages`: páginas públicas y privadas.
- `src/pages/account`: área de usuario.
- `src/components`: componentes compartidos.
- `src/features/catalog`: componentes y servicios de catálogo.
- `src/hooks`: hooks reutilizables.
- `src/services`: normalizadores y servicios de dominio.
- `src/store`: almacenamiento local de autenticación.
- `src/styles` e `src/index.css`: estilos globales.

Existe también `src/app`, con una estructura alternativa de layouts, providers y páginas, pero el arranque actual no importa su router. No se documenta como estructura activa.

## Funcionalidades visibles verificadas

Rutas definidas en `src/router/AppRouter.jsx`:

- home;
- login y registro;
- páginas informativas: about, news, detalle de noticia y contacto;
- catálogo de productos;
- detalle de producto;
- variantes y detalle de variante;
- configurador de producto protegido;
- servicio de impresión 3D protegido;
- cuenta de usuario;
- perfil;
- diseños personalizados;
- carrito;
- archivos 3D;
- detalle y configuración de archivo 3D;
- configuración de trabajos de impresión;
- pedidos y detalle de pedido.

El modo oscuro/claro está implementado mediante `ThemeToggle` y `useTheme`, guardando la preferencia en `localStorage`.

## Comunicación con backend

Las llamadas se centralizan en `src/api/apiClient.js` y se exponen desde módulos específicos:

- `auth.js`;
- `catalog.js`;
- `cartApi.js`;
- `designApi.js`;
- `orders.js`;
- `printFiles.js`;
- `printJobs.js`;
- `printOptionsApi.js`;
- `userApi.js`.

El login usa `authApi.login`, que primero solicita cookie CSRF y luego llama a `POST /api/token-login`.

Las rutas protegidas usan `src/components/ProtectedRoute.jsx`, que valida la presencia del token local antes de permitir el acceso.

## Notas de desarrollo y despliegue

- El frontend está preparado para desplegarse en Vercel.
- En producción, `VITE_API_BASE_URL` debe apuntar al backend público en Railway o al entorno backend correspondiente.
- Si el backend cambia de dominio, CORS/Sanctum y las variables de Vercel deben actualizarse de forma coordinada.
- No documentar Axios para este proyecto: la implementación actual usa `fetch` nativo a través de `apiClient`.
