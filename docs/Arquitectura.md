# Funcionamiento (como funciona el proyecto)

# Funcionamiento del Proyecto - Pastelería Mil Sabores

## 1. Descripción general
Aplicación web full-stack de tienda online de pastelería. Consta de un frontend React (Vite) y un backend Spring Boot (Java 21) que expone una API REST versionada (`/api/v1`) sobre una base de datos relacional MySQL 8.4. La autenticación se realiza con JWT y roles (ADMIN, VENDEDOR, CLIENTE). La documentación de la API está disponible en Swagger UI.

## 2. Arquitectura
- **Frontend**: React + Vite + React Router + Axios. Corre en `http://localhost:5173`.
- **Backend**: Spring Boot 3.5.7 (Spring Web, Data JPA, Security, Validation, Actuator, springdoc-openapi). Corre en `http://localhost:8080`.
- **Base de datos**: MySQL 8.4 (base `pasteleria` en `localhost:3306`); H2 eliminado. Configuración en `application.properties` con variables `DB_URL/DB_USER/DB_PASSWORD`.
- **Comunicación**: REST con JSON; CORS habilitado para el origen del frontend.

## 3. Cómo ejecutar
### Backend
```bash
cd pasteleria-api
mvn spring-boot:run
```
Requiere JDK 21, Maven y MySQL 8.x corriendo (base `pasteleria` creada). Maven agregado al PATH de usuario. Endpoints base: `http://localhost:8080/api/v1`.

### Frontend
```bash
cd react_pasteleria
npm install
# crear .env.local con VITE_API_URL=http://localhost:8080/api
npm run dev
```

### Pruebas
- Backend: `mvn test` (2/2 OK).
- Frontend: `npm test` (46/46 OK).

## 4. Modelo de datos
Entidades JPA:
- `Producto`: código, nombre, categoría, tipo, precio, stock, stock crítico, descripción, oferta, descuento, imagen.
- `Usuario`: correo (único), nombre, contraseña, tipo (rol), fecha de nacimiento, teléfono, código Felices 50 aplicado.
- `Pedido`: número (único), correo del cliente, fecha, envío (JSON), método de pago, autorización, líneas (JSON), subtotal, descuentos, total, estado. Al crearse descuenta stock de los productos.
- `Contacto`: mensajes de contacto.

Los repositorios son interfaces Spring Data JPA; los servicios encapsulan la lógica de negocio y validaciones.

## 5. API REST (versionada `/api/v1`)
| Recurso | Endpoints |
|---|---|
| Auth | `POST /api/v1/auth/login` |
| Productos | `GET/POST /api/v1/productos`, `GET/PUT/DELETE /api/v1/productos/{id}` |
| Usuarios | `GET/POST /api/v1/usuarios`, `GET/PUT/DELETE /api/v1/usuarios/{id}` |
| Pedidos | `GET/POST /api/v1/pedidos`, `GET/PUT/DELETE /api/v1/pedidos/{id}`, `GET /api/v1/pedidos/numero/{numero}` |
| Contactos | `GET/POST /api/v1/contactos`, `GET/PUT/DELETE /api/v1/contactos/{id}` |

Documentación: `http://localhost:8080/swagger-ui/index.html` y `http://localhost:8080/v3/api-docs`.

## 6. Seguridad y roles
- Spring Security stateless con JWT (HMAC-SHA256).
- `JwtAuthFilter` extrae el token del header `Authorization: Bearer ...` y crea la autenticación con `ROLE_<rol>`.
- Reglas:
  - `/actuator/health`, `/api/v1/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**` públicos.
  - `GET /api/v1/productos/**` y `GET /api/v1/pedidos/numero/**` públicos.
  - `GET /api/v1/pedidos/**` y `GET /api/v1/usuarios/**` autenticados.
  - `POST /api/v1/pedidos/**` y `POST /api/v1/usuarios/**` públicos (registro/compra).
  - `POST/PUT/DELETE /api/v1/productos/**`, `PUT/DELETE /api/v1/pedidos/**`, `PUT/DELETE /api/v1/usuarios/**` y `/api/v1/contactos/**` requieren rol ADMIN.
- Roles del sistema:
  - **Administrador**: acceso total.
  - **Vendedor**: visualiza productos y pedidos (lista y detalle).
  - **Cliente**: accede solo a la tienda.

## 7. Flujo de autenticación
1. El usuario ingresa credenciales en `Login.jsx`.
2. `authService.login` llama a `POST /api/v1/auth/login`.
3. El backend valida contra `UsuarioRepository` y genera un JWT con claim `role`.
4. El frontend guarda el token en `sessionStorage` (`AuthContext`).
5. `httpClient` (Axios) agrega `Authorization: Bearer <token>` a cada request.
6. `ProtectedRoute` restringe interfaces según el rol (administrador, vendedor, cliente).

## 8. Integración frontend-backend
- `src/api/httpClient.js` centraliza las llamadas con `baseURL` desde `VITE_API_URL` y timeout de 10s.
- Servicios HTTP: `productoService`, `usuarioService`, `pedidoService`, `contactoService`, `authService`.
- Páginas integradas con la API: catálogo, detalle de producto, panel de productos (listar/crear/editar/eliminar), usuarios admin, contacto, login, registro, mi cuenta, carrito, checkout, pedidos/boleta, dashboard, index y ofertas.
- Los pedidos se persisten en MySQL y el stock se descuenta en el backend.
- CORS: el backend permite el origen configurado en `app.cors.allowed-origin` y los métodos GET, POST, PUT, DELETE, OPTIONS.

## 9. Gestión de sesión
- JWT persiste en `sessionStorage`, por lo que la sesión se mantiene tras recargas de página dentro de la misma pestaña.
- El registro y la gestión de cuenta usan la API (MySQL); `SesionContext` queda como respaldo legacy.

## 10. Datos iniciales
`data.sql` inserta usuarios demo (admin, vendedor, cliente) y productos de ejemplo. Se ejecuta con `INSERT IGNORE` para no duplicar en reinicios.

## 11. Documentación y entregables
- `docs/ERS.md`: especificación de requerimientos.
- `docs/Manual_Usuario.md`: manual de usuario.
- `docs/Integracion.md`: documento de integración.
- `docs/API.md`: documentación de APIs.
- `Manual_de_Interacciones Frontend-Backend.md`: interacciones detalladas con referencias a archivos y líneas.
- `pasteleria-backend.zip` y `pasteleria-frontend.zip`: proyectos comprimidos.

## 12. Notas
- El backend compila y sus pruebas pasan (`mvn test`: 2/2).
- El frontend pasa todas sus pruebas (`npm test`: 46/46) y el build (`npm run build`).
- Validación E2E realizada: health 200, login JWT OK, Swagger 200, frontend 200, compra persistida en MySQL con descuento de stock.

---

# Documentacion_del_proceso (como se construyo el proyecto)

# Documentación del proceso

## 1. Prerrequisitos e instalación
Se preparó el entorno para trabajar con el proyecto React existente y el nuevo backend Spring Boot. Se verificó la estructura del repositorio, se definió la carpeta `pasteleria-api/` para el backend y se agregaron dependencias de frontend (`axios`). Para compilar el backend se requiere JDK 21 y Maven. El frontend se instala con `npm install` dentro de `react_pasteleria`.

## 2. Backend Spring Boot y persistencia local
Se creó `pasteleria-api/` con `pom.xml` usando Spring Boot 3.5.7, Java 21, Spring Web, Spring Data JPA, Validation, Actuator, Spring Security, JWT y MySQL (H2 eliminado). Se configuró `application.properties` para MySQL (`localhost:3306/pasteleria`), puerto 8080, CORS por variable `APP_CORS_ORIGIN` y salud en `/actuator/health`. Se crearon entidades `Producto`, `Usuario`, `Pedido` y `Contacto`, repositorios JPA y servicios transaccionales. `Pedido` almacena líneas, envío y totales como JSON/texto y descuenta stock al crearse. Se generan IDs con `IDENTITY`.

## 3. CRUD, validación y errores
Cada recurso tiene controlador REST en `/api/productos`, `/api/usuarios`, `/api/pedidos` y `/api/contactos` con `GET`, `GET/{id}`, `POST`, `PUT/{id}` y `DELETE/{id}`. Los DTOs usan `@NotBlank`, `@Email`, `@PositiveOrZero`, `@Size` y `@Valid`. `ApiErrors` centraliza respuestas 400 para campos inválidos, JSON mal formado, parámetros incorrectos y `ResponseStatusException`. Los servicios lanzan 404 cuando un recurso no existe y mantienen el mismo id en actualizaciones.

## 4. Swagger y compatibilidad de versiones
Se agregó `springdoc-openapi-starter-webmvc-ui` 2.8.14 y `OpenApiConfig` con título, versión, descripción y grupo `v1` para `/api/**`. La documentación queda disponible en `/swagger-ui/index.html` y `/v3/api-docs`. Se evitó Springfox/Swagger 2 y se usó la combinación Boot 3 + springdoc 2.x indicada por la guía. También se incluyeron perfiles para MySQL.

## 5. React, Vite, Axios y CORS
Se creó `src/api/httpClient.js` con `axios.create`, `baseURL` desde `VITE_API_URL` y timeout. Se crearon servicios HTTP para productos, usuarios, pedidos y contactos. `getErrorMessage` traduce errores de API, timeout y CORS. `CorsConfig` permite el origen configurado y los métodos `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` con cabeceras `Content-Type` y `Authorization`. Se agregó `.env.local.example`.

## 6. Rutas, formularios y tabla en React
Se agregaron rutas de autenticación (`/auth/callback`) y componentes `Login`, `LoginCallback` y `RequireJwt` en `src/auth/AuthRoutes.jsx`. La app mantiene las rutas existentes y suma servicios HTTP para listar, obtener, crear, actualizar y eliminar recursos. El interceptor de Axios agrega `Authorization: Bearer <token>` cuando hay sesión válida. No se migraron todavía los contextos, hooks o páginas existentes que usan `localStorage`; siguen funcionando como antes.

## 7. Pruebas, JWT y evidencias
Se crearon pruebas Java de servicio y controlador (`ProductoServiceTest`, `ProductoControllerTest`) y se configuró Mockito con `mock-maker-subclass`. Se agregó seguridad JWT por roles mediante `JwtService`, `JwtAuthFilter` y `SecurityConfig`, con roles `ADMIN`, `VENDEDOR` y `CLIENTE`. Se preparó el perfil MySQL en `application-mysql.properties`. Las pruebas Vitest existentes se adaptaron para el login con JWT. La verificación local realizada fue `npm test` con 46 pruebas aprobadas y `mvn test` con 2 pruebas aprobadas.

## Trabajo adicional para cumplir la evaluación
- Backend:
  - Seguridad JWT por roles con `JwtService`, `JwtAuthFilter` y `SecurityConfig`.
  - `AuthService` y `AuthController` para `POST /api/v1/auth/login`.
  - Rutas REST versionadas como `/api/v1/...`.
  - DTOs `LoginRequest`, `AuthResponse`, `PedidoRequest` (completo) y `UsuarioRequest`.
  - `data.sql` con usuarios demo y productos; inicialización con `INSERT IGNORE` (MySQL).
  - Secreto y expiración JWT en `application.properties`.
  - `PedidoService` descuenta stock al crear un pedido.
  - MySQL 8.4 como única base de datos (H2 eliminado).
- Frontend:
  - `AuthContext.jsx` con sesión JWT persistente en `sessionStorage`.
  - `httpClient.js` envía el token JWT.
  - `authService.js`, `usuarioService`, `productoService`, `pedidoService`, `contactoService`.
  - `Login.jsx`, `Registro.jsx` (persiste en BD) y `MiCuenta.jsx` (lee/actualiza BD).
  - `ProtectedRoute.jsx` restringe por rol JWT o sesión local.
  - Integración de `AdminProductos`, `AdminProductoForm`, `AdminUsuarios`, `AdminPedidos`, `Catalogo`, `DetalleProducto`, `Contacto`, `Index`, `Ofertas`, `Carrito`, `Checkout`, `Pedido`, `Dashboard` con la API.
  - `AdminLayout.jsx` corregido para sesión JWT (sin crash).
- Documentos y entregables:
  - Se crearon `docs/ERS.md`, `docs/Manual_Usuario.md`, `docs/Integracion.md` y `docs/API.md`.
  - Se crearon `pasteleria-backend.zip` y `pasteleria-frontend.zip`.
- Pruebas:
  - Backend: 2/2 pruebas OK.
  - Frontend: 46/46 pruebas OK.

## Estado real del trabajo
- Backend compilado y ejecutado sobre MySQL 8.4; `mvn test` (2/2) y `mvn spring-boot:run` OK.
- Frontend migrado a la API para productos, usuarios, pedidos, contacto, registro, cuenta, carrito, checkout, dashboard, index y ofertas.
- Pruebas Vitest (46/46) y Maven (2/2) OK; build de Vite OK.
- Documentación y repartición de tareas actualizadas.

## Inventario completo de archivos creados y modificados

### Archivos modificados
- `react_pasteleria/package.json`
- `react_pasteleria/package-lock.json`
- `react_pasteleria/src/App.jsx`

### Archivos creados: backend
- `pasteleria-api/pom.xml`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/PasteleriaApplication.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/OpenApiConfig.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ApiErrors.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ContactoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/ContactoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/PedidoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/ProductoRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/UsuarioRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Contacto.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Pedido.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Producto.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Usuario.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/ContactoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/PedidoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/ProductoRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/UsuarioRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ContactoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/PedidoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ProductoService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/UsuarioService.java`
- `pasteleria-api/src/main/resources/application.properties`
- `pasteleria-api/src/main/resources/application-mysql.properties`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/controller/ProductoControllerTest.java`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/service/ProductoServiceTest.java`
- `pasteleria-api/src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker`

### Archivos creados: frontend
- `react_pasteleria/.env.local.example`
- `react_pasteleria/src/api/httpClient.js`
- `react_pasteleria/src/services/contactoService.js`
- `react_pasteleria/src/services/pedidoService.js`
- `react_pasteleria/src/services/productoService.js`
- `react_pasteleria/src/services/usuarioService.js`
- `react_pasteleria/src/utils/getErrorMessage.js`

### Archivos creados: despliegue y documentación
- `Documentacion_del_proceso.md`
- `Reparticion_Tareas.md`

### Archivos adicionales creados
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtAuthFilter.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/SecurityConfig.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/AuthService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/AuthController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/LoginRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/AuthResponse.java`
- `pasteleria-api/src/main/resources/data.sql`
- `react_pasteleria/src/context/AuthContext.jsx`
- `react_pasteleria/src/services/authService.js`
- `docs/ERS.md`
- `docs/Manual_Usuario.md`
- `docs/Integracion.md`
- `docs/API.md`
- `pasteleria-backend.zip`
- `pasteleria-frontend.zip`

### Archivos adicionales modificados
- `pasteleria-api/pom.xml`
- `pasteleria-api/src/main/resources/application.properties`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ContactoController.java`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/controller/ProductoControllerTest.java`
- `react_pasteleria/src/main.jsx`
- `react_pasteleria/src/api/httpClient.js`
- `react_pasteleria/src/pages/Login.jsx`
- `react_pasteleria/src/components/ProtectedRoute.jsx`
- `react_pasteleria/src/pages/admin/AdminProductos.jsx`
- `react_pasteleria/src/pages/admin/AdminProductoForm.jsx`
- `react_pasteleria/src/services/productoService.js`
- `react_pasteleria/src/services/usuarioService.js`
- `react_pasteleria/src/services/pedidoService.js`
- `react_pasteleria/src/services/contactoService.js`
- `react_pasteleria/src/tests/componentes.spec.jsx`

### Archivo existente no creado por este proceso
- `react_pasteleria/FullStack_EXP_3.pdf` (material de entrada)


## 8 Conexión local entre backend y frontend
1. Ejecutar backend: `mvn spring-boot:run` en `pasteleria-api/`.
2. Ejecutar frontend: `npm run dev` en `react_pasteleria/`.
3. Configurar `VITE_API_URL=http://localhost:8080/api` en `.env.local`.
4. Verificar CORS para `http://localhost:5173`.
5. Probar login, CRUD de productos, catálogo, detalle y contacto.
6. Verificar JWT en `Authorization: Bearer <token>`.
## Inventario final según git status

### Modificados
- Documentacion_del_proceso.md
- pasteleria-api/pom.xml
- pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ContactoController.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/PedidoController.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ProductoController.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/ProductoRequest.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Producto.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/service/ProductoService.java
- pasteleria-api/src/main/resources/application.properties
- pasteleria-api/src/test/java/cl/duoc/pasteleria/controller/ProductoControllerTest.java
- pasteleria-api/src/test/java/cl/duoc/pasteleria/service/ProductoServiceTest.java
- react_pasteleria/src/api/httpClient.js
- react_pasteleria/src/components/ProtectedRoute.jsx
- react_pasteleria/src/main.jsx
- react_pasteleria/src/pages/Catalogo.jsx
- react_pasteleria/src/pages/Contacto.jsx
- react_pasteleria/src/pages/DetalleProducto.jsx
- react_pasteleria/src/pages/Login.jsx
- react_pasteleria/src/pages/admin/AdminProductoForm.jsx
- react_pasteleria/src/pages/admin/AdminProductos.jsx
- react_pasteleria/src/pages/admin/AdminUsuarios.jsx
- react_pasteleria/src/services/contactoService.js
- react_pasteleria/src/services/pedidoService.js
- react_pasteleria/src/services/productoService.js
- react_pasteleria/src/services/usuarioService.js
- react_pasteleria/src/tests/componentes.spec.jsx

### Agregados
- "DSY1104 Evaluaci\303\263n Parcial 3 - Anexo 1 Instrucciones.pdf"
- "DSY1104 Evaluaci\303\263n Parcial 3_EE_EP_Estudiante.pdf"
- Lo_Que_Falta_Para_El_Cumplimiento_De_La_Rubrica.md
- "Manual_de_Interacciones Frontend-Backend.md"
- Reparticion_Tareas.md
- docs/
- pasteleria-api/src/main/java/cl/duoc/pasteleria/config/SecurityConfig.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/AuthController.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/AuthResponse.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/LoginRequest.java
- pasteleria-api/src/main/java/cl/duoc/pasteleria/security/
- pasteleria-api/src/main/java/cl/duoc/pasteleria/service/AuthService.java
- pasteleria-api/src/main/resources/data.sql
- pasteleria-backend.zip
- pasteleria-frontend.zip
- react_pasteleria/src/context/AuthContext.jsx
- react_pasteleria/src/services/authService.js

---

# Integracion

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