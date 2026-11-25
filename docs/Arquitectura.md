
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

## 11. Notas
- El backend compila y sus pruebas pasan (`mvn test`: 2/2).
- El frontend pasa todas sus pruebas (`npm test`: 46/46) y el build (`npm run build`).
- Validación E2E realizada: health 200, login JWT OK, Swagger 200, frontend 200, compra persistida en MySQL con descuento de stock.

## 12. Conexión local entre backend y frontend
1. Ejecutar backend: `mvn spring-boot:run` en `pasteleria-api/`.
2. Ejecutar frontend: `npm run dev` en `react_pasteleria/`.
3. Configurar `VITE_API_URL=http://localhost:8080/api` en `.env.local`.
4. Verificar CORS para `http://localhost:5173`.
5. Probar login, CRUD de productos, catálogo, detalle y contacto.
6. Verificar JWT en `Authorization: Bearer <token>`.

## 13. Flujo de datos
1. El frontend React usa `src/api/httpClient.js` con `baseURL` desde `VITE_API_URL`.
2. Los servicios (`productoService`, `usuarioService`, `pedidoService`, `contactoService`, `authService`) llaman a `/api/v1/...`.
3. El backend Spring Boot recibe las solicitudes, valida datos y accede a la base de datos.
4. El backend responde JSON con códigos HTTP (200, 201, 204, 400, 401, 403, 404).
5. El interceptor de Axios agrega `Authorization: Bearer <token>` cuando hay sesión.

## 14. Autenticación
- `POST /api/v1/auth/login` devuelve un JWT con rol.
- El frontend guarda el token en `sessionStorage`.
- `ProtectedRoute` restringe acceso según rol.

## 15. CORS
- Backend permite el origen configurado en `app.cors.allowed-origin`.
- Se permiten métodos GET, POST, PUT, DELETE, OPTIONS.