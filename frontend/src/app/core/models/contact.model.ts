/**
 * ─────────────────────────────────────────────────────────────
 *  Modelo de Contacto - Interfaz TypeScript
 * ─────────────────────────────────────────────────────────────
 *
 * Esta interfaz define la estructura de datos de un Contacto.
 * Mapea directamente con el esquema de la base de datos SQLite.
 *
 * Campos:
 * - id: Identificador único (opcional al crear, obligatorio al leer)
 * - name: Nombre del contacto
 * - email: Correo electrónico del contacto
 * - message: Mensaje del contacto
 * - created_at: Timestamp de creación (opcional)
 *
 * Por qué este diseño?
 * - Mapeo 1:1 con la tabla contacts de SQLite
 * - Simplificado a los 3 campos requeridos por el README
 * - id opcional permite usar la misma interfaz para crear (sin id) y leer (con id)
 * ─────────────────────────────────────────────────────────────
 */
export interface Contact {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}
