// ─────────────────────────────────────────────────────────────
//  Conexión a SQLite — Configuración de base de datos
// ─────────────────────────────────────────────────────────────
//
// Este archivo configura la conexión a SQLite y define el esquema
// de la tabla de contactos para el mini-gestor de leads.
//
// better-sqlite3 es una librería síncrona y rápida para SQLite.
// Usamos WAL (Write-Ahead Logging) para mejor concurrencia.
// ─────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';

// Ruta del archivo de base de datos (configurable vía .env)
const dbPath = process.env.DATABASE_PATH || './db/app.sqlite';

// Crear/abrir conexión a la base de datos
const db = new Database(dbPath);

// WAL permite múltiples lecturas simultáneas mientras se escribe
db.pragma('journal_mode = WAL');

// ─────────────────────────────────────────────────────────────
//  Esquema de la tabla contacts
// ─────────────────────────────────────────────────────────────
//
// La tabla contacts almacena la información de los leads/contactos:
// - id: Identificador único auto-incremental
// - name: Nombre del contacto (requerido)
// - email: Correo electrónico del contacto (requerido)
// - message: Mensaje del contacto (requerido)
// - created_at: Timestamp de creación (automático)
//
// Este diseño es simple y cumple con los requisitos del README:
// formulario público con nombre, correo y mensaje.
// ─────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// ─────────────────────────────────────────────────────────────
//  Índice para ordenamiento eficiente
// ─────────────────────────────────────────────────────────────
//
// El README requiere listar contactos "del más reciente al más antiguo".
// Este índice en created_at DESC optimiza las consultas ORDER BY.
// ─────────────────────────────────────────────────────────────

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC)
`);

export default db;
