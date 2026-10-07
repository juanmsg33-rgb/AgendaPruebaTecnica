// ─────────────────────────────────────────────────────────────
//  Rutas de la API de contactos
// ─────────────────────────────────────────────────────────────
//
// Este archivo define los endpoints de la API para gestionar contactos:
// - POST /api/contacts (público): Crear un nuevo contacto
// - GET /api/contacts (protegido): Listar todos los contactos
//
// Cumple con los requisitos del README:
// - Formulario público → API → base de datos
// - Vista de administración protegida
// - Validación en servidor
// - Listado del más reciente al más antiguo
// ─────────────────────────────────────────────────────────────

import { Router } from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// ─────────────────────────────────────────────────────────────
//  POST /api/contacts - Crear contacto (PÚBLICO)
// ─────────────────────────────────────────────────────────────
//
// Este endpoint es público: cualquier persona puede enviar un formulario
// de contacto sin autenticación. Esto cumple con el requisito de
// "formulario público" del README.
//
// Flujo:
// 1. Extraer name, email, message del body
// 2. Validar que todos los campos estén presentes
// 3. Validar formato de email con regex
// 4. Insertar en base de datos usando prepared statement (seguro contra SQL injection)
// 5. Retornar 201 con el contacto creado
// ─────────────────────────────────────────────────────────────

router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  // Validación en servidor (requisito del README: "validación en cliente y en servidor")
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Todos los campos son requeridos: name, email, message' });
  }

  // Validación básica de email con regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    // Prepared statement para seguridad (evita SQL injection)
    const stmt = db.prepare(`
      INSERT INTO contacts (name, email, message)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, email, message);

    // Retornar el contacto creado con su ID
    const newContact = {
      id: result.lastInsertRowid,
      name,
      email,
      message,
      created_at: new Date().toISOString()
    };

    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error al guardar contacto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ─────────────────────────────────────────────────────────────
//  GET /api/contacts - Listar contactos (PROTEGIDO)
// ─────────────────────────────────────────────────────────────
//
// Este endpoint está protegido con autenticación Basic Auth.
// Solo usuarios con credenciales válidas pueden ver la lista.
// Esto cumple con el requisito de "vista de administración protegida".
//
// Flujo:
// 1. Middleware requireAuth verifica credenciales Basic Auth
// 2. Si válido, consulta todos los contactos ordenados por fecha DESC
// 3. Retorna array de contactos
//
// El ordenamiento DESC cumple con: "del más reciente al más antiguo"
// ─────────────────────────────────────────────────────────────

router.get('/', requireAuth, (req, res) => {
  try {
    // Consulta con ORDER BY created_at DESC para mostrar los más recientes primero
    const stmt = db.prepare(`
      SELECT id, name, email, message, created_at
      FROM contacts
      ORDER BY created_at DESC
    `);
    const contacts = stmt.all();

    res.json(contacts);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
