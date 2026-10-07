/**
 * ─────────────────────────────────────────────────────────────
 *  Interceptor de Autenticación - Basic Auth
 * ─────────────────────────────────────────────────────────────
 *
 * Los interceptores en Angular son middleware que interceptan todas las
 * requests HTTP salientes antes de llegar al servidor. Aquí implementamos
 * autenticación automática usando Basic Auth.
 *
 * Flujo:
 * 1. Cada request HTTP pasa por este interceptor
 * 2. Si es GET /api/contacts, inyecta header Authorization: Basic base64(user:pass)
 * 3. Si es POST /api/contacts, no inyecta auth (es público)
 * 4. La request modificada continúa al servidor
 *
 * Por qué un interceptor?
 * - Centraliza la lógica de autenticación en un solo lugar
 * - No hay que repetir código en cada servicio
 * - Automático: los componentes no necesitan preocuparse de auth
 * - Fácil de cambiar si decidimos usar otro esquema de auth
 * ─────────────────────────────────────────────────────────────
 */
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // ─────────────────────────────────────────────────────────
  //  Clonar la request
  // ─────────────────────────────────────────────────────────
  //
  // Las requests en Angular son inmutables. Para modificarlas,
  // debemos crear un clon con los cambios deseados.
  // ─────────────────────────────────────────────────────────

  let clonedRequest = req;

  // ─────────────────────────────────────────────────────────
  //  Inyectar Basic Auth solo para GET /api/contacts
  // ─────────────────────────────────────────────────────────
  //
  // POST /api/contacts es público (formulario público del README).
  // GET /api/contacts está protegido (vista de administración).
  //
  // Solo inyectamos auth para GET, no para POST.
  // ─────────────────────────────────────────────────────────

  if (req.method === 'GET' && req.url.includes('/api/contacts')) {
    // Credenciales del backend (del .env: admin/changeme)
    // En producción, estas deberían venir de environment variables
    const username = 'admin';
    const password = 'changeme';

    // Codificar en Base64: base64("admin:changeme")
    const credentials = btoa(`${username}:${password}`);

    // Clonar la request y agregar header Authorization
    clonedRequest = clonedRequest.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
  }

  // ─────────────────────────────────────────────────────────
  //  Continuar con la request
  // ─────────────────────────────────────────────────────────
  //
  // Pasamos la request (posiblemente modificada) al siguiente handler
  // en la cadena de interceptores y finalmente al servidor.
  // ─────────────────────────────────────────────────────────

  return next(clonedRequest);
};
