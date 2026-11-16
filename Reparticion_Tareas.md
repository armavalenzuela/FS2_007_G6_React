# Repartición de Tareas

> Nota: Los prerrequisitos e instalaciones (JDK 21, Maven, Node, `npm install`) se excluyen de esta repartición. El trabajo fue ejecutado por el responsable técnico y se acredita a continuación como si cada persona lo hubiera realizado.

## Persona 1 — CRUD de Productos y autenticación JWT

### Rutas backend
- `POST /api/v1/auth/login`
- `GET /api/v1/productos`
- `GET /api/v1/productos/{id}`
- `POST /api/v1/productos`
- `PUT /api/v1/productos/{id}`
- `DELETE /api/v1/productos/{id}`

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

## Persona 2 — CRUD de Usuarios y seguridad/CORS

### Rutas backend
- `GET /api/v1/usuarios`
- `GET /api/v1/usuarios/{id}`
- `POST /api/v1/usuarios`
- `PUT /api/v1/usuarios/{id}`
- `DELETE /api/v1/usuarios/{id}`

### Archivos
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/model/Usuario.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/repository/UsuarioRepository.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/service/UsuarioService.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/controller/UsuarioController.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/dto/UsuarioRequest.java`
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CorsConfig.java`
- `react_pasteleria/src/services/usuarioService.js`
- `react_pasteleria/src/auth/cognito.js`
- `react_pasteleria/src/auth/AuthRoutes.jsx`
- `react_pasteleria/src/api/httpClient.js`

## Persona 3 — CRUD de Pedidos y Contactos, integración y despliegue

### Rutas backend
- `GET /api/v1/pedidos`
- `GET /api/v1/pedidos/{id}`
- `POST /api/v1/pedidos`
- `PUT /api/v1/pedidos/{id}`
- `DELETE /api/v1/pedidos/{id}`
- `GET /api/v1/contactos`
- `GET /api/v1/contactos/{id}`
- `POST /api/v1/contactos`
- `PUT /api/v1/contactos/{id}`
- `DELETE /api/v1/contactos/{id}`

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
- `pasteleria-api/src/main/resources/application-mysql.properties`
- `react_pasteleria/src/services/pedidoService.js`
- `react_pasteleria/src/services/contactoService.js`
- `react_pasteleria/src/context/AuthContext.jsx`
- `react_pasteleria/src/components/ProtectedRoute.jsx`
- `react_pasteleria/src/pages/Login.jsx`
- `react_pasteleria/src/pages/admin/AdminProductos.jsx`
- `react_pasteleria/src/pages/admin/AdminProductoForm.jsx`
- `react_pasteleria/src/main.jsx`
- `react_pasteleria/.env.local.example`
- `docs/ERS.md`
- `docs/Manual_Usuario.md`
- `docs/Integracion.md`
- `docs/API.md`
- `pasteleria-backend.zip`
- `pasteleria-frontend.zip`
- `Documentacion_del_proceso.md`

## Tareas compartidas acreditadas
- `react_pasteleria/src/api/httpClient.js` y `react_pasteleria/src/utils/getErrorMessage.js`: Persona 1, Persona 2 y Persona 3.
- Actualización de `react_pasteleria/src/App.jsx` con rutas de autenticación: Persona 1, Persona 2 y Persona 3.
- Configuración `.env.local.example`: Persona 1, Persona 2 y Persona 3.
- Verificación final de CRUD, Swagger, JWT y despliegue: Persona 1, Persona 2 y Persona 3.
- `react_pasteleria/src/services/authService.js`: Persona 1, Persona 2 y Persona 3.
