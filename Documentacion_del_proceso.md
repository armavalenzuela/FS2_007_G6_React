# Documentación del proceso

## 1. Prerrequisitos e instalación
Se preparó el entorno para trabajar con el proyecto React existente y el nuevo backend Spring Boot. Se verificó la estructura del repositorio, se definió la carpeta `pasteleria-api/` para el backend y se agregaron dependencias de frontend (`axios`, `oidc-client-ts`). Para compilar el backend se requiere JDK 21 y Maven; para AWS se requiere AWS CLI. El frontend se instala con `npm install` dentro de `react_pasteleria`.

## 2. Backend Spring Boot y persistencia local
Se creó `pasteleria-api/` con `pom.xml` usando Spring Boot 3.5.7, Java 21, Spring Web, Spring Data JPA, Validation, Actuator, OAuth2 Resource Server, H2 y MySQL. Se configuró `application.properties` para H2 en memoria, puerto 8080, CORS por variable `APP_CORS_ORIGIN` y salud en `/actuator/health`. Se crearon entidades `Producto`, `Usuario`, `Pedido` y `Contacto`, repositorios JPA y servicios transaccionales. Se generan IDs con `IDENTITY` y se aplican reglas de negocio antes de guardar.

## 3. CRUD, validación y errores
Cada recurso tiene controlador REST en `/api/productos`, `/api/usuarios`, `/api/pedidos` y `/api/contactos` con `GET`, `GET/{id}`, `POST`, `PUT/{id}` y `DELETE/{id}`. Los DTOs usan `@NotBlank`, `@Email`, `@PositiveOrZero`, `@Size` y `@Valid`. `ApiErrors` centraliza respuestas 400 para campos inválidos, JSON mal formado, parámetros incorrectos y `ResponseStatusException`. Los servicios lanzan 404 cuando un recurso no existe y mantienen el mismo id en actualizaciones.

## 4. Swagger y compatibilidad de versiones
Se agregó `springdoc-openapi-starter-webmvc-ui` 2.8.14 y `OpenApiConfig` con título, versión, descripción y grupo `v1` para `/api/**`. La documentación queda disponible en `/swagger-ui/index.html` y `/v3/api-docs`. Se evitó Springfox/Swagger 2 y se usó la combinación Boot 3 + springdoc 2.x indicada por la guía. También se incluyeron perfiles para MySQL.

## 5. React, Vite, Axios y CORS
Se creó `src/api/httpClient.js` con `axios.create`, `baseURL` desde `VITE_API_URL` y timeout. Se crearon servicios HTTP para productos, usuarios, pedidos y contactos. `getErrorMessage` traduce errores de API, timeout y CORS. `CorsConfig` permite el origen configurado y los métodos `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` con cabeceras `Content-Type` y `Authorization`. Se agregó `.env.local.example` y `amplify.yml`.

## 6. Rutas, formularios y tabla en React
Se agregaron rutas de autenticación (`/auth/callback`) y componentes `Login`, `LoginCallback` y `RequireJwt` en `src/auth/AuthRoutes.jsx`. La app mantiene las rutas existentes y suma servicios HTTP para listar, obtener, crear, actualizar y eliminar recursos. El interceptor de Axios agrega `Authorization: Bearer <token>` cuando hay sesión válida. No se migraron todavía los contextos, hooks o páginas existentes que usan `localStorage`; siguen funcionando como antes.

## 7. Pruebas, JWT, AWS y evidencias
Se crearon pruebas Java de servicio y controlador (`ProductoServiceTest`, `ProductoControllerTest`) y se configuró Mockito con `mock-maker-subclass`. Se agregó seguridad JWT con Cognito mediante `CognitoSecurityConfig` (perfil `cognito`), validando firma, emisor, `client_id`, `token_use` y scopes `read/write`. Se prepararon archivos de despliegue: `application-aws.properties`, `application-mysql.properties`, `deploy/pasteleria.env.example`, `deploy/pasteleria.service`, `.env.local.example` y `amplify.yml`. Las pruebas Vitest existentes no se modificaron ni adaptaron a HTTP; siguen probando la base local. El despliegue real en AWS, la configuración de Cognito y la publicación del frontend no se ejecutaron. La verificación local realizada fue `npm test` con 46 pruebas aprobadas; el backend no se compiló porque no hay JDK 21 ni Maven instalados.

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
- `pasteleria-api/src/main/java/cl/duoc/pasteleria/config/CognitoSecurityConfig.java`
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
- `pasteleria-api/src/main/resources/application-aws.properties`
- `pasteleria-api/src/main/resources/application-mysql.properties`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/controller/ProductoControllerTest.java`
- `pasteleria-api/src/test/java/cl/duoc/pasteleria/service/ProductoServiceTest.java`
- `pasteleria-api/src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker`

### Archivos creados: frontend
- `react_pasteleria/.env.local.example`
- `react_pasteleria/amplify.yml`
- `react_pasteleria/src/api/httpClient.js`
- `react_pasteleria/src/auth/AuthRoutes.jsx`
- `react_pasteleria/src/auth/cognito.js`
- `react_pasteleria/src/services/contactoService.js`
- `react_pasteleria/src/services/pedidoService.js`
- `react_pasteleria/src/services/productoService.js`
- `react_pasteleria/src/services/usuarioService.js`
- `react_pasteleria/src/utils/getErrorMessage.js`

### Archivos creados: despliegue y documentación
- `deploy/biblioteca.env.example`
- `deploy/pasteleria.service`
- `Documentacion_del_proceso.md`
- `Reparticion_Tareas.md`

### Archivo existente no creado por este proceso
- `react_pasteleria/FullStack_EXP_3.pdf` (material de entrada)


## 8 Falta despliegue y conexión real
1. Compilar backend con JDK 21/Maven: mvn clean package.
2. Crear instancia EC2, grupo de seguridad, par de claves y SSH.
3. Instalar Corretto 21 en EC2, copiar JAR y activar deploy/pasteleria.service.
4. Configurar /etc/pasteleria/pasteleria.env con perfiles aws,cognito y credenciales Cognito.
5. Crear user pool/cliente Cognito y scopes read/write.
6. Configurar RDS/MySQL o H2 en archivo y CORS con origen exacto del frontend.
7. Publicar frontend en Amplify con VITE_API_URL=https://api.../api.
8. Configurar ALB/ACM HTTPS y reescrituras SPA.
9. Probar CRUD, JWT 401/403, persistencia tras reinicio y CloudWatch.