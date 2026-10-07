/**
 * ─────────────────────────────────────────────────────────────
 *  Componente de Lista de Contactos - Vista de Administración
 * ─────────────────────────────────────────────────────────────
 *
 * Este componente es un "Smart Component" (componente inteligente).
 * Gestiona el estado de la aplicación y coordina con el servicio.
 *
 * Responsabilidades:
 * - Mostrar la lista de contactos en una tabla
 * - Abrir el formulario para crear nuevos contactos
 * - Manejar la comunicación con el servicio HTTP
 * - Mostrar notificaciones de éxito/error
 *
 * Por qué este patrón?
 * - Separación: componente "dumb" (formulario) vs "smart" (lista)
 * - Coordinación centralizada de la lógica de negocio
 * - Reutilización del formulario en diferentes contextos
 * ─────────────────────────────────────────────────────────────
 */
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { Contact } from '../../../core/models/contact.model';
import { ContactFormComponent } from '../contact-form/contact-form.component';

// Material Imports para UI
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Agenda de Contactos</mat-card-title>
          <button mat-raised-button color="primary" (click)="openForm()">
            <mat-icon>add</mat-icon> Nuevo Contacto
          </button>
        </mat-card-header>

        <mat-card-content>
          <table mat-table [dataSource]="contactService.contacts()" class="mat-elevation-z8">

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Nombre </th>
              <td mat-cell *matCellDef="let element"> {{element.name}} </td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef> Email </th>
              <td mat-cell *matCellDef="let element"> {{element.email}} </td>
            </ng-container>

            <ng-container matColumnDef="message">
              <th mat-header-cell *matHeaderCellDef> Mensaje </th>
              <td mat-cell *matCellDef="let element"> {{element.message}} </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef> Fecha </th>
              <td mat-cell *matCellDef="let element"> {{element.created_at | date:'short'}} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          @if (contactService.contacts().length === 0) {
            <div style="text-align: center; padding: 50px; color: gray;">
              <mat-icon style="font-size: 48px; width: 48px; height: 48px;">person_off</mat-icon>
              <p>No hay contactos todavía. ¡Crea el primero!</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    mat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    table { width: 100%; }
  `]
})
export class ContactListComponent {
  // ─────────────────────────────────────────────────────────
  //  Inyección de dependencias
  // ─────────────────────────────────────────────────────────
  //
  // - contactService: para obtener y crear contactos
  // - dialog: para abrir el formulario en un modal
  // - snackBar: para mostrar notificaciones temporales
  // ─────────────────────────────────────────────────────────

  public contactService = inject(ContactService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Columnas a mostrar en la tabla
  public displayedColumns: string[] = ['name', 'email', 'message', 'date'];

  // ─────────────────────────────────────────────────────────
  //  openForm() - Abrir formulario de creación
  // ─────────────────────────────────────────────────────────
  //
  // Abre el componente ContactForm en un dialog/modal.
  //
  // Flujo:
  // 1. Abre el dialog con el formulario
  // 2. Escucha el evento 'save' del formulario
  // 3. Cuando el usuario guarda, llama al servicio para crear el contacto
  // 4. Si éxito, muestra mensaje y cierra el dialog
  // 5. Si error, muestra mensaje de error
  //
  // El servicio contactService automáticamente actualiza la lista
  // después de crear (via tap() en el método create()).
  // ─────────────────────────────────────────────────────────

  openForm(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: '400px'
    });

    // Escuchar el evento 'save' emitido por el formulario
    dialogRef.componentInstance.save.subscribe((formData: Contact) => {
      this.contactService.create(formData).subscribe({
        next: () => {
          this.showMessage('Contacto creado');
          dialogRef.close();
        },
        error: (err) => {
          const msg = err.error?.error || 'Error al crear el contacto';
          this.showMessage(msg);
        }
      });
    });

    // Escuchar el evento 'cancel' para cerrar el dialog
    dialogRef.componentInstance.cancel.subscribe(() => dialogRef.close());
  }

  // ─────────────────────────────────────────────────────────
  //  showMessage() - Mostrar notificación
  // ─────────────────────────────────────────────────────────
  //
  // Usa MatSnackBar de Angular Material para mostrar mensajes
  // temporales (3 segundos) en la parte inferior de la pantalla.
  // ─────────────────────────────────────────────────────────

  private showMessage(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
  }
}
