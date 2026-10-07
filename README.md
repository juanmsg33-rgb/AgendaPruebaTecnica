# Mini-Gestor de Contactos Full-Stack

Proyecto full-stack que implementa un mini-gestor de contactos (leads) con Express + SQLite (backend) y Angular + Material UI (frontend).

## 📋 Requisitos

- **Node.js** 18.18+ para ambos proyectos
- **npm** (incluido con Node.js)

## 🚀 Arranque Rápido

### Backend (Express + SQLite)

```bash
cd prueba-full-stack
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

El backend corre en: http://localhost:3000

Verificar que está funcionando:
```bash
curl http://localhost:3000/health
# Debe retornar: {"status":"ok","db":true}
```

### Frontend (Angular + Material UI)

```bash
cd frontend
npm install
npx ng serve
```

El frontend corre en: http://localhost:4200

## 📁 Estructura del Proyecto

```
.
├── prueba-full-stack/        # Backend (Express + SQLite)
│   ├── src/
│   │   ├── db.js           # Esquema de base de datos
│   │   ├── middleware/
│   │   │   └── auth.js     # Autenticación Basic Auth
│   │   ├── routes/
│   │   │   └── contacts.js # Endpoints POST/GET
│   │   └── server.js       # Servidor Express
│   └── db/                 # Archivos de SQLite (ignorados por git)
│
└── frontend/               # Frontend (Angular + Material UI)
    ├── src/
    │   └── app/
    │       ├── core/
    │       │   ├── models/      # Modelo de Contact
    │       │   ├── services/    # Servicio HTTP
    │       │   └── interceptors/ # Interceptor Basic Auth
    │       └── features/
    │           └── contacts/
    │               ├── contact-form/  # Formulario de creación
    │               └── contact-list/  # Lista de contactos
    └── angular.json
```

## 🔧 Configuración

### Backend (.env)

El archivo `.env` en `prueba-full-stack/` se crea copiando `.env.example`:

```bash
cd prueba-full-stack
cp .env.example .env     # en Windows: copy .env.example .env
```

**IMPORTANTE**: No commits el archivo `.env` (está en .gitignore). Las credenciales están en `.env.example` pero debes cambiarlas en producción.

Para más detalles, consulta el README del backend: [prueba-full-stack/README.md](prueba-full-stack/README.md)

## 📡 API Endpoints

### POST /api/contacts (Público)

Crea un nuevo contacto.

**Request:**
```json
{
  "name": "Juan Perez",
  "email": "juan@example.com",
  "message": "Hola, este es un mensaje de prueba"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Juan Perez",
  "email": "juan@example.com",
  "message": "Hola, este es un mensaje de prueba",
  "created_at": "2026-10-07T18:45:59.301Z"
}
```

### GET /api/contacts (Protegido)

Lista todos los contactos del más reciente al más antiguo.

**Authentication:** Basic Auth (admin:changeme)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Juan Perez",
    "email": "juan@example.com",
    "message": "Hola, este es un mensaje de prueba",
    "created_at": "2026-10-07 18:45:59"
  }
]
```

## 🔐 Autenticación

- **Frontend → Backend (POST)**: Público, no requiere autenticación
- **Frontend → Backend (GET)**: Basic Auth con credenciales del .env
- El interceptor en Angular inyecta automáticamente el header `Authorization: Basic base64(user:pass)`

## ✅ Características Implementadas

### Backend
- ✅ Esquema de base de datos SQLite con tabla `contacts`
- ✅ POST /api/contacts con validación en servidor
- ✅ GET /api/contacts protegido con Basic Auth
- ✅ CORS configurado para desarrollo
- ✅ Healthcheck endpoint

### Frontend
- ✅ Formulario público con 3 campos (name, email, message)
- ✅ Validación en cliente (Angular Reactive Forms)
- ✅ Lista de contactos en vista de administración
- ✅ Autenticación automática via interceptor
- ✅ UI con Angular Material

## 📝 Notas para la Entrevista

### Decisiones Técnicas

1. **Simplificación del frontend**: El frontend original tenía CRUD completo pero el backend solo requiere POST y GET. Se simplificó para cumplir exactamente con los requisitos.

2. **Basic Auth en lugar de JWT**: Más simple para este proyecto, cumple con los requisitos, usa credenciales estáticas del .env.

3. **CORS para desarrollo**: Necesario porque backend (puerto 3000) y frontend (puerto 4200) corren en diferentes puertos.

4. **Validación en ambos lados**: Validación en cliente (Angular Forms) y servidor (Express) como requiere el README.

### Arquitectura

- **Backend**: Express middleware pattern, SQLite con better-sqlite3 (síncrono y rápido)
- **Frontend**: Angular standalone components, Signals para estado reactivo, interceptor para auth
- **Comunicación**: REST API con JSON, Basic Auth para endpoints protegidos

