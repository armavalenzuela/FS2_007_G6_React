# Repartición de Tareas

> Nota: Los prerrequisitos e instalaciones (JDK 21, Maven, Node, AWS CLI, `npm install`) se excluyen de esta repartición. El trabajo fue ejecutado por el responsable técnico y se acredita a continuación como si cada persona lo hubiera realizado.

## Asignación por persona

### Persona 1 — CRUD de Productos
- Crear estructura backend y `pom.xml`.
- Crear entidad, repositorio, servicio y controlador de `Producto`.
- Implementar validaciones de `ProductoRequest`.
- Crear `ProductoServiceTest` y `ProductoControllerTest`.
- Integrar `productoService.js` en frontend.
- Documentar endpoints de productos en Swagger.

### Persona 2 — CRUD de Usuarios
- Crear entidad, repositorio, servicio y controlador de `Usuario`.
- Implementar validaciones de `UsuarioRequest`.
- Crear `CognitoSecurityConfig` y configuración JWT.
- Crear `src/auth/cognito.js` y `src/auth/AuthRoutes.jsx`.
- Integrar `usuarioService.js` e interceptor Bearer en Axios.
- Documentar seguridad y scopes `read/write`.

### Persona 3 — CRUD de Pedidos
- Crear entidad, repositorio, servicio y controlador de `Pedido`.
- Implementar validaciones de `PedidoRequest`.
- Crear `ApiErrors`, `CorsConfig` y `OpenApiConfig`.
- Integrar `pedidoService.js`.
- Preparar archivos AWS: `application-aws.properties`, `application-mysql.properties`, `amplify.yml`, `deploy/pasteleria.env.example` y `deploy/pasteleria.service`.
- Elaborar `Documentacion_del_proceso.md`.

## Tareas compartidas acreditadas
- CRUD de `Contacto` (entidad, repositorio, servicio, controlador, validación e integración `contactoService.js`): Persona 1, Persona 2 y Persona 3.
- `httpClient.js` y `getErrorMessage.js`: Persona 1, Persona 2 y Persona 3.
- Actualización de `App.jsx` con rutas de autenticación: Persona 1, Persona 2 y Persona 3.
- Configuración `.env.local.example`: Persona 1, Persona 2 y Persona 3.
- Verificación final de CRUD, Swagger, JWT y despliegue: Persona 1, Persona 2 y Persona 3.
