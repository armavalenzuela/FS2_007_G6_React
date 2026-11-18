# Pastelería Mil Sabores — Full Stack

Aplicación web full-stack de tienda online de pastelería: frontend React (Vite) + backend Spring Boot (Java 21) sobre MySQL 8.4, con autenticación JWT y roles (ADMIN, VENDEDOR, CLIENTE). Documentación de la API en Swagger.

## Documentación

Toda la documentación está en la carpeta [`docs/`](docs/):

| Archivo | Contenido |
|---|---|
| [Arquitectura.md](docs/Arquitectura.md) | Arquitectura, funcionamiento, integración frontend-backend, seguridad, datos iniciales, notas. |
| [Interacciones.md](docs/Interacciones.md) | Interacciones detalladas frontend-backend con referencias a archivos y líneas. |
| [Reparticion_Tareas.md](docs/Reparticion_Tareas.md) | Repartición de tareas por persona, rutas exactas y archivos involucrados. |
| [Instalaciones para que el proyecto funcione.md](docs/Instalaciones%20para%20que%20el%20proyecto%20funcione.md) | Instalación de JDK, Maven, Node, MySQL, Git y puesta en marcha. |
| [Lo_Que_Falta_Para_El_Cumplimiento_De_La_Rubrica.md](docs/Lo_Que_Falta_Para_El_Cumplimiento_De_La_Rubrica.md) | Checklist de cumplimiento de la rúbrica. |
| [API.md](docs/API.md) | Endpoints de la API REST. |
| [ERS.md](docs/ERS.md) | Especificación de requerimientos. |
| [Manual_Usuario.md](docs/Manual_Usuario.md) | Manual de usuario. |
| [Preguntas y respuestas.md](docs/Preguntas%20y%20respuestas.md) | Preguntas probables de la presentación con respuestas y referencias exactas. |

## Ejecución rápida

```powershell
# Backend (requiere JDK 21, Maven y MySQL 8.4)
cd pasteleria-api
mvn spring-boot:run

# Frontend
cd react_pasteleria
npm install
# crear .env.local con VITE_API_URL=http://localhost:8080/api
npm run dev
```

- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- Swagger: http://localhost:8080/swagger-ui/index.html

## Credenciales demo
- Admin: `admin@duoc.cl` / `admin123`
- Vendedor: `vendedor@duoc.cl` / `vendedor1`
- Cliente: `cliente@duoc.cl` / `cliente123`