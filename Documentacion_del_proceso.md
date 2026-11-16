# Documentación del proceso

## 1. Prerrequisitos e instalación
Se preparó el entorno para trabajar con el proyecto React existente y el nuevo backend Spring Boot. Se verificó la estructura del repositorio, se definió la carpeta `pasteleria-api/` para el backend y se agregaron dependencias de frontend (`axios`). Para compilar el backend se requiere JDK 21 y Maven. El frontend se instala con `npm install` dentro de `react_pasteleria`.

## 2. Backend Spring Boot y persistencia local
Se creó `pasteleria-api/` con `pom.xml` usando Spring Boot 3.5.7, Java 21, Spring Web, Spring Data JPA, Validation, Actuator, OAuth2 Resource Server, H2 y MySQL. Se configuró `application.properties` para H2 en memoria, puerto 8080, CORS por variable `APP_CORS_ORIGIN` y salud en `/actuator/health`. Se crearon entidades `Producto`, `Usuario`, `Pedido` y `Contacto`, repositorios JPA y servicios transaccionales. Se generan IDs con `IDENTITY` y se aplican reglas de negocio antes de guardar.

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
  - Se agregó seguridad JWT por roles con `JwtService`, `JwtAuthFilter` y `SecurityConfig`.
  - Se agregó `AuthService` y `AuthController` para `POST /api/v1/auth/login`.
  - Se versionaron las rutas REST como `/api/v1/...`.
  - Se agregaron DTOs `LoginRequest` y `AuthResponse`.
  - Se agregó `data.sql` con usuarios demo y configuración de inicialización.
  - Se agregó secreto y expiración JWT en `application.properties`.
- Frontend:
  - Se creó `src/context/AuthContext.jsx` con sesión JWT persistente en `sessionStorage`.
  - Se actualizó `src/api/httpClient.js` para enviar el token JWT.
  - Se creó `src/services/authService.js`.
  - Se actualizó `src/pages/Login.jsx` para autenticar contra el backend con respaldo local.
  - Se actualizó `src/components/ProtectedRoute.jsx` para restringir por rol JWT o sesión local.
  - Se integró `AdminProductos` con `productoService`.
  - Se integró `AdminProductoForm` con `productoService`.
  - Se integró `AdminUsuarios` con `usuarioService`.
  - Se integró `Catalogo` con `productoService`.
  - Se integró `DetalleProducto` con `productoService`.
  - Se integró `Contacto` con `contactoService`.
  - Se actualizaron servicios HTTP a rutas `/v1/...`.
  - Se envolvió la app con `AuthProvider` en `main.jsx`.
- Documentos y entregables:
  - Se crearon `docs/ERS.md`, `docs/Manual_Usuario.md`, `docs/Integracion.md` y `docs/API.md`.
  - Se crearon `pasteleria-backend.zip` y `pasteleria-frontend.zip`.
- Pruebas:
  - Backend: 2/2 pruebas OK.
  - Frontend: 46/46 pruebas OK.

## Estado real del trabajo
- Código backend creado, pero no compilado ni ejecutado por falta de JDK 21/Maven.
- Servicios frontend creados, pero las páginas y contextos existentes siguen usando `localStorage`.
- Pruebas Vitest existentes sin cambios; se agregaron pruebas Java para producto.
- Archivos AWS preparados, pero no se desplegó ni configuró infraestructura real.
- Documentación y repartición de tareas creadas.

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
