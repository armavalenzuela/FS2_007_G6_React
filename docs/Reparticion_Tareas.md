# Repartición de Tareas

> Nota: Los prerrequisitos e instalaciones (JDK 21, Maven, Node, `npm install`, MySQL 8.4) se excluyen de esta repartición. El trabajo fue ejecutado por el responsable técnico y se acredita a continuación como si cada persona lo hubiera realizado.

## Persona 1 — CRUD de Productos y autenticación JWT

### Qué se hizo
- Se creó el proyecto Spring Boot (`pasteleria-api/`) con Maven, Java 21 y las dependencias de web, JPA, seguridad, validación y Swagger.
- Se modeló la entidad `Producto` (código único, nombre, categoría, tipo, precio, stock, stock crítico, descripción, oferta, descuento, imagen) con repositorio JPA y servicio transaccional.
- Se implementó el CRUD completo de productos en `ProductoController` (`/api/v1/productos`) con validación de DTOs (`ProductoRequest`) y manejo centralizado de errores (`ApiErrors`).
- Se implementó autenticación basada en JWT: `JwtService` genera tokens firmados con HMAC-SHA256 y claim `role`; `JwtAuthFilter` valida el header `Authorization: Bearer ...` y crea la autenticación con `ROLE_<rol>`; `AuthService` + `AuthController` exponen `POST /api/v1/auth/login`.
- Se configuró `SecurityConfig` con reglas por ruta y rol (lectura pública de productos, escritura solo ADMIN), CORS (`CorsConfig`) y Swagger (`OpenApiConfig`).
- Se agregaron pruebas Java (`ProductoServiceTest`, `ProductoControllerTest`) y se configuró Mockito con `mock-maker-subclass`.
- En frontend se integró el catálogo y detalle de producto con `productoService` (Axios), y el panel admin de productos (listar/crear/editar/eliminar).

### Rutas backend (dónde y cómo funcionan)
| Método | Ruta | Ubicación | Función |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/AuthController.java` -> login() | Valida credenciales contra `UsuarioRepository` y devuelve un JWT con el rol. |
| GET | `/api/v1/productos` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java` -> list() | Devuelve todos los productos (público). |
| GET | `/api/v1/productos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java` -> find() | Devuelve un producto por id (público). |
| POST | `/api/v1/productos` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java` -> create() | Crea un producto (requiere rol ADMIN). |
| PUT | `/api/v1/productos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java` -> update() | Actualiza un producto (requiere rol ADMIN). |
| DELETE | `/api/v1/productos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java` -> delete() | Elimina un producto (requiere rol ADMIN). |

### Archivos
- `pasteleria-api/pom.xml`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Producto.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/ProductoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ProductoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/ProductoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtAuthFilter.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/SecurityConfig.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/AuthService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/AuthController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/LoginRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/AuthResponse.java`
- `pasteleria-api/src/main/resources/data.sql`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/service/ProductoServiceTest.java`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/controller/ProductoControllerTest.java`
- Frontend: `react_pasteleria/src/pages/Catalogo.jsx`, `DetalleProducto.jsx`, `admin/AdminProductos.jsx`, `admin/AdminProductoForm.jsx`, `services/productoService.js`

## Persona 2 — CRUD de Usuarios y seguridad/CORS

### Qué se hizo
- Se modeló la entidad `Usuario` (correo único, nombre, contraseña, tipo/rol, fecha de nacimiento, teléfono, código FELICES50) con repositorio JPA y servicio.
- Se implementó el CRUD completo de usuarios en `UsuarioController` (`/api/v1/usuarios`) con validación de DTOs (`UsuarioRequest`).
- Se configuró CORS (`CorsConfig`) para permitir el origen del frontend y los métodos GET/POST/PUT/DELETE/OPTIONS.
- Se implementó `ProtectedRoute` en React para restringir rutas por rol (administrador, vendedor, cliente) usando el JWT o la sesión local.
- Se creó `AuthContext` con sesión JWT persistente en `sessionStorage` y `httpClient` (Axios) que agrega el token a cada request.
- Se integró el panel admin de usuarios (`AdminUsuarios.jsx`) para listar, cambiar rol y eliminar usuarios vía API.
- Se adaptó `Registro.jsx` y `MiCuenta.jsx` para persistir y leer desde la BD (MySQL).
- Se habilitó `POST /api/v1/usuarios` para registro público y `GET/PUT` para usuarios autenticados.

### Rutas backend (dónde y cómo funcionan)
| Método | Ruta | Ubicación | Función |
|---|---|---|---|
| GET | `/api/v1/usuarios` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java` -> list() | Lista todos los usuarios (requiere autenticación). |
| GET | `/api/v1/usuarios/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java` -> find() | Obtiene un usuario por id (requiere autenticación). |
| POST | `/api/v1/usuarios` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java` -> create() | Crea un usuario (público, usado por registro). |
| PUT | `/api/v1/usuarios/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java` -> update() | Actualiza un usuario (requiere autenticación). |
| DELETE | `/api/v1/usuarios/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java` -> delete() | Elimina un usuario (requiere rol ADMIN). |

### Archivos
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Usuario.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/UsuarioRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/UsuarioService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/UsuarioRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java`
- `react_pasteleria/src/services/usuarioService.js`
- `react_pasteleria/src/context/AuthContext.jsx`
- `react_pasteleria/src/components/ProtectedRoute.jsx`
- `react_pasteleria/src/pages/Login.jsx`
- `react_pasteleria/src/pages/Registro.jsx`
- `react_pasteleria/src/pages/MiCuenta.jsx`
- `react_pasteleria/src/pages/admin/AdminUsuarios.jsx`
- `react_pasteleria/src/api/httpClient.js`

## Persona 3 — CRUD de Pedidos, integración y despliegue

### Qué se hizo
- Se modeló la entidad `Pedido` (número único, correo del cliente, fecha, envío JSON, método de pago, autorización, líneas JSON, subtotal, descuentos, total, estado) con repositorio JPA y servicio. `PedidoService.create` descuenta stock de los productos del pedido.
- Se implementó el CRUD completo de pedidos en `PedidoController` (`/api/v1/pedidos`), incluyendo `GET /api/v1/pedidos/numero/{numero}` para obtener la boleta.
- Se modeló la entidad `Contacto` con repositorio, servicio y controlador (`/api/v1/contactos`) con creación pública (POST); contactos es solo un formulario de usuario, no un CRUD de admin.
- Se configuró `ApiErrors` para centralizar respuestas 400 (campos inválidos, JSON mal formado, parámetros incorrectos).
- Se configuró `OpenApiConfig` con título, versión, descripción y grupo `v1` para `/api/**`; Swagger disponible en `/swagger-ui/index.html`.
- Se integró el frontend: `AdminPedidos.jsx` (lista desde la API), `Pedido.jsx` (boleta desde la API), `Checkout.jsx` (persiste el pedido en la BD), `Contacto.jsx` (envía a la API), `Dashboard.jsx` (métricas desde la API), `Index.jsx`, `Ofertas.jsx`, `Carrito.jsx` (productos desde la API).
- Se migró la base de datos de H2 a MySQL 8.4 (`application.properties` con variables `DB_URL/DB_USER/DB_PASSWORD`); `data.sql` usa `INSERT IGNORE`.
- Se generaron `pasteleria-backend.zip` y `pasteleria-frontend.zip`, y la documentación en `docs/` (ERS, Manual de Usuario, Integración, APIs, Funcionamiento).

### Rutas backend (dónde y cómo funcionan)
| Método | Ruta | Ubicación | Función |
|---|---|---|---|
| GET | `/api/v1/pedidos` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> list() | Lista todos los pedidos (requiere autenticación). |
| GET | `/api/v1/pedidos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> find() | Obtiene un pedido por id (requiere autenticación). |
| GET | `/api/v1/pedidos/numero/{numero}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> findByNumero() | Obtiene un pedido por su número (público, para la boleta). |
| POST | `/api/v1/pedidos` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> create() | Crea un pedido y descuenta stock (público). |
| PUT | `/api/v1/pedidos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> update() | Actualiza un pedido (requiere rol ADMIN). |
| DELETE | `/api/v1/pedidos/{id}` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java` -> delete() | Elimina un pedido (requiere rol ADMIN). |
| POST | `/api/v1/contactos` | `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ContactoController.java` -> create() | Crea un contacto (público, formulario de usuario). |

### Archivos
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Pedido.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Contacto.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/PedidoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/ContactoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/PedidoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ContactoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ContactoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/PedidoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/ContactoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ApiErrors.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/OpenApiConfig.java`
- `pasteleria-api/src/main/resources/application.properties`
- `react_pasteleria/src/services/pedidoService.js`
- `react_pasteleria/src/services/contactoService.js`
- `react_pasteleria/src/context/AuthContext.jsx`
- `react_pasteleria/src/components/ProtectedRoute.jsx`
- `react_pasteleria/src/pages/Login.jsx`
- `react_pasteleria/src/pages/admin/AdminProductos.jsx`
- `react_pasteleria/src/pages/admin/AdminProductoForm.jsx`
- `react_pasteleria/src/pages/admin/AdminPedidos.jsx`
- `react_pasteleria/src/pages/Pedido.jsx`
- `react_pasteleria/src/pages/Checkout.jsx`
- `react_pasteleria/src/pages/admin/Dashboard.jsx`
- `react_pasteleria/src/main.jsx`
- `react_pasteleria/.env.local.example`
- `docs/ERS.md`, `docs/Manual_Usuario.md`, `docs/Integracion.md`, `docs/API.md`, `docs/Funcionamiento.md`
- `pasteleria-backend.zip`, `pasteleria-frontend.zip`

## Tareas compartidas acreditadas
- `react_pasteleria/src/api/httpClient.js` y `react_pasteleria/src/utils/getErrorMessage.js`: Persona 1, Persona 2 y Persona 3.
- Actualización de `react_pasteleria/src/App.jsx` con rutas de autenticación: Persona 1, Persona 2 y Persona 3.
- Configuración `.env.local.example`: Persona 1, Persona 2 y Persona 3.
- Verificación final de CRUD, Swagger, JWT y despliegue: Persona 1, Persona 2 y Persona 3.
- `react_pasteleria/src/services/authService.js`: Persona 1, Persona 2 y Persona 3.


