// ─────────────────────────────────────────────────────────────
//  Middleware de Autenticación - Basic Auth
// ─────────────────────────────────────────────────────────────
//
// Este middleware protege las rutas de administración usando Basic Auth.
// Basic Auth es un esquema simple de autenticación HTTP donde las credenciales
// se envían en el header Authorization codificadas en Base64.
//
// Formato del header: Authorization: Basic base64(username:password)
//
// Por qué Basic Auth y no JWT?
// - Más simple para este proyecto (sin estado de sesión)
// - Cumple con los requisitos del README ("autenticación simple")
// - Usa credenciales estáticas del .env (ADMIN_USER/ADMIN_PASSWORD)
// - Suficiente para una vista de administración protegida
// ─────────────────────────────────────────────────────────────

export function requireAuth(req, res, next) {
  // Extraer el header Authorization de la request
  const authHeader = req.headers.authorization;

  // Verificar que el header existe y tiene el formato correcto
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    // WWW-Authenticate le dice al navegador que muestre el diálogo de login
    res.setHeader('WWW-Authenticate', 'Basic realm="Contact Administration"');
    return res.status(401).json({ error: 'Autenticación requerida' });
  }

  try {
    // ─────────────────────────────────────────────────────────
    //  Decodificar credenciales
    // ─────────────────────────────────────────────────────────
    //
    // El header tiene formato: "Basic base64(username:password)"
    // 1. Extraemos la parte después de "Basic "
    // 2. Decodificamos de Base64 a string
    // 3. Separamos username y password
    // ─────────────────────────────────────────────────────────

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // ─────────────────────────────────────────────────────────
    //  Verificar credenciales
    // ─────────────────────────────────────────────────────────
    //
    // Comparamos las credenciales recibidas con las del .env:
    // - ADMIN_USER (default: admin)
    // - ADMIN_PASSWORD (default: changeme)
    // ─────────────────────────────────────────────────────────

    const validUser = process.env.ADMIN_USER;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username === validUser && password === validPassword) {
      // Credenciales válidas: permitir acceso a la ruta
      return next();
    } else {
      // Credenciales inválidas: denegar acceso
      res.setHeader('WWW-Authenticate', 'Basic realm="Contact Administration"');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.setHeader('WWW-Authenticate', 'Basic realm="Contact Administration"');
    return res.status(401).json({ error: 'Error en autenticación' });
  }
}
