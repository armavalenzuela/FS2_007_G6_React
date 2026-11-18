# Lo Que Falta Para El Cumplimiento De La Rúbrica

## Objetivo
Checklist únicamente con los requisitos de:
- `DSY1104 Evaluación Parcial 3 - Anexo 1 Instrucciones.pdf`
- `DSY1104 Evaluación Parcial 3_EE_EP_Estudiante.pdf`

## 1. Backend
- [x] Aplicación backend Spring Boot creada.
- [x] Conexión a base de datos configurada.
- [x] Modelos de datos creados.
- [x] Repositorios y servicios implementados.
- [x] Lógica de negocio implementada.
- [x] Servicios API REST con operaciones CRUD.
- [x] Rutas versionadas en la API.
- [x] Endpoints documentados en Swagger.
- [x] Autenticación de usuarios con roles y JWT.
- [x] Compilar y ejecutar backend para validación final.

## 2. Integración frontend-backend
- [x] Frontend consume la API REST con Axios.
- [x] Integración de autenticación.
- [x] Integración de productos.
- [x] Integración de usuarios.
- [x] Integración de catálogo.
- [x] Integración de detalle de producto.
- [x] Integración de contacto.
- [x] Migrar pedidos/checkout a la API (persistencia en MySQL, stock descontado en backend).
- [x] Validación de comunicación REST.

## 3. Seguridad y sesiones
- [x] Autenticación con roles.
- [x] Autenticación basada en JWT.
- [x] Gestión de sesión en frontend.
- [x] Persistencia de sesión en recargas.
- [x] Restricciones de acceso por rol en frontend.

## 4. Roles del sistema
- [x] Administrador: acceso total.
- [x] Vendedor: visualiza productos y órdenes con detalle.
- [x] Validar que Vendedor no tenga otros accesos (menú filtrado; escritura restringida a ADMIN).
- [x] Cliente: acceso a la tienda.

## 5. Documentación y entregables
- [x] Enlace GitHub público del frontend.
- [x] Enlace GitHub público del backend o carpeta backend en el repositorio.
- [x] Proyecto frontend comprimido.
- [x] Proyecto backend comprimido.
- [x] Manual de usuario.
- [x] Documento de integración.
- [x] Documentación de APIs.
- [x] Documento ERS.
- [ ] Manual de usuario con pantallazos detallados.

## 6. Pruebas
- [x] Pruebas backend ejecutadas (2/2 OK).
- [x] Pruebas frontend ejecutadas (46/46 OK).
- [ ] Pruebas de integración documentadas con resultados.

## 7. Estado final
- [x] Validación final completa con backend ejecutándose (MySQL).
- [x] Verificación de roles y permisos.
- [x] Verificación de persistencia de sesión (sessionStorage JWT).
- [ ] Entrega de documentos y presentación.
