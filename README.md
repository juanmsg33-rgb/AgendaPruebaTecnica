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

## 🔧 Configuración

### Backend (.env)

El archivo `.env` en `prueba-full-stack/` se crea copiando `.env.example`:

```bash
cd prueba-full-stack
cp .env.example .env     # en Windows: copy .env.example .env
```

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
- ✅ Manejo de errores de conexión con mensajes toast específicos
- ✅ Detección de errores de red/internet

## 📝 Notas para la Entrevista

### Decisiones Técnicas

1. **Simplificación del frontend**: El frontend cumple con los requisitos del backend solo requiere POST y GET.

2. **Basic Auth en lugar de JWT**: Más simple para este proyecto, cumple con los requisitos, usa credenciales estáticas del .env.

3. **CORS para desarrollo**: Necesario porque backend (puerto 3000) y frontend (puerto 4200) corren en diferentes puertos.

4. **Validación en ambos lados**: Validación en cliente (Angular Forms) y servidor (Express) como requiere el README.

### Arquitectura

- **Backend**: Express middleware pattern, SQLite con better-sqlite3 (síncrono y rápido)
- **Frontend**: Angular standalone components, Signals para estado reactivo, interceptor para auth
- **Comunicación**: REST API con JSON, Basic Auth para endpoints protegidos

