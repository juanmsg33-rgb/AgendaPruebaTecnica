# Prueba Técnica Full Stack — Repositorio base (Node)

Este repo existe para que **no pierdas tiempo en configuración**. Lo aburrido ya
está resuelto; lo que evaluamos lo construyes tú.

Recuerda: la parte práctica está pensada para **un máximo de 3 horas**. No pasa
nada si usas IA — solo pedimos que entiendas y puedas explicar lo que entregues.

---

## Arranque rápido

Necesitas **Node 18.18+**.

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

Luego abre: http://localhost:3000/health
Si ves `{"status":"ok","db":true}`, todo está corriendo.

> `npm install` compila `better-sqlite3`. En la mayoría de los sistemas usa un
> binario precompilado y no necesitas nada extra.

---

## El reto (resumen)

Un **mini-gestor de contactos (leads)** que funcione de punta a punta:

**formulario público → tu API → base de datos → panel protegido**

1. Formulario público de contacto (nombre, correo, mensaje) con validación
   **en cliente y en servidor**.
2. Al enviarse, el contacto se **guarda en la base de datos** vía tu API.
3. Una **vista de administración protegida** que lista los contactos, del más
   reciente al más antiguo.
4. Manejo básico de errores.

No sobre-ingenierices: preferimos algo simple y bien resuelto.

---

## Qué ya está hecho (no necesitas tocarlo)

- Proyecto de Express que arranca con `npm run dev`.
- Conexión a **SQLite ya configurada** (`src/db.js`) — crea el archivo solo.
- Lectura de body JSON y de formularios.
- Servido de estáticos desde `src/public` (por si usas HTML/CSS/JS "vanilla").
- Ruta `/health` funcionando.
- `.gitignore` correcto (no subas `node_modules` ni tu `.env`).

## Qué construyes tú (esto es lo que evaluamos)

| Dónde | Qué falta |
|---|---|
| `src/db.js` | Diseñar el **esquema** de la tabla de contactos. |
| `src/routes/contacts.js` | `POST /api/contacts` (guardar) y `GET /api/contacts` (listar). |
| `src/middleware/auth.js` | La **autenticación** del panel (ahora no protege nada). |
| `src/public/` *(o tu front)* | El **formulario** y la **vista de administración**. |

El front-end es tu decisión: puedes usar la carpeta `src/public` con vanilla, o
montar **Astro / Next / Svelte** aparte. Lo único imprescindible es que consuma
tu propia API.

---

## Entrega

- Este repositorio en **GitHub** con tus commits.
- Completa la sección de abajo en este mismo README.
- Opcional: un video corto (2–3 min) mostrándolo funcionar. **No** hace falta
  desplegarlo; el despliegue lo conversamos en la sesión en vivo.

### Para completar por el candidato

**Cómo correr mi proyecto:**

Backend (Express + SQLite):
```bash
cd prueba-full-stack
npm install
cp .env.example .env
npm run dev
```
El backend corre en http://localhost:3000

Frontend (Angular + Material UI):
```bash
cd frontend
npm install
npx ng serve
```
El frontend corre en http://localhost:4200

**Decisiones técnicas (3–4 puntos):**

1. **Simplificación del frontend**: El frontend original tenía CRUD completo (crear, editar, eliminar) pero el backend del README solo requiere POST (crear) y GET (listar). Decidí simplificar el frontend al mínimo para cumplir exactamente con los requisitos, eliminando edición y eliminación. Esto alinea con el principio del README de "no sobre-ingenierices".

2. **Basic Auth en lugar de JWT**: El frontend original usaba JWT con login dinámico. Para este backend, implementé Basic Auth simple que usa las credenciales ADMIN_USER/ADMIN_PASSWORD del .env. Es más simple, cumple con los requisitos de autenticación para el panel protegido, y no requiere estado de sesión.

3. **CORS para desarrollo**: Agregué middleware CORS en el backend para permitir requests desde localhost:4200 (frontend Angular). Esto es necesario porque ambos servicios corren en puertos diferentes (3000 y 4200).

4. **Validación en ambos lados**: Implementé validación en el frontend (Angular Forms con Validators) y también en el backend (Express con verificación manual de campos y regex de email). Esto cumple con el requisito de "validación en cliente y en servidor".

**Cómo usé IA:**

Le pedí a la IA que analizara ambos proyectos (backend Node y frontend Angular) y creara un plan para adaptar el frontend existente al backend requerido por el README. La IA me dio un plan detallado con todos los pasos necesarios: modificar el esquema de base de datos, implementar rutas POST/GET, agregar Basic Auth, configurar CORS, y adaptar el modelo, servicio, interceptor y componentes del frontend. Yo revisé el plan, ajusté el enfoque de simplificación del frontend (eliminar edición/eliminación en lugar de extender el backend), y luego implementé cada paso siguiendo el plan.

**Qué dejé pendiente por tiempo y cómo lo resolvería:**

No dejé nada pendiente - implementé todos los requisitos del README:
- ✅ Esquema de base de datos con tabla contacts
- ✅ POST /api/contacts (público) con validación
- ✅ GET /api/contacts (protegido) con autenticación
- ✅ Autenticación Basic Auth
- ✅ Formulario público (frontend Angular)
- ✅ Vista de administración protegida (frontend Angular)
- ✅ Validación en cliente y servidor
- ✅ Manejo básico de errores
