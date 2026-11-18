# Preguntas y respuestas — Pastelería Mil Sabores

## Descripción del proyecto
Aplicación web full-stack de tienda online de pastelería. Frontend en React (Vite) + backend Spring Boot 3.5.7 (Java 21) sobre MySQL 8.4, con autenticación JWT y roles (ADMIN, VENDEDOR, CLIENTE). API documentada en Swagger (springdoc-openapi 2.8.14).

## Preguntas y respuestas

### 1. ¿Cómo se conecta el backend a la base de datos?
Spring Data JPA + Hibernate. La conexión está en `pasteleria-api/src/main/resources/application.properties:2` (`spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/pasteleria}`), con usuario/contraseña por variables `DB_USER`/`DB_PASSWORD` (`application.properties:3-4`). Hibernate crea/actualiza tablas (`application.properties:5`, `spring.jpa.hibernate.ddl-auto=update`) y `data.sql` inserta datos iniciales (`application.properties:8`, `spring.sql.init.mode=always`) con `INSERT IGNORE`.

### 2. ¿Qué endpoints CRUD existen?
En `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/`: `ProductoController` (`@RequestMapping("/api/v1/productos")` línea 21; GET 29,34; POST 40; PUT 47; DELETE 52), `UsuarioController` (`/api/v1/usuarios`, línea 21; GET 29,32; POST 36; PUT 42; DELETE 47), `PedidoController` (`/api/v1/pedidos`, línea 21; GET 29,32,35; POST 39; PUT 45; DELETE 50), `ContactoController` (`/api/v1/contactos`, línea 15; POST 24, solo creación pública), `AuthController` (`/api/v1/auth`, línea 14; POST /login línea 23). Detalle en `docs/API.md` y Swagger.

### 3. ¿Cómo se documenta la API?
`pasteleria-api/src/main/java/cl/duoc/pasteleria/config/OpenApiConfig.java:11-13` (`@OpenAPIDefinition` con title/version) y la dependencia `springdoc-openapi-starter-webmvc-ui` 2.8.14 en `pasteleria-api/pom.xml`. Swagger UI en `http://localhost:8080/swagger-ui/index.html` (permitido en `SecurityConfig.java:30`). OpenAPI JSON en `/v3/api-docs`.

### 4. ¿Cómo se integra React con Spring Boot?
`react_pasteleria/src/api/httpClient.js:4` (`baseURL` desde `VITE_API_URL`) y `:8` (interceptor que agrega `Authorization: Bearer`). Los servicios en `react_pasteleria/src/services/` (`productoService`, `usuarioService`, `pedidoService`, `contactoService`, `authService`) llaman a `/api/v1/...`. CORS en `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java:17,19,20` (origen, métodos GET/POST/PUT/DELETE/OPTIONS).

### 5. ¿Cómo funciona JWT y los roles?
`pasteleria-api/src/main/java/cl/duoc/pasteleria/security/JwtService.java:23-31` genera tokens firmados (HMAC-SHA256) con claim `role`. `JwtAuthFilter.java:25` (`doFilterInternal`) valida el header `Authorization: Bearer`. `AuthService.java:23-33` valida credenciales y genera el token. `SecurityConfig.java:28-43` define reglas por ruta/rol. Roles: ADMIN (acceso total), VENDEDOR (productos y pedidos), CLIENTE (tienda).

### 6. ¿Cómo se mantiene la sesión en el frontend?
`react_pasteleria/src/context/AuthContext.jsx:8` lee `sessionStorage`, `:17` parsea el JWT (`atob`), `:25-26` persiste/quita el token. `react_pasteleria/src/components/ProtectedRoute.jsx:5,16,20` restringe por rol. Existe `SesionContext.jsx` (localStorage) como respaldo legacy.

### 7. ¿Qué hace el rol Vendedor?
Ve productos y pedidos (lista y detalle). El menú admin filtra opciones (`react_pasteleria/src/components/AdminLayout.jsx:7-13`, `soloAdmin: true`). La escritura (POST/PUT/DELETE productos y pedidos) está restringida a ADMIN (`SecurityConfig.java:34,36,37`).

### 8. ¿Cómo se descuenta el stock al comprar?
`pasteleria-api/src/main/java/cl/duoc/pasteleria/service/PedidoService.java:44` (`create`) parsea las líneas del pedido (JSON), busca cada producto por código en `ProductoRepository` y descuenta la cantidad (mínimo 0), persistiendo en MySQL.

### 9. ¿Qué pruebas tiene el proyecto?
Backend: `pasteleria-api/src/test/java/cl/duoc/pasteleria/service/ProductoServiceTest.java` y `.../controller/ProductoControllerTest.java` (JUnit + Mockito, 2/2 OK). Frontend: 4 specs en `react_pasteleria/src/tests/` (baseDatos, componentes, reglasNegocio, validaciones) con 46 pruebas OK. Build de Vite OK.

### 10. ¿Cómo se ejecuta el proyecto?
Backend: `mvn spring-boot:run` (JDK 21, Maven, MySQL corriendo). Frontend: `npm install` + `npm run dev` (requiere `.env.local` con `VITE_API_URL=http://localhost:8080/api`). Ver `docs/Instalaciones para que el proyecto funcione.md`.

### 11. ¿Qué partes quedan en el frontend y no en la BD?
Carrito de compras (temporal), token JWT (sessionStorage) y `SesionContext` (respaldo legacy). Todo lo persistente (productos, usuarios, pedidos, contactos) está en MySQL.

### 12. ¿Cómo se manejan los errores de la API?
`pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/ApiErrors.java:13` (`class ApiErrors`) centraliza respuestas 400. El frontend usa `react_pasteleria/src/utils/getErrorMessage.js:1` (`export function getErrorMessage`) para traducir errores de API, timeout y CORS.

### 13. ¿Qué es CORS y cómo se configura?
Permite que el navegador del frontend lea respuestas del backend. Se configura en `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java:17,19,20` (origen desde `app.cors.allowed-origin`, métodos GET/POST/PUT/DELETE/OPTIONS).

### 14. ¿Cómo se versiona la API?
Las rutas incluyen `/api/v1/...` (ej. `/api/v1/productos`, `/api/v1/auth/login`). El grupo de OpenAPI se llama `v1` y cubre `/api/**` (`OpenApiConfig.java:11`).