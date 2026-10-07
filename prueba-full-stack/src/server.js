// ─────────────────────────────────────────────────────────────
//  Servidor Express - Punto de entrada de la aplicación
// ─────────────────────────────────────────────────────────────
//
// Este archivo configura y arranca el servidor Express.
// Es el punto central que conecta todos los componentes:
// - Configuración de middleware (CORS, body parsing)
// - Rutas de la API
// - Archivos estáticos (opcional)
// - Healthcheck
//
// Arranca con: npm run dev → http://localhost:3000
// ─────────────────────────────────────────────────────────────

import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';

import db from './db.js';
import contactsRouter from './routes/contacts.js';

// Obtener el directorio actual del archivo
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Crear instancia de Express
const app = express();

// Puerto desde .env o 3000 por defecto
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
//  Middleware CORS
// ─────────────────────────────────────────────────────────────
//
// CORS (Cross-Origin Resource Sharing) permite que el frontend
// (Angular en localhost:4200) haga requests al backend (localhost:3000).
//
// Sin CORS, el navegador bloquearía los requests por políticas de seguridad.
// Aquí permitimos explícitamente requests desde localhost:4200.
// ─────────────────────────────────────────────────────────────

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// ─────────────────────────────────────────────────────────────
//  Middleware de Body Parsing
// ─────────────────────────────────────────────────────────────
//
// Estos middleware permiten al servidor leer el body de las requests:
// - express.json(): Parsea body en formato JSON
// - express.urlencoded(): Parsea body de formularios HTML
//
// Necesario para que POST /api/contacts pueda leer name, email, message
// ─────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────
//  Archivos estáticos (opcional)
// ─────────────────────────────────────────────────────────────
//
// Sirve archivos estáticos desde src/public si prefieres un frontend
// "vanilla" (HTML/CSS/JS). En este caso usamos Angular separado,
// así que esta carpeta no se usa, pero el middleware está configurado.
// ─────────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────
//  Healthcheck
// ─────────────────────────────────────────────────────────────
//
// Endpoint simple para verificar que el servidor está funcionando.
// Retorna:
// - status: "ok" si el servidor está corriendo
// - db: true si la conexión a SQLite está abierta
//
// Útil para verificar que todo arranca correctamente antes de probar.
// ─────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db.open });
});

// ─────────────────────────────────────────────────────────────
//  Rutas de la API
// ─────────────────────────────────────────────────────────────
//
// Montamos el router de contactos en /api/contacts.
// Esto expone los endpoints:
// - POST /api/contacts (crear contacto)
// - GET /api/contacts (listar contactos)
// ─────────────────────────────────────────────────────────────

app.use('/api/contacts', contactsRouter);

// ─────────────────────────────────────────────────────────────
//  Iniciar servidor
// ─────────────────────────────────────────────────────────────
//
// El servidor empieza a escuchar en el puerto configurado.
// ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`▶  Servidor en http://localhost:${PORT}`);
  console.log(`   Healthcheck:  http://localhost:${PORT}/health`);
});
