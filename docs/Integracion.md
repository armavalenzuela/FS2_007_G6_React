# Documento de Integración

## Flujo de datos
1. El frontend React usa `src/api/httpClient.js` con `baseURL` desde `VITE_API_URL`.
2. Los servicios (`productoService`, `usuarioService`, `pedidoService`, `contactoService`, `authService`) llaman a `/api/v1/...`.
3. El backend Spring Boot recibe las solicitudes, valida datos y accede a la base de datos.
4. El backend responde JSON con códigos HTTP (200, 201, 204, 400, 401, 403, 404).
5. El interceptor de Axios agrega `Authorization: Bearer <token>` cuando hay sesión.

## Autenticación
- `POST /api/v1/auth/login` devuelve un JWT con rol.
- El frontend guarda el token en `sessionStorage`.
- `ProtectedRoute` restringe acceso según rol.

## CORS
- Backend permite el origen configurado en `app.cors.allowed-origin`.
- Se permiten métodos GET, POST, PUT, DELETE, OPTIONS.
