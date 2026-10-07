/**
 * ─────────────────────────────────────────────────────────────
 *  Componente Raíz - Layout Principal de la Aplicación
 * ─────────────────────────────────────────────────────────────
 *
 * Este es el componente raíz de la aplicación Angular.
 * Define el layout principal y carga los componentes hijos.
 *
 * Estructura:
 * - Toolbar de Angular Material con título e icono
 * - Área principal (main) donde se renderiza ContactListComponent
 *
 * Por qué es simple?
 * - No maneja lógica de negocio (eso está en ContactListComponent)
 * - No maneja autenticación (eso está en el interceptor)
 * - Solo define el layout visual de la aplicación
 * ─────────────────────────────────────────────────────────────
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from './features/contacts/contact-list/contact-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContactListComponent, MatToolbarModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="mat-elevation-z6">
      <mat-icon>contact_phone</mat-icon>
      <span style="margin-left: 10px;">Agenda de Contactos</span>
    </mat-toolbar>

    <main>
      <app-contact-list></app-contact-list>
    </main>
  `,
  styles: [`
    main { padding: 20px; background-color: #f5f5f5; min-height: calc(100vh - 64px); }
  `]
})
export class AppComponent {
  // ─────────────────────────────────────────────────────────
  //  Sin lógica de inicialización
  // ─────────────────────────────────────────────────────────
  //
  // En el diseño original con JWT, este componente se encargaba de:
  // - Obtener un token de autenticación al iniciar
  // - Mostrar estado de carga mientras se autenticaba
  //
  // Con Basic Auth en el interceptor, esa lógica ya no es necesaria:
  // - El interceptor inyecta las credenciales automáticamente
  // - No hay estado de sesión ni tokens
  // - La app carga directamente sin pasos previos
  // ─────────────────────────────────────────────────────────
}

