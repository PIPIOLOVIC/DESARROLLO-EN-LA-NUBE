# AguaFix API

API REST construida con **NestJS (v11)** y **TypeScript** diseñada para que los ciudadanos reporten fugas de agua en la vía pública. Al registrarse un reporte, la información se persiste en una base de datos **PostgreSQL** y se envía de forma automática un correo electrónico con plantilla HTML a la cuadrilla de mantenimiento del municipio.

## Tecnologías y Requisitos Cumplidos
- **Framework:** NestJS v11 con TypeScript.
- **Base de Datos & ORM:** PostgreSQL con TypeORM y **migraciones obligatorias** (`synchronize: false`).
- **Variables de Entorno:** Validadas y tipadas estrictamente mediante `env-var` y `dotenv` (`src/config/envs.ts`).
- **Seguridad:** Contraseñas cifradas obligatoriamente mediante `bcryptjs` con 10 salt rounds.
- **Mailing:** Notificaciones por correo electrónico utilizando `nodemailer` con plantilla HTML estructurada.
- **Arquitectura:** Módulos desacoplados siguiendo el flujo estricto: `Módulo -> Controlador -> Servicio -> Repositorio`.
- **Validación:** DTOs tipados y validados con `class-validator` y `class-transformer` con `ValidationPipe` global (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`).
- **Dockerización:** Contenedores para PostgreSQL y la API en modo desarrollo con recarga en caliente (`docker-compose.yml` + `Dockerfile`).

---

## Entidades de la Base de Datos

1. **`SYSTEM_USER` (Entidad User)**
   - `id`: Serial / Clave primaria auto-incremental.
   - `name`: Nombre completo del usuario.
   - `email`: Correo electrónico único.
   - `password`: Contraseña hasheada con bcryptjs (no expuesta en respuestas).
   - `isNotificationEnabled`: Booleano para control de notificaciones (por defecto `true`).

2. **`WATER_REPORT` (Entidad Report)**
   - `id`: Serial / Clave primaria auto-incremental.
   - `address`: Dirección o referencia de la fuga.
   - `description`: Descripción de lo observado.
   - `severity`: Nivel de gravedad (`low`, `medium`, `high`).
   - `reporterPhone`: Teléfono de contacto del ciudadano.
   - `isResolved`: Booleano (inicia por defecto en `false`).
   - `createdAt`: Timestamp con la fecha y hora de creación.

---

## Puesta en Marcha

### 1. Variables de Entorno
Copia el archivo `.env.template` como `.env`:
```bash
cp .env.template .env
```

Configura tus credenciales. Para pruebas de correo se recomienda Mailtrap:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password123
DB_NAME=aguafix_db

# Correo (Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=tu_usuario_mailtrap
MAIL_PASS=tu_password_mailtrap
MAIL_FROM="AguaFix Alertas <no-reply@aguafix.com>"
MAINTENANCE_EMAIL=cuadrilla_mantenimiento@municipio.gob
```

---

### 2. Opción A: Ejecutar con Docker Compose (Recomendado)
Levanta la base de datos PostgreSQL y la aplicación NestJS con un solo comando:
```bash
docker compose up --build
```
*Nota:* La aplicación cuenta con montaje de volúmenes para recarga en caliente (hot reload) al modificar el código.

---

### 3. Opción B: Ejecución Local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el contenedor de PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
3. Ejecutar las migraciones de TypeORM:
   ```bash
   npm run migration:run
   ```
4. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm run start:dev
   ```

---

## Migraciones de Base de Datos (TypeORM)

El proyecto opera estrictamente con `synchronize: false`. Utiliza los siguientes scripts:

- **Ejecutar migraciones pendientes:**
  ```bash
  npm run migration:run
  ```
- **Revertir la última migración:**
  ```bash
  npm run migration:revert
  ```
- **Generar una nueva migración (detecta cambios en entidades):**
  ```bash
  npm run migration:generate src/database/migrations/NombreMigracion
  ```
- **Crear una migración vacía:**
  ```bash
  npm run migration:create src/database/migrations/NombreMigracion
  ```

---

## Endpoints de la API

### Autenticación (`/auth`)

#### 1. Registro de Usuario
- **Método:** `POST`
- **Ruta:** `/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "password": "password123",
    "isNotificationEnabled": true
  }
  ```
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "isNotificationEnabled": true
  }
  ```

#### 2. Inicio de Sesión
- **Método:** `POST`
- **Ruta:** `/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "juan.perez@example.com",
    "password": "password123"
  }
  ```
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "message": "Inicio de sesión exitoso",
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "isNotificationEnabled": true
    }
  }
  ```
- **Respuesta Error (400 Bad Request):**
  ```json
  {
    "message": "Credenciales inválidas: usuario o contraseña incorrectos",
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

### Reportes de Fugas (`/reports`)

#### 1. Crear Reporte
- **Método:** `POST`
- **Ruta:** `/reports`
- **Descripción:** Guarda el reporte en la base de datos y envía automáticamente una notificación por correo con plantilla HTML sin interrumpir el flujo.
- **Body (JSON):**
  ```json
  {
    "address": "Av. Reforma #123, Col. Juárez",
    "description": "Fuga severa de agua potable sobre la banqueta",
    "severity": "high",
    "reporterPhone": "555-123-4567"
  }
  ```
- **Severidades permitidas:** `low`, `medium`, `high`.
- **Respuesta Exitosa (201 Created):**
  ```json
  {
    "id": 1,
    "address": "Av. Reforma #123, Col. Juárez",
    "description": "Fuga severa de agua potable sobre la banqueta",
    "severity": "high",
    "reporterPhone": "555-123-4567",
    "isResolved": false,
    "createdAt": "2026-09-06T12:00:00.000Z"
  }
  ```

#### 2. Listar Todos los Reportes
- **Método:** `GET`
- **Ruta:** `/reports`
- **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 1,
      "address": "Av. Reforma #123, Col. Juárez",
      "description": "Fuga severa de agua potable sobre la banqueta",
      "severity": "high",
      "reporterPhone": "555-123-4567",
      "isResolved": false,
      "createdAt": "2026-09-06T12:00:00.000Z"
    }
  ]
  ```

---

## Pruebas Automatizadas

```bash
# Pruebas Unitarias
npm test

# Pruebas de Integración (End-to-End)
npm run test:e2e
```