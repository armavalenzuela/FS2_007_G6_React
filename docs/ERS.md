# ERS - Pastelería Mil Sabores

## 1. Descripción
Aplicación web de tienda online de pastelería con frontend React y backend Spring Boot. Permite gestionar productos, usuarios, pedidos y contactos, con autenticación JWT y roles (ADMIN, VENDEDOR, CLIENTE).

## 2. Requerimientos funcionales
- RF1: El administrador gestiona productos (crear, editar, eliminar, listar).
- RF2: El vendedor visualiza productos y pedidos con su detalle.
- RF3: El cliente accede a la tienda y a su cuenta.
- RF4: El sistema autentica usuarios con JWT.
- RF5: El frontend consume la API REST del backend.
- RF6: Los pedidos se registran y consultan.

## 3. Requerimientos no funcionales
- RNF1: API documentada en Swagger.
- RNF2: Comunicación REST con JSON.
- RNF3: Seguridad por roles y tokens.
- RNF4: Persistencia en base de datos relacional.

## 4. Roles
- Administrador: acceso total.
- Vendedor: visualiza productos y órdenes con detalle.
- Cliente: accede solo a la tienda.

## 5. Herramientas
- Frontend: React, Vite, Axios, React Router.
- Backend: Spring Boot, Spring Data JPA, Spring Security, JWT, Swagger.
- Base de datos: H2 local / MySQL en producción.
