# Instalaciones para que el proyecto funcione

Guía de instalación y puesta en marcha del proyecto **Pastelería Mil Sabores** (frontend React + backend Spring Boot + MySQL).

## 1. Herramientas requeridas

| Herramienta | Versión mínima | Uso |
|---|---|---|
| JDK (Java) | 21 (Temurin/Adoptium) | Compilar y ejecutar el backend Spring Boot |
| Maven | 3.9.x | Gestión de dependencias y build del backend |
| Node.js | LTS (v20+) | Ejecutar el frontend React/Vite |
| npm | (incluido con Node) | Instalar dependencias del frontend |
| MySQL Server | 8.4 (o 8.x) | Base de datos relacional persistente |
| Git | cualquiera | Clonar el repositorio |

## 2. Paso a paso de instalación (Windows)

### 2.1 JDK 21
1. Descarga el instalador desde https://adoptium.net/ (Temurin 21, x64 .msi).
2. Ejecuta el instalador y marca la opción **"Set JAVA_HOME variable"** y **"Add to PATH"**.
3. Verifica en una terminal nueva:
   ```powershell
   java -version
   ```
   Debe mostrar `openjdk version "21..."`.

### 2.2 Maven
Maven no tiene instalador oficial con PATH. Opciones:
- **Opción A (manual):**
  1. Descarga el binario ZIP desde https://maven.apache.org/download.cgi.
  2. Extráelo en una carpeta, por ejemplo `C:\tools\maven`.
  3. Agrega `C:\tools\maven\bin` al PATH del sistema (Variables de entorno → Path → Nuevo).
  4. Verifica: `mvn -version`.
- **Opción B (gestor de paquetes):**
  - Chocolatey: `choco install maven`
  - Scoop: `scoop install maven`
  (Configuran el PATH automáticamente.)

### 2.3 Node.js + npm
1. Descarga el instalador LTS desde https://nodejs.org/.
2. Ejecuta el instalador (incluye npm).
3. Verifica:
   ```powershell
   node -v
   npm -v
   ```

### 2.4 MySQL 8.4
1. Descarga desde https://dev.mysql.com/downloads/installer/ o vía winget:
   ```powershell
   winget install Oracle.MySQL --silent --accept-package-agreements --accept-source-agreements
   ```
2. Inicializa el data directory (si no se hizo automáticamente):
   ```powershell
   New-Item -ItemType Directory -Path "C:\ProgramData\MySQL\MySQL Server 8.4\Data" -Force
   & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --initialize-insecure --datadir="C:\ProgramData\MySQL\MySQL Server 8.4\Data"
   ```
3. Inicia el servidor (o crea un servicio). En desarrollo se puede lanzar en segundo plano:
   ```powershell
   Start-Process -FilePath "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" -ArgumentList "--datadir=C:\ProgramData\MySQL\MySQL Server 8.4\Data","--console" -WindowStyle Hidden
   ```
4. Crea la base de datos:
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS pasteleria;"
   ```
5. Verifica conexión:
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -D pasteleria -e "SHOW TABLES;"
   ```

### 2.5 Git
1. Descarga desde https://git-scm.com/download/win.
2. Instala con opciones por defecto.

## 3. Puesta en marcha del proyecto

### 3.1 Clonar el repositorio
```powershell
git clone <URL_DEL_REPOSITORIO>
cd FS2_007_G6_React
```

### 3.2 Backend (Spring Boot)
```powershell
cd pasteleria-api
mvn spring-boot:run
```
- Requiere MySQL corriendo y la base `pasteleria` creada (Hibernate crea las tablas automáticamente).
- `data.sql` inserta usuarios demo y productos (con `INSERT IGNORE` para no duplicar).
- Endpoints base: `http://localhost:8080/api/v1`.
- Swagger: `http://localhost:8080/swagger-ui/index.html`.

### 3.3 Frontend (React/Vite)
```powershell
cd react_pasteleria
npm install
```
Crea el archivo `.env.local` con:
```
VITE_API_URL=http://localhost:8080/api
```
Luego:
```powershell
npm run dev
```
Frontend disponible en `http://localhost:5173`.

### 3.4 Verificación
- Backend health: `http://localhost:8080/actuator/health` (debe responder 200).
- Login admin: `admin@duoc.cl` / `admin123`.
- Login vendedor: `vendedor@duoc.cl` / `vendedor1`.
- Login cliente: `cliente@duoc.cl` / `cliente123`.

### 3.5 Pruebas
- Backend: `mvn test` (2/2 OK).
- Frontend: `npm test` (46/46 OK).

## 4. Notas para Linux/macOS
- Usa `brew install openjdk@21 maven node mysql` (macOS) o el gestor de tu distro.
- Los comandos equivalentes: `./mvnw spring-boot:run` (si se agrega wrapper) o `mvn spring-boot:run`; frontend igual con `npm`.
- MySQL se inicia con `brew services start mysql` o `sudo systemctl start mysql`.
- Crea la base con `mysql -u root -e "CREATE DATABASE pasteleria;"`.

## 5. Variables de entorno (backend)
| Variable | Default | Descripción |
|---|---|---|
| `DB_URL` | `jdbc:mysql://localhost:3306/pasteleria` | URL de la base de datos |
| `DB_USER` | `root` | Usuario de MySQL |
| `DB_PASSWORD` | (vacío) | Contraseña de MySQL |
| `APP_CORS_ORIGIN` | `http://localhost:5173` | Origen permitido por CORS |
| `JWT_SECRET` | `dev-secret-change-me-please-32-chars-minimum` | Secreto para firmar JWT |
| `JWT_EXPIRATION_MS` | `3600000` | Expiración del token en ms |