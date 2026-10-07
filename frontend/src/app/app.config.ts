/**
 * ─────────────────────────────────────────────────────────────
 *  Configuración Global de la Aplicación Angular
 * ─────────────────────────────────────────────────────────────
 *
 * Este archivo es el punto central de configuración de Angular.
 * Aquí registramos todos los providers y configuraciones globales.
 *
 * Configuraciones:
 * - ZoneChangeDetection: optimización de detección de cambios
 * - Router: configuración de rutas de la aplicación
 * - HttpClient: cliente HTTP con interceptor de autenticación
 * - Animations: necesarias para Angular Material
 *
 * Por qué esta configuración?
 * - Centralizada: toda la config está en un solo lugar
 * - Type-safe: TypeScript verifica que todo esté bien configurado
 * - Standalone components: la forma moderna de Angular (sin NgModule)
 * ─────────────────────────────────────────────────────────────
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ─────────────────────────────────────────────────────────
    //  ZoneChangeDetection
    // ─────────────────────────────────────────────────────────
    //
    // eventCoalescing: true agrupa múltiples eventos en un solo ciclo
    // de detección de cambios, mejorando el rendimiento.
    // ─────────────────────────────────────────────────────────

    provideZoneChangeDetection({ eventCoalescing: true }),

    // ─────────────────────────────────────────────────────────
    //  Router
    // ─────────────────────────────────────────────────────────
    //
    // Configura el sistema de rutas de Angular.
    // En este caso, routes está vacío porque la app es single-page
    // sin navegación entre vistas.
    // ─────────────────────────────────────────────────────────

    provideRouter(routes),

    // ─────────────────────────────────────────────────────────
    //  HttpClient con Interceptor
    // ─────────────────────────────────────────────────────────
    //
    // Configura el cliente HTTP de Angular.
    // Registra el authInterceptor que inyecta Basic Auth
    // Todas las requests HTTP pasarán por este interceptor
    //
    // Por qué withInterceptors?
    // - Es la forma moderna de registrar interceptores en Angular 17+
    // - Más simple que el antiguo HTTP_INTERCEPTORS en NgModule
    // ─────────────────────────────────────────────────────────

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // ─────────────────────────────────────────────────────────
    //  Animations
    // ─────────────────────────────────────────────────────────
    //
    // Necesario para que funcionen las animaciones de Angular Material
    // (dialogs, snackbars, etc.).
    // ─────────────────────────────────────────────────────────

    provideAnimations()
  ]
};
