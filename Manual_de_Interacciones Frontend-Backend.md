# Manual de Interacciones Frontend-Backend

Este manual explica cómo se comunica el frontend React con el backend Spring Boot y dónde se genera cada interacción.

## 1. Arranque del frontend

Archivo: `react_pasteleria/src/main.jsx`

- Líneas 12-24: se monta React con `StrictMode`, `BrowserRouter`, `SesionProvider`, `CarritoProvider` y `AuthProvider`.
- Línea 10: se importa `AuthProvider`, que mantiene la sesión JWT.
- Línea 17: `<AuthProvider>` envuelve a `<App />`, por eso toda la app puede leer el token JWT.

## 2. Rutas del frontend

Archivo: `react_pasteleria/src/App.jsx`

- Líneas 45-79: se definen las rutas con `Routes` y `Route`.
- Línea 46: ruta `auth/callback` usa `LoginCallback`.
- Línea 49: `/catalogo` usa `Catalogo`.
- Línea 52: `/producto/:codigo` usa `DetalleProducto`.
- Línea 53: `/login` usa `Login`.
- Líneas 59-66: `/mi-cuenta` está protegida por `ProtectedRoute roles={["cliente"]}`.
- Líneas 70-78: rutas `/admin/...` protegidas por `ProtectedRoute roles={["administrador"]}`.

## 3. Cliente HTTP compartido

Archivo: `react_pasteleria/src/api/httpClient.js`

- Líneas 3-6: se crea `httpClient` con Axios.
- Línea 4: `baseURL` usa `import.meta.env.VITE_API_URL || "http://localhost:8080/api"`.
- Línea 5: `timeout: 10000`.
- Líneas 8-13: interceptor de request.
- Línea 9: lee `sessionStorage.getItem("pasteleriaToken")`.
- Línea 11: agrega `Authorization: Bearer <token>` si existe token.

Interacción generada: cada servicio HTTP usa esta instancia, por lo que todas las llamadas al backend pasan por aquí.

## 4. Login y autenticación JWT

### Frontend

Archivo: `react_pasteleria/src/pages/Login.jsx`

- Línea 10: `const { login: loginSesion } = useSesion();`
- Línea 11: `const { login: loginAuth } = useAuth();`
- Líneas 23-38: función `enviar(e)`:
  - Línea 24: `e.preventDefault();`
  - Línea 25: valida formulario con `validarLogin(form)`.
  - Línea 31: intenta `await loginAuth(form.correo, form.contrasena)`.
  - Línea 36: si falla, usa `loginSesion(...)` como respaldo.
  - Línea 38: navega según el rol o destino.

Archivo: `react_pasteleria/src/services/authService.js`

- Línea 5: `httpClient.post("/v1/auth/login", { correo, contrasena })`.

Archivo: `react_pasteleria/src/context/AuthContext.jsx`

- Línea 8: `sessionStorage.getItem(CLAVE_TOKEN)`.
- Líneas 24-27: `useEffect` guarda o elimina el token en `sessionStorage`.
- Línea 30: `authService.login(correo, contrasena)`.
- Línea 31: `setToken(respuesta.token)`.

### Backend

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/AuthController.java`

- Línea 14: `@RequestMapping("/api/v1/auth")`.
- Línea 23: `@PostMapping("/login")`.

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/AuthService.java`

- Método `login(LoginRequest input)`:
  - busca el usuario por correo en `UsuarioRepository`.
  - valida la contraseña.
  - genera el JWT con `JwtService`.

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtService.java`

- Método `generate(String subject, String role)`:
  - crea el token con `subject`, claim `role`, fecha de emisión y expiración.
  - firma con `Keys.hmacShaKeyFor(...)`.

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtAuthFilter.java`

- Línea 25: `doFilterInternal(...)`.
- Lee el header `Authorization`.
- Si empieza con `Bearer `, parsea el token y crea `UsernamePasswordAuthenticationToken` con `ROLE_<rol>`.

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/SecurityConfig.java`

- Líneas 27-36: reglas de autorización por ruta y rol.
- Ejemplo: `GET /api/v1/productos/**` requiere autenticación.
- `POST/PUT/DELETE /api/v1/productos/**` requieren rol `ADMIN`.

## 5. Restricción de acceso en frontend

Archivo: `react_pasteleria/src/components/ProtectedRoute.jsx`

- Líneas 17-18: obtiene `usuarioAuth` y `usuarioSesion`.
- Línea 19: calcula `rol`.
- Líneas 20-22: si no hay rol, redirige a `/login`.
- Líneas 23-24: si el rol no está permitido, redirige a `/`.

Interacción generada: impide que usuarios sin permisos vean interfaces restringidas.

## 6. CRUD de productos: frontend -> backend

### Listar productos

Archivo: `react_pasteleria/src/pages/admin/AdminProductos.jsx`

- Línea 3: importa `productoService`.
- Línea 10: obtiene `usuario` desde `useAuth()`.
- Línea 22: `setProductos(await productoService.list())`.
- Línea 30: `useEffect(() => { cargar(); }, [])`.

Archivo: `react_pasteleria/src/services/productoService.js`

- Línea 4: `httpClient.get("/v1/productos")`.

Backend:

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`

- Línea 21: `@RequestMapping("/api/v1/productos")`.
- Línea 29: `@GetMapping` llama a `service.list()`.

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ProductoService.java`

- Método `list()` retorna `repository.findAll()`.

### Crear/actualizar producto

Archivo: `react_pasteleria/src/pages/admin/AdminProductoForm.jsx`

- Línea 3: importa `productoService`.
- Líneas 23-45: `useEffect` busca el producto original por código.
- Líneas 91-92:
  - `await productoService.update(originalId, datos)`
  - `await productoService.create(datos)`

Archivo: `react_pasteleria/src/services/productoService.js`

- Línea 12: `httpClient.post("/v1/productos", producto)`.
- Línea 15: `httpClient.put("/v1/productos/${encodeURIComponent(id)}", producto)`.

Backend:

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`

- Línea 40: `@PostMapping`.
- Línea 47: `@PutMapping("/{id}")`.

### Eliminar producto

Archivo: `react_pasteleria/src/pages/admin/AdminProductos.jsx`

- Línea 41: `await productoService.remove(producto.id)`.

Archivo: `react_pasteleria/src/services/productoService.js`

- Línea 18: `httpClient.delete("/v1/productos/${encodeURIComponent(id)}")`.

Backend:

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`

- Línea 52: `@DeleteMapping("/{id}")`.

## 7. Catálogo público

Archivo: `react_pasteleria/src/pages/Catalogo.jsx`

- Línea 7: importa `productoService`.
- Línea 27: `setProductos(await productoService.list())`.
- Línea 35: `useEffect(() => { cargar(); }, [])`.

Interacción generada: el catálogo público consulta la API en lugar de usar solo datos locales.

## 8. Detalle de producto

Archivo: `react_pasteleria/src/pages/DetalleProducto.jsx`

- Línea 8: importa `productoService`.
- Línea 20: `useEffect`.
- Línea 24: `productoService.list().then((lista) => ...)`.

Interacción generada: busca el producto por `codigo` dentro de la lista obtenida desde la API.

## 9. CORS

Archivo: `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java`

- Línea 17: `addCorsMappings(CorsRegistry registry)`.
- Línea 18: `registry.addMapping("/api/**")`.
- Línea 19: `allowedOrigins(allowedOrigin)`.
- Línea 20: `allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")`.

Interacción generada: permite que el navegador frontend lea respuestas del backend.

## 10. Datos iniciales

Archivo: `pasteleria-api/src/main/resources/data.sql`

- Inserta usuarios demo con roles `ADMIN`, `VENDEDOR` y `CLIENTE`.
- Se ejecuta al iniciar la base de datos.

## 11. Configuración

Archivo: `pasteleria-api/src/main/resources/application.properties`

- Puerto: `server.port=8080`.
- Base de datos H2 en memoria.
- Origen CORS: `app.cors.allowed-origin`.
- JWT: `app.jwt.secret` y `app.jwt.expiration-ms`.

Archivo: `react_pasteleria/.env.local.example`

- `VITE_API_URL=http://localhost:8080/api`.
- Variables de Cognito opcionales.

## 12. Swagger

- URL: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI: `http://localhost:8080/v3/api-docs`
- Configuración: `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/OpenApiConfig.java`

## 12. Servicios HTTP disponibles

Archivo: `react_pasteleria/src/services/productoService.js`
- Línea 4: `GET /v1/productos`
- Línea 7: `GET /v1/productos/{id}`
- Línea 10: `POST /v1/productos`
- Línea 13: `PUT /v1/productos/{id}`
- Línea 16: `DELETE /v1/productos/{id}`

Archivo: `react_pasteleria/src/services/usuarioService.js`
- Línea 4: `GET /v1/usuarios`
- Línea 5: `GET /v1/usuarios/{id}`
- Línea 6: `POST /v1/usuarios`
- Línea 7: `PUT /v1/usuarios/{id}`
- Línea 8: `DELETE /v1/usuarios/{id}`

Archivo: `react_pasteleria/src/services/pedidoService.js`
- Línea 4: `GET /v1/pedidos`
- Línea 5: `GET /v1/pedidos/{id}`
- Línea 6: `POST /v1/pedidos`
- Línea 7: `PUT /v1/pedidos/{id}`
- Línea 8: `DELETE /v1/pedidos/{id}`

Archivo: `react_pasteleria/src/services/contactoService.js`
- Línea 4: `GET /v1/contactos`
- Línea 5: `GET /v1/contactos/{id}`
- Línea 6: `POST /v1/contactos`
- Línea 7: `PUT /v1/contactos/{id}`
- Línea 8: `DELETE /v1/contactos/{id}`

Archivo: `react_pasteleria/src/services/authService.js`
- Línea 5: `POST /v1/auth/login`

Nota: los servicios de usuarios, pedidos y contactos están disponibles para integración, pero las páginas principales que actualmente los consumen son las de productos y autenticación. Las demás páginas mantienen compatibilidad con la base local.

## 13. Resumen de flujo completo

1. El usuario inicia sesión en `Login.jsx`.
2. `authService.login` llama a `POST /api/v1/auth/login`.
3. El backend valida credenciales y genera JWT.
4. El frontend guarda el token en `sessionStorage`.
5. `httpClient` agrega el token a cada request.
6. Las páginas React llaman a los servicios HTTP.
7. Los servicios llaman a `/api/v1/...`.
8. Spring Boot procesa, valida, consulta la base de datos y responde JSON.
9. `ProtectedRoute` restringe interfaces según el rol.
